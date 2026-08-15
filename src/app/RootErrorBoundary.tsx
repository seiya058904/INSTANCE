import { Component, type ReactNode } from 'react'

const runKeys = ['instance:run:v1', 'instance:non-mainline-session:v1']

export function clearRunForRecovery(storage: Pick<Storage, 'removeItem' | 'setItem'>) {
  runKeys.forEach((key) => storage.removeItem(key))
  storage.setItem('instance:active-surface:v1', 'mainline')
}

export class RootErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  private restart = () => {
    try {
      clearRunForRecovery(window.localStorage)
    } finally {
      window.location.reload()
    }
  }

  render() {
    if (this.state.failed) {
      return <main className="app-recovery" role="alert">
        <h1>出现了意外问题</h1>
        <p>当前这一局无法继续显示。你可以重新开始，不会清除长期进度。</p>
        <button type="button" onClick={this.restart}>重新开始</button>
      </main>
    }
    return this.props.children
  }
}
