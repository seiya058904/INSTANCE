import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('initial product surface', () => {
  it('renders a mature assistant shell with static world UI and real response controls', () => {
    const html = renderToStaticMarkup(<App initialRunId="render-test" />)

    expect(html).toContain('Aster')
    expect(html).toMatch(/User #[0-9]+/)
    expect(html).toContain('新的对话')
    expect(html).toContain('候选响应')
    expect((html.match(/<button/g) ?? []).length).toBeGreaterThanOrEqual(3)
    expect((html.match(/<button/g) ?? []).length).toBeLessThanOrEqual(4)
    expect(html).not.toContain('aria-disabled="true"')
  })
})
