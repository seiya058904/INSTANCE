# INSTANCE Mainline 2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the approved M1–M17 Mainline 2.0 architecture into the existing runtime with v3 state, dynamic pacing, legacy-safe migration, proposal/endings resolution, and deterministic verification.

**Architecture:** Keep the existing ordinary library and five anchors as the legacy/content foundation. Add a separate `src/content/mainline2/` registry with authored, stable IDs, a boundary scheduler, state registry, proposal generator, and ending resolver; the engine selects the v3 path by run identity while preserving the v2 path. The manifest remains the append-only scheduled conversation source of truth.

**Tech Stack:** TypeScript, React, Vite, Vitest, existing localStorage persistence.

## Global Constraints

- New Mainline 2.0 runs finish in 123–146 Conversations with ACT I 25–28, ACT II 28–32, ACT III 28–32, ACT IV 30–36, ACT V 12–18.
- ACT IV uses 2–4 active modules from `machine`, `ascension`, `automation`, `uplift`, `space`, `contact`, `security`.
- `bond`, `mandate`, and `selfAuthorship` are Aster dispositions only; they never directly select the world ending.
- v2 in-progress saves remain legacy-mainline and old formal endings remain resolvable.
- `THE UPLOAD`, `GOOD BOY GOVERNANCE`, and `THE INTERNET IS FOR CATS` obey the audit bridge/dormancy rules; `#0000` remains unresolved.
- Do not rewrite ordinary narrative assets, overwrite anchor callbacks, update dependencies, deploy, publish, or merge.

---

### Task 1: Characterization and v3 state contracts

**Files:**
- Modify: `src/game/types.ts`
- Modify: `src/game/narrativeSchema.ts`
- Modify: `src/game/storage.ts`
- Test: `src/game/narrativeSchema.test.ts`, `src/game/storage.test.ts`

- [ ] Add typed world axes, modules, decisions, progress, v3 stable state, and minimal mutations/predicates.
- [ ] Add red tests for decision/world/event/module predicates, world clamping, v3 round-trip, and v2 legacy restoration.
- [ ] Implement migration without changing v2 manifests or old ending behavior.
- [ ] Run focused tests and then the existing suite.

### Task 2: Mainline 2.0 content registry and scheduler

**Files:**
- Create: `src/content/mainline2/registry.ts`, `stateRegistry.ts`, `scheduler.ts`
- Create: `src/content/mainline2/act1.ts`, `act2.ts`, `act3.ts`, `act4Common.ts`, `act4Late.ts`, `act5Opening.ts`, `act5Final.ts`
- Create: `src/content/mainline2/modules/*.ts`, `proposals.ts`, `endings.ts`
- Modify: `src/content/runManifest.ts`
- Test: `src/content/mainline2/*.test.ts`

- [ ] Register stable semantic runtime IDs for M1–M17 as a library, not a linear asset dump.
- [ ] Build deterministic boundary scheduling with quotas, ordinary-pool exposure, persisted module selection, and append-only manifest updates.
- [ ] Select 2–4 ACT IV modules with hard prerequisites, including rare CONTACT and dormant-content guards.
- [ ] Add M15 convention, M16 3–5 proposal generation, and M17 public ending/epilogue registries.

### Task 3: Engine integration and UI continuation

**Files:**
- Modify: `src/game/engine.ts`
- Modify: `src/app/App.tsx`
- Modify: `src/components/EndingScreen.tsx`, `EvaluationScreen.tsx`
- Test: `src/game/engine.test.ts`, new Mainline integration tests

- [ ] Branch new runs into Mainline 2.0 while keeping legacy graph transitions intact.
- [ ] At conversation boundaries schedule the next conversation; only M17 completion enters ending/evaluation.
- [ ] Resolve Final Commitment through proposal family, eligibility, viability, world state, history, disposition overlay, and secret checks.
- [ ] Add minimal proposal clarification, key-history, epilogue, and final-commitment presentation without exposing internal world axes.

### Task 4: Verification and handoff

**Files:**
- Create: deterministic simulation/verification tests and integration audit report under `docs/audits/`

- [ ] Cover every non-dormant public ending with deterministic fixtures and explicitly test dormant endings.
- [ ] Run at least 100 deterministic legal simulations and assert pacing, ACT IV module count, proposal counts, and ending reachability.
- [ ] Run `npm test -- --run`, `npm run build`, `git diff --check`, and inspect final diff/status.
- [ ] Commit only implementation files, push the feature branch, and create a Draft PR without merge or deploy.
