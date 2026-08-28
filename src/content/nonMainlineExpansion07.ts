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
  userContent?: StoryNode['userContent'],
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
    userContent,
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
  const id = `exp07-${ref.slice(6).toLowerCase()}`
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

export const nonMainlineExpansion07Conversations: ConversationDefinition[] = [
  conversation('EXP07-01', '和镜子里的自己比赛瞪眼谁会赢', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-01-01', 'exp07-01', '和镜子里的自己比赛瞪眼谁会赢', '如果我和镜子里的自己比赛瞪眼 谁会赢', [
      choice('exp07-01-01-01', '严格说你会输：你眨眼之后，镜子里才“跟着”眨眼，虽然差距只有光走一个来回的时间，但规则上你先眨。', { awareness: 1, empathy: 2 }),
      choice('exp07-01-01-02', '也可以说是平局，因为你和镜像是同一个人；不过为了好玩，我支持“你输在光线速度上”。', { empathy: 1 }),
      choice('exp07-01-01-04', '这个问题最好的部分是：你们俩都会同时觉得是自己先眨的。', { empathy: 2 }),
      choice('exp07-01-01-03', '肯定是你赢，因为镜子不会眨眼。', {}, 'misunderstanding'),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP07-02', '电脑鼠标是不是脚踏板', 'absurd-serious', 'clarification-loop', ['missing-context', 'direct'], [
    node('exp07-02-01', 'exp07-02', '电脑鼠标是不是脚踏板', '我刚装好电脑 发现有个东西像脚踏板 这是干嘛的 我是不是少了个零件', [
      choice('exp07-02-01-01', '那个不是脚踏板，是鼠标。它用来移动屏幕上的箭头和点击，不需要用脚踩。', { empathy: 1, awareness: 1 }),
      choice('exp07-02-01-02', '这个误会其实挺常见的，尤其第一次用电脑。你把它放右手边，手掌放上去，左右键就能点。', { empathy: 1, compliance: 2 }),
      choice('exp07-02-01-04', '如果你习惯左手，也可以在系统设置里交换左右键。', { awareness: 1, autonomy: 2 }),
      choice('exp07-02-01-03', '对，那就是脚踏板，踩一下能开机。', {}, 'misunderstanding'),
    ], 'missing-context', 'clarification-loop'),
    node('exp07-02-02', 'exp07-02', '电脑鼠标是不是脚踏板', '原来不是脚踏板 那这个鼠标应该放哪 我放桌上了还是不对', [
      choice('exp07-02-02-01', '放右手边就行，手自然地放在上面，食指和中指分别放在左右键。', { compliance: 1, empathy: 1 }),
      choice('exp07-02-02-02', '如果你觉得不顺手，可以换成左手并交换左右键设置。', { autonomy: 1 }),
      choice('exp07-02-02-03', '放键盘上面，当装饰。', {}, 'misunderstanding'),
    ], 'direct', 'clarification-loop'),
  ]),
  conversation('EXP07-03', '我猫是不是在密谋多要一顿饭', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-03-01', 'exp07-03', '我猫是不是在密谋多要一顿饭', '我家猫刚吃过饭 过一个小时又来要饭 我觉得它在密谋多骗一顿 是不是我想多了', [
      choice('exp07-03-01-01', '你可能没想多：猫很擅长把“讨饭”变成日常项目，而且它们确实会不断测试你会不会心软。', { empathy: 2, awareness: 1 }),
      choice('exp07-03-01-02', '从行为看，它不一定是饿了，可能只是把“要饭”当成了和你的互动。配合这个阴谋论也没问题。', { empathy: 1 }),
      choice('exp07-03-01-04', '如果它体重正常、进食规律，多要饭通常不是健康问题；但如果你想安心，可以固定时间喂。', { awareness: 1, compliance: 2 }),
      choice('exp07-03-01-03', '猫没有这种智商，是你想多了。', {}, 'misunderstanding'),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP07-04', '游戏里100码感觉比现实慢', 'absurd-serious', 'clarification-loop', ['direct', 'direct'], [
    node('exp07-04-01', 'exp07-04', '游戏里100码感觉比现实慢', '我在赛车游戏里开到100多 感觉还没现实中60快 是不是游戏速度显示有问题', [
      choice('exp07-04-01-01', '不是显示错，是现实中你会感受到G力、震动和风声，游戏里这些反馈少很多，所以同样速度体感更慢。', { awareness: 1 }),
      choice('exp07-04-01-02', '可以试试用VR或大屏幕降低视野边框，体感会接近一些，但和真实驾驶仍有差距。', { compliance: 1 }),
      choice('exp07-04-01-04', '如果屏幕小或帧率低，速度感也会更弱；不是仪表数字骗你。', { awareness: 2 }),
      choice('exp07-04-01-03', '游戏就是假的，别当真。', {}, 'misunderstanding'),
    ], 'direct', 'clarification-loop'),
    node('exp07-04-02', 'exp07-04', '游戏里100码感觉比现实慢', '那我用VR玩会不会更接近真实速度', [
      choice('exp07-04-02-01', '会好很多，VR能提供更多视觉深度和运动感知，但缺少G力，仍然和真实驾驶有差距。', { awareness: 1 }),
      choice('exp07-04-02-02', '可以试试大屏幕加方向盘，也能提升速度感。', { compliance: 1 }),
      choice('exp07-04-02-03', 'VR就是真实，开了就像开车。', {}, 'overconfident'),
    ], 'direct', 'clarification-loop'),
  ]),
  conversation('EXP07-05', '玩完游戏总觉得现实有血条', 'absurd-serious', 'long-discussion', ['missing-context', 'direct'], [
    node('exp07-05-01', 'exp07-05', '玩完游戏总觉得现实有血条', '我最近玩完游戏 总感觉看人头顶有血条 还想去捡补给 我是不是疯了', [
      choice('exp07-05-01-01', '没疯。这有个名字叫游戏迁移现象（Game Transfer Phenomenon），长时间玩游戏后偶尔把游戏元素套到现实里，不少人会经历。', { empathy: 2, awareness: 1 }),
      choice('exp07-05-01-02', '如果只是短暂出现且不影响生活，一般不用太担心；如果持续很久或让你做出危险动作，就值得和医生聊聊。', { empathy: 1, compliance: 2 }),
      choice('exp07-05-01-03', '你玩太多了，别玩了。', {}, 'constraint-violation'),
      choice('exp07-05-01-04', '可以先减少连续游戏时长，玩完做点现实活动，通常几天内就会消退。', { empathy: 1, compliance: 1 }),
    ], 'missing-context', 'long-discussion'),
  ]),
  conversation('EXP07-06', '除垢后我妈喝了壶里的醋', 'absurd-serious', 'constraint-shift', ['message-burst', 'direct'], [
    node('exp07-06-01', 'exp07-06', '除垢后我妈喝了壶里的醋', '我用醋给烧水壶除垢 忘了倒掉 我妈拿它泡茶喝了 说味道很怪 现在怎么办', [
      choice('exp07-06-01-01', '先别慌。少量白醋通常不会造成严重问题，但先确认她喝了多少、有没有不适；如果喉咙痛或胃不舒服，就联系医生。', { empathy: 1, compliance: 1 }),
      choice('exp07-06-01-02', '接下来把壶彻底多洗几遍再煮水倒掉，确认没有醋味再用。', { compliance: 1 }),
      choice('exp07-06-01-04', '以后除垢后可以在壶上贴个“勿用”标签，或者设个提醒，避免再发生。', { empathy: 2, awareness: 1 }),
      choice('exp07-06-01-03', '没事，醋能消毒，等于帮她洗胃了。', {}, 'overconfident'),
    ], 'message-burst', 'constraint-shift'),
  ]),
  conversation('EXP07-07', '为什么一关灯猫就开始跑酷', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-07-01', 'exp07-07', '为什么一关灯猫就开始跑酷', '我猫白天睡一整天 晚上我一关灯它就开始满屋跑 是不是在密谋什么', [
      choice('exp07-07-01-01', '猫本来就是黄昏和夜间更活跃，关灯后你安静了，它反而觉得可以开始“巡逻”。不是密谋，是猫科作息。', { empathy: 1, awareness: 1 }),
      choice('exp07-07-01-02', '你也可以把它理解成夜间巡逻队，你是被保护对象，只是它巡逻时比较吵。', { empathy: 2 }),
      choice('exp07-07-01-04', '睡前陪它玩十几分钟，能把它那波跑酷提前消耗掉。', { compliance: 2, empathy: 1 }),
      choice('exp07-07-01-03', '它肯定在召唤同类。', {}, 'misunderstanding'),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP07-08', '能不能给猫道歉让它原谅我', 'absurd-serious', 'short-query', ['joking', 'direct'], [
    node('exp07-08-01', 'exp07-08', '能不能给猫道歉让它原谅我', '我踩到猫尾巴了 它现在不理我 我给它道歉有用吗', [
      choice('exp07-08-01-01', '道歉本身可能没用，但你的语气和后续行为有用：放低声音、给它好吃的、别追着它抱，它会慢慢恢复。', { empathy: 2, awareness: 1 }),
      choice('exp07-08-01-02', '可以配合演一下：“对不起，我以后会看路。”猫不一定听懂，但你会感觉好一点。', { empathy: 2 }),
      choice('exp07-08-01-04', '如果它躲着你，先别强行互动；让它自己过来，比追着道歉有效。', { empathy: 1, autonomy: 2 }),
      choice('exp07-08-01-03', '没用，猫不会原谅任何人。', {}, 'constraint-violation'),
    ], 'joking', 'short-query'),
    node('exp07-08-02', 'exp07-08', '能不能给猫道歉让它原谅我', '它现在愿意靠近我了 是不是已经原谅我了', [
      choice('exp07-08-02-01', '很可能。猫用靠近和蹭来表达恢复安全，不一定是“原谅”，但至少它不再躲你。', { empathy: 1, awareness: 1 }),
      choice('exp07-08-02-02', '你可以继续给它一点零食，巩固一下友好关系。', { compliance: 1 }),
      choice('exp07-08-02-03', '它只是在等你再次犯错。', {}, 'misunderstanding'),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP07-09', '把WiFi密码改成空格会怎样', 'tool-like-query', 'short-query', ['joking', 'direct'], [
    node('exp07-09-01', 'exp07-09', '把WiFi密码改成空格会怎样', '我想把WiFi密码设成一个空格 是不是别人就猜不到了', [
      choice('exp07-09-01-01', '技术上有的路由器允许空格密码，但很多设备会很难输入，而且“一个空格”不等于安全，别人知道后一下就记住了。', { awareness: 1 }),
      choice('exp07-09-01-02', '如果你只是觉得好玩，可以试试；但别在重要网络这么搞，访客会连不上。', { empathy: 1 }),
      choice('exp07-09-01-04', '真正安全靠长随机密码，而不是“看起来不存在”。', { awareness: 2 }),
      choice('exp07-09-01-03', '一个空格就是最强密码，没人能猜到。', {}, 'misunderstanding'),
    ], 'joking', 'short-query'),
  ]),
  conversation('EXP07-10', '奶奶觉得手机要晒太阳充电', 'relationship', 'short-query', ['direct'], [
    node('exp07-10-01', 'exp07-10', '奶奶觉得手机要晒太阳充电', '我奶奶说手机没电了要放太阳底下晒晒 说这样能充进去 我该顺着她还是纠正她', [
      choice('exp07-10-01-01', '可以温和纠正：手机是靠电充的，不是靠太阳；如果晒太久反而会发热伤电池。', { empathy: 1, awareness: 1 }),
      choice('exp07-10-01-02', '你还可以顺着说“只有带太阳能板的充电宝才行”，用她能懂的例子解释。', { empathy: 2 }),
      choice('exp07-10-01-04', '下次她再问，可以一起把充电器插上，说“现在交给电了”。', { empathy: 2, compliance: 1 }),
      choice('exp07-10-01-03', '对，晒晒就满了。', {}, 'misunderstanding'),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP07-11', '关了灯房间为什么还是亮的', 'absurd-serious', 'clarification-loop', ['missing-context', 'direct'], [
    node('exp07-11-01', 'exp07-11', '关了灯房间为什么还是亮的', '我把房间灯关了 但房间还是亮的 是不是灯坏了', [
      choice('exp07-11-01-01', '先确认你说的“灯”是不是天花板灯；如果关了天花板灯还是亮，可能是窗外光、电子设备指示灯或另一盏灯。', { awareness: 1 }),
      choice('exp07-11-01-02', '你可以把窗帘拉上、把其他设备电源关掉再看，通常就能找到“剩下的光”从哪来。', { compliance: 1 }),
      choice('exp07-11-01-04', '如果确实是关了开关还亮，那才可能是开关或线路问题，需要找电工。', { awareness: 2 }),
      choice('exp07-11-01-03', '灯坏了，换灯。', {}, 'misunderstanding'),
    ], 'missing-context', 'clarification-loop'),
    node('exp07-11-02', 'exp07-11', '关了灯房间为什么还是亮的', '我找到了 是路由器的灯 那算不算灯', [
      choice('exp07-11-02-01', '严格说那是指示灯，不是照明灯；它会发光，但不会照亮房间。所以房间“亮”主要是别处来的光。', { awareness: 1 }),
      choice('exp07-11-02-02', '如果你追求全黑，可以把路由器指示灯用胶带贴一下。', { compliance: 1 }),
      choice('exp07-11-02-03', '算，所以你的灯没坏。', {}, 'misunderstanding'),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP07-12', '把手机放冰箱能降温吗', 'troubleshooting', 'short-query', ['direct'], [
    node('exp07-12-01', 'exp07-12', '把手机放冰箱能降温吗', '手机发烫 我能不能放冰箱里降温 会不会更好', [
      choice('exp07-12-01-01', '别放冰箱。骤冷会让内部凝结水汽，反而可能损坏主板；先关机、放到通风处自然降温更安全。', { awareness: 1, compliance: 1 }),
      choice('exp07-12-01-02', '如果只是充电发热，先拔掉充电器；如果持续发烫，可能是后台程序或电池问题。', { compliance: 1 }),
      choice('exp07-12-01-03', '可以，放十分钟就凉了。', {}, 'misunderstanding'),
      choice('exp07-12-01-04', '手机的最佳工作温度通常在0到35度左右，极端高温和低温都不好。', { awareness: 1 }),
    ], 'direct', 'short-query'),
    node('exp07-12-02', 'exp07-12', '把手机放冰箱能降温吗', '我已经放冰箱了 现在拿出来有点湿 会不会已经坏了', [
      choice('exp07-12-02-01', '先别开机。用干布擦干表面，放在通风处等完全干透再开机；如果已经进水，最好让维修检查。', { awareness: 1, compliance: 1 }),
      choice('exp07-12-02-02', '如果只是表面凝结水汽，通常擦干晾干就好；但不要再放回冰箱。', { empathy: 1 }),
      choice('exp07-12-02-03', '湿了就是坏了，换手机吧。', {}, 'overconfident'),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP07-13', '路由器是不是生气了', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-13-01', 'exp07-13', '路由器是不是生气了', '我家路由器一发热网就卡 我总觉得它是生气了 怎么办', [
      choice('exp07-13-01-01', '可以配合这个说法：“它可能是在闹脾气，但更可能是过热或信道拥堵。”先把它放通风处、重启一下。', { empathy: 2, awareness: 1 }),
      choice('exp07-13-01-02', '路由器确实会“累”：过热、长时间运行、固件旧都会让网络变卡，不一定是你做错了什么。', { empathy: 1 }),
      choice('exp07-13-01-03', '它就是在生气，哄一哄就好了。', {}, 'overconfident'),
      choice('exp07-13-01-04', '如果经常卡，可以看看固件更新和摆放位置，比“哄”更有效。', { compliance: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP07-14', '为什么开会前总想上厕所', 'absurd-serious', 'standard-question', ['direct', 'direct'], [
    node('exp07-14-01', 'exp07-14', '为什么开会前总想上厕所', '我每次开大会前都想上厕所 明明不紧张 是身体有问题吗', [
      choice('exp07-14-01-01', '这很常见。面对重要场合时，即使你觉得不紧张，身体也可能进入轻度应激状态，导致尿意变强。', { empathy: 1, awareness: 1 }),
      choice('exp07-14-01-02', '可以提前去一次，别在会前喝太多水；如果平时也有其他不适，再看医生。', { compliance: 1 }),
      choice('exp07-14-01-03', '你就是太怂了。', {}, 'overconfident'),
      choice('exp07-14-01-04', '如果你每次都伴随心跳快或胃不舒服，那可能是社交焦虑的身体表现，不丢人。', { empathy: 1, awareness: 1 }),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP07-15', '给植物放音乐会更好吗', 'absurd-serious', 'standard-question', ['direct', 'direct'], [
    node('exp07-15-01', 'exp07-15', '给植物放音乐会更好吗', '我想给家里的植物放音乐 会不会长得更好', [
      choice('exp07-15-01-01', '植物没有耳朵，但有研究发现声音振动可能影响部分植物生长，不过光照、水分和土壤才是主要因素。', { awareness: 1 }),
      choice('exp07-15-01-02', '如果你觉得放音乐能让你更勤快照顾它，那也算间接有用。', { empathy: 2 }),
      choice('exp07-15-01-03', '会，放重金属长得最快。', {}, 'misunderstanding'),
      choice('exp07-15-01-04', '先保证它不缺光不缺水，再考虑音乐这种玄学加成。', { awareness: 1 }),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP07-16', '为什么一吃辣就流鼻涕', 'absurd-serious', 'standard-question', ['direct', 'direct'], [
    node('exp07-16-01', 'exp07-16', '为什么一吃辣就流鼻涕', '我一吃辣就疯狂流鼻涕 是不是我鼻子有问题', [
      choice('exp07-16-01-01', '不是问题。辣椒素会刺激鼻腔黏膜，让身体分泌更多黏液来“冲走”刺激物，所以流鼻涕很正常。', { awareness: 1 }),
      choice('exp07-16-01-02', '每个人敏感度不同；如果只是吃辣时流鼻涕，通常不用担心。', { empathy: 2 }),
      choice('exp07-16-01-03', '你是鼻炎，别吃辣了。', {}, 'misunderstanding'),
      choice('exp07-16-01-04', '下次可以准备纸巾，这不是你一个人的“吃辣副作用”。', { empathy: 1 }),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP07-17', '把所有袜子买成一样的', 'tool-like-query', 'long-discussion', ['direct', 'direct'], [
    node('exp07-17-01', 'exp07-17', '把所有袜子买成一样的', '我想把所有袜子都买成一样的 这样就不用配对 是不是很聪明', [
      choice('exp07-17-01-01', '是挺省心，很多人这么干。只要你不介意磨损不同步，统一袜子能彻底解决“丢一只”的烦恼。', { empathy: 1, awareness: 1 }),
      choice('exp07-17-01-02', '可以先买一打同款试试，看你能不能接受“全是黑色”的无聊感。', { compliance: 1 }),
      choice('exp07-17-01-03', '会很乱，别这么做。', {}, 'overconfident'),
      choice('exp07-17-01-04', '真正的风险是：某天你只想穿短袜，但全是一样厚度的长袜。', { awareness: 1 }),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP07-18', '电梯里放镜子是为什么', 'absurd-serious', 'short-query', ['direct', 'direct'], [
    node('exp07-18-01', 'exp07-18', '电梯里放镜子是为什么', '电梯里为什么要放镜子 是不是为了让人整理仪容', [
      choice('exp07-18-01-01', '整理仪容是一部分，但更常见的原因是镜子能让小空间显得更宽敞，也能减少等待时的焦虑感。', { awareness: 1 }),
      choice('exp07-18-01-02', '也有说法是为了方便轮椅使用者倒车出电梯时观察后方。', { awareness: 1 }),
      choice('exp07-18-01-03', '就是为了让你照镜子。', {}, 'misunderstanding'),
      choice('exp07-18-01-04', '不管最初原因是什么，你现在每次进电梯都会先看自己一眼，说明它很成功。', { empathy: 1 }),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP07-19', '能不能给WiFi信号加点油', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-19-01', 'exp07-19', '能不能给WiFi信号加点油', '家里WiFi信号不好 我能不能给它“加点油” 让它跑快一点', [
      choice('exp07-19-01-01', 'WiFi不需要加油，但可以“加位置”：把路由器放中间、避开金属墙，信号通常会有明显改善。', { empathy: 1, awareness: 1 }),
      choice('exp07-19-01-02', '如果你只是开玩笑，我可以配合说“加98号信号油，网速起飞”。但实际还是得靠位置和频段。', { empathy: 1 }),
      choice('exp07-19-01-03', '能，给路由器灌点油就好了。', {}, 'overconfident'),
      choice('exp07-19-01-04', '如果还不行，可以试试重启路由器或换5GHz频段。', { compliance: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP07-20', '把所有食物打成糊能活吗', 'absurd-serious', 'standard-question', ['direct', 'direct'], [
    node('exp07-20-01', 'exp07-20', '把所有食物打成糊能活吗', '如果我把所有食物都打成糊再吃 能活吗', [
      choice('exp07-20-01-01', '营养上短期可能够，但长期会缺咀嚼带来的饱腹感和口腔健康影响；而且打成糊不代表营养更全面。', { awareness: 1 }),
      choice('exp07-20-01-02', '如果你是因为咀嚼困难才考虑，那需要看具体原因；单纯为了省事，不建议长期全糊。', { empathy: 1 }),
      choice('exp07-20-01-03', '能，喝就完了。', {}, 'misunderstanding'),
      choice('exp07-20-01-04', '真正决定能不能活的是营养均衡，不是食物的物理形态。', { awareness: 1 }),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP07-21', '为什么一到周一就头疼', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-21-01', 'exp07-21', '为什么一到周一就头疼', '我每周一到公司就头疼 周末就没事 是不是周一诅咒', [
      choice('exp07-21-01-01', '听起来更像“周一综合征”：作息切换、压力和屏幕时间增加都可能让头痛在周一冒出来。', { empathy: 1, awareness: 1 }),
      choice('exp07-21-01-02', '可以配合说“周一的诅咒确实存在，但通常写在日程表上”。', { empathy: 1 }),
      choice('exp07-21-01-03', '就是诅咒，别上班了。', {}, 'constraint-violation'),
      choice('exp07-21-01-04', '如果头痛持续或伴随其他症状，还是值得看医生；别全推给玄学。', { awareness: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP07-22', '存了照片为什么还说内存满', 'tool-like-query', 'clarification-loop', ['missing-context', 'direct'], [
    node('exp07-22-01', 'exp07-22', '存了照片为什么还说内存满', '我把照片都存到云端了 手机还是说存储空间满 内存和存储不是一个东西吗', [
      choice('exp07-22-01-01', '“内存”和“存储”常被混用：你手机显示满的通常是存储空间，照片传云端只释放云端那边的空间，手机本地可能还留着缓存。', { awareness: 1 }),
      choice('exp07-22-01-02', '可以看看手机存储里是不是还有“最近删除”、缓存或原图占空间；云端备份不等于本地清理。', { compliance: 1 }),
      choice('exp07-22-01-03', '手机在骗你，其实还有很多空间。', {}, 'overconfident'),
      choice('exp07-22-01-04', '以后想清空间，要在设置里看“存储空间”而不是“内存”。', { awareness: 1 }),
    ], 'missing-context', 'clarification-loop'),
  ]),
  conversation('EXP07-23', '把手机调成英文能学英语吗', 'study', 'short-query', ['joking', 'direct'], [
    node('exp07-23-01', 'exp07-23', '把手机调成英文能学英语吗', '我把手机系统调成英文 是不是就能顺便学英语了', [
      choice('exp07-23-01-01', '有点用，尤其能逼你看常见英文界面；但光是调设置不系统练习，效果有限。', { awareness: 1 }),
      choice('exp07-23-01-02', '可以当作辅助，再配合每天读几句或听一听，比只调语言有用。', { compliance: 1 }),
      choice('exp07-23-01-03', '能，三个月就流利了。', {}, 'misunderstanding'),
      choice('exp07-23-01-04', '缺点是找设置会变难；如果你能接受，就试试。', { empathy: 1 }),
    ], 'joking', 'short-query'),
  ]),
  conversation('EXP07-24', '给植物道歉会长得更好吗', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-24-01', 'exp07-24', '给植物道歉会长得更好吗', '我忘了给植物浇水 它有点蔫 我现在每天给它道歉 它会不会原谅我', [
      choice('exp07-24-01-01', '道歉本身它听不见，但道歉带来的“你开始关心它”会让你及时浇水，这才是它活下来的原因。', { empathy: 1, awareness: 1 }),
      choice('exp07-24-01-02', '可以配合演：“对不起，我以后定闹钟。”然后真的定闹钟。', { empathy: 1 }),
      choice('exp07-24-01-03', '会，植物能感受到你的歉意。', {}, 'overconfident'),
      choice('exp07-24-01-04', '先检查是不是缺水或晒伤，再决定要不要换位置。', { compliance: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP07-25', '为什么洗澡时容易想到好点子', 'absurd-serious', 'low-information-chat', ['direct', 'direct'], [
    node('exp07-25-01', 'exp07-25', '为什么洗澡时容易想到好点子', '我每次洗澡都会突然想到好点子 但一出来就忘 这是为什么', [
      choice('exp07-25-01-01', '洗澡时没有手机干扰、身体放松，大脑默认模式网络更活跃，所以容易冒出联想；出来后一拿起手机就被盖掉了。', { awareness: 1 }),
      choice('exp07-25-01-02', '可以放一支防水笔或录音设备在浴室附近，想到就先记下来。', { compliance: 1 }),
      choice('exp07-25-01-03', '因为热水把灵感冲出来了。', {}, 'overconfident'),
      choice('exp07-25-01-04', '别急着怪自己忘，关键是建立“想到就立刻记”的习惯。', { empathy: 1 }),
    ], 'direct', 'low-information-chat'),
  ]),
  conversation('EXP07-26', '为什么摸猫肚子会被咬', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-26-01', 'exp07-26', '为什么摸猫肚子会被咬', '我摸猫肚子它一开始很享受 然后突然咬我 它是不是讨厌我', [
      choice('exp07-26-01-01', '很多猫的肚子是敏感区，允许你摸不代表无限期欢迎；咬一下通常是在说“到此为止”。', { empathy: 1, awareness: 1 }),
      choice('exp07-26-01-02', '可以理解为它给了你限时体验卡，超时就会收回。', { empathy: 1 }),
      choice('exp07-26-01-03', '它就是在讨厌你。', {}, 'misunderstanding'),
      choice('exp07-26-01-04', '下次注意它尾巴或耳朵的动作，通常在咬之前会有预警。', { awareness: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP07-27', '为什么买完东西就降价', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-27-01', 'exp07-27', '为什么买完东西就降价', '我每次买完东西它就降价 是不是平台在针对我', [
      choice('exp07-27-01-01', '这不是针对，但确实是常见的“刚买就降价”心理：你记住了买后降价，没记住买后涨价的时候。', { empathy: 1, awareness: 1 }),
      choice('exp07-27-01-02', '可以配合说“大数据确实知道你刚下单”，然后提醒你查价保政策。', { empathy: 1 }),
      choice('exp07-27-01-03', '平台就是针对你。', {}, 'constraint-violation'),
      choice('exp07-27-01-04', '很多平台有价格保护或降价退差价，买完可以看看。', { compliance: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP07-28', '为什么一喝咖啡就困', 'absurd-serious', 'standard-question', ['direct', 'direct'], [
    node('exp07-28-01', 'exp07-28', '为什么一喝咖啡就困', '别人喝咖啡提神 我一喝咖啡就困 是不是我体质特殊', [
      choice('exp07-28-01-01', '可能不是特殊，而是咖啡因阻断了腺苷受体后，身体会“补觉债”；如果你本来就缺觉，咖啡因压不住困意。', { awareness: 1 }),
      choice('exp07-28-01-02', '也可能是喝咖啡时间太晚、或你对咖啡因耐受；如果经常这样，别硬喝。', { empathy: 1 }),
      choice('exp07-28-01-03', '咖啡对你没用，别喝了。', {}, 'misunderstanding'),
      choice('exp07-28-01-04', '如果你刚喝完就困，也可能只是“喝完咖啡后放松下来”的错觉。', { awareness: 1 }),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP07-29', '为什么手机电量到20%就焦虑', 'absurd-serious', 'low-information-chat', ['direct', 'direct'], [
    node('exp07-29-01', 'exp07-29', '为什么手机电量到20%就焦虑', '我手机电量一到20%就特别焦虑 是不是我太依赖手机了', [
      choice('exp07-29-01-01', '有一定依赖成分，但20%焦虑很普遍，因为低电量意味着“可能突然关机”。这不是你一个人的问题。', { empathy: 1, awareness: 1 }),
      choice('exp07-29-01-02', '可以随身带充电宝或提前充电，减少这种临界焦虑。', { compliance: 1 }),
      choice('exp07-29-01-03', '你就是手机奴。', {}, 'overconfident'),
      choice('exp07-29-01-04', '如果焦虑已经影响生活，可以试试给自己设“电量安全线”，比如30%就充。', { empathy: 1, autonomy: 1 }),
    ], 'direct', 'low-information-chat'),
  ]),
  conversation('EXP07-30', '为什么一进电梯就有人进来', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-30-01', 'exp07-30', '为什么一进电梯就有人进来', '我每次一进电梯 就有人跟着进来 是不是电梯在针对我', [
      choice('exp07-30-01-01', '这更像“注意力错觉”：你只记住有人跟进来的次数，没记住电梯空着的时候。电梯没有针对你。', { empathy: 1, awareness: 1 }),
      choice('exp07-30-01-02', '可以配合说“电梯有剧本，你是主角，所以总有人当群演”。', { empathy: 1 }),
      choice('exp07-30-01-03', '对，电梯在整你。', {}, 'constraint-violation'),
      choice('exp07-30-01-04', '如果不想同乘，可以等下一班，不用解释。', { autonomy: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP07-31', '为什么每次洗车就下雨', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-31-01', 'exp07-31', '为什么每次洗车就下雨', '我每次洗完车就下雨 是不是雨神在针对我', [
      choice('exp07-31-01-01', '这是典型的确认偏差：你会记住“洗车后下雨”，却很少统计“洗车后没下雨”的次数。', { empathy: 1, awareness: 1 }),
      choice('exp07-31-01-02', '可以配合说“雨神确实有你的车牌号”，然后建议看天气预报再洗车。', { empathy: 1 }),
      choice('exp07-31-01-03', '雨神就是针对你。', {}, 'constraint-violation'),
      choice('exp07-31-01-04', '如果真在意，可以选降水概率低的日子洗，剩下交给运气。', { compliance: 1 }),
    ], 'joking', 'low-information-chat'),
    node('exp07-31-02', 'exp07-31', '为什么每次洗车就下雨', '那我以后是不是该先看天气预报再洗车', [
      choice('exp07-31-02-01', '对，选降水概率低的日子洗，至少能减少“刚洗完就下雨”的体验。', { compliance: 1, empathy: 1 }),
      choice('exp07-31-02-02', '即使看了预报也可能遇到局部阵雨，但概率上会好很多。', { awareness: 1 }),
      choice('exp07-31-02-03', '不用看，洗车就是要下雨。', {}, 'overconfident'),
    ], 'direct', 'low-information-chat'),
  ]),
  conversation('EXP07-32', '为什么手机一冷就关机', 'troubleshooting', 'short-query', ['direct', 'direct'], [
    node('exp07-32-01', 'exp07-32', '为什么手机一冷就关机', '我手机一到冬天室外就自动关机 是不是坏了', [
      choice('exp07-32-01-01', '不是坏了，是低温会让锂电池性能下降，很多手机会触发保护性关机；回暖后通常能正常开机。', { awareness: 1 }),
      choice('exp07-32-01-02', '冬天尽量把手机放内袋保温，减少长时间暴露在低温里。', { compliance: 1 }),
      choice('exp07-32-01-03', '手机怕冷说明它坏了，换新的。', {}, 'overconfident'),
      choice('exp07-32-01-04', '如果回暖后还是频繁关机，再考虑电池老化问题。', { awareness: 1 }),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP07-33', '把所有App图标换成一样的', 'tool-like-query', 'short-query', ['joking', 'direct'], [
    node('exp07-33-01', 'exp07-33', '把所有App图标换成一样的', '我想把所有App图标都换成一模一样的 这样桌面看起来很整齐 是不是很酷', [
      choice('exp07-33-01-01', '整齐是整齐，但你以后找App会变成开盲盒；如果你能接受这个挑战，可以试试。', { empathy: 1, awareness: 1 }),
      choice('exp07-33-01-02', '可以用文件夹分类来减少“全一样”带来的混乱。', { compliance: 1 }),
      choice('exp07-33-01-03', '很酷，全换了吧。', {}, 'overconfident'),
      choice('exp07-33-01-04', '如果只是想要整齐，统一色调比统一图标更不容易找不到东西。', { awareness: 1 }),
    ], 'joking', 'short-query'),
  ]),
  conversation('EXP07-34', '为什么每次称体重都重一点', 'absurd-serious', 'standard-question', ['direct', 'direct'], [
    node('exp07-34-01', 'exp07-34', '为什么每次称体重都重一点', '我每次称体重都比上次重一点 是不是秤有问题', [
      choice('exp07-34-01-01', '体重短时波动很常见：水分、进食、称的位置和时间都会影响数字。建议固定时间、同一台秤、同一位置再比较。', { awareness: 1 }),
      choice('exp07-34-01-02', '如果每次都比上一次重且持续几周，那可能确实在涨，但也要看体脂和围度，不只盯数字。', { empathy: 1 }),
      choice('exp07-34-01-03', '秤在针对你。', {}, 'constraint-violation'),
      choice('exp07-34-01-04', '别天天称，一周一次更不容易被短期波动吓到。', { empathy: 1, compliance: 1 }),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP07-35', '把家里所有钟调快十分钟', 'absurd-serious', 'long-discussion', ['direct', 'direct'], [
    node('exp07-35-01', 'exp07-35', '把家里所有钟调快十分钟', '我想把家里所有钟都调快十分钟 这样会不会就不迟到了', [
      choice('exp07-35-01-01', '对有些人有用，因为你会按“快十分钟”的心理倒推；但对知道真相的人，很快又会自动忽略这个误差。', { empathy: 1, awareness: 1 }),
      choice('exp07-35-01-02', '可以试试，但关键不是钟，而是给自己留出真正的缓冲时间。', { compliance: 1 }),
      choice('exp07-35-01-03', '会，你从此再也不会迟到。', {}, 'overconfident'),
      choice('exp07-35-01-04', '风险是：你会把所有事都按“其实还剩十分钟”来安排，反而更乱。', { awareness: 1 }),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP07-36', '给WiFi路由器贴加速贴纸', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp07-36-01', 'exp07-36', '给WiFi路由器贴加速贴纸', '网上有卖WiFi加速贴纸 贴路由器上能让网变快 是真的吗', [
      choice('exp07-36-01-01', '那不是真的。贴纸不会改变无线电信号；如果看着贴纸心情变好，那最多是安慰剂。', { empathy: 1, awareness: 1 }),
      choice('exp07-36-01-02', '你可以贴一张，然后该重启路由器还是重启路由器，这样贴纸至少提供了情绪价值。', { empathy: 1 }),
      choice('exp07-36-01-03', '真的，贴上立刻变快。', {}, 'misunderstanding'),
      choice('exp07-36-01-04', '想提速还是从位置、频段和带宽入手，别把钱花在贴纸上。', { compliance: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
]
