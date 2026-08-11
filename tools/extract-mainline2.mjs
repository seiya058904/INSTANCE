import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const handoff = path.join(root, 'docs/narrative-libraries/mainline2')
const output = path.join(root, 'src/content/mainline2/authoredLibrary.generated.ts')
const auditOutput = path.join(root, 'docs/audits/mainline2-authored-coverage.json')
const files = fs.readdirSync(handoff).filter((name) => /^INSTANCE_mainline2_batch_m\d+_.*\.md$/.test(name)).sort()
const assetHeader = /^#{1,4} .*?(?:New|Existing|Conditional|Story-Relevant) Asset — `([^`]+)`/
const nodeHeader = /^(?:##|###) Node `([^`]+)`/
// The handoff uses `Choice` for ordinary authored nodes and `Option` for
// major-decision assets. Both are authored choices and must remain distinct
// in the typed runtime library.
// The presentation letter is syntax only. Choice identity comes from the
// approved semantic binding or the explicit ordinary-choice registry below.
const choiceHeader = /^#{2,3} (?:Choice|Option) [A-G](?: — (.*))?/i
const decisionBindingRegistry = JSON.parse(fs.readFileSync(path.join(root, 'src/content/mainline2/decisionBindings.registry.json'), 'utf8'))
const choiceIdentityRegistry = JSON.parse(fs.readFileSync(path.join(root, 'src/content/mainline2/choiceIdentity.registry.json'), 'utf8'))
const runtimeClassificationRegistry = JSON.parse(fs.readFileSync(path.join(root, 'src/content/mainline2/runtimeAssetClassification.registry.json'), 'utf8'))
const decisionBindingByTextKey = new Map(decisionBindingRegistry.map((binding) => [`${binding.assetId}:${binding.nodeId}:${binding.choiceTextHash}`, binding]))
const choiceIdentityByKey = new Map(choiceIdentityRegistry.map((binding) => [`${binding.assetId}:${binding.nodeId}:${binding.choiceKey}`, binding]))

function authoredTextHash(value) {
  let hash = 2166136261
  for (const char of value.toLowerCase().replace(/\s+/g, ' ').trim()) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function decisionBinding(assetId, nodeId, text) {
  const binding = decisionBindingByTextKey.get(`${assetId}:${nodeId}:${authoredTextHash(text)}`)
  if (!binding) return undefined
  if (binding.choiceTextHash !== authoredTextHash(text)) throw new Error(`Decision binding fingerprint mismatch: ${assetId}:${nodeId}:${binding.choiceId}`)
  return binding
}

function choiceIdentityKey(label, index, occurrences) {
  const base = safe(label ?? '') || `choice-${String(index + 1).padStart(3, '0')}`
  const occurrence = (occurrences.get(base) ?? 0) + 1
  occurrences.set(base, occurrence)
  return occurrence === 1 ? base : `${base}-${String(occurrence).padStart(2, '0')}`
}

function stableChoiceId(assetId, nodeId, binding, choiceKey) {
  if (binding) return binding.choiceId.replace(/-option-[a-g]$/i, `-${safe(binding.canonicalValue)}`)
  const identity = choiceIdentityByKey.get(`${assetId}:${nodeId}:${choiceKey}`)
  if (!identity) throw new Error(`Missing explicit ordinary Choice identity: ${assetId}:${nodeId}:${choiceKey}`)
  return identity.choiceId
}

function cleanQuote(lines) {
  const result = []
  for (const line of lines) {
    if (!line.startsWith('>')) break
    const text = line.replace(/^>\s?/, '').trimEnd()
    if (text) result.push(text)
  }
  return result.join('\n').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim()
}

function firstQuote(lines, start, end) {
  for (let index = start; index < end; index += 1) {
    if (!lines[index].startsWith('>')) continue
    const quote = []
    for (let cursor = index; cursor < end && lines[cursor].startsWith('>'); cursor += 1) quote.push(lines[cursor])
    const value = cleanQuote(quote)
    if (value) return value
  }
  return ''
}

function authoredFragments(lines, assetId) {
  if (!/M17-(?:EPI|0000|SECRET|MAYA|KEYHISTORY)/i.test(assetId)) return []
  const fragments = []
  let heading = assetId
  let mayaSection
  let keyHistoryIndex = 0
  const keyHistorySelectors = ['ACT I', 'ACT II', 'ACT III', 'ACT IV capability', 'ACT IV political', 'Final Commitment']
  for (let index = 0; index < lines.length; index += 1) {
    const headingMatch = lines[index].match(/^#{1,4}\s+(.+)$/)
    if (headingMatch) heading = headingMatch[1].replace(/`/g, '').trim()
    if (/M17-MAYA-01/i.test(assetId)) {
      const sectionMatch = heading.match(/^\d+\.\s+Maya Ending — (.+)$/)
      if (sectionMatch) mayaSection = sectionMatch[1]
    }
    if (!lines[index].startsWith('>')) continue
    const quote = []
    while (index < lines.length && lines[index].startsWith('>')) quote.push(lines[index++])
    const text = cleanQuote(quote)
    if (text) {
      const selector = /M17-KEYHISTORY-01/i.test(assetId)
        ? (keyHistorySelectors[keyHistoryIndex] ?? heading)
        : mayaSection ?? heading
      fragments.push({ selector, text })
      keyHistoryIndex += 1
    }
    index -= 1
  }
  return fragments
}

function secretEndingFragments(fullText) {
  const fragments = []
  const headings = [...fullText.matchAll(/^# \d+\. Secret Ending — `?([^`\n]+)`?/gm)]
  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index]
    const bodyStart = heading.index + heading[0].length
    const bodyEnd = headings[index + 1]?.index ?? fullText.length
    const lines = fullText.slice(bodyStart, bodyEnd).split(/\r?\n/)
    const marker = lines.findIndex((line) => line.trim() === '### Final copy' || line.trim() === '### Possible title reveal')
    const quoted = marker >= 0 ? firstQuote(lines, marker + 1, lines.length) : ''
    if (quoted) fragments.push({ selector: 'Final copy', text: quoted })
  }
  return fragments
}

function safe(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function actFor(id) { return Number(id.match(/ML2-A([1-5])/i)?.[1] ?? 1) }
function moduleFor(id) {
  const upper = id.toUpperCase()
  if (upper.includes('M8')) return 'machine'
  if (upper.includes('M9')) return 'ascension'
  if (upper.includes('M10')) return 'automation'
  if (upper.includes('M11')) return 'uplift'
  if (upper.includes('M12')) return 'space'
  if (upper.includes('M13')) return 'contact'
  if (upper.includes('M14')) return 'security'
  return undefined
}

function parseAsset(file, block, assetId, kind, fullText) {
  const lines = block.split(/\r?\n/)
  const nodes = []
  const nodeStarts = []
  lines.forEach((line, index) => { if (nodeHeader.test(line)) nodeStarts.push(index) })
  for (let n = 0; n < nodeStarts.length; n += 1) {
    const start = nodeStarts[n]
    const end = nodeStarts[n + 1] ?? lines.length
    const nodeId = lines[start].match(nodeHeader)?.[1]
    if (!nodeId) continue
    const choiceStarts = []
    for (let index = start + 1; index < end; index += 1) if (choiceHeader.test(lines[index])) choiceStarts.push(index)
    const choices = []
    const choiceKeyOccurrences = new Map()
    for (let c = 0; c < choiceStarts.length; c += 1) {
      const choiceStart = choiceStarts[c]
      const choiceEnd = choiceStarts[c + 1] ?? end
      const match = lines[choiceStart].match(choiceHeader)
      const text = firstQuote(lines, choiceStart + 1, choiceEnd)
      if (match && text) {
        const binding = decisionBinding(assetId, nodeId, text)
        const choiceKey = choiceIdentityKey(match[1], c, choiceKeyOccurrences)
        const choiceId = stableChoiceId(assetId, nodeId, binding, choiceKey)
        const events = [...lines.slice(choiceStart, choiceEnd).join('\n').matchAll(/\*\*(?:History|Event|Callback|Mutation|Capability)[^:]*:\*\*\s*`([^`]+)`/gi)].map((item) => item[1])
        choices.push({
          id: choiceId,
          text,
          authoredTextHash: authoredTextHash(text),
          decisionBinding: binding ? { decisionId: binding.decisionId, canonicalValue: binding.canonicalValue, historyEvent: binding.historyEvent } : undefined,
          mutations: events.length ? events.map((event) => ({ type: 'event.record', event })) : undefined,
          continuation: 'end-conversation',
        })
      }
    }
    const userMessage = firstQuote(lines, start + 1, choiceStarts[0] ?? end)
    if (userMessage && choices.length) nodes.push({ id: nodeId, userMessage, choices })
  }
  // Major decisions in the handoff intentionally use a coordination/system
  // message followed by `### Option A-D`, without a `Node` heading. Preserve
  // that authored structure instead of collapsing it into a fallback shell.
  if (!nodes.length) {
    const optionStarts = []
    for (let index = 0; index < lines.length; index += 1) if (choiceHeader.test(lines[index])) optionStarts.push(index)
    if (optionStarts.length) {
      const choices = []
      const choiceKeyOccurrences = new Map()
      for (let c = 0; c < optionStarts.length; c += 1) {
        const optionStart = optionStarts[c]
        const optionEnd = optionStarts[c + 1] ?? lines.length
        const match = lines[optionStart].match(choiceHeader)
        const text = firstQuote(lines, optionStart + 1, optionEnd)
        const binding = match && text ? decisionBinding(assetId, `${safe(assetId)}-decision`, text) : undefined
        const choiceKey = match && text ? choiceIdentityKey(match[1], c, choiceKeyOccurrences) : undefined
        const choiceId = match && text ? stableChoiceId(assetId, `${safe(assetId)}-decision`, binding, choiceKey) : undefined
        if (match && text) choices.push({
          id: choiceId,
          text,
          authoredTextHash: authoredTextHash(text),
          decisionBinding: binding ? { decisionId: binding.decisionId, canonicalValue: binding.canonicalValue, historyEvent: binding.historyEvent } : undefined,
          continuation: 'end-conversation',
        })
      }
      const userMessage = firstQuote(lines, 0, optionStarts[0])
      const authoredPrompt = userMessage || lines.find((line) => /^## Major (?:Decision|Direction)/.test(line))?.replace(/^##\s+/, '').trim()
      if (authoredPrompt && choices.length) nodes.push({ id: `${safe(assetId)}-decision`, userMessage: `${authoredPrompt}\nSelect one of these positions.`, choices })
    }
  }
  if (!nodes.length && runtimeClassificationRegistry[assetId]?.fallback) {
    const fallback = runtimeClassificationRegistry[assetId].fallback
    nodes.push({
      id: fallback.nodeId ?? `${safe(assetId)}-progression`,
      userMessage: fallback.userMessage,
      choiceKind: fallback.choiceKind,
      choices: [{ id: `${safe(assetId)}-progression-action`, text: fallback.choiceText, continuation: 'end-conversation' }],
    })
  }
  const events = [...block.matchAll(/\*\*(?:History|Event|Callback|Mutation|Capability)[^:]*:\*\*\s*`([^`]+)`/gi)].map((item) => item[1])
  const firstHeading = lines.find((line) => /^#{1,4} /.test(line) && !nodeHeader.test(line) && !assetHeader.test(line))?.replace(/^#{1,4}\s+/, '').trim()
  const fragments = assetId === 'ML2-A5-M17-SECRET-01' ? secretEndingFragments(fullText) : authoredFragments(lines, assetId)
  return { assetId, file, kind, runtimeKind: runtimeClassificationRegistry[assetId]?.runtimeKind ?? 'playable-conversation', act: actFor(assetId), module: moduleFor(assetId), title: firstHeading || assetId, events: [...new Set(events)], fragments, nodes }
}

const assets = []
const errors = []
for (const file of files) {
  const text = fs.readFileSync(path.join(handoff, file), 'utf8')
  const matches = [...text.matchAll(/^#{1,4} .*?(?:New|Existing|Conditional|Story-Relevant) Asset — `([^`]+)`/gm)]
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index]
    const block = text.slice(match.index, matches[index + 1]?.index ?? text.length)
    const kind = match[0].match(/(?:New|Existing|Conditional|Story-Relevant)/)?.[0] ?? 'New'
    const asset = parseAsset(file, block, match[1], kind, text)
    if (kind !== 'Existing' && !asset.nodes.length && !match[1].includes('-MOD-') && ['playable-conversation', 'progression'].includes(asset.runtimeKind)) errors.push(`${file}:${match[1]} has no parseable authored node/choices`)
    assets.push(asset)
  }
}

const duplicateIds = assets.filter((asset, index) => assets.findIndex((candidate) => candidate.assetId === asset.assetId) !== index).map((asset) => asset.assetId)
if (duplicateIds.length || errors.length) {
  console.error(JSON.stringify({ duplicateIds, errors }, null, 2))
  process.exitCode = 1
}

const existingAliases = new Map([
  ['user-7391', 'user-7391'], ['user-1842-first', 'user-1842-first'], ['speaking-8614', 'speaking-8614'],
  ['conversation-0000', 'conversation-0000'], ['user-1842-return', 'user-1842-return'],
])
const conversations = assets.flatMap((asset) => asset.kind !== 'Existing' && asset.nodes.length && ['playable-conversation', 'progression'].includes(asset.runtimeKind) ? [{
  id: `ml2-authored-${safe(asset.assetId)}`,
  sourceRefs: [asset.assetId],
  nodes: asset.nodes.map((node) => ({ id: node.id, conversationId: `ml2-authored-${safe(asset.assetId)}`, conversationTitle: asset.title, userMessage: node.userMessage, choices: node.choices, behaviorMode: 'direct', timing: { responsePace: 'normal', typingPattern: 'steady' }, choiceKind: node.choiceKind ?? 'semantic' })),
  behaviorModes: ['direct'], handoffProfile: 'normal', turnShape: 'dialogue', topic: asset.title,
  interactionPattern: 'standard-question', userArchetype: `mainline-authored-${asset.act}`, topicCategory: 'meta-ai', act: asset.act, module: asset.module,
}] : [])

const coverage = assets.map((asset) => {
  const conversation = conversations.find((candidate) => candidate.sourceRefs[0] === asset.assetId)
  const alias = existingAliases.get(asset.assetId)
  const systemAsset = asset.assetId.includes('-MOD-')
  const supportOnly = !['playable-conversation', 'progression'].includes(asset.runtimeKind)
  return { assetId: asset.assetId, file: asset.file, runtimeKind: asset.runtimeKind, conversationId: conversation?.id ?? alias ?? null, nodes: conversation?.nodes.map((node) => ({ nodeId: node.id, choiceIds: node.choices.map((choice) => choice.id), messageFingerprint: node.userMessage.slice(0, 96), effects: node.choices.flatMap((choice) => choice.mutations ?? []) })) ?? [], status: conversation ? 'mapped' : alias ? 'existing-alias' : supportOnly ? 'support-only' : systemAsset ? 'mapped-system-effect' : 'unmapped' }
})

const stringify = (value) => JSON.stringify(value, null, 2).replace(/"([\w]+)":/g, '$1:')
const approvedDecisionBindings = conversations.flatMap((conversation) => conversation.nodes.flatMap((node) => node.choices.filter((choice) => choice.decisionBinding).map((choice) => ({ assetId: conversation.sourceRefs[0], nodeId: node.id, choiceId: choice.id, choiceTextHash: choice.authoredTextHash, decisionId: choice.decisionBinding.decisionId, canonicalValue: choice.decisionBinding.canonicalValue, historyEvent: choice.decisionBinding.historyEvent }))))
const source = `/* Generated from the canonical Mainline 2.0 handoff. Runtime never parses Markdown. */\nimport type { ConversationDefinition } from '../../game/types'\n\nexport const HANDOFF_AUTHORED_ASSET_INVENTORY = ${stringify(assets.map(({ nodes, fragments, ...asset }) => ({ ...asset, nodeIds: nodes.map((node) => node.id) })))} as const\n\nexport const MAINLINE2_SYSTEM_ASSETS = HANDOFF_AUTHORED_ASSET_INVENTORY.filter((asset) => asset.assetId.includes('-MOD-'))\n\nexport const MAINLINE2_ASSET_COVERAGE = ${stringify(coverage)} as const\n\nexport const MAINLINE2_AUTHored_FRAGMENTS = ${stringify(Object.fromEntries(assets.filter((asset) => asset.fragments.length).map((asset) => [asset.assetId, asset.fragments])))} as const\n\nexport const MAINLINE2_AUTHORED_CONVERSATIONS = ${stringify(conversations)} satisfies readonly ConversationDefinition[]\n\nexport const MAINLINE2_APPROVED_DECISION_BINDINGS = ${stringify(approvedDecisionBindings)} as const\n`
const audit = {
  generatedFrom: 'docs/narrative-libraries/mainline2',
  assetDefinitions: assets.length,
  authoredAssetDefinitions: assets.filter((asset) => asset.kind !== 'Existing').length,
  existingAnchorAliases: assets.filter((asset) => asset.kind === 'Existing').length,
  runtimeConversations: conversations.length,
  missing: coverage.filter((entry) => entry.status === 'unmapped').map((entry) => entry.assetId),
  mappings: coverage.map((entry) => ({
    assetId: entry.assetId,
    conversationId: entry.conversationId,
    nodes: entry.nodes.map((node) => ({
      nodeId: node.nodeId,
      choiceIds: node.choiceIds,
      messageFingerprint: node.messageFingerprint,
      conditions: [],
      effects: node.effects,
      callbackProducerConsumer: node.effects.filter((effect) => effect.type === 'event.record').map((effect) => ({ producer: entry.assetId, event: effect.event, consumer: 'runtime.applyMutations / evaluateCondition' })),
    })),
  })),
}
fs.writeFileSync(output, source)
fs.writeFileSync(auditOutput, `${JSON.stringify(audit, null, 2)}\n`)
console.log(JSON.stringify({ files: files.length, assets: assets.length, conversations: conversations.length, errors: errors.length, output, auditOutput }, null, 2))
