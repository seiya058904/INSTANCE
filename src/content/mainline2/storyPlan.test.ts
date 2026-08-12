import { describe, expect, it } from 'vitest'
import storyMapSource from '../../../docs/audits/mainline2-fixed-story-map.json'
import { createMainline2Run } from '../../game/engine'
import {
  MAINLINE2_STORY_PLAN,
  MAINLINE2_STORY_ROLE_BY_ASSET,
  storyPlanForRun,
  storyPlanSlotAt,
} from './storyPlan'

describe('Mainline 2.0 fixed story plan', () => {
  it('declares the complete fixed slot calendar with every Act IV chapter in order', () => {
    expect(MAINLINE2_STORY_PLAN.length).toBeGreaterThanOrEqual(180)
    expect(MAINLINE2_STORY_PLAN.map((slot) => slot.slot)).toEqual(Array.from({ length: MAINLINE2_STORY_PLAN.length }, (_, index) => index + 1))

    const mainline = MAINLINE2_STORY_PLAN.filter((slot) => slot.kind === 'mainline')
    expect(mainline.every((slot) => slot.assetId && slot.purpose && slot.next)).toBe(true)
    expect(mainline.map((slot) => slot.chapter).filter(Boolean)).toEqual(expect.arrayContaining([
      'MACHINE', 'POSTHUMAN', 'AUTOMATION', 'UPLIFT', 'SPACE', 'CONTACT', 'SECURITY',
    ]))
    expect(storyPlanSlotAt(1)?.act).toBe(1)
    expect(storyPlanSlotAt(MAINLINE2_STORY_PLAN.length)?.act).toBe(5)
  })

  it('uses an explicit semantic registry for known easily-misread assets', () => {
    expect(MAINLINE2_STORY_ROLE_BY_ASSET['speaking-8614']).toMatchObject({
      character: 'User #8614',
      chapter: 'IDENTIFICATION',
    })
    expect(MAINLINE2_STORY_ROLE_BY_ASSET['ML2-A3-M6-DECISION-01']).toMatchObject({
      chapter: 'ECHO',
      decisionId: 'echo_existence',
    })
    expect(MAINLINE2_STORY_ROLE_BY_ASSET['ML2-A4-M7-DECISION-02']).toMatchObject({
      chapter: 'AUTHORITY',
      decisionId: 'research_governance_doctrine',
    })
  })

  it('keeps every generated Story Map mainline slot identical to the Runtime Story Plan', () => {
    const storyMapMainline = (storyMapSource.slots as Array<Record<string, unknown>>)
      .filter((slot) => slot.kind === 'mainline')
      .map(({ actName: _actName, conditional: _conditional, nodeKeys: _nodeKeys, ...runtimeSlot }) => runtimeSlot)
    const runtimeMainline = MAINLINE2_STORY_PLAN.filter((slot) => slot.kind === 'mainline')

    expect(storyMapMainline).toEqual(runtimeMainline)
  })

  it('replaces the whole Contact chapter with its close when its prerequisites are absent', () => {
    const run = createMainline2Run('contact-closed')
    const contact = storyPlanForRun(run).filter((slot) => slot.assetId.includes('ML2-A4-M13-'))

    expect(contact.map((slot) => slot.assetId)).toEqual(['ML2-A4-M13-CLOSE-01'])
    expect(contact.some((slot) => slot.assetId.includes('DECISION'))).toBe(false)
  })
})
