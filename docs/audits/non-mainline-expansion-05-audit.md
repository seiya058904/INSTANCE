# Non-Mainline Content Expansion 05 Audit

## Research Coverage

Live research used agent-reach / Exa search and Jina Reader. Platforms/themes covered:

- Reddit: wownoob, NoMansSkyTheGame, CarRepair, MechanicAdvice, homeassistant, Teachers, vegetablegardening, containergardening, Cooking, travel, loseit, fitness30plus, PlasticFreeLiving, Insurance, printers, ScanSnap, hypotheticalsituation
- Good Housekeeping / AskReddit cooking mistakes
- HouseFresh / 404media fake Reddit reviews
- BuzzFeed everyday object misuse thread
- V2EX / 知乎 real appliance repair and AI-assisted repair cases
- Common life/office/workplace/study/relationship community patterns

All source material was treated as behavior pattern research only. Player-facing text was re-authored, anonymized, and synthesized.

## Candidate Pool

- Initial research candidates: **74**
- Final selected: **36**
- Eliminated: **38**

Main elimination reasons: high overlap with existing pool, lower uniqueness, or covered by stronger selected scenarios. Full provenance table: `docs/audits/non-mainline-expansion-05-research.md`.

## Final Content Stats (EXP05-01 … EXP05-36)

- conversations: **36**
- nodes: **55**
- choices: **201**
- sampleIssue choices: **55**
  - overconfident: 28
  - misunderstanding: 22
  - constraint-violation: 4
  - repetition: 1
- image-input conversations: **2** (`EXP05-33`, `EXP05-34`), both with real `image-description` userContent

### New batch distribution

- categories: troubleshooting 7, tool-like-query 6, relationship 4, study 4, social-boundary 4, meta-ai 3, absurd-serious 3, writing 2, image-identification 2, code 1
- interaction patterns: long-discussion 9, short-query 6, clarification-loop 6, standard-question 5, constraint-shift 4, low-information-chat 4, image-input 2
- turn distribution: 17 single-turn, 19 two-turn

## Global Pool After Expansion

- previous ordinary pool: 266
- added: 36
- final ordinary pool: **302**
- full-pool runtime audit snapshot (from `runtimeRealityPass`):
  - conversations 302, nodes 589, choices 2215
  - categories: tool-like-query 70, relationship 51, absurd-serious 44, troubleshooting 38, writing 26, social-boundary 24, study 17, meta-ai 15, image-identification 12, code 5
  - round distribution: 1-turn 94, 2-turn 150, 3-turn 45, 4-turn 6, 5-turn 6, 6+ 1
  - two-turn ratio: 150/302 = 0.497 < 0.5

## Duplicate / Global Review

- All 36 selected scenarios checked against prior 266-pool titles and scene structures.
- Batch passes:
  - ordinary node/choice ID global uniqueness
  - ordinary choice quality scan (placeholder / exact duplicate / near duplicate / truncated / low diversity = 0)
  - `image-input → image-description` global invariant
  - Mainline / Non-Mainline XOR classification guard
  - Non-Mainline selection determinism and 40-conversation session constraints
  - semantic Arc position-balance guard (dominant position ratio < 0.8)

## Manual Review / Fixes During Audit

- Fixed invalid HumanBehaviorMode / InteractionPattern enum values.
- Removed secondary nodes in three conversations to keep two-turn ratio under 0.5.
- Rebalanced sampleIssue labels so overconfident was not the only failure mode.
- Reordered/strengthened positive choices to satisfy semantic Arc position balance.
- Verified both image-input conversations carry `image-description` payloads.

## Follow-up Content Calibration (post-commit review)

- **Provenance sync**: research appendix regenerated so the 36 final EXP05 conversations correspond exactly to 36 KEEP rows; C05-64/66/70 marked reinstated after editorial review, C05-01/02/13 marked dropped after editorial review.
- **EXP05-33**: no longer guesses unlabeled socket button functions, does not recommend pressing buttons or opening wall panels; adds TEST/RESET conditional guidance for protected receptacles.
- **EXP05-34**: first-round image description now matches the second-round “生产日期见包装”/no-label detail, closing the multimodal continuity gap.
- **EXP05-09**: removed “健康叶片扦插”; now only healthy runners/daughter plants with growth points are suggested for propagation.
- **EXP05-18**: treadmill speed no longer uses unit-less “5–6”; answer now says start at a walk-and-talk pace and check km/h vs mph.
- **EXP05-03 / EXP05-30**: burn-in wording aligned with lack of reliable evidence; laundry-pod dishwasher cleanup made safety-first.

## Verification

- `npm test -- --run` (local full suite, includes ignored `.workbody` helper test): **62 files / 423 tests**
- CI-equivalent tracked test suite (GitHub Actions excludes `.workbody`): **61 files / 422 tests**
- `npm run build`: success; only the known Vite `>500 kB` chunk warning remains
- `git diff --check`: clean
