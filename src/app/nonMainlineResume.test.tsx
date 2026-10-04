import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import { App } from './App'
import { commitChoice, createMainline2Run, resolveScene } from '../game/engine'
import { createEmptyExposureHistory, getManifestConversation } from '../content/runManifest'
import { commitNonMainlineChoice, createNonMainlineSession, nonMainlineCompletedCount, resolveNonMainlineScene } from '../game/nonMainlineSession'
import { checkpointToken, loadCheckpoint, writeCheckpoint } from '../game/checkpoint'
import type { CheckpointData } from '../game/checkpoint'

// Invoke real App callbacks, checkpoint validation and engines. This replaces
// only React's hook container; the browser regression covers actual rendering.
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useState: (initial: unknown) => [typeof initial === 'function' ? initial() : initial, vi.fn()],
  useMemo: (fn: () => unknown) => fn(),
  useRef: (current: unknown) => ({ current }),
  useEffect: vi.fn(),
  useCallback: (fn: unknown) => fn,
}))
afterEach(() => vi.unstubAllGlobals())

interface ModeHandlers { onEnter: () => void; onReturn: () => void }
function controls(): ModeHandlers {
  const find = (value: unknown): ModeHandlers | undefined => {
    if (!value || typeof value !== 'object') return undefined
    const element = value as ReactElement<{ modeControls?: ReactElement<ModeHandlers>; children?: unknown }>
    if (element.props?.modeControls) return element.props.modeControls.props
    const children = element.props?.children
    for (const child of Array.isArray(children) ? children : [children]) {
      const result = find(child)
      if (result) return result
    }
    return undefined
  }
  const result = find(App({}))
  expect(result).toBeDefined()
  return result!
}

function host(data: CheckpointData) {
  const values: Record<string, string> = {}
  const storage = {
    getItem: (key: string) => values[key] ?? null,
    setItem: (key: string, value: string) => { values[key] = value },
    removeItem: (key: string) => { delete values[key] },
  }
  vi.stubGlobal('window', { location: { search: '' }, navigator: { locks: { request: (_: string, callback: () => unknown) => Promise.resolve(callback()) } }, localStorage: storage })
  vi.stubGlobal('crypto', { randomUUID: () => '00000000-0000-4000-8000-000000000091' })
  expect(writeCheckpoint(storage, checkpointToken(storage), data, 'resume-fixture').status).toBe('saved')
  expect(loadCheckpoint(storage).problem).toBeUndefined()
  return () => loadCheckpoint(storage).data!
}

function initialPair(seed = 0) {
  let run = createMainline2Run(`audit-crossmode-${seed}`)
  for (let index = 0; index < 4; index++) run = commitChoice(run, resolveScene(run).choices[0].id)
  const exposure = createEmptyExposureHistory()
  const session = createNonMainlineSession(`audit-nm-${seed}`, exposure, run.manifest.conversationIds)
  return { run, session, exposure, meta: { version: 1 as const, runCount: 1, completedEndings: [] }, surface: 'mainline' as const, nonMainlineView: 'ending' as const }
}

function pausedMainlineCollision() {
  const data = initialPair()
  data.session = commitNonMainlineChoice(data.session, resolveNonMainlineScene(data.session).choices[0].id)
  data.run.nonMainlineConsumedOrdinaryIds = data.session.selectedConversationIds.slice(0, nonMainlineCompletedCount(data.session))
  const future = data.session.selectedConversationIds.slice(data.session.currentConversationIndex + 1)
  let target: string | undefined
  for (let guard = 0; guard < 400 && data.run.phase === 'playing'; guard++) {
    const scene = resolveScene(data.run)
    if (future.includes(scene.conversationId)) target ??= scene.conversationId
    data.run = commitChoice(data.run, scene.choices[0].id)
    if (target && (data.run.phase !== 'playing' || resolveScene(data.run).conversationId !== target)) break
  }
  expect(target).toBeDefined()
  expect(data.run.history.some(entry => entry.conversationId === target)).toBe(true)
  return { data, target: target! }
}

describe('App resumes the existing Non-Mainline queue against latest mainline consumption', () => {
  it('reserves the visible first prompt even before a response, and resumes it unchanged', async () => {
    const data = initialPair()
    const visibleId = data.session.selectedConversationIds[0]
    expect(data.session.history).toHaveLength(0)
    const read = host({ ...data, surface: 'non-mainline' })
    controls().onReturn()
    await vi.waitFor(() => expect(read().surface).toBe('mainline'))
    expect(read().run.nonMainlineConsumedOrdinaryIds).toContain(visibleId)
    controls().onEnter()
    await vi.waitFor(() => expect(read().surface).toBe('non-mainline'))
    expect(read().session).toEqual(data.session)
  })

  it('replaces only an unstarted future collision, preserving partial history and reloadable checkpoint', async () => {
    const { data, target } = pausedMainlineCollision()
    const read = host(data)
    const original = JSON.stringify(data.session)
    const preservedRun = JSON.stringify(read().run)
    controls().onEnter()
    await vi.waitFor(() => expect(read().surface).toBe('non-mainline'))
    const resumed = read().session!
    expect(resumed.sessionId).toBe(data.session.sessionId)
    expect(resumed.selectedConversationIds).not.toContain(target)
    expect(new Set(resumed.selectedConversationIds).size).toBe(40)
    expect(resumed.currentConversationIndex).toBe(data.session.currentConversationIndex)
    expect(resumed.currentNodeId).toBe(data.session.currentNodeId)
    for (const field of ['history', 'choiceRecords', 'selectedChoiceIds', 'flags', 'persistentFlags', 'attributes', 'arcs', 'localState', 'seenNodeIds', 'events'] as const) {
      expect(JSON.stringify(resumed[field])).toBe(JSON.stringify(data.session[field]))
    }
    expect(JSON.stringify(data.session)).toBe(original)
    expect(JSON.stringify(read().run)).toBe(preservedRun)
    // A second render reads the real checkpoint, as a reload does.
    const beforeReturn = JSON.stringify(resumed)
    controls().onReturn()
    await vi.waitFor(() => expect(read().surface).toBe('mainline'))
    controls().onEnter()
    await vi.waitFor(() => expect(read().surface).toBe('non-mainline'))
    expect(JSON.stringify(read().session)).toBe(beforeReturn)
  })

  it('repairs a legacy unanswered current collision through the real resume callback', async () => {
    const { data, target } = pausedMainlineCollision()
    const targetIndex = data.session.selectedConversationIds.indexOf(target)
    for (let guard = 0; guard < 300 && data.session.currentConversationIndex < targetIndex; guard++) {
      data.session = commitNonMainlineChoice(data.session, resolveNonMainlineScene(data.session).choices[0].id)
    }
    expect(data.session.currentConversationIndex).toBe(targetIndex)
    expect(data.session.history.some(entry => entry.conversationId === target)).toBe(false)
    const read = host(data)
    controls().onEnter()
    await vi.waitFor(() => expect(read().surface).toBe('non-mainline'))
    const resumed = read().session!
    expect(resumed.selectedConversationIds[targetIndex]).not.toBe(target)
    expect(resumed.currentConversationIndex).toBe(targetIndex)
    expect(resumed.currentNodeId).toBe(getManifestConversation(resumed.selectedConversationIds[targetIndex])!.nodes[0].id)
    expect(JSON.stringify(resumed.history)).toBe(JSON.stringify(data.session.history))
    expect(JSON.stringify(resumed.choiceRecords)).toBe(JSON.stringify(data.session.choiceRecords))
    expect(new Set(resumed.selectedConversationIds).size).toBe(40)
  })

  it('reserves a partially answered current conversation when returning to mainline', async () => {
    const data = initialPair()
    for (let guard = 0; guard < 150; guard++) {
      const index = data.session.currentConversationIndex
      const scene = resolveNonMainlineScene(data.session)
      const continuation = scene.choices.find(choice => choice.continuation !== 'end-conversation')
      data.session = commitNonMainlineChoice(data.session, (continuation ?? scene.choices[0]).id)
      if (data.session.currentConversationIndex === index) break
    }
    const partialId = data.session.selectedConversationIds[data.session.currentConversationIndex]
    expect(data.session.history.some(entry => entry.conversationId === partialId)).toBe(true)
    expect(data.session.currentNodeId).not.toBe(getManifestConversation(partialId)!.nodes[0].id)
    const read = host({ ...data, surface: 'non-mainline' })
    controls().onReturn()
    await vi.waitFor(() => expect(read().surface).toBe('mainline'))
    expect(read().run.nonMainlineConsumedOrdinaryIds).toContain(partialId)
    expect(read().session).toEqual(data.session)
  })
})
