# selected_expansion01 Final Integration Audit

Date: 2026-08-10

## Decision

The selected expansion was not registered wholesale. The final P1 pass keeps 15 of 25 P1 Conversations in the formal ordinary pool:

`PL01-02`, `PL01-03`, `PL01-04`, `PL01-06`, `PL01-12`, `PL01-16`, `PL01-17`, `FI03`, `FI11`, `FI14`, `CM01-09`, `CM01-10`, `CM01-11`, `CM01-18`, `CM01-21`.

These add 43 Nodes and 151 Choices. Their IDs are namespaced as `selected-<source-ref>` and are selected through the existing manifest scorer.

## P1 dispositions

- KEEP: 15
- MERGE: `FI06`
- RESERVE: `PL01-07`, `PL01-09`, `PL01-14`, `PL01-19`, `FI08`, `FI15`, `CM01-07`, `CM01-12`, `CM01-13`
- REJECT: 0

The P1 RESERVE decisions are density decisions, not quality judgments. They remain in the editorial source and typed audit metadata but are absent from Runtime.

## P2 boundary

All nine P2 records remain outside Runtime. `FI13` is marked MERGE for its three-node correction structure; the other eight remain RESERVE. No P2 Conversation receives a formal Runtime ID in this pass.

## Semantic corrections preserved

- `FI03` records speech transcription as an input issue and does not count it as an Aster model error.
- Quoted prior Aster errors and another AI's answer are not counted as current Aster model errors.
- Existing Runtime model-error metadata remains limited to authored Aster output failures.
- `CM01-18` uses the refined ordinary-life wording without counseling or literary interpretation.

## Live Runtime snapshot after integration

From `runtimeRealityPass.test.ts` and `crossRunAudit.test.ts`:

- Ordinary pool: 92 Conversations, 203 Nodes, 753 Choices.
- Standard-question: 26/92 = 0.283.
- Message-burst Conversations: 7; true correction count: 14.
- Five-run replay audit: 0 exact overlap with each previous run and 0 overlap with the previous two runs in the verified samples.
- All 10 topic categories remain represented in the five-run samples.

## Verification

- `npm test -- --run`: 18 test files, 113 tests passed.
- `npm run build`: passed; Vite emitted only the existing large-chunk warning.
- Browser walk-through on the Aster app at port 5175: deterministic run `qaRun=selected-expansion-01` opened `还是昨天那个`, a newly integrated `CM01-10` Conversation, and the first choice advanced to its next authored node.
- Browser console: no error or warning entries observed.
- Git checks: unavailable because this directory is not a Git worktree.

## Not covered

P2 has not been promoted, MERGE ideas have not received standalone IDs, and no broad browser coverage of all 15 new Conversations was performed in this pass.
