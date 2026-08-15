import { describe, expect, it } from 'vitest'
import { clearRunForRecovery } from './RootErrorBoundary'

describe('RootErrorBoundary recovery', () => {
  it('clears only the current run checkpoints before restarting', () => {
    const values = new Map([
      ['instance:run:v1', 'bad-mainline'],
      ['instance:non-mainline-session:v1', 'bad-non-mainline'],
      ['instance:active-surface:v1', 'non-mainline'],
      ['instance:meta:v1', 'keep-meta'],
    ])

    clearRunForRecovery({
      removeItem: (key) => values.delete(key),
      setItem: (key, value) => values.set(key, value),
    })

    expect(values.has('instance:run:v1')).toBe(false)
    expect(values.has('instance:non-mainline-session:v1')).toBe(false)
    expect(values.get('instance:active-surface:v1')).toBe('mainline')
    expect(values.get('instance:meta:v1')).toBe('keep-meta')
  })
})
