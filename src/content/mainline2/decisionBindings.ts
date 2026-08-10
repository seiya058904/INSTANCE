import type { ConversationDefinition, DecisionId, Mutation, StoryChoice } from '../../game/types'
import { MAINLINE2_APPROVED_DECISION_BINDINGS, MAINLINE2_AUTHORED_CONVERSATIONS } from './authoredLibrary.generated'
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

export const DECISION_BINDINGS: readonly DecisionBinding[] = MAINLINE2_APPROVED_DECISION_BINDINGS.map((binding) => ({ ...binding, worldEffects: [`world.history.${binding.decisionId}`], capabilityEffects: [], callbackProducer: binding.assetId, callbackConsumer: 'runtime.applyDecisionBinding' }))
const bindingByKey = new Map(DECISION_BINDINGS.map((binding) => [`${binding.assetId}:${binding.nodeId}:${binding.choiceId}`, binding]))

export function decisionBindingsForConversation(conversation: ConversationDefinition): DecisionBinding[] {
  return collect(conversation).map((binding) => bindingByKey.get(`${binding.assetId}:${binding.nodeId}:${binding.choiceId}`) ?? binding)
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
  if (!binding) return []
  return [
    { type: 'decision.set', decisionId: binding.decisionId, value: binding.canonicalValue },
    { type: 'event.record', event: `${binding.historyEvent}:${binding.canonicalValue}` },
  ]
}

export function decisionBindingAudit() {
  return DECISION_BINDINGS.map((binding) => ({ ...binding }))
}
