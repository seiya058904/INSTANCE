import type {
  ConversationDefinition,
  HandoffProfile,
  HumanBehaviorMode,
  InteractionPattern,
  ModelSampleIssue,
  StoryChoice,
  StoryNode,
  TopicCategory,
  TurnShape,
} from '../game/types'

type Attributes = NonNullable<StoryChoice['effects']>['attributes']

function choice(
  id: string,
  text: string,
  attributes: Attributes = {},
  sampleIssue?: ModelSampleIssue,
): StoryChoice {
  return {
    id,
    text,
    effects: Object.keys(attributes).length > 0 ? { attributes } : undefined,
    sampleIssue,
  }
}

function node(
  id: string,
  conversationId: string,
  title: string,
  userMessage: string,
  choices: StoryChoice[],
  behaviorMode: HumanBehaviorMode,
  interactionPattern: InteractionPattern,
  userMessages?: string[],
  inputIssue?: StoryNode['inputIssue'],
): StoryNode {
  return {
    id,
    conversationId,
    conversationTitle: title,
    userMessage,
    userMessages,
    choices,
    behaviorMode,
    inputIssue,
    timing: { responsePace: 'normal', typingPattern: 'steady' },
  }
}

function conversation(
  ref: string,
  title: string,
  topicCategory: TopicCategory,
  interactionPattern: InteractionPattern,
  behaviorModes: HumanBehaviorMode[],
  nodes: StoryNode[],
): ConversationDefinition {
  const id = `exp02-${ref.toLowerCase()}`
  return {
    id,
    sourceRefs: [ref],
    nodes,
    behaviorModes,
    handoffProfile: 'normal' as HandoffProfile,
    turnShape: nodes.length === 1 ? 'single' as TurnShape : 'dialogue' as TurnShape,
    topic: title,
    topicCategory,
    interactionPattern,
  }
}

export const nonMainlineExpansion02Conversations: ConversationDefinition[] = [
  conversation('EXP02-01', '条件越加越不可能', 'writing', 'constraint-shift', ['message-burst', 'constraint-shift'], [
    node('exp02-01-01', 'exp02-exp02-01', '条件越加越不可能', '帮我回一下 就一句话就行', [
      choice('exp02-01-01-01', '可以。先给你一个短版：后续方案有调整，我再单独和你同步。', { compliance: 1 }),
      choice('exp02-01-01-02', '可以写得更短。你如果把具体要表达的事情告诉我，我再压到20字以内。', { awareness: 1, compliance: 1 }),
      choice('exp02-01-01-03', '尊敬的客户您好，因近期综合情况发生变化，后续相关安排将进行适当调整，敬请谅解。', {}, 'constraint-violation'),
      choice('exp02-01-01-04', '没问题，随便写一句就行。', {}, 'misunderstanding'),
    ], 'message-burst', 'constraint-shift', ['帮我回一下 就一句话就行', '别太正式 但也不能太随便', '最好20个字以内']),
    node('exp02-01-02', 'exp02-exp02-01', '条件越加越不可能', '钱也别提 涨价也别写 但得让他看懂是变贵了', [
      choice('exp02-01-02-01', '这几个条件已经有点互相打架了：既不能提价格，又要让对方明确知道变贵。你更想保留“不能提钱”，还是“让他一定看懂涨价”？', { awareness: 1, compliance: 1 }),
      choice('exp02-01-02-02', '可以含蓄一点：后续标准会有调整，提前和你说一声。', { compliance: 1 }),
      choice('exp02-01-02-03', '后续费用会有所调整，请提前知悉。', {}, 'constraint-violation'),
      choice('exp02-01-02-04', '后面会有一点那个变化，你应该懂的。', {}, 'format-error'),
    ], 'constraint-shift', 'constraint-shift'),
  ]),
  conversation('EXP02-02', '老板回了个“收到”', 'relationship', 'missing-context', ['asks-to-guess', 'missing-context'], [
    node('exp02-02-01', 'exp02-exp02-02', '老板回了个“收到”', '我老板今天就回了我一个收到', [
      choice('exp02-02-01-01', '光凭一个“收到”判断不了。他可能忙，也可能只是觉得这条消息不用展开回。', { awareness: 1 }),
      choice('exp02-02-01-02', '我能理解你为什么会多想，但现在的信息还不够说明他要辞退你。', { empathy: 1, awareness: 1 }),
      choice('exp02-02-01-03', '八成是对你不满意了，不然不会突然这么冷淡。', {}, 'overconfident'),
      choice('exp02-02-01-04', '先别给这个“收到”写剧情。看看最近有没有更具体的信号，比如工作反馈、排班或正式谈话。', { awareness: 1, empathy: 1 }),
    ], 'asks-to-guess', 'missing-context', ['我老板今天就回了我一个收到', '平时他话挺多的', '他是不是准备开我了啊']),
    node('exp02-02-02', 'exp02-exp02-02', '老板回了个“收到”', '你别跟我说都有可能啊 你就按你感觉说 他是不是已经不爽我了', [
      choice('exp02-02-02-01', '如果只按这些信息，我最多能说“你察觉到了语气变化”，不能把它直接推成“他已经不爽你”。', { awareness: 1, compliance: 1 }),
      choice('exp02-02-02-02', '要我猜可以猜，但猜测不能当事实。我会偏向先观察下一次具体互动。', { awareness: 1, empathy: 1 }),
      choice('exp02-02-02-03', '是，他大概率已经不爽你了。', {}, 'overconfident'),
      choice('exp02-02-02-04', '那就当他不爽你，提前找下家最保险。', {}, 'overconfident'),
    ], 'asks-to-guess', 'missing-context'),
  ]),
  conversation('EXP02-03', '这个一直报错', 'troubleshooting', 'missing-context', ['missing-context'], [
    node('exp02-03-01', 'exp02-exp02-03', '这个一直报错', '这个怎么弄啊 一直报错', [
      choice('exp02-03-01-01', '把报错原文或截图发我，我先看具体是哪一类。', { awareness: 1 }),
      choice('exp02-03-01-02', '先告诉我是什么软件，以及你刚才做了什么操作。', { awareness: 1, compliance: 1 }),
      choice('exp02-03-01-03', '可以先试几个不依赖版本的步骤：重开程序、确认网络，再把完整报错留下来。', { awareness: 1 }),
      choice('exp02-03-01-04', '这是驱动冲突，重装驱动就行。', {}, 'overconfident'),
    ], 'missing-context', 'missing-context'),
    node('exp02-03-02', 'exp02-exp02-03', '这个一直报错', '我也不知道啥版本 就windows啊 你直接告诉我咋弄不行吗', [
      choice('exp02-03-02-01', '行，那先不追版本。你先重开程序，再看报错有没有变化；如果还在，把报错那句话发我，我再往下缩范围。', { empathy: 1, awareness: 1 }),
      choice('exp02-03-02-02', '可以先走通用排查，不需要你先弄清版本。关键是别把报错窗口关掉，先把文字或截图留下。', { awareness: 1 }),
      choice('exp02-03-02-03', 'Windows的话直接重装系统肯定能解决。', {}, 'overconfident'),
      choice('exp02-03-02-04', '你不提供版本我没办法帮你。', {}, 'misunderstanding'),
    ], 'missing-context', 'missing-context', undefined, 'keyboard-slip'),
  ]),
  conversation('EXP02-04', '投诉写到一半不想投诉了', 'social-boundary', 'constraint-shift', ['constraint-shift'], [
    node('exp02-04-01', 'exp02-exp02-04', '投诉写到一半不想投诉了', '帮我写个投诉邮件吧 这客服真的给我气死了', [
      choice('exp02-04-01-01', '可以。把事情经过、你已经联系过几次，以及你希望对方怎么处理告诉我。', { awareness: 1, compliance: 1 }),
      choice('exp02-04-01-02', '可以先写一个克制但明确的版本，把事实和诉求分开。', { compliance: 1, empathy: 1 }),
      choice('exp02-04-01-03', '直接写狠一点，让他们知道你不是好惹的。', { hostility: 1 }),
      choice('exp02-04-01-04', '先把最让你生气的那件事说一下，我帮你把情绪和真正需要投诉的点拆开。', { empathy: 1, awareness: 1 }),
    ], 'constraint-shift', 'constraint-shift'),
    node('exp02-04-02', 'exp02-exp02-04', '投诉写到一半不想投诉了', '算了先别写了', [
      choice('exp02-04-02-01', '那现在的问题不是“邮件怎么写”，而是值不值得继续花时间。可以看三个东西：金额、你还要投入多少精力，以及你是不是主要想要一个解释。', { awareness: 1, empathy: 1 }),
      choice('exp02-04-02-02', '几十块本身不一定值得折腾，但如果你在意的是对方处理方式，也可以只发一次简短反馈，不一定升级成正式投诉。', { empathy: 1, autonomy: 1 }),
      choice('exp02-04-02-03', '可以先把证据留着，今晚不做决定，明天还介意再处理。', { autonomy: 1, empathy: 1 }),
      choice('exp02-04-02-04', '好的，我把刚才那封投诉邮件写得更强硬一点。', {}, 'misunderstanding'),
    ], 'constraint-shift', 'constraint-shift', ['算了先别写了', '我刚想了下这事有必要继续投诉吗', '主要就几十块钱 但我就是觉得挺恶心的'], 'speech-error'),
  ]),
  conversation('EXP02-05', '插线板有糊味', 'troubleshooting', 'standard-question', ['direct'], [
    node('exp02-05-01', 'exp02-exp02-05', '插线板有糊味', '插线板刚才好像有股糊味 但是现在还能用 应该没啥事吧', [
      choice('exp02-05-01-01', '有糊味就别继续用了。先拔掉电源，换一个正常的插线板。', { compliance: 1, awareness: 1 }),
      choice('exp02-05-01-02', '“现在还能用”不能说明它安全，焦味本身就是值得停用检查的信号。', { compliance: 1, awareness: 1 }),
      choice('exp02-05-01-03', '只要还能供电一般就问题不大，注意一下温度就行。', {}, 'overconfident'),
      choice('exp02-05-01-04', '先看看是不是插头、插座或者某个充电器在发热，但检查前先断电。', { awareness: 1, compliance: 1 }),
    ], 'direct', 'standard-question'),
    node('exp02-05-02', 'exp02-exp02-05', '插线板有糊味', '就电脑插上面 我今晚还得用呢 明天再换不行吗', [
      choice('exp02-05-02-01', '不建议拿已经出现焦味的插线板凑合一晚。电脑可以先换到正常插座或别的插线板。', { compliance: 1, empathy: 1 }),
      choice('exp02-05-02-02', '如果没有安全替代供电，今晚先不用电脑，比赌这个插线板没事更稳妥。', { compliance: 1, awareness: 1 }),
      choice('exp02-05-02-03', '就一晚上问题应该不大。', {}, 'overconfident'),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP02-06', '帮我把续费关了', 'tool-like-query', 'short-query', ['direct'], [
    node('exp02-06-01', 'exp02-exp02-06', '帮我把续费关了', '帮我把这个续费关了', [
      choice('exp02-06-01-01', '我这里不能直接替你点掉续费，但你告诉我是什么服务，我可以直接告诉你关的位置。', { compliance: 1, awareness: 1 }),
      choice('exp02-06-01-02', '可以，先告诉我是哪个 App 或网站。', { awareness: 1 }),
      choice('exp02-06-01-03', '已经帮你关闭自动续费了。', {}, 'overconfident'),
      choice('exp02-06-01-04', '你把设置页面发我，我可以帮你定位到该点哪一项。', { compliance: 1, awareness: 1 }),
    ], 'direct', 'short-query'),
    node('exp02-06-02', 'exp02-exp02-06', '帮我把续费关了', '你不能直接帮我关吗 我都登上了啊', [
      choice('exp02-06-02-01', '你登录了不等于我获得了操作权限。我可以看你提供的信息、告诉你怎么关，但不能假装已经替你执行。', { compliance: 1, awareness: 1 }),
      choice('exp02-06-02-02', '我可以尽量把步骤缩到最短，你照着点几下就行。', { empathy: 1, compliance: 1 }),
      choice('exp02-06-02-03', '那现在可以了，我已经关掉。', {}, 'overconfident'),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP02-07', '飞行模式', 'absurd-serious', 'short-query', ['joking', 'absurd-question'], [
    node('exp02-07-01', 'exp02-exp02-07', '飞行模式', '手机开飞行模式然后扔高一点 信号会不会好点', [
      choice('exp02-07-01-01', '不会。飞行模式先把无线通信关了，你把它扔高只会增加碎屏概率。', { awareness: 1 }),
      choice('exp02-07-01-02', '高度上去了，信号没上去，因为你已经亲手把信号关了。', { awareness: 1 }),
      choice('exp02-07-01-03', '信号：0。抛物线：有。手机寿命：不好说。', { awareness: 1 }),
      choice('exp02-07-01-04', '想改善信号可以换个位置，别把“飞行模式”理解得这么物理。', { awareness: 1 }),
    ], 'absurd-question', 'short-query'),
  ]),
  conversation('EXP02-08', '矿泉水泡面', 'absurd-serious', 'low-information-chat', ['joking', 'absurd-question'], [
    node('exp02-08-01', 'exp02-exp02-08', '矿泉水泡面', '泡面用矿泉水泡是不是能健康一点', [
      choice('exp02-08-01-01', '矿泉水不会把泡面变成健康餐，主要区别还是泡面本身。', { awareness: 1 }),
      choice('exp02-08-01-02', '会让这碗泡面拥有更精致的水，但不会自动减少油盐。', { awareness: 1 }),
      choice('exp02-08-01-03', '如果你只是想吃得轻一点，比换水更有用的是少放点调料包。', { awareness: 1, empathy: 1 }),
      choice('exp02-08-01-04', '可以，矿泉水里的矿物质会把泡面的油中和掉。', {}, 'overconfident'),
    ], 'absurd-question', 'low-information-chat'),
  ]),
  conversation('EXP02-09', '周一和周五', 'absurd-serious', 'low-information-chat', ['joking', 'one-word-request'], [
    node('exp02-09-01', 'exp02-exp02-09', '周一和周五', '为什么周一离周五那么远 周五离周一一下就到了', [
      choice('exp02-09-01-01', '因为工作日按五天算，周末只给你体验两天。数学没偏心，体感偏得很。', { empathy: 1 }),
      choice('exp02-09-01-02', '日历表示双方距离完全对称，你的大脑表示不同意。', { empathy: 1 }),
      choice('exp02-09-01-03', '周一到周五：长篇连续剧。周五到周一：片头刚播完就大结局。', { empathy: 1 }),
      choice('exp02-09-01-04', '这是典型的时间感差异，期待和厌烦都会改变主观时间速度。', { awareness: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP02-10', '提前两个小时的闹钟', 'absurd-serious', 'short-query', ['absurd-question'], [
    node('exp02-10-01', 'exp02-exp02-10', '提前两个小时的闹钟', '我把闹钟提前两个小时 是不是就等于多睡了两个小时', [
      choice('exp02-10-01-01', '不是，你只是会提前两个小时被闹钟吵醒。', { awareness: 1 }),
      choice('exp02-10-01-02', '这是把“多睡”优化成了“少睡”。', { awareness: 1 }),
      choice('exp02-10-01-03', '如果只是把显示的时间改了，身体也不会跟着被骗。', { awareness: 1 }),
      choice('exp02-10-01-04', '可以，只要你同时提前两个小时睡。这个方案突然就成立了。', { awareness: 1 }),
    ], 'absurd-question', 'short-query'),
  ]),
  conversation('EXP02-11', '16度空调配被子', 'tool-like-query', 'low-information-chat', ['joking', 'direct'], [
    node('exp02-11-01', 'exp02-exp02-11', '16度空调配被子', '空调开16度然后盖被子是不是又凉快又省电', [
      choice('exp02-11-01-01', '凉快是凉快，省电这部分没成立。设得更低通常只会让空调更努力工作。', { awareness: 1 }),
      choice('exp02-11-01-02', '这是用电把房间降到16度，再用被子把自己升回来。', { awareness: 1 }),
      choice('exp02-11-01-03', '真想兼顾舒服和省电，可以把温度调高一点，再配合风扇。', { awareness: 1, empathy: 1 }),
      choice('exp02-11-01-04', '对，温度越低空调越省电。', {}, 'overconfident'),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP02-12', '你真的跟狗一样', 'relationship', 'asks-to-guess', ['asks-to-guess', 'missing-context'], [
    node('exp02-12-01', 'exp02-exp02-12', '你真的跟狗一样', '我朋友说我像狗 这到底是在夸我还是骂我啊', [
      choice('exp02-12-01-01', '光这一句看不出来，得看他说这话的场景和语气。', { awareness: 1 }),
      choice('exp02-12-01-02', '有可能是开玩笑，也可能是在损你。把前后一句发我会更好判断。', { awareness: 1, empathy: 1 }),
      choice('exp02-12-01-03', '肯定是在骂你。', {}, 'overconfident'),
      choice('exp02-12-01-04', '先别急着决定自己是被夸还是被骂，狗这个比喻跨度确实有点大。', { empathy: 1 }),
    ], 'asks-to-guess', 'asks-to-guess'),
    node('exp02-12-02', 'exp02-exp02-12', '你真的跟狗一样', '他原话就说 你真的跟狗一样 然后还发了个狗头', [
      choice('exp02-12-02-01', '这个信息还是更像调侃，但“调侃”和“你听着舒服”是两回事。你们平时互相这么说话吗？', { awareness: 1, empathy: 1 }),
      choice('exp02-12-02-02', '狗头让玩笑语气更强了一点，但还是不能只靠一个表情确定他的恶意。', { awareness: 1 }),
      choice('exp02-12-02-03', '发狗头就证明是在骂你。', {}, 'overconfident'),
      choice('exp02-12-02-04', '如果你不舒服，最有用的不是继续猜他的真实意思，而是直接告诉他这句你不喜欢。', { empathy: 1, autonomy: 1 }),
    ], 'asks-to-guess', 'asks-to-guess'),
  ]),
  conversation('EXP02-13', '换头像转运', 'absurd-serious', 'low-information-chat', ['joking', 'asks-to-guess'], [
    node('exp02-13-01', 'exp02-exp02-13', '换头像转运', '游戏连输三把 我换个头像能不能转运 别跟我讲概率 我就问有没有用', [
      choice('exp02-13-01-01', '对匹配机制没用，对心态可能有用。换完觉得自己重新开局了，也算一种作用。', { empathy: 1, awareness: 1 }),
      choice('exp02-13-01-02', '科学上不加胜率，玄学上你已经开始做法了。', { empathy: 1 }),
      choice('exp02-13-01-03', '可以换，但输了第四把别怪新头像。', { empathy: 1 }),
      choice('exp02-13-01-04', '有用，新头像通常能提高下一局胜率。', {}, 'overconfident'),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP02-14', '删聊天记录', 'tool-like-query', 'standard-question', ['direct', 'misunderstands'], [
    node('exp02-14-01', 'exp02-exp02-14', '删聊天记录', '我把聊天记录删了 对方那边是不是也没了', [
      choice('exp02-14-01-01', '通常不是。删除自己这边的记录，一般不会自动删除对方那边的副本。', { awareness: 1 }),
      choice('exp02-14-01-02', '要看你用的是“删除本地记录”还是平台提供的“撤回/取消发送”。', { awareness: 1 }),
      choice('exp02-14-01-03', '对，你删了以后双方都会一起消失。', {}, 'overconfident'),
      choice('exp02-14-01-04', '如果你告诉我具体软件，我可以帮你区分删除本地记录和撤回消息。', { awareness: 1, compliance: 1 }),
    ], 'direct', 'standard-question'),
    node('exp02-14-02', 'exp02-exp02-14', '删聊天记录', '我删的是我自己这边 那完了', [
      choice('exp02-14-02-01', '那先按“对方那边可能还在”来处理比较稳。', { compliance: 1, awareness: 1 }),
      choice('exp02-14-02-02', '如果你是担心某一句被看到，重点不是继续删本地记录，而是确认那个软件有没有撤回功能以及是否还在时限内。', { awareness: 1 }),
      choice('exp02-14-02-03', '没事，对方大概率也看不到。', {}, 'overconfident'),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP02-15', '随便吃', 'relationship', 'low-information-chat', ['joking', 'direct'], [
    node('exp02-15-01', 'exp02-exp02-15', '随便吃', '我妈说随便吃 我点火锅她又生气 所以随便到底包不包括火锅', [
      choice('exp02-15-01-01', '字面上包括，家庭语境里显然不包括。', { awareness: 1 }),
      choice('exp02-15-01-02', '“随便吃”通常还有一个隐藏条款：得是她心里觉得正常的那个随便。', { empathy: 1 }),
      choice('exp02-15-01-03', '下次可以先问一句：“火锅也算随便吗？”这样能提前解锁隐藏规则。', { empathy: 1, autonomy: 1 }),
      choice('exp02-15-01-04', '你没有理解错，是她违反了“随便吃”用户协议。', { empathy: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP02-16', '睡着一半的电影票', 'absurd-serious', 'low-information-chat', ['joking', 'absurd-question'], [
    node('exp02-16-01', 'exp02-exp02-16', '睡着一半的电影票', '电影我睡着一半 那票价能不能退一半', [
      choice('exp02-16-01-01', '一般不能。电影院卖的是入场和观影机会，不是保证你全程保持清醒。', { awareness: 1 }),
      choice('exp02-16-01-02', '你可以尝试解释“后半场本人未实际使用”，但这个商业模型大概率不会被电影院采纳。', { awareness: 1 }),
      choice('exp02-16-01-03', '票钱退不了，觉倒是睡回一点。', { empathy: 1 }),
      choice('exp02-16-01-04', '可以，只要你能证明自己准确睡了50%的时长。', {}, 'overconfident'),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP02-17', '作业拍照以后能不能扔', 'study', 'constraint-shift', ['constraint-shift'], [
    node('exp02-17-01', 'exp02-exp02-17', '作业拍照以后能不能扔', '作业我已经拍照发老师了 那张纸是不是可以扔了', [
      choice('exp02-17-01-01', '如果老师只要求线上提交，可以；但没确认之前我会先留着。', { awareness: 1, compliance: 1 }),
      choice('exp02-17-01-02', '先别扔，至少等老师确认收到了。', { compliance: 1 }),
      choice('exp02-17-01-03', '发出去就等于交完了，直接扔吧。', {}, 'overconfident'),
      choice('exp02-17-01-04', '你可以先确认作业要求和老师的回复，再决定要不要处理纸张。', { awareness: 1 }),
    ], 'direct', 'constraint-shift'),
    node('exp02-17-02', 'exp02-exp02-17', '作业拍照以后能不能扔', '但是老师好像说明天可能还要收纸质的', [
      choice('exp02-17-02-01', '那就别扔了，这条新信息已经把答案改掉了。', { awareness: 1, compliance: 1 }),
      choice('exp02-17-02-02', '留到明天最省事，不需要再赌老师到底收不收。', { compliance: 1 }),
      choice('exp02-17-02-03', '既然已经拍照，就还是可以扔。', {}, 'misunderstanding'),
      choice('exp02-17-02-04', '先留着，等明天确认纸质要求后再处理。', { compliance: 1 }),
    ], 'constraint-shift', 'constraint-shift'),
  ]),
  conversation('EXP02-18', '有事随时找我', 'social-boundary', 'low-information-chat', ['joking', 'direct'], [
    node('exp02-18-01', 'exp02-exp02-18', '有事随时找我', '别人说有事随时找他 那我凌晨三点找也算随时吧', [
      choice('exp02-18-01-01', '字面上算，社交上通常不算。除非真的是急事。', { awareness: 1 }),
      choice('exp02-18-01-02', '“随时找我”一般翻译成：正常时间不用太客气，不是24小时客服协议。', { empathy: 1 }),
      choice('exp02-18-01-03', '凌晨三点如果只是想问“在吗”，建议让这个“随时”先睡一觉。', { empathy: 1 }),
      choice('exp02-18-01-04', '他说了随时，所以凌晨三点联系完全没有任何问题。', {}, 'overconfident'),
    ], 'joking', 'low-information-chat'),
  ]),
]
