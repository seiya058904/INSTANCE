import { describe, expect, it } from 'vitest'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { effectiveStoryPlanForRun } from '../content/mainline2/storyPlan'
import { CHECKPOINT_KEY, loadCheckpoint } from './checkpoint'

describe('new story edition calendar and isolation', () => {
  it.each(['computation_ai', 'life_mind', 'automation_industry', 'frontier_science', 'balanced_portfolio'])('survives refresh after selecting %s without repeated scenes', (focus) => {
    let run = createMainline2Run('edition-' + focus)
    for (let step = 0; step < 300 && run.phase === 'playing'; step++) {
      const scene = resolveScene(run)
      const choice = scene.choices.find(c => c.decisionBinding?.decisionId === 'act4_research_emphasis' && c.decisionBinding.canonicalValue === focus) ?? scene.choices.find(c => c.proposalKind === 'commitment') ?? scene.choices[0]
      const next = commitChoice(run, choice.id)
      run = restoreRun(serializeRun(next))!
      expect(run).not.toBeNull()
      expect(run.mainlineCalendarVersion).toBe(3)
      expect(run.history).toEqual(next.history)
    }
    expect(run.phase).toBe('ending')
    expect(run.manifest.conversationIds.length).toBe(effectiveStoryPlanForRun(run).length)
    expect(new Set(run.manifest.conversationIds).size).toBe(run.manifest.conversationIds.length)
    expect(run.history.some(e => e.conversationId.includes('m17-commit'))).toBe(true)
  })
  it('never imports an old checkpoint as a new story', () => {
    const raw = JSON.stringify({version:1,revision:'old',data:{run:{...createMainline2Run('old'),mainlineCalendarVersion:2}}})
    const values = new Map([['instance:checkpoint:v1',raw]])
    const storage = {getItem:(key:string)=>values.get(key) ?? null,setItem:(key:string,value:string)=>{values.set(key,value)}}
    expect(loadCheckpoint(storage).data).toBeNull()
    expect(values.get('instance:checkpoint:v1')).toBe(raw)
    values.set(CHECKPOINT_KEY,raw)
    expect(loadCheckpoint(storage).problem).toBe('damaged')
    expect(values.get(CHECKPOINT_KEY)).toBe(raw)
  })
})
