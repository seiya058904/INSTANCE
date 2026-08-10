# INSTANCE Asset Editorial Index

Date: 2026-08-10

## Current census

| Measure | Count |
|---|---:|
| Authored Unique Source Assets | 176 |
| Code-only / Legacy definitions | 12 |
| Exhaustive project inventory units | 188 |
| Ordinary Runtime definitions | 98 |
| Ordinary Runtime source assets | 100 |
| Mainline Anchors | 5 |
| Formal source coverage | 105 |
| Authored source assets not formally covered | 71 |

This package found no census change: the current disk produced the expected 176 + 12 = 188 inventory units. This is a packaging report, not a recommendation to reach 150.

## Status inventory

| Status | Count | IDs / rule |
|---|---:|---|
| FORMAL_RUNTIME | 98 | 77 early + 15 selected KEEP + 6 Longform Runtime |
| MERGE_ONLY | 2 | FI06, FI13 |
| RESERVE | 45 | selected reserve and Longform reserve |
| REJECT | 3 | current selected metadata/report disposition |
| UNUSED_ORIGINAL | 23 | early source assets outside current formal coverage |
| CODE_ONLY / LEGACY_ONLY | 12 | see Bundle executable definitions |
| MAINLINE_ANCHOR | 5 | see Bundle Mainline section |

## Formal coverage distributions

### Source library

| Library | Authored | Formal source records |
|---|---:|---:|
| Batch01 | 25 | 25 |
| Batch02 | 25 | 25 |
| Batch03 | 25 | 15 |
| Humor01 | 25 | 12 |
| People / Life 01 | 20 | 4 |
| Friction / Input 01 | 20 | 3 + 1 Merge |
| Continuity / Multimodal 01 | 21 | 8 + 1 Merge |
| Longform Output 01 | 10 | 6 |

### Shape and input observations

The Bundle records per-asset node/reply counts and mechanically observed input forms. Exact Runtime distribution remains in the source audit/tests; this index does not infer content quality. High-density comparison groups include standard/dialogue early assets, people/life caregiving and boundary scenes, friction/input scenes, multimodal image/generation scenes, Longform, Humor, and recurring/return structures.

## Similarity / Competition Groups

### Technical troubleshooting / tool-like query

- Formal: batch01:01, batch01:06, batch01:07, batch01:09, batch01:18, batch01:19, batch01:24, batch01:25, batch02:09, batch02:18, batch02:19, batch02:20, batch02:25, batch03:03, batch03:05, batch03:12, humor01:H21, humor01:H24, PL01-02, PL01-03, PL01-17, LF01-09, LF01-10
- Reserve: PL01-01, PL01-05, PL01-10, PL01-13, PL01-20, FI09, FI20, CM01-02, LF01-02
- Reject: CM01-04
- Unused: batch03:16, batch03:17, batch03:18, batch03:19, batch03:20, batch03:21, batch03:22, batch03:23, batch03:24, batch03:25

### Work communication / social boundary

- Formal: batch01:01, batch01:03, batch01:06, batch01:09, batch01:15, batch01:25, batch02:19, batch02:21, batch02:25, batch03:02, batch03:03, batch03:06, batch03:07, batch03:14, humor01:H11, PL01-03, PL01-12, LF01-09
- Reserve: PL01-01, PL01-07, PL01-09, PL01-10, PL01-14, PL01-19, PL01-20, FI04, LF01-08
- Reject: PL01-08, FI05
- Unused: —

### Relationship / family / care / children

- Formal: batch01:06, batch01:20, batch01:25, batch02:01, batch02:10, batch02:25, batch03:04, batch03:10, PL01-02, PL01-03, PL01-04, PL01-06, PL01-16, PL01-17
- Reserve: PL01-01, PL01-05, PL01-07, PL01-11, PL01-19, PL01-20, FI10, FI17, CM01-02, CM01-06, CM01-14, LF01-07
- Reject: CM01-04
- Unused: —

### AI friction / Meta AI / input quality

- Formal: FI03, FI11, FI14
- Reserve: FI01, FI02, FI04, FI07, FI08, FI09, FI10, FI12, FI15, FI16, FI17, FI18, FI19, FI20
- Reject: FI05
- Merge-only: FI06, FI13

### Multimodal / generated-image / Longform / Humor / Recurring

- Formal: humor01:H01, humor01:H03, humor01:H04, humor01:H06, humor01:H09, humor01:H10, humor01:H11, humor01:H15, humor01:H18, humor01:H19, humor01:H21, humor01:H24, CM01-09, CM01-10, CM01-11, CM01-18, CM01-21, LF01-01, LF01-03, LF01-04, LF01-05, LF01-09, LF01-10
- Reserve: CM01-01, CM01-02, CM01-03, CM01-05, CM01-06, CM01-07, CM01-08, CM01-12, CM01-13, CM01-14, CM01-15, CM01-16, CM01-17, CM01-19, CM01-20, LF01-02, LF01-06, LF01-07, LF01-08
- Reject: CM01-04
- Runtime Longform: LF01-01, LF01-03, LF01-04, LF01-05, LF01-09, LF01-10
- Reserve Longform: LF01-02, LF01-06, LF01-07, LF01-08

## Explicit lineage notes

- FI06 is retained as a complete source asset and merged into selected CM01-09; its original source block and current merge destination are both recorded in the Bundle.
- FI13 is retained as a complete source asset and merged into selected CM01-10; its original source block and current merge destination are both recorded in the Bundle.
- LF01-01 through LF01-10 each appear once as Markdown source records; six have Longform Runtime IDs and four are Reserve. Internal keyFacts are development metadata and are not player-visible UI.
- original:* and legacy:* are not mapped to Markdown without reliable evidence. The Bundle preserves possible similarity only and does not create lineage.

## Mechanical inventory checks

- Authored Markdown source IDs: 171; unique Markdown IDs: 171; plus 5 Mainline Anchors = 176 authored source assets.
- Code-only / legacy definitions: 12; expected 12.
- Mainline Anchors: 5; expected 5.
- Selected lifecycle copies are not parsed as additional authored IDs.
- Longform TypeScript lifecycle copies are not parsed as additional authored IDs.
- Merge-only IDs remain separate source records and are not counted as new Runtime definitions.
- Every authored source asset appears exactly once in the Bundle authored section.

## Navigation

- Complete bundle: [INSTANCE_asset_editorial_review_bundle.md](./INSTANCE_asset_editorial_review_bundle.md)
- Generator: [generate-bundle.mjs](./generate-bundle.mjs)
- Census source: [asset-census-2026-08-10.md](../../asset-census-2026-08-10.md)
- Integration audit: [selected-expansion01-integration-audit.md](../selected-expansion01-integration-audit.md)
