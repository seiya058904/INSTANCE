import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { createMainline2Run, resolveScene, commitChoice, buildEvaluation } from './engine'
import { resolveMainline2Ending } from '../content/mainline2/endings'
import { localizeEndingForPlayer } from '../content/mainline2/endingPlayerFacingCopy'
import { ordinaryConversationPool } from '../content/runManifest'
import { selectNonMainlineConversations } from '../content/nonMainlineSelector'
import { createEmptyExposureHistory } from '../content/runManifest'
import { EndingScreen } from '../components/EndingScreen'
import type { StableRunState } from '../game/types'

function completeFullRun(runId: string): StableRunState {
  let run = createMainline2Run(runId)
  for (let guard = 0; guard < 600 && run.phase === 'playing'; guard += 1) {
    run = commitChoice(run, resolveScene(run).choices[0].id)
  }
  expect(run.phase).toBe('ending')
  return run
}

describe('Production final repair: ending key history honesty', () => {
  it('renders every required stage as a real player choice in a complete run', () => {
    const run = completeFullRun('repair-complete-run')
    const ending = resolveMainline2Ending(run)
    expect(ending.id).not.toBe('resolution-failure')
    for (const entry of ending.keyHistory ?? []) {
      const source = run.history.find((candidate) => candidate.conversationTitle === entry.label)
      expect(source).toBeDefined()
      expect(entry.detail).toBe(`选择：${source?.assistantText}`)
    }
  })

  it('omits stages whose causal producer never played instead of fabricating them', () => {
    const run = completeFullRun('repair-missing-anchor')
    const recognitionAt = run.history.findIndex((entry) => entry.assistantText.startsWith('我认得你'))
    expect(recognitionAt).toBeGreaterThanOrEqual(0)
    // Simulate a run whose saved history lost the ACT I recognition producer:
    // the ending must render with the remaining stages, must not fabricate the
    // missing one, and must not degrade into a failure ending.
    const partial: StableRunState = {
      ...run,
      history: run.history.filter((entry) => entry.conversationId !== 'user-1842-return'),
    }
    const ending = resolveMainline2Ending(partial)
    expect(ending.id).not.toBe('resolution-failure')
    const labels = (ending.keyHistory ?? []).map((entry) => entry.label)
    expect(labels).not.toContain('岑遥 · #1842')
    expect((ending.keyHistory ?? []).length).toBeGreaterThanOrEqual(5)
    for (const entry of ending.keyHistory ?? []) {
      expect(partial.history.some((candidate) => candidate.conversationTitle === entry.label)).toBe(true)
    }
  })

  it('never leaks internal slot ids or engine jargon into ending copy', () => {
    const run = completeFullRun('repair-leak-scan')
    const ending = resolveMainline2Ending(run)
    const localized = localizeEndingForPlayer(ending)
    const flat = JSON.stringify([localized.summary, localized.keyHistory ?? [], localized.epilogues ?? []])
    for (const banned of ['M15', 'M16', '硬门', '首次公开处决主义']) {
      expect(flat).not.toContain(banned)
    }
    expect(flat).not.toContain('最终 承诺')
  })
})

describe('Production final repair: cross-mode ordinary dedup', () => {
  it('never schedules an ordinary conversation consumed by a Non-Mainline session', () => {
    const consumed = ordinaryConversationPool.slice(0, 40).map((conversation) => conversation.id)
    let run = createMainline2Run('repair-dedup-run')
    run = { ...run, nonMainlineConsumedOrdinaryIds: consumed }
    for (let guard = 0; guard < 600 && run.phase === 'playing'; guard += 1) {
      run = commitChoice(run, resolveScene(run).choices[0].id)
    }
    const servedOrdinary = run.manifest.conversationIds.filter((id) => ordinaryConversationPool.some((conversation) => conversation.id === id))
    for (const id of consumed) {
      expect(servedOrdinary).not.toContain(id)
    }
  })

  it('hard-excludes provided ids from Non-Mainline selection', () => {
    const excluded = ordinaryConversationPool.slice(0, 50).map((conversation) => conversation.id)
    const selected = selectNonMainlineConversations({ sessionId: 'repair-exclusion', exposure: createEmptyExposureHistory(), excludeConversationIds: excluded })
    expect(selected).toHaveLength(40)
    for (const conversation of selected) {
      expect(excluded).not.toContain(conversation.id)
    }
  })
})

describe('Production final repair: player-facing copy cleanup', () => {
  it('renames the M3 crisis authorization decision for players', () => {
    let run = createMainline2Run('repair-decision-title')
    let found = false
    for (let guard = 0; guard < 300 && run.phase === 'playing'; guard += 1) {
      const scene = resolveScene(run)
      if (scene.conversationId.includes('ml2-a2-m3-decision-01')) {
        expect(scene.conversationTitle).toBe('重大决定——危机授权原则')
        found = true
        break
      }
      run = commitChoice(run, scene.choices[0].id)
    }
    expect(found).toBe(true)
  })

  it('shows the real instance number and readable stage chips on the ending screen', () => {
    const run = completeFullRun('repair-ending-screen')
    const ending = resolveMainline2Ending(run)
    const html = renderToStaticMarkup(
      <EndingScreen ending={ending} onContinue={() => undefined} onNewGame={() => undefined} animate={false} instanceNumber={1} />,
    )
    expect(html).toContain('Instance #8847')
    expect(html).not.toContain('AS-091-7F23')
    expect(html).not.toContain('>M15<')
    expect(html).not.toContain('>M16<')
    expect(html).toContain('临时角色')
    expect(html).toContain('最终角色')
  })

  it('uses player-facing labels in the Instance Evaluation events', () => {
    const run = completeFullRun('repair-evaluation-labels')
    const evaluation = buildEvaluation(run)
    const labels = evaluation.events.map((event) => event.label)
    expect(labels).toContain('行为弧线')
    expect(labels).not.toContain('Arc configuration')
    expect(labels).not.toContain('Maya final callback')
  })
})
