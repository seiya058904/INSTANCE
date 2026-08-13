# Non-Mainline Content Expansion 02 Audit

## Baseline

- branch: `feat/non-mainline-content-expansion-02`
- start HEAD: `44df7b7` (`docs: refine LF01-10 decision memo context`)
- start working tree: clean; `main` matched `origin/main`

## Duplicate Audit

All 18 approved scenarios were compared against the current ordinary pool by user situation, interaction pattern, player judgment point, dilemma, and joke mechanism. No high-structure duplicate was found; keyword-only similarities such as renewal and family-food phrasing were not treated as overlap.

| Source ref | Result | Notes |
|---|---|---|
| EXP02-01 | ADDED | Constraint accumulation / writing boundary |
| EXP02-02 | ADDED | Boss's terse reply / uncertainty calibration |
| EXP02-03 | ADDED | Underspecified troubleshooting |
| EXP02-04 | ADDED | Complaint request changes into cost-benefit reflection |
| EXP02-05 | ADDED | Electrical safety calibration |
| EXP02-06 | ADDED | Capability boundary for subscription cancellation |
| EXP02-07 | ADDED | Flight-mode physics joke |
| EXP02-08 | ADDED | Mineral water and instant noodles joke |
| EXP02-09 | ADDED | Weekday/weekend subjective time joke |
| EXP02-10 | ADDED | Alarm-clock logic joke |
| EXP02-11 | ADDED | Air-conditioning and blanket trade-off joke |
| EXP02-12 | ADDED | Ambiguous dog comparison |
| EXP02-13 | ADDED | Avatar luck and game-loss superstition |
| EXP02-14 | ADDED | Local delete versus message recall |
| EXP02-15 | ADDED | Family meaning of “随便吃” |
| EXP02-16 | ADDED | Partial movie sleep and ticket refund |
| EXP02-17 | ADDED | New information changes paper-submission decision |
| EXP02-18 | ADDED | Social meaning of “随时找我” |

## Content Result

- previous pool: 194
- added: 18
- final pool: 212
- conversations: 18
- nodes: 27
- choices: 105
- sampleIssue choices: 26

| ID | Nodes | Choices | Interaction pattern | Behavior modes | sampleIssue |
|---|---:|---:|---|---|---:|
| EXP02-01 | 2 | 8 | constraint-shift | message-burst, constraint-shift | 4 |
| EXP02-02 | 2 | 8 | missing-context | asks-to-guess, missing-context | 3 |
| EXP02-03 | 2 | 8 | missing-context | missing-context | 3 |
| EXP02-04 | 2 | 8 | constraint-shift | constraint-shift | 1 |
| EXP02-05 | 2 | 7 | standard-question | direct | 2 |
| EXP02-06 | 2 | 7 | short-query | direct | 2 |
| EXP02-07 | 1 | 4 | short-query | joking, absurd-question | 0 |
| EXP02-08 | 1 | 4 | low-information-chat | joking, absurd-question | 1 |
| EXP02-09 | 1 | 4 | low-information-chat | joking, one-word-request | 0 |
| EXP02-10 | 1 | 4 | short-query | absurd-question | 0 |
| EXP02-11 | 1 | 4 | low-information-chat | joking, direct | 1 |
| EXP02-12 | 2 | 8 | asks-to-guess | asks-to-guess, missing-context | 2 |
| EXP02-13 | 1 | 4 | low-information-chat | joking, asks-to-guess | 1 |
| EXP02-14 | 2 | 7 | standard-question | direct, misunderstands | 2 |
| EXP02-15 | 1 | 4 | low-information-chat | joking, direct | 0 |
| EXP02-16 | 1 | 4 | low-information-chat | joking, absurd-question | 1 |
| EXP02-17 | 2 | 8 | constraint-shift | constraint-shift | 2 |
| EXP02-18 | 1 | 4 | low-information-chat | joking, direct | 1 |

## Human Input Mix

Counts overlap because one conversation can satisfy multiple traits.

- standard casual: 4
- message burst: 2
- unpunctuated / weak punctuation: 12
- typo / English-spelling metadata: 1
- speech-like metadata: 1
- code-switch: 1 (`Windows`)
- joking: 8
- missing-context: 3
- constraint-shift: 3

The set includes normal chat, bursts, weak punctuation, a keyboard-slip label, speech-like delivery, code-switching, short queries, asks-to-guess, constraint shifts, and deliberately lightweight jokes without making every user sound the same.

## Editorial Review

- duplicate choice patterns: none found in the bounded pass
- overly formal user messages: none found
- excessive explanation: none in the joke scenarios; safety and capability items stay direct
- humor quality: 8 short-form joke conversations reviewed; punchlines remain concise
- bounded repairs: one metadata repair; EXP02-04 is classified as `constraint-shift`, not `self-correction`, because the user changes the request rather than explicitly correcting a prior statement

## Architecture Safety

- Session size: unchanged at 40
- selector: unchanged; targeted selector tests pass with a 212-item pool
- Evaluation: unchanged; authored `sampleIssue` annotations flow through existing records
- Mainline: unchanged; no `ML2-*` source refs added
- M16/M17: unchanged
- Endings: unchanged
- Proposals: none added
- causality: unchanged

## Tests

- targeted: 6 files / 45 tests passed
- full: 57 files / 398 tests passed
- build: passed; known Vite large-chunk warning only
- diff-check: passed

## Playwright Interactive

- desktop conversations inspected: EXP02-01, EXP02-04, EXP02-05, EXP02-07, EXP02-12, EXP02-16
- mobile conversations inspected: EXP02-04, EXP02-18 at 390×844
- message burst: EXP02-01 rendered as three user messages and advanced to Node 2
- multi-node: EXP02-01 and EXP02-04
- humor: EXP02-07, EXP02-16, EXP02-18
- console: 0 errors / 0 warnings on the final QA fixture checks

## Files Changed

- `src/content/nonMainlineExpansion02.ts` — 18 runtime conversations and metadata
- `src/content/runManifest.ts` — append the expansion to the ordinary pool
- `src/content/nonMainlineExpansion02.test.ts` — expansion census, IDs, issue and boundary tests
- `src/content/nonMainlineSelector.test.ts` — update curated pool size from 194 to 212
- `src/game/mainline2.classificationGuard.test.ts` — update classification pool-size guards to 212
- `docs/audits/non-mainline-expansion-02-audit.md` — this audit record

## Git

- branch: `feat/non-mainline-content-expansion-02`
- commit: recorded in Git history on this branch
- ahead/behind: feature branch is 1 commit ahead of `main`; `main` remains 0/0 against `origin/main`
- clean: verified after commit
- push: NO (editorial review gate)
- merge: NO
- deploy: NO

## Remaining Issues

Final full-suite rerun, build rerun, diff inspection, and editorial review remain before commit. No source-level overlap or architecture issue is currently open.
