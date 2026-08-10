import type { HandoffProfile, NodeTimingIntent, ResponsePace, TypingPattern } from './types'

export interface StreamProfile {
  shortMaxGraphemes: number
  normalMaxGraphemes: number
  shortMessageMsPerGrapheme: number
  normalMessageMsPerGrapheme: number
  longMessageMsPerGrapheme: number
  minimumDurationMs: number
  maximumDurationMs: number
  completionSettleMs: number
  minimumPaceFactor: number
  maximumPaceFactor: number
}

export const STREAM_PROFILE = {
  shortMaxGraphemes: 40,
  normalMaxGraphemes: 80,
  shortMessageMsPerGrapheme: 22,
  normalMessageMsPerGrapheme: 18,
  longMessageMsPerGrapheme: 14,
  minimumDurationMs: 320,
  maximumDurationMs: 1800,
  completionSettleMs: 80,
  minimumPaceFactor: 0.92,
  maximumPaceFactor: 1.08,
} as const satisfies StreamProfile

const responseDelayBase: Record<ResponsePace, number> = {
  quick: 900,
  normal: 1700,
  considered: 2500,
  hesitant: 2000,
}

const handoffDuration: Record<HandoffProfile, number> = {
  quick: 1600,
  normal: 2100,
  sensitive: 2700,
  internal: 2400,
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value))
}

function hashSeed(seed: string) {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function seededPaceFactor(seed: string) {
  const ratio = hashSeed(seed) / 0xffffffff
  const range = STREAM_PROFILE.maximumPaceFactor - STREAM_PROFILE.minimumPaceFactor
  return STREAM_PROFILE.minimumPaceFactor + ratio * range
}

export function segmentGraphemes(text: string): string[] {
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'grapheme' })
    return [...segmenter.segment(text)].map((part) => part.segment)
  }
  // Minimum code-point-safe fallback. Full grapheme semantics require Intl.Segmenter.
  return Array.from(text)
}

export function getStreamDuration(text: string, seed: string) {
  const count = segmentGraphemes(text).length
  const msPerGrapheme = count <= STREAM_PROFILE.shortMaxGraphemes
    ? STREAM_PROFILE.shortMessageMsPerGrapheme
    : count <= STREAM_PROFILE.normalMaxGraphemes
      ? STREAM_PROFILE.normalMessageMsPerGrapheme
      : STREAM_PROFILE.longMessageMsPerGrapheme
  const rawDuration = count * msPerGrapheme * seededPaceFactor(seed)
  return Math.round(clamp(rawDuration, STREAM_PROFILE.minimumDurationMs, STREAM_PROFILE.maximumDurationMs))
}

export function getVisibleGraphemeCount(elapsedMs: number, durationMs: number, totalGraphemes: number) {
  if (totalGraphemes <= 0) return 0
  if (durationMs <= 0 || elapsedMs >= durationMs) return totalGraphemes
  if (elapsedMs <= 0) return 0
  return Math.min(totalGraphemes, Math.floor((elapsedMs / durationMs) * totalGraphemes))
}

export function getVisibleGraphemePrefix(text: string, elapsedMs: number, durationMs: number) {
  const graphemes = segmentGraphemes(text)
  const visibleCount = getVisibleGraphemeCount(elapsedMs, durationMs, graphemes.length)
  return graphemes.slice(0, visibleCount).join('')
}

export interface ResolvedNodeTiming {
  responseDelayMs: number
  totalTypingMs: number
  typingPattern: TypingPattern
}

export function resolveNodeTiming(intent: NodeTimingIntent, seed: string): ResolvedNodeTiming {
  const factor = seededPaceFactor(seed)
  const responseDelayMs = Math.round(responseDelayBase[intent.responsePace] * factor)
  return {
    responseDelayMs,
    totalTypingMs: intent.typingPattern === 'rewrite' ? 3200 : responseDelayMs,
    typingPattern: intent.typingPattern,
  }
}

export function resolveHandoffDuration(profile: HandoffProfile) {
  return handoffDuration[profile]
}
