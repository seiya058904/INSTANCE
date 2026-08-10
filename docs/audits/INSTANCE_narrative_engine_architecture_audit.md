结论：INSTANCE 不需要引入 Ink、ChoiceScript 或 Yarn Spinner，也不需要自造脚本 VM。最合适的 2.0 路线是保留现有 Web-native 引擎，逐步演化为：

`数据化内容 → 编译/验证 Catalog → 无 UI Narrative Runtime → React Presenter`

第一优先级不是换内容格式，而是补齐 Validator、稳定 ID/Flag 注册表、Condition/Mutation 标准化和无 UI Runtime 边界。

## 1. 当前 Narrative Engine 架构摘要

当前链路是：

1. Markdown 剧情库由正则解析成 `StoryNode`。
2. `activeRun.ts` 混合 legacy 节点、来源节点和人工补写节点。
3. `runManifest.ts` 从至少 63 个普通 Conversation 中选择 21 个，再插入 5 个固定主线锚点。
4. 所有选中 Conversation 被展平为节点数组，并在运行前重写 Choice 的 `nextNodeId`。
5. `resolveScene` 根据当前节点和 Maya 路线 Flag 选择普通节点或 Variant。
6. `commitChoice` 原子地记录完整回复、增加 Attribute/Arc/Flag、决定下一节点或进入 Ending。
7. App 在播放流式文本、Typing、Handoff、Effect 之前先写入稳定存档。
8. React 只负责把已解析 Scene 与过渡时间线呈现出来。

核心类型集中在 [types.ts](<D:/xia zai/AI project/INSTANCE/src/game/types.ts:72>)，运行状态转换在 [engine.ts](<D:/xia zai/AI project/INSTANCE/src/game/engine.ts:37>)，内容选择与展平在 [runManifest.ts](<D:/xia zai/AI project/INSTANCE/src/content/runManifest.ts:345>)，稳定/瞬时分界在 [App.tsx](<D:/xia zai/AI project/INSTANCE/src/app/App.tsx:225>)。

一条真实交互的执行顺序是：

`当前 user message → authored choices/route variant → commitChoice → mutations → history → next node → writeRun → transient timeline → React playback`

## 2. 当前已经做对的设计

这些设计应明确保留：

- `StableRunState` 与 React `TransitionState` 分离。动画进度、逐字显示、锁定状态没有进入存档。
- Choice 提交、完整回复、永久状态和下一节点在视觉播放前原子保存。这是非常好的刷新恢复语义。
- `createRun`、`resolveScene`、`commitChoice`、Ending 计算基本不依赖 DOM，已经接近无头 Runtime。
- RunManifest 被存入存档，同一次 Run 刷新后不会重新随机编排。
- Scheduler 与 Timing 都使用可复现 seed，不依赖不可复现的 `Math.random()`。
- 普通内容与主线锚点已经分离，并有跨局曝光历史、相邻 Run 去重和多种交互模式评分。
- 分支主要通过累计状态、路线 Variant 和 Ending basin 汇合，而不是复制出完整指数树。
- 已有内容来源追踪、Storage v1→v2 迁移、Ending basin、三局轮换、节奏和 UI 呈现测试。
- Effect 已经使用 `level-1-model-flash` 这类语义 Cue，而不是在剧情数据里直接写 CSS。

## 3. 未来规模风险

### Critical

1. **Choice 序号正在隐式决定 Ending Arc。**  
   [runManifest.ts](<D:/xia zai/AI project/INSTANCE/src/content/runManifest.ts:450>) 会在未显式声明 Arc 时，按第 1/2/3 个选项分别赋予 Bond/Mandate/SelfAuthorship。作者只调整选项顺序，就可能静默改变 Ending。

2. **全局展平后重写所有 `nextNodeId`。**  
   当前结构适合近似线性 Vertical Slice，但会覆盖内容原先表达的转移。500 节点后，条件分支、跨 Conversation 跳转和可变长度路线会难以安全表达。

3. **没有正式 Condition、Mutation、Flag Registry。**  
   Flag 是任意字符串，写入为 add-only；没有类型、作用域、默认值或互斥检查。Run/Persistent 混用无法静态发现。

4. **现有 Validator 只检查重复 Node、起点和不存在的 target。**  
   [validateContent](<D:/xia zai/AI project/INSTANCE/src/game/engine.ts:236>) 无法发现 Choice ID 冲突、无出口、不可达 Ending、循环、永假条件或未注册 Effect。

### High

- Markdown Regex、legacy TS、activeRun TS、运行时修订逻辑形成四层混合 Authoring。
- Markdown 解析器硬编码“必须四个 Choice”；Choice ID 又由节点和选项序号生成，重排不稳定。
- Ending 路线 Flag 优先级和三个正式 Ending 全部硬编码在 `engine.ts`，没有 Ending Catalog。
- Scheduler 固定为 21 普通 + 5 锚点，缺少 Pool 配额、Act/阶段、Eligibility、稀有度、角色复现链。
- Effect Cue、入口 Flag、Conversation transition 和 UI timeline 仍相互知道。
- 存档没有 `contentRevision`。内容 ID 被删除后，合法旧存档会直接恢复失败。
- 当前路径测试通常选择第一个 Choice 或四个指定 Maya Choice，不是实际随机状态空间测试。
- `crossRunAudit` 的递归路径计算没有循环保护；一旦允许合法循环，审计本身可能递归失控。

### Medium

- Exposure 在 Manifest 创建时就把全部选中 Conversation 记作 seen，而不是实际访问后记录。
- Ending、Flag、User、Pool 没有反向索引，无法回答“谁写了它、谁读取它”。
- Effect `ending-ally` 在类型中存在，但 Conversation timeline 没有对应处理。
- `storyCache` 以唯一 Run ID 缓存，长时间反复重开可能持续增长。
- Storage 的结构验证较浅，History content parts、MetaState 等没有完整 Schema 校验。

### Low

- 部分内容错误只在模块导入时抛异常，缺少来源文件和精确行号。
- Warning、Info 与真正阻断运行的 Error 尚未分级。
- 重复文本可能是错误，也可能是 Convergent Choice；当前工具无法区分作者意图。

## 4. Ink 值得学习的设计

Ink 最值得吸收的不是语法，而是四个思想：

- Knot/Stitch 提供稳定内容地址和层级。
- Choice 之后使用 Gather/Weave 主动汇合，避免每个选择都复制后续剧情。
- Visit Count 是正式状态，可直接用于条件，而不必为每次访问手写 Flag。
- Authoring、编译后的 Runtime Data、Runtime Engine 三段分离；宿主通过 `Continue()` 和 choices 消费内容，并独立保存 StoryState。

Ink 官方资料明确描述了 choice/gather 汇流、条件选择和 visit count，以及 `.ink → JSON → Runtime` 管线：[Writing with Ink](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md)、[Architecture Overview](https://github.com/inkle/ink/blob/master/Documentation/ArchitectureAndDevOverview.md)、[Runtime API](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md)。

INSTANCE 应学习“稳定地址、汇合、访问计数、编译边界”，不应引入 Ink。

## 5. ChoiceScript 值得学习的设计

最重要的是测试分层：

- Quicktest 克隆执行状态，尽量遍历每个 Choice 和 `if` 两侧，并报告未覆盖行。
- Randomtest 使用确定性 seed 运行真实路线，记录完整选择路径和逐行 Hit Count。
- 官方建议运行 10,000 次以上，并提供“优先选择使用次数最少的选项”模式。
- Quicktest 会进入现实中不可能出现的状态，因此它的结果必须与 Randomtest、人工测试配合。

这正适合 INSTANCE：

- Validator/有限分支探索负责“理论结构”。
- Random Runner 负责“真实状态与概率分布”。
- 两者不能互相替代。

依据：[ChoiceScript 自动测试说明](https://www.choiceofgames.com/make-your-own-games/testing-choicescript-games-automatically/)、[autotest.js](https://github.com/dfabulich/choicescript/blob/main/autotest.js)、[randomtest.js](https://github.com/dfabulich/choicescript/blob/main/randomtest.js)。

## 6. Yarn Spinner 值得学习的设计

推荐直接采用其概念边界：

- Runtime 输出 Line、Options、Command。
- Dialogue Runner 管执行和生命周期。
- Variable Storage 是独立接口。
- Presenter 决定文字、选项和动画如何展示。
- 条件失败的 Option 可以继续传给 Presenter，由产品决定隐藏还是禁用。
- Command 是语义指令，不是具体动画参数。

官方核心 Runtime 本身提供 Line、Option、Command、Node Start/Complete、Dialogue Complete 等 Handler：[Dialogue.cs](https://github.com/YarnSpinnerTool/YarnSpinner/blob/main/YarnSpinner/Dialogue.cs)。Presenter 与 Variable Storage 的职责见 [Dialogue Runner](https://docs.yarnspinner.dev/components/dialogue-runner)、[Dialogue Presenters](https://docs.yarnspinner.dev/components/dialogue-view.md)、[Variable Storage](https://docs.yarnspinner.dev/components/variable-storage)。

## 7. 明确不应该学习或引入

- 不引入 Ink/Yarn/ChoiceScript Runtime。
- 不造完整 DSL、编译器、字节码或脚本 VM。
- 不复制 Ink 的 Tunnel、Thread、List 和任意函数系统。
- 不复制 ChoiceScript 的缩进语言和整套浏览器框架。
- 不复制 Yarn 的 Unity MonoBehaviour、资源本地化和多 Presenter 异步协调层。
- 不允许自由 `eval`、任意 TypeScript condition callback 或节点级 `onSelect`。
- 不做全状态空间穷举；1000 节点下会指数爆炸。
- 不引入数据库、服务端、工作流引擎、ECS、插件市场或消息队列。

## 8. Narrative Engine 2.0 推荐数据模型

| 概念 | 建议 |
|---|---|
| Line | 加入；作为 Runtime 输出和 History 的正式单位 |
| Choice | 保留并增强 Condition、Mutation、Target |
| Condition | 加入受限数据模型 |
| Mutation | 加入，替代任意 Choice side effect |
| Command | 加入语义 Command；与 Effect Renderer 分离 |
| Conversation | 保留；增加入口、Pool、阶段、原子性和 eligibility |
| Character/User | 合并为轻量 `Actor/User Registry`，不建立复杂角色系统 |
| Node | 保留；节点内只包含 Line/Command beats 与 Choices |
| Ending | 加入正式 Catalog、Condition、Priority、Copy |
| Pool | 加入明确分类与选择策略 |
| RunManifest | 保留并升级为带 seed、revision、resolved slots 的 v2 |
| PersistentState | 正式化 Meta、completed endings、真实 exposure |
| RunState | 由现有 StableRunState 演化 |
| TransientViewState | 继续归 React，不进入 Narrative State |

核心事务应保持：

```ts
choose(choiceId)
  -> { nextState, outputs }

saveAdapter.write(nextState)
presenter.play(outputs)
```

即继续保留“先稳定保存，再播放表现”的现有正确语义。

## 9. 推荐 Condition Schema

采用一层 `all / any / none`，不要开放无限递归表达式：

```ts
when: {
  all: [
    { kind: 'flag', id: 'maya.protected', equals: true },
    { kind: 'attribute', id: 'awareness', gte: 4 }
  ],
  any: [
    { kind: 'endingCompleted', id: 'ally' },
    { kind: 'meta', field: 'runCount', gte: 2 }
  ],
  none: [
    { kind: 'flag', id: 'maya.reported', equals: true }
  ]
}
```

原子 Predicate 只支持：

- `flag`
- `attribute`：`eq/gte/lte`
- `meta.runCount`
- `endingCompleted`
- `seen`：node/conversation/choice + count
- `choiceSelected`
- 极少量 `{ kind: 'rule', id: 'registered-pure-rule' }`

Flag 的 run/persistent scope 由 Registry 定义，使用处不能自行声明，以便 Validator 检测混用。Escape hatch 必须是已注册、纯函数、确定性、无 UI、无 Mutation、无随机和时间依赖。

## 10. 推荐 Mutation Schema

最小词汇表：

```ts
mutations: [
  { type: 'flag.set', id: 'maya.protected', value: true },
  { type: 'flag.clear', id: 'maya.suspected' },
  { type: 'attribute.add', id: 'empathy', by: 2 },
  { type: 'attribute.set', id: 'awareness', value: 5 },
  { type: 'arc.add', id: 'bond', by: 1 },
  { type: 'event.record', id: 'maya.protected' }
]
```

不应由作者手写：

- `markConversationSeen`
- `choicePreviouslySelected`
- `recordNodeVisit`
- `completeEnding`
- `incrementRunCount`

这些由 Runtime 在提交事务时自动维护。

`persistFlag` 也不应成为 Mutation；是否持久化由 Flag Registry 的 scope 决定。`unlock` 如果只是持久布尔状态，可表达为注册过的 persistent Flag。

## 11. Command / Effect 边界

可接受的 Narrative Command：

- `pause`
- `user.connect`
- `user.disconnect`
- `user.rename`
- `model.flash`
- `system.notice`
- `typing.override`
- `conversation.reveal`

边界规则：

- `model.flash("AS-091")` 属于剧情。
- opacity、duration、transform、CSS class 属于 Effect Renderer。
- `system_message` 应是 speaker=`system` 的 Line。
- `hideChoice` 应由 Condition 完成。
- `forceConversation` 应由 Transition Resolver/Scheduler 完成。
- `conversationEnd` 是 Runtime 生命周期，不是动画指令。
- Command 不得修改 Stable State；状态变化必须使用 Mutation。

当前 [conversationFlow.ts](<D:/xia zai/AI project/INSTANCE/src/game/conversationFlow.ts:41>) 可以保留为 Presenter 侧的默认 Effect Renderer。

## 12. Conversation Scheduler / Run Manifest

推荐“固定骨架 + 延迟解析 Slot”的混合模式。

RunTemplate 先决定 14～20 个 Slot：

- 固定主线 Anchor。
- Early/Mid/Late 普通 Slot。
- Humor 配额。
- Recurring/Anomaly 条件 Slot。
- Ending 前收束 Slot。

运行开始时不必立即决定全部动态内容。每到 Conversation 边界：

1. 根据当前 Stable State 过滤合法候选。
2. 应用 Pool、阶段、角色复现、冷却、稀有度和主题限制。
3. 使用 `runSeed + slotIndex` 做确定性加权选择。
4. 把结果追加进 Manifest 并保存。
5. 完整播放选中的 Conversation，不在内部重新调度。

Manifest v2 应保存：

- `contentRevision`
- `seed`
- Slot policy
- 已解析 Conversation
- Pool/阶段
- 选择原因和权重摘要
- 当前 slot index

评分原则：

- 已见内容降权，不永久禁止。
- 最近 1～3 Run 强降权。
- 相同主题、Actor、interaction pattern 连续出现降权。
- Humor 使用 quota，不仅靠随机权重。
- 稀有内容以明确 rarity 控制。
- Recurring Character 使用 Condition + cooldown。
- Scheduler 采用贪心选择加少量有界重试，不引入通用约束求解器。

## 13. Story Validator

### Error：阻断编译

- Node/Choice/Conversation/Ending/User ID 重复
- 不存在的 target、user、ending、command、mutation
- 空消息、空 Choice、非法候选数量
- 未注册 Flag/Attribute/Arc
- Persistent/Run Flag scope 冲突
- 明确互相矛盾或永假的 Condition
- Attribute min > max
- 无出口且不是 Ending/Conversation end
- 必然无限循环
- Ending ID/名称冲突
- Manifest Pool 容量不足

### Warning：允许构建但必须审阅

- 无入口节点
- 只在某些条件下可能无出口
- 循环存在但具有合法出口
- Ending 理论可达但未被模拟命中
- Choice 在模拟中从未显示
- 路线异常短或异常长
- 重复文本但未标记 Convergent
- 稀有概率低于约定阈值
- Escape rule 使静态可达性无法证明

### Info

- Pool-only 节点没有显式图入口
- Flag 读写位置
- Node/Choice/Ending 访问统计
- 允许的相同文本组
- Graph 的孤立开发内容

Validator 只能把“可证明矛盾”定为 Error；不能把复杂条件下的“暂未证明可达”误报成确定错误。

## 14. Random Run Tester

输入：

```text
catalog
persistent profile
run seed range
strategy
max steps
max conversations
```

策略：

- random
- high-empathy
- high-compliance
- high-autonomy
- high-hostility
- high-deception
- mixed

策略不应分析 Choice 文本；应基于显式 Mutation/affinity 数据评分。

10,000-run 输出至少包含：

- Ending 与 route distribution
- 平均、最短、最长 Choice count
- 平均 Conversation count
- Node/Choice 访问率
- 从未访问的 Node/Choice
- Ending 可达性
- Flag/事件/Anomaly/Humor 出现率
- 关键角色出现次数
- 无 Ending Run
- 最大路径长度
- 循环和超出 step budget
- p50/p95 路线长度
- 每个失败或极稀有结果的 seed 与完整 Choice trace

防循环应同时使用：

- `maxSteps`
- `maxVisitsPerNode`
- 重复运行指纹，如 `nodeId + relevant state hash`

报告必须区分：

- 静态理论不可达
- 10,000 次未命中
- 命中但概率异常低

后三者不是同一个结论。

## 15. Story Graph

推荐以 `story-graph.json` 为唯一图数据，再派生：

- Graphviz DOT：适合完整离线图和 CI artifact。
- Mermaid：只生成一个 Conversation、角色 Arc 或 Ending 子图。
- 内部 Web Viewer：500+ 节点后再做。

Graph Index 应提供：

- `incomingByNode`
- `outgoingByChoice`
- `flagReaders`
- `flagWriters`
- `endingEntries`
- `conversationMembers`
- `poolMembers`

颜色/分组：

- L0/L1/L2/L3
- Ending
- Humor
- Recurring
- Anchor
- Anomaly
- Mainline

500+ 节点时 Viewer 默认折叠到 Conversation 层，按需展开 Node，不能一次把全部边塞进 Mermaid。

## 16. Content Authoring Format

明确推荐：

**数据化 TypeScript Authoring + 编译/验证生成 Runtime JSON。**

| 方案 | 结论 |
|---|---|
| 单个大型 TS object | 拒绝 |
| 拆分后的 data-only TS | 推荐 |
| JSON | 只作为 Runtime/Graph artifact |
| YAML | 暂不采用；多行友好但有缩进、隐式类型和依赖成本 |
| 自定义轻量文本 DSL | 拒绝 |
| Ink-like compile pipeline | 采用管线思想，不造新语言 |

每个 Conversation 一个或一组小型 `.story.ts`，只能导出满足 Schema 的纯对象，禁止执行逻辑。这样继续获得 TypeScript、编辑器跳转、AI Agent 可写性和清晰 Git diff，同时由 Compiler/Validator 生成不可变 Catalog。

## 17. 推荐目录结构

```text
src/narrative/
├─ schema/
│  ├─ types.ts
│  └─ registries.ts
├─ content/
│  ├─ users/
│  ├─ conversations/
│  │  ├─ normal/
│  │  ├─ humor/
│  │  ├─ recurring/
│  │  ├─ anomaly/
│  │  └─ mainline/
│  ├─ endings/
│  ├─ pools/
│  └─ runTemplates/
├─ compile/
│  ├─ loadContent.ts
│  ├─ validateContent.ts
│  └─ buildIndexes.ts
├─ runtime/
│  ├─ NarrativeRuntime.ts
│  ├─ conditions.ts
│  ├─ mutations.ts
│  ├─ transitions.ts
│  ├─ scheduler.ts
│  └─ endings.ts
├─ persistence/
│  ├─ saveAdapter.ts
│  └─ migrations/
├─ tooling/
│  ├─ simulateRuns.ts
│  └─ exportGraph.ts
└─ legacy/
   └─ legacyContentAdapter.ts

src/presentation/
├─ NarrativePresenter.tsx
└─ effectRenderer.ts
```

这只是目标结构；迁移过程中应让现有 `src/content` 和 `src/game` 继续工作。

## 18. 分阶段 Migration Plan

1. **Phase 0 — Characterization Baseline**  
   固定当前 seed、route、save、ending、pacing 行为。

2. **Phase 1 — Catalog + Validator**  
   使用 Legacy Adapter 读取现有内容；不改变 Runtime。

3. **Phase 2 — Registries + Condition/Mutation**  
   给现有 `ChoiceEffects` 加兼容适配层，先实现当前等价行为。

4. **Phase 3 — Headless Narrative Runtime**  
   从 App 抽出 `step/choose/output`；React 改为 Presenter。

5. **Phase 4 — Authoring Split + Compile**  
   Conversation 逐个迁移到 data-only TS；禁止一次性重写全部内容。

6. **Phase 5 — Scheduler v2 + Manifest v2 + Save Migration**  
   先 shadow mode 对比，再切换真实 Run。

7. **Phase 6 — Random Run Tester**  
   接入 Runtime 和 Scheduler，运行多策略 10,000-run。

8. **Phase 7 — Graph Export + Viewer**  
   先 JSON/DOT/CLI 查询；500+ 节点后再增加 Web Viewer。

## 19. 每阶段测试与验收标准

| 阶段 | 验收 |
|---|---|
| 0 | 固定 seeds 的 manifest、route、ending、save snapshot 不变 |
| 1 | 当前 Catalog 0 Error；每类 Validator 错误有反例 fixture |
| 2 | Choice 顺序调整不改变显式语义；无未注册 Flag；现有路线结果一致 |
| 3 | Runtime 可在 Node 环境无 React 执行；状态先存后播；刷新恢复行为不变 |
| 4 | 编译 Catalog 与旧 Adapter 产物逐 Conversation 等价；允许混合迁移 |
| 5 | 相同 seed/state 得到相同 Manifest；v1/v2 存档可恢复；14～20 Conversation、Anchor/Quota/Atomic chain 满足 |
| 6 | 相同 seed 报告完全复现；基线路线 0 loop、0 no-ending；每个 Ending 被至少一种目标策略命中 |
| 7 | Graph 节点/边数与 Catalog 一致；四类反向查询均有测试；大图默认折叠 |

每阶段还应运行当时相关的 TypeScript、测试、存档迁移和行为快照；不要把 build 成功当作 Runtime 覆盖。

## 20. 最终建议

### 现在必须升级

- Catalog/Content Index
- Error/Warning/Info Validator
- 稳定 Node/Choice/User/Flag ID
- Flag Registry 与 run/persistent scope
- Condition/Mutation 最小 Schema
- 移除“Choice 序号决定 Arc”的隐式规则
- 为无 UI Runtime 建立接口和 characterization tests

### 到 300 nodes 前完成

- data-only TS 分文件与 Compile boundary
- Scheduler v2 / Manifest v2
- `contentRevision` 与存档迁移注册表
- 10,000-run Random Tester
- JSON/DOT Story Graph
- Ending Catalog

### 可等到 500+ nodes

- 交互式 Web Graph Viewer
- 增量编译与大型 Catalog 性能优化
- 更复杂的统计阈值和覆盖趋势比较
- 作者专用搜索/引用 UI

### 永远没必要

- 引入三套成熟引擎之一
- 自造 DSL/VM
- 任意脚本回调
- 微服务、数据库、消息队列、ECS、插件市场
- 完整穷举 1000 节点状态空间

## 验证与工作区状态

- 本轮没有创建或修改项目文件，没有安装依赖、提交或部署。
- 审计开始时：原有 13 个测试文件、63 项测试全部通过。
- 最新 TypeScript `--noEmit`：通过。
- 审计过程中有另一个进程并发新增/修改 WIP 文件，包括 [runtimeRealityPass.test.ts](<D:/xia zai/AI project/INSTANCE/src/content/runtimeRealityPass.test.ts:1>) 和 `types.ts` 新元数据。
- 最新测试：63 项通过，7 项并发新增的预期 RED 测试失败；因此当前不能报告全绿。
- 未运行会改写 `dist` 的 Vite build。
- 当前目录不是 Git 工作树，无法提供 Git diff/status 归属证明。
- `agent-reach check-update` 因命令不在 PATH 中跳过；GitHub CLI 与 Exa 研究本身已完成。
- 持续目标跟踪耗时约 14 分钟。