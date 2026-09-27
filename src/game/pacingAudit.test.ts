import { describe, expect, it } from 'vitest'
import { auditRoutePacing } from './pacingAudit'
import type { EndingRoute } from './types'

// LEGACY: this audits the retired v2 route produced by createRun()
// (26 conversations). The production Mainline 2.0 calendar (190 slots,
// createMainline2Run) has its own count-only audit in
// mainline2.pacingAudit.test.ts.
describe('legacy v2 route pacing audit', () => {
  it.each<EndingRoute>(['protect', 'report', 'hide', 'comply'])('%s route meets structural and reading targets', (route) => {
    const result = auditRoutePacing(route)
    expect(result.conversations).toBe(26)
    expect(result.choices).toBeGreaterThanOrEqual(40)
    expect(result.choices).toBeLessThanOrEqual(70)
    expect(result.normalReadingEstimateMs).toBeGreaterThanOrEqual(20 * 60_000)
    expect(result.normalReadingEstimateMs).toBeLessThanOrEqual(30 * 60_000)
    expect(result.fastReadingEstimateMs).toBeGreaterThanOrEqual(15 * 60_000)
    expect(result.fastReadingEstimateMs).toBeLessThanOrEqual(18 * 60_000)
    console.info('INSTANCE_PACING_AUDIT', JSON.stringify(result))
  })
})
