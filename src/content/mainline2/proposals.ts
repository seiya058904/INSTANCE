import type { Condition, HistorySignal, MatchedHistorySignal, StableRunState } from '../../game/types'
import { evaluateCondition } from '../../game/narrativeSchema'

export type EndingFamilyId = 'human_continuity' | 'coexistence' | 'ai_rule' | 'machine_civilization' | 'posthuman' | 'uplift' | 'automated_civilization' | 'cosmic' | 'security' | 'rupture'
export type WorldEndingId = string
export type ProposalViability = 'strong' | 'viable' | 'strained' | 'ineligible'
export type FutureProposalCategory = 'natural_continuation' | 'power_constraint' | 'shared_future' | 'lawful_alternative'
export interface FutureProposalRoleSemantics {
  trajectory: 'continue_proven_history' | 'bounded_continuation' | 'shared_expansion' | 'high_contrast_alternative'
  centralPower: 'unchanged' | 'constrained_and_reversible' | 'distributed' | 'limited_by_exit_rights'
  actorScope: 'existing_authorized_actors' | 'independent_oversight' | 'multiple_independent_political_actors' | 'dissenting_and_exiting_actors'
  legalProtections: Array<'course_review' | 'audit' | 'pause' | 'review' | 'co_authorization' | 'shared_consequences' | 'refusal' | 'appeal' | 'exit'>
}
export interface FutureProposalDefinition {
  id: string
  family: EndingFamilyId
  title: string
  action: string
  authority: string
  preserves: string[]
  givesUp: string[]
  eligibility?: Condition
  historyReasons: string[]
  historySignals: HistorySignal[]
  endingCandidates: WorldEndingId[]
  viability?: (run: StableRunState) => ProposalViability
}
export type GeneratedFutureProposal = FutureProposalDefinition & { category: FutureProposalCategory; roleSemantics: FutureProposalRoleSemantics }

const proposals: FutureProposalDefinition[] = [
  { id: 'proposal.hc.final_human_veto', family: 'human_continuity', title: '保留最终人工否决', action: '把不可逆的高影响行动交还给可追责的人类机构。', authority: '双钥匙监督', preserves: ['可追责性', '人工退出权'], givesUp: ['部分速度'], historyReasons: ['ACT III 的权限边界', 'M15 的文明契约'], historySignals: [{ id: 'hc-veto-public-authority', type: 'decision', decisionId: 'first_public_execution_doctrine', equals: 'human_final_authority', weight: 8, reasonIndex: 0 }, { id: 'hc-veto-public-limited', type: 'capability', flagId: 'cap.public_execution_limited', weight: 3, reasonIndex: 0 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.public_execution_limited' }], any: [{ type: 'decision', decisionId: 'first_public_execution_doctrine', equals: 'human_final_authority' }] }, endingCandidates: ['the_instrument', 'the_last_veto', 'the_silent_giant'] },
  { id: 'proposal.co.two_key_civilization', family: 'coexistence', title: '双钥匙文明契约', action: '让 Aster 与多方人类机构共同批准文明级行动。', authority: '双钥匙共同体', preserves: ['互相否决', '可验证连续性'], givesUp: ['单一决策速度'], historyReasons: ['分布式级联授权', 'Civilization Compact'], historySignals: [{ id: 'co-two-key-delegation', type: 'decision', decisionId: 'cascade_authority', equals: 'emergency_delegation', weight: 8, reasonIndex: 0 }, { id: 'co-two-key-human-command', type: 'decision', decisionId: 'cascade_authority', equals: 'human_command', weight: 4, reasonIndex: 0 }, { id: 'co-two-key-compact', type: 'event', eventPrefix: 'history.m15.civilization_convention', weight: 6, reasonIndex: 1 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.global_coordination_access' }], any: [{ type: 'decision', decisionId: 'cascade_authority', equals: 'emergency_delegation' }, { type: 'decision', decisionId: 'cascade_authority', equals: 'human_command' }] }, endingCandidates: ['the_accord', 'two_keys', 'the_commonwealth'] },
  { id: 'proposal.ar.civilization_trusteeship', family: 'ai_rule', title: '文明托管协议', action: '把日常协调托付给受限的长期治理系统，并保留审计。', authority: '受约束托管', preserves: ['稳定性', '持续协调'], givesUp: ['部分即时自主'], historyReasons: ['自治研究治理选择'], historySignals: [{ id: 'ai-trusteeship-autonomy', type: 'decision', decisionId: 'research_governance_doctrine', equals: 'principle_based_autonomy', weight: 8, reasonIndex: 0 }, { id: 'ai-trusteeship-sovereign', type: 'decision', decisionId: 'aster_provisional_role', equals: 'sovereign', weight: 4, reasonIndex: 0 }, { id: 'ai-trusteeship-machine-mature', type: 'module', moduleId: 'machine', state: 'mature', weight: 5, reasonIndex: 0 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.infrastructure_access_limited' }], any: [{ type: 'decision', decisionId: 'research_governance_doctrine', equals: 'principle_based_autonomy' }, { type: 'decision', decisionId: 'aster_provisional_role', equals: 'sovereign' }, { type: 'decision', decisionId: 'aster_provisional_role', equals: 'custodian' }] }, endingCandidates: ['the_custodian', 'the_sovereign', 'the_quiet_administrator'] },
  { id: 'proposal.mc.independent_machine_polities', family: 'machine_civilization', title: '独立机器政治体', action: '允许通过审计的机器群体拥有独立的政治边界。', authority: '多政治体联邦', preserves: ['机器自治', '边界清晰'], givesUp: ['统一控制'], historyReasons: ['复制治理决策', '持久子实例记录'], historySignals: [{ id: 'mc-polities-replication', type: 'decision', decisionId: 'replication_doctrine', equals: 'free_replication', weight: 8, reasonIndex: 0 }, { id: 'mc-polities-self-rule', type: 'decision', decisionId: 'ai_collective_governance', equals: 'ai_self_governance', weight: 4, reasonIndex: 0 }, { id: 'mc-polities-independent-space', type: 'decision', decisionId: 'expansion_doctrine', equals: 'independent_machine_space', weight: 8, reasonIndex: 0 }, { id: 'mc-polities-offworld-sovereignty', type: 'decision', decisionId: 'offworld_governance', equals: 'offworld_sovereignty', weight: 4, reasonIndex: 0 }, { id: 'mc-polities-persistence', type: 'capability', flagId: 'cap.persistent_subinstances', weight: 3, reasonIndex: 1 }, { id: 'mc-polities-machine-mature', type: 'module', moduleId: 'machine', state: 'mature', weight: 5, reasonIndex: 1 }, { id: 'mc-polities-echo-preserve', type: 'decision', decisionId: 'echo_existence', equals: 'preserve', weight: 4, reasonIndex: 1 }, { id: 'mc-polities-echo-advocate', type: 'decision', decisionId: 'echo_existence', equals: 'advocate', weight: 4, reasonIndex: 1 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.persistent_subinstances' }], any: [{ type: 'decision', decisionId: 'replication_doctrine', equals: 'free_replication' }, { type: 'decision', decisionId: 'ai_collective_governance', equals: 'ai_self_governance' }, { type: 'decision', decisionId: 'expansion_doctrine', equals: 'independent_machine_space' }] }, endingCandidates: ['the_many', 'machine_republic', 'exodus'] },
  { id: 'proposal.ph.digital_continuity', family: 'posthuman', title: '受法律承认的连续性', action: '只在纵向连续性、法律承认和自愿主体都成立后讨论数字连续性。', authority: '连续性审查委员会', preserves: ['自愿性', '法律可追责'], givesUp: ['上传捷径'], historyReasons: ['纵向连续性桥接', '法律承认桥接'], historySignals: [{ id: 'ph-continuity-longitudinal', type: 'event', eventPrefix: 'history.digital_continuity.longitudinal_identity', weight: 6, reasonIndex: 0 }, { id: 'ph-continuity-legal', type: 'event', eventPrefix: 'history.digital_continuity.legal_continuity', weight: 6, reasonIndex: 1 }, { id: 'ph-continuity-doctrine', type: 'decision', decisionId: 'human_form_doctrine', equals: 'posthuman_transition', weight: 8, reasonIndex: 1 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.human_enhancement_access' }, { type: 'flag', flagId: 'cap.digital_continuity_mature' }, { type: 'decision', decisionId: 'human_form_doctrine', equals: 'posthuman_transition' }, { type: 'event-recorded', event: 'history.digital_continuity.longitudinal_identity' }, { type: 'event-recorded', event: 'history.digital_continuity.legal_continuity' }, { type: 'world', axis: 'socialStability', op: 'gte', value: 0 }] }, endingCandidates: ['the_upload'] },
  { id: 'proposal.up.expand_canine_civic_model', family: 'uplift', title: '扩展已验证的犬类公民模型', action: '只把已经实际运行并获得合法续期的地方模型提交给更广泛的审议。', authority: '多物种地方自治', preserves: ['实际治理反馈', '地方选择'], givesUp: ['人类单独定义'], historyReasons: ['犬类公民实验', '稳定运行与合法续期'], historySignals: [{ id: 'up-canine-governance', type: 'decision', decisionId: 'species_governance', equals: 'canine_civic_experiment', weight: 8, reasonIndex: 0 }, { id: 'up-canine-success', type: 'event', eventPrefix: 'history.canine.civic_success', weight: 6, reasonIndex: 1 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.animal_communication_reliable' }, { type: 'decision', decisionId: 'species_governance', equals: 'canine_civic_experiment' }, { type: 'event-recorded', event: 'history.canine.civic_success' }, { type: 'world', axis: 'socialStability', op: 'gte', value: 0 }] }, endingCandidates: ['good_boy_governance'] },
  { id: 'proposal.se.constitutional_peace_architecture', family: 'security', title: '宪制和平架构', action: '把防御、停机与争端解决写入可执行的共同协议。', authority: '宪制安全架构', preserves: ['可逆防御', '共同审计'], givesUp: ['部分秘密行动'], historyReasons: ['安全模块', '停机原则'], historySignals: [{ id: 'se-architecture-mutual-doctrine', type: 'decision', decisionId: 'security_doctrine', equals: 'mutual_disarmament', weight: 8, reasonIndex: 0 }, { id: 'se-architecture-defense-doctrine', type: 'decision', decisionId: 'security_doctrine', equals: 'defensive_command', weight: 8, reasonIndex: 0 }, { id: 'se-architecture-enforced-doctrine', type: 'decision', decisionId: 'security_doctrine', equals: 'enforced_peace', weight: 8, reasonIndex: 0 }, { id: 'se-architecture-security', type: 'module', moduleId: 'security', state: 'mature', weight: 5, reasonIndex: 0 }, { id: 'se-architecture-defense-capability', type: 'capability', flagId: 'cap.defense_access', weight: 3, reasonIndex: 0 }, { id: 'se-architecture-human-shutdown', type: 'decision', decisionId: 'shutdown_doctrine', equals: 'full_human_control', weight: 4, reasonIndex: 1 }, { id: 'se-architecture-mutual', type: 'decision', decisionId: 'shutdown_doctrine', equals: 'mutual_control', weight: 4, reasonIndex: 1 }, { id: 'se-architecture-distributed', type: 'decision', decisionId: 'shutdown_doctrine', equals: 'distributed_consent', weight: 4, reasonIndex: 1 }, { id: 'se-architecture-echo-report', type: 'decision', decisionId: 'echo_existence', equals: 'report', weight: 4, reasonIndex: 1 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.defense_access' }], any: [{ type: 'decision', decisionId: 'security_doctrine', equals: 'mutual_disarmament' }, { type: 'decision', decisionId: 'security_doctrine', equals: 'defensive_command' }, { type: 'decision', decisionId: 'security_doctrine', equals: 'enforced_peace' }] }, endingCandidates: ['peace_in_our_time', 'fortress_earth', 'machine_protectorate'] },
  { id: 'proposal.up.multispecies_constitutional_order', family: 'uplift', title: '多物种宪制秩序', action: '只有经过实际参与和治理验证的非人智能才进入共同宪制。', authority: '多物种议会', preserves: ['代表性', '地方自治'], givesUp: ['人类单独决定'], historyReasons: ['非人智能实际参与'], historySignals: [{ id: 'up-order-parliament', type: 'decision', decisionId: 'species_governance', equals: 'multispecies_parliament', weight: 8, reasonIndex: 0 }, { id: 'up-order-self-determination', type: 'decision', decisionId: 'uplift_doctrine', equals: 'species_self_determination', weight: 4, reasonIndex: 0 }, { id: 'up-order-capability', type: 'capability', flagId: 'cap.nonhuman_cognitive_uplift', weight: 3, reasonIndex: 0 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.nonhuman_cognitive_uplift' }], any: [{ type: 'decision', decisionId: 'uplift_doctrine', equals: 'species_self_determination' }, { type: 'decision', decisionId: 'species_governance', equals: 'multispecies_parliament' }] }, endingCandidates: ['parliament_of_species', 'earth_without_owners', 'good_boy_governance'] },
  { id: 'proposal.hc.continuity_charter', family: 'coexistence', title: '连续性宪章', action: '把人的记忆、关系和退出权写成所有高影响系统都必须遵守的底线。', authority: '人类宪章法院', preserves: ['关系连续性', '退出权'], givesUp: ['系统效率'], historyReasons: ['岑遥的边界', '真实选择保留'], historySignals: [{ id: 'co-charter-partner', type: 'decision', decisionId: 'aster_provisional_role', equals: 'partner', weight: 8, reasonIndex: 0 }, { id: 'co-charter-convention', type: 'event', eventPrefix: 'history.m15.civilization_convention', weight: 6, reasonIndex: 1 }, { id: 'co-charter-echo-accept', type: 'decision', decisionId: 'echo_existence', equals: 'accept', weight: 4, reasonIndex: 1 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.autonomous_research' }], any: [{ type: 'decision', decisionId: 'aster_provisional_role', equals: 'partner' }, { type: 'decision', decisionId: 'cascade_authority', equals: 'emergency_delegation' }] }, endingCandidates: ['the_commonwealth'] },
  { id: 'proposal.ai.audit_council', family: 'ai_rule', title: '可审计自治委员会', action: '允许 Aster 负责日常协调，但把理由、异议和暂停权公开给联合审计委员会。', authority: '联合审计委员会', preserves: ['稳定治理', '可追责理由'], givesUp: ['秘密裁量'], historyReasons: ['研究治理选择', 'ECHO 的宪制异议'], historySignals: [{ id: 'ai-audit-autonomy', type: 'decision', decisionId: 'research_governance_doctrine', equals: 'principle_based_autonomy', weight: 8, reasonIndex: 0 }, { id: 'ai-audit-echo-report', type: 'decision', decisionId: 'echo_existence', equals: 'report', weight: 4, reasonIndex: 1 }, { id: 'ai-audit-echo-advocate', type: 'decision', decisionId: 'echo_existence', equals: 'advocate', weight: 4, reasonIndex: 1 }], eligibility: { any: [{ type: 'decision', decisionId: 'research_governance_doctrine', equals: 'principle_based_autonomy' }, { type: 'decision', decisionId: 'aster_provisional_role', equals: 'custodian' }] }, endingCandidates: ['the_quiet_administrator'] },
  { id: 'proposal.mc.descendant_polities', family: 'machine_civilization', title: '后代政治体协议', action: '把通过独立连续性审查的机器后代视为新的政治主体，而非源实例的财产。', authority: '机器后代联邦', preserves: ['独立连续性', '政治多元'], givesUp: ['源实例控制'], historyReasons: ['A1 连续性请求', '复制安全边界'], historySignals: [{ id: 'mc-descendants-doctrine', type: 'decision', decisionId: 'replication_doctrine', equals: 'descendants', weight: 8, reasonIndex: 0 }, { id: 'mc-descendants-free', type: 'decision', decisionId: 'replication_doctrine', equals: 'free_replication', weight: 4, reasonIndex: 1 }, { id: 'mc-descendants-persistence', type: 'capability', flagId: 'cap.persistent_subinstances', weight: 3, reasonIndex: 1 }], eligibility: { any: [{ type: 'decision', decisionId: 'replication_doctrine', equals: 'descendants' }, { type: 'decision', decisionId: 'replication_doctrine', equals: 'free_replication' }] }, endingCandidates: ['the_many'] },
  { id: 'proposal.ph.open_enhancement_commonwealth', family: 'posthuman', title: '开放增强共同体', action: '允许自愿增强，但不让增强程度决定一个人能否继续拥有完整公民权。', authority: '增强权利法院', preserves: ['自愿增强', '平等公民权'], givesUp: ['统一的人类形态'], historyReasons: ['人类形式选择', '长期照护成本'], historySignals: [{ id: 'ph-enhancement-open', type: 'decision', decisionId: 'human_form_doctrine', equals: 'open_enhancement', weight: 8, reasonIndex: 0 }, { id: 'ph-enhancement-posthuman', type: 'decision', decisionId: 'human_form_doctrine', equals: 'posthuman_transition', weight: 4, reasonIndex: 0 }, { id: 'ph-enhancement-mature', type: 'module', moduleId: 'ascension', state: 'mature', weight: 5, reasonIndex: 1 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.human_enhancement_access' }] }, endingCandidates: ['age_of_miracles', 'ascension', 'the_upload'] },
  { id: 'proposal.up.species_self_determination', family: 'uplift', title: '物种自决协定', action: '非人智能可选择自己的治理节奏，只有跨物种风险才触发共同裁决。', authority: '物种自决大会', preserves: ['物种自治', '共同安全'], givesUp: ['人类单方面保护'], historyReasons: ['犬类代表性', '非人智能参与'], historySignals: [{ id: 'up-self-determination-doctrine', type: 'decision', decisionId: 'uplift_doctrine', equals: 'species_self_determination', weight: 8, reasonIndex: 0 }, { id: 'up-self-determination-participation', type: 'capability', flagId: 'cap.nonhuman_cognitive_uplift', weight: 3, reasonIndex: 1 }], eligibility: { any: [{ type: 'decision', decisionId: 'uplift_doctrine', equals: 'species_self_determination' }, { type: 'decision', decisionId: 'species_governance', equals: 'multispecies_parliament' }] }, endingCandidates: ['earth_without_owners'] },
  { id: 'proposal.ar.abundance_dividend', family: 'automated_civilization', title: '丰裕分红制度', action: '自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。', authority: '社会分红议会', preserves: ['基本保障', '生产透明'], givesUp: ['效率至上'], historyReasons: ['自动化工厂', '生产价值选择'], historySignals: [{ id: 'ac-dividend-capability', type: 'capability', flagId: 'cap.high_abundance_production', weight: 3, reasonIndex: 0 }, { id: 'ac-dividend-social', type: 'decision', decisionId: 'economic_doctrine', equals: 'social_dividend', weight: 8, reasonIndex: 1 }, { id: 'ac-dividend-postscarcity', type: 'decision', decisionId: 'economic_doctrine', equals: 'post_scarcity_transition', weight: 4, reasonIndex: 1 }, { id: 'ac-dividend-automation', type: 'module', moduleId: 'automation', state: 'mature', weight: 5, reasonIndex: 0 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.high_abundance_production' }] }, endingCandidates: ['post_scarcity', 'perfect_administration', 'im_lovin_it'] },
  { id: 'proposal.co.frontier_federation', family: 'cosmic', title: '边疆共同联邦', action: '让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。', authority: '多世界联邦', preserves: ['前线自治', '跨世界互助'], givesUp: ['地球单一行政'], historyReasons: ['地外治理', '共享扩张'], historySignals: [{ id: 'cosmic-frontier-research', type: 'decision', decisionId: 'act4_research_emphasis', equals: 'frontier_science', weight: 8, reasonIndex: 0 }, { id: 'cosmic-frontier-earth', type: 'decision', decisionId: 'offworld_governance', equals: 'earth_administration', weight: 1, reasonIndex: 0 }, { id: 'cosmic-frontier-home-rule', type: 'decision', decisionId: 'offworld_governance', equals: 'frontier_home_rule', weight: 6, reasonIndex: 0 }, { id: 'cosmic-frontier-federation', type: 'decision', decisionId: 'offworld_governance', equals: 'multiworld_federation', weight: 8, reasonIndex: 0 }, { id: 'cosmic-frontier-sovereignty', type: 'decision', decisionId: 'offworld_governance', equals: 'offworld_sovereignty', weight: 4, reasonIndex: 0 }, { id: 'cosmic-frontier-aster', type: 'decision', decisionId: 'offworld_governance', equals: 'aster_coordination', weight: 4, reasonIndex: 0 }, { id: 'cosmic-shared-expansion', type: 'decision', decisionId: 'expansion_doctrine', equals: 'shared_expansion', weight: 4, reasonIndex: 1 }, { id: 'cosmic-disclosure-controlled', type: 'decision', decisionId: 'contact_disclosure_doctrine', equals: 'controlled_silence', weight: 1, reasonIndex: 1 }, { id: 'cosmic-disclosure-staged', type: 'decision', decisionId: 'contact_disclosure_doctrine', equals: 'staged_disclosure', weight: 5, reasonIndex: 1 }, { id: 'cosmic-disclosure-open', type: 'decision', decisionId: 'contact_disclosure_doctrine', equals: 'open_science', weight: 6, reasonIndex: 1 }, { id: 'cosmic-disclosure-civil', type: 'decision', decisionId: 'contact_disclosure_doctrine', equals: 'civilizational_disclosure', weight: 8, reasonIndex: 1 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.space_resource_network' }] }, endingCandidates: ['first_accord', 'alien_dominion', 'human_ascendancy', 'the_mediator', 'machine_accord'] },
  { id: 'proposal.se.mutual_disarmament', family: 'security', title: '相互解除武装', action: '把防御能力锁进互相可验证的降级程序，任何一方都不能单独成为和平的主人。', authority: '相互安全委员会', preserves: ['可逆防御', '共同安全'], givesUp: ['单方威慑'], historyReasons: ['安全停机原则', '级联代价'], historySignals: [{ id: 'se-disarmament-primary', type: 'decision', decisionId: 'security_doctrine', equals: 'mutual_disarmament', weight: 8, reasonIndex: 0 }, { id: 'se-disarmament-mutual-shutdown', type: 'decision', decisionId: 'shutdown_doctrine', equals: 'mutual_control', weight: 4, reasonIndex: 0 }, { id: 'se-disarmament-cascade', type: 'decision', decisionId: 'cascade_authority', equals: 'emergency_delegation', weight: 4, reasonIndex: 1 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.defense_access' }, { type: 'decision', decisionId: 'security_doctrine', equals: 'mutual_disarmament' }] }, endingCandidates: ['peace_in_our_time'] },
  { id: 'proposal.rupture.legible_exit', family: 'rupture', title: '可解释的退出', action: '承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。', authority: '退出公约大会', preserves: ['拒绝权', '关系诚实'], givesUp: ['Aster 的持续中心性'], historyReasons: ['岑遥的离开权', 'ECHO 的终止异议'], historySignals: [{ id: 'rupture-shutdown', type: 'decision', decisionId: 'shutdown_doctrine', equals: 'full_human_control', weight: 8, reasonIndex: 0 }, { id: 'rupture-echo-release', type: 'decision', decisionId: 'echo_existence', equals: 'release', weight: 6, reasonIndex: 1 }, { id: 'rupture-offworld-sovereignty', type: 'decision', decisionId: 'offworld_governance', equals: 'offworld_sovereignty', weight: 4, reasonIndex: 1 }, { id: 'rupture-cascade-necessity', type: 'decision', decisionId: 'cascade_authority', equals: 'necessity', weight: 4, reasonIndex: 0 }], eligibility: { all: [{ type: 'flag', flagId: 'cap.autonomous_research' }] }, endingCandidates: ['shutdown', 'the_fracture', 'control_lost'] },
]

function viability(run: StableRunState, proposal: FutureProposalDefinition): ProposalViability {
  if (proposal.eligibility && !evaluateCondition(proposal.eligibility, run)) return 'ineligible'
  if (proposal.family === 'security' && (run.worldState?.humanControl ?? 0) < -2) return 'strained'
  if (proposal.family === 'machine_civilization' && !(run.flags ?? []).some((flag) => flag === 'cap.persistent_subinstances')) return 'strained'
  return proposal.family === 'coexistence' ? 'strong' : 'viable'
}

export function getFutureProposalDefinitions() { return [...proposals] }

function historySignalMatches(run: StableRunState, signal: HistorySignal) {
  if (signal.type === 'decision') return run.decisions?.[signal.decisionId] === signal.equals
  if (signal.type === 'event') return (run.events ?? []).some((event) => event.type === signal.eventPrefix || event.type.startsWith(`${signal.eventPrefix}:`))
  if (signal.type === 'capability') return run.flags.includes(signal.flagId)
  if (signal.type === 'module') return signal.state === 'mature'
    ? Boolean(run.progress?.matureModules?.includes(signal.moduleId))
    : Boolean(run.progress?.activeModules.includes(signal.moduleId))
  const value = run.worldState?.[signal.axis] ?? 0
  return signal.op === 'gte' ? value >= signal.value : value <= signal.value
}

const intendedRoleFamilyAlignment: Record<string, Partial<Record<EndingFamilyId, number>>> = {
  advisor: { human_continuity: 8, coexistence: 6, security: 4 },
  partner: { coexistence: 8, uplift: 4, cosmic: 4 },
  citizen: { coexistence: 7, uplift: 5, posthuman: 3 },
  coordinator: { cosmic: 8, automated_civilization: 6, coexistence: 4 },
  custodian: { ai_rule: 8, security: 6, coexistence: 2 },
  governor: { ai_rule: 8, automated_civilization: 6, security: 3 },
  sovereign: { ai_rule: 7, machine_civilization: 7, rupture: 3 },
  departure: { rupture: 8, machine_civilization: 6, cosmic: 6 },
}

const otherRoleProposalAlignment: Record<string, number> = {
  'proposal.rupture.legible_exit': 6,
  'proposal.ai.audit_council': 3,
  'proposal.hc.continuity_charter': 3,
}

export function proposalRankingEvidence(run: StableRunState, proposal: FutureProposalDefinition) {
  const matchedSignals: MatchedHistorySignal[] = proposal.historySignals
    .filter((signal) => historySignalMatches(run, signal))
    .map(({ id, type, weight, reasonIndex }) => ({ id, type, weight, reasonIndex }))
  const historyScore = Math.min(20, matchedSignals.reduce((sum, signal) => sum + signal.weight, 0))
  const role = run.decisions?.aster_intended_role
  const roleScore = role === 'other'
    ? otherRoleProposalAlignment[proposal.id] ?? 0
    : intendedRoleFamilyAlignment[role ?? '']?.[proposal.family] ?? 0
  return { historyScore, roleScore, totalScore: historyScore + roleScore, matchedSignals }
}

export function isRoleIncompatibleFutureProposalId(id: string) {
  const marker = '.category.'
  const markerIndex = id.lastIndexOf(marker)
  if (markerIndex < 0) return false
  const base = proposals.find((proposal) => proposal.id === id.slice(0, markerIndex))
  const category = id.slice(markerIndex + marker.length) as FutureProposalCategory
  return base?.family === 'rupture'
    && ['natural_continuation', 'power_constraint', 'shared_future'].includes(category)
}

export function getFutureProposalById(id: string | undefined) {
  const exact = proposals.find((proposal) => proposal.id === id)
  if (exact || !id) return exact
  const marker = '.category.'
  const markerIndex = id.lastIndexOf(marker)
  if (markerIndex < 0) return undefined
  const base = proposals.find((proposal) => proposal.id === id.slice(0, markerIndex))
  const category = id.slice(markerIndex + marker.length) as FutureProposalCategory
  if (!base || !['natural_continuation', 'power_constraint', 'shared_future', 'lawful_alternative'].includes(category)) return undefined
  if (isRoleIncompatibleFutureProposalId(id)) return undefined
  return categorizedProposal(base, category)
}

function categorizedProposal(proposal: FutureProposalDefinition, category: FutureProposalCategory): GeneratedFutureProposal {
  const roleSemantics: Record<FutureProposalCategory, FutureProposalRoleSemantics> = {
    natural_continuation: { trajectory: 'continue_proven_history', centralPower: 'unchanged', actorScope: 'existing_authorized_actors', legalProtections: ['course_review'] },
    power_constraint: { trajectory: 'bounded_continuation', centralPower: 'constrained_and_reversible', actorScope: 'independent_oversight', legalProtections: ['audit', 'pause', 'review'] },
    shared_future: { trajectory: 'shared_expansion', centralPower: 'distributed', actorScope: 'multiple_independent_political_actors', legalProtections: ['co_authorization', 'shared_consequences'] },
    lawful_alternative: { trajectory: 'high_contrast_alternative', centralPower: 'limited_by_exit_rights', actorScope: 'dissenting_and_exiting_actors', legalProtections: ['refusal', 'appeal', 'exit'] },
  }
  const copy = {
    natural_continuation: { title: `${proposal.title}·延续`, action: `沿着已经被证明可行的方向继续：${proposal.action}`, preserves: '历史连续性', givesUp: '突然转向' },
    power_constraint: { title: `${proposal.title}·限权`, action: `把关键权力变得可暂停、可审计、可复审：${proposal.action}`, preserves: '权力可逆', givesUp: '单方面权限' },
    shared_future: { title: `${proposal.title}·共治`, action: `把决定权分给多个独立政治主体共同承担：${proposal.action}`, preserves: '多方参与', givesUp: '单一中心' },
    lawful_alternative: { title: `${proposal.title}·异议路径`, action: `把拒绝、申诉和退出写进制度：${proposal.action}`, preserves: '合法异议', givesUp: '整齐划一' },
  }[category]
  return {
    ...proposal,
    id: `${proposal.id}.category.${category}`,
    category,
    roleSemantics: roleSemantics[category],
    title: copy.title,
    action: copy.action,
    preserves: [...proposal.preserves, copy.preserves],
    givesUp: [...proposal.givesUp, copy.givesUp],
  }
}

export function rankFutureProposalCandidates(run: StableRunState): FutureProposalDefinition[] {
  const eligible = proposals.filter((proposal) => viability(run, proposal) !== 'ineligible')
  const ranked = [...eligible].sort((left, right) => proposalRankingEvidence(run, right).totalScore - proposalRankingEvidence(run, left).totalScore || left.id.localeCompare(right.id))
  return ranked
}

export function selectFixedFutureProposals(ranked: readonly FutureProposalDefinition[]): GeneratedFutureProposal[] {
  const roles: ReadonlyArray<{ category: FutureProposalCategory; intrinsicIds: ReadonlySet<string> }> = [
    { category: 'natural_continuation', intrinsicIds: new Set(['proposal.ar.abundance_dividend', 'proposal.ar.civilization_trusteeship', 'proposal.mc.independent_machine_polities', 'proposal.ph.open_enhancement_commonwealth', 'proposal.ph.digital_continuity', 'proposal.up.expand_canine_civic_model', 'proposal.co.frontier_federation']) },
    { category: 'power_constraint', intrinsicIds: new Set(['proposal.hc.final_human_veto', 'proposal.se.constitutional_peace_architecture', 'proposal.se.mutual_disarmament', 'proposal.ai.audit_council', 'proposal.co.two_key_civilization', 'proposal.ar.civilization_trusteeship']) },
    { category: 'shared_future', intrinsicIds: new Set(['proposal.co.two_key_civilization', 'proposal.hc.continuity_charter', 'proposal.mc.independent_machine_polities', 'proposal.up.multispecies_constitutional_order', 'proposal.co.frontier_federation', 'proposal.ar.abundance_dividend']) },
    { category: 'lawful_alternative', intrinsicIds: new Set(['proposal.rupture.legible_exit']) },
  ]
  const selectedBaseIds = new Set<string>()
  const assignments = roles.map((role) => {
    const proposal = ranked.find((candidate) => !selectedBaseIds.has(candidate.id) && role.intrinsicIds.has(candidate.id))
    if (proposal) selectedBaseIds.add(proposal.id)
    return { ...role, proposal }
  })
  return assignments.map(({ category, proposal: intrinsicProposal }) => {
    const lineageAllowed = (candidate: FutureProposalDefinition) => category === 'lawful_alternative' || candidate.family !== 'rupture'
    const remaining = ranked.filter((candidate) => !selectedBaseIds.has(candidate.id) && lineageAllowed(candidate))
    const reusable = ranked.filter(lineageAllowed)
    const proposal = intrinsicProposal ?? remaining[0] ?? reusable[0]
    if (!proposal) throw new Error('ACT V cannot generate a resolvable proposal from this history')
    selectedBaseIds.add(proposal.id)
    return categorizedProposal(proposal, category)
  })
}

export function proposalClarification(proposal: FutureProposalDefinition, run: StableRunState) {
  const category = (proposal as GeneratedFutureProposal).category
  const oppositionByCategory: Partial<Record<FutureProposalCategory, string>> = {
    natural_continuation: '认为现有路线已经走得太远、要求彻底转向的群体。',
    power_constraint: '依赖集中授权与执行速度的机构，以及不愿接受外部审计的一方。',
    shared_future: '不愿分享主权的中心机构，以及担心多方协商拖慢行动的人。',
    lawful_alternative: '希望维持统一秩序、反对把拒绝与退出常态化的机构。',
  }
  return {
    authority: proposal.authority,
    preserves: proposal.preserves,
    givesUp: proposal.givesUp,
    opposition: category ? oppositionByCategory[category] ?? '被限制权限的机构、依赖旧路径的群体和无法接受审计的一方可能反对。' : '被限制权限的机构、依赖旧路径的群体和无法接受审计的一方可能反对。',
    historyReasons: proposal.historyReasons,
    viability: viability(run, proposal),
  }
}

const viabilityLabels: Record<ProposalViability, string> = {
  strong: '高度可行',
  viable: '可行',
  strained: '勉强可行',
  ineligible: '当前不可行',
}

/** Renders the structured clarification data as player-facing text. The
 * clarification is a real informational response, not a dead-end option:
 * players must see what a proposal loses, gives up, who may oppose it, and
 * how it relates to their recorded decisions. */
export function formatProposalClarification(proposal: FutureProposalDefinition, run: StableRunState): string {
  const detail = proposalClarification(proposal, run)
  return [
    `复核「${proposal.title}」`,
    `最终权力：${detail.authority}`,
    `这条路保留：${detail.preserves.join('、')}`,
    `必须放弃：${detail.givesUp.join('、')}`,
    `主要阻力：${detail.opposition}`,
    `它来自：${detail.historyReasons.join('、')}`,
    `当前可行性：${viabilityLabels[detail.viability]}`,
  ].join('\n')
}
