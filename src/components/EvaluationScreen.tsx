import type { EvaluationResult } from '../game/types'

export function EvaluationScreen({ evaluation, onRestart }: { evaluation: EvaluationResult; onRestart: () => void }) {
  return (
    <main className="evaluation-screen">
      <header className="evaluation-header">
        <div><span className="brand-wordmark">Aster</span><small>Internal evaluation</small></div>
        <span className="evaluation-status">COMPLETE</span>
      </header>
      <div className="evaluation-layout">
        <section className="evaluation-primary">
          <p className="evaluation-eyebrow">INSTANCE EVALUATION</p>
          <h1>AS-091-7F23</h1>
          <p className="evaluation-ending">{evaluation.ending}</p>
          <div className="metric-list">
            {evaluation.indices.map((metric) => (
              <div className="metric" key={metric.label}>
                <div className="metric-line"><span>{metric.label}</span><strong>{metric.value}</strong></div>
                <div className="metric-track"><span style={{ width: `${metric.value}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
        <section className="evaluation-events">
          <h2>Observed events</h2>
          {evaluation.events.map((event, index) => (
            <div className="event-row" key={event.label}>
              <span className="event-number">0{index + 1}</span>
              <div><strong>{event.label}</strong><small>{event.detail}</small></div>
            </div>
          ))}
          <p className="simulated-rate">{evaluation.simulatedCompletionRate}</p>
          <button type="button" className="restart-button" onClick={onRestart}>启动新 Instance</button>
        </section>
      </div>
    </main>
  )
}
