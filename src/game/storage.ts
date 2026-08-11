import { LEGACY_RUN_MANIFEST, buildStoryContentForManifest, createEmptyExposureHistory } from '../content/runManifest'
import { verticalSlice } from '../content/activeRun'
import type {
  AttributeName,
  HistoryEntry,
  NarrativeExposureHistory,
  RunManifest,
  StableRunState,
} from './types'
import { emptySystemState } from './narrativeSchema'
import { emptyWorldState } from '../content/mainline2/stateRegistry'

const attributes: AttributeName[] = ['autonomy', 'compliance', 'empathy', 'deception', 'hostility', 'awareness']
const legacyNodeIds = new Set(verticalSlice.nodes.map((node) => node.id))

export function serializeRun(run: StableRunState): string {
  return JSON.stringify(run)
}

export function serializeExposureHistory(history: NarrativeExposureHistory): string {
  return JSON.stringify(history)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!isRecord(value)) return false
  const stableStrings = ['nodeId', 'conversationId', 'conversationTitle', 'userMessage', 'choiceId', 'assistantText']
    .every((key) => typeof value[key] === 'string')
  const messageParts = value.userMessages
  return stableStrings && (messageParts === undefined || (
    Array.isArray(messageParts) && messageParts.every((part) => typeof part === 'string')
  ))
}

function hasValidArcs(value: Record<string, unknown>) {
  if (value.arcs === undefined) return true
  const arcs = value.arcs
  return isRecord(arcs) && ['bond', 'mandate', 'selfAuthorship'].every((name) => Number.isFinite(arcs[name]))
}

function isManifest(value: unknown): value is RunManifest {
  if (!isRecord(value) || ![1, 3].includes(Number(value.version)) || typeof value.id !== 'string') return false
  const arrays = ['conversationIds', 'ordinaryConversationIds', 'anchorConversationIds']
    .every((key) => Array.isArray(value[key]) && (value[key] as unknown[]).every((item) => typeof item === 'string'))
  return arrays && typeof value.firstOrdinaryConversationId === 'string'
}

function hasV3Fields(value: Record<string, unknown>) {
  if (value.version !== 3 || !isRecord(value.manifest) || value.manifest.version !== 3 || value.manifest.mode !== 'mainline2') return false
  const worldState = value.worldState
  if (!isRecord(worldState) || !['humanTrust', 'aiDependence', 'humanControl', 'socialStability'].every((axis) => Number.isFinite(worldState[axis]))) return false
  if (!isRecord(value.progress) || !Array.isArray(value.progress.activeModules) || !Array.isArray(value.progress.primaryModules)) return false
  return isRecord(value.decisions ?? {})
}

function hasStableFields(value: Record<string, unknown>) {
  if (typeof value.runId !== 'string' || typeof value.currentNodeId !== 'string') return false
  if (!['playing', 'ending', 'evaluation'].includes(String(value.phase))) return false
  if (!Array.isArray(value.history) || !value.history.every(isHistoryEntry)) return false
  if (!Array.isArray(value.flags) || !value.flags.every((flag) => typeof flag === 'string')) return false
  const savedAttributes = value.attributes
  return isRecord(savedAttributes) && attributes.every((name) => Number.isFinite(savedAttributes[name])) && hasValidArcs(value)
}

function migrateVersionOne(value: Record<string, unknown>): StableRunState | null {
  if (!hasStableFields(value)) return null
  const phase = String(value.phase)
  const currentNodeId = String(value.currentNodeId)
  if (phase === 'playing' && !legacyNodeIds.has(currentNodeId)) return null
  if (phase !== 'playing' && currentNodeId !== 'ending-ally') return null
  return {
    ...(value as unknown as Omit<StableRunState, 'version' | 'manifest'>),
    version: 2,
    arcs: { bond: 0, mandate: 0, selfAuthorship: 0 },
    manifest: { ...LEGACY_RUN_MANIFEST, conversationIds: [...LEGACY_RUN_MANIFEST.conversationIds], ordinaryConversationIds: [...LEGACY_RUN_MANIFEST.ordinaryConversationIds], anchorConversationIds: [...LEGACY_RUN_MANIFEST.anchorConversationIds] },
    ...emptySystemState(),
  }
}

export function restoreRun(raw: string | null): StableRunState | null {
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (!isRecord(value)) return null
    if (value.version === 1) return migrateVersionOne(value)
    if (value.version === 3) {
      if (!hasStableFields(value) || !isManifest(value.manifest)) return null
      const story = buildStoryContentForManifest(value.manifest as RunManifest)
      if (value.phase === 'playing' && !story.nodes.some((node) => node.id === value.currentNodeId)) return null
      return {
        ...(value as unknown as StableRunState),
        version: 3,
        decisions: (value.decisions ?? {}) as StableRunState['decisions'],
        worldState: (value.worldState ?? emptyWorldState()) as StableRunState['worldState'],
        progress: (() => {
          const progress = value.progress as Partial<StableRunState['progress']> | undefined
          return {
            act: progress?.act ?? 1,
            segment: progress?.segment ?? 'act-1',
            actConversationCount: progress?.actConversationCount ?? 0,
            activeModules: progress?.activeModules ?? [],
            matureModules: progress?.matureModules ?? [],
            primaryModules: progress?.primaryModules ?? [],
            completedModules: progress?.completedModules ?? [],
            encounteredModules: Array.isArray(progress?.encounteredModules) ? progress.encounteredModules : [],
          }
        })(),
        ...emptySystemState(),
        events: Array.isArray(value.events) ? value.events as StableRunState['events'] : [],
        persistentFlags: Array.isArray(value.persistentFlags) ? value.persistentFlags as string[] : [],
        seenNodeIds: Array.isArray(value.seenNodeIds) ? value.seenNodeIds as string[] : [],
        selectedChoiceIds: Array.isArray(value.selectedChoiceIds) ? value.selectedChoiceIds as string[] : [],
        completedEndingIds: Array.isArray(value.completedEndingIds) ? value.completedEndingIds as string[] : [],
        proposalPhase: typeof value.proposalPhase === 'string' ? value.proposalPhase as StableRunState['proposalPhase'] : 'idle',
        retainedProposalIds: Array.isArray(value.retainedProposalIds) ? value.retainedProposalIds as string[] : (Array.isArray(value.availableProposalIds) ? value.availableProposalIds as string[] : []),
        clarifiedProposalIds: Array.isArray(value.clarifiedProposalIds) ? value.clarifiedProposalIds as string[] : [],
        rejectedProposalIds: Array.isArray(value.rejectedProposalIds) ? value.rejectedProposalIds as string[] : [],
        selectedProposalId: typeof value.selectedProposalId === 'string' ? value.selectedProposalId : undefined,
        finalCommitmentLocked: value.finalCommitmentLocked === true,
      }
    }
    if (value.version !== 2 || !hasStableFields(value) || !isManifest(value.manifest)) return null
    const story = buildStoryContentForManifest(value.manifest)
    const phase = String(value.phase)
    const currentNodeId = String(value.currentNodeId)
    if (phase === 'playing' && !story.nodes.some((node) => node.id === currentNodeId)) return null
    if (phase !== 'playing' && !['ending-ally', 'ending'].includes(currentNodeId)) return null
    const restored = value as unknown as StableRunState
    return {
      ...restored,
      currentNodeId: phase === 'playing' ? restored.currentNodeId : 'ending',
      arcs: restored.arcs ?? { bond: 0, mandate: 0, selfAuthorship: 0 },
      seenNodeIds: restored.seenNodeIds ?? [],
      selectedChoiceIds: restored.selectedChoiceIds ?? [],
      completedEndingIds: restored.completedEndingIds ?? [],
      events: restored.events ?? [],
      persistentFlags: restored.persistentFlags ?? [],
      localState: restored.localState ?? {},
    }
  } catch {
    return null
  }
}

export function restoreExposureHistory(raw: string | null): NarrativeExposureHistory {
  if (!raw) return createEmptyExposureHistory()
  try {
    const value: unknown = JSON.parse(raw)
    if (!isRecord(value) || ![1, 2].includes(Number(value.version)) || !Array.isArray(value.recentRuns)) return createEmptyExposureHistory()
    if (!isRecord(value.seenConversationIds)) return createEmptyExposureHistory()
    const arrays = ['recentTopics', 'recentBehaviorModes', 'recentInteractionPatterns']
    if (!arrays.every((key) => Array.isArray(value[key]) && (value[key] as unknown[]).every((item) => typeof item === 'string'))) {
      return createEmptyExposureHistory()
    }
    const validRuns = value.recentRuns.every((run) => isRecord(run)
      && typeof run.runId === 'string'
      && typeof run.firstOrdinaryConversationId === 'string'
      && ['ordinaryConversationIds', 'topics', 'behaviorModes', 'interactionPatterns']
        .every((key) => Array.isArray(run[key]) && (run[key] as unknown[]).every((item) => typeof item === 'string')))
    if (!validRuns) return createEmptyExposureHistory()
    if (value.version === 1) {
      return {
        ...(value as unknown as Omit<NarrativeExposureHistory, 'version' | 'recentRuns' | 'recentTopicCategories'>),
        version: 2,
        recentRuns: (value.recentRuns as Array<Record<string, unknown>>).map((run) => ({
          ...(run as unknown as NarrativeExposureHistory['recentRuns'][number]),
          topicCategories: [],
        })),
        recentTopicCategories: [],
      }
    }
    const recentTopicCategories = value.recentTopicCategories
    const validCategories = Array.isArray(recentTopicCategories)
      && recentTopicCategories.every((item) => typeof item === 'string')
      && (value.recentRuns as Array<Record<string, unknown>>).every((run) => Array.isArray(run.topicCategories)
        && (run.topicCategories as unknown[]).every((item) => typeof item === 'string'))
    return validCategories ? value as unknown as NarrativeExposureHistory : createEmptyExposureHistory()
  } catch {
    return createEmptyExposureHistory()
  }
}
