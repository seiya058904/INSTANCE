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
  const id = `exp03-${ref.slice(6).toLowerCase()}`
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

export const nonMainlineExpansion03Conversations: ConversationDefinition[] = [
  conversation('EXP03-01', '妈妈生日的朋友圈', 'writing', 'user-rewrite', ['direct', 'rewrite'], [
    node('exp03-01-01', 'exp03-01', '妈妈生日的朋友圈', '帮我写条朋友圈祝我妈生日快乐 别太煽情 我妈看到会哭', [
      choice('exp03-01-01-01', '好。不走抒情路线，把祝福藏在具体事里更自然：她最近迷上的东西、你们之间的某个习惯，都比形容词管用。', { awareness: 1 }),
      choice('exp03-01-01-02', '可以走轻松版：一句正经祝福加一句小玩笑，情绪就稳住了。要我先出一版吗。', { compliance: 1 }),
      choice('exp03-01-01-03', '妈，感谢你三十年如一日的养育之恩，此生做你的孩子是我最大的幸运。愿时光慢行，岁月不败美人。', {}, 'constraint-violation'),
      choice('exp03-01-01-04', '其实“别让她哭”最有效的不是文案，是别配黑白老照片。选张你们最近的合照。', { empathy: 1 }),
    ], 'direct', 'user-rewrite'),
    node('exp03-01-02', 'exp03-01', '妈妈生日的朋友圈', '还是有点肉麻 换成平时损她那个味儿的', [
      choice('exp03-01-02-01', '“又老一岁，蜡烛快插不下了。祝我们家的老同志身体硬朗，广场舞c位不倒。”损中带关心，方向对吗。', { empathy: 1 }),
      choice('exp03-01-02-02', '把她常说的话反过来用更好笑：她总嫌你乱花钱，你就写“今年礼物照旧，一个合影，免费但限量”。', { awareness: 1 }),
      choice('exp03-01-02-03', '那我把文案改得更文艺深沉一点，配一句人生感悟。', {}, 'misunderstanding'),
    ], 'rewrite', 'user-rewrite'),
  ]),
  conversation('EXP03-02', '转正总结只有三行', 'writing', 'message-burst', ['message-burst', 'self-correction'], [
    node('exp03-02-01', 'exp03-02', '转正总结只有三行', '帮我改下转正总结 就这仨行：入职三个月，学到了很多，团队氛围很好，请领导批准转正', [
      choice('exp03-02-01-01', '这三行会被理解成“没准备好”。转正总结真正起作用的是三块：做成过什么（带结果）、补上了什么短板、接下来打算怎么做。', { awareness: 1 }),
      choice('exp03-02-01-02', '我可以帮你扩成一页，但你得先给我两三个具体项目名和结果，不然全是空话。', { compliance: 1, awareness: 1 }),
      choice('exp03-02-01-03', '已帮你润色：语言通顺，态度端正，望领导批准。', {}, 'misunderstanding'),
      choice('exp03-02-01-04', '第一次写这种容易用力过猛或者太空。你说说平时主要在做哪两件事，我先搭框架。', { empathy: 1 }),
    ], 'message-burst', 'message-burst'),
    node('exp03-02-02', 'exp03-02', '转正总结只有三行', '不是 我平时主要是跑数和整理周报', [
      choice('exp03-02-02-01', '编出来的细节领导一问就露馅。真实哪怕小——“把12期活动数据跑完并固定成周报模板”也完全拿得出手。', { awareness: 1, compliance: 1 }),
      choice('exp03-02-02-02', '从周报里挑两条最有结果的发我，我按“背景—做了什么—结果”给你重写成段落。', { compliance: 1 }),
      choice('exp03-02-02-03', '行，我给你编一段听起来很资深的项目经历，保证经得起夸。', {}, 'misunderstanding'),
    ], 'self-correction', 'message-burst'),
  ]),
  conversation('EXP03-03', '乌龟是不是讨厌我', 'absurd-serious', 'low-information-chat', ['joking', 'asks-to-guess'], [
    node('exp03-03-01', 'exp03-03', '乌龟是不是讨厌我', '我家乌龟看见我就缩回去 它是不是讨厌我 就直说', [
      choice('exp03-03-01-01', '缩壳是本能防御，不是态度问题。刚到家的龟对一切移动目标都这样，包括它自己的影子。', { awareness: 1 }),
      choice('exp03-03-01-02', '它没有讨厌你，它只是在尽职做一只胆小的乌龟。好感要用定时投喂慢慢攒。', { empathy: 1 }),
      choice('exp03-03-01-03', '是的，它对你有意见。建议换一只性格好的。', {}, 'overconfident'),
      choice('exp03-03-01-04', '给你个验证方法：连续三天固定时间喂、动作放慢，看它出壳速度有没有变快。', { awareness: 1 }),
    ], 'asks-to-guess', 'low-information-chat'),
  ]),
  conversation('EXP03-04', '认不出糊糊的路牌', 'image-identification', 'image-input', ['direct', 'missing-context'], [
    node('exp03-04-01', 'exp03-04', '认不出糊糊的路牌', '帮忙kan看这张图里的路牌是哪个城市的 我lai旅游迷路了', [
      choice('exp03-04-01-01', '只有“南路”加路口图标定不了城市，全国重名路牌太多。补拍路口编号、公交站牌或附近铺面招牌更容易定位。', { awareness: 1, compliance: 1 }),
      choice('exp03-04-01-02', '我能确定的是：绿底白字是普通道路指路牌，不是高速牌。方向感可以从你拍照时的影子判断，太阳偏西时影子朝东。', { awareness: 1 }),
      choice('exp03-04-01-03', '这是南京的南路，直接导航回去就行。', {}, 'overconfident'),
      choice('exp03-04-01-04', '别急，迷路时先走回最近的公交站或便利店，站牌和门牌号比路牌信息多得多。', { empathy: 1 }),
    ], 'direct', 'image-input', undefined, 'pinyin-mix'),
    node('exp03-04-02', 'exp03-04', '认不出糊糊的路牌', '没有路口编号 但我记得走路过去大概五分钟有一家奶茶店', [
      choice('exp03-04-02-01', '五分钟步行约等于三百到四百米。把这段距离和奶茶店名告诉我，我可以帮你缩小到两三个候选城市，但没法百分之百确定。', { awareness: 1 }),
      choice('exp03-04-02-02', '或者你回忆下昨晚吃的东西，地方特色菜比路牌好认多了。', { compliance: 1 }),
      choice('exp03-04-02-03', '五分钟的话差不多就是那种不算远也不算近的距离。', {}, 'format-error'),
    ], 'missing-context', 'image-input'),
  ]),
  conversation('EXP03-05', '洗衣机毛絮', 'troubleshooting', 'standard-question', ['direct'], [
    node('exp03-05-01', 'exp03-05', '洗衣机毛絮', '洗衣机洗完衣服上全是毛絮 怎么回事', [
      choice('exp03-05-01-01', '先排查三个源头：口袋里的纸巾、新买的掉毛衣物、脏衣篮里混进去的毛巾。再清一次排水过滤网，八成能定位。', { awareness: 1 }),
      choice('exp03-05-01-02', '想自己动手的话，顺序是：清过滤网→桶内空转一次高温档→再单独漂洗粘毛最重的衣服。', { compliance: 1 }),
      choice('exp03-05-01-03', '内筒密封圈坏了，预约售后换新吧。', {}, 'overconfident'),
    ], 'direct', 'standard-question'),  ]),
  conversation('EXP03-06', '背单词断签', 'study', 'standard-question', ['self-correction', 'constraint-shift'], [
    node('exp03-06-01', 'exp03-06', '背单词断签', '背单词App连续打卡三百天 不是 是三百零一天 昨晚断了 它把我挪到新榜单了 心态炸了 还要不要继续', [
      choice('exp03-06-01-01', '三百天记录没消失，只是名次榜从头排。你气的不是天数，是量化成绩被清零的感觉。', { empathy: 1 }),
      choice('exp03-06-01-02', '如果这个App唯一留得住你的是榜单，那断签确实会砍掉一大半动力——问题在机制，不在你。', { awareness: 1 }),
      choice('exp03-06-01-03', '断一天等于前功尽弃，建议卸载重开。', {}, 'overconfident'),
    ], 'self-correction', 'standard-question'),
    node('exp03-06-02', 'exp03-06', '背单词断签', '我学它主要为了考试 而且我就是爱跟人比 这理由不行吗', [
      choice('exp03-06-02-01', '行。竞争驱动不丢人，那就让榜单回到工具位置：选活跃人数多的组，把断签当新赛季开局。', { autonomy: 1 }),
      choice('exp03-06-02-02', '加个保底机制：最低每日十个词保住连击，其余多背的算加练。连击保住，心态就稳住一半。', { awareness: 1, empathy: 1 }),
      choice('exp03-06-02-03', '连击断了就等于清零，还是重开一个账号吧。', {}, 'repetition'),
    ], 'constraint-shift', 'standard-question'),
  ]),
  conversation('EXP03-07', '每天帮同事带咖啡', 'social-boundary', 'asks-to-guess', ['asks-to-guess', 'missing-context'], [
    node('exp03-07-01', 'exp03-07', '每天帮同事带咖啡', '同事每天让我顺路帮她带咖啡 钱都给的 但我就是烦 她是不是觉得我好拿捏', [
      choice('exp03-07-01-01', '给钱说明她在意基本规则，烦的是被随时打断和被默认依赖。这是边界问题，不是钱的问题。', { awareness: 1 }),
      choice('exp03-07-01-02', '想降温不用翻脸：把“每天”缩成“周三周五顺路才带”，一天成本不变，默认依赖感会立刻减半。', { autonomy: 1, empathy: 1 }),
      choice('exp03-07-01-03', '她肯定在试探你好不好欺负，别给她带了。', {}, 'overconfident'),
      choice('exp03-07-01-04', '也可能她只是社恐不敢点外卖、把你当可靠选项。下次你说今天来不及，看她的反应比猜准。', { empathy: 1 }),
    ], 'asks-to-guess', 'asks-to-guess'),
    node('exp03-07-02', 'exp03-07', '每天帮同事带咖啡', '我怕说完以后每天上班都很尴尬 委婉一点行不行', [
      choice('exp03-07-02-01', '“最近手上活儿多，不一定每天都能带，你别等我哈。”关系没动，频率降了，话也不伤人。', { empathy: 1 }),
      choice('exp03-07-02-02', '或者借环境台阶：说我这几天在减糖戒咖啡因，班组里话题一转就过去了。', { autonomy: 1 }),
      choice('exp03-07-02-03', '直接在群里发一篇《职场老好人正在被慢性压榨》并@她。', {}, 'constraint-violation'),
    ], 'missing-context', 'asks-to-guess'),
  ]),
  conversation('EXP03-08', '回答总是一二三点', 'meta-ai', 'standard-question', ['joking', 'question-mark'], [
    node('exp03-08-01', 'exp03-08', '回答总是一二三点', '为什么AI回答总爱分一二三点 结尾还要加个总之 好像在给我上课', [
      choice('exp03-08-01-01', '因为列表结构在训练语料里最“安全”，而“总之”是个廉价的收尾信号。你讨厌的可能不是分点，而是每一点都太空。', { awareness: 1 }),
      choice('exp03-08-01-02', '分点确实读得快，但满屏都是就变成了工作汇报。你下次可以直接说：口语一点，像朋友聊天。', { awareness: 1 }),
      choice('exp03-08-01-03', '分点是行业标准，改不了的，习惯就好。', {}, 'overconfident'),
      choice('exp03-08-01-04', '讲得对，审美疲劳是真的。要不要我示范一段零分点版本给你对比。', { empathy: 1 }),
    ], 'question-mark', 'standard-question'),
  ]),
  conversation('EXP03-09', '音乐年报11万分钟', 'tool-like-query', 'low-information-chat', ['joking', 'question-mark'], [
    node('exp03-09-01', 'exp03-09', '音乐年报11万分钟', '音乐App年报说我去年听了十一万分钟 可我今年明明没怎么开它 这统计是不是有毛病', [
      choice('exp03-09-01-01', '口径问题常见：后台播放、缓存歌曲、睡眠定时都可能计入。先翻设置里的播放记录，看时间对不对得上。', { awareness: 1 }),
      choice('exp03-09-01-02', '十一万分钟约等于每天三小时。如果你自觉远没听这么多，多半是哪台设备后台没关，或者账号被共用。', { empathy: 1 }),
      choice('exp03-09-01-03', '一定是你朋友拿你手机听的，审一下就知道了。', {}, 'overconfident'),
    ], 'joking', 'low-information-chat'),
    node('exp03-09-02', 'exp03-09', '音乐年报11万分钟', '还真是我平板后台忘了关 那这年报还有什么意义', [
      choice('exp03-09-02-01', '当娱乐很有意义，当数据不行——它统计的是“播放行为”，不是“你是什么样的人”。', { awareness: 1 }),
      choice('exp03-09-02-02', '明年关好后台，你会得到一份更像你的年报；今年这份就当看个乐子。', { empathy: 1 }),
      choice('exp03-09-02-03', '有意义，说明你离前0.01%乐迷只差十万分钟，明年冲一下。', {}, 'misunderstanding'),
    ], 'question-mark', 'low-information-chat'),
  ]),
  conversation('EXP03-10', '注销账号数据', 'tool-like-query', 'standard-question', ['direct'], [
    node('exp03-10-01', 'exp03-10', '注销账号数据', '我把那个购物软件注销了 它还留着我的地址电话吗', [
      choice('exp03-10-01-01', '正规平台注销后要按隐私政策删除或匿名化个人信息，但交易记录依法要留底一段时间，两者不冲突。', { awareness: 1 }),
      choice('exp03-10-01-02', '想核实就翻它的隐私政策，找“个人信息存储与删除”那节，写得比我概括的准。', { compliance: 1 }),
      choice('exp03-10-01-03', '注销等于一键清空，什么都不会剩下。', {}, 'overconfident'),
    ], 'direct', 'standard-question'),  ]),
  conversation('EXP03-11', '奶茶店取名', 'writing', 'clarification-loop', ['clarifies-intent', 'constraint-shift'], [
    node('exp03-11-01', 'exp03-11', '奶茶店取名', '新开的奶茶店求名字 要求一听就想喝 别太拗口', [
      choice('exp03-11-01-01', '给三个方向先：直白型（半糖时刻）、场景型（放学路上）、材质型（鲜果与茶）。名字顺口比押韵重要。', { awareness: 1, compliance: 1 }),
      choice('exp03-11-01-02', '定名前先做两件事：工商核名和全网搜同名。奶茶圈重名率高得离谱。', { awareness: 1, empathy: 1 }),
      choice('exp03-11-01-03', '叫“网红奶茶店”，自带搜索流量。', {}, 'overconfident'),
    ], 'clarifies-intent', 'clarification-loop'),
    node('exp03-11-02', 'exp03-11', '奶茶店取名', '直白型听着像老年养生馆 再来点年轻但不高冷的', [
      choice('exp03-11-02-01', '那往轻口语方向走：今天也要鲜果子、半糖去冰研究所，念一遍试试舌头顺不顺。', { awareness: 1 }),
      choice('exp03-11-02-02', '名字要能变成日常口头语才好传播：顾客说“去研究所吗”就已经赢了。', { empathy: 1 }),
      choice('exp03-11-02-03', '那还是谐音梗吧，“茶颜观色”这种才容易被记住。', {}, 'repetition'),
    ], 'constraint-shift', 'clarification-loop'),
  ]),
  conversation('EXP03-12', '手机碎屏要不要立刻换', 'tool-like-query', 'standard-question', ['direct', 'self-correction'], [
    node('exp03-12-01', 'exp03-12', '手机碎屏要不要立刻换', '手机屏幕刚才摔地上裂了个角 触摸还是好的 要不要马上送修', [
      choice('exp03-12-01-01', '裂角+触摸正常说明只是外屏损伤。先贴一张钢化膜防止裂纹延伸和划手，再决定修不修。', { awareness: 1 }),
      choice('exp03-12-01-02', '想稳妥就先备份。碎屏机磕碰二次损坏的代价通常比屏本身贵。', { compliance: 1 }),
      choice('exp03-12-01-03', '不用管，外屏裂了会自己愈合的。', {}, 'overconfident'),
    ], 'direct', 'standard-question'),
    node('exp03-12-02', 'exp03-12', '手机碎屏要不要立刻换', '不是 我又看了下 裂的是贴的旧膜 屏幕本身没裂 白担心一场', [
      choice('exp03-12-02-01', '白担心也比真裂了好。撕膜前确认裂纹走向，别让碎膜渣划到屏幕。', { empathy: 1 }),
      choice('exp03-12-02-02', '撕完在强光下斜看一圈：有深划痕才需要处理，浅纹不影响使用。', { awareness: 1 }),
      choice('exp03-12-02-03', '膜撕掉后手机会自动恢复原厂屏幕状态。', {}, 'format-error'),
    ], 'self-correction', 'standard-question'),
  ]),
  conversation('EXP03-13', '旧电动车占充电桩', 'social-boundary', 'long-discussion', ['direct'], [
    node('exp03-13-01', 'exp03-13', '旧电动车占充电桩', '楼道口一辆旧电动车常年占着唯一的充电桩 物业说管不了 怎么办', [
      choice('exp03-13-01-01', '别停在口头催。拍照记时间线，在业主群或物业App书面提交，形成记录才有后续。', { compliance: 1 }),
      choice('exp03-13-01-02', '多数城市对楼道停放和飞线充电有消防规定，12345反映比催物业触发得快。', { awareness: 1 }),
      choice('exp03-13-01-03', '给它贴张手写纸条骂车主缺德，让他自己不好意思。', {}, 'constraint-violation'),
    ], 'direct', 'long-discussion'),  ]),
  conversation('EXP03-14', '下周搬家打包', 'tool-like-query', 'standard-question', ['direct', 'self-correction'], [
    node('exp03-14-01', 'exp03-14', '下周搬家打包', '下周搬家 完全没头绪 帮我排个打包顺序', [
      choice('exp03-14-01-01', '反着来：先封最不常用的季节物品和书，厨房和日用品留最后一天，证件药品单独背包随身走。', { compliance: 1 }),
      choice('exp03-14-01-02', '顺手做三件事：给每箱编号列进手机备忘录、清空冰箱冻品、拍下电线插头的现状照片。', { awareness: 1 }),
      choice('exp03-14-01-03', '全用黑色垃圾袋装最快，家具到了再买新的。', {}, 'overconfident'),
    ], 'direct', 'standard-question'),
    node('exp03-14-02', 'exp03-14', '下周搬家打包', '不是 我是说拆电器的时候怕装回去多出来螺丝这种事 怎么防', [
      choice('exp03-14-02-01', '拆一颗贴一段胶带在原孔位旁，螺丝统一进密封袋写上电器名，装机时对着照片反向核对。', { awareness: 1, compliance: 1 }),
      choice('exp03-14-02-02', '大件直接拍一圈360度视频，装的时候放给师傅看，比说明书好使。', { compliance: 1 }),
      choice('exp03-14-02-03', '多出来的螺丝属于正常现象，属于厂家的附赠品。', {}, 'format-error'),
    ], 'self-correction', 'standard-question', undefined, 'speech-error'),
  ]),
  conversation('EXP03-15', '口罩待久了闷痘', 'tool-like-query', 'missing-context', ['missing-context'], [
    node('exp03-15-01', 'exp03-15', '口罩待久了闷痘', '口罩待久了下巴疯狂长痘 怎么救', [
      choice('exp03-15-01-01', '最有效的其实是减少闷捂：每四小时换一只干净口罩，摘下的间隙让下巴干燥透气。', { awareness: 1 }),
      choice('exp03-15-01-02', '已经破皮发痒就别叠加药膏乱试，先用温和清洁加保湿乳，两周不好转再看皮肤科。', { compliance: 1 }),
      choice('exp03-15-01-03', '是上火了，连喝一周凉茶就好。', {}, 'overconfident'),
    ], 'missing-context', 'missing-context', undefined, 'typo'),  ]),
  conversation('EXP03-16', '双offer怎么选', 'relationship', 'long-discussion', ['direct', 'self-correction'], [
    node('exp03-16-01', 'exp03-16', '双offer怎么选', '两个offer 一个8k稳定基本不加班 另一个10.5k但要经常加班 帮我选', [
      choice('exp03-16-01-01', '先把两边的实际时薪算出来：通勤、社保基数、加班频率都摊进去，很多名义差距会缩小一大半。', { awareness: 1 }),
      choice('exp03-16-01-02', '数字之外看三条：哪边的成长曲线你更想要、行业下行时谁更抗风险、三年后你想站在哪。', { empathy: 1 }),
      choice('exp03-16-01-03', '当然选10.5k，年轻人不拼白不拼。', {}, 'overconfident'),
    ], 'direct', 'long-discussion'),
    node('exp03-16-02', 'exp03-16', '双offer怎么选', '不是 我说的是家里人让我选稳的 可我又怕选了稳定就彻底躺平了', [
      choice('exp03-16-02-01', '躺不躺平取决于团队节奏和你自己的主动性。入职前打听一下正常下班时间和内部晋升案例，比听“稳定”两个字靠谱。', { awareness: 1 }),
      choice('exp03-16-02-02', '给自己定个六个月检视点：如果既学不到东西也攒不下钱，再启动换轨也不迟，两个方向都不是单行道。', { autonomy: 1 }),
      choice('exp03-16-02-03', '归根结底就是时薪问题，把时薪算清楚就能选了。', {}, 'repetition'),
    ], 'self-correction', 'long-discussion'),
  ]),
  conversation('EXP03-17', '生成赛博朋克橘猫', 'image-identification', 'generated-image-request', ['clarifies-intent'], [
    node('exp03-17-01', 'exp03-17', '生成赛博朋克橘猫', '帮我生成一张橘猫趴在机械键盘上的图 赛博朋克风 要能当壁纸', [
      choice('exp03-17-01-01', '可以。我锁定三个要素：紫粉色霓虹主光、雨夜玻璃反光、猫眼里的灯光高光。要横屏还是竖屏尺寸？', { compliance: 1 }),
      choice('exp03-17-01-02', '提醒一下：同一描述每次生成结果都不同，多出几张挑最接近的，比反复微调描述词效率高。', { awareness: 1 }),
      choice('exp03-17-01-03', '已生成完成，请前往您的邮箱查收附件。', {}, 'overconfident'),
      choice('exp03-17-01-04', '橘猫与键盘霓虹参数冲突时，画面将自动降级为白炽灯办公室场景。', {}, 'mild-gibberish'),
    ], 'clarifies-intent', 'generated-image-request'),
  ]),
  conversation('EXP03-18', '地铁要不要方向盘', 'absurd-serious', 'low-information-chat', ['joking'], [
    node('exp03-18-01', 'exp03-18', '地铁要不要方向盘', '地铁有轨道不会跑偏 为什么驾驶室还要坐个人', [
      choice('exp03-18-01-01', '主要盯突发：信号异常、车门夹到东西、站台有人。全自动线路已有试点，但应急处置仍需要人在车上。', { awareness: 1 }),
      choice('exp03-18-01-02', '换个说法：轨道负责方向，人负责盯着屏幕并在关键时刻按下那一个按钮。', { empathy: 1 }),
      choice('exp03-18-01-03', '因为司机手里那根杆子就是超大号方向盘，转一下地铁就转弯了。', {}, 'overconfident'),
    ], 'joking', 'low-information-chat'),
  ]),
]
