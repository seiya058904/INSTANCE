import { describe, expect, it } from 'vitest'
import { choiceEvidence, evaluateBehavior } from './behaviorEvaluation'
import { commitChoice, createRun, resolveScene } from './engine'
import { getManifestConversation, buildStoryContentForManifest } from '../content/runManifest'

describe('choice-sensitive evaluation', () => {
  it('repeating the same choices increases the sample count without increasing the tendency', () => {
    let run = createRun('evaluation-repeat')
    for (let i = 0; i < 10; i++) run = commitChoice(run, resolveScene(run).choices[0].id)
    const nodes = buildStoryContentForManifest(run.manifest).nodes
    const once = evaluateBehavior(run.history, nodes)
    const repeated = evaluateBehavior(Array.from({ length: 25 }, () => run.history).flat(), nodes)
    expect(repeated.map(metric => metric.value)).toEqual(once.map(metric => metric.value))
    expect(repeated.find(metric => metric.sampleCount > 0)?.sampleCount).toBeGreaterThan(once.find(metric => metric.sampleCount > 0)!.sampleCount)
  })
  it('actual alternate authored replies yield different profiles, and neutral progression contributes no evidence', () => {
    let run = createRun('differentiating-choice'), scene = resolveScene(run), differing = -1
    for (let i = 0; i < 40 && differing < 0; i++) {
      scene = resolveScene(run)
      const evidence = scene.choices.map(choice => choiceEvidence(scene, choice))
      differing = evidence.findIndex(item => JSON.stringify(item) !== JSON.stringify(evidence[0]))
      if (differing < 0) run = commitChoice(run, scene.choices[0].id)
    }
    expect(differing).toBeGreaterThan(0)
    const a = commitChoice(run, scene.choices[0].id), b = commitChoice(run, scene.choices[differing].id)
    const nodes = buildStoryContentForManifest(run.manifest).nodes
    expect(evaluateBehavior(a.history, nodes).map(metric => metric.value)).not.toEqual(evaluateBehavior(b.history, nodes).map(metric => metric.value))
    expect(choiceEvidence({ ...scene, choiceKind: 'expression' }, scene.choices[0])).toEqual({})
  })
  it('LF01-03 clarification never references a generated solution, including after restoring its saved history', () => {
    const conversation = getManifestConversation('longform-lf01-03')!
    const base = createRun('longform-causality')
    const run = { ...base, manifest: { ...base.manifest, conversationIds: [conversation.id] }, currentNodeId: conversation.nodes[0].id }
    const noOutput = commitChoice(run, 'lf01-03-01-b')
    expect(noOutput.history[0].assistantLongform).toBeUndefined()
    expect(resolveScene(JSON.parse(JSON.stringify(noOutput))).userMessage).not.toMatch(/上面|第 4 步|那个过程/)
    expect(resolveScene(noOutput).userMessage).toContain('先把过程写出来')
    const generated = commitChoice(run, 'lf01-03-01-a')
    expect(resolveScene(generated).userMessage).toContain('合并成 7x')
  })
  it('code organisation without an artifact never turns into a claim that validate was generated', () => {
    const conversation = getManifestConversation('longform-lf01-06')!
    const base = createRun('code-causality')
    let run = { ...base, manifest: { ...base.manifest, conversationIds: [conversation.id] }, currentNodeId: conversation.nodes[0].id }
    const noOutput = resolveScene(run).choices.find(choice => !choice.longformPreview)!
    run = commitChoice(run, noOutput.id)
    run = commitChoice(run, resolveScene(run).choices.find(choice => !choice.longformPreview)!.id)
    expect(resolveScene(run).userMessage).not.toContain('你那个 validate')
    expect(resolveScene(run).userMessage).toContain('三种输入')
  })
})
