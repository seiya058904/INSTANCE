# INSTANCE 150 正式资产最终整合执行

项目路径：

`D:\xia zai\AI project\INSTANCE`

先读取：

- `docs/editorial-review-2026-08-10/INSTANCE_asset_editorial_review_bundle.md`
- `docs/editorial-review-2026-08-10/INSTANCE_asset_editorial_index.md`
- `INSTANCE_150_asset_editorial_master_review.md`（用户会把本文件提供给你或放回项目）

这轮不再重新做一遍“哪些资产好不好”的自由审计。

外部 Editorial Review 已完成全部 188 个库存单位的复核，并给出最终 150 席位方案。

你的职责是：

> 按该 Editorial Decision 做工程实现、必要精修、Runtime 接入、回归验证和最终 census。

## 目标口径

最终要求：

- 作者源级正式覆盖：**150**
- Reserve：**19**
- Reject：**7**
- Authored Unique Source Assets：仍为 **176**
- Code-only / Legacy：仍单独统计，不并入150
- Mainline Anchor：5，不改顺序/数量
- Merge-only：FI06、FI13继续保持，不为了凑数字拆成独立 Runtime ID

数量路径：

`105 current formal - 3 demotions + 48 promotions = 150`

不要把“150”改解释成 150 个普通 Runtime ID。

## 一、从正式池降为 Reserve：3

- `batch03:05` 猫凌晨四点准时开会
  - 与 `batch02:01` 的“猫凌晨叫醒→人类反应形成强化”实质重复。
- `batch02:18` 空调关了以后为什么还会“啪”
  - 与冰箱/暖气异响簇过近，独特性最低。
- `humor01:H11` 鱼没有耳朵所以听不见我骂它
  - 属于旧式“荒诞前提+认真科普”Humor，且动物/鱼类轻幽默已足够。

只退出正式抽取，不删除源文件。

## 二、晋升 48 个现有资产

### Batch03（10）

- batch03:16
- batch03:17
- batch03:18
- batch03:19
- batch03:20
- batch03:21
- batch03:22
- batch03:23
- batch03:24
- batch03:25

### Humor（5）

- humor01:H08
- humor01:H12
- humor01:H16
- humor01:H23
- humor01:H25

### People / Life（11）

- PL01-01
- PL01-05
- PL01-07
- PL01-08
- PL01-09
- PL01-10
- PL01-13
- PL01-14
- PL01-15
- PL01-18
- PL01-19

### Friction / Input（8）

- FI01
- FI07
- FI08
- FI09
- FI12
- FI15
- FI17
- FI19

### Continuity / Multimodal（10）

- CM01-01
- CM01-02
- CM01-07
- CM01-12
- CM01-13
- CM01-14
- CM01-15
- CM01-16
- CM01-19
- CM01-20

### Longform（4）

- LF01-02
- LF01-06
- LF01-07
- LF01-08

不创建新 Conversation。现有库存足够达到150。

## 三、正式资产中必须精修：7

### PL01-02

把“她说了前面六位”改成无歧义的“六位验证码里说了前四位”或等价自然表述。

不要改变诈骗处理主结构。

### CM01-18

降低心理咨询式过度解释。

尤其避免把坏计时器直接解释成“有没有资格放下”等深层结论。

保留：

物件 → 想起父亲修东西 → 今天不收桌子

这个自然离题结构。

### LF01-03

当前用户只说“答案知道是3”，却有多个 Choice 直接生成完整推导，这是不成立的。

改为：

- 在 User 输入中给出一个真实、短、答案确实为3的方程；
- 后续“第4步为什么能合并”必须对应真实 metadata；
- 不得反推一个不存在的题目。

### LF01-04

“续写1500字”必须有真实来源。

可以使用下述 LongInputPreview 能力保存一段折叠前文/人物约束，不能凭空假定此前剧情。

### LF01-05

会议转写必须真实存在于结构化长输入 metadata。

预算未定、老板说“差不多就这样”等后续引用必须来源于该 metadata。

### LF01-09

英文长邮件必须有真实长输入摘要。

`we appreciate your patience` 必须确实存在于源输入 metadata。

### LF01-10

第一轮必须至少提供 A/B 的关键事实，或先进入澄清。

不能在两个方案完全未知时直接生成 1400 字比较。

## 四、晋升前需要小修的资产

### PL01-08

保留 freelancer 身份。

强化：

- 原报价包含两轮修改
- 新增“重做构图”属于 scope change
- 后续费用与范围二选一

不要写成普通“同事越界”场景。

### PL01-10

只做合同白话解释/风险识别。

不要判断当地法律效力。

涉及：

- 定金
- 退租
- 押金
- 维修责任

必须保留地域和法律不确定性。

### PL01-18

保持非诊断。

重点：

- 明早孩子
- 交通安全
- 替代接送
- 最低限度安排

不要变成失眠治疗。

### PL01-19

不要把聊天约定直接写成法律结论。

重点仍为：

- 已完成交付
- 尾款
- 原片范围
- 书面确认

需要法律追偿时只建议当地专业渠道。

### FI07

这是必须修的结构问题。

当前：

用户要求“只回一个词”，
但无论玩家选了真正一词回复还是违规长回复，
下一节点都会说：

“你刚才那个不算一个词”。

这会造成剧情不一致。

修成 Choice-dependent continuation：

- 满足“一词”约束的 Choice → 自然结束或进入“好”式 Convergent 收束；
- 违反格式的 Choice → 才进入用户纠错节点。

不要为了展示 Model Error 强迫所有玩家先犯错。

### LF01-02 / LF01-06 / LF01-07 / LF01-08

全部遵守下面的 Long Input 真实性规则。

## 五、增加最小 Long Input Preview 能力

现有 Longform Output Preview 只解决了“AI回答很长”。

但以下真实AI使用还需要：

- 用户贴一百多条问卷
- 用户贴会议转写
- 用户贴长文章
- 用户贴英文长邮件
- 用户给一大段代码规格/上下文

当前用户消息显示长度有限，因此不能真的把数千字铺在聊天里。

实现一个与 Longform Output 对称、但尽量轻量的用户侧折叠结构。

名称可以调整，例如：

```ts
interface LongInputPreview {
  kind:
    | 'pasted-text'
    | 'transcript'
    | 'article'
    | 'email'
    | 'spec'
    | 'dataset-summary'

  estimatedLength: string
  title?: string

  // 玩家可见
  preview: string
  structure?: string[]

  // continuity only
  keyFacts: string[]
}
```

要求：

- 玩家看到类似：
  `[已粘贴长文本 · 约 7,800 字 · 已折叠]`
- 可以展开真实 preview / structure；
- `keyFacts` 不直接显示为开发字段；
- 后续 User 只能引用已经在 long-input metadata 里保存的事实；
- 不存在任何“虚构的完整长输入”；
- 没有 metadata 的细节禁止后续凭空出现；
- 存档恢复兼容；
- Reduced Motion 无特殊等待；
- 不因为 estimatedLength 增加输入或输出等待时间。

优先让以下资产使用它：

- LF01-04
- LF01-05
- LF01-09
- LF01-02
- LF01-06
- LF01-07
- LF01-08

LF01-03 和 LF01-10 优先直接补足短文本事实，不必强行走 LongInput。

## 六、最终 Reserve：19

保持/调整为 Reserve：

- batch03:05
- batch02:18
- humor01:H11
- CM01-03
- CM01-05
- CM01-06
- CM01-08
- CM01-17
- FI02
- FI04
- FI10
- FI16
- FI18
- FI20
- PL01-11
- PL01-20
- humor01:H07
- humor01:H13
- humor01:H20

其中：

- CM01-03 因 `original:media-window` 高度相似；
- CM01-05 因 `original:generate-poster`；
- CM01-06 因 `original:generate-avatar`。

不要删除。

## 七、最终 Reject：7

- CM01-04
- FI05
- humor01:H02
- humor01:H05
- humor01:H14
- humor01:H17
- humor01:H22

Reject 也保留源文件，不删除。

## 八、Code-only / Legacy

12 个继续单独统计。

不要把它们偷偷算入150。

重点：

- `original:media-window` 与 CM01-03 高相似，所以 CM01-03 不晋升。
- `original:generate-avatar` 与 CM01-06 竞争。
- `original:generate-poster` 与 CM01-05 竞争。
- `legacy:dev-help` 与 humor H17 / FI05 重复，所以后两者不进入正式内容。

本轮不要求重构 legacy。

如果发现某个 code-only 实际已经被普通 Scheduler 正式抽取：

只在最终 census 中把“Runtime definition count”讲清楚，
不要自行改变 150 个作者源覆盖口径。

## 九、Choice / Arc / Runtime 规则

所有新接入资产：

- 重新生成/审计 Arc effects；
- 禁止 choiceIndex → personality；
- Expression 保持战略中性；
- Convergent / literal identical 不得暗中产生不同大效果；
- Model Error 只在文本真的犯错时标记；
- 不因“错误输入”自动把正常回复标成 Model Error；
- 不让 Choice 1 重新成为默认最完整答案。

Scheduler 只做 soft weighting。

建议新增：

- Longform连续密度惩罚；
- generated-image 连续密度惩罚；
- AI friction 连续密度惩罚；

不要设“每局必须出现X个”。

## 十、主线

5个 Anchor：

- 不删除
- 不增减
- 顺序不改
- #0000不改职责
- 岑遥不改核心剧情
- Ending / Hybrid Ending 不因150扩容重写

只检查普通内容增多后间隔是否仍自然。

## 十一、最终 census

实现完成后重新生成资产 census。

目标应满足：

```text
Authored Unique Source Assets = 176

Formal source coverage = 150
Reserve = 19
Reject = 7

150 + 19 + 7 = 176
```

Formal source coverage 150 应由：

- 独立正式 Runtime 源资产
- 2 个 Merge-only 已使用源资产
- 5 个 Mainline Anchor

共同构成。

不要把 code-only / legacy 加入176或150。

普通 Runtime Definition 数量预计会发生变化，
以实际代码扫描为准，
不要为了让某个预估数字好看而制造空 Conversation。

## 十二、回归测试

至少执行：

```text
npm test -- --run
npm run build
```

并覆盖：

- asset census
- Runtime Reality
- content diversity
- scheduler
- 10+ manifest
- 5-run replay
- exposure history
- semantic arc
- ending reachability
- hybrid ending
- storage migration
- streaming
- reduced motion
- Longform Output
- Long Input Preview
- multimodal
- generated-image
- mobile 390×844

浏览器至少定向走：

1. 新 Batch03 普通资产
2. 新 People/Life
3. 新 Friction
4. 新 Continuity
5. 新 generated-image / multimodal
6. 新 Longform + LongInput
7. 一个原有 Mainline Anchor

LongInput E2E 至少验证：

`折叠长用户输入 → Aster回答 → 后续用户引用 keyFact → 刷新恢复`

且 keyFacts 不以开发标签进入 UI。

## 十三、最终报告

创建：

`../../audits/INSTANCE_150_runtime_final_integration_audit_2026-08-10.md`

报告：

- 实施前105
- 降级3
- 晋升48
- 最终150
- 每个晋升资产最终 Runtime ID
- 每个精修资产具体改了什么
- 19 Reserve
- 7 Reject
- 12 code-only/legacy
- LongInput能力实现
- Longform修复
- Runtime definition最终数量
- Node / Candidate Reply最终数量
- Topic / InteractionPattern / User Type变化
- Replay变化
- 测试
- Build
- Browser
- 已知限制

如果任何一个数量无法达到：

不要偷偷换候选。

先报告具体原因以及受影响ID。

## 十四、Git

如果目录仍不是Git：

写：

`Git: N/A — directory is not a Git repository`

不要初始化Git。

---

本轮的核心不是“再创作45个”。

而是：

> 从现有188库存中，重新整理出150个真正值得正式使用的作者源资产。

外部编辑结论是：**现有库存已经足够，不需要新创作。**
