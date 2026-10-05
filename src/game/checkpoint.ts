import { restoreRun, restoreExposureHistory } from './storage'
import { ACTIVE_SURFACE_KEY, NON_MAINLINE_SESSION_KEY, restoreNonMainlineSession } from './nonMainlineStorage'
import type { ActiveSurface } from './nonMainlineStorage'
import type { NonMainlineSessionState } from './nonMainlineSession'
import type { MetaState, NarrativeExposureHistory, StableRunState } from './types'
import { resolveScene } from './engine'

export const CHECKPOINT_KEY = 'instance:checkpoint:v1'
export const CHECKPOINT_LOCK = 'instance:checkpoint'
const legacyKeys = ['instance:run:v1', 'instance:meta:v1', 'instance:exposure:v1', NON_MAINLINE_SESSION_KEY, ACTIVE_SURFACE_KEY]

export interface CheckpointData {
  run: StableRunState
  meta: MetaState
  exposure: NarrativeExposureHistory
  session: NonMainlineSessionState | null
  surface: ActiveSurface
  nonMainlineView: 'ending' | 'evaluation'
}
export interface CheckpointToken { raw: string | null; legacy: string }
export interface CheckpointLoad {
  data: CheckpointData | null
  token: CheckpointToken
  problem?: 'unavailable' | 'damaged' | 'conflict'
  original?: string
}
type Store = Pick<Storage, 'getItem' | 'setItem'>

export function checkpointToken(storage: Store): CheckpointToken {
  return { raw: storage.getItem(CHECKPOINT_KEY), legacy: JSON.stringify(legacyKeys.map(key => storage.getItem(key))) }
}

export function loadCheckpoint(storage: Store): CheckpointLoad {
  let token: CheckpointToken
  try { token = checkpointToken(storage) } catch { return { data: null, token: { raw: null, legacy: '' }, problem: 'unavailable' } }
  try {
    const envelope = token.raw !== null ? JSON.parse(token.raw) : null
    if (token.raw !== null && (!envelope || envelope.version !== 1 || typeof envelope.revision !== 'string' || !envelope.data)) throw Error('Invalid checkpoint')
    const legacy = JSON.parse(token.legacy) as Array<string | null>
    const saved = envelope?.data
    const runRaw = saved ? JSON.stringify(saved.run) : legacy[0]
    const run = restoreRun(runRaw)
    if ((runRaw || saved) && !run) throw Error('Invalid run')
    const sessionRaw = saved?.session ? JSON.stringify(saved.session) : saved ? null : legacy[3]
    const session = restoreNonMainlineSession(sessionRaw)
    const damagedSession = Boolean(sessionRaw && !session)
    const meta = saved?.meta ?? (legacy[1] ? JSON.parse(legacy[1]) : { version: 1, runCount: 1, completedEndings: [] })
    if (meta.version !== 1 || !Number.isInteger(meta.runCount) || meta.runCount < 1 || !Array.isArray(meta.completedEndings) || !meta.completedEndings.every((id: unknown) => typeof id === 'string')) throw Error('Invalid meta')
    const surface = damagedSession ? 'mainline' : saved?.surface ?? legacy[4] ?? 'mainline'
    if (!['mainline', 'non-mainline'].includes(surface) || (surface === 'non-mainline' && !session)) throw Error('Invalid surface')
    if (saved && !['ending', 'evaluation'].includes(saved.nonMainlineView)) throw Error('Invalid view')
    const exposure = restoreExposureHistory(saved ? JSON.stringify(saved.exposure) : legacy[2])
    // Canonical checkpoints always contain the current exposure schema. A
    // malformed ledger must not quietly reset cross-run replay protection.
    if (saved && (saved.exposure?.version !== 2 || JSON.stringify(saved.exposure) !== JSON.stringify(exposure))) throw Error('Invalid exposure')
    return {
      token,
      ...(damagedSession ? { problem: 'damaged' as const, original: token.raw ?? token.legacy } : {}),
      ...(envelope?.legacy !== undefined && envelope.legacy !== token.legacy ? { problem: 'conflict' as const, original: token.legacy } : {}),
      data: run ? { run, session, meta, surface, nonMainlineView: saved?.nonMainlineView ?? 'ending', exposure } : null,
    }
  } catch {
    return { data: null, token, problem: 'damaged', original: token.raw ?? token.legacy }
  }
}

export type CheckpointWrite = { status: 'saved'; token: CheckpointToken } | { status: 'conflict' | 'failed' }

// Caller holds the origin-wide Web Lock. All progress is one setItem; a quota
// failure can never leave the run, replay ledger and active mode half-written.
export function writeCheckpoint(storage: Store, expected: CheckpointToken, data: CheckpointData, revision: string): CheckpointWrite {
  try {
    const current = checkpointToken(storage)
    if (current.raw !== expected.raw || current.legacy !== expected.legacy) return { status: 'conflict' }
    // Resolve before setItem: structural save validation alone cannot detect a
    // legal history whose dynamic next scene has no reachable proposal/choice.
    if (data.run.phase === 'playing' && !resolveScene(data.run).choices.length) return { status: 'failed' }
    const raw = JSON.stringify({ version: 1, revision, legacy: current.legacy, data })
    storage.setItem(CHECKPOINT_KEY, raw)
    if (storage.getItem(CHECKPOINT_KEY) !== raw) return { status: 'failed' }
    return { status: 'saved', token: { raw, legacy: current.legacy } }
  } catch { return { status: 'failed' } }
}

export function readRecoveryRecord(raw: string): CheckpointData | null {
  try {
    const record = JSON.parse(raw)
    const data = record.pending ?? record.current
    const loaded = loadCheckpoint({ getItem: key => key === CHECKPOINT_KEY ? JSON.stringify({ version: 1, revision: 'recovery', data }) : null, setItem: () => {} })
    return loaded.problem ? null : loaded.data
  } catch { return null }
}
