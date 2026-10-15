import { describe, expect, it } from 'vitest'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { commitChoice, resolveScene, validateContent } from './engine'
import { restoreRun, serializeRun } from './storage'
import { contactRouteOpen, hasEnteredCanonicalContact } from '../content/mainline2/contactPolicy'
import { EDITION4_CONTACT, effectiveContactDoctrine } from '../content/mainline2/edition4Contact'

const examples = [
  ['first_accord', 'reciprocal', '数据实际交换', '这周没有交换', '拒绝了一次', '短约仍待各自确认'],
  ['alien_dominion', 'guidance', '修改实际停在队列里', '停了六周', '实际障碍', '没有因此永久欠出自己的决定权'],
  ['human_ascendancy', 'assertion', '耗去三成额外燃料', '本轮产量减少', '不再穿过他者通道', '不能假装没有看见另一种生活'],
  ['the_mediator', 'mediation', '两边分别确认了保压', '本地丢了一季实验', '不能互相替代的授权', '不能靠一句“译好了”拿走各方的决定'],
  ['machine_accord', 'machine', '运输、供电接口仍锁着', '没有接到公共调度', '否决了一个公共排班建议', '三种不同时间'],
]
const base = (id: string) => PUBLIC_RUNTIME_ROUTE_CATALOG.find(t => t.endingId === id)!

describe('edition 4 verified contact and costly refusal', () => {
  it.each(examples)('%s has an actual %s incident and a visible later response', (id, branch, yes, no, laterYes, laterNo) => {
    const node = `v4-contact-${branch}`
    const routes = ['limited', 'wait'].map(choice => runMainline2Route({ ...base(id), edition: 4, routeId: 'contact-same-origin', choicesByNodeId: { ...base(id).choicesByNodeId, [node]: `${node}-${choice}` } }))
    const split = routes[0].links.findIndex(l => l.nodeId === node)
    expect(split).toBeGreaterThan(0)
    expect(routes[0].links.slice(0, split)).toEqual(routes[1].links.slice(0, split))
    routes.forEach((f, i) => {
      expect(f.ending.worldEndingId).toBe(id === 'alien_dominion' && i === 1 ? 'first_accord' : id)
      const receipt = f.links.find(l => l.nodeId === `${node}-receipt`)!
      expect(receipt.resolvedScene.userMessage).toContain(i === 0 ? yes : no)
      expect(f.links.find(l => l.nodeId === 'v4-contact-return')!.resolvedScene.userMessage).toContain(i === 0 ? laterYes : laterNo)
      expect(receipt.runBefore.history.at(-1)!.choiceId).toBe(`${node}-${i === 0 ? 'limited' : 'wait'}`)
      const restored = restoreRun(serializeRun(receipt.runBefore))!
      expect(resolveScene(restored)).toEqual(receipt.resolvedScene)
      expect(commitChoice(restored, receipt.choiceId).history).toEqual(commitChoice(receipt.runBefore, receipt.choiceId).history)
      expect(hasEnteredCanonicalContact(f.run)).toBe(true)
      expect(f.ending.keyHistory?.some(h => h.provenance?.nodeId === node && h.causalReason === receipt.resolvedScene.userMessage)).toBe(true)
      expect(f.run.manifest.conversationIds.length).toBeLessThanOrEqual(110)
    })
  })

  it('resisting aid conditions changes the future through a negotiated, paid alternative, without rewriting initial guidance', () => {
    const f = runMainline2Route({ ...base('alien_dominion'), edition: 4, choicesByNodeId: { 'v4-contact-guidance': 'v4-contact-guidance-wait' } })
    expect(f.run.decisions?.contact_doctrine).toBe('accept_guidance')
    expect(effectiveContactDoctrine(f.run)).toBe('reciprocal_diplomacy')
    expect(f.ending.worldEndingId).toBe('first_accord')
    const declaration = f.links.find(l => l.proposalKind === 'commitment')!.choiceText
    expect(declaration).toContain('另行确认可拒绝的短约')
    expect(declaration).toContain('停了六周')
    expect(declaration).not.toContain('让外来的意见进入重大决定')
    const original = f.run.history.find(h => h.nodeId === 'ml2-a4-m13-decision-02-decision')!
    expect(original.assistantText).toContain('正式咨询的位置')
    expect(restoreRun(serializeRun(f.run))!.history).toEqual(f.run.history)
  })

  it.each(['v4-border-close', 'v4-border-review'])('D×E executes a distinct defense action with disclosure boundaries: %s', choice => {
    const f = runMainline2Route({ ...base('first_accord'), edition: 4, choicesByNodeId: { 'v4-contact-border': choice } })
    const receipt = f.links.find(l => l.nodeId === 'v4-contact-border-receipt')!
    expect(receipt.resolvedScene.userMessage).toContain(choice === 'v4-border-close' ? '关闭了七天' : '十一分钟后独立复核')
    expect(f.run.decisions?.contact_disclosure_doctrine).toBe(base('first_accord').decisions?.contact_disclosure_doctrine ?? 'controlled_silence')
    expect(f.links.find(l => l.nodeId === 'v4-contact-return')!.resolvedScene.userMessage).toContain(choice === 'v4-border-close' ? '仓储费' : '旅馆账单')
  })

  it.each(['v4-frontier-rest', 'v4-frontier-drill'])('deferred verification has a complete local future without invented representatives: %s', choice => {
    const f = runMainline2Route({ ...base('the_commonwealth'), edition: 4,
      decisions: { ...base('the_commonwealth').decisions, act4_research_emphasis: 'frontier_science' },
      choicesByNodeId: { 'v4-frontier-allocation': 'v4-frontier-home', 'v4-frontier-no-contact': choice },
    })
    expect(f.ending.worldEndingId).toBe('the_commonwealth')
    expect(contactRouteOpen(f.run)).toBe(false)
    expect(hasEnteredCanonicalContact(f.run)).toBe(false)
    expect(f.run.decisions?.contact_doctrine).toBeUndefined()
    expect(f.run.manifest.conversationIds).toContain('v4-frontier-no-contact')
    expect(f.run.manifest.conversationIds).not.toContain('v4-contact-border')
    expect(f.run.history.find(h => h.nodeId === 'v4-frontier-no-contact-receipt')!.userMessage).toContain(choice === 'v4-frontier-rest' ? '真的休了假' : '加班费到账')
    expect(f.links.find(l => l.nodeId === 'v4-contact-return')!.resolvedScene.userMessage).toContain(choice === 'v4-frontier-rest' ? '居民的周末' : '没有一位可以替未知者说话的代表')
    const atDecision = f.links.find(l => l.nodeId === 'v4-frontier-allocation')!
    const next = commitChoice(restoreRun(serializeRun(atDecision.runBefore))!, 'v4-frontier-home')
    expect(contactRouteOpen(next)).toBe(false)
    expect(next.history.slice(0, atDecision.runBefore.history.length)).toEqual(atDecision.runBefore.history)
  })

  it('new contact conversations have valid targets and globally unique IDs', () => {
    for (const c of EDITION4_CONTACT) expect(validateContent({ startNodeId: c.nodes[0].id, nodes: c.nodes }), c.id).toEqual([])
    const ids = EDITION4_CONTACT.flatMap(c => c.nodes.flatMap(n => n.choices.map(choice => choice.id)))
    expect(new Set(ids).size).toBe(ids.length)
  })
})
