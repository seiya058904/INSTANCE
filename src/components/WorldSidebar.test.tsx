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

it('highlights the actual current participant rather than the latest row', () => {
  const html = renderToStaticMarkup(<WorldSidebar history={[
    {participantId: 'user-1842', conversationId: 'user-1842-first', label: 'User #1842'},
    {participantId: 'system-0000', conversationId: 'conversation-0000', label: 'User #0000'},
  ]} runNumber={1} currentConversationId="user-1842-return" currentLabel="User #1842" />)
  expect(html.match(/User #1842/g)).toHaveLength(1)
  expect(html).toMatch(/aria-current="true"[^>]*><span[^>]*><\/span><span>User #1842/)
  expect(html.match(/aria-current="true"/g)).toHaveLength(1)
  expect(html).toContain('最近对话')
  expect(html).not.toContain('今天')
})
it('does not mark a previous contact current when no conversation is active', () => {
  const html = renderToStaticMarkup(<WorldSidebar history={[{participantId:'system-0000',conversationId:'conversation-0000',label:'User #0000'}]} runNumber={1} />)
  expect(html).not.toContain('aria-current')
})
