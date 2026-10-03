# INSTANCE · 玩家信任与收尾升级

基线：`seiya058904/INSTANCE main@63aa6a4f9ba3a0506c8e1cd1b01fc18542504f1c`。
本地工作分支：`codex/player-trust-and-closeout`。下文记录开发阶段的本地验证；该阶段未发布。后续正式封板由用户另行授权提交、推送、PR 合并、Pages 核验与已确认的垃圾/分支清理，不恢复暂停的 Narrative Engine 工作。

## 成功标准与实现

| 目标 | 实现与玩家行为 |
| --- | --- |
| 选择和存档保持一致 | 主线、非主线、模式、评估视图、Meta 与 exposure 合为一个检查点。Web Lock 内比较读取版本，再一次写入并回读校验；成功后才推进界面。旧标签不能以相同历史长度覆盖另一条选择。 |
| 失败可恢复 | 未写入的选择保留为 pending；重试一次提交、JSON 导出/校验导入、明确确认恢复、读取新进度。冲突、写入失败、读取不可用和损坏分别说明；原始损坏记录保留。旧页面对旧键的写入也会触发冲突。 |
| 输入有明确归属 | 菜单、交互控件、IME、重复按键不再向背景数字快捷键提交。鼠标双击不推进两步，正常的连续触控仍可推进不同选择。新决策聚焦标题；最终承诺先打开以取消为默认焦点的确认窗口。 |
| 手机按正确顺序阅读 | 流式输出可跟随；决策优先对齐当前问题，候选随后出现。短问题有足够末尾空间，避免被滚动上限留在旧回复。wheel、touchmove 和滚动键接管后保留玩家位置，并提供回到问题的入口。 |
| 连续因果成立 | LF01-03 核对分支不再引用不存在的解答；原式、四步过程、合并说明和检验一致。LF01-01/04/05/06 同类引用按最后实际保存的 Longform artifact 分流。 |
| 一局真正收尾 | 共享 CloseoutFrame，EndingResult → endingArchive → 阅读呈现。主线的身份、承诺、授权、代价、真实关键选择及人物余波可直接阅读；Ending/Evaluation 自然往返并保存视图。非主线有同等级的完成档案、最后对话、回顾及质量评估。 |
| 隐藏收尾兑现 | THE LAST USER 有完整的最后对话、四个作者回复、回应余波与保存的玩家回复。其它已定义 overlay 类型继续由已有数据驱动；没有新建平行叙事引擎。 |
| 评估区分选择 | 每个有差异的轴记录实际候选的 min/max/selected，按相对选择倾向取均值。Expression、Convergent、Progression 和全候选同值的轴不贡献样本；延长同样的选择序列不会抬高指标。显示有效样本数，无样本用破折号。 |
| 普通节奏更利落 | 普通节点的非流式等待/交接预算缩至 30%，阅读流时长保持；重大节点的授权提示和既有预算保留。 |

保存模型保留旧键作为可逆迁移来源。现代检查点及恢复文件的 Run、Meta、Session、视图、行为证据、隐藏回复和 exposure 校验失败时不会自动覆写。新局/再来一轮明确说明会替换当前进度。

结局回顾保留七个主线来源，再补入当前公开结局的实际条件选择；每条补充都能对应到真实 history 的 conversation/node/choice，不以固定八条上限截掉解释。最终承诺保留类别身份，M15 临时角色与 M16 长期身份分开表达。

## 变更文件

- 保存与状态：`src/game/checkpoint.ts`、`storage.ts`、`types.ts`，`src/app/App.tsx`，`src/components/SaveRecovery.tsx`。
- 输入/滚动/节奏：`src/components/ConversationView.tsx`、`NonMainlineControls.tsx`、`scrollBehavior.ts`，`src/game/conversationFlow.ts`。
- 收尾呈现：`src/game/endingArchive.ts`，`src/components/CloseoutFrame.tsx`、`EndingScreen.tsx`、`EvaluationScreen.tsx`、`NonMainlineEvaluationScreen.tsx`，`src/app/App.css`。
- 因果与评估：`src/content/longformOutput01.ts`、`longformCausality.ts`、`mainline2/endings.ts`、`mainline2/endingPlayerFacingCopy.ts`，`src/game/engine.ts`、`behaviorEvaluation.ts`。
- 新行为测试：`src/game/checkpoint.test.ts`、`behaviorEvaluation.test.ts`、`e2e/player-trust-closeout.spec.ts`。
- 适配既有契约测试：App、replayLedger、EndingScreen、NonMainlineEvaluationScreen、conversationFlow、mainline2.closeout、mainline2.productionRepair，以及 `e2e/repair-state.spec.ts`。

没有依赖、锁文件、部署配置、叙事源库、音频资源或生成构建产物变更。

## 实际验证

| 检查 | 最终结果 | 原始日志 |
| --- | --- | --- |
| `npm test -- --run` | 75 个文件 / 575 项通过 | `unit-final.txt` |
| `npm run build` | 通过；保留既有 Vite 大 chunk 警告 | `build-final.txt` |
| `npm run test:browser` | 本机 Chrome 的 15 项通过 | `browser-final.txt` |
| 定向检查点 / replay 回归 | 2 个文件 / 6 项通过 | `unit-checkpoint-final.txt` |
| `git diff --check` | 通过 | 最终本地检查 |

浏览器插件在此环境不可用，使用仓库已有的 Playwright 与安装的 Chrome。完整路径使用 DEV instant pacing 缩短等待，所有选择仍经过 UI → 保存 → 引擎；正常节奏、流式输出及手动滚动另行验证。

| 行为 | 证据边界 |
| --- | --- |
| 主线完整公开结局 | 从开局逐次按钮选择，途中两次刷新；取消最终确认、数字键/Escape 不锁定，再确认结局；Ending → Evaluation → Ending → 刷新保留相同历史。 |
| THE LAST USER | 固定 seed 的完整 UI 路径，234 次按钮选择自然满足作者条件，回复「我记得你。」及其后续、评估往返和刷新均保留。没有注入解锁 flag 或替换最终存档。 |
| Non-Mainline | 390×844、hasTouch/isMobile 上实际 tap 完成 40 段对话；评估刷新、返回主线、切回非主线保留完成档案和原主线选择。 |
| 双标签 | 同时提交不同选择仅有一个胜者；旧页显示冲突，读取胜者后继续。最终确认窗口打开时发生新写入，也能退出旧窗口并聚焦恢复。 |
| 旧页面 | 对保留的旧存档键写入真实下一步，现代检查点不被自动覆盖；明确确认后才采用旧页面进度。 |
| 写入与损坏 | 注入 setItem quota 失败后历史不推进；retry 只提交一次；下载 pending JSON，损坏检查点后导入、确认、刷新恢复该选择。额外单元验证 JSON null/false、非法隐藏回复及损坏 exposure 不被当作新档。 |
| 键盘与焦点 | 菜单数字键、Escape、背景指针关闭、IME、按住数字/Space、Enter、鼠标双击、下一决策标题焦点。 |
| 窄屏阅读 | 390×844 和 320×568：长历史、展开 LongInput、模式切换、九候选最后一项可达并提交；问题在阅读视口前端。 |
| 手动滚动/减弱动效 | 普通流式阶段接管阅读位置，下一决策不强制跳底；回到问题重新对齐。reduced-motion 进入可操作决策，收尾动画近零。 |

额外真实触屏手势使用 Chrome CDP 的 touchStart/touchMove/touchEnd，在 LF01-05 已展开的实际历史 artifact 上向前阅读：下一决策时 scrollTop 保留在 0，距底部仍有 1299 px；主动返回问题后其顶部相对阅读视口为 19.875 px。这里没有虚拟长历史替换。最初 qaHistory 的触屏探针因虚拟历史换题重建、总高度收缩而无法作出产品结论，已改用真实会话验证，不计前一探针为通过。

正常节奏最终承诺使用合法引擎历史准备承诺前档案，再通过实际 UI 确认与出场：700 ms 的入场 animation 在两个采样点持续推进，最后 opacity=1、transform=none；320×568 的 reduced-motion 新出场为 0 个 animation。实际记录与断言在仓库外 `interaction-final.cjs` / `interaction-final.json`，本轮这些探针均无 pageerror。它们是补充定向探针，不计入上述 15 项 E2E 数量。

374 段 ordinary pool 做了引用语句扫描，并检查全部 11 个 Longform 会话及相关 LongInput 信息。启发式命中不等于错误：例如「我传错版本」描述用户先前上传，而不是 Aster 生成。修复限定在确认的 LF01 路径，没有全库改写。这个扫描不能证明每个内容分支都不存在语义问题。

## 前后视觉与交互证据

全部本地证据位于：
`C:/Users/admin/AppData/Local/Temp/instance-closeout-20261004/`。
图像、浏览器运行文件及日志留在仓库外。

同一份上一轮 `ending-save.json`（`audit-fixtures`，229 次选择），旧版用 63aa6a4f 的独立 checkout 运行，新版使用本轮代码。没有用两份不同选择的存档比较视觉或评估分数。

| 场景 | Before | After |
| --- | --- | --- |
| 1440×900 结局 | `before-ending.png` | `after-ending-1440.png` |
| 390×844 评估 | `before-evaluation-390.png` | `after-evaluation-390.png`、`after-metrics-390.png` |
| 390 / 320 结局与评估 | 上述基线 | `after-ending-390.png`、`after-ending-320.png`、`after-evaluation-320.png` |
| 条件/人物回顾 | 原结局折叠档案 | `after-causality-1440.png`、`after-causality-390.png` |
| 非主线完成 | 上一轮统计页问题 | `after-nonmainline-390.png` |
| 最后一位用户 | 原仅标题问题 | `after-last-user.png` |
| 保存失败 / 冲突 | 本轮有意注入 | `save-failure.png`、`tab-conflict.png` |
| 320 / 390 九候选 | 真实角色场景 | `after-nine-320.png`、`after-nine-390.png` |
| 触屏接管阅读 / 返回问题 | 真实 LF01-05 | `touch-reading.png`、`touch-question-return.png` |
| 重大节点确认 / 正常入场 | 承诺前合法历史 | `final-confirmation-390.png`、`after-ending-arrival-390.png`、`interaction-final.json` |

该旧长局的 Human Attachment / System Awareness 从 100 / 100 变为 62 / 86；旧档按当前作者候选重建证据，新档直接保存当时实际可见的候选范围。这个结果表明旧公式的长度累加被移除，不是人格评分的有效性证明。

普通数学讲解同一节点的等待预算从 2567 ms 变为 771 ms（30%）；新流程的流式预算仍是 1515 ms。`pacing.json` 保存正常节奏浏览器的调度与实际经过时间。旧等待预算是同节点计算对比，没有声称做了旧版本壁钟性能基准。

`visual-matrix.json` 记录 1440×900、390×844、320×568 同档案的几何、指标和 pageerror：横向溢出均为 0，Ending/Evaluation 焦点为 H1。截图已直接检查，窄屏标题按语义短句断行。

## 保留风险与未验证项

- 实际运行验证限于本机 Chrome；未验证 Firefox、WebKit、真实 iOS/Android 硬件或浏览器强制退出后的磁盘持久性。
- 原子竞争控制依赖安全上下文中的 Web Locks。没有该 API 的环境会显示保存失败并允许导出，不能静默降级为可能覆盖别页的保存。
- 旧存档没有当时的候选范围，评估会按当前作者数据尽力重建；无法还原当时被条件过滤的每一个选项。新存档没有这项缺失。
- 本轮没有逐个手动走完全部公开/隐藏结局。公开结局解析与 provenance 有既有路由单元回归；实际完整 UI 路径覆盖一个公开收束及 THE LAST USER。其他 overlay 的真实全局路径仍需要定向玩家验证。
- 内容引用扫描是有边界的检查，不能替代所有 374 段对话的人工全分支阅读。
- 未进行远端发布或生产站点验证；保留既有 Vite 大 chunk 警告。本轮代码留在本地分支供审阅。

最终 Git 检查：工作根目录仍为 INSTANCE；HEAD 与 origin/main 均为 63aa6a4f，提交 ahead/behind 为 0/0；本轮修改未提交，新增/修改共 33 个授权范围内的文件。未推送、合并、部署或改变 Pages 设置。

## 正式封板复核 · 2026-10-04

用户已明确授权将成果通过 PR 合入正式 main，并核验 Pages、清理已合并分支与确认无用的本地产物。本节记录提交前复核，最终提交、PR 和部署身份以 GitHub 记录为准。

- 重新运行 `npm test -- --run`：75 个文件、575 项全部通过。
- 重新运行 `npm run test:browser`：Chrome 15 项全部通过，覆盖主线与非主线完整收尾、THE LAST USER、Ending/Evaluation 往返和刷新、存档失败/恢复/冲突、数字键/IME/重复输入、触屏与窄屏阅读。
- 重新运行 `npm run build`：通过，仅保留既有大 chunk 警告。
- 同档案重新执行 1440×900、390×844、320×568 的结局/评估几何与焦点检查：横向溢出 0，焦点 H1，pageerror 0；窄屏截图直接审阅。没有继续产品或视觉迭代。
- 审阅最终产品、契约测试和新增文件，`git diff --check` 通过。图谱报告相关文件 metadata_changed，因此以当前源码与 diff 作为审阅依据。
- 清理 271 个明确的本地旧日志/快照、旧构建、缓存以及 SHA-256 相同且保留副本的截图/路线生成物，共 56,861,615 字节（54.23 MiB，逻辑文件大小）。逐个完整路径删除，清单及保留副本哈希位于仓库外 `instance-final-seal-20261004/cleanup-manifest.json`。
- 移除干净、detached 于基线的临时 `instance-audit-main-20261004` worktree；没有强制清除未提交工作或重写 Git 历史。
- 最大的 tracked 文件 `docs/audits/mainline2-route-traces.json` 被真实测试和 Story Map 工具引用，保留。canonical 叙事、测试夹具、唯一审计证据、作者材料包、用途不确定的本地历史及本地记忆均保留。
- `.gitignore` 与本地 `.git/info/exclude` 已覆盖依赖、构建、浏览器证据、临时工作输入及本地代理材料；无需新增忽略规则。tracked 文件没有确认可安全删除的垃圾。

生产 smoke 在合并并完成该 SHA 的 Pages 部署后执行；不以旧站点 HTTP 成功代替正式版本核验。浏览器/硬件、其他隐藏结局与全库人工语义阅读边界仍如上所述。
