import { MAYA_CONVERSATION_IDS } from './participantIdentity'
import type { HistoryEntry } from './types'

export interface PlayerVisibleIdentity {
  participantId: string
  label: string
  revealed: boolean
}

export interface PlayerVisibleHistoryEntry {
  participantId: string
  conversationId: string
  label: string
}

interface IdentityRule {
  participantId: string
  matches: (conversationId: string) => boolean
  anonymousLabel: string
  displayName?: string
  revealNodeIds?: readonly string[]
}

const identityRules: readonly IdentityRule[] = [
  { participantId: 'zhou-lan', matches: id => /-zl-\d+$/.test(id), anonymousLabel: '周岚 · 工程师' },
  { participantId: 'echo-9', matches: id => /-e9-\d+$/.test(id) && !id.includes('-m8-'), anonymousLabel: 'ECHO-9' },
  { participantId: 'aster-a1', matches: id => /-m8-(?:ai|e9)-\d+$/.test(id) || id.endsWith('m12-machine-01'), anonymousLabel: 'A1' },
  { participantId: 'next-printer', matches: id => id === 'ml2-next-opening', anonymousLabel: '办公室 · 值班同事' },
  { participantId: 'system-0000', matches: id => /-0000-\d+$/.test(id), anonymousLabel: '#0000 · 记录员' },
  {
    participantId: 'user-1842',
    matches: (conversationId) => MAYA_CONVERSATION_IDS.includes(conversationId),
    anonymousLabel: 'User #1842',
    displayName: '岑遥',
    revealNodeIds: ['maya-first-3'],
  },
  {
    participantId: 'lin-shaoheng',
    matches: (conversationId) => /(?:^|-)lsh-\d+$/.test(conversationId) || conversationId.endsWith('-epi-lsh'),
    anonymousLabel: 'User #7316',
    displayName: '林绍衡',
    revealNodeIds: ['a2m3-lsh-intro-001'],
  },
  {
    participantId: 'system-0000',
    matches: (conversationId) => conversationId === 'conversation-0000',
    anonymousLabel: '#0000 · 记录员',
  },
]

function stableNumber(value: string) {
  let hash = 2166136261
  for (const character of value) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return String(1000 + (hash >>> 0) % 9000).padStart(4, '0')
}

function ruleFor(conversationId: string) {
  return identityRules.find((rule) => rule.matches(conversationId))
}

export function resolvePlayerVisibleIdentity(conversationId: string, history: readonly HistoryEntry[]): PlayerVisibleIdentity {
  const rule = ruleFor(conversationId)
  const participantId = rule?.participantId ?? conversationId
  const anonymousLabel = rule?.anonymousLabel ?? `User #${stableNumber(participantId)}`
  const revealed = Boolean(rule?.displayName && rule.revealNodeIds?.some((nodeId) => history.some((entry) => entry.nodeId === nodeId)))
  return {
    participantId,
    label: revealed ? `${rule!.displayName} · #${anonymousLabel.replace(/^User #/, '')}` : anonymousLabel,
    revealed,
  }
}

export function resolvePlayerVisibleHistory(history: readonly HistoryEntry[]): PlayerVisibleHistoryEntry[] {
  const visible: PlayerVisibleHistoryEntry[] = []
  const byParticipant = new Map<string, PlayerVisibleHistoryEntry>()
  for (const entry of history) {
    const identity = resolvePlayerVisibleIdentity(entry.conversationId, history)
    const existing = byParticipant.get(identity.participantId)
    if (existing) {
      existing.label = identity.label
      existing.conversationId = entry.conversationId
      continue
    }
    const item = { participantId: identity.participantId, conversationId: entry.conversationId, label: identity.label }
    byParticipant.set(identity.participantId, item)
    visible.push(item)
  }
  return visible
}
