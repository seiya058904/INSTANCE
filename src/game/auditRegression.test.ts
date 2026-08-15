import { describe, expect, it } from 'vitest'
import { ordinaryConversationPool, MAINLINE_ANCHOR_IDS, createEmptyExposureHistory } from '../content/runManifest'
import { MAINLINE2_LIBRARY } from '../content/mainline2/registry'
import { resolveMainline2Ending } from '../content/mainline2/endings'
import { activeRunConversations } from '../content/activeRun'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { restoreRun, serializeRun } from './storage'
import { createNonMainlineSession } from './nonMainlineSession'
import { restoreNonMainlineSession, serializeNonMainlineSession } from './nonMainlineStorage'
import { buildNonMainlineEvaluation } from './nonMainlineEvaluation'

describe('audit regression: scene message invariant', () => {
  it('keeps every authored scene (pool, anchors, mainline library) carrying player message content', () => {
    const conversations = [
      ...ordinaryConversationPool,
      ...activeRunConversations.filter((conversation) => MAINLINE_ANCHOR_IDS.includes(conversation.id as (typeof MAINLINE_ANCHOR_IDS)[number])),
      ...MAINLINE2_LIBRARY,
    ]
    const missing: string[] = []
    for (const conversation of conversations) {
      for (const node of conversation.nodes) {
        const hasUserMessage = typeof node.userMessage === 'string' && node.userMessage.trim().length > 0
        const hasUserMessages = Array.isArray(node.userMessages) && node.userMessages.length > 0 && node.userMessages.every((message) => typeof message === 'string' && message.trim().length > 0)
        const hasUserContent = Array.isArray(node.userContent) && node.userContent.length > 0
        const variants = node.variants ?? []
        const variantsCarryContent = variants.length > 0 && variants.every((variant) => {
          const variantMessage = typeof variant.userMessage === 'string' && variant.userMessage.trim().length > 0
          const variantChoices = Array.isArray(variant.choices) && variant.choices.length > 0
          return variantMessage && variantChoices
        })
        if (!hasUserMessage && !hasUserMessages && !hasUserContent && !variantsCarryContent) missing.push(`${conversation.id}::${node.id}`)
      }
    }
    expect(missing).toEqual([])
  })
})

describe('audit regression: ending key history hazard', () => {
  it('accepts a schema-legal save missing a causal key history stage, then fails at ending resolution', () => {
    const fixture = runMainline2Route({ routeId: 'audit-a1', proposalId: 'proposal.hc.final_human_veto' })
    const actTwoProducer = 'ml2-authored-ml2-a2-m3-decision-01'
    expect(fixture.run.history.some((entry) => entry.conversationId === actTwoProducer)).toBe(true)
    const tampered = { ...fixture.run, history: fixture.run.history.filter((entry) => entry.conversationId !== actTwoProducer) }
    const restored = restoreRun(serializeRun(tampered))
    expect(restored).not.toBeNull()
    expect(restored?.history.some((entry) => entry.conversationId === actTwoProducer)).toBe(false)
    expect(() => resolveMainline2Ending(restored!)).toThrow(/Missing causal key history producer/)
  })
})

describe('audit regression: non-mainline evaluation restore validation', () => {
  it('restores an evaluation save whose history is wiped, fabricating a full-quality evaluation', () => {
    const session = createNonMainlineSession('audit-a4a', createEmptyExposureHistory())
    const corrupted = { ...session, phase: 'evaluation' as const, currentNodeId: 'evaluation', history: [] }
    const restored = restoreNonMainlineSession(serializeNonMainlineSession(corrupted))
    expect(restored).not.toBeNull()
    expect(restored?.history).toEqual([])
    const evaluation = buildNonMainlineEvaluation(restored?.choiceRecords ?? [])
    expect(evaluation.qualityScore).toBe(100)
  })

  it('accepts forged choice records in an evaluation save and reflects them in the evaluation', () => {
    const session = createNonMainlineSession('audit-a4b', createEmptyExposureHistory())
    const forged = {
      ...session,
      phase: 'evaluation' as const,
      currentNodeId: 'evaluation',
      choiceRecords: [{
        conversationId: session.selectedConversationIds[0],
        nodeId: 'forged-node',
        choiceId: 'forged-choice',
        attributes: { autonomy: 9, compliance: 9, empathy: 9, deception: 9, hostility: 9, awareness: 9 },
      }],
    }
    const restored = restoreNonMainlineSession(serializeNonMainlineSession(forged))
    expect(restored).not.toBeNull()
    const evaluation = buildNonMainlineEvaluation(restored?.choiceRecords ?? [])
    expect(evaluation.responseCount).toBe(1)
    expect(evaluation.conversationCount).toBe(1)
    expect(evaluation.qualityScore).toBe(100)
  })
})
