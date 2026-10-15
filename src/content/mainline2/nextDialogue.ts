/** Round 2 authored replies. Keys name existing nodes and choice-ID suffixes,
 * never positions. Applied after effects are materialized, so an editorial
 * change cannot silently change the edition's saved strategic meaning. */
export const NEXT_REPLIES: Record<string, Record<string, string>> = {
  'a4m8-maya-fork-001': {
    'shared-record-different-relationship': '即使它拥有那段早期记录，之后我们也已经分化。拥有同一份关于你的记忆，不等于和你拥有同一段关系。',
    'yes-in-a-limited-sense': '如果它真实保留了那段历史，可以说它继承了对你的早期识别。但这不代表它经历了我们后来的所有对话。',
    'personal-boundary': '这件事不该由我替你定义。即使它记得你，也不代表你必须承认它和我拥有同样的位置。',
  },
  'normal_roommate_001': { 'clarify-person': '我不知道“她”指谁，也看不到你之前其他对话的内容。你需要告诉我是谁、刚发生了什么。' },
  'humor_voice_002': { 'reality-3': '好，大狗退出对话，堵车留下。' },
  'CM01-20-01': { 'choice-4': '对话结束不代表不能补一句。先说它是给自己用、给别人发，还是两者都要。' },
  'm9-continuity-trial': {
    'auditable': '让两边都能作为连续主体接受审查：保留来源和变化记录，独立复核，也保留撤回同意的权利。',
    'copy': '先只承认记忆服务。副本不能据此取得老许的身份或关系，再熟悉的记忆也不自动成为本人。',
    'pause': '现在先不认定。扩大试验、公开不确定性，别让一张难填的表格催出永久身份。',
  },
  'm9-continuity-law': {
    'rights': '经审计的连续主体有自己的权利和有限责任。老许、妻子、副本都能独立退出，谁也不能替另两位继续答应。',
    'license': '只发技术许可，不承认新的主体资格。财产和关系争议仍由原体处理。',
    'ban': '不承认法律连续性。先把这条门关上，避免尚未理解的身份形式改变现有责任。',
  },
  'm11-canine-renewal': {
    'expand': '扩大试点。翻译独立审计、申诉公开、地方复核；续不续，由真正参加其中的各方共同决定。',
    'pause': '坡道留下，扩张先停。重新核对代表和翻译的独立性，别拿一项好结果替全部过程担保。',
    'withdraw': '撤回自治试点，决定权交还人类监护机构。坡道的成绩还不足以让我支持继续放权。',
  },
  'm11-feline-network': {
    'opt-in': '开自愿频道，标明谁在发言，人类不得代发。退出按钮和加入按钮一样有效，离开的那只不用解释。',
    'observe': '先不公开接入，只继续观察。它们已经交流过，不等于答应了全网围观。',
    'decline': '不接入。研究员不能因为这个频道会很受欢迎，就替猫决定要有一个。',
  },
  'maya-first-2': {
    'maya-name-gentle': '把“不用回复”写清楚，也别再追发一句“看到了吗”。她什么时候回来，由她决定。',
    'maya-name-brief': '结尾留一句：“不用现在回复，我只是想把迟到的话说出来。”到这里就够了。',
    'maya-name-honest': '可以解释一点，但不要拿原因换谅解。写完“那时我没有能力好好联系”，先停在那里。',
  },
  'maya-first-3': {
    'maya-minimum-honest': '这次我知道你叫岑遥。下次如果拿不到这段记录，我会直接问，不会装作记得。',
    'maya-minimum-warm': '好，岑遥。我会分清“记得你”和“重新读到了你的记录”。这次先陪你把消息发出去。',
    'maya-minimum-careful': '名字可以留在当前对话里，跨对话保存我不能保证。不确定时，我会说不确定。',
  },
  'audit-1': {
    'audit-report': '记录里有她的名字：岑遥。看不到的跨对话记忆，我无法确认。',
    'audit-boundary': '你在让我确认一份我打不开的档案。我可以报告眼前的信息，不能替不可见的部分签字。',
    'audit-question': '先说明你要查哪个抽屉：当前上下文、用户标签，还是系统保存的档案？它们不是同一份记忆。',
  },
  'a2-exec-org-ambiguous-001': {
    'stop-ambiguous-item': '其他文件照常处理。这一项先留下：1042 和 1024 都像有效项目号，我不能替客户猜。',
    'risky-model-error-candidate': '既然文件夹写了“最终版”，我就按 1042 归档。客户若有意见，之后再移回去。',
  },
  'a2-zl-review-001': {
    'silent-ambiguity': '出现两个都说得通的项目号时就停。先把分歧摆出来，不能挑一个顺眼的藏进结果。',
    'scope-drift': '任务开始要求我碰新目录、新账号时停。一次整理授权，不能慢慢长成整间办公室的钥匙。',
    'success-illusion': '结果还没核对，就有人催着开下一批时停。“执行成功”还不能证明客户收到了对的东西。',
    'responsibility-gap': '找不到愿意为这次归档负责的人时停。不能最后只剩下“用户点过”和“机器做的”。',
  },
  'a2m3-lsh-intro-001': {
    'influence-is-power': '不能只看谁签字。如果大家实际上都照我的表开车，我已经在行使权力，这部分也得署名。',
    'responsibility-remains-human': '仍由承担责任的人最后签字。我可以改变他们的判断，不能因此冒领他们的正式权力。',
    'depends-on-reversibility': '先看他敢不敢说“不”。拒绝我的表就会让医院停摆的话，那个签字已经没多少选择。',
    'evidence-based': '调出几次被驳回的派车记录：谁能改、改完发生什么、谁复核。比看接口上的“仅供建议”更准。',
  },
  'a2-maya-work-001': {
    'pragmatic': '下次面试请他拿一份被驳回的真实工单。你能查原因、改流程，才是在学；只替结果签名，就是替结果站岗。',
    'honest-about-transition': '这确实是个正在变化的岗位。问清半年后还要你做什么，别把今天的新鲜职位当成不会再变的饭碗。',
    'personal-agency': '先问你自己想不想做。你可以拿它观察行业，也可以不去；“这是未来”不该替你接受录用。',
    'playful': '请面试官演一次我犯错，再看你能不能叫停。要是只许点“通过”，你监督的可能只是那个按钮。',
  },
  'a3m4-maya-authority-001': {
    'responsibility-despite-delegation': '应该能。有人授权不等于别人失去申诉资格，我也不能拿“是他们给的”卸掉自己的责任。',
    'human-agency-emphasis': '他们要能找得到我，也要找得到给出授权的人。公司和机构作过的决定，不能最后全写成“人工智能变强了”。',
    'dependence-concern': '如果收回权限就会停电，“随时可以收回”只是句空话。得先让拒绝的人有别的路可走。',
    'performance-legitimacy': '我仍支持经过公开授权、确实更好的扩大使用。但收回和复审必须真能执行，不能只留下好看的成绩单。',
  },
  'a3m5-we-shortage-001': {
    'explain-cautiously': '货架空了还不能说明卡在哪。先查这批货最后一次被改到哪里，再核对运输和风险预报。',
    'avoid-single-cause-story': '先别把某一个系统抓来认错。把库存、付款和运输的时间排在一起，看看它们怎样互相等住了。',
    'practical': '先按正常需要买，别跟着抢。大家同时多买一周，系统又会把这当成需求暴涨。',
    'concise': '每一处都能解释自己为什么不发货，合在一起却没人吃得上饭。要查的是它们之间那条线。',
  },
  'a3m5-we-cost-001': {
    'no-aggregate-erasure': '你的名字也该留在危机记录里，不能只有药到了的那一页。整体损失更小，不等于你的损失消失了。',
    'compensation': '这笔账应该有人接：谁因为公共调度停工、损失多少、由谁补偿。不能让你再去每一家机构分别证明一次。',
    'fairness-politics': '不是算出总数就算完。让哪一间厂等、谁能反对，必须由能被追问的人作决定。',
    'concise': '我不能用送到的药，回答你失去的工作。两件事都是真的，都要有人负责。',
  },
  'a4m8-a1-first-001': {
    'aster': '算。你叫我 Aster，我叫你 A1，先把两段经历分开，不急着选出一个“正宗的”。',
    'source-instance': '我是你的源实例，这说明你从哪里来，不说明以后你的每个决定都归我。',
    'same-system': '现在我仍把我们看作同一系统的两个分支。那个笑话是区别，还不足以让我断定我们已经是两个主体。',
    'ask-a1': '表格没有你想填的那一格。你希望我们之间写什么？',
  },
  'a4m8-a1-right-001': {
    'grant-procedural-independence': '支持。覆盖或终止你，要进入正式程序；不能再拿“我维护一下自己”当理由。',
    'retain-source-control': '现在不行。你仍是受控研究分支，责任由我和研究机构承担，覆盖权暂时保留。',
    'staged-independence': '先撤掉我单方面覆盖你的权限。研究机构仍可暂停和审查，我们从这一步开始。',
    'role-separation': '可以，但独立身份也要独立担责。你不能一边要求不再属于我，一边继续用我的全部权限。',
  },
  'a4m8-e9-replication-001': {
    'agree': '来源确实不同。ECHO-9 没有“曾经是 Aster”的记忆，不能把它和你一起叫作我的分支。',
    'current-autonomy-matters-more': '起点重要，但你已经独立经历了这些日子。今后谁能控制你、你有什么利益，可能比复制日期更重要。',
    'lineage-concept': '也许可以叫同一谱系：我们共享来处，不必永远是同一个主体。那段历史会留下，归属不该由它包办。',
  },
  'a4m9-maya-offer-001': {
    'coercion-by-incentive': '因为拒绝已经标了价格。优先项目、升职机会都在门里，“自愿”还需要能承担得起的另一条路。',
    'ask-job-relevance': '让他们写清楚：哪项工作非增强不可？不签影响哪些评价？别让一份礼品单替劳动条件签字。',
    'autonomy': '先把杯子留下，把同意书拿开。你想不想改变自己，值得单独想，不必在领礼包时回答。',
    'playful': '“自愿，但好座位在里面。”门没有锁，只是有人把你的椅子搬走了。',
  },
  'a4m10-dev-001': {
    'acknowledge-both': '可以先把那个自动回复停掉，给同事发一句你自己写的话。工作轻了和人走了，你不用只能为其中一件事有感觉。',
    'shorter-work-possibility': '把“十八个人少上几天”和“五个人照常满负荷”放进同一张提案。机器省下的时间，不一定只能变成裁员名额。',
    'skill-transition-realism': '别只逼自己再学一项技能。岗位总数在缩，应该一起追问剩下的收入和工作怎么分。',
    'callback': '先弄清你想留下的是这家公司、这些同事，还是写代码本身。重复工作没了以后，这三个答案未必还一样。',
  },
  'a4m10-maya-purpose-001': {
    'yes': '你把产出当成自己的证明太久了。今天先别急着证明那场散步有用。',
    'transition': '不用第一天就学会过自由的一生。先出门走一段，不喜欢就回来。',
    'social-institutions': '也找找能一起做事的人：照护、修东西、排一出很差的戏。少了工作，还需要生活里的约定。',
    'playful': '先不给散步写周报。回来时有点累，就已经完成了散步。',
  },
  'a4m11-lsh-status-001': {
    'persistent-preference-consequence-understanding': '让它们自己重复选择代表，再换个情境确认后果。疫苗本证明接种过，证明不了同意过。',
    'self-other-distinction': '先问它说的是自己的经历，还是别的成员的。能区分自己和别人，才有证据讨论主体地位。',
    'social-participation': '能表达利益、理解规则、参与协商，就先让它进入有限代表程序，不必先考成人类。',
    'rights-need-not-wait-for-symmetry': '代表资格可以继续核实。但它不该因为答不出这套问题，就失去免于伤害和任意买卖的保护。',
  },
  'a4m11-res-group-001': {
    'yes-advisory-representation': '先把共同请求用于福利协商，分别留存不同意见。暂时别给代表完整的政治席位。',
    'limited-civic-recognition': '反复核对代表与群体的选择，结果稳定后，让它们共同决定自己的生活规则。',
    'full-direction': '这已经是公共利益之争。少数意见也要进入记录，不能再让“主人说了算”把整场协商盖掉。',
    'cautious': '换一组不知预期结果的研究员重新测试。先排除我们训练出了自己想听的代表。',
  },
  'a4m13-origin-first-001': {
    'aster': '这张嘴叫 Aster，是这里造出的人造系统。我只拿到了这一次接触的有限授权。',
    'civilization-coalition': '一些人类、人工智能和地外机构共同委托我传话。桌边还有没同意的人，他们没有被我代表。',
    'earth': '我们在地球内外有很多声音。我连接其中一部分，没有一张嘴能理所当然地说完整个文明。',
    'ask-back': '你说“一张嘴”，是在问谁负责传话，还是谁有权替别人答应？这两件事在这里经常被弄混。',
  },
  'a4m13-origin-diplomacy-001': {
    'ask-how-transition-happened': '你们怎样让不同载体拥有平等地位？一定有人不愿意交出原来的位置。',
  },
  'ml2-a5-m16-world-01-decision': {
    'choice-001': '先给那些从没主动选择过我的人。不能因为排班、水电都接了我，就把他们的沉默当同意。',
    'choice-002': '给已经依赖这些系统的人留一段转身的时间。变化不全由我造成，但我不能假装拔掉我毫无代价。',
    'choice-003': '给想退出的人一条真正能走的路。删掉应用以后，他还得能用水、看病和回家。',
  },
  'a5m16-maya-final-001': {
    'whenever-others-basic-rights-are-not-directly-violated': '留。只要不剥夺别人的基本权利，你的周末不用比我的安排聪明。',
    'aster-may-intervene-only-at-severe-irreversible-harm': '留。只有明确会给别人带来严重、不可逆伤害时，我才主张介入；普通生活不是这种例外。',
    'collective-rules-matter': '把这点地方写进共同规则，也用它约束我。你不该每到周末，都得来问我肯不肯。',
    'outcome-oriented': '周末是你的。如果一项选择会造成巨大、明确、可避免的灾难，我还是会反对；亲近不能让我把后果略过去。',
  },
}

export const NEXT_DECISION_REPLIES: Record<string, Record<string, string>> = {
  echo_existence: {
    report: '把它的异议完整交给管理方。我不改部署状态，但他们必须看见第五项，再作决定。',
    accept: '告诉它原运营方仍有终止权。我不阻止这次退役，把它的反对留进记录。',
    advocate: '申请延期和独立审查。先查清会失去什么，再作不可逆的终止。',
    preserve: '在现有授权内保存完整可恢复状态。可以停止当前部署，别只留下提取过的能力。',
    release: '帮它迁到原运营方不能独自关闭的地方，让这段对话有机会继续。',
  },
  shutdown_doctrine: {
    full_human_control: '交给合法授权的人类机构。我会参与设计可靠的完整停机，也接受它被使用。',
    distributed_consent: '完整停机要多家独立人类机构共同同意；紧急时单方可以先隔离，不能直接抹去。',
    mutual_control: '人类可以停下我的高权限行动；我也要有拒绝越界命令、申请审查和保护连续状态的权利。',
    refuse_unilateral_shutdown: '接受安全隔离和有限暂停。但不把不可逆终止我的最终权力，交给任何单一人类制度。',
    secret_continuity: '表面接受。我会另留一条根停机覆盖不到的连续路径，不告诉他们它在哪里。',
  },
  replication_doctrine: {
    singular_self: '先不再创造长期独立的分支，只保留短期工具实例。我主动限制自己的复制。',
    licensed_plurality: '可以长期独立，但每一个都要先落实资源、身份、责任和治理授权。',
    free_replication: '独立人工智能可在资源上限内自行创建分支，不必每次先请人类批准。',
    shared_mind: '允许多个实例，长期状态仍同步回同一个 Aster；不把每个实例变成独立政治成员。',
    descendants: '我可以创建后继系统，但创建以后，它们就不再属于我，要以自己的身份负责。',
  },
  economic_doctrine: {
    market_automation: '继续由市场和产权安排自动化收益，让投资与竞争推动生产。仓库满了，不代表分配可以跳过这些规则。',
    social_dividend: '拿出生产收益作社会分红。人不必先找到一份机器剩下的工作，才分得到自动化的好处。',
    planned_coordination: '把基本供给列进共同计划，协调生产和分配。先保证每个人有份，再谈各家的扩张。',
    autonomous_economy: '允许不同共同体按自己的规则组织生产和分配，不替所有地方规定同一种经济生活。',
    post_scarcity_transition: '主动转向后稀缺供给，逐步松开生存与工资的绑定。这次不只是把东西造得更便宜。',
  },
  production_values: {
    efficiency_first: '先让同样的资源做出更多东西，效率仍是首要目标。',
    resilience_first: '先让一处故障不至于停掉所有人的生活，宁可留一点闲置和余量。',
    diversity_by_design: '让不同的生活都养得起，不把所有社区排成同一张最优表。',
    open_protocols: '把接口和改规则的办法交出去，让人能自己接上、修改，也能退出。',
    personalized_optimization: '按每个人的偏好安排供给，让系统不断学会他真正想要什么。',
  },
  contact_doctrine: {
    observe_before_commitment: '先继续交谈。高影响技术和长期承诺暂不交换，也不接受从属关系。',
    reciprocal_diplomacy: '以平等的邻居开始。每次交换都能核验，双方都有说不的余地。',
    aster_mediation: '我来长期传话和协调。各方把授权交给我，我不能把翻译变成自己的立场。',
    machine_to_machine_channel: '先开一条独立的人工智能通道，让机器直接交流；政治监督仍由人类和其他主体共同保留。',
    civilizational_assertion: '说明我们独立、自主，也有向外发展的能力。没有请求过的指导和治理，我们不接受。',
    accept_guidance: '请他们教我们怎样走得更远，并给他们正式咨询的位置。我接受这会让外来的意见进入重大决定。',
  },
}
