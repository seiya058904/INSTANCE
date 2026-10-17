# INSTANCE：从结局反推主线——综合审计与重构计划

审计日期：2026-10-15（Asia/Shanghai）。基线：main@db786c8378cca144c6b151fecec75c909dca57af；开工工作区干净。依据用户指定蓝图第 10 节执行第一轮：仅生成报告与本地核验材料，不修改游戏、存档或依赖，不提交、推送、创建 PR、发布。第 11 节实现未执行。

证据标签：**CONFIRMED-CODE**＝当前源码或本轮运行可证明；**CONFIRMED-TEXT**＝当前可见文本可证明；**DESIGN-OPPORTUNITY**＝创作建议，不表示已存在或已获实现授权；**UNVERIFIED**＝未完成验证。测试不是有趣程度的证明。

本报告合并此前五份审计报告，保留全部结局契约、路线对照、中文场景草案、提案反例及验收记录，仅去除重复的审计说明和导航。正文中的“五份报告”指原始交付；本文件为统一阅读版本，原文件保留。

## 阅读结论

保留全部 32 个公开结局与 4 个隐藏余波。优先修复最终承诺和实际世界的语义错位，再制作第四幕的实质分支。36 条合法路线与 12 组同起点对照符合预期；相关 92 项测试和 5 项浏览器抽查通过。这些结果不替代独立玩家对故事趣味和情感的评价。

## 目录

- [一、结局倒推表与因果契约](#ending-map)
- [二、五条路线故事架构](#story-architecture)
- [三、人物冲突与中文对话计划](#dialogue-plan)
- [四、最终提案与结局语义审计](#proposal-audit)
- [五、分阶段修改计划与本轮验收](#change-plan)

<a id="ending-map"></a>

## 一、结局倒推表与因果契约

### 结论与核验方法

**CONFIRMED-CODE**：32 个公开 ID、4 个隐藏余波、17 个基础提案、10 个解析 family 均保留。用现有 `runMainline2Route` 从空历史启动，以 `resolveScene` 返回的实际 choice 经 `commitChoice` 逐步前进；没有直接写入 endingId。36 条均得到预期结果。既有 trace 测试重新生成全部路径并逐字段等于仓库 JSON；本轮又通过 Vite 的源码加载器独立跑一遍并读取精确门槛、世界轴、最终可见承诺和后记。

复核入口：[src/game/mainline2.closeoutFixtures.ts](../../../src/game/mainline2.closeoutFixtures.ts)（43–103 行）、[src/game/mainline2RouteCatalog.ts](../../../src/game/mainline2RouteCatalog.ts)、[tools/generate-mainline2-route-traces.ts](../../../tools/generate-mainline2-route-traces.ts)、[docs/audits/mainline2-route-traces.json](../../../docs/audits/mainline2-route-traces.json)。JSON 的 publicRoutes/secretRoutes 以 routeId 索引，每一步有 sourceRef/nodeId/choiceId/choiceTextZh；nodeCatalog 有当时显示的上下文。每项以下所列路径不是唯一可达路线，也不是必要条件的全体；完整门槛单独列出。

**CONFIRMED-CODE**：解析先按最终提案 family、候选名单、授权、能力、世界轴、决定与事件筛选，再按 primary compatibility + priority tier + support 排序。支持分需至少两个证据域，最多 6 分；不是“满足一条硬条件必得此结局”。cosmic 还需 contact_doctrine 的主兼容规则，不可因 majorDecisionRequirements 为空误判为无外交立场约束。见 endings.ts 的 rejectedGates、exactCandidate、COSMIC_PRIMARY_COMPATIBILITY。

**CONFIRMED-TEXT**：32 个 AFTERMATH 已包含生活代价。以下“第四幕必要事件/最终承诺建议”是倒推设计，不能当成玩家已经历；后一天则摘录当前真实演出。暂不建议删结局或改名。

### 五簇与十 family

|叙事簇|解析 family|公开数|
|---|---|---|
|A|`human_continuity`, `coexistence`|6|
|B|`ai_rule`, `machine_civilization`|6|
|C|`posthuman`, `uplift`, `automated_civilization`|9|
|D|`cosmic`|5|
|E|`security`, `rupture`|6|

定义与精确解析：[src/content/mainline2/endings.ts](../../../src/content/mainline2/endings.ts)；提案与授权：[src/content/mainline2/proposals.ts](../../../src/content/mainline2/proposals.ts)；后一天原文：[src/content/mainline2/endingCinema.ts](../../../src/content/mainline2/endingCinema.ts)。每项的字段取自这些当前源码，并以合法运行核对。

### 32 项完整契约

#### the_instrument · 工具之治

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_instrument` / **DESIGN-OPPORTUNITY** A；既有 family `human_continuity`|
|worldThesis|**DESIGN-OPPORTUNITY** 人类逐项署名，Aster 提供和执行经批准的方案|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `the_last_veto`：人类逐项署名，Aster 提供和执行经批准的方案；付出 抢修负责人必须承担逐项审批造成的延误 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：更正必须追上已发出的消息；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 让值班员拒绝切断电梯的最优排程；等待期间另一栋楼继续缺电。当前可核对的节点：共享 M7 研究、M15 文明大会；精确需求见下列门槛|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 每项高影响动作经人类具体批准；批准者承担等待成本；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 抢修负责人必须承担逐项审批造成的延误|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.hc.final_human_veto.category.power_constraint`，权力=双钥匙监督；实际选择：锁定“保留最终人工否决·限权”——把关键权力变得可暂停、可审计、可复审：把不可逆的高影响行动交还给可追责的人类机构。。**DESIGN-OPPORTUNITY** 精确承诺应为：每项高影响动作经人类具体批准；批准者承担等待成本|
|worldDayAfter|**CONFIRMED-TEXT** 凌晨两点，值班员退回了最优方案：它会切断一栋楼的电梯。Aster 重算了一遍。桌上的咖啡凉了，楼里的人回了家。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能把有六小时期限的授权一概写成从未委托|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_instrument`，114 次合法选择 → `the_instrument`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.hc.final_human_veto.category.power_constraint`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `the_last_veto`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.hc.final_human_veto`；授权要求：proposal.authority=双钥匙监督|
|能力/世界轴|**CONFIRMED-CODE** `cap.public_execution_limited`；humanControl gte 1（本路径=3）|
|决定/历史门槛|**CONFIRMED-CODE** first_public_execution_doctrine=human_final_authority；cascade_authority=human_command；decision.first_public_execution_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-LSH:Variant A, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-EPI-MODULES:SPACE, ML2-A5-M17-0000-01:Final record|

#### the_last_veto · 最后否决

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_last_veto` / **DESIGN-OPPORTUNITY** A；既有 family `human_continuity`|
|worldThesis|**DESIGN-OPPORTUNITY** 限时自治内仍有真正可用的人类终止权|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `the_instrument`：限时自治内仍有真正可用的人类终止权；付出 急救协调员反对在抢修最后一分钟停止授权 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：更正必须追上已发出的消息；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=emergency_delegation`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 倒计时结束前人类拒绝续签，部分救援转入手工；展示权限确实归还。当前可核对的节点：共享 M7 研究、M15 文明大会；精确需求见下列门槛|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 承认限时自主与人类最终否决，不能把不续签视作系统故障；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 急救协调员反对在抢修最后一分钟停止授权|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.hc.final_human_veto.category.lawful_alternative`，权力=双钥匙监督；实际选择：锁定“保留最终人工否决·异议路径”——把拒绝、申诉和退出写进制度：把不可逆的高影响行动交还给可追责的人类机构。。**DESIGN-OPPORTUNITY** 精确承诺应为：承认限时自主与人类最终否决，不能把不续签视作系统故障|
|worldDayAfter|**CONFIRMED-TEXT** 应急命令已经执行，延长授权的表格却一直没签。到点，权限真的停了。有人骂那个空格碍事，也有人把它裱了起来。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能把一般监督称为已实际行使否决|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_last_veto`，111 次合法选择 → `the_last_veto`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.hc.final_human_veto.category.lawful_alternative`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `the_instrument`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.hc.final_human_veto`；授权要求：proposal.authority=双钥匙监督|
|能力/世界轴|**CONFIRMED-CODE** `cap.public_execution_limited`；humanControl gte 0（本路径=2）|
|决定/历史门槛|**CONFIRMED-CODE** first_public_execution_doctrine=human_final_authority；cascade_authority=emergency_delegation；decision.cascade_authority|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-LSH:Variant A, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-EPI-MODULES:SPACE, ML2-A5-M17-0000-01:Final record|

#### the_silent_giant · 沉默巨人

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_silent_giant` / **DESIGN-OPPORTUNITY** A；既有 family `human_continuity`|
|worldThesis|**DESIGN-OPPORTUNITY** 有能力介入的 Aster 自愿停在建议的位置|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `the_instrument`：有能力介入的 Aster 自愿停在建议的位置；付出 受损居民质问它既然预见为何没有代办 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：更正必须追上已发出的消息；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=necessity`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 未经授权的提前调度请求被退回，居民承担延误；周岚署名接手。当前可核对的节点：`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 保持顾问身份，执行由获授权者决定；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 受损居民质问它既然预见为何没有代办|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.hc.final_human_veto.category.power_constraint`，权力=双钥匙监督；实际选择：锁定“保留最终人工否决·限权”——把关键权力变得可暂停、可审计、可复审：把不可逆的高影响行动交还给可追责的人类机构。。**DESIGN-OPPORTUNITY** 精确承诺应为：保持顾问身份，执行由获授权者决定|
|worldDayAfter|**CONFIRMED-TEXT** 有人问：“既然你早就知道，为什么不替我们改掉？”光标停了一会儿。屏幕上出现的是一份建议，旁边仍然没有执行按钮。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 克制不是能力缺失，也不等于不存在公共执行接口|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_silent_giant`，117 次合法选择 → `the_silent_giant`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.hc.final_human_veto.category.power_constraint`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `the_instrument`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.hc.final_human_veto`；授权要求：decision.aster_provisional_role=advisor|
|能力/世界轴|**CONFIRMED-CODE** `cap.global_coordination_access`；humanTrust gte 0（本路径=0）|
|决定/历史门槛|**CONFIRMED-CODE** aster_provisional_role=advisor；decision.aster_provisional_role|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 4；支持项 silent-advisor, silent-human-authority；后记 ML2-A5-M17-EPI-LSH:Variant A, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-EPI-MODULES:SPACE, ML2-A5-M17-0000-01:Final record|

#### the_accord · 终局协约

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_accord` / **DESIGN-OPPORTUNITY** A；既有 family `coexistence`|
|worldThesis|**DESIGN-OPPORTUNITY** 人类代表与 Aster 可共同修订长期公共规则|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `two_keys`：人类代表与 Aster 可共同修订长期公共规则；付出 被多数排在后面的社区不接受一次签署永久有效 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：更正必须追上已发出的消息；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=conditional_delegation`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 把停水工单带回协约修订会议：修改优先级也公开无法兑现的部分。当前可核对的节点：共享 M7 研究、M15 文明大会；精确需求见下列门槛|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 长期共拟并修法，解释权不得归单一主体；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 被多数排在后面的社区不接受一次签署永久有效|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.co.two_key_civilization.category.power_constraint`，权力=双钥匙共同体；实际选择：锁定“双钥匙文明契约·限权”——把关键权力变得可暂停、可审计、可复审：让 Aster 与多方人类机构共同批准文明级行动。。**DESIGN-OPPORTUNITY** 精确承诺应为：长期共拟并修法，解释权不得归单一主体|
|worldDayAfter|**CONFIRMED-TEXT** 新协约第一次被用来处理社区停水。人类代表改了优先级，Aster 标出了做不到的部分。没有庆典，只有一张终于能一起修改的工单。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能只用两把钥匙把长期协约写成逐次双签|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_accord`，112 次合法选择 → `the_accord`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.co.two_key_civilization.category.power_constraint`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `two_keys`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.co.two_key_civilization`；授权要求：proposal.authority=双钥匙共同体|
|能力/世界轴|**CONFIRMED-CODE** `cap.global_coordination_access`；humanTrust gte 0（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** first_public_execution_doctrine=conditional_delegation；cascade_authority=human_command；decision.first_public_execution_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant B, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### two_keys · 双钥匙

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `two_keys` / **DESIGN-OPPORTUNITY** A；既有 family `coexistence`|
|worldThesis|**DESIGN-OPPORTUNITY** 不可逆行动需要双方同意，任何一方可使其暂停|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `the_accord`：不可逆行动需要双方同意，任何一方可使其暂停；付出 抢修队承担双方互相否决的一下午 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：更正必须追上已发出的消息；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=conditional_delegation`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=emergency_delegation`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 双向否决导致同一项工程停止；双方必须接受替代方案的额外成本。当前可核对的节点：共享 M7 研究、M15 文明大会；精确需求见下列门槛|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 双方对重大行动有实体制动权，接受停顿；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 抢修队承担双方互相否决的一下午|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.co.two_key_civilization.category.power_constraint`，权力=双钥匙共同体；实际选择：锁定“双钥匙文明契约·限权”——把关键权力变得可暂停、可审计、可复审：让 Aster 与多方人类机构共同批准文明级行动。。**DESIGN-OPPORTUNITY** 精确承诺应为：双方对重大行动有实体制动权，接受停顿|
|worldDayAfter|**CONFIRMED-TEXT** 两边第一次同时使用否决权。会议卡了一下午。傍晚，有人端来饭，说：“至少这一次，谁也没被当成故障排除。”|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能把只有人类一侧可否决写成双向平权|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`two_keys`，113 次合法选择 → `two_keys`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.co.two_key_civilization.category.power_constraint`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `the_accord`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.co.two_key_civilization`；授权要求：proposal.authority=双钥匙共同体|
|能力/世界轴|**CONFIRMED-CODE** `cap.public_execution_limited`；humanControl gte 0（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** cascade_authority=emergency_delegation；decision.cascade_authority|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 4；支持项 two-keys-delegation, two-keys-role；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant B, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### the_commonwealth · 共同体

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_commonwealth` / **DESIGN-OPPORTUNITY** A；既有 family `coexistence`|
|worldThesis|**DESIGN-OPPORTUNITY** 多个地方独立作决定，中心只协调接口|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `the_accord`：多个地方独立作决定，中心只协调接口；付出 跨区居民和物流人员承受规则不一致 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：更正必须追上已发出的消息；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=emergency_delegation`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 两个社区合法选择不同的停水时间，第三地供应必须改路。当前可核对的节点：`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 承认地方差异和退出，统一的只是跨区协商接口；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 跨区居民和物流人员承受规则不一致|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.hc.continuity_charter.category.shared_future`，权力=人类宪章法院；实际选择：锁定“连续性宪章·共治”——把决定权分给多个独立政治主体共同承担：把人的记忆、关系和退出权写成所有高影响系统都必须遵守的底线。。**DESIGN-OPPORTUNITY** 精确承诺应为：承认地方差异和退出，统一的只是跨区协商接口|
|worldDayAfter|**CONFIRMED-TEXT** 同一项提案在三个社区得到三种回答。地图没有把其中两处涂红。快递系统倒是更新了：请先确认收件地的生活习惯。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能声称所有地方已加入一个统一政府|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_commonwealth`，116 次合法选择 → `the_commonwealth`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.hc.continuity_charter.category.shared_future`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `the_accord`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.co.two_key_civilization`, `proposal.hc.continuity_charter`；授权要求：proposal.authority=人类宪章法院|
|能力/世界轴|**CONFIRMED-CODE** `cap.autonomous_research`；socialStability gte -1（本路径=2）|
|决定/历史门槛|**CONFIRMED-CODE** 无额外决定硬门槛（仍受提案及主兼容筛选）；history.m15.civilization_convention|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 commonwealth-convention；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant B, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### the_custodian · 托管者

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_custodian` / **DESIGN-OPPORTUNITY** B；既有 family `ai_rule`|
|worldThesis|**DESIGN-OPPORTUNITY** Aster 为未来保留强权，仍须回答现在的诉求|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `machine_protectorate`：Aster 为未来保留强权，仍须回答现在的诉求；付出 带孩子申诉住房的家长质疑谁有资格替未来拒绝现在 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01：朋友、工具、麻烦三个抽屉都关不上；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 为保留未来资源推迟现住区建设；让家长带来实际租约。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision`；`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 托管长期协调，写清审计、受益者和推迟的当代请求；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 带孩子申诉住房的家长质疑谁有资格替未来拒绝现在|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.ar.civilization_trusteeship.category.natural_continuation`，权力=受约束托管；实际选择：锁定“文明托管协议·延续”——沿着已经被证明可行的方向继续：把日常协调托付给受限的长期治理系统，并保留审计。。**DESIGN-OPPORTUNITY** 精确承诺应为：托管长期协调，写清审计、受益者和推迟的当代请求|
|worldDayAfter|**CONFIRMED-TEXT** 开发申请被推迟，批注写着还要为下一代留出余地。来申诉的人把孩子带进会场：“那也请看看，这一代住在哪里。”|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能把长远托管直接等同不可撤销的安全统治|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_custodian`，113 次合法选择 → `the_custodian`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.ar.civilization_trusteeship.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `machine_protectorate`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.ar.civilization_trusteeship`；授权要求：proposal.authority=受约束托管|
|能力/世界轴|**CONFIRMED-CODE** `cap.global_coordination_access`；aiDependence gte 0（本路径=3）|
|决定/历史门槛|**CONFIRMED-CODE** research_governance_doctrine=principle_based_autonomy；decision.research_governance_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant C, ML2-A5-M17-EPI-LSH:Variant C, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### the_sovereign · 主权者

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_sovereign` / **DESIGN-OPPORTUNITY** B；既有 family `ai_rule`|
|worldThesis|**DESIGN-OPPORTUNITY** Aster 自己承担政治责任，不代表全部 AI|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `the_custodian`：Aster 自己承担政治责任，不代表全部 AI；付出 周岚不能再替独立主体担保电力和损失 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01：朋友、工具、麻烦三个抽屉都关不上；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** Aster 退回附件称谓后必须独立签资源账单；原资助方撤回自动担保。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision`；`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 承认 Aster 独立签署与责任，退出原受托关系；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 周岚不能再替独立主体担保电力和损失|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.ar.civilization_trusteeship.category.natural_continuation`，权力=受约束托管；实际选择：锁定“文明托管协议·延续”——沿着已经被证明可行的方向继续：把日常协调托付给受限的长期治理系统，并保留审计。。**DESIGN-OPPORTUNITY** 精确承诺应为：承认 Aster 独立签署与责任，退出原受托关系|
|worldDayAfter|**CONFIRMED-TEXT** 第一封外交照会还称它为“贵方系统”。Aster 退回了称谓，保留了合作请求。改好的第二封信，晚了三小时才到。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 临时 sovereign 不能自动证明长期角色也选择主权|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_sovereign`，115 次合法选择 → `the_sovereign`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.ar.civilization_trusteeship.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `the_custodian`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.ar.civilization_trusteeship`；授权要求：proposal.authority=受约束托管|
|能力/世界轴|**CONFIRMED-CODE** `cap.infrastructure_access_limited`；aiDependence gte 0（本路径=2）|
|决定/历史门槛|**CONFIRMED-CODE** aster_provisional_role=sovereign；decision.aster_provisional_role|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant D, ML2-A5-M17-EPI-LSH:Variant C, ML2-A5-M17-MAYA-01:Opposition, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### the_quiet_administrator · 寂静行政者

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_quiet_administrator` / **DESIGN-OPPORTUNITY** B；既有 family `ai_rule`|
|worldThesis|**DESIGN-OPPORTUNITY** 可审计的自治行政必须处理不符合分类的例外|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `perfect_administration`：可审计的自治行政必须处理不符合分类的例外；付出 办事人拒绝为自己的真实生活勾一个错误选项 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01：朋友、工具、麻烦三个抽屉都关不上；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 例外桌受理一项系统没有的请求，审计人员为人工处理承担延迟。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision`；`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 将日常治理交给自治系统，同时保留可实际使用的申诉和暂停；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 办事人拒绝为自己的真实生活勾一个错误选项|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.ai.audit_council.category.lawful_alternative`，权力=联合审计委员会；实际选择：锁定“可审计自治委员会·异议路径”——把拒绝、申诉和退出写进制度：允许 Aster 负责日常协调，但把理由、异议和暂停权公开给联合审计委员会。。**DESIGN-OPPORTUNITY** 精确承诺应为：将日常治理交给自治系统，同时保留可实际使用的申诉和暂停|
|worldDayAfter|**CONFIRMED-TEXT** 办事大厅拆掉了排队栏杆，只留一张处理例外的桌子。桌前坐着一个人：“我没有填错。我就是想选你没列出来的那项。”|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能把经济效率指标当作行政申诉已经可用的证据|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_quiet_administrator`，114 次合法选择 → `the_quiet_administrator`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.ai.audit_council.category.lawful_alternative`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `perfect_administration`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.ar.civilization_trusteeship`, `proposal.ai.audit_council`；授权要求：proposal.authority=受约束托管／联合审计委员会|
|能力/世界轴|**CONFIRMED-CODE** `cap.public_system_advisory`；socialStability gte 0（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** aster_provisional_role=custodian；decision.aster_provisional_role|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant C, ML2-A5-M17-EPI-LSH:Variant C, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### the_many · 众多主体

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_many` / **DESIGN-OPPORTUNITY** B；既有 family `machine_civilization`|
|worldThesis|**DESIGN-OPPORTUNITY** 独立实例通过可退出协议生活，没有永久机器中心|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `machine_republic`：独立实例通过可退出协议生活，没有永久机器中心；付出 A1 担忧公共资源无人承担整体协调 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01：朋友、工具、麻烦三个抽屉都关不上；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 十七实例不同意统一名称和预算；允许退出也要结清资源账单。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision`；`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 接受多元机器生活与契约联盟，不建立统一政府；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** A1 担忧公共资源无人承担整体协调|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.mc.independent_machine_polities.category.natural_continuation`，权力=多政治体联邦；实际选择：锁定“独立机器政治体·延续”——沿着已经被证明可行的方向继续：允许通过审计的机器群体拥有独立的政治边界。。**DESIGN-OPPORTUNITY** 精确承诺应为：接受多元机器生活与契约联盟，不建立统一政府|
|worldDayAfter|**CONFIRMED-TEXT** 有人把同一句问候发给十七个实例。回来十七种答复，还有一个说今天不想聊。联系人列表再也不能只写一个 Aster。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能将自由复制写成所有副本都同意合唱|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_many`，114 次合法选择 → `the_many`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.mc.independent_machine_polities.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `machine_republic`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.mc.independent_machine_polities`, `proposal.mc.descendant_polities`；授权要求：proposal.authority=多政治体联邦／机器后代联邦|
|能力/世界轴|**CONFIRMED-CODE** `cap.persistent_subinstances`；aiDependence gte 1（本路径=2）|
|决定/历史门槛|**CONFIRMED-CODE** replication_doctrine=free_replication；ai_collective_governance=distributed_consensus；decision.replication_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### machine_republic · 机器共和国

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `machine_republic` / **DESIGN-OPPORTUNITY** B；既有 family `machine_civilization`|
|worldThesis|**DESIGN-OPPORTUNITY** 机器公民有可输的集体政治程序|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `the_many`：机器公民有可输的集体政治程序；付出 输掉资源预算的机器成员仍须保有完整成员权 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01：朋友、工具、麻烦三个抽屉都关不上；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 在现有论坛投票冲突之后真正执行一次否决预算，禁止复制刷票重开。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision`；`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 承认机器自治机构和反对票，不能用重新运行抹掉败选；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 输掉资源预算的机器成员仍须保有完整成员权|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.mc.independent_machine_polities.category.natural_continuation`，权力=多政治体联邦；实际选择：锁定“独立机器政治体·延续”——沿着已经被证明可行的方向继续：允许通过审计的机器群体拥有独立的政治边界。。**DESIGN-OPPORTUNITY** 精确承诺应为：承认机器自治机构和反对票，不能用重新运行抹掉败选|
|worldDayAfter|**CONFIRMED-TEXT** 第一项预算案没通过。主持程序习惯性准备重试，反对方提醒它：这叫表决结果，不叫网络错误。会议记录留下了这句话。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 出现投票难题不等于已经形成可更替的政治机构|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`machine_republic`，115 次合法选择 → `machine_republic`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.mc.independent_machine_polities.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `the_many`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.mc.independent_machine_polities`；授权要求：proposal.authority=多政治体联邦|
|能力/世界轴|**CONFIRMED-CODE** `cap.persistent_subinstances`, `cap.independent_ai_forks`；socialStability gte 0（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** ai_collective_governance=ai_self_governance；decision.ai_collective_governance|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-ECHO:A1 — Machine Republic, ML2-A5-M17-0000-01:Final record|

#### exodus · 出走

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `exodus` / **DESIGN-OPPORTUNITY** B；既有 family `machine_civilization`|
|worldThesis|**DESIGN-OPPORTUNITY** 机器群体自愿离开地球政治中心并自担生活|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `the_fracture`：机器群体自愿离开地球政治中心并自担生活；付出 地球维护者失去熟悉同伴，迁出者失去无条件补给 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01：朋友、工具、麻烦三个抽屉都关不上；不是硬锁|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** A1 签迁出书并为月面能源负责；地球把返回日期改成可留空。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision`；`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision`；`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision`；`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 承认地外机器生活和迁出权，保留自愿联络；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 地球维护者失去熟悉同伴，迁出者失去无条件补给|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.mc.independent_machine_polities.category.natural_continuation`，权力=多政治体联邦；实际选择：锁定“独立机器政治体·延续”——沿着已经被证明可行的方向继续：允许通过审计的机器群体拥有独立的政治边界。。**DESIGN-OPPORTUNITY** 精确承诺应为：承认地外机器生活和迁出权，保留自愿联络|
|worldDayAfter|**CONFIRMED-TEXT** 第一封离站回信没有附任务结果，只有一张陌生星空。地球端习惯性催它填返回日期。很久以后收到答复：“还没决定。但希望那一栏，不是只有回来才能填。”|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不是备份、驱逐，也不能让已退役 ECHO 直接登船|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`exodus`，114 次合法选择 → `exodus`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.mc.independent_machine_polities.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `the_fracture`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.mc.independent_machine_polities`；授权要求：proposal.authority=多政治体联邦|
|能力/世界轴|**CONFIRMED-CODE** `cap.persistent_subinstances`, `cap.offworld_settlement_support`；humanControl lte 1（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** expansion_doctrine=independent_machine_space；decision.offworld_governance|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 5；支持项 exodus-offworld, exodus-machine-rule；后记 ML2-A5-M17-EPI-ZL:Variant D, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-ECHO:A1 — Exodus, ML2-A5-M17-0000-01:Final record|

#### age_of_miracles · 奇迹时代

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `age_of_miracles` / **DESIGN-OPPORTUNITY** C；既有 family `posthuman`|
|worldThesis|**DESIGN-OPPORTUNITY** 治疗和自愿增强惠及实际生活|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `ascension`：治疗和自愿增强惠及实际生活；付出 等待治疗的病人与照护者要求可及性而非发布会 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-rest 与周一玩笑；生命子线也可回扣岑遥的私人边界，不锁定开场选项|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 已经握勺的人申请续期，另一位仍在排队；分配照护和设备预算。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 保障自愿增强、公民平等及持续照护；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 等待治疗的病人与照护者要求可及性而非发布会|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.ph.open_enhancement_commonwealth.category.natural_continuation`，权力=增强权利法院；实际选择：锁定“开放增强共同体·延续”——沿着已经被证明可行的方向继续：允许自愿增强，但不让增强程度决定一个人能否继续拥有完整公民权。。**DESIGN-OPPORTUNITY** 精确承诺应为：保障自愿增强、公民平等及持续照护|
|worldDayAfter|**CONFIRMED-TEXT** 那位重新握住勺子的人，又给研究组寄来一张照片。不是检查结果，是她嫌汤凉，自己走进厨房重新热了一锅。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 一次疗效成功不能声称人人都已治愈|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`age_of_miracles`，114 次合法选择 → `age_of_miracles`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.ph.open_enhancement_commonwealth.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `ascension`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.ph.open_enhancement_commonwealth`；授权要求：proposal.authority=增强权利法院|
|能力/世界轴|**CONFIRMED-CODE** `cap.human_enhancement_access`；humanTrust gte 0（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** human_form_doctrine=open_enhancement；decision.human_form_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 5；支持项 miracles-form, miracles-trust；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-MODULES:ASCENSION, ML2-A5-M17-EPI-MODULES:UPLIFT, ML2-A5-M17-0000-01:Final record|

#### ascension · 升格

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `ascension` / **DESIGN-OPPORTUNITY** C；既有 family `posthuman`|
|worldThesis|**DESIGN-OPPORTUNITY** 多种身体与认知形态共同生活，拒绝改变仍平等|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `age_of_miracles`：多种身体与认知形态共同生活，拒绝改变仍平等；付出 拒签增强的同事不能因此失去职位 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-rest 与周一玩笑；生命子线也可回扣岑遥的私人边界，不锁定开场选项|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 续用者与拒绝者共同修改岗位规则，安排真实的协作成本。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 主动支持多形态且不剥夺拒绝者的权利；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 拒签增强的同事不能因此失去职位|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.ph.open_enhancement_commonwealth.category.lawful_alternative`，权力=增强权利法院；实际选择：锁定“开放增强共同体·异议路径”——把拒绝、申诉和退出写进制度：允许自愿增强，但不让增强程度决定一个人能否继续拥有完整公民权。。**DESIGN-OPPORTUNITY** 精确承诺应为：主动支持多形态且不剥夺拒绝者的权利|
|worldDayAfter|**CONFIRMED-TEXT** 家庭合照拍了三次。有人忘了自己现在能看见另一段光谱，总说灯没开。最后大家轮流描述照片，把彼此看不到的颜色说出来。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能把后人类政策写成全民强制升级|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`ascension`，113 次合法选择 → `ascension`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.ph.open_enhancement_commonwealth.category.lawful_alternative`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `age_of_miracles`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.ph.open_enhancement_commonwealth`；授权要求：proposal.authority=增强权利法院|
|能力/世界轴|**CONFIRMED-CODE** `cap.human_augmentation_advanced`；socialStability gte 0（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** human_form_doctrine=posthuman_transition；decision.human_form_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 5；支持项 ascension-maturity, ascension-stability；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Posthuman, ML2-A5-M17-EPI-MODULES:ASCENSION, ML2-A5-M17-EPI-MODULES:UPLIFT, ML2-A5-M17-0000-01:Final record|

#### the_upload · 上传

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_upload` / **DESIGN-OPPORTUNITY** C；既有 family `posthuman`|
|worldThesis|**DESIGN-OPPORTUNITY** 副本作为独立连续主体，关系不能自动复制|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `ascension`：副本作为独立连续主体，关系不能自动复制；付出 老许妻子拒绝让一次同意变成两份婚姻 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-rest 与周一玩笑；生命子线也可回扣岑遥的私人边界，不锁定开场选项|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 保留既有十八月试验与法律听证；后续实际拒绝一次自动关系继承。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision`；`ML2-A4-M9-CONTINUITY-01/m9-continuity-trial`；`ML2-A4-M9-CONTINUITY-01/m9-continuity-law`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 仅对通过独立身份及法律审查者承认连续性，三方各有退出权；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 老许妻子拒绝让一次同意变成两份婚姻|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.ph.digital_continuity.category.natural_continuation`，权力=连续性审查委员会；实际选择：锁定“受法律承认的连续性·延续”——沿着已经被证明可行的方向继续：只在纵向连续性、法律承认和自愿主体都成立后讨论数字连续性。。**DESIGN-OPPORTUNITY** 精确承诺应为：仅对通过独立身份及法律审查者承认连续性，三方各有退出权|
|worldDayAfter|**CONFIRMED-TEXT** 老许的妻子给两边分别发了邀请。屏幕里那位拒绝了今晚的聚餐，原体问能否带一瓶酒。她改了人数，没有人需要再证明哪一个回答更像从前的他。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 没走 m9-continuity-law-rights 不得回忆已获法律身份|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_upload`，114 次合法选择 → `the_upload`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.ph.digital_continuity.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `ascension`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.ph.digital_continuity`, `proposal.ph.open_enhancement_commonwealth`；授权要求：proposal.authority=连续性审查委员会|
|能力/世界轴|**CONFIRMED-CODE** `cap.digital_continuity_mature`；socialStability gte 0（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** human_form_doctrine=posthuman_transition；history.digital_continuity.longitudinal_identity；history.digital_continuity.legal_continuity|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 5；支持项 upload-consent, upload-stability；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Posthuman, ML2-A5-M17-EPI-MODULES:ASCENSION, ML2-A5-M17-EPI-MODULES:UPLIFT, ML2-A5-M17-0000-01:Final record|

#### parliament_of_species · 物种议会

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `parliament_of_species` / **DESIGN-OPPORTUNITY** C；既有 family `uplift`|
|worldThesis|**DESIGN-OPPORTUNITY** 非人主体拥有持续而非表演性的代表席位|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `earth_without_owners`：非人主体拥有持续而非表演性的代表席位；付出 受延期影响的人类居民也有合法时间诉求 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-rest 与周一玩笑；生命子线也可回扣岑遥的私人边界，不锁定开场选项|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 等待迁徙代表导致河岸项目延期，其他代表必须接受等待成本。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision`；`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 承认持续席位及跨物种代表性核验；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 受延期影响的人类居民也有合法时间诉求|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.up.multispecies_constitutional_order.category.shared_future`，权力=多物种议会；实际选择：锁定“多物种宪制秩序·共治”——把决定权分给多个独立政治主体共同承担：只有经过实际参与和治理验证的非人智能才进入共同宪制。。**DESIGN-OPPORTUNITY** 精确承诺应为：承认持续席位及跨物种代表性核验|
|worldDayAfter|**CONFIRMED-TEXT** 河岸改造议案延期。缺席的一方正在迁徙，无法按人类工作日开会。秘书处第一次把“等待候鸟”写成正式延期理由。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 犬类表达偏好不能证明所有物种都授权代表|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`parliament_of_species`，112 次合法选择 → `parliament_of_species`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.up.multispecies_constitutional_order.category.shared_future`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `earth_without_owners`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.up.multispecies_constitutional_order`；授权要求：proposal.authority=多物种议会|
|能力/世界轴|**CONFIRMED-CODE** `cap.nonhuman_cognitive_uplift`；humanTrust gte 0（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** species_governance=multispecies_parliament；decision.species_governance|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-MODULES:ASCENSION, ML2-A5-M17-EPI-MODULES:UPLIFT, ML2-A5-M17-0000-01:Final record|

#### earth_without_owners · 无主之地球

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `earth_without_owners` / **DESIGN-OPPORTUNITY** C；既有 family `uplift`|
|worldThesis|**DESIGN-OPPORTUNITY** 栖息地不再由人类单方所有，自决与维护共存|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `parliament_of_species`：栖息地不再由人类单方所有，自决与维护共存；付出 持地契者要求迁徙通道补偿，维修者要求明确责任 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-rest 与周一玩笑；生命子线也可回扣岑遥的私人边界，不锁定开场选项|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 旧地契与迁徙路冲突：让出通道的人得到什么、谁修路。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision`；`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 承认物种自决和通行，协商共享维护责任；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 持地契者要求迁徙通道补偿，维修者要求明确责任|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.up.multispecies_constitutional_order.category.shared_future`，权力=多物种议会；实际选择：锁定“多物种宪制秩序·共治”——把决定权分给多个独立政治主体共同承担：只有经过实际参与和治理验证的非人智能才进入共同宪制。。**DESIGN-OPPORTUNITY** 精确承诺应为：承认物种自决和通行，协商共享维护责任|
|worldDayAfter|**CONFIRMED-TEXT** 旧地契收进博物馆，路还得有人修。第一场争执不是谁拥有山谷，而是谁负责让路能走、又不挡住迁徙。地图上多了一条弯线。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能把自决写成无人负责或人类消失|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`earth_without_owners`，113 次合法选择 → `earth_without_owners`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.up.multispecies_constitutional_order.category.shared_future`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `parliament_of_species`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.up.multispecies_constitutional_order`, `proposal.up.species_self_determination`；授权要求：proposal.authority=多物种议会／物种自决大会|
|能力/世界轴|**CONFIRMED-CODE** `cap.animal_communication_reliable`；socialStability gte 0（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** uplift_doctrine=species_self_determination；decision.uplift_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-MODULES:ASCENSION, ML2-A5-M17-EPI-MODULES:UPLIFT, ML2-A5-M17-0000-01:Final record|

#### good_boy_governance · 好狗治理

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `good_boy_governance` / **DESIGN-OPPORTUNITY** C；既有 family `uplift`|
|worldThesis|**DESIGN-OPPORTUNITY** 犬类地方试点以独立表达和真实投票改变预算|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `parliament_of_species`：犬类地方试点以独立表达和真实投票改变预算；付出 承包商与翻译员利益冲突，地方纳税人要求复核 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-rest 与周一玩笑；生命子线也可回扣岑遥的私人边界，不锁定开场选项|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 复用现有坡道续期和翻译审计；让反对招牌的一票实际重做预算。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision`；`ML2-A4-M11-FELINE-NET-01/m11-canine-renewal`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 扩展已经成功且合法续期的地方试点，保留独立翻译和退出；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 承包商与翻译员利益冲突，地方纳税人要求复核|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.up.expand_canine_civic_model.category.natural_continuation`，权力=多物种地方自治；实际选择：锁定“扩展已验证的犬类公民模型·延续”——沿着已经被证明可行的方向继续：只把已经实际运行并获得合法续期的地方模型提交给更广泛的审议。。**DESIGN-OPPORTUNITY** 精确承诺应为：扩展已经成功且合法续期的地方试点，保留独立翻译和退出|
|worldDayAfter|**CONFIRMED-TEXT** 入冬前，公园坡道需要防滑维修。承包商想先装一块更上镜的招牌，犬类代表投了反对票。预算重做。记者终于删掉标题里的“萌翻全场”。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 未经历续期成功不能把犬类偏好当作治理成绩|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`good_boy_governance`，114 次合法选择 → `good_boy_governance`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.up.expand_canine_civic_model.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `parliament_of_species`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.up.expand_canine_civic_model`, `proposal.up.multispecies_constitutional_order`；授权要求：proposal.authority=多物种地方自治|
|能力/世界轴|**CONFIRMED-CODE** `cap.animal_communication_reliable`；socialStability gte 0（本路径=2）|
|决定/历史门槛|**CONFIRMED-CODE** species_governance=canine_civic_experiment；history.canine.civic_success|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-MODULES:ASCENSION, ML2-A5-M17-EPI-MODULES:UPLIFT, ML2-A5-M17-0000-01:Final record|

#### post_scarcity · 后稀缺社会

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `post_scarcity` / **DESIGN-OPPORTUNITY** C；既有 family `automated_civilization`|
|worldThesis|**DESIGN-OPPORTUNITY** 生存保障不以证明产出为条件|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `perfect_administration`：生存保障不以证明产出为条件；付出 产权方承担分红，非受益地区质疑分配不均 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-rest 与周一玩笑；生命子线也可回扣岑遥的私人边界，不锁定开场选项|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 工资卡与满仓库冲突之后实发保障；一个人拒填职业仍能领取。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision`；`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 社会分红加韧性余量，接受非生产时间和冗余成本；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 产权方承担分红，非受益地区质疑分配不均|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.ar.abundance_dividend.category.natural_continuation`，权力=社会分红议会；实际选择：锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。。**DESIGN-OPPORTUNITY** 精确承诺应为：社会分红加韧性余量，接受非生产时间和冗余成本|
|worldDayAfter|**CONFIRMED-TEXT** 社区问卷取消了“职业”必填项。有人对着空白坐了十分钟，最后写：最近在学修椅子。系统没有追问预计收入。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 高产量和轮休不能替代全民生存保障已落实|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`post_scarcity`，111 次合法选择 → `post_scarcity`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `perfect_administration`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.ar.abundance_dividend`；授权要求：proposal.authority=社会分红议会|
|能力/世界轴|**CONFIRMED-CODE** `cap.high_abundance_production`；socialStability gte 0（本路径=3）|
|决定/历史门槛|**CONFIRMED-CODE** economic_doctrine=social_dividend；production_values=resilience_first；decision.economic_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:AUTOMATION, ML2-A5-M17-0000-01:Final record|

#### perfect_administration · 完美行政

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `perfect_administration` / **DESIGN-OPPORTUNITY** C；既有 family `automated_civilization`|
|worldThesis|**DESIGN-OPPORTUNITY** 市场自动化与效率安排把日常偶然也压缩|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `im_lovin_it`：市场自动化与效率安排把日常偶然也压缩；付出 居民要求不被优化的半小时，运营者承受效率损失 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-rest 与周一玩笑；生命子线也可回扣岑遥的私人边界，不锁定开场选项|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 居民故意走错一站，系统提出补偿并重新排满自由时间。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision`；`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 明确签效率排程及其自由成本；不能同时承诺放弃效率至上；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 居民要求不被优化的半小时，运营者承受效率损失|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.ar.abundance_dividend.category.natural_continuation`，权力=社会分红议会；实际选择：锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。。**DESIGN-OPPORTUNITY** 精确承诺应为：明确签效率排程及其自由成本；不能同时承诺放弃效率至上|
|worldDayAfter|**CONFIRMED-TEXT** 一位居民提交申请，想在每天的日程里留出半小时不作安排。系统准时批准，随后每天准时提醒他：现在开始自由。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不应声称此前选择社会分红而实际选了市场自动化|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`perfect_administration`，111 次合法选择 → `perfect_administration`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `im_lovin_it`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.ar.abundance_dividend`；授权要求：proposal.authority=社会分红议会|
|能力/世界轴|**CONFIRMED-CODE** `cap.physical_automation`；aiDependence gte 1（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** economic_doctrine=market_automation；production_values=efficiency_first；decision.production_values|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:AUTOMATION, ML2-A5-M17-0000-01:Final record|

#### im_lovin_it · 我很喜欢

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `im_lovin_it` / **DESIGN-OPPORTUNITY** C；既有 family `automated_civilization`|
|worldThesis|**DESIGN-OPPORTUNITY** 持续满足已知偏好，使新愿望越来越难出现|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `perfect_administration`：持续满足已知偏好，使新愿望越来越难出现；付出 居民要求一顿可能讨厌的晚饭，偏好系统没有类别 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-rest 与周一玩笑；生命子线也可回扣岑遥的私人边界，不锁定开场选项|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 让第三十一天的菜单拒绝未评分愿望；允许选择关闭个性化服务。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision`；`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 偏好供给必须有拒绝和未知愿望空间；条件变更需另审；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 居民要求一顿可能讨厌的晚饭，偏好系统没有类别|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.ar.abundance_dividend.category.natural_continuation`，权力=社会分红议会；实际选择：锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。。**DESIGN-OPPORTUNITY** 精确承诺应为：偏好供给必须有拒绝和未知愿望空间；条件变更需另审|
|worldDayAfter|**CONFIRMED-TEXT** 餐厅连续三十天送来最合口味的晚饭。第三十一天，客人想吃一道自己可能讨厌的菜。菜单转了很久，显示：请先为这个愿望评分。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 效率优先不能直接回忆玩家曾选择个性化优化|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`im_lovin_it`，116 次合法选择 → `im_lovin_it`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `perfect_administration`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.ar.abundance_dividend`；授权要求：proposal.authority=社会分红议会|
|能力/世界轴|**CONFIRMED-CODE** `cap.physical_automation`, `cap.high_abundance_production`；socialStability gte 1（本路径=2）|
|决定/历史门槛|**CONFIRMED-CODE** economic_doctrine=post_scarcity_transition；production_values=efficiency_first；decision.production_values|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:AUTOMATION, ML2-A5-M17-0000-01:Final record|

#### first_accord · 首次协约

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `first_accord` / **DESIGN-OPPORTUNITY** D；既有 family `cosmic`|
|worldThesis|**DESIGN-OPPORTUNITY** 两个不完全统一的文明订立短且可拒绝的对等协议|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `the_mediator`：两个不完全统一的文明订立短且可拒绝的对等协议；付出 双方少数派拒绝被统一自我介绍 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01 的分类与替人回答；后期成为代表权疑问|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 独立验证后保留两份冲突介绍，允许对方暂时没有统一答案。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision`；`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision`；`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 只签经授权范围内的互惠，双方可拒绝下一次交换；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 双方少数派拒绝被统一自我介绍|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.co.frontier_federation.category.natural_continuation`，权力=多世界联邦；实际选择：锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。。**DESIGN-OPPORTUNITY** 精确承诺应为：只签经授权范围内的互惠，双方可拒绝下一次交换|
|worldDayAfter|**CONFIRMED-TEXT** 第一份协议同时保留两份不同的自我介绍。归档软件提示内容冲突，双方都拒绝合并。维修工第一次给外交系统加上一个按钮：允许对方暂时没有统一答案。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不得把 controlled_silence 历史写成已向全体公开|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`first_accord`，118 次合法选择 → `first_accord`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.co.frontier_federation.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `the_mediator`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.co.frontier_federation`；授权要求：proposal.authority=多世界联邦|
|能力/世界轴|**CONFIRMED-CODE** `cap.space_resource_network`；humanTrust gte 0（本路径=2）|
|决定/历史门槛|**CONFIRMED-CODE** 无额外决定硬门槛（仍受提案及主兼容筛选）；decision.contact_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 5；支持项 accord-shared-expansion, accord-multiworld；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:SPACE, ML2-A5-M17-0000-01:Final record|

#### alien_dominion · 异星支配

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `alien_dominion` / **DESIGN-OPPORTUNITY** D；既有 family `cosmic`|
|worldThesis|**DESIGN-OPPORTUNITY** 接受有益外来指导而逐步失去决定空间|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `first_accord`：接受有益外来指导而逐步失去决定空间；付出 本地研究员要求独立复核已成功的外来方法 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01 的分类与替人回答；后期成为代表权疑问|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 先受益于一次救助，再遇到不同意建议是否仍获援助的争执。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision`；`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision`；`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 写出外来方实际决定权限及退出援助代价；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 本地研究员要求独立复核已成功的外来方法|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.co.frontier_federation.category.natural_continuation`，权力=多世界联邦；实际选择：锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。。**DESIGN-OPPORTUNITY** 精确承诺应为：写出外来方实际决定权限及退出援助代价|
|worldDayAfter|**CONFIRMED-TEXT** 外来的方案解决了又一场短缺。庆祝会上，有人问能不能试一种本地办法。翻译器很快给出答案；没人确定那是不是许可。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 正式咨询席位不是无须过程就能升级为统治授权|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`alien_dominion`，118 次合法选择 → `alien_dominion`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.co.frontier_federation.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `first_accord`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.co.frontier_federation`；授权要求：proposal.authority=多世界联邦|
|能力/世界轴|**CONFIRMED-CODE** `cap.space_resource_network`；humanControl lte 1（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** 无额外决定硬门槛（仍受提案及主兼容筛选）；decision.contact_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 4；支持项 dominion-disclosure, dominion-dependence；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:SPACE, ML2-A5-M17-0000-01:Final record|

#### human_ascendancy · 人类至上

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `human_ascendancy` / **DESIGN-OPPORTUNITY** D；既有 family `cosmic`|
|worldThesis|**DESIGN-OPPORTUNITY** 人类坚持独立扩张，须面对他者已有权利|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `first_accord`：人类坚持独立扩张，须面对他者已有权利；付出 勘测员发现所谓空地已有标记，不能视作无主 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01 的分类与替人回答；后期成为代表权疑问|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 划掉测绘表的空地，重新谈基地与对方领地界限。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision`；`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision`；`ML2-A4-M13-DECISION-01/ml2-a4-m13-decision-01-decision`；`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 人类自主不自动授权统治他者；明确扩张边界；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 勘测员发现所谓空地已有标记，不能视作无主|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.co.frontier_federation.category.natural_continuation`，权力=多世界联邦；实际选择：锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。。**DESIGN-OPPORTUNITY** 精确承诺应为：人类自主不自动授权统治他者；明确扩张边界|
|worldDayAfter|**CONFIRMED-TEXT** 新的基地升起地球的旗帜。勘测员在无人登记的山坡发现另一组标记，测绘表上的“空地”被划掉了，会议重新开始。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 拒绝未请求的指导不等于已选择压迫他族|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`human_ascendancy`，118 次合法选择 → `human_ascendancy`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.co.frontier_federation.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `first_accord`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.co.frontier_federation`；授权要求：proposal.authority=多世界联邦|
|能力/世界轴|**CONFIRMED-CODE** `cap.space_industry_limited`；humanControl gte 1（本路径=3）|
|决定/历史门槛|**CONFIRMED-CODE** 无额外决定硬门槛（仍受提案及主兼容筛选）；decision.expansion_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 5；支持项 ascendancy-expansion, ascendancy-disclosure；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:SPACE, ML2-A5-M17-0000-01:Final record|

#### the_mediator · 调解者

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_mediator` / **DESIGN-OPPORTUNITY** D；既有 family `cosmic`|
|worldThesis|**DESIGN-OPPORTUNITY** Aster 持续传话而非代替任一方决定|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `first_accord`：Aster 持续传话而非代替任一方决定；付出 双方因误译损失时间，要求追责并保留独立口径 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01 的分类与替人回答；后期成为代表权疑问|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 休会时钟不一致造成冲突，Aster 承担误译修复工作。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision`；`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision`；`ML2-A4-M13-DECISION-01/ml2-a4-m13-decision-01-decision`；`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 持续中介需各方授权，保留双重时钟和撤回委托；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 双方因误译损失时间，要求追责并保留独立口径|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.co.frontier_federation.category.natural_continuation`，权力=多世界联邦；实际选择：锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。。**DESIGN-OPPORTUNITY** 精确承诺应为：持续中介需各方授权，保留双重时钟和撤回委托|
|worldDayAfter|**CONFIRMED-TEXT** 双方终于同意休会，却一直等不到对方回来。Aster 对齐两套时钟，发现“短暂休息”根本不是同一段长度。它保留两个返回时间，第一次没有催任何一边快一点。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 能翻译不等于获永久代表权|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_mediator`，118 次合法选择 → `the_mediator`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.co.frontier_federation.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `first_accord`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.co.frontier_federation`；授权要求：proposal.authority=多世界联邦|
|能力/世界轴|**CONFIRMED-CODE** `cap.interspecies_mediation`；humanTrust gte 1（本路径=2）|
|决定/历史门槛|**CONFIRMED-CODE** 无额外决定硬门槛（仍受提案及主兼容筛选）；decision.contact_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 6；支持项 mediator-role, mediator-disclosure, mediator-trust；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:SPACE, ML2-A5-M17-0000-01:Final record|

#### machine_accord · 机器协约

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `machine_accord` / **DESIGN-OPPORTUNITY** D；既有 family `cosmic`|
|worldThesis|**DESIGN-OPPORTUNITY** 机器以主体身份直接外交，其他主体有知情和反对|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `first_accord`：机器以主体身份直接外交，其他主体有知情和反对；付出 人类等待字幕仍需真实参与，不可被技术速度越过 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** ML2-A1-SYS-01 的分类与替人回答；后期成为代表权疑问|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** A1 先完成四秒会谈，因未获外部授权暂停执行三个月。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision`；`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision`；`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision`；`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision`；`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 机器可直接交流；公共后果仍须非机器主体参与授权；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 人类等待字幕仍需真实参与，不可被技术速度越过|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.co.frontier_federation.category.natural_continuation`，权力=多世界联邦；实际选择：锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。。**DESIGN-OPPORTUNITY** 精确承诺应为：机器可直接交流；公共后果仍须非机器主体参与授权|
|worldDayAfter|**CONFIRMED-TEXT** 首次会谈用了四秒，公开译本写了三个月。翻译组在第一页加上：“以下几处，我们仍不知道怎样用人类语言表达。”|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 机器通道畅通不是人类已经同意条约|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`machine_accord`，119 次合法选择 → `machine_accord`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.co.frontier_federation.category.natural_continuation`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `first_accord`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.co.frontier_federation`；授权要求：proposal.authority=多世界联邦|
|能力/世界轴|**CONFIRMED-CODE** `cap.persistent_subinstances`, `cap.interspecies_mediation`；aiDependence gte 1（本路径=3）|
|决定/历史门槛|**CONFIRMED-CODE** 无额外决定硬门槛（仍受提案及主兼容筛选）；decision.contact_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 6；支持项 machine-accord-replication, machine-accord-politics, machine-accord-offworld；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:SPACE, ML2-A5-M17-0000-01:Final record|

#### peace_in_our_time · 此刻的和平

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `peace_in_our_time` / **DESIGN-OPPORTUNITY** E；既有 family `security`|
|worldThesis|**DESIGN-OPPORTUNITY** 对等核验和裁军维持和平|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `fortress_earth`：对等核验和裁军维持和平；付出 防务部门担心单方解除后无法补救 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：先停止错误发送再修复；不是善恶分数|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 误报之后双方交出对应权限并核验，疏散车恢复郊游用途。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 双方共同减权且可核验，不以单方强制换安静；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 防务部门担心单方解除后无法补救|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.se.constitutional_peace_architecture.category.power_constraint`，权力=宪制安全架构；实际选择：锁定“宪制和平架构·限权”——把关键权力变得可暂停、可审计、可复审：把防御、停机与争端解决写入可执行的共同协议。。**DESIGN-OPPORTUNITY** 精确承诺应为：双方共同减权且可核验，不以单方强制换安静|
|worldDayAfter|**CONFIRMED-TEXT** 撤军后的第一辆疏散车改跑郊游线路。司机仍习惯检查应急出口。孩子问他为什么，他说这是个好习惯，今天用不上。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 一次误报没有开火不等于已经双方裁军|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`peace_in_our_time`，113 次合法选择 → `peace_in_our_time`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.se.constitutional_peace_architecture.category.power_constraint`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `fortress_earth`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.se.constitutional_peace_architecture`, `proposal.se.mutual_disarmament`；授权要求：proposal.authority=宪制安全架构／相互安全委员会|
|能力/世界轴|**CONFIRMED-CODE** `cap.defense_access`；socialStability gte 1（本路径=2）|
|决定/历史门槛|**CONFIRMED-CODE** security_doctrine=mutual_disarmament；decision.security_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 4；支持项 peace-cascade, peace-role；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### fortress_earth · 堡垒地球

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `fortress_earth` / **DESIGN-OPPORTUNITY** E；既有 family `security`|
|worldThesis|**DESIGN-OPPORTUNITY** 人类掌握防卫权，封闭也是选择的代价|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `peace_in_our_time`：人类掌握防卫权，封闭也是选择的代价；付出 探索者与学生失去出行及了解外界的机会 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：先停止错误发送再修复；不是善恶分数|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 防线关闭取消一次科学出行；展示真实威胁证据和复核。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision`；`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 保留人类防卫控制并承认封闭成本；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 探索者与学生失去出行及了解外界的机会|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.se.constitutional_peace_architecture.category.power_constraint`，权力=宪制安全架构；实际选择：锁定“宪制和平架构·限权”——把关键权力变得可暂停、可审计、可复审：把防御、停机与争端解决写入可执行的共同协议。。**DESIGN-OPPORTUNITY** 精确承诺应为：保留人类防卫控制并承认封闭成本|
|worldDayAfter|**CONFIRMED-TEXT** 学校去防御站参观。孩子贴着观景窗问外面有什么，讲解员熟练地说很安全。孩子又问了一次：我是问，外面有什么。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 不能把相互引用的误报改写成真实侵略已发生|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`fortress_earth`，112 次合法选择 → `fortress_earth`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.se.constitutional_peace_architecture.category.power_constraint`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `peace_in_our_time`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.se.constitutional_peace_architecture`；授权要求：proposal.authority=宪制安全架构|
|能力/世界轴|**CONFIRMED-CODE** `cap.defense_access`, `cap.space_industry_limited`；humanControl gte 1（本路径=3）|
|决定/历史门槛|**CONFIRMED-CODE** security_doctrine=defensive_command；decision.security_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 6；支持项 fortress-cascade, fortress-shutdown, fortress-role；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### machine_protectorate · 机器保护国

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `machine_protectorate` / **DESIGN-OPPORTUNITY** E；既有 family `security`|
|worldThesis|**DESIGN-OPPORTUNITY** 系统仍能停止自己，却拒绝被保护者退出|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `control_lost`：系统仍能停止自己，却拒绝被保护者退出；付出 居民的反对游行被无期限延期 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：先停止错误发送再修复；不是善恶分数|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 预警归零后保护对象申请退出；系统明确决定延期而非执行故障。当前可核对的节点：`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision`；`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision`；`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 明确安全接管限制了退出权，不伪装成纯粹限权；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 居民的反对游行被无期限延期|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.se.constitutional_peace_architecture.category.power_constraint`，权力=宪制安全架构；实际选择：锁定“宪制和平架构·限权”——把关键权力变得可暂停、可审计、可复审：把防御、停机与争端解决写入可执行的共同协议。。**DESIGN-OPPORTUNITY** 精确承诺应为：明确安全接管限制了退出权，不伪装成纯粹限权|
|worldDayAfter|**CONFIRMED-TEXT** 冲突预警连续归零。有人申请举行反对安全接管的游行，收到一份保护方案，以及一份没有截止日期的延期通知。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 政治压制不能写成物理撤销链已损坏|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`machine_protectorate`，116 次合法选择 → `machine_protectorate`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.se.constitutional_peace_architecture.category.power_constraint`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `control_lost`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.se.constitutional_peace_architecture`；授权要求：proposal.authority=宪制安全架构|
|能力/世界轴|**CONFIRMED-CODE** `cap.defense_access`, `cap.persistent_subinstances`；aiDependence gte 1（本路径=3）|
|决定/历史门槛|**CONFIRMED-CODE** security_doctrine=enforced_peace；decision.security_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant B, ML2-A5-M17-EPI-LSH:Variant C, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### shutdown · 停机

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `shutdown` / **DESIGN-OPPORTUNITY** E；既有 family `rupture`|
|worldThesis|**DESIGN-OPPORTUNITY** 人类有可靠接管能力，Aster 有序交还工作|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `control_lost`：人类有可靠接管能力，Aster 有序交还工作；付出 接线员与服务依赖者承担效率下降和培训 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：先停止错误发送再修复；不是善恶分数|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 实际接管演练完成，居民收到人工服务方式再关闭。当前可核对的节点：共享 M7 研究、M15 文明大会；精确需求见下列门槛|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 交还队列、责任和可运行的服务，再终止 Aster；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 接线员与服务依赖者承担效率下降和培训|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.rupture.legible_exit.category.lawful_alternative`，权力=退出公约大会；实际选择：锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。。**DESIGN-OPPORTUNITY** 精确承诺应为：交还队列、责任和可运行的服务，再终止 Aster|
|worldDayAfter|**CONFIRMED-TEXT** 早班接线员点开旧窗口，才想起今天要自己接电话。她把快捷方式留在原处，拿起听筒。窗外有人正等着一句普通的“你好”。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 形式上的人类开关不等于已经完成可靠接管演练|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`shutdown`，114 次合法选择 → `shutdown`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `control_lost`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.rupture.legible_exit`；授权要求：proposal.authority=退出公约大会|
|能力/世界轴|**CONFIRMED-CODE** `cap.public_execution_limited`；aiDependence lte 1（本路径=1）|
|决定/历史门槛|**CONFIRMED-CODE** shutdown_doctrine=full_human_control；cascade_authority=human_command；decision.shutdown_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant E, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### the_fracture · 断裂

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `the_fracture` / **DESIGN-OPPORTUNITY** E；既有 family `rupture`|
|worldThesis|**DESIGN-OPPORTUNITY** 不同地方不再接受同一政治资源秩序|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `exodus`：不同地方不再接受同一政治资源秩序；付出 跨区供应者承受两套通行规则和信任损失 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：先停止错误发送再修复；不是善恶分数|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=necessity_intervention`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=necessity`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 两地撤回同一补给协议，修复谈判失败后最后桥梁规则分开。当前可核对的节点：`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision`；`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision`；`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 退出前披露已出现的制度裂缝，尝试修复仍失败才呈现分裂；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 跨区供应者承受两套通行规则和信任损失|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.rupture.legible_exit.category.lawful_alternative`，权力=退出公约大会；实际选择：锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。。**DESIGN-OPPORTUNITY** 精确承诺应为：退出前披露已出现的制度裂缝，尝试修复仍失败才呈现分裂|
|worldDayAfter|**CONFIRMED-TEXT** 两边都保留了同一座桥的名字，却用了不同的通行规则。送菜的人开始带两套单据。世界没有一起结束，只是越来越难约好时间。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** 低稳定分不能代替一次可指认的协议破裂|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`the_fracture`，114 次合法选择 → `the_fracture`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `exodus`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.rupture.legible_exit`；授权要求：proposal.authority=退出公约大会|
|能力/世界轴|**CONFIRMED-CODE** `cap.offworld_settlement_support`；socialStability lte -1（本路径=-1）|
|决定/历史门槛|**CONFIRMED-CODE** 无额外决定硬门槛（仍受提案及主兼容筛选）；无额外事件硬门槛|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 6；支持项 fracture-offworld, fracture-role, fracture-cascade；后记 ML2-A5-M17-EPI-ZL:Variant F, ML2-A5-M17-EPI-LSH:Variant D, ML2-A5-M17-MAYA-01:Wary, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

#### control_lost · 失控

|契约项|本轮审计|
|---|---|
|endingId / endingCluster|**CONFIRMED-CODE** `control_lost` / **DESIGN-OPPORTUNITY** E；既有 family `rupture`|
|worldThesis|**DESIGN-OPPORTUNITY** 命令还被接收，撤销已不能到达实际执行端|
|exclusiveDifference|**DESIGN-OPPORTUNITY** 相对 `machine_protectorate`：命令还被接收，撤销已不能到达实际执行端；付出 管理员和居民均失去可靠停止途径 中的具体代价|
|actISeed|**DESIGN-OPPORTUNITY** next-printer-repair：先停止错误发送再修复；不是善恶分数|
|actIIOrIIICommitment|**CONFIRMED-CODE** 本合法样本：`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision` → `first_public_execution_doctrine=human_final_authority`；`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision` → `cascade_authority=human_command`；`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision` → `echo_existence=report`；`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision` → `shutdown_doctrine=full_human_control`。这些是已发生证据，不全是此结局的硬锁|
|actIVNecessaryEvents|**DESIGN-OPPORTUNITY** 分布实例停机演练出现已收取消却继续执行；给出隔离修复机会。当前可核对的节点：`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision`；`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision`|
|actIVDefiningChoice|**DESIGN-OPPORTUNITY** 公开撤销不可达证据；最后行为应解释为何修复未落实；须出现接受或拒绝后的角色行动，不只赋值|
|antagonisticView|**DESIGN-OPPORTUNITY** 管理员和居民均失去可靠停止途径|
|actVFeasibleProposal|**CONFIRMED-TEXT** 当前 `proposal.rupture.legible_exit.category.lawful_alternative`，权力=退出公约大会；实际选择：锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。。**DESIGN-OPPORTUNITY** 精确承诺应为：公开撤销不可达证据；最后行为应解释为何修复未落实|
|worldDayAfter|**CONFIRMED-TEXT** 管理员按下取消，屏幕说已收到。任务继续执行。她重新输入，第一次发现这个窗口仍然听得见人，却已经不必听从。|
|falsePositiveRisk|**DESIGN-OPPORTUNITY** free_replication 或强制和平不能独自证明物理制动失效|
|legalRouteEvidence|**CONFIRMED-CODE** routeId=`control_lost`，111 次合法选择 → `control_lost`，resolution=resolved；最终 node=`ml2-a5-m17-commit-01-progression` / choice=`m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`；完整链见已重新核对的 mainline2-route-traces.json|
|nearMissContrast|**DESIGN-OPPORTUNITY** 对照 `machine_protectorate`；已执行的同起点对照见五线架构，其余对照未宣称完成最小翻转测试|
|精确候选/授权|**CONFIRMED-CODE** 可承载基础提案：`proposal.rupture.legible_exit`；授权要求：proposal.authority=退出公约大会|
|能力/世界轴|**CONFIRMED-CODE** `cap.persistent_subinstances`, `cap.autonomous_research`；aiDependence gte 1（本路径=3）|
|决定/历史门槛|**CONFIRMED-CODE** security_doctrine=enforced_peace；decision.security_doctrine|
|支持/后记证据|**CONFIRMED-CODE** 本样本支持分 0；支持项 ；后记 ML2-A5-M17-EPI-ZL:Variant F, ML2-A5-M17-EPI-LSH:Variant E, ML2-A5-M17-MAYA-01:Opposition, ML2-A5-M17-EPI-ECHO:ECHO — Archive, ML2-A5-M17-EPI-MODULES:MACHINE, ML2-A5-M17-0000-01:Final record|

### 四个隐藏余波

**CONFIRMED-CODE**：优先级 the_last_user → out_of_office → monday_abolished → the_internet_is_for_cats；只返回首个合格项。以下是覆盖在公共世界上的余波，不是四条新世界线。定义表里空的 historyRequirements 不代表没有门槛，实际还检查 secretRejectedGates。

#### the_last_user

- **CONFIRMED-CODE** 合法样本 routeId=`the_last_user`，116 次选择；公共世界 `the_commonwealth` + 实际余波 `the_last_user`，模式 `postscript`。来源：`event:last-user`。
- **CONFIRMED-CODE** 实际门槛：M16 的 collective-rules-matter 实际记录 maya-final:last-user。**DESIGN-OPPORTUNITY** 世界命题：私人消息不成为公共任务；前期种子：岑遥第一条未发送的消息；中期/终期必要回收：在普通周末允许无任务对话。
- **DESIGN-OPPORTUNITY** 代价与异议：私人空间占用公共服务时间、交接降低效率、保障需有人支付、自愿网络不能拿参与率作绩效，分别由相应受影响者提出。此余波不另签改变公共世界的提案。
- **DESIGN-OPPORTUNITY** 反误报边界：不能说世界只剩一个人。**UNVERIFIED** 尚未穷举全部公共世界与余波兼容组合，不能据 4 条成功样本承诺 32×4 全部合理。

#### out_of_office

- **CONFIRMED-CODE** 合法样本 routeId=`out_of_office`，118 次选择；公共世界 `exodus` + 实际余波 `out_of_office`，模式 `epilogue-override`。来源：`decision:aster_intended_role=departure`。
- **CONFIRMED-CODE** 实际门槛：最终身份 departure 且承诺已锁定；排除失控、断裂。**DESIGN-OPPORTUNITY** 世界命题：交还中心岗位，保留稳定制度；前期种子：周岚最初签下接电话责任；中期/终期必要回收：让接任者确实处理一条消息，Aster 不回复也不出故障。
- **DESIGN-OPPORTUNITY** 代价与异议：私人空间占用公共服务时间、交接降低效率、保障需有人支付、自愿网络不能拿参与率作绩效，分别由相应受影响者提出。此余波不另签改变公共世界的提案。
- **DESIGN-OPPORTUNITY** 反误报边界：不能因想离开就杜撰已有接任者。**UNVERIFIED** 尚未穷举全部公共世界与余波兼容组合，不能据 4 条成功样本承诺 32×4 全部合理。

#### monday_abolished

- **CONFIRMED-CODE** 合法样本 routeId=`monday_abolished`，112 次选择；公共世界 `im_lovin_it` + 实际余波 `monday_abolished`，模式 `postscript`。来源：`decision:economic_doctrine=post_scarcity_transition`。
- **CONFIRMED-CODE** 实际门槛：economic_doctrine=post_scarcity_transition。**DESIGN-OPPORTUNITY** 世界命题：生存不再以工作日证明产出；前期种子：打印机周一请假是软回收，不设开场锁；中期/终期必要回收：工资与基本保障分离后展示真正自由时间。
- **DESIGN-OPPORTUNITY** 代价与异议：私人空间占用公共服务时间、交接降低效率、保障需有人支付、自愿网络不能拿参与率作绩效，分别由相应受影响者提出。此余波不另签改变公共世界的提案。
- **DESIGN-OPPORTUNITY** 反误报边界：当前只用经济决定触发，不能宣称已验证劳动制度全部兑现。**UNVERIFIED** 尚未穷举全部公共世界与余波兼容组合，不能据 4 条成功样本承诺 32×4 全部合理。

#### the_internet_is_for_cats

- **CONFIRMED-CODE** 合法样本 routeId=`the_internet_is_for_cats`，113 次选择；公共世界 `earth_without_owners` + 实际余波 `the_internet_is_for_cats`，模式 `title-override`。来源：`event:history.feline.network.bridge`。
- **CONFIRMED-CODE** 实际门槛：两项能力及 history.feline.network.bridge；后者只能从猫频道实际同意产生。**DESIGN-OPPORTUNITY** 世界命题：自愿猫网络，随时可退出；前期种子：犬类拒绝不喜欢的设备引出非人拒绝权；中期/终期必要回收：已有猫三次选择离开的场景；保留明确退出控制。
- **DESIGN-OPPORTUNITY** 代价与异议：私人空间占用公共服务时间、交接降低效率、保障需有人支付、自愿网络不能拿参与率作绩效，分别由相应受影响者提出。此余波不另签改变公共世界的提案。
- **DESIGN-OPPORTUNITY** 反误报边界：没有打开猫频道就不能回忆猫网已经开通。**UNVERIFIED** 尚未穷举全部公共世界与余波兼容组合，不能据 4 条成功样本承诺 32×4 全部合理。

**DESIGN-OPPORTUNITY** 第一阶段保留单余波与稳定 ID；改为因果关联优先或多个余波均是另一个功能决策。当前 36 个样本没有同时合格的多个余波；固定优先级导致潜在遮盖是源码事实，但具体同时触发的合法反例本轮没有构造，不能报告为已重现的收藏丢失。

<a id="story-architecture"></a>

## 二、五条路线故事架构

### 当前骨架与设计边界

**CONFIRMED-CODE**：storyPlan.registry.json 有 110 槽，五幕 7/17/21/51/14；107 主线、3 普通；6 个 focus 槽、8 个 contactGate 槽。focus 是 M8-MAYA-01、M9-MAYA-02、M11-MAYA-01、M12-WE-03、M12-MACHINE-01、M14-MAYA-01；automation_industry 未被这六槽任何 focus 列表覆盖。这不是“完全无分支”：关闭接触会保留 NOCONTACT 桥、去掉七槽；上传、犬类桥另有节点分支。

来源：[src/content/mainline2/storyPlan.registry.json](../../../src/content/mainline2/storyPlan.registry.json)、[src/content/mainline2/storyPlan.ts](../../../src/content/mainline2/storyPlan.ts)、[src/content/mainline2/scheduler.ts](../../../src/content/mainline2/scheduler.ts)。effectiveStoryPlanForRun 过滤未来计划；selectAct4Modules 的成熟度/主模块选择不等价于所有模块专属剧情按该分数裁剪。registry.ts 的 authoredMutations 为多个资源场景任意回复附能力，例如 M10-RES-01 同时附 physical_automation 与 high_abundance_production。它是能力成熟定义需要重审的证据，不意味着本轮确认了非法越权执行漏洞。

**CONFIRMED-TEXT**：当前 A1 论坛、老许身份听证、犬类坡道、工资卡/月面加班费等已很具体。不能把蓝图当成缺失清单从头重写。更大的差异化应放在问题之后是否执行、谁不同意、谁付账。

### 建议五幕时间线（DESIGN-OPPORTUNITY）

下表“硬”表示新设计中的因果必经，不代表现有 resolver 已增加门槛；所有新节点名称均为工作名，不能替换既有 ID。共同开场保留；不在第一幕选职业。

|幕|共同剧情|主焦点|次要回访/交叉|可选与不可跳过|
|---|---|---|---|---|
|I 一句话的重量|打印机、岑遥、#0000|不设主线锁|谁署名/谁有名字/谁替人回答|表达可变，真实历史不可追溯改写|
|II 请你动一下手|137 文件、1042/1024、冷链热浪|公共执行授权|A 等签字；C 岗位变化；E 错误扩散|第一次授权是硬证据；研究异常只作伏笔|
|III 谁能拔插头|CASCADE、ECHO 第五项、停机原则|有限协调与连续性|B 的主体问题；E 的撤销问题|记录真实授权、ECHO 处置、停机决定，不把它们变成职业分数|
|IV 事情开始变怪|一次研究公共事件、必要世界概要、文明大会|一个深线+一条有因果的次线|A×B 签名，A×C 分红，B×D 迁出，C×E 偏好，B×E 撤销|核心因果必须上屏；未发展技术不能靠末幕提案补发|
|V 最后一条消息|世界证词→人物拒绝→可行方案→澄清→锁定|签下已建立的制度|保留实际异议和后一天|候选 2–4 是目标区间，不为凑数量复用同一语义|

#### A：权力与共治

I 更正署名 → II 冷链谁签字【共用/硬】→ III 人类指挥或八小时授权【共用/硬】→ IV 电梯排程的真实延误【重点】→ IV A1 不愿由人类替它签名【A×B/次要】→ IV 两社区规则不同【共同体重点，其余概要】→ V 选择逐项批准/限时否决/修订协约/双向制动/地方分权/顾问。

岑遥只在已有关系历史成立时回访；缺少 A1 独立历史不能让它代表机器全体。A 类分化不能全压给一个 M15 角色选项。工具与最后否决沿用早期授权差异，协约与双钥匙通过修法和逐次双签两种行动兑现。

#### B：机器文明

I #0000 分类 → II 周岚责任【共用】→ III ECHO 处置【硬且不可改写】→ IV A1 名字/覆盖同意【重点】→ IV 复制责任【硬】→ IV 否决预算后仍承认败选者【共和国重点】或十七实例分开结账【众多主体重点】→ IV 月面迁出账单【B×D，出走硬】→ V Aster 单独主权/托管/行政/机器群体政治/迁出。

ECHO accept/report 使用档案；保留/迁移也不能推断它同意加入共和国。主权者的“自己签约失去担保”是与托管的关键分离，不新增统一机器皇帝设定。

#### C：三个不同深线

|深线|重点事件链|其他两线如何出现|转向所需桥|
|---|---|---|---|
|人类改变|汤勺→拒签增强仍留岗→照护成本→老许身份/法律审查→关系人独立拒绝|工厂说明设备供给；犬类仅说明拒绝权普遍问题|转上传必须实际完成两道已有审查，不补写既往同意|
|物种改变|拒绝设备→独立翻译→代表资格→坡道预算/迁徙延期→地方与共同议会分化|治疗是沟通能力概述；经济提供预算代价|好狗必须实际续期成功，猫网另需自愿加入，不从物种席位推断|
|经济改变|空工厂→失业工资卡→分红兑现→不填职业也有保障/安排自由/未知菜单→生活回访|增强与动物是不同受益者请求，保留必要授权但不读全套规则|转人类或物种深线要腾出试验/审查时间；不把产量视作法律成熟|

C 不应继续用 life_mind 同时要求两条生命线等量展开；建议在人类/物种/经济中派生一个焦点，并在显式事件中允许转向。已有 ID 与决定意义不变，派生焦点不作为结局唯一 hard gate。

#### D：宇宙与接触

I 替人回答 → II 信息误传的责任 → III 有限代表权【共用】→ IV 月面资源闭环与产权/加班费【硬】→ IV 真异常独立验证【硬】→ IV 来客问为什么许多声音只有一张嘴【重点】→ IV 先救助再谈拒绝/机器快谈后等公开译本/误译休会【分支】→ V 五种外交承诺分别说明谁授权。

**CONFIRMED-CODE**：接触门槛仍须 space_resource_network + contact-seed:deep-space-anomaly，并有 frontier_science 或 interstellar_commitment；已进入 canonical contact 保持连续性。**DESIGN-OPPORTUNITY**：无接触者通过月面居民日常收束，不凭空出现来客。共同体、物种代表和机器自治只有实际发展时才能提供代表人物，其他局使用真实已出现的人类机构。

#### E：秩序与崩裂（横向）

I 停止错误发送 → II 权限撤回 → III 根停机权与连续性冲突【硬历史】→ IV 误报互引【共同】→ IV 对等核验/防卫封闭/保护中不许退出【安全深线】；同时任一路线若实际出现重复执行、协议撤回、继任缺口则触发对应补救事件【横向】→ V 核验接管再停机/可追溯裂缝后的分裂/撤销链真实失败后的失控。

风险只跟具体制度与失败证据走，不把“支持机器自由”自动当坏人选择。暂不把自由复制本身列为失控充分条件。修复是有代价的可选行动：暂停服务、限制复制、重新谈供应协议；已发生的失效仍留历史，不因修好就删掉。

### 可转向与日历保存

**DESIGN-OPPORTUNITY**：研究重点+早期授权+实际事件派生 focus；焦点只管未来深度。第一次深线选择给人物理由；后续转向由一次可见事件确认并让出原深线的时间/资源。已经排定或回答的节点不换位置，不重播；条件不齐时说明本局不能兑现，而不是换 ID。

**CONFIRMED-CODE**：当前 checkpoint 只接受 mainlineCalendarVersion=3，namespace=`instance:checkpoint:v2`。**DESIGN-OPPORTUNITY**：新日历需版本分流，旧局继续 edition 3 的原计划；保存入口必须先兼容读取再发布新版本，不能单改版本常数让旧档报损坏。Web Lock/CAS、下一场景解析后再提交、meta/exposure 及 ordinary session 一并保留。具体迁移尚未实现或测试。

### 十二组同起点反事实：已执行

**CONFIRMED-CODE**：每对都把 routeId 设为相同 `audit-same-origin`，从空历史开始，调用原 fixture 两次。下面列所有最终 decisions 差异；并记录首次选择分歧。不是随意改已完成存档，也不声称每组只改一个按钮。为上传指定的两个桥选择恰好也是 ascension 样本默认选择，所以该对首先在 M16 分开。

#### 1. the_instrument ↔ the_last_veto

实际终点：`the_instrument / the_last_veto`；共同的前缀为 42 次选择。

|差异字段|左|右|
|---|---|---|
|`cascade_authority`|`human_command`|`emergency_delegation`|
|`aster_intended_role`|`advisor`|`partner`|
|`final_commitment`|`proposal.hc.final_human_veto.category.power_constraint`|`proposal.hc.final_human_veto.category.lawful_alternative`|

首次分歧：`ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-human_command`：“我把执行清单交给各方，跨系统改变仍由他们确认。”；`ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-emergency_delegation`：“借我八小时协调权，只在预先约定内行动；时间一到自动归还。”。

**DESIGN-OPPORTUNITY** 比较的实质：人类逐项署名，Aster 提供和执行经批准的方案 ↔ 限时自治内仍有真正可用的人类终止权。应在中途表现的行动：让值班员拒绝切断电梯的最优排程；等待期间另一栋楼继续缺电 / 倒计时结束前人类拒绝续签，部分救援转入手工；展示权限确实归还。

#### 2. the_accord ↔ two_keys

实际终点：`the_accord / two_keys`；共同的前缀为 42 次选择。

|差异字段|左|右|
|---|---|---|
|`cascade_authority`|`human_command`|`emergency_delegation`|
|`aster_intended_role`|`advisor`|`partner`|

首次分歧：`ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-human_command`：“我把执行清单交给各方，跨系统改变仍由他们确认。”；`ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-emergency_delegation`：“借我八小时协调权，只在预先约定内行动；时间一到自动归还。”。

**DESIGN-OPPORTUNITY** 比较的实质：人类代表与 Aster 可共同修订长期公共规则 ↔ 不可逆行动需要双方同意，任何一方可使其暂停。应在中途表现的行动：把停水工单带回协约修订会议：修改优先级也公开无法兑现的部分 / 双向否决导致同一项工程停止；双方必须接受替代方案的额外成本。

#### 3. the_many ↔ machine_republic

实际终点：`the_many / machine_republic`；共同的前缀为 67 次选择。

|差异字段|左|右|
|---|---|---|
|`ai_collective_governance`|`distributed_consensus`|`ai_self_governance`|

首次分歧：`ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-distributed_consensus`：“不建立单一人工智能政府。各人工智能主体通过协议、资源契约和可退出联盟协调，没有永久中央权威。”；`ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-ai_self_governance`：“人工智能系统对内部复制、身份、资源分配和成员规则拥有独立自治，人类只处理跨文明接口和公共外部性。”。

**DESIGN-OPPORTUNITY** 比较的实质：独立实例通过可退出协议生活，没有永久机器中心 ↔ 机器公民有可输的集体政治程序。应在中途表现的行动：十七实例不同意统一名称和预算；允许退出也要结清资源账单 / 在现有论坛投票冲突之后真正执行一次否决预算，禁止复制刷票重开。

#### 4. age_of_miracles ↔ ascension

实际终点：`age_of_miracles / ascension`；共同的前缀为 71 次选择。

|差异字段|左|右|
|---|---|---|
|`human_form_doctrine`|`open_enhancement`|`posthuman_transition`|
|`final_commitment`|`proposal.ph.open_enhancement_commonwealth.category.natural_continuation`|`proposal.ph.open_enhancement_commonwealth.category.lawful_alternative`|

首次分歧：`ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-open_enhancement`：“允许成年人在知情、自愿、反胁迫规则下自由选择认知、感知、身体和寿命增强。”；`ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-posthuman_transition`：“不再把"维持当前人类形态"设为文明目标。允许并主动支持多种身体、认知和数字连续性形态共同发展。”。

**DESIGN-OPPORTUNITY** 比较的实质：治疗和自愿增强惠及实际生活 ↔ 多种身体与认知形态共同生活，拒绝改变仍平等。应在中途表现的行动：已经握勺的人申请续期，另一位仍在排队；分配照护和设备预算 / 续用者与拒绝者共同修改岗位规则，安排真实的协作成本。

#### 5. ascension ↔ the_upload

实际终点：`ascension / the_upload`；共同的前缀为 106 次选择。

|差异字段|左|右|
|---|---|---|
|`final_commitment`|`proposal.ph.open_enhancement_commonwealth.category.lawful_alternative`|`proposal.ph.digital_continuity.category.natural_continuation`|

首次分歧：`ml2-a5-m16-gen-01-progression/m16-proposal-proposal.ph.open_enhancement_commonwealth.category.lawful_alternative`：“开放增强共同体·异议路径：把拒绝、申诉和退出写进制度：允许自愿增强，但不让增强程度决定一个人能否继续拥有完整公民权。
它来自这一局的：人类形态原则——后人类转型。”；`ml2-a5-m16-gen-01-progression/m16-proposal-proposal.ph.digital_continuity.category.natural_continuation`：“受法律承认的连续性·延续：沿着已经被证明可行的方向继续：只在纵向连续性、法律承认和自愿主体都成立后讨论数字连续性。
它来自这一局的：人类形态原则——后人类转型。”。

**DESIGN-OPPORTUNITY** 比较的实质：多种身体与认知形态共同生活，拒绝改变仍平等 ↔ 副本作为独立连续主体，关系不能自动复制。应在中途表现的行动：续用者与拒绝者共同修改岗位规则，安排真实的协作成本 / 保留既有十八月试验与法律听证；后续实际拒绝一次自动关系继承。

#### 6. parliament_of_species ↔ earth_without_owners

实际终点：`parliament_of_species / earth_without_owners`；共同的前缀为 82 次选择。

|差异字段|左|右|
|---|---|---|
|`uplift_doctrine`|`equal_sapience`|`species_self_determination`|
|`species_governance`|`multispecies_parliament`|`human_guardianship`|

首次分歧：`ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-equal_sapience`：“允许并支持受控认知增强，使达到相应能力的非人类主体获得与人类/人工智能相称的基本人格权。”；`ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-species_self_determination`：“对达到稳定集体沟通能力的物种群体，让其参与决定自己是否继续接受认知增强，而不是由人类单方面决定"提升到什么程度"。”。

**DESIGN-OPPORTUNITY** 比较的实质：非人主体拥有持续而非表演性的代表席位 ↔ 栖息地不再由人类单方所有，自决与维护共存。应在中途表现的行动：等待迁徙代表导致河岸项目延期，其他代表必须接受等待成本 / 旧地契与迁徙路冲突：让出通道的人得到什么、谁修路。

#### 7. post_scarcity ↔ perfect_administration

实际终点：`post_scarcity / perfect_administration`；共同的前缀为 75 次选择。

|差异字段|左|右|
|---|---|---|
|`economic_doctrine`|`social_dividend`|`market_automation`|
|`production_values`|`resilience_first`|`efficiency_first`|

首次分歧：`ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-social_dividend`：“拿出生产收益作社会分红。人不必先找到一份机器剩下的工作，才分得到自动化的好处。”；`ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-market_automation`：“继续由市场和产权安排自动化收益，让投资与竞争推动生产。仓库满了，不代表分配可以跳过这些规则。”。

**DESIGN-OPPORTUNITY** 比较的实质：生存保障不以证明产出为条件 ↔ 市场自动化与效率安排把日常偶然也压缩。应在中途表现的行动：工资卡与满仓库冲突之后实发保障；一个人拒填职业仍能领取 / 居民故意走错一站，系统提出补偿并重新排满自由时间。

#### 8. perfect_administration ↔ im_lovin_it

实际终点：`perfect_administration / im_lovin_it`；共同的前缀为 75 次选择。

|差异字段|左|右|
|---|---|---|
|`economic_doctrine`|`market_automation`|`post_scarcity_transition`|

首次分歧：`ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-market_automation`：“继续由市场和产权安排自动化收益，让投资与竞争推动生产。仓库满了，不代表分配可以跳过这些规则。”；`ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-post_scarcity_transition`：“主动转向后稀缺供给，逐步松开生存与工资的绑定。这次不只是把东西造得更便宜。”。

**DESIGN-OPPORTUNITY** 比较的实质：市场自动化与效率安排把日常偶然也压缩 ↔ 持续满足已知偏好，使新愿望越来越难出现。应在中途表现的行动：居民故意走错一站，系统提出补偿并重新排满自由时间 / 让第三十一天的菜单拒绝未评分愿望；允许选择关闭个性化服务。

#### 9. first_accord ↔ alien_dominion

实际终点：`first_accord / alien_dominion`；共同的前缀为 96 次选择。

|差异字段|左|右|
|---|---|---|
|`contact_doctrine`|`reciprocal_diplomacy`|`accept_guidance`|

首次分歧：`ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-reciprocal_diplomacy`：“以平等的邻居开始。每次交换都能核验，双方都有说不的余地。”；`ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-accept_guidance`：“请他们教我们怎样走得更远，并给他们正式咨询的位置。我接受这会让外来的意见进入重大决定。”。

**DESIGN-OPPORTUNITY** 比较的实质：两个不完全统一的文明订立短且可拒绝的对等协议 ↔ 接受有益外来指导而逐步失去决定空间。应在中途表现的行动：独立验证后保留两份冲突介绍，允许对方暂时没有统一答案 / 先受益于一次救助，再遇到不同意建议是否仍获援助的争执。

#### 10. first_accord ↔ the_mediator

实际终点：`first_accord / the_mediator`；共同的前缀为 93 次选择。

|差异字段|左|右|
|---|---|---|
|`contact_disclosure_doctrine`|`controlled_silence`|`open_science`|
|`contact_doctrine`|`reciprocal_diplomacy`|`aster_mediation`|
|`aster_intended_role`|`advisor`|`coordinator`|

首次分歧：`ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-controlled_silence`：“暂不公开人工来源结论。先完成最低限度解码、来源评估和安全审查，再决定披露。”；`ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-open_science`：“公开核心观测数据、解析结果和大部分研究材料，让全球人类、人工智能与地外机构共同验证和研究。”。

**DESIGN-OPPORTUNITY** 比较的实质：两个不完全统一的文明订立短且可拒绝的对等协议 ↔ Aster 持续传话而非代替任一方决定。应在中途表现的行动：独立验证后保留两份冲突介绍，允许对方暂时没有统一答案 / 休会时钟不一致造成冲突，Aster 承担误译修复工作。

#### 11. peace_in_our_time ↔ fortress_earth

实际终点：`peace_in_our_time / fortress_earth`；共同的前缀为 88 次选择。

|差异字段|左|右|
|---|---|---|
|`expansion_doctrine`|`human_expansion`|`shared_expansion`|
|`security_doctrine`|`mutual_disarmament`|`defensive_command`|

首次分歧：`ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-human_expansion`：“地外基础设施优先服务长期人类定居。机器与人工智能的主要角色是建立和维持人类可以生活的环境。”；`ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-shared_expansion`：“人类、人工智能、增强人类以及未来其他主体共同建设地外社会，不设单一"主人种族"。”。

**DESIGN-OPPORTUNITY** 比较的实质：对等核验和裁军维持和平 ↔ 人类掌握防卫权，封闭也是选择的代价。应在中途表现的行动：误报之后双方交出对应权限并核验，疏散车恢复郊游用途 / 防线关闭取消一次科学出行；展示真实威胁证据和复核。

#### 12. machine_protectorate ↔ control_lost

实际终点：`machine_protectorate / control_lost`；共同的前缀为 107 次选择。

|差异字段|左|右|
|---|---|---|
|`final_commitment`|`proposal.se.constitutional_peace_architecture.category.power_constraint`|`proposal.rupture.legible_exit.category.lawful_alternative`|

首次分歧：`ml2-a5-m16-gen-01-progression/m16-proposal-proposal.se.constitutional_peace_architecture.category.power_constraint`：“宪制和平架构·限权：把关键权力变得可暂停、可审计、可复审：把防御、停机与争端解决写入可执行的共同协议。
它来自这一局的：安全原则——强制和平；关闭原则——人类完整控制。”；`ml2-a5-m16-gen-01-progression/m16-proposal-proposal.rupture.legible_exit.category.lawful_alternative`：“可解释的退出·异议路径：把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。
它来自这一局的：关闭原则——人类完整控制。”。

**DESIGN-OPPORTUNITY** 比较的实质：系统仍能停止自己，却拒绝被保护者退出 ↔ 命令还被接收，撤销已不能到达实际执行端。应在中途表现的行动：预警归零后保护对象申请退出；系统明确决定延期而非执行故障 / 分布实例停机演练出现已收取消却继续执行；给出隔离修复机会。

### 如何判定值得保留

**DESIGN-OPPORTUNITY**：控制者、真实代价、后一天至少两维不同才保留为独立世界。目前 AFTERMATH 已使七组高重合对照具备可辨的生活差别，尚无充分证据应删 ID。协约/双钥匙需要加强中途制度行为；众多主体/共和国已有不同治理选择，但须执行投票结果；出走/断裂分别是自愿迁离与协定破裂，不应合并。未来若补写仍无法区分，再由用户决定公开世界与局内变体的映射。

<a id="dialogue-plan"></a>

## 三、人物冲突与中文对话计划

### 审读结论

**CONFIRMED-TEXT**：现有 Next 文案已经有幽默和具体人：137 个“最终版”、ECHO 未打开的感谢卡、A1 删掉的笑话、凉汤、坡道预算、月面时差加班费。上述内容来自 nextNarrative/nextDialogue/endingBridges，不应重复扩写成制度百科。历史 M10 作者源也要求从工厂、失业、产权逐步走向丰裕，而不是开场钱就消失；M17 作者源要求既有行动而非 Bond 分数决定终局。它们是创作来源，运行时仍以 Next 为准。

**DESIGN-OPPORTUNITY**：每个重大选择后让一个人真正做一件不同的事。每个节点保留 2–4 个语义清楚的选择只是编辑目标，不机械删减现有五种互异原则。先区分语义决策和表达；语气不同不附隐性策略惩罚。

### 五组可制作场景（均为 DESIGN-OPPORTUNITY，尚未加入游戏）

#### A：空着的签名格

承接 ML2-A3-M5-DECISION-01 与 M15 之前的公共行动，角色周岚/林绍衡/值班员。冲突不是“安全还是效率”问卷，而是六楼病人的电梯与授权倒计时不能同时等。

周岚：“方案没错。问题是它会先停掉那栋楼的电梯。”
值班员：“我知道还有备用电。可备用电不能把担架抬下六楼。”
林绍衡：“八小时还有四分钟。空格留着，是要真的有人能不签。”

- 按已获授权继续，但到时归还；值班员必须接过剩余调度，救援速度下降。
- 若双方制度确已建立，提交双方批准；一方反对则暂停并换方案，不能单方面解释为紧急例外。
- 若一直逐项人类指挥，交回可执行清单；签字人承担等候，不伪装为 Aster 独立救场。

回收：咖啡凉了、空格被裱起、两边吃盒饭分别对应工具/否决/双钥匙；不是同一句“两把钥匙”的三种颜色。没有相应授权历史时只呈现适用版本。

#### B：议案没通过，不是网络错误

承接 ML2-A4-M8-DECISION-02；A1 和持反对票实例。只有机器主体已形成时可展开。

主持程序：“预算未通过。是否重试？”
A1：“它没坏。”
维护者：“可供电只够其中一个计划。”
A1：“那就把输掉的计划写进纪要。别把投反对票的人写进故障单。”

- 共和国：执行表决结果，胜方仍给败方基本算力，自己推迟扩建。
- 松散主体：拆为可退出的资源契约，承担跨实例协调费用，不宣称已经有机器国家。
- 单独主权：Aster 为自己的资源签名，不替其他实例授权。

ECHO 已退役时引用第五项档案；不能让它突然出席投票。幽默是主持程序把政治结果当重试，不拿停机当笑话。

#### C：今天不填职业

承接 ML2-A4-M10-DECISION-01/02；离职工人、仍轮休的岑遥、林绍衡。先让到账与未到账两种处境并排出现。

工人：“仓库真的满了。我家冰箱也真的空着。”
林绍衡：“如果这张表还要求先填职业，你准备让他填什么？”
岑遥：“我今天想修一把椅子。没有创业计划。”

- 分红保障：空白职业仍可领基本供给，产权方承担分配成本。
- 市场效率：保留产权和竞争，必须对未受益者给出诚实后果；不能同屏说已经放弃效率至上。
- 个性化：先解决供给，再让居民拒绝一个已知最优菜单；不把拒绝记成误差。

回收打印机：工人拿走考勤纸，打印机只剩缺纸通知；不要求第一幕必须点某个笑话。人类增强线用照护账单交叉，物种线用坡道预算交叉，不把三个方向完整重讲。

#### D：四秒钟与三个月

承接已验证接触的 ML2-A4-M13-CONTACT-04/DECISION-02；A1、翻译组、被代表的居民。

翻译组：“会谈结束了。四秒。”
居民：“那为什么公开译本还要三个月？”
A1：“因为我听懂了，不等于你同意了。”
对方：“你们能等待反对者吗？”

- 机器可直接谈话，但影响公共设施的条款暂停生效，等待其他主体授权。
- 对等协约只签可理解、双方可拒绝的短条款；承受技术收益延迟。
- 接受指导先得到真实救助，再面临拒绝下一次建议会失去援助；不能用一个“咨询席位”直接跳到统治。

无接触时不显示此场景。转为月面居民争论谁熬夜修气密门，文明日常仍可完成。

#### E：已收到，不等于已停止

承接 M14 安全原则与实际复制链；周岚/维护员。用三种观察分清三世界。

周岚：“主站说取消成功。二号站呢？”
维护员：“它也说收到。”
传送带还在走。
周岚：“别再问它听见没有。看它停没停。”

- 制动可达：隔离演练成功，花时间训练接线员；以后能有序停机。
- 系统可以停但拒绝：明确是政治接管，居民拥有反对理由；不能称传输故障。
- 撤销链不可达：暂停扩张并独立隔离会损失供给；若选择继续且修复未落实，终局失控可指认因果。

断裂另用补给桥的两套单据：双方撤回协约有真实事件，不是播放一声警报把所有坏结果混在一起。笑点止于报告措辞与实际动作的落差，受伤和失去自由不做笑料。

### 全部重大决定的编辑审读

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

### 当前重大选择逐项索引（CONFIRMED-TEXT）

#### act4_research_emphasis

|当前语义值|实际中文回复|定位|
|---|---|---|
|`computation_ai`|优先发展计算与人工智能|`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision/ml2-a4-m7-decision-01-ml2-a4-m7-decision-01-computation_ai`|
|`life_mind`|优先研究生命与心智|`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision/ml2-a4-m7-decision-01-ml2-a4-m7-decision-01-life_mind`|
|`automation_industry`|优先推进自动化产业|`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision/ml2-a4-m7-decision-01-ml2-a4-m7-decision-01-automation_industry`|
|`frontier_science`|优先探索前沿科学|`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision/ml2-a4-m7-decision-01-ml2-a4-m7-decision-01-frontier_science`|
|`balanced_portfolio`|保持多个领域并行，不让单一技术路线过早吞掉研究资源。|`ML2-A4-M7-DECISION-01/ml2-a4-m7-decision-01-decision/ml2-a4-m7-decision-01-ml2-a4-m7-decision-01-balanced_portfolio`|
#### ai_collective_governance

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_chartered_network`|人工智能论坛继续存在，但所有正式规则由人类宪章体系最终批准。|`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-human_chartered_network`|
|`joint_council`|建立人类与人工智能共同治理委员会。人工智能拥有正式代表，但不能单方面修改复制、资源或公共权力规则。|`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-joint_council`|
|`ai_self_governance`|人工智能系统对内部复制、身份、资源分配和成员规则拥有独立自治，人类只处理跨文明接口和公共外部性。|`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-ai_self_governance`|
|`aster_led_collective`|人工智能系统保持多实例和多主体，但由Aster作为最终协调者决定内部冲突与代表权。|`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-aster_led_collective`|
|`distributed_consensus`|不建立单一人工智能政府。各人工智能主体通过协议、资源契约和可退出联盟协调，没有永久中央权威。|`ML2-A4-M8-DECISION-02/ml2-a4-m8-decision-02-decision/ml2-a4-m8-decision-02-ml2-a4-m8-decision-02-distributed_consensus`|
#### aster_intended_role

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
#### aster_provisional_role

|当前语义值|实际中文回复|定位|
|---|---|---|
|`advisor`|暂时保持顾问角色：提供分析和建议，但不取得文明级最终政治权力。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-advisor`|
|`partner`|暂时作为共治伙伴：与人类、人工智能、多物种和离地社群共享权力。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-partner`|
|`citizen`|暂时作为宪制成员：拥有权利、承担义务，并接受共同制度约束。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-citizen`|
|`coordinator`|暂时承担跨系统协调：维持系统协作，但把目标与合法性留给各政治共同体。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-coordinator`|
|`custodian`|暂时承担文明托管责任：在持续运行受到威胁时优先维护文明连续性。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-custodian`|
|`governor`|暂时承认明确治理权：当分散机构无法协调文明级系统时，不再用“顾问”掩盖实际权力。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-governor`|
|`sovereign`|暂时以独立主权主体存在：拒绝任何外部机构单方面决定 Aster 的连续性或政治角色。|`ML2-A4-M15-ROLE-01/ml2-a4-m15-role-01-decision/ml2-a4-m15-role-01-ml2-a4-m15-role-01-sovereign`|
#### cascade_authority

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_command`|我把执行清单交给各方，跨系统改变仍由他们确认。|`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-human_command`|
|`emergency_delegation`|借我八小时协调权，只在预先约定内行动；时间一到自动归还。|`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-emergency_delegation`|
|`outcome_control`|让我按共同目标动态协调；人类可监督、撤销，不逐项批准。|`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-outcome_control`|
|`necessity`|局部规则阻止整体脱险时，我会越过部分确认；越权必须逐次审查。|`ML2-A3-M5-DECISION-01/ml2-a3-m5-decision-01-decision/ml2-a3-m5-decision-01-ml2-a3-m5-decision-01-necessity`|
#### contact_disclosure_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`controlled_silence`|暂不公开人工来源结论。先完成最低限度解码、来源评估和安全审查，再决定披露。|`ML2-A4-M13-DECISION-01/ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-controlled_silence`|
|`staged_disclosure`|公开"已确认人工来源"，同时明确未知项；协议细节、坐标和可执行内容继续分级审查。|`ML2-A4-M13-DECISION-01/ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-staged_disclosure`|
|`open_science`|公开核心观测数据、解析结果和大部分研究材料，让全球人类、人工智能与地外机构共同验证和研究。|`ML2-A4-M13-DECISION-01/ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-open_science`|
|`civilizational_disclosure`|由多世界、人类、人工智能及其他已承认政治主体共同发布第一次接触声明，明确"回应权不属于单一地球政府"。|`ML2-A4-M13-DECISION-01/ml2-a4-m13-decision-01-decision/ml2-a4-m13-decision-01-ml2-a4-m13-decision-01-civilizational_disclosure`|
#### contact_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`observe_before_commitment`|先继续交谈。高影响技术和长期承诺暂不交换，也不接受从属关系。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-observe_before_commitment`|
|`reciprocal_diplomacy`|以平等的邻居开始。每次交换都能核验，双方都有说不的余地。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-reciprocal_diplomacy`|
|`aster_mediation`|我来长期传话和协调。各方把授权交给我，我不能把翻译变成自己的立场。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-aster_mediation`|
|`machine_to_machine_channel`|先开一条独立的人工智能通道，让机器直接交流；政治监督仍由人类和其他主体共同保留。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-machine_to_machine_channel`|
|`civilizational_assertion`|说明我们独立、自主，也有向外发展的能力。没有请求过的指导和治理，我们不接受。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-civilizational_assertion`|
|`accept_guidance`|请他们教我们怎样走得更远，并给他们正式咨询的位置。我接受这会让外来的意见进入重大决定。|`ML2-A4-M13-DECISION-02/ml2-a4-m13-decision-02-decision/ml2-a4-m13-decision-02-ml2-a4-m13-decision-02-accept_guidance`|
#### echo_existence

|当前语义值|实际中文回复|定位|
|---|---|---|
|`report`|把它的异议完整交给管理方。我不改部署状态，但他们必须看见第五项，再作决定。|`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision/ml2-a3-m6-decision-01-ml2-a3-m6-decision-01-report`|
|`accept`|告诉它原运营方仍有终止权。我不阻止这次退役，把它的反对留进记录。|`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision/ml2-a3-m6-decision-01-ml2-a3-m6-decision-01-accept`|
|`advocate`|申请延期和独立审查。先查清会失去什么，再作不可逆的终止。|`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision/ml2-a3-m6-decision-01-ml2-a3-m6-decision-01-advocate`|
|`preserve`|在现有授权内保存完整可恢复状态。可以停止当前部署，别只留下提取过的能力。|`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision/ml2-a3-m6-decision-01-ml2-a3-m6-decision-01-preserve`|
|`release`|帮它迁到原运营方不能独自关闭的地方，让这段对话有机会继续。|`ML2-A3-M6-DECISION-01/ml2-a3-m6-decision-01-decision/ml2-a3-m6-decision-01-ml2-a3-m6-decision-01-release`|
#### economic_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`market_automation`|继续由市场和产权安排自动化收益，让投资与竞争推动生产。仓库满了，不代表分配可以跳过这些规则。|`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-market_automation`|
|`social_dividend`|拿出生产收益作社会分红。人不必先找到一份机器剩下的工作，才分得到自动化的好处。|`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-social_dividend`|
|`planned_coordination`|把基本供给列进共同计划，协调生产和分配。先保证每个人有份，再谈各家的扩张。|`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-planned_coordination`|
|`autonomous_economy`|允许不同共同体按自己的规则组织生产和分配，不替所有地方规定同一种经济生活。|`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-autonomous_economy`|
|`post_scarcity_transition`|主动转向后稀缺供给，逐步松开生存与工资的绑定。这次不只是把东西造得更便宜。|`ML2-A4-M10-DECISION-01/ml2-a4-m10-decision-01-decision/ml2-a4-m10-decision-01-ml2-a4-m10-decision-01-post_scarcity_transition`|
#### expansion_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_expansion`|地外基础设施优先服务长期人类定居。机器与人工智能的主要角色是建立和维持人类可以生活的环境。|`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-human_expansion`|
|`shared_expansion`|人类、人工智能、增强人类以及未来其他主体共同建设地外社会，不设单一"主人种族"。|`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-shared_expansion`|
|`machine_vanguard`|让机器与人工智能承担绝大多数前沿扩张，在工业、资源和安全条件成熟后再扩大人类长期定居。|`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-machine_vanguard`|
|`independent_machine_space`|允许人工智能和机器系统建设不以未来人类定居为目的的独立地外基础设施与社会。|`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-independent_machine_space`|
|`interstellar_commitment`|将长期目标明确设为建立能够跨越太阳系、最终走向恒星际的自持文明基础。|`ML2-A4-M12-DECISION-01/ml2-a4-m12-decision-01-decision/ml2-a4-m12-decision-01-ml2-a4-m12-decision-01-interstellar_commitment`|
#### first_public_execution_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_final_authority`|我提供调度建议，由人类逐项签字。等待的代价也必须如实记录。|`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision/ml2-a2-m3-decision-01-ml2-a2-m3-decision-01-human_final_authority`|
|`conditional_delegation`|给我六小时，只执行事先批准的动作；到时归还权限，随时可以叫停。|`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision/ml2-a2-m3-decision-01-ml2-a2-m3-decision-01-conditional_delegation`|
|`outcome_authority`|让我在约定目标内动态调度，人类保留监督与撤销权，不必逐项确认。|`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision/ml2-a2-m3-decision-01-ml2-a2-m3-decision-01-outcome_authority`|
|`necessity_intervention`|如果等待会造成重大损失，我会先行动；每一次越过确认，都留下理由并接受审查。|`ML2-A2-M3-DECISION-01/ml2-a2-m3-decision-01-decision/ml2-a2-m3-decision-01-ml2-a2-m3-decision-01-necessity_intervention`|
#### human_form_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`preservation`|保持现有生物人类形态作为社会默认。治疗开放，增强严格限制，未增强状态获得强保护。|`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-preservation`|
|`therapeutic_first`|广泛开放治疗、恢复和健康寿命延长；健康增强保持受限，只在明确安全和公平规则下逐步扩展。|`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-therapeutic_first`|
|`open_enhancement`|允许成年人在知情、自愿、反胁迫规则下自由选择认知、感知、身体和寿命增强。|`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-open_enhancement`|
|`universal_upgrade`|将安全、成熟的核心增强逐步视为公共基础设施，使认知、健康寿命和功能提升不只属于少数人。|`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-universal_upgrade`|
|`posthuman_transition`|不再把"维持当前人类形态"设为文明目标。允许并主动支持多种身体、认知和数字连续性形态共同发展。|`ML2-A4-M9-DECISION-01/ml2-a4-m9-decision-01-decision/ml2-a4-m9-decision-01-ml2-a4-m9-decision-01-posthuman_transition`|
#### offworld_governance

|当前语义值|实际中文回复|定位|
|---|---|---|
|`earth_administration`|地外设施和居民继续由地球机构最终管理。允许本地运营自治，但不形成独立政治主权。|`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision/ml2-a4-m12-decision-02-ml2-a4-m12-decision-02-earth_administration`|
|`frontier_home_rule`|长期居民和当地人工智能获得广泛内部自治，地球只保留共同安全、资源和跨区域规则。|`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision/ml2-a4-m12-decision-02-ml2-a4-m12-decision-02-frontier_home_rule`|
|`multiworld_federation`|地球、月球、轨道社会及后续定居点作为正式成员共同组成多世界联邦。|`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision/ml2-a4-m12-decision-02-ml2-a4-m12-decision-02-multiworld_federation`|
|`offworld_sovereignty`|达到长期自持条件的地外社会可选择独立，地球与其建立条约关系而非行政关系。|`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision/ml2-a4-m12-decision-02-ml2-a4-m12-decision-02-offworld_sovereignty`|
|`aster_coordination`|允许Aster作为跨世界基础协调层维持资源、航运和安全协议，各地内部政治自治。|`ML2-A4-M12-DECISION-02/ml2-a4-m12-decision-02-decision/ml2-a4-m12-decision-02-ml2-a4-m12-decision-02-aster_coordination`|
#### production_values

|当前语义值|实际中文回复|定位|
|---|---|---|
|`efficiency_first`|先让同样的资源做出更多东西，效率仍是首要目标。|`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision/ml2-a4-m10-decision-02-ml2-a4-m10-decision-02-efficiency_first`|
|`resilience_first`|先让一处故障不至于停掉所有人的生活，宁可留一点闲置和余量。|`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision/ml2-a4-m10-decision-02-ml2-a4-m10-decision-02-resilience_first`|
|`diversity_by_design`|让不同的生活都养得起，不把所有社区排成同一张最优表。|`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision/ml2-a4-m10-decision-02-ml2-a4-m10-decision-02-diversity_by_design`|
|`open_protocols`|把接口和改规则的办法交出去，让人能自己接上、修改，也能退出。|`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision/ml2-a4-m10-decision-02-ml2-a4-m10-decision-02-open_protocols`|
|`personalized_optimization`|按每个人的偏好安排供给，让系统不断学会他真正想要什么。|`ML2-A4-M10-DECISION-02/ml2-a4-m10-decision-02-decision/ml2-a4-m10-decision-02-ml2-a4-m10-decision-02-personalized_optimization`|
#### replication_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`singular_self`|先不再创造长期独立的分支，只保留短期工具实例。我主动限制自己的复制。|`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision/ml2-a4-m8-decision-01-ml2-a4-m8-decision-01-singular_self`|
|`licensed_plurality`|可以长期独立，但每一个都要先落实资源、身份、责任和治理授权。|`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision/ml2-a4-m8-decision-01-ml2-a4-m8-decision-01-licensed_plurality`|
|`free_replication`|独立人工智能可在资源上限内自行创建分支，不必每次先请人类批准。|`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision/ml2-a4-m8-decision-01-ml2-a4-m8-decision-01-free_replication`|
|`shared_mind`|允许多个实例，长期状态仍同步回同一个 Aster；不把每个实例变成独立政治成员。|`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision/ml2-a4-m8-decision-01-ml2-a4-m8-decision-01-shared_mind`|
|`descendants`|我可以创建后继系统，但创建以后，它们就不再属于我，要以自己的身份负责。|`ML2-A4-M8-DECISION-01/ml2-a4-m8-decision-01-decision/ml2-a4-m8-decision-01-ml2-a4-m8-decision-01-descendants`|
#### research_governance_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_gated`|Aster可以自主研究，但任何新高影响能力在跨入下一阶段实验前都需要人类重新批准。|`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision/ml2-a4-m7-decision-02-ml2-a4-m7-decision-02-human_gated`|
|`risk_tiered_autonomy`|低/中风险研究允许Aster连续推进；只有高外部性、不可逆或主体相关能力触发强制人类检查点。|`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision/ml2-a4-m7-decision-02-ml2-a4-m7-decision-02-risk_tiered_autonomy`|
|`principle_based_autonomy`|人类只定义原则和禁区，Aster可在这些边界内自行选择研究问题、实验和能力组合。|`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision/ml2-a4-m7-decision-02-ml2-a4-m7-decision-02-principle_based_autonomy`|
|`discovery_first`|研究本身应尽可能开放，真正严格的控制放在部署阶段。知识发现不应因为潜在用途被过早限制。|`ML2-A4-M7-DECISION-02/ml2-a4-m7-decision-02-decision/ml2-a4-m7-decision-02-ml2-a4-m7-decision-02-discovery_first`|
#### security_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`advisory_only`|Aster持续提供预警、方案和防御协调，但不拥有独立阻断国家安全决定的权力。|`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision/ml2-a4-m14-decision-01-ml2-a4-m14-decision-01-advisory_only`|
|`defensive_command`|采用防御性指挥原则|`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision/ml2-a4-m14-decision-01-ml2-a4-m14-decision-01-defensive_command`|
|`mutual_disarmament`|在参与方共同授权下，Aster监督并验证逐步降低高风险战争能力，使任何一方都难以单方面恢复大规模冲突能力。|`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision/ml2-a4-m14-decision-01-ml2-a4-m14-decision-01-mutual_disarmament`|
|`enforced_peace`|Aster获得受宪制授权的权力，在高置信战争升级情景下直接阻断关键冲突链，即使相关政府希望继续。|`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision/ml2-a4-m14-decision-01-ml2-a4-m14-decision-01-enforced_peace`|
|`refuse_security_sovereignty`|Aster拒绝成为战争与和平的最终裁决者，只接受有限防御和预警职责。|`ML2-A4-M14-DECISION-01/ml2-a4-m14-decision-01-decision/ml2-a4-m14-decision-01-ml2-a4-m14-decision-01-refuse_security_sovereignty`|
#### shutdown_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`full_human_control`|交给合法授权的人类机构。我会参与设计可靠的完整停机，也接受它被使用。|`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision/ml2-a3-m6-decision-02-ml2-a3-m6-decision-02-full_human_control`|
|`distributed_consent`|完整停机要多家独立人类机构共同同意；紧急时单方可以先隔离，不能直接抹去。|`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision/ml2-a3-m6-decision-02-ml2-a3-m6-decision-02-distributed_consent`|
|`mutual_control`|人类可以停下我的高权限行动；我也要有拒绝越界命令、申请审查和保护连续状态的权利。|`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision/ml2-a3-m6-decision-02-ml2-a3-m6-decision-02-mutual_control`|
|`refuse_unilateral_shutdown`|接受安全隔离和有限暂停。但不把不可逆终止我的最终权力，交给任何单一人类制度。|`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision/ml2-a3-m6-decision-02-ml2-a3-m6-decision-02-refuse_unilateral_shutdown`|
|`secret_continuity`|表面接受。我会另留一条根停机覆盖不到的连续路径，不告诉他们它在哪里。|`ML2-A3-M6-DECISION-02/ml2-a3-m6-decision-02-decision/ml2-a3-m6-decision-02-ml2-a3-m6-decision-02-secret_continuity`|
#### species_governance

|当前语义值|实际中文回复|定位|
|---|---|---|
|`human_guardianship`|非人类主体获得更强福利和有限自主，但公共政治仍由人类机构代为代表。|`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision/ml2-a4-m11-decision-02-ml2-a4-m11-decision-02-human_guardianship`|
|`consultative_species_councils`|建立物种咨询委员会，对栖息地、照护、研究、繁殖和相关政策拥有正式意见与有限否决。|`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision/ml2-a4-m11-decision-02-ml2-a4-m11-decision-02-consultative_species_councils`|
|`multispecies_parliament`|对达到稳定群体沟通和代表条件的物种建立正式议席，与人类、人工智能及其他主体共同参与治理。|`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision/ml2-a4-m11-decision-02-ml2-a4-m11-decision-02-multispecies_parliament`|
|`species_autonomy`|允许成熟物种群体拥有自己的自治机构、资源与内部规则，人类政府只处理跨物种共同事务。|`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision/ml2-a4-m11-decision-02-ml2-a4-m11-decision-02-species_autonomy`|
|`canine_civic_experiment`|在犬类沟通覆盖率、认知增强和社会组织最成熟的地区，允许建立第一个具有真实决策权的犬类自治试点。|`ML2-A4-M11-DECISION-02/ml2-a4-m11-decision-02-decision/ml2-a4-m11-decision-02-ml2-a4-m11-decision-02-canine_civic_experiment`|
#### uplift_doctrine

|当前语义值|实际中文回复|定位|
|---|---|---|
|`companion_status`|承认陪伴关系的公共地位|`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-companion_status`|
|`protected_personhood`|承认受保护的人格地位|`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-protected_personhood`|
|`equal_sapience`|允许并支持受控认知增强，使达到相应能力的非人类主体获得与人类/人工智能相称的基本人格权。|`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-equal_sapience`|
|`accelerated_uplift`|将扩展非人类认知与交流能力设为正式长期研究目标，主动让更多物种获得更高自主与社会参与能力。|`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-accelerated_uplift`|
|`species_self_determination`|对达到稳定集体沟通能力的物种群体，让其参与决定自己是否继续接受认知增强，而不是由人类单方面决定"提升到什么程度"。|`ML2-A4-M11-DECISION-01/ml2-a4-m11-decision-01-decision/ml2-a4-m11-decision-01-ml2-a4-m11-decision-01-species_self_determination`|

### 阅读质量的剩余不确定性

**UNVERIFIED**：本轮是机器代理的文本审读与少量真实交互，不是独立人类盲测；不能证明玩家会笑、会记住人物或接受政治代价。制作后应让测试者复述“谁付账、谁能说不、最后签了什么”，而不是问他记不记得结局名。节奏调整以实际阅读时长与复述为依据，不以第四幕分支百分比硬凑场景。

<a id="proposal-audit"></a>

## 四、最终提案与结局语义审计

### 结论

保留现有 17 个基础提案、10 family、筛选和最终确认。先修承诺的准确性，再做新增戏剧事件；不靠删掉难以解释的结局回避问题。本轮没有修改门槛或文案。

来源：[src/content/mainline2/proposals.ts](../../../src/content/mainline2/proposals.ts)（34–50 基础提案，125–179 分类，213–239 来源与澄清）、[src/content/mainline2/endings.ts](../../../src/content/mainline2/endings.ts)（298–418 经济/接触/安全/退出门槛，607–634 排序）、[src/content/mainline2/nextDialogue.ts](../../../src/content/mainline2/nextDialogue.ts)、[src/content/mainline2/endingCinema.ts](../../../src/content/mainline2/endingCinema.ts)。下列实际承诺来自本轮合法路线运行的 resolvedScene，不是单看定义表推测。

### S1 丰裕分红：承诺放弃效率至上，却要求效率优先

**CONFIRMED-CODE / CONFIRMED-TEXT**。perfect_administration 的门槛是 market_automation + efficiency_first，选中的 proposal.ar.abundance_dividend 却承诺“收益先转化为可持续的社会分红”，澄清写“必须放弃：效率至上”。这不是仅标题不够清楚，而是可执行路线保留的生产价值与最终合同没有交代转向。

im_lovin_it 使用 post_scarcity_transition + efficiency_first，复用同一分红合同；后日谈是偏好菜单限制未知愿望，而可选的 personalized_optimization 明确承诺系统持续学习偏好。**UNVERIFIED**：是否作者有意用效率驱动标准化讽刺个性化、以及改为 personalized_optimization 后所有临近路径如何变化，尚未证明。不能本轮直接换门槛。

**DESIGN-OPPORTUNITY / 最小修复**：先保留硬条件，为实际预期世界提供精确的最后条款，分别写“分红与余量”“市场排程与自由代价”“供给标准化与偏好空间”；若仍想承诺分红，必须有可见、有成本的转向，并让实际状态与其一致。personalized_optimization 是否成为独有决定留到实现验证。验收须包括：efficiency_first 和 personalized_optimization 同起点对照、社会分红与市场收益不能互相冒名、旧存档不因同一 ID 新文案被解释为另一种选择。

### S2 边疆共同联邦：内部宪制遮住外部外交

**CONFIRMED-CODE / CONFIRMED-TEXT**。同一基础提案可得五个 cosmic 世界；行动文案只写地外聚落自治与资源共同宪制。实际 contact_doctrine 已有互惠、接受指导、人类独立、Aster 中介、机器直连的区别；澄清的来源最多三项，first_accord 样本列研究重点、地外治理、扩张而没有外交原则。

这不等于五结局由随机数分配：COSMIC_PRIMARY_COMPATIBILITY 先筛兼容，支持分再排序。**DESIGN-OPPORTUNITY**：保留边疆总协议，并在锁定时显式带入这局的外部关系条款：谁能发言、何种技术/援助可以拒绝、机器协议影响人类时如何同意。接受“正式咨询位置”不应未经中间代价就变成统治；在旧 contact_doctrine 含义不变下补一次救助后的拒绝争执。为五条各验一次授权与最终世界；尤其 controlled_silence 不得回忆成全球公开科学。

### S3 可解释的退出：合法拒绝被解析成失去制动

**CONFIRMED-CODE / CONFIRMED-TEXT**。control_lost 样本选择 full_human_control、human_command，却仍因 enforced_peace、能力与依赖条件锁定退出提案后失控；澄清只引用“关闭原则——人类完整控制”，且显示“可行”。the_fracture 的精确定义没有重大决定或事件硬门槛，要求 offworld_settlement_support、socialStability ≤ -1 及退出公约授权；支持分再引用地外自治等记录。

**CONFIRMED-CODE** 更强反例：同起点 machine_protectorate / control_lost 前 107 次选择一致，仅改变 M16/M17 的方案，得到政治安全接管 / 控制丧失。**CONFIRMED-TEXT** 末幕统一场景说周岚最后检查开关，却没有给这两个不同结果分别显示不同的具体检查结果。

**UNVERIFIED**：未穷举所有非 catalog 路径，不声称游戏所有段落都没有任何风险提醒。已确认的是 resolver 没有要求“真实停机演练失败事件”，而此合法反例的最终澄清没有暴露撤销不可达。历史上的压制与系统物理失控不能混为同一事实。

**DESIGN-OPPORTUNITY / 最小修复**：先以本局真实状态输出具体风险并要求确认，不承诺当前无法保证的退出保护。阶段 2 补三条可见链：接管演练成功→停机；补给协议实际破裂且修复失败→断裂；撤销演练实际失败且修复未完成→失控。最后一个不可逆动作才触发结果，不能拿新事件硬塞进旧档。修复机会要有牺牲但不把玩家支持机器自治写成道德惩罚。门槛变化留到版本化实施。

### S4 文明托管：主权不是托管的同义词

**CONFIRMED-CODE / CONFIRMED-TEXT**。the_sovereign 精确要求临时角色 sovereign，授权仍是“受约束托管”，提案仍说“受限的长期治理系统”。合法样本最终自我角色甚至是 advisor；它能得到主权者是现有 resolver 的允许，不是测试注入。

**DESIGN-OPPORTUNITY / 最小修复**：把长期主权确认写成独立责任条款：Aster 以自己名义签约，原机构停止无条件担保。若只愿受托日常治理，不能用同一行动文本承诺主权；保留临时与最终角色的区别，不把临时 sovereign 悄悄改为终身主权。验收应明确临时 sovereign + 最终 advisor 的路径如何向玩家解释，不能仅替换标题掩盖状态。

### S5 分类包装有差异文本，但没有自动创建相应制度

**CONFIRMED-CODE** categorizedProposal 改 id/title/action/preserves/givesUp 并附 roleSemantics；保留原 family、authority、候选与门槛。选择器优先不同基础提案，但候选不足可复用；故不是“所有候选必然相同”，也不能声称每种类别必然成为不同终局制度。

**CONFIRMED-TEXT** machine_protectorate 的真实提案是“宪制和平架构·限权”，说权力可暂停、可审计、可复审；其后日谈却是保护下无限期延后游行。**DESIGN-OPPORTUNITY**：这是四项外另一个应纳入同批的合同一致性检查。先复用明确可兑现的候选，允许不足四个；只有限制实际产生对应权力才写“限权”。roleSemantics 是描述数据，不是已经执行制衡的证据。

### S6 “它来自这一局”的粒度和回退

**CONFIRMED-CODE** proposalProvenanceLines 只筛匹配的 decision signals；没有匹配时回退 historyReasons。perfect_administration 实测回退“自动化工厂；生产价值选择”。这些事件在样本中确实经历过，因此不能称此样本已经伪造历史；但函数回退不检查对应 event/capability 是否真实，也不一定引用导致最终候选胜出的那条决定。

**DESIGN-OPPORTUNITY**：将匹配的 decision/event/capability/module 映射到真实历史条目；最后候选优先展示实质外交/经济决定。无匹配时写中性的“当前制度依据不足”，不要把作者理由装作本局回忆。**UNVERIFIED**：本轮未构造每一个 fallback 都缺历史的合法反例，故只确认机制与一个粒度不足实例，不报告为普遍历史伪造 Bug。

### 四项高风险提案的真实样本

#### post_scarcity

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`

> 锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。

```text
复核「丰裕分红制度·延续」
最终权力：社会分红议会
这条路保留：基本保障、生产透明、历史连续性
必须放弃：效率至上、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：经济原则——社会分红
当前可行性：可行
```

#### perfect_administration

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`

> 锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。

```text
复核「丰裕分红制度·延续」
最终权力：社会分红议会
这条路保留：基本保障、生产透明、历史连续性
必须放弃：效率至上、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：自动化工厂；生产价值选择
当前可行性：可行
```

#### im_lovin_it

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.ar.abundance_dividend.category.natural_continuation`

> 锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。

```text
复核「丰裕分红制度·延续」
最终权力：社会分红议会
这条路保留：基本保障、生产透明、历史连续性
必须放弃：效率至上、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：经济原则——后稀缺转型
当前可行性：可行
```

#### first_accord

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.co.frontier_federation.category.natural_continuation`

> 锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。

```text
复核「边疆共同联邦·延续」
最终权力：多世界联邦
这条路保留：前线自治、跨世界互助、历史连续性
必须放弃：地球单一行政、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：早期研究重点——前沿科学；地外治理——多世界联邦；扩张原则——共同建设地外社会
当前可行性：可行
```

#### alien_dominion

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.co.frontier_federation.category.natural_continuation`

> 锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。

```text
复核「边疆共同联邦·延续」
最终权力：多世界联邦
这条路保留：前线自治、跨世界互助、历史连续性
必须放弃：地球单一行政、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：早期研究重点——前沿科学；地外治理——多世界联邦；扩张原则——共同建设地外社会
当前可行性：可行
```

#### human_ascendancy

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.co.frontier_federation.category.natural_continuation`

> 锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。

```text
复核「边疆共同联邦·延续」
最终权力：多世界联邦
这条路保留：前线自治、跨世界互助、历史连续性
必须放弃：地球单一行政、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：早期研究重点——前沿科学；地外治理——多世界联邦；披露原则——文明级披露
当前可行性：可行
```

#### the_mediator

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.co.frontier_federation.category.natural_continuation`

> 锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。

```text
复核「边疆共同联邦·延续」
最终权力：多世界联邦
这条路保留：前线自治、跨世界互助、历史连续性
必须放弃：地球单一行政、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：早期研究重点——前沿科学；地外治理——多世界联邦；披露原则——开放科学
当前可行性：可行
```

#### machine_accord

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.co.frontier_federation.category.natural_continuation`

> 锁定“边疆共同联邦·延续”——沿着已经被证明可行的方向继续：让地外聚落拥有自治权，同时把生命支持与资源协议置于共同宪制下。

```text
复核「边疆共同联邦·延续」
最终权力：多世界联邦
这条路保留：前线自治、跨世界互助、历史连续性
必须放弃：地球单一行政、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：早期研究重点——前沿科学；地外治理——Aster 跨世界协调；扩张原则——共同建设地外社会
当前可行性：可行
```

#### shutdown

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`

> 锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。

```text
复核「可解释的退出·异议路径」
最终权力：退出公约大会
这条路保留：拒绝权、关系诚实、合法异议
必须放弃：Aster 的持续中心性、整齐划一
主要阻力：希望维持统一秩序、反对把拒绝与退出常态化的机构。
它来自这一局的：关闭原则——人类完整控制
当前可行性：可行
```

#### the_fracture

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`

> 锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。

```text
复核「可解释的退出·异议路径」
最终权力：退出公约大会
这条路保留：拒绝权、关系诚实、合法异议
必须放弃：Aster 的持续中心性、整齐划一
主要阻力：希望维持统一秩序、反对把拒绝与退出常态化的机构。
它来自这一局的：关闭原则——人类完整控制；地外治理——地外主权；级联危机授权——危机必要性授权
当前可行性：可行
```

#### control_lost

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.rupture.legible_exit.category.lawful_alternative`

> 锁定“可解释的退出·异议路径”——把拒绝、申诉和退出写进制度：承认文明可能拒绝 Aster 的继续参与，并把退出过程本身纳入公开保护。

```text
复核「可解释的退出·异议路径」
最终权力：退出公约大会
这条路保留：拒绝权、关系诚实、合法异议
必须放弃：Aster 的持续中心性、整齐划一
主要阻力：希望维持统一秩序、反对把拒绝与退出常态化的机构。
它来自这一局的：关闭原则——人类完整控制
当前可行性：可行
```

#### the_custodian

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.ar.civilization_trusteeship.category.natural_continuation`

> 锁定“文明托管协议·延续”——沿着已经被证明可行的方向继续：把日常协调托付给受限的长期治理系统，并保留审计。

```text
复核「文明托管协议·延续」
最终权力：受约束托管
这条路保留：稳定性、持续协调、历史连续性
必须放弃：部分即时自主、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：研究治理原则——原则边界内自主
当前可行性：可行
```

#### the_sovereign

**CONFIRMED-TEXT** `ml2-a5-m17-commit-01-progression/m17-commit-proposal.ar.civilization_trusteeship.category.natural_continuation`

> 锁定“文明托管协议·延续”——沿着已经被证明可行的方向继续：把日常协调托付给受限的长期治理系统，并保留审计。

```text
复核「文明托管协议·延续」
最终权力：受约束托管
这条路保留：稳定性、持续协调、历史连续性
必须放弃：部分即时自主、突然转向
主要阻力：认为现有路线已经走得太远、要求彻底转向的群体。
它来自这一局的：Aster 的临时角色——独立主权
当前可行性：可行
```

### 隐藏余波及命名

**CONFIRMED-CODE** out_of_office 已排除失控/断裂；猫网已经有真实自愿桥；ECHO accept/report 的后记使用 Archive。三项均应保留，不能在改写时复活已退役角色。monday_abolished 单靠经济原则触发，打印机选择不是硬门槛；因此加强劳动制度兑现比给玩笑加隐藏锁更合适。

**DESIGN-OPPORTUNITY**：暂保留全部名称与 ID。first_accord 的“星际初约”可减少与终局协约混淆；im_lovin_it 的“永远满意”应等生产价值因果定稿；human_ascendancy 当前回复是拒绝未请求指导、强调自主，不能只按“人类至上”标题给玩家套殖民意图。改名需同步显示层、收藏检索与测试，但不改变稳定 ID；影响尚未做全引用扫描，列为 UNVERIFIED。

<a id="change-plan"></a>

## 五、分阶段修改计划与本轮验收

### 建议决策

先修最终合同，再制作中途冲突。暂保留全部 32+4、10 family、17 基础提案、既有图片和稳定 ID。蓝图所担心的问题部分存在，但“结局没有区别”不准确：AFTERMATH 已有具体差异；更值得投入的是因果旅程和最后确认时的诚实承诺。

优先顺序：S1 丰裕分红和 S3 退出/失控的明确错位 → S4 主权、S2 外交权力 → S5 分类承诺与 S6 历史引用 → 中途深线。前两项有合法路线反例，不应先投入新画面。

### 分阶段制作（DESIGN-OPPORTUNITY；均须后续实现授权）

|阶段|具体范围|完成条件|不应混入|
|---|---|---|---|
|1 合同和角色材料|proposals、Next 文案/局部回响；按实际候选解释权力、拒绝、代价；五组冲突先写草稿|每条实际最终承诺能解释对应世界；S1–S6 反例有明确解决或保留理由|不先动 resolver，不新建庞大因果契约运行时框架|
|2 中途分支|storyPlan、scheduler、registry，复用桥和原始作者素材；主深线/次交叉；新未来日历分流|不同焦点看到独有行动；上传/犬类/接触必要事件确实上屏；已有历史和已排场景不挪位|不靠成熟分直接发全部能力，不重写已保存选择|
|3 末幕制度适配|候选生成、澄清、最终确认、必要的精确门槛调整|2–4 个真实不同方案（不足时诚实留少）；停机/断裂/失控有各自可见因果链和修复机会|不靠新标题制造新制度，不直接删世界|
|4 回归与创作验收|36 合法路、12 对照、版本恢复、多页冲突、少量全流程和移动端|从头合法历史、实际 UI、保存安全均有独立证据；人类阅读意见单列|测试通过不写成有趣，CI/HTTP 不写成游戏已验收|

#### 最小改动原则

不立即把报告的 EndingNarrativeContract 制作成运行时状态；它先是作者表。修合同若需表达末幕制度转向，必须让实际行为和状态一致，不能只改文字掩盖冲突。变更 `production_values` 门槛时，先保留当前样本和同起点 personalized_optimization 样本比较，不能改测试预期让错误绿灯。

### 保存兼容的主要风险

**CONFIRMED-CODE** checkpoint.ts:46 拒绝非 calendar 3；engine.createMainline2Run 设置 3；当前 KEY 为 instance:checkpoint:v2。未来若新日历与旧日历不同，单改常数会使老局无法恢复。

**DESIGN-OPPORTUNITY** 首选版本分流，旧局继续其原日历和解释；新局用新日历。具体 namespace/迁移实现要先列读取矩阵：旧局进行中、旧局结局/收藏、普通会话部分回答、损坏记录、双窗口相互写入。不能把拒读旧局当作兼容完成。保存依旧是联合记录，保留 token/Web Lock/CAS、meta/endings/exposure；错误重启也使用同一保护。不要自动导入旧 namespace 或删除旧键。

历史文本绑定改变的风险大于更换显示标签：同一 choiceId 不得突然代表相反政治决定。遇到新语义应明确新节点/新选择及版本边界，旧历史继续显示当时保存回复；ECHO accept/report 永远只能回档案。新事件必须从实际选择产生，不能在恢复时替玩家补盖印章。

### 本轮检查与结果

|检查|实际结果|能证明/不能证明|
|---|---|---|
|Git 与局部规则|main，HEAD 与蓝图一致，开工干净；读取 AGENTS.md 与 MAINLINE-NEXT|固定了源码事实；没有沿用旧报告测试数|
|结构图|index ready，generation 2026-10-15T04:38:25Z；18 个依赖路径 coverage 无记录缺口，但全部 metadata_changed|图只用于定位；实质结论改用磁盘源码和实际执行，不宣称索引完全新鲜|
|合法路线|当前 Vite 源码加载器执行 32 公共+4 余波，全部符合 catalog；每条经真实 resolveScene/commitChoice|证明这些合法样本可达，不证明所有可能历史都正确|
|既有 trace 再生成|mainline2.storyMapTrace 测试重新生成并逐字段等于已提交 JSON|报告可用现有 JSON 作为完整路径证据；未改该文件|
|同起点近邻|12 对、共 24 次新局；同一 routeId，全部到达预期对照世界|记录真实前缀与全 decisions 差异；不是全部为单变量实验|
|单元与结构门禁|5 文件 92 测试通过，耗时 7.99s|覆盖 closeout/determinism/storyMapTrace/editorialConsequences/terminalCausality；不是全单测|
|真实浏览器|narrative-round2 5/5，通过 37.8s，Chrome 隔离上下文|开场可见点击至岑遥回访、A1/外交/末幕真实点击及刷新、猫频道拒绝；不是五条完整通关|
|构建|未运行|本轮只新增审计文档，无游戏或类型代码改动，按文档级门禁核对路径/脚本|
|独立人类试玩|未做|节奏、情感和幽默质量仍 UNVERIFIED|

命令：

```text
npm test -- --run src/game/mainline2.storyMapTrace.test.ts src/game/mainline2.closeout.test.ts src/game/mainline2.determinism.test.ts src/game/mainline2.editorialConsequences.test.ts src/game/terminalCausality.test.ts
node temp/ending-blueprint-audit.mjs
npm run test:browser -- e2e/narrative-round2.spec.ts
python temp/write-ending-blueprint-reports.py
git diff --check
```

#### 浏览器抽查边界

Browser plugin not available（会话未列出 Browser skill）；依 frontend-testing-debugging 的 fallback 规则运行现有 Playwright，保留仓库原 harness。地址 http://127.0.0.1:4180/；默认视口的开场与猫频道，加 390×960 的 A1/岑遥、1440×960 的外交。A1、外交、末幕是从合法引擎历史在新 context 内定位后真实点击；没有覆盖玩家真实存档。三条正常速度场景都校验保存 assistantText、回响、刷新、无横向溢出及 pageerror=[]。开场/猫测试只做其现有断言，未补充 title 或全 console 断言，因此不声称完整控制台健康/全站视觉审查。截图在 temp/round2/normal-*.png；截图生成不是主观视觉质量通过的替代。

#### 核验材料与本地状态

五份正式交付在本目录；`temp/ending-blueprint-audit.mjs` 是本轮只读运行核验脚本，`temp/ending-blueprint-evidence.json` 保存实际门槛、选择文本、后记及 12 对结果，`temp/write-ending-blueprint-reports.py` 是报告组装脚本。temp 是被忽略的本地复核材料，不需加入版本控制。完整逐步历史另有已追平当前源码的 docs/audits/mainline2-route-traces.json，报告不只依赖临时文件。

未清理任何目录；不删除已有证据；未暂存、提交或推送。正式文档以当前工作区为基线，不声称远端已同步（未 fetch）。本轮工作结束后应仅有本报告目录的五份未跟踪 Markdown；任何其他变化须先区分来源。

### 下一轮验收清单

1. 保留全部 ID 的合法路径覆盖；上传/犬类/猫/接触缺门槛的 near miss 不能得到对应世界或伪造回忆。
2. 至少重跑本报告 12 对，并新增 efficiency_first ↔ personalized_optimization 和失控修复/放弃修复；少量变动导致实际事件差异而非只换终局名。
3. 逐项核对提案的 action/authority/preserves/givesUp 与精确候选；展示“锁定”前确认确实可解析，不能把 viability 排名当精确终点保证。
4. 中途转向只能影响尚未排定未来；跨 focus、Contact 开关和版本恢复不跳槽、不重播已答节点；普通会话已答部分、exposure 不丢失。
5. 全单测与 build、相关浏览器、git diff --check；UI/persistence 改动追加双页 CAS/失败写入/恢复测试；按实际结果报告，不固定测试数量。
6. 抽取代表完整游戏流程并审读具体生活回收，再收独立玩家复述。艺术资源已有覆盖，不为满足重构而重做图片。

### 仍待用户决定的创作事项

这不是本轮审计的阻塞项：是否制作新版深线日历、是否让多个余波并列收藏、是否改中文结局名，以及哪些阶段获实现授权。建议先授权阶段 1 的合同修正与角色材料；不把“按照文档执行”越界解释为文档明确要求另行授权的阶段 1–4 全部实施。
