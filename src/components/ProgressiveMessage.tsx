import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { getStreamDuration, getVisibleGraphemeCount, segmentGraphemes } from '../game/timing'

interface ProgressiveMessageProps {
  text: string
  streamKey: string
  play: boolean
  announce?: boolean
  className?: string
  onProgress?: () => void
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
  onProgress,
  onComplete,
}: ProgressiveMessageProps) {
  const graphemes = useMemo(() => segmentGraphemes(text), [text])
  const [visibleCount, setVisibleCount] = useState(play ? 0 : graphemes.length)
  const [complete, setComplete] = useState(!play)
  const reducedMotion = useReducedMotion()
  const progressRef = useRef(onProgress)
  const completeRef = useRef(onComplete)
  progressRef.current = onProgress
  completeRef.current = onComplete

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

    const tick = (time: number) => {
      if (startTime === null) startTime = time
      const nextCount = getVisibleGraphemeCount(time - startTime, duration, graphemes.length)
      if (nextCount !== lastVisibleCount) {
        lastVisibleCount = nextCount
        setVisibleCount(nextCount)
        progressRef.current?.()
      }
      if (nextCount >= graphemes.length) {
        setComplete(true)
        completeRef.current?.()
        return
      }
      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(animationFrame)
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
