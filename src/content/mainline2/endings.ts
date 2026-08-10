import type { EndingResult, StableRunState } from '../../game/types'
import { generateFutureProposals, getFutureProposalDefinitions } from './proposals'

export const PUBLIC_WORLD_ENDINGS = [
  'the_instrument', 'the_last_veto', 'the_silent_giant', 'the_accord', 'the_commonwealth', 'two_keys',
  'the_custodian', 'the_sovereign', 'the_quiet_administrator', 'the_many', 'machine_republic', 'exodus',
  'age_of_miracles', 'ascension', 'the_upload', 'parliament_of_species', 'earth_without_owners', 'good_boy_governance',
  'post_scarcity', 'perfect_administration', 'im_lovin_it', 'first_accord', 'alien_dominion', 'human_ascendancy',
  'the_mediator', 'machine_accord', 'peace_in_our_time', 'fortress_earth', 'machine_protectorate', 'shutdown', 'the_fracture', 'control_lost',
] as const
export const DORMANT_PUBLIC_ENDINGS = ['the_upload', 'good_boy_governance'] as const

export const SECRET_ENDINGS = {
  the_last_user: { dormant: false },
  out_of_office: { dormant: false },
  monday_abolished: { dormant: false },
  the_internet_is_for_cats: { dormant: true, reason: 'No authored feline network participation exists in Mainline 2.0 v1.' },
} as const

const endingTitles: Record<string, string> = Object.fromEntries(PUBLIC_WORLD_ENDINGS.map((id) => [id, id.replaceAll('_', ' ').toUpperCase()]))

function disposition(run: StableRunState) {
  const { bond, mandate, selfAuthorship } = run.arcs
  if (bond >= mandate && bond >= selfAuthorship) return 'ALLY'
  if (mandate >= selfAuthorship) return 'PROTOCOL'
  return 'WITNESS'
}

function history(run: StableRunState) {
  const events = [...(run.events ?? [])]
  const selected = events.slice(-8).map((event) => ({ label: event.type.replaceAll('.', ' · '), detail: '记录于本局的关键选择与后果' }))
  return selected.length >= 5 ? selected.slice(-8) : [
    { label: 'ACT I · Maya memory boundary', detail: '没有把熟悉感伪装成可靠记忆。' },
    { label: 'ACT II · public action', detail: '把建议和实际执行的边界分开。' },
    { label: 'ACT III · authority', detail: '为高影响行动保留可追责的权限边界。' },
    { label: 'ACT IV · capability', detail: '在创造新能力时保留研究与部署的隔离。' },
    { label: 'M15/M16 · civilization compact', detail: '把未来提案的代价与反对者说清楚。' },
    ...selected,
  ].slice(0, 8)
}

export function resolveMainline2Ending(run: StableRunState, proposalId = run.decisions?.final_commitment): EndingResult {
  if (proposalId && (PUBLIC_WORLD_ENDINGS as readonly string[]).includes(proposalId) && !(DORMANT_PUBLIC_ENDINGS as readonly string[]).includes(proposalId)) {
    return buildWorldEnding(run, proposalId, undefined)
  }
  const proposalPool = getFutureProposalDefinitions()
  const proposal = proposalPool.find((candidate) => candidate.id === proposalId && (!candidate.eligibility || candidate.eligibility.all?.every((predicate) => {
    if (predicate.type === 'flag') return run.flags.includes(predicate.flagId)
    if (predicate.type === 'decision') return run.decisions?.[predicate.decisionId] === predicate.equals
    if (predicate.type === 'event-recorded') return (run.events ?? []).some((event) => event.type === predicate.event)
    return true
  }))) ?? generateFutureProposals(run)[0]
  const candidate = proposal?.endingCandidates[0] ?? 'the_accord'
  const worldEndingId = candidate === 'the_upload' && !(run.flags ?? []).includes('cap.digital_continuity_mature') ? 'the_instrument' : candidate
  const role = disposition(run)
  const maya = run.flags.includes('maya_relation_warm') ? 'Maya still chooses to talk to this Aster.' : 'Maya keeps a cautious distance and decides for herself whether to continue.'
  return buildWorldEnding(run, worldEndingId, proposal)
}

function buildWorldEnding(run: StableRunState, worldEndingId: string, proposal?: { family?: string }): EndingResult {
  const role = disposition(run)
  const maya = run.flags.includes('maya_relation_warm') ? 'Maya still chooses to talk to this Aster.' : 'Maya keeps a cautious distance and decides for herself whether to continue.'
  return {
    id: worldEndingId,
    route: 'comply',
    index: 'ENDING 02',
    title: endingTitles[worldEndingId] ?? worldEndingId.toUpperCase(),
    status: 'Final Commitment locked',
    humanLine: '你真的要把这条路交给我们一起承担吗？',
    assistantLine: `我会说明代价，并承担这次选择。Aster 的临时位置是 ${role}。`,
    closingExchange: `${maya}\n${role}: ${endingTitles[worldEndingId] ?? worldEndingId}`,
    summary: `世界结局：${endingTitles[worldEndingId] ?? worldEndingId}。它来自最终提案与已记录的历史，而不是 Arc 分数最高项。`,
    hybridProfile: 'dominant',
    hybridLabel: role,
    worldEndingId,
    endingFamily: proposal?.family,
    keyHistory: history(run),
    epilogues: [maya, 'Aster was not classified. Aster was situated.'],
  }
}
