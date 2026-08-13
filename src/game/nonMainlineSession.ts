import { selectNonMainlineConversations } from '../content/nonMainlineSelector'
import { buildStoryContentForManifest } from '../content/runManifest'
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
): NonMainlineSessionState {
  const selectedConversationIds = selectNonMainlineConversations({ sessionId, exposure })
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

export function nonMainlineManifest(session: NonMainlineSessionState) {
  return manifestFor(session)
}
