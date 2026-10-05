import { describe, expect, it } from 'vitest'
import { createMainline2Run, commitChoice, resolveScene } from './engine'
import { createEmptyExposureHistory } from '../content/runManifest'
import { CHECKPOINT_KEY, checkpointToken, loadCheckpoint, readRecoveryRecord, writeCheckpoint } from './checkpoint'
import type { CheckpointData } from './checkpoint'

function fixture() {
  const values = new Map<string, string>()
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
  const data: CheckpointData = { run: createMainline2Run('atomic-checkpoint'), meta: { version: 1, runCount: 1, completedEndings: [] }, exposure: createEmptyExposureHistory(), session: null, surface: 'mainline', nonMainlineView: 'ending' }
  return { values, storage, data }
}
describe('durable checkpoint transactions', () => {
  it('keeps the previous checkpoint when the next scene cannot resolve', () => {
    const { storage, data } = fixture()
    expect(writeCheckpoint(storage, checkpointToken(storage), data, 'before').status).toBe('saved')
    const before = storage.getItem(CHECKPOINT_KEY)
    const invalid = { ...data, run: { ...data.run, currentNodeId: 'unresolvable-next-node' } }
    expect(writeCheckpoint(storage, checkpointToken(storage), invalid, 'invalid').status).toBe('failed')
    expect(storage.getItem(CHECKPOINT_KEY)).toBe(before)
    expect(loadCheckpoint(storage).data?.run).toMatchObject({ runId: data.run.runId, currentNodeId: data.run.currentNodeId, history: [] })
  })
  it('rejects an old tab even when two players made different choices at the same history length', () => {
    const { storage, data } = fixture()
    const initial = checkpointToken(storage)
    const a = { ...data, run: commitChoice(data.run, resolveScene(data.run).choices[0].id) }
    const b = { ...data, run: commitChoice(data.run, resolveScene(data.run).choices[1].id) }
    expect(writeCheckpoint(storage, initial, a, 'tab-a').status).toBe('saved')
    expect(writeCheckpoint(storage, initial, b, 'tab-b').status).toBe('conflict')
    expect(loadCheckpoint(storage).data?.run.history[0].choiceId).toBe(a.run.history[0].choiceId)
  })
  it('keeps the entire previous checkpoint after quota failure, and exported pending progress can be recovered', () => {
    const { storage, data } = fixture()
    writeCheckpoint(storage, checkpointToken(storage), data, 'before')
    const previous = storage.getItem(CHECKPOINT_KEY), expected = checkpointToken(storage)
    const pending = { ...data, run: commitChoice(data.run, resolveScene(data.run).choices[0].id) }
    const denied = { ...storage, setItem: () => { throw new DOMException('quota', 'QuotaExceededError') } }
    expect(writeCheckpoint(denied, expected, pending, 'failed').status).toBe('failed')
    expect(storage.getItem(CHECKPOINT_KEY)).toBe(previous)
    const recovered = readRecoveryRecord(JSON.stringify({ current: data, pending }))!
    expect(recovered.run.history).toEqual(pending.run.history)
    expect(writeCheckpoint(storage, expected, recovered, 'recovered').status).toBe('saved')
    expect(loadCheckpoint(storage).data?.run.currentNodeId).toBe(pending.run.currentNodeId)
  })
  it('imports legacy progress without deleting its only raw copy, and detects legacy-tab changes', () => {
    const { storage, data, values } = fixture()
    values.set('instance:run:v1', JSON.stringify(data.run))
    const legacy = loadCheckpoint(storage)
    expect(legacy.data?.run.runId).toBe(data.run.runId)
    values.set('instance:run:v1', JSON.stringify(commitChoice(data.run, resolveScene(data.run).choices[0].id)))
    expect(writeCheckpoint(storage, legacy.token, data, 'new-tab').status).toBe('conflict')
    expect(storage.getItem(CHECKPOINT_KEY)).toBeNull()
  })
  it('preserves malformed data and rejects a recovery document with fabricated completed progress', () => {
    const { storage, values, data } = fixture()
    for (const raw of ['{damaged', 'null', '{}', 'false', '""']) {
      values.set(CHECKPOINT_KEY, raw)
      expect(loadCheckpoint(storage)).toMatchObject({ problem: 'damaged', original: raw })
      expect(storage.getItem(CHECKPOINT_KEY)).toBe(raw)
    }
    expect(readRecoveryRecord(JSON.stringify({ current: { ...data, run: { ...data.run, currentNodeId: 'made-up-node' } } }))).toBeNull()
  })
  it('rejects a damaged personal reply before rendering and retains the original checkpoint', () => {
    const { storage, values, data } = fixture()
    for (const invalid of [
      { ...data, run: { ...data.run, personalEpilogueReply: { damaged: true } } },
      { ...data, exposure: { version: 2, recentRuns: [] } },
    ]) {
      const raw = JSON.stringify({ version: 1, revision: 'damaged-archive', data: invalid })
      values.set(CHECKPOINT_KEY, raw)
      expect(loadCheckpoint(storage)).toMatchObject({ problem: 'damaged', original: raw })
      expect(storage.getItem(CHECKPOINT_KEY)).toBe(raw)
      expect(readRecoveryRecord(JSON.stringify({ current: invalid }))).toBeNull()
    }
    expect(readRecoveryRecord(JSON.stringify({ current: { ...data, run: { ...data.run, personalEpilogueReply: '我记得你。' } } }))?.run.personalEpilogueReply).toBe('我记得你。')
  })
})
