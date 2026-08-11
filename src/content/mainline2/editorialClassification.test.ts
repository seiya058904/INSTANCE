import { describe, expect, it } from 'vitest'
import { HANDOFF_AUTHORED_ASSET_INVENTORY } from './authoredLibrary.generated'
import editorialRegistry from './editorialClassification.registry.json'
import storyPlanSource from './storyPlan.registry.json'
import auditArtifact from '../../../docs/audits/mainline2-asset-classification.json'

const classifications = [
  'CORE',
  'CONDITIONAL CORE',
  'MAINLINE CONSEQUENCE',
  'MAINLINE WORLD ECHO',
  'OPTIONAL',
  'ORDINARY',
  'CUT',
] as const

const requiredFields = [
  'assetId',
  'character',
  'classification',
  'dispositionRationale',
  'narrativePurpose',
  'payoff',
  'prerequisite',
  'routeFamilies',
  'usedByStoryPlan',
].sort()

describe('Mainline 2.0 editorial classification registry', () => {
  it('classifies the exact 330-asset canonical inventory once with complete editorial fields', () => {
    const canonicalIds = HANDOFF_AUTHORED_ASSET_INVENTORY.map((asset) => asset.assetId).sort()
    const registeredIds = editorialRegistry.map((asset) => asset.assetId).sort()

    expect(editorialRegistry).toHaveLength(330)
    expect(new Set(registeredIds).size).toBe(330)
    expect(registeredIds).toEqual(canonicalIds)

    for (const asset of editorialRegistry) {
      expect(Object.keys(asset).sort(), asset.assetId).toEqual(requiredFields)
      expect(classifications, asset.assetId).toContain(asset.classification)
      expect(asset.narrativePurpose.trim(), asset.assetId).not.toBe('')
      expect(asset.character.trim(), asset.assetId).not.toBe('')
      expect(asset.prerequisite.trim(), asset.assetId).not.toBe('')
      expect(asset.payoff.trim(), asset.assetId).not.toBe('')
      expect(asset.dispositionRationale.trim(), asset.assetId).not.toBe('')
      expect(typeof asset.usedByStoryPlan, asset.assetId).toBe('boolean')
      expect(asset.routeFamilies.length, asset.assetId).toBeGreaterThan(0)
      expect(asset.routeFamilies.every((route) => route.trim() !== ''), asset.assetId).toBe(true)
    }
  })

  it('records direct Story Plan use exactly instead of inferring it from names', () => {
    const scheduledIds = new Set(storyPlanSource.slots.flatMap((slot) => slot.kind === 'mainline' ? [slot.assetId] : []))
    const registryById = new Map(editorialRegistry.map((asset) => [asset.assetId, asset]))

    for (const assetId of HANDOFF_AUTHORED_ASSET_INVENTORY.map((asset) => asset.assetId)) {
      expect(registryById.get(assetId)?.usedByStoryPlan, assetId).toBe(scheduledIds.has(assetId))
    }
  })

  it('keeps named characters, Convention, closures, bridges, and M16/M17 ending material explicit', () => {
    const byId = new Map(editorialRegistry.map((asset) => [asset.assetId, asset]))

    expect(byId.get('user-1842-first')).toMatchObject({ classification: 'CORE', character: '岑遥' })
    expect(byId.get('speaking-8614')).toMatchObject({ classification: 'CORE', character: 'User #8614' })
    expect(byId.get('ML2-A2-ZL-01')?.character).toContain('周岚')
    expect(byId.get('ML2-A3-M5-LSH-01')?.character).toContain('林绍衡')
    expect(byId.get('ML2-A3-M6-E9-05')?.character).toContain('ECHO-9')
    expect(byId.get('ML2-A4-M15-CONV-01')).toMatchObject({ classification: 'CORE', usedByStoryPlan: true })

    for (const asset of editorialRegistry.filter((entry) => entry.assetId.includes('-CLOSE-'))) {
      expect(['CORE', 'MAINLINE CONSEQUENCE'], asset.assetId).toContain(asset.classification)
    }
    for (const assetId of ['ML2-A2-M3-CAP-01', 'ML2-A3-M4-CAP-01', 'ML2-A4-M14-CAP-01']) {
      expect(byId.get(assetId)?.classification, assetId).toBe('MAINLINE CONSEQUENCE')
    }

    for (const assetId of [
      'ML2-A5-M16-0000-01',
      'ML2-A5-M16-GEN-01',
      'ML2-A5-M16-PROP-*',
      'ML2-A5-M17-REVIEW-01',
      'ML2-A5-M17-COMMIT-01',
      'ML2-A5-M17-KEYHISTORY-01',
      'ML2-A5-M17-WHY-01',
      'ML2-A5-M17-FINAL-01',
      'ML2-A5-M17-RESOLVE-01',
      'ML2-A5-M17-LOCK-01',
      'ML2-A5-M17-SECRET-01',
    ]) {
      expect(byId.get(assetId)?.classification, assetId).toBe('CORE')
    }
    for (const asset of editorialRegistry.filter((entry) => entry.assetId.includes('M17-EPI-'))) {
      expect(asset.classification, asset.assetId).toBe('CORE')
      expect(asset.routeFamilies, asset.assetId).toContain('ending-epilogues')
    }
  })

  it('publishes the explicit registry verbatim in the audit artifact', () => {
    expect(auditArtifact.generatedFrom).toEqual([
      'src/content/mainline2/editorialClassification.registry.json',
      'HANDOFF_AUTHORED_ASSET_INVENTORY',
    ])
    expect(auditArtifact.assets).toEqual(editorialRegistry)
    expect(Object.values(auditArtifact.counts).reduce((total, count) => total + count, 0)).toBe(330)
  })
})
