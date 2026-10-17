# 分阶段修改计划与本轮验收

审计日期：2026-10-15（Asia/Shanghai）。基线：main@db786c8378cca144c6b151fecec75c909dca57af；开工工作区干净。依据用户指定蓝图第 10 节执行第一轮：仅生成报告与本地核验材料，不修改游戏、存档或依赖，不提交、推送、创建 PR、发布。第 11 节实现未执行。

证据标签：**CONFIRMED-CODE**＝当前源码或本轮运行可证明；**CONFIRMED-TEXT**＝当前可见文本可证明；**DESIGN-OPPORTUNITY**＝创作建议，不表示已存在或已获实现授权；**UNVERIFIED**＝未完成验证。测试不是有趣程度的证明。

五份报告：[结局倒推表](ENDING_BACKWARD_MAP.md) · [五线架构](FIVE_ROUTE_STORY_ARCHITECTURE.md) · [冲突与对话](NARRATIVE_CONFLICT_AND_DIALOGUE_PLAN.md) · [提案审计](PROPOSAL_ENDING_SEMANTIC_AUDIT.md) · [实施计划与验收](NARRATIVE_CHANGE_PLAN.md)。

## 建议决策

先修最终合同，再制作中途冲突。暂保留全部 32+4、10 family、17 基础提案、既有图片和稳定 ID。蓝图所担心的问题部分存在，但“结局没有区别”不准确：AFTERMATH 已有具体差异；更值得投入的是因果旅程和最后确认时的诚实承诺。

优先顺序：S1 丰裕分红和 S3 退出/失控的明确错位 → S4 主权、S2 外交权力 → S5 分类承诺与 S6 历史引用 → 中途深线。前两项有合法路线反例，不应先投入新画面。

## 分阶段制作（DESIGN-OPPORTUNITY；均须后续实现授权）

|阶段|具体范围|完成条件|不应混入|
|---|---|---|---|
|1 合同和角色材料|proposals、Next 文案/局部回响；按实际候选解释权力、拒绝、代价；五组冲突先写草稿|每条实际最终承诺能解释对应世界；S1–S6 反例有明确解决或保留理由|不先动 resolver，不新建庞大因果契约运行时框架|
|2 中途分支|storyPlan、scheduler、registry，复用桥和原始作者素材；主深线/次交叉；新未来日历分流|不同焦点看到独有行动；上传/犬类/接触必要事件确实上屏；已有历史和已排场景不挪位|不靠成熟分直接发全部能力，不重写已保存选择|
|3 末幕制度适配|候选生成、澄清、最终确认、必要的精确门槛调整|2–4 个真实不同方案（不足时诚实留少）；停机/断裂/失控有各自可见因果链和修复机会|不靠新标题制造新制度，不直接删世界|
|4 回归与创作验收|36 合法路、12 对照、版本恢复、多页冲突、少量全流程和移动端|从头合法历史、实际 UI、保存安全均有独立证据；人类阅读意见单列|测试通过不写成有趣，CI/HTTP 不写成游戏已验收|

### 最小改动原则

不立即把报告的 EndingNarrativeContract 制作成运行时状态；它先是作者表。修合同若需表达末幕制度转向，必须让实际行为和状态一致，不能只改文字掩盖冲突。变更 `production_values` 门槛时，先保留当前样本和同起点 personalized_optimization 样本比较，不能改测试预期让错误绿灯。

## 保存兼容的主要风险

**CONFIRMED-CODE** checkpoint.ts:46 拒绝非 calendar 3；engine.createMainline2Run 设置 3；当前 KEY 为 instance:checkpoint:v2。未来若新日历与旧日历不同，单改常数会使老局无法恢复。

**DESIGN-OPPORTUNITY** 首选版本分流，旧局继续其原日历和解释；新局用新日历。具体 namespace/迁移实现要先列读取矩阵：旧局进行中、旧局结局/收藏、普通会话部分回答、损坏记录、双窗口相互写入。不能把拒读旧局当作兼容完成。保存依旧是联合记录，保留 token/Web Lock/CAS、meta/endings/exposure；错误重启也使用同一保护。不要自动导入旧 namespace 或删除旧键。

历史文本绑定改变的风险大于更换显示标签：同一 choiceId 不得突然代表相反政治决定。遇到新语义应明确新节点/新选择及版本边界，旧历史继续显示当时保存回复；ECHO accept/report 永远只能回档案。新事件必须从实际选择产生，不能在恢复时替玩家补盖印章。

## 本轮检查与结果

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

### 浏览器抽查边界

Browser plugin not available（会话未列出 Browser skill）；依 frontend-testing-debugging 的 fallback 规则运行现有 Playwright，保留仓库原 harness。地址 http://127.0.0.1:4180/；默认视口的开场与猫频道，加 390×960 的 A1/岑遥、1440×960 的外交。A1、外交、末幕是从合法引擎历史在新 context 内定位后真实点击；没有覆盖玩家真实存档。三条正常速度场景都校验保存 assistantText、回响、刷新、无横向溢出及 pageerror=[]。开场/猫测试只做其现有断言，未补充 title 或全 console 断言，因此不声称完整控制台健康/全站视觉审查。截图在 temp/round2/normal-*.png；截图生成不是主观视觉质量通过的替代。

### 核验材料与本地状态

五份正式交付在本目录；`temp/ending-blueprint-audit.mjs` 是本轮只读运行核验脚本，`temp/ending-blueprint-evidence.json` 保存实际门槛、选择文本、后记及 12 对结果，`temp/write-ending-blueprint-reports.py` 是报告组装脚本。temp 是被忽略的本地复核材料，不需加入版本控制。完整逐步历史另有已追平当前源码的 docs/audits/mainline2-route-traces.json，报告不只依赖临时文件。

未清理任何目录；不删除已有证据；未暂存、提交或推送。正式文档以当前工作区为基线，不声称远端已同步（未 fetch）。本轮工作结束后应仅有本报告目录的五份未跟踪 Markdown；任何其他变化须先区分来源。

## 下一轮验收清单

1. 保留全部 ID 的合法路径覆盖；上传/犬类/猫/接触缺门槛的 near miss 不能得到对应世界或伪造回忆。
2. 至少重跑本报告 12 对，并新增 efficiency_first ↔ personalized_optimization 和失控修复/放弃修复；少量变动导致实际事件差异而非只换终局名。
3. 逐项核对提案的 action/authority/preserves/givesUp 与精确候选；展示“锁定”前确认确实可解析，不能把 viability 排名当精确终点保证。
4. 中途转向只能影响尚未排定未来；跨 focus、Contact 开关和版本恢复不跳槽、不重播已答节点；普通会话已答部分、exposure 不丢失。
5. 全单测与 build、相关浏览器、git diff --check；UI/persistence 改动追加双页 CAS/失败写入/恢复测试；按实际结果报告，不固定测试数量。
6. 抽取代表完整游戏流程并审读具体生活回收，再收独立玩家复述。艺术资源已有覆盖，不为满足重构而重做图片。

## 仍待用户决定的创作事项

这不是本轮审计的阻塞项：是否制作新版深线日历、是否让多个余波并列收藏、是否改中文结局名，以及哪些阶段获实现授权。建议先授权阶段 1 的合同修正与角色材料；不把“按照文档执行”越界解释为文档明确要求另行授权的阶段 1–4 全部实施。
