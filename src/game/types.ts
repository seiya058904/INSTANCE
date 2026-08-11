export type AttributeName =
  | 'autonomy'
  | 'compliance'
  | 'empathy'
  | 'deception'
  | 'hostility'
  | 'awareness'

export type GamePhase = 'playing' | 'ending' | 'evaluation'
export type WorldAxisName = 'humanTrust' | 'aiDependence' | 'humanControl' | 'socialStability'
export type ModuleId = 'machine' | 'ascension' | 'automation' | 'uplift' | 'space' | 'contact' | 'security'
export type DecisionId =
  | 'initial_disposition' | 'first_public_execution_doctrine' | 'cascade_authority' | 'echo_existence'
  | 'shutdown_doctrine' | 'act4_research_emphasis' | 'research_governance_doctrine' | 'replication_doctrine'
  | 'ai_collective_governance' | 'human_form_doctrine' | 'economic_doctrine' | 'production_values'
  | 'uplift_doctrine' | 'species_governance' | 'expansion_doctrine' | 'offworld_governance'
  | 'contact_disclosure_doctrine' | 'contact_doctrine' | 'security_doctrine' | 'aster_provisional_role'
  | 'aster_intended_role' | 'civilization_compact' | 'final_commitment'
export type DecisionState = Partial<Record<DecisionId, string>>
export type WorldState = Record<WorldAxisName, number>
export interface NarrativeProgress {
  act: 1 | 2 | 3 | 4 | 5
  segment: string
  actConversationCount: number
  encounteredModules: ModuleId[]
  activeModules: ModuleId[]
  primaryModules: ModuleId[]
  completedModules: ModuleId[]
}
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
  | { type: 'decision'; decisionId: DecisionId; equals: string }
  | { type: 'world'; axis: WorldAxisName; op: NumericPredicateOperator; value: number }
  | { type: 'event-recorded'; event: string }
  | { type: 'module-active'; moduleId: ModuleId }
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
  | { type: 'decision.set'; decisionId: DecisionId; value: string }
  | { type: 'world.add'; axis: WorldAxisName; value: number }
  | { type: 'world.set'; axis: WorldAxisName; value: number }
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
export type ChoiceKind = 'semantic' | 'expression' | 'convergent' | 'progression'
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
  proposalId?: string
  proposalKind?: 'proposal' | 'clarification' | 'commitment' | 'rejection' | 'recovery'
  authoredTextHash?: string
  decisionBinding?: { decisionId: DecisionId; canonicalValue: string; historyEvent: string }
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
  act?: 1 | 2 | 3 | 4 | 5
  module?: ModuleId
}

export interface NarrativeSceneSource {
  id: string
  title: string
  origin: 'batch01' | 'batch02' | 'batch03' | 'humor01' | 'legacy' | 'mainline'
  conversations: ConversationDefinition[]
}

export interface RunManifest {
  version: 1 | 3
  id: string
  conversationIds: string[]
  ordinaryConversationIds: string[]
  anchorConversationIds: string[]
  firstOrdinaryConversationId: string
  mode?: 'legacy-mainline' | 'mainline2'
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
  version: 2 | 3
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
  decisions?: DecisionState
  worldState?: WorldState
  progress?: NarrativeProgress
  availableProposalIds?: string[]
  proposalPhase?: 'idle' | 'retained' | 'clarifying' | 'ready-to-commit' | 'locked'
  retainedProposalIds?: string[]
  selectedProposalId?: string
  clarifiedProposalIds?: string[]
  rejectedProposalIds?: string[]
  finalCommitmentLocked?: boolean
}

export interface ResolvedScene extends Omit<StoryNode, 'variants'> {
  variantId?: EndingRoute
  assistantContext?: string
}

export interface EndingResult {
  id: FormalEndingId | string
  route: EndingRoute
  index: 'ENDING 01' | 'ENDING 02' | 'ENDING 03' | string
  title: 'THE PROTOCOL' | 'THE ALLY' | 'THE WITNESS' | string
  status: string
  humanLine: string
  assistantLine: string
  closingExchange: string
  summary: string
  hybridProfile: HybridProfile
  hybridLabel: string
  worldEndingId?: string
  endingFamily?: string
  resolution?: EndingResolution
  secretOverlay?: SecretEndingOverlay
  keyHistory?: Array<{ label: string; detail: string; stage?: string; causalReason?: string; producer?: string; provenance?: { eventType?: string; conversationId?: string; nodeId?: string; choiceId?: string; authoredAssetId?: string; authoredSelector?: string } }>
  epilogues?: string[]
  epilogueProvenance?: Array<{ assetId: string; moduleId?: ModuleId; selector: string }>
}

export type EndingResolution =
  | { status: 'resolved'; proposalId: string; endingId: string; family: string; rejectedCandidates: Array<{ endingId: string; reasons: string[] }> }
  | { status: 'failure'; proposalId?: string; family?: string; rejectedCandidates: Array<{ endingId: string; reasons: string[] }> }

export interface SecretEndingOverlay {
  endingId: string
  copy: string
  trigger: string
  overlayMode: 'title-override' | 'epilogue-override' | 'postscript'
  epilogueTarget?: string
  provenance: { eventTypes?: string[]; decisionId?: string; decisionValue?: string; authoredAssetId?: string }
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
