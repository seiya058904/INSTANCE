# Terminal Causality Architecture 1.0 — Implementation Report

## Scope

- Parent: `c00712e21a20be8322467a967a1203e6e1d09bcb`
- Worktree: `D:\xia zai\AI project\INSTANCE_terminal_causality_impl`
- Model: Final Commitment family lock → primary compatibility/existing hard gates → capped same-family support score.
- New hard gates: 0.
- Untouched: Story Plan, scheduler, slot count, Ordinary pool, authored scheduling, M17 flow, `src/game/engine.ts`.

## Implemented

- Added required structured `historySignals` to all 17 base Proposals and removed prose-substring and parallel-map ranking.
- Capped Proposal history score at 20; applied Option B intended-role alignment afterward.
- Added same-family support evaluation with no RNG, maximum three configured inputs, six-point cap, and two-domain activation.
- Added primary compatibility for all five Cosmic Endings; reciprocal diplomacy can legally support Accord, Mediator, or Machine Accord.
- Added compact Posthuman and Security support inputs.
- Softened historical overreach of `cascade_authority` for The Silent Giant, The Commonwealth, and The Fracture.
- Repaired all three previously unreachable Proposals without changing inventory.
- Exposed primary compatibility, support score/reasons, and priority tier through optional `EndingResolution` diagnostics.
- Kept Secret triggers and priority unchanged.

## Editorial follow-up

`echo_existence` now has structured downstream Proposal mechanics across coexistence, machine civilization, AI rule, security, and rupture. Existing authored ECHO epilogue variants do not distinguish all five civic states (representation, exit, appeal, continuity), so no speculative copy was added. A dedicated authored-copy pass remains required for the full ECHO terminal-state epilogue.

World-state mutations for `contact_disclosure_doctrine` and `offworld_governance` were intentionally skipped because the implementation brief required avoiding decision-binding/engine expansion in this track; terminal ranking and support read stable decision values directly.

## Verification summary

- Targeted terminal suite: 3 files / 75 tests passed.
- Full Vitest: 48 files / 338 tests passed.
- Build: passed; known large-chunk warning only.
- Public / Secret / families / base Proposals / wrappers: 32 / 4 / 10 / 17 / 4.
- Input-density surprise routes: 8 before; 0 after route simulation.
