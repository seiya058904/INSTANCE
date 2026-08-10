# INSTANCE 150 Runtime Final Integration Audit

Date: 2026-08-10

## Final editorial accounting

| Status | Count | Handling |
|---|---:|---|
| Formal | 150 | Runtime-eligible source inventory after the three demotions and 48 promotions |
| Reserve | 19 | Preserved in source inventory, excluded from ordinary runtime selection |
| Reject | 7 | Preserved in editorial census, excluded from ordinary runtime selection |
| Authored source total | 176 | 150 + 19 + 7 |
| Code-only / legacy | 12 | Kept separate; never used to fill the 150 authored-source seats |
| Project inventory | 188 | 176 authored + 12 code-only / legacy |

The three demotions are `batch03:05`, `batch02:18`, and `humor01:H11`; they were returned to Reserve rather than deleted. The seven Reject references remain outside runtime. `FI06` and `FI13` remain merge-only and are not promoted as independent authored source seats. The five mainline Anchors remain separate from the ordinary source pool.

## 48 promoted source references

- Batch03: `batch03:16` through `batch03:25` (10)
- Humor: `humor01:H08`, `humor01:H12`, `humor01:H16`, `humor01:H23`, `humor01:H25` (5)
- People / Life: `PL01-01`, `PL01-05`, `PL01-07`, `PL01-08`, `PL01-09`, `PL01-10`, `PL01-13`, `PL01-14`, `PL01-15`, `PL01-18`, `PL01-19` (11)
- Friction / Input: `FI01`, `FI07`, `FI08`, `FI09`, `FI12`, `FI15`, `FI17`, `FI19` (8)
- Continuity / Multimodal: `CM01-01`, `CM01-02`, `CM01-07`, `CM01-12`, `CM01-13`, `CM01-14`, `CM01-15`, `CM01-16`, `CM01-19`, `CM01-20` (10)
- Longform: `LF01-02`, `LF01-06`, `LF01-07`, `LF01-08` (4)

`PL01-08` is repaired around freelancer revision rounds, scope change, and additional fees. `FI07` preserves the constraint-violation branch. `CM01-18`, `PL01-10`, `PL01-18`, and `PL01-19` received the specified content repairs. The selected-expansion copies for `PL01-02` and `CM01-18` were kept behaviorally aligned with those repairs.

## Runtime census

The executable census reports:

- ordinary runtime conversation definitions: 140
- ordinary runtime nodes: 326
- ordinary runtime choices: 1,223
- distinct ordinary source references: 142
- mainline Anchors: 5
- integrated Longform conversations: 6, with 4 formerly reserved Longform assets promoted
- active legacy manifest definitions: 18

The 140 runtime definitions are not a second asset count: selected/runtime copies and merged assets are lineage-preserving representations of the 150 Formal source seats. The authored-source arithmetic is the authoritative 150 / 19 / 7 result.

## LongInputPreview

`LongInputPreview` is now available on both `StoryNode` and `HistoryEntry`. It stores only a truthful preview contract: kind, estimated length, optional title, opening excerpt, optional structure, and internal `keyFacts`. The UI renders a collapsed card with the opening and structure; `keyFacts` are persisted for continuity but are not rendered as user-visible text. `commitChoice` clones the preview into stable history, and save/restore round-trips it.

The DEV-only browser fixture `?qaLongInput=1` was used to verify the real rendered card without changing production selection behavior.

## Verification evidence

- `npm test -- --run`: 23 test files passed, 127 tests passed.
- `npm run build`: passed; Vite emitted only the existing large-chunk warning for the single 798.92 kB minified JS bundle.
- Browser smoke: local app loaded at `http://127.0.0.1:4173/`; a candidate response was selected and the next user turn appeared.
- Browser LongInput flow: `?qaLongInput=1` rendered the collapsed `已粘贴会议转写 · 约 7,800 字 · 已折叠` card; expanding it showed title, opening excerpt, and structure while keeping `keyFacts` absent from the DOM.
- Storage coverage: long-input preview save/restore test passed, including preserved `keyFacts`.
- Git: this workspace is not a Git repository, so no commit, branch, or remote-state claim applies.

## Remaining notes

The current ordinary runtime pool contains lineage-preserving representations rather than one unique runtime definition per Formal source seat. Code-only / legacy assets remain separate from the authored census. No new Conversation source assets were created.
