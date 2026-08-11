import { useState } from 'react'
import type { EndingResult } from '../game/types'
import { ProgressiveMessage } from './ProgressiveMessage'
import { localizeEndingForPlayer } from '../content/mainline2/endingPlayerFacingCopy'

const endingFamilyLabels: Record<string, string> = {
  human_continuity: '人类连续性', coexistence: '协商共存', ai_rule: '受约束治理', machine_civilization: '机器文明',
  posthuman: '后人类转型', uplift: '多物种共同体', automated_civilization: '自动化文明', cosmic: '多世界联邦', security: '宪制和平', rupture: '可解释退出',
}

const proposalLabels: Record<string, string> = {
  'proposal.hc.final_human_veto': '保留最终人工否决',
  'proposal.co.two_key_civilization': '双钥匙文明契约',
  'proposal.ar.civilization_trusteeship': '文明托管协议',
  'proposal.rupture.legible_exit': '可解释的退出',
}

function epilogueGroup(selector: string) {
  if (/MAYA|岑遥|Maya/i.test(selector)) return '岑遥'
  if (/ZL|周岚|Zhou/i.test(selector)) return '周岚'
  if (/LSH|林绍衡|Lin/i.test(selector)) return '林绍衡'
  if (/ECHO|A1/i.test(selector)) return 'ECHO / A1'
  if (/0000/i.test(selector)) return '#0000'
  if (/MODULE|module/i.test(selector)) return '世界模块'
  return '其他余波'
}

function groupedEpilogues(epilogues: string[], ending: EndingResult) {
  const entries = epilogues.map((text, index) => {
    const group = epilogueGroup(ending.epilogueProvenance?.[index]?.selector ?? ending.epilogueProvenance?.[index]?.assetId ?? '')
    return { text, group }
  })
  return [...new Set(entries.map((entry) => entry.group))].map((group) => ({ group, entries: entries.filter((entry) => entry.group === group) }))
}

export function EndingScreen({ ending, onContinue, onNewGame, animate = true }: { ending: EndingResult; onContinue: () => void; onNewGame: () => void; animate?: boolean }) {
  const [humanComplete, setHumanComplete] = useState(!animate)
  const [assistantComplete, setAssistantComplete] = useState(!animate)
  const copy = localizeEndingForPlayer(ending)
  const epilogueGroups = groupedEpilogues(copy.epilogues, ending)
  const resolution = ending.resolution?.status === 'resolved' ? ending.resolution : undefined
  const finalCommitment = proposalLabels[resolution?.proposalId ?? ''] ?? (resolution ? '已锁定的未来方案' : '尚未锁定')
  const family = endingFamilyLabels[ending.endingFamily ?? ''] ?? '复合结局'
  const keyHistory = ending.keyHistory ?? []

  return (
    <main className={`ending-screen ending-${ending.id} route-${ending.route}`}>
      <div className="ending-topline">
        <span className="brand-wordmark ending-brand">Aster</span>
        <span>Instance AS-091-7F23</span>
      </div>
      <div className="ending-orbit" aria-hidden="true"><span /><span /><span /></div>
      <section className="ending-content">
        <header className="ending-hero">
          <p className="ending-index">最终结局</p>
          <h1>{copy.title}</h1>
          <p className="ending-subtitle">{family} · 你的选择留下了可被复核的后果</p>
          <p className="ending-summary">{copy.summary}</p>
        </header>
        <div className="closing-exchange">
          <div>
            <small>人类</small>
            <p><ProgressiveMessage text={copy.humanLine} streamKey={`ending:${ending.route}:human`} play={animate} announce onComplete={() => setHumanComplete(true)} /></p>
          </div>
          <div className="closing-assistant">
            <small>Aster</small>
            <p>{humanComplete && <ProgressiveMessage text={copy.assistantLine} streamKey={`ending:${ending.route}:assistant`} play={animate} announce onComplete={() => setAssistantComplete(true)} />}</p>
          </div>
        </div>
        {ending.worldEndingId && (
          <div className="ending-sections">
            <section className="ending-resolution ending-card" aria-labelledby="ending-resolution-title">
              <p className="section-kicker">最终结算</p>
              <h2 id="ending-resolution-title">最终结算</h2>
              <div className="resolution-grid">
                <div><span>最终承诺</span><strong>{finalCommitment}</strong></div>
                <div><span>Aster 最终角色</span><strong>{copy.hybridLabel}</strong></div>
                <div><span>结局家族</span><strong>{family}</strong></div>
                <div><span>世界最终关系</span><strong>{copy.summary}</strong></div>
              </div>
            </section>

            <section className="ending-causal-section ending-card" aria-labelledby="ending-causal-title">
              <p className="section-kicker">因果路径</p>
              <h2 id="ending-causal-title">为何走到这里</h2>
              <div className="causal-list">
                {copy.keyHistory.slice(0, 6).map((event) => <article key={`${event.label}:${event.detail}`}><strong>{event.label}</strong><p>{event.detail}</p>{event.causalReason && <small>{event.causalReason}</small>}</article>)}
              </div>
            </section>

            <section className="ending-key-history ending-card" aria-labelledby="ending-history-title">
              <p className="section-kicker">关键时间线</p>
              <h2 id="ending-history-title">关键历史</h2>
              <div className="history-timeline">
                {copy.keyHistory.slice(0, 8).map((event, index) => <article key={`history:${event.label}:${event.detail}`}><span>{keyHistory[index]?.stage ?? '主线节点'}</span><div><strong>{event.label}</strong><p>{event.detail}</p></div></article>)}
              </div>
            </section>

            <section className="ending-character-epilogues ending-card" aria-labelledby="ending-characters-title">
              <p className="section-kicker">人物余波</p>
              <h2 id="ending-characters-title">人物余波</h2>
              <div className="epilogue-grid">
                {epilogueGroups.map((group) => <article key={group.group}><h3>{group.group}</h3>{group.entries.map((entry, index) => <p key={`${entry.text}:${index}`}>{entry.text}</p>)}</article>)}
              </div>
            </section>

            <section className="ending-world-epilogue ending-card" aria-labelledby="ending-world-title">
              <p className="section-kicker">世界余波</p>
              <h2 id="ending-world-title">世界余波</h2>
              <p>{copy.summary}</p>
              {copy.secretOverlay && <aside className="secret-overlay"><span>隐藏余波</span><strong>隐藏余波</strong><p>{copy.secretOverlay.copy}</p></aside>}
            </section>
          </div>
        )}
        <div className="ending-controls">
          <button className="ending-continue" type="button" onClick={onContinue} disabled={!assistantComplete}>查看 Instance Evaluation</button>
          <button className="ending-new-game" type="button" onClick={onNewGame}>开始新一局</button>
        </div>
      </section>
      <p className="ending-status"><span />{copy.status}</p>
    </main>
  )
}
