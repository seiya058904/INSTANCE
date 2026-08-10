import { describe, expect, it } from 'vitest'
import { classifyConversationLanguage, hasPureEnglishStreak } from './languagePacing'

describe('ordinary language pacing', () => {
  it('classifies an all-English user conversation as pure English', () => {
    expect(classifyConversationLanguage(['Can you explain this question?'])).toBe('pure-english')
  })

  it('does not classify Chinese with English terminology as pure English', () => {
    expect(classifyConversationLanguage(['这个 API 为什么返回 404？'])).not.toBe('pure-english')
  })

  it('detects the third consecutive pure-English ordinary conversation', () => {
    expect(hasPureEnglishStreak(['pure-english', 'pure-english'])).toBe(true)
    expect(hasPureEnglishStreak(['mixed', 'pure-english'])).toBe(false)
  })
})
