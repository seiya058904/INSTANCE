import { useEffect, useRef, useState } from 'react'
import { TypingAudioDirector, type TypingAudioIntent } from './typingAudio'
import { TYPING_AUDIO_SOURCES } from './typingAudioSources'

function usePrefersReducedMotion(): boolean {
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

/**
 * Follows the visible typing/streaming lifecycle with sound.
 *
 * - `null` intent (idle, waiting, handoff, ready…) is always silent.
 * - React re-renders never restart a running sound: the director is created
 *   once and `setIntent` is idempotent while the same intent stays active.
 * - Unmount disposes every track and timer.
 * - Reduced-motion users see text appear instantly, so no typing/generation
 *   sound is played for them either (the visual state stays the source of
 *   truth).
 */
export function useTypingAudio(intent: TypingAudioIntent): void {
  const directorRef = useRef<TypingAudioDirector | null>(null)
  if (directorRef.current === null) {
    directorRef.current = new TypingAudioDirector({
      sources: TYPING_AUDIO_SOURCES,
    })
  }
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const director = directorRef.current
    if (!director) return
    director.setIntent(reducedMotion ? null : intent)
    return () => {
      director.setIntent(null)
    }
  }, [intent, reducedMotion])

  useEffect(() => {
    const director = directorRef.current
    return () => {
      director?.dispose()
      directorRef.current = null
    }
  }, [])
}
