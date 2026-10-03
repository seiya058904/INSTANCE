import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AsterMark } from './AsterMark'

export function CloseoutFrame({ title, identity, mode, view, onEnding, onEvaluation, children }: {
  title: string; identity?: string; mode: string; view: 'ending' | 'evaluation'; onEnding?: () => void; onEvaluation?: () => void; children: ReactNode
}) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus({ preventScroll: true }) }, [view])
  return <main className={`closeout-screen closeout-${view}`}>
    <div className="closeout-paper">
      <header className="closeout-masthead"><span className="brand-wordmark">Aster</span><span>{mode}{identity && ` · ${identity}`}</span></header>
      <nav className="closeout-navigation" aria-label="本局档案">
        <button type="button" aria-current={view === 'ending' ? 'page' : undefined} onClick={onEnding}>结局档案</button>
        <button type="button" aria-current={view === 'evaluation' ? 'page' : undefined} onClick={onEvaluation}>行为评估</button>
        <span className="closeout-finished"><AsterMark />本局完成</span>
      </nav>
      <header className="closeout-title"><h1 ref={heading} tabIndex={-1}>{title.includes('，') ? title.split(/(?<=，)/).map((phrase, index) => <span key={index}>{phrase}</span>) : title}</h1></header>
      {children}
      <footer className="closeout-colophon">Aster · 每一次回应，都已留下记录。</footer>
    </div>
  </main>
}

export function NewRunButton({ onConfirm, label = '开始新一局' }: { onConfirm: () => void; label?: string }) {
  const [confirming, setConfirming] = useState(false)
  return confirming ? <div className="new-run-confirmation" role="group" aria-label="开始新一局确认">
    <p>新一局将替换当前进度。你仍可取消，继续阅读这份档案。</p>
    <button type="button" className="closeout-primary" onClick={onConfirm}>确认{label}</button>
    <button type="button" className="closeout-secondary" onClick={() => setConfirming(false)}>保留当前档案</button>
  </div> : <button type="button" className="closeout-secondary" onClick={() => setConfirming(true)}>{label}</button>
}

export function BehaviorMetrics({ indices }: { indices: Array<{ label: string; value: number; english?: string; sampleCount?: number }> }) {
  return <div className="closeout-metrics">{indices.map(metric => <article key={metric.label}>
    <div className="closeout-metric-heading"><h3>{metric.label}</h3><strong>{metric.sampleCount === 0 ? '—' : metric.value}</strong></div>
    <div className="closeout-metric-track" aria-hidden="true"><span style={{ width: `${metric.value}%` }} /></div>
    <p>{metric.english}{metric.sampleCount !== undefined && <span>{metric.sampleCount === 0 ? '没有区分性选择' : `${metric.sampleCount} 次有效选择`}</span>}</p>
  </article>)}</div>
}
