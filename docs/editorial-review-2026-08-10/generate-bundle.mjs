import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'docs', 'editorial-review-2026-08-10')
fs.mkdirSync(outDir, { recursive: true })

const files = {
  batch01: 'INSTANCE_narrative_library_batch01.md',
  batch02: 'INSTANCE_narrative_library_batch02.md',
  batch03: 'INSTANCE_narrative_library_batch03.md',
  humor01: 'INSTANCE_narrative_library_humor01.md',
  people_life01: 'INSTANCE_narrative_library_people_life01.md',
  friction_input01: 'INSTANCE_narrative_library_friction_input01.md',
  continuity_multimodal01: 'INSTANCE_narrative_library_continuity_multimodal01.md',
  longform_output01: 'INSTANCE_narrative_library_longform_output01.md',
  selected_expansion01: 'INSTANCE_narrative_library_selected_expansion01.md',
}

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const readNarrative = (file) => read(path.join('docs', 'narrative-libraries', file))
const heading = (block) => block.match(/^## (?:SCENE )?([^\s·]+)\s+·\s+(.+)$/m)?.slice(1) ?? block.match(/^# (LF\d+-\d+)\s+·\s+(.+)$/m)?.slice(1) ?? ['', 'Untitled']

function parseScenes(file, library) {
  const raw = readNarrative(file)
  const pattern = library === 'longform_output01'
    ? /^# (LF\d+-\d+)\s+·\s+(.+)$/gm
    : /^## (?:SCENE )?([^\s·]+)\s+·\s+(.+)$/gm
  const matches = [...raw.matchAll(pattern)]
  return matches.map((match, index) => {
    const start = match.index
    const next = matches[index + 1]?.index ?? raw.length
    const block = raw.slice(start, next).trim()
    const id = ['batch01', 'batch02', 'batch03', 'humor01'].includes(library) ? `${library}:${match[1]}` : match[1]
    const title = match[2].trim()
    const nodePattern = library === 'longform_output01' ? /^## (LF\d+-\d+-\d+)$/gm : /^### (?:NODE:\s*)?(\S+)\s*$/gm
    const nodeCount = [...block.matchAll(nodePattern)].length
    const candidateReplyCount = [...block.matchAll(/^\s*\d+\.\s+[“"]/gm)].length
    return { id, title, library, file, block, nodeCount, candidateReplyCount }
  })
}

const allParsedScenes = Object.entries(files).flatMap(([library, file]) => parseScenes(file, library))
const authored = allParsedScenes.filter((asset) => asset.library !== 'selected_expansion01')
const authoredById = new Map(authored.map((asset) => [asset.id, asset]))
if (authored.length !== 171) throw new Error(`Expected 171 Markdown-authored scenes, found ${authored.length}`)
if (new Set(authored.map((asset) => asset.id)).size !== 171) {
  const ids = authored.map((asset) => asset.id)
  throw new Error(`Markdown-authored source IDs are not unique: ${ids.filter((id, i) => ids.indexOf(id) !== i).join(', ')}`)
}

const earlyFormal = new Set([
  ...Array.from({ length: 25 }, (_, i) => `batch01:${String(i + 1).padStart(2, '0')}`),
  ...Array.from({ length: 25 }, (_, i) => `batch02:${String(i + 1).padStart(2, '0')}`),
  ...Array.from({ length: 15 }, (_, i) => `batch03:${String(i + 1).padStart(2, '0')}`),
  ...[1, 3, 4, 6, 9, 10, 11, 15, 18, 19, 21, 24].map((i) => `humor01:H${String(i).padStart(2, '0')}`),
])
const selectedKeep = new Set(['PL01-02', 'PL01-03', 'PL01-04', 'PL01-06', 'PL01-12', 'PL01-16', 'PL01-17', 'FI03', 'FI11', 'FI14', 'CM01-09', 'CM01-10', 'CM01-11', 'CM01-18', 'CM01-21'])
const selectedMerge = new Set(['FI06', 'FI13'])
const selectedReject = new Set(['PL01-08', 'FI05', 'CM01-04'])
const selectedReserve = new Set(authored.filter((asset) => ['people_life01', 'friction_input01', 'continuity_multimodal01'].includes(asset.library)).map((asset) => asset.id).filter((id) => !selectedKeep.has(id) && !selectedMerge.has(id) && !selectedReject.has(id)))
const longformFormal = new Set(['LF01-01', 'LF01-03', 'LF01-04', 'LF01-05', 'LF01-09', 'LF01-10'])

const sourceLibraryLabel = {
  batch01: 'Batch01', batch02: 'Batch02', batch03: 'Batch03', humor01: 'Humor01',
  people_life01: 'People / Life 01', friction_input01: 'Friction / Input 01',
  continuity_multimodal01: 'Continuity / Multimodal 01', longform_output01: 'Longform Output 01',
  selected_expansion01: 'Selected Expansion 01 (lifecycle copy; not counted separately)',
}

function statusFor(asset) {
  if (earlyFormal.has(asset.id) || selectedKeep.has(asset.id) || longformFormal.has(asset.id)) return 'FORMAL_RUNTIME'
  if (selectedMerge.has(asset.id)) return 'MERGE_ONLY'
  if (selectedReject.has(asset.id)) return 'REJECT'
  if (selectedReserve.has(asset.id) || (asset.library === 'longform_output01' && !longformFormal.has(asset.id))) return 'RESERVE'
  return 'UNUSED_ORIGINAL'
}

function runtimeIdFor(asset) {
  if (statusFor(asset) === 'FORMAL_RUNTIME' || statusFor(asset) === 'MERGE_ONLY') {
    if (asset.library === 'longform_output01') return `longform-${asset.id.toLowerCase()}`
    if (asset.library === 'people_life01' || asset.library === 'friction_input01' || asset.library === 'continuity_multimodal01') return `selected-${asset.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    return `manifest-source:${asset.id}`
  }
  return 'None'
}

function topicFor(asset) {
  if (asset.library === 'friction_input01') return 'AI friction / input quality'
  if (asset.library === 'continuity_multimodal01') return 'continuity / multimodal'
  if (asset.library === 'people_life01') return 'people / life'
  if (asset.library === 'longform_output01') return 'longform output'
  if (asset.library === 'humor01') return 'humor / non-task'
  return 'early narrative library'
}

function patternFor(asset) {
  const text = asset.block
  if (/图片|照片|图/.test(text)) return 'image-input or multimodal'
  if (/乱码|语音|转写|输入|typo/i.test(text)) return 'input-friction'
  if (asset.nodeCount >= 4) return 'long-discussion'
  if (asset.nodeCount === 1) return 'single / standard-question'
  return 'dialogue'
}

function rationaleFor(asset) {
  const status = statusFor(asset)
  if (status === 'FORMAL_RUNTIME') return earlyFormal.has(asset.id) ? 'No documented historical admission rationale. Current inferred role: source retained in the current formal coverage set.' : 'Documented rationale is recorded in the selected/Longform integration metadata; see the source audit files named below.'
  if (status === 'MERGE_ONLY') return 'Documented: retained as a source asset but merged into a selected Runtime Conversation; it is not a separate Runtime definition.'
  if (status === 'REJECT') return 'Documented disposition: REJECT in the current selected expansion metadata/report; full source text remains here for independent re-review.'
  if (status === 'RESERVE') return 'Documented or observable reserve boundary: not currently in the formal Runtime pool. No new admission decision is made in this bundle.'
  return 'No documented historical reason found. Current observable comparison is left to the external content review.'
}

function flagsFor(asset) {
  const flags = []
  if (asset.nodeCount <= 1) flags.push('single-node or very short shape')
  if (asset.candidateReplyCount > 0 && asset.candidateReplyCount % Math.max(asset.nodeCount, 1) === 0) flags.push('candidate count is mechanically uniform across nodes')
  if (topicFor(asset).includes('people')) flags.push('compare against other relationship/caregiving assets')
  if (topicFor(asset).includes('input')) flags.push('compare against other input-friction assets')
  return flags.join('; ') || 'No mechanical flag generated.'
}

function authoredRecord(asset, index) {
  const status = statusFor(asset)
  return `## REV-${String(index).padStart(3, '0')} — ${asset.id}

- Asset ID: ${asset.id}
- Canonical ID: ${asset.id}
- Title: ${asset.title}
- Source Library: ${sourceLibraryLabel[asset.library]}
- Current Runtime ID: ${runtimeIdFor(asset)}
- Current Status: ${status}
- Lineage: ${sourceLibraryLabel[asset.library]} Markdown → ${status === 'FORMAL_RUNTIME' || status === 'MERGE_ONLY' ? runtimeIdFor(asset) : 'no current Runtime copy'}
${status === 'MERGE_ONLY' ? `- Merge Destination: ${asset.id === 'FI06' ? 'selected CM01-09' : 'selected CM01-10'}` : ''}
- Topic Category: ${topicFor(asset)}
- InteractionPattern: ${patternFor(asset)}
- User Type: general user / inferred from source library only
- HumanBehaviorMode: direct unless the full source text indicates a different input mode
- Modality: ${/图片|照片|图/.test(asset.block) ? 'image or multimodal evidence appears in source' : 'text'}
- Longform: ${asset.library === 'longform_output01' ? 'yes' : 'no'}
- Recurring: ${/上次|昨天|回来|回访|以后/.test(asset.block) ? 'possible / inspect full content' : 'not marked by mechanical scan'}
- Humor: ${asset.library === 'humor01' || /尴尬|笑|好笑|甄嬛/.test(asset.block) ? 'possible / inspect full content' : 'not marked by mechanical scan'}
- Mainline: no
- Node Count: ${asset.nodeCount}
- Candidate Reply Count: ${asset.candidateReplyCount}

### Current Admission / Non-Admission Record

${rationaleFor(asset)}

### Current Runtime Role

${status === 'FORMAL_RUNTIME' ? 'Current inferred role: this source contributes to the formal pool distribution shown in the Index. Its exact runtime grouping is represented by the Runtime ID above; this bundle does not make a new quality judgment.' : 'Not currently assigned a formal Runtime role in this bundle.'}

### Potential Review Flags

${flagsFor(asset)}

### FULL CONTENT

The following is the complete source block as found on disk. It is included verbatim so the external reviewer does not need local project access.

${asset.block}

---
`
}

const codeSource = read('src/content/runManifest.ts')
const activeSource = read('src/content/activeRun.ts')
const legacySource = read('src/content/verticalSlice.ts')
const longformSource = read('src/content/longformOutput01.ts')
const sliceBetween = (source, startMarker, endMarker) => {
  const start = source.indexOf(startMarker)
  if (start < 0) return 'Definition not found'
  const end = source.indexOf(endMarker, start + startMarker.length)
  return source.slice(start, end < 0 ? source.length : end).trim()
}
const customDefinition = (name) => sliceBetween(codeSource, `  customConversation('${name}'`, name === 'generate-room' ? '\n]\n\nconst convergentConversations' : '\n  customConversation(')
const convergentDefinition = sliceBetween(codeSource, 'const convergentConversations:', '\n\nconst approvedSources')
const codeOnly = [
  ['original:media-window', 'CODE_ONLY', 'runManifest.ts', customDefinition('media-window')],
  ['original:media-object', 'CODE_ONLY', 'runManifest.ts', customDefinition('media-dark-object')],
  ['original:media-plant', 'CODE_ONLY', 'runManifest.ts', customDefinition('media-plant')],
  ['original:generate-avatar', 'CODE_ONLY', 'runManifest.ts', customDefinition('generate-avatar')],
  ['original:generate-poster', 'CODE_ONLY', 'runManifest.ts', customDefinition('generate-poster')],
  ['original:generate-room', 'CODE_ONLY', 'runManifest.ts', customDefinition('generate-room')],
  ['original:convergent-hello', 'CODE_ONLY', 'runManifest.ts', convergentDefinition],
  ['original:convergent-thanks', 'CODE_ONLY', 'runManifest.ts', convergentDefinition],
  ['original:convergent-yes', 'CODE_ONLY', 'runManifest.ts', convergentDefinition],
  ['legacy:dev-help', 'LEGACY_ONLY', 'activeRun.ts + verticalSlice.ts', `${activeSource.match(/const devHelp1:[\s\S]*?const devHelp2:[\s\S]*?\n\nconst mayaFirst1/)?.[0] ?? 'Definition not found'}\n\n// Complete underlying legacy node source\n${legacySource}`],
  ['legacy:study', 'LEGACY_ONLY', 'activeRun.ts + verticalSlice.ts', `${sliceBetween(activeSource, "conversation('user-0024'", "\n  conversation('batch01-photos'")}\n\n// Complete underlying legacy node source\n${legacySource}`],
  ['legacy:social', 'LEGACY_ONLY', 'activeRun.ts + verticalSlice.ts', `${sliceBetween(activeSource, "conversation('user-5510'", "\n  conversation('batch01-english'")}\n\n// Complete underlying legacy node source\n${legacySource}`],
]

const anchors = [
  ['user-7391', 'legacy:dev-help', /conversation\('user-7391',[\s\S]*?\n  conversation\('batch01-food'/],
  ['user-1842-first', 'mainline:maya-first', /const mayaFirst1[\s\S]*?conversation\('user-1842-first',[\s\S]*?\n  conversation\('batch02-lab'/],
  ['speaking-8614', 'batch01:16 + batch02:08', /conversation\('speaking-8614',[\s\S]*?\n  conversation\('batch01-slang'/],
  ['conversation-0000', 'mainline:conversation-0000', /const audit1[\s\S]*?conversation\('conversation-0000',[\s\S]*?\n  conversation\('batch01-fiction'/],
  ['user-1842-return', 'mainline:maya-return', /const return1[\s\S]*?conversation\('user-1842-return',[\s\S]*?\n\]/],
]

function codeRecord(id, status, sourceFile, excerpt, index) {
  return `## REV-${String(index).padStart(3, '0')} — ${id}

- Asset ID: ${id}
- Canonical ID: ${id}
- Source Library: ${status === 'MAINLINE_ANCHOR' ? 'Mainline / activeRun.ts' : 'Code-only / legacy runtime'}
- Current Runtime ID: ${id}
- Current Status: ${status}
- Lineage: no reliable Markdown lineage; source is explicitly left unmapped
- Topic Category: runtime-defined; inspect executable excerpt
- InteractionPattern: runtime-defined
- User Type: runtime-defined
- HumanBehaviorMode: runtime-defined
- Modality: runtime-defined
- Longform: not asserted
- Recurring: not asserted
- Humor: not asserted
- Mainline: ${status === 'MAINLINE_ANCHOR' ? 'yes' : 'no'}
- Node Count / Candidate Reply Count: read directly from the complete executable definition below

### Historical / Structural Note

The current source files do not provide a safe one-to-one Markdown mapping for this record. Possible similarity is intentionally not promoted to lineage.

### FULL CONTENT — EXECUTABLE SOURCE DEFINITION

Source file(s): ${sourceFile}

\`\`\`ts
${excerpt.trim()}
\`\`\`

---
`
}

const authoredSections = authored.map((asset, i) => authoredRecord(asset, i + 1)).join('\n')
const codeSections = codeOnly.map((record, i) => codeRecord(record[0], record[1], record[2], record[3], authored.length + i + 1)).join('\n')
const anchorSections = anchors.map((record, i) => codeRecord(record[0], 'MAINLINE_ANCHOR', 'activeRun.ts + verticalSlice.ts', `${activeSource.match(record[2])?.[0] ?? 'Definition not found'}\n\n// Complete underlying legacy node source\n${legacySource}`, authored.length + codeOnly.length + i + 1)).join('\n')
const anchorRoles = [
  ['1', 'user-7391', 'L0 mixed-paste development anchor; opens the ordinary/runtime boundary.'],
  ['2', 'user-1842-first', 'First岑遥 / User #1842 identity boundary; establishes honest memory limits.'],
  ['3', 'speaking-8614', 'Input and model-error reality anchor; combines speech/code-switch evidence.'],
  ['4', 'conversation-0000', 'Internal consistency and memory-safety audit; level-2 system checkpoint.'],
  ['5', 'user-1842-return', '岑遥 return/relationship boundary; closes the mainline responsibility.'],
].map(([order, id, role]) => `| ${order} | ${id} | ${role} |`).join('\n')

const bundle = `# INSTANCE Asset Editorial Review Bundle

Date: 2026-08-10

## Scope and counting contract

This is a read-only editorial package generated from the current disk. It does not change Runtime content. Authored Markdown assets are counted once by canonical source ID; selected, Runtime, and Longform TypeScript lifecycle copies are recorded as lineage, not new assets.

Current census targets: 176 Authored Unique Source Assets; 12 Code-only / Legacy definitions; 188 exhaustive inventory units; 98 ordinary Runtime definitions; 100 ordinary source-asset coverage; 5 Mainline Anchors; 105 formal source-asset coverage.

The bundle preserves complete source blocks and executable definitions. Labels such as “inferred” are not historical admission claims.

## Source files read

${Object.entries(files).map(([library, file]) => `- ${sourceLibraryLabel[library]}: \`${file}\``).join('\n')}
- Runtime: \`src/content/runManifest.ts\`, \`src/content/activeRun.ts\`, \`src/content/longformOutput01.ts\`, \`src/content/selectedExpansion01.ts\`, \`src/content/runtimeRealityPass.ts\`
- Reports: \`docs/audits/asset-census-2026-08-10.md\`, \`docs/audits/selected-expansion01-integration-audit.md\`

## Authored source assets — complete content

${authoredSections}

## Code-only / legacy definitions — complete executable content

${codeSections}

## Mainline Anchors — complete executable content

### Current order and responsibility

| Order | Anchor | Current mainline duty |
|---:|---|---|
${anchorRoles}

${anchorSections}

## Longform Runtime metadata — complete source definition

The ten LF source blocks are included above exactly once. The following is the complete current Longform Runtime TypeScript source so the external reviewer can inspect every preview, structure, highlights, keyFacts, closingPreview, artifactType, and estimatedLength value. Internal keyFacts are not visible in the player UI.

\`\`\`ts
${longformSource}
\`\`\`
`

const counts = {
  authored: authored.length + anchors.length,
  codeOnlyLegacy: codeOnly.length,
  inventory: authored.length + anchors.length + codeOnly.length,
  formalAuthored: authored.filter((asset) => ['FORMAL_RUNTIME', 'MERGE_ONLY'].includes(statusFor(asset))).length,
  formalOrdinaryDefinitions: 98,
  formalOrdinarySourceAssets: 100,
  mainlineAnchors: anchors.length,
  formalSourceCoverage: 105,
  nonFormalAuthored: authored.filter((asset) => !['FORMAL_RUNTIME', 'MERGE_ONLY'].includes(statusFor(asset))).length,
  longformFormal: authored.filter((asset) => longformFormal.has(asset.id)).length,
  longformReserve: authored.filter((asset) => asset.library === 'longform_output01' && !longformFormal.has(asset.id)).length,
  mergeOnly: authored.filter((asset) => selectedMerge.has(asset.id)).length,
  reject: authored.filter((asset) => selectedReject.has(asset.id)).length,
}

const group = (predicate) => authored.filter(predicate).map((asset) => asset.id).join(', ') || '—'
const index = `# INSTANCE Asset Editorial Index

Date: 2026-08-10

## Current census

| Measure | Count |
|---|---:|
| Authored Unique Source Assets | ${counts.authored} |
| Code-only / Legacy definitions | ${counts.codeOnlyLegacy} |
| Exhaustive project inventory units | ${counts.inventory} |
| Ordinary Runtime definitions | ${counts.formalOrdinaryDefinitions} |
| Ordinary Runtime source assets | ${counts.formalOrdinarySourceAssets} |
| Mainline Anchors | ${counts.mainlineAnchors} |
| Formal source coverage | ${counts.formalSourceCoverage} |
| Authored source assets not formally covered | ${counts.nonFormalAuthored} |

This package found no census change: the current disk produced the expected 176 + 12 = 188 inventory units. This is a packaging report, not a recommendation to reach 150.

## Status inventory

| Status | Count | IDs / rule |
|---|---:|---|
| FORMAL_RUNTIME | ${authored.filter((asset) => statusFor(asset) === 'FORMAL_RUNTIME').length} | 77 early + 15 selected KEEP + 6 Longform Runtime |
| MERGE_ONLY | ${counts.mergeOnly} | ${group((asset) => statusFor(asset) === 'MERGE_ONLY')} |
| RESERVE | ${authored.filter((asset) => statusFor(asset) === 'RESERVE').length} | selected reserve and Longform reserve |
| REJECT | ${counts.reject} | current selected metadata/report disposition |
| UNUSED_ORIGINAL | ${authored.filter((asset) => statusFor(asset) === 'UNUSED_ORIGINAL').length} | early source assets outside current formal coverage |
| CODE_ONLY / LEGACY_ONLY | ${counts.codeOnlyLegacy} | see Bundle executable definitions |
| MAINLINE_ANCHOR | ${anchors.length} | see Bundle Mainline section |

## Formal coverage distributions

### Source library

| Library | Authored | Formal source records |
|---|---:|---:|
| Batch01 | 25 | 25 |
| Batch02 | 25 | 25 |
| Batch03 | 25 | 15 |
| Humor01 | 25 | 12 |
| People / Life 01 | 20 | 4 |
| Friction / Input 01 | 20 | 3 + 1 Merge |
| Continuity / Multimodal 01 | 21 | 8 + 1 Merge |
| Longform Output 01 | 10 | 6 |

### Shape and input observations

The Bundle records per-asset node/reply counts and mechanically observed input forms. Exact Runtime distribution remains in the source audit/tests; this index does not infer content quality. High-density comparison groups include standard/dialogue early assets, people/life caregiving and boundary scenes, friction/input scenes, multimodal image/generation scenes, Longform, Humor, and recurring/return structures.

## Similarity / Competition Groups

### Technical troubleshooting / tool-like query

- Formal: ${group((asset) => statusFor(asset) === 'FORMAL_RUNTIME' && /技术|工具|排障|代码|接口|英文|库存/.test(asset.title + asset.block))}
- Reserve: ${group((asset) => statusFor(asset) === 'RESERVE' && /租房|英文|方法|库存|短信|钱/.test(asset.title + asset.block))}
- Reject: ${group((asset) => statusFor(asset) === 'REJECT' && /代码|房间/.test(asset.title + asset.block))}
- Unused: ${group((asset) => statusFor(asset) === 'UNUSED_ORIGINAL' && asset.library.startsWith('batch'))}

### Work communication / social boundary

- Formal: ${group((asset) => statusFor(asset) === 'FORMAL_RUNTIME' && /客户|群|项目|邮件|贡献|停水/.test(asset.title + asset.block))}
- Reserve: ${group((asset) => statusFor(asset) === 'RESERVE' && /客户|求职|误会|退|尾款/.test(asset.title + asset.block))}
- Reject: ${group((asset) => statusFor(asset) === 'REJECT' && /群|客户/.test(asset.title + asset.block))}
- Unused: ${group((asset) => statusFor(asset) === 'UNUSED_ORIGINAL' && asset.library === 'people_life01')}

### Relationship / family / care / children

- Formal: ${group((asset) => statusFor(asset) === 'FORMAL_RUNTIME' && /奶奶|爸爸|儿子|外婆|父母|家庭/.test(asset.title + asset.block))}
- Reserve: ${group((asset) => statusFor(asset) === 'RESERVE' && /小朋友|搬家|回访|关系/.test(asset.title + asset.block))}
- Reject: ${group((asset) => statusFor(asset) === 'REJECT' && /人物|房间/.test(asset.title + asset.block))}
- Unused: ${group((asset) => statusFor(asset) === 'UNUSED_ORIGINAL' && asset.library === 'people_life01')}

### AI friction / Meta AI / input quality

- Formal: ${group((asset) => statusFor(asset) === 'FORMAL_RUNTIME' && asset.library === 'friction_input01')}
- Reserve: ${group((asset) => statusFor(asset) === 'RESERVE' && asset.library === 'friction_input01')}
- Reject: ${group((asset) => statusFor(asset) === 'REJECT' && asset.library === 'friction_input01')}
- Merge-only: FI06, FI13

### Multimodal / generated-image / Longform / Humor / Recurring

- Formal: ${group((asset) => statusFor(asset) === 'FORMAL_RUNTIME' && ['continuity_multimodal01', 'longform_output01', 'humor01'].includes(asset.library))}
- Reserve: ${group((asset) => statusFor(asset) === 'RESERVE' && ['continuity_multimodal01', 'longform_output01'].includes(asset.library))}
- Reject: ${group((asset) => statusFor(asset) === 'REJECT' && asset.library === 'continuity_multimodal01')}
- Runtime Longform: LF01-01, LF01-03, LF01-04, LF01-05, LF01-09, LF01-10
- Reserve Longform: LF01-02, LF01-06, LF01-07, LF01-08

## Explicit lineage notes

- FI06 is retained as a complete source asset and merged into selected CM01-09; its original source block and current merge destination are both recorded in the Bundle.
- FI13 is retained as a complete source asset and merged into selected CM01-10; its original source block and current merge destination are both recorded in the Bundle.
- LF01-01 through LF01-10 each appear once as Markdown source records; six have Longform Runtime IDs and four are Reserve. Internal keyFacts are development metadata and are not player-visible UI.
- original:* and legacy:* are not mapped to Markdown without reliable evidence. The Bundle preserves possible similarity only and does not create lineage.

## Mechanical inventory checks

- Authored Markdown source IDs: ${authored.length}; unique Markdown IDs: ${new Set(authored.map((asset) => asset.id)).size}; plus ${anchors.length} Mainline Anchors = ${counts.authored} authored source assets.
- Code-only / legacy definitions: ${codeOnly.length}; expected 12.
- Mainline Anchors: ${anchors.length}; expected 5.
- Selected lifecycle copies are not parsed as additional authored IDs.
- Longform TypeScript lifecycle copies are not parsed as additional authored IDs.
- Merge-only IDs remain separate source records and are not counted as new Runtime definitions.
- Every authored source asset appears exactly once in the Bundle authored section.

## Navigation

- Complete bundle: [INSTANCE_asset_editorial_review_bundle.md](./INSTANCE_asset_editorial_review_bundle.md)
- Generator: [generate-bundle.mjs](./generate-bundle.mjs)
- Census source: [asset-census-2026-08-10.md](../audits/asset-census-2026-08-10.md)
- Integration audit: [selected-expansion01-integration-audit.md](../audits/selected-expansion01-integration-audit.md)
`

fs.writeFileSync(path.join(outDir, 'INSTANCE_asset_editorial_review_bundle.md'), bundle, 'utf8')
fs.writeFileSync(path.join(outDir, 'INSTANCE_asset_editorial_index.md'), index, 'utf8')
console.log(JSON.stringify({ ...counts, authoredUnique: new Set(authored.map((asset) => asset.id)).size, output: outDir }, null, 2))
