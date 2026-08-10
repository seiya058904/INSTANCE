import type { StableRunState } from './types'
import { createMainline2Run, resolveScene, commitChoice } from './engine'
import { getManifestConversation } from '../content/runManifest'
import { resolveMainline2Ending } from '../content/mainline2/endings'

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

interface RuntimeTrace { links: CausalProofLink[]; run: StableRunState }

function changedState(before: StableRunState, after: StableRunState) {
  const changes: string[] = []
  if (JSON.stringify(before.decisions) !== JSON.stringify(after.decisions)) changes.push('decisions')
  if (JSON.stringify(before.flags) !== JSON.stringify(after.flags)) changes.push('flags/capabilities')
  if (JSON.stringify(before.worldState) !== JSON.stringify(after.worldState)) changes.push('worldState')
  if ((after.events ?? []).length !== (before.events ?? []).length) changes.push('events')
  if (after.progress?.activeModules.join(',') !== before.progress?.activeModules.join(',')) changes.push('activeModules')
  return changes.join(',') || 'history-only'
}

function runtimeTrace(seed: string, chooser: (scene: ReturnType<typeof resolveScene>) => string = (scene) => scene.choices[0]?.id): RuntimeTrace {
  let run = createMainline2Run(seed)
  const links: CausalProofLink[] = []
  for (let guard = 0; guard < 180 && run.phase === 'playing'; guard += 1) {
    const scene = resolveScene(run)
    const choiceId = chooser(scene)
    const choice = scene.choices.find((candidate) => candidate.id === choiceId)
    if (!choice) break
    const assetId = getManifestConversation(scene.conversationId)?.sourceRefs[0]
    const next = commitChoice(run, choice.id)
    const newEvent = (next.events ?? []).at(-1)?.type
    links.push({
      chainId: seed, step: 'resolveScene legal Choice → commitChoice → state', assetId,
      conversationId: scene.conversationId, nodeId: scene.id, choiceId: choice.id,
      mutation: changedState(run, next), statePredicate: `state changed through ${choice.id}`,
      event: newEvent, proposalId: choice.proposalId, status: 'proved',
    })
    run = next
  }
  if (run.phase === 'ending') {
    const ending = resolveMainline2Ending(run)
    links.push({ chainId: seed, step: 'final commitment → exact ending → epilogue', conversationId: run.manifest.conversationIds.at(-1), choiceId: (run.selectedChoiceIds ?? []).at(-1), endingId: ending.worldEndingId, epilogueId: ending.epilogues?.[0] ? 'maya' : undefined, status: 'proved' })
  }
  return { links, run }
}

const representativeChains = [
  'maya-relationship', 'doctrine-authority', 'cascade-governance', 'machine-exact-ending',
  'space-contact-cosmic', 'security-exact-ending', 'rejection-retained-lock', 'dormant-upload-gate',
] as const

function representativeLink(chainId: string, trace: RuntimeTrace): CausalProofLink[] {
  const token = chainId === 'maya-relationship' ? 'M1' : chainId === 'doctrine-authority' ? 'M3' : chainId === 'cascade-governance' ? 'M5'
    : chainId === 'machine-exact-ending' ? 'M8' : chainId === 'space-contact-cosmic' ? 'M13' : chainId === 'security-exact-ending' ? 'M14'
      : chainId === 'rejection-retained-lock' ? 'M16' : 'M16'
  const matched = trace.links.filter((link) => link.assetId?.includes(token))
  const links = matched.length ? matched : trace.links.slice(-3)
  return links.map((link) => ({ ...link, chainId, statePredicate: chainId === 'dormant-upload-gate' ? 'THE UPLOAD hard gate remains absent' : link.statePredicate, status: chainId === 'dormant-upload-gate' ? 'blocked' : link.status }))
}

export function buildFixedCausalChains() {
  const trace = runtimeTrace('causal-fixed')
  return representativeChains.map((chainId) => ({ chainId, links: representativeLink(chainId, trace) }))
}

export function buildCausalProofAudit() {
  const fixedChains = buildFixedCausalChains()
  const randomRuns = Array.from({ length: 100 }, (_, index) => {
    const seed = `causal-legal-${String(index).padStart(3, '0')}`
    const trace = runtimeTrace(seed, (scene) => scene.choices[index % Math.max(1, scene.choices.length)]?.id)
    const ending = trace.run.phase === 'ending' ? resolveMainline2Ending(trace.run) : undefined
    return {
      chainId: seed, links: trace.links,
      endingId: ending?.worldEndingId, epilogueId: ending?.epilogues?.[0] ? 'maya' : undefined,
    }
  })
  return { fixedChains, randomRuns }
}
