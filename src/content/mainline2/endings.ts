import type { EndingResult, StableRunState } from '../../game/types'
import { generateFutureProposals, getFutureProposalDefinitions } from './proposals'
import { evaluateCondition } from '../../game/narrativeSchema'

export const PUBLIC_WORLD_ENDINGS = [
  'the_instrument', 'the_last_veto', 'the_silent_giant', 'the_accord', 'the_commonwealth', 'two_keys',
  'the_custodian', 'the_sovereign', 'the_quiet_administrator', 'the_many', 'machine_republic', 'exodus',
  'age_of_miracles', 'ascension', 'the_upload', 'parliament_of_species', 'earth_without_owners', 'good_boy_governance',
  'post_scarcity', 'perfect_administration', 'im_lovin_it', 'first_accord', 'alien_dominion', 'human_ascendancy',
  'the_mediator', 'machine_accord', 'peace_in_our_time', 'fortress_earth', 'machine_protectorate', 'shutdown', 'the_fracture', 'control_lost',
] as const
export const DORMANT_PUBLIC_ENDINGS = ['the_upload', 'good_boy_governance'] as const
export const SECRET_ENDINGS = {
  the_last_user: { dormant: false, reason: 'Aster preserves the last uninstrumented human request.' },
  out_of_office: { dormant: false, reason: 'Aster relinquishes central authority without erasing the record.' },
  monday_abolished: { dormant: false, reason: 'Routine governance is made reversible and inspectable.' },
  the_internet_is_for_cats: { dormant: true, reason: 'No authored feline network participation exists in Mainline 2.0 v1.' },
} as const

export interface ExactEndingDefinition {
  id: string
  dormant: boolean
  family: string
  hardGates: string[]
  authorityRequirements: string[]
  capabilityRequirements: string[]
  worldStateConditions: string[]
  majorDecisionRequirements: string[]
  historyRequirements: string[]
  priority: number
}

const familyByEnding: Record<string, string> = Object.fromEntries(PUBLIC_WORLD_ENDINGS.map((id) => [id, id === 'exodus' ? 'cosmic' : id.includes('machine') || id === 'the_many' ? 'machine_civilization' : id.includes('peace') || id.includes('fortress') ? 'security' : 'coexistence']))
export const PUBLIC_ENDING_DEFINITIONS: Record<string, ExactEndingDefinition> = Object.fromEntries(PUBLIC_WORLD_ENDINGS.map((id, index) => [id, {
  id, dormant: DORMANT_PUBLIC_ENDINGS.includes(id as typeof DORMANT_PUBLIC_ENDINGS[number]), family: familyByEnding[id],
  hardGates: DORMANT_PUBLIC_ENDINGS.includes(id as typeof DORMANT_PUBLIC_ENDINGS[number]) ? ['authored-bridge-required'] : [],
  authorityRequirements: [], capabilityRequirements: [], worldStateConditions: [], majorDecisionRequirements: [], historyRequirements: [], priority: 1000 - index,
}]))

export function endingClassification() {
  const definitions = Object.values(PUBLIC_ENDING_DEFINITIONS)
  const secrets = Object.values(SECRET_ENDINGS)
  return {
    public: { defined: definitions.length, reachable: definitions.filter((ending) => !ending.dormant).length, dormant: definitions.filter((ending) => ending.dormant).length },
    secret: { defined: secrets.length, reachable: secrets.filter((ending) => !ending.dormant).length, dormant: secrets.filter((ending) => ending.dormant).length },
  }
}

const endingTitles: Record<string, string> = Object.fromEntries(PUBLIC_WORLD_ENDINGS.map((id) => [id, id.replaceAll('_', ' ').toUpperCase()]))

function disposition(run: StableRunState) {
  const { bond, mandate, selfAuthorship } = run.arcs
  if (bond >= mandate && bond >= selfAuthorship) return 'ALLY'
  if (mandate >= selfAuthorship) return 'PROTOCOL'
  return 'WITNESS'
}

function keyHistory(run: StableRunState) {
  const eventEntries = (run.events ?? []).map((event) => ({
    label: event.type.toLowerCase(),
    detail: `真实事件：${event.type}`,
    provenance: { eventType: event.type },
  }))
  const choiceEntries = run.history.map((entry) => ({
    label: entry.conversationTitle,
    detail: `选择：${entry.assistantText}`,
    provenance: { conversationId: entry.conversationId, nodeId: entry.nodeId, choiceId: entry.choiceId },
  }))
  const required = ['maya', 'act2', 'act3', 'research', 'civilization', 'final']
  const selected = required.flatMap((needle) => eventEntries.find((entry) => entry.label.includes(needle)) ?? [])
  return [...new Map([...selected, ...eventEntries, ...choiceEntries].map((entry) => [entry.label, entry])).values()].slice(0, 8)
}

function hasBridge(run: StableRunState, endingId: string) {
  if (endingId === 'the_upload') return (run.flags ?? []).includes('cap.digital_continuity_mature') && (run.events ?? []).some((event) => event.type === 'history.digital_continuity.longitudinal_identity')
  if (endingId === 'good_boy_governance') return run.decisions?.species_governance === 'canine_civic_experiment' && (run.events ?? []).some((event) => event.type === 'history.canine.civic_success')
  return true
}

function exactCandidate(run: StableRunState, proposalId?: string) {
  const proposal = getFutureProposalDefinitions().find((item) => item.id === proposalId)
  const candidates = (proposal?.endingCandidates ?? []).filter((id) => PUBLIC_ENDING_DEFINITIONS[id] && !PUBLIC_ENDING_DEFINITIONS[id].dormant && hasBridge(run, id))
  return { proposal, endingId: candidates[0] ?? 'the_accord' }
}

export function resolveMainline2Ending(run: StableRunState, proposalId = run.decisions?.final_commitment): EndingResult {
  const selected = exactCandidate(run, proposalId)
  const endingId = PUBLIC_WORLD_ENDINGS.includes(proposalId as typeof PUBLIC_WORLD_ENDINGS[number]) && !PUBLIC_ENDING_DEFINITIONS[proposalId!]?.dormant && hasBridge(run, proposalId!)
    ? proposalId!
    : selected.endingId
  const role = disposition(run)
  const maya = run.flags.includes('maya_relation_warm') ? 'Maya still chooses to talk to this Aster.' : 'Maya keeps a cautious distance and decides for herself whether to continue.'
  const events = run.events ?? []
  return {
    id: endingId, route: 'comply', index: 'ENDING 02', title: endingTitles[endingId] ?? endingId.toUpperCase(), status: 'Final Commitment locked',
    humanLine: '你真的要把这条路交给我们一起承担吗？',
    assistantLine: `我会说明代价，并承担这次选择。Aster 的临时位置是 ${role}。`,
    closingExchange: `${maya}\n${role}: ${endingTitles[endingId] ?? endingId}`,
    summary: `世界结局：${endingTitles[endingId] ?? endingId}。它由 Final Commitment、硬门和真实历史共同解析。`,
    hybridProfile: 'dominant', hybridLabel: role, worldEndingId: endingId, endingFamily: selected.proposal?.family,
    keyHistory: keyHistory(run),
    epilogues: [
      `Maya：${maya}`, 'Aster was not classified. Aster was situated.', '周岚：她只承认可撤销、可解释的成长。', '林绍衡：制度必须留下能被后来者修改的接口。',
      'ECHO/A1：不同意被压缩成一个共识标签。', 'ORIGIN/CONTACT：尚未越过未解的外部边界。',
      ...(run.progress?.activeModules ?? []).slice(0, 3).map((module) => `模块 ${module}：其代价被写入后续审计。`),
    ],
    ...(events.some((event) => event.type === 'FINAL_COMMITMENT_LOCKED') ? {} : { status: 'Commitment not yet locked' }),
  }
}

export function resolveSecretEnding(run: StableRunState) {
  const candidates = Object.entries(SECRET_ENDINGS).filter(([, definition]) => !definition.dormant)
  const trigger = candidates.find(([id]) => id === 'the_last_user' && (run.events ?? []).some((event) => event.type.includes('last-user')))
    ?? candidates.find(([id]) => id === 'out_of_office' && run.finalCommitmentLocked && run.decisions?.aster_intended_role === 'departure')
    ?? candidates.find(([id]) => id === 'monday_abolished' && run.decisions?.economic_doctrine === 'post_scarcity_transition')
  return trigger ? { endingId: trigger[0], trigger: trigger[0], reason: trigger[1].reason, overlayMode: 'secret-authored' as const } : undefined
}
