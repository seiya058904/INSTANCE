import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ProgressiveMessage } from './ProgressiveMessage'

describe('ProgressiveMessage accessibility contract', () => {
  it('keeps visual text hidden from assistive technology and announces one complete message', () => {
    const html = renderToStaticMarkup(
      <ProgressiveMessage
        text="完整消息只应该被辅助技术接收一次。"
        streamKey="a11y-message"
        play={false}
        announce
      />,
    )

    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('class="progressive-visible"')
    expect(html).toContain('aria-label="完整消息只应该被辅助技术接收一次。"')
    expect(html).toContain('完整消息只应该被辅助技术接收一次。')
  })
})
