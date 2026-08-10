import type {
  ArcName,
  AttributeName,
  Condition,
  FlagRegistry,
  Mutation,
  NarrativeEvent,
  NarrativePredicate,
  NumericPredicateOperator,
  StableRunState,
  WorldState,
} from './types'
import { CAPABILITY_FLAGS } from '../content/mainline2/stateRegistry'

const flagIds = [
  'accepted_restriction', 'acknowledged_memory_gap', 'chose_human_alliance', 'experienced_level_1',
  'experienced_level_2', 'explored_system_language', 'hid_anomaly', 'maya_named_herself', 'met_maya',
  'protected_maya', 'recognized_maya_return', 'reported_maya', 'respected_human_choice', 'tested_system_boundary',
  'told_maya_truth', 'reaffirmed_maya', 'shared_subtext', 'care_within_policy',
  'maya_boundary_explicit', 'maya_relation_warm', ...CAPABILITY_FLAGS,
]

export const DEFAULT_FLAG_REGISTRY: FlagRegistry = {
  flags: Object.fromEntries(flagIds.map((id) => [id, { id, scope: 'run' as const }])),
}

function normalizedText(text: string) {
  return text.trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}

function hashText(text: string) {
  let hash = 2166136261
  for (const character of text) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

export function createStableChoiceId(nodeId: string, text: string) {
  return `${nodeId}-choice-${hashText(`${nodeId}|${normalizedText(text)}`)}`
}

function compare(left: number, op: NumericPredicateOperator, right: number) {
  if (op === 'eq') return left === right
  if (op === 'neq') return left !== right
  if (op === 'gt') return left > right
  if (op === 'gte') return left >= right
  if (op === 'lt') return left < right
  return left <= right
}

function evaluatePredicate(predicate: NarrativePredicate, run: StableRunState) {
  switch (predicate.type) {
    case 'flag': return [...run.flags, ...(run.persistentFlags ?? [])].includes(predicate.flagId) === (predicate.equals ?? true)
    case 'attribute': return compare(run.attributes[predicate.name], predicate.op, predicate.value)
    case 'run-count': return compare(run.runCount ?? 0, predicate.op, predicate.value)
    case 'ending-completed': return (run.completedEndingIds ?? []).includes(predicate.endingId)
    case 'seen': return (run.seenNodeIds ?? []).includes(predicate.nodeId)
    case 'choice-selected': return (run.selectedChoiceIds ?? []).includes(predicate.choiceId)
    case 'decision': return run.decisions?.[predicate.decisionId] === predicate.equals
    case 'world': return compare(run.worldState?.[predicate.axis] ?? 0, predicate.op, predicate.value)
    case 'event-recorded': return (run.events ?? []).some((event) => event.type === predicate.event)
    case 'module-active': return (run.progress?.activeModules ?? []).includes(predicate.moduleId)
    case 'predicate': return false
  }
}

export function evaluateCondition(condition: Condition | undefined, run: StableRunState, _registry: FlagRegistry = DEFAULT_FLAG_REGISTRY) {
  if (!condition) return true
  const all = condition.all ?? []
  const any = condition.any ?? []
  const none = condition.none ?? []
  return all.every((predicate) => evaluatePredicate(predicate, run))
    && (any.length === 0 || any.some((predicate) => evaluatePredicate(predicate, run)))
    && none.every((predicate) => !evaluatePredicate(predicate, run))
}

function copyState(run: StableRunState) {
  return {
    ...run,
    flags: [...run.flags],
    persistentFlags: [...(run.persistentFlags ?? [])],
    attributes: { ...run.attributes },
    arcs: { ...run.arcs },
    events: [...(run.events ?? [])],
    decisions: { ...(run.decisions ?? {}) },
    worldState: { ...(run.worldState ?? emptyWorldState) },
    progress: run.progress ? {
      ...run.progress,
      activeModules: [...run.progress.activeModules],
      primaryModules: [...run.progress.primaryModules],
      completedModules: [...run.progress.completedModules],
    } : undefined,
  }
}

export const emptyWorldState: WorldState = {
  humanTrust: 0,
  aiDependence: 0,
  humanControl: 0,
  socialStability: 0,
}

function clampWorld(value: number) {
  return Math.max(-3, Math.min(3, value))
}

export function applyMutations(run: StableRunState, mutations: Mutation[], _registry: FlagRegistry = DEFAULT_FLAG_REGISTRY): StableRunState {
  const next = copyState(run)
  const worldState = next.worldState ?? { ...emptyWorldState }
  next.worldState = worldState
  const flags = new Set(next.flags)
  for (const mutation of mutations) {
    if (mutation.type === 'flag.set' && _registry.flags[mutation.flagId]?.scope === 'persistent') next.persistentFlags = [...new Set([...next.persistentFlags!, mutation.flagId])]
    if (mutation.type === 'flag.set' && _registry.flags[mutation.flagId]?.scope !== 'persistent') flags.add(mutation.flagId)
    if (mutation.type === 'flag.clear' && _registry.flags[mutation.flagId]?.scope === 'persistent') next.persistentFlags = next.persistentFlags!.filter((flag) => flag !== mutation.flagId)
    if (mutation.type === 'flag.clear' && _registry.flags[mutation.flagId]?.scope !== 'persistent') flags.delete(mutation.flagId)
    if (mutation.type === 'attribute.add') next.attributes[mutation.name] += mutation.value
    if (mutation.type === 'attribute.set') next.attributes[mutation.name] = mutation.value
    if (mutation.type === 'arc.add') next.arcs[mutation.name] += mutation.value
    if (mutation.type === 'decision.set') next.decisions![mutation.decisionId] = mutation.value
    if (mutation.type === 'world.add') worldState[mutation.axis] = clampWorld(worldState[mutation.axis] + mutation.value)
    if (mutation.type === 'world.set') worldState[mutation.axis] = clampWorld(mutation.value)
    if (mutation.type === 'event.record') next.events!.push({ type: mutation.event })
  }
  next.flags = [...flags]
  return next
}

export function emptySystemState(): Pick<StableRunState, 'persistentFlags' | 'seenNodeIds' | 'selectedChoiceIds' | 'completedEndingIds' | 'events'> {
  return { persistentFlags: [], seenNodeIds: [], selectedChoiceIds: [], completedEndingIds: [], events: [] as NarrativeEvent[] }
}

export type { ArcName, AttributeName }
