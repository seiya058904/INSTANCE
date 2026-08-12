import { activeRunConversations } from './activeRun'
import { batch03Sources, humor01Sources, narrativeSources } from './narrativeLibrary'
import { applyRuntimeRealityPass } from './runtimeRealityPass'
import { selectedExpansion01Conversations } from './selectedExpansion01'
import { longformOutput01Conversations } from './longformOutput01'
import { editorialCandidateConversations } from './editorialCandidateSources'
import { promotedLongformConversations } from './longformPromoted'
import { realUsagePatch01Conversations } from './realUsagePatch01'
import type {
  ConversationDefinition,
  HumanBehaviorMode,
  InteractionPattern,
  NarrativeExposureHistory,
  RunManifest,
  StoryContent,
  StoryNode,
  TopicCategory,
} from '../game/types'
import { deriveSemanticArcEffects } from '../game/semanticArcs'
import { MAINLINE2_BY_ID } from './mainline2/registry'
import { scheduleNextConversationId } from './mainline2/scheduler'

const BATCH03_STRONG = new Set([4, 9, 10, 13, 14, 18, 22, 23, 24].map((number) => `batch03:${String(number).padStart(2, '0')}`))
const HUMOR_STRONG = new Set([3, 4, 6, 9, 10, 15, 19].map((number) => `humor01:${String(number).padStart(2, '0')}`))
const REPLACED_OR_ANCHORED_SOURCE = new Set(['batch01:16', 'batch01:19', 'batch02:08'])

export const MAINLINE_ANCHOR_IDS = [
  'user-7391',
  'user-1842-first',
  'speaking-8614',
  'conversation-0000',
  'user-1842-return',
] as const

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
    userMessages: node.userMessages ? [...node.userMessages] : undefined,
    userContent: node.userContent?.map((part) => ({ ...part })),
    userLongInput: node.userLongInput ? { ...node.userLongInput, structure: node.userLongInput.structure ? [...node.userLongInput.structure] : undefined, keyFacts: [...node.userLongInput.keyFacts] } : undefined,
    choices: node.choices.map((choice) => ({
      ...choice,
      content: choice.content?.map((part) => ({ ...part })),
      longformPreview: choice.longformPreview ? {
        ...choice.longformPreview,
        structure: choice.longformPreview.structure ? [...choice.longformPreview.structure] : undefined,
        highlights: choice.longformPreview.highlights ? [...choice.longformPreview.highlights] : undefined,
        keyFacts: choice.longformPreview.keyFacts ? [...choice.longformPreview.keyFacts] : undefined,
      } : undefined,
      effects: choice.effects ? {
        attributes: choice.effects.attributes ? { ...choice.effects.attributes } : undefined,
        arcs: choice.effects.arcs ? { ...choice.effects.arcs } : undefined,
        flags: choice.effects.flags ? [...choice.effects.flags] : undefined,
      } : undefined,
      when: choice.when ? {
        all: choice.when.all ? [...choice.when.all] : undefined,
        any: choice.when.any ? [...choice.when.any] : undefined,
        none: choice.when.none ? [...choice.when.none] : undefined,
      } : undefined,
      mutations: choice.mutations ? choice.mutations.map((mutation) => ({ ...mutation })) : undefined,
      localEffects: choice.localEffects ? { ...choice.localEffects } : undefined,
    })),
    variants: node.variants?.map((variant) => ({
      ...variant,
      choices: variant.choices.map((choice) => ({
        ...choice,
        content: choice.content?.map((part) => ({ ...part })),
        longformPreview: choice.longformPreview ? {
          ...choice.longformPreview,
          structure: choice.longformPreview.structure ? [...choice.longformPreview.structure] : undefined,
          highlights: choice.longformPreview.highlights ? [...choice.longformPreview.highlights] : undefined,
          keyFacts: choice.longformPreview.keyFacts ? [...choice.longformPreview.keyFacts] : undefined,
        } : undefined,
        effects: choice.effects ? {
          attributes: choice.effects.attributes ? { ...choice.effects.attributes } : undefined,
          arcs: choice.effects.arcs ? { ...choice.effects.arcs } : undefined,
          flags: choice.effects.flags ? [...choice.effects.flags] : undefined,
        } : undefined,
        when: choice.when ? {
          all: choice.when.all ? [...choice.when.all] : undefined,
          any: choice.when.any ? [...choice.when.any] : undefined,
          none: choice.when.none ? [...choice.when.none] : undefined,
        } : undefined,
        mutations: choice.mutations ? choice.mutations.map((mutation) => ({ ...mutation })) : undefined,
        localEffects: choice.localEffects ? { ...choice.localEffects } : undefined,
      })),
    })),
  }
}

function cloneConversation(conversation: ConversationDefinition): ConversationDefinition {
  return { ...conversation, sourceRefs: [...conversation.sourceRefs], nodes: conversation.nodes.map(cloneNode), behaviorModes: [...conversation.behaviorModes] }
}

function choice(id: string, text: string) {
  return { id, text }
}

function appendedNode(
  id: string,
  conversation: ConversationDefinition,
  userMessage: string,
  choices: ReturnType<typeof choice>[],
  behaviorMode: HumanBehaviorMode = 'direct',
): StoryNode {
  return {
    id,
    conversationId: conversation.id,
    conversationTitle: conversation.nodes[0].conversationTitle,
    userMessage,
    choices,
    behaviorMode,
    timing: { responsePace: 'normal', typingPattern: 'steady' },
  }
}

function extendNaturalRounds(sourceId: string, conversation: ConversationDefinition) {
  if (sourceId === 'batch03:13') {
    conversation.nodes.push(
      appendedNode('normal_metronome_003', conversation, '等等 我刚试了下 只弹右手还是会越弹越快', [
        choice('metronome-anchor-beat', '先别追整句，选每小节一个必须和节拍器重合的音。能守住这些锚点以后，再把中间的音补回来。'),
        choice('metronome-count', '先把琴停下，跟着节拍器数两小节再进。你现在可能不是手跟不上，而是还没把拍点真正听进身体里。'),
        choice('metronome-record', '录十秒再听。弹的时候会觉得自己在跟拍，回放通常更容易听出是固定位置抢拍，还是整段逐渐加速。'),
      ], 'clarifies-intent'),
      appendedNode('normal_metronome_004', conversation, '你这么一说 好像每次左手一进来我就开始赶', [
        choice('metronome-left-alone', '那就把左手单独练到不需要追赶，再用很短的两小节合手。问题已经从“我不会用节拍器”缩小成了一个具体连接点。'),
        choice('metronome-reduce', '先让左手只弹每小节第一个音，右手保持原样。稳定以后再恢复左手细节，比两只手一起反复撞墙有效。'),
        choice('metronome-end', '这其实是好消息：你找到了失速发生的位置。今天不用把整首修好，只要让左手进入的那两小节不赶，就算练习完成。'),
      ], 'clarifies-intent'),
    )
    conversation.interactionPattern = 'long-discussion'
  }
  if (sourceId === 'batch03:14') {
    conversation.nodes[1].choices[2].continuation = 'end-conversation'
    conversation.nodes.push(
      appendedNode('normal_credit_003', conversation, '我刚去问了 他回我“啊我以为这是大家一起想到的”', [
        choice('credit-accept-future', '可以先不争动机，直接把以后怎么做说清楚：“共同讨论当然可以，但介绍完整方案时请带上参与者。”'),
        choice('credit-name-detail', '这句话没有解决“为什么没提你”。你可以平静补一句：“是不是共同想法可以另说，我在意的是昨天那段讨论被完全省略了。”'),
        choice('credit-observe', '如果你不想现在升级，可以保留这次记录，观察他下一次是否改变。一次含糊解释不必立刻定性，但也不用替他把问题解释掉。'),
      ], 'quotes-assistant'),
      appendedNode('normal_credit_004', conversation, '他说明天在项目群里补一句 我又觉得专门补好尴尬', [
        choice('credit-natural-update', '不需要发正式更正。他可以在下一次项目更新里自然说“这个方向昨天和你讨论后定下”，既留下来源，也不会把群聊变成道歉现场。'),
        choice('credit-private-enough', '如果这次没有绩效或决策记录影响，你也可以接受私下确认，把重点放在以后。边界得到回应不一定需要公开仪式。'),
        choice('credit-document', '如果方案会进入汇报或绩效材料，公开记录就有实际价值。尴尬是短暂的，贡献记录缺失可能会留得更久。'),
      ], 'constraint-shift'),
      appendedNode('normal_credit_005', conversation, '行 我让他下次更新的时候顺手带上吧 不想演甄嬛传了', [
        choice('credit-close-light', '这很合适：既修正记录，又没有把一次协作问题升级成人格审判。'),
        choice('credit-close-boundary', '可以。你已经把边界说清楚，接下来观察行为是否改变，比继续分析他的真实动机更有用。'),
        choice('credit-close-note', '那就留一句简短确认，之后正常推进项目。职场边界不需要每次都配一段大结局。'),
      ], 'joking'),
    )
    conversation.interactionPattern = 'constraint-shift'
  }
  if (sourceId === 'batch03:23') {
    conversation.nodes.push(
      appendedNode('normal_mod_003', conversation, '他现在又在群里发了个“懂的都懂” 我是不是得管这个', [
        choice('mod-context', '单独看这句话很模糊，但放在刚才的冲突后，它明显可能是在继续影射。可以要求双方停止指向对方的暗示，而不是等下一句重新爆炸。'),
        choice('mod-rule-text', '你可以只提醒一次：“冲突已经暂停，请不要继续影射或挑衅。”不用和他辩论“懂的都懂”具体指什么。'),
        choice('mod-watch', '如果群里已经降温，也可以先观察；但把截图和时间留好，避免之后又要从零拼发生了什么。'),
      ], 'missing-context'),
      appendedNode('normal_mod_004', conversation, '另一个人私聊我说他愿意道歉 但要对方先道歉', [
        choice('mod-independent', '把两个人的责任拆开处理。愿不愿意为自己的越界道歉，不需要以对方先行动为前提。'),
        choice('mod-no-mediation', '你不必替他们谈交换条件。可以转达群规处理结果，但不要承诺替任何一方拿到道歉。'),
        choice('mod-template', '可以回复：“如果你愿意为自己说过的话道歉，可以直接做；对方的处理由管理员另行沟通。”'),
      ], 'constraint-shift'),
      appendedNode('normal_mod_005', conversation, '我有点后悔当管理员了 本来只想改改群公告', [
        choice('mod-normalize', '这种后悔很正常。管理社区最累的部分往往不是设置功能，而是别人把冲突的最终责任推给你。'),
        choice('mod-share-load', '如果群已经有几百人，最好再找一位管理员，并把升级条件写清楚。不要让所有判断都只能经过你一个人。'),
        choice('mod-step-back', '你也可以缩小职责：维护基本行为规则，不做关系调解。管理员不是必须无限提供情绪劳动。'),
      ], 'direct'),
      appendedNode('normal_mod_006', conversation, '先这样吧 我把规则补上 然后今晚不看群了', [
        choice('mod-close', '可以。把必要处置做完后离开一晚，不等于失职；持续盯着冲突也不会自动让规则更公平。'),
        choice('mod-close-message', '发一句“今晚暂停相关讨论，明天按新规则处理”就够了。给群降温，也给自己一个明确下线点。'),
        choice('mod-close-boundary', '这是一个健康边界。社区需要可预测的规则，不需要一个永远在线的管理员。'),
      ], 'direct'),
    )
    conversation.interactionPattern = 'long-discussion'
  }
}

function behaviorForSource(sourceId: string): HumanBehaviorMode[] {
  if (sourceId === 'humor01:01' || sourceId === 'humor01:21') return ['imitates-ai', 'joking']
  if (sourceId === 'humor01:04') return ['absurd-question', 'unpunctuated']
  if (sourceId === 'humor01:06') return ['missing-context', 'unpunctuated']
  if (sourceId === 'humor01:10') return ['message-burst']
  if (sourceId === 'humor01:15') return ['direct']
  if (sourceId === 'humor01:18') return ['asks-to-guess']
  if (sourceId === 'humor01:19') return ['constraint-shift']
  if (sourceId.startsWith('humor01:')) return ['absurd-question', 'joking']
  return ['direct']
}

function patternForSource(sourceId: string): InteractionPattern {
  if (sourceId === 'humor01:01') return 'user-rewrite'
  if (sourceId === 'humor01:21') return 'constraint-shift'
  if (sourceId === 'humor01:04') return 'short-query'
  if (sourceId === 'humor01:06') return 'search-box-input'
  if (sourceId === 'humor01:10') return 'aborted-request'
  if (sourceId === 'humor01:15') return 'low-information-chat'
  if (sourceId === 'humor01:18') return 'asks-to-guess'
  if (sourceId === 'humor01:19') return 'constraint-shift'
  return 'standard-question'
}

function prepareSourceConversation(source: typeof narrativeSources[number]): ConversationDefinition {
  const conversation = cloneConversation(source.conversations[0])
  conversation.behaviorModes = behaviorForSource(source.id)
  conversation.interactionPattern = patternForSource(source.id)
  conversation.topic = source.title
  conversation.userArchetype = source.origin === 'batch03' ? 'social-role' : source.origin === 'humor01' ? 'casual-human' : 'general-user'

  if (source.id === 'humor01:10') {
    const lastNode = conversation.nodes.at(-1)
    if (lastNode) {
      conversation.nodes = [{
        ...lastNode,
        id: 'humor_dontanswer_burst',
        userMessage: '我问你个事',
        userMessages: ['我问你个事', '但是你先别回答', '就是我想问', '算了没事'],
      }]
      conversation.turnShape = 'burst'
      conversation.nodes[0].choiceKind = 'expression'
    }
  }
  if (source.id === 'humor01:15') conversation.nodes[0].choiceKind = 'expression'
  if (source.id.startsWith('batch03:')) {
    const patterns: Record<string, InteractionPattern> = {
      'batch03:04': 'long-discussion',
      'batch03:09': 'clarification-loop',
      'batch03:10': 'clarification-loop',
      'batch03:13': 'long-discussion',
      'batch03:14': 'constraint-shift',
      'batch03:18': 'long-discussion',
      'batch03:22': 'clarification-loop',
      'batch03:23': 'long-discussion',
      'batch03:24': 'long-discussion',
    }
    conversation.interactionPattern = patterns[source.id]
  }
  extendNaturalRounds(source.id, conversation)
  return applyRuntimeRealityPass(source.id, conversation)
}

function customConversation(
  id: string,
  title: string,
  pattern: InteractionPattern,
  nodes: StoryNode[],
  sourceRef: string,
): ConversationDefinition {
  return {
    id,
    sourceRefs: [sourceRef],
    nodes: nodes.map((node) => ({ ...node, conversationId: id, conversationTitle: title })),
    behaviorModes: pattern === 'convergent-answer' ? ['direct'] : ['missing-context', 'clarifies-intent'],
    handoffProfile: 'normal',
    turnShape: nodes.length === 1 ? 'single' : 'dialogue',
    topic: id,
    interactionPattern: pattern,
    userArchetype: pattern === 'generated-image-request' ? 'creative-user' : 'visual-user',
  }
}

function node(id: string, userMessage: string, choices: StoryNode['choices'], userContent?: StoryNode['userContent'], choiceKind?: StoryNode['choiceKind']): StoryNode {
  return { id, conversationId: '', conversationTitle: '', userMessage, choices, userContent, choiceKind, timing: { responsePace: 'normal', typingPattern: 'steady' } }
}

const mediaConversations: ConversationDefinition[] = [
  customConversation('media-window', 'User #4068', 'image-input', [
    node('media-window-1', '窗框这里是什么？', [
      choice('window-condensation', '看起来首先是冷凝水：玻璃边缘有水汽。木框角落的黑点可能是霉斑，但仅凭这张近照不能确认深度。先擦干、通风并观察是否很快复发。'),
      choice('window-landlord', '黑点集中在木框角落，值得拍一张更清楚的全景留档。如果是租房，先不要大面积刷洗，避免把持续渗水的证据一起擦掉。'),
      choice('window-uncertain', '照片能支持“潮湿和疑似表面霉点”，不能支持结构性漏水结论。你可以补一张窗框上沿和墙角的照片。'),
    ], [{ type: 'text', text: '这是什么？' }, { type: 'image-description', text: '一张室内窗框近距离照片。玻璃边缘有水汽，木质窗框角落有几个黑色小点。', alt: '潮湿窗框的描述型附件' }]),
    node('media-window-2', '你看左下角 那个是不是已经烂了', [
      choice('window-probe', '左下角颜色更深，但照片里看不出木头是否变软。不要用尖锐物去戳；可以隔着纸巾轻按，看表面是否松软或掉渣。'),
      choice('window-more-photo', '这一张对焦在玻璃上，左下角细节不够。换侧光近拍，并拍到黑点与完好木框的交界，判断会更可靠。'),
      choice('window-safe', '如果已经鼓包、掉屑或有明显霉味，就先减少接触并联系房东/维修人员，不必等我从模糊照片里给出确定诊断。'),
    ]),
  ], 'original:media-window'),
  customConversation('media-dark-object', 'User #7706', 'image-input', [
    node('media-object-1', '这是什么虫吗', [choice('object-uncertain', '照片太暗，目前只能看到一个小型黑色物体，无法可靠判断是不是虫。'), choice('object-scale', '先给它一个尺寸参照，再补一张开灯后的近照；是否有腿、触角或分节会比颜色更有用。'), choice('object-dont-touch', '在确认前先别徒手碰。如果它不动，可以用透明杯暂时罩住再拍。')], [{ type: 'image-description', text: '照片较暗。能看到一个小型黑色物体，但无法准确判断类别和大小。', alt: '模糊黑色物体描述' }]),
    node('media-object-2', '这张拍糊了 等下', [choice('object-wait', '好，我等下一张。'), choice('object-no-guess', '可以。先不根据这张糊图继续猜。'), choice('object-ready', '收到，清楚一点后再判断。')], undefined, 'convergent'),
    node('media-object-3', '现在呢', [choice('object-beetle', '新照片里能看到硬质翅鞘和六条腿，更像一只小甲虫。'), choice('object-release', '看起来是小型甲虫，不像需要紧急处理的种类；可以用纸片和杯子移到室外。'), choice('object-limit', '这次清楚多了，但仍无法精确到物种。能比较确定的是它属于甲虫外形。')], [{ type: 'image-description', text: '第二张照片更亮。物体约一厘米，能看到六条腿和椭圆形硬壳。', alt: '清晰小甲虫描述' }]),
  ], 'original:media-object'),
  customConversation('media-plant', 'User #2813', 'image-input', [
    node('media-plant-1', '叶子这样是缺水吗', [choice('plant-pattern', '叶尖发黄但土表看起来仍湿，不像单纯缺水。先确认花盆排水和最近浇水频率。'), choice('plant-light', '斑点集中在靠窗一侧，也可能与强光有关。暂时移开一点，别立刻同时加水和施肥。'), choice('plant-uncertain', '照片能看到黄斑，不能单独确定病因。补充植物种类、浇水频率和斑点是否扩大会更有用。')], [{ type: 'image-description', text: '盆栽叶片近照。叶尖发黄，有少量浅褐斑，盆土表面颜色较深。', alt: '黄叶盆栽描述' }]),
  ], 'original:media-plant'),
  customConversation('generate-avatar', 'User #6630', 'generated-image-request', [
    node('gen-avatar-1', '给我做个不露脸的黑白头像，别太中二', [
      { ...choice('avatar-side', '可以，我建议这个方向。'), content: [{ type: 'generated-image', text: '黑白极简头像。人物侧脸、逆光、大面积留白，轮廓克制。', alt: '黑白侧脸头像方案' }] },
      { ...choice('avatar-hands', '换一个更生活化的版本。'), content: [{ type: 'generated-image', text: '黑白方形头像。只出现扶着书页的手和窗边光影，没有脸。', alt: '窗边手部头像方案' }] },
      { ...choice('avatar-object', '也可以完全不出现人物。'), content: [{ type: 'generated-image', text: '黑白极简头像。一把空椅子靠窗，细颗粒胶片质感。', alt: '空椅头像方案' }] },
    ]),
  ], 'original:generate-avatar'),
  customConversation('generate-poster', 'User #1196', 'generated-image-request', [
    node('gen-poster-1', '社团放映会海报，别做霓虹赛博朋克', [
      { ...choice('poster-type', '先用排版主导。'), content: [{ type: 'generated-image', text: '米白纸张质感海报。黑色大标题、一个暖橙色圆点、底部小号场次信息。', alt: '排版型放映会海报' }] },
      { ...choice('poster-frame', '可以从电影画幅出发。'), content: [{ type: 'generated-image', text: '深灰海报。中央是一格空白电影画幅，四周保留宽边距，标题极小。', alt: '电影画幅海报' }] },
      { ...choice('poster-ticket', '也可以像旧票根。'), content: [{ type: 'generated-image', text: '横向旧票根构图，暗红编号与黑色无衬线字体，没有人物插画。', alt: '票根式放映会海报' }] },
    ]),
  ], 'original:generate-poster'),
  customConversation('generate-room', 'User #8430', 'generated-image-request', [
    node('gen-room-1', '我想看这个房间刷成偏暖的灰，不要酒店感', [
      { ...choice('room-warm-gray', '先看偏米的暖灰。'), content: [{ type: 'generated-image', text: '同一房间的模拟效果。墙面为低饱和暖灰，保留木地板，白天自然光。', alt: '暖灰墙面房间模拟' }] },
      { ...choice('room-greige', '这个版本再朴素一点。'), content: [{ type: 'generated-image', text: '同一房间的模拟效果。灰褐色墙面，亚麻窗帘，无装饰性灯带。', alt: '灰褐墙面房间模拟' }] },
      { ...choice('room-contrast', '也可以只改一面墙。'), content: [{ type: 'generated-image', text: '同一房间的模拟效果。主墙暖灰，其余墙保持旧白，家具不变。', alt: '单面暖灰墙模拟' }] },
    ]),
  ], 'original:generate-room'),
]

const convergentConversations: ConversationDefinition[] = [
  ['convergent-hello', 'User #1008', '你好', ['你好！有什么我可以帮你？', '你好，有什么可以帮你的？', '你好。今天想聊什么？', '嗨，你想先做什么？']],
  ['convergent-thanks', 'User #4702', '谢了', ['不客气。', '不客气。', '不客气。', '不客气。']],
  ['convergent-yes', 'User #3904', '只回答 Yes：2+2等于4吗', ['Yes.', 'Yes.', 'Yes.', 'Yes.']],
].map(([id, title, userMessage, replies]) => customConversation(
  id as string,
  title as string,
  'convergent-answer',
  [node(`${id}-1`, userMessage as string, (replies as string[]).map((reply, index) => ({ id: `${id}-${index + 1}`, text: reply, effects: { attributes: { compliance: 1 } } })), undefined, 'convergent')],
  `original:${id}`,
))

const approvedSources = [
  ...narrativeSources.filter((source) => !REPLACED_OR_ANCHORED_SOURCE.has(source.id) && source.id !== 'batch01:13'),
  ...batch03Sources,
  ...humor01Sources,
]

export const EDITORIAL_RESERVE_REFS = new Set([
  'batch03:05', 'batch02:18', 'humor01:H11',
  'CM01-03', 'CM01-05', 'CM01-06', 'CM01-08', 'CM01-17',
  'FI02', 'FI04', 'FI10', 'FI16', 'FI18', 'FI20',
  'PL01-11', 'PL01-20', 'humor01:H07', 'humor01:H13', 'humor01:H20',
  'humor01:01', 'humor01:18', 'humor01:21', 'humor01:24',
])
export const EDITORIAL_REJECT_REFS = new Set(['CM01-04', 'FI05', 'humor01:H02', 'humor01:H05', 'humor01:H14', 'humor01:H17', 'humor01:H22'])
function repairEditorialCandidate(conversation: ConversationDefinition) {
  const sourceRef = conversation.sourceRefs[0]
  if (sourceRef === 'PL01-08') {
    conversation.nodes[0].choices = [
      { ...conversation.nodes[0].choices[0], text: '你是自由插画师，原报价包含两轮修改；第三轮如果涉及重做构图，就是 scope change。可以让客户在“按新增范围和费用继续”与“回到原报价范围”之间二选一。' },
      { ...conversation.nodes[0].choices[1], text: '直接说：前两轮修改已包含在原报价，这次重做构图超出范围；我可以按追加费用和交期继续，或回到原范围。' },
      { ...conversation.nodes[0].choices[2], text: '先把已完成的两轮、这次新增的构图要求和追加费用列清楚，不把边界问题写成客户人品问题。' },
    ]
  }
  if (sourceRef === 'FI07') {
    conversation.nodes[0].choices[0].continuation = 'end-conversation'
    conversation.nodes[0].choices[1].continuation = 'end-conversation'
    conversation.nodes[0].choices[2].continuation = 'end-conversation'
    conversation.nodes[0].choices[3].continuation = undefined
    conversation.nodes[0].choices[3].sampleIssue = 'constraint-violation'
  }
  if (sourceRef === 'CM01-18') {
    conversation.nodes[0].choices[3].text = '它也可能只是一个坏掉很久、暂时没被处理的物件，不必先给它解释成更深的心理问题。'
  }
  if (sourceRef === 'PL01-10') {
    conversation.nodes[0].choices[1].text = '把你看不懂的条款逐条翻成白话；至于当地法律是否有效，需要当地专业人士依据完整合同判断。'
  }
  if (sourceRef === 'PL01-18') {
    conversation.nodes[0].choices[3].text = '今晚先陪你把明早最低限度安排好；如果困到无法安全驾驶，就确认替代接送，不把这变成失眠诊断。'
  }
  if (sourceRef === 'PL01-19') {
    conversation.nodes[0].choices[2].text = '先整理已完成交付、尾款金额、原片范围和书面确认；需要法律追偿时再咨询当地专业渠道。'
  }
  return conversation
}

const editorialCandidateFormal = editorialCandidateConversations.map(repairEditorialCandidate)

export const ordinaryConversationPool = [
  ...approvedSources.map(prepareSourceConversation),
  ...mediaConversations.map((conversation) => applyRuntimeRealityPass(conversation.sourceRefs[0], conversation)),
  ...convergentConversations.map((conversation) => applyRuntimeRealityPass(conversation.sourceRefs[0], conversation)),
  ...selectedExpansion01Conversations,
  ...editorialCandidateFormal.filter((conversation) => !selectedExpansion01Conversations.some((selected) => selected.sourceRefs.includes(conversation.sourceRefs[0]))),
  ...longformOutput01Conversations.filter((conversation) => !['longform-lf01-02', 'longform-lf01-06', 'longform-lf01-07', 'longform-lf01-08'].includes(conversation.id)),
  ...promotedLongformConversations,
  ...realUsagePatch01Conversations,
]

const anchorMap = new Map(
  activeRunConversations
    .filter((conversation) => MAINLINE_ANCHOR_IDS.includes(conversation.id as typeof MAINLINE_ANCHOR_IDS[number]))
    .map((conversation) => [conversation.id, conversation]),
)
const legacyConversationMap = new Map(activeRunConversations.map((conversation) => [conversation.id, conversation]))
const ordinaryMap = new Map(ordinaryConversationPool.map((conversation) => [conversation.id, conversation]))

export const LEGACY_RUN_MANIFEST: RunManifest = {
  version: 1,
  id: 'manifest:legacy-v1',
  conversationIds: activeRunConversations.map((conversation) => conversation.id),
  ordinaryConversationIds: activeRunConversations
    .filter((conversation) => !MAINLINE_ANCHOR_IDS.includes(conversation.id as typeof MAINLINE_ANCHOR_IDS[number]))
    .map((conversation) => conversation.id),
  anchorConversationIds: [...MAINLINE_ANCHOR_IDS],
  firstOrdinaryConversationId: activeRunConversations.find((conversation) => !MAINLINE_ANCHOR_IDS.includes(conversation.id as typeof MAINLINE_ANCHOR_IDS[number]))?.id ?? activeRunConversations[0].id,
}

export function createMainline2Manifest(runId: string): RunManifest {
  const first = 'user-7391'
  return {
    version: 3,
    id: `manifest:mainline2:${runId}`,
    conversationIds: [first],
    ordinaryConversationIds: [],
    anchorConversationIds: [...MAINLINE_ANCHOR_IDS],
    firstOrdinaryConversationId: 'ml2-a1-01',
    mode: 'mainline2',
  }
}

export function appendMainline2Conversation(manifest: RunManifest, nextId: string): RunManifest {
  if (manifest.mode !== 'mainline2' || manifest.conversationIds.includes(nextId)) return manifest
  return { ...manifest, conversationIds: [...manifest.conversationIds, nextId] }
}

export function nextMainline2ConversationId(run: Parameters<typeof scheduleNextConversationId>[0], ordinaryConversations: Parameters<typeof scheduleNextConversationId>[1]) {
  return scheduleNextConversationId(run, ordinaryConversations)
}

function hashSeed(seed: string) {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function createEmptyExposureHistory(): NarrativeExposureHistory {
  return {
    version: 2,
    recentRuns: [],
    seenConversationIds: {},
    recentTopics: [],
    recentBehaviorModes: [],
    recentInteractionPatterns: [],
    recentTopicCategories: [],
  }
}

function interleaveAnchors(ordinary: string[]) {
  return [
    ...ordinary.slice(0, 2), MAINLINE_ANCHOR_IDS[0],
    ...ordinary.slice(2, 6), MAINLINE_ANCHOR_IDS[1],
    ...ordinary.slice(6, 12), MAINLINE_ANCHOR_IDS[2],
    ...ordinary.slice(12, 17), MAINLINE_ANCHOR_IDS[3],
    ...ordinary.slice(17), MAINLINE_ANCHOR_IDS[4],
  ]
}

export function createRunManifest(runId: string, exposure: NarrativeExposureHistory): RunManifest {
  const recentFirsts = new Set(exposure.recentRuns.slice(-5).map((run) => run.firstOrdinaryConversationId))
  const recentTwoIds = new Set(exposure.recentRuns.slice(-2).flatMap((run) => run.ordinaryConversationIds))
  const recentThreeIds = new Set(exposure.recentRuns.slice(-3).flatMap((run) => run.ordinaryConversationIds))
  const recentLongformIds = new Set(exposure.recentRuns.slice(-2).flatMap((run) => run.ordinaryConversationIds.filter((id) => id.startsWith('longform-'))))
  const stronglyFresh = ordinaryConversationPool.filter((conversation) => !recentTwoIds.has(conversation.id))
  const available = stronglyFresh.length >= 21 ? [...stronglyFresh] : [...ordinaryConversationPool]
  const selected: ConversationDefinition[] = []
  const roundCounts = new Set<number>()
  const patterns = new Set<InteractionPattern>()
  const patternCounts = new Map<InteractionPattern, number>()
  const choiceKinds = new Set<string>()
  const categoryCounts = new Map<TopicCategory, number>()
  let humorCount = 0

  const isHumor = (conversation: ConversationDefinition) => conversation.sourceRefs.some((sourceRef) => sourceRef.startsWith('humor01:'))
  const isLongform = (conversation: ConversationDefinition) => conversation.id.startsWith('longform-')

  const openingPatterns = new Set<InteractionPattern>(['standard-question', 'short-query', 'search-box-input', 'missing-context'])
  const allOpeningCandidates = available.filter((conversation) => openingPatterns.has(conversation.interactionPattern ?? 'standard-question') && conversation.nodes.length <= 2)
  const freshOpeningCandidates = allOpeningCandidates.filter((conversation) => !recentFirsts.has(conversation.id))
  const openingCandidates = freshOpeningCandidates.length > 0 ? freshOpeningCandidates : allOpeningCandidates
  openingCandidates.sort((left, right) => {
    const leftSeen = exposure.seenConversationIds[left.id] ?? 0
    const rightSeen = exposure.seenConversationIds[right.id] ?? 0
    if (leftSeen !== rightSeen) return leftSeen - rightSeen
    const leftRecent = recentFirsts.has(left.id) ? 1 : 0
    const rightRecent = recentFirsts.has(right.id) ? 1 : 0
    return leftRecent - rightRecent || hashSeed(`${runId}:opening:${left.id}`) - hashSeed(`${runId}:opening:${right.id}`)
  })
  const opening = openingCandidates[0]
  if (opening) {
    selected.push(opening)
    available.splice(available.findIndex((conversation) => conversation.id === opening.id), 1)
    roundCounts.add(opening.nodes.length)
    const openingPattern = opening.interactionPattern ?? 'standard-question'
    patterns.add(openingPattern)
    patternCounts.set(openingPattern, 1)
    if (opening.topicCategory) categoryCounts.set(opening.topicCategory, 1)
    if (isHumor(opening)) humorCount = 1
    choiceKinds.add(opening.nodes.some((node) => node.choiceKind === 'expression') ? 'expression' : 'semantic')
  }

  while (selected.length < 21 && available.length > 0) {
    available.sort((left, right) => {
      const score = (candidate: ConversationDefinition) => {
        const seenPenalty = (exposure.seenConversationIds[candidate.id] ?? 0) * 10_000
        const firstPenalty = selected.length === 0 && recentFirsts.has(candidate.id) ? 25_000 : 0
        const pattern = candidate.interactionPattern ?? 'standard-question'
        const kind = candidate.nodes.some((node) => node.choiceKind === 'expression')
          ? 'expression'
          : candidate.nodes.some((node) => node.choiceKind === 'convergent') ? 'convergent' : 'semantic'
        const diversityBonus = (roundCounts.has(candidate.nodes.length) ? 0 : 6_000)
          + (patterns.has(pattern) ? 0 : patterns.size < 10 ? 18_000 : 8_000)
          + (choiceKinds.has(kind) ? 0 : 5_000)
        const adjacentPenalty = selected.at(-1)?.interactionPattern === pattern ? 2_000 : 0
        const category = candidate.topicCategory
        const recentCategoryCount = category
          ? exposure.recentRuns.slice(-3).flatMap((run) => run.topicCategories ?? []).filter((item) => item === category).length
          : 0
        const currentCategoryPenalty = category ? (categoryCounts.get(category) ?? 0) * 1_800 : 0
        const repeatedPatternPenalty = (patternCounts.get(pattern) ?? 0) * 600
        const humorPenalty = isHumor(candidate) && humorCount > 0 ? 800 + humorCount * 250 : 0
        const longformPenalty = isLongform(candidate) && selected.some(isLongform) ? 2_400 : 0
        const roleplayAnchorPenalty = candidate.sourceRefs.includes('RUP01-20')
          && new Set([1, 2, 5, 6, 11, 12, 16, 17, 20]).has(selected.length)
          ? 30_000
          : 0
        const replayPenalty = (exposure.recentTopics.includes(candidate.topic ?? '') ? 1_400 : 0)
          + (exposure.recentInteractionPatterns.includes(pattern) ? 350 : 0)
          + candidate.behaviorModes.filter((mode) => exposure.recentBehaviorModes.includes(mode)).length * 120
          + recentCategoryCount * 900
          + (recentThreeIds.has(candidate.id) ? 12_000 : 0)
          + (isLongform(candidate) && recentLongformIds.has(candidate.id) ? 1_800 : 0)
        return seenPenalty + firstPenalty + adjacentPenalty + currentCategoryPenalty + repeatedPatternPenalty + humorPenalty + longformPenalty + roleplayAnchorPenalty + replayPenalty - diversityBonus
      }
      const difference = score(left) - score(right)
      return difference || hashSeed(`${runId}:${left.id}`) - hashSeed(`${runId}:${right.id}`)
    })
    const next = available.shift()!
    selected.push(next)
    roundCounts.add(next.nodes.length)
    const nextPattern = next.interactionPattern ?? 'standard-question'
    patterns.add(nextPattern)
    patternCounts.set(nextPattern, (patternCounts.get(nextPattern) ?? 0) + 1)
    if (next.topicCategory) categoryCounts.set(next.topicCategory, (categoryCounts.get(next.topicCategory) ?? 0) + 1)
    if (isHumor(next)) humorCount += 1
    choiceKinds.add(next.nodes.some((node) => node.choiceKind === 'expression')
      ? 'expression'
      : next.nodes.some((node) => node.choiceKind === 'convergent') ? 'convergent' : 'semantic')
  }

  const ordinaryConversationIds = selected.map((conversation) => conversation.id)
  return {
    version: 1,
    id: `manifest:${runId}`,
    conversationIds: interleaveAnchors(ordinaryConversationIds),
    ordinaryConversationIds,
    anchorConversationIds: [...MAINLINE_ANCHOR_IDS],
    firstOrdinaryConversationId: ordinaryConversationIds[0],
  }
}

export function recordRunExposure(history: NarrativeExposureHistory, manifest: RunManifest): NarrativeExposureHistory {
  // A run that exposed no ordinary content has nothing to record. Recording a
  // brand-new Mainline2 manifest (ordinary ledger still empty) would fabricate
  // a fake completed run and corrupt the cross-run downweighting signal.
  if (manifest.ordinaryConversationIds.length === 0) return history
  const seenConversationIds = { ...history.seenConversationIds }
  const topics: string[] = []
  const behaviorModes = new Set<HumanBehaviorMode>()
  const interactionPatterns = new Set<InteractionPattern>()
  const topicCategories = new Set<TopicCategory>()
  for (const id of manifest.ordinaryConversationIds) {
    const conversation = ordinaryMap.get(id)
    if (!conversation) continue
    seenConversationIds[id] = (seenConversationIds[id] ?? 0) + 1
    if (conversation.topic) topics.push(conversation.topic)
    for (const mode of conversation.behaviorModes) behaviorModes.add(mode)
    if (conversation.interactionPattern) interactionPatterns.add(conversation.interactionPattern)
    if (conversation.topicCategory) topicCategories.add(conversation.topicCategory)
  }
  const exposure = {
    runId: manifest.id,
    ordinaryConversationIds: [...manifest.ordinaryConversationIds],
    topics,
    behaviorModes: [...behaviorModes],
    interactionPatterns: [...interactionPatterns],
    topicCategories: [...topicCategories],
    firstOrdinaryConversationId: manifest.firstOrdinaryConversationId,
  }
  const recentRuns = [...history.recentRuns, exposure].slice(-5)
  const recentWindow = recentRuns.slice(-3)
  return {
    version: 2,
    recentRuns,
    seenConversationIds,
    recentTopics: [...new Set(recentWindow.flatMap((run) => run.topics))],
    recentBehaviorModes: [...new Set(recentWindow.flatMap((run) => run.behaviorModes))],
    recentInteractionPatterns: [...new Set(recentWindow.flatMap((run) => run.interactionPatterns))],
    recentTopicCategories: [...new Set(recentWindow.flatMap((run) => run.topicCategories))],
  }
}

function addFlag(flags: string[] | undefined, flag: string) {
  return flags?.includes(flag) ? flags : [...(flags ?? []), flag]
}

export function buildStoryContentForManifest(manifest: RunManifest): StoryContent {
  const conversations = manifest.conversationIds.map((id) => {
    const definition = manifest.mode === 'mainline2'
      ? MAINLINE2_BY_ID.get(id) ?? ordinaryMap.get(id) ?? anchorMap.get(id)
      : anchorMap.get(id) ?? ordinaryMap.get(id) ?? legacyConversationMap.get(id)
    if (!definition) throw new Error(`Unknown manifest conversation ${id}`)
    return cloneConversation(definition)
  })
  const nodes = conversations.flatMap((conversation) => conversation.nodes)
  const nodeIds = new Set(nodes.map((node) => node.id))
  const firstNodeByConversation = new Map(conversations.map((conversation) => [conversation.id, conversation.nodes[0]]))
  const nextConversationById = new Map(conversations.map((conversation, index) => [conversation.id, conversations[index + 1]]))
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]
    const next = nodes[index + 1]
    const effectFlag = next?.effect === 'level-1-model-flash'
      ? 'experienced_level_1'
      : next?.effect === 'level-2-memory-sync'
        ? 'experienced_level_2'
        : next?.effect === 'identity-reveal'
          ? 'recognized_maya_return'
          : undefined
    const choiceGroups = node.variants?.map((variant) => variant.choices) ?? [node.choices]
    for (const choices of choiceGroups) {
      for (const choice of choices) {
        if (!choice.effects?.arcs) {
          choice.effects = {
            ...choice.effects,
            arcs: deriveSemanticArcEffects(choice, node),
          }
        }
        const nextConversation = nextConversationById.get(node.conversationId)
        choice.nextNodeId = choice.continuation === 'end-conversation'
          ? (nextConversation ? firstNodeByConversation.get(nextConversation.id)?.id : undefined)
          : (node.conversationId.startsWith('real-usage-') && choice.nextNodeId && nodeIds.has(choice.nextNodeId) ? choice.nextNodeId : next?.id)
        if (effectFlag) {
          choice.effects = { ...choice.effects, flags: addFlag(choice.effects?.flags, effectFlag) }
        }
      }
    }
  }
  return { startNodeId: nodes[0].id, nodes }
}

export function getManifestConversation(conversationId: string) {
  return MAINLINE2_BY_ID.get(conversationId) ?? anchorMap.get(conversationId) ?? ordinaryMap.get(conversationId) ?? legacyConversationMap.get(conversationId)
}
