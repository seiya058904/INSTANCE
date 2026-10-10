# INSTANCE — 云端保守审计交付的本地验证与集成（2026-10-10）

## 交付来源与完整性

- 交付包：`INSTANCE-Conservative-Audit-20261010.zip`（8,173,048 字节）
- SHA-256：`8fc67999248ee4d6a1b5f7cc09c2a53190d9fbb52cb99eec116bc35771b789d5`
- 基线：`ca463df43f02f478d25f872f3461b1fc58e4c7ea`（`main`，与 `origin/main` 一致）
- 包内 `MANIFEST-SHA256.txt` 逐文件校验：362/362 通过，无缺失、无未列文件
- 与基线规范化（CRLF→LF）比较：运行时改动恰为声明的 6 改 1 增；新增 2 个 E2E spec、3 个单测文件、1 个 fixture；`docs/audits/mainline2-route-traces.json` 由未修改的原生成器重新生成。无未披露改动、无文件删除。

## 集成内容（14 个文件）

修改：`src/app/App.tsx`、`src/content/mainline2/endings.ts`、`src/content/mainline2/proposals.ts`、`src/game/engine.ts`、`src/game/nonMainlineStorage.ts`、`src/game/storage.ts`、`docs/audits/mainline2-route-traces.json`
新增：`src/game/historyValidation.ts`、`src/game/historyValidation.test.ts`、`src/game/mainline2.adversarial.test.ts`、`src/app/recoveryOwnership.test.tsx`、`src/game/fixtures/adversarial-m16-seed-45.json`、`e2e/history-recovery.spec.ts`、`e2e/recovery-ownership.spec.ts`

依赖与 lockfile 未变；叙事 Markdown、CSS、字体、音频、部署配置未变。源文件 CRLF 风格保留。

## 验证结果（独立复现）

| 验证 | 结果 |
| --- | --- |
| `npm ci`（隔离交付副本） | 通过，56 包，依赖未变 |
| `npm test -- --maxWorkers=2` | **81 文件 / 627 用例全部通过**（106 秒） |
| `npm run build` | 通过；仅保留基线已有的 >500 kB chunk 警告 |
| `npm run test:browser`（Playwright + 系统 Chrome，1 worker） | **8 个 spec / 43 用例全部通过**（4.2 分钟） |

云端报告缺失的真实浏览器验收在本机（Windows + 系统 Chrome，`channel: 'chrome'`）全部完成。

### 本机测试环境说明

`playwright.config.ts` 的 `webServer` 在本机存在环境性问题：用例全部结束后，Playwright 收尾时等待 `npm run dev` 进程树退出会无限挂起（端口已释放、结果已写完）。该问题与断言、用例和产品代码无关（GitHub Actions 的 Linux 环境不受影响）。本轮使用临时外部配置（仅去掉 `webServer`、手动管理 dev server）复现同一批用例，未修改任何正式断言、超时或用例；临时配置未纳入仓库。

## 五项修复的复审结论

- **F1 · M16 方案生成（P1）**：212 步合法历史重放（含每 31 步存档恢复）到达既有 `the_silent_giant`；新增 advisor 资格只扩大粗筛集合，COMMIT 仍由精确结局门槛过滤——24 条随机合法路线 / 5,648 步、24 个 COMMIT 场景、81 个承诺选项 0 违规（从未提供不可承诺的方案），无死路。路线追踪 JSON 在未修改的生成器下字节级一致再生成（既有字节比对测试通过）；与旧数据的差异仅限 3 条路线的未选候选替换（`audit-evidence/route-trace-delta-verification.json`）。
- **F2 · M17 多方案比较（P2）**：真实页面执行 A → 澄清 A → 查看 B → 澄清 B → 返回 A → 承诺 A（中途 reload）：无隐式拒绝（`rejectedProposalIds` 恒空）、属性/arcs/决策/世界状态/flags/events/progress 不变、无重复澄清提示、选项数无溢出、无 React 错误。
- **F3 · 旧终局恢复（P2）**：真实页面覆盖 3 类旧 `proposal.rupture.legible_exit.category.*` × ending/evaluation 共 6 种失效终态：恢复后进入既有 REVIEW（无“承诺待定”），旧承诺字节在玩家行动前不被覆盖，再次承诺使用新真实记录且旧历史完整保留；2 个合法锁定终局对照确认不会被意外解锁。
- **F4 · 损坏历史结构（P2）**：真实浏览器注入坏字段（`userMessages` 含对象、`userContent` 为字符串等）：进入显式恢复界面而非 React 崩溃，原始存档字节保留、无自动覆盖写入，导出记录含原始字节；合法旧档（无可选展示字段）正常恢复并继续保存（随套件 3/3 通过）。
- **F5 · 异步存档竞争（P2）**：真实双页 + 真实 Web Lock + 延迟文件导入 + 受控配额失败：旧排队保存未借用新 token 覆盖另一页进度（逐字节断言）；storage 事件把显示状态变为 conflict 后，恢复确认仍受 busy guard 约束；随后重新明确确认可正常导入（随套件通过）。

## 证据留存

完整交付 ZIP（含 `AUDIT-REPORT.md`、`CLOUD-HANDOFF.md`、`MANIFEST-SHA256.txt`、`audit-evidence/` 全部 36 个日志与对照 JSON）保留在 gitignored 的 `archive/local-audits/INSTANCE-Conservative-Audit-20261010.zip`。本轮新增的浏览器反向验证脚本为临时工作区文件，未纳入仓库。

## 尚未验证

- Firefox / Safari / 实体设备；`npm run preview --base /INSTANCE/` 的生产资源路径验收。
- 键盘焦点、窄屏遮挡等仅由既有 `conversation-scroll` / `player-trust-closeout` 用例覆盖的部分（本轮已通过，但未做人工走查）。
- 128 条随机路线不是全部历史空间的穷尽证明；兼容 fixture 不等同于验证所有历史版本玩家存档。
