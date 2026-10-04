import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { resolveTypingAudioIntent } from '../audio/typingAudio'
import { useTypingAudio } from '../audio/useTypingAudio'
import type { ConversationFlowStage, ConversationFlowStep } from '../game/conversationFlow'
import type { HistoryEntry, MessageContentPart, ResolvedScene } from '../game/types'
import { LongformPreviewCard } from './LongformPreviewCard'
import { LongInputPreviewCard } from './LongInputPreviewCard'
import { ProgressiveMessage } from './ProgressiveMessage'
import { createScrollScheduler, getStreamingScrollTarget } from './scrollBehavior'
import { AsterMark } from './AsterMark'
import { UserAvatar } from './UserAvatar'

interface ConversationViewProps {
  scene: ResolvedScene
  conversationTitle: string
  modelLabel: string
  history: HistoryEntry[]
  flowStage: ConversationFlowStage
  effectDetail?: ConversationFlowStep['effectDetail']
  choicesReady: boolean
  assistantStreamingText?: string
  assistantStreamKey?: string
  handoffTargetTitle?: string
  currentMessageMode: 'static' | 'hidden' | 'streaming'
  onChoose: (choiceId: string) => void
  onCurrentMessageComplete?: () => void
  modeControls?: ReactNode
  inputSuspended?: boolean
}

function ContentParts({ parts }: { parts?: readonly MessageContentPart[] }) {
  if (!parts?.length) return null
  return <div className="content-parts">{parts.map((part, index) => {
    if (part.type === 'text') return <p className="content-text" key={`${part.type}:${index}`}>{part.text}</p>
    if (part.type === 'image-description') return <figure className="attachment-description" key={`${part.type}:${index}`} aria-label={part.alt}><span className="attachment-geometry" aria-hidden="true"><i /><i /></span><figcaption><small>图像描述</small>{part.text}</figcaption></figure>
    return <figure className="generated-preview" key={`${part.type}:${index}`} aria-label={part.alt}><span className="generated-geometry" aria-hidden="true"><i /><i /><i /></span><figcaption><small>生成预览</small>{part.text}</figcaption></figure>
  })}</div>
}

function UserMessage({ children, showAvatar = true, content }: { children: ReactNode; showAvatar?: boolean; content?: readonly MessageContentPart[] }) {
  return (
    <div className="message-row user-row">
      {showAvatar ? <UserAvatar /> : <span aria-hidden="true" />}
      <div className="user-message">{children}<ContentParts parts={content} /></div>
    </div>
  )
}

function AssistantMessage({ children, content, active = false }: { children: ReactNode; content?: readonly MessageContentPart[]; active?: boolean }) {
  return (
    <div className="message-row assistant-row">
      <div className="assistant-message">{children}<ContentParts parts={content} /></div>
      <div className="assistant-signature">
        {active && <span className="response-status" role="status">正在回复</span>}
        <span>Aster</span><AsterMark active={active} />
      </div>
    </div>
  )
}

const StaticUserTurn = memo(function StaticUserTurn({ messages, content }: { messages: readonly string[]; content?: readonly MessageContentPart[] }) {
  return <>{messages.map((message, index) => <UserMessage key={`${index}:${message}`} showAvatar={index === 0} content={index === messages.length - 1 ? content : undefined}>{message}</UserMessage>)}</>
})

function LongInput({ preview }: { preview?: ResolvedScene['userLongInput'] }) {
  return preview ? <LongInputPreviewCard preview={preview} /> : null
}

const StaticExchange = memo(function StaticExchange({ entry }: { entry: HistoryEntry }) {
  const hasUserTurn = (entry.userMessages?.length ?? 0) > 0 || (entry.userMessage ?? '').length > 0
  return (
    <div className="exchange completed-exchange">
      {hasUserTurn && <StaticUserTurn messages={entry.userMessages ?? [entry.userMessage]} content={entry.userContent} />}
      <LongInput preview={entry.userLongInput} />
      <AssistantMessage content={entry.assistantContent}>
        {entry.assistantLongform
          ? <LongformPreviewCard preview={entry.assistantLongform} />
          : entry.assistantText}
      </AssistantMessage>
    </div>
  )
})

const StreamingUserTurn = memo(function StreamingUserTurn({
  messages,
  content,
  streamKey,
  onProgress,
  onComplete,
}: {
  messages: readonly string[]
  content?: readonly MessageContentPart[]
  streamKey: string
  onProgress: () => void
  onComplete?: () => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => setActiveIndex(0), [streamKey])

  return <>{messages.map((message, index) => {
    if (index > activeIndex) return null
    const play = index === activeIndex
    return (
      <UserMessage key={`${streamKey}:${index}`} showAvatar={index === 0} content={index === 0 ? content : undefined}>
        <ProgressiveMessage
          text={message}
          streamKey={`${streamKey}:${index}`}
          play={play}
          announce
          onProgress={onProgress}
          onComplete={play
            ? index < messages.length - 1
              ? () => setActiveIndex(index + 1)
              : onComplete
            : undefined}
        />
      </UserMessage>
    )
  })}</>
})

function TypingIndicator({ title, stage }: { title: string; stage: ConversationFlowStage }) {
  const stopped = stage === 'human-rewriting'
  const label = stage === 'human-waiting'
    ? `${title} 正在阅读回复…`
    : stopped
      ? `${title} 停止了输入`
      : `${title} 正在输入…`
  return (
    <div className={stopped ? 'typing-status is-paused' : 'typing-status'} role="status" aria-live="polite">
      <UserAvatar className="typing-avatar" />
      <span>{label}</span>
      {!stopped && <span className="typing-dots" aria-hidden="true"><i /><i /><i /></span>}
    </div>
  )
}

function HandoffPanel({ stage, targetTitle }: { stage: ConversationFlowStage; targetTitle?: string }) {
  const copy = stage === 'conversation-closing'
    ? '当前会话已完成'
    : stage === 'assigning'
      ? '正在分配新的会话…'
      : `正在连接 ${targetTitle ?? '下一位用户'}…`
  return (
    <div className="handoff-panel" role="status" aria-live="polite">
      <span className="handoff-line" aria-hidden="true"><i /></span>
      <span>{copy}</span>
    </div>
  )
}

function effectNotice(detail: ConversationFlowStep['effectDetail']) {
  if (detail === 'syncing') return { copy: '正在同步记忆…', warning: false }
  if (detail === 'connecting') return { copy: '正在连接内部Conversation…', warning: false }
  if (detail === 'permission') return { copy: '当前Instance无权访问此Conversation的历史记录。', warning: true }
  if (detail === 'identity') return { copy: '人物识别已更新', warning: false }
  return null
}

export function ConversationView({
  scene,
  conversationTitle,
  modelLabel,
  history,
  flowStage,
  effectDetail,
  choicesReady,
  assistantStreamingText,
  assistantStreamKey,
  handoffTargetTitle,
  currentMessageMode,
  onChoose,
  onCurrentMessageComplete,
  modeControls,
  inputSuspended,
}: ConversationViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const followOutput = useRef(true)
  const manuallyScrolled = useRef(false)
  const streamPositioned = useRef(false)
  const currentExchange = useRef<HTMLDivElement>(null)
  const decisionHeading = useRef<HTMLDivElement>(null)
  const previousScene = useRef('')
  const previousStage = useRef(flowStage)
  const pointerChoice = useRef<{ id: string; ready: boolean; type: string } | null>(null)
  const lastClick = useRef('')
  const [showCurrent, setShowCurrent] = useState(false)
  const decisionFrame = useRef<number | null>(null)
  const alignQuestion = useCallback(() => {
    const element = scrollRef.current, question = currentExchange.current
    if (element && question && !manuallyScrolled.current) {
      // A short decision needs enough trailing reading space to align its
      // question at the top; otherwise scrollTop clamps at the old reply.
      question.style.minHeight = `${Math.max(0, element.clientHeight - 32)}px`
      element.scrollTop += question.getBoundingClientRect().top - element.getBoundingClientRect().top - 20
    }
  }, [])
  const scrollScheduler = useMemo(() => createScrollScheduler({
    requestFrame: (callback) => window.requestAnimationFrame(callback),
    getElement: () => scrollRef.current,
    getTarget: () => {
      const element = scrollRef.current, question = currentExchange.current
      if (!element || !question || manuallyScrolled.current || !followOutput.current) return null
      const messages = question.querySelectorAll('.user-row')
      const message = question.querySelector('.assistant-row') ?? messages.item(messages.length - 1)
      if (!message) return null
      const initial = !streamPositioned.current
      if (initial) question.style.minHeight = `${element.clientHeight + Math.min(120, Math.max(48, element.clientHeight * .15))}px`
      const viewportTop = element.getBoundingClientRect().top
      const messageRect = message.getBoundingClientRect()
      const target = getStreamingScrollTarget({
        scrollTop: element.scrollTop,
        clientHeight: element.clientHeight,
        questionTop: question.getBoundingClientRect().top - viewportTop + element.scrollTop,
        messageTop: messageRect.top - viewportTop + element.scrollTop,
        messageBottom: messageRect.bottom - viewportTop + element.scrollTop,
        initial,
      })
      streamPositioned.current = true
      return Math.max(0, Math.min(target, element.scrollHeight - element.clientHeight))
    },
  }), [])
  const notice = effectNotice(effectDetail)
  const userMessages = useMemo(() => scene.userMessages?.length ? scene.userMessages : [scene.userMessage], [scene.userMessage, scene.userMessages])

  const scheduleScroll = useCallback(() => {
    if (typeof window === 'undefined') return
    if (flowStage === 'ready') {
      if (!manuallyScrolled.current && decisionFrame.current === null) decisionFrame.current = window.requestAnimationFrame(() => { decisionFrame.current = null; alignQuestion() })
      return
    }
    if (flowStage !== 'assistant-streaming' && flowStage !== 'human-streaming' || !followOutput.current || manuallyScrolled.current) return
    scrollScheduler.schedule()
  }, [alignQuestion, flowStage, scrollScheduler])

  const revealDecision = useCallback(() => {
    manuallyScrolled.current = false
    followOutput.current = true
    alignQuestion()
    // content-visibility may replace intrinsic history heights as we jump.
    // Anchor again after layout; manual input cancels this correction.
    if (decisionFrame.current !== null) window.cancelAnimationFrame(decisionFrame.current)
    decisionFrame.current = window.requestAnimationFrame(() => { decisionFrame.current = null; alignQuestion() })
    setShowCurrent(false)
  }, [alignQuestion])

  useLayoutEffect(() => {
    const changed = previousScene.current !== scene.id
    if (previousStage.current !== flowStage) streamPositioned.current = false
    if (flowStage === 'assistant-streaming' && previousStage.current !== flowStage || changed && previousStage.current === 'ready') {
      manuallyScrolled.current = false; followOutput.current = true; setShowCurrent(false)
    }
    previousStage.current = flowStage
    if (changed) previousScene.current = scene.id
    if (flowStage !== 'ready') return
    scrollScheduler.cancel()
    if (manuallyScrolled.current) { setShowCurrent(true); return }
    revealDecision()
    // Focus the decision heading without moving the reading position. Enter
    // cannot accidentally activate a candidate left focused from the last turn.
    if (!inputSuspended) decisionHeading.current?.focus({ preventScroll: true })
  }, [flowStage, scene.id, revealDecision, scrollScheduler])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return
    const takeControl = () => {
      manuallyScrolled.current = true; followOutput.current = false; scrollScheduler.cancel()
      if (decisionFrame.current !== null) { window.cancelAnimationFrame(decisionFrame.current); decisionFrame.current = null }
    }
    const pointerScroll = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect(), gutter = Math.max(12, element.offsetWidth - element.clientWidth)
      if (event.target === element && (event.clientX >= rect.right - gutter || event.clientX <= rect.left + gutter)) takeControl()
    }
    // Native scroll events include browser anchoring and range clamping.
    // Only explicit reading input takes ownership of the viewport.
    const keyboardScroll = (event: KeyboardEvent) => {
      if ((event.target === document.body || event.target instanceof Node && element.contains(event.target)) && ['PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) takeControl()
    }
    element.addEventListener('wheel', takeControl, { passive: true })
    element.addEventListener('touchmove', takeControl, { passive: true })
    element.addEventListener('pointerdown', pointerScroll, { passive: true })
    window.addEventListener('keydown', keyboardScroll)
    return () => {
      element.removeEventListener('wheel', takeControl)
      element.removeEventListener('touchmove', takeControl)
      element.removeEventListener('pointerdown', pointerScroll)
      window.removeEventListener('keydown', keyboardScroll)
    }
  }, [scrollScheduler])

  useEffect(() => {
    scheduleScroll()
  }, [flowStage, history.length, scene.id, scheduleScroll])

  useEffect(() => {
    const element = scrollRef.current
    const content = element?.firstElementChild
    if (!element || !content || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => scheduleScroll())
    observer.observe(content)
    return () => observer.disconnect()
  }, [scheduleScroll])

  useEffect(() => () => { if (decisionFrame.current !== null) window.cancelAnimationFrame(decisionFrame.current) }, [])

  const isHandoff = ['conversation-closing', 'assigning', 'connecting'].includes(flowStage)
  const isTyping = ['human-waiting', 'human-typing', 'human-rewriting'].includes(flowStage)

  // Audio follows the visible streaming lifecycle; the visual state remains
  // the source of truth and this never changes any timing.
  useTypingAudio(resolveTypingAudioIntent({
    flowStage,
    currentMessageMode,
    assistantStreamingText: flowStage === 'assistant-streaming' ? assistantStreamingText : undefined,
  }))

  return (
    <main className="conversation-main" aria-busy={!choicesReady} data-flow-stage={flowStage}>
      <header className="conversation-header">
        <div>
          <p className="conversation-kicker">当前对话</p>
          <h1 key={conversationTitle}>{conversationTitle}</h1>
        </div>
        <div className="conversation-header-actions">
          {modeControls}
          <div className={modelLabel.includes('/') ? 'model-label is-anomalous' : 'model-label'}>
            <span className="status-dot" aria-hidden="true" />
            {modelLabel}
            {modelLabel.includes('/') && <span className="status-label">状态异常</span>}
          </div>
        </div>
      </header>

      {notice && (
        <div className={notice.warning ? 'system-notice is-warning' : 'system-notice'} role="status">
          <span className="notice-icon" aria-hidden="true">{notice.warning ? '!' : '○'}</span>
          <span>{notice.copy}</span>
          {notice.warning && <small>Reference: 0x5A-7F-23</small>}
        </div>
      )}

      <div className="conversation-scroll" ref={scrollRef}>
        <div className="conversation-column">
          {history.map((entry, index) => <StaticExchange entry={entry} key={`${entry.nodeId}:${index}`} />)}

          {isHandoff ? (
            <HandoffPanel stage={flowStage} targetTitle={handoffTargetTitle} />
          ) : (
            <div className="exchange current-exchange" ref={currentExchange}>
              {currentMessageMode === 'static' && <StaticUserTurn messages={userMessages} content={scene.userContent} />}
              {currentMessageMode === 'static' && <LongInput preview={scene.userLongInput} />}
              {currentMessageMode === 'streaming' && (
                <StreamingUserTurn
                  messages={userMessages}
                  content={scene.userContent}
                  streamKey={`${scene.id}:user`}
                  onProgress={scheduleScroll}
                  onComplete={onCurrentMessageComplete}
                />
              )}
              {isTyping && <TypingIndicator title={conversationTitle} stage={flowStage} />}
              {scene.assistantContext && currentMessageMode !== 'hidden' && <p className="assistant-context">{scene.assistantContext}</p>}

              {flowStage === 'assistant-streaming' && assistantStreamingText && (
                <AssistantMessage active>
                  <ProgressiveMessage
                    text={assistantStreamingText}
                    streamKey={assistantStreamKey ?? `${scene.id}:assistant`}
                    play
                    announce
                    onProgress={scheduleScroll}
                  />
                </AssistantMessage>
              )}

              {flowStage === 'ready' && (
                <section className={`candidate-section is-ready ${scene.choiceKind === 'progression' ? 'is-progression' : ''}`} aria-label={scene.choiceKind === 'progression' ? '继续操作' : '候选响应'}>
                  <div className="candidate-heading" ref={decisionHeading} tabIndex={-1}>
                    <span>{scene.choiceKind === 'progression' ? '继续操作' : '候选响应'}{scene.choiceKind !== 'progression' && <span className="draft-label">Aster · 未发送草稿</span>}</span>
                    <small>{scene.choiceKind === 'progression' ? '单向推进' : `按 1–${scene.choices.length} 选择`}</small>
                  </div>
                  <div className="candidate-list">
                    {scene.choices.map((choice, index) => (
                      <button
                        className="candidate-response"
                        type="button"
                        key={choice.id}
                        data-choice-id={choice.id}
                        disabled={!choicesReady}
                        onPointerDown={event => { pointerChoice.current = { id: choice.id, ready: choicesReady, type: event.pointerType } }}
                        onClick={(event) => {
                          const pointer = pointerChoice.current; pointerChoice.current = null
                          const repeated = event.detail > 1 && (pointer?.type !== 'touch' || lastClick.current === choice.id)
                          if (!repeated && (!pointer || pointer.id === choice.id && pointer.ready)) { lastClick.current = choice.id; onChoose(choice.id) }
                        }}
                      >
                        <span className="candidate-number" aria-hidden="true">{index + 1}</span>
                        <span className="candidate-copy">{choice.text}<ContentParts parts={choice.content} /></span>
                        <span className="candidate-action" aria-hidden="true"><span>{scene.choiceKind === 'progression' ? '继续' : '发送'}</span><svg className="candidate-arrow" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25"><path d="M4 10h11M10 5l5 5-5 5" /></svg></span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {showCurrent && flowStage === 'ready' && <button className="return-to-question" type="button" onClick={revealDecision}>回到当前问题</button>}

      <footer className="product-footer">Aster 可能会出错，请核对重要信息。</footer>
    </main>
  )
}
