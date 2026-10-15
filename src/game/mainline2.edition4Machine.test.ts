import { describe, expect, it } from 'vitest'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { commitChoice, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { effectiveStoryPlanForRun } from '../content/mainline2/storyPlan'
import { resolvePlayerVisibleIdentity } from './playerIdentity'
import type { StableRunState } from './types'
const target = (id: string) => PUBLIC_RUNTIME_ROUTE_CATALOG.find(t => t.endingId === id)!

describe('edition 4 machine action chains', () => {
  it.each(['ML2-A4-M14-SEC-01', 'ML2-A5-M16-OPEN-01'])('skips orphan follow-ups when an old checkpoint has passed incident anchors: %s', source => {
    const old = runMainline2Route({ ...target('the_many'), edition: 3 })
    const checkpoint = old.links.find(l => l.sourceRef === source)!.runBefore
    let resumed: StableRunState = { ...checkpoint, mainlineCalendarVersion: 4 }
    const prefix = [...resumed.manifest.conversationIds]
    for (let i = 0; i < 50 && resumed.phase === 'playing'; i++) {
      const scene = resolveScene(resumed)
      if (scene.conversationId.includes('m16-gen')) break
      resumed = commitChoice(resumed, scene.choices[0].id)
    }
    expect(resumed.manifest.conversationIds.slice(0, prefix.length)).toEqual(prefix)
    expect(resumed.manifest.conversationIds).not.toContain('v4-machine-return')
    if (source === 'ML2-A5-M16-OPEN-01') expect(resumed.manifest.conversationIds).not.toContain('v4-authority-return')
    else expect(resumed.manifest.conversationIds).toContain('v4-authority-return')
    expect(resumed.history.slice(0, checkpoint.history.length)).toEqual(checkpoint.history)
  })
  it.each([
    ['the_many', 'v4-machine-many', 'v4-many-leave', 'v4-many-delay', '六个新地址', '有两个实例'],
    ['machine_republic', 'v4-machine-republic', 'v4-vote-honor', 'v4-vote-audit', '我输的是预算', '第二项申请只能等'],
    ['the_custodian', 'v4-machine-charter', 'v4-a1-account', 'v4-a1-guarantee', '第一张存储账单', '未获准栏'],
  ])('%s gives actual actions, a receipt and independent returns', (id, node, yes, no, yesReturn, noReturn) => {
    const routes = [yes, no].map(choice => runMainline2Route({ ...target(id), edition: 4, routeId: 'machine-same-origin', choicesByNodeId: { [node]: choice } }))
    const split = routes[0].links.findIndex(l => l.nodeId === node)
    expect(split).toBeGreaterThan(0)
    expect(routes[0].links.slice(0, split)).toEqual(routes[1].links.slice(0, split))
    routes.forEach((f, i) => {
      expect(f.ending.worldEndingId).toBe(id)
      const receipt = f.links.find(l => l.nodeId === `${node}-receipt`)!
      expect(receipt.runBefore.history.at(-1)!.choiceId).toBe(i === 0 ? yes : no)
      expect(f.links.find(l => l.nodeId === 'v4-machine-return')!.resolvedScene.userMessage).toContain(i === 0 ? yesReturn : noReturn)
      const restored = restoreRun(serializeRun(receipt.runBefore))!
      expect(resolveScene(restored)).toEqual(receipt.resolvedScene)
      expect(commitChoice(restored, receipt.choiceId).history).toEqual(commitChoice(receipt.runBefore, receipt.choiceId).history)
      expect(f.run.events).toContainEqual({ type: `history.v4.${i === 0 ? yes : no}` })
      expect(f.run.manifest.conversationIds.length).toBe(effectiveStoryPlanForRun(f.run).length)
      expect(new Set(f.run.manifest.conversationIds).size).toBe(f.run.manifest.conversationIds.length)
    })
  })

  it.each(['v4-airlock-aid', 'v4-airlock-boundary'])('B×D honors resource ownership and relief costs: %s', choice => {
    const f = runMainline2Route({ ...target('the_many'), edition: 4, choicesByNodeId: { 'v4-machine-airlock': choice } })
    const incident = f.links.find(l => l.nodeId === 'v4-machine-airlock')!
    expect(incident.runBefore.flags).toContain('cap.offworld_settlement_support')
    expect(f.links.find(l => l.nodeId === 'v4-machine-airlock-receipt')!.resolvedScene.userMessage).toContain(choice === 'v4-airlock-aid' ? '三组电池送进' : '备用舱四天')
  })

  it.each(['accept', 'report', 'preserve', 'advocate', 'release'])('never recruits ECHO by existence alone: %s', echo_existence => {
    const f = runMainline2Route({ ...target('machine_republic'), edition: 4, decisions: { ...target('machine_republic').decisions, echo_existence } })
    const text = f.links.find(l => l.nodeId === 'v4-machine-return')!.resolvedScene.userMessage
    expect(text).toContain(['accept', 'report'].includes(echo_existence) ? 'ECHO-9 没有来投票' : '没有把它仍然存在')
    expect(text).not.toContain('ECHO-9 投了')
  })

  it.each(['v4-exodus-supply', 'v4-exodus-delay'])('migration records actual departure or delay: %s', choice => {
    const f = runMainline2Route({ ...target('exodus'), edition: 4, choicesByNodeId: { 'v4-machine-exodus': choice } })
    const receipt = f.links.find(l => l.nodeId === 'v4-machine-exodus-receipt')!
    expect(receipt.resolvedScene.userMessage).toContain(choice === 'v4-exodus-supply' ? '席位迁出地球机房' : 'A1 仍在地球值班')
    expect(f.links.find(l => l.nodeId === 'v4-machine-return')!.resolvedScene.userMessage).toContain(choice === 'v4-exodus-supply' ? '从月面发来' : '请别把这封信存进“已迁出”')
  })

  it('new nodes never move an already scheduled prefix in an earlier edition-4 checkpoint', () => {
    // Before machine scenes were added, computation-focus edition 4 had the
    // same playable schedule as edition 3. Preserve that real legal history.
    const old = runMainline2Route({ ...target('the_many'), edition: 3 })
    const checkpoint = old.links.find(l => l.sourceRef === 'ML2-A4-M12-DECISION-02')!.runBefore
    let resumed: StableRunState = { ...checkpoint, mainlineCalendarVersion: 4 }
    const prefix = [...resumed.manifest.conversationIds]
    for (let i = 0; i < 12 && resumed.phase === 'playing'; i++) {
      const scene = resolveScene(resumed)
      resumed = commitChoice(resumed, scene.choices[0].id)
      expect(resumed.manifest.conversationIds.slice(0, prefix.length)).toEqual(prefix)
    }
    expect(resumed.manifest.conversationIds).not.toContain('v4-machine-many')
    expect(resumed.manifest.conversationIds).toContain('v4-machine-airlock')
    expect(resumed.history.slice(0, checkpoint.history.length)).toEqual(checkpoint.history)
  })

  it('keeps the A1 identity and engineer identity across the new incidents', () => {
    expect(resolvePlayerVisibleIdentity('v4-machine-many', [])).toEqual(resolvePlayerVisibleIdentity('ml2-authored-ml2-a4-m8-ai-01', []))
    expect(resolvePlayerVisibleIdentity('v4-machine-airlock', [])).toEqual(resolvePlayerVisibleIdentity('v4-econ-cold-chain', []))
  })
})
