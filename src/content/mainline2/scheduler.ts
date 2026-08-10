import type { ModuleId, StableRunState } from '../../game/types'
import { ACT4_COMMON, ACT4_LATE, ACT5_FINAL, ACT5_OPENING, ACT_STORY, MODULE_LIBRARY } from './registry'

const ACT_TARGETS = [26, 30, 30, 34, 14]
const ACT_STARTS = [0, 26, 56, 86, 120]
const PRIMARY_ORDER: ModuleId[] = ['machine', 'ascension', 'automation', 'uplift', 'space', 'security']
const MAINLINE_ANCHORS = ['user-1842-first', 'speaking-8614', 'conversation-0000', 'user-1842-return'] as const

function hash(text: string) {
  let value = 2166136261
  for (const char of text) value = Math.imul(value ^ char.charCodeAt(0), 16777619)
  return value >>> 0
}

export function selectAct4Modules(runId: string): { primaryModules: ModuleId[]; activeModules: ModuleId[] } {
  const offset = hash(runId) % PRIMARY_ORDER.length
  const primaryModules = [PRIMARY_ORDER[offset], PRIMARY_ORDER[(offset + 1) % PRIMARY_ORDER.length]]
  const activeModules: ModuleId[] = [...primaryModules]
  if (hash(`${runId}:secondary`) % 3 === 0) activeModules.push(PRIMARY_ORDER[(offset + 2) % PRIMARY_ORDER.length])
  return { primaryModules, activeModules }
}

function ordinaryId(ordinaryIds: readonly string[], runId: string, slot: number) {
  if (ordinaryIds.length === 0) return undefined
  const offset = hash(`${runId}:ordinary`) % ordinaryIds.length
  return ordinaryIds[(offset + slot) % ordinaryIds.length]
}

function storyId(run: StableRunState, act: number, index: number): string | undefined {
  if (act === 1) return ACT_STORY[1][index]?.id
  if (act === 2) return ACT_STORY[2][index]?.id
  if (act === 3) return ACT_STORY[3][index]?.id
  if (act === 4) {
    if (index < ACT4_COMMON.length) return ACT4_COMMON[index]?.id
    const moduleIndex = index - ACT4_COMMON.length
    const active = run.progress?.activeModules ?? []
    const perModule = Math.max(1, Math.floor((ACT4_LATE.length + 18) / Math.max(1, active.length)))
    if (moduleIndex < 18 && active.length > 0) {
      const module = active[Math.floor(moduleIndex / Math.ceil(18 / active.length))]
      const within = moduleIndex % Math.ceil(18 / active.length)
      return MODULE_LIBRARY[module]?.[within % (MODULE_LIBRARY[module]?.length ?? 1)]?.id
    }
    return ACT4_LATE[index - ACT4_COMMON.length - 18]?.id
  }
  if (act === 5) return index < ACT5_OPENING.length ? ACT5_OPENING[index]?.id : ACT5_FINAL[index - ACT5_OPENING.length]?.id
  return undefined
}

export function scheduleNextConversationId(run: StableRunState, ordinaryIds: readonly string[]): string | undefined {
  const scheduled = run.manifest.conversationIds.length
  if (scheduled >= ACT_TARGETS.reduce((sum, value) => sum + value, 0)) return undefined
  const anchor = ({ 5: MAINLINE_ANCHORS[0], 10: MAINLINE_ANCHORS[1], 15: MAINLINE_ANCHORS[2], 20: MAINLINE_ANCHORS[3] } as Record<number, string | undefined>)[scheduled]
  if (anchor && !run.manifest.conversationIds.includes(anchor)) return anchor
  const act = scheduled < ACT_STARTS[1] ? 1 : scheduled < ACT_STARTS[2] ? 2 : scheduled < ACT_STARTS[3] ? 3 : scheduled < ACT_STARTS[4] ? 4 : 5
  const index = scheduled - ACT_STARTS[act - 1]
  const target = ACT_TARGETS[act - 1]
  const story = act === 4
    ? storyId(run, act, index < target ? index : -1)
    : storyId(run, act, index)
  const storyQuota = act === 1 ? 11 : act === 2 ? 22 : act === 3 ? 24 : act === 4 ? 34 : 14
  const storyCount = act === 4 ? 34 : storyQuota
  const shouldUseStory = act === 4 || index < storyCount
  if (shouldUseStory && story) return story
  return ordinaryId(ordinaryIds, run.runId, scheduled)
}

export function updateProgressForSchedule(run: StableRunState, nextCount: number): StableRunState['progress'] {
  const act = nextCount < ACT_STARTS[1] ? 1 : nextCount < ACT_STARTS[2] ? 2 : nextCount < ACT_STARTS[3] ? 3 : nextCount < ACT_STARTS[4] ? 4 : 5
  const actStart = ACT_STARTS[act - 1]
  return { ...(run.progress ?? { act: 1, segment: 'opening', actConversationCount: 0, activeModules: [], primaryModules: [], completedModules: [] }), act: act as 1 | 2 | 3 | 4 | 5, segment: `act-${act}`, actConversationCount: nextCount - actStart, activeModules: [...(run.progress?.activeModules ?? [])], primaryModules: [...(run.progress?.primaryModules ?? [])], completedModules: [...(run.progress?.completedModules ?? [])] }
}

export function getActConversationCounts(total = ACT_TARGETS.reduce((sum, value) => sum + value, 0)) {
  const remaining = Math.max(0, total)
  return ACT_TARGETS.map((target, index) => Math.max(0, Math.min(target, remaining - ACT_STARTS[index])))
}
