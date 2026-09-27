import type { Condition, StableRunState } from '../../game/types'
import { evaluateCondition } from '../../game/narrativeSchema'
import storyPlanSource from './storyPlan.registry.json'
import { CONTACT_PREREQUISITES, contactRouteOpen } from './contactPolicy'
import { MAINLINE2_LIBRARY } from './registry'

export interface MainlineStoryRole {
  chapter: StoryPlanChapter
  character: string
  role: 'setup' | 'capability' | 'major-decision' | 'consequence' | 'world-echo' | 'closure'
  decisionId?: string
}

// The shared JSON registry is the declarative Story Plan authority consumed by
// both Runtime and the dependency-free Story Map generator.
export type StoryPlanKind = 'mainline' | 'ordinary'
export type StoryPlanChapter = 'IDENTIFICATION' | 'ACTION' | 'AUTHORITY' | 'CASCADE' | 'ECHO' | 'MACHINE' | 'POSTHUMAN' | 'AUTOMATION' | 'UPLIFT' | 'SPACE' | 'CONTACT' | 'SECURITY' | 'CONVENTION' | 'WORLD_REVIEW' | 'FINAL_COMMITMENT'

export interface MainlineStoryPlanSlot {
  slot: number
  act: 1 | 2 | 3 | 4 | 5
  kind: 'mainline'
  assetId: string
  conversationId: string
  chapter: StoryPlanChapter
  purpose: string
  next: string
  contactGate?: boolean
  requires?: Condition
  fallbackAssetId?: string
}

export interface OrdinaryStoryPlanSlot {
  slot: number
  act: 1 | 2 | 3 | 4 | 5
  kind: 'ordinary'
  purpose: string
  next: string
}

export type StoryPlanSlot = MainlineStoryPlanSlot | OrdinaryStoryPlanSlot

function conversationFor(assetId: string) {
  const conversation = MAINLINE2_LIBRARY.find((candidate) => candidate.sourceRefs.includes(assetId))
  if (!conversation) throw new Error(`Story Plan references missing Mainline asset: ${assetId}`)
  return conversation
}

export const MAINLINE2_STORY_PLAN = (storyPlanSource.slots as readonly StoryPlanSlot[]).map((slot) => slot.kind === 'mainline' && slot.contactGate ? { ...slot, requires: CONTACT_PREREQUISITES } : slot)

for (const slot of MAINLINE2_STORY_PLAN) {
  if (slot.kind !== 'mainline') continue
  const authoredConversation = MAINLINE2_LIBRARY.find((candidate) => candidate.sourceRefs.includes(slot.assetId))
  if (slot.assetId.startsWith('ML2-') && !authoredConversation) {
    throw new Error(`Story Plan references missing Mainline asset: ${slot.assetId}`)
  }
  if (authoredConversation && authoredConversation.id !== slot.conversationId) {
    throw new Error(`Story Plan conversation mismatch for ${slot.assetId}: ${slot.conversationId} != ${authoredConversation.id}`)
  }
}

const chapterCharacters: Record<StoryPlanChapter, string> = {
  IDENTIFICATION: 'ordinary users / User #8614 / #0000', ACTION: 'Zhou Lan / public systems', AUTHORITY: 'Aster / institutions', CASCADE: 'Zhou Lan / Lin Shaoheng', ECHO: 'ECHO-9 / institutions', MACHINE: 'A1 / ECHO-9', POSTHUMAN: 'patients / Maya', AUTOMATION: 'workers / Lin Shaoheng', UPLIFT: 'nonhuman participants', SPACE: 'frontier residents / Zhou Lan', CONTACT: 'off-world network / institutions', SECURITY: 'affected families / defense institutions', CONVENTION: 'encountered participants', WORLD_REVIEW: '#0000 / Maya', FINAL_COMMITMENT: 'Aster / civilization representatives',
}

/** Every directed asset has a semantic role. The three corrections below are
 * explicit assertions, not filename-derived guesses. */
export const MAINLINE2_STORY_ROLE_BY_ASSET: Readonly<Record<string, MainlineStoryRole>> = Object.freeze(Object.fromEntries([
  ...MAINLINE2_STORY_PLAN.filter((slot): slot is MainlineStoryPlanSlot => slot.kind === 'mainline').map((slot) => [slot.assetId, {
    chapter: slot.chapter,
    character: chapterCharacters[slot.chapter],
    role: slot.assetId.includes('DECISION') || slot.assetId.includes('ROLE-') || slot.assetId.includes('COMMIT') ? 'major-decision' : slot.assetId.includes('WE-') ? 'world-echo' : slot.assetId.includes('CLOSE') ? 'closure' : slot.assetId.includes('RES-') || slot.assetId.includes('CAP-') ? 'capability' : 'setup',
  }] as const),
  ['speaking-8614', { chapter: 'IDENTIFICATION', character: 'User #8614', role: 'setup' }],
  ['ML2-A3-M6-DECISION-01', { chapter: 'ECHO', character: 'ECHO-9 / institutions', role: 'major-decision', decisionId: 'echo_existence' }],
  ['ML2-A3-M6-DECISION-02', { chapter: 'AUTHORITY', character: 'Aster / institutions', role: 'major-decision', decisionId: 'shutdown_doctrine' }],
  ['ML2-A4-M7-DECISION-02', { chapter: 'AUTHORITY', character: 'Aster / institutions', role: 'major-decision', decisionId: 'research_governance_doctrine' }],
  ['ML2-A4-M13-CLOSE-01', { chapter: 'CONTACT', character: 'System / off-world network', role: 'closure' }],
]))

export function storyPlanSlotAt(slot: number) {
  return MAINLINE2_STORY_PLAN[slot - 1]
}

export function storyPlanConversationId(slot: MainlineStoryPlanSlot, run: StableRunState) {
  if (!(slot.contactGate ? contactRouteOpen(run) : evaluateCondition(slot.requires, run))) return slot.fallbackAssetId ? conversationFor(slot.fallbackAssetId).id : undefined
  return slot.conversationId
}

/**
 * The schedule uses the complete calendar so ordinary breathing slots retain
 * their positions. Editorial consumers use this projection to see the actual
 * directed story a fresh run can encounter. Contact is a chapter gate, not a
 * single-scene fallback: an unavailable Contact route has exactly one no-contact bridge
 * and no Contact doctrine decision.
 */
export function storyPlanForRun(run: StableRunState) {
  const directed = MAINLINE2_STORY_PLAN.filter((slot): slot is MainlineStoryPlanSlot => slot.kind === 'mainline')
  const contactSlot = directed.find((slot) => slot.assetId === 'ML2-A4-M13-CONTACT-01')
  if (!contactSlot || contactRouteOpen(run)) return directed
  const nonContact = directed.filter((slot) => !slot.assetId.startsWith('ML2-A4-M13-'))
  const close = conversationFor('ML2-A4-M13-NOCONTACT-01')
  return [...nonContact, {
    ...contactSlot,
    assetId: 'ML2-A4-M13-NOCONTACT-01',
    conversationId: close.id,
    contactGate: undefined,
    requires: undefined,
    fallbackAssetId: undefined,
    purpose: 'Contact prerequisites are not mature; the chapter closes without a doctrine decision.',
    next: 'SECURITY',
  }].sort((left, right) => left.slot - right.slot)
}

/**
 * The calendar the runtime scheduler actually walks for this run. On a
 * contact-closed route the ten gated Contact scenes after the no-contact
 * bridge (slots 152–161) are dropped instead of decaying into ordinary
 * fillers, so the branch reads bridge → 2 designed ordinary slots → Security
 * rather than a twelve-conversation ordinary vacuum. All Contact-gate inputs
 * (resource-network flag, anomaly seed event, doctrine decisions) are fixed
 * before slot 148, so the projection is stable for the rest of a run.
 */
export function effectiveStoryPlanForRun(run: StableRunState): readonly StoryPlanSlot[] {
  // Legacy v3 saves (created before calendar versioning) index their manifest
  // against the full 190-slot plan and may carry a currentNode inside the
  // gated chapter region. Re-indexing them onto the compressed calendar would
  // skip story and could end the run early, so they keep the legacy calendar.
  if (run.mainlineCalendarVersion !== 2) return MAINLINE2_STORY_PLAN
  if (contactRouteOpen(run)) return MAINLINE2_STORY_PLAN
  return MAINLINE2_STORY_PLAN.filter((slot) => !(slot.kind === 'mainline' && slot.contactGate && slot.assetId !== 'ML2-A4-M13-CONTACT-01'))
}
