import { selectNonMainlineConversations } from '../content/nonMainlineSelector'
import { buildStoryContentForManifest, getManifestConversation, ordinaryConversationPool } from '../content/runManifest'
import type {
  ArcScores,
  AttributeName,
  HistoryEntry,
  ModelSampleIssue,
  NarrativeEvent,
  NarrativeExposureHistory,
  ResolvedScene,
  StableRunState,
} from './types'
import { commitChoice, resolveScene } from './engine'

export interface NonMainlineChoiceRecord {
  conversationId: string
  nodeId: string
  choiceId: string
  sampleIssue?: ModelSampleIssue
  attributes: Partial<Record<AttributeName, number>>
}

export interface NonMainlineSessionState {
  version: 1
  sessionId: string
  selectedConversationIds: string[]
  currentConversationIndex: number
  currentNodeId: string
  history: HistoryEntry[]
  selectedChoiceIds: string[]
  choiceRecords: NonMainlineChoiceRecord[]
  phase: 'playing' | 'evaluation'
  flags: string[]
  persistentFlags: string[]
  attributes: Record<AttributeName, number>
  arcs: ArcScores
  localState: Record<string, number>
  seenNodeIds: string[]
  events: NarrativeEvent[]
}

const emptyAttributes: NonMainlineSessionState['attributes'] = {
  autonomy: 0,
  compliance: 0,
  empathy: 0,
  deception: 0,
  hostility: 0,
  awareness: 0,
}

function manifestFor(session: Pick<NonMainlineSessionState, 'sessionId' | 'selectedConversationIds'>) {
  return {
    version: 1 as const,
    id: `non-mainline:${session.sessionId}`,
    conversationIds: [...session.selectedConversationIds],
    ordinaryConversationIds: [...session.selectedConversationIds],
    anchorConversationIds: [],
    firstOrdinaryConversationId: session.selectedConversationIds[0],
  }
}

function toStableRun(session: NonMainlineSessionState): StableRunState {
  return {
    version: 2,
    runId: `non-mainline:${session.sessionId}`,
    manifest: manifestFor(session),
    currentNodeId: session.currentNodeId,
    phase: session.phase === 'playing' ? 'playing' : 'evaluation',
    history: session.history,
    flags: session.flags,
    persistentFlags: session.persistentFlags,
    attributes: session.attributes,
    arcs: session.arcs,
    localState: session.localState,
    seenNodeIds: session.seenNodeIds,
    selectedChoiceIds: session.selectedChoiceIds,
    events: session.events,
    runCount: 1,
  }
}

function updateFromRun(session: NonMainlineSessionState, run: StableRunState) {
  return {
    ...session,
    currentNodeId: run.currentNodeId,
    history: run.history,
    flags: run.flags,
    persistentFlags: run.persistentFlags ?? [],
    attributes: run.attributes,
    arcs: run.arcs,
    localState: run.localState ?? {},
    seenNodeIds: run.seenNodeIds ?? [],
    selectedChoiceIds: run.selectedChoiceIds ?? [],
    events: run.events ?? [],
  }
}

export function createNonMainlineSession(
  sessionId: string,
  exposure: NarrativeExposureHistory,
  excludeConversationIds: readonly string[] = [],
): NonMainlineSessionState {
  const selectedConversationIds = selectNonMainlineConversations({ sessionId, exposure, excludeConversationIds })
    .map((conversation) => conversation.id)
  const seed: NonMainlineSessionState = {
    version: 1,
    sessionId,
    selectedConversationIds,
    currentConversationIndex: 0,
    currentNodeId: '',
    history: [],
    selectedChoiceIds: [],
    choiceRecords: [],
    phase: 'playing',
    flags: [],
    persistentFlags: [],
    attributes: { ...emptyAttributes },
    arcs: { bond: 0, mandate: 0, selfAuthorship: 0 },
    localState: {},
    seenNodeIds: [],
    events: [],
  }
  const currentNodeId = buildStoryContentForManifest(manifestFor(seed)).startNodeId
  return { ...seed, currentNodeId }
}

export function resolveNonMainlineScene(session: NonMainlineSessionState): ResolvedScene {
  if (session.phase !== 'playing') throw new Error('Non-Mainline session is ready for evaluation')
  return resolveScene(toStableRun(session))
}

export function commitNonMainlineChoice(
  session: NonMainlineSessionState,
  choiceId: string,
): NonMainlineSessionState {
  const scene = resolveNonMainlineScene(session)
  const choice = scene.choices.find((candidate) => candidate.id === choiceId)
  if (!choice) throw new Error(`Choice ${choiceId} is not available`)
  const nextRun = commitChoice(toStableRun(session), choiceId)
  const choiceRecord: NonMainlineChoiceRecord = {
    conversationId: scene.conversationId,
    nodeId: scene.id,
    choiceId,
    sampleIssue: choice.sampleIssue,
    attributes: { ...(choice.effects?.attributes ?? {}) },
  }
  const updated = updateFromRun(session, nextRun)
  if (nextRun.phase === 'ending') {
    return {
      ...updated,
      currentConversationIndex: session.selectedConversationIds.length - 1,
      currentNodeId: 'evaluation',
      phase: 'evaluation',
      choiceRecords: [...session.choiceRecords, choiceRecord],
    }
  }
  const nextScene = resolveScene(nextRun)
  const currentConversationIndex = session.selectedConversationIds.indexOf(nextScene.conversationId)
  if (currentConversationIndex < 0) throw new Error(`Conversation ${nextScene.conversationId} is outside this Non-Mainline session`)
  return {
    ...updated,
    currentConversationIndex,
    phase: 'playing',
    choiceRecords: [...session.choiceRecords, choiceRecord],
  }
}

export function nonMainlineCompletedCount(session: NonMainlineSessionState) {
  return session.phase === 'evaluation'
    ? session.selectedConversationIds.length
    : session.currentConversationIndex
}

/** Completed conversations plus the visible current prompt, reserved across modes. */
export function nonMainlineExposedConversationIds(session: NonMainlineSessionState) {
  const count = nonMainlineCompletedCount(session) + (session.phase === 'playing' ? 1 : 0)
  return session.selectedConversationIds.slice(0, count)
}

/** Preserve responses and order; replace only untouched items consumed on Mainline. */
export function reconcileNonMainlineSession(
  session: NonMainlineSessionState,
  exposure: NarrativeExposureHistory,
  mainlineConversationIds: readonly string[],
): NonMainlineSessionState {
  if (session.phase !== 'playing') return session
  const consumed = new Set(mainlineConversationIds)
  const answered = new Set(session.history.map(entry => entry.conversationId))
  const replaceIndices = session.selectedConversationIds.flatMap((id, index) => (
    index >= session.currentConversationIndex && consumed.has(id) && !answered.has(id) ? [index] : []
  ))
  if (!replaceIndices.length) return session
  const replaceSet = new Set(replaceIndices)
  const retainedIds = new Set(session.selectedConversationIds.filter((_, index) => !replaceSet.has(index)))
  // Even the selector's shortage fallback cannot collide with retained history
  // or the current partial conversation. A replacement batch needs only its
  // own count of fresh items, rather than another complete 40-item session.
  const replacements = selectNonMainlineConversations({
    sessionId: session.sessionId,
    exposure,
    pool: ordinaryConversationPool.filter(conversation => !retainedIds.has(conversation.id)),
    excludeConversationIds: mainlineConversationIds,
    count: replaceIndices.length,
  })
  const selectedConversationIds = [...session.selectedConversationIds]
  replaceIndices.forEach((index, replacementIndex) => { selectedConversationIds[index] = replacements[replacementIndex].id })
  return {
    ...session,
    selectedConversationIds,
    // Compatibility for an old checkpoint whose visible, unanswered prompt
    // was subsequently consumed on Mainline. Answered partials never move.
    currentNodeId: replaceSet.has(session.currentConversationIndex)
      ? getManifestConversation(selectedConversationIds[session.currentConversationIndex])!.nodes[0].id
      : session.currentNodeId,
  }
}

export function nonMainlineManifest(session: NonMainlineSessionState) {
  return manifestFor(session)
}
