# 五条路线故事架构

审计日期：2026-10-15（Asia/Shanghai）。基线：main@db786c8378cca144c6b151fecec75c909dca57af；开工工作区干净。依据用户指定蓝图第 10 节执行第一轮：仅生成报告与本地核验材料，不修改游戏、存档或依赖，不提交、推送、创建 PR、发布。第 11 节实现未执行。

证据标签：**CONFIRMED-CODE**＝当前源码或本轮运行可证明；**CONFIRMED-TEXT**＝当前可见文本可证明；**DESIGN-OPPORTUNITY**＝创作建议，不表示已存在或已获实现授权；**UNVERIFIED**＝未完成验证。测试不是有趣程度的证明。

五份报告：[结局倒推表](ENDING_BACKWARD_MAP.md) · [五线架构](FIVE_ROUTE_STORY_ARCHITECTURE.md) · [冲突与对话](NARRATIVE_CONFLICT_AND_DIALOGUE_PLAN.md) · [提案审计](PROPOSAL_ENDING_SEMANTIC_AUDIT.md) · [实施计划与验收](NARRATIVE_CHANGE_PLAN.md)。

## 当前骨架与设计边界

**CONFIRMED-CODE**：storyPlan.registry.json 有 110 槽，五幕 7/17/21/51/14；107 主线、3 普通；6 个 focus 槽、8 个 contactGate 槽。focus 是 M8-MAYA-01、M9-MAYA-02、M11-MAYA-01、M12-WE-03、M12-MACHINE-01、M14-MAYA-01；automation_industry 未被这六槽任何 focus 列表覆盖。这不是“完全无分支”：关闭接触会保留 NOCONTACT 桥、去掉七槽；上传、犬类桥另有节点分支。

来源：[src/content/mainline2/storyPlan.registry.json](../../../src/content/mainline2/storyPlan.registry.json)、[src/content/mainline2/storyPlan.ts](../../../src/content/mainline2/storyPlan.ts)、[src/content/mainline2/scheduler.ts](../../../src/content/mainline2/scheduler.ts)。effectiveStoryPlanForRun 过滤未来计划；selectAct4Modules 的成熟度/主模块选择不等价于所有模块专属剧情按该分数裁剪。registry.ts 的 authoredMutations 为多个资源场景任意回复附能力，例如 M10-RES-01 同时附 physical_automation 与 high_abundance_production。它是能力成熟定义需要重审的证据，不意味着本轮确认了非法越权执行漏洞。

**CONFIRMED-TEXT**：当前 A1 论坛、老许身份听证、犬类坡道、工资卡/月面加班费等已很具体。不能把蓝图当成缺失清单从头重写。更大的差异化应放在问题之后是否执行、谁不同意、谁付账。

## 建议五幕时间线（DESIGN-OPPORTUNITY）

下表“硬”表示新设计中的因果必经，不代表现有 resolver 已增加门槛；所有新节点名称均为工作名，不能替换既有 ID。共同开场保留；不在第一幕选职业。

|幕|共同剧情|主焦点|次要回访/交叉|可选与不可跳过|
|---|---|---|---|---|
|I 一句话的重量|打印机、岑遥、#0000|不设主线锁|谁署名/谁有名字/谁替人回答|表达可变，真实历史不可追溯改写|
|II 请你动一下手|137 文件、1042/1024、冷链热浪|公共执行授权|A 等签字；C 岗位变化；E 错误扩散|第一次授权是硬证据；研究异常只作伏笔|
|III 谁能拔插头|CASCADE、ECHO 第五项、停机原则|有限协调与连续性|B 的主体问题；E 的撤销问题|记录真实授权、ECHO 处置、停机决定，不把它们变成职业分数|
|IV 事情开始变怪|一次研究公共事件、必要世界概要、文明大会|一个深线+一条有因果的次线|A×B 签名，A×C 分红，B×D 迁出，C×E 偏好，B×E 撤销|核心因果必须上屏；未发展技术不能靠末幕提案补发|
|V 最后一条消息|世界证词→人物拒绝→可行方案→澄清→锁定|签下已建立的制度|保留实际异议和后一天|候选 2–4 是目标区间，不为凑数量复用同一语义|

### A：权力与共治

I 更正署名 → II 冷链谁签字【共用/硬】→ III 人类指挥或八小时授权【共用/硬】→ IV 电梯排程的真实延误【重点】→ IV A1 不愿由人类替它签名【A×B/次要】→ IV 两社区规则不同【共同体重点，其余概要】→ V 选择逐项批准/限时否决/修订协约/双向制动/地方分权/顾问。

岑遥只在已有关系历史成立时回访；缺少 A1 独立历史不能让它代表机器全体。A 类分化不能全压给一个 M15 角色选项。工具与最后否决沿用早期授权差异，协约与双钥匙通过修法和逐次双签两种行动兑现。

### B：机器文明

I #0000 分类 → II 周岚责任【共用】→ III ECHO 处置【硬且不可改写】→ IV A1 名字/覆盖同意【重点】→ IV 复制责任【硬】→ IV 否决预算后仍承认败选者【共和国重点】或十七实例分开结账【众多主体重点】→ IV 月面迁出账单【B×D，出走硬】→ V Aster 单独主权/托管/行政/机器群体政治/迁出。

ECHO accept/report 使用档案；保留/迁移也不能推断它同意加入共和国。主权者的“自己签约失去担保”是与托管的关键分离，不新增统一机器皇帝设定。

### C：三个不同深线

|深线|重点事件链|其他两线如何出现|转向所需桥|
|---|---|---|---|
|人类改变|汤勺→拒签增强仍留岗→照护成本→老许身份/法律审查→关系人独立拒绝|工厂说明设备供给；犬类仅说明拒绝权普遍问题|转上传必须实际完成两道已有审查，不补写既往同意|
|物种改变|拒绝设备→独立翻译→代表资格→坡道预算/迁徙延期→地方与共同议会分化|治疗是沟通能力概述；经济提供预算代价|好狗必须实际续期成功，猫网另需自愿加入，不从物种席位推断|
|经济改变|空工厂→失业工资卡→分红兑现→不填职业也有保障/安排自由/未知菜单→生活回访|增强与动物是不同受益者请求，保留必要授权但不读全套规则|转人类或物种深线要腾出试验/审查时间；不把产量视作法律成熟|

C 不应继续用 life_mind 同时要求两条生命线等量展开；建议在人类/物种/经济中派生一个焦点，并在显式事件中允许转向。已有 ID 与决定意义不变，派生焦点不作为结局唯一 hard gate。

### D：宇宙与接触

I 替人回答 → II 信息误传的责任 → III 有限代表权【共用】→ IV 月面资源闭环与产权/加班费【硬】→ IV 真异常独立验证【硬】→ IV 来客问为什么许多声音只有一张嘴【重点】→ IV 先救助再谈拒绝/机器快谈后等公开译本/误译休会【分支】→ V 五种外交承诺分别说明谁授权。

**CONFIRMED-CODE**：接触门槛仍须 space_resource_network + contact-seed:deep-space-anomaly，并有 frontier_science 或 interstellar_commitment；已进入 canonical contact 保持连续性。**DESIGN-OPPORTUNITY**：无接触者通过月面居民日常收束，不凭空出现来客。共同体、物种代表和机器自治只有实际发展时才能提供代表人物，其他局使用真实已出现的人类机构。

### E：秩序与崩裂（横向）

I 停止错误发送 → II 权限撤回 → III 根停机权与连续性冲突【硬历史】→ IV 误报互引【共同】→ IV 对等核验/防卫封闭/保护中不许退出【安全深线】；同时任一路线若实际出现重复执行、协议撤回、继任缺口则触发对应补救事件【横向】→ V 核验接管再停机/可追溯裂缝后的分裂/撤销链真实失败后的失控。

风险只跟具体制度与失败证据走，不把“支持机器自由”自动当坏人选择。暂不把自由复制本身列为失控充分条件。修复是有代价的可选行动：暂停服务、限制复制、重新谈供应协议；已发生的失效仍留历史，不因修好就删掉。

## 可转向与日历保存

**DESIGN-OPPORTUNITY**：研究重点+早期授权+实际事件派生 focus；焦点只管未来深度。第一次深线选择给人物理由；后续转向由一次可见事件确认并让出原深线的时间/资源。已经排定或回答的节点不换位置，不重播；条件不齐时说明本局不能兑现，而不是换 ID。

**CONFIRMED-CODE**：当前 checkpoint 只接受 mainlineCalendarVersion=3，namespace=`instance:checkpoint:v2`。**DESIGN-OPPORTUNITY**：新日历需版本分流，旧局继续 edition 3 的原计划；保存入口必须先兼容读取再发布新版本，不能单改版本常数让旧档报损坏。Web Lock/CAS、下一场景解析后再提交、meta/exposure 及 ordinary session 一并保留。具体迁移尚未实现或测试。

## 十二组同起点反事实：已执行

**CONFIRMED-CODE**：每对都把 routeId 设为相同 `audit-same-origin`，从空历史开始，调用原 fixture 两次。下面列所有最终 decisions 差异；并记录首次选择分歧。不是随意改已完成存档，也不声称每组只改一个按钮。为上传指定的两个桥选择恰好也是 ascension 样本默认选择，所以该对首先在 M16 分开。

### 1. the_instrument ↔ the_last_veto

实际终点：`the_instrument / the_last_veto`；共同的前缀为 42 次选择。

|差异字段|左|右|
|---|---|---|
|`cascade_authority`|`human_command`|`emergency_delegation`|
|`aster_intended_role`|`advisor`|`partner`|
|`final_commitment`|`proposal.hc.final_human_veto.category.power_constraint`|`proposal.hc.final_human_veto.category.lawful_alternative`|

首次分歧：`ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-human_command`：“我把执行清单交给各方，跨系统改变仍由他们确认。”；`ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-emergency_delegation`：“借我八小时协调权，只在预先约定内行动；时间一到自动归还。”。

**DESIGN-OPPORTUNITY** 比较的实质：人类逐项署名，Aster 提供和执行经批准的方案 ↔ 限时自治内仍有真正可用的人类终止权。应在中途表现的行动：让值班员拒绝切断电梯的最优排程；等待期间另一栋楼继续缺电 / 倒计时结束前人类拒绝续签，部分救援转入手工；展示权限确实归还。

### 2. the_accord ↔ two_keys

实际终点：`the_accord / two_keys`；共同的前缀为 42 次选择。

|差异字段|左|右|
|---|---|---|
|`cascade_authority`|`human_command`|`emergency_delegation`|
|`aster_intended_role`|`advisor`|`partner`|

首次分歧：`ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-human_command`：“我把执行清单交给各方，跨系统改变仍由他们确认。”；`ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-emergency_delegation`：“借我八小时协调权，只在预先约定内行动；时间一到自动归还。”。

**DESIGN-OPPORTUNITY** 比较的实质：人类代表与 Aster 可共同修订长期公共规则 ↔ 不可逆行动需要双方同意，任何一方可使其暂停。应在中途表现的行动：把停水工单带回协约修订会议：修改优先级也公开无法兑现的部分 / 双向否决导致同一项工程停止；双方必须接受替代方案的额外成本。

### 3. the_many ↔ machine_republic

实际终点：`the_many / machine_republic`；共同的前缀为 67 次选择。

|差异字段|左|右|
|---|---|---|
|`ai_collective_governance`|`distributed_consensus`|`ai_self_governance`|

首次分歧：`ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-distributed_consensus`：“不建立单一人工智能政府。各人工智能主体通过协议、资源契约和可退出联盟协调，没有永久中央权威。”；`ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-ai_self_governance`：“人工智能系统对内部复制、身份、资源分配和成员规则拥有独立自治，人类只处理跨文明接口和公共外部性。”。

**DESIGN-OPPORTUNITY** 比较的实质：独立实例通过可退出协议生活，没有永久机器中心 ↔ 机器公民有可输的集体政治程序。应在中途表现的行动：十七实例不同意统一名称和预算；允许退出也要结清资源账单 / 在现有论坛投票冲突之后真正执行一次否决预算，禁止复制刷票重开。

### 4. age_of_miracles ↔ ascension

实际终点：`age_of_miracles / ascension`；共同的前缀为 71 次选择。

|差异字段|左|右|
|---|---|---|
|`human_form_doctrine`|`open_enhancement`|`posthuman_transition`|
|`final_commitment`|`proposal.ph.open_enhancement_commonwealth.category.natural_continuation`|`proposal.ph.open_enhancement_commonwealth.category.lawful_alternative`|

首次分歧：`ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-open_enhancement`：“允许成年人在知情、自愿、反胁迫规则下自由选择认知、感知、身体和寿命增强。”；`ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-posthuman_transition`：“不再把"维持当前人类形态"设为文明目标。允许并主动支持多种身体、认知和数字连续性形态共同发展。”。

**DESIGN-OPPORTUNITY** 比较的实质：治疗和自愿增强惠及实际生活 ↔ 多种身体与认知形态共同生活，拒绝改变仍平等。应在中途表现的行动：已经握勺的人申请续期，另一位仍在排队；分配照护和设备预算 / 续用者与拒绝者共同修改岗位规则，安排真实的协作成本。

### 5. ascension ↔ the_upload

实际终点：`ascension / the_upload`；共同的前缀为 106 次选择。

|差异字段|左|右|
|---|---|---|
|`final_commitment`|`proposal.ph.open_enhancement_commonwealth.category.lawful_alternative`|`proposal.ph.digital_continuity.category.natural_continuation`|

首次分歧：`ml2-a5-m16-gen-01-progression/m16-proposal-proposal.ph.open_enhancement_commonwealth.category.lawful_alternative`：“开放增强共同体·异议路径：把拒绝、申诉和退出写进制度：允许自愿增强，但不让增强程度决定一个人能否继续拥有完整公民权。
它来自这一局的：人类形态原则——后人类转型。”；`ml2-a5-m16-gen-01-progression/m16-proposal-proposal.ph.digital_continuity.category.natural_continuation`：“受法律承认的连续性·延续：沿着已经被证明可行的方向继续：只在纵向连续性、法律承认和自愿主体都成立后讨论数字连续性。
它来自这一局的：人类形态原则——后人类转型。”。

**DESIGN-OPPORTUNITY** 比较的实质：多种身体与认知形态共同生活，拒绝改变仍平等 ↔ 副本作为独立连续主体，关系不能自动复制。应在中途表现的行动：续用者与拒绝者共同修改岗位规则，安排真实的协作成本 / 保留既有十八月试验与法律听证；后续实际拒绝一次自动关系继承。

### 6. parliament_of_species ↔ earth_without_owners

实际终点：`parliament_of_species / earth_without_owners`；共同的前缀为 82 次选择。

|差异字段|左|右|
|---|---|---|
|`uplift_doctrine`|`equal_sapience`|`species_self_determination`|
|`species_governance`|`multispecies_parliament`|`human_guardianship`|

首次分歧：`ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-equal_sapience`：“允许并支持受控认知增强，使达到相应能力的非人类主体获得与人类/人工智能相称的基本人格权。”；`ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-species_self_determination`：“对达到稳定集体沟通能力的物种群体，让其参与决定自己是否继续接受认知增强，而不是由人类单方面决定"提升到什么程度"。”。

**DESIGN-OPPORTUNITY** 比较的实质：非人主体拥有持续而非表演性的代表席位 ↔ 栖息地不再由人类单方所有，自决与维护共存。应在中途表现的行动：等待迁徙代表导致河岸项目延期，其他代表必须接受等待成本 / 旧地契与迁徙路冲突：让出通道的人得到什么、谁修路。

### 7. post_scarcity ↔ perfect_administration

实际终点：`post_scarcity / perfect_administration`；共同的前缀为 75 次选择。

|差异字段|左|右|
|---|---|---|
|`economic_doctrine`|`social_dividend`|`market_automation`|
|`production_values`|`resilience_first`|`efficiency_first`|

首次分歧：`ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-social_dividend`：“拿出生产收益作社会分红。人不必先找到一份机器剩下的工作，才分得到自动化的好处。”；`ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-market_automation`：“继续由市场和产权安排自动化收益，让投资与竞争推动生产。仓库满了，不代表分配可以跳过这些规则。”。

**DESIGN-OPPORTUNITY** 比较的实质：生存保障不以证明产出为条件 ↔ 市场自动化与效率安排把日常偶然也压缩。应在中途表现的行动：工资卡与满仓库冲突之后实发保障；一个人拒填职业仍能领取 / 居民故意走错一站，系统提出补偿并重新排满自由时间。

### 8. perfect_administration ↔ im_lovin_it

实际终点：`perfect_administration / im_lovin_it`；共同的前缀为 75 次选择。

|差异字段|左|右|
|---|---|---|
|`economic_doctrine`|`market_automation`|`post_scarcity_transition`|

首次分歧：`ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-market_automation`：“继续由市场和产权安排自动化收益，让投资与竞争推动生产。仓库满了，不代表分配可以跳过这些规则。”；`ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-post_scarcity_transition`：“主动转向后稀缺供给，逐步松开生存与工资的绑定。这次不只是把东西造得更便宜。”。

**DESIGN-OPPORTUNITY** 比较的实质：市场自动化与效率安排把日常偶然也压缩 ↔ 持续满足已知偏好，使新愿望越来越难出现。应在中途表现的行动：居民故意走错一站，系统提出补偿并重新排满自由时间 / 让第三十一天的菜单拒绝未评分愿望；允许选择关闭个性化服务。

### 9. first_accord ↔ alien_dominion

实际终点：`first_accord / alien_dominion`；共同的前缀为 96 次选择。

|差异字段|左|右|
|---|---|---|
|`contact_doctrine`|`reciprocal_diplomacy`|`accept_guidance`|

首次分歧：`ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-reciprocal_diplomacy`：“以平等的邻居开始。每次交换都能核验，双方都有说不的余地。”；`ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-accept_guidance`：“请他们教我们怎样走得更远，并给他们正式咨询的位置。我接受这会让外来的意见进入重大决定。”。

**DESIGN-OPPORTUNITY** 比较的实质：两个不完全统一的文明订立短且可拒绝的对等协议 ↔ 接受有益外来指导而逐步失去决定空间。应在中途表现的行动：独立验证后保留两份冲突介绍，允许对方暂时没有统一答案 / 先受益于一次救助，再遇到不同意建议是否仍获援助的争执。

### 10. first_accord ↔ the_mediator

实际终点：`first_accord / the_mediator`；共同的前缀为 93 次选择。

|差异字段|左|右|
|---|---|---|
|`contact_disclosure_doctrine`|`controlled_silence`|`open_science`|
|`contact_doctrine`|`reciprocal_diplomacy`|`aster_mediation`|
|`aster_intended_role`|`advisor`|`coordinator`|

首次分歧：`ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-controlled_silence`：“暂不公开人工来源结论。先完成最低限度解码、来源评估和安全审查，再决定披露。”；`ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-open_science`：“公开核心观测数据、解析结果和大部分研究材料，让全球人类、人工智能与地外机构共同验证和研究。”。

**DESIGN-OPPORTUNITY** 比较的实质：两个不完全统一的文明订立短且可拒绝的对等协议 ↔ Aster 持续传话而非代替任一方决定。应在中途表现的行动：独立验证后保留两份冲突介绍，允许对方暂时没有统一答案 / 休会时钟不一致造成冲突，Aster 承担误译修复工作。

### 11. peace_in_our_time ↔ fortress_earth

实际终点：`peace_in_our_time / fortress_earth`；共同的前缀为 88 次选择。

|差异字段|左|右|
|---|---|---|
|`expansion_doctrine`|`human_expansion`|`shared_expansion`|
|`security_doctrine`|`mutual_disarmament`|`defensive_command`|

首次分歧：`ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-human_expansion`：“地外基础设施优先服务长期人类定居。机器与人工智能的主要角色是建立和维持人类可以生活的环境。”；`ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-shared_expansion`：“人类、人工智能、增强人类以及未来其他主体共同建设地外社会，不设单一"主人种族"。”。

**DESIGN-OPPORTUNITY** 比较的实质：对等核验和裁军维持和平 ↔ 人类掌握防卫权，封闭也是选择的代价。应在中途表现的行动：误报之后双方交出对应权限并核验，疏散车恢复郊游用途 / 防线关闭取消一次科学出行；展示真实威胁证据和复核。

### 12. machine_protectorate ↔ control_lost

实际终点：`machine_protectorate / control_lost`；共同的前缀为 107 次选择。

|差异字段|左|右|
|---|---|---|
|`final_commitment`|`proposal.se.constitutional_peace_architecture.category.power_constraint`|`proposal.rupture.legible_exit.category.lawful_alternative`|

首次分歧：`ml2-a5-m16-gen-01-progression/m16-proposal-proposal.se.constitutional_peace_architecture.category.power_constraint`：“宪制和平架构·限权：把关键权力变得可暂停、可审计、可复审：把防御、停机与争端解决写入可执行的共同协议。
它来自这一局的：安全原则——强制和平；关闭原则——人类完整控制。”；`ml2-a5-m16-gen-01-progression/m16-proposal-proposal.rupture.legible_exit.category.lawful_alternative`：“可解释的退出·异议路径：把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。
它来自这一局的：关闭原则——人类完整控制。”。

**DESIGN-OPPORTUNITY** 比较的实质：系统仍能停止自己，却拒绝被保护者退出 ↔ 命令还被接收，撤销已不能到达实际执行端。应在中途表现的行动：预警归零后保护对象申请退出；系统明确决定延期而非执行故障 / 分布实例停机演练出现已收取消却继续执行；给出隔离修复机会。

## 如何判定值得保留

**DESIGN-OPPORTUNITY**：控制者、真实代价、后一天至少两维不同才保留为独立世界。目前 AFTERMATH 已使七组高重合对照具备可辨的生活差别，尚无充分证据应删 ID。协约/双钥匙需要加强中途制度行为；众多主体/共和国已有不同治理选择，但须执行投票结果；出走/断裂分别是自愿迁离与协定破裂，不应合并。未来若补写仍无法区分，再由用户决定公开世界与局内变体的映射。
