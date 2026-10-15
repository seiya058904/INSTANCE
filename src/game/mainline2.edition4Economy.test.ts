import { describe, expect, it } from 'vitest'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { effectiveStoryPlanForRun } from '../content/mainline2/storyPlan'
import { createEmptyExposureHistory } from '../content/runManifest'
import { checkpointToken, loadCheckpoint, writeCheckpoint, type CheckpointData } from './checkpoint'
import { economyBranch } from '../content/mainline2/edition4Economy'

const cases = [
  { ending: 'post_scarcity', node: 'v4-econ-occupation', yes: 'v4-dividend-pay', no: 'v4-dividend-wait', result: '保障金', yesReturn: '冰箱里还有', noReturn: '还在等产权结算' },
  { ending: 'perfect_administration', node: 'v4-econ-detour', yes: 'v4-detour-allow', no: 'v4-detour-correct', result: '汤还热', yesReturn: '又去吃了一次', noReturn: '味道已经变了' },
  { ending: 'im_lovin_it', node: 'v4-econ-menu', yes: 'v4-menu-experiment', no: 'v4-menu-standard', result: '六份食材', yesReturn: '第二锅汤', noReturn: '菜单没变' },
]
const target = (ending: string) => PUBLIC_RUNTIME_ROUTE_CATALOG.find(t => t.endingId === ending)!

describe('edition 4 economic actions and saved consequences', () => {
  it('does not invent efficiency scheduling for other economic and production choices', () => {
    const run = createMainline2Run('unmatched-economy')
    for (const economic_doctrine of ['planned_coordination', 'autonomous_economy', 'market_automation']) {
      expect(economyBranch({ ...run, decisions: { act4_research_emphasis: 'automation_industry', economic_doctrine, production_values: 'personalized_optimization' } })).toBeUndefined()
    }
  })
  it.each(cases)('$ending has an action, a receipt and a later costly return', c => {
    const routes = [c.yes, c.no].map(choice => runMainline2Route({
      ...target(c.ending), edition: 4, routeId: 'v4-same-origin',
      choicesByNodeId: { [c.node]: choice },
    }))
    const split = routes[0].links.findIndex(l => l.nodeId === c.node)
    expect(split).toBeGreaterThan(0)
    expect(routes[0].links.slice(0, split)).toEqual(routes[1].links.slice(0, split))
    routes.forEach((fixture, i) => {
      expect(fixture.ending.worldEndingId).toBe(c.ending)
      expect(fixture.run.mainlineCalendarVersion).toBe(4)
      const receipt = fixture.links.find(l => l.nodeId === `${c.node}-receipt`)!
      const revisit = fixture.links.find(l => l.nodeId === 'v4-econ-return')!
      expect(receipt.runBefore.history.at(-1)?.choiceId).toBe(i === 0 ? c.yes : c.no)
      if (i === 0) expect(receipt.resolvedScene.userMessage).toContain(c.result)
      expect(revisit.resolvedScene.userMessage).toContain(i === 0 ? c.yesReturn : c.noReturn)
      expect(fixture.run.events).toContainEqual({ type: `history.v4.${i === 0 ? c.yes : c.no}` })
      expect(fixture.run.decisions?.production_values).toBe(target(c.ending).decisions?.production_values)
      const final = fixture.links.find(link => link.proposalKind === 'commitment')!
      expect(final.choiceText).toContain(`本局试行记录：${receipt.resolvedScene.userMessage.split('\n')[0]}`)
      expect(fixture.run.manifest.conversationIds.filter(id => /^v4-econ-(occupation|detour|menu)$/.test(id))).toEqual([c.node])
      expect(new Set(fixture.run.manifest.conversationIds).size).toBe(fixture.run.manifest.conversationIds.length)
      for (const link of fixture.links) {
        const restored = restoreRun(serializeRun(link.runBefore))!
        expect(restored.history).toEqual(link.runBefore.history)
        expect(resolveScene(restored)).toEqual(link.resolvedScene)
        expect(commitChoice(restored, link.choiceId).history).toEqual(commitChoice(link.runBefore, link.choiceId).history)
      }
      expect(fixture.run.manifest.conversationIds.length).toBe(effectiveStoryPlanForRun(fixture.run).length)
    })
  })

  it.each(['v4-cold-isolate', 'v4-cold-continue'])('cold-chain cancellation %s changes repair, service and the return', choice => {
    const fixture = runMainline2Route({ ...target('post_scarcity'), edition: 4, choicesByNodeId: { 'v4-econ-cold-chain': choice } })
    const receipt = fixture.links.find(l => l.nodeId === 'v4-econ-cold-receipt')!
    const revisit = fixture.links.find(l => l.nodeId === 'v4-econ-return')!
    expect(receipt.runBefore.events).toContainEqual({ type: `history.v4.${choice}` })
    expect(receipt.resolvedScene.userMessage).toContain(choice === 'v4-cold-isolate' ? '第二次暂停抵达执行端' : '配送成功，不能算作撤销成功')
    expect(revisit.resolvedScene.userMessage).toContain(choice === 'v4-cold-isolate' ? '等了两小时' : '修复通知还没来')
  })

  it('A×C makes actual disbursement timing depend on the earlier execution authorization', () => {
    const fixtures = ['human_final_authority', 'conditional_delegation'].map(first_public_execution_doctrine => runMainline2Route({
      ...target('post_scarcity'), edition: 4,
      decisions: { ...target('post_scarcity').decisions, first_public_execution_doctrine },
    }))
    expect(fixtures[0].links.find(l => l.nodeId === 'v4-econ-occupation-receipt')!.resolvedScene.userMessage).toContain('43 分钟')
    expect(fixtures[1].links.find(l => l.nodeId === 'v4-econ-occupation-receipt')!.resolvedScene.userMessage).toContain('11 分钟')
  })

  it.each([3, 4] as const)('preserves edition %i, ledger/meta and CAS across checkpoint reload and failed writes', edition => {
    const fixture = runMainline2Route({ ...target('post_scarcity'), edition })
    const values = new Map<string, string>()
    const store = { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => { values.set(k, v) } }
    const data: CheckpointData = { run: fixture.links[60].runBefore, session: null, surface: 'mainline', nonMainlineView: 'ending', meta: { version: 1, runCount: 5, completedEndings: ['the_internet_is_for_cats'] }, exposure: createEmptyExposureHistory() }
    expect(writeCheckpoint(store, checkpointToken(store), data, 'first').status).toBe('saved')
    const loaded = loadCheckpoint(store)
    expect(loaded.problem).toBeUndefined()
    expect(loaded.data).toEqual({ ...data, run: restoreRun(serializeRun(data.run)) })
    expect(writeCheckpoint(store, loaded.token, { ...data, run: fixture.run }, 'ending').status).toBe('saved')
    expect(loadCheckpoint(store).data!.run.history).toEqual(fixture.run.history)
    expect(writeCheckpoint(store, loaded.token, data, 'stale').status).toBe('conflict')
    const current = checkpointToken(store)
    expect(writeCheckpoint({ ...store, setItem: () => { throw Error('quota') } }, current, data, 'failed').status).toBe('failed')
    expect(checkpointToken(store)).toEqual(current)
    expect(fixture.run.manifest.conversationIds.some(id => id.startsWith('v4-'))).toBe(edition === 4)
  })

  it('starts new games in edition 4 while explicit old games retain their original calendar', () => {
    expect(createMainline2Run('new').mainlineCalendarVersion).toBe(4)
    expect(createMainline2Run('old', undefined, 3).mainlineCalendarVersion).toBe(3)
  })
})
