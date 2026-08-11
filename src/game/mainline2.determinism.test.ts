import { describe, expect, it } from 'vitest'
import { evaluateCondition } from './narrativeSchema'
import { isFinalCommitmentResolvable } from '../content/mainline2/endings'
import { generateFutureProposals } from '../content/mainline2/futureProposalGenerator'
import { getFutureProposalDefinitions } from '../content/mainline2/proposals'
import { MAINLINE2_STORY_ROLE_BY_ASSET } from '../content/mainline2/storyPlan'
import { MAINLINE2_STORY_PLAN } from '../content/mainline2/storyPlan'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'

const proposalCategories = ['natural_continuation', 'power_constraint', 'shared_future', 'lawful_alternative'] as const
const LEGAL_RUNTIME_ROUTE_CATALOG = [...PUBLIC_RUNTIME_ROUTE_CATALOG, ...SECRET_RUNTIME_ROUTE_CATALOG]

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
    expect(new Set(proposals.map((proposal) => proposal.action)).size).toBe(4)
    expect(proposals.some((proposal) => proposal.id === target.proposalId)).toBe(true)
    expect(generateFutureProposals(run)).toEqual(proposals)
  }, 60000)

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
