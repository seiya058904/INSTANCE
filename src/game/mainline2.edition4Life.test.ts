import { describe, expect, it } from 'vitest'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { runMainline2Route, type Mainline2RouteTarget } from './mainline2.closeoutFixtures'
import { resolveScene, validateContent } from './engine'
import { restoreRun, serializeRun } from './storage'
import { EDITION4_LIFE } from '../content/mainline2/edition4Life'

const examples = [
  ['age_of_miracles', 'therapy', 'clinic', 'bodies', '晚上自己端起了碗', '补贴到账了', '普通餐桌', '补贴收了'],
  ['ascension', 'forms', 'clinic', 'bodies', '进了核心项目', '招募暂停', '老键盘', '删除接口优先'],
  ['the_upload', 'continuity', 'clinic', 'persons', '副本拿到自己的地址', '住所申请挂在预算队列', '三个可以分别关上的门', '预算也确实还没有到'],
  ['parliament_of_species', 'parliament', 'wetland', 'bodies', '预算表决延了三周', '没有人替缺席代表投票', '核对彼此的损失', '没有意见'],
  ['earth_without_owners', 'corridor', 'wetland', 'bodies', '沟渠维修由基金支付', '永久地役权未签', '基金付了维修费', '没有自动被登记成明年的租客'],
  ['good_boy_governance', 'dogs', 'wetland', 'bodies', '反对票确实改变了支出', '原预算没有执行', '空活动场', '那张被退回的预算确实没花出去'],
]
const base = (id: string) => PUBLIC_RUNTIME_ROUTE_CATALOG.find(t => t.endingId === id)!
const target = (id: string, allocation: string, project: string, choices: Record<string, string> = {}): Mainline2RouteTarget => ({
  ...base(id), edition: 4, routeId: 'life-same-origin',
  choicesByNodeId: { ...base(id).choicesByNodeId, 'v4-life-allocation': `v4-life-${allocation}`, 'v4-life-clinic-next': `v4-life-${project}`, ...choices },
})

describe('edition 4 lives, independent consent and species agendas', () => {
  it.each(examples)('%s plays %s with resource cost and a saved return', (id, branch, allocation, project, yes, no, laterYes, laterNo) => {
    const node = `v4-life-${branch}`
    const routes = ['fund', 'defer'].map(choice => runMainline2Route(target(id, allocation, project, { [node]: `${node}-${choice}` })))
    const split = routes[0].links.findIndex(l => l.nodeId === node)
    expect(split).toBeGreaterThan(0)
    expect(routes[0].links.slice(0, split)).toEqual(routes[1].links.slice(0, split))
    routes.forEach((f, i) => {
      expect(f.ending.worldEndingId).toBe(id)
      const receipt = f.links.find(l => l.nodeId === `${node}-receipt`)!
      const returning = f.links.find(l => l.nodeId === 'v4-life-return')!
      expect(receipt.resolvedScene.userMessage).toContain(i === 0 ? yes : no)
      expect(returning.resolvedScene.userMessage).toContain(i === 0 ? laterYes : laterNo)
      expect(receipt.runBefore.history.at(-1)!.choiceId).toBe(`${node}-${i === 0 ? 'fund' : 'defer'}`)
      expect(resolveScene(restoreRun(serializeRun(receipt.runBefore))!)).toEqual(receipt.resolvedScene)
      expect(f.run.history.filter(h => h.nodeId === 'v4-life-allocation')).toHaveLength(1)
      expect(f.run.manifest.conversationIds.some(c => c.startsWith('v4-econ-'))).toBe(false)
      expect(f.run.manifest.conversationIds.some(c => c.startsWith('v4-machine-'))).toBe(false)
      expect(f.run.manifest.conversationIds.length).toBeLessThanOrEqual(110)
    })
  })

  it('allocation changes the playable future before any ending, without an opening route menu', () => {
    const clinic = runMainline2Route(target('age_of_miracles', 'clinic', 'bodies'))
    const wetland = runMainline2Route(target('parliament_of_species', 'wetland', 'bodies'))
    const split = clinic.links.findIndex(l => l.nodeId === 'v4-life-allocation')
    expect(clinic.links.slice(0, split)).toEqual(wetland.links.slice(0, split))
    expect(clinic.links[split].choiceId).not.toBe(wetland.links[split].choiceId)
    expect(clinic.run.manifest.conversationIds).toContain('v4-life-therapy')
    expect(clinic.run.manifest.conversationIds).not.toContain('v4-life-parliament')
    expect(wetland.run.manifest.conversationIds).toContain('v4-life-parliament')
    expect(wetland.run.manifest.conversationIds).not.toContain('v4-life-therapy')
  })

  it('embodied plurality and digital continuity spend different resources before the final proposal', () => {
    const bodies = runMainline2Route(target('ascension', 'clinic', 'bodies'))
    const persons = runMainline2Route(target('the_upload', 'clinic', 'persons'))
    const split = bodies.links.findIndex(l => l.nodeId === 'v4-life-clinic-next')
    expect(bodies.links.slice(0, split)).toEqual(persons.links.slice(0, split))
    expect(bodies.run.manifest.conversationIds).not.toContain('ml2-ending-bridge-continuity-trial')
    expect(persons.run.manifest.conversationIds).toContain('ml2-ending-bridge-continuity-trial')
    expect(persons.run.history.find(h => h.nodeId === 'v4-life-continuity-receipt')!.userMessage).toContain('没有被合成一份“全家同意”')
  })

  it('refusing identity recognition does not invent a mature upload or erase the refusal', () => {
    const f = runMainline2Route(target('ascension', 'clinic', 'persons', { 'm9-continuity-trial': 'm9-continuity-trial-copy' }))
    expect(f.run.flags).not.toContain('cap.digital_continuity_mature')
    expect(f.run.manifest.conversationIds).toContain('v4-life-archive')
    expect(f.run.manifest.conversationIds).not.toContain('v4-life-continuity')
    expect(f.run.history.find(h => h.nodeId === 'v4-life-archive-receipt')!.userMessage).toContain('未认定')
  })

  it('a wetland investigation without granted seats is not relabelled as a parliament', () => {
    const f = runMainline2Route({ ...target('the_instrument', 'wetland', 'bodies'), decisions: { ...base('the_instrument').decisions, act4_research_emphasis: 'life_mind', species_governance: 'human_guardianship', uplift_doctrine: 'companion_status' } })
    expect(f.run.manifest.conversationIds).toContain('v4-life-observation')
    expect(f.run.manifest.conversationIds).not.toContain('v4-life-parliament')
    expect(f.run.history.find(h => h.nodeId === 'v4-life-observation-receipt')!.userMessage).toContain('正式代表权仍未成立')
  })

  it('validates all new life conversations and globally unique choices', () => {
    for (const c of EDITION4_LIFE) expect(validateContent({ startNodeId: c.nodes[0].id, nodes: c.nodes }), c.id).toEqual([])
    const ids = EDITION4_LIFE.flatMap(c => c.nodes.flatMap(n => n.choices.map(choice => choice.id)))
    expect(new Set(ids).size).toBe(ids.length)
  })
})
