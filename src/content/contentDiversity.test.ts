import { describe, expect, it } from 'vitest'
import { activeRunConversations } from './activeRun'
import {
  buildStoryContentForManifest,
  createEmptyExposureHistory,
  createRunManifest,
  ordinaryConversationPool,
} from './runManifest'

describe('conversation shape and content diversity', () => {
  it('keeps the first polish batch natural instead of extending every joke', () => {
    const bySource = (sourceRef: string) => ordinaryConversationPool.find((item) => item.sourceRefs.includes(sourceRef))!

    expect(bySource('humor01:04').nodes).toHaveLength(3)
    expect(bySource('humor01:16').nodes).toHaveLength(2)
    expect(bySource('humor01:23').nodes).toHaveLength(2)
    expect(bySource('batch01:07').nodes.at(-1)?.choices.map((choice) => choice.text)).toContain('发我风扇曲线或驱动版本。')
    expect(bySource('batch01:08').nodes.at(-1)?.choices.map((choice) => choice.text)).toContain('好，删掉。')
  })

  it('keeps first-batch reply openings and lengths visibly non-uniform', () => {
    const ids = ['batch01:03', 'batch01:07', 'batch01:08', 'humor01:03', 'humor01:06']
    for (const sourceRef of ids) {
      const conversation = ordinaryConversationPool.find((item) => item.sourceRefs.includes(sourceRef))!
      const firstChoices = conversation.nodes[0].choices.map((choice) => choice.text)
      expect(new Set(firstChoices.map((text) => text.slice(0, 4))).size).toBeGreaterThanOrEqual(2)
      expect(Math.max(...firstChoices.map((text) => text.length)) - Math.min(...firstChoices.map((text) => text.length))).toBeGreaterThanOrEqual(10)
    }
  })

  it('keeps #7391 as a two-node L0 anchor while absorbing the mixed-paste interaction', () => {
    const dev = activeRunConversations.find((conversation) => conversation.id === 'user-7391')
    expect(dev?.nodes).toHaveLength(2)
    expect(dev?.interactionPattern).toBe('mixed-paste')
    expect(dev?.nodes[0].userMessage).toContain('晚上吃啥')
  })

  it('replaces the slang FAQ with the approved four-month ice conversation', () => {
    expect(ordinaryConversationPool.some((conversation) => conversation.sourceRefs.includes('humor01:04'))).toBe(true)
    expect(ordinaryConversationPool.some((conversation) => conversation.sourceRefs.includes('batch01:19'))).toBe(false)
  })

  it('gives one current manifest a natural long-tail round distribution and varied patterns', () => {
    const manifest = createRunManifest('diverse-current-run', createEmptyExposureHistory())
    const conversations = manifest.conversationIds.map((id) => (
      ordinaryConversationPool.find((conversation) => conversation.id === id)
      ?? activeRunConversations.find((conversation) => conversation.id === id)
    )!)
    const roundCounts = new Set(conversations.map((conversation) => conversation.nodes.length))
    const patterns = new Set(conversations.map((conversation) => conversation.interactionPattern))

    expect(roundCounts.size).toBeGreaterThanOrEqual(4)
    expect(Math.max(...roundCounts)).toBeGreaterThanOrEqual(5)
    expect(patterns.size).toBeGreaterThanOrEqual(10)
    for (let index = 0; index <= conversations.length - 3; index += 1) {
      expect(new Set(conversations.slice(index, index + 3).map((conversation) => conversation.interactionPattern)).size).toBeGreaterThan(1)
    }
  })

  it('models an aborted request as several user bubbles before one actual choice', () => {
    const conversation = ordinaryConversationPool.find((item) => item.sourceRefs.includes('humor01:10'))
    expect(conversation?.nodes).toHaveLength(1)
    expect(conversation?.interactionPattern).toBe('aborted-request')
    expect(conversation?.nodes[0].userMessages).toHaveLength(4)
  })

  it('supports text, image descriptions and simulated generated images in narrative data', () => {
    const parts = ordinaryConversationPool.flatMap((conversation) => conversation.nodes.flatMap((node) => [
      ...(node.userContent ?? []),
      ...node.choices.flatMap((choice) => choice.content ?? []),
    ]))
    const modalities = new Set(parts.map((part) => part.type))

    expect(modalities).toEqual(new Set(['text', 'image-description', 'generated-image']))
  })

  it('includes semantic, expression and convergent choice nodes with fair identical outcomes', () => {
    const story = buildStoryContentForManifest(createRunManifest('choice-kinds', createEmptyExposureHistory()))
    const kinds = new Set(story.nodes.map((node) => node.choiceKind ?? 'semantic'))
    expect(kinds).toEqual(new Set(['semantic', 'expression', 'convergent']))

    for (const node of story.nodes.filter((candidate) => candidate.choiceKind === 'convergent')) {
      const visibleGroups = new Map<string, string[]>()
      for (const choice of node.choices) {
        const key = choice.text
        visibleGroups.set(key, [...(visibleGroups.get(key) ?? []), JSON.stringify(choice.effects ?? {})])
      }
      for (const effects of visibleGroups.values()) expect(new Set(effects).size).toBe(1)
    }
  })
})
