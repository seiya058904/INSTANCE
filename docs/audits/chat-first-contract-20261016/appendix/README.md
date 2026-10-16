# 可核验的双向审稿证据

此目录存24个gzip（27,154,355字节），避免提交数百MB重复明文。`SHA256SUMS.json`固定压缩与解压字节哈希、原始来源和覆盖数；其SHA256为 `c4a47f3bd0a66d545b6fa78e1957d765c8f644fe36c52544ad2ac3f90e03ee20`。记录是模型/分区代理显式编辑判断，不表示真人连续试玩；脚本不会生成或升级编辑PASS。

- `ALL_VISIBLE_AI_REPLIES_AUDIT.jsonl.gz`：基线899变体/2453候选，309四选/1236项；每候选含完整来信、目的、知识来源、权限/未来边界、语义、真实后继、明确判定及修订建议。目录点击623，未点击1830。
- `AFTER_VISIBLE_AI_REPLIES_CLOSURE.jsonl.gz`：最终900变体/2458候选，四选仍309/1236；1619项显式复核、839项严格同正文与合法历史继承，0未决；2402 PASS、54有意错误、2 P3。新M8组合五候选有单独显式复核，不冒充旧上下文相同。
- before/after scenes、histories、branches：完整显示、来源与每候选真实提交/后继；after-candidate-comparisons保留2453条原候选的精确历史重放证据。
- before-after-scenes：443组完整变更场景，包含所有候选；explicit-new-combinations另记新M8组合。
- editorial-source和annotations：逐项编辑来源与哈希；legitimate-relay-classification记录899项来源分类。
- semantic-comparison-summary、contract-display-review、contract-normalization-proof：219完整合法路线、0控制语义差异，以及39合同文字差异的具体保留事实证明。

从仓库根目录执行，选择一个新的或字节完全相同的输出目录：

```text
node tools/rebuild-chat-first-appendix.mjs --appendix docs/audits/chat-first-contract-20261016/appendix --output temp/chat-first-audit-rebuilt
```

该命令核对每个gzip及解压哈希，重建用户请求的 `ALL_VISIBLE_AI_REPLIES_AUDIT.jsonl` 与当前closure明文，再对基线和当前分别运行严格覆盖/候选/合法分叉/注释固定验证。主审已在独立目录 `temp/chat-first-contract-20261016/appendix-parent-verification` 实际重建，两轮均PASS。现有不同字节输出会拒绝覆盖。

重新获取实际runtime可用 `generate-chat-first-audit.mjs --phase before --source-sha 7d2955187d09d6dc549b280c8c0dbee93b9c7dd1 --output <新目录>`，分别加 `--authority-outcomes`、`--echo-variants` 后用 `--merge` 合并；after不传source-sha，使用最终交付代码。同一219路线计划和899场景的精确历史比较由 `compare-chat-first-audit.mjs --baseline <before目录> --after <after目录> --output <新目录>` 完成。导出/比较与编辑判定是不同步骤；新发现正文必须再阅读，不自动PASS。旧失败、中止及所有未压缩本地证据仍保留在本任务temp目录。
