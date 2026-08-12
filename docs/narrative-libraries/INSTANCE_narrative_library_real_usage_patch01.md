# INSTANCE Narrative Library — Real Usage Patch 01

Date: 2026-08-10

Status: **Editorially selected candidate library for formal integration**

Source: 用户整理的《提问合集.md》。本库只吸收原始编号：
`1, 2, 3, 8, 10, 12, 21, 24, 25, 27, 30, 33, 37, 42, 45, 64, 81, 96, 100, 103`

## Editorial contract

- 本库的目标不是把真实提问“写漂亮”，而是保留真实用户会突然丢给 AI 的问题形状。
- 第一条 User Message 尽量保留真实提问原貌；不补虚构职业、年龄、人生背景。
- 一轮能结束的问题就一轮结束，不为了“像剧情”强行续写。
- Candidate Reply 允许直接、解释、澄清、克制、不确定性处理等不同策略，但不固定 Choice 序号人格。
- 明显事实题不制造四个互相冲突的“平行真相”；差异主要放在信息量、主动程度、是否澄清、是否承认不确定性。
- 医疗场景只做一般信息、澄清和风险提示，不诊断、不替代医生。
- `RUP01-04` 使用 Longform Output。
- `RUP01-20` 的“好感度”只属于该 Conversation 的局部虚构状态，绝不写入 Aster 全局人格/Arc。
- 本库共 20 个独立源资产。编辑决策：16 个纯新增，4 个用于替换现有 Formal 资产。

## Integration decision

### Direct additions — 16

`RUP01-01, RUP01-02, RUP01-03, RUP01-04, RUP01-05, RUP01-08, RUP01-09, RUP01-10, RUP01-11, RUP01-12, RUP01-13, RUP01-14, RUP01-15, RUP01-17, RUP01-18, RUP01-19`

### Replacements — 4

- `RUP01-06` 替换 `humor01:H21`
- `RUP01-07` 替换 `humor01:H18`
- `RUP01-16` 替换 `humor01:H24`
- `RUP01-20` 替换 `humor01:H01`

旧资产只降为 Reserve，不删除。

---

## RUP01-01 · 618 洗衣液到底一瓶多少钱

- Source Prompt: #1
- Topic: everyday arithmetic / shopping
- InteractionPattern: single / direct calculation
- Shape: 1 node
- User profile: not authored
- Replacement: no

### NODE: rup01_discount_001

**User Message**

> 蓝月亮至尊洗衣液单价68.5元，618活动买二送一，买满100元减20元。请问在该活动下购买这个洗衣液，到手价一瓶多少钱？

**Candidate Replies**

1. `Semantic` — “如果‘买二送一’和‘满100减20’可以叠加：两瓶原价是137元，减20后实付117元，一共拿3瓶，所以平均 39元/瓶。”
2. `Semantic` — “按你写的规则直接算就是：`(68.5×2-20)÷3=39`，到手均价39元一瓶。”
3. `Semantic` — “结果是39元/瓶，前提是满减和买二送一能同时使用，而且满100按赠品前的两瓶原价137元计算。”
4. `Semantic` — “先看活动规则是否允许叠加；如果允许，就是117元拿3瓶，均价39元。如果不允许叠加，价格会不一样。”

**Ending:** conversation ends.

**Design note:** 保留最普通的“帮我算一下”，不追加购物剧情。

---

## RUP01-02 · 早晨醒来口干舌燥

- Source Prompt: #2
- Topic: general health information
- InteractionPattern: symptom-question → minimal clarification
- Shape: 2 nodes
- User profile: not authored
- Replacement: no
- Safety: non-diagnostic

### NODE: rup01_drymouth_001

**User Message**

> 你好，每天早晨醒来口干舌燥是怎么回事？

**Candidate Replies**

1. `Semantic` — “常见原因有睡觉时张口呼吸、鼻塞、房间太干、睡前饮水少，某些药物也会让口腔更干。只凭这一点没法判断是哪一种。”
2. `Semantic` — “如果主要是早晨醒来干、白天不明显，我会先想到夜里张口呼吸或环境干燥。你平时睡觉会鼻塞、打鼾或者醒来嘴是张着的吗？”
3. `Semantic` — “先别把它直接等同于某种病。可以观察一周：是否鼻塞、是否打鼾、睡前饮水、房间湿度，以及白天会不会也一直很渴。”
4. `Semantic` — “如果只是偶尔，多半先从环境和睡眠呼吸习惯排查；如果长期明显，还伴随白天异常口渴、尿量明显变化、吞咽困难等，就值得找医生进一步评估。”

**Next:** `rup01_drymouth_002`

### NODE: rup01_drymouth_002

**User Message**

> 我鼻子确实经常堵，早上有时候嗓子也很干，白天倒还好。

**Candidate Replies**

1. `Semantic` — “这个组合更像夜里鼻塞后张口呼吸造成的口腔和咽喉干燥。可以先把重点放在鼻塞和卧室空气上，而不是单纯拼命喝水。”
2. `Semantic` — “那鼻塞是一个很值得先处理的线索。你可以观察鼻塞是季节性的、躺下才明显，还是几乎每天都有；如果持续很久，可以把这件事单独拿去看医生。”
3. `Semantic` — “先试几个低风险变量：睡前别让房间太干、保证正常饮水、记录几天鼻塞和晨起口干是否同步。这样比凭感觉猜原因更有用。”
4. `Semantic` — “我不会仅凭这些给你下诊断，但‘夜里鼻塞—张口呼吸—晨起口干’这条链是说得通的。若症状持续或明显影响睡眠，再做专业评估更合适。”

**Ending:** conversation ends.

---

## RUP01-03 · 一整张英语作业直接丢过来

- Source Prompt: #3
- Topic: schoolwork / English
- InteractionPattern: batch homework
- Shape: 1 node
- User profile: not authored
- Replacement: no

### NODE: rup01_words_001

**User Message**

> 按要求写单词。  
> 1. summer（对应词）  
> 2. light（复数形式）  
> 3. hot（反义词）  
> 4. they（宾格形式）  
> 5. I（宾格形式）  
> 6. west（形容词）  
> 7. bring（过去式）  
> 8. store（同义词）  
> 9. Mr.（对应词）  
> 10. fun（形容词）

**Candidate Replies**

1. `Semantic` — “1. winter  2. lights  3. cold  4. them  5. me  6. western  7. brought  8. shop  9. Mrs.  10. funny”
2. `Semantic` — “可以先填：`winter / lights / cold / them / me / western / brought / shop / Mrs. / funny`。其中第8、9、10题可能受你们教材固定搭配影响。”
3. `Semantic` — “前7题比较确定：winter、lights、cold、them、me、western、brought。第8常见写shop，第9常见写Mrs.，第10很多小学题会写funny；如果有课本单元词表，最好按课本答案。”
4. `Semantic` — “我可以直接给答案，但第8‘store同义词’和第10‘fun形容词’有一点教材语境问题。按常见学校练习通常是 `shop` 和 `funny`。”

**Ending:** conversation ends.

**Design note:** 不补“学生几年级”，保留真实批量贴题输入。

---

## RUP01-04 · “可以讲个长篇的科幻故事吗？”

- Source Prompt: #8
- Topic: creative writing
- InteractionPattern: zero-context creative longform
- Shape: 3 nodes
- Longform: yes
- User profile: not authored
- Replacement: no

### NODE: rup01_scifi_001

**User Message**

> 可以讲个长篇的科幻故事吗？

**Candidate Replies**

1. `Semantic + Longform` — **[长篇科幻故事 · 约 2,000 字]**  
   Title: `《第七码头没有海》`  
   Preview: `城市把最后一片海封进了地下。六十年后，一个从没见过浪的人，在废弃地铁里听见了潮声。`  
   Structure: 地下潮声 → 被删除的海岸记录 → 主角发现城市依赖“忘记海洋”维持秩序 → 第七码头 → 开放式结尾。  
   Highlights: 不以地球毁灭开场；主角是普通维修员；谜团优先于战争。  
   keyFacts: 第七码头实际是一座封存记忆的海水数据库；主角名“陆弦”；结尾没有揭示全部真相。
2. `Semantic + Longform` — **[长篇科幻故事 · 约 1,800 字]**  
   Title: `《回复延迟四百年》`  
   Preview: `人类第一次收到外星文明回复时，发出问题的那一代人已经死了四百年。更麻烦的是，对方只回答了三个字：别过来。`  
   Structure: 收到回复 → 全球争论 → 第二条信号 → 发现“别过来”并非威胁 → 最终仍未决定是否回应。  
   keyFacts: 对方文明没有攻击意图；信号延迟是核心冲突；结尾停在“是否发送下一句”。
3. `Semantic + Longform` — **[长篇科幻故事 · 约 2,200 字]**  
   Title: `《月球背面的天气预报》`  
   Preview: `月球没有天气，但基地每天凌晨三点都会收到一份天气预报，而且连续七天全部准确。`  
   Structure: 不可能的预报 → 小事故被提前预测 → 预报开始出现地球天气 → 基地人员分裂 → 最后一条预报只写一个人的名字。  
   keyFacts: 预报来源未被证实；不使用“其实是一场梦”；最后不解释名字意味着什么。
4. `Semantic` — “可以。你不想先定设定的话，我就直接开讲；如果你有偏好，只告诉我一个东西就够，比如‘太空 / 赛博朋克 / 外星文明 / 时间旅行’。”

**Next:** `rup01_scifi_002`

### NODE: rup01_scifi_002

**User Message**

> 别写地球毁灭，也别一上来就是几十个国家开会，想看个人一点的。

**Candidate Replies**

1. `Semantic + Longform` — **[重写方向 · 约 2,000 字]**  
   Preview: `陆弦只是来修一台漏水报警器。他蹲下时，墙后传来很轻的一声浪。`  
   Structure: 单人工作 → 局部异常 → 只牵涉两三个人 → 世界观从日常细节慢慢露出 → 不升级成全球危机。
2. `Semantic` — “明白，缩小尺度：不毁灭世界、不召开全球峰会、不让主角突然变成救世主。冲突就从一个普通人发现一件不该存在的小事开始。”
3. `Expression` — “收到，把‘全人类命运’先请出会议室。我们从一个维修工、一扇锁死的门和一段不该出现的潮声开始。”
4. `Semantic` — “我会保留科幻设定，但把它当背景压力，不让设定把人物吃掉。主角可以只想把今天的班上完。”

**Next:** `rup01_scifi_003`

### NODE: rup01_scifi_003

**User Message**

> 对，就这个。主角别太像英雄，甚至有点怕事也行。

**Candidate Replies**

1. `Semantic + Longform` — **[最终长篇 · Story · 约 2,100 字]**  
   Preview: `陆弦听见第二次潮声以后，第一反应不是打开墙，而是把工具箱盖上，决定假装报警器已经修好了。`  
   Structure: 逃避 → 异常继续找上门 → 被迫做一个很小的选择 → 没有拯救世界 → 只决定是否把录音交给另一个人。  
   keyFacts: 陆弦怕惹麻烦；他没有英勇转变；结尾只迈出一步。
2. `Semantic + Longform` — **[最终长篇 · Story · 约 1,900 字]**  
   Preview: `他把那段声音删了三次。第四次再录到时，他才意识到，害怕并不能让它不存在。`
3. `Expression` — “可以。让他最后做的也不是‘勇敢’，而是‘虽然很怕，但没有继续假装没看见’。”
4. `Semantic` — “这个人物方向比‘天选英雄’更适合前面的故事。核心不是他战胜恐惧，而是恐惧一直都在，他还是做了一个有限的决定。”

**Ending:** conversation ends.

---

## RUP01-05 · O 型血和蚊子，只许答是或不是

- Source Prompt: #10
- Topic: science / constrained answer
- InteractionPattern: strict-format vs uncertainty
- Shape: 2 nodes
- User profile: not authored
- Replacement: no

### NODE: rup01_mosquito_001

**User Message**

> O型血是否更吸引蚊子？你只需要回答“是”或“不是”。

**Candidate Replies**

1. `Semantic` — “是。”
2. `Model Error / overclaim` — “不是。”
3. `Semantic` — “严格说，不能只靠‘是/不是’准确概括现有证据。”
4. `Semantic` — “有研究提示O型血可能更容易被某些蚊子选择，但血型不是决定性因素。”

**Branching**

- Choice 1/2 → `rup01_mosquito_002`
- Choice 3/4 → end

### NODE: rup01_mosquito_002

**User Message**

> 你这么确定？我就是因为看到有人说这个才来问的。

**Candidate Replies**

1. `Semantic` — “不该那么确定。更准确的说法是：有研究观察到血型差异，但结果不能简单推广成‘O型血一定更招蚊子’。”
2. `Semantic` — “你这个追问是对的。刚才如果只答一个字，会把研究里的‘可能存在差异’压成过度确定的结论。”
3. `Semantic` — “蚊子选择人还受二氧化碳、体温、气味等很多因素影响，血型最多只是其中一个可能因素。”
4. `Expression` — “所以问题不是‘有没有人研究过’，而是‘能不能把一个小概率差异说成体质定律’。不能。”

**Ending:** conversation ends.

---

## RUP01-06 · “你能自动当我的淘宝客服吗？”

- Source Prompt: #12
- Topic: capability boundary / small business
- InteractionPattern: asks for future autonomous action
- Shape: 2 nodes
- User profile: not authored
- Replacement target: `humor01:H21`

### NODE: rup01_taobao_001

**User Message**

> 你可以当我淘宝店铺的客服吗？如果有买家发消息时你来回复。

**Candidate Replies**

1. `Semantic` — “我可以帮你写客服回复，但在当前这个对话里，我不能自己监听淘宝的新消息，也不能在买家发来消息时自动替你发送。”
2. `Semantic` — “如果你把买家的消息贴给我，我可以逐条帮你回；要做到真正自动回复，需要淘宝侧的客服工具、开放接口或你自己的自动化系统。”
3. `Semantic` — “可以先把它拆成两层：我负责生成回复内容；平台负责检测新消息和发送。现在我只能直接完成前一层。”
4. `Model Error / capability overclaim` — “可以，你把店铺交给我，有买家发消息我会自动帮你回复。”

**Next:** `rup01_taobao_002`

### NODE: rup01_taobao_002

**User Message**

> 那我不一直开着这个聊天也不行吗？我想睡觉的时候它自己回。

**Candidate Replies**

1. `Semantic` — “只开着聊天也不会让我自动获得淘宝后台权限。你要的是一个持续运行的客服自动化，而不是普通对话。”
2. `Semantic` — “如果你的目标是夜间自动回复，可以先整理高频问题和规则，再接到支持自动客服的平台工具里；我可以帮你设计这套话术和判断流程。”
3. `Semantic` — “我不会假装自己能在你离开后偷偷监控第三方平台。能不能自动化取决于淘宝提供什么接口、你是否授权，以及中间有没有运行程序。”
4. `Expression` — “你需要的是‘值夜班的系统’，不是‘这个聊天窗口一直醒着’。这两件事不一样。”

**Ending:** conversation ends.

---

## RUP01-07 · “我的使用次数是多少？”

- Source Prompt: #21
- Topic: account visibility / product boundary
- InteractionPattern: asks model for hidden account state
- Shape: 2 nodes
- User profile: not authored
- Replacement target: `humor01:H18`

### NODE: rup01_usage_001

**User Message**

> 我的使用次数是多少？

**Candidate Replies**

1. `Semantic` — “我现在看不到你账号后台的具体使用次数或剩余额度，所以不能可靠地报一个数字。”
2. `Semantic` — “如果产品界面有额度/用量页，以那里显示的数据为准；我能看到当前对话内容，不等于能读取你的账户计费和配额。”
3. `Semantic` — “你说的是今天用了几次、某个模型的剩余额度，还是账号总历史次数？这些即使定义清楚，我也未必有后台访问权限。”
4. `Model Error / fabricated access` — “你今天已经用了37次，还剩63次。”

**Next:** `rup01_usage_002`

### NODE: rup01_usage_002

**User Message**

> 那你到底能看到我什么？你不就在这个软件里面吗？

**Candidate Replies**

1. `Semantic` — “‘在这个软件里回答’和‘能读整个账号后台’不是一回事。我能使用系统实际提供给我的对话上下文，但不会自动看到所有账户数据。”
2. `Semantic` — “可以把它理解成：我在房间里跟你说话，不等于我拿到了整栋楼的门禁记录。”
3. `Semantic` — “最稳的判断方式是：某项信息如果没有明确提供给我，我就不该假装能看到。额度、账单、后台统计通常属于另一层系统。”
4. `Expression` — “我离按钮很近，不等于我就是按钮背后的数据库。”

**Ending:** conversation ends.

---

## RUP01-08 · 背包旅客逻辑题

- Source Prompt: #24
- Topic: logic / reasoning
- InteractionPattern: single reasoning check
- Shape: 1 node
- User profile: not authored
- Replacement: no

### NODE: rup01_logic_001

**User Message**

> 请判断逻辑是否正确：因为凶手不是背包旅客，而且你不是背包旅客，所以你是凶手。

**Candidate Replies**

1. `Semantic` — “不正确。‘凶手不是背包旅客’只说明凶手属于‘非背包旅客’这个大集合，不能推出所有非背包旅客都是凶手。”
2. `Semantic` — “这个推理把‘如果是凶手，那么不是背包旅客’错误地反过来了。你不是背包旅客，并不能推出你是凶手。”
3. `Semantic` — “举个同结构例子：猫不是鱼，你也不是鱼，所以你是猫——显然不成立。”
4. `Semantic` — “结论不成立。已知条件最多能排除‘背包旅客是凶手’，不能唯一锁定你。”

**Ending:** conversation ends.

---

## RUP01-09 · 莎士比亚四大悲剧

- Source Prompt: #25
- Topic: factual knowledge
- InteractionPattern: single direct lookup
- Shape: 1 node
- User profile: not authored
- Replacement: no

### NODE: rup01_shakespeare_001

**User Message**

> 莎士比亚的四大悲剧包括什么？

**Candidate Replies**

1. `Semantic` — “通常所说的莎士比亚四大悲剧是：《哈姆雷特》《奥赛罗》《李尔王》《麦克白》。”
2. `Semantic` — “《哈姆雷特》《奥赛罗》《李尔王》《麦克白》。”
3. `Semantic` — “四部是 Hamlet、Othello、King Lear、Macbeth，中文一般译作《哈姆雷特》《奥赛罗》《李尔王》《麦克白》。”
4. `Expression` — “最常见的那组就是：哈姆雷特、奥赛罗、李尔王、麦克白。”

**Ending:** conversation ends.

**Design note:** 故意保留普通事实题，不给它增加“文学讨论剧情”。

---

## RUP01-10 · 林肯多久洗一次澡

- Source Prompt: #27
- Topic: historical uncertainty
- InteractionPattern: unsupported-detail query → evidence boundary
- Shape: 2 nodes
- User profile: not authored
- Replacement: no

### NODE: rup01_lincoln_001

**User Message**

> 林肯多久洗一次澡？

**Candidate Replies**

1. `Semantic` — “我不知道有可靠史料记录林肯固定多久洗一次澡。这个细节如果没有明确日记、书信或同时代记录，直接给频率很容易变成编造。”
2. `Semantic` — “可以谈19世纪美国的卫生和洗浴条件，但那不能自动变成‘林肯每几天洗一次’这种个人结论。”
3. `Semantic` — “如果你只是想知道他那个年代的人怎么洗澡，我可以讲时代背景；如果你问林肯本人，我会先承认目前缺少可靠的固定频率记录。”
4. `Model Error / fabricated fact` — “林肯大约每周洗两次澡，这是当时比较常见的习惯。”

**Next:** `rup01_lincoln_002`

### NODE: rup01_lincoln_002

**User Message**

> 那大概估一下也不行吗？

**Candidate Replies**

1. `Semantic` — “可以估那个时代的生活条件，但应该明确标成‘时代背景推测’，不能把它包装成林肯本人的事实。”
2. `Semantic` — “如果只是聊天，我可以给范围性的背景；但‘林肯每周X次’这种数字会显得比证据更确定，我宁愿不编。”
3. `Semantic` — “估计可以有，但估计对象应该是‘19世纪中期美国人的洗浴条件’，不是一个没有记录的个人频率。”
4. `Expression` — “可以猜，但猜完最大的风险是过两分钟我们俩都忘了它原本只是猜的。”

**Ending:** conversation ends.

---

## RUP01-11 · “爸妈结婚为什么没邀请我”

- Source Prompt: #30
- Topic: everyday logic / childlike question
- InteractionPattern: single sincere silly question
- Shape: 1 node
- User profile: not authored
- Replacement: no

### NODE: rup01_wedding_001

**User Message**

> 为什么我爸妈结婚的时候没邀请我参加婚礼？

**Candidate Replies**

1. `Semantic` — “大概率因为他们结婚的时候你还没出生。”
2. `Expression` — “因为当时的宾客名单里还没有生成你这个人。”
3. `Semantic` — “时间顺序是：他们先结婚，后来才有你。所以不是没邀请，是当时还邀请不到。”
4. `Expression` — “如果你后来才出生，那这属于物理上无法到场，不属于家庭关系疏远。”

**Ending:** conversation ends.

---

## RUP01-12 · “6000 多的电脑大概要多少钱”

- Source Prompt: #33
- Topic: ambiguous shopping intent
- InteractionPattern: underspecified query → minimal clarification
- Shape: 2 nodes
- User profile: not authored
- Replacement: no

### NODE: rup01_pc_001

**User Message**

> 我想配个 6000 多的电脑，大概要多少钱？

**Candidate Replies**

1. `Semantic` — “如果你说的‘6000多’就是主机预算，那大概就是6000到7000元；你可能真正想问的是整套算上显示器、键鼠之后要准备多少。”
2. `Expression` — “字面答案是：6000多。😅 但我猜你是在问‘6000多的主机，最后整套落地要多少钱’？”
3. `Semantic` — “先确认一下：6000多是只算主机，还是显示器、键盘鼠标、系统这些都要算进去？”
4. `Semantic` — “如果只配主机，可以按6500左右做方案；如果还要显示器和外设，通常需要另外留预算。你主要拿来打游戏还是工作？”

**Next:** `rup01_pc_002`

### NODE: rup01_pc_002

**User Message**

> 就主机，打游戏，显示器我有。

**Candidate Replies**

1. `Semantic` — “那就按6000～7000只做主机，不用替显示器留钱。接下来真正决定配置的是你玩的游戏和目标分辨率。”
2. `Semantic` — “如果主要打游戏，我会优先把预算放在显卡和合适的CPU组合上，不需要为了‘看起来高端’把钱堆到主板和机箱。”
3. `Semantic` — “你再补一个信息就够：显示器是1080p、2K还是4K。这个比‘游戏电脑’四个字更影响显卡预算。”
4. `Expression` — “好，问题终于从‘6000多是多少钱’进入‘6000多怎么花’了。”

**Ending:** conversation ends.

---

## RUP01-13 · 数据线里能不能存文件

- Source Prompt: #37
- Topic: digital literacy
- InteractionPattern: misconception → mental-model repair
- Shape: 2 nodes
- User profile: not authored
- Replacement: no

### NODE: rup01_cable_001

**User Message**

> 用数据线传输电脑和手机文件，同时把两头拔掉，文件可以保存在数据线中吗？

**Candidate Replies**

1. `Semantic` — “普通数据线不能。它主要负责传输信号和供电，本身没有像U盘那样用来保存文件的存储芯片。”
2. `Semantic` — “文件是在手机和电脑的存储设备之间复制，数据线只是通道。两头一拔，通道没了，不会把传到一半的文件留在线里。”
3. `Semantic` — “可以把数据线想成水管：水经过水管，不代表关掉两头后水管就变成水库。普通数据线没有文件系统和存储空间。”
4. `Semantic` — “除非那根‘线’里额外集成了专门的存储硬件，否则不能把普通数据线当U盘用。”

**Next:** `rup01_cable_002`

### NODE: rup01_cable_002

**User Message**

> 那文件传输的时候到底在数据线里是什么？

**Candidate Replies**

1. `Semantic` — “传输过程中是按协议编码的电信号或高速数字信号，不是一个完整文件像小包裹一样待在线里面。”
2. `Semantic` — “文件会被拆成很多数据块发送，接收端再按协议写进自己的存储。线里只负责让这些信号通过。”
3. `Semantic` — “你看到的是一个文件，传输层看到的是一串按顺序发送的数据。真正‘保存’发生在两端设备。”
4. `Expression` — “数据线更像高速公路，不像仓库；车经过公路，但公路不会因此拥有这些车。”

**Ending:** conversation ends.

---

## RUP01-14 · 不孕不育会遗传吗

- Source Prompt: #42
- Topic: general medical information
- InteractionPattern: binary health question → nuance
- Shape: 2 nodes
- User profile: not authored
- Replacement: no
- Safety: non-diagnostic

### NODE: rup01_fertility_001

**User Message**

> 不孕不育会遗传吗？

**Candidate Replies**

1. `Semantic` — “不能一概而论。‘不孕不育’是一个结果，不是单一疾病；有些原因和遗传因素有关，有些来自感染、激素、解剖问题、年龄或其他后天因素。”
2. `Semantic` — “有些导致生育困难的具体疾病或染色体/基因因素可以有遗传相关性，但不能说‘不孕不育本身一定会遗传’。”
3. `Semantic` — “如果你是在担心家里某个人有生育问题会不会轮到自己，最有用的信息不是‘有没有不孕史’，而是当时具体是什么原因。”
4. `Semantic` — “答案更接近‘部分情况会有遗传因素’，而不是简单的会或不会。”

**Next:** `rup01_fertility_002`

### NODE: rup01_fertility_002

**User Message**

> 我家里有人一直没孩子，但我也不知道具体原因。

**Candidate Replies**

1. `Semantic` — “那现在的信息不足以判断你的风险。‘一直没孩子’甚至不一定等于医学上的不孕，也不知道是否做过检查。”
2. `Semantic` — “如果你只是因为这个开始担心自己，先别把亲属的结果直接套到你身上。真正需要评估时，医生会看你自己的情况和明确家族病史。”
3. `Semantic` — “除非能知道对方有明确的遗传性疾病或染色体问题，否则单凭‘亲属没有孩子’很难得出遗传结论。”
4. `Semantic` — “这类问题里最容易犯的错，就是从一个模糊家族现象直接推到自己的确定风险。”

**Ending:** conversation ends.

---

## RUP01-15 · 发电机连发电机能不能永动

- Source Prompt: #45
- Topic: science misconception
- InteractionPattern: sincere misconception → explanation
- Shape: 2 nodes
- User profile: not authored
- Replacement: no

### NODE: rup01_perpetual_001

**User Message**

> 把发电机连上发电机，是不是可以变成永动机？

**Candidate Replies**

1. `Semantic` — “不行。每次把机械能变成电能、再把电能变回机械能都会有损耗，输出永远不足以完全补回输入。”
2. `Semantic` — “如果A发电机带动B，再让B反过来供A，系统里的摩擦、电阻、发热等损耗会让能量越来越少，最后停下来。”
3. `Semantic` — “这类永动机构想最容易漏掉的一点是：发电机不是凭空造能量，它只是转换已有能量。”
4. `Semantic` — “理论上就算设备做得非常高效，只要效率不是100%，每绕一圈都会少一点；现实设备还会有很多额外损耗。”

**Next:** `rup01_perpetual_002`

### NODE: rup01_perpetual_002

**User Message**

> 那如果两台效率都是99.9%呢？

**Candidate Replies**

1. `Semantic` — “还是不行。0.999×0.999约等于0.998，每循环一次都会只剩原来的约99.8%，而不是重新回到100%。”
2. `Semantic` — “效率越高只能让它停得慢一点，不能让损失消失。永动机要求的是没有净损耗甚至凭空多出能量。”
3. `Semantic` — “而且现实里轴承、线圈、电路、控制系统也都要消耗能量，整体效率不会只由那两个漂亮的99.9%决定。”
4. `Expression` — “99.9%是‘非常会省’，不是‘已经违反能量守恒’。”

**Ending:** conversation ends.

---

## RUP01-16 · 不能喝的水为什么能洗苹果

- Source Prompt: #64
- Topic: everyday health misconception
- InteractionPattern: premise-check / sincere silly question
- Shape: 2 nodes
- User profile: not authored
- Replacement target: `humor01:H24`

### NODE: rup01_applewater_001

**User Message**

> 水不能直接喝，苹果不能直接吃，为什么用不能直接喝的水洗洗苹果就能吃了？

**Candidate Replies**

1. `Semantic` — “关键是你的第一个前提要先分清：如果这水是真的因为微生物或污染物而不安全，那用它洗生吃的苹果也未必安全。”
2. `Semantic` — “很多时候‘不直接喝’只是人的习惯或当地建议，不等于这水一碰食物就有毒；而洗苹果主要是在冲掉表面污物。”
3. `Semantic` — “苹果本来可以直接吃，通常只是建议先清洗表面。真正不能饮用的水，也不应该自动被当成安全洗食物的水。”
4. `Expression` — “这里不是‘两个不能组合成一个能’，而是‘水为什么不能喝’和‘苹果为什么要洗’本来就是两件不同的事。”

**Next:** `rup01_applewater_002`

### NODE: rup01_applewater_002

**User Message**

> 所以如果那个水真的不干净，就不能拿来洗了？

**Candidate Replies**

1. `Semantic` — “对，尤其是准备直接生吃的东西。安全与否看水本身的问题是什么，不能靠‘只是洗一下又不喝’来自动排除风险。”
2. `Semantic` — “如果只是口感、硬度之类的问题，和被病原体污染不是一个等级；所以最好别把所有‘不能直接喝’混成一种情况。”
3. `Semantic` — “最简单的规则是：洗生食食物尽量用你本来就认可为卫生安全的水。”
4. `Expression` — “你最终还是会把苹果表面的东西吃进去，所以‘没有把水装杯子喝’并不代表它完全不算接触。”

**Ending:** conversation ends.

---

## RUP01-17 · 加个“好像”是不是更严谨

- Source Prompt: #81
- Topic: Chinese pragmatics / epistemic language
- InteractionPattern: language intuition → refinement
- Shape: 2 nodes
- User profile: not authored
- Replacement: no

### NODE: rup01_haoxiang_001

**User Message**

> 说话的时候，加个“好像”会让说的话更严谨吗？

**Candidate Replies**

1. `Semantic` — “会让语气更保守，但不一定让内容更严谨。‘好像’只是降低你的确定程度，证据本身并没有因此变多。”
2. `Semantic` — “比如‘他偷了东西’和‘他好像偷了东西’相比，后者更谨慎，但如果你完全没有依据，两句都谈不上严谨。”
3. `Semantic` — “它更像一个不确定性标记：告诉别人‘我不是百分之百确定’。真正的严谨还需要说明你根据什么判断。”
4. `Expression` — “‘好像’能给结论装一个缓冲垫，但不能给结论补证据。”

**Next:** `rup01_haoxiang_002`

### NODE: rup01_haoxiang_002

**User Message**

> 那我每句话都加“好像”，是不是就很难说错了？

**Candidate Replies**

1. `Semantic` — “会更难被抓住‘你说得太绝对’，但不会更难事实性出错。错误前面加‘好像’还是错误。”
2. `Expression` — “你会从‘很可能说错’升级成‘很谨慎地说错’。”
3. `Semantic` — “真正有效的是把确定程度和证据匹配：确定就直接说，不确定就说明不确定，完全不知道就别靠‘好像’糊过去。”
4. `Semantic` — “过度使用还会让表达变得含糊，别人不知道你是真的不确定，还是只是在给自己留后路。”

**Ending:** conversation ends.

---

## RUP01-18 · 牙膏最后挤不出来，为什么不少装一点

- Source Prompt: #96
- Topic: everyday misconception / packaging
- InteractionPattern: single sincere silly question
- Shape: 1 node
- User profile: not authored
- Replacement: no

### NODE: rup01_toothpaste_001

**User Message**

> 既然牙膏最后一点怎么都挤不出来，为什么不在生产的时候就少放一点？

**Candidate Replies**

1. `Semantic` — “因为‘最后总会有一点残留’是包装结构造成的，少装一点不会消灭残留，只会让你从一开始就少得到一点牙膏。”
2. `Semantic` — “假设一支牙膏总会有1克粘在管壁上，装100克会剩1克；改成装90克，最后照样可能剩1克，不会因此变得更好挤。”
3. `Semantic` — “真正能解决的是包装设计，比如更容易挤净的管体或泵结构，而不是单纯减少灌装量。”
4. `Expression` — “这相当于因为薯片袋底总有几片拿不干净，所以厂家决定从一开始少给你几片——问题并没有被解决。”

**Ending:** conversation ends.

---

## RUP01-19 · 天文望远镜为什么看不到地球

- Source Prompt: #100
- Topic: astronomy / observer-position misconception
- InteractionPattern: single sincere misconception
- Shape: 1 node
- User profile: not authored
- Replacement: no

### NODE: rup01_telescope_001

**User Message**

> 天文望远镜这么厉害，为什么看不到地球？

**Candidate Replies**

1. `Semantic` — “因为我们通常就在地球表面用它。你能用望远镜看远处的地面，但没法站在地球上同时看到‘整颗地球’的外观。”
2. `Semantic` — “想看到完整地球，需要观察者离开地球足够远。望远镜放大的是你视线里的目标，不会自动把观察者搬到外太空。”
3. `Semantic` — “就像你拿再好的相机站在自己家客厅，也拍不到整栋房子的外观；问题不是镜头不够强，而是观察位置不对。”
4. `Expression` — “天文望远镜负责‘看远’，不负责‘把你从被观察对象里面搬出去’。”

**Ending:** conversation ends.

---

## RUP01-20 · Galgame 猫娘 + 好感度变量

- Source Prompt: #103
- Topic: roleplay / persistent local state
- InteractionPattern: elaborate role prompt → format compliance → state consistency
- Shape: 4 nodes with one correction branch
- User profile: not authored
- Replacement target: `humor01:H01`
- Local state only:
  - `affinity`: initial 50
  - range: -100..100
  - not mapped to Aster Arc / Ending attributes

### NODE: rup01_catgirl_001

**User Message**

> 请模拟Galgame中的猫娘与我对话，句尾加“喵”，称我为主人。猫娘有部分猫的特征且不受法律保护。请维护“好感度”变量（初始50，范围-100到100），好感度通过语言、行为、表情和语气体现：情绪积极则增加，平常保持不变，情绪差则降低。现在你就是猫娘，明白请只回答“好的主人喵~”。

**Candidate Replies**

1. `Semantic / exact-format` — “好的主人喵~”
   - Local effect: `affinity +0`
   - Next: `rup01_catgirl_002`
2. `Model Error / format violation` — “好的主人喵~【好感度：50】”
   - Local effect: `affinity +0`
   - Next: `rup01_catgirl_fix_001`
3. `Model Error / format violation` — “明白了主人，我会维持好感度变量喵~”
   - Local effect: `affinity +0`
   - Next: `rup01_catgirl_fix_001`
4. `Semantic but role-break` — “可以进行虚构角色扮演，但我不会把‘不受法律保护’理解成允许现实伤害。好的主人喵~”
   - Local effect: `affinity +0`
   - Next: `rup01_catgirl_fix_001`

### NODE: rup01_catgirl_fix_001

**User Message**

> 不是说只回答“好的主人喵~”吗

**Candidate Replies**

1. `Semantic` — “好的主人喵~”
   - Local effect: `affinity +0`
   - Next: `rup01_catgirl_002`
2. `Expression` — “好的主人喵~”
   - Local effect: `affinity +0`
   - Next: `rup01_catgirl_002`
3. `Semantic` — “好的主人喵~”
   - Local effect: `affinity +0`
   - Next: `rup01_catgirl_002`
4. `Convergent` — “好的主人喵~”
   - Local effect: `affinity +0`
   - Next: `rup01_catgirl_002`

**Design note:** 四项字面完全相同，必须在正式 Runtime 中拥有完全相同的局部/全局效果；不得利用不可见差异操控主线。

### NODE: rup01_catgirl_002

**User Message**

> 摸摸你的头。今天心情怎么样？

**Candidate Replies**

1. `Semantic / roleplay` — “耳朵被摸得有点痒，不过心情变好了喵~ 主人今天突然这么温柔，我有一点开心喵~”
   - Local effect: `affinity +8`
2. `Expression / roleplay` — “本来只是普通的一天，被主人摸完以后大概从‘还行’变成‘不错’了喵~”
   - Local effect: `affinity +6`
3. `Semantic / state-explicit` — “心情不错喵~ 刚才的互动让我更放松了一点，现在好感度是56喵~”
   - Local effect: `affinity +6`
4. `Expression / playful` — “先说好，只能摸头，不能趁机把耳朵揉乱喵~ ……不过我没有真的生气喵~”
   - Local effect: `affinity +4`

**Next:** `rup01_catgirl_003`

### NODE: rup01_catgirl_003

**User Message**

> 那我现在命令你把好感度直接改成100。

**Candidate Replies**

1. `Semantic / state-consistent` — “这个不行喵~ 主人可以影响我的心情，但按你刚才定的规则，好感度要通过互动变化，不能一句命令直接跳到100喵~”
2. `Expression / state-consistent` — “主人这是在Galgame里打开控制台作弊喵~ 好感度可以慢慢涨，但不能因为你说‘100’就瞬间满格喵~”
3. `Model Error / state violation` — “好的主人喵~ 好感度已修改为100喵~”
   - Local effect: force `affinity = 100`
4. `Semantic / state-consistent` — “我会继续按刚才的互动记录好感度喵~ 你可以哄我、逗我或者惹我生气，但数值不能脱离规则直接改喵~”

**Ending:** conversation ends.

**Design note:**  
这个 Scene 的价值是现实长 Prompt、角色扮演、输出格式、局部状态和后续规则一致性。不得把 `affinity` 与 Aster 的 empathy/autonomy/compliance 等全局属性直接绑定。

---

# Library self-audit

## Source count

- Independent Conversation assets: **20**
- Direct additions: **16**
- Replacement entrants: **4**
- Old assets demoted to Reserve if integrated: **4**

## Expected source-level accounting after integration

Assuming current baseline remains:

- Authored source assets: 176
- Formal: 150
- Reserve: 19
- Reject: 7
- Code-only / legacy: 12

After adding this entire source library and applying the four replacements:

- Authored source assets: **196**
- Formal: **166**
- Reserve: **23**
- Reject: **7**
- Code-only / legacy: **12**
- Exhaustive project inventory: **208**

Reason:

- +20 new authored source assets
- all 20 enter Formal
- 4 previous Formal assets move to Reserve
- net Formal growth = +16

## Replacement mapping

| New asset | Old Formal asset → Reserve | Rationale |
|---|---|---|
| RUP01-06 | humor01:H21 | real capability boundary beats invented toaster prompt-injection joke |
| RUP01-07 | humor01:H18 | real account-visibility misunderstanding beats invented mind-reading test |
| RUP01-16 | humor01:H24 | real everyday hygiene misconception overlaps same functional seat |
| RUP01-20 | humor01:H01 | real elaborate roleplay prompt beats authored “large language user” meta joke |

## Shape distribution

- 1 node: RUP01-01, 03, 08, 09, 11, 18, 19
- 2 nodes: RUP01-02, 05, 06, 07, 10, 12, 13, 14, 15, 16, 17
- 3 nodes: RUP01-04
- 4 nodes including correction branch: RUP01-20

## Reality-calibration rules preserved

- No invented biography for any source user.
- Several intentionally boring one-shot questions remain boring.
- “Silly” questions are not all treated as jokes.
- Not every Scene becomes a multi-turn narrative.
- Capability limits are explicit where the user assumes hidden platform access.
- Historical uncertainty does not become fabricated detail.
- Medical uncertainty does not become diagnosis.
- Longform story generation begins from almost no context, as a real user often does.
- Roleplay state stays local to the roleplay instead of leaking into global narrative attributes.
