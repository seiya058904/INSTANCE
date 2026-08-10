import { getManifestConversation } from '../content/runManifest'
import { buildConversationTimeline, summarizeTimeline } from './conversationFlow'
import { buildEnding, commitChoice, createRun, resolveScene } from './engine'
import { getStreamDuration, segmentGraphemes } from './timing'
import type { EndingRoute } from './types'

export interface RoutePacingAudit {
  route: EndingRoute
  conversations: number
  choices: number
  visibleGraphemes: number
  streamingMs: number
  humanWaitMs: number
  handoffMs: number
  effectMs: number
  structuralMs: number
  normalReadingEstimateMs: number
  fastReadingEstimateMs: number
}

const routeChoiceId: Record<EndingRoute, string> = {
  protect: 'audit-protect-maya',
  report: 'audit-report-maya',
  hide: 'audit-hide-maya',
  comply: 'audit-comply',
}

// These are comparison-reading rates, not plain prose skim rates: each node asks
// the player to weigh several semantically close replies before committing.
const NORMAL_COMPARISON_GRAPHEMES_PER_MINUTE = 470
// A deliberate fast-read audit skims familiar candidate structures at roughly
// 14 graphemes/second; it is kept separate from the normal first-pass model.
const FAST_COMPARISON_GRAPHEMES_PER_MINUTE = 850

const graphemeCount = (text: string) => segmentGraphemes(text).length

export function auditRoutePacing(route: EndingRoute): RoutePacingAudit {
  let run = createRun('pacing-shared-manifest')
  const conversations = new Set<string>()
  let choices = 0
  let visibleGraphemes = 0
  let streamingMs = 0
  let humanWaitMs = 0
  let handoffMs = 0
  let effectMs = 0

  const firstScene = resolveScene(run)
  for (const message of firstScene.userMessages ?? [firstScene.userMessage]) {
    streamingMs += getStreamDuration(message, `${firstScene.id}:initial`)
  }

  while (run.phase === 'playing') {
    const scene = resolveScene(run)
    conversations.add(scene.conversationId)
    visibleGraphemes += (scene.userMessages ?? [scene.userMessage]).reduce((sum, text) => sum + graphemeCount(text), 0)
    visibleGraphemes += scene.choices.reduce((sum, choice) => sum + graphemeCount(choice.text), 0)

    const choice = scene.choices.find((candidate) => candidate.id === routeChoiceId[route]) ?? scene.choices[0]
    const next = commitChoice(run, choice.id)
    choices += 1

    if (next.phase === 'playing') {
      const target = resolveScene(next)
      const timeline = buildConversationTimeline({
        assistantText: choice.text,
        assistantSeed: `${scene.id}:assistant:${choice.id}`,
        humanText: target.userMessage,
        humanMessages: target.userMessages,
        humanSeed: `${target.id}:user`,
        sameConversation: target.conversationId === scene.conversationId,
        timing: target.timing ?? { responsePace: 'normal', typingPattern: 'steady' },
        handoffProfile: getManifestConversation(target.conversationId)?.handoffProfile ?? 'normal',
        effect: target.effect,
      })
      const metrics = summarizeTimeline(timeline)
      streamingMs += metrics.streamingMs
      humanWaitMs += metrics.humanWaitMs
      handoffMs += metrics.handoffMs
      effectMs += metrics.effectMs
    } else {
      streamingMs += getStreamDuration(choice.text, `${scene.id}:assistant:${choice.id}`)
      const ending = buildEnding(next)
      streamingMs += getStreamDuration(ending.humanLine, `ending:${route}:human`)
      streamingMs += getStreamDuration(ending.assistantLine, `ending:${route}:assistant`)
      visibleGraphemes += graphemeCount(ending.summary) + graphemeCount(ending.humanLine) + graphemeCount(ending.assistantLine)
    }

    run = next
  }

  const structuralMs = streamingMs + humanWaitMs + handoffMs + effectMs
  const readingEstimate = (graphemesPerMinute: number) => structuralMs + visibleGraphemes / graphemesPerMinute * 60_000

  return {
    route,
    conversations: conversations.size,
    choices,
    visibleGraphemes,
    streamingMs,
    humanWaitMs,
    handoffMs,
    effectMs,
    structuralMs,
    normalReadingEstimateMs: readingEstimate(NORMAL_COMPARISON_GRAPHEMES_PER_MINUTE),
    fastReadingEstimateMs: readingEstimate(FAST_COMPARISON_GRAPHEMES_PER_MINUTE),
  }
}
