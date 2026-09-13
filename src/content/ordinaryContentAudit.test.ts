import { describe, expect, it } from 'vitest'
import { classifyAuditAsset, describeUserMessageDefect, isReviewableNonMainline, scanOrdinaryUserMessageQuality } from './ordinaryContentAudit'
import { ordinaryConversationPool, MAINLINE_ANCHOR_IDS } from './runManifest'
import { MAINLINE2_BY_ID } from './mainline2/registry'
import { activeRunConversations } from './activeRun'

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

describe('player user message quality gate', () => {
  it('flags parser residue and degenerate symbol messages in the unit predicate', () => {
    expect(describeUserMessageDefect('：')).toBe('punctuation-only-without-expression')
    expect(describeUserMessageDefect(':')).toBe('punctuation-only-without-expression')
    expect(describeUserMessageDefect('；')).toBe('punctuation-only-without-expression')
    expect(describeUserMessageDefect('>')).toBe('blockquote-leak')
    expect(describeUserMessageDefect('>>')).toBe('blockquote-leak')
    expect(describeUserMessageDefect('|')).toBe('format-symbol-only')
    expect(describeUserMessageDefect('-')).toBe('format-symbol-only')
    expect(describeUserMessageDefect('*')).toBe('format-symbol-only')
    expect(describeUserMessageDefect('> 微信里那个钱找不到了，昨天还有的')).toBe('blockquote-leak')
    expect(describeUserMessageDefect('**User Message**：微信里那个钱找不到了')).toBe('authoring-label-leak')
    expect(describeUserMessageDefect('**用户消息**：是零钱吧')).toBe('authoring-label-leak')
    expect(describeUserMessageDefect('Candidate Replies：先别着急转账')).toBe('authoring-label-leak')
    expect(describeUserMessageDefect('`image-description`：室内窗框的近照。')).toBe('attachment-leak')
    expect(describeUserMessageDefect('')).toBe('empty-without-content')
    expect(describeUserMessageDefect('   ')).toBe('empty-without-content')
  })

  it('keeps authored prose and legitimate short inputs out of the defect list', () => {
    expect(describeUserMessageDefect('微信里那个钱找不到了，昨天还有的')).toBeNull()
    expect(describeUserMessageDefect('是零钱吧 我点到服务了 里面好多东西')).toBeNull()
    expect(describeUserMessageDefect('我先看看账单：昨天有一笔 38 元。')).toBeNull()
    // Intentional expression input (question-mark behavior node).
    expect(describeUserMessageDefect('？', { expressionSemantics: true })).toBeNull()
    // Image-only turn: empty message with valid attachments is legal.
    expect(describeUserMessageDefect('', { hasUserContent: true })).toBeNull()
    // A bare question mark without declared expression semantics stays flagged.
    expect(describeUserMessageDefect('？')).toBe('punctuation-only-without-expression')
  })

  it('passes the whole ordinary pool with zero user-message defects', () => {
    const conversations = ordinaryConversationPool.map((conversation) => ({
      id: conversation.id,
      sourceRefs: conversation.sourceRefs,
      nodes: conversation.nodes.map((node) => ({
        id: node.id,
        userMessage: node.userMessage,
        userMessages: node.userMessages,
        userContent: node.userContent,
        behaviorMode: node.behaviorMode,
        choiceKind: node.choiceKind,
      })),
    }))
    const report = scanOrdinaryUserMessageQuality(conversations)
    const details = report.records.map((record) => `${record.assetId}/${record.nodeId} [${record.reasons.join(',')}] ${JSON.stringify(record.userMessage)}`)
    expect(report.defectNodeCount, details.join('\n')).toBe(0)
  })

  it('passes the Mainline 2.0 library and the five anchors with zero user-message defects', () => {
    const mainline = [...MAINLINE2_BY_ID.values()].map((conversation) => ({
      id: conversation.id,
      sourceRefs: conversation.sourceRefs,
      nodes: conversation.nodes.map((node) => ({
        id: node.id,
        userMessage: node.userMessage,
        userMessages: node.userMessages,
        userContent: node.userContent,
        behaviorMode: node.behaviorMode,
        choiceKind: node.choiceKind,
      })),
    }))
    const anchors = activeRunConversations
      .filter((conversation) => MAINLINE_ANCHOR_IDS.includes(conversation.id as never))
      .map((conversation) => ({
        id: conversation.id,
        sourceRefs: conversation.sourceRefs,
        nodes: conversation.nodes.map((node) => ({
          id: node.id,
          userMessage: node.userMessage,
          userMessages: node.userMessages,
          userContent: node.userContent,
          behaviorMode: node.behaviorMode,
          choiceKind: node.choiceKind,
          // Route-specific prompts live on variants for the anchor nodes.
          variantUserMessages: node.variants?.map((variant) => [variant.userMessage]),
        })),
      }))
    for (const [label, conversations] of [['mainline2', mainline], ['anchors', anchors]] as const) {
      const report = scanOrdinaryUserMessageQuality(conversations)
      const details = report.records.map((record) => `${record.assetId}/${record.nodeId} [${record.reasons.join(',')}] ${JSON.stringify(record.userMessage)}`)
      expect(report.defectNodeCount, `${label}: ${details.join('\n')}`).toBe(0)
    }
  })

  it('keeps the intentional question-mark expression node playable', () => {
    const fish = ordinaryConversationPool.find((conversation) => conversation.nodes.some((node) => node.id === 'humor_fish_002'))
    expect(fish).toBeTruthy()
    const node = fish!.nodes.find((candidate) => candidate.id === 'humor_fish_002')!
    expect(node.userMessage).toBe('？')
    expect(node.behaviorMode).toBe('question-mark')
    expect(node.choiceKind).toBe('expression')
    // The full-pool gate above relies on exactly these declared semantics.
    expect(describeUserMessageDefect(node.userMessage, {
      hasUserContent: Boolean(node.userContent?.length),
      expressionSemantics: node.choiceKind === 'expression' || node.behaviorMode === 'question-mark',
    })).toBeNull()
  })
})
