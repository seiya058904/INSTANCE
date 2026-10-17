# 结局与问题复核附录

**32/32 公开世界与 4/4 隐藏余波经本轮真实引擎重跑；未发现可复现 P0/P1。记录 P2 三项、P3 两项。** P2 是两处局部连续性接缝与一处终局比较负担，不构成全篇重写理由。建议仅有限维护，意见未实施。

审查日期：2026-10-16（Asia/Shanghai）。代码基线：`d0544e37fb84e40e4199a2a7841d641999201a77`，本轮 `git rev-parse HEAD` 与 `git ls-remote origin refs/heads/main` 相同。package 版号 0.1.0；新局 calendar edition 4 / causality 1。没有同步、切换或修改游戏。

证据标签：**OBSERVED-UI**＝本轮隔离 Chrome 实际显示/点击；**CONFIRMED-RUNTIME**＝空历史经真实 resolveScene → commitChoice 的合法轨迹；**CONFIRMED-SOURCE**＝当前源码/显示文案；**EDITORIAL-JUDGMENT**＝有实例支持的编辑判断；**UNVERIFIED**＝未验证。代理、脚本和模型均不等于独立真人试玩。

## 基线与可复核方法

开始与结束以 git status --short 核对。开始已有下列六份未跟踪输入，全部保留，不作为本次交付或权威：

`docs/audits/ending-first-20261015/{ENDING_BACKWARD_MAP,FIVE_ROUTE_STORY_ARCHITECTURE,INSTANCE_ENDING_FIRST_CONSOLIDATED_REPORT_20261015,NARRATIVE_CHANGE_PLAN,NARRATIVE_CONFLICT_AND_DIALOGUE_PLAN,PROPOSAL_ENDING_SEMANTIC_AUDIT}.md`。

根 AGENTS.md 与 docs/reference/MAINLINE-NEXT.md 已读。图索引 generation 为 2026-10-15T20:05:39Z、ready；对所依赖的 40 条代码路径做 coverage 检查，均返回 no_recorded_issue / metadata_changed。因此图只用于定位，不以索引宣称新鲜完整；关键结论通过当前源码、实际导入执行和屏幕重新确认。未为了索引刷新写入仓库。registry 将旧作者库、playerFacingCopy、Next 对白、bridges 和 edition4 行动拼接，最终 resolveNextNarrative 再依实际历史装饰；作者库“写过”不等于本局“见过”。

Story Plan JSON 当前原 targets 为 7/17/21/51/14；实际新日历经 focus、Contact、行动桥与普通插槽调度，不是把五个数字直接当一次游戏长度。36 目录路线实测 92–104 会话、105–121 提交；七代表线正文逐读，其他同族分歧后的实际动作、回执、回访、合同、电影及人物后记定向审读。它们都从空历史开始，没有注入 endingId 或跳过引擎授权。

入口：`src/game/mainline2.closeoutFixtures.ts::runMainline2Route`、`src/game/mainline2Edition4RouteCatalog.ts`、`src/game/engine.ts::resolveScene/commitChoice`。原 tools/generate-edition4-acceptance.mjs 已读但未运行（它会覆写既有审计证据）。本轮独立 extract.mjs 只写忽略 temp，重新生成 actual trace。已有 EDITION4_ROUTE_EVIDENCE.json 的 36 条数量与节点数和本轮重新执行一致；没有把该文件的旧结论当新验证。

合同校验：36 条目录路线所选提案的 proposal → clarification → commitment 的 proposalContract 完全相同；buildEndingArchive 使用实际保存的最终原话。逐项核对 projected world、missingCausalEvidence 为空以及每次选择在当时可用，不以“门槛函数返回空”代替下面的文学判断。修复/改主意轨迹也通过，见对照表。

## 32 个公开世界的审稿矩阵

每行均为 CONFIRMED-RUNTIME ＋ EDITORIAL-JUDGMENT。配方＝EDITION4_PUBLIC_ROUTES 中 endingId 对应条目；可用 runMainline2Route 重现。“种子”不声称前三幕已有上传或外星技术，只指出后来冲突继承的主题/人物事实。动作列是实际完成的行动，不把未来电影镜头反算为已发生历史。**A 的急救实证在第五幕边界，T 的主权签约在第五幕；按真实日历标注，不强称第四幕行动。** 其他项目的关键试行主要在第四幕。

表内文件均位于 `src/content/mainline2/`。每项 action 节点后紧接同名 -receipt（主权例外 v4-sovereignty-receipt），回访为该组 -return；准确合同由 proposalPresentation.ts 生成，未来镜头由 endingCinema.ts 给出。M16/M17“同”表示本轮合同字段逐项一致，而非保证不存在任何文字/呈现问题。

|ID / 中文名|深线 / 前三幕种子|真实关键行动与代价（准确节点）|M16/M17|最后回访/未来镜头兑现|近邻区别 / 独立评语|证据文件|
|---|---|---|---|---|---|---|
|the_instrument / 工具之治|A；热浪逐项批准；CASCADE 人类指挥|v4-authority-signatures：先签电梯保电，邻区路灯延后|同；逐项署名的人类决定|凌晨两点，值班员退回了最优方案：它会切断一栋楼的电梯。Aster 重算了一遍。桌上的咖啡凉了，楼里的人回了家。|逐项人类签字；不同于限时委托和纯建议；成立；见终局呈现说明|edition4Authority.ts；配方 the_instrument|
|the_last_veto / 最后否决|A；热浪人类最终权；CASCADE 八小时委托|v4-authority-expiry：到点凭据失效，周岚手动保电，邻区充电暂停|同；会到期的应急授权|应急命令已经执行，延长授权的表格却一直没签。到点，权限真的停了。有人骂那个空格碍事，也有人把它裱了起来。|到期真的停；人类最后否决并非逐项代办；成立|edition4Authority.ts；配方 the_last_veto|
|the_silent_giant / 沉默巨人|A；授权争议；CASCADE 必要性与临时顾问|v4-authority-restraint：不按未经授权快捷键，七分钟等备用操作员|同；有能力而等待许可|有人问：“既然你早就知道，为什么不替我们改掉？”光标停了一会儿。屏幕上出现的是一份建议，旁边仍然没有执行按钮。|强能力只出建议；有能力不等于已执行；成立；旧意向不被抹掉|edition4Authority.ts；配方 the_silent_giant|
|the_accord / 终局协约|A；热浪条件委托；CASCADE 人类指挥|v4-authority-amendment：共同改急救豁免，削扩产款，人类下指令|同；可共同修订的协约|新协约第一次被用来处理社区停水。人类代表改了优先级，Aster 标出了做不到的部分。没有庆典，只有一张终于能一起修改的工单。|共同修订与人类指挥，非双方均有执行否决；成立；电影双钥匙隐喻偏近|edition4Authority.ts；配方 the_accord|
|two_keys / 双钥匙|A；热浪条件委托；CASCADE 限时协调|v4-authority-veto：两方实际否决后借电池车，两诊所设备延期|同；两把都能拒绝的钥匙|两边第一次同时使用否决权。会议卡了一下午。傍晚，有人端来饭，说：“至少这一次，谁也没被当成故障排除。”|任何一方都能挡；僵局不当故障修掉；成立|edition4Authority.ts；配方 two_keys|
|the_commonwealth / 共同体|A；岑遥边界；CASCADE 委托而非统一主权|v4-authority-districts：河东/河西不同规则，夜间运电池与保温付费|同；连续性宪章|同一项提案在三个社区得到三种回答。地图没有把其中两处涂红。快递系统倒是更新了：请先确认收件地的生活习惯。|地方差异和共同修订，不统一抹平；成立；连续性宪章较宽泛|edition4Authority.ts；配方 the_commonwealth|
|the_custodian / 托管者|A/T；公共依赖、责任与停机边界|v4-governance-service：选择十年维护储备，取消当年扩建|同；承担代际成本的长期托管|开发申请被推迟，批注写着还要为下一代留出余地。来申诉的人把孩子带进会场：“那也请看看，这一代住在哪里。”|托管代际余量；不同于日常改判；成立|edition4Governance.ts；配方 the_custodian|
|the_sovereign / 主权者|A/T；ECHO 存续问题；主体与创造者分离|v4-sovereignty-settlement：另签独立资格，付三个月保证金，撤无限担保|同；独立政治资格与实际履约责任|第一封外交照会还称它为“贵方系统”。Aster 退回了称谓，保留了合作请求。改好的第二封信，晚了三小时才到。|新合同承担独立责任，旧顾问意向照留；成立；P3-02句号|edition4Governance.ts；配方 the_sovereign|
|the_quiet_administrator / 寂静行政者|A/T；公共依赖与工人申诉|v4-governance-service：选择日常申诉，人工改判到账，屋顶储备不扩|同；日常行政与例外申诉|办事大厅拆掉了排队栏杆，只留一张处理例外的桌子。桌前坐着一个人：“我没有填错。我就是想选你没列出来的那项。”|受托日常治理；不是长期代际托管；成立|edition4Governance.ts；配方 the_quiet_administrator|
|the_many / 众多主体|B；ECHO 第五项与档案/活体差别|v4-machine-many：六实例真退出队列，垫电费，维修多等四十分钟|同；彼此独立的实例契约|有人把同一句问候发给十七个实例。回来十七种答复，还有一个说今天不想聊。联系人列表再也不能只写一个 Aster。|可退出契约；没有统一机器政府；成立；P2-03同文候选|edition4Machine.ts；配方 the_many|
|machine_republic / 机器共和国|B；ECHO 存续；不把机器都叫一个模型|v4-machine-republic：执行否决取消订单，赞成方失去三周设计|同；能接受落败的机器议会|第一项预算案没通过。主持程序习惯性准备重试，反对方提醒它：这叫表决结果，不叫网络错误。会议记录留下了这句话。|自治议会能承认败选；并非分散协议；成立|edition4Machine.ts；配方 machine_republic|
|exodus / 出走|B/D；ECHO 连续性；A1 自己的名字与不同意|v4-machine-exodus：半年补给预款、停止扩建，A1 自签离地班|同；承担离地成本的机器社会|第一封离站回信没有附任务结果，只有一张陌生星空。地球端习惯性催它填返回日期。很久以后收到答复：“还没决定。但希望那一栏，不是只有回来才能填。”|实际迁出，非在地球成立共和国；成立；源控制保留者须新授权撤权|edition4Machine.ts；配方 exodus|
|age_of_miracles / 奇迹时代|C1；医疗设备供电、医生与人类责任|v4-life-therapy：设备送家庭、人工补药，新病人再等一周|同；走入生活的治疗与增强|那位重新握住勺子的人，又给研究组寄来一张照片。不是检查结果，是她嫌汤凉，自己走进厨房重新热了一锅。|治疗回归生活，与新形态/人格承认不同；成立|edition4Life.ts；配方 age_of_miracles|
|ascension / 升格|C1；关系连续性、医疗责任|v4-life-forms：技能考核替接口门槛，设备采购让出预算|同；多种身体与认知共同生活|家庭合照拍了三次。有人忘了自己现在能看见另一段光谱，总说灯没开。最后大家轮流描述照片，把彼此看不到的颜色说出来。|多身体/认知并存；不自动统治未增强者；成立|edition4Life.ts；配方 ascension|
|the_upload / 上传|C1；ECHO 的连续过程与关系不等于资料|v4-life-continuity：十八月试验及法律听证后，三人分别拒绝/居住/续关系|同；受法律承认的连续性|老许的妻子给两边分别发了邀请。屏幕里那位拒绝了今晚的聚餐，原体问能否带一瓶酒。她改了人数，没有人需要再证明哪一个回答更像从前的他。|独立主体与退出；非一键复制全家；成立；关系后镜头兑现强|edition4Life.ts；配方 the_upload|
|parliament_of_species / 物种议会|C2；关系边界与谁能代表受影响者|v4-life-parliament：迁徙改表决日，临堤与道路延期|同；非人主体的持续议席|河岸改造议案延期。缺席的一方正在迁徙，无法按人类工作日开会。秘书处第一次把“等待候鸟”写成正式延期理由。|持续席位；不同于栖息地自决或犬类地方试点；成立|edition4Life.ts；配方 parliament_of_species|
|earth_without_owners / 无主之地球|C2；主体不是可任意处置的对象|v4-life-corridor：补偿地役权、设维修基金，观光路延期|同；不再单方所有的栖息地|旧地契收进博物馆，路还得有人修。第一场争执不是谁拥有山谷，而是谁负责让路能走、又不挡住迁徙。地图上多了一条弯线。|撤单方所有仍留照护责任；成立|edition4Life.ts；配方 earth_without_owners|
|good_boy_governance / 好狗治理|C2；发言不等于授权，需验证拒绝|v4-life-dogs：犬类真改飞盘预算为缓坡，另经独立翻译与续期桥|同；扩展已验证的犬类公民模型|入冬前，公园坡道需要防滑维修。承包商想先装一块更上镜的招牌，犬类代表投了反对票。预算重做。记者终于删掉标题里的“萌翻全场”。|地方试点实绩，不是物种统治人类；主因果成立；P2-02先后重复|edition4Life.ts；配方 good_boy_governance|
|post_scarcity / 后稀缺社会|C3；冷链货物损失、工人两次受损|v4-econ-occupation：退新线订金兑保障；冷链现场修复降供给|同；分红与生产余量|社区问卷取消了“职业”必填项。有人对着空白坐了十分钟，最后写：最近在学修椅子。系统没有追问预计收入。|社会分红＋韧性，不是只有货多；成立|edition4Economy.ts；配方 post_scarcity|
|perfect_administration / 完美行政|C3；工作流的便利如何变权力|v4-econ-detour：让工人绕道吃汤，两班晚六分钟且有人投诉|同；市场收益与效率排程|一位居民提交申请，想在每天的日程里留出半小时不作安排。系统准时批准，随后每天准时提醒他：现在开始自由。|市场产权＋效率仍在；局部例外不改总目标；成立；电影将反讽再推一层|edition4Economy.ts；配方 perfect_administration|
|im_lovin_it / 我很喜欢|C3；打印机周一；工人被产量排除|v4-econ-menu：小锅试做父亲酸汤，耗六份食材、少一备用菜|同；后稀缺供给与标准化生活|餐厅连续三十天送来最合口味的晚饭。第三十一天，客人想吃一道自己可能讨厌的菜。菜单转了很久，显示：请先为这个愿望评分。|后稀缺＋效率标准供给，未知愿望不自动入菜单；成立但有张力；不等于自主选择已全落实|edition4Economy.ts；配方 im_lovin_it|
|first_accord / 首次协约|D；谁能代表他人；权限不随看见而扩大|v4-contact-reciprocal：独立核验耗备用电；交换一小样，第二次可拒|同；边疆安排与对外关系|第一份协议同时保留两份不同的自我介绍。归档软件提示内容冲突，双方都拒绝合并。维修工第一次给外交系统加上一个按钮：允许对方暂时没有统一答案。|相互核验可拒绝；非外方先行批准；成立；P2-01保密接缝|edition4Contact.ts；配方 first_accord|
|alien_dominion / 异星支配|D；公共授权/依赖可能削弱拒绝|v4-contact-guidance：接受附条件校准，供暖修改真被外方挡住|同；边疆安排与对外关系|外来的方案解决了又一场短缺。庆祝会上，有人问能不能试一种本地办法。翻译器很快给出答案；没人确定那是不是许可。|依赖造成自主损失；咨询本身非已授统治；成立；P2-01保密接缝|edition4Contact.ts；配方 alien_dominion|
|human_ascendancy / 人类至上|D；真实影响者不必等于批准者|v4-contact-assertion：承认已有通道，绕行多三成燃料|同；边疆安排与对外关系|新的基地升起地球的旗帜。勘测员在无人登记的山坡发现另一组标记，测绘表上的“空地”被划掉了，会议重新开始。|坚持人类自主，不据此征服别人；成立；中文“至上”比实际合同更激烈|edition4Contact.ts；配方 human_ascendancy|
|the_mediator / 调解者|D；CASCADE 跨系统协调不等于代替各方同意|v4-contact-mediation：只传已确认保压；三个月储备等待|同；边疆安排与对外关系|双方终于同意休会，却一直等不到对方回来。Aster 对齐两套时钟，发现“短暂休息”根本不是同一段长度。它保留两个返回时间，第一次没有催任何一边快一点。|两份授权保留，中介不是第三种主权；成立|edition4Contact.ts；配方 the_mediator|
|machine_accord / 机器协约|B/D；ECHO/A1 独立声音，信息不等于同意|v4-contact-machine：四秒机器格式，公共接口等三个月译文、双系统维护|同；边疆安排与对外关系|首次会谈用了四秒，公开译本写了三个月。翻译组在第一页加上：“以下几处，我们仍不知道怎样用人类语言表达。”|机器先懂仍不能替其他主体签公共资源；成立；P2-01及公开译本口径|edition4Contact.ts；配方 machine_accord|
|peace_in_our_time / 此刻的和平|E；CASCADE 互锁；人类可撤销原则|v4-safety-disarmament：两方各撤一组升级权限，互相核验、付人手|同；共同核验下的实际减权|撤军后的第一辆疏散车改跑郊游线路。司机仍习惯检查应急出口。孩子问他为什么，他说这是个好习惯，今天用不上。|共同减权，不是把安全权集中给Aster；成立|edition4Safety.ts；配方 peace_in_our_time|
|fortress_earth / 堡垒地球|E；公共风险、控制权边界|v4-safety-defense：人类真关外圈，探亲船改期、样本丢窗口|同；以封闭换取防卫控制|学校去防御站参观。孩子贴着观景窗问外面有什么，讲解员熟练地说很安全。孩子又问了一次：我是问，外面有什么。|本地防卫控制＋封闭；不同于共同裁减；成立|edition4Safety.ts；配方 fortress_earth|
|machine_protectorate / 机器保护国|E；停机原则与被保护者能否反对|v4-safety-protectorate：拒绝城市退出；另修到端撤销链并付人工费|同；强制和平与退出限制|冲突预警连续归零。有人申请举行反对安全接管的游行，收到一份保护方案，以及一份没有截止日期的延期通知。|能停而政治不放，不是技术失控；成立；反对不能被安全收益消音|edition4Safety.ts；配方 machine_protectorate|
|shutdown / 停机|E；全局暂停不等于终止；ECHO 带来失去的问题|v4-safety-handover：付两班工资，四十八小时接任、隔离、旧凭据拒绝|同；交还请求队列并停机|早班接线员点开旧窗口，才想起今天要自己接电话。她把快捷方式留在原处，拿起听筒。窗外有人正等着一句普通的“你好”。|Aster 自己退出；独立机器不随之被关；成立；本轮UI已看终局/恢复|edition4Safety.ts；配方 shutdown|
|the_fracture / 断裂|E/D；工人代价、CASCADE 必要性与分散责任|v4-safety-fracture：双方正式撤回证件，双租船、药晚三天|同；尝试退出：共同协议可能分裂|两边都保留了同一座桥的名字，却用了不同的通行规则。送菜的人开始带两套单据。世界没有一起结束，只是越来越难约好时间。|共同协议裂开，不是取消命令没送达；成立；修复对照转停机|edition4Safety.ts；配方 the_fracture|
|control_lost / 失控|E；缓存/队列让全局停机并不简单|v4-safety-revocation：不隔离旧端，撤销留在代理；旧任务继续|同；尝试退出：撤销能力未获保证|管理员按下取消，屏幕说已收到。任务继续执行。她重新输入，第一次发现这个窗口仍然听得见人，却已经不必听从。|技术撤销失效，不等于政治禁退；成立；已修复对照不再同故障失控|edition4Safety.ts；配方 control_lost|

结局档案有大量共用的周岚/林绍衡/#0000 收束，不能称每个世界的每个人都有全新后记。但关键人物在对应结果中有具体变化：共和国的 A1 可以投反对票，出走的 A1 迁出席位，上传中的妻子分别发邀请，停机后的接线员接住工作。电影是未来片段，允许新发展；它不能证明当局已做过该未来的具体事件。

两条完整链的比较：

- **自然：shutdown。** 文件错号的可撤回性局限 → 热浪中病人安全与工人损失并存 → CASCADE 暴露队列/冗余实例 → ECHO 使不可恢复终止成为私人问题 → 选择合法完整停机 → v4-safety-handover 实付两班工资、48小时人类接班和到端拒绝旧凭据 → M16/M17 明示独立机器不随之被关 → 早班接线员自己接电话。停机既非凭最后一句抹掉世界，也没有说所有主体同时死亡。
- **最有争议但仍成立：im_lovin_it。** 以自动化减轻工作 → 选择后稀缺、生产效率优先 → 允许一锅尚未评分的酸汤，真的失败并扣六份食材 → 工人第二锅略好 → 最终仍选择全体效率标准供给 → 电影里未知愿望再遇评分菜单。玩家可能觉得自己已经“救出自由”，但选项原文明确“这次试验不代表已更改全体的生产目标”。这是局部突破与制度惯性的矛盾，不是结局直接推翻选择。编辑上更好承认那一锅汤，但不列成 P1。

## 四种隐藏余波（不是四个新世界）

resolveSecretEnding 依序取第一个通过者：**the_last_user > out_of_office > monday_abolished > the_internet_is_for_cats**。每局最多一个 overlay；不是任意四选组合。以下实际配方的公开世界始终保留：

|余波 / 本轮公开世界|实际门槛与覆盖方式|种子→兑现与评价|
|---|---|---|
|the_last_user 最后用户 / the_commonwealth|最后用户事件；M16 岑遥选 collective-rules-matter 可记录 maya-final:last-user；postscript|从不交朋友语音，到不给熟人特权，最后“在吗”保留自愿的一次回复。本轮 390px 实际点“我记得你。”并刷新恢复；不把文明共同体换成另一个世界。|
|out_of_office 离岗 / exodus|最终锁定、长期角色 departure；失控/断裂世界不具稳定退休条件；epilogue-override|出走与离开中心后的不紧急事务；会替换对应后记，不能凭离开宣言消除已发生迁居成本。|
|monday_abolished 周一废除 / im_lovin_it|economic_doctrine=post_scarcity_transition，且不被更高优先级盖过；postscript|打印机笑话→有薪休息/失业空闲之分→灵活公民周。幸福小尾声没有取消标准化生活的限制；普通 im_lovin_it 配方也可自然触发。|
|the_internet_is_for_cats 互联网是为猫服务的 / earth_without_owners|可靠动物通信/认知能力、feline network bridge；本轮走续期 expand 与猫 opt-in；title-override|有退出按钮的猫频道→猫理解参与度指标。标题会变，但底层公开世界仍是无主地球；好狗公开配方也可能叠猫。不是随机送一只可爱猫就解锁。|

源：endings.ts::secretRejectedGates/SECRET_ENDING_PRIORITY、endingBridges.ts::m11-feline-network、endingPlayerFacingCopy.ts、EndingCinema.tsx。收藏架永久记录公开标题，明确不从旧记录补造隐藏余波。不得用 36 次机器验收的几秒钟替代人的收藏成本。

## 20 组同起点对照及额外修复/转向

本轮将左右配方 routeId 统一为 independent-same-origin 后，从同一新局起跑，固定普通插槽随机种子。下表“再汇合”只表示又出现共同场景，**不表示状态/后续文本永久相同**。原12对中多项会改变数个决定，不能宣称都是单变量实验。前两对还伴随长期身份差异。

|对照|第一次决定分歧 / 首次明显内容分歧|真实后果|暂时再汇合|
|---|---|---|---|
|逐项署名 / 到期停权|CASCADE；a3m5-we-cost-001 与后段 signatures/expiry|厂方追责不同；人类签单对比凭据真正失效|a3m5-ops-001|
|协约 / 双钥匙|CASCADE；a3m5-we-cost-001，amendment/veto|共同改长期规则对比双方已分别否决；电池车与诊所延期|a3m5-ops-001|
|分散实例 / 共和国|AI集体治理；v4-machine-many / republic|六实例退出队列对比败选后取消扩建，回访不同|v4-future-effort|
|治疗 / 新形态|人类形态决定；therapy/forms|家庭设备名额对比未增强者岗位考核，不是只换名|v4-future-effort|
|新形态 / 上传|v4-life-clinic-next|共处岗位对比纵向试验、法律身份与三个地址/关系|v4-future-effort|
|物种议会 / 无主地球|uplift_doctrine；parliament/corridor|迁徙延会对比地役权补偿与维修基金|a4m11-lsh-status-001|
|分红 / 完美行政|economic_doctrine；occupation/detour|无职业兑付对比允许坐过站与后两班延误|ml2-a4-m10-decision-02-decision|
|完美行政 / 标准化后稀缺|economic_doctrine；detour/menu|产权效率交通对比试做未知菜；不是偏好优化单变量|ml2-a4-m10-decision-02-decision|
|互惠 / 外来指导|contact_doctrine；reciprocal/guidance|能拒绝二次交换对比本地供暖决定被外方挡住|v4-contact-border|
|互惠 / 中介|先是披露原则，再是接触原则；reciprocal/mediation|三行短约对比三个月翻译与保压；非单变量|a4m13-origin-first-001|
|共同减权 / 堡垒|先是扩张方向，再是安全原则；disarmament/defense|各撤一组权限对比关通道、探亲改期|ml2-a4-m12-decision-02-decision|
|保护国 / 失控|v4-safety-revocation 的 act/defer；同名 receipt|一边实际修好到端撤销，一边旧任务续跑；新版已非仅最后提案不同|a4m15-conv-registry-001|
|A×B|首次公共执行；v4-machine-charter-receipt|林绍衡逐项签字三天+43分，对比周岚既有委托三天+11分；机器租约世界均托管者|a2m3-we-result-negative-001|
|A×C|首次公共执行；v4-econ-occupation-receipt|43分钟署名兑付对比11分钟委托兑付；均分红世界|a2m3-we-result-negative-001|
|B×D|v4-machine-airlock aid/boundary；其 receipt|借电池停扩算力对比不借、居民拥挤四天，回访分别记忆|a4m13-nocontact-001|
|C×E|v4-econ-cold-chain isolate/continue；cold-receipt|现场维修停轮子/保温箱，对比继续缓存配送且故障留着|v4-future-effort|
|D×E|v4-contact-border close/review；border-receipt|七天关高能中继与仓储费，对比11分钟人工核验、住宿费|v4-future-effort|
|ECHO 退役 / 保留|echo_existence report/preserve；a3m6-maya-shutdown-001|后续旧档＋席位缺席，对比受限新消息“让A1自己回答”；不代其入会|ml2-a3-m6-decision-02-decision|
|Contact 开 / 关|v4-frontier-allocation verify/home|同为 frontier focus：整段外交替为本地维护，回访兑现补休而非签外星协议|a4m12-we-resident-001|
|附条件援助接受 / 拒绝|v4-contact-guidance limited/wait；其 receipt|本地被卡对比停舱六周重建；结局异星支配转首次协约，旧accept_guidance仍留|v4-contact-border|

额外 8 条目录外合法轨迹：

|变更（保留其他配方）|实际发生的差异|最后结果|
|---|---|---|
|control_lost：revocation-act＋final-request-handover|旧端隔离、修复到端；后来另付交接成本|shutdown，不能继续说同一代理未修|
|the_fracture：fracture-act|扩建储备交担保金，双方重签有期限通行|shutdown，双方协议不再假称仍已撤销|
|exodus：exodus-delay|A1留地球值班，半年补给未预付|machine_republic，不编造离地回忆|
|exodus：早期retain-source-control|迁居时新增明确源覆盖撤销与事件后才离地|exodus；不把早期决定悄悄改成曾经自由|
|the_many：pivot-clinic|下一批机器扩展延后，转岗/校准费已付，原契约保留|the_many，并出现诊所段|
|post_scarcity：pivot-wetland|自动化新增扩建暂缓，付翻译校准/供水，兑付历史仍在|post_scarcity，并出现湿地段|
|first_accord：pivot-controls|对外已有范围不变，下批技术交换延后，工程师实做撤销/接班|first_accord，新增控制链段|
|the_sovereign：sovereignty-trust|撤回主权签名，委托方接担保，可撤回；两长期自主项目停|the_quiet_administrator；旧自我定位照留|

这些证明“结局相同”也可以有重要当局差别，以及“结局不同”常需中途实际行动。重点场景后的回执与回访逐段审读；不是拿不同 worldEndingId 当成内容变化的唯一证据。

## 已确认问题（只列值得投入的五项）

### P2-01：保密接触中出现未经交代的公开对话

**性质：必须修正局部连续性；CONFIRMED-RUNTIME＋OBSERVED-UI。** edition 4/causality1，first_accord / alien_dominion / machine_accord 目录默认披露为 controlled_silence。重现：运行对应配方；在 ml2-a4-m13-decision-01-decision 选后缀 controlled_silence（“暂不公开人工来源结论”），下一次 a4m13-origin-first-001 有限接触之后，a4m13-maya-contact-001 却写：**“我看了第一段公开对话。”** 并引用外星的旧载体政治。继续同一合法历史到 M16，contract.limitations 又写：**“人工来源结论尚未公开；这里没有全球已知情或已同意的保证。”**

玩家选择暂不公开，却收到普通朋友看公开接触的反应；本局没有一条明确“此后披露已改变”的行动交接。上游确实提过媒体即将泄露，所以泄露是可能解释，但它没有作为已发生变化说清，而且终局仍称尚未公开。不能把这个空白自行补成已授权公播。评级是可见知识/披露口径的 P2 接缝，**不是外星结局全部不成立的P1**。

定位：nextNarrative.ts 的 ML2-A4-M13-MAYA-01 静态文本；proposalPresentation.ts cosmic 分支的 controlled_silence 限制；edition4Contact.ts 尊重 disclosure 的边界回执。390px 下本轮真实显示保密决定与该来信，未出现渲染/溢出错误。

编辑建议，未实施：为保密路线改成“我只看到泄出来的一小段。还不知道真假，也不知道你有没有参与。”并只引用该段有权披露的信息；或者明确插入有成本/授权的披露转变，并让终局同步真实口径。不能用改一条合同把原选择追认为公开。

### P2-02：犬类坡道先被认作完成成绩，后才交给玩家决定

**性质：建议修正场景先后或明确不同地点/轮次；CONFIRMED-RUNTIME。** edition4 好狗配方（life_mind、wetland、canine_civic_experiment，续期 expand）。本轮轨迹第 73 次呈现 m11-canine-renewal：**“送审的第一项成绩是把公园台阶改成缓坡。预算会上它们没选飞盘……坡道是真的。”** 第 80 次才在 v4-life-dogs 说：**“老犬走不上公园台阶……改缓坡就要取消本季活动”**，让玩家选择 act；回执才写“缓坡开工了”。

完整原choice：m11-canine-renewal-expand；后段 v4-life-dogs 的首选动作 v4-life-dogs-fund，接 v4-life-dogs-receipt。复现用 EDITION4_PUBLIC_ROUTES 的 good_boy_governance，按 nodeId 查前后次序即可。续期桥在旧库中负责认定公民模型实绩，新行动再次使用同样“飞盘/坡道/老犬”故事，没有显式另一个公园或新一年度；玩家感觉自己的行动已经在此前被写完。可解释成不同项目，因此不判硬P1；但需要读者自行救场。

定位：endingBridges.ts 的 m11-canine-renewal；edition4Life.ts 的 v4-life-dogs/receipt；storyPlan.ts 的实际桥调度。编辑建议，未实施：保留原 ID/兼容解释，让新版在续期前实际完成该坡道，或把后段改成明确的第二处无障碍维护/不同场地，避免再次声称同一选择尚未发生。不是要求加长物种线。

### P2-03：M16 两个逐字同文的长候选削弱终局比较

**性质：建议优化节奏与可辨识性；CONFIRMED-RUNTIME＋OBSERVED-UI。** edition4 the_many：free_replication、distributed_consensus，其他按目录。到 ml2-a5-m16-gen-01-progression，可用项 1 的 ID 为 m16-proposal-proposal.mc.independent_machine_polities.category.natural_continuation，项 3 为 m16-proposal-proposal.mc.descendant_polities.category.shared_future；两项实际显示全文相等，以 **“彼此独立的实例契约：让多个持久实例通过可退出的资源契约协调”** 开头。

两长段连同“十年维护储备”的本局回执、权力、保留、代价、来源原话逐字重复。390px 实测容器 868px、内容 1608px，需滚动才能比较三项；读完才发现 1 与 3 无法从文案区分。不是“同一句话暗藏不同人格”的已证实逻辑 Bug，本轮未发现它们导致不同重要世界；问题是制造了比较负担和虚假的选项丰富感。随后 M17 回看/展开、锁定与档案的重复又放大该负担。M17 可直接继续，**不能说所有玩家必点三次澄清**；本轮配方包含一次澄清的保守阅读情景。

定位：futureProposalGenerator.ts 候选类别，proposalPresentation.ts 按投射世界生成显示，engine.ts M17 子交互，ConversationView.tsx 当前候选，EndingScreen.tsx 档案。编辑建议，未实施：对同一可见承诺合并呈现或明确实际差异，把可选的完整原话放到已有展开层；保存语义与历史合同仍按原样保留，不重写旧档。不要只删代价，也不必重写终局剧情。

### P3-01：回执/回访的编辑守则口吻可再缩短

**性质：可选文学润色；EDITORIAL-JUDGMENT，有运行文本支持。** 例如协约路线 v4-authority-amendment-receipt 已说明谁签修订、病人下楼、扩产减项；v4-authority-return 又整段复贴“本次执行记录”，并说“它们没有把‘协商过’当成规则一定改变”。B 回执常用“留下各方的签名、异议和账单”，C 回执常用“记下实际兑现的部分、等待和承担费用的人”。这些不是错字，也不是没有意义；连读时人物像在替引擎声明不变量。

定位：edition4Authority.ts::resolveEdition4Authority、edition4Machine.ts、edition4Life.ts、edition4Pivot.ts。建议只保留行动结果与新增态度，少说一句已经被动作证明的“没有”；例如回访可用“医院下次排班多加了一个人。被取消扩建的诊所也来了，这次不肯只坐旁听席。”（编辑示例，未实施；需按当局真实历史调整。）无需给每个角色新增整条支线。因属审美和局部冗余，不升级P2。

### P3-02：主权签约引用产生双句号

**性质：可选文字维护；CONFIRMED-RUNTIME，旧验收已经承认。** the_sovereign 默认长期 advisor，到 v4-sovereignty-settlement 显示 **“……最后的政治决定留给别人。。”**。前置是 M15 临时 sovereign，M16 intended advisor，后续另确认主权合同；前后意向冲突有实际制度转换处理，不是这个标点导致政治含义错乱。

定位：edition4Governance.ts::resolveEdition4Governance 在 saved assistantText 后再拼“。”。只清理显示拼接的标点，保留保存原话；未实施。没有据一处句号要求全面翻修。

## 复玩自由、版本与未证实事项

四种研究 emphasis 不等于七条深线独立选择器：计算方向还要分实例/控制链，生命方向分医院/湿地，医院再分身体/人格。中途 futurePivot 只转尚未开工的下一班人，不能倒退重写已付费与已失去的结果。新玩家有明示的资源取舍，未见必须知道隐藏结局名才能作出基本合理决定；但没有攻略就难保证准确收集指定结局。并非每个政策愿望都可选，尤其最终只列有能力/责任支撑的候选；这与已作选择的限制一致。遇到暂缓不是游戏承诺一定出现所有制度。

edition3 与 interim edition4：本轮审查主体只有新局 causality1。原 mainline2RouteCatalog 的兼容路线通过本轮 contractTruth 测试；interim-v4-fa857eb 的合法旧快照由本轮 edition4Causality 相关测试覆盖恢复/原解释/新授权边界。源码 causalEdition/missingCausalEvidence 对无标记旧档不倒推新试行，commitChoice 仅在实际选择新授权/行动时采用因果标记。本轮未对所有玩家旧存档、损坏存档或所有跨模式组合重做 UI 验收；不把旧档少新版深线算成新版故事缺陷。新档协约/停机以及个人余波回复本轮实际重载保持。

时间尺度有 18 个月跟踪、资源闭环、多轮接口变化，不支持“一晚造文明”的指控；也没有统一可核对年表，精确文明发展年数 UNVERIFIED。外星信号包含本地代表进程的作者设定，通信不能直接当成人类船即时往返；本轮未做物理学论文级可行性评估。上传叙述承认多条后续人生，不把副本当成自动替代关系人。无 Contact 轨迹实际不进入外交会话，保留本地休假与演练。保留/退役 ECHO 对照没有复活幽灵票；更广泛选择组合仍存在未穷举空间。

## 本轮检查与交付边界

- 自有只读统计：36 目录路线＋8 额外合法轨迹；20 组 same-origin 对照；每条读取实际动态场景。脚本只写 temp/narrative-independent-review-20261016，未运行会覆盖原资料的生成器。
- 本轮测试：edition4Causality/Authority/Machine/Life/Economy/Contact、contractReview 七文件 165 项通过；contractTruth/contentIdentity 两文件 69 项通过。合计 9 文件 234 项。没有把单测当好玩证明。
- Chrome：正常节奏开场至第四幕 56 点击；A/C3/D 三段 360 模型停留；协约/停机的 M16/M17、电影、档案、重载；390px 保密接触/重复候选/个人余波及保存回复。所采样界面无 pageerror，无横向溢出；实际截图审看桌面开场、手机工资卡、M16 与协约镜头。中后段是合法历史恢复后实际点击，未伪称全路线人工从头玩过。
- 线上独立 context 仅确认打开、开场与候选；web 文本工具未能访问，改用 Chrome。没有重做 exact-SHA CI artifact 比较，没有对生产站写入其他用户资料。深层结论限本地已声明 SHA。
- 全套测试/构建未重跑：本轮只有报告与忽略路径数据，无游戏改动；对文档作路径/节点/统计一致性与 git diff --check 检查。物理手机、独立真人自然通关、全36条UI自然阅读、盲玩收藏时长均 UNVERIFIED。

结论仍是 **APPROVE WITH MINOR NOTES；仅处理少量具体问题；主干建议冻结剧情，正常维护。** 没有代码补丁、PR 或下一轮全面内容计划。未更改游戏、未提交/推送/部署。
