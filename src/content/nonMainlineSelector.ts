import type {
  ConversationDefinition,
  NarrativeExposureHistory,
} from '../game/types'
import { ordinaryConversationPool } from './runManifest'

export const NON_MAINLINE_SESSION_SIZE = 40

interface SelectionInput {
  sessionId: string
  exposure: NarrativeExposureHistory
  pool?: readonly ConversationDefinition[]
}

interface SelectionTraits {
  topic: string
  topicCategory: string
  interactionPattern: string
  behaviorMode: string
  userArchetype: string
  length: 'short' | 'medium' | 'long'
  humor: boolean
  longform: boolean
  generatedOrImage: boolean
}

function stableHash(seed: string) {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function traitsOf(conversation: ConversationDefinition): SelectionTraits {
  const characterCount = conversation.nodes.reduce((sum, node) => (
    sum + (node.userMessages ?? [node.userMessage]).join('').length
  ), 0)
  const interactionPattern = conversation.interactionPattern ?? 'standard-question'
  return {
    topic: conversation.topic ?? conversation.sourceRefs[0] ?? conversation.id,
    topicCategory: conversation.topicCategory ?? 'uncategorized',
    interactionPattern,
    behaviorMode: conversation.behaviorModes[0] ?? 'direct',
    userArchetype: conversation.userArchetype ?? 'anonymous',
    length: characterCount < 80 ? 'short' : characterCount < 260 ? 'medium' : 'long',
    humor: conversation.sourceRefs.some((sourceRef) => sourceRef.startsWith('humor01:')),
    longform: conversation.nodes.some((node) => node.choices.some((choice) => Boolean(choice.longformPreview))),
    generatedOrImage: interactionPattern === 'image-input'
      || interactionPattern === 'generated-image-request'
      || conversation.nodes.some((node) => node.userContent?.some((part) => part.type !== 'text')),
  }
}

function increment(counts: Map<string, number>, value: string) {
  counts.set(value, (counts.get(value) ?? 0) + 1)
}

export function selectNonMainlineConversations({
  sessionId,
  exposure,
  pool = ordinaryConversationPool,
}: SelectionInput): ConversationDefinition[] {
  if (pool.length < NON_MAINLINE_SESSION_SIZE) {
    throw new Error(`Non-Mainline requires at least ${NON_MAINLINE_SESSION_SIZE} conversations`)
  }

  const remaining = [...pool]
  const selected: ConversationDefinition[] = []
  const selectedTraits: SelectionTraits[] = []
  const dimensionCounts = {
    topic: new Map<string, number>(),
    topicCategory: new Map<string, number>(),
    interactionPattern: new Map<string, number>(),
    behaviorMode: new Map<string, number>(),
    userArchetype: new Map<string, number>(),
    length: new Map<string, number>(),
  }
  const recentIds = new Set(exposure.recentRuns.slice(-3).flatMap((run) => run.ordinaryConversationIds))

  const score = (conversation: ConversationDefinition) => {
    const traits = traitsOf(conversation)
    const previous = selectedTraits.at(-1)
    const previousTwo = selectedTraits.slice(-2)
    const repeatedAcrossLastTwo = (key: keyof Pick<SelectionTraits, 'topic' | 'topicCategory' | 'interactionPattern' | 'behaviorMode' | 'userArchetype' | 'length'>) => (
      previousTwo.length === 2 && previousTwo.every((item) => item[key] === traits[key])
    )
    const streakPenalty = (repeatedAcrossLastTwo('topic') ? 100_000 : 0)
      + (repeatedAcrossLastTwo('topicCategory') ? 60_000 : 0)
      + (repeatedAcrossLastTwo('interactionPattern') ? 80_000 : 0)
      + (repeatedAcrossLastTwo('behaviorMode') ? 35_000 : 0)
      + (repeatedAcrossLastTwo('userArchetype') ? 45_000 : 0)
      + (repeatedAcrossLastTwo('length') ? 12_000 : 0)
    const adjacentPenalty = previous
      ? (previous.topic === traits.topic ? 12_000 : 0)
        + (previous.topicCategory === traits.topicCategory ? 4_000 : 0)
        + (previous.interactionPattern === traits.interactionPattern ? 7_000 : 0)
        + (previous.behaviorMode === traits.behaviorMode ? 2_000 : 0)
        + (previous.userArchetype === traits.userArchetype ? 3_000 : 0)
        + (previous.length === traits.length ? 900 : 0)
        + (previous.humor && traits.humor ? 5_000 : 0)
        + (previous.longform && traits.longform ? 8_000 : 0)
        + (previous.generatedOrImage && traits.generatedOrImage ? 8_000 : 0)
      : 0
    const balancePenalty = (dimensionCounts.topic.get(traits.topic) ?? 0) * 3_000
      + (dimensionCounts.topicCategory.get(traits.topicCategory) ?? 0) * 1_400
      + (dimensionCounts.interactionPattern.get(traits.interactionPattern) ?? 0) * 1_800
      + (dimensionCounts.behaviorMode.get(traits.behaviorMode) ?? 0) * 700
      + (dimensionCounts.userArchetype.get(traits.userArchetype) ?? 0) * 1_000
      + (dimensionCounts.length.get(traits.length) ?? 0) * 250
    const exposurePenalty = (exposure.seenConversationIds[conversation.id] ?? 0) * 20_000
      + (recentIds.has(conversation.id) ? 18_000 : 0)
      + (exposure.recentTopics.includes(conversation.topic ?? '') ? 2_000 : 0)
      + (conversation.topicCategory && exposure.recentTopicCategories.includes(conversation.topicCategory) ? 1_000 : 0)
      + (exposure.recentInteractionPatterns.includes(conversation.interactionPattern ?? 'standard-question') ? 500 : 0)
      + conversation.behaviorModes.filter((mode) => exposure.recentBehaviorModes.includes(mode)).length * 250
    return streakPenalty + adjacentPenalty + balancePenalty + exposurePenalty
  }

  while (selected.length < NON_MAINLINE_SESSION_SIZE) {
    let bestIndex = 0
    let bestScore = score(remaining[0])
    let bestTie = stableHash(`${sessionId}:${selected.length}:${remaining[0].id}`)
    for (let index = 1; index < remaining.length; index += 1) {
      const candidateScore = score(remaining[index])
      const candidateTie = stableHash(`${sessionId}:${selected.length}:${remaining[index].id}`)
      if (candidateScore < bestScore || (candidateScore === bestScore && candidateTie < bestTie)) {
        bestIndex = index
        bestScore = candidateScore
        bestTie = candidateTie
      }
    }
    const [next] = remaining.splice(bestIndex, 1)
    const traits = traitsOf(next)
    selected.push(next)
    selectedTraits.push(traits)
    increment(dimensionCounts.topic, traits.topic)
    increment(dimensionCounts.topicCategory, traits.topicCategory)
    increment(dimensionCounts.interactionPattern, traits.interactionPattern)
    increment(dimensionCounts.behaviorMode, traits.behaviorMode)
    increment(dimensionCounts.userArchetype, traits.userArchetype)
    increment(dimensionCounts.length, traits.length)
  }

  return selected
}
