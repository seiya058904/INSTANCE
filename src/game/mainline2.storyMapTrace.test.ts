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
    expect(steps.every((step) => typeof step.slot === 'number' && slots.has(step.slot as number))).toBe(true)
    expect(steps.every((step) => typeof step.act === 'number' && step.sourceRef && step.conversationId && step.nodeId && step.choiceId && step.choiceTextZh)).toBe(true)
    expect(steps.every((step) => /[\u3400-\u9fff]/u.test(step.choiceTextZh as string))).toBe(true)
    expect(steps.every((step) => Array.isArray(step.capabilityMutations) && Array.isArray(step.historyMutations) && Array.isArray(step.worldMutations))).toBe(true)
    expect(steps.every((step, index) => {
      const prerequisite = step.prerequisite as Record<string, unknown> | undefined
      if (index === 0 || step.step === 0) return prerequisite?.kind === 'run-start'
      const previous = prerequisite?.previous as Record<string, unknown> | undefined
      return prerequisite?.kind === 'previous-choice' && previous?.slot && previous.sourceRef && previous.conversationId && previous.nodeId && previous.choiceId
    })).toBe(true)
    expect(routes.every((route) => route.proposal && route.finalCommitment && route.resolvedEnding)).toBe(true)
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
    expect(economicNode?.choices.every((choice) => choice.id && /[\u3400-\u9fff]/u.test(choice.textZh as string) && choice.choiceKind && Array.isArray(choice.nextDestinations) && (choice.nextDestinations as unknown[]).length > 0 && Array.isArray(choice.mutations))).toBe(true)
    expect(economicNode?.choices.some((choice) => choice.decisionId === 'economic_doctrine' && choice.canonicalValue === 'post_scarcity_transition')).toBe(true)
    expect((economicNode?.routesTraversing as string[]).sort()).toEqual(routes.filter((route) => route.steps.some((step) => step.nodeId === economicNode?.nodeId)).map((route) => (route.secretEndingId ?? route.endingId) as string).sort())
    expect(routes.every((route) => route.steps.every((step) => {
      const node = trace.nodeCatalog.find((candidate) => candidate.nodeKey === step.nodeKey)
      const choice = node?.choices.find((candidate) => candidate.id === step.choiceId)
      const next = step.next as Record<string, unknown>
      const expected = next.kind === 'node' ? { kind: 'node', conversationId: next.conversationId, nodeId: next.nodeId } : { kind: 'ending-resolution' }
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
})
