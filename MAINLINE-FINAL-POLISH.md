# INSTANCE · Mainline Final Polish

Baseline: `main@11ce895`(已含 Production Final Repair 与 Mainline Polish v2 的全部内容)。
本轮身份:叙事总监 / 交互叙事 / 选择与后果 / 文案编辑 / 结局导演 / QA。
方法论:先以决策人格模拟器完整通读两条路线(cautious / assertive,共 479 个交换),再定位、修改、验证。

## 1. 改了什么

### A. ACT IV 十个"裸菜单"重大决策全部戏剧化(最高优先级修复)
v2 已戏剧化 M3 / CASCADE / ECHO-9 / M6 / M15 等决策,但 ACT IV 仍有十个决策的用户消息就是标题本身(零场景、零 why-now)。全部重写为"具体事件 + 受影响的人 + 为什么是现在 + 明确的问句",每条 4–6 行,并按说话人分配:

| 决策 | 说话人 | 为什么是现在(锚定的已发生事件) |
|---|---|---|
| 早期研究重点 | 周岚 | 第一轮自主循环下午汇总,算力排期今晚锁定 |
| 研究治理原则 | 林绍衡 | 方向公告两小时后审查组上门,章程明天签署 |
| 复制原则 | 周岚 | A1 正式请求与 ECHO-9 异议同日摆上桌 |
| AI 集体治理 | 林绍衡 | 协调论坛试点期今日到期 |
| 经济原则 | 林绍衡 | 经济委员会明早九点表决 |
| 生产价值观 | 周岚 | 产线设计目标今日定稿,承接岑遥"四天工作制"一段 |
| 提升原则 | 沟通项目联合组 | 覆盖率过公告线,三城请愿今日递交 |
| 物种治理 | 林绍衡 | 犬类试验组丙-4 请愿今日递交(原(#168)的戏剧化事件在决策之后,现提前进决策文案) |
| 扩张原则 | 月面运营方 | 十年建设纲要今晚定稿,承接"居民73天/驻场实例"两段 |
| 地外治理 | 林绍衡 | 居民自治时间表今日交地球委员会 |

同时给林绍衡做了三处"去嘴替"补写:
- 谁拥有自动化生产力:开头承认"上周有人问我'提高在哪里',我没答上来"(呼应 #151 仓库父亲一段)
- 非人类法律地位:"这是我第三次推翻自己的分类表。"
- 地球法与边疆法:开头"被月面运营商怼过'坐办公室的别指挥月球',难听但不全错"

### B. ACT V 每条未来自带"它来自这一局的"溯源行
四条未来的首次亮相(提案生成器节点)现在各带 1 行实时候选来源,直接引用本局真实决策,如:
`它来自这一局的：人类形态原则——后人类转型。`
`它来自这一局的：级联危机授权——限时紧急协调权；安全原则——相互解除武装。`
复核(展开)视图的"它来自"同样从静态通用文案改为运行时逐局生成(匹配的 decision 按权重取前 3,经新增的 `describeDecisionChoice` 映射为中文);无匹配时回退到原 historyReasons。

为此新增了覆盖全部决策与取值的玩家可见中文标签表(`decisionPlayerLabels` / `decisionValuePlayerLabels`,约 90 项)。

### C. Ending 人物余波归属修复(上轮审计的 P2)
根因:分组函数只匹配 provenance 的 selector,而周岚/林绍衡资产的 selector 是"Variant A–E"、岑遥的是"Wary/Trust"——都不含名字,导致全部落进「其他余波」。现在同时匹配 assetId 与 selector,分组按叙事优先级排序(岑遥 → 周岚 → 林绍衡 → ECHO / A1 → 世界模块 → 最终记录),并新增回归断言:岑遥/周岚/林绍衡/最终记录四个分组必须出现,且「其他余波」桶里不得再出现周/林文本。

## 2. 主线结构调整
- 未增删任何故事计划槽位与节点;节奏改善来自决策消息的场景化(玩家先看到事件再看到选择)与"Direction 紧跟其触发事件"的时序修正(物种治理)。
- 未合并/删除决策:十个决策各自回答不同问题;但它们的"提问方式"从制度问卷改为事件响应。

## 3. 重做的 Major Decision
见 §1A 的十项。选择 ID、canonical value、decision binding、hash 全部未动——只改 `:user` 覆盖层的中文玩家文案。

## 4. Consequence / Callback 的加强
- ACT V 四条未来的"它来自这一局的"行 = 每条未来 1–3 个即时 callback(选择→未来)。
- 复核视图的"它来自这一局的" = 中期 callback(选择→试演时的复盘)。
- Ending 因果卡(既有)= late callback。
- 物种治理:原在决策之后才出现的犬类请愿事件,现在其递交时刻进入决策文案,时序因果成立。
- 经济主义:林绍衡的"我没答上来"直接回收 20+ 轮之前仓库父亲的问题。

## 5. ACT IV 节奏
未删除内容;通过把十个"读报告→选方案"改成"事件→人选→决策",连续制度题的疲劳源(裸菜单的出戏感)被消除。普通会话(面试缺点/又丑又帅/卖教材等)保留为章节之间的喘息位。

## 6. ACT V
四条未来的首秀节点带逐条溯源;复核/淘汰/恢复/锁定流程不变(v2 已建立);M17 承诺节点的选项保持原长度(终局按钮值得重量)。

## 7. Ending
- 人物余波分组修复 + 叙事优先级排序(§1C)。
- 其余为 v2 已有层级(因果卡→结算→人物→世界→最终对话),本轮未再动视觉。

## 8. Resolver / state logic
未改。Ending resolver、gate、weight、storage 格式与 v2 完全一致。新增:
- `nonMainlineConsumedOrdinaryIds`(上一轮 Production Final Repair 已加,本轮无新状态字段)
- proposals.ts `proposalProvenanceLines`(纯派生函数,无状态)

## 9. 测试结果
- 67 文件 / **545 用例全部通过**(新增 productionRepair.test.tsx;删除 2 个临时 routeDump 探针)
- `npm run build` 通过(仅已知大 chunk 警告)
- 路线验证:cautious(245 交换,humanControl 3,完美行政结局)与 assertive(251 交换,humanControl -1,上传结局,自然触发 First Contact)两条路线的世界状态、决策表、四条未来、结局均显著分化
- 本地浏览器验证过 qa 结局/Evaluation/跨模式去重(见 Production Final Repair 轮)
- Final Text Cleanup II: 12 处 MT 误译修复 + 全部标点归一 + 21.4% 替换 + Ending registry 全面扫尾

## 10. 已知遗留
- 数字键 1–N 需真人键盘复验(自动化无法注入真实键事件)
- 普通内容中"按词替换保留空格"伪影类("跟 AI 吵"→"跟 人工智能 吵")——根因在 normalizePlayerFacingCopy 的逐词替换,属普通内容批量清理,本轮范围外
- 非主线会话中途返回主线时,进行中(未完成)的会话 ID 要等完成后才进入去重集——极低概率的跨模式重复窗口
- 主线部分决策的选项为 5–9 个长选项,仍有压缩空间;本轮为保护 decision binding hash 未动其文本

## 11. 主线文案语义终校(semantic editorial sweep,Production Final Text)

在 8261e5d 之后,按用户要求放弃"关键词修补"方法,对 `playerFacingCopy.registry.generated.json` 全部 630 条玩家可见文案做了一次逐条对照 canonical 的语义审读(630/630 与 authoredLibrary 的英文 canonical 配对成功),一次性修复 302 条。范围仅限玩家文案:value 替换,不新增/删除/重排 key;不触碰 choice ID、authoredTextHash、decision binding(94 个 decision-bound choice 全部未动)、state、resolver、save、scheduler、UI。

### 修复类别
1. **用户点名的 13 处 MT 硬伤**:人性→人类(政治物种阈值)、机器结算→机器定居点、维持自己的权力→供电、逐个地球的批准→地球各方逐一批准、地球发射建造物料、外星资源站点→地外资源站点、器乐神器→仪器伪影、强烈反对地面干扰解释→基本被排除、无论是模拟/人工智能→是否为、候选班级→候选类别、主题→主体、本地实例化过程演示→表现出。
2. **统一项**:Maya 残留标题→岑遥(10 处)、AI Fork→AI 分身/分叉、世界外治理→地外治理、CONTACT种子→接触种子、代表性的进程→代表其文明的进程、非人类域状态→非人类领域状况(机器域/人域同步统一为"领域状况")。
3. **全量扫出的同类 MT 硬伤(约 90 处)**:复习机器→审阅机器、雅阁分公司→协定分支、布拉格→你们这边、糖尿病、放暑假、上市(列出)、业主→管理层、姿势→态势、弃风率→限产、主轴→私营、当局→授权、投影→预测、合闸/合拢→收束、人工翻译→人体应用转化、服务成员→军人、抗Aster→对Aster的疑虑、医生归来→医生回来等。
4. **机器翻译腔重构(约 120 处)**:主谓断裂、语序倒装、名词堆叠的句子按中文语序重写(ECHO-9 对话、CASCADE 技术报告、结局审计、M12/M13 太空与接触段落等);全部引号/破折号补齐,半角标点规范化。
5. **术语统一**:DOCTRINE 统一为"原则"(经济/提升/扩张/人类形态/研究治理,与既有的危机授权、关闭、安全、披露、接触原则一致,相应决策戏剧化文案同步)、0000 审计"审核"→"审计"、否决/覆写/预测/抑制震荡等词与系统其余部分对齐。
6. **完整性护栏适配**:新文案满足现有护栏测试——registry 内零星号;运行时玩家可见文案零非白名单英文泄漏(raw registry 仍含 AI/Fork/KPI 等由 normalizePlayerFacingCopy 在运行时转换的中间态词)(保留 Aster/A1/ECHO-9/K-17/C-4/M-17/v0/v1 等专名)、中文主导、您→你、代码块/日志引用改中文呈现以通过泄漏检查。
7. **收尾补漏(同一轮第二次提交)**:`decisionPlayerLabels`(ACT V 溯源行)同步为新术语(经济原则/提升原则/扩张原则/人类形态原则/研究治理原则/地外治理/披露原则),并补上缺失的 contact_doctrine(接触原则)与 production_values(生产价值观)标签——此前这两项会在溯源行泄漏原始英文 decisionId;为 M15 权限组合审计节点新增 1 条 registry override,把 canonical 里的"AI Fork权限"改为"AI分叉权限"(registry 总 key 数 630→631,新增 key 为纯文案覆盖,无哈希影响)。

### 验证
- 67 文件 / **545 用例全部通过**(含 playerFacingNameConsistency 与 runtimeAssetClassification 全部护栏)
- `npm run build` 通过(仅已知大 chunk 警告)
- 自动断言:用户 13 条点名错误 + 6 条统一项 + 20 条禁用串全部按预期存在/消失;生产 bundle 复验通过
## 12. Production Closeout 修复(90e706a 复审后的窄收尾)

按复审结论执行三项窄修复;其余 P2/P3 项目(分支固定属设计取舍、浏览器 E2E、Non-Mainline 去重窗口、20MB route trace 快照、scheduler 旧 dead code、branch protection、bundle 体积)保持记录,留待下一大版本,不在 Production Final 上滚动打磨。

### A. Contact 关闭路线的主线真空压缩(P2-High)
- 复审发现:Contact 条件未满足时,slot 151 渲染 NOCONTACT bridge,152–161 十个门控场景全部回退成 Ordinary,162–163 本就是 Ordinary,形成"Space 决策 → bridge → 连续 12 个普通对话 → Security"的主线真空区。
- 修复:新增 `effectiveStoryPlanForRun(run)`——Contact 关闭的 run 在运行时日历中直接移除 152–161 十个门控槽位(151 bridge 保留),节奏变为 bridge → 2 个设计内 Ordinary → Security。门控全部输入(资源网络 flag、异常种子事件、两项 doctrine 决策)在 slot 147 前定型,分支投影对整局稳定,无中途翻转风险。
- 连带:`scheduleNextConversationId` 改按 per-run 日历取槽;`updateProgressForSchedule` 的幕边界改按 per-run 日历计算(新增 `getActConversationCountsForRun`);`auditMainlineSchedules` 支持传入分支日历,主线序列改为按会话 ID 位置无关比对。
- 结果:Contact 关闭 = 180 场对话,开启 = 190 场;关闭路线 bridge→Security 之间 ≤4 个 Ordinary(回归断言),全局最大连续 Ordinary ≤6(与开启路线同一设计上界)。Decision/Ending/decision binding 零改动。

### B. ACT V 披露原则 value labels 补齐(P2-Low)
- `contact_disclosure_doctrine` 四个取值补齐玩家可见标签:控制性沉默/分阶段披露/开放科学/文明级披露。此前 ACT V 溯源行退化为只有"披露原则",四个不同选择不可区分。
- 新增 `proposalLabelCoverage.test.ts`:断言所有 proposal.historySignals 的 decision 信号同时具备 decision 与 value 玩家标签,防止再漏。

### C. Mainline2 真实路线 pacing audit(P2 QA 缺口)
- 旧 CI "full-run pacing audit"(26 场)审计的是退役的 createRun() 路线,已更名为 "legacy v2 route pacing audit" 并注明。
- 新增 `mainline2.pacingAudit.test.ts`:对 createMainline2Run 真实场景图做只计数审计(不等待动画),双分支各走一条完整路线:关闭 = 180 场/232 次选择/对比阅读估计约 118 分钟;开启 = 190 场/236 次/约 121 分钟;快速阅读约 65–67 分钟。断言带 ±10% 预算,内容增删导致节奏漂移会在 CI 直接暴露(输出 INSTANCE_MAINLINE2_PACING_AUDIT)。

### 验证
- 69 文件 / **552 用例全部通过**(较 90e706a 净增 5 项:pacing 双分支 2 项、label 覆盖 3 项;若干既有断言随分支日历同步更新)
- tsc app/node + `npm run build` 通过
- 同步修正本文档前半段残留旧术语(经济主义/提升主义/扩张主义/世界外治理/研究治理学说/人形学说 → 现行"原则"系)与泄漏措辞精度
