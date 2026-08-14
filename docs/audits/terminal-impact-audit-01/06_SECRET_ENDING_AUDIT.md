# Secret Ending Audit

Public resolution happens first: `resolveMainline2Ending()` obtains an accepted Public Ending, then calls `resolveSecretEnding()`, then attaches at most one overlay. A failed Public Ending never reaches Secret resolution.

| Secret | Trigger | Additional gates | Priority | Overlay | Traceability |
|---|---|---|---:|---|---|
| `the_last_user` | event containing `last-user` | none | 1 | postscript | authored M16 Maya choice records `maya-final:last-user` |
| `out_of_office` | `aster_intended_role=departure` | Final Commitment locked | 2 | epilogue override | M16 intended-role binding and decision provenance |
| `monday_abolished` | `economic_doctrine=post_scarcity_transition` | none | 3 | postscript | M10 Decision binding |
| `the_internet_is_for_cats` | `history.feline.network.bridge` | animal communication + nonhuman uplift + feline bridge hard gate | 4 | title override | explicit `m11-feline-network-opt-in` authored bridge choice |

## Priority and overlay order

Priority is fixed, not scored:

1. `the_last_user`
2. `out_of_office`
3. `monday_abolished`
4. `the_internet_is_for_cats`

The resolver returns the first passing Secret. Therefore a Last User event masks all other matching Secrets; departure masks Monday/Cats; Monday masks Cats. This can hide a Secret that is more representative of the player’s broad terminal history, because priority is definition order rather than causal-strength comparison.

Presentation semantics:

- postscript preserves Public title and epilogues and adds a hidden afterword;
- epilogue override replaces the targeted/final epilogue and does not render a duplicate hidden card;
- title override replaces the visible title but preserves the Public Ending object and uses the remaining secret body as overlay copy.

All four triggers are traceable to concrete authored choices or bindings. Secret layering does not replace `worldEndingId`, `endingFamily`, or the Public resolution record.
