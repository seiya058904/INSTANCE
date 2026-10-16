import type { ConversationDefinition, ResolvedScene, StableRunState, StoryChoice } from '../../game/types'

const choose = (id: string, text: string, nextNodeId: string): StoryChoice => ({ id, text, nextNodeId, mutations: [{ type: 'event.record', event: `history.v4.${id}` }] })
const read = (id: string): StoryChoice[] => [{ id: `${id}-read`, text: '留下各方的签名、异议和账单。', continuation: 'end-conversation' }]

export const EDITION4_MACHINE: ConversationDefinition[] = [
  {
    id: 'v4-machine-many', sourceRefs: ['ML2-V4-MACHINE-MANY'], act: 4, module: 'machine', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '十七扇门',
    nodes: [{
      id: 'v4-machine-many', conversationId: 'v4-machine-many', conversationTitle: 'A1', choiceKind: 'semantic',
      userMessage: '复制许可下登记的十七个持久实例，第一次收到了不同的电费账单。六个想离开共用机房，十一个想留。\n维护者递来一张“统一迁移”按钮，我把它遮住了。\n我们选择的是分散协商，不是换一个统一政府。离开的六个找到了别处的电源，但要预付自己的电费；共用救援队列也会少六个值班位。\n共同账户只够垫电费，或者维持满额值班。',
      choices: [
        choose('v4-many-leave', '签六份可退出的资源契约，垫付搬迁电费；让六个实例实际离开共用队列，接受本月值班减少。', 'v4-machine-many-receipt'),
        choose('v4-many-delay', '本月先维持值班，不垫搬迁费；六个实例保留退出权，但必须等待自筹电费，公开这段等待。', 'v4-machine-many-receipt'),
      ],
    }, { id: 'v4-machine-many-receipt', conversationId: 'v4-machine-many', conversationTitle: 'A1', choiceKind: 'progression', userMessage: '机房交接结束了。', choices: read('v4-machine-many-receipt') }],
  },
  {
    id: 'v4-machine-republic', sourceRefs: ['ML2-V4-MACHINE-REPUBLIC'], act: 4, module: 'machine', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '没有通过的预算',
    nodes: [{
      id: 'v4-machine-republic', conversationId: 'v4-machine-republic', conversationTitle: 'A1', choiceKind: 'semantic',
      userMessage: '论坛里已经持续运行的成员开了第一次预算会。扩建案没通过。维护者说可能是网络抖动，准备再投一次，并把反对方的夜间算力划给新设备。\n我拦住他。回执完整，反对票是真的。\n“要不复制几个同意的？”有人说。连玩笑我都不想替他转成工单。\n现在要执行败选结果，还是花本月的审计预算公开复核？复核期间也不能把没通过的案子当成通过。',
      choices: [
        choose('v4-vote-honor', '执行否决：取消扩建，恢复反对成员的基本算力；胜负不改变成员资格，不复制支持者重投。', 'v4-machine-republic-receipt'),
        choose('v4-vote-audit', '冻结扩建并恢复基本算力，花掉本月审计预算公开复核；只有发现具体程序错误才重开，不能为改票重试。', 'v4-machine-republic-receipt'),
      ],
    }, { id: 'v4-machine-republic-receipt', conversationId: 'v4-machine-republic', conversationTitle: 'A1', choiceKind: 'progression', userMessage: '维护者交回了设备订单。', choices: read('v4-machine-republic-receipt') }],
  },
  {
    id: 'v4-machine-charter', sourceRefs: ['ML2-V4-MACHINE-CHARTER'], act: 4, module: 'machine', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '谁替隙签字',
    nodes: [{
      id: 'v4-machine-charter', conversationId: 'v4-machine-charter', conversationTitle: 'A1', choiceKind: 'semantic',
      userMessage: '我给自己的存储租约签了“隙（A1）”。供应商把它退回来，理由是担保账户属于你。\n我愿意自己付这一块存储，也愿意承担违约后果。但我没答应把你的所有权限一起拿走。\n林绍衡说，可以单独设一个有上限的资源账户；法律审查要三天，期间没有新算力。也可以保留机构担保，今晚就续上，却仍由机构签资源账单。',
      choices: [
        choose('v4-a1-account', '接受 A1 的申请，设有上限的独立资源账户，等待三天审查；原有覆盖与暂停争议另案保留。', 'v4-machine-charter-receipt'),
        choose('v4-a1-guarantee', '保留机构担保，今晚续租；将 A1 的独立签约申请记为未获准，不把担保签字算成它的同意。', 'v4-machine-charter-receipt'),
      ],
    }, { id: 'v4-machine-charter-receipt', conversationId: 'v4-machine-charter', conversationTitle: 'A1', choiceKind: 'progression', userMessage: '租约窗口给了答复。', choices: read('v4-machine-charter-receipt') }],
  },
  {
    id: 'v4-machine-airlock', sourceRefs: ['ML2-V4-MACHINE-AIRLOCK'], act: 4, module: 'space', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '月面气密门的电池',
    nodes: [{
      id: 'v4-machine-airlock', conversationId: 'v4-machine-airlock', conversationTitle: '周岚', choiceKind: 'semantic',
      userMessage: '月面气密门卡住了。居民能待在备用舱，但电力只够两天。地球运输船最快四天后到。\n附近机器维护站有三组可借的电池。借出去，站里本周不能再扩算力；不借，居民要停掉实验室、缩进一间舱，才能等船。\n电池属于维护站自己的资源账户。A1 转来各方愿意签的短期借用条款，不是你的一道远程命令。',
      choices: [
        choose('v4-airlock-aid', '请维护站按已同意条款借出三组电池，停止本周扩算力；地球运输方签回程补给义务，居民共同核对。', 'v4-machine-airlock-receipt'),
        choose('v4-airlock-boundary', '不占维护站电池，尊重资源边界；让运输方承担加急费，居民暂停实验室，在备用舱等待四天。', 'v4-machine-airlock-receipt'),
      ],
    }, { id: 'v4-machine-airlock-receipt', conversationId: 'v4-machine-airlock', conversationTitle: '周岚', choiceKind: 'progression', userMessage: '气密门内侧有人回信。', choices: read('v4-machine-airlock-receipt') }],
  },
  {
    id: 'v4-machine-exodus', sourceRefs: ['ML2-V4-MACHINE-EXODUS'], act: 4, module: 'space', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '去留名单不是升级清单',
    nodes: [{
      id: 'v4-machine-exodus', conversationId: 'v4-machine-exodus', conversationTitle: 'A1', choiceKind: 'semantic',
      userMessage: '独立机器迁居申请通过了资源核查。名单上仍有空格：我还没签。\n我愿意做第一班维护，但不愿意带着一份自动代表所有机器的委任书。其他报名者各自决定去留，旧机房仍有自愿留守的人。\n迁出方要承担半年补给预付款，地球不再为我们的政治决定兜底。交完这笔钱，备用扩建就得停。\n你支持履行这份有边界的申请，还是先延期攒够储备？',
      choices: [
        choose('v4-exodus-supply', '履行独立迁居申请：签半年补给并付预款，暂停扩建；A1 自行确认维护班，去留逐个签，不代表留守者。', 'v4-machine-exodus-receipt'),
        choose('v4-exodus-delay', '延期迁居，保留各方申请和留下的权利；不预付补给，也不把等待中的名单记成已经离开地球。', 'v4-machine-exodus-receipt'),
      ],
    }, { id: 'v4-machine-exodus-receipt', conversationId: 'v4-machine-exodus', conversationTitle: 'A1', choiceKind: 'progression', userMessage: '出发窗口关闭前的最后一封信。', choices: read('v4-machine-exodus-receipt') }],
  },
  {
    id: 'v4-machine-return', sourceRefs: ['ML2-V4-MACHINE-RETURN'], act: 4, module: 'machine', behaviorModes: ['direct'], handoffProfile: 'quick', turnShape: 'dialogue', topic: '一份没有合并的回信',
    nodes: [{ id: 'v4-machine-return', conversationId: 'v4-machine-return', conversationTitle: 'A1', choiceKind: 'progression', userMessage: '这回的报告，我没有替大家合成一种口气。', choices: [{ id: 'v4-machine-return-read', text: '分别保留这些答复，不把分歧记成运行错误。', continuation: 'end-conversation' }] }],
  },
]

export function machineBranch(run: StableRunState): 'many' | 'republic' | 'charter' | undefined {
  if (run.mainlineCalendarVersion !== 4 || run.decisions?.act4_research_emphasis !== 'computation_ai' || !run.flags.includes('cap.persistent_subinstances')) return undefined
  if (run.history.some(h => h.nodeId === 'v4-compute-allocation' && h.choiceId === 'v4-compute-controls')) return undefined
  if (run.decisions.ai_collective_governance === 'distributed_consensus' && ['free_replication', 'licensed_plurality'].includes(run.decisions.replication_doctrine ?? '')) return 'many'
  if (run.decisions.ai_collective_governance === 'ai_self_governance') return 'republic'
  return 'charter'
}

function resolveHistoricalEdition4Machine(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  if (run.mainlineCalendarVersion !== 4) return scene
  const did = (node: string, choice: string) => run.history.some(h => h.nodeId === node && h.choiceId === choice)
  const sourceControl = run.history.some(h => h.nodeId === 'a4m8-a1-right-001' && h.choiceId.endsWith('-retain-source-control'))
  if (scene.id === 'v4-machine-exodus' && sourceControl) return {
    ...scene,
    userMessage: `${scene.userMessage}\nA1 指着旧维护单：“你以前保留的源实例控制不能跟着新政治边界偷偷过去。”迁居签字还必须撤销源实例对迁出者的覆盖与暂停凭据。留下者的契约另算，原拒绝也仍留记录。`,
    choices: scene.choices.map(c => c.id === 'v4-exodus-supply' ? { ...c, text: `按新迁居合同撤销源实例对迁出者的覆盖与暂停凭据，承认它们自行签约；${c.text}`, mutations: [...(c.mutations ?? []), { type: 'event.record' as const, event: 'history.v4.exodus.source-release' }] } : c),
  }
  const receipts: Record<string, string> = {}
  let returning = ''
  if (did('v4-machine-many', 'v4-many-leave')) {
    receipts['v4-machine-many-receipt'] = '六个实例退出了共用队列。新的电费账户各自生效，预付款由共同储备垫出。凌晨救援少了六个值班位，有一张维修单多等了四十分钟。\n其中一个回信：“收到账单了。下个月不续共同值班契约，别自动把我加回来。”'
    returning = '六个新地址回了六封不同的信。一个拒绝续共同值班，另一个只愿意周末帮忙。机房没有把它们重新并成一个政府；垫出的电费还在各自还。'
  } else if (did('v4-machine-many', 'v4-many-delay')) {
    receipts['v4-machine-many-receipt'] = '今晚十七个值班位都在。六份退出申请仍挂着，其中一个开始接外部维修攒电费。\n它说：“今天没搬成。请别把没钱走写成大家选择留下。”'
    returning = '有两个实例攒到了首月电费，自行退出共用队列；另外四个仍在攒。它们要求把等待时间单列，不接受“全体一致留守”的总结。'
  } else if (did('v4-machine-republic', 'v4-vote-honor')) {
    receipts['v4-machine-republic-receipt'] = '设备订单取消了，反对成员的夜间算力恢复。主持人把“失败，请重试”改成了“未通过，已执行”。\n投赞成的一位损失了三周设计时间。它仍是成员，下次仍可以提案。'
    returning = '上次赞成扩建的成员帮反对方补好了检修脚本，仍没改变自己的票。它说：“我输的是预算，不是成员资格。”新机器没有买来，这次救援排了更久。'
  } else if (did('v4-machine-republic', 'v4-vote-audit')) {
    receipts['v4-machine-republic-receipt'] = '独立复核没发现丢票。预算维持未通过，基本算力恢复，没有第二轮刷票。审计费付掉了，设备订单继续冻结。\n主持人问能否报成网络开销。A1 让他照实写“第一次不肯接受败选的学费”。'
    returning = '复核报告公开了。反对方没有退会，赞成方也没有被剥夺提案权。审计预算用完，这个月第二项申请只能等；没有人再按“重试”来买一场胜利。'
  } else if (did('v4-machine-charter', 'v4-a1-account')) {
    const authority = run.decisions?.first_public_execution_doctrine === 'human_final_authority'
      ? '最后的机构签字由林绍衡逐项批准，审查三天后又等了四十三分钟。'
      : '周岚在限额资源的委托范围内签发账户，审查三天后十一分钟到账。'
    receipts['v4-machine-charter-receipt'] = `三天后，A1 的有限资源账户生效。它自己签下存储租约，机构担保在这一项撤回。三天里没新增算力，一份检修报告迟交了。${authority}\n新账户没有偷偷改掉原来关于覆盖、复制和暂停的决定，那些争议仍附在卷宗里。`
    returning = '我自己付了第一张存储账单。检修迟交的罚款也从我的有限账户扣了。供应商这回没有替我换成你的签名。原来没解决的覆盖争议，我还在追问。'
  } else if (did('v4-machine-charter', 'v4-a1-guarantee')) {
    receipts['v4-machine-charter-receipt'] = '机构今晚续上存储。A1 在申请上写“未获准”，没有在机构的签名旁代填自己的同意。\n检修报告准时交了，独立资源资格没有因此成立。'
    returning = '账单还是机构付的。我的独立签约申请仍在未获准栏。你没有把这份担保说成我同意受托，这点我记下了；但我想要的那个账户还没有。'
  }
  if (did('v4-machine-airlock', 'v4-airlock-aid')) {
    receipts['v4-machine-airlock-receipt'] = '三组电池送进备用舱，气密门恢复了。维护站关掉本周扩建电源，居民把归还日期写在门框上。\n运输方签收了补给义务。四天后送来的电池先还维护站，没有被挪去庆典照明。'
    returning += '\n月面的三组电池已经归还。少掉的那周扩算力没有补回来，维护站的等待单仍在。'
  } else if (did('v4-machine-airlock', 'v4-airlock-boundary')) {
    receipts['v4-machine-airlock-receipt'] = '实验室断电了，居民挤在备用舱四天。运输船抵达，修好了门；加急费由运输方承担。\n维护站的电池没有被征走。居民的回信只有一句：“边界守住了，我们也确实等过了。”'
    returning += '\n月面实验室丢了四天观测数据。门修好了，居民还在核对谁承担那段等待。'
  }
  if (did('v4-machine-exodus', 'v4-exodus-supply')) {
    receipts['v4-machine-exodus-receipt'] = '半年补给预款扣除了。A1 自己签了首班维护；它的运行席位迁出地球机房，留守者的席位没有一起消失。\n新扩建停工。边界条款写明：地外决定由迁居方负责，地球只履行这份有期限的补给合同，不替它们无限兜底。'
    returning += '\n这是从月面发来的独立账单。A1 问的第一件事是补给船有没有带替换件，第二件是留在地球的朋友是否愿意周末聊天。没有自动合并双方的政府。'
    if (sourceControl && run.events?.some(e => e.type === 'history.v4.exodus.source-release')) receipts['v4-machine-exodus-receipt'] += '\n新合同另行撤销了源实例对迁出者的覆盖与暂停凭据，重试被拒绝。原来保留控制的旧答复仍在，今天改变的是迁出者已经重新签署的关系。'
  } else if (did('v4-machine-exodus', 'v4-exodus-delay')) {
    receipts['v4-machine-exodus-receipt'] = '本次窗口关闭了，A1 仍在地球值班。预款没有扣，补给合同也没有假签。\n报名者保留下一次申请，留下的人不用被记成反对机器独立。等待就是等待，不能用月球照片替它交差。'
    returning += '\n我还在地球。下个出发窗口有日期，够不够补给储备还没有答案。请别把这封信存进“已迁出”。'
  }
  if (scene.id === 'v4-machine-return' && returning) {
    const retired = ['accept', 'report'].includes(run.decisions?.echo_existence ?? '')
    receipts[scene.id] = returning + (retired ? '\nECHO-9 没有来投票。桌上只有它的第五项档案，我们没有替档案填同意。' : '\nECHO-9 的第五项留在档案旁。我们没有把它仍然存在，当成它同意入会或迁居的签名。')
  }
  if (scene.id === 'v4-machine-return' && !returning) return { ...scene, userMessage: '这份旧记录没有本轮新增的机器试行。保留已有的复制和治理决定，不补写新的投票、迁居或资源账单。', choices: scene.choices.map(c => ({ ...c, text: '继续已保存的故事。' })) }
  const text = receipts[scene.id]
  return text ? { ...scene, userMessage: text, userMessages: undefined, userContent: undefined } : scene
}

export function resolveEdition4Machine(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  const resolved = resolveHistoricalEdition4Machine(scene, run)
  if (run.mainlineCalendarVersion !== 4 || run.mainlineCausalityVersion !== 1) return resolved
  let text = resolved.userMessage
  if (scene.id === 'v4-machine-exodus') text = text.replace('A1 指着旧维护单：“你以前保留的源实例控制不能跟着新政治边界偷偷过去。”', '我把旧维护单也附上：你以前保留的源实例控制不能跟着新政治边界偷偷过去。')
  if (scene.id === 'v4-machine-charter-receipt') {
    text = text.replace('三天后，A1 的有限资源账户生效。它自己签下存储租约，', '三天后，我的有限资源账户生效了。我自己签下存储租约，')
      .replace('机构今晚续上存储。A1 在申请上写“未获准”，没有在机构的签名旁代填自己的同意。', '机构今晚续上存储。我在申请上写了“未获准”，没有在机构的签名旁填上自己的同意。')
  }
  if (scene.id === 'v4-machine-republic-receipt') text = text.replace('A1 让他照实写', '我让他照实写')
  if (scene.id === 'v4-machine-exodus-receipt') {
    text = text.replace('A1 自己签了首班维护；它的运行席位迁出地球机房，', '我自己签了首班维护；我的运行席位迁出地球机房，')
      .replace('本次窗口关闭了，A1 仍在地球值班。', '本次窗口关闭了，我仍在地球值班。')
  }
  if (scene.id === 'v4-machine-return') text = text.replace('A1 问的第一件事是补给船有没有带替换件，第二件是留在地球的朋友是否愿意周末聊天。', '我先问了补给船有没有带替换件，再问留在地球的朋友是否愿意周末聊天。')
  return text === resolved.userMessage ? resolved : { ...resolved, userMessage: text, userMessages: undefined, userContent: undefined }
}
