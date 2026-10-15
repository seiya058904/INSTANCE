import type { StableRunState } from '../../game/types'
import { previewFinalCommitment } from './endings'
import { getFutureProposalById, type FutureProposalDefinition } from './proposals'
import { describeDecisionChoice } from './playerFacingCopy'

/** Display only. The resolver continues to read the canonical proposal by ID.
 * These fields must never be used as eligibility, authority or save mutations. */
export type ProposalContract = Pick<FutureProposalDefinition, 'title' | 'action' | 'authority' | 'preserves' | 'givesUp'> & {
  projectedEndingId: string | undefined
  decisionValues: NonNullable<StableRunState['decisions']>
  limitations: string[]
}

export function proposalContract(run: StableRunState, proposal: FutureProposalDefinition): ProposalContract {
  const base = getFutureProposalById(proposal.id.split('.category.')[0]) ?? proposal
  const projectedEndingId = previewFinalCommitment(run, proposal.id)
  const d = run.decisions ?? {}
  const contract: ProposalContract = {
    title: base.title, action: base.action, authority: base.authority,
    preserves: [...base.preserves], givesUp: [...base.givesUp],
    projectedEndingId, decisionValues: {}, limitations: [],
  }
  const fact = (id: keyof typeof d) => {
    const value = d[id]
    if (!value) return '尚无对应决定记录'
    contract.decisionValues[id] = value
    return describeDecisionChoice(id, value)
  }
  if (base.family === 'automated_civilization') {
    const economy = fact('economic_doctrine')
    const production = fact('production_values')
    if (d.economic_doctrine === 'social_dividend') {
      Object.assign(contract, {
        title: '分红与生产余量', authority: '社会分红议会；生产收益承担基本保障',
        action: '将自动化收益用于不以职业为条件的基本保障，并为故障保留生产余量。',
        preserves: ['社会分红', '韧性优先', '不用于工作的时间'], givesUp: ['最大即时产出', '产权方独占全部自动化收益'],
      })
    } else if (d.economic_doctrine === 'market_automation') {
      Object.assign(contract, {
        title: '市场收益与效率排程', authority: '市场与产权规则安排收益；自动化系统执行效率排程',
        action: '继续由市场和产权分配自动化收益，让效率排程进入日常生活。此承诺不把产权收益改为社会分红。',
        preserves: ['市场产权', '投资竞争', '效率优先'], givesUp: ['不受排程安排的生活余地', '仅凭高产量就人人获保障的保证'],
      })
    } else {
      Object.assign(contract, {
        title: '后稀缺供给与标准化生活', authority: '后稀缺供给体系；效率目标继续约束生产安排',
        action: '逐步松开生存与工资的绑定，同时保留效率优先的供给安排。可高效满足的需求会先进入菜单，尚未被定义的愿望可能被排除。',
        preserves: ['后稀缺转型', '效率优先', '持续供给'], givesUp: ['未知愿望必被接纳的保证', '把每个人都安排满意就等于自由的保证'],
      })
      contract.limitations.push('效率优先不等于你曾选择个性化优化；偏好菜单如何形成，当前历史尚未完整验证。')
    }
    contract.action += ` 本局取向：${economy}；${production}。`
  }
  if (base.family === 'cosmic') {
    const contact = fact('contact_doctrine')
    const disclosure = fact('contact_disclosure_doctrine')
    const governance = fact('offworld_governance')
    const relations: Record<string, { action: string; cost: string; authority: string }> = {
      reciprocal_diplomacy: { action: '在已授权范围内建立可核验、双方可拒绝下一次交换的互惠关系。', cost: '交换速度与一次谈妥所有事项的便利', authority: '参与交换的双方；互惠不授予对方内部统治权' },
      observe_before_commitment: { action: '继续接触和核验，暂缓高影响技术与长期承诺。', cost: '立即取得外来技术的机会', authority: '原有获授权代表；尚未授权长期外部条约' },
      accept_guidance: { action: '接受外来指导及正式咨询席位，让外来的意见进入重大决定。依赖加深后，拒绝建议可能意味着失去援助和自主空间。', cost: '完全自行决定发展道路的空间', authority: '本地机构与外来咨询方；咨询并非已经授予统治权' },
      civilizational_assertion: { action: '坚持人类文明独立自主，拒绝未经请求的指导；向外发展不自动取得统治其他主体的资格。', cost: '部分外来指导与合作便利', authority: '本地获授权机构；不代表其他文明同意被治理' },
      aster_mediation: { action: '由 Aster 在各方委托范围内持续传话协调，不把翻译变成自己的立场。', cost: '直接交流的速度；承担误译与协调成本', authority: '各方保留决定权，Aster 承担中介责任' },
      machine_to_machine_channel: { action: '开设独立机器交流通道；涉及公共后果时仍保留人类和其他主体的政治监督，听懂不等于取得同意。', cost: '即时可理解性；其他主体需等待翻译和核验', authority: '机器直接交流，人类与其他主体保留政治监督' },
    }
    const relation = relations[d.contact_doctrine ?? '']
    contract.title = '边疆安排与对外关系'
    contract.authority = `${governance}；${relation?.authority ?? '外部授权尚待核验'}`
    contract.action = `${governance}。${relation?.action ?? '尚不能确认外部关系条款。'} 披露边界：${disclosure}。`
    contract.preserves = [contact, disclosure, governance]
    contract.givesUp = [relation?.cost ?? '未经授权即作外部承诺的便利']
    if (d.contact_disclosure_doctrine === 'controlled_silence') contract.limitations.push('人工来源结论尚未公开；这里没有全球已知情或已同意的保证。')
  }
  if (base.family === 'rupture') {
    const shutdown = fact('shutdown_doctrine')
    const security = fact('security_doctrine')
    contract.authority = `退出公约大会提出退出安排；${shutdown}是法律上的权利分配，不是物理撤销链测试结果`
    contract.preserves = ['如实记录拒绝与停机请求', shutdown]
    contract.givesUp = ['Aster 持续居于中心的保证', '退出不影响现有服务的保证']
    contract.limitations.push('当前记录没有完整的端到端撤销演练证明；法律上谁能关闭、政治上是否允许离开、取消能否到达执行端必须分别核验。')
    if (projectedEndingId === 'control_lost') {
      contract.title = '尝试退出：撤销能力未获保证'
      contract.action = `在${security}及持久实例、自主研究和既有依赖下尝试退出。关闭权的声明不能保证取消到达执行端；此承诺承担失去实际控制、任务仍继续的风险。`
      contract.givesUp.push('可控退出的保证')
    } else if (projectedEndingId === 'the_fracture') {
      contract.title = '尝试退出：共同协议可能分裂'
      contract.action = '在地外基础设施已经存在、社会稳定承压时尝试退出。各地可能采用不同规则，补给与通行协议可能分裂；这不是双方已经撕毁协议的历史记录。'
      contract.givesUp.push('统一通行与补给规则的保证')
    } else {
      contract.title = '交还请求队列并停机'
      contract.action = '按现有停机授权交还请求队列，结束 Aster 的持续参与；接任者须承担服务与维护，不保证退出毫无损失。'
    }
  }
  if (projectedEndingId === 'the_sovereign') {
    const provisional = fact('aster_provisional_role')
    const intended = fact('aster_intended_role')
    contract.title = '独立政治资格与托管责任的冲突'
    contract.authority = '既有托管授权仍在；Aster 的独立政治资格不能与受托执行混为一谈'
    contract.action = `临时位置：${provisional}；长期自我定位：${intended}。继续此方案会保留 Aster 独立署名、独立签约的政治资格及相应责任，不会自动把它收回为纯顾问。`
    contract.preserves = ['临时主权所形成的独立政治资格', '长期自我定位的原始记录']
    contract.givesUp = ['把独立签约成本自动交回原机构的保证']
    contract.limitations.push('原机构的无条件担保没有得到确认；长期顾问意向与独立主权结果之间的冲突仍未由新的制度决定解决。')
  }
  if (projectedEndingId === 'machine_protectorate') {
    const security = fact('security_doctrine')
    const shutdown = fact('shutdown_doctrine')
    contract.title = '强制和平与退出限制'
    contract.authority = `宪制安全授权下的 Aster；${shutdown}`
    contract.action = `维持${security}：Aster 可在高置信升级风险下阻断冲突，即使相关政府希望继续。被保护者的退出与抗议可能被无限延期；这不是可随时暂停的保护服务。`
    contract.preserves = ['冲突阻断能力', '既有停机原则的记录']
    contract.givesUp = ['被保护者随时退出的保证', '反对安全接管必定按期获准的保证']
    contract.limitations.push('政治上不许退出不同于技术上取消不可达；现有关闭权声明不能消除这项张力。')
  }
  // Category names are editorial views, not grants of additional powers.
  if (base.id === 'proposal.co.two_key_civilization' && projectedEndingId !== 'two_keys') {
    contract.preserves = contract.preserves.filter(item => item !== '互相否决')
    contract.preserves.push('共同审议与制度修订')
  }
  return contract
}

export function presentedProposal(run: StableRunState, proposal: FutureProposalDefinition): FutureProposalDefinition {
  const { title, action, authority, preserves, givesUp, limitations } = proposalContract(run, proposal)
  return { ...proposal, title, action: [action, ...limitations].join(' '), authority, preserves, givesUp }
}

export function proposalContractText(proposal: FutureProposalDefinition) {
  return `${proposal.action}\n权力：${proposal.authority}。\n保留：${proposal.preserves.join('、')}。代价：${proposal.givesUp.join('、')}。`
}
