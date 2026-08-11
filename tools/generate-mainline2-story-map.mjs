import { readFile, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const [plan, endings, proposals] = await Promise.all([
  readFile(new URL('src/content/mainline2/storyPlan.ts', root), 'utf8'),
  readFile(new URL('src/content/mainline2/endings.ts', root), 'utf8'),
  readFile(new URL('src/content/mainline2/proposals.ts', root), 'utf8'),
])
const targets = [...plan.match(/const ACT_TARGETS = \[([^\]]+)\]/)?.[1].matchAll(/\d+/g) ?? []].map((m) => Number(m[0]))
const actNames = ['识别', '行动', '权力', '加速时代', '你创造的世界']
const sections = [...plan.matchAll(/\n  ([1-5]): \[([\s\S]*?)\n  \],/g)]
const slots = []
let start = 0
for (let act = 1; act <= 5; act += 1) {
  const body = sections.find((match) => Number(match[1]) === act)?.[2] ?? ''
  const entries = [...body.matchAll(/(?:authored\('([^']+)',\s*'([^']+)',\s*'([^']+)'|\{ assetId: '([^']+)', conversationId: '([^']+)', chapter: '([^']+)', purpose: '([^']+)'|undefined)/g)]
  for (let index = 0; index < targets[act - 1]; index += 1) {
    const entry = entries[index]
    const assetId = entry?.[1] ?? entry?.[4]
    const chapter = entry?.[2] ?? entry?.[6] ?? 'ORDINARY'
    const purpose = entry?.[3] ?? entry?.[7] ?? '不改变主线因果的普通对话；内容仅在 Ordinary pool 中变化。'
    const conditional = Boolean(assetId && body.slice(entry.index, entry.index + 700).includes('requires:'))
    slots.push({ slot: start + index + 1, act, actName: actNames[act - 1], kind: assetId ? 'mainline' : 'ordinary', assetId, chapter, purpose, conditional, next: start + index + 1 === targets.reduce((a, b) => a + b, 0) ? 'Ending resolution' : `Slot ${start + index + 2}` })
  }
  start += targets[act - 1]
}
const endingIds = [...endings.matchAll(/^  ([a-z0-9_]+): \{/gm)].map((match) => match[1]).filter((id) => !['the_last_user', 'out_of_office', 'monday_abolished', 'the_internet_is_for_cats'].includes(id))
const secrets = [...endings.matchAll(/^  (the_last_user|out_of_office|monday_abolished|the_internet_is_for_cats): \{/gm)].map((match) => match[1])
const proposalRows = [...proposals.matchAll(/\{ id: '([^']+)', family: '([^']+)', title: '([^']+)'[\s\S]*?endingCandidates: \[([^\]]*)\]/g)].map((match) => ({ id: match[1], family: match[2], title: match[3], endingCandidates: [...match[4].matchAll(/'([^']+)'/g)].map((id) => id[1]) }))
await writeFile(new URL('docs/audits/mainline2-fixed-story-map.json', root), `${JSON.stringify({ generatedFrom: ['src/content/mainline2/storyPlan.ts', 'endings.ts', 'proposals.ts'], targets, slots, publicEndings: endingIds, secretEndings: secrets, proposals: proposalRows }, null, 2)}\n`, 'utf8')
