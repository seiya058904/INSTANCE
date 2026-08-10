import { describe, expect, it } from 'vitest'
import { commitChoice, createMainline2Run, resolveScene, buildEnding } from './engine'
import { generateFutureProposals } from '../content/mainline2/proposals'
import { PUBLIC_WORLD_ENDINGS, SECRET_ENDINGS } from '../content/mainline2/endings'
import { getActConversationCounts } from '../content/mainline2/scheduler'
import { restoreRun, serializeRun } from './storage'

function complete(runId: string) {
  let run = createMainline2Run(runId)
  let guard = 0
  while (run.phase === 'playing' && guard < 500) {
    const scene = resolveScene(run)
    const choice = scene.choices[guard % Math.max(1, scene.choices.length)]
    if (!choice) throw new Error(`No legal choice at ${scene.id}`)
    run = commitChoice(run, choice.id)
    guard += 1
  }
  if (run.phase !== 'ending') throw new Error(`Run ${runId} did not reach ending after ${guard} choices`)
  return { run, choices: guard, ending: buildEnding(run) }
}

describe('Mainline 2.0 runtime', () => {
  it('uses v3 state and preserves decisions/world/modules across reload', () => {
    const original = createMainline2Run('reload-fixture')
    let run = commitChoice(original, resolveScene(original).choices[0].id)
    const restored = restoreRun(serializeRun(run))
    expect(restored?.version).toBe(3)
    expect(restored?.manifest.mode).toBe('mainline2')
    expect(restored?.progress?.activeModules).toEqual(original.progress?.activeModules)
    expect(restored?.worldState).toEqual(run.worldState)
  })

  it('completes 100 deterministic legal runs inside pacing and module limits', () => {
    const results = Array.from({ length: 100 }, (_, index) => complete(`simulation-${String(index).padStart(3, '0')}`))
    const counts = results.map(({ run }) => run.manifest.conversationIds.length)
    expect(Math.min(...counts)).toBeGreaterThanOrEqual(123)
    expect(Math.max(...counts)).toBeLessThanOrEqual(146)
    expect(new Set(counts)).toEqual(new Set([134]))
    expect(getActConversationCounts(counts[0])).toEqual([26, 30, 30, 34, 14])
    expect(results.every(({ run }) => (run.progress?.activeModules.length ?? 0) >= 2 && (run.progress?.activeModules.length ?? 0) <= 4)).toBe(true)
    expect(results.every(({ run }) => (run.progress?.act ?? 0) === 5)).toBe(true)
    expect(results.every(({ run }) => run.manifest.conversationIds.length === new Set(run.manifest.conversationIds).size)).toBe(true)
  }, 30000)

  it('generates three to five player-facing proposals without ending titles', () => {
    const run = complete('proposal-fixture').run
    const proposals = generateFutureProposals(run)
    expect(proposals.length).toBeGreaterThanOrEqual(3)
    expect(proposals.length).toBeLessThanOrEqual(5)
    expect(proposals.every((proposal) => !PUBLIC_WORLD_ENDINGS.some((ending) => proposal.title.toUpperCase().includes(ending.toUpperCase())))).toBe(true)
  })

  it('keeps feline secret dormant and does not reveal #0000', () => {
    expect(SECRET_ENDINGS.the_internet_is_for_cats.dormant).toBe(true)
    expect(SECRET_ENDINGS.the_internet_is_for_cats.reason).toContain('feline')
    const ending = complete('0000-fixture').ending
    expect(ending.epilogues?.join(' ')).toContain('not classified')
  })
})
