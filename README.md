# INSTANCE

A narrative game where the player takes the role of an AI and can only respond through authored candidate replies.

## Project

The player faces authored real or realistic user conversations and chooses among candidate replies. Ordinary conversations, mainline anchors, semantic arcs, replay variation, and endings form the game; free-form player input is not part of the current design.

The current runtime includes a narrative library, scheduler/manifest, Longform and LongInput previews, conversation-local state, multimodal abstractions, true DOM streaming, and localStorage persistence.

## Stack

React, TypeScript, and Vite. The project is local-first and has no backend runtime dependency.

## Local development

```bash
npm install
npm run dev
npm test -- --run
npm run build
```

The build currently emits a Vite large-chunk warning; this does not block the verified build.

## Content navigation

- `src/content/runManifest.ts` — runtime pool, scheduler, replay exposure, and mainline anchors
- `src/content/runtimeRealityPass.ts` — runtime reality pass
- `src/content/semanticArcs.ts` — semantic arc behavior
- `src/content/longformOutput01.ts` — Longform content
- `src/content/realUsagePatch01.ts` — Real Usage Patch 01
- `src/game/engine.ts`, `storage.ts`, and `types.ts` — runtime state and game contracts
- `docs/` and root audit files — asset census and integration evidence

Detailed AI navigation lives in the project's Knowledge Vault entry and `AGENTS.md`.
