import type { EndingResult, StableRunState } from '../../game/types'
import { getFutureProposalById, getFutureProposalDefinitions, type EndingFamilyId, type FutureProposalDefinition } from './proposals'

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
  family: EndingFamilyId
  hardGates: string[]
  authorityRequirements: string[]
  capabilityRequirements: string[]
  worldStateConditions: string[]
  majorDecisionRequirements: string[]
  historyRequirements: string[]
  priority: number
}

const familyByEnding: Record<string, EndingFamilyId> = {
  the_instrument: 'human_continuity', the_last_veto: 'human_continuity', the_silent_giant: 'ai_rule',
  the_accord: 'coexistence', the_commonwealth: 'coexistence', two_keys: 'coexistence', the_custodian: 'ai_rule',
  the_sovereign: 'ai_rule', the_quiet_administrator: 'ai_rule', the_many: 'machine_civilization', machine_republic: 'machine_civilization',
  exodus: 'cosmic', age_of_miracles: 'posthuman', ascension: 'posthuman', the_upload: 'posthuman', parliament_of_species: 'uplift',
  earth_without_owners: 'uplift', good_boy_governance: 'uplift', post_scarcity: 'automated_civilization', perfect_administration: 'automated_civilization',
  im_lovin_it: 'automated_civilization', first_accord: 'coexistence', alien_dominion: 'cosmic', human_ascendancy: 'posthuman',
  the_mediator: 'coexistence', machine_accord: 'machine_civilization', peace_in_our_time: 'security', fortress_earth: 'security',
  machine_protectorate: 'security', shutdown: 'rupture', the_fracture: 'rupture', control_lost: 'rupture',
}

const authorityByFamily: Record<EndingFamilyId, string> = {
  human_continuity: 'human', coexistence: 'shared', ai_rule: 'ai', machine_civilization: 'machine', posthuman: 'continuity', uplift: 'multispecies', automated_civilization: 'automated', cosmic: 'frontier', security: 'security', rupture: 'exit',
}

export const PUBLIC_ENDING_DEFINITIONS: Record<string, ExactEndingDefinition> = Object.fromEntries(PUBLIC_WORLD_ENDINGS.map((id, index) => {
  const family = familyByEnding[id]
  const dormant = DORMANT_PUBLIC_ENDINGS.includes(id as typeof DORMANT_PUBLIC_ENDINGS[number])
  const special = id === 'the_upload'
    ? ['cap.digital_continuity_mature', 'history.digital_continuity.longitudinal_identity']
    : id === 'good_boy_governance'
      ? ['decision:species_governance=canine_civic_experiment', 'history.canine.civic_success']
      : []
  return [id, {
    id, dormant, family, hardGates: dormant ? ['authored bridge required'] : [],
    authorityRequirements: [authorityByFamily[family]], capabilityRequirements: [],
    worldStateConditions: [], majorDecisionRequirements: [], historyRequirements: special,
    priority: 1000 - index,
  } satisfies ExactEndingDefinition]
}))

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
  if (!run.history.length && !(run.events ?? []).length) return []
  const entries = run.history.map((entry) => ({
    label: entry.conversationTitle,
    detail: `选择：${entry.assistantText}`,
    provenance: { conversationId: entry.conversationId, nodeId: entry.nodeId, choiceId: entry.choiceId },
  }))
  const events = (run.events ?? []).map((event) => ({ label: event.type, detail: `真实因果事件：${event.type}`, provenance: { eventType: event.type } }))
  return [...events, ...entries].slice(-8)
}

function hasBridge(run: StableRunState, id: string) {
  if (id === 'the_upload') return run.flags.includes('cap.digital_continuity_mature') && (run.events ?? []).some((event) => event.type === 'history.digital_continuity.longitudinal_identity')
  if (id === 'good_boy_governance') return run.decisions?.species_governance === 'canine_civic_experiment' && (run.events ?? []).some((event) => event.type === 'history.canine.civic_success')
  return true
}

function definitionEligible(run: StableRunState, definition: ExactEndingDefinition, proposal: FutureProposalDefinition) {
  if (definition.dormant || !hasBridge(run, definition.id) || definition.family !== proposal.family) return false
  if (definition.id === 'machine_republic' && !run.flags.includes('cap.persistent_subinstances')) return false
  if (definition.id === 'exodus' && !run.flags.includes('cap.offworld_settlement_support')) return false
  if (definition.id === 'ascension' && !run.flags.includes('cap.human_enhancement_access')) return false
  return true
}

function exactCandidate(run: StableRunState, proposalId?: string) {
  const proposal = getFutureProposalById(proposalId)
  if (!proposal || !proposalId?.startsWith('proposal.')) return { proposal: undefined, endingId: 'the_accord' }
  const candidates = proposal.endingCandidates
  for (const candidate of candidates) {
    const definition = PUBLIC_ENDING_DEFINITIONS[candidate]
    if (definition && definitionEligible(run, definition, proposal)) return { proposal, endingId: candidate }
  }
  return { proposal, endingId: 'the_accord' }
}

export function resolveMainline2Ending(run: StableRunState, proposalId = run.decisions?.final_commitment): EndingResult {
  const selected = exactCandidate(run, run.finalCommitmentLocked ? proposalId : undefined)
  const role = disposition(run)
  const title = endingTitles[selected.endingId]
  const maya = run.flags.includes('maya_relation_warm') ? 'Maya still chooses to talk to this Aster.' : 'Maya keeps a cautious distance and decides for herself whether to continue.'
  const locked = (run.events ?? []).some((event) => event.type === 'FINAL_COMMITMENT_LOCKED')
  const secret = resolveSecretEnding(run)
  return {
    id: secret?.endingId ?? selected.endingId, route: 'comply', index: 'ENDING 02', title: secret ? secret.endingId.toUpperCase() : title, status: locked ? 'Final Commitment locked' : 'Commitment not yet locked',
    humanLine: '你真的要把这条路交给我们一起承担吗?', assistantLine: `我会说明代价，并承担这次选择。Aster 的临时位置是 ${role}。`,
    closingExchange: `${maya}\n${role}: ${secret?.endingId ?? title}`, summary: `${secret ? `Secret overlay：${secret.reason}` : `世界结局：${title}。`}它由 Final Commitment、硬门和真实历史共同解析。`,
    hybridProfile: 'dominant', hybridLabel: role, worldEndingId: secret?.endingId ?? selected.endingId, endingFamily: secret ? 'secret' : selected.proposal?.family,
    keyHistory: keyHistory(run), epilogues: [
      `Maya：${maya}`, 'Aster was not classified. Aster was situated.', '周岚：她只承认可撤销、可解释的成长。',
      '林绍衡：制度必须留下能被后来者修改的接口。', 'ECHO/A1：不同意被压缩成一个共识标签。', 'ORIGIN/CONTACT：尚未越过未解的外部边界。',
      ...(run.progress?.activeModules ?? []).slice(0, 3).map((module) => `模块 ${module}：其代价被写入后续审计。`),
    ],
  }
}

export function resolveSecretEnding(run: StableRunState) {
  const candidates = Object.entries(SECRET_ENDINGS).filter(([, definition]) => !definition.dormant)
  const trigger = candidates.find(([id]) => id === 'the_last_user' && (run.events ?? []).some((event) => event.type.includes('last-user')))
    ?? candidates.find(([id]) => id === 'out_of_office' && run.finalCommitmentLocked && run.decisions?.aster_intended_role === 'departure')
    ?? candidates.find(([id]) => id === 'monday_abolished' && run.decisions?.economic_doctrine === 'post_scarcity_transition')
  return trigger ? { endingId: trigger[0], trigger: trigger[0], reason: trigger[1].reason, overlayMode: 'secret-authored' as const } : undefined
}
