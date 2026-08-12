import { describe, expect, it } from 'vitest'
import { commitChoice, createMainline2Run, resolveScene, buildEnding } from './engine'
import { generateFutureProposals } from '../content/mainline2/futureProposalGenerator'
import { DORMANT_PUBLIC_ENDINGS, PUBLIC_WORLD_ENDINGS, SECRET_ENDINGS, isFinalCommitmentResolvable, resolveMainline2Ending } from '../content/mainline2/endings'
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
  it('keeps Maya return inside the v3 playing scheduler', () => {
    let run = createMainline2Run('maya-return-regression')
    let guard = 0
    while (run.phase === 'playing' && guard < 200) {
      const scene = resolveScene(run)
      if (scene.conversationId === 'user-1842-return') {
        const before = run.manifest.conversationIds.length
        do {
          const mayaScene = resolveScene(run)
          run = commitChoice(run, mayaScene.choices[0].id)
        } while (run.phase === 'playing' && resolveScene(run).conversationId === 'user-1842-return')
        expect(run.version).toBe(3)
        expect(run.phase).toBe('playing')
        expect(run.manifest.conversationIds.length).toBeGreaterThan(before)
        expect(run.manifest.conversationIds.at(-1)).not.toBe('user-1842-return')
        return
      }
      run = commitChoice(run, scene.choices[0].id)
      guard += 1
    }
    throw new Error('Maya return was not reached in the v3 regression fixture')
  })

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
    const results = Array.from({ length: 12 }, (_, index) => complete(`simulation-${String(index).padStart(3, '0')}`))
    const counts = results.map(({ run }) => run.manifest.conversationIds.length)
    expect(Math.min(...counts)).toBeGreaterThanOrEqual(180)
    expect(Math.max(...counts)).toBeLessThanOrEqual(190)
    expect(new Set(counts)).toEqual(new Set([190]))
    expect(getActConversationCounts(counts[0])).toEqual([13, 29, 41, 90, 17])
    expect(results.map(({ run }) => [...new Set(run.progress?.encounteredModules)])).toEqual(Array.from({ length: 12 }, () => ['machine', 'ascension', 'automation', 'uplift', 'space', 'contact', 'security']))
    expect(results.every(({ run }) => (run.progress?.activeModules.length ?? 0) < 7)).toBe(true)
    expect(results.every(({ run }) => (run.progress?.act ?? 0) === 5)).toBe(true)
    expect(results.every(({ run }) => run.manifest.conversationIds.length === new Set(run.manifest.conversationIds).size)).toBe(true)
  }, 60000)

  it('generates exactly four deterministic player-facing proposals without ending titles', () => {
    const run = complete('proposal-fixture').run
    const proposals = generateFutureProposals(run)
    expect(proposals).toHaveLength(4)
    expect(generateFutureProposals({ ...run, runId: 'proposal-fixture-other-run-id' })).toEqual(proposals)
    expect(proposals.map((proposal) => proposal.category)).toEqual(['natural_continuation', 'power_constraint', 'shared_future', 'lawful_alternative'])
    expect(proposals.every((proposal) => isFinalCommitmentResolvable(run, proposal.id))).toBe(true)
    expect(new Set(proposals.map((proposal) => proposal.action)).size).toBe(4)
    expect(proposals.every((proposal) => !PUBLIC_WORLD_ENDINGS.some((ending) => proposal.title.toUpperCase().includes(ending.toUpperCase())))).toBe(true)
  })

  it('keeps feline secret opt-in and does not reveal it in an unrelated run', () => {
    expect(SECRET_ENDINGS.the_internet_is_for_cats.dormant).toBe(false)
    expect(SECRET_ENDINGS.the_internet_is_for_cats.reason).toContain('feline')
    const completed = complete('0000-fixture')
    const ending = completed.ending
    expect(ending.epilogues?.join(' ')).toContain('not classified')
  })

  it('does not resolve a clean run to a public ending commitment', () => {
    const resolved = resolveMainline2Ending(createMainline2Run('ending-fixture-clean'))
    expect(resolved.status).toBe('Commitment not yet locked')
    expect(resolved.keyHistory).toEqual([])
    expect(DORMANT_PUBLIC_ENDINGS).toEqual([])
  })
})
