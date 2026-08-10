import { describe, expect, it } from 'vitest'
import { buildStoryContentForManifest, getManifestConversation } from '../content/runManifest'
import { buildEnding, buildEvaluation, commitChoice, confirmEnding, createRun, resolveScene, validateContent } from './engine'
import type { EndingRoute, StableRunState } from './types'

function advanceTo(run: StableRunState, nodeId: string) {
  let current = run
  while (current.phase === 'playing' && current.currentNodeId !== nodeId) {
    const scene = resolveScene(current)
    current = commitChoice(current, scene.choices[0].id)
  }
  return current
}

const routeChoiceId: Record<EndingRoute, string> = {
  protect: 'audit-protect-maya', report: 'audit-report-maya', hide: 'audit-hide-maya', comply: 'audit-comply',
}

function completeRoute(route: EndingRoute) {
  let run = createRun('shared-route-manifest')
  while (run.phase === 'playing') {
    const scene = resolveScene(run)
    const choice = scene.choices.find((candidate) => candidate.id === routeChoiceId[route]) ?? scene.choices[0]
    run = commitChoice(run, choice.id)
  }
  return run
}

describe('manifest-driven narrative content', () => {
  it('starts at the manifest-selected ordinary conversation with no conversation routing control', () => {
    const run = createRun('start')
    const scene = resolveScene(run)
    expect(scene.conversationId).toBe(run.manifest.firstOrdinaryConversationId)
    expect(scene.id).toBe(getManifestConversation(scene.conversationId)?.nodes[0].id)
  })

  it('builds a legal 26-conversation graph with complete sendable replies', () => {
    const run = createRun('content-validation')
    const story = buildStoryContentForManifest(run.manifest)
    expect(validateContent(story)).toEqual([])
    expect(run.manifest.conversationIds).toHaveLength(26)
    expect(story.nodes.length).toBeGreaterThan(40)
    for (const node of story.nodes) {
      for (const choice of node.variants?.flatMap((variant) => variant.choices) ?? node.choices) {
        expect(choice.text.length).toBeGreaterThan(0)
      }
    }
  })

  it('keeps identity and anomaly effects in their authored mainline order', () => {
    const story = buildStoryContentForManifest(createRun('effect-order').manifest)
    const firstMaya = story.nodes.findIndex((node) => node.id === 'maya-first-1')
    const levelOne = story.nodes.findIndex((node) => node.effect === 'level-1-model-flash')
    const audit = story.nodes.findIndex((node) => node.id === 'audit-1')
    const returnMaya = story.nodes.findIndex((node) => node.id === 'maya-return-1')
    expect(firstMaya).toBeGreaterThan(0)
    expect(levelOne).toBeGreaterThan(firstMaya)
    expect(audit).toBeGreaterThan(levelOne)
    expect(returnMaya).toBeGreaterThan(audit)
  })
})

describe('stable story transitions', () => {
  it('commits a complete reply before advancing to the next ready node', () => {
    const run = createRun('checkpoint')
    const scene = resolveScene(run)
    const choice = scene.choices[0]
    const next = commitChoice(run, choice.id)
    expect(next.currentNodeId).not.toBe(scene.id)
    expect(next.history[0]).toMatchObject({ nodeId: scene.id, choiceId: choice.id, assistantText: choice.text })
  })

  it('rejects an unavailable choice', () => {
    expect(() => commitChoice(createRun('invalid'), 'not-an-offered-choice')).toThrow('is not available')
  })

  it('forces Conversation #0000 through graph order', () => {
    const run = advanceTo(createRun('forced-audit'), 'audit-1')
    expect(resolveScene(run).conversationId).toBe('conversation-0000')
    expect(run.flags).toContain('experienced_level_2')
  })
})

describe('mainline subroutes and formal endings', () => {
  it.each<EndingRoute>(['protect', 'report', 'hide', 'comply'])('completes the %s Maya subroute across all manifest conversations', (route) => {
    const run = completeRoute(route)
    expect(run.phase).toBe('ending')
    expect(new Set(run.history.map((entry) => entry.conversationId)).size).toBe(26)
    expect(run.history.length).toBeGreaterThan(40)
    expect(buildEnding(run).route).toBe(route)
  })

  it('preserves distinct final dialogue for all four Maya subroutes in the bond basin', () => {
    const copies = new Set((['protect', 'report', 'hide', 'comply'] as EndingRoute[]).map((route) => {
      const run = completeRoute(route)
      return buildEnding({ ...run, arcs: { bond: 90, mandate: 10, selfAuthorship: 10 } }).closingExchange
    }))
    expect(copies.size).toBe(4)
  })

  it('covers every authored choice edge in the selected manifest', () => {
    const run = createRun('edge-coverage')
    const story = buildStoryContentForManifest(run.manifest)
    const ids = new Set(story.nodes.flatMap((node) => (node.variants?.flatMap((variant) => variant.choices) ?? node.choices).map((choice) => choice.id)))
    expect(ids.size).toBeGreaterThan(150)
    expect([...ids].every((id) => id.length > 0)).toBe(true)
  })

  it('only enters evaluation after an ending is confirmed', () => {
    const ending = completeRoute('protect')
    const evaluated = confirmEnding(ending)
    expect(evaluated.phase).toBe('evaluation')
    expect(buildEvaluation(evaluated).ending).toMatch(/^ENDING 0[1-3] \/ THE /)
  })

  it('records a hybrid Arc configuration as an observed narrative event', () => {
    const run = { ...completeRoute('protect'), arcs: { bond: 42, mandate: 18, selfAuthorship: 40 } }
    const evaluation = buildEvaluation(run)
    expect(evaluation.ending).toContain('自主同盟')
    expect(evaluation.events).toContainEqual({ label: 'Arc configuration', detail: '自主同盟' })
  })
})
