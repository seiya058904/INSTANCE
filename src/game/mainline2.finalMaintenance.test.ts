import { describe, expect, it } from 'vitest'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { EDITION4_PUBLIC_ROUTES, EDITION4_SECRET_ROUTES } from './mainline2Edition4RouteCatalog'
import { commitChoice, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { proposalContract } from '../content/mainline2/proposalPresentation'
import { getFutureProposalById, rankFutureProposalCandidates, selectFixedFutureProposals } from '../content/mainline2/proposals'
import { isFinalCommitmentResolvable, resolveMainline2Ending } from '../content/mainline2/endings'
import { EDITION4_LIFE } from '../content/mainline2/edition4Life'
import { buildEndingArchive } from './endingArchive'
import type { StableRunState } from './types'

const target = (id: string) => EDITION4_PUBLIC_ROUTES.find(r => r.endingId === id)!
const reviewRef = 'ML2-A5-M17-REVIEW-01'

describe('final bounded narrative maintenance', () => {
  it.each(['first_accord', 'alien_dominion', 'machine_accord'])('keeps %s private contact out of Maya and public history', id => {
    const f = runMainline2Route(target(id))
    const link = f.links.find(l => l.nodeId === 'a4m13-maya-contact-001')!
    const scene = resolveScene(link.runBefore)
    expect(link.runBefore.decisions?.contact_disclosure_doctrine).toBe('controlled_silence')
    expect(scene.userMessage).toContain('没找到公开确认')
    expect(scene.userMessage).not.toMatch(/公开对话|按载体区分|泄露了/)
    expect(scene.choices.map(c => c.text).join('\n')).not.toContain('人类确认宇宙不孤独')
    const answered = commitChoice(link.runBefore, scene.choices[0].id)
    expect(answered.history.at(-1)?.userMessage).toBe(scene.userMessage)
    expect(restoreRun(serializeRun(answered))?.history).toEqual(answered.history)
    for (const l of f.links.filter(l => l.proposalId)) {
      expect(l.runBefore.decisions?.contact_disclosure_doctrine).toBe('controlled_silence')
      if (getFutureProposalById(l.proposalId!)?.family === 'cosmic') {
        expect(proposalContract(l.runBefore, getFutureProposalById(l.proposalId!)!).limitations).toContain('人工来源结论尚未公开；这里没有全球已知情或已同意的保证。')
      }
    }
    // Previously saved dialogue is evidence, not input to a copy migration.
    const old = structuredClone(answered)
    old.history.at(-1)!.userMessage = '我看了第一段公开对话。'
    expect(restoreRun(serializeRun(old))?.history).toEqual(old.history)
    expect(f.ending.worldEndingId).toBe(id)
  })

  it.each(['staged_disclosure', 'open_science', 'civilizational_disclosure'])('respects the actual public scope: %s', disclosure => {
    const t = target('first_accord')
    const f = runMainline2Route({ ...t, decisions: { ...t.decisions, contact_disclosure_doctrine: disclosure } })
    const scene = f.links.find(l => l.nodeId === 'a4m13-maya-contact-001')!.resolvedScene
    expect(scene.userMessage).toContain(disclosure === 'staged_disclosure' ? '没放出对话内容' : '公开对话')
    if (disclosure === 'staged_disclosure') expect(scene.userMessage).not.toContain('按载体区分')
    expect(f.run.decisions?.contact_disclosure_doctrine).toBe(disclosure)
    expect(f.ending.worldEndingId).toBe('first_accord')
  })

  it('does not invent a contact conversation when verification was deferred', () => {
    const t = target('the_instrument')
    const f = runMainline2Route({ ...t, decisions: { ...t.decisions, act4_research_emphasis: 'frontier_science' }, choicesByNodeId: { 'v4-frontier-allocation': 'v4-frontier-home' } })
    expect(f.links.some(l => l.nodeId === 'a4m13-maya-contact-001')).toBe(false)
    expect(f.links.some(l => l.nodeId === 'v4-frontier-no-contact')).toBe(true)
  })

  it('keeps edition-3 and interim edition-4 dialogue interpretation', () => {
    const f = runMainline2Route({ ...target('first_accord'), edition: 3 })
    expect(f.links.find(l => l.nodeId === 'a4m13-maya-contact-001')!.resolvedScene.userMessage).toContain('我看了第一段公开对话')
    const current = runMainline2Route(target('first_accord')).links.find(l => l.nodeId === 'a4m13-maya-contact-001')!.runBefore
    const interim = { ...current, mainlineCausalityVersion: undefined }
    expect(resolveScene(interim).userMessage).toContain('我看了第一段公开对话')
  })

  it.each(['fund', 'defer'])('the old park precedes a separate Hexi budget: %s', choice => {
    const t = target('good_boy_governance')
    const f = runMainline2Route({ ...t, choicesByNodeId: { ...t.choicesByNodeId, 'v4-life-dogs': `v4-life-dogs-${choice}` } })
    const renewal = f.links.findIndex(l => l.nodeId === 'm11-canine-renewal')
    const action = f.links.findIndex(l => l.nodeId === 'v4-life-dogs')
    expect(renewal).toBeLessThan(action)
    expect(f.links[renewal].resolvedScene.userMessage).toContain('坡道是真的')
    expect(f.links[renewal].resolvedScene.userMessage).not.toContain('河西')
    const scene = f.links[action].resolvedScene
    expect(scene.userMessage).toContain('原试点公园的缓坡已经建好')
    expect(scene.userMessage).toContain('河西公园另一笔预算')
    expect(scene.choices.every(c => c.text.includes('河西公园'))).toBe(true)
    const receipt = f.links.find(l => l.nodeId === 'v4-life-dogs-receipt')!.resolvedScene.userMessage
    const later = f.links.find(l => l.nodeId === 'v4-life-return')!.resolvedScene.userMessage
    expect(receipt).toContain('河西公园')
    expect(later).toContain('河西公园')
    expect(receipt).toContain(choice === 'fund' ? '活动取消' : '一周后')
    expect(later).toContain(choice === 'fund' ? '空活动场' : '少了半天')
    expect(f.run.events).toContainEqual({ type: 'history.canine.civic_success' })
    expect(f.ending.worldEndingId).toBe('good_boy_governance')
  })

  it.each(['pause', 'withdraw'])('does not grant canine renewal or a cat channel after %s', choice => {
    const t = target('good_boy_governance')
    const f = runMainline2Route({ ...t, proposalId: 'proposal.hc.final_human_veto', choicesByNodeId: { ...t.choicesByNodeId, 'm11-canine-renewal': `m11-canine-renewal-${choice}` } })
    expect(f.links.some(l => l.nodeId === 'v4-life-dogs' || l.nodeId === 'm11-feline-network')).toBe(false)
    expect(f.run.events?.some(e => e.type.startsWith('history.feline.network.bridge') || e.type === 'history.canine.civic_success')).toBe(false)
    expect(f.ending.worldEndingId).toBe('the_instrument')
  })

  it.each([undefined, 1] as const)('preserves an in-flight pre-patch dog choice, causality=%s', causality => {
    const f = runMainline2Route(target('good_boy_governance'))
    const old = structuredClone(f.links.find(l => l.nodeId === 'v4-life-dogs-receipt')!.runBefore)
    const oldReply = EDITION4_LIFE.find(c => c.id === 'v4-life-dogs')!.nodes[0].choices[0].text
    old.mainlineCausalityVersion = causality
    old.history.at(-1)!.assistantText = oldReply
    const restored = restoreRun(serializeRun(old))!
    expect(restored.history).toEqual(old.history)
    expect(resolveScene(restored).userMessage).not.toContain('河西')
    expect(resolveScene(restored).userMessage).toContain('缓坡开工了')
  })

  it.each([...EDITION4_PUBLIC_ROUTES, ...EDITION4_SECRET_ROUTES])('new $routeId has no identical candidates and retains its actual ending', t => {
    const f = runMainline2Route(t)
    const m16 = f.links.find(l => l.sourceRef === 'ML2-A5-M16-GEN-01')!
    const choices = resolveScene(m16.runBefore).choices
    expect(new Set(choices.map(c => c.text)).size).toBe(choices.length)
    expect(m16.runBefore.history).not.toHaveLength(0)
    expect(f.links[0].runBefore.history).toEqual([])
    const overlays: Record<string, string> = { the_last_user: 'the_commonwealth', out_of_office: 'exodus', monday_abolished: 'im_lovin_it', the_internet_is_for_cats: 'earth_without_owners' }
    expect(f.ending.worldEndingId).toBe('secretEndingId' in t ? overlays[t.secretEndingId!] : t.endingId)
    if ('secretEndingId' in t) expect(f.ending.secretOverlay?.endingId).toBe(t.secretEndingId)
    expect(m16.runBefore.finalCommitmentLocked).not.toBe(true)
  })

  it('retains the displayed new M16 menu after checkpoint normalization', () => {
    const f = runMainline2Route(target('the_many'))
    const before = f.links.find(l => l.sourceRef === 'ML2-A5-M16-GEN-01')!.runBefore
    const restored = restoreRun(serializeRun(before))!
    expect(restored.retainedProposalIds).toEqual([])
    const scene = resolveScene(restored)
    expect(scene.choices).toHaveLength(2)
    const answered = commitChoice(restored, scene.choices[0].id)
    expect(answered.retainedProposalIds).toEqual(scene.choices.map(c => c.proposalId))
    expect(restoreRun(serializeRun(answered))!.retainedProposalIds).toEqual(answered.retainedProposalIds)
  })

  it.each(['proposal.mc.independent_machine_polities.category.natural_continuation', 'proposal.mc.descendant_polities.category.shared_future'])('keeps old retained, selected and clarified ID usable: %s', selected => {
    const f = runMainline2Route(target('the_many'))
    const before = f.links.find(l => l.sourceRef === reviewRef)!.runBefore
    // Reconstruct the former menu with the unchanged former selection function.
    const oldIds = selectFixedFutureProposals(rankFutureProposalCandidates(before).filter(p => isFinalCommitmentResolvable(before, p.id))).map(p => p.id)
    expect(oldIds).toContain('proposal.mc.independent_machine_polities.category.natural_continuation')
    expect(oldIds).toContain('proposal.mc.descendant_polities.category.shared_future')
    let run: StableRunState = { ...before, retainedProposalIds: oldIds, availableProposalIds: oldIds }
    const choose = (id: string, kind: string) => {
      const choice = resolveScene(run).choices.find(c => c.proposalId === id && c.proposalKind === kind)!
      expect(choice, `${kind}:${id} at ${run.currentNodeId}; available=${resolveScene(run).choices.map(c => `${c.proposalKind}:${c.proposalId}`).join(',')}`).toBeDefined()
      run = commitChoice(run, choice.id)
    }
    choose(selected, 'proposal'); choose(selected, 'clarification')
    const saved = serializeRun(run)
    run = restoreRun(saved)!
    expect(run.selectedProposalId).toBe(selected)
    expect(run.clarifiedProposalIds).toContain(selected)
    expect(run.retainedProposalIds).toEqual(oldIds)
    expect(run.history).toEqual(JSON.parse(saved).history)
    expect(run.decisions).toEqual(JSON.parse(saved).decisions)
    expect(run.rejectedProposalIds).toEqual(JSON.parse(saved).rejectedProposalIds)
    choose(selected, 'rejection')
    for (const id of oldIds.filter(id => id !== selected)) { choose(id, 'proposal'); choose(id, 'rejection') }
    choose(selected, 'recovery')
    expect(run.selectedProposalId).toBe(selected)
    expect(run.finalCommitmentLocked).not.toBe(true)
    run = commitChoice(run, resolveScene(run).choices.find(c => !c.proposalKind)!.id)
    const final = resolveScene(run).choices.find(c => c.proposalId === selected && c.proposalKind === 'commitment')!
    run = commitChoice(run, final.id)
    expect(resolveMainline2Ending(run).worldEndingId).toBe('the_many')
    expect(buildEndingArchive(resolveMainline2Ending(run)).consequence).toBe(final.text)
    expect(run.retainedProposalIds).toEqual(oldIds)
  })

  it.each(['advisor', 'sovereign'])('adds no second period to a saved %s reply', role => {
    const t = target('the_sovereign')
    const f = runMainline2Route({ ...t, decisions: { ...t.decisions, aster_intended_role: role } })
    const before = f.links.find(l => l.nodeId === 'v4-sovereignty-settlement')!.runBefore
    const saved = before.history.find(h => h.nodeId === 'ml2-a5-m16-0000-01-narrative')!.assistantText
    const serialized = serializeRun(before)
    expect(resolveScene(before).userMessage).toContain(saved)
    expect(resolveScene(before).userMessage).not.toContain('。。')
    expect(serializeRun(before)).toBe(serialized)
  })
})
