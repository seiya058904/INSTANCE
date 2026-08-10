import { describe, expect, it } from 'vitest'
import { createScrollScheduler } from './scrollBehavior'

describe('conversation scroll behavior', () => {
  it('scrolls to the current bottom after content grows instead of dropping the first frame', () => {
    let frame: (() => void) | undefined
    const element = { scrollTop: 0, scrollHeight: 1642 }
    const scheduler = createScrollScheduler({
      requestFrame: (callback) => {
        frame = callback
        return 1
      },
      getElement: () => element,
    })

    scheduler.schedule()
    frame?.()

    expect(element.scrollTop).toBe(element.scrollHeight)
  })

  it('coalesces repeated requests into one frame while keeping the latest height', () => {
    let frame: (() => void) | undefined
    let requests = 0
    const element = { scrollTop: 0, scrollHeight: 900 }
    const scheduler = createScrollScheduler({
      requestFrame: (callback) => {
        requests += 1
        frame = callback
        return requests
      },
      getElement: () => element,
    })

    scheduler.schedule()
    scheduler.schedule()
    element.scrollHeight = 1200
    frame?.()

    expect(requests).toBe(1)
    expect(element.scrollTop).toBe(1200)
  })
})
