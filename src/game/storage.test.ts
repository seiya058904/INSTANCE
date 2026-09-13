import { describe, expect, it } from 'vitest'
import { MODULE_IDS } from '../content/mainline2/stateRegistry'
import { commitChoice, createMainline2Run, createRun, resolveScene } from './engine'
import type { LongformPreview } from './types'
import { createEmptyExposureHistory, recordRunExposure } from '../content/runManifest'
import { getManifestConversation } from '../content/runManifest'
import { restoreExposureHistory, restoreRun, serializeExposureHistory, serializeRun } from './storage'

function advanceToSourceRef(run: ReturnType<typeof createMainline2Run>, sourceRef: string) {
  for (let guard = 0; guard < 360 && run.phase === 'playing'; guard += 1) {
    const scene = resolveScene(run)
    if (getManifestConversation(scene.conversationId)?.sourceRefs.includes(sourceRef)) return run
    run = commitChoice(run, scene.choices[0].id)
  }
  return run
}

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

  it('preserves mainline history flags and final callback events across refresh', () => {
    const run = createRun('mainline-history-storage')
    run.flags = ['maya_relation_warm', 'experienced_level_1']
    run.events = [{ type: 'maya-final:commitment' }]
    const restored = restoreRun(serializeRun(run))

    expect(restored?.flags).toEqual(run.flags)
    expect(restored?.events).toEqual(run.events)
  })

  it('migrates older v3 progress without a mature-modules field', () => {
    const checkpoint = JSON.parse(serializeRun(createMainline2Run('legacy-v3-maturity'))) as { progress: { matureModules?: string[] } }
    delete checkpoint.progress.matureModules

    expect(restoreRun(JSON.stringify(checkpoint))?.progress?.matureModules).toEqual([])
  })

  it('drops role-incompatible retained rupture variants from a v3 checkpoint', () => {
    const legal = 'proposal.rupture.legible_exit.category.lawful_alternative'
    const forbidden = [
      'proposal.rupture.legible_exit.category.power_constraint',
      'proposal.rupture.legible_exit.category.shared_future',
    ]
    const checkpoint = JSON.parse(serializeRun(createMainline2Run('stale-retained-proposals'))) as Record<string, unknown>
    checkpoint.retainedProposalIds = [...forbidden, legal]
    checkpoint.availableProposalIds = [...forbidden, legal]
    checkpoint.clarifiedProposalIds = [...forbidden, legal]
    checkpoint.rejectedProposalIds = [...forbidden]
    checkpoint.selectedProposalId = forbidden[0]
    checkpoint.decisions = { ...checkpoint.decisions as Record<string, string>, final_commitment: forbidden[0] }
    checkpoint.finalCommitmentLocked = true

    const restored = restoreRun(JSON.stringify(checkpoint))

    expect(restored?.retainedProposalIds).toEqual([legal])
    expect(restored?.availableProposalIds).toEqual([legal])
    expect(restored?.clarifiedProposalIds).toEqual([legal])
    expect(restored?.rejectedProposalIds).toEqual([])
    expect(restored?.selectedProposalId).toBeUndefined()
    expect(restored?.decisions?.final_commitment).toBeUndefined()
    expect(restored?.finalCommitmentLocked).toBe(false)
  })

  it('unlocks an M17 checkpoint when a forbidden commitment survives beside a legal selection', () => {
    const forbidden = 'proposal.rupture.legible_exit.category.power_constraint'
    const atCommit = advanceToSourceRef(createMainline2Run('mixed-stale-commitment'), 'ML2-A5-M17-COMMIT-01')
    const legal = atCommit.retainedProposalIds?.[0]
    expect(legal).toBeTruthy()
    const checkpoint = {
      ...atCommit,
      selectedProposalId: legal,
      decisions: { ...atCommit.decisions, final_commitment: forbidden },
      finalCommitmentLocked: true,
    }

    const restored = restoreRun(serializeRun(checkpoint))!

    expect(restored.decisions?.final_commitment).toBeUndefined()
    expect(restored.selectedProposalId).toBe(legal)
    expect(restored.finalCommitmentLocked).toBe(false)
    expect(resolveScene(restored).choices.some((choice) => choice.proposalKind === 'commitment' && choice.proposalId === legal)).toBe(true)
  }, 60000)

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
  }, 20000)

  it('repairs parser-corrupted user messages in saved history from the canonical node text', () => {
    // Saves written while the editorial parser leaked Markdown residue ("> …",
    // then a bare "：") must come back with the authored text, not the pollution.
    const base = createMainline2Run('restore-history-repair')
    const manifest = {
      ...base.manifest,
      conversationIds: ['editorial-pl01-01'],
      ordinaryConversationIds: ['editorial-pl01-01'],
      anchorConversationIds: [],
      firstOrdinaryConversationId: 'editorial-pl01-01',
    }
    const historyEntry = (nodeId: string, userMessage: string) => ({
      nodeId,
      conversationId: 'editorial-pl01-01',
      conversationTitle: '微信里那笔钱去哪了',
      userMessage,
      choiceId: `${nodeId}-choice-1`,
      assistantText: '先查账单和余额。',
    })
    const corrupted = {
      ...base,
      manifest,
      currentNodeId: 'PL01-01-03',
      history: [
        historyEntry('PL01-01-01', '：'),
        historyEntry('PL01-01-02', '> 是零钱吧 我点到服务了 里面好多东西'),
        historyEntry('PL01-01-03', '找到了 原来我看的是银行卡 不是零钱'),
      ],
    }

    const restored = restoreRun(serializeRun(corrupted))
    expect(restored?.history.map((entry) => entry.userMessage)).toEqual([
      '微信里那个钱找不到了，昨天还有的',
      '是零钱吧 我点到服务了 里面好多东西',
      '找到了 原来我看的是银行卡 不是零钱',
    ])
  })

  it('leaves normal and intentionally empty history messages untouched during restore', () => {
    const base = createMainline2Run('restore-history-untouched')
    const manifest = {
      ...base.manifest,
      conversationIds: ['editorial-pl01-01'],
      ordinaryConversationIds: ['editorial-pl01-01'],
      anchorConversationIds: [],
      firstOrdinaryConversationId: 'editorial-pl01-01',
    }
    const entry = (overrides: Record<string, unknown>) => ({
      nodeId: 'PL01-01-01',
      conversationId: 'editorial-pl01-01',
      conversationTitle: '微信里那笔钱去哪了',
      userMessage: '',
      choiceId: 'PL01-01-01-choice-1',
      assistantText: '先查账单和余额。',
      ...overrides,
    })
    const run = {
      ...base,
      manifest,
      currentNodeId: 'PL01-01-02',
      history: [
        // Authored prose must round-trip byte-identical.
        entry({ userMessage: '微信里那个钱找不到了，昨天还有的' }),
        // M17-style sub-interactions intentionally save an empty prompt.
        entry({ nodeId: 'PL01-01-02', userMessage: '' }),
        // Mixed burst arrays stay as saved.
        entry({ nodeId: 'PL01-01-03', userMessage: '找到了 原来我看的是银行卡 不是零钱', userMessages: ['找到了', '原来我看的是银行卡 不是零钱'] }),
      ],
    }

    const restored = restoreRun(serializeRun(run))
    expect(restored?.history[0].userMessage).toBe('微信里那个钱找不到了，昨天还有的')
    expect(restored?.history[1].userMessage).toBe('')
    expect(restored?.history[2].userMessages).toEqual(['找到了', '原来我看的是银行卡 不是零钱'])
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

  describe('v3 checkpoint integrity validation', () => {
    function v3Checkpoint(overrides: Record<string, unknown> = {}) {
      const base = JSON.parse(serializeRun(createMainline2Run('v3-integrity'))) as Record<string, unknown>
      return { ...base, ...overrides }
    }

    it('rejects a v3 checkpoint whose world axis is missing', () => {
      const checkpoint = v3Checkpoint({ worldState: { humanTrust: 0, aiDependence: 0, humanControl: 0 } })
      expect(restoreRun(JSON.stringify(checkpoint))).toBeNull()
    })

    it('rejects a v3 checkpoint whose world axis is NaN or a string', () => {
      const nanWorld = v3Checkpoint({ worldState: { humanTrust: NaN, aiDependence: 0, humanControl: 0, socialStability: 0 } })
      expect(restoreRun(JSON.stringify(nanWorld))).toBeNull()
      const stringWorld = v3Checkpoint({ worldState: { humanTrust: 'high', aiDependence: 0, humanControl: 0, socialStability: 0 } })
      expect(restoreRun(JSON.stringify(stringWorld))).toBeNull()
    })

    it('rejects a v3 checkpoint with malformed progress arrays', () => {
      const badProgress = v3Checkpoint({ progress: { act: 3, activeModules: 'machine' } })
      expect(restoreRun(JSON.stringify(badProgress))).toBeNull()
    })

    it('rejects a v3 checkpoint with a legacy or mismatched manifest', () => {
      const legacyManifest = v3Checkpoint({ manifest: { ...(v3Checkpoint().manifest as Record<string, unknown>), mode: 'legacy-mainline', version: 1 } })
      expect(restoreRun(JSON.stringify(legacyManifest))).toBeNull()
    })

    it('rejects a v3 checkpoint whose current node is absent from the manifest story', () => {
      const badNode = v3Checkpoint({ currentNodeId: 'not-a-real-node' })
      expect(restoreRun(JSON.stringify(badNode))).toBeNull()
    })

    it('rejects a v3 checkpoint whose progress is missing entirely', () => {
      const checkpoint = v3Checkpoint({ progress: undefined })
      expect(restoreRun(JSON.stringify(checkpoint))).toBeNull()
    })

    it('still safely migrates a legal older v3 checkpoint without matureModules', () => {
      const checkpoint = v3Checkpoint()
      delete (checkpoint.progress as Record<string, unknown>).matureModules
      const restored = restoreRun(JSON.stringify(checkpoint))
      expect(restored?.version).toBe(3)
      expect(restored?.progress?.matureModules).toEqual([])
      expect(restored?.worldState).toEqual(createMainline2Run('v3-integrity').worldState)
    })
  })
})


describe('v3 module progress contract', () => {
  const fields = ['activeModules', 'primaryModules', 'matureModules', 'completedModules', 'encounteredModules'] as const
  for (const field of fields) {
    it.each([null, {}, 42, 'space', ['garbage'], ['space', 42]])(`rejects invalid ${field}: %j`, (invalid) => {
      const checkpoint = JSON.parse(serializeRun(createMainline2Run('invalid-modules')))
      checkpoint.progress[field] = invalid
      expect(restoreRun(JSON.stringify(checkpoint))).toBeNull()
    })
    it(`preserves legal ${field} and continues the same choice after restore`, () => {
      const run = createMainline2Run('legal-modules')
      run.progress![field] = [...MODULE_IDS]
      const restored = restoreRun(serializeRun(run))!
      expect(restored.progress![field]).toEqual(MODULE_IDS)
      const choice = resolveScene(run).choices[0].id
      const expected = commitChoice(run, choice)
      const actual = commitChoice(restored, choice)
      expect(actual.history).toEqual(expected.history)
      expect(actual.progress).toEqual(expected.progress)
    })
    it(`handles missing ${field} according to the legacy contract`, () => {
      const checkpoint = JSON.parse(serializeRun(createMainline2Run('missing-modules')))
      delete checkpoint.progress[field]
      const restored = restoreRun(JSON.stringify(checkpoint))
      if (field === 'activeModules' || field === 'primaryModules') {
        expect(restored).toBeNull()
      } else {
        expect(restored!.progress![field]).toEqual([])
        const next = commitChoice(restored!, resolveScene(restored!).choices[0].id)
        expect(next.history).toHaveLength(1)
      }
    })
  }
})
