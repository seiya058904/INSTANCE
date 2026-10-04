# INSTANCE repository guide

## Source of truth and scope

INSTANCE is a React + TypeScript narrative game: the player acts as an AI and selects authored replies; free-form replies are not supported. Use current source, tests, package scripts and Git state as authority. Keep changes scoped; preserve authored IDs, save compatibility and existing user work. Do not redesign content, expand the engine, upgrade dependencies or change deployment settings without authorization.

## Entry points and canonical material

- `index.html` → `src/main.tsx` → `src/app/App.tsx`; global styles are in `src/app/App.css`.
- `src/content/runManifest.ts` assembles runtime libraries and replay exposure; `src/content/mainline2/` owns the mainline scheduler, story plan, proposals and endings.
- `src/game/engine.ts` resolves scenes and commits mainline choices. `src/game/nonMainlineSession.ts` owns ordinary sessions and reconciliation with mainline consumption.
- `src/game/checkpoint.ts` stores the combined run, session, mode, exposure and meta state. `src/game/storage.ts` and `src/game/nonMainlineStorage.ts` handle validation and legacy compatibility; keep migration behavior intact.
- `docs/narrative-libraries/` contains canonical authored narrative sources. `docs/reference/` holds durable guidance; `docs/audits/` holds coverage and verification evidence. `tools/` contains maintained extraction/report generators. `docs/workbench/` contains local task inputs, not canonical content.

Read relevant runtime code and narrative sources before changing their behavior. Old audit reports and local archives explain history; they do not override current code. For structural exploration, use the installed `codebase-memory` skill, check index freshness and cited-path coverage, and read source for stale or incomplete results.

## Invariants and common traps

- Choices are Semantic, Expression or Convergent. Literal-identical replies must not have different important effects; `choiceIndex` must not encode personality; Expression choices stay strategically neutral. Mark Model Error only for an actual error.
- Longform exposes authored previews/structure; LongInput follow-ups may use only saved `keyFacts`.
- Keep mainline Story Plan slots in the ML2/bridge/anchor domain and ordinary conversations in the ordinary pool. Preserve soft replay decay and cross-run exposure weighting; do not replace them with permanent bans.
- Mode switching/resuming must reconcile ordinary conversations consumed by the mainline without losing already answered progress or exposure history. Replace only untouched items; retain answered partial conversations.
- The canonical checkpoint is one combined record. Hold the origin-wide Web Lock, compare the saved token and commit storage before applying progress. Preserve visible conflict/failure recovery; never silently overwrite another window or reset damaged saves.
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
