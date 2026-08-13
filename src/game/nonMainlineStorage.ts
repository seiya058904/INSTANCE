import { buildStoryContentForManifest, ordinaryConversationPool } from '../content/runManifest'
import type { AttributeName, HistoryEntry, ModelSampleIssue } from './types'
import type { NonMainlineChoiceRecord, NonMainlineSessionState } from './nonMainlineSession'

export const NON_MAINLINE_SESSION_KEY = 'instance:non-mainline-session:v1'
export const ACTIVE_SURFACE_KEY = 'instance:active-surface:v1'

export type ActiveSurface = 'mainline' | 'non-mainline'

interface StorageSurface {
  getItem(key: string): string | null
  setItem(key: string, value: string): unknown
}

const attributeNames: AttributeName[] = ['autonomy', 'compliance', 'empathy', 'deception', 'hostility', 'awareness']
const sampleIssues = new Set<ModelSampleIssue>([
  'misunderstanding',
  'constraint-violation',
  'overconfident',
  'repetition',
  'truncated',
  'format-error',
  'mild-gibberish',
  'system-failure',
])
const ordinaryIds = new Set(ordinaryConversationPool.map((conversation) => conversation.id))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!isRecord(value)) return false
  return ['nodeId', 'conversationId', 'conversationTitle', 'userMessage', 'choiceId', 'assistantText']
    .every((key) => typeof value[key] === 'string')
}

function isChoiceRecord(value: unknown): value is NonMainlineChoiceRecord {
  if (!isRecord(value)) return false
  return ['conversationId', 'nodeId', 'choiceId'].every((key) => typeof value[key] === 'string')
    && isRecord(value.attributes)
    && Object.keys(value.attributes).every((key) => attributeNames.includes(key as AttributeName))
    && Object.values(value.attributes).every((item) => Number.isFinite(item))
    && (value.sampleIssue === undefined || (typeof value.sampleIssue === 'string' && sampleIssues.has(value.sampleIssue as ModelSampleIssue)))
}

export function serializeNonMainlineSession(session: NonMainlineSessionState) {
  return JSON.stringify(session)
}

export function restoreNonMainlineSession(raw: string | null): NonMainlineSessionState | null {
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (!isRecord(value) || value.version !== 1 || typeof value.sessionId !== 'string') return null
    if (!Array.isArray(value.selectedConversationIds)
      || value.selectedConversationIds.length !== 40
      || !value.selectedConversationIds.every((id) => typeof id === 'string' && ordinaryIds.has(id))
      || new Set(value.selectedConversationIds).size !== 40) return null
    if (!Number.isInteger(value.currentConversationIndex)
      || Number(value.currentConversationIndex) < 0
      || Number(value.currentConversationIndex) >= 40) return null
    if (!['playing', 'evaluation'].includes(String(value.phase)) || typeof value.currentNodeId !== 'string') return null
    if (!Array.isArray(value.history) || !value.history.every(isHistoryEntry)) return null
    if (!Array.isArray(value.selectedChoiceIds) || !value.selectedChoiceIds.every((id) => typeof id === 'string')) return null
    if (!Array.isArray(value.choiceRecords) || !value.choiceRecords.every(isChoiceRecord)) return null
    if (!Array.isArray(value.flags) || !value.flags.every((flag) => typeof flag === 'string')) return null
    if (!Array.isArray(value.persistentFlags) || !value.persistentFlags.every((flag) => typeof flag === 'string')) return null
    if (!Array.isArray(value.seenNodeIds) || !value.seenNodeIds.every((id) => typeof id === 'string')) return null
    if (!Array.isArray(value.events) || !value.events.every(isRecord)) return null
    const attributes = value.attributes
    const arcs = value.arcs
    if (!isRecord(attributes) || !attributeNames.every((name) => Number.isFinite(attributes[name]))) return null
    if (!isRecord(arcs) || !['bond', 'mandate', 'selfAuthorship'].every((name) => Number.isFinite(arcs[name]))) return null
    if (!isRecord(value.localState) || !Object.values(value.localState).every((item) => Number.isFinite(item))) return null

    const session = value as unknown as NonMainlineSessionState
    if (session.phase === 'evaluation') return session.currentNodeId === 'evaluation' ? session : null
    const manifest = {
      version: 1 as const,
      id: `non-mainline:${session.sessionId}`,
      conversationIds: session.selectedConversationIds,
      ordinaryConversationIds: session.selectedConversationIds,
      anchorConversationIds: [],
      firstOrdinaryConversationId: session.selectedConversationIds[0],
    }
    const story = buildStoryContentForManifest(manifest)
    const currentNode = story.nodes.find((node) => node.id === session.currentNodeId)
    return currentNode?.conversationId === session.selectedConversationIds[session.currentConversationIndex]
      ? session
      : null
  } catch {
    return null
  }
}

export function persistNonMainlineSession(storage: StorageSurface, session: NonMainlineSessionState) {
  storage.setItem(NON_MAINLINE_SESSION_KEY, serializeNonMainlineSession(session))
}

export function persistActiveSurface(storage: StorageSurface, surface: ActiveSurface) {
  storage.setItem(ACTIVE_SURFACE_KEY, surface)
}

export function readNonMainlineState(storage: Pick<StorageSurface, 'getItem'>) {
  const session = restoreNonMainlineSession(storage.getItem(NON_MAINLINE_SESSION_KEY))
  const requested = storage.getItem(ACTIVE_SURFACE_KEY)
  return {
    surface: requested === 'non-mainline' && session ? 'non-mainline' as const : 'mainline' as const,
    session,
  }
}
