import { describe, expect, it } from 'vitest'
import { getManifestConversation } from '../content/runManifest'
import { buildEnding, commitChoice, createMainline2Run, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'

function rejectedReview() {
  let run = createMainline2Run('reject-all-audit')
  for (let i = 0; i < 600; i++) {
    const scene = resolveScene(run)
    if (getManifestConversation(scene.conversationId)?.sourceRefs[0] === 'ML2-A5-M17-REVIEW-01') break
    run = commitChoice(run, scene.choices[0].id)
  }
  const proceed = resolveScene(run).choices.find(choice => !choice.proposalKind)!
  const commit = commitChoice(run, proceed.id)
  for (let i = 0; i < 20; i++) {
    const choices = resolveScene(run).choices
    const choice = choices.find(item => item.proposalKind === 'rejection') ?? choices.find(item => item.proposalKind === 'proposal')
    if (!choice) break
    run = commitChoice(run, choice.id)
  }
  expect(run.rejectedProposalIds?.length).toBeGreaterThan(0)
  return { run, proceed, commit }
}

describe('M17 requires an explicit final commitment', () => {
  it('reject-all removes Proceed, rejects its stale id, and permits recovery then a real ending', () => {
    let { run, proceed } = rejectedReview()
    expect(resolveScene(run).choices.some(choice => choice.id === proceed.id)).toBe(false)
    expect(() => commitChoice(run, proceed.id)).toThrow()
    run = restoreRun(serializeRun(run))!
    const recovery = resolveScene(run).choices.find(choice => choice.proposalKind === 'recovery')!
    expect(recovery).toBeDefined()
    run = commitChoice(run, recovery.id)
    run = commitChoice(run, resolveScene(run).choices.find(choice => !choice.proposalKind)!.id)
    run = restoreRun(serializeRun(run))!
    run = commitChoice(run, resolveScene(run).choices.find(choice => choice.proposalKind === 'commitment')!.id)
    expect(run.phase).toBe('ending')
    expect(run.finalCommitmentLocked).toBe(true)
    expect(run.decisions?.final_commitment).toBe(recovery.proposalId)
    expect(buildEnding(run).id).not.toBe('pending')
    expect(buildEnding(run).keyHistory?.length).toBeGreaterThan(0)
    expect(buildEnding(run).epilogues?.length).toBeGreaterThan(0)
    expect(restoreRun(serializeRun(run))?.phase).toBe('ending')
  })

  it('an empty COMMIT offers review recovery, never the authored no-op placeholder', () => {
    const { run, commit } = rejectedReview()
    const emptyCommit = { ...run, manifest: commit.manifest, currentNodeId: commit.currentNodeId, progress: commit.progress }
    const choices = resolveScene(emptyCommit).choices
    expect(choices.some(choice => choice.id.endsWith('progression-action'))).toBe(false)
    expect(choices.length).toBeGreaterThan(0)
    expect(() => commitChoice(emptyCommit, 'ml2-a5-m17-commit-01-progression-action')).toThrow()
    expect(commitChoice(emptyCommit, choices[0].id).phase).toBe('playing')
  })

  it('recovers a legacy unlocked ending to review without inventing a commitment or losing history', () => {
    const { run, commit } = rejectedReview()
    const legacy = { ...run, manifest: commit.manifest, progress: commit.progress, currentNodeId: 'ending', phase: 'ending' as const, finalCommitmentLocked: false }
    const restored = restoreRun(serializeRun(legacy))!
    expect(restored).not.toBeNull()
    expect(restored.phase).toBe('playing')
    expect(getManifestConversation(resolveScene(restored).conversationId)?.sourceRefs[0]).toBe('ML2-A5-M17-REVIEW-01')
    expect(restored.history).toEqual(legacy.history)
    expect(restored.decisions?.final_commitment).toBeUndefined()
    expect(resolveScene(restored).choices.some(choice => choice.proposalKind === 'recovery')).toBe(true)
  })
})
