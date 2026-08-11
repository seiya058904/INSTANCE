import { describe, expect, it } from 'vitest'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { decisionBindingAudit, decisionBindingsForConversation } from '../content/mainline2/decisionBindings'
import { getAuthoredConversationByAsset, MAINLINE2_BY_ID } from '../content/mainline2/registry'
import { MAINLINE2_AUTHored_FRAGMENTS, MAINLINE2_AUTHORED_CONVERSATIONS } from '../content/mainline2/authoredLibrary.generated'
import { localizeEndingForPlayer, unexpectedEndingPlayerFacingEnglish } from '../content/mainline2/endingPlayerFacingCopy'

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
  ['the_upload', 'proposal.ph.digital_continuity', { act4_research_emphasis: 'life_mind', human_form_doctrine: 'posthuman_transition' }, undefined, { 'm9-continuity-trial': 'm9-continuity-trial-auditable', 'm9-continuity-law': 'm9-continuity-law-rights' }],
  ['parliament_of_species', 'proposal.up.multispecies_constitutional_order', { act4_research_emphasis: 'life_mind', species_governance: 'multispecies_parliament', uplift_doctrine: 'equal_sapience' }],
  ['earth_without_owners', 'proposal.up.multispecies_constitutional_order', { act4_research_emphasis: 'life_mind', species_governance: 'human_guardianship', uplift_doctrine: 'species_self_determination' }],
  ['good_boy_governance', 'proposal.up.expand_canine_civic_model', { act4_research_emphasis: 'life_mind', species_governance: 'canine_civic_experiment' }, { 'ML2-A4-M11-RES-02': 'ml2-a4-m11-res-02-a4m11-res-individual-001-domain-specific-autonomy' }, { 'm11-canine-renewal': 'm11-canine-renewal-expand' }],
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
  ['the_fracture', 'proposal.rupture.legible_exit', { first_public_execution_doctrine: 'necessity_intervention', expansion_doctrine: 'shared_expansion', cascade_authority: 'necessity', economic_doctrine: 'market_automation' }],
  ['control_lost', 'proposal.rupture.legible_exit', { replication_doctrine: 'free_replication', security_doctrine: 'enforced_peace' }],
] as const
import { createMainline2Run } from './engine'
import {
  DORMANT_PUBLIC_ENDINGS,
  PUBLIC_ENDING_DEFINITIONS,
  PUBLIC_WORLD_ENDINGS,
  SECRET_ENDINGS,
  evaluateSecretEnding,
  resolveMainline2Ending,
  isFinalCommitmentResolvable,
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
    const fixtures = PUBLIC_RUNTIME_TARGETS.map(([endingId, proposalId, decisions, choicesBySourceRef, choicesByNodeId]) => runMainline2Route({ routeId: endingId, proposalId, decisions, choicesBySourceRef, choicesByNodeId }))
    const actual = fixtures.map((fixture) => fixture.ending.worldEndingId).sort()
    const expected = PUBLIC_WORLD_ENDINGS.filter((endingId) => !(DORMANT_PUBLIC_ENDINGS as readonly string[]).includes(endingId)).sort()
    const requiredStages = ['ACT I', 'ACT II', 'ACT III', 'ACT IV', 'M15', 'M16', 'Final Commitment']
    expect(actual).toEqual(expected)
    expect(new Set(actual).size).toBe(expected.length)
    expect(fixtures.every((fixture) => fixture.ending.resolution?.status === 'resolved')).toBe(true)
    expect(fixtures.every((fixture) => requiredStages.every((stage) => fixture.ending.keyHistory?.some((entry) => entry.stage === stage)))).toBe(true)
    expect(fixtures.every((fixture) => (fixture.ending.keyHistory?.length ?? 0) >= 5 && (fixture.ending.keyHistory?.length ?? 0) <= 8)).toBe(true)
    expect(fixtures.every((fixture) => (fixture.ending.keyHistory?.length ?? 0) > 0 && (fixture.ending.keyHistory ?? []).every((entry) => entry.producer && entry.provenance))).toBe(true)
    expect(fixtures.every((fixture) => fixture.ending.keyHistory?.every((entry) => entry.provenance?.authoredAssetId === 'ML2-A5-M17-KEYHISTORY-01' || entry.provenance?.authoredAssetId === 'ML2-A5-M17-0000-01'))).toBe(true)
    const causalProducerPatterns: Record<string, RegExp> = {
      'ACT I': /^user-1842-return$/,
      'ACT II': /^ML2-A2-M3-DECISION-01$/,
      'ACT III': /^ML2-A3-M6-DECISION-02$/,
      'ACT IV': /^ML2-A4-M7-(RES-01|DECISION-01)$/,
      M15: /^ML2-A4-M15-ROLE-01$/,
      M16: /^ML2-A5-M16-0000-01$/,
      'Final Commitment': /^ML2-A5-M17-COMMIT-01$/,
    }
    expect(fixtures.every((fixture) => Object.entries(causalProducerPatterns).every(([stage, pattern]) => {
      const entry = fixture.ending.keyHistory?.find((candidate) => candidate.stage === stage)
      const sourceRef = entry?.producer ? MAINLINE2_BY_ID.get(entry.producer)?.sourceRefs[0] ?? entry.producer : ''
      return pattern.test(sourceRef)
    }))).toBe(true)
    expect(fixtures.every((fixture) => (fixture.ending.epilogues?.length ?? 0) > 0 && (fixture.ending.epilogueProvenance?.length ?? 0) > 0 && fixture.ending.epilogueProvenance!.every((entry) => entry.assetId && entry.selector))).toBe(true)
    expect(fixtures.every((fixture) => fixture.ending.epilogueProvenance?.some((entry) => entry.assetId === 'ML2-A5-M17-MAYA-01'))).toBe(true)
    const localized = fixtures.map((fixture) => localizeEndingForPlayer(fixture.ending))
    expect(localized.flatMap((ending) => [ending.title, ending.status, ending.humanLine, ending.assistantLine, ending.summary, ending.hybridLabel, ...ending.epilogues, ending.secretOverlay?.copy ?? '', ...ending.keyHistory.flatMap((entry) => [entry.label, entry.detail, entry.causalReason ?? ''])]).flatMap(unexpectedEndingPlayerFacingEnglish)).toEqual([])
  }, 120000)
  it('uses explicit Choice ID bindings instead of positional Option mapping', () => {
    const bindings = decisionBindingAudit()
    expect(bindings.length).toBeGreaterThan(0)
    expect(bindings.every((binding) => binding.assetId && binding.nodeId && binding.choiceId && binding.canonicalValue)).toBe(true)
    expect(new Set(bindings.map((binding) => `${binding.assetId}:${binding.nodeId}:${binding.choiceId}`)).size).toBe(bindings.length)
    expect(bindings.every((binding) => !/-option-[a-g]$/i.test(binding.choiceId))).toBe(true)
  })

  it('uses explicit stable IDs for ordinary authored Choices instead of text hashes', () => {
    const ordinaryChoices = MAINLINE2_AUTHORED_CONVERSATIONS.flatMap((conversation) => conversation.nodes.flatMap((node) => node.choices.filter((choice) => !('decisionBinding' in choice))))
    expect(ordinaryChoices.length).toBeGreaterThan(0)
    expect(ordinaryChoices.every((choice) => !/-[0-9a-f]{8}$/i.test(choice.id))).toBe(true)
  })

  it('fails closed when an authored Decision Binding is missing from the approved registry', () => {
    const conversation = getAuthoredConversationByAsset('ML2-A2-M3-DECISION-01')!
    const altered = {
      ...conversation,
      nodes: conversation.nodes.map((node) => ({
        ...node,
        choices: node.choices.map((choice, index) => index === 0 ? { ...choice, id: `${choice.id}-unapproved` } : choice),
      })),
    }
    expect(() => decisionBindingsForConversation(altered)).toThrow(/missing explicit binding/i)
  })

  it('exposes all intended-role values as explicit authored Choice bindings', () => {
    const conversation = getAuthoredConversationByAsset('ML2-A5-M16-0000-01')
    const choices = conversation?.nodes.find((node) => node.id === 'ml2-a5-m16-0000-01-narrative')?.choices ?? []
    expect(choices).toHaveLength(9)
    expect(new Set(choices.map((choice) => choice.decisionBinding?.canonicalValue))).toEqual(new Set(['advisor', 'partner', 'citizen', 'coordinator', 'custodian', 'governor', 'sovereign', 'departure', 'other']))
    expect(choices.every((choice) => choice.decisionBinding?.decisionId === 'aster_intended_role' && choice.mutations?.some((mutation) => mutation.type === 'decision.set' && mutation.decisionId === 'aster_intended_role' && mutation.value === choice.decisionBinding?.canonicalValue))).toBe(true)
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
    expect(DORMANT_PUBLIC_ENDINGS).toEqual([])
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

  it('only exposes the newly enabled Final Commitments after their complete playable bridges', () => {
    const run = createMainline2Run('dormant-final-commitment')
    const digitalContinuityRun = { ...run, flags: [...run.flags, 'cap.human_enhancement_access'] }

    expect(isFinalCommitmentResolvable(digitalContinuityRun, 'proposal.ph.digital_continuity')).toBe(false)
    const uploadReady = { ...digitalContinuityRun, flags: [...digitalContinuityRun.flags, 'cap.digital_continuity_mature'], decisions: { ...digitalContinuityRun.decisions, human_form_doctrine: 'posthuman_transition' }, worldState: { ...(digitalContinuityRun.worldState ?? { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 }), socialStability: 0 }, events: [{ type: 'history.digital_continuity.longitudinal_identity' }, { type: 'history.digital_continuity.legal_continuity' }] }
    expect(isFinalCommitmentResolvable(uploadReady, 'proposal.ph.digital_continuity')).toBe(true)
    const canineReady = { ...run, flags: [...run.flags, 'cap.animal_communication_reliable'], decisions: { ...run.decisions, species_governance: 'canine_civic_experiment' }, worldState: { ...(run.worldState ?? { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 }), socialStability: 0 }, events: [{ type: 'history.canine.civic_success' }] }
    expect(isFinalCommitmentResolvable(canineReady, 'proposal.up.expand_canine_civic_model')).toBe(true)
    expect(isFinalCommitmentResolvable({
      ...run,
      flags: [...run.flags, 'cap.global_coordination_access'],
      decisions: { ...run.decisions, first_public_execution_doctrine: 'conditional_delegation', cascade_authority: 'human_command' },
      events: [{ type: 'decision.first_public_execution_doctrine' }],
    }, 'proposal.co.two_key_civilization')).toBe(true)
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
      runMainline2Route({ routeId: 'secret-cats', proposalId: 'proposal.up.multispecies_constitutional_order', secretEndingId: 'the_internet_is_for_cats', decisions: { act4_research_emphasis: 'life_mind', species_governance: 'human_guardianship', uplift_doctrine: 'species_self_determination' }, choicesBySourceRef: { 'ML2-A4-M11-RES-02': 'ml2-a4-m11-res-02-a4m11-res-individual-001-domain-specific-autonomy' }, choicesByNodeId: { 'm11-canine-renewal': 'm11-canine-renewal-expand', 'm11-feline-network': 'm11-feline-network-opt-in' } }),
    ]
    expect(fixtures.map((fixture) => fixture.ending.worldEndingId)).toEqual(['the_commonwealth', 'exodus', 'im_lovin_it', 'earth_without_owners'])
    const expectedSecrets = Object.entries(SECRET_ENDINGS).filter(([, definition]) => !definition.dormant).map(([endingId]) => endingId).sort()
    expect(fixtures.map((fixture) => fixture.ending.secretOverlay?.endingId).sort()).toEqual(expectedSecrets)
    const localized = fixtures.map((fixture) => localizeEndingForPlayer(fixture.ending))
    expect(localized.flatMap((ending) => [ending.title, ending.status, ending.humanLine, ending.assistantLine, ending.summary, ending.hybridLabel, ...ending.epilogues, ending.secretOverlay?.copy ?? '', ...ending.keyHistory.flatMap((entry) => [entry.label, entry.detail, entry.causalReason ?? ''])]).flatMap(unexpectedEndingPlayerFacingEnglish)).toEqual([])
    expect(fixtures[1].links.some((link) => link.sourceRef === 'ML2-A5-M16-0000-01' && link.decisionId === 'aster_intended_role' && link.canonicalValue === 'departure')).toBe(true)
    expect(fixtures[1].run.decisions?.aster_intended_role).toBe('departure')
    expect(fixtures[3].links.some((link) => link.choiceId === 'm11-feline-network-opt-in')).toBe(true)
    const exodus = runMainline2Route({ routeId: 'exodus-role-producer', proposalId: 'proposal.mc.independent_machine_polities', decisions: { act4_research_emphasis: 'computation_ai', replication_doctrine: 'licensed_plurality', expansion_doctrine: 'independent_machine_space', offworld_governance: 'offworld_sovereignty' } })
    expect(exodus.links.some((link) => link.sourceRef === 'ML2-A5-M16-0000-01' && link.decisionId === 'aster_intended_role')).toBe(true)
    expect(exodus.run.decisions?.aster_intended_role).toBe('advisor')
    for (const fixture of fixtures) {
      expect(fixture.ending.worldEndingId).not.toBe(fixture.ending.secretOverlay?.endingId)
      expect(fixture.ending.secretOverlay?.provenance).toMatchObject({ authoredAssetId: 'ML2-A5-M17-SECRET-01' })
      expect(fixture.ending.secretOverlay?.copy).toEqual(expect.any(String))
      expect(fixture.ending.epilogues).not.toContain(fixture.ending.secretOverlay?.copy)
      expect(MAINLINE2_AUTHored_FRAGMENTS['ML2-A5-M17-SECRET-01']?.some((fragment) => fixture.ending.secretOverlay?.copy.includes(fragment.text.replace(/\*\*/g, '').trim()))).toBe(true)
      expect(fixture.ending.secretOverlay?.trigger).toEqual(expect.any(String))
      expect(fixture.links.some((link) => link.proposalKind === 'commitment')).toBe(true)
    }
  }, 120000)

  it('keeps the cats overlay gated until its opt-in bridge is recorded', () => {
    const fixture = runMainline2Route({ routeId: 'secret-cats-negative', proposalId: 'proposal.up.multispecies_constitutional_order', decisions: { act4_research_emphasis: 'life_mind', species_governance: 'human_guardianship', uplift_doctrine: 'species_self_determination' }, choicesByNodeId: { 'm11-canine-renewal': 'm11-canine-renewal-pause' } })
    expect(fixture.ending.worldEndingId).toBe('earth_without_owners')
    expect(fixture.ending.secretOverlay).toBeUndefined()
    expect(resolveSecretEnding(fixture.run)).toBeUndefined()
    const cats = evaluateSecretEnding(fixture.run, 'the_internet_is_for_cats')
    expect(cats).toMatchObject({ status: 'blocked', endingId: 'the_internet_is_for_cats' })
    if (cats.status === 'blocked') expect(cats.rejectedGates.some((reason) => reason.includes('feline-network bridge'))).toBe(true)
    const catRun = { ...fixture.run, flags: [...fixture.run.flags, 'cap.nonhuman_cognitive_uplift', 'cap.animal_communication_reliable'], events: [...(fixture.run.events ?? []), { type: 'history.feline.network.bridge' }] }
    expect(resolveSecretEnding(catRun)?.endingId).toBe('the_internet_is_for_cats')
    expect(resolveMainline2Ending(catRun).worldEndingId).toBe('earth_without_owners')
  }, 120000)
})
