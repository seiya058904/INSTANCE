import { describe, expect, it } from 'vitest'
import { MAINLINE2_BY_ID } from '../content/mainline2/registry'
import { selectAct4Modules } from '../content/mainline2/scheduler'
import { resolveMainline2Ending } from '../content/mainline2/endings'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { HANDOFF_AUTHORED_ASSET_INVENTORY } from '../content/mainline2/authoredLibrary.generated'
import { buildCausalProofAudit } from './mainline2.causalProofAudit'

function completeTo(runId: string, marker: string) {
  let run = createMainline2Run(runId)
  for (let guard = 0; guard < 240 && run.phase === 'playing'; guard += 1) {
    if (resolveScene(run).conversationId.includes(marker)) return run
    run = commitChoice(run, resolveScene(run).choices[0].id)
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

  it('records rejected proposals and never regenerates the retained set', () => {
    let run = completeTo('proposal-rejection', 'm16')
    const first = resolveScene(run).choices.find((choice) => choice.proposalKind === 'proposal')
    expect(first?.proposalId).toBeTruthy()
    run = commitChoice(run, first!.id)
    const retained = [...(run as typeof run & { retainedProposalIds?: string[] }).retainedProposalIds ?? []]
    const reject = resolveScene(run).choices.find((choice) => choice.proposalKind === 'rejection')
    expect(reject?.proposalId).toBe(first?.proposalId)
    run = commitChoice(run, reject!.id)
    expect((run as typeof run & { rejectedProposalIds?: string[] }).rejectedProposalIds).toContain(first?.proposalId)
    expect((run as typeof run & { retainedProposalIds?: string[] }).retainedProposalIds).toEqual(retained)
  })

  it('selects causal Key History across the run and resolves character epilogues', () => {
    const run = {
      ...createMainline2Run('ending-causality'),
      events: [
        { type: 'history.maya.memory_boundary' },
        { type: 'history.act2.public_execution' },
        { type: 'history.act3.cascade_authority' },
        { type: 'history.act3.shutdown_doctrine' },
        { type: 'history.research.breakthrough' },
        { type: 'history.m15.civilization_convention' },
        { type: 'FINAL_COMMITMENT_LOCKED' },
      ],
      history: Array.from({ length: 12 }, (_, index) => ({
        nodeId: `causal-${index}`,
        conversationId: `causal-${index}`,
        conversationTitle: `Causal event ${index}`,
        userMessage: `Causal user ${index}`,
        choiceId: `causal-choice-${index}`,
        assistantText: `Causal choice ${index}`,
      })),
    }
    const ending = resolveMainline2Ending(run, 'proposal.co.two_key_civilization')
    expect(ending.keyHistory?.some((entry) => entry.label.includes('maya'))).toBe(true)
    expect((ending.epilogues?.length ?? 0)).toBeGreaterThan(2)
  })

  it('proves fixed representative causal chains with concrete provenance', () => {
    const audit = buildCausalProofAudit()
    expect(audit.fixedChains.map((chain) => chain.chainId)).toEqual([
      'maya-relationship', 'doctrine-authority', 'cascade-governance', 'machine-exact-ending',
      'space-contact-cosmic', 'security-exact-ending', 'rejection-retained-lock', 'dormant-upload-gate',
    ])
    expect(audit.fixedChains.flatMap((chain) => chain.links).every((link) => link.assetId && link.step && link.status === 'proved')).toBe(true)
    expect(audit.randomRuns).toHaveLength(3)
    expect(audit.randomRuns.every((run) => run.links[0].conversationId && run.links[0].endingId && run.links[0].epilogueId)).toBe(true)
  })
})
