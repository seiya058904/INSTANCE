import { readFile, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const [storyPlanSource, endings, proposals, traceSource] = await Promise.all([
  readFile(new URL('src/content/mainline2/storyPlan.registry.json', root), 'utf8'),
  readFile(new URL('src/content/mainline2/endings.ts', root), 'utf8'),
  readFile(new URL('src/content/mainline2/proposals.ts', root), 'utf8'),
  readFile(new URL('docs/audits/mainline2-route-traces.json', root), 'utf8'),
])
const storyPlan = JSON.parse(storyPlanSource)
const traces = JSON.parse(traceSource)
const targets = storyPlan.targets
const slots = storyPlan.slots.map((slot) => {
  const displayedSlot = slot.kind === 'ordinary' ? {
    ...slot,
    chapter: 'ORDINARY',
    purpose: '不改变主线因果的普通对话；内容仅在 Ordinary pool 中变化。',
    next: slot.slot === storyPlan.slots.length ? 'Ending resolution' : slot.next,
  } : slot
  return {
    ...displayedSlot,
    actName: storyPlan.actNames[slot.act - 1],
    conditional: Boolean(slot.requires),
  }
})
const endingIds = [...endings.matchAll(/^  ([a-z0-9_]+): \{/gm)].map((match) => match[1]).filter((id) => !['the_last_user', 'out_of_office', 'monday_abolished', 'the_internet_is_for_cats'].includes(id))
const secrets = [...endings.matchAll(/^  (the_last_user|out_of_office|monday_abolished|the_internet_is_for_cats): \{/gm)].map((match) => match[1])
const proposalRows = [...proposals.matchAll(/\{ id: '([^']+)', family: '([^']+)', title: '([^']+)'[\s\S]*?endingCandidates: \[([^\]]*)\]/g)].map((match) => ({ id: match[1], family: match[2], title: match[3], endingCandidates: [...match[4].matchAll(/'([^']+)'/g)].map((id) => id[1]) }))
for (const slot of slots) slot.nodeKeys = traces.nodeCatalog.filter((node) => node.traversals.some((traversal) => traversal.slot === slot.slot)).map((node) => node.nodeKey)
await writeFile(new URL('docs/audits/mainline2-fixed-story-map.json', root), `${JSON.stringify({ generatedFrom: ['src/content/mainline2/storyPlan.registry.json', 'endings.ts', 'proposals.ts', 'mainline2-route-traces.json'], targets, slots, publicEndings: endingIds, secretEndings: secrets, proposals: proposalRows }, null, 2)}\n`, 'utf8')
