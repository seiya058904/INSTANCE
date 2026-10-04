import { describe, expect, it } from 'vitest'
import { createScrollScheduler, getStreamingScrollTarget } from './scrollBehavior'

describe('conversation scroll behavior', () => {
  it('positions the first reply with the question and reading space still visible', () => {
    const top = getStreamingScrollTarget({ scrollTop: 0, clientHeight: 800, questionTop: 1000, messageTop: 1300, messageBottom: 1390, initial: true })
    expect(1000 - top).toBe(20)
    expect(1390 - top).toBeLessThan(680)
  })

  it('keeps the end of a long question above the start of the reply', () => {
    const top = getStreamingScrollTarget({ scrollTop: 980, clientHeight: 800, questionTop: 1000, messageTop: 1900, messageBottom: 2000, initial: true })
    expect(1900 - top).toBe(400)
  })

  it('moves only when the growing reply needs space and never moves backwards', () => {
    const geometry = { scrollTop: 1000, clientHeight: 800, questionTop: 1000, messageTop: 1300, initial: false }
    expect(getStreamingScrollTarget({ ...geometry, messageBottom: 1550 })).toBe(1000)
    const advanced = getStreamingScrollTarget({ ...geometry, messageBottom: 1770 })
    expect(1770 - advanced).toBe(680)
    expect(getStreamingScrollTarget({ ...geometry, scrollTop: advanced, messageBottom: 1600 })).toBe(advanced)
  })

  it('uses the requested reading position instead of the absolute bottom', () => {
    let frame: (() => void) | undefined
    const element = { scrollTop: 0, scrollHeight: 1642 }
    const scheduler = createScrollScheduler({
      requestFrame: (callback) => {
        frame = callback
        return 1
      },
      getElement: () => element,
      getTarget: () => 900,
    })

    scheduler.schedule()
    frame?.()

    expect(element.scrollTop).toBe(900)
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
      getTarget: () => element.scrollHeight - 100,
    })

    scheduler.schedule()
    scheduler.schedule()
    element.scrollHeight = 1200
    frame?.()

    expect(requests).toBe(1)
    expect(element.scrollTop).toBe(1100)
  })

  it('does not reclaim scrolling after the reader takes control before a frame', () => {
    let frame: (() => void) | undefined
    const element = { scrollTop: 400, scrollHeight: 1200 }
    let target: number | null = 900
    const scheduler = createScrollScheduler({ requestFrame: callback => { frame = callback; return 1 }, getElement: () => element, getTarget: () => target })
    scheduler.schedule()
    target = null
    frame?.()
    expect(element.scrollTop).toBe(400)
  })

  it('cancels a queued follow without cancelling a later request', () => {
    const frames: Array<() => void> = []
    const element = { scrollTop: 400, scrollHeight: 1200 }
    const scheduler = createScrollScheduler({ requestFrame: callback => frames.push(callback), getElement: () => element, getTarget: () => 900 })
    scheduler.schedule()
    scheduler.cancel()
    scheduler.schedule()
    frames[0]()
    expect(element.scrollTop).toBe(400)
    frames[1]()
    expect(element.scrollTop).toBe(900)
  })
})
