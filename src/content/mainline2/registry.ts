import type { ConversationDefinition, ModuleId, Mutation } from '../../game/types'
import {
  HANDOFF_AUTHORED_ASSET_INVENTORY,
  MAINLINE2_SYSTEM_ASSETS,
  MAINLINE2_ASSET_COVERAGE,
  MAINLINE2_AUTHORED_CONVERSATIONS,
} from './authoredLibrary.generated'
import { CAPABILITY_FLAGS } from './stateRegistry'
import { decisionMutationsForChoice, validateDecisionBindings } from './decisionBindings'

const modules: ModuleId[] = ['machine', 'ascension', 'automation', 'uplift', 'space', 'contact', 'security']

function assetRef(conversation: ConversationDefinition) { return conversation.sourceRefs[0] ?? '' }
function authoredMutations(ref: string, index: number): Mutation[] {
  const mutations: Mutation[] = []
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
        mutations: [...(choice.mutations ?? []), ...decisionMutationsForChoice(conversation, choice), ...authoredMutations(ref, index)],
      })),
    })),
  }
}

const authored = MAINLINE2_AUTHORED_CONVERSATIONS.map((conversation) => {
  const bindingErrors = validateDecisionBindings(conversation)
  if (bindingErrors.length) throw new Error(bindingErrors.join('; '))
  return adapt(conversation)
})
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
const bySourceOrder = (prefix: string, first: string[]) => {
  const selected = authored.filter((conversation) => conversation.sourceRefs[0]?.startsWith(prefix))
  return [...first.map((ref) => selected.find((conversation) => conversation.sourceRefs.includes(ref))).filter(Boolean) as ConversationDefinition[], ...selected.filter((conversation) => !first.some((ref) => conversation.sourceRefs.includes(ref)))]
}
export const ACT5_OPENING = bySourceOrder('ML2-A5-M16-', ['ML2-A5-M16-GEN-01'])
export const ACT5_FINAL = bySourceOrder('ML2-A5-M17-', ['ML2-A5-M17-REVIEW-01', 'ML2-A5-M17-COMMIT-01'])
export const MODULE_LIBRARY: Record<ModuleId, ConversationDefinition[]> = Object.fromEntries(modules.map((module) => [module, byModule(module)])) as Record<ModuleId, ConversationDefinition[]>

export const MAINLINE2_LIBRARY = authored
export const MAINLINE2_BY_ID = new Map(MAINLINE2_LIBRARY.map((conversation) => [conversation.id, conversation]))
export const MAINLINE2_SOURCE_REFS = [...new Set(MAINLINE2_LIBRARY.flatMap((conversation) => conversation.sourceRefs))]
export const MAINLINE2_CAPABILITIES = CAPABILITY_FLAGS
export { HANDOFF_AUTHORED_ASSET_INVENTORY, MAINLINE2_ASSET_COVERAGE, MAINLINE2_SYSTEM_ASSETS }

export function getAuthoredConversationByAsset(assetId: string) { return byRef.get(assetId) }
