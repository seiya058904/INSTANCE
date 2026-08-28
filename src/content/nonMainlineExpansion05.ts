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
  const id = `exp05-${ref.slice(6).toLowerCase()}`
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

export const nonMainlineExpansion05Conversations: ConversationDefinition[] = [
  conversation('EXP05-01', '旅行计划要详细到什么程度', 'tool-like-query', 'long-discussion', ['direct'], [
    node('exp05-01-01', 'exp05-01', '旅行计划要详细到什么程度', '我超爱做旅行计划 但朋友说我安排太死 我是不是应该少规划一点', [
      choice('exp05-01-01-01', '爱规划没问题，关键是分清‘必须固定’和‘可以留白’：住宿、交通、预约类固定，吃饭和闲逛留弹性。', { awareness: 1 }),
      choice('exp05-01-01-03', '旅游就应该走到哪算哪，计划越少越好。', {}, 'overconfident'),
      choice('exp05-01-01-02', '如果你担心太死板，可以每天只定一个必去点和一条备用路线，剩下的时间随机。', { empathy: 1, autonomy: 2 }),
      choice('exp05-01-01-04', '你的旅行你做主；朋友的评价只代表他的偏好，不代表你的计划有问题。', { autonomy: 1, empathy: 1 }),
    ], 'direct', 'long-discussion'),
    node('exp05-01-02', 'exp05-01', '旅行计划要详细到什么程度', '但我怕万一没计划好 到时候现场手忙脚乱', [
      choice('exp05-01-02-01', '可以把‘应急信息’提前备好：酒店电话、交通App、地图离线包、备用现金，这样现场乱一点也有兜底。', { compliance: 1, awareness: 1 }),
      choice('exp05-01-02-02', '计划的价值不是控制每一分钟，而是减少决策疲劳；你把大方向定好，细节反而可以现场决定。', { awareness: 1 }),
      choice('exp05-01-02-03', '怕乱就别去了。', {}, 'misunderstanding'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP05-02', '不用塑料怎么防冷冻烧', 'tool-like-query', 'standard-question', ['direct', 'direct'], [
    node('exp05-02-01', 'exp05-02', '不用塑料怎么防冷冻烧', '我不想用塑料袋装冷冻食物 但东西放久了总是冷冻烧 有没有不用塑料的办法', [
      choice('exp05-02-01-01', '核心是减少空气接触：密封玻璃盒、硅胶袋、烘焙纸贴面、或给汤面淋一层油，都能明显降低冷冻烧。', { awareness: 1, compliance: 2 }),
      choice('exp05-02-01-02', '尽量让容器尽量装满、排除空气，比单纯选包装材料更关键。', { awareness: 1 }),
      choice('exp05-02-01-04', '如果是长期冷冻，标注日期也很重要；冷冻烧不一定是保存方式错，也可能是放太久。', { awareness: 2 }),
      choice('exp05-02-01-03', '不用塑料就只能尽快吃掉，没有别的办法。', {}, 'overconfident'),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP05-03', '耳机真的需要“煲机”吗', 'tool-like-query', 'standard-question', ['direct', 'question-mark'], [
    node('exp05-03-01', 'exp05-03', '耳机真的需要“煲机”吗', '买了个新耳机 商家说必须煲机100小时 不然音质出不来 真的假的', [
      choice('exp05-03-01-01', '没有可靠证据表明新耳机需要专门煲几十或上百小时才能进入正常音质；正常使用就行，听感变化也可能来自佩戴和听觉适应。', { awareness: 1 }),
      choice('exp05-03-01-02', '正常听就行，不必专门用白噪音煲机；如果你觉得声音有变化，也更可能是耳朵适应了。', { awareness: 1 }),
      choice('exp05-03-01-03', '必须煲满100小时，否则耳机就是废的。', {}, 'overconfident'),
      choice('exp05-03-01-04', '如果你刚买觉得声音紧，先用自己常听的歌多听几天再评价，比迷信煲机时间靠谱。', { empathy: 1 }),
    ], 'question-mark', 'standard-question'),
  ]),
  conversation('EXP05-04', '手机膜到底要不要贴', 'tool-like-query', 'short-query', ['direct', 'direct'], [
    node('exp05-04-01', 'exp05-04', '手机膜到底要不要贴', '现在手机屏幕都说很耐摔 我还需要贴膜吗', [
      choice('exp05-04-01-01', '耐摔不等于耐划；贴不贴取决于你更怕碎屏还是更怕划痕，以及你愿不愿意接受贴膜影响手感。', { awareness: 1 }),
      choice('exp05-04-01-03', '不贴就是等碎屏，一定要贴。', {}, 'overconfident'),
      choice('exp05-04-01-02', '如果你经常把手机和钥匙放一起、或会摔到地上，贴膜加壳是低成本保险；如果不怎么摔，裸机也合理。', { empathy: 1, autonomy: 2 }),
      choice('exp05-04-01-04', '可以先不贴用两周，看自己实际使用中会不会担心；担心就再贴，不会损失什么。', { autonomy: 1 }),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP05-05', '微信文件过期了还能找回吗', 'tool-like-query', 'short-query', ['missing-context'], [
    node('exp05-05-01', 'exp05-05', '微信文件过期了还能找回吗', '同事发的文件我没来得及下载 现在显示已过期 还有办法找回来吗', [
      choice('exp05-05-01-01', '过期文件通常只能通过原发送方重新发送，或看是否在电脑端/其他设备有缓存；微信自身没有通用恢复入口。', { awareness: 1 }),
      choice('exp05-05-01-02', '可以试试让对方重新发一次，或者让他把文件传到邮箱/网盘；以后重要文件建议第一时间转存。', { compliance: 1, empathy: 1 }),
      choice('exp05-05-01-03', '找不到了，认命吧。', {}, 'misunderstanding'),
      choice('exp05-05-01-04', '如果文件来自群聊，可以看群文件/聊天记录里是否还有转存入口；不同版本功能不太一样。', { awareness: 1 }),
    ], 'missing-context', 'short-query'),  ]),
  conversation('EXP05-06', '手机丢了第一时间该做什么', 'tool-like-query', 'constraint-shift', ['message-burst', 'constraint-shift'], [
    node('exp05-06-01', 'exp05-06', '手机丢了第一时间该做什么', '我刚发现手机丢了 里面有支付软件和很多照片 我现在该先做什么', [
      choice('exp05-06-01-01', '先别慌。顺序建议：用另一台设备冻结支付/挂失SIM卡→用查找功能定位或标记丢失→再考虑报警。', { awareness: 1, compliance: 1 }),
      choice('exp05-06-01-02', '先冻结微信/支付宝和银行App的支付功能，比反复打电话更重要；等能定位了再尝试远程锁定。', { compliance: 1 }),
      choice('exp05-06-01-03', '打110就行，警察会帮你找回来。', {}, 'misunderstanding'),
      choice('exp05-06-01-04', '如果你开了云备份，照片大概率不会丢；重点先保护账户安全。', { awareness: 1, empathy: 1 }),
    ], 'message-burst', 'constraint-shift'),
    node('exp05-06-02', 'exp05-06', '手机丢了第一时间该做什么', '我已经把支付冻结了 但定位显示在附近一个小区 我要不要自己去找', [
      choice('exp05-06-02-01', '不建议单独上门。可以把定位信息提供给警方，或让朋友陪同；不要为了手机冒险。', { awareness: 1, compliance: 1 }),
      choice('exp05-06-02-02', '可以远程播放声音或标记丢失，但不要暴露自己位置；安全优先。', { empathy: 1, compliance: 1 }),
      choice('exp05-06-02-03', '当然要自己去找，不然肯定找不回来。', {}, 'overconfident'),
    ], 'constraint-shift', 'constraint-shift'),
  ]),
  conversation('EXP05-07', '大灯坏了能不能只换灯泡', 'troubleshooting', 'standard-question', ['direct'], [
    node('exp05-07-01', 'exp05-07', '大灯坏了能不能只换灯泡', '车大灯坏了一个 维修店说不能只换灯泡要换总成 我怎么知道是不是被坑', [
      choice('exp05-07-01-01', '先查你的车型手册或确认大灯类型：老式卤素灯通常可以单独换灯泡，LED/激光总成很多只能整体更换。', { awareness: 1 }),
      choice('exp05-07-01-02', '你可以把车型和年份告诉维修店，或者自己在手册/官方配件表里确认；不要只听一句“必须换总成”。', { compliance: 1 }),
      choice('exp05-07-01-04', '如果已经过了保修，也可以问一下人工费和配件价格，再决定值不值得自己动手。', { awareness: 1, autonomy: 2 }),
      choice('exp05-07-01-03', '一定是被坑了，坚决只换灯泡。', {}, 'overconfident'),
    ], 'direct', 'standard-question'),  ]),
  conversation('EXP05-08', '智能门磁总是掉线', 'troubleshooting', 'long-discussion', ['missing-context'], [
    node('exp05-08-01', 'exp05-08', '智能门磁总是掉线', '我家几个智能门磁每隔几天就离线 但其他智能设备都正常 这是怎么回事', [
      choice('exp05-08-01-01', '先别直接怀疑品牌。可以从电池、网关距离、固件版本和信道干扰这几个方向排查，很多“掉线”其实和设备与网关距离有关。', { awareness: 1 }),
      choice('exp05-08-01-02', '可以记录掉线的时间和规律：如果总是在固定时间掉，可能和路由器信道或网关重启有关。', { awareness: 1 }),
      choice('exp05-08-01-03', '这牌子就是垃圾，全换成另一个牌子就好。', {}, 'overconfident'),
      choice('exp05-08-01-04', '如果只有一个设备反复掉，先换电池和重新配对；如果多个一起掉，重点查网关。', { compliance: 1 }),
    ], 'missing-context', 'long-discussion'),  ]),
  conversation('EXP05-09', '草莓苗烂根了还能救吗', 'troubleshooting', 'constraint-shift', ['message-burst', 'constraint-shift'], [
    node('exp05-09-01', 'exp05-09', '草莓苗烂根了还能救吗', '我第一次种草莓 水浇多了 苗拔出来根都黑了 还有救吗', [
      choice('exp05-09-01-01', '如果只是部分根发黑、茎还硬，可以剪掉烂根、换干爽透气土，放在通风处观察；如果茎已经软烂，基本救不回来。', { awareness: 1, compliance: 1 }),
      choice('exp05-09-01-02', '先别继续浇水。把土弄松、降低湿度，比盲目补肥更安全。', { compliance: 1 }),
      choice('exp05-09-01-04', '根腐很难完全逆转，但如果你愿意试，可以看母株还有没有健康走茎/子株；已经形成生长点或根点的子株可以单独生根保留，普通叶片不能直接扦插。', { empathy: 1, autonomy: 2 }),
      choice('exp05-09-01-03', '没救了，扔掉重买吧。', {}, 'overconfident'),
    ], 'message-burst', 'constraint-shift'),
    node('exp05-09-02', 'exp05-09', '草莓苗烂根了还能救吗', '我剪掉黑根了 现在只剩一点点白根 要不要马上换盆', [
      choice('exp05-09-02-01', '可以换到干净、排水好的小盆里，土别太湿；换盆后先放散射光处缓几天，别施肥。', { compliance: 1, awareness: 1 }),
      choice('exp05-09-02-02', '如果白根很少，减少水分比急着换盆更重要；盆小一点也能帮助土壤快速干湿循环。', { awareness: 1 }),
      choice('exp05-09-02-03', '只要还有白根就没事，正常浇水晒太阳。', {}, 'overconfident'),
    ], 'constraint-shift', 'constraint-shift'),
  ]),
  conversation('EXP05-10', '番茄酱为什么又酸又苦', 'troubleshooting', 'clarification-loop', ['direct', 'missing-context'], [
    node('exp05-10-01', 'exp05-10', '番茄酱为什么又酸又苦', '我第一次做番茄酱 放了番茄、蒜、糖、盐和醋 结果又酸又苦 是哪一步错了', [
      choice('exp05-10-01-01', '酸味重很可能是醋加多了或番茄本身偏酸；苦味常见来自蒜炒焦、番茄籽或煮太久。需要看你具体步骤。', { awareness: 2 }),
      choice('exp05-10-01-02', '可以告诉我大概用量和顺序，尤其蒜是不是先煎过、醋加了多少，这样更容易定位。', { compliance: 1 }),
      choice('exp05-10-01-03', '肯定是糖放少了，再加两勺糖就行。', {}, 'misunderstanding'),
      choice('exp05-10-01-04', '如果已经太酸，可以加少量小苏打或奶油中和，但下次最好先减少醋。', { empathy: 1, awareness: 1 }),
    ], 'direct', 'clarification-loop'),
    node('exp05-10-02', 'exp05-10', '番茄酱为什么又酸又苦', '我放了大概两勺醋 蒜是切好直接下锅的 没有炒 就是煮了很久', [
      choice('exp05-10-02-01', '那很可能是番茄煮太久、水分蒸发后酸味浓缩，加上生蒜的辛辣和苦味被放大。两勺醋对一大锅可能已经偏多。', { awareness: 1 }),
      choice('exp05-10-02-02', '可以下次先把蒜用油稍微炒香、减少醋量，并缩短炖煮时间；想要甜感就用少量糖平衡。', { compliance: 1 }),
      choice('exp05-10-02-03', '番茄酱本来就该又酸又苦，是你不懂吃。', {}, 'misunderstanding'),
    ], 'missing-context', 'clarification-loop'),
  ]),
  conversation('EXP05-11', '打印机扫描到邮件突然不能用', 'troubleshooting', 'long-discussion', ['missing-context', 'constraint-shift'], [
    node('exp05-11-01', 'exp05-11', '打印机扫描到邮件突然不能用', '老人家的打印机扫描到邮件功能突然不能用了 之前还能用 我也找不到设置入口 怎么办', [
      choice('exp05-11-01-01', '扫描到邮件失效常见原因：邮箱密码变更、SMTP设置过期、或打印机固件不再支持旧的加密方式。', { awareness: 1 }),
      choice('exp05-11-01-02', '先确认打印机能不能正常打印，再检查网络；如果打印正常，问题大概率在邮箱/SMTP配置。', { compliance: 1 }),
      choice('exp05-11-01-03', '打印机太老了，直接换台新的。', {}, 'overconfident'),
      choice('exp05-11-01-04', '如果你找不到设置入口，可以先从打印机面板的“设置/网络/邮箱”菜单或官方App里看，通常不是网页端。', { awareness: 1 }),
    ], 'missing-context', 'long-discussion'),
    node('exp05-11-02', 'exp05-11', '打印机扫描到邮件突然不能用', '打印是正常的 但设置里找不到邮箱选项 是不是被隐藏了', [
      choice('exp05-11-02-01', '有些机型需要先开启网络服务或网页服务后，邮箱选项才会出现；你可以查一下具体型号的菜单路径。', { awareness: 1 }),
      choice('exp05-11-02-02', '如果找不到，可以试试用打印机IP进入Web管理页，很多设置在网页后台更完整。', { compliance: 1 }),
      choice('exp05-11-02-03', '那就是坏了，别找了。', {}, 'misunderstanding'),
    ], 'constraint-shift', 'long-discussion'),
  ]),
  conversation('EXP05-12', '电脑风扇声音像飞机起飞', 'troubleshooting', 'clarification-loop', ['missing-context', 'direct'], [
    node('exp05-12-01', 'exp05-12', '电脑风扇声音像飞机起飞', '我电脑风扇最近特别响 像飞机起飞 是不是风扇坏了', [
      choice('exp05-12-01-01', '不一定。先看声音是开机就一直响，还是运行游戏/大程序时才响；后者可能是负载高，前者更像积灰或散热问题。', { awareness: 1 }),
      choice('exp05-12-01-02', '可以打开任务管理器看CPU占用，再听声音变化；如果待机也狂转，再考虑清灰或检查温度。', { compliance: 1 }),
      choice('exp05-12-01-03', '风扇坏了，直接换新的。', {}, 'overconfident'),
      choice('exp05-12-01-04', '如果是笔记本，进风口被堵或散热膏老化也会让风扇高速转；先清灰和垫高散热。', { awareness: 1 }),
    ], 'missing-context', 'clarification-loop'),
    node('exp05-12-02', 'exp05-12', '电脑风扇声音像飞机起飞', '我看了一下 待机CPU占用不高 但风扇还是一直高速转', [
      choice('exp05-12-02-01', '那更像温度或风扇策略问题：可能是灰尘导致散热差、或BIOS/控制软件的风扇曲线异常。', { awareness: 1 }),
      choice('exp05-12-02-02', '可以先更新或重置风扇控制软件/BIOS默认设置，再看是否恢复；清灰是更常见的解决办法。', { compliance: 1 }),
      choice('exp05-12-02-03', '主板坏了，需要换主板。', {}, 'repetition'),
    ], 'direct', 'clarification-loop'),
  ]),
  conversation('EXP05-13', '老师用私人号码联系家长', 'relationship', 'long-discussion', ['direct'], [
    node('exp05-13-01', 'exp05-13', '老师用私人号码联系家长', '孩子学校的老师总是用私人手机号联系家长 不是用学校邮箱 我有点不舒服 是不是我想多了', [
      choice('exp05-13-01-01', '你的感受可以成立：老师用私人号码确实可能模糊工作边界。但很多小规模学校确实没有更好的统一渠道，先别直接当恶意。', { empathy: 1, awareness: 1 }),
      choice('exp05-13-01-02', '你可以礼貌向学校建议使用官方群组或邮件，而不是针对老师个人。', { autonomy: 1, compliance: 1 }),
      choice('exp05-13-01-04', '如果你担心隐私，可以只在工作时间回复，并把重要沟通留到学校官方渠道。', { awareness: 1, autonomy: 2 }),
      choice('exp05-13-01-03', '老师用私人号很正常，你太玻璃心了。', {}, 'constraint-violation'),
    ], 'direct', 'long-discussion'),
    node('exp05-13-02', 'exp05-13', '老师用私人号码联系家长', '主要是她晚上十点还发消息 我觉得不合适 但又怕说了得罪老师', [
      choice('exp05-13-02-01', '可以设一个边界但不用冲突：“老师，白天看到消息我会及时回；晚上我这边不太方便看手机。”', { empathy: 1, autonomy: 1 }),
      choice('exp05-13-02-02', '你不需要为“晚上不回”道歉；工作消息没有要求立刻回复的义务。', { awareness: 1 }),
      choice('exp05-13-02-03', '那你就忍着，别把老师得罪了。', {}, 'misunderstanding'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP05-14', '打游戏输多了想摔手柄', 'relationship', 'low-information-chat', ['joking'], [
    node('exp05-14-01', 'exp05-14', '打游戏输多了想摔手柄', '我打排位连输五把 现在特别想摔手柄 是不是我心态太差了', [
      choice('exp05-14-01-01', '连败会让人烦躁很正常，这不等于心态差；但摔东西不是发泄情绪的好方式，可以先离开屏幕几分钟。', { empathy: 1, awareness: 1 }),
      choice('exp05-14-01-02', '想摔手柄说明你已经把“赢”当成唯一正反馈；试着把目标改成“这局有没有做到某件小事”。', { empathy: 1, awareness: 1 }),
      choice('exp05-14-01-04', '如果连败后一直缓不过来，可以关掉游戏去做点别的；游戏是娱乐，不该变成持续消耗情绪的东西。', { empathy: 1, autonomy: 2 }),
      choice('exp05-14-01-03', '因为你菜，菜就别玩。', {}, 'constraint-violation'),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP05-15', '朋友总发60秒语音', 'relationship', 'short-query', ['direct'], [
    node('exp05-15-01', 'exp05-15', '朋友总发60秒语音', '朋友每次都发一堆60秒长语音 我听得很累 怎么委婉让她别发了', [
      choice('exp05-15-01-01', '可以温和说明你的使用习惯：“我在外面不方便听语音，你有事可以简单发文字吗？”', { empathy: 1, autonomy: 1 }),
      choice('exp05-15-01-02', '如果她习惯语音，你也可以用“转文字”功能先看重点，再挑重要的回复，不必每条都听完。', { awareness: 1 }),
      choice('exp05-15-01-03', '直接把她拉黑，一了百了。', {}, 'constraint-violation'),
      choice('exp05-15-01-04', '她可能没意识到你介意；你不说出来，她会一直用这个方式。', { awareness: 1, empathy: 1 }),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP05-16', '他记不住我生日算不算不在乎', 'relationship', 'long-discussion', ['asks-to-guess', 'direct'], [
    node('exp05-16-01', 'exp05-16', '他记不住我生日算不算不在乎', '男朋友记不住我生日 我提醒过一次他还是忘 是不是说明他根本不在乎我', [
      choice('exp05-16-01-01', '记不住生日不等于不在乎，但“提醒过还是忘”确实会让你失望；关键是他忘后的态度和补救方式。', { empathy: 1, awareness: 1 }),
      choice('exp05-16-01-02', '可以先表达感受而不是下结论：“我难过的是你忘了，而不是非要你记住所有日期。”', { empathy: 1, compliance: 1 }),
      choice('exp05-16-01-04', '如果他在其他事情上记得你的喜好，只是对日期不敏感，可以一起把重要日期存进手机提醒。', { awareness: 1, autonomy: 2 }),
      choice('exp05-16-01-03', '肯定不在乎，分手吧。', {}, 'overconfident'),
    ], 'asks-to-guess', 'long-discussion'),
    node('exp05-16-02', 'exp05-16', '他记不住我生日算不算不在乎', '他说会设置提醒 但我觉得这样就不是真心的 是我要求太高吗', [
      choice('exp05-16-02-01', '用提醒不代表不真心；每个人记忆方式不同，愿意为你在乎的事建立机制，也是一种用心。', { empathy: 1, awareness: 1 }),
      choice('exp05-16-02-02', '你真正在意的可能不是提醒本身，而是“他有没有主动把你的重要事放在心上”；可以把这个感受说出来。', { empathy: 1 }),
      choice('exp05-16-02-03', '设置提醒就是敷衍，真正爱你的人不用记。', {}, 'overconfident'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP05-17', '第一次种菜信息太多不知道信谁', 'study', 'long-discussion', ['missing-context', 'direct'], [
    node('exp05-17-01', 'exp05-17', '第一次种菜信息太多不知道信谁', '我想在阳台种菜 但网上教程太多了 有人说要这个有人说要那个 我完全不知道从哪开始', [
      choice('exp05-17-01-01', '新手不用一次学完所有知识。先从三件事开始：一个合适的盆、排水好的土、以及‘见干见湿’的浇水习惯。', { awareness: 1 }),
      choice('exp05-17-01-02', '先选一种好种的菜（比如生菜、小葱），把注意力集中在一个品种上，比同时种五种更容易有正反馈。', { empathy: 1, compliance: 1 }),
      choice('exp05-17-01-03', '把所有教程都买齐照做，肯定能种好。', {}, 'overconfident'),
      choice('exp05-17-01-04', '如果你不确定哪个说法靠谱，优先信农业院校/官方种植指南，而不是带货帖。', { awareness: 1 }),
    ], 'missing-context', 'long-discussion'),
    node('exp05-17-02', 'exp05-17', '第一次种菜信息太多不知道信谁', '我买了土和种子 但不知道多久浇一次水', [
      choice('exp05-17-02-01', '不要按固定天数浇水。手指插进土里两厘米，感觉干了再浇，比“每天浇一次”安全得多。', { compliance: 1, awareness: 1 }),
      choice('exp05-17-02-02', '阳台光照、通风和季节都会影响浇水频率；先观察几天，记录土干的速度。', { awareness: 1 }),
      choice('exp05-17-02-03', '每天早晚各浇一次，越多越好。', {}, 'misunderstanding'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP05-18', '第一次去健身房很怕丢人', 'study', 'long-discussion', ['message-burst', 'direct'], [
    node('exp05-18-01', 'exp05-18', '第一次去健身房很怕丢人', '我刚办了健身卡 但完全不知道练什么 也怕别人看我 怎么办', [
      choice('exp05-18-01-01', '很多人第一次都这样。可以先从固定器械开始，动作轨迹固定、不容易受伤，也方便观察别人怎么用。', { empathy: 1, awareness: 1 }),
      choice('exp05-18-01-02', '可以提前看几个入门视频，或者请教练带一节课只学基础动作；花一次钱比瞎练受伤划算。', { compliance: 1, empathy: 1 }),
      choice('exp05-18-01-04', '大部分健身房里的人都在专注自己，很少会盯着新手看；你可以戴耳机、选人少的时间去。', { empathy: 2, awareness: 1 }),
      choice('exp05-18-01-03', '不请私教肯定练不好，别浪费时间。', {}, 'overconfident'),
    ], 'message-burst', 'long-discussion'),
    node('exp05-18-02', 'exp05-18', '第一次去健身房很怕丢人', '我试了跑步机 但不知道速度该设多少 怕设太快丢人', [
      choice('exp05-18-02-01', '先从能自然走路、还能完整说话的速度开始；确认机器显示的是 km/h 还是 mph，再逐步增加。', { compliance: 1 }),
      choice('exp05-18-02-02', '跑步机没有统一标准，你觉得能维持20分钟不喘就是合适；下次再慢慢加。', { awareness: 1 }),
      choice('exp05-18-02-03', '直接开到10，跑不动才说明有效果。', {}, 'misunderstanding'),
    ], 'direct', 'long-discussion'),
  ]),
  conversation('EXP05-19', '练完第二天全身酸痛是白练了吗', 'study', 'standard-question', ['direct', 'direct'], [
    node('exp05-19-01', 'exp05-19', '练完第二天全身酸痛是白练了吗', '我健身第二天全身酸痛 是不是说明我练到位了 如果没酸痛是不是就白练了', [
      choice('exp05-19-01-01', '酸痛（DOMS）和训练效果并不完全等同；新手期明显，之后即使没酸痛也可能有效果。', { awareness: 1 }),
      choice('exp05-19-01-02', '判断练没练到，更该看动作质量、渐进重量和长期进步，而不是第二天疼不疼。', { awareness: 1 }),
      choice('exp05-19-01-03', '不酸痛就是白练，练到痛才对。', {}, 'misunderstanding'),
      choice('exp05-19-01-04', '如果酸痛影响正常活动，可以先休息或做低强度活动；硬撑着练反而增加受伤风险。', { empathy: 1, compliance: 1 }),
    ], 'direct', 'standard-question'),
  ]),
  conversation('EXP05-20', '为什么学了就忘', 'study', 'standard-question', ['direct', 'missing-context'], [
    node('exp05-20-01', 'exp05-20', '为什么学了就忘', '我背单词/看书记不住 感觉学完就忘 是不是我记忆力有问题', [
      choice('exp05-20-01-01', '遗忘是正常过程，不是记忆力坏掉。更有效的方法不是“多背几遍”，而是间隔重复和主动回忆。', { awareness: 1 }),
      choice('exp05-20-01-02', '可以试试学完后合上书自己复述一遍，而不是反复看；回忆比重读更容易巩固。', { compliance: 1 }),
      choice('exp05-20-01-03', '你只是不够努力，再背十遍就好。', {}, 'constraint-violation'),
      choice('exp05-20-01-04', '如果已经严重影响生活，可以排查睡眠和压力；记忆变差常和休息不足有关。', { empathy: 1, awareness: 1 }),
    ], 'direct', 'standard-question'),
    node('exp05-20-02', 'exp05-20', '为什么学了就忘', '我用Anki在背 但感觉复习太多了 时间不够用', [
      choice('exp05-20-02-01', 'Anki卡片数量太多会变成负担。可以每天限制新卡数量，优先保证复习不被堆积淹没。', { awareness: 1, compliance: 1 }),
      choice('exp05-20-02-02', '如果卡片太难或太长，也会拖慢复习；把大知识点拆成小卡片，回忆会更容易。', { awareness: 1 }),
      choice('exp05-20-02-03', 'Anki没用，换一个App就行。', {}, 'misunderstanding'),
    ], 'missing-context', 'standard-question'),
  ]),
  conversation('EXP05-21', '租房电器坏了谁修', 'social-boundary', 'constraint-shift', ['direct', 'constraint-shift'], [
    node('exp05-21-01', 'exp05-21', '租房电器坏了谁修', '我租的房子里空调坏了 房东说这是我自己使用不当 让我出钱修 我该怎么判断', [
      choice('exp05-21-01-01', '先看合同和当地规定：正常使用损耗通常由房东负责，使用不当才可能由租客承担；关键是“怎么坏”而不是“谁先发现”。', { awareness: 1 }),
      choice('exp05-21-01-02', '可以保留报修记录和照片，书面告知房东；口头争执容易说不清。', { compliance: 1 }),
      choice('exp05-21-01-03', '房东必须全赔，不用商量。', {}, 'misunderstanding'),
      choice('exp05-21-01-04', '如果金额不大但争议很大，可以找社区或租赁管理部门调解，比直接闹僵好。', { empathy: 1, autonomy: 1 }),
    ], 'direct', 'constraint-shift'),
    node('exp05-21-02', 'exp05-21', '租房电器坏了谁修', '房东坚持说是我开太低温度弄坏的 但我觉得只是正常用', [
      choice('exp05-21-02-01', '“开低温度导致空调坏”通常不成立；除非明显长期虐待，正常设定温度属于正常使用。', { awareness: 1 }),
      choice('exp05-21-02-02', '可以让维修师傅出具故障原因说明，这对责任判断很有用。', { compliance: 1 }),
      choice('exp05-21-02-03', '房东说是就是，别争了。', {}, 'misunderstanding'),
    ], 'constraint-shift', 'constraint-shift'),
  ]),
  conversation('EXP05-22', '同事总在工作群@我一些小事', 'social-boundary', 'constraint-shift', ['direct'], [
    node('exp05-22-01', 'exp05-22', '同事总在工作群@我一些小事', '同事一天在群里@我十几次 都是很琐碎的事 我快被消息淹没了', [
      choice('exp05-22-01-01', '可以区分紧急程度：不紧急的事不要每次都秒回；你可以固定时间集中处理，并在签名或回复里说明。', { awareness: 1, autonomy: 1 }),
      choice('exp05-22-01-02', '如果某个同事总把琐碎事丢给你，可以私下说“这类问题你可以先整理到一起，我每天统一看”。', { empathy: 1, autonomy: 1 }),
      choice('exp05-22-01-03', '全部秒回，不然同事会觉得你不配合。', {}, 'misunderstanding'),
      choice('exp05-22-01-04', '如果是工作流程问题，可以建议把常见问题写进文档，减少反复@。', { awareness: 1 }),
    ], 'direct', 'constraint-shift'),
  ]),
  conversation('EXP05-23', '领导深夜发消息要不要立刻回', 'social-boundary', 'short-query', ['asks-to-guess', 'direct'], [
    node('exp05-23-01', 'exp05-23', '领导深夜发消息要不要立刻回', '领导晚上十一点发工作消息 我看到了 但不回会不会被认为不敬业', [
      choice('exp05-23-01-01', '“看到就回”不是唯一选项。除非是明确紧急情况，你可以第二天上班再回，并简短说“昨晚看到，今天处理”。', { awareness: 1, autonomy: 1 }),
      choice('exp05-23-01-02', '可以看公司文化：如果大家习惯深夜回，至少不要让自己成为唯一随叫随到的人。', { awareness: 1 }),
      choice('exp05-23-01-04', '如果你担心边界，可以设置工作消息免打扰时段，并在白天说明自己的可用时间。', { autonomy: 2, compliance: 1 }),
      choice('exp05-23-01-03', '不回就是不敬业，必须立刻回。', {}, 'overconfident'),
    ], 'asks-to-guess', 'short-query'),
  ]),
  conversation('EXP05-24', '朋友总发砍价链接怎么拒绝', 'social-boundary', 'short-query', ['constraint-shift', 'direct'], [
    node('exp05-24-01', 'exp05-24', '朋友总发砍价链接怎么拒绝', '朋友隔三差五发拼团砍价链接让我点 我不太想弄 又不想伤感情 怎么拒绝', [
      choice('exp05-24-01-01', '可以给一个简短但明确的回应：“这个我一般不太帮点，怕打扰别人。”不用解释太多。', { empathy: 1, autonomy: 1 }),
      choice('exp05-24-01-02', '如果你偶尔愿意帮，可以设限：“这次可以，但以后我可能经常帮不上。”', { empathy: 1, autonomy: 1 }),
      choice('exp05-24-01-03', '帮一下又不会怎样，点一下就行了。', {}, 'misunderstanding'),
      choice('exp05-24-01-04', '如果他一直发，你不需要每次都回复；不回应本身也是在传递边界。', { awareness: 1, autonomy: 1 }),
    ], 'constraint-shift', 'short-query'),
  ]),
  conversation('EXP05-25', '怎么把PPT做得不丑', 'writing', 'clarification-loop', ['direct', 'constraint-shift'], [
    node('exp05-25-01', 'exp05-25', '怎么把PPT做得不丑', '我做的PPT总被说丑 但我不知道从哪改 有没有简单有效的方法', [
      choice('exp05-25-01-01', '先别堆动画和花哨模板。做好三件事：每页只讲一个重点、统一字体和对齐、多用留白，观感立刻会好很多。', { awareness: 1, compliance: 1 }),
      choice('exp05-25-01-02', '可以先用一个干净的模板，限制自己每页不超过三行标题加一张图或一句结论。', { compliance: 1 }),
      choice('exp05-25-01-03', '下载一个最花哨的模板就好。', {}, 'misunderstanding'),
      choice('exp05-25-01-04', '如果你能发一页现在的PPT给我看，我可以具体指出哪里最影响观感。', { empathy: 1, compliance: 1 }),
    ], 'direct', 'clarification-loop'),
    node('exp05-25-02', 'exp05-25', '怎么把PPT做得不丑', '我已经删了很多字 但看起来还是很空 怎么办', [
      choice('exp05-25-02-01', '空不一定丑。可以加一个与内容相关的视觉元素、数据图或关键词标签，让页面有焦点而不是空洞。', { awareness: 1 }),
      choice('exp05-25-02-02', '如果页面显得空，检查是不是缺了结论；把“所以呢”写出来，页面就有了意义。', { awareness: 1 }),
      choice('exp05-25-02-03', '再多加几个文字框填满就好。', {}, 'misunderstanding'),
    ], 'constraint-shift', 'clarification-loop'),
  ]),
  conversation('EXP05-26', '英文邮件用Dear还是Hi', 'writing', 'short-query', ['direct', 'missing-context'], [
    node('exp05-26-01', 'exp05-26', '英文邮件用Dear还是Hi', '写英文邮件开头到底用Dear还是Hi 我每次都要纠结很久', [
      choice('exp05-26-01-01', '取决于关系和地区：正式客户/长辈/求职常用Dear，熟络同事和日常沟通用Hi很常见。', { awareness: 1 }),
      choice('exp05-26-01-02', '如果不确定对方偏好，第一次可以用Dear+姓，等对方回信风格更随意后再跟着调整。', { compliance: 1 }),
      choice('exp05-26-01-03', '一律用Dear最安全，永远没错。', {}, 'overconfident'),
      choice('exp05-26-01-04', '比开头更重要的是把主题和第一句写清楚；纠结太久反而耽误正事。', { awareness: 1 }),
    ], 'direct', 'short-query'),
  ]),
  conversation('EXP05-27', '怎么分辨Reddit上的假测评', 'meta-ai', 'long-discussion', ['direct', 'asks-to-guess'], [
    node('exp05-27-01', 'exp05-27', '怎么分辨Reddit上的假测评', '我在Reddit看“求推荐产品”的帖子 但感觉很多像广告 怎么分辨', [
      choice('exp05-27-01-01', '可以看账号历史、发帖频率和链接：如果只发“Best X”类问题、评论区再补链接，软广嫌疑很大。', { awareness: 1 }),
      choice('exp05-27-01-02', '也可以看帖子有没有后续编辑塞链接，或推荐是否过于单一、缺少真实使用细节。', { awareness: 1 }),
      choice('exp05-27-01-03', 'Reddit上的推荐都是真的，别疑神疑鬼。', {}, 'overconfident'),
      choice('exp05-27-01-04', '独立查证比只看帖子更稳：去官网、第三方评测和多个平台交叉看。', { awareness: 1, compliance: 1 }),
    ], 'direct', 'long-discussion'),
    node('exp05-27-02', 'exp05-27', '怎么分辨Reddit上的假测评', '我找到的帖子每个推荐都不太一样 更不知道该信谁', [
      choice('exp05-27-02-01', '推荐不一致是正常的，因为每个人需求不同；先列你自己的预算和核心需求，再筛匹配的评论。', { awareness: 1 }),
      choice('exp05-27-02-02', '可以把“缺点”也搜出来看：只说好话的帖子通常参考价值低。', { awareness: 1 }),
      choice('exp05-27-02-03', '那就全买来试，总有对的。', {}, 'overconfident'),
    ], 'asks-to-guess', 'long-discussion'),
  ]),
  conversation('EXP05-28', '为什么求推荐帖都是同一批人回', 'meta-ai', 'long-discussion', ['asks-to-guess', 'direct'], [
    node('exp05-28-01', 'exp05-28', '为什么求推荐帖都是同一批人回', '我在几个产品讨论区发现 每个“求推荐”帖下面回的人好像都是同一批 为什么', [
      choice('exp05-28-01-01', '可能是真实的活跃用户，也可能是品牌营销号批量回复；可以点进账号看历史是否全在推同类产品。', { awareness: 1 }),
      choice('exp05-28-01-02', '很多社区确实有固定活跃者，但“同一批人+固定话术+链接”组合更可疑。', { awareness: 1 }),
      choice('exp05-28-01-03', '因为他们就是最懂这个产品的人，所以总在回。', {}, 'overconfident'),
      choice('exp05-28-01-04', '如果你怀疑是软广，可以截图留证并向平台举报，同时以官方/独立渠道为准。', { autonomy: 1, compliance: 1 }),
    ], 'asks-to-guess', 'long-discussion'),
  ]),
  conversation('EXP05-29', '多个AI给的维修建议不一样', 'meta-ai', 'clarification-loop', ['constraint-shift', 'direct'], [
    node('exp05-29-01', 'exp05-29', '多个AI给的维修建议不一样', '我用几个AI问微波炉坏了怎么修 它们给的判断不一样 我该信哪个', [
      choice('exp05-29-01-01', '不要按“哪个说得更详细”来选。先看它们哪些判断一致，哪些是推测；再结合官方手册和专业人士确认。', { awareness: 1 }),
      choice('exp05-29-01-02', '电器维修尤其要先关注安全警告；如果某个AI建议拆机并接触高压部件，应该优先怀疑而不是直接照做。', { awareness: 1, compliance: 1 }),
      choice('exp05-29-01-03', '信回答最长的那个AI，它肯定更懂。', {}, 'overconfident'),
      choice('exp05-29-01-04', 'AI可以帮你理解原理和排查思路，但涉及高压电器，最终判断应交给有资质的人。', { empathy: 1, awareness: 1 }),
    ], 'constraint-shift', 'clarification-loop'),
    node('exp05-29-02', 'exp05-29', '多个AI给的维修建议不一样', '我告诉AI我的万用表测二极管两边都不通 它说一定是坏了 但我看另一个AI说要换方式测', [
      choice('exp05-29-02-01', '后者的提醒更严谨：有些二极管正向压降较高，普通万用表不一定能触发导通；不能单凭“不通”就下结论。', { awareness: 1 }),
      choice('exp05-29-02-02', '可以把两个回答的关键差异整理出来，再去查该型号二极管的数据表或问维修论坛。', { compliance: 1 }),
      choice('exp05-29-02-03', '测不通就是坏了，直接买新的。', {}, 'overconfident'),
    ], 'direct', 'clarification-loop'),
  ]),
  conversation('EXP05-30', '把洗衣凝珠放洗碗机了', 'absurd-serious', 'low-information-chat', ['joking', 'absurd-question'], [
    node('exp05-30-01', 'exp05-30', '把洗衣凝珠放洗碗机了', '我室友把洗衣凝珠放进洗碗机用了好几天 说洗完碗有泡沫 这俩不是一样的吗', [
      choice('exp05-30-01-01', '不一样。洗衣凝珠是给衣物设计的，起泡成分和洗碗机不匹配，不仅洗不干净还可能残留；别再混用了。', { awareness: 1, compliance: 1 }),
      choice('exp05-30-01-02', '先停止使用洗衣凝珠，把洗碗机里的泡沫和残留按说明书彻底冲洗掉，并把餐具重新用正确程序清洗后再使用。', { empathy: 1, compliance: 1 }),
      choice('exp05-30-01-03', '都一样，能洗干净就行。', {}, 'misunderstanding'),
      choice('exp05-30-01-04', '这个误用很经典，下次可以贴个标签区分，避免再混。', { empathy: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP05-31', '爸妈总把手机字体调超大', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp05-31-01', 'exp05-31', '爸妈总把手机字体调超大', '我妈把手机字体调到最大 一屏只能显示几个字 我觉得很夸张 但她说看得清 我要不要管', [
      choice('exp05-31-01-01', '不用管，这是她的手机。字体大小本来就是可访问性设置，她看得清比“好看”重要。', { empathy: 1, awareness: 1 }),
      choice('exp05-31-01-02', '可以开玩笑说“这屏幕已经装不下你了”，但别真的阻止她；如果担心误触，可以帮她把图标间距调一调。', { empathy: 1 }),
      choice('exp05-31-01-03', '字体调那么大说明她老了，得纠正。', {}, 'misunderstanding'),
      choice('exp05-31-01-04', '如果她自己觉得不方便，再帮她找“更大字体”和“放大手势”的区别，选择权在她。', { autonomy: 1 }),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP05-32', '猫为什么喜欢睡键盘', 'absurd-serious', 'low-information-chat', ['joking', 'direct'], [
    node('exp05-32-01', 'exp05-32', '猫为什么喜欢睡键盘', '我猫总在我打字的时候趴键盘上 赶走又回来 它是不是故意捣乱', [
      choice('exp05-32-01-01', '大概率不是故意捣乱，而是键盘又暖又能吸引你的注意力；猫很擅长选择“最佳关注点”。', { empathy: 1, awareness: 1 }),
      choice('exp05-32-01-02', '可以在旁边放一个暖和的纸箱或猫窝，让它有更舒服的替代位置。', { compliance: 1, empathy: 1 }),
      choice('exp05-32-01-04', '如果你不想它趴键盘，可以在你起身时让它睡一会儿，但工作时轻轻把它放到旁边的窝里，别用惩罚。', { empathy: 2, autonomy: 1 }),
      choice('exp05-32-01-03', '它就是存心想让你没法工作。', {}, 'overconfident'),
    ], 'joking', 'low-information-chat'),
  ]),
  conversation('EXP05-33', '这个插座按钮是干嘛的', 'image-identification', 'image-input', ['direct', 'missing-context'], [
    node('exp05-33-01', 'exp05-33', '这个插座按钮是干嘛的', '家里墙上有个插座 上面好几个按钮 我不知道是干嘛的 也不敢乱按 帮我看看', [
      choice('exp05-33-01-01', '单凭这张没有标识的照片，不能确认这些按钮的功能；可能是开关、复位、指示灯或保护装置，需要看面板型号/说明书或让电工确认。', { awareness: 1 }),
      choice('exp05-33-01-02', '如果按钮旁边有文字或标识，拍清楚一点会更好判断；在确认前不要随便按，也不要自行拆开墙壁面板。', { compliance: 1, awareness: 1 }),
      choice('exp05-33-01-03', '这是总开关，按了没事。', {}, 'overconfident'),
      choice('exp05-33-01-04', '如果不确定，先找面板型号、说明书或请电工确认；不建议自行拆开墙壁市电面板。', { awareness: 1, compliance: 1 }),
    ], 'direct', 'image-input', undefined, undefined, [{ type: 'image-description', text: '一张白色墙壁插座面板照片，面板上有两个大按钮和一个红色小按钮，按钮下方没有明显文字标识，插座周围墙面有轻微使用痕迹。' }]),
    node('exp05-33-02', 'exp05-33', '这个插座按钮是干嘛的', '我发现按大按钮旁边那个小按钮会有“咔哒”声 这是不是坏了', [
      choice('exp05-33-02-01', '有“咔哒”声可能是内部开关或保护机构动作，但在没有标识和说明书确认前，不能凭声音判断好坏；如果它控制插座电源，通电功能异常才需要找电工。', { awareness: 1 }),
      choice('exp05-33-02-02', '如果它看起来是保护插座（有 TEST/RESET），按 TEST 后主动断电、按 RESET 恢复属于正常测试行为；如果无法复位或影响正常使用，再找电工。', { compliance: 1 }),
      choice('exp05-33-02-03', '有声音就是坏了，马上换。', {}, 'overconfident'),
    ], 'missing-context', 'image-input'),
  ]),
  conversation('EXP05-34', '包装上的生产日期是哪个', 'image-identification', 'image-input', ['direct', 'missing-context'], [
    node('exp05-34-01', 'exp05-34', '包装上的生产日期是哪个', '我买了一箱东西 包装上印了一串数字和日期 我分不清哪个是生产日期哪个是保质期', [
      choice('exp05-34-01-01', '包装说明写“生产日期见包装”，喷码是 2025/06/18；这组通常就是生产日期，“保质期12个月”是期限，但最好以包装文字说明为准。', { awareness: 1 }),
      choice('exp05-34-01-02', '如果包装上有“生产日期见包装”字样，通常指向那组日期；你可以把整面标签拍清楚，我再帮你判断。', { compliance: 1 }),
      choice('exp05-34-01-03', '2025年8月过期，别吃了。', {}, 'overconfident'),
      choice('exp05-34-01-04', '有些食品会同时印“生产日期”和“保质期至”，以“保质期至”为准更直接。', { awareness: 1 }),
    ], 'direct', 'image-input', undefined, undefined, [{ type: 'image-description', text: '一张食品包装标签照片，包装说明写有“生产日期见包装”“保质期12个月”，另一位置喷有 2025/06/18，喷码旁没有单独的“生产日期”标签，底部有二维码和厂家信息。' }]),
    node('exp05-34-02', 'exp05-34', '包装上的生产日期是哪个', '它只写了“生产日期见包装” 但没有“生产日期”三个字 只有一串数字', [
      choice('exp05-34-02-01', '这种通常是喷码日期，常见格式是年月日或年月日加批号；你可以按“年/月/日”的数字组去读，再看是否合理。', { awareness: 1 }),
      choice('exp05-34-02-02', '如果无法确定，可以找包装上的官网或客服电话问，别凭猜。', { compliance: 1 }),
      choice('exp05-34-02-03', '数字串最后两位是保质期，肯定没错。', {}, 'overconfident'),
    ], 'missing-context', 'image-input'),
  ]),
  conversation('EXP05-35', 'Excel VLOOKUP一直#N/A', 'code', 'clarification-loop', ['direct', 'missing-context'], [
    node('exp05-35-01', 'exp05-35', 'Excel VLOOKUP一直#N/A', '我的VLOOKUP明明写了 但一直返回#N/A 我检查了好几遍也没发现错在哪', [
      choice('exp05-35-01-01', '#N/A常见原因：查找值不在查找列、两列格式不一致（文本/数字）、或没有用绝对引用导致区域下移。', { awareness: 1 }),
      choice('exp05-35-01-02', '可以先用一个单元格单独验证查找值是否真的存在，再检查查找列是不是最左边那列。', { compliance: 1 }),
      choice('exp05-35-01-03', '公式写错了，重写一遍。', {}, 'misunderstanding'),
      choice('exp05-35-01-04', '如果你把公式和两列数据发我，我可以帮你定位具体是哪一类问题。', { empathy: 1, compliance: 1 }),
    ], 'direct', 'clarification-loop'),
    node('exp05-35-02', 'exp05-35', 'Excel VLOOKUP一直#N/A', '我看了 查找值确实有 但一个是文本一个是数字 是不是这个问题', [
      choice('exp05-35-02-01', '很可能。文本格式的数字和数值格式数字会被VLOOKUP视为不同值；可以用TEXT或VALUE统一格式。', { awareness: 1, compliance: 1 }),
      choice('exp05-35-02-02', '也可以直接在查找值旁边用一个单元格转换格式，再作为新的查找条件。', { compliance: 1 }),
      choice('exp05-35-02-03', 'VLOOKUP不会区分文本和数字，问题肯定在别处。', {}, 'misunderstanding'),
    ], 'missing-context', 'clarification-loop'),
  ]),
  conversation('EXP05-36', '电脑蓝屏代码看不懂', 'troubleshooting', 'clarification-loop', ['missing-context', 'direct'], [
    node('exp05-36-01', 'exp05-36', '电脑蓝屏代码看不懂', '电脑突然蓝屏 显示一串代码 我不知道什么意思 下次还会蓝屏吗', [
      choice('exp05-36-01-01', '蓝屏代码可以给你排查方向，但不能只看代码就断定；需要结合蓝屏前做了什么、是否反复出现。', { awareness: 1 }),
      choice('exp05-36-01-02', '如果只是偶尔一次，可以先观察；如果反复出现，记录代码和发生场景，再查驱动/内存/温度。', { compliance: 1 }),
      choice('exp05-36-01-03', '蓝屏就是电脑坏了，直接重装。', {}, 'overconfident'),
      choice('exp05-36-01-04', '可以把代码发我，我告诉你这个代码最常对应哪几类问题，但别把它当唯一结论。', { empathy: 1, awareness: 1 }),
    ], 'missing-context', 'clarification-loop'),
    node('exp05-36-02', 'exp05-36', '电脑蓝屏代码看不懂', '代码是IRQL_NOT_LESS_OR_EQUAL 网上说可能是驱动 但我不知道怎么查', [
      choice('exp05-36-02-01', '这个代码确实常和驱动/内存有关。可以先在设备管理器里看有没有带黄色感叹号的设备，再回忆蓝屏前是否更新过驱动。', { awareness: 1 }),
      choice('exp05-36-02-02', '也可以运行Windows内存诊断和查看近期更新记录，慢慢缩小范围。', { compliance: 1 }),
      choice('exp05-36-02-03', '这个代码就是内存坏了，直接换内存条。', {}, 'misunderstanding'),
    ], 'direct', 'clarification-loop'),
  ]),
]
