import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import { App } from './App'
import { commitChoice, createMainline2Run, resolveScene } from '../game/engine'
import { createEmptyExposureHistory } from '../content/runManifest'
import { checkpointToken, loadCheckpoint, writeCheckpoint } from '../game/checkpoint'
import type { CheckpointData } from '../game/checkpoint'

// Exercise the real App callbacks, storage CAS and engine. Only the React hook
// container is replaced; the matching Playwright test covers browser delivery.
const hooks = vi.hoisted(() => ({
  slots: [] as unknown[],
  cursor: 0,
  mounted: false,
  effects: [] as Array<() => void | (() => void)>,
  cleanups: [] as Array<() => void>,
}))
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useState: (initial: unknown) => {
    const index = hooks.cursor++
    if (!(index in hooks.slots)) hooks.slots[index] = typeof initial === 'function' ? initial() : initial
    return [hooks.slots[index], (value: unknown) => {
      hooks.slots[index] = typeof value === 'function' ? value(hooks.slots[index]) : value
    }]
  },
  useRef: (initial: unknown) => {
    const index = hooks.cursor++
    if (!(index in hooks.slots)) hooks.slots[index] = { current: initial }
    return hooks.slots[index]
  },
  useMemo: (fn: () => unknown) => fn(),
  useCallback: (fn: unknown) => fn,
  useEffect: (setup: () => void | (() => void)) => { if (!hooks.mounted) hooks.effects.push(setup) },
  useContext: () => () => {},
}))

afterEach(() => {
  hooks.cleanups.forEach(cleanup => cleanup())
  hooks.slots = []; hooks.cursor = 0; hooks.mounted = false; hooks.effects = []; hooks.cleanups = []
  vi.unstubAllGlobals()
})

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(done => { resolve = done })
  return { promise, resolve }
}

type Element = ReactElement<Record<string, unknown>>
function elements(value: unknown): Element[] {
  if (!value || typeof value !== 'object' || !('props' in value)) return []
  const element = value as Element
  const children = element.props.children
  return [element, ...(Array.isArray(children) ? children : [children]).flatMap(elements)]
}
function render() {
  hooks.cursor = 0
  const tree = App({})
  if (!hooks.mounted) {
    hooks.mounted = true
    for (const setup of hooks.effects) {
      const cleanup = setup()
      if (cleanup) hooks.cleanups.push(cleanup)
    }
  }
  return tree
}
function find(tree: unknown, predicate: (element: Element) => boolean) {
  const element = elements(tree).find(predicate)
  expect(element).toBeDefined()
  return element!
}
interface RecoveryHandlers {
  status: string
  onRetry: () => void
  onImport: (file: File) => Promise<void>
}
function recovery(tree: unknown) {
  return find(tree, element => typeof element.props.onImport === 'function').props as unknown as RecoveryHandlers
}

function host() {
  const values = new Map<string, string>()
  let denied = false
  let queueNext = false
  let waiting: { callback: () => unknown; resolve: (result: unknown) => void } | undefined
  const listeners = new Map<string, Set<() => void>>()
  const eventTarget = {
    addEventListener: (name: string, listener: () => void) => {
      const registered = listeners.get(name) ?? new Set<() => void>()
      registered.add(listener); listeners.set(name, registered)
    },
    removeEventListener: (name: string, listener: () => void) => { listeners.get(name)?.delete(listener) },
  }
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (denied) throw new DOMException('Injected quota failure', 'QuotaExceededError')
      values.set(key, value)
    },
  }
  const reload = vi.fn()
  vi.stubGlobal('window', {
    ...eventTarget,
    location: { search: '?qaPacing=instant', reload },
    localStorage: storage,
    navigator: { locks: { request: (_name: string, callback: () => unknown) => queueNext
      ? new Promise(resolve => { waiting = { callback, resolve } })
      : Promise.resolve(callback()) } },
  })
  vi.stubGlobal('document', eventTarget)
  const run = createMainline2Run('recovery-ownership-original')
  const data: CheckpointData = {
    run, exposure: createEmptyExposureHistory(), meta: { version: 1, runCount: 1, completedEndings: [] },
    session: null, surface: 'mainline', nonMainlineView: 'ending',
  }
  expect(writeCheckpoint(storage, checkpointToken(storage), data, 'original').status).toBe('saved')
  return {
    data, storage, reload,
    deny: (value: boolean) => { denied = value },
    queue: () => { queueNext = true },
    release: async () => {
      expect(waiting).toBeDefined()
      queueNext = false
      const transaction = waiting!
      waiting = undefined
      transaction.resolve(transaction.callback())
      await Promise.resolve(); await Promise.resolve(); await Promise.resolve()
    },
    storageChanged: () => listeners.get('storage')?.forEach(listener => listener()),
    read: () => loadCheckpoint(storage).data!,
  }
}

describe('recovery confirmation preserves the ownership of queued saves', () => {
  for (const confirmWhileBusy of [false, true]) {
    it(`${confirmWhileBusy ? 'ignores a competing confirmation and keeps its import available' : 'rejects a queued retry'} after another tab saves`, async () => {
      const fixture = host()
      const initial = render()
      const choices = resolveScene(fixture.data.run).choices
      fixture.deny(true)
      const choose = find(initial, element => typeof element.props.onChoose === 'function').props.onChoose as (id: string) => Promise<void>
      await choose(choices[0].id)
      const failed = recovery(render())
      expect(failed.status).toBe('failed')

      // File reading can finish after the user retries the failed transaction.
      const fileRead = deferred<string>()
      const imported = { ...fixture.data, run: createMainline2Run('explicit-recovery-target') }
      const importing = failed.onImport({ size: 100, text: () => fileRead.promise } as File)
      fixture.deny(false); fixture.queue(); failed.onRetry()
      fileRead.resolve(JSON.stringify({ current: imported }))
      await importing
      const awaitingLock = render()
      expect(recovery(awaitingLock).status).toBe('saving')

      const newer = { ...fixture.data, run: commitChoice(fixture.data.run, choices[1].id) }
      expect(writeCheckpoint(fixture.storage, checkpointToken(fixture.storage), newer, 'newer-tab').status).toBe('saved')
      const newerRaw = fixture.storage.getItem('instance:checkpoint:v1')
      fixture.storageChanged()
      if (confirmWhileBusy) {
        // A storage event changes the visible status to conflict while the
        // older transaction is still queued. The callback must also guard it.
        const currentConfirm = find(render(), element => element.type === 'button' && element.props.children === '确认恢复记录')
        await (currentConfirm.props.onClick as () => Promise<void>)()
      }
      await fixture.release()
      await vi.waitFor(() => expect(recovery(render()).status).toBe('conflict'))
      expect(fixture.storage.getItem('instance:checkpoint:v1')).toBe(newerRaw)
      expect(fixture.read().run.history[0].choiceId).toBe(choices[1].id)
      expect(fixture.reload).not.toHaveBeenCalled()

      // The pending import is still the same explicit record, and a fresh
      // confirmation after the queued transaction ends can apply it normally.
      const ready = render()
      const finalConfirm = find(ready, element => element.type === 'button' && element.props.children === '确认恢复记录')
      await (finalConfirm.props.onClick as () => Promise<void>)()
      await vi.waitFor(() => expect(fixture.reload).toHaveBeenCalledOnce())
      expect(fixture.read().run.runId).toBe(imported.run.runId)
      expect(fixture.read().run.history).toEqual([])
    })
  }
})
