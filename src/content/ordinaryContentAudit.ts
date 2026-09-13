export type AuditClassification = 'MAINLINE' | 'NON_MAINLINE' | 'UNCERTAIN'

export type AuditSubcategory =
  | 'PROGRAMMING'
  | 'STUDY'
  | 'LIFE'
  | 'RELATIONSHIP'
  | 'WORK'
  | 'WRITING'
  | 'HUMOR'
  | 'OTHER'

export interface AuditAssetInput {
  assetId: string
  conversationId: string
  source: string
  title: string
  topic?: string
  text: string
  usedInStoryPlan: boolean
  sourceKind?: 'mainline' | 'ordinary' | 'legacy' | 'unused-authored' | 'unknown'
  manualDecision?: AuditClassification
}

export interface AuditClassificationResult {
  assetId: string
  classification: AuditClassification
  subcategory: AuditSubcategory
  reason: string
  usedInStoryPlan: boolean
  source: string
}

export interface OrdinaryChoiceAuditNode {
  id: string
  choices: Array<{ id: string; text: string }>
}

export interface OrdinaryChoiceAuditConversation {
  id: string
  sourceRefs?: string[]
  nodes: OrdinaryChoiceAuditNode[]
}

export interface OrdinaryChoiceAuditRecord {
  conversationId: string
  assetId: string
  nodeId: string
  placeholderChoiceIds: string[]
  exactDuplicateChoiceGroups: string[][]
  nearDuplicateChoiceGroups: string[][]
  truncatedChoiceIds: string[]
  lowDiversity: boolean
}

export interface OrdinaryChoiceQualityReport {
  conversationCount: number
  nodeCount: number
  choiceCount: number
  placeholderCount: number
  exactDuplicateCount: number
  nearDuplicateCount: number
  truncatedTextCount: number
  templateOnlyNodeCount: number
  lowDiversityNodeCount: number
  records: OrdinaryChoiceAuditRecord[]
}

const WORLD_EVIDENCE = [
  'aster', 'maya', 'cascade', 'echo', 'a1', 'autonomous research', 'ai 权利', 'machine civilization',
  'posthuman', 'automation', 'uplift', 'contact', 'civilization convention', '机器文明', '后人类', '自动化',
  '太空', '外星', '第一接触', '意识上传', '模型自主', '战争', '政府', '制度变化', '主线', '结局',
]

const AMBIGUOUS_EVIDENCE = [
  '这个模型', '这个 ai', '人工智能', '智能系统', '算法', '模型变化', '系统上线', '自动排班', '自动补货',
]

function normalized(value: string) {
  return value.toLocaleLowerCase('zh-CN')
}

function containsAny(text: string, terms: readonly string[]) {
  const value = normalized(text)
  return terms.some((term) => value.includes(term))
}

const PLACEHOLDER_REPLY = /^(?:按当前输入继续整理|继续整理|按现有内容继续|根据当前输入处理|继续处理即可)[。.!！]?$/

function comparableChoiceText(text: string) {
  return normalized(text).replace(/[\p{P}\p{S}\s]/gu, '')
}

function duplicateGroups(choices: Array<{ id: string; text: string }>, near: boolean) {
  const groups = new Map<string, string[]>()
  choices.forEach((choice) => {
    const key = near ? comparableChoiceText(choice.text) : choice.text
    const group = groups.get(key) ?? []
    group.push(choice.id)
    groups.set(key, group)
  })
  return [...groups.values()].filter((group) => group.length > 1)
}

export function scanOrdinaryChoiceQuality(conversations: OrdinaryChoiceAuditConversation[]): OrdinaryChoiceQualityReport {
  const records: OrdinaryChoiceAuditRecord[] = []
  let choiceCount = 0
  for (const conversation of conversations) {
    for (const node of conversation.nodes) {
      choiceCount += node.choices.length
      const placeholderChoiceIds = node.choices.filter((choice) => PLACEHOLDER_REPLY.test(choice.text.trim())).map((choice) => choice.id)
      const exactDuplicateChoiceGroups = duplicateGroups(node.choices, false)
      const nearDuplicateGroups = duplicateGroups(node.choices, true)
        .filter((group) => !exactDuplicateChoiceGroups.some((exactGroup) => exactGroup.join('|') === group.join('|')))
      const truncatedChoiceIds = node.choices
        .filter((choice) => /—$/.test(choice.text.trim()))
        .map((choice) => choice.id)
      const distinctComparableTexts = new Set(node.choices.map((choice) => comparableChoiceText(choice.text)))
      records.push({
        conversationId: conversation.id,
        assetId: conversation.sourceRefs?.[0] ?? conversation.id,
        nodeId: node.id,
        placeholderChoiceIds,
        exactDuplicateChoiceGroups,
        nearDuplicateChoiceGroups: nearDuplicateGroups,
        truncatedChoiceIds,
        lowDiversity: distinctComparableTexts.size <= Math.max(1, Math.ceil(node.choices.length / 2)),
      })
    }
  }
  return {
    conversationCount: conversations.length,
    nodeCount: records.length,
    choiceCount,
    placeholderCount: records.reduce((sum, record) => sum + record.placeholderChoiceIds.length, 0),
    exactDuplicateCount: records.reduce((sum, record) => sum + record.exactDuplicateChoiceGroups.length, 0),
    nearDuplicateCount: records.reduce((sum, record) => sum + record.nearDuplicateChoiceGroups.length, 0),
    truncatedTextCount: records.reduce((sum, record) => sum + record.truncatedChoiceIds.length, 0),
    templateOnlyNodeCount: records.filter((record) => record.placeholderChoiceIds.length >= 3).length,
    lowDiversityNodeCount: records.filter((record) => record.lowDiversity).length,
    records,
  }
}

function subcategoryFor(input: AuditAssetInput): AuditSubcategory {
  const text = normalized(`${input.title} ${input.topic ?? ''} ${input.text}`)
  if (/(react|javascript|typescript|python|代码|报错|编程|程序|bug)/i.test(text)) return 'PROGRAMMING'
  if (/(考试|复习|作业|英语|数学|学习|论文|单词)/i.test(text)) return 'STUDY'
  if (/(简历|请假|迟到|同事|面试|工作|职场|项目群)/i.test(text)) return 'WORK'
  if (/(邮件|润色|文案|写一封|改写|翻译|作文)/i.test(text)) return 'WRITING'
  if (/(朋友|恋爱|男朋友|女朋友|不回|关系|吵架)/i.test(text)) return 'RELATIONSHIP'
  if (/(笑话|搞笑|脑筋急转弯|梗|荒谬)/i.test(text)) return 'HUMOR'
  if (/(鸡蛋|晚饭|做菜|宠物|医院|迟到|旅行|天气|冰箱|健康)/i.test(text)) return 'LIFE'
  return 'OTHER'
}

export function classifyAuditAsset(input: AuditAssetInput): AuditClassificationResult {
  const evidence = `${input.assetId} ${input.source} ${input.title} ${input.topic ?? ''} ${input.text}`
  const subcategory = subcategoryFor(input)
  if (input.manualDecision) {
    return {
      assetId: input.assetId,
      classification: input.manualDecision,
      subcategory,
      reason: input.manualDecision === 'MAINLINE'
        ? '人工复核确认该内容与 INSTANCE 世界、人物、事件、能力、制度、社会变化或结局存在直接或间接关系。'
        : input.manualDecision === 'UNCERTAIN'
          ? '人工复核无法证明该内容与 INSTANCE 世界完全无关，因此保守保留为 UNCERTAIN。'
          : '人工复核确认该内容可在删除 INSTANCE 全部专有设定后独立成立，仅模拟普通 AI 日常请求。',
      usedInStoryPlan: input.usedInStoryPlan,
      source: input.source,
    }
  }
  if (input.usedInStoryPlan || input.sourceKind === 'mainline' || containsAny(evidence, WORLD_EVIDENCE)) {
    return {
      assetId: input.assetId,
      classification: 'MAINLINE',
      subcategory,
      reason: '该内容被主线使用，或人工审计证据表明它反映 INSTANCE 世界、事件、人物、能力、制度、社会变化或结局。',
      usedInStoryPlan: input.usedInStoryPlan,
      source: input.source,
    }
  }
  if (containsAny(evidence, AMBIGUOUS_EVIDENCE)) {
    return {
      assetId: input.assetId,
      classification: 'UNCERTAIN',
      subcategory,
      reason: '内容含有可能指向 INSTANCE 能力或世界变化的表述，缺少人工确认前不得进入普通内容评分页。',
      usedInStoryPlan: input.usedInStoryPlan,
      source: input.source,
    }
  }
  return {
    assetId: input.assetId,
    classification: 'NON_MAINLINE',
    subcategory,
    reason: `人工复核确认这是与 INSTANCE 世界完全无关的普通 ${subcategory.toLowerCase()} AI 请求。`,
    usedInStoryPlan: input.usedInStoryPlan,
    source: input.source,
  }
}

export function isReviewableNonMainline(result: AuditClassificationResult) {
  return result.classification === 'NON_MAINLINE'
}

export type UserMessageDefectReason =
  | 'empty-without-content'
  | 'blockquote-leak'
  | 'authoring-label-leak'
  | 'attachment-leak'
  | 'format-symbol-only'
  | 'punctuation-only-without-expression'
  | 'user-message-array-mismatch'

export interface OrdinaryUserMessageAuditNode {
  id: string
  userMessage: string
  userMessages?: readonly string[]
  userContent?: readonly unknown[]
  behaviorMode?: string
  choiceKind?: string
  /** Player-visible alternate-route prompts (Mainline anchors use variants). */
  variantUserMessages?: readonly (readonly string[])[]
}

export interface OrdinaryUserMessageAuditConversation {
  id: string
  sourceRefs?: readonly string[]
  nodes: OrdinaryUserMessageAuditNode[]
}

export interface OrdinaryUserMessageAuditRecord {
  conversationId: string
  assetId: string
  nodeId: string
  reasons: UserMessageDefectReason[]
  userMessage: string
  userMessages: readonly string[]
}

export interface OrdinaryUserMessageQualityReport {
  conversationCount: number
  nodeCount: number
  defectNodeCount: number
  reasonCounts: Record<string, number>
  records: OrdinaryUserMessageAuditRecord[]
}

// Markdown structure characters can never be a player's authored message.
const ALL_PUNCTUATION = /^[\p{P}\p{S}\s]+$/u
// A bare message made only of these marks is a plausible intentional
// expression (question-mark behavior); anything else punctuation-only is not.
const EXPRESSION_PUNCTUATION = /^[?!！？…]+$/u
// Structure characters that only appear as Markdown/authoring residue.
const FORMAT_CHARACTERS = /[>#*`~|_[\]-]/u
const BLOCKQUOTE_LEAK = /^\s*>/
const AUTHORING_LABEL_LEAK = /\*\*\s*(?:User Message|用户消息|用户内容|Candidate Replies|候选回复)/i
const BARE_LABEL_LEAK = /^\s*(?:Candidate Replies|候选回复|User Message|用户消息)\s*[：:]/
const ATTACHMENT_LEAK = /`(?:image-description|generated-image|text)`/i

/**
 * Classifies one player-visible user message. `hasUserContent` marks
 * image/attachment turns (an empty message is legal there);
 * `expressionSemantics` marks nodes whose authored behavior explicitly makes a
 * bare punctuation message the intended input (for example the question-mark
 * expression node, whose message is exactly "？").
 */
export function describeUserMessageDefect(
  message: string,
  options: { hasUserContent?: boolean; expressionSemantics?: boolean } = {},
): UserMessageDefectReason | null {
  const trimmed = message.trim()
  if (!trimmed) return options.hasUserContent ? null : 'empty-without-content'
  if (BLOCKQUOTE_LEAK.test(message)) return 'blockquote-leak'
  if (AUTHORING_LABEL_LEAK.test(message) || BARE_LABEL_LEAK.test(message)) return 'authoring-label-leak'
  if (ATTACHMENT_LEAK.test(message)) return 'attachment-leak'
  if (!ALL_PUNCTUATION.test(trimmed)) return null
  // A message made only of Markdown structure characters is always corruption,
  // even on expression nodes.
  if (FORMAT_CHARACTERS.test(trimmed)) return 'format-symbol-only'
  if (EXPRESSION_PUNCTUATION.test(trimmed)) {
    return options.expressionSemantics ? null : 'punctuation-only-without-expression'
  }
  return 'punctuation-only-without-expression'
}

function visibleMessages(node: OrdinaryUserMessageAuditNode): readonly string[] {
  // Route-specific prompts replace the node prompt entirely when present.
  if (node.variantUserMessages?.length) return node.variantUserMessages.flat()
  return node.userMessages?.length ? node.userMessages : [node.userMessage]
}

/** Burst nodes keep the whitespace-joined prompt as the userMessage fallback
 * next to the separate userMessages bubbles; that mirror is designed, while a
 * genuinely divergent pair is a defect. */
function isDesignedMessageArrayMirror(node: OrdinaryUserMessageAuditNode) {
  if (!node.userMessages?.length || !node.userMessage.trim()) return true
  if (node.userMessages.includes(node.userMessage)) return true
  return node.userMessage.replace(/\s+/g, '') === node.userMessages.join('').replace(/\s+/g, '')
}

function hasExpressionSemantics(node: OrdinaryUserMessageAuditNode) {
  return node.choiceKind === 'expression' || node.behaviorMode === 'question-mark'
}

function hasUserContent(node: OrdinaryUserMessageAuditNode) {
  return Array.isArray(node.userContent) && node.userContent.length > 0
}

/** Quality gate for player-facing user messages across the ordinary runtime.
 * Detects parser residue (blockquotes, authoring labels, attachment lines) and
 * degenerate symbol-only messages, while leaving intentional expression nodes
 * (declared via choiceKind/behaviorMode) and image-only turns untouched. */
export function scanOrdinaryUserMessageQuality(conversations: OrdinaryUserMessageAuditConversation[]): OrdinaryUserMessageQualityReport {
  const records: OrdinaryUserMessageAuditRecord[] = []
  const reasonCounts: Record<string, number> = {}
  for (const conversation of conversations) {
    for (const node of conversation.nodes) {
      const messages = visibleMessages(node)
      const variantMessages = node.variantUserMessages ?? []
      const reasons = new Set<UserMessageDefectReason>()
      const expressionSemantics = hasExpressionSemantics(node)
      const content = hasUserContent(node)
      for (const message of [...messages, ...variantMessages.flat()]) {
        const reason = describeUserMessageDefect(message, { hasUserContent: content, expressionSemantics })
        if (reason) reasons.add(reason)
      }
      if (!isDesignedMessageArrayMirror(node)) {
        reasons.add('user-message-array-mismatch')
      }
      if (reasons.size > 0) {
        for (const reason of reasons) reasonCounts[reason] = (reasonCounts[reason] ?? 0) + 1
        records.push({
          conversationId: conversation.id,
          assetId: conversation.sourceRefs?.[0] ?? conversation.id,
          nodeId: node.id,
          reasons: [...reasons],
          userMessage: node.userMessage,
          userMessages: [...messages],
        })
      }
    }
  }
  return {
    conversationCount: conversations.length,
    nodeCount: conversations.reduce((sum, conversation) => sum + conversation.nodes.length, 0),
    defectNodeCount: records.length,
    reasonCounts,
    records,
  }
}
