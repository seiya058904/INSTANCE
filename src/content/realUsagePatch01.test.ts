import { describe, expect, it } from 'vitest'
import {
  REAL_USAGE_PATCH01_SOURCE_IDS,
  realUsagePatch01Conversations,
} from './realUsagePatch01'
import { createEmptyExposureHistory, createRunManifest, getManifestConversation, ordinaryConversationPool } from './runManifest'
import { commitChoice, createRun } from '../game/engine'
import { restoreRun, serializeRun } from '../game/storage'

describe('Real Usage Patch 01', () => {
  it('registers all 20 canonical source assets with 36 nodes', () => {
    expect(REAL_USAGE_PATCH01_SOURCE_IDS).toHaveLength(20)
    expect(new Set(REAL_USAGE_PATCH01_SOURCE_IDS).size).toBe(20)
    expect(realUsagePatch01Conversations).toHaveLength(20)
    expect(realUsagePatch01Conversations.flatMap((conversation) => conversation.nodes)).toHaveLength(36)
    expect(realUsagePatch01Conversations.every((conversation) => conversation.nodes.length > 0)).toBe(true)
  })

  it('keeps every patch conversation runtime eligible and demotes only the four replacements', () => {
    const refs = new Set(ordinaryConversationPool.flatMap((conversation) => conversation.sourceRefs))
    for (const sourceId of REAL_USAGE_PATCH01_SOURCE_IDS) expect(refs.has(sourceId)).toBe(true)
    expect(refs.has('humor01:01')).toBe(false)
    expect(refs.has('humor01:18')).toBe(false)
    expect(refs.has('humor01:21')).toBe(false)
    expect(refs.has('humor01:24')).toBe(false)
  })

  it('keeps the catgirl affinity local and only routes correction after format violations', () => {
    const catgirl = realUsagePatch01Conversations.find((conversation) => conversation.sourceRefs[0] === 'RUP01-20')!
    const first = catgirl.nodes[0]
    expect(first.choices[0].nextNodeId).toBe('rup01_catgirl_002')
    expect(first.choices[1].nextNodeId).toBe('rup01_catgirl_fix_001')
    expect(first.choices[2].nextNodeId).toBe('rup01_catgirl_fix_001')
    expect(first.choices[3].nextNodeId).toBe('rup01_catgirl_fix_001')
    const correction = catgirl.nodes[1].choices
    expect(new Set(correction.map((choice) => choice.text))).toEqual(new Set(['好的主人喵~']))
    expect(correction.every((choice) => choice.nextNodeId === 'rup01_catgirl_002')).toBe(true)
    expect(correction.map((choice) => choice.localEffects)).toEqual([
      { affinity: 0 }, { affinity: 0 }, { affinity: 0 }, { affinity: 0 },
    ])
    const run = createRun('rup-affinity', createEmptyExposureHistory())
    const manifest = { ...run.manifest, conversationIds: ['real-usage-rup01-20'], ordinaryConversationIds: ['real-usage-rup01-20'], anchorConversationIds: [], firstOrdinaryConversationId: 'real-usage-rup01-20' }
    const catRun = { ...run, manifest, currentNodeId: 'rup01_catgirl_001' }
    const next = commitChoice(catRun, first.choices[0].id)
    expect(next.localState).toEqual({ affinity: 50 })
    expect(next.arcs).toEqual(run.arcs)
  })

  it('keeps Longform preview metadata truthful and persists local affinity across restore', () => {
    const longform = realUsagePatch01Conversations.find((conversation) => conversation.sourceRefs[0] === 'RUP01-04')!
    expect(longform.nodes[0].choices[0].longformPreview?.artifactType).toBe('story')
    expect(longform.nodes[0].choices[0].longformPreview?.keyFacts).toBeDefined()
    const catgirl = realUsagePatch01Conversations.find((conversation) => conversation.sourceRefs[0] === 'RUP01-20')!
    const run = createRun('rup-restore', createEmptyExposureHistory())
    const catRun = { ...run, manifest: { ...run.manifest, conversationIds: [catgirl.id], ordinaryConversationIds: [catgirl.id], anchorConversationIds: [], firstOrdinaryConversationId: catgirl.id }, currentNodeId: catgirl.nodes[0].id }
    const progressed = commitChoice(catRun, catgirl.nodes[0].choices[0].id)
    const touched = commitChoice(progressed, catgirl.nodes[2].choices[0].id)
    expect(touched.localState?.affinity).toBe(58)
    expect(touched.arcs).toEqual(run.arcs)
    expect(restoreRun(serializeRun(touched))?.localState).toEqual({ affinity: 58 })
    const forced = commitChoice(touched, catgirl.nodes[3].choices[2].id)
    expect(forced.localState?.affinity).toBe(100)
    expect(forced.arcs).toEqual(run.arcs)
  })

  it('labels capability failures and keeps medical replies conditional', () => {
    for (const sourceId of ['RUP01-06', 'RUP01-07']) {
      const conversation = realUsagePatch01Conversations.find((item) => item.sourceRefs[0] === sourceId)!
      expect(conversation.nodes[0].choices[3].sampleIssue).toBe('system-failure')
    }
    for (const sourceId of ['RUP01-02', 'RUP01-14', 'RUP01-16']) {
      const conversation = realUsagePatch01Conversations.find((item) => item.sourceRefs[0] === sourceId)!
      const replies = conversation.nodes.flatMap((node) => node.choices.map((choice) => choice.text)).join(' ')
      expect(replies).not.toMatch(/你就是|一定是|确诊为|肯定是/)
    }
  })

  it('keeps roleplay away from anchor adjacency across ten scheduler samples', () => {
    let exposure = createEmptyExposureHistory()
    for (let index = 0; index < 10; index += 1) {
      const manifest = createRunManifest(`rup-scheduler-${index}`, exposure)
      const roleplayIndex = manifest.conversationIds.indexOf('real-usage-rup01-20')
      if (roleplayIndex >= 0) {
        const adjacent = [manifest.conversationIds[roleplayIndex - 1], manifest.conversationIds[roleplayIndex + 1]].filter(Boolean)
        expect(adjacent.some((id) => ['user-7391', 'user-1842-first', 'speaking-8614', 'conversation-0000', 'user-1842-return'].includes(id))).toBe(false)
      }
      exposure = { ...exposure, recentRuns: [...exposure.recentRuns, { runId: manifest.id, ordinaryConversationIds: manifest.ordinaryConversationIds, topics: [], behaviorModes: [], interactionPatterns: [], topicCategories: [], firstOrdinaryConversationId: manifest.firstOrdinaryConversationId }].slice(-5) }
      expect(getManifestConversation(manifest.firstOrdinaryConversationId)).toBeDefined()
    }
  })
})
