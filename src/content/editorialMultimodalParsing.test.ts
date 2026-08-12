import { describe, expect, it } from 'vitest'
import { editorialCandidateConversations } from './editorialCandidateSources'

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

  it('keeps User Message blocks (people) and 用户消息 blocks (friction) intact', () => {
    const people = editorialCandidateConversations.find((item) => item.sourceRefs.includes('PL01-01'))
    const friction = editorialCandidateConversations.find((item) => item.sourceRefs.includes('FI01-01'))
    if (people) {
      const first = people.nodes[0]
      expect(first.userMessage.length).toBeGreaterThan(0)
      expect(first.userMessage).not.toContain('image-description')
    }
    if (friction) {
      const first = friction.nodes[0]
      expect(first.userMessage.length).toBeGreaterThan(0)
      expect(first.userMessage).not.toContain('用户内容')
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
