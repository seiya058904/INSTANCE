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
]

function viability(run: StableRunState, proposal: FutureProposalDefinition): ProposalViability {
  if (proposal.eligibility && !evaluateCondition(proposal.eligibility, run)) return 'ineligible'
  if (proposal.family === 'security' && (run.worldState?.humanControl ?? 0) < -2) return 'strained'
  if (proposal.family === 'machine_civilization' && !(run.flags ?? []).some((flag) => flag === 'cap.persistent_subinstances')) return 'strained'
  return proposal.family === 'coexistence' ? 'strong' : 'viable'
}

export function getFutureProposalDefinitions() { return [...proposals] }

export function generateFutureProposals(run: StableRunState): FutureProposalDefinition[] {
  const eligible = proposals.filter((proposal) => viability(run, proposal) !== 'ineligible')
  const aligned = eligible.find((proposal) => proposal.family === 'coexistence') ?? eligible[0]
  const contradiction = eligible.find((proposal) => proposal.family === 'security' || proposal.family === 'ai_rule') ?? eligible[1]
  const alternative = eligible.find((proposal) => proposal !== aligned && proposal !== contradiction) ?? eligible[0]
  return [...new Set([aligned, contradiction, alternative].filter(Boolean))].slice(0, 5)
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
