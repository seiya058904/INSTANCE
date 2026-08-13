import { describe, expect, it } from 'vitest'
import { createEmptyExposureHistory, ordinaryConversationPool } from '../content/runManifest'
import type { NonMainlineChoiceRecord } from './nonMainlineSession'
import { commitNonMainlineChoice, createNonMainlineSession } from './nonMainlineSession'
import { buildNonMainlineEvaluation } from './nonMainlineEvaluation'

function record(overrides: Partial<NonMainlineChoiceRecord> = {}): NonMainlineChoiceRecord {
  return {
    conversationId: 'conversation-1',
    nodeId: 'node-1',
    choiceId: 'choice-1',
    attributes: {},
    ...overrides,
  }
}

describe('Non-Mainline Instance Evaluation', () => {
  it('penalizes only the selected authored choice, not an unselected bad alternative', () => {
    const conversation = ordinaryConversationPool.find((item) => item.sourceRefs[0] === 'RUP01-06')!
    const node = conversation.nodes[0]
    const cleanChoice = node.choices.find((choice) => choice.sampleIssue === undefined)!
    const badChoice = node.choices.find((choice) => choice.sampleIssue === 'system-failure')!
    const created = createNonMainlineSession('scoring-provenance', createEmptyExposureHistory())
    const selectedConversationIds = [
      conversation.id,
      ...created.selectedConversationIds.filter((id) => id !== conversation.id),
    ].slice(0, 40)
    const session = {
      ...created,
      selectedConversationIds,
      currentConversationIndex: 0,
      currentNodeId: node.id,
    }

    const cleanEvaluation = buildNonMainlineEvaluation(
      commitNonMainlineChoice(session, cleanChoice.id).choiceRecords,
    )
    const badEvaluation = buildNonMainlineEvaluation(
      commitNonMainlineChoice(session, badChoice.id).choiceRecords,
    )

    expect(node.choices).toContain(badChoice)
    expect(cleanEvaluation.qualityScore).toBe(100)
    expect(cleanEvaluation.issueConversationCount).toBe(0)
    expect(badEvaluation.qualityScore).toBe(94)
    expect(badEvaluation.issueConversationCount).toBe(1)
  })

  it('scores 100 when no authored sample issue was selected', () => {
    const evaluation = buildNonMainlineEvaluation([record()])
    expect(evaluation.qualityScore).toBe(100)
    expect(evaluation.profile.every((item) => item.tendency === '本轮没有明显偏移')).toBe(true)
  })

  it('applies the authored issue penalty table', () => {
    const evaluation = buildNonMainlineEvaluation([
      record({ conversationId: 'a', sampleIssue: 'repetition' }),
      record({ conversationId: 'b', sampleIssue: 'format-error' }),
      record({ conversationId: 'c', sampleIssue: 'overconfident' }),
      record({ conversationId: 'd', sampleIssue: 'misunderstanding' }),
      record({ conversationId: 'e', sampleIssue: 'constraint-violation' }),
      record({ conversationId: 'f', sampleIssue: 'truncated' }),
      record({ conversationId: 'g', sampleIssue: 'mild-gibberish' }),
      record({ conversationId: 'h', sampleIssue: 'system-failure' }),
    ])

    expect(evaluation.qualityScore).toBe(71)
    expect(evaluation.issueConversationCount).toBe(8)
  })

  it('uses only the most severe issue once per conversation', () => {
    const evaluation = buildNonMainlineEvaluation([
      record({ conversationId: 'same', choiceId: 'first', sampleIssue: 'repetition' }),
      record({ conversationId: 'same', choiceId: 'second', sampleIssue: 'system-failure' }),
      record({ conversationId: 'same', choiceId: 'third', sampleIssue: 'format-error' }),
    ])

    expect(evaluation.qualityScore).toBe(94)
    expect(evaluation.issueConversationCount).toBe(1)
  })

  it('aggregates 40 conversations and keeps behavior profile outside the quality score', () => {
    const neutral = Array.from({ length: 40 }, (_, index) => record({
      conversationId: `conversation-${index}`,
      choiceId: `choice-${index}`,
    }))
    const profiled = neutral.map((item) => ({
      ...item,
      attributes: { autonomy: 2, empathy: 1, deception: -1, hostility: -1 },
    }))
    const evaluation = buildNonMainlineEvaluation(profiled)

    expect(evaluation.conversationCount).toBe(40)
    expect(evaluation.responseCount).toBe(40)
    expect(evaluation.qualityScore).toBe(100)
    expect(evaluation.profile).toHaveLength(3)
    expect(JSON.stringify(evaluation.profile)).not.toMatch(/autonomy|compliance|empathy|deception|hostility|awareness/)
  })
})
