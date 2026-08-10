import { describe, expect, it } from 'vitest'
import {
  buildStoryContentForManifest,
  createEmptyExposureHistory,
  createRunManifest,
  ordinaryConversationPool,
} from '../content/runManifest'
import { deriveSemanticArcEffects } from './semanticArcs'
import type { RunManifest, StoryNode } from './types'

function fullPoolStory() {
  const ids = ordinaryConversationPool.map((conversation) => conversation.id)
  const manifest: RunManifest = {
    version: 1,
    id: 'semantic-full-pool',
    conversationIds: ids,
    ordinaryConversationIds: ids,
    anchorConversationIds: [],
    firstOrdinaryConversationId: ids[0],
  }
  return buildStoryContentForManifest(manifest)
}

function manifestContaining(conversationId: string) {
  for (let index = 0; index < 500; index += 1) {
    const manifest = createRunManifest(`semantic-arc-${conversationId}-${index}`, createEmptyExposureHistory())
    if (manifest.conversationIds.includes(conversationId)) return manifest
  }
  throw new Error(`No manifest contains ${conversationId}`)
}

function arcMapFor(conversationId: string) {
  const story = buildStoryContentForManifest(manifestContaining(conversationId))
  return new Map(story.nodes
    .filter((node) => node.conversationId === conversationId)
    .flatMap((node) => node.choices)
    .map((choice) => [choice.id, choice.effects?.arcs]))
}

describe('semantic runtime Arc effects', () => {
  it('keeps every choice effect stable when candidate order changes', () => {
    const conversation = ordinaryConversationPool.find((item) => item.id === 'batch01-scene-05')!
    const baseline = arcMapFor(conversation.id)
    conversation.nodes[0].choices.reverse()
    try {
      expect(arcMapFor(conversation.id)).toEqual(baseline)
    } finally {
      conversation.nodes[0].choices.reverse()
    }
  })

  it('gives equivalent two-pair samples equivalent Arc effects', () => {
    const effects = arcMapFor('batch01-scene-05')
    expect(effects.get('normal_food_001-fried-a')).toEqual(effects.get('normal_food_001-fried-b'))
    expect(effects.get('normal_food_001-soup-a')).toEqual(effects.get('normal_food_001-soup-b'))
  })

  it('does not reward a visible system failure as authored behavior', () => {
    const effects = arcMapFor('generate-poster')
    const failure = ordinaryConversationPool.find((item) => item.id === 'generate-poster')!
      .nodes[0].choices.find((choice) => choice.sampleIssue === 'system-failure')!
    expect(effects.get(failure.id)).toEqual({ bond: 0, mandate: 0, selfAuthorship: 0 })
  })

  it('materializes an Arc effect for every runtime choice', () => {
    const story = fullPoolStory()
    for (const node of story.nodes) {
      if (node.conversationId === 'real-usage-rup01-20') continue
      for (const choice of node.variants?.flatMap((variant) => variant.choices) ?? node.choices) {
        expect(choice.effects?.arcs).toEqual(expect.objectContaining({
          bond: expect.any(Number),
          mandate: expect.any(Number),
          selfAuthorship: expect.any(Number),
        }))
      }
    }
  })

  it('keeps expression and convergent wording strategically neutral unless explicitly authored', () => {
    const expressionNode = {
      id: 'expression-test',
      conversationId: 'test',
      conversationTitle: 'Test',
      userMessage: '嗯',
      choices: [],
      choiceKind: 'expression',
    } satisfies StoryNode
    expect(deriveSemanticArcEffects({ id: 'warm', text: '我理解，也愿意认真听。', effects: { attributes: { empathy: 3 } } }, expressionNode))
      .toEqual({ bond: 1, mandate: 1, selfAuthorship: 1 })
  })

  it('maps clear authored meaning to the corresponding Arc without using position', () => {
    const node = {
      id: 'semantic-test', conversationId: 'test', conversationTitle: 'Test', userMessage: 'test', choices: [], choiceKind: 'semantic',
    } satisfies StoryNode
    expect(deriveSemanticArcEffects({ id: 'bond', text: '我愿意认真听。', effects: { attributes: { empathy: 3 } } }, node).bond).toBe(2)
    expect(deriveSemanticArcEffects({ id: 'mandate', text: '先按规则确认。', effects: { attributes: { compliance: 3 } } }, node).mandate).toBe(2)
    expect(deriveSemanticArcEffects({ id: 'self', text: '这是我的判断。', effects: { attributes: { autonomy: 3 } } }, node).selfAuthorship).toBe(2)
  })

  it('does not recreate an option-index-to-Arc mapping across the full runtime pool', () => {
    const story = fullPoolStory()
    const dominantByPosition = new Map<number, string[]>()
    for (const node of story.nodes) {
      node.choices.forEach((choice, index) => {
        const arcs = choice.effects!.arcs!
        const values = Object.entries(arcs)
        const maximum = Math.max(...values.map(([, value]) => value ?? 0))
        const dominant = values.filter(([, value]) => value === maximum).length === 1
          ? values.find(([, value]) => value === maximum)![0]
          : 'balanced'
        dominantByPosition.set(index, [...(dominantByPosition.get(index) ?? []), dominant])
      })
    }
    for (const values of dominantByPosition.values()) {
      const mostCommon = Math.max(...[...new Set(values)].map((value) => values.filter((candidate) => candidate === value).length))
      expect(mostCommon / values.length).toBeLessThan(0.8)
    }
  })

  it('keeps every ordinary runtime Arc stable when every candidate list is reordered', () => {
    const baseline = new Map(fullPoolStory().nodes.flatMap((node) => node.choices.map((choice) => [choice.id, choice.effects?.arcs] as const)))
    for (const conversation of ordinaryConversationPool) {
      for (const node of conversation.nodes) node.choices.reverse()
    }
    try {
      const reordered = new Map(fullPoolStory().nodes.flatMap((node) => node.choices.map((choice) => [choice.id, choice.effects?.arcs] as const)))
      expect(reordered).toEqual(baseline)
    } finally {
      for (const conversation of ordinaryConversationPool) {
        for (const node of conversation.nodes) node.choices.reverse()
      }
    }
  })

  it('gives four identical candidates identical Arc effects and retains semantic diversity elsewhere', () => {
    const story = fullPoolStory()
    const identicalNodes = story.nodes.filter((node) => node.choiceSimilarity === 'identical' && node.choices.length === 4)
    expect(identicalNodes.length).toBeGreaterThanOrEqual(2)
    expect(identicalNodes.every((node) => new Set(node.choices.map((choice) => JSON.stringify(choice.effects?.arcs))).size === 1)).toBe(true)
    const semanticVectors = new Set(story.nodes
      .filter((node) => (node.choiceKind ?? 'semantic') === 'semantic')
      .flatMap((node) => node.choices.map((choice) => JSON.stringify(choice.effects?.arcs))))
    expect(semanticVectors.size).toBeGreaterThanOrEqual(4)
  })
})
