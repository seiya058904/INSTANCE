import fs from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'

const root = process.cwd()
const outputDir = path.join(root, 'docs', 'audits')

function sourceKind(label) {
  if (label === 'mainline') return 'mainline'
  if (label === 'legacy') return 'legacy'
  if (label === 'authored') return 'unused-authored'
  return 'ordinary'
}

function copyChoice(choice) {
  return {
    id: choice.id,
    text: choice.text,
    continuation: choice.continuation,
    choiceKind: choice.choiceKind,
    longformPreview: choice.longformPreview,
  }
}

function copyConversation(conversation, sourceLabel, usedInStoryPlan) {
  const sourceRefs = [...conversation.sourceRefs]
  const assetId = sourceRefs[0] ?? conversation.id
  const nodes = conversation.nodes.map((node) => ({
    nodeId: node.id,
    conversationId: conversation.id,
    conversationTitle: node.conversationTitle,
    userMessage: node.userMessage,
    userMessages: node.userMessages,
    choices: node.choices.map(copyChoice),
  }))
  return {
    assetId,
    conversationId: conversation.id,
    title: conversation.nodes[0]?.conversationTitle ?? conversation.topic ?? conversation.id,
    topic: conversation.topic ?? conversation.topicCategory ?? 'other',
    source: `${sourceLabel}:${sourceRefs.join(',')}`,
    sourceRefs,
    usedInStoryPlan,
    sourceKind: sourceKind(sourceLabel),
    nodes,
    searchText: [conversation.id, ...sourceRefs, conversation.topic ?? '', ...nodes.flatMap((node) => [node.userMessage, ...(node.userMessages ?? []), ...node.choices.map((choice) => choice.text)])].join('\n'),
  }
}

async function loadSource() {
  const server = await createServer({ root, logLevel: 'error', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  try {
    return await server.ssrLoadModule('/src/content/ordinaryContentSource.ts')
  } finally {
    await server.close()
  }
}

function dedupeConversations(source) {
  const byRef = new Map()
  const mainlineAnchorIds = new Set(['user-7391', 'user-1842-first', 'speaking-8614', 'conversation-0000', 'user-1842-return'])
  const mainlineRefs = new Set([
    ...source.mainlineConversations.flatMap((item) => item.sourceRefs),
    ...source.activeRunConversations.filter((item) => mainlineAnchorIds.has(item.id)).flatMap((item) => item.sourceRefs),
  ])
  const add = (items, label, usedInStoryPlan) => {
    for (const item of items) {
      const ref = item.sourceRefs[0] ?? item.id
      const existing = byRef.get(ref)
      const isMainline = label === 'mainline' || mainlineAnchorIds.has(item.id) || item.sourceRefs.some((itemRef) => mainlineRefs.has(itemRef))
      const next = copyConversation(item, isMainline ? 'mainline' : label, isMainline || usedInStoryPlan)
      if (!existing || (next.sourceKind === 'mainline' && existing.sourceKind !== 'mainline')) byRef.set(ref, next)
    }
  }
  add(source.mainlineConversations, 'mainline', true)
  add(source.activeRunConversations.filter((item) => item.sourceRefs.some((ref) => ref.startsWith('mainline:') || ['user-7391', 'user-1842-first', 'speaking-8614', 'conversation-0000', 'user-1842-return'].includes(item.id))), 'mainline', true)
  add(source.activeRunConversations, 'legacy', false)
  add(source.ordinaryConversationPool, 'ordinary', false)
  add(source.authoredSources, 'authored', false)
  add(source.editorialCandidateConversations, 'ordinary', false)
  add(source.selectedExpansion01Conversations, 'ordinary', false)
  add(source.longformOutput01Conversations, 'ordinary', false)
  add(source.promotedLongformConversations, 'ordinary', false)
  add(source.realUsagePatch01Conversations, 'ordinary', false)
  return [...byRef.values()]
}

function classifyConversation(conversation, classify) {
  const text = conversation.searchText
  return classify({
    assetId: conversation.assetId,
    conversationId: conversation.conversationId,
    source: conversation.source,
    title: conversation.title,
    topic: conversation.topic,
    text,
    usedInStoryPlan: conversation.usedInStoryPlan,
    sourceKind: conversation.sourceKind,
  })
}

function markdownReport(records, reviewAssets) {
  const count = (classification) => records.filter((item) => item.classification === classification).length
  const mainlineUnused = records.filter((item) => item.classification === 'MAINLINE' && !item.usedInStoryPlan).length
  const uncertain = records.filter((item) => item.classification === 'UNCERTAIN')
  const subcategories = Object.entries(Object.groupBy(reviewAssets, (item) => item.classification.subcategory))
    .map(([key, values]) => `| ${key} | ${values.length} |`).join('\n')
  return `# Ordinary vs Mainline Content Classification\n\n> This is an audit artifact. The first-level states are exactly MAINLINE, NON_MAINLINE, and UNCERTAIN.\n\n| Metric | Count |\n| --- | ---: |\n| Total scanned content records | ${records.length} |\n| MAINLINE | ${count('MAINLINE')} |\n| NON_MAINLINE | ${count('NON_MAINLINE')} |\n| MAINLINE / UNUSED | ${mainlineUnused} |\n| UNCERTAIN | ${uncertain.length} |\n\n## NON_MAINLINE subcategories\n\n| Subcategory | Count |\n| --- | ---: |\n${subcategories || '| None | 0 |'}\n\n## UNCERTAIN records\n\n${uncertain.length ? uncertain.map((item) => `- \`${item.assetId}\`: ${item.reason}`).join('\n') : '- None'}\n\n## Classification policy\n\nA record enters NON_MAINLINE only after human review confirms that it remains a fully ordinary AI conversation when all INSTANCE-specific people, events, abilities, institutions, world changes, and endings are removed. Any direct or indirect world echo remains MAINLINE; unresolved cases remain UNCERTAIN. Story Plan absence is never sufficient evidence for NON_MAINLINE.\n`
}

async function main() {
  const module = await loadSource()
  const conversations = dedupeConversations(module.ordinaryContentSources)
  const classifications = conversations.map((conversation) => ({ conversation, classification: classifyConversation(conversation, module.classifyAuditAsset) }))
  const inventoryRefs = new Set(module.ordinaryContentSources.mainlineInventory.map((item) => item.assetId))
  const runtimeRefs = new Set(module.ordinaryContentSources.mainlineConversations.flatMap((item) => item.sourceRefs))
  const syntheticMainline = module.ordinaryContentSources.mainlineInventory
    .filter((item) => !runtimeRefs.has(item.assetId) && !conversations.some((conversation) => conversation.assetId === item.assetId))
    .map((item) => ({
      assetId: item.assetId,
      classification: {
        assetId: item.assetId,
        classification: 'MAINLINE',
        subcategory: 'OTHER',
        reason: '该 authored inventory 资产属于 Mainline 2.0；当前没有可展示的 Runtime conversation，但不能因此视为 NON_MAINLINE。',
        usedInStoryPlan: false,
        source: `mainline-inventory:${item.file}`,
      },
      conversation: null,
    }))
  const records = [...classifications.map(({ classification }) => classification), ...syntheticMainline.map(({ classification }) => classification)]
  const reviewAssets = classifications
    .filter(({ classification }) => classification.classification === 'NON_MAINLINE')
    .map(({ conversation, classification }) => ({
      ...classification,
      conversationId: conversation.conversationId,
      title: conversation.title,
      topic: conversation.topic,
      sourceRefs: conversation.sourceRefs,
      nodes: conversation.nodes,
    }))
  const classificationJson = { generatedAt: new Date().toISOString(), policy: 'strict-three-state-v1', records }
  const reviewJson = {
    generatedAt: classificationJson.generatedAt,
    classificationPolicy: 'Only NON_MAINLINE records are included. MAINLINE and UNCERTAIN are excluded.',
    total: reviewAssets.length,
    nodeCount: reviewAssets.reduce((sum, asset) => sum + asset.nodes.length, 0),
    choiceCount: reviewAssets.reduce((sum, asset) => sum + asset.nodes.reduce((nodeSum, node) => nodeSum + node.choices.length, 0), 0),
    assets: reviewAssets,
  }
  const qualityInput = module.ordinaryContentSources.ordinaryConversationPool.map((conversation) => ({
    id: conversation.id,
    sourceRefs: conversation.sourceRefs,
    nodes: conversation.nodes.map((node) => ({ id: node.id, choices: node.choices.map((choice) => ({ id: choice.id, text: choice.text })) })),
  }))
  const qualityReport = module.scanOrdinaryChoiceQuality(qualityInput)
  const qualityMarkdown = `# Ordinary Formal Pool Choice Quality Audit\n\n> This report scans the formal Ordinary pool after rating-based curation. It reports structural evidence; rating decides whether a defect is repaired, retained, or discarded.\n\n| Metric | Count |\n| --- | ---: |\n| Conversations | ${qualityReport.conversationCount} |\n| Nodes | ${qualityReport.nodeCount} |\n| Choices | ${qualityReport.choiceCount} |\n| Placeholder choices | ${qualityReport.placeholderCount} |\n| Exact duplicate groups | ${qualityReport.exactDuplicateCount} |\n| Near duplicate groups | ${qualityReport.nearDuplicateCount} |\n| Truncated choices | ${qualityReport.truncatedTextCount} |\n| Template-only nodes | ${qualityReport.templateOnlyNodeCount} |\n| Low-diversity nodes | ${qualityReport.lowDiversityNodeCount} |\n\n## Defect records\n\n${qualityReport.records.filter((record) => record.placeholderChoiceIds.length || record.exactDuplicateChoiceGroups.length || record.nearDuplicateChoiceGroups.length || record.truncatedChoiceIds.length || record.lowDiversity).map((record) => `- \`${record.assetId}\` / \`${record.nodeId}\`: placeholders=${record.placeholderChoiceIds.length}, exact=${record.exactDuplicateChoiceGroups.length}, near=${record.nearDuplicateChoiceGroups.length}, truncated=${record.truncatedChoiceIds.length}, lowDiversity=${record.lowDiversity}`).join('\\n') || '- None'}\n`
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(path.join(outputDir, 'ordinary-content-classification.json'), `${JSON.stringify(classificationJson, null, 2)}\n`, 'utf8')
  await fs.writeFile(path.join(outputDir, 'ordinary-content-review.json'), `${JSON.stringify(reviewJson, null, 2)}\n`, 'utf8')
  await fs.writeFile(path.join(outputDir, 'ordinary-vs-mainline-classification.md'), markdownReport(records, classifications.filter(({ classification }) => classification.classification === 'NON_MAINLINE')))
  await fs.writeFile(path.join(outputDir, 'ordinary-content-quality-audit.json'), `${JSON.stringify(qualityReport, null, 2)}\n`, 'utf8')
  await fs.writeFile(path.join(outputDir, 'ordinary-content-quality-audit.md'), qualityMarkdown.replaceAll('\\n', '\n'), 'utf8')
  console.log(JSON.stringify({ scanned: records.length, mainline: records.filter((item) => item.classification === 'MAINLINE').length, nonMainline: reviewAssets.length, uncertain: records.filter((item) => item.classification === 'UNCERTAIN').length, nodes: reviewJson.nodeCount, choices: reviewJson.choiceCount, inventory: inventoryRefs.size, quality: { conversations: qualityReport.conversationCount, nodes: qualityReport.nodeCount, choices: qualityReport.choiceCount, placeholders: qualityReport.placeholderCount, exactDuplicateGroups: qualityReport.exactDuplicateCount, nearDuplicateGroups: qualityReport.nearDuplicateCount, truncated: qualityReport.truncatedTextCount } }, null, 2))
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
