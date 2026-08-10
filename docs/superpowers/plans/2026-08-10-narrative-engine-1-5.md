# Narrative Engine 1.5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add stable narrative contracts and validation while preserving existing runtime behavior.

**Architecture:** Extend the existing TypeScript data model with a registry-backed compatibility layer. Keep manifest construction and the UI boundary unchanged; make runtime-owned system state optional for old saves.

**Tech Stack:** TypeScript, Vitest, existing Vite project.

## Global Constraints

- Do not implement Scheduler v2, Manifest v2, Story Graph Viewer, Random Run Tester, custom DSL, large directory reorganization, or full content migration.
- Preserve existing save version 2, fixed-seed manifest behavior, endings, history, and restore behavior.
- Do not overwrite unrelated or concurrent work; this checkout currently has no Git metadata and 97/97 tests pass.

---

### Task 1: Stable IDs and narrative contracts

**Files:**
- Modify: `src/game/types.ts`
- Create: `src/game/narrativeSchema.ts`
- Modify: `src/content/narrativeLibrary.ts`

- [ ] Add typed Flag Registry, Condition, Predicate, Mutation, and runtime-owned state fields while keeping legacy effect fields optional.
- [ ] Add deterministic choice-ID generation from node ID and normalized authored text.
- [ ] Add tests that reorder parsed choices without changing IDs and that validate the public schema types.

### Task 2: Runtime evaluation and structured mutations

**Files:**
- Modify: `src/game/engine.ts`
- Modify: `src/game/storage.ts`

- [ ] Add condition evaluation against run state and registry.
- [ ] Apply structured mutations and legacy effects in one atomic choice transaction.
- [ ] Maintain seen nodes, selected choices, ending completion, and event records automatically.
- [ ] Restore old saves with empty optional system-state collections.

### Task 3: Validator and characterization coverage

**Files:**
- Modify: `src/game/engine.ts`
- Create: `src/game/narrativeSchema.test.ts`
- Modify: `src/game/engine.test.ts`
- Modify: `src/game/storage.test.ts`

- [ ] Extend validation for IDs, references, registries, conditions, mutations, exits, and basic reachability.
- [ ] Add behavior-level tests for choice reorder independence, condition gating, structured mutations, system-state maintenance, fixed-seed manifests, endings, and save restoration.
- [ ] Run the full Vitest suite and inspect the final file set and whitespace.
