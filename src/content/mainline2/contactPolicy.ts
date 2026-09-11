import type { Condition, StableRunState } from '../../game/types'
import { evaluateCondition } from '../../game/narrativeSchema'
import policy from './contactPolicy.registry.json'

export type ContactState = Pick<StableRunState, 'flags' | 'events' | 'decisions'>
  & Partial<Pick<StableRunState, 'history' | 'currentNodeId' | 'persistentFlags'>>
export const CONTACT_PREREQUISITES = policy.prerequisites as Condition
export const CANONICAL_CONTACT_NODES: Readonly<Record<string, readonly string[]>> = policy.enteredConversations
const enteredNodeIds = new Set(Object.values(CANONICAL_CONTACT_NODES).flat())

export function contactPrerequisitesMet(run: ContactState) {
  // This declaration only reads flags, events and decisions, all present above.
  return evaluateCondition(CONTACT_PREREQUISITES, run as StableRunState)
}

export function hasEnteredCanonicalContact(run: ContactState) {
  return Boolean(run.currentNodeId && enteredNodeIds.has(run.currentNodeId))
    || (run.history ?? []).some((entry) => CANONICAL_CONTACT_NODES[entry.conversationId]?.includes(entry.nodeId))
}

export function contactRouteOpen(run: ContactState) {
  return contactPrerequisitesMet(run) || hasEnteredCanonicalContact(run)
}
