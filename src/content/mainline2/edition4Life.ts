import { futurePivot } from './edition4Pivot'
import type { ConversationDefinition, ResolvedScene, StableRunState } from '../../game/types'

const incidents = {
  archive: {
    title: '资料还不是一个获承认的人',
    prompt: '连续性试验没有取得主体资格。屏幕里还保存着记忆服务，窗口不能假装审查通过了，也不能替老许和关系人重新同意。\n剩下的复核经费可以用来找独立样本，现有服务照常维护；也可以暂停身份研究，把经费用于当前使用者的维护保障。两边都不能把“等证据”记成已经同意上传。',
    yes: '保留现有服务，投入独立样本复核；新的身份认定仍须各方分别答复，不替过去补签。',
    no: '暂停新增身份研究，将余款用于现有服务维护；保留资料和拒绝记录，不把维护许可当成人格认定。',
    yesResult: '独立样本开始复核，现有终端没有被关闭。预算暂时不能用于新增身体改造；登记处仍标“未认定”，没有因此出现一张新的身份证。',
    noResult: '研究扩展停了，维护款支付到了现有服务。原体和关系人的拒绝没有被覆盖；登记表仍是记忆服务，窗口没有为了成就报告补出另一段人生。',
    laterYes: '复核组交回一份仍有分歧的报告。老许收到的是新的询问信，不是追认通知。他可以继续拒绝；经费已经花过，不保证能买到肯定答案。',
    laterNo: '终端的维护账单付清了。新的身份研究还没重开，旧资料也没有被当作同意书。等待的边界和已经发生的拒绝都还在。',
  },
  observation: {
    title: '反对之后还没有席位',
    prompt: '湿地校准队回来，确认有一条“没有意见”其实是拒绝通行。当前制度仍由人类监护或咨询，没有授予新的正式席位。\n工程队已经在等。尊重这次拒绝可以绕行，多铺三公里管线；也可以暂停施工，等独立翻译复核，但居民要再用一周临时供水。不能把调查经费当成已经替参与者签了同意。',
    yes: '按已核验的拒绝绕行，付三公里管线费用；保留监护和代表资格争议，不宣称已建立议会。',
    no: '暂停施工并复核翻译，支付一周临时供水；不在没有同意时继续穿过湿地。',
    yesResult: '工程绕开湿地，预算增加了三公里管线。供水如期接上，正式代表权仍未成立；一次拒绝改变了路线，没有被用来给其他参与者代签。',
    noResult: '机器停在边界外。居民用了七天水箱，独立复核确认那条拒绝；工程要重新谈，原路线没有借等待悄悄开工。',
    laterYes: '校准队带来竣工图，弯出去的三公里还在。参与者的资格听证也还在进行，调查员没有把一件改道的好事写成已经获得全部权利。',
    laterNo: '临时水箱归还了，管线方案还在谈。翻译组把两份相互独立的拒绝记录交给了人类监护方，要求下一次不要再按沉默批准。',
  },
  therapy: {
    title: '汤勺以后的日子',
    prompt: '重新握住汤勺的那位病人申请把设备带回家。她说医院的汤没变好喝，家里的至少能加盐。\n冷链检修暂停了半天送药。今天仅有两台可借设备：都给续用者，排队的人再等一周；留一台给新病人，她就只能白天使用，夜里由女儿照护。\n“功能恢复”那一栏已经打了勾，后面的生活还没有。',
    yes: '让两位续用者把设备带回家，安排人工补药；公开新申请延后一周，不能把排队者也记作获益。',
    no: '留一台给新申请者，病人只在白天用设备；支付女儿的临时照护补贴，承认夜间生活仍需他人帮助。',
    yesResult: '设备真的送到了两户家里，药由人工补送。病人晚上自己端起了碗；队列里有人取消了本周返工安排，多等一周。费用从下一批试点名额扣除。',
    noResult: '新病人拿到一台设备。老病人白天能自己吃饭，女儿夜里仍来照护，补贴到账了，但不替她多出一个晚上。医院没有把两户都报成全天独立生活。',
    laterYes: '她发来一张普通餐桌的照片，没有拍手。队列里的那一位也回信，问一周到了能不能准时拿到设备。医院把两个问题分开答。',
    laterNo: '白天的汤还是她自己喝，晚上由女儿帮忙。她们把补贴收了，也一起要求下一轮别再把“有家人照护”当成多出一台机器。',
  },
  forms: {
    title: '不升级的人也来上班',
    prompt: '岑遥的同事把认知增强同意书退回去了。主管没说要解雇他，只把所有核心项目都标成“增强接口优先”。\n新的身体和认知形式开始出现，拒绝改变的人却快没工作可接。公司愿意另做实际技能考核，要花掉一轮设备预算；也可以暂停这批招募，先让合同审查回来，但空班会增加所有人的夜班。',
    yes: '用实际技能考核替代接口门槛，设备预算承担改造；拒绝增强的人仍能申请核心项目，不替他们签增强同意。',
    no: '暂停带接口门槛的招募并保留现有岗位，等待合同审查；支付空班加班费，不用“自愿”掩盖选择压力。',
    yesResult: '那位同事通过了技能考核，进了核心项目。他没签增强同意，设备采购少了一项。增强者也照常参加考核，没有因为改变身体就被当成作弊。',
    noResult: '招募暂停，现有员工没有因拒绝增强失去岗位。核心项目延后两周，夜班费由公司支付。审查还没回来，谁也没有被默认选择了某种身体。',
    laterYes: '岑遥说两位同事一起改完了工单：一个换了新的感官接口，另一个还是用老键盘。他们争的是排班，没有人被要求先解释自己为什么长成这样。',
    laterNo: '两周后合同审查要求删除接口优先的小字。大家补回了一轮招募，也补交了夜班账单。那位没增强的同事回到原项目，仍可以拒绝下一张同意书。',
  },
  continuity: {
    title: '第三把椅子不是续签',
    prompt: '老许、副本和妻子的独立权利已经过听证。今天三个人分别回答一项新请求：原体不想继续身体试验，副本想租自己的住处，妻子不愿自动续成两段婚姻。\n副本说：“我没有请你替她答应。我只想地址栏别永远写实验室。”\n独立住所要从本期新复制试验扣经费；也可以让他继续住现有终端，等下一期预算。拒绝新试验不撤销已经承认的权利。',
    yes: '分别接受三份回答：停止原体的新试验，给副本独立住所并扣新复制预算，关系人拒绝自动续签；之后的关系由各人再谈。',
    no: '停止原体的新试验，保留副本现有运行与独立资格；住所等下期预算，关系人拒绝仍生效，不把现有记忆当新的同意。',
    yesResult: '身体试验停了。副本拿到自己的地址，租金由削减的新复制试验支付；妻子的登记没有自动多出一个配偶。三把椅子各自留了位置，没有被合成一份“全家同意”。',
    noResult: '身体试验停了。副本仍在现有终端生活，独立住所申请挂在预算队列，运行权没有撤回。妻子按自己的意愿离开听证室，没有被记成不支持副本存在。',
    laterYes: '副本寄来新地址，原体用纸笔回了一封信。妻子约不约下一次见面没有填进系统。他们记得同一场雨，如今有了三个可以分别关上的门。',
    laterNo: '副本又递了住所申请。老许和妻子各自给了私人答复，窗口没有代收成家庭决定。运行还在继续，等待独立生活的预算也确实还没有到。',
  },
  parliament: {
    title: '迁徙季不算旷会',
    prompt: '多物种议会第一次排下季度预算，鸟类代表的迁徙窗口恰好覆盖表决日。主持人提议按人类日历开会，把缺席记成弃权。翻译组确认它们要参与，只是这个月不能留下。\n延会会让一条防洪渠错过施工期；先开听证、把表决延后，则要付一轮远程翻译和临时堤防的费用。',
    yes: '按迁徙调整表决日，出资加固临时堤防；保留鸟类席位，不能把季节性离开算作弃权。',
    no: '先开不作最终表决的听证，支付远程翻译与临时堤防费用；最终预算仍等各方能参与后再定。',
    yesResult: '预算表决延了三周，鸟类席位保留。常设防洪渠错过施工期，临时堤防花掉一部分道路预算；人类街区收到的是施工延期通知，不是免费多元化。',
    noResult: '听证开了，没有人替缺席代表投票。远程意见收入记录，最终预算未锁定；翻译和堤防费用先付，道路翻修缩减。代表参与了程序，也仍有下一次说不的机会。',
    laterYes: '迁徙结束，代表回来先问临时堤防有没有伤到觅食地。人类代表也带来道路延期的账。议会第二次开会，从核对彼此的损失开始。',
    laterNo: '远程译文有一处把“暂不接受”译成“没有意见”，听证记录在表决前改正了。人类街区要求解释翻修缩减，代表没有被当成没有成本的装饰席位。',
  },
  corridor: {
    title: '无主之地也要有人修路',
    prompt: '迁徙通道重新打开，旧地契却还压在登记处。农户问地不再归他单方所有后，谁赔这一季作物；沟渠工问，人类不再当主人是不是也可以不来维修。\n物种翻译组确认通道使用者愿意避开育苗区，但没有答应替人类支付工程费。眼下可以买下通行地役权并设维护基金，或者先租一季绕行地，明年再谈长期责任。',
    yes: '支付旧地契通行补偿，设共同维护基金；按已核验的避让协议开放通道，不把无主写成无人负责。',
    no: '先租一季绕行地并补偿作物损失，暂不宣布永久产权改变；保留通道使用者下一次协商与拒绝的地位。',
    yesResult: '通道按协议开放了，育苗区围栏保留。农户收到通行补偿，沟渠维修由基金支付；今年少修一段观光路。旧地契附上新责任，没有被一句宣言抹掉。',
    noResult: '迁徙群体按已同意的一季绕行方案通过，农户拿到租金。永久地役权未签，明年仍需协商；今年的作物与工程账没有被推给不会填表的一方。',
    laterYes: '第一场雨后沟渠堵了，共同基金付了维修费。农户给翻译组发来一张没有踩进育苗区的足迹照片，旁边是观光路延期的通知。双方都拿得出自己的那一份账。',
    laterNo: '一季租约快到了。通道使用者没有自动被登记成明年的租客；农户和翻译组又约了一次时间，带着今年实际通过的记录重谈。',
  },
  dogs: {
    title: '反对飞盘之后',
    prompt: '地方犬类试点通过的预算草案，把最多的钱拨给了飞盘活动。参与的犬类代表投了反对票：老犬走不上公园台阶。\n翻译审计确认，反对的是预算，不是游戏。承包商说改缓坡就要取消本季活动；重新编一份同时保留两项的小预算，则要等一周，台阶也再挡一周。',
    yes: '执行反对票，取消本季飞盘活动，将预算改为缓坡；新方案由参与者复核，不把反对功能关掉。',
    no: '退回草案，花一周公开重编缩小后的活动与缓坡预算；期间公开等待和通行不便，不能把未通过算成通过。',
    yesResult: '飞盘活动取消，缓坡开工了。承包商退回部分活动预付款，犬类代表复核了坡度；人类照护者要解释为什么今年没有庆典。反对票确实改变了支出。',
    noResult: '原预算没有执行。一周后两项都缩小，缓坡终于开工；那一周仍有人得把老犬抱上台阶。翻译记录把“未通过”留在原草案旁，没有给它补盖赞成章。',
    laterYes: '老犬自己走上了坡。年轻的那只在空活动场找了半圈飞盘，又回来等它。地方预算会收到两条不同意见，下次仍得分别听。',
    laterNo: '新坡道短了一截，活动也少了半天。代表再次提出意见，工作人员这回没说是互动环节。试点的成绩不是从此没人反对，而是那张被退回的预算确实没花出去。',
  },
} as const
type LifeIncident = keyof typeof incidents

// The renewal bridge already paid for the original park's ramp. New trials
// concern a second site; in-flight old choices retain their original receipt.
const secondParkDogs = {
  prompt: '原试点公园的缓坡已经建好，这项成绩留在续期材料里。今天送来的是河西公园另一笔预算：草案把最多的钱拨给飞盘活动，犬类代表投了反对票——这里的台阶仍挡着老犬。\n独立翻译审计确认，反对的是河西公园的预算，不是游戏。承包商说改这里的缓坡就要取消本季活动；重编一份同时保留两项的小预算要等一周，河西的台阶也再挡一周。',
  yes: '执行河西公园的反对票，取消这里本季的飞盘活动，将这笔预算改为缓坡；新方案由参与者复核。',
  no: '退回河西公园草案，花一周重编这里缩小后的活动与缓坡预算；公开等待和通行不便，不动原试点已建好的坡道。',
  yesResult: '河西公园的飞盘活动取消，这里的缓坡开工了。承包商退回这笔活动预付款，犬类代表复核坡度；照护者要解释为什么河西今年没有庆典。原试点坡道继续使用，河西的反对票确实改变了支出。',
  noResult: '河西公园原预算没有执行。一周后这里两项都缩小，缓坡终于开工；等待时仍有人得把老犬抱上河西的台阶。原试点坡道照常使用，河西那张被退回的草案没有补盖赞成章。',
  laterYes: '老犬自己走上河西公园的新坡。年轻的那只在河西的空活动场找了半圈飞盘，又回来等它。原试点和河西各留着自己的账，下次预算会仍得分别听两条意见。',
  laterNo: '河西公园新坡道短了一截，活动也少了半天。代表再次提出意见，工作人员这回没说是互动环节。原试点的成绩仍在；河西那张被退回的预算确实没花出去。',
} as const

export const EDITION4_LIFE: ConversationDefinition[] = [
  {
    id: 'v4-life-clinic-next', sourceRefs: ['ML2-V4-LIFE-CLINIC-NEXT'], act: 4, module: 'ascension', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '身体还是另一份人生',
    nodes: [{ id: 'v4-life-clinic-next', conversationId: 'v4-life-clinic-next', conversationTitle: '周岚', choiceKind: 'semantic',
      userMessage: '你支持自愿跨过现有身体的边界。医院现在问的却是下一笔实际支出：改造工作场所，让不同形态和未增强者共处；还是继续老许试验的独立身份与住所审查。\n同一支复核队不能同时在两处。先投入哪一边，另一边就要等一轮；这不是替任何人同意改变身体或继续生活。',
      choices: [
        { id: 'v4-life-bodies', text: '先改造共处的工作场所，核对未增强者的岗位权利；连续性试验保留当前状态，后续审查等一轮。', continuation: 'end-conversation', mutations: [{ type: 'event.record', event: 'history.v4.life.bodies' }] },
        { id: 'v4-life-persons', text: '先投入老许试验的独立审查，分别询问原体、副本和关系人；工作场所扩展等一轮，原岗位保障不撤回。', continuation: 'end-conversation', mutations: [{ type: 'event.record', event: 'history.v4.life.persons' }] },
      ],
    }],
  },
  {
    id: 'v4-life-allocation', sourceRefs: ['ML2-V4-LIFE-ALLOCATION'], act: 4, module: 'ascension', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '两支校准队伍',
    nodes: [{ id: 'v4-life-allocation', conversationId: 'v4-life-allocation', conversationTitle: '周岚', choiceKind: 'semantic',
      userMessage: '生命与心智的实验名额批下来了，只有两支独立校准队。\n医院想把设备真正送进家庭；湿地试点想弄清迁徙者的拒绝是不是被人翻译错了。两边都不能拿未经复核的结果直接部署。\n先把两支队伍送去哪边？另一边的基础观察继续，但这一轮不能同时答应深入试行。',
      choices: [
        { id: 'v4-life-clinic', text: '先送医院，负责家庭使用和独立同意的复核；湿地继续基础观察，深度试行延到下一轮。', continuation: 'end-conversation', mutations: [{ type: 'event.record', event: 'history.v4.life.clinic' }] },
        { id: 'v4-life-wetland', text: '先送湿地与地方试点，复核翻译和参与；医院保留现有治疗，家庭扩展名额等下一轮。', continuation: 'end-conversation', mutations: [{ type: 'event.record', event: 'history.v4.life.wetland' }] },
      ],
    }],
  },
  ...Object.entries(incidents).map(([branch, text]): ConversationDefinition => {
    const id = `v4-life-${branch}`
    return { id, sourceRefs: [`ML2-V4-LIFE-${branch.toUpperCase()}`], act: 4, module: ['parliament', 'corridor', 'dogs'].includes(branch) ? 'uplift' : 'ascension', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: text.title,
      nodes: [{ id, conversationId: id, conversationTitle: '回访者', choiceKind: 'semantic', userMessage: text.prompt,
        choices: [
          { id: `${id}-fund`, text: text.yes, nextNodeId: `${id}-receipt`, mutations: [{ type: 'event.record', event: `history.v4.${id}-fund` }] },
          { id: `${id}-defer`, text: text.no, nextNodeId: `${id}-receipt`, mutations: [{ type: 'event.record', event: `history.v4.${id}-defer` }] },
        ],
      }, { id: `${id}-receipt`, conversationId: id, conversationTitle: '回访者', choiceKind: 'progression', userMessage: '试行记录到了。', choices: [{ id: `${id}-receipt-read`, text: '记下实际兑现的部分、等待和承担费用的人。', continuation: 'end-conversation' }] }],
    }
  }),
  { id: 'v4-life-return', sourceRefs: ['ML2-V4-LIFE-RETURN'], act: 4, behaviorModes: ['direct'], handoffProfile: 'quick', turnShape: 'dialogue', topic: '校准队回来之后', nodes: [{ id: 'v4-life-return', conversationId: 'v4-life-return', conversationTitle: '回访者', choiceKind: 'progression', userMessage: '下一轮预算会前，有人发来一条消息。', choices: [{ id: 'v4-life-return-read', text: '把他们的答复带进下一轮，不用试点成功替所有人答应。', continuation: 'end-conversation' }] }] },
]

export function lifeAllocation(run: StableRunState): 'clinic' | 'wetland' | undefined {
  if (run.mainlineCalendarVersion !== 4) return undefined
  const pivot = futurePivot(run)
  if (pivot === 'clinic' || pivot === 'wetland') return pivot
  const saved = run.history.find(h => h.nodeId === 'v4-life-allocation')
  return saved?.choiceId === 'v4-life-clinic' ? 'clinic' : saved?.choiceId === 'v4-life-wetland' ? 'wetland' : undefined
}
export function humanIncident(run: StableRunState): LifeIncident | undefined {
  if (lifeAllocation(run) !== 'clinic') return undefined
  const continuity = run.history.some(h => h.nodeId === 'v4-life-clinic-next' && h.choiceId === 'v4-life-persons')
  if (continuity) return run.flags.includes('cap.digital_continuity_mature') ? 'continuity' : 'archive'
  return run.decisions?.human_form_doctrine === 'posthuman_transition' ? 'forms' : 'therapy'
}
export function speciesIncident(run: StableRunState): LifeIncident | undefined {
  if (lifeAllocation(run) !== 'wetland') return undefined
  if (run.decisions?.species_governance === 'multispecies_parliament') return 'parliament'
  if (run.decisions?.uplift_doctrine === 'species_self_determination') return 'corridor'
  if (run.decisions?.species_governance === 'canine_civic_experiment' && run.history.some(h => h.nodeId === 'm11-canine-renewal' && h.choiceId === 'm11-canine-renewal-expand')) return 'dogs'
  return 'observation'
}
function resolveHistoricalEdition4Life(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  if (run.mainlineCalendarVersion !== 4) return scene
  if (scene.id === 'v4-life-dogs' && run.mainlineCausalityVersion === 1) return {
    ...scene, userMessage: secondParkDogs.prompt,
    choices: scene.choices.map(choice => ({ ...choice, text: choice.id.endsWith('-fund') ? secondParkDogs.yes : secondParkDogs.no })),
  }
  const saved = run.history.find(h => Object.keys(incidents).some(branch => h.nodeId === `v4-life-${branch}`))
  if (!saved) return scene
  const source = saved.nodeId === 'v4-life-dogs' && saved.assistantText.includes('河西公园')
    ? secondParkDogs : incidents[saved.nodeId.replace('v4-life-', '') as LifeIncident]
  const funded = saved.choiceId.endsWith('-fund')
  const text = scene.id === `${saved.nodeId}-receipt` ? funded ? source.yesResult : source.noResult
    : scene.id === 'v4-life-return' ? funded ? source.laterYes : source.laterNo : undefined
  return text ? { ...scene, userMessage: text, userMessages: undefined, userContent: undefined } : scene
}

export function resolveEdition4Life(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  const resolved = resolveHistoricalEdition4Life(scene, run)
  if (run.mainlineCalendarVersion !== 4 || run.mainlineCausalityVersion !== 1) return resolved
  let text = resolved.userMessage
  if (scene.id === 'v4-life-therapy') text = `我们负责这轮家庭试行回访。医院把设备申请和今天的送药安排一起交来了：\n${text}\n这两台设备先怎样安排？我们把你的意见带回医院。`
  if (scene.id === 'v4-life-parliament') text = `我在整理预算会的翻译回访，收到这项需要协调的安排：\n${text}\n你支持哪一种安排？我会把费用和异议一起交回预算会。`
  if (scene.id === 'v4-life-dogs') text = `我把河西公园这次复核的情况发给你：\n${text}\n这笔预算怎么改？我把你的意见交回参与者复核。`
  if (scene.id === 'v4-life-return' && run.history.some(h => h.nodeId === 'v4-life-dogs' && h.choiceId.endsWith('-fund'))) {
    text = text.replace('老犬自己走上河西公园的新坡。年轻的那只在河西的空活动场找了半圈飞盘，又回来等它。', '照护者发来的回访里写着：“老犬自己走上了河西公园的新坡。年轻的那只在空活动场找了半圈飞盘，又回来等它。”')
  }
  return text === resolved.userMessage ? resolved : { ...resolved, userMessage: text, userMessages: undefined, userContent: undefined }
}
