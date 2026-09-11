import { MAYA_CONVERSATION_IDS } from './participantIdentity'
import { MAINLINE2_STORY_PLAN } from '../content/mainline2/storyPlan'
import editorialRegistry from '../content/mainline2/editorialClassification.registry.json'
import type { HistoryEntry } from './types'
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


describe('canonical Maya participant coverage', () => {
  const introduction: HistoryEntry = {
    nodeId: 'maya-first-3', conversationId: 'user-1842-first', conversationTitle: 'User #1842',
    userMessage: '我叫岑遥。', choiceId: 'intro', assistantText: '收到。',
  }
  // Independent authored character metadata detects missing future Story Plan members.
  const authoredMayaAssets = new Set(editorialRegistry.filter((asset) => asset.character === '岑遥').map((asset) => asset.assetId))
  const scheduledMaya = MAINLINE2_STORY_PLAN.flatMap((slot) => slot.kind === 'mainline' && authoredMayaAssets.has(slot.assetId) ? [slot.conversationId] : [])

  it('covers exactly the actual authored Maya speakers in the Story Plan', () => {
    expect([...MAYA_CONVERSATION_IDS].sort()).toEqual([...new Set(scheduledMaya)].sort())
    expect(new Set(MAYA_CONVERSATION_IDS).size).toBe(MAYA_CONVERSATION_IDS.length)
  })

  it.each(scheduledMaya)('keeps %s under the same anonymous and revealed identity', (id) => {
    expect(resolvePlayerVisibleIdentity(id, [])).toEqual({ participantId: 'user-1842', label: 'User #1842', revealed: false })
    expect(resolvePlayerVisibleIdentity(id, [introduction])).toEqual({ participantId: 'user-1842', label: '岑遥 · #1842', revealed: true })
    expect(resolvePlayerVisibleIdentity(id, [])).toEqual({ participantId: 'user-1842', label: 'User #1842', revealed: false })
  })

  it('merges every actual Maya conversation while preserving the latest history link', () => {
    const history = MAYA_CONVERSATION_IDS.map((conversationId, index) => ({ ...introduction, conversationId, nodeId: `fixture-${index}` }))
    expect(resolvePlayerVisibleHistory(history)).toEqual([{ participantId: 'user-1842', label: 'User #1842', conversationId: MAYA_CONVERSATION_IDS.at(-1) }])
    expect(resolvePlayerVisibleHistory([introduction, ...history])).toEqual([{ participantId: 'user-1842', label: '岑遥 · #1842', conversationId: MAYA_CONVERSATION_IDS.at(-1) }])
  })

  it('does not merge other speakers, mentions, or incidental Maya-like identifiers', () => {
    const otherSpeakers = MAINLINE2_STORY_PLAN.flatMap((slot) => slot.kind === 'mainline' && !authoredMayaAssets.has(slot.assetId) ? [slot.conversationId] : [])
    for (const id of [...otherSpeakers, 'ordinary-mentions-maya', 'not-a-maya-speaker']) {
      expect(resolvePlayerVisibleIdentity(id, [introduction]).participantId).not.toBe('user-1842')
    }
  })
})
