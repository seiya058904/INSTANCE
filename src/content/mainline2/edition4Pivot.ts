import type { ConversationDefinition, ResolvedScene, StableRunState } from '../../game/types'

const moves = {
  clinic: ['诊所', '从机器新试行撤回一组扩展工程师，支付转岗和设备校准费，后续新增实例试点延期；已有实例的契约和运行不撤销。'],
  economy: ['工厂与生活排程', '把下一轮诊所扩展经费改投工厂生活排程，支付转岗费；已获设备与照护者继续获维护，新诊所名额等下一期。'],
  wetland: ['湿地参与者', '暂停下一轮自动化扩建，付翻译校准和临时供水费，把后续队伍送到湿地；已支付的收入与维修责任继续履行。'],
  frontier: ['边疆核验', '湿地新席位扩展暂缓，维护与已签协议继续；支付独立信号核验的人手费用，新的边疆项目挤掉一轮扩建。'],
  controls: ['控制链与接班', '对外协议保持既定范围，下一批技术交换延期；把工程师送去做撤销和交接实测，支付人工接班预备费。'],
} as const
export type PivotFocus = keyof typeof moves
export function futurePivot(run: StableRunState): PivotFocus | undefined {
  if (run.mainlineCalendarVersion !== 4 || !run.history.some(h => h.nodeId === 'v4-future-effort-receipt')) return undefined
  return (Object.keys(moves) as PivotFocus[]).find(key => run.history.some(h => h.nodeId === 'v4-future-effort' && h.choiceId === `v4-pivot-${key}`))
}
export const EDITION4_PIVOT: ConversationDefinition[] = [{ id: 'v4-future-effort', sourceRefs: ['ML2-V4-FUTURE-EFFORT'], act: 4, behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '下一班人去哪里', nodes: [
  { id: 'v4-future-effort', conversationId: 'v4-future-effort', conversationTitle: '周岚', choiceKind: 'semantic', userMessage: '第一轮试行做出了结果，也留下了账单。你可以继续深做，也可以把尚未开工的下一班人转去另一处。已经签的契约和已经欠下的责任不会随焦点一起消失。', choices: [
    { id: 'v4-pivot-stay', text: '继续眼前这条线，先履行已接下的责任；暂不转移下一班人。', nextNodeId: 'v4-future-effort-receipt' },
    ...Object.entries(moves).map(([key, [label, cost]]) => ({ id: `v4-pivot-${key}`, text: `下一班转向${label}：${cost}`, nextNodeId: 'v4-future-effort-receipt', mutations: [{ type: 'event.record' as const, event: `history.v4.pivot.${key}` }] })),
  ] },
  { id: 'v4-future-effort-receipt', conversationId: 'v4-future-effort', conversationTitle: '周岚', choiceKind: 'progression', userMessage: '下一班排班确认了。', choices: [{ id: 'v4-pivot-receipt-read', text: '按实际转岗排下一班，保留之前的答复和责任。', continuation: 'end-conversation' }] },
] }]
export function resolveEdition4Pivot(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  if (scene.id === 'v4-future-effort') {
    const focus = run.decisions?.act4_research_emphasis
    const destination = focus === 'computation_ai' ? 'clinic' : focus === 'automation_industry' ? 'wetland' : focus === 'frontier_science' ? 'controls' : run.history.some(h => h.nodeId === 'v4-life-allocation' && h.choiceId === 'v4-life-wetland') ? 'frontier' : 'economy'
    return { ...scene, choices: scene.choices.filter(c => c.id === 'v4-pivot-stay' || c.id === `v4-pivot-${destination}`) }
  }
  if (scene.id !== 'v4-future-effort-receipt') return scene
  const choice = [...run.history].reverse().find(h => h.nodeId === 'v4-future-effort')?.choiceId
  const move = (Object.keys(moves) as PivotFocus[]).find(key => choice === `v4-pivot-${key}`)
  return { ...scene, userMessage: move ? `下一班已转向${moves[move][0]}。${moves[move][1]}\n转岗费已付、原来的新增项目延期。旧记录与回访保留，不能把转向写成过去从来没做过。` : '下一班留在原项目，预算没有转走。之前的等待与维护账单继续履行，没有凭空多出另一支队伍。' }
}
