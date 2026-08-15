import { describe, expect, it } from 'vitest'
import { createEmptyExposureHistory, getManifestConversation } from '../content/runManifest'
import { createNonMainlineSession, resolveNonMainlineScene, commitNonMainlineChoice } from './nonMainlineSession'
import {
  ACTIVE_SURFACE_KEY,
  NON_MAINLINE_SESSION_KEY,
  persistActiveSurface,
  persistNonMainlineSession,
  readNonMainlineState,
  restoreNonMainlineSession,
  serializeNonMainlineSession,
} from './nonMainlineStorage'

function memoryStorage(seed: Record<string, string> = {}) {
  const values = new Map(Object.entries(seed))
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    values,
  }
}

describe('Non-Mainline storage and mode isolation', () => {
  it('round-trips an incomplete session without changing its selected order', () => {
    const created = createNonMainlineSession('round-trip', createEmptyExposureHistory())
    const scene = resolveNonMainlineScene(created)
    const progressed = commitNonMainlineChoice(created, scene.choices[0].id)

    const restored = restoreNonMainlineSession(serializeNonMainlineSession(progressed))

    expect(restored).toEqual(progressed)
    expect(restored?.selectedConversationIds).toEqual(created.selectedConversationIds)
  })

  it('restores a completed evaluation only when its 40 recorded conversations agree', () => {
    let session = createNonMainlineSession('completed-evaluation', createEmptyExposureHistory())
    while (session.phase === 'playing') session = commitNonMainlineChoice(session, resolveNonMainlineScene(session).choices[0].id)

    expect(session.choiceRecords).toHaveLength(session.history.length)
    expect(session.history.length).toBeGreaterThanOrEqual(40)
    expect(restoreNonMainlineSession(serializeNonMainlineSession(session))).toEqual(session)
  })

  it('stores Non-Mainline state separately from the Mainline run and meta', () => {
    const mainlineRun = '{"runId":"mainline-preserved"}'
    const mainlineMeta = '{"runCount":7}'
    const storage = memoryStorage({
      'instance:run:v1': mainlineRun,
      'instance:meta:v1': mainlineMeta,
    })
    const session = createNonMainlineSession('isolated-session', createEmptyExposureHistory())

    persistNonMainlineSession(storage, session)
    persistActiveSurface(storage, 'non-mainline')
    persistActiveSurface(storage, 'mainline')

    expect(storage.values.get('instance:run:v1')).toBe(mainlineRun)
    expect(storage.values.get('instance:meta:v1')).toBe(mainlineMeta)
    expect(storage.values.get(NON_MAINLINE_SESSION_KEY)).toBe(serializeNonMainlineSession(session))
    expect(storage.values.get(ACTIVE_SURFACE_KEY)).toBe('mainline')
  })

  it('resumes an incomplete session and safely falls back to Mainline for corruption', () => {
    const created = createNonMainlineSession('resume-session', createEmptyExposureHistory())
    const conversationId = created.selectedConversationIds[16]
    const resumable = {
      ...created,
      currentConversationIndex: 16,
      currentNodeId: getManifestConversation(conversationId)!.nodes[0].id,
    }
    const valid = memoryStorage({
      [ACTIVE_SURFACE_KEY]: 'non-mainline',
      [NON_MAINLINE_SESSION_KEY]: serializeNonMainlineSession(resumable),
    })
    const corrupt = memoryStorage({
      'instance:run:v1': '{"runId":"mainline-preserved"}',
      [ACTIVE_SURFACE_KEY]: 'non-mainline',
      [NON_MAINLINE_SESSION_KEY]: '{broken',
    })

    expect(readNonMainlineState(valid)).toEqual({ surface: 'non-mainline', session: resumable })
    expect(readNonMainlineState(corrupt)).toEqual({ surface: 'mainline', session: null })
    expect(corrupt.values.get(ACTIVE_SURFACE_KEY)).toBe('mainline')
    expect(corrupt.values.has(NON_MAINLINE_SESSION_KEY)).toBe(false)
    expect(corrupt.values.get('instance:run:v1')).toBe('{"runId":"mainline-preserved"}')
  })

  it('normalizes a stale Non-Mainline surface when its session is missing', () => {
    const storage = memoryStorage({
      'instance:run:v1': '{"runId":"mainline-preserved"}',
      [ACTIVE_SURFACE_KEY]: 'non-mainline',
    })

    expect(readNonMainlineState(storage)).toEqual({ surface: 'mainline', session: null })
    expect(storage.values.get(ACTIVE_SURFACE_KEY)).toBe('mainline')
    expect(storage.values.get('instance:run:v1')).toBe('{"runId":"mainline-preserved"}')
  })

  it('clears a semantically corrupt evaluation checkpoint before returning to Mainline', () => {
    const session = createNonMainlineSession('corrupt-evaluation', createEmptyExposureHistory())
    const storage = memoryStorage({
      [ACTIVE_SURFACE_KEY]: 'non-mainline',
      [NON_MAINLINE_SESSION_KEY]: serializeNonMainlineSession({ ...session, phase: 'evaluation', currentNodeId: 'evaluation' }),
    })

    expect(readNonMainlineState(storage)).toEqual({ surface: 'mainline', session: null })
    expect(storage.values.has(NON_MAINLINE_SESSION_KEY)).toBe(false)
  })

  it('rejects a checkpoint whose recorded sample issue is not authored', () => {
    const session = createNonMainlineSession('invalid-issue', createEmptyExposureHistory())
    const checkpoint = {
      ...session,
      choiceRecords: [{
        conversationId: session.selectedConversationIds[0],
        nodeId: session.currentNodeId,
        choiceId: 'tampered-choice',
        sampleIssue: 'invented-issue',
        attributes: {},
      }],
    }

    expect(restoreNonMainlineSession(JSON.stringify(checkpoint))).toBeNull()
  })
})
