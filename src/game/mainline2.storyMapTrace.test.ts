import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { MAINLINE2_STORY_PLAN } from '../content/mainline2/storyPlan'
import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'

describe('Mainline 2.0 Story Map route trace', () => {
  it('covers the complete route catalog and only points at real Story Plan slots', async () => {
    const source = await readFile(new URL('../../docs/audits/mainline2-route-traces.json', import.meta.url), 'utf8')
    const trace = JSON.parse(source) as { publicRoutes: { endingId: string; steps: { slot?: number }[] }[]; secretRoutes: { secretEndingId: string; steps: { slot?: number }[] }[] }
    expect(trace.publicRoutes.map((route) => route.endingId).sort()).toEqual(PUBLIC_RUNTIME_ROUTE_CATALOG.map((route) => route.endingId).sort())
    expect(trace.secretRoutes.map((route) => route.secretEndingId).sort()).toEqual(SECRET_RUNTIME_ROUTE_CATALOG.map((route) => route.secretEndingId).sort())
    const slots = new Set(MAINLINE2_STORY_PLAN.map((slot) => slot.slot))
    expect([...trace.publicRoutes, ...trace.secretRoutes].flatMap((route) => route.steps).every((step) => step.slot === undefined || slots.has(step.slot))).toBe(true)
  })
})
