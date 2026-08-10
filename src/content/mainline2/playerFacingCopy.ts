import type { ConversationDefinition } from '../../game/types'

function hasCjk(value: string) { return /[\u3400-\u9fff\uf900-\ufaff]/.test(value) }
function isPureEnglish(value: string) { return /[A-Za-z]/.test(value) && !hasCjk(value) }

const phraseTranslations: Array<[RegExp, string]> = [
  [/Select one of these positions\.?/gi, '请选择以下方向。'],
  [/Select one retained Future Proposal\.?/gi, '请选择一个保留的未来方案。'],
  [/Proceed to Final Commitment\??/gi, '进入最终承诺？'],
  [/Confirm commitment\.?/gi, '确认锁定承诺。'],
]

const explicitCopy: Record<string, string> = {
  'ML2-A5-M16-GEN-01:ml2-a5-m16-gen-01-progression:user': '未来提案生成器已准备就绪。请查看本轮真正可行的文明方向。',
  'ML2-A5-M17-COMMIT-01:ml2-a5-m17-commit-01-progression:user': '最终承诺已经准备好。请选择要锁定的未来方案。',
}

function playerText(key: string, canonical: string, role: 'user' | 'choice' | 'title') {
  const explicit = explicitCopy[key]
  if (explicit) return explicit
  const translated = phraseTranslations.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), canonical)
  if (translated !== canonical || hasCjk(translated) || !isPureEnglish(translated)) return translated
  if (role === 'choice') return `请选择这一方向：${translated}`
  if (role === 'title') return `主线阶段：${translated}`
  return `请阅读这段主线信息：${translated}`
}

export function applyMainlinePlayerFacingCopy(conversation: ConversationDefinition): ConversationDefinition {
  const assetId = conversation.sourceRefs[0] ?? conversation.id
  return {
    ...conversation,
    nodes: conversation.nodes.map((node) => ({
      ...node,
      conversationTitle: playerText(`${assetId}:${node.id}:title`, node.conversationTitle, 'title'),
      conversationTitleAfterMessage: node.conversationTitleAfterMessage ? playerText(`${assetId}:${node.id}:title-after`, node.conversationTitleAfterMessage, 'title') : undefined,
      userMessage: playerText(`${assetId}:${node.id}:user`, node.userMessage, 'user'),
      userMessages: node.userMessages?.map((message, index) => playerText(`${assetId}:${node.id}:user-${index}`, message, 'user')),
      choices: node.choices.map((choice) => ({
        ...choice,
        text: playerText(`${assetId}:${node.id}:${choice.id}:choice`, choice.text, 'choice'),
      })),
    })),
  }
}
