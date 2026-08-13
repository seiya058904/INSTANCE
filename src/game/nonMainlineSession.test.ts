import { describe, expect, it } from 'vitest'
import { createEmptyExposureHistory, getManifestConversation } from '../content/runManifest'
import {
  commitNonMainlineChoice,
  createNonMainlineSession,
  nonMainlineCompletedCount,
  resolveNonMainlineScene,
} from './nonMainlineSession'

function placeMultiNodeConversationAt(session: ReturnType<typeof createNonMainlineSession>, targetIndex: number) {
  const sourceIndex = session.selectedConversationIds.findIndex((id) => {
    const definition = getManifestConversation(id)
    return Boolean(definition && definition.nodes.length > 1
      && definition.nodes[0].choices.some((choice) => choice.continuation !== 'end-conversation'))
  })
  expect(sourceIndex).toBeGreaterThanOrEqual(0)
  const selectedConversationIds = [...session.selectedConversationIds]
  const [conversationId] = selectedConversationIds.splice(sourceIndex, 1)
  selectedConversationIds.splice(targetIndex, 0, conversationId)
  const definition = getManifestConversation(conversationId)!
  return {
    ...session,
    selectedConversationIds,
    currentConversationIndex: targetIndex,
    currentNodeId: definition.nodes[0].id,
  }
}

describe('Non-Mainline session engine', () => {
  it('keeps multi-node progress inside the current conversation until it completes', () => {
    const created = createNonMainlineSession('multi-node', createEmptyExposureHistory())
    const index = created.selectedConversationIds.findIndex((id) => (getManifestConversation(id)?.nodes.length ?? 0) > 1)
    expect(index).toBeGreaterThanOrEqual(0)
    const definition = getManifestConversation(created.selectedConversationIds[index])!
    const session = { ...created, currentConversationIndex: index, currentNodeId: definition.nodes[0].id }
    const scene = resolveNonMainlineScene(session)

    const next = commitNonMainlineChoice(session, scene.choices[0].id)

    expect(next.phase).toBe('playing')
    expect(next.currentConversationIndex).toBe(index)
    expect(next.currentNodeId).not.toBe(scene.id)
  })

  it('increments progress only when the current conversation completes', () => {
    const created = createNonMainlineSession('conversation-progress', createEmptyExposureHistory())
    let current = placeMultiNodeConversationAt(created, 11)
    const firstScene = resolveNonMainlineScene(current)
    const continuingChoice = firstScene.choices.find((choice) => choice.continuation !== 'end-conversation')!

    current = commitNonMainlineChoice(current, continuingChoice.id)

    expect(current.currentConversationIndex).toBe(11)
    expect(nonMainlineCompletedCount(current)).toBe(11)

    for (let guard = 0; guard < 20 && current.currentConversationIndex === 11; guard += 1) {
      const scene = resolveNonMainlineScene(current)
      current = commitNonMainlineChoice(current, scene.choices[0].id)
    }

    expect(current.currentConversationIndex).toBe(12)
    expect(nonMainlineCompletedCount(current)).toBe(12)
  })

  it('waits for the final node of a multi-node 40th conversation before evaluation', () => {
    const created = createNonMainlineSession('multi-node-fortieth', createEmptyExposureHistory())
    let current = placeMultiNodeConversationAt(created, 39)
    const firstScene = resolveNonMainlineScene(current)
    const continuingChoice = firstScene.choices.find((choice) => choice.continuation !== 'end-conversation')!

    current = commitNonMainlineChoice(current, continuingChoice.id)

    expect(current.phase).toBe('playing')
    expect(current.currentConversationIndex).toBe(39)
    expect(nonMainlineCompletedCount(current)).toBe(39)

    for (let guard = 0; guard < 20 && current.phase === 'playing'; guard += 1) {
      const scene = resolveNonMainlineScene(current)
      current = commitNonMainlineChoice(current, scene.choices[0].id)
    }

    expect(current.phase).toBe('evaluation')
    expect(current.currentNodeId).toBe('evaluation')
    expect(nonMainlineCompletedCount(current)).toBe(40)
  })

  it('enters evaluation after the 40th conversation and never exposes an ending phase', () => {
    let session = createNonMainlineSession('complete-session', createEmptyExposureHistory())
    for (let guard = 0; guard < 300 && session.phase === 'playing'; guard += 1) {
      const scene = resolveNonMainlineScene(session)
      session = commitNonMainlineChoice(session, scene.choices[0].id)
    }

    expect(session.phase).toBe('evaluation')
    expect(session.currentNodeId).toBe('evaluation')
    expect(session.currentConversationIndex).toBe(39)
    expect(session.choiceRecords.length).toBeGreaterThanOrEqual(40)
    expect((session as { phase: string }).phase).not.toBe('ending')
  })
})
