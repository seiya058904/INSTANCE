import { describe, expect, it } from 'vitest'
import {
  auditSelectedExpansion01,
  selectedExpansion01Conversations,
  selectedExpansion01Records,
} from './selectedExpansion01'
import { ordinaryConversationPool } from './runManifest'

describe('selected expansion 01 integration boundary', () => {
  it('keeps the editorial funnel at 25 P1 and 9 P2 records', () => {
    const audit = auditSelectedExpansion01()
    expect(audit.p1).toHaveLength(25)
    expect(audit.p2).toHaveLength(9)
    expect(new Set(selectedExpansion01Records.map((record) => record.sourceRef)).size).toBe(34)
  })

  it('integrates only the 15 non-conflicting KEEP finalists', () => {
    expect(selectedExpansion01Conversations).toHaveLength(15)
    expect(selectedExpansion01Conversations.every((conversation) => conversation.id.startsWith('selected-'))).toBe(true)
    expect(selectedExpansion01Conversations.every((conversation) => conversation.nodes.length > 0)).toBe(true)
    expect(selectedExpansion01Conversations.flatMap((conversation) => conversation.nodes).every((node) => node.choices.length >= 3)).toBe(true)
  })

  it('keeps transcription and quoted context distinct from Aster model errors', () => {
    const speech = selectedExpansion01Records.find((record) => record.sourceRef === 'FI03')
    const quoted = selectedExpansion01Records.find((record) => record.sourceRef === 'FI08')
    expect(speech?.reason).toContain('不标成 Aster Model Error')
    expect(quoted?.disposition).toBe('RESERVE')
  })

  it('integrates the 15 KEEP finalists under their selected- identity, with re-curated non-KEEP refs entering only via the editorial pool', () => {
    const selectedIds = new Set(selectedExpansion01Conversations.map((conversation) => conversation.id))
    const poolSelected = ordinaryConversationPool.filter((conversation) => selectedIds.has(conversation.id))
    expect(poolSelected).toHaveLength(15)
    expect(new Set(ordinaryConversationPool.map((conversation) => conversation.id)).size).toBe(ordinaryConversationPool.length)
    expect(ordinaryConversationPool.some((conversation) => conversation.id === 'selected-cm01-09' && conversation.sourceRefs.includes('FI06'))).toBe(true)
    expect(ordinaryConversationPool.filter((conversation) => conversation.sourceRefs.includes('FI06'))).toHaveLength(1)
    // The 2026-08 user-rating re-curation promoted every reviewed editorial
    // asset into the ordinary pool, including refs this funnel once parked as
    // RESERVE (they enter with their editorial-* identity, never as a second
    // copy of an integrated conversation).
    expect(ordinaryConversationPool.some((conversation) => conversation.sourceRefs.includes('CM01-13'))).toBe(true)
    expect(ordinaryConversationPool.filter((conversation) => conversation.sourceRefs.includes('CM01-13'))).toHaveLength(1)
  })
})
