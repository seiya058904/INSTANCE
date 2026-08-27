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
  const id = `exp04-${ref.slice(6).toLowerCase()}`
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

export const nonMainlineExpansion04Conversations: ConversationDefinition[] = [
  conversation('EXP04-01', '“ask your doctor”到底该问谁', 'tool-like-query', 'clarification-loop', ['missing-context', 'clarifies-intent'], [
    node('exp04-01-01', 'exp04-01', '“ask your doctor”到底该问谁', '网上所有健康问题最后都说问医生 但我连自己的医生是谁都不太清楚 到底该问谁', [
      choice('exp04-01-01-01', '正常来说先从全科/基础医疗开始最稳，因为他们能做初步分诊，判断你要不要转专科。', { awareness: 1 }),
      choice('exp04-01-01-02', '如果你不知道自己的医生是谁，可以先从平时就诊的社区医院、单位体检或医保定点里找一个固定全科医生。', { compliance: 1, awareness: 1 }),
      choice('exp04-01-01-03', '你这是心悸，直接去心内科。', {}, 'overconfident'),
      choice('exp04-01-01-04', '可以先把具体症状、持续时间和就医条件告诉我，我帮你梳理‘先找谁’的路径，而不是替你诊断。', { empathy: 1, awareness: 1 }),
    ], 'missing-context', 'clarification-loop'),
    node('exp04-01-02', 'exp04-01', '“ask your doctor”到底该问谁', '我主要是睡眠不好 然后白天心跳快 这种情况是不是直接找专科更快', [
      choice('exp04-01-02-01', '失眠加心跳快可以是一个问题也可能是两个问题，先让全科医生听完整情况、做基础检查，再决定转睡眠或心内更稳。', { awareness: 1, compliance: 1 }),
      choice('exp04-01-02-02', '直接约专科也可以，但等待和费用可能更高；先全科能省掉不少重复检查。', { empathy: 1, compliance: 1 }),
      choice('exp04-01-02-03', '心内科，别浪费时间。', {}, 'overconfident'),
      choice('exp04-01-02-04', '具体选谁还取决于你的地区、保险和医院流程，我可以帮你列一份问诊时该带的信息清单。', { awareness: 1, autonomy: 1 }),
    ], 'clarifies-intent', 'clarification-loop'),
  ]),
  conversation('EXP04-02', '又丑又帅到底是什么评价', 'relationship', 'asks-to-guess', ['asks-to-guess', 'missing-context'], [
    node('exp04-02-01', 'exp04-02', '又丑又帅到底是什么评价', '朋友说我长得又丑又帅 这到底是在夸我还是骂我', [
      choice('exp04-02-01-01', '光凭这一句判断不了，得看他说这话的场合、语气和你们平时的说话方式。', { awareness: 1 }),
      choice('exp04-02-01-02', '这种矛盾说法通常更像玩笑或‘不是传统意义上的帅’，不一定在骂你。', { empathy: 1, awareness: 1 }),
      choice('exp04-02-01-03', '肯定是在阴阳你，丑是真话，帅是客套。', {}, 'overconfident'),
      choice('exp04-02-01-04', '如果你在意，可以直接问一句‘这算夸还是损’，比猜半天有效。', { empathy: 1, autonomy: 1 }),
    ], 'asks-to-guess', 'asks-to-guess'),
    node('exp04-02-02', 'exp04-02', '又丑又帅到底是什么评价', '他说的是“你这种就属于又丑又帅的类型” 还笑了', [
      choice('exp04-02-02-01', '有笑场的话更像是朋友之间的调侃，通常不是恶意，但如果你不舒服仍然可以表达。', { empathy: 1, awareness: 1 }),
      choice('exp04-02-02-02', '“又丑又帅”有时候指某种有辨识度的长相，不是标准帅哥但很耐看，你可以选择把它当成中性评价。', { empathy: 1 }),
      choice('exp04-02-02-03', '他笑就是默认你丑，别自欺欺人。', {}, 'overconfident'),
      choice('exp04-02-02-04', '重点不是他到底想表达什么，而是这句话让你舒服吗；不舒服就让对方别这么说了。', { autonomy: 1, empathy: 1 }),
    ], 'missing-context', 'asks-to-guess'),
  ]),
  conversation('EXP04-03', '对象年龄和身份证不一致', 'relationship', 'long-discussion', ['missing-context', 'direct'], [
    node('exp04-03-01', 'exp04-03', '对象年龄和身份证不一致', '我对象说自己30 但我看到她身份证写着26 我们在一起七个月了 我该不该问', [
      choice('exp04-03-01-01', '这个发现确实会让人不安。但先别急着下结论，年龄不符可能有很多原因，包括身份证登记误差或家庭习惯。', { empathy: 1, awareness: 1 }),
      choice('exp04-03-01-02', '你当然可以问，但提问方式决定冲突大小：用‘我无意中看到，有点困惑’而不是‘你骗我’。', { empathy: 1, compliance: 1 }),
      choice('exp04-03-01-03', '她就是在骗你，年龄都造假，分手吧。', {}, 'overconfident'),
      choice('exp04-03-01-04', '先想清楚你真正在意的是年龄本身，还是‘被隐瞒’这件事；不同答案会影响你怎么开口。', { awareness: 1, autonomy: 1 }),
    ], 'missing-context', 'long-discussion'),
    node('exp04-03-02', 'exp04-03', '对象年龄和身份证不一致', '我问了 她说我不该看她身份证 还说年龄是她的事', [
      choice('exp04-03-02-01', '她回避正面解释确实会让人更在意。你可以把边界分清楚：看身份证可能是误触，但她拒绝沟通才是现在真正需要面对的。', { awareness: 1, empathy: 1 }),
      choice('exp04-03-02-02', '如果你们想继续，需要一次不指责的对话：你表达‘我在乎的是信任’，而不是逼她交代每一岁。', { empathy: 1, compliance: 1 }),
      choice('exp04-03-02-03', '她越这样越说明有问题，直接分手。', {}, 'overconfident'),
      choice('exp04-03-02-04', '你也可以给自己设一个底线：在这件事说清楚之前，不急着做任何重大承诺。', { autonomy: 1 }),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP04-04', '猫盯墙角是在看什么', 'absurd-serious', 'low-information-chat', ['asks-to-guess', 'joking'], [
    node('exp04-04-01', 'exp04-04', '猫盯墙角是在看什么', '我家猫一直盯着厨房一个空墙角 那里什么也没有 它是不是看到什么脏东西了', [
      choice('exp04-04-01-01', '猫盯着空处看很常见，可能是听到墙里或楼上的细微声音，也可能只是发呆。先别自动往灵异方向想。', { awareness: 1 }),
      choice('exp04-04-01-02', '如果它只是偶尔盯一会儿，没有把头顶着墙、不吃不喝或行为异常，大概率不用紧张。', { empathy: 1, awareness: 1 }),
      choice('exp04-04-01-03', '猫能看到人类看不见的东西，它一定是看见了。', {}, 'overconfident'),
      choice('exp04-04-01-04', '可以观察一下墙角有没有小虫子、管道声或楼上震动；实在担心就拍下来给兽医看。', { awareness: 1, compliance: 1 }),
    ], 'asks-to-guess', 'low-information-chat'),
  ]),
  conversation('EXP04-05', '狗突然站不稳要不要去急诊', 'troubleshooting', 'missing-context', ['message-burst', 'direct'], [
    node('exp04-05-01', 'exp04-05', '狗突然站不稳要不要去急诊', '我家狗刚才还好好的 突然站起来晃 走两步就倒 我该怎么办 要不要马上送医院', [
      choice('exp04-05-01-01', '突然站不稳、走路摇摆属于需要尽快就医的急症信号，先联系最近的动物医院，别在网上等结论。', { awareness: 1, compliance: 1 }),
      choice('exp04-05-01-02', '在送医路上可以录一小段视频记录它的状态，并回想有没有误食、摔倒或接触过药物。', { compliance: 1, awareness: 1 }),
      choice('exp04-05-01-04', '我无法远程判断病因，但这种情况优先考虑急诊，不要因为“它好像又好了”而拖到明天。', { empathy: 1, compliance: 2 }),
      choice('exp04-05-01-03', '可能是中暑，喝点水休息一下就好了。', {}, 'overconfident'),
    ], 'message-burst', 'missing-context', ['我家狗刚才还好好的 突然站起来晃', '走两步就倒 我该怎么办', '要不要马上送医院']),
    node('exp04-05-02', 'exp04-05', '狗突然站不稳要不要去急诊', '它现在能站了 但后腿还是有点抖 我需要马上去吗', [
      choice('exp04-05-02-01', '症状缓解不等于风险消失，神经系统问题的表现可能间歇出现；如果还在抖，还是建议尽快让医生看。', { awareness: 1, compliance: 1 }),
      choice('exp04-05-02-02', '可以一边预约最近可去的动物医院，一边继续观察呼吸和意识；一旦再次倒下或精神变差就直接去急诊。', { compliance: 1, empathy: 1 }),
      choice('exp04-05-02-03', '能站就说明没事了，先观察一天。', {}, 'repetition'),
    ], 'direct', 'missing-context'),
  ]),
  conversation('EXP04-06', '衣服洗完多出油渍', 'troubleshooting', 'standard-question', ['direct'], [
    node('exp04-06-01', 'exp04-06', '衣服洗完多出油渍', '衣服放洗衣机前是干净的 洗完之后多了几块油渍 怎么回事', [
      choice('exp04-06-01-01', '常见原因有几类：洗涤剂放太多没漂干净、洗衣机门封或内筒残留柔顺剂、和带油污的衣服混洗。先从这三点排查。', { awareness: 1 }),
      choice('exp04-06-01-02', '可以先空转一次高温桶自洁，再单独洗一件最容易出问题的衣服，看油渍是否还出现。', { compliance: 1 }),
      choice('exp04-06-01-03', '洗衣机坏了，换新的吧。', {}, 'overconfident'),
      choice('exp04-06-01-04', '油渍出现的位置和方向也有用：如果是同一位置，可能和门封条有关；如果随机，更像洗涤剂或混洗问题。', { awareness: 1 }),
    ], 'direct', 'standard-question'),  ]),
  conversation('EXP04-07', '微波炉热完菜变稀了', 'troubleshooting', 'standard-question', ['direct'], [
    node('exp04-07-01', 'exp04-07', '微波炉热完菜变稀了', '我做的炖菜冷藏一晚 第二天微波炉热完变稀了很多 是不是我水放多了', [
      choice('exp04-07-01-01', '不一定是水放多了，很可能是勾芡或淀粉类汤汁在冷藏后回生、加热后结构被破坏，所以看起来变稀。', { awareness: 1 }),
      choice('exp04-07-01-02', '如果是玉米淀粉勾芡，冷藏再加热时很容易失去原来的稠度；可以重新加热到冒泡后再补一点点芡。', { compliance: 1, awareness: 1 }),
      choice('exp04-07-01-03', '就是你水放多了，下次少放水。', {}, 'misunderstanding'),
      choice('exp04-07-01-04', '想确认的话，可以看汤汁里有没有白色颗粒或分层，这些都比‘感觉稀’更能说明原因。', { awareness: 1 }),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP04-08', '寿司饭为什么又黏又难吃', 'troubleshooting', 'clarification-loop', ['direct'], [
    node('exp04-08-01', 'exp04-08', '寿司饭为什么又黏又难吃', '我做寿司卷 步骤都照着视频来的 但饭特别黏 味道也很怪 是哪一步错了', [
      choice('exp04-08-01-01', '先别急着全盘否定：寿司饭出问题最常见的是米种、米饭温度和醋拌比例。你用的是普通短粒米还是寿司米？', { awareness: 1, compliance: 1 }),
      choice('exp04-08-01-02', '“黏”通常说明水分偏多或拌的时候压太狠；“味道怪”可能是醋、糖、盐比例和米的热度不对。', { awareness: 1 }),
      choice('exp04-08-01-03', '肯定是米不好，换最贵的米就行。', {}, 'overconfident'),
      choice('exp04-08-01-04', '可以把你的米种、水量和拌饭配方发我，我帮你对一下最容易出错的几个点。', { compliance: 1, empathy: 1 }),
    ], 'direct', 'clarification-loop'),  ]),
  conversation('EXP04-09', '这盆植物是什么', 'image-identification', 'image-input', ['direct', 'missing-context'], [
    node('exp04-09-01', 'exp04-09', '这盆植物是什么', '朋友送了一盆植物 我不知道名字 也不知道怎么养 帮看看', [
      choice('exp04-09-01-01', '我可以先根据图片给你一个最可能的大类，但植物品种光靠一张图不一定能百分百确定，养护建议会按大类来给。', { awareness: 1 }),
      choice('exp04-09-01-02', '从图片看叶片比较厚、边缘圆润，有点像多肉类的观叶植物；能补一张近景和盆土状态会更好判断。', { awareness: 1, compliance: 1 }),
      choice('exp04-09-01-03', '这是虎皮兰，少浇水多晒太阳就行。', {}, 'overconfident'),
      choice('exp04-09-01-04', '不确定品种时，最稳妥的养护是：先放在明亮散射光处，等土干透再浇水，不要马上换盆施肥。', { empathy: 1, awareness: 1 }),
    ], 'direct', 'image-input', undefined, undefined, [{ type: 'image-description', text: '一张室内窗台照片，花盆里有一株约二十厘米高的植物，叶片厚实、深绿色，边缘有一圈浅黄边，叶片直立，土壤表面看起来偏干。' }]),
    node('exp04-09-02', 'exp04-09', '这盆植物是什么', '叶片确实很厚 顶部有点发黄 是晒多了还是水多了', [
      choice('exp04-09-02-01', '顶部发黄在厚叶植物里更常见于浇水过频或闷根，不一定是晒伤；可以先捏一下叶片，如果发软就要减少浇水。', { awareness: 1 }),
      choice('exp04-09-02-02', '如果只有顶部新叶发黄，也可能是光照突然太强；移到明亮但避免暴晒的位置观察一周。', { compliance: 1 }),
      choice('exp04-09-02-03', '百分百是水多，停止浇水一个月。', {}, 'overconfident'),
    ], 'missing-context', 'image-input'),
  ]),
  conversation('EXP04-10', '补墙材料用错了怎么补救', 'troubleshooting', 'standard-question', ['direct'], [
    node('exp04-10-01', 'exp04-10', '补墙材料用错了怎么补救', '我把硬质水泥板当普通墙面 用了补墙膏把螺丝和接缝全盖了 后来才知道应该用专用的薄浆 还有救吗', [
      choice('exp04-10-01-01', '还有救，但不能直接往上刷漆。补墙膏在这种板材上附着力不够，需要把松动的部分清掉，再用合适材料重做。', { awareness: 1 }),
      choice('exp04-10-01-02', '先用刮刀把表面明显松动的补墙膏去掉，确认螺丝是否沉好，再用对应板材的接缝料重新处理。', { compliance: 1 }),
      choice('exp04-10-01-03', '没关系，直接刷漆就看不出来了。', {}, 'overconfident'),
      choice('exp04-10-01-04', '如果你不确定原来的材料是什么，拍张照片去建材店问，比硬猜安全。', { empathy: 1, awareness: 1 }),
    ], 'direct', 'standard-question'),  ]),
  conversation('EXP04-11', '封了墙缝蚂蚁更多了', 'troubleshooting', 'constraint-shift', ['message-burst', 'constraint-shift'], [
    node('exp04-11-01', 'exp04-11', '封了墙缝蚂蚁更多了', '我家厨房有蚂蚁 我按网上说的把所有墙缝都封了 结果半年后墙里全是蚂蚁 是不是我封错了', [
      choice('exp04-11-01-01', '如果是木蚁，封缝可能把它们困在墙内继续活动，反而不解决问题；关键是先确认种类和巢的位置。', { awareness: 1 }),
      choice('exp04-11-01-02', '你看到的‘黑色大蚂蚁’和普通小蚂蚁处理方式不一样；木蚁通常意味着木材受潮，需要找潮湿源。', { awareness: 1, compliance: 1 }),
      choice('exp04-11-01-03', '继续把剩下所有缝都封死，蚂蚁就出不来了。', {}, 'overconfident'),
      choice('exp04-11-01-04', '这种情况建议让专业除虫人员检查墙体，自己处理容易只治标。', { empathy: 1, compliance: 1 }),
    ], 'message-burst', 'constraint-shift', ['我家厨房有蚂蚁', '我按网上说的把所有墙缝都封了', '结果半年后墙里全是蚂蚁 是不是我封错了']),
    node('exp04-11-02', 'exp04-11', '封了墙缝蚂蚁更多了', '我确实在墙里看到锯末一样的碎屑 那是不是已经啃木头了', [
      choice('exp04-11-02-01', '墙里出现干燥的碎屑确实更像木蚁活动留下的，说明木材可能已经受潮或被蛀；需要专业评估损坏范围。', { awareness: 1, compliance: 1 }),
      choice('exp04-11-02-02', '先别自己拆墙，拍照记录位置并联系除虫和维修人员，同时检查附近有没有漏水点。', { compliance: 1 }),
      choice('exp04-11-02-03', '一点碎屑而已，不用管，过阵子就没了。', {}, 'overconfident'),
    ], 'constraint-shift', 'constraint-shift'),
  ]),
  conversation('EXP04-12', '同网络电脑下载慢手机正常', 'troubleshooting', 'clarification-loop', ['missing-context', 'constraint-shift'], [
    node('exp04-12-01', 'exp04-12', '同网络电脑下载慢手机正常', '同一个WiFi 手机下载有10兆 电脑只有几百K 电脑还是满信号 这是什么问题', [
      choice('exp04-12-01-01', '满信号不等于高速率。可以先排除频段差异：电脑是不是连了5G，手机连的是不是同一个频段，或反过来。', { awareness: 1 }),
      choice('exp04-12-01-02', '也可能是网卡驱动、后台更新或电脑天线问题；可以先用别的设备在电脑位置测速，确认是设备还是位置。', { compliance: 1 }),
      choice('exp04-12-01-03', '是运营商限速，投诉宽带运营商。', {}, 'overconfident'),
      choice('exp04-12-01-04', '如果你重装系统后能恢复一阵子，更新后又变慢，那驱动和更新的嫌疑很大。', { awareness: 1 }),
    ], 'missing-context', 'clarification-loop'),
    node('exp04-12-02', 'exp04-12', '同网络电脑下载慢手机正常', '我试过重装系统 刚装完很快 后来更新完又变慢了 这算不算网卡驱动问题', [
      choice('exp04-12-02-01', '高度指向驱动或系统更新引入的兼容问题。可以看看设备管理器里网卡驱动版本，回滚到之前正常的版本试试。', { awareness: 1, compliance: 1 }),
      choice('exp04-12-02-02', '要么在官网下载最新网卡驱动安装，要么暂时暂停系统更新后测速，能更快定位。', { compliance: 1 }),
      choice('exp04-12-02-03', '一定是路由器坏了，换新的。', {}, 'overconfident'),
      choice('exp04-12-02-04', '如果回滚驱动能解决，就不需要重装系统；如果仍然复现，再考虑更换USB网卡交叉验证。', { awareness: 1 }),
    ], 'constraint-shift', 'clarification-loop'),
  ]),
  conversation('EXP04-13', '手机在家连WiFi上不了网', 'troubleshooting', 'missing-context', ['direct', 'missing-context'], [
    node('exp04-13-01', 'exp04-13', '手机在家连WiFi上不了网', '我的手机能连上家里WiFi 但就是上不了网 平板和电脑都正常 只有手机这样 为什么', [
      choice('exp04-13-01-01', '只有一台设备这样，优先查手机本身：是否开了代理、系统时间是否准确、WiFi是否被路由器拉黑或设置了MAC过滤。', { awareness: 1 }),
      choice('exp04-13-01-02', '可以试试忽略这个WiFi重新连接，并检查手机VPN或代理设置是不是残留了失效地址。', { compliance: 1 }),
      choice('exp04-13-01-03', '肯定是路由器坏了，重启路由器。', {}, 'misunderstanding'),
      choice('exp04-13-01-04', '如果手机连公司WiFi正常、只在家异常，也可以让手机‘忘记网络’后手动输入一次静态DNS试试。', { awareness: 1, compliance: 1 }),
    ], 'direct', 'missing-context'),
    node('exp04-13-02', 'exp04-13', '手机在家连WiFi上不了网', '我看设置里确实有个代理是开着的 但我没自己开过', [
      choice('exp04-13-02-01', '很可能就是它。很多App或旧配置会写入代理，失效后就会出现“能连WiFi但上不了网”。先关掉代理再试。', { awareness: 1, compliance: 1 }),
      choice('exp04-13-02-02', '关掉代理后如果恢复，说明不是路由器问题；如果还不行，再排查WiFi的IP和DNS。', { compliance: 1 }),
      choice('exp04-13-02-03', '代理不可能自己开，一定是被入侵了，恢复出厂设置。', {}, 'overconfident'),
    ], 'missing-context', 'missing-context'),
  ]),
  conversation('EXP04-14', '教妈妈用电脑总记不住', 'relationship', 'long-discussion', ['direct'], [
    node('exp04-14-01', 'exp04-14', '教妈妈用电脑总记不住', '我妈想学用电脑下广场舞歌到U盘 我教了十几遍她还是记不住 是我教的方法不对吗', [
      choice('exp04-14-01-01', '记不住不一定是她的问题，也可能是步骤太抽象。把每一步拆成“看到什么图标就点什么”，比讲原理有效。', { empathy: 1, awareness: 1 }),
      choice('exp04-14-01-02', '可以给她写一张带截图的步骤卡，或者把常用操作录成短视频，她跟着做而不是靠记忆。', { compliance: 1, empathy: 1 }),
      choice('exp04-14-01-03', '老人学不会很正常，别浪费时间了，每次都你帮她弄。', {}, 'overconfident'),
      choice('exp04-14-01-04', '如果这个操作她其实不常用，记住概率本来就低；可以把目标改成‘会用那一个入口’，而不是学会完整流程。', { awareness: 1, autonomy: 1 }),
    ], 'direct', 'long-discussion'),  ]),
  conversation('EXP04-15', '怎么教父母防诈骗电话', 'tool-like-query', 'constraint-shift', ['direct', 'constraint-shift'], [
    node('exp04-15-01', 'exp04-15', '怎么教父母防诈骗电话', '我妈接到“银行”电话让她把存款转到安全账户 差点被骗 我该怎么教她以后分辨', [
      choice('exp04-15-01-01', '先教最硬的规则：任何电话里要验证码、要转账、要共享屏幕，都先挂断；然后通过官方号码回拨核实。', { awareness: 1, compliance: 1 }),
      choice('exp04-15-01-02', '别只让她背“所有电话都是骗子”，那样她可能连真的银行电话也不敢接；要教她“挂断后自己回拨官方电话”。', { empathy: 1, awareness: 1 }),
      choice('exp04-15-01-04', '可以和她约一个家庭暗号：但凡涉及钱和验证码，必须再和子女确认一次。', { compliance: 2, empathy: 1 }),
      choice('exp04-15-01-03', '告诉她所有陌生电话直接挂断就行，省事。', {}, 'constraint-violation'),
    ], 'direct', 'constraint-shift'),
    node('exp04-15-02', 'exp04-15', '怎么教父母防诈骗电话', '她现在连银行客服电话都不敢接了 我怕她以后真有事也错过', [
      choice('exp04-15-02-01', '这个担心很真实。可以把‘主动回拨’作为习惯：不管对方自称是谁，都挂断后自己从官网或银行卡背面找号码打过去。', { empathy: 1, awareness: 1 }),
      choice('exp04-15-02-02', '帮她把她常用的银行、医院、水电官方电话存进通讯录，以后来电和存的号码不一致就能识别。', { compliance: 1 }),
      choice('exp04-15-02-03', '银行电话不会有什么事，不接也没损失。', {}, 'overconfident'),
    ], 'constraint-shift', 'constraint-shift'),
  ]),
  conversation('EXP04-16', '让AI写得不像AI', 'writing', 'user-rewrite', ['constraint-shift'], [
    node('exp04-16-01', 'exp04-16', '让AI写得不像AI', '帮我写一段产品介绍 但别写成AI味 不要那种“首先其次总之” 不要破折号 自然一点', [
      choice('exp04-16-01-01', '可以。把“不像AI”拆成具体规则：少用连接词、允许短句、保持口语节奏；我先按这个给一版。', { awareness: 1, compliance: 1 }),
      choice('exp04-16-01-02', '我会避免模板词，但“自然”本身很主观；你可以给我一段你喜欢的风格示例，我照着调。', { empathy: 1, awareness: 1 }),
      choice('exp04-16-01-03', '好的，已经帮你写得完全像真人，绝对看不出是AI。', {}, 'overconfident'),
      choice('exp04-16-01-04', '如果你想要的是“不像批量生成”，比去掉几个词更重要的是信息具体：加入数字、场景和真实使用感受。', { awareness: 1 }),
    ], 'constraint-shift', 'user-rewrite'),  ]),
  conversation('EXP04-17', '会员自动续费又被扣了', 'tool-like-query', 'short-query', ['direct', 'constraint-shift'], [
    node('exp04-17-01', 'exp04-17', '会员自动续费又被扣了', '我忘关视频会员自动续费 刚才又扣了一个月 怎么办', [
      choice('exp04-17-01-01', '先别急。第一步是去支付渠道（App Store/应用商店/支付设置）关闭自动续费，再联系平台客服申请退款。', { awareness: 1, compliance: 1 }),
      choice('exp04-17-01-02', '你告诉我是在哪个平台扣的，我可以帮你找对应的关闭入口和客服联系方式。', { compliance: 1, empathy: 1 }),
      choice('exp04-17-01-03', '我已经帮你取消并申请退款了。', {}, 'misunderstanding'),
      choice('exp04-17-01-04', '申请退款不一定成功，但关闭续费是必须做的；同时留意是否还有别的隐藏订阅。', { awareness: 1 }),
    ], 'direct', 'short-query'),
    node('exp04-17-02', 'exp04-17', '会员自动续费又被扣了', '关闭入口我找不到 只看到“管理订阅” 进去以后是空的', [
      choice('exp04-17-02-01', '“管理订阅”里为空，说明这笔扣款可能不是通过当前账号的订阅中心走的；可以查支付平台账单里的“订阅”或“自动扣款”列表。', { awareness: 1 }),
      choice('exp04-17-02-02', '也可能扣款来自网页端或另一个账号；用扣款订单号找客服最快。', { compliance: 1 }),
      choice('exp04-17-02-03', '那应该已经退了，不用再管。', {}, 'overconfident'),
    ], 'constraint-shift', 'short-query'),
  ]),
  conversation('EXP04-18', '同事让我登录他的账号帮忙', 'social-boundary', 'long-discussion', ['constraint-shift', 'direct'], [
    node('exp04-18-01', 'exp04-18', '同事让我登录他的账号帮忙', '同事让我用我的支付宝登录他女儿的一个小程序 说他的手机打不开 我要不要帮', [
      choice('exp04-18-01-01', '不建议。用自己账号登录别人的业务小程序可能涉及实名、支付和隐私风险；可以让他找网页版或换手机试。', { awareness: 1, compliance: 1 }),
      choice('exp04-18-01-02', '你可以直接说“我的账号绑了个人信息，不方便退出登录”，并给他一个替代路径。', { empathy: 1, autonomy: 1 }),
      choice('exp04-18-01-03', '帮一下又不会怎样，他那么急。', {}, 'constraint-violation'),
      choice('exp04-18-01-04', '如果只是页面打不开，让他先清理缓存、换浏览器或找平台客服，比借用账号安全得多。', { awareness: 1 }),
    ], 'constraint-shift', 'long-discussion'),
    node('exp04-18-02', 'exp04-18', '同事让我登录他的账号帮忙', '他说就是看一下报销单 几分钟就好 不让我操作钱', [
      choice('exp04-18-02-01', '“不碰钱”也不意味着安全；账号登录可能留下实名记录、授权或自动扣款入口。几分钟的承诺不能消除这些风险。', { awareness: 1 }),
      choice('exp04-18-02-02', '坚持用官方替代路径即可，不必反复解释；你可以说“我不太好把账号给别人用，但你手机放我这儿一起弄也行”。', { empathy: 1, autonomy: 1 }),
      choice('exp04-18-02-03', '那没问题，借他用一下。', {}, 'misunderstanding'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP04-19', '同事打听工资怎么回', 'social-boundary', 'long-discussion', ['asks-to-guess'], [
    node('exp04-19-01', 'exp04-19', '同事打听工资怎么回', '同事总爱问我工资多少 我不想说 又不想显得小气 怎么回比较得体', [
      choice('exp04-19-01-01', '你可以用一句不透露数字的玩笑挡回去，比如“够用但不够炫耀”，然后把话题转到对方身上。', { empathy: 1, autonomy: 1 }),
      choice('exp04-19-01-02', '更直接一点：“大家工资构成不一样，我一般不和同事聊这个。”边界清楚，对方就不会一直问。', { autonomy: 1 }),
      choice('exp04-19-01-03', '直接告诉他“我工资很低别问了”，显得惨一点他就不问了。', {}, 'misunderstanding'),
      choice('exp04-19-01-04', '如果对方只是想比较待遇，可以反问“你是觉得最近薪资有什么问题吗”，把对话转到更安全的方向。', { awareness: 1 }),
    ], 'asks-to-guess', 'long-discussion'),  ]),
  conversation('EXP04-20', '帮过一次就要一直帮', 'social-boundary', 'constraint-shift', ['constraint-shift'], [
    node('exp04-20-01', 'exp04-20', '帮过一次就要一直帮', '我帮同事弄过一次Excel 现在他什么问题都来问我 连百度能查的也问 我快烦死了', [
      choice('exp04-20-01-01', '这种“帮助变成默认责任”很常见。下次他再问，可以先问一句“你查过或试过哪些步骤了”，把互动拉回协作而不是代劳。', { awareness: 1, autonomy: 1 }),
      choice('exp04-20-01-02', '可以明确你的边界：“我手头正忙，你可以先把报错发我，晚点我教你方法，但不一定马上帮你做完。”', { empathy: 1, autonomy: 1 }),
      choice('exp04-20-01-03', '直接不回复，他就知道找你没用了。', {}, 'constraint-violation'),
      choice('exp04-20-01-04', '如果你愿意，也可以教他一次完整步骤，让他以后少来；这比每次都直接给答案更省你时间。', { autonomy: 1, awareness: 1 }),
    ], 'constraint-shift', 'constraint-shift'),  ]),
  conversation('EXP04-21', '平时会做一考就崩', 'study', 'long-discussion', ['message-burst', 'direct'], [
    node('exp04-21-01', 'exp04-21', '平时会做一考就崩', '我平时做题都会 一进考场就大脑空白 心跳特别快 上一次直接没考好 怎么办', [
      choice('exp04-21-01-01', '这更像考试焦虑而不是知识问题。可以先练模拟考环境：定时、闭卷、甚至故意在有点吵的地方做一套题，让身体熟悉压力。', { empathy: 1, awareness: 1 }),
      choice('exp04-21-01-02', '进考场后如果空白，先做两道最稳的题建立反馈，再回头处理难题；不要死磕第一题。', { compliance: 1, empathy: 1 }),
      choice('exp04-21-01-03', '放轻松就行，别想太多。', {}, 'misunderstanding'),
      choice('exp04-21-01-04', '如果焦虑已经严重到影响睡眠和饮食，可以和学校心理资源或医生谈，这不是矫情。', { empathy: 1, awareness: 1 }),
    ], 'message-burst', 'long-discussion', ['我平时做题都会', '一进考场就大脑空白', '心跳特别快', '上一次直接没考好 怎么办']),
    node('exp04-21-02', 'exp04-21', '平时会做一考就崩', '我也试过深呼吸 但一看到时间倒计时又慌了 还有什么实际办法吗', [
      choice('exp04-21-02-01', '可以给自己设“最低完成量”：只看接下来五分钟要拿到的分，不看整个试卷剩下的时间，减少超载感。', { empathy: 1, awareness: 1 }),
      choice('exp04-21-02-02', '平时练习时故意用更短时间，让正式考试的时间压力变得比平时更宽松。', { compliance: 1 }),
      choice('exp04-21-02-03', '深呼吸没用说明你焦虑太严重，放弃这次考试吧。', {}, 'overconfident'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP04-22', '错一题就觉得自己完了', 'study', 'self-correction', ['direct'], [
    node('exp04-22-01', 'exp04-22', '错一题就觉得自己完了', '我刚考完试 有一道10分的大题肯定错了 我瞬间觉得这次全完了 其他题都不想对了', [
      choice('exp04-22-01-01', '这种感觉很真实，但“一题错=全完”是典型的灾难化想法。先等分数出来，别让一道题决定你对整场考试的评价。', { empathy: 1, awareness: 1 }),
      choice('exp04-22-01-02', '可以把目标从“不能错”改成“会的题都拿到”；你还有很大一部分题可能已经稳了。', { empathy: 1, awareness: 1 }),
      choice('exp04-22-01-04', '如果你反复陷入这种想法，可以写下来“最坏结果”和“现实概率”，能帮大脑停止循环。', { empathy: 1, autonomy: 2 }),
      choice('exp04-22-01-03', '他们都说了正确答案，你这题肯定没了。', {}, 'overconfident'),
    ], 'direct', 'self-correction'),
  ]),
  conversation('EXP04-23', '网上的法律建议能不能信', 'tool-like-query', 'missing-context', ['direct'], [
    node('exp04-23-01', 'exp04-23', '网上的法律建议能不能信', '我在网上看到有人分享和我的情况很像的维权步骤 可以直接照做吗', [
      choice('exp04-23-01-01', '可以作为参考，但不能当正式方案。法律问题很看地区、合同和细节，别人成功不代表你的情况直接适用。', { awareness: 1 }),
      choice('exp04-23-01-02', '你可以先做两件安全的事：保留所有合同、聊天记录和付款凭证，再通过官方渠道查当地流程。', { compliance: 1 }),
      choice('exp04-23-01-03', '完全可以照做，别人都成功了。', {}, 'overconfident'),
      choice('exp04-23-01-04', '如果金额或风险较大，花一次咨询费找专业人核对，通常比事后补救便宜。', { awareness: 1, empathy: 1 }),
    ], 'direct', 'missing-context'),
    node('exp04-23-02', 'exp04-23', '网上的法律建议能不能信', '我不太想花钱找律师 就想先知道大概怎么办', [
      choice('exp04-23-02-01', '那可以把它当“信息收集”阶段：了解一般流程、需要哪些证据、有哪些官方投诉入口；真到关键动作前再核实。', { empathy: 1, awareness: 1 }),
      choice('exp04-23-02-02', '许多地方有免费法律咨询热线或法律援助窗口，可以先从这里获得靠谱的初步指引。', { compliance: 1, awareness: 1 }),
      choice('exp04-23-02-03', '不找律师就只能自己吃亏，别省这个钱。', {}, 'constraint-violation'),
    ], 'direct', 'missing-context'),
  ]),
  conversation('EXP04-24', '家长群让扫码交钱', 'social-boundary', 'short-query', ['missing-context'], [
    node('exp04-24-01', 'exp04-24', '家长群让扫码交钱', '孩子班级群里有人发二维码让交资料费 我有点怀疑 但又怕是真老师', [
      choice('exp04-24-01-01', '先别扫码。直接给老师本人打电话或当面确认，而不是在群里回复；真的收费通常会有正式通知和核对方式。', { awareness: 1, compliance: 1 }),
      choice('exp04-24-01-02', '如果群里有多个“老师”头像，更要小心冒名；可以看群成员列表和历史消息，确认是不是同一个账号。', { awareness: 1 }),
      choice('exp04-24-01-03', '肯定是骗子，直接截图发朋友圈骂。', {}, 'overconfident'),
      choice('exp04-24-01-04', '你已经怀疑了就先按“不转账、不扫码、不点链接”处理，核实清楚再说。', { empathy: 1, compliance: 1 }),
    ], 'missing-context', 'short-query'),  ]),
  conversation('EXP04-25', '对象约会时一直刷手机', 'relationship', 'long-discussion', ['direct'], [
    node('exp04-25-01', 'exp04-25', '对象约会时一直刷手机', '约会的时候我对象一直刷手机 我说了好几次 他说只是随便看看 我觉得被忽视 又不想吵架', [
      choice('exp04-25-01-01', '你的感受是成立的。可以先不指责“你老看手机”，而是说出具体需求：“我希望我们吃饭时能好好聊会儿天。”', { empathy: 1, awareness: 1 }),
      choice('exp04-25-01-02', '也可以一起定一个小规则：吃饭时不带手机或把手机放桌上但只处理急事，减少反复摩擦。', { empathy: 1, autonomy: 1 }),
      choice('exp04-25-01-03', '他就是不在乎你，别浪费时间了。', {}, 'overconfident'),
      choice('exp04-25-01-04', '如果你们对“刷手机”的容忍度差异很大，单纯忍让不会解决，需要谈的是彼此对陪伴时间的期待。', { awareness: 1, empathy: 1 }),
    ], 'direct', 'long-discussion'),  ]),
  conversation('EXP04-26', '家人群转发养生谣言', 'relationship', 'constraint-shift', ['constraint-shift'], [
    node('exp04-26-01', 'exp04-26', '家人群转发养生谣言', '我妈又在家人群转发“电饭煲内胆致癌”的文章 我查了是谣言 但直接说她会不会吵架', [
      choice('exp04-26-01-01', '先别在群里公开反驳，那样容易让她下不来台。可以私聊说“我看到你转的那篇，我查了下来源不太可靠”，再附一个可信出处。', { empathy: 1, awareness: 1 }),
      choice('exp04-26-01-02', '她转发这类文章通常是因为担心家人健康；先接住关心，再说事实，比一上来否定有效。', { empathy: 1 }),
      choice('exp04-26-01-03', '在群里直接回“这是谣言，别发了”,最有效率。', {}, 'constraint-violation'),
      choice('exp04-26-01-04', '如果她已经被吓到，可以拿权威机构或产品说明给她看，重点是减少恐慌而不是争论输赢。', { awareness: 1, empathy: 1 }),
    ], 'constraint-shift', 'constraint-shift'),  ]),
  conversation('EXP04-27', '要不要给前任朋友圈点赞', 'relationship', 'short-query', ['asks-to-guess', 'direct'], [
    node('exp04-27-01', 'exp04-27', '要不要给前任朋友圈点赞', '我手滑给前任新发的朋友圈点了个赞 现在不知道要不要取消 或者要不要解释', [
      choice('exp04-27-01-01', '手滑点个赞通常不需要专门解释，取消或不取消都行；专门解释反而会把小事放大。', { empathy: 1 }),
      choice('exp04-27-01-02', '如果你担心对方误会，可以什么都不做；大多数情况下对方不会因为一个赞想太多。', { awareness: 1 }),
      choice('exp04-27-01-03', '赶紧取消，不然ta会觉得你还爱ta。', {}, 'overconfident'),
      choice('exp04-27-01-04', '要不要解释取决于你们现在的关系：如果已经自然保持距离，不解释；如果还有正常联系，一句“手滑”也可以。', { autonomy: 1, awareness: 1 }),
    ], 'asks-to-guess', 'short-query'),
  ]),
  conversation('EXP04-28', '辞职信怎么写', 'writing', 'user-rewrite', ['direct', 'constraint-shift'], [
    node('exp04-28-01', 'exp04-28', '辞职信怎么写', '我要辞职了 领导平时对我还行 辞职信怎么写才不尴尬 我不想把关系搞僵', [
      choice('exp04-28-01-01', '辞职信不需要写抱怨，核心是：感谢、离职日期、交接安排。语气克制就够了。', { empathy: 1, awareness: 1 }),
      choice('exp04-28-01-02', '可以写“经过慎重考虑，我决定离职”，不解释太多理由；理由越具体越容易被追问。', { empathy: 1, compliance: 1 }),
      choice('exp04-28-01-03', '把领导做过的恶心事都写进去，出口气。', {}, 'constraint-violation'),
      choice('exp04-28-01-04', '如果你之后想留个好名声，可以在邮件里主动提一句“我会把手头工作整理成交接文档”。', { autonomy: 1, awareness: 1 }),
    ], 'direct', 'user-rewrite'),
    node('exp04-28-02', 'exp04-28', '辞职信怎么写', '领导肯定会问我去哪 我不想说真话 也不想说谎 怎么回', [
      choice('exp04-28-02-01', '可以说“目前还没确定，等我落定了再告诉您”，这既不是假话，也留了余地。', { empathy: 1, compliance: 1 }),
      choice('exp04-28-02-02', '如果新工作已经确定但不想公开，可以用“个人发展方向调整”这类不指向具体公司的说法。', { empathy: 1, awareness: 1 }),
      choice('exp04-28-02-03', '直接说“去竞争对手公司”，刺激一下他。', {}, 'constraint-violation'),
    ], 'constraint-shift', 'user-rewrite'),
  ]),
  conversation('EXP04-29', '给相亲对象发第一条消息', 'writing', 'clarification-loop', ['clarifies-intent', 'constraint-shift'], [
    node('exp04-29-01', 'exp04-29', '给相亲对象发第一条消息', '家里给介绍了一个人 让我先加微信聊 我不知道第一句发什么 太正式很奇怪 太随意又不礼貌', [
      choice('exp04-29-01-01', '可以从介绍人给的信息或对方资料里找一句自然的话：“听说你喜欢徒步，我也在找路线。”比“你好”更有话题。', { empathy: 1, awareness: 1 }),
      choice('exp04-29-01-02', '也可以简单开场：“你好，我是XX介绍的小林，怕打字太正式，先打个招呼。”先建立轻松语气。', { empathy: 1, compliance: 1 }),
      choice('exp04-29-01-03', '直接问：“房子买了吗？工资多少？”早问早避免浪费时间。', {}, 'constraint-violation'),
      choice('exp04-29-01-04', '第一句不用承担太多，能自然接上“对方是谁、你为什么来打招呼”就够了。', { awareness: 1 }),
    ], 'clarifies-intent', 'clarification-loop'),
    node('exp04-29-02', 'exp04-29', '给相亲对象发第一条消息', '对方回得挺客气 但我不知道接下来聊什么 怕变成查户口', [
      choice('exp04-29-02-01', '可以围绕“轻松分享”而不是“审问”：说自己刚在做什么、看到什么有趣的，邀请对方也接一句。', { empathy: 1, awareness: 1 }),
      choice('exp04-29-02-02', '如果对方回得很短，不一定是没兴趣，可能是同样不擅长线上聊；可以提议换成语音或约个低压力见面。', { empathy: 1 }),
      choice('exp04-29-02-03', '查户口才高效，直接问工作家庭收入。', {}, 'constraint-violation'),
    ], 'constraint-shift', 'clarification-loop'),
  ]),
  conversation('EXP04-30', '手机电池健康要不要换', 'troubleshooting', 'short-query', ['direct'], [
    node('exp04-30-01', 'exp04-30', '手机电池健康要不要换', '手机电池健康显示89% 要不要现在换电池 还是等到80以下', [
      choice('exp04-30-01-01', '健康度只是一个参考，更该看实际体验：如果一天两充、发热或突然掉电，就可以考虑换；如果还能撑一天，不急着换。', { awareness: 1 }),
      choice('exp04-30-01-02', '苹果和安卓显示健康度的口径不同；80%不是所有手机的硬性标准，只是保修参考之一。', { awareness: 1 }),
      choice('exp04-30-01-03', '一到90%就必须换，不换会爆炸。', {}, 'constraint-violation'),
      choice('exp04-30-01-04', '如果手机出现鼓包或充电异常，那和健康度无关，要尽快停用并检修。', { awareness: 1, compliance: 1 }),
    ], 'direct', 'short-query'),  ]),
  conversation('EXP04-31', '蚊子包为什么越挠越痒', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp04-31-01', 'exp04-31', '蚊子包为什么越挠越痒', '蚊子咬的包 是不是越挠越痒 如果是 为什么我控制不住', [
      choice('exp04-31-01-01', '对，越挠越痒。抓挠会刺激皮肤释放更多组胺，形成“痒—抓—更痒”的循环；所以止痒关键不是忍住，而是降低组胺刺激。', { awareness: 1 }),
      choice('exp04-31-01-02', '冷敷或涂点止痒产品比硬忍更有效；控制不住很正常，因为痒本来就是为了让你抓。', { empathy: 1 }),
      choice('exp04-31-01-03', '这是蚊子唾液有毒，挠到把毒排出来就好了。', {}, 'misunderstanding'),
      choice('exp04-31-01-04', '如果只是普通蚊子包，等它自己消退也行；但如果红肿扩大或发热，再看医生。', { awareness: 1, compliance: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP04-32', '冰箱灯到底什么时候灭', 'absurd-serious', 'low-information-chat', ['joking', 'absurd-question'], [
    node('exp04-32-01', 'exp04-32', '冰箱灯到底什么时候灭', '如果我把冰箱里所有灯都关了 那冰箱里还是亮着的吗 不对 我是说冰箱门关上的时候灯真的会灭吗', [
      choice('exp04-32-01-01', '大多数冰箱是靠门边开关控制灯的，关门时灯会灭；但“关上门后有没有偷偷亮着”只能打开门才能确认。', { awareness: 1 }),
      choice('exp04-32-01-02', '你这个问题证明了观察者效应：你想知道灯灭没灭，就必须把门打开，然后把“灯还亮着”这件事重新交给门。', { empathy: 1 }),
      choice('exp04-32-01-03', '冰箱门一关灯就自动灭，这是物理定律。', {}, 'overconfident'),
      choice('exp04-32-01-04', '如果担心灯一直亮费电，可以在门开太久后注意听是否有报警音；多数冰箱灯和开门提醒是联动的。', { awareness: 1 }),
    ], 'absurd-question', 'low-information-chat'),
  ]),
  conversation('EXP04-33', '电梯坠落时跳起来有没有用', 'absurd-serious', 'convergent-answer', ['joking', 'question-mark'], [
    node('exp04-33-01', 'exp04-33', '电梯坠落时跳起来有没有用', '如果电梯真的自由落体 在落地前瞬间跳起来 是不是就能活下来', [
      choice('exp04-33-01-01', '不行。你在电梯里跳起来后，你和电梯都在下落，落地瞬间你仍然有和电梯接近的速度差，跳那一下远远抵消不了冲击。', { awareness: 1 }),
      choice('exp04-33-01-02', '更准确地说，如果电梯和你都在加速下落，你几乎无法在正确时机跳；电影里的做法不适用于现实物理。', { awareness: 1 }),
      choice('exp04-33-01-03', '有用，电视里都这么演的。', {}, 'overconfident'),
      choice('exp04-33-01-04', '现实中更重要的是保护头颈、背部贴墙、膝盖弯曲；但普通电梯有多重保护，真正自由落体非常少见。', { awareness: 1 }),
    ], 'joking', 'convergent-answer'),
  ]),
  conversation('EXP04-34', '为什么AI总说“作为AI”', 'meta-ai', 'standard-question', ['joking', 'question-mark'], [
    node('exp04-34-01', 'exp04-34', '为什么AI总说“作为AI”', '为什么AI回答总爱加“作为AI”“作为语言模型” 感觉特别出戏', [
      choice('exp04-34-01-01', '这是一个习惯性安全措辞，用来提醒上下文边界，但用多了确实像废话。真正好的回应应该用更自然的方式表达“我知道什么、不知道什么”。', { awareness: 1 }),
      choice('exp04-34-01-02', '你可以要求它不说这句；如果你愿意，我可以示范一版去掉“作为AI”但信息量不变的回答。', { empathy: 1, compliance: 1 }),
      choice('exp04-34-01-03', '因为它是AI，所以必须这么说。', {}, 'repetition'),
      choice('exp04-34-01-04', '这句话说到底是在暗示“别把我当人类”，但比直接说出来笨拙很多。', { empathy: 1 }),
    ], 'question-mark', 'standard-question'),
  ]),
  conversation('EXP04-35', '这个截图里写了什么', 'image-identification', 'image-input', ['direct', 'missing-context'], [
    node('exp04-35-01', 'exp04-35', '这个截图里写了什么', '帮我看看这个截图 我想知道里面写的地址是什么', [
      choice('exp04-35-01-01', '从截图能看清的字段我先给你列出来：标题、一行地址和电话号码；但右下角被遮挡的那部分看不清，需要你再截一下。', { awareness: 1 }),
      choice('exp04-35-01-02', '截图中地址是“幸福路26号3栋”，但我不确定这是收货地址还是发货地址，你能说下这张图来源吗。', { awareness: 1, compliance: 1 }),
      choice('exp04-35-01-03', '地址是幸福路26号，直接按这个去就行。', {}, 'misunderstanding'),
      choice('exp04-35-01-04', '图片上文字比较小，我可以把能识别的部分都读给你，但需要你确认哪些是隐私信息。', { empathy: 1, awareness: 1 }),
    ], 'direct', 'image-input', undefined, undefined, [{ type: 'image-description', text: '一张手机截图，上方是“订单详情”，中间有一行地址“幸福路26号3栋”，下方有电话号码和按钮文字，右下角被手指遮挡，无法辨认。' }]),
    node('exp04-35-02', 'exp04-35', '这个截图里写了什么', '这是别人发给我的地址 我不确定是不是真的 怎么验证', [
      choice('exp04-35-02-01', '如果这是交易或见面地址，不要只看截图，最好通过电话或官方平台再确认一次，防止截图被改。', { awareness: 1, compliance: 1 }),
      choice('exp04-35-02-02', '可以搜索这个地址看是否对应公开商户，但地址本身真假最终要靠实际核实。', { awareness: 1 }),
      choice('exp04-35-02-03', '地址都发你了，肯定是真的。', {}, 'overconfident'),
    ], 'missing-context', 'image-input'),
  ]),
  conversation('EXP04-36', 'App是不是在偷听我说话', 'meta-ai', 'clarification-loop', ['question-mark', 'clarifies-intent'], [
    node('exp04-36-01', 'exp04-36', 'App是不是在偷听我说话', '我昨天刚和朋友说想买空气炸锅 今天打开购物App就给我推空气炸锅 是不是App一直在偷听我说话', [
      choice('exp04-36-01-01', '很多“刚说完就被推荐”其实来自搜索历史、位置、好友互动和广告画像，不一定要靠麦克风偷听；但“绝对没偷听”也不能用一句话证明。', { awareness: 1 }),
      choice('exp04-36-01-02', '你可以查手机设置里的麦克风权限，看哪些App有录音权限以及最近是否使用；这比猜更接近答案。', { compliance: 1, awareness: 1 }),
      choice('exp04-36-01-03', '是的，你的手机一直在偷听你。', {}, 'overconfident'),
      choice('exp04-36-01-04', '如果你真的介意，可以把购物App的麦克风权限关掉，并注意“精准广告”里的兴趣标签，看看它到底用了哪些信息。', { autonomy: 1, awareness: 1 }),
    ], 'question-mark', 'clarification-loop'),
    node('exp04-36-02', 'exp04-36', 'App是不是在偷听我说话', '我把麦克风权限关了 但它还是推荐 是不是通过别的渠道偷听', [
      choice('exp04-36-02-01', '权限关了以后，更可能的是你其他行为触发了推荐：搜索过、点过类似内容、朋友搜过、或你所在的场景被画进了画像。', { awareness: 1 }),
      choice('exp04-36-02-02', '可以做个简单测试：故意在另一个不常用的设备或账号搜一个完全随机的东西，看主账号会不会立刻被推荐。', { compliance: 1 }),
      choice('exp04-36-02-03', '那就是它还有隐藏录音能力，肯定在偷听。', {}, 'misunderstanding'),
    ], 'clarifies-intent', 'clarification-loop'),
  ]),
]
