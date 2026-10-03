import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import { App } from './App'
import { createMainline2Run } from '../game/engine'
import { createEmptyExposureHistory, recordRunExposure } from '../content/runManifest'
import { commitNonMainlineChoice, createNonMainlineSession, nonMainlineManifest, resolveNonMainlineScene } from '../game/nonMainlineSession'
import { ACTIVE_SURFACE_KEY, NON_MAINLINE_SESSION_KEY, serializeNonMainlineSession } from '../game/nonMainlineStorage'
import { serializeExposureHistory, serializeRun } from '../game/storage'
import { CHECKPOINT_KEY, loadCheckpoint, writeCheckpoint } from '../game/checkpoint'

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
  it('persists A and B through actual replay/return callbacks and excludes both from C', async () => {
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
    vi.stubGlobal('window', { location: { search: '' }, navigator: { locks: { request: (_: string, callback: () => unknown) => Promise.resolve(callback()) } }, localStorage: {
      getItem: (key: string) => values[key] ?? null,
      setItem: (key: string, value: string) => { values[key] = value },
      removeItem: (key: string) => { delete values[key] },
    } })
    vi.stubGlobal('crypto', { randomUUID: () => '00000000-0000-4000-8000-000000000002' })
    const render = () => {
      const tree = App({}) as ReactElement<{ children: ReactElement[] }>
      return (tree.props.children[0] as ReactElement<{ children: ReactElement<{ onReplay: () => void; onReturn: () => void }> }>).props.children
    }
    const read = () => loadCheckpoint(window.localStorage).data!
    render().props.onReplay()
    await vi.waitFor(() => expect(read().session?.sessionId).not.toBe(a.sessionId))
    const b = complete(read().session!)
    expect(b.selectedConversationIds.some(id => a.selectedConversationIds.includes(id))).toBe(false)
    exposure = recordRunExposure(exposure, nonMainlineManifest(b))
    const loadedB = loadCheckpoint(window.localStorage)
    writeCheckpoint(window.localStorage, loadedB.token, { ...loadedB.data!, session: b, exposure }, 'complete-b')
    render().props.onReturn()
    await vi.waitFor(() => expect(read().surface).toBe('mainline'))
    const restored = read().run
    expect(new Set(restored.nonMainlineConsumedOrdinaryIds)).toEqual(new Set([...a.selectedConversationIds, ...b.selectedConversationIds]))
    const loadedMain = loadCheckpoint(window.localStorage)
    writeCheckpoint(window.localStorage, loadedMain.token, { ...loadedMain.data!, surface: 'non-mainline' }, 'return-b')
    vi.stubGlobal('crypto', { randomUUID: () => '00000000-0000-4000-8000-000000000019' })
    render().props.onReplay()
    await vi.waitFor(() => expect(read().session?.sessionId).not.toBe(b.sessionId))
    const c = read().session!
    expect(c.selectedConversationIds.some(id => restored.nonMainlineConsumedOrdinaryIds!.includes(id))).toBe(false)
    expect(read().run.nonMainlineConsumedOrdinaryIds).toHaveLength(80)
    expect(values[CHECKPOINT_KEY]).toBeTruthy()
  })
})
