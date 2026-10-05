import { describe, expect, it } from 'vitest'
import traceFixture from './fixtures/act-v-217-choice-trace.json'
import { buildEnding, commitChoice, createMainline2Run, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { generateFutureProposals } from '../content/mainline2/futureProposalGenerator'
import { getFutureProposalDefinitions, rankFutureProposalCandidates } from '../content/mainline2/proposals'
import { isFinalCommitmentResolvable } from '../content/mainline2/endings'
import { evaluateCondition } from './narrativeSchema'

describe('ACT V coverage of the original 217-choice review trace', () => {
  it.each([0, 7, 20])('replays every recorded legal choice and completes M17, restore every %s', (interval) => {
    let run = createMainline2Run(traceFixture.runId)
    let rng = traceFixture.initialRng
    for (const recorded of traceFixture.trace) {
      const scene = resolveScene(run)
      expect([scene.id, scene.conversationId]).toEqual([recorded.node, recorded.conversation])
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0
      const choice = scene.choices[Math.floor(rng / 4294967296 * scene.choices.length)]
      expect([choice.id, choice.text]).toEqual([recorded.choice, recorded.text])
      run = commitChoice(run, choice.id)
      if (interval && (recorded.step + 1) % interval === 0) run = restoreRun(serializeRun(run))!
    }
    expect(run.history).toHaveLength(217)
    expect(run.currentNodeId).toBe('ml2-a5-m16-gen-01-progression')
    // No flags or decisions are manufactured. M16's actual partnership choice
    // follows the earlier coordinator role and must qualify the honest charter.
    expect(run.decisions).toMatchObject({ aster_provisional_role: 'coordinator', aster_intended_role: 'partner' })
    const charter = getFutureProposalDefinitions().find(p => p.id === 'proposal.hc.continuity_charter')!
    expect(isFinalCommitmentResolvable(run, charter.id)).toBe(true)
    expect(evaluateCondition(charter.eligibility, run)).toBe(true)
    expect(rankFutureProposalCandidates(run)).toContainEqual(charter)
    const proposals = generateFutureProposals(run)
    expect(proposals.length).toBeGreaterThan(0)
    expect(proposals.every(p => p.id.startsWith(`${charter.id}.category.`) && isFinalCommitmentResolvable(run, p.id))).toBe(true)
    run = restoreRun(serializeRun(run))!
    expect(resolveScene(run).choices.length).toBeGreaterThan(0)
    for (let step = 0; step < 40 && run.phase === 'playing'; step++) {
      const scene = resolveScene(run)
      const choice = scene.choices.find(c => c.proposalKind === 'commitment') ?? scene.choices[0]
      expect(choice).toBeDefined()
      run = restoreRun(serializeRun(commitChoice(run, choice.id)))!
    }
    expect(run.phase).toBe('ending')
    expect(run.finalCommitmentLocked).toBe(true)
    expect(buildEnding(run).worldEndingId).toBe('the_commonwealth')
  })

  it('does not provide an unqualified proposal on an unearned new history', () => {
    expect(() => generateFutureProposals(createMainline2Run('unearned-history'))).toThrow('cannot generate a resolvable proposal')
  })
})
