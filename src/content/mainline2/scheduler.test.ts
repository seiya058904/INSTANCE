import { describe, expect, it } from 'vitest'
import { ordinaryConversationPool, getManifestConversation } from '../runManifest'
import { createMainline2Run } from '../../game/engine'
import { classifyConversationLanguage } from '../../game/languagePacing'
import { scheduleNextConversationId, updateProgressForSchedule } from './scheduler'
import type { StableRunState } from '../../game/types'

function schedule(runId: string) {
  let run = createMainline2Run(runId)
  for (let guard = 0; guard < 200 && run.manifest.conversationIds.length < 134; guard += 1) {
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
  it('produces different legal schedules for different seeds', () => {
    expect(schedule('seed-a')).not.toEqual(schedule('seed-b'))
  })

  it('keeps mainline schedule length and required anchors stable', () => {
    const ids = schedule('schedule-length')
    expect(ids).toHaveLength(134)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.indexOf('user-1842-first')).toBeLessThan(ids.indexOf('speaking-8614'))
    expect(ids.indexOf('speaking-8614')).toBeLessThan(ids.indexOf('conversation-0000'))
    expect(ids.indexOf('conversation-0000')).toBeLessThan(ids.indexOf('user-1842-return'))
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
    console.log(JSON.stringify({
      runs: schedules.length,
      sequenceDiversity: new Set(schedules.map((ids) => ids.filter((id) => id.startsWith('ml2-authored-')).join('|'))).size,
      maxMajorDecisionStreak: maxMajorDecision,
      maxRecurringParticipantStreak: maxParticipant,
      maxSameTopicStreak: maxTopic,
      maxPureEnglishOrdinaryStreak: maxPureEnglishOrdinary,
      hardDependencyViolations: dependencyViolations,
      missingRequiredAssets: missingRequired,
    }))
    expect(new Set(schedules.map((ids) => ids.join('|'))).size).toBeGreaterThan(1)
    const mainlineSequences = schedules.map((ids) => ids.filter((id) => id.startsWith('ml2-authored-')).join('|'))
    const shutdownSlots = schedules.map((ids) => ids.findIndex((id) => id.includes('ml2-a3-m6-decision-02'))).filter((index) => index >= 0)
    expect(new Set(mainlineSequences).size).toBeGreaterThanOrEqual(20)
    expect(new Set(shutdownSlots).size).toBeGreaterThanOrEqual(2)
    expect(maxMajorDecision).toBeLessThanOrEqual(2)
    expect(missingRequired).toBe(0)
    expect(dependencyViolations).toBe(0)
    expect(maxPureEnglishOrdinary).toBeLessThanOrEqual(2)
  }, 30000)
})
