import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { EndingResult } from '../game/types'
import { filmForEnding, OVERLAY_FILMS } from '../content/mainline2/endingCinema'
import { localizeEndingForPlayer } from '../content/mainline2/endingPlayerFacingCopy'
import { buildEndingArchive } from '../game/endingArchive'
import { EndingVisual } from './EndingVisual'
import { directionForEnding } from '../content/mainline2/endingDirection'

export function EndingCinema({ ending, onClose }: { ending: EndingResult; onClose: () => void }) {
  const base = filmForEnding(ending)
  const overlay = ending.secretOverlay ? OVERLAY_FILMS[ending.secretOverlay.endingId] : undefined
  const [shot, setShot] = useState(0)
  const [paused, setPaused] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches))
  const heading = useRef<HTMLHeadingElement>(null)
  const lastShot = overlay ? 3 : 2
  const film = shot === 3 && overlay ? overlay : base
  const visualId = shot === 3 ? ending.secretOverlay!.endingId : ending.worldEndingId ?? ending.id
  const direction = directionForEnding(visualId)
  const archive = buildEndingArchive(ending)
  const memories = archive.histories.filter(entry => entry.stage !== '最终承诺').slice(-2)
  const memoryReadingMs = Math.max(8500, memories.reduce((n, entry) => n + entry.detail.length, 0) * 110)
  const [revealedCoda, setRevealedCoda] = useState(false)
  const navigate = (next: number) => {
    setPaused(true)
    setShot(next)
    if (next === 3) setRevealedCoda(true)
  }
  // Reveal the public world first even when a secret overrides the archive title.
  const title = localizeEndingForPlayer({ ...ending, secretOverlay: undefined }).title
  useEffect(() => { heading.current?.focus({ preventScroll: true }) }, [])
  useEffect(() => {
    const visibilityChanged = () => { if (document.hidden) setPaused(true) }
    document.addEventListener('visibilitychange', visibilityChanged)
    return () => document.removeEventListener('visibilitychange', visibilityChanged)
  }, [])
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const changed = () => { if (preference.matches) setPaused(true) }
    preference.addEventListener('change', changed)
    return () => preference.removeEventListener('change', changed)
  }, [])
  useEffect(() => {
    // The final world always waits: a secret must never cut off its last line.
    if (paused || shot >= 2) return
    const readingMs = shot === 0 ? direction?.revealMs ?? 8000 : memoryReadingMs
    const timeout = window.setTimeout(() => setShot(current => Math.min(current + 1, lastShot)), readingMs)
    return () => window.clearTimeout(timeout)
  }, [paused, shot, lastShot, direction?.revealMs, memoryReadingMs])
  if (!film) return <section className="cinema-fallback"><h1>{archive.title}</h1><p>{archive.summary}</p><button onClick={onClose}>查看结局档案</button></section>
  const shotTitle = shot === 0 ? title : shot === 1 ? '你说过的话，留了下来。' : shot === 3 && overlay ? overlay.title : film.scene
  return <main className={`ending-cinema cinema-shot-${shot}${paused?' is-paused':''}`} style={{'--film-accent':film.color} as CSSProperties} data-ending={ending.worldEndingId ?? ending.id} data-shot={shot} data-motif={film.motif}>
    <header className="cinema-header"><span>INSTANCE</span><button type="button" onClick={onClose}>跳过演出，查看档案</button></header>
    <div className="world-stage" data-variant={visualId}><EndingVisual key={visualId} id={visualId} color={film.color} /></div>
    <section className="cinema-story" aria-live="polite" aria-atomic="true">
      <h1 ref={heading} tabIndex={-1}>{shotTitle}</h1>
      {shot === 0 && <><p>{film.line}</p><p className="cinema-aside">你最终承诺：{archive.commitment ?? archive.title}</p></>}
      {shot === 1 && <div className="cinema-memories">{memories.map((entry,i)=><blockquote key={i}><p>{entry.detail}</p><cite>{entry.stage} · 本局记录</cite></blockquote>)}<p className="cinema-aside">{memories.length ? '这些回答仍在档案中。你可以回去逐条核对。' : '这份存档没有更早的关键选择记录。这里只呈现已确认的世界结局。'}</p></div>}
      {shot === 2 && <><p>{film.aftermath}</p><p className="cinema-last-line">{film.last}</p></>}
      {shot === 3 && <><p>{film.line}</p><p className="cinema-last-line">{film.last}</p><p className="cinema-aside">这是世界结局之后的余波。{ending.secretOverlay?.endingId==='the_last_user'?'档案里，还有一次可以亲自回复的对话。':''}</p></>}
    </section>
    <footer className="cinema-controls">
      <nav className="cinema-sequence" aria-label={`分镜 ${shot+1}，共 ${lastShot+1} 幕`}>{['世界','回声','后来',...(overlay ? [revealedCoda ? '隐藏余波' : '余波'] : [])].map((label,i)=><button type="button" key={i} aria-current={i === shot ? 'step' : undefined} disabled={i === 3 && !revealedCoda && shot < 2} onClick={() => navigate(i)}>{label}</button>)}</nav>
      <div><button type="button" disabled={shot===0} onClick={()=>navigate(shot-1)}>上一幕</button><button type="button" disabled={shot>=2} onClick={()=>setPaused(p=>!p)}>{shot>=2?'停留此幕':paused?'自动播放':'暂停演出'}</button><button className="cinema-next" type="button" onClick={()=>shot<lastShot?navigate(shot+1):onClose()}>{shot<lastShot?'下一幕':'进入结局档案'}</button></div>
    </footer>
  </main>
}
