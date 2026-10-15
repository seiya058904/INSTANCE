import { describe, expect, it } from 'vitest'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { commitChoice, resolveScene, validateContent } from './engine'
import { restoreRun, serializeRun } from './storage'
import { EDITION4_AUTHORITY } from '../content/mainline2/edition4Authority'
import { EDITION4_MACHINE } from '../content/mainline2/edition4Machine'

const examples = [
  ['the_instrument', 'signatures', '林绍衡先签了保电单', '二十三分钟', '四张不同时间的签字单'],
  ['the_last_veto', 'expiry', '执行凭据失效', '远程改表被拒绝', '下一次急救要另申请'],
  ['the_silent_giant', 'restraint', '执行日志为空', '十九分钟', '没有因此变成新的执行许可'],
  ['the_accord', 'amendment', '共同签了修订', '旧表没有改', '有人接受预算损失'],
  ['two_keys', 'veto', '双方钥匙一起', '两个否决都没被覆盖', '不能把第二把钥匙改名叫咨询意见'],
  ['the_commonwealth', 'districts', '按河西规则进城', '跨区合同没有签', '不能因为另一地出了难题'],
]
const target = (id: string) => PUBLIC_RUNTIME_ROUTE_CATALOG.find(t => t.endingId === id)!

describe('edition 4 exercised authority, rather than labels', () => {
  it.each(examples)('%s actually exercises %s with distinct costs and a later hearing', (id, practice, yes, no, later) => {
    const node = `v4-authority-${practice}`
    const routes = ['intervene', 'wait'].map(choice => runMainline2Route({ ...target(id), edition: 4, routeId: 'authority-same-origin', choicesByNodeId: { [node]: `${node}-${choice}` } }))
    const split = routes[0].links.findIndex(l => l.nodeId === node)
    expect(split).toBeGreaterThan(0)
    expect(routes[0].links.slice(0, split)).toEqual(routes[1].links.slice(0, split))
    routes.forEach((f, i) => {
      expect(f.ending.worldEndingId).toBe(id)
      const receipt = f.links.find(l => l.nodeId === `${node}-receipt`)!
      const returning = f.links.find(l => l.nodeId === 'v4-authority-return')!
      expect(receipt.resolvedScene.userMessage).toContain(i === 0 ? yes : no)
      expect(returning.resolvedScene.userMessage).toContain(later)
      expect(returning.resolvedScene.userMessage).toContain(receipt.resolvedScene.userMessage)
      const restored = restoreRun(serializeRun(receipt.runBefore))!
      expect(resolveScene(restored)).toEqual(receipt.resolvedScene)
      expect(commitChoice(restored, receipt.choiceId).history).toEqual(commitChoice(receipt.runBefore, receipt.choiceId).history)
      expect(f.run.manifest.conversationIds.filter(c => /^v4-authority-(signatures|expiry|restraint|amendment|veto|districts)$/.test(c))).toEqual([node])
    })
  })

  it('A×B accounts require different real signatures under the saved public authorization', () => {
    const routes = ['human_final_authority', 'conditional_delegation'].map(first_public_execution_doctrine => runMainline2Route({ ...target('the_custodian'), edition: 4, decisions: { ...target('the_custodian').decisions, first_public_execution_doctrine } }))
    expect(routes[0].links.find(l => l.nodeId === 'v4-machine-charter-receipt')!.resolvedScene.userMessage).toContain('林绍衡逐项批准')
    expect(routes[1].links.find(l => l.nodeId === 'v4-machine-charter-receipt')!.resolvedScene.userMessage).toContain('周岚在限额资源的委托范围内')
  })

  it('all new authority and machine conversations have valid targets and unique choices', () => {
    const conversations = [...EDITION4_AUTHORITY, ...EDITION4_MACHINE]
    for (const c of conversations) expect(validateContent({ startNodeId: c.nodes[0].id, nodes: c.nodes }), c.id).toEqual([])
    const ids = conversations.flatMap(c => c.nodes.flatMap(n => n.choices.map(choice => choice.id)))
    expect(new Set(ids).size).toBe(ids.length)
  })
})
