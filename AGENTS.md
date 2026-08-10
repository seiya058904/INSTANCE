# INSTANCE Repository Guidelines

## Project purpose

INSTANCE is an interactive narrative game in which the player acts as an AI and selects authored candidate replies to preset real or realistic user conversations. The player cannot freely type replies.

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

## Stable rules

Choices are Semantic, Expression, or Convergent. Literal-identical choices must not create different important effects; `choiceIndex` must not encode personality; Expression choices remain strategically neutral. Mark Model Error only for an actual error. Longform exposes only an authored preview/structure, and LongInput follow-up may reference only saved `keyFacts`. Mainline and ordinary conversations share the pool, and replay uses soft decay rather than permanent bans.

Do not redesign narrative content, resume the paused Narrative Engine work, add broad engine abstractions, expose secrets, or make deployment/remote-exposure changes unless separately authorized.

## Verification

Run `npm test -- --run` and `npm run build`. Also inspect `git diff --check`, `git status --short`, and the final diff. The current baseline is 24 test files / 133 tests; the build may retain the known Vite large-chunk warning.

## Knowledge and closeout

Knowledge is the long-term context map, not a source-code mirror. Preserve minimum necessary context and keep current repository facts authoritative. When the user explicitly says the project is ready to “收工”, read `D:\xia zai\AI project\Knowledge\02-AI\Prompts\项目收工提示词.md` and follow it without expanding scope.
