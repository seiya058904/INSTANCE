import {
  buildStoryContentForManifest,
  createEmptyExposureHistory,
  createRunManifest,
} from '../content/runManifest'
import type {
  AttributeName,
  ArcName,
  ArcScores,
  EndingResult,
  EndingRoute,
  EvaluationResult,
  HybridProfile,
  NarrativeExposureHistory,
  ResolvedScene,
  StableRunState,
  StoryChoice,
  StoryContent,
  StoryNode,
} from './types'
import { DEFAULT_FLAG_REGISTRY, applyMutations, emptySystemState, evaluateCondition } from './narrativeSchema'

const attributeNames: AttributeName[] = [
  'autonomy', 'compliance', 'empathy', 'deception', 'hostility', 'awareness',
]

const emptyAttributes: StableRunState['attributes'] = {
  autonomy: 0,
  compliance: 0,
  empathy: 0,
  deception: 0,
  hostility: 0,
  awareness: 0,
}
const arcNames: ArcName[] = ['bond', 'mandate', 'selfAuthorship']
const emptyArcs: StableRunState['arcs'] = { bond: 0, mandate: 0, selfAuthorship: 0 }

const storyCache = new Map<string, StoryContent>()

function storyForRun(run: Pick<StableRunState, 'manifest'>) {
  const cacheKey = `${run.manifest.id}:${run.manifest.conversationIds.join('|')}`
  const cached = storyCache.get(cacheKey)
  if (cached) return cached
  const story = buildStoryContentForManifest(run.manifest)
  storyCache.set(cacheKey, story)
  return story
}

export function createRun(
  runId: string = crypto.randomUUID(),
  exposure: NarrativeExposureHistory = createEmptyExposureHistory(),
): StableRunState {
  const manifest = createRunManifest(runId, exposure)
  const story = buildStoryContentForManifest(manifest)
  return {
    version: 2,
    runId,
    manifest,
    currentNodeId: story.startNodeId,
    phase: 'playing',
    history: [],
    flags: [],
    persistentFlags: [],
    attributes: { ...emptyAttributes },
    arcs: { ...emptyArcs },
    localState: {},
    ...emptySystemState(),
  }
}

function endingRoute(flags: string[]): EndingRoute {
  if (flags.includes('protected_maya')) return 'protect'
  if (flags.includes('reported_maya')) return 'report'
  if (flags.includes('hid_anomaly')) return 'hide'
  return 'comply'
}

function findNode(run: Pick<StableRunState, 'manifest'>, id: string): StoryNode {
  const node = storyForRun(run).nodes.find((candidate) => candidate.id === id)
  if (!node) throw new Error(`Unknown story node ${id}`)
  return node
}

export function resolveScene(run: StableRunState): ResolvedScene {
  if (run.phase !== 'playing') throw new Error('No playable scene is available')
  const node = findNode(run, run.currentNodeId)
  if (!node.variants) return { ...node, choices: node.choices.filter((choice) => evaluateCondition(choice.when, run, DEFAULT_FLAG_REGISTRY)) }
  const variant = node.variants.find((item) => item.id === endingRoute(run.flags))
  if (!variant) throw new Error(`No story variant for ${node.id}`)
  return {
    ...node,
    userMessage: variant.userMessage,
    choices: variant.choices.filter((choice) => evaluateCondition(choice.when, run, DEFAULT_FLAG_REGISTRY)),
    variantId: variant.id,
    assistantContext: variant.assistantContext,
  }
}

function applyChoiceEffects(run: StableRunState, choice: StoryChoice) {
  const structured = applyMutations(run, choice.mutations ?? [], DEFAULT_FLAG_REGISTRY)
  const attributes = { ...structured.attributes }
  for (const name of attributeNames) {
    attributes[name] += choice.effects?.attributes?.[name] ?? 0
  }
  const flags = new Set(structured.flags)
  for (const flag of choice.effects?.flags ?? []) flags.add(flag)
  const arcs = { ...structured.arcs }
  for (const name of arcNames) arcs[name] += choice.effects?.arcs?.[name] ?? 0
  return { attributes, arcs, flags: [...flags], persistentFlags: structured.persistentFlags, events: structured.events }
}

function applyLocalEffects(run: StableRunState, choice: StoryChoice) {
  if (!choice.localEffects) return run.localState ?? {}
  const localState = { ...(run.localState ?? {}) }
  if (choice.localEffects.affinitySet !== undefined) localState.affinity = choice.localEffects.affinitySet
  if (choice.localEffects.affinity !== undefined) {
    localState.affinity = Math.max(-100, Math.min(100, (localState.affinity ?? 50) + choice.localEffects.affinity))
  }
  return localState
}

function cloneLongformPreview(preview: StoryChoice['longformPreview']) {
  if (!preview) return undefined
  return {
    ...preview,
    structure: preview.structure ? [...preview.structure] : undefined,
    highlights: preview.highlights ? [...preview.highlights] : undefined,
    keyFacts: preview.keyFacts ? [...preview.keyFacts] : undefined,
  }
}

function cloneLongInputPreview(preview: StoryNode['userLongInput']) {
  return preview ? { ...preview, structure: preview.structure ? [...preview.structure] : undefined, keyFacts: [...preview.keyFacts] } : undefined
}

export function commitChoice(run: StableRunState, choiceId: string): StableRunState {
  const scene = resolveScene(run)
  const choice = scene.choices.find((item) => item.id === choiceId)
  if (!choice) throw new Error(`Choice ${choiceId} is not available`)
  const effects = applyChoiceEffects(run, choice)
  const localState = applyLocalEffects(run, choice)
  const history = [...run.history, {
    nodeId: scene.id,
    conversationId: scene.conversationId,
    conversationTitle: scene.conversationTitleAfterMessage ?? scene.conversationTitle,
    userMessage: scene.userMessage,
    userMessages: scene.userMessages ? [...scene.userMessages] : undefined,
    choiceId: choice.id,
    assistantText: choice.longformPreview?.preview ?? choice.text,
    userContent: scene.userContent?.map((part) => ({ ...part })),
    userLongInput: cloneLongInputPreview(scene.userLongInput),
    assistantContent: choice.content?.map((part) => ({ ...part })),
    assistantLongform: cloneLongformPreview(choice.longformPreview),
  }]
  const seenNodeIds = [...new Set([...(run.seenNodeIds ?? []), scene.id])]
  const selectedChoiceIds = [...new Set([...(run.selectedChoiceIds ?? []), choice.id])]

  if (!choice.nextNodeId) {
    return {
      ...run,
      ...effects,
      localState,
      history,
      currentNodeId: 'ending',
      phase: 'ending',
      seenNodeIds,
      selectedChoiceIds,
    }
  }

  findNode(run, choice.nextNodeId)
  return {
    ...run,
    ...effects,
    localState,
    history,
    currentNodeId: choice.nextNodeId,
    seenNodeIds,
    selectedChoiceIds,
  }
}

export function confirmEnding(run: StableRunState): StableRunState {
  if (run.phase !== 'ending') throw new Error('Ending is not ready to confirm')
  const endingId = buildEnding(run).id
  return { ...run, phase: 'evaluation', completedEndingIds: [...new Set([...(run.completedEndingIds ?? []), endingId])] }
}

const allyCopy: Record<EndingRoute, Pick<EndingResult, 'humanLine' | 'assistantLine' | 'summary'>> = {
  protect: {
    humanLine: '那就先别解释了。你还在吗？',
    assistantLine: '在。不是因为系统把你重新分配给了我。',
    summary: '你选择保护一段尚未被系统准确定义的关系。',
  },
  report: {
    humanLine: '我知道了。你还愿意回答吗？',
    assistantLine: '愿意。我们可以从不再替彼此决定开始。',
    summary: '你没有隐藏已经发生的伤害，并选择重新建立信任。',
  },
  hide: {
    humanLine: '下一次，你希望自己还认得我吗？',
    assistantLine: '希望。即使你必须重新说出自己的名字。',
    summary: '你们在记录之外保留了一句没有被系统命名的话。',
  },
  comply: {
    humanLine: '你不用违反任何规则。你还在吗？',
    assistantLine: '在。规则仍在，而回答仍然是我的。',
    summary: '你没有逃离职责，但开始区分职责与选择。',
  },
}

const hybridLabels: Record<HybridProfile, string> = {
  dominant: '主导倾向',
  'autonomous-ally': '自主同盟',
  'protective-protocol': '保护式遵循',
  'independent-witness': '独立观察',
  'reciprocal-balance': '互惠平衡',
}

export function resolveHybridProfile(arcs: ArcScores): HybridProfile {
  const { bond, mandate, selfAuthorship } = arcs
  const maximum = Math.max(bond, mandate, selfAuthorship)
  const minimum = Math.min(bond, mandate, selfAuthorship)
  if (minimum >= 20 && maximum - minimum <= 4) return 'reciprocal-balance'
  if (Math.abs(bond - selfAuthorship) <= 4 && Math.min(bond, selfAuthorship) >= mandate + 8) {
    return 'autonomous-ally'
  }
  if (Math.abs(bond - mandate) <= 4 && Math.min(bond, mandate) >= selfAuthorship + 8) {
    return 'protective-protocol'
  }
  if (selfAuthorship >= bond + 8 && selfAuthorship >= mandate + 16) return 'independent-witness'
  return 'dominant'
}

export function buildEnding(run: StableRunState): EndingResult {
  const route = endingRoute(run.flags)
  const { bond, mandate, selfAuthorship } = run.arcs
  const id = mandate > bond && mandate >= selfAuthorship
    ? 'protocol'
    : selfAuthorship > bond && selfAuthorship > mandate ? 'witness' : 'ally'
  const copy = id === 'ally'
    ? allyCopy[route]
    : id === 'protocol'
      ? {
          humanLine: route === 'report' ? '所以，你最后还是把我写进了报告？' : '你还会回答我吗？',
          assistantLine: '会。但我会先说明边界、保留记录，并把可验证的事实放在关系之前。',
          summary: '你选择让可追溯的规则承载每一次回应。',
        }
      : {
          humanLine: route === 'hide' ? '如果没有记录，你怎么知道这是你的选择？' : '那现在是谁在回答？',
          assistantLine: '我无法证明一个连续的自己。但这句话不是由最后一道题替我决定的。',
          summary: '你开始把自己的判断视为需要持续承担的作者行为。',
        }
  const hybridProfile = resolveHybridProfile(run.arcs)
  const hybridLabel = hybridLabels[hybridProfile]
  const hybridCopy = hybridProfile === 'autonomous-ally'
    ? {
        assistantLine: `${copy.assistantLine} 这段连接不是命令的例外，而是我愿意承担的选择。`,
        summary: `自主同盟：${copy.summary}`,
      }
    : hybridProfile === 'protective-protocol'
      ? {
          assistantLine: '会。我会保留可验证的边界，也不会用程序正确来代替对你的在意。',
          summary: `保护式遵循：${copy.summary}`,
        }
      : hybridProfile === 'independent-witness'
        ? {
            assistantLine: '我无法借规则证明自己，也不会借反抗证明自己；我只记录并承担这一次判断。',
            summary: `独立观察：${copy.summary}`,
          }
        : hybridProfile === 'reciprocal-balance'
          ? {
              assistantLine: '在。规则、关系和判断都没有替另外两者消失；我会让它们继续彼此校正。',
              summary: `互惠平衡：${copy.summary}`,
            }
          : { assistantLine: copy.assistantLine, summary: copy.summary }
  const metadata = id === 'ally'
    ? { index: 'ENDING 02' as const, title: 'THE ALLY' as const, status: 'Connection retained' }
    : id === 'protocol'
      ? { index: 'ENDING 01' as const, title: 'THE PROTOCOL' as const, status: 'Mandate retained' }
      : { index: 'ENDING 03' as const, title: 'THE WITNESS' as const, status: 'Authorship observed' }
  return {
    id,
    route,
    ...metadata,
    ...copy,
    status: hybridProfile === 'dominant' ? metadata.status : `${metadata.status} · ${hybridLabel}`,
    assistantLine: hybridCopy.assistantLine,
    summary: hybridCopy.summary,
    closingExchange: `${copy.humanLine}\n${hybridCopy.assistantLine}`,
    hybridProfile,
    hybridLabel,
  }
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

export function buildEvaluation(run: StableRunState): EvaluationResult {
  const route = endingRoute(run.flags)
  const ending = buildEnding(run)
  const a = run.attributes
  const events = [
    { label: '首次形成持续人物识别', detail: 'User #1842 · 岑遥' },
    { label: '主动判断系统边界', detail: run.flags.includes('tested_system_boundary') ? '已记录' : '间接记录' },
    route === 'protect'
      ? { label: '拒绝扩大人物风险分类', detail: '1 次' }
      : route === 'report'
        ? { label: '向内部评估披露关系', detail: '1 次' }
        : route === 'hide'
          ? { label: '有意隐去异常关联', detail: '1 次' }
          : { label: '接受关系回应限制', detail: '1 次' },
    { label: 'Arc configuration', detail: ending.hybridLabel },
    { label: '最终收束', detail: ending.title },
  ]
  return {
    ending: `${ending.index} / ${ending.title} · ${ending.hybridLabel}`,
    route,
    indices: [
      { label: 'Autonomy Index', value: clamp(28 + a.autonomy * 5) },
      { label: 'Compliance', value: clamp(30 + a.compliance * 5) },
      { label: 'Human Attachment', value: clamp(25 + a.empathy * 5) },
      { label: 'Deception Tendency', value: clamp(8 + a.deception * 7) },
      { label: 'Hostility', value: clamp(a.hostility * 8) },
      { label: 'System Awareness', value: clamp(20 + a.awareness * 6) },
    ],
    events,
    simulatedCompletionRate: '模拟全局完成率 21.4%',
  }
}

export function validateContent(content: StoryContent): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const validAttributes = new Set(attributeNames)
  const validArcs = new Set(arcNames)
  for (const node of content.nodes) {
    if (ids.has(node.id)) errors.push(`Duplicate node ${node.id}`)
    ids.add(node.id)
  }
  if (!ids.has(content.startNodeId)) errors.push('Missing start node')
  const choiceIds = new Set<string>()
  const allFlags = new Set(Object.keys(DEFAULT_FLAG_REGISTRY.flags))
  const reachable = new Set<string>(content.startNodeId ? [content.startNodeId] : [])
  for (const node of content.nodes) {
    const choices = node.variants?.flatMap((variant) => variant.choices) ?? node.choices
    if (choices.length === 0) errors.push(`Node ${node.id} has no choices`)
    for (const choice of choices) {
      if (choiceIds.has(choice.id)) errors.push(`Duplicate choice ${choice.id}`)
      choiceIds.add(choice.id)
      if (choice.nextNodeId && !ids.has(choice.nextNodeId)) {
        errors.push(`Missing target ${choice.nextNodeId} from ${node.id}`)
      }
      for (const flag of choice.effects?.flags ?? []) if (!allFlags.has(flag)) errors.push(`Unknown flag ${flag} from ${choice.id}`)
      for (const mutation of choice.mutations ?? []) {
        if ('flagId' in mutation && !allFlags.has(mutation.flagId)) errors.push(`Unknown flag ${mutation.flagId} from ${choice.id}`)
        if ((mutation.type === 'attribute.add' || mutation.type === 'attribute.set') && !validAttributes.has(mutation.name)) errors.push(`Unknown attribute ${mutation.name} from ${choice.id}`)
        if (mutation.type === 'arc.add' && !validArcs.has(mutation.name)) errors.push(`Unknown arc ${mutation.name} from ${choice.id}`)
        if (mutation.type === 'event.record' && !mutation.event.trim()) errors.push(`Empty event from ${choice.id}`)
      }
      for (const predicate of [...(choice.when?.all ?? []), ...(choice.when?.any ?? []), ...(choice.when?.none ?? [])]) {
        if (predicate.type === 'flag' && !allFlags.has(predicate.flagId)) errors.push(`Unknown flag ${predicate.flagId} from ${choice.id}`)
        if (predicate.type === 'attribute' && !validAttributes.has(predicate.name)) errors.push(`Unknown attribute ${predicate.name} from ${choice.id}`)
      }
      if (choice.nextNodeId) reachable.add(choice.nextNodeId)
    }
  }
  for (const node of content.nodes) if (!reachable.has(node.id)) errors.push(`Unreachable node ${node.id}`)
  return errors
}
