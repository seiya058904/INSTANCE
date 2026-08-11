import { describe, expect, it } from 'vitest'
import { resolvePlayerVisibleHistory, resolvePlayerVisibleIdentity } from './playerIdentity'

describe('player-facing identity', () => {
  it('hides internal topic titles for an unseen conversation', () => {
    const identity = resolvePlayerVisibleIdentity('ml2-authored-ml2-a2-m3-log-01', [])

    expect(identity.label).toMatch(/^User #[0-9]{4}$/)
    expect(identity.label).not.toContain('Regional logistics pilot')
  })

  it('reveals Lin Shaoheng only after the authored introduction has happened', () => {
    const before = resolvePlayerVisibleIdentity('ml2-authored-ml2-a2-m3-lsh-01', [])
    const after = resolvePlayerVisibleIdentity('ml2-authored-ml2-a2-m3-lsh-01', [{
      nodeId: 'a2m3-lsh-intro-001',
      conversationId: 'ml2-authored-ml2-a2-m3-lsh-01',
      conversationTitle: '林绍衡第一次出现',
      userMessage: '我叫林绍衡。',
      choiceId: 'choice',
      assistantText: '收到。',
    }])

    expect(before.label).toMatch(/^User #[0-9]{4}$/)
    expect(after.label).toContain('林绍衡')
    expect(after.label).not.toContain('第一次出现')
  })

  it('keeps Maya identity stable across her first and return conversations', () => {
    const identity = resolvePlayerVisibleIdentity('user-1842-return', [{
      nodeId: 'maya-first-3',
      conversationId: 'user-1842-first',
      conversationTitle: 'User #1842',
      userMessage: '那先记一个最小的吧。我叫岑遥。',
      choiceId: 'choice',
      assistantText: '我会诚实说明边界。',
    }])

    expect(identity.label).toBe('岑遥 · #1842')
  })

  it('does not expose the internal #0000 identity before a reveal event', () => {
    const identity = resolvePlayerVisibleIdentity('conversation-0000', [])

    expect(identity.label).toMatch(/^User #[0-9]{4}$/)
    expect(identity.label).not.toContain('0000')
  })

  it('builds sidebar history only from completed conversations and removes internal titles', () => {
    const history = resolvePlayerVisibleHistory([{
      nodeId: 'log-1',
      conversationId: 'ml2-authored-ml2-a2-m3-log-01',
      conversationTitle: 'Regional logistics pilot',
      userMessage: '我们做一个区域协同试点。',
      choiceId: 'choice',
      assistantText: '先确认数据边界。',
    }])

    expect(history).toHaveLength(1)
    expect(history[0].label).toMatch(/^User #[0-9]{4}$/)
    expect(history[0].label).not.toContain('Regional logistics pilot')
  })

  it('merges recurring conversations under the identity already revealed by the player', () => {
    const history = resolvePlayerVisibleHistory([{
      nodeId: 'maya-first-3',
      conversationId: 'user-1842-first',
      conversationTitle: 'User #1842',
      userMessage: '我叫岑遥。',
      choiceId: 'choice-1',
      assistantText: '我会说明边界。',
    }, {
      nodeId: 'maya-return-1',
      conversationId: 'user-1842-return',
      conversationTitle: '岑遥 · #1842',
      userMessage: '你还愿意继续吗？',
      choiceId: 'choice-2',
      assistantText: '愿意。',
    }])

    expect(history).toHaveLength(1)
    expect(history[0].label).toBe('岑遥 · #1842')
  })
})
