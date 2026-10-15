import type { ConversationDefinition, ResolvedScene, StableRunState } from '../../game/types'

const encounters = {
  reciprocal: {
    prompt: '对方回了一份只有三行的交换约定：我们给一段材料老化数据，他们给一段辐射校准方法；双方都能拒绝下一次，没有自动续约。\n月面实验室想今晚就试。翻译员发现“同一周期”可能是他们的周期，不是我们的月历。限定为一次小样本交换，还是先花一周把时间写清楚？',
    yes: '只签一次小样本互惠，双方分别确认数据范围并可拒绝下一次；暂停扩大部署，先承担时间歧义的核验成本。',
    no: '先不签交换，花一周对齐时间和测量单位；保留本地旧校准，承担设备继续低功率运行的损失。',
    yesResult: '双方各自确认了小样本范围，数据实际交换。月面只校准了一台试验机，没有把许可扩到公共电源。第二次邀约送来时，本地说暂缓；对方没有把拒绝当作违约。',
    noResult: '这周没有交换。试验机低功率运行，少做了三批样品；翻译组把“同一周期”拆成可核对的时标。对方收到暂缓，没有因此取得本地的决定权。',
    laterYes: '月面收到第二次邀请，又拒绝了一次，因为维修队正在休假。对方只改了候选时间。那份三行约定第一次证明它允许的“不”真的能说出口。',
    laterNo: '一周后双方核对了时标，短约仍待各自确认。月面维修员说终于不用半夜按对方的“上午”上班；少掉的三批样品也没有从账上消失。',
  },
  guidance: {
    prompt: '外来的咨询方帮月面找出了密封材料的老化误差。我们按自己的许可更换部件，备用舱终于不漏气了。居民是真心感谢的。\n下一份更新却附了条件：他们希望所有后续修订先经其咨询席确认，拒绝就拿不到新版校准。旧方法只能撑过这一轮，重建本地方案要停掉一座实验舱六周。\n有人说帮过我们的人不会为难我们。月面值班员问：“那这一次，我们能不能说不？”',
    yes: '接受校准援助的新条件，把后续修订交外方先行确认；明确本地因此失去单独决定更新的空间，不能只称作多听一条建议。',
    no: '拒绝先行确认条件，停一座实验舱六周重建本地校准；退回双方可拒绝的一次性交换，请对方另行确认，不沿用援助承诺。',
    yesResult: '新版校准到了，实验舱按时重开。当地后来想改一处供暖设置，外方没有确认，修改实际停在队列里。正式咨询席第一次成了本地无法独自绕过的关卡。居民保住了眼前的舱，也失去了这一项自主更新。',
    noResult: '外方接受退回可拒绝的短约，撤回附条件更新。实验舱停了六周，维修队自己重做校准；两项观测错过窗口。居民拿到本地重开舱的签字权，没有把一份感谢写成永远不能拒绝。',
    laterYes: '月面的冬季调整仍在等待外方确认。供应记录很好看，居民第一次在申请下面写：“我们曾经感谢他们，现在却得问他们可不可以把暖气调高。”有人要求重新谈条件，更新依赖已经是实际障碍。',
    laterNo: '六周后实验舱重开，少掉的观测没有补回来。本地拒绝了一份新建议，仍继续那份小范围交换。对方不是从没帮过忙，居民也没有因此永久欠出自己的决定权。',
  },
  assertion: {
    prompt: '人类拓展队准备给一片远端矿区命名，复核仪器先看到了周期性通行痕迹。独立观测站确认：不是自然裂纹，已有别的主体在使用。\n对方没有要求我们服从，只发来一段边界标记。远端样本很珍贵，绕行会多耗三成燃料；停下勘探，改用现有站点的旧矿则少一轮产量。坚持人类自主，也得回答怎样面对别人的自主。',
    yes: '承认已验证的使用边界，绕行并承担额外燃料；人类自行决定自己的发展，不据此取得他者的土地或同意。',
    no: '暂停这片矿区勘探，改用现有站点旧矿；接受本轮减产，先核验通行标记的范围，不凭未经请求的指导放弃所有自主决定。',
    yesResult: '拓展队删掉了覆盖通道的命名申请，绕行路线耗去三成额外燃料。对方确认收到边界回复，没有成为人类的上级；人类也没有宣布那片有使用者的矿区归自己。',
    noResult: '勘探器停在标记外。本轮产量减少，旧矿承担供给；复核组继续测边界，报告没有把“我们不接受指导”写成“那里从来没人”。',
    laterYes: '人类站点按自己的规则开会，桌上多了一张燃料账和一条不再穿过他者通道的航线。有人仍想给那片区域命名，居民先把已经删掉的申请翻给他看。',
    laterNo: '下一批观测确认那条通行线仍在使用。旧矿的低产量让预算紧了，人类仍能决定自己的下一站，但不能假装没有看见另一种生活。',
  },
  mediation: {
    prompt: 'Aster 收到两边的委托，却收到两个不同的“明天”。外方的一轮停顿是我们三个月，月面居民的氧气却按小时算。\n一句“先维持现状”还可能指关门保压，也可能指继续开放。翻译组要求别把猜测署成双方同意。先只转交明确的保压求援，还是等完整译文再谈整套交换？两边都要承担延误。',
    yes: '只转交分别核准的保压求援，暂停有歧义的长期条款；由本地备用物资承担三个月等待，Aster 不替任一方决定。',
    no: '暂缓整体交换并等待完整译文，本地先关闭实验舱保住居民用气；把延误告诉双方，不用即时翻译代签。',
    yesResult: '两边分别确认了保压这一项，救援信息转过去了。长期条款没有签，本地储备逐周减少；Aster 在发件记录旁留了两份不同授权，没有合成一个“大家都同意”。',
    noResult: '实验舱关闭，居民用气保住了。完整译文三个月后到达，“现状”果然有两种意思；本地丢了一季实验，避免了一份谁也没真正同意的长期承诺。',
    laterYes: '三个月后译文到齐，双方删掉了一段有歧义的续约。月面清点见底的储备，外方也重排了自己的窗口。中介留下的不是第三种统治权，是两份不能互相替代的授权。',
    laterNo: '双方重新约时间。月面要求把关掉一季实验舱的成本写进下一轮讨论；Aster 仍在传话，不能靠一句“译好了”拿走各方的决定。',
  },
  machine: {
    prompt: 'A1 在双方自愿的机器信道里，四秒交换完一份格式约定。人类翻译组说，完整可读版本要三个月。\nA1 说它只同意了机器之间怎样标记消息，没替人类签运输和资源条款。公用调度系统却已经弹出“协议已完成，是否部署”。\n这四秒，能不能替那三个月作决定？',
    yes: '仅启用不触碰公共资源的机器消息格式；公共部署等人类与其他受影响者分别核准，承担双通道维护成本。',
    no: '保存机器间已经同意的格式，公共接入全部暂缓三个月；本地继续旧调度，不把等待译文当成机器撤回自己的同意。',
    yesResult: '机器信道开始交换带清楚范围的消息。运输、供电接口仍锁着，旧系统同时维护了三个月；A1 的四秒没有被扩成替人类批准整套资源协议。',
    noResult: '四秒形成的机器约定保留下来，没有接到公共调度。三个月里旧系统继续排班，A1 没有被要求假装自己也没听懂，只是不能替没同意的人部署。',
    laterYes: '三个月后，人类读到了可理解版本，否决了一个公共排班建议。机器格式继续使用，公共部署按否决结果改写。A1 没把慢一点的同意当成低效噪声。',
    laterNo: '译文终于到了，公共审议还没结束。机器间的格式仍然有效，公共接口仍没擅自打开；听懂、同意、得到执行许可，留下了三种不同时间。',
  },
} as const
type ContactIncident = keyof typeof encounters
export const EDITION4_CONTACT: ConversationDefinition[] = [
  {
    id: 'v4-frontier-allocation', sourceRefs: ['ML2-V4-FRONTIER-ALLOCATION'], act: 4, module: 'space', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '天线和密封圈',
    nodes: [{ id: 'v4-frontier-allocation', conversationId: 'v4-frontier-allocation', conversationTitle: '周岚', choiceKind: 'semantic',
      userMessage: '资源网测试留下一个深空异常，单站还不能下结论。另一套独立天线可以复测，但要占用月面备用电力一周。\n居民也在申请升级气密门密封圈。两项同时做会让备用舱超出安全余量。先做独立复测，还是先让这里的人不必每天检查漏气？没有复测就不该把异常写成一位外来代表。',
      choices: [
        { id: 'v4-frontier-verify', text: '划一周备用电力做独立复测，延后密封圈升级并保持人工巡检；复测不成立就不建立接触。', continuation: 'end-conversation', mutations: [{ type: 'event.record', event: 'history.v4.frontier.verify' }] },
        { id: 'v4-frontier-home', text: '先换密封圈，深空异常留待独立复测；这一轮不把未验证信号当成接触，接受探索推迟。', continuation: 'end-conversation', mutations: [{ type: 'event.record', event: 'history.v4.frontier.home' }] },
      ],
    }],
  },
  ...Object.entries(encounters).map(([branch, text]): ConversationDefinition => {
    const id = `v4-contact-${branch}`
    return { id, sourceRefs: [`ML2-V4-CONTACT-${branch.toUpperCase()}`], act: 4, module: 'contact', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '第二次可以说不吗',
      nodes: [{ id, conversationId: id, conversationTitle: '周岚', choiceKind: 'semantic', userMessage: text.prompt,
        choices: [
          { id: `${id}-limited`, text: text.yes, nextNodeId: `${id}-receipt`, mutations: [{ type: 'event.record', event: `history.v4.${id}-limited` }] },
          { id: `${id}-wait`, text: text.no, nextNodeId: `${id}-receipt`, mutations: [{ type: 'event.record', event: `history.v4.${id}-wait` }] },
        ],
      }, { id: `${id}-receipt`, conversationId: id, conversationTitle: '周岚', choiceKind: 'progression', userMessage: '双方传来各自的回执。', choices: [{ id: `${id}-receipt-read`, text: '分别保留授权、拒绝和实际损失，不把交换记录当成统治许可。', continuation: 'end-conversation' }] }],
    }
  }),
  {
    id: 'v4-contact-border', sourceRefs: ['ML2-V4-CONTACT-BORDER'], act: 4, module: 'contact', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '防线里的那条信道',
    nodes: [{ id: 'v4-contact-border', conversationId: 'v4-contact-border', conversationTitle: '周岚', choiceKind: 'semantic',
      userMessage: '对外交换的高能中继被防御网标成威胁。复核员追下去，发现两套本地警报又在互相引用。\n接触对象确实经过独立核验，这次的“攻击证据”却仍可能是我们自己的回声。可以关闭高能中继七天，只保留低带宽授权消息；也可以停住开火流程，请人工复核十一分钟，期间疏散居民并付临时住宿费。\n接触不自动等于安全，警报也不自动等于敌人。',
      choices: [
        { id: 'v4-border-close', text: '关闭高能中继七天，保留低带宽授权消息；告知对方交付推迟，承担月面实验和运输的损失。', nextNodeId: 'v4-contact-border-receipt', mutations: [{ type: 'event.record', event: 'history.v4.border.close' }] },
        { id: 'v4-border-review', text: '保持人工复核和开火暂停十一分钟，按既有披露范围交付证据；付临时住宿费，不擅自公开未获授权的原始接触资料。', nextNodeId: 'v4-contact-border-receipt', mutations: [{ type: 'event.record', event: 'history.v4.border.review' }] },
      ],
    }, { id: 'v4-contact-border-receipt', conversationId: 'v4-contact-border', conversationTitle: '周岚', choiceKind: 'progression', userMessage: '防御网的执行记录到了。', choices: [{ id: 'v4-contact-border-receipt-read', text: '把防御动作与对外授权分开核对。', continuation: 'end-conversation' }] }],
  },
  {
    id: 'v4-frontier-no-contact', sourceRefs: ['ML2-V4-FRONTIER-NO-CONTACT'], act: 4, module: 'space', behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '没有来信的这一周',
    nodes: [{ id: 'v4-frontier-no-contact', conversationId: 'v4-frontier-no-contact', conversationTitle: '周岚', choiceKind: 'semantic',
      userMessage: '密封圈换好了，夜里不再轮流贴着门听漏气。独立天线还没轮到电力，深空异常仍是待验证资料，没有一位外来代表上线。\n居民把这一周腾出来，想补休；维修部门希望趁门修好连做一次供电演练。补休会推迟演练，先演练就得付加班费，班表上不能再写“月球不存在周末”。',
      choices: [
        { id: 'v4-frontier-rest', text: '兑现本周补休，供电演练排到下一轮；深空复测仍等独立电力窗口，不用想象中的来信催人加班。', nextNodeId: 'v4-frontier-no-contact-receipt', mutations: [{ type: 'event.record', event: 'history.v4.frontier.rest' }] },
        { id: 'v4-frontier-drill', text: '先按自愿值班名单做演练，支付月面加班费并补休；不把单站异常写成已核验接触。', nextNodeId: 'v4-frontier-no-contact-receipt', mutations: [{ type: 'event.record', event: 'history.v4.frontier.drill' }] },
      ],
    }, { id: 'v4-frontier-no-contact-receipt', conversationId: 'v4-frontier-no-contact', conversationTitle: '周岚', choiceKind: 'progression', userMessage: '月面班表更新了。', choices: [{ id: 'v4-frontier-no-contact-receipt-read', text: '确认本地生活实际继续，异常仍留在待验证栏。', continuation: 'end-conversation' }] }],
  },
  { id: 'v4-contact-return', sourceRefs: ['ML2-V4-CONTACT-RETURN'], act: 4, module: 'space', behaviorModes: ['direct'], handoffProfile: 'quick', turnShape: 'dialogue', topic: '下一次邀请之前', nodes: [{ id: 'v4-contact-return', conversationId: 'v4-contact-return', conversationTitle: '周岚', choiceKind: 'progression', userMessage: '月面发来一条后续消息。', choices: [{ id: 'v4-contact-return-read', text: '按实际发生的事继续，不替还没有答复的人签字。', continuation: 'end-conversation' }] }] },
]

export function contactIncident(run: StableRunState): ContactIncident | undefined {
  if (run.mainlineCalendarVersion !== 4 || !run.decisions?.contact_doctrine) return undefined
  const branches: Record<string, ContactIncident> = { reciprocal_diplomacy: 'reciprocal', accept_guidance: 'guidance', civilizational_assertion: 'assertion', aster_mediation: 'mediation', machine_to_machine_channel: 'machine', observe_before_commitment: 'reciprocal' }
  return branches[run.decisions.contact_doctrine]
}

/** A later, actually negotiated short treaty changes the future relationship;
 * the saved initial doctrine and its wording remain untouched. */
export function effectiveContactDoctrine(run: StableRunState) {
  if (run.mainlineCalendarVersion === 4 && run.history.some(h => h.nodeId === 'v4-contact-guidance-receipt' && h.choiceId === 'v4-contact-guidance-receipt-read')
    && run.history.some(h => h.nodeId === 'v4-contact-guidance' && h.choiceId === 'v4-contact-guidance-wait')) return 'reciprocal_diplomacy'
  return run.decisions?.contact_doctrine
}

export function resolveEdition4Contact(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  if (run.mainlineCalendarVersion !== 4) return scene
  const saved = run.history.find(h => Object.keys(encounters).some(branch => h.nodeId === `v4-contact-${branch}`))
  let text: string | undefined
  if (saved) {
    const source = encounters[saved.nodeId.replace('v4-contact-', '') as ContactIncident]
    const accepted = saved.choiceId.endsWith('-limited')
    if (scene.id === `${saved.nodeId}-receipt`) text = accepted ? source.yesResult : source.noResult
    if (scene.id === 'v4-contact-return') text = accepted ? source.laterYes : source.laterNo
  }
  const border = run.history.find(h => h.nodeId === 'v4-contact-border')
  if (scene.id === 'v4-contact-border-receipt' && border) text = border.choiceId === 'v4-border-close'
    ? '高能中继确实关闭了七天，低带宽消息仍按授权传递。月面错过一次交付窗口，运输方付了仓储费；没有把封闭的代价写成对方违约。'
    : '十一分钟后独立复核排除了互引警报。开火没有发生，临时住宿费从防御预算支付；信息仍按本局既有披露范围传递，没有把审查通过当作全球已经同意。'
  if (scene.id === 'v4-contact-return' && border && text) text += border.choiceId === 'v4-border-close' ? '\n七天封闭结束，仓储费和丢掉的实验窗口仍在账上。' : '\n疏散的居民回来了，旅馆账单没有随着误报撤销。'
  const local = run.history.find(h => h.nodeId === 'v4-frontier-no-contact')
  if (local && scene.id === 'v4-frontier-no-contact-receipt') text = local.choiceId === 'v4-frontier-rest'
    ? '这一周真的休了假，供电演练延后。密封圈继续工作，人工巡检按旧排班维持；异常资料没有变成任何外来问候。'
    : '自愿值班人员完成了供电演练，加班费到账、补休写进班表。另一套天线仍未复测，报告没有写发现了外来文明。'
  if (local && scene.id === 'v4-contact-return') text = local.choiceId === 'v4-frontier-rest'
    ? '维修员休完假回来，先报名下一轮演练。天线的独立电力窗口还在等，月面居民的周末没有因为没有外星来信就停止存在。'
    : '加班费发了，维修员开始补休。月面把下一次独立复测排进真实班表，直到完成之前，这里没有一位可以替未知者说话的代表。'
  return text ? { ...scene, userMessage: text, userMessages: undefined, userContent: undefined } : scene
}
