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
  {
    participantId: 'user-1842',
    matches: (conversationId) => conversationId === 'user-1842-first' || conversationId === 'user-1842-return',
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
    anonymousLabel: 'User #7049',
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
