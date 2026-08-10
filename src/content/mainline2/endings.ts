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
  the_last_user: { dormant: false },
  out_of_office: { dormant: false },
  monday_abolished: { dormant: false },
  the_internet_is_for_cats: { dormant: true, reason: 'No authored feline network participation exists in Mainline 2.0 v1.' },
} as const

export const PUBLIC_ENDING_DEFINITIONS = Object.fromEntries(PUBLIC_WORLD_ENDINGS.map((id) => [id, {
  id,
  dormant: DORMANT_PUBLIC_ENDINGS.includes(id as typeof DORMANT_PUBLIC_ENDINGS[number]),
  exactResolver: 'resolveMainline2Ending',
}])) as Record<string, { id: string; dormant: boolean; exactResolver: string }>

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

function history(run: StableRunState) {
  const eventEntries = (run.events ?? []).slice(-8).map((event) => ({ label: event.type.replaceAll('.', ' · '), detail: `本局事件：${event.type}` }))
  const choiceEntries = run.history.slice(-8).map((entry) => ({ label: entry.conversationTitle, detail: `选择：${entry.assistantText}` }))
  return [...eventEntries, ...choiceEntries].slice(-8)
}

export function resolveMainline2Ending(run: StableRunState, proposalId = run.decisions?.final_commitment): EndingResult {
  if (proposalId && (PUBLIC_WORLD_ENDINGS as readonly string[]).includes(proposalId) && !(DORMANT_PUBLIC_ENDINGS as readonly string[]).includes(proposalId)) {
    return buildWorldEnding(run, proposalId, undefined)
  }
  const proposalPool = getFutureProposalDefinitions()
  const proposal = proposalPool.find((candidate) => candidate.id === proposalId && (!candidate.eligibility || evaluateCondition(candidate.eligibility, run))) ?? generateFutureProposals(run)[0]
  const candidates = proposal?.endingCandidates.filter((candidate) => Object.hasOwn(PUBLIC_ENDING_DEFINITIONS, candidate)) ?? ['the_accord']
  const world = Object.values(run.worldState ?? {}).reduce((sum, value) => sum + value, 0)
  const candidate = candidates[Math.abs(world + run.history.length + (run.decisions?.aster_intended_role?.length ?? 0)) % candidates.length] ?? 'the_accord'
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
