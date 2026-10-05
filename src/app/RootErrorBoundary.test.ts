import { describe, expect, it } from 'vitest'
import { clearRunForRecovery } from './RootErrorBoundary'
import { CHECKPOINT_KEY, checkpointToken, loadCheckpoint } from '../game/checkpoint'
import { createMainline2Run, createRun, resolveScene } from '../game/engine'
import { createEmptyExposureHistory, recordRunExposure } from '../content/runManifest'

function fixture() {
  const previous = createMainline2Run('recovery-previous')
  const exposure = recordRunExposure(createEmptyExposureHistory(), createRun('recovery-prior').manifest)
  const data = {
    run: previous, meta: { version: 1 as const, runCount: 4, completedEndings: ['The Accord'] },
    exposure, session: null, surface: 'mainline', nonMainlineView: 'ending',
  }
  const values = new Map([
    [CHECKPOINT_KEY, JSON.stringify({ version: 1, revision: 'previous', data })],
    ['instance:run:v1', JSON.stringify(previous)],
    ['instance:meta:v1', JSON.stringify(data.meta)],
    ['instance:exposure:v1', JSON.stringify(exposure)],
  ])
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
    removeItem: (key: string) => { values.delete(key) },
  }
  return { values, storage, data }
}

describe('RootErrorBoundary recovery', () => {
  it('replaces the canonical run through CAS and preserves long-term progress', () => {
    const { storage, data } = fixture()
    const legacy = storage.getItem('instance:run:v1')
    expect(clearRunForRecovery(storage, checkpointToken(storage), 'recovery-new', 'new')).toMatchObject({ status: 'saved' })
    const loaded = loadCheckpoint(storage)
    expect(loaded.problem).toBeUndefined()
    expect(loaded.data?.run.runId).toBe('recovery-new')
    expect(loaded.data?.run.history).toEqual([])
    expect(resolveScene(loaded.data!.run).choices.length).toBeGreaterThan(0)
    expect(loaded.data?.meta).toEqual({ ...data.meta, runCount: 5 })
    expect(loaded.data?.exposure).toEqual(data.exposure)
    expect(loaded.data).toMatchObject({ session: null, surface: 'mainline', nonMainlineView: 'ending' })
    expect(storage.getItem('instance:run:v1')).toBe(legacy)
  })

  it('does not overwrite another window or changed legacy data', () => {
    for (const key of [CHECKPOINT_KEY, 'instance:run:v1']) {
      const { values, storage } = fixture()
      const expected = checkpointToken(storage)
      values.set(key, `${values.get(key)} `)
      const before = [...values]
      expect(clearRunForRecovery(storage, expected, 'stale', 'stale')).toMatchObject({ status: 'conflict' })
      expect([...values]).toEqual(before)
    }
  })

  it('retains the original checkpoint on quota failure or damaged data', () => {
    const { storage, values } = fixture()
    const before = [...values]
    expect(clearRunForRecovery({ ...storage, setItem: () => { throw Error('quota') } }, checkpointToken(storage), 'quota', 'quota')).toMatchObject({ status: 'failed' })
    expect([...values]).toEqual(before)
    values.set(CHECKPOINT_KEY, '{damaged')
    expect(clearRunForRecovery(storage, checkpointToken(storage), 'damaged', 'damaged')).toMatchObject({ status: 'failed' })
    expect(storage.getItem(CHECKPOINT_KEY)).toBe('{damaged')
  })
})
