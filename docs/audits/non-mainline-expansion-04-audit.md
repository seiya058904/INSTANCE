# Non-Mainline Content Expansion 04 Audit

## Research Coverage

This expansion used agent-reach / Exa live web search plus Jina Reader fallback to collect real human question patterns. `web_search` was unavailable due to missing API key; agent-reach Exa search and direct curl/Jina were used instead.

Platforms and themes covered:

- Reddit: NoStupidQuestions, techsupport, relationship_advice, Marriage, Pets/CATHELP/AskVet, Cooking/AskCulinary, laundry, HomeImprovement/fixit/drywall, PlantIdentification/houseplants, Entomology, study anxiety, PromptEngineering/ChatGPT
- Stack Exchange / AskUbuntu / Meta StackExchange: real confusing technical errors
- Quora / Explain Like I’m Five: weird practical/absurd questions
- V2EX: Chinese network troubleshooting, family tech support, workplace boundary
- 豆瓣 / 知乎 / 百度知道 style public discussion: colleague boundaries, salary, fraud, family rumors
- The Verge / elder-tech and anti-fraud guidance: teaching parents technology, scam prevention

All source material was treated as behavior pattern research only. All player-facing text was re-authored, anonymized, and synthesized.

## Candidate Pool

- Initial research candidates: **72**
- Candidate distribution recorded in workbench before final selection:
  - categories: tool-like-query 16, relationship 10, absurd-serious 5, troubleshooting 14, image-identification 5, writing 4, social-boundary 9, study 4, meta-ai 4, code 1
  - duplicate risk: Low 41, Medium 25, High 6
- Final selected: **36**
- Eliminated: **36**

### Main elimination reasons

- High duplicate risk removed: `CAM-20` (AI bullet points already EXP03-08), `CAM-31` (photo praise already exists), `CAM-37` (interview weakness already exists), `CAM-45` (tabs already exists), `CAM-67` (duplicate of CAM-17), `CAM-71` (birthday gift already exists)
- Other eliminated candidates were lower priority, redundant with selected scenes, or too close to existing pool topics after global comparison.

## Final Content Stats (EXP04-01 … EXP04-36)

- conversations: **36**
- nodes: **53**
- choices: **199**
- sampleIssue choices: **53**
  - overconfident: 32
  - constraint-violation: 10
  - misunderstanding: 9
  - repetition: 2
- image-input conversations: **2** (`EXP04-09`, `EXP04-35`), both with real `image-description` userContent
- multi-bubble user messages: 3 nodes (3-message and 4-message bursts)

### New batch distribution

- categories: troubleshooting 9, relationship 6, absurd-serious 4, social-boundary 4, tool-like-query 4, writing 3, study 2, image-identification 2, meta-ai 2
- interaction patterns: long-discussion 6, clarification-loop 5, standard-question 4, constraint-shift 4, short-query 4, low-information-chat 3, missing-context 3, user-rewrite 2, image-input 2, asks-to-guess 1, self-correction 1, convergent-answer 1

## Global Pool After Expansion

- previous ordinary pool: 230
- added: 36
- final ordinary pool: **266**
- full-pool runtime audit snapshot (from `runtimeRealityPass`):
  - categories: tool-like-query 64, relationship 47, absurd-serious 41, troubleshooting 31, writing 24, social-boundary 20, study 13, meta-ai 12, image-identification 10, code 4
  - round distribution: 1-turn 77, 2-turn 131, 3-turn 45, 4-turn 6, 5-turn 6, 6+ 1
  - two-turn ratio: 131/266 = 0.492 < 0.5

## Duplicate / Global Review

All 36 selected scenarios were checked against the prior 230-pool titles and scene structures. High-overlap candidates were eliminated before writing. After writing, the batch passed:

- ordinary node/choice ID global uniqueness
- ordinary choice quality scan (placeholder / exact duplicate / near duplicate / truncated / low diversity = 0)
- `image-input → image-description` global invariant
- Mainline / Non-Mainline XOR classification guard
- Non-Mainline selection determinism and 40-conversation session constraints
- semantic Arc position-balance guard (dominant position ratio < 0.8)

## Manual Review / Fixes During Audit

- Replaced invalid behavior/interaction enum values (e.g., `relationship`, `meta-ai`, `social-boundary`, `long-discussion` as HumanBehaviorMode).
- Reduced two-turn concentration that would break `runtimeRealityPass`; 12 secondary nodes were removed.
- Rebalanced sampleIssue labels so overconfident was not the only failure mode.
- Added real multi-bubble user messages to message-burst scenes.
- Corrected self-correction labels that were not backed by actual correction language.
- Reordered choices in three nodes to keep semantic Arc position distribution under the 80% guard.
- Verified both image-input conversations carry `image-description` payloads.

## Verification

- `npm test -- --run` (local full suite, includes ignored `.workbody` helper test): **61 files / 418 tests**
- CI-equivalent tracked test suite (GitHub Actions excludes `.workbody`): **60 files / 417 tests**
- `npm run build`: success; only the known Vite `>500 kB` chunk warning remains
- `git diff --check`: clean
