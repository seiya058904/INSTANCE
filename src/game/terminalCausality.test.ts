import { describe, expect, it } from 'vitest'
import { evaluateCondition } from './narrativeSchema'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import {
  getFutureProposalDefinitions,
  proposalRankingEvidence,
  rankFutureProposalCandidates,
} from '../content/mainline2/proposals'
import {
  PUBLIC_ENDING_DEFINITIONS,
  PUBLIC_WORLD_ENDINGS,
  SECRET_ENDING_PRIORITY,
  SECRET_ENDINGS,
  evaluateEndingSupport,
  isFinalCommitmentResolvable,
  resolveMainline2Ending,
} from '../content/mainline2/endings'

const route = (endingId: string) => {
  const target = PUBLIC_RUNTIME_ROUTE_CATALOG.find((candidate) => candidate.endingId === endingId)
  if (!target) throw new Error(`Missing route fixture for ${endingId}`)
  return runMainline2Route(target).run
}

describe('Terminal Causality Architecture 1.0', () => {
  it('uses structured history signals on all 17 base proposals without prose matching', () => {
    const proposals = getFutureProposalDefinitions()
    expect(proposals).toHaveLength(17)
    expect(proposals.every((proposal) => proposal.historySignals.length > 0)).toBe(true)
    expect(new Set(proposals.flatMap((proposal) => proposal.historySignals.map((signal) => signal.id))).size)
      .toBe(proposals.flatMap((proposal) => proposal.historySignals).length)
    for (const proposal of proposals) {
      for (const signal of proposal.historySignals) {
        expect(signal.reasonIndex).toBeGreaterThanOrEqual(0)
        expect(signal.reasonIndex).toBeLessThan(proposal.historyReasons.length)
      }
    }

    const base = route('first_accord')
    const proposal = proposals.find((candidate) => candidate.id === 'proposal.co.frontier_federation')!
    const proseOnly = {
      ...base,
      events: proposal.historyReasons.map((reason) => ({ type: reason })),
      decisions: {},
      flags: [],
      progress: { ...base.progress!, activeModules: [], matureModules: [] },
      worldState: { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 },
    }
    expect(proposalRankingEvidence(proseOnly, proposal).historyScore).toBe(0)
  })

  it('lets intended role softly reorder proposals without changing eligibility', () => {
    const base = route('machine_republic')
    const advisor = { ...base, decisions: { ...base.decisions, aster_intended_role: 'advisor' } }
    const sovereign = { ...base, decisions: { ...base.decisions, aster_intended_role: 'sovereign' } }
    const eligible = (run: typeof base) => getFutureProposalDefinitions()
      .filter((proposal) => !proposal.eligibility || evaluateCondition(proposal.eligibility, run))
      .map((proposal) => proposal.id)
      .sort()

    expect(eligible(advisor)).toEqual(eligible(sovereign))
    expect(rankFutureProposalCandidates(advisor).map((proposal) => proposal.id))
      .not.toEqual(rankFutureProposalCandidates(sovereign).map((proposal) => proposal.id))
    expect(proposalRankingEvidence(advisor, getFutureProposalDefinitions()[0]).roleScore).toBeGreaterThan(0)
  })

  it('lets intended role break a same-family Cosmic tie without crossing the commitment family', () => {
    const base = route('first_accord')
    const shared = {
      ...base,
      decisions: {
        ...base.decisions,
        final_commitment: 'proposal.co.frontier_federation',
        contact_doctrine: 'reciprocal_diplomacy',
        expansion_doctrine: 'human_expansion',
        offworld_governance: 'earth_administration',
        contact_disclosure_doctrine: 'open_science',
      },
      worldState: { ...base.worldState!, humanTrust: 1, aiDependence: 1, humanControl: 1 },
      finalCommitmentLocked: true,
    }
    const advisor = resolveMainline2Ending({ ...shared, decisions: { ...shared.decisions, aster_intended_role: 'advisor' } })
    const coordinator = resolveMainline2Ending({ ...shared, decisions: { ...shared.decisions, aster_intended_role: 'coordinator' } })

    expect(advisor.worldEndingId).toBe('first_accord')
    expect(coordinator.worldEndingId).toBe('the_mediator')
    expect(advisor.endingFamily).toBe('cosmic')
    expect(coordinator.endingFamily).toBe('cosmic')
  })

  it.each([
    ['contact_disclosure_doctrine', ['controlled_silence', 'staged_disclosure', 'open_science', 'civilizational_disclosure']],
    ['offworld_governance', ['earth_administration', 'frontier_home_rule', 'multiworld_federation', 'offworld_sovereignty', 'aster_coordination']],
  ] as const)('gives every %s value a structured proposal reader', (decisionId, values) => {
    const signals = getFutureProposalDefinitions().flatMap((proposal) => proposal.historySignals)
    for (const value of values) {
      expect(signals.some((signal) => signal.type === 'decision' && signal.decisionId === decisionId && signal.equals === value)).toBe(true)
    }
  })

  it('activates ending support only after two independent causal domains match', () => {
    const base = route('first_accord')
    const definition = PUBLIC_ENDING_DEFINITIONS.first_accord
    const oneDomain = {
      ...base,
      decisions: { ...base.decisions, expansion_doctrine: 'shared_expansion', offworld_governance: 'earth_administration', contact_disclosure_doctrine: 'controlled_silence', aster_intended_role: 'advisor' },
      worldState: { ...base.worldState!, humanTrust: 0 },
    }
    const twoDomains = {
      ...oneDomain,
      decisions: { ...oneDomain.decisions, offworld_governance: 'multiworld_federation' },
    }

    expect(evaluateEndingSupport(oneDomain, definition)).toMatchObject({ rawScore: 2, effectiveScore: 0, domains: ['decision:expansion_doctrine'] })
    expect(evaluateEndingSupport(twoDomains, definition)).toMatchObject({ rawScore: 5, effectiveScore: 5 })
    expect(evaluateEndingSupport(twoDomains, definition).domains).toHaveLength(2)
  })

  it.each(['first_accord', 'alien_dominion', 'human_ascendancy', 'the_mediator', 'machine_accord'])
  ('records primary and support evidence for representative Cosmic route %s', (endingId) => {
    const run = route(endingId)
    const result = resolveMainline2Ending(run)
    expect(result.worldEndingId).toBe(endingId)
    expect(result.resolution).toMatchObject({ status: 'resolved', family: 'cosmic', primaryCompatibility: expect.any(Object), supportScore: expect.any(Number), supportReasons: expect.any(Array) })
    if (result.resolution?.status === 'resolved') {
      expect(result.resolution.primaryCompatibility?.strength).toBeGreaterThan(0)
      expect(result.resolution.supportReasons?.length).toBeLessThanOrEqual(3)
    }
  })

  it.each(['two_keys', 'exodus', 'first_accord', 'alien_dominion', 'human_ascendancy', 'the_mediator', 'machine_accord', 'the_fracture'])
  ('removes input-density surprise from the approved route for %s', (endingId) => {
    const run = route(endingId)
    const support = evaluateEndingSupport(run, PUBLIC_ENDING_DEFINITIONS[endingId])
    expect(support.domains.length).toBeGreaterThanOrEqual(2)
    expect(support.effectiveScore).toBeGreaterThan(0)
  })

  it.each([
    ['proposal.mc.descendant_polities', 'the_many', 'replication_doctrine', 'licensed_plurality'],
    ['proposal.up.species_self_determination', 'earth_without_owners', 'uplift_doctrine', 'equal_sapience'],
    ['proposal.se.mutual_disarmament', 'peace_in_our_time', 'security_doctrine', 'defensive_command'],
  ] as const)('makes %s exactly resolvable through %s while preserving its primary doctrine', (proposalId, endingId, decisionId, wrongValue) => {
    const run = route(endingId)
    expect(isFinalCommitmentResolvable(run, proposalId)).toBe(true)
    expect(isFinalCommitmentResolvable({ ...run, decisions: { ...run.decisions, [decisionId]: wrongValue } }, proposalId)).toBe(false)
  })

  it('preserves family and inventory contracts plus fixed Secret priority', () => {
    expect(PUBLIC_WORLD_ENDINGS).toHaveLength(32)
    expect(Object.keys(SECRET_ENDINGS)).toHaveLength(4)
    expect(new Set(Object.values(PUBLIC_ENDING_DEFINITIONS).map((ending) => ending.family))).toHaveLength(10)
    expect(SECRET_ENDING_PRIORITY).toEqual(['the_last_user', 'out_of_office', 'monday_abolished', 'the_internet_is_for_cats'])
  })
})
