# INSTANCE Editorial Review Bundle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:verification-before-completion before claiming completion.

**Goal:** Build a complete, lineage-deduplicated editorial review bundle from the current INSTANCE Markdown libraries and runtime definitions without changing runtime content.

**Architecture:** A local generator will parse every authored Markdown asset into one canonical asset record, attach documented runtime/disposition metadata from the current source files and reports, and append executable source excerpts for code-only/legacy definitions and Mainline Anchors. The generated index will contain totals, coverage distributions, similarity groups, and an inventory check; the main bundle will contain full source blocks and review metadata.

**Tech Stack:** Node.js ESM generator, Markdown, existing Vitest/TypeScript project.

## Global Constraints

- Read + audit + package only; do not create conversations, edit conversation/candidate text, or modify Arc, Scheduler, Ending, Replay, or Content systems.
- Count source assets by lineage: selected, Runtime, and Longform TypeScript copies never add a new authored asset.
- Preserve the current census targets unless the current disk proves a change: 176 authored, 12 code-only/legacy, 188 inventory units, 98 ordinary Runtime definitions, 105 formal source coverage.
- Every authored source asset must appear exactly once in the Bundle; Merge sources remain separate records with explicit lineage and merged destination.
- The final response must contain no content recommendations.

---

### Task 1: Inspect and define the inventory model

**Files:**
- Read: all nine Markdown source libraries, `src/content/{runManifest,activeRun,longformOutput01,selectedExpansion01,runtimeRealityPass}.ts`, census and integration audit reports.
- Create: `docs/editorial-review-2026-08-10/generate-bundle.mjs`

- [ ] Define canonical asset records with stable `REV-###`, source ID, title, source library, current status, lineage, and raw full-content block.
- [ ] Define separate records for code-only/legacy and Mainline entries without inventing Markdown lineage.
- [ ] Parse Markdown headings/blocks and assert expected source counts before writing output.

### Task 2: Generate the main Bundle and Index

**Files:**
- Create: `docs/editorial-review-2026-08-10/INSTANCE_asset_editorial_review_bundle.md`
- Create: `docs/editorial-review-2026-08-10/INSTANCE_asset_editorial_index.md`
- Create: `docs/editorial-review-2026-08-10/generate-bundle.mjs`

- [ ] Emit complete Markdown source blocks for all authored assets, with metadata and documented/undocumented rationale labels.
- [ ] Emit code-only/legacy executable source excerpts and all five Mainline Anchor source definitions.
- [ ] Emit Longform metadata, formal/non-formal distributions, similarity/competition groups, and review flags without content verdicts.
- [ ] Emit a machine-readable inventory table in the Index proving each source ID is unique and lifecycle copies are not counted again.

### Task 3: Add inventory verification

**Files:**
- Create: `src/content/editorialReviewBundle.test.ts`

- [ ] Verify the generated Bundle contains 176 unique authored source IDs exactly once.
- [ ] Verify 12 code-only/legacy entries, 5 Mainline Anchors, 98 ordinary Runtime definitions, and 105 formal source coverage markers.
- [ ] Verify selected and Longform lifecycle copies do not inflate authored counts and Merge sources retain explicit destinations.

### Task 4: Run final checks

- [ ] Run `node docs/editorial-review-2026-08-10/generate-bundle.mjs`.
- [ ] Run `npm test -- --run src/content/editorialReviewBundle.test.ts src/content/assetCensus.test.ts`.
- [ ] Run `npm run build` and `git diff --check` only if Git metadata is available; otherwise record Git as N/A.
- [ ] Inspect output counts, generated file sizes, and status; report skipped checks explicitly.
