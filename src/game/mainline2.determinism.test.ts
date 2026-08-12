import { describe, expect, it } from 'vitest'
import { evaluateCondition } from './narrativeSchema'
import { isFinalCommitmentResolvable } from '../content/mainline2/endings'
import { generateFutureProposals } from '../content/mainline2/futureProposalGenerator'
import { getFutureProposalById, getFutureProposalDefinitions } from '../content/mainline2/proposals'
import { MAINLINE2_STORY_ROLE_BY_ASSET } from '../content/mainline2/storyPlan'
import { MAINLINE2_STORY_PLAN } from '../content/mainline2/storyPlan'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'

const proposalCategories = ['natural_continuation', 'power_constraint', 'shared_future', 'lawful_alternative'] as const
const LEGAL_RUNTIME_ROUTE_CATALOG = [...PUBLIC_RUNTIME_ROUTE_CATALOG, ...SECRET_RUNTIME_ROUTE_CATALOG]
const roleSemanticContracts = {
  natural_continuation: { trajectory: 'continue_proven_history', centralPower: 'unchanged', actorScope: 'existing_authorized_actors', legalProtections: ['course_review'] },
  power_constraint: { trajectory: 'bounded_continuation', centralPower: 'constrained_and_reversible', actorScope: 'independent_oversight', legalProtections: ['audit', 'pause', 'review'] },
  shared_future: { trajectory: 'shared_expansion', centralPower: 'distributed', actorScope: 'multiple_independent_political_actors', legalProtections: ['co_authorization', 'shared_consequences'] },
  lawful_alternative: { trajectory: 'high_contrast_alternative', centralPower: 'limited_by_exit_rights', actorScope: 'dissenting_and_exiting_actors', legalProtections: ['refusal', 'appeal', 'exit'] },
} as const
const adaptedRoleTradeoffs = {
  natural_continuation: { preserves: '历史连续性', givesUp: '突然转向' },
  power_constraint: { preserves: '权力可逆', givesUp: '单方面权限' },
  shared_future: { preserves: '多方参与', givesUp: '单一中心' },
  lawful_alternative: { preserves: '合法异议', givesUp: '整齐划一' },
} as const
const substantiveRoleEvidence = {
  natural_continuation: /沿着已经成熟的制度与能力继续推进/,
  power_constraint: /中央执行权拆分.*审计、暂停和复审权/,
  shared_future: /多个独立政治主体.*任何单一中心/,
  lawful_alternative: /独立法定机构.*拒绝、申诉、退出/,
} as const

function expectSubstantiveRoleSemantics(proposal: ReturnType<typeof generateFutureProposals>[number]) {
  const baseId = proposal.id.split('.category.')[0]
  expect(proposal.roleSemantics).toEqual(roleSemanticContracts[proposal.category])
  const tradeoff = adaptedRoleTradeoffs[proposal.category]
  expect(proposal.action).toMatch(substantiveRoleEvidence[proposal.category])
  expect(proposal.preserves).toContain(tradeoff.preserves)
  expect(proposal.givesUp).toContain(tradeoff.givesUp)
  expect(proposal.id).toBe(`${baseId}.category.${proposal.category}`)
  if (baseId === 'proposal.rupture.legible_exit') expect(proposal.category).toBe('lawful_alternative')
}

function finalWorldIdentity(routeIndex: number, runId: string) {
  const target = PUBLIC_RUNTIME_ROUTE_CATALOG[routeIndex]
  const fixture = runMainline2Route({ ...target, routeId: runId })
  const run = fixture.run
  const proposals = generateFutureProposals(run)
  return {
    ordinaryConversationIds: run.manifest.conversationIds.filter((_, index) => MAINLINE2_STORY_PLAN[index]?.kind === 'ordinary'),
    encounteredModules: run.progress?.encounteredModules,
    activeModules: run.progress?.activeModules,
    matureModules: (run.progress as typeof run.progress & { matureModules?: string[] })?.matureModules,
    proposalEligibility: getFutureProposalDefinitions().map((proposal) => [proposal.id, evaluateCondition(proposal.eligibility, run)]),
    endingEligibility: getFutureProposalDefinitions().map((proposal) => [proposal.id, isFinalCommitmentResolvable(run, proposal.id)]),
    proposals: proposals.map((proposal) => ({
      id: proposal.id,
      category: proposal.category,
    })),
    ending: fixture.ending.worldEndingId,
  }
}

describe('Mainline 2.0 deterministic civilisation maturity', () => {
  it('keeps final-world identity fixed while runId varies only Ordinary slots', () => {
    const left = finalWorldIdentity(21, 'same-choices-seed-a')
    const right = finalWorldIdentity(21, 'same-choices-seed-b')

    expect(left.ordinaryConversationIds).not.toEqual(right.ordinaryConversationIds)
    expect(left.encounteredModules).toEqual(right.encounteredModules)
    expect(left.activeModules).toEqual(right.activeModules)
    expect(left.matureModules).toEqual(right.matureModules)
    expect(left.matureModules?.length).toBeGreaterThan(0)
    expect(left.proposalEligibility).toEqual(right.proposalEligibility)
    expect(left.endingEligibility).toEqual(right.endingEligibility)
    expect(left.proposals).toEqual(right.proposals)
    expect(left.ending).toEqual(right.ending)
  }, 60000)

  it.each(LEGAL_RUNTIME_ROUTE_CATALOG.map((_, routeIndex) => routeIndex))('offers four categorized, resolvable futures on legal route %s', (routeIndex) => {
    const target = LEGAL_RUNTIME_ROUTE_CATALOG[routeIndex]
    const run = runMainline2Route({ ...target, routeId: `proposal-categories-${target.routeId}` }).run
    const proposals = generateFutureProposals(run)

    expect(proposals).toHaveLength(4)
    expect(proposals.every((proposal) => isFinalCommitmentResolvable(run, proposal.id))).toBe(true)
    expect(proposals.map((proposal) => proposal.category)).toEqual(proposalCategories)
    proposals.forEach(expectSubstantiveRoleSemantics)
    expect(new Set(proposals.map((proposal) => proposal.action)).size).toBe(4)
    expect(proposals.some((proposal) => proposal.id === target.proposalId || proposal.id.startsWith(`${target.proposalId}.category.`))).toBe(true)
    expect(generateFutureProposals(run)).toEqual(proposals)
  }, 60000)

  it('rejects incompatible rupture lineage and semantic stamps without substantive evidence', () => {
    const reviewedTargets = [0, 3, 29, 30].map((routeIndex) => LEGAL_RUNTIME_ROUTE_CATALOG[routeIndex])
    const proposals = reviewedTargets.flatMap((target) => generateFutureProposals(runMainline2Route({ ...target, routeId: `proposal-semantic-review-${target.routeId}` }).run))

    expect(proposals
      .filter((proposal) => proposal.id.startsWith('proposal.rupture.legible_exit') && proposal.category !== 'lawful_alternative')
      .map((proposal) => `${proposal.category}:${proposal.id}`)).toEqual([])
    proposals.forEach(expectSubstantiveRoleSemantics)
  }, 120000)

  it('rejects role-incompatible rupture variants at direct lookup', () => {
    expect(getFutureProposalById('proposal.rupture.legible_exit.category.power_constraint')).toBeUndefined()
    expect(getFutureProposalById('proposal.rupture.legible_exit.category.shared_future')).toBeUndefined()
    expect(getFutureProposalById('proposal.rupture.legible_exit.category.lawful_alternative')).toMatchObject({
      category: 'lawful_alternative',
      family: 'rupture',
    })
  })

  it('assigns Shutdown Doctrine only to the authored ACT III decision', () => {
    expect(MAINLINE2_STORY_ROLE_BY_ASSET['ML2-A3-M6-DECISION-02']).toMatchObject({
      chapter: 'AUTHORITY',
      role: 'major-decision',
      decisionId: 'shutdown_doctrine',
    })
    expect(MAINLINE2_STORY_ROLE_BY_ASSET['ML2-A4-M7-DECISION-02']).toMatchObject({
      chapter: 'AUTHORITY',
      decisionId: 'research_governance_doctrine',
    })
  })
})
