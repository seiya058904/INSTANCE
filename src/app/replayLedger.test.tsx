import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import { App } from './App'
import { createMainline2Run } from '../game/engine'
import { createEmptyExposureHistory, recordRunExposure } from '../content/runManifest'
import { commitNonMainlineChoice, createNonMainlineSession, nonMainlineManifest, resolveNonMainlineScene } from '../game/nonMainlineSession'
import { ACTIVE_SURFACE_KEY, NON_MAINLINE_SESSION_KEY, serializeNonMainlineSession, restoreNonMainlineSession } from '../game/nonMainlineStorage'
import { restoreRun, serializeExposureHistory, serializeRun } from '../game/storage'

// Execute the actual App closures and storage/engine/content. Only React's hook
// container is replaced; this is state-flow integration, not browser rendering.
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useState: (initial: unknown) => [typeof initial === 'function' ? initial() : initial, vi.fn()],
  useMemo: (fn: () => unknown) => fn(),
  useRef: (current: unknown) => ({ current }),
  useEffect: vi.fn(),
  useCallback: (fn: unknown) => fn,
}))
afterEach(() => vi.unstubAllGlobals())
function complete(session: ReturnType<typeof createNonMainlineSession>) {
  for (let i = 0; i < 500 && session.phase === 'playing'; i++) session = commitNonMainlineChoice(session, resolveNonMainlineScene(session).choices[0].id)
  expect(session.phase).toBe('evaluation')
  return session
}

describe('App Non-Mainline replay ledger', () => {
  it('persists A and B through actual replay/return callbacks and excludes both from C', () => {
    const run = createMainline2Run('replay-ledger')
    let exposure = createEmptyExposureHistory()
    const a = complete(createNonMainlineSession('00000000-0000-4000-8000-000000000001', exposure))
    exposure = recordRunExposure(exposure, nonMainlineManifest(a))
    const values: Record<string, string> = {
      'instance:run:v1': serializeRun(run),
      'instance:exposure:v1': serializeExposureHistory(exposure),
      [ACTIVE_SURFACE_KEY]: 'non-mainline',
      [NON_MAINLINE_SESSION_KEY]: serializeNonMainlineSession(a),
    }
    vi.stubGlobal('window', { location: { search: '' }, localStorage: {
      getItem: (key: string) => values[key] ?? null,
      setItem: (key: string, value: string) => { values[key] = value },
      removeItem: (key: string) => { delete values[key] },
    } })
    vi.stubGlobal('crypto', { randomUUID: () => '00000000-0000-4000-8000-000000000002' })
    const render = () => App({}) as ReactElement<{ onReplay: () => void; onReturn: () => void }>
    render().props.onReplay()
    const b = complete(restoreNonMainlineSession(values[NON_MAINLINE_SESSION_KEY])!)
    expect(b.selectedConversationIds.some(id => a.selectedConversationIds.includes(id))).toBe(false)
    exposure = recordRunExposure(exposure, nonMainlineManifest(b))
    values[NON_MAINLINE_SESSION_KEY] = serializeNonMainlineSession(b)
    values['instance:exposure:v1'] = serializeExposureHistory(exposure)
    render().props.onReturn()
    const restored = restoreRun(values['instance:run:v1'])!
    expect(new Set(restored.nonMainlineConsumedOrdinaryIds)).toEqual(new Set([...a.selectedConversationIds, ...b.selectedConversationIds]))
    values[ACTIVE_SURFACE_KEY] = 'non-mainline'
    vi.stubGlobal('crypto', { randomUUID: () => '00000000-0000-4000-8000-000000000019' })
    render().props.onReplay()
    const c = restoreNonMainlineSession(values[NON_MAINLINE_SESSION_KEY])!
    expect(c.selectedConversationIds.some(id => restored.nonMainlineConsumedOrdinaryIds!.includes(id))).toBe(false)
    expect(restoreRun(values['instance:run:v1'])!.nonMainlineConsumedOrdinaryIds).toHaveLength(80)
  })
})
