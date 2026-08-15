# Repository Guidelines

## Project purpose

INSTANCE is an interactive narrative game in which the player acts as an AI and selects authored candidate replies to preset real or realistic user conversations. The player cannot freely type replies.

## Stack and entry points

- React 19, TypeScript, Vite, and Vitest; the package manager is npm.
- `src/main.tsx` mounts `src/app/App.tsx`; global UI styling starts in `src/app/App.css`.
- `vite.config.ts` serves locally from `/` and builds GitHub Pages assets under `/INSTANCE/`.
- `.github/workflows/deploy-pages.yml` builds and deploys `main` to GitHub Pages. Do not modify deployment configuration or publish without separate authorization.

## Start here

Read `D:\xia zai\AI project\Knowledge\AGENTS.md`, then route through `Knowledge\01-Projects\Repository-Index.md` → `INSTANCE.md` → `INSTANCE\AI-HANDOFF.md`. Read `CONTEXT-HISTORY.md` only when historical decisions or rejected directions matter. The current repository files and Git state override Knowledge when they conflict.

## Important files

- `src/content/runManifest.ts` — runtime library assembly, scheduler, replay exposure, and five mainline anchors
- `src/content/runtimeRealityPass.ts` — reality-pass transformations
- `src/content/semanticArcs.ts` — semantic arc effects
- `src/content/longformOutput01.ts`, `src/content/realUsagePatch01.ts` — Longform and Real Usage Patch 01
- `src/game/engine.ts`, `src/game/storage.ts`, `src/game/types.ts` — state, persistence, and contracts
- `docs/narrative-libraries/` — authored narrative source libraries
- `docs/audits/` — asset census and integration evidence

## Documentation routing

- `docs/narrative-libraries/` — canonical authored narrative sources.
- `docs/reference/` — durable reference material that agents should consult when relevant.
- `docs/audits/` — audits, coverage reports, and verification evidence.
- `docs/workbench/` — local temporary task inputs; never treat as canonical or commit unless explicitly promoted.

## Stable rules

Choices are Semantic, Expression, or Convergent. Literal-identical choices must not create different important effects; `choiceIndex` must not encode personality; Expression choices remain strategically neutral. Mark Model Error only for an actual error. Longform exposes only an authored preview/structure, and LongInput follow-up may reference only saved `keyFacts`. Mainline and ordinary conversations are strictly separated domains: the 145 mainline Story Plan slots resolve only from the ML2/bridge/anchor domain, and the 212-content ordinary pool is the only Non-Mainline source; replay uses soft decay rather than permanent bans, with cross-run exposure downweighting recently played ordinary content.

Do not redesign narrative content, resume the paused Narrative Engine work, add broad engine abstractions, expose secrets, or make deployment/remote-exposure changes unless separately authorized.

## Verification

Run `npm test -- --run` and `npm run build`. Also inspect `git diff --check`, `git status --short`, and the final diff. The verified baseline is 59 test files / 408 tests; the build may retain the known Vite large-chunk warning. GitHub Pages deployment runs the same test suite before building.

## Changes, commits, and configuration

- Keep edits narrowly scoped and preserve existing user changes. Use UTF-8 when reading or editing text.
- Do not add dependencies, secrets, `.env` files, generated build output, or browser artifacts. `.gitignore` already excludes these local files.
- Before a commit, run the relevant checks above and inspect the staged diff. Use focused conventional-style commit subjects such as `fix:` or `docs:`.
- Keep pull requests single-purpose; describe player-visible behavior and verification. Do not merge, push, publish, or alter Pages settings without explicit authorization, except where a separately authorized project-closeout procedure permits it.

## Knowledge and closeout

Knowledge is the long-term context map, not a source-code mirror. Preserve minimum necessary context and keep current repository facts authoritative. When the user explicitly says the project is ready to “收工”, read `D:\xia zai\AI project\Knowledge\02-AI\Prompts\项目收工提示词.md` and follow it without expanding scope.
