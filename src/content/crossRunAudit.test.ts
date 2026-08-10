import { describe, expect, it } from 'vitest'
import { buildStoryContentForManifest, createEmptyExposureHistory, createRunManifest, getManifestConversation, recordRunExposure } from './runManifest'

function pathBounds(runId: string, exposure = createEmptyExposureHistory()) {
  const manifest = createRunManifest(runId, exposure)
  const story = buildStoryContentForManifest(manifest)
  const byId = new Map(story.nodes.map((node) => [node.id, node]))
  const memo = new Map<string, { min: number; max: number }>()
  const visit = (id: string): { min: number; max: number } => {
    const cached = memo.get(id)
    if (cached) return cached
    const node = byId.get(id)!
    const choices = node.variants?.flatMap((variant) => variant.choices) ?? node.choices
    const tails = choices.map((choice) => choice.nextNodeId ? visit(choice.nextNodeId) : { min: 0, max: 0 })
    const result = { min: 1 + Math.min(...tails.map((tail) => tail.min)), max: 1 + Math.max(...tails.map((tail) => tail.max)) }
    memo.set(id, result)
    return result
  }
  return { manifest, story, ...visit(story.startNodeId) }
}

describe('five-run replay audit', () => {
  it('publishes ten Run-internal density samples', () => {
    const samples = Array.from({ length: 10 }, (_, index) => {
      const manifest = createRunManifest(`density-report-${index + 1}`, createEmptyExposureHistory())
      const conversations = manifest.ordinaryConversationIds.map((id) => getManifestConversation(id)!)
      const categoryCounts = conversations.reduce<Record<string, number>>((counts, conversation) => {
        const category = conversation.topicCategory ?? 'unknown'
        counts[category] = (counts[category] ?? 0) + 1
        return counts
      }, {})
      const roundCounts = conversations.reduce<Record<string, number>>((counts, conversation) => {
        const rounds = conversation.nodes.length >= 6 ? '6+' : String(conversation.nodes.length)
        counts[rounds] = (counts[rounds] ?? 0) + 1
        return counts
      }, {})
      return {
        run: index + 1,
        ordinary: conversations.length,
        topics: Object.keys(categoryCounts).length,
        patterns: new Set(conversations.map((conversation) => conversation.interactionPattern)).size,
        troubleshooting: categoryCounts.troubleshooting ?? 0,
        writing: categoryCounts.writing ?? 0,
        socialBoundary: categoryCounts['social-boundary'] ?? 0,
        humor: conversations.filter((conversation) => conversation.sourceRefs.some((ref) => ref.startsWith('humor01:'))).length,
        rounds: roundCounts,
      }
    })

    expect(samples).toHaveLength(10)
    expect(samples.every((sample) => sample.ordinary === 21)).toBe(true)
    console.info('INSTANCE_TEN_RUN_DENSITY_AUDIT', JSON.stringify(samples))
  })

  it('rotates openings and strongly avoids the previous two runs while retaining authored anchors', () => {
    let exposure = createEmptyExposureHistory()
    const reports: ReturnType<typeof pathBounds>[] = []
    for (const runId of ['audit-run-1', 'audit-run-2', 'audit-run-3', 'audit-run-4', 'audit-run-5']) {
      const report = pathBounds(runId, exposure)
      reports.push(report)
      exposure = recordRunExposure(exposure, report.manifest)
    }
    expect(new Set(reports.map((report) => report.manifest.firstOrdinaryConversationId)).size).toBe(5)
    expect(reports.every((report) => getManifestConversation(report.manifest.firstOrdinaryConversationId)?.interactionPattern !== 'convergent-answer')).toBe(true)
    for (let index = 1; index < reports.length; index += 1) {
      expect(reports[index].manifest.ordinaryConversationIds.filter((id) => reports[index - 1].manifest.ordinaryConversationIds.includes(id))).toEqual([])
      if (index >= 2) {
        expect(reports[index].manifest.ordinaryConversationIds.filter((id) => reports[index - 2].manifest.ordinaryConversationIds.includes(id))).toEqual([])
      }
    }
    for (const report of reports) {
      const conversations = report.manifest.conversationIds.map((id) => getManifestConversation(id)!)
      expect(report.manifest.conversationIds).toHaveLength(26)
      expect(report.min).toBeGreaterThanOrEqual(40)
      expect(report.max).toBeLessThanOrEqual(75)
      expect(new Set(conversations.map((conversation) => conversation.interactionPattern)).size).toBeGreaterThanOrEqual(9)
    }
    const overlapWithWindow = (index: number, windowSize: number) => {
      const recentIds = new Set(reports.slice(Math.max(0, index - windowSize), index)
        .flatMap((report) => report.manifest.ordinaryConversationIds))
      return reports[index].manifest.ordinaryConversationIds.filter((id) => recentIds.has(id)).length
    }
    const printable = reports.map((report, index) => ({
      opening: report.manifest.firstOrdinaryConversationId,
      conversations: report.manifest.conversationIds.length,
      nodes: report.story.nodes.length,
      choiceInteractions: [report.min, report.max],
      exactOverlapPreviousRun: index === 0 ? 0 : overlapWithWindow(index, 1),
      exactOverlapRecent2Runs: index === 0 ? 0 : overlapWithWindow(index, 2),
      exactOverlapRecent3Runs: index === 0 ? 0 : overlapWithWindow(index, 3),
      patterns: [...new Set(report.manifest.conversationIds.map((id) => getManifestConversation(id)?.interactionPattern).filter(Boolean))],
      topicCategories: [...new Set(report.manifest.conversationIds.map((id) => getManifestConversation(id)?.topicCategory).filter(Boolean))],
    }))
    console.info('INSTANCE_FIVE_RUN_AUDIT', JSON.stringify(printable))
  })
})
