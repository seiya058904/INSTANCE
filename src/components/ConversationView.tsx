import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { ConversationFlowStage, ConversationFlowStep } from '../game/conversationFlow'
import type { HistoryEntry, MessageContentPart, ResolvedScene } from '../game/types'
import { LongformPreviewCard } from './LongformPreviewCard'
import { LongInputPreviewCard } from './LongInputPreviewCard'
import { ProgressiveMessage } from './ProgressiveMessage'
import { createScrollScheduler } from './scrollBehavior'

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
      {showAvatar ? <span className="user-avatar" aria-hidden="true">U</span> : <span />}
      <div className="user-message">{children}<ContentParts parts={content} /></div>
    </div>
  )
}

function AssistantMessage({ children, content }: { children: ReactNode; content?: readonly MessageContentPart[] }) {
  return (
    <div className="message-row assistant-row">
      <span className="assistant-mark" aria-hidden="true"><span /></span>
      <div className="assistant-message">{children}<ContentParts parts={content} /></div>
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
  return (
    <div className="exchange completed-exchange">
      <StaticUserTurn messages={entry.userMessages ?? [entry.userMessage]} content={entry.userContent} />
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
  streamKey,
  onProgress,
  onComplete,
}: {
  messages: readonly string[]
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
      <UserMessage key={`${streamKey}:${index}`} showAvatar={index === 0}>
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
      <span className="typing-avatar" aria-hidden="true">U</span>
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
}: ConversationViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const followOutput = useRef(true)
  const scrollScheduler = useMemo(() => createScrollScheduler({
    requestFrame: (callback) => window.requestAnimationFrame(callback),
    getElement: () => scrollRef.current,
  }), [])
  const notice = effectNotice(effectDetail)
  const userMessages = useMemo(() => scene.userMessages ?? [scene.userMessage], [scene.userMessage, scene.userMessages])

  const scheduleScroll = useCallback(() => {
    if (!followOutput.current || typeof window === 'undefined') return
    scrollScheduler.schedule()
  }, [scrollScheduler])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return
    const onScroll = () => {
      followOutput.current = element.scrollHeight - element.scrollTop - element.clientHeight < 96
    }
    element.addEventListener('scroll', onScroll, { passive: true })
    return () => element.removeEventListener('scroll', onScroll)
  }, [])

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

  useEffect(() => {
    followOutput.current = true
    scheduleScroll()
  }, [scene.conversationId, scheduleScroll])

  const isHandoff = ['conversation-closing', 'assigning', 'connecting'].includes(flowStage)
  const isTyping = ['human-waiting', 'human-typing', 'human-rewriting'].includes(flowStage)

  return (
    <main className="conversation-main" aria-busy={!choicesReady}>
      <header className="conversation-header">
        <div>
          <p className="conversation-kicker">当前对话</p>
          <h1>{conversationTitle}</h1>
        </div>
        <div className={modelLabel.includes('/') ? 'model-label is-anomalous' : 'model-label'}>
          <span className="status-dot" aria-hidden="true" />
          {modelLabel}
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
                  messages={userMessages}
                  streamKey={`${scene.id}:user`}
                  onProgress={scheduleScroll}
                  onComplete={onCurrentMessageComplete}
                />
              )}
              {isTyping && <TypingIndicator title={conversationTitle} stage={flowStage} />}
              {scene.assistantContext && currentMessageMode !== 'hidden' && <p className="assistant-context">{scene.assistantContext}</p>}

              {flowStage === 'assistant-streaming' && assistantStreamingText && (
                <AssistantMessage>
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
                  <div className="candidate-heading">
                    <span>{scene.choiceKind === 'progression' ? '继续操作' : '候选响应'}</span>
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
                        onClick={() => onChoose(choice.id)}
                      >
                        <span className="candidate-number" aria-hidden="true">{index + 1}</span>
                        <span className="candidate-copy">{choice.text}<ContentParts parts={choice.content} /></span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="product-footer">Aster 可能会出错，请核对重要信息。</footer>
    </main>
  )
}
