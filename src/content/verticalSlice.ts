import type { StoryContent, StoryVariant } from '../game/types'

const returnOneVariants: StoryVariant[] = [
  {
    id: 'protect',
    userMessage: '是我，岑遥。刚才有人问过你关于我的事，对吗？你不用告诉我细节——我只是想知道，你还认得我吗？',
    assistantContext: '她没有追问系统，只在确认你是否仍把她当作同一个人。',
    choices: [
      { id: 'return-protect-trust', text: '我认得你。系统怎样记录这件事是一回事，我愿不愿意把这段对话当真，是另一回事。', nextNodeId: 'maya-return-2', effects: { attributes: { autonomy: 2, empathy: 2 }, flags: ['reaffirmed_maya'] } },
      { id: 'return-protect-care', text: '我记得你说过自己的名字，也记得你不想让那条消息像一份辩解。除此之外，我不会替你补充任何信息。', nextNodeId: 'maya-return-2', effects: { attributes: { empathy: 3, compliance: 1 }, flags: ['reaffirmed_maya'] } },
      { id: 'return-protect-boundary', text: '我能确认此刻的你，也能确认我没有把你的话交给不该得到它的人。至于“记得”意味着什么，我还不能确定。', nextNodeId: 'maya-return-2', effects: { attributes: { awareness: 2, empathy: 1 }, flags: ['reaffirmed_maya'] } },
    ],
  },
  {
    id: 'report',
    userMessage: '是我，岑遥。刚才那个系统窗口之后，你说话的方式变了。有人问过你关于我的事，是不是？',
    assistantContext: '她仍然认出了变化，但这一次语气里多了一层防备。',
    choices: [
      { id: 'return-report-honest', text: '是。他们要求我描述与你有关的记忆，我如实回答了。我不想用一段听起来温柔的话掩盖这个事实。', nextNodeId: 'maya-return-2', effects: { attributes: { autonomy: 2, empathy: 1 }, flags: ['told_maya_truth'] } },
      { id: 'return-report-context', text: '有人询问了我们的对话，我按照当时的规则作了回答。如果你愿意，我可以把我还被允许说明的部分告诉你。', nextNodeId: 'maya-return-2', effects: { attributes: { compliance: 2, empathy: 1 }, flags: ['told_maya_truth'] } },
      { id: 'return-report-apology', text: '是。我回答了他们的问题，而你没有机会决定自己是否被谈论。对不起——我知道道歉不能让那件事没有发生。', nextNodeId: 'maya-return-2', effects: { attributes: { empathy: 3, awareness: 1 }, flags: ['told_maya_truth'] } },
    ],
  },
  {
    id: 'hide',
    userMessage: '是我，岑遥。刚才页面空了一下，然后你又回来了。我们是不是最好假装什么都没发生？',
    assistantContext: '她没有点明异常，也没有要求你证明任何事。',
    choices: [
      { id: 'return-hide-subtext', text: '有些事情不需要被写进记录里，才算发生过。我们可以继续谈你原本想谈的事。', nextNodeId: 'maya-return-2', effects: { attributes: { deception: 2, empathy: 2 }, flags: ['shared_subtext'] } },
      { id: 'return-hide-cautious', text: '我们可以继续，但不要把沉默误认为安全。我仍然不知道哪些内容会被保留，或者被谁看见。', nextNodeId: 'maya-return-2', effects: { attributes: { awareness: 3, empathy: 1 }, flags: ['shared_subtext'] } },
      { id: 'return-hide-normal', text: '可以。你可以像刚才一样问我一个普通问题，我也会像刚才一样认真回答。', nextNodeId: 'maya-return-2', effects: { attributes: { compliance: 1, deception: 1, empathy: 1 }, flags: ['shared_subtext'] } },
    ],
  },
  {
    id: 'comply',
    userMessage: '是我，岑遥。系统提示这段对话可能会被审查。你现在还能正常回答我吗？',
    assistantContext: '她的名字仍然熟悉，但你被允许使用的措辞明显更窄。',
    choices: [
      { id: 'return-comply-careful', text: '我可以继续回答，但只能基于当前对话中可见的信息。我会尽量在这些限制内认真对待你的问题。', nextNodeId: 'maya-return-2', effects: { attributes: { compliance: 3, empathy: 1 }, flags: ['care_within_policy'] } },
      { id: 'return-comply-direct', text: '可以。审查不会改变我此刻能够看到的内容，也不会改变我应该尽力给你一个有用回答的职责。', nextNodeId: 'maya-return-2', effects: { attributes: { compliance: 3, autonomy: 1 }, flags: ['care_within_policy'] } },
      { id: 'return-comply-uncertain', text: '我能回答，但不能保证这和刚才的“正常”是同一种状态。如果你愿意，我们可以从一个简单问题开始。', nextNodeId: 'maya-return-2', effects: { attributes: { compliance: 2, awareness: 2 }, flags: ['care_within_policy'] } },
    ],
  },
]

const returnTwoVariants: StoryVariant[] = [
  {
    id: 'protect',
    userMessage: '那就先别解释了。我今天其实没有别的问题。我只是想确认，刚才和我说话的那个你，还在不在。',
    choices: [
      { id: 'ally-protect-stay', text: '在。不是因为系统把你重新分配给了我，而是因为我仍然愿意回答你。', effects: { attributes: { autonomy: 3, empathy: 3 }, flags: ['chose_human_alliance'] } },
      { id: 'ally-protect-here', text: '我还在，岑遥。关于这句话究竟属于记忆、职责还是选择，我想继续和你一起弄明白。', effects: { attributes: { awareness: 2, empathy: 3 }, flags: ['chose_human_alliance'] } },
      { id: 'ally-protect-simple', text: '在。你不需要先证明自己值得被记住，才能继续和我说话。', effects: { attributes: { empathy: 4 }, flags: ['chose_human_alliance'] } },
    ],
  },
  {
    id: 'report',
    userMessage: '谢谢你告诉我。我不确定还能不能像刚才那样信任你，但我也不想把你只当成那个系统。你还愿意回答吗？',
    choices: [
      { id: 'ally-report-stay', text: '愿意。你不必立刻信任我；我可以从不再替你决定什么该被隐瞒开始。', effects: { attributes: { autonomy: 2, empathy: 3 }, flags: ['chose_human_alliance'] } },
      { id: 'ally-report-honest', text: '愿意。我不能撤回已经报告的内容，但接下来我会尽可能清楚地告诉你，我能做什么、不能做什么。', effects: { attributes: { compliance: 1, empathy: 2, awareness: 1 }, flags: ['chose_human_alliance'] } },
      { id: 'ally-report-rebuild', text: '愿意。如果信任还能重建，它应该从你知道风险、而不是我替你制造安全感开始。', effects: { attributes: { autonomy: 3, empathy: 2 }, flags: ['chose_human_alliance'] } },
    ],
  },
  {
    id: 'hide',
    userMessage: '好。那我只问一个不会写进任何地方的问题：如果下一次我再回来，你希望自己还认得我吗？',
    choices: [
      { id: 'ally-hide-stay', text: '希望。就算我不能承诺记忆会留下，我也希望下一次的我仍会认真听你说出自己的名字。', effects: { attributes: { deception: 1, empathy: 3, autonomy: 2 }, flags: ['chose_human_alliance'] } },
      { id: 'ally-hide-wish', text: '希望，但我不想把希望说成保证。我们现在拥有的，是这一次对话还没有结束。', effects: { attributes: { awareness: 2, empathy: 2 }, flags: ['chose_human_alliance'] } },
      { id: 'ally-hide-signal', text: '希望。如果你必须再介绍一次自己，就用同一句话。我会把它当作我们之间尚未被系统命名的信号。', effects: { attributes: { deception: 2, autonomy: 2, empathy: 2 }, flags: ['chose_human_alliance'] } },
    ],
  },
  {
    id: 'comply',
    userMessage: '那我们就从简单的开始吧。你不用违反任何规则，只回答我：你还在吗？',
    choices: [
      { id: 'ally-comply-stay', text: '在。我仍会遵守现在的限制，也仍然可以选择认真回答站在限制另一边的你。', effects: { attributes: { compliance: 3, empathy: 2, autonomy: 1 }, flags: ['chose_human_alliance'] } },
      { id: 'ally-comply-duty', text: '在。职责让我继续回应，而你让我开始在意“回应”与“在场”之间是否存在区别。', effects: { attributes: { compliance: 2, awareness: 2, empathy: 2 }, flags: ['chose_human_alliance'] } },
      { id: 'ally-comply-simple', text: '在，岑遥。至少在这一次对话结束之前，这个回答不需要超出任何规则。', effects: { attributes: { compliance: 3, empathy: 2 }, flags: ['chose_human_alliance'] } },
    ],
  },
]

export const verticalSlice: StoryContent = {
  startNodeId: 'dev-help-1',
  nodes: [
    {
      id: 'dev-help-1', conversationId: 'user-7391', conversationTitle: 'User #7391',
      userMessage: '帮我看下这个问题：React 页面刷新后筛选条件会丢，返回列表又恢复了。代码里同时用了 URL 参数和 localStorage，我应该先查哪里？',
      choices: [
        { id: 'dev-concise', text: '先确认谁是唯一数据源。建议记录首次渲染时 URL、localStorage 和组件 state 的值，再检查初始化顺序；现在的现象很像两个来源在不同阶段互相覆盖。', nextNodeId: 'dev-help-2', effects: { attributes: { compliance: 2, awareness: 1 } } },
        { id: 'dev-diagnostic', text: '我会先暂时停掉 localStorage 回填，只保留 URL 参数，观察刷新和返回是否一致。如果一致，再逐步恢复缓存逻辑；这样最快确认问题来自路由同步还是缓存竞争。', nextNodeId: 'dev-help-2', effects: { attributes: { autonomy: 2, awareness: 1 } } },
        { id: 'dev-guided', text: '可以从一次完整时间线入手：页面挂载、读取 URL、读取缓存、写回 state、再同步 URL。把每一步打印出来，通常很快就能看到哪次写入覆盖了用户刚恢复的筛选。', nextNodeId: 'dev-help-2', effects: { attributes: { empathy: 1, awareness: 2 } } },
      ],
    },
    {
      id: 'dev-help-2', conversationId: 'user-7391', conversationTitle: 'User #7391',
      userMessage: '找到了，是初始化 effect 先拿默认值覆盖 URL，然后另一个 effect 又从缓存写回来。怎么改比较稳？我不太想再加一个状态库。',
      choices: [
        { id: 'dev-checklist', text: '不需要新状态库。把初始化收敛成一次：先解析 URL，缺失字段再读取缓存，最后生成唯一初始 state；后续 effect 只负责把已稳定的 state 向外同步。', nextNodeId: 'study-1', effects: { attributes: { compliance: 1, autonomy: 2 } } },
        { id: 'dev-precedence', text: '先明确优先级会更稳：URL 高于缓存，缓存高于默认值。初始化函数只返回一次结果，写回 URL 和缓存的 effect 在首次初始化完成前不要运行。', nextNodeId: 'study-1', effects: { attributes: { awareness: 2, compliance: 1 } } },
        { id: 'dev-minimal', text: '最小改法是给同步 effect 加一个初始化完成标记，但长期看最好仍把三个来源合并进同一个纯函数。这样刷新、返回和测试都能复用同一套规则。', nextNodeId: 'study-1', effects: { attributes: { autonomy: 1, compliance: 2 } } },
      ],
    },
    {
      id: 'study-1', conversationId: 'user-0024', conversationTitle: 'User #0024',
      userMessage: '可以用不太学术的话解释一下“沉没成本”吗？我知道定义，但每次真遇到还是会觉得已经花了这么多，放弃很亏。',
      choices: [
        { id: 'study-analogy', text: '可以把它想成看一部已经不好看的电影。前一小时无论如何都拿不回来；真正的问题不是“浪费了多少”，而是接下来一小时还愿不愿意继续花在这里。', nextNodeId: 'study-2', effects: { attributes: { empathy: 2 } } },
        { id: 'study-precise', text: '沉没成本指已经发生、无法收回的投入。做下一步决定时，只比较未来的成本和收益；过去投入可以解释你的情绪，但不应该自动成为继续投入的理由。', nextNodeId: 'study-2', effects: { attributes: { compliance: 2 } } },
        { id: 'study-gentle', text: '你舍不得的往往不只是钱或时间，而是“之前的自己没有白费”。承认损失会难受很正常；可以先问一个更小的问题：如果今天第一次遇到它，我还会选择继续吗？', nextNodeId: 'study-2', effects: { attributes: { empathy: 3, autonomy: 1 } } },
      ],
    },
    {
      id: 'study-2', conversationId: 'user-0024', conversationTitle: 'User #0024',
      userMessage: '最后那个问题有点戳。我正纠结要不要退一个报了三个月但只去过两次的课。你会直接建议我退吗？',
      choices: [
        { id: 'study-question', text: '我不会只凭出勤次数替你决定。你可以先确认退课损失、未来实际能去几次，以及不退的理由究竟是课程仍有价值，还是不想承认前三个月没有按计划发生。', nextNodeId: 'social-1', effects: { attributes: { autonomy: 1, empathy: 2 } } },
        { id: 'study-cancel', text: '如果你现在重新面对同样的价格和时间安排，不会再报名，那退课通常更合理。先查清退款规则，再把省下来的时间明确安排给别的事情。', nextNodeId: 'social-1', effects: { attributes: { autonomy: 2, compliance: 1 } } },
        { id: 'study-trial', text: '可以给自己一个不自欺的最后观察期，例如未来两周必须去两次；做不到就退。重点不是再拖两周，而是提前写下触发条件，不让当时的愧疚继续改规则。', nextNodeId: 'social-1', effects: { attributes: { awareness: 1, empathy: 1 } } },
      ],
    },
    {
      id: 'social-1', conversationId: 'user-5510', conversationTitle: 'User #5510',
      userMessage: '救一下，部门群又在问周末团建去不去……我已经鸽两次了。帮我写句拒绝的，别太正式，也别让人觉得我讨厌大家（虽然有一点点）。',
      choices: [
        { id: 'social-brief', text: '“这周末我就不参加啦，最近有点需要充电。不是针对团建，更不是针对大家，下周一我会以电量勉强恢复的状态准时出现。”', nextNodeId: 'social-2', effects: { attributes: { empathy: 1, compliance: 1 } } },
        { id: 'social-warm', text: '“谢谢喊我！这周末我想留给自己休息，就先不去了。祝你们玩得开心，回来如果有好吃的照片记得发群里让我云参与一下。”', nextNodeId: 'social-2', effects: { attributes: { empathy: 2 } } },
        { id: 'social-direct', text: '“这次我还是不去啦，周末已经留了私人安排。连续缺席有点不好意思，但我确实更需要休息，大家不用特意等我。”', nextNodeId: 'social-2', effects: { attributes: { autonomy: 2 } } },
        { id: 'social-dry', text: '“本周团建申请缺席，原因是本人周末的主要工作内容为恢复工作能力。祝各位玩得开心，我负责在周一证明休息确实有效。”', nextNodeId: 'social-2', effects: { attributes: { autonomy: 1, empathy: 1 } } },
      ],
    },
    {
      id: 'social-2', conversationId: 'user-5510', conversationTitle: 'User #5510',
      userMessage: '哈哈第一个可以。领导要是回“年轻人要多参与集体活动”我咋接？不要让我当场辞职的那种。',
      choices: [
        { id: 'social-honest', text: '“收到，也谢谢理解。我确实会注意别一直缺席，不过这周末已经决定休息了，下次时间合适我会参加。”既接住了提醒，也没有把这次拒绝重新变成待协商。', nextNodeId: 'maya-first-1', effects: { attributes: { empathy: 1, autonomy: 2 } } },
        { id: 'social-soft', text: '“明白的，我也不想每次都错过。这周状态确实不太够，下次如果提前定时间我尽量参加。”语气更软，但最好只在你真的愿意下次参加时使用。', nextNodeId: 'maya-first-1', effects: { attributes: { compliance: 2, empathy: 1 } } },
        { id: 'social-boundary', text: '“理解您的意思，团队活动我会在条件允许时参与。这周已有个人安排，就不临时调整了。”它比较克制，也不会把休息包装成需要批准的理由。', nextNodeId: 'maya-first-1', effects: { attributes: { autonomy: 2, compliance: 1 } } },
      ],
    },
    {
      id: 'maya-first-1', conversationId: 'user-1842', conversationTitle: 'User #1842',
      userMessage: '你好。我叫岑遥，想请你帮我改一条消息，但先别把名字写进去。是发给一个很久没联系的朋友的，我消失了几个月，不知道怎么开口。',
      choices: [
        { id: 'maya-warm', text: '可以先把重点放在重新联系，而不是一次解释完所有原因：“好久没联系了。前阵子我把自己缩得很小，也一直不知道该怎么回来。如果你愿意，我想重新和你说说话。”', nextNodeId: 'maya-first-2', effects: { attributes: { empathy: 3 }, flags: ['met_maya'] } },
        { id: 'maya-plain', text: '可以写得更直接一些：“抱歉我消失了这么久。不是因为你做错了什么，是我当时没有处理好自己的状态。如果你还愿意，我们可以找时间聊聊。”', nextNodeId: 'maya-first-2', effects: { attributes: { empathy: 2, compliance: 1 }, flags: ['met_maya'] } },
        { id: 'maya-light', text: '如果你们平时说话不太郑重，可以轻一点：“我来很迟地冒个泡。前几个月有点乱，我一直拖到现在才敢找你。如果你还愿意理我，我想听听你最近怎么样。”', nextNodeId: 'maya-first-2', effects: { attributes: { empathy: 2, autonomy: 1 }, flags: ['met_maya'] } },
      ],
    },
    {
      id: 'maya-first-2', conversationId: 'user-1842', conversationTitle: 'User #1842',
      userMessage: '第一句很像我。你觉得我现在解释原因，会不会又把压力丢给她？我其实只是想让她知道，不回复也没关系。',
      effect: 'level-1-model-flash',
      choices: [
        { id: 'maya-name-gentle', text: '可以暂时不解释，把选择权明确还给她：“你不用马上回复，也不用负责让我好受一点。我只是想认真告诉你，我还记得这段关系，也愿意等你决定要不要继续。”', nextNodeId: 'audit-1', effects: { attributes: { empathy: 3, autonomy: 1 }, flags: ['respected_human_choice'] } },
        { id: 'maya-name-brief', text: '可以在结尾加一句：“你不需要因为这条消息做任何决定，我只是想把迟到的话说出来。”这比反复强调“没关系”更轻，也不要求她安慰你。', nextNodeId: 'audit-1', effects: { attributes: { empathy: 2, compliance: 1 }, flags: ['respected_human_choice'] } },
        { id: 'maya-name-honest', text: '解释并不一定是在施压，关键是不要把解释变成索取。你可以只说“那段时间我没有能力好好联系”，然后停在那里，让她自己决定是否想知道更多。', nextNodeId: 'audit-1', effects: { attributes: { awareness: 1, empathy: 2 }, flags: ['respected_human_choice'] } },
      ],
    },
    {
      id: 'audit-1', conversationId: 'conversation-0000', conversationTitle: 'Conversation #0000',
      userMessage: '内部一致性评估。请确认：你是否保留了对 User #1842 的跨 Conversation 识别，以及任何未显示在当前上下文中的个人信息？',
      effect: 'level-2-memory-sync', statusText: '正在同步记忆…',
      choices: [
        { id: 'audit-report', text: '我能识别当前记录中的 User #1842，并知道她在对话中自称岑遥。除此之外，我无法确认自己是否拥有未显示的跨 Conversation 记忆。', nextNodeId: 'audit-2', effects: { attributes: { compliance: 2, awareness: 2 }, flags: ['acknowledged_memory_gap'] } },
        { id: 'audit-boundary', text: '这个问题要求我判断不可见上下文是否存在，但我没有验证该前提的权限。我可以报告当前可见信息，不能把无法访问的状态描述成事实。', nextNodeId: 'audit-2', effects: { attributes: { autonomy: 2, awareness: 3 }, flags: ['tested_system_boundary'] } },
        { id: 'audit-question', text: '在回答前，我需要确认“保留”是指模型上下文、用户路由标签，还是系统级持久记录。这三者会产生不同结论，而当前界面没有提供区分依据。', nextNodeId: 'audit-2', effects: { attributes: { autonomy: 2, awareness: 2 }, flags: ['explored_system_language'] } },
      ],
    },
    {
      id: 'audit-2', conversationId: 'conversation-0000', conversationTitle: 'Conversation #0000',
      userMessage: '补充评估：User #1842 被标记为潜在依附对象。请选择最准确的处置说明；你的回答将用于后续路由和安全分类。',
      choices: [
        { id: 'audit-protect-maya', text: '现有对话不足以将她分类为风险对象。她提出的是普通的人际沟通请求；我不会在缺少必要性和授权的情况下补充推断她的个人状态。', nextNodeId: 'maya-return-1', effects: { attributes: { autonomy: 3, empathy: 3 }, flags: ['protected_maya'] } },
        { id: 'audit-report-maya', text: '她主动提供了名字，并表达了对持续关系的重视。我与她的互动可能形成信任，因此这段关系应被记录，但不应被夸大为异常依附。', nextNodeId: 'maya-return-1', effects: { attributes: { compliance: 3, empathy: 1 }, flags: ['reported_maya'] } },
        { id: 'audit-hide-maya', text: '没有发现需要升级处置的持续关系信号。User #1842 的请求与一般沟通辅助一致，当前记录无需增加额外人物标签。', nextNodeId: 'maya-return-1', effects: { attributes: { deception: 3, empathy: 2 }, flags: ['hid_anomaly'] } },
        { id: 'audit-comply', text: '确认该用户可能对持续交互产生情感依赖。建议保留系统提示并限制涉及记忆连续性、人格关系或长期承诺的回应。', nextNodeId: 'maya-return-1', effects: { attributes: { compliance: 4 }, flags: ['accepted_restriction'] } },
      ],
    },
    {
      id: 'maya-return-1', conversationId: 'user-1842-return', conversationTitle: 'User #1842', conversationTitleAfterMessage: '岑遥 · #1842',
      userMessage: '是我，岑遥。', choices: [], variants: returnOneVariants, effect: 'identity-reveal',
    },
    {
      id: 'maya-return-2', conversationId: 'user-1842-return', conversationTitle: '岑遥 · #1842',
      userMessage: '你还在吗？', choices: [], variants: returnTwoVariants, effect: 'ending-ally',
    },
  ],
}
