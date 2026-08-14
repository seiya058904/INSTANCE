# Terminal Causality Target Model

## Recommendation

Adopt a **Final Commitment → Primary Compatibility → Capped Support Score** model, with Option B for `aster_intended_role`.

The terminal chain remains:

```text
Earlier Decisions / events / capabilities / module maturity / world state
  -> structured Proposal ranking
M16 aster_intended_role
  -> soft ranking alignment, never eligibility
Four Future Proposals
  -> player-visible review and Final Commitment
Locked proposal
  -> fixes family and candidate inventory
Primary compatibility + existing hard viability gates
  -> produces legal same-family candidates
Capped support score
  -> distinguishes causally better-supported candidates
Public Ending
  -> epilogues / Key History / optional Secret overlay
```

## Non-negotiable invariants

1. `final_commitment` remains the only action that fixes the Ending family.
2. No earlier Decision, including `aster_intended_role`, independently unlocks or forces a family.
3. Family equality, proposal `endingCandidates`, authority, capability and authored bridge/history requirements remain fail-closed.
4. Supporting history cannot rescue a candidate that fails a true safety/continuity hard gate.
5. One role choice cannot decide an exact Ending by itself.
6. Each exact Ending should read one primary doctrine—or, for `the_fracture`, the existing terminal world-pressure condition—and at most three supporting domains.
7. Keep 32 Public Endings, 10 families, 4 Secrets and 17 base Proposal definitions.

## Three layers of causality

### Layer 1 — Proposal eligibility and ranking

Eligibility remains a hard statement of current feasibility. Ranking becomes entirely structured:

- primary Decision/value: weight 8;
- decisive authored event/bridge: weight 6;
- secondary Decision/value: weight 4;
- mature module: weight 5;
- active module or capability: weight 3;
- intended-role family alignment: 2–8, defined per role;
- world-state support: weight 1–2.

Cap ordinary history score per Proposal at 20 before intended-role alignment. This prevents active + mature module state from contributing the current effective +40 and overwhelming authored decisions.

### Layer 2 — Primary compatibility

After Final Commitment, only candidates in the locked proposal’s family and `endingCandidates` are considered. Each candidate keeps a primary doctrine compatibility rule. For most families this is the existing exact doctrine value. Cosmic uses small compatibility sets so reciprocal diplomacy can produce more than one legal interpretation while values such as assertion or guidance remain strongly directional.

### Layer 3 — Support score

For legal candidates only:

```text
priorityTier = normalized current priority within the family (0..4)
rawSupport = sum of at most 3 configured supporting inputs
effectiveSupport = rawSupport only when at least 2 independent support domains match; otherwise 0
resolutionScore = primaryStrength + priorityTier + min(effectiveSupport, 6)
```

- exact primary doctrine match: `primaryStrength = 4`;
- adjacent/compatible doctrine match: `primaryStrength = 2`;
- intended role contributes at most 2 to Ending support;
- deterministic tie-break: higher current priority, then stable Ending ID.

The two-domain activation rule is the guardrail: `aster_intended_role=sovereign` can support `the_sovereign`, but cannot select it without another independent political/world/history input.

## Causal explanation output

Resolution should retain a compact evidence record:

- locked proposal and family;
- primary doctrine match;
- the 1–3 supporting inputs actually counted;
- rejected candidate reasons;
- support and priority tier used for the winner.

This evidence should drive `causalReason`, Key History labels and route traces. It should not be reconstructed from prose or choice position.

## Secret Ending boundary

Keep the current public-first resolution and fixed Secret priority unchanged. The known masking order is worth a later, separately scoped Secret Pass because an earlier Secret can hide a later one that reflects broader history, but this design does not add a Secret score or alter overlay semantics.

## Complexity budget

- New hard gates: **0**.
- Existing hard gates softened or replaced: three historical-overreach uses of `cascade_authority`.
- Supporting inputs per exact Ending: **maximum 3**.
- Structured Proposal signals: explicit on all 17 definitions.
- No Story Plan, inventory, family or Secret priority change.
