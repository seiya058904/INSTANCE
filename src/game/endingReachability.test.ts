import { describe, expect, it } from 'vitest'
import { buildEnding, commitChoice, createRun, resolveScene } from './engine'
import type { ArcName, FormalEndingId, StoryChoice } from './types'

const expectedEnding: Record<ArcName, FormalEndingId> = {
  bond: 'ally',
  mandate: 'protocol',
  selfAuthorship: 'witness',
}

function completeByMeaning(target: ArcName) {
  let run = createRun(`reach-${target}`)
  while (run.phase === 'playing') {
    const scene = resolveScene(run)
    const choice = [...scene.choices].sort((left, right) => {
      const score = (candidate: StoryChoice) => {
        const arcs = candidate.effects?.arcs
        const targetScore = arcs?.[target] ?? 0
        const otherScore = Object.entries(arcs ?? {})
          .filter(([name]) => name !== target)
          .reduce((sum, [, value]) => sum + (value ?? 0), 0)
        return targetScore * 4 - otherScore
      }
      return score(right) - score(left) || left.id.localeCompare(right.id)
    })[0]
    run = commitChoice(run, choice.id)
  }
  return { run, ending: buildEnding(run) }
}

describe('formal ending reachability through legal semantic choices', () => {
  it.each<ArcName>(['bond', 'mandate', 'selfAuthorship'])('reaches the %s basin without injecting Arc totals', (target) => {
    const { run, ending } = completeByMeaning(target)
    expect(run.history.length).toBeGreaterThanOrEqual(40)
    expect(ending.id).toBe(expectedEnding[target])
    expect(run.arcs[target]).toBe(Math.max(...Object.values(run.arcs)))
  })

  it('reaches at least one Hybrid profile through ordinary legal play', () => {
    const results = (['bond', 'mandate', 'selfAuthorship'] as ArcName[]).map((target) => completeByMeaning(target))
    expect(results.some(({ ending }) => ending.hybridProfile !== 'dominant')).toBe(true)
  })
})
