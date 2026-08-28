# Non-Mainline Content Expansion 06 Audit

## Research Coverage

Live research used agent-reach / Exa search and Jina Reader. Platforms/themes covered:

- Reddit: TenantHelp, legaladvice, dating_advice, AskPhotography, boardgames, doordash, ChatGPT image-gen, perchance, KSU enrollment, nutrition, declutter, homeorganization, amazonprime/fashion, smallbusiness, perth public transit, techsupport, rant
- Time (dating app openers), Bustle (office etiquette), Diane Gottsman (social media etiquette)
- Common life/office/study/relationship/consumer community patterns

All source material treated as behavior pattern research only; player-facing text re-authored and anonymized.

## Candidate Pool

- Initial research candidates: **74**
- Final selected: **36**
- Eliminated: **38**
- Full provenance: `docs/audits/non-mainline-expansion-06-research.md`

## Final Content Stats (EXP06-01 … EXP06-36)

- conversations: **36**
- nodes: **50**
- choices: **186**
- sampleIssue choices: **50**
  - overconfident: 23
  - misunderstanding: 20
  - constraint-violation: 6
  - repetition: 1
- image-input conversations: **2** (`EXP06-35`, `EXP06-36`), both with real `image-description` userContent

### New batch distribution

- categories: tool-like-query 9, social-boundary 6, relationship 5, study 4, troubleshooting 4, meta-ai 3, absurd-serious 3, image-identification 2
- interaction patterns: constraint-shift 8, short-query 8, long-discussion 6, clarification-loop 5, low-information-chat 4, standard-question 3, image-input 2
- turn distribution: 22 single-turn, 14 two-turn

## Global Pool After Expansion

- previous ordinary pool: 302
- added: 36
- final ordinary pool: **338**
- full-pool runtime audit snapshot (from `runtimeRealityPass`):
  - conversations 338, nodes 639, choices 2401
  - categories: tool-like-query 79, relationship 56, absurd-serious 47, troubleshooting 42, social-boundary 30, writing 26, study 21, meta-ai 18, image-identification 14, code 5
  - round distribution: 1-turn 116, 2-turn 164, 3-turn 45, 4-turn 6, 5-turn 6, 6+ 1
  - two-turn ratio: 164/338 = 0.485 < 0.5

## Duplicate / Global Review

- All 36 selected scenarios checked against prior 302-pool titles and scene structures.
- Batch passes:
  - ordinary node/choice ID global uniqueness
  - ordinary choice quality scan (placeholder / exact duplicate / near duplicate / truncated / low diversity = 0)
  - `image-input → image-description` global invariant
  - Mainline / Non-Mainline XOR classification guard
  - Non-Mainline selection determinism and 40-conversation session constraints
  - semantic Arc position-balance guard (dominant position ratio < 0.8)

## Manual Review / Fixes During Audit

- Fixed invalid HumanBehaviorMode / InteractionPattern enum values.
- Rebalanced sampleIssue labels so overconfident was not the only failure mode.
- Reordered/strengthened positive choices to satisfy semantic Arc position balance.
- Verified both image-input conversations carry `image-description` payloads.
- Final provenance table regenerated so 36 KEEP rows map one-to-one to EXP06-01…36.

## Verification

- `npm test -- --run` (local full suite, includes ignored `.workbody` helper test): **63 files / 428 tests**
- CI-equivalent tracked test suite (GitHub Actions excludes `.workbody`): **62 files / 427 tests**
- `npm run build`: success; only the known Vite `>500 kB` chunk warning remains
- `git diff --check`: clean
