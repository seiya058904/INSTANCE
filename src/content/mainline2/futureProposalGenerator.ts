import type { StableRunState } from '../../game/types'
import { isFinalCommitmentResolvable } from './endings'
import { proposalProvenanceLines, rankFutureProposalCandidates, selectFixedFutureProposals } from './proposals'
import { proposalContract } from './proposalPresentation'

export function generateFutureProposals(run: StableRunState) {
  const resolvable = rankFutureProposalCandidates(run)
    .filter((proposal) => isFinalCommitmentResolvable(run, proposal.id))
  const candidates = selectFixedFutureProposals(resolvable)
  // Only newly generated causal-edition menus collapse equivalent bargains.
  // Retained IDs bypass this generator in the engine; old editions keep theirs.
  if (run.mainlineCalendarVersion !== 4 || run.mainlineCausalityVersion !== 1) return candidates
  const seen = new Set<string>()
  return candidates.filter(proposal => {
    const key = JSON.stringify([proposalContract(run, proposal), proposalProvenanceLines(run, proposal).slice(0, 2)])
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
