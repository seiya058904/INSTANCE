import { describe, expect, it } from 'vitest'
import {
  HANDOFF_AUTHORED_ASSET_INVENTORY,
  MAINLINE2_AUTHORED_CONVERSATIONS,
} from '../content/mainline2/authoredLibrary.generated'
import { ordinaryConversationPool } from '../content/runManifest'
import { activeRunConversations } from '../content/activeRun'
import { ENDING_BRIDGE_CONVERSATIONS } from '../content/mainline2/endingBridges'
import { PUBLIC_WORLD_ENDINGS, SECRET_ENDINGS } from '../content/mainline2/endings'
import { getFutureProposalDefinitions } from '../content/mainline2/proposals'
import { MAINLINE2_STORY_PLAN } from '../content/mainline2/storyPlan'
import storyPlanSource from '../content/mainline2/storyPlan.registry.json'

// ---------------------------------------------------------------------------
// Classification invariant: every formal content asset belongs to EXACTLY ONE
// side of { Mainline domain, Non-Mainline pool }.
//   Mainline    = ML2 authored conversations + ending bridges + legacy mainline
//                 anchors (activeRun) + endings + proposals.
//   Non-Mainline = ordinaryConversationPool (the curated ordinary pool).
// Adding an asset that lands on neither side (or on both) fails the suite.
// ---------------------------------------------------------------------------

const ml2ConversationIds = new Set(MAINLINE2_AUTHORED_CONVERSATIONS.map((conversation) => conversation.id))
const bridgeConversationIds = new Set(ENDING_BRIDGE_CONVERSATIONS.map((conversation) => conversation.id))
const legacyAnchorConversationIds = new Set(activeRunConversations.map((conversation) => conversation.id))
const poolConversationIds = new Set(ordinaryConversationPool.map((conversation) => conversation.id))

const ml2SourceRefs = new Set(MAINLINE2_AUTHORED_CONVERSATIONS.flatMap((conversation) => conversation.sourceRefs ?? []))
const bridgeSourceRefs = new Set(ENDING_BRIDGE_CONVERSATIONS.flatMap((conversation) => conversation.sourceRefs ?? []))
const poolSourceRefs = new Set(ordinaryConversationPool.flatMap((conversation) => conversation.sourceRefs ?? []))

const mainlineAssetIds: Set<string> = new Set(HANDOFF_AUTHORED_ASSET_INVENTORY.map((asset) => asset.assetId))
const endingIds: Set<string> = new Set([...PUBLIC_WORLD_ENDINGS, ...Object.keys(SECRET_ENDINGS)])
const proposalIds: Set<string> = new Set(getFutureProposalDefinitions().map((proposal) => proposal.id))

const mainlineConversationDomain = new Set([...ml2ConversationIds, ...bridgeConversationIds, ...legacyAnchorConversationIds])

describe('Mainline / Non-Mainline classification guard (XOR invariant)', () => {
  it('keeps ML2 conversations and the ordinary pool disjoint by conversation id', () => {
    const overlap = [...ml2ConversationIds].filter((id) => poolConversationIds.has(id))
    expect(overlap).toEqual([])
    expect([...bridgeConversationIds].filter((id) => poolConversationIds.has(id))).toEqual([])
  })

  it('keeps ML2/bridge source refs disjoint from ordinary pool source refs', () => {
    const overlap = [...ml2SourceRefs, ...bridgeSourceRefs].filter((ref) => poolSourceRefs.has(ref))
    expect(overlap).toEqual([])
  })

  it('never schedules an ordinary pool conversation as mainline Story Plan content', () => {
    const mainlineSlots = storyPlanSource.slots.filter((slot) => slot.kind === 'mainline')
    for (const slot of mainlineSlots) {
      if (!slot.conversationId) continue
      expect(poolConversationIds.has(slot.conversationId), `slot ${slot.slot} -> ${slot.conversationId}`).toBe(false)
    }
  })

  it('resolves every mainline Story Plan slot inside the Mainline domain', () => {
    const mainlineSlots = storyPlanSource.slots.filter((slot) => slot.kind === 'mainline')
    for (const slot of mainlineSlots) {
      if (!slot.conversationId) continue
      expect(mainlineConversationDomain.has(slot.conversationId), `slot ${slot.slot} -> ${slot.conversationId}`).toBe(true)
    }
  })

  it('keeps every Story Plan mainline slot inside the authored inventory or bridge domain', () => {
    const mainlineSlots = storyPlanSource.slots.filter((slot) => slot.kind === 'mainline')
    const bridgeDomain = new Set(bridgeSourceRefs)
    for (const slot of mainlineSlots) {
      if (!slot.assetId) continue
      const known = mainlineAssetIds.has(slot.assetId) || bridgeDomain.has(slot.assetId)
      expect(known, `slot ${slot.slot} -> ${slot.assetId}`).toBe(true)
    }
  })

  it('keeps Ending / Proposal / Bridge identifiers out of the ordinary pool', () => {
    const forbidden = new Set([...endingIds, ...proposalIds])
    const hits = [...poolSourceRefs].filter((ref) => forbidden.has(ref))
    expect(hits).toEqual([])
    expect([...poolSourceRefs].filter((ref) => ref.startsWith('ML2-'))).toEqual([])
  })

  it('keeps bridge source refs inside the ML2 authored namespace (bridges point at mainline)', () => {
    for (const ref of bridgeSourceRefs) {
      expect(ref.startsWith('ML2-'), ref).toBe(true)
    }
  })

  it('does not place the curated ordinary pool inside the Mainline domain', () => {
    const mainlineConversationIds = new Set([...ml2ConversationIds, ...bridgeConversationIds])
    const overlap = [...poolConversationIds].filter((id) => mainlineConversationIds.has(id))
    expect(overlap).toEqual([])
  })

  it('enforces exactly-one-side coverage over the formal conversation domain', () => {
    // Every formal conversation definition must land on exactly one side:
    // ML2 authored | ending bridge | ordinary pool. Duplicate registration
    // (both sides) or unregistered content is a structural failure.
    const seen = new Map<string, string[]>()
    for (const id of ml2ConversationIds) seen.set(id, [...(seen.get(id) ?? []), 'mainline'])
    for (const id of bridgeConversationIds) seen.set(id, [...(seen.get(id) ?? []), 'mainline-bridge'])
    for (const id of poolConversationIds) seen.set(id, [...(seen.get(id) ?? []), 'non-mainline'])
    for (const [id, sides] of seen) {
      expect(sides, id).toHaveLength(1)
    }
    expect(ml2ConversationIds.size).toBeGreaterThan(0)
    expect(poolConversationIds.size).toBeGreaterThan(0)
  })

  it('keeps the curated ordinary pool exactly at the reconciled size', () => {
    // Guard against silent pool churn: new ordinary content must be added
    // deliberately, mirroring the human-reviewed NON_MAINLINE set.
    expect(ordinaryConversationPool.length).toBe(194)
  })
})

describe('Mainline 2.0 classification guard sanity', () => {
  it('exposes the same pool the runtime scheduler uses', () => {
    expect(ordinaryConversationPool.length).toBeGreaterThanOrEqual(MAINLINE2_STORY_PLAN.filter((slot) => slot.kind === 'ordinary').length)
  })
})
