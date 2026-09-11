# Issue #13: Contact route verification

Product decision: https://github.com/seiya058904/INSTANCE/issues/13#issuecomment-5631351558

## Contract and source of truth

`contactPolicy.registry.json` defines the resource flag, exact anomaly event and the OR of frontier-science emphasis / interstellar commitment. Runtime and module selection consume the shared predicates; the Story Map generator reads that same declaration. The separate explicit canonical node mapping recognizes already-entered checkpoints, including CONTACT-01 before a choice. NOCONTACT is excluded.

The authored library now contains 331 assets. NOCONTACT is an expression choice with no effects, used once as the unavailable chapter transition. Successful contact still ends with CLOSE-01. Other Contact calendar positions become ordinary conversations when unavailable. Active Contact is retained within the existing four-module limit; encountered Contact requires actual canonical entry.

## Verification

- Four real new-run decision combinations reached the expected entry, continued through Security and to final commitment. No mid-route state edits were used for these paths.
- Predicate tests separately cover missing resource capability, missing seed and a near-match event name.
- Pre-entry save/restore preserves both outcomes. Compatibility fixtures cover CONTACT-01 before the first choice and after a submitted Contact choice, with decisions that do not satisfy the new gate. These fixtures test migration continuity, not new-run reachability.
- Saving/restoring after NOCONTACT does not activate Contact or create a Contact doctrine.
- Successful scheduled Contact nodes are checked against the explicit continuity map. Existing ending gates require contact-doctrine history for the alien-contact outcomes. No M15 external-observer asset is in the fixed calendar; no new late-scene exception was required.
- Full suite: 66 files / 466 tests passed. Production build, including both TypeScript checks, passed with the existing Vite large-chunk warning. `git diff --check` passed.
- Explicitly regenerated the committed real route traces and Story Map. The previous committed traces/map were known to lag their generator, so the regenerated artifact diff includes that existing drift as well as the new conditional paths. Generation validation passed; this is selected-route evidence, not whole-graph reachability proof.

## Independent M15 finding (not fixed here)

Fresh real route traces reach `a4m15-zl-reckoning-001` at slot 176. Calling real `commitChoice` for each of its four choices resolves to `a4m15-lsh-last-001` in `ml2-authored-ml2-a4-m15-lsh-02` at slot 177, not `a4m15-zl-reckoning-002`.

Evidence: `mainline2-route-traces.json`, node `a4m15-zl-reckoning-001`, each choice's `nextDestinations`. The authored second node remains present. This independent multi-node continuation problem is deliberately not changed or encoded as desired behavior in regression tests, and no additional Issue was created.

## Delivery boundary

Local verification only: the current workflow has no pull_request trigger. No merge, main update, or deployment was performed.
