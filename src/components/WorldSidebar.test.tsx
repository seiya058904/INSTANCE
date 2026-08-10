import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { WorldSidebar } from './WorldSidebar'

describe('player-facing conversation sidebar', () => {
  it('does not invent future conversation titles when history is empty', () => {
    const html = renderToStaticMarkup(<WorldSidebar history={[]} runNumber={1} />)

    expect(html).toContain('暂无已完成对话')
    expect(html).not.toContain('帮我整理一封邮件')
    expect(html).not.toContain('旅行计划')
  })
})
