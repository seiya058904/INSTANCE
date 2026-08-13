import { describe, expect, it } from 'vitest'
import { createEmptyExposureHistory, getManifestConversation } from '../content/runManifest'
import {
  commitNonMainlineChoice,
  createNonMainlineSession,
  resolveNonMainlineScene,
} from './nonMainlineSession'

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
    const session = createNonMainlineSession('conversation-progress', createEmptyExposureHistory())
    let current = session
    const startingIndex = current.currentConversationIndex

    for (let guard = 0; guard < 20 && current.currentConversationIndex === startingIndex; guard += 1) {
      const scene = resolveNonMainlineScene(current)
      current = commitNonMainlineChoice(current, scene.choices[0].id)
    }

    expect(current.currentConversationIndex).toBe(startingIndex + 1)
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
