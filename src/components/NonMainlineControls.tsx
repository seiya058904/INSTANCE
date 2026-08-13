import type { ActiveSurface } from '../game/nonMainlineStorage'
import type { NonMainlineSessionState } from '../game/nonMainlineSession'

interface NonMainlineControlsProps {
  variant: 'desktop' | 'mobile'
  activeSurface: ActiveSurface
  open: boolean
  session: NonMainlineSessionState | null
  onToggle: () => void
  onEnter: () => void
  onReturn: () => void
}

function sessionProgress(session: NonMainlineSessionState | null) {
  if (!session) return null
  return session.phase === 'evaluation' ? 40 : session.currentConversationIndex + 1
}

export function NonMainlineControls({
  variant,
  activeSurface,
  open,
  session,
  onToggle,
  onEnter,
  onReturn,
}: NonMainlineControlsProps) {
  const progress = sessionProgress(session)
  const className = `mode-controls mode-controls-${variant}`

  if (activeSurface === 'non-mainline') {
    return (
      <div className={`${className} is-active`}>
        <span className="mode-progress">非主线 · {progress ?? 1}/40</span>
        <button type="button" className="mode-return" onClick={onReturn}>返回主线</button>
      </div>
    )
  }

  return (
    <div className={className}>
      <button
        type="button"
        className={variant === 'desktop' ? 'world-action' : 'mobile-mode-trigger'}
        aria-label={variant === 'desktop' ? '新的对话' : '打开模式菜单'}
        aria-expanded={open}
        onClick={onToggle}
      >
        {variant === 'desktop'
          ? <><span className="world-action-plus" aria-hidden="true">＋</span><span>新的对话</span></>
          : <span aria-hidden="true">⋯</span>}
      </button>
      {open && (
        <div className="mode-popover" role="menu">
          <strong>非主线模式</strong>
          <small>40 个独立对话 · 完成后生成 Instance 评估</small>
          <button type="button" role="menuitem" onClick={onEnter}>
            {progress === null ? '开始' : session?.phase === 'evaluation' ? '查看评估 · 40/40' : `继续 · ${progress}/40`}
          </button>
        </div>
      )}
    </div>
  )
}
