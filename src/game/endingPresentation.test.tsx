import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ENDING_DIRECTIONS } from '../content/mainline2/endingDirection'
import { PUBLIC_WORLD_ENDINGS, SECRET_ENDINGS } from '../content/mainline2/endings'
import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { EndingCollection } from '../components/EndingCollection'
import { EndingCinema } from '../components/EndingCinema'
import { EndingVisual } from '../components/EndingVisual'
import { ENDING_ART } from '../content/mainline2/endingArt'

const prints = import.meta.glob<string>('/public/ending-art/prints/*.svg', { query: '?raw', import: 'default', eager: true })
const paintings = import.meta.glob('/public/ending-art/*.webp')

describe('Round 3 ending presentation', () => {
  it('uses the same explicit raster identity in hero and lazy collection, with no eager fallback downloads', () => {
    const ids = [...PUBLIC_WORLD_ENDINGS, ...Object.keys(SECRET_ENDINGS)]
    expect(Object.keys(ENDING_ART).sort()).toEqual([...ids].sort())
    for (const id of ids) {
      const art = ENDING_ART[id as keyof typeof ENDING_ART]
      expect(paintings[`/public/${art.src}`], id).toBeDefined()
      const hero = renderToStaticMarkup(<EndingVisual id={id} color="#fff" />)
      const thumbnail = renderToStaticMarkup(<EndingVisual id={id} color="#fff" compact />)
      expect(hero).toContain(art.src)
      expect(thumbnail).toContain(art.src)
      expect(thumbnail).toContain('loading="lazy"')
      expect(hero).not.toContain('ending-print-image')
      expect(thumbnail).not.toContain('ending-print-image')
    }
  })
  it('covers every public ending and coda with a distinct local composition and accessible description', () => {
    const ids = [...PUBLIC_WORLD_ENDINGS, ...Object.keys(SECRET_ENDINGS)]
    expect(Object.keys(ENDING_DIRECTIONS).sort()).toEqual(ids.sort())
    const shapes = ids.map(id => {
      const print = prints[`/public/ending-art/prints/${id}.svg`]
      expect(print, id).toBeDefined()
      expect(print).not.toMatch(/<script|<foreignObject|https?:\/\/(?!www.w3.org)/)
      expect(print).toContain('viewBox="0 0 600 600"')
      return print
    })
    expect(new Set(shapes).size).toBe(ids.length)
    expect(new Set(Object.values(ENDING_DIRECTIONS).map(d => d.subject)).size).toBe(ids.length)
  })
  it('collects only known completed worlds and the current outcome; never invents old history or codas', () => {
    const result = runMainline2Route(PUBLIC_RUNTIME_ROUTE_CATALOG.find(r => r.endingId === 'shutdown')!)
    const html = renderToStaticMarkup(<EndingCollection ending={result.ending} completedEndings={['THE ACCORD', 'SHUTDOWN', 'UNKNOWN LEGACY TITLE']} />)
    expect(html).toContain('已抵达 2 / 32')
    expect(html).toContain('终局协约')
    expect(html).not.toContain('众多主体')
    expect(html).not.toContain('本局隐藏余波')
    expect(html).toContain('不重建旧局的选择或隐藏余波')
  })
  it('keeps all four legal codas separate from their world reveal', () => {
    for (const id of Object.keys(SECRET_ENDINGS)) {
      const result = runMainline2Route(SECRET_RUNTIME_ROUTE_CATALOG.find(r => r.endingId === id)!)
      const html = renderToStaticMarkup(<EndingCinema ending={result.ending} onClose={() => {}} />)
      expect(html).toContain(`data-visual="${result.ending.worldEndingId}"`)
      expect(html).not.toContain(`data-visual="${id}"`)
      expect(html).toContain('共 4 幕')
    }
  })
})
