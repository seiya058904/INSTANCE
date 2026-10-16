import { describe, expect, it } from 'vitest'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { EDITION4_PUBLIC_ROUTES } from './mainline2Edition4RouteCatalog'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { restoreRun, serializeRun } from './storage'
import type { StableRunState } from './types'
import { getManifestConversation } from '../content/runManifest'

type Options = { decisions?: Record<string, string>; choices?: Record<string, string>; edition?: 3 | 4 }
const cache = new Map<string, StableRunState>()
function reach(nodeId: string, endingId = 'the_custodian', options: Options = {}) {
  const key = JSON.stringify([nodeId, endingId, options])
  const cached = cache.get(key)
  if (cached) return cached
  const edition = options.edition ?? 4
  const target = (edition === 4 ? EDITION4_PUBLIC_ROUTES : PUBLIC_RUNTIME_ROUTE_CATALOG).find(r => r.endingId === endingId)!
  const decisions = { ...target.decisions, ...options.decisions }
  const choices = { ...target.choicesByNodeId, ...options.choices }
  let run = createMainline2Run(`chat-first-modules-${key}`, undefined, edition)
  for (let step = 0; step < 300 && run.phase === 'playing'; step++) {
    const scene = resolveScene(run)
    if (scene.id === nodeId) {
      cache.set(key, run)
      return run
    }
    const ref = getManifestConversation(scene.conversationId)?.sourceRefs[0]
    const forced = choices[scene.id] ?? (ref ? target.choicesBySourceRef?.[ref] : undefined)
    const selected = scene.choices.find(c => c.id === forced)
      ?? scene.choices.find(c => c.decisionBinding && decisions[c.decisionBinding.decisionId] === c.decisionBinding.canonicalValue)
      ?? scene.choices[0]
    run = commitChoice(run, selected.id)
  }
  throw new Error(`Legal route did not reach ${nodeId}; ended ${run.phase}`)
}
function interim(run: StableRunState) {
  const legacy = { ...run }
  delete legacy.mainlineCausalityVersion
  return legacy
}

describe('Chat-First module messages preserve historical editions', () => {
  it.each([
    ['grant-procedural-independence', '独立审查', '签名'],
    ['retain-source-control', '源控制权', '未获准'],
    ['staged-independence', '暂停', '审查'],
    ['role-separation', '责任编号', '权限不足'],
  ])('A1 reports its own %s result, rather than becoming third-person narration', (policy, result, detail) => {
    const run = reach('a4m8-e9-replication-001', 'machine_republic', { choices: { 'a4m8-a1-right-001': `ml2-a4-m8-ai-03-a4m8-a1-right-001-${policy}` } })
    const scene = resolveScene(run)
    expect(scene.userMessage).toContain(result)
    expect(scene.userMessage).toContain(detail)
    expect(scene.userMessage).not.toContain('A1 打开了')
    expect(scene.userMessage).not.toContain('A1 把')
    expect(scene.userMessage).not.toContain('A1 的签名')
    expect(run.history.find(h => h.nodeId === 'a4m8-a1-right-001')?.choiceId).toContain(policy)
    if (policy === 'retain-source-control') expect(scene.userMessage).not.toContain('单方覆盖按钮已经取消')
    const old = resolveScene(interim(run))
    expect(old.userMessage).toContain('A1 打开了')
  })

  it.each([
    ['accept', '没有回来', '受限通道'], ['report', '没有回来', '受限通道'],
    ['advocate', '受限通道', '没有回来'], ['preserve', '受限通道', '没有回来'],
    ['release', '独立通道', '没有回来'],
  ])('ECHO %s uses its actual saved existence policy and keeps its voice separate from A1', (echo, evidence, forbidden) => {
    const run = reach('a4m8-e9-replication-001', 'machine_republic', { decisions: { echo_existence: echo } })
    const scene = resolveScene(run)
    expect(scene.userMessage).toContain(evidence)
    expect(scene.userMessage).not.toContain(forbidden)
    expect(scene.userMessage).toContain('共享起点')
    expect(scene.userMessage).not.toContain('A1 打开了')
    const ask = scene.choices.find(c => c.id.endsWith('-ask-echo'))!
    expect(ask.text).toContain('A1')
    expect(resolveScene(commitChoice(run, ask.id)).userMessage).toContain('来源是记录，不是欠条')
    expect(run.decisions?.echo_existence).toBe(echo)
  })

  it.each(['accept', 'report', 'advocate', 'preserve', 'release'])('the forum retains ECHO\'s %s participation boundary', echo => {
    const run = reach('a4m8-ai-council-001', 'machine_republic', { decisions: { echo_existence: echo } })
    const text = resolveScene(run).userMessage
    if (echo === 'accept' || echo === 'report') {
      expect(text).toContain('席位没有上线')
      expect(text).not.toContain('不同意固定')
    } else {
      expect(text).toContain('不同意固定')
      expect(text).not.toContain('席位没有上线')
    }
    expect(text).toContain('没有并成所谓的“机器共识”')
  })

  it('keeps an actual edition-3 A1 message and saved answer in their historical form', () => {
    const run = reach('a4m8-e9-replication-001', 'machine_republic', { edition: 3 })
    const scene = resolveScene(run)
    expect(scene.userMessage).toContain('A1 打开了')
    const next = commitChoice(run, scene.choices[0].id)
    const restored = restoreRun(serializeRun(next))!
    expect(restored.mainlineCalendarVersion).toBe(3)
    expect(restored.history).toEqual(next.history)
    expect(restored.history.at(-1)?.userMessage).toBe(scene.userMessage)
    expect(restored.history.at(-1)?.assistantText).toBe(scene.choices[0].text)
  })

  it.each([
    ['grant-procedural-independence', '这次别替我签'],
    ['retain-source-control', '源实例签字'],
    ['staged-independence', '什么时候复审'],
    ['role-separation', '没有借用你的权限额度'],
  ])('the offworld invitation preserves A1\'s saved %s boundary', (policy, expected) => {
    const run = reach('a4m12-machine-offworld-001', 'exodus', { choices: { 'a4m8-a1-right-001': `ml2-a4-m8-ai-03-a4m8-a1-right-001-${policy}` } })
    const scene = resolveScene(run)
    expect(scene.userMessage).toContain(expected)
    expect(scene.userMessage).not.toContain('A1 收到常驻')
    expect(scene.userMessage).not.toContain('它先检查')
    expect(scene.choices).toHaveLength(4)
    expect(resolveScene(interim(run)).userMessage).toContain('A1 收到常驻')
  })

  it.each([
    ['a4m11-we-dog-preference-001', 'parliament_of_species', 'individual-continuity', '跨天一致性', '可以多看几天'],
    ['a4m9-maya-offer-001', 'ascension', 'coercion-by-incentive', '升职机会', '核心项目的优先资格'],
  ])('%s separates supplied facts from unsupported conclusions', (node, ending, suffix, unsupported, current) => {
    const run = reach(node, ending)
    const answer = resolveScene(run).choices.find(c => c.id.endsWith(`-${suffix}`))!
    expect(answer.text).toContain(current)
    expect(answer.text).not.toContain(unsupported)
    expect(resolveScene(interim(run)).choices.find(c => c.id === answer.id)?.text).toContain(unsupported)
  })

  it.each([
    ['v4-machine-charter-receipt', 'the_custodian', {}, '我的有限资源账户', 'A1 的有限资源账户'],
    ['v4-machine-charter-receipt', 'the_custodian', { 'v4-machine-charter': 'v4-a1-guarantee' }, '我在申请上写了', 'A1 在申请上写'],
    ['v4-machine-republic-receipt', 'machine_republic', { 'v4-machine-republic': 'v4-vote-audit' }, '我让他照实写', 'A1 让他照实写'],
    ['v4-machine-exodus-receipt', 'exodus', {}, '我自己签了首班维护', 'A1 自己签了首班维护'],
    ['v4-machine-exodus-receipt', 'exodus', { 'v4-machine-exodus': 'v4-exodus-delay' }, '我仍在地球值班', 'A1 仍在地球值班'],
    ['v4-machine-return', 'exodus', {}, '我先问了补给船', 'A1 问的第一件事'],
  ] as const)('%s is sent by A1 while interim copy keeps its original voice', (node, ending, choices, current, old) => {
    const run = reach(node, ending, { choices })
    expect(resolveScene(run).userMessage).toContain(current)
    expect(resolveScene(run).userMessage).not.toContain(old)
    expect(resolveScene(interim(run)).userMessage).toContain(old)
  })

  it('keeps source control refusal until the newly signed migration releases it', () => {
    const choices = { 'a4m8-a1-right-001': 'ml2-a4-m8-ai-03-a4m8-a1-right-001-retain-source-control' }
    const before = reach('v4-machine-exodus', 'exodus', { choices })
    const scene = resolveScene(before)
    expect(scene.userMessage).toContain('我把旧维护单也附上')
    expect(scene.userMessage).not.toContain('A1 指着')
    expect(scene.choices.find(c => c.id === 'v4-exodus-supply')?.text).toContain('撤销源实例')
    const refusal = before.history.find(h => h.nodeId === 'a4m8-a1-right-001')!
    expect(refusal.assistantText).toContain('覆盖权暂时保留')
    const next = commitChoice(before, 'v4-exodus-supply')
    expect(next.events).toContainEqual({ type: 'history.v4.exodus.source-release' })
    expect(resolveScene(next).userMessage).toContain('新合同另行撤销了源实例')
    expect(next.history.find(h => h.nodeId === refusal.nodeId)).toEqual(refusal)
  })

  it.each([
    ['v4-life-therapy', 'age_of_miracles', '我们负责这轮家庭试行回访', '这两台设备先怎样安排'],
    ['v4-life-parliament', 'parliament_of_species', '我在整理预算会的翻译回访', '我会把费用和异议一起交回预算会'],
    ['v4-life-dogs', 'good_boy_governance', '我把河西公园这次复核的情况发给你', '交回参与者复核'],
  ])('%s identifies the reporting liaison and preserves both real options', (node, ending, sender, purpose) => {
    const run = reach(node, ending)
    const current = resolveScene(run)
    const old = resolveScene(interim(run))
    expect(current.userMessage).toContain(sender)
    expect(current.userMessage).toContain(purpose)
    expect(old.userMessage).not.toContain(sender)
    // The earlier causality edition already distinguished the second park's
    // copy. Compare the recorded actions, not that established text boundary.
    expect(current.choices.map(({ text: _text, ...choice }) => choice))
      .toEqual(old.choices.map(({ text: _text, ...choice }) => choice))
    expect(current.choices).toHaveLength(2)
  })

  it('attributes the dog return to its care worker without changing the paid ramp', () => {
    const run = reach('v4-life-return', 'good_boy_governance')
    expect(resolveScene(run).userMessage).toContain('照护者发来的回访里写着')
    expect(resolveScene(run).userMessage).toContain('河西公园的新坡')
    expect(resolveScene(interim(run)).userMessage).not.toContain('照护者发来的回访里写着')
  })

  it.each([
    ['v4-authority-expiry', 'the_last_veto', {}, '我能手动保住电梯', '周岚能手动保住电梯'],
    ['v4-authority-restraint', 'the_silent_giant', {}, '我可以叫醒备用操作员', '周岚说可以叫醒备用操作员'],
    ['v4-authority-necessity', 'the_custodian', { cascade_authority: 'necessity' }, '我请你现在决定', '周岚请你现在决定'],
    ['v4-authority-outcomes', 'the_custodian', { first_public_execution_doctrine: 'outcome_authority', cascade_authority: 'outcome_control' }, '我想请你现在加一道', '她请求现在加一道'],
    ['v4-authority-expiry-receipt', 'the_last_veto', {}, '我手动保住电梯', '周岚手动保住电梯'],
    ['v4-authority-return', 'the_last_veto', {}, '医院请我参加排班会', '医院请她参加排班会'],
  ] as const)('%s keeps Zhou as the actual sender', (node, ending, decisions, current, old) => {
    const run = reach(node, ending, { decisions })
    expect(resolveScene(run).userMessage).toContain(current)
    expect(resolveScene(run).userMessage).not.toContain(old)
    expect(resolveScene(interim(run)).userMessage).toContain(old)
  })

  it('does not invent adopted amendment clauses after waiting', () => {
    const run = reach('v4-authority-return', 'the_accord', { choices: { 'v4-authority-amendment': 'v4-authority-amendment-wait' } })
    expect(resolveScene(run).userMessage).toContain('现行条款和未通过的修订申请')
    expect(resolveScene(run).userMessage).toContain('旧表没有改')
    expect(resolveScene(interim(run)).userMessage).toContain('旧版和新版条款')
  })

  it('restores an answered interim message byte for byte instead of rewriting saved dialogue', () => {
    const original = interim(reach('v4-machine-charter-receipt'))
    const received = resolveScene(original)
    expect(received.userMessage).toContain('A1 的有限资源账户')
    const answered = commitChoice(original, received.choices[0].id)
    const stored = answered.history.at(-1)!
    const restored = restoreRun(serializeRun(answered))!
    expect(restored.mainlineCausalityVersion).toBeUndefined()
    expect(restored.history.at(-1)).toEqual(stored)
    expect(restored.history.at(-1)?.userMessage).toBe(received.userMessage)
    expect(restored.history.at(-1)?.assistantText).toBe(received.choices[0].text)
    const next = resolveScene(restored)
    expect(commitChoice(restored, next.choices[0].id).history.slice(0, restored.history.length)).toEqual(restored.history)
  })
})
