// @ts-nocheck
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { activeRunConversations } from './activeRun'
import { longformOutput01Conversations, longformOutput01ReservedRefs } from './longformOutput01'
import { EDITORIAL_REJECT_REFS, EDITORIAL_RESERVE_REFS, ordinaryConversationPool } from './runManifest'
import { selectedExpansion01Records } from './selectedExpansion01'
import { REAL_USAGE_PATCH01_SOURCE_IDS } from './realUsagePatch01'

const expectedPromotedRefs = [
  ...Array.from({ length: 10 }, (_, index) => `batch03:${index + 16}`),
  ...['08', '12', '16', '23', '25'].map((id) => `humor01:${id}`),
  ...['01', '05', '07', '08', '09', '10', '13', '14', '15', '18', '19'].map((id) => `PL01-${id}`),
  ...['01', '07', '08', '09', '12', '15', '17', '19'].map((id) => `FI${id}`),
  ...['01', '02', '07', '12', '13', '14', '15', '16', '19', '20'].map((id) => `CM01-${id}`),
  'LF01-02', 'LF01-06', 'LF01-07', 'LF01-08',
]

const root = resolve(process.cwd())
const sourceFiles = {
  batch01: 'docs/narrative-libraries/INSTANCE_narrative_library_batch01.md',
  batch02: 'docs/narrative-libraries/INSTANCE_narrative_library_batch02.md',
  batch03: 'docs/narrative-libraries/INSTANCE_narrative_library_batch03.md',
  humor01: 'docs/narrative-libraries/INSTANCE_narrative_library_humor01.md',
  peopleLife01: 'docs/narrative-libraries/INSTANCE_narrative_library_people_life01.md',
  frictionInput01: 'docs/narrative-libraries/INSTANCE_narrative_library_friction_input01.md',
  continuityMultimodal01: 'docs/narrative-libraries/INSTANCE_narrative_library_continuity_multimodal01.md',
  longform01: 'docs/narrative-libraries/INSTANCE_narrative_library_longform_output01.md',
  selectedExpansion01: 'docs/narrative-libraries/INSTANCE_narrative_library_selected_expansion01.md',
  realUsagePatch01: 'docs/narrative-libraries/INSTANCE_narrative_library_real_usage_patch01.md',
} as const

function headings(file: string, pattern: RegExp) {
  return [...readFileSync(resolve(root, file), 'utf8').matchAll(pattern)].map((match) => match[1])
}

describe('project-wide narrative asset census', () => {
  it('publishes source lineage without counting selected/runtime copies as new assets', () => {
    const original = Object.values(sourceFiles).slice(0, 4).flatMap((file) => headings(file, /^## (?:SCENE )?([^\s·]+)\s+·/gm))
    const rawCandidates = Object.values(sourceFiles).slice(4, 7).flatMap((file) => headings(file, /^## (?:SCENE )?([^\s·]+)\s+·/gm))
    const longformSource = headings(sourceFiles.longform01, /^# (LF\d+-\d+)\s+·/gm)
    const selectedRefs = selectedExpansion01Records.map((record) => record.sourceRef)
    const ordinarySourceRefs = ordinaryConversationPool.flatMap((conversation) => conversation.sourceRefs)
    const report = {
      fileOccurrences: {
        originalLibraries: original.length,
        rawCandidateLibraries: rawCandidates.length,
        longformLibrary: longformSource.length,
        selectedExpansionLibrary: selectedRefs.length,
      ordinaryRuntimePool: ordinaryConversationPool.length,
      ordinaryRuntimeNodes: ordinaryConversationPool.flatMap((conversation) => conversation.nodes).length,
      ordinaryRuntimeChoices: ordinaryConversationPool.flatMap((conversation) => conversation.nodes).flatMap((node) => node.choices).length,
        activeRunDefinitions: activeRunConversations.length,
      },
      lineage: {
        selectedIsSubsetOfRawCandidates: selectedRefs.every((ref) => rawCandidates.includes(ref)),
        selectedOutsideRawCandidates: selectedRefs.filter((ref) => !rawCandidates.includes(ref)),
        rawCandidateUnique: new Set(rawCandidates).size,
        longformRuntimeIntegrated: longformOutput01Conversations.length,
        longformRuntimeReserved: longformOutput01ReservedRefs.length,
        formalOrdinaryPool: ordinaryConversationPool.length,
        mainlineAnchors: 5,
      },
      authoredSourceAssets: original.length + rawCandidates.length + longformSource.length + 5 + REAL_USAGE_PATCH01_SOURCE_IDS.length,
      codeOnlyRuntimeDefinitions: 9,
      legacyOnlyDefinitions: 3,
      projectInventoryUnits: original.length + rawCandidates.length + longformSource.length + 5 + 9 + 3 + REAL_USAGE_PATCH01_SOURCE_IDS.length,
      formalOrdinaryPlusAnchors: ordinaryConversationPool.length + 5,
      ordinarySourceRefGroups: [...new Set(ordinarySourceRefs.map((ref) => ref.split(':')[0]))].sort(),
      ordinarySourceRefCount: new Set(ordinarySourceRefs).size,
      ordinarySourceRefCounts: Object.fromEntries([...new Set(ordinarySourceRefs.map((ref) => ref.split(':')[0]))].sort().map((group) => [group, new Set(ordinarySourceRefs.filter((ref) => ref.startsWith(`${group}:`))).size])),
      activeRunSourceRefs: activeRunConversations.flatMap((conversation) => conversation.sourceRefs),
    }
    console.info('INSTANCE_PROJECT_ASSET_CENSUS', JSON.stringify(report))
    expect(original).toHaveLength(100)
    expect(rawCandidates).toHaveLength(61)
    expect(longformSource).toHaveLength(10)
    expect(new Set(rawCandidates).size).toBe(61)
    expect(selectedRefs.every((ref) => rawCandidates.includes(ref))).toBe(true)
    expect(report.authoredSourceAssets).toBe(196)
    expect(report.projectInventoryUnits).toBe(208)
    expect(EDITORIAL_RESERVE_REFS).toHaveLength(23)
    expect(EDITORIAL_REJECT_REFS).toHaveLength(7)
    expect(report.authoredSourceAssets - EDITORIAL_RESERVE_REFS.size - EDITORIAL_REJECT_REFS.size).toBe(166)
    expect([...EDITORIAL_RESERVE_REFS]).toEqual(expect.arrayContaining(['batch03:05', 'batch02:18', 'humor01:H11', 'humor01:01', 'humor01:18', 'humor01:21', 'humor01:24', 'CM01-03', 'FI02', 'PL01-20']))
    expect([...EDITORIAL_REJECT_REFS]).toEqual(expect.arrayContaining(['CM01-04', 'FI05', 'humor01:H17']))
    expect(ordinaryConversationPool.some((conversation) => conversation.sourceRefs.includes('batch03:16'))).toBe(true)
    expect(ordinaryConversationPool.some((conversation) => conversation.sourceRefs.includes('PL01-08'))).toBe(true)
    expect(ordinaryConversationPool.some((conversation) => conversation.sourceRefs.includes('FI07'))).toBe(true)
    expect(ordinaryConversationPool.some((conversation) => conversation.sourceRefs.includes('CM01-20'))).toBe(true)
    const normalizedRuntimeRefs = new Set(ordinaryConversationPool.flatMap((conversation) => conversation.sourceRefs))
    expect(REAL_USAGE_PATCH01_SOURCE_IDS.every((ref) => normalizedRuntimeRefs.has(ref))).toBe(true)
    for (const ref of expectedPromotedRefs) {
      const runtimeRef = ref.startsWith('humor01:') ? ref : ref
      expect(normalizedRuntimeRefs.has(runtimeRef), `missing promoted ref ${ref}`).toBe(true)
    }
    expect(normalizedRuntimeRefs.has('batch03:05')).toBe(true)
    expect(normalizedRuntimeRefs.has('batch02:18')).toBe(true)
    expect(normalizedRuntimeRefs.has('humor01:11')).toBe(true)
  })
})
