# Non-Mainline Content Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a source-backed, standalone Chinese review page containing only content classified as `NON_MAINLINE`, with persistent human ratings and import/export support.

**Architecture:** A Node generator collects the repository's authored/runtime content into a normalized audit catalog, applies conservative explicit classification rules, and writes classification/report/review JSON artifacts. A standalone HTML document fetches the review JSON and owns all review state in localStorage; it is not imported by React, Vite runtime code, or the game router.

**Tech Stack:** Node.js ESM, repository source Markdown/TypeScript/JSON, standalone HTML/CSS/vanilla JavaScript, Vitest for pure generator/data tests, Playwright CLI for browser verification.

## Global Constraints

- The first-level audit states are exactly `MAINLINE`, `NON_MAINLINE`, and `UNCERTAIN`.
- `MAINLINE` includes core, conditional, consequence, world echo, character, social reaction, optional, unused, and cut-candidate material.
- `NON_MAINLINE` requires all A/B/C tests to be true and must be unrelated to INSTANCE events, people, abilities, institutions, world changes, or endings.
- `UNCERTAIN` never enters `ordinary-content-review.json`.
- Do not modify Story Plan, Scheduler, Ending, Proposal, canonical narrative copy, or assets.
- Do not deploy, merge, or push.
- HTML renders generated JSON; content is not hand-copied into the page.
- Stable rating keys use `assetId`, `nodeId`, and `choiceId`, never choice text.

---

### Task 1: Establish normalized audit data and conservative classification

**Files:**
- Create: `tools/generate-ordinary-content-review.mjs`
- Create: `src/content/ordinaryContentAudit.ts`
- Create: `src/content/ordinaryContentAudit.test.ts`
- Create: `docs/audits/ordinary-content-classification.json`

**Interfaces:**
- `ordinaryContentAudit.ts` exports `AuditClassification`, `AuditAsset`, `classifyAuditAsset`, and `isReviewableNonMainline`.
- The generator writes normalized assets with complete nodes and choices and emits only `NON_MAINLINE` assets into the review dataset.

- [ ] Write failing tests proving world echoes and named INSTANCE concepts are never `NON_MAINLINE`, while a generic React debugging conversation is `NON_MAINLINE`.
- [ ] Run `npx vitest run src/content/ordinaryContentAudit.test.ts` and confirm the missing module/test behavior fails for the intended reason.
- [ ] Implement explicit source/relationship classification with `UNCERTAIN` as the conservative fallback; do not use “not in Story Plan” as evidence for `NON_MAINLINE`.
- [ ] Run the focused test and confirm it passes.
- [ ] Generate the classification JSON from all relevant authored/runtime/legacy/humor/mainline sources.

### Task 2: Generate the classification report and review dataset

**Files:**
- Modify: `tools/generate-ordinary-content-review.mjs`
- Create: `docs/audits/ordinary-vs-mainline-classification.md`
- Create: `docs/audits/ordinary-content-review.json`
- Modify: `src/content/ordinaryContentAudit.test.ts`

**Interfaces:**
- Report counts include total, `MAINLINE`, `NON_MAINLINE`, `MAINLINE / UNUSED`, and `UNCERTAIN`.
- Review JSON contains only `NON_MAINLINE` assets and complete ordered conversation/node/choice content.

- [ ] Add failing shape/count tests for complete user messages, all choices, stable IDs, and exclusion of `MAINLINE`/`UNCERTAIN`.
- [ ] Run the focused test and confirm the new assertions fail before implementation.
- [ ] Implement report and review serialization plus category/source/reason fields.
- [ ] Run focused tests and regenerate all artifacts.
- [ ] Manually inspect every generated `NON_MAINLINE` record; if any world, person, ability, institution, event, consequence, or ending relation appears, reclassify it to `MAINLINE` or `UNCERTAIN`.

### Task 3: Build the standalone review page

**Files:**
- Create: `docs/audits/ordinary-content-review.html`

**Interfaces:**
- The page fetches `ordinary-content-review.json` relative to itself.
- State is stored under a versioned localStorage key and uses `assetId`, `nodeId`, and `choiceId`.

- [ ] Implement Chinese reading-first layout with collapsed Asset cards, visible first user message/classification/rating/tags, and full ordered nodes/choices on expansion.
- [ ] Implement 1–5 star controls, optional choice ratings, notes, tags, search, star/type/tag filters, sorting, expand/collapse, next-unrated, and progress/tag statistics.
- [ ] Implement JSON export, JSON import, new-asset preservation, orphan-rating reporting, and last-viewed-asset restoration.
- [ ] Add responsive desktop/mobile CSS without importing app CSS or runtime code.

### Task 4: Verify source, artifacts, and browser behavior

**Files:**
- Modify only if verification exposes a directly related defect: `tools/generate-ordinary-content-review.mjs`, `src/content/ordinaryContentAudit.ts`, `src/content/ordinaryContentAudit.test.ts`, `docs/audits/ordinary-content-review.html`

- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build` and record the known Vite large-chunk warning if present.
- [ ] Run `git diff --check` and inspect `git diff`/`git status --short`.
- [ ] Serve `docs/audits` over HTTP and verify the page in a desktop browser.
- [ ] Verify at approximately 390×844: rating clicks, choice rating, refresh persistence, notes, tags, search/filter/sort, next-unrated, expand/collapse, export/import, orphan reporting, and zero application Console errors.
- [ ] Re-read generated counts and confirm review JSON contains only `NON_MAINLINE` records.
