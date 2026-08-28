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

## Verification

- `npm test -- --run` (local full suite, includes ignored `.workbody` helper test): **62 files / 423 tests**
- CI-equivalent tracked test suite (GitHub Actions excludes `.workbody`): **61 files / 422 tests**
- `npm run build`: success; only the known Vite `>500 kB` chunk warning remains
- `git diff --check`: clean
