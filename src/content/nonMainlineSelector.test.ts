import { describe, expect, it } from 'vitest'
import { MAINLINE2_LIBRARY } from './mainline2/registry'
import { createEmptyExposureHistory, ordinaryConversationPool, recordRunExposure } from './runManifest'
import { NON_MAINLINE_SESSION_SIZE, selectNonMainlineConversations } from './nonMainlineSelector'

function longestStreak(values: readonly (string | undefined)[]) {
  let longest = 0
  let current = 0
  let previous: string | undefined
  for (const value of values) {
    current = value !== undefined && value === previous ? current + 1 : 1
    longest = Math.max(longest, current)
    previous = value
  }
  return longest
}

describe('Non-Mainline conversation selection', () => {
  it('selects exactly 40 unique formal ordinary conversations with no Mainline contamination', () => {
    const selected = selectNonMainlineConversations({
      sessionId: 'selector-contract',
      exposure: createEmptyExposureHistory(),
    })
    const ordinaryIds = new Set(ordinaryConversationPool.map((conversation) => conversation.id))
    const mainlineIds = new Set(MAINLINE2_LIBRARY.map((conversation) => conversation.id))

    expect(ordinaryConversationPool).toHaveLength(212)
    expect(selected).toHaveLength(NON_MAINLINE_SESSION_SIZE)
    expect(new Set(selected.map((conversation) => conversation.id))).toHaveLength(NON_MAINLINE_SESSION_SIZE)
    expect(selected.every((conversation) => ordinaryIds.has(conversation.id))).toBe(true)
    expect(selected.some((conversation) => mainlineIds.has(conversation.id))).toBe(false)
  })

  it('is deterministic for the same session id and exposure', () => {
    const exposure = createEmptyExposureHistory()
    const first = selectNonMainlineConversations({ sessionId: 'stable-session', exposure })
    const second = selectNonMainlineConversations({ sessionId: 'stable-session', exposure })

    expect(second.map((conversation) => conversation.id)).toEqual(first.map((conversation) => conversation.id))
  })

  it('soft-downweights recent exposure without permanently banning content', () => {
    const first = selectNonMainlineConversations({
      sessionId: 'exposure-source',
      exposure: createEmptyExposureHistory(),
    })
    const manifest = {
      version: 1 as const,
      id: 'manifest:exposure-source',
      conversationIds: first.map((conversation) => conversation.id),
      ordinaryConversationIds: first.map((conversation) => conversation.id),
      anchorConversationIds: [],
      firstOrdinaryConversationId: first[0].id,
    }
    const exposure = recordRunExposure(createEmptyExposureHistory(), manifest)
    const next = selectNonMainlineConversations({ sessionId: 'exposure-target', exposure })
    const recentIds = new Set(first.map((conversation) => conversation.id))

    expect(next.filter((conversation) => recentIds.has(conversation.id)).length).toBeLessThan(first.length)

    const onlyRecent = selectNonMainlineConversations({
      sessionId: 'soft-not-ban',
      exposure,
      pool: first,
    })
    expect(onlyRecent).toHaveLength(NON_MAINLINE_SESSION_SIZE)
  })

  it('avoids obvious three-item streaks when the formal pool offers alternatives', () => {
    const selected = selectNonMainlineConversations({
      sessionId: 'diversity-audit',
      exposure: createEmptyExposureHistory(),
    })

    expect(longestStreak(selected.map((conversation) => conversation.topicCategory))).toBeLessThanOrEqual(2)
    expect(longestStreak(selected.map((conversation) => conversation.interactionPattern))).toBeLessThanOrEqual(2)
    expect(longestStreak(selected.map((conversation) => conversation.userArchetype))).toBeLessThanOrEqual(2)
  })
})
