import type { NonMainlineEvaluationResult } from '../game/nonMainlineEvaluation'

interface NonMainlineEvaluationScreenProps {
  evaluation: NonMainlineEvaluationResult
  onReplay: () => void
  onReturn: () => void
}

export function NonMainlineEvaluationScreen({
  evaluation,
  onReplay,
  onReturn,
}: NonMainlineEvaluationScreenProps) {
  return (
    <main className="non-mainline-evaluation">
      <header className="evaluation-header">
        <div><span className="brand-wordmark">Aster</span><small>Non-Mainline evaluation</small></div>
        <span className="evaluation-status">COMPLETE</span>
      </header>
      <div className="non-mainline-evaluation-layout">
        <section className="quality-card">
          <p className="evaluation-eyebrow">INSTANCE EVALUATION</p>
          <span className="quality-label">Response Quality Score</span>
          <div className="quality-result"><strong>{evaluation.qualityScore}</strong><span>/ 100</span></div>
          <p className="quality-grade">{evaluation.grade}</p>
          <div className="quality-track" aria-hidden="true"><span style={{ width: `${evaluation.qualityScore}%` }} /></div>
          <div className="evaluation-summary-row">
            <span><strong>{evaluation.conversationCount} / 40</strong> Conversations</span>
            <span><strong>{evaluation.responseCount}</strong> 实际响应</span>
            <span><strong>{evaluation.issueConversationCount}</strong> 明显失误</span>
          </div>
        </section>

        <section className="profile-card">
          <h2>行为画像</h2>
          <p>你的 Aster 在这一轮更像这样回应用户。</p>
          <div className="profile-list">
            {evaluation.profile.map((item) => (
              <div className="profile-row" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.tendency}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="issue-card">
          <h2>失误分布</h2>
          {evaluation.issueBreakdown.length === 0
            ? <p>本轮没有选择被作者标记为明显失误的响应。</p>
            : evaluation.issueBreakdown.map((item) => (
                <div className="issue-row" key={item.label}>
                  <span>{item.label}</span>
                  <span>{item.count} 次 · 每次 -{item.penalty}</span>
                </div>
              ))}
        </section>

        <div className="non-mainline-evaluation-actions">
          <button type="button" className="restart-button" onClick={onReplay}>再来一轮</button>
          <button type="button" className="secondary-button" onClick={onReturn}>返回</button>
        </div>
      </div>
    </main>
  )
}
