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

  it('highlights the current conversation immediately even before it appears in completed history', () => {
    const html = renderToStaticMarkup(
      <WorldSidebar
        history={[{ participantId: 'user-1', conversationId: 'old-conversation', label: '旧对话' }]}
        runNumber={1}
        currentConversationId="new-conversation"
        currentLabel="新对话"
      />,
    )

    expect(html).toContain('新对话')
    expect(html).toContain('is-current')
  })
})
