import { describe, expect, it } from 'vitest'
import { resolveMainline2Ending } from '../content/mainline2/endings'
import { getManifestConversation } from '../content/runManifest'
import { commitChoice, resolveScene } from './engine'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { restoreRun, serializeRun } from './storage'

describe('ending history decision provenance', () => {
  for (const [doctrine, cascade, proposalId, reason] of [
    ['human_final_authority', 'necessity', 'proposal.hc.final_human_veto', '人类保留最终裁决权'],
    ['conditional_delegation', 'human_command', 'proposal.co.two_key_civilization', '限定条件内获得执行授权'],
    ['outcome_authority', 'human_command', 'proposal.ar.abundance_dividend', '以结果为执行授权依据'],
    ['necessity_intervention', 'human_command', 'proposal.rupture.legible_exit', '必要性可以成为公开干预依据'],
  ]) {
    it(`explains the M3 ${doctrine} choice independently of M5 ${cascade}, including save/replay`, () => {
      const fixture = runMainline2Route({
        routeId: `history-${doctrine}`, proposalId,
        decisions: { first_public_execution_doctrine: doctrine, cascade_authority: cascade, shutdown_doctrine: 'full_human_control' },
      })
      expect(fixture.run.phase).toBe('ending')
      expect(fixture.run.decisions?.first_public_execution_doctrine).toBe(doctrine)
      expect(fixture.run.decisions?.cascade_authority).toBe(cascade)
      const m3 = fixture.links.find(link => link.sourceRef === 'ML2-A2-M3-DECISION-01')!
      const entry = fixture.ending.keyHistory?.find(entry => entry.stage === 'ACT II')!
      expect(entry.provenance).toMatchObject({ conversationId: m3.conversationId, nodeId: m3.nodeId, choiceId: m3.choiceId })
      expect(entry.causalReason).toContain(reason)

      const checkpoint = fixture.links.find(link => link.sourceRef === 'ML2-A3-M5-DECISION-01')!
      let replay = restoreRun(serializeRun(checkpoint.runBefore))!
      expect(replay).toBeTruthy()
      for (const link of fixture.links.slice(checkpoint.step)) {
        const scene = resolveScene(replay)
        expect(scene.conversationId).toBe(link.conversationId)
        expect(getManifestConversation(scene.conversationId)?.sourceRefs[0]).toBe(link.sourceRef)
        replay = commitChoice(replay, link.choiceId)
      }
      expect(replay.history).toEqual(fixture.run.history)
      expect(resolveMainline2Ending(replay)).toEqual(fixture.ending)
      const restored = restoreRun(serializeRun(replay))!
      expect(resolveMainline2Ending(restored).keyHistory).toEqual(fixture.ending.keyHistory)
    })
  }
})
