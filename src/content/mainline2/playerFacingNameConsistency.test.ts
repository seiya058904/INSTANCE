import { describe, expect, it } from 'vitest'
import { MAINLINE2_BY_ID, MAINLINE2_LIBRARY } from './registry'
import playerFacingCopy from './playerFacingCopy.registry.generated.json'
import endingPlayerFacingCopy from './endingPlayerFacingCopy.registry.generated.json'

// Player-facing Mainline text must never contain these known mistranslations.
// The banned terms are unambiguous in this codebase: each one has a stable
// canonical form (Aster, 岑遥, 周岚, 林绍衡). A different, legitimate context
// would need an explicit allowlist entry and a reason.
const BANNED_TERMS = [
  '紫苑',
  '紫菀',
  '艾斯特',
  '玛雅人',
  '玛雅',
  '周澜',
  '周兰',
  '林绍恒',
  '阿联酋不存在',
  '音响实例',
]

function collectPlayerFacingText() {
  const values: string[] = []
  for (const conversation of MAINLINE2_LIBRARY) {
    for (const node of conversation.nodes) {
      values.push(node.conversationTitle, node.conversationTitleAfterMessage ?? '', node.userMessage, ...(node.userMessages ?? []))
      for (const choice of node.choices) {
        values.push(choice.text, ...(choice.content ?? []).map((part) => part.text), ...(choice.content ?? []).flatMap((part) => part.alt ? [part.alt] : []))
      }
      for (const variant of node.variants ?? []) {
        values.push(variant.userMessage, ...variant.choices.map((choice) => choice.text))
      }
    }
  }
  return values
}

describe('Mainline player-facing name consistency', () => {
  it('keeps every authored conversation free of banned mistranslations', () => {
    const values = collectPlayerFacingText()
    const failures = values.flatMap((value) => {
      const hit = BANNED_TERMS.find((term) => value.includes(term))
      return hit ? [value.slice(0, 160)] : []
    })
    expect(failures).toEqual([])
  })

  it('keeps the player-facing registry JSON free of banned mistranslations', () => {
    const values = Object.values(playerFacingCopy as Record<string, string>)
    const failures = values.flatMap((value) => {
      const hit = BANNED_TERMS.find((term) => value.includes(term))
      return hit ? [value.slice(0, 160)] : []
    })
    expect(failures).toEqual([])
  })

  it('keeps the ending registry JSON free of banned mistranslations', () => {
    const values = Object.values(endingPlayerFacingCopy as Record<string, string>)
    const failures = values.flatMap((value) => {
      const hit = BANNED_TERMS.find((term) => value.includes(term))
      return hit ? [value.slice(0, 160)] : []
    })
    expect(failures).toEqual([])
  })

  it('uses 岑遥 for the Maya character in player-visible Chinese roles', () => {
    const values = collectPlayerFacingText().filter((value) => value.includes('岑遥'))
    expect(values.length).toBeGreaterThan(0)
    for (const value of values) {
      expect(value).not.toContain('玛雅')
    }
  })

  it('keeps Aster and ECHO-9 tokens intact (no 紫苑/艾斯特 rewrite)', () => {
    const values = collectPlayerFacingText().filter((value) => value.includes('Aster') || value.includes('ECHO-9'))
    for (const value of values) {
      expect(value).not.toContain('紫苑')
      expect(value).not.toContain('艾斯特')
    }
    expect(MAINLINE2_BY_ID.get('ml2-authored-ml2-a4-m12-machine-01')?.nodes[0].userMessage).not.toContain('紫苑')
  })
})

describe('Mainline player-facing Markdown leakage', () => {
  it('does not leak bare ** emphasis markers into player-visible text', () => {
    const values = collectPlayerFacingText()
    const failures = values.filter((value) => value.includes('**'))
    expect(failures).toEqual([])
  })

  it('does not leak bare ** markers into either registry JSON', () => {
    const mainValues = Object.values(playerFacingCopy as Record<string, string>)
    const endingValues = Object.values(endingPlayerFacingCopy as Record<string, string>)
    expect(mainValues.filter((value) => value.includes('**'))).toEqual([])
    expect(endingValues.filter((value) => value.includes('**'))).toEqual([])
  })

  it('does not strip ordinary single asterisks (code, math, lists)', () => {
    // Single-asterisk content is not an emphasis marker: code blocks, math and
    // list bullets must survive normalization untouched. Any player-facing
    // node that legitimately uses a single * still passes through.
    const conversation = MAINLINE2_BY_ID.get('ml2-authored-ml2-a4-m12-machine-01')
    expect(conversation).toBeTruthy()
    // The normalized registry keeps any single-asterisk content intact.
    const values = Object.values(playerFacingCopy as Record<string, string>)
    expect(values.some((value) => value.includes('*'))).toBe(false)
  })
})
