# INSTANCE repository guide

## Source of truth and scope

INSTANCE is a React + TypeScript narrative game: the player acts as an AI and selects authored replies; free-form replies are not supported. Use current source, tests, package scripts and Git state as authority. Keep changes scoped; preserve authored IDs, current-edition save compatibility and existing user work. Do not redesign content, expand the engine, upgrade dependencies or change deployment settings without authorization.

## Entry points and canonical material

- `index.html` → `src/main.tsx` → `src/app/App.tsx`; global styles are in `src/app/App.css`.
- `src/content/runManifest.ts` assembles runtime libraries and replay exposure; `src/content/mainline2/` owns the mainline scheduler, story plan, proposals and endings.
- `src/game/engine.ts` resolves scenes and commits mainline choices. `src/game/nonMainlineSession.ts` owns ordinary sessions and reconciliation with mainline consumption.
- `src/game/checkpoint.ts` stores the combined run, session, mode, exposure and meta state. New games use calendar edition 4 with causality version 1; edition 3 and interim edition-4 records remain readable with their original interpretation. The key remains `instance:checkpoint:v2`; preserve validation and lock/CAS behavior. Never infer completed trials while loading old records.
- `src/content/mainline2/nextNarrative.ts` is the Next edition's Chinese scene/feedback authority, applied after historical localization; `endingCinema.ts` owns its ending storyboard. `docs/narrative-libraries/` retains the underlying authored sources. See `docs/reference/MAINLINE-NEXT.md` for editing boundaries. `docs/audits/` holds verification evidence; `tools/` holds maintained generators; `docs/workbench/` contains local task inputs.

Read relevant runtime code and narrative sources before changing their behavior. Old audit reports and local archives explain history; they do not override current code. For structural exploration, use the installed `codebase-memory` skill, check index freshness and cited-path coverage, and read source for stale or incomplete results.

## Invariants and common traps

- Choices are Semantic, Expression or Convergent. Literal-identical replies must not have different important effects; `choiceIndex` must not encode personality; Expression choices stay strategically neutral. Mark Model Error only for an actual error.
- Longform exposes authored previews/structure; LongInput follow-ups may use only saved `keyFacts`.
- Key-history text must describe the displayed saved choice. Public-execution and shutdown explanations resolve that entry's conversation/node/choice `decisionBinding`; a later authority decision may legitimately oppose it.
- Keep mainline Story Plan slots in the ML2/bridge/anchor domain and ordinary conversations in the ordinary pool. Preserve soft replay decay and cross-run exposure weighting; do not replace them with permanent bans.
- Mode switching/resuming must reconcile ordinary conversations consumed by the mainline without losing already answered progress or exposure history. Replace only untouched items; retain answered partial conversations.
- The canonical checkpoint is one combined record. Hold the origin-wide Web Lock, compare the saved token, resolve the next playing scene before writing, and commit storage before applying progress. Error-boundary restart uses the same lock/CAS to replace the run/session while preserving meta, endings and exposure; do not merely delete legacy keys. Preserve visible conflict/failure recovery; never silently overwrite another window or reset damaged saves.
- Use an isolated browser profile/origin for acceptance tests. Do not overwrite a player's real save to seed tests.

## Commands and verification

Run commands from the repository root with the existing npm lockfile:

```text
npm ci
npm run dev -- --host 127.0.0.1 --port 4180
npm test -- --run
npm run build
npm run test:browser
npm run preview -- --host 127.0.0.1 --port 4193 --base /INSTANCE/
```

`build` checks both TypeScript configurations and builds `dist/`. The local dev server uses `/`; production assets use `/INSTANCE/`. Pass `--base /INSTANCE/` to preview and open that subpath: the configuration sets the production base only for builds. Browser tests start their own dev server on port 4180 and use Chrome; preserve the existing test harness.

For substantive changes, run unit tests and build, then `git diff --check` and inspect the final diff/status. UI, persistence and mode-switch changes also need the relevant browser tests; content changes need the relevant authored-content and story-plan checks. Documentation-only changes need path/script/config checks. Report actual results and limitations; do not hard-code a past test count as the expected baseline. The existing large-chunk warning is not a reason to refactor during unrelated work.

## Generated files, archives and delivery

`node_modules/`, `dist/`, `.vite/`, coverage, browser/test output, screenshots and `temp/` are local generated paths. Ignore them; delete only identified disposable outputs. `archive/local-audits/` holds ignored lossless ZIPs of historical local QA scripts, checkpoints, logs and screenshots, with original paths and hash manifests. Retain historical evidence and authoring/save backups, including `.workbody/`, when their value or provenance is uncertain. Do not treat every ignored directory as garbage or delete maintained `tools/` generators because they are absent from npm scripts.

`deploy-pages.yml` tests, builds and uploads `dist/` on `main`; `verify-pr.yml` also runs browser tests. Keep these workflow inputs and the `/INSTANCE/` asset base consistent. Do not push, merge, publish, alter Pages/remote settings, tags or Releases without explicit authorization. Stage only task-owned files, inspect the staged diff, and verify exact-SHA CI/Pages results after an authorized push.

## 浏览器测试依赖（固定版本）

- Playwright 固定 1.64.1：@playwright/test 已在 package.json 里精确锁定（不要写 ^、~ 或 latest），配套 chromium build 1248 位于 %LOCALAPPDATA%\ms-playwright。
- 不要升级、降级或另装第二个 Playwright 版本，也不要把浏览器下载到别的目录或自行构建 Chromium。
- 确需换版本时，先与其他使用 Playwright 的仓库统一到同一版本，再改本仓库并跑一次浏览器测试。

## CI policy (minimal-test principle)

The owner decided on 2026-10-27 that CI should run the smallest set of checks relevant to a change and keep heavy suites for schedules and manual runs. Do not undo this by running every closeout playthrough on each pull request.

- Pull requests run the unit tests, the build, 149 browser tests in three shards, and four representative `edition4 full causal closeout` playthroughs (one per viewport width).
- The complete set of 21 closeout playthroughs, split by viewport width, runs weekly and on manual dispatch.
- The `verify` job is the single gate. README, AGENTS and CLAUDE changes do not start the workflow.
