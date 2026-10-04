import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { getStreamDuration, getVisibleGraphemeCount, segmentGraphemes } from '../game/timing'

interface ProgressiveMessageProps {
  text: string
  streamKey: string
  play: boolean
  announce?: boolean
  className?: string
  onStreamingChange?: (key: string, active: boolean) => void
  onComplete?: () => void
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

export const ProgressiveMessage = memo(function ProgressiveMessage({
  text,
  streamKey,
  play,
  announce = false,
  className,
  onStreamingChange,
  onComplete,
}: ProgressiveMessageProps) {
  const graphemes = useMemo(() => segmentGraphemes(text), [text])
  const [visibleCount, setVisibleCount] = useState(play ? 0 : graphemes.length)
  const [complete, setComplete] = useState(!play)
  const reducedMotion = useReducedMotion()
  const streamingRef = useRef(onStreamingChange)
  const completeRef = useRef(onComplete)
  streamingRef.current = onStreamingChange
  completeRef.current = onComplete

  const streaming = play && !reducedMotion && !complete && visibleCount > 0
  useLayoutEffect(() => {
    streamingRef.current?.(streamKey, streaming)
    return () => streamingRef.current?.(streamKey, false)
  }, [streamKey, streaming])

  useEffect(() => {
    if (!play || reducedMotion || graphemes.length === 0) {
      setVisibleCount(graphemes.length)
      setComplete(true)
      completeRef.current?.()
      return
    }

    setVisibleCount(0)
    setComplete(false)
    const duration = getStreamDuration(text, streamKey)
    let animationFrame = 0
    let startTime: number | null = null
    let lastVisibleCount = -1
    let finished = false
    // Reliability-first: requestAnimationFrame can be throttled or suspended
    // (occluded tab, system pressure), which would otherwise freeze the text
    // mid-stream and leave gated screens stuck. The full text is already
    // persisted, so a watchdog simply reveals it when the animation stalls.
    const finish = () => {
      if (finished) return
      finished = true
      setVisibleCount(graphemes.length)
      setComplete(true)
      completeRef.current?.()
    }
    const watchdog = window.setTimeout(finish, duration + 5000)

    const tick = (time: number) => {
      if (startTime === null) startTime = time
      const nextCount = getVisibleGraphemeCount(time - startTime, duration, graphemes.length)
      if (nextCount !== lastVisibleCount) {
        lastVisibleCount = nextCount
        setVisibleCount(nextCount)
      }
      if (nextCount >= graphemes.length) {
        finish()
        return
      }
      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(watchdog)
    }
  }, [graphemes, play, reducedMotion, streamKey, text])

  const visibleText = complete ? text : graphemes.slice(0, visibleCount).join('')

  return (
    <span className={className}>
      <span className="progressive-visible" aria-hidden="true">
        {visibleText}
        {!complete && <span className="stream-caret" />}
      </span>
      <span
        className="sr-only progressive-announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={announce && complete ? text : undefined}
      />
    </span>
  )
})
