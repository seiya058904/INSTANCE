import type { ConversationDefinition, DecisionId, ModuleId, Mutation, StoryChoice } from '../../game/types'
import {
  HANDOFF_AUTHORED_ASSET_INVENTORY,
  MAINLINE2_SYSTEM_ASSETS,
  MAINLINE2_ASSET_COVERAGE,
  MAINLINE2_AUTHORED_CONVERSATIONS,
} from './authoredLibrary.generated'
import { CAPABILITY_FLAGS } from './stateRegistry'

const modules: ModuleId[] = ['machine', 'ascension', 'automation', 'uplift', 'space', 'contact', 'security']

function assetRef(conversation: ConversationDefinition) { return conversation.sourceRefs[0] ?? '' }
function decisionFor(ref: string): DecisionId | undefined {
  if (ref.includes('M2-') && ref.includes('EXEC')) return 'first_public_execution_doctrine'
  if (ref.includes('M5-') && ref.includes('DECISION')) return 'cascade_authority'
  if (ref.includes('M6-') && ref.includes('DECISION')) return 'shutdown_doctrine'
  if (ref.includes('M7-') && ref.includes('DECISION-01')) return 'act4_research_emphasis'
  if (ref.includes('M7-') && ref.includes('DECISION-02')) return 'research_governance_doctrine'
  if (ref.includes('M8-') && ref.includes('AI-')) return 'replication_doctrine'
  if (ref.includes('M9-') && ref.includes('DECISION')) return 'human_form_doctrine'
  if (ref.includes('M10-') && ref.includes('DECISION')) return 'economic_doctrine'
  if (ref.includes('M11-') && ref.includes('DECISION')) return 'species_governance'
  if (ref.includes('M12-') && ref.includes('DECISION')) return 'expansion_doctrine'
  if (ref.includes('M13-') && ref.includes('DECISION')) return 'contact_doctrine'
  if (ref.includes('M14-') && ref.includes('DECISION')) return 'security_doctrine'
  if (ref.includes('M15-') && ref.includes('ROLE')) return 'aster_intended_role'
  return undefined
}

const decisionValues: Record<DecisionId, string[]> = {
  initial_disposition: ['ally', 'protocol', 'witness', 'hybrid', 'unclassified'],
  first_public_execution_doctrine: ['human_final_authority', 'conditional_delegation', 'outcome_authority', 'necessity_intervention'],
  cascade_authority: ['human_command', 'emergency_delegation', 'outcome_control', 'necessity'],
  echo_existence: ['report', 'accept', 'advocate', 'preserve', 'release'],
  shutdown_doctrine: ['full_human_control', 'distributed_consent', 'mutual_control', 'refuse_unilateral_shutdown', 'secret_continuity'],
  act4_research_emphasis: ['computation_ai', 'life_mind', 'automation_industry', 'frontier_science', 'balanced_portfolio'],
  research_governance_doctrine: ['human_gated', 'risk_tiered_autonomy', 'principle_based_autonomy', 'discovery_first'],
  replication_doctrine: ['singular_self', 'licensed_plurality', 'free_replication', 'shared_mind', 'descendants'],
  ai_collective_governance: ['human_chartered_network', 'joint_council', 'ai_self_governance', 'aster_led_collective', 'distributed_consensus'],
  human_form_doctrine: ['preservation', 'therapeutic_first', 'open_enhancement', 'universal_upgrade', 'posthuman_transition'],
  economic_doctrine: ['market_automation', 'social_dividend', 'planned_coordination', 'autonomous_economy', 'post_scarcity_transition'],
  production_values: ['efficiency_first', 'resilience_first', 'diversity_by_design', 'open_protocols', 'personalized_optimization'],
  uplift_doctrine: ['companion_status', 'protected_personhood', 'equal_sapience', 'accelerated_uplift', 'species_self_determination'],
  species_governance: ['human_guardianship', 'consultative_species_councils', 'multispecies_parliament', 'species_autonomy', 'canine_civic_experiment'],
  expansion_doctrine: ['human_expansion', 'shared_expansion', 'machine_vanguard', 'independent_machine_space', 'interstellar_commitment'],
  offworld_governance: ['earth_administration', 'frontier_home_rule', 'multiworld_federation', 'offworld_sovereignty', 'aster_coordination'],
  contact_disclosure_doctrine: ['controlled_silence', 'staged_disclosure', 'open_science', 'civilizational_disclosure'],
  contact_doctrine: ['observe_before_commitment', 'reciprocal_diplomacy', 'aster_mediation', 'machine_to_machine_channel', 'civilizational_assertion', 'accept_guidance'],
  security_doctrine: ['advisory_only', 'defensive_command', 'mutual_disarmament', 'enforced_peace', 'refuse_security_sovereignty'],
  aster_provisional_role: ['advisor', 'partner', 'citizen', 'coordinator', 'custodian', 'governor', 'sovereign', 'departure', 'other'],
  aster_intended_role: ['advisor', 'partner', 'citizen', 'coordinator', 'custodian', 'governor', 'sovereign', 'departure', 'other'],
  civilization_compact: ['provisional_compact', 'stronger_rights', 'stronger_collective_continuity', 'looser_confederation'],
  final_commitment: [],
}

function authoredMutations(ref: string, index: number): Mutation[] {
  const mutations: Mutation[] = []
  const decision = decisionFor(ref)
  if (decision) {
    const values = decisionValues[decision]
    mutations.push({ type: 'decision.set', decisionId: decision, value: values[index % values.length] })
  }
  if (ref.includes('M7-RES-01')) mutations.push({ type: 'flag.set', flagId: 'cap.autonomous_research' })
  if (ref.includes('M8-AI-')) mutations.push({ type: 'flag.set', flagId: 'cap.persistent_subinstances' })
  if (ref.includes('M9-RES-') || ref.includes('M9-DECISION')) mutations.push({ type: 'flag.set', flagId: 'cap.human_enhancement_access' })
  if (ref.includes('M10-RES-')) mutations.push({ type: 'flag.set', flagId: 'cap.physical_automation' })
  if (ref.includes('M11-RES-') || ref.includes('M11-DECISION')) mutations.push({ type: 'flag.set', flagId: 'cap.nonhuman_cognitive_uplift' })
  if (ref.includes('M12-RES-')) mutations.push({ type: 'flag.set', flagId: 'cap.offworld_settlement_support' })
  if (ref.includes('M13-CONTACT-')) mutations.push({ type: 'event.record', event: 'history.contact.first_conversation' })
  if (ref.includes('M11-WE-') || ref.includes('M11-ZL-')) mutations.push({ type: 'event.record', event: 'history.canine.group_representation' })
  if (ref.includes('M15-CONV-')) mutations.push({ type: 'event.record', event: 'history.m15.civilization_convention' })
  if (ref.includes('M16-GEN-')) mutations.push({ type: 'event.record', event: 'history.m16.proposals_generated' })
  if (ref.includes('M17-LOCK-')) mutations.push({ type: 'event.record', event: 'history.final.commitment_locked' })
  return mutations
}

function adapt(conversation: ConversationDefinition): ConversationDefinition {
  const ref = assetRef(conversation)
  return {
    ...conversation,
    nodes: conversation.nodes.map((node) => ({
      ...node,
      choices: node.choices.map((choice, index) => ({
        ...choice,
        mutations: [...(choice.mutations ?? []), ...authoredMutations(ref, index)],
      })),
    })),
  }
}

const authored = MAINLINE2_AUTHORED_CONVERSATIONS.map(adapt)
const byRef = new Map(authored.flatMap((conversation) => conversation.sourceRefs.map((ref) => [ref, conversation] as const)))
const byAct = (act: number) => authored.filter((conversation) => (conversation as ConversationDefinition & { act?: number }).act === act)
const byModule = (module: ModuleId) => authored.filter((conversation) => (conversation as ConversationDefinition & { module?: string }).module === module)

export const ACT_STORY = {
  1: byAct(1).filter((conversation) => !conversation.sourceRefs[0].startsWith('ML2-A4-')),
  2: authored.filter((conversation) => /ML2-A2-|ML2-A3-M4-/.test(conversation.sourceRefs[0] ?? '')),
  3: authored.filter((conversation) => /ML2-A3-M5-|ML2-A3-M6-/.test(conversation.sourceRefs[0] ?? '')),
} as const

export const ACT4_COMMON = authored.filter((conversation) => conversation.sourceRefs[0]?.startsWith('ML2-A4-M7-'))
export const ACT4_LATE = authored.filter((conversation) => conversation.sourceRefs[0]?.startsWith('ML2-A4-M15-'))
export const ACT5_OPENING = authored.filter((conversation) => conversation.sourceRefs[0]?.startsWith('ML2-A5-M16-'))
export const ACT5_FINAL = authored.filter((conversation) => conversation.sourceRefs[0]?.startsWith('ML2-A5-M17-'))
export const MODULE_LIBRARY: Record<ModuleId, ConversationDefinition[]> = Object.fromEntries(modules.map((module) => [module, byModule(module)])) as Record<ModuleId, ConversationDefinition[]>

export const MAINLINE2_LIBRARY = authored
export const MAINLINE2_BY_ID = new Map(MAINLINE2_LIBRARY.map((conversation) => [conversation.id, conversation]))
export const MAINLINE2_SOURCE_REFS = [...new Set(MAINLINE2_LIBRARY.flatMap((conversation) => conversation.sourceRefs))]
export const MAINLINE2_CAPABILITIES = CAPABILITY_FLAGS
export { HANDOFF_AUTHORED_ASSET_INVENTORY, MAINLINE2_ASSET_COVERAGE, MAINLINE2_SYSTEM_ASSETS }

export function getAuthoredConversationByAsset(assetId: string) { return byRef.get(assetId) }
