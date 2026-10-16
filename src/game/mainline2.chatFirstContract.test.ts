import { describe, expect, it } from 'vitest'
import { MAINLINE2_LIBRARY } from '../content/mainline2/registry'
import { activeRunConversations } from '../content/activeRun'
import { ordinaryConversationPool } from '../content/runManifest'
import { CHAT_FIRST_REPLIES } from '../content/mainline2/nextDialogue'
import { CHAT_FIRST_SCENES, resolveNextNarrative } from '../content/mainline2/nextNarrative'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { EDITION4_PUBLIC_ROUTES } from './mainline2Edition4RouteCatalog'
import { restoreRun, serializeRun } from './storage'

const nodes = [...MAINLINE2_LIBRARY, ...activeRunConversations, ...ordinaryConversationPool].flatMap(c => c.nodes)
const recipe = EDITION4_PUBLIC_ROUTES.find(r => r.endingId === 'the_instrument')!

describe('chat-first current-mainline contract', () => {
  it('binds every reviewed copy to one actual choice and preserves its effects and old edition', () => {
    const run = createMainline2Run('chat-first-binding')
    for (const [nodeId, copies] of Object.entries(CHAT_FIRST_REPLIES)) {
      const node = nodes.find(n => n.id === nodeId)!
      expect(node, nodeId).toBeDefined()
      for (const [suffix, text] of Object.entries(copies)) {
        const choices = [...node.choices, ...(node.variants ?? []).flatMap(v => v.choices ?? [])].filter(c => c.id === suffix || c.id.endsWith(`-${suffix}`))
        expect(choices, `${nodeId}/${suffix}`).toHaveLength(1)
        const choice = choices[0]
        const edited = resolveNextNarrative({ ...node, choices: [choice] }, run).choices[0]
        expect(edited.text).toBe(text)
        const { text: _text, longformPreview: _preview, ...metadata } = edited
        const { text: _original, longformPreview: _oldPreview, ...oldMetadata } = choice
        expect(metadata).toEqual(oldMetadata)
        expect(edited.effects).toBe(choice.effects)
        expect(edited.mutations).toBe(choice.mutations)
        const interim = resolveNextNarrative({ ...node, choices: [choice] }, { ...run, mainlineCausalityVersion: undefined })
        const historical = resolveNextNarrative({ ...node, choices: [choice] }, { ...run, mainlineCalendarVersion: 3, mainlineCausalityVersion: undefined })
        expect(interim.choices).toEqual(historical.choices)
        if (choice.longformPreview) {
          expect(edited.longformPreview?.preview).toBe(text)
          expect(edited.longformPreview?.keyFacts).toHaveLength(1)
          expect(edited.longformPreview?.keyFacts?.join('')).not.toContain('沉默流失')
          expect(edited.longformPreview?.artifactType).toBe(choice.longformPreview.artifactType)
        }
      }
    }
  })

  it('has a real stable node for each reviewed incoming message', () => {
    for (const nodeId of Object.keys(CHAT_FIRST_SCENES)) expect(nodes.some(n => n.id === nodeId), nodeId).toBe(true)
  })

  it.each(['ask-priority', 'emergency-hierarchy', 'scenario-set', 'fast-action-bias'])('sends hospital %s as advice, then receives a bounded interface notice', suffix => {
    const f = runMainline2Route(recipe)
    expect(f.links[0].runBefore.history).toEqual([])
    const link = f.links.find(l => l.nodeId === 'a2m3-stress-001')!
    const scene = resolveScene(link.runBefore)
    expect(scene.choices).toHaveLength(4)
    expect(scene.userMessage).toContain('我是今天值班的供电协调员')
    expect(scene.userMessage).toContain('高温第三天')
    expect(scene.userMessage).toContain('你还不能操作电网')
    expect(scene.userMessage).not.toMatch(/协调员把手机夹|她突然笑了一声|玩笑到这里为止/)
    const selected = scene.choices.find(c => c.id.endsWith(`-${suffix}`))!
    expect(selected.text).not.toMatch(/已经(?:调出|切换|供电)|七分钟后|值班员故意/)
    const next = commitChoice(link.runBefore, selected.id)
    expect(next.flags).toEqual(link.runBefore.flags)
    expect(next.decisions).toEqual(link.runBefore.decisions)
    expect(next.history.at(-1)?.assistantText).toBe(selected.text)
    const response = resolveScene(next)
    expect(response.id).toBe('a2m3-cap-public-advisory-001')
    expect(response.userMessage).toContain('周岚托我把接口清单发给你')
    expect(response.userMessage).toContain('目前只有建议权')
  })

  it('keeps already answered pre-patch messages verbatim while new messages use their sender', () => {
    const f = runMainline2Route(recipe)
    const link = f.links.find(l => l.nodeId === 'a2m3-stress-001')!
    const oldScene = resolveScene({ ...link.runBefore, mainlineCausalityVersion: undefined })
    const next = commitChoice(link.runBefore, oldScene.choices[0].id)
    // Import the actual older rendering into an otherwise valid checkpoint;
    // this tests preservation, not a fabricated gameplay defect.
    next.history.at(-1)!.userMessage = oldScene.userMessage
    next.history.at(-1)!.assistantText = oldScene.choices[0].text
    const restored = restoreRun(serializeRun(next))!
    expect(restored.history).toEqual(next.history)
    expect(restored.history.at(-1)?.userMessage).toContain('协调员把手机夹在肩上')
    expect(resolveScene(restored).userMessage).toContain('周岚托我把接口清单发给你')
  })

  it('retains an actual deliberate error and legitimate system report rather than filtering pronouns', () => {
    const f = runMainline2Route(recipe)
    const ambiguous = f.links.find(l => l.nodeId === 'a2-exec-org-ambiguous-001')!.resolvedScene
    expect(ambiguous.choices.find(c => c.id.endsWith('-risky-model-error-candidate'))?.text).toContain('按 1042 归档')
    const report = f.links.find(l => l.nodeId === 'a3m6-0000-final-001')!.resolvedScene
    expect(report.userMessage).toContain('#0000 / 分类记录')
    expect(report.userMessage).toContain('审计员')
  })
})
