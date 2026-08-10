import batch01Raw from '../../docs/narrative-libraries/INSTANCE_narrative_library_batch01.md?raw'
import batch02Raw from '../../docs/narrative-libraries/INSTANCE_narrative_library_batch02.md?raw'
import batch03Raw from '../../docs/narrative-libraries/INSTANCE_narrative_library_batch03.md?raw'
import humor01Raw from '../../docs/narrative-libraries/INSTANCE_narrative_library_humor01.md?raw'
import type {
  ConversationDefinition,
  NarrativeSceneSource,
  StoryChoice,
  StoryNode,
} from '../game/types'
import { createStableChoiceId } from '../game/narrativeSchema'

export type Batch02EditorialStatus = 'KEEP_STRONG' | 'KEEP_REWORK' | 'MERGE' | 'REJECT'

export interface Batch02AuditEntry {
  sceneNumber: number
  editorialStatus: Batch02EditorialStatus
  currentRunCandidate: boolean
  absorbedIntoCurrentRun: boolean
  deployment: 'replace' | 'merge' | 'reserve'
  note: string
}

function parseChoices(nodeBlock: string, nodeId: string): StoryChoice[] {
  const choices: StoryChoice[] = []
  const choicePattern = /^\d+\.\s+[“"](.*)[”"]\s*$/gm
  for (const match of nodeBlock.matchAll(choicePattern)) {
    choices.push({ id: createStableChoiceId(nodeId, match[1]), text: match[1] })
  }
  return choices
}

function parseNodes(sceneBlock: string, conversationId: string, conversationTitle: string): StoryNode[] {
  const markers = [...sceneBlock.matchAll(/^### NODE:\s*(\S+)\s*$/gm)]
  return markers.map((marker, index) => {
    const start = marker.index ?? 0
    const end = markers[index + 1]?.index ?? sceneBlock.length
    const nodeBlock = sceneBlock.slice(start, end)
    const messageSection = nodeBlock.match(/\*\*用户消息：\*\*\s*\r?\n([\s\S]*?)(?=\r?\n\*\*候选回复：\*\*)/)?.[1]
    const message = messageSection
      ?.split(/\r?\n/)
      .filter((line) => /^>/.test(line))
      .map((line) => line.replace(/^>\s?/, ''))
      .join('\n')
      .trim()
    if (!message) throw new Error(`Missing user message for ${marker[1]}`)
    const choices = parseChoices(nodeBlock, marker[1])
    if (choices.length !== 4) throw new Error(`Expected four choices for ${marker[1]}`)
    return {
      id: marker[1],
      conversationId,
      conversationTitle,
      userMessage: message,
      choices,
    }
  })
}

function parseBatch(raw: string, origin: 'batch01' | 'batch02' | 'batch03' | 'humor01'): NarrativeSceneSource[] {
  const markerPattern = origin === 'humor01'
    ? /^## SCENE\s+H(\d+)\s+·\s+(.+)$/gm
    : /^## SCENE\s+(\d+)\s+·\s+(.+)$/gm
  const markers = [...raw.matchAll(markerPattern)]
  return markers.map((marker, index) => {
    const number = marker[1].padStart(2, '0')
    const start = marker.index ?? 0
    const end = markers[index + 1]?.index ?? raw.indexOf('\n# 内容索引', start)
    const sceneBlock = raw.slice(start, end > start ? end : raw.length)
    const conversationTitle = sceneBlock.match(/\*\*Conversation：\*\*\s*(.+)/)?.[1]?.trim()
    if (!conversationTitle) throw new Error(`Missing conversation title for ${origin}:${number}`)
    const conversationId = `${origin}-scene-${number}`
    const nodes = parseNodes(sceneBlock, conversationId, conversationTitle)
    const conversation: ConversationDefinition = {
      id: conversationId,
      sourceRefs: [`${origin}:${number}`],
      nodes,
      behaviorModes: ['direct'],
      handoffProfile: 'normal',
      turnShape: nodes.length === 1 ? 'single' : 'dialogue',
    }
    return {
      id: `${origin}:${number}`,
      title: marker[2].trim(),
      origin,
      conversations: [conversation],
    }
  })
}

export const narrativeSources = [
  ...parseBatch(batch01Raw, 'batch01'),
  ...parseBatch(batch02Raw, 'batch02'),
]

export const batch03Sources = parseBatch(batch03Raw, 'batch03')
export const humor01Sources = parseBatch(humor01Raw, 'humor01')

const auditStatus: Record<number, Batch02EditorialStatus> = {
  1: 'KEEP_REWORK', 2: 'KEEP_STRONG', 3: 'KEEP_STRONG', 4: 'KEEP_REWORK', 5: 'KEEP_STRONG',
  6: 'KEEP_STRONG', 7: 'MERGE', 8: 'MERGE', 9: 'KEEP_STRONG', 10: 'KEEP_STRONG',
  11: 'KEEP_REWORK', 12: 'KEEP_STRONG', 13: 'MERGE', 14: 'MERGE', 15: 'KEEP_REWORK',
  16: 'KEEP_STRONG', 17: 'KEEP_STRONG', 18: 'MERGE', 19: 'KEEP_STRONG', 20: 'MERGE',
  21: 'KEEP_STRONG', 22: 'KEEP_REWORK', 23: 'MERGE', 24: 'KEEP_STRONG', 25: 'KEEP_STRONG',
}

const candidateScenes = new Set([3, 8, 12, 14, 16, 19, 21, 25])
const absorbedScenes = new Set([8, 12, 14, 16, 19, 25])
const mergedScenes = new Set([8, 14])

export const batch02Audit: Batch02AuditEntry[] = Array.from({ length: 25 }, (_, index) => {
  const sceneNumber = index + 1
  return {
    sceneNumber,
    editorialStatus: auditStatus[sceneNumber],
    currentRunCandidate: candidateScenes.has(sceneNumber),
    absorbedIntoCurrentRun: absorbedScenes.has(sceneNumber),
    deployment: mergedScenes.has(sceneNumber)
      ? 'merge'
      : absorbedScenes.has(sceneNumber)
        ? 'replace'
        : 'reserve',
    note: sceneNumber === 1
      ? 'Reserve; replace the conflicting User #1842 identity before use.'
      : sceneNumber === 18
        ? 'Merge into the fridge-noise source instead of creating a duplicate appliance rhythm.'
        : absorbedScenes.has(sceneNumber)
          ? 'Approved for the current run.'
          : 'Retained in the long-term source library.',
  }
})

const sourceMap = new Map(narrativeSources.map((source) => [source.id, source]))

export function getSourceNode(sourceId: string, nodeId: string): StoryNode {
  const source = sourceMap.get(sourceId)
  if (!source) throw new Error(`Unknown narrative source ${sourceId}`)
  const node = source.conversations.flatMap((conversation) => conversation.nodes)
    .find((candidate) => candidate.id === nodeId)
  if (!node) throw new Error(`Unknown node ${nodeId} in ${sourceId}`)
  return {
    ...node,
    choices: node.choices.map((choice) => ({ ...choice })),
  }
}
