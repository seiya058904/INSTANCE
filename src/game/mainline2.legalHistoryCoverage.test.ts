import { describe, expect, it } from 'vitest'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { buildEnding, commitChoice, createMainline2Run, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { generateFutureProposals } from '../content/mainline2/futureProposalGenerator'
import { getFutureProposalDefinitions, rankFutureProposalCandidates } from '../content/mainline2/proposals'
import { isFinalCommitmentResolvable } from '../content/mainline2/endings'
import { evaluateCondition } from './narrativeSchema'

describe('ACT V coverage of the current legal partnership trace', () => {
  it.each([0, 7, 20])('replays every recorded legal choice and completes M17, restore every %s', (interval) => {
    const route = runMainline2Route(PUBLIC_RUNTIME_ROUTE_CATALOG.find(target => target.endingId === 'the_commonwealth')!)
    const trace = route.links.slice(0, route.links.findIndex(link => link.sourceRef === 'ML2-A5-M16-GEN-01'))
    let run = createMainline2Run(route.run.runId, undefined, 3)
    for (const recorded of trace) {
      const scene = resolveScene(run)
      expect([scene.id, scene.conversationId]).toEqual([recorded.nodeId, recorded.conversationId])
      const choice = scene.choices.find(choice => choice.id === recorded.choiceId)!
      expect(choice.text).toBe(recorded.choiceText)
      run = commitChoice(run, choice.id)
      if (interval && (recorded.step + 1) % interval === 0) run = restoreRun(serializeRun(run))!
    }
    expect(run.history).toHaveLength(trace.length)
    expect(run.currentNodeId).toBe('ml2-a5-m16-gen-01-progression')
    // No flags or decisions are manufactured. M16's actual partnership choice
    // follows the earlier coordinator role and must qualify the honest charter.
    expect(run.decisions).toMatchObject({ aster_provisional_role: 'partner', aster_intended_role: 'advisor' })
    const charter = getFutureProposalDefinitions().find(p => p.id === 'proposal.hc.continuity_charter')!
    expect(isFinalCommitmentResolvable(run, charter.id)).toBe(true)
    expect(evaluateCondition(charter.eligibility, run)).toBe(true)
    expect(rankFutureProposalCandidates(run)).toContainEqual(charter)
    const proposals = generateFutureProposals(run)
    expect(proposals.length).toBeGreaterThan(0)
    expect(proposals.some(p => p.id.startsWith(`${charter.id}.category.`))).toBe(true)
    expect(proposals.every(p => isFinalCommitmentResolvable(run, p.id))).toBe(true)
    run = restoreRun(serializeRun(run))!
    expect(resolveScene(run).choices.length).toBeGreaterThan(0)
    for (let step = 0; step < 40 && run.phase === 'playing'; step++) {
      const scene = resolveScene(run)
      const choice = scene.choices.find(c => c.proposalId?.startsWith(charter.id) && ['proposal', 'commitment'].includes(c.proposalKind ?? '')) ?? scene.choices[0]
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
