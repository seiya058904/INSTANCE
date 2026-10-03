export interface ScrollSchedulerElement {
  scrollTop: number
  scrollHeight: number
}

export interface ScrollSchedulerOptions {
  requestFrame: (callback: () => void) => number
  getElement: () => ScrollSchedulerElement | null
}

export function createScrollScheduler({ requestFrame, getElement }: ScrollSchedulerOptions) {
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
        if (element) element.scrollTop = element.scrollHeight
      })
    },
  }
}
