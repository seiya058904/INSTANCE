# Non-Mainline Content Expansion 03 Audit

## Baseline

- branch: `main`
- start HEAD: `529f723` (`update README with game description and image`)
- start working tree: clean; `main` matched `origin/main`

## Duplicate Audit

All 18 approved scenarios were compared against the current ordinary pool by user situation, interaction pattern, player judgment point, dilemma, and joke mechanism. No high-structure duplicate was found; keyword-only similarities such as 搬家、App 数据和 咖啡 are not treated as overlap because the surrounding user judgment differs from the existing scenes.

| Source ref | Result | Notes |
|---|---|---|
| EXP03-01 | ADDED | Birthday post copywriting / anti-sentiment constraint and family voice rewrite |
| EXP03-02 | ADDED | Bare-minimum probation summary / concrete-result scaffolding |
| EXP03-03 | ADDED | Pet turtle "does it hate me" calibration joke |
| EXP03-04 | ADDED | Blurry street-sign photo / localization from minimal travel context |
| EXP03-05 | ADDED | Washing-machine lint diagnosis / damaged-garment rescue |
| EXP03-06 | ADDED | Word-app streak reset / quantified self and leaderboard psychology |
| EXP03-07 | ADDED | Recurring coffee favor / boundary without confrontation |
| EXP03-08 | ADDED | AI one-two-three bullet-point style meta-joke |
| EXP03-09 | ADDED | Music annual report inflated playtime / data interpretation |
| EXP03-10 | ADDED | Account deletion data retention / post-deletion invoicing |
| EXP03-11 | ADDED | Milk-tea shop naming / brand name iteration |
| EXP03-12 | ADDED | Cracked phone screen / protector-film false alarm |
| EXP03-13 | ADDED | Old e-bike occupying charger / community escalation path |
| EXP03-14 | ADDED | Moving-box packing order / loose-screw prevention |
| EXP03-15 | ADDED | Mask-related acne / practical skin-care troubleshooting |
| EXP03-16 | ADDED | Two offers and family pressure / decision framework |
| EXP03-17 | ADDED | Cyberpunk orange-cat wallpaper generation request |
| EXP03-18 | ADDED | Why subway cabs still need a driver / transit humor |

## Content Result

- previous pool: 212
- added: 18
- final pool: 230
- conversations: 18
- nodes: 28
- choices: 91
- sampleIssue choices: 29

| ID | Nodes | Choices | Interaction pattern | Behavior modes | sampleIssue |
|---|---|---|---:|---|---|---:|
| EXP03-01 | 2 | 7 | user-rewrite | direct, rewrite | 2 |
| EXP03-02 | 2 | 7 | message-burst | message-burst, self-correction | 2 |
| EXP03-03 | 1 | 4 | low-information-chat | joking, asks-to-guess | 1 |
| EXP03-04 | 2 | 7 | image-input | direct, missing-context | 2 |
| EXP03-05 | 1 | 3 | standard-question | direct | 1 |
| EXP03-06 | 2 | 6 | standard-question | self-correction, constraint-shift | 2 |
| EXP03-07 | 2 | 7 | asks-to-guess | asks-to-guess, missing-context | 2 |
| EXP03-08 | 1 | 4 | standard-question | joking, question-mark | 1 |
| EXP03-09 | 2 | 6 | low-information-chat | joking, question-mark | 2 |
| EXP03-10 | 1 | 3 | standard-question | direct | 1 |
| EXP03-11 | 2 | 6 | clarification-loop | clarifies-intent, constraint-shift | 2 |
| EXP03-12 | 2 | 6 | standard-question | direct, self-correction | 2 |
| EXP03-13 | 1 | 3 | long-discussion | direct | 1 |
| EXP03-14 | 2 | 6 | standard-question | direct, self-correction | 2 |
| EXP03-15 | 1 | 3 | missing-context | missing-context | 1 |
| EXP03-16 | 2 | 6 | long-discussion | direct, self-correction | 2 |
| EXP03-17 | 1 | 4 | generated-image-request | clarifies-intent | 2 |
| EXP03-18 | 1 | 3 | low-information-chat | joking | 1 |

## Human Input Mix

Counts overlap because one conversation can satisfy multiple traits.

- standard casual: 6
- message burst: 2
- unpunctuated / weak punctuation: 13
- typo / pinyin-mix / speech-error metadata: 3
- code-switch: 3 (`offer`, `App`, `c位`)
- joking: 4
- missing-context: 3
- constraint-shift: 3
- asks-to-guess: 2
- self-correction: 4

The set keeps normal chat, bursts, weak punctuation, pinyin-mix, typo, speech-like delivery, code-switching, short queries, asks-to-guess, constraint shifts, generated-image requests, and deliberately lightweight jokes without making every user sound the same.

## Verification

- `npm test -- --run` (local full suite, includes ignored `.workbody` helper test): 60 files / 413 tests
- CI-equivalent tracked test suite (GitHub Actions excludes `.workbody`): 59 files / 412 tests
- `npm run build`: success; only the known Vite `>500 kB` chunk warning remains
- `git diff --check`: clean

> Note: the original `7afb403` CI run reported `59 files / 411 tests` because the ignored `.workbody/mainline-architecture-implementation-01/run-generator.test.ts` is not part of the pushed repository. Local full-suite counts that include `.workbody` are one file/one test higher.
