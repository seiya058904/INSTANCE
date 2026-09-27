import { useEffect, useId, useRef } from 'react'
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
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRef = useRef<HTMLButtonElement>(null)
  const toggleRef = useRef(onToggle)
  toggleRef.current = onToggle

  useEffect(() => {
    if (!open || activeSurface !== 'mainline') return
    // Both responsive variants exist; only the visible one owns focus/events.
    const isVisible = () => Boolean(triggerRef.current?.getClientRects().length)
    if (isVisible()) itemRef.current?.focus()
    const dismissOutside = (event: PointerEvent) => {
      if (isVisible() && event.target instanceof Node && !rootRef.current?.contains(event.target)) toggleRef.current()
    }
    document.addEventListener('pointerdown', dismissOutside)
    return () => document.removeEventListener('pointerdown', dismissOutside)
  }, [open, activeSurface])

  if (activeSurface === 'non-mainline') {
    return (
      <div className={`${className} is-active`}>
        <span className="mode-progress">非主线 · {progress ?? 1}/40</span>
        <button type="button" className="mode-return" onClick={onReturn}>返回主线</button>
      </div>
    )
  }

  return (
    <div
      className={className}
      ref={rootRef}
      onKeyDown={(event) => {
        if (open && event.key === 'Escape') {
          event.preventDefault()
          onToggle()
          triggerRef.current?.focus()
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          if (!open) onToggle()
          else itemRef.current?.focus()
        }
      }}
      onBlur={(event) => {
        if (open && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) onToggle()
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={variant === 'desktop' ? 'world-action' : 'mobile-mode-trigger'}
        aria-label={variant === 'desktop' ? '新的对话' : '打开模式菜单'}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        onClick={onToggle}
      >
        {variant === 'desktop'
          ? <><svg className="world-action-plus" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg><span>新的对话</span></>
          : <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="4" cy="10" r="1.25" /><circle cx="10" cy="10" r="1.25" /><circle cx="16" cy="10" r="1.25" /></svg>}
      </button>
      {open && (
        <div className="mode-popover" role="menu" id={menuId} aria-label="非主线模式">
          <strong>非主线模式</strong>
          <small>40 个独立对话 · 完成后生成 Instance 评估</small>
          <button ref={itemRef} type="button" role="menuitem" onClick={onEnter}>
            {progress === null ? '开始' : session?.phase === 'evaluation' ? '查看评估 · 40/40' : `继续 · ${progress}/40`}
          </button>
        </div>
      )}
    </div>
  )
}
