import { describe, expect, it } from 'vitest'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { scheduleNextConversationId } from '../content/mainline2/scheduler'
import { effectiveStoryPlanForRun, MAINLINE2_STORY_PLAN } from '../content/mainline2/storyPlan'
import { ordinaryConversationPool } from '../content/runManifest'
import type { StableRunState } from './types'

// Pre-a335086 v3 saves predate the calendar marker, so their serialized shape
// simply lacks mainlineCalendarVersion. Stripping the field reproduces that
// shape exactly; serializeRun/restoreRun keep every other field as-is.
function asLegacySave(run: StableRunState): StableRunState {
  const { mainlineCalendarVersion: _legacy, ...rest } = run
  return rest as StableRunState
}

function legacyRestore(run: StableRunState): StableRunState {
  return restoreRun(serializeRun(asLegacySave(run)))!
}

// Drives a real scene graph with the closed-route doctrines pinned (the same
// technique as contactPolicy tests), so the run stays on the contact-closed
// branch exactly like the affected population of old saves.
function driveToLength(seed: StableRunState, targetLength: number, stopAtEnding = false): StableRunState {
  const preferred = ['life_mind', 'shared_expansion']
  let run = seed
  let guard = 0
  while (guard < 900
    && run.phase === 'playing'
    && (stopAtEnding || run.manifest.conversationIds.length < targetLength)) {
    const scene = resolveScene(run)
    const choice = scene.choices.find((candidate) => preferred.some((value) => candidate.id.includes(value)))
      ?? scene.choices[guard % Math.max(1, scene.choices.length)]
    if (!choice) throw new Error(`No legal choice at ${scene.id}`)
    run = commitChoice(run, choice.id)
    guard += 1
  }
  return run
}

const ordinaryIds = new Set(ordinaryConversationPool.map((conversation) => conversation.id))

describe('legacy mainline calendar compatibility (pre-a335086 v3 saves)', () => {
  it('keeps restored legacy saves on the full 190-slot calendar', () => {
    const restored = legacyRestore(driveToLength(asLegacySave(createMainline2Run('legacy-marker')), 10))
    expect(restored?.mainlineCalendarVersion).toBeUndefined()
    expect(effectiveStoryPlanForRun(restored!)).toEqual(MAINLINE2_STORY_PLAN)
    expect(effectiveStoryPlanForRun(restored!)).toHaveLength(190)
    // A fresh run keeps the compressed closed-branch calendar.
    const fresh = createMainline2Run('fresh-marker')
    expect(fresh.mainlineCalendarVersion).toBe(2)
    expect(effectiveStoryPlanForRun(fresh)).toHaveLength(180)
    expect(restoreRun(serializeRun(fresh))?.mainlineCalendarVersion).toBe(2)
  })

  it('a legacy save at manifest length 155 does not jump ahead to Security', () => {
    const restored = legacyRestore(driveToLength(asLegacySave(createMainline2Run('legacy-155')), 155))
    expect(restored?.phase).toBe('playing')
    expect(restored?.manifest.conversationIds).toHaveLength(155)
    const next = scheduleNextConversationId(restored!, ordinaryConversationPool)
    expect(next).toBeDefined()
    // The old calendar slot 156 is a gated Contact scene, which decays to an
    // ordinary conversation on the closed branch. Re-indexing onto the
    // compressed calendar would have produced an M14 Security conversation.
    expect(next).not.toContain('ml2-a4-m14')
    expect(ordinaryIds.has(next!)).toBe(true)
  })

  it('a legacy save at manifest length 179 does not skip ahead to the Final Commitment', () => {
    const restored = legacyRestore(driveToLength(asLegacySave(createMainline2Run('legacy-179')), 179))
    expect(restored?.phase).toBe('playing')
    expect(restored?.manifest.conversationIds).toHaveLength(179)
    const next = scheduleNextConversationId(restored!, ordinaryConversationPool)
    expect(next).toBeDefined()
    expect(next).not.toBe('ml2-authored-ml2-a5-m17-commit-01')
    // The run still plays the whole ACT V sequence and reaches the commitment
    // legally, ending only after the full legacy calendar.
    const final = driveToLength(restored!, 0, true)
    expect(final.phase).toBe('ending')
    expect(final.history.some((entry) => entry.conversationId === 'ml2-authored-ml2-a5-m17-commit-01')).toBe(true)
    expect(final.manifest.conversationIds).toHaveLength(190)
  }, 60000)

  // a335086 shipped the compressed calendar WITHOUT the marker for about
  // 28 minutes. Saves from that window are marker-less but accumulated
  // against the 180-slot plan; the marker strip must happen AFTER playing,
  // which is exactly how that era wrote saves.
  it('an a335086 compressed save at manifest length 155 is inferred as calendar 2 and never repeats Security', () => {
    const compressed = driveToLength(createMainline2Run('a335086-155'), 155)
    expect(compressed.mainlineCalendarVersion).toBe(2)
    expect(compressed.manifest.conversationIds).toContain('ml2-authored-ml2-a4-m14-sec-01')
    const restored = legacyRestore(compressed)
    expect(restored?.mainlineCalendarVersion).toBe(2)
    expect(effectiveStoryPlanForRun(restored!)).toHaveLength(180)
    expect(scheduleNextConversationId(restored!, ordinaryConversationPool)).toBeDefined()
    const final = driveToLength(restored!, 0, true)
    expect(final.phase).toBe('ending')
    expect(final.history.some((entry) => entry.conversationId === 'ml2-authored-ml2-a5-m17-commit-01')).toBe(true)
    expect(final.manifest.conversationIds).toHaveLength(180)
    // The regression re-indexed this save onto the legacy plan, re-selected
    // the already-played Security conversation, and appendMainline2Conversation
    // silently dropped it - an infinite progression loop. It must appear once.
    expect(final.manifest.conversationIds.filter((id) => id === 'ml2-authored-ml2-a4-m14-sec-01')).toHaveLength(1)
    expect(final.manifest.conversationIds.length).toBe(new Set(final.manifest.conversationIds).size)
  }, 60000)

  it('an a335086 compressed save at manifest length 179 goes straight to the Final Commitment without repeats', () => {
    const compressed = driveToLength(createMainline2Run('a335086-179'), 179)
    const restored = legacyRestore(compressed)
    expect(restored?.mainlineCalendarVersion).toBe(2)
    const next = scheduleNextConversationId(restored!, ordinaryConversationPool)
    expect(next).toBe('ml2-authored-ml2-a5-m17-commit-01')
    const final = driveToLength(restored!, 0, true)
    expect(final.phase).toBe('ending')
    expect(final.manifest.conversationIds).toHaveLength(180)
    expect(final.manifest.conversationIds.length).toBe(new Set(final.manifest.conversationIds).size)
  }, 60000)

  it('an early a335086 compressed save is conservatively kept on the legacy calendar and still completes', () => {
    // Before the post-Contact region the two eras are indistinguishable;
    // inference must stay legacy (pacing-only regression, no progression risk)
    // because the compressed manifest has not collected the discriminator
    // positions yet.
    const compressed = driveToLength(createMainline2Run('a335086-150'), 150)
    expect(compressed.manifest.conversationIds).not.toContain('ml2-authored-ml2-a4-m14-sec-01')
    const restored = legacyRestore(compressed)
    expect(restored?.mainlineCalendarVersion).toBeUndefined()
    const final = driveToLength(restored!, 0, true)
    expect(final.phase).toBe('ending')
    expect(final.history.some((entry) => entry.conversationId === 'ml2-authored-ml2-a5-m17-commit-01')).toBe(true)
    expect(final.manifest.conversationIds.length).toBe(new Set(final.manifest.conversationIds).size)
  }, 60000)

  it('a legacy save past manifest length 180 does not end prematurely', () => {
    const restored = legacyRestore(driveToLength(asLegacySave(createMainline2Run('legacy-182')), 182))
    // Under the regression, scheduling at length >= 180 returned undefined
    // and the very next commit forced phase 'ending'.
    expect(restored?.phase).toBe('playing')
    expect(restored?.manifest.conversationIds).toHaveLength(182)
    expect(scheduleNextConversationId(restored!, ordinaryConversationPool)).toBeDefined()
    const final = driveToLength(restored!, 0, true)
    expect(final.phase).toBe('ending')
    expect(final.history.some((entry) => entry.conversationId === 'ml2-authored-ml2-a5-m17-commit-01')).toBe(true)
    expect(final.manifest.conversationIds).toHaveLength(190)
  }, 60000)
})
