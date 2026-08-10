import { describe, expect, it } from 'vitest'
import { MAINLINE2_ASSET_COVERAGE, MAINLINE2_LIBRARY } from './registry'

function normalize(value: string) {
  return value.replace(/\s+/g, ' ').trim().toLowerCase()
}

describe('Mainline runtime asset boundary', () => {
  it('keeps authored asset coverage while excluding support-only ending assets from the playable pool', () => {
    expect(MAINLINE2_ASSET_COVERAGE).toHaveLength(330)

    const supportAssetIds = [
      'ML2-A5-M16-CLOSE-01',
      'ML2-A5-M17-LOCK-01',
      'ML2-A5-M17-RESOLVE-01',
      'ML2-A5-M17-WORLD-01',
      'ML2-A5-M17-WHY-01',
      'ML2-A5-M17-ASTER-01',
      'ML2-A5-M17-KEYHISTORY-01',
      'ML2-A5-M17-EPI-ZL',
      'ML2-A5-M17-EPI-LSH',
      'ML2-A5-M17-EPI-ECHO',
      'ML2-A5-M17-EPI-MODULES',
      'ML2-A5-M17-SECRET-01',
      'ML2-A5-M17-FINAL-01',
    ]

    expect(MAINLINE2_LIBRARY.flatMap((conversation) => conversation.sourceRefs)).not.toEqual(expect.arrayContaining(supportAssetIds))
  })

  it('never schedules a one-choice node that mirrors its user message', () => {
    const mirrored = MAINLINE2_LIBRARY.flatMap((conversation) => conversation.nodes
      .filter((node) => node.choices.length === 1 && normalize(node.userMessage) === normalize(node.choices[0].text))
      .map((node) => `${conversation.sourceRefs[0]}:${node.id}`))

    expect(mirrored).toEqual([])
  })

  it('keeps player-facing Mainline messages and choices Chinese-first', () => {
    const pureEnglish = (value: string) => /[A-Za-z]/.test(value) && !/[\u3400-\u9fff\uf900-\ufaff]/.test(value)
    const messages = MAINLINE2_LIBRARY.flatMap((conversation) => conversation.nodes.flatMap((node) => [node.userMessage, ...(node.userMessages ?? [])]))
    const choices = MAINLINE2_LIBRARY.flatMap((conversation) => conversation.nodes.flatMap((node) => node.choices.map((choice) => choice.text)))

    expect(messages.filter(pureEnglish)).toEqual([])
    expect(choices.filter(pureEnglish)).toEqual([])
    expect(messages.join('\n')).not.toContain('Select one of these positions.')
  })
})
