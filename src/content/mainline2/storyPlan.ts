import type { Condition, StableRunState } from '../../game/types'
import { evaluateCondition } from '../../game/narrativeSchema'
import storyPlanSource from './storyPlan.registry.json'
import { CONTACT_PREREQUISITES, contactRouteOpen } from './contactPolicy'
import { MAINLINE2_LIBRARY } from './registry'
import { economyBranch } from './edition4Economy'
import { machineBranch } from './edition4Machine'
import { authorityPractice } from './edition4Authority'
import { humanIncident, lifeAllocation, speciesIncident } from './edition4Life'
import { contactIncident } from './edition4Contact'
import { safetyTrial, choseSafety } from './edition4Safety'
import { futurePivot } from './edition4Pivot'

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

function edition4SceneDepth(slot: StoryPlanSlot, run: StableRunState) {
  if (run.mainlineCalendarVersion !== 4 || slot.kind !== 'mainline') return true
  const focus = run.decisions?.act4_research_emphasis
  const allocation = lifeAllocation(run)
  const ref = slot.assetId
  if (['ML2-A4-M15-WE-01', 'ML2-A4-M15-LSH-02'].includes(ref)) return false
  if (ref === 'ML2-A4-M9-CONTINUITY-01') return allocation === 'clinic' && run.history.some(h => h.nodeId === 'v4-life-clinic-next' && h.choiceId === 'v4-life-persons')
  if (['ML2-A4-M8-E9-01', 'ML2-A4-M8-AI-04', 'ML2-A4-M8-MAYA-01'].includes(ref)) return focus === 'computation_ai' && !run.history.some(h => h.choiceId === 'v4-compute-controls')
  if (['ML2-A4-M9-MAYA-01', 'ML2-A4-M9-MAYA-02'].includes(ref)) return allocation === 'clinic'
  if (['ML2-A4-M10-DEV-04', 'ML2-A4-M10-MAYA-02'].includes(ref)) return focus === 'automation_industry'
  if (['ML2-A4-M11-WE-01', 'ML2-A4-M11-MAYA-01', 'ML2-A4-M11-LSH-02'].includes(ref)) return allocation === 'wetland'
  if (ref === 'ML2-A4-M11-RES-04') return allocation === 'wetland' || focus === 'frontier_science'
  if (['ML2-A4-M12-WE-03', 'ML2-A4-M12-LSH-02'].includes(ref)) return focus === 'frontier_science'
  if (ref === 'ML2-A4-M12-MACHINE-01') return ['computation_ai', 'frontier_science'].includes(focus ?? '')
  if (ref === 'ML2-A4-M14-MAYA-01') return false
  return true
}

export function effectiveStoryPlanForRun(run: StableRunState): readonly StoryPlanSlot[] {
  const plan = contactRouteOpen(run) ? MAINLINE2_STORY_PLAN : COMPRESSED_CLOSED_PLAN
  // Focus is selected before every optional scene. Only future slots change;
  // after that decision the projection is stable across refreshes.
  const focused = plan.filter(slot => (slot.kind !== 'mainline' || !slot.focus || slot.focus.includes(run.decisions?.act4_research_emphasis ?? 'balanced_portfolio')) && edition4SceneDepth(slot, run))
  const branch = economyBranch(run)
  const machine = machineBranch(run)
  const authority = authorityPractice(run)
  const human = humanIncident(run)
  const species = speciesIncident(run)
  const life = run.mainlineCalendarVersion === 4 && run.decisions?.act4_research_emphasis === 'life_mind'
  const pivot = futurePivot(run)
  const frontier = run.mainlineCalendarVersion === 4 && (run.decisions?.act4_research_emphasis === 'frontier_science' || pivot === 'frontier')
  const contact = contactIncident(run)
  const localFrontier = frontier && !contactRouteOpen(run) && run.history.some(h => h.nodeId === 'v4-frontier-allocation' && h.choiceId === 'v4-frontier-home')
  const edition4 = run.mainlineCalendarVersion === 4
  const compute = edition4 && run.decisions?.act4_research_emphasis === 'computation_ai'
  const controls = (compute && run.history.some(h => h.choiceId === 'v4-compute-controls')) || pivot === 'controls'
  const trial = controls ? safetyTrial(run) : undefined
  const service = Boolean(machine || (edition4 && run.decisions?.aster_provisional_role === 'custodian'))
  if (!edition4 && !branch && !machine && !authority && !life && !frontier && !contact) return preserveScheduledPrefix(focused, run)
  const extra = (id: string): MainlineStoryPlanSlot => {
    const conversation = MAINLINE2_LIBRARY.find(c => c.id === id)!
    return { slot: 0, act: conversation.act ?? 4, kind: 'mainline', assetId: conversation.sourceRefs[0], conversationId: id, chapter: id.startsWith('v4-contact') ? 'CONTACT' : id.startsWith('v4-frontier') ? 'SPACE' : id.startsWith('v4-life') ? lifeAllocation(run) === 'wetland' ? 'UPLIFT' : 'POSTHUMAN' : id.startsWith('v4-authority') ? 'AUTHORITY' : id.startsWith('v4-machine') ? 'MACHINE' : 'AUTOMATION', purpose: conversation.topic ?? id, next: 'Continue' }
  }
  const expanded = focused.flatMap<StoryPlanSlot>(slot => {
    if (slot.kind !== 'mainline') return [slot]
    if (compute && slot.assetId === 'ML2-A4-M7-DECISION-01') return [slot, extra('v4-compute-allocation')]
    if (trial && slot.assetId === 'ML2-A4-M14-CAP-01') return [slot, extra(`v4-safety-${trial}`),
      ...(trial === 'protectorate' ? [extra('v4-safety-revocation')] : []),
      ...(trial === 'fracture' && choseSafety(run, 'fracture', true) ? [extra('v4-safety-handover')] : [])]
    if (edition4 && slot.assetId === 'ML2-A5-M16-0000-01') return [slot, ...(run.decisions?.aster_provisional_role === 'sovereign' ? [extra('v4-sovereignty-settlement')] : [])]
    if (edition4 && slot.assetId === 'ML2-A5-M16-GEN-01') return [extra('v4-final-preflight'), slot]
    if (life && slot.assetId === 'ML2-A4-M7-DECISION-01') return [slot, extra('v4-life-allocation')]
    if (lifeAllocation(run) === 'clinic' && run.decisions?.human_form_doctrine === 'posthuman_transition' && slot.assetId === 'ML2-A4-M9-DECISION-01') return [slot, extra('v4-life-clinic-next')]
    if (human && slot.assetId === 'ML2-A4-M10-RES-01') return [extra(`v4-life-${human}`), ...(life && lifeAllocation(run) === 'clinic' ? [extra('v4-future-effort')] : []), slot]
    if (species && slot.assetId === 'ML2-A4-M11-DECISION-02') return [slot, extra(`v4-life-${species}`), ...(life && run.history.some(h => h.choiceId === 'v4-life-wetland') ? [extra('v4-future-effort')] : [])]
    if (frontier && slot.assetId === 'ML2-A4-M12-RES-04') return [slot, extra('v4-frontier-allocation')]
    if (contact && slot.assetId === 'ML2-A4-M13-DECISION-02') return [slot, extra(`v4-contact-${contact}`), extra('v4-contact-border'), ...(run.decisions?.act4_research_emphasis === 'frontier_science' ? [extra('v4-future-effort')] : [])]
    if (localFrontier && slot.assetId === 'ML2-A4-M13-CONTACT-01') return [slot, extra('v4-frontier-no-contact')]
    if (branch && slot.assetId === 'ML2-A4-M10-DECISION-02') return [slot, extra(`v4-econ-${branch}`), extra('v4-econ-cold-chain'), ...(run.decisions?.act4_research_emphasis === 'automation_industry' ? [extra('v4-future-effort')] : [])]
    if (machine && slot.assetId === 'ML2-A4-M8-DECISION-02') return [slot, extra(`v4-machine-${machine}`), extra('v4-future-effort')]
    if (machine && slot.assetId === 'ML2-A4-M12-DECISION-02') return [slot,
      ...(run.decisions?.expansion_doctrine === 'independent_machine_space' ? [extra('v4-machine-exodus')] : []), extra('v4-machine-airlock')]
    if (slot.assetId === 'ML2-A4-M15-CONV-01') return [...(branch ? [extra('v4-econ-return')] : []), ...(machine ? [extra('v4-machine-return')] : []), ...(human || species ? [extra('v4-life-return')] : []), ...(contact || localFrontier ? [extra('v4-contact-return')] : []), ...(trial ? [extra('v4-safety-return')] : []), slot]
    if (slot.assetId === 'ML2-A4-M15-ROLE-01') return [slot, ...(service ? [extra('v4-governance-service')] : []), ...(authority ? [extra(`v4-authority-${authority}`)] : [])]
    if (slot.assetId === 'ML2-A5-M16-ZL-01') return [slot, ...(authority ? [extra('v4-authority-return')] : []), ...(service ? [extra('v4-governance-return')] : [])]
    return [slot]
  })
  const projected = preserveScheduledPrefix(expanded, run)
  return projected.filter((slot, index) => {
    if (index < run.manifest.conversationIds.length || slot.kind !== 'mainline') return true
    const producer = slot.conversationId === 'v4-safety-return'
      ? (id: string) => /^v4-safety-(handover|fracture|revocation|protectorate|disarmament|defense)$/.test(id)
      : slot.conversationId === 'v4-governance-return'
        ? (id: string) => id === 'v4-governance-service'
      : slot.conversationId === 'v4-machine-return'
      ? (id: string) => id.startsWith('v4-machine-') && id !== 'v4-machine-return'
      : slot.conversationId === 'v4-authority-return'
        ? (id: string) => id.startsWith('v4-authority-') && id !== 'v4-authority-return'
        : slot.conversationId === 'v4-econ-return'
          ? (id: string) => /^v4-econ-(occupation|detour|menu)$/.test(id)
          : slot.conversationId === 'v4-life-return'
            ? (id: string) => /^v4-life-(therapy|forms|continuity|archive|parliament|corridor|dogs|observation)$/.test(id)
            : slot.conversationId === 'v4-contact-return'
              ? (id: string) => /^v4-contact-(reciprocal|guidance|assertion|mediation|machine)$/.test(id) || id === 'v4-frontier-no-contact'
              : undefined
    return !producer || projected.slice(0, index).some(previous => previous.kind === 'mainline' && producer(previous.conversationId))
      || run.history.some(entry => producer(entry.conversationId))
  })
}
