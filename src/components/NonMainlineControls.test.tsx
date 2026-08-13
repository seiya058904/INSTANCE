import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { createEmptyExposureHistory } from '../content/runManifest'
import { createNonMainlineSession } from '../game/nonMainlineSession'
import { NonMainlineControls } from './NonMainlineControls'

describe('Non-Mainline mode controls', () => {
  it('renders the desktop entry without inventing a Mainline mode label', () => {
    const html = renderToStaticMarkup(
      <NonMainlineControls
        variant="desktop"
        activeSurface="mainline"
        open
        session={null}
        onToggle={vi.fn()}
        onEnter={vi.fn()}
        onReturn={vi.fn()}
      />,
    )

    expect(html).toContain('新的对话')
    expect(html).toContain('非主线模式')
    expect(html).toContain('40 个独立对话 · 完成后生成 Instance 评估')
    expect(html).toContain('开始')
    expect(html).not.toMatch(/>主线模式</)
  })

  it('shows resumable N/40 progress and a return action while active', () => {
    const session = {
      ...createNonMainlineSession('resume-control', createEmptyExposureHistory()),
      currentConversationIndex: 16,
    }
    const resumeHtml = renderToStaticMarkup(
      <NonMainlineControls
        variant="mobile"
        activeSurface="mainline"
        open
        session={session}
        onToggle={vi.fn()}
        onEnter={vi.fn()}
        onReturn={vi.fn()}
      />,
    )
    const activeHtml = renderToStaticMarkup(
      <NonMainlineControls
        variant="mobile"
        activeSurface="non-mainline"
        open
        session={session}
        onToggle={vi.fn()}
        onEnter={vi.fn()}
        onReturn={vi.fn()}
      />,
    )

    expect(resumeHtml).toContain('继续 · 17/40')
    expect(activeHtml).toContain('非主线 · 17/40')
    expect(activeHtml).toContain('返回主线')
  })
})
