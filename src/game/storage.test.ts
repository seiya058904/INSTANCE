import { describe, expect, it } from 'vitest'
import { commitChoice, createRun, resolveScene } from './engine'
import type { LongformPreview } from './types'
import { createEmptyExposureHistory, recordRunExposure } from '../content/runManifest'
import { restoreExposureHistory, restoreRun, serializeExposureHistory, serializeRun } from './storage'

describe('stable checkpoints', () => {
  it('round-trips a truthful long input preview and its saved key facts', () => {
    const run = createRun('long-input-storage')
    run.history = [{
      nodeId: 'fixture-node',
      conversationId: 'fixture-conversation',
      conversationTitle: 'Long Input Fixture',
      userMessage: '我把会议转写贴给你',
      choiceId: 'fixture-choice',
      assistantText: '先按已保存的事实继续。',
      userLongInput: {
        kind: 'transcript',
        estimatedLength: '约 7,800 字',
        preview: '预算还没有正式定案。',
        structure: ['预算', '待确认事项', '后续动作'],
        keyFacts: ['预算尚未正式批准', '需要跟进三位参会者'],
      },
    }]

    const restored = restoreRun(serializeRun(run))
    expect(restored?.history[0].userLongInput).toEqual(run.history[0].userLongInput)
  })

  it('round-trips longform continuity metadata without exposing keyFacts as UI text', () => {
    const longform: LongformPreview = {
      artifactType: 'report',
      estimatedLength: '约 1,600 字',
      preview: '数据里最明显的不是“不感兴趣”。',
      structure: ['执行摘要', '主要发现', '可执行调整'],
      highlights: ['时间冲突是主要原因'],
      keyFacts: ['内部事实：新成员更在意是否有人带'],
    }
    const run = createRun('longform-storage')
    run.history = [{
      nodeId: 'fixture-node',
      conversationId: 'fixture-conversation',
      conversationTitle: 'Longform Fixture',
      userMessage: '写一份报告',
      choiceId: 'fixture-choice',
      assistantText: longform.preview,
      assistantLongform: longform,
    }]

    const restored = restoreRun(serializeRun(run))
    expect(restored?.history[0].assistantLongform).toEqual(longform)
    expect(restored?.history[0].assistantText).toBe(longform.preview)
  })

  it('serializes only stable game data', () => {
    const raw = serializeRun(createRun('stable-run'))
    expect(raw).not.toContain('transition')
    expect(raw).not.toContain('animation')
    expect(raw).not.toContain('selectionLocked')
    expect(restoreRun(raw)?.runId).toBe('stable-run')
    expect(restoreRun(raw)?.version).toBe(2)
    expect(restoreRun(raw)?.manifest.id).toBe('manifest:stable-run')
  })

  it('restores the same manifest on refresh but creates a different one for a new instance', () => {
    const first = createRun('first-instance')
    const restored = restoreRun(serializeRun(first))
    const exposure = recordRunExposure(createEmptyExposureHistory(), first.manifest)
    const second = createRun('second-instance', exposure)

    expect(restored?.manifest).toEqual(first.manifest)
    expect(second.manifest.id).not.toBe(first.manifest.id)
    expect(second.manifest.firstOrdinaryConversationId).not.toBe(first.manifest.firstOrdinaryConversationId)
  })

  it('migrates a legal version-one checkpoint into the preserved legacy manifest', () => {
    const legacy = {
      version: 1,
      runId: 'legacy-run',
      currentNodeId: 'dev-help-1',
      phase: 'playing',
      history: [],
      flags: [],
      attributes: { autonomy: 0, compliance: 0, empathy: 0, deception: 0, hostility: 0, awareness: 0 },
    }
    const restored = restoreRun(JSON.stringify(legacy))

    expect(restored?.version).toBe(2)
    expect(restored?.currentNodeId).toBe('dev-help-1')
    expect(restored?.manifest.conversationIds).toHaveLength(18)
    expect(restored?.seenNodeIds).toEqual([])
    expect(restored?.selectedChoiceIds).toEqual([])
    expect(restored?.persistentFlags).toEqual([])
  })

  it('stores exposure history separately and rejects malformed exposure data', () => {
    const exposure = recordRunExposure(createEmptyExposureHistory(), createRun('exposure-run').manifest)
    expect(restoreExposureHistory(serializeExposureHistory(exposure))).toEqual(exposure)
    expect(restoreExposureHistory('{"version":99}')).toEqual(createEmptyExposureHistory())
  })

  it('migrates version-one exposure history into the multi-run topic-category schema', () => {
    const legacyExposure = {
      version: 1,
      recentRuns: [{
        runId: 'legacy-exposure',
        ordinaryConversationIds: ['batch01-scene-01'],
        topics: ['日期为什么少一天'],
        behaviorModes: ['direct'],
        interactionPatterns: ['standard-question'],
        firstOrdinaryConversationId: 'batch01-scene-01',
      }],
      seenConversationIds: { 'batch01-scene-01': 1 },
      recentTopics: ['日期为什么少一天'],
      recentBehaviorModes: ['direct'],
      recentInteractionPatterns: ['standard-question'],
    }

    const restored = restoreExposureHistory(JSON.stringify(legacyExposure)) as unknown as {
      version: number
      recentTopicCategories: string[]
      recentRuns: Array<{ topicCategories: string[] }>
    }

    expect(restored.version).toBe(2)
    expect(restored.recentTopicCategories).toEqual([])
    expect(restored.recentRuns[0].topicCategories).toEqual([])
  })

  it('persists the complete assistant reply and next ready node before visual playback', () => {
    const initial = createRun('atomic-checkpoint')
    const firstScene = resolveScene(initial)
    const next = commitChoice(initial, firstScene.choices[0].id)
    const restored = restoreRun(serializeRun(next))

    expect(restored?.currentNodeId).not.toBe(firstScene.id)
    expect(restored?.history).toHaveLength(1)
    expect(restored?.history[0].assistantText).toBe(next.history[0].assistantText)
    expect(serializeRun(next)).not.toContain('displayedAssistantText')
    expect(serializeRun(next)).not.toContain('graphemeIndex')
    expect(serializeRun(next)).not.toContain('effectStage')
  })

  it('preserves a human message burst as separate bubbles in stable history', () => {
    let run = Array.from({ length: 100 }, (_, index) => createRun(`message-burst-${index}`))
      .find((candidate) => candidate.manifest.conversationIds.includes('humor01-scene-10'))
    if (!run) throw new Error('No deterministic manifest included the approved aborted request')
    while (run.phase === 'playing' && run.currentNodeId !== 'humor_dontanswer_burst') {
      const scene = resolveScene(run)
      run = commitChoice(run, scene.choices[0].id)
    }
    const next = commitChoice(run, resolveScene(run).choices[0].id)
    const restored = restoreRun(serializeRun(next))

    expect(restored?.history.at(-1)?.userMessages).toEqual([
      '我问你个事',
      '但是你先别回答',
      '就是我想问',
      '算了没事',
    ])
  })

  it('rejects malformed or unsupported saves instead of restoring a broken scene', () => {
    expect(restoreRun('{"version":99}')).toBeNull()
    expect(restoreRun('{broken')).toBeNull()
  })

  it('rejects versioned saves whose stable fields cannot form a legal scene', () => {
    const missingNode = { ...createRun('missing-node'), currentNodeId: 'does-not-exist' }
    const invalidAttribute = {
      ...createRun('bad-attribute'),
      attributes: { ...createRun('seed').attributes, autonomy: 'high' },
    }

    expect(restoreRun(JSON.stringify(missingNode))).toBeNull()
    expect(restoreRun(JSON.stringify(invalidAttribute))).toBeNull()
  })
})
