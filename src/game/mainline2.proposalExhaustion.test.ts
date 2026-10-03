import { describe, expect, it } from 'vitest'
import { getManifestConversation } from '../content/runManifest'
import { generateFutureProposals } from '../content/mainline2/futureProposalGenerator'
import { buildEnding, commitChoice, createMainline2Run, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'

describe('M16 proposal exhaustion on the legal audit route (#20)', () => {
  it.each([false, true])('continues the 223-choice route, with periodic restore=%s', (periodicRestore) => {
    let run = createMainline2Run('independent-audit-13')
    let rng = 14
    const trace: string[] = []
    for (let step = 0; step < 223; step++) {
      const scene = resolveScene(run)
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0
      const choice = scene.choices.find(c => c.proposalKind === 'commitment')
        ?? scene.choices[rng % scene.choices.length]
      trace.push(choice.id)
      run = commitChoice(run, choice.id)
      if (periodicRestore && (step + 1) % 7 === 0) run = restoreRun(serializeRun(run))!
    }
    expect(trace).toMatchSnapshot('223 authored choices')
    expect(run.currentNodeId).toBe('ml2-a5-m16-gen-01-progression')
    run = restoreRun(serializeRun(run))!
    expect(run).not.toBeNull()
    const proposals = generateFutureProposals(run)
    expect(proposals.map(p => [p.id, p.family, p.category])).toEqual([
      ['proposal.rupture.legible_exit.category.lawful_alternative', 'rupture', 'lawful_alternative'],
    ])
    expect(resolveScene(run).choices.map(c => c.proposalId)).toEqual(proposals.map(p => p.id))
    for (let step = 0; step < 40 && run.phase === 'playing'; step++) {
      run = restoreRun(serializeRun(run))!
      const scene = resolveScene(run)
      expect(scene.choices.length).toBeGreaterThan(0)
      const choice = scene.choices.find(c => c.proposalKind === 'commitment') ?? scene.choices[0]
      if (choice.proposalKind === 'commitment') {
        expect(run.finalCommitmentLocked).not.toBe(true)
        expect(getManifestConversation(scene.conversationId)?.sourceRefs[0]).toBe('ML2-A5-M17-COMMIT-01')
      }
      run = commitChoice(run, choice.id)
    }
    expect(run.phase).toBe('ending')
    expect(run.finalCommitmentLocked).toBe(true)
    expect(run.decisions?.final_commitment).toBe(proposals[0].id)
    expect(buildEnding(run).id).not.toBe('pending')
    expect(restoreRun(serializeRun(run))?.phase).toBe('ending')
  })
})
