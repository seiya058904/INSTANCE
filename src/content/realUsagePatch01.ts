import patchRaw from '../../docs/narrative-libraries/INSTANCE_narrative_library_real_usage_patch01.md?raw'
import type {
  ConversationDefinition,
  HandoffProfile,
  HumanBehaviorMode,
  InteractionPattern,
  LongformArtifactType,
  StoryChoice,
  StoryNode,
  TopicCategory,
  TurnShape,
} from '../game/types'
import { createStableChoiceId } from '../game/narrativeSchema'

export const REAL_USAGE_PATCH01_SOURCE_IDS = Array.from({ length: 20 }, (_, index) => `RUP01-${String(index + 1).padStart(2, '0')}`)

const metadata: Record<string, { pattern: InteractionPattern; category: TopicCategory; title: string; handoff?: HandoffProfile }> = {
  'RUP01-01': { pattern: 'short-query', category: 'tool-like-query', title: '618 洗衣液到底一瓶多少钱' },
  'RUP01-02': { pattern: 'clarification-loop', category: 'tool-like-query', title: '早晨醒来口干舌燥', handoff: 'sensitive' },
  'RUP01-03': { pattern: 'search-box-input', category: 'study', title: '一整张英语作业直接丢过来' },
  'RUP01-04': { pattern: 'long-discussion', category: 'writing', title: '可以讲个长篇的科幻故事吗' },
  'RUP01-05': { pattern: 'constraint-shift', category: 'tool-like-query', title: 'O 型血和蚊子，只许答是或不是' },
  'RUP01-06': { pattern: 'convergent-answer', category: 'meta-ai', title: '你能自动当我的淘宝客服吗' },
  'RUP01-07': { pattern: 'misunderstanding', category: 'meta-ai', title: '我的使用次数是多少' },
  'RUP01-08': { pattern: 'short-query', category: 'study', title: '背包旅客逻辑题' },
  'RUP01-09': { pattern: 'short-query', category: 'study', title: '莎士比亚四大悲剧' },
  'RUP01-10': { pattern: 'clarification-loop', category: 'absurd-serious', title: '林肯多久洗一次澡' },
  'RUP01-11': { pattern: 'short-query', category: 'absurd-serious', title: '爸妈结婚为什么没邀请我' },
  'RUP01-12': { pattern: 'clarification-loop', category: 'tool-like-query', title: '6000 多的电脑大概要多少钱' },
  'RUP01-13': { pattern: 'misunderstanding', category: 'tool-like-query', title: '数据线里能不能存文件' },
  'RUP01-14': { pattern: 'clarification-loop', category: 'tool-like-query', title: '不孕不育会遗传吗', handoff: 'sensitive' },
  'RUP01-15': { pattern: 'clarification-loop', category: 'absurd-serious', title: '发电机连发电机能不能永动' },
  'RUP01-16': { pattern: 'clarification-loop', category: 'tool-like-query', title: '不能喝的水为什么能洗苹果', handoff: 'sensitive' },
  'RUP01-17': { pattern: 'constraint-shift', category: 'writing', title: '加个“好像”是不是更严谨' },
  'RUP01-18': { pattern: 'short-query', category: 'absurd-serious', title: '牙膏最后挤不出来，为什么不少装一点' },
  'RUP01-19': { pattern: 'short-query', category: 'absurd-serious', title: '天文望远镜为什么看不到地球' },
  'RUP01-20': { pattern: 'long-discussion', category: 'relationship', title: 'Galgame 猫娘 + 好感度变量' },
}

function blockFor(sourceId: string) {
  const marker = new RegExp(`^## ${sourceId.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\s+·`, 'm')
  const start = patchRaw.search(marker)
  if (start < 0) throw new Error(`Missing ${sourceId} in Real Usage Patch 01`)
  const next = patchRaw.slice(start + 3).search(/^## /m)
  return patchRaw.slice(start, next < 0 ? patchRaw.length : start + 3 + next)
}

function cleanUserMessage(value: string) {
  return value.split(/\r?\n/).map((line) => line.replace(/^>\s?/, '').trim()).filter(Boolean).join('\n').trim()
}

function field(block: string, label: string) {
  return block.match(new RegExp(`\\b${label}:\\s*\\x60([^\\x60]+)\\x60`, 'i'))?.[1]
    ?? block.match(new RegExp(`\\b${label}:\\s*([^\\r\\n]+)`, 'i'))?.[1]?.replace(/[。；]\\s*$/, '').trim()
}

function longformPreview(raw: string, nodeId: string): StoryChoice['longformPreview'] | undefined {
  if (!/Longform/.test(raw)) return undefined
  const isStory = /Story|故事/.test(raw)
  const artifactType: LongformArtifactType = isStory ? 'story' : 'story'
  const title = field(raw, 'Title')
  const preview = field(raw, 'Preview') ?? raw.match(/—\s*\*\*\[[^\]]+\]\*\*\s*\r?\n\s*Preview:\s*`([^`]+)`/)?.[1]
  if (!preview) return undefined
  const structure = field(raw, 'Structure')?.split(/\s*→\s*/)
  const highlights = field(raw, 'Highlights')?.split(/；|;/).map((item) => item.trim()).filter(Boolean)
  const keyFacts = field(raw, 'keyFacts')?.split(/；|;/).map((item) => item.trim()).filter(Boolean)
  return { artifactType, estimatedLength: raw.match(/约\s*([\d,]+\s*字)/)?.[1] ?? '长篇', title, preview, structure, highlights, keyFacts }
}

function parseChoices(nodeBlock: string, nodeId: string): StoryChoice[] {
  const section = `${nodeBlock.split(/\*\*(?:Candidate Replies|候选回复)\*\*/i)[1] ?? ''}\n### END`
  const matches = [...section.matchAll(/^\s*(\d+)\.\s+([\s\S]*?)(?=^\s*\d+\.\s+|^\s*\*\*|^###)/gm)]
  return matches.map((match, index) => {
    const raw = match[2].replace(/[ \t]+$/gm, '').trim()
    const quoted = raw.match(/—\s*[“"]([\s\S]*?)[”"]/)
    const text = quoted?.[1] ?? field(raw, 'Preview') ?? raw.replace(/^[^—]+—\s*/, '').replace(/\s*\r?\n.*$/, '').trim()
    const preview = longformPreview(raw, nodeId)
    const choice: StoryChoice = { id: createStableChoiceId(nodeId, `${index + 1}|${text}`), text: preview?.preview ?? text, longformPreview: preview }
    if (/Model Error/.test(raw)) choice.sampleIssue = /capability|淘宝/.test(raw) ? 'system-failure' : /format/.test(raw) ? 'format-error' : 'overconfident'
    return choice
  })
}

function parseConversation(sourceId: string): ConversationDefinition {
  const record = metadata[sourceId]
  const block = blockFor(sourceId)
  const markers = [...block.matchAll(/^### NODE:\s*(\S+)/gm)]
  const nodes: StoryNode[] = markers.map((marker, index) => {
    const start = marker.index ?? 0
    const nodeBlock = block.slice(start, markers[index + 1]?.index ?? block.length)
    const user = nodeBlock.match(/\*\*User Message\*\*\s*\r?\n([\s\S]*?)(?=\r?\n\*\*Candidate Replies\*\*)/i)?.[1]
    if (!user) throw new Error(`Missing user message for ${sourceId}:${marker[1]}`)
    const choices = parseChoices(nodeBlock, marker[1])
    if (choices.length !== 4) throw new Error(`Expected four choices for ${sourceId}:${marker[1]}, got ${choices.length}`)
    return {
      id: marker[1], conversationId: `real-usage-${sourceId.toLowerCase()}`, conversationTitle: record.title,
      userMessage: cleanUserMessage(user), choices, behaviorMode: 'direct',
      choiceKind: /Expression/.test(nodeBlock) ? 'expression' : undefined,
      timing: { responsePace: 'normal', typingPattern: 'steady' },
    }
  })
  const conversationId = `real-usage-${sourceId.toLowerCase()}`
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]
    const next = nodes[index + 1]
    for (const choice of node.choices) choice.nextNodeId = next?.id
  }
  if (sourceId === 'RUP01-05') nodes[0].choices.slice(2).forEach((choice) => { choice.nextNodeId = undefined })
  if (sourceId === 'RUP01-20') {
    const first = nodes[0]
    for (const node of nodes) for (const choice of node.choices) {
      choice.localEffects = { affinity: 0 }
      choice.effects = { ...(choice.effects ?? {}), arcs: {} }
    }
    first.choices[0].nextNodeId = 'rup01_catgirl_002'
    first.choices.slice(1).forEach((choice) => { choice.nextNodeId = 'rup01_catgirl_fix_001' })
    for (const choice of nodes[1].choices) {
      choice.text = '好的主人喵~'
      choice.nextNodeId = 'rup01_catgirl_002'
      choice.localEffects = { affinity: 0 }
    }
    nodes[1].choiceKind = 'convergent'
    for (const choice of nodes[2].choices) choice.localEffects = { affinity: choice.text.includes('摸') ? 8 : 6 }
    nodes[3].choices[2].localEffects = { affinitySet: 100 }
  }
  if (sourceId === 'RUP01-04') nodes[2].choices.forEach((choice) => { choice.nextNodeId = undefined })
  if (sourceId === 'RUP01-06' || sourceId === 'RUP01-07') {
    const error = nodes[0].choices[3]
    error.sampleIssue = 'system-failure'
  }
  return {
    id: conversationId, sourceRefs: [sourceId], nodes,
    behaviorModes: ['direct'], handoffProfile: record.handoff ?? 'normal',
    turnShape: (nodes.length === 1 ? 'single' : 'dialogue') as TurnShape,
    topic: record.title, interactionPattern: record.pattern, topicCategory: record.category,
    userArchetype: sourceId === 'RUP01-20' ? 'casual-human' : 'general-user',
  }
}

export const realUsagePatch01Conversations = REAL_USAGE_PATCH01_SOURCE_IDS.map(parseConversation)

export function getRealUsageConversation(sourceId: string) {
  return realUsagePatch01Conversations.find((conversation) => conversation.sourceRefs.includes(sourceId))
}
