import { describe, expect, it } from 'vitest'
import { getManifestConversation } from '../content/runManifest'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import type { StableRunState } from './types'

function advanceToSourceRef(run: StableRunState, sourceRef: string, maxSteps = 400): StableRunState {
  let current = run
  let guard = 0
  while (current.phase === 'playing' && guard < maxSteps) {
    const scene = resolveScene(current)
    const ref = getManifestConversation(scene.conversationId)?.sourceRefs[0] ?? ''
    if (ref === sourceRef) return current
    current = commitChoice(current, scene.choices[0].id)
    guard += 1
  }
  throw new Error(`Could not reach ${sourceRef} within ${maxSteps} steps`)
}

function advanceToReviewWithSelection(run: StableRunState): StableRunState {
  let current = advanceToSourceRef(run, 'ML2-A5-M17-REVIEW-01')
  const scene = resolveScene(current)
  const reviewChoice = scene.choices.find((choice) => choice.proposalKind === 'proposal')
  if (!reviewChoice) throw new Error('No proposal review choice found at M17 REVIEW')
  current = commitChoice(current, reviewChoice.id)
  return advanceToSourceRef(current, 'ML2-A5-M17-REVIEW-01')
}

function clarificationChoice(run: StableRunState) {
  const scene = resolveScene(run)
  return scene.choices.find((choice) => choice.proposalKind === 'clarification') ?? null
}

describe('Mainline 2.0 M17 REVIEW clarification', () => {
  it('shows real clarification content as the assistant response', () => {
    let run = createMainline2Run('clarify-content')
    run = advanceToReviewWithSelection(run)
    const clarify = clarificationChoice(run)
    expect(clarify).not.toBeNull()
    const after = commitChoice(run, clarify!.id)
    const last = after.history[after.history.length - 1]
    expect(last.assistantText).toContain('复核「')
    expect(last.assistantText).toContain('最终权力：')
    expect(last.assistantText).toContain('这条路保留：')
    expect(last.assistantText).toContain('必须放弃：')
    expect(last.assistantText).toContain('主要阻力：')
    expect(last.assistantText).toContain('它来自：')
    expect(last.assistantText).toContain('当前可行性：')
    // The response must not be the raw choice label alone.
    expect(last.assistantText).not.toEqual(clarify!.text)
  })

  it('does not loop: clarify disappears for the same proposal after it is given', () => {
    let run = createMainline2Run('clarify-no-loop')
    run = advanceToReviewWithSelection(run)
    const clarify = clarificationChoice(run)
    expect(clarify).not.toBeNull()
    const proposalId = clarify!.proposalId
    run = commitChoice(run, clarify!.id)
    // Still at the same REVIEW scene (currentNodeId is the scene itself).
    expect(run.phase).toBe('playing')
    const scene = resolveScene(run)
    expect(scene.conversationId).toContain('m17-review')
    const again = scene.choices.find((choice) => choice.proposalKind === 'clarification')
    expect(again).toBeUndefined()
    // Rejection remains available so the player can move on.
    const reject = scene.choices.find((choice) => choice.proposalKind === 'rejection')
    expect(reject?.proposalId).toBe(proposalId)
  })

  it('can Proceed after clarification and reach the authored COMMIT stage', () => {
    let run = createMainline2Run('clarify-proceed')
    run = advanceToReviewWithSelection(run)
    const clarify = clarificationChoice(run)
    run = commitChoice(run, clarify!.id)
    // The authored Proceed choice continues to the next conversation.
    const proceed = resolveScene(run).choices.find((choice) => choice.id.includes('a5m17-review-002') || choice.text.includes('继续'))
    expect(proceed).toBeTruthy()
    run = commitChoice(run, proceed!.id)
    const scene = resolveScene(run)
    expect(getManifestConversation(scene.conversationId)?.sourceRefs).toContain('ML2-A5-M17-COMMIT-01')
    const commitment = scene.choices.find((choice) => choice.proposalKind === 'commitment')
    expect(commitment?.proposalId).toBeTruthy()
  })

  it('can Reject after clarification and records the rejection', () => {
    let run = createMainline2Run('clarify-reject')
    run = advanceToReviewWithSelection(run)
    const clarify = clarificationChoice(run)
    const proposalId = clarify!.proposalId
    run = commitChoice(run, clarify!.id)
    const reject = resolveScene(run).choices.find((choice) => choice.proposalKind === 'rejection')
    expect(reject).toBeTruthy()
    run = commitChoice(run, reject!.id)
    expect(run.rejectedProposalIds).toContain(proposalId)
    // After rejection the same proposal is no longer offered again.
    const remaining = resolveScene(run).choices.filter((choice) => choice.proposalKind === 'proposal')
    expect(remaining.every((choice) => choice.proposalId !== proposalId)).toBe(true)
  })

  it('defines repeated clarification: second clarification attempt is not offered and cannot be committed', () => {
    let run = createMainline2Run('clarify-repeat')
    run = advanceToReviewWithSelection(run)
    const clarify = clarificationChoice(run)
    run = commitChoice(run, clarify!.id)
    const scene = resolveScene(run)
    const again = scene.choices.find((choice) => choice.proposalKind === 'clarification')
    expect(again).toBeUndefined()
    // Committing a stale clarification id must fail instead of silently looping.
    expect(() => commitChoice(run, clarify!.id)).toThrow()
    // Player can still move forward from the same REVIEW scene.
    expect(run.phase).toBe('playing')
  })
})
