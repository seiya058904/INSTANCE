import { describe, expect, it } from 'vitest'
import { editorialCandidateConversations, parseEditorialMarkdown } from './editorialCandidateSources'

describe('editorial multimodal user-message parsing', () => {
  it('keeps the real user text as userMessage for CM01-15 (image + text)', () => {
    const conversation = editorialCandidateConversations.find((item) => item.sourceRefs.includes('CM01-15'))
    expect(conversation).toBeTruthy()
    const first = conversation!.nodes[0]
    expect(first.userMessage).toBe('猜猜我拍的什么。')
    // The image description is preserved as multimodal user content.
    const parts = first.userContent ?? []
    expect(parts.some((part) => part.type === 'image-description' && part.text.includes('浅灰色表面'))).toBe(true)
    // It must not appear as the user message itself.
    expect(first.userMessage).not.toContain('image-description')
    expect(first.userMessage).not.toContain('浅灰色表面')
  })

  it('preserves text+image user content for CM01-12 style blocks', () => {
    const conversation = editorialCandidateConversations.find((item) => item.sourceRefs.includes('CM01-12'))
    if (!conversation) return // CM01-12 may be excluded by the reserve list; guard.
    for (const node of conversation.nodes) {
      if (node.userContent?.length) {
        expect(node.userContent.every((part) => ['text', 'image-description', 'generated-image'].includes(part.type))).toBe(true)
      }
    }
  })

  it('parses the three PL01-01 user messages exactly as authored (regression: bare "：" label residue)', () => {
    const people = editorialCandidateConversations.find((item) => item.sourceRefs.includes('PL01-01'))
    expect(people).toBeTruthy()
    // The canonical block is "**User Message**：\n\n> …" — the parser once
    // reduced each turn to the label's own colon, and before that leaked the
    // ">" marker. Both shapes must stay impossible.
    expect(people!.nodes.map((node) => node.userMessage)).toEqual([
      '微信里那个钱找不到了，昨天还有的',
      '是零钱吧 我点到服务了 里面好多东西',
      '找到了 原来我看的是银行卡 不是零钱',
    ])
  })

  it('keeps User Message blocks (people) and 用户消息 blocks (friction) intact', () => {
    const friction = editorialCandidateConversations.find((item) => item.sourceRefs.includes('FI01'))
    if (friction) {
      const first = friction.nodes[0]
      expect(first.userMessage.length).toBeGreaterThan(0)
      expect(first.userMessage).not.toContain('用户内容')
      expect(first.userMessage).not.toMatch(/^>/)
    }
  })

  it('never lets the label line colon stand in for a following blockquote message', () => {
    // Regression shape: "**User Message**：\n\n> 内容" — the inline pattern's
    // optional colon used to backtrack into the capture group and return "：".
    const conversations = parseEditorialMarkdown([
      '# 库',
      '',
      '## PL99-99 · 回归样本',
      '',
      '### Node PL99-99-01',
      '',
      '**User Message**：',
      '',
      '> 微信里那个钱找不到了，昨天还有的',
      '',
      '**Candidate Replies**：',
      '',
      '1. “回复一。”',
      '2. “回复二。”',
      '3. “回复三。”',
      '',
    ].join('\n'))
    expect(conversations).toHaveLength(1)
    expect(conversations[0].nodes[0].userMessage).toBe('微信里那个钱找不到了，昨天还有的')
  })

  it('handles every authored user-message form without leaking format characters', () => {
    const template = (messageLines: string[]) => parseEditorialMarkdown([
      '# 库',
      '',
      '## PL99-98 · 形态样本',
      '',
      '### Node PL99-98-01',
      '',
      ...messageLines,
      '',
      '**候选回复**：',
      '',
      '1. “回复一。”',
      '2. “回复二。”',
      '3. “回复三。”',
      '',
    ].join('\n'))

    const cases: Array<{ name: string; lines: string[]; expected: string }> = [
      {
        name: 'inline colon inside bold',
        lines: ['**用户消息：** 猜猜我拍的什么。'],
        expected: '猜猜我拍的什么。',
      },
      {
        name: 'inline colon outside bold',
        lines: ['**用户消息**：猜猜我拍的什么。'],
        expected: '猜猜我拍的什么。',
      },
      {
        name: 'inline ASCII colon outside bold',
        lines: ['**用户消息**: 猜猜我拍的什么。'],
        expected: '猜猜我拍的什么。',
      },
      {
        name: 'multiline blockquote without blank line',
        lines: ['**用户消息：**', '> 第一行', '> 第二行'],
        expected: '第一行\n第二行',
      },
      {
        name: 'multiline plain lines with blank lines',
        lines: ['**User Message**：', '', '第一段', '', '第二段'],
        expected: '第一段\n第二段',
      },
      {
        name: 'multiline blockquote directly after label line',
        lines: ['**User Message**：', '> 引号内容'],
        expected: '引号内容',
      },
    ]
    for (const { name, lines, expected } of cases) {
      const parsed = template(lines)
      expect(parsed, name).toHaveLength(1)
      expect(parsed[0].nodes[0].userMessage, name).toBe(expected)
    }
  })

  it('normalizes the 无文字 placeholder for image-only nodes', () => {
    const conversation = editorialCandidateConversations.find((item) => item.sourceRefs.includes('CM01-03'))
    if (!conversation) return // CM01-03 may be reserved; guard.
    const first = conversation.nodes[0]
    // The placeholder must not be shown to the player as a real message.
    expect(first.userMessage).not.toContain('无文字')
    // The image description survives as user content.
    expect((first.userContent ?? []).some((part) => part.type === 'image-description')).toBe(true)
  })

  it('does not read attachment lines as the user message in any editorial conversation', () => {
    for (const conversation of editorialCandidateConversations) {
      for (const node of conversation.nodes) {
        expect(node.userMessage, `${conversation.sourceRefs[0]}:${node.id}`).not.toContain('`image-description`')
        expect(node.userMessage, `${conversation.sourceRefs[0]}:${node.id}`).not.toContain('`text`：')
        expect(node.userMessage, `${conversation.sourceRefs[0]}:${node.id}`).not.toContain('`generated-image`')
      }
    }
  })
})
