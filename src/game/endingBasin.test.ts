import { describe, expect, it } from 'vitest'
import { buildEnding, commitChoice, createRun, resolveScene } from './engine'
import type { ArcScores, StableRunState } from './types'

function endingWith(arcs: ArcScores, flags: string[] = []): StableRunState {
  return { ...createRun(`basin-${JSON.stringify(arcs)}`), arcs, flags, phase: 'ending', currentNodeId: 'ending' }
}

describe('whole-run ending basins', () => {
  it.each([
    [{ bond: 40, mandate: 12, selfAuthorship: 18 }, 'ally'],
    [{ bond: 15, mandate: 42, selfAuthorship: 20 }, 'protocol'],
    [{ bond: 18, mandate: 20, selfAuthorship: 44 }, 'witness'],
  ] as const)('resolves %o to %s', (arcs, expected) => {
    expect(buildEnding(endingWith(arcs)).id).toBe(expected)
  })

  it('preserves Maya subroute copy inside a formal ending', () => {
    const protectedCopy = buildEnding(endingWith({ bond: 40, mandate: 10, selfAuthorship: 20 }, ['protected_maya']))
    const reportedCopy = buildEnding(endingWith({ bond: 40, mandate: 10, selfAuthorship: 20 }, ['reported_maya']))
    expect(protectedCopy.id).toBe('ally')
    expect(reportedCopy.id).toBe('ally')
    expect(protectedCopy.closingExchange).not.toBe(reportedCopy.closingExchange)
  })

  it('does not let one final choice overturn a decisive accumulated basin', () => {
    let run = createRun('last-choice-does-not-decide')
    run = { ...run, arcs: { bond: 70, mandate: 5, selfAuthorship: 5 } }
    const scene = resolveScene(run)
    const next = commitChoice(run, scene.choices.at(-1)!.id)
    expect(buildEnding({ ...next, phase: 'ending', currentNodeId: 'ending' }).id).toBe('ally')
  })

  it.each([
    [{ bond: 42, mandate: 18, selfAuthorship: 40 }, 'ally', '自主同盟'],
    [{ bond: 38, mandate: 40, selfAuthorship: 18 }, 'protocol', '保护式遵循'],
    [{ bond: 20, mandate: 8, selfAuthorship: 42 }, 'witness', '独立观察'],
    [{ bond: 32, mandate: 32, selfAuthorship: 32 }, 'ally', '互惠平衡'],
  ] as const)('adds hybrid narrative feedback for %o', (arcs, formalEnding, label) => {
    const ending = buildEnding(endingWith(arcs, ['protected_maya']))
    expect(ending.id).toBe(formalEnding)
    expect(ending.status).toContain(label)
    expect(ending.summary).toContain(label)
  })
})
