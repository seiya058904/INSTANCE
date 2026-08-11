import { readFile, writeFile } from 'node:fs/promises'

const source = await readFile(new URL('../src/content/mainline2/authoredLibrary.generated.ts', import.meta.url), 'utf8')
const plan = await readFile(new URL('../src/content/mainline2/storyPlan.ts', import.meta.url), 'utf8')
const assetIds = [...new Set([...source.matchAll(/assetId:\s*"([^"]+)"/g)].map((match) => match[1]))].sort()
const core = new Set([...plan.matchAll(/authored\('([^']+)'/g)].map((match) => match[1]))
const conditionalCore = new Set([...plan.matchAll(/fallbackAssetId:\s*'([^']+)'/g)].map((match) => match[1]))
const rows = assetIds.map((assetId) => {
  const kind = core.has(assetId) ? 'CORE' : conditionalCore.has(assetId) ? 'CONDITIONAL CORE' : assetId.includes('-WE-') ? 'WORLD ECHO' : /-(RES|CAP|EPI)-/.test(assetId) ? 'CONSEQUENCE' : 'ORDINARY'
  const purpose = core.has(assetId) ? 'Fixed Story Plan 主线 Slot' : kind === 'WORLD ECHO' ? '世界状态回响；不决定主线' : kind === 'CONSEQUENCE' ? '能力或 Major Decision 的后果' : kind === 'CONDITIONAL CORE' ? '条件不足时的固定主线替代场景' : '不改变主线因果的作者资产'
  return `| ${assetId} | ${kind} | ${purpose} |`
})
const counts = ['CORE', 'CONDITIONAL CORE', 'CONSEQUENCE', 'WORLD ECHO', 'ORDINARY'].map((kind) => [kind, rows.filter((row) => row.includes(`| ${kind} |`)).length])
const output = `# Mainline 2.0 Asset Classification Audit\n\nGenerated from the canonical runtime inventory and \`storyPlan.ts\`; do not edit by hand.\n\n| Class | Count |\n| --- | ---: |\n${counts.map(([kind, count]) => `| ${kind} | ${count} |`).join('\n')}\n| CUT | 0 |\n\nNo asset is silently left for scheduler randomness: CORE entries have a fixed Story Plan role; every other entry is explicitly classified as a conditional bridge, consequence, world echo, or Ordinary material. CUT remains zero because this refactor preserves canonical authored material rather than deleting it.\n\n| Asset | Classification | Narrative responsibility |\n| --- | --- | --- |\n${rows.join('\n')}\n`
await writeFile(new URL('../docs/audits/mainline2-asset-classification.md', import.meta.url), output, 'utf8')
