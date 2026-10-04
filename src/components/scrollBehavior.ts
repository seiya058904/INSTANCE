export interface ScrollSchedulerElement {
  scrollTop: number
  scrollHeight: number
}

export interface ScrollSchedulerOptions {
  requestFrame: (callback: () => void) => number
  getElement: () => ScrollSchedulerElement | null
  getTarget: () => number | null
}

/** Keep context above a reply and move only when its live edge needs reading space. */
export function getStreamingScrollTarget({ scrollTop, clientHeight, questionTop, messageTop, messageBottom, initial }: {
  scrollTop: number; clientHeight: number; questionTop: number; messageTop: number; messageBottom: number; initial: boolean
}) {
  const inset = Math.min(120, Math.max(48, clientHeight * .15))
  const start = initial ? Math.max(0, questionTop - 20, messageTop - clientHeight * .5) : scrollTop
  return Math.max(start, messageBottom - clientHeight + inset)
}

export function createScrollScheduler({ requestFrame, getElement, getTarget }: ScrollSchedulerOptions) {
  let frame: number | null = null
  let generation = 0
  return {
    cancel() { generation++; frame = null },
    schedule() {
      if (frame !== null) return
      const scheduledGeneration = generation
      frame = requestFrame(() => {
        if (scheduledGeneration !== generation) return
        frame = null
        const element = getElement()
        const target = getTarget()
        if (element && target !== null) element.scrollTop = target
      })
    },
  }
}
