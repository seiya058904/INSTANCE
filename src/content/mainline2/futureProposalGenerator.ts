import type { StableRunState } from '../../game/types'
import { isFinalCommitmentResolvable } from './endings'
import { rankFutureProposalCandidates, selectFixedFutureProposals } from './proposals'

export function generateFutureProposals(run: StableRunState) {
  const resolvable = rankFutureProposalCandidates(run)
    .filter((proposal) => isFinalCommitmentResolvable(run, proposal.id))
  return selectFixedFutureProposals(resolvable)
}
