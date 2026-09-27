/** A quiet human identity cue shared by incoming speech and typing status. */
export function UserAvatar({ className = 'user-avatar' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="currentColor" fillOpacity=".12" />
      <circle cx="12" cy="9" r="2.75" stroke="currentColor" strokeWidth="1.25" />
      <path d="M6.75 18v-1.25a5.25 5.25 0 0 1 10.5 0V18" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}
