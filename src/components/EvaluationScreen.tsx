import type { EvaluationResult } from '../game/types'
import { BehaviorMetrics, CloseoutFrame, NewRunButton } from './CloseoutFrame'

export function EvaluationScreen({ evaluation, onRestart, onReturn, instanceNumber }: { evaluation: EvaluationResult; onRestart: () => void; onReturn?: () => void; instanceNumber?: number }) {
  return <CloseoutFrame title="这一局，你如何回应。" mode="主线" identity={instanceNumber ? `#${String(8846 + instanceNumber).padStart(4, '0')}` : undefined} view="evaluation" onEnding={onReturn}>
    <p className="closeout-declaration evaluation-ending">{evaluation.ending}</p>
    <section className="closeout-section"><h2>行为倾向</h2><p className="closeout-section-intro">指标比较你在本局有差异的候选中如何选择。50 表示居中，数值越高，越偏向该行为；它不代表能力或道德评分。相同表达和单向推进不计入，局长不会抬高指标。</p><BehaviorMetrics indices={evaluation.indices} /></section>
    <section className="closeout-section evaluation-events"><h2>选择留下的证据</h2><div className="closeout-observations">{evaluation.events.map((event, index) => <article key={`${event.label}:${index}`}><h3>{event.label}</h3><p>{event.detail}</p></article>)}</div><p className="closeout-sealed">{evaluation.simulatedCompletionRate}</p></section>
    <div className="closeout-actions"><button type="button" className="closeout-primary" onClick={onReturn}>回到结局档案</button><NewRunButton onConfirm={onRestart} label="启动新 Instance" /></div>
  </CloseoutFrame>
}
