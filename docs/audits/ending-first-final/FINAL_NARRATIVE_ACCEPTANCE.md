# INSTANCE 七线叙事最终验收

2026-10-16，Asia/Shanghai。执行依据：用户的 INSTANCE_CODEX_AUTONOMOUS_NARRATIVE_FINISH_20261016.md。本文为验收记录；游戏由各 PR 的实际源码交付。

## 交付状态

游戏验收通过。已部署并验证的游戏代码基准为 [`3440fbb48487f6c47100673336664c4702c16f87`](https://github.com/seiya058904/INSTANCE/commit/3440fbb48487f6c47100673336664c4702c16f87)。旧版与新版均通过真实 resolveScene → commitChoice 执行，不注入结局。本报告记录该次游戏代码验收，文档合并继续使用相同游戏源码。

## 玩家实际经历

|深线|终局之前的关键行动与成本|后续个体生活/回访|源码|
|---|---|---|---|
|A 治理|十一楼急救分别经历逐项签字、到期停权、克制、协约修订、实质双否决或地方差异；结果/必要性授权另有真实分支|病人等待、两地预算与夜班账回到听证，不用一种投票包装六个世界|[edition4Authority.ts](../../../src/content/mainline2/edition4Authority.ts)|
|B 机器|六个实例分开支付电费、议会败选不克隆票数、A1 独立账户；迁居预付半年补给并停止扩建|实例分别拒绝续约、机器自己付罚款、月面替换件账单；延期者仍在地球|[edition4Machine.ts](../../../src/content/mainline2/edition4Machine.ts)|
|C1 人类|两台设备分配、拒绝增强仍能考核入职、原体/副本/关系人分别答复；上传需先完成实际连续性审查|普通餐桌、老键盘、三个可分别关上的门；认定未过只保存资料，不创造上传人格|[edition4Life.ts](../../../src/content/mainline2/edition4Life.ts)|
|C2 物种|迁徙季调整表决、通道补偿及维护、犬类反对票真实改变支出；未获代表权只调查与改道|施工延期账、维修基金、空活动场；猫网仍需主动 opt-in|[edition4Life.ts](../../../src/content/mainline2/edition4Life.ts) 与原 M11 桥|
|C3 经济|取消扩建订金兑付保障、改道探友/错过晚饭、用六份食材试做未知菜|工人的冰箱、第二次探访、第二锅汤；冷链是否修复决定等待与新片区供给|[edition4Economy.ts](../../../src/content/mainline2/edition4Economy.ts)|
|D 宇宙|独立信号核验占用电力；互惠、外来指导附条件、本地主权绕行、逐方翻译、机器外交|拒绝一次交换、附条件供热实际卡住/六周重建、燃料与翻译账；不接触则保留月面周末|[edition4Contact.ts](../../../src/content/mainline2/edition4Contact.ts)|
|E 安全/退出|共同实际减权、封闭外圈、政治禁退、真实协议撤回、未送达的撤销及修复、接任/隔离/凭据核验|人工值班九分钟、改期的探亲、重复许可、续跑任务、付工资的接任班组|[edition4Safety.ts](../../../src/content/mainline2/edition4Safety.ts)|

实例资源与治理/公共控制专项、诊所/湿地、身体/人格、核验/本地维护都有不能兼得的投入。一局以一条深线为主，保留有限跨线；没有强制完整通读其余六条。当前 36 个验收路径为 **92–104 个会话、105–121 次真实选择提交**，原版日历与阅读预算检查也保留。

`edition4Pivot.ts` 允许在第一轮结果之后付费转移尚未开工的下一班人。机器→诊所、诊所→生活排程、工厂→湿地、湿地→边疆、接触→控制链均有实际转岗回执；转岗费已付、原新增项目延期，已签契约与排程前缀不抹掉。

跨线证据：A×B 读取公开执行权，改变 A1 签字、担保和到账；A×C 改变实际保障付款的署名与 43/11 分钟等待；B×D 决定气密门电池、归还义务与四天拥挤；C×E 冷链取消的现场维修/供给缺口随保存选择回返；D×E 对外中继与防御警报导致七天关闭或十一分钟复核，仓储费/临时住宿费进入后续回信。

## 32+4 与合同

- [mainline2Edition4RouteCatalog.ts](../../../src/game/mainline2Edition4RouteCatalog.ts)：新版 32 公开 +4 隐藏的合法选项配方；原 [mainline2RouteCatalog.ts](../../../src/game/mainline2RouteCatalog.ts) 继续作为 edition 3 的兼容预言。
- [EDITION4_ROUTE_EVIDENCE.json](EDITION4_ROUTE_EVIDENCE.json)：每路完整 node/choice 链、新增场景的实际问题/答复、保存回执、最终合同和个体回访。由 `node tools/generate-edition4-acceptance.mjs` 生成并校验，不设置 endingId。
- 32/32 公开世界、4/4 隐藏余波从空历史达成。生成器逐路核对 M16 → M17 澄清 → 锁定 → 档案合同相同，保留原始 choiceId、历史文字与最后承诺。
- [原 12 组同起点反事实](../../../src/game/mainline2.contractTruth.test.ts)未删改；经济、机器、权力、生命、接触另有行动/收据/回访成对检查。[新增 4 组修复/责任转移与 5 组有成本的未来转向](../../../src/game/mainline2.edition4Causality.test.ts)，核对共同前缀、独有场景、保存结果和回访，不能只比较 endingId。
- 新版停机须有真正接任、隔离和撤销结果；断裂须有已退出且未重签的共同协议；失控须有接受但未到端的实际撤销失败，修好后不能继续声称失控。政治禁退不能冒充技术故障。
- 主权签约实际扣保证金、撤回机构无限担保并暂停扩算力；也能撤回主权声明转为受托/有限建议。原临时角色与长期意向仍按原话留档。林绍衡新对话沿用原 User #7316 及其介绍状态。A1 若先前被保留源实例控制，迁居须另行明确撤权并记录新事件；旧档缺少这次新授权时不凭空生成撤权回执。
- 接受咨询本身不构成外来统治；必须真正接受附条件更新并遭遇本地决定受阻。拒绝后六周重建与重新确认短约改变后续关系。

## 保存兼容矩阵

|边界|实际验证|
|---|---|
|edition 3 进行中与已完成|原 32+4 合法全路线、固定轨迹、原日历数量及旧合同；加载/重放保留原解释|
|早期 edition 4 的已完成/待确认|[src/game/fixtures/interim-v4-fa857eb.json](../../../src/game/fixtures/interim-v4-fa857eb.json) 是改动前从真实旧代码捕获的五组记录，覆盖停机、失控、断裂、主权、延期迁居；恢复后的原话、旧世界与最终确认均保持|
|新版 edition 4|32+4 完整路径，行动后刷新、实际付费转向、Contact 开/关及已入场不回退、最终确认|
|普通模式/已答部分/exposure/meta|既有 non-mainline-resume、checkpoint、repair-state、ending collection 等门禁完整执行，已答部分不丢失|
|联合写入失败/损坏/冲突|checkpoint-recovery、history-recovery、recovery-ownership、双标签过期确认与 CAS/锁门禁保留；不删除原档绕过错误|
|未知因果版本|加载校验拒绝不认识的标记；原存档保留给恢复/导出流程|

仍用 `instance:checkpoint:v2`。新局为 calendar 4/causality 1；旧档读取不会补签新历史。中途旧 edition 4 只有真正选择新制度/退出行动才采用新因果门槛。

## 工程、屏幕与正常阅读

- 单测 **918/918，93 文件**；生产构建与两份 TypeScript 配置通过；`git diff --check` 通过。已有大块体积提示保留，没有为此做无关拆包或升级依赖。
- 完整浏览器 **154/154，2.7 分钟**。所有旧图片/音频检查保留；曾有新断言误引回执句子，已纠正为实际回访。另复现减弱动效的字幕先于图片加载：人工挂起 WebP 时 complete=false/宽度0，释放后加载与 decode 成功；把同一成功条件改为有界等待，并额外要求恰好一张图片及 decode。320px 重复5次通过。没有跳过或降低资源成功标准。
- 新增完整 UI 路径覆盖安全六世界、主权/日常托管、四隐藏余波、修复对照和付费转向。结合此前 A/B/C1/C2/C3/D 全路线，32 公开 +4 隐藏均有真实从头点击到确认/档案的证据。
- Chrome 隔离上下文，320/390/768/1440 及原有1920视口；检查开场、关键分叉、确认对话框、结局档案、横向溢出、联系人、保存/重载。截图在忽略的 `temp/edition4-*`；代理查看了320断裂、390主权及前阶段各深线画面。
- 正常节奏下的打字、读取起点、手动滚动、减弱动效、转场均经现有 browser 用例；代理审读了行动→收据→回访连续文本；36条采样路径的新增问题最长247字符；逐场统计所有实际显示的候选选项（含未选的付费转向），最长62字符，为 `v4-pivot-economy`（不含最终合同）。没有把 qaPacing=instant 的自动通关当成真人阅读时长。

独立审查的两项有效发现已修复：治理服务放到临时角色选择之后，补测三个非机器重点的两种实际责任；取消交接不启用新因果门槛，只有真实执行才采用。新增回归同时验证旧候选仍可用、原记录不被修改和实际执行后可恢复。

## 审查、部署与工作区

PR31–34 已合并，相关 CI/Pages 成功。阶段线上产物字节验收记录覆盖 PR31、32、34；PR33 的部署执行成功，未另行声称对当时线上产物做过独立字节比较。PR35 最新源码 `868bdc87385344ba690d877d8bfaa1809c14b8b4` 已通过[精确提交 CI](https://github.com/seiya058904/INSTANCE/actions/runs/38790582932)（918 单测、154 浏览器，CI 浏览器耗时14.8分钟）及[最终独立复审](https://github.com/seiya058904/INSTANCE/pull/35#issuecomment-6200169908)，原两条有效问题已修复并关闭，没有已知 P0/P1/阻断 P2。合并后的 `3440fbb` 已通过 [main CI 与 Pages 部署](https://github.com/seiya058904/INSTANCE/actions/runs/38793178257)。原有 Pages 工作流和 `/INSTANCE/` 资源基址不变。

|PR|交付切片|合并提交|main CI / Pages|
|---|---|---|---|
|[#31](https://github.com/seiya058904/INSTANCE/pull/31)|原合同与历史修复收口|`5b1b222`|[成功](https://github.com/seiya058904/INSTANCE/actions/runs/38772062417)|
|[#32](https://github.com/seiya058904/INSTANCE/pull/32)|新版日历与经济行动|`9bf7042`|[成功](https://github.com/seiya058904/INSTANCE/actions/runs/38776453311)|
|[#33](https://github.com/seiya058904/INSTANCE/pull/33)|机器与治理执行|`a4483ed`|[成功](https://github.com/seiya058904/INSTANCE/actions/runs/38783269994)|
|[#34](https://github.com/seiya058904/INSTANCE/pull/34)|生命、物种与宇宙接触|`ce99824`|[成功](https://github.com/seiya058904/INSTANCE/actions/runs/38786168389)|
|[#35](https://github.com/seiya058904/INSTANCE/pull/35)|安全因果、主权落地与付费转向|`3440fbb`|[成功](https://github.com/seiya058904/INSTANCE/actions/runs/38793178257)|

[线上入口](https://seiya058904.github.io/INSTANCE/)：下载上述精确合并 SHA 的 `github-pages` artifact，线上 HTML 完全相同，JS/CSS 的 SHA256 字节一致。JS `index-Cjnk86du.js`：`e1696f6835c320eadb9a73b4a938ed737319f8979b0c469220d5c6072ad524d0`；CSS `index-CeuEmoqZ.css`：`f6fcc81f2c874f9afcfa237ae3eda26422a9a0532f5a19f1bdf7c0b40d4c4e3b`。比较对象为 CI 产物，不是本地 Windows 构建。

线上隔离 Chrome：320/390/768/1440 新局、首次选择、保存与刷新全部通过；8份真实记录覆盖新版接任、失控/主权/保护国最终确认，旧 edition3 进行中/完结及改动前 edition4 停机/主权结局。恢复后的原历史逐项一致，最终锁定原话与档案一致，结局图片实际 decode，未出现横向溢出或页面异常。另在正常节奏下连续操作接任→执行回执→回访并保存截图。本地证据：`temp/production-3440fbb.log`、`temp/pages-3440fbb/`。

六份原未跟踪审计输入逐个 SHA256 与任务前快照一致，仍保持未跟踪；基线与核对记录保存在 `temp/round1-input-hashes.json`。游戏合并后本地与远端 main 一致，五个已合并的本地任务分支已检查祖先关系并整理。

## 非阻断限制

可选文字整理：主权签约引用已保存答复时可见一处句尾重复句号；不影响原存档文字、规则或操作，保留为以后编辑事项。

没有独立真人试玩，也没有物理 Android/iOS 手机验收；移动证据为真实 Chrome 的指定视口。网络图片可以先加载后显示，文字和导航仍可操作；验收在实际图片加载及解码成功后截图，另有 WebP→SVG→文本失败回退测试。
