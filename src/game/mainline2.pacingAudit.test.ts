import { describe, expect, it } from 'vitest'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { segmentGraphemes } from './timing'
import { ordinaryConversationPool } from '../content/runManifest'
import type { StableRunState } from './types'

// Count-only route pacing audit for the production Mainline 2.0 calendar
// (createMainline2Run). Unlike the legacy v2 audit it never waits on
// animation timing: it walks the real scene graph for both Contact branches,
// counts what the player actually reads, and reports comparison-reading
// estimates so CI can say how long a full run is.
const NORMAL_COMPARISON_GRAPHEMES_PER_MINUTE = 470
const FAST_COMPARISON_GRAPHEMES_PER_MINUTE = 850

interface Mainline2RoutePacingAudit {
  branch: 'contact-closed' | 'contact-open'
  conversations: number
  choices: number
  visibleGraphemes: number
  normalReadingEstimateMs: number
  fastReadingEstimateMs: number
  maxConsecutiveOrdinary: number
}

const graphemeCount = (text: string) => segmentGraphemes(text).length

function auditMainline2Branch(branch: 'contact-closed' | 'contact-open', runId: string): Mainline2RoutePacingAudit {
  const base = createMainline2Run(runId)
  let run: StableRunState = branch === 'contact-open'
    ? { ...base, flags: [...base.flags, 'cap.space_resource_network'], events: [{ type: 'contact-seed:deep-space-anomaly' }] }
    : base
  let choices = 0
  let visibleGraphemes = 0
  let guard = 0
  // Both Contact doctrines are decided before slot 148, so pinning them per
  // branch keeps the whole walk on one calendar (mirrors contactPolicy tests).
  const preferred = branch === 'contact-open'
    ? ['frontier_science', 'interstellar_commitment']
    : ['life_mind', 'shared_expansion']
  while (run.phase === 'playing' && guard < 600) {
    const scene = resolveScene(run)
    visibleGraphemes += (scene.userMessages ?? [scene.userMessage]).reduce((sum, text) => sum + graphemeCount(text), 0)
    visibleGraphemes += scene.choices.reduce((sum, choice) => sum + graphemeCount(choice.text), 0)
    const choice = scene.choices.find((candidate) => preferred.some((value) => candidate.id.includes(value)))
      ?? scene.choices[guard % Math.max(1, scene.choices.length)]
    if (!choice) throw new Error(`No legal choice at ${scene.id}`)
    choices += 1
    run = commitChoice(run, choice.id)
    guard += 1
  }
  if (run.phase !== 'ending') throw new Error(`${branch} route did not reach an ending`)
  const ordinaryIds = new Set(ordinaryConversationPool.map((conversation) => conversation.id))
  let maxConsecutiveOrdinary = 0
  let current = 0
  for (const id of run.manifest.conversationIds) {
    current = ordinaryIds.has(id) ? current + 1 : 0
    maxConsecutiveOrdinary = Math.max(maxConsecutiveOrdinary, current)
  }
  const conversations = run.manifest.conversationIds.length
  return {
    branch,
    conversations,
    choices,
    visibleGraphemes,
    normalReadingEstimateMs: Math.round((visibleGraphemes / NORMAL_COMPARISON_GRAPHEMES_PER_MINUTE) * 60_000),
    fastReadingEstimateMs: Math.round((visibleGraphemes / FAST_COMPARISON_GRAPHEMES_PER_MINUTE) * 60_000),
    maxConsecutiveOrdinary,
  }
}

describe('Mainline 2.0 route pacing audit', () => {
  it('contact-closed branch compresses the gated chapter and stays inside pacing bounds', () => {
    const result = auditMainline2Branch('contact-closed', 'pacing-closed')
    expect(result.conversations).toBe(180)
    expect(result.maxConsecutiveOrdinary).toBeLessThanOrEqual(6)
    // Measured budget (±10%): the comparison-reading estimate for the whole
    // closed calendar. Content changes that swing pacing beyond this fail CI.
    expect(result.normalReadingEstimateMs).toBeGreaterThanOrEqual(105 * 60_000)
    expect(result.normalReadingEstimateMs).toBeLessThanOrEqual(130 * 60_000)
    expect(result.fastReadingEstimateMs).toBeGreaterThanOrEqual(58 * 60_000)
    expect(result.fastReadingEstimateMs).toBeLessThanOrEqual(72 * 60_000)
    console.info('INSTANCE_MAINLINE2_PACING_AUDIT', JSON.stringify(result))
  }, 120000)

  it('contact-open branch keeps the full calendar and stays inside pacing bounds', () => {
    const result = auditMainline2Branch('contact-open', 'pacing-open')
    expect(result.conversations).toBe(190)
    expect(result.maxConsecutiveOrdinary).toBeLessThanOrEqual(6)
    expect(result.normalReadingEstimateMs).toBeGreaterThanOrEqual(109 * 60_000)
    expect(result.normalReadingEstimateMs).toBeLessThanOrEqual(134 * 60_000)
    expect(result.fastReadingEstimateMs).toBeGreaterThanOrEqual(60 * 60_000)
    expect(result.fastReadingEstimateMs).toBeLessThanOrEqual(74 * 60_000)
    console.info('INSTANCE_MAINLINE2_PACING_AUDIT', JSON.stringify(result))
  }, 120000)
})
