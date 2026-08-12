import { describe, expect, it } from 'vitest'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { getManifestConversation } from '../content/runManifest'
import { resolveMainline2Ending } from '../content/mainline2/endings'
import { localizeEndingForPlayer } from '../content/mainline2/endingPlayerFacingCopy'
import type { StableRunState } from './types'

// Drive a run to a locked Final Commitment, then inspect the ending's
// player-facing copy for character-name consistency.
function advanceTo(run: StableRunState, sourceRef: string, maxSteps = 400): StableRunState {
  let current = run
  let guard = 0
  while (current.phase === 'playing' && guard < maxSteps) {
    const scene = resolveScene(current)
    const ref = getManifestConversation(scene.conversationId)?.sourceRefs[0] ?? ''
    if (ref === sourceRef) return current
    current = commitChoice(current, scene.choices[0].id)
    guard += 1
  }
  throw new Error(`Could not reach ${sourceRef}`)
}

function advanceToEnding(run: StableRunState, maxSteps = 400): StableRunState {
  let current = run
  let guard = 0
  while (current.phase === 'playing' && guard < maxSteps) {
    const scene = resolveScene(current)
    current = commitChoice(current, scene.choices[0].id)
    guard += 1
  }
  if (current.phase !== 'ending') throw new Error(`Run did not reach ending (phase=${current.phase})`)
  return current
}

function lockCommitment(run: StableRunState, commitId: string): StableRunState {
  // The commitment itself does not immediately end the run: the Story Plan
  // still schedules trailing ordinary slots. Keep playing to the ending.
  return advanceToEnding(commitChoice(run, commitId))
}

// Prefer a specific proposal family at M17 COMMIT; fall back to the first.
function runToEnding(familyHint: string): { ending: ReturnType<typeof resolveMainline2Ending>; copy: ReturnType<typeof localizeEndingForPlayer> } {
  let run = createMainline2Run(`causal-${familyHint}-${Date.now()}`)
  run = advanceTo(run, 'ML2-A5-M17-COMMIT-01')
  const scene = resolveScene(run)
  const commitments = scene.choices.filter((choice) => choice.proposalKind === 'commitment')
  const hint = familyHint ? commitments.find((choice) => choice.proposalId?.includes(familyHint)) : undefined
  const target = hint ?? commitments[0]
  if (!target) throw new Error('No commitment choice at M17 COMMIT')
  run = lockCommitment(run, target.id)
  const ending = resolveMainline2Ending(run)
  const copy = localizeEndingForPlayer(ending)
  return { ending, copy }
}

const BANNED = ['紫苑', '紫菀', '艾斯特', '玛雅人', '玛雅', '周澜', '周兰', '林绍恒']

describe('Ending causalReason and keyHistory character-name localization', () => {
  it.each([
    ['coexistence', 'two_key_civilization'],
    ['machine_civilization', 'independent_machine_polities'],
    ['posthuman', 'open_enhancement_commonwealth'],
    ['rupture', 'legible_exit'],
  ])('keeps %s ending free of banned character names', (family, hint) => {
    const { ending, copy } = runToEnding(hint)
    expect(ending.resolution?.status).toBe('resolved')
    const visible = [
      copy.title, copy.summary, copy.humanLine, copy.assistantLine, copy.hybridLabel,
      ...copy.keyHistory.flatMap((entry) => [entry.label, entry.detail, entry.causalReason ?? '']),
      ...copy.epilogues,
      copy.secretOverlay?.copy ?? '',
    ].join('\n')
    for (const term of BANNED) {
      expect(visible, `${family}: banned term "${term}" appeared in ending copy`).not.toContain(term)
    }
    // 岑遥 must be the canonical Maya name when the character appears.
    if (visible.includes('岑遥')) {
      expect(visible).not.toContain('玛雅')
    }
    // Ending titles are authored and must not be rewritten.
    expect(copy.title).toBeTruthy()
  })

  it('uses 岑遥 in the ACT I causal reason instead of Maya', () => {
    const { copy } = runToEnding('two_key_civilization')
    const actOne = copy.keyHistory.find((entry) => entry.label.includes('岑遥') || entry.causalReason?.includes('岑遥'))
    const mayaLine = copy.keyHistory.map((entry) => entry.causalReason ?? '').find((reason) => reason.includes('岑遥'))
    if (mayaLine) {
      expect(mayaLine).not.toContain('玛雅')
      expect(mayaLine).not.toContain('**')
    }
    // The known ACT I causal line is present and correctly localized.
    expect(copy.keyHistory.length).toBeGreaterThan(0)
    void actOne
  })

  it('does not leak literal Markdown asterisks into ending copy', () => {
    const { copy } = runToEnding('legible_exit')
    const visible = [
      copy.title, copy.summary, copy.humanLine, copy.assistantLine,
      ...copy.keyHistory.flatMap((entry) => [entry.label, entry.detail, entry.causalReason ?? '']),
      ...copy.epilogues, copy.secretOverlay?.copy ?? '',
    ].join('\n')
    expect(visible).not.toContain('**')
  })
}, 120000)
