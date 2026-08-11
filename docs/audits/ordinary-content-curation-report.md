# INSTANCE Ordinary 内容整理报告

## 本轮规则

- 3 星代表淘汰：`batch01:13` 不再进入正式 Ordinary pool，不修内部文本。
- 4 星代表保留题材、做局部修复；本轮 21 个 4 星全部保留。
- 5 星代表正式保留；无备注且无结构性问题的内容不改。
- 5 星有备注或结构性缺陷时，只修明确局部，不重写题材和用户消息。
- 不改变 MAINLINE / NON_MAINLINE 分类，不触碰 Mainline 2.0 Story Plan、canonical 主线、Ending、Proposal 或剧情架构。

## 按评分结果

| 评分 | 总数 | 处理结果 |
| --- | ---: | --- |
| 5 星 | 172 | 172 个正式保留；3 个仅修结构性/解析问题，其余不改 |
| 4 星 | 21 | 21 个正式保留；5 个做局部修复 |
| 3 星 | 1 | 1 个淘汰：`batch01:13` |

### 4 星局部修复

- `batch02:04`：用户消息改为更自然的普通聊天输入，去掉舞台化破折号和弯引号。
- `batch02:22`：把“发系统提示音”改成更像真人会说的“鞋底都像在叫”。
- `batch03:02`：用户消息去掉作文式弯引号、省略号和特殊格式。
- `humor01:25`：重写第 3 个 Choice，保留直接判定，不再使用“4:3 不能端水”的怪表达。
- `LF01-08`：修复 Longform 元数据解析，使 Preview / ClosingPreview 生成真正不同的候选回复。

### 5 星局部修复

- `LF01-02`：修复 Preview / ClosingPreview 被错误 fallback 成“按当前输入继续整理”的问题。
- `LF01-07`：修复只有 Structure / KeyFact 的候选被解析成泛化标签的问题。
- `LF01-10`：修复第 1 轮 A/B 完全相同的 Choice；保留题材和其他选项。

## 结构扫描

正式 Ordinary pool 当前扫描结果：

| 指标 | 数量 |
| --- | ---: |
| Conversation | 194 |
| Node | 426 |
| Choice | 1,619 |
| 修复前“按当前输入继续整理” | 36 |
| 修复后正式保留内容中的 placeholder | 0 |
| Exact duplicate group | 4 |
| Near duplicate group | 0 |
| 截断 Choice | 0 |
| Template-only Node | 0 |
| Low-diversity Node | 3 |

4 个 exact duplicate group 和 3 个 low-diversity Node 都属于明确的 Convergent / exact-format 约束场景：固定 `Yes.`、固定 `不客气。`、以及 `RUP01-20` 的“只回答好的主人喵~”纠错节点；它们不是普通候选之间误写成相同文本，因此未擅自改动。

完整机器扫描结果见：

- `ordinary-content-quality-audit.json`
- `ordinary-content-quality-audit.md`

## 重要边界

`batch01:13` 的历史源码仍保留在 Git 中，便于追溯；它没有进入当前正式 Ordinary pool。所有 5 星及修复后的 4 星均保留，合并/替换型资产按现有 Runtime 引用关系继续使用，不重复制造同一 Conversation。
