import { Component, createContext, type ReactNode } from 'react'
import { CHECKPOINT_LOCK, checkpointToken, loadCheckpoint, writeCheckpoint } from '../game/checkpoint'
import type { CheckpointToken, CheckpointWrite } from '../game/checkpoint'
import { createMainline2Run } from '../game/engine'

// The token belongs to the App that failed, rather than a later disk snapshot
// that may already contain another window's progress.
export const RecoveryCheckpointContext = createContext<(token: CheckpointToken) => void>(() => {})

// The caller holds CHECKPOINT_LOCK. Retain legacy copies and long-term progress;
// replace only the current run/session in the canonical atomic record.
export function clearRunForRecovery(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  expected: CheckpointToken,
  runId: string = crypto.randomUUID(),
  revision: string = crypto.randomUUID(),
): CheckpointWrite {
  const loaded = loadCheckpoint(storage)
  if (loaded.token.raw !== expected.raw || loaded.token.legacy !== expected.legacy || loaded.problem === 'conflict') return { status: 'conflict' }
  if (loaded.problem || !loaded.data) return { status: 'failed' }
  const { meta, exposure } = loaded.data
  return writeCheckpoint(storage, expected, {
    ...loaded.data,
    run: createMainline2Run(runId, exposure),
    meta: { ...meta, runCount: meta.runCount + 1 },
    session: null,
    surface: 'mainline',
    nonMainlineView: 'ending',
  }, revision)
}

export class RootErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean; busy: boolean; recoveryError: string }> {
  state = { failed: false, busy: false, recoveryError: '' }
  private recoveryToken: CheckpointToken | null = null
  private restarting = false
  private reportCheckpoint = (token: CheckpointToken) => { this.recoveryToken = token }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    try {
      this.recoveryToken ??= checkpointToken(window.localStorage)
    } catch { this.setState({ recoveryError: '浏览器无法读取存档，原记录尚未修改。' }) }
  }

  private restart = async () => {
    if (this.restarting) return
    this.restarting = true
    this.setState({ busy: true, recoveryError: '' })
    const expected = this.recoveryToken
    let result: CheckpointWrite = { status: 'failed' }
    try {
      if (expected && window.navigator.locks) {
        result = await window.navigator.locks.request(CHECKPOINT_LOCK, () => clearRunForRecovery(window.localStorage, expected))
      }
    } catch { /* Preserve the original checkpoint on storage/lock failure. */ }
    if (result.status === 'saved') { window.location.reload(); return }
    this.restarting = false
    this.setState({ busy: false, recoveryError: result.status === 'conflict'
      ? '另一个窗口已经更新了存档。请读取最新检查点，原记录尚未修改。'
      : '新局未能保存，原记录尚未修改。请检查存储权限后重试。' })
  }

  render() {
    if (this.state.failed) {
      return <main className="app-recovery" role="alert">
        <h1>出现了意外问题</h1>
        <p>当前这一局无法继续显示。你可以重新开始，不会清除长期进度。</p>
        <button type="button" disabled={this.state.busy} onClick={this.restart}>{this.state.busy ? '正在保存新局…' : '重新开始'}</button>
        {this.state.recoveryError && <p>{this.state.recoveryError}</p>}
        {this.state.recoveryError && <button type="button" onClick={() => window.location.reload()}>读取最新检查点</button>}
      </main>
    }
    return <RecoveryCheckpointContext.Provider value={this.reportCheckpoint}>{this.props.children}</RecoveryCheckpointContext.Provider>
  }
}
