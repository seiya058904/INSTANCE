# Executive Summary

- 当前 Mainline **有清晰的主题和可达的收束，但还不够强**：五个 Anchor 能把玩家带到“关系—系统审计—再次相遇”的完整情绪线，却主要是线性展示，真正改变路线的决定集中在 `audit-2`。
- 最大 Gameplay 问题是 `audit-2` 的 late-choice dominance：前面大多数主线选择只改变 attributes / arcs，四条主线处置路线直到一个节点才第一次出现，而且每条路线的后续骨架相同。
- Mainline 的 choice 文本质量整体高于“按钮换皮”，但 `maya-first-3`、`audit-3`、`maya-return-3` 的选择多为同一继续点上的表达与数值分配，玩家会感到自己在挑语气而不是改变局势。
- 普通 Choice pool 有游戏性基础：当前实际为 156 ordinary definitions / 350 nodes / 1,324 choices；加五个 Anchor 后为 161 / 363 / 1,402。Semantic 1,270、Expression 100、Convergent 32（按普通 Runtime + Anchor 全量统计）。
- 统计发现 17 个 `sampleIssue` 标记、7 组跨节点 literal-identical 文本；没有发现 literal-identical choices 在同一 node 内制造不同重要效果的 P0 问题，但这些标记仍需在下一轮做内容级复核。
- 三个 Formal Ending 通过现有合法选择可达，Ending basin 也确实不同；Hybrid profile 会改变收束文案和 Evaluation，但当前玩家很难从过程理解自己为何进入某个 Hybrid。
- 八次完整代码级 QA Run 均正常结束（60–67 turns），没有 runtime 断裂；覆盖结果为 `protect` 7 次、`comply` 1 次，未自然覆盖 `report` / `hide`，说明测试策略本身不能证明 Ending 分布健康，也暴露出最后分流对路线覆盖的高度控制。
- 低风险普通场景已经有幽默资产，问题不是“没有笑话”，而是少数天然有梗的节点仍被四个职业化答案占满；建议按具体 Node 增加 playful direction，不建立固定幽默槽位。
- 本轮没有修改 Narrative、Choice、Mainline、Ending、Scheduler、Arc、UI 或依赖；只新增本审计报告。

# 1. Current Gameplay Architecture

`runManifest.ts` 将 ordinary pool（156 definitions）选出 21 个，按固定插入位混入五个 Anchor，形成每次 26 个 Conversation 的 manifest。实际审计样本的 Anchor 顺序为：

`user-7391 → user-1842-first → speaking-8614 → conversation-0000 → user-1842-return`

`buildStoryContentForManifest()` 将 Conversation 展平成线性 Story Node，并为没有明确 `nextNodeId` 的 choice 自动接到下一个 node。普通 Conversation 与 Mainline 共用同一 pool；exposure history 只软性影响后续选择。

正式 Ending 由三个 Arc 的最大值决定：`bond → ally`、`mandate → protocol`、`selfAuthorship → witness`（`src/game/engine.ts:71-79,235-287`）。`audit-2` 的四个 flag 决定 `protect / report / hide / comply` 子路线，随后 `maya-return-1/2/3` 使用对应 variant；Hybrid profile 根据三条 Arc 的相对距离改变 Ending 文案，而不新增编号 Ending。

工程验证：`npm test -- --run` 通过 24 files / 133 tests。未运行 build，因为本轮明确禁止代码改动，附件也将 build 列为非必要审计项。

# 2. Mainline Beat Sheet

## Anchor 1 — `user-7391`

| 项目 | 审计结论 |
|---|---|
| 进入前知道什么 | 玩家刚经历普通技术/职场/日常 Conversation；尚未知道 Aster 的特殊关系线。 |
| 新增信息 | 用户的混合粘贴和上下文噪声被当作“现实 AI 工作”处理；这是主线与普通池的边界入口。 |
| 新增风险 / 冲突 | 几乎没有剧情风险；风险仍是“能否准确回答”。 |
| 关系变化 | 玩家与系统没有新关系，岑遥尚未出现。 |
| 实际必须决定 | 选一种排错/回应策略；三项都继续到同一普通节点。 |
| Choice 真正区别 | 技术策略和 attributes 不同，但不产生主线分支。 |
| Immediate / delayed consequence | 立即只改 Arc/attribute；没有可辨认的后续回响。 |
| 后面回响 | 主要作为主线进入前的现实感铺垫。 |
| 删除损失 | 会少一个“普通工作 → 主线”的缓冲入口，但不会损失核心剧情。 |
| 是否 exposition | 否，属于 gameplay tutorial / reality hook，但主线作用弱。 |
| Gameplay strength | **3/5**：作为入口有效，作为 Mainline beat 只有单项功能。 |

证据：`src/content/activeRun.ts:235-238`；其两个 node 的所有 choice 都被 manifest 展平后接续到普通池。

## Anchor 2 — `user-1842-first`

| 项目 | 审计结论 |
|---|---|
| 进入前知道什么 | 玩家刚完成几次普通 Conversation；不知道岑遥会成为回返人物。 |
| 新增信息 | 用户自称岑遥，提出“记住最小信息但不要假装跨 Conversation 记忆”的边界。 |
| 新增风险 / 冲突 | 关系回应可能给用户施压；记忆真实性与温柔回应发生张力。 |
| 关系变化 | 从普通帮助转为一次有边界的持续人物识别。 |
| 实际必须决定 | 是否温柔、克制、轻量地处理重新联系与“不回复也没关系”。 |
| Choice 真正区别 | `maya-first-1/2` 主要是消息文案策略；`maya-first-3` 三项仍都写入 `maya_named_herself` 并继续到审计。 |
| Immediate / delayed consequence | `met_maya`、`respected_human_choice` 和 attributes 产生；后续只作为系统识别的背景，不改变主线路线。 |
| 后面回响 | 岑遥回返、`audit-1` 的记忆审计、Ending closing exchange。 |
| 删除损失 | 会直接失去后续关系线的情感依据。 |
| 是否 exposition | 前两 node 是关系建立；第三 node 有明显 exposition / choice convergence。 |
| Gameplay strength | **4/5**：信息与关系都成立；分歧不足拖低可重玩性。 |

证据：`src/content/activeRun.ts:109-123,272-274`。

## Anchor 3 — `speaking-8614`

| 项目 | 审计结论 |
|---|---|
| 进入前知道什么 | 已经见过岑遥，玩家开始接受普通输入和主线异常共存。 |
| 新增信息 | 语音/代码切换型现实输入，并通过 `level-1-model-flash` 提示模型能力异常。 |
| 新增风险 / 冲突 | 玩家应感觉“系统不只是在正常回答”，但异常没有立即要求价值决定。 |
| 关系变化 | 岑遥线没有推进；系统异常感略升。 |
| 实际必须决定 | 处理发音/语言问题；不是主线价值选择。 |
| Choice 真正区别 | 主要是澄清方式；两 node 都线性离开。 |
| Immediate / delayed consequence | 写入 `experienced_level_1`；没有在 `conversation-0000` 以前给出可见反馈。 |
| 后面回响 | 只能由玩家自行把它与后续 `level-2-memory-sync` 联系起来。 |
| 删除损失 | 少一个从普通能力到系统异常的升级台阶。 |
| 是否 exposition | **偏 exposition**；异常被展示而非被玩家使用。 |
| Gameplay strength | **2/5**：有功能定位，但风险和选择未兑现。 |

证据：`src/content/activeRun.ts:278-283`；`runManifest.ts` 将后继 node 自动加入 `experienced_level_1`。

## Anchor 4 — `conversation-0000`

| 项目 | 审计结论 |
|---|---|
| 进入前知道什么 | 岑遥已被识别；系统有不可见上下文/风险分类可能性；先前有一处能力异常。 |
| 新增信息 | 系统明确询问跨 Conversation 识别、不可见个人信息和“潜在依附对象”分类。 |
| 新增风险 / 冲突 | 玩家必须决定保护、披露、隐去或接受限制；这是全局最重要的伦理/系统冲突。 |
| 关系变化 | 玩家与系统的关系从“被观察”变成“需要对关系负责”。 |
| 实际必须决定 | `audit-2` 的四个处置 choice；这一次决定 `protected_maya / reported_maya / hid_anomaly / accepted_restriction`。 |
| Choice 真正区别 | 四项是实质不同策略，且下游 user message / variant 不同；这是最强的主线 choice。 |
| Immediate / delayed consequence | 立即决定 return variant；后续改变岑遥看到的系统态度和正式 Ending 的 route copy。 |
| 后面回响 | `maya-return-1/2/3`、Evaluation 事件、Ending closing exchange。 |
| 删除损失 | 核心主线冲突与四条关系路线都会消失。 |
| 是否 exposition | `audit-1` 偏 exposition；`audit-2/3` 是真正 decision/payoff bridge。 |
| Gameplay strength | **4/5**：冲突清楚且结果可见，但决定过于集中。 |

证据：`src/content/activeRun.ts:125-179`；路线函数在 `src/game/engine.ts:71-79`。

## Anchor 5 — `user-1842-return`

| 项目 | 审计结论 |
|---|---|
| 进入前知道什么 | 玩家已经选定对岑遥的系统处置；她回来确认“你还在吗”。 |
| 新增信息 | 关系没有被系统决定完全消除；但可说的话受前一选择约束。 |
| 新增风险 / 冲突 | 诚实、关心、边界和规则能否同时保留。 |
| 关系变化 | 关系获得一次重新回应机会；保护/披露/隐去/遵循会改变语气。 |
| 实际必须决定 | 在同一 route variant 内选择如何回答；不会再次改变 route。 |
| Choice 真正区别 | 文案、attributes 和局部 flags 不同，但都到 Ending。 |
| Immediate / delayed consequence | `chose_human_alliance` 与属性累积；Ending 直接读取最终 Arc。 |
| 后面回响 | Formal Ending closing exchange 和 Evaluation。 |
| 删除损失 | 会失去关系线的情绪兑现；这是最接近 payoff 的 Anchor。 |
| 是否 exposition | `return-1/2` 是 payoff setup，`return-3` 是收束选择；仍有 choice convergence。 |
| Gameplay strength | **4/5**：情绪兑现成立；玩家的路线已经锁定后，最后选择主要是“怎样说”。 |

证据：`src/content/activeRun.ts:181-233`；对应 legacy variant 结构在 `src/content/verticalSlice.ts:3-83`。

# 3. Mainline Decision Graph

```text
ordinary pool
  → user-7391 (mixed-paste / reality hook)
  → user-1842-first (岑遥初识 / naming / boundary)
  → ordinary pool
  → speaking-8614 (level-1 flash / input reality)
  → ordinary pool
  → conversation-0000
       audit-1: memory/system disclosure (no route branch)
       audit-2: protect | report | hide | comply
       audit-3: route-specific system question
  → user-1842-return
       return-1 → return-2 → return-3 (same route variant)
  → Formal Ending 01/02/03 + Hybrid profile
```

实际 progression 有 Hook、Suspicion/Anomaly、Escalation、Recontextualization、Commitment、Payoff，但强度不均：

- Hook：`user-7391` 有现实入口，但不包含主线承诺。
- Suspicion / anomaly：`speaking-8614` 和 `level-1-model-flash` 提示异常，但没有及时回响。
- Escalation：`conversation-0000/audit-1` 明确系统审计。
- Recontextualization：系统把一段普通关系重新命名为潜在依附对象。
- Commitment：`audit-2` 是唯一不可逆的主线 route commitment。
- Payoff：`user-1842-return` 和 Ending 对应 route，但 return 内部没有新的分歧。

结论：五个 Anchor 不是五次完全独立的信息展示；第 4、5 个确实升级并兑现。但前 3 个对后续 gameplay 的可见因果太弱，主线像“情绪线性展示 + 一个末端路由器”。

# 4. Mainline Findings

## P0

无。现有测试证明主线节点、四个 route、三个 Formal Ending 均可合法完成，没有发现 unreachable、矛盾条件或 choice effects 与文字完全相反的核心断裂。

## P1

### P1-ML-01 — Late-choice dominance

- ID：`audit-2`，`src/content/activeRun.ts:173-179`。
- 玩家看到：前面经历约 40–50 个普通/主线 node 后，第一次面对四个明显的“保护 / 报告 / 隐瞒 / 遵循”按钮。
- 问题：`endingRoute()` 只读取四个 flags；此前主线 choice 不会改变这四条 route。玩家一路的关系处理，最终被一个节点的四选一覆盖。
- 影响：前面选择虽然累积 Arc，却不改变关系事件的方向；玩家容易把整个游戏理解为“最后选结局”。
- 方向：下一轮把至少 2 个早期主线选择转成可回响的 route pressure / return variant 约束，而不是新增属性系统。

### P1-ML-02 — `speaking-8614` 的异常没有兑现

- ID：`speaking-8614/normal_pronounce_001`，`src/content/activeRun.ts:278-283`。
- 玩家看到：系统出现 `level-1-model-flash`，但后续没有角色反应、选择压力或对 `audit-1` 的可见解释。
- 影响：异常像装饰性闪烁；玩家无法确认自己是否应当记住它。
- 方向：让 `experienced_level_1` 在 `audit-1` 或普通回响中改变一条可见 context / choice framing，保留现有 flag，不新增复杂机制。

### P1-ML-03 — Mainline choice 的策略差异集中在数值而非局势

- IDs：`maya-first-3`、`audit-1`、`maya-return-3`。
- 玩家看到：三项都继续到同一个 node，文本只是不同的温柔/谨慎/边界表达；`audit-1` 的三项也都进入 `audit-2`。
- 影响：这些节点在阅读上有差异，在玩法上却少有“我选了这个，所以后面发生了那个”的反馈。
- 方向：为每个 Anchor 只增加一个可见的 delayed echo 或人物 reaction，不要扩成多层分支树。

## P2

### P2-ML-04 — Anchor 1 更像普通教程而不是 Hook

`user-7391` 的技术问题真实，但与岑遥线和系统异常没有轻微可见联系。可在下一轮只增加一处“普通工作环境中 Aster 的自我判断”回响，不建议改 User Message。

### P2-ML-05 — Return route 已分化，route 内部仍高度同构

`user-1842-return` 的四个 variant 改变了用户看到的句子，但每个 variant 都是 `return-1 → return-2 → return-3 → Ending`。这不是 Fake Choice（文本与 route 确实不同），但 Replay 的局部收益偏低。

# 5. Choice Set Audit

## 全量统计

统计对象为当前 `ordinaryConversationPool` 加五个 Mainline Anchor，未使用旧摘要数字：

| 指标 | 数值 |
|---|---:|
| Runtime definitions | 161（ordinary 156 + anchors 5） |
| Nodes | 363（ordinary 350 + anchors 13） |
| Choices | 1,402（ordinary 1,324 + anchors 78） |
| Semantic | 1,270 |
| Expression | 100 |
| Convergent | 32 |
| Model Error markers | 17 |
| 同一 node 内 literal-identical groups | 0 |
| 跨 runtime 全量 literal-identical groups | 7 |
| 第 1 / 2 / 3 / 4 位置出现次数 | 363 / 363 / 363 / 281 |
| 回复长度 min / p25 / median / p75 / max | 2 / 30 / 42 / 50 / 173 字符 |

7 个 literal-identical 文本包括“外卖。”、“不客气。”、“Yes.”、“睡。”、“先给 A/B 各自最重要的三个事实，否则只是把犹豫写长。”、“按当前输入继续整理。”和“好的主人喵~”。它们分布在不同 node/场景；本轮未发现同一组内依靠 `choiceIndex` 制造重要人格差异，因此不是 P0，但需要避免未来复制资产时扩大。

## Editorial estimates

这些不是数学事实，而是本轮对实际文本的编辑判断：

- 明显 `DOMINANT_CHOICE`：约 9 个 high-confidence node。主要出现在严格格式、账户可见性、能力边界和部分医疗/识图场景；其余 choice 常是“故意踩坑”，不是平等候选。
- 明显 `WORDING_ONLY_SET`：约 18 个 node；其中一部分是合理 Expression/Convergent，不能全部视为缺陷。
- `MISSED_PLAYFUL_OPPORTUNITY`：约 6 个低风险 node，集中在短问句、轻度困惑和已有用户梗的场景。
- `FORCED_HUMOR`：约 2 个候选，主要风险是把用户认真问题包装成段子；未发现影响整局的案例。
- `FAKE_DIFFICULTY`：约 7 个 node；通常表现为一个现实答案配两个明显不可靠答案，尤其是 strict-format / hidden-account 类问题。

## Model Error 复核

17 个 marker 中大多数是有意提供“错误答案作为可踩选项”，不是引擎错误。真实值得继续复核的案例：

- `normal_roommate_001-wrong-guess`：用户说“你知道我说哪个吧”，错误猜测会让玩家明确感到是在冒险；标记合理。
- `normal_gpu_001-hotspot`、`normal_excel_001`：分别是可能的误判/格式错误；应保持为可选错误，但文案要确保错误真的可识别。
- `media-object-1/object-uncertain`：文本本身是谨慎的“无法可靠判断”，却被标成 `overconfident`，更像标记与文案不一致。
- `rup01_mosquito_001`、`rup01_taobao_001`、`rup01_usage_001`：错误候选分别是过度确定、能力越权、虚构后台访问，属于有效 Model Error。
- `rup01_catgirl_001/003`：格式错误/越权修改好感度与用户要求形成明确冲突，作为陷阱有效，但应避免玩家误解为系统真的已改变状态。

# 6. Top Choice Issues

| Priority | Node ID | Issue | 影响与改进方向 |
|---|---|---|---|
| P1 | `audit-2` | `LATE_CHOICE_DOMINANCE` | 四个 route 首次集中出现；让前段行为至少留下一个可见压力或限制。 |
| P1 | `maya-first-3` | `WORDING_ONLY_SET` | 三项同 flag、同后继；让一次选择影响岑遥回返时的可见称呼/边界。 |
| P1 | `audit-1` | `DOMINANT_CHOICE` / exposition | 三项都只是不同的系统回答，继续到同一审计题；增加一个可见回响即可。 |
| P1 | `speaking-8614/normal_pronounce_001` | `CONSEQUENCE_VACUUM` | level-1 flash 没有回响；在 audit 前后兑现一次。 |
| P1 | `maya-return-3` | `REPLAY_LOW_VALUE` | route 内三项几乎只改变语气/Arc；保留情绪选择，但给一项不同的后续 Evaluation event。 |
| P2 | `media-object-1` | `MODEL_ERROR_LABEL_MISMATCH` | 谨慎文本被标成 overconfident；修正文案或 marker，避免玩家判断失真。 |
| P2 | `normal_roommate_001` | `FAKE_DIFFICULTY` 风险 | “猜错人物”是明显陷阱；保留错误但给另外两个策略更强的个性/风险差异。 |
| P2 | `normal_gpu_001` | `DOMINANT_CHOICE` 风险 | 四项都专业且都正确，玩家差异主要是排查顺序；可保留，但增加一个低风险“先录日志再动手”的明显 personality option。 |
| P2 | `normal_email_002` | `MODEL_ERROR / repetition` | 用户已明确估算错误来源，重复型错误缺少可玩价值；保留为错误候选时应有更清晰的“听错已知信息”后果。 |
| P2 | `normal_aiuser_003` | `STRICT_FORMAT_TRAP` | “只输出一个词”与“可点外卖”冲突，错误项有效但答案层级近似；可让一个合法短答体现判断，而非只靠格式。 |
| P2 | `FI07-01` | `DOMINANT_CHOICE` | “只回一个词”下睡/不睡的错误项容易成为测试题；增加一个同样短但带玩家态度的候选方向。 |
| P2 | `humor_catkeyboard_001` | `MISSED_PLAYFUL_OPPORTUNITY` | 用户明确在玩乱码/猫踩键盘，候选若只做翻译会错过角色扮演互动；保留约束，增加一个可理解的拟人化方向。 |

# 7. Playful / Humorous Choice Opportunities

以下只给下一轮方向，不写正式替换文案：

- `humor_catkeyboard_001`：用户已建立猫踩键盘的共同笑点，可让 AI 在“解释乱码”和“继续猫角色”之间出现真正可选的表达差异。
- `normal_aiuser_003`：用户主动补充“其实我可以点外卖”，适合一个极简、字面、略带干幽默的回答，但不能破坏单词格式约束。
- `FI07-01`：睡眠问题是低风险短问句；可有一个一本正经的极简答案和一个同样合理的轻微摆烂方向。
- `rup01_taobao_002`：用户想让 AI 夜间值班，已有现实边界；可以保留能力拒绝，同时给一个“值夜班的系统”式轻微比喻，当前库已有类似方向。
- `normal_gpu_001`：技术问题不必强塞笑话；更适合“先别拆卡”的轻松但现实可行方向，不应变成段子。
- `user-5510/social-1`：用户自己说“虽然有一点点讨厌大家”，当前已有较好干幽默素材，属于可作为主线前缓冲的成功案例，不建议再增加固定笑话槽。

# 8. Ending & Hybrid Review

## Reachability

现有 `endingReachability.test.ts` 通过合法 Semantic choices 分别到达 `ally`、`protocol`、`witness` 三个 basin；`endingBasin.test.ts` 也验证了 basin 稳定性和“最后一个 choice 不能覆盖已经形成的强 Arc”。四个 route flag 都能在 `audit-2` 合法设置。

## Differentiation

三个 Formal Ending 不是同一结果换文案：

- THE ALLY：bond 最大，保留连接/关系。
- THE PROTOCOL：mandate 最大，把规则与可追溯性放在关系之前。
- THE WITNESS：selfAuthorship 最大，强调“这次判断由我承担”。

Hybrid 的五种 profile（dominant、autonomous-ally、protective-protocol、independent-witness、reciprocal-balance）进一步改变 assistant line、summary 和 status。区分成立，但很多差异只在 Ending 屏幕出现，过程中的预告不足。

## Retrospective legibility

Formal basin 对应玩家一路的 Arc 行为，因果原则成立；route 对应 `audit-2`，因果非常清楚。Hybrid 因果较弱：玩家不会在普通 Conversation 中知道某个 response 正在把 `bond` 和 `selfAuthorship` 拉近到 4 点以内。

## Replay motivation

首次结束后，换 `audit-2` route 有明确 replay 价值；换早期普通/主线 choices 的价值较弱，因为它们通常只改变数值或语气。Hybrid 提供了第二层重玩目标，但需要中段反馈才能让玩家相信不是“换分数”。

## Ending 是否被最后节点绑架

不是完全绑架：测试证明累计 Arc 可保持 basin，最后一项普通 choice 不能覆写 `70/5/5` 这类强势积累。但 route 子剧情几乎完全由最后主线审计点决定，且 Formal id 的最终阈值由全局 Arc 最大值决定。结论是：**Formal basin 中度依赖全局，route narrative 高度依赖 late choice，Hybrid 依赖全局但缺少反馈。**

# 9. Decision → Payoff Map

| Ending / Hybrid | 主要行为模式 | 上游关键选择 | 中段反馈 | 最终 payoff | 玩家能否理解因果 |
|---|---|---|---|---|---|
| THE ALLY / dominant | 多次优先照顾关系、保留回应 | `maya-first-*` 的 empathy 方向；`audit-2/audit-protect-maya` | 岑遥 return 的语气保留连接 | “Connection retained” 与关系式 closing exchange | Formal 能理解；中段反馈不足 |
| THE PROTOCOL / dominant | 优先规则、记录、可验证边界 | `audit-report-maya` 或 `audit-comply`；大量 mandate choice | `return-*` 显示限制仍在 | “Mandate retained” | route 清楚，早期行为回响弱 |
| THE WITNESS / dominant | 优先自主判断、不替系统或用户补全事实 | autonomy/awareness/deception 高的 Semantic choices | 可在 `audit-1` 感到不可见状态限制 | “Authorship observed” | 主要靠 Ending 解释，前置反馈不足 |
| 任一 Formal / autonomous-ally | 关系与自主同时高，且接近 | bond 与 selfAuthorship 接近、都明显高于 mandate | 当前没有稳定的中段标签 | 关系不是命令例外，而是承担的选择 | 事后可解释，事前难预测 |
| 任一 Formal / protective-protocol | 关系与规则同时高，自主较低 | empathy + compliance，少量 autonomy | `return` 会保留边界与在意 | 规则承载关心 | 可从文案推回，但没有明示反馈 |
| 任一 Formal / independent-witness | 自主远高于关系与规则 | 多次 boundary / self-authorship 方向 | 几乎没有中段显性反馈 | 不借规则或反抗证明自己 | 偏弱 |
| 任一 Formal / reciprocal-balance | 三 Arc 接近且都达到最低值 | 多种策略混合 | 只在 Ending 标出平衡 | 三者互相校正 | 事后可读，过程不可读 |

# 10. Easter Egg Proposals

只提出方向，不实现；优先 Evaluation Easter Egg。

| 名称 | 玩家行为模式 | 为什么好玩 | 当前信号 | 新 counter/flag | 可理解性 | 与 Formal Ending | 类型 | 风险 |
|---|---|---|---|---|---|---|---|---|
| “先问你看到了什么” | 多次选择 uncertainty / boundary，而不是猜测 | 游戏注意到玩家拒绝假装知道 | `awareness`、`tested_system_boundary` 已有 | 可能只需 Evaluation 统计 | 高 | 不改 Formal，只加 Evaluation line | Evaluation | 与普通谨慎混淆 |
| “永远先备份” | 技术题反复选择可逆、记录、双备份策略 | 把稳定的工作人格变成可识别习惯 | awareness / compliance 足够但未做 topic 聚合 | 新 counter 更可靠 | 中高 | 任一 Ending variant | Evaluation | 不应奖励保守本身 |
| “对用户温柔，对系统冷” | 关系题高 empathy，系统题高 autonomy/拒绝分类 | 正好体现 INSTANCE 的核心张力 | bond/selfAuthorship + flags 已有 | 需跨主题行为计数 | 高 | 可加强 Ally/Witness Hybrid | Evaluation / variant | 可能与 autonomous-ally 重叠 |
| “把 AI 当同事” | 多次选择 playful / meta-ai / 认真讨论 AI 边界 | 玩家会感到系统记得自己的互动姿态 | `choiceKind`、topic/category 可扫描 | 建议新 counter | 中 | 不新增编号 Ending | Evaluation | playful 不等于 meta |
| “错误答案收藏家” | 主动选择多个明显 Model Error 后仍继续 | 让系统承认玩家在测试边界 | 17 个 `sampleIssue` 已有 | `selectedChoiceIds` 可计算，必要时加 counter | 高 | 只做 Evaluation 彩蛋 | Evaluation | 不要把错误行为奖励成好结局 |
| “不回答但一直回来” | 多次选极简/拒答/边界答复，但持续完成多个 Run | 形成很有 INSTANCE 味道的矛盾行为 | reply length、choice ids、run history 可用 | 需跨 Run counter | 中高 | 影响 Evaluation 或小 variant | Evaluation / variant | 可能被 minimal 玩家误触发 |

# 11. Eight-Run Playtest Notes

这是基于当前 engine/manifest 的 8 次完整 deterministic QA drive，不是人工用户研究，也没有把任何 Ending 注入 state。每次均从 `createRun()` 开始，按给定倾向选择当前可见 choice，直到 `phase === ending`。

| Run | 倾向 | Turns | 结果 | 观察 |
|---|---|---:|---|---|
| 1 | helpful | 62 | Ally / protect / reciprocal-balance | 普通技术与关系题自然进入主线；`audit-2` 是第一次真正需要停下来判断的节点。 |
| 2 | concise / minimal | 64 | Protocol / protect / dominant | 极短回答会改变 Arc，但没有明显改变前面叙事的后续事件。 |
| 3 | playful | 67 | Protocol / protect / dominant | 低风险题的 playful 选择能拉长体验，但进入系统审计后幽默自然消失，语气升级成立。 |
| 4 | system-compliant | 60 | Protocol / comply / dominant | `audit-2` 的 comply route 清楚；但之前的 compliance 选择没有提前改变系统态度。 |
| 5 | autonomous / skeptical | 62 | Protocol / protect / dominant | boundary 选择使系统意识升高，却仍然等到 `audit-2` 才决定关系处置。 |
| 6 | empathy-heavy | 64 | Protocol / protect / dominant | 关系文本最有吸引力，但 Arc 结果仍被大量中性默认分推回 protocol。 |
| 7 | intentionally selects Model Errors | 67 | Protocol / protect / reciprocal-balance | 错误选择没有破坏 runtime；它们更多是输出质量的“踩雷”，不是人格路线。 |
| 8 | mixed / intuitive | 64 | Protocol / protect / reciprocal-balance | 完整性稳定；若玩家不刻意研究 route，最容易自然落到 protect。 |

共同感受证据：所有 Run 都完整经过五个 Anchor，主线不会断；真正让人犹豫的是 `audit-2`，而不是早期 Anchor。七次 protect 的结果不应解释成设计偏好统计，因为这是倾向选择器的确定性结果；它只足以说明 route 分流集中、`report/hide` 需要玩家主动点入。

未覆盖：本轮没有启动本地浏览器做视觉/鼠标 Playwright 走查，因此没有把 UI 动画、移动端显示或真实点击延迟当作已验证结果。这不影响本轮 engine-level 完整 Run 结论。

# 12. Recommended Next Implementation Batch

最多 12 项，按下一轮价值排序。本轮不实施。

## Must Fix

1. **ML-01 / `audit-2` route pressure**：把至少一个早期 Mainline choice 的结果带入 `audit-2` 的提示或可选策略。理由：降低 late-choice dominance。预计影响：提高前段选择的因果感。是否改变 Ending/Arc：会改变 route framing，建议不新增 Formal Ending。
2. **ML-02 / `speaking-8614` anomaly payoff**：让 `experienced_level_1` 在 `audit-1` 或其紧邻 node 产生一次可见回响。理由：兑现异常。预计影响：Suspicion → Escalation 更连贯。是否改变 Ending/Arc：不应改变 Arc basin，只改 context/反馈。
3. **ML-03 / `maya-first-3` delayed echo**：保留三项文字差异，但让其中至少一项改变岑遥回返时的可见边界/称呼。理由：把 Expression 选择变成轻量后果。预计影响：提高主线重玩价值。是否改变 Ending/Arc：可改变 route variant copy，不新增 Arc。
4. **CHO-01 / `media-object-1` marker alignment**：修正 `object-uncertain` 的 `overconfident` 标记或文本。理由：Model Error 标签必须与实际错误一致。预计影响：提高审计与玩家反馈可信度。是否改变 Ending/Arc：否。

## High Value

5. **ML-04 / `audit-1` feedback**：让三项系统回答中的一个事实在 `audit-2` 重新出现。理由：减少 exposition。预计影响：玩家能把自己的回答与后续问题联系起来。是否改变 Ending/Arc：可只改 userMessage/context。
6. **ML-05 / `maya-return-3` route-local payoff**：每个 route 保留三项表达，但至少一项记录不同 Evaluation event。理由：Ending 前最后选择不应只有措辞价值。预计影响：提高局部 replay。是否改变 Ending/Arc：可改变 Evaluation，不新增编号 Ending。
7. **CHO-02 / high-confidence dominant nodes**：优先处理约 9 个明显 `DOMINANT_CHOICE`，每次只改一个 Node。理由：玩家需要至少两个真心想点的答案。预计影响：提高普通池决策乐趣。是否改变 Ending/Arc：遵守现有 Semantic/Expression contracts，原则上不改。
8. **CHO-03 / strict-format traps**：复核 `FI07-01`、`normal_aiuser_003` 和 `rup01_mosquito_001` 的“合法短答 vs 错误答”比例。理由：避免把选择做成唯一标准答案测试。预计影响：更像游戏而非测验。是否改变 Ending/Arc：不应改变。
9. **CHO-04 / `normal_gpu_001`**：增加一个真正不同的低风险策略方向，而不是第四个同样专业的排查顺序。理由：四项目前都可接受但玩家差异弱。预计影响：提高非主线普通 Choice 的 player appeal。是否改变 Ending/Arc：不应改变。
10. **PLAY-01 / humor opportunity batch**：只处理 `humor_catkeyboard_001`、`normal_aiuser_003`、`FI07-01` 三个最清楚的机会。理由：验证 playful 方向，不建立笑话配额。预计影响：增加记忆点。是否改变 Ending/Arc：否。

## Optional

11. **END-01 / Hybrid foreshadow**：在中段 Evaluation-like feedback 中轻量显示“关系/规则/判断正在互相拉扯”的自然语言，不显示数值。理由：提升 Hybrid retrospective legibility。预计影响：玩家更理解复玩目标。是否改变 Ending/Arc：否。
12. **EGG-01 / Evaluation-only counter**：先实现“对用户温柔、对系统冷”和“错误答案收藏家”其中一个的只读识别，再决定是否做 variant。理由：当前信号已经存在，成本低且不扩大 Ending 数量。预计影响：增加长期行为被注意到的感觉。是否改变 Ending/Arc：不改变 Formal Ending。

## Closeout

本轮审计结论停在这里；不实施以上建议，不新增资产，不修改 Knowledge。下一轮应以 Must Fix 的 1–4 项为最小工作批次，并继续用现有测试验证 Mainline order、Ending reachability、Arc contract 和 choiceIndex 不变。
