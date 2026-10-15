# 仓库体积与清理候选报告

统计时间：2026-10-14T16:22:00.845Z。Git 文件字节使用 `git ls-tree -r -l` 的规范化 blob 大小，不把 Windows 换行差异或 ignored 缓存算成仓库内容。快照基线 `40b370beb71a0827e8a335cb7a3be411a3c175a0`；交付主体暂存树 `3f529c15078ac8a61d0d2b492b18596e79026a38`（本体积报告、后续交接文档与 CI 链接尚未加入）。最终 HEAD 总量另列于 PR。

## Git 追踪文件

| 范围 | 文件数 | 字节 |
|---|---:|---:|
| origin/main 基线 | 330 | 32909306 |
| 交付主体暂存树 | 466 | 35681986 |
| 净变化 | 136 | 2772680 |

新 36 张 WebP：7,237,274 bytes（6.902 MiB）；全部 39 张 WebP（含历史三图）：7,670,816 bytes。新增审阅 JPG 合计 4159508 bytes。未删除任何插画或历史 SVG。Next 重建已缩短生成的 route-traces/story-map，因此其文本减少不能宣传为本轮垃圾清理收益。旧测试 snapshot 的删除是前轮已完成的迁移，完整内容在 `src/game/fixtures/pre-next-proposal-exhaustion.snap.txt`；没有本轮额外删除。

最大的交付文件：

| 文件 | bytes | 属性 |
|---|---:|---|
| docs/audits/mainline2-route-traces.json | 10181770 | 作者内容或路线审计，保留 |
| docs/assets/INSTANCE_concept_reference.png | 1707206 | 作者内容或路线审计，保留 |
| src/content/mainline2/authoredLibrary.generated.ts | 1479722 | 作者内容或路线审计，保留 |
| docs/audits/ending-art-review/contact-sheet.jpg | 1194706 | 最终图片或审阅证据，保留 |
| docs/audits/ordinary-content-review.json | 978433 | 作者内容或路线审计，保留 |
| docs/editorial-review-2026-08-10/INSTANCE_asset_editorial_review_bundle.md | 848460 | 作者内容或路线审计，保留 |
| src/assets/fonts/noto-serif-sc-prose.woff2 | 689640 | 作者内容或路线审计，保留 |
| docs/audits/mainline2-asset-classification.json | 436142 | 作者内容或路线审计，保留 |
| src/content/mainline2/editorialClassification.registry.json | 427093 | 作者内容或路线审计，保留 |
| docs/audits/mainline2-authored-coverage.json | 423619 | 作者内容或路线审计，保留 |

## 本地 ignored / 临时目录

这些路径没有加入提交。统计跳过符号链接，避免跨目录重复计量；此表反映统计时大小，运行日志和对象库之后可能增长。

| 路径 | 文件数 | bytes | 处置与原因 |
|---|---:|---:|---|
| node_modules | 1545 | 100118804 | 依赖可由 npm ci 重建；仍用于验收，不清理 |
| dist | 90 | 11805550 | 可构建，但仍用于生产预览，不清理 |
| temp | 653 | 426204816 | 缓存或证据，可能含唯一日志/截图，保留 |
| archive/local-audits | 2 | 14508593 | 历史/作者备份，来源价值不能假定，保留 |
| .workbody | 572 | 74747630 | 历史/作者备份，来源价值不能假定，保留 |
| .workbuddy | 6 | 43604 | 历史/作者备份，来源价值不能假定，保留 |
| .claude | 1 | 104 | 缓存或证据，可能含唯一日志/截图，保留 |
| .codebase-memory | 3 | 4135874 | 缓存或证据，可能含唯一日志/截图，保留 |
| .playwright-cli | 4 | 344384 | 缓存或证据，可能含唯一日志/截图，保留 |
| test-results | 1 | 45 | 缓存或证据，可能含唯一日志/截图，保留 |
| .git | 394 | 35691348 | 对象和引用；不重写历史 |

本轮没有删除以上目录。临时测试截图留在 temp/，只提交代表 JPG 和总览。没有数 GB 级目录需要为本轮强行处置；如将来清理，应先明确具体文件、证据保留位置和进程占用，不能直接整目录删除。原始 AI PNG 在仓库外的 generated_images 会话目录，也全部保留。

## Git 对象库

提交前 `git count-objects -vH`：

```text
count: 347
size: 18.91 MiB
in-pack: 1979
packs: 2
size-pack: 15.00 MiB
prune-packable: 0
garbage: 0
size-garbage: 0 bytes
```

这是对象压缩存储统计，与当前树文件字节不同；此次 staging 会产生新 blob，后续 commit/pack 还可能变化。未执行 gc、filter-repo、BFG、强推或历史重写。

## 原始工作保护

修改前保存 `temp/final-art-20261014/baseline.patch`、`baseline-status.txt`、`baseline-files.json` 及所有原未追踪文件的小范围副本。未复制 node_modules。对原始文件 SHA-256 复核，以下文件在本轮发生预期变动：

- DESIGN.md
- e2e/ending-cinema.spec.ts
- public/ending-art/PROVENANCE.md
- src/app/endingCinema.css
- src/components/EndingVisual.tsx
- src/game/endingPresentation.test.tsx

原始清单中现在缺失的文件：无。前三轮工作没有被 reset、stash 或覆盖远端旧版本。
