# Selected Expansion 01 Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Audit the 25 P1 conversations against the live 77-conversation Runtime, integrate only non-conflicting finalists, and preserve P2/MERGE/RESERVE as non-runtime source material.

**Architecture:** Keep the two supplied Markdown files as editorial source and audit evidence. Add a typed integration layer that converts only approved finalists into the existing `ConversationDefinition` shape, then expose those conversations to the ordinary pool through the existing manifest selector. Do not introduce a new DSL, replace the current Runtime graph, or register all 34 selected conversations automatically.

**Tech Stack:** TypeScript, React, Vitest, Vite, existing `ConversationDefinition`/`StoryNode` runtime types.

## Global Constraints

- The selected Markdown file is not a formal Runtime batch and must not be loaded wholesale.
- P1 is audited before P2; MERGE IDEA does not receive a standalone Conversation ID; RESERVE stays out of Runtime.
- Preserve existing anchors, save/restore, replay selection, Arc semantics, and current user-visible contracts.
- Model Error metadata is only used for actual Aster output errors; speech transcription, quoted prior errors, and another AI's errors remain input/context issues.
- New production behavior is test-first; run the focused failing test before implementation and the full suite after each integration slice.
- This directory is not a Git worktree; do not fabricate commits or Git completion evidence.

---

### Task 1: Build the P1 collision audit

**Files:**
- Create: `src/content/selectedExpansion01.ts`
- Create: `src/content/selectedExpansion01.test.ts`
- Read: `INSTANCE_narrative_library_selected_expansion01.md`
- Read: `INSTANCE_narrative_library_selected_expansion01_review.md`
- Read: `src/content/runManifest.ts`, `src/content/activeRun.ts`, `src/game/types.ts`

**Interfaces:**
- Produce a typed list of P1 editorial records with source ref, title, priority, interaction pattern, topic category, node count, and integration disposition.
- Produce a read-only audit function that reports exact source-ref collisions, likely shape collisions, and reasons for rejecting or deferring a candidate.

- [ ] Extract the 25 P1 records from the supplied Markdown without changing the source files.
- [ ] Write tests asserting there are exactly 25 P1 records, all have unique source refs, and every record has explicit disposition metadata.
- [ ] Add semantic collision checks against the 77 live Runtime conversations by topic, pattern, input modality, and user situation.
- [ ] Verify the audit classifies speech-error as `inputIssue`, not `sampleIssue`, and excludes quoted/other-AI failures from Aster model-error counts.
- [ ] Run the focused audit test and inspect the complete disposition table.

### Task 2: Convert only KEEP/REWORK finalists into typed Runtime content

**Files:**
- Modify: `src/content/selectedExpansion01.ts`
- Modify: `src/content/runManifest.ts`
- Create or modify: `src/content/selectedExpansion01.test.ts`

**Interfaces:**
- Produce `selectedExpansion01Conversations: ConversationDefinition[]` containing only finalists approved by Task 1.
- Keep node and choice IDs stable and namespaced by source ref; preserve explicit choice length and continuation behavior.

- [ ] Write failing tests for stable IDs, valid node targets, four-choice normalization, and source refs matching the selected source.
- [ ] Implement the smallest typed conversion for the approved finalists, including `behaviorModes`, `interactionPattern`, `topicCategory`, timing, input issues, and genuine sample issues.
- [ ] Leave P2, MERGE, RESERVE, and REJECT records available as audit/source metadata but absent from the ordinary Runtime pool.
- [ ] Add the approved conversations to the ordinary pool through the existing selector boundary, not by bypassing manifest scoring.
- [ ] Run focused content tests and confirm existing anchors remain unchanged.

### Task 3: Re-audit distribution and replay behavior

**Files:**
- Modify: `src/content/runtimeRealityPass.test.ts`
- Modify: `src/content/crossRunAudit.test.ts`
- Create or modify: `src/content/selectedExpansion01.test.ts`

**Interfaces:**
- Extend the existing audit snapshots with selected-expansion counts, topic/pattern density, model-error counts, and exact recent-run overlap.

- [ ] Write failing assertions for the intended post-integration bounds before changing the production pool.
- [ ] Run the focused tests and record the expected RED failures if the new content is not yet wired.
- [ ] Implement only the minimum selector metadata needed for the new content to participate in replay rotation.
- [ ] Run the five-run replay audit and verify no new candidate bypasses recent-run penalties or anchor rules.
- [ ] Verify P1 additions do not make standard questions or any single topic dominate the pool.

### Task 4: Full verification and manual runtime check

**Files:**
- Read all changed files and supplied editorial files.
- No unrelated cleanup or dependency changes.

- [ ] Run `npm test -- --run` and record test files, test count, and failures.
- [ ] Run `npm run build` and record the exit status.
- [ ] Run `git diff --check` only as a harmless diagnostic; report that Git metadata is unavailable if applicable.
- [ ] Start the local app and manually inspect one desktop run using a newly integrated conversation, one existing anchor, and one replay transition.
- [ ] Report integrated, deferred, rejected, verified, manual-only, and unverified coverage separately.
