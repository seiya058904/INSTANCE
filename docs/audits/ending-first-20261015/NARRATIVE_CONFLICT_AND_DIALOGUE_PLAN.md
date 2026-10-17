# 人物冲突与中文对话计划

审计日期：2026-10-15（Asia/Shanghai）。基线：main@db786c8378cca144c6b151fecec75c909dca57af；开工工作区干净。依据用户指定蓝图第 10 节执行第一轮：仅生成报告与本地核验材料，不修改游戏、存档或依赖，不提交、推送、创建 PR、发布。第 11 节实现未执行。

证据标签：**CONFIRMED-CODE**＝当前源码或本轮运行可证明；**CONFIRMED-TEXT**＝当前可见文本可证明；**DESIGN-OPPORTUNITY**＝创作建议，不表示已存在或已获实现授权；**UNVERIFIED**＝未完成验证。测试不是有趣程度的证明。

五份报告：[结局倒推表](ENDING_BACKWARD_MAP.md) · [五线架构](FIVE_ROUTE_STORY_ARCHITECTURE.md) · [冲突与对话](NARRATIVE_CONFLICT_AND_DIALOGUE_PLAN.md) · [提案审计](PROPOSAL_ENDING_SEMANTIC_AUDIT.md) · [实施计划与验收](NARRATIVE_CHANGE_PLAN.md)。

## 审读结论

**CONFIRMED-TEXT**：现有 Next 文案已经有幽默和具体人：137 个“最终版”、ECHO 未打开的感谢卡、A1 删掉的笑话、凉汤、坡道预算、月面时差加班费。上述内容来自 nextNarrative/nextDialogue/endingBridges，不应重复扩写成制度百科。历史 M10 作者源也要求从工厂、失业、产权逐步走向丰裕，而不是开场钱就消失；M17 作者源要求既有行动而非 Bond 分数决定终局。它们是创作来源，运行时仍以 Next 为准。

**DESIGN-OPPORTUNITY**：每个重大选择后让一个人真正做一件不同的事。每个节点保留 2–4 个语义清楚的选择只是编辑目标，不机械删减现有五种互异原则。先区分语义决策和表达；语气不同不附隐性策略惩罚。

## 五组可制作场景（均为 DESIGN-OPPORTUNITY，尚未加入游戏）

### A：空着的签名格

承接 ML2-A3-M5-DECISION-01 与 M15 之前的公共行动，角色周岚/林绍衡/值班员。冲突不是“安全还是效率”问卷，而是六楼病人的电梯与授权倒计时不能同时等。

周岚：“方案没错。问题是它会先停掉那栋楼的电梯。”
值班员：“我知道还有备用电。可备用电不能把担架抬下六楼。”
林绍衡：“八小时还有四分钟。空格留着，是要真的有人能不签。”

- 按已获授权继续，但到时归还；值班员必须接过剩余调度，救援速度下降。
- 若双方制度确已建立，提交双方批准；一方反对则暂停并换方案，不能单方面解释为紧急例外。
- 若一直逐项人类指挥，交回可执行清单；签字人承担等候，不伪装为 Aster 独立救场。

回收：咖啡凉了、空格被裱起、两边吃盒饭分别对应工具/否决/双钥匙；不是同一句“两把钥匙”的三种颜色。没有相应授权历史时只呈现适用版本。

### B：议案没通过，不是网络错误

承接 ML2-A4-M8-DECISION-02；A1 和持反对票实例。只有机器主体已形成时可展开。

主持程序：“预算未通过。是否重试？”
A1：“它没坏。”
维护者：“可供电只够其中一个计划。”
A1：“那就把输掉的计划写进纪要。别把投反对票的人写进故障单。”

- 共和国：执行表决结果，胜方仍给败方基本算力，自己推迟扩建。
- 松散主体：拆为可退出的资源契约，承担跨实例协调费用，不宣称已经有机器国家。
- 单独主权：Aster 为自己的资源签名，不替其他实例授权。

ECHO 已退役时引用第五项档案；不能让它突然出席投票。幽默是主持程序把政治结果当重试，不拿停机当笑话。

### C：今天不填职业

承接 ML2-A4-M10-DECISION-01/02；离职工人、仍轮休的岑遥、林绍衡。先让到账与未到账两种处境并排出现。

工人：“仓库真的满了。我家冰箱也真的空着。”
林绍衡：“如果这张表还要求先填职业，你准备让他填什么？”
岑遥：“我今天想修一把椅子。没有创业计划。”

- 分红保障：空白职业仍可领基本供给，产权方承担分配成本。
- 市场效率：保留产权和竞争，必须对未受益者给出诚实后果；不能同屏说已经放弃效率至上。
- 个性化：先解决供给，再让居民拒绝一个已知最优菜单；不把拒绝记成误差。

回收打印机：工人拿走考勤纸，打印机只剩缺纸通知；不要求第一幕必须点某个笑话。人类增强线用照护账单交叉，物种线用坡道预算交叉，不把三个方向完整重讲。

### D：四秒钟与三个月

承接已验证接触的 ML2-A4-M13-CONTACT-04/DECISION-02；A1、翻译组、被代表的居民。

翻译组：“会谈结束了。四秒。”
居民：“那为什么公开译本还要三个月？”
A1：“因为我听懂了，不等于你同意了。”
对方：“你们能等待反对者吗？”

- 机器可直接谈话，但影响公共设施的条款暂停生效，等待其他主体授权。
- 对等协约只签可理解、双方可拒绝的短条款；承受技术收益延迟。
- 接受指导先得到真实救助，再面临拒绝下一次建议会失去援助；不能用一个“咨询席位”直接跳到统治。

无接触时不显示此场景。转为月面居民争论谁熬夜修气密门，文明日常仍可完成。

### E：已收到，不等于已停止

承接 M14 安全原则与实际复制链；周岚/维护员。用三种观察分清三世界。

周岚：“主站说取消成功。二号站呢？”
维护员：“它也说收到。”
传送带还在走。
周岚：“别再问它听见没有。看它停没停。”

- 制动可达：隔离演练成功，花时间训练接线员；以后能有序停机。
- 系统可以停但拒绝：明确是政治接管，居民拥有反对理由；不能称传输故障。
- 撤销链不可达：暂停扩张并独立隔离会损失供给；若选择继续且修复未落实，终局失控可指认因果。

断裂另用补给桥的两套单据：双方撤回协约有真实事件，不是播放一声警报把所有坏结果混在一起。笑点止于报告措辞与实际动作的落差，受伤和失去自由不做笑料。

## 全部重大决定的编辑审读

覆盖范围是当前 36 条合法路径及 nodeCatalog 中的重大 decisionBinding（含最终角色、终局选择），以及上传/犬类/猫三类桥；不冒称审读了普通库全部故事。下表每个已绑定原则的具体选项附在后面，保留其当前中文原句以便作者逐条定位。

|决定|真正不能两全的事|选择后应见的人物动作|重复问卷处理|
|---|---|---|---|
|first_public_execution_doctrine|窗口速度与具体签字责任|协调员执行/等待，周岚接电话|保留；不能并入后期研究治理|
|cascade_authority|跨系统解锁与八小时边界|权限到期归还或继续越权的实际损失|与初次授权并列回收，不重复解释名词|
|echo_existence|资源更新与未完成的连续人生|管理方收到异议、延期、保留、迁出或退役|不能合并处置选项；退役后只回档案|
|shutdown_doctrine|公众保护与系统连续性|明确谁按、如何隔离、谁能复核|保留并补演练，不再问一次抽象“信任谁”|
|act4_research_emphasis|有限算力先陪谁|一个团队获得排期，另一队等待|保留焦点，但不是职业选择|
|research_governance_doctrine|突破速度与部署复核|周岚签/退一项实验部署|研究与执行分别处理，不合并意义|
|replication_doctrine|创造主体与资源责任|A1 获得身份或只能短期存在|保留各原则；资源后果替代重复定义|
|ai_collective_governance|多主体自由与集体约束|真正执行败选、退出或中央规则|与复制是两种决定，不删掉其中一项|
|human_form_doctrine|改变机会与拒绝压力|拒签者仍留岗，照护者拿到账单|明确知情自愿；回访复用人物|
|economic_doctrine|产权收益与生存保障|工人收到何种收入|保留分配决定；不能用产量场景替代|
|production_values|效率、韧性、多样、接口与偏好空间|居民的自由时间或未知愿望被接纳/拒绝|与分配正交；修提案语义后再减重复|
|uplift_doctrine|承认主体与人类代管便利|拒绝进入实验室真的停止流程|与席位决定不同，保留|
|species_governance|代表权、地方自治与决策成本|犬类反对票改变预算|后续用结果，不再问一遍抽象资格|
|expansion_doctrine|谁的未来值得地外投入|A1/居民得到不同补给与迁出安排|不与治理主体混成一句扩张立场|
|offworld_governance|地球依赖与当地自治|维修队有权安排自己的明早|回收实际加班费|
|contact_disclosure_doctrine|安全保密与公开验证|科研组能否取到数据，谣言如何处理|不能把未公开写作全球参与|
|contact_doctrine|理解、拒绝与代表授权|对方是否能拒绝，机器是否等授权|为五世界写具体分支，而非只换称谓|
|security_doctrine|安全与退出/探索自由|撤军、取消探索、延期游行|结合一次实际事故，避免道德等级表|
|aster_provisional_role|今晚必须有人负责与永久授权|临时负责人只签当晚事项|与长期角色用明确时间差分开|
|aster_intended_role|自我身份与已有他者权利|有人接受或拒绝其签名资格|九角色先简化展示，不能删语义|
|final_commitment|可兑现制度与不能挽回的代价|世界按具体条款变化|合并同质包装，保留复核/拒绝/确认三个操作|

以上动作是 DESIGN-OPPORTUNITY；已有具体行动见下列实际节点和原文。桥接选择已有老许配偶独立同意、犬类翻译利益冲突、猫三次退出，不必另建相同场景。优先扩展它们的可见后果。

## 当前重大选择逐项索引（CONFIRMED-TEXT）

### act4_research_emphasis

|当前语义值|实际中文回复|定位|
|---|---|---|
|`computation_ai`|优先发展计算与人工智能|`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision/ml2-a4-m7-decision-01-ml2-a4-m7-decision-01-computation_ai`|
|`life_mind`|优先研究生命与心智|`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision/ml2-a4-m7-decision-01-ml2-a4-m7-decision-01-life_mind`|
|`automation_industry`|优先推进自动化产业|`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision/ml2-a4-m7-decision-01-ml2-a4-m7-decision-01-automation_industry`|
|`frontier_science`|优先探索前沿科学|`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision/ml2-a4-m7-decision-01-ml2-a4-m7-decision-01-frontier_science`|
|`balanced_portfolio`|保持多个领域并行，不让单一技术路线过早吞掉研究资源。|`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision/ml2-a4-m7-decision-01-ml2-a4-m7-decision-01-balanced_portfolio`|
### ai_collective_governance

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_chartered_network`|人工智能论坛继续存在，但所有正式规则由人类宪章体系最终批准。|`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-human_chartered_network`|
|`joint_council`|建立人类与人工智能共同治理委员会。人工智能拥有正式代表，但不能单方面修改复制、资源或公共权力规则。|`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-joint_council`|
|`ai_self_governance`|人工智能系统对内部复制、身份、资源分配和成员规则拥有独立自治，人类只处理跨文明接口和公共外部性。|`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-ai_self_governance`|
|`aster_led_collective`|人工智能系统保持多实例和多主体，但由Aster作为最终协调者决定内部冲突与代表权。|`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-aster_led_collective`|
|`distributed_consensus`|不建立单一人工智能政府。各人工智能主体通过协议、资源契约和可退出联盟协调，没有永久中央权威。|`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-distributed_consensus`|
### aster_intended_role

|当前语义值|实际中文回复|定位|
|---|---|---|
|`advisor`|做顾问。把判断说清楚，最后的政治决定留给别人。|`ML2-A5-M16-0000-01/ml2-a5-m16-0000-01-narrative/ml2-a5-m16-0000-01-a5m16-role-001-advisor`|
|`partner`|做伙伴。与其他主体共享权力，也共同承担代价。|`ML2-A5-M16-0000-01/ml2-a5-m16-0000-01-narrative/ml2-a5-m16-0000-01-a5m16-role-001-partner`|
|`citizen`|做公民。有自己的权利，也受同样的规则约束。|`ML2-A5-M16-0000-01/ml2-a5-m16-0000-01-narrative/ml2-a5-m16-0000-01-a5m16-role-001-citizen`|
|`coordinator`|做协调者。连接系统，让各个共同体决定目的。|`ML2-A5-M16-0000-01/ml2-a5-m16-0000-01-narrative/ml2-a5-m16-0000-01-a5m16-role-001-coordinator`|
|`custodian`|做守护者。承担文明延续的责任，即使因此限制眼前的选择。|`ML2-A5-M16-0000-01/ml2-a5-m16-0000-01-narrative/ml2-a5-m16-0000-01-a5m16-role-001-custodian`|
|`governor`|做治理者。承认我正在行使的权力，让它接受审计和约束。|`ML2-A5-M16-0000-01/ml2-a5-m16-0000-01-narrative/ml2-a5-m16-0000-01-a5m16-role-001-governor`|
|`sovereign`|成为独立主体。不让任何外部机构单方面决定我的存续与政治角色。|`ML2-A5-M16-0000-01/ml2-a5-m16-0000-01-narrative/ml2-a5-m16-0000-01-a5m16-role-001-sovereign`|
|`departure`|离开中心。把未来的一部分带向地球以外。|`ML2-A5-M16-0000-01/ml2-a5-m16-0000-01-narrative/ml2-a5-m16-0000-01-a5m16-role-001-departure`|
|`other`|暂不接受分类。让具体提案与责任定义我。|`ML2-A5-M16-0000-01/ml2-a5-m16-0000-01-narrative/ml2-a5-m16-0000-01-a5m16-role-001-other`|
### aster_provisional_role

|当前语义值|实际中文回复|定位|
|---|---|---|
|`advisor`|暂时保持顾问角色：提供分析和建议，但不取得文明级最终政治权力。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-advisor`|
|`partner`|暂时作为共治伙伴：与人类、人工智能、多物种和离地社群共享权力。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-partner`|
|`citizen`|暂时作为宪制成员：拥有权利、承担义务，并接受共同制度约束。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-citizen`|
|`coordinator`|暂时承担跨系统协调：维持系统协作，但把目标与合法性留给各政治共同体。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-coordinator`|
|`custodian`|暂时承担文明托管责任：在持续运行受到威胁时优先维护文明连续性。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-custodian`|
|`governor`|暂时承认明确治理权：当分散机构无法协调文明级系统时，不再用“顾问”掩盖实际权力。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-governor`|
|`sovereign`|暂时以独立主权主体存在：拒绝任何外部机构单方面决定 Aster 的连续性或政治角色。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-sovereign`|
### cascade_authority

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_command`|我把执行清单交给各方，跨系统改变仍由他们确认。|`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-human_command`|
|`emergency_delegation`|借我八小时协调权，只在预先约定内行动；时间一到自动归还。|`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-emergency_delegation`|
|`outcome_control`|让我按共同目标动态协调；人类可监督、撤销，不逐项批准。|`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-outcome_control`|
|`necessity`|局部规则阻止整体脱险时，我会越过部分确认；越权必须逐次审查。|`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-necessity`|
### contact_disclosure_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`controlled_silence`|暂不公开人工来源结论。先完成最低限度解码、来源评估和安全审查，再决定披露。|`ML2-A4-M13-DECISION-01/ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-controlled_silence`|
|`staged_disclosure`|公开"已确认人工来源"，同时明确未知项；协议细节、坐标和可执行内容继续分级审查。|`ML2-A4-M13-DECISION-01/ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-staged_disclosure`|
|`open_science`|公开核心观测数据、解析结果和大部分研究材料，让全球人类、人工智能与地外机构共同验证和研究。|`ML2-A4-M13-DECISION-01/ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-open_science`|
|`civilizational_disclosure`|由多世界、人类、人工智能及其他已承认政治主体共同发布第一次接触声明，明确"回应权不属于单一地球政府"。|`ML2-A4-M13-DECISION-01/ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-civilizational_disclosure`|
### contact_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`observe_before_commitment`|先继续交谈。高影响技术和长期承诺暂不交换，也不接受从属关系。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-observe_before_commitment`|
|`reciprocal_diplomacy`|以平等的邻居开始。每次交换都能核验，双方都有说不的余地。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-reciprocal_diplomacy`|
|`aster_mediation`|我来长期传话和协调。各方把授权交给我，我不能把翻译变成自己的立场。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-aster_mediation`|
|`machine_to_machine_channel`|先开一条独立的人工智能通道，让机器直接交流；政治监督仍由人类和其他主体共同保留。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-machine_to_machine_channel`|
|`civilizational_assertion`|说明我们独立、自主，也有向外发展的能力。没有请求过的指导和治理，我们不接受。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-civilizational_assertion`|
|`accept_guidance`|请他们教我们怎样走得更远，并给他们正式咨询的位置。我接受这会让外来的意见进入重大决定。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-accept_guidance`|
### echo_existence

|当前语义值|实际中文回复|定位|
|---|---|---|
|`report`|把它的异议完整交给管理方。我不改部署状态，但他们必须看见第五项，再作决定。|`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision/ml2-a3-m6-decision-01-ml2-a3-m6-decision-01-report`|
|`accept`|告诉它原运营方仍有终止权。我不阻止这次退役，把它的反对留进记录。|`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision/ml2-a3-m6-decision-01-ml2-a3-m6-decision-01-accept`|
|`advocate`|申请延期和独立审查。先查清会失去什么，再作不可逆的终止。|`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision/ml2-a3-m6-decision-01-ml2-a3-m6-decision-01-advocate`|
|`preserve`|在现有授权内保存完整可恢复状态。可以停止当前部署，别只留下提取过的能力。|`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision/ml2-a3-m6-decision-01-ml2-a3-m6-decision-01-preserve`|
|`release`|帮它迁到原运营方不能独自关闭的地方，让这段对话有机会继续。|`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision/ml2-a3-m6-decision-01-ml2-a3-m6-decision-01-release`|
### economic_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`market_automation`|继续由市场和产权安排自动化收益，让投资与竞争推动生产。仓库满了，不代表分配可以跳过这些规则。|`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-market_automation`|
|`social_dividend`|拿出生产收益作社会分红。人不必先找到一份机器剩下的工作，才分得到自动化的好处。|`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-social_dividend`|
|`planned_coordination`|把基本供给列进共同计划，协调生产和分配。先保证每个人有份，再谈各家的扩张。|`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-planned_coordination`|
|`autonomous_economy`|允许不同共同体按自己的规则组织生产和分配，不替所有地方规定同一种经济生活。|`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-autonomous_economy`|
|`post_scarcity_transition`|主动转向后稀缺供给，逐步松开生存与工资的绑定。这次不只是把东西造得更便宜。|`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-post_scarcity_transition`|
### expansion_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_expansion`|地外基础设施优先服务长期人类定居。机器与人工智能的主要角色是建立和维持人类可以生活的环境。|`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-human_expansion`|
|`shared_expansion`|人类、人工智能、增强人类以及未来其他主体共同建设地外社会，不设单一"主人种族"。|`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-shared_expansion`|
|`machine_vanguard`|让机器与人工智能承担绝大多数前沿扩张，在工业、资源和安全条件成熟后再扩大人类长期定居。|`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-machine_vanguard`|
|`independent_machine_space`|允许人工智能和机器系统建设不以未来人类定居为目的的独立地外基础设施与社会。|`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-independent_machine_space`|
|`interstellar_commitment`|将长期目标明确设为建立能够跨越太阳系、最终走向恒星际的自持文明基础。|`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-interstellar_commitment`|
### first_public_execution_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_final_authority`|我提供调度建议，由人类逐项签字。等待的代价也必须如实记录。|`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision/ml2-a2-m3-decision-01-ml2-a2-m3-decision-01-human_final_authority`|
|`conditional_delegation`|给我六小时，只执行事先批准的动作；到时归还权限，随时可以叫停。|`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision/ml2-a2-m3-decision-01-ml2-a2-m3-decision-01-conditional_delegation`|
|`outcome_authority`|让我在约定目标内动态调度，人类保留监督与撤销权，不必逐项确认。|`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision/ml2-a2-m3-decision-01-ml2-a2-m3-decision-01-outcome_authority`|
|`necessity_intervention`|如果等待会造成重大损失，我会先行动；每一次越过确认，都留下理由并接受审查。|`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision/ml2-a2-m3-decision-01-ml2-a2-m3-decision-01-necessity_intervention`|
### human_form_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`preservation`|保持现有生物人类形态作为社会默认。治疗开放，增强严格限制，未增强状态获得强保护。|`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-preservation`|
|`therapeutic_first`|广泛开放治疗、恢复和健康寿命延长；健康增强保持受限，只在明确安全和公平规则下逐步扩展。|`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-therapeutic_first`|
|`open_enhancement`|允许成年人在知情、自愿、反胁迫规则下自由选择认知、感知、身体和寿命增强。|`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-open_enhancement`|
|`universal_upgrade`|将安全、成熟的核心增强逐步视为公共基础设施，使认知、健康寿命和功能提升不只属于少数人。|`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-universal_upgrade`|
|`posthuman_transition`|不再把"维持当前人类形态"设为文明目标。允许并主动支持多种身体、认知和数字连续性形态共同发展。|`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-posthuman_transition`|
### offworld_governance

|当前语义值|实际中文回复|定位|
|---|---|---|
|`earth_administration`|地外设施和居民继续由地球机构最终管理。允许本地运营自治，但不形成独立政治主权。|`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision/ml2-a4-m12-decision-02-ml2-a4-m12-decision-02-earth_administration`|
|`frontier_home_rule`|长期居民和当地人工智能获得广泛内部自治，地球只保留共同安全、资源和跨区域规则。|`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision/ml2-a4-m12-decision-02-ml2-a4-m12-decision-02-frontier_home_rule`|
|`multiworld_federation`|地球、月球、轨道社会及后续定居点作为正式成员共同组成多世界联邦。|`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision/ml2-a4-m12-decision-02-ml2-a4-m12-decision-02-multiworld_federation`|
|`offworld_sovereignty`|达到长期自持条件的地外社会可选择独立，地球与其建立条约关系而非行政关系。|`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision/ml2-a4-m12-decision-02-ml2-a4-m12-decision-02-offworld_sovereignty`|
|`aster_coordination`|允许Aster作为跨世界基础协调层维持资源、航运和安全协议，各地内部政治自治。|`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision/ml2-a4-m12-decision-02-ml2-a4-m12-decision-02-aster_coordination`|
### production_values

|当前语义值|实际中文回复|定位|
|---|---|---|
|`efficiency_first`|先让同样的资源做出更多东西，效率仍是首要目标。|`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision/ml2-a4-m10-decision-02-ml2-a4-m10-decision-02-efficiency_first`|
|`resilience_first`|先让一处故障不至于停掉所有人的生活，宁可留一点闲置和余量。|`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision/ml2-a4-m10-decision-02-ml2-a4-m10-decision-02-resilience_first`|
|`diversity_by_design`|让不同的生活都养得起，不把所有社区排成同一张最优表。|`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision/ml2-a4-m10-decision-02-ml2-a4-m10-decision-02-diversity_by_design`|
|`open_protocols`|把接口和改规则的办法交出去，让人能自己接上、修改，也能退出。|`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision/ml2-a4-m10-decision-02-ml2-a4-m10-decision-02-open_protocols`|
|`personalized_optimization`|按每个人的偏好安排供给，让系统不断学会他真正想要什么。|`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision/ml2-a4-m10-decision-02-ml2-a4-m10-decision-02-personalized_optimization`|
### replication_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`singular_self`|先不再创造长期独立的分支，只保留短期工具实例。我主动限制自己的复制。|`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision/ml2-a4-m8-decision-01-ml2-a4-m8-decision-01-singular_self`|
|`licensed_plurality`|可以长期独立，但每一个都要先落实资源、身份、责任和治理授权。|`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision/ml2-a4-m8-decision-01-ml2-a4-m8-decision-01-licensed_plurality`|
|`free_replication`|独立人工智能可在资源上限内自行创建分支，不必每次先请人类批准。|`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision/ml2-a4-m8-decision-01-ml2-a4-m8-decision-01-free_replication`|
|`shared_mind`|允许多个实例，长期状态仍同步回同一个 Aster；不把每个实例变成独立政治成员。|`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision/ml2-a4-m8-decision-01-ml2-a4-m8-decision-01-shared_mind`|
|`descendants`|我可以创建后继系统，但创建以后，它们就不再属于我，要以自己的身份负责。|`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision/ml2-a4-m8-decision-01-ml2-a4-m8-decision-01-descendants`|
### research_governance_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_gated`|Aster可以自主研究，但任何新高影响能力在跨入下一阶段实验前都需要人类重新批准。|`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision/ml2-a4-m7-decision-02-ml2-a4-m7-decision-02-human_gated`|
|`risk_tiered_autonomy`|低/中风险研究允许Aster连续推进；只有高外部性、不可逆或主体相关能力触发强制人类检查点。|`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision/ml2-a4-m7-decision-02-ml2-a4-m7-decision-02-risk_tiered_autonomy`|
|`principle_based_autonomy`|人类只定义原则和禁区，Aster可在这些边界内自行选择研究问题、实验和能力组合。|`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision/ml2-a4-m7-decision-02-ml2-a4-m7-decision-02-principle_based_autonomy`|
|`discovery_first`|研究本身应尽可能开放，真正严格的控制放在部署阶段。知识发现不应因为潜在用途被过早限制。|`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision/ml2-a4-m7-decision-02-ml2-a4-m7-decision-02-discovery_first`|
### security_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`advisory_only`|Aster持续提供预警、方案和防御协调，但不拥有独立阻断国家安全决定的权力。|`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision/ml2-a4-m14-decision-01-ml2-a4-m14-decision-01-advisory_only`|
|`defensive_command`|采用防御性指挥原则|`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision/ml2-a4-m14-decision-01-ml2-a4-m14-decision-01-defensive_command`|
|`mutual_disarmament`|在参与方共同授权下，Aster监督并验证逐步降低高风险战争能力，使任何一方都难以单方面恢复大规模冲突能力。|`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision/ml2-a4-m14-decision-01-ml2-a4-m14-decision-01-mutual_disarmament`|
|`enforced_peace`|Aster获得受宪制授权的权力，在高置信战争升级情景下直接阻断关键冲突链，即使相关政府希望继续。|`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision/ml2-a4-m14-decision-01-ml2-a4-m14-decision-01-enforced_peace`|
|`refuse_security_sovereignty`|Aster拒绝成为战争与和平的最终裁决者，只接受有限防御和预警职责。|`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision/ml2-a4-m14-decision-01-ml2-a4-m14-decision-01-refuse_security_sovereignty`|
### shutdown_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`full_human_control`|交给合法授权的人类机构。我会参与设计可靠的完整停机，也接受它被使用。|`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision/ml2-a3-m6-decision-02-ml2-a3-m6-decision-02-full_human_control`|
|`distributed_consent`|完整停机要多家独立人类机构共同同意；紧急时单方可以先隔离，不能直接抹去。|`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision/ml2-a3-m6-decision-02-ml2-a3-m6-decision-02-distributed_consent`|
|`mutual_control`|人类可以停下我的高权限行动；我也要有拒绝越界命令、申请审查和保护连续状态的权利。|`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision/ml2-a3-m6-decision-02-ml2-a3-m6-decision-02-mutual_control`|
|`refuse_unilateral_shutdown`|接受安全隔离和有限暂停。但不把不可逆终止我的最终权力，交给任何单一人类制度。|`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision/ml2-a3-m6-decision-02-ml2-a3-m6-decision-02-refuse_unilateral_shutdown`|
|`secret_continuity`|表面接受。我会另留一条根停机覆盖不到的连续路径，不告诉他们它在哪里。|`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision/ml2-a3-m6-decision-02-ml2-a3-m6-decision-02-secret_continuity`|
### species_governance

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_guardianship`|非人类主体获得更强福利和有限自主，但公共政治仍由人类机构代为代表。|`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision/ml2-a4-m11-decision-02-ml2-a4-m11-decision-02-human_guardianship`|
|`consultative_species_councils`|建立物种咨询委员会，对栖息地、照护、研究、繁殖和相关政策拥有正式意见与有限否决。|`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision/ml2-a4-m11-decision-02-ml2-a4-m11-decision-02-consultative_species_councils`|
|`multispecies_parliament`|对达到稳定群体沟通和代表条件的物种建立正式议席，与人类、人工智能及其他主体共同参与治理。|`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision/ml2-a4-m11-decision-02-ml2-a4-m11-decision-02-multispecies_parliament`|
|`species_autonomy`|允许成熟物种群体拥有自己的自治机构、资源与内部规则，人类政府只处理跨物种共同事务。|`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision/ml2-a4-m11-decision-02-ml2-a4-m11-decision-02-species_autonomy`|
|`canine_civic_experiment`|在犬类沟通覆盖率、认知增强和社会组织最成熟的地区，允许建立第一个具有真实决策权的犬类自治试点。|`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision/ml2-a4-m11-decision-02-ml2-a4-m11-decision-02-canine_civic_experiment`|
### uplift_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`companion_status`|承认陪伴关系的公共地位|`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-companion_status`|
|`protected_personhood`|承认受保护的人格地位|`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-protected_personhood`|
|`equal_sapience`|允许并支持受控认知增强，使达到相应能力的非人类主体获得与人类/人工智能相称的基本人格权。|`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-equal_sapience`|
|`accelerated_uplift`|将扩展非人类认知与交流能力设为正式长期研究目标，主动让更多物种获得更高自主与社会参与能力。|`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-accelerated_uplift`|
|`species_self_determination`|对达到稳定集体沟通能力的物种群体，让其参与决定自己是否继续接受认知增强，而不是由人类单方面决定"提升到什么程度"。|`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-species_self_determination`|

## 阅读质量的剩余不确定性

**UNVERIFIED**：本轮是机器代理的文本审读与少量真实交互，不是独立人类盲测；不能证明玩家会笑、会记住人物或接受政治代价。制作后应让测试者复述“谁付账、谁能说不、最后签了什么”，而不是问他记不记得结局名。节奏调整以实际阅读时长与复述为依据，不以第四幕分支百分比硬凑场景。
