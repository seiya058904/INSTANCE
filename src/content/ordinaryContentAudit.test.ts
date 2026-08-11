import { describe, expect, it } from 'vitest'
import { classifyAuditAsset, isReviewableNonMainline } from './ordinaryContentAudit'

const asset = (overrides: Record<string, unknown> = {}) => ({
  assetId: 'test-asset',
  conversationId: 'test-conversation',
  source: 'test-source',
  title: '测试对话',
  topic: 'programming',
  text: '帮我修复这个 React 报错。',
  usedInStoryPlan: false,
  ...overrides,
})

describe('ordinary content audit classification', () => {
  it('allows a fully generic programming request into NON_MAINLINE', () => {
    const result = classifyAuditAsset(asset())
    expect(result.classification).toBe('NON_MAINLINE')
    expect(isReviewableNonMainline(result)).toBe(true)
  })

  it('keeps an indirect social world echo in MAINLINE', () => {
    const result = classifyAuditAsset(asset({
      assetId: 'world-echo',
      title: '夜班员工',
      text: '自动补货系统上线以后，我们夜班只剩两个人了。',
    }))
    expect(result.classification).toBe('MAINLINE')
    expect(isReviewableNonMainline(result)).toBe(false)
  })

  it('keeps an ambiguous reference in UNCERTAIN', () => {
    const result = classifyAuditAsset(asset({
      assetId: 'ambiguous',
      text: '最近这个模型变化很大，我不知道该不该继续用。',
    }))
    expect(result.classification).toBe('UNCERTAIN')
    expect(isReviewableNonMainline(result)).toBe(false)
  })
})
