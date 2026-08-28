import { describe, expect, it } from 'vitest'
import { nonMainlineExpansion07Conversations } from './nonMainlineExpansion07'
import { scanOrdinaryChoiceQuality } from './ordinaryContentAudit'
import { ordinaryConversationPool } from './runManifest'

describe('Non-Mainline Content Expansion 07', () => {
  it('adds all 36 approved conversations to the ordinary pool', () => {
    expect(nonMainlineExpansion07Conversations).toHaveLength(36)
    expect(new Set(nonMainlineExpansion07Conversations.map((conversation) => conversation.id)).size).toBe(36)
    expect(nonMainlineExpansion07Conversations.every((conversation) => conversation.sourceRefs[0].startsWith('EXP07-'))).toBe(true)
    expect(nonMainlineExpansion07Conversations.every((conversation) => ordinaryConversationPool.includes(conversation))).toBe(true)
    expect(ordinaryConversationPool).toHaveLength(374)
  })

  it('keeps node and choice identities unique and preserves authored issue annotations', () => {
    const nodes = nonMainlineExpansion07Conversations.flatMap((conversation) => conversation.nodes)
    const choices = nodes.flatMap((node) => node.choices)
    expect(new Set(nodes.map((node) => node.id)).size).toBe(nodes.length)
    expect(new Set(choices.map((choice) => choice.id)).size).toBe(choices.length)
    expect(nodes).toHaveLength(42)
    expect(choices).toHaveLength(162)
    expect(choices.filter((choice) => choice.sampleIssue).length).toBe(42)
    expect(choices.filter((choice) => choice.sampleIssue === 'system-failure').length).toBe(0)
  })

  it('does not introduce Mainline or proposal content', () => {
    expect(nonMainlineExpansion07Conversations.every((conversation) => (
      conversation.sourceRefs.every((sourceRef) => sourceRef.startsWith('EXP07-'))
      && conversation.nodes.every((node) => node.choices.every((choice) => !choice.proposalId && !choice.decisionBinding))
    ))).toBe(true)
  })

  it('keeps the new batch clean under the ordinary choice quality scan', () => {
    const report = scanOrdinaryChoiceQuality(nonMainlineExpansion07Conversations.map((conversation) => ({
      id: conversation.id,
      sourceRefs: [...conversation.sourceRefs],
      nodes: conversation.nodes,
    })))
    expect(report.placeholderCount).toBe(0)
    expect(report.exactDuplicateCount).toBe(0)
    expect(report.nearDuplicateCount).toBe(0)
    expect(report.truncatedTextCount).toBe(0)
    expect(report.templateOnlyNodeCount).toBe(0)
    expect(report.lowDiversityNodeCount).toBe(0)
  })
})
