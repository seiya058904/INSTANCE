import { beforeAll, describe, expect, it } from 'vitest'
import { getManifestConversation } from '../content/runManifest'
import { isFinalCommitmentResolvable } from '../content/mainline2/endings'
import { buildEnding, commitChoice, confirmEnding, createMainline2Run, resolveScene } from './engine'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { restoreRun, serializeRun } from './storage'
import type { StableRunState } from './types'
import seed45 from './fixtures/adversarial-m16-seed-45.json'

const reviewSource = 'ML2-A5-M17-REVIEW-01'
const commitSource = 'ML2-A5-M17-COMMIT-01'

function roundTrip(run: StableRunState): StableRunState {
  const restored = restoreRun(serializeRun(run))
  expect(restored).not.toBeNull()
  expect(restored!.history).toEqual(run.history)
  return restored!
}

function proceedAndCommit(run: StableRunState, proposalId?: string): StableRunState {
  expect(getManifestConversation(resolveScene(run).conversationId)?.sourceRefs[0]).toBe(reviewSource)
  const proceed = resolveScene(run).choices.find(choice => !choice.proposalKind)
  expect(proceed).toBeDefined()
  let next = commitChoice(run, proceed!.id)
  expect(getManifestConversation(resolveScene(next).conversationId)?.sourceRefs[0]).toBe(commitSource)
  const commitment = resolveScene(next).choices.find(choice => choice.proposalKind === 'commitment'
    && (!proposalId || choice.proposalId === proposalId))
  expect(commitment).toBeDefined()
  next = commitChoice(next, commitment!.id)
  expect(next.phase).toBe('ending')
  expect(next.finalCommitmentLocked).toBe(true)
  expect(next.decisions?.final_commitment).toBe(commitment!.proposalId)
  expect(buildEnding(next).resolution?.status).toBe('resolved')
  return next
}

function meaningfulState(run: StableRunState) {
  return {
    attributes: run.attributes,
    arcs: run.arcs,
    decisions: run.decisions,
    worldState: run.worldState,
    flags: run.flags,
    persistentFlags: run.persistentFlags,
    events: run.events,
    progress: run.progress,
  }
}

describe('adversarial Mainline histories and final review', () => {
  let review: StableRunState
  let completed: StableRunState

  beforeAll(() => {
    const route = runMainline2Route({ routeId: 'adversarial-final-review-control', proposalId: 'proposal.hc.final_human_veto' })
    review = route.links.find(link => link.sourceRef === reviewSource)!.runBefore
    completed = route.run
  }, 30_000)

  it.each([0, 31])('completes the real 212-choice M16 history, restoring every %s choices', (restoreEvery) => {
    let run = createMainline2Run(seed45.runId)
    expect(seed45.trace).toHaveLength(212)
    for (const [index, recorded] of seed45.trace.entries()) {
      const scene = resolveScene(run)
      expect(scene.id).toBe(recorded.nodeId)
      expect(scene.choices.some(choice => choice.id === recorded.choiceId)).toBe(true)
      run = commitChoice(run, recorded.choiceId)
      if (restoreEvery && (index + 1) % restoreEvery === 0) run = roundTrip(run)
    }

    expect(run.currentNodeId).toBe('ml2-a5-m16-gen-01-progression')
    expect(run.decisions).toMatchObject({
      first_public_execution_doctrine: 'necessity_intervention',
      aster_provisional_role: 'advisor',
      aster_intended_role: 'other',
    })
    // These are the actual earned state and existing ending gates. No ending
    // name, capability, world score or decision is injected to repair the route.
    expect(isFinalCommitmentResolvable(run, 'proposal.hc.final_human_veto')).toBe(true)
    run = roundTrip(run)
    const proposal = resolveScene(run).choices.find(choice => choice.proposalKind === 'proposal'
      && choice.proposalId?.startsWith('proposal.hc.final_human_veto.category.'))
    expect(proposal).toBeDefined()
    run = roundTrip(commitChoice(run, proposal!.id))
    // M16 still has authored conversations after proposal generation. Follow
    // them normally; do not jump over the remaining Maya exchange to REVIEW.
    for (let step = 0; step < 20 && run.phase === 'playing'; step += 1) {
      const scene = resolveScene(run)
      if (getManifestConversation(scene.conversationId)?.sourceRefs[0] === reviewSource) break
      expect(scene.choices.length).toBeGreaterThan(0)
      run = roundTrip(commitChoice(run, scene.choices[0].id))
    }
    run = proceedAndCommit(run, proposal!.proposalId)
    expect(buildEnding(run).worldEndingId).toBe('the_silent_giant')
    expect(buildEnding(roundTrip(run))).toEqual(buildEnding(run))
  })

  it('can clarify A, compare B, then return to A without rejecting either or changing narrative state', () => {
    let run = review
    const proposals = resolveScene(run).choices.filter(choice => choice.proposalKind === 'proposal')
    expect(proposals.length).toBeGreaterThanOrEqual(2)
    const [a, b] = proposals
    const initialMeaning = structuredClone(meaningfulState(run))
    const retained = [...run.retainedProposalIds!]
    const historyLength = run.history.length

    run = commitChoice(run, a.id)
    const clarifyA = resolveScene(run).choices.find(choice => choice.proposalKind === 'clarification' && choice.proposalId === a.proposalId)
    expect(clarifyA).toBeDefined()
    run = commitChoice(run, clarifyA!.id)
    run = roundTrip(run)

    const reviewB = resolveScene(run).choices.find(choice => choice.proposalKind === 'proposal' && choice.proposalId === b.proposalId)
    expect(reviewB).toBeDefined()
    run = commitChoice(run, reviewB!.id)
    const clarifyB = resolveScene(run).choices.find(choice => choice.proposalKind === 'clarification' && choice.proposalId === b.proposalId)
    expect(clarifyB).toBeDefined()
    run = commitChoice(run, clarifyB!.id)
    run = roundTrip(run)

    const reviewA = resolveScene(run).choices.find(choice => choice.proposalKind === 'proposal' && choice.proposalId === a.proposalId)
    expect(reviewA).toBeDefined()
    run = commitChoice(run, reviewA!.id)
    expect(run.selectedProposalId).toBe(a.proposalId)
    expect(run.rejectedProposalIds).toEqual([])
    expect(run.retainedProposalIds).toEqual(retained)
    expect(run.clarifiedProposalIds).toEqual(expect.arrayContaining([a.proposalId, b.proposalId]))
    expect(meaningfulState(run)).toEqual(initialMeaning)
    expect(resolveScene(run).choices.some(choice => choice.proposalKind === 'clarification' && choice.proposalId === a.proposalId)).toBe(false)
    expect(run.history.slice(historyLength).every(entry => entry.userMessage === '' && entry.userMessages?.length === 0)).toBe(true)

    const ending = proceedAndCommit(run, a.proposalId)
    expect(ending.rejectedProposalIds).toEqual([])
    expect(ending.history.filter(entry => entry.conversationId === resolveScene(review).conversationId && entry.userMessage !== '')).toHaveLength(1)
  })

  const oldCategories = ['natural_continuation', 'power_constraint', 'shared_future'] as const
  const terminalPhases = ['ending', 'evaluation'] as const

  for (const phase of terminalPhases) {
    for (const category of oldCategories) {
      it(`recovers completed obsolete ${category} from ${phase} without discarding its history`, () => {
        const oldId = `proposal.rupture.legible_exit.category.${category}`
        const baseline = phase === 'evaluation' ? confirmEnding(completed) : completed
        const legacy: StableRunState = {
          ...baseline,
          finalCommitmentLocked: true,
          selectedProposalId: oldId,
          decisions: { ...baseline.decisions, final_commitment: oldId },
          availableProposalIds: [oldId],
          retainedProposalIds: [oldId],
          clarifiedProposalIds: [oldId],
          history: baseline.history.map(entry => entry.choiceId.startsWith('m17-commit-')
            ? { ...entry, choiceId: `m17-commit-${oldId}`, assistantText: '锁定旧版退出方案。' }
            : entry),
        }
        const restored = roundTrip(legacy)
        expect(restored.phase).toBe('playing')
        expect(getManifestConversation(resolveScene(restored).conversationId)?.sourceRefs[0]).toBe(reviewSource)
        expect(restored.finalCommitmentLocked).toBe(false)
        expect(restored.decisions?.final_commitment).toBeUndefined()
        expect(restored.completedEndingIds).toEqual(legacy.completedEndingIds)
        expect(restored.flags).toEqual(legacy.flags)
        expect(restored.events).toEqual(legacy.events)
        expect(buildEnding(proceedAndCommit(restored)).resolution?.status).toBe('resolved')
      })
    }

    it(`preserves a valid completed ${phase} commitment and its exact ending`, () => {
      const baseline = phase === 'evaluation' ? confirmEnding(completed) : completed
      const restored = roundTrip(baseline)
      expect(restored.phase).toBe(phase)
      expect(restored.currentNodeId).toBe('ending')
      expect(restored.finalCommitmentLocked).toBe(true)
      expect(restored.decisions?.final_commitment).toBe(baseline.decisions?.final_commitment)
      expect(restored.completedEndingIds).toEqual(baseline.completedEndingIds)
      expect(buildEnding(restored)).toEqual(buildEnding(baseline))
    })
  }

  it('explains the new actual commitment after legacy review recovery while retaining the old terminal entry', () => {
    // The older unlocked-ending recovery is independently supported already.
    // Its historical COMMIT placeholder must not outrank a later real choice.
    const decisions = { ...completed.decisions }
    delete decisions.final_commitment
    const legacy: StableRunState = {
      ...completed,
      finalCommitmentLocked: false,
      selectedProposalId: undefined,
      decisions,
      history: completed.history.map(entry => entry.choiceId.startsWith('m17-commit-')
        ? { ...entry, choiceId: 'ml2-a5-m17-commit-01-progression-action', assistantText: '旧版最终承诺。' }
        : entry),
    }
    const restored = roundTrip(legacy)
    expect(restored.phase).toBe('playing')
    const next = proceedAndCommit(restored)
    expect(next.history.slice(0, legacy.history.length)).toEqual(legacy.history)
    const actualCommitment = next.history.at(-1)!
    expect(actualCommitment.choiceId).toBe(`m17-commit-${next.decisions?.final_commitment}`)
    const displayed = buildEnding(next).keyHistory?.find(entry => entry.stage === 'Final Commitment')
    expect(displayed?.provenance).toMatchObject({
      conversationId: actualCommitment.conversationId,
      nodeId: actualCommitment.nodeId,
      choiceId: actualCommitment.choiceId,
    })
    expect(displayed?.detail).toBe(`选择：${actualCommitment.assistantText}`)
    expect(displayed?.detail).not.toContain('旧版最终承诺')
    expect(buildEnding(roundTrip(next)).keyHistory).toEqual(buildEnding(next).keyHistory)
  })
})
