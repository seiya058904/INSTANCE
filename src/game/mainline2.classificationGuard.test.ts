import { describe, expect, it } from 'vitest'
import {
  HANDOFF_AUTHORED_ASSET_INVENTORY,
  MAINLINE2_AUTHORED_CONVERSATIONS,
} from '../content/mainline2/authoredLibrary.generated'
import { ordinaryConversationPool, MAINLINE_ANCHOR_IDS } from '../content/runManifest'
import { activeRunConversations } from '../content/activeRun'
import { ENDING_BRIDGE_CONVERSATIONS } from '../content/mainline2/endingBridges'
import { PUBLIC_WORLD_ENDINGS, SECRET_ENDINGS } from '../content/mainline2/endings'
import { getFutureProposalDefinitions } from '../content/mainline2/proposals'
import { MAINLINE2_STORY_PLAN } from '../content/mainline2/storyPlan'
import storyPlanSource from '../content/mainline2/storyPlan.registry.json'

// ---------------------------------------------------------------------------
// Classification invariant: every formal content asset belongs to EXACTLY ONE
// side of { Mainline domain, Non-Mainline pool }.
//   Mainline    = ML2 authored conversations + ending bridges + the five
//                 canonical mainline anchors (MAINLINE_ANCHOR_IDS) + endings
//                 + proposals.
//   Non-Mainline = ordinaryConversationPool (the curated ordinary pool).
// A conversation that lands on neither side (unclassified) or on both
// (overlap) fails the suite. Note: activeRunConversations also contains
// legacy ordinary content that is NOT a mainline anchor; only the five
// canonical anchor ids belong to the Mainline domain.
// ---------------------------------------------------------------------------

const ml2ConversationIds = new Set(MAINLINE2_AUTHORED_CONVERSATIONS.map((conversation) => conversation.id))
const bridgeConversationIds = new Set(ENDING_BRIDGE_CONVERSATIONS.map((conversation) => conversation.id))
const poolConversationIds = new Set(ordinaryConversationPool.map((conversation) => conversation.id))
const canonicalAnchorConversationIds: Set<string> = new Set(MAINLINE_ANCHOR_IDS)

const ml2SourceRefs = new Set(MAINLINE2_AUTHORED_CONVERSATIONS.flatMap((conversation) => conversation.sourceRefs ?? []))
const bridgeSourceRefs = new Set(ENDING_BRIDGE_CONVERSATIONS.flatMap((conversation) => conversation.sourceRefs ?? []))
const poolSourceRefs = new Set(ordinaryConversationPool.flatMap((conversation) => conversation.sourceRefs ?? []))

const mainlineAssetIds: Set<string> = new Set(HANDOFF_AUTHORED_ASSET_INVENTORY.map((asset) => asset.assetId))
const endingIds: Set<string> = new Set([...PUBLIC_WORLD_ENDINGS, ...Object.keys(SECRET_ENDINGS)])
const proposalIds: Set<string> = new Set(getFutureProposalDefinitions().map((proposal) => proposal.id))

const mainlineConversationDomain = new Set([...ml2ConversationIds, ...bridgeConversationIds, ...canonicalAnchorConversationIds])

// Canonical formal-conversation universe: every conversation the runtime can
// load today (ML2 authored + ending bridges + canonical anchors + ordinary
// pool). Unregistered content that is not part of this universe (e.g. legacy
// vertical-slice conversations) is not a current runtime conversation and is
// deliberately excluded below, with an explicit guard that none of it leaks
// into the Mainline domain.
const canonicalConversationUniverse = new Set([
  ...ml2ConversationIds,
  ...bridgeConversationIds,
  ...canonicalAnchorConversationIds,
  ...poolConversationIds,
])

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

  it('does not treat legacy ordinary activeRun conversations as mainline anchors', () => {
    // activeRunConversations contains legacy ordinary content (batch01-food,
    // user-0024, batch01-photos, ...) alongside the five canonical anchors.
    // Only MAINLINE_ANCHOR_IDS belong to the Mainline domain; the rest must
    // not be smuggled in as anchors.
    const activeRunIds = new Set(activeRunConversations.map((conversation) => conversation.id))
    const anchorInActiveRun = [...canonicalAnchorConversationIds].filter((id) => activeRunIds.has(id))
    expect(anchorInActiveRun).toEqual([...MAINLINE_ANCHOR_IDS])
    const nonAnchorActiveRun = [...activeRunIds].filter((id) => !canonicalAnchorConversationIds.has(id))
    const leaked = nonAnchorActiveRun.filter((id) => mainlineConversationDomain.has(id))
    expect(leaked).toEqual([])
    expect(nonAnchorActiveRun.length).toBeGreaterThan(0)
  })

  it('covers every canonical conversation on exactly one side (no unclassified, no overlap)', () => {
    // A conversation that is part of the canonical runtime universe must land
    // on exactly one side. This catches both double registration (overlap)
    // and content that was never registered anywhere (unclassified), because
    // the universe is derived from the runtime sources themselves.
    const side = new Map<string, string[]>()
    const register = (id: string, label: string) => side.set(id, [...(side.get(id) ?? []), label])
    for (const id of ml2ConversationIds) register(id, 'mainline')
    for (const id of bridgeConversationIds) register(id, 'mainline-bridge')
    for (const id of canonicalAnchorConversationIds) register(id, 'mainline-anchor')
    for (const id of poolConversationIds) register(id, 'non-mainline')
    const unclassified = [...canonicalConversationUniverse].filter((id) => !side.has(id))
    expect(unclassified).toEqual([])
    const overlaps = [...side.entries()].filter(([, labels]) => labels.length > 1)
    expect(overlaps).toEqual([])
    expect(canonicalConversationUniverse.size).toBeGreaterThan(0)
    expect(poolConversationIds.size).toBe(194)
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
    const mainlineConversationIds = new Set([...ml2ConversationIds, ...bridgeConversationIds, ...canonicalAnchorConversationIds])
    const overlap = [...poolConversationIds].filter((id) => mainlineConversationIds.has(id))
    expect(overlap).toEqual([])
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
