# INSTANCE 全项目 Conversation Asset Census

日期：2026-08-10  
口径：创作上的独立 Conversation 概念只计算一次；精选版、Runtime 适配版、Longform TypeScript 版沿用源资产血缘，不作为新资产重复计数。

## 结论

| 指标 | 数量 |
|---|---:|
| Authored Unique Source Assets | **196** |
| Code-only / legacy definitions without Markdown lineage | **12** |
| Exhaustive project inventory units | **208** |
| 当前正式普通 Runtime Pool 定义 | **156** |
| 当前正式普通 Runtime 实际代表的源资产 | **158** |
| Mainline Anchor | **5** |
| 正式 Runtime 覆盖的独立源资产（普通 100 + Anchor 5） | **105** |
| Formal | **166** |
| Reserve | **23** |
| Reject | **7** |
| Merge-only 源资产 | **2** |

因此有三种合法但不同的使用率：

- 按普通 Runtime 的定义数量：`156 / 191`（Runtime 定义维度，不与源资产 Formal 数字混用）。
- 按 Authored 源资产的正式分层：`166 Formal + 23 Reserve + 7 Reject = 196`。
- 如果把 12 个没有 Markdown 血缘的 code-only/legacy 定义也纳入项目库存：`196 + 12 = 208`。

更严格地说，第二个比例是“作者源资产正式被项目使用”的比例；第三个比例是“当前能从项目定义层确认的全部库存”的保守覆盖率。普通池单独计算时，非 Anchor 作者源资产覆盖率是 `100 / 171 = 58.5%`。

## 1. Unique Source Assets

### 首批四个 Markdown Library：100

- `batch01`：25
- `batch02`：25
- `batch03`：25
- `humor01`：25

### 三个并行 AI 原始候选库：61

- `people_life01`：20
- `friction_input01`：20
- `continuity_multimodal01`：21

`selected_expansion01` 的 34 个源 ID 全部能在这 61 个原始候选中找到，验证为筛选/精修副本，不增加 Unique 数量。

### Longform 原始候选：10

- LF01-01 至 LF01-10，共 10 个 Conversation。
- `longformOutput01.ts` 的 6 个 Runtime 版本与原始 Markdown 一一对应，不重复计数。

### Mainline Anchor：5

- `user-7391`
- `user-1842-first`
- `speaking-8614`
- `conversation-0000`
- `user-1842-return`

### Real Usage Patch 01：20

- `RUP01-01` 至 `RUP01-20`，20 个独立源资产。
- 其中 16 个纯新增；4 个进入原有 Formal 名额并使 `humor01:01/18/21/24` 降为 Reserve。

合计：`100 + 61 + 10 + 5 + 20 = 196`。

## 1.5 额外的代码-only / legacy 定义：12

这些定义当前存在于代码中，但没有在上述 Markdown 源库中找到明确的一对一来源，因此不能自行并入 176：

- `original:*`：9 个 Runtime-only Conversation，包括 6 个多模态/生成图和 3 个收敛回答。
- `legacy:*`：3 个 activeRun 兼容定义：`legacy:dev-help`、`legacy:study`、`legacy:social`。

所以：

> 作者源资产 196 + 未能建立 Markdown 血缘的代码定义 12 = 项目库存 208。

## 2. File Occurrences

这些数字允许同一资产的原稿、精选稿和 Runtime 版重复出现：

| 文件/代码层 | Conversation 记录 |
|---|---:|
| 四个首批 Markdown | 100 |
| 三个原始候选 Markdown | 61 |
| Longform Markdown | 10 |
| selected_expansion01 Markdown | 34 |
| 当前 ordinary Runtime Pool | 156 |
| activeRun.ts 中的 Conversation 定义 | 18 |

这些是 File Occurrences，不应直接相加。

## 3. Current Formal Runtime

### 普通 Runtime Pool：156 个定义

其中实际代表：

- 首批 Library 源资产：77
- 本轮普通候选独立/合并源资产：17
- Longform 源资产：6
- Runtime 内置/兼容定义：9 个 `original:*` 代码定义

由于 2 个候选是 Merge，98 个 Conversation 定义对应 100 个源级资产。

### Mainline Anchor：5 个

这 5 个不是普通 Pool 的普通抽取项，但属于正式游戏主线，因此不能简单塞进 98 里，也不能从项目总资产中漏掉。

正式 Runtime 的源资产覆盖量为：`100 + 5 = 105`。

## 4. Candidate Disposition

本轮 44 个最终送审候选的状态：

- 独立接入：21
- Merge-only：2
- Reserve：18
- Reject：3

注意：这 44 个不是额外叠加到 176 上的资产层；它们已经包含在 61 个原始候选和 10 个 Longform 源资产中。

## 5. 血缘示例

### FI11

`原始 Friction/Input → selected_expansion01 精选/精修 → selected-fi11 Runtime`

只算 1 个 Unique Source Asset。

### LF01-01

`longform_output01 Markdown → longformOutput01.ts → Longform Runtime`

只算 1 个 Unique Source Asset。

### FI06

`原始 Friction/Input → selected_expansion01 → Merge 到 CM01-09`

不产生新的正式 Conversation ID，但 FI06 仍作为 1 个 Merge-only 源资产保留在项目中。

## 6. 可复现验证

对应测试：`src/content/assetCensus.test.ts`

当前测试确认：

- 首批源库：100
- 原始候选库：61
- Longform：10
- selected 是原始候选子集
- Unique Source Assets：176
- 普通 Runtime Pool：98
- Mainline Anchor：5

## 最终回答

如果你问的是“按作者源库和主线血缘去重后的独立 Conversation 资产”，答案是：

> **176 个。**

如果你问的是“把代码中没有 Markdown 血缘、但当前仍存在的 original/legacy 定义也算入项目库存”，答案是：

> **188 个库存单位。**

如果你问的是“当前普通 Runtime 有多少个 Conversation 定义”，答案是：

> **98 个。**

如果你问的是“正式 Runtime 实际覆盖了多少个可确认的去重源资产”，答案是：

> **105 个，包括 100 个普通源资产和 5 个 Mainline Anchor。**
