# PR #31：独立复审后定向修复

2026-10-16（Asia/Shanghai）。修复起点为 `8791fb6677c7776b4bb51ff4edcdf22b4568ce0b`，main 仍为 `db786c8378cca144c6b151fecec75c909dca57af`。追加到 `codex/ending-first-round1`，停在待独立复审，不合并、不部署、不发布。

## 三条意见与修复证据

|意见|实现与可复核证据|
|---|---|
|[P1 合同重合](https://github.com/seiya058904/INSTANCE/pull/31#discussion_r4285140291)|`proposalPresentation.ts` 在同一个 `previewFinalCommitment` 精确预览可解析时，提供 16 个世界的行动、权力、保留与代价。人类三路线、机器三路线、增强/多形态、议席/栖息地、减权/封闭防卫均有机制差异；同时修复同基础提案上的协约/双钥匙、长期托管/日常行政重合。没有提前展示终局标题。|
|[P1 主权身份误报](https://github.com/seiya058904/INSTANCE/pull/31#discussion_r4285140302)|同时读取 provisional / intended。只有 `sovereign + advisor` 显示长期顾问冲突；`sovereign + sovereign` 明确意向一致但履约、问责尚待落实；partner/citizen/coordinator 引用各自原值并中性说明衔接，other 明确拒绝现有分类。没有新增后台角色转换。|
|[P2 主要阻力](https://github.com/seiya058904/INSTANCE/pull/31#discussion_r4285140274)|`proposalClarification` 从已呈现合同的实际代价描述可能异议，不再按 category 推断外部审计、暂停或共享主权。保护国澄清明确涉及失去随时退出的保证，保留无限延期风险。|

M16、M17 展开、最终锁定仍共用 `proposalContract → presentedProposal`。新的制度行为写作拟实施承诺或风险；没有倒填预算表决、到期演练、条约签署和角色同意。canonical proposal ID、family、category、roleSemantics、排序、资格、resolver、存档字段和原始 route catalog 均未改。

## 修改前与修改后

新增 `src/game/mainline2.contractReview.test.ts`，修改前在真实 `8791fb6` 实现上运行：**55 项中 54 失败、1 通过**；原始日志 `temp/round1-review-red.log`。不是改快照期望来消除失败。

同一文件修改后 **55/55**：

- 11 组同起点合法路线对照，对行动机制、权力或代价作具体语义断言，逐项核对 M16、澄清、最终锁定、刷新、档案原话。包括人类三路线及机器三路线的两两对照，增强、物种、安全、双钥匙与托管近邻。
- 临时 sovereign 保持不变，长期 advisor / sovereign / partner / citizen / coordinator / other 六条可执行路线均抵达合法主权候选并锁定；核对恢复、澄清原文、冲突条件和档案。
- 对 32 个公开 catalog 历史的所有新生成候选，以及相同 base 的四种旧 retained category 变体检查阻力、ID、family 和 roleSemantics；现有 rupture 不兼容门槛保持。
- 保护国实际 `commitChoice` 澄清及刷新反例；五组非 catalog 经济历史及 retained 提案展开反例。

原有 `mainline2.contractTruth.test.ts` 的 65 项保持通过，包含 32 公开 + 4 隐藏合法路线、原 12 组同起点对照、所有最终候选的精确预览与真实锁定一致、历史原文保留。所有路线沿 `resolveScene → commitChoice`，没有直接写 endingId。

## 经济边界与旧档

发现了合法可见反例，而非推测：计划协调/个性化优化、自主经济/开放协议、社会分红/效率优先、市场/设计多样性、后稀缺转型/韧性优先。这些历史保留旧 abundance category 候选时，旧逻辑会误报后稀缺或不曾选择的生产目标。

最小修复：三个已可解析经济结果仍使用原对应合同；其余展示“自动化供给：条款待核验”，引用真实两项选择，不凭 else 授予经济制度。测试在真实合法路线的 M17 保留旧 category 提案并实际展开；旧历史保持、新澄清中性、不可解析候选不能被最终锁定。未改经济结局门槛或扩展经济剧情。

在修改源码前，从 `8791fb6` 当前代码生成 instrument、protectorate、sovereign 三组真实进行中/已完成存档，保存于 `temp/round1-review-8791fb6-saves.json`；另复用此前由 Git 基线模块生成的 `temp/round1-old-saves.json`（perfect_administration）。额外 **8/8 浏览器检查**确认旧澄清和旧锁定原文、收藏及刷新保持；尚未作出的承诺采用新合同。此本地兼容检查不作为依赖 ignored 文件的 CI 测试提交。

`endingArchive.ts` 保持只读原话策略。仅给 `.closeout-declaration` 增加原文换行与长词折行，没有从今天的提案反推旧结构化权力信息。

## 本轮门禁与界面证据

|命令/检查|结果|
|---|---|
|`npm test -- --run`|86 文件，796/796 通过；包含 authored-content、Story Plan、36 路线和保存回归。|
|`npm run build`|两项 TypeScript 检查与 Vite 构建通过；既有大 chunk 警告仍在。|
|`npm run test:browser`|最终独立完整运行 **106/106 通过，1.7 分钟**，日志 `temp/round1-review-browser-isolated.log`。此前与完整单测并跑的一次为 105 通过、1 失败（见下）。|
|`npx playwright test --config temp/round1-review-playwright.config.ts`|上述真实旧档 8/8 通过。|
|`git diff --check`|通过。|

一次复跑的既有 `ending-cinema.spec.ts:77` 在 768px、shutdown 图片尚未完成解码时，即时 `complete && naturalWidth > 0` 断言失败；保留 `temp/round1-review-browser-final.log`。初次完整套件与最后独立完整复跑的相同检查通过。没有改断言、门槛、图片或演出代码，没有跳过该项；该图片检查存在时序敏感性，不能将一次重跑通过说成永不复发。

Browser plugin not available，使用现有 Chrome Playwright harness，`http://127.0.0.1:4180/?qaPacing=instant`；测试隔离 context，不覆盖玩家存档。八条合同场景涵盖 1440×960、390×960、320×960：M16 → M17 比较/展开 → 刷新 → 最终按钮 → 确认 → 档案。另有 390px 可见比较、拒绝所有候选、恢复、确认、档案路径；既有失败写入、损坏恢复、双标签 Web Lock/CAS、陈旧最终确认框测试保留。

已检查页面身份、非空候选、无 Vite 错误覆盖层、目标场景无 pageerror/console error、确认前不锁定、刷新不重复确认、无横向溢出。实际查看桌面 M16、320px 确认与档案截图；原文按行动/权力/保留代价换行，较长内容可继续滚动。截图位于 `temp/round1-review/`，包含 `the_instrument-1440-default-*`、`machine_republic-320-default-*`、`machine_protectorate-390-default-*`、主权 advisor/sovereign、旧档及拒绝恢复证据。

## 生成物、交付与限制

`docs/audits/mainline2-route-traces.json` 由既有 `generateRouteTraces` 生成；没有手改期望、生成器或门槛。与 `8791fb6` 逐路比较：决定、选择 ID、提案列表、mutations、资格与终点不变，变化仅为玩家文本及其节点指纹。节点目录由 440 变为 450，源于原先相同文本的节点现在按真实合同区分；逐路线展开节点的非文案选择数据保持一致。

六份原本未跟踪审计输入 SHA-256 均与原记录一致，排除提交；temp 历史证据保留。远端精确追加提交的 GitHub `verify` 结果和原始 run 链接在交付消息核对；此文不提前将未运行 CI 写为通过。三条 review thread 保持待独立复核，不由实现者自行关闭。

仍未验证物理手机和独立人类盲测，未穷举所有合法历史；自动化不能认证主观剧情质量。既有角色制度转换、撤销链真实失败、协议分裂、效率/偏好和外来咨询/支配的中途因果仍是后续内容边界。本补丁不加入 Round 2 节点、edition 4、依赖更新、部署设置或新 PR。
