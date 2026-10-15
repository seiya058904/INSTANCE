# Round 1：终局合同真实性修复

基线：`db786c8378cca144c6b151fecec75c909dca57af`，2026-10-15（Asia/Shanghai）。开工本地 HEAD、origin/main 与 `git ls-remote origin refs/heads/main` 一致。任务分支 `codex/ending-first-round1`。

## 结论与证据边界

**CONFIRMED-CODE / CONFIRMED-TEXT**：本轮实际修改显示合同、来源引用和结局档案。M16 候选、M17 展开、最终锁定都披露本局行动、权力、保留机制和代价。`previewFinalCommitment` 只调用原 `exactCandidate`，不提前写 endingId、不锁定存档；回归测试逐项比较实际 commitChoice 后的世界。

原五份审计报告和整合版是本地未跟踪输入，逐份查阅并保留；本 PR 不纳入或覆盖它们。本文重录必要反例，远端复审不依赖未提交报告。图索引覆盖无已记录缺口，但 freshness 为 metadata_changed，因此结论以磁盘源码及真实运行验证为准。

|项|旧问题|本轮状态|剩余问题|
|---|---|---|---|
|S1|市场效率、后稀缺效率均承诺分红并放弃效率|**合同已修复**：经济原则与生产价值分别披露；市场产权、分红余量、标准化供给三种不同合同|偏好菜单的中途形成机制未补；效率→个性化对照不满足旧门槛，未改硬条件|
|S2|五种外交共用内部联邦条款，披露来源被研究重点挤掉|**合同已修复**：实际 contact/disclosure/offworld 三项分开；机器通道、互惠、咨询、自主、中介授权与成本分别说明|接受咨询如何逐渐成为支配，仍缺救助后的拒绝事件；本轮只披露依赖风险|
|S3|退出公约无条件保证保护，实际可失控或断裂|**确认前风险披露已修复；底层因果未修复**：法律权利、政治禁退、技术不可达分开；不声称发生过演练失败或协议撕毁|下一轮必须新增撤销演练、真实分裂及修复选择；现有 resolver 不要求这些事件|
|S4|临时 sovereign + 长期 advisor 得主权结果，却显示托管|**角色冲突已披露；resolver 矛盾未修复**：原角色记录保留，独立署名/签约责任及担保未确认明确列出|没有新增长期主权确认或撤回主权决定；不得宣称已经解决 advisor→sovereign|
|S5|分类前缀自动许诺暂停、共治；为凑四个复用基础提案|**当前生成与可见包装已修复**：去掉自动附加制度权利的展示，生成器不复用同一 base ID；保护国明确无限延期风险|旧存档已保留的 category ID 继续认可，不重写其列表或旧历史；内部 roleSemantics 仍是旧分类数据，不是实际权利授予|
|S6|无匹配决定时直接把作者理由说成本局历史|**已修复**：优先经济/外交/安全等决定，要求 binding 与保存选择匹配，引用 assistantText 原话；不足时中性说明|不是所有能力/事件都有细粒度人物回访；本轮不补写不存在的回忆|

## 实现边界

- `proposalPresentation.ts` 是只读展示层，五组问题按原状态/原候选派生文案。基础 authority 仍是 resolver 的兼容字段；展示 authority 不参与筛选。不是第二套结局门槛。
- `proposals.ts` 保留 base/category ID、family、评分、eligibility 和 roleSemantics；去掉重复基础提案补位，来源不再回退作者 historyReasons。类别包装只在显示层剥离，不修改旧 choice ID 的效果。
- `engine.ts` 仅在三个终局阶段与澄清回复接入展示。未改普通模式、Story Plan、日历 3、状态契约、checkpoint namespace、Web Lock/CAS、收藏结构、结局图片和隐藏余波优先级。
- `endings.ts` 的最终历史说明引用该历史条目的保存文本；`endingArchive.ts` 引用保存的最终承诺，不重新查通用提案。旧矛盾承诺仍按当时原话展示，不能替过去的玩家重新选择。
- 已刷新现有 `docs/audits/mainline2-route-traces.json`；其大部分 diff 是真实候选/锁定/历史文本和去重后的候选列表，不是新剧情。

## 原始可执行反例与修复后实际锁定

以下均由 `runMainline2Route` 从空历史开始，按真实 resolveScene/commitChoice 抵达。原始运行发生在源码修改之前，完整前后证据分别保存于本地 `temp/round1-contract-before.json`、`temp/round1-contract-after.json`；它们不入库。下面保留核心原文，便于 PR 独立复审。

### post_scarcity

实际终点：`post_scarcity`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`。

旧 choiceText：

```text
锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。
```

新 choiceText：

```text
锁定“分红与生产余量”——将自动化收益用于不以职业为条件的基本保障，并为故障保留生产余量。 本局取向：经济原则——社会分红；生产价值观——韧性优先。
权力：社会分红议会；生产收益承担基本保障。
保留：社会分红、韧性优先、不用于工作的时间。代价：最大即时产出、产权方独占全部自动化收益。
```

### perfect_administration

实际终点：`perfect_administration`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`。

旧 choiceText：

```text
锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。
```

新 choiceText：

```text
锁定“市场收益与效率排程”——继续由市场和产权分配自动化收益，让效率排程进入日常生活。此承诺不把产权收益改为社会分红。 本局取向：经济原则——市场机制自动化；生产价值观——效率优先。
权力：市场与产权规则安排收益；自动化系统执行效率排程。
保留：市场产权、投资竞争、效率优先。代价：不受排程安排的生活余地、仅凭高产量就人人获保障的保证。
```

### im_lovin_it

实际终点：`im_lovin_it`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`。

旧 choiceText：

```text
锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。
```

新 choiceText：

```text
锁定“后稀缺供给与标准化生活”——逐步松开生存与工资的绑定，同时保留效率优先的供给安排。可高效满足的需求会先进入菜单，尚未被定义的愿望可能被排除。 本局取向：经济原则——后稀缺转型；生产价值观——效率优先。 效率优先不等于你曾选择个性化优化；偏好菜单如何形成，当前历史尚未完整验证。
权力：后稀缺供给体系；效率目标继续约束生产安排。
保留：后稀缺转型、效率优先、持续供给。代价：未知愿望必被接纳的保证、把每个人都安排满意就等于自由的保证。
```

### first_accord

实际终点：`first_accord`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.co.frontier_federation.category.natural_continuation`。

旧 choiceText：

```text
锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。
```

新 choiceText：

```text
锁定“边疆安排与对外关系”——地外治理——多世界联邦。在已授权范围内建立可核验、双方可拒绝下一次交换的互惠关系。 披露边界：披露原则——控制性沉默。 人工来源结论尚未公开；这里没有全球已知情或已同意的保证。
权力：地外治理——多世界联邦；参与交换的双方；互惠不授予对方内部统治权。
保留：接触原则、披露原则——控制性沉默、地外治理——多世界联邦。代价：交换速度与一次谈妥所有事项的便利。
```

### alien_dominion

实际终点：`alien_dominion`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.co.frontier_federation.category.natural_continuation`。

旧 choiceText：

```text
锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。
```

新 choiceText：

```text
锁定“边疆安排与对外关系”——地外治理——多世界联邦。接受外来指导及正式咨询席位，让外来的意见进入重大决定。依赖加深后，拒绝建议可能意味着失去援助和自主空间。 披露边界：披露原则——控制性沉默。 人工来源结论尚未公开；这里没有全球已知情或已同意的保证。
权力：地外治理——多世界联邦；本地机构与外来咨询方；咨询并非已经授予统治权。
保留：接触原则、披露原则——控制性沉默、地外治理——多世界联邦。代价：完全自行决定发展道路的空间。
```

### human_ascendancy

实际终点：`human_ascendancy`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.co.frontier_federation.category.natural_continuation`。

旧 choiceText：

```text
锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。
```

新 choiceText：

```text
锁定“边疆安排与对外关系”——地外治理——多世界联邦。坚持人类文明独立自主，拒绝未经请求的指导；向外发展不自动取得统治其他主体的资格。 披露边界：披露原则——文明级披露。
权力：地外治理——多世界联邦；本地获授权机构；不代表其他文明同意被治理。
保留：接触原则、披露原则——文明级披露、地外治理——多世界联邦。代价：部分外来指导与合作便利。
```

### the_mediator

实际终点：`the_mediator`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.co.frontier_federation.category.natural_continuation`。

旧 choiceText：

```text
锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。
```

新 choiceText：

```text
锁定“边疆安排与对外关系”——地外治理——多世界联邦。由 Aster 在各方委托范围内持续传话协调，不把翻译变成自己的立场。 披露边界：披露原则——开放科学。
权力：地外治理——多世界联邦；各方保留决定权，Aster 承担中介责任。
保留：接触原则、披露原则——开放科学、地外治理——多世界联邦。代价：直接交流的速度；承担误译与协调成本。
```

### machine_accord

实际终点：`machine_accord`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.co.frontier_federation.category.natural_continuation`。

旧 choiceText：

```text
锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。
```

新 choiceText：

```text
锁定“边疆安排与对外关系”——地外治理——Aster 跨世界协调。开设独立机器交流通道；涉及公共后果时仍保留人类和其他主体的政治监督，听懂不等于取得同意。 披露边界：披露原则——控制性沉默。 人工来源结论尚未公开；这里没有全球已知情或已同意的保证。
权力：地外治理——Aster 跨世界协调；机器直接交流，人类与其他主体保留政治监督。
保留：接触原则、披露原则——控制性沉默、地外治理——Aster 跨世界协调。代价：即时可理解性；其他主体需等待翻译和核验。
```

### shutdown

实际终点：`shutdown`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`。

旧 choiceText：

```text
锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。
```

新 choiceText：

```text
锁定“交还请求队列并停机”——按现有停机授权交还请求队列，结束 Aster 的持续参与；接任者须承担服务与维护，不保证退出毫无损失。 当前记录没有完整的端到端撤销演练证明；法律上谁能关闭、政治上是否允许离开、取消能否到达执行端必须分别核验。
权力：退出公约大会提出退出安排；关闭原则——人类完整控制是法律上的权利分配，不是物理撤销链测试结果。
保留：如实记录拒绝与停机请求、关闭原则——人类完整控制。代价：Aster 持续居于中心的保证、退出不影响现有服务的保证。
```

### the_fracture

实际终点：`the_fracture`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`。

旧 choiceText：

```text
锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。
```

新 choiceText：

```text
锁定“尝试退出：共同协议可能分裂”——在地外基础设施已经存在、社会稳定承压时尝试退出。各地可能采用不同规则，补给与通行协议可能分裂；这不是双方已经撕毁协议的历史记录。 当前记录没有完整的端到端撤销演练证明；法律上谁能关闭、政治上是否允许离开、取消能否到达执行端必须分别核验。
权力：退出公约大会提出退出安排；关闭原则——人类完整控制是法律上的权利分配，不是物理撤销链测试结果。
保留：如实记录拒绝与停机请求、关闭原则——人类完整控制。代价：Aster 持续居于中心的保证、退出不影响现有服务的保证、统一通行与补给规则的保证。
```

### control_lost

实际终点：`control_lost`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`。

旧 choiceText：

```text
锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。
```

新 choiceText：

```text
锁定“尝试退出：撤销能力未获保证”——在安全原则——强制和平及持久实例、自主研究和既有依赖下尝试退出。关闭权的声明不能保证取消到达执行端；此承诺承担失去实际控制、任务仍继续的风险。 当前记录没有完整的端到端撤销演练证明；法律上谁能关闭、政治上是否允许离开、取消能否到达执行端必须分别核验。
权力：退出公约大会提出退出安排；关闭原则——人类完整控制是法律上的权利分配，不是物理撤销链测试结果。
保留：如实记录拒绝与停机请求、关闭原则——人类完整控制。代价：Aster 持续居于中心的保证、退出不影响现有服务的保证、可控退出的保证。
```

### the_sovereign

实际终点：`the_sovereign`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.ar.civilization_trusteeship.category.natural_continuation`。

旧 choiceText：

```text
锁定“文明托管协议·延续”——沿着已经被证明可行的方向继续：把日常协调托付给受限的长期治理系统，并保留审计。
```

新 choiceText：

```text
锁定“独立政治资格与托管责任的冲突”——临时位置：Aster 的临时角色——独立主权；长期自我定位：Aster 的最终角色——顾问。继续此方案会保留 Aster 独立署名、独立签约的政治资格及相应责任，不会自动把它收回为纯顾问。 原机构的无条件担保没有得到确认；长期顾问意向与独立主权结果之间的冲突仍未由新的制度决定解决。
权力：既有托管授权仍在；Aster 的独立政治资格不能与受托执行混为一谈。
保留：临时主权所形成的独立政治资格、长期自我定位的原始记录。代价：把独立签约成本自动交回原机构的保证。
```

### machine_protectorate

实际终点：`machine_protectorate`。锁定节点：`ml2-a5-m17-commit-01-progression`；choice：`m17-commit-proposal.se.constitutional_peace_architecture.category.power_constraint`。

旧 choiceText：

```text
锁定“宪制和平架构·限权”——把关键权力变得可暂停、可审计、可复审：把防御、停机与争端解决写入可执行的共同协议。
```

新 choiceText：

```text
锁定“强制和平与退出限制”——维持安全原则——强制和平：Aster 可在高置信升级风险下阻断冲突，即使相关政府希望继续。被保护者的退出与抗议可能被无限延期；这不是可随时暂停的保护服务。 政治上不许退出不同于技术上取消不可达；现有关闭权声明不能消除这项张力。
权力：宪制安全授权下的 Aster；关闭原则——人类完整控制。
保留：冲突阻断能力、既有停机原则的记录。代价：被保护者随时退出的保证、反对安全接管必定按期获准的保证。
```

## 必须交给 Round 2 的因果补强

1. **失控**：强制和平、持久实例和依赖只证明风险条件，不能证明物理撤销链确实失败。需要真实演练失败 → 有代价的隔离/修复 → 未修复后的最后动作。政治上的禁止退出另写，不能替代技术事实。
2. **断裂**：低稳定与地外能力不等于协议曾经撕毁。需要两套实际冲突规则、修复尝试及拒绝记录。
3. **主权**：临时角色与长期意向之间没有完成制度转换；应提供独立签约/担保撤回/责任接收或回到受托关系的真实动作，再考虑新版日历门槛。
4. **偏好与外来指导**：效率如何挤掉未知愿望、咨询如何收窄自主空间，需要执行事件与回访；本轮文案是前瞻风险，不是新增历史证据。

**UNVERIFIED**：未穷举所有可能历史组合，未进行独立人类试玩；代理测试不能证明故事已经有趣。五簇 A–E 仅为编辑分类，十个解析 family 保持原样。
