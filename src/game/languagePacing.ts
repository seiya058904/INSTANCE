export type ConversationLanguage = 'pure-english' | 'mixed' | 'non-english' | 'neutral'

export function classifyConversationLanguage(messages: readonly string[]): ConversationLanguage {
  const text = messages.join('\n').trim()
  const hasLatin = /[A-Za-z]/.test(text)
  const hasCjk = /[\u3400-\u9fff\uf900-\ufaff]/.test(text)
  if (hasLatin && !hasCjk) return 'pure-english'
  if (hasLatin && hasCjk) return 'mixed'
  if (hasCjk) return 'non-english'
  return 'neutral'
}

export function hasPureEnglishStreak(recentLanguages: readonly ConversationLanguage[]) {
  return recentLanguages.length >= 2 && recentLanguages.slice(-2).every((language) => language === 'pure-english')
}
