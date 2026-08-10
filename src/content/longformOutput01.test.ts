import { describe, expect, it } from 'vitest'
import { longformOutput01Conversations, longformOutput01ReservedRefs } from './longformOutput01'
import { promotedLongformConversations } from './longformPromoted'
import { createEmptyExposureHistory, createRunManifest, ordinaryConversationPool, recordRunExposure } from './runManifest'

describe('longform output 01 integration boundary', () => {
  it('integrates six distinct output modalities and reserves the remaining four', () => {
    expect(longformOutput01Conversations).toHaveLength(6)
    expect(new Set(longformOutput01Conversations.map((conversation) => conversation.sourceRefs[0]))).toHaveLength(6)
    expect(longformOutput01Conversations.flatMap((conversation) => conversation.nodes)).toHaveLength(18)
    expect(longformOutput01Conversations.flatMap((conversation) => conversation.nodes.flatMap((node) => node.choices)).filter((choice) => choice.longformPreview)).toHaveLength(48)
    expect(longformOutput01ReservedRefs).toHaveLength(4)
    expect(longformOutput01ReservedRefs.every((sourceRef) => promotedLongformConversations.some((conversation) => conversation.sourceRefs.includes(sourceRef)))).toBe(true)
    expect(promotedLongformConversations).toHaveLength(4)
  })

  it('stores preview structure and continuity facts on every integrated longform conversation', () => {
    for (const conversation of longformOutput01Conversations) {
      const previews = conversation.nodes.flatMap((node) => node.choices.map((choice) => choice.longformPreview).filter(Boolean))
      expect(previews.every((preview) => preview?.preview && preview.keyFacts?.length && preview.structure?.length)).toBe(true)
    }
  })

  it('keeps longform as a soft scheduler preference rather than a hard quota', () => {
    let history = createEmptyExposureHistory()
    const manifests = []
    for (let index = 0; index < 5; index += 1) {
      const manifest = createRunManifest(`longform-audit-${index}`, history)
      manifests.push(manifest)
      history = recordRunExposure(history, manifest)
    }
    const longformRuns = manifests.map((manifest) => manifest.ordinaryConversationIds.filter((id) => id.startsWith('longform-')).length)
    expect(longformRuns.some((count) => count === 0)).toBe(true)
    expect(longformRuns.every((count) => count <= 2)).toBe(true)
  })
})
