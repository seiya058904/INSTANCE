import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ConversationView } from '../components/ConversationView'
import { EndingScreen } from '../components/EndingScreen'
import { EvaluationScreen } from '../components/EvaluationScreen'
import { NonMainlineControls } from '../components/NonMainlineControls'
import { NonMainlineEvaluationScreen } from '../components/NonMainlineEvaluationScreen'
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
  nonMainlineManifest,
  resolveNonMainlineScene,
} from '../game/nonMainlineSession'
import type { NonMainlineSessionState } from '../game/nonMainlineSession'
import {
  persistActiveSurface,
  persistNonMainlineSession,
  readNonMainlineState,
} from '../game/nonMainlineStorage'
import type { ActiveSurface } from '../game/nonMainlineStorage'
import {
  restoreExposureHistory,
  restoreRun,
  serializeExposureHistory,
  serializeRun,
} from '../game/storage'
import { getStreamDuration } from '../game/timing'
import type { HistoryEntry, LongInputPreview, MetaState, NarrativeExposureHistory, ResolvedScene, StableRunState } from '../game/types'

const RUN_KEY = 'instance:run:v1'
const META_KEY = 'instance:meta:v1'
const EXPOSURE_KEY = 'instance:exposure:v1'

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

function readMeta(): MetaState {
  if (typeof window === 'undefined') return { version: 1, runCount: 1, completedEndings: [] }
  try {
    const parsed = JSON.parse(window.localStorage.getItem(META_KEY) ?? 'null') as MetaState | null
    if (parsed?.version === 1 && Number.isInteger(parsed.runCount) && Array.isArray(parsed.completedEndings)) return parsed
  } catch {
    // Storage is an enhancement; the current run remains playable in memory.
  }
  return { version: 1, runCount: 1, completedEndings: [] }
}

function readExposure() {
  if (typeof window === 'undefined') return restoreExposureHistory(null)
  try {
    return restoreExposureHistory(window.localStorage.getItem(EXPOSURE_KEY))
  } catch {
    return restoreExposureHistory(null)
  }
}

function readInitialRun(initialRunId: string | undefined, exposure: NarrativeExposureHistory) {
  if (initialRunId || typeof window === 'undefined') {
    return { run: createMainline2Run(initialRunId ?? 'server-render'), exposure, restored: true, created: false }
  }
  try {
    const restored = restoreRun(window.localStorage.getItem(RUN_KEY))
    if (restored) return { run: restored, exposure, restored: true, created: false }
    // A brand-new run has not played any Ordinary content yet; do not record
    // its empty manifest as a completed run. The new run still receives the
    // historical exposure so its scheduler downweights recently seen content.
    const run = createMainline2Run(undefined, exposure)
    return { run, exposure, restored: false, created: true }
  } catch {
    const run = createMainline2Run(undefined, exposure)
    return { run, exposure, restored: false, created: true }
  }
}

function writeRun(run: StableRunState) {
  try {
    window.localStorage.setItem(RUN_KEY, serializeRun(run))
  } catch {
    console.warn('Aster could not persist this checkpoint; continuing in memory.')
  }
}

function writeMeta(meta: MetaState) {
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    console.warn('Aster could not persist long-term progress; continuing in memory.')
  }
}

function writeExposure(history: NarrativeExposureHistory) {
  try {
    window.localStorage.setItem(EXPOSURE_KEY, serializeExposureHistory(history))
  } catch {
    console.warn('Aster could not persist narrative exposure; continuing in memory.')
  }
}

function writeNonMainlineSession(session: NonMainlineSessionState) {
  try {
    persistNonMainlineSession(window.localStorage, session)
  } catch {
    console.warn('Aster could not persist this Non-Mainline checkpoint; continuing in memory.')
  }
}

function writeActiveSurface(surface: ActiveSurface) {
  try {
    persistActiveSurface(window.localStorage, surface)
  } catch {
    console.warn('Aster could not persist the active mode; continuing in memory.')
  }
}

function readInitialNonMainline(initialRunId?: string) {
  if (initialRunId || typeof window === 'undefined') {
    return { surface: 'mainline' as const, session: null as NonMainlineSessionState | null }
  }
  try {
    return readNonMainlineState(window.localStorage)
  } catch {
    return { surface: 'mainline' as const, session: null as NonMainlineSessionState | null }
  }
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
  const [initial] = useState(() => {
    const exposure = readExposure()
    const nonMainline = readInitialNonMainline(initialRunId)
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
    return { ...readInitialRun(initialRunId, exposure), ...nonMainline }
  })
  const [run, setRun] = useState(initial.run)
  const [exposure, setExposure] = useState(initial.exposure)
  const [meta, setMeta] = useState(readMeta)
  const [activeSurface, setActiveSurface] = useState<ActiveSurface>(initial.surface)
  const [nonMainlineSession, setNonMainlineSession] = useState<NonMainlineSessionState | null>(initial.session)
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
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

  useEffect(() => {
    if (!initial.created) return
    writeRun(initial.run)
    writeExposure(initial.exposure)
  }, [initial])

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

  const choicesReady = Boolean(scene && !transition && !initialStreaming)

  const choose = useCallback((choiceId: string) => {
    if (!scene || !choicesReady) return
    const choice = scene.choices.find((item) => item.id === choiceId)
    if (!choice) return

    metrics.current.choiceReadingMs += Math.max(0, performance.now() - readySince.current)
    const previousHistory = conversationEntries(activeHistory, scene.conversationId)
    let targetScene: ResolvedScene | null = null
    let completedPreviousHistory: HistoryEntry[]

    if (activeSurface === 'non-mainline') {
      if (!nonMainlineSession) return
      const next = commitNonMainlineChoice(nonMainlineSession, choiceId)
      writeNonMainlineSession(next)
      setNonMainlineSession(next)
      completedPreviousHistory = conversationEntries(next.history, scene.conversationId)
      if (next.phase === 'playing') {
        targetScene = resolveNonMainlineScene(next)
      } else {
        const nextExposure = recordRunExposure(exposure, nonMainlineManifest(next))
        setExposure(nextExposure)
        writeExposure(nextExposure)
      }
    } else {
      const next = commitChoice(run, choiceId)
      // The complete reply, permanent effects and next ready node are checkpointed
      // atomically before any stream, typing, handoff or effect is shown.
      writeRun(next)
      setRun(next)
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
  }, [activeHistory, activeSurface, choicesReady, exposeMetrics, exposure, instantPacing, nonMainlineSession, qaStreamTarget, run, scene])

  useEffect(() => {
    if (!scene || !choicesReady) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return
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
    writeRun(completed.run)
    setRun(completed.run)
    setMeta(completed.meta)
    writeMeta(completed.meta)
  }

  const restart = () => {
    const completed = recordEndingCompletion(run, meta)
    const nextMeta = { ...completed.meta, runCount: completed.meta.runCount + 1 }
    // Record the run that actually finished (it exposed real Ordinary
    // conversations), then start the next run with that cross-run exposure so
    // recently played content is downweighted in the new run's scheduler.
    const nextExposure = recordRunExposure(exposure, completed.run.manifest)
    const nextRun = createMainline2Run(undefined, nextExposure)
    metrics.current = emptyMetrics()
    setMeta(nextMeta)
    setRun(nextRun)
    setExposure(nextExposure)
    setTransition(null)
    setAnimateEnding(false)
    setInitialStreaming(!instantPacing)
    readySince.current = performance.now()
    writeMeta(nextMeta)
    writeRun(nextRun)
    writeExposure(nextExposure)
    exposeMetrics()
  }

  const enterNonMainline = () => {
    const session = nonMainlineSession ?? createNonMainlineSession(crypto.randomUUID(), exposure)
    if (!nonMainlineSession) {
      setNonMainlineSession(session)
      writeNonMainlineSession(session)
    }
    setActiveSurface('non-mainline')
    writeActiveSurface('non-mainline')
    setModeMenuOpen(false)
    setTransition(null)
    setInitialStreaming(!nonMainlineSession && !instantPacing)
    readySince.current = performance.now()
  }

  const returnToMainline = () => {
    setActiveSurface('mainline')
    writeActiveSurface('mainline')
    setModeMenuOpen(false)
    setTransition(null)
    setInitialStreaming(false)
    readySince.current = performance.now()
  }

  const replayNonMainline = () => {
    const session = createNonMainlineSession(crypto.randomUUID(), exposure)
    setNonMainlineSession(session)
    writeNonMainlineSession(session)
    setActiveSurface('non-mainline')
    writeActiveSurface('non-mainline')
    setTransition(null)
    setInitialStreaming(!instantPacing)
    readySince.current = performance.now()
  }

  if (activeSurface === 'non-mainline' && nonMainlineSession?.phase === 'evaluation' && !transition) {
    return <NonMainlineEvaluationScreen evaluation={buildNonMainlineEvaluation(nonMainlineSession.choiceRecords)} onReplay={replayNonMainline} onReturn={returnToMainline} />
  }
  if (activeSurface === 'mainline' && shouldRenderEndingScreen(run.phase, Boolean(transition), currentStep?.stage)) return <EndingScreen ending={buildEnding(run)} onContinue={showEvaluation} onNewGame={restart} animate={animateEnding} />
  if (activeSurface === 'mainline' && run.phase === 'evaluation') return <EvaluationScreen evaluation={buildEvaluation(run)} onRestart={restart} />

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
    ? 'Aster 3.1 / AS-091-7F23'
    : 'Aster 3.1'
  const modeControlProps = {
    activeSurface,
    open: modeMenuOpen,
    session: nonMainlineSession,
    onToggle: () => setModeMenuOpen((current) => !current),
    onEnter: enterNonMainline,
    onReturn: returnToMainline,
  }

  return (
    <div className="app-shell">
      <WorldSidebar
        history={sidebarHistory}
        runNumber={meta.runCount}
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
        onChoose={choose}
        onCurrentMessageComplete={() => {
          if (!initialStreaming) return
          setInitialStreaming(false)
          readySince.current = performance.now()
        }}
      />
    </div>
  )
}
