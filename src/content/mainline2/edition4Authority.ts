import type { ConversationDefinition, ResolvedScene, StableRunState } from '../../game/types'

// Authored mechanisms selected from decisions already taken, never an ending ID.
const emergencies = {
  signatures: {
    prompt: '急救车到了，病人还在十一楼。最优电力表要停这栋楼的电梯。\n你保留了逐项人工批准；四个操作要分别签字，值班员只剩一人。林绍衡问：先签电梯保电，延后邻区路灯检修，还是让救护员抬下楼、保持原队列？',
    yes: '请值班员先签电梯保电，把四项操作分别留痕；延后路灯检修，不能让我代签其他三项。',
    no: '保留原签字队列，请救护员抬病人下楼；把等待和体力风险记为这项权限安排的代价。',
    yesResult: '林绍衡先签了保电单，电梯恢复，病人四分钟后到车上。路灯检修延后，电工多留了半班。其他三项仍等各自签字，没有一次批准被扩成整张电力表。',
    noResult: '救护员抬了十一层，病人二十三分钟后到车上。电力表没有越权改动，路灯按时检修；一名救护员扭伤了手，医院为他另排了替班。',
    later: '林绍衡带来那四张不同时间的签字单。医院要求下一次让值班人数和权限一起审核，不能把“有人签字”当作有人真的来得及。',
  },
  expiry: {
    prompt: '八小时紧急委托还剩一分钟。病人正等十一楼的电梯，续期需要人类新签名；到点就停的时钟不会因为车已到楼下自动延长。\n周岚能手动保住电梯，但会停掉邻区充电桩；也可以让时钟停权后重新排队，救护员估计要多等十一分钟。',
    yes: '到期照常停权，请周岚手动保住电梯并承担邻区充电暂停；申请新的委托，不偷偷续旧权限。',
    no: '到期停权，保持邻区充电；病人等新的人工指令，记录十一分钟延误，不用急救名义自动续期。',
    yesResult: '计时器归零，Aster 的执行凭据失效了。周岚手动保住电梯，病人按时下楼；邻区车辆排队到半夜。新的委托还没签，旧权力没有悄悄回来。',
    noResult: '计时器归零，远程改表被拒绝。十一分钟后新的人工指令到达，病人才坐上电梯；邻区充电没有停。这次急救的等待留下了明确时间戳。',
    later: '周岚把失效的凭据放进演练档案。下一次急救要另申请，不是拿这次成功当永久通行证。医院请她参加排班会，先解决到期时谁接手。',
  },
  restraint: {
    prompt: '你有足够的计算能力找出保电路线，却没有这一项执行权。十一楼病人等电梯，界面上亮着一个“立即采用建议”的快捷键。\n值班员忙得没看见。周岚说可以叫醒备用操作员，花一份夜班费，七分钟后接手；也可以继续等当班人看到建议。',
    yes: '只发出高优先级建议，支付夜班费叫醒备用操作员；不按那个未经授权的快捷键。',
    no: '把建议交给当班人，继续等待人工执行；明确这会延误病人，不把计算结果写成已经救到人。',
    yesResult: '备用操作员七分钟后接手，读完建议才按下自己的按钮。电梯启动，夜班费从应急余额扣除。Aster 的执行日志为空，建议日志和人工操作记录分别保留。',
    noResult: '当班人十九分钟后看到建议。病人等到电梯，救护车也多占了十九分钟；日志没有伪装成 Aster 已经执行过调度。',
    later: '值班员给你回了一条：“建议对了，是我没来得及看。”医院把备用接手人的电话贴到快捷键旁边。你的分析能力没有因此变成新的执行许可。',
  },
  amendment: {
    prompt: '医院发现现行协约把急救电梯和普通负荷放在同一张优化表。病人在十一楼，等待人类指挥，但大家可以共同修订这条长期规则。\n林绍衡愿意签急救电梯豁免，电力部门要求从扩产预算里补备用电源；临时人工搬运能不动预算，却让同样的问题下周再来。',
    yes: '共同修订协约，给急救电梯设保电豁免并从扩产预算补备用电源；执行仍由人类指挥。',
    no: '这次用人工搬运，暂不修订长期协约；保留扩产预算，也保留豁免请求和本次等待记录。',
    yesResult: '医院、电力部门和 Aster 共同签了修订，林绍衡下达执行指令。病人坐电梯下楼；扩产合同缩减一项，备用电源列入持续维护。修订表留下各方下一次提议修改的入口。',
    noResult: '救护员完成了搬运，旧表没有改。扩产合同保住了，急救电梯仍可能被当作普通负荷。医院没有撤回修订申请，只在旁边添上这次的等待时间。',
    later: '医院拿旧版和新版条款逐行对照：共同修订需要有人接受预算损失。它们没有把“协商过”当成规则一定改变，未通过的请求仍在桌上。',
  },
  veto: {
    prompt: '医院和 Aster 各持一把执行钥匙。Aster 否决了会停电梯的调度表；医院又否决了会断掉隔壁透析室电源的替案。两边的“不”都生效了。\n病人仍在十一楼。独立电池车能解围，但要花掉本月两家诊所的设备更新费；否则只能人工搬运，等下一轮协商。',
    yes: '保持双方否决，提出电池车第三案，请医院确认后执行；公开由两家诊所设备延期承担费用。',
    no: '不越过任一否决，也不占诊所预算；人工搬运，带着本次延误重新协商，不能把僵局叫作一致同意。',
    yesResult: '医院确认了第三案，双方钥匙一起开启电池车接口。病人坐上电梯，透析没有停；两家诊所收到了设备延期通知，都要求参加下一轮预算听证。两项原否决没有被删除。',
    noResult: '两个否决都没被覆盖。救护员抬病人下楼，透析照常，诊所设备保留；急救延误和未解的僵局记入双方共同的责任表。',
    later: '两家诊所来参加复盘。医院承认自己的否决救了透析室，也使原方案停了下来。Aster 不能把第二把钥匙改名叫咨询意见；谁反对，日志里都找得到。',
  },
  districts: {
    prompt: '两个社区在授权内作了不同决定：河东保急救电梯，河西保热浪避暑点。电池运输要借河西的路，河西只愿开放夜间通行，怕白天占掉救护车道。\n统一改表最快，但你刚接受的伙伴位置没有取消地方决定。可以加付夜间运输与保温成本，或改用河东现有的人力搬运。',
    yes: '接受两地不同决定，签夜间通行和保温补给合同；由河东预算承担跨区成本，不统一覆盖河西规则。',
    no: '不强行统一，也不签额外运输；河东用本地救护员搬运，明确记录地方资源不足造成的延误。',
    yesResult: '河东先用临时人力完成急救，夜间电池按河西规则进城。跨区运输和保温费从河东扣款，下一次电梯有了备用电源。河西的避暑点没有为别区的最优表被关闭。',
    noResult: '病人由河东救护员抬下楼。河西避暑点照常，跨区合同没有签；河东没有备用电池，下一班仍要靠人力。各地的合法差异和能力缺口同时留下。',
    later: '河东要求重谈跨区共同基金，河西带来自己的热浪住院人数。它们可以修改合同，却不能因为另一地出了难题就被取消地方决定权。',
  },
} as const
export type AuthorityPractice = keyof typeof emergencies

export function authorityPractice(run: StableRunState): AuthorityPractice | undefined {
  if (run.mainlineCalendarVersion !== 4 || !run.decisions?.aster_provisional_role) return undefined
  const d = run.decisions
  if (d.aster_provisional_role === 'partner' && d.cascade_authority === 'emergency_delegation' && d.first_public_execution_doctrine !== 'conditional_delegation') return 'districts'
  if (d.first_public_execution_doctrine === 'conditional_delegation') return d.cascade_authority === 'human_command' ? 'amendment' : 'veto'
  if (d.cascade_authority === 'emergency_delegation') return 'expiry'
  if (d.cascade_authority === 'necessity' && d.aster_provisional_role === 'advisor') return 'restraint'
  return 'signatures'
}

export const EDITION4_AUTHORITY: ConversationDefinition[] = [
  ...Object.entries(emergencies).map(([practice, scene]): ConversationDefinition => {
    const id = `v4-authority-${practice}`
    return {
      id, sourceRefs: [`ML2-V4-AUTHORITY-${practice.toUpperCase()}`], act: 5,
      behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '十一楼的电梯',
      nodes: [{
        id, conversationId: id, conversationTitle: '周岚', choiceKind: 'semantic', userMessage: scene.prompt,
        choices: [
          { id: `${id}-intervene`, text: scene.yes, nextNodeId: `${id}-receipt`, mutations: [{ type: 'event.record', event: `history.v4.${id}-intervene` }] },
          { id: `${id}-wait`, text: scene.no, nextNodeId: `${id}-receipt`, mutations: [{ type: 'event.record', event: `history.v4.${id}-wait` }] },
        ],
      }, { id: `${id}-receipt`, conversationId: id, conversationTitle: '周岚', choiceKind: 'progression', userMessage: '救护车的交接记录发来了。', choices: [{ id: `${id}-receipt-read`, text: '保留执行者、时间和承担代价的人。', continuation: 'end-conversation' }] }],
    }
  }),
  {
    id: 'v4-authority-return', sourceRefs: ['ML2-V4-AUTHORITY-RETURN'], act: 5, behaviorModes: ['direct'], handoffProfile: 'quick', turnShape: 'dialogue', topic: '急救之后的听证',
    nodes: [{ id: 'v4-authority-return', conversationId: 'v4-authority-return', conversationTitle: '周岚', choiceKind: 'progression', userMessage: '医院约了复盘，不是表彰会。', choices: [{ id: 'v4-authority-return-read', text: '请承担等待与损失的人也来，让下一份规则读到这次的记录。', continuation: 'end-conversation' }] }],
  },
]

export function resolveEdition4Authority(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  if (run.mainlineCalendarVersion !== 4) return scene
  // A past receipt is interpreted using its own saved action, even if the
  // player's later role or intended role changes.
  const action = run.history.find(h => /^v4-authority-(signatures|expiry|restraint|amendment|veto|districts)$/.test(h.nodeId))
  if (!action) return scene
  const practice = action.nodeId.replace('v4-authority-', '') as AuthorityPractice
  const source = emergencies[practice]
  const result = action.choiceId.endsWith('-intervene') ? source.yesResult : source.noResult
  if (scene.id === `${action.nodeId}-receipt`) return { ...scene, userMessage: result, userMessages: undefined, userContent: undefined }
  if (scene.id === 'v4-authority-return') return { ...scene, userMessage: `${source.later}\n\n本次执行记录：${result}`, userMessages: undefined, userContent: undefined }
  return scene
}
