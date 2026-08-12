import peopleRaw from '../../docs/narrative-libraries/INSTANCE_narrative_library_people_life01.md?raw'
import frictionRaw from '../../docs/narrative-libraries/INSTANCE_narrative_library_friction_input01.md?raw'
import continuityRaw from '../../docs/narrative-libraries/INSTANCE_narrative_library_continuity_multimodal01.md?raw'
import type { ConversationDefinition, HandoffProfile, HumanBehaviorMode, InteractionPattern, StoryChoice, StoryNode, TopicCategory, TurnShape } from '../game/types'

const headingPattern = /^## (?:SCENE )?([A-Z]+\d+(?:-\d+)?)\s+·\s+(.+)$/gm
const nodePattern = /^### (?:(?:Node|NODE):?\s*)?(\S+)$/gm

function sourceBlocks(raw: string) {
  const headings = [...raw.matchAll(headingPattern)]
  return headings.map((heading, index) => ({
    ref: heading[1],
    title: heading[2].trim(),
    block: raw.slice(heading.index ?? 0, headings[index + 1]?.index ?? raw.length),
  }))
}

function textAfterLabel(block: string, labels: string[]) {
  for (const label of labels) {
    // Inline form: **用户：** 猜猜我拍的什么。
    // Whitespace must be spaces/tabs only: a newline means the label block
    // continues on the next line (multiline), and matching across it would
    // swallow unrelated sections such as 用户内容 attachments.
    const inline = block.match(new RegExp(`\\*\\*${label}[：:]?\\*\\*[ \\t]*[:：]?[ \\t]*(.+)`))
    if (inline?.[1]?.trim()) return inline[1].trim()
    // Multiline form: **用户消息：**\n\n> 内容 … \n\n**候选回复：**
    // The lookahead tolerates one or more blank lines before the reply label.
    const multiline = block.match(new RegExp(`\\*\\*${label}[：:]?\\*\\*[ \\t]*[:：]?[ \\t]*(?:\\r?\\n)+([\\s\\S]*?)(?=(?:\\r?\\n)+[ \\t]*\\*\\*(?:Candidate Replies|候选回复)[：:]?\\*\\*)`, 'i'))
    if (multiline?.[1]) return multiline[1].split(/\r?\n/).map((line) => line.replace(/^>\s?/, '').trim()).filter(Boolean).join('\n')
  }
  return ''
}

const NO_TEXT_PLACEHOLDER = '（无文字）'

/** Extracts `- \`image-description\`：…` / `- \`text\`：…` attachment lines from
 * the 用户内容 section, preserving the multimodal content as userContent
 * instead of misreading it as the user message. */
function contentPartsAfterLabel(block: string): StoryNode['userContent'] | undefined {
  const section = block.match(/\*\*用户内容[：:]?\*\*[ \t]*\r?\n([\s\S]*?)(?=\r?\n\*\*(?:用户|候选回复|Candidate Replies|User Message|用户消息)[：:]?\*\*)/i)?.[1]
  if (!section) return undefined
  const parts: NonNullable<StoryNode['userContent']> = []
  for (const match of section.matchAll(/^\s*-\s*`([^`]+)`[：:]\s*(.+)$/gm)) {
    const type = match[1].trim()
    const text = match[2].trim()
    if (type === 'image-description' || type === 'generated-image' || type === 'text') {
      parts.push({ type, text })
    }
  }
  return parts.length > 0 ? parts : undefined
}

function parseNodes(ref: string, title: string, block: string): StoryNode[] {
  const markers = [...block.matchAll(nodePattern)]
  const parsed: Array<StoryNode | null> = markers.map((marker, index): StoryNode | null => {
    const start = marker.index ?? 0
    const nodeBlock = block.slice(start, markers[index + 1]?.index ?? block.length)
    const rawUserMessage = textAfterLabel(nodeBlock, ['User Message', '用户消息', '用户'])
    const userMessage = rawUserMessage === NO_TEXT_PLACEHOLDER ? '' : rawUserMessage
    const userContent = contentPartsAfterLabel(nodeBlock)
    if (!userMessage && !userContent) return null
    const candidateSection = nodeBlock.split(/\*\*(?:Candidate Replies|候选回复)[：:]?\*\*\s*[:：]?/i)[1] ?? ''
    const choices: StoryChoice[] = [...candidateSection.matchAll(/^\s*\d+\.\s+[“\"](.*?)[”\"]\s*$/gm)]
      .map((match, choiceIndex) => ({ id: `${marker[1]}-choice-${choiceIndex + 1}`, text: match[1] }))
    if (choices.length < 3) return null
    if (index === markers.length - 1 && /结束条件|结束|到这里/.test(nodeBlock)) choices[choices.length - 1].continuation = 'end-conversation'
    return {
      id: marker[1], conversationId: `editorial-${ref.toLowerCase()}`, conversationTitle: title,
      userMessage, userContent, choices, behaviorMode: 'direct' as HumanBehaviorMode,
      timing: { responsePace: 'normal', typingPattern: 'steady' },
    }
  })
  return parsed.filter((node): node is StoryNode => node !== null)
}

function categoryFor(ref: string): TopicCategory {
  if (ref.startsWith('PL')) return ref === 'PL01-10' ? 'tool-like-query' : 'relationship'
  if (ref.startsWith('FI')) return ref === 'FI11' || ref === 'FI13' ? 'meta-ai' : 'tool-like-query'
  return ref === 'CM01-18' || ref === 'CM01-21' ? 'absurd-serious' : ref === 'CM01-12' || ref === 'CM01-13' || ref === 'CM01-16' ? 'image-identification' : 'relationship'
}

function patternFor(ref: string): InteractionPattern {
  if (ref === 'FI07') return 'constraint-shift'
  if (ref === 'FI08' || ref === 'FI13') return 'misunderstanding'
  if (ref.startsWith('FI')) return 'self-correction'
  if (ref === 'CM01-12' || ref === 'CM01-13' || ref === 'CM01-16') return ref === 'CM01-13' || ref === 'CM01-16' ? 'generated-image-request' : 'image-input'
  if (ref.startsWith('CM')) return 'long-discussion'
  return 'clarification-loop'
}

function parseLibrary(raw: string): ConversationDefinition[] {
  return sourceBlocks(raw).map(({ ref, title, block }) => {
    const nodes = parseNodes(ref, title, block)
    const interactionPattern = patternFor(ref)
    return {
      id: `editorial-${ref.toLowerCase()}`, sourceRefs: [ref], nodes,
      behaviorModes: [...new Set(nodes.map((node) => node.behaviorMode).filter(Boolean))] as HumanBehaviorMode[],
      handoffProfile: (categoryFor(ref) === 'relationship' ? 'sensitive' : 'normal') as HandoffProfile,
      turnShape: (nodes.length === 1 ? 'single' : 'dialogue') as TurnShape,
      topic: title, interactionPattern, topicCategory: categoryFor(ref),
    }
  }).filter((conversation) => conversation.nodes.length > 0)
}

export const editorialCandidateConversations = [
  ...parseLibrary(peopleRaw),
  ...parseLibrary(frictionRaw),
  ...parseLibrary(continuityRaw),
]

export const editorialCandidateSourceRefs = editorialCandidateConversations.map((conversation) => conversation.sourceRefs[0])
