import type { LongformArtifactType, LongformPreview } from '../game/types'

const artifactLabels: Record<LongformArtifactType, string> = {
  essay: 'Essay',
  report: 'Report',
  solution: 'Solution',
  story: 'Story',
  code: 'Code',
  speech: 'Speech',
  translation: 'Translation',
  memo: 'Memo',
}

export function LongformPreviewCard({ preview }: { preview: LongformPreview }) {
  return (
    <details className="longform-preview-card">
      <summary>
        <span className="longform-summary-main">
          <span className="longform-summary-label">长回复</span>
          <span className="longform-summary-meta">{artifactLabels[preview.artifactType]} · {preview.estimatedLength}</span>
        </span>
        <span className="longform-summary-state">已折叠</span>
      </summary>
      <div className="longform-preview-body">
        {preview.title && <h3>{preview.title}</h3>}
        <p className="longform-preview-text">{preview.preview}</p>
        {preview.structure?.length ? (
          <section className="longform-preview-section">
            <h4>结构</h4>
            <ul>{preview.structure.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ) : null}
        {preview.highlights?.length ? (
          <section className="longform-preview-section">
            <h4>主要内容</h4>
            <ul>{preview.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ) : null}
        {preview.closingPreview && (
          <section className="longform-preview-section">
            <h4>结尾</h4>
            <p>{preview.closingPreview}</p>
          </section>
        )}
      </div>
    </details>
  )
}
