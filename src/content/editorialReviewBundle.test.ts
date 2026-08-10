// @ts-nocheck
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const bundlePath = resolve(root, 'docs/editorial-review-2026-08-10/INSTANCE_asset_editorial_review_bundle.md')
const indexPath = resolve(root, 'docs/editorial-review-2026-08-10/INSTANCE_asset_editorial_index.md')

describe('editorial review bundle inventory', () => {
  it('contains the complete deduplicated inventory and census markers', () => {
    const bundle = readFileSync(bundlePath, 'utf8')
    const index = readFileSync(indexPath, 'utf8')
    expect(bundle).not.toContain('Definition not found')
    expect((bundle.match(/^## REV-\d{3} — /gm) ?? []).length).toBe(188)
    expect((bundle.match(/^- Asset ID: /gm) ?? []).length).toBe(188)
    expect(index).toContain('| Authored Unique Source Assets | 176 |')
    expect(index).toContain('| Code-only / Legacy definitions | 12 |')
    expect(index).toContain('| Exhaustive project inventory units | 188 |')
    expect(index).toContain('| Ordinary Runtime definitions | 98 |')
    expect(index).toContain('| Formal source coverage | 105 |')
    expect(index).toContain('Selected lifecycle copies are not parsed as additional authored IDs.')
    expect(index).toContain('Longform TypeScript lifecycle copies are not parsed as additional authored IDs.')
  })

  it('keeps the five Mainline Anchors and both Merge sources explicit', () => {
    const bundle = readFileSync(bundlePath, 'utf8')
    for (const id of ['user-7391', 'user-1842-first', 'speaking-8614', 'conversation-0000', 'user-1842-return']) {
      expect(bundle).toContain(`Asset ID: ${id}`)
    }
    for (const id of ['FI06', 'FI13']) {
      expect(bundle).toContain(`Asset ID: ${id}`)
      expect(bundle).toContain('Current Status: MERGE_ONLY')
    }
    expect(bundle).toContain('Merge Destination: selected CM01-09')
    expect(bundle).toContain('Merge Destination: selected CM01-10')
  })
})
