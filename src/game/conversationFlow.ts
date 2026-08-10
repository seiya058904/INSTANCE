import { getStreamDuration, resolveHandoffDuration, resolveNodeTiming } from './timing'
import type { EffectCue, HandoffProfile, NodeTimingIntent } from './types'

export type ConversationFlowStage =
  | 'assistant-streaming'
  | 'human-waiting'
  | 'human-typing'
  | 'human-rewriting'
  | 'human-streaming'
  | 'conversation-closing'
  | 'assigning'
  | 'connecting'
  | 'effect'
  | 'ready'

export interface ConversationFlowStep {
  stage: ConversationFlowStage
  durationMs: number
  effectDetail?: 'model-flash' | 'syncing' | 'connecting' | 'permission' | 'identity'
}

export interface ConversationTimelineInput {
  assistantText: string
  assistantSeed: string
  humanText: string
  humanMessages?: readonly string[]
  humanSeed: string
  sameConversation: boolean
  timing: NodeTimingIntent
  handoffProfile: HandoffProfile
  effect?: EffectCue
  instant?: boolean
}

function splitBudget(total: number, portions: readonly number[]) {
  const values = portions.map((portion) => Math.floor(total * portion))
  values[values.length - 1] += total - values.reduce((sum, value) => sum + value, 0)
  return values
}

export function buildConversationTimeline(input: ConversationTimelineInput): ConversationFlowStep[] {
  if (input.instant) return [{ stage: 'ready', durationMs: 0 }]

  const steps: ConversationFlowStep[] = [{
    stage: 'assistant-streaming',
    durationMs: getStreamDuration(input.assistantText, input.assistantSeed),
  }]

  if (input.sameConversation) {
    const resolved = resolveNodeTiming(input.timing, input.humanSeed)
    if (input.timing.typingPattern === 'rewrite') {
      const [waiting, firstTyping, rewritePause, secondTyping] = splitBudget(resolved.totalTypingMs, [0.2, 0.3, 0.12, 0.38])
      steps.push(
        { stage: 'human-waiting', durationMs: waiting },
        { stage: 'human-typing', durationMs: firstTyping },
        { stage: 'human-rewriting', durationMs: rewritePause },
        { stage: 'human-typing', durationMs: secondTyping },
      )
    } else {
      const [waiting, typing] = splitBudget(resolved.responseDelayMs, [0.38, 0.62])
      steps.push(
        { stage: 'human-waiting', durationMs: waiting },
        { stage: 'human-typing', durationMs: typing },
      )
    }
  } else {
    const handoff = resolveHandoffDuration(input.handoffProfile)
    const [closing, assigning, connecting, typing] = splitBudget(handoff, [0.22, 0.28, 0.24, 0.26])
    steps.push(
      { stage: 'conversation-closing', durationMs: closing },
      { stage: 'assigning', durationMs: assigning },
      { stage: 'connecting', durationMs: connecting },
      { stage: 'human-typing', durationMs: typing },
    )
  }

  if (input.effect === 'level-1-model-flash') {
    steps.push({ stage: 'effect', durationMs: 440, effectDetail: 'model-flash' })
  } else if (input.effect === 'level-2-memory-sync') {
    steps.push(
      { stage: 'effect', durationMs: 420, effectDetail: 'syncing' },
      { stage: 'effect', durationMs: 340, effectDetail: 'connecting' },
      { stage: 'effect', durationMs: 220, effectDetail: 'permission' },
    )
  }
  const humanMessages = input.humanMessages ?? [input.humanText]
  const humanStreamDuration = humanMessages.reduce((sum, message, index) => (
    sum + getStreamDuration(message, `${input.humanSeed}:${index}`)
  ), 0)
  steps.push({ stage: 'human-streaming', durationMs: humanStreamDuration })
  if (input.effect === 'identity-reveal') {
    steps.push({ stage: 'effect', durationMs: 520, effectDetail: 'identity' })
  }
  steps.push({ stage: 'ready', durationMs: 0 })
  return steps
}

export interface TimelineMetrics {
  humanWaitMs: number
  streamingMs: number
  handoffMs: number
  effectMs: number
}

export function summarizeTimeline(timeline: readonly ConversationFlowStep[]): TimelineMetrics {
  const hasHandoff = timeline.some((step) => step.stage === 'assigning')
  const metrics: TimelineMetrics = { humanWaitMs: 0, streamingMs: 0, handoffMs: 0, effectMs: 0 }
  for (const step of timeline) {
    if (step.stage === 'assistant-streaming' || step.stage === 'human-streaming') {
      metrics.streamingMs += step.durationMs
    } else if (step.stage === 'effect') {
      metrics.effectMs += step.durationMs
    } else if (step.stage === 'conversation-closing' || step.stage === 'assigning' || step.stage === 'connecting') {
      metrics.handoffMs += step.durationMs
    } else if (step.stage === 'human-typing' && hasHandoff) {
      metrics.handoffMs += step.durationMs
    } else if (step.stage === 'human-waiting' || step.stage === 'human-typing' || step.stage === 'human-rewriting') {
      metrics.humanWaitMs += step.durationMs
    }
  }
  return metrics
}
