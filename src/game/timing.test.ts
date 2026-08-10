import { describe, expect, it } from 'vitest'
import {
  STREAM_PROFILE,
  getStreamDuration,
  getVisibleGraphemeCount,
  getVisibleGraphemePrefix,
  resolveNodeTiming,
  seededPaceFactor,
  segmentGraphemes,
} from './timing'

describe('deterministic stream timing', () => {
  it('selects the length band before applying the seeded factor and clamp', () => {
    expect(getStreamDuration('短消息'.repeat(10), 'short-seed')).toBeGreaterThanOrEqual(320)
    expect(getStreamDuration('中'.repeat(41), 'normal-seed')).toBeLessThanOrEqual(1800)
    expect(getStreamDuration('长'.repeat(81), 'long-seed')).toBeLessThanOrEqual(1800)
    expect(getStreamDuration('超'.repeat(400), 'capped')).toBe(1800)
  })

  it('uses a stable bounded pace factor instead of Math.random', () => {
    const first = seededPaceFactor('node:assistant:choice')
    const second = seededPaceFactor('node:assistant:choice')

    expect(first).toBe(second)
    expect(first).toBeGreaterThanOrEqual(STREAM_PROFILE.minimumPaceFactor)
    expect(first).toBeLessThanOrEqual(STREAM_PROFILE.maximumPaceFactor)
  })

  it('segments complete grapheme clusters when Intl.Segmenter is available', () => {
    const parts = segmentGraphemes('e\u0301👨‍👩‍👧‍👦🏳️‍🌈👍🏻')
    expect(parts).toEqual(['e\u0301', '👨‍👩‍👧‍👦', '🏳️‍🌈', '👍🏻'])
  })

  it('derives cumulative visible graphemes from elapsed time without assuming one per frame', () => {
    expect(getVisibleGraphemeCount(0, 1000, 50)).toBe(0)
    expect(getVisibleGraphemeCount(500, 1000, 50)).toBe(25)
    expect(getVisibleGraphemeCount(1200, 1000, 50)).toBe(50)
  })

  it('returns only a strict DOM prefix at 20, 50 and 80 percent', () => {
    const text = '这个问题没有唯一答案。'
    const duration = 1000

    expect(getVisibleGraphemePrefix(text, 200, duration)).toBe('这个')
    expect(getVisibleGraphemePrefix(text, 500, duration)).toBe('这个问题没')
    expect(getVisibleGraphemePrefix(text, 800, duration)).toBe('这个问题没有唯一')
    expect(getVisibleGraphemePrefix(text, 1000, duration)).toBe(text)
  })

  it('preserves English, emoji and newline prefixes without pre-rendering the suffix', () => {
    const text = 'Hi 👨‍👩‍👧‍👦\n下一行'
    const prefix = getVisibleGraphemePrefix(text, 500, 1000)

    expect(text.startsWith(prefix)).toBe(true)
    expect(prefix).not.toBe(text)
    expect(prefix).toBe('Hi 👨‍👩‍👧‍👦')
  })
})

describe('semantic timing resolver', () => {
  it('keeps every semantic response pace inside its approved range', () => {
    expect(resolveNodeTiming({ responsePace: 'quick', typingPattern: 'steady' }, 'quick')).toMatchObject({
      responseDelayMs: expect.any(Number),
      typingPattern: 'steady',
    })
    expect(resolveNodeTiming({ responsePace: 'quick', typingPattern: 'steady' }, 'quick').responseDelayMs)
      .toBeGreaterThanOrEqual(600)
    expect(resolveNodeTiming({ responsePace: 'quick', typingPattern: 'steady' }, 'quick').responseDelayMs)
      .toBeLessThanOrEqual(1200)
    expect(resolveNodeTiming({ responsePace: 'normal', typingPattern: 'steady' }, 'normal').responseDelayMs)
      .toBeGreaterThanOrEqual(1200)
    expect(resolveNodeTiming({ responsePace: 'normal', typingPattern: 'steady' }, 'normal').responseDelayMs)
      .toBeLessThanOrEqual(2200)
    expect(resolveNodeTiming({ responsePace: 'considered', typingPattern: 'steady' }, 'considered').responseDelayMs)
      .toBeGreaterThanOrEqual(1800)
    expect(resolveNodeTiming({ responsePace: 'considered', typingPattern: 'steady' }, 'considered').responseDelayMs)
      .toBeLessThanOrEqual(3200)
    expect(resolveNodeTiming({ responsePace: 'hesitant', typingPattern: 'rewrite' }, 'hesitant').totalTypingMs)
      .toBeLessThanOrEqual(3500)
  })
})
