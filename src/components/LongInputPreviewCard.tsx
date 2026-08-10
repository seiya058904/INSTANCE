import type { LongInputPreview } from '../game/types'

const kindLabels: Record<LongInputPreview['kind'], string> = {
  'pasted-text': '长文本',
  transcript: '会议转写',
  article: '文章',
  email: '邮件',
  spec: '规格说明',
  'dataset-summary': '数据摘要',
}

export function LongInputPreviewCard({ preview }: { preview: LongInputPreview }) {
  return (
    <details className="long-input-preview-card">
      <summary>
        <span className="longform-summary-main">
          <span className="longform-summary-label">已粘贴{kindLabels[preview.kind]}</span>
          <span className="longform-summary-meta">{preview.estimatedLength}</span>
        </span>
        <span className="longform-summary-state"><span className="longform-state-collapsed">已折叠</span><span className="longform-state-expanded">已展开</span></span>
      </summary>
      <div className="long-input-preview-body">
        {preview.title && <h3>{preview.title}</h3>}
        <p className="longform-preview-text">开头：{preview.preview}</p>
        {preview.structure?.length ? (
          <section className="longform-preview-section">
            <h4>结构</h4>
            <ul>{preview.structure.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ) : null}
      </div>
    </details>
  )
}
