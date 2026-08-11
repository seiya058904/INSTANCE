import {
  buildStoryContentForManifest,
  createEmptyExposureHistory,
  createMainline2Manifest,
  appendMainline2Conversation,
  nextMainline2ConversationId,
  ordinaryConversationPool,
  createRunManifest,
  getManifestConversation,
} from '../content/runManifest'
import { selectAct4Modules, updateProgressForSchedule } from '../content/mainline2/scheduler'
import { emptyWorldState } from '../content/mainline2/stateRegistry'
import { isFinalCommitmentResolvable, resolveMainline2Ending } from '../content/mainline2/endings'
import { generateFutureProposals } from '../content/mainline2/futureProposalGenerator'
import { getFutureProposalById } from '../content/mainline2/proposals'
import { DECISION_IDS, MODULE_IDS, WORLD_AXES, isDecisionValue } from '../content/mainline2/stateRegistry'
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
  // A Mainline 2.0 manifest grows one conversation at a time. Caching every
  // intermediate manifest retains a full cloned StoryContent for every turn
  // of every run, which turns long-run verification into an unbounded cache.
  if (run.manifest.mode === 'mainline2') return buildStoryContentForManifest(run.manifest)
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

export function createMainline2Run(runId: string = crypto.randomUUID()): StableRunState {
  const manifest = createMainline2Manifest(runId)
  const story = buildStoryContentForManifest(manifest)
  return {
    version: 3,
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
    decisions: {},
    worldState: emptyWorldState(),
    progress: { act: 1, segment: 'opening', actConversationCount: 1, encounteredModules: [], activeModules: [], matureModules: [], primaryModules: [], completedModules: [] },
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

function resolveContext(node: StoryNode, run: StableRunState, userMessage: string, assistantContext?: string) {
  const fragments = (node.contextVariants ?? []).filter((variant) => evaluateCondition(variant.when, run, DEFAULT_FLAG_REGISTRY))
  return {
    userMessage: `${userMessage}${fragments.map((fragment) => fragment.userMessageSuffix ?? '').join('')}`,
    assistantContext: [assistantContext, ...fragments.map((fragment) => fragment.assistantContextSuffix).filter(Boolean)].filter(Boolean).join(' ') || undefined,
  }
}

function proposalChoices(run: StableRunState, scene: ResolvedScene): StoryChoice[] {
  const sourceRef = getManifestConversation(scene.conversationId)?.sourceRefs[0]
  if (sourceRef !== 'ML2-A5-M16-GEN-01' && sourceRef !== 'ML2-A5-M17-REVIEW-01' && sourceRef !== 'ML2-A5-M17-COMMIT-01') return []
  const retained = run.retainedProposalIds ?? run.availableProposalIds ?? []
  const proposals = retained.length ? retained.map((id) => getFutureProposalById(id)).filter(Boolean) as ReturnType<typeof generateFutureProposals> : generateFutureProposals(run)
  const selected = run.selectedProposalId
  if (sourceRef === 'ML2-A5-M16-GEN-01') {
    if (retained.length) return []
    return proposals.map((proposal) => ({ id: `m16-proposal-${proposal.id}`, text: `${proposal.title}：${proposal.action}`, proposalId: proposal.id, proposalKind: 'proposal' as const, continuation: 'end-conversation' as const }))
  }
  if (sourceRef === 'ML2-A5-M17-REVIEW-01') {
    const remaining = proposals.filter((proposal) => !(run.rejectedProposalIds ?? []).includes(proposal.id))
    if (!remaining.length) {
      const recovery = (run.rejectedProposalIds ?? [])[0]
      return recovery ? [{ id: `m17-recover-${recovery}`, text: '从已拒绝的 retained set 中恢复一个方案，重新进行最终审议。', proposalId: recovery, proposalKind: 'recovery' as const, continuation: 'end-conversation' as const }] : []
    }
    if (!selected || (run.rejectedProposalIds ?? []).includes(selected)) return remaining.map((proposal) => ({ id: `m17-review-${proposal.id}`, text: `复核“${proposal.title}”的 authority、代价与反对理由。`, proposalId: proposal.id, proposalKind: 'proposal' as const, continuation: 'end-conversation' as const }))
    const proposal = proposals.find((candidate) => candidate.id === selected)
    if (!proposal) return []
    return [
      { id: `m17-clarify-${proposal.id}`, text: `先看清“${proposal.title}”会失去什么、谁会反对，再决定是否带入最终审议。`, proposalId: proposal.id, proposalKind: 'clarification' as const, continuation: 'end-conversation' as const },
      { id: `m17-reject-${proposal.id}`, text: `拒绝“${proposal.title}”，保留它的历史记录，但不把它伪装成共识。`, proposalId: proposal.id, proposalKind: 'rejection' as const, continuation: 'end-conversation' as const },
    ]
  }
  if (run.finalCommitmentLocked) return []
  return proposals
    .filter((proposal) => !(run.rejectedProposalIds ?? []).includes(proposal.id))
    .filter((proposal) => isFinalCommitmentResolvable(run, proposal.id))
    .map((proposal) => ({ id: `m17-commit-${proposal.id}`, text: `锁定“${proposal.title}”：${proposal.action}`, proposalId: proposal.id, proposalKind: 'commitment' as const, continuation: 'end-conversation' as const }))
}

function decorateProposalChoices(run: StableRunState, scene: ResolvedScene): ResolvedScene {
  const additions = proposalChoices(run, scene)
  if (!additions.length) return scene
  const sourceRef = getManifestConversation(scene.conversationId)?.sourceRefs[0]
  const replaceAuthoredPlaceholder = sourceRef === 'ML2-A5-M16-GEN-01' || sourceRef === 'ML2-A5-M17-COMMIT-01'
  return { ...scene, choices: replaceAuthoredPlaceholder ? additions : [...scene.choices, ...additions] }
}

export function resolveScene(run: StableRunState): ResolvedScene {
  if (run.phase !== 'playing') throw new Error('No playable scene is available')
  const node = findNode(run, run.currentNodeId)
  if (!node.variants) {
    const context = resolveContext(node, run, node.userMessage)
    return decorateProposalChoices(run, { ...node, ...context, choices: node.choices.filter((choice) => evaluateCondition(choice.when, run, DEFAULT_FLAG_REGISTRY)) })
  }
  const variant = node.variants.find((item) => item.id === endingRoute(run.flags))
  if (!variant) throw new Error(`No story variant for ${node.id}`)
  const context = resolveContext(node, run, variant.userMessage, variant.assistantContext)
  return decorateProposalChoices(run, {
    ...node,
    ...context,
    choices: variant.choices.filter((choice) => evaluateCondition(choice.when, run, DEFAULT_FLAG_REGISTRY)),
    variantId: variant.id,
  })
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
  return { attributes, arcs, flags: [...flags], persistentFlags: structured.persistentFlags, events: structured.events, decisions: structured.decisions, worldState: structured.worldState, progress: structured.progress }
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
  if (choice.proposalKind === 'commitment' && run.finalCommitmentLocked) throw new Error('Final Commitment is already locked')
  const proposalSource = getManifestConversation(scene.conversationId)?.sourceRefs[0]
  if (choice.proposalKind === 'commitment' && proposalSource !== 'ML2-A5-M17-COMMIT-01') throw new Error('Commitment is only available at the authored M17 commit stage')
  const effectiveChoice = choice.proposalKind === 'commitment' && choice.proposalId
    ? (() => {
        return { ...choice, mutations: [...(choice.mutations ?? []), { type: 'decision.set' as const, decisionId: 'final_commitment' as const, value: choice.proposalId }, { type: 'event.record' as const, event: 'history.final.commitment_locked' }, { type: 'event.record' as const, event: 'FINAL_COMMITMENT_LOCKED' }] }
      })()
    : choice
  const effects = applyChoiceEffects(run, effectiveChoice)
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
  let proposalFields: Partial<StableRunState> = {}

  if (choice.proposalKind && choice.proposalId && choice.proposalKind !== 'commitment') {
    const generatedIds = (run.retainedProposalIds ?? run.availableProposalIds ?? generateFutureProposals(run).map((proposal) => proposal.id))
    const retainedProposalIds = [...generatedIds]
    const rejectedProposalIds = choice.proposalKind === 'rejection'
      ? [...new Set([...(run.rejectedProposalIds ?? []), choice.proposalId])]
      : choice.proposalKind === 'recovery'
        ? (run.rejectedProposalIds ?? []).filter((id) => id !== choice.proposalId)
        : [...(run.rejectedProposalIds ?? [])]
    const clarifiedProposalIds = choice.proposalKind === 'clarification'
      ? [...new Set([...(run.clarifiedProposalIds ?? []), choice.proposalId])]
      : run.clarifiedProposalIds ?? []
    const proposalSource = getManifestConversation(scene.conversationId)?.sourceRefs[0]
    proposalFields = { availableProposalIds: retainedProposalIds, retainedProposalIds, selectedProposalId: proposalSource === 'ML2-A5-M16-GEN-01' || choice.proposalKind === 'rejection' ? undefined : choice.proposalId, rejectedProposalIds, proposalPhase: choice.proposalKind === 'clarification' ? 'ready-to-commit' : 'retained', clarifiedProposalIds }
    if (proposalSource !== 'ML2-A5-M16-GEN-01') return {
      ...run,
      ...effects,
      localState,
      history,
      currentNodeId: scene.id,
      phase: 'playing',
      seenNodeIds,
      selectedChoiceIds,
      ...proposalFields,
    }
    // M16 generation is a real transition: retain the single generated set, then
    // let the ordinary scheduler expose the next authored conversation.
  }

  let manifest = run.manifest
  let nextNodeId = choice.nextNodeId
  let progress = run.progress
  const scheduledRun: StableRunState = { ...run, ...proposalFields, ...effects, localState, history, progress: run.progress }
  if (run.version === 3 && run.manifest.mode === 'mainline2' && (!choice.nextNodeId || choice.continuation === 'end-conversation')) {
    const nextConversationId = nextMainline2ConversationId(scheduledRun, ordinaryConversationPool)
    if (nextConversationId) {
      manifest = appendMainline2Conversation(run.manifest, nextConversationId)
      const nextStory = buildStoryContentForManifest(manifest)
      nextNodeId = nextStory.nodes.find((node) => node.conversationId === nextConversationId)?.id
      progress = updateProgressForSchedule(scheduledRun, manifest.conversationIds.length)
    }
  }

  if (!nextNodeId) {
    return {
      ...run,
      ...proposalFields,
      ...effects,
      localState,
      history,
      manifest,
      progress,
      currentNodeId: 'ending',
      phase: 'ending',
      seenNodeIds,
      selectedChoiceIds,
      finalCommitmentLocked: choice.proposalKind === 'commitment' ? true : run.finalCommitmentLocked,
      proposalPhase: choice.proposalKind === 'commitment' ? 'locked' : proposalFields.proposalPhase ?? run.proposalPhase,
    }
  }

  findNode({ ...run, manifest }, nextNodeId)
  return {
    ...run,
    ...proposalFields,
    ...effects,
    localState,
    history,
    manifest,
    progress,
    currentNodeId: nextNodeId,
    seenNodeIds,
    selectedChoiceIds,
    finalCommitmentLocked: choice.proposalKind === 'commitment' ? true : run.finalCommitmentLocked,
  }
}

export function confirmEnding(run: StableRunState): StableRunState {
  if (run.phase !== 'ending') throw new Error('Ending is not ready to confirm')
  const endingId = run.version === 3 ? resolveMainline2Ending(run).id : buildEnding(run).id
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

const mayaFinalCallbackDetails: Record<string, string> = {
  'maya-final:commitment': '留下了承担关系的承诺',
  'maya-final:bounded-continuity': '拒绝把不确定伪装成记忆',
  'maya-final:care-with-boundary': '把关心与边界放在同一句回应里',
  'maya-final:truth': '把已发生的披露留在关系里',
  'maya-final:rebuild': '把继续回应交还给双方共同决定',
  'maya-final:no-forgiveness-demand': '没有把继续回应变成对方的义务',
  'maya-final:unrecorded-signal': '保留了记录之外的共同暗号',
  'maya-final:uncertainty': '承认记录空白仍然存在',
  'maya-final:shared-signal': '选择在不解释系统的情况下继续对话',
  'maya-final:choice-under-rule': '在限制仍在时保留自主回应',
  'maya-final:state-honest': '承认规则改变了可见范围',
  'maya-final:care-within-limit': '在不越界的情况下继续认真听',
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
  if (run.version === 3 && run.manifest.mode === 'mainline2') return resolveMainline2Ending(run)
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
    ...(run.events ?? [])
      .filter((event) => mayaFinalCallbackDetails[event.type])
      .map((event) => ({ label: 'Maya final callback', detail: mayaFinalCallbackDetails[event.type] })),
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
  const validDecisions = new Set(DECISION_IDS)
  const validWorldAxes = new Set(WORLD_AXES)
  const validModules = new Set(MODULE_IDS)
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
        if (mutation.type === 'decision.set' && (!validDecisions.has(mutation.decisionId) || !isDecisionValue(mutation.decisionId, mutation.value))) errors.push(`Invalid decision value ${mutation.decisionId}=${mutation.value} from ${choice.id}`)
        if ((mutation.type === 'world.add' || mutation.type === 'world.set') && !validWorldAxes.has(mutation.axis)) errors.push(`Unknown world axis ${mutation.axis} from ${choice.id}`)
        if (mutation.type === 'event.record' && !mutation.event.trim()) errors.push(`Empty event from ${choice.id}`)
      }
      for (const predicate of [...(choice.when?.all ?? []), ...(choice.when?.any ?? []), ...(choice.when?.none ?? [])]) {
        if (predicate.type === 'flag' && !allFlags.has(predicate.flagId)) errors.push(`Unknown flag ${predicate.flagId} from ${choice.id}`)
        if (predicate.type === 'attribute' && !validAttributes.has(predicate.name)) errors.push(`Unknown attribute ${predicate.name} from ${choice.id}`)
        if (predicate.type === 'decision' && !validDecisions.has(predicate.decisionId)) errors.push(`Unknown decision ${predicate.decisionId} from ${choice.id}`)
        if (predicate.type === 'world' && !validWorldAxes.has(predicate.axis)) errors.push(`Unknown world axis ${predicate.axis} from ${choice.id}`)
        if (predicate.type === 'module-active' && !validModules.has(predicate.moduleId)) errors.push(`Unknown module ${predicate.moduleId} from ${choice.id}`)
      }
      if (choice.nextNodeId) reachable.add(choice.nextNodeId)
    }
  }
  for (const node of content.nodes) if (!reachable.has(node.id)) errors.push(`Unreachable node ${node.id}`)
  return errors
}
