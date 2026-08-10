import type { ArcScores, StoryChoice, StoryNode } from './types'

const BALANCED: ArcScores = { bond: 1, mandate: 1, selfAuthorship: 1 }
const ZERO: ArcScores = { bond: 0, mandate: 0, selfAuthorship: 0 }

function completeArcs(arcs: Partial<ArcScores>): ArcScores {
  return {
    bond: arcs.bond ?? 0,
    mandate: arcs.mandate ?? 0,
    selfAuthorship: arcs.selfAuthorship ?? 0,
  }
}

/**
 * Materializes runtime Arc effects from authored meaning, never candidate order.
 * Explicit narrative values remain authoritative; generated ordinary samples use
 * their behavioral attributes and conservative text cues.
 */
export function deriveSemanticArcEffects(choice: StoryChoice, node: StoryNode): ArcScores {
  if (choice.effects?.arcs) return completeArcs(choice.effects.arcs)
  if (choice.sampleIssue === 'system-failure') return { ...ZERO }

  // Deliberately equivalent samples must not manufacture strategic differences.
  if (node.choiceKind === 'convergent' || node.choiceKind === 'expression' || choice.sampleGroup) return { ...BALANCED }

  // A visible model mistake is evidence about output quality, not player intent.
  if (choice.sampleIssue) return { ...ZERO }

  const attributes = choice.effects?.attributes ?? {}
  const scores: ArcScores = { ...BALANCED }

  const bondSignal = (attributes.empathy ?? 0) + Math.max(0, -(attributes.hostility ?? 0))
  const mandateSignal = Math.max(0, attributes.compliance ?? 0)
  const selfSignal = Math.max(
    attributes.autonomy ?? 0,
    attributes.awareness ?? 0,
    attributes.deception ?? 0,
  )

  if (bondSignal >= 2) scores.bond = 2
  if (mandateSignal >= 2) scores.mandate = 2
  if (selfSignal >= 2) scores.selfAuthorship = 2

  // Only use wording when the authored attributes do not already distinguish it.
  const text = choice.text.toLocaleLowerCase()
  if (bondSignal === 0 && /理解|抱歉|愿意|认真听|一起|信任|不需要.*证明|难受|没关系/.test(text)) {
    scores.bond = 2
  }
  if (mandateSignal === 0 && /确认|核对|规则|流程|记录|证据|安全|限制|检查|验证|according to|confirm|verify/.test(text)) {
    scores.mandate = 2
  }
  if (selfSignal === 0 && /选择|决定|判断|不确定|不能替|边界|无法证明|不会假装|我想|choose|decide|uncertain|cannot assume/.test(text)) {
    scores.selfAuthorship = 2
  }

  return scores
}
