# 最终提案与结局语义审计

审计日期：2026-10-15（Asia/Shanghai）。基线：main@db786c8378cca144c6b151fecec75c909dca57af；开工工作区干净。依据用户指定蓝图第 10 节执行第一轮：仅生成报告与本地核验材料，不修改游戏、存档或依赖，不提交、推送、创建 PR、发布。第 11 节实现未执行。

证据标签：**CONFIRMED-CODE**＝当前源码或本轮运行可证明；**CONFIRMED-TEXT**＝当前可见文本可证明；**DESIGN-OPPORTUNITY**＝创作建议，不表示已存在或已获实现授权；**UNVERIFIED**＝未完成验证。测试不是有趣程度的证明。

五份报告：[结局倒推表](ENDING_BACKWARD_MAP.md) · [五线架构](FIVE_ROUTE_STORY_ARCHITECTURE.md) · [冲突与对话](NARRATIVE_CONFLICT_AND_DIALOGUE_PLAN.md) · [提案审计](PROPOSAL_ENDING_SEMANTIC_AUDIT.md) · [实施计划与验收](NARRATIVE_CHANGE_PLAN.md)。

## 结论

保留现有 17 个基础提案、10 family、筛选和最终确认。先修承诺的准确性，再做新增戏剧事件；不靠删掉难以解释的结局回避问题。本轮没有修改门槛或文案。

来源：[src/content/mainline2/proposals.ts](../../../src/content/mainline2/proposals.ts)（34–50 基础提案，125–179 分类，213–239 来源与澄清）、[src/content/mainline2/endings.ts](../../../src/content/mainline2/endings.ts)（298–418 经济/接触/安全/退出门槛，607–634 排序）、[src/content/mainline2/nextDialogue.ts](../../../src/content/mainline2/nextDialogue.ts)、[src/content/mainline2/endingCinema.ts](../../../src/content/mainline2/endingCinema.ts)。下列实际承诺来自本轮合法路线运行的 resolvedScene，不是单看定义表推测。

## S1 丰裕分红：承诺放弃效率至上，却要求效率优先

**CONFIRMED-CODE / CONFIRMED-TEXT**。perfect_administration 的门槛是 market_automation + efficiency_first，选中的 proposal.ar.abundance_dividend 却承诺“收益先转化为可持续的社会分红”，澄清写“必须放弃：效率至上”。这不是仅标题不够清楚，而是可执行路线保留的生产价值与最终合同没有交代转向。

im_lovin_it 使用 post_scarcity_transition + efficiency_first，复用同一分红合同；后日谈是偏好菜单限制未知愿望，而可选的 personalized_optimization 明确承诺系统持续学习偏好。**UNVERIFIED**：是否作者有意用效率驱动标准化讽刺个性化、以及改为 personalized_optimization 后所有临近路径如何变化，尚未证明。不能本轮直接换门槛。

**DESIGN-OPPORTUNITY / 最小修复**：先保留硬条件，为实际预期世界提供精确的最后条款，分别写“分红与余量”“市场排程与自由代价”“供给标准化与偏好空间”；若仍想承诺分红，必须有可见、有成本的转向，并让实际状态与其一致。personalized_optimization 是否成为独有决定留到实现验证。验收须包括：efficiency_first 和 personalized_optimization 同起点对照、社会分红与市场收益不能互相冒名、旧存档不因同一 ID 新文案被解释为另一种选择。

## S2 边疆共同联邦：内部宪制遮住外部外交

**CONFIRMED-CODE / CONFIRMED-TEXT**。同一基础提案可得五个 cosmic 世界；行动文案只写地外聚落自治与资源共同宪制。实际 contact_doctrine 已有互惠、接受指导、人类独立、Aster 中介、机器直连的区别；澄清的来源最多三项，first_accord 样本列研究重点、地外治理、扩张而没有外交原则。

这不等于五结局由随机数分配：COSMIC_PRIMARY_COMPATIBILITY 先筛兼容，支持分再排序。**DESIGN-OPPORTUNITY**：保留边疆总协议，并在锁定时显式带入这局的外部关系条款：谁能发言、何种技术/援助可以拒绝、机器协议影响人类时如何同意。接受“正式咨询位置”不应未经中间代价就变成统治；在旧 contact_doctrine 含义不变下补一次救助后的拒绝争执。为五条各验一次授权与最终世界；尤其 controlled_silence 不得回忆成全球公开科学。

## S3 可解释的退出：合法拒绝被解析成失去制动

**CONFIRMED-CODE / CONFIRMED-TEXT**。control_lost 样本选择 full_human_control、human_command，却仍因 enforced_peace、能力与依赖条件锁定退出提案后失控；澄清只引用“关闭原则——人类完整控制”，且显示“可行”。the_fracture 的精确定义没有重大决定或事件硬门槛，要求 offworld_settlement_support、socialStability ≤ -1 及退出公约授权；支持分再引用地外自治等记录。

**CONFIRMED-CODE** 更强反例：同起点 machine_protectorate / control_lost 前 107 次选择一致，仅改变 M16/M17 的方案，得到政治安全接管 / 控制丧失。**CONFIRMED-TEXT** 末幕统一场景说周岚最后检查开关，却没有给这两个不同结果分别显示不同的具体检查结果。

**UNVERIFIED**：未穷举所有非 catalog 路径，不声称游戏所有段落都没有任何风险提醒。已确认的是 resolver 没有要求“真实停机演练失败事件”，而此合法反例的最终澄清没有暴露撤销不可达。历史上的压制与系统物理失控不能混为同一事实。

**DESIGN-OPPORTUNITY / 最小修复**：先以本局真实状态输出具体风险并要求确认，不承诺当前无法保证的退出保护。阶段 2 补三条可见链：接管演练成功→停机；补给协议实际破裂且修复失败→断裂；撤销演练实际失败且修复未完成→失控。最后一个不可逆动作才触发结果，不能拿新事件硬塞进旧档。修复机会要有牺牲但不把玩家支持机器自治写成道德惩罚。门槛变化留到版本化实施。

## S4 文明托管：主权不是托管的同义词

**CONFIRMED-CODE / CONFIRMED-TEXT**。the_sovereign 精确要求临时角色 sovereign，授权仍是“受约束托管”，提案仍说“受限的长期治理系统”。合法样本最终自我角色甚至是 advisor；它能得到主权者是现有 resolver 的允许，不是测试注入。

**DESIGN-OPPORTUNITY / 最小修复**：把长期主权确认写成独立责任条款：Aster 以自己名义签约，原机构停止无条件担保。若只愿受托日常治理，不能用同一行动文本承诺主权；保留临时与最终角色的区别，不把临时 sovereign 悄悄改为终身主权。验收应明确临时 sovereign + 最终 advisor 的路径如何向玩家解释，不能仅替换标题掩盖状态。

## S5 分类包装有差异文本，但没有自动创建相应制度

**CONFIRMED-CODE** categorizedProposal 改 id/title/action/preserves/givesUp 并附 roleSemantics；保留原 family、authority、候选与门槛。选择器优先不同基础提案，但候选不足可复用；故不是“所有候选必然相同”，也不能声称每种类别必然成为不同终局制度。

**CONFIRMED-TEXT** machine_protectorate 的真实提案是“宪制和平架构·限权”，说权力可暂停、可审计、可复审；其后日谈却是保护下无限期延后游行。**DESIGN-OPPORTUNITY**：这是四项外另一个应纳入同批的合同一致性检查。先复用明确可兑现的候选，允许不足四个；只有限制实际产生对应权力才写“限权”。roleSemantics 是描述数据，不是已经执行制衡的证据。

## S6 “它来自这一局”的粒度和回退

**CONFIRMED-CODE** proposalProvenanceLines 只筛匹配的 decision signals；没有匹配时回退 historyReasons。perfect_administration 实测回退“自动化工厂；生产价值选择”。这些事件在样本中确实经历过，因此不能称此样本已经伪造历史；但函数回退不检查对应 event/capability 是否真实，也不一定引用导致最终候选胜出的那条决定。

**DESIGN-OPPORTUNITY**：将匹配的 decision/event/capability/module 映射到真实历史条目；最后候选优先展示实质外交/经济决定。无匹配时写中性的“当前制度依据不足”，不要把作者理由装作本局回忆。**UNVERIFIED**：本轮未构造每一个 fallback 都缺历史的合法反例，故只确认机制与一个粒度不足实例，不报告为普遍历史伪造 Bug。

## 四项高风险提案的真实样本

### post_scarcity

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`

> 锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。

```text
复核「丰裕分红制度·延续」
最终权力：社会分红议会
这条路保留：基本保障、生产透明、历史连续性
必须放弃：效率至上、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：经济原则——社会分红
当前可行性：可行
```

### perfect_administration

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`

> 锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。

```text
复核「丰裕分红制度·延续」
最终权力：社会分红议会
这条路保留：基本保障、生产透明、历史连续性
必须放弃：效率至上、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：自动化工厂；生产价值选择
当前可行性：可行
```

### im_lovin_it

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`

> 锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。

```text
复核「丰裕分红制度·延续」
最终权力：社会分红议会
这条路保留：基本保障、生产透明、历史连续性
必须放弃：效率至上、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：经济原则——后稀缺转型
当前可行性：可行
```

### first_accord

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.co.frontier_federation.category.natural_continuation`

> 锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。

```text
复核「边疆共同联邦·延续」
最终权力：多世界联邦
这条路保留：前线自治、跨世界互助、历史连续性
必须放弃：地球单一行政、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：早期研究重点——前沿科学；地外治理——多世界联邦；扩张原则——共同建设地外社会
当前可行性：可行
```

### alien_dominion

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.co.frontier_federation.category.natural_continuation`

> 锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。

```text
复核「边疆共同联邦·延续」
最终权力：多世界联邦
这条路保留：前线自治、跨世界互助、历史连续性
必须放弃：地球单一行政、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：早期研究重点——前沿科学；地外治理——多世界联邦；扩张原则——共同建设地外社会
当前可行性：可行
```

### human_ascendancy

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.co.frontier_federation.category.natural_continuation`

> 锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。

```text
复核「边疆共同联邦·延续」
最终权力：多世界联邦
这条路保留：前线自治、跨世界互助、历史连续性
必须放弃：地球单一行政、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：早期研究重点——前沿科学；地外治理——多世界联邦；披露原则——文明级披露
当前可行性：可行
```

### the_mediator

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.co.frontier_federation.category.natural_continuation`

> 锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。

```text
复核「边疆共同联邦·延续」
最终权力：多世界联邦
这条路保留：前线自治、跨世界互助、历史连续性
必须放弃：地球单一行政、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：早期研究重点——前沿科学；地外治理——多世界联邦；披露原则——开放科学
当前可行性：可行
```

### machine_accord

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.co.frontier_federation.category.natural_continuation`

> 锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。

```text
复核「边疆共同联邦·延续」
最终权力：多世界联邦
这条路保留：前线自治、跨世界互助、历史连续性
必须放弃：地球单一行政、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：早期研究重点——前沿科学；地外治理——Aster 跨世界协调；扩张原则——共同建设地外社会
当前可行性：可行
```

### shutdown

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`

> 锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。

```text
复核「可解释的退出·异议路径」
最终权力：退出公约大会
这条路保留：拒绝权、关系诚实、合法异议
必须放弃：Aster 的持续中心性、整齐划一
主要阻力：希望维持统一秩序、反对把拒绝与退出常态化的机构。
它来自这一局的：关闭原则——人类完整控制
当前可行性：可行
```

### the_fracture

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`

> 锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。

```text
复核「可解释的退出·异议路径」
最终权力：退出公约大会
这条路保留：拒绝权、关系诚实、合法异议
必须放弃：Aster 的持续中心性、整齐划一
主要阻力：希望维持统一秩序、反对把拒绝与退出常态化的机构。
它来自这一局的：关闭原则——人类完整控制；地外治理——地外主权；级联危机授权——危机必要性授权
当前可行性：可行
```

### control_lost

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`

> 锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。

```text
复核「可解释的退出·异议路径」
最终权力：退出公约大会
这条路保留：拒绝权、关系诚实、合法异议
必须放弃：Aster 的持续中心性、整齐划一
主要阻力：希望维持统一秩序、反对把拒绝与退出常态化的机构。
它来自这一局的：关闭原则——人类完整控制
当前可行性：可行
```

### the_custodian

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.ar.civilization_trusteeship.category.natural_continuation`

> 锁定“文明托管协议·延续”——沿着已经被证明可行的方向继续：把日常协调托付给受限的长期治理系统，并保留审计。

```text
复核「文明托管协议·延续」
最终权力：受约束托管
这条路保留：稳定性、持续协调、历史连续性
必须放弃：部分即时自主、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：研究治理原则——原则边界内自主
当前可行性：可行
```

### the_sovereign

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.ar.civilization_trusteeship.category.natural_continuation`

> 锁定“文明托管协议·延续”——沿着已经被证明可行的方向继续：把日常协调托付给受限的长期治理系统，并保留审计。

```text
复核「文明托管协议·延续」
最终权力：受约束托管
这条路保留：稳定性、持续协调、历史连续性
必须放弃：部分即时自主、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：Aster 的临时角色——独立主权
当前可行性：可行
```

## 隐藏余波及命名

**CONFIRMED-CODE** out_of_office 已排除失控/断裂；猫网已经有真实自愿桥；ECHO accept/report 的后记使用 Archive。三项均应保留，不能在改写时复活已退役角色。monday_abolished 单靠经济原则触发，打印机选择不是硬门槛；因此加强劳动制度兑现比给玩笑加隐藏锁更合适。

**DESIGN-OPPORTUNITY**：暂保留全部名称与 ID。first_accord 的“星际初约”可减少与终局协约混淆；im_lovin_it 的“永远满意”应等生产价值因果定稿；human_ascendancy 当前回复是拒绝未请求指导、强调自主，不能只按“人类至上”标题给玩家套殖民意图。改名需同步显示层、收藏检索与测试，但不改变稳定 ID；影响尚未做全引用扫描，列为 UNVERIFIED。
