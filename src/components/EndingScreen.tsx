import type { EndingResult } from '../game/types'
import { buildEndingArchive } from '../game/endingArchive'
import { CloseoutFrame, NewRunButton } from './CloseoutFrame'
import { UserAvatar } from './UserAvatar'
import { AsterMark } from './AsterMark'
import { personalEpilogueReplies } from '../content/mainline2/endingPlayerFacingCopy'

export function EndingScreen({ ending, onContinue, onNewGame, animate = true, instanceNumber, personalReply, onPersonalReply }: {
  ending: EndingResult; onContinue: () => void; onNewGame: () => void; animate?: boolean; instanceNumber?: number; personalReply?: string; onPersonalReply?: (reply: string) => void
}) {
  const archive = buildEndingArchive(ending)
  return <CloseoutFrame title={archive.title} mode="主线" identity={instanceNumber ? `#${String(8846 + instanceNumber).padStart(4, '0')}` : undefined} view="ending" onEvaluation={onContinue}>
    <div className={`ending-opening${animate ? ' is-arriving' : ''}`}>
      <div className="closeout-identity"><span>{archive.family}</span><span>Aster · {archive.hybridLabel}</span><span>最终结局</span></div>
      <p className="closeout-declaration">{archive.consequence}</p>
      <section className="closing-exchange" aria-label="最后一次承诺">
        <div className="closing-human"><small><UserAvatar />人类</small><p>{archive.humanLine}</p></div>
        <div className="closing-assistant"><p>{archive.assistantLine}</p><small>Aster <AsterMark /></small></div>
      </section>
      <p className="closeout-sealed">{archive.status}</p>
    </div>
    <section className="closeout-section ending-resolution"><h2>你留下的世界</h2>
      <dl className="closeout-facts"><div><dt>最终承诺</dt><dd>{archive.commitment ?? archive.title}</dd></div><div><dt>最终角色</dt><dd>{archive.hybridLabel}</dd></div></dl>
      {archive.authority && <p>关键行动的授权来自：{archive.authority}。</p>}
      {archive.preserves.length > 0 && <p>这条路保留了 {archive.preserves.join('、')}{archive.givesUp.length > 0 ? `；同时放弃了 ${archive.givesUp.join('、')}` : ''}。</p>}
    </section>
    {archive.histories.length > 0 && <section className="closeout-section ending-key-history ending-causal-section"><h2>为何走到这里</h2>
      <p className="closeout-section-intro">从最初的关系到最终承诺，这些是你实际作出的选择。</p>
      <ol className="closeout-history">{archive.histories.map((event, index) => <li key={`${event.label}:${index}`}><span className="history-stage">{event.stage}</span><article><h3>{event.label}</h3><p>{event.detail}</p>{event.causalReason && <p className="history-consequence">{event.causalReason}</p>}</article></li>)}</ol>
    </section>}
    {archive.epilogueGroups.length > 0 && <section className="closeout-section ending-character-epilogues"><h2>他们仍在这个世界里</h2><div className="closeout-epilogues">{archive.epilogueGroups.map(group => <article key={group.person}><h3>{group.person}</h3>{group.texts.map((text, index) => <p key={index}>{text}</p>)}</article>)}</div></section>}
    {archive.personal ? <section className="closeout-section personal-epilogue" aria-labelledby="personal-title"><h2 id="personal-title">最后一位用户</h2><p className="closeout-section-intro">世界的结局之后，一段对话仍然是自愿的。</p>
      <div className="personal-conversation"><div className="closing-human"><small><UserAvatar />岑遥 · #1842</small><p>在吗？</p></div>
      {personalReply ? <><div className="closing-assistant"><p>{personalReply}</p><small>Aster <AsterMark /></small></div><div className="closing-human"><p>没什么。<br />就是想看看你还会不会回。</p></div><p className="personal-last-line">Aster 正在输入…</p></> : <div className="personal-choices" role="group" aria-label="回应最后一位用户">{personalEpilogueReplies.map(reply => <button type="button" key={reply} onClick={() => onPersonalReply?.(reply)}>{reply}</button>)}</div>}
      </div>
    </section> : archive.secretOverlay && <section className="closeout-section secret-overlay"><h2>隐藏余波</h2><p>{archive.secretOverlay.copy}</p></section>}
    <div className="closeout-actions"><button className="closeout-primary" type="button" onClick={onContinue}>查看行为评估</button><NewRunButton onConfirm={onNewGame} /></div>
  </CloseoutFrame>
}
