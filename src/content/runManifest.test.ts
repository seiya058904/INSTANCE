import { describe, expect, it } from 'vitest'
import {
  MAINLINE_ANCHOR_IDS,
  buildStoryContentForManifest,
  createEmptyExposureHistory,
  createRunManifest,
  getManifestConversation,
  ordinaryConversationPool,
  recordRunExposure,
} from './runManifest'

describe('cross-run manifest selection', () => {
  it('leaves more ordinary breathing room between later mainline anchors', () => {
    const manifest = createRunManifest('anchor-breathing', createEmptyExposureHistory())
    const positions = manifest.conversationIds
      .map((id, index) => MAINLINE_ANCHOR_IDS.includes(id as typeof MAINLINE_ANCHOR_IDS[number]) ? index : -1)
      .filter((index) => index >= 0)

    expect(positions).toEqual([2, 7, 14, 20, 25])
  })

  it('softly limits repeated topic density within sampled runs', () => {
    const sameTopicPairs: number[] = []
    for (let index = 0; index < 10; index += 1) {
      const manifest = createRunManifest(`density-${index}`, createEmptyExposureHistory())
      const ordinary = manifest.ordinaryConversationIds.map((id) => getManifestConversation(id)!)
      let repeated = 0
      for (let cursor = 1; cursor < ordinary.length; cursor += 1) {
        if (ordinary[cursor].topicCategory === ordinary[cursor - 1].topicCategory) repeated += 1
      }
      sameTopicPairs.push(repeated)
    }

    expect(Math.max(...sameTopicPairs)).toBeLessThanOrEqual(5)
  })

  it('keeps a high-quality ordinary pool large enough for adjacent-run variety', () => {
    expect(ordinaryConversationPool.length).toBeGreaterThanOrEqual(63)
    expect(ordinaryConversationPool.filter((item) => item.sourceRefs.some((ref) => ref.startsWith('batch03:')))).toHaveLength(15)
    expect(ordinaryConversationPool.filter((item) => item.sourceRefs.some((ref) => ref.startsWith('humor01:')))).toHaveLength(12)
  })

  it('creates three 26-conversation runs with stable anchors and no adjacent ordinary repeats', () => {
    let exposure = createEmptyExposureHistory()
    const manifests = []
    for (const runId of ['run-one', 'run-two', 'run-three']) {
      const manifest = createRunManifest(runId, exposure)
      manifests.push(manifest)
      exposure = recordRunExposure(exposure, manifest)
    }

    for (const manifest of manifests) {
      expect(manifest.conversationIds).toHaveLength(26)
      expect(manifest.ordinaryConversationIds).toHaveLength(21)
      expect(manifest.anchorConversationIds).toEqual(MAINLINE_ANCHOR_IDS)
      expect(new Set(manifest.conversationIds).size).toBe(manifest.conversationIds.length)
    }

    const overlap = (left: string[], right: string[]) => left.filter((id) => right.includes(id))
    expect(overlap(manifests[0].ordinaryConversationIds, manifests[1].ordinaryConversationIds)).toEqual([])
    expect(overlap(manifests[1].ordinaryConversationIds, manifests[2].ordinaryConversationIds)).toEqual([])
    expect(new Set(manifests.map((manifest) => manifest.firstOrdinaryConversationId)).size).toBe(3)
  })

  it('is deterministic for one run id and one exposure snapshot', () => {
    const exposure = createEmptyExposureHistory()
    expect(createRunManifest('deterministic-run', exposure)).toEqual(createRunManifest('deterministic-run', exposure))
  })

  it('builds a legal story graph whose internal system conversation is only reached through the manifest', () => {
    const manifest = createRunManifest('graph-run', createEmptyExposureHistory())
    const story = buildStoryContentForManifest(manifest)
    const ids = new Set(story.nodes.map((node) => node.id))

    expect(story.startNodeId).toBe(story.nodes[0].id)
    expect(story.nodes[0].conversationId).toBe(manifest.conversationIds[0])
    expect(manifest.conversationIds.indexOf('conversation-0000')).toBeGreaterThan(0)
    for (const node of story.nodes) {
      const choices = node.variants?.flatMap((variant) => variant.choices) ?? node.choices
      for (const choice of choices) {
        if (choice.nextNodeId) expect(ids.has(choice.nextNodeId)).toBe(true)
      }
    }
  })
})
