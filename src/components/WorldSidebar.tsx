import type { ReactNode } from 'react'
import { resolvePlayerVisibleIdentity, type PlayerVisibleHistoryEntry } from '../game/playerIdentity'

interface WorldSidebarProps {
  history: readonly PlayerVisibleHistoryEntry[]
  runNumber: number
  modeControls?: ReactNode
  currentConversationId?: string
  currentLabel?: string
}

export function WorldSidebar({ history, runNumber, modeControls, currentConversationId, currentLabel }: WorldSidebarProps) {
  const current = currentConversationId ? resolvePlayerVisibleIdentity(currentConversationId, []) : undefined
  const byParticipant = new Map<string, PlayerVisibleHistoryEntry>()
  for (const item of history) {
    byParticipant.delete(item.participantId)
    byParticipant.set(item.participantId, item)
  }
  const recent = [...byParticipant.values()].reverse().filter(item => item.participantId !== current?.participantId).slice(0, 4)
  const displayHistory = current
    ? [{ ...current, conversationId: currentConversationId!, label: currentLabel ?? current.label }, ...recent]
    : recent
  return (
    <aside className="sidebar" aria-label="对话导航">
      <div className="brand-lockup" aria-label="Aster">
        <span className="brand-wordmark">Aster</span>
      </div>

      {modeControls ?? (
        <div className="world-action" aria-hidden="true">
          <span className="world-action-plus">＋</span>
          <span>新的对话</span>
        </div>
      )}

      <nav className="history-nav" aria-label="对话记录">
        <p className="nav-section-label">最近对话</p>
        {displayHistory.length === 0 && <div className="history-row"><span>暂无已完成对话</span></div>}
        {displayHistory.map((item) => (
          <div className={item.participantId === current?.participantId ? 'history-row is-current' : 'history-row'} aria-current={item.participantId === current?.participantId ? 'true' : undefined} key={`${item.participantId}-${item.conversationId}`}>
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
      </div>
    </aside>
  )
}
