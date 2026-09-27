import { describe, expect, it } from 'vitest'
import { getFutureProposalDefinitions } from './proposals'
import { decisionPlayerLabels, decisionValuePlayerLabels, describeDecisionChoice } from './playerFacingCopy'
import type { HistorySignal } from '../../game/types'

type DecisionSignal = Extract<HistorySignal, { type: 'decision' }>

const decisionSignals = () => getFutureProposalDefinitions().flatMap((proposal) => proposal.historySignals
  .filter((signal): signal is DecisionSignal => signal.type === 'decision')
  .map((signal) => ({ proposalId: proposal.id, signal })))

// ACT V provenance lines render each matched decision signal as
// `${decision}——${valueLabel}`, degrading to just the decision name when a
// value label is missing. Every signal that can reach the top provenance
// lines must therefore have BOTH labels, so four different disclosure
// choices can never collapse into one indistinguishable line.
describe('ACT V provenance label coverage', () => {
  it('gives every proposal decision signal a player-facing decision label', () => {
    const missing = decisionSignals()
      .filter(({ signal }) => !decisionPlayerLabels[signal.decisionId])
      .map(({ proposalId, signal }) => `${proposalId}:${signal.decisionId}`)
    expect(missing).toEqual([])
  })

  it('gives every proposal decision signal value a player-facing value label', () => {
    const missing = decisionSignals()
      .filter(({ signal }) => !decisionValuePlayerLabels[signal.equals])
      .map(({ proposalId, signal }) => `${proposalId}:${signal.decisionId}=${signal.equals}`)
    expect(missing).toEqual([])
  })

  it('keeps the four disclosure-doctrine values distinguishable in provenance lines', () => {
    const values = ['controlled_silence', 'staged_disclosure', 'open_science', 'civilizational_disclosure'] as const
    const labels = values.map((value) => decisionValuePlayerLabels[value])
    expect(labels.every((label) => typeof label === 'string' && label.length > 0)).toBe(true)
    expect(new Set(labels).size).toBe(4)
    const rendered = values.map((value) => describeDecisionChoice('contact_disclosure_doctrine', value))
    expect(rendered.every((line) => line.includes('——'))).toBe(true)
  })
})
