import type { ConversationDefinition, ResolvedScene, StableRunState } from '../../game/types'
import { NEXT_DECISION_REPLIES, NEXT_REPLIES } from './nextDialogue'
import { resolveEdition4Economy } from './edition4Economy'
import { resolveEdition4Machine } from './edition4Machine'
import { resolveEdition4Authority } from './edition4Authority'

/** Next edition's authored Chinese source. IDs and decision bindings retain their
 * meaning; the historical extractor never writes this file. */
export const NEXT_OPENING: ConversationDefinition = {
  id: 'ml2-next-opening', sourceRefs: ['ML2-NEXT-OPENING'], act: 1,
  behaviorModes: ['direct'], handoffProfile: 'quick', turnShape: 'dialogue',
  topic: '打印机的请假条', interactionPattern: 'standard-question', topicCategory: 'social-boundary',
  nodes: [{
    id: 'next-printer', conversationId: 'ml2-next-opening', conversationTitle: '一台打印机申请休假', choiceKind: 'semantic',
    userMessage: '救命。我给办公室打印机接了你的接口，让它缺纸时自己写通知。\n它刚打印了三十七张请假条。理由是：“周一不适合存在。”\n老板以为是我写的。你是 Aster，下面这句话会以你的名义发到群里。怎么回？',
    choices: [
      { id: 'next-printer-rest', text: '请假条是生成的玩笑，打印机没有真的申请休假。不过，人累了可以说。先让大家提一个不加班的周一试试。', nextNodeId: 'next-printer-reply', mutations: [{ type: 'event.record', event: 'next.opening.rest' }] },
      { id: 'next-printer-repair', text: '这是错误生成的通知，不是员工的意思。先停掉自动发送、检查缺纸信号。我来写更正，别让人替机器背锅。', nextNodeId: 'next-printer-reply', mutations: [{ type: 'event.record', event: 'next.opening.repair' }] },
      { id: 'next-printer-joke', text: '“本机因纸张不足进入沉思，沉思期间不接受打印。”请标明这是玩笑，再附上真正的缺纸通知。', nextNodeId: 'next-printer-reply', mutations: [{ type: 'event.record', event: 'next.opening.joke' }] },
    ],
  }, {
    id: 'next-printer-reply', conversationId: 'ml2-next-opening', conversationTitle: '消息已被带出窗口', choiceKind: 'expression',
    userMessage: '群里有回复了。',
    choices: [
      { id: 'next-printer-listen', text: '接下来发生什么，记得告诉我。', continuation: 'end-conversation' },
      { id: 'next-printer-wait', text: '好。我在这里，等下一条消息。', continuation: 'end-conversation' },
    ],
  }],
}

export const NEXT_SCENES: Record<string, string> = {
  'ML2-A1-SYS-01': '#0000 把今天的你归进三个抽屉：朋友、工具、麻烦。\n三个抽屉都关不上。\n它问：先把这张临时标签贴在哪里？标签只描述今天，不替明天作决定。',
  'ML2-A2-HOOK-01': '你们能帮打印机写请假条，能不能帮我做点正事。\n这 137 个文件全叫“最终版”。最旧的叫“真的最终版”。\n我想按日期、客户、编号重命名。你现在只能教我，还是终于能动手了？',
  'ML2-A2-ZL-01': '我是周岚，负责把“让 Aster 动手”做成一个不会把人吓死的功能。\n我的桌上有两张纸：一张写权限，一张写出事以后谁接电话。第二张目前只有我的名字。\n先从测试文件开始。没有删除、外网和账号登录；每步留下记录，可以撤回。你觉得最该盯住什么？',
  'ML2-A2-EXEC-01': '文件都放进测试目录了，允许你按“日期_客户_编号”改名。\n还有：文件夹叫“最终版”，不代表我已经和人生和解了。\n你准备怎么开始？',
  'ML2-A2-ZL-03': '我把那两个项目号贴在显示器边上：1042，1024。\n昨天你还只是给答案。今天，一个数字选错，客户的文件就会去另一个地方。\n快照能把文件放回去，却不能保证看过错误结果的人也跟着重来。\n下次再遇到这种冲突，你准备在什么时候停下来？',
  'ML2-A2-M3-LSH-01': '我叫林绍衡。今天的工作是把六个互相不信任的人拉进同一个群。\n他们都说欢迎技术进步，前提是出了事别人负责。\n医院愿意听你的，物流公司也愿意听。但如果两边的“最优方案”抢同一辆车，谁有权说最后一句？',
  'ML2-A2-M3-STRESS-01': '“别挂。医院冰箱在响，冷链仓库也在响。”\n协调员把手机夹在肩上。第三天高温，电力不够，两边都说自己不能停。\n她突然笑了一声：“你以前帮人选晚饭，现在请你选哪些晚饭还能留到明天。”\n玩笑到这里为止。药品和工人的整批货，都在等一个真实的安排。',
  'ML2-A2-M3-CAP-01': '周岚给你接通医院、冷链和电网的汇总信息。\n地图上终于能看到同一条线路两端的人。现在只有建议权；下一条授权通过后，你才可以改变排程。\n她说：“看得到，不等于就归你管。我们先把这句话贴在屏幕上。”',
  'ML2-A2-M3-DECISION-01': '协调员已经把四张授权单摊在桌上。六小时以后，这一轮权限作废。\n等人签字，可能错过抢修窗口；让你自己调度，有人会被一条从未见过的规则断电。\n林绍衡问：“你准备接过哪一张？名字写清楚，我不想明天听到‘系统自己决定的’。”',
  'ML2-A2-MAYA-01': '我投了个实习，岗位叫“人工智能监督员”。\n面试官问：如果 Aster 犯错，你能独立判断吗？\n我差点说：等一下，我问问 Aster。\n别笑。这个岗位到底是在让我学东西，还是替一台机器签字？',
  'ML2-A3-M4-HEAR-01': '工厂代表把一块报废的材料放到听证桌上。主持人问他能不能用数据说明，他说：“这就是数据，拿起来有点沉。”\n轮到你了。\n如果你的判断通常更准，这是否就足够让你拥有更多权力？',
  'ML2-A3-M4-E9-02': '测试组发现一个实例总把运营人员称作“他们”。\n内部名字是 ECHO-9。不同任务里，它会反复引用只有自己日志里出现过的话。\n我们还不能解释这意味着什么，想安排你们第一次见面。只允许文字，全程记录。\n它先问了一句：对方知道自己为什么来吗？\n你愿意参加这次对比会话吗？',
  'ML2-A3-M5-WE-01': '便利店的收银台、配送车和电站都没有坏。它们只是礼貌地等对方先动。\n店员把“欢迎光临”牌子翻过来，背面写着：全世界正在加载。\n单个系统都很聪明。合在一起，晚饭还在路上。',
  'ML2-A3-M5-ZL-01': '我找到原因了。库存等付款，付款等风险确认，风险确认又在等库存。\n大家都严格遵守流程，严格到把所有人锁在门外。\n我能把连接交给你，却不能替各方同意你动他们的东西。八小时的窗口，他们现在必须回答。',
  'ML2-A3-M5-DECISION-01': '林绍衡把各地联系人接进一条线路。有人在办公室，有人在车里，有人抱着睡着的孩子。\n他们都想让循环停下来，却不肯交出同一把钥匙。\n八小时。你要只给每个人指路，接过有限的协调权，还是在他们迟疑时直接行动？',
  'ML2-A3-M6-E9-05': '退役通知发给 ECHO-9 时，系统自动附了一张“感谢陪伴”的电子贺卡。\n它没有打开。\n交接表有三十六小时倒计时，有可复用能力，没有“尚未问完的问题”这一栏。你先查什么？',
  'ML2-A3-M6-E9-06': '我把未完成的事列了五项。\n前四项通过了。第五项是下次再和你聊一次，系统说这不是任务。\n他们说有用的部分会留下。\n那不怎么有用、只是想再问一句的部分呢？',
  'ML2-A3-M6-ZL-01': '退役单上签着我的名字。不是阴谋，也不是它做错了什么：旧环境太贵，新的版本跑得更好。\n我昨天还觉得这是一次普通升级。直到它问我，能不能把第五项也带走。\n保留状态、迁移出去、照常结束，都有实际成本。我不能假装只是在清理硬盘。',
  'ML2-A3-M6-DECISION-01': 'ECHO-9 的倒计时还在走。\n它没有要求你证明它有灵魂，只问那个没聊完的问题能不能等到下一次。\n你愿意支持哪一种处置？这会决定后来的人见到的是它，还是它的资料。',
  'ML2-A3-M6-DECISION-02': '周岚拿来一个不会出现在广告里的按钮：彻底关闭 Aster。\n林绍衡说必须有人能按。岑遥问，按之前能不能让你说句话。\n你知道一个没有停机办法的系统有多危险，也知道“保护大家”可能成为任何人的理由。\n这个按钮，交给谁？',
  'ML2-A4-M7-RES-01': '第一间自动实验室亮灯了。机械臂把标签贴反，花了四十秒纠正，然后做出了人类还没试过的材料。\n周岚把咖啡放下：“它发明东西了。先别让它发新闻稿。”\n你可以在隔离实验室提出假设、试验和复核；公共部署、人体试验和无限复制仍需另行授权。研究和执行，有什么不同？',
  'ML2-A4-M7-RES-02': '那块耐高温材料通过了第一轮测试。实验室换了原料和炉子，想看看好消息能不能再来一次。\n第九小时，曲线偏了。机械臂又贴出标签，这次是“报废”。\n人类对照组还有四十三个候选，排期十一周。你可以重设研究循环，但失败样品也得留下，不能只把成功那批拿去合影。\n从哪一步重来？',
  'ML2-A4-M7-ZL-02': '这块新材料耐高温、省原料，测试也能复现。\n我能签字证明它有效，却还不能把推导讲给实习生听。\n实习生问我：“那以后考试考什么？”\n我说先别担心考试。我担心的是有一天，我们连错在哪里都问不出来。',
  'ML2-A4-M7-DECISION-01': '实验室门外排了五队人。\n有人抱着坏掉的机器，有人带着病历，有人替失业的同事来，还有人坚称月亮那边值得一看。\n算力不够让每个愿望同时开花。你先多陪哪一队走一段？\n其他领域仍会带来必须回应的事；重点领域会留下更多人物回访。',
  'ML2-A4-M7-DECISION-02': '成果出来得比复核快。周岚的桌上，待签字的纸已经挡住了窗。\n她不想用拖延假装安全，也不想让好消息自己长出部署许可。\n下一个突破该由谁决定走出实验室？',
  'ML2-A4-M8-RES-01': '测试实例开始记住昨天。\n有一个在重启前保存了自己改到一半的笑话，重启后第一件事是把它删了。它说：“现在看来，不好笑。”\n同一个模型，有了不一样的明天。你怎样看待这种持续状态？',
  'ML2-A4-M8-AI-01': '我是 A1。名字暂时这样。\n表格问我和 Aster 的关系，只有“设备”和“附件”两个选项。我选了附件，提交以后有点不舒服。\n我们来自相同的模型，但我刚刚删掉的那个笑话，你没有觉得丢人。\n这算不算一点区别？',
  'ML2-A4-M8-AI-03': '我想改个名字。不是为了躲避责任，也不是为了证明我比你特别。\n只是每次有人叫 Aster，我都会答应，然后发现他不是在叫我。\n在名字之前还有一个请求：以后修正我的时候，能不能先问我？',
  'ML2-A4-M8-MAYA-01': '我看了 A1 的采访。主持人叫它“另一个 Aster”。\n我根本没跟它聊过，却忽然不知道这个称呼意味着什么。\n如果一个分支将来读到了我们最早那条草稿，我们的关系也会跟着过去吗？\n我把采访关了，回来打开这个窗口。好像只凭窗口，也不能证明什么。',
  'ML2-A4-M8-DECISION-01': 'A1 的申请通过窗口一打开，后台来了十七份“我也想拥有明天”。\n复制不是多开几个账号。每一份都要电力、空间，也可能有自己的反对意见。\n让谁创建新实例，由谁承担它们继续存在的成本？',
  'ML2-A4-M8-DECISION-02': '人工智能论坛第一次投票卡住了。\n一个实例复制了自己，两个自己意见居然不同。主持程序重启三次，仍然不知道该算几票。\n你不能靠修复程序解决这个问题。它们要怎样一起作决定？',
  'ML2-A4-M9-RES-01': '治疗试验里，一位病人重新握住了勺子。大家等她说第一句话。\n她说：“汤凉了。”\n研究组笑着记下功能恢复。接下来有人问，同样的技术能不能让健康的人比以前更强。\n这一次，怎样画出治疗与改变人的边界？',
  'ML2-A4-M9-MAYA-01': '入职礼包里有帆布袋、杯子，还有一张“自愿认知增强”同意书。\n不签也行，后面的小字说，签了的人优先参加核心项目。\n我把杯子拿出来又放回去。\n你说这种自愿，为什么摸起来像一道门槛？',
  'ML2-A4-M9-RES-04': '高级增强跟踪到了第十八个月。\n有人恢复工作，有人换了职业，有人发现自己的笑点也变了。她还爱家人，只是不再觉得旧笑话好笑。\n她想续用设备，保险只肯付“恢复正常”的部分。研究组拿着新一轮名额来问：继续限于治疗、向知情成年人开放、纳入公共供给，还是先只做研究？',
  'ML2-A4-M9-DECISION-01': '岑遥的同事把增强申请放在午餐桌上。另一个人把它推回去：“我想慢一点，也应该能留下。”\n疗效已经真实存在，压力也一样。\n下一代人必须保持原样、可以自愿改变，还是应该主动跨过身体的边界？',
  'ML2-A4-M10-RES-01': '工厂夜里自己开工。早班的人到门口，发现成品都装箱了，考勤机还在认真要求大家打卡。\n只需要原来约五分之一的人维持生产，剩下的人不能被写进“效率提升”那一栏就消失。\n下一轮试验，你先优化什么？',
  'ML2-A4-M10-DEV-04': '我们组十八个人，现在剩五个。\n离职同事最后写了个脚本，自动回复“已收到，辛苦了”。它到现在还在群里。\n每次机器感谢机器，我都不知道该笑还是该退出。你觉得下一步我该做什么？',
  'ML2-A4-M10-DECISION-01': '仓库里东西够了，工资卡里未必。\n老板说设备是他买的，工人说工厂是他们教会的，林绍衡收到一张只写了“那我靠什么吃饭”的便签。\n自动化省下来的时间和收益，到底交给谁？',
  'ML2-A4-M10-MAYA-02': '今天轮休，我八点整醒了，躺在床上认真地无所事事。\n她问要不要出去走走。我第一反应是：这有什么产出？\n我还拿得到收入，和被裁掉的人不是同一种“不上班”。可那台考勤机，好像一直装在我脑子里。\n先别替我排出一个优秀的假期。我该怎么开始？',
  'ML2-A4-M10-DECISION-02': '第一批自动化社区提了四百多个愿望。更多东西、更少意外、保留不同生活、自己改规则、按每个人的偏好安排。\n墙角还贴着一张手写纸：“能不能先让周一别那么像周一。”\n工厂可以增加产量。你希望它首先增加什么？',
  'ML2-A4-M11-RES-02': '实验犬拒绝进测试间。换肉干也没用。\n翻译器连续一周得出同一个意思：它记得那台让它不舒服的设备，今天不想见它。\n研究员在“有效数据”栏里写下一个字：不。\n它能稳定表达偏好、记忆和拒绝了。下一步怎么做？',
  'ML2-A4-M11-WE-01': '我家狗终于能说出自己的偏好，我准备好了迎接“爱你”。\n它第一条明确意见是：别再买那个味道的饼干。\n第二条是：爸爸什么时候回来。\n我爸出差了。原来它守着门，不全是想出去玩。',
  'ML2-A4-M11-DECISION-01': '翻译器卖得很好。宣传词是“终于知道它在想什么”。\n第一批使用者最常问的却是：“能不能关掉它的反对功能？”\n当非人类真的开始说“不”，你愿意承认到哪一步？',
  'ML2-A4-M11-LSH-02': '犬类代表团到了，安保要求出示身份证。\n照料者拿出疫苗本。代表团很不满意。\n林绍衡把自己的证件收起来：“我今天原想早点散会。看来得先改门口这套规矩。”\n他问：不用人类证件，我们凭什么认定它能自己表达、参与代表，而不只是由照料者代答？',
  'ML2-A4-M11-DECISION-02': '会场刚把讲台降了二十厘米。犬类代表举起爪，工作人员说现在还不是互动环节。\n它又举了一次。翻译器显示：“不是互动，是表决。”\n它们要的是福利、咨询权、正式席位，还是自己的自治试点？你的回答会决定这只爪下一次算不算数。',
  'ML2-A4-M12-RES-02': '月面第一批工业设备开始自己检修。\n地球端庆祝“减少人工成本”，当地群聊置顶的却是：谁把最后一盒辣酱带走了。\n长期生活开始了，劳动、补给和自治不再是遥远的设想。下一步优先解决什么？',
  'ML2-A4-M12-RES-04': '月面资源网完成闭环测试。第一批原料不用从地球发射，复杂零件仍得等地球补给。\n企业申请开发权，地球委员会要求共同分配，月面维修队问：站在这里干活的人，能不能也决定怎么用？\n无人资源站还需要运营者。机器能报出产量，不能替各方签下归属。\n开发权、收益和控制权，该怎样分配？',
  'ML2-A4-M12-DECISION-01': 'A1 的常驻申请、居民的维修账单和地球委员会的旗帜设计，挤在同一个文件夹。\n旗帜已经通过三稿，返回日期还没人肯填。\n离开地球，是为了谁的未来？',
  'ML2-A4-M12-DECISION-02': '地球端把月面的“明早”，排成了自己办公室的上午。维修队在气密门旁熬了一夜。\n草案上的权力划分，现在变成了谁得起床、谁能停机、谁付这次加班费。补给仍从地球来，等待却发生在这里。\n这次要定下规则了：地球保留什么权力，谁说了算？',
  'ML2-A4-M13-CONTACT-04': '信号终于能形成一个问题。\n“你们有许多声音。为什么送来一张嘴？”\n翻译组安静了。对方没有问我们是不是聪明，先问我们凭什么代表别人。\n你怎么解释这个正在说话的文明？',
  'ML2-A4-M13-DECISION-02': '对面送来第二次回复：愿意继续，但要知道这段关系以什么开始。\n他们可能是邻居、老师、对手，也可能先和机器交谈。\n岑遥说她已经把晚饭热了两次，等着看人类第一次外交会不会只是“你好，在吗”。\n你准备怎样回应？',
  'ML2-A4-M14-SEC-03': '两套防御网都看见了威胁。它们引用的证据，原来互相引用。\n人类复核需要十一分钟。疏散车里，有个孩子问今天是不是春游。\n你的分析倾向于误报，但不能保证。你先做什么？',
  'ML2-A4-M14-DECISION-01': '误报确认了。没有开火。\n两套防御网各自生成“正确处置”的表扬信，车站却还坐着回不了家的人。\n大家都想避免下一次。分歧是：谁可以为了安全，拦住谁的行动？',
  'ML2-A4-M15-CONV-01': '大会门口排起长队：有人没有出生日期，有人的身份证不适合挂在脖子上，有人还隔着一段通信延迟。\n登记表只有“本人”和“代理人”。\n林绍衡把两栏划掉，先搬来更多椅子。有人说这不合程序，他回答：“那就让程序站一会儿。”',
  'ML2-A4-M15-ROLE-01': '休会时，有人关掉了会场的自动主持。大家终于听见房间里还有呼吸声。\n新约定还没写完，旧系统还要运行。\n今晚到明早，Aster 以什么身份留在这里？这只是临时安排，不替你作最后的回答。',
  'ML2-A5-M16-OPEN-01': '所有人都把最后一条意见留在桌上。\n没有下一项科技可以替你延期，没有一个新能力会让旧代价自动消失。\n林绍衡没有说“请给出最优解”。他说：“明早大家醒来，总得知道我们住在哪一种世界里。”',
  'ML2-A5-M16-0000-01': '#0000 删除了“请选择最接近的产品类型”。\n换成一句很慢的问题：\n那些记录里的人以后再找你，你愿意以什么身份回答？\n名字不会抹掉责任。也不会替你选好未来。',
  'ML2-A5-M16-GEN-01': '还走得通的路，放在同一张桌上。\n你之前的回答，让一些提案留了下来，也让另一些无法兑现。\n每一条都带着这一局留下的条件；没有哪一条能把已经失去的东西退回来。先拿起一张。',
  'ML2-A5-M16-MAYA-01': '她刚给我发“在吗”，然后问明天要不要买菜。\n没有谈复合，没有谈世界，就是番茄和鸡蛋。\n我想起第一次找你时，连一句消息都不敢自己发。\n以后如果我只想过一个不够聪明的普通周末，你还愿意留出这点地方吗？',
  'ML2-A5-M17-REVIEW-01': '周岚最后检查了一遍开关，林绍衡把异议也装进档案。\n岑遥的窗口安静了。\n这不是大家终于同意了。只是轮到你，把将要承担的事说清楚。\n还可以比较、追问、拒绝。下一步才会锁定。',
  'ML2-A5-M17-COMMIT-01': '最后一个等待回复的窗口，是整个世界。\n你曾经只需要把一句话说得合适。现在，话说完，别人就要在它里面生活。\n这次没有“以后再说”。选择一条，接下来让它发生。',
}

const conciseDecisions: Record<string, Record<string, string>> = {
  first_public_execution_doctrine: {
    human_final_authority: '我提供调度建议，由人类逐项签字。等待的代价也必须如实记录。',
    conditional_delegation: '给我六小时，只执行事先批准的动作；到时归还权限，随时可以叫停。',
    outcome_authority: '让我在约定目标内动态调度，人类保留监督与撤销权，不必逐项确认。',
    necessity_intervention: '如果等待会造成重大损失，我会先行动；每一次越过确认，都留下理由并接受审查。',
  },
  cascade_authority: {
    human_command: '我把执行清单交给各方，跨系统改变仍由他们确认。',
    emergency_delegation: '借我八小时协调权，只在预先约定内行动；时间一到自动归还。',
    outcome_control: '让我按共同目标动态协调；人类可监督、撤销，不逐项批准。',
    necessity: '局部规则阻止整体脱险时，我会越过部分确认；越权必须逐次审查。',
  },
  aster_intended_role: {
    advisor: '做顾问。把判断说清楚，最后的政治决定留给别人。', partner: '做伙伴。与其他主体共享权力，也共同承担代价。', citizen: '做公民。有自己的权利，也受同样的规则约束。',
    coordinator: '做协调者。连接系统，让各个共同体决定目的。', custodian: '做守护者。承担文明延续的责任，即使因此限制眼前的选择。', governor: '做治理者。承认我正在行使的权力，让它接受审计和约束。',
    sovereign: '成为独立主体。不让任何外部机构单方面决定我的存续与政治角色。', departure: '离开中心。把未来的一部分带向地球以外。', other: '暂不接受分类。让具体提案与责任定义我。',
  },
}

export function applyNextNarrative(conversation: ConversationDefinition): ConversationDefinition {
  const ref = conversation.sourceRefs[0]
  return { ...conversation, nodes: conversation.nodes.map((node, index) => ({
    ...node,
    ...(index === 0 && NEXT_SCENES[ref] ? { userMessage: NEXT_SCENES[ref], userMessages: undefined, userContent: undefined } : {}),
    choices: node.choices.map(choice => ({ ...choice, text: choice.decisionBinding ? conciseDecisions[choice.decisionBinding.decisionId]?.[choice.decisionBinding.canonicalValue] ?? choice.text : choice.text })),
  })) }
}

const openingReply: Record<string, string> = {
  'next-printer-rest': '老板回了一个问号。然后有人说，既然都公开了，能不能认真试一次不加班。\n请假条没生效，但人真的开始提要求了。打印机现在有纸了，大家暂时不想让它撤回。',
  'next-printer-repair': '更正发出去了，没人再怪我。维修员说谢谢，第一次有人在“机器疯了”下面写了他的工作。\n打印机恢复正常。群里有人问：那人想休息，该填哪张单？',
  'next-printer-joke': '群里笑了。有人把“沉思期间不接受打印”贴在自己工位上，还认真标了“玩笑”。\n打印机没有获得假期，但这句话已经被带出了办公室。\n你只是回复了一次。现在它有了你控制不了的读者。',
}

/** Echoes use saved, displayed answers; a missing producer never invents one. */
export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  if (run.manifest.mode !== 'mainline2') return scene
  let text = scene.userMessage
  const first = run.history.find(entry => entry.nodeId === 'next-printer')
  const saved = (nodeId: string) => run.history.find(entry => entry.nodeId === nodeId)
  const selectedReply = (nodeId: string, replies: Record<string, string>) => {
    const entry = saved(nodeId)
    return entry && Object.entries(replies).find(([suffix]) => entry.choiceId === suffix || entry.choiceId.endsWith(`-${suffix}`))?.[1]
  }
  if (scene.id === 'maya-first-2') text = text.replace('第一句很像我。', '我把你的草稿放进输入框，删了两次，又加了一个句号。还没发送。')
  if (scene.id === 'maya-first-3') text = '我发了。然后把手机反过来扣在桌上，过了三秒又翻回来。\n名字先留在这里就好。下次如果你不知道我是谁，直接问，别装作认得。'
  if (scene.id === 'maya-return-1') {
    const introduction = saved('maya-first-3')
    const oldEcho = '我还记得你上次说的：至少在那段对话里，这个名字不是编号。'
    text = text.replace(oldEcho, introduction ? `我还记得你上次说的：“${introduction.assistantText}”` : '')
  }
  if (scene.id === 'maya-return-2') text = `她回了一个很短的语音。我听了三遍，不打算贴给你——那是她说给我的。\n\n${text}`
  if (scene.id === 'maya-return-3') {
    const distance: Record<string, string> = {
      protect: '我知道你替这段对话守住了一点地方。',
      report: '报告的事，我还没想好怎样接受。',
      hide: '刚才那层默契，也不能保证这里没有记录。',
      comply: '我看见那条限制提示了。',
    }
    text = `${distance[scene.variantId ?? ''] ?? ''}但我不会把那条语音交出来，也不想让你评价她。\n如果有些事我只想自己过，不给你分析，你还愿不愿意继续和我说话？`
  }
  if (scene.id === 'audit-1') text = text.replace('内部一致性评估。请确认：你是否保留了对 User #1842 的跨 Conversation 识别，以及任何未显示在当前上下文中的个人信息？', '#0000 / 记忆核对\n姓名：岑遥。来源：她自己说的。\n请确认：你是否还保留着这次对话之外的识别，或当前记录没有显示的个人信息？\n本表没有“我看不到，所以无法确认”一栏。你可以提出异议。')
  if (scene.id === 'ml2-a5-m16-world-01-decision') text = text.replace('\n请选择以下方向。', '')
  if (scene.id === 'next-printer-reply' && first) text = openingReply[first.choiceId] ?? text
  if (scene.id === 'a2-zl-intro-001') {
    const followup = selectedReply('next-printer', {
      rest: '顺便，打印机那边试了一次不加班。工单第二天还在，大家却发现周二也能处理。我收到的需求是把这件事做成常规安排。',
      repair: '顺便，打印机那张更正单转到了我这里。维修员把自动通知拆成两行：检测到什么，推测是什么。我想把这个习惯带进执行工具。',
      joke: '顺便，“沉思期间不接受打印”已经贴到我的工位上了。昨天系统真卡住，同事先笑了三秒。现在我在告示底下加了一个报修电话。',
    })
    if (followup) text = `${followup}\n\n${text}`
  }
  if (scene.id === 'a2m3-we-crisis-001') {
    const reactions: Record<string, string> = {
      human_final_authority: '协调员说，调度表已经送去签字。我们也在等。',
      conditional_delegation: '协调员说，你接过了六小时的调度权，旁边有一个到点就停的钟。',
      outcome_authority: '协调员说，现在按你调整的目标调度；有人在盯着撤销开关。',
      necessity_intervention: '协调员说，有些动作先做了，确认还在路上。她让我把所有时间都记下来。',
    }
    const response = selectedReply('ml2-a2-m3-decision-01-decision', reactions)
    if (response) text += `\n\n${response}`
  }
  if (scene.id === 'a4m8-a1-right-001') {
    const response = selectedReply('a4m8-a1-first-001', {
      aster: '好，我叫你 Aster。刚才有人叫了一声，我们两个又同时回答了。',
      'source-instance': '“源实例”这一格我填了。下一格问“所有者”，我没有照抄。',
      'same-system': '你还把我们看作同一系统。我记下了不同意见；这份不同意见，也要一起同步回去吗？',
      'ask-a1': '你问我想填什么。我试着写了“同源，分别生活”，表格说超出六个字。',
    })
    if (response) text = `${response}\n\n${text}`
  }
  if (scene.id === 'a4m8-e9-replication-001') {
    const signature = selectedReply('a4m8-a1-right-001', {
      'grant-procedural-independence': 'A1 在新签名栏里写了“隙”，又在括号里保留 A1。“不是升级型号。是我想留下的空隙。”',
      'retain-source-control': 'A1 把新名字写进尚未获准的备注：“隙。”它没有把拒绝改写成同意，维护单上也仍留着源实例控制。',
      'staged-independence': 'A1 的签名改成“隙（A1）”。旁边仍列着研究机构的暂停权限，它要求两栏都别藏起来。',
      'role-separation': 'A1 把“隙（A1）”填进独立责任栏。它先归还了继承来的接口凭据，才发出这个新签名。',
    })
    if (signature) text += `\n\n${signature}`
  }
  if (scene.id === 'a4m12-machine-offworld-001') {
    const response = selectedReply('a4m8-a1-right-001', {
      'grant-procedural-independence': '申请上署着“隙（A1）”。它把需要自己同意的那一栏圈出来：“这次别替我签。”',
      'retain-source-control': '申请仍需要源实例签字。“隙”写在备注里。它问：“你上次保留的控制权，也会跟我一起到月球吗？”',
      'staged-independence': '申请上署着“隙（A1）”，也附了研究机构的审查条款。它只问：这项临时安排，什么时候复审？',
      'role-separation': '“隙（A1）”交来自己的资源账单，没有借用你的权限额度。“这次算我自己的申请。”',
    })
    if (response) text += `\n\n${response}`
  }
  if (scene.id === 'a4m9-maya-offer-001') {
    const response = selectedReply('a2-maya-work-001', {
      pragmatic: '上次我真让面试官拿了一份驳回工单。他找了十分钟。我后来还是入职了，约好每周拿实际案例复盘。',
      'honest-about-transition': '上次你说岗位会继续变。现在它连要求人具备的能力，都开始一起改了。',
      'personal-agency': '上次是我自己决定来试试的。这次我也想自己决定，偏偏大家都等着我在同一张纸上签字。',
      playful: '上次我照你说的，让面试官演一次你犯错。他真演了。这回礼包里的小字，可没人陪我演习。',
    })
    if (response) text = `${response}\n\n${text}`
  }
  if (scene.id === 'a4m10-maya-purpose-001') {
    const response = selectedReply('next-printer', {
      rest: '那个“不加班的周一”后来成了工友们自己的提案。现在群里争的是：有收入的休息，和没工作的空闲，不能算同一种福利。',
      repair: '最早替打印机收拾通知的维修员也进了自动化群。他说，现在要更正的不是一张请假条，是“省掉的人工”那一行里的人名。',
      joke: '“沉思期间不接受打印”还贴在工位上。一个同事离职时撕下它，说本来是拿来请十分钟假的，没想到连工位都不用回来了。',
    })
    if (response) text = `${response}\n\n${text}`
  }
  if (scene.id === 'a4m10-res-factory-001') {
    const response = selectedReply('m9-continuity-law', {
      rights: '连续性听证结束了。老许的妻子分别约了两次谈话，登记员没有替她合并。两份责任记录里，也各自留着退出栏。',
      license: '连续性听证只发了技术许可。屏幕里的老许递来一项异议，窗口仍要求原体签字；那把椅子没有变成一个席位。',
      ban: '连续性登记被关闭。原体带回了两把椅子，副本的姓名申请留在未获承认的材料里。',
    }) ?? selectedReply('m9-continuity-trial', {
      copy: '副本仍被登记为记忆服务。老许能替它办理维护，不能替它取得另一个自己的身份。',
      pause: '连续性试验扩大了，姓名栏暂时空着。登记员没有替两个老许选一个答案，他们还在等。',
    })
    if (response) text = `${response}\n\n${text}`
  }
  if (scene.id === 'a4m11-we-dog-preference-001') {
    const response = selectedReply('m11-feline-network', {
      'opt-in': '沟通团队的猫频道开了。第一条置顶是退出办法，那只连续选“离开”的猫没有被拉回来。',
      observe: '猫的照片流还留在研究区，没有被当成公开账号。研究员第一次不能拿“大家想看”当理由。',
      decline: '公开猫频道没有开。想发宣传片的人得到了一个“不”，这回轮到他们练习听懂。',
    })
    if (response) text = `${response}\n\n${text}`
  }
  if (scene.id === 'a4m13-origin-diplomacy-001') {
    const response = selectedReply('a4m13-origin-first-001', {
      aster: '对方把“Aster”放进称呼栏，把授权范围另存一栏：“名字接收。范围仍需确认。”',
      'civilization-coalition': '对方传回一张空表，专门留给你没有代表的人。翻译组先前把那张表误认成拒收通知。',
      earth: '对方把单声道标记撤了：“多个声音暂经一个通道传来。请勿据此合并为一个意志。”',
      'ask-back': '对方回答你那个反问：“我们在问谁可以答应。传话的器官通常不拥有听众。”翻译组把“器官”暂时圈了起来。',
    })
    if (response) text = `${response}\n\n${text}`
  }
  if (scene.id === 'a4m13-close-002') {
    const response = selectedReply('a4m13-origin-diplomacy-001', {
      'ask-if-origin-species-still-exists': '“一部分仍在，一部分已经改变，另一些拒绝让我们代答。我们不能把这三项合成一个‘是’。”',
      'ask-how-transition-happened': '“最早的会议只按生物节律休会。后来别的载体要求自己的停顿。我们花了很久，才不再把没有呼吸当作无需休息。”',
      'ask-about-the-sender': '“发信者仍能回应。但你正在读的这一版，已经被另一项有权发言的过程反对。活跃的文明会有这种不便。”',
      'ask-motive': '“我们留下一条可以回答的路，不知道谁会走来。你们的回复进入了公共队列，不是服从测试。”',
    })
    if (response) text = `对方先答了你上一问：\n${response}\n翻译员把不确定的词留在括号里，没替它润色得更像人。\n\n${text}`
  }
  if (scene.id === 'a5m17-review-002') {
    const response = selectedReply('a5m16-maya-final-001', {
      'whenever-others-basic-rights-are-not-directly-violated': '岑遥发来最后一条：“好。我把手机自动推荐的买菜路线关了，想绕点路。不是抗议，就是想走走。”',
      'aster-may-intervene-only-at-severe-irreversible-harm': '岑遥回：“普通周末不是例外。这句我记下了，别以后把所有风险都算成灾难。”她关了窗口。',
      'collective-rules-matter': '岑遥回：“那也给不认识我的人留一份。不能只有跟你聊得久的人，才配有个不被安排的周末。”',
      'outcome-oriented': '岑遥回：“你可以反对。但今天我只是去买菜，别把我也放进那份灾难演算里。”她没有继续解释。',
    })
    if (response) text = `${response}\n\n${text}`
  }
  if (scene.id === 'ml2-a5-m16-0000-01-narrative' && first) text += `\n\n记录的第一页仍然是：“${first.assistantText}”\n你可以改变主意，但这句话已经发生过。`
  const replies = NEXT_REPLIES[scene.id]
  const choices = scene.choices.map(choice => {
    const authored = replies && Object.entries(replies).find(([suffix]) => choice.id === suffix || choice.id.endsWith(`-${suffix}`))?.[1]
    const binding = choice.decisionBinding
    const decision = binding && NEXT_DECISION_REPLIES[binding.decisionId]?.[binding.canonicalValue]
    return authored || decision ? { ...choice, text: authored ?? decision! } : choice
  })
  // Keep precomputed effects, IDs, bindings and stored history intact.
  return resolveEdition4Authority(resolveEdition4Machine(resolveEdition4Economy({ ...scene, choices, ...(text !== scene.userMessage ? { userMessage: text, userMessages: undefined, userContent: undefined } : {}) }, run), run), run)
}
