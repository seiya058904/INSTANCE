import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { App, recordEndingCompletion } from './App'
import { createMainline2Run } from '../game/engine'

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

  it('records an ending before a direct new-game restart path', () => {
    const run = { ...createMainline2Run('direct-restart-ending'), phase: 'ending' as const, currentNodeId: 'ending' }
    const meta = { version: 1 as const, runCount: 4, completedEndings: [] }

    const completed = recordEndingCompletion(run, meta)
    const completedAgain = recordEndingCompletion(completed.run, completed.meta)

    expect(completed.run.phase).toBe('evaluation')
    expect(completed.run.completedEndingIds).toHaveLength(1)
    expect(completed.meta.completedEndings).toHaveLength(1)
    expect(completedAgain.meta.completedEndings).toHaveLength(1)
  })
})
