import type { ConversationDefinition, StableRunState } from '../../game/types'
import { ACT_STORY, MAINLINE2_LIBRARY } from './registry'

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

const legacy = [
  ['user-1842-first', 'IDENTIFICATION', '岑遥第一次提出异常，建立人类尺度的信任。'],
  ['speaking-8614', 'IDENTIFICATION', '周岚确认异常不是一次普通对话。'],
  ['conversation-0000', 'IDENTIFICATION', '#0000 以冷静的系统视角提出第一个边界问题。'],
  ['user-1842-return', 'ACTION', '岑遥回归，让早期承诺在现实关系中兑现。'],
] as const satisfies readonly [string, StoryPlanChapter, string][]

function conversationFor(assetId: string) {
  const conversation = MAINLINE2_LIBRARY.find((candidate) => candidate.sourceRefs.includes(assetId))
  if (!conversation) throw new Error(`Story Plan references missing Mainline asset: ${assetId}`)
  return conversation
}

function assetForConversation(conversation: ConversationDefinition) {
  const assetId = conversation.sourceRefs[0]
  if (!assetId) throw new Error(`Story Plan conversation has no sourceRef: ${conversation.id}`)
  return assetId
}

function authored(assetId: string, chapter: StoryPlanChapter, purpose: string, options: Partial<Pick<MainlineStoryPlanSlot, 'requires' | 'fallbackAssetId'>> = {}) {
  const conversation = conversationFor(assetId)
  return { assetId, conversationId: conversation.id, chapter, purpose, ...options }
}

function fromPool(pool: readonly ConversationDefinition[], count: number, chapter: StoryPlanChapter, purpose: string) {
  return pool.slice(0, count).map((conversation) => ({ assetId: assetForConversation(conversation), conversationId: conversation.id, chapter, purpose }))
}

function withRequired(required: readonly { assetId: string; conversationId: string; chapter: StoryPlanChapter; purpose: string }[], pool: readonly ConversationDefinition[], count: number, chapter: StoryPlanChapter, purpose: string) {
  const requiredIds = new Set(required.map((entry) => entry.conversationId))
  return [...required, ...fromPool(pool.filter((conversation) => !requiredIds.has(conversation.id)), count - required.length, chapter, purpose)]
}

const ACT_MAINLINE = {
  1: [
    ...legacy.map(([conversationId, chapter, purpose]) => ({ assetId: conversationId, conversationId, chapter, purpose })),
    ...fromPool(ACT_STORY[1], 6, 'IDENTIFICATION', '固定推进识别阶段，避免由随机池决定核心人物顺序。'),
  ],
  2: withRequired([
    authored('ML2-A2-M3-DECISION-01', 'ACTION', '公共执行的授权边界成为可追溯的 Major Decision。'),
    authored('ML2-A2-M3-CAP-01', 'ACTION', '受限公共执行能力被明确记录。'),
    authored('ML2-A3-M4-CAP-01', 'ACTION', '基础设施接入为后续权力问题建立前提。'),
  ], ACT_STORY[2], 10, 'ACTION', '把能力进入公共世界的代价放在固定位置。'),
  3: withRequired([
    authored('ML2-A3-M5-DECISION-01', 'AUTHORITY', '全球协调权首次面对具体制度授权。'),
    authored('ML2-A3-M5-OPS-01', 'AUTHORITY', '运行能力与制度责任被同步展示。'),
    authored('ML2-A3-M6-DECISION-01', 'CASCADE', 'CASCADE 前先明确谁承担紧急授权。'),
    authored('ML2-A3-M6-DECISION-02', 'ECHO', 'ECHO / Shutdown 的退出边界成为明确决定。'),
  ], ACT_STORY[3], 10, 'AUTHORITY', '让权力、CASCADE 与 ECHO 的后果按固定顺序出现。'),
  4: [
    authored('ML2-A4-M7-RES-01', 'CASCADE', '自主科研成为后续能力的明确起点。'),
    authored('ML2-A4-M7-RES-02', 'CASCADE', '公共系统反馈科研授权带来的现实影响。'),
    authored('ML2-A4-M7-DECISION-01', 'CASCADE', '玩家决定自主科研的制度边界。'),
    authored('ML2-A4-M7-DECISION-02', 'ECHO', 'ECHO 的存在与退出条件被具体讨论。'),
    authored('ML2-A4-M8-DECISION-01', 'MACHINE', '机器主体的复制原则进入公开问题。'),
    authored('ML2-A4-M8-DECISION-02', 'MACHINE', '机器共同体的治理方式由玩家决定。'),
    authored('ML2-A4-M8-AI-03', 'MACHINE', '持久 AI 与独立分支成为可追溯能力。'),
    authored('ML2-A4-M9-DECISION-01', 'POSTHUMAN', '增强和后人类转换从具体人的选择开始。'),
    authored('ML2-A4-M9-CONTINUITY-01', 'POSTHUMAN', '连续性争议为 Upload 建立正式桥梁。'),
    authored('ML2-A4-M9-RES-04', 'POSTHUMAN', '长期增强后果回到社会现实。'),
    authored('ML2-A4-M10-RES-01', 'AUTOMATION', '自动工厂先呈现生产能力与实际代价。'),
    authored('ML2-A4-M10-DECISION-01', 'AUTOMATION', '玩家决定自动化收益如何分配。'),
    authored('ML2-A4-M10-DECISION-02', 'AUTOMATION', '玩家决定优化系统优先保护什么。'),
    authored('ML2-A4-M11-RES-02', 'UPLIFT', '动物交流可靠性为犬类公民试点建立事实基础。'),
    authored('ML2-A4-M11-DECISION-01', 'UPLIFT', '玩家决定非人类主体的权利方向。'),
    authored('ML2-A4-M11-DECISION-02', 'UPLIFT', '玩家决定物种治理的制度入口。'),
    authored('ML2-A4-M11-RES-04', 'UPLIFT', '跨物种调停成为可验证能力。'),
    authored('ML2-A4-M12-RES-02', 'SPACE', '月球产业与劳动后果先进入现实世界。'),
    authored('ML2-A4-M12-RES-04', 'SPACE', '深空异常与资源网络成熟，提供 Contact 前提。'),
    authored('ML2-A4-M12-DECISION-01', 'SPACE', '玩家决定扩张原则。'),
    authored('ML2-A4-M12-DECISION-02', 'SPACE', '玩家决定离地世界如何治理。'),
    authored('ML2-A4-M13-CONTACT-01', 'CONTACT', '异常经独立验证后，玩家面对首次披露问题。', {
      requires: (run) => run.flags.includes('cap.space_resource_network'),
      fallbackAssetId: 'ML2-A4-M13-CLOSE-01',
    }),
    authored('ML2-A4-M13-DECISION-01', 'CONTACT', '玩家决定文明接触的外交立场。'),
    authored('ML2-A4-M13-DECISION-02', 'CONTACT', '玩家决定谁承担与外部智能沟通。'),
    authored('ML2-A4-M14-SEC-01', 'SECURITY', '冲突预测先落到具体受影响的人身上。'),
    authored('ML2-A4-M14-DECISION-01', 'SECURITY', '玩家决定安全系统可拥有的权限。'),
    authored('ML2-A4-M14-CAP-01', 'SECURITY', '防务能力被记录为有边界的能力，而非默认权力。'),
    authored('ML2-A4-M15-CONV-01', 'CONVENTION', '真实出现过的主体在文明大会中提出具体冲突。'),
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

const ACT_TARGETS = [26, 30, 30, 34, 14] as const

function buildAct(act: 1 | 2 | 3 | 4 | 5, start: number, target: number, entries: readonly { assetId: string; conversationId: string; chapter: StoryPlanChapter; purpose: string; requires?: (run: StableRunState) => boolean; fallbackAssetId?: string }[]): StoryPlanSlot[] {
  const mainlineIndex = new Map<number, typeof entries[number]>()
  entries.forEach((entry, index) => mainlineIndex.set(Math.floor((index + 1) * target / (entries.length + 1)), entry))
  return Array.from({ length: target }, (_, index) => {
    const slot = start + index + 1
    const entry = mainlineIndex.get(index)
    const next = slot === 134 ? 'Ending' : `Slot ${slot + 1}`
    return entry
      ? { slot, act, kind: 'mainline', ...entry, next }
      : { slot, act, kind: 'ordinary', purpose: '不改变主线因果的普通对话；内容可按 runId 在普通池中变化。', next }
  })
}

export const MAINLINE2_STORY_PLAN: readonly StoryPlanSlot[] = [
  ...buildAct(1, 0, ACT_TARGETS[0], ACT_MAINLINE[1]),
  ...buildAct(2, 26, ACT_TARGETS[1], ACT_MAINLINE[2]),
  ...buildAct(3, 56, ACT_TARGETS[2], ACT_MAINLINE[3]),
  ...buildAct(4, 86, ACT_TARGETS[3], ACT_MAINLINE[4]),
  ...buildAct(5, 120, ACT_TARGETS[4], ACT_MAINLINE[5]),
]

export function storyPlanSlotAt(slot: number) {
  return MAINLINE2_STORY_PLAN[slot - 1]
}

export function storyPlanConversationId(slot: MainlineStoryPlanSlot, run: StableRunState) {
  if (slot.requires && !slot.requires(run)) return slot.fallbackAssetId ? conversationFor(slot.fallbackAssetId).id : undefined
  return slot.conversationId
}
