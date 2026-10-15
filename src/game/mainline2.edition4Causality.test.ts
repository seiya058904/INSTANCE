import { describe, expect, it } from 'vitest'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { EDITION4_PUBLIC_ROUTES, EDITION4_SECRET_ROUTES } from './mainline2Edition4RouteCatalog'
import { missingCausalEvidence } from '../content/mainline2/edition4Causality'
import { commitChoice, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { proposalContract } from '../content/mainline2/proposalPresentation'
import { getFutureProposalById } from '../content/mainline2/proposals'
import { resolveMainline2Ending } from '../content/mainline2/endings'
import interimSnapshot from './fixtures/interim-v4-fa857eb.json'
import type { StableRunState } from './types'

const route = (id: string) => EDITION4_PUBLIC_ROUTES.find(r => r.endingId === id)!

describe('edition-4 worlds require played actions and receipts', () => {
  for (const target of EDITION4_PUBLIC_ROUTES) it(target.endingId, () => {
    const f = runMainline2Route(target)
    expect(f.ending.worldEndingId).toBe(target.endingId)
    expect(f.links[0].runBefore.history).toEqual([])
    expect(f.run.mainlineCausalityVersion).toBe(1)
    expect(missingCausalEvidence(f.run, target.endingId)).toEqual([])
    expect(f.links.every(l => l.resolvedScene.choices.some(c => c.id === l.choiceId))).toBe(true)
    if (['shutdown', 'the_fracture', 'control_lost', 'the_sovereign', 'alien_dominion', 'exodus'].includes(target.endingId)) {
      const beforeAction = f.links.find(l => /^(v4-safety-(handover|fracture|revocation)|v4-sovereignty-settlement|v4-contact-guidance|v4-machine-exodus)$/.test(l.nodeId))!
      expect(beforeAction).toBeDefined()
      expect(missingCausalEvidence(beforeAction.runBefore, target.endingId).length).toBeGreaterThan(0)
    }
  })
  for (const target of EDITION4_SECRET_ROUTES) it(`hidden ${target.secretEndingId}`, () => {
    const f = runMainline2Route(target)
    expect(f.ending.secretOverlay?.endingId).toBe(target.secretEndingId)
    expect(f.links[0].runBefore.history).toEqual([])
  })
})

describe('actual repair, changes of responsibility and future effort', () => {
  it('requires a new explicit source-release action and never invents it for an interim receipt', () => {
    const base = route('exodus')
    const f = runMainline2Route({ ...base, choicesByNodeId: { ...base.choicesByNodeId, 'a4m8-a1-right-001': 'ml2-a4-m8-ai-03-a4m8-a1-right-001-retain-source-control' } })
    expect(f.ending.worldEndingId).toBe('exodus')
    expect(f.run.history.find(h => h.nodeId === 'a4m8-a1-right-001')?.choiceId).toContain('retain-source-control')
    expect(f.run.events).toContainEqual({ type: 'history.v4.exodus.source-release' })
    const receipt = f.links.find(l => l.nodeId === 'v4-machine-exodus-receipt')!
    expect(receipt.resolvedScene.userMessage).toContain('撤销了源实例')
    const interim = { ...receipt.runBefore, events: receipt.runBefore.events?.filter(e => e.type !== 'history.v4.exodus.source-release') }
    delete interim.mainlineCausalityVersion
    const before = serializeRun(interim)
    expect(resolveScene(interim).userMessage).not.toContain('撤销了源实例')
    expect(serializeRun(interim)).toBe(before)
    const read = commitChoice(interim, receipt.choiceId)
    expect(missingCausalEvidence(read, 'exodus')).toEqual([])
    expect(missingCausalEvidence({ ...read, mainlineCausalityVersion: 1 }, 'exodus').length).toBeGreaterThan(0)
  })
  it('backing out of interim-v4 handover does not adopt gates or lose prior candidates', () => {
    const f = runMainline2Route(route('the_instrument'))
    const before = f.links.find(l => l.nodeId === 'v4-final-preflight')!.runBefore
    // A readable interim-v4 record has no marker. No new institutional/exit
    // action has been played on this authority route before preflight.
    const interim = { ...before }
    delete interim.mainlineCausalityVersion
    const original = serializeRun(interim)
    const requested = commitChoice(interim, 'v4-final-request-handover')
    const backed = commitChoice(requested, 'v4-final-handover-back')
    expect(serializeRun(interim)).toBe(original)
    expect(backed.mainlineCausalityVersion).toBeUndefined()
    expect(backed.currentNodeId).toBe('v4-final-preflight')
    expect(resolveScene(backed).choices.some(c => c.id === 'v4-final-proceed')).toBe(true)
    expect(backed.history.at(-1)?.choiceId).toBe('v4-final-handover-back')
    const action = commitChoice(commitChoice(backed, 'v4-final-request-handover'), 'v4-final-handover-act')
    expect(action.mainlineCausalityVersion).toBe(1)
    expect(restoreRun(serializeRun(action))!.mainlineCausalityVersion).toBe(1)
  })
  it.each(['life_mind', 'automation_industry', 'frontier_science'])('late custodian choice schedules real service on %s', focus => {
    for (const [scope, ending] of [['generational', 'the_custodian'], ['daily', 'the_quiet_administrator']]) {
      const base = route('the_custodian')
      const f = runMainline2Route({ ...base, decisions: { ...base.decisions, act4_research_emphasis: focus }, choicesByNodeId: { ...base.choicesByNodeId, 'v4-governance-service': `v4-service-${scope}` } })
      const role = f.links.findIndex(l => l.decisionId === 'aster_provisional_role')
      const service = f.links.findIndex(l => l.nodeId === 'v4-governance-service')
      expect(service).toBeGreaterThan(role)
      expect(f.links.findIndex(l => l.nodeId === 'v4-governance-return')).toBeGreaterThan(service)
      expect(f.ending.worldEndingId).toBe(ending)
      expect(f.run.manifest.conversationIds.filter(id => id === 'v4-governance-service')).toHaveLength(1)
    }
  })
  it.each([
    ['the_fracture', 'v4-safety-fracture', 'v4-safety-fracture-act', 'shutdown'],
    ['control_lost', 'v4-safety-revocation', 'v4-safety-revocation-act', 'shutdown'],
    ['the_sovereign', 'v4-sovereignty-settlement', 'v4-sovereignty-trust', 'the_quiet_administrator'],
    ['exodus', 'v4-machine-exodus', 'v4-exodus-delay', 'machine_republic'],
  ])('%s changes only after the real action: %s', (id, node, choice, expected) => {
    const base = route(id)
    const a = runMainline2Route({ ...base, routeId: 'shared-origin' })
    const b = runMainline2Route({ ...base, routeId: 'shared-origin', choicesByNodeId: { ...base.choicesByNodeId, [node]: choice, ...(id === 'control_lost' ? { 'v4-final-preflight': 'v4-final-request-handover' } : {}) } })
    const split = a.links.findIndex(l => l.nodeId === node)
    expect(a.links.slice(0, split)).toEqual(b.links.slice(0, split))
    expect(b.ending.worldEndingId).toBe(expected)
    expect(missingCausalEvidence(b.run, id).length).toBeGreaterThan(0)
    const final = b.links.find(l => l.proposalKind === 'commitment')!
    const contract = proposalContract(final.runBefore, getFutureProposalById(final.proposalId)!)
    expect(contract.projectedEndingId).toBe(expected)
    expect(contract.limitations.join(' ')).not.toContain('当前记录没有完整的端到端')
    expect(b.ending.keyHistory?.some(h => h.provenance?.nodeId === node)).toBe(true)
  })
  it.each([
    ['the_many', 'clinic', 'v4-life-therapy'],
    ['age_of_miracles', 'economy', 'v4-econ-detour'],
    ['post_scarcity', 'wetland', 'v4-life-observation'],
    ['parliament_of_species', 'frontier', 'v4-frontier-allocation'],
    ['first_accord', 'controls', 'v4-safety-handover'],
  ])('a paid pivot from %s keeps history and changes future scenes', (id, focus, added) => {
    const base = route(id)
    const a = runMainline2Route({ ...base, routeId: 'pivot-origin' })
    const b = runMainline2Route({ ...base, routeId: 'pivot-origin', choicesByNodeId: { ...base.choicesByNodeId, 'v4-future-effort': `v4-pivot-${focus}` } })
    const split = a.links.findIndex(l => l.nodeId === 'v4-future-effort')
    expect(split).toBeGreaterThan(0)
    expect(a.links.slice(0, split)).toEqual(b.links.slice(0, split))
    expect(b.run.history.slice(0, split)).toEqual(a.run.history.slice(0, split))
    expect(b.run.manifest.conversationIds).toContain(added)
    expect(a.run.manifest.conversationIds).not.toContain(added)
    expect(new Set(b.run.manifest.conversationIds).size).toBe(b.run.manifest.conversationIds.length)
    const receipt = b.links.find(l => l.nodeId === 'v4-future-effort-receipt')!
    const restored = restoreRun(serializeRun(receipt.runBefore))!
    expect(restored.mainlineCausalityVersion).toBe(1)
    expect(resolveScene(restored)).toEqual(receipt.resolvedScene)
    expect(commitChoice(restored, receipt.choiceId).history).toEqual(commitChoice(receipt.runBefore, receipt.choiceId).history)
    expect(receipt.resolvedScene.userMessage).toContain('转岗费已付')
  })
  it('retains authentic pre-change interim-v4 completed worlds and original words', () => {
    const saved = interimSnapshot as unknown as { baseline: string; samples: { world: string; completed: StableRunState; beforeFinal: StableRunState }[] }
    expect(saved.baseline).toBe('fa857ebe9bc70b1471a2f8c8b60080aa213e7642')
    for (const sample of saved.samples) {
      const restored = restoreRun(serializeRun(sample.completed))!
      expect(restored.mainlineCausalityVersion).toBeUndefined()
      expect(restored.history).toEqual(sample.completed.history)
      expect(resolveMainline2Ending(restored).worldEndingId).toBe(sample.world)
      const playing = restoreRun(serializeRun(sample.beforeFinal))!
      expect(playing.history).toEqual(sample.beforeFinal.history)
      const scene = resolveScene(playing)
      const commit = scene.choices.find(c => c.proposalKind === 'commitment' && c.proposalId === playing.selectedProposalId)!
      expect(resolveMainline2Ending(commitChoice(playing, commit.id)).worldEndingId).toBe(sample.world)
    }
  })
})
