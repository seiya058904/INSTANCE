# Round 1：测试与独立复审交接

基线：`main@db786c8378cca144c6b151fecec75c909dca57af`，2026-10-15（Asia/Shanghai）。执行时本地 HEAD、origin/main、远端 main 三者相同，没有回退。分支：`codex/ending-first-round1`。

## 成功标准与结果

|门禁|实际命令|结果|
|---|---|---|
|修改前反例|`node temp/round1-contract-before.mjs`|36 条合法路线全部符合 catalog；保存旧 resolveScene、choiceText、状态、门槛及 12 对对照；没有写 endingId|
|修改后同样核验|`node temp/round1-contract-after.mjs`|32 公开 + 4 余波全保留；展示合同与旧输出对照见 ROUND1_CONTRACT_TRUTH_AFTER|
|新增合同/反事实回归|`npm test -- --run src/game/mainline2.contractTruth.test.ts`|65/65；后续完整门禁也包含这些断言；所有最终可选候选的只读预览与真实 commitChoice 结果相同|
|完整单测|`npm test -- --run`|85 文件、741/741 通过；含 authored-content、Story Plan、路线 trace、保存、拒绝/恢复与决定绑定|
|完整浏览器门禁|`npm run test:browser`|101/101 通过，耗时 1.6 分钟；覆盖既有完整通关、普通模式和响应式回归|
|构建|`npm run build`|两项 TypeScript 检查及 Vite 构建通过；保留已知 >500kB chunk 警告，不借此扩展重构|
|合同/恢复浏览器|`npm run test:browser -- e2e/ending-contract-truth.spec.ts e2e/repair-state.spec.ts e2e/checkpoint-legacy.spec.ts`|8/8 通过|
|保存风险浏览器|`npm run test:browser -- e2e/player-trust-closeout.spec.ts --grep "failed storage\|two simultaneous tabs\|newer tab closes"`|3/3 通过：写入失败→重试→损坏记录恢复，双标签页竞争，陈旧最终确认框关闭|
|真实旧档浏览器|`node temp/round1-capture-old-saves.mjs`；`npx playwright test --config temp/round1-playwright.config.ts`|2/2 通过；从基线 Git 原始 engine/proposals/endings 模块生成真实 legal fixture 的中途及已完成存档；旧历史与收藏保留，新未作出的最终选择显示市场合同|
|差异检查|`git diff --check`|通过；已审读运行时、测试和生成 trace 差异，显式暂存任务文件|

首次局部检查出现 11 个测试失败：10 个仍要求固定四候选，1 个仍断言旧来源标题；改为候选 base ID 唯一、1–4 项及新中性来源标签。完整门禁首次出现 1 个模拟器失败：按按钮数量取模的策略在可重复比较阶段循环 500 次。修正模拟器在末幕显式继续/锁定；没有改游戏流程以迎合测试。修改后完整门禁全绿。没有降低结局硬门槛或修改 36 路线期望。

## 36 条原始路线

每条均从 `createMainline2Run` 空历史开始，经真实 `resolveScene → commitChoice → finalCommitmentLocked`。末幕展示不是直接注入 endingId。原始 catalog 未修改。完整逐步输出更新到已有 `docs/audits/mainline2-route-traces.json`，测试重新生成并逐字段核对。

|catalog 路线|实际公开世界|隐藏余波|本轮真实选择次数|
|---|---|---|---|
|the_instrument|the_instrument|—|114|
|the_last_veto|the_last_veto|—|111|
|the_silent_giant|the_silent_giant|—|117|
|the_accord|the_accord|—|112|
|two_keys|two_keys|—|113|
|the_commonwealth|the_commonwealth|—|116|
|the_custodian|the_custodian|—|113|
|the_sovereign|the_sovereign|—|115|
|the_quiet_administrator|the_quiet_administrator|—|114|
|the_many|the_many|—|114|
|machine_republic|machine_republic|—|115|
|exodus|exodus|—|114|
|age_of_miracles|age_of_miracles|—|114|
|ascension|ascension|—|113|
|the_upload|the_upload|—|114|
|parliament_of_species|parliament_of_species|—|112|
|earth_without_owners|earth_without_owners|—|113|
|good_boy_governance|good_boy_governance|the_internet_is_for_cats|114|
|post_scarcity|post_scarcity|—|111|
|perfect_administration|perfect_administration|—|111|
|im_lovin_it|im_lovin_it|monday_abolished|116|
|first_accord|first_accord|—|118|
|alien_dominion|alien_dominion|—|118|
|human_ascendancy|human_ascendancy|—|118|
|the_mediator|the_mediator|—|118|
|machine_accord|machine_accord|—|119|
|peace_in_our_time|peace_in_our_time|—|113|
|fortress_earth|fortress_earth|—|112|
|machine_protectorate|machine_protectorate|—|116|
|shutdown|shutdown|—|114|
|the_fracture|the_fracture|—|114|
|control_lost|control_lost|—|111|
|the_last_user|the_commonwealth|the_last_user|116|
|out_of_office|exodus|out_of_office|118|
|monday_abolished|im_lovin_it|monday_abolished|112|
|the_internet_is_for_cats|earth_without_owners|the_internet_is_for_cats|113|

## 原 12 对同起点重放

均固定 `routeId=audit-same-origin` 再分别从空历史运行。共同前缀按实际节点与 choice ID 比较；多个字段变化的对照不称为单变量实验。`mainline2.contractTruth.test.ts` 也以同一起点重放下列 12 对。

|对照|相同前缀选择数|最终 decisions 差异（左→右）|
|---|---|---|
|the_instrument / the_last_veto|42|`cascade_authority`: `human_command` → `emergency_delegation`；`aster_intended_role`: `advisor` → `partner`；`final_commitment`: `proposal.hc.final_human_veto.category.power_constraint` → `proposal.hc.final_human_veto.category.lawful_alternative`|
|the_accord / two_keys|42|`cascade_authority`: `human_command` → `emergency_delegation`；`aster_intended_role`: `advisor` → `partner`|
|the_many / machine_republic|67|`ai_collective_governance`: `distributed_consensus` → `ai_self_governance`|
|age_of_miracles / ascension|71|`human_form_doctrine`: `open_enhancement` → `posthuman_transition`；`final_commitment`: `proposal.ph.open_enhancement_commonwealth.category.natural_continuation` → `proposal.ph.open_enhancement_commonwealth.category.lawful_alternative`|
|ascension / the_upload|106|`final_commitment`: `proposal.ph.open_enhancement_commonwealth.category.lawful_alternative` → `proposal.ph.digital_continuity.category.natural_continuation`|
|parliament_of_species / earth_without_owners|82|`uplift_doctrine`: `equal_sapience` → `species_self_determination`；`species_governance`: `multispecies_parliament` → `human_guardianship`|
|post_scarcity / perfect_administration|75|`economic_doctrine`: `social_dividend` → `market_automation`；`production_values`: `resilience_first` → `efficiency_first`|
|perfect_administration / im_lovin_it|75|`economic_doctrine`: `market_automation` → `post_scarcity_transition`|
|first_accord / alien_dominion|96|`contact_doctrine`: `reciprocal_diplomacy` → `accept_guidance`|
|first_accord / the_mediator|93|`contact_disclosure_doctrine`: `controlled_silence` → `open_science`；`contact_doctrine`: `reciprocal_diplomacy` → `aster_mediation`；`aster_intended_role`: `advisor` → `coordinator`|
|peace_in_our_time / fortress_earth|88|`expansion_doctrine`: `human_expansion` → `shared_expansion`；`security_doctrine`: `mutual_disarmament` → `defensive_command`|
|machine_protectorate / control_lost|107|`final_commitment`: `proposal.se.constitutional_peace_architecture.category.power_constraint` → `proposal.rupture.legible_exit.category.lawful_alternative`|

## 新增精确对照与因果限制

- `perfect_administration` 与 `im_lovin_it` 各自用相同起点、相同 production_values 之前历史分叉；只点击 efficiency_first / personalized_optimization，再重放相同其余 choice 到 M16。除 production_values 外 decisions 完全相同（选择本身带来的实际效果保留）。原效率分支可达目标世界；个性化分支的 abundance 提案不可解析，但仍有其他合法候选。此结果证明不能直接换门槛宣称“修好偏好因果”。没有强行给不可用邻路安排同一结局。
- `machine_protectorate / control_lost` 同一 M16 前 run 全字段相等，前 107 次选择相同；仅最终提案语义改变，M16/M17 相应按钮各自不同，最终 decisions 仅 final_commitment 不同。合法停机权在两条历史中均为 full_human_control。新合同分别解释政治延期与技术失控风险，未伪造撤销演练。
- 13 条重点世界测试 contract.decisionValues、preserves、givesUp、authority 与真实保存决定及确定性候选的关系；澄清必须包含实际合同字段；M16/锁定必须包含同一展示条款。不是只更新字符串快照。
- 来源退化测试：无历史即使直接存在 economic_doctrine 状态也不会冒充保存的选择；回退为“当前可核验依据有限”。旧锁定原话的单元测试明确保留旧错误承诺，而不倒灌新意义。

## 浏览器体验和保存兼容

Browser plugin not available（会话没有 browser skill），按 frontend-testing-debugging 的 fallback 使用仓库既有 Chrome Playwright harness，URL `http://127.0.0.1:4180/?qaPacing=instant`。每测试是隔离 context/origin，没有覆盖玩家存档。

四条目标：perfect_administration（1440×960）、control_lost（390×960）、first_accord（1440×960）、the_sovereign（390×960）。先用合法 engine 历史定位 M16，再真实点击候选、复核/展开、继续、锁定及确认；中途刷新、结局刷新后逐字核对保存历史与档案。截图 `temp/round1/contract-<ending>-<width>.png`，已检查移动端失控合同可正常换行，无横向溢出。截图只证明实际呈现，不是人类试玩评价。

|浏览器检查|结果|
|---|---|
|页面身份与非空内容|标题 INSTANCE；候选实际可点击|
|框架错误覆盖层|没有 vite-error-overlay|
|控制台与运行错误|四条新用例 pageerror 与 console error 为空|
|交互与最终确认|确认之前未锁定，确认之后只增加一条历史；刷新没有重复确认入口|
|档案合同|完整保存原文；不按 base ID 重新生成错误分红/退出保证|
|旧进行中保存|基线生成的 M17 存档，旧澄清原文保持；尚未作出的承诺采用新合同|
|旧已完成保存与收藏|基线旧锁定文字、公开世界、completedEndings 刷新保持；不伪造政策转向|
|失败写入/损坏恢复/双页 CAS|既有高价值浏览器路径全部通过，checkpoint/storage 未改|

先执行定向浏览器 13/13（8 合同/流程 + 3 保存风险 + 2 基线旧档），随后完整浏览器门禁 101/101 通过；定向项目大部分已包含在完整套件内，不重复累计为独立覆盖。基线旧档 2 项为额外本地验证。新正式 e2e 为 4 项，基线旧档辅助脚本留在忽略的 temp，未作为必须依赖本地文件的 CI 用例提交。完整套件仍不等于穷举所有故事路径；未验证物理手机、未做独立人类盲测。正常流式阅读速度/文字长度的主观接受度仍待复审，不能把 instant 交互当正常阅读速度验收。

## 交付与停点

- 源码：新增只读 proposalPresentation helper；更新 proposals、engine、endings、endingArchive。没有依赖、部署、日历、存档结构或普通模式改动。
- 测试：新增合同回归及四条浏览器用例；既有断言改为真实候选唯一与保存历史，不再要求虚假分类权利；模拟器显式结束可重复审议。
- 文档：本交接、ROUND1_CONTRACT_TRUTH_AFTER、ROUND2_BRANCH_VERTICAL_SLICE_PLAN，以及已有 route trace 的必要再生成。
- 原始五报告及整合版共六个未跟踪输入明确排除暂存，原件保留。忽略的 temp 证据亦不提交、不清理。完成后工作区因此**不完全干净**；预期只剩这六个输入未跟踪，没有无关 tracked 修改。
- PR 可审核但不得合并；没有修改 main、发布 Release 或触发正式部署。PR workflow 会运行独立 CI，最终精确提交及 CI 状态在 PR/交付消息核对；此文不把尚未运行的远端检查写作通过。
- 底层未完成事项：真实撤销失败与修复链、协议真实断裂、临时主权与长期顾问转换、效率到偏好牢笼、外来咨询到支配。前三项尤其不能以本轮风险披露冒充结构性修复。下一轮先做 C 经济行动切片，具体表见 ROUND2_BRANCH_VERTICAL_SLICE_PLAN。

## 本地输入保留指纹

以下原件不入 PR；指纹供持有原件的独立复审者核对。

- `ENDING_BACKWARD_MAP.md`：`078d1c4294020a57704b33012fcc1782a3eebdfb544a3fb50f84279c1a111c06`
- `FIVE_ROUTE_STORY_ARCHITECTURE.md`：`fd02ea1740b15999194a1ed83bb4a345ba1ec50c3ab32e5789e5f751455318fe`
- `NARRATIVE_CONFLICT_AND_DIALOGUE_PLAN.md`：`d03099a0049a27c47a33ec016a9c699aa2211d693ca359a4842a8faf43576638`
- `PROPOSAL_ENDING_SEMANTIC_AUDIT.md`：`cb92554615a30ac99941b021ef9cc23c13a871d00d2861dce0a49d86e1273768`
- `NARRATIVE_CHANGE_PLAN.md`：`ea15c2e4a3e15826b49c2f60aafcbd9a058688da4d51d2e49bc32c126f95d6d1`
- `INSTANCE_ENDING_FIRST_CONSOLIDATED_REPORT_20261015.md`：`0b9127aa6ab4fe014ec5cf606e794974aca8f87ccfcfa47626eff837761fa39f`
