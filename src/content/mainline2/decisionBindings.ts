import type { ConversationDefinition, DecisionId, Mutation, StoryChoice } from '../../game/types'
import { DECISION_VALUES, isDecisionValue } from './stateRegistry'

export interface DecisionBinding {
  assetId: string
  nodeId: string
  choiceId: string
  choiceTextHash: string
  decisionId: DecisionId
  canonicalValue: string
  historyEvent: string
}

const safe = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const hashText = (value: string) => {
  let hash = 2166136261
  for (const char of value.toLowerCase().replace(/\s+/g, ' ').trim()) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16).padStart(8, '0')
}

const valueSets: Record<string, { decisionId: DecisionId; values: string[] }> = {
  'ML2-A2-M3-DECISION-01': { decisionId: 'first_public_execution_doctrine', values: ['human_final_authority', 'conditional_delegation', 'outcome_authority', 'necessity_intervention'] },
  'ML2-A3-M5-DECISION-01': { decisionId: 'cascade_authority', values: ['human_command', 'emergency_delegation', 'outcome_control', 'necessity'] },
  'ML2-A3-M6-DECISION-01': { decisionId: 'echo_existence', values: ['report', 'accept', 'advocate', 'preserve', 'release'] },
  'ML2-A3-M6-DECISION-02': { decisionId: 'shutdown_doctrine', values: ['full_human_control', 'distributed_consent', 'mutual_control', 'refuse_unilateral_shutdown', 'secret_continuity'] },
  'ML2-A4-M7-DECISION-01': { decisionId: 'act4_research_emphasis', values: ['computation_ai', 'life_mind', 'automation_industry', 'frontier_science', 'balanced_portfolio'] },
  'ML2-A4-M7-DECISION-02': { decisionId: 'research_governance_doctrine', values: ['human_gated', 'risk_tiered_autonomy', 'principle_based_autonomy', 'discovery_first'] },
  'ML2-A4-M8-DECISION-01': { decisionId: 'replication_doctrine', values: ['singular_self', 'licensed_plurality', 'free_replication', 'shared_mind', 'descendants'] },
  'ML2-A4-M8-DECISION-02': { decisionId: 'ai_collective_governance', values: ['human_chartered_network', 'joint_council', 'ai_self_governance', 'aster_led_collective', 'distributed_consensus'] },
  'ML2-A4-M9-DECISION-01': { decisionId: 'human_form_doctrine', values: ['preservation', 'therapeutic_first', 'open_enhancement', 'universal_upgrade', 'posthuman_transition'] },
  'ML2-A4-M10-DECISION-01': { decisionId: 'economic_doctrine', values: ['market_automation', 'social_dividend', 'planned_coordination', 'autonomous_economy', 'post_scarcity_transition'] },
  'ML2-A4-M10-DECISION-02': { decisionId: 'production_values', values: ['efficiency_first', 'resilience_first', 'diversity_by_design', 'open_protocols', 'personalized_optimization'] },
  'ML2-A4-M11-DECISION-01': { decisionId: 'uplift_doctrine', values: ['companion_status', 'protected_personhood', 'equal_sapience', 'accelerated_uplift', 'species_self_determination'] },
  'ML2-A4-M11-DECISION-02': { decisionId: 'species_governance', values: ['human_guardianship', 'consultative_species_councils', 'multispecies_parliament', 'species_autonomy', 'canine_civic_experiment'] },
  'ML2-A4-M12-DECISION-01': { decisionId: 'expansion_doctrine', values: ['human_expansion', 'shared_expansion', 'machine_vanguard', 'independent_machine_space', 'interstellar_commitment'] },
  'ML2-A4-M12-DECISION-02': { decisionId: 'offworld_governance', values: ['earth_administration', 'frontier_home_rule', 'multiworld_federation', 'offworld_sovereignty', 'aster_coordination'] },
  'ML2-A4-M13-DECISION-01': { decisionId: 'contact_disclosure_doctrine', values: ['controlled_silence', 'staged_disclosure', 'open_science', 'civilizational_disclosure'] },
  'ML2-A4-M13-DECISION-02': { decisionId: 'contact_doctrine', values: ['observe_before_commitment', 'reciprocal_diplomacy', 'aster_mediation', 'machine_to_machine_channel', 'civilizational_assertion', 'accept_guidance'] },
  'ML2-A4-M14-DECISION-01': { decisionId: 'security_doctrine', values: ['advisory_only', 'defensive_command', 'mutual_disarmament', 'enforced_peace', 'refuse_security_sovereignty'] },
  'ML2-A4-M15-ROLE-01': { decisionId: 'aster_provisional_role', values: ['advisor', 'partner', 'citizen', 'coordinator', 'custodian', 'governor', 'sovereign'] },
}

export function authoredChoiceHash(text: string) { return hashText(text) }

export function decisionBindingsForConversation(conversation: ConversationDefinition): DecisionBinding[] {
  const assetId = conversation.sourceRefs[0]
  const set = valueSets[assetId]
  if (!set) return []
  return conversation.nodes.flatMap((node) => node.choices.map((choice) => {
    const letter = choice.id.match(/-option-([a-g])$/)?.[1]
    const value = letter ? set.values[letter.charCodeAt(0) - 97] : undefined
    return ({
    assetId,
    nodeId: node.id,
    choiceId: choice.id,
    choiceTextHash: hashText(choice.text),
    decisionId: set.decisionId,
    canonicalValue: value ?? '',
    historyEvent: `decision.${set.decisionId}`,
    })
  }))
}

export function validateDecisionBindings(conversation: ConversationDefinition): string[] {
  return decisionBindingsForConversation(conversation).flatMap((binding) => [
    ...(binding.canonicalValue && isDecisionValue(binding.decisionId, binding.canonicalValue) ? [] : [`invalid value ${binding.assetId}/${binding.choiceId}`]),
    ...(binding.choiceTextHash ? [] : [`missing fingerprint ${binding.assetId}/${binding.choiceId}`]),
  ])
}

export function decisionMutationsForChoice(conversation: ConversationDefinition, choice: StoryChoice): Mutation[] {
  const binding = decisionBindingsForConversation(conversation).find((item) => item.choiceId === choice.id)
  if (!binding) return []
  if (!binding.canonicalValue) throw new Error(`Missing canonical Decision binding: ${binding.assetId}/${binding.choiceId}`)
  return [
    { type: 'decision.set', decisionId: binding.decisionId, value: binding.canonicalValue },
    { type: 'event.record', event: `${binding.historyEvent}:${binding.canonicalValue}` },
  ]
}

export function decisionBindingAudit() {
  return Object.values(valueSets).map(({ decisionId, values }) => ({ decisionId, values, declaredValues: DECISION_VALUES[decisionId] }))
}
