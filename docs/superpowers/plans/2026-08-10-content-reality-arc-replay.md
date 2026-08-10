# INSTANCE Content Reality, Semantic Arcs, and Replay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Runtime distribution feel like varied human-AI interaction, derive Arc effects from reply meaning, and prevent short-cycle replay repetition.

**Architecture:** Add a focused runtime editorial layer for existing conversations, a semantic Arc resolver independent of option order, and a versioned exposure scorer with topic categories. Preserve the current data-driven graph, StableRunState, UI, and image/streaming systems.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, localStorage.

## Global Constraints

- Keep 21 ordinary conversations plus 5 mainline anchors per Run.
- Do not add dependencies or real image upload/generation.
- Do not change preset-only choices, irreversible choices, forced Conversation #0000, or hidden state philosophy.
- Use TDD: each production behavior requires a failing test first.
- This directory is not a Git repository; do not fabricate commit steps.

---

### Task 1: Runtime Reality Editorial Pass

**Files:**
- Create: `src/content/runtimeRealityPass.ts`
- Create: `src/content/runtimeRealityPass.test.ts`
- Modify: `src/game/types.ts`
- Modify: `src/content/runManifest.ts`

**Interfaces:**
- Produces `applyRuntimeRealityPass(sourceId, conversation)` and `auditRuntimeReality(conversations)`.
- Adds `TopicCategory`, `ModelSampleIssue`, `choiceSimilarity`, and `topicCategory` metadata.

- [ ] Write failing tests proving standard-question is below 50%, at least 6 real bursts exist, at least 4 true self-corrections exist, and every natural input-error category occurs.
- [ ] Run `npm test -- src/content/runtimeRealityPass.test.ts --run` and confirm failure because the editorial layer does not exist.
- [ ] Implement minimal transforms for selected existing Batch01/02/03/Humor conversations and rework H03/H09 into the approved pool.
- [ ] Add 3–5 round light conversations, low-information turns, real multi-bubble input, and several choice-dependent early/continued branches.
- [ ] Add actual Expression, Convergent, identical, near-identical, and two-pair candidate text.
- [ ] Add small, safe model-error samples with explicit issue metadata.
- [ ] Run focused tests until green, then run existing content tests.

### Task 2: Multi-Run Replay Memory

**Files:**
- Modify: `src/game/types.ts`
- Modify: `src/content/runManifest.ts`
- Modify: `src/game/storage.ts`
- Modify: `src/game/storage.test.ts`
- Modify: `src/content/runManifest.test.ts`
- Modify: `src/content/crossRunAudit.test.ts`

**Interfaces:**
- `NarrativeExposureHistory.version` becomes `2`.
- `RunExposure` includes `topicCategories`.
- Selector scoring consumes the last 3 exact runs and last 5 openings plus recent topic/pattern density.

- [ ] Write failing migration and 5-run replay tests with literal expected invariants.
- [ ] Verify RED: v1 exposure is rejected or Run1 reappears in Run3.
- [ ] Implement v1→v2 migration and deterministic recent-exposure penalties.
- [ ] Verify five Runs have no overlap with either of the previous two Runs while pool capacity permits, opening does not repeat across five Runs, and topic category/pattern density is reduced.
- [ ] Run storage and replay suites green.

### Task 3: Semantic Arc Effects

**Files:**
- Create: `src/game/semanticArcs.ts`
- Create: `src/game/semanticArcs.test.ts`
- Modify: `src/content/runManifest.ts`
- Modify: `src/content/contentDiversity.test.ts`

**Interfaces:**
- `deriveSemanticArcEffects(choice, node): ArcScores` returns order-independent effects.
- Existing explicit `choice.effects.arcs` remains authoritative.

- [ ] Write failing tests for option reorder invariance, identical Convergent equality, limited Expression variance, and representative Bond/Mandate/Self meanings.
- [ ] Verify RED against current index-based assignment.
- [ ] Implement the semantic resolver using authored attributes, text cues, issue metadata, and conservative balanced defaults.
- [ ] Remove all position-based Arc assignment from `buildStoryContentForManifest`.
- [ ] Audit every runtime Choice through validation tests and run the focused suite green.

### Task 4: Hybrid Ending Feedback

**Files:**
- Modify: `src/game/types.ts`
- Modify: `src/game/engine.ts`
- Modify: `src/game/engine.test.ts`
- Modify: `src/game/endingBasin.test.ts`
- Modify: `src/components/EndingScreen.tsx`
- Modify: `src/components/EvaluationScreen.tsx`

**Interfaces:**
- `EndingResult` adds `hybridProfile` and `hybridLabel`.
- `EvaluationResult.events` includes a hybrid Arc observation when applicable.

- [ ] Write failing tests for `bond+self`, `bond+mandate`, `self-low-mandate`, and balanced profiles.
- [ ] Verify RED because current Ending only exposes winner and route.
- [ ] Implement profile resolution and distinct copy/status without adding formal Ending IDs.
- [ ] Verify all three formal Endings and all four Maya routes remain reachable.
- [ ] Run engine and ending basin tests green.

### Task 5: Full QA and Acceptance Audit

**Files:**
- Modify tests only where a real requirement needs durable regression coverage.
- Save screenshots outside the project workspace.

- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Generate a five-Run audit: exact overlap, previous-two overlap, previous-three overlap, openings, topic categories, and patterns.
- [ ] Report Runtime pattern/round/error/Choice distributions from live modules.
- [ ] Browser-test Desktop, 390×844, Reduced Motion, Chinese stream, long English stream, clipboard selection, storage refresh, five Runs, and Console.
- [ ] Inspect screenshots and final project file list for unintended changes.
- [ ] Re-read every requirement in the supplied 25-section brief; mark completion only when direct evidence covers it.
