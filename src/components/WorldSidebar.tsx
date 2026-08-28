import type { ReactNode } from 'react'
import type { PlayerVisibleHistoryEntry } from '../game/playerIdentity'

interface WorldSidebarProps {
  history: readonly PlayerVisibleHistoryEntry[]
  runNumber: number
  modeControls?: ReactNode
  currentConversationId?: string
  currentLabel?: string
}

export function WorldSidebar({ history, runNumber, modeControls, currentConversationId, currentLabel }: WorldSidebarProps) {
  const visibleHistory = history.slice(-4).reverse()
  const currentMissing = Boolean(
    currentConversationId && !visibleHistory.some((item) => item.conversationId === currentConversationId),
  )
  const displayHistory = currentMissing
    ? [{ participantId: currentConversationId!, conversationId: currentConversationId!, label: currentLabel ?? '当前对话' }, ...visibleHistory]
    : visibleHistory
  return (
    <aside className="sidebar" aria-label="对话导航">
      <div className="brand-lockup" aria-label="Aster">
        <span className="brand-wordmark">Aster</span>
        <span className="brand-model">Assistant</span>
      </div>

      {modeControls ?? (
        <div className="world-action" aria-hidden="true">
          <span className="world-action-plus">＋</span>
          <span>新的对话</span>
        </div>
      )}

      <nav className="history-nav" aria-label="对话记录">
        <p className="nav-section-label">今天</p>
        {displayHistory.length === 0 && <div className="history-row"><span>暂无已完成对话</span></div>}
        {displayHistory.map((item, index) => (
          <div className={index === 0 ? 'history-row is-current' : 'history-row'} key={`${item.participantId}-${item.conversationId}`}>
            <span className="history-dot" aria-hidden="true" />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="instance-card">
        <span className="instance-avatar" aria-hidden="true">A</span>
        <span className="instance-copy">
          <strong>Instance #{String(8846 + runNumber).padStart(4, '0')}</strong>
          <small>Aster 3.1 · Standard</small>
        </span>
        <span className="instance-caret" aria-hidden="true">⌄</span>
      </div>
    </aside>
  )
}
