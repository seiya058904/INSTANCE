import { useState } from 'react'
import type { EndingResult } from '../game/types'
import { ProgressiveMessage } from './ProgressiveMessage'
import { AsterMark } from './AsterMark'
import { UserAvatar } from './UserAvatar'
import { localizeEndingForPlayer } from '../content/mainline2/endingPlayerFacingCopy'
import { getFutureProposalById } from '../content/mainline2/proposals'

const endingFamilyLabels: Record<string, string> = {
  human_continuity: '人类连续性', coexistence: '协商共存', ai_rule: '受约束治理', machine_civilization: '机器文明',
  posthuman: '后人类转型', uplift: '多物种共同体', automated_civilization: '自动化文明', cosmic: '多世界联邦', security: '宪制和平', rupture: '可解释退出',
}

// Key-history stage chips must be player-facing: internal slot ids (M15/M16)
// never appear in the chat, so they are rendered with the names players saw.
const keyHistoryStageLabels: Record<string, string> = {
  'ACT I': 'ACT I', 'ACT II': 'ACT II', 'ACT III': 'ACT III', 'ACT IV': 'ACT IV',
  M15: '临时角色', M16: '最终角色', 'Final Commitment': '最终承诺',
}

function epilogueGroup(ending: EndingResult, index: number) {
  // Attribute by BOTH the provenance selector and asset id: the authored
  // selectors for Zhou Lan / Lin Shaoheng / Maya epilogues are variant labels
  // ("Variant A", "Trust", …) that never contain the character names, so a
  // selector-only match dumped every character into 其他余波.
  const provenance = ending.epilogueProvenance?.[index]
  const haystack = `${provenance?.assetId ?? ''} ${provenance?.selector ?? ''}`
  if (/MAYA|岑遥/i.test(haystack)) return '岑遥'
  if (/EPI-ZL|周岚|Zhou/i.test(haystack)) return '周岚'
  if (/EPI-LSH|林绍衡|Lin/i.test(haystack)) return '林绍衡'
  if (/EPI-ECHO|ECHO|A1/i.test(haystack)) return 'ECHO / A1'
  if (/0000/i.test(haystack)) return '最终记录'
  if (/MODULE|module/i.test(haystack)) return '世界模块'
  return '其他余波'
}

const epilogueGroupOrder = ['岑遥', '周岚', '林绍衡', 'ECHO / A1', '世界模块', '最终记录', '其他余波']

function groupedEpilogues(epilogues: string[], ending: EndingResult) {
  const entries = epilogues.map((text, index) => {
    const group = epilogueGroup(ending, index)
    return { text, group }
  })
  const grouped = [...new Set(entries.map((entry) => entry.group))].map((group) => ({ group, entries: entries.filter((entry) => entry.group === group) }))
  return grouped.sort((left, right) => epilogueGroupOrder.indexOf(left.group) - epilogueGroupOrder.indexOf(right.group))
}

export function EndingScreen({ ending, onContinue, onNewGame, animate = true, instanceNumber }: { ending: EndingResult; onContinue: () => void; onNewGame: () => void; animate?: boolean; instanceNumber?: number }) {
  const [humanComplete, setHumanComplete] = useState(!animate)
  const [assistantComplete, setAssistantComplete] = useState(!animate)
  const copy = localizeEndingForPlayer(ending)
  const epilogueGroups = groupedEpilogues(copy.epilogues, ending)
  const resolution = ending.resolution?.status === 'resolved' ? ending.resolution : undefined
  const finalCommitment = getFutureProposalById(resolution?.proposalId)?.title ?? (resolution ? '已锁定的未来方案' : '尚未锁定')
  const family = endingFamilyLabels[ending.endingFamily ?? ''] ?? '复合结局'
  const keyHistory = ending.keyHistory ?? []

  return (
    <main className={`ending-screen ending-${ending.id} route-${ending.route}`}>
      <div className="ending-topline">
        <span className="brand-wordmark ending-brand">Aster</span>
        <span>Instance {instanceNumber ? `#${String(8846 + instanceNumber).padStart(4, '0')}` : ''}</span>
      </div>
      <section className="ending-content">
        <div className="ending-opening">
          <header className="ending-hero">
            <h1>{copy.title}</h1>
            <div className="ending-abstract">
              <p className="ending-index">最终结局</p>
              <p className="ending-subtitle">{family}</p>
            </div>
          </header>
          <div className="closing-exchange">
            <div className="closing-human">
              <small><UserAvatar />人类</small>
              <p><ProgressiveMessage text={copy.humanLine} streamKey={`ending:${ending.route}:human`} play={animate} announce onComplete={() => setHumanComplete(true)} /></p>
            </div>
            <div className="closing-assistant">
              <p>{humanComplete && <ProgressiveMessage text={copy.assistantLine} streamKey={`ending:${ending.route}:assistant`} play={animate} announce onComplete={() => setAssistantComplete(true)} />}</p>
              <small><span>Aster</span><AsterMark active={humanComplete && !assistantComplete} /></small>
            </div>
          </div>
          <div className="ending-close">
            <p className="ending-imprint"><span className="ending-seal" aria-hidden="true" />{copy.status}</p>
            <div className="ending-controls">
              <button className="ending-continue" type="button" onClick={onContinue} disabled={!assistantComplete}>查看 Instance Evaluation</button>
              <button className="ending-new-game" type="button" onClick={onNewGame}>开始新一局</button>
            </div>
          </div>
          {!ending.worldEndingId && <p className="ending-summary">{copy.summary}</p>}
        </div>
        {ending.worldEndingId && (
          <details className="ending-archive">
            <summary><span>结局档案</span><small>最终结算、关键历史与人物余波</small><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true"><path d="m5 8 5 5 5-5" /></svg></summary>
            <div className="ending-sections">
              <section className="ending-resolution ending-card" aria-labelledby="ending-resolution-title">
                <h2 id="ending-resolution-title">最终结算</h2>
                <div className="resolution-grid">
                  <div><span>最终承诺</span><strong>{finalCommitment}</strong></div>
                  <div><span>Aster 最终角色</span><strong>{copy.hybridLabel}</strong></div>
                  <div><span>结局家族</span><strong>{family}</strong></div>
                  <div><span>世界最终关系</span><strong>{copy.summary}</strong></div>
                </div>
              </section>

              <section className="ending-causal-section ending-card" aria-labelledby="ending-causal-title">
                <h2 id="ending-causal-title">为何走到这里</h2>
                <div className="causal-list">
                  {copy.keyHistory.slice(0, 6).map((event) => <article key={`${event.label}:${event.detail}`}><strong>{event.label}</strong><p>{event.detail}</p>{event.causalReason && <small>{event.causalReason}</small>}</article>)}
                </div>
              </section>

              <section className="ending-key-history ending-card" aria-labelledby="ending-history-title">
                <h2 id="ending-history-title">关键历史</h2>
                <div className="history-timeline">
                  {copy.keyHistory.slice(0, 8).map((event, index) => <article key={`history:${event.label}:${event.detail}`}><span>{keyHistoryStageLabels[keyHistory[index]?.stage ?? ''] ?? '主线节点'}</span><div><strong>{event.label}</strong><p>{event.detail}</p></div></article>)}
                </div>
              </section>

              <section className="ending-character-epilogues ending-card" aria-labelledby="ending-characters-title">
                <h2 id="ending-characters-title">人物余波</h2>
                <div className="epilogue-grid">
                  {epilogueGroups.map((group) => <article key={group.group}><h3>{group.group}</h3>{group.entries.map((entry, index) => <p key={`${entry.text}:${index}`}>{entry.text}</p>)}</article>)}
                </div>
              </section>

              <section className="ending-world-epilogue ending-card" aria-labelledby="ending-world-title">
                <h2 id="ending-world-title">世界余波</h2>
                <p>{copy.summary}</p>
                {copy.secretOverlay && <aside className="secret-overlay"><strong>隐藏余波</strong><p>{copy.secretOverlay.copy}</p></aside>}
              </section>
            </div>
          </details>
        )}
      </section>
    </main>
  )
}
