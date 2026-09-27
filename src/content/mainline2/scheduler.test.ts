import { describe, expect, it } from 'vitest'
import { ordinaryConversationPool, getManifestConversation, createEmptyExposureHistory, recordRunExposure } from '../runManifest'
import { createMainline2Run, commitChoice, resolveScene } from '../../game/engine'
import { classifyConversationLanguage } from '../../game/languagePacing'
import { auditMainlineSchedules, scheduleNextConversationId, selectAct4Modules, updateProgressForSchedule } from './scheduler'
import { MAINLINE2_STORY_PLAN, effectiveStoryPlanForRun, type MainlineStoryPlanSlot } from './storyPlan'
import type { ConversationDefinition, StableRunState } from '../../game/types'

function scheduleFrom(seed: StableRunState) {
  const plan = effectiveStoryPlanForRun(seed)
  let run = seed
  for (let guard = 0; guard < plan.length + 20 && run.manifest.conversationIds.length < plan.length; guard += 1) {
    const nextId = scheduleNextConversationId(run, ordinaryConversationPool)
    if (!nextId) break
    const conversationIds = [...run.manifest.conversationIds, nextId]
    const ordinaryConversationIds = conversationIds.filter((id) => !run.manifest.anchorConversationIds.includes(id))
    run = {
      ...run,
      manifest: { ...run.manifest, conversationIds, ordinaryConversationIds },
      progress: updateProgressForSchedule(run, conversationIds.length),
    } as StableRunState
  }
  return run.manifest.conversationIds
}

function schedule(runId: string) {
  return scheduleFrom(createMainline2Run(runId))
}

// A run whose state already satisfies the canonical Contact prerequisites, so
// the scheduler keeps the full 190-slot calendar including the Contact chapter.
function contactOpenRun(runId: string): StableRunState {
  const base = createMainline2Run(runId)
  return {
    ...base,
    flags: [...base.flags, 'cap.space_resource_network'],
    events: [{ type: 'contact-seed:deep-space-anomaly' }],
    decisions: { ...base.decisions, act4_research_emphasis: 'frontier_science' },
  } as StableRunState
}

const ordinaryPoolIds = new Set(ordinaryConversationPool.map((conversation) => conversation.id))

function maxConsecutiveOrdinary(ids: readonly string[]) {
  let maximum = 0
  let current = 0
  for (const id of ids) {
    current = ordinaryPoolIds.has(id) ? current + 1 : 0
    maximum = Math.max(maximum, current)
  }
  return maximum
}

function conversationTraits(ids: readonly string[]) {
  const ordinaryIds = new Set(ordinaryConversationPool.map((conversation) => conversation.id))
  return ids.map((id) => {
    const conversation = getManifestConversation(id)
    const messages = conversation?.nodes.flatMap((node) => node.userMessages ?? [node.userMessage]) ?? []
    return {
      id,
      participant: id.includes('-lsh-') ? 'lin-shaoheng' : id === 'user-1842-first' || id === 'user-1842-return' ? 'user-1842' : id,
      topic: conversation?.topic ?? id,
      language: classifyConversationLanguage(messages),
      ordinary: ordinaryIds.has(id),
    }
  })
}

function maxStreak<T>(values: readonly T[], same: (left: T, right: T) => boolean) {
  let maximum = values.length ? 1 : 0
  let current = maximum
  for (let index = 1; index < values.length; index += 1) {
    current = same(values[index - 1], values[index]) ? current + 1 : 1
    maximum = Math.max(maximum, current)
  }
  return maximum
}

describe('Mainline 2.0 scheduler polish', () => {
  it('keeps the Mainline trace fixed while different runIds vary only Ordinary slots', () => {
    const left = schedule('seed-a')
    const right = schedule('seed-b')
    const plan = effectiveStoryPlanForRun(createMainline2Run('seed-a'))
    const mainlineIndexes = plan.flatMap((slot, index) => slot.kind === 'mainline' && !slot.assetId.startsWith('ML2-A4-M13-') ? [index] : [])
    const ordinaryIndexes = plan.flatMap((slot, index) => slot.kind === 'ordinary' ? [index] : [])

    expect(mainlineIndexes.map((index) => left[index])).toEqual(mainlineIndexes.map((index) => right[index]))
    expect(ordinaryIndexes.some((index) => left[index] !== right[index])).toBe(true)
  })

  it('keeps mainline schedule length and required anchors stable', () => {
    const ids = schedule('schedule-length')
    const closedPlan = effectiveStoryPlanForRun(createMainline2Run('schedule-length'))
    expect(ids).toHaveLength(closedPlan.length)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.indexOf('user-1842-first')).toBeLessThan(ids.indexOf('speaking-8614'))
    expect(ids.indexOf('speaking-8614')).toBeLessThan(ids.indexOf('conversation-0000'))
    expect(ids.indexOf('conversation-0000')).toBeLessThan(ids.indexOf('user-1842-return'))
    expect(ids.some((id) => id === 'ml2-authored-ml2-a4-m13-nocontact-01')).toBe(true)
    expect(ids.some((id) => id.startsWith('ml2-authored-ml2-a4-m13-') && !id.includes('nocontact'))).toBe(false)

    const openIds = scheduleFrom(contactOpenRun('schedule-length-open'))
    expect(openIds).toHaveLength(MAINLINE2_STORY_PLAN.length)
    expect(openIds.some((id) => id === 'ml2-authored-ml2-a4-m13-contact-01')).toBe(true)
  })

  it('caps the contact-closed ordinary vacuum between the bridge and Security', () => {
    const ids = schedule('vacuum-regression')
    const bridgeIndex = ids.findIndex((id) => id === 'ml2-authored-ml2-a4-m13-nocontact-01')
    const securityIndex = ids.findIndex((id) => id.includes('ml2-a4-m14-sec-01'))
    expect(bridgeIndex).toBeGreaterThan(-1)
    expect(securityIndex).toBeGreaterThan(bridgeIndex)
    const between = ids.slice(bridgeIndex + 1, securityIndex)
    expect(between.length).toBeGreaterThan(0)
    expect(between.length).toBeLessThanOrEqual(4)
    expect(between.every((id) => ordinaryPoolIds.has(id))).toBe(true)
    // The closed branch must never again decay into a twelve-ordinary run.
    expect(maxConsecutiveOrdinary(ids)).toBeLessThanOrEqual(6)
  })

  it('derives civilization maturity from state rather than runId', () => {
    const state = {
      flags: ['cap.persistent_subinstances', 'cap.space_resource_network'],
      events: [{ type: 'contact-seed:deep-space-anomaly' }, { type: 'history.space.frontier_maturity' }],
      decisions: { act4_research_emphasis: 'frontier_science', replication_doctrine: 'free_replication' },
      worldState: { humanTrust: 1, aiDependence: 1, humanControl: 0, socialStability: 0 },
    }
    const left = selectAct4Modules({ ...state, runId: 'ordinary-seed-a' })
    const right = selectAct4Modules({ ...state, runId: 'ordinary-seed-b' })
    expect(left.activeModules).toEqual(right.activeModules)
    expect(left.primaryModules).toEqual(right.primaryModules)
    expect(left.matureModules).toEqual(right.matureModules)
    expect(left.matureModules.every((module) => left.activeModules.includes(module))).toBe(true)
  })

  it('does not turn synthetic base eligibility into an active or mature module', () => {
    const empty = selectAct4Modules({
      runId: 'ordinary-seed-only',
      flags: [],
      events: [],
      decisions: {},
      worldState: { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 },
    })

    expect(empty.activeModules).toEqual([])
    expect(empty.matureModules).toEqual([])
  })

  it('avoids three consecutive pure-English ordinary conversations when alternatives exist', () => {
    const traits = conversationTraits(schedule('language-seed'))
    for (let index = 2; index < traits.length; index += 1) {
      const window = traits.slice(index - 2, index + 1)
      if (window.every((item) => item.ordinary)) expect(window.map((item) => item.language)).not.toEqual(['pure-english', 'pure-english', 'pure-english'])
    }
  })

  it('avoids unnecessary three-conversation participant and topic streaks', () => {
    const traits = conversationTraits(schedule('pacing-seed'))
    for (let index = 2; index < traits.length; index += 1) {
      const window = traits.slice(index - 2, index + 1)
      if (window.every((item) => item.ordinary)) {
        expect(new Set(window.map((item) => item.participant)).size).not.toBe(1)
        expect(new Set(window.map((item) => item.topic)).size).not.toBe(1)
      }
    }
  })

  it('prints the 100-seed deterministic scheduler audit', () => {
    const schedules = Array.from({ length: 100 }, (_, index) => schedule(`audit-${String(index).padStart(3, '0')}`))
    const traits = schedules.map(conversationTraits)
    const requiredIds = ['user-7391', 'user-1842-first', 'speaking-8614', 'conversation-0000', 'user-1842-return', 'ml2-authored-ml2-a5-m16-0000-01', 'ml2-authored-ml2-a5-m17-commit-01']
    const maxPureEnglishOrdinary = Math.max(...traits.map((items) => {
      let maximum = 0
      let current = 0
      for (const item of items) {
        current = item.ordinary && item.language === 'pure-english' ? current + 1 : 0
        maximum = Math.max(maximum, current)
      }
      return maximum
    }))
    const maxMajorDecision = Math.max(...traits.map((items) => {
      let maximum = 0
      let current = 0
      for (const item of items) {
        current = item.id.includes('-decision-') ? current + 1 : 0
        maximum = Math.max(maximum, current)
      }
      return maximum
    }))
    const maxParticipant = Math.max(...traits.map((items) => maxStreak(items, (left, right) => left.participant === right.participant)))
    const maxTopic = Math.max(...traits.map((items) => maxStreak(items, (left, right) => left.topic === right.topic)))
    const missingRequired = schedules.filter((ids) => requiredIds.some((id) => !ids.includes(id))).length
    const dependencyViolations = schedules.filter((ids) => !(
      ids.indexOf('user-1842-first') < ids.indexOf('speaking-8614')
      && ids.indexOf('speaking-8614') < ids.indexOf('conversation-0000')
      && ids.indexOf('conversation-0000') < ids.indexOf('user-1842-return')
    )).length
    expect(new Set(schedules.map((ids) => ids.join('|'))).size).toBeGreaterThan(1)
    const unconditionalMainlineIds = new Set(MAINLINE2_STORY_PLAN.filter((slot): slot is MainlineStoryPlanSlot => slot.kind === 'mainline' && !slot.requires).map((slot) => slot.conversationId))
    const mainlineSequences = schedules.map((ids) => ids.filter((id) => unconditionalMainlineIds.has(id)).join('|'))
    const shutdownSlots = schedules.map((ids) => ids.findIndex((id) => id.includes('ml2-a3-m6-decision-02'))).filter((index) => index >= 0)
    expect(new Set(mainlineSequences).size).toBe(1)
    expect(new Set(shutdownSlots).size).toBe(1)
    expect(maxMajorDecision).toBeLessThanOrEqual(2)
    expect(missingRequired).toBe(0)
    expect(dependencyViolations).toBe(0)
    expect(maxPureEnglishOrdinary).toBeLessThanOrEqual(2)
    expect(Math.max(...schedules.map(maxConsecutiveOrdinary))).toBeLessThanOrEqual(6)
  }, 30000)

  it('reports complete scheduler audit fields including CONTACT and spacing exceptions', () => {
    const schedules = Array.from({ length: 100 }, (_, index) => schedule(`audit-fields-${String(index).padStart(3, '0')}`))
    const closedPlan = effectiveStoryPlanForRun(createMainline2Run('audit-fields-000'))
    const audit = auditMainlineSchedules(schedules, schedules.map(() => closedPlan))
    expect(schedules.every((ids) => ids.every((id) => !id.includes('ml2-a4-m13-contact')))).toBe(true)
    expect(audit.contactViolations).toBe(0)
    expect(audit.hardDependencyViolations).toBe(0)
    expect(audit.missingRequiredAssets).toBe(0)
    expect(audit.maxMajorDecisionStreak).toBeLessThanOrEqual(2)
    expect(audit.maxParticipantStreak).toBeLessThanOrEqual(2)
    expect(audit.maxTopicStreak).toBeLessThanOrEqual(2)
    expect(audit.maxPureEnglishStreak).toBeLessThanOrEqual(2)
    expect(audit.invalidSpacingExceptions).toEqual([])
    expect(audit.uniqueMainlineSequences).toBe(1)
    expect(audit.shutdownDistinctSlots).toBe(1)
  }, 30000)
})

function advanceToSlot(run: StableRunState, targetConversationCount: number) {
  let current = run
  let guard = 0
  while (current.manifest.conversationIds.length < targetConversationCount && current.phase === 'playing' && guard < 60) {
    const scene = resolveScene(current)
    current = commitChoice(current, scene.choices[0].id)
    guard += 1
  }
  return current
}

// Minimal synthetic ordinary pool for exposure tests: both candidates are
// fresh (never present in the current run manifest), share no participant /
// topic / language overlap with the recent mainline window, and therefore
// start with an identical primary score of zero.
function syntheticConversation(id: string): ConversationDefinition {
  return {
    id,
    sourceRefs: [`synthetic:${id}`],
    behaviorModes: ['direct'],
    handoffProfile: 'quick',
    turnShape: 'single',
    topic: `${id}-topic`,
    interactionPattern: 'standard-question',
    nodes: [{
      id: `${id}-n1`,
      conversationId: id,
      conversationTitle: `Synthetic ${id}`,
      userMessage: '帮我看看这个问题该怎么处理。',
      userMessages: ['帮我看看这个问题该怎么处理。'],
      choices: [{ id: `${id}-c1`, text: '好的，我先看一下。' }],
    }],
  }
}

const SYNTHETIC_POOL = [syntheticConversation('synth-a'), syntheticConversation('synth-b')]

describe('cross-run ordinary exposure downweighting', () => {
  // Slot 10 is the first ordinary breathing slot in the 190-slot plan.
  const FIRST_ORDINARY_SLOT = 10

  it('A: a completed run records its actually played ordinary conversations and the next run reads them', () => {
    let run = createMainline2Run('record-run-a')
    run = advanceToSlot(run, FIRST_ORDINARY_SLOT)
    expect(run.manifest.ordinaryConversationIds.length).toBeGreaterThan(0)
    const exposure = recordRunExposure(createEmptyExposureHistory(), run.manifest)
    expect(exposure.recentRuns.at(-1)?.ordinaryConversationIds).toEqual(run.manifest.ordinaryConversationIds)
    const nextRun = createMainline2Run('record-run-a-next', exposure)
    expect(nextRun.priorOrdinaryExposure).toEqual(expect.arrayContaining(run.manifest.ordinaryConversationIds))
  })

  it('B1: without prior exposure the synthetic winner is a fresh candidate', () => {
    const atSlot = advanceToSlot(createMainline2Run('downweight-seed-b1'), FIRST_ORDINARY_SLOT)
    // The candidate under test must NOT already be part of the current run's
    // manifest, otherwise scheduledIds would exclude it regardless of exposure.
    for (const candidate of SYNTHETIC_POOL) {
      expect(atSlot.manifest.conversationIds.includes(candidate.id)).toBe(false)
    }
    const winner = scheduleNextConversationId(atSlot, SYNTHETIC_POOL)
    expect(SYNTHETIC_POOL.map((c) => c.id)).toContain(winner)
  })

  it('B2: identical state except priorOrdinaryExposure=[winner] flips the pick to the other candidate', () => {
    const atSlot = advanceToSlot(createMainline2Run('downweight-seed-b2'), FIRST_ORDINARY_SLOT)
    const winner = scheduleNextConversationId(atSlot, SYNTHETIC_POOL)!
    const other = SYNTHETIC_POOL.map((c) => c.id).find((id) => id !== winner)!
    const withExposure = scheduleNextConversationId({ ...atSlot, priorOrdinaryExposure: [winner] }, SYNTHETIC_POOL)
    expect(withExposure).toBe(other)
  })

  it('B3: the same runId + same exposure input reproduces the same pick', () => {
    const atSlot = advanceToSlot(createMainline2Run('downweight-seed-b3'), FIRST_ORDINARY_SLOT)
    const first = scheduleNextConversationId({ ...atSlot, priorOrdinaryExposure: ['synth-a'] }, SYNTHETIC_POOL)
    const second = scheduleNextConversationId({ ...atSlot, priorOrdinaryExposure: ['synth-a'] }, SYNTHETIC_POOL)
    expect(first).toBe(second)
  })

  it('C: same runId + same exposure input yields the same ordinary sequence', () => {
    const run = createMainline2Run('deterministic-exposure')
    const atSlot = advanceToSlot(run, FIRST_ORDINARY_SLOT)
    const first = scheduleNextConversationId(atSlot, ordinaryConversationPool)
    const second = scheduleNextConversationId({ ...atSlot, priorOrdinaryExposure: ['batch01-scene-01'] }, ordinaryConversationPool)
    const third = scheduleNextConversationId({ ...atSlot, priorOrdinaryExposure: ['batch01-scene-01'] }, ordinaryConversationPool)
    expect(second).toBe(third)
    expect(first).toBe(scheduleNextConversationId(atSlot, ordinaryConversationPool))
  })

  it('D: creating a new run does not fabricate a fake empty completed-exposure run', () => {
    const fresh = createEmptyExposureHistory()
    const run = createMainline2Run('fresh-run-d')
    expect(run.manifest.ordinaryConversationIds).toEqual([])
    const recorded = recordRunExposure(fresh, run.manifest)
    expect(recorded).toEqual(fresh)
  })
})
