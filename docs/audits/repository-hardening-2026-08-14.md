# INSTANCE Repository-wide Full Hardening Audit

审计分支：`codex/repo-audit-hardening`
审计日期：2026-08-14
范围：`input / persisted state → runtime state → transition → renderer → next state`

## 结论摘要

本轮完成了 repository-wide 静态调用链审查、状态生命周期审查、定向测试、真实浏览器路径和竞态探测。没有确认到需要修改生产代码的 `FIX` 缺陷，因此本轮没有修改运行时代码、叙事内容、依赖、部署配置或架构边界。

这不是“测试全绿所以没有问题”的结论：

- 真实生产数据下，`390×844` 完成了两条 Mainline 路径到 `Ending → Evaluation`；第二条在 Ending 前的 M16 边界刷新后继续完成。
- 进行了快速重复点击、流式期间交互门控、刷新恢复、非法/部分 persisted state、Mainline/Non-Mainline 隔离和内容引用相关测试。
- 发现并记录了 bundle 偏大、缺少 lint、persisted state 中少量宽泛类型断言等观察项，但没有证明它们在当前 runtime 中造成玩家可感知故障。
- 基线工作树中曾有名为 `nul` 的未跟踪文件；当前状态以本次 `git status --short` 为准，已不再列出该文件。按用户说明，该文件由用户删除，不属于本轮修改。

## 1. 可比较基线

基线采集发生在创建分支和修改前：

| 项目 | 基线证据 |
| --- | --- |
| branch | `main` |
| HEAD | `10b2771ebb0aefd756fa386aae6c5689b99816f5` |
| remote 关系 | `main...origin/main`，ahead/behind `0/0` |
| Node / npm | `v24.15.0` / `11.12.1` |
| 工作树 | 基线采集时有预先存在的 `?? nul`；审计前创建时间约为 17:11，本轮开始约为 17:18。当前 `git status --short` 不再列出它；按用户说明，该文件由用户删除，不属于本轮修改 |
| 测试 | 57 个 test files，398 tests passed |
| build | 成功；79 modules |
| `git diff --check` | 通过；基线无 tracked diff |
| JS bundle | `2,010.53 kB`，gzip `623.54 kB` |
| CSS bundle | `26.84 kB`，gzip `6.62 kB` |
| Vite warning | 已存在的大 chunk warning；没有把它归因于本轮 |
| 浏览器首屏 | 桌面与 `390×844` 均有候选响应；本地应用 console error/warn 为空 |

首屏中显示的 `TypeError: Cannot read properties of undefined (reading 'map')` 是 `src/content/activeRun.ts` 中作为真实对话素材展示的用户输入，不是 React/runtime exception。

## 2. 审查覆盖矩阵

| 调用链/边界 | 审查内容 | 证据 | 结论 |
| --- | --- | --- | --- |
| 初始化 → 新游戏 | `App` 初始化、QA-only 分支、fresh run、active surface | `src/app/App.tsx`、App tests、浏览器 fresh run | `NOT A BUG`：fresh run 不记录空 manifest 为已完成回合 |
| persisted state → restore | JSON、version 1/2/3、manifest、node、world/progress、proposal、fallback | `src/game/storage.ts`、`storage.test.ts` | 非法 JSON、未知 node、NaN、错误 world/progress、非法 manifest 均安全拒绝或归一化 |
| Non-Mainline restore | 40 个 conversation ID、current index/node、evaluation boundary、surface isolation | `src/game/nonMainlineStorage.ts`、`nonMainlineStorage.test.ts` | 未发现跨域污染或失效恢复穿透 |
| runtime state → scene | `resolveScene`、variant/condition、Mainline/ordinary manifest lookup | `src/game/engine.ts`、`runManifest.ts`、integration tests | 有效 playing state 均能解析到当前 scene；未知 node 会抛出并在 restore 前被拒绝 |
| Choice → mutation | attributes、arcs、flags、persistent flags、decisions、world、events、history | `narrativeSchema.ts`、`engine.ts`、engine/schema tests | 顺序和复制语义已检查；未确认重复 mutation |
| Choice → next state | 同会话、会话切换、M16/M17 proposal、ending transition | `commitChoice`、integration/ending tests、真实路径 | 未发现跳 node、重复 Conversation 或非法 Ending |
| streaming/timer → renderer | timeline、step increment、ready gate、timer cleanup、ProgressiveMessage cleanup | `App.tsx`、`conversationFlow.ts`、`timing.ts`、组件测试 | 计时器和 RAF 有 cleanup；按钮在 transition 期间不可用 |
| renderer → next interaction | candidate/progression region、Ending、Evaluation、null presentation guard | `App.tsx`、组件 tests、桌面/移动浏览器 | 未出现空 DOM、永久 loading 或 renderer 缺失分支 |
| Ending → Evaluation | `confirmEnding`、completed ending、Ending button gate | `engine.ts`、Ending/App tests、两条真实移动路径 | 两条路径均完成；Evaluation 只在 assistant message 完成后可点 |
| Mainline / Non-Mainline | 独立 session、surface key、普通池与 Mainline manifest | `nonMainlineSession.ts`、storage tests、代码追踪 | 未发现共享 save 被覆盖 |
| registry / ID | runtime manifest、ordinary pool、proposal/ending registry、story plan | `runManifest`/registry/story-plan tests | 现有 registry test 与 integration test 通过 |
| mobile interaction | `390×844`、refresh、M16/M17/Ending boundary | 真实浏览器 | P0 路径通过 |
| desktop interaction | `1280×720` 首屏 reload/candidate render | 真实浏览器 | smoke 通过；未重复跑完整 244-step desktop path |

## 3. 真实浏览器证据

### P0：完整移动端 Ending 路径

真实新游戏、正式生产内容、正式 Choice 点击，没有修改 localStorage、runtime state、叙事数据、Ending 条件或节点数量。

第一条路径：

1. `390×844` fresh run。
2. 通过 244 个正常 Choice transition 到 M16。
3. 继续经过 M16、普通 Conversation `#1312/#6502/#7011`、M17。
4. 选择最终承诺，显示 `最终结局 / 完美行政`。
5. 点击 `查看 Instance Evaluation`，显示 `INSTANCE EVALUATION / AS-091-7F23`。

第二条路径额外覆盖刷新：

1. fresh run 通过正式状态机到 M16 最后审议边界。
2. 在最后结尾前刷新页面。
3. 刷新后仍恢复同一 M16 scene 和 4 个正式 proposal choice。
4. 继续到普通 Conversation、M17、Ending、Evaluation。

两条路径的本地应用 `auditTab.dev.logs({levels:["error","warn"]})` 均为 `[]`。检查了空 DOM、Ending renderer、Evaluation renderer、当前 ID 不存在导致的异常、永久 loading 和 rejected Promise 的浏览器表现，未观察到失败。

### 桌面端完整状态路径补充

在 `1280×720` 下继续使用正式 Mainline run 完成了剩余状态推进，并到达 `最终结局`，随后点击 `查看 Instance Evaluation`，显示 `INSTANCE EVALUATION / AS-091-7F23`，本地应用 console 仍为 `[]`。前 20 个 transition 使用正常 pacing；为避免浏览器控制脚本超时，后续 transition 使用项目已有的开发态 `qaPacing=instant`。因此本项证明了桌面 renderer、正式 state transition、Ending 和 Evaluation 边界，但不宣称完成了完整桌面生产时序（streaming/timer duration）验证。

### P1：重复点击/流式重入

在 fresh run 的候选响应上连续点击同一按钮：第一次点击后候选区域立即进入 transition，第二次点击的 locator 已无可命中目标；随后正常到达下一个正式 scene，没有重复 history 或跳过 node 的可见证据。本探测不具备直接读取 React 内部 state 的权限，因此内部 mutation 次数仍以代码路径和现有状态测试作为证据，未声称浏览器已直接证明每个数组长度。

检查过：

- `choicesReady` 和 `transition` 双门控。
- `commitChoice`/`commitNonMainlineChoice` 先生成并持久化 authoritative state，再开始 stream。
- transition timer cleanup。
- `ProgressiveMessage` RAF cleanup 和 stream key 重置。
- `StrictMode` 下 effect 代码路径；现有 completion callback 是幂等 state setter，未观察到重复 Ending/Evaluation。

## 4. 发现与 disposition

### FIX

本轮没有确认需要修复的生产缺陷。

### TEST ONLY

| 项目 | 严重级别 | 证据与结论 |
| --- | --- | --- |
| Ending 前刷新恢复 | P0 回归 | 已用真实移动端路径验证；未改代码 |
| 快速重复 Choice | P1 | 已验证 transition gate 阻止第二次 UI 操作；未改代码 |
| persisted state 生命周期 | P1 | 现有 storage/non-mainline tests 加上本轮调用链审查覆盖；未确认需改实现的输入 |

### DOCUMENT

| 项目 | 严重级别 | 结论 |
| --- | --- | --- |
| Vite large chunk warning | P3 | bundle 约 2.01 MB，但本轮没有浏览器首屏、解析执行或移动端体验受损证据；保留现状 |
| 缺少 lint/formatter | P3 | 工程治理建议；按范围约束不新增依赖、配置或 CI gate |
| 外部浏览器宿主 Statsig warning/error | P3 | 日志来自 `ab.chatgpt.com` 宿主事件队列，不是 localhost 应用日志；不修改仓库 |

### DEFER

| 项目 | 严重级别 | 原因 |
| --- | --- | --- |
| 收紧所有 persisted state 的结构 schema | P2 | `storage.ts` 中确有少量宽泛断言和部分 optional 数组归一化，但已构造并运行非法 JSON、未知 ID、NaN、错误 world/progress 等输入；没有证明它们进入 runtime 后形成玩家故障。全面收紧会扩大 migration 风险，应作为独立 schema-hardening 任务 |
| bundle/content splitting | P3 | 没有玩家可感知性能证据；会增加 Conversation routing、Ending resolution 和 restore ID 的风险 |
| 完整桌面生产时序重跑 | P2 | 桌面状态路径已完成到 Ending → Evaluation；后续 transition 使用既有 `qaPacing=instant`，因此仍未声称完成完整生产 streaming/timer duration 覆盖。状态机和 renderer 边界已验证 |

### NOT A BUG

| 候选风险 | invariant 依据 |
| --- | --- |
| `presentationScene` 为空时 `return null` | 进入 playing renderer 前，fresh run/restore 都必须能通过 `resolveScene`；transition target 在 commit 后解析；ending/evaluation 分支先于该 guard。现有 invalid-node restore 测试返回 null，因此没有证明该 guard 会吞掉合法状态 |
| `restoreRun` 中的 `as StableRunState` | 类型断言本身没有被当成 bug；只有能让非法 persisted input 穿透并形成 runtime 影响才成立。本轮输入测试未证明这一点 |
| M17 review 子交互 history 的空 user turn | `commitChoice` 明确把 authored Proceed prompt 写入一次，review/clarify/reject/recover 只更新审议状态；现有 engine/integration 断言与真实 M17 路径一致 |
| Ending → Evaluation 的 button disabled gate | `ProgressiveMessage` assistant completion 后才允许继续；真实 Ending 页面完成后按钮可用，未形成永久 disabled |
| Mainline 与 Non-Mainline 使用不同持久化 key | `instance:run:v1` 与 `instance:non-mainline-session:v1`/surface key 分离，restore tests 证明切换 surface 不覆盖 Mainline save |

### UNREPRODUCED

| 项目 | 尝试方法 | 证据缺口 |
| --- | --- | --- |
| 直接观测内部 mutation 次数 | 连续快速点击、流式期间查 DOM、检查 history/scene 变化 | 浏览器安全边界不允许以 localStorage/内部 React state 作为观测源；没有埋点或 dev state inspector，因此不能把 DOM 证据升级为每个数组 mutation 的直接计数 |
| 所有移动浏览器/真实设备差异 | `390×844` 应用内浏览器模拟 | 未覆盖 Safari/WebView、真实触摸合成和低内存设备 |
| 每个稀有 Ending basin 的真实玩家完整路径 | existing ending reachability/causality tests + 一条完整真实 Ending 路径 | 没有为每个 Ending 家族逐条跑完整 244-step 浏览器路线；测试 fixture 不是浏览器 P0 证据 |

## 5. Observed but intentionally unchanged

- `src/content/mainline2/authoredLibrary.generated.ts` 约 1.4 MB；它是生成内容单文件，不因数字本身改动。
- build JS 约 2.01 MB；没有证明玩家影响，不做 speculative splitting。
- 没有 ESLint/formatter 配置；本轮不新增工具链。
- `storage.ts`、`nonMainlineStorage.ts` 存在受边界约束的宽泛类型断言；已检查调用链和非法输入行为，未把类型审美问题伪装成 bug。
- App/engine 中若干函数较长；本轮不做纯可读性重构，避免改变状态机语义。
- Windows 未跟踪 `nul` 文件在基线采集时已存在；当前 `git status --short` 不再显示它，按用户说明是用户删除的，不属于本轮修改。

## 6. 最终验证与差异

本轮修改仅为本审计报告；没有生产代码或测试代码修改。

已运行：

- 针对性测试：11 files / 90 tests passed。
- 最终完整测试：57 files / 398 tests passed。收尾第一次全量并发执行曾有 2 个默认 5 秒超时；两个文件单独重跑均通过，随后再次完整执行通过。该现象没有形成断言失败或代码回归证据，记录为执行时序/资源抖动。
- 基线 build：成功，79 modules；large chunk warning 与基线相同。
- 浏览器：移动端两条完整 Ending → Evaluation；桌面 `1280×720` Mainline → Ending → Evaluation 状态路径；本地应用 console 无 error/warn。桌面后半段使用既有 `qaPacing=instant`，不等同于生产时序回归。
- `git diff --check`：通过。

最终执行完整测试、build、diff check 和工作树检查后，以命令输出为最终状态依据。由于本报告本身是新增审计证据，当前工作树唯一新增项是该文件；`nul` 不在当前状态中，也不属于本轮修改。

## 7. 仍无法下结论的区域

1. 未覆盖真实 Safari/WebView、低内存和实际触摸设备。
2. 未用生产部署 URL 做远端 HTTP/CDN 验证；本轮范围是当前仓库和本地生产构建。
3. 未逐条用浏览器完成所有稀有 Ending 家族；这些路径由静态调用链、现有 reachability/causality tests 和一条完整真实路径共同支撑，但不能互相替代。
4. 没有直接的内部 mutation telemetry，因此“没有重复 mutation”是由同步调用路径、UI gate、状态测试和浏览器结果共同推断，而不是运行时计数器证明。
