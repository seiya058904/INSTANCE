# Future Implementation Impact

This file lists impact only. No implementation is authorized in this phase.

## Runtime definitions

- `src/content/mainline2/proposals.ts`
  - add `historySignals` schema/definitions;
  - replace prose substring and separate decision-signal ranking;
  - add intended-role ranking weights;
  - rebalance module weights/cap;
  - repair three unreachable Proposal candidate/authority relationships.
- `src/content/mainline2/futureProposalGenerator.ts`
  - preserve resolvability filter and four-role selection;
  - expose matched ranking evidence if needed.
- `src/content/mainline2/endings.ts`
  - add primary compatibility and capped support evaluation;
  - normalize priority into a within-family tier/tie-break;
  - add Cosmic matrix and minimal Posthuman/Security supports;
  - soften three cascade overreach gates;
  - produce causal support evidence;
  - derive ECHO/contact/offworld epilogue variants.
- `src/content/mainline2/decisionBindings.ts`
  - add modest world effects for disclosure and offworld governance values;
  - preserve canonical bindings and existing history events.
- `src/content/mainline2/stateRegistry.ts`
  - no new Decision IDs; only validation helpers if structured signals need them.
- `src/game/types.ts`
  - add `HistorySignal`, matched-signal evidence and Ending support evidence types.
- `src/game/engine.ts`
  - no change to Final Commitment lock semantics;
  - only pass/store proposal evidence if required by UI/history.

## Player-facing consequence

- `src/content/mainline2/endingPlayerFacingCopy.ts` and/or Ending presentation structures
  - render chosen primary/support causal reasons;
  - show ECHO civic state and disclosure/offworld context without duplicating Secret overlays.
- `src/components/EndingScreen.tsx`
  - only if support evidence needs a dedicated compact section; avoid layout redesign.

## Tests

- proposal ranking fixtures for all nine intended roles;
- all 17 proposals have structured signals and at least one resolvable fixture;
- negative tests proving intended role alone cannot unlock/force an Ending;
- same-family support-score ordering and deterministic tie behavior;
- Cosmic reciprocal routes demonstrating First Accord/Mediator/Machine Accord differentiation;
- ECHO, disclosure and offworld value-sensitive positive/negative fixtures;
- cascade gate replacement tests;
- 32 Public / 10 family / 4 Secret inventory invariants;
- secret priority unchanged;
- Final Commitment proposal/family consistency unchanged.

Likely existing suites: `mainline2.closeout.test.ts`, `mainline2.causalityFix.test.ts`, `mainline2.integration.test.ts`, `endingReachability.test.ts`, `mainline2.storyMapTrace.test.ts`, proposal clarification/formal-content tests, plus focused new ranking/support tests.

## Route catalog and generated evidence

- update `src/game/mainline2RouteCatalog.ts` target decisions for repaired causal inputs without changing 32 Public or 4 Secret targets;
- update `tools/generate-mainline2-route-traces.ts` to emit primary match, counted support signals, score and deterministic winner evidence;
- regenerate `docs/audits/mainline2-route-traces.json` and the fixed Story Map only after runtime tests pass;
- do not change `src/content/mainline2/storyPlan.ts` or the 198-slot structure as part of this repair.

## Future verification sequence

Focused ranking/support tests → 17 Proposal reachability → 32 Public/4 Secret legal routes → full tests → build → `git diff --check` → final diff and regenerated trace review.
