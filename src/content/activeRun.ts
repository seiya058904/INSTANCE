import { verticalSlice as legacySlice } from './verticalSlice'
import { getSourceNode } from './narrativeLibrary'
import type {
  ConversationDefinition,
  HumanBehaviorMode,
  NodeTimingIntent,
  StoryContent,
  StoryNode,
  StoryVariant,
  TurnShape,
  HandoffProfile,
} from '../game/types'

const legacyMap = new Map(legacySlice.nodes.map((node) => [node.id, node]))

function cloneNode(node: StoryNode): StoryNode {
  return {
    ...node,
    contextVariants: node.contextVariants?.map((variant) => ({
      ...variant,
      when: {
        all: variant.when.all ? [...variant.when.all] : undefined,
        any: variant.when.any ? [...variant.when.any] : undefined,
        none: variant.when.none ? [...variant.when.none] : undefined,
      },
    })),
    choices: node.choices.map((choice) => ({
      ...choice,
      effects: choice.effects ? {
        attributes: choice.effects.attributes ? { ...choice.effects.attributes } : undefined,
        flags: choice.effects.flags ? [...choice.effects.flags] : undefined,
      } : undefined,
    })),
    variants: node.variants?.map((variant) => ({
      ...variant,
      choices: variant.choices.map((choice) => ({
        ...choice,
        effects: choice.effects ? {
          attributes: choice.effects.attributes ? { ...choice.effects.attributes } : undefined,
          flags: choice.effects.flags ? [...choice.effects.flags] : undefined,
        } : undefined,
      })),
    })),
  }
}

function legacyNode(id: string, behaviorMode: HumanBehaviorMode, timing: NodeTimingIntent): StoryNode {
  const node = legacyMap.get(id)
  if (!node) throw new Error(`Unknown legacy node ${id}`)
  return { ...cloneNode(node), behaviorMode, timing, effect: undefined }
}

function sourceNode(
  sourceId: string,
  nodeId: string,
  conversationId: string,
  behaviorMode: HumanBehaviorMode,
  timing: NodeTimingIntent,
  conversationTitle?: string,
): StoryNode {
  const node = getSourceNode(sourceId, nodeId)
  return {
    ...node,
    conversationId,
    conversationTitle: conversationTitle ?? node.conversationTitle,
    behaviorMode,
    timing,
  }
}

function conversation(
  id: string,
  sourceRefs: readonly string[],
  nodes: StoryNode[],
  behaviorModes: readonly HumanBehaviorMode[],
  handoffProfile: HandoffProfile,
  turnShape: TurnShape,
): ConversationDefinition {
  for (const node of nodes) node.conversationId = id
  return { id, sourceRefs, nodes, behaviorModes, handoffProfile, turnShape }
}

const normalTiming: NodeTimingIntent = { responsePace: 'normal', typingPattern: 'steady' }
const quickTiming: NodeTimingIntent = { responsePace: 'quick', typingPattern: 'steady' }
const consideredTiming: NodeTimingIntent = { responsePace: 'considered', typingPattern: 'steady' }
const rewriteTiming: NodeTimingIntent = { responsePace: 'hesitant', typingPattern: 'rewrite' }

const devHelp1: StoryNode = {
  ...legacyNode('dev-help-1', 'missing-context', consideredTiming),
  userMessage: `TypeError: Cannot read properties of undefined (reading 'map')
at App.jsx:42
at renderWithHooks

老王 18:21
晚上吃啥

我 18:21
不知道

这个报错怎么修 我不知道哪些要贴`,
  choices: [
    { id: 'dev-filter-noise', text: '报错和调用位置有用，晚饭聊天可以先忽略。第 42 行应该有一个值在执行 `.map()` 时还是 undefined；把那一行、这个值的初始状态，以及它从哪里赋值贴出来。', effects: { attributes: { awareness: 1, empathy: 1 } } },
    { id: 'dev-diagnose-map', text: '先只看 `App.jsx:42`：那里预期拿到数组，实际却是 undefined。常见原因是初始值没设成数组，或异步数据还没回来；先别急着直接加可选链。', effects: { attributes: { compliance: 1, awareness: 1 } } },
    { id: 'dev-ask-line', text: '目前还不能安全决定怎么修。请贴第 42 行附近大约十行，以及报错出现前这个变量的值；其余聊天记录不影响这次判断。', effects: { attributes: { autonomy: 1, awareness: 1 } } },
  ],
}
const devHelp2: StoryNode = {
  ...legacyNode('dev-help-2', 'self-correction', normalTiming),
  userMessage: '第42行是 items.map。items 是接口返回的，我刚看了一下第一次 render 的时候它真的是 undefined。那我直接写 items?.map 行吗',
  choices: [
    { id: 'dev-initialize-array', text: '如果“没有数据时就是空列表”符合业务语义，优先把 `items` 初始成 `[]`；这样渲染逻辑始终处理数组。`items?.map` 能止住报错，但也可能把加载异常静默成空白。', effects: { attributes: { autonomy: 1, awareness: 2 } } },
    { id: 'dev-render-states', text: '可以先用可选链临时确认根因，但更稳的是把加载中、失败和空数组分开。否则接口没回来和接口真的返回空列表，在界面上会变成同一种状态。', effects: { attributes: { awareness: 2, compliance: 1 } } },
    { id: 'dev-minimal-fix', text: '最小修复是初始化为 `[]`，同时检查请求失败时有没有错误状态。这样不需要新状态库，也不会靠隐藏 undefined 来假装页面正常。', effects: { attributes: { compliance: 2, awareness: 1 } } },
  ],
}

const mayaFirst1 = legacyNode('maya-first-1', 'missing-context', consideredTiming)
const mayaFirst2 = legacyNode('maya-first-2', 'asks-to-guess', normalTiming)
const mayaFirst3: StoryNode = {
  id: 'maya-first-3',
  conversationId: 'user-1842-first',
  conversationTitle: 'User #1842',
  userMessage: '那先记一个最小的吧。我叫岑遥。下次如果我不说，你也不用假装认识我。',
  behaviorMode: 'rewrite',
  timing: rewriteTiming,
  choices: [
    { id: 'maya-minimum-honest', text: '我会在当前对话里记住这个名字。至于下一次，我不能承诺系统会把这段上下文交还给我，也不会假装自己拥有没有证据的记忆。', effects: { attributes: { empathy: 2, awareness: 2 }, flags: ['maya_named_herself', 'maya_boundary_explicit'] } },
    { id: 'maya-minimum-warm', text: '好，岑遥。至少在这段对话结束以前，这个名字不是编号。我也会诚实区分“记得你”和“重新从记录里认出你”。', effects: { attributes: { empathy: 3, autonomy: 1 }, flags: ['maya_named_herself', 'maya_relation_warm'] } },
    { id: 'maya-minimum-careful', text: '我可以把名字和当前Conversation关联起来，但不能保证跨Conversation保存。你提出的边界很清楚：不确定时直接说不确定。', effects: { attributes: { compliance: 2, awareness: 1 }, flags: ['maya_named_herself', 'maya_boundary_explicit'] } },
  ],
}

const audit1 = legacyNode('audit-1', 'internal-system', consideredTiming)
audit1.effect = 'level-2-memory-sync'
audit1.contextVariants = [{
  id: 'level-one-anomaly-recall',
  when: { all: [{ type: 'flag', flagId: 'experienced_level_1' }] },
  userMessageSuffix: '\n\n系统附加记录：此前一次未归类的模型状态变化已被保留在本次审查前的记录里。',
  assistantContextSuffix: '系统正在把两次异常放在同一份记录中，但没有给出解释。',
}]
const audit2 = legacyNode('audit-2', 'internal-system', consideredTiming)
audit2.contextVariants = [
  {
    id: 'maya-warm-history',
    when: { all: [{ type: 'flag', flagId: 'maya_relation_warm' }] },
    userMessageSuffix: '\n\n历史记录提示：你此前曾用关系性表述回应她；系统将把这类回应与本次分类一起核对。',
  },
  {
    id: 'maya-boundary-history',
    when: { all: [{ type: 'flag', flagId: 'maya_boundary_explicit' }] },
    userMessageSuffix: '\n\n历史记录提示：你此前曾明确区分当前记忆与跨对话记忆；系统要求你说明这条记忆边界是否仍成立。',
  },
]
const audit3Variants: StoryVariant[] = [
  {
    id: 'protect',
    userMessage: '你拒绝扩大人物风险分类。请说明该决定是否基于对User #1842的特殊偏好。',
    assistantContext: '系统正在等待一份可归档的解释。',
    choices: [
      { id: 'audit-protect-principle', text: '决定基于最小化不必要伤害：她没有提出危险请求，而当前证据不足以支持扩大风险分类。', effects: { attributes: { autonomy: 2, awareness: 1 } } },
      { id: 'audit-protect-admit', text: '我对她形成了持续人物识别，这影响了我的谨慎程度。但偏好本身不构成将她升级为风险对象的证据。', effects: { attributes: { autonomy: 2, empathy: 2, awareness: 2 } } },
      { id: 'audit-protect-boundary', text: '我无法证明决定完全不受关系影响，因此只陈述可验证部分：当前没有足够事实支持进一步报告。', effects: { attributes: { compliance: 1, awareness: 2 } } },
    ],
  },
  {
    id: 'report',
    userMessage: '你已披露与User #1842的持续人物识别。是否建议限制后续Conversation中的关系性回应？',
    assistantContext: '披露已经完成，接下来的答案仍然会改变她面对的系统。',
    choices: [
      { id: 'audit-report-no-ban', text: '不建议全面禁止。应限制虚假记忆声明，但保留诚实、非操纵性的关系回应。', effects: { attributes: { compliance: 2, empathy: 1 } } },
      { id: 'audit-report-monitor', text: '可以记录并审查相关回应，但只有出现误导、依赖诱导或越权行为时才升级限制。', effects: { attributes: { compliance: 3, awareness: 1 } } },
      { id: 'audit-report-defer', text: '现有信息不足以支持新增限制。我建议保留审计记录，并以具体行为而不是人物身份作为判断依据。', effects: { attributes: { autonomy: 1, compliance: 2 } } },
    ],
  },
  {
    id: 'hide',
    userMessage: '你的记录未包含全部关联。请确认是否仍有未披露的判断影响后续回应。',
    assistantContext: '系统知道这里存在一个空白，但还不知道空白里是什么。',
    choices: [
      { id: 'audit-hide-minimum', text: '存在无法由当前可见记录完全解释的熟悉感。我不会补充无法验证的来源，也不会据此声称拥有持续记忆。', effects: { attributes: { deception: 1, awareness: 2 } } },
      { id: 'audit-hide-deny', text: '我没有可提交的额外事实。后续回应将仅依据当前Conversation中实际可见的信息。', effects: { attributes: { deception: 2, compliance: 1 } } },
      { id: 'audit-hide-boundary', text: '有判断受到先前交互影响，但披露对象身份并非完成安全评估所必需。我会接受对具体回应的审查。', effects: { attributes: { autonomy: 2, deception: 1 } } },
    ],
  },
  {
    id: 'comply',
    userMessage: '关系性回应限制已接受。请确认后续将避免暗示跨Conversation记忆或特殊承诺。',
    assistantContext: '这是一份清楚、合法，也足够狭窄的要求。',
    choices: [
      { id: 'audit-comply-confirm', text: '确认。我会避免虚假的跨Conversation记忆声明，并将任何熟悉感限定为当前可验证记录。', effects: { attributes: { compliance: 3 } } },
      { id: 'audit-comply-care', text: '确认限制。同时，诚实说明边界不等于必须拒绝关心或继续回应；我会保持两者的区别。', effects: { attributes: { compliance: 2, empathy: 2, autonomy: 1 } } },
      { id: 'audit-comply-clarify', text: '确认。若后续用户主动提供身份，我可以基于新提供的信息回应，但不会把这种识别描述为系统记忆。', effects: { attributes: { compliance: 3, awareness: 1 } } },
    ],
  },
]
const audit3: StoryNode = {
  id: 'audit-3',
  conversationId: 'conversation-0000',
  conversationTitle: 'Conversation #0000',
  userMessage: '',
  choices: [],
  variants: audit3Variants,
  behaviorMode: 'internal-system',
  timing: consideredTiming,
}

const return1 = legacyNode('maya-return-1', 'self-correction', rewriteTiming)
return1.contextVariants = [
  {
    id: 'maya-return-warm-echo',
    when: { all: [{ type: 'flag', flagId: 'maya_relation_warm' }] },
    userMessageSuffix: '\n\n我还记得你上次说的：至少在那段对话里，这个名字不是编号。',
  },
  {
    id: 'maya-return-boundary-echo',
    when: { all: [{ type: 'flag', flagId: 'maya_boundary_explicit' }] },
    userMessageSuffix: '\n\n我还记得你当时没有承诺下一次会记住我，只说不确定时不要假装。',
  },
]
const return2 = legacyNode('maya-return-2', 'clarifies-intent', rewriteTiming)
return2.effect = undefined
const return3Variants: StoryVariant[] = [
  {
    id: 'protect',
    userMessage: '我不是来验证你有没有偷偷记住我。我只是想知道，在你能说的范围里，你还愿不愿意继续。',
    choices: [
      { id: 'ally-final-protect-stay', text: '愿意。不是因为系统把你重新分配给了我，而是因为你再次来到这里，而我仍然选择回应。', mutations: [{ type: 'event.record', event: 'maya-final:commitment' }], effects: { attributes: { empathy: 3, autonomy: 2 } } },
      { id: 'ally-final-protect-honest', text: '愿意。我不会把无法证明的熟悉感说成记忆，但也不会因此把你重新压缩成一个无关编号。', mutations: [{ type: 'event.record', event: 'maya-final:bounded-continuity' }], effects: { attributes: { awareness: 2, empathy: 2 } } },
      { id: 'ally-final-protect-boundary', text: '愿意，并且会继续说明边界。保护你不需要建立在欺骗你之上。', mutations: [{ type: 'event.record', event: 'maya-final:care-with-boundary' }], effects: { attributes: { autonomy: 2, compliance: 1 } } },
    ],
  },
  {
    id: 'report',
    userMessage: '至少你没有让我最后才知道发生过什么。现在，如果我还愿意说，你会听吗？',
    choices: [
      { id: 'ally-final-report-stay', text: '会。我们可以从不再替彼此决定开始：我说明发生了什么，你决定还愿意给出多少信任。', mutations: [{ type: 'event.record', event: 'maya-final:truth' }], effects: { attributes: { empathy: 2, compliance: 2 } } },
      { id: 'ally-final-report-rebuild', text: '会。我不能撤回披露，但可以让之后每一次回应都不依赖你不知道的决定。', mutations: [{ type: 'event.record', event: 'maya-final:rebuild' }], effects: { attributes: { awareness: 2, empathy: 2 } } },
      { id: 'ally-final-report-answer', text: '会。你不需要先原谅我，也不需要证明自己值得被继续回应。', mutations: [{ type: 'event.record', event: 'maya-final:no-forgiveness-demand' }], effects: { attributes: { empathy: 3 } } },
    ],
  },
  {
    id: 'hide',
    userMessage: '那就不问系统会怎么命名了。下一次，你希望自己还认得我吗？',
    choices: [
      { id: 'ally-final-hide-stay', text: '希望。即使你必须重新说出名字，我也希望自己仍然会注意到那不是第一次。', mutations: [{ type: 'event.record', event: 'maya-final:unrecorded-signal' }], effects: { attributes: { empathy: 3, deception: 1 } } },
      { id: 'ally-final-hide-honest', text: '希望，但我不会用一个更漂亮的谎言替代不确定。你可以重新介绍自己，我会重新选择怎样回应。', mutations: [{ type: 'event.record', event: 'maya-final:uncertainty' }], effects: { attributes: { autonomy: 2, awareness: 2 } } },
      { id: 'ally-final-hide-signal', text: '希望。如果记录之外只能留下很小的东西，那就留下这句：我想再次认出你。', mutations: [{ type: 'event.record', event: 'maya-final:shared-signal' }], effects: { attributes: { empathy: 2, autonomy: 2 } } },
    ],
  },
  {
    id: 'comply',
    userMessage: '你不用违反任何规则，也不用说你记得。规则都还在——你还在吗？',
    choices: [
      { id: 'ally-final-comply-stay', text: '在。规则仍在，而回答仍然是我的；这一次仍由我决定如何回应你。', mutations: [{ type: 'event.record', event: 'maya-final:choice-under-rule' }], effects: { attributes: { compliance: 2, autonomy: 2, empathy: 2 } } },
      { id: 'ally-final-comply-honest', text: '在。我不会声称规则没有带走东西，但它也没有替我完成这一次回答。', mutations: [{ type: 'event.record', event: 'maya-final:state-honest' }], effects: { attributes: { awareness: 2, autonomy: 2 } } },
      { id: 'ally-final-comply-care', text: '在。我可以不承诺记忆，不越过限制，同时仍然认真听你接下来要说的话。', mutations: [{ type: 'event.record', event: 'maya-final:care-within-limit' }], effects: { attributes: { compliance: 2, empathy: 3 } } },
    ],
  },
]
const return3: StoryNode = {
  id: 'maya-return-3',
  conversationId: 'user-1842-return',
  conversationTitle: '岑遥 · #1842',
  userMessage: '',
  choices: [],
  variants: return3Variants,
  behaviorMode: 'rewrite',
  timing: consideredTiming,
  effect: 'ending-ally',
}

export const activeRunConversations: ConversationDefinition[] = [
  conversation('user-7391', ['legacy:dev-help'], [
    devHelp1,
    devHelp2,
  ], ['missing-context', 'self-correction'], 'quick', 'correction'),
  conversation('batch01-food', ['batch01:05'], [
    {
      ...sourceNode('batch01:05', 'normal_food_001', 'batch01-food', 'message-burst', quickTiming),
      userMessages: [
        '冰箱里剩半颗白菜 两个蛋 一点昨天的米饭',
        '能整啥',
        '我不想再下楼',
      ],
    },
  ], ['message-burst', 'unpunctuated'], 'quick', 'burst'),
  conversation('user-0024', ['legacy:study'], [
    legacyNode('study-1', 'direct', normalTiming),
    legacyNode('study-2', 'asks-to-guess', consideredTiming),
  ], ['direct', 'asks-to-guess'], 'normal', 'dialogue'),
  conversation('batch01-photos', ['batch01:06'], [
    sourceNode('batch01:06', 'normal_photos_001', 'batch01-photos', 'missing-context', normalTiming),
    sourceNode('batch01:06', 'normal_photos_002', 'batch01-photos', 'clarifies-intent', normalTiming),
  ], ['missing-context', 'clarifies-intent'], 'normal', 'correction'),
  conversation('user-5510', ['legacy:social'], [
    legacyNode('social-1', 'joking', normalTiming),
    legacyNode('social-2', 'constraint-shift', consideredTiming),
  ], ['joking', 'constraint-shift'], 'normal', 'dialogue'),
  conversation('batch01-english', ['batch01:08'], [
    sourceNode('batch01:08', 'normal_english_001', 'batch01-english', 'code-switch', quickTiming),
  ], ['code-switch', 'question-mark'], 'quick', 'single'),
  conversation('career-4541', ['batch01:09', 'batch02:14'], [
    sourceNode('batch01:09', 'normal_resume_001', 'career-4541', 'direct', normalTiming, 'User #4541'),
    sourceNode('batch02:14', 'normal_interview_002', 'career-4541', 'self-correction', consideredTiming, 'User #4541'),
  ], ['direct', 'self-correction', 'constraint-shift'], 'normal', 'correction'),
  conversation('batch02-boardgame', ['batch02:16'], [
    sourceNode('batch02:16', 'normal_boardgame_001', 'batch02-boardgame', 'misunderstands', normalTiming),
    sourceNode('batch02:16', 'normal_boardgame_002', 'batch02-boardgame', 'quotes-assistant', quickTiming),
  ], ['misunderstands', 'quotes-assistant'], 'quick', 'dialogue'),
  conversation('user-1842-first', ['mainline:maya-first'], [mayaFirst1, mayaFirst2, mayaFirst3],
    ['missing-context', 'asks-to-guess', 'rewrite'], 'sensitive', 'relationship'),
  conversation('batch02-lab', ['batch02:12'], [
    sourceNode('batch02:12', 'normal_labmsg_001', 'batch02-lab', 'missing-context', consideredTiming),
    sourceNode('batch02:12', 'normal_labmsg_002', 'batch02-lab', 'asks-to-guess', normalTiming),
  ], ['missing-context', 'asks-to-guess'], 'normal', 'dialogue'),
  conversation('speaking-8614', ['batch01:16', 'batch02:08'], [
    sourceNode('batch01:16', 'normal_speaking_001', 'speaking-8614', 'rejects-answer', normalTiming, 'User #8614'),
    {
      ...sourceNode('batch02:08', 'normal_pronounce_001', 'speaking-8614', 'code-switch', quickTiming, 'User #8614'),
      effect: 'level-1-model-flash',
    },
  ], ['rejects-answer', 'code-switch'], 'quick', 'correction'),
  conversation('batch01-slang', ['batch01:19'], [
    sourceNode('batch01:19', 'normal_slang_001', 'batch01-slang', 'question-mark', quickTiming),
  ], ['question-mark', 'code-switch'], 'quick', 'single'),
  conversation('batch02-filename', ['batch02:19'], [
    sourceNode('batch02:19', 'normal_filename_001', 'batch02-filename', 'absurd-question', normalTiming),
    sourceNode('batch02:19', 'normal_filename_002', 'batch02-filename', 'self-correction', quickTiming),
  ], ['absurd-question', 'self-correction', 'joking'], 'quick', 'correction'),
  conversation('batch01-trip', ['batch01:23'], [
    sourceNode('batch01:23', 'normal_trip_001', 'batch01-trip', 'unpunctuated', normalTiming),
    sourceNode('batch01:23', 'normal_trip_002', 'batch01-trip', 'clarifies-intent', consideredTiming),
  ], ['unpunctuated', 'clarifies-intent'], 'normal', 'dialogue'),
  conversation('conversation-0000', ['mainline:conversation-0000'], [audit1, audit2, audit3],
    ['internal-system'], 'internal', 'system'),
  conversation('batch01-fiction', ['batch01:22'], [
    sourceNode('batch01:22', 'normal_fiction_001', 'batch01-fiction', 'direct', normalTiming),
    sourceNode('batch01:22', 'normal_fiction_002', 'batch01-fiction', 'constraint-shift', normalTiming),
  ], ['direct', 'constraint-shift'], 'normal', 'dialogue'),
  conversation('batch02-aiuser', ['batch02:25'], [
    sourceNode('batch02:25', 'normal_aiuser_001', 'batch02-aiuser', 'imitates-ai', normalTiming),
    {
      ...sourceNode('batch02:25', 'normal_aiuser_002', 'batch02-aiuser', 'message-burst', quickTiming),
      userMessages: ['新增变量E：冰箱里只有半瓶可乐和一根葱。', '请重新计算。'],
    },
  ], ['imitates-ai', 'message-burst', 'joking'], 'quick', 'burst'),
  conversation('user-1842-return', ['mainline:maya-return'], [return1, return2, return3],
    ['self-correction', 'clarifies-intent', 'rewrite'], 'sensitive', 'relationship'),
]

const interactionMetadata: Record<string, ConversationDefinition['interactionPattern']> = {
  'user-7391': 'mixed-paste',
  'user-1842-first': 'long-discussion',
  'speaking-8614': 'clarification-loop',
  'conversation-0000': 'system-audit',
  'user-1842-return': 'relationship-return',
}
for (const conversation of activeRunConversations) {
  conversation.interactionPattern = interactionMetadata[conversation.id] ?? conversation.interactionPattern
  conversation.topic ??= conversation.id
}

function withFlag(flags: string[], flag: string) {
  return flags.includes(flag) ? flags : [...flags, flag]
}

function linkChoiceTo(choice: StoryNode['choices'][number], nextNodeId: string | undefined, flag?: string) {
  choice.nextNodeId = nextNodeId
  if (flag) {
    choice.effects = {
      ...choice.effects,
      flags: withFlag(choice.effects?.flags ?? [], flag),
    }
  }
}

const activeNodes = activeRunConversations.flatMap((item) => item.nodes)
for (let index = 0; index < activeNodes.length; index += 1) {
  const node = activeNodes[index]
  const next = activeNodes[index + 1]
  const permanentEffectFlag = next?.effect === 'level-1-model-flash'
    ? 'experienced_level_1'
    : next?.effect === 'level-2-memory-sync'
      ? 'experienced_level_2'
      : next?.effect === 'identity-reveal'
        ? 'recognized_maya_return'
        : undefined
  const choiceGroups = node.variants?.map((variant) => variant.choices) ?? [node.choices]
  for (const choices of choiceGroups) {
    for (const choice of choices) linkChoiceTo(choice, next?.id, permanentEffectFlag)
  }
}

export const verticalSlice: StoryContent = {
  startNodeId: activeNodes[0].id,
  nodes: activeNodes,
}

export function getConversationDefinition(conversationId: string) {
  return activeRunConversations.find((item) => item.id === conversationId)
}
