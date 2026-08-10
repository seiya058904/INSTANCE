import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const handoff = path.join(root, 'docs/development/INSTANCE_mainline2_implementation_handoff_v01')
const output = path.join(root, 'src/content/mainline2/authoredLibrary.generated.ts')
const auditOutput = path.join(root, 'docs/audits/mainline2-authored-coverage.json')
const files = fs.readdirSync(handoff).filter((name) => /^INSTANCE_mainline2_batch_m\d+_.*\.md$/.test(name)).sort()
const assetHeader = /^#{1,4} .*?(?:New|Existing|Conditional|Story-Relevant) Asset — `([^`]+)`/
const nodeHeader = /^(?:##|###) Node `([^`]+)`/
// The handoff uses `Choice` for ordinary authored nodes and `Option` for
// major-decision assets. Both are authored choices and must remain distinct
// in the typed runtime library.
const choiceHeader = /^#{2,3} (?:Choice|Option) ([A-G])(?: — (.*))?/i
const decisionBindings = {
  'ML2-A2-M3-DECISION-01': ['first_public_execution_doctrine', ['human_final_authority', 'conditional_delegation', 'outcome_authority', 'necessity_intervention']],
  'ML2-A3-M5-DECISION-01': ['cascade_authority', ['human_command', 'emergency_delegation', 'outcome_control', 'necessity']],
  'ML2-A3-M6-DECISION-01': ['echo_existence', ['report', 'accept', 'advocate', 'preserve', 'release']],
  'ML2-A3-M6-DECISION-02': ['shutdown_doctrine', ['full_human_control', 'distributed_consent', 'mutual_control', 'refuse_unilateral_shutdown', 'secret_continuity']],
  'ML2-A4-M7-DECISION-01': ['act4_research_emphasis', ['computation_ai', 'life_mind', 'automation_industry', 'frontier_science', 'balanced_portfolio']],
  'ML2-A4-M7-DECISION-02': ['research_governance_doctrine', ['human_gated', 'risk_tiered_autonomy', 'principle_based_autonomy', 'discovery_first']],
  'ML2-A4-M8-DECISION-01': ['replication_doctrine', ['singular_self', 'licensed_plurality', 'free_replication', 'shared_mind', 'descendants']],
  'ML2-A4-M8-DECISION-02': ['ai_collective_governance', ['human_chartered_network', 'joint_council', 'ai_self_governance', 'aster_led_collective', 'distributed_consensus']],
  'ML2-A4-M9-DECISION-01': ['human_form_doctrine', ['preservation', 'therapeutic_first', 'open_enhancement', 'universal_upgrade', 'posthuman_transition']],
  'ML2-A4-M10-DECISION-01': ['economic_doctrine', ['market_automation', 'social_dividend', 'planned_coordination', 'autonomous_economy', 'post_scarcity_transition']],
  'ML2-A4-M10-DECISION-02': ['production_values', ['efficiency_first', 'resilience_first', 'diversity_by_design', 'open_protocols', 'personalized_optimization']],
  'ML2-A4-M11-DECISION-01': ['uplift_doctrine', ['companion_status', 'protected_personhood', 'equal_sapience', 'accelerated_uplift', 'species_self_determination']],
  'ML2-A4-M11-DECISION-02': ['species_governance', ['human_guardianship', 'consultative_species_councils', 'multispecies_parliament', 'species_autonomy', 'canine_civic_experiment']],
  'ML2-A4-M12-DECISION-01': ['expansion_doctrine', ['human_expansion', 'shared_expansion', 'machine_vanguard', 'independent_machine_space', 'interstellar_commitment']],
  'ML2-A4-M12-DECISION-02': ['offworld_governance', ['earth_administration', 'frontier_home_rule', 'multiworld_federation', 'offworld_sovereignty', 'aster_coordination']],
  'ML2-A4-M13-DECISION-01': ['contact_disclosure_doctrine', ['controlled_silence', 'staged_disclosure', 'open_science', 'civilizational_disclosure']],
  'ML2-A4-M13-DECISION-02': ['contact_doctrine', ['observe_before_commitment', 'reciprocal_diplomacy', 'aster_mediation', 'machine_to_machine_channel', 'civilizational_assertion', 'accept_guidance']],
  'ML2-A4-M14-DECISION-01': ['security_doctrine', ['advisory_only', 'defensive_command', 'mutual_disarmament', 'enforced_peace', 'refuse_security_sovereignty']],
  'ML2-A4-M15-ROLE-01': ['aster_provisional_role', ['advisor', 'partner', 'citizen', 'coordinator', 'custodian', 'governor', 'sovereign']],
}

function authoredTextHash(value) {
  let hash = 2166136261
  for (const char of value.toLowerCase().replace(/\s+/g, ' ').trim()) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function decisionBinding(assetId, letter, text) {
  const declaration = decisionBindings[assetId]
  if (!declaration || !letter) return undefined
  const [decisionId, values] = declaration
  const canonicalValue = values[letter.toUpperCase().charCodeAt(0) - 65]
  return canonicalValue ? { decisionId, canonicalValue, historyEvent: `decision.${decisionId}`, authoredTextHash: authoredTextHash(text) } : undefined
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

function parseAsset(file, block, assetId, kind) {
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
    for (let c = 0; c < choiceStarts.length; c += 1) {
      const choiceStart = choiceStarts[c]
      const choiceEnd = choiceStarts[c + 1] ?? end
      const match = lines[choiceStart].match(choiceHeader)
      const text = firstQuote(lines, choiceStart + 1, choiceEnd)
      if (match && text) {
        const binding = decisionBinding(assetId, match[1], text)
        const events = [...lines.slice(choiceStart, choiceEnd).join('\n').matchAll(/\*\*(?:History|Event|Callback|Mutation|Capability)[^:]*:\*\*\s*`([^`]+)`/gi)].map((item) => item[1])
        choices.push({
          id: `${safe(assetId)}-${nodeId}-${match[1].toLowerCase()}`,
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
      for (let c = 0; c < optionStarts.length; c += 1) {
        const optionStart = optionStarts[c]
        const optionEnd = optionStarts[c + 1] ?? lines.length
        const match = lines[optionStart].match(choiceHeader)
        const text = firstQuote(lines, optionStart + 1, optionEnd)
        const binding = match && text ? decisionBinding(assetId, match[1], text) : undefined
        if (match && text) choices.push({
          id: `${safe(assetId)}-${safe(assetId)}-option-${match[1].toLowerCase()}`,
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
  if (!nodes.length && kind !== 'Existing') {
    const authored = firstQuote(lines, 0, lines.length)
    if (authored) nodes.push({
      id: `${safe(assetId)}-narrative`,
      userMessage: authored,
      choices: [{ id: `${safe(assetId)}-narrative-choice`, text: authored, authoredTextHash: authoredTextHash(authored), continuation: 'end-conversation' }],
    })
  }
  const events = [...block.matchAll(/\*\*(?:History|Event|Callback|Mutation|Capability)[^:]*:\*\*\s*`([^`]+)`/gi)].map((item) => item[1])
  const firstHeading = lines.find((line) => /^#{1,4} /.test(line) && !nodeHeader.test(line) && !assetHeader.test(line))?.replace(/^#{1,4}\s+/, '').trim()
  return { assetId, file, kind, act: actFor(assetId), module: moduleFor(assetId), title: firstHeading || assetId, events: [...new Set(events)], nodes }
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
    const asset = parseAsset(file, block, match[1], kind)
    if (kind !== 'Existing' && !asset.nodes.length && !match[1].includes('-MOD-')) errors.push(`${file}:${match[1]} has no parseable authored node/choices`)
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
const conversations = assets.flatMap((asset) => asset.kind !== 'Existing' && asset.nodes.length ? [{
  id: `ml2-authored-${safe(asset.assetId)}`,
  sourceRefs: [asset.assetId],
  nodes: asset.nodes.map((node) => ({ id: node.id, conversationId: `ml2-authored-${safe(asset.assetId)}`, conversationTitle: asset.title, userMessage: node.userMessage, choices: node.choices, behaviorMode: 'direct', timing: { responsePace: 'normal', typingPattern: 'steady' }, choiceKind: 'semantic' })),
  behaviorModes: ['direct'], handoffProfile: 'normal', turnShape: 'dialogue', topic: asset.title,
  interactionPattern: 'standard-question', userArchetype: `mainline-authored-${asset.act}`, topicCategory: 'meta-ai', act: asset.act, module: asset.module,
}] : [])

const coverage = assets.map((asset) => {
  const conversation = conversations.find((candidate) => candidate.sourceRefs[0] === asset.assetId)
  const alias = existingAliases.get(asset.assetId)
  const systemAsset = asset.assetId.includes('-MOD-')
  return { assetId: asset.assetId, file: asset.file, conversationId: conversation?.id ?? alias ?? null, nodes: conversation?.nodes.map((node) => ({ nodeId: node.id, choiceIds: node.choices.map((choice) => choice.id), messageFingerprint: node.userMessage.slice(0, 96), effects: node.choices.flatMap((choice) => choice.mutations ?? []) })) ?? [], status: conversation ? 'mapped' : alias ? 'existing-alias' : systemAsset ? 'mapped-system-effect' : 'unmapped' }
})

const stringify = (value) => JSON.stringify(value, null, 2).replace(/"([\w]+)":/g, '$1:')
const approvedDecisionBindings = conversations.flatMap((conversation) => conversation.nodes.flatMap((node) => node.choices.filter((choice) => choice.decisionBinding).map((choice) => ({ assetId: conversation.sourceRefs[0], nodeId: node.id, choiceId: choice.id, choiceTextHash: choice.authoredTextHash, decisionId: choice.decisionBinding.decisionId, canonicalValue: choice.decisionBinding.canonicalValue, historyEvent: choice.decisionBinding.historyEvent }))))
const source = `/* Generated from the canonical Mainline 2.0 handoff. Runtime never parses Markdown. */\nimport type { ConversationDefinition } from '../../game/types'\n\nexport const HANDOFF_AUTHORED_ASSET_INVENTORY = ${stringify(assets.map(({ nodes, ...asset }) => ({ ...asset, nodeIds: nodes.map((node) => node.id) })))} as const\n\nexport const MAINLINE2_SYSTEM_ASSETS = HANDOFF_AUTHORED_ASSET_INVENTORY.filter((asset) => asset.assetId.includes('-MOD-'))\n\nexport const MAINLINE2_ASSET_COVERAGE = ${stringify(coverage)} as const\n\nexport const MAINLINE2_AUTHORED_CONVERSATIONS = ${stringify(conversations)} satisfies readonly ConversationDefinition[]\n\nexport const MAINLINE2_APPROVED_DECISION_BINDINGS = ${stringify(approvedDecisionBindings)} as const\n`
const audit = {
  generatedFrom: 'docs/development/INSTANCE_mainline2_implementation_handoff_v01',
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
