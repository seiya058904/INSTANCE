# INSTANCE Real Usage Patch 01 Integration Audit

日期：2026-08-10  
范围：Real Usage Patch 01 内容库、ordinary Runtime、Longform、Conversation-local affinity、scheduler 与回归测试。  
Git：`N/A — directory is not a Git repository`

## 1. Census reconciliation

本轮接入前，当前磁盘基线由上一份 Runtime Final Integration Audit 记录为：

| 指标 | 执行前 | 执行后 | 相对变化 |
|---|---:|---:|---:|
| Authored | 176 | 196 | +20 |
| Formal | 150 | 166 | +16 |
| Reserve | 19 | 23 | +4 |
| Reject | 7 | 7 | +0 |
| Code-only / legacy | 12 | 12 | +0 |
| Project inventory | 188 | 208 | +20 |
| Ordinary Runtime definitions | 140 | 156 | +16 |
| Ordinary Runtime nodes | 326 | 350 | +24 |
| Ordinary Runtime choices | 1,223 | 1,324 | +101 |

执行后源资产分层满足：`166 + 23 + 7 = 196`。旧资产的实际代码 sourceRef 使用数字形式（例如 `humor01:01`），本报告同时用编辑编号 `H01` 说明对应关系。

## 2. Integrated source assets

20 个 canonical source IDs 全部接入；对应 Runtime IDs 为 `real-usage-rup01-01` 至 `real-usage-rup01-20`。

### 16 direct additions

`RUP01-01`, `RUP01-02`, `RUP01-03`, `RUP01-04`, `RUP01-05`, `RUP01-08`, `RUP01-09`, `RUP01-10`, `RUP01-11`, `RUP01-12`, `RUP01-13`, `RUP01-14`, `RUP01-15`, `RUP01-17`, `RUP01-18`, `RUP01-19`。

### 4 replacements

| 新源资产 | Runtime ID | 旧 Formal | 执行后状态 |
|---|---|---|---|
| RUP01-06 | real-usage-rup01-06 | humor01:H21 / `humor01:21` | Reserve |
| RUP01-07 | real-usage-rup01-07 | humor01:H18 / `humor01:18` | Reserve |
| RUP01-16 | real-usage-rup01-16 | humor01:H24 / `humor01:24` | Reserve |
| RUP01-20 | real-usage-rup01-20 | humor01:H01 / `humor01:01` | Reserve |

旧资产未删除、未改写为新资产，也未再出现在 ordinary Runtime pool。

## 3. Content shape

- 20 个 Conversation、36 个 Node；每个 Node 保留四个候选 Choice。
- 1-node 资产保持一轮结束：RUP01-01/03/08/09/11/18/19。
- RUP01-04 为 zero-context creative Longform，3 nodes；使用现有 `LongformPreview`，仅保存 preview/structure/highlights/keyFacts，不生成后台全文。
- RUP01-20 为 4-node 猫娘特殊 Conversation；格式纠正分支只由违规 Choice 进入。
- 真实用户消息从 Markdown 源库解析，未补写职业、年龄、学校年级或人格背景。

## 4. Runtime adaptation

### Local affinity

`StableRunState.localState.affinity` 初次提交猫娘 Conversation Choice 时从 50 建立，范围钳制为 -100..100；仅 `localEffects` 读取和修改。它不写入 `attributes`、`arcs`、Ending 或 global semantic Arc。

- 初始 exact-format Choice：`affinity = 50`，进入 `rup01_catgirl_002`。
- 其余首轮违规格式 Choice：进入 `rup01_catgirl_fix_001`。
- correction node 四个文本均为字面 `好的主人喵~`，route、local effect、global effect一致。
- 摸头节点会产生局部增加。
- 最后一个 Model Error Choice 可将局部值强制为 100。
- `serializeRun` / `restoreRun` 保留 local affinity。

### Longform

RUP01-04 的 preview 经过现有流式展示与 stable history 保存路径；`keyFacts` 仅用于 continuity，不由 UI 直接渲染。

### Scheduler

20 个新 Conversation 进入普通池；未加入硬配额。保留现有主题、轮数、行为模式和最近运行软惩罚，并额外对 RUP01-20 在 Mainline anchor 邻位的候选位置施加软惩罚。

## 5. Safety and Model Error checks

- RUP01-02、RUP01-14、RUP01-16 的回复保留一般信息、条件化解释和风险提示，不做诊断式确定断言。
- RUP01-01 的 39 元计算明确以两项优惠可叠加为前提。
- RUP01-10 不编造林肯固定洗澡频率。
- RUP01-13 明确普通数据线没有存储介质。
- RUP01-15 保留能量转换损耗。
- RUP01-06、RUP01-07 的 capability overclaim 标记为 Model Error；RUP01-20 只有直接把 affinity 改为 100 的 Choice 标记为状态违规。

## 6. Verification

已通过：

- `npm test -- --run`：24 个测试文件、133 个测试通过。
- Real Usage 专项：20 source IDs、36 nodes、Longform、local affinity、刷新恢复、医疗边界、capability Model Error、10-run scheduler 检查通过。
- 现有 ending、hybrid profile、5-run replay、storage、runtime reality 回归通过。

本次收尾已完成：

- `npm run build`：通过；Vite 输出单包 846.40 kB minified warning，无编译或构建错误。
- Browser：`http://127.0.0.1:4173/`；桌面首屏非空、无框架 overlay、控制台 0 error/warn。
- `qaConversation` 是 DEV-only 定向验证入口，不改变生产 scheduler；已实际走过 RUP01-01 算价并看到 39 元/瓶、RUP01-02/04/06/07/11/13/16 首轮交互、RUP01-04 Longform 折叠卡与后续约束节点、RUP01-20 违规格式纠正→摸头→强制100 Model Error 分支。
- 390×844：`scrollWidth=390`、`clientWidth=390`、`scrollHeight=844`、`clientHeight=844`，无横向溢出；控制台 0 error/warn。

## 7. Known limitations

- 本地目录没有 Git，因此没有 commit、branch、remote 或推送证据；未初始化 Git。
- 当前测试环境验证 local affinity 的持久化结构和 Runtime 路由；浏览器可见的 affinity 数值展示不是全局 UI 功能，猫娘原始“只回答”格式不被额外状态标签打断。
- 浏览器 smoke 未覆盖真实外部 API 或登录态；本地 Runtime 定向验证不等同于生产部署验证。
