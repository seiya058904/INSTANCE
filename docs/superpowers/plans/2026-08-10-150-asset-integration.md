# INSTANCE 150 Asset Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with review checkpoints.

**Goal:** Implement the approved Editorial Review without creating new source Conversations, ending at 150 Formal / 19 Reserve / 7 Reject across 176 authored source assets, while making Long Input references real and restorable.

**Architecture:** Keep Markdown libraries as the authoring source and make `runManifest.ts` the formal-runtime selection boundary. Add `LongInputPreview` as optional node/history metadata parallel to `LongformPreview`; clone and persist it through the existing stable run path, and render it with a collapsed player card that never exposes `keyFacts`. Preserve the five mainline anchors and the two merge-only source refs.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, existing Markdown `?raw` parsers, localStorage persistence.

## Global Constraints

- Do not create new Conversation source assets or count code-only/legacy definitions in 150 or 176.
- Final source census must be 176 authored, 150 Formal, 19 Reserve, 7 Reject; `150 + 19 + 7 = 176`.
- Preserve the five Mainline Anchors, their order, `#0000` responsibility, 岑遥 core plot, and ending routes.
- Preserve FI06/FI13 as merge-only and do not convert them into independent Runtime IDs.
- Long input details may only appear when represented in `LongInputPreview` metadata; `keyFacts` are continuity-only and must not render.
- Do not add dependencies, initialize Git, or delete source Markdown files.

---

### Task 1: Lock the approved source-status census

**Files:**
- Modify: `src/content/runManifest.ts`
- Modify: `src/content/selectedExpansion01.ts`
- Modify: `src/content/longformOutput01.ts`
- Modify: `src/content/assetCensus.test.ts`
- Modify: `src/content/editorialReviewBundle.test.ts` only where current expected status/count assertions need to move from the pre-integration baseline.

**Interfaces:**
- Produces an ordinary runtime pool whose source refs map exactly to the approved Formal set.
- Keeps reserve/reject metadata queryable without removing source records.

- [ ] Add explicit approved Formal/Reserve/Reject source-ref sets from the integration prompt, including the three demotions and `PL01-08` promotion.
- [ ] Expand `runManifest.ts` source selection from the old strong subsets to the exact approved 48 promotions, while retaining the existing 105 formal sources that are not demoted.
- [ ] Keep merged FI06/FI13 attached only to CM01-09/CM01-10 and exclude them from independent pool entries.
- [ ] Update census tests to assert 150/19/7 by unique source refs, with anchors and merge-only refs counted by source lineage rather than Runtime definition count.
- [ ] Run the census-focused tests and inspect the printed source-ref report before touching UI behavior.

### Task 2: Add LongInputPreview as a real persisted input artifact

**Files:**
- Modify: `src/game/types.ts`
- Modify: `src/content/runManifest.ts` clone helpers
- Modify: `src/game/engine.ts`
- Modify: `src/game/storage.ts`
- Create: `src/components/LongInputPreviewCard.tsx`
- Create: `src/components/LongInputPreviewCard.test.tsx`
- Modify: `src/components/ConversationView.tsx`
- Modify: `src/components/ConversationView.test.tsx`
- Modify: `src/app/App.css`

**Interfaces:**
- Add `LongInputPreview` with `kind`, `estimatedLength`, optional `title`, player-visible `preview`/`structure`, and continuity-only `keyFacts`.
- Add optional `userLongInput` to `StoryNode` and `HistoryEntry`.
- Preserve old saves by treating the new field as absent during restore.

- [ ] Write failing component/data tests proving collapsed summary text, expandable preview/structure, and absence of `keyFacts` in rendered output.
- [ ] Implement the type and clone/persistence path, including history checkpointing in `commitChoice` and save validation compatibility.
- [ ] Render the card alongside the actual user turn, with no delay based on `estimatedLength` and no reduced-motion special case.
- [ ] Add focused CSS for a compact collapsed card and verify mobile wrapping at 390px.
- [ ] Run the focused tests, then the full suite.

### Task 3: Make Longform conversations truthful

**Files:**
- Modify: `src/content/longformOutput01.ts`
- Modify: `src/content/longformOutput01.test.ts`
- Modify: `src/content/longformOutput01.ts` node definitions for LF01-03/04/05/09/10 and promoted LF01-02/06/07/08.

- [ ] Add a short real equation to LF01-03 before any full derivation and ensure the step-4 claim matches the stored equation metadata.
- [ ] Attach actual LongInputPreview metadata to LF01-04, LF01-05, LF01-09 and the promoted longform assets; remove unsupported downstream facts from choices that lack metadata.
- [ ] Make LF01-10 ask for A/B facts or clarify before generating a long comparison.
- [ ] Add tests asserting the cited budget, phrase, transcript, equation, and A/B facts exist in metadata and that no longform node claims an absent source.

### Task 4: Apply the seven required content repairs

**Files:**
- Modify: `src/content/selectedExpansion01.ts` for PL01-02, PL01-08, PL01-10, PL01-18, PL01-19, FI07.
- Modify: `src/content/runtimeRealityPass.ts` for CM01-18 if its current source transform still contains the rejected psychological explanation.
- Add/modify focused content tests in `src/content/selectedExpansion01.test.ts` or the nearest existing test file.

- [ ] Correct the six-of-four-code wording in PL01-02 without changing its anti-fraud structure.
- [ ] Make PL01-08 explicitly about two included revisions, scope change, composition redo, and fee/scope choice.
- [ ] Keep PL01-10 contractual and regionally uncertain; keep PL01-18 safety/logistics-focused and non-diagnostic; keep PL01-19 delivery/balance/originals/documentation-focused and non-legal.
- [ ] Make FI07 continuation depend on whether the chosen response satisfies the one-word constraint.
- [ ] Reduce CM01-18 to object → father repairing things → not clearing the table, without therapist-style interpretation.
- [ ] Run focused content tests and full tests.

### Task 5: Integrate and audit all 48 promotions

**Files:**
- Modify: `src/content/runManifest.ts`
- Modify: `src/content/runtimeRealityPass.ts` only for source-specific metadata/round transforms required by the approved candidates.
- Modify: `src/content/narrativeLibrary.ts` only if parser metadata is required to preserve the source lineage.
- Add/modify: `src/content/runtimeRealityPass.test.ts`, `src/content/contentDiversity.test.ts`, and `src/content/narrativeLibrary.test.ts` as needed.

- [ ] Ensure every promoted source has a runtime conversation, stable source ref, valid choices, neutral expression effects, and an audited interaction pattern.
- [ ] Verify all ten previously unused Batch03 assets are present and no promoted source is silently replaced by a new authored ID.
- [ ] Verify generated-image and multimodal paths retain existing code-only separation.
- [ ] Run runtime reality, diversity, scheduler, manifest, replay, arc, ending, storage, streaming, reduced-motion, multimodal, and LongInput tests.

### Task 6: Browser QA and final report

**Files:**
- Create: `../../audits/INSTANCE_150_runtime_final_integration_audit_2026-08-10.md`

- [ ] Start the existing Vite app without adding packages.
- [ ] Browser-check one new Batch03, People/Life, Friction, Continuity/multimodal, Longform+LongInput, and one Mainline Anchor flow.
- [ ] Verify the LongInput path: collapsed input → Aster response → later key-fact reference → refresh restore; confirm `keyFacts` never appear in UI.
- [ ] Check desktop and 390×844, console errors/warnings, interaction state, reduced motion, and generated-image presentation.
- [ ] Re-run `npm test -- --run` and `npm run build`; record exact counts and the existing chunk warning.
- [ ] Write the final audit with 105 baseline, 3 demotions, 48 promotions, 150 final, 19 Reserve, 7 Reject, 12 code-only/legacy, Runtime definition count, node/reply counts, replay changes, test/build/browser evidence, and remaining limitations.
- [ ] Record `Git: N/A — directory is not a Git repository` and do not initialize Git.

## Self-review

- The plan covers the editorial selection, truthfulness repairs, LongInput lifecycle, runtime integration, census, and required QA.
- No step changes the five anchors, creates a new authored Conversation, or counts code-only/legacy toward the authored total.
- The existing checkout baseline is green at 23 files / 125 tests; the historical seven RED tests are not present and therefore are not modified or bypassed.
