# INSTANCE 内容真实性、Arc 语义与 Replay 设计

## 目标

在不继续扩大主要系统面的前提下，重构现有 Runtime Conversation 分布，使玩家连续游玩时无法依赖“两轮标准问答”预测下一段会话；同时让 Arc 由回复语义而非选项序号决定，并让 Replay 记住最近多局。

## 内容分布

- 保留普通、完整、严肃 Prompt，但把 `standard-question` 从 49/73 降到不足半数。
- 通过 Runtime editorial pass 改写现有 Source；只吸收已经存在但未进入运行池的 H03/H09，不批量新增 Source。
- 将 H04、H11、H18、H24 扩成 4～5 轮的轻内容长谈；增加一批三轮纠正、Burst 和需求转向。
- Runtime 中必须真实出现中文错字、拼音混输、自然中英混输、语音误识别、键盘误触、轻度可辨乱码。
- `self-correction` 只标记真纠正；补充事实使用其他行为标签。
- Expression 与 Convergent 必须由实际文本支持；新增一组明确的 A/B 与 C/D 两两近似候选。
- 少量 Choice 标注可观察的模型失误：误解对象、违反约束、过度自信、截断、格式损坏、轻度乱码、系统失败。安全敏感内容不放错误样本。

## Replay

- Exposure History 升级为 version 2，并兼容迁移 version 1。
- 最近 3 局的 exact Conversation 强惩罚；最近 5 局的 opening 强惩罚。
- Conversation 增加高层 `topicCategory`，选择器同时考虑近期类别和 InteractionPattern 密度。
- 池不足时允许逐步放宽，不永久封禁内容；相同 run id 与 exposure snapshot 保持确定性。

## Arc 与 Ending

- 删除按 Choice index 赋予 Arc 的逻辑。
- 新建语义 Arc resolver：优先读取显式 Arc；否则结合已人工编写的 attributes、Choice 文本语义和 Choice kind 生成 Runtime Arc effect。结果与数组顺序无关。
- Convergent同文Choice必须完全同效；Expression差异为0或极小；明显Semantic差异才产生明显Arc差异。
- 三个正式Ending继续由主要Arc决定，但增加 Hybrid profile：`bond+self`、`bond+mandate`、`self-low-mandate`、`balanced`。
- Hybrid改变Ending正文、status和Evaluation Observed Event，不新增正式编号Ending。

## Streaming与兼容

- 不重构现有RAF Streaming。
- 增加长英文DOM prefix与剪贴板可选择性浏览器验证。
- 保持 StableRunState checkpoint语义；Exposure v1迁移为v2，旧Run存档继续恢复。

## 验收

- 自动统计内容、Choice错误类型、Replay 5局、Arc reorder invariance、Ending/Hybrid、Storage migration。
- `npm test`和`npm run build`通过。
- 浏览器覆盖Desktop、390×844、Reduced Motion、中文、长英文、Clipboard、5局Replay与Console。
- 最终如标准问答仍过半，或错误输入/模型错误仅有点缀，不得宣称完成。
