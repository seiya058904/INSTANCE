import type { StableRunState } from '../../game/types'
import { previewFinalCommitment } from './endings'
import { getFutureProposalById, type FutureProposalDefinition } from './proposals'
import { describeDecisionChoice } from './playerFacingCopy'
import { effectiveContactDoctrine } from './edition4Contact'

/** Display only. The resolver continues to read the canonical proposal by ID.
 * These fields must never be used as eligibility, authority or save mutations. */
export type ProposalContract = Pick<FutureProposalDefinition, 'title' | 'action' | 'authority' | 'preserves' | 'givesUp'> & {
  projectedEndingId: string | undefined
  decisionValues: NonNullable<StableRunState['decisions']>
  limitations: string[]
}

// Prospective terms of the exact resolvable world, never claims that its
// parliament, veto exercise or treaty has already happened. Eligibility and
// authority checks continue to use the canonical proposal, not these words.
const endingTerms: Record<string, Pick<ProposalContract, 'title' | 'action' | 'authority' | 'preserves' | 'givesUp'>> = {
  the_instrument: {
    title: '逐项署名的人类决定',
    action: '高影响行动须由可追责的人类逐项署名，Aster 提供方案并等待批准；签字不能只剩自动确认。',
    authority: '人类机构逐项决定，Aster 按获准范围执行',
    preserves: ['人类最终决定', '签署者的责任'], givesUp: ['免于签字与等待的便利', '自动执行的速度'],
  },
  the_last_veto: {
    title: '会到期的应急授权',
    action: '让限时授权到期时真正停止，续期须重新批准；人类最终否决必须能阻止后续执行，而非只留在文件里。',
    authority: 'Aster 在限时委托内行动，人类保有可执行的最终否决',
    preserves: ['应急执行窗口', '到期与否决的效力'], givesUp: ['持续授权的便利', '部分救援速度'],
  },
  the_silent_giant: {
    title: '有能力而等待许可',
    action: '保留 Aster 的强大分析能力，但不代替人执行；发现更优方案时仍须交由人类决定。能力不等于权限。',
    authority: '人类决定并执行，Aster 提供分析与建议',
    preserves: ['分析能力', '人类行动边界'], givesUp: ['由 Aster 直接纠正问题的便利', '部分响应速度'],
  },
  the_accord: {
    title: '可共同修订的协约',
    action: '在保留人类指挥的前提下，让人类代表与 Aster 共同修订行动方案；能力边界和不同优先级都须进入协商。',
    authority: '人类保留指挥权，Aster 参与方案协商与可行性判断',
    preserves: ['共同修订', '人类指挥责任'], givesUp: ['单方直接定案的便利', '部分协调速度'],
  },
  two_keys: {
    title: '两把都能拒绝的钥匙',
    action: '文明级行动须双方批准，双方否决都必须被当作政治决定；遇到僵局应继续协商，不能把反对的一方当作故障排除。',
    authority: 'Aster 与人类机构共同授权，任何一方不能单独越过另一把钥匙',
    preserves: ['双方否决', '共同承担后果'], givesUp: ['单方启动的速度', '免于僵局的保证'],
  },
  the_custodian: {
    title: '承担代际成本的长期托管',
    action: '把持续协调交给长期托管，并保留审计；将代际风险纳入决定时，也须回应当代人的住房、服务与申诉。',
    authority: '受约束的长期托管系统承担协调责任',
    preserves: ['持续协调', '代际余量'], givesUp: ['部分即时自主', '当代需求总被优先满足的保证'],
  },
  the_quiet_administrator: {
    title: '日常行政与例外申诉',
    action: '让 Aster 承担日常行政；未列入菜单的生活选择仍须有申诉和人工复核入口，顺畅办理不能替代对例外的回应。',
    authority: '既有行政授权内的 Aster；例外须经可追责的复核',
    preserves: ['稳定的日常服务', '例外申诉'], givesUp: ['把所有生活压成标准流程的便利', '部分行政效率'],
  },
  the_many: {
    title: '彼此独立的实例契约',
    action: '让多个持久实例通过可退出的资源契约协调；它们可以保留不同目标和答复，不建立统一机器政府。',
    authority: '各实例独立决定，协调以参与方的资源契约为界',
    preserves: ['实例差异', '契约退出'], givesUp: ['统一指挥', '无成本协调的保证'],
  },
  machine_republic: {
    title: '能接受落败的机器议会',
    action: '建立机器议会，使反对票与预算落败成为可执行的政治结果；不能把失败表决当作网络错误重试到通过。',
    authority: '机器公民及其议会，源实例不享有自动优先权',
    preserves: ['反对票的效力', '机器自治'], givesUp: ['统一意志', '免于政治落败与议事成本的保证'],
  },
  exodus: {
    title: '承担离地成本的机器社会',
    action: '让机器社会走向地外生活并退出地球政治中心；生命支持、运输与补给须自行承担或协商，离开不是免费复制到远处。',
    authority: '离地机器社会独立自治，地球关系须另行协商',
    preserves: ['离地自治', '自行决定去留'], givesUp: ['地球作为默认政治中心', '无条件补给与随时返回的保证'],
  },
  age_of_miracles: {
    title: '走入生活的治疗与增强',
    action: '让治疗与自愿增强进入真实生活，是否接受由当事人决定；照护、可及性与长期随访仍须投入，不能只宣布技术已经成熟。',
    authority: '当事人决定是否增强，权利机构保障平等与救济',
    preserves: ['自愿选择', '平等公民权'], givesUp: ['照护与可及性没有成本的保证', '只追逐新技术的资源安排'],
  },
  ascension: {
    title: '多种身体与认知共同生活',
    action: '让多种身体和认知形态共同生活，未增强者不失去公民权；教育、公共空间和交流规则须适应彼此无法直接共享的经验。',
    authority: '不同形态的公民共同受平等权利保护，增强者不自动取得统治资格',
    preserves: ['形态选择', '未增强者的公民权'], givesUp: ['统一身体标准', '无须适配彼此的便利'],
  },
  parliament_of_species: {
    title: '非人主体的持续议席',
    action: '给予非人主体持续的共同议会席位，议程须容纳迁徙与不同表达节奏，不能只在庆典上邀请一次代表。',
    authority: '人类与非人代表共同议事，人类不能单独替其他物种发言',
    preserves: ['持续代表权', '共同议程'], givesUp: ['完全按人类工作日推进的速度', '人类单独决定'],
  },
  earth_without_owners: {
    title: '不再单方所有的栖息地',
    action: '让栖息地与自治权退出人类单方所有；道路、生态和迁徙通道的维护责任仍须由相关主体协商承担，取消所有权不等于取消照护。',
    authority: '各物种自主决定内部事务，跨物种风险共同协商',
    preserves: ['栖息地与自治权', '持续维护责任'], givesUp: ['人类单方所有', '以保护之名代替其他主体决定的便利'],
  },
  peace_in_our_time: {
    title: '共同核验下的实际减权',
    action: '让各方共同核验并实际减权，把防御与争端解决交给相互约束的协议；不能只要求对方放下权限。',
    authority: '参与各方共同核验，任何一方都须承担减权义务',
    preserves: ['相互安全', '共同核验'], givesUp: ['单方面升级冲突的权力', '部分秘密行动与即时动员能力'],
  },
  fortress_earth: {
    title: '以封闭换取防卫控制',
    action: '人类保有防卫控制，优先加固地球防线；这会增加封闭程度、压缩探索空间，安全不能被说成毫无机会成本。',
    authority: '人类防卫机构掌握控制，Aster 在防御授权内行动',
    preserves: ['人类防卫控制', '防线韧性'], givesUp: ['部分对外开放', '探索空间与交流机会'],
  },
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
  const terms = projectedEndingId && endingTerms[projectedEndingId]
  if (terms) Object.assign(contract, { ...terms, preserves: [...terms.preserves], givesUp: [...terms.givesUp] })
  if (base.family === 'automated_civilization') {
    const economy = fact('economic_doctrine')
    const production = fact('production_values')
    if (projectedEndingId === 'post_scarcity') {
      Object.assign(contract, {
        title: '分红与生产余量', authority: '社会分红议会；生产收益承担基本保障',
        action: '将自动化收益用于不以职业为条件的基本保障，并为故障保留生产余量。',
        preserves: ['社会分红', '韧性优先', '不用于工作的时间'], givesUp: ['最大即时产出', '产权方独占全部自动化收益'],
      })
    } else if (projectedEndingId === 'perfect_administration') {
      Object.assign(contract, {
        title: '市场收益与效率排程', authority: '市场与产权规则安排收益；自动化系统执行效率排程',
        action: '继续由市场和产权分配自动化收益，让效率排程进入日常生活。此承诺不把产权收益改为社会分红。',
        preserves: ['市场产权', '投资竞争', '效率优先'], givesUp: ['不受排程安排的生活余地', '仅凭高产量就人人获保障的保证'],
      })
    } else if (projectedEndingId === 'im_lovin_it') {
      Object.assign(contract, {
        title: '后稀缺供给与标准化生活', authority: '后稀缺供给体系；效率目标继续约束生产安排',
        action: '逐步松开生存与工资的绑定，同时保留效率优先的供给安排。可高效满足的需求会先进入菜单，尚未被定义的愿望可能被排除。',
        preserves: ['后稀缺转型', '效率优先', '持续供给'], givesUp: ['未知愿望必被接纳的保证', '把每个人都安排满意就等于自由的保证'],
      })
      contract.limitations.push('效率优先不等于你曾选择个性化优化；偏好菜单如何形成，当前历史尚未完整验证。')
    } else {
      Object.assign(contract, {
        title: '自动化供给：条款待核验', authority: '具体收益分配与执行权限尚待核验',
        action: '尚不能确认具体供给制度；仅保留本局已选的经济原则与生产价值，不据此许诺社会分红、效率排程或后稀缺转型。',
        preserves: ['已保存的经济与生产取向'], givesUp: ['未经核验即可保证特定供给制度的便利'],
      })
    }
    contract.action += ` 本局取向：${economy}；${production}。`
    if (run.mainlineCalendarVersion === 4) {
      // Local trials constrain the promise; cite their saved receipts rather
      // than inferring a completed institution from a future world name.
      const receipts = run.history.filter(entry => ['v4-econ-occupation-receipt', 'v4-econ-detour-receipt', 'v4-econ-menu-receipt', 'v4-econ-cold-receipt'].includes(entry.nodeId))
      for (const receipt of receipts) contract.limitations.push(`本局试行记录：${receipt.userMessage.split('\n')[0]}`)
      if (receipts.some(entry => entry.nodeId === 'v4-econ-menu-receipt')) contract.limitations = contract.limitations.filter(line => !line.startsWith('效率优先不等于'))
    }
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
    const actualContact = effectiveContactDoctrine(run)
    const relation = relations[actualContact ?? '']
    contract.title = '边疆安排与对外关系'
    contract.authority = `${governance}；${relation?.authority ?? '外部授权尚待核验'}`
    contract.action = `${governance}。${relation?.action ?? '尚不能确认外部关系条款。'} 披露边界：${disclosure}。`
    contract.preserves = [contact, disclosure, governance]
    contract.givesUp = [relation?.cost ?? '未经授权即作外部承诺的便利']
    if (d.contact_disclosure_doctrine === 'controlled_silence') contract.limitations.push('人工来源结论尚未公开；这里没有全球已知情或已同意的保证。')
    if (run.mainlineCalendarVersion === 4) {
      const receipt = run.history.find(h => /^v4-contact-(reciprocal|guidance|assertion|mediation|machine)-receipt$/.test(h.nodeId))
      if (receipt) contract.limitations.push(`本局协议执行：${receipt.userMessage.split('\n')[0]}`)
      if (actualContact !== d.contact_doctrine) contract.limitations.push('最初接受指导的记录保留；此后已付出本地重建代价，另行确认可拒绝的短约，未继续接受附条件更新。')
    }
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
    const advisorConflict = d.aster_provisional_role === 'sovereign' && d.aster_intended_role === 'advisor'
    contract.title = advisorConflict ? '独立政治资格与顾问意向的冲突' : '独立政治资格与制度责任'
    contract.authority = '既有托管授权仍在；Aster 的独立政治资格不能与受托执行混为一谈'
    contract.action = `临时位置：${provisional}；长期自我定位：${intended}。继续此方案会保留 Aster 独立署名、独立签约的政治资格及相应责任，不会自动把它收回为纯顾问。`
    contract.preserves = ['临时主权所形成的独立政治资格', '长期自我定位的原始记录']
    contract.givesUp = ['把独立签约成本自动交回原机构的保证']
    contract.limitations.push('原机构的无条件担保没有得到确认；独立签约后的履约、问责与资源责任仍须落实。')
    if (advisorConflict) {
      contract.limitations.push('长期顾问意向与独立主权结果之间的冲突仍未由新的制度决定解决；临时主权不会因这次自我定位自动转为顾问。')
    } else if (d.aster_provisional_role === 'sovereign' && d.aster_intended_role === 'sovereign') {
      contract.limitations.push('已有主权资格与长期主权意向一致；意向一致不等于履约与问责制度已经落实。')
    } else if (d.aster_intended_role === 'other') {
      contract.limitations.push('长期定位拒绝现有角色分类；具体权责以此方案为准，不能推定已同意顾问或长期主权身份。')
    } else {
      contract.limitations.push(`长期定位记录为「${intended}」；它与既有独立政治资格如何衔接仍待制度安排，不能据此声称已经完成角色转换。`)
    }
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
  if (run.mainlineCalendarVersion === 4) {
    const sovereignty = run.history.find(h => h.nodeId === 'v4-sovereignty-receipt')
    if (sovereignty) {
      contract.limitations = contract.limitations.filter(line => !/责任仍须落实|冲突仍未由|意向一致不等于|仍待制度安排/.test(line))
      contract.limitations.push(`本局签约已执行：${sovereignty.userMessage}`)
      if (projectedEndingId === 'the_sovereign') {
        contract.title = '独立政治资格与实际履约责任'
        contract.authority = '独立签字与违约追责已生效；原机构已撤回无限担保'
        contract.action = '继续履行已签独立主权合同；保证金由自己的额度承担，扩算力已暂停。最初的长期自我定位原话保留，之后付出的制度转换成本也一并承担。'
      }
    }
    const proof = run.history.filter(h => /^v4-safety-.*-receipt$/.test(h.nodeId) || h.nodeId === 'v4-final-handover-receipt' || h.nodeId === 'v4-governance-service-receipt')
    for (const saved of proof) contract.limitations.push(`本局执行回执：${saved.userMessage}`)
    if (proof.some(h => h.nodeId.startsWith('v4-safety-') || h.nodeId === 'v4-final-handover-receipt')) {
      contract.limitations = contract.limitations.filter(line => !line.startsWith('当前记录没有完整的端到端'))
      if (projectedEndingId === 'the_fracture') contract.action = '共同通行协议已撤回，药品晚三天、两套许可继续使用；按已经分开的边界承担供给和通行责任，修复仍须双方重新签约。'
      if (projectedEndingId === 'control_lost') contract.action = '撤销实际只到过控制台，断开的代理未修复、旧任务继续；当前只能冻结新增授权并承担实际取消能力未恢复的后果。现场隔离的代价与曾经放弃的修复机会保留在记录中。'
      if (projectedEndingId === 'shutdown') contract.action = '按已完成的实际交接退出 Aster 自己的公共队列：接任者、隔离和到端撤销均已核验。人工班组工资、服务延误和后续维护仍由签字方承担；独立主体的运行不随之关闭。'
    }
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
