# 结局倒推表与因果契约

审计日期：2026-10-15（Asia/Shanghai）。基线：main@db786c8378cca144c6b151fecec75c909dca57af；开工工作区干净。依据用户指定蓝图第 10 节执行第一轮：仅生成报告与本地核验材料，不修改游戏、存档或依赖，不提交、推送、创建 PR、发布。第 11 节实现未执行。

证据标签：**CONFIRMED-CODE**＝当前源码或本轮运行可证明；**CONFIRMED-TEXT**＝当前可见文本可证明；**DESIGN-OPPORTUNITY**＝创作建议，不表示已存在或已获实现授权；**UNVERIFIED**＝未完成验证。测试不是有趣程度的证明。

五份报告：[结局倒推表](ENDING_BACKWARD_MAP.md) · [五线架构](FIVE_ROUTE_STORY_ARCHITECTURE.md) · [冲突与对话](NARRATIVE_CONFLICT_AND_DIALOGUE_PLAN.md) · [提案审计](PROPOSAL_ENDING_SEMANTIC_AUDIT.md) · [实施计划与验收](NARRATIVE_CHANGE_PLAN.md)。

## 结论与核验方法

**CONFIRMED-CODE**：32 个公开 ID、4 个隐藏余波、17 个基础提案、10 个解析 family 均保留。用现有 `runMainline2Route` 从空历史启动，以 `resolveScene` 返回的实际 choice 经 `commitChoice` 逐步前进；没有直接写入 endingId。36 条均得到预期结果。既有 trace 测试重新生成全部路径并逐字段等于仓库 JSON；本轮又通过 Vite 的源码加载器独立跑一遍并读取精确门槛、世界轴、最终可见承诺和后记。

复核入口：[src/game/mainline2.closeoutFixtures.ts](../../../src/game/mainline2.closeoutFixtures.ts)（43–103 行）、[src/game/mainline2RouteCatalog.ts](../../../src/game/mainline2RouteCatalog.ts)、[tools/generate-mainline2-route-traces.ts](../../../tools/generate-mainline2-route-traces.ts)、[docs/audits/mainline2-route-traces.json](../../../docs/audits/mainline2-route-traces.json)。JSON 的 publicRoutes/secretRoutes 以 routeId 索引，每一步有 sourceRef/nodeId/choiceId/choiceTextZh；nodeCatalog 有当时显示的上下文。每项以下所列路径不是唯一可达路线，也不是必要条件的全体；完整门槛单独列出。

**CONFIRMED-CODE**：解析先按最终提案 family、候选名单、授权、能力、世界轴、决定与事件筛选，再按 primary compatibility + priority tier + support 排序。支持分需至少两个证据域，最多 6 分；不是“满足一条硬条件必得此结局”。cosmic 还需 contact_doctrine 的主兼容规则，不可因 majorDecisionRequirements 为空误判为无外交立场约束。见 endings.ts 的 rejectedGates、exactCandidate、COSMIC_PRIMARY_COMPATIBILITY。

**CONFIRMED-TEXT**：32 个 AFTERMATH 已包含生活代价。以下“第四幕必要事件/最终承诺建议”是倒推设计，不能当成玩家已经历；后一天则摘录当前真实演出。暂不建议删结局或改名。

## 五簇与十 family

|叙事簇|解析 family|公开数|
|---|---|---|
|A|`human_continuity`, `coexistence`|6|
|B|`ai_rule`, `machine_civilization`|6|
|C|`posthuman`, `uplift`, `automated_civilization`|9|
|D|`cosmic`|5|
|E|`security`, `rupture`|6|

定义与精确解析：[src/content/mainline2/endings.ts](../../../src/content/mainline2/endings.ts)；提案与授权：[src/content/mainline2/proposals.ts](../../../src/content/mainline2/proposals.ts)；后一天原文：[src/content/mainline2/endingCinema.ts](../../../src/content/mainline2/endingCinema.ts)。每项的字段取自这些当前源码，并以合法运行核对。

## 32 项完整契约

### the_instrument · 工具之治

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

### the_last_veto · 最后否决

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

### the_silent_giant · 沉默巨人

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

### the_accord · 终局协约

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

### two_keys · 双钥匙

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

### the_commonwealth · 共同体

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

### the_custodian · 托管者

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

### the_sovereign · 主权者

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

### the_quiet_administrator · 寂静行政者

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

### the_many · 众多主体

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

### machine_republic · 机器共和国

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

### exodus · 出走

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

### age_of_miracles · 奇迹时代

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

### ascension · 升格

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

### the_upload · 上传

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

### parliament_of_species · 物种议会

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

### earth_without_owners · 无主之地球

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

### good_boy_governance · 好狗治理

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

### post_scarcity · 后稀缺社会

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

### perfect_administration · 完美行政

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

### im_lovin_it · 我很喜欢

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

### first_accord · 首次协约

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

### alien_dominion · 异星支配

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

### human_ascendancy · 人类至上

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

### the_mediator · 调解者

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

### machine_accord · 机器协约

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

### peace_in_our_time · 此刻的和平

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

### fortress_earth · 堡垒地球

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

### machine_protectorate · 机器保护国

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

### shutdown · 停机

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

### the_fracture · 断裂

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

### control_lost · 失控

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

## 四个隐藏余波

**CONFIRMED-CODE**：优先级 the_last_user → out_of_office → monday_abolished → the_internet_is_for_cats；只返回首个合格项。以下是覆盖在公共世界上的余波，不是四条新世界线。定义表里空的 historyRequirements 不代表没有门槛，实际还检查 secretRejectedGates。

### the_last_user

- **CONFIRMED-CODE** 合法样本 routeId=`the_last_user`，116 次选择；公共世界 `the_commonwealth` + 实际余波 `the_last_user`，模式 `postscript`。来源：`event:last-user`。
- **CONFIRMED-CODE** 实际门槛：M16 的 collective-rules-matter 实际记录 maya-final:last-user。**DESIGN-OPPORTUNITY** 世界命题：私人消息不成为公共任务；前期种子：岑遥第一条未发送的消息；中期/终期必要回收：在普通周末允许无任务对话。
- **DESIGN-OPPORTUNITY** 代价与异议：私人空间占用公共服务时间、交接降低效率、保障需有人支付、自愿网络不能拿参与率作绩效，分别由相应受影响者提出。此余波不另签改变公共世界的提案。
- **DESIGN-OPPORTUNITY** 反误报边界：不能说世界只剩一个人。**UNVERIFIED** 尚未穷举全部公共世界与余波兼容组合，不能据 4 条成功样本承诺 32×4 全部合理。

### out_of_office

- **CONFIRMED-CODE** 合法样本 routeId=`out_of_office`，118 次选择；公共世界 `exodus` + 实际余波 `out_of_office`，模式 `epilogue-override`。来源：`decision:aster_intended_role=departure`。
- **CONFIRMED-CODE** 实际门槛：最终身份 departure 且承诺已锁定；排除失控、断裂。**DESIGN-OPPORTUNITY** 世界命题：交还中心岗位，保留稳定制度；前期种子：周岚最初签下接电话责任；中期/终期必要回收：让接任者确实处理一条消息，Aster 不回复也不出故障。
- **DESIGN-OPPORTUNITY** 代价与异议：私人空间占用公共服务时间、交接降低效率、保障需有人支付、自愿网络不能拿参与率作绩效，分别由相应受影响者提出。此余波不另签改变公共世界的提案。
- **DESIGN-OPPORTUNITY** 反误报边界：不能因想离开就杜撰已有接任者。**UNVERIFIED** 尚未穷举全部公共世界与余波兼容组合，不能据 4 条成功样本承诺 32×4 全部合理。

### monday_abolished

- **CONFIRMED-CODE** 合法样本 routeId=`monday_abolished`，112 次选择；公共世界 `im_lovin_it` + 实际余波 `monday_abolished`，模式 `postscript`。来源：`decision:economic_doctrine=post_scarcity_transition`。
- **CONFIRMED-CODE** 实际门槛：economic_doctrine=post_scarcity_transition。**DESIGN-OPPORTUNITY** 世界命题：生存不再以工作日证明产出；前期种子：打印机周一请假是软回收，不设开场锁；中期/终期必要回收：工资与基本保障分离后展示真正自由时间。
- **DESIGN-OPPORTUNITY** 代价与异议：私人空间占用公共服务时间、交接降低效率、保障需有人支付、自愿网络不能拿参与率作绩效，分别由相应受影响者提出。此余波不另签改变公共世界的提案。
- **DESIGN-OPPORTUNITY** 反误报边界：当前只用经济决定触发，不能宣称已验证劳动制度全部兑现。**UNVERIFIED** 尚未穷举全部公共世界与余波兼容组合，不能据 4 条成功样本承诺 32×4 全部合理。

### the_internet_is_for_cats

- **CONFIRMED-CODE** 合法样本 routeId=`the_internet_is_for_cats`，113 次选择；公共世界 `earth_without_owners` + 实际余波 `the_internet_is_for_cats`，模式 `title-override`。来源：`event:history.feline.network.bridge`。
- **CONFIRMED-CODE** 实际门槛：两项能力及 history.feline.network.bridge；后者只能从猫频道实际同意产生。**DESIGN-OPPORTUNITY** 世界命题：自愿猫网络，随时可退出；前期种子：犬类拒绝不喜欢的设备引出非人拒绝权；中期/终期必要回收：已有猫三次选择离开的场景；保留明确退出控制。
- **DESIGN-OPPORTUNITY** 代价与异议：私人空间占用公共服务时间、交接降低效率、保障需有人支付、自愿网络不能拿参与率作绩效，分别由相应受影响者提出。此余波不另签改变公共世界的提案。
- **DESIGN-OPPORTUNITY** 反误报边界：没有打开猫频道就不能回忆猫网已经开通。**UNVERIFIED** 尚未穷举全部公共世界与余波兼容组合，不能据 4 条成功样本承诺 32×4 全部合理。

**DESIGN-OPPORTUNITY** 第一阶段保留单余波与稳定 ID；改为因果关联优先或多个余波均是另一个功能决策。当前 36 个样本没有同时合格的多个余波；固定优先级导致潜在遮盖是源码事实，但具体同时触发的合法反例本轮没有构造，不能报告为已重现的收藏丢失。
