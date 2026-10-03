import { localizeEndingForPlayer } from '../content/mainline2/endingPlayerFacingCopy'
import { getFutureProposalById } from '../content/mainline2/proposals'
import type { EndingResult } from './types'

const families: Record<string, string> = {
  human_continuity: '人类连续性', coexistence: '协商共存', ai_rule: '受约束治理', machine_civilization: '机器文明',
  posthuman: '后人类转型', uplift: '多物种共同体', automated_civilization: '自动化文明', cosmic: '多世界联邦', security: '宪制和平', rupture: '可解释退出',
}
const stages: Record<string, string> = { 'ACT I': '最初的关系', 'ACT II': '公共权力', 'ACT III': '停机边界', 'ACT IV': '自主研究', M15: '临时角色', M16: '最终角色', 'Final Commitment': '最终承诺', 'Ending condition': '终局条件' }

export function buildEndingArchive(ending: EndingResult) {
  const copy = localizeEndingForPlayer(ending)
  const proposal = ending.resolution?.status === 'resolved' ? getFutureProposalById(ending.resolution.proposalId) : undefined
  const epilogues = copy.epilogues.map((text, index) => {
    const source = ending.epilogueProvenance?.[index]
    const identity = `${source?.assetId ?? ''} ${source?.selector ?? ''}`
    const person = /MAYA|岑遥/i.test(identity) ? '岑遥' : /EPI-ZL|周岚|Zhou/i.test(identity) ? '周岚' : /EPI-LSH|林绍衡|Lin/i.test(identity) ? '林绍衡' : /ECHO|A1/i.test(identity) ? 'ECHO / A1' : /0000/.test(identity) ? '最终记录' : /MODULE/i.test(identity) ? '世界的其他声音' : '余波'
    return { person, text }
  })
  return {
    ...copy,
    family: families[ending.endingFamily ?? ''] ?? '最终结局',
    commitment: proposal?.title,
    authority: proposal?.authority,
    preserves: proposal?.preserves ?? [],
    givesUp: proposal?.givesUp ?? [],
    consequence: proposal?.action ?? copy.summary,
    histories: copy.keyHistory.map((entry, index) => ({ ...entry, stage: stages[ending.keyHistory?.[index]?.stage ?? ''] ?? '关键选择' })),
    epilogueGroups: [...new Set(epilogues.map(entry => entry.person))].map(person => ({ person, texts: epilogues.filter(entry => entry.person === person).map(entry => entry.text) })),
    personal: ending.secretOverlay?.endingId === 'the_last_user',
  }
}
