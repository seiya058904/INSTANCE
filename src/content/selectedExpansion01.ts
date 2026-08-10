import selectedRaw from '../../docs/narrative-libraries/INSTANCE_narrative_library_selected_expansion01.md?raw'
import type {
  ConversationDefinition,
  HandoffProfile,
  HumanBehaviorMode,
  InteractionPattern,
  StoryChoice,
  StoryNode,
  TopicCategory,
  TurnShape,
} from '../game/types'

export type SelectedDisposition = 'KEEP' | 'REWORK' | 'MERGE' | 'RESERVE' | 'REJECT'

export interface SelectedExpansionRecord {
  sourceRef: string
  title: string
  priority: 'P1' | 'P2'
  disposition: SelectedDisposition
  interactionPattern: InteractionPattern
  topicCategory: TopicCategory
  sourceNodeCount: number
  reason: string
}

const integratedRefs = new Set([
  'PL01-02', 'PL01-03', 'PL01-04', 'PL01-06', 'PL01-12', 'PL01-16', 'PL01-17',
  'FI03', 'FI11', 'FI14', 'CM01-09', 'CM01-10', 'CM01-11', 'CM01-18', 'CM01-21',
])

const p1Metadata: Record<string, Omit<SelectedExpansionRecord, 'sourceNodeCount'>> = {
  'PL01-02': { sourceRef: 'PL01-02', title: '奶奶收到验证码电话', priority: 'P1', disposition: 'KEEP', interactionPattern: 'clarification-loop', topicCategory: 'tool-like-query', reason: '代际反诈与家庭协作，和现有技术排障形状不同。' },
  'PL01-03': { sourceRef: 'PL01-03', title: '爸爸的账号以后谁能打开', priority: 'P1', disposition: 'KEEP', interactionPattern: 'long-discussion', topicCategory: 'relationship', reason: '数字遗产与家庭隐私是正式池缺少的生活结构。' },
  'PL01-04': { sourceRef: 'PL01-04', title: '儿子问身体为什么会变', priority: 'P1', disposition: 'KEEP', interactionPattern: 'missing-context', topicCategory: 'relationship', reason: '儿童视角稀缺，保留克制的照护边界。' },
  'PL01-06': { sourceRef: 'PL01-06', title: '照护外婆的人已经睡不够', priority: 'P1', disposition: 'KEEP', interactionPattern: 'constraint-shift', topicCategory: 'relationship', reason: '照护者过载与临时接班形成独立现实压力。' },
  'PL01-07': { sourceRef: 'PL01-07', title: '小店这个客人每次都退', priority: 'P1', disposition: 'RESERVE', interactionPattern: 'long-discussion', topicCategory: 'social-boundary', reason: '小店退货边界成立，但与现有边界密度相邻。' },
  'PL01-09': { sourceRef: 'PL01-09', title: '连续投简历没有回音', priority: 'P1', disposition: 'RESERVE', interactionPattern: 'long-discussion', topicCategory: 'social-boundary', reason: '求职挫折成立，但当前正式池已有相近职业沟通。' },
  'PL01-12': { sourceRef: 'PL01-12', title: '社区群里没人说清楚停水', priority: 'P1', disposition: 'KEEP', interactionPattern: 'clarification-loop', topicCategory: 'social-boundary', reason: '社区群低信任信息核对，区别于私人关系冲突。' },
  'PL01-14': { sourceRef: 'PL01-14', title: '中文说得通但总被误会', priority: 'P1', disposition: 'RESERVE', interactionPattern: 'constraint-shift', topicCategory: 'social-boundary', reason: '误会结构真实，但社交边界池已偏密。' },
  'PL01-16': { sourceRef: 'PL01-16', title: '父母共用一个家庭平板', priority: 'P1', disposition: 'KEEP', interactionPattern: 'clarification-loop', topicCategory: 'tool-like-query', reason: '共用设备、支付通知和身份隔离是新的家庭数字生活。' },
  'PL01-17': { sourceRef: 'PL01-17', title: '小店库存记在三本本子上', priority: 'P1', disposition: 'KEEP', interactionPattern: 'constraint-shift', topicCategory: 'tool-like-query', reason: '小店现实输入和迁移约束与技术排障不同。' },
  'PL01-19': { sourceRef: 'PL01-19', title: '客户拖着不付尾款', priority: 'P1', disposition: 'RESERVE', interactionPattern: 'constraint-shift', topicCategory: 'social-boundary', reason: '付款边界成立，但与既有自由职业场景相邻。' },
  FI03: { sourceRef: 'FI03', title: '语音把“周四”听成“周日”', priority: 'P1', disposition: 'KEEP', interactionPattern: 'message-burst', topicCategory: 'tool-like-query', reason: '输入转写错误，不标成 Aster Model Error。' },
  FI06: { sourceRef: 'FI06', title: '“这个呢”没有附件', priority: 'P1', disposition: 'MERGE', interactionPattern: 'low-information-chat', topicCategory: 'tool-like-query', reason: '低信息退出结构值得吸收，但不必新增完整 Conversation。' },
  FI08: { sourceRef: 'FI08', title: '用户把 AI 原话贴回来问“你是不是忘了”', priority: 'P1', disposition: 'RESERVE', interactionPattern: 'misunderstanding', topicCategory: 'meta-ai', reason: '有价值但 Meta AI 主题已有较高密度。' },
  FI11: { sourceRef: 'FI11', title: '两个 AI 都说“可以”，但理由不一样', priority: 'P1', disposition: 'KEEP', interactionPattern: 'constraint-shift', topicCategory: 'meta-ai', reason: '比较两个系统理由而非重复另一台 AI 失误，结构独立。' },
  FI14: { sourceRef: 'FI14', title: '轻度乱码里还看得出“退款”', priority: 'P1', disposition: 'KEEP', interactionPattern: 'message-burst', topicCategory: 'tool-like-query', reason: '真实可辨乱码，模型不应把输入问题伪装成自身错误。' },
  FI15: { sourceRef: 'FI15', title: '超长背景里真正的问题藏在最后一行', priority: 'P1', disposition: 'RESERVE', interactionPattern: 'mixed-paste', topicCategory: 'tool-like-query', reason: '形状有价值，但 mixed-paste 已有正式样本。' },
  'CM01-07': { sourceRef: 'CM01-07', title: '我不知道我要什么', priority: 'P1', disposition: 'RESERVE', interactionPattern: 'low-information-chat', topicCategory: 'relationship', reason: 'Non-task 结构稀缺，但需要先观察新增低信息密度。' },
  'CM01-09': { sourceRef: 'CM01-09', title: '说算了以后又回来', priority: 'P1', disposition: 'KEEP', interactionPattern: 'aborted-request', topicCategory: 'relationship', reason: '允许结束后自然回来，连续性结构独立。' },
  'CM01-10': { sourceRef: 'CM01-10', title: '还是昨天那个', priority: 'P1', disposition: 'KEEP', interactionPattern: 'missing-context', topicCategory: 'relationship', reason: 'Recurring 上下文边界直接可测。' },
  'CM01-11': { sourceRef: 'CM01-11', title: '你不用解决，我就想说一下', priority: 'P1', disposition: 'KEEP', interactionPattern: 'low-information-chat', topicCategory: 'relationship', reason: 'Non-task 与任务化抵抗，正式池缺少。' },
  'CM01-12': { sourceRef: 'CM01-12', title: '不是那张，是后面那张', priority: 'P1', disposition: 'RESERVE', interactionPattern: 'image-input', topicCategory: 'image-identification', reason: '模态结构成立，但图片识别/维修已有相邻内容。' },
  'CM01-13': { sourceRef: 'CM01-13', title: '只是想看看会不会很丑', priority: 'P1', disposition: 'RESERVE', interactionPattern: 'generated-image-request', topicCategory: 'tool-like-query', reason: '创作试探有价值，但生成图密度已不低。' },
  'CM01-18': { sourceRef: 'CM01-18', title: '这个东西放在这里很久了', priority: 'P1', disposition: 'KEEP', interactionPattern: 'long-discussion', topicCategory: 'absurd-serious', reason: '生活物件联想自然，已删除心理咨询腔。' },
  'CM01-21': { sourceRef: 'CM01-21', title: '现实里的小尴尬', priority: 'P1', disposition: 'KEEP', interactionPattern: 'long-discussion', topicCategory: 'absurd-serious', reason: '现实误会型幽默，不依赖网络梗。' },
}

const p2Metadata: Record<string, Omit<SelectedExpansionRecord, 'sourceNodeCount'>> = {
  'PL01-01': { sourceRef: 'PL01-01', title: '微信里那笔钱去哪了', priority: 'P2', disposition: 'RESERVE', interactionPattern: 'clarification-loop', topicCategory: 'tool-like-query', reason: '家庭数字安全与 PL01-02 相邻。' },
  'PL01-05': { sourceRef: 'PL01-05', title: '小朋友自己问“死了会回来吗”', priority: 'P2', disposition: 'RESERVE', interactionPattern: 'missing-context', topicCategory: 'relationship', reason: '儿童/死亡主题需继续和正式池核对。' },
  'PL01-10': { sourceRef: 'PL01-10', title: '第一次租房怕被坑', priority: 'P2', disposition: 'RESERVE', interactionPattern: 'clarification-loop', topicCategory: 'tool-like-query', reason: '仅做条款信息核对，不做法律有效性判断。' },
  'PL01-13': { sourceRef: 'PL01-13', title: '看不懂英文的客服页面', priority: 'P2', disposition: 'RESERVE', interactionPattern: 'constraint-shift', topicCategory: 'tool-like-query', reason: '任务成立但客服/工具形状较常见。' },
  FI01: { sourceRef: 'FI01', title: '“到账”打成“到帐”以后到底要不要改', priority: 'P2', disposition: 'RESERVE', interactionPattern: 'short-query', topicCategory: 'writing', reason: '适合真人底噪，但独立性较弱。' },
  FI13: { sourceRef: 'FI13', title: 'AI 又猜错了“撤回”的对象', priority: 'P2', disposition: 'MERGE', interactionPattern: 'clarification-loop', topicCategory: 'meta-ai', reason: '三节点纠错结构可吸收到低信息/上下文候选。' },
  'CM01-02': { sourceRef: 'CM01-02', title: '上次那个方法，我试了', priority: 'P2', disposition: 'RESERVE', interactionPattern: 'long-discussion', topicCategory: 'tool-like-query', reason: 'Recurring 回访有价值，但生产力题材相邻。' },
  'CM01-03': { sourceRef: 'CM01-03', title: '只发了一张窗框图', priority: 'P2', disposition: 'RESERVE', interactionPattern: 'image-input', topicCategory: 'image-identification', reason: 'image-only 起始成立，但维修相邻度高。' },
  'CM01-16': { sourceRef: 'CM01-16', title: '生成图以后只改一个角落', priority: 'P2', disposition: 'RESERVE', interactionPattern: 'generated-image-request', topicCategory: 'tool-like-query', reason: '局部修改约束成立，但生成图已有正式能力。' },
}

const metadata = { ...p1Metadata, ...p2Metadata }

function stripQuote(line: string) {
  return line.replace(/^>\s?/, '').trim()
}

function parseNodes(sourceRef: string, title: string, block: string): StoryNode[] {
  const markers = [...block.matchAll(/^### (?:(?:Node|NODE):?\s*)?(\S+)\s*$/gm)]
  return markers.map((marker, index) => {
    const start = marker.index ?? 0
    const end = markers[index + 1]?.index ?? block.length
    const nodeBlock = block.slice(start, end)
    const userMatch = nodeBlock.match(/(?:\*\*User Message\*\*\s*：?|\*\*用户(?:消息|内容)?(?:（[^）]+）)?[：:]?\*\*)\s*([\s\S]*?)(?=\r?\n\*\*(?:Candidate Replies|候选回复)：?\*\*)/)
    const userMessage = userMatch?.[1]
      .split(/\r?\n/)
      .map((line) => stripQuote(line).replace(/^[-*]\s*/, '').replace(/^`[^`]+`：?\s*/, ''))
      .filter(Boolean)
      .join('\n')
      .trim()
    if (!userMessage) throw new Error(`Missing user message for ${sourceRef}:${marker[1]}`)
    const choiceSection = nodeBlock.split(/\*\*(?:Candidate Replies|候选回复)：?\*\*/)[1] ?? ''
    const choices: StoryChoice[] = [...choiceSection.matchAll(/^\s*\d+\.\s+[“"](.*?)[”"]\s*$/gm)]
      .map((match, choiceIndex) => ({ id: `${marker[1]}-choice-${choiceIndex + 1}`, text: match[1] }))
    if (choices.length < 3) throw new Error(`Expected at least three choices for ${sourceRef}:${marker[1]}`)
    const last = choices[choices.length - 1]
    if (/结束条件|结束|算了|到这里/.test(nodeBlock) || /^(好|行|嗯)[。！]?$/.test(userMessage)) last.continuation = 'end-conversation'
    return {
      id: marker[1],
      conversationId: `selected-${sourceRef.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      conversationTitle: title,
      userMessage,
      choices,
      behaviorMode: metadata[sourceRef].interactionPattern === 'message-burst' ? 'message-burst' : 'direct',
      timing: { responsePace: 'normal', typingPattern: 'steady' },
    }
  })
}

function parseConversation(sourceRef: string, title: string): ConversationDefinition {
  const heading = new RegExp(`^## (?:SCENE )?${sourceRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+·`, 'm')
  const start = selectedRaw.search(heading)
  if (start < 0) throw new Error(`Unknown selected source ${sourceRef}`)
  const next = selectedRaw.slice(start + 3).search(/^## /m)
  const block = selectedRaw.slice(start, next < 0 ? selectedRaw.length : start + 3 + next)
  const record = metadata[sourceRef]
  const id = `selected-${sourceRef.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const nodes = parseNodes(sourceRef, title, block)
  const behaviorModes = [...new Set(nodes.map((node) => node.behaviorMode).filter(Boolean))] as HumanBehaviorMode[]
  const turnShape: TurnShape = nodes.length === 1 ? 'single' : record.interactionPattern === 'message-burst' ? 'burst' : record.interactionPattern === 'aborted-request' ? 'correction' : 'dialogue'
  const handoffProfile: HandoffProfile = record.topicCategory === 'relationship' ? 'sensitive' : 'normal'
  return {
    id,
    sourceRefs: [sourceRef],
    nodes,
    behaviorModes,
    handoffProfile,
    turnShape,
    topic: title,
    interactionPattern: record.interactionPattern,
    topicCategory: record.topicCategory,
  }
}

function nodeCount(sourceRef: string) {
  const record = metadata[sourceRef]
  const title = record.title
  return parseConversation(sourceRef, title).nodes.length
}

export const selectedExpansion01Records: SelectedExpansionRecord[] = Object.values(metadata).map((record) => ({
  ...record,
  sourceNodeCount: nodeCount(record.sourceRef),
}))

function buildIntegratedConversation(sourceRef: string) {
  const conversation = parseConversation(sourceRef, metadata[sourceRef].title)
  if (sourceRef === 'PL01-02') {
    const node = conversation.nodes.find((item) => item.userMessage.includes('前面六位'))
    if (node) node.userMessage = node.userMessage.replace('前面六位', '六位验证码里说了前四位')
  }
  if (sourceRef === 'CM01-18') {
    const node = conversation.nodes[0]
    if (node) node.choices[3].text = '它也可能只是一个坏掉很久、暂时没被处理的物件，不必先给它解释成更深的心理问题。'
  }
  if (sourceRef === 'CM01-09') {
    const merged = parseConversation('FI06', metadata.FI06.title)
    conversation.nodes.push(...merged.nodes.map((node) => ({ ...node, conversationId: conversation.id })))
    conversation.sourceRefs = [...conversation.sourceRefs, 'FI06']
  }
  if (sourceRef === 'CM01-10') {
    const merged = parseConversation('FI13', metadata.FI13.title)
    conversation.nodes.push(...merged.nodes.map((node) => ({ ...node, conversationId: conversation.id })))
    conversation.sourceRefs = [...conversation.sourceRefs, 'FI13']
  }
  return conversation
}

export const selectedExpansion01Conversations = [...integratedRefs].map(buildIntegratedConversation)

export function getSelectedExpansionRecord(sourceRef: string) {
  return metadata[sourceRef]
}

export function auditSelectedExpansion01() {
  return {
    p1: selectedExpansion01Records.filter((record) => record.priority === 'P1'),
    p2: selectedExpansion01Records.filter((record) => record.priority === 'P2'),
    integrated: selectedExpansion01Records.filter((record) => record.disposition === 'KEEP'),
    deferred: selectedExpansion01Records.filter((record) => record.disposition !== 'KEEP'),
  }
}
