# INSTANCE Runtime 现有文字资产质量优化设计

## 目标

在不新增 Conversation、Scene、正式 Ending、Narrative Arc 或新题材的前提下，提升当前 77 个 Runtime Conversation 的自然度、交互形状差异和 Run 内节奏。

## 范围

- 只修改当前 Runtime authoritative source、`runtimeRealityPass`、`runManifest` 及对应测试。
- 并行 AI 新生成的 Library 全部只读，不读取后改写、格式化、移动或接入。
- 第一批只处理审计收益最高的 10–15 个现有 Conversation，不为数量凑数。
- 任何 Choice 文本修改都重新核对 Semantic Arc；不恢复 choiceIndex 到人格的映射。
- 不新增 Model Error，不修改正式 Ending、Ending basin 或 Arc 结构。

## 设计

第一批内容精修集中处理四类已证实问题：过度完整的用户首句、没有必要的第二轮、同义 Choice 和 Humor 强行延长。保留题材本身，通过缺口、追问、结束条件和回复承诺差异改变交互形状。

Scheduler 只引入轻量的 Run 内软降权：同一 Topic Category、InteractionPattern、Humor 或过短 Conversation 连续出现时降低候选排序分数；不硬性禁止，也不通过降权隐藏质量差内容。Anchor 仍保持五个、顺序不变、`conversation-0000` 强制进入，只调整缓冲间隔。

审计测试输出前后相同指标：Conversation/Node/Choice、轮数分布、Topic 与 Pattern、Choice 类型、Choice 长度位置偏差、高频 AI 开头、10 个 Manifest 样本及 Anchor 位置。核心功能回归覆盖 Storage、Replay、Arc、Ending、Streaming 和 UI。

## 验收

- 第一批修改前后有可复现的对照数据。
- 第一批不改变普通池规模，不新增 Conversation ID。
- 修改后的文字与 Arc effects、Choice metadata、Input metadata 一致。
- `npm test` 与 `npm run build` 通过。
- 完成桌面和 390×844 浏览器走读；检查 Console、刷新、Storage、完整一局和主线节奏。
- 第二批只在第一批前后对比和人工走读确认仍有明显问题时继续。
