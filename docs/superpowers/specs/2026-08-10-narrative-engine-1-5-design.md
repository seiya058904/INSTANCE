# Narrative Engine 1.5 Design

## Scope

This increment keeps the existing Web-native runtime and content format working while adding the smallest structural contracts needed for larger content sets. It does not add Scheduler v2, Manifest v2, a graph viewer, a random-run simulator, a DSL, a broad directory migration, or a full content rewrite.

## Design

- Node IDs remain authored and stable. Parsed choices receive deterministic IDs derived from their node ID and normalized authored text, so reordering choices does not change their identity.
- A central Flag Registry defines known flags and `run`/`persistent` scope. Existing string flags remain accepted through a compatibility adapter; new validation reports unknown flags and scope violations.
- Conditions use only `all`, `any`, and `none` groups over registered predicates: flag, attribute, run count, ending completion, seen node, and selected choice. Registered pure predicates are an extension point but are not required by current content.
- Mutations use only `flag.set`, `flag.clear`, `attribute.add`, `attribute.set`, `arc.add`, and `event.record`. Runtime-owned visit, choice-selection, and ending-completion state is updated by `commitChoice` and is not authored as a mutation.
- Existing `ChoiceEffects` fields are preserved as legacy input. The runtime applies explicit structured mutations first, then the legacy fields, keeping save and vertical-slice behavior compatible.
- Validation reports duplicate IDs, missing references, unknown flags/attributes/arcs, malformed conditions and mutations, no-exit nodes, missing ending exits, and unreachable nodes. It remains conservative about complex conditional reachability.

## Compatibility and verification

The save version remains 2. New runtime-owned arrays are optional on restored saves and default empty. Existing fixed-seed manifests, endings, history entries, and restore behavior are covered by characterization tests. The current workspace has no Git metadata and currently reports 97/97 tests passing; the seven RED tests mentioned in the older audit are not present in this checkout and are not modified or bypassed.
