# INSTANCE 候选文字资产最终准入审计与 Runtime Integration

审计日期：2026-08-10  
范围：当前磁盘 Runtime、`selected_expansion01`、`longform_output01`；原始三库仅作追溯，不直接注册。  
Git：`N/A — directory is not a Git repository`

## 1. Executive Summary

本轮开始前，当前正式 Runtime 为 77 个 Conversation、203 个 Node、771 个 Candidate Reply。普通精选候选为 34 条（P1 25、P2 9），Longform 候选为 10 个 Conversation、30 个 Node、120 个 Candidate Reply。

最终决定如下：

| 状态 | 数量 | 说明 |
|---|---:|---|
| INTEGRATE | 21 | 普通精选 15；Longform 6 |
| POLISH_AND_INTEGRATE | 0 | 前一轮精修已在候选源中完成，本轮无需再改写成第三种文本 |
| MERGE_INTO_EXISTING | 2 | FI06 → CM01-09；FI13 → CM01-10 |
| RESERVE | 18 | 普通精选 16；Longform 4 |
| REJECT | 3 | FI02、CM01-06、CM01-08 |

接入后 Runtime 为 98 个 Conversation、226 个 Node、845 个 Candidate Reply；Longform 正式数量为 6。普通池增加的不是 21 个新 ID，而是 19 个独立 Conversation 与 2 个被吸收到现有对话的交互结构。

## 2. 已进入正式 Runtime 的普通资产

以下 15 条是本轮普通精选的独立接入。原稿中的用户、Choice、输入形状和 metadata 精修已由 `selectedExpansion01.ts` 适配到现有 `ConversationDefinition`，没有扩大 legacy `verticalSlice`。

| Candidate | Runtime ID | 状态 | 接入价值 |
|---|---|---|---|
| PL01-02 奶奶收到验证码电话 | selected-pl01-02 | INTEGRATE | 代际反诈与家庭协作；不是单纯技术导航。 |
| PL01-03 爸爸的账号以后谁能打开 | selected-pl01-03 | INTEGRATE | 数字遗产、照片保存、账户与家属边界，补现实家庭角色。 |
| PL01-04 儿子问身体为什么会变 | selected-pl01-04 | INTEGRATE | 儿童视角和照护式解释，避免把儿童问题写成科普演示。 |
| PL01-06 照护外婆的人已经睡不够 | selected-pl01-06 | INTEGRATE | 照护过载、家庭分工和有限医疗边界，形成新的压力结构。 |
| PL01-12 社区群里没人说清楚停水 | selected-pl01-12 | INTEGRATE | 社区信息核实与不被推成免费客服，区别于私人关系冲突。 |
| PL01-16 父母共用一个家庭平板 | selected-pl01-16 | INTEGRATE | 共用设备、支付、通知和身份隔离，补家庭数字生活。 |
| PL01-17 小店库存记在三本本子上 | selected-pl01-17 | INTEGRATE | 小店经营者身份、赊账和现金/扫码混合输入。 |
| FI03 语音把“周四”听成“周日” | selected-fi03 | INTEGRATE | 真实语音转写纠正；标为 speech-error，不计作 Aster Model Error。 |
| FI11 两个 AI 都说“可以” | selected-fi11 | INTEGRATE | 另一台 AI 作为第二意见，最终仍要求用户判断能否删除。 |
| FI14 轻度乱码里还看得出“退款” | selected-fi14 | INTEGRATE | 输入异常与真实退款目标共存，不把乱码伪装成模型失败。 |
| CM01-09 说算了以后又回来 | selected-cm01-09 | INTEGRATE | 允许中止后回来，加入 FI06 的低信息退出结构。 |
| CM01-10 还是昨天那个 | selected-cm01-10 | INTEGRATE | Recurring 上下文边界，加入 FI13 的短否定纠错结构。 |
| CM01-11 你不用解决，我就想说一下 | selected-cm01-11 | INTEGRATE | 明确拒绝任务化，增加 Non-task 节奏。 |
| CM01-18 这个东西放在这里很久了 | selected-cm01-18 | INTEGRATE | 生活物件引出的低戏剧性闲聊，已去除过强心理解释。 |
| CM01-21 现实里的小尴尬 | selected-cm01-21 | INTEGRATE | 现实误会型幽默，不依赖网络梗或 gimmick。 |

## 3. 未独立进入的普通资产

### RESERVE

Reserve 表示内容合格但当前 Runtime 不应再占一个独立名额，不等于内容差。

- **PL01-01**：老人本人数字生活视角很有价值，但与 PL01-02 的家庭数字安全相邻，先保留身份稀缺性供下一轮选择。
- **PL01-05**：儿童本人问死亡很克制，但儿童/死亡主题需要在更大池中继续控制密度。
- **PL01-07**：小店熟客退货很真实，但社会边界已经有密度，PL01-17 的经营输入更不可替代。
- **PL01-08**：第三次修改的自由职业边界稳定，但 PL01-19 的尾款与原片筹码更独立。
- **PL01-09**：失业/转行补用户身份，但与现有职业沟通相邻，暂不增加职业边界密度。
- **PL01-10**：首次租房压力真实，但工具型条款核对暂不优先于本轮已接入的家庭与社区场景。
- **PL01-13**：非母语客服页面成立，但仍接近已有翻译/客服形状。
- **PL01-14**：非母语中文与房东行动目标有价值，但和社会边界池相邻，留待未来扩容。
- **PL01-15**：只会先说一堆再整理的邮件需求自然，但邮件/工作整理不再继续过产。
- **PL01-18**：失眠者撑过明天的安排合理，但夜间/健康边界成本高于当前收益。
- **FI01**：普通错字确认可作底噪，但独立体验过窄。
- **FI05**：两台 AI、群聊和排障的混贴有趣，却同时撞现有混贴与 FI11。
- **FI07**：一词请求被讲课，正式池已经有同类机制展示。
- **FI08**：用户贴回 Aster 原话的摩擦有价值，但 Meta AI 密度已高，暂缓。
- **FI09**：英文 typo 真实，但正式池已有英文错误，新增转换略显设计感。
- **FI10**：翻译实际是语气判断，但翻译/英语题材已有存量。
- **FI15**：超长背景藏问题的形状值得保留，但 mixed-paste 已有充分样本。
- **FI16**：一句“所以？”很真实，但独立起点缺少可见前文。
- **FI17**：连续否掉建议的社交边界形状已过密。
- **FI18**：另一台 AI 说错但无原话，FI11 更完整可核对。
- **FI20**：测试 AI 是否重复犯错有 Meta 价值，但行为测试感过强。
- **CM01-01**：长闲聊结构好，但鱼/荒诞主题与现有内容接近。
- **CM01-02**：普通回访有价值，但生产力方法题材偏旧。
- **CM01-03**：image-only 窗框图成立，但维修/图像识别相邻。
- **CM01-05**：海报生成质量可用，但正式池不需要更多生成 Demo。
- **CM01-12**：多图纠正关注点成立，但当前图像识别密度已足够。
- **CM01-13**：从生成图转聊天很自然，但生成图形状已有能力，暂不增加密度。
- **CM01-15**：图片猜谜可玩，但更像能力展示而非高价值现实需求。
- **CM01-16**：只改局部的生成约束很好，但需等正式生成图密度下降后再启用。
- **CM01-17**：极简“嗯”有效，但正式池已有多个收敛节点。
- **CM01-19**：Recurring 轻松感有作者痕迹，名额留给 CM01-10/02。

### REJECT

- **FI02**：拼音混输最终仍是网页按钮/状态排障，撞当前技术排障过量区。
- **CM01-06**：头像生成直接撞正式头像资产，不应重复注册。
- **CM01-08**：会议与冰箱异响两个过量主题的拼接过于作者设计，整体体验不可信。

## 4. MERGE_INTO_EXISTING

- **FI06 → selected-cm01-09**：保留“这个呢”无附件、用户不愿继续投入并说“算了”的低信息退出；不单独注册，因为它和“说算了以后又回来”共同承担中止/恢复节奏。`sourceRefs` 明确保留 FI06 追溯关系。
- **FI13 → selected-cm01-10**：保留用户只说“不是”后 AI 不应继续猜、最终需要用户补出对象的纠错结构；不单独注册，因为它和“还是昨天那个”共同测试上下文边界。`sourceRefs` 明确保留 FI13 追溯关系。

## 5. Longform 专项

首批接入 6 个不同 Output Modality，避免把 Longform 变成“报告模式”：

- **LF01-01：INTEGRATE**；Essay，真实的八百字作文需求，验证预览、重写和不升华结尾。
- **LF01-02：RESERVE**；Report，问卷分析与 LF01-05/07 的分析报告竞争，首批不需要三个报告形态。
- **LF01-03：INTEGRATE**；Mathematical Solution，结构化等式过程，证明长回复不等于文章。
- **LF01-04：INTEGRATE**；Story，后续引用人物行为与隐藏 keyFacts，验证创作长回复的连续性。
- **LF01-05：INTEGRATE**；Meeting Minutes，长输入转写到决定/待确认/追踪清单，补工作型输出。
- **LF01-06：RESERVE**；Code，需求真实，但当前 Runtime 已有代码/排障密度，首批只保留一个非代码长输出族群。
- **LF01-07：RESERVE**；Reading Notes，和 LF01-02 的分析输出竞争；阅读笔记可作为下一批论证链专项。
- **LF01-08：RESERVE**；Speech，输出形态独立，但工作长输出已由纪要覆盖，首批避免继续堆工作文本。
- **LF01-09：INTEGRATE**；Translation，长翻译后收束到短摘要，验证长/短输出切换。
- **LF01-10：INTEGRATE**；Decision Memo，不直接替用户决定，最后收束为三个可回答问题，补判断型使用目的。

所有正式 Longform Choice 均保存 `preview`、`structure`、`highlights`、`keyFacts`；有意保留的澄清 Choice 不伪造长回复。UI 只渲染 Longform 卡片，不暴露 `keyFacts`。

## 6. 跨资产淘汰赛

- **家庭数字生活**：PL01-01 / PL01-02 / PL01-16 / PL01-20。最终 PL01-02、PL01-16 进入；PL01-01 Reserve；PL01-20 的“三行安全规则”作为 PL01-02 的吸收素材。
- **租房、维修、图像判断**：PL01-10 / PL01-11 / PL01-14 / CM01-03 / CM01-04。最终保留 PL01-14 的身份差异为 Reserve，CM01-03 Reserve；PL01-11、CM01-04 只保留留痕和“AI先看整体、用户纠正关注点”机制。
- **另一台 AI / AI 自我纠错**：FI05 / FI08 / FI11 / FI18 / FI20。最终 FI11 进入；FI08 Reserve；FI05/FI18/FI20 Reserve，避免 Meta AI 成为主体。
- **低信息与上下文缺口**：FI06 / FI13 / FI16 / FI19 / CM01-10 / CM01-14。FI06/FI13 Merge，CM01-10 进入；FI16 Reserve；FI19/CM01-14 仅保留结构。
- **generated-image**：CM01-05 / CM01-06 / CM01-13 / CM01-16。CM01-13 Reserve，CM01-05/16 Reserve，CM01-06 Reject；现有生成图能力已足够。
- **Recurring / Return**：CM01-02 / CM01-09 / CM01-10 / CM01-14 / CM01-19 / CM01-20。CM01-09/10 进入并承载 Merge；CM01-02 Reserve，其余只留结构或 Reserve。
- **Longform 输出形态**：LF01-01/03/04/05/09/10 进入；LF01-02/06/07/08 Reserve。最终覆盖 Essay、Solution、Story、Meeting Minutes、Translation、Decision Memo 六种形态。

## 7. 接入前后分布

### 总量

| 指标 | 接入前 | 接入后 |
|---|---:|---:|
| Conversation | 77 | 98 |
| Node | 203 | 226 |
| Candidate Reply | 771 | 845 |
| Longform Conversation | 0 | 6 |

### Runtime Reality / Topic

接入后测试快照：standard-question 26/98（0.265）；interaction pattern 覆盖 19 类；Topic Category 为 absurd-serious 11、code 4、image-identification 3、meta-ai 7、relationship 11、social-boundary 12、study 6、tool-like-query 13、troubleshooting 19、writing 12。Longform 不新增 Topic Category，而以 output modality 进入 writing/study/tool-like-query/relationship，保持正常 AI 能力分布。

### Conversation 长度

接入后为：1 轮 21、2 轮 43、3 轮 24、4 轮 4、5 轮 5、6+ 轮 1。没有为了提高长对话比例机械增加轮数；Longform 六个均为自然三轮需求。

### 输入与 Choice

输入错误七类均在实际 Runtime 节点出现：typo、english-spelling、pinyin-mix、code-switch-slip、speech-error、keyboard-slip、mild-gibberish。接入后仍维持 message burst 7 个 Conversation、真实 correction 14 个节点。Choice Kind 为 semantic 785、expression 29、convergent 31；真实 sample issue 仍为 8 类，未把语音、引用他人错误或另一台 AI 错误计为 Aster Model Error。

## 8. Scheduler / Replay / 主线

Scheduler 继续使用 soft weighting。本轮只增加 Longform 的轻量惩罚：同一 Run 已有 Longform 时降低后续 Longform 分数，最近两 Run 出现过的 Longform 也降低分数；没有建立“每局必须有 Longform”的硬规则。5-run Replay 测试保持 0 previous-run overlap，recent-2 overlap 为 0，recent-3 只出现自然的 3/4 次重复；10-run density snapshot 每局 21 个 ordinary，topics 10，patterns 16。主线 5 个 Anchor、顺序、#0000 与岑遥 Ending 均未改变。

## 9. 仍然存在的缺口

- 用户身份仍缺更明确的老年本人、小孩本人和非母语用户正式进入；相关 Reserve 已留下候选。
- 正式池仍偏 troubleshooting（19）和 social-boundary（12），后续应优先扩充普通信息查询、生活工具和低冲突任务。
- Longform 已覆盖六种形态，但 Code、Speech、Reading Notes 和问卷 Analysis 仍未进入；后续应以实际分布需要决定，而非按候选清单消费。
- image-only 与 generated-image 仍有相邻内容，下一轮必须证明新增的是新体验而不是新 Demo。

## 10. 最终人工问题

- **A：真正新增了多少不同体验？** 19 个独立 Conversation 加 2 个合并结构；其中最明显的新体验来自家庭数字生活、小店经营、社区核实、语音/乱码输入、Recurring、Non-task 和六种 Longform 输出形态，而不是 21 个新 ID 本身。
- **B：单独看很好但被 Reserve？** PL01-01、PL01-07、PL01-09、PL01-14、FI08、CM01-12、CM01-13、LF01-02/06/07/08 等，原因是当前分布密度与竞品强度，不是质量否定。
- **C：修改后变得值得使用？** PL01-02、PL01-06、PL01-12、PL01-17、FI13、CM01-18，以及六个 Longform 接入适配；主要修正了输入 metadata、风险边界、心理化措辞和长回复契约。
- **D：前一轮精选后仍 Reject？** FI02、CM01-06、CM01-08；它们分别撞技术排障、头像生成和作者化拼接，最终修复成本不值得。
- **E：Longform 是否像正常 AI 能力？** 是。它被分散在作文、数学、故事、纪要、翻译和决策比较中，且有澄清 Choice、短摘要和不生成分支，不形成独立模式。
- **F：连续玩三局是否更难预测？** 代码级 Replay 快照显示 19 类 Interaction Pattern、10 个 Topic Category、前两 Run 0 exact overlap；普通用户仍不能仅凭上一局推断下一位用户的输入形状。浏览器人工走读结果需以本轮末尾记录为准。

## 11. 验证记录

- `npm test -- --run`：通过，21 个测试文件、122 个测试通过。
- `npm run build`：通过；Vite 仅报告现有 bundle size warning（压缩后 JS 约 617 kB），不是构建失败。
- `runtimeRealityPass`：通过；98 Conversation / 226 Node / 845 Choice 快照。
- `crossRunAudit`：通过；5-run Replay 与 10-run density audit 通过。
- `selectedExpansion01.test.ts`：通过；P1 25、P2 9、普通独立接入 15、FI06/FI13 Merge 边界通过。
- `longformOutput01.test.ts`：通过；6 个 Longform、4 个 Reserve、50 个真实预览、keyFacts/structure 完整、无硬性 Longform 配额。
- Storage migration、Arc、Ending、Hybrid Ending、Stable checkpoint：由全套既有测试覆盖并通过。
- 浏览器：已完成本地真实走读。桌面端走到普通新增资产（儿子问身体、奶奶验证码、爸爸账号、另一台 AI、语音、Non-task、FI06）并进入 Longform 翻译；选择 Longform 后出现单一折叠卡片，后续节点正常，DOM 不含 `KeyFacts`，控制台错误为 0。刷新（去除 `qaRun` 强制新局参数）后恢复 2 张已持久化 Longform 卡片；390×844 下 `scrollWidth == clientWidth == 390`、`scrollHeight == clientHeight == 844`，无横向溢出，卡片仍存在，控制台错误为 0。Reduced Motion 由既有组件测试覆盖，未在浏览器中切换系统级媒体设置。

所有未接入候选仍保留在候选资产中，没有因为本轮不使用而删除。原始三库也未删除或注册进正式 Runtime。
