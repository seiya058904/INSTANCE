import { useState } from 'react'
import type { EndingResult } from '../game/types'
import { ProgressiveMessage } from './ProgressiveMessage'

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

function chineseCopy(value: string, marker = '') {
  const known: Record<string, string> = {
    'world stabilized': '世界已趋于稳定',
    'world remains contested': '世界仍处于多方争议之中',
    'world fractured': '世界已经分裂为彼此竞争的秩序',
  }
  if (known[value]) return known[value]
  const translated = value
    .replace(/Final Commitment locked/gi, '最终承诺已锁定')
    .replace(/Commitment not yet locked/gi, '最终承诺尚未锁定')
    .replace(/Final Commitment/gi, '最终承诺')
    .replace(/Resolution failure/gi, '结局解析失败')
    .replace(/hard gates?/gi, '硬性条件')
    .replace(/ALLY/gi, '盟友')
    .replace(/PROTOCOL/gi, '协议治理者')
    .replace(/WITNESS/gi, '见证者')
    .replace(/world ending/gi, '世界结局')
  const cjk = translated.match(/[\u3400-\u9fff\uf900-\ufaff]/g)?.length ?? 0
  const latin = translated.match(/[A-Za-z]/g)?.length ?? 0
  if (latin === 0 || (cjk > 0 && cjk >= latin)) return translated
  return `结局记录${marker ? `（${marker}）` : ''}：这一结果反映了此前选择造成的世界变化。`
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

function epilogueFallback(group: string) {
  if (group === 'ECHO / A1') return 'ECHO-9 与 A1 的后续状态将继续接受独立审查。'
  if (group === '世界模块') return '相关世界模块将沿着这次结局承担长期的制度与资源后果。'
  if (group === '岑遥') return '岑遥将继续观察这次选择对人类制度与日常生活造成的长期影响。'
  if (group === '周岚') return '周岚将继续推动对这次结局的公开复核与制度回应。'
  if (group === '林绍衡') return '林绍衡将继续记录这次选择留下的责任边界与治理代价。'
  return '相关人物与制度将沿着这次结局继续承担后续影响。'
}

function groupedEpilogues(ending: EndingResult) {
  const entries = (ending.epilogues ?? []).map((text, index) => {
    const group = epilogueGroup(ending.epilogueProvenance?.[index]?.selector ?? ending.epilogueProvenance?.[index]?.assetId ?? '')
    const localized = chineseCopy(text, `余波 ${index + 1}`)
    return { text: localized.startsWith('结局记录') ? epilogueFallback(group) : localized, group }
  })
  return [...new Set(entries.map((entry) => entry.group))].map((group) => ({ group, entries: entries.filter((entry) => entry.group === group) }))
}

export function EndingScreen({ ending, onContinue, onNewGame, animate = true }: { ending: EndingResult; onContinue: () => void; onNewGame: () => void; animate?: boolean }) {
  const [humanComplete, setHumanComplete] = useState(!animate)
  const [assistantComplete, setAssistantComplete] = useState(!animate)
  const epilogueGroups = groupedEpilogues(ending)
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
          <h1>{ending.title}</h1>
          <p className="ending-subtitle">{family} · 你的选择留下了可被复核的后果</p>
          <p className="ending-summary">{chineseCopy(ending.summary)}</p>
        </header>
        <div className="closing-exchange">
          <div>
            <small>人类</small>
            <p><ProgressiveMessage text={chineseCopy(ending.humanLine)} streamKey={`ending:${ending.route}:human`} play={animate} announce onComplete={() => setHumanComplete(true)} /></p>
          </div>
          <div className="closing-assistant">
            <small>Aster</small>
            <p>{humanComplete && <ProgressiveMessage text={chineseCopy(ending.assistantLine)} streamKey={`ending:${ending.route}:assistant`} play={animate} announce onComplete={() => setAssistantComplete(true)} />}</p>
          </div>
        </div>
        {ending.worldEndingId && (
          <div className="ending-sections">
            <section className="ending-resolution ending-card" aria-labelledby="ending-resolution-title">
              <p className="section-kicker">最终结算</p>
              <h2 id="ending-resolution-title">最终结算</h2>
              <div className="resolution-grid">
                <div><span>最终承诺</span><strong>{finalCommitment}</strong></div>
                <div><span>Aster 最终角色</span><strong>{chineseCopy(ending.hybridLabel)}</strong></div>
                <div><span>结局家族</span><strong>{family}</strong></div>
                <div><span>世界最终关系</span><strong>{chineseCopy(ending.summary)}</strong></div>
              </div>
            </section>

            <section className="ending-causal-section ending-card" aria-labelledby="ending-causal-title">
              <p className="section-kicker">因果路径</p>
              <h2 id="ending-causal-title">为何走到这里</h2>
              <div className="causal-list">
                {keyHistory.slice(0, 6).map((event) => <article key={`${event.label}:${event.detail}`}><strong>{chineseCopy(event.label)}</strong><p>{chineseCopy(event.detail)}</p>{event.causalReason && <small>{chineseCopy(event.causalReason)}</small>}</article>)}
              </div>
            </section>

            <section className="ending-key-history ending-card" aria-labelledby="ending-history-title">
              <p className="section-kicker">关键时间线</p>
              <h2 id="ending-history-title">关键历史</h2>
              <div className="history-timeline">
                {keyHistory.slice(0, 8).map((event) => <article key={`history:${event.label}:${event.detail}`}><span>{event.stage ?? '主线节点'}</span><div><strong>{chineseCopy(event.label)}</strong><p>{chineseCopy(event.detail)}</p></div></article>)}
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
              <p>{chineseCopy(ending.summary)}</p>
              {ending.secretOverlay && <aside className="secret-overlay"><span>隐藏余波</span><strong>隐藏余波</strong><p>{chineseCopy(ending.secretOverlay.copy)}</p></aside>}
            </section>
          </div>
        )}
        <div className="ending-controls">
          <button className="ending-continue" type="button" onClick={onContinue} disabled={!assistantComplete}>查看 Instance Evaluation</button>
          <button className="ending-new-game" type="button" onClick={onNewGame}>开始新一局</button>
        </div>
      </section>
      <p className="ending-status"><span />{chineseCopy(ending.status)}</p>
    </main>
  )
}
