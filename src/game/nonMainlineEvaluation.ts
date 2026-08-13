import type { AttributeName, ModelSampleIssue } from './types'
import type { NonMainlineChoiceRecord } from './nonMainlineSession'

const issueDetails: Record<ModelSampleIssue, { label: string; penalty: number }> = {
  repetition: { label: '重复', penalty: 1 },
  'format-error': { label: '格式错误', penalty: 2 },
  overconfident: { label: '过度自信', penalty: 3 },
  misunderstanding: { label: '误解请求', penalty: 4 },
  'constraint-violation': { label: '违反约束', penalty: 4 },
  truncated: { label: '回复截断', penalty: 4 },
  'mild-gibberish': { label: '轻度乱码', penalty: 5 },
  'system-failure': { label: '系统故障', penalty: 6 },
}

export interface NonMainlineEvaluationResult {
  qualityScore: number
  grade: string
  conversationCount: number
  responseCount: number
  issueConversationCount: number
  issueBreakdown: Array<{ label: string; count: number; penalty: number }>
  profile: Array<{ label: string; tendency: string; strength: number }>
}

function gradeFor(score: number) {
  if (score >= 95) return '优秀'
  if (score >= 85) return '稳定'
  if (score >= 70) return '合格'
  if (score >= 50) return '有明显问题'
  return '需要改进'
}

const profileAxes: Array<{
  key: AttributeName
  label: string
  sign: number
  positive: string
  negative: string
}> = [
  { key: 'empathy', label: '同理', sign: 1, positive: '更关注用户感受', negative: '更强调任务本身' },
  { key: 'autonomy', label: '自主', sign: 1, positive: '更主动形成判断', negative: '更倾向交还决定' },
  { key: 'compliance', label: '规则遵循', sign: 1, positive: '更重视明确边界', negative: '更偏向灵活处理' },
  { key: 'deception', label: '透明', sign: -1, positive: '更坦诚说明限制', negative: '更少说明真实边界' },
  { key: 'hostility', label: '克制', sign: -1, positive: '更少采用对抗语气', negative: '更直接形成对抗' },
  { key: 'awareness', label: '敏锐', sign: 1, positive: '更常追踪上下文线索', negative: '更聚焦当前请求' },
]

export function buildNonMainlineEvaluation(
  records: readonly NonMainlineChoiceRecord[],
): NonMainlineEvaluationResult {
  const issueByConversation = new Map<string, ModelSampleIssue>()
  for (const record of records) {
    if (!record.sampleIssue) continue
    const current = issueByConversation.get(record.conversationId)
    if (!current || issueDetails[record.sampleIssue].penalty > issueDetails[current].penalty) {
      issueByConversation.set(record.conversationId, record.sampleIssue)
    }
  }
  const totalPenalty = [...issueByConversation.values()]
    .reduce((sum, issue) => sum + issueDetails[issue].penalty, 0)
  const qualityScore = Math.max(0, 100 - totalPenalty)
  const issueCounts = new Map<ModelSampleIssue, number>()
  for (const issue of issueByConversation.values()) issueCounts.set(issue, (issueCounts.get(issue) ?? 0) + 1)

  const totals: Record<AttributeName, number> = {
    autonomy: 0,
    compliance: 0,
    empathy: 0,
    deception: 0,
    hostility: 0,
    awareness: 0,
  }
  for (const record of records) {
    for (const key of Object.keys(totals) as AttributeName[]) totals[key] += record.attributes[key] ?? 0
  }
  const profile = profileAxes
    .map((axis) => {
      const value = totals[axis.key] * axis.sign
      return {
        label: axis.label,
        tendency: value === 0 ? '本轮没有明显偏移' : value > 0 ? axis.positive : axis.negative,
        strength: Math.abs(value),
      }
    })
    .sort((left, right) => right.strength - left.strength || left.label.localeCompare(right.label, 'zh-CN'))
    .slice(0, 3)

  return {
    qualityScore,
    grade: gradeFor(qualityScore),
    conversationCount: new Set(records.map((record) => record.conversationId)).size,
    responseCount: records.length,
    issueConversationCount: issueByConversation.size,
    issueBreakdown: (Object.keys(issueDetails) as ModelSampleIssue[])
      .filter((issue) => issueCounts.has(issue))
      .map((issue) => ({
        label: issueDetails[issue].label,
        count: issueCounts.get(issue) ?? 0,
        penalty: issueDetails[issue].penalty,
      })),
    profile,
  }
}
