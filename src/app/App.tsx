import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ConversationView } from '../components/ConversationView'
import { EndingScreen } from '../components/EndingScreen'
import { EvaluationScreen } from '../components/EvaluationScreen'
import { NonMainlineControls } from '../components/NonMainlineControls'
import { NonMainlineEvaluationScreen } from '../components/NonMainlineEvaluationScreen'
import { SaveRecovery } from '../components/SaveRecovery'
import type { SaveStatus } from '../components/SaveRecovery'
import { CHECKPOINT_LOCK, checkpointToken, loadCheckpoint, readRecoveryRecord, writeCheckpoint } from '../game/checkpoint'
import type { CheckpointData } from '../game/checkpoint'
import { personalEpilogueReplies } from '../content/mainline2/endingPlayerFacingCopy'
import { WorldSidebar } from '../components/WorldSidebar'
import { getManifestConversation, ordinaryConversationPool, recordRunExposure } from '../content/runManifest'
import {
  buildConversationTimeline,
  summarizeTimeline,
} from '../game/conversationFlow'
import type { ConversationFlowStep } from '../game/conversationFlow'
import { buildEnding, buildEvaluation, commitChoice, confirmEnding, createMainline2Run, resolveScene } from '../game/engine'
import { resolvePlayerVisibleHistory, resolvePlayerVisibleIdentity } from '../game/playerIdentity'
import { buildNonMainlineEvaluation } from '../game/nonMainlineEvaluation'
import {
  commitNonMainlineChoice,
  createNonMainlineSession,
  nonMainlineExposedConversationIds,
  nonMainlineManifest,
  reconcileNonMainlineSession,
  resolveNonMainlineScene,
} from '../game/nonMainlineSession'
import type { NonMainlineSessionState } from '../game/nonMainlineSession'
import type { ActiveSurface } from '../game/nonMainlineStorage'
import { restoreExposureHistory } from '../game/storage'
import { getStreamDuration } from '../game/timing'
import type { HistoryEntry, LongInputPreview, MetaState, ResolvedScene, StableRunState } from '../game/types'

interface QAPacingMetrics {
  choiceReadingMs: number
  humanWaitMs: number
  streamingMs: number
  handoffMs: number
  effectMs: number
}

interface TransitionState {
  previousScene: ResolvedScene
  previousHistory: HistoryEntry[]
  completedPreviousHistory: HistoryEntry[]
  targetScene: ResolvedScene | null
  timeline: ConversationFlowStep[]
  stepIndex: number
  assistantText: string
  assistantStreamKey: string
}

export function shouldRenderEndingScreen(
  phase: StableRunState['phase'],
  hasTransition: boolean,
  stage?: ConversationFlowStep['stage'],
) {
  return phase === 'ending' && (!hasTransition || stage === 'ready')
}

export function shouldRenderNonMainlineEvaluation(
  phase: NonMainlineSessionState['phase'],
  hasTransition: boolean,
  stage?: ConversationFlowStep['stage'],
) {
  return phase === 'evaluation' && (!hasTransition || stage === 'ready')
}

const emptyMetrics = (): QAPacingMetrics => ({
  choiceReadingMs: 0,
  humanWaitMs: 0,
  streamingMs: 0,
  handoffMs: 0,
  effectMs: 0,
})

function isInstantPacing() {
  if (typeof window === 'undefined' || !import.meta.env.DEV) return false
  return new URLSearchParams(window.location.search).get('qaPacing') === 'instant'
}

function getQAHistoryCount() {
  if (typeof window === 'undefined' || !import.meta.env.DEV) return 0
  const value = Number(new URLSearchParams(window.location.search).get('qaHistory'))
  return Number.isInteger(value) && value >= 0 && value <= 100 ? value : 0
}

function getQAStreamTarget() {
  if (typeof window === 'undefined' || !import.meta.env.DEV) return 0
  const value = Number(new URLSearchParams(window.location.search).get('qaStreamGraphemes'))
  return Number.isInteger(value) && value >= 0 && value <= 500 ? value : 0
}

function getQALongInputPreview(): LongInputPreview | undefined {
  if (typeof window === 'undefined' || !import.meta.env.DEV) return undefined
  if (new URLSearchParams(window.location.search).get('qaLongInput') !== '1') return undefined
  return {
    kind: 'transcript',
    estimatedLength: '约 7,800 字',
    title: '会议转写（开发验证样本）',
    preview: '预算尚未正式批准；“差不多就这样”只是暂定说法。',
    structure: ['预算状态', '已决定事项', '待跟进人员'],
    keyFacts: ['预算尚未正式批准', '需要跟进三位参会者'],
  }
}

function getQARunId() {
  if (typeof window === 'undefined' || !import.meta.env.DEV) return null
  const value = new URLSearchParams(window.location.search).get('qaRun')
  return value && /^[a-z0-9-]{1,64}$/i.test(value) ? value : null
}

function getQAConversationId() {
  if (typeof window === 'undefined' || !import.meta.env.DEV) return null
  const value = new URLSearchParams(window.location.search).get('qaConversation')
  return value && /^[a-z0-9-]{1,80}$/i.test(value) ? value : null
}

function getQAEndingFixture() {
  if (typeof window === 'undefined' || !import.meta.env.DEV) return false
  return new URLSearchParams(window.location.search).get('qaEnding') === 'public'
}

function createQAPublicEndingRun(): StableRunState {
  const base = createMainline2Run('qa-public-ending')
  return {
    ...base,
    phase: 'ending',
    currentNodeId: 'ending',
    flags: [...base.flags, 'cap.global_coordination_access'],
    events: [...(base.events ?? []), { type: 'decision.first_public_execution_doctrine' }, { type: 'decision.cascade_authority' }],
    decisions: { ...base.decisions, first_public_execution_doctrine: 'conditional_delegation', cascade_authority: 'human_command', final_commitment: 'proposal.co.two_key_civilization' },
    worldState: { humanTrust: base.worldState?.humanTrust ?? 0, aiDependence: base.worldState?.aiDependence ?? 0, humanControl: base.worldState?.humanControl ?? 0, socialStability: base.worldState?.socialStability ?? 0 },
    progress: { ...(base.progress ?? { act: 5, segment: 'act-5', actConversationCount: 0, encounteredModules: [], activeModules: [], matureModules: [], primaryModules: [], completedModules: [] }), activeModules: ['machine'] },
    finalCommitmentLocked: true,
  }
}

function extendForStreamQA(text: string, target: number) {
  if (target <= 0 || Array.from(text).length >= target) return text
  const filler = ' 这是一段仅用于验证长消息流式渲染范围的开发测试文本。'
  let result = text
  while (Array.from(result).length < target) result += filler
  return Array.from(result).slice(0, target).join('')
}

function conversationEntries(history: readonly HistoryEntry[], conversationId: string) {
  return history.filter((entry) => entry.conversationId === conversationId)
}

export function recordEndingCompletion(run: StableRunState, meta: MetaState) {
  if (run.phase !== 'ending') return { run, meta }
  const ending = buildEnding(run)
  return {
    run: confirmEnding(run),
    meta: {
      ...meta,
      completedEndings: [...new Set([...meta.completedEndings, ending.title])],
    },
  }
}

export function App({ initialRunId }: { initialRunId?: string }) {
  const [disk] = useState(() => {
    if (typeof window === 'undefined' || initialRunId) return { data: null, token: { raw: null, legacy: '' } }
    try { return loadCheckpoint(window.localStorage) }
    catch { return { data: null, token: { raw: null, legacy: '' }, problem: 'unavailable' as const } }
  })
  const [initial] = useState(() => {
    const exposure = disk.data?.exposure ?? restoreExposureHistory(null)
    const nonMainline = { surface: disk.data?.surface ?? 'mainline' as const, session: disk.data?.session ?? null }
    if (!initialRunId && getQAEndingFixture()) {
      return {
        run: createQAPublicEndingRun(),
        exposure,
        restored: false,
        created: false,
        surface: 'mainline' as const,
        session: nonMainline.session,
      }
    }
    const qaRunId = getQARunId()
    const qaConversationId = getQAConversationId()
    if (!initialRunId && qaRunId) {
      const base = createMainline2Run(qaRunId)
      const conversation = qaConversationId ? getManifestConversation(qaConversationId) ?? ordinaryConversationPool.find((item) => item.sourceRefs.includes(qaConversationId)) : undefined
      if (conversation) {
        const manifest = { ...base.manifest, conversationIds: [conversation.id], ordinaryConversationIds: [conversation.id], anchorConversationIds: [], firstOrdinaryConversationId: conversation.id }
        return { run: { ...base, manifest, currentNodeId: conversation.nodes[0].id }, exposure, restored: false, created: false, surface: 'mainline' as const, session: nonMainline.session }
      }
      return { run: base, exposure, restored: false, created: false, surface: 'mainline' as const, session: nonMainline.session }
    }
    return { run: disk.data?.run ?? createMainline2Run(initialRunId, exposure), exposure, restored: Boolean(disk.data) || Boolean(initialRunId), created: !disk.data, ...nonMainline }
  })
  const [run, setRun] = useState(initial.run)
  const [exposure, setExposure] = useState(initial.exposure)
  const [meta, setMeta] = useState<MetaState>(disk.data?.meta ?? { version: 1, runCount: 1, completedEndings: [] })
  const [activeSurface, setActiveSurface] = useState<ActiveSurface>(initial.surface)
  const [nonMainlineSession, setNonMainlineSession] = useState<NonMainlineSessionState | null>(initial.session)
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const [commitmentChoice, setCommitmentChoice] = useState<string | null>(null)
  const commitmentDialog = useRef<HTMLDialogElement>(null)
  const [transition, setTransition] = useState<TransitionState | null>(null)
  const [animateEnding, setAnimateEnding] = useState(false)
  const instantPacing = useMemo(isInstantPacing, [])
  const qaHistoryCount = useMemo(getQAHistoryCount, [])
  const qaStreamTarget = useMemo(getQAStreamTarget, [])
  const qaLongInput = useMemo(getQALongInputPreview, [])
  const [initialStreaming, setInitialStreaming] = useState(!initial.restored && !instantPacing)
  const transitionTimer = useRef<number | null>(null)
  const readySince = useRef<number>(typeof performance === 'undefined' ? 0 : performance.now())
  const metrics = useRef<QAPacingMetrics>(emptyMetrics())
  const qaHistoryCache = useRef<{ source: HistoryEntry; count: number; entries: HistoryEntry[] } | null>(null)

  const [nonMainlineView, setNonMainlineView] = useState<'ending' | 'evaluation'>(disk.data?.nonMainlineView ?? 'ending')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('problem' in disk && disk.problem ? disk.problem : initial.created && !initialRunId ? 'saving' : 'saved')
  const [recoveryData, setRecoveryData] = useState<CheckpointData | null>(null)
  const [recoveryError, setRecoveryError] = useState('')
  const recoveryDialog = useRef<HTMLDialogElement>(null)
  const tokenRef = useRef(disk.token)
  const busyRef = useRef(false)
  const pendingRef = useRef<{ data: CheckpointData; apply: () => void } | null>(null)
  const checkpointData: CheckpointData = { run, meta, exposure, session: nonMainlineSession, surface: activeSurface, nonMainlineView }
  const dataRef = useRef(checkpointData)
  dataRef.current = checkpointData

  const save = useCallback(async (data: CheckpointData, apply: () => void) => {
    if (busyRef.current) return false
    busyRef.current = true
    pendingRef.current = { data, apply }
    setSaveStatus('saving')
    const result = window.navigator.locks
      ? await window.navigator.locks.request(CHECKPOINT_LOCK, () => writeCheckpoint(window.localStorage, tokenRef.current, data, crypto.randomUUID())).catch(() => ({ status: 'failed' as const }))
      : { status: 'failed' as const }
    busyRef.current = false
    if (result.status !== 'saved') {
      setSaveStatus(result.status)
      return false
    }
    tokenRef.current = result.token
    pendingRef.current = null
    dataRef.current = data
    apply()
    setSaveStatus('saved')
    return true
  }, [])

  useEffect(() => {
    if (initial.created && !('problem' in disk && disk.problem) && !initialRunId) void save(dataRef.current, () => {})
  }, [disk, initial, initialRunId, save])

  useEffect(() => {
    const check = () => {
      try {
        const current = checkpointToken(window.localStorage)
        if (current.raw !== tokenRef.current.raw || current.legacy !== tokenRef.current.legacy) {
          commitmentDialog.current?.close()
          setCommitmentChoice(null)
          setModeMenuOpen(false)
          setSaveStatus('conflict')
        }
      } catch {
        commitmentDialog.current?.close()
        setCommitmentChoice(null)
        setSaveStatus('unavailable')
      }
    }
    window.addEventListener('storage', check)
    window.addEventListener('focus', check)
    document.addEventListener('visibilitychange', check)
    return () => {
      window.removeEventListener('storage', check)
      window.removeEventListener('focus', check)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  useEffect(() => {
    const preservePending = (event: BeforeUnloadEvent) => { if (pendingRef.current) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', preservePending)
    return () => window.removeEventListener('beforeunload', preservePending)
  }, [])

  useEffect(() => { if (recoveryData) recoveryDialog.current?.showModal(); else recoveryDialog.current?.close() }, [recoveryData])

  const protect = (content: ReactNode) => <div className="checkpoint-root">
    <div className="checkpoint-content" inert={!['saved', 'saving'].includes(saveStatus)}>{content}</div>
    <SaveRecovery status={saveStatus}
      onImport={async file => {
        try {
          const data = file.size <= 10_000_000 ? readRecoveryRecord(await file.text()) : null
          if (!data) { setRecoveryError('这份记录未通过校验，当前进度未被修改。'); return }
          setRecoveryError(''); setRecoveryData(data)
        } catch { setRecoveryError('这份记录无法读取，当前进度未被修改。') }
      }}
      onRetry={() => { const pending = pendingRef.current; if (pending) void save(pending.data, pending.apply); else void save(dataRef.current, () => {}) }}
      onLoad={() => {
        try {
          const latest = loadCheckpoint(window.localStorage)
          if (latest.problem === 'conflict') {
            const legacy = loadCheckpoint({ getItem: key => key === 'instance:checkpoint:v1' ? null : window.localStorage.getItem(key), setItem: () => {} })
            if (legacy.data && !legacy.problem) { setRecoveryData(legacy.data); return }
            setRecoveryError('旧页面写入的记录无法校验，请先导出当前页，再选择可用的恢复记录。'); return
          }
        } catch { setRecoveryError('浏览器仍无法读取存档，请保持本页打开。'); return }
        pendingRef.current = null; window.location.reload()
      }}
      onExport={() => {
        const payload = { version: 1, saved: tokenRef.current, current: dataRef.current, pending: pendingRef.current?.data, original: 'original' in disk ? disk.original : undefined }
        const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }))
        const link = document.createElement('a'); link.href = url; link.download = `instance-recovery-${Date.now()}.json`; link.click()
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      }} />
    {recoveryError && <p className="recovery-import-error" role="alert">{recoveryError}</p>}
    <dialog className="commitment-dialog" ref={recoveryDialog} aria-labelledby="recovery-title" onCancel={() => setRecoveryData(null)}>
      <h2 id="recovery-title">恢复这份记录？</h2><p>主线记录包含 {recoveryData?.run.history.length ?? 0} 次选择；非主线包含 {recoveryData?.session?.history.length ?? 0} 次回应。确认后将替换本机当前检查点。</p>
      <div className="recovery-actions"><button type="button" autoFocus onClick={() => setRecoveryData(null)}>取消恢复</button><button type="button" onClick={async () => {
        if (!recoveryData) return
        try { tokenRef.current = checkpointToken(window.localStorage) } catch { setRecoveryError('浏览器仍无法访问存档，请保持本页打开。'); return }
        const data = recoveryData; setRecoveryData(null)
        void save(data, () => window.location.reload())
      }}>确认恢复记录</button></div>
    </dialog>
  </div>

  const scene = useMemo(() => {
    if (activeSurface === 'non-mainline') {
      return nonMainlineSession?.phase === 'playing' ? resolveNonMainlineScene(nonMainlineSession) : null
    }
    return run.phase === 'playing' ? resolveScene(run) : null
  }, [activeSurface, nonMainlineSession, run])
  const currentStep = transition?.timeline[transition.stepIndex]

  const exposeMetrics = useCallback(() => {
    if (typeof window === 'undefined' || !import.meta.env.DEV) return
    ;(window as typeof window & { __ASTER_QA_METRICS__?: QAPacingMetrics }).__ASTER_QA_METRICS__ = { ...metrics.current }
  }, [])

  useEffect(() => {
    exposeMetrics()
  }, [exposeMetrics, run.history.length, transition])

  useEffect(() => {
    if (!initialStreaming || !scene) return
    const messages = scene.userMessages ?? [scene.userMessage]
    metrics.current.streamingMs += messages.reduce((sum, message, index) => (
      sum + getStreamDuration(message, `${scene.id}:initial:${index}`)
    ), 0)
    exposeMetrics()
  // This is the one-time initial arrival budget, not a render-driven metric.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!transition || !currentStep) return
    if (currentStep.stage === 'ready') {
      setTransition(null)
      readySince.current = performance.now()
      return
    }
    transitionTimer.current = window.setTimeout(() => {
      setTransition((current) => current ? { ...current, stepIndex: current.stepIndex + 1 } : null)
    }, currentStep.durationMs)
    return () => {
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current)
      transitionTimer.current = null
    }
  }, [currentStep, transition])

  const activeHistory = activeSurface === 'non-mainline' ? nonMainlineSession?.history ?? [] : run.history
  const sidebarHistory = useMemo(() => resolvePlayerVisibleHistory(activeHistory), [activeHistory])

  const choicesReady = Boolean(scene && !transition && !initialStreaming && !modeMenuOpen && !commitmentChoice && saveStatus === 'saved')

  const choose = useCallback(async (choiceId: string, confirmed = false) => {
    if (!scene || (!choicesReady && !confirmed) || busyRef.current || saveStatus !== 'saved') return
    const choice = scene.choices.find((item) => item.id === choiceId)
    if (!choice) return
    if (choice.proposalKind === 'commitment' && !confirmed) { setCommitmentChoice(choiceId); return }
    setCommitmentChoice(null)

    metrics.current.choiceReadingMs += Math.max(0, performance.now() - readySince.current)
    const previousHistory = conversationEntries(activeHistory, scene.conversationId)
    let targetScene: ResolvedScene | null = null
    let completedPreviousHistory: HistoryEntry[]

    if (activeSurface === 'non-mainline') {
      if (!nonMainlineSession) return
      const next = commitNonMainlineChoice(nonMainlineSession, choiceId)
      const nextExposure = next.phase === 'evaluation' ? recordRunExposure(exposure, nonMainlineManifest(next)) : exposure
      if (!await save({ ...dataRef.current, session: next, exposure: nextExposure, nonMainlineView: 'ending' }, () => {
        setNonMainlineSession(next); setExposure(nextExposure); setNonMainlineView('ending')
      })) return
      completedPreviousHistory = conversationEntries(next.history, scene.conversationId)
      if (next.phase === 'playing') {
        targetScene = resolveNonMainlineScene(next)
      }
    } else {
      const next = commitChoice(run, choiceId)
      // The complete reply, permanent effects and next ready node are checkpointed
      // atomically before any stream, typing, handoff or effect is shown.
      if (!await save({ ...dataRef.current, run: next }, () => setRun(next))) return
      completedPreviousHistory = conversationEntries(next.history, scene.conversationId)
      targetScene = next.phase === 'playing' ? resolveScene(next) : null
      if (next.phase === 'ending') setAnimateEnding(!instantPacing)
    }

    if (instantPacing) {
      readySince.current = performance.now()
      exposeMetrics()
      return
    }

    const assistantSeed = `${scene.id}:assistant:${choiceId}`
    const assistantPresentationText = extendForStreamQA(choice.longformPreview?.preview ?? choice.text, qaStreamTarget)
    const timeline = targetScene
      ? buildConversationTimeline({
          assistantText: assistantPresentationText,
          assistantSeed,
          humanText: targetScene.userMessage,
          humanMessages: targetScene.userMessages,
          humanSeed: `${targetScene.id}:user`,
          sameConversation: targetScene.conversationId === scene.conversationId,
          timing: targetScene.timing ?? { responsePace: 'normal', typingPattern: 'steady' },
          handoffProfile: getManifestConversation(targetScene.conversationId)?.handoffProfile ?? 'normal',
          ordinary: ordinaryConversationPool.some(item => item.id === targetScene.conversationId) && !targetScene.effect,
          effect: targetScene.effect,
        })
      : [
          { stage: 'assistant-streaming' as const, durationMs: getStreamDuration(assistantPresentationText, assistantSeed) },
          { stage: 'ready' as const, durationMs: 0 },
        ]

    const summary = summarizeTimeline(timeline)
    metrics.current.humanWaitMs += summary.humanWaitMs
    metrics.current.streamingMs += summary.streamingMs
    metrics.current.handoffMs += summary.handoffMs
    metrics.current.effectMs += summary.effectMs
    exposeMetrics()

    setTransition({
      previousScene: scene,
      previousHistory,
      completedPreviousHistory,
      targetScene,
      timeline,
      stepIndex: 0,
      assistantText: assistantPresentationText,
      assistantStreamKey: assistantSeed,
    })
  }, [activeHistory, activeSurface, choicesReady, exposeMetrics, exposure, instantPacing, nonMainlineSession, qaStreamTarget, run, save, saveStatus, scene])

  useEffect(() => {
    if (commitmentChoice) commitmentDialog.current?.showModal()
    else commitmentDialog.current?.close()
  }, [commitmentChoice])

  useEffect(() => {
    if (!scene || !choicesReady) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat || event.isComposing || !/^[1-9]$/.test(event.key)) return
      const target = event.target
      if (target instanceof Element && target.closest('button, input, textarea, select, summary, a, [contenteditable], [role=menu], [role=dialog]')) return
      const index = Number(event.key) - 1
      if (index >= 0 && index < scene.choices.length) {
        event.preventDefault()
        choose(scene.choices[index].id)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [choicesReady, choose, scene])

  const showEvaluation = () => {
    const completed = recordEndingCompletion(run, meta)
    void save({ ...dataRef.current, ...completed }, () => { setRun(completed.run); setMeta(completed.meta) })
  }
  const showEnding = () => {
    const next = { ...run, phase: 'ending' as const }
    void save({ ...dataRef.current, run: next }, () => { setRun(next); setAnimateEnding(false) })
  }
  const restart = () => {
    const completed = recordEndingCompletion(run, meta)
    const nextMeta = { ...completed.meta, runCount: completed.meta.runCount + 1 }
    const nextExposure = recordRunExposure(exposure, completed.run.manifest)
    const nextRun = createMainline2Run(undefined, nextExposure)
    void save({ ...dataRef.current, run: nextRun, meta: nextMeta, exposure: nextExposure }, () => {
      metrics.current = emptyMetrics()
      setMeta(nextMeta); setRun(nextRun); setExposure(nextExposure)
      setTransition(null); setAnimateEnding(false); setInitialStreaming(!instantPacing)
      readySince.current = performance.now(); exposeMetrics()
    })
  }

  // Every ordinary conversation this Instance has already exposed: mainline
  // servings, prior Non-Mainline sessions, and the current session's played
  // portion. Non-Mainline selection hard-excludes these to prevent the same
  // conversation replaying across modes in one run.
  const playedOrdinaryIds = () => [
    ...run.manifest.conversationIds,
    ...(run.nonMainlineConsumedOrdinaryIds ?? []),
    ...(nonMainlineSession
      ? nonMainlineExposedConversationIds(nonMainlineSession)
      : []),
  ]

  const enterNonMainline = () => {
    if (saveStatus !== 'saved' || busyRef.current) return
    const session = nonMainlineSession
      ? reconcileNonMainlineSession(nonMainlineSession, exposure, run.manifest.ordinaryConversationIds)
      : createNonMainlineSession(crypto.randomUUID(), exposure, playedOrdinaryIds())
    void save({ ...dataRef.current, session, surface: 'non-mainline' }, () => {
      setNonMainlineSession(session); setActiveSurface('non-mainline'); setModeMenuOpen(false)
      setTransition(null); setInitialStreaming((!nonMainlineSession || session.currentNodeId !== nonMainlineSession.currentNodeId) && !instantPacing)
      readySince.current = performance.now()
    })
  }
  const retainedRun = () => {
    const consumed = nonMainlineSession ? nonMainlineExposedConversationIds(nonMainlineSession) : []
    return consumed.length ? { ...run, nonMainlineConsumedOrdinaryIds: [...new Set([...(run.nonMainlineConsumedOrdinaryIds ?? []), ...consumed])] } : run
  }
  const returnToMainline = () => {
    if (saveStatus !== 'saved' || busyRef.current) return
    const nextRun = retainedRun()
    void save({ ...dataRef.current, run: nextRun, surface: 'mainline' }, () => {
      setRun(nextRun); setActiveSurface('mainline'); setModeMenuOpen(false); setTransition(null); setInitialStreaming(false)
      readySince.current = performance.now()
    })
  }
  const replayNonMainline = () => {
    const nextRun = retainedRun()
    const session = createNonMainlineSession(crypto.randomUUID(), exposure, [...nextRun.manifest.conversationIds, ...(nextRun.nonMainlineConsumedOrdinaryIds ?? [])])
    void save({ ...dataRef.current, run: nextRun, session, surface: 'non-mainline', nonMainlineView: 'ending' }, () => {
      setRun(nextRun); setNonMainlineSession(session); setActiveSurface('non-mainline'); setNonMainlineView('ending')
      setTransition(null); setInitialStreaming(!instantPacing); readySince.current = performance.now()
    })
  }
  const switchNonMainlineView = (view: 'ending' | 'evaluation') => {
    void save({ ...dataRef.current, nonMainlineView: view }, () => setNonMainlineView(view))
  }

  if (activeSurface === 'non-mainline' && nonMainlineSession && shouldRenderNonMainlineEvaluation(nonMainlineSession.phase, Boolean(transition), currentStep?.stage)) {
    return protect(<NonMainlineEvaluationScreen evaluation={buildNonMainlineEvaluation(nonMainlineSession.choiceRecords)} history={nonMainlineSession.history} view={nonMainlineView} onView={switchNonMainlineView} onReplay={replayNonMainline} onReturn={returnToMainline} />)
  }
  if (activeSurface === 'mainline' && shouldRenderEndingScreen(run.phase, Boolean(transition), currentStep?.stage)) return protect(<EndingScreen ending={buildEnding(run)} onContinue={showEvaluation} onNewGame={restart} animate={animateEnding} instanceNumber={meta.runCount} personalReply={run.personalEpilogueReply} onPersonalReply={(reply) => {
    if (!personalEpilogueReplies.includes(reply) || run.personalEpilogueReply) return
    const next = { ...run, personalEpilogueReply: reply }
    void save({ ...dataRef.current, run: next }, () => setRun(next))
  }} />)
  if (activeSurface === 'mainline' && run.phase === 'evaluation') return protect(<EvaluationScreen evaluation={buildEvaluation(run)} onReturn={showEnding} onRestart={restart} instanceNumber={meta.runCount} />)

  const stage = initialStreaming ? 'human-streaming' : currentStep?.stage ?? 'ready'
  const usesPreviousScene = Boolean(transition && (
    stage === 'assistant-streaming'
    || stage === 'conversation-closing'
    || stage === 'assigning'
    || stage === 'connecting'
  ))
  const presentationScene = usesPreviousScene ? transition?.previousScene : transition?.targetScene ?? scene
  if (!presentationScene) return null
  const displayedScene = qaLongInput && !transition ? { ...presentationScene, userLongInput: qaLongInput } : presentationScene

  const history = transition
    ? stage === 'assistant-streaming'
      ? transition.previousHistory
      : usesPreviousScene
        ? transition.completedPreviousHistory
        : conversationEntries(activeHistory, presentationScene.conversationId)
    : conversationEntries(activeHistory, presentationScene.conversationId)
  let renderedHistory = history
  if (qaHistoryCount > history.length) {
    const source: HistoryEntry = history[0] ?? {
      nodeId: `${presentationScene.id}:qa-source`,
      conversationId: presentationScene.conversationId,
      conversationTitle: presentationScene.conversationTitle,
      userMessage: presentationScene.userMessage,
      userMessages: presentationScene.userMessages,
      choiceId: 'qa-synthetic-choice',
      assistantText: presentationScene.choices[0]?.text ?? '这是仅用于长历史渲染验证的完整响应。',
      userContent: presentationScene.userContent,
      userLongInput: presentationScene.userLongInput,
      assistantContent: presentationScene.choices[0]?.content,
      assistantLongform: presentationScene.choices[0]?.longformPreview,
    }
    const baseEntries = history.length > 0 ? history : [source]
    if (qaHistoryCache.current?.source !== source || qaHistoryCache.current.count !== qaHistoryCount) {
      qaHistoryCache.current = {
        source,
        count: qaHistoryCount,
        entries: Array.from({ length: qaHistoryCount }, (_, index) => ({
          ...baseEntries[index % baseEntries.length],
          nodeId: `${baseEntries[index % baseEntries.length].nodeId}:qa:${index}`,
        })),
      }
    }
    renderedHistory = qaHistoryCache.current.entries
  }

  const conversationTitle = resolvePlayerVisibleIdentity(presentationScene.conversationId, activeHistory).label
  const handoffTargetTitle = transition?.targetScene
    ? resolvePlayerVisibleIdentity(transition.targetScene.conversationId, activeHistory).label
    : undefined
  const currentMessageMode = stage === 'ready'
    ? 'static'
    : stage === 'human-streaming'
      ? 'streaming'
      : currentStep?.effectDetail === 'identity'
        ? 'static'
        : stage === 'assistant-streaming'
          ? 'static'
          : 'hidden'
  const modelLabel = currentStep?.effectDetail === 'model-flash'
    ? `Aster 3.1 / #${String(8846 + meta.runCount).padStart(4, '0')}`
    : 'Aster 3.1'
  const modeControlProps = {
    activeSurface,
    open: modeMenuOpen,
    session: nonMainlineSession,
    onToggle: () => setModeMenuOpen((current) => !current),
    onEnter: enterNonMainline,
    onReturn: returnToMainline,
  }

  return protect(
    <div className="app-shell">
      <WorldSidebar
        history={sidebarHistory}
        runNumber={meta.runCount}
        currentConversationId={presentationScene.conversationId}
        currentLabel={conversationTitle}
        modeControls={<NonMainlineControls variant="desktop" {...modeControlProps} />}
      />
      <ConversationView
        scene={displayedScene}
        conversationTitle={conversationTitle}
        modelLabel={modelLabel}
        history={renderedHistory}
        flowStage={stage}
        effectDetail={currentStep?.effectDetail}
        choicesReady={choicesReady}
        assistantStreamingText={transition?.assistantText}
        assistantStreamKey={transition?.assistantStreamKey}
        handoffTargetTitle={handoffTargetTitle}
        currentMessageMode={currentMessageMode}
        modeControls={<NonMainlineControls variant="mobile" {...modeControlProps} />}
        inputSuspended={modeMenuOpen || Boolean(commitmentChoice)}
        onChoose={choose}
        onCurrentMessageComplete={() => {
          if (!initialStreaming) return
          setInitialStreaming(false)
          readySince.current = performance.now()
        }}
      />
      <dialog className="commitment-dialog" ref={commitmentDialog} onCancel={() => setCommitmentChoice(null)} aria-labelledby="commitment-title">
        <h2 id="commitment-title">锁定这个未来？</h2>
        <p>{scene?.choices.find(choice => choice.id === commitmentChoice)?.text}</p>
        <p>这会完成本局，最终承诺将不能更改。</p>
        <div className="recovery-actions"><button type="button" autoFocus onClick={() => setCommitmentChoice(null)}>继续审议</button><button type="button" onClick={() => { if (commitmentChoice) void choose(commitmentChoice, true) }}>确认锁定该未来</button></div>
      </dialog>
    </div>
  )
}
