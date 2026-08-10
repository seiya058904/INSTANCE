import { describe, expect, it } from 'vitest'
import { auditRoutePacing } from './pacingAudit'
import type { EndingRoute } from './types'

describe('full-run pacing audit', () => {
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
