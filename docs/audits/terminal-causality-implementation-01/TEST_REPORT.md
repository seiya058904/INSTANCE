# Test Report

## Baseline

Initial baseline run: 46 of 47 files passed; 278 passed / 37 failed. All 37 failures were the same pre-existing stale presentation assertion in `mainline2.determinism.test.ts`: baseline copy had changed to `沿着已经被证明可行的方向继续`, while the test still required the prior phrase. The assertion was synchronized with the baseline implementation in this track.

## TDD evidence

- Initial Terminal Causality test: 12/12 failed for missing structured signals, intended-role ranking, support evaluator/evidence, repaired Proposal routes, and exported Secret priority.
- First green: 12/12 passed.
- Role/value matrix additions: 3 expected failures, then 15/15 passed.
- Eight-route density additions: 6 expected failures, then 23/23 passed.

## Final verification

- Targeted: `terminalCausality`, determinism, closeout — 3 files / 75 tests passed.
- Extended terminal group: 7 files / 92 tests passed.
- Full Vitest: 48 files / 338 tests passed.
- Build: TypeScript app + node configs and Vite production build passed.
- Build warning: existing large client chunk warning only (`1,980.09 kB`, gzip `608.33 kB`).
- Browser: intentionally not run; assigned to Track A.
- Generated `docs/audits/mainline2-route-traces.json` test side effect restored to HEAD and not included.
