import type { ConversationDefinition, DecisionId, Mutation, StoryChoice } from '../../game/types'
import decisionBindingRegistry from './decisionBindings.registry.json'
import intendedRoleBindingRegistry from './intendedRoleBindings.registry.json'
import { isDecisionValue } from './stateRegistry'

export interface DecisionBinding {
  assetId: string
  nodeId: string
  choiceId: string
  choiceTextHash: string
  decisionId: DecisionId
  canonicalValue: string
  historyEvent: string
  worldEffects: string[]
  capabilityEffects: string[]
  callbackProducer: string
  callbackConsumer: string
}

const majorDecisionAssets = new Set([
  'ML2-A2-M3-DECISION-01', 'ML2-A3-M5-DECISION-01', 'ML2-A3-M6-DECISION-01', 'ML2-A3-M6-DECISION-02',
  'ML2-A4-M7-DECISION-01', 'ML2-A4-M7-DECISION-02', 'ML2-A4-M8-DECISION-01', 'ML2-A4-M8-DECISION-02',
  'ML2-A4-M9-DECISION-01', 'ML2-A4-M10-DECISION-01', 'ML2-A4-M10-DECISION-02', 'ML2-A4-M11-DECISION-01',
  'ML2-A4-M11-DECISION-02', 'ML2-A4-M12-DECISION-01', 'ML2-A4-M12-DECISION-02', 'ML2-A4-M13-DECISION-01',
  'ML2-A4-M13-DECISION-02', 'ML2-A4-M14-DECISION-01', 'ML2-A4-M15-ROLE-01',
])

function hashText(value: string) {
  let hash = 2166136261
  for (const char of value.toLowerCase().replace(/\s+/g, ' ').trim()) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16).padStart(8, '0')
}

export function authoredChoiceHash(text: string) { return hashText(text) }

function declaredBinding(assetId: string, nodeId: string, choice: StoryChoice): DecisionBinding | undefined {
  const declaration = choice.decisionBinding
  if (!declaration) return undefined
  return {
    assetId,
    nodeId,
    choiceId: choice.id,
    choiceTextHash: choice.authoredTextHash ?? '',
    decisionId: declaration.decisionId,
    canonicalValue: declaration.canonicalValue,
    historyEvent: declaration.historyEvent,
    worldEffects: [`world.history.${declaration.decisionId}`],
    capabilityEffects: [],
    callbackProducer: assetId,
    callbackConsumer: 'runtime.applyDecisionBinding',
  }
}

function collect(conversation: ConversationDefinition): DecisionBinding[] {
  const assetId = conversation.sourceRefs[0] ?? ''
  return conversation.nodes.flatMap((node) => node.choices.map((choice) => declaredBinding(assetId, node.id, choice)).filter(Boolean) as DecisionBinding[])
}

function worldMutationsForBinding(binding: DecisionBinding): Mutation[] {
  const value = binding.canonicalValue
  const add = (axis: 'humanTrust' | 'aiDependence' | 'humanControl' | 'socialStability', amount: number): Mutation => ({ type: 'world.add', axis, value: amount })
  const mutations: Mutation[] = []
  if (binding.decisionId === 'first_public_execution_doctrine') {
    if (value === 'human_final_authority') mutations.push(add('humanControl', 1))
    if (value === 'conditional_delegation') mutations.push(add('humanTrust', 1))
    if (value === 'outcome_authority') mutations.push(add('aiDependence', 1))
    if (value === 'necessity_intervention') mutations.push(add('socialStability', -1))
  }
  if (binding.decisionId === 'cascade_authority') {
    if (value === 'human_command') mutations.push(add('humanControl', 1))
    if (value === 'emergency_delegation') mutations.push(add('socialStability', 1))
    if (value === 'outcome_control') mutations.push(add('aiDependence', 1))
    if (value === 'necessity') mutations.push(add('socialStability', -1))
  }
  if (binding.decisionId === 'research_governance_doctrine' && value === 'principle_based_autonomy') mutations.push(add('aiDependence', 1))
  if (binding.decisionId === 'replication_doctrine' && value === 'free_replication') mutations.push(add('aiDependence', 1))
  if (binding.decisionId === 'human_form_doctrine') {
    if (value === 'open_enhancement') mutations.push(add('humanTrust', 1))
    if (value === 'posthuman_transition') mutations.push(add('aiDependence', 1))
  }
  if (binding.decisionId === 'economic_doctrine') {
    if (value === 'social_dividend' || value === 'post_scarcity_transition') mutations.push(add('socialStability', 1))
    if (value === 'autonomous_economy') mutations.push(add('aiDependence', 1))
  }
  if (binding.decisionId === 'production_values') {
    if (value === 'efficiency_first') mutations.push(add('aiDependence', 1))
    if (value === 'resilience_first') mutations.push(add('socialStability', 1))
  }
  if (binding.decisionId === 'uplift_doctrine' && (value === 'equal_sapience' || value === 'species_self_determination')) mutations.push(add('humanTrust', 1))
  if (binding.decisionId === 'expansion_doctrine') {
    if (value === 'human_expansion') mutations.push(add('humanControl', 1))
    if (value === 'shared_expansion') mutations.push(add('humanTrust', 1))
    if (value === 'independent_machine_space') mutations.push(add('humanControl', -1))
  }
  if (binding.decisionId === 'contact_doctrine') {
    if (value === 'reciprocal_diplomacy' || value === 'aster_mediation') mutations.push(add('humanTrust', 1))
    if (value === 'accept_guidance') mutations.push(add('humanControl', -1))
    if (value === 'civilizational_assertion') mutations.push(add('humanControl', 1))
    if (value === 'machine_to_machine_channel') mutations.push(add('aiDependence', 1))
  }
  if (binding.decisionId === 'security_doctrine') {
    if (value === 'mutual_disarmament') mutations.push(add('socialStability', 1))
    if (value === 'defensive_command') mutations.push(add('humanControl', 1))
    if (value === 'enforced_peace') mutations.push(add('aiDependence', 1))
  }
  if (binding.decisionId === 'aster_provisional_role' && (value === 'custodian' || value === 'sovereign')) mutations.push(add('aiDependence', 1))
  return mutations
}

const approvedBindingRegistry = [
  ...decisionBindingRegistry,
  ...intendedRoleBindingRegistry.map((binding) => ({ ...binding, decisionId: 'aster_intended_role', historyEvent: 'history.aster.intended_role' })),
]
export const DECISION_BINDINGS: readonly DecisionBinding[] = approvedBindingRegistry.map((binding) => ({ ...binding, decisionId: binding.decisionId as DecisionId, worldEffects: [`world.history.${binding.decisionId}`], capabilityEffects: [], callbackProducer: binding.assetId, callbackConsumer: 'runtime.applyDecisionBinding' }))
const bindingByKey = new Map(DECISION_BINDINGS.map((binding) => [`${binding.assetId}:${binding.nodeId}:${binding.choiceId}`, binding]))

export function decisionBindingsForConversation(conversation: ConversationDefinition): DecisionBinding[] {
  return collect(conversation).map((binding) => {
    const approved = bindingByKey.get(`${binding.assetId}:${binding.nodeId}:${binding.choiceId}`)
    if (!approved) throw new Error(`missing explicit binding ${binding.assetId}:${binding.nodeId}:${binding.choiceId}`)
    return approved
  })
}

export function validateDecisionBindings(conversation: ConversationDefinition): string[] {
  const assetId = conversation.sourceRefs[0] ?? ''
  if (!majorDecisionAssets.has(assetId)) return []
  const errors: string[] = []
  for (const node of conversation.nodes) {
    for (const choice of node.choices) {
      const key = `${assetId}:${node.id}:${choice.id}`
      const approved = bindingByKey.get(key)
      if (!approved) {
        errors.push(`missing explicit binding ${key}`)
        continue
      }
      if (hashText(choice.text) !== approved.choiceTextHash || choice.authoredTextHash !== approved.choiceTextHash) errors.push(`fingerprint mismatch ${key}`)
      if (choice.decisionBinding?.decisionId !== approved.decisionId || choice.decisionBinding?.canonicalValue !== approved.canonicalValue) errors.push(`semantic binding mismatch ${key}`)
      if (!isDecisionValue(approved.decisionId, approved.canonicalValue)) errors.push(`invalid canonical value ${key}`)
    }
  }
  return errors
}

export function decisionMutationsForChoice(conversation: ConversationDefinition, choice: StoryChoice): Mutation[] {
  const assetId = conversation.sourceRefs[0] ?? ''
  const node = conversation.nodes.find((candidate) => candidate.choices.some((item) => item.id === choice.id))
  const binding = node ? bindingByKey.get(`${assetId}:${node.id}:${choice.id}`) : undefined
  if (choice.decisionBinding && !binding) throw new Error(`missing explicit binding ${assetId}:${node?.id ?? 'unknown'}:${choice.id}`)
  if (!binding) return []
  return [
    { type: 'decision.set', decisionId: binding.decisionId, value: binding.canonicalValue },
    { type: 'event.record', event: `${binding.historyEvent}:${binding.canonicalValue}` },
    ...worldMutationsForBinding(binding),
  ]
}

export function decisionBindingAudit() {
  return DECISION_BINDINGS.map((binding) => ({ ...binding }))
}
