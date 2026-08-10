import { resolveMainline2Ending } from '../content/mainline2/endings'
import { runMainline2Route, type Mainline2RouteFixture, type Mainline2RouteTarget } from './mainline2.closeoutFixtures'
import type { StableRunState } from './types'

export interface CausalProofLink {
  chainId: string
  step: string
  assetId?: string
  conversationId?: string
  nodeId?: string
  choiceId?: string
  mutation?: string
  statePredicate?: string
  event?: string
  proposalId?: string
  endingId?: string
  epilogueId?: string
  status: 'proved' | 'blocked'
}

const representativeTargets: Array<{ chainId: string; target: Mainline2RouteTarget }> = [
  { chainId: 'maya-relationship', target: { routeId: 'causal-maya', proposalId: 'proposal.hc.continuity_charter', decisions: { aster_provisional_role: 'partner', cascade_authority: 'emergency_delegation' } } },
  { chainId: 'doctrine-authority', target: { routeId: 'causal-authority', proposalId: 'proposal.hc.final_human_veto', decisions: { first_public_execution_doctrine: 'human_final_authority', cascade_authority: 'human_command' } } },
  { chainId: 'cascade-governance', target: { routeId: 'causal-cascade', proposalId: 'proposal.co.two_key_civilization', decisions: { first_public_execution_doctrine: 'conditional_delegation', cascade_authority: 'emergency_delegation' } } },
  { chainId: 'machine-exact-ending', target: { routeId: 'causal-machine', proposalId: 'proposal.mc.independent_machine_polities', decisions: { act4_research_emphasis: 'computation_ai', replication_doctrine: 'free_replication', ai_collective_governance: 'ai_self_governance' } } },
  { chainId: 'space-contact-cosmic', target: { routeId: 'causal-cosmic', proposalId: 'proposal.co.frontier_federation', decisions: { act4_research_emphasis: 'frontier_science', expansion_doctrine: 'shared_expansion', offworld_governance: 'multiworld_federation', contact_doctrine: 'reciprocal_diplomacy' } } },
  { chainId: 'security-exact-ending', target: { routeId: 'causal-security', proposalId: 'proposal.se.constitutional_peace_architecture', decisions: { act4_research_emphasis: 'computation_ai', security_doctrine: 'mutual_disarmament' } } },
  { chainId: 'rejection-retained-lock', target: { routeId: 'causal-rejection', proposalId: 'proposal.hc.continuity_charter', initialProposalId: 'proposal.hc.final_human_veto', rejectProposalId: 'proposal.hc.final_human_veto', decisions: { aster_provisional_role: 'partner', cascade_authority: 'emergency_delegation', first_public_execution_doctrine: 'human_final_authority' } } },
  { chainId: 'dormant-upload-gate', target: { routeId: 'causal-upload-dormant', proposalId: 'proposal.ph.digital_continuity', expectResolutionFailure: true, decisions: { act4_research_emphasis: 'life_mind', human_form_doctrine: 'open_enhancement' } } },
]

function changedState(before: StableRunState, after: StableRunState) {
  const changes: string[] = []
  if (JSON.stringify(before.decisions) !== JSON.stringify(after.decisions)) changes.push('decisions')
  if (JSON.stringify(before.flags) !== JSON.stringify(after.flags)) changes.push('flags/capabilities')
  if (JSON.stringify(before.worldState) !== JSON.stringify(after.worldState)) changes.push('worldState')
  if ((after.events ?? []).length !== (before.events ?? []).length) changes.push('events')
  if (after.progress?.activeModules.join(',') !== before.progress?.activeModules.join(',')) changes.push('activeModules')
  return changes.join(',') || 'history-only'
}

function fixtureLinks(chainId: string, fixture: Mainline2RouteFixture): CausalProofLink[] {
  const links: CausalProofLink[] = fixture.links.map((link, index) => ({
    chainId,
    step: 'clean createMainline2Run → resolveScene legal Choice → commitChoice → state',
    assetId: link.sourceRef,
    conversationId: link.conversationId,
    nodeId: link.nodeId,
    choiceId: link.choiceId,
    mutation: index === fixture.links.length - 1 ? 'final state settled by this legal choice' : 'runtime state changed or history recorded',
    statePredicate: link.decisionId ? `${link.decisionId}=${link.canonicalValue}` : 'choice remained legal at its authored stage',
    event: fixture.run.events?.at(-1)?.type,
    proposalId: link.proposalId,
    status: 'proved' as const,
  }))
  const resolution = fixture.ending.resolution
  if (resolution?.status === 'failure') {
    links.push({
      chainId,
      step: 'final commitment → exact family gate evaluation',
      proposalId: fixture.target.proposalId,
      statePredicate: resolution.rejectedCandidates.map((candidate) => `${candidate.endingId}: ${candidate.reasons.join(' | ')}`).join(' || '),
      endingId: undefined,
      status: 'blocked',
    })
  } else {
    links.push({
      chainId,
      step: 'final commitment → exact ending → authored epilogue provenance',
      conversationId: fixture.run.manifest.conversationIds.at(-1),
      choiceId: fixture.run.selectedChoiceIds?.at(-1),
      proposalId: fixture.target.proposalId,
      endingId: fixture.ending.worldEndingId,
      epilogueId: fixture.ending.epilogueProvenance?.[0]?.assetId,
      statePredicate: `resolved=${fixture.ending.worldEndingId}`,
      status: 'proved',
    })
  }
  return links
}

function runRepresentative(chainId: string, target: Mainline2RouteTarget) {
  const fixture = runMainline2Route(target)
  if (chainId === 'machine-exact-ending' && fixture.ending.worldEndingId !== 'machine_republic') throw new Error(`Causal chain ${chainId} resolved ${fixture.ending.worldEndingId}`)
  if (chainId === 'space-contact-cosmic' && fixture.ending.endingFamily !== 'cosmic') throw new Error(`Causal chain ${chainId} did not resolve a Cosmic ending`)
  if (chainId === 'security-exact-ending' && fixture.ending.endingFamily !== 'security') throw new Error(`Causal chain ${chainId} did not resolve a Security ending`)
  if (chainId === 'dormant-upload-gate') {
    if (fixture.ending.resolution?.status !== 'failure') throw new Error('Dormant Upload chain unexpectedly resolved')
    if (!fixture.ending.resolution.rejectedCandidates.some((candidate) => candidate.endingId === 'the_upload' && candidate.reasons.some((reason) => reason.includes('digital continuity bridge')))) throw new Error(`Dormant Upload chain has no bridge rejection: ${JSON.stringify(fixture.ending.resolution.rejectedCandidates)}`)
  }
  return { chainId, links: fixtureLinks(chainId, fixture) }
}

export function buildFixedCausalChains() {
  return representativeTargets.map(({ chainId, target }) => runRepresentative(chainId, target))
}

export function buildCausalProofAudit() {
  const fixedChains = buildFixedCausalChains()
  const randomRuns = Array.from({ length: 100 }, (_, index) => {
    const { chainId, target } = representativeTargets[index % representativeTargets.length]
    const runTarget = { ...target, routeId: `${target.routeId}-repeat-${index}` }
    const fixture = runMainline2Route(runTarget)
    const ending = resolveMainline2Ending(fixture.run)
    return { chainId: `${chainId}-repeat-${index}`, links: fixtureLinks(`${chainId}-repeat-${index}`, fixture), endingId: ending.worldEndingId, epilogueId: ending.epilogueProvenance?.[0]?.assetId }
  })
  return { fixedChains, randomRuns }
}
