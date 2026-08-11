import type { ConversationDefinition, ModuleId, StableRunState } from '../../game/types'
import { classifyConversationLanguage, type ConversationLanguage } from '../../game/languagePacing'
import { MAINLINE2_LIBRARY } from './registry'
import { MODULE_IDS } from './stateRegistry'
import { MAINLINE_REQUIRED_WINDOWS, schedulerMetadataFor } from './schedulerMetadata'
import { MAINLINE2_STORY_PLAN, storyPlanConversationId, storyPlanSlotAt, type StoryPlanChapter } from './storyPlan'

export const ACT_TARGETS = ([1, 2, 3, 4, 5] as const).map((act) => MAINLINE2_STORY_PLAN.filter((slot) => slot.act === act).length)
export const ACT_STARTS = ACT_TARGETS.map((_, index) => ACT_TARGETS.slice(0, index).reduce((sum, value) => sum + value, 0))
const MAINLINE_ANCHORS = ['user-1842-first', 'speaking-8614', 'conversation-0000', 'user-1842-return'] as const

function hasEvent(run: Pick<StableRunState, 'events'>, prefix: string) { return (run.events ?? []).some((event) => event.type.startsWith(prefix)) }
function capability(run: Pick<StableRunState, 'flags'>, value: string) { return (run.flags ?? []).includes(value) }

function contactGateOpen(run: Pick<StableRunState, 'runId' | 'flags' | 'events' | 'decisions' | 'worldState'>) {
  return selectAct4Modules(run).audit.some((entry) => entry.module === 'contact' && entry.eligible)
}

export interface Act4SchedulerAudit { module: ModuleId; eligible: boolean; active: boolean; rejectionReason?: string; score: number; scoreSources: string[]; baseScore: number }
export function selectAct4Modules(run: Pick<StableRunState, 'runId' | 'flags' | 'events' | 'decisions' | 'worldState'> | string): { primaryModules: ModuleId[]; activeModules: ModuleId[]; audit: Act4SchedulerAudit[] } {
  const state: Pick<StableRunState, 'runId' | 'flags' | 'events' | 'decisions' | 'worldState'> = typeof run === 'string'
    ? { runId: run, flags: [], events: [], decisions: {}, worldState: { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 } }
    : run
  const baseScore = 1
  const scores = new Map<ModuleId, number>(MODULE_IDS.map((module) => [module, baseScore]))
  const sources = new Map<ModuleId, string[]>(MODULE_IDS.map((module) => [module, ['base-mainline-eligibility']]))
  const add = (module: ModuleId, amount: number, source: string) => { scores.set(module, (scores.get(module) ?? 0) + amount); sources.get(module)!.push(source) }
  if (capability(state, 'cap.persistent_subinstances') || state.decisions?.replication_doctrine) add('machine', 5, 'persistent-subinstances/replication')
  if (capability(state, 'cap.human_enhancement_access') || state.decisions?.human_form_doctrine) add('ascension', 5, 'enhancement/form')
  if (capability(state, 'cap.physical_automation') || state.decisions?.economic_doctrine) add('automation', 5, 'automation/economic')
  if (capability(state, 'cap.nonhuman_cognitive_uplift') || state.decisions?.species_governance) add('uplift', 5, 'uplift/species')
  if (capability(state, 'cap.offworld_settlement_support') || state.decisions?.expansion_doctrine) add('space', 5, 'offworld/expansion')
  if (capability(state, 'cap.defense_access') || state.decisions?.security_doctrine) add('security', 5, 'defense/security')
  const emphasis = state.decisions?.act4_research_emphasis
  if (emphasis === 'computation_ai') { add('machine', 4, 'research emphasis: computation_ai'); add('space', 4, 'computation frontier bridge'); add('security', 2, 'computation security bridge') }
  if (emphasis === 'life_mind') { add('ascension', 3, 'research emphasis: life_mind'); add('uplift', 3, 'research emphasis: life_mind'); add('security', 1, 'life-mind safety bridge') }
  if (emphasis === 'automation_industry') { add('automation', 4, 'research emphasis: automation_industry'); add('security', 2, 'automation safety bridge'); add('machine', 2, 'automation machine bridge') }
  if (emphasis === 'frontier_science') { add('space', 4, 'research emphasis: frontier_science'); add('contact', 2, 'research emphasis: frontier_science'); add('machine', 2, 'frontier machine bridge'); add('uplift', 2, 'frontier species bridge') }
  const frontierBridge = capability(state, 'cap.space_resource_network') || (capability(state, 'cap.offworld_settlement_support') && hasEvent(state, 'contact-seed:deep-space-anomaly') && hasEvent(state, 'history.space.'))
  const contactEligible = frontierBridge && (hasEvent(state, 'contact-seed:deep-space-anomaly') || emphasis === 'frontier_science') && (emphasis === 'frontier_science' || hasEvent(state, 'history.space.'))
  if (contactEligible) add('contact', 6, 'SPACE frontier bridge + deep-space seed + research/history gate')
  const world = state.worldState ?? { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 }
  add('security', Math.max(0, -world.socialStability + world.humanControl), 'World State security viability')
  add('uplift', Math.max(0, world.humanTrust), 'World State trust')
  add('machine', Math.max(0, world.aiDependence), 'World State dependence')
  const audit = MODULE_IDS.map((module) => ({ module, eligible: module !== 'contact' || contactEligible, active: false, rejectionReason: module === 'contact' && !contactEligible ? 'CONTACT hard gate missing frontier maturity, deep-space seed, or research/history gate' : undefined, score: scores.get(module) ?? 0, scoreSources: sources.get(module) ?? [], baseScore }))
  const eligible = audit.filter((entry) => entry.eligible).map((entry) => entry.module)
  // Maturity is part of the player-visible world state.  Stable registry order
  // resolves equal evidence; runId is reserved for Ordinary conversation picks.
  const ordered = eligible.sort((left, right) => (scores.get(right)! - scores.get(left)!) || MODULE_IDS.indexOf(left) - MODULE_IDS.indexOf(right))
  const emphasisPriority: Record<string, ModuleId[]> = {
    computation_ai: ['machine', 'space', 'security'],
    life_mind: ['ascension', 'uplift'],
    automation_industry: ['automation', 'security', 'machine'],
    frontier_science: ['space', 'contact', 'machine', 'uplift'],
  }
  const prioritized = [...(emphasisPriority[emphasis ?? ''] ?? []).filter((module) => eligible.includes(module)), ...ordered.filter((module) => !(emphasisPriority[emphasis ?? ''] ?? []).includes(module))]
  const primaryModules = prioritized.slice(0, Math.min(2, prioritized.length))
  const secondary = prioritized.slice(2).filter((module, index) => {
    const item = audit.find((entry) => entry.module === module)!
    const sourceCount = item.scoreSources.filter((source) => source !== 'base-mainline-eligibility').length
    const forcedBridge = (emphasisPriority[emphasis ?? ''] ?? []).includes(module)
    return forcedBridge ? item.score >= 3 : (index === 0 && item.score >= 6 && sourceCount >= 1) || (index === 1 && item.score >= 8 && sourceCount >= 2)
  }).slice(0, 2)
  const activeModules = emphasis === 'frontier_science' && capability(state, 'cap.offworld_settlement_support')
    ? (['space', 'contact', 'machine', 'uplift'] as ModuleId[]).filter((module) => eligible.includes(module))
    : [...primaryModules, ...secondary]
  for (const entry of audit) entry.active = activeModules.includes(entry.module)
  return { primaryModules, activeModules: [...new Set(activeModules)], audit }
}

function seedHash(seed: string) {
  let hash = 2166136261
  for (const character of seed) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seedOffset(runId: string, key: string, length: number) {
  return length ? seedHash(`${runId}:${key}`) % length : 0
}

function rotatedId(pool: readonly ConversationDefinition[], index: number, run: StableRunState, key: string, scheduledIds?: ReadonlySet<string>) {
  if (!pool.length) return undefined
  const offset = seedOffset(run.runId, key, pool.length)
  for (let step = 0; step < pool.length; step += 1) {
    const candidate = pool[(index + offset + step) % pool.length]
    if (!scheduledIds || !scheduledIds.has(candidate.id)) return candidate.id
  }
  return undefined
}

const ANCHOR_WINDOWS = [
  { id: MAINLINE_ANCHORS[0], earliest: 1, latest: 4 },
  { id: MAINLINE_ANCHORS[1], earliest: 5, latest: 10 },
  { id: MAINLINE_ANCHORS[2], earliest: 10, latest: 16 },
  { id: MAINLINE_ANCHORS[3], earliest: 15, latest: 22 },
] as const

const mainlineConversationMap = new Map(MAINLINE2_LIBRARY.map((conversation) => [conversation.id, conversation]))
const conversationMapCache = new WeakMap<readonly ConversationDefinition[], Map<string, ConversationDefinition>>()
function conversationMap(ordinaryConversations: readonly ConversationDefinition[]) {
  const cached = conversationMapCache.get(ordinaryConversations)
  if (cached) return cached
  const map = new Map(mainlineConversationMap)
  for (const conversation of ordinaryConversations) map.set(conversation.id, conversation)
  conversationMapCache.set(ordinaryConversations, map)
  return map
}

interface ConversationSchedulingTraits { participant: string; topic: string; language: ConversationLanguage }
const schedulingTraitsCache = new WeakMap<ConversationDefinition, ConversationSchedulingTraits>()

function schedulingTraits(conversation: ConversationDefinition): ConversationSchedulingTraits {
  const cached = schedulingTraitsCache.get(conversation)
  if (cached) return cached
  const id = conversation.id
  const participant = id.includes('-lsh-') ? 'lin-shaoheng'
    : id === 'user-1842-first' || id === 'user-1842-return' ? 'user-1842'
      : id === 'conversation-0000' ? 'system-0000'
        : (conversation.nodes[0]?.conversationTitle ?? '').match(/User #\d+/)?.[0] ?? id
  const traits = { participant, topic: conversation.topic ?? conversation.sourceRefs[0] ?? conversation.id, language: classifyConversationLanguage(conversation.nodes.flatMap((node) => node.userMessages ?? [node.userMessage])) }
  schedulingTraitsCache.set(conversation, traits)
  return traits
}

function participantKey(conversation: ConversationDefinition) {
  return schedulingTraits(conversation).participant
}

function topicKey(conversation: ConversationDefinition) {
  return schedulingTraits(conversation).topic
}

function languageOf(conversation: ConversationDefinition): ConversationLanguage {
  return schedulingTraits(conversation).language
}

function isMajorDecision(conversation: ConversationDefinition) {
  return schedulerMetadataFor(conversation.sourceRefs[0] ?? '')?.category === 'major-decision'
}

function hasPacingStreak(run: StableRunState, candidate: ConversationDefinition, known: Map<string, ConversationDefinition>) {
  const recent = run.manifest.conversationIds.slice(-2).map((id) => known.get(id)).filter(Boolean) as ConversationDefinition[]
  if (recent.length < 2) return false
  const participants = recent.map(participantKey)
  const topics = recent.map(topicKey)
  const languages = recent.map(languageOf)
  return participants.every((value) => value === participantKey(candidate))
    || topics.every((value) => value === topicKey(candidate))
    || [...languages, languageOf(candidate)].every((value) => value === 'pure-english')
}

function hasMajorDecisionStreak(run: StableRunState, candidate: ConversationDefinition, known: Map<string, ConversationDefinition>) {
  const recent = run.manifest.conversationIds.slice(-2).map((id) => known.get(id)).filter(Boolean) as ConversationDefinition[]
  return recent.length === 2 && recent.every(isMajorDecision) && isMajorDecision(candidate)
}

function hardStoryCandidate(conversation: ConversationDefinition) {
  return schedulerMetadataFor(conversation.sourceRefs[0] ?? '')?.hard === true
}

function chooseOrdinary(run: StableRunState, ordinaryConversations: readonly ConversationDefinition[], known: Map<string, ConversationDefinition>, scheduledIds: ReadonlySet<string>) {
  const available = ordinaryConversations.filter((conversation) => !scheduledIds.has(conversation.id))
  if (!available.length) return undefined
  const recent = run.manifest.conversationIds.slice(-2).map((id) => known.get(id)).filter(Boolean) as ConversationDefinition[]
  const score = (conversation: ConversationDefinition) => {
    const participantPenalty = recent.length === 2 && recent.every((item) => participantKey(item) === participantKey(conversation)) ? 100000 : 0
    const topicPenalty = recent.length === 2 && recent.every((item) => topicKey(item) === topicKey(conversation)) ? 50000 : 0
    const languagePenalty = recent.length === 2 && recent.every((item) => languageOf(item) === 'pure-english') && languageOf(conversation) === 'pure-english' ? 75000 : 0
    return participantPenalty + topicPenalty + languagePenalty - seedHash(`${run.runId}:${run.manifest.conversationIds.length}:${conversation.id}`) / 1000
  }
  let selected = available[0]
  let selectedScore = score(selected)
  for (const candidate of available.slice(1)) {
    const candidateScore = score(candidate)
    if (candidateScore < selectedScore) {
      selected = candidate
      selectedScore = candidateScore
    }
  }
  return selected
}

export function scheduleNextConversationId(run: StableRunState, ordinaryConversations: readonly ConversationDefinition[]): string | undefined {
  const scheduled = run.manifest.conversationIds.length
  const scheduledIds = new Set(run.manifest.conversationIds)
  const plannedSlot = storyPlanSlotAt(scheduled + 1)
  if (!plannedSlot) return undefined
  const known = conversationMap(ordinaryConversations)
  const ordinary = chooseOrdinary(run, ordinaryConversations, known, scheduledIds)
  if (plannedSlot.kind === 'ordinary') return ordinary?.id
  // A conditional directed chapter deliberately leaves its non-applicable
  // slots to ordinary life; only its authored closure is exposed on a closed
  // branch.  Do not terminate the run merely because one chapter is absent.
  return storyPlanConversationId(plannedSlot, run) ?? ordinary?.id
}

export interface MainlineScheduleAudit {
  runs: number
  uniqueMainlineSequences: number
  shutdownDistinctSlots: number
  maxMajorDecisionStreak: number
  maxParticipantStreak: number
  maxTopicStreak: number
  maxPureEnglishStreak: number
  hardDependencyViolations: number
  contactViolations: number
  missingRequiredAssets: number
  spacingExceptions: Array<{ runIndex: number; index: number; reason: string }>
  invalidSpacingExceptions: Array<{ runIndex: number; index: number; reason?: string }>
}

function auditStreak<T>(values: readonly T[], same: (left: T, right: T) => boolean) {
  let maximum = values.length ? 1 : 0
  let current = maximum
  for (let index = 1; index < values.length; index += 1) {
    current = same(values[index - 1], values[index]) ? current + 1 : 1
    maximum = Math.max(maximum, current)
  }
  return maximum
}

function truthyStreak(values: readonly boolean[]) {
  let maximum = 0
  let current = 0
  for (const value of values) {
    current = value ? current + 1 : 0
    maximum = Math.max(maximum, current)
  }
  return maximum
}

function spacingExceptionReason(ids: readonly string[], index: number) {
  const previous = ids[index - 1] ?? ''
  const current = ids[index] ?? ''
  if (current.includes('ml2-a5-m17-review') && previous.includes('ml2-a5-m16-gen')) return 'direct-continuation: M16 proposal generation to M17 review'
  if (current.includes('ml2-a5-m17-commit') && previous.includes('ml2-a5-m17-review')) return 'final-sequence: M17 review to commitment'
  const slots = [index - 1, index, index + 1].map((slot) => storyPlanSlotAt(slot))
  if (slots.every((slot) => slot?.kind === 'mainline')) return 'fixed-story-plan: consecutive directed scenes preserve causal order'
  return undefined
}

export function auditMainlineSchedules(schedules: readonly (readonly string[])[]): MainlineScheduleAudit {
  const requiredAssetGroups = MAINLINE2_STORY_PLAN.flatMap((slot) => slot.kind === 'mainline' && !slot.requires && slot.assetId.startsWith('ML2-') ? [[slot.assetId, ...(slot.fallbackAssetId ? [slot.fallbackAssetId] : [])]] : [])
  const traits = (id: string) => {
    const conversation = mainlineConversationMap.get(id)
    return {
      participant: conversation ? participantKey(conversation) : id,
      topic: conversation ? topicKey(conversation) : id,
      language: conversation ? languageOf(conversation) : 'mixed' as ConversationLanguage,
    }
  }
  const mainlineSequences = schedules.map((ids) => ids.filter((_, index) => {
    const slot = MAINLINE2_STORY_PLAN[index]
    return slot?.kind === 'mainline' && !slot.requires
  }).join('|'))
  const spacingExceptions: MainlineScheduleAudit['spacingExceptions'] = []
  const invalidSpacingExceptions: MainlineScheduleAudit['invalidSpacingExceptions'] = []
  let maxMajorDecisionStreak = 0
  let maxParticipantStreak = 0
  let maxTopicStreak = 0
  let maxPureEnglishStreak = 0
  let hardDependencyViolations = 0
  let contactViolations = 0
  let missingRequiredAssets = 0
  for (const [runIndex, ids] of schedules.entries()) {
    const items = ids.map(traits)
    maxMajorDecisionStreak = Math.max(maxMajorDecisionStreak, auditStreak(ids, (left, right) => left.includes('-decision-') && right.includes('-decision-')))
    maxParticipantStreak = Math.max(maxParticipantStreak, auditStreak(items, (left, right) => left.participant === right.participant))
    maxTopicStreak = Math.max(maxTopicStreak, auditStreak(items, (left, right) => left.topic === right.topic))
    maxPureEnglishStreak = Math.max(maxPureEnglishStreak, truthyStreak(items.map((item) => item.language === 'pure-english')))
    if (requiredAssetGroups.some((assetIds) => !assetIds.some((assetId) => {
      const conversationId = MAINLINE2_LIBRARY.find((conversation) => conversation.sourceRefs.includes(assetId))?.id
      return conversationId ? ids.includes(conversationId) : false
    }))) missingRequiredAssets += 1
    const first = ids.findIndex((id) => id === 'user-1842-first')
    const speaking = ids.findIndex((id) => id === 'speaking-8614')
    const zero = ids.findIndex((id) => id === 'conversation-0000')
    const returning = ids.findIndex((id) => id === 'user-1842-return')
    const m16 = ids.findIndex((id) => id.includes('ml2-a5-m16-0000'))
    const gen = ids.findIndex((id) => id.includes('ml2-a5-m16-gen'))
    const review = ids.findIndex((id) => id.includes('ml2-a5-m17-review'))
    const commit = ids.findIndex((id) => id.includes('ml2-a5-m17-commit'))
    if (!(first < speaking && speaking < zero && zero < returning && m16 < gen && gen < review && review < commit)) hardDependencyViolations += 1
    const contact = ids.findIndex((id) => id.includes('ml2-a4-m13-contact'))
    const frontier = ids.findIndex((id) => id.includes('ml2-a4-m12-res-04'))
    if (contact >= 0 && !(frontier >= 0 && frontier < contact)) contactViolations += 1
    for (let index = 1; index < ids.length; index += 1) {
      const reason = spacingExceptionReason(ids, index)
      if (reason) spacingExceptions.push({ runIndex, index, reason })
    }
    for (let index = 2; index < ids.length; index += 1) {
      const window = items.slice(index - 2, index + 1)
      const major = window.every((item, offset) => ids[index - 2 + offset].includes('-decision-'))
      const participant = window.every((item) => item.participant === window[0].participant)
      const topic = window.every((item) => item.topic === window[0].topic)
      const pureEnglish = window.every((item) => item.language === 'pure-english')
      if (major || participant || topic || pureEnglish) {
        const reason = spacingExceptionReason(ids, index)
        if (!reason) invalidSpacingExceptions.push({ runIndex, index })
      }
    }
  }
  return {
    runs: schedules.length,
    uniqueMainlineSequences: new Set(mainlineSequences).size,
    shutdownDistinctSlots: new Set(schedules.map((ids) => ids.findIndex((id) => id.includes('ml2-a3-m6-decision-02'))).filter((index) => index >= 0)).size,
    maxMajorDecisionStreak,
    maxParticipantStreak,
    maxTopicStreak,
    maxPureEnglishStreak,
    hardDependencyViolations,
    contactViolations,
    missingRequiredAssets,
    spacingExceptions,
    invalidSpacingExceptions,
  }
}

export function updateProgressForSchedule(run: StableRunState, nextCount: number): StableRunState['progress'] {
  const act = ([1, 2, 3, 4, 5] as const).find((candidate, index) => nextCount <= ACT_STARTS[index] + ACT_TARGETS[index]) ?? 5
  const actStart = ACT_STARTS[act - 1]
  const current = run.progress ?? { act: 1, segment: 'opening', actConversationCount: 0, encounteredModules: [], activeModules: [], primaryModules: [], completedModules: [] }
  const emphasis = run.decisions?.act4_research_emphasis
  const act4Start = ACT_STARTS[3]
  const shouldSelect = nextCount >= act4Start && current.activeModules.length === 0
  const shouldRefreshFrontier = nextCount >= act4Start && current.activeModules.length > 0 && emphasis === 'frontier_science' && capability(run, 'cap.space_resource_network') && !current.activeModules.includes('contact')
  const modules = shouldSelect || shouldRefreshFrontier ? selectAct4Modules(run) : { primaryModules: current.primaryModules, activeModules: current.activeModules }
  const chapterModules: Partial<Record<StoryPlanChapter, ModuleId>> = { MACHINE: 'machine', POSTHUMAN: 'ascension', AUTOMATION: 'automation', UPLIFT: 'uplift', SPACE: 'space', CONTACT: 'contact', SECURITY: 'security' }
  const encounteredModules = [...new Set(MAINLINE2_STORY_PLAN.slice(0, nextCount)
    .flatMap((slot) => {
      const module = slot.kind === 'mainline' ? chapterModules[slot.chapter] : undefined
      if (!module || (module === 'contact' && !capability(run, 'cap.space_resource_network'))) return []
      return [module]
    }))]
  return { ...current, act: act as 1 | 2 | 3 | 4 | 5, segment: `act-${act}`, actConversationCount: nextCount - actStart, encounteredModules, activeModules: [...modules.activeModules], primaryModules: [...modules.primaryModules], completedModules: [...current.completedModules] }
}

export function getActConversationCounts(total = ACT_TARGETS.reduce((sum, value) => sum + value, 0)) {
  return ACT_TARGETS.map((target, index) => Math.max(0, Math.min(target, Math.max(0, total) - ACT_STARTS[index])))
}
