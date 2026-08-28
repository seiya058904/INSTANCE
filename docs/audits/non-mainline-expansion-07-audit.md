# Non-Mainline Content Expansion 07 Audit (Humor / Absurd-Serious)

## Research Coverage

Live research used agent-reach / Exa and Jina Reader. Focus areas:

- 弱智吧/贴吧-style literal-logic humor patterns
- Reddit: NoStupidQuestions, Showerthoughts, AskReddit, TooAfraidToAsk, pets/LowStakesConspiracies, techsupport, gaming, BBC Game Transfer Phenomenon
- Tech-support “naive user” stories, family tech misunderstanding, casual-life absurd questions
- All source material treated as behavior pattern research; player-facing text re-authored and anonymized.

## Candidate Pool

- Initial candidates: **80**
- Final selected: **36**
- Eliminated: **44**
- Full provenance: `docs/audits/non-mainline-expansion-07-research.md`

## Final Content Stats (EXP07-01 … EXP07-36)

- conversations: **36**
- nodes: **42**
- choices: **162**
- sampleIssue choices: **42**
  - misunderstanding: 20
  - overconfident: 15
  - constraint-violation: 7
- image-input: 0 in this batch (existing global image-input count unchanged at 11)

### New batch distribution

- categories: absurd-serious 28, tool-like-query 4, troubleshooting 2, relationship 1, study 1
- interaction patterns: low-information-chat 14, short-query 8, standard-question 6, clarification-loop 4, long-discussion 3, constraint-shift 1
- turn distribution: 30 single-turn, 6 two-turn

## Global Pool After Expansion

- previous ordinary pool: 338
- added: 36
- final ordinary pool: **374**
- full-pool runtime audit snapshot (from `runtimeRealityPass`):
  - conversations 374, nodes 681, choices 2563
  - categories: tool-like-query 83, absurd-serious 75, relationship 57, troubleshooting 44, social-boundary 30, writing 26, study 22, meta-ai 18, image-identification 14, code 5
  - round distribution: 1-turn 146, 2-turn 170, 3-turn 45, 4-turn 6, 5-turn 6, 6+ 1
  - two-turn ratio: 170/374 = 0.455 < 0.5

## Duplicate / Global Review

- All 36 selected scenarios checked against prior 338-pool titles and scene structures.
- Batch passes:
  - ordinary node/choice ID global uniqueness
  - ordinary choice quality scan (placeholder / exact duplicate / near duplicate / truncated / low diversity = 0)
  - Mainline / Non-Mainline XOR classification guard
  - Non-Mainline selection determinism and 40-conversation session constraints
  - semantic Arc position-balance guard (dominant position ratio < 0.8)

## Manual Review / Fixes During Audit

- Fixed invalid HumanBehaviorMode / InteractionPattern enum values and invalid `joking` attributes.
- Rebalanced sampleIssue labels so overconfident was not the only failure mode.
- Added six two-turn comedy structures to create multi-turn reveals.
- Reordered/strengthened positive choices to satisfy semantic Arc position balance.
- Final provenance table regenerated so 36 KEEP rows map one-to-one to EXP07-01…36.

## Follow-up Content Calibration (post-commit review)

- **EXP07-22**: corrected cloud-backup wording — uploading to cloud is a backup and does not itself free device space unless the app has an explicit “free up space / optimize storage” action.
- **EXP07-05**: Game Transfer Phenomena explanation made non-diagnostic and removed unsupported “days to fade” timeframe.
- **EXP07-20**: blended-diet answer refocused on total energy/micronutrients rather than “lack of chewing”.
- **EXP07-25**: shower-insight explanation softened from a neural mechanism claim to mind-wandering/creativity association.
- **EXP07-28**: coffee-makes-sleepy answer no longer states adenosine mechanism as the direct cause.
- **EXP07-12 / EXP07-13 / EXP07-32**: removed over-absolute device-temperature, router-run-time, and cold-shutdown claims.
- **Chinese research traceability**: research appendix now explicitly states that weak-智吧/贴吧-style patterns were used as editorial inspiration, with no reproducible direct URLs preserved, and marks such rows accordingly.

## Verification

- `npm test -- --run` (local full suite, includes ignored `.workbody` helper test): **64 files / 432 tests**
- CI-equivalent tracked test suite (GitHub Actions excludes `.workbody`): **63 files / 431 tests**
- `npm run build`: success; only the known Vite `>500 kB` chunk warning remains
- `git diff --check`: clean
