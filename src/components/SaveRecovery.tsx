import { useEffect, useRef } from 'react'

export type SaveStatus = 'saved' | 'saving' | 'failed' | 'conflict' | 'damaged' | 'unavailable'
export function SaveRecovery({ status, onRetry, onLoad, onExport, onImport }: { status: SaveStatus; onRetry: () => void; onLoad: () => void; onExport: () => void; onImport: (file: File) => void }) {
  const heading = useRef<HTMLHeadingElement>(null)
  const blocked = !['saved', 'saving'].includes(status)
  useEffect(() => { if (blocked) heading.current?.focus() }, [blocked, status])
  if (!blocked) return <span className="checkpoint-status" role="status">{status === 'saving' ? '正在保存选择…' : '进度已保存'}</span>
  const conflict = status === 'conflict'
  const damaged = status === 'damaged'
  const unavailable = status === 'unavailable'
  return <div className="save-recovery-backdrop">
    <section className="save-recovery" role="dialog" aria-modal="true" aria-labelledby="save-recovery-title" onKeyDown={event => {
      if (event.key !== 'Tab') return
      const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button, input')]
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }}>
      <h2 id="save-recovery-title" tabIndex={-1} ref={heading}>{conflict ? '另一页已有新进度' : damaged ? '存档需要恢复' : unavailable ? '暂时无法读取存档' : '这次选择尚未保存'}</h2>
      <p>{conflict ? '当前页没有覆盖新存档。你可以先导出当前页的记录，再读取最新进度。' : damaged ? '现有存档未通过校验，原始记录已保留。导出后可保留它供恢复，或重新尝试读取。' : unavailable ? '浏览器暂不允许访问本机存储，当前页没有覆盖既有存档。恢复存储访问后可以重新读取，也可以先导出当前页的记录。' : '浏览器未能安全写入进度。待保存选择仍留在当前页，剧情尚未推进。请保持这一页打开，重试或导出记录。'}</p>
      <div className="recovery-actions">
        {!conflict && !damaged && status !== 'unavailable' && <button type="button" onClick={onRetry}>重试保存</button>}
        <button type="button" onClick={onExport}>导出恢复记录</button>
        <button type="button" onClick={onLoad}>{conflict ? '读取最新进度' : '重新读取存档'}</button>
        <label className="recovery-file">选择恢复记录<input type="file" accept=".json,application/json" onChange={event => { const file = event.target.files?.[0]; if (file) onImport(file); event.target.value = '' }} /></label>
      </div>
      <small>导出记录包含本机对话与选择，请自行保管。</small>
    </section>
  </div>
}
