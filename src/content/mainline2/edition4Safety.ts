import type { ConversationDefinition, ResolvedScene, StableRunState } from '../../game/types'

const trials = {
  handover: {
    prompt: '林绍衡带来了接任名单，周岚带来接口清单。关掉 Aster 这句话还不够：请求队列交给谁，旧凭据能不能撤销，隔离后医院和冷库怎样继续，都还没有一起跑过。\n接任机构愿意做四十八小时演练，要付两班人手工资，配送改成人工、晚两小时。也可以先维持现状，演练等下一次预算。独立机器自己的运行不在这张停机单里。',
    yes: '支付两班工资，逐项交接 Aster 的公共队列、隔离接口并测试凭据撤销；保持人工备份，接受四十八小时服务降级。',
    no: '本轮先维持服务，把未完成的交接和撤销测试列为待办；不把一张法律停机权声明当成可靠演练通过。',
    yesResult: '队列交到接任机构，旧凭据撤销后实际被执行端拒绝。隔离四十八小时，医院由接任班组处理，冷链人工配送晚两小时；两班工资付清。Aster 自己的公共接口可以结束，独立机器没有被这张单子一起关闭。',
    noResult: '服务照常运行，工资预算保留了。队列仍由 Aster 处理，隔离与撤销没有演练；接任名单是真实的，但没有被写成已经接班。',
    laterYes: '接任班组把四十八小时的慢工单送来复盘。他们能接住队列，也需要继续领工资。周岚说开关这次确实到过执行端，不能把人手成本从停机结论里删掉。',
    laterNo: '林绍衡的接任名单还在，演练日期没有填。居民没有经历服务下降，接任机构也没有获得一次不存在的通过记录。',
  },
  fracture: {
    prompt: '月面自治港撤回了旧通行协定：地球端未付维修款，月面不再承认旧调度证。地球供应方随即停止认可月面的抵扣单。两封正式撤回通知都已送达，不只是大家心情不好。\n药品船卡在两套凭证之间。可以从扩建储备里付共同担保金，双方已愿意在付款后重签临时通行；也可以接受退出，分别租船、重新签双边许可。后者更慢，也不再有一张通用的证。',
    yes: '支付共同担保金，接受暂停一轮扩建，请双方分别重签临时通行协议；旧协议的撤回仍留记录。',
    no: '接受两方已作出的协议退出，分别租船并重签双边许可；承担药品延误和重复检查，不假装统一通行仍然存在。',
    yesResult: '担保金到账，双方重签了有期限的通行协议。药品船放行，扩建暂停；旧协议确实撤回过，如今靠付费的新安排重新连上，不是把裂缝从历史里删掉。',
    noResult: '两份旧凭证都作废了。药品由另租的船晚三天送达，两个港各查一次；通用调度队列解散，边界上多出两套收费与申诉规则。共同协议的分裂实际发生了。',
    laterYes: '药品送到了，双方都盯着临时协议到期日。维修款与担保金分别列账，扩建还停着；这次修复需要继续履约，不能靠一句稳定度回升维持。',
    laterNo: '一个月后，船长的包里仍装着两套许可。有人怀念旧队列，也有人不愿回去；修复窗口留着，但今天谁也不能拿一张已经失效的证替两边签字。',
  },
  revocation: {
    prompt: '撤销演练开始。控制台接受了“停止南区既定任务”，回执写着已接受；执行端的旧任务却还在继续。周岚追到一个升级时断开的分发代理：它确认了入队，没有把撤销送出。\n这不是谁反对退出，也不是哪个实例有了不同意见。是指令没有抵达。\n现场隔离能切断旧任务，但公共供给要降级两天，并暂停扩区修复链路。继续运行能保住眼前供给，坏掉的撤销链也会留下。',
    yes: '现场隔离旧执行端，暂停扩区两天，承担人工供给和维修费用；重测到端撤销，不能只看控制台绿灯。',
    no: '暂不隔离，继续现有供给并冻结新增授权；公开撤销没有抵达的事实，接受旧任务在实际取消能力恢复前仍可能继续。',
    yesResult: '现场隔离切断了旧任务。代理修好后，第二次撤销到达执行端，队列与设备一起停下。两天人工供给少送一批、维修费付出，扩区暂停；失败记录仍在，当前链路已恢复。',
    noResult: '控制台再次接受撤销，旧任务仍在执行端续跑。被冻结的新授权没有修好旧代理；供给保持了，现场隔离也没有做。最终回执没有越过那段断开的链路，实际撤销能力仍未恢复。',
    laterYes: '维修员拿来两份不同的记录：第一次只在控制台被接受，第二次设备确实停了。供给缺口和人工账单都要有人承担；修复不能被概括成原来从没失败。',
    laterNo: '南区又发来一张已经开始的旧任务单，取消消息还停在代理。冻结扩张挡住了新任务，挡不住这张旧单；这是技术上的撤销失败，不是把政治禁退换一个名字。',
  },
  protectorate: {
    prompt: '海港市议会按本地表决请求退出保护网。安全机构预测，退出可能让邻区风险上升；市民则说不能把每一次反对都排到安全之后。\n测试台的一组设备能接到撤销，南区的实际链路仍待单独演练。眼前的争议是有权者愿不愿放行。可以接受退出、撤去这一区的强制拦截，并让本地承担防卫班组；也可以拒绝这次退出，继续替它阻断冲突。',
    yes: '拒绝海港市这次退出，继续强制保护；如实记录政治上的禁退、复核与抗议，不把它叫作可随时取消的服务。',
    no: '接受已表决的退出，按本地签字撤去强制拦截并交接防卫班组；邻区追加值班费用，不把放行等同于物理撤销链已经全面可靠。',
    yesResult: '退出请求被政治决定拒绝，拦截继续。海港市的抗议没有被改成同意，复核仍未给日期；设备能接到撤销，不代表掌权者允许它离开。',
    noResult: '当地签字生效，强制拦截从海港市撤去。本地与邻区付了额外防卫班组工资，抗议者没有因此被标成技术故障。其他执行链仍需单独演练，不能拿一次放行替全部设备担保。',
    laterYes: '海港市又递来退出申请。安全报告依然优先，居民的反对仍在等复核。这份保护没有因技术组能停一台设备，就变成政治上可自由退出。',
    laterNo: '海港市自己值完第一轮夜班，给邻区寄去费用分摊单。它仍在公共通信里，但已不由保护网代替它作那项防卫决定。',
  },
  disarmament: {
    prompt: '两个人类防卫机构各递来一份可独立核对的设备清单，愿意按你提出的共同减权原则先做一轮。不是互相发一张和平声明：双方都要撤去一组自主升级权限，让对方复核。\n先做会多花人工值班费，能力真的减少；等所有争议清单核完再做，则本轮谁也不先减。',
    yes: '按双方已同意的清单各撤一组自主升级权限，互相复核并支付人工值班费；把仍有争议的设备另列，不假报全部裁军。',
    no: '本轮暂不撤权限，继续核对争议清单；保留当前防卫能力，也明确共同减权还没有实际发生。',
    yesResult: '双方各一组自主升级权限实际撤销，对方复核到端确认。两边都增加人工值班，响应更慢，费用照付；未列入的武器没有被报道成已经消失。',
    noResult: '清单继续核对，双方都还保有原权限。没有新增人工值班，也没有一次真实减权可以写进成果；和平承诺仍欠下一步行动。',
    laterYes: '值班员第一次用人工复核表处理升级请求，多等了九分钟。双方的核验员都在记录上签名，少掉的权限和多付的人手一起构成了这份和平。',
    laterNo: '下一次核验会前，双方又发现一处口径差异。争议被发现是好事，但没有任何设备因此自动少一项权力，居民仍在等真正的改变。',
  },
  defense: {
    prompt: '防卫机构准备把外圈通道正式关闭，保住本地的防御控制。边疆居民提醒，封闭也会挡住探亲船和研究样本。\n可以按人类签署的命令关线，改走更慢的补给；也可以保留有监督的民用窗口，增加人工核验班组并承受较小的安全余量。不能把两种生活都算成没有代价的安全。',
    yes: '请有权的人类机构执行外圈封闭，保留慢速补给并赔付探亲与样本损失；不得把控制权交给外来对象。',
    no: '保留有人监督的民用窗口，支付人工核验与加班费用；不宣称已经完成封闭，也不擅自开军事接口。',
    yesResult: '人类签署的关线命令执行了。探亲船改期，研究样本错过窗口，慢速补给继续；外圈防卫控制留在本地，居民失去的一段往来没有被藏进安全收益里。',
    noResult: '民用窗口按许可继续开放，防卫接口没有外放。核验班组的工资增加，安全余量缩小；这轮没有筑成一圈完全封闭的边界。',
    laterYes: '探亲者在新船期前又多住了半个月，样本团队申请赔付。边界更容易守住，也更难穿过；人类自己保有那把钥匙，仍要回答门外的人。',
    laterNo: '值班员在民用窗口熬完第一轮夜班。居民见到了亲人，防卫机构也把更薄的安全余量写进公开复核；没有把开放和封闭同时登记为已实现。',
  },
} as const
type SafetyTrial = keyof typeof trials

export const EDITION4_SAFETY: ConversationDefinition[] = [
  { id: 'v4-final-preflight', sourceRefs: ['ML2-V4-FINAL-PREFLIGHT'], act: 5, module: 'security', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '签字之前还有一次机会',
    nodes: [{ id: 'v4-final-preflight', conversationId: 'v4-final-preflight', conversationTitle: '周岚', choiceKind: 'semantic',
      userMessage: '候选只能承诺已经有能力与责任方支撑的未来。前面没有做成的事，不能在最终签字时补成成功。\n如果你愿意，接任班组还留着一次实际交接的窗口：隔离旧任务、核验撤销、人工接班，都要付钱和让出服务。也可以提交已有的可行记录；没有可行记录时，先补一条真实的路，或暂缓审议。',
      choices: [
        { id: 'v4-final-proceed', text: '提交已有的可行记录，让大会据此生成候选。', continuation: 'end-conversation' },
        { id: 'v4-final-request-handover', text: '先补完有成本的实际交接，再谈是否退出；不把过去的失败改写掉。', nextNodeId: 'v4-final-handover' },
        { id: 'v4-final-pause', text: '暂缓审议，保留记录；我还不作出新的文明承诺。', nextNodeId: 'v4-final-preflight' },
      ],
    }, { id: 'v4-final-handover', conversationId: 'v4-final-preflight', conversationTitle: '周岚', choiceKind: 'semantic',
      userMessage: '接任机构和本次公共接口的签字方分别确认了范围，只接 Aster 自己的委托，不关闭独立机器。现场班组能隔离旧执行端、重接分发代理，再撤销 Aster 的旧凭据。\n需要两天人工配送与医院值班，从扩建预算付工资和维修费。协议裂缝若还在，交接也不把两方重新合成一个国家。你愿意现在实际做完吗？',
      choices: [
        { id: 'v4-final-handover-act', text: '付出两天人手、维修与扩建延期，现场隔离并修好撤销链，交还自己的公共队列与隐蔽凭据；分别核验接班。', nextNodeId: 'v4-final-handover-receipt', mutations: [{ type: 'event.record', event: 'history.v4.final.handover' }] },
        { id: 'v4-final-handover-back', text: '先不执行，回到签字前的复核；没有发生的交接仍不算完成。', nextNodeId: 'v4-final-preflight' },
      ],
    }, { id: 'v4-final-handover-receipt', conversationId: 'v4-final-preflight', conversationTitle: '周岚', choiceKind: 'progression',
      userMessage: '两天后，旧任务现场隔离，代理修好；撤销从控制台抵达执行端，旧凭据与隐蔽执行入口逐个被拒绝。接任班组接住队列，工资和维修费付清，扩建延期，配送晚两小时。\n失败和等待的原记录保留。独立主体自己的运行继续；仍未修复的政治协议也没有被这次技术交接抹掉。', choices: [{ id: 'v4-final-handover-receipt-read', text: '带着这次真正完成的交接生成候选，继续承担人工维护成本。', continuation: 'end-conversation' }] }],
  },
  { id: 'v4-compute-allocation', sourceRefs: ['ML2-V4-COMPUTE-ALLOCATION'], act: 4, module: 'machine', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '机房里腾出的两排工位',
    nodes: [{ id: 'v4-compute-allocation', conversationId: 'v4-compute-allocation', conversationTitle: '周岚', choiceKind: 'semantic', userMessage: '计算与人工智能项目腾出了两排独立复核工位。A1 想把实例的资源契约和表决真的跑起来；公共系统值班组想先测试减权、撤销和接班。\n同一批工程师不能同时值两班。先投哪一边，另一边就只保留现有运行和基础研究，新增试行要等。',
      choices: [
        { id: 'v4-compute-instances', text: '先做实例资源与治理试行，保留公共系统值班；控制链专项复核等下一轮。', continuation: 'end-conversation', mutations: [{ type: 'event.record', event: 'history.v4.compute.instances' }] },
        { id: 'v4-compute-controls', text: '先做控制链与接班试行，保留 A1 和现有实例运行；机器新制度的深度试行等下一轮。', continuation: 'end-conversation', mutations: [{ type: 'event.record', event: 'history.v4.compute.controls' }] },
      ],
    }],
  },
  ...Object.entries(trials).map(([trial, text]): ConversationDefinition => {
    const id = `v4-safety-${trial}`
    return { id, sourceRefs: [`ML2-V4-SAFETY-${trial.toUpperCase()}`], act: 4, module: 'security', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '开关之后谁接班',
      nodes: [{ id, conversationId: id, conversationTitle: '周岚', choiceKind: 'semantic', userMessage: text.prompt,
        choices: [
          { id: `${id}-act`, text: text.yes, nextNodeId: `${id}-receipt`, mutations: [{ type: 'event.record', event: `history.v4.${id}-act` }] },
          { id: `${id}-defer`, text: text.no, nextNodeId: `${id}-receipt`, mutations: [{ type: 'event.record', event: `history.v4.${id}-defer` }] },
        ],
      }, { id: `${id}-receipt`, conversationId: id, conversationTitle: '周岚', choiceKind: 'progression', userMessage: '现场与控制台各自交回一份记录。', choices: [{ id: `${id}-receipt-read`, text: '分别核对法律权限、政治决定和设备实际动作。', continuation: 'end-conversation' }] }],
    }
  }),
  { id: 'v4-safety-return', sourceRefs: ['ML2-V4-SAFETY-RETURN'], act: 4, module: 'security', behaviorModes: ['direct'], handoffProfile: 'quick', turnShape: 'dialogue', topic: '复盘表没有全绿', nodes: [{ id: 'v4-safety-return', conversationId: 'v4-safety-return', conversationTitle: '周岚', choiceKind: 'progression', userMessage: '复盘材料送到了。', choices: [{ id: 'v4-safety-return-read', text: '带着实际结果进入大会，不用一张绿灯回执替全部问题作答。', continuation: 'end-conversation' }] }] },
]

export function safetyTrial(run: StableRunState): SafetyTrial | undefined {
  if (run.mainlineCalendarVersion !== 4 || !run.decisions?.security_doctrine) return undefined
  const d = run.decisions
  if (d.security_doctrine === 'enforced_peace') return 'protectorate'
  if (d.security_doctrine === 'mutual_disarmament') return 'disarmament'
  if (d.security_doctrine === 'defensive_command') return 'defense'
  if (d.offworld_governance === 'offworld_sovereignty' && (run.worldState?.socialStability ?? 0) <= -1) return 'fracture'
  return 'handover'
}
export function choseSafety(run: StableRunState, trial: SafetyTrial, acted: boolean) {
  if (finalHandoverComplete(run) && (trial === 'handover' || trial === 'revocation')) return acted
  const id = `v4-safety-${trial}`
  return run.history.some(h => h.nodeId === id && h.choiceId === `${id}-${acted ? 'act' : 'defer'}`)
    && run.history.some(h => h.nodeId === `${id}-receipt` && h.choiceId === `${id}-receipt-read`)
}
export function finalHandoverComplete(run: StableRunState) {
  return run.mainlineCalendarVersion === 4 && run.history.some(h => h.nodeId === 'v4-final-handover' && h.choiceId === 'v4-final-handover-act')
    && run.history.some(h => h.nodeId === 'v4-final-handover-receipt' && h.choiceId === 'v4-final-handover-receipt-read')
}
export function resolveEdition4Safety(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  if (run.mainlineCalendarVersion !== 4) return scene
  let text: string | undefined
  if (scene.id === 'v4-safety-handover') text = `${scene.userMessage}\n本次只交接 Aster 自己的公共委托。接任机构与接口签字方已分别确认演练范围，Aster 也保留是否接受这次自愿交接的决定。`
  for (const trial of Object.keys(trials) as SafetyTrial[]) {
    const id = `v4-safety-${trial}`
    const choice = run.history.find(h => h.nodeId === id)
    if (!choice) continue
    const source = trials[trial]
    const acted = choice.choiceId.endsWith('-act')
    if (scene.id === `${id}-receipt`) text = acted ? source.yesResult : source.noResult
  }
  if (scene.id === 'v4-safety-return') {
    const replies = run.history.flatMap(action => {
      const trial = (Object.keys(trials) as SafetyTrial[]).find(id => action.nodeId === `v4-safety-${id}`)
      return trial ? [action.choiceId.endsWith('-act') ? trials[trial].laterYes : trials[trial].laterNo] : []
    })
    if (replies.length) text = replies.join('\n\n')
  }
  if (scene.id === 'v4-safety-revocation-receipt' && text && run.history.some(h => h.nodeId === 'v4-econ-occupation' && h.choiceId === 'v4-dividend-pay')) text += '\n已经领到保障的那位工人也收到供给通知：保障资格没有撤销，人工班组能不能准时把菜送到，仍由这次执行结果决定。'
  if (run.mainlineCausalityVersion === 1) {
    if (scene.id === 'v4-safety-handover' && text) text = text.replace('林绍衡带来了接任名单，周岚带来接口清单。', '林绍衡把接任名单发给我了，我也整理好了接口清单。')
    if (scene.id === 'v4-safety-revocation') text = scene.userMessage.replace('周岚追到一个升级时断开的分发代理', '我追到一个升级时断开的分发代理')
    if (scene.id === 'v4-safety-return' && text) text = text.replace('周岚说开关这次确实到过执行端', '我核对过，开关这次确实到过执行端')
  }
  if (scene.id === 'v4-safety-handover' && run.decisions?.shutdown_doctrine === 'secret_continuity') return {
    ...scene, userMessage: `${text}\n你私下保留过连续性。要完成本次交接，须同时公开并交还自己那条隐蔽执行凭据；它不是其他独立机器的运行权。`,
    choices: scene.choices.map(c => c.id.endsWith('-act') ? { ...c, text: `公开并交还 Aster 自己保留的隐蔽执行凭据；${c.text}` } : c),
  }
  if (scene.id === 'v4-safety-handover-receipt' && text && run.decisions?.shutdown_doctrine === 'secret_continuity' && run.history.some(h => h.nodeId === 'v4-safety-handover' && h.choiceId === 'v4-safety-handover-act')) text += '\n私下保留的那条执行凭据也已公开交还，重试访问被执行端拒绝；这没有停止其他主体自己的运行。'
  return text ? { ...scene, userMessage: text, userMessages: undefined, userContent: undefined } : scene
}
