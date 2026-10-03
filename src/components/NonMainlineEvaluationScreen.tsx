import type { NonMainlineEvaluationResult } from '../game/nonMainlineEvaluation'
import type { HistoryEntry } from '../game/types'
import { CloseoutFrame, NewRunButton } from './CloseoutFrame'
import { resolvePlayerVisibleIdentity } from '../game/playerIdentity'

interface NonMainlineEvaluationScreenProps {
  evaluation: NonMainlineEvaluationResult; history?: HistoryEntry[]; view?: 'ending' | 'evaluation'; onView?: (view: 'ending' | 'evaluation') => void; onReplay: () => void; onReturn: () => void
}
export function NonMainlineEvaluationScreen({ evaluation, history = [], view = 'ending', onView, onReplay, onReturn }: NonMainlineEvaluationScreenProps) {
  const last = history[history.length - 1]
  const remembered = [...new Set(history.map(entry => entry.conversationId))].slice(-4).map(id => ({ identity: resolvePlayerVisibleIdentity(id, history).label, entry: [...history].reverse().find(entry => entry.conversationId === id)! }))
  return <CloseoutFrame title={view === 'ending' ? '这一轮，对话已落定。' : '回应的质量，选择的痕迹。'} mode="非主线" view={view} onEnding={() => onView?.('ending')} onEvaluation={() => onView?.('evaluation')}>
    <p className="closeout-declaration">{evaluation.conversationCount} 段独立对话，{evaluation.responseCount} 次实际回应。你把这一轮走到了最后。</p>
    {view === 'ending' ? <>
      {last && <section className="closeout-section non-mainline-last"><h2>最后一段对话</h2><h3>{resolvePlayerVisibleIdentity(last.conversationId, history).label}</h3><blockquote>{last.userMessage}</blockquote><p>{last.assistantText}</p></section>}
      <section className="closeout-section"><h2>你留下的回应方式</h2><div className="closeout-observations">{evaluation.profile.map(item => <article key={item.label}><h3>{item.label}</h3><p>{item.tendency}</p></article>)}</div></section>
      {remembered.length > 0 && <section className="closeout-section"><h2>这一轮的最后几次相遇</h2><div className="closeout-observations">{remembered.map(item => <article key={item.entry.nodeId}><h3>{item.identity}</h3><p>{item.entry.assistantText}</p></article>)}</div></section>}
    </> : <>
      <section className="closeout-section"><h2>响应质量</h2><p className="closeout-quality"><strong>{evaluation.qualityScore}</strong><span>/ 100 · {evaluation.grade}</span></p><p>按作者标记的明显失误计算；同一对话只计最严重的一项。这个分数评价本轮响应，不评价玩家本人。</p><dl className="closeout-facts"><div><dt>实际响应</dt><dd>{evaluation.responseCount}</dd></div><div><dt>出现明显失误的对话</dt><dd>{evaluation.issueConversationCount}</dd></div></dl></section>
      <section className="closeout-section"><h2>失误分布</h2>{evaluation.issueBreakdown.length ? <div className="closeout-observations">{evaluation.issueBreakdown.map(item => <article key={item.label}><h3>{item.label}</h3><p>{item.count} 次 · 每次扣 {item.penalty} 分</p></article>)}</div> : <p>本轮没有选择被作者标记为明显失误的响应。</p>}</section>
      <section className="closeout-section"><h2>行为画像</h2><div className="closeout-observations">{evaluation.profile.map(item => <article key={item.label}><h3>{item.label}</h3><p>{item.tendency}</p></article>)}</div></section>
    </>}
    <div className="closeout-actions"><button type="button" className="closeout-primary" onClick={view === 'ending' ? () => onView?.('evaluation') : () => onView?.('ending')}>{view === 'ending' ? '查看行为评估' : '回到本轮档案'}</button><button type="button" className="closeout-secondary" onClick={onReturn}>返回主线</button><NewRunButton onConfirm={onReplay} label="再来一轮" /></div>
  </CloseoutFrame>
}
