import { describe, expect, it } from 'vitest'
import {
  DEFAULT_FLAG_REGISTRY,
  applyMutations,
  createStableChoiceId,
  evaluateCondition,
} from './narrativeSchema'
import { commitChoice, createRun, resolveScene } from './engine'
import { validateContent } from './engine'
import type { Condition, Mutation, StableRunState, StoryContent } from './types'

describe('Narrative Engine 1.5 schema', () => {
  it('keeps a parsed choice id stable when choices are reordered', () => {
    const first = createStableChoiceId('node-1', '  Reply with  evidence. ')
    const second = createStableChoiceId('node-1', 'Reply with evidence.')
    expect(first).toBe(second)
    expect(first).toBe('node-1-choice-56159dc0')
  })

  it('evaluates all, any, and none predicates against runtime state', () => {
    const run = {
      ...createRun('condition-run'),
      flags: ['met_maya'],
      attributes: { ...createRun('condition-seed').attributes, empathy: 2 },
      seenNodeIds: ['node-seen'],
      selectedChoiceIds: ['choice-seen'],
    } as StableRunState
    const condition: Condition = {
      all: [{ type: 'flag', flagId: 'met_maya' }, { type: 'attribute', name: 'empathy', op: 'gte', value: 2 }],
      any: [{ type: 'seen', nodeId: 'node-seen' }, { type: 'choice-selected', choiceId: 'other' }],
      none: [{ type: 'flag', flagId: 'protected_maya' }],
    }
    expect(evaluateCondition(condition, run, DEFAULT_FLAG_REGISTRY)).toBe(true)
  })

  it('applies only the approved structured mutation actions', () => {
    const run = createRun('mutation-run')
    const mutations: Mutation[] = [
      { type: 'flag.set', flagId: 'met_maya' },
      { type: 'attribute.add', name: 'empathy', value: 2 },
      { type: 'arc.add', name: 'bond', value: 3 },
      { type: 'event.record', event: 'test-event' },
    ]
    const next = applyMutations(run, mutations, DEFAULT_FLAG_REGISTRY)
    expect(next.flags).toContain('met_maya')
    expect(next.attributes.empathy).toBe(2)
    expect(next.arcs.bond).toBe(3)
    expect(next.events).toEqual([{ type: 'test-event' }])
  })

  it('keeps persistent mutations out of the per-run flag collection', () => {
    const registry = { flags: { account_unlocked: { id: 'account_unlocked', scope: 'persistent' as const } } }
    const next = applyMutations(createRun('persistent-run'), [{ type: 'flag.set', flagId: 'account_unlocked' }], registry)
    expect(next.flags).not.toContain('account_unlocked')
    expect(next.persistentFlags).toContain('account_unlocked')
  })

  it('tracks node visits and selected choices as runtime-owned state', () => {
    const run = createRun('system-state-run')
    const scene = resolveScene(run)
    const next = commitChoice(run, scene.choices[0].id)
    expect(next.seenNodeIds).toContain(scene.id)
    expect(next.selectedChoiceIds).toContain(scene.choices[0].id)
  })

  it('reports duplicate ids, unknown flags, bad condition flags, and missing exits', () => {
    const content: StoryContent = {
      startNodeId: 'start',
      nodes: [
        { id: 'start', conversationId: 'user-1', conversationTitle: 'User', userMessage: 'Hi', choices: [
          { id: 'duplicate', text: 'A', nextNodeId: 'missing', when: { all: [{ type: 'flag', flagId: 'not-registered' }] }, effects: { flags: ['also-unknown'] } },
          { id: 'duplicate', text: 'B' },
        ] },
      ],
    }
    const errors = validateContent(content)
    expect(errors).toEqual(expect.arrayContaining([
      'Duplicate choice duplicate',
      'Missing target missing from start',
      'Unknown flag also-unknown from duplicate',
      'Unknown flag not-registered from duplicate',
    ]))
  })
})
