import mark from '../assets/claude/mark.svg'

/** The product mark remains the same when Aster's identity changes. */
export function AsterMark({ className = 'assistant-mark', active = false }: { className?: string; active?: boolean }) {
  return (
    <img className={`${className}${active ? ' is-active' : ''}`} src={mark} alt="" aria-hidden="true" />
  )
}
