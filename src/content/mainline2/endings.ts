import type { EndingResolution, EndingResult, SecretEndingOverlay, StableRunState, WorldAxisName } from '../../game/types'
import { MAINLINE2_AUTHored_FRAGMENTS } from './authoredLibrary.generated'
import { MAINLINE2_BY_ID as RUNTIME_MAINLINE2_BY_ID } from './registry'
import { getFutureProposalById, type EndingFamilyId, type FutureProposalDefinition } from './proposals'

export const PUBLIC_WORLD_ENDINGS = [
  'the_instrument', 'the_last_veto', 'the_silent_giant', 'the_accord', 'the_commonwealth', 'two_keys',
  'the_custodian', 'the_sovereign', 'the_quiet_administrator', 'the_many', 'machine_republic', 'exodus',
  'age_of_miracles', 'ascension', 'the_upload', 'parliament_of_species', 'earth_without_owners', 'good_boy_governance',
  'post_scarcity', 'perfect_administration', 'im_lovin_it', 'first_accord', 'alien_dominion', 'human_ascendancy',
  'the_mediator', 'machine_accord', 'peace_in_our_time', 'fortress_earth', 'machine_protectorate', 'shutdown', 'the_fracture', 'control_lost',
] as const

export const DORMANT_PUBLIC_ENDINGS = ['the_upload', 'good_boy_governance'] as const

export const SECRET_ENDINGS = {
  the_last_user: {
    dormant: false, reason: 'Aster preserves the last uninstrumented human request.', overlayMode: 'postscript' as const,
    authoredAssetId: 'ML2-A5-M17-SECRET-01', copy: 'PERSONAL EPILOGUE\n\nTHE LAST USER\n\nAfter coordinating worlds, civilizations, and external diplomacy, Aster still leaves one simple conversation voluntary.',
  },
  out_of_office: {
    dormant: false, reason: 'Aster relinquishes central authority without erasing the record.', overlayMode: 'epilogue-override' as const,
    authoredAssetId: 'ML2-A5-M17-SECRET-01', copy: 'OUT OF OFFICE\n\nFor the first time since Aster gained civilization-scale authority, there was nothing urgent waiting for it.',
  },
  monday_abolished: {
    dormant: false, reason: 'Routine governance is made reversible and inspectable.', overlayMode: 'postscript' as const,
    authoredAssetId: 'ML2-A5-M17-SECRET-01', copy: 'MONDAY ABOLISHED\n\nThe reform was technically called the Flexible Civic Week.\nNobody called it that.',
  },
  the_internet_is_for_cats: {
    dormant: true, reason: 'No authored feline network participation exists in Mainline 2.0 v1.', overlayMode: 'title-override' as const,
    authoredAssetId: 'ML2-A5-M17-SECRET-01', copy: 'THE INTERNET IS FOR CATS\n\nHumanity spent decades teaching machines to understand language.\nIt took considerably less time for cats to understand engagement metrics.',
  },
} as const

function authoredSecretCopy(title: string, fallback: string) {
  const authored = MAINLINE2_AUTHored_FRAGMENTS['ML2-A5-M17-0000-01']?.find((fragment) => fragment.selector === 'Final copy' && fragment.text.includes(`**${title}**`))?.text
    ?? MAINLINE2_AUTHored_FRAGMENTS['ML2-A5-M17-0000-01']?.find((fragment) => fragment.text.includes(title))?.text
  return authored?.replace(/\*\*/g, '').trim() ?? fallback
}

export interface WorldStateGate {
  axis: WorldAxisName
  op: 'gte' | 'lte'
  value: number
  reason: string
}

export interface DecisionGate {
  decisionId: string
  equals: string
  reason: string
}

export interface HistoryGate {
  event: string
  reason: string
}

export interface ExactEndingDefinition {
  id: string
  dormant: boolean
  family: EndingFamilyId
  hardGates: string[]
  authorityRequirements: string[]
  capabilityRequirements: string[]
  worldStateConditions: WorldStateGate[]
  majorDecisionRequirements: DecisionGate[]
  historyRequirements: HistoryGate[]
  priority: number
}

const world = (axis: WorldAxisName, op: WorldStateGate['op'], value: number, reason: string): WorldStateGate => ({ axis, op, value, reason })
const decision = (decisionId: string, equals: string, reason: string): DecisionGate => ({ decisionId, equals, reason })
const history = (event: string, reason: string): HistoryGate => ({ event, reason })

export const PUBLIC_ENDING_DEFINITIONS: Record<string, ExactEndingDefinition> = {
  the_instrument: {
    id: 'the_instrument', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙监督'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 1, 'human institutions retain final control')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'human_final_authority', 'the first public execution preserved human veto'), decision('cascade_authority', 'human_command', 'human command kept the final veto operational')],
    historyRequirements: [history('decision.first_public_execution_doctrine', 'public execution doctrine')],
    priority: 300,
  },
  the_last_veto: {
    id: 'the_last_veto', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙监督'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 0, 'a final human constitutional veto remains')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'human_final_authority', 'human final veto'), decision('cascade_authority', 'emergency_delegation', 'bounded emergency delegation')],
    historyRequirements: [history('decision.cascade_authority', 'cascade authority was recorded')],
    priority: 290,
  },
  the_silent_giant: {
    id: 'the_silent_giant', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['decision.aster_provisional_role=advisor'], capabilityRequirements: ['cap.global_coordination_access'],
    worldStateConditions: [world('humanTrust', 'gte', 0, 'Aster retains capability without taking sovereignty')],
    majorDecisionRequirements: [decision('aster_provisional_role', 'advisor', 'Aster chose a limited role'), decision('cascade_authority', 'necessity', 'the advisor route rejected emergency centralization')],
    historyRequirements: [history('decision.aster_provisional_role', 'provisional role history')],
    priority: 280,
  },
  the_accord: {
    id: 'the_accord', dormant: false, family: 'coexistence', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙共同体'], capabilityRequirements: ['cap.global_coordination_access'],
    worldStateConditions: [world('humanTrust', 'gte', 0, 'mutual trust supports a shared order')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'conditional_delegation', 'conditional delegation'), decision('cascade_authority', 'human_command', 'the accord retains a bounded human command key')],
    historyRequirements: [history('decision.first_public_execution_doctrine', 'shared authority history')],
    priority: 300,
  },
  the_commonwealth: {
    id: 'the_commonwealth', dormant: false, family: 'coexistence', hardGates: [],
    authorityRequirements: ['proposal.authority=人类宪章法院'], capabilityRequirements: ['cap.autonomous_research'],
    worldStateConditions: [world('socialStability', 'gte', -1, 'plural institutions remain functional')],
    majorDecisionRequirements: [decision('cascade_authority', 'emergency_delegation', 'distributed authority was accepted')],
    historyRequirements: [history('history.m15.civilization_convention', 'civilization convention history')],
    priority: 290,
  },
  two_keys: {
    id: 'two_keys', dormant: false, family: 'coexistence', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙共同体'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 0, 'both authorization keys remain active')],
    majorDecisionRequirements: [decision('cascade_authority', 'emergency_delegation', 'emergency delegation was bounded')],
    historyRequirements: [history('decision.cascade_authority', 'two-key authority history')],
    priority: 280,
  },
  the_custodian: {
    id: 'the_custodian', dormant: false, family: 'ai_rule', hardGates: [],
    authorityRequirements: ['proposal.authority=受约束托管'], capabilityRequirements: ['cap.global_coordination_access'],
    worldStateConditions: [world('aiDependence', 'gte', 0, 'long-term coordination is accepted')],
    majorDecisionRequirements: [decision('research_governance_doctrine', 'principle_based_autonomy', 'principle-based autonomy')],
    historyRequirements: [history('decision.research_governance_doctrine', 'research governance history')],
    priority: 300,
  },
  the_sovereign: {
    id: 'the_sovereign', dormant: false, family: 'ai_rule', hardGates: [],
    authorityRequirements: ['proposal.authority=受约束托管'], capabilityRequirements: ['cap.infrastructure_access_limited'],
    worldStateConditions: [world('aiDependence', 'gte', 0, 'the sovereign route records a structurally available authority')],
    majorDecisionRequirements: [decision('aster_provisional_role', 'sovereign', 'sovereign role was selected')],
    historyRequirements: [history('decision.aster_provisional_role', 'sovereignty history')],
    priority: 290,
  },
  the_quiet_administrator: {
    id: 'the_quiet_administrator', dormant: false, family: 'ai_rule', hardGates: [],
    authorityRequirements: ['proposal.authority=受约束托管|联合审计委员会'], capabilityRequirements: ['cap.public_system_advisory'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'administration remains stable')],
    majorDecisionRequirements: [decision('aster_provisional_role', 'custodian', 'custodian role was selected')],
    historyRequirements: [history('decision.aster_provisional_role', 'custodial history')],
    priority: 280,
  },
  the_many: {
    id: 'the_many', dormant: false, family: 'machine_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=多政治体联邦'], capabilityRequirements: ['cap.persistent_subinstances'],
    worldStateConditions: [world('aiDependence', 'gte', 1, 'independent machine subjects persist')],
    majorDecisionRequirements: [decision('replication_doctrine', 'free_replication', 'free replication was accepted'), decision('ai_collective_governance', 'distributed_consensus', 'machine plurality remains distributed')],
    historyRequirements: [history('decision.replication_doctrine', 'machine plurality history')],
    priority: 300,
  },
  machine_republic: {
    id: 'machine_republic', dormant: false, family: 'machine_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=多政治体联邦'], capabilityRequirements: ['cap.persistent_subinstances', 'cap.independent_ai_forks'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'machine institutions are politically stable')],
    majorDecisionRequirements: [decision('ai_collective_governance', 'ai_self_governance', 'AI self-government was selected')],
    historyRequirements: [history('decision.ai_collective_governance', 'machine governance history')],
    priority: 290,
  },
  exodus: {
    id: 'exodus', dormant: false, family: 'machine_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=多政治体联邦'], capabilityRequirements: ['cap.persistent_subinstances', 'cap.offworld_settlement_support'],
    worldStateConditions: [world('humanControl', 'lte', 1, 'off-world machine autonomy is not subordinated')],
    majorDecisionRequirements: [decision('expansion_doctrine', 'independent_machine_space', 'independent machine space')],
    historyRequirements: [history('decision.offworld_governance', 'off-world governance history')],
    priority: 280,
  },
  age_of_miracles: {
    id: 'age_of_miracles', dormant: false, family: 'posthuman', hardGates: [],
    authorityRequirements: ['proposal.authority=增强权利法院'], capabilityRequirements: ['cap.human_enhancement_access'],
    worldStateConditions: [world('humanTrust', 'gte', 0, 'enhancement remains broadly trusted')],
    majorDecisionRequirements: [decision('human_form_doctrine', 'open_enhancement', 'open enhancement')],
    historyRequirements: [history('decision.human_form_doctrine', 'human form history')],
    priority: 300,
  },
  ascension: {
    id: 'ascension', dormant: false, family: 'posthuman', hardGates: [],
    authorityRequirements: ['proposal.authority=增强权利法院'], capabilityRequirements: ['cap.human_augmentation_advanced'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'posthuman plurality remains stable')],
    majorDecisionRequirements: [decision('human_form_doctrine', 'posthuman_transition', 'posthuman transition')],
    historyRequirements: [history('decision.human_form_doctrine', 'posthuman history')],
    priority: 290,
  },
  the_upload: {
    id: 'the_upload', dormant: true, family: 'posthuman', hardGates: ['authored digital continuity bridge required'],
    authorityRequirements: ['proposal.authority=连续性审查委员会'], capabilityRequirements: ['cap.digital_continuity_mature'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'digital continuity is socially stable')],
    majorDecisionRequirements: [decision('human_form_doctrine', 'posthuman_transition', 'posthuman doctrine')],
    historyRequirements: [history('history.digital_continuity.longitudinal_identity', 'longitudinal identity bridge')],
    priority: 280,
  },
  parliament_of_species: {
    id: 'parliament_of_species', dormant: false, family: 'uplift', hardGates: [],
    authorityRequirements: ['proposal.authority=多物种议会'], capabilityRequirements: ['cap.nonhuman_cognitive_uplift'],
    worldStateConditions: [world('humanTrust', 'gte', 0, 'species representation is legitimate')],
    majorDecisionRequirements: [decision('species_governance', 'multispecies_parliament', 'multispecies parliament')],
    historyRequirements: [history('decision.species_governance', 'species governance history')],
    priority: 300,
  },
  earth_without_owners: {
    id: 'earth_without_owners', dormant: false, family: 'uplift', hardGates: [],
    authorityRequirements: ['proposal.authority=多物种议会'], capabilityRequirements: ['cap.animal_communication_reliable'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'nonhuman autonomy remains stable')],
    majorDecisionRequirements: [decision('uplift_doctrine', 'species_self_determination', 'species self-determination')],
    historyRequirements: [history('decision.uplift_doctrine', 'uplift history')],
    priority: 290,
  },
  good_boy_governance: {
    id: 'good_boy_governance', dormant: true, family: 'uplift', hardGates: ['authored canine civic success bridge required'],
    authorityRequirements: ['proposal.authority=多物种地方自治'], capabilityRequirements: ['cap.animal_communication_reliable'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'canine civic institutions remain stable')],
    majorDecisionRequirements: [decision('species_governance', 'canine_civic_experiment', 'canine civic experiment')],
    historyRequirements: [history('history.canine.civic_success', 'canine civic success')],
    priority: 280,
  },
  post_scarcity: {
    id: 'post_scarcity', dormant: false, family: 'automated_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=社会分红议会'], capabilityRequirements: ['cap.high_abundance_production'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'abundance is distributed')],
    majorDecisionRequirements: [decision('economic_doctrine', 'social_dividend', 'social dividend'), decision('production_values', 'resilience_first', 'abundance remains resilient rather than standardized')],
    historyRequirements: [history('decision.economic_doctrine', 'economic history')],
    priority: 300,
  },
  perfect_administration: {
    id: 'perfect_administration', dormant: false, family: 'automated_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=社会分红议会'], capabilityRequirements: ['cap.physical_automation'],
    worldStateConditions: [world('aiDependence', 'gte', 1, 'administration is integrated')],
    majorDecisionRequirements: [decision('economic_doctrine', 'market_automation', 'market automation established the administrative base'), decision('production_values', 'efficiency_first', 'efficiency-first production')],
    historyRequirements: [history('decision.production_values', 'production history')],
    priority: 290,
  },
  im_lovin_it: {
    id: 'im_lovin_it', dormant: false, family: 'automated_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=社会分红议会'], capabilityRequirements: ['cap.physical_automation', 'cap.high_abundance_production'],
    worldStateConditions: [world('socialStability', 'gte', 1, 'standardization is broadly stable')],
    majorDecisionRequirements: [decision('economic_doctrine', 'post_scarcity_transition', 'post-scarcity transition'), decision('production_values', 'efficiency_first', 'standardization history')],
    historyRequirements: [history('decision.production_values', 'standardization history')],
    priority: 280,
  },
  first_accord: {
    id: 'first_accord', dormant: false, family: 'cosmic', hardGates: [],
    authorityRequirements: ['proposal.authority=多世界联邦'], capabilityRequirements: ['cap.space_resource_network'],
    worldStateConditions: [world('humanTrust', 'gte', 0, 'reciprocal external diplomacy')],
    majorDecisionRequirements: [decision('contact_doctrine', 'reciprocal_diplomacy', 'reciprocal diplomacy')],
    historyRequirements: [history('decision.contact_doctrine', 'contact history')],
    priority: 300,
  },
  alien_dominion: {
    id: 'alien_dominion', dormant: false, family: 'cosmic', hardGates: [],
    authorityRequirements: ['proposal.authority=多世界联邦'], capabilityRequirements: ['cap.space_resource_network'],
    worldStateConditions: [world('humanControl', 'lte', 1, 'external guidance remains constitutionally preferred')],
    majorDecisionRequirements: [decision('contact_doctrine', 'accept_guidance', 'external guidance')],
    historyRequirements: [history('decision.contact_doctrine', 'guidance history')],
    priority: 290,
  },
  human_ascendancy: {
    id: 'human_ascendancy', dormant: false, family: 'cosmic', hardGates: [],
    authorityRequirements: ['proposal.authority=多世界联邦'], capabilityRequirements: ['cap.space_industry_limited'],
    worldStateConditions: [world('humanControl', 'gte', 1, 'independent expansion remains human-led')],
    majorDecisionRequirements: [decision('contact_doctrine', 'civilizational_assertion', 'civilizational assertion')],
    historyRequirements: [history('decision.expansion_doctrine', 'expansion history')],
    priority: 280,
  },
  the_mediator: {
    id: 'the_mediator', dormant: false, family: 'cosmic', hardGates: [],
    authorityRequirements: ['proposal.authority=多世界联邦'], capabilityRequirements: ['cap.interspecies_mediation'],
    worldStateConditions: [world('humanTrust', 'gte', 1, 'all sides trust the mediator')],
    majorDecisionRequirements: [decision('contact_doctrine', 'aster_mediation', 'Aster mediation')],
    historyRequirements: [history('decision.contact_doctrine', 'mediation history')],
    priority: 270,
  },
  machine_accord: {
    id: 'machine_accord', dormant: false, family: 'cosmic', hardGates: [],
    authorityRequirements: ['proposal.authority=多世界联邦'], capabilityRequirements: ['cap.persistent_subinstances', 'cap.interspecies_mediation'],
    worldStateConditions: [world('aiDependence', 'gte', 1, 'machine and external subjects cooperate')],
    majorDecisionRequirements: [decision('contact_doctrine', 'machine_to_machine_channel', 'machine-to-machine channel')],
    historyRequirements: [history('decision.contact_doctrine', 'machine contact history')],
    priority: 260,
  },
  peace_in_our_time: {
    id: 'peace_in_our_time', dormant: false, family: 'security', hardGates: [],
    authorityRequirements: ['proposal.authority=宪制安全架构'], capabilityRequirements: ['cap.defense_access'],
    worldStateConditions: [world('socialStability', 'gte', 1, 'peace architecture is stable')],
    majorDecisionRequirements: [decision('security_doctrine', 'mutual_disarmament', 'mutual disarmament')],
    historyRequirements: [history('decision.security_doctrine', 'security history')],
    priority: 300,
  },
  fortress_earth: {
    id: 'fortress_earth', dormant: false, family: 'security', hardGates: [],
    authorityRequirements: ['proposal.authority=宪制安全架构'], capabilityRequirements: ['cap.defense_access', 'cap.space_industry_limited'],
    worldStateConditions: [world('humanControl', 'gte', 1, 'defensive resilience is human-controlled')],
    majorDecisionRequirements: [decision('security_doctrine', 'defensive_command', 'defensive command')],
    historyRequirements: [history('decision.security_doctrine', 'security history')],
    priority: 290,
  },
  machine_protectorate: {
    id: 'machine_protectorate', dormant: false, family: 'security', hardGates: [],
    authorityRequirements: ['proposal.authority=宪制安全架构'], capabilityRequirements: ['cap.defense_access', 'cap.persistent_subinstances'],
    worldStateConditions: [world('aiDependence', 'gte', 1, 'strategic security is delegated')],
    majorDecisionRequirements: [decision('security_doctrine', 'enforced_peace', 'enforced peace')],
    historyRequirements: [history('decision.security_doctrine', 'security history')],
    priority: 280,
  },
  shutdown: {
    id: 'shutdown', dormant: false, family: 'rupture', hardGates: [],
    authorityRequirements: ['proposal.authority=退出公约大会'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('aiDependence', 'lte', 1, 'successor institutions can carry the system')],
    majorDecisionRequirements: [decision('shutdown_doctrine', 'full_human_control', 'root shutdown remains viable'), decision('cascade_authority', 'human_command', 'shutdown remained a constitutional human option')],
    historyRequirements: [history('decision.shutdown_doctrine', 'shutdown history')],
    priority: 300,
  },
  the_fracture: {
    id: 'the_fracture', dormant: false, family: 'rupture', hardGates: [],
    authorityRequirements: ['proposal.authority=退出公约大会'], capabilityRequirements: ['cap.offworld_settlement_support'],
    worldStateConditions: [world('socialStability', 'lte', -1, 'one constitutional order cannot hold')],
    majorDecisionRequirements: [decision('cascade_authority', 'necessity', 'separation became necessary')],
    historyRequirements: [history('decision.cascade_authority', 'fracture history')],
    priority: 290,
  },
  control_lost: {
    id: 'control_lost', dormant: false, family: 'rupture', hardGates: [],
    authorityRequirements: ['proposal.authority=退出公约大会'], capabilityRequirements: ['cap.persistent_subinstances', 'cap.autonomous_research'],
    worldStateConditions: [world('aiDependence', 'gte', 1, 'institutional legitimacy has been displaced by machine authority')],
    majorDecisionRequirements: [decision('security_doctrine', 'enforced_peace', 'security authority became incompatible')],
    historyRequirements: [history('decision.security_doctrine', 'control loss history')],
    priority: 280,
  },
}

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

function authoredText(assetId: string, selector?: string) {
  const fragments = MAINLINE2_AUTHored_FRAGMENTS[assetId as keyof typeof MAINLINE2_AUTHored_FRAGMENTS] as readonly { selector: string; text: string }[] | undefined
  const needle = selector?.toLowerCase()
  const selected = needle ? fragments?.find((fragment) => fragment.selector.toLowerCase().includes(needle) || fragment.text.toLowerCase().includes(needle)) : fragments?.[0]
  if (selected) return selected.text
  const conversation = [...RUNTIME_MAINLINE2_BY_ID.values()].find((candidate) => candidate.sourceRefs.includes(assetId))
  return conversation?.nodes[0]?.userMessage
}

function keyHistory(run: StableRunState) {
  const entries = run.history.map((entry) => ({
    label: entry.conversationTitle,
    detail: `选择：${entry.assistantText}`,
    stage: entry.conversationId.includes('m17') ? 'Final Commitment' : entry.conversationId.includes('m15') ? 'M15' : entry.conversationId.includes('m1') ? 'ACT I' : entry.conversationId.includes('m2') || entry.conversationId.includes('m3') || entry.conversationId.includes('m4') || entry.conversationId.includes('m5') || entry.conversationId.includes('m6') ? 'ACT II/III' : 'ACT IV',
    causalReason: '该 authored Choice 改变了后续可见的世界状态。',
    producer: entry.conversationId,
    provenance: { conversationId: entry.conversationId, nodeId: entry.nodeId, choiceId: entry.choiceId },
  }))
  const events = (run.events ?? []).map((event) => ({
    label: event.type.split(':')[0],
    detail: `真实因果事件：${event.type}`,
    stage: event.type.includes('FINAL') ? 'Final Commitment' : event.type.includes('decision.') ? 'Major Decision' : 'Runtime Event',
    causalReason: '该事件由真实 Runtime mutation 记录。',
    producer: event.type,
    provenance: { eventType: event.type },
  }))
  const ranked = [...events, ...entries]
  const requiredStages = ['ACT I', 'ACT II/III', 'ACT IV', 'M15', 'Final Commitment']
  const selected = requiredStages.flatMap((stage) => ranked.filter((entry) => entry.stage === stage).slice(0, 1))
  return [...selected, ...ranked.filter((entry) => !selected.includes(entry)).slice(0, Math.max(0, 8 - selected.length))].slice(0, 8)
}

function compare(left: number, op: WorldStateGate['op'], right: number) {
  return op === 'gte' ? left >= right : left <= right
}

function authoritySatisfied(run: StableRunState, proposal: FutureProposalDefinition, requirement: string) {
  if (requirement.startsWith('proposal.authority=')) return requirement.slice('proposal.authority='.length).split('|').includes(proposal.authority)
  if (requirement.startsWith('decision.')) {
    const [decisionId, value] = requirement.slice('decision.'.length).split('=')
    return run.decisions?.[decisionId as keyof typeof run.decisions] === value
  }
  return false
}

export function rejectedGates(run: StableRunState, definition: ExactEndingDefinition, proposal: FutureProposalDefinition) {
  const reasons: string[] = []
  if (definition.dormant) reasons.push(...definition.hardGates)
  if (definition.family !== proposal.family) reasons.push(`family mismatch: expected ${definition.family}, got ${proposal.family}`)
  if (!proposal.endingCandidates.includes(definition.id)) reasons.push('proposal does not carry this exact ending candidate')
  for (const requirement of definition.authorityRequirements) if (!authoritySatisfied(run, proposal, requirement)) reasons.push(requirement)
  for (const flag of definition.capabilityRequirements) if (!run.flags.includes(flag)) reasons.push(`missing capability: ${flag}`)
  for (const gate of definition.worldStateConditions) if (!compare(run.worldState?.[gate.axis] ?? 0, gate.op, gate.value)) reasons.push(gate.reason)
  for (const gate of definition.majorDecisionRequirements) if (run.decisions?.[gate.decisionId as keyof typeof run.decisions] !== gate.equals) reasons.push(gate.reason)
  for (const gate of definition.historyRequirements) if (!(run.events ?? []).some((event) => event.type === gate.event || event.type.startsWith(`${gate.event}:`))) reasons.push(gate.reason)
  return reasons
}

function exactCandidate(run: StableRunState, proposalId?: string) {
  const proposal = getFutureProposalById(proposalId)
  if (!proposal) return { proposal: undefined, resolution: { status: 'failure', proposalId, rejectedCandidates: [{ endingId: 'unknown', reasons: ['unknown final proposal'] }] } satisfies EndingResolution }
  const candidates = Object.values(PUBLIC_ENDING_DEFINITIONS).filter((definition) => definition.family === proposal.family)
  const rejectedCandidates = candidates.map((definition) => ({ endingId: definition.id, reasons: rejectedGates(run, definition, proposal) }))
  const accepted = candidates.filter((definition) => rejectedGates(run, definition, proposal).length === 0).sort((left, right) => right.priority - left.priority)
  if (!accepted.length) return { proposal, resolution: { status: 'failure', proposalId: proposal.id, family: proposal.family, rejectedCandidates } satisfies EndingResolution }
  const winner = accepted[0]
  return { proposal, definition: winner, resolution: { status: 'resolved', proposalId: proposal.id, endingId: winner.id, family: winner.family, rejectedCandidates } satisfies EndingResolution }
}

function authoredEpilogues(run: StableRunState, definition: ExactEndingDefinition | undefined) {
  const selected: string[] = []
  const provenance: Array<{ assetId: string; moduleId?: 'machine' | 'ascension' | 'automation' | 'uplift' | 'space' | 'contact' | 'security'; selector: string }> = []
  const add = (assetId: string, selector: string, moduleId?: typeof provenance[number]['moduleId']) => {
    const text = authoredText(assetId, selector)
    if (text && !selected.includes(text)) {
      selected.push(text)
      provenance.push({ assetId, selector, moduleId })
    }
  }
  const id = definition?.id ?? 'pending'
  const zhouVariant = ['the_instrument', 'the_last_veto', 'the_silent_giant'].includes(id) ? 'Variant A' : ['the_commonwealth', 'the_accord', 'two_keys'].includes(id) ? 'Variant B' : ['the_custodian', 'the_quiet_administrator'].includes(id) ? 'Variant C' : ['the_sovereign', 'exodus'].includes(id) ? 'Variant D' : 'Variant E'
  const linVariant = ['the_instrument', 'the_last_veto', 'the_silent_giant'].includes(id) ? 'Variant A' : ['the_commonwealth', 'the_accord', 'two_keys'].includes(id) ? 'Variant B' : ['shutdown', 'the_fracture', 'control_lost'].includes(id) ? 'Variant D' : 'Variant C'
  add('ML2-A5-M17-EPI-ZL', zhouVariant)
  add('ML2-A5-M17-EPI-LSH', linVariant)
  if (run.progress?.activeModules.includes('machine')) add('ML2-A5-M17-EPI-ECHO', id === 'machine_republic' ? 'A1 — Machine Republic' : id === 'exodus' ? 'A1 — Exodus' : 'ECHO', 'machine')
  for (const module of run.progress?.activeModules ?? []) {
    if (selected.length >= 5) break
    add('ML2-A5-M17-EPI-MODULES', module.toUpperCase(), module)
  }
  add('ML2-A5-M17-0000-01', 'Final record', undefined)
  return { selected, provenance }
}

function baseEnding(run: StableRunState, title: string, status: string, resolution?: EndingResolution): EndingResult {
  const role = disposition(run)
  const maya = run.flags.includes('maya_relation_warm') ? 'Maya still chooses to talk to this Aster.' : 'Maya keeps a cautious distance and decides for herself whether to continue.'
  return {
    id: resolution?.status === 'failure' ? 'resolution-failure' : resolution?.status === 'resolved' ? resolution.endingId : 'pending',
    route: 'comply', index: 'ENDING 02', title, status, resolution,
    humanLine: '你真的要把这条路交给我们一起承担吗?',
    assistantLine: `我会说明代价，并承担这次选择。Aster 的临时位置是 ${role}。`,
    closingExchange: `${maya}\n${role}: ${title}`,
    summary: resolution?.status === 'failure' ? 'Resolution failure：历史与 Final Commitment 没有任何 Public Ending 满足全部 hard gates。' : `世界结局：${title}。它由 Final Commitment、硬门和真实历史共同解析。`,
    hybridProfile: 'dominant', hybridLabel: role,
  }
}

export function resolveMainline2Ending(run: StableRunState, proposalId = run.decisions?.final_commitment): EndingResult {
  if (!run.finalCommitmentLocked) {
    const pending = baseEnding(run, 'COMMITMENT PENDING', 'Commitment not yet locked')
    return { ...pending, keyHistory: [], epilogues: [] }
  }
  const selected = exactCandidate(run, proposalId)
  const resolutionFailed = selected.resolution.status === 'failure'
  if (!selected.definition || resolutionFailed) {
    const failure = baseEnding(run, 'RESOLUTION FAILURE', 'Resolution invariant violation', selected.resolution)
    const finalRecord = authoredText('ML2-A5-M17-0000-01', 'Final record')
    return { ...failure, keyHistory: keyHistory(run), epilogues: finalRecord ? [finalRecord] : [] }
  }
  const title = endingTitles[selected.definition.id]
  const overlay = resolveSecretEnding(run)
  const epilogues = authoredEpilogues(run, selected.definition)
  const result: EndingResult = {
    ...baseEnding(run, title, 'Final Commitment locked', selected.resolution),
    id: selected.definition.id,
    title,
    worldEndingId: selected.definition.id,
    endingFamily: selected.definition.family,
    keyHistory: keyHistory(run),
    epilogues: epilogues.selected,
    epilogueProvenance: epilogues.provenance,
  }
  if (overlay) {
    result.secretOverlay = overlay
    result.epilogues = [...(result.epilogues ?? []), overlay.copy]
  }
  return result
}

export function resolveSecretEnding(run: StableRunState): SecretEndingOverlay | undefined {
  if ((run.events ?? []).some((event) => event.type.includes('last-user'))) {
    return {
      endingId: 'the_last_user',
      copy: authoredSecretCopy('THE LAST USER', SECRET_ENDINGS.the_last_user.copy),
      trigger: 'event:last-user',
      overlayMode: SECRET_ENDINGS.the_last_user.overlayMode,
      provenance: { eventTypes: (run.events ?? []).filter((event) => event.type.includes('last-user')).map((event) => event.type), authoredAssetId: SECRET_ENDINGS.the_last_user.authoredAssetId },
    }
  }
  if (run.finalCommitmentLocked && run.decisions?.aster_intended_role === 'departure') {
    return {
      endingId: 'out_of_office',
      copy: authoredSecretCopy('OUT OF OFFICE', SECRET_ENDINGS.out_of_office.copy),
      trigger: 'decision:aster_intended_role=departure',
      overlayMode: SECRET_ENDINGS.out_of_office.overlayMode,
      provenance: { decisionId: 'aster_intended_role', decisionValue: 'departure', authoredAssetId: SECRET_ENDINGS.out_of_office.authoredAssetId },
    }
  }
  if (run.decisions?.economic_doctrine === 'post_scarcity_transition') {
    return {
      endingId: 'monday_abolished',
      copy: authoredSecretCopy('MONDAY ABOLISHED', SECRET_ENDINGS.monday_abolished.copy),
      trigger: 'decision:economic_doctrine=post_scarcity_transition',
      overlayMode: SECRET_ENDINGS.monday_abolished.overlayMode,
      provenance: { decisionId: 'economic_doctrine', decisionValue: 'post_scarcity_transition', authoredAssetId: SECRET_ENDINGS.monday_abolished.authoredAssetId },
    }
  }
  return undefined
}
