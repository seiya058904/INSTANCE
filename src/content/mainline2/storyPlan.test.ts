import { describe, expect, it } from 'vitest'
import { MAINLINE2_STORY_PLAN, storyPlanSlotAt } from './storyPlan'

describe('Mainline 2.0 fixed story plan', () => {
  it('declares the complete fixed slot calendar with every Act IV chapter in order', () => {
    expect(MAINLINE2_STORY_PLAN).toHaveLength(134)
    expect(MAINLINE2_STORY_PLAN.map((slot) => slot.slot)).toEqual(Array.from({ length: 134 }, (_, index) => index + 1))

    const mainline = MAINLINE2_STORY_PLAN.filter((slot) => slot.kind === 'mainline')
    expect(mainline.every((slot) => slot.assetId && slot.purpose && slot.next)).toBe(true)
    expect(mainline.map((slot) => slot.chapter).filter(Boolean)).toEqual(expect.arrayContaining([
      'MACHINE', 'POSTHUMAN', 'AUTOMATION', 'UPLIFT', 'SPACE', 'CONTACT', 'SECURITY',
    ]))
    expect(storyPlanSlotAt(1)?.act).toBe(1)
    expect(storyPlanSlotAt(134)?.act).toBe(5)
  })
})
