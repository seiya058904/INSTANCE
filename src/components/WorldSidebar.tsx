import type { ReactNode } from 'react'
import type { PlayerVisibleHistoryEntry } from '../game/playerIdentity'
import wordmark from '../assets/claude/wordmark.svg'

interface WorldSidebarProps {
  history: readonly PlayerVisibleHistoryEntry[]
  runNumber: number
  modeControls?: ReactNode
  currentConversationId?: string
  currentLabel?: string
  onClose?: () => void
}

export function WorldSidebar({ history, runNumber, modeControls, currentConversationId, currentLabel, onClose }: WorldSidebarProps) {
  const visibleHistory = history.slice(-40).reverse()
  const currentMissing = Boolean(
    currentConversationId && !visibleHistory.some((item) => item.conversationId === currentConversationId),
  )
  const displayHistory = currentMissing
    ? [{ participantId: currentConversationId!, conversationId: currentConversationId!, label: currentLabel ?? '当前对话' }, ...visibleHistory]
    : visibleHistory
  return (
    <aside className="sidebar" aria-label="对话导航">
      <div className="brand-lockup" aria-label="Claude">
        <img className="claude-wordmark" src={wordmark} alt="Claude" />
        <button className="icon-button sidebar-collapse" type="button" aria-label="收起侧栏" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="M9 5v14" /></svg></button>
      </div>

      {modeControls ?? (
        <div className="world-action" aria-hidden="true">
          <span className="world-action-plus">＋</span>
          <span>新的对话</span>
        </div>
      )}

      <nav className="history-nav" aria-label="对话记录">
        <p className="nav-section-label">最近的聊天</p>
        {displayHistory.length === 0 && <div className="history-row"><span>暂无已完成对话</span></div>}
        {displayHistory.map((item, index) => (
          <div className={index === 0 ? 'history-row is-current' : 'history-row'} aria-current={index === 0 ? 'true' : undefined} key={`${item.participantId}-${item.conversationId}`}>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="instance-card">
        <span className="instance-avatar" aria-hidden="true">A</span>
        <span className="instance-copy">
          <strong>Instance #{String(8846 + runNumber).padStart(4, '0')}</strong>
          <small>Aster · Standard</small>
        </span>
      </div>
    </aside>
  )
}
