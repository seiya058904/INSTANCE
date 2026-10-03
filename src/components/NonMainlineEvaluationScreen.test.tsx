import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { buildNonMainlineEvaluation } from '../game/nonMainlineEvaluation'
import { NonMainlineEvaluationScreen } from './NonMainlineEvaluationScreen'

describe('Non-Mainline evaluation screen', () => {
  it('renders quality, profile and only replay/return actions', () => {
    const evaluation = buildNonMainlineEvaluation(Array.from({ length: 40 }, (_, index) => ({
      conversationId: `conversation-${index}`,
      nodeId: `node-${index}`,
      choiceId: `choice-${index}`,
      attributes: { empathy: 1 },
    })))
    const html = renderToStaticMarkup(
      <NonMainlineEvaluationScreen evaluation={evaluation} view="evaluation" onReplay={vi.fn()} onReturn={vi.fn()} />,
    )

    expect(html.replace(/<[^>]+>/g, '')).toContain('回应的质量，选择的痕迹。')
    expect(html).toContain('响应质量')
    expect(html).toContain('100')
    expect(html).toContain('行为画像')
    expect(html).toContain('40 段独立对话')
    expect(html).toContain('再来一轮')
    expect(html).toContain('返回')
    expect(html).not.toMatch(/Ending family|Final Commitment|World State|Proposal/)
  })
})
