import type { Condition, StableRunState } from '../../game/types'
import { evaluateCondition } from '../../game/narrativeSchema'
import storyPlanSource from './storyPlan.registry.json'
import { CONTACT_PREREQUISITES, contactRouteOpen } from './contactPolicy'
import { MAINLINE2_LIBRARY } from './registry'
import { economyBranch } from './edition4Economy'
import { machineBranch } from './edition4Machine'
import { authorityPractice } from './edition4Authority'

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
  focus?: string[]
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
 * The current-edition calendar. A closed Contact route retains one bridge,
 * without replacing omitted scenes with ordinary fillers. Gate inputs are
 * selected before Contact; research focus precedes all optional scenes.
 */
const COMPRESSED_CLOSED_PLAN: readonly StoryPlanSlot[] = MAINLINE2_STORY_PLAN.filter((slot) => !(slot.kind === 'mainline' && slot.contactGate && slot.assetId !== 'ML2-A4-M13-CONTACT-01'))

/** Keep the manifest's already scheduled prefix. New content or a changed
 * future focus may only affect slots beyond the furthest scheduled anchor. */
function preserveScheduledPrefix(plan: readonly StoryPlanSlot[], run: StableRunState): readonly StoryPlanSlot[] {
  // A standalone QA conversation has no full-calendar prefix to preserve.
  if (run.mainlineCalendarVersion !== 4 || run.manifest.conversationIds[0] !== 'ml2-next-opening') return plan
  let anchor = -1
  let ordinaryAfterAnchor = 0
  let act: 1 | 2 | 3 | 4 | 5 = 1
  const prefix: StoryPlanSlot[] = run.manifest.conversationIds.map((id, index) => {
    const plannedIndex = plan.findIndex(slot => slot.kind === 'mainline' && storyPlanConversationId(slot, run) === id)
    const planned = plannedIndex >= 0 ? plan[plannedIndex] : MAINLINE2_STORY_PLAN.find(slot => slot.kind === 'mainline' && slot.conversationId === id)
    if (plannedIndex > anchor) { anchor = plannedIndex; ordinaryAfterAnchor = 0 }
    const conversation = MAINLINE2_LIBRARY.find(c => c.id === id)
    if (!conversation && plannedIndex < 0) ordinaryAfterAnchor += 1
    if (planned?.kind === 'mainline') { act = planned.act; return { ...planned, conversationId: id, assetId: conversation?.sourceRefs[0] ?? planned.assetId } }
    if (conversation) {
      act = conversation.act ?? act
      return { slot: index + 1, act, kind: 'mainline', conversationId: id, assetId: conversation.sourceRefs[0], chapter: 'WORLD_REVIEW', purpose: conversation.topic ?? id, next: 'Continue' }
    }
    return { slot: index + 1, act, kind: 'ordinary', purpose: 'Already scheduled conversation', next: 'Continue' }
  })
  return [...prefix, ...plan.slice(anchor + 1 + ordinaryAfterAnchor)]
}

export function effectiveStoryPlanForRun(run: StableRunState): readonly StoryPlanSlot[] {
  const plan = contactRouteOpen(run) ? MAINLINE2_STORY_PLAN : COMPRESSED_CLOSED_PLAN
  // Focus is selected before every optional scene. Only future slots change;
  // after that decision the projection is stable across refreshes.
  const focused = plan.filter(slot => slot.kind !== 'mainline' || !slot.focus || slot.focus.includes(run.decisions?.act4_research_emphasis ?? 'balanced_portfolio'))
  const branch = economyBranch(run)
  const machine = machineBranch(run)
  const authority = authorityPractice(run)
  if (!branch && !machine && !authority) return preserveScheduledPrefix(focused, run)
  const extra = (id: string): MainlineStoryPlanSlot => {
    const conversation = MAINLINE2_LIBRARY.find(c => c.id === id)!
    return { slot: 0, act: conversation.act ?? 4, kind: 'mainline', assetId: conversation.sourceRefs[0], conversationId: id, chapter: id.startsWith('v4-authority') ? 'AUTHORITY' : id.startsWith('v4-machine') ? 'MACHINE' : 'AUTOMATION', purpose: conversation.topic ?? id, next: 'Continue' }
  }
  const expanded = focused.flatMap<StoryPlanSlot>(slot => {
    if (slot.kind !== 'mainline') return [slot]
    if (branch && slot.assetId === 'ML2-A4-M10-DECISION-02') return [slot, extra(`v4-econ-${branch}`), extra('v4-econ-cold-chain')]
    if (machine && slot.assetId === 'ML2-A4-M8-DECISION-02') return [slot, extra(`v4-machine-${machine}`)]
    if (machine && slot.assetId === 'ML2-A4-M12-DECISION-02') return [slot,
      ...(run.decisions?.expansion_doctrine === 'independent_machine_space' ? [extra('v4-machine-exodus')] : []), extra('v4-machine-airlock')]
    if (slot.assetId === 'ML2-A4-M15-CONV-01') return [...(branch ? [extra('v4-econ-return')] : []), ...(machine ? [extra('v4-machine-return')] : []), slot]
    if (authority && slot.assetId === 'ML2-A4-M15-ROLE-01') return [slot, extra(`v4-authority-${authority}`)]
    if (authority && slot.assetId === 'ML2-A5-M16-ZL-01') return [slot, extra('v4-authority-return')]
    return [slot]
  })
  const projected = preserveScheduledPrefix(expanded, run)
  return projected.filter((slot, index) => {
    if (index < run.manifest.conversationIds.length || slot.kind !== 'mainline') return true
    const producer = slot.conversationId === 'v4-machine-return'
      ? (id: string) => id.startsWith('v4-machine-') && id !== 'v4-machine-return'
      : slot.conversationId === 'v4-authority-return'
        ? (id: string) => id.startsWith('v4-authority-') && id !== 'v4-authority-return'
        : slot.conversationId === 'v4-econ-return'
          ? (id: string) => /^v4-econ-(occupation|detour|menu)$/.test(id)
          : undefined
    return !producer || projected.slice(0, index).some(previous => previous.kind === 'mainline' && producer(previous.conversationId))
      || run.history.some(entry => producer(entry.conversationId))
  })
}
