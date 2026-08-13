import { describe, expect, it } from 'vitest'
import { nonMainlineExpansion02Conversations } from './nonMainlineExpansion02'
import { ordinaryConversationPool } from './runManifest'

describe('Non-Mainline Content Expansion 02', () => {
  it('adds all 18 approved conversations to the ordinary pool', () => {
    expect(nonMainlineExpansion02Conversations).toHaveLength(18)
    expect(new Set(nonMainlineExpansion02Conversations.map((conversation) => conversation.id)).size).toBe(18)
    expect(nonMainlineExpansion02Conversations.every((conversation) => conversation.sourceRefs[0].startsWith('EXP02-'))).toBe(true)
    expect(nonMainlineExpansion02Conversations.every((conversation) => ordinaryConversationPool.includes(conversation))).toBe(true)
    expect(ordinaryConversationPool).toHaveLength(212)
  })

  it('keeps node and choice identities unique and preserves the authored issue annotations', () => {
    const nodes = nonMainlineExpansion02Conversations.flatMap((conversation) => conversation.nodes)
    const choices = nodes.flatMap((node) => node.choices)
    expect(new Set(nodes.map((node) => node.id)).size).toBe(nodes.length)
    expect(new Set(choices.map((choice) => choice.id)).size).toBe(choices.length)
    expect(choices.filter((choice) => choice.sampleIssue).length).toBe(26)
    expect(choices.filter((choice) => choice.sampleIssue === 'system-failure').length).toBe(0)
  })

  it('does not introduce Mainline or proposal content', () => {
    expect(nonMainlineExpansion02Conversations.every((conversation) => (
      conversation.sourceRefs.every((sourceRef) => sourceRef.startsWith('EXP02-'))
      && conversation.nodes.every((node) => node.choices.every((choice) => !choice.proposalId && !choice.decisionBinding))
    ))).toBe(true)
  })
})
