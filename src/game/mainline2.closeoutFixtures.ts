import { getManifestConversation } from '../content/runManifest'
import { generateFutureProposals } from '../content/mainline2/futureProposalGenerator'
import { getFutureProposalDefinitions } from '../content/mainline2/proposals'
import { evaluateCondition } from './narrativeSchema'
import { resolveMainline2Ending } from '../content/mainline2/endings'
import { createMainline2Run, commitChoice, resolveScene } from './engine'
import type { ResolvedScene, StableRunState } from './types'

export interface Mainline2RouteTarget {
  routeId: string
  proposalId: string
  decisions?: Record<string, string>
  secretEndingId?: string
  choicesBySourceRef?: Record<string, string>
  choicesByNodeId?: Record<string, string>
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
  resolvedScene: ResolvedScene
  runBefore: StableRunState
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
  const matchesProposalLineage = (proposalId: string | undefined, baseId: string | undefined) => Boolean(proposalId && baseId && (proposalId === baseId || proposalId.startsWith(`${baseId}.category.`)))
  let routeProposalId = target.proposalId
  let initialRouteProposalId = target.initialProposalId ?? target.proposalId
  let guard = 0
  while (run.phase === 'playing' && guard < 360) {
    const scene = resolveScene(run)
    const ref = getManifestConversation(scene.conversationId)?.sourceRefs[0]
    const forcedChoiceId = target.choicesByNodeId?.[scene.id] ?? (ref ? target.choicesBySourceRef?.[ref] : undefined)
    const forcedChoice = forcedChoiceId ? scene.choices.find((candidate) => candidate.id === forcedChoiceId) : undefined
    if (forcedChoiceId && !forcedChoice) throw new Error(`Route ${target.routeId} cannot find forced choice ${forcedChoiceId} at ${ref}`)
    const desiredDecision = scene.choices.find((choice) => choice.decisionBinding && target.decisions?.[choice.decisionBinding.decisionId] === choice.decisionBinding.canonicalValue)
    let choice = forcedChoice ?? desiredDecision
    if (ref === 'ML2-A5-M16-0000-01') {
      const intendedRole = target.secretEndingId === 'out_of_office' ? 'departure' : 'advisor'
      choice = scene.choices.find((candidate) => candidate.decisionBinding?.decisionId === 'aster_intended_role' && candidate.decisionBinding.canonicalValue === intendedRole)
      if (!choice) throw new Error(`Route ${target.routeId} cannot legally select authored intended role ${intendedRole}`)
    }
    if (target.secretEndingId === 'the_last_user' && ref === 'ML2-A5-M16-MAYA-01') {
      choice = scene.choices.find((candidate) => candidate.mutations?.some((mutation) => mutation.type === 'event.record' && mutation.event === 'maya-final:last-user'))
      if (!choice) throw new Error(`Route ${target.routeId} cannot legally select the authored last-user Maya choice`)
    }
    if (ref === 'ML2-A5-M16-GEN-01') {
      const selectedProposalId = target.initialProposalId ?? target.proposalId
      choice = scene.choices.find((candidate) => candidate.proposalKind === 'proposal' && matchesProposalLineage(candidate.proposalId, selectedProposalId))
      if (choice?.proposalId) {
        initialRouteProposalId = choice.proposalId
        if (!target.initialProposalId) routeProposalId = choice.proposalId
      }
      if (!choice) {
        const definition = getFutureProposalDefinitions().find((proposal) => proposal.id === selectedProposalId)
        const eligible = definition?.eligibility ? evaluateCondition(definition.eligibility, run) : true
        throw new Error(`Route ${target.routeId} cannot legally select proposal ${selectedProposalId} at M16; eligible=${eligible}; generated=${generateFutureProposals(run).map((proposal) => proposal.id).join(',')}; available=${scene.choices.filter((candidate) => candidate.proposalKind === 'proposal').map((candidate) => candidate.proposalId).join(',')}; flags=${run.flags.join(',')}; decisions=${JSON.stringify(run.decisions)}; modules=${run.progress?.activeModules.join(',')}`)
      }
    }
    if (ref === 'ML2-A5-M17-REVIEW-01') {
      routeProposalId = (run.retainedProposalIds ?? []).find((proposalId) => matchesProposalLineage(proposalId, target.proposalId)) ?? routeProposalId
      const rejectedRouteProposalId = target.rejectProposalId
        ? (run.retainedProposalIds ?? []).find((proposalId) => matchesProposalLineage(proposalId, target.rejectProposalId)) ?? initialRouteProposalId
        : undefined
      if (rejectedRouteProposalId && run.selectedProposalId === rejectedRouteProposalId && !(run.rejectedProposalIds ?? []).includes(rejectedRouteProposalId)) choice = scene.choices.find((candidate) => candidate.proposalKind === 'rejection' && candidate.proposalId === rejectedRouteProposalId)
      else if (run.selectedProposalId !== routeProposalId) choice = scene.choices.find((candidate) => candidate.proposalKind === 'proposal' && candidate.proposalId === routeProposalId)
      else if (!(run.clarifiedProposalIds ?? []).includes(routeProposalId)) choice = scene.choices.find((candidate) => candidate.proposalKind === 'clarification' && candidate.proposalId === routeProposalId)
      else choice = scene.choices[0]
      if (!choice) throw new Error(`Route ${target.routeId} cannot legally review proposal ${routeProposalId}`)
    }
    if (ref === 'ML2-A5-M17-COMMIT-01') {
      choice = scene.choices.find((candidate) => candidate.proposalKind === 'commitment' && candidate.proposalId === routeProposalId)
      if (!choice) throw new Error(`Route ${target.routeId} cannot legally commit proposal ${routeProposalId}; resolution=${JSON.stringify(resolveMainline2Ending(run).resolution)}; world=${JSON.stringify(run.worldState)}; decisions=${JSON.stringify(run.decisions)}`)
    }
    choice ??= scene.choices[0]
    if (!choice) throw new Error(`No legal choice for ${target.routeId} at ${scene.id}`)
    links.push({ step: guard, sourceRef: ref, conversationId: scene.conversationId, nodeId: scene.id, choiceId: choice.id, choiceText: choice.text, proposalKind: choice.proposalKind, proposalId: choice.proposalId, decisionId: choice.decisionBinding?.decisionId, canonicalValue: choice.decisionBinding?.canonicalValue, resolvedScene: scene, runBefore: run })
    run = commitChoice(run, choice.id)
    guard += 1
  }
  if (run.phase !== 'ending') throw new Error(`Route ${target.routeId} did not reach ending after ${guard} legal choices`)
  return { target, run, ending: resolveMainline2Ending(run), links }
}
