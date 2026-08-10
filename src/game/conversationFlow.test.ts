import { describe, expect, it } from 'vitest'
import { buildConversationTimeline, summarizeTimeline } from './conversationFlow'

describe('conversation timing scheduler', () => {
  it('keeps same-conversation replies inside the thread without assignment stages', () => {
    const timeline = buildConversationTimeline({
      assistantText: '这是玩家刚刚选择并提交的完整回复。',
      assistantSeed: 'same-assistant',
      humanText: '这是同一个用户的下一条消息。',
      humanSeed: 'same-human',
      sameConversation: true,
      timing: { responsePace: 'normal', typingPattern: 'steady' },
      handoffProfile: 'normal',
    })

    expect(timeline.map((step) => step.stage)).toEqual([
      'assistant-streaming',
      'human-waiting',
      'human-typing',
      'human-streaming',
      'ready',
    ])
  })

  it('uses one bounded handoff budget before a new conversation message streams', () => {
    const timeline = buildConversationTimeline({
      assistantText: '完整回复已经进入稳定历史。',
      assistantSeed: 'handoff-assistant',
      humanText: '新用户的第一条消息。',
      humanSeed: 'handoff-human',
      sameConversation: false,
      timing: { responsePace: 'considered', typingPattern: 'steady' },
      handoffProfile: 'sensitive',
    })
    const stages = timeline.map((step) => step.stage)
    const handoffMs = timeline
      .filter((step) => ['conversation-closing', 'assigning', 'connecting', 'human-typing'].includes(step.stage))
      .reduce((sum, step) => sum + step.durationMs, 0)

    expect(stages).toEqual([
      'assistant-streaming',
      'conversation-closing',
      'assigning',
      'connecting',
      'human-typing',
      'human-streaming',
      'ready',
    ])
    expect(handoffMs).toBe(2700)
  })

  it('keeps rewrite behavior rare and below the maximum human wait budget', () => {
    const timeline = buildConversationTimeline({
      assistantText: '我会等你重新组织这句话。',
      assistantSeed: 'rewrite-assistant',
      humanText: '刚才那句不算，我换一种说法。',
      humanSeed: 'rewrite-human',
      sameConversation: true,
      timing: { responsePace: 'hesitant', typingPattern: 'rewrite' },
      handoffProfile: 'sensitive',
    })
    const humanWaitMs = summarizeTimeline(timeline).humanWaitMs

    expect(timeline.map((step) => step.stage)).toContain('human-rewriting')
    expect(humanWaitMs).toBeLessThanOrEqual(3500)
  })

  it('collapses to a ready state in development instant mode', () => {
    const timeline = buildConversationTimeline({
      assistantText: '完整回复。',
      assistantSeed: 'instant-assistant',
      humanText: '下一条消息。',
      humanSeed: 'instant-human',
      sameConversation: false,
      timing: { responsePace: 'normal', typingPattern: 'steady' },
      handoffProfile: 'internal',
      instant: true,
    })
    expect(timeline).toEqual([{ stage: 'ready', durationMs: 0 }])
  })

  it('budgets every bubble in a burst instead of streaming only the first line', () => {
    const timeline = buildConversationTimeline({
      assistantText: '可以，先看看你还有什么。',
      assistantSeed: 'burst-assistant',
      humanText: '备用文本',
      humanMessages: ['第一条', '第二条', '第三条'],
      humanSeed: 'burst-human',
      sameConversation: false,
      timing: { responsePace: 'quick', typingPattern: 'steady' },
      handoffProfile: 'quick',
    })
    const humanStream = timeline.find((step) => step.stage === 'human-streaming')
    expect(humanStream?.durationMs).toBeGreaterThanOrEqual(960)
  })
})
