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
  return {
    schedule() {
      if (frame !== null) return
      frame = requestFrame(() => {
        frame = null
        const element = getElement()
        if (element) element.scrollTop = element.scrollHeight
      })
    },
  }
}
