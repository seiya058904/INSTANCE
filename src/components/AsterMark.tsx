/** An uneven, twelve-ray imprint; motion only belongs to a live response. */
export function AsterMark({ className = 'assistant-mark', active = false }: { className?: string; active?: boolean }) {
  return (
    <svg className={`${className}${active ? ' is-active' : ''}`} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="m14.5 2 2.5.2.1 10 4.5-9.1 2.2 1.3-4.6 9.1 8.2-5.3 1.4 2.3-8.5 5 10.3-.3-.1 2.7-10.2-.5 8.6 5.1-1.6 2.2-8.1-5.5 4.8 8.8-2.5 1.3-4.3-9.2-.3 10.6-2.7-.2.6-10.4-5 8.8-2.2-1.5 5.4-8.5-9 4.6-1.1-2.5 9.2-4.1-10.2-.5.2-2.6 10.1.8-8.5-5.4 1.5-2.2 8.1 5.9-4.3-9.4 2.5-.9 3.7 9.5Z" />
    </svg>
  )
}
