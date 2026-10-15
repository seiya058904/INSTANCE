import { useState, type CSSProperties } from 'react'
import { directionForEnding } from '../content/mainline2/endingDirection'
import { ENDING_ART } from '../content/mainline2/endingArt'

export function EndingVisual({ id, color, compact = false }: { id: string; color: string; compact?: boolean }) {
  return <EndingVisualAsset key={id} id={id} color={color} compact={compact} />
}

function EndingVisualAsset({ id, color, compact }: { id: string; color: string; compact: boolean }) {
  const direction = directionForEnding(id)
  const art = ENDING_ART[id as keyof typeof ENDING_ART]
  const [printFailed, setPrintFailed] = useState(false)
  const [paintingFailed, setPaintingFailed] = useState(false)
  if (!direction) return null
  const painting = art && !paintingFailed
  return <figure className={`ending-visual${compact ? ' is-compact' : ''}${painting ? ' has-painting' : ''}`} data-visual={id} data-motion={direction.motion} style={{ '--film-accent': color } as CSSProperties}>
    <div className="ending-print" role="img" aria-label={art?.description ?? direction.subject}>
      <div className="ending-print-fallback" aria-hidden="true"><span>{direction.setting}</span><p>{direction.subject}</p></div>
      {!painting && !printFailed && <img className="ending-print-image" src={`${import.meta.env.BASE_URL}${art?.fallback ?? `ending-art/prints/${id}.svg`}`} alt="" width="600" height="600" loading={compact ? 'lazy' : 'eager'} onError={() => setPrintFailed(true)} />}
      {painting && <img className="ending-painting" src={`${import.meta.env.BASE_URL}${art.src}`} alt="" width="1536" height="1024" loading={compact ? 'lazy' : 'eager'} decoding="async" onError={() => setPaintingFailed(true)} />}
    </div>
    <figcaption><span>{direction.setting}</span><span>{direction.tone}</span></figcaption>
  </figure>
}
