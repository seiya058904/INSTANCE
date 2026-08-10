import { describe, expect, it } from 'vitest'
import { MAINLINE2_BY_ID } from '../content/mainline2/registry'
import { getManifestConversation } from '../content/runManifest'
import { selectAct4Modules } from '../content/mainline2/scheduler'
import { resolveMainline2Ending } from '../content/mainline2/endings'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { HANDOFF_AUTHORED_ASSET_INVENTORY } from '../content/mainline2/authoredLibrary.generated'
import { buildCausalProofAudit } from './mainline2.causalProofAudit'
import { decisionBindingsForConversation, validateDecisionBindings } from '../content/mainline2/decisionBindings'

function completeTo(runId: string, marker: string) {
  let run = createMainline2Run(runId)
  for (let guard = 0; guard < 240 && run.phase === 'playing'; guard += 1) {
    if (resolveScene(run).conversationId.includes(marker)) return run
    run = commitChoice(run, resolveScene(run).choices[0].id)
  }
  return run
}

function completeToSourceRef(runId: string, sourceRef: string) {
  let run = createMainline2Run(runId)
  for (let guard = 0; guard < 240 && run.phase === 'playing'; guard += 1) {
    const scene = resolveScene(run)
    if (getManifestConversation(scene.conversationId)?.sourceRefs.includes(sourceRef)) return run
    run = commitChoice(run, scene.choices[0].id)
  }
  return run
}

function advanceToSourceRef(run: ReturnType<typeof createMainline2Run>, sourceRef: string) {
  for (let guard = 0; guard < 240 && run.phase === 'playing'; guard += 1) {
    const scene = resolveScene(run)
    if (getManifestConversation(scene.conversationId)?.sourceRefs.includes(sourceRef)) return run
    run = commitChoice(run, scene.choices[0].id)
  }
  return run
}

describe('Mainline 2.0 causality fixes', () => {
  it('preserves every authored major-decision option as a distinct runtime choice', () => {
    const asset = HANDOFF_AUTHORED_ASSET_INVENTORY.find((item) => item.assetId === 'ML2-A2-M3-DECISION-01')
    expect(asset?.nodeIds.length).toBeGreaterThan(0)
    const conversation = [...MAINLINE2_BY_ID.values()].find((item) => item.sourceRefs.includes('ML2-A2-M3-DECISION-01'))
    expect(conversation?.nodes.flatMap((node) => node.choices).length).toBe(4)
    expect(conversation?.nodes[0]?.id).not.toContain('narrative')
  })
  it('uses explicit Choice IDs and approved fingerprints for Decision bindings', () => {
    const conversation = [...MAINLINE2_BY_ID.values()].find((item) => item.sourceRefs.includes('ML2-A2-M3-DECISION-01'))!
    const bindings = decisionBindingsForConversation(conversation)
    expect(bindings).toHaveLength(4)
    expect(new Set(bindings.map((binding) => binding.choiceId)).size).toBe(4)
    expect(bindings.every((binding) => binding.choiceTextHash && binding.canonicalValue && binding.historyEvent && binding.callbackConsumer)).toBe(true)
    const altered = {
      ...conversation,
      nodes: conversation.nodes.map((node) => ({ ...node, choices: node.choices.map((choice, index) => index === 0 ? { ...choice, text: `${choice.text} changed` } : choice) })),
    }
    expect(validateDecisionBindings(altered).some((error) => error.includes('fingerprint'))).toBe(true)
  })
  it('maps M15 ROLE choices to provisional role, never intended role', () => {
    const conversation = [...MAINLINE2_BY_ID.values()].find((item) => item.sourceRefs.includes('ML2-A4-M15-ROLE-01'))
    expect(conversation).toBeTruthy()
    const mutations = conversation!.nodes.flatMap((node) => node.choices.flatMap((choice) => choice.mutations ?? []))
    expect(mutations.some((mutation) => mutation.type === 'decision.set' && mutation.decisionId === 'aster_provisional_role')).toBe(true)
    expect(mutations.some((mutation) => mutation.type === 'decision.set' && mutation.decisionId === 'aster_intended_role')).toBe(false)
  })

  it('does not activate CONTACT without the SPACE frontier bridge', () => {
    const result = selectAct4Modules({
      runId: 'contact-negative',
      flags: ['cap.autonomous_research'],
      events: [],
      decisions: { act4_research_emphasis: 'frontier_science' },
      worldState: { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 },
    })
    expect(result.primaryModules).not.toContain('contact')
    expect(result.activeModules).not.toContain('contact')
  })
  it('uses research emphasis and thresholded secondary module activation', () => {
    const base = { runId: 'research-scoring', flags: [], events: [], decisions: {}, worldState: { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 } }
    const baseline = selectAct4Modules(base)
    const computation = selectAct4Modules({ ...base, decisions: { act4_research_emphasis: 'computation_ai' } })
    const frontier = selectAct4Modules({ ...base, decisions: { act4_research_emphasis: 'frontier_science' } })
    expect(computation.audit.find((entry) => entry.module === 'machine')!.score).toBeGreaterThan(baseline.audit.find((entry) => entry.module === 'machine')!.score)
    expect(frontier.audit.find((entry) => entry.module === 'space')!.score).toBeGreaterThan(baseline.audit.find((entry) => entry.module === 'space')!.score)
    expect(selectAct4Modules(base).activeModules).toHaveLength(2)
  })

  it('only exposes dynamic proposal choices at the exact authored stages', () => {
    const preGenerator = completeTo('proposal-stage', 'm16')
    const scene = resolveScene(preGenerator)
    const sourceRef = MAINLINE2_BY_ID.get(scene.conversationId)?.sourceRefs[0]
    if (sourceRef !== 'ML2-A5-M16-GEN-01') expect(scene.choices.some((choice) => choice.proposalKind)).toBe(false)
  })

  it('records rejected proposals and never regenerates the retained set', () => {
    let run = completeToSourceRef('proposal-rejection', 'ML2-A5-M16-GEN-01')
    const first = resolveScene(run).choices.find((choice) => choice.proposalKind === 'proposal')
    expect(first?.proposalId).toBeTruthy()
    run = commitChoice(run, first!.id)
    const retained = [...(run as typeof run & { retainedProposalIds?: string[] }).retainedProposalIds ?? []]
    run = advanceToSourceRef(run, 'ML2-A5-M17-REVIEW-01')
    const review = resolveScene(run).choices.find((choice) => choice.proposalKind === 'proposal' && choice.proposalId === first?.proposalId)
    expect(review).toBeTruthy()
    run = commitChoice(run, review!.id)
    const reject = resolveScene(run).choices.find((choice) => choice.proposalKind === 'rejection')
    expect(reject?.proposalId).toBe(first?.proposalId)
    run = commitChoice(run, reject!.id)
    expect((run as typeof run & { rejectedProposalIds?: string[] }).rejectedProposalIds).toContain(first?.proposalId)
    expect((run as typeof run & { retainedProposalIds?: string[] }).retainedProposalIds).toEqual(retained)
  })

  it('does not resolve a public ending from a raw ending ID or synthetic history', () => {
    const run = createMainline2Run('ending-causality')
    const ending = resolveMainline2Ending(run)
    expect(ending.worldEndingId).toBeUndefined()
    expect(ending.keyHistory).toEqual([])
  })

  it('proves fixed representative causal chains with concrete provenance', () => {
    const audit = buildCausalProofAudit()
    expect(audit.fixedChains.map((chain) => chain.chainId)).toEqual([
      'maya-relationship', 'doctrine-authority', 'cascade-governance', 'machine-exact-ending',
      'space-contact-cosmic', 'security-exact-ending', 'rejection-retained-lock', 'dormant-upload-gate',
    ])
    expect(audit.fixedChains.flatMap((chain) => chain.links).filter((link) => link.step.startsWith('clean')).every((link) => link.conversationId && link.choiceId && link.step)).toBe(true)
    expect(audit.fixedChains.find((chain) => chain.chainId === 'machine-exact-ending')?.links.some((link) => link.endingId === 'machine_republic' && link.status === 'proved')).toBe(true)
    expect(audit.fixedChains.find((chain) => chain.chainId === 'space-contact-cosmic')?.links.some((link) => link.endingId === 'first_accord' && link.status === 'proved')).toBe(true)
    expect(audit.fixedChains.find((chain) => chain.chainId === 'security-exact-ending')?.links.some((link) => link.endingId === 'peace_in_our_time' && link.status === 'proved')).toBe(true)
    expect(audit.fixedChains.find((chain) => chain.chainId === 'rejection-retained-lock')?.links.some((link) => link.status === 'proved' && link.statePredicate?.includes('resolved=the_commonwealth'))).toBe(true)
    expect(audit.fixedChains.find((chain) => chain.chainId === 'dormant-upload-gate')?.links.some((link) => link.status === 'blocked' && link.statePredicate?.includes('the_upload') && link.statePredicate?.includes('digital continuity bridge'))).toBe(true)
    expect(audit.randomRuns).toHaveLength(100)
    expect(audit.randomRuns.every((run) => run.links.length > 0 && run.links.filter((link) => link.step.startsWith('clean')).every((link) => link.conversationId && link.choiceId))).toBe(true)
  }, 60000)
})
