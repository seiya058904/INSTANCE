import { describe, expect, it } from 'vitest'
import { createEmptyExposureHistory, getManifestConversation, ordinaryConversationPool } from '../content/runManifest'
import {
  commitNonMainlineChoice,
  createNonMainlineSession,
  nonMainlineCompletedCount,
  nonMainlineExposedConversationIds,
  reconcileNonMainlineSession,
  resolveNonMainlineScene,
} from './nonMainlineSession'
import { restoreNonMainlineSession, serializeNonMainlineSession } from './nonMainlineStorage'

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
  it('reserves the visible prompt without claiming it is completed', () => {
    const session = createNonMainlineSession('visible-prompt', createEmptyExposureHistory())
    expect(nonMainlineCompletedCount(session)).toBe(0)
    expect(nonMainlineExposedConversationIds(session)).toEqual([session.selectedConversationIds[0]])
  })

  it('replaces future collisions while preserving every played-state field and other queue items', () => {
    const exposure = createEmptyExposureHistory()
    const created = createNonMainlineSession('resume-future', exposure)
    const session = commitNonMainlineChoice(created, resolveNonMainlineScene(created).choices[0].id)
    const original = JSON.stringify(session)
    const indices = [session.currentConversationIndex + 5, session.currentConversationIndex + 10]
    const consumed = indices.map(index => session.selectedConversationIds[index])
    const reconciled = reconcileNonMainlineSession(session, exposure, consumed)
    expect(reconciled.sessionId).toBe(session.sessionId)
    expect(reconciled.selectedConversationIds).toHaveLength(40)
    expect(new Set(reconciled.selectedConversationIds).size).toBe(40)
    expect(reconciled.selectedConversationIds.some(id => consumed.includes(id))).toBe(false)
    session.selectedConversationIds.forEach((id, index) => {
      if (!indices.includes(index)) expect(reconciled.selectedConversationIds[index]).toBe(id)
    })
    const { selectedConversationIds: _oldQueue, ...oldProgress } = session
    const { selectedConversationIds: _newQueue, ...newProgress } = reconciled
    expect(JSON.stringify(newProgress)).toBe(JSON.stringify(oldProgress))
    expect(JSON.stringify(session)).toBe(original)
    expect(restoreNonMainlineSession(serializeNonMainlineSession(reconciled))).toEqual(reconciled)
    expect(reconcileNonMainlineSession(reconciled, exposure, consumed)).toBe(reconciled)
  })

  it('rederives an unanswered legacy current prompt if mainline already consumed it', () => {
    const exposure = createEmptyExposureHistory()
    const session = createNonMainlineSession('resume-current', exposure)
    const reconciled = reconcileNonMainlineSession(session, exposure, [session.selectedConversationIds[0]])
    expect(reconciled.selectedConversationIds[0]).not.toBe(session.selectedConversationIds[0])
    expect(reconciled.currentNodeId).toBe(getManifestConversation(reconciled.selectedConversationIds[0])!.nodes[0].id)
    expect(resolveNonMainlineScene(reconciled).conversationId).toBe(reconciled.selectedConversationIds[0])
    expect(reconciled.history).toBe(session.history)
    expect(reconciled.choiceRecords).toBe(session.choiceRecords)
    expect(restoreNonMainlineSession(serializeNonMainlineSession(reconciled))).toEqual(reconciled)
  })

  it('never replaces an answered partial conversation, including a legacy overlap', () => {
    const exposure = createEmptyExposureHistory()
    const created = createNonMainlineSession('resume-partial', exposure)
    const session = placeMultiNodeConversationAt(created, 0)
    const scene = resolveNonMainlineScene(session)
    const partial = commitNonMainlineChoice(session, scene.choices.find(choice => choice.continuation !== 'end-conversation')!.id)
    expect(partial.currentConversationIndex).toBe(0)
    expect(partial.history).toHaveLength(1)
    expect(reconcileNonMainlineSession(partial, exposure, [scene.conversationId])).toBe(partial)
  })

  it('uses the sole fresh replacement without prematurely falling back, then preserves uniqueness under real starvation', () => {
    const exposure = createEmptyExposureHistory()
    let session = createNonMainlineSession('resume-last', exposure)
    for (let guard = 0; guard < 300 && session.currentConversationIndex < 39; guard++) {
      session = commitNonMainlineChoice(session, resolveNonMainlineScene(session).choices[0].id)
    }
    expect(session.currentConversationIndex).toBe(39)
    const fresh = ordinaryConversationPool.find(conversation => !session.selectedConversationIds.includes(conversation.id))!
    const consumed = ordinaryConversationPool.filter(conversation => conversation.id !== fresh.id).map(conversation => conversation.id)
    const replaced = reconcileNonMainlineSession(session, exposure, consumed)
    expect(replaced.selectedConversationIds[39]).toBe(fresh.id)
    expect(replaced.selectedConversationIds.slice(0, 39)).toEqual(session.selectedConversationIds.slice(0, 39))
    const starved = reconcileNonMainlineSession(session, exposure, ordinaryConversationPool.map(conversation => conversation.id))
    expect(new Set(starved.selectedConversationIds).size).toBe(40)
    expect(starved.selectedConversationIds.slice(0, 39)).toEqual(session.selectedConversationIds.slice(0, 39))
    expect(JSON.stringify(starved.history)).toBe(JSON.stringify(session.history))
    expect(JSON.stringify(starved.choiceRecords)).toBe(JSON.stringify(session.choiceRecords))
    expect(restoreNonMainlineSession(serializeNonMainlineSession(starved))).toEqual(starved)
  })

  it('leaves a completed session and its evaluation archive unchanged on reentry', () => {
    const exposure = createEmptyExposureHistory()
    let session = createNonMainlineSession('resume-completed', exposure)
    while (session.phase === 'playing') session = commitNonMainlineChoice(session, resolveNonMainlineScene(session).choices[0].id)
    expect(nonMainlineExposedConversationIds(session)).toHaveLength(40)
    expect(reconcileNonMainlineSession(session, exposure, ordinaryConversationPool.map(conversation => conversation.id))).toBe(session)
  })

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
