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
      <NonMainlineEvaluationScreen evaluation={evaluation} onReplay={vi.fn()} onReturn={vi.fn()} />,
    )

    expect(html).toContain('INSTANCE EVALUATION')
    expect(html).toContain('Response Quality Score')
    expect(html).toContain('100')
    expect(html).toContain('行为画像')
    expect(html).toMatch(/40 \/ 40.*Conversations/)
    expect(html).toContain('再来一轮')
    expect(html).toContain('返回')
    expect(html).not.toMatch(/Ending family|Final Commitment|World State|Proposal/)
  })
})
