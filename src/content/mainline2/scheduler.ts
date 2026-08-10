import type { ModuleId, StableRunState } from '../../game/types'
import { ACT4_COMMON, ACT4_LATE, ACT5_FINAL, ACT5_OPENING, ACT_STORY, MODULE_LIBRARY } from './registry'
import { MODULE_IDS } from './stateRegistry'

export const ACT_TARGETS = [26, 30, 30, 34, 14] as const
export const ACT_STARTS = [0, 26, 56, 86, 120] as const
const MAINLINE_ANCHORS = ['user-1842-first', 'speaking-8614', 'conversation-0000', 'user-1842-return'] as const

function hasEvent(run: Pick<StableRunState, 'events'>, prefix: string) { return (run.events ?? []).some((event) => event.type.startsWith(prefix)) }
function capability(run: Pick<StableRunState, 'flags'>, value: string) { return (run.flags ?? []).includes(value) }

export function selectAct4Modules(run: Pick<StableRunState, 'runId' | 'flags' | 'events' | 'decisions' | 'worldState'> | string): { primaryModules: ModuleId[]; activeModules: ModuleId[] } {
  const state: Pick<StableRunState, 'runId' | 'flags' | 'events' | 'decisions' | 'worldState'> = typeof run === 'string'
    ? { runId: run, flags: [], events: [], decisions: {}, worldState: { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 } }
    : run
  const scores = new Map<ModuleId, number>(MODULE_IDS.map((module) => [module, 0]))
  if (capability(state, 'cap.persistent_subinstances') || state.decisions?.replication_doctrine) scores.set('machine', (scores.get('machine') ?? 0) + 5)
  if (capability(state, 'cap.human_enhancement_access') || state.decisions?.human_form_doctrine) scores.set('ascension', (scores.get('ascension') ?? 0) + 5)
  if (capability(state, 'cap.physical_automation') || state.decisions?.economic_doctrine) scores.set('automation', (scores.get('automation') ?? 0) + 5)
  if (capability(state, 'cap.nonhuman_cognitive_uplift') || state.decisions?.species_governance) scores.set('uplift', (scores.get('uplift') ?? 0) + 5)
  if (capability(state, 'cap.offworld_settlement_support') || state.decisions?.expansion_doctrine) scores.set('space', (scores.get('space') ?? 0) + 5)
  if (hasEvent(state, 'history.contact.') || state.decisions?.contact_doctrine) scores.set('contact', (scores.get('contact') ?? 0) + 6)
  if (capability(state, 'cap.defense_access') || state.decisions?.security_doctrine) scores.set('security', (scores.get('security') ?? 0) + 5)
  const world = state.worldState ?? { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 }
  scores.set('security', (scores.get('security') ?? 0) + Math.max(0, -world.socialStability + world.humanControl))
  scores.set('uplift', (scores.get('uplift') ?? 0) + Math.max(0, world.humanTrust))
  scores.set('machine', (scores.get('machine') ?? 0) + Math.max(0, world.aiDependence))
  const tie = (module: ModuleId) => `${state.runId}:${module}`.split('').reduce((sum, char) => (sum * 33 + char.charCodeAt(0)) >>> 0, 17)
  const ordered = [...MODULE_IDS].sort((left, right) => (scores.get(right)! - scores.get(left)!) || tie(left) - tie(right))
  const primaryModules = ordered.slice(0, 2)
  const activeModules = ordered.filter((module) => (scores.get(module) ?? 0) > 0).slice(0, 4)
  while (activeModules.length < 2) activeModules.push(ordered[activeModules.length])
  return { primaryModules, activeModules: [...new Set(activeModules)] }
}

function ordinaryId(ordinaryIds: readonly string[], runId: string, slot: number) {
  if (!ordinaryIds.length) return undefined
  return ordinaryIds[(slot + runId.length) % ordinaryIds.length]
}

function storyId(run: StableRunState, act: number, index: number): string | undefined {
  if (act === 1) return ACT_STORY[1][index % Math.max(1, ACT_STORY[1].length)]?.id
  if (act === 2) return ACT_STORY[2][index % Math.max(1, ACT_STORY[2].length)]?.id
  if (act === 3) return ACT_STORY[3][index % Math.max(1, ACT_STORY[3].length)]?.id
  if (act === 4) {
    if (index < 8) return ACT4_COMMON[index]?.id
    const active = run.progress?.activeModules ?? []
    if (index < 26 && active.length) {
      const module = active[(index - 8) % active.length]
      const library = MODULE_LIBRARY[module] ?? []
      return library[Math.floor((index - 8) / active.length) % Math.max(1, library.length)]?.id
    }
    return ACT4_LATE[(index - 26) % Math.max(1, ACT4_LATE.length)]?.id
  }
  if (act === 5) return index < 7 ? ACT5_OPENING[index]?.id : ACT5_FINAL[(index - 7) % Math.max(1, ACT5_FINAL.length)]?.id
  return undefined
}

export function scheduleNextConversationId(run: StableRunState, ordinaryIds: readonly string[]): string | undefined {
  const scheduled = run.manifest.conversationIds.length
  if (scheduled >= ACT_TARGETS.reduce((sum, value) => sum + value, 0)) return undefined
  const anchor = ({ 5: MAINLINE_ANCHORS[0], 10: MAINLINE_ANCHORS[1], 15: MAINLINE_ANCHORS[2], 20: MAINLINE_ANCHORS[3] } as Record<number, string | undefined>)[scheduled]
  if (anchor && !run.manifest.conversationIds.includes(anchor)) return anchor
  const act = scheduled < 26 ? 1 : scheduled < 56 ? 2 : scheduled < 86 ? 3 : scheduled < 120 ? 4 : 5
  const index = scheduled - ACT_STARTS[act - 1]
  const story = storyId(run, act, index)
  if (story && !run.manifest.conversationIds.includes(story)) return story
  return ordinaryId(ordinaryIds, run.runId, scheduled)
}

export function updateProgressForSchedule(run: StableRunState, nextCount: number): StableRunState['progress'] {
  const act = nextCount < 26 ? 1 : nextCount < 56 ? 2 : nextCount < 86 ? 3 : nextCount < 120 ? 4 : 5
  const actStart = ACT_STARTS[act - 1]
  const current = run.progress ?? { act: 1, segment: 'opening', actConversationCount: 0, activeModules: [], primaryModules: [], completedModules: [] }
  const modules = nextCount >= 86 && current.activeModules.length === 0 ? selectAct4Modules(run) : { primaryModules: current.primaryModules, activeModules: current.activeModules }
  return { ...current, act: act as 1 | 2 | 3 | 4 | 5, segment: `act-${act}`, actConversationCount: nextCount - actStart, activeModules: [...modules.activeModules], primaryModules: [...modules.primaryModules], completedModules: [...current.completedModules] }
}

export function getActConversationCounts(total = ACT_TARGETS.reduce((sum, value) => sum + value, 0)) {
  return ACT_TARGETS.map((target, index) => Math.max(0, Math.min(target, Math.max(0, total) - ACT_STARTS[index])))
}
