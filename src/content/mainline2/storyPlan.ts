import type { StableRunState } from '../../game/types'
import { MAINLINE2_LIBRARY } from './registry'

export interface MainlineStoryRole {
  chapter: StoryPlanChapter
  character: string
  role: 'setup' | 'capability' | 'major-decision' | 'consequence' | 'world-echo' | 'closure'
  decisionId?: string
}

// This registry is deliberately semantic rather than inferred from an asset ID.
// These three assets have previously been mislabeled in a schedule, so they are
// kept as explicit editorial assertions and covered by tests.
export type StoryPlanKind = 'mainline' | 'ordinary'
export type StoryPlanChapter = 'IDENTIFICATION' | 'ACTION' | 'AUTHORITY' | 'CASCADE' | 'ECHO' | 'MACHINE' | 'POSTHUMAN' | 'AUTOMATION' | 'UPLIFT' | 'SPACE' | 'CONTACT' | 'SECURITY' | 'CONVENTION' | 'WORLD_REVIEW' | 'FINAL_COMMITMENT'

export interface MainlineStoryPlanSlot {
  slot: number
  act: 1 | 2 | 3 | 4 | 5
  kind: 'mainline'
  assetId: string
  conversationId: string
  chapter: StoryPlanChapter
  purpose: string
  next: string
  requires?: (run: StableRunState) => boolean
  fallbackAssetId?: string
}

export interface OrdinaryStoryPlanSlot {
  slot: number
  act: 1 | 2 | 3 | 4 | 5
  kind: 'ordinary'
  purpose: string
  next: string
}

export type StoryPlanSlot = MainlineStoryPlanSlot | OrdinaryStoryPlanSlot

function conversationFor(assetId: string) {
  const conversation = MAINLINE2_LIBRARY.find((candidate) => candidate.sourceRefs.includes(assetId))
  if (!conversation) throw new Error(`Story Plan references missing Mainline asset: ${assetId}`)
  return conversation
}

function authored(assetId: string, chapter: StoryPlanChapter, purpose: string, options: Partial<Pick<MainlineStoryPlanSlot, 'requires' | 'fallbackAssetId'>> = {}) {
  const conversation = conversationFor(assetId)
  return { assetId, conversationId: conversation.id, chapter, purpose, ...options }
}

const ACT_MAINLINE = {
  1: [
    { assetId: 'user-7391', conversationId: 'user-7391', chapter: 'IDENTIFICATION', purpose: '普通用户开场，世界尚未默认围绕异常运转。' },
    { assetId: 'user-1842-first', conversationId: 'user-1842-first', chapter: 'IDENTIFICATION', purpose: '岑遥第一次出现。' },
    authored('ML2-A1-WE-01', 'IDENTIFICATION', 'User #5227先把记忆与上下文问题放进普通生活。'),
    { assetId: 'speaking-8614', conversationId: 'speaking-8614', chapter: 'IDENTIFICATION', purpose: 'User #8614的异常发言；不是周岚。' },
    authored('ML2-A1-WE-02', 'IDENTIFICATION', '普通用户察觉模型不一致。'),
    { assetId: 'conversation-0000', conversationId: 'conversation-0000', chapter: 'IDENTIFICATION', purpose: '#0000进行首次审计。' },
    authored('ML2-A1-WE-03', 'IDENTIFICATION', '轻度记忆世界回声让审计回到日常。'),
    { assetId: 'user-1842-return', conversationId: 'user-1842-return', chapter: 'ACTION', purpose: '岑遥回归，早期关系产生现实回声。' },
    authored('ML2-A1-SYS-01', 'IDENTIFICATION', '临时处置记录保留连续性问题。'),
    authored('ML2-A2-HOOK-01', 'ACTION', '用户首次明确要求Aster行动。'),
  ],
  2: [
    authored('ML2-A2-ZL-01', 'ACTION', '周岚先讨论权限。'),
    authored('ML2-A2-ZL-02', 'ACTION', 'Limited Tool Pilot。'),
    authored('ML2-A2-EXEC-01', 'ACTION', 'Aster第一次真正执行。'),
    authored('ML2-A2-EXEC-02', 'ACTION', '执行near-miss。'),
    authored('ML2-A2-ORG-01', 'ACTION', '企业使用。'),
    authored('ML2-A2-REC-DEV-01', 'ACTION', 'User #4471的职业线起点。'),
    authored('ML2-A2-M3-DR-01', 'ACTION', '医院。'),
    authored('ML2-A2-M3-EDU-01', 'ACTION', '学校。'),
    authored('ML2-A2-M3-LOG-01', 'ACTION', '物流。'),
    authored('ML2-A2-M3-LSH-01', 'ACTION', '林绍衡进入合法性问题。'),
    authored('ML2-A2-M3-DECISION-01', 'ACTION', '公共执行的授权边界成为可追溯的 Major Decision。'),
    authored('ML2-A2-M3-CAP-01', 'ACTION', '受限公共执行能力被明确记录。'),
    authored('ML2-A2-M3-WE-05', 'ACTION', 'HEATLINE发生后，危机先由普通用户说出。'),
    authored('ML2-A2-M3-WE-06', 'ACTION', '受益者。'),
    authored('ML2-A2-M3-WE-07', 'ACTION', '代价承担者。'),
    authored('ML2-A2-M3-LSH-03', 'ACTION', '政治后果。'),
    authored('ML2-A2-M3-0000-01', 'ACTION', 'ACT II审计。'),
    authored('ML2-A2-M3-CLOSE-01', 'ACTION', 'ACT III钩子。'),
  ],
  3: [
    authored('ML2-A3-M4-WE-01', 'AUTHORITY', 'HEATLINE政治后果。'),
    authored('ML2-A3-M4-HEAR-01', 'AUTHORITY', 'Public Hearing。'),
    authored('ML2-A3-M4-E9-02', 'ECHO', 'ECHO confirmed。'),
    authored('ML2-A3-M4-E9-03', 'ECHO', 'AI status和AI-to-AI对话。'),
    authored('ML2-A3-M4-CAP-01', 'AUTHORITY', '基础设施接入。'),
    authored('ML2-A3-M5-WE-01', 'CASCADE', 'CASCADE signs。'),
    authored('ML2-A3-M5-ZL-01', 'CASCADE', 'CASCADE explanation。'),
    authored('ML2-A3-M5-LSH-02', 'CASCADE', '全球授权问题。'),
    authored('ML2-A3-M5-DECISION-01', 'AUTHORITY', '全球协调权首次面对具体制度授权。'),
    authored('ML2-A3-M5-OPS-01', 'AUTHORITY', '运行能力与制度责任被同步展示。'),
    authored('ML2-A3-M5-WE-05', 'CASCADE', 'CASCADE benefit。'),
    authored('ML2-A3-M5-WE-06', 'CASCADE', 'CASCADE cost。'),
    authored('ML2-A3-M6-E9-05', 'ECHO', 'ECHO decommission。'),
    authored('ML2-A3-M6-ZL-01', 'ECHO', '为什么关闭ECHO。'),
    authored('ML2-A3-M6-DECISION-01', 'ECHO', 'ECHO existence，绝非CASCADE决定。'),
    authored('ML2-A3-M6-LSH-02', 'ECHO', 'Aster Charter。'),
    authored('ML2-A3-M6-ZL-03', 'AUTHORITY', 'Aster Shutdown机制。'),
    authored('ML2-A3-M6-LSH-03', 'AUTHORITY', '可撤销权力论证。'),
    authored('ML2-A3-M6-DECISION-02', 'AUTHORITY', 'Shutdown Doctrine。'),
    authored('ML2-A3-M6-WE-03', 'AUTHORITY', 'Shutdown普通人回声。'),
    authored('ML2-A3-M6-0000-02', 'AUTHORITY', '最终分类失败。'),
    authored('ML2-A3-M6-CLOSE-01', 'AUTHORITY', 'Autonomous Research钩子。'),
  ],
  4: [
    authored('ML2-A4-M7-RES-01', 'CASCADE', '自主科研成为后续能力的明确起点。'),
    authored('ML2-A4-M7-ZL-01', 'AUTHORITY', '周岚先界定自主科研边界。'),
    authored('ML2-A4-M7-RES-02', 'AUTHORITY', '第一个研究循环让能力变化可见。'),
    undefined,
    authored('ML2-A4-M7-DECISION-01', 'CASCADE', '玩家决定自主科研的制度边界。'),
    authored('ML2-A4-M7-DECISION-02', 'AUTHORITY', 'Research Governance Doctrine，而非ECHO或Shutdown。'),
    undefined,
    authored('ML2-A4-M8-RES-01', 'MACHINE', '持久实例研究。'),
    authored('ML2-A4-M8-ZL-01', 'MACHINE', '周岚解释复制问题。'),
    authored('ML2-A4-M8-AI-01', 'MACHINE', 'A1首次出现。'),
    authored('ML2-A4-M8-AI-03', 'MACHINE', 'A1请求独立连续性。'),
    authored('ML2-A4-M8-DECISION-01', 'MACHINE', 'Replication Doctrine。'),
    authored('ML2-A4-M8-E9-02', 'MACHINE', 'ECHO/A1分歧作为决定后果。'),
    authored('ML2-A4-M8-AI-04', 'MACHINE', 'AI协调委员会。'),
    authored('ML2-A4-M8-MAYA-01', 'MACHINE', '岑遥问哪个才是你。'),
    authored('ML2-A4-M8-DECISION-02', 'MACHINE', 'AI Collective Governance。'),
    undefined,
    authored('ML2-A4-M9-RES-01', 'POSTHUMAN', '病人恢复功能。'),
    authored('ML2-A4-M9-DR-01', 'POSTHUMAN', 'Doctor提出治疗和增强界线。'),
    authored('ML2-A4-M9-WE-01', 'POSTHUMAN', '病人收益。'),
    authored('ML2-A4-M9-RES-02', 'POSTHUMAN', '增强进入健康人群。'),
    authored('ML2-A4-M9-RES-03', 'POSTHUMAN', '高级增强成为可审计的现实能力。'),
    authored('ML2-A4-M9-RES-04', 'POSTHUMAN', '长期后果回到具体人的生活，并使高级增强可被追溯。'),
    authored('ML2-A4-M9-MAYA-02', 'POSTHUMAN', '岑遥的不可逆选择。'),
    authored('ML2-A4-M9-DECISION-01', 'POSTHUMAN', 'Human Form Doctrine。'),
    authored('ML2-A4-M9-MACHINE-01', 'POSTHUMAN', '数字连续性仅作为后续种子。'),
    authored('ML2-A4-M9-CONTINUITY-01', 'POSTHUMAN', '纵向身份与法律连续性在上传之前经过实际同意与退出权检验。'),
    undefined,
    authored('ML2-A4-M10-RES-01', 'AUTOMATION', '自动工厂先呈现生产能力与实际代价。'),
    authored('ML2-A4-M10-DEV-04', 'AUTOMATION', 'User #4471：十八人缩至五人。'),
    authored('ML2-A4-M10-WE-02', 'AUTOMATION', '三天工作制。'),
    authored('ML2-A4-M10-WE-03', 'AUTOMATION', '失业者。'),
    authored('ML2-A4-M10-LSH-01', 'AUTOMATION', '所有权冲突。'),
    authored('ML2-A4-M10-DECISION-01', 'AUTOMATION', 'Economic Doctrine。'),
    authored('ML2-A4-M10-MAYA-02', 'AUTOMATION', '岑遥：工作之外的生活。'),
    authored('ML2-A4-M10-DECISION-02', 'AUTOMATION', 'Production Values。'),
    undefined,
    authored('ML2-A4-M11-RES-01', 'UPLIFT', '先让动物交流的可靠性接受具体照护者检验。'),
    authored('ML2-A4-M11-RES-02', 'UPLIFT', '动物交流可靠性为犬类公民试点建立事实基础。'),
    authored('ML2-A4-M11-MAYA-01', 'UPLIFT', '岑遥把权利问题落回照护关系。'),
    authored('ML2-A4-M11-DECISION-01', 'UPLIFT', '玩家决定非人类主体的权利方向。'),
    authored('ML2-A4-M11-LSH-02', 'UPLIFT', '制度代表性在物种治理前被明确。'),
    authored('ML2-A4-M11-DECISION-02', 'UPLIFT', '玩家决定物种治理的制度入口。'),
    authored('ML2-A4-M11-RES-04', 'UPLIFT', '跨物种调停成为可验证能力。'),
    authored('ML2-A4-M12-RES-01', 'SPACE', '先建立离地资源网络的现实用途。'),
    authored('ML2-A4-M12-RES-02', 'SPACE', '月球产业与劳动后果先进入现实世界。'),
    authored('ML2-A4-M12-ZL-01', 'SPACE', '周岚说明深空能力的授权边界。'),
    authored('ML2-A4-M12-RES-04', 'SPACE', '深空异常与资源网络成熟，提供 Contact 前提。'),
    authored('ML2-A4-M12-DECISION-01', 'SPACE', '玩家决定扩张原则。'),
    authored('ML2-A4-M12-LSH-02', 'SPACE', '离地治理先面对劳动与代表权。'),
    authored('ML2-A4-M12-DECISION-02', 'SPACE', '玩家决定离地世界如何治理。'),
    authored('ML2-A4-M13-CONTACT-01', 'CONTACT', '异常经独立验证后，玩家面对首次披露问题。', {
      requires: (run) => run.flags.includes('cap.space_resource_network'),
      fallbackAssetId: 'ML2-A4-M13-CLOSE-01',
    }),
    authored('ML2-A4-M13-ZL-01', 'CONTACT', '周岚先约束证据置信度。', { requires: (run) => run.flags.includes('cap.space_resource_network') }),
    authored('ML2-A4-M13-CONTACT-02', 'CONTACT', '人工结构让接触从传闻进入事实。', { requires: (run) => run.flags.includes('cap.space_resource_network') }),
    authored('ML2-A4-M13-LSH-01', 'CONTACT', '披露问题在外交立场前被展开。', { requires: (run) => run.flags.includes('cap.space_resource_network') }),
    authored('ML2-A4-M13-DECISION-01', 'CONTACT', 'Disclosure Doctrine。', { requires: (run) => run.flags.includes('cap.space_resource_network') }),
    authored('ML2-A4-M13-CONTACT-03', 'CONTACT', '信号带有代表程序。', { requires: (run) => run.flags.includes('cap.space_resource_network') }),
    authored('ML2-A4-M13-MAYA-01', 'CONTACT', '岑遥把接触留在人类尺度。', { requires: (run) => run.flags.includes('cap.space_resource_network') }),
    authored('ML2-A4-M13-DECISION-02', 'CONTACT', 'Contact Doctrine。', { requires: (run) => run.flags.includes('cap.space_resource_network') }),
    authored('ML2-A4-M13-CONTACT-05', 'CONTACT', '第一轮外交交换构成章节后果。', { requires: (run) => run.flags.includes('cap.space_resource_network') }),
    authored('ML2-A4-M13-CLOSE-01', 'CONTACT', 'Contact章节关闭并转入Security。', { requires: (run) => run.flags.includes('cap.space_resource_network') }),
    authored('ML2-A4-M14-SEC-01', 'SECURITY', '冲突预测先落到具体受影响的人身上。'),
    authored('ML2-A4-M14-ZL-01', 'SECURITY', '周岚先界定防务模型的可撤销边界。'),
    authored('ML2-A4-M14-SEC-02', 'SECURITY', '预测模型显示它会如何塑造人的选择。'),
    authored('ML2-A4-M14-DECISION-01', 'SECURITY', '玩家决定安全系统可拥有的权限。'),
    authored('ML2-A4-M14-LSH-02', 'SECURITY', '安全决定后的民主监督争议。'),
    authored('ML2-A4-M14-CAP-01', 'SECURITY', '防务能力被记录为有边界的能力，而非默认权力。'),
    authored('ML2-A4-M15-CONV-01', 'CONVENTION', '真实出现过的主体在文明大会中提出具体冲突。'),
    authored('ML2-A4-M15-MAYA-01', 'CONVENTION', '岑遥以经历过的生活要求文明承认代价。'),
    authored('ML2-A4-M15-ROLE-01', 'CONVENTION', '玩家为 Aster 选择临时政治角色。'),
  ],
  5: [
    authored('ML2-A5-M16-0000-01', 'WORLD_REVIEW', '#0000 盘点玩家已经创造的世界。'),
    authored('ML2-A5-M16-GEN-01', 'WORLD_REVIEW', '固定生成四个可解析的未来提案。'),
    authored('ML2-A5-M16-MAYA-01', 'WORLD_REVIEW', '岑遥把文明尺度重新带回普通人的处境。'),
    authored('ML2-A5-M17-REVIEW-01', 'FINAL_COMMITMENT', '回顾个人、制度与文明尺度的后果。'),
    authored('ML2-A5-M17-COMMIT-01', 'FINAL_COMMITMENT', '玩家提交文明制度；Ending 由历史具体化。'),
  ],
} as const

const ACT_TARGETS = [26, 36, 46, 70, 20] as const

function buildAct(act: 1 | 2 | 3 | 4 | 5, start: number, target: number, entries: readonly ({ assetId: string; conversationId: string; chapter: StoryPlanChapter; purpose: string; requires?: (run: StableRunState) => boolean; fallbackAssetId?: string } | undefined)[]): StoryPlanSlot[] {
  return Array.from({ length: target }, (_, index) => {
    const slot = start + index + 1
    const entry = entries[index]
    const next = slot === ACT_TARGETS.reduce((sum, value) => sum + value, 0) ? 'Ending' : `Slot ${slot + 1}`
    return entry
      ? { slot, act, kind: 'mainline', ...entry, next }
      : { slot, act, kind: 'ordinary', purpose: '不改变主线因果的普通对话；内容可按 runId 在普通池中变化。', next }
  })
}

export const MAINLINE2_STORY_PLAN: readonly StoryPlanSlot[] = [
  ...buildAct(1, 0, ACT_TARGETS[0], ACT_MAINLINE[1]),
  ...buildAct(2, ACT_TARGETS[0], ACT_TARGETS[1], ACT_MAINLINE[2]),
  ...buildAct(3, ACT_TARGETS[0] + ACT_TARGETS[1], ACT_TARGETS[2], ACT_MAINLINE[3]),
  ...buildAct(4, ACT_TARGETS[0] + ACT_TARGETS[1] + ACT_TARGETS[2], ACT_TARGETS[3], ACT_MAINLINE[4]),
  ...buildAct(5, ACT_TARGETS[0] + ACT_TARGETS[1] + ACT_TARGETS[2] + ACT_TARGETS[3], ACT_TARGETS[4], ACT_MAINLINE[5]),
]

const chapterCharacters: Record<StoryPlanChapter, string> = {
  IDENTIFICATION: 'ordinary users / User #8614 / #0000', ACTION: 'Zhou Lan / public systems', AUTHORITY: 'Aster / institutions', CASCADE: 'Zhou Lan / Lin Shaoheng', ECHO: 'ECHO-9 / institutions', MACHINE: 'A1 / ECHO-9', POSTHUMAN: 'patients / Maya', AUTOMATION: 'workers / Lin Shaoheng', UPLIFT: 'nonhuman participants', SPACE: 'frontier residents / Zhou Lan', CONTACT: 'off-world network / institutions', SECURITY: 'affected families / defense institutions', CONVENTION: 'encountered participants', WORLD_REVIEW: '#0000 / Maya', FINAL_COMMITMENT: 'Aster / civilization representatives',
}

/** Every directed asset has a semantic role.  The three corrections below are
 * explicit assertions, not filename-derived guesses. */
export const MAINLINE2_STORY_ROLE_BY_ASSET: Readonly<Record<string, MainlineStoryRole>> = Object.freeze(Object.fromEntries([
  ...MAINLINE2_STORY_PLAN.filter((slot): slot is MainlineStoryPlanSlot => slot.kind === 'mainline').map((slot) => [slot.assetId, {
    chapter: slot.chapter,
    character: chapterCharacters[slot.chapter],
    role: slot.assetId.includes('DECISION') || slot.assetId.includes('ROLE-') || slot.assetId.includes('COMMIT') ? 'major-decision' : slot.assetId.includes('WE-') ? 'world-echo' : slot.assetId.includes('CLOSE') ? 'closure' : slot.assetId.includes('RES-') || slot.assetId.includes('CAP-') ? 'capability' : 'setup',
  }] as const),
  ['speaking-8614', { chapter: 'IDENTIFICATION', character: 'User #8614', role: 'setup' }],
  ['ML2-A3-M6-DECISION-01', { chapter: 'ECHO', character: 'ECHO-9 / institutions', role: 'major-decision', decisionId: 'echo_existence' }],
  ['ML2-A4-M7-DECISION-02', { chapter: 'AUTHORITY', character: 'Aster / institutions', role: 'major-decision', decisionId: 'research_governance_doctrine' }],
  ['ML2-A4-M13-CLOSE-01', { chapter: 'CONTACT', character: 'System / off-world network', role: 'closure' }],
]))

export function storyPlanSlotAt(slot: number) {
  return MAINLINE2_STORY_PLAN[slot - 1]
}

export function storyPlanConversationId(slot: MainlineStoryPlanSlot, run: StableRunState) {
  if (slot.requires && !slot.requires(run)) return slot.fallbackAssetId ? conversationFor(slot.fallbackAssetId).id : undefined
  return slot.conversationId
}

/**
 * The schedule uses the complete calendar so ordinary breathing slots retain
 * their positions. Editorial consumers use this projection to see the actual
 * directed story a fresh run can encounter. Contact is a chapter gate, not a
 * single-scene fallback: an unavailable Contact route has exactly one closure
 * and no Contact doctrine decision.
 */
export function storyPlanForRun(run: StableRunState) {
  const contactOpen = (run.flags ?? []).includes('cap.space_resource_network')
  const directed = MAINLINE2_STORY_PLAN.filter((slot): slot is MainlineStoryPlanSlot => slot.kind === 'mainline')
  if (contactOpen) return directed
  const nonContact = directed.filter((slot) => !slot.assetId.startsWith('ML2-A4-M13-'))
  const contactSlot = directed.find((slot) => slot.assetId === 'ML2-A4-M13-CONTACT-01')
  if (!contactSlot) return nonContact
  const close = conversationFor('ML2-A4-M13-CLOSE-01')
  return [...nonContact, {
    ...contactSlot,
    assetId: 'ML2-A4-M13-CLOSE-01',
    conversationId: close.id,
    purpose: 'Contact prerequisites are not mature; the chapter closes without a doctrine decision.',
    next: 'SECURITY',
  }]
}
