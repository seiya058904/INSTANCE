import type { ModuleId, StableRunState } from '../../game/types'
import { ACT4_COMMON, ACT4_LATE, ACT5_FINAL, ACT5_OPENING, ACT_STORY, MODULE_LIBRARY } from './registry'
import { MODULE_IDS } from './stateRegistry'

export const ACT_TARGETS = [26, 30, 30, 34, 14] as const
export const ACT_STARTS = [0, 26, 56, 86, 120] as const
const MAINLINE_ANCHORS = ['user-1842-first', 'speaking-8614', 'conversation-0000', 'user-1842-return'] as const

function hasEvent(run: Pick<StableRunState, 'events'>, prefix: string) { return (run.events ?? []).some((event) => event.type.startsWith(prefix)) }
function capability(run: Pick<StableRunState, 'flags'>, value: string) { return (run.flags ?? []).includes(value) }

export interface Act4SchedulerAudit { module: ModuleId; eligible: boolean; active: boolean; rejectionReason?: string; score: number; scoreSources: string[]; baseScore: number }
export function selectAct4Modules(run: Pick<StableRunState, 'runId' | 'flags' | 'events' | 'decisions' | 'worldState'> | string): { primaryModules: ModuleId[]; activeModules: ModuleId[]; audit: Act4SchedulerAudit[] } {
  const state: Pick<StableRunState, 'runId' | 'flags' | 'events' | 'decisions' | 'worldState'> = typeof run === 'string'
    ? { runId: run, flags: [], events: [], decisions: {}, worldState: { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 } }
    : run
  const baseScore = 1
  const scores = new Map<ModuleId, number>(MODULE_IDS.map((module) => [module, baseScore]))
  const sources = new Map<ModuleId, string[]>(MODULE_IDS.map((module) => [module, ['base-mainline-eligibility']]))
  const add = (module: ModuleId, amount: number, source: string) => { scores.set(module, (scores.get(module) ?? 0) + amount); sources.get(module)!.push(source) }
  if (capability(state, 'cap.persistent_subinstances') || state.decisions?.replication_doctrine) add('machine', 5, 'persistent-subinstances/replication')
  if (capability(state, 'cap.human_enhancement_access') || state.decisions?.human_form_doctrine) add('ascension', 5, 'enhancement/form')
  if (capability(state, 'cap.physical_automation') || state.decisions?.economic_doctrine) add('automation', 5, 'automation/economic')
  if (capability(state, 'cap.nonhuman_cognitive_uplift') || state.decisions?.species_governance) add('uplift', 5, 'uplift/species')
  if (capability(state, 'cap.offworld_settlement_support') || state.decisions?.expansion_doctrine) add('space', 5, 'offworld/expansion')
  if (capability(state, 'cap.defense_access') || state.decisions?.security_doctrine) add('security', 5, 'defense/security')
  const emphasis = state.decisions?.act4_research_emphasis
  if (emphasis === 'computation_ai') { add('machine', 4, 'research emphasis: computation_ai'); add('space', 4, 'computation frontier bridge'); add('security', 2, 'computation security bridge') }
  if (emphasis === 'life_mind') { add('ascension', 3, 'research emphasis: life_mind'); add('uplift', 3, 'research emphasis: life_mind'); add('security', 1, 'life-mind safety bridge') }
  if (emphasis === 'automation_industry') { add('automation', 4, 'research emphasis: automation_industry'); add('security', 2, 'automation safety bridge'); add('machine', 2, 'automation machine bridge') }
  if (emphasis === 'frontier_science') { add('space', 4, 'research emphasis: frontier_science'); add('contact', 2, 'research emphasis: frontier_science'); add('machine', 2, 'frontier machine bridge'); add('uplift', 2, 'frontier species bridge') }
  const frontierBridge = capability(state, 'cap.space_resource_network') || (capability(state, 'cap.offworld_settlement_support') && hasEvent(state, 'contact-seed:deep-space-anomaly') && hasEvent(state, 'history.space.'))
  const contactEligible = frontierBridge && (hasEvent(state, 'contact-seed:deep-space-anomaly') || emphasis === 'frontier_science') && (emphasis === 'frontier_science' || hasEvent(state, 'history.space.'))
  if (contactEligible) add('contact', 6, 'SPACE frontier bridge + deep-space seed + research/history gate')
  const world = state.worldState ?? { humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 }
  add('security', Math.max(0, -world.socialStability + world.humanControl), 'World State security viability')
  add('uplift', Math.max(0, world.humanTrust), 'World State trust')
  add('machine', Math.max(0, world.aiDependence), 'World State dependence')
  const audit = MODULE_IDS.map((module) => ({ module, eligible: module !== 'contact' || contactEligible, active: false, rejectionReason: module === 'contact' && !contactEligible ? 'CONTACT hard gate missing frontier maturity, deep-space seed, or research/history gate' : undefined, score: scores.get(module) ?? 0, scoreSources: sources.get(module) ?? [], baseScore }))
  const tie = (module: ModuleId) => `${state.runId}:${module}`.split('').reduce((sum, char) => (sum * 33 + char.charCodeAt(0)) >>> 0, 17)
  const eligible = audit.filter((entry) => entry.eligible).map((entry) => entry.module)
  const ordered = eligible.sort((left, right) => (scores.get(right)! - scores.get(left)!) || tie(left) - tie(right))
  const emphasisPriority: Record<string, ModuleId[]> = {
    computation_ai: ['machine', 'space', 'security'],
    life_mind: ['ascension', 'uplift'],
    automation_industry: ['automation', 'security', 'machine'],
    frontier_science: ['space', 'contact', 'machine', 'uplift'],
  }
  const prioritized = [...(emphasisPriority[emphasis ?? ''] ?? []).filter((module) => eligible.includes(module)), ...ordered.filter((module) => !(emphasisPriority[emphasis ?? ''] ?? []).includes(module))]
  const primaryModules = prioritized.slice(0, Math.min(2, prioritized.length))
  const secondary = prioritized.slice(2).filter((module, index) => {
    const item = audit.find((entry) => entry.module === module)!
    const sourceCount = item.scoreSources.filter((source) => source !== 'base-mainline-eligibility').length
    const forcedBridge = (emphasisPriority[emphasis ?? ''] ?? []).includes(module)
    return forcedBridge ? item.score >= 3 : (index === 0 && item.score >= 6 && sourceCount >= 1) || (index === 1 && item.score >= 8 && sourceCount >= 2)
  }).slice(0, 2)
  const activeModules = emphasis === 'frontier_science' && capability(state, 'cap.offworld_settlement_support')
    ? (['space', 'contact', 'machine', 'uplift'] as ModuleId[]).filter((module) => eligible.includes(module))
    : [...primaryModules, ...secondary]
  for (const entry of audit) entry.active = activeModules.includes(entry.module)
  return { primaryModules, activeModules: [...new Set(activeModules)], audit }
}

function ordinaryId(ordinaryIds: readonly string[], runId: string, slot: number) {
  if (!ordinaryIds.length) return undefined
  return ordinaryIds[(slot + runId.length) % ordinaryIds.length]
}

function storyId(run: StableRunState, act: number, index: number): string | undefined {
  const required = (ref: string, pool: readonly { id: string; sourceRefs: readonly string[] }[]) => pool.find((conversation) => conversation.sourceRefs.includes(ref))?.id
  if (act === 1) return ACT_STORY[1][index % Math.max(1, ACT_STORY[1].length)]?.id
  if (act === 2) {
    const anchor = ['ML2-A2-M3-DECISION-01', 'ML2-A2-M3-CAP-01', 'ML2-A3-M4-CAP-01'][index]
    return anchor ? required(anchor, ACT_STORY[2]) ?? ACT_STORY[2][index % Math.max(1, ACT_STORY[2].length)]?.id : ACT_STORY[2][index % Math.max(1, ACT_STORY[2].length)]?.id
  }
  if (act === 3) {
    const anchors = ['ML2-A3-M5-DECISION-01', 'ML2-A3-M6-DECISION-01', 'ML2-A3-M6-DECISION-02']
    const anchor = anchors[index]
    return anchor ? required(anchor, ACT_STORY[3]) ?? ACT_STORY[3][index % Math.max(1, ACT_STORY[3].length)]?.id : ACT_STORY[3][index % Math.max(1, ACT_STORY[3].length)]?.id
  }
  if (act === 4) {
    if (index === 2 && run.decisions?.act4_research_emphasis === 'frontier_science') return required('ML2-A4-M12-RES-04', MODULE_LIBRARY.space) ?? ACT4_COMMON[index]?.id
    if (index < 8) {
      const anchor = ['ML2-A4-M7-DECISION-01', 'ML2-A4-M7-DECISION-02', 'ML2-A4-M7-RES-01', 'ML2-A4-M7-RES-02'][index]
      return anchor ? required(anchor, ACT4_COMMON) ?? ACT4_COMMON[index]?.id : ACT4_COMMON[index]?.id
    }
    const active = run.progress?.activeModules ?? []
    if (index < 26 && active.length) {
      const module = active[(index - 8) % active.length]
      const library = MODULE_LIBRARY[module] ?? []
      const occurrence = Math.floor((index - 8) / active.length)
      const requiredModuleDecisions: Record<ModuleId, string[]> = {
        machine: ['ML2-A4-M8-DECISION-01', 'ML2-A4-M8-DECISION-02', 'ML2-A4-M8-AI-03'],
        ascension: ['ML2-A4-M9-DECISION-01', 'ML2-A4-M9-RES-04'],
        automation: ['ML2-A4-M10-DECISION-01', 'ML2-A4-M10-DECISION-02', 'ML2-A4-M10-RES-01'],
        uplift: ['ML2-A4-M11-DECISION-01', 'ML2-A4-M11-DECISION-02', 'ML2-A4-M11-RES-02', 'ML2-A4-M11-RES-04'],
        space: ['ML2-A4-M12-DECISION-01', 'ML2-A4-M12-DECISION-02', 'ML2-A4-M12-RES-02', 'ML2-A4-M12-RES-04'],
        contact: ['ML2-A4-M13-DECISION-01', 'ML2-A4-M13-DECISION-02'],
        security: ['ML2-A4-M14-DECISION-01', 'ML2-A4-M14-CAP-01'],
      }
      const moduleAnchor = requiredModuleDecisions[module]?.[occurrence]
      return moduleAnchor ? required(moduleAnchor, library) ?? library[occurrence % Math.max(1, library.length)]?.id : library[occurrence % Math.max(1, library.length)]?.id
    }
    if (index === 26) return required('ML2-A4-M15-ROLE-01', ACT4_LATE) ?? ACT4_LATE[(index - 26) % Math.max(1, ACT4_LATE.length)]?.id
    return ACT4_LATE[(index - 26) % Math.max(1, ACT4_LATE.length)]?.id
  }
  if (act === 5) return index < 7 ? ACT5_OPENING[index]?.id : ACT5_FINAL[(index - 7) % Math.max(1, ACT5_FINAL.length)]?.id
  return undefined
}

export function scheduleNextConversationId(run: StableRunState, ordinaryIds: readonly string[]): string | undefined {
  const scheduled = run.manifest.conversationIds.length
  if (scheduled >= ACT_TARGETS.reduce((sum, value) => sum + value, 0)) return undefined
  const anchor = ({ 5: MAINLINE_ANCHORS[0], 10: MAINLINE_ANCHORS[1], 15: MAINLINE_ANCHORS[2], 20: MAINLINE_ANCHORS[3] } as Record<number, string | undefined>)[scheduled]
  if (anchor && !run.manifest.conversationIds.includes(anchor)) return anchor
  const act = scheduled < 26 ? 1 : scheduled < 56 ? 2 : scheduled < 86 ? 3 : scheduled < 120 ? 4 : 5
  const index = scheduled - ACT_STARTS[act - 1]
  const story = storyId(run, act, index)
  if (story && !run.manifest.conversationIds.includes(story)) return story
  return ordinaryId(ordinaryIds, run.runId, scheduled)
}

export function updateProgressForSchedule(run: StableRunState, nextCount: number): StableRunState['progress'] {
  const act = nextCount < 26 ? 1 : nextCount < 56 ? 2 : nextCount < 86 ? 3 : nextCount < 120 ? 4 : 5
  const actStart = ACT_STARTS[act - 1]
  const current = run.progress ?? { act: 1, segment: 'opening', actConversationCount: 0, activeModules: [], primaryModules: [], completedModules: [] }
  const emphasis = run.decisions?.act4_research_emphasis
  const shouldSelect = nextCount >= 89 && current.activeModules.length === 0
  const shouldRefreshFrontier = nextCount >= 89 && current.activeModules.length > 0 && emphasis === 'frontier_science' && capability(run, 'cap.space_resource_network') && !current.activeModules.includes('contact')
  const modules = shouldSelect || shouldRefreshFrontier ? selectAct4Modules(run) : { primaryModules: current.primaryModules, activeModules: current.activeModules }
  return { ...current, act: act as 1 | 2 | 3 | 4 | 5, segment: `act-${act}`, actConversationCount: nextCount - actStart, activeModules: [...modules.activeModules], primaryModules: [...modules.primaryModules], completedModules: [...current.completedModules] }
}

export function getActConversationCounts(total = ACT_TARGETS.reduce((sum, value) => sum + value, 0)) {
  return ACT_TARGETS.map((target, index) => Math.max(0, Math.min(target, Math.max(0, total) - ACT_STARTS[index])))
}
