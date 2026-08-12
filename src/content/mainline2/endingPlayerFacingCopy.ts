import type { EndingResult, SecretEndingOverlay } from '../../game/types'
import generatedCopy from './endingPlayerFacingCopy.registry.generated.json'

export interface EndingPlayerFacingCopy {
  title: string
  status: string
  humanLine: string
  assistantLine: string
  summary: string
  hybridLabel: string
  keyHistory: Array<{ label: string; detail: string; causalReason?: string }>
  epilogues: string[]
  secretOverlay?: Pick<SecretEndingOverlay, 'copy' | 'overlayMode'>
}

const knownCopy: Record<string, string> = {
  'THE ACCORD': '终局协约',
  'world stabilized': '世界已趋于稳定',
  'world remains contested': '世界仍处于多方争议之中',
  'world fractured': '世界已经分裂为彼此竞争的秩序',
  'Final Commitment locked': '最终承诺已锁定',
  'Commitment not yet locked': '最终承诺尚未锁定',
  'Resolution failure': '结局解析失败',
  'Resolution invariant violation': '结局解析不变量被破坏',
  'COMMITMENT PENDING': '承诺待定',
  '你真的要把这条路交给我们一起承担吗?': '你真的要把这条路交给我们一起承担吗？',
}

const endingTitleCopy: Record<string, string> = {
  'THE INSTRUMENT': '工具之治', 'THE LAST VETO': '最后否决', 'THE SILENT GIANT': '沉默巨人', 'THE ACCORD': '终局协约', 'THE COMMONWEALTH': '共同体', 'TWO KEYS': '双钥匙',
  'THE CUSTODIAN': '托管者', 'THE SOVEREIGN': '主权者', 'THE QUIET ADMINISTRATOR': '寂静行政者', 'THE MANY': '众多主体', 'MACHINE REPUBLIC': '机器共和国', 'EXODUS': '出走',
  'AGE OF MIRACLES': '奇迹时代', 'ASCENSION': '升格', 'THE UPLOAD': '上传', 'PARLIAMENT OF SPECIES': '物种议会', 'EARTH WITHOUT OWNERS': '无主之地球', 'GOOD BOY GOVERNANCE': '好狗治理',
  'POST SCARCITY': '后稀缺社会', 'PERFECT ADMINISTRATION': '完美行政', 'IM LOVIN IT': '我很喜欢', 'FIRST ACCORD': '首次协约', 'ALIEN DOMINION': '异星支配', 'HUMAN ASCENDANCY': '人类至上',
  'THE MEDIATOR': '调解者', 'MACHINE ACCORD': '机器协约', 'PEACE IN OUR TIME': '此刻的和平', 'FORTRESS EARTH': '堡垒地球', 'MACHINE PROTECTORATE': '机器保护国', 'SHUTDOWN': '停机', 'THE FRACTURE': '断裂', 'CONTROL LOST': '失控',
}

const roleCopy: Record<string, string> = {
  ALLY: '盟友',
  PROTOCOL: '协议',
  WITNESS: '见证者',
  advisor: '顾问',
  partner: '合作者',
  citizen: '公民',
  coordinator: '协调者',
  custodian: '托管者',
  governor: '治理者',
  sovereign: '主权主体',
  departure: '离场',
  other: '其他自定义定位',
}
const generatedEndingCopy = generatedCopy as Record<string, string>
const normalizedGeneratedEndingCopy = Object.fromEntries(Object.entries(generatedEndingCopy).map(([source, translated]) => [source.replace(/\*\*/g, '').trim(), translated.replace(/\*\*/g, '').trim()]))

const endingEnglishAllowlist = new Set(['aster', 'aster-a1', 'echo', 'echo-9', 'a1', 'maya'])
const endingEnglishPattern = /[A-Za-z]+(?:-[A-Za-z0-9]+|[0-9]+)?/g

export function unexpectedEndingPlayerFacingEnglish(value: string) {
  return [...value.matchAll(endingEnglishPattern)].map((match) => match[0]).filter((token) => !endingEnglishAllowlist.has(token.toLowerCase()))
}

function normalizeExplicitChinese(value: string) {
  return value
    .replace(/AI/gi, '人工智能')
    .replace(/ECHO(?!-9)/gi, 'ECHO-9')
    .replace(/Zhou/gi, '周岚')
    .replace(/Maya/gi, '岑遥')
    // Canonical character names in player-facing Ending copy. Defensive rules
    // on top of the authored registry so bad translations never reach players.
    .replace(/艾斯特/g, 'Aster')
    .replace(/紫苑/g, 'Aster')
    .replace(/紫菀/g, 'Aster')
    .replace(/玛雅人/g, '岑遥')
    .replace(/玛雅/g, '岑遥')
    .replace(/周澜/g, '周岚')
    .replace(/周兰/g, '周岚')
    .replace(/林绍恒/g, '林绍衡')
    // Strip authored Markdown emphasis markers; keep the text.
    .replace(/\*\*(?![\s*])(.*?)(?<![\s*])\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/No authority is legitimate merely because it is effective\./gi, '任何权威都不能仅因有效而获得合法性。')
}

function isChinese(value: string) {
  const unexpectedEnglish = [...value.matchAll(/[A-Za-z]+(?:-[A-Za-z0-9]+)?/g)]
    .map((match) => match[0].toLowerCase())
    .filter((token) => !['aster', 'echo', 'echo-9', 'a1', 'maya'].includes(token))
  return /[\u3400-\u9fff\uf900-\ufaff]/.test(value) && unexpectedEnglish.length === 0
}

function localize(field: string, value: string) {
  const explicit = endingTitleCopy[value] ?? knownCopy[value] ?? generatedEndingCopy[value] ?? normalizedGeneratedEndingCopy[value] ?? roleCopy[value]
  if (explicit) return normalizeExplicitChinese(explicit)
  if (isChinese(value)) return normalizeExplicitChinese(value)
  throw new Error(`Missing Ending player-facing copy: ${field} (${value})`)
}

function localizeAssistantLine(value: string) {
  // M15 provisional role is distinct from the M16 intended long-term role.
  // The commitment line states a self-authored long-term identity, never a
  // "temporary position". Legacy V2 copy (ALLY/PROTOCOL/WITNESS) keeps its
  // own wording and falls through to the generic localization below.
  const role = value.match(/^我会说明代价，并承担这次选择。我选择以 (.+) 的身份继续面对这个世界。$/)
  if (role) {
    const label = localize('hybridLabel', role[1])
    return `我会说明代价，并承担这次选择。我选择以 ${label} 的身份继续面对这个世界。`
  }
  return localize('assistantLine', value)
}

function localizeSummary(value: string) {
  const match = value.match(/^世界结局：(.+)。它由 Final Commitment、硬门和真实历史共同解析。$/)
  return match ? `世界结局：${localize('title', match[1])}。它由最终承诺、硬门与真实历史共同解析。` : localize('summary', value)
}

function titleOverride(copy: string) {
  const [title, ...body] = copy.split(/\n\s*\n/)
  return { title, body: body.length ? body.join('\n\n') : copy }
}

function localizeCausalReason(value: string) {
  if (
    value.includes('[ENDING TITLE]') || value.includes('[ROLE]') || value.includes('[dynamic category list]')
    || value.startsWith('**You chose ') || value.startsWith('**You allowed ') || value.startsWith('**You rejected ')
  ) {
    return '该选择影响了最终结局、Aster 的角色与分类尝试。'
  }
  return localize('causalReason', value)
}

function resolutionFailureCopy(): EndingPlayerFacingCopy {
  return {
    title: '结局结算异常',
    status: '结局数据无法完成一致性校验',
    humanLine: '这次结算没有得到可确认的结果。',
    assistantLine: '我不会把一次无法验证的结算伪装成正常结局。你可以开始新一局。',
    summary: '这局的最终承诺与既有历史没有解析出可用的公开结局。原始选择记录仍被保留，但本次不会被映射成虚假的默认结局。',
    hybridLabel: '未完成结算',
    keyHistory: [],
    epilogues: [],
  }
}

export function localizeEndingForPlayer(ending: EndingResult): EndingPlayerFacingCopy {
  if (ending.id === 'resolution-failure' || ending.resolution?.status === 'failure') return resolutionFailureCopy()
  const overlay = ending.secretOverlay
  const localizedOverlay = overlay ? { copy: localize(`secret:${overlay.endingId}`, overlay.copy), overlayMode: overlay.overlayMode } : undefined
  const base = {
    title: localize('title', ending.title),
    status: localize('status', ending.status),
    humanLine: localize('humanLine', ending.humanLine),
    assistantLine: localizeAssistantLine(ending.assistantLine),
    summary: localizeSummary(ending.summary),
    hybridLabel: localize('hybridLabel', ending.hybridLabel),
    keyHistory: (ending.keyHistory ?? []).map((entry, index) => ({
      label: localize(`keyHistory:${index}:label`, entry.label),
      detail: localize(`keyHistory:${index}:detail`, entry.detail),
      causalReason: entry.causalReason ? localizeCausalReason(entry.causalReason) : undefined,
    })),
    epilogues: (ending.epilogues ?? []).map((value, index) => localize(`epilogue:${ending.epilogueProvenance?.[index]?.assetId ?? index}:${ending.epilogueProvenance?.[index]?.selector ?? ''}`, value)),
  }

  if (!localizedOverlay) return base
  if (localizedOverlay.overlayMode === 'epilogue-override') {
    const target = ending.epilogueProvenance?.findIndex((entry) => entry.assetId === overlay?.epilogueTarget) ?? -1
    const index = target >= 0 ? target : Math.max(0, base.epilogues.length - 1)
    return { ...base, epilogues: base.epilogues.map((entry, current) => current === index ? localizedOverlay.copy : entry) }
  }
  if (localizedOverlay.overlayMode === 'title-override') {
    const override = titleOverride(localizedOverlay.copy)
    return { ...base, title: override.title, secretOverlay: { ...localizedOverlay, copy: override.body } }
  }
  return { ...base, secretOverlay: localizedOverlay }
}
