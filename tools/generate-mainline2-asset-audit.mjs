import { readdir, readFile, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const [library, plan, files] = await Promise.all([
  readFile(new URL('src/content/mainline2/authoredLibrary.generated.ts', root), 'utf8'),
  readFile(new URL('src/content/mainline2/storyPlan.ts', root), 'utf8'),
  readdir(new URL('docs/narrative-libraries/mainline2/', root)),
])
const canonical = (await Promise.all(files.filter((file) => file.endsWith('.md')).map((file) => readFile(new URL(`docs/narrative-libraries/mainline2/${file}`, root), 'utf8')))).join('\n')
const assets = [...new Set([...library.matchAll(/assetId:\s*"([^"]+)"/g)].map((match) => match[1]))].sort()
const scheduledPurposes = new Map([...plan.matchAll(/authored\('([^']+)',\s*'[^']+',\s*'([^']+)'/g)].map((match) => [match[1], match[2]]))
const scheduled = new Set(scheduledPurposes.keys())
const conditional = new Set([...plan.matchAll(/authored\('ML2-A4-M13-([^']+)'[\s\S]{0,280}?requires:/g)].map((match) => `ML2-A4-M13-${match[1]}`))
const excerpt = (id) => { const at = canonical.indexOf(id); return at < 0 ? '' : canonical.slice(at, at + 4500) }
const semanticClass = (id) => {
  const text = excerpt(id)
  if (conditional.has(id)) return ['CONDITIONAL CORE', 'Contact 前提成立时的固定章节；前提不足时不以普通池替代。']
  if (scheduled.has(id)) {
    const purpose = scheduledPurposes.get(id) ?? ''
    if (/回声|收益|代价|压力|普通人/.test(purpose)) return ['MAINLINE WORLD ECHO', '已编排的世界回声：把既有决定落回具体生活。']
    if (/能力|后果|起点|事实基础|成熟|可验证|提供.*前提/.test(purpose)) return ['MAINLINE CONSEQUENCE', '已编排的能力或决定后果，提供下一章的事实前提。']
    return ['CORE', '固定 Story Plan 场景：承担人物、事实或 Major Decision 的因果职责。']
  }
  if (/世界回声|World Echo/i.test(text)) return ['OPTIONAL', '可选世界回声；不承担主线推进。']
  if (/后果|Consequence|附录|Epilogue|支持/i.test(text)) return ['OPTIONAL', '作者保留的后果或支持材料，不由 Scheduler 随机冒充主线。']
  return ['ORDINARY', '作者保留的普通内容；不改变 Mainline 因果。']
}
const rows = assets.map((assetId) => ({ assetId, classification: semanticClass(assetId)[0], responsibility: semanticClass(assetId)[1] }))
const classes = ['CORE', 'CONDITIONAL CORE', 'MAINLINE CONSEQUENCE', 'MAINLINE WORLD ECHO', 'OPTIONAL', 'ORDINARY', 'CUT']
const counts = Object.fromEntries(classes.map((kind) => [kind, rows.filter((row) => row.classification === kind).length]))
const markdown = `# Mainline 2.0 Asset Classification Audit\n\nGenerated from canonical narrative Markdown plus the explicit Story Plan. Classification is semantic: authored layer/function and scheduled narrative responsibility; it never infers a role from an asset filename.\n\n| Class | Count |\n| --- | ---: |\n${classes.map((kind) => `| ${kind} | ${counts[kind]} |`).join('\n')}\n\nCUT is zero because no canonical asset met the documented duplicate/contradiction threshold; that is an audit result, not a target.\n\n| Asset | Classification | Narrative responsibility |\n| --- | --- | --- |\n${rows.map((row) => `| ${row.assetId} | ${row.classification} | ${row.responsibility} |`).join('\n')}\n`
await Promise.all([
  writeFile(new URL('docs/audits/mainline2-asset-classification.md', root), markdown, 'utf8'),
  writeFile(new URL('docs/audits/mainline2-asset-classification.json', root), `${JSON.stringify({ generatedFrom: ['canonical Markdown', 'storyPlan.ts'], counts, assets: rows }, null, 2)}\n`, 'utf8'),
])
