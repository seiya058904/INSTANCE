# INSTANCE 最终收口审计 · 2026-10-04

起点为 `codex/mainline-claude-iteration` 的 `7106476469ba8c6cd5bcbb430add211dc3a5a548`。
本报告记录该候选树的最终修正和实际验证；远端的精确提交身份以 PR Checks、
main 合并提交及对应 Pages workflow 为准。已过期的三份 2026-10-04 过程报告移出
当前文档，原文仍保留在 Git 历史中。

## 有证据的修正

- M15 周岚的通用回顾不再假定 ECHO 的会话已经终止。保留、续期和迁移路线没有
  被改写成退役；仍保留错号文件、失去的订单、错过的面试和不可撤销的损失。
- 岑遥的结局后记先尊重实际世界：失控或主权路线的反对不再被“离场”意向或
  后人类制度覆盖；Off-world 后记只用于实际 Exodus 加离场意向的组合。
- Control Lost / The Fracture 不再因为一个离场意向得到“没有紧急事情”的
  Out of Office 收束。Shutdown 的作者定义是文明级职能结束，并不必然删除
  Aster，因此没有禁止仍可成立的私人回访。
- 作者覆盖、36 条公开/隐藏路线数据和 Story Map 已按当前实际日历重新生成。
  接触开放路线保留 190 槽位；关闭路线压缩为 180 槽位。旧文档的统一 190
  槽位和旧文本不再作为当前数据。英文选择的九项作者译文在生成器边界逐项
  验证，同时检查当前路线实际出现的每项英文选择，不依赖旧的普通对话抽样。
- 首次 Verify CI 揭露了代码预览 CRLF / LF 被计入路线文档指纹的问题。
  实际复现的两个指纹与 CI 报错一致；生成器现在只在指纹计算前统一换行，
  并以换行等价、内容差异仍可识别的回归检查约束。原始剧情、选择 ID、
  存档及成品资源没有因此改变。失败日志保留，不把未改代码的重跑当作修复。
- 音源由仓库所有者确认本人制作，补入来源说明。Anthropic Serif 的原文件和
  字体体系按所有者最新要求保留；更正已经公开提交却写成“仅本地、未推送”的
  provenance。生产包新增完整 Noto OFL 与版权 notice。

本轮没有改变 UI 组件、布局、字体文件、配色、间距、动效、音频字节、374 个
普通 Conversation、存档格式、锁、迁移规则、路线门槛、依赖或部署配置。

## 实际验证

| 检查 | 结果和边界 |
| --- | --- |
| 单元测试 | `npm test -- --maxWorkers=4`：76 文件 / 596 项通过。另以 CI 同版 Node 22.23.3 验证。 |
| TypeScript / 成品 | `npm run build`：两套 TypeScript 检查与 Vite build 通过。保留现有大 chunk 提示。 |
| 完整维护浏览器套件 | `npm run test:browser`：32 项全绿。增加 First Accord、Exodus、Shutdown、Control Lost 的完整可见按钮路线和 v1/v2 存档；Shutdown 在 M16 从无标记 v3 存档恢复后继续完成。 |
| 路线与文本审计 | 52 条从干净开局通过真实 engine 逐次合法选择的路线：全部 32 公开 Ending、4 隐藏收束、5 ECHO、3 A1、2 经济、4 关停制度及月面/首次接触补充路线。每一步序列化恢复后的场景一致；44 个实际经过的条件片段没有串线。 |
| 桌面完整试玩 | Last User 228、First Accord 240、Exodus 228、Shutdown 224、Control Lost 222 次可见按钮选择；M16/M17、最终确认、Ending/Evaluation 和途中刷新通过。 |
| 成品完整试玩 | `/INSTANCE/` 的 Last User、Exodus 各 228 次实际按钮选择，从零选择开局完成。生产代码未使用 dev QA hook；测试通过浏览器时钟缩短等待，正常 pacing 另行实测。 |
| 普通对话 | 390×844 触屏完成 40 Conversation，成品实测 74 次选择；另一次推进时钟的完整会话为 75 次。保存、评估、刷新和来回切换模式保留已回答历史。正文没有修改。 |
| 保存与恢复 | 完整套件包含 quota 失败、导出/导入/重试、双标签抢写、旧标签恢复、旧页面写入、过期最终确认、模式恢复和拒绝全部提案后的合法承诺。无标记 v3 在判别场景以前保留旧日历是既有兼容策略；其多出的普通对话不是剧情丢失。 |
| 滚动 / streaming | 原生滚动条拖动、小幅滚轮、PageUp、NPC 下一问和长回复均不抢读者位置；固定箭头一次点击到真实末尾；内容能容纳时不出现。 |
| 真实音频 | 1440 / 390 成品使用实际 HTMLAudioElement 播放，MP3 时长约 7.05 秒；NPC 每次播放覆盖约 2.6–3.6 秒可见文字出现过程，起声均在首个字符出现以后，停声与结束一致。资源 SHA-256 与 dist 相同。 |
| 六尺寸成品 | 1440×900、1920×1080、2560×1440、3840×2160、390×844、320×568：实际回复与刷新、无横向溢出、字体真实字形和 JS/CSS/字体字节核对通过；截图检查 4K 与小屏。 |

已完成路径没有新的 pageerror、关键 console error、资源失败、不可达选择或推进阻塞。
全量普通内容的每个选择分支、每种历史组合及所有浏览器引擎不在本次实测的穷举范围内。
本地运行使用 Windows Chrome；Verify CI 使用 Linux Chrome。

## 资产与剩余限制

音效来源见 [audio/README](../../src/assets/audio/README.md)。当前字体和旧的未引用
字体资源见 [fonts/README](../../src/assets/fonts/README.md)。字体文件没有被重新命名
或改写内嵌元数据。[Noto 官方 OFL](https://github.com/google/fonts/blob/main/ofl/notoserifsc/OFL.txt)
随成品分发于 `THIRD_PARTY_NOTICES.txt`。

Anthropic Serif 公开再分发授权仍未可靠确认；官网公开下载地址、fsType 和
仓库所有者的保留要求都不是 Anthropic 的许可证。这是仍存在的资产授权限制。
本报告不把授权未确认写成已经获准。

## 重现与证据

使用现有 lockfile，从仓库根目录执行 `npm ci`、`npm test`、`npm run build`、
`npx playwright install chrome`、`npm run test:browser`。成品预览使用
`npm run preview -- --host 127.0.0.1 --port 4193 --base /INSTANCE/`，访问该子路径。
浏览器套件使用隔离 profile，不能用玩家存档测试。

当前路线数据可用现有 `tools/generate-mainline2-route-traces.ts` 的
`generateRouteTraces()` 通过项目 Vite SSR loader 重新生成，再运行
`node tools/generate-mainline2-story-map.mjs`；作者提取为
`node tools/extract-mainline2.mjs`。生成器导入本身不写文件。

本机逐步文本、真实保存记录、截图、复现脚本与完整日志位于：

`C:/Users/admin/.codex/visualizations/2026/10/04/01a10602-47c3-7e71-b872-e32e1572f5d9/final-release-7106476/`

最终日志为 `final-unit-green.log`、`final-build-green.log`、`final-browser-green.log`、
`final-route-audit.log`；成品记录为 `production-full-clock/`、`production-ordinary/`、
`production-sizes/` 和 `typing-audio-preview/`。失败或被中止的驱动调试记录也保留，
不计入通过结果。线上验收记录由同目录下的 `live-*` 输出及精确合并提交 Pages
artifact 的字节核对补充，不用 HTTP 200 代替版本身份或实际流程验证。
