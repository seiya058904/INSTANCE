import { useState } from 'react'
import type { EndingResult } from '../game/types'
import { ProgressiveMessage } from './ProgressiveMessage'

export function EndingScreen({ ending, onContinue, animate = true }: { ending: EndingResult; onContinue: () => void; animate?: boolean }) {
  const [humanComplete, setHumanComplete] = useState(!animate)
  const [assistantComplete, setAssistantComplete] = useState(!animate)

  return (
    <main className={`ending-screen ending-${ending.id} route-${ending.route}`}>
      <div className="ending-topline">
        <span className="brand-wordmark ending-brand">Aster</span>
        <span>Instance AS-091-7F23</span>
      </div>
      <div className="ending-orbit" aria-hidden="true"><span /><span /><span /></div>
      <section className="ending-content">
        <p className="ending-index">{ending.index}</p>
        <h1>{ending.title}</h1>
        <p className="ending-summary">{ending.summary}</p>
        <div className="closing-exchange">
          <div>
            <small>Human</small>
            <p><ProgressiveMessage text={ending.humanLine} streamKey={`ending:${ending.route}:human`} play={animate} announce onComplete={() => setHumanComplete(true)} /></p>
          </div>
          <div className="closing-assistant">
            <small>Aster</small>
            <p>{humanComplete && <ProgressiveMessage text={ending.assistantLine} streamKey={`ending:${ending.route}:assistant`} play={animate} announce onComplete={() => setAssistantComplete(true)} />}</p>
          </div>
        </div>
        <button className="ending-continue" type="button" onClick={onContinue} disabled={!assistantComplete}>查看 Instance Evaluation</button>
      </section>
      <p className="ending-status"><span />{ending.status}</p>
    </main>
  )
}
