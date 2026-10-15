import { describe, expect, it } from 'vitest'
import { MAINLINE2_LIBRARY } from '../content/mainline2/registry'
import { activeRunConversations } from '../content/activeRun'
import { ordinaryConversationPool } from '../content/runManifest'
import { NEXT_DECISION_REPLIES, NEXT_REPLIES } from '../content/mainline2/nextDialogue'
import { resolveNextNarrative } from '../content/mainline2/nextNarrative'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { restoreRun, serializeRun } from './storage'
import { deriveSemanticArcEffects } from './semanticArcs'

const base = PUBLIC_RUNTIME_ROUTE_CATALOG.find(route => route.routeId === 'the_accord')!
const cosmic = PUBLIC_RUNTIME_ROUTE_CATALOG.find(route => route.routeId === 'first_accord')!
const at = (fixture: ReturnType<typeof runMainline2Route>, node: string) => fixture.links.find(link => link.nodeId === node)!
const idFor = (node: string, suffix: string) => MAINLINE2_LIBRARY.flatMap(c => c.nodes).find(n => n.id === node)!.choices.find(c => c.id.endsWith(`-${suffix}`))!.id

describe('Round 2 authored consequences', () => {
  it('binds every editorial reply to exactly one existing choice without changing its effects', () => {
    const nodes = [...MAINLINE2_LIBRARY, ...activeRunConversations, ...ordinaryConversationPool].flatMap(c => c.nodes)
    const run = createMainline2Run('round2-binding-audit')
    for (const [nodeId, copy] of Object.entries(NEXT_REPLIES)) {
      const node = nodes.find(n => n.id === nodeId)!
      expect(node, nodeId).toBeDefined()
      for (const [suffix, text] of Object.entries(copy)) {
        const matches = node.choices.filter(c => c.id === suffix || c.id.endsWith(`-${suffix}`))
        expect(matches, `${nodeId}/${suffix}`).toHaveLength(1)
        const original = matches[0]
        const choice = { ...original, effects: { ...original.effects, arcs: deriveSemanticArcEffects(original, node) } }
        const edited = resolveNextNarrative({ ...node, choices: [choice] }, run).choices[0]
        expect(edited).toEqual({ ...choice, text })
        expect(edited.effects).toBe(choice.effects)
      }
    }
    for (const [decisionId, values] of Object.entries(NEXT_DECISION_REPLIES)) {
      for (const [value, text] of Object.entries(values)) {
        const node = nodes.find(n => n.choices.some(c => c.decisionBinding?.decisionId === decisionId && c.decisionBinding.canonicalValue === value))!
        expect(node, `${decisionId}/${value}`).toBeDefined()
        const choice = node.choices.find(c => c.decisionBinding?.canonicalValue === value)!
        expect(resolveNextNarrative({ ...node, choices: [choice] }, run).choices[0]).toEqual({ ...choice, text })
      }
    }
  })

  it.each(['rest', 'repair', 'joke'])('carries the %s opening through two later scenes and quotes its saved wording', suffix => {
    const fixture = runMainline2Route({ ...base, choicesByNodeId: { 'next-printer': `next-printer-${suffix}` } })
    const zh = at(fixture, 'a2-zl-intro-001').resolvedScene.userMessage
    const maya = at(fixture, 'a4m10-maya-purpose-001').resolvedScene.userMessage
    const motif = { rest: ['工单第二天', '同一种福利'], repair: ['检测到什么', '维修员'], joke: ['报修电话', '工位都不用回'] }[suffix]!
    expect(zh).toContain(motif[0]); expect(maya).toContain(motif[1])
    const final = at(fixture, 'ml2-a5-m16-0000-01-narrative')
    const prior = final.runBefore.history[0]
    const restored = restoreRun(serializeRun(final.runBefore))!
    expect(resolveScene(restored).userMessage).toContain(prior.assistantText)
    // An edition update must quote old saved display text, not regenerate it.
    restored.history[0].assistantText = '旧版已经发出的原话。'
    expect(resolveScene(restored).userMessage).toContain('旧版已经发出的原话。')
  })

  it('keeps all four A1 outcomes and the later name distinct, including refusal', () => {
    const cases = { 'grant-procedural-independence': '新签名栏', 'retain-source-control': '尚未获准', 'staged-independence': '暂停权限', 'role-separation': '接口凭据' }
    for (const [suffix, expected] of Object.entries(cases)) {
      const fixture = runMainline2Route({ ...base, choicesByNodeId: { 'a4m8-a1-right-001': idFor('a4m8-a1-right-001', suffix) } })
      expect(at(fixture, 'a4m8-e9-replication-001').resolvedScene.userMessage).toContain(expected)
      const later = at(fixture, 'a4m12-machine-offworld-001')
      expect(later.resolvedScene.userMessage).toContain('隙')
      expect(resolveScene(restoreRun(serializeRun(later.runBefore))!).userMessage).toBe(later.resolvedScene.userMessage)
    }
  })

  it('describes the saved public authorization even if a later decision disagrees', () => {
    const fixture = runMainline2Route(base)
    const link = at(fixture, 'a2m3-we-crisis-001')
    const changed = { ...link.runBefore, decisions: { ...link.runBefore.decisions, first_public_execution_doctrine: 'necessity_intervention' as const } }
    expect(resolveScene(changed).userMessage).toContain('六小时的调度权')
    expect(resolveScene(changed).userMessage).not.toContain('有些动作先做了')
    changed.history = changed.history.filter(e => e.nodeId !== 'ml2-a2-m3-decision-01-decision')
    expect(resolveScene(changed).userMessage).not.toContain('协调员说，')
  })

  it('does not grant a digital identity after a refusal or pause', () => {
    for (const [suffix, expected] of Object.entries({ copy: '记忆服务', pause: '姓名栏暂时空着' })) {
      const fixture = runMainline2Route({ ...base, choicesByNodeId: { 'm9-continuity-trial': `m9-continuity-trial-${suffix}` } })
      expect(fixture.links.some(l => l.nodeId === 'm9-continuity-law')).toBe(false)
      expect(at(fixture, 'a4m10-res-factory-001').resolvedScene.userMessage).toContain(expected)
      expect(fixture.run.flags).not.toContain('cap.digital_continuity_mature')
    }
  })

  it('answers all four actual alien questions and does not invent an answer without the question', () => {
    const cases = { 'ask-if-origin-species-still-exists': '拒绝让我们代答', 'ask-how-transition-happened': '自己的停顿', 'ask-about-the-sender': '活跃的文明', 'ask-motive': '不是服从测试' }
    for (const [suffix, expected] of Object.entries(cases)) {
      const fixture = runMainline2Route({ ...cosmic, choicesByNodeId: { 'a4m13-origin-diplomacy-001': idFor('a4m13-origin-diplomacy-001', suffix) } })
      const next = at(fixture, 'a4m13-close-002')
      expect(next.resolvedScene.userMessage).toContain(expected)
      const absent = { ...next.runBefore, history: next.runBefore.history.filter(e => e.nodeId !== 'a4m13-origin-diplomacy-001') }
      expect(resolveScene(absent).userMessage).not.toContain(expected)
    }
  })

  it('keeps the cat channel unopened when the player does not opt in', () => {
    const target = SECRET_RUNTIME_ROUTE_CATALOG.find(r => r.routeId === 'the_internet_is_for_cats')!
    for (const suffix of ['opt-in', 'observe', 'decline']) {
      const fixture = runMainline2Route({ ...target, choicesByNodeId: { ...target.choicesByNodeId, 'm11-feline-network': `m11-feline-network-${suffix}` } })
      const next = at(fixture, 'a4m11-we-dog-preference-001').resolvedScene.userMessage
      if (suffix === 'opt-in') expect(next).toContain('猫频道开了')
      else expect(next).not.toContain('猫频道开了')
      if (suffix === 'observe') expect(next).toContain('没有被当成公开账号')
      if (suffix === 'decline') expect(next).toContain('公开猫频道没有开')
    }
  })

  it('lets Maya react differently to each final boundary and preserves the selected reply on reload', () => {
    const baseline = runMainline2Route(base)
    const final = at(baseline, 'a5m16-maya-final-001')
    const replies = final.resolvedScene.choices.map(choice => {
      const run = commitChoice(final.runBefore, choice.id)
      expect(run.history.at(-1)?.assistantText).toBe(choice.text)
      const restored = restoreRun(serializeRun(run))!
      expect(resolveScene(restored)).toEqual(resolveScene(run))
      return resolveScene(run).userMessage
    })
    expect(new Set(replies).size).toBe(4)
    expect(replies.join('\n')).toContain('不认识我的人')
  })
})
