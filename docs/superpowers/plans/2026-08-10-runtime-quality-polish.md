# INSTANCE Runtime Quality Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with review checkpoints.

**Goal:** Improve existing Runtime narrative quality and Run pacing without adding new narrative assets.

**Architecture:** Keep authored content in the current Runtime transformation layer and active authoritative definitions. Add pure audit helpers for comparable metrics, then apply only small content and scheduler changes. Preserve the existing manifest, storage, Arc, Ending and legacy contracts.

**Tech Stack:** TypeScript, React, Vitest, Vite, in-app Browser.

## Global Constraints

- Do not create Batch04, Humor02, new Conversation IDs, new Scenes, new Endings or new Arcs.
- Treat parallel AI-generated Libraries as read-only and do not integrate them.
- Do not add Model Error samples.
- Do not make Arc effects depend on choice position.
- Keep five mainline anchors, their order, Level conditions and Ending logic intact.

---

### Task 1: Freeze comparable audit baseline

**Files:**
- Modify: `src/content/runtimeRealityPass.test.ts`
- Modify: `src/content/runManifest.test.ts`
- Modify: `src/content/contentDiversity.test.ts`

**Interfaces:**
- Consume `ordinaryConversationPool`, `createRunManifest`, `buildStoryContentForManifest`.
- Produce deterministic audit snapshots used for before/after comparison.

- [ ] Write one failing assertion for the new position-length and AI-opening metrics.
- [ ] Run the focused test and confirm it fails because the metric helper/assertion is absent.
- [ ] Add the smallest pure test-local metric helpers and baseline snapshot assertions.
- [ ] Run the focused tests and record the baseline output before content edits.

### Task 2: Rework highest-value existing Conversation shapes

**Files:**
- Modify: `src/content/runtimeRealityPass.ts`
- Modify: `src/content/activeRun.ts` only when an authoritative anchor text is selected.
- Test: `src/content/contentDiversity.test.ts`

**Interfaces:**
- Preserve `ConversationDefinition`, `StoryNode`, `StoryChoice`, `ChoiceKind`, `InteractionPattern` and `ChoiceEffects`.
- Preserve all existing source IDs and anchor IDs.

- [ ] Add failing behavior assertions for selected high-value existing shapes: shortened or naturally ended second rounds, at least one incomplete user input, and non-uniform response lengths.
- [ ] Run the focused test and verify the failure is caused by current authored behavior.
- [ ] Modify only the selected existing transformations and text; do not add a Conversation or Scene.
- [ ] Recalculate each changed Choice’s observable meaning and update only stale Arc/metadata fields.
- [ ] Run focused narrative and semantic Arc tests.

### Task 3: Add light Run-internal soft weighting

**Files:**
- Modify: `src/content/runManifest.ts`
- Test: `src/content/runManifest.test.ts`
- Test: `src/content/crossRunAudit.test.ts`

**Interfaces:**
- Preserve `createRunManifest(runId, exposure): RunManifest` and all persisted exposure fields.
- Use existing `topicCategory`, `interactionPattern`, node length and source metadata.

- [ ] Add a failing deterministic test showing a fresh candidate with repeated Topic/Pattern is ranked below an equally fresh diverse candidate.
- [ ] Run the focused test and confirm current selection does not satisfy the new soft preference.
- [ ] Add small additive score penalties for current-run density, with no hard exclusion and no pool-size change.
- [ ] Add anchor placement spacing logic without changing anchor count or order.
- [ ] Run manifest, replay, storage and engine tests.

### Task 4: Re-run the same audit and decide whether more content edits are justified

**Files:**
- Modify: `src/content/runtimeRealityPass.test.ts`
- Modify: `src/content/runManifest.test.ts`
- Modify: `src/content/crossRunAudit.test.ts`

**Interfaces:**
- Consume the same snapshot metrics created in Task 1.
- Produce ten deterministic Manifest reports and Anchor position reports.

- [ ] Run ten fixed Manifest IDs and collect Topic, Pattern, length and density metrics.
- [ ] Compare every metric with the frozen baseline; do not introduce target KPIs.
- [ ] Identify only still-obvious quality issues; leave already-natural Conversations unchanged.
- [ ] If a second content batch is justified, add one failing test per chosen behavior before edits.

### Task 5: Full verification and browser walk-through

**Files:**
- Read-only: all changed Runtime files and existing UI files.

**Interfaces:**
- Verify `npm test`, `npm run build`, Storage migration, Replay Exposure, Arc, Ending, Streaming and UI contracts.

- [ ] Run the full Vitest suite.
- [ ] Run the TypeScript/Vite build.
- [ ] Start the local app and verify desktop page identity, nonblank content, console health and a complete interaction path.
- [ ] Repeat the essential path at 390×844 and verify no clipping or broken persistence.
- [ ] Inspect final diff; report exact modified files, metrics and remaining limits.
