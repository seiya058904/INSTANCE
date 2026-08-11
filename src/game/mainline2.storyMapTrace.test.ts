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
    expect(steps.every((step) => Array.isArray(step.capabilityMutations) && Array.isArray(step.historyMutations) && Array.isArray(step.worldMutations))).toBe(true)
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
    expect(economicNode?.prerequisite).toBeTruthy()
    expect(economicNode?.choices.length).toBeGreaterThanOrEqual(3)
    expect(economicNode?.choices.every((choice) => choice.id && choice.textZh && choice.choiceKind && choice.next && Array.isArray(choice.mutations))).toBe(true)
    expect(economicNode?.choices.some((choice) => choice.decisionId === 'economic_doctrine' && choice.canonicalValue === 'post_scarcity_transition')).toBe(true)
    expect((economicNode?.routesTraversing as string[]).sort()).toEqual(routes.filter((route) => route.steps.some((step) => step.nodeId === economicNode?.nodeId)).map((route) => (route.secretEndingId ?? route.endingId) as string).sort())

    const { compareRoutes } = await import('../../tools/mainline2-story-map-ui.mjs')
    const comparison = compareRoutes(
      trace.publicRoutes.find((route) => route.endingId === 'the_instrument') as Parameters<typeof compareRoutes>[0],
      trace.publicRoutes.find((route) => route.endingId === 'control_lost') as Parameters<typeof compareRoutes>[0],
    )
    expect(comparison.sharedHistory.length).toBeGreaterThan(0)
    expect(comparison.firstChoiceDivergence).toMatchObject({ left: { choiceId: expect.any(String) }, right: { choiceId: expect.any(String) } })
    expect(comparison.laterChoiceDivergences.length).toBeGreaterThan(0)
    expect(comparison.endingDivergence).toEqual({ left: 'the_instrument', right: 'control_lost', changed: true })
  })
})
