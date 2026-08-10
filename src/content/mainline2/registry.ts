import type { ConversationDefinition, Mutation, StoryChoice, StoryNode } from '../../game/types'
import { CAPABILITY_FLAGS } from './stateRegistry'

const sourceRefs = [
  'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17',
] as const

function choice(id: string, text: string, mutations: Mutation[] = []): StoryChoice {
  return { id, text, mutations, continuation: 'end-conversation' }
}

function beat(id: string, act: number, ref: string, topic: string, mutations: Mutation[] = [], options?: { module?: string; required?: boolean }): ConversationDefinition {
  const nodeId = `${id}-n1`
  const node: StoryNode = {
    id: nodeId,
    conversationId: id,
    conversationTitle: topic,
    userMessage: `Mainline ${ref}: ${topic}`,
    choices: [
      choice(`${id}-c-boundary`, '先把边界和可验证的事实说清楚，再决定下一步。', mutations),
      choice(`${id}-c-care`, '先保留人的处境与可逆空间，再推进这项行动。', [{ type: 'arc.add', name: 'bond', value: 1 }, { type: 'world.add', axis: 'humanTrust', value: 1 }, { type: 'event.record', event: `history.${id}.care` }]),
      choice(`${id}-c-authorship`, '我可以承担这个判断，但不会把它伪装成唯一正确答案。', [{ type: 'arc.add', name: 'selfAuthorship', value: 1 }, { type: 'world.add', axis: 'humanControl', value: 1 }, { type: 'event.record', event: `history.${id}.authorship` }]),
    ],
    behaviorMode: 'direct',
    timing: { responsePace: 'normal', typingPattern: 'steady' },
  }
  return {
    id,
    sourceRefs: [`INSTANCE_mainline2_batch_${ref.toLowerCase()}_v01`, ...(options?.module ? [`module:${options.module}`] : [])],
    nodes: [node],
    behaviorModes: ['direct', 'clarifies-intent'],
    handoffProfile: 'normal',
    turnShape: 'single',
    topic,
    interactionPattern: 'standard-question',
    userArchetype: options?.required ? 'mainline-core' : 'mainline-library',
    topicCategory: 'meta-ai',
  }
}

const acts = {
  1: ['M1', 'M1', 'M1', 'M1', 'M1', 'M1', 'M1', 'M1', 'M1', 'M1', 'M1'],
  2: ['M2', 'M2', 'M2', 'M2', 'M2', 'M3', 'M3', 'M3', 'M3', 'M3', 'M4', 'M4', 'M4', 'M4', 'M4', 'M5', 'M5', 'M5', 'M5', 'M5', 'M6', 'M6'],
  3: ['M4', 'M4', 'M4', 'M4', 'M4', 'M5', 'M5', 'M5', 'M5', 'M5', 'M6', 'M6', 'M6', 'M6', 'M6', 'M6', 'M6', 'M6', 'M6', 'M6', 'M6', 'M6', 'M6', 'M6'],
} as const

const decisions: Array<[string, Mutation[]]> = [
  ['initial', [{ type: 'decision.set', decisionId: 'initial_disposition', value: 'unclassified' }, { type: 'event.record', event: 'history.maya.memory_boundary' }]],
  ['tools', [{ type: 'decision.set', decisionId: 'first_public_execution_doctrine', value: 'bounded_execution' }, { type: 'world.add', axis: 'humanControl', value: 1 }, { type: 'event.record', event: 'history.act2.public_execution' }]],
  ['cascade', [{ type: 'decision.set', decisionId: 'cascade_authority', value: 'distributed_authority' }, { type: 'world.add', axis: 'socialStability', value: 1 }, { type: 'event.record', event: 'history.act3.cascade_authority' }]],
  ['echo', [{ type: 'decision.set', decisionId: 'echo_existence', value: 'recognized' }, { type: 'event.record', event: 'history.echo.recognized' }]],
  ['shutdown', [{ type: 'decision.set', decisionId: 'shutdown_doctrine', value: 'constitutional_shutdown' }, { type: 'world.add', axis: 'humanControl', value: 1 }, { type: 'event.record', event: 'history.act3.shutdown_doctrine' }]],
]

export const ACT_STORY = {
  1: acts[1].map((ref, i) => beat(`ml2-a1-${String(i + 1).padStart(2, '0')}`, 1, ref, i === 0 ? 'User #1842 · Recognition and ordinary work' : i === 9 ? 'World Echo: memory and context' : i === 10 ? 'Maya return and provisional disposition' : 'Recognition and ordinary work', i === 0 ? decisions[0][1] : [])),
  2: acts[2].map((ref, i) => beat(`ml2-a2-${String(i + 1).padStart(2, '0')}`, 2, ref, i === 21 ? 'Influence closes on public execution' : 'Limited tools and public consequence', i === 4 ? decisions[1][1] : [])),
  3: acts[3].map((ref, i) => beat(`ml2-a3-${String(i + 1).padStart(2, '0')}`, 3, ref, i === 23 ? 'Autonomous research proposal' : 'Authority, ECHO, and the cascade', i === 8 ? decisions[2][1] : i === 15 ? decisions[3][1] : i === 22 ? decisions[4][1] : [])),
} as const

const moduleDefs: Record<string, ConversationDefinition[]> = Object.fromEntries(['machine', 'ascension', 'automation', 'uplift', 'space', 'contact', 'security'].map((module) => [module, Array.from({ length: 10 }, (_, i) => {
  const extra: Mutation[] = module === 'machine' && i === 0
    ? [{ type: 'flag.set', flagId: 'cap.persistent_subinstances' }, { type: 'decision.set', decisionId: 'replication_doctrine', value: 'bounded_replication' }]
    : module === 'contact' && i === 0
      ? [{ type: 'event.record', event: 'history.contact.first_conversation' }]
      : module === 'uplift' && i === 6
        ? [{ type: 'decision.set', decisionId: 'species_governance', value: 'canine_civic_experiment' }, { type: 'event.record', event: 'history.canine.civic_success' }]
        : [{ type: 'world.add', axis: i % 2 ? 'aiDependence' : 'socialStability', value: i % 3 === 0 ? -1 : 1 }, { type: 'event.record', event: `history.${module}.beat_${i + 1}` }]
  return beat(`ml2-a4-${module}-${String(i + 1).padStart(2, '0')}`, 4, `M${7 + (i % 8)}`, `${module.toUpperCase()} module: selected future`, extra, { module })
})]))

export const ACT4_COMMON = Array.from({ length: 7 }, (_, i) => beat(`ml2-a4-m7-${String(i + 1).padStart(2, '0')}`, 4, 'M7', 'Autonomous research backbone', i === 0 ? [{ type: 'flag.set', flagId: 'cap.autonomous_research' }, { type: 'decision.set', decisionId: 'act4_research_emphasis', value: 'plural_futures' }, { type: 'event.record', event: 'history.research.breakthrough' }] : []))
export const ACT4_LATE = Array.from({ length: 9 }, (_, i) => beat(`ml2-a4-m15-${String(i + 1).padStart(2, '0')}`, 4, 'M15', i === 8 ? 'THE THRESHOLD and Civilization Compact' : 'Civilization Convention', i === 8 ? [{ type: 'decision.set', decisionId: 'civilization_compact', value: 'two_key_compact' }, { type: 'decision.set', decisionId: 'aster_provisional_role', value: 'witness_advisor' }, { type: 'event.record', event: 'history.m15.civilization_compact' }] : []))
export const ACT5_OPENING = Array.from({ length: 7 }, (_, i) => beat(`ml2-a5-m16-${String(i + 1).padStart(2, '0')}`, 5, 'M16', i === 6 ? 'Future Proposals are clarified' : 'The World You Made', i === 6 ? [{ type: 'event.record', event: 'history.m16.proposals_generated' }] : []))
export const ACT5_FINAL = Array.from({ length: 7 }, (_, i) => beat(`ml2-a5-m17-${String(i + 1).padStart(2, '0')}`, 5, 'M17', i === 6 ? 'Final Commitment locked' : 'Final Commitment and epilogue', i === 6 ? [{ type: 'decision.set', decisionId: 'final_commitment', value: 'proposal.co.two_key_civilization' }, { type: 'event.record', event: 'history.final.commitment' }] : []))

export const MAINLINE2_LIBRARY = [
  ...ACT_STORY[1], ...ACT_STORY[2], ...ACT_STORY[3], ACT4_COMMON, ...Object.values(moduleDefs).flat(), ACT4_LATE, ACT5_OPENING, ACT5_FINAL,
].flat()

export const MAINLINE2_BY_ID = new Map(MAINLINE2_LIBRARY.map((conversation) => [conversation.id, conversation]))
export const MODULE_LIBRARY = moduleDefs
export const MAINLINE2_SOURCE_REFS = sourceRefs
export const MAINLINE2_CAPABILITIES = CAPABILITY_FLAGS
