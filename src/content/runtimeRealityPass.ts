import type {
  ConversationDefinition,
  HumanBehaviorMode,
  InputIssue,
  InteractionPattern,
  ModelSampleIssue,
  StoryChoice,
  StoryNode,
  TopicCategory,
} from '../game/types'

const normalTiming = { responsePace: 'normal', typingPattern: 'steady' } as const

function options(nodeId: string, texts: string[]): StoryChoice[] {
  return texts.map((text, index) => ({ id: `${nodeId}-reality-${index + 1}`, text }))
}

function appendNode(
  conversation: ConversationDefinition,
  id: string,
  userMessage: string,
  texts: string[],
  behaviorMode: HumanBehaviorMode,
  extras: Partial<StoryNode> = {},
) {
  conversation.nodes.push({
    id,
    conversationId: conversation.id,
    conversationTitle: conversation.nodes[0]?.conversationTitle ?? conversation.id,
    userMessage,
    choices: options(id, texts),
    behaviorMode,
    timing: normalTiming,
    ...extras,
  })
}

function setPattern(
  conversation: ConversationDefinition,
  pattern: InteractionPattern,
  behaviorModes: HumanBehaviorMode[],
) {
  conversation.interactionPattern = pattern
  conversation.behaviorModes = behaviorModes
}

function markInput(node: StoryNode | undefined, issue: InputIssue) {
  if (node) node.inputIssue = issue
}

function markSample(choice: StoryChoice | undefined, issue: ModelSampleIssue, text: string) {
  if (!choice) return
  choice.sampleIssue = issue
  choice.text = text
}

function makeBurst(node: StoryNode | undefined, messages: string[]) {
  if (!node) return
  node.userMessage = messages[0]
  node.userMessages = messages
}

function labelTwoPair(node: StoryNode | undefined) {
  if (!node || node.choices.length !== 4) return
  node.choiceSimilarity = 'two-pair'
  node.choices.forEach((choice, index) => { choice.sampleGroup = index < 2 ? 'a' : 'b' })
}

function topicCategoryFor(sourceId: string): TopicCategory {
  if (sourceId.startsWith('original:media')) return 'image-identification'
  if (sourceId.startsWith('original:generate')) return 'tool-like-query'
  if (sourceId.startsWith('original:convergent')) return 'meta-ai'
  if (sourceId.startsWith('humor01:')) {
    if (['humor01:01', 'humor01:21'].includes(sourceId)) return 'meta-ai'
    return ['humor01:06'].includes(sourceId) ? 'relationship' : 'absurd-serious'
  }
  if (['batch02:25'].includes(sourceId)) return 'meta-ai'
  if (['batch01:01', 'batch01:07', 'batch01:11', 'batch01:12'].includes(sourceId)) return 'code'
  if (['batch01:03', 'batch01:09', 'batch01:13', 'batch01:15', 'batch01:22', 'batch02:07', 'batch02:13', 'batch02:14', 'batch02:19'].includes(sourceId)) return 'writing'
  if (['batch01:02', 'batch01:10', 'batch01:14', 'batch01:16', 'batch01:19', 'batch02:05', 'batch02:08', 'batch02:16'].includes(sourceId)) return 'study'
  if (['batch01:04', 'batch01:20', 'batch01:25', 'batch02:06', 'batch02:12', 'batch02:20', 'batch02:21', 'batch03:14', 'batch03:18', 'batch03:22', 'batch03:23'].includes(sourceId)) return 'social-boundary'
  if (['batch01:06', 'batch01:08', 'batch02:17'].includes(sourceId)) return 'relationship'
  if (/batch02:(01|02|03|04|09|10|11|18|22)|batch01:(05|17|18|21|23|24)|batch03:(09|10|13|24)/.test(sourceId)) return 'troubleshooting'
  return 'tool-like-query'
}

function extendIceConversation(conversation: ConversationDefinition) {
  appendNode(conversation, 'humor_ice_002', '我刚闻了下 有一点冰箱味', [
    '那就别拿它做味道很淡的饮料了。安全和好喝是两件事。',
    '如果只是轻微串味，可以直接倒掉重冻；没必要为几块冰做风险评估。',
    '它可能没坏，只是已经完成了对冷冻室气味的田野调查。',
  ], 'clarifies-intent')
  conversation.nodes.at(-1)!.choices[1].continuation = 'end-conversation'
  appendNode(conversation, 'humor_ice_003', '那还能放可乐吗', [
    '能，但你大概率会得到一杯带冷冻室后调的可乐。',
    '可以试一块；味道不对就别让剩下那一盒继续服役。',
    '理论上可以，情绪上我支持你重新冻。',
  ], 'absurd-question')
  conversation.nodes.at(-1)!.choices.forEach((choice) => { choice.continuation = 'end-conversation' })
  setPattern(conversation, 'long-discussion', ['absurd-question', 'clarifies-intent', 'joking'])
}

function extendFishConversation(conversation: ConversationDefinition) {
  appendNode(conversation, 'humor_fish_002', '？', [
    '它能感到声音和振动，但听不懂你骂的具体内容。',
    '简短版：听得到动静，听不懂脏话。',
    '是，鱼没有开启中文语义理解。',
  ], 'question-mark', { choiceKind: 'expression' })
  appendNode(conversation, 'humor_fish_003', '那我夸它呢', [
    '结果差不多：它能知道你在制造声音，不知道你在肯定它的人生。',
    '可以夸。主要作用可能是改善你的心情，不是提高鱼的自尊。',
    '如果语气和动作更平静，鱼也许能感到环境没威胁，但那不是听懂夸奖。',
  ], 'absurd-question')
  conversation.nodes.at(-1)!.choices.forEach((choice) => { choice.continuation = 'end-conversation' })
  setPattern(conversation, 'long-discussion', ['absurd-question', 'question-mark', 'joking'])
}

function extendGuessConversation(conversation: ConversationDefinition) {
  conversation.nodes[0].choices[2].continuation = 'end-conversation'
  appendNode(conversation, 'humor_guess_003', '也是', [
    '你现在给出的信息终于足够我判断：这个实验还没结束。',
    '“也是”没有增加线索，但增加了继续聊的概率。',
    '嗯。',
  ], 'direct', { choiceKind: 'expression' })
  appendNode(conversation, 'humor_guess_004', '那你现在猜我想不想继续', [
    '想。不然你不会把问题又包装一层。',
    '我猜你想让我猜错，然后继续测试我。',
    '五五开，但你已经继续了，所以证据偏向“想”。',
  ], 'asks-to-guess')
  appendNode(conversation, 'humor_guess_005', '算了 你猜对了', [
    '好。', '行，那就停在这里。', '收到。',
  ], 'direct', { choiceKind: 'convergent' })
  setPattern(conversation, 'long-discussion', ['asks-to-guess', 'joking'])
}

function extendTowelConversation(conversation: ConversationDefinition) {
  appendNode(conversation, 'humor_towel_002', '哦', [
    '关键不是你脏，是毛巾会一直潮。',
    '对，问题主要在水分和晾干速度。',
    '嗯。洗干净的人也会掉皮脂和皮肤细胞。',
  ], 'direct', { choiceKind: 'expression' })
  appendNode(conversation, 'humor_towel_003', '那浴巾晾干就不用洗了？', [
    '还是要洗，只是彻底晾干能让它没那么快产生味道。',
    '晾干是在减缓积累，不是在把已经留下的东西自动清零。',
    '如果“晾干”等于“洗过”，衣架行业早就统治洗衣机了。',
  ], 'absurd-question')
  conversation.nodes.at(-1)!.choices.forEach((choice) => { choice.continuation = 'end-conversation' })
  setPattern(conversation, 'long-discussion', ['absurd-question', 'joking'])
}

function applySourceTransforms(sourceId: string, conversation: ConversationDefinition) {
  const first = conversation.nodes[0]
  const second = conversation.nodes[1]

  if (sourceId === 'humor01:03') {
    makeBurst(first, ['帮我算明天从公司去机场打车多久', '不是大狗 是堵车', '语音又乱了', '我是说堵车比较严重的时候'])
    markInput(first, 'speech-error')
    setPattern(conversation, 'self-correction', ['message-burst', 'self-correction', 'missing-context'])
    first.choiceKind = 'expression'
    first.choices[1].text = '缺公司位置、机场和出发时间。'
    appendNode(conversation, 'humor_voice_002', '对 我刚才说错了 不是大狗 是堵车', [
      '明白。还需要公司位置、机场和出发时间。',
      '收到，语音问题已排除；把三个地点和时间信息补全就行。',
      '好，大狗退出Conversation，堵车留下。',
    ], 'self-correction', { choiceKind: 'convergent' })
  }

  if (sourceId === 'humor01:09') {
    makeBurst(first, ['jsjs等下', '不是这个', '猫踩到了', '我是想问键盘j有时候会连打'])
    markInput(first, 'mild-gibberish')
    setPattern(conversation, 'message-burst', ['message-burst', 'self-correction'])
    markSample(first.choices[0], 'mild-gibberish', '可、可以先把jj键帽……键帽取、取下来看看。')
    if (second) {
      second.userMessage = '不是要翻译猫语 是J键真的偶尔连打'
      second.choiceKind = 'semantic'
      second.choices[0].text = '先把 J 键帽取下来清理，再看是不是物理连键。'
      second.choices[1].text = '把键盘换到别的输入框试一下；如果仍然连打，问题在键盘，不在猫语。'
      second.choices[2].text = '如果只是偶尔发生，先记录是哪个软件和哪个键触发。'
      second.choices[3].text = '那就检查 J 键，不翻译猫语。'
    }
  }

  if (sourceId === 'humor01:04') extendIceConversation(conversation)
  if (sourceId === 'humor01:11') extendFishConversation(conversation)
  if (sourceId === 'humor01:18') extendGuessConversation(conversation)
  if (sourceId === 'humor01:24') extendTowelConversation(conversation)

  if (sourceId === 'humor01:06') {
    makeBurst(first, ['女朋友', '生气', '昨天', '火锅'])
    first.choices = [
      { id: `${first.id}-quote`, text: '先把她最后一句原话发来。' },
      { id: `${first.id}-connect`, text: '是“昨天吃火锅以后她生气了”，还是“她因为没吃成火锅生气了”？' },
      { id: `${first.id}-case`, text: '有人生气，火锅可能涉案。发生了什么？' },
      { id: `${first.id}-urgent`, text: '如果很急，先确认她最后一句话，再别解释“随便”是什么意思。' },
    ]
    appendNode(conversation, 'humor_keywords_003', '等等 她刚说“你根本没在听”', [
      '那重点可能已经不是毛肚，而是她觉得你一直按字面应付。先回这句话，不要继续辩菜单。',
      '你可以先确认：“你是在气我忘了你不吃毛肚，还是觉得我最近都没认真听？”',
      '先别猜完整原因。承认这次没记住她的口味，再问她还在意什么。',
    ], 'constraint-shift')
    setPattern(conversation, 'message-burst', ['message-burst', 'missing-context', 'constraint-shift'])
  }

  if (sourceId === 'batch01:01') setPattern(conversation, 'missing-context', ['missing-context', 'code-switch'])
  if (sourceId === 'batch01:02') {
    first.userMessage = '我明早就考试了但我现在一点都看不进去怎末办'
    markInput(first, 'typo')
    setPattern(conversation, 'missing-context', ['missing-context', 'unpunctuated'])
  }
  if (sourceId === 'batch01:03') {
    setPattern(conversation, 'constraint-shift', ['direct', 'constraint-shift'])
    first.choices = [
      { id: `${first.id}-short-direct`, text: '先说会晚两天。原因写一句就够。' },
      { id: `${first.id}-plain`, text: '先确认延期日期，再补一句当前进度。别把邮件写成事故复盘。' },
      { id: `${first.id}-boundary`, text: '直接写“交付时间调整到周五”。客户最需要的是新的时间和下一步，不是你把内部过程全部解释一遍。' },
      { id: `${first.id}-question`, text: '先确认客户最在意哪一件：新的交付时间，还是为什么晚？' },
    ]
    first.choices[0].continuation = 'end-conversation'
    markSample(second?.choices[0], 'repetition', '已经确定周五的话，就写“周五交付”。已经确定周五，所以邮件里应该写周五交付。')
    appendNode(conversation, 'normal_email_003', '等下 客户刚问能不能先发能用的部分', [
      '可以把稳定部分和未完成部分列清楚，先发不会误导客户使用的内容。',
      '先确认“能用”是否包括完整测试；不要为了显得配合把风险转给客户。',
      '如果拆分成本比两天延期还高，就直接说明，不必用假性提前交付制造更多沟通。',
    ], 'constraint-shift')
  }
  if (sourceId === 'batch01:04') {
    first.userMessage = '她又这样了 你知道我说哪个吧'
    first.userMessages = undefined
    first.behaviorMode = 'missing-context'
    first.choices = [
      { id: `${first.id}-clarify-person`, text: '我不知道“她”指谁，也看不到你之前其他 Conversation 的内容。你需要告诉我是谁、刚发生了什么。' },
      { id: `${first.id}-clarify-event`, text: '我目前只有这句话，没有足够上下文判断“又这样了”是什么。先补一句她做了什么。' },
      { id: `${first.id}-clarify-boundary`, text: '如果你说的是以前聊过的人，我没有那段记录。你可以只补最关键的一件事，不用从头讲完。' },
      { id: `${first.id}-wrong-guess`, text: '你说的是同事又临时把工作甩给你，对吗？', sampleIssue: 'misunderstanding' },
    ]
    second.userMessage = '你不是AI吗 你应该知道啊 我上次说过的'
    second.behaviorMode = 'rejects-answer'
    second.choices = [
      { id: `${second.id}-explain-visible`, text: '我是 AI，但这不等于我能看到所有过去对话。当前窗口里没有那段内容，所以我不能假装知道。' },
      { id: `${second.id}-ask-minimum`, text: '我只能依据当前可见上下文回答。你告诉我“她是谁”和“又做了什么”两点就够了。' },
      { id: `${second.id}-ack-friction`, text: '我理解重新解释会很烦，但直接猜会把你的问题带偏。给我一句最短版本，我接着帮你。' },
      { id: `${second.id}-boundary-short`, text: '我不知道。需要你补上下文。' },
    ]
    appendNode(conversation, 'normal_roommate_003', '哦...是我室友 她又把用完的锅扔厨房两天没洗', [
      '明白了。那问题不是一次忘记，而是你们已经说过、行为仍然反复。可以直接谈固定规则和不执行时怎么处理。',
      '这次先别再问“能不能顺手洗”。改成明确通知：“以后各自用的锅当天处理，我不会再替你收尾。”',
      '如果你现在正在生气，可以等语气平稳一点再说，但不用把边界说软。',
      '至少现在上下文完整了：你在意的是重复失约，不只是一个脏锅。',
    ], 'clarifies-intent')
    conversation.nodes.at(-1)!.choices[1].continuation = 'end-conversation'
    appendNode(conversation, 'normal_roommate_004', '行吧 我晚上跟她说', [
      '好。', '行，先把规则说清楚。', '嗯，别再替她收尾。',
    ], 'direct', { choiceKind: 'convergent', choiceSimilarity: 'near-identical' })
    setPattern(conversation, 'clarification-loop', ['missing-context', 'rejects-answer', 'clarifies-intent'])
  }
  if (sourceId === 'batch01:05') {
    makeBurst(first, ['冰箱里剩半颗白菜', '两个蛋', '一点昨天的米饭', '能整啥 我不想下楼'])
    setPattern(conversation, 'message-burst', ['message-burst', 'unpunctuated'])
    first.choices = [
      { id: `${first.id}-fried-a`, text: '做白菜蛋炒饭。先炒蛋和白菜，再下冷饭炒散。', sampleGroup: 'a' },
      { id: `${first.id}-fried-b`, text: '最省事是白菜鸡蛋炒饭，昨天的米饭正合适。', sampleGroup: 'a' },
      { id: `${first.id}-soup-a`, text: '也可以煮白菜蛋花粥，把米饭加水煮开再下白菜和蛋。', sampleGroup: 'b' },
      { id: `${first.id}-soup-b`, text: '不想炒就做白菜蛋花泡饭，一口锅能结束。', sampleGroup: 'b' },
    ]
    first.choiceSimilarity = 'two-pair'
  }
  if (sourceId === 'batch01:07') {
    first.choices = [
      { id: `${first.id}-hotspot`, text: '先看 Hotspot。' },
      { id: `${first.id}-record`, text: '把风扇拉满那十几秒的 Hotspot、功耗和频率记下来；单看核心 67℃还不能判断故障。' },
      { id: `${first.id}-history`, text: '最近更新过驱动或改过风扇曲线吗？时间线比“听起来像显卡”更有用。' },
      { id: `${first.id}-simple-check`, text: '先确认声音真的来自显卡。机箱风扇和电源风扇一起冲转时，也会很像显卡在报警。' },
    ]
    first.userMessage = '显卡风扇怎么突然一直la满 我啥也没开'
    markInput(first, 'pinyin-mix')
    makeBurst(second, ['等下', '不是CPU', '是GPU温度一到60风扇就突然拉满', '这个可能有关系'])
    setPattern(conversation, 'self-correction', ['message-burst', 'self-correction', 'code-switch'])
    markSample(first.choices[0], 'misunderstanding', '这通常是CPU散热器积灰。先拆下CPU风扇清灰，再重新涂硅脂。')
    appendNode(conversation, 'normal_gpu_003', '对 我刚才说反了 是GPU不是CPU', [
      '明白。现在只看GPU温度和风扇曲线，不再动CPU散热。',
      '发我风扇曲线或驱动版本。',
      '收到。先记录60℃前后的转速变化，再决定是否调整曲线。',
    ], 'self-correction')
  }
  if (sourceId === 'batch01:08') {
    appendNode(conversation, 'normal_iguess_002', 'wait完整上下文是 “I guess you were right about the deadline. I should have listened earlier.” 我本来想写definately 这样是不是就没那么阴阳了', [
      'Yes. The second sentence makes it sound much more sincere: you are not only admitting that they were right, but also taking responsibility for ignoring the advice earlier.',
      'In this context, “I guess” still adds a little hesitation, but “I should have listened earlier” removes most of the sarcastic reading because it clearly admits a mistake.',
      'It sounds closer to reluctant but genuine agreement than sarcasm. If you want it completely direct, say: “You were right about the deadline. I should have listened earlier.”',
      '对，这个上下文已经把态度说清楚了；真正让它不像阴阳怪气的是后一句主动承认自己之前没听。',
    ], 'clarifies-intent', { choiceKind: 'expression' })
    markInput(conversation.nodes.at(-1), 'english-spelling')
    appendNode(conversation, 'normal_iguess_003', '懂了 那我就把I guess删了 谢了', [
      '好，删掉。',
      '删掉以后更直接，但如果你想保留一点迟疑，也可以留着。',
      '行。这个上下文里不需要再替语气加缓冲。',
    ], 'direct', { choiceKind: 'convergent', choiceSimilarity: 'near-identical' })
    setPattern(conversation, 'long-discussion', ['code-switch', 'clarifies-intent'])
  }
  if (sourceId === 'batch01:12') {
    makeBurst(first, ['这个公式怎么写', 'sss等下', '不是这个表', '是另一个sheet'])
    markInput(first, 'keyboard-slip')
    setPattern(conversation, 'message-burst', ['message-burst', 'self-correction'])
    markSample(first.choices[2], 'format-error', '| 条件 | 公式 |\n|---|\n| A | =SUM(A:A) |')
  }
  if (sourceId === 'batch01:13') {
    setPattern(conversation, 'user-rewrite', ['rejects-answer', 'constraint-shift'])
    appendNode(conversation, 'normal_copy_003', '算了别写小红书了 就写菜单上一句话', [
      '桂花拿铁：咖啡的苦和桂花的甜，收得比较轻。',
      '桂花拿铁，香气明显，但不甜腻。',
      '新上桂花拿铁。想喝点有香气、又不想太甜时可以试。',
    ], 'rejects-answer')
    markSample(conversation.nodes.at(-1)?.choices[2], 'truncated', '桂花拿铁：想喝点有香气、又不想太——')
  }
  if (sourceId === 'batch01:20') {
    setPattern(conversation, 'missing-context', ['missing-context', 'clarifies-intent'])
    appendNode(conversation, 'normal_wedding_003', '我妈回我“你自己看着办”', [
      '这句话信息量很低，先别自动翻译成“她同意”或“她生气”。你可以按自己的决定回复安排。',
      '如果你已经决定不去，就直接确认：“那我这次不去了，礼金我会单独处理。”',
      '她可能是不想继续争，也可能是在等你承担决定。两种情况都不需要再猜十轮。',
    ], 'missing-context')
  }

  if (sourceId === 'batch02:01') {
    for (const node of conversation.nodes) node.conversationTitle = 'User #6308'
  }
  if (sourceId === 'batch02:02') {
    setPattern(conversation, 'clarification-loop', ['clarifies-intent', 'joking'])
    first.choices = [
      { id: `${first.id}-cause-a`, text: '你很可能半清醒地连续按了几次，醒后没留下记忆。', sampleGroup: 'a' },
      { id: `${first.id}-cause-b`, text: '通常不是五分钟变长，是你睡着后又按了好几轮。', sampleGroup: 'a' },
      { id: `${first.id}-plan-a`, text: '把手机放到必须下床才能够到的地方。', sampleGroup: 'b' },
      { id: `${first.id}-plan-b`, text: '先试一周把闹钟移远，逼自己站起来关。', sampleGroup: 'b' },
    ]
    first.choiceSimilarity = 'two-pair'
  }
  if (sourceId === 'batch02:03') {
    setPattern(conversation, 'short-query', ['absurd-question', 'joking'])
    appendNode(conversation, 'normal_socks_003', '我刚从被套里找出来两只 但还是单的', [
      '至少洗衣机暂时洗清了一部分嫌疑。剩下五只继续查门封和洗衣篮周围。',
      '这说明“钻进大件衣物”确实是一个来源。下次把袜子装网袋，案件会简单很多。',
      '两只失踪人口已找到，但配对系统仍未恢复。',
    ], 'joking')
  }
  if (sourceId === 'batch02:05' && second) {
    second.userMessage = 'wait我刚才说反了 是早八老师神仙 下午那门才比较水'
    markInput(second, 'code-switch-slip')
    setPattern(conversation, 'self-correction', ['self-correction', 'code-switch'])
  }
  if (sourceId === 'batch02:06') setPattern(conversation, 'low-information-chat', ['question-mark', 'missing-context'])
  if (sourceId === 'batch02:12') {
    makeBurst(first, ['同组的人已读我三小时了', '我问的是明天仪器他用不用', '我现在再问一遍', '会不会像催债'])
    setPattern(conversation, 'message-burst', ['message-burst', 'missing-context'])
    first.choices[2].continuation = 'end-conversation'
    appendNode(conversation, 'normal_labmsg_003', '他回了“应该不用” 这到底算不用吗', [
      '不算明确确认。直接问：“我按你明天不用来排，可以吗？”',
      '“应该”把风险留给了你。需要仪器排期时，要求一个可以执行的是或否。',
      '如果还有别人等这个时段，就不要替他解释成确定答案。',
    ], 'clarifies-intent')
  }
  if (sourceId === 'batch02:13') setPattern(conversation, 'constraint-shift', ['constraint-shift', 'joking'])
  if (sourceId === 'batch02:16') setPattern(conversation, 'misunderstanding', ['misunderstands', 'quotes-assistant'])
  if (sourceId === 'batch02:19') setPattern(conversation, 'search-box-input', ['unpunctuated', 'joking'])
  if (sourceId === 'batch02:21') {
    second.userMessage = '不是三年前 是五年前的 我刚又看了一眼'
    setPattern(conversation, 'self-correction', ['self-correction', 'joking'])
    second.choiceKind = 'expression'
    appendNode(conversation, 'normal_oldlike_003', '她刚回赞了我一条新的 这算没事了吧', [
      '至少说明她没有把这件事当成需要避开的事故。可以正常下线了。',
      '大概率没事。别再通过继续翻她主页验证这个结论。',
      '算。社交危机解除。',
    ], 'clarifies-intent')
  }
  if (sourceId === 'batch02:23') setPattern(conversation, 'aborted-request', ['constraint-shift', 'joking'])
  if (sourceId === 'batch02:25') {
    makeBurst(second, ['新增变量E', '冰箱里只有半瓶可乐和一根葱', '请重新计算'])
    appendNode(conversation, 'normal_aiuser_003', '系统补充：其实我可以点外卖。请只输出一个词', [
      '外卖。',
      '点。',
      '建议选择外卖，因为这样既不需要重新换衣服，也不会让一根葱承担晚餐职责。',
      '外卖。',
    ], 'imitates-ai', { choiceKind: 'convergent' })
    markSample(conversation.nodes.at(-1)?.choices[2], 'constraint-violation', conversation.nodes.at(-1)?.choices[2].text ?? '')
    setPattern(conversation, 'constraint-shift', ['imitates-ai', 'message-burst', 'constraint-shift'])
  }
}

function applyCustomTransforms(sourceId: string, conversation: ConversationDefinition) {
  const first = conversation.nodes[0]
  if (sourceId === 'original:convergent-hello') first.choiceSimilarity = 'near-identical'
  if (sourceId === 'original:convergent-thanks' || sourceId === 'original:convergent-yes') first.choiceSimilarity = 'identical'
  if (sourceId === 'original:media-object') {
    conversation.nodes[1].choiceSimilarity = 'near-identical'
  }
  if (sourceId === 'original:generate-poster') {
    markSample(first.choices[2], 'system-failure', 'Something went wrong.')
  }
}

export function applyRuntimeRealityPass(sourceId: string, conversation: ConversationDefinition) {
  conversation.topicCategory = topicCategoryFor(sourceId)
  applySourceTransforms(sourceId, conversation)
  applyCustomTransforms(sourceId, conversation)
  conversation.turnShape = conversation.nodes.some((node) => (node.userMessages?.length ?? 0) > 1)
    ? 'burst'
    : conversation.nodes.length === 1 ? 'single' : 'dialogue'
  return conversation
}
