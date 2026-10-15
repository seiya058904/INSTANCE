import { MAINLINE2_LIBRARY } from '../content/mainline2/registry'
import { ordinaryConversationPool } from '../content/runManifest'
import { activeRunConversations } from '../content/activeRun'
import { MAYA_CONVERSATION_IDS } from './participantIdentity'
import { MAINLINE2_STORY_PLAN } from '../content/mainline2/storyPlan'
import editorialRegistry from '../content/mainline2/editorialClassification.registry.json'
import type { HistoryEntry } from './types'
import { describe, expect, it } from 'vitest'
import { resolvePlayerVisibleHistory, resolvePlayerVisibleIdentity } from './playerIdentity'

describe('player-facing identity', () => {
  it('keeps the original Lin label and introduction across new governance conversations', () => {
    const history: HistoryEntry[] = [{ nodeId: 'a2m3-lsh-intro-001', conversationId: 'ml2-authored-ml2-a2-m3-lsh-01', conversationTitle: '林绍衡', userMessage: '我叫林绍衡。', choiceId: 'intro', assistantText: '收到。' }]
    for (const played of [[], history]) {
      const original = resolvePlayerVisibleIdentity('ml2-authored-ml2-a2-m3-lsh-01', played)
      for (const id of ['v4-governance-service', 'v4-governance-return', 'v4-sovereignty-settlement']) expect(resolvePlayerVisibleIdentity(id, played)).toEqual(original)
      expect(original.label).toBe('User #7316')
    }
  })
  it('keeps edition-4 economic returns with the original worker and cold-chain engineer', () => {
    const worker = resolvePlayerVisibleIdentity('ml2-authored-ml2-a4-m10-dev-04', [])
    for (const id of ['v4-econ-occupation', 'v4-econ-detour', 'v4-econ-menu', 'v4-econ-return']) {
      expect(resolvePlayerVisibleIdentity(id, [])).toEqual(worker)
    }
    expect(resolvePlayerVisibleIdentity('v4-econ-cold-chain', [])).toEqual(resolvePlayerVisibleIdentity('ml2-authored-ml2-a4-m7-zl-02', []))
  })
  it('hides internal topic titles for an unseen conversation', () => {
    const identity = resolvePlayerVisibleIdentity('ml2-authored-ml2-a2-m3-log-01', [])

    expect(identity.label).toMatch(/^User #[0-9]{4}$/)
    expect(identity.label).not.toContain('Regional logistics pilot')
  })

  it('reveals Lin Shaoheng only after the authored introduction has happened', () => {
    const before = resolvePlayerVisibleIdentity('ml2-authored-ml2-a2-m3-lsh-01', [])
    const after = resolvePlayerVisibleIdentity('ml2-authored-ml2-a2-m3-lsh-01', [{
      nodeId: 'a2m3-lsh-intro-001',
      conversationId: 'ml2-authored-ml2-a2-m3-lsh-01',
      conversationTitle: '林绍衡第一次出现',
      userMessage: '我叫林绍衡。',
      choiceId: 'choice',
      assistantText: '收到。',
    }])

    expect(before.label).toMatch(/^User #[0-9]{4}$/)
    expect(after.label).toBe('User #7316')
    expect(after.revealed).toBe(true)
    expect(after.label).not.toContain('第一次出现')
  })

  it('keeps Maya identity stable across her first and return conversations', () => {
    const identity = resolvePlayerVisibleIdentity('user-1842-return', [{
      nodeId: 'maya-first-3',
      conversationId: 'user-1842-first',
      conversationTitle: 'User #1842',
      userMessage: '那先记一个最小的吧。我叫岑遥。',
      choiceId: 'choice',
      assistantText: '我会诚实说明边界。',
    }])

    expect(identity.label).toBe('User #1842')
  })

  it('introduces the recurring recorder with a stable identity', () => {
    const identity = resolvePlayerVisibleIdentity('conversation-0000', [])

    expect(identity.label).toBe('User #0000')
  })

  it('builds sidebar history only from completed conversations and removes internal titles', () => {
    const history = resolvePlayerVisibleHistory([{
      nodeId: 'log-1',
      conversationId: 'ml2-authored-ml2-a2-m3-log-01',
      conversationTitle: 'Regional logistics pilot',
      userMessage: '我们做一个区域协同试点。',
      choiceId: 'choice',
      assistantText: '先确认数据边界。',
    }])

    expect(history).toHaveLength(1)
    expect(history[0].label).toMatch(/^User #[0-9]{4}$/)
    expect(history[0].label).not.toContain('Regional logistics pilot')
  })

  it('merges recurring conversations under the identity already revealed by the player', () => {
    const history = resolvePlayerVisibleHistory([{
      nodeId: 'maya-first-3',
      conversationId: 'user-1842-first',
      conversationTitle: 'User #1842',
      userMessage: '我叫岑遥。',
      choiceId: 'choice-1',
      assistantText: '我会说明边界。',
    }, {
      nodeId: 'maya-return-1',
      conversationId: 'user-1842-return',
      conversationTitle: '岑遥 · #1842',
      userMessage: '你还愿意继续吗？',
      choiceId: 'choice-2',
      assistantText: '愿意。',
    }])

    expect(history).toHaveLength(1)
    expect(history[0].label).toBe('User #1842')
  })
})


describe('canonical Maya participant coverage', () => {
  const introduction: HistoryEntry = {
    nodeId: 'maya-first-3', conversationId: 'user-1842-first', conversationTitle: 'User #1842',
    userMessage: '我叫岑遥。', choiceId: 'intro', assistantText: '收到。',
  }
  // Independent authored character metadata detects missing future Story Plan members.
  const authoredMayaAssets = new Set(editorialRegistry.filter((asset) => asset.character === '岑遥').map((asset) => asset.assetId))
  const scheduledMaya = MAINLINE2_STORY_PLAN.flatMap((slot) => slot.kind === 'mainline' && authoredMayaAssets.has(slot.assetId) ? [slot.conversationId] : [])

  it('covers exactly the actual authored Maya speakers in the Story Plan', () => {
    expect([...MAYA_CONVERSATION_IDS]).toEqual(expect.arrayContaining(scheduledMaya))
    expect(new Set(MAYA_CONVERSATION_IDS).size).toBe(MAYA_CONVERSATION_IDS.length)
  })

  it.each(scheduledMaya)('keeps %s under the same anonymous and revealed identity', (id) => {
    expect(resolvePlayerVisibleIdentity(id, [])).toEqual({ participantId: 'user-1842', label: 'User #1842', revealed: false })
    expect(resolvePlayerVisibleIdentity(id, [introduction])).toEqual({ participantId: 'user-1842', label: 'User #1842', revealed: true })
    expect(resolvePlayerVisibleIdentity(id, [])).toEqual({ participantId: 'user-1842', label: 'User #1842', revealed: false })
  })

  it('merges every actual Maya conversation while preserving the latest history link', () => {
    const history = MAYA_CONVERSATION_IDS.map((conversationId, index) => ({ ...introduction, conversationId, nodeId: `fixture-${index}` }))
    expect(resolvePlayerVisibleHistory(history)).toEqual([{ participantId: 'user-1842', label: 'User #1842', conversationId: MAYA_CONVERSATION_IDS.at(-1) }])
    expect(resolvePlayerVisibleHistory([introduction, ...history])).toEqual([{ participantId: 'user-1842', label: 'User #1842', conversationId: MAYA_CONVERSATION_IDS.at(-1) }])
  })

  it('does not merge other speakers, mentions, or incidental Maya-like identifiers', () => {
    const otherSpeakers = MAINLINE2_STORY_PLAN.flatMap((slot) => slot.kind === 'mainline' && !authoredMayaAssets.has(slot.assetId) ? [slot.conversationId] : [])
    for (const id of [...otherSpeakers, 'ordinary-mentions-maya', 'not-a-maya-speaker']) {
      expect(resolvePlayerVisibleIdentity(id, [introduction]).participantId).not.toBe('user-1842')
    }
  })
})

const runtimeConversations = [...MAINLINE2_LIBRARY, ...ordinaryConversationPool, ...activeRunConversations]
it('uses anonymous labels without collisions across all runtime participants', () => {
  const labels = new Map<string, string>()
  const collisions: string[] = []
  for (const conversation of runtimeConversations) {
    const identity = resolvePlayerVisibleIdentity(conversation.id, [])
    expect(identity.label, conversation.id).toMatch(/^User #\d{4}$/)
    if (labels.has(identity.label) && labels.get(identity.label) !== identity.participantId) collisions.push(`${identity.label}: ${labels.get(identity.label)} / ${identity.participantId}`)
    labels.set(identity.label, identity.participantId)
  }
  expect([...new Set(collisions)]).toEqual([])
})
it('orders recurring participants by their most recent appearance', () => {
  const entry = (conversationId: string): HistoryEntry => ({ conversationId, nodeId: 'fixture', conversationTitle: 'internal', userMessage: 'hello', choiceId: 'reply', assistantText: 'hi' })
  expect(resolvePlayerVisibleHistory(['user-1842-first', 'conversation-0000', 'user-1842-return'].map(entry)).map(item => item.participantId)).toEqual(['system-0000', 'user-1842'])
})

it.each(['unknown-conversation', 'constructor', 'toString', '__proto__', 'ml2-next-opening', 'ml2-authored-ml2-a2-zl-01', 'ml2-authored-ml2-a3-m4-e9-01', 'ml2-authored-ml2-a4-m8-ai-01', 'conversation-0000'])('keeps %s anonymous and deterministic after history restoration', id => {
  const history: HistoryEntry[] = [{nodeId:'maya-first-3', conversationId:'user-1842-first',conversationTitle:'岑遥 · #1842',userMessage:'我叫岑遥',choiceId:'intro',assistantText:'收到'}]
  const first = resolvePlayerVisibleIdentity(id, [])
  expect(first.label).toMatch(/^User #\d{4}$/)
  expect(resolvePlayerVisibleIdentity(id, JSON.parse(JSON.stringify(history))).label).toBe(first.label)
  expect(first.revealed).toBe(false)
})
it('preserves the existing legacy anchor number', () => {
  expect(resolvePlayerVisibleIdentity('user-7391', []).label).toBe('User #6273')
})

it('has no author-context channel in any mainline, anchor or ordinary runtime node', () => {
  for (const conversation of runtimeConversations) {
    for (const node of conversation.nodes) {
      for (const item of [node, ...node.variants ?? [], ...node.contextVariants ?? []]) {
        expect(Object.hasOwn(item, 'assistantContext'), node.id).toBe(false)
        expect(Object.hasOwn(item, 'assistantContextSuffix'), node.id).toBe(false)
      }
    }
  }
})
