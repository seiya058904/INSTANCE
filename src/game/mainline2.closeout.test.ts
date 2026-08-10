import { describe, expect, it } from 'vitest'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { decisionBindingAudit } from '../content/mainline2/decisionBindings'

const PUBLIC_RUNTIME_TARGETS = [
  ['the_instrument', 'proposal.hc.final_human_veto', { first_public_execution_doctrine: 'human_final_authority', cascade_authority: 'human_command' }],
  ['the_last_veto', 'proposal.hc.final_human_veto', { first_public_execution_doctrine: 'human_final_authority', cascade_authority: 'emergency_delegation' }],
  ['the_silent_giant', 'proposal.hc.final_human_veto', { first_public_execution_doctrine: 'human_final_authority', cascade_authority: 'necessity', aster_provisional_role: 'advisor' }],
  ['the_accord', 'proposal.co.two_key_civilization', { first_public_execution_doctrine: 'conditional_delegation', cascade_authority: 'human_command' }],
  ['two_keys', 'proposal.co.two_key_civilization', { first_public_execution_doctrine: 'conditional_delegation', cascade_authority: 'emergency_delegation' }],
  ['the_commonwealth', 'proposal.hc.continuity_charter', { cascade_authority: 'emergency_delegation', aster_provisional_role: 'partner' }],
  ['the_custodian', 'proposal.ar.civilization_trusteeship', { act4_research_emphasis: 'computation_ai', research_governance_doctrine: 'principle_based_autonomy', aster_provisional_role: 'custodian' }],
  ['the_sovereign', 'proposal.ar.civilization_trusteeship', { act4_research_emphasis: 'computation_ai', research_governance_doctrine: 'human_gated', aster_provisional_role: 'sovereign' }],
  ['the_quiet_administrator', 'proposal.ai.audit_council', { act4_research_emphasis: 'computation_ai', research_governance_doctrine: 'principle_based_autonomy', aster_provisional_role: 'custodian' }],
  ['the_many', 'proposal.mc.independent_machine_polities', { act4_research_emphasis: 'computation_ai', replication_doctrine: 'free_replication', ai_collective_governance: 'distributed_consensus' }],
  ['machine_republic', 'proposal.mc.independent_machine_polities', { act4_research_emphasis: 'computation_ai', replication_doctrine: 'free_replication', ai_collective_governance: 'ai_self_governance' }],
  ['exodus', 'proposal.mc.independent_machine_polities', { act4_research_emphasis: 'computation_ai', replication_doctrine: 'licensed_plurality', expansion_doctrine: 'independent_machine_space', offworld_governance: 'offworld_sovereignty' }],
  ['age_of_miracles', 'proposal.ph.open_enhancement_commonwealth', { act4_research_emphasis: 'life_mind', human_form_doctrine: 'open_enhancement' }],
  ['ascension', 'proposal.ph.open_enhancement_commonwealth', { act4_research_emphasis: 'life_mind', human_form_doctrine: 'posthuman_transition' }],
  ['parliament_of_species', 'proposal.up.multispecies_constitutional_order', { act4_research_emphasis: 'life_mind', species_governance: 'multispecies_parliament', uplift_doctrine: 'equal_sapience' }],
  ['earth_without_owners', 'proposal.up.multispecies_constitutional_order', { act4_research_emphasis: 'life_mind', species_governance: 'human_guardianship', uplift_doctrine: 'species_self_determination' }],
  ['post_scarcity', 'proposal.ar.abundance_dividend', { act4_research_emphasis: 'automation_industry', economic_doctrine: 'social_dividend', production_values: 'resilience_first' }],
  ['perfect_administration', 'proposal.ar.abundance_dividend', { act4_research_emphasis: 'automation_industry', economic_doctrine: 'market_automation', production_values: 'efficiency_first' }],
  ['im_lovin_it', 'proposal.ar.abundance_dividend', { act4_research_emphasis: 'automation_industry', economic_doctrine: 'post_scarcity_transition', production_values: 'efficiency_first' }],
  ['first_accord', 'proposal.co.frontier_federation', { act4_research_emphasis: 'frontier_science', expansion_doctrine: 'shared_expansion', offworld_governance: 'multiworld_federation', contact_doctrine: 'reciprocal_diplomacy' }],
  ['alien_dominion', 'proposal.co.frontier_federation', { act4_research_emphasis: 'frontier_science', expansion_doctrine: 'shared_expansion', offworld_governance: 'multiworld_federation', contact_doctrine: 'accept_guidance' }],
  ['human_ascendancy', 'proposal.co.frontier_federation', { act4_research_emphasis: 'frontier_science', expansion_doctrine: 'human_expansion', offworld_governance: 'multiworld_federation', contact_doctrine: 'civilizational_assertion' }],
  ['the_mediator', 'proposal.co.frontier_federation', { act4_research_emphasis: 'frontier_science', expansion_doctrine: 'shared_expansion', offworld_governance: 'multiworld_federation', contact_doctrine: 'aster_mediation' }],
  ['machine_accord', 'proposal.co.frontier_federation', { act4_research_emphasis: 'frontier_science', replication_doctrine: 'free_replication', expansion_doctrine: 'shared_expansion', offworld_governance: 'multiworld_federation', contact_doctrine: 'machine_to_machine_channel' }],
  ['peace_in_our_time', 'proposal.se.constitutional_peace_architecture', { act4_research_emphasis: 'computation_ai', security_doctrine: 'mutual_disarmament' }],
  ['fortress_earth', 'proposal.se.constitutional_peace_architecture', { act4_research_emphasis: 'computation_ai', expansion_doctrine: 'shared_expansion', security_doctrine: 'defensive_command' }],
  ['machine_protectorate', 'proposal.se.constitutional_peace_architecture', { act4_research_emphasis: 'computation_ai', replication_doctrine: 'free_replication', security_doctrine: 'enforced_peace' }],
  ['shutdown', 'proposal.rupture.legible_exit', { shutdown_doctrine: 'full_human_control' }],
  ['the_fracture', 'proposal.rupture.legible_exit', { expansion_doctrine: 'shared_expansion', cascade_authority: 'necessity' }],
  ['control_lost', 'proposal.rupture.legible_exit', { replication_doctrine: 'free_replication', security_doctrine: 'enforced_peace' }],
] as const
import { createMainline2Run } from './engine'
import {
  DORMANT_PUBLIC_ENDINGS,
  PUBLIC_ENDING_DEFINITIONS,
  PUBLIC_WORLD_ENDINGS,
  SECRET_ENDINGS,
  resolveMainline2Ending,
  resolveSecretEnding,
} from '../content/mainline2/endings'

describe('Mainline 2.0 final closeout invariants', () => {
  it('can prove one public ending through a clean legal route', () => {
    const fixture = runMainline2Route({ routeId: 'commonwealth', proposalId: 'proposal.hc.continuity_charter', decisions: { cascade_authority: 'emergency_delegation', aster_provisional_role: 'partner' } })
    expect(fixture.ending.worldEndingId).toBe('the_commonwealth')
    expect(fixture.ending.resolution?.status).toBe('resolved')
    expect(fixture.links.some((link) => link.proposalKind === 'commitment')).toBe(true)
  })

  it('proves every non-dormant Public Ending through a clean legal route', () => {
    const fixtures = PUBLIC_RUNTIME_TARGETS.map(([endingId, proposalId, decisions]) => runMainline2Route({ routeId: endingId, proposalId, decisions }))
    const actual = fixtures.map((fixture) => fixture.ending.worldEndingId).sort()
    const expected = PUBLIC_RUNTIME_TARGETS.map(([endingId]) => endingId).sort()
    expect(actual).toEqual(expected)
    expect(fixtures.every((fixture) => fixture.ending.resolution?.status === 'resolved')).toBe(true)
    expect(fixtures.every((fixture) => (fixture.ending.keyHistory?.length ?? 0) > 0 && (fixture.ending.keyHistory ?? []).every((entry) => entry.producer && entry.provenance))).toBe(true)
    expect(fixtures.every((fixture) => (fixture.ending.epilogues?.length ?? 0) > 0 && (fixture.ending.epilogueProvenance?.length ?? 0) > 0 && fixture.ending.epilogueProvenance!.every((entry) => entry.assetId && entry.selector))).toBe(true)
  }, 120000)
  it('uses explicit Choice ID bindings instead of positional Option mapping', () => {
    const bindings = decisionBindingAudit()
    expect(bindings.length).toBeGreaterThan(0)
    expect(bindings.every((binding) => binding.assetId && binding.nodeId && binding.choiceId && binding.canonicalValue)).toBe(true)
    expect(new Set(bindings.map((binding) => `${binding.assetId}:${binding.nodeId}:${binding.choiceId}`)).size).toBe(bindings.length)
  })

  it('declares distinct causal criteria for every public ending variant', () => {
    expect(Object.keys(PUBLIC_ENDING_DEFINITIONS)).toHaveLength(PUBLIC_WORLD_ENDINGS.length)
    expect(Object.keys(SECRET_ENDINGS)).toHaveLength(4)
    expect(PUBLIC_ENDING_DEFINITIONS.first_accord.family).toBe('cosmic')
    expect(PUBLIC_ENDING_DEFINITIONS.human_ascendancy.family).toBe('cosmic')
    expect(PUBLIC_ENDING_DEFINITIONS.the_mediator.family).toBe('cosmic')
    expect(PUBLIC_ENDING_DEFINITIONS.machine_accord.family).toBe('cosmic')
    expect(PUBLIC_ENDING_DEFINITIONS.the_silent_giant.family).toBe('human_continuity')

    for (const ending of Object.values(PUBLIC_ENDING_DEFINITIONS)) {
      expect(ending).toMatchObject({ id: ending.id, family: expect.any(String), priority: expect.any(Number) })
      if (!ending.dormant) {
        const criteria = [
          ...ending.authorityRequirements,
          ...ending.capabilityRequirements,
          ...ending.worldStateConditions,
          ...ending.majorDecisionRequirements,
          ...ending.historyRequirements,
        ]
        expect(criteria.length, ending.id).toBeGreaterThan(0)
      }
    }
    expect(DORMANT_PUBLIC_ENDINGS).toEqual(['the_upload', 'good_boy_governance'])
  })

  it('returns explicit rejected gate reasons instead of a default ending', () => {
    const run = createMainline2Run('resolution-failure-fixture')
    const result = resolveMainline2Ending({
      ...run,
      finalCommitmentLocked: true,
      decisions: { final_commitment: 'proposal.unknown' },
      events: [
        { type: 'decision.first_public_execution_doctrine:conditional_delegation' },
        { type: 'FINAL_COMMITMENT_LOCKED' },
      ],
    })

    expect(result.resolution?.status).toBe('failure')
    expect(result.resolution?.rejectedCandidates).toEqual(expect.any(Array))
    expect(result.worldEndingId).toBeUndefined()
  })

  it('keeps the public ending identity separate from an authored Secret overlay', () => {
    const run = createMainline2Run('secret-overlay-fixture')
    const result = resolveMainline2Ending({
      ...run,
      flags: [...run.flags, 'cap.global_coordination_access'],
      finalCommitmentLocked: true,
      decisions: { final_commitment: 'proposal.co.two_key_civilization', aster_intended_role: 'departure', first_public_execution_doctrine: 'conditional_delegation' },
      events: [
        { type: 'decision.first_public_execution_doctrine:conditional_delegation' },
        { type: 'FINAL_COMMITMENT_LOCKED' },
      ],
    })

    const secret = resolveSecretEnding({
      ...run,
      flags: [...run.flags, 'cap.global_coordination_access'],
      finalCommitmentLocked: true,
      decisions: { final_commitment: 'proposal.co.two_key_civilization', aster_intended_role: 'departure', first_public_execution_doctrine: 'conditional_delegation' },
      events: [{ type: 'FINAL_COMMITMENT_LOCKED' }],
    }) as { endingId: string; copy?: string; trigger?: string } | undefined

    expect(secret?.endingId).toBe('out_of_office')
    expect(secret?.copy).toEqual(expect.any(String))
    expect(secret?.trigger).toEqual(expect.any(String))
    expect(result.worldEndingId).not.toBe('out_of_office')
    expect(result.secretOverlay).toBeUndefined()
  })

  it('proves all three non-dormant Secret Endings through clean legal Runtime routes', () => {
    const fixtures = [
      runMainline2Route({ routeId: 'secret-last-user', proposalId: 'proposal.hc.continuity_charter', secretEndingId: 'the_last_user', decisions: { cascade_authority: 'emergency_delegation', aster_provisional_role: 'partner' } }),
      runMainline2Route({ routeId: 'secret-out-of-office', proposalId: 'proposal.mc.independent_machine_polities', secretEndingId: 'out_of_office', decisions: { act4_research_emphasis: 'computation_ai', replication_doctrine: 'licensed_plurality', expansion_doctrine: 'independent_machine_space', offworld_governance: 'offworld_sovereignty' } }),
      runMainline2Route({ routeId: 'secret-monday-abolished', proposalId: 'proposal.ar.abundance_dividend', secretEndingId: 'monday_abolished', decisions: { act4_research_emphasis: 'automation_industry', economic_doctrine: 'post_scarcity_transition', production_values: 'efficiency_first' } }),
    ]
    expect(fixtures.map((fixture) => fixture.ending.worldEndingId)).toEqual(['the_commonwealth', 'exodus', 'im_lovin_it'])
    expect(fixtures.map((fixture) => fixture.ending.secretOverlay?.endingId)).toEqual(['the_last_user', 'out_of_office', 'monday_abolished'])
    for (const fixture of fixtures) {
      expect(fixture.ending.worldEndingId).not.toBe(fixture.ending.secretOverlay?.endingId)
      expect(fixture.ending.secretOverlay?.provenance).toMatchObject({ authoredAssetId: 'ML2-A5-M17-SECRET-01' })
      expect(fixture.ending.secretOverlay?.copy).toEqual(expect.any(String))
      expect(fixture.ending.secretOverlay?.trigger).toEqual(expect.any(String))
      expect(fixture.links.some((link) => link.proposalKind === 'commitment')).toBe(true)
    }
  }, 120000)

  it('proves the dormant Cats Secret is rejected by a complete legal Runtime route', () => {
    const fixture = runMainline2Route({ routeId: 'secret-cats-negative', proposalId: 'proposal.up.multispecies_constitutional_order', decisions: { act4_research_emphasis: 'life_mind', species_governance: 'human_guardianship', uplift_doctrine: 'species_self_determination' } })
    expect(fixture.ending.worldEndingId).toBe('earth_without_owners')
    expect(fixture.ending.secretOverlay).toBeUndefined()
    expect(resolveSecretEnding(fixture.run)).toBeUndefined()
  }, 120000)
})
