import { readFile, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const classes = ['CORE', 'CONDITIONAL CORE', 'MAINLINE CONSEQUENCE', 'MAINLINE WORLD ECHO', 'OPTIONAL', 'ORDINARY', 'CUT']
const requiredFields = [
  'assetId',
  'classification',
  'narrativePurpose',
  'character',
  'prerequisite',
  'payoff',
  'usedByStoryPlan',
  'routeFamilies',
  'dispositionRationale',
].sort()

const [librarySource, registrySource] = await Promise.all([
  readFile(new URL('src/content/mainline2/authoredLibrary.generated.ts', root), 'utf8'),
  readFile(new URL('src/content/mainline2/editorialClassification.registry.json', root), 'utf8'),
])
const registry = JSON.parse(registrySource)
const inventoryBlock = librarySource.match(/export const HANDOFF_AUTHORED_ASSET_INVENTORY = \[([\s\S]*?)\n\] as const/)
if (!inventoryBlock) throw new Error('Cannot find canonical HANDOFF_AUTHORED_ASSET_INVENTORY')
const canonicalIds = [...inventoryBlock[1].matchAll(/assetId:\s*"([^"]+)"/g)].map((match) => match[1]).sort()
const registeredIds = registry.map((asset) => asset.assetId).sort()

if (registry.length !== 330 || new Set(registeredIds).size !== 330 || JSON.stringify(registeredIds) !== JSON.stringify(canonicalIds)) {
  throw new Error(`Editorial registry inventory mismatch: canonical=${canonicalIds.length}, registry=${registry.length}, unique=${new Set(registeredIds).size}`)
}
for (const asset of registry) {
  const fields = Object.keys(asset).sort()
  if (JSON.stringify(fields) !== JSON.stringify(requiredFields)) throw new Error(`Editorial registry fields mismatch: ${asset.assetId}`)
  if (!classes.includes(asset.classification)) throw new Error(`Unknown editorial classification: ${asset.assetId}=${asset.classification}`)
  for (const field of ['narrativePurpose', 'character', 'prerequisite', 'payoff', 'dispositionRationale']) {
    if (typeof asset[field] !== 'string' || !asset[field].trim()) throw new Error(`Empty ${field}: ${asset.assetId}`)
  }
  if (typeof asset.usedByStoryPlan !== 'boolean') throw new Error(`Invalid usedByStoryPlan: ${asset.assetId}`)
  if (!Array.isArray(asset.routeFamilies) || !asset.routeFamilies.length || asset.routeFamilies.some((route) => typeof route !== 'string' || !route.trim())) {
    throw new Error(`Invalid routeFamilies: ${asset.assetId}`)
  }
}

const counts = Object.fromEntries(classes.map((kind) => [kind, registry.filter((row) => row.classification === kind).length]))
const cell = (value) => String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')
const markdown = `# Mainline 2.0 Editorial Classification Registry Audit

This audit is rendered verbatim from the explicit editorial registry. The generator validates the canonical 330-asset inventory and fields, but does not infer classification, character, purpose, prerequisite, payoff, route family, or disposition from filenames or keywords.

| Class | Count |
| --- | ---: |
${classes.map((kind) => `| ${kind} | ${counts[kind]} |`).join('\n')}

Zero-count classes remain listed because the editorial review found no asset that should be ordinary-only or cut from the canonical library; zero is an outcome, not a target.

| Asset | Classification | Narrative purpose | Character | Prerequisite | Payoff | Story Plan | Route families | Disposition rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${registry.map((row) => `| ${cell(row.assetId)} | ${cell(row.classification)} | ${cell(row.narrativePurpose)} | ${cell(row.character)} | ${cell(row.prerequisite)} | ${cell(row.payoff)} | ${row.usedByStoryPlan ? 'yes' : 'no'} | ${cell(row.routeFamilies.join(', '))} | ${cell(row.dispositionRationale)} |`).join('\n')}
`

await Promise.all([
  writeFile(new URL('docs/audits/mainline2-asset-classification.md', root), markdown, 'utf8'),
  writeFile(new URL('docs/audits/mainline2-asset-classification.json', root), `${JSON.stringify({
    generatedFrom: [
      'src/content/mainline2/editorialClassification.registry.json',
      'HANDOFF_AUTHORED_ASSET_INVENTORY',
    ],
    counts,
    assets: registry,
  }, null, 2)}\n`, 'utf8'),
])
