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
