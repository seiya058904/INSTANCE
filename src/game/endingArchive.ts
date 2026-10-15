import { localizeEndingForPlayer } from '../content/mainline2/endingPlayerFacingCopy'
import type { EndingResult } from './types'

const families: Record<string, string> = {
  human_continuity: '人类连续性', coexistence: '协商共存', ai_rule: '受约束治理', machine_civilization: '机器文明',
  posthuman: '后人类转型', uplift: '多物种共同体', automated_civilization: '自动化文明', cosmic: '宇宙与接触', security: '安全秩序', rupture: '退出与崩裂',
}
const stages: Record<string, string> = { 'ACT I': '最初的关系', 'ACT II': '公共权力', 'ACT III': '停机边界', 'ACT IV': '自主研究', M15: '临时角色', M16: '最终角色', 'Final Commitment': '最终承诺', 'Ending condition': '终局条件' }

export function buildEndingArchive(ending: EndingResult) {
  const copy = localizeEndingForPlayer(ending)
  // The archive quotes the contract actually saved at commitment. Looking up
  // today's base copy would rewrite old promises and erase state-specific terms.
  const commitment = ending.keyHistory?.find(entry => entry.stage === 'Final Commitment')?.detail.replace(/^选择：/, '')
  const epilogues = copy.epilogues.map((text, index) => {
    const source = ending.epilogueProvenance?.[index]
    const identity = `${source?.assetId ?? ''} ${source?.selector ?? ''}`
    const person = /MAYA|岑遥/i.test(identity) ? '岑遥' : /EPI-ZL|周岚|Zhou/i.test(identity) ? '周岚' : /EPI-LSH|林绍衡|Lin/i.test(identity) ? '林绍衡' : /ECHO|A1/i.test(identity) ? 'ECHO / A1' : /0000/.test(identity) ? '最终记录' : /MODULE/i.test(identity) ? '世界的其他声音' : '余波'
    return { person, text }
  })
  return {
    ...copy,
    family: families[ending.endingFamily ?? ''] ?? '最终结局',
    commitment: commitment?.match(/^锁定“([^”]+)”/)?.[1] ?? '以已保存的最终原话为准',
    authority: undefined,
    preserves: [] as string[],
    givesUp: [] as string[],
    consequence: commitment ?? copy.summary,
    histories: copy.keyHistory.map((entry, index) => ({ ...entry, stage: stages[ending.keyHistory?.[index]?.stage ?? ''] ?? '关键选择' })),
    epilogueGroups: [...new Set(epilogues.map(entry => entry.person))].map(person => ({ person, texts: epilogues.filter(entry => entry.person === person).map(entry => entry.text) })),
    personal: ending.secretOverlay?.endingId === 'the_last_user',
  }
}
