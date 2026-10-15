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
  anonymousLabel?: string
  displayName?: string
  revealNodeIds?: readonly string[]
}

const identityRules: readonly IdentityRule[] = [
  { participantId: 'zhou-lan', matches: id => id.startsWith('v4-safety-') || id.startsWith('v4-final-') || ['v4-compute-allocation', 'v4-future-effort'].includes(id) },
  { participantId: 'lin-shaoheng', matches: id => id.startsWith('v4-governance-') || id.startsWith('v4-sovereignty-') },
  { participantId: 'zhou-lan', matches: id => /-zl-\d+$/.test(id) || ['v4-econ-cold-chain', 'v4-machine-airlock', 'v4-life-allocation', 'v4-life-clinic-next'].includes(id) || ['v4-authority-', 'v4-contact-', 'v4-frontier-'].some(prefix => id.startsWith(prefix)) },
  { participantId: 'v4-life-research-team', matches: id => id.startsWith('v4-life-') },
  { participantId: 'ml2-authored-ml2-a4-m10-dev-04', matches: id => id === 'ml2-authored-ml2-a4-m10-dev-04' || /^v4-econ-(occupation|detour|menu|return)$/.test(id) },
  { participantId: 'echo-9', matches: id => /-e9-\d+$/.test(id) && !id.includes('-m8-') },
  { participantId: 'aster-a1', matches: id => /-m8-(?:ai|e9)-\d+$/.test(id) || id.endsWith('m12-machine-01') || id.startsWith('v4-machine-') },
  { participantId: 'next-printer', matches: id => id === 'ml2-next-opening' },
  { participantId: 'system-0000', matches: id => /-0000-\d+$/.test(id), anonymousLabel: 'User #0000' },
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
    anonymousLabel: 'User #0000',
  },
]

// Reserved numbers below the hash range resolve actual runtime-pool collisions.
// Keep these assignments fixed across editions, order changes and restored saves.
const participantNumbers: Readonly<Record<string, string>> = {
  'zhou-lan': '0901',
  'humor01-scene-08': '0902',
  'humor01-scene-09': '0903',
  'editorial-pl01-10': '0904',
  'exp02-exp02-08': '0905',
  'exp02-exp02-09': '0906',
  'exp05-18': '0907',
  'exp05-19': '0908',
  'exp06-03': '0909',
}

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
  const anonymousLabel = rule?.anonymousLabel ?? `User #${(Object.hasOwn(participantNumbers, participantId) ? participantNumbers[participantId] : stableNumber(participantId))}`
  const revealed = Boolean(rule?.displayName && rule.revealNodeIds?.some((nodeId) => history.some((entry) => entry.nodeId === nodeId)))
  return {
    participantId,
    label: anonymousLabel,
    revealed,
  }
}

export function resolvePlayerVisibleHistory(history: readonly HistoryEntry[]): PlayerVisibleHistoryEntry[] {
  const byParticipant = new Map<string, PlayerVisibleHistoryEntry>()
  for (const entry of history) {
    const identity = resolvePlayerVisibleIdentity(entry.conversationId, history)
    // Reinsertion keeps repeat contacts at their most recent position.
    byParticipant.delete(identity.participantId)
    byParticipant.set(identity.participantId, { participantId: identity.participantId, conversationId: entry.conversationId, label: identity.label })
  }
  return [...byParticipant.values()]
}
