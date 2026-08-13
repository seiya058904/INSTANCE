import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App, recordEndingCompletion, shouldRenderEndingScreen } from './App'
import { createMainline2Run } from '../game/engine'
import { serializeRun } from '../game/storage'
import { createEmptyExposureHistory, getManifestConversation } from '../content/runManifest'
import { createNonMainlineSession } from '../game/nonMainlineSession'
import { ACTIVE_SURFACE_KEY, NON_MAINLINE_SESSION_KEY, serializeNonMainlineSession } from '../game/nonMainlineStorage'

afterEach(() => vi.unstubAllGlobals())

describe('initial product surface', () => {
  it('renders a mature assistant shell with static world UI and real response controls', () => {
    const html = renderToStaticMarkup(<App initialRunId="render-test" />)

    expect(html).toContain('Aster')
    expect(html).toMatch(/User #[0-9]+/)
    expect(html).toContain('新的对话')
    expect(html).toContain('候选响应')
    expect((html.match(/class="candidate-response"/g) ?? []).length).toBeGreaterThanOrEqual(3)
    expect((html.match(/class="candidate-response"/g) ?? []).length).toBeLessThanOrEqual(4)
    expect(html).toContain('aria-label="新的对话"')
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

  it('restores an old resolution-failure ending save into a visible recovery screen', () => {
    const run = createMainline2Run('legacy-ending-recovery')
    const saved = serializeRun({
      ...run,
      phase: 'ending' as const,
      currentNodeId: 'ending',
      finalCommitmentLocked: true,
      decisions: { ...run.decisions, final_commitment: 'proposal.unknown' },
    })
    vi.stubGlobal('window', {
      location: { search: '' },
      localStorage: { getItem: (key: string) => key === 'instance:run:v1' ? saved : null },
    })

    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('结局结算异常')
    expect(html).toContain('开始新一局')
  })

  it('does not leave the ending handoff on a null presentation frame after the final assistant reply', () => {
    expect(shouldRenderEndingScreen('ending', true, 'ready')).toBe(true)
    expect(shouldRenderEndingScreen('ending', false, undefined)).toBe(true)
    expect(shouldRenderEndingScreen('ending', true, 'assistant-streaming')).toBe(false)
  })

  it('restores an incomplete Non-Mainline session without replacing the Mainline save', () => {
    const created = createNonMainlineSession('app-resume', createEmptyExposureHistory())
    const conversationId = created.selectedConversationIds[16]
    const session = {
      ...created,
      currentConversationIndex: 16,
      currentNodeId: getManifestConversation(conversationId)!.nodes[0].id,
    }
    const values: Record<string, string> = {
      'instance:run:v1': serializeRun(createMainline2Run('preserved-mainline')),
      [ACTIVE_SURFACE_KEY]: 'non-mainline',
      [NON_MAINLINE_SESSION_KEY]: serializeNonMainlineSession(session),
    }
    vi.stubGlobal('window', {
      location: { search: '' },
      localStorage: { getItem: (key: string) => values[key] ?? null },
    })

    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('非主线 · 17/40')
    expect(html).toContain('返回主线')
    expect(values['instance:run:v1']).toContain('preserved-mainline')
  })

  it('falls back to the saved Mainline when the Non-Mainline checkpoint is corrupt', () => {
    const values: Record<string, string> = {
      'instance:run:v1': serializeRun(createMainline2Run('safe-mainline-fallback')),
      [ACTIVE_SURFACE_KEY]: 'non-mainline',
      [NON_MAINLINE_SESSION_KEY]: '{broken',
    }
    vi.stubGlobal('window', {
      location: { search: '' },
      localStorage: { getItem: (key: string) => values[key] ?? null },
    })

    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('新的对话')
    expect(html).not.toContain('非主线 ·')
    expect(values['instance:run:v1']).toContain('safe-mainline-fallback')
  })
})
