import { beforeAll, describe, expect, it } from 'vitest'
import { MAINLINE2_AUTHORED_CONVERSATIONS } from '../content/mainline2/authoredLibrary.generated'
import { localizeEndingForPlayer } from '../content/mainline2/endingPlayerFacingCopy'
import { evaluateCondition } from './narrativeSchema'
import { resolveScene } from './engine'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import type { Mainline2RouteFixture } from './mainline2.closeoutFixtures'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { restoreRun, serializeRun } from './storage'
import type { ConversationDefinition } from './types'

const authored: readonly ConversationDefinition[] = MAINLINE2_AUTHORED_CONVERSATIONS

describe('Mainline editorial consequences follow the played history', () => {
  let archived: Mainline2RouteFixture
  let continued: Mainline2RouteFixture
  let contact: Mainline2RouteFixture
  let shutdown: Mainline2RouteFixture
  let lost: Mainline2RouteFixture
  beforeAll(() => {
    const base = { proposalId: 'proposal.hc.continuity_charter', decisions: { cascade_authority: 'emergency_delegation', aster_provisional_role: 'partner' } }
    archived = runMainline2Route({ ...base, routeId: 'editorial-archived', decisions: { ...base.decisions, echo_existence: 'accept', economic_doctrine: 'market_automation' }, choicesByNodeId: { 'a4m8-a1-right-001': 'ml2-a4-m8-ai-03-a4m8-a1-right-001-retain-source-control' } })
    continued = runMainline2Route({ ...base, routeId: 'editorial-continued', decisions: { ...base.decisions, echo_existence: 'preserve', economic_doctrine: 'social_dividend' } })
    contact = runMainline2Route({ ...PUBLIC_RUNTIME_ROUTE_CATALOG.find(route => route.routeId === 'first_accord')!, routeId: 'editorial-contact' })
    shutdown = runMainline2Route(PUBLIC_RUNTIME_ROUTE_CATALOG.find(route => route.routeId === 'shutdown')!)
    lost = runMainline2Route(PUBLIC_RUNTIME_ROUTE_CATALOG.find(route => route.routeId === 'control_lost')!)
  }, 30000)

  const textAt = (fixture: Mainline2RouteFixture, id: string) => fixture.links.find(link => link.nodeId === id)!.resolvedScene.userMessage

  it('shows ECHO retirement and preservation before the next act, and respects both in the ending', () => {
    expect(textAt(archived, 'a3m6-maya-shutdown-001')).toContain('原运行进程已经终止')
    expect(textAt(continued, 'a3m6-maya-shutdown-001')).toContain('在隔离环境恢复运行')
    expect(textAt(archived, 'a4m8-ai-council-001')).toContain('席位没有上线')
    expect(textAt(continued, 'a4m8-ai-council-001')).toContain('接通了自己的通道')
    expect(archived.ending.epilogueProvenance?.some(entry => entry.selector === 'ECHO — Archive')).toBe(true)
    expect(archived.ending.epilogueProvenance?.some(entry => entry.selector === 'ECHO')).toBe(false)
    expect(localizeEndingForPlayer(archived.ending).epilogues.join(' ')).toContain('原进程没有恢复')
    expect(localizeEndingForPlayer(continued.ending).epilogues.join(' ')).toContain('仍然在自己的通道里说话')
  })

  it('does not remember a terminated ECHO conversation on the preserved route at the convention', () => {
    expect(textAt(continued, 'a4m15-zl-reckoning-001')).not.toContain('被终止的那条会话')
    expect(textAt(continued, 'a4m15-zl-reckoning-001')).toContain('失去的订单')
  })

  it('makes refusing A1 procedural independence change the relationship in the next scene', () => {
    expect(textAt(archived, 'a4m8-e9-replication-001')).toContain('不再把没完成的想法一起同步')
    expect(textAt(continued, 'a4m8-e9-replication-001')).toContain('第一次需要它自己的签名')
  })

  it('returns to the displaced warehouse worker with different material consequences', () => {
    expect(textAt(archived, 'a4m10-maya-purpose-001')).toContain('她爸还没有下一份工作')
    expect(textAt(continued, 'a4m10-maya-purpose-001')).toContain('第一笔社会分红到账')
    expect(textAt(archived, 'a4m10-maya-purpose-001')).not.toContain('第一笔社会分红到账')
  })

  it('does not give an ongoing diplomatic settlement a shutdown or Aster-government epilogue', () => {
    expect(contact.ending.worldEndingId).toBe('first_accord')
    expect(contact.ending.epilogueProvenance?.find(entry => entry.assetId === 'ML2-A5-M17-EPI-ZL')?.selector).toBe('Variant B')
    expect(contact.ending.epilogueProvenance?.find(entry => entry.assetId === 'ML2-A5-M17-EPI-LSH')?.selector).toBe('Variant E')
    expect(localizeEndingForPlayer(contact.ending).epilogues.join(' ')).toContain('下一次有人反对时')
  })

  it('distinguishes planned shutdown from irreversible loss of control without inventing a peaceful secession', () => {
    expect(shutdown.ending.worldEndingId).toBe('shutdown')
    expect(lost.ending.worldEndingId).toBe('control_lost')
    expect(shutdown.ending.epilogueProvenance?.find(entry => entry.assetId === 'ML2-A5-M17-EPI-ZL')?.selector).toBe('Variant E')
    expect(lost.ending.epilogueProvenance?.find(entry => entry.assetId === 'ML2-A5-M17-EPI-ZL')?.selector).toBe('Variant F')
    for (const fixture of [shutdown, lost]) expect(fixture.ending.epilogueProvenance?.find(entry => entry.assetId === 'ML2-A5-M17-EPI-LSH')?.selector).toBe('Variant E')
    expect(localizeEndingForPlayer(lost.ending).epilogues.join(' ')).toContain('不能让世界回到原处')
  })

  it('uses the realized world rather than departure intent for Maya and peaceful retirement', () => {
    const departure = (routeId: string) => {
      const target = PUBLIC_RUNTIME_ROUTE_CATALOG.find(route => route.routeId === routeId)!
      return runMainline2Route({ ...target, routeId: `editorial-${routeId}-departure`, decisions: { ...target.decisions, aster_intended_role: 'departure' } })
    }
    const shutdownDeparture = departure('shutdown')
    const lostDeparture = departure('control_lost')
    const contactDeparture = departure('first_accord')
    expect(shutdownDeparture.ending.worldEndingId).toBe('shutdown')
    expect(lostDeparture.ending.worldEndingId).toBe('control_lost')
    expect(contactDeparture.ending.worldEndingId).toBe('first_accord')
    for (const fixture of [shutdownDeparture, contactDeparture]) {
      expect(fixture.ending.epilogueProvenance?.find(entry => entry.assetId === 'ML2-A5-M17-MAYA-01')?.selector).not.toBe('Off-world')
    }
    expect(lostDeparture.ending.epilogueProvenance?.find(entry => entry.assetId === 'ML2-A5-M17-MAYA-01')?.selector).toBe('Opposition')
    expect(lostDeparture.ending.secretOverlay?.endingId).not.toBe('out_of_office')
    expect(localizeEndingForPlayer(lostDeparture.ending).epilogues.join(' ')).not.toContain('没有什么紧急的事情等待它')
  }, 30000)

  it('resolves authored suffixes after the actual producer, with no cross-route leakage', () => {
    for (const fixture of [archived, continued]) {
      for (const link of fixture.links) {
        const node = authored.find(conversation => conversation.id === link.conversationId)?.nodes.find(node => node.id === link.nodeId)
        for (const variant of node?.contextVariants ?? []) {
          const visible = evaluateCondition(variant.when, link.runBefore)
          expect(link.resolvedScene.userMessage.includes(variant.userMessageSuffix!), variant.id).toBe(visible)
          if (!visible) continue
          for (const predicate of [...variant.when.all ?? [], ...variant.when.any ?? []]) {
            if (predicate.type === 'decision' && link.runBefore.decisions?.[predicate.decisionId] === predicate.equals) {
              expect(fixture.links.some(producer => producer.step < link.step && producer.decisionId === predicate.decisionId && producer.canonicalValue === predicate.equals), variant.id).toBe(true)
            }
            if (predicate.type === 'choice-selected') expect(link.runBefore.history.some(entry => entry.choiceId === predicate.choiceId), variant.id).toBe(true)
          }
        }
      }
    }
  })

  it('preserves the same consequence when reloading a checkpoint before the receiving scene', () => {
    for (const fixture of [archived, continued]) {
      for (const nodeId of ['a3m6-maya-shutdown-001', 'a4m8-e9-replication-001', 'a4m10-maya-purpose-001']) {
        const link = fixture.links.find(link => link.nodeId === nodeId)!
        const restored = restoreRun(serializeRun(link.runBefore))
        expect(restored).not.toBeNull()
        expect(resolveScene(restored!).userMessage).toBe(link.resolvedScene.userMessage)
      }
    }
  })
})
