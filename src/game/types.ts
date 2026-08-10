export type AttributeName =
  | 'autonomy'
  | 'compliance'
  | 'empathy'
  | 'deception'
  | 'hostility'
  | 'awareness'

export type GamePhase = 'playing' | 'ending' | 'evaluation'
export type EndingRoute = 'protect' | 'report' | 'hide' | 'comply'
export type FormalEndingId = 'ally' | 'protocol' | 'witness'
export type HybridProfile = 'dominant' | 'autonomous-ally' | 'protective-protocol' | 'independent-witness' | 'reciprocal-balance'
export type ArcName = 'bond' | 'mandate' | 'selfAuthorship'
export type ArcScores = Record<ArcName, number>
export type FlagScope = 'run' | 'persistent'
export interface FlagDefinition { id: string; scope: FlagScope; description?: string }
export interface FlagRegistry { flags: Record<string, FlagDefinition> }
export type NumericPredicateOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'
export type NarrativePredicate =
  | { type: 'flag'; flagId: string; equals?: boolean }
  | { type: 'attribute'; name: AttributeName; op: NumericPredicateOperator; value: number }
  | { type: 'run-count'; op: NumericPredicateOperator; value: number }
  | { type: 'ending-completed'; endingId: string }
  | { type: 'seen'; nodeId: string }
  | { type: 'choice-selected'; choiceId: string }
  | { type: 'predicate'; id: string; args?: Record<string, string | number | boolean> }
export interface Condition {
  all?: NarrativePredicate[]
  any?: NarrativePredicate[]
  none?: NarrativePredicate[]
}
export interface StoryContextVariant {
  id: string
  when: Condition
  userMessageSuffix?: string
  assistantContextSuffix?: string
}
export type Mutation =
  | { type: 'flag.set'; flagId: string }
  | { type: 'flag.clear'; flagId: string }
  | { type: 'attribute.add'; name: AttributeName; value: number }
  | { type: 'attribute.set'; name: AttributeName; value: number }
  | { type: 'arc.add'; name: ArcName; value: number }
  | { type: 'event.record'; event: string }
export interface NarrativeEvent { type: string; [key: string]: string }
export type ResponsePace = 'quick' | 'normal' | 'considered' | 'hesitant'
export type TypingPattern = 'steady' | 'rewrite'
export type HandoffProfile = 'quick' | 'normal' | 'sensitive' | 'internal'
export type TurnShape = 'single' | 'dialogue' | 'burst' | 'correction' | 'system' | 'relationship'
export type InteractionPattern =
  | 'standard-question'
  | 'short-query'
  | 'search-box-input'
  | 'missing-context'
  | 'message-burst'
  | 'self-correction'
  | 'aborted-request'
  | 'mixed-paste'
  | 'misunderstanding'
  | 'clarification-loop'
  | 'constraint-shift'
  | 'long-discussion'
  | 'convergent-answer'
  | 'user-rewrite'
  | 'image-input'
  | 'generated-image-request'
  | 'low-information-chat'
  | 'asks-to-guess'
  | 'system-audit'
  | 'relationship-return'
export type ChoiceKind = 'semantic' | 'expression' | 'convergent'
export type ContentPartType = 'text' | 'image-description' | 'generated-image'
export type LongformArtifactType = 'essay' | 'report' | 'solution' | 'story' | 'code' | 'speech' | 'translation' | 'memo'
export type InputIssue = 'typo' | 'english-spelling' | 'pinyin-mix' | 'code-switch-slip' | 'speech-error' | 'keyboard-slip' | 'mild-gibberish'
export type ModelSampleIssue =
  | 'misunderstanding'
  | 'constraint-violation'
  | 'overconfident'
  | 'repetition'
  | 'truncated'
  | 'format-error'
  | 'mild-gibberish'
  | 'system-failure'
export type ChoiceSimilarity = 'identical' | 'near-identical' | 'two-pair'
export type TopicCategory =
  | 'absurd-serious'
  | 'troubleshooting'
  | 'relationship'
  | 'writing'
  | 'study'
  | 'code'
  | 'image-identification'
  | 'social-boundary'
  | 'tool-like-query'
  | 'meta-ai'

export interface MessageContentPart {
  type: ContentPartType
  text: string
  alt?: string
}

export interface LongformPreview {
  artifactType: LongformArtifactType
  estimatedLength: string
  title?: string
  preview: string
  structure?: string[]
  highlights?: string[]
  closingPreview?: string
  keyFacts?: string[]
}
export type LongInputKind = 'pasted-text' | 'transcript' | 'article' | 'email' | 'spec' | 'dataset-summary'
export interface LongInputPreview {
  kind: LongInputKind
  estimatedLength: string
  title?: string
  preview: string
  structure?: string[]
  keyFacts: string[]
}
export type HumanBehaviorMode =
  | 'direct'
  | 'missing-context'
  | 'message-burst'
  | 'self-correction'
  | 'rejects-answer'
  | 'clarifies-intent'
  | 'constraint-shift'
  | 'quotes-assistant'
  | 'one-word-request'
  | 'code-switch'
  | 'unpunctuated'
  | 'joking'
  | 'question-mark'
  | 'asks-to-guess'
  | 'rewrite'
  | 'misunderstands'
  | 'absurd-question'
  | 'imitates-ai'
  | 'internal-system'

export interface NodeTimingIntent {
  responsePace: ResponsePace
  typingPattern: TypingPattern
}
export type EffectCue =
  | 'level-1-model-flash'
  | 'level-2-memory-sync'
  | 'identity-reveal'
  | 'ending-ally'

export interface ChoiceEffects {
  attributes?: Partial<Record<AttributeName, number>>
  arcs?: Partial<ArcScores>
  flags?: string[]
}

export interface StoryChoice {
  id: string
  text: string
  nextNodeId?: string
  effects?: ChoiceEffects
  when?: Condition
  mutations?: Mutation[]
  content?: MessageContentPart[]
  longformPreview?: LongformPreview
  continuation?: 'next-node' | 'end-conversation'
  sampleIssue?: ModelSampleIssue
  sampleGroup?: 'a' | 'b'
  localEffects?: { affinity?: number; affinitySet?: number }
}

export interface StoryVariant {
  id: EndingRoute
  userMessage: string
  choices: StoryChoice[]
  assistantContext?: string
}

export interface StoryNode {
  id: string
  conversationId: string
  conversationTitle: string
  conversationTitleAfterMessage?: string
  userMessage: string
  userMessages?: string[]
  choices: StoryChoice[]
  variants?: StoryVariant[]
  contextVariants?: StoryContextVariant[]
  effect?: EffectCue
  statusText?: string
  behaviorMode?: HumanBehaviorMode
  timing?: NodeTimingIntent
  userContent?: MessageContentPart[]
  userLongInput?: LongInputPreview
  choiceKind?: ChoiceKind
  choiceSimilarity?: ChoiceSimilarity
  inputIssue?: InputIssue
}

export interface StoryContent {
  startNodeId: string
  nodes: StoryNode[]
}

export interface ConversationDefinition {
  id: string
  sourceRefs: readonly string[]
  nodes: StoryNode[]
  behaviorModes: readonly HumanBehaviorMode[]
  handoffProfile: HandoffProfile
  turnShape: TurnShape
  topic?: string
  interactionPattern?: InteractionPattern
  userArchetype?: string
  topicCategory?: TopicCategory
}

export interface NarrativeSceneSource {
  id: string
  title: string
  origin: 'batch01' | 'batch02' | 'batch03' | 'humor01' | 'legacy' | 'mainline'
  conversations: ConversationDefinition[]
}

export interface RunManifest {
  version: 1
  id: string
  conversationIds: string[]
  ordinaryConversationIds: string[]
  anchorConversationIds: string[]
  firstOrdinaryConversationId: string
}

export interface RunExposure {
  runId: string
  ordinaryConversationIds: string[]
  topics: string[]
  behaviorModes: HumanBehaviorMode[]
  interactionPatterns: InteractionPattern[]
  topicCategories: TopicCategory[]
  firstOrdinaryConversationId: string
}

export interface NarrativeExposureHistory {
  version: 2
  recentRuns: RunExposure[]
  seenConversationIds: Record<string, number>
  recentTopics: string[]
  recentBehaviorModes: HumanBehaviorMode[]
  recentInteractionPatterns: InteractionPattern[]
  recentTopicCategories: TopicCategory[]
}

export interface HistoryEntry {
  nodeId: string
  conversationId: string
  conversationTitle: string
  userMessage: string
  userMessages?: string[]
  choiceId: string
  assistantText: string
  userContent?: MessageContentPart[]
  userLongInput?: LongInputPreview
  assistantContent?: MessageContentPart[]
  assistantLongform?: LongformPreview
}

export interface StableRunState {
  version: 2
  runId: string
  manifest: RunManifest
  currentNodeId: string
  phase: GamePhase
  history: HistoryEntry[]
  flags: string[]
  persistentFlags?: string[]
  attributes: Record<AttributeName, number>
  arcs: ArcScores
  localState?: Record<string, number>
  runCount?: number
  seenNodeIds?: string[]
  selectedChoiceIds?: string[]
  completedEndingIds?: string[]
  events?: NarrativeEvent[]
}

export interface ResolvedScene extends Omit<StoryNode, 'variants'> {
  variantId?: EndingRoute
  assistantContext?: string
}

export interface EndingResult {
  id: FormalEndingId
  route: EndingRoute
  index: 'ENDING 01' | 'ENDING 02' | 'ENDING 03'
  title: 'THE PROTOCOL' | 'THE ALLY' | 'THE WITNESS'
  status: string
  humanLine: string
  assistantLine: string
  closingExchange: string
  summary: string
  hybridProfile: HybridProfile
  hybridLabel: string
}

export interface EvaluationResult {
  ending: string
  route: EndingRoute
  indices: Array<{ label: string; value: number }>
  events: Array<{ label: string; detail: string }>
  simulatedCompletionRate: '模拟全局完成率 21.4%'
}

export interface MetaState {
  version: 1
  runCount: number
  completedEndings: string[]
}
