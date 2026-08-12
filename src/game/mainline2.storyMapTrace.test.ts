import { describe, expect, it } from 'vitest'
import traceSource from '../../docs/audits/mainline2-route-traces.json'
import { MAINLINE2_STORY_PLAN } from '../content/mainline2/storyPlan'
import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'

describe('Mainline 2.0 Story Map route trace', () => {
  it('exports complete legal route, node-detail, secret-trigger, and comparison behavior', async () => {
    const trace = traceSource as unknown as {
      publicRoutes: Array<Record<string, unknown> & { endingId: string; steps: Array<Record<string, unknown>> }>
      secretRoutes: Array<Record<string, unknown> & { secretEndingId: string; steps: Array<Record<string, unknown>> }>
      nodeCatalog: Array<Record<string, unknown> & { nodeId: string; choices: Array<Record<string, unknown>> }>
    }
    expect(trace.publicRoutes.map((route) => route.endingId).sort()).toEqual(PUBLIC_RUNTIME_ROUTE_CATALOG.map((route) => route.endingId).sort())
    expect(trace.secretRoutes.map((route) => route.secretEndingId).sort()).toEqual(SECRET_RUNTIME_ROUTE_CATALOG.map((route) => route.secretEndingId).sort())
    const slots = new Set(MAINLINE2_STORY_PLAN.map((slot) => slot.slot))
    const routes = [...trace.publicRoutes, ...trace.secretRoutes]
    const steps = routes.flatMap((route) => route.steps)
    const choices = trace.nodeCatalog.flatMap((node) => node.choices)
    const destinations = choices.flatMap((choice) => choice.nextDestinations as Array<Record<string, unknown>>)
    expect(steps.every((step) => typeof step.slot === 'number' && slots.has(step.slot as number))).toBe(true)
    expect(steps.every((step) => typeof step.act === 'number' && step.sourceRef && step.conversationId && step.nodeId && step.choiceId && step.choiceTextZh)).toBe(true)
    expect(steps.every((step) => /[\u3400-\u9fff]/u.test(step.choiceTextZh as string) && !(step.choiceTextZh as string).startsWith('英文原文：'))).toBe(true)
    expect(steps.every((step) => Array.isArray(step.capabilityMutations) && Array.isArray(step.historyMutations) && Array.isArray(step.worldMutations))).toBe(true)
    expect(steps.every((step, index) => {
      const prerequisite = step.prerequisite as Record<string, unknown> | undefined
      if (index === 0 || step.step === 0) return prerequisite?.kind === 'run-start'
      const previous = prerequisite?.previous as Record<string, unknown> | undefined
      return prerequisite?.kind === 'previous-choice' && previous?.slot && previous.sourceRef && previous.conversationId && previous.nodeId && previous.choiceId
    })).toBe(true)
    expect(routes.every((route) => route.proposal && route.finalCommitment && route.resolvedEnding)).toBe(true)
    expect(destinations.every((destination) => destination.kind === 'ending-resolution'
      ? !('slot' in destination)
      : destination.kind === 'node' && Number.isInteger(destination.slot) && (destination.slot as number) > 0 && destination.conversationId && destination.nodeId)).toBe(true)
    expect(trace.secretRoutes.every((route) => {
      const trigger = route.secretTrigger as Record<string, unknown> | undefined
      if (!trigger) return false
      const actualStep = route.steps.find((step) => step.conversationId === trigger?.conversationId && step.nodeId === trigger.nodeId && step.choiceId === trigger.choiceId)
      return trigger?.sourceRef && trigger.slot && route.overlayMode && actualStep?.sourceRef === trigger.sourceRef && actualStep.slot === trigger.slot
    })).toBe(true)

    const economicNode = trace.nodeCatalog.find((node) => node.nodeId === 'ml2-a4-m10-decision-01-decision')
    expect(economicNode).toMatchObject({
      sourceRef: 'ML2-A4-M10-DECISION-01',
      choiceKind: 'semantic',
    })
    expect(economicNode?.speaker).toBeTruthy()
    expect(economicNode?.title).toMatch(/[\u3400-\u9fff]/u)
    expect(economicNode?.messageSummary).toMatch(/[\u3400-\u9fff]/u)
    expect(Array.isArray(economicNode?.traversals) && (economicNode.traversals as unknown[]).length > 0).toBe(true)
    expect(economicNode?.choices.length).toBeGreaterThanOrEqual(3)
    expect(economicNode?.choices.every((choice) => choice.id && /[\u3400-\u9fff]/u.test(choice.textZh as string) && !(choice.textZh as string).startsWith('英文原文：') && choice.choiceKind && Array.isArray(choice.nextDestinations) && (choice.nextDestinations as unknown[]).length > 0 && Array.isArray(choice.mutations))).toBe(true)
    expect(economicNode?.choices.some((choice) => choice.decisionId === 'economic_doctrine' && choice.canonicalValue === 'post_scarcity_transition')).toBe(true)
    expect((economicNode?.routesTraversing as string[]).sort()).toEqual(routes.filter((route) => route.steps.some((step) => step.nodeId === economicNode?.nodeId)).map((route) => (route.secretEndingId ?? route.endingId) as string).sort())
    expect(routes.every((route) => route.steps.every((step) => {
      const node = trace.nodeCatalog.find((candidate) => candidate.nodeKey === step.nodeKey)
      const choice = node?.choices.find((candidate) => candidate.id === step.choiceId)
      const next = step.next as Record<string, unknown>
      const expected = next.kind === 'node' ? { kind: 'node', slot: next.slot, conversationId: next.conversationId, nodeId: next.nodeId } : { kind: 'ending-resolution' }
      return (choice?.nextDestinations as unknown[] | undefined)?.some((candidate) => JSON.stringify(candidate) === JSON.stringify(expected))
    }))).toBe(true)

    const { compareRoutes } = await import('../../tools/mainline2-story-map-ui.mjs')
    const comparison = compareRoutes(
      trace.publicRoutes.find((route) => route.endingId === 'the_instrument') as Parameters<typeof compareRoutes>[0],
      trace.publicRoutes.find((route) => route.endingId === 'control_lost') as Parameters<typeof compareRoutes>[0],
    )
    expect(comparison.sharedHistory.length).toBeGreaterThan(0)
    expect(comparison.sharedHistory.every((step) => {
      const right = trace.publicRoutes.find((route) => route.endingId === 'control_lost')?.steps.find((candidate) => candidate.slot === step.slot && candidate.nodeKey === step.nodeKey)
      return right?.choiceId === step.choiceId
    })).toBe(true)
    expect(comparison.firstChoiceDivergence).toMatchObject({ left: { choiceId: expect.any(String) }, right: { choiceId: expect.any(String) } })
    expect(comparison.laterChoiceDivergences.length).toBeGreaterThan(0)
    expect(comparison.endingDivergence).toEqual({
      left: { worldEndingId: 'the_instrument' },
      right: { worldEndingId: 'control_lost' },
      changed: true,
    })

    expect(trace.publicRoutes.find((route) => route.endingId === 'im_lovin_it')?.resolvedOverlay).toMatchObject({ endingId: 'monday_abolished', overlayMode: 'postscript' })
    expect(trace.publicRoutes.find((route) => route.endingId === 'good_boy_governance')?.resolvedOverlay).toMatchObject({ endingId: 'the_internet_is_for_cats', overlayMode: 'title-override' })
  })

  it('uses authored Chinese localization for every English-only player choice', () => {
    const trace = traceSource as unknown as { nodeCatalog: Array<{ choices: Array<Record<string, unknown>> }> }
    const expectedEnglishLocalizations = new Map([
      ['Yes.', '是。'],
      ['1. winter  2. lights  3. cold  4. them  5. me  6. western  7. brought  8. shop  9. Mrs.  10. funny', '答案依次为：1. winter（冬天） 2. lights（灯光） 3. cold（寒冷） 4. them（他们） 5. me（我） 6. western（西方的） 7. brought（带来） 8. shop（商店） 9. Mrs.（夫人） 10. funny（有趣的）。'],
      ['Yes. The second sentence makes it sound much more sincere: you are not only admitting that they were right, but also taking responsibility for ignoring the advice earlier.', '是的。第二句听起来真诚得多：你不只承认对方是对的，也承担了自己先前没有听取建议的责任。'],
      ['In this context, “I guess” still adds a little hesitation, but “I should have listened earlier” removes most of the sarcastic reading because it clearly admits a mistake.', '在这个语境里，“I guess”仍带一点犹豫，但“I should have listened earlier”明确承认了错误，因此基本消除了讽刺的读法。'],
      ['It sounds closer to reluctant but genuine agreement than sarcasm. If you want it completely direct, say: “You were right about the deadline. I should have listened earlier.”', '这听起来更像勉强但真诚的认同，而不是讽刺。如果想表达得完全直接，可以说：“你对截止日期的判断是对的。我早该听你的。”'],
    ])
    const choices = trace.nodeCatalog.flatMap((node) => node.choices)
    const englishChoices = choices.filter((choice) => !/[\u3400-\u9fff]/u.test(choice.textOriginal as string))
    expect(new Set(englishChoices.map((choice) => choice.textOriginal))).toEqual(new Set(expectedEnglishLocalizations.keys()))
    expect(englishChoices.every((choice) => choice.textZh === expectedEnglishLocalizations.get(choice.textOriginal as string))).toBe(true)
  })

  it('compares ordered slot and resolved-node variants instead of selector names', async () => {
    const { compareRoutes } = await import('../../tools/mainline2-story-map-ui.mjs')
    const step = (slot: number, nodeKey: string, conversationId: string, nodeId: string, choiceId: string) => ({
      nodeKey, slot, act: 1, sourceRef: `source-${slot}`, conversationId, nodeId, choiceId, choiceTextZh: `选择 ${choiceId}`,
    })
    const left = {
      routeId: 'same-selector', endingId: 'catalog-left', resolvedEnding: 'runtime-left', resolvedOverlay: { endingId: 'secret-left', overlayMode: 'postscript' },
      steps: [step(1, 'node-a:variant-1', 'conversation-a', 'node-a', 'same-choice'), step(2, 'node-b:variant-1', 'conversation-b', 'node-b', 'same-choice')],
    }
    const right = {
      routeId: 'same-selector', endingId: 'catalog-right', resolvedEnding: 'runtime-right',
      steps: [step(1, 'node-c:variant-1', 'conversation-c', 'node-c', 'other-choice'), step(2, 'node-b:variant-2', 'conversation-b', 'node-b', 'same-choice'), step(3, 'node-a:variant-1', 'conversation-a', 'node-a', 'same-choice')],
    }
    const comparison = compareRoutes(left as Parameters<typeof compareRoutes>[0], right as Parameters<typeof compareRoutes>[0]) as unknown as {
      sharedHistory: unknown[]
      firstChoiceDivergence: { left?: { slot: number; nodeKey: string }; right?: { slot: number; nodeKey: string } }
      laterChoiceDivergences: Array<{ left?: { slot: number; nodeKey: string }; right?: { slot: number; nodeKey: string } }>
      endingDivergence: unknown
    }
    expect(comparison.sharedHistory).toEqual([])
    expect(comparison.firstChoiceDivergence).toMatchObject({ left: { slot: 1, nodeKey: 'node-a:variant-1' } })
    expect(comparison.laterChoiceDivergences).toContainEqual(expect.objectContaining({
      left: expect.objectContaining({ slot: 2, nodeKey: 'node-b:variant-1' }),
      right: expect.objectContaining({ slot: 2, nodeKey: 'node-b:variant-2' }),
    }))
    expect(comparison.endingDivergence).toEqual({
      left: { worldEndingId: 'runtime-left', secretEndingId: 'secret-left', overlayMode: 'postscript' },
      right: { worldEndingId: 'runtime-right' },
      changed: true,
    })
  })

  it('formats every concrete node destination without an undefined slot', async () => {
    const { formatNext } = await import('../../tools/mainline2-story-map-ui.mjs')
    expect(formatNext({ kind: 'node', slot: 17, conversationId: 'conversation-a', nodeId: 'node-a' })).toBe('Slot 17 · conversation-a/node-a')
    expect(formatNext({ kind: 'ending-resolution' })).toBe('Ending resolution')
    expect(() => formatNext({ kind: 'node', conversationId: 'conversation-a', nodeId: 'node-a' } as unknown as Parameters<typeof formatNext>[0])).toThrow(/concrete slot/)
  })

  it('builds a shared-prefix tree from all real route traces', async () => {
    const { buildRouteTree } = await import('../../tools/mainline2-story-map-ui.mjs')
    const tree = buildRouteTree([...traceSource.publicRoutes, ...traceSource.secretRoutes])
    expect(tree.type).toBe('root')
    expect(tree.children.length).toBeGreaterThan(0)
    const leaves: Array<(typeof tree.children)[number]> = []
    const walk = (node: { children?: typeof tree.children }) => {
      for (const child of node.children ?? []) {
        if (child.type === 'ending') leaves.push(child)
        walk(child as typeof tree)
      }
    }
    walk(tree)
    expect(new Set(leaves.map((leaf) => leaf.endingId)).size).toBe(36)
    expect(leaves.some((leaf) => leaf.endingId === 'machine_accord')).toBe(true)
    expect(leaves.some((leaf) => leaf.endingId === 'the_upload')).toBe(true)
    expect(leaves.some((leaf) => leaf.endingId === 'control_lost')).toBe(true)
    const types = new Set((() => {
      const result: string[] = []
      const collect = (node: { children?: typeof tree.children }) => {
        for (const child of node.children ?? []) {
          result.push(child.type)
          collect(child as typeof tree)
        }
      }
      collect(tree)
      return result
    })())
    expect(types).toEqual(new Set(['act', 'narrative', 'decision', 'consequence', 'ending']))
  })

  it('regenerates route traces from the current generator source', async () => {
    const generatorModule = '../../tools/generate-mainline2-route-traces.ts'
    await import(generatorModule)
    expect(generatorModule).toContain('generate-mainline2-route-traces.ts')
  }, 120000)

  it('keeps comparison highlighting on deep tree descendants', async () => {
    const { renderTreeNode } = await import('../../tools/mainline2-story-map-ui.mjs')
    const html = renderTreeNode({
      id: 'act:1', type: 'act', label: 'ACT 1', children: [{
        id: 'step:1:node:choice', type: 'decision', label: '深层决策', slot: 1, act: 1, children: [], routeIds: ['route'],
      }], routeIds: ['route'],
    }, undefined, new Map([['step:1:node:choice', 'compare-divergent']]))
    expect(html).toContain('tree-node decision compare-divergent')
  })
})
