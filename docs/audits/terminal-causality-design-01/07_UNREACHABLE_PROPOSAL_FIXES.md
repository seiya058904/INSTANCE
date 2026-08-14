# Unreachable Proposal Fixes

Keep all 17 base Proposal definitions.

## `proposal.mc.descendant_polities`

Current mismatch:

- Proposal authority: `机器后代联邦`.
- Only candidate: `the_many`.
- Ending authority gate: `多政治体联邦`.

### Preferred Fix — FIX ENDING AUTHORITY GATE

Allow `the_many` authority requirement to accept `多政治体联邦|机器后代联邦`.

Reason: The Many describes durable machine plurality. A federation constituted specifically by machine descendants is a semantically valid subtype, and changing the Proposal authority would erase the distinction between independent current polities and recognized descendants. Keep `the_many` primary replication/plurality requirements unchanged.

## `proposal.up.species_self_determination`

Current mismatch:

- Proposal authority: `物种自决大会`.
- Candidate: `parliament_of_species`.
- Ending authority gate: `多物种议会`.

### Preferred Fix — REPURPOSE

Change the Proposal candidate to `earth_without_owners`, then allow that Ending’s authority gate to accept `多物种议会|物种自决大会`.

Reason: `species_self_determination` and its existing `uplift_doctrine=species_self_determination` eligibility align more directly with Earth Without Owners than with a parliamentary institutional form. `parliament_of_species` remains the endpoint for the constitutional-order Proposal. This preserves two distinct uplift political philosophies instead of renaming one authority to imitate the other.

## `proposal.se.mutual_disarmament`

Current mismatch:

- Proposal authority: `相互安全委员会`.
- Candidate: `peace_in_our_time`.
- Ending authority gate: `宪制安全架构`.

### Preferred Fix — FIX ENDING AUTHORITY GATE

Allow `peace_in_our_time` to accept `宪制安全架构|相互安全委员会`.

Reason: the committee is a plausible implementing institution inside a constitutional security architecture. Keeping its name makes the focused mutual-disarmament Proposal meaningfully different from the broad constitutional-peace Proposal. The security doctrine, defense capability and stability requirements continue to prevent a name-only shortcut.

## Required proof in a future implementation

Each repaired Proposal needs a positive legal route and a negative authority/primary-doctrine fixture. The full 17-definition inventory must have at least one exact-resolvable state without making every candidate universally compatible.
