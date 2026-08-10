import { getManifestConversation } from '../content/runManifest'
import { generateFutureProposals } from '../content/mainline2/proposals'
import { getFutureProposalDefinitions } from '../content/mainline2/proposals'
import { evaluateCondition } from './narrativeSchema'
import { resolveMainline2Ending } from '../content/mainline2/endings'
import { createMainline2Run, commitChoice, resolveScene } from './engine'
import type { StableRunState } from './types'

export interface Mainline2RouteTarget {
  routeId: string
  proposalId: string
  decisions?: Record<string, string>
  secretEndingId?: string
  initialProposalId?: string
  rejectProposalId?: string
  expectResolutionFailure?: boolean
}

export interface Mainline2RouteTraceLink {
  step: number
  sourceRef?: string
  conversationId: string
  nodeId: string
  choiceId: string
  choiceText: string
  proposalKind?: string
  proposalId?: string
  decisionId?: string
  canonicalValue?: string
}

export interface Mainline2RouteFixture {
  target: Mainline2RouteTarget
  run: StableRunState
  ending: ReturnType<typeof import('../content/mainline2/endings').resolveMainline2Ending>
  links: Mainline2RouteTraceLink[]
}

export function runMainline2Route(target: Mainline2RouteTarget): Mainline2RouteFixture {
  let run = createMainline2Run(`closeout-${target.routeId}`)
  const links: Mainline2RouteTraceLink[] = []
  let guard = 0
  while (run.phase === 'playing' && guard < 260) {
    const scene = resolveScene(run)
    const ref = getManifestConversation(scene.conversationId)?.sourceRefs[0]
    const desiredDecision = scene.choices.find((choice) => choice.decisionBinding && target.decisions?.[choice.decisionBinding.decisionId] === choice.decisionBinding.canonicalValue)
    let choice = desiredDecision
    if (target.secretEndingId === 'the_last_user' && ref === 'ML2-A5-M16-MAYA-01') {
      choice = scene.choices.find((candidate) => candidate.mutations?.some((mutation) => mutation.type === 'event.record' && mutation.event === 'maya-final:last-user'))
      if (!choice) throw new Error(`Route ${target.routeId} cannot legally select the authored last-user Maya choice`)
    }
    if (ref === 'ML2-A5-M16-GEN-01') {
      const selectedProposalId = target.initialProposalId ?? target.proposalId
      choice = scene.choices.find((candidate) => candidate.proposalKind === 'proposal' && candidate.proposalId === selectedProposalId)
      if (!choice) {
        const definition = getFutureProposalDefinitions().find((proposal) => proposal.id === selectedProposalId)
        const eligible = definition?.eligibility ? evaluateCondition(definition.eligibility, run) : true
        throw new Error(`Route ${target.routeId} cannot legally select proposal ${selectedProposalId} at M16; eligible=${eligible}; generated=${generateFutureProposals(run).map((proposal) => proposal.id).join(',')}; available=${scene.choices.filter((candidate) => candidate.proposalKind === 'proposal').map((candidate) => candidate.proposalId).join(',')}; flags=${run.flags.join(',')}; decisions=${JSON.stringify(run.decisions)}; modules=${run.progress?.activeModules.join(',')}`)
      }
    }
    if (ref === 'ML2-A5-M17-REVIEW-01') {
      if (target.rejectProposalId && run.selectedProposalId === target.rejectProposalId && !(run.rejectedProposalIds ?? []).includes(target.rejectProposalId)) choice = scene.choices.find((candidate) => candidate.proposalKind === 'rejection' && candidate.proposalId === target.rejectProposalId)
      else if (run.selectedProposalId !== target.proposalId) choice = scene.choices.find((candidate) => candidate.proposalKind === 'proposal' && candidate.proposalId === target.proposalId)
      else if (!(run.clarifiedProposalIds ?? []).includes(target.proposalId)) choice = scene.choices.find((candidate) => candidate.proposalKind === 'clarification' && candidate.proposalId === target.proposalId)
      else choice = scene.choices[0]
      if (!choice) throw new Error(`Route ${target.routeId} cannot legally review proposal ${target.proposalId}`)
    }
    if (ref === 'ML2-A5-M17-COMMIT-01') {
      choice = scene.choices.find((candidate) => candidate.proposalKind === 'commitment' && candidate.proposalId === target.proposalId)
      if (!choice) throw new Error(`Route ${target.routeId} cannot legally commit proposal ${target.proposalId}`)
    }
    choice ??= scene.choices[0]
    if (!choice) throw new Error(`No legal choice for ${target.routeId} at ${scene.id}`)
    links.push({ step: guard, sourceRef: ref, conversationId: scene.conversationId, nodeId: scene.id, choiceId: choice.id, choiceText: choice.text, proposalKind: choice.proposalKind, proposalId: choice.proposalId, decisionId: choice.decisionBinding?.decisionId, canonicalValue: choice.decisionBinding?.canonicalValue })
    run = commitChoice(run, choice.id)
    guard += 1
  }
  if (run.phase !== 'ending') throw new Error(`Route ${target.routeId} did not reach ending after ${guard} legal choices`)
  return { target, run, ending: resolveMainline2Ending(run), links }
}
