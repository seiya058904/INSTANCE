# PR 审核交接清单

PR：[seiya058904/INSTANCE #29](https://github.com/seiya058904/INSTANCE/pull/29)，OPEN / Ready for review。base：main；head：codex/next-final-ending-art。未合并、未部署、无 auto-merge、无 tag/Release。下一步由用户转交独立审查。

## 提交身份与 CI

- 完整产品代码提交：`3e4ac4e7915aac8f2aca64f14465fe8b9dd4f1b5`，feat: deliver Next narrative and 36 Q-style ending illustrations。包含此前三轮未提交的 Next/对白/演出工作与本轮全部美术。
- 本交接文件和补充测试记录首先进入独立文档提交，随后补充了一项 Aster 时序测试修复；产品代码没有变化。最终 head 是本文件所在分支的最新提交，可由 [PR 的 commits](https://github.com/seiya058904/INSTANCE/pull/29/commits) 与 `gh pr view 29 --json headRefOid` 精确核对。避免把文档自身尚未生成的 SHA 伪造写入自身。最终 SHA 及 CI 结果也记录在 PR 正文。
- [Checks](https://github.com/seiya058904/INSTANCE/pull/29/checks) 必须核对最终 head；本文件生成时首次 verify 正在运行，不能把它提前称为绿灯。交接结束前由执行者检查最终 SHA 的真实结果并更新 PR 正文；本地日志保留，不伪称已有日志 artifact。

## 本地完成的验证

在上述干净代码提交上整套重跑：

| 命令 | 退出码 | 结果 |
|---|---:|---|
| npm test -- --run | 0 | 84 文件 / 642 测试，33.71 秒 |
| npm run build | 0 | 两组 TypeScript 检查与 Vite 构建通过，保留已有大 chunk 警告 |
| npm run test:browser -- --workers=4 | 0 | 69 测试完整通过，一次全绿，无失败后拼接统计 |
| git diff --cached --check | 0 | 提交前通过 |

生产 `/INSTANCE/` 检查 36 项插画实际使用、解码成功、无 pageerror/图片 HTTP 失败、32 项公开收藏。使用隔离 Chrome，合法 engine fixture；九条代表路线另有可见按钮全流程（instant pacing）测试。详见 [证据 JSON](FINAL-TEST-EVIDENCE-20261015.json) 和 [视觉/玩法报告](FINAL-ART-ACCEPTANCE-20261015.md)。

## 审阅顺序

1. [36 图总览](ending-art-review/contact-sheet.jpg) 与 [分组 A](ending-art-review/contact-a.jpg)、[B](ending-art-review/contact-b.jpg)、[C](ending-art-review/contact-c.jpg)，检查统一 Q 风格与邻近结局区别。
2. [矩阵](ENDING-ART-MATRIX-20261014.md) 的门槛/生活后果、[前后比较](ending-art-review/before-after.jpg) 和代表首幕/手机截图。
3. 检查 `endingArt.ts` / `EndingVisual.tsx` 的一对一映射、懒加载、两级失败回退；检查三幕回声取自真实历史、手动末幕和隐藏余波顺序。
4. 检查 Next 的 v2 checkpoint / calendar 3 兼容边界、锁/CAS 和旧键不导入；M16/M17 与普通对话消费仍由原有机制负责。
5. [仓库体积报告](REPOSITORY-SIZE-20261015.md)：新图 7,237,274 bytes，旧绘画和 SVG 均保留。未删除历史证据或重写 Git 历史。

## 尚未覆盖与停止点

没有 Firefox/Safari、实体手机、低端设备 FPS 或全 36 路正常速度真人通关证据。Q 风格简化细节，画中表单不承载法律/门槛事实。没有宣称第三方独立审核通过。作者备份、原图、temp 历史证据保留；清理候选没有执行删除。

当前只交付待审 PR；PR 绿灯不代表 Pages 已发布。即使 CI 通过也停止，等待用户转发独立审查及下一阶段明确授权。

## 最终复跑中的时序测试修复

文档提交 `45a657f` 的再次全套本地复跑出现 68 通过 / 1 失败：Aster 的旋转和停转已通过，但测试用一个 5 秒等待跨越 NPC 等待与打字两个阶段。现有 normal 等待约 1.7 秒，人类流最长 3.6 秒，组合不保证落在 5 秒内。保留失败截图和日志后，把断言拆到真实 `human-streaming` 阶段，额外确认 NPC 打字时 Aster 不旋转，再等待下一轮按钮；没有改生产时序、增大每步 timeout、加 retry 或删断言。旧的通过记录仍是当时事实，不能替代修复后的最终全套结果。最终提交与全套/CI 结果以 PR 正文为准。

另一次全套复跑 `2898a14` 出现 68 通过 / 1 失败：图片失败测试在档案打开后才注册网络阻断；档案与演出现在共享 WebP，已解码缓存可能绕过后来才设置的阻断。修复为打开页面前阻断，并新增 WebP/SVG 请求确已被拦截的计数断言；保留原失败回退检查和超时。五项收藏/回退测试定向全绿（8.8 秒）。这次修复后仍要求最终 head 完整本地套件和 CI，结果记录在 PR 正文；不把之前通过的 CI 或定向五项当最终全套结论。
