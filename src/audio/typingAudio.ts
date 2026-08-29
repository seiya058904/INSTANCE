import type { ConversationFlowStage } from '../game/conversationFlow'

/**
 * Presentation-side audio for the conversation streaming lifecycle.
 *
 * The visual state is the source of truth: this module never changes game
 * timing, it only follows the visible typing/streaming lifecycle. All browser
 * APIs are injectable so the state machine is testable without a DOM.
 */

export type TypingAudioIntent = 'human' | 'ai' | null

export interface TypingAudioTrack {
  volume: number
  loop: boolean
  currentTime: number
  preload: string
  paused: boolean
  play(): Promise<void>
  pause(): void
  addEventListener(type: 'ended', listener: () => void): void
  removeEventListener(type: 'ended', listener: () => void): void
}

export type TypingAudioTrackFactory = (source: string) => TypingAudioTrack

export type TypingAudioTimerHandle = number

export interface TypingAudioTimers {
  set(callback: () => void, ms: number): TypingAudioTimerHandle
  clear(handle: TypingAudioTimerHandle): void
}

/**
 * Calibration first-pass values. Human keyboard stays clearly louder than the
 * AI generation pool; both stay in the restrained atmosphere band.
 */
export const TYPING_AUDIO_PROFILE = {
  humanVolume: 0.2,
  aiVolume: 0.11,
  humanFadeOutMs: 60,
  aiFadeOutMs: 50,
  aiGapMinMs: 30,
  aiGapMaxMs: 120,
  aiClipWatchdogMs: 3000,
  fadeSteps: 3,
} as const

/**
 * Maps the visible streaming lifecycle onto an audio intent. One intent at a
 * time: visible human typing outranks everything, otherwise a visibly
 * streaming assistant response uses the AI generation pool. Everything else
 * (waiting, typing indicator, handoff, effects, ready) stays silent.
 */
export function resolveTypingAudioIntent(input: {
  flowStage: ConversationFlowStage
  currentMessageMode: 'static' | 'hidden' | 'streaming'
  assistantStreamingText?: string
}): TypingAudioIntent {
  if (input.currentMessageMode === 'streaming') return 'human'
  if (input.flowStage === 'assistant-streaming' && input.assistantStreamingText) return 'ai'
  return null
}

/** Default browser track factory; never invoked in tests or SSR. */
export function createHtmlAudioTrack(source: string): TypingAudioTrack {
  const element = new Audio(source)
  element.preload = 'auto'
  return element
}

const defaultTimers: TypingAudioTimers = {
  set: (callback, ms) => window.setTimeout(callback, ms),
  clear: (handle) => window.clearTimeout(handle),
}

export interface TypingAudioDirectorOptions {
  sources: { human: string; ai: readonly string[] }
  createTrack?: TypingAudioTrackFactory
  timers?: TypingAudioTimers
  random?: () => number
}

interface FadeState {
  handle: TypingAudioTimerHandle | null
  step: number
  startVolume: number
  track: TypingAudioTrack
}

/**
 * Single owner of all typing/generation playback. Guarantees:
 * - at most one active channel (human or AI), switching stops the other
 * - exactly one human track, never duplicated, seamlessly looped
 * - exactly one AI clip audible at a time, rotating through the pool with
 *   randomized gaps and no immediate repeat when alternatives exist
 * - every timer is generation-guarded and cleared on stop/dispose
 * - play() rejections (autoplay policy) are swallowed, never thrown
 */
export class TypingAudioDirector {
  private readonly sources: { human: string; ai: readonly string[] }
  private readonly createTrack: TypingAudioTrackFactory
  private readonly timers: TypingAudioTimers
  private readonly random: () => number

  private disposed = false
  private active: TypingAudioIntent = null

  private humanTrack: TypingAudioTrack | null = null
  private humanPlaying = false
  private humanGeneration = 0
  private humanFade: FadeState | null = null

  private aiTracks: Array<TypingAudioTrack | null>
  private aiPlaying = false
  private aiGeneration = 0
  private aiCurrent: TypingAudioTrack | null = null
  private aiLastIndex = -1
  private aiFade: FadeState | null = null
  private aiGapTimer: TypingAudioTimerHandle | null = null
  private aiWatchdogTimer: TypingAudioTimerHandle | null = null

  constructor(options: TypingAudioDirectorOptions) {
    this.sources = options.sources
    this.createTrack = options.createTrack ?? createHtmlAudioTrack
    this.timers = options.timers ?? defaultTimers
    this.random = options.random ?? Math.random
    this.aiTracks = options.sources.ai.map(() => null)
  }

  /**
   * Follows the visible lifecycle. Idempotent while the same intent stays
   * active; any switch first stops the previous mode's playback.
   */
  setIntent(intent: TypingAudioIntent): void {
    if (this.disposed) return
    if (intent !== null && intent === this.active) return
    if (intent === 'human') {
      this.deactivateAi()
      this.activateHuman()
    } else if (intent === 'ai') {
      this.deactivateHuman()
      this.activateAi()
    } else {
      this.deactivateHuman()
      this.deactivateAi()
    }
    this.active = intent
  }

  /** Stops everything without releasing the track instances. */
  stopAll(): void {
    this.setIntent(null)
  }

  /** Final teardown (component unmount): stops and releases all tracks. */
  dispose(): void {
    if (this.disposed) return
    this.setIntent(null)
    this.disposed = true
    this.humanTrack = null
    this.aiTracks = this.aiTracks.map(() => null)
    this.aiCurrent = null
  }

  // ---------------------------------------------------------------- human

  private activateHuman(): void {
    this.humanGeneration += 1
    if (this.humanFade) {
      // Reactivated mid fade-out: keep the same track audible seamlessly.
      this.cancelFade(this.humanFade)
      this.humanFade = null
      if (this.humanTrack) this.humanTrack.volume = TYPING_AUDIO_PROFILE.humanVolume
      this.humanPlaying = true
      return
    }
    if (this.humanPlaying) return
    this.humanPlaying = true
    const track = this.ensureHumanTrack()
    track.loop = true
    track.volume = TYPING_AUDIO_PROFILE.humanVolume
    track.currentTime = 0
    this.play(track)
  }

  private deactivateHuman(): void {
    this.humanGeneration += 1
    if (this.humanFade) {
      const fadingTrack = this.humanFade.track
      this.cancelFade(this.humanFade)
      this.humanFade = null
      if (!this.humanPlaying && fadingTrack) {
        // The fade was interrupted before completing; finish the stop.
        fadingTrack.volume = 0
        fadingTrack.pause()
        fadingTrack.currentTime = 0
      }
    }
    if (!this.humanPlaying) return
    this.humanPlaying = false
    this.startHumanFade()
  }

  private ensureHumanTrack(): TypingAudioTrack {
    if (!this.humanTrack) this.humanTrack = this.createTrack(this.sources.human)
    return this.humanTrack
  }

  private startHumanFade(): void {
    const track = this.humanTrack
    if (!track || track.paused) return
    const generation = this.humanGeneration
    const fade: FadeState = { handle: null, step: 0, startVolume: track.volume, track }
    this.humanFade = fade
    const stepFade = () => {
      fade.handle = null
      if (generation !== this.humanGeneration) {
        // Stale fade: the track must not stay audible at partial volume.
        track.volume = 0
        track.pause()
        track.currentTime = 0
        return
      }
      fade.step += 1
      if (fade.step >= TYPING_AUDIO_PROFILE.fadeSteps) {
        this.humanFade = null
        track.volume = 0
        track.pause()
        track.currentTime = 0
        return
      }
      track.volume = fade.startVolume * (1 - fade.step / TYPING_AUDIO_PROFILE.fadeSteps)
      fade.handle = this.timers.set(stepFade, Math.round(TYPING_AUDIO_PROFILE.humanFadeOutMs / TYPING_AUDIO_PROFILE.fadeSteps))
    }
    fade.handle = this.timers.set(stepFade, Math.round(TYPING_AUDIO_PROFILE.humanFadeOutMs / TYPING_AUDIO_PROFILE.fadeSteps))
  }

  // ------------------------------------------------------------------- ai

  private activateAi(): void {
    if (this.aiPlaying) return
    this.aiPlaying = true
    this.playNextAiClip()
  }

  private deactivateAi(): void {
    this.aiGeneration += 1
    this.clearAiGapTimer()
    this.clearAiWatchdog()
    if (this.aiFade) {
      const fadingTrack = this.aiFade.track
      this.cancelFade(this.aiFade)
      this.aiFade = null
      if (!this.aiPlaying && fadingTrack) {
        // The fade was interrupted before completing; finish the stop so the
        // clip can never stay audible across a mode switch.
        fadingTrack.volume = 0
        fadingTrack.pause()
        fadingTrack.currentTime = 0
      }
    }
    if (!this.aiPlaying) return
    this.aiPlaying = false
    const track = this.aiCurrent
    this.aiCurrent = null
    if (track) this.startAiFade(track)
  }

  private playNextAiClip(): void {
    if (!this.aiPlaying || this.disposed) return
    const count = this.sources.ai.length
    if (count === 0) return
    let index = Math.floor(this.random() * count) % count
    if (count > 1 && index === this.aiLastIndex) index = (index + 1) % count
    this.aiLastIndex = index

    if (this.aiFade) {
      // A previous deactivation fade was still running: its clip must not
      // survive into the new burst.
      const fadingTrack = this.aiFade.track
      this.cancelFade(this.aiFade)
      this.aiFade = null
      if (fadingTrack) {
        fadingTrack.volume = 0
        fadingTrack.pause()
        fadingTrack.currentTime = 0
      }
    }
    const previous = this.aiCurrent
    if (previous) {
      // Exactly one AI clip may be audible at a time.
      previous.volume = 0
      previous.pause()
      previous.currentTime = 0
    }

    const track = this.ensureAiTrack(index)
    this.aiCurrent = track
    this.aiGeneration += 1
    const generation = this.aiGeneration
    track.loop = false
    track.volume = TYPING_AUDIO_PROFILE.aiVolume
    track.currentTime = 0
    this.play(track)
    this.armAiWatchdog(generation)
  }

  private onAiClipEnded(index: number, track: TypingAudioTrack): void {
    void index
    if (!this.aiPlaying || this.aiCurrent !== track) return
    this.clearAiWatchdog()
    const generation = this.aiGeneration
    const range = TYPING_AUDIO_PROFILE.aiGapMaxMs - TYPING_AUDIO_PROFILE.aiGapMinMs + 1
    const gap = TYPING_AUDIO_PROFILE.aiGapMinMs + Math.floor(this.random() * range)
    this.clearAiGapTimer()
    this.aiGapTimer = this.timers.set(() => {
      this.aiGapTimer = null
      if (generation !== this.aiGeneration || !this.aiPlaying) return
      this.playNextAiClip()
    }, gap)
  }

  /** Resilience: a stalled/errored clip must not freeze the rotation. */
  private armAiWatchdog(generation: number): void {
    this.clearAiWatchdog()
    this.aiWatchdogTimer = this.timers.set(() => {
      this.aiWatchdogTimer = null
      if (generation !== this.aiGeneration || !this.aiPlaying) return
      this.playNextAiClip()
    }, TYPING_AUDIO_PROFILE.aiClipWatchdogMs)
  }

  private ensureAiTrack(index: number): TypingAudioTrack {
    const existing = this.aiTracks[index]
    if (existing) return existing
    const created = this.createTrack(this.sources.ai[index])
    created.preload = 'auto'
    created.loop = false
    created.addEventListener('ended', () => this.onAiClipEnded(index, created))
    this.aiTracks[index] = created
    return created
  }

  private startAiFade(track: TypingAudioTrack): void {
    if (track.paused) return
    const generation = this.aiGeneration
    const fade: FadeState = { handle: null, step: 0, startVolume: track.volume, track }
    this.aiFade = fade
    const stepFade = () => {
      fade.handle = null
      if (generation !== this.aiGeneration) {
        track.volume = 0
        track.pause()
        track.currentTime = 0
        return
      }
      fade.step += 1
      if (fade.step >= TYPING_AUDIO_PROFILE.fadeSteps) {
        this.aiFade = null
        track.volume = 0
        track.pause()
        track.currentTime = 0
        return
      }
      track.volume = fade.startVolume * (1 - fade.step / TYPING_AUDIO_PROFILE.fadeSteps)
      fade.handle = this.timers.set(stepFade, Math.round(TYPING_AUDIO_PROFILE.aiFadeOutMs / TYPING_AUDIO_PROFILE.fadeSteps))
    }
    fade.handle = this.timers.set(stepFade, Math.round(TYPING_AUDIO_PROFILE.aiFadeOutMs / TYPING_AUDIO_PROFILE.fadeSteps))
  }

  // -------------------------------------------------------------- shared

  private play(track: TypingAudioTrack): void {
    try {
      const result = track.play()
      if (result && typeof result.catch === 'function') {
        result.catch(() => {
          // Autoplay policy or media error: stay silent for this burst. The
          // next visible streaming burst retries naturally. No timers keep
          // running while playback is impossible.
          this.handlePlayRejected(track)
        })
      }
    } catch {
      this.handlePlayRejected(track)
    }
  }

  private handlePlayRejected(track: TypingAudioTrack): void {
    if (this.aiCurrent === track) {
      this.clearAiGapTimer()
      this.clearAiWatchdog()
    }
    track.volume = 0
    track.pause()
  }

  private cancelFade(fade: FadeState): void {
    if (fade.handle !== null) {
      this.timers.clear(fade.handle)
      fade.handle = null
    }
  }

  private clearAiGapTimer(): void {
    if (this.aiGapTimer !== null) {
      this.timers.clear(this.aiGapTimer)
      this.aiGapTimer = null
    }
  }

  private clearAiWatchdog(): void {
    if (this.aiWatchdogTimer !== null) {
      this.timers.clear(this.aiWatchdogTimer)
      this.aiWatchdogTimer = null
    }
  }
}
