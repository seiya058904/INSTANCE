# Route Capture Audit

## Verdict

The reported “first available M17 choice recorded as Final Commitment” bug is **not present in the current script**.

## What current code records

- `runMainline2Route()` has a dedicated M17 branch that finds `proposalKind === 'commitment'` **and** `proposalId === routeProposalId` before the generic `scene.choices[0]` fallback.
- Every selected link stores actual `choiceId`, `choiceText`, `proposalKind`, and `proposalId` before `commitChoice()`.
- `generate-mainline2-route-traces.ts` builds steps from those selected links, then locates `steps.find(step => step.proposalKind === 'commitment')`.
- The exported `finalCommitment` object is therefore the actual selected M17 commitment link, not the first available choice.

## Why the old failure mode was plausible

M17 choices are dynamically generated and ordered from retained proposals. Any capture implementation that labels `scene.choices[0]` as “Final Commitment,” or that substitutes `target.proposalId`, can disagree with the player after clarification, rejection, recovery, or category wrapping. `selectedProposalId` is also not the lock authority: it describes proposal review state and is not itself set by the commitment mutation.

## Reliable source of truth

Use these invariants together:

1. `run.finalCommitmentLocked === true`.
2. `run.decisions.final_commitment` — canonical locked proposal ID written by `commitChoice()`.
3. Actual M17 history/trace choice from source `ML2-A5-M17-COMMIT-01`, whose choice ID is `m17-commit-<proposalId>` and whose runtime choice metadata carries the same `proposalId`.
4. `ending.resolution.proposalId` must equal `run.decisions.final_commitment`.
5. `ending.worldEndingId` must be an accepted candidate for that exact proposal.

`selectedProposalId` and route target input are supporting diagnostics, not terminal authority.

## Minimal fix for any older capture script

Find the actual selected link where `proposalKind === 'commitment'`; record its `proposalId`; assert `finalCommitmentLocked`; assert equality with `run.decisions.final_commitment` and `ending.resolution.proposalId`; fail closed if any value differs. Do not infer commitment from scene position, display label, target proposal, or first available choice.
