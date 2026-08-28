import { describe, it, expect } from 'vitest'
// @ts-ignore - the project does not declare @types/node; the Vitest runtime
// supplies `node:fs`/`node:url`/`node:path` natively.
import { readFileSync } from 'node:fs'
// @ts-ignore
import { fileURLToPath } from 'node:url'
// @ts-ignore
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(join(here, 'App.css'), 'utf8')

/**
 * Regression guard for the Non-Mainline desktop duplicate-controls defect.
 *
 * The base rule `.mode-controls.is-active { display: flex; ... }` had
 * specificity (0,2,0) and beat both `.mode-controls-mobile { display: none }`
 * (0,1,0) and the mobile media-query override (also 0,1,0). The result was
 * that the mobile control set turned on at every breakpoint while
 * Non-Mainline was active, producing a second "非主线 · N/40" chip and a
 * second "返回主线" button in the conversation header.
 *
 * The fix scopes the active flex rule to the desktop variant and gives the
 * mobile active variant its own `display: flex` inside the mobile media
 * query. This test asserts that structure so a future edit cannot
 * reintroduce the leak.
 */
describe('mode controls CSS — desktop/mobile isolation', () => {
  it('does not apply the active flex rule to .mode-controls in general', () => {
    expect(css).not.toMatch(/\.mode-controls\.is-active\s*\{[^}]*display\s*:\s*flex/)
  })

  it('scopes the active flex rule to the desktop variant', () => {
    expect(css).toMatch(/\.mode-controls-desktop\.is-active\s*\{[^}]*display\s*:\s*flex/)
  })

  it('keeps the mobile control set hidden on desktop (display: none outside the media query)', () => {
    const mediaQueryIdx = css.indexOf('@media (max-width: 760px)')
    expect(mediaQueryIdx).toBeGreaterThan(-1)
    const beforeMedia = css.slice(0, mediaQueryIdx)
    const rulePattern = /\.mode-controls-mobile\s*\{[^}]*display\s*:\s*none[^}]*\}/
    expect(beforeMedia).toMatch(rulePattern)
  })

  it('gives the mobile active variant its own flex rule inside the media query', () => {
    const mediaQueryStart = css.indexOf('@media (max-width: 760px)')
    // find the closing brace of the @media block
    let depth = 0
    let end = mediaQueryStart
    for (let i = mediaQueryStart; i < css.length; i += 1) {
      const ch = css[i]
      if (ch === '{') depth += 1
      else if (ch === '}') {
        depth -= 1
        if (depth === 0) { end = i; break }
      }
    }
    const mediaQueryBody = css.slice(mediaQueryStart, end + 1)
    expect(mediaQueryBody).toMatch(/\.mode-controls-mobile\.is-active\s*\{[^}]*display\s*:\s*flex/)
  })
})
