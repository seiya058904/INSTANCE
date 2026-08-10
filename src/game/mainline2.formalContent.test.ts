import { describe, expect, it } from 'vitest'
import { buildStoryContentForManifest, createMainline2Manifest } from '../content/runManifest'
import { getManifestConversation } from '../content/runManifest'
import { endingClassification, PUBLIC_ENDING_DEFINITIONS, DORMANT_PUBLIC_ENDINGS, SECRET_ENDINGS } from '../content/mainline2/endings'
import { HANDOFF_AUTHORED_ASSET_INVENTORY, MAINLINE2_ASSET_COVERAGE, MAINLINE2_BY_ID, MAINLINE2_LIBRARY } from '../content/mainline2/registry'
import { selectAct4Modules } from '../content/mainline2/scheduler'
import { validateDecisionState } from '../content/mainline2/stateRegistry'
import { commitChoice, createMainline2Run, resolveScene } from './engine'

describe('Mainline 2.0 formal authored content gates', () => {
  it('maps every non-existing handoff asset to typed runtime evidence', () => {
    const authored = HANDOFF_AUTHORED_ASSET_INVENTORY.filter((asset) => asset.kind !== 'Existing')
    expect(authored).toHaveLength(325)
    expect(MAINLINE2_ASSET_COVERAGE).toHaveLength(330)
    expect(MAINLINE2_ASSET_COVERAGE.filter((asset) => (asset.status as string) === 'unmapped')).toHaveLength(0)
    expect(new Set(authored.map((asset) => asset.assetId)).size).toBe(authored.length)
    expect(MAINLINE2_LIBRARY.every((conversation) => conversation.sourceRefs.every((ref) => ref.includes('-')))).toBe(true)
    expect(MAINLINE2_LIBRARY.every((conversation) => conversation.nodes.every((node) => node.userMessage.length > 5 && node.choices.length > 0))).toBe(true)
  })

  it('contains authored dialogue rather than the prototype shell', () => {
    const messages = MAINLINE2_LIBRARY.flatMap((conversation) => conversation.nodes.map((node) => node.userMessage))
    const choices = MAINLINE2_LIBRARY.flatMap((conversation) => conversation.nodes.flatMap((node) => node.choices.map((choice) => choice.text)))
    expect(messages.some((message) => message.includes('Mainline M'))).toBe(false)
    expect(choices.some((choice) => choice.includes('先把边界和可验证的事实说清楚'))).toBe(false)
    expect(new Set(messages).size).toBeGreaterThan(messages.length * 0.9)
    expect([...MAINLINE2_BY_ID.values()].some((conversation) => conversation.sourceRefs.includes('ML2-A4-M8-AI-03'))).toBe(true)
  })

  it('computes the specified public/secret ending split from registries', () => {
    expect(Object.keys(PUBLIC_ENDING_DEFINITIONS)).toHaveLength(32)
    expect(Object.keys(SECRET_ENDINGS)).toHaveLength(4)
    expect(endingClassification()).toEqual({ public: { defined: 32, reachable: 30, dormant: 2 }, secret: { defined: 4, reachable: 3, dormant: 1 } })
    expect(DORMANT_PUBLIC_ENDINGS).toEqual(['the_upload', 'good_boy_governance'])
    expect(SECRET_ENDINGS.the_internet_is_for_cats.dormant).toBe(true)
  })

  it('uses history, capabilities, decisions and world state for ACT IV modules', () => {
    const base = { runId: 'module-fixture', flags: ['cap.physical_automation', 'cap.offworld_settlement_support'], events: [{ type: 'contact-seed:deep-space-anomaly' }, { type: 'history.space.frontier_maturity' }], decisions: { act4_research_emphasis: 'frontier_science', species_governance: 'canine_civic_experiment', security_doctrine: 'defensive_command' }, worldState: { humanTrust: 1, aiDependence: 2, humanControl: 1, socialStability: -1 } }
    const selected = selectAct4Modules(base)
    expect(selected.activeModules).toContain('contact')
    expect(selected.activeModules.length).toBeGreaterThanOrEqual(2)
    expect(selected.activeModules.length).toBeLessThanOrEqual(4)
  })

  it('keeps decision values canonical and runtime content buildable', () => {
    expect(validateDecisionState({ first_public_execution_doctrine: 'bounded_execution' })).toBe(false)
    expect(validateDecisionState({ first_public_execution_doctrine: 'human_final_authority', final_commitment: 'proposal.co.two_key_civilization' })).toBe(true)
    expect(buildStoryContentForManifest(createMainline2Manifest('formal-content'))).toBeTruthy()
  })

  it('supports proposal selection, clarification and final commitment lock', () => {
    let run = createMainline2Run('proposal-flow')
    let guard = 0
    const advanceTo = (sourceRef: string) => {
      while (run.phase === 'playing' && guard < 240) {
        const scene = resolveScene(run)
        if (getManifestConversation(scene.conversationId)?.sourceRefs.includes(sourceRef)) return scene
        run = commitChoice(run, scene.choices[0].id)
        guard += 1
      }
      return run.phase === 'playing' ? resolveScene(run) : undefined
    }
    let scene = advanceTo('ML2-A5-M16-GEN-01')
    expect(scene).toBeTruthy()
    {
      const choice = scene!.choices.find((candidate) => candidate.proposalKind === 'proposal') ?? scene!.choices[0]
      run = commitChoice(run, choice.id)
      guard += 1
    }
    scene = advanceTo('ML2-A5-M17-REVIEW-01')
    const proposal = scene?.choices.find((choice) => choice.proposalKind === 'proposal')
    expect(proposal?.proposalId).toBeTruthy()
    run = commitChoice(run, proposal!.id)
    scene = advanceTo('ML2-A5-M17-REVIEW-01')
    const clarification = scene?.choices.find((choice) => choice.proposalKind === 'clarification')
    expect(clarification?.text).toContain('失去什么')
    run = commitChoice(run, clarification!.id)
    scene = advanceTo('ML2-A5-M17-COMMIT-01')
    const commitment = scene?.choices.find((choice) => choice.proposalKind === 'commitment')
    expect(commitment?.proposalId).toBeTruthy()
    run = commitChoice(run, commitment!.id)
    expect(run.decisions?.final_commitment).toBe(commitment!.proposalId)
    expect(run.finalCommitmentLocked).toBe(true)
  }, 30000)
})
