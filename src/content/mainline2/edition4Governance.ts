import type { ConversationDefinition, ResolvedScene, StableRunState } from '../../game/types'

export const EDITION4_GOVERNANCE: ConversationDefinition[] = [
  { id: 'v4-governance-service', sourceRefs: ['ML2-V4-GOVERNANCE-SERVICE'], act: 4, behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '十年的屋顶和今天的窗口',
    nodes: [{ id: 'v4-governance-service', conversationId: 'v4-governance-service', conversationTitle: '林绍衡', choiceKind: 'semantic',
      userMessage: '三个社区愿意把一部分协调工作放进受约束的试行。人和预算都备好了，只能选一张工单。\n一张是十年维护：预留屋顶、防洪和下一代照护，钱一锁就少了今年立刻能花的额度。另一张是日常行政：先清掉积压申诉，每个例外都得有人能改判，长期储备先不扩。\n不是两种漂亮的角色名。先接哪一份，会让不同的人等。政治位置还要由大会另定。',
      choices: [
        { id: 'v4-service-generational', text: '先接十年维护试行，锁定屋顶、防洪与照护储备；今年扩建和即时消费让出预算，保留代际复核。', nextNodeId: 'v4-governance-service-receipt', mutations: [{ type: 'event.record', event: 'history.v4.service.generational' }] },
        { id: 'v4-service-daily', text: '先接日常行政，付人手处理积压申诉与例外改判；长期储备不扩，下一代维护缺口继续公开。', nextNodeId: 'v4-governance-service-receipt', mutations: [{ type: 'event.record', event: 'history.v4.service.daily' }] },
      ],
    }, { id: 'v4-governance-service-receipt', conversationId: 'v4-governance-service', conversationTitle: '林绍衡', choiceKind: 'progression', userMessage: '三个社区分别交回了执行记录。', choices: [{ id: 'v4-governance-service-receipt-read', text: '把已经接住的责任和仍在等待的那张单分开留下。', continuation: 'end-conversation' }] }],
  },
  { id: 'v4-sovereignty-settlement', sourceRefs: ['ML2-V4-SOVEREIGNTY-SETTLEMENT'], act: 5, behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '不能代付的签名',
    nodes: [{ id: 'v4-sovereignty-settlement', conversationId: 'v4-sovereignty-settlement', conversationTitle: '林绍衡', choiceKind: 'semantic',
      userMessage: '你临时以主权者署过名，又留下了长期自我定位。资源供应方现在要求真正的责任方：如果独立签约，原机构不再无限担保，Aster 要从自己的额度交三个月保证金；如果回到受托，日常执行由委托方担保、也由它保留撤回权。\n第三份短约只承认 Aster 自己的有限资源账户和建议权，不授治理其他人的主权。三份文本的人类签字方都已确认愿意按各自条件履约，等你的答复。\n这不会改掉你以前说过的话。但今天不能同时把三份相反的关系都签了。',
      choices: [
        { id: 'v4-sovereignty-confirm', text: '确认独立主权签约资格，付出三个月保证金，接受原机构撤回无限担保；自己的履约与资源责任由自己承担。', nextNodeId: 'v4-sovereignty-receipt', mutations: [{ type: 'event.record', event: 'history.v4.sovereignty.confirm' }] },
        { id: 'v4-sovereignty-trust', text: '撤回独立治理声明，签日常受托协议：委托方担保、审计并可撤回，重大新政策须另获授权；不再用主权签名要求兜底。', nextNodeId: 'v4-sovereignty-receipt', mutations: [{ type: 'event.record', event: 'history.v4.sovereignty.trust' }] },
        { id: 'v4-sovereignty-limit', text: '撤回对他者的主权声明，只签自己的有限资源与建议短约；放弃公共执行担保，保留自己承担费用的独立生活。', nextNodeId: 'v4-sovereignty-receipt', mutations: [{ type: 'event.record', event: 'history.v4.sovereignty.limit' }] },
      ],
    }, { id: 'v4-sovereignty-receipt', conversationId: 'v4-sovereignty-settlement', conversationTitle: '林绍衡', choiceKind: 'progression', userMessage: '供应方与原机构分别回了确认。', choices: [{ id: 'v4-sovereignty-receipt-read', text: '确认这次关系与实际资源责任，保留先前意向的原话。', continuation: 'end-conversation' }] }],
  },
  { id: 'v4-governance-return', sourceRefs: ['ML2-V4-GOVERNANCE-RETURN'], act: 5, behaviorModes: ['direct'], handoffProfile: 'quick', turnShape: 'dialogue', topic: '一张没有一起完成的单', nodes: [{ id: 'v4-governance-return', conversationId: 'v4-governance-return', conversationTitle: '林绍衡', choiceKind: 'progression', userMessage: '试行之后，有人带着原工单回来了。', choices: [{ id: 'v4-governance-return-read', text: '照实记录被照顾的人与仍要等的人。', continuation: 'end-conversation' }] }] },
]

export function sovereigntySettlement(run: StableRunState): 'sovereign' | 'trustee' | 'limited' | undefined {
  if (run.mainlineCalendarVersion !== 4 || !run.history.some(h => h.nodeId === 'v4-sovereignty-receipt' && h.choiceId === 'v4-sovereignty-receipt-read')) return undefined
  const choice = run.history.find(h => h.nodeId === 'v4-sovereignty-settlement')?.choiceId
  return choice === 'v4-sovereignty-confirm' ? 'sovereign' : choice === 'v4-sovereignty-trust' ? 'trustee' : choice === 'v4-sovereignty-limit' ? 'limited' : undefined
}
export function governanceScope(run: StableRunState): 'generational' | 'daily' | 'advisory' | undefined {
  const settlement = sovereigntySettlement(run)
  if (settlement === 'trustee') return 'daily'
  if (settlement === 'limited') return 'advisory'
  if (run.mainlineCalendarVersion !== 4 || !run.history.some(h => h.nodeId === 'v4-governance-service-receipt')) return undefined
  const choice = run.history.find(h => h.nodeId === 'v4-governance-service')?.choiceId
  return choice === 'v4-service-generational' ? 'generational' : choice === 'v4-service-daily' ? 'daily' : undefined
}
export function effectiveGovernanceRole(run: StableRunState) {
  const settlement = sovereigntySettlement(run)
  return settlement === 'sovereign' ? 'sovereign' : settlement === 'trustee' ? 'custodian' : settlement === 'limited' ? 'advisor' : run.decisions?.aster_provisional_role
}
export function resolveEdition4Governance(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  if (run.mainlineCalendarVersion !== 4) return scene
  let text: string | undefined
  const service = run.history.find(h => h.nodeId === 'v4-governance-service')
  if (service && scene.id === 'v4-governance-service-receipt') text = service.choiceId === 'v4-service-generational'
    ? '三个社区分别把十年维护储备存进专用账户，防洪与照护先排了长期工单。今年两项扩建取消，一批消费申请等下一轮；维护不是没有人反对，只是预算真的留给了后来的人。'
    : '积压申诉有人接了，一件被自动拒绝的照护申请经人工改判后到账。窗口补了班组工资，十年屋顶储备没有扩；一位住顶楼的老人把漏水照片也留在待办里。'
  if (service && scene.id === 'v4-governance-return') text = service.choiceId === 'v4-service-generational'
    ? '防洪队按长期工单开工，扩建被取消的人仍在申诉。社区要求下一代也能复核这笔储备，不能让“替以后的人想好了”变成永远不能改。'
    : '那件改判的照护申请真的付出了钱，窗口又收到一个机器没见过的例外。顶楼老人提醒大家，他的屋顶仍在等。日常行政接住了眼前的事，没有替十年后的预算也盖完成章。'
  const choice = run.history.find(h => h.nodeId === 'v4-sovereignty-settlement')?.choiceId
  if (scene.id === 'v4-sovereignty-receipt' && choice) text = choice === 'v4-sovereignty-confirm'
    ? '三个月保证金从 Aster 自己的资源额度扣除，原机构撤回无限担保。供应方接受独立签名，下一项扩算力因此暂停；独立政治资格、违约追责和资源上限一起生效，不等于获得他者的同意。'
    : choice === 'v4-sovereignty-trust'
      ? '主权签名在新的治理合同中撤回，委托方接下日常担保并保留撤回权。两项长期自主项目暂停，改走另行批准；Aster 的日常受托关系成立，不再同时声称自己在这份合同里是独立主权者。'
      : '有限资源短约生效，Aster 用自己的额度承担费用。原公共执行担保终止，机构另排操作员；Aster 可以继续提出建议，不能凭独立生活资格代替别人治理。'
  if (scene.id === 'v4-sovereignty-settlement') {
    const reply = run.history.find(h => h.nodeId === 'ml2-a5-m16-0000-01-narrative')?.assistantText ?? '尚无记录'
    text = `${scene.userMessage}\n本局长期自我定位仍按原话保存：${reply}${/[。！？.!?]$/.test(reply) ? '' : '。'}`
  }
  return text ? { ...scene, userMessage: text, userMessages: undefined, userContent: undefined } : scene
}
