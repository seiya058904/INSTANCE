import { useState, type CSSProperties } from 'react'
import { PUBLIC_WORLD_ENDINGS } from '../content/mainline2/endings'
import { ENDING_FILMS, OVERLAY_FILMS, filmForEnding } from '../content/mainline2/endingCinema'
import { publicEndingTitle } from '../content/mainline2/endingPlayerFacingCopy'
import type { EndingResult } from '../game/types'
import { EndingVisual } from './EndingVisual'

export function EndingCollection({ ending, completedEndings }: { ending: EndingResult; completedEndings: readonly string[] }) {
  const current = ending.worldEndingId ?? ending.id
  const unlocked = PUBLIC_WORLD_ENDINGS.filter(id => id === current || completedEndings.includes(id.replaceAll('_', ' ').toUpperCase()))
  const [selected, setSelected] = useState(current)
  const film = filmForEnding({ worldEndingId: selected } as EndingResult)
  const coda = ending.secretOverlay && OVERLAY_FILMS[ending.secretOverlay.endingId]
  if (!film) return null
  return <section className="closeout-section ending-collection" aria-labelledby="ending-collection-title">
    <h2 id="ending-collection-title">你留下过的世界</h2>
    <p className="closeout-section-intro">已抵达 {unlocked.length} / {PUBLIC_WORLD_ENDINGS.length} 个公开结局。这里收藏世界场景；本局的选择记录在上方档案中。</p>
    <div className="ending-shelf" role="group" aria-label="已抵达的公开结局">
      {unlocked.map(id => <button type="button" key={id} aria-label={publicEndingTitle(id)} aria-pressed={selected === id} onClick={() => setSelected(id)}>
        <EndingVisual id={id} color={ENDING_FILMS[id].color} compact />
        <span>{publicEndingTitle(id)}</span>{id === current && <small>本局</small>}
      </button>)}
    </div>
    <article className="ending-collection-preview" aria-live="polite" aria-atomic="true" style={{ '--film-accent': film.color } as CSSProperties}>
      <EndingVisual key={selected} id={selected} color={film.color} compact />
      <div><h3>{publicEndingTitle(selected)} · {film.scene}</h3><p>{film.aftermath}</p><p className="collection-last">{film.last}</p></div>
    </article>
    {coda && <div className="ending-collected-coda"><EndingVisual id={ending.secretOverlay!.endingId} color={coda.color} compact /><div><h3>本局隐藏余波 · {coda.title}</h3><p>{coda.last}</p></div></div>}
    <p className="ending-collection-note">过去的存档只保留公开结局名称，因此此处不重建旧局的选择或隐藏余波。</p>
  </section>
}
