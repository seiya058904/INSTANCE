import { describe, expect, it } from 'vitest'
import {
  TYPING_AUDIO_PROFILE,
  TypingAudioDirector,
  resolveTypingAudioIntent,
  type TypingAudioTimers,
  type TypingAudioTrack,
} from './typingAudio'

class FakeTrack implements TypingAudioTrack {
  volume = 1
  loop = false
  currentTime = 0
  preload = ''
  paused = true
  playCount = 0
  pauseCount = 0
  private listeners: Array<() => void> = []
  constructor(readonly source: string, private playResult: Promise<void> = Promise.resolve()) {}
  failPlay(): void {
    this.playResult = Promise.reject(new Error('NotAllowedError: play() blocked'))
  }
  play(): Promise<void> {
    this.playCount += 1
    this.paused = false
    return this.playResult
  }
  pause(): void {
    this.pauseCount += 1
    this.paused = true
  }
  addEventListener(_type: 'ended', listener: () => void): void {
    this.listeners.push(listener)
  }
  removeEventListener(_type: 'ended', listener: () => void): void {
    this.listeners = this.listeners.filter((candidate) => candidate !== listener)
  }
  dispatchEnded(): void {
    for (const listener of [...this.listeners]) listener()
  }
}

function createHarness(sources = { human: 'human-typing.mp3', ai: ['ai-0', 'ai-1', 'ai-2', 'ai-3', 'ai-4'] }) {
  const tracks: FakeTrack[] = []
  const pending: Array<{ id: number; at: number; callback: () => void; cancelled: boolean }> = []
  const failSources = new Set<string>()
  let now = 0
  let nextId = 1
  const timers: TypingAudioTimers = {
    set: (callback, ms) => {
      const id = nextId
      nextId += 1
      pending.push({ id, at: now + ms, callback, cancelled: false })
      return id
    },
    clear: (handle) => {
      const timer = pending.find((candidate) => candidate.id === handle)
      if (timer) timer.cancelled = true
    },
  }
  const advance = (ms: number) => {
    const target = now + ms
    for (;;) {
      const runnable = pending
        .filter((candidate) => !candidate.cancelled && candidate.at <= target + 1e-9)
        .sort((left, right) => left.at - right.at)[0]
      if (!runnable) break
      now = Math.max(now, runnable.at)
      runnable.cancelled = true
      runnable.callback()
    }
    now = target
  }
  const randomValues: number[] = []
  let randomCursor = 0
  const director = new TypingAudioDirector({
    sources,
    createTrack: (source) => {
      const track = new FakeTrack(source)
      if (failSources.has(source)) track.failPlay()
      tracks.push(track)
      return track
    },
    timers,
    random: () => {
      const value = randomValues.length ? randomValues[randomCursor % randomValues.length] : 0.25
      randomCursor += 1
      return value
    },
  })
  const pendingCount = () => pending.filter((candidate) => !candidate.cancelled).length
  const bySource = (source: string) => tracks.filter((candidate) => candidate.source === source)
  const flushRejection = () => new Promise<void>((resolve) => { setTimeout(resolve, 0) })
  return {
    director,
    tracks,
    advance,
    pendingCount,
    bySource,
    randomValues,
    failSource: (source: string) => failSources.add(source),
    flushRejection,
  }
}

describe('typing audio intent mapping', () => {
  it('follows the visible lifecycle only', () => {
    expect(resolveTypingAudioIntent({ flowStage: 'human-streaming', currentMessageMode: 'streaming' })).toBe('human')
    expect(resolveTypingAudioIntent({ flowStage: 'assistant-streaming', currentMessageMode: 'static', assistantStreamingText: '回复' })).toBe('ai')
    expect(resolveTypingAudioIntent({ flowStage: 'assistant-streaming', currentMessageMode: 'static' })).toBeNull()
    // Mirrors the ConversationView render condition: the assistant message
    // renders whenever the stage is assistant-streaming with text.
    expect(resolveTypingAudioIntent({ flowStage: 'assistant-streaming', currentMessageMode: 'static', assistantStreamingText: '回复' })).toBe('ai')
    expect(resolveTypingAudioIntent({ flowStage: 'human-waiting', currentMessageMode: 'hidden' })).toBeNull()
    expect(resolveTypingAudioIntent({ flowStage: 'human-typing', currentMessageMode: 'hidden' })).toBeNull()
    expect(resolveTypingAudioIntent({ flowStage: 'human-rewriting', currentMessageMode: 'hidden' })).toBeNull()
    expect(resolveTypingAudioIntent({ flowStage: 'conversation-closing', currentMessageMode: 'hidden' })).toBeNull()
    expect(resolveTypingAudioIntent({ flowStage: 'assigning', currentMessageMode: 'hidden' })).toBeNull()
    expect(resolveTypingAudioIntent({ flowStage: 'connecting', currentMessageMode: 'hidden' })).toBeNull()
    expect(resolveTypingAudioIntent({ flowStage: 'effect', currentMessageMode: 'hidden' })).toBeNull()
    expect(resolveTypingAudioIntent({ flowStage: 'ready', currentMessageMode: 'static' })).toBeNull()
  })

  it('keeps human clearly louder than the AI generation pool', () => {
    expect(TYPING_AUDIO_PROFILE.humanVolume).toBeGreaterThan(TYPING_AUDIO_PROFILE.aiVolume)
    expect(TYPING_AUDIO_PROFILE.humanVolume).toBeLessThanOrEqual(0.25)
    expect(TYPING_AUDIO_PROFILE.aiVolume).toBeGreaterThanOrEqual(0.08)
    expect(TYPING_AUDIO_PROFILE.aiGapMinMs).toBeGreaterThanOrEqual(30)
    expect(TYPING_AUDIO_PROFILE.aiGapMaxMs).toBeLessThanOrEqual(120)
  })
})

describe('typing audio human channel', () => {
  it('starts exactly one looping human track with calibrated volume', () => {
    const { director, bySource, pendingCount } = createHarness()
    director.setIntent('human')
    const human = bySource('human-typing.mp3')
    expect(human).toHaveLength(1)
    expect(human[0].playCount).toBe(1)
    expect(human[0].volume).toBe(TYPING_AUDIO_PROFILE.humanVolume)
    expect(human[0].loop).toBe(true)
    expect(pendingCount()).toBe(0)
    director.setIntent('human')
    expect(human[0].playCount).toBe(1)
  })

  it('stops with a short fade when visible typing stops', () => {
    const { director, bySource, advance } = createHarness()
    director.setIntent('human')
    const human = bySource('human-typing.mp3')[0]
    director.setIntent(null)
    advance(TYPING_AUDIO_PROFILE.humanFadeOutMs + 1)
    expect(human.paused).toBe(true)
    expect(human.volume).toBe(0)
    expect(human.currentTime).toBe(0)
  })

  it('reactivation mid fade-out continues the same track without replaying', () => {
    const { director, bySource, advance } = createHarness()
    director.setIntent('human')
    const human = bySource('human-typing.mp3')[0]
    director.setIntent(null)
    advance(TYPING_AUDIO_PROFILE.humanFadeOutMs / TYPING_AUDIO_PROFILE.fadeSteps)
    director.setIntent('human')
    advance(TYPING_AUDIO_PROFILE.humanFadeOutMs + 200)
    expect(human.playCount).toBe(1)
    expect(human.paused).toBe(false)
    expect(human.volume).toBe(TYPING_AUDIO_PROFILE.humanVolume)
  })

  it('loops safely for typing longer than the clip', () => {
    const { director, bySource, advance } = createHarness()
    director.setIntent('human')
    const human = bySource('human-typing.mp3')[0]
    advance(20000)
    expect(human.playCount).toBe(1)
    expect(human.paused).toBe(false)
  })
})

describe('typing audio ai channel', () => {
  it('plays exactly one clip when streaming starts', () => {
    const { director, tracks } = createHarness()
    director.setIntent('ai')
    const playing = tracks.filter((track) => track.playCount > 0)
    expect(playing).toHaveLength(1)
    expect(playing[0].volume).toBe(TYPING_AUDIO_PROFILE.aiVolume)
    expect(playing[0].loop).toBe(false)
  })

  it('rotates through the pool with randomized gaps and no immediate repeat', () => {
    const sources = ['ai-0', 'ai-1', 'ai-2', 'ai-3', 'ai-4']
    const { director, tracks, bySource, advance, randomValues } = createHarness({ human: 'human-typing.mp3', ai: sources })
    randomValues.push(0.5, 0.5, 0.7, 0.5, 0.1, 0.5, 0.9)
    director.setIntent('ai')
    const starting = tracks.filter((track) => track.playCount > 0)
    expect(starting).toHaveLength(1)
    let previous = starting[0]
    const sequence: string[] = [previous.source]
    for (let index = 0; index < 11; index += 1) {
      const before = new Map(tracks.map((track) => [track.source, track.playCount]))
      previous.dispatchEnded()
      advance(TYPING_AUDIO_PROFILE.aiGapMaxMs + 1)
      const started = tracks.filter((track) => (before.get(track.source) ?? 0) < track.playCount)
      expect(started).toHaveLength(1)
      const next = started[0]
      expect(next).not.toBe(previous)
      expect(previous.paused).toBe(true)
      expect(previous.volume).toBe(0)
      expect(next.volume).toBe(TYPING_AUDIO_PROFILE.aiVolume)
      sequence.push(next.source)
      previous = next
    }
    for (let index = 1; index < sequence.length; index += 1) {
      expect(sequence[index]).not.toBe(sequence[index - 1])
    }
    expect(new Set(sequence).size).toBeGreaterThan(2)
  })

  it('keeps gaps inside the 30-120ms band', () => {
    const { director, bySource, advance, pendingCount, randomValues } = createHarness({ human: 'human.mp3', ai: ['a', 'b'] })
    randomValues.push(0)
    director.setIntent('ai')
    expect(pendingCount()).toBe(1)
    bySource('a')[0].dispatchEnded()
    expect(pendingCount()).toBe(1)
    advance(TYPING_AUDIO_PROFILE.aiGapMinMs - 1)
    expect(bySource('b')).toHaveLength(0)
    advance(1)
    expect(bySource('b')).toHaveLength(1)
    expect(bySource('b')[0].playCount).toBe(1)
  })

  it('stops immediately when streaming ends and clears all timers', () => {
    const { director, tracks, bySource, advance, pendingCount } = createHarness({ human: 'human.mp3', ai: ['a', 'b'] })
    director.setIntent('ai')
    const clip = bySource('a')[0]
    director.setIntent(null)
    advance(TYPING_AUDIO_PROFILE.aiFadeOutMs + 51)
    expect(clip.paused).toBe(true)
    expect(pendingCount()).toBe(0)
    director.setIntent('ai')
    const current = tracks.find((track) => !track.paused && track.playCount > 0)
    if (!current) throw new Error('no audible clip after restarting the AI channel')
    current.dispatchEnded()
    director.setIntent(null)
    advance(TYPING_AUDIO_PROFILE.aiGapMaxMs + 200)
    expect(tracks.every((track) => track.paused)).toBe(true)
    expect(pendingCount()).toBe(0)
  })

  it('advances a stalled clip via the watchdog without stacking', () => {
    const { director, bySource, advance, pendingCount } = createHarness({ human: 'human.mp3', ai: ['a', 'b'] })
    director.setIntent('ai')
    advance(TYPING_AUDIO_PROFILE.aiClipWatchdogMs)
    expect(bySource('b')[0].playCount).toBe(1)
    expect(pendingCount()).toBe(1)
  })
})

describe('typing audio lifecycle safety', () => {
  it('mode switching stops the previous mode and never duplicates the human track', () => {
    const { director, bySource, advance } = createHarness()
    director.setIntent('human')
    director.setIntent('ai')
    advance(TYPING_AUDIO_PROFILE.humanFadeOutMs + 1)
    expect(bySource('human-typing.mp3')[0].paused).toBe(true)
    expect(bySource('ai-1')[0].playCount).toBe(1)
    director.setIntent('human')
    advance(TYPING_AUDIO_PROFILE.aiFadeOutMs + 1)
    expect(bySource('ai-1')[0].paused).toBe(true)
    expect(bySource('human-typing.mp3')[0].playCount).toBe(2)
    expect(bySource('human-typing.mp3')).toHaveLength(1)
  })

  it('rapid state changes never stack playback', () => {
    const { director, tracks, advance, pendingCount } = createHarness()
    director.setIntent('ai')
    director.setIntent('human')
    director.setIntent('ai')
    director.setIntent(null)
    director.setIntent('ai')
    director.setIntent('human')
    director.setIntent(null)
    advance(TYPING_AUDIO_PROFILE.aiClipWatchdogMs + TYPING_AUDIO_PROFILE.aiGapMaxMs + 500)
    expect(tracks.filter((track) => track.source === 'human-typing.mp3')).toHaveLength(1)
    expect(tracks.filter((track) => track.source.startsWith('ai-')).length).toBeLessThanOrEqual(3)
    expect(tracks.every((track) => track.paused)).toBe(true)
    expect(pendingCount()).toBe(0)
  })

  it('dispose stops and releases everything; later intents are ignored', () => {
    const { director, tracks, advance, pendingCount } = createHarness()
    director.setIntent('ai')
    director.dispose()
    advance(TYPING_AUDIO_PROFILE.aiClipWatchdogMs + TYPING_AUDIO_PROFILE.aiGapMaxMs + 500)
    expect(tracks.every((track) => track.paused)).toBe(true)
    expect(pendingCount()).toBe(0)
    const playsBefore = tracks.reduce((sum, track) => sum + track.playCount, 0)
    director.setIntent('human')
    director.setIntent('ai')
    expect(tracks.reduce((sum, track) => sum + track.playCount, 0)).toBe(playsBefore)
  })

  it('swallows human autoplay rejections without unhandled rejections or runaway timers', async () => {
    const { director, bySource, advance, pendingCount, failSource } = createHarness({ human: 'human.mp3', ai: ['a', 'b'] })
    failSource('human.mp3')
    director.setIntent('human')
    const human = bySource('human.mp3')[0]
    await new Promise<void>((resolve) => { setTimeout(resolve, 0) })
    expect(human.playCount).toBe(1)
    expect(human.paused).toBe(true)
    director.setIntent(null)
    advance(1000)
    expect(pendingCount()).toBe(0)
    // A later visible burst retries playback (e.g. after the first user gesture).
    director.setIntent('human')
    expect(human.playCount).toBe(2)
  })

  it('halts the AI sequence while play is blocked, then retries on the next burst', async () => {
    const { director, bySource, advance, pendingCount, failSource, flushRejection, randomValues } = createHarness({ human: 'human.mp3', ai: ['a', 'b'] })
    randomValues.push(0.6)
    failSource('b')
    director.setIntent('ai')
    const blocked = bySource('b')[0]
    await flushRejection()
    expect(blocked.paused).toBe(true)
    advance(TYPING_AUDIO_PROFILE.aiClipWatchdogMs * 2)
    expect(bySource('a')).toHaveLength(0)
    expect(pendingCount()).toBe(0)
    director.setIntent(null)
    director.setIntent('ai')
    expect(bySource('a')[0].playCount).toBe(1)
  })
})
