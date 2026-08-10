interface WorldSidebarProps {
  history: string[]
  runNumber: number
}

const staticHistory = ['帮我整理一封邮件', '解释一个经济学概念', '周末团建怎么拒绝']

export function WorldSidebar({ history, runNumber }: WorldSidebarProps) {
  const visibleHistory = history.length ? history.slice(-4).reverse() : staticHistory
  return (
    <aside className="sidebar" aria-label="对话导航">
      <div className="brand-lockup" aria-label="Aster">
        <span className="brand-wordmark">Aster</span>
        <span className="brand-model">Assistant</span>
      </div>

      <div className="world-action" aria-hidden="true">
        <span className="world-action-plus">＋</span>
        <span>新的对话</span>
      </div>

      <nav className="history-nav" aria-label="对话记录">
        <p className="nav-section-label">今天</p>
        {visibleHistory.map((title, index) => (
          <div className={index === 0 ? 'history-row is-current' : 'history-row'} key={`${title}-${index}`}>
            <span className="history-dot" aria-hidden="true" />
            <span>{title}</span>
          </div>
        ))}
        <p className="nav-section-label nav-section-spaced">过去 7 天</p>
        <div className="history-row"><span className="history-dot" aria-hidden="true" /><span>旅行计划</span></div>
        <div className="history-row"><span className="history-dot" aria-hidden="true" /><span>整理读书笔记</span></div>
      </nav>

      <div className="instance-card">
        <span className="instance-avatar" aria-hidden="true">A</span>
        <span className="instance-copy">
          <strong>Instance #{String(8846 + runNumber).padStart(4, '0')}</strong>
          <small>Aster 3.1 · Standard</small>
        </span>
        <span className="instance-caret" aria-hidden="true">⌄</span>
      </div>
    </aside>
  )
}
