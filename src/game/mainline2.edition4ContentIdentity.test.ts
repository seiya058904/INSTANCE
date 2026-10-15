import { describe, expect, it } from 'vitest'
import { EDITION4_ECONOMY } from '../content/mainline2/edition4Economy'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { buildStoryContentForManifest } from '../content/runManifest'
import { validateContent } from './engine'
import { resolvePlayerVisibleIdentity } from './playerIdentity'

describe('edition-4 receipt IDs and visible worker continuity', () => {
  it.each(['post_scarcity', 'perfect_administration', 'im_lovin_it'])('%s has unique complete-manifest choices and records both receipt acknowledgements', id => {
    const target = PUBLIC_RUNTIME_ROUTE_CATALOG.find(t => t.endingId === id)!
    const fixture = runMainline2Route({ ...target, edition: 4 })
    expect(validateContent(buildStoryContentForManifest(fixture.run.manifest)).filter(error => error.startsWith('Duplicate choice'))).toEqual([])
    const receipts = fixture.links.filter(l => l.nodeId.startsWith('v4-econ-') && l.nodeId.endsWith('-receipt'))
    expect(receipts).toHaveLength(2)
    expect(new Set(receipts.map(l => l.choiceId)).size).toBe(2)
    for (const l of receipts) expect(fixture.run.selectedChoiceIds).toContain(l.choiceId)
    const original = resolvePlayerVisibleIdentity('ml2-authored-ml2-a4-m10-dev-04', []).label
    expect(resolvePlayerVisibleIdentity(fixture.links.find(l => l.nodeId.startsWith('v4-econ-'))!.conversationId, []).label).toBe(original)
    for (const l of fixture.links.filter(l => l.nodeId.startsWith('v4-econ-'))) {
      expect(l.resolvedScene.userMessage).not.toContain('#4471')
    }
  })

  it('all authored receipt choices have globally unique IDs', () => {
    const ids = EDITION4_ECONOMY.flatMap(c => c.nodes.flatMap(n => n.choices.map(choice => choice.id)))
    expect(new Set(ids).size).toBe(ids.length)
    expect(EDITION4_ECONOMY.flatMap(c => c.nodes.map(n => n.conversationTitle)).join(' ')).not.toContain('#4471')
    for (const c of EDITION4_ECONOMY) expect(validateContent({ startNodeId: c.nodes[0].id, nodes: c.nodes })).toEqual([])
  })
})
