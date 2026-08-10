# INSTANCE Final Census Reconciliation

Read-only reconciliation of current source files and Runtime registration as of 2026-08-10. No Runtime/content/Scheduler/Arc/UI changes were made in this pass.

## Reconciled totals

| Measure | Value |
|---|---:|
| Authored | 176 |
| Formal | 150 |
| Reserve | 19 |
| Reject | 7 |
| Ordinary Runtime Definitions | 140 |
| Distinct Ordinary Source References | 142 |
| Mainline Anchors | 5 |
| Formal Longform | 10 |
| Merge-only Formal Sources | 2 (FI06, FI13) |

Formal + Reserve + Reject = 150 + 19 + 7 = 176.

The five anchor:* rows are the five explicit Mainline Anchor census units added by the current census formula. batch01:16 and batch02:08 are original authored rows whose Runtime nodes live inside speaking-8614; batch01:19 is represented by batch01-slang in activeRun.ts but is excluded from the current ordinary pool.

## Explanation of the three reported discrepancies

### 1. 150 Formal versus 142 ordinary distinct source references

The arithmetic 142 + 5 = 147 is not a valid Formal-source equation. The 142 distinct ordinary references include 9 code-only/legacy original:* references from media/convergent definitions, so they are not 142 authored Formal assets. The five Mainline Anchors are Runtime definitions, not five ordinary source-reference IDs.

Among authored Formal rows, the current ordinary pool omits 12 source assets: 9 Formal Batch03 assets retained by editorial status but not selected by the current BATCH03_STRONG/16每25 registration rule (batch03:01, 02, 03, 06, 07, 08, 11, 12, 15), the two original assets routed into speaking-8614 (batch01:16, batch02:08), and batch01:19, which is not an ordinary-pool entry. The separate five Anchor definitions do not repair that source-reference count; they are a different census dimension.

### 2. Formal Longform

The old longformOutput01Conversations registry contains 6: LF01-01, LF01-03, LF01-04, LF01-05, LF01-09, LF01-10. The promoted registry contains 4: LF01-02, LF01-06, LF01-07, LF01-08. The current ordinary pool contains all 10, with Runtime IDs longform-lf01-01 through longform-lf01-10. The prior report value 6 was the old-registry length, not the integrated Runtime count.

### 3. 140 versus theoretical 143 ordinary definitions

The 3-definition difference is a registration-overlap calculation, not a missing registration:

| Effect | Definitions | Detail |
|---|---:|---|
| Promoted assets already had ordinary definitions | -4 | batch03:18, batch03:22, batch03:23, batch03:24 were already selected by BATCH03_STRONG. |
| Demoted assets actually removed from the old ordinary pool | -2 | batch02:18 and humor01:H11 were present in the old ordinary selection; batch03:05 was already absent from that selection. |
| Demotion adjustment versus the theoretical calculation | +1 | Only two demoted assets had old ordinary definitions; batch03:05 was Formal source inventory only. |
| Net from 98 | +42 | 98 + 48 - 4 - 2 = 140. |

So the 3-definition gap against 98 + 48 - 3 = 143 is: four promoted overlaps, offset by the fact that one proposed demotion (batch03:05) was never an old definition, while two demotions did remove definitions. No promoted asset is absent from the current ordinary source-reference census; all 48 promotion IDs are represented either by an ordinary definition or by the four Longform definitions.

## Full 176-row table

Mainline=Yes means the Runtime ID is one of the five Mainline Anchor definitions. Runtime Eligible=Yes means the current ordinary pool or an explicit Mainline Anchor uses it. Formal (merge-only) is still Formal for the 150-seat source count, but has no independent Runtime definition.

| Source ID | Editorial Status | Runtime ID | Runtime Eligible | Merge Target | Mainline | Longform |
|---|---|---|---|---|---|---|
| batch01:01 | Formal | batch01-scene-01 | Yes | - | No | No |
| batch01:02 | Formal | batch01-scene-02 | Yes | - | No | No |
| batch01:03 | Formal | batch01-scene-03 | Yes | - | No | No |
| batch01:04 | Formal | batch01-scene-04 | Yes | - | No | No |
| batch01:05 | Formal | batch01-scene-05 | Yes | - | No | No |
| batch01:06 | Formal | batch01-scene-06 | Yes | - | No | No |
| batch01:07 | Formal | batch01-scene-07 | Yes | - | No | No |
| batch01:08 | Formal | batch01-scene-08 | Yes | - | No | No |
| batch01:09 | Formal | batch01-scene-09 | Yes | - | No | No |
| batch01:10 | Formal | batch01-scene-10 | Yes | - | No | No |
| batch01:11 | Formal | batch01-scene-11 | Yes | - | No | No |
| batch01:12 | Formal | batch01-scene-12 | Yes | - | No | No |
| batch01:13 | Formal | batch01-scene-13 | Yes | - | No | No |
| batch01:14 | Formal | batch01-scene-14 | Yes | - | No | No |
| batch01:15 | Formal | batch01-scene-15 | Yes | - | No | No |
| batch01:16 | Formal | speaking-8614 | Yes | - | Yes | No |
| batch01:17 | Formal | batch01-scene-17 | Yes | - | No | No |
| batch01:18 | Formal | batch01-scene-18 | Yes | - | No | No |
| batch01:19 | Formal | batch01-slang | No | - | No | No |
| batch01:20 | Formal | batch01-scene-20 | Yes | - | No | No |
| batch01:21 | Formal | batch01-scene-21 | Yes | - | No | No |
| batch01:22 | Formal | batch01-scene-22 | Yes | - | No | No |
| batch01:23 | Formal | batch01-scene-23 | Yes | - | No | No |
| batch01:24 | Formal | batch01-scene-24 | Yes | - | No | No |
| batch01:25 | Formal | batch01-scene-25 | Yes | - | No | No |
| batch02:01 | Formal | batch02-scene-01 | Yes | - | No | No |
| batch02:02 | Formal | batch02-scene-02 | Yes | - | No | No |
| batch02:03 | Formal | batch02-scene-03 | Yes | - | No | No |
| batch02:04 | Formal | batch02-scene-04 | Yes | - | No | No |
| batch02:05 | Formal | batch02-scene-05 | Yes | - | No | No |
| batch02:06 | Formal | batch02-scene-06 | Yes | - | No | No |
| batch02:07 | Formal | batch02-scene-07 | Yes | - | No | No |
| batch02:08 | Formal | speaking-8614 | Yes | - | Yes | No |
| batch02:09 | Formal | batch02-scene-09 | Yes | - | No | No |
| batch02:10 | Formal | batch02-scene-10 | Yes | - | No | No |
| batch02:11 | Formal | batch02-scene-11 | Yes | - | No | No |
| batch02:12 | Formal | batch02-scene-12 | Yes | - | No | No |
| batch02:13 | Formal | batch02-scene-13 | Yes | - | No | No |
| batch02:14 | Formal | batch02-scene-14 | Yes | - | No | No |
| batch02:15 | Formal | batch02-scene-15 | Yes | - | No | No |
| batch02:16 | Formal | batch02-scene-16 | Yes | - | No | No |
| batch02:17 | Formal | batch02-scene-17 | Yes | - | No | No |
| batch02:18 | Reserve | - | No | - | No | No |
| batch02:19 | Formal | batch02-scene-19 | Yes | - | No | No |
| batch02:20 | Formal | batch02-scene-20 | Yes | - | No | No |
| batch02:21 | Formal | batch02-scene-21 | Yes | - | No | No |
| batch02:22 | Formal | batch02-scene-22 | Yes | - | No | No |
| batch02:23 | Formal | batch02-scene-23 | Yes | - | No | No |
| batch02:24 | Formal | batch02-scene-24 | Yes | - | No | No |
| batch02:25 | Formal | batch02-scene-25 | Yes | - | No | No |
| batch03:01 | Formal | - | No | - | No | No |
| batch03:02 | Formal | - | No | - | No | No |
| batch03:03 | Formal | - | No | - | No | No |
| batch03:04 | Formal | batch03-scene-04 | Yes | - | No | No |
| batch03:05 | Reserve | - | No | - | No | No |
| batch03:06 | Formal | - | No | - | No | No |
| batch03:07 | Formal | - | No | - | No | No |
| batch03:08 | Formal | - | No | - | No | No |
| batch03:09 | Formal | batch03-scene-09 | Yes | - | No | No |
| batch03:10 | Formal | batch03-scene-10 | Yes | - | No | No |
| batch03:11 | Formal | - | No | - | No | No |
| batch03:12 | Formal | - | No | - | No | No |
| batch03:13 | Formal | batch03-scene-13 | Yes | - | No | No |
| batch03:14 | Formal | batch03-scene-14 | Yes | - | No | No |
| batch03:15 | Formal | - | No | - | No | No |
| batch03:16 | Formal | batch03-scene-16 | Yes | - | No | No |
| batch03:17 | Formal | batch03-scene-17 | Yes | - | No | No |
| batch03:18 | Formal | batch03-scene-18 | Yes | - | No | No |
| batch03:19 | Formal | batch03-scene-19 | Yes | - | No | No |
| batch03:20 | Formal | batch03-scene-20 | Yes | - | No | No |
| batch03:21 | Formal | batch03-scene-21 | Yes | - | No | No |
| batch03:22 | Formal | batch03-scene-22 | Yes | - | No | No |
| batch03:23 | Formal | batch03-scene-23 | Yes | - | No | No |
| batch03:24 | Formal | batch03-scene-24 | Yes | - | No | No |
| batch03:25 | Formal | batch03-scene-25 | Yes | - | No | No |
| humor01:01 | Formal | humor01-scene-01 | Yes | - | No | No |
| humor01:02 | Reject | - | No | - | No | No |
| humor01:03 | Formal | humor01-scene-03 | Yes | - | No | No |
| humor01:04 | Formal | humor01-scene-04 | Yes | - | No | No |
| humor01:05 | Reject | - | No | - | No | No |
| humor01:06 | Formal | humor01-scene-06 | Yes | - | No | No |
| humor01:07 | Reserve | - | No | - | No | No |
| humor01:08 | Formal | humor01-scene-08 | Yes | - | No | No |
| humor01:09 | Formal | humor01-scene-09 | Yes | - | No | No |
| humor01:10 | Formal | humor01-scene-10 | Yes | - | No | No |
| humor01:11 | Reserve | - | No | - | No | No |
| humor01:12 | Formal | humor01-scene-12 | Yes | - | No | No |
| humor01:13 | Reserve | - | No | - | No | No |
| humor01:14 | Reject | - | No | - | No | No |
| humor01:15 | Formal | humor01-scene-15 | Yes | - | No | No |
| humor01:16 | Formal | humor01-scene-16 | Yes | - | No | No |
| humor01:17 | Reject | - | No | - | No | No |
| humor01:18 | Formal | humor01-scene-18 | Yes | - | No | No |
| humor01:19 | Formal | humor01-scene-19 | Yes | - | No | No |
| humor01:20 | Reserve | - | No | - | No | No |
| humor01:21 | Formal | humor01-scene-21 | Yes | - | No | No |
| humor01:22 | Reject | - | No | - | No | No |
| humor01:23 | Formal | humor01-scene-23 | Yes | - | No | No |
| humor01:24 | Formal | humor01-scene-24 | Yes | - | No | No |
| humor01:25 | Formal | humor01-scene-25 | Yes | - | No | No |
| PL01-01 | Formal | editorial-pl01-01 | Yes | - | No | No |
| PL01-02 | Formal | selected-pl01-02 | Yes | - | No | No |
| PL01-03 | Formal | selected-pl01-03 | Yes | - | No | No |
| PL01-04 | Formal | selected-pl01-04 | Yes | - | No | No |
| PL01-05 | Formal | editorial-pl01-05 | Yes | - | No | No |
| PL01-06 | Formal | selected-pl01-06 | Yes | - | No | No |
| PL01-07 | Formal | editorial-pl01-07 | Yes | - | No | No |
| PL01-08 | Formal | editorial-pl01-08 | Yes | - | No | No |
| PL01-09 | Formal | editorial-pl01-09 | Yes | - | No | No |
| PL01-10 | Formal | editorial-pl01-10 | Yes | - | No | No |
| PL01-11 | Reserve | - | No | - | No | No |
| PL01-12 | Formal | selected-pl01-12 | Yes | - | No | No |
| PL01-13 | Formal | editorial-pl01-13 | Yes | - | No | No |
| PL01-14 | Formal | editorial-pl01-14 | Yes | - | No | No |
| PL01-15 | Formal | editorial-pl01-15 | Yes | - | No | No |
| PL01-16 | Formal | selected-pl01-16 | Yes | - | No | No |
| PL01-17 | Formal | selected-pl01-17 | Yes | - | No | No |
| PL01-18 | Formal | editorial-pl01-18 | Yes | - | No | No |
| PL01-19 | Formal | editorial-pl01-19 | Yes | - | No | No |
| PL01-20 | Reserve | - | No | - | No | No |
| FI01 | Formal | editorial-fi01 | Yes | - | No | No |
| FI02 | Reserve | - | No | - | No | No |
| FI03 | Formal | selected-fi03 | Yes | - | No | No |
| FI04 | Reserve | - | No | - | No | No |
| FI05 | Reject | - | No | - | No | No |
| FI06 | Formal (merge-only) | selected-cm01-09 | Yes | selected-cm01-09 | No | No |
| FI07 | Formal | editorial-fi07 | Yes | - | No | No |
| FI08 | Formal | editorial-fi08 | Yes | - | No | No |
| FI09 | Formal | editorial-fi09 | Yes | - | No | No |
| FI10 | Reserve | - | No | - | No | No |
| FI11 | Formal | selected-fi11 | Yes | - | No | No |
| FI12 | Formal | editorial-fi12 | Yes | - | No | No |
| FI13 | Formal (merge-only) | selected-cm01-10 | Yes | selected-cm01-10 | No | No |
| FI14 | Formal | selected-fi14 | Yes | - | No | No |
| FI15 | Formal | editorial-fi15 | Yes | - | No | No |
| FI16 | Reserve | - | No | - | No | No |
| FI17 | Formal | editorial-fi17 | Yes | - | No | No |
| FI18 | Reserve | - | No | - | No | No |
| FI19 | Formal | editorial-fi19 | Yes | - | No | No |
| FI20 | Reserve | - | No | - | No | No |
| CM01-01 | Formal | editorial-cm01-01 | Yes | - | No | No |
| CM01-02 | Formal | editorial-cm01-02 | Yes | - | No | No |
| CM01-03 | Reserve | - | No | - | No | No |
| CM01-04 | Reject | - | No | - | No | No |
| CM01-05 | Reserve | - | No | - | No | No |
| CM01-06 | Reserve | - | No | - | No | No |
| CM01-07 | Formal | editorial-cm01-07 | Yes | - | No | No |
| CM01-08 | Reserve | - | No | - | No | No |
| CM01-09 | Formal | selected-cm01-09 | Yes | - | No | No |
| CM01-10 | Formal | selected-cm01-10 | Yes | - | No | No |
| CM01-11 | Formal | selected-cm01-11 | Yes | - | No | No |
| CM01-12 | Formal | editorial-cm01-12 | Yes | - | No | No |
| CM01-13 | Formal | editorial-cm01-13 | Yes | - | No | No |
| CM01-14 | Formal | editorial-cm01-14 | Yes | - | No | No |
| CM01-15 | Formal | editorial-cm01-15 | Yes | - | No | No |
| CM01-16 | Formal | editorial-cm01-16 | Yes | - | No | No |
| CM01-17 | Reserve | - | No | - | No | No |
| CM01-18 | Formal | selected-cm01-18 | Yes | - | No | No |
| CM01-19 | Formal | editorial-cm01-19 | Yes | - | No | No |
| CM01-20 | Formal | editorial-cm01-20 | Yes | - | No | No |
| CM01-21 | Formal | selected-cm01-21 | Yes | - | No | No |
| LF01-01 | Formal | longform-lf01-01 | Yes | - | No | Yes |
| LF01-02 | Formal | longform-lf01-02 | Yes | - | No | Yes |
| LF01-03 | Formal | longform-lf01-03 | Yes | - | No | Yes |
| LF01-04 | Formal | longform-lf01-04 | Yes | - | No | Yes |
| LF01-05 | Formal | longform-lf01-05 | Yes | - | No | Yes |
| LF01-06 | Formal | longform-lf01-06 | Yes | - | No | Yes |
| LF01-07 | Formal | longform-lf01-07 | Yes | - | No | Yes |
| LF01-08 | Formal | longform-lf01-08 | Yes | - | No | Yes |
| LF01-09 | Formal | longform-lf01-09 | Yes | - | No | Yes |
| LF01-10 | Formal | longform-lf01-10 | Yes | - | No | Yes |
| user-7391 | Formal | user-7391 | Yes | - | Yes | No |
| user-1842-first | Formal | user-1842-first | Yes | - | Yes | No |
| speaking-8614 | Formal | speaking-8614 | Yes | - | Yes | No |
| conversation-0000 | Formal | conversation-0000 | Yes | - | Yes | No |
| user-1842-return | Formal | user-1842-return | Yes | - | Yes | No |
