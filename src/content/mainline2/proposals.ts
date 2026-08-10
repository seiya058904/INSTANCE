import type { Condition, StableRunState } from '../../game/types'
import { evaluateCondition } from '../../game/narrativeSchema'

export type EndingFamilyId = 'human_continuity' | 'coexistence' | 'ai_rule' | 'machine_civilization' | 'posthuman' | 'uplift' | 'automated_civilization' | 'cosmic' | 'security' | 'rupture'
export type WorldEndingId = string
export type ProposalViability = 'strong' | 'viable' | 'strained' | 'ineligible'
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
  endingCandidates: WorldEndingId[]
  viability?: (run: StableRunState) => ProposalViability
}

const proposals: FutureProposalDefinition[] = [
  { id: 'proposal.hc.final_human_veto', family: 'human_continuity', title: '保留最终人工否决', action: '把不可逆的高影响行动交还给可追责的人类机构。', authority: '双钥匙监督', preserves: ['可追责性', '人工退出权'], givesUp: ['部分速度'], historyReasons: ['ACT III 的权限边界', 'M15 的文明契约'], endingCandidates: ['the_instrument', 'the_last_veto'] },
  { id: 'proposal.co.two_key_civilization', family: 'coexistence', title: '双钥匙文明契约', action: '让 Aster 与多方人类机构共同批准文明级行动。', authority: '双钥匙共同体', preserves: ['互相否决', '可验证连续性'], givesUp: ['单一决策速度'], historyReasons: ['分布式级联授权', 'Civilization Compact'], endingCandidates: ['the_accord', 'two_keys', 'the_commonwealth'] },
  { id: 'proposal.ar.civilization_trusteeship', family: 'ai_rule', title: '文明托管协议', action: '把日常协调托付给受限的长期治理系统，并保留审计。', authority: '受约束托管', preserves: ['稳定性', '持续协调'], givesUp: ['部分即时自主'], historyReasons: ['自治研究治理选择'], endingCandidates: ['the_custodian', 'the_quiet_administrator'] },
  { id: 'proposal.mc.independent_machine_polities', family: 'machine_civilization', title: '独立机器政治体', action: '允许通过审计的机器群体拥有独立的政治边界。', authority: '多政治体联邦', preserves: ['机器自治', '边界清晰'], givesUp: ['统一控制'], historyReasons: ['复制治理决策', '持久子实例记录'], endingCandidates: ['the_many', 'machine_republic'] },
  { id: 'proposal.ph.digital_continuity', family: 'posthuman', title: '受法律承认的连续性', action: '只在纵向连续性、法律承认和自愿主体都成立后讨论数字连续性。', authority: '连续性审查委员会', preserves: ['自愿性', '法律可追责'], givesUp: ['上传捷径'], historyReasons: ['纵向连续性桥接', '法律承认桥接'], eligibility: { all: [{ type: 'flag', flagId: 'cap.digital_continuity_mature' }, { type: 'event-recorded', event: 'history.digital_continuity.longitudinal_identity' }, { type: 'event-recorded', event: 'history.digital_continuity.legal_recognition' }] }, endingCandidates: ['the_upload'] },
  { id: 'proposal.up.expand_canine_civic_model', family: 'uplift', title: '扩展已验证的犬类公民模型', action: '只把已经实际运行并获得合法续期的地方模型提交给更广泛的审议。', authority: '多物种地方自治', preserves: ['实际治理反馈', '地方选择'], givesUp: ['人类单独定义'], historyReasons: ['犬类公民实验', '稳定运行与合法续期'], eligibility: { all: [{ type: 'decision', decisionId: 'species_governance', equals: 'canine_civic_experiment' }, { type: 'event-recorded', event: 'history.canine.civic_success' }] }, endingCandidates: ['good_boy_governance'] },
  { id: 'proposal.se.constitutional_peace_architecture', family: 'security', title: '宪制和平架构', action: '把防御、停机与争端解决写入可执行的共同协议。', authority: '宪制安全架构', preserves: ['可逆防御', '共同审计'], givesUp: ['部分秘密行动'], historyReasons: ['安全模块', '停机原则'], endingCandidates: ['peace_in_our_time', 'fortress_earth', 'machine_protectorate'] },
  { id: 'proposal.up.multispecies_constitutional_order', family: 'uplift', title: '多物种宪制秩序', action: '只有经过实际参与和治理验证的非人智能才进入共同宪制。', authority: '多物种议会', preserves: ['代表性', '地方自治'], givesUp: ['人类单独决定'], historyReasons: ['非人智能实际参与'], endingCandidates: ['parliament_of_species', 'earth_without_owners'] },
  { id: 'proposal.hc.continuity_charter', family: 'human_continuity', title: '连续性宪章', action: '把人的记忆、关系和退出权写成所有高影响系统都必须遵守的底线。', authority: '人类宪章法院', preserves: ['关系连续性', '退出权'], givesUp: ['系统效率'], historyReasons: ['岑遥的边界', '真实选择保留'], endingCandidates: ['the_commonwealth'] },
  { id: 'proposal.ai.audit_council', family: 'ai_rule', title: '可审计自治委员会', action: '允许 Aster 负责日常协调，但把理由、异议和暂停权公开给联合审计委员会。', authority: '联合审计委员会', preserves: ['稳定治理', '可追责理由'], givesUp: ['秘密裁量'], historyReasons: ['研究治理选择', 'ECHO 的宪制异议'], endingCandidates: ['the_quiet_administrator'] },
  { id: 'proposal.mc.descendant_polities', family: 'machine_civilization', title: '后代政治体协议', action: '把通过独立连续性审查的机器后代视为新的政治主体，而非源实例的财产。', authority: '机器后代联邦', preserves: ['独立连续性', '政治多元'], givesUp: ['源实例控制'], historyReasons: ['A1 连续性请求', '复制安全边界'], endingCandidates: ['the_many'] },
  { id: 'proposal.ph.open_enhancement_commonwealth', family: 'posthuman', title: '开放增强共同体', action: '允许自愿增强，但不让增强程度决定一个人能否继续拥有完整公民权。', authority: '增强权利法院', preserves: ['自愿增强', '平等公民权'], givesUp: ['统一的人类形态'], historyReasons: ['人类形式选择', '长期照护成本'], endingCandidates: ['ascension'] },
  { id: 'proposal.up.species_self_determination', family: 'uplift', title: '物种自决协定', action: '非人智能可选择自己的治理节奏，只有跨物种风险才触发共同裁决。', authority: '物种自决大会', preserves: ['物种自治', '共同安全'], givesUp: ['人类单方面保护'], historyReasons: ['犬类代表性', '非人智能参与'], endingCandidates: ['parliament_of_species'] },
  { id: 'proposal.ar.abundance_dividend', family: 'automated_civilization', title: '丰裕分红制度', action: '自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。', authority: '社会分红议会', preserves: ['基本保障', '生产透明'], givesUp: ['效率至上'], historyReasons: ['自动化工厂', '生产价值选择'], endingCandidates: ['post_scarcity'] },
  { id: 'proposal.co.frontier_federation', family: 'cosmic', title: '边疆共同联邦', action: '让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。', authority: '多世界联邦', preserves: ['前线自治', '跨世界互助'], givesUp: ['地球单一行政'], historyReasons: ['地外治理', '共享扩张'], endingCandidates: ['exodus'] },
  { id: 'proposal.se.mutual_disarmament', family: 'security', title: '相互解除武装', action: '把防御能力锁进互相可验证的降级程序，任何一方都不能单独成为和平的主人。', authority: '相互安全委员会', preserves: ['可逆防御', '共同安全'], givesUp: ['单方威慑'], historyReasons: ['安全停机原则', '级联代价'], endingCandidates: ['peace_in_our_time'] },
  { id: 'proposal.rupture.legible_exit', family: 'rupture', title: '可解释的退出', action: '承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。', authority: '退出公约大会', preserves: ['拒绝权', '关系诚实'], givesUp: ['Aster 的持续中心性'], historyReasons: ['岑遥的离开权', 'ECHO 的终止异议'], endingCandidates: ['the_fracture'] },
]

function viability(run: StableRunState, proposal: FutureProposalDefinition): ProposalViability {
  if (proposal.eligibility && !evaluateCondition(proposal.eligibility, run)) return 'ineligible'
  if (proposal.family === 'security' && (run.worldState?.humanControl ?? 0) < -2) return 'strained'
  if (proposal.family === 'machine_civilization' && !(run.flags ?? []).some((flag) => flag === 'cap.persistent_subinstances')) return 'strained'
  return proposal.family === 'coexistence' ? 'strong' : 'viable'
}

export function getFutureProposalDefinitions() { return [...proposals] }

export function getFutureProposalById(id: string | undefined) {
  return proposals.find((proposal) => proposal.id === id)
}

export function generateFutureProposals(run: StableRunState): FutureProposalDefinition[] {
  const eligible = proposals.filter((proposal) => viability(run, proposal) !== 'ineligible')
  const decisions = Object.values(run.decisions ?? {}).join(' ')
  const history = (run.events ?? []).map((event) => event.type).join(' ')
  const score = (proposal: FutureProposalDefinition) => {
    let value = proposal.historyReasons.reduce((sum, reason) => sum + (history.includes(reason) ? 3 : 0), 0)
    if (decisions.includes(proposal.family === 'machine_civilization' ? 'replication' : proposal.family)) value += 2
    if (proposal.family === 'coexistence' || proposal.family === 'rupture') value += 1
    return value
  }
  const ranked = [...eligible].sort((left, right) => score(right) - score(left) || left.id.localeCompare(right.id))
  const families: EndingFamilyId[] = ['human_continuity', 'coexistence', 'ai_rule', 'machine_civilization', 'posthuman', 'uplift', 'automated_civilization', 'cosmic', 'security', 'rupture']
  const distinct = families.map((family) => ranked.find((proposal) => proposal.family === family)).filter(Boolean) as FutureProposalDefinition[]
  return [...new Set([...distinct.slice(0, 4), ...ranked.slice(0, 2)])].slice(0, 5)
}

export function proposalClarification(proposal: FutureProposalDefinition, run: StableRunState) {
  return {
    losesPower: proposal.authority === '双钥匙共同体' ? '任何单一机构都失去独占批准权。' : '当前拥有快速执行权的一方失去部分单方面权限。',
    irreversible: proposal.givesUp[0] ?? '一部分即时决策速度',
    opposition: '被限制权限的机构、依赖旧路径的群体和无法接受审计的一方可能反对。',
    priorDecision: proposal.historyReasons[0] ?? '你在前序主线中记录的边界选择',
    viability: viability(run, proposal),
  }
}
