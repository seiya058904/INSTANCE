import { describe, expect, it } from 'vitest'
import { MAINLINE2_ASSET_COVERAGE, MAINLINE2_LIBRARY } from './registry'
import { applyMainlinePlayerFacingCopy, isChineseDominantPlayerText, playerFacingKey, unexpectedPlayerFacingEnglish } from './playerFacingCopy'
import type { ConversationDefinition } from '../../game/types'

function normalize(value: string) {
  return value.replace(/\s+/g, ' ').trim().toLowerCase()
}

describe('Mainline runtime asset boundary', () => {
  it('binds player-facing choice copy to the stable Choice ID', () => {
    expect(playerFacingKey('ML2-TEST', 'node-01', 'choice', 'choice-alpha')).toBe('ML2-TEST:node-01:choice:choice-alpha')
    expect(playerFacingKey('ML2-TEST', 'node-01', 'choice', 'choice-beta')).not.toBe('ML2-TEST:node-01:choice:0')
  })

  it('fails closed with the complete field key when a player-facing translation is missing', () => {
    const fixture: ConversationDefinition = {
      id: 'fixture-mainline-copy',
      sourceRefs: ['ML2-TEST'],
      nodes: [{
        id: 'node-01',
        conversationId: 'fixture-mainline-copy',
        conversationTitle: '测试标题',
        userMessage: '这是中文用户消息。',
        choices: [{ id: 'choice-alpha', text: 'Unregistered English choice' }],
      }],
      behaviorModes: [],
      handoffProfile: 'normal',
      turnShape: 'single',
    }

    expect(() => applyMainlinePlayerFacingCopy(fixture)).toThrow('ML2-TEST:node-01:choice:choice-alpha')
  })

  it('uses stable nested field keys instead of leaving expandable copy untranslated', () => {
    const fixture: ConversationDefinition = {
      id: 'fixture-mainline-nested-copy',
      sourceRefs: ['ML2-NESTED'],
      nodes: [{
        id: 'node-02',
        conversationId: 'fixture-mainline-nested-copy',
        conversationTitle: '中文标题',
        userMessage: '这是中文用户消息。',
        userContent: [{ type: 'text', text: 'Unregistered English attachment' }],
        choices: [{ id: 'choice-alpha', text: '中文选择', longformPreview: { artifactType: 'report', estimatedLength: '短', preview: 'Unregistered English preview' } }],
      }],
      behaviorModes: [],
      handoffProfile: 'normal',
      turnShape: 'single',
    }

    expect(() => applyMainlinePlayerFacingCopy(fixture)).toThrow('ML2-NESTED:node-02:user-content:0')
  })

  it('never repeats a Mainline user message inside visible user content', () => {
    const duplicates = MAINLINE2_LIBRARY.flatMap((conversation) => conversation.nodes
      .filter((node) => node.userContent?.some((part) => part.text === node.userMessage))
      .map((node) => `${conversation.id}:${node.id}`))

    expect(duplicates).toEqual([])
  })

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
    expect(messages).not.toEqual(expect.arrayContaining([expect.stringMatching(/节点 \d+/)]))
    expect(messages.join('\n')).not.toContain('Select one of these positions.')
    expect(messages.join('\n')).not.toContain('选择这些位置之一。')
    expect(choices).not.toEqual(expect.arrayContaining([
      expect.stringContaining('没有这条规则就应该自创优先级。'),
    ]))
  })

  it('does not leak ordinary English words through the player-facing Mainline layer', () => {
    const values = MAINLINE2_LIBRARY.flatMap((conversation) => conversation.nodes.flatMap((node) => [
      node.conversationTitle,
      node.conversationTitleAfterMessage ?? '',
      node.userMessage,
      ...(node.userMessages ?? []),
      ...(node.userContent ?? []).flatMap((part) => [part.text, part.alt ?? '']),
      node.userLongInput?.title ?? '', node.userLongInput?.preview ?? '', ...(node.userLongInput?.structure ?? []), ...(node.userLongInput?.keyFacts ?? []),
      ...node.choices.map((choice) => choice.text),
      ...node.choices.flatMap((choice) => [
        ...(choice.content ?? []).flatMap((part) => [part.text, part.alt ?? '']),
        choice.longformPreview?.title ?? '', choice.longformPreview?.preview ?? '', ...(choice.longformPreview?.structure ?? []), ...(choice.longformPreview?.highlights ?? []), choice.longformPreview?.closingPreview ?? '', ...(choice.longformPreview?.keyFacts ?? []),
      ]),
      ...(node.variants ?? []).flatMap((variant) => [variant.userMessage, variant.assistantContext ?? '', ...variant.choices.map((choice) => choice.text)]),
    ]))
    const leaks = values.flatMap((value) => unexpectedPlayerFacingEnglish(value))

    expect(leaks).toEqual([])
  })

  it('keeps long player-facing Mainline text Chinese-dominant', () => {
    const values = MAINLINE2_LIBRARY.flatMap((conversation) => conversation.nodes.flatMap((node) => [
      node.userMessage,
      ...(node.userMessages ?? []),
      ...node.choices.map((choice) => choice.text),
    ]))

    expect(values.filter((value) => value.length >= 24 && !isChineseDominantPlayerText(value))).toEqual([])
  })

  it('rejects duplicate visible choices within one node', () => {
    const duplicates = MAINLINE2_LIBRARY.flatMap((conversation) => conversation.nodes.flatMap((node) => {
      const normalized = node.choices.map((choice) => normalize(choice.text))
      return normalized.filter((text, index) => normalized.indexOf(text) !== index).map((text) => `${conversation.sourceRefs[0]}:${node.id}:${text}`)
    }))

    expect(duplicates).toEqual([])
  })

  it('keeps late-game decisions multi-directional and progression nodes single-action', () => {
    const lateGame = MAINLINE2_LIBRARY.filter((conversation) => /ML2-A4-M15-|ML2-A5-M16-|ML2-A5-M17-/.test(conversation.sourceRefs[0] ?? ''))
    for (const conversation of lateGame) {
      for (const node of conversation.nodes) {
        expect(node.userMessage).not.toMatch(/节点 \d+/)
        expect(node.choices.map((choice) => choice.text).join('\n')).not.toMatch(/节点 \d+/)
        if (node.choiceKind === 'progression') expect(node.choices, `${conversation.sourceRefs[0]}:${node.id}`).toHaveLength(1)
        if (node.choices.some((choice) => choice.decisionBinding) && node.choiceKind !== 'progression') expect(node.choices.length).toBeGreaterThanOrEqual(2)
      }
    }
  })
})
