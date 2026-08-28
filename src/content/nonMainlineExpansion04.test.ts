import { describe, expect, it } from 'vitest'
import { nonMainlineExpansion04Conversations } from './nonMainlineExpansion04'
import { scanOrdinaryChoiceQuality } from './ordinaryContentAudit'
import { ordinaryConversationPool } from './runManifest'

describe('Non-Mainline Content Expansion 04', () => {
  it('adds all 36 approved conversations to the ordinary pool', () => {
    expect(nonMainlineExpansion04Conversations).toHaveLength(36)
    expect(new Set(nonMainlineExpansion04Conversations.map((conversation) => conversation.id)).size).toBe(36)
    expect(nonMainlineExpansion04Conversations.every((conversation) => conversation.sourceRefs[0].startsWith('EXP04-'))).toBe(true)
    expect(nonMainlineExpansion04Conversations.every((conversation) => ordinaryConversationPool.includes(conversation))).toBe(true)
    expect(ordinaryConversationPool).toHaveLength(338)
  })

  it('keeps node and choice identities unique and preserves authored issue annotations', () => {
    const nodes = nonMainlineExpansion04Conversations.flatMap((conversation) => conversation.nodes)
    const choices = nodes.flatMap((node) => node.choices)
    expect(new Set(nodes.map((node) => node.id)).size).toBe(nodes.length)
    expect(new Set(choices.map((choice) => choice.id)).size).toBe(choices.length)
    expect(nodes).toHaveLength(53)
    expect(choices).toHaveLength(199)
    expect(choices.filter((choice) => choice.sampleIssue).length).toBe(53)
    expect(choices.filter((choice) => choice.sampleIssue === 'system-failure').length).toBe(0)
  })

  it('does not introduce Mainline or proposal content', () => {
    expect(nonMainlineExpansion04Conversations.every((conversation) => (
      conversation.sourceRefs.every((sourceRef) => sourceRef.startsWith('EXP04-'))
      && conversation.nodes.every((node) => node.choices.every((choice) => !choice.proposalId && !choice.decisionBinding))
    ))).toBe(true)
  })

  it('keeps every image-input conversation backed by real image-description payloads', () => {
    const imageInputs = nonMainlineExpansion04Conversations.filter((conversation) => conversation.interactionPattern === 'image-input')
    expect(imageInputs.length).toBeGreaterThanOrEqual(2)
    const missing = imageInputs.filter((conversation) => (
      !conversation.nodes.some((node) => node.userContent?.some((part) => part.type === 'image-description'))
    ))
    expect(missing.map((conversation) => conversation.sourceRefs[0] ?? conversation.id)).toEqual([])
  })

  it('keeps the new batch clean under the ordinary choice quality scan', () => {
    const report = scanOrdinaryChoiceQuality(nonMainlineExpansion04Conversations.map((conversation) => ({
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
