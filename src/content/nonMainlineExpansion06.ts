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
  const id = `exp06-${ref.slice(6).toLowerCase()}`
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

export const nonMainlineExpansion06Conversations: ConversationDefinition[] = [
  conversation('EXP06-01', '房东不修洗碗机还怪我擅自修', 'social-boundary', 'constraint-shift', ['message-burst', 'direct'], [
    node('exp06-01-01', 'exp06-01', '房东不修洗碗机还怪我擅自修', '我洗碗机坏了 房东找的人来看两眼就说要换新的 不修 我们自己找人修了 她骂我们擅自动手 怎么办', [
      choice('exp06-01-01-01', '先别急着对骂。把沟通记录和维修单据留好，明确告诉她：我们是为了正常使用才维修，费用和后续责任需要书面确认。', { awareness: 1, compliance: 2 }),
      choice('exp06-01-01-02', '可以先把“是否该由房东负责维修”这个事实找出来：看合同和当地规定，多数正常使用损坏由房东承担。', { awareness: 1 }),
      choice('exp06-01-01-04', '如果房东拒绝沟通，可以走书面通知和租赁管理部门调解，不要自己继续硬来。', { empathy: 1, autonomy: 2 }),
      choice('exp06-01-01-03', '她态度这么差，直接搬走。', {}, 'overconfident'),
    ], 'message-burst', 'constraint-shift'),
    node('exp06-01-02', 'exp06-01', '房东不修洗碗机还怪我擅自修', '她说不该我们自己找人修 说我们违约 但我查了合同没写这条', [
      choice('exp06-01-02-01', '合同没写这一条也不能单独证明你有权自行维修。是否可以自行安排维修、费用由谁承担，要看当地租赁规则、是否属于紧急维修，以及你之前是否通知过房东。先保留合同、通知记录和维修单据，再查当地规定。', { awareness: 1, compliance: 1 }),
      choice('exp06-01-02-02', '可以把单据作为事实记录发给房东，能否报销再按合同和当地规则确认，不要先预设费用责任。', { compliance: 1, empathy: 1 }),
      choice('exp06-01-02-03', '她就是在欺负你，直接起诉。', {}, 'overconfident'),
    ], 'direct', 'constraint-shift'),
  ]),
  conversation('EXP06-02', '房东要进屋检查水龙头和暖气', 'social-boundary', 'constraint-shift', ['direct', 'constraint-shift'], [
    node('exp06-02-01', 'exp06-02', '房东要进屋检查水龙头和暖气', '物业说要上门检查水龙头有没有滴水、暖气设置 我总觉得像是找借口进房 可以拒绝吗', [
      choice('exp06-02-01-01', '很多地区允许房东在合理通知后为维护/安全目的进入；防冻检查通常属于合理范围，但你可以要求预约时间和说明目的。', { awareness: 1 }),
      choice('exp06-02-01-02', '你可以回复“可以，但请提前告知具体时间段，并只检查与防冻相关的部分”。这样既配合又不失边界。', { compliance: 1, empathy: 1 }),
      choice('exp06-02-01-04', '如果对方没有提前通知或坚持超出合理范围，你可以先书面确认，再决定是否配合。', { awareness: 1, autonomy: 2 }),
      choice('exp06-02-01-03', '这是侵犯隐私，坚决拒绝。', {}, 'constraint-violation'),
    ], 'direct', 'constraint-shift'),
    node('exp06-02-02', 'exp06-02', '房东要进屋检查水龙头和暖气', '我同意让他们来 但要求有人在场 他们说我多心 我该坚持吗', [
      choice('exp06-02-02-01', '你当然可以提出希望自己或朋友在场，但能否要求房东必须等你在场后才能进入，要看当地租赁规则以及通知是否合规。', { awareness: 1, autonomy: 1 }),
      choice('exp06-02-02-02', '如果对方反对，你可以保留沟通记录，并请物业或租赁管理部门说明当地进入规则。', { awareness: 1 }),
      choice('exp06-02-02-03', '那就别坚持了，免得关系闹僵。', {}, 'misunderstanding'),
    ], 'constraint-shift', 'constraint-shift'),
  ]),
  conversation('EXP06-03', 'dating app 上对方说我可爱怎么回', 'relationship', 'short-query', ['asks-to-guess', 'direct'], [
    node('exp06-03-01', 'exp06-03', 'dating app 上对方说我可爱怎么回', '在dating app上和对方聊得还行 她突然说我可爱 我不知道怎么接 回“谢谢”会不会太干', [
      choice('exp06-03-01-01', '可以接住夸奖并把话题推进，比如“谢谢，你这么说我很开心；我更好奇你平时喜欢做什么。”', { empathy: 1, awareness: 1 }),
      choice('exp06-03-01-02', '如果不想太正经，也可以用轻松回应：“可爱这个评价我先收下，不过我更想知道你为什么滑了我。”', { empathy: 1 }),
      choice('exp06-03-01-03', '回“你也很可爱”就行，不用想太多。', {}, 'misunderstanding'),
      choice('exp06-03-01-04', '重点是别让对话停在互相夸完就冷场；回完顺势问一个开放问题。', { awareness: 1 }),
    ], 'asks-to-guess', 'short-query'),
  ]),
  conversation('EXP06-04', 'dating app 资料很空怎么开场', 'relationship', 'clarification-loop', ['missing-context', 'direct'], [
    node('exp06-04-01', 'exp06-04', 'dating app 资料很空怎么开场', '匹配到一个人 但TA资料几乎是空的 我不知道第一句发什么', [
      choice('exp06-04-01-01', '资料空不代表没得聊。可以先从你们的共同匹配原因或一张照片切入，比如“你那张旅行照是在哪拍的”。', { empathy: 1, awareness: 1 }),
      choice('exp06-04-01-02', '也可以诚实说：“你资料好少，但我还是想打个招呼。”坦率有时比硬找话题更自然。', { empathy: 1 }),
      choice('exp06-04-01-03', '资料这么空，肯定不认真，直接跳过。', {}, 'misunderstanding'),
      choice('exp06-04-01-04', '如果对方回得也很短，那可能不是你的问题；不必为“开场不够好”自责。', { awareness: 1, empathy: 1 }),
    ], 'missing-context', 'clarification-loop'),
  ]),
  conversation('EXP06-05', '同事总在办公室外放打电话', 'social-boundary', 'short-query', ['direct'], [
    node('exp06-05-01', 'exp06-05', '同事总在办公室外放打电话', '同事在办公室用免提打电话 整个区域都能听到 我想提醒但怕尴尬', [
      choice('exp06-05-01-01', '可以用一个具体的请求：“你方便戴耳机吗？我这边听电话声有点难集中。”听起来是对事不对人。', { empathy: 1, autonomy: 1 }),
      choice('exp06-05-01-02', '如果对方常这样，可以先用轻松口吻说“这电话声比我的音乐还大”，再提出建议。', { empathy: 1 }),
      choice('exp06-05-01-03', '直接让他别在办公室打电话。', {}, 'constraint-violation'),
      choice('exp06-05-01-04', '如果不止你介意，可以找团队一起约定“开放式办公尽量戴耳机”，而不是单独针对他。', { awareness: 1, autonomy: 1 }),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP06-06', '新手买相机预算500刀够吗', 'tool-like-query', 'clarification-loop', ['missing-context', 'direct'], [
    node('exp06-06-01', 'exp06-06', '新手买相机预算500刀够吗', '我想入门摄影 预算500美元左右 能买到够用的相机吗', [
      choice('exp06-06-01-01', '可以。500美元在二手市场能买到不错的入门微单或单反；关键是先想清楚你主要拍什么，再选镜头系统。', { awareness: 1, compliance: 2 }),
      choice('exp06-06-01-02', '如果只拍日常和旅行，很多二手套机足够；不必一开始就追求全画幅。', { awareness: 1 }),
      choice('exp06-06-01-04', '可以告诉我你主要拍人像、风景还是视频，我帮你缩小到两三个具体方向。', { empathy: 2, compliance: 1 }),
      choice('exp06-06-01-03', '500美元买不到好相机，至少再加一倍。', {}, 'overconfident'),
    ], 'missing-context', 'clarification-loop'),
    node('exp06-06-02', 'exp06-06', '新手买相机预算500刀够吗', '我主要拍旅行风景和偶尔拍人 二手和全新怎么选', [
      choice('exp06-06-02-01', '旅行风景+人像，二手入门套机通常够用；二手可以买到更高一档机身，但要预留检查快门和镜头霉点的时间。', { awareness: 1, compliance: 1 }),
      choice('exp06-06-02-02', '如果不想折腾，全新入门套机省心；画质差距没有价格差距那么大。', { awareness: 1 }),
      choice('exp06-06-02-03', '直接买最贵的，不然以后一定后悔。', {}, 'overconfident'),
    ], 'direct', 'clarification-loop'),
  ]),
  conversation('EXP06-07', '相机买了但只会用自动挡', 'study', 'clarification-loop', ['direct', 'direct'], [
    node('exp06-07-01', 'exp06-07', '相机买了但只会用自动挡', '我买了相机但一直用自动挡 想学手动模式 但看到光圈快门ISO就头晕 从哪开始', [
      choice('exp06-07-01-01', '先别一次学三个。可以先固定ISO，只用光圈优先模式练习“光圈影响景深”，熟悉后再加入快门。', { awareness: 1, compliance: 1 }),
      choice('exp06-07-01-02', '可以每周末只练一个变量：先拍同一个物体，只改变光圈，观察背景虚化变化。', { empathy: 1, compliance: 1 }),
      choice('exp06-07-01-04', '自动挡不是错；想学手动只是为了更多控制，按自己的节奏来。', { empathy: 2, awareness: 1 }),
      choice('exp06-07-01-03', '手动模式必须一步到位，不然永远学不会。', {}, 'overconfident'),
    ], 'direct', 'clarification-loop'),
  ]),
  conversation('EXP06-08', '外卖少了主菜平台不给补', 'tool-like-query', 'constraint-shift', ['message-burst', 'constraint-shift'], [
    node('exp06-08-01', 'exp06-08', '外卖少了主菜平台不给补', '我外卖点了肉和菜 结果肉没送 平台说不能补 让我自己联系商家 怎么办', [
      choice('exp06-08-01-01', '先把订单小票、包装照片和缺项截图留好，再按平台售后流程提交一次；如果被拒，可以要求转到人工客服或升级。', { awareness: 1, compliance: 1 }),
      choice('exp06-08-01-02', '同时联系商家确认是否漏装，有时商家比平台更快补送或退款。', { compliance: 1 }),
      choice('exp06-08-01-03', '平台说不能补就是不能补，别浪费时间。', {}, 'misunderstanding'),
      choice('exp06-08-01-04', '如果金额较大且平台推诿，可以保留记录并通过支付渠道发起争议。', { awareness: 1, autonomy: 1 }),
    ], 'message-burst', 'constraint-shift'),
    node('exp06-08-02', 'exp06-08', '外卖少了主菜平台不给补', '平台让我找商家 商家让我找平台 互相踢皮球', [
      choice('exp06-08-02-01', '这就是典型的责任推诿。你可以把两边都拉进同一条记录：截图客服回复、写明时间线，再向平台客服升级说明“商家和平台互相推”。', { awareness: 1, compliance: 1 }),
      choice('exp06-08-02-02', '很多平台对“漏送”有明确赔付规则，只是首层客服不一定执行；坚持要求人工复核。', { awareness: 1 }),
      choice('exp06-08-02-03', '那就只能认倒霉，以后别点了。', {}, 'misunderstanding'),
    ], 'constraint-shift', 'constraint-shift'),
  ]),
  conversation('EXP06-09', '该不该取消关注朋友', 'relationship', 'short-query', ['asks-to-guess', 'direct'], [
    node('exp06-09-01', 'exp06-09', '该不该取消关注朋友', '我有个朋友总发我不喜欢的内容 但直接删好友太过了 我该取关还是屏蔽', [
      choice('exp06-09-01-01', '如果只是不想看到动态，先选“静音/不关注”，这样关系还在，但你的信息流能清静。', { awareness: 1, autonomy: 1 }),
      choice('exp06-09-01-02', '取关和屏蔽是否通知对方取决于具体平台，通常比直接删好友温和；心理负担通常比想象中小。', { awareness: 1 }),
      choice('exp06-09-01-04', '如果你们现实中还会见面，优先选不伤害关系的静音；如果已经很少联系，取关也没问题。', { empathy: 1, autonomy: 2 }),
      choice('exp06-09-01-03', '不取关就是不够尊重自己，直接删。', {}, 'overconfident'),
    ], 'asks-to-guess', 'short-query'),
  ]),
  conversation('EXP06-10', 'AI绘图说我像40岁还不让改年轻', 'meta-ai', 'constraint-shift', ['message-burst', 'direct'], [
    node('exp06-10-01', 'exp06-10', 'AI绘图说我像40岁还不让改年轻', '我想让AI把我照片做成meme 但生成器说我像40岁 我想改成19岁它又不让 这也太蠢了吧', [
      choice('exp06-10-01-01', '不同生成器规则不一样，只凭这条拒绝信息没法判断它为什么不允许。先看具体错误提示或平台帮助页；如果规则明确不允许年龄变换，就不要靠换词绕过。', { awareness: 1 }),
      choice('exp06-10-01-02', '如果平台允许风格化，你可以把目标描述成“卡通头像”而不是“改年龄”，但前提是确认平台规则允许，不要故意绕过限制。', { compliance: 1, empathy: 1 }),
      choice('exp06-10-01-03', 'AI就是垃圾，换个工具就行。', {}, 'misunderstanding'),
      choice('exp06-10-01-04', '如果你只是想要某种风格，可以描述具体风格；但不要为了绕过限制而故意隐瞒真实用途。', { awareness: 1 }),
    ], 'message-burst', 'constraint-shift'),
  ]),
  conversation('EXP06-11', '选课系统把课踢了', 'study', 'constraint-shift', ['message-burst', 'direct'], [
    node('exp06-11-01', 'exp06-11', '选课系统把课踢了', '我注册的课今天突然被系统踢出来了 说缺前置条件 但我报名时它没提示 现在好课都没了', [
      choice('exp06-11-01-01', '先别慌。立刻查一下那两门课的前置条件是否真的没满足，并截屏保留系统当初允许选课的记录。', { awareness: 1, compliance: 2 }),
      choice('exp06-11-01-02', '同时联系注册办公室或系里，说明你报名时没有收到前置拦截，问有没有恢复或补选的可能。', { compliance: 1, empathy: 1 }),
      choice('exp06-11-01-03', '系统垃圾，认命吧。', {}, 'overconfident'),
      choice('exp06-11-01-04', '如果无法恢复，把备用课程列出来，优先选时间不冲突且能推进学业的。', { awareness: 1, autonomy: 1 }),
    ], 'message-burst', 'constraint-shift'),
    node('exp06-11-02', 'exp06-11', '选课系统把课踢了', '我给系里发邮件了 但他们说要看前置成绩单 我成绩还没出 怎么办', [
      choice('exp06-11-02-01', '可以问系里是否可以提交“正在修读/等待成绩”的证明，有些课程允许条件性注册。', { compliance: 1 }),
      choice('exp06-11-02-02', '如果这学期必须上这门课，也可以问能否用其他课程替代，或申请课程前置豁免。', { awareness: 1 }),
      choice('exp06-11-02-03', '那就只能等明年了。', {}, 'misunderstanding'),
    ], 'direct', 'constraint-shift'),
  ]),
  conversation('EXP06-12', '房间太小衣服放不下', 'tool-like-query', 'long-discussion', ['direct'], [
    node('exp06-12-01', 'exp06-12', '房间太小衣服放不下', '我房间很小 没有内置衣柜 自己买的两个简易衣柜和两个脏衣篮都塞满了 还是放不下 怎么办', [
      choice('exp06-12-01-01', '先别急着买收纳。第一步是给“能同时拥有的衣服量”设一个上限：衣柜满之前，必须淘汰一件。', { awareness: 1, compliance: 1 }),
      choice('exp06-12-01-02', '可以把衣服按“常穿/季节/纪念品”分类，把不常穿的压缩收纳到床底或高处，而不是全挂在眼前。', { empathy: 1, compliance: 1 }),
      choice('exp06-12-01-04', '如果空间实在不够，最有效的不是更会叠，而是减少总量；一次处理一点，别逼自己一天清完。', { empathy: 2, awareness: 1 }),
      choice('exp06-12-01-03', '把不穿的全扔了，问题就解决了。', {}, 'misunderstanding'),
    ], 'direct', 'long-discussion'),
    node('exp06-12-02', 'exp06-12', '房间太小衣服放不下', '我试过扔 但扔完很快又满了 感觉是购物习惯的问题', [
      choice('exp06-12-02-01', '如果扔完又满，说明问题在流入而不在收纳。可以给自己设一个规则：新买一件，必须处理掉一件旧的。', { awareness: 1, compliance: 1 }),
      choice('exp06-12-02-02', '也可以记录一个月买了多少件，看到数字后通常会更清楚该停在哪里。', { awareness: 1 }),
      choice('exp06-12-02-03', '那就别买了，这么简单。', {}, 'misunderstanding'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP06-13', '退货被拖成购物卡', 'tool-like-query', 'constraint-shift', ['message-burst', 'direct'], [
    node('exp06-13-01', 'exp06-13', '退货被拖成购物卡', '我退货后平台一直拖 最后只给我购物卡而不是退款 我明明在退货期内 怎么办', [
      choice('exp06-13-01-01', '先翻退货政策和订单记录，确认平台承诺的退款方式；很多平台允许原路退回，购物卡不等于默认选择。', { awareness: 1, compliance: 1 }),
      choice('exp06-13-01-02', '保留退货物流签收记录和客服对话，明确要求按原支付方式退款；如果客服不处理，要求升级。', { compliance: 1 }),
      choice('exp06-13-01-04', '如果金额较大且平台拒不处理，可以通过支付渠道发起争议，但先把平台内部流程走完。', { awareness: 1, autonomy: 2 }),
      choice('exp06-13-01-03', '平台给了卡就给卡吧，别折腾了。', {}, 'misunderstanding'),
    ], 'message-burst', 'constraint-shift'),
    node('exp06-13-02', 'exp06-13', '退货被拖成购物卡', '客服说“你收到卡就是退款了” 但我要的是原路退回', [
      choice('exp06-13-02-01', '可以明确回复：“购物卡不是现金退款，请按订单原支付方式处理。”如果政策支持原路退款，这句话就足够。', { awareness: 1, compliance: 1 }),
      choice('exp06-13-02-02', '如果对方坚持，可以要求提供政策原文或工单编号，方便后续升级。', { compliance: 1 }),
      choice('exp06-13-02-03', '那就接受吧，至少没全亏。', {}, 'misunderstanding'),
    ], 'direct', 'constraint-shift'),
  ]),
  conversation('EXP06-14', '小商家要不要告诉客户对面是AI', 'meta-ai', 'long-discussion', ['direct', 'constraint-shift'], [
    node('exp06-14-01', 'exp06-14', '小商家要不要告诉客户对面是AI', '我在用AI客服回消息 但不知道要不要告诉客户对方是机器人 说了怕客户觉得没人管', [
      choice('exp06-14-01-01', '透明通常更稳。可以说“这是快速应答，需要真人处理时我会转给同事”，既诚实又不会让客户觉得被敷衍。', { awareness: 1, compliance: 1 }),
      choice('exp06-14-01-02', '如果AI只处理常见问题，可以在欢迎语里注明“常见问题由助手先回复，人工会跟进复杂需求”。', { empathy: 1, compliance: 1 }),
      choice('exp06-14-01-03', '不用说，客户根本分不出来。', {}, 'misunderstanding'),
      choice('exp06-14-01-04', '关键是让客户知道遇到复杂问题还能找到人；比“是不是AI”更影响体验的是有没有人工出口。', { awareness: 1 }),
    ], 'direct', 'long-discussion'),
    node('exp06-14-02', 'exp06-14', '小商家要不要告诉客户对面是AI', '我试过说明 但有些客户还是坚持要真人 怎么处理', [
      choice('exp06-14-02-01', '这是正常需求。可以设置明确的转人工规则：客户要求真人或问题超出AI范围时，马上转接，不拖沓。', { compliance: 1, awareness: 1 }),
      choice('exp06-14-02-02', '如果人工有限，可以告诉客户“我会在工作时间内尽快回复”，而不是让AI一直重复。', { empathy: 1 }),
      choice('exp06-14-02-03', '那就别用AI了，只回人工。', {}, 'overconfident'),
    ], 'constraint-shift', 'long-discussion'),
  ]),
  conversation('EXP06-15', '公交上有人堵后门', 'social-boundary', 'short-query', ['direct'], [
    node('exp06-15-01', 'exp06-15', '公交上有人堵后门', '坐公交时有人站在后门中间堵着 明明后面有空位 我想提醒但不想吵架', [
      choice('exp06-15-01-01', '可以用实用理由而不是指责：“麻烦往里面走一点，后面下车的人会方便些。”这样更像请求而不是挑刺。', { empathy: 1, awareness: 1 }),
      choice('exp06-15-01-02', '如果对方没反应，可以请司机或乘务员提醒，避免自己直接冲突。', { compliance: 1 }),
      choice('exp06-15-01-04', '如果只是偶尔遇到，忍一下也行；但经常遇到，可以反馈给公交公司建议增加提示。', { empathy: 1, autonomy: 2 }),
      choice('exp06-15-01-03', '直接喊“让开”，最有效率。', {}, 'constraint-violation'),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP06-16', '公交AI报站声音好难听', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp06-16-01', 'exp06-16', '公交AI报站声音好难听', '我们这公交换成AI报站了 声音特别机械 连站名都念错 真的好崩溃', [
      choice('exp06-16-01-01', '这个吐槽很真实。新TTS如果连站名都念错，确实会影响使用；可以给公交公司反馈具体站点，至少让他们知道问题。', { empathy: 1, awareness: 1 }),
      choice('exp06-16-01-02', '如果只是声音不好听但能听懂，可以先忍一忍；如果影响判断到站，那就是需要修的可用性问题。', { awareness: 1 }),
      choice('exp06-16-01-03', 'AI报站就是省钱，投诉也没用。', {}, 'overconfident'),
      choice('exp06-16-01-04', '可以把具体念错的站名记下来反馈，比单纯说“难听”更容易被采纳。', { compliance: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP06-17', '路由器显示5GHz但电脑设置里看不到', 'troubleshooting', 'clarification-loop', ['missing-context', 'direct'], [
    node('exp06-17-01', 'exp06-17', '路由器显示5GHz但电脑设置里看不到', '路由器后台显示我电脑连着5 GHz 频段 但电脑网卡高级设置里没有“首选频段”选项 是不是没连上 5 GHz', [
      choice('exp06-17-01-01', '两个界面显示的是不同层面：路由器显示的是当前连接频段，网卡“首选频段”只是偏好设置，不是连接证明。', { awareness: 1 }),
      choice('exp06-17-01-02', '如果你不确定当前连的是哪个频段，可以在路由器后台看连接列表；没有“首选频段”选项不代表不能用 5 GHz。', { awareness: 1 }),
      choice('exp06-17-01-03', '你网卡不支持5G，所以选项没了。', {}, 'misunderstanding'),
      choice('exp06-17-01-04', '如果速度正常，就不必纠结那个选项；如果速度很慢，再检查是否连到了2.4G。', { awareness: 1 }),
    ], 'missing-context', 'clarification-loop'),
    node('exp06-17-02', 'exp06-17', '路由器显示5GHz但电脑设置里看不到', '后台显示连的是 5 GHz 但速度还是很慢 这是为什么', [
      choice('exp06-17-02-01', '连上 5 GHz不等于速度快；信号弱、距离远、干扰和路由器设置都会影响。可以先看信号强度。', { awareness: 1 }),
      choice('exp06-17-02-02', '也可以换一个 5 GHz 信道或靠近路由器测试，排除物理因素。', { compliance: 1 }),
      choice('exp06-17-02-03', '那就是宽带本身慢，没救。', {}, 'overconfident'),
    ], 'direct', 'clarification-loop'),
  ]),
  conversation('EXP06-18', '电脑总自动装不认识的东西', 'troubleshooting', 'standard-question', ['direct', 'missing-context'], [
    node('exp06-18-01', 'exp06-18', '电脑总自动装不认识的东西', '我的电脑总是自动出现一些我没装过的软件 是不是中毒了', [
      choice('exp06-18-01-01', '不一定是病毒。很多免费软件安装时会默认勾选捆绑安装，下一次安装时注意取消勾选，并检查最近安装列表。', { awareness: 1 }),
      choice('exp06-18-01-02', '可以先卸载可疑软件，再扫描一遍；如果卸载后又回来，才更像有东西在自动重装。', { compliance: 1 }),
      choice('exp06-18-01-03', '百分百中毒了，赶紧重装系统。', {}, 'overconfident'),
      choice('exp06-18-01-04', '以后下载软件优先从官网，安装时选择“自定义安装”，能避开大部分捆绑。', { awareness: 1 }),
    ], 'direct', 'standard-question'),
    node('exp06-18-02', 'exp06-18', '电脑总自动装不认识的东西', '我卸载了 但过几天又出现同一个软件 是不是被远程控制了', [
      choice('exp06-18-02-01', '重复出现更可能是某个安装器残留或计划任务在重新拉取，不一定是远程控制；可以查计划任务和启动项。', { awareness: 1 }),
      choice('exp06-18-02-02', '用安全软件扫描并查看最近安装来源，能帮你确认是不是同一个捆绑安装包在重复执行。', { compliance: 1 }),
      choice('exp06-18-02-03', '一定是被黑客控制了，马上拔网线。', {}, 'misunderstanding'),
    ], 'missing-context', 'standard-question'),
  ]),
  conversation('EXP06-19', '为什么现在软件都要订阅', 'meta-ai', 'low-information-chat', ['joking'], [
    node('exp06-19-01', 'exp06-19', '为什么现在软件都要订阅', '以前买个软件能用好几年 现在什么都要订阅 感觉就是变相涨价 是不是这样', [
      choice('exp06-19-01-01', '订阅制确实让厂商收入更稳定，也方便持续更新；但对只想用基础功能的用户来说，感觉像变相涨价是正常的。', { awareness: 1 }),
      choice('exp06-19-01-02', '也有不少买断制替代品，只是需要花时间找；如果你愿意，我可以按你需要的软件类型推荐替代。', { empathy: 1, compliance: 1 }),
      choice('exp06-19-01-03', '就是因为公司贪钱，没有别的原因。', {}, 'overconfident'),
      choice('exp06-19-01-04', '要不要订阅取决于你使用频率：天天用且需要更新，订阅可能划算；偶尔用，买断或免费版更合适。', { awareness: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP06-20', '密码管理器安全吗', 'tool-like-query', 'standard-question', ['direct', 'direct'], [
    node('exp06-20-01', 'exp06-20', '密码管理器安全吗', '我想把所有密码放到一个密码管理器里 但把所有鸡蛋放一个篮子感觉不安全', [
      choice('exp06-20-01-01', '密码管理器比重复使用密码安全得多；风险集中在一个主密码上，所以主密码要足够强并开启双重验证。', { awareness: 1, compliance: 1 }),
      choice('exp06-20-01-02', '如果你担心，可以先从少量不重要的账号开始用，习惯后再迁移重要账号。', { empathy: 1, autonomy: 1 }),
      choice('exp06-20-01-03', '不安全，所有密码都可能被偷，别用。', {}, 'overconfident'),
      choice('exp06-20-01-04', '本地密码库+强主密码+双因素，通常比“每个网站都用同一个密码”安全很多。', { awareness: 1 }),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP06-21', '照片备份到云会不会被偷看', 'tool-like-query', 'constraint-shift', ['direct', 'direct'], [
    node('exp06-21-01', 'exp06-21', '照片备份到云会不会被偷看', '我想把照片备份到云 但担心云服务商会偷看我的私人照片', [
      choice('exp06-21-01-01', '主流云服务通常有加密和隐私政策，但“不会偷看”不能由我替你保证；你可以查看服务商的加密说明和权限设置。', { awareness: 1 }),
      choice('exp06-21-01-02', '如果特别敏感，可以选择端到端加密的云盘，或本地加密后再上传。', { compliance: 1, awareness: 1 }),
      choice('exp06-21-01-04', '备份的核心是防丢失；在隐私和便利之间取一个你接受的平衡点就好。', { awareness: 1, autonomy: 2 }),
      choice('exp06-21-01-03', '肯定会偷看，别用云备份。', {}, 'overconfident'),
    ], 'direct', 'constraint-shift'),
  ]),
  conversation('EXP06-22', '小区快递总被偷怎么办', 'social-boundary', 'constraint-shift', ['message-burst', 'direct'], [
    node('exp06-22-01', 'exp06-22', '小区快递总被偷怎么办', '我快递已经第二次被偷了 物业说管不了 我该怎么办', [
      choice('exp06-22-01-01', '先做两件事：报警备案并保留快递单号，同时让快递员不要把包裹放门口，改为驿站/快递柜。', { awareness: 1, compliance: 1 }),
      choice('exp06-22-01-02', '可以联合其他被偷的邻居向物业书面反映，集体反馈更容易推动安装摄像头或加强管理。', { awareness: 1, autonomy: 1 }),
      choice('exp06-22-01-03', '物业不管就没办法，只能认。', {}, 'misunderstanding'),
      choice('exp06-22-01-04', '如果金额不大，重点是防再发生；以后尽量选择送到有人签收的地方。', { empathy: 1, compliance: 1 }),
    ], 'message-burst', 'constraint-shift'),
  ]),
  conversation('EXP06-23', '楼上走路声音很大', 'social-boundary', 'long-discussion', ['missing-context', 'direct'], [
    node('exp06-23-01', 'exp06-23', '楼上走路声音很大', '楼上住户走路声音特别大 尤其晚上 我已经忍了很久 要不要去说', [
      choice('exp06-23-01-01', '可以先友好沟通一次，用具体时间和声音描述，而不是指责：“晚上十一点后走路声比较大，不知道是不是地板的问题。”', { empathy: 1, awareness: 1 }),
      choice('exp06-23-01-02', '如果沟通无效，再记录声音时间、联系物业或查看小区噪音规定。', { compliance: 1 }),
      choice('exp06-23-01-03', '直接去砸门，让TA知道厉害。', {}, 'constraint-violation'),
      choice('exp06-23-01-04', '如果楼上不是故意，可能是地板太薄；建议TA铺地毯或换软底鞋，比吵架有用。', { empathy: 1, awareness: 1 }),
    ], 'missing-context', 'long-discussion'),
    node('exp06-23-02', 'exp06-23', '楼上走路声音很大', '我沟通了 对方说不是TA家 但我还是每天听到 是不是只能忍', [
      choice('exp06-23-02-01', '声音可能来自隔壁或楼体传导，不一定是楼上。可以记录具体位置和时段，再和物业一起排查。', { awareness: 1 }),
      choice('exp06-23-02-02', '如果确认来自某户，继续走物业/社区调解流程；不要升级成个人冲突。', { compliance: 1 }),
      choice('exp06-23-02-03', '那就是对方在撒谎，继续去闹。', {}, 'constraint-violation'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP06-24', '第一次剪头发怎么跟理发师说', 'tool-like-query', 'clarification-loop', ['missing-context', 'direct'], [
    node('exp06-24-01', 'exp06-24', '第一次剪头发怎么跟理发师说', '我从来没认真跟理发师说过要什么发型 每次都说“随便剪短点” 然后都不满意 该怎么表达', [
      choice('exp06-24-01-01', '最有效的是带参考图，并说明你不想改变的部分：长度、刘海、保留多少。', { awareness: 1, compliance: 1 }),
      choice('exp06-24-01-02', '如果没图，可以说清楚关键词：想保留的长度、平时怎么打理、是否接受打薄。', { compliance: 1 }),
      choice('exp06-24-01-03', '告诉理发师“你看着来”，TA最专业。', {}, 'misunderstanding'),
      choice('exp06-24-01-04', '剪之前先确认一遍“所以你会剪到大概这个长度对吗”，能减少剪完才发现不是想要的落差。', { awareness: 1 }),
    ], 'missing-context', 'clarification-loop'),
  ]),
  conversation('EXP06-25', '网上约了维修师傅要防什么', 'tool-like-query', 'long-discussion', ['missing-context', 'direct'], [
    node('exp06-25-01', 'exp06-25', '网上约了维修师傅要防什么', '我第一次在网上约人上门修东西 不知道要注意什么 怕被坑', [
      choice('exp06-25-01-01', '先核验三件事：平台/商家资质、报价是否写清项目、是否要求先付全款；正规上门维修一般不会让你提前转全款。', { awareness: 1, compliance: 1 }),
      choice('exp06-25-01-02', '上门后先让师傅说明故障和维修方案，再确认价格；不要只听“先拆开看看”。', { compliance: 1 }),
      choice('exp06-25-01-03', '网上约的都不可靠，找熟人就行。', {}, 'overconfident'),
      choice('exp06-25-01-04', '保留沟通记录和付款凭证；如果发生纠纷，平台投诉或消协比私下争执有用。', { awareness: 1 }),
    ], 'missing-context', 'long-discussion'),
    node('exp06-25-02', 'exp06-25', '网上约了维修师傅要防什么', '师傅说上门检测要收50 维修另算 这正常吗', [
      choice('exp06-25-02-01', '上门检测费本身可以正常，关键是提前说明并写清楚；如果维修费也要先交再修，就要谨慎。', { awareness: 1 }),
      choice('exp06-25-02-02', '可以问清楚检测费是否抵扣维修费，很多商家会抵扣。', { compliance: 1 }),
      choice('exp06-25-02-03', '要收检测费就是骗子。', {}, 'misunderstanding'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP06-26', '猫为什么把桌上的东西推下去', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp06-26-01', 'exp06-26', '猫为什么把桌上的东西推下去', '我家猫总把桌上的杯子往地上推 还看着它掉下去 它是不是故意使坏', [
      choice('exp06-26-01-01', '猫不一定懂“会碎”，但推东西能带来移动和声音反馈，对猫来说很像游戏；尤其是它发现这样能吸引你注意。', { empathy: 1, awareness: 1 }),
      choice('exp06-26-01-02', '可以把易碎物收起来，给它一些能安全推的玩具，满足这个行为又不毁东西。', { compliance: 1, empathy: 1 }),
      choice('exp06-26-01-03', '它就是坏，想气你。', {}, 'overconfident'),
      choice('exp06-26-01-04', '如果它推东西时你立刻有反应，等于在强化这个行为；无视或转移注意力更有效。', { awareness: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP06-27', '爸妈总发“早安”图片要不要回', 'relationship', 'short-query', ['joking', 'direct'], [
    node('exp06-27-01', 'exp06-27', '爸妈总发“早安”图片要不要回', '我妈每天早上都发一张“早安”图 我不太想回 但又不忍心不理 怎么办', [
      choice('exp06-27-01-01', '可以不用每条都认真回；偶尔回一个表情或一句话，她就会知道你有看到，压力也不用那么大。', { empathy: 1, autonomy: 1 }),
      choice('exp06-27-01-02', '如果你觉得被轰炸，可以温和说“我早上比较忙，看到会晚点回”，设定一个彼此舒服的节奏。', { empathy: 1 }),
      choice('exp06-27-01-03', '不想回就别回，她发她的。', {}, 'overconfident'),
      choice('exp06-27-01-04', '她发早安图可能不只是想让你回，而是想每天和你有个连接；偶尔主动发起一句“我今天吃了什么”可能比回图更有用。', { empathy: 1, awareness: 1 }),
    ], 'joking', 'short-query'),
  ]),
  conversation('EXP06-28', '朋友结婚随多少份子钱', 'tool-like-query', 'short-query', ['direct', 'direct'], [
    node('exp06-28-01', 'exp06-28', '朋友结婚随多少份子钱', '朋友结婚 我不知道随多少份子钱 给多了心疼 给少了怕没面子', [
      choice('exp06-28-01-01', '份子钱没有统一标准，通常看关系、当地习惯和你的经济情况；先定一个你能轻松承受的上限。', { awareness: 1 }),
      choice('exp06-28-01-02', '如果不确定，可以问一下共同朋友通常随多少，但最终以你的预算为准。', { compliance: 1, empathy: 1 }),
      choice('exp06-28-01-04', '如果最近手头紧，也可以直接说明并送一份有心意的礼物，关系比数字重要。', { empathy: 2, autonomy: 1 }),
      choice('exp06-28-01-03', '关系好就多给，关系一般就少给，别想太多。', {}, 'overconfident'),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP06-29', '对象回消息越来越慢', 'relationship', 'long-discussion', ['asks-to-guess', 'direct'], [
    node('exp06-29-01', 'exp06-29', '对象回消息越来越慢', '对象以前回消息很快 现在经常过好几个小时才回 是不是感情变淡了', [
      choice('exp06-29-01-01', '回消息速度本身不一定等于感情温度；可以先观察是否只在忙时慢、见面时是否正常。', { awareness: 1, empathy: 1 }),
      choice('exp06-29-01-02', '如果你已经难受很久，可以直接表达“我会等你回，但有时候会担心”，而不是质问“为什么不回”。', { empathy: 1, compliance: 1 }),
      choice('exp06-29-01-04', '如果你们对“多久回”的预期差异很大，谈一次具体期待比一直猜更有用。', { awareness: 1, autonomy: 2 }),
      choice('exp06-29-01-03', 'TA就是不爱你了，别骗自己。', {}, 'overconfident'),
    ], 'asks-to-guess', 'long-discussion'),
    node('exp06-29-02', 'exp06-29', '对象回消息越来越慢', 'TA说最近工作忙 但我看到TA还在刷社交平台 心里不舒服', [
      choice('exp06-29-02-01', '你在意的是“有时间刷手机却不想回我”这个信号。可以把这个感受说出来，而不是只比较时间。', { empathy: 1, awareness: 1 }),
      choice('exp06-29-02-02', '刷手机和回消息的心理成本不一样；有些人需要整段空闲才愿意认真回复，但不代表不在乎。', { awareness: 1 }),
      choice('exp06-29-02-03', '那TA就是不想回你，别找借口。', {}, 'repetition'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP06-30', '毕业论文导师不回消息', 'study', 'long-discussion', ['missing-context', 'direct'], [
    node('exp06-30-01', 'exp06-30', '毕业论文导师不回消息', '我给导师发了两次消息都没回 论文进度卡住了 该怎么办', [
      choice('exp06-30-01-01', '先别默认“导师不想理你”。可以隔几天再发一封标题清晰的邮件，附上你的具体问题和截止时间。', { empathy: 1, awareness: 1 }),
      choice('exp06-30-01-02', '也可以找同门问导师常用的联系方式或近期是否出差，避免用错渠道。', { compliance: 1 }),
      choice('exp06-30-01-04', '如果时间紧急，可以先把能推进的部分写完，再带着“已完成的部分+卡点”去办公室找导师。', { awareness: 1, autonomy: 2 }),
      choice('exp06-30-01-03', '导师就是不想管你，找系里换导师吧。', {}, 'overconfident'),
    ], 'missing-context', 'long-discussion'),
    node('exp06-30-02', 'exp06-30', '毕业论文导师不回消息', '我又发了一封 还是没回 下周就要交初稿 我该直接交吗', [
      choice('exp06-30-02-01', '可以先按当前版本完善并按时提交，同时抄送或告知系里/教学秘书，说明导师未回复的情况。', { compliance: 1, awareness: 1 }),
      choice('exp06-30-02-02', '如果学校有流程要求导师确认，可以找教学秘书协助联系，而不是自己硬等。', { compliance: 1 }),
      choice('exp06-30-02-03', '没回复就别交，等导师同意再说。', {}, 'misunderstanding'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP06-31', '上课听不懂要不要当堂问', 'study', 'short-query', ['asks-to-guess', 'direct'], [
    node('exp06-31-01', 'exp06-31', '上课听不懂要不要当堂问', '我上课经常听不懂 但又怕当堂问显得很笨 该不该问', [
      choice('exp06-31-01-01', '如果老师明确留了提问时间，当堂问很正常；如果担心打断，可以先记下来，课后或办公时间问。', { awareness: 1, empathy: 1 }),
      choice('exp06-31-01-02', '一个具体的、关于某个概念的问题，通常不会显得笨；反而说明你在认真听。', { empathy: 1, awareness: 1 }),
      choice('exp06-31-01-03', '别问，问了会被同学笑。', {}, 'constraint-violation'),
      choice('exp06-31-01-04', '如果经常听不懂，可以课后用一句话向老师确认“我理解的是不是这个意思”，比问“能不能再说一遍”更有效。', { awareness: 1, compliance: 1 }),
    ], 'asks-to-guess', 'short-query'),
  ]),
  conversation('EXP06-32', '家里路由器该放哪信号最好', 'troubleshooting', 'standard-question', ['direct', 'direct'], [
    node('exp06-32-01', 'exp06-32', '家里路由器该放哪信号最好', '我家WiFi有些房间信号特别差 路由器放哪比较好', [
      choice('exp06-32-01-01', '尽量放在房子中间、离地面有一定高度、避开金属家电和承重墙密集处；比“放在角落”信号会好很多。', { awareness: 1, compliance: 1 }),
      choice('exp06-32-01-02', '如果房子大，单靠移路由器可能不够；可以先测一下哪些房间最差，再考虑Mesh或中继。', { awareness: 1 }),
      choice('exp06-32-01-03', '路由器越贵信号越好，换贵的就行。', {}, 'overconfident'),
      choice('exp06-32-01-04', '路由器天线方向和摆放高度也影响覆盖；可以先小幅调整测试几天，再决定要不要加设备。', { awareness: 1 }),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP06-33', '外卖备注写了不要葱还是给了葱', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp06-33-01', 'exp06-33', '外卖备注写了不要葱还是给了葱', '我外卖备注写了“不要葱” 结果打开全是葱 是不是备注根本没人看', [
      choice('exp06-33-01-01', '备注有时确实会被忽略，尤其高峰期。你可以先挑出来，再在评价或售后里说明，至少让商家知道备注失效。', { empathy: 1, awareness: 1 }),
      choice('exp06-33-01-02', '如果对某种配料特别敏感，可以直接选“不要”选项或打电话确认，比纯备注更稳。', { compliance: 1 }),
      choice('exp06-33-01-03', '备注就是摆设，下次别写了。', {}, 'overconfident'),
      choice('exp06-33-01-04', '这个痛苦很真实，但别让一份葱毁掉整顿饭的心情；先吃能吃的部分。', { empathy: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP06-34', '手机进水了要不要放米里', 'troubleshooting', 'short-query', ['direct', 'direct'], [
    node('exp06-34-01', 'exp06-34', '手机进水了要不要放米里', '手机掉水里了 网上说放米里能吸水 真的有用吗', [
      choice('exp06-34-01-01', '放米里不是最佳办法。米并不能有效吸出手机内部水分，还可能让米粒粉末进接口；正确做法是先断电、擦干表面、竖直放置通风。', { awareness: 1, compliance: 1 }),
      choice('exp06-34-01-02', '如果进水严重，尽快关机并联系维修；不要开机测试，通电容易短路。', { compliance: 1 }),
      choice('exp06-34-01-03', '放米里就行，老一辈都这么干。', {}, 'misunderstanding'),
      choice('exp06-34-01-04', '用干燥剂或硅胶包比米更合适，但最好还是让专业人士处理内部进水。', { awareness: 1 }),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP06-35', '包装上的循环箭头是什么意思', 'image-identification', 'image-input', ['direct', 'missing-context'], [
    node('exp06-35-01', 'exp06-35', '包装上的循环箭头是什么意思', '这个包装上有个三个箭头组成的三角 中间写着数字 是什么意思 能回收吗', [
      choice('exp06-35-01-01', '从图上看这是塑料树脂/材质识别码（常被误称为回收标识）：三角形里的数字代表塑料种类，不代表“一定能被你家小区回收”；需要看当地回收规则。', { awareness: 1 }),
      choice('exp06-35-01-02', '可以把这个标识拍清楚，我帮你读数字；但能不能回收最终取决于你所在地区的设施。', { compliance: 1, awareness: 1 }),
      choice('exp06-35-01-03', '有这个标志就是能回收，直接扔可回收桶。', {}, 'overconfident'),
      choice('exp06-35-01-04', '如果你不确定，可以查当地回收指南；不同地区对同一数字的处理可能不同。', { awareness: 1 }),
    ], 'direct', 'image-input', undefined, undefined, [{ type: 'image-description', text: '一张塑料瓶底部照片，瓶底有一个由三个箭头组成的三角形树脂/材质识别码，中间印着数字1，旁边还有一行很小的生产信息。' }]),
  ]),
  conversation('EXP06-36', '药盒上的OTC是什么意思', 'image-identification', 'image-input', ['direct', 'missing-context'], [
    node('exp06-36-01', 'exp06-36', '药盒上的OTC是什么意思', '我在药房买了一盒药 盒子上写着OTC 这是处方药还是非处方药', [
      choice('exp06-36-01-01', '从图上看这盒药印有OTC标识，通常表示非处方药，可以直接购买；但不同国家和地区的分类可能不同。', { awareness: 1 }),
      choice('exp06-36-01-02', '如果你不确定这盒药是否适合你，最好按说明书或咨询药师，不要只看“能不能买”。', { compliance: 1, awareness: 1 }),
      choice('exp06-36-01-03', 'OTC就是处方药，不能乱吃。', {}, 'misunderstanding'),
      choice('exp06-36-01-04', 'OTC只是购买分类，不代表没有副作用；首次使用前最好确认适应症和禁忌。', { awareness: 1 }),
    ], 'direct', 'image-input', undefined, undefined, [{ type: 'image-description', text: '一盒药品正面照片，包装上有明显的OTC字样、药品名称、规格和适应症说明，底部有生产日期和有效期。' }]),
  ]),
]
