import { describe, expect, it } from 'vitest'
import { ordinaryConversationPool } from './runManifest'
import { MAINLINE2_LIBRARY } from './mainline2/registry'
import { classifyConversationLanguage } from '../game/languagePacing'

function visibleText(conversation: typeof ordinaryConversationPool[number]) {
  return conversation.nodes.flatMap((node) => [
    ['title', node.conversationTitle],
    ['titleAfter', node.conversationTitleAfterMessage ?? ''],
    ['user', node.userMessage],
    ...(node.userMessages ?? []).map((value) => ['userMulti', value] as const),
    ...(node.userContent ?? []).map((part) => ['userContent', part.text] as const),
    ...(node.userLongInput?.keyFacts ?? []).map((value) => ['userKeyFact', value] as const),
    ...node.choices.flatMap((choice) => [
      ['choice', choice.text] as const,
      ...(choice.content ?? []).map((part) => ['choiceContent', part.text] as const),
      ...(choice.longformPreview ? [
        ['preview', choice.longformPreview.preview] as const,
        ...(choice.longformPreview.highlights ?? []).map((value) => ['highlight', value] as const),
        ...(choice.longformPreview.keyFacts ?? []).map((value) => ['choiceKeyFact', value] as const),
      ] : []),
    ]),
  ] as Array<[string, string]>)
}

describe('full player-facing text audit', () => {
  it('keeps intentional non-Mainline English and translates accidental system English', () => {
    const intentionalEnglish = new Set([
      'batch01:08:choice', // English-learning code-switching scene.
      'original:convergent-yes:choice', // User explicitly requests a Yes-only answer.
      'RUP01-03:choice', // English homework answer selection.
    ])
    const unexpected = ordinaryConversationPool.flatMap((conversation) => visibleText(conversation)
      .filter(([field, value]) => classifyConversationLanguage([value]) === 'pure-english')
      .filter(([field, value]) => field !== 'title' && !intentionalEnglish.has(`${conversation.sourceRefs[0]}:${field}`))
      .map(([field, value]) => `${conversation.sourceRefs[0]}:${field}:${value}`))

    expect(unexpected).toEqual([])
  })

  it('keeps Mainline player-facing copy free from internal authoring and resolver metadata', () => {
    const values = MAINLINE2_LIBRARY.flatMap((conversation) => conversation.nodes.flatMap((node) => [
      node.conversationTitle,
      node.conversationTitleAfterMessage ?? '',
      node.userMessage,
      ...(node.userMessages ?? []),
      ...node.choices.map((choice) => choice.text),
    ]))
    const leaked = values.filter((value) => /canonical|authored|fingerprint|decision binding|hard gate|resolver|choiceId|nodeId|ML2-|proposal\./i.test(value))

    expect(leaked).toEqual([])
    expect(values.filter((value) => /选择.+方向（节点 \d+）/.test(value))).toEqual([])
  })
})
