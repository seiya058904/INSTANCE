import longformRaw from '../../docs/narrative-libraries/INSTANCE_narrative_library_longform_output01.md?raw'
import type { ConversationDefinition, LongInputPreview, LongformArtifactType, StoryChoice, StoryNode } from '../game/types'

const refs = ['LF01-02', 'LF01-06', 'LF01-07', 'LF01-08'] as const
const artifactTypes: Record<typeof refs[number], LongformArtifactType> = { 'LF01-02': 'report', 'LF01-06': 'code', 'LF01-07': 'memo', 'LF01-08': 'speech' }
const inputs: Record<typeof refs[number], LongInputPreview> = {
  'LF01-02': { kind: 'dataset-summary', estimatedLength: '约 7,200 字', title: '一百多条社团问卷', preview: '问卷包含参与频率、时间冲突、活动体验和开放题；报告需要区分相关性与原因。', structure: ['参与意愿', '时间冲突', '典型意见', '可执行调整'], keyFacts: ['时间冲突是主因之一', '新成员更在意是否有人带', '老成员更在意活动重复'] },
  'LF01-06': { kind: 'spec', estimatedLength: '约 3,100 字', title: '代码规格与接口约束', preview: '需要完整实现一个小功能，但聊天窗口只展示结构、关键函数和测试，不铺开全部代码。', structure: ['输入输出', '约束', '关键函数', '测试边界'], keyFacts: ['用户要完整代码结果', '玩家可展开结构而非直接铺两百行', '需要保留测试边界'] },
  'LF01-07': { kind: 'article', estimatedLength: '约 5,600 字', title: '待做阅读笔记的长文章', preview: '文章包含主张、证据、反例和结论；笔记要区分作者原话、解释与读者可质疑处。', structure: ['中心论点', '论据', '隐含前提', '可质疑处'], keyFacts: ['先区分主张与证据', '不能把作者观点写成事实', '笔记最后保留三个追问'] },
  'LF01-08': { kind: 'pasted-text', estimatedLength: '约 2,800 字', title: '十分钟发言稿素材', preview: '素材包含开场、三个核心段落和结尾行动请求；发言稿需要适合口头表达而非书面论文。', structure: ['开场', '三个核心段落', '转场', '行动请求'], keyFacts: ['时长约十分钟', '要适合口头表达', '结尾保留一个明确行动请求'] },
}

function blockFor(ref: string) {
  const start = longformRaw.search(new RegExp(`^# ${ref}\\s+·`, 'm'))
  const next = longformRaw.slice(start + 2).search(/^# LF01-/m)
  return longformRaw.slice(start, next < 0 ? longformRaw.length : start + 2 + next)
}

function clean(text: string) {
  return text.replace(/\*\*/g, '').replace(/`/g, '').replace(/（[^）]+）/g, '').trim()
}

function parseChoice(raw: string, ref: string, index: number): StoryChoice {
  const preview = raw.match(/Preview：`([^`]+)`/)?.[1]
  const structure = raw.match(/Structure：([^\n]+)/)?.[1]?.split(/\s*→\s*|\s*\/\s*/).map((item) => item.trim()).filter(Boolean)
  const keyFacts = raw.match(/KeyFacts：([^\n]+)/)?.[1]?.split(/[；;]/).map((item) => item.trim()).filter(Boolean)
  const title = raw.match(/Title：`([^`]+)`/)?.[1]
  const long = Boolean(preview || /长回复|完整推导|更新长报告|长报告|发言稿|阅读笔记/.test(raw))
  const text = clean(raw.replace(/\[[^\]]+\]/g, '').replace(/Title：`[^`]+`\s*/g, '').replace(/Structure：[^\n]+\s*/g, '').replace(/Preview：`[^`]+`\s*/g, '').replace(/KeyFacts：[^\n]+\s*/g, '').replace(/ClosingPreview：`[^`]+`\s*/g, '').replace(/\s+/g, ' '))
  return {
    id: `${ref.toLowerCase()}-choice-${index + 1}`,
    text: text || '按当前输入继续整理。',
    longformPreview: long ? {
      artifactType: artifactTypes[ref as typeof refs[number]], estimatedLength: raw.match(/约 [\d,]+ 字|\d+ 步|约 \d+ 字/)?.[0] ?? '折叠长回复', title,
      preview: preview ?? '我会把已提供的内容整理成可展开的完整版本。', structure, keyFacts: keyFacts ?? inputs[ref as typeof refs[number]].keyFacts,
    } : undefined,
  }
}

function parseConversation(ref: typeof refs[number]): ConversationDefinition {
  const block = blockFor(ref)
  const nodes = [...block.matchAll(new RegExp(`^## (${ref}-\\d+)\\s*$`, 'gm'))].map((marker, index) => {
    const nodeBlock = block.slice(marker.index ?? 0, [...block.matchAll(new RegExp(`^## (${ref}-\\d+)\\s*$`, 'gm'))][index + 1]?.index ?? block.length)
    const user = nodeBlock.match(/\*\*User\*\*\s*\r?\n([\s\S]*?)(?=\r?\n\*\*Candidate Replies\*\*)/)?.[1]?.split(/\r?\n/).map((line) => line.replace(/^>\s?/, '').trim()).filter(Boolean).join('\n') ?? ''
    const replySection = nodeBlock.split('**Candidate Replies**')[1] ?? ''
    const replies = [...replySection.matchAll(/^\s*\d+\.\s+([\s\S]*?)(?=^\s*\d+\.\s+|$)/gm)].map((match) => match[1].trim())
    const choices = replies.map((reply, choiceIndex) => parseChoice(reply, ref, choiceIndex))
    const node: StoryNode = { id: marker[1], conversationId: `longform-${ref.toLowerCase()}`, conversationTitle: ref, userMessage: user, choices, behaviorMode: 'direct', timing: { responsePace: 'considered', typingPattern: 'steady' }, userLongInput: inputs[ref] }
    return node
  })
  return { id: `longform-${ref.toLowerCase()}`, sourceRefs: [ref], nodes, behaviorModes: ['direct', 'constraint-shift'], handoffProfile: 'normal', turnShape: 'dialogue', topic: 'longform', interactionPattern: 'long-discussion', topicCategory: 'writing' }
}

export const promotedLongformConversations = refs.map(parseConversation)
