import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { resolveTypingAudioIntent } from '../audio/typingAudio'
import { useTypingAudio } from '../audio/useTypingAudio'
import type { ConversationFlowStage, ConversationFlowStep } from '../game/conversationFlow'
import type { HistoryEntry, MessageContentPart, ResolvedScene } from '../game/types'
import { LongformPreviewCard } from './LongformPreviewCard'
import { LongInputPreviewCard } from './LongInputPreviewCard'
import { ProgressiveMessage } from './ProgressiveMessage'
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
  onStreamingChange,
  onComplete,
}: {
  messages: readonly string[]
  content?: readonly MessageContentPart[]
  streamKey: string
  onStreamingChange: (key: string, active: boolean) => void
  onComplete?: () => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)

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
          onStreamingChange={onStreamingChange}
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
  const decisionHeading = useRef<HTMLDivElement>(null)
  const previousConversation = useRef('')
  const pointerChoice = useRef<{ id: string; ready: boolean; type: string } | null>(null)
  const lastClick = useRef('')
  const [showLatest, setShowLatest] = useState(false)
  const [audibleStreamKey, setAudibleStreamKey] = useState<string | null>(null)
  const onStreamingChange = useCallback((key: string, active: boolean) => {
    setAudibleStreamKey(current => active ? key : current === key ? null : current)
  }, [])
  const notice = effectNotice(effectDetail)
  const userMessages = useMemo(() => scene.userMessages?.length ? scene.userMessages : [scene.userMessage], [scene.userMessage, scene.userMessages])

  const updateLatest = useCallback(() => {
    const element = scrollRef.current
    const latest = element?.firstElementChild?.lastElementChild
    if (!element || !latest) return
    // Measure content, not the column's bottom padding. A short message must
    // not show a jump button merely because it has trailing reading space.
    setShowLatest(latest.getBoundingClientRect().bottom > element.getBoundingClientRect().bottom + 8)
  }, [])

  const revealLatest = useCallback(() => {
    const element = scrollRef.current
    if (!element) return
    element.scrollTop = element.scrollHeight
    updateLatest()
    // This is a single jump, never an opt-in to following future characters.
  }, [updateLatest])

  useLayoutEffect(() => {
    if (previousConversation.current !== scene.conversationId) {
      previousConversation.current = scene.conversationId
      if (scrollRef.current) scrollRef.current.scrollTop = 0
    }
    updateLatest()
    if (flowStage !== 'ready') return
    // Focus the decision heading without moving the reading position. Enter
    // cannot accidentally activate a candidate left focused from the last turn.
    if (!inputSuspended) decisionHeading.current?.focus({ preventScroll: true })
  }, [flowStage, scene.id, scene.conversationId, updateLatest])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return
    element.addEventListener('scroll', updateLatest, { passive: true })
    const observer = new ResizeObserver(updateLatest)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    return () => {
      element.removeEventListener('scroll', updateLatest)
      observer.disconnect()
    }
  }, [updateLatest])

  const isHandoff = ['conversation-closing', 'assigning', 'connecting'].includes(flowStage)
  const isTyping = ['human-waiting', 'human-typing', 'human-rewriting'].includes(flowStage)

  const userStreamKey = `${scene.id}:user`
  const replyStreamKey = assistantStreamKey ?? `${scene.id}:assistant`
  // ProgressiveMessage reports activity after its first character is rendered
  // into the DOM. Waiting/typing indicators alone never start keyboard audio.
  useTypingAudio(resolveTypingAudioIntent({
    flowStage,
    currentMessageMode,
    assistantStreamingText: flowStage === 'assistant-streaming' ? assistantStreamingText : undefined,
    visibleTextStreaming: flowStage === 'assistant-streaming'
      ? audibleStreamKey === replyStreamKey
      : Boolean(audibleStreamKey?.startsWith(`${userStreamKey}:`)),
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
            <div className="exchange current-exchange">
              {currentMessageMode === 'static' && <StaticUserTurn messages={userMessages} content={scene.userContent} />}
              {currentMessageMode === 'static' && <LongInput preview={scene.userLongInput} />}
              {currentMessageMode === 'streaming' && (
                <StreamingUserTurn
                  key={userStreamKey}
                  messages={userMessages}
                  content={scene.userContent}
                  streamKey={userStreamKey}
                  onStreamingChange={onStreamingChange}
                  onComplete={onCurrentMessageComplete}
                />
              )}
              {isTyping && <TypingIndicator title={conversationTitle} stage={flowStage} />}
              {scene.assistantContext && currentMessageMode !== 'hidden' && <p className="assistant-context">{scene.assistantContext}</p>}

              {flowStage === 'assistant-streaming' && assistantStreamingText && (
                <AssistantMessage active>
                  <ProgressiveMessage
                    key={replyStreamKey}
                    text={assistantStreamingText}
                    streamKey={replyStreamKey}
                    play
                    announce
                    onStreamingChange={onStreamingChange}
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

      {showLatest && <button className="scroll-to-latest" type="button" aria-label="滚动到最新消息" title="滚动到最新消息" onClick={revealLatest}>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M10 4v12M5 11l5 5 5-5" /></svg>
      </button>}

      <footer className="product-footer">Aster 可能会出错，请核对重要信息。</footer>
    </main>
  )
}
