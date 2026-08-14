# Proposal History Signal Schema

## Problem

`historyReasons` is natural Chinese presentation copy. Ranking currently joins event type strings and performs substring matching against those prose reasons, so the intended history score is effectively disconnected. A second parallel map, `proposalDecisionSignals`, partially restores mechanics but is incomplete and cannot represent event, capability, module maturity or world-state evidence uniformly.

## Recommended schema

```ts
interface FutureProposalDefinition {
  // existing presentation
  historyReasons: string[]

  // new mechanics; required for every base proposal
  historySignals: HistorySignal[]
}

type HistorySignal =
  | { id: string; type: 'decision'; decisionId: DecisionId; equals: string; weight: SignalWeight; reasonIndex: number }
  | { id: string; type: 'event'; eventPrefix: string; weight: SignalWeight; reasonIndex: number }
  | { id: string; type: 'capability'; flagId: string; weight: SignalWeight; reasonIndex: number }
  | { id: string; type: 'module'; moduleId: ModuleId; state: 'active' | 'mature'; weight: SignalWeight; reasonIndex: number }
  | { id: string; type: 'world'; axis: WorldAxisName; op: 'gte' | 'lte'; value: number; weight: SignalWeight; reasonIndex: number }

type SignalWeight = 1 | 2 | 3 | 4 | 5 | 6 | 8
```

`reasonIndex` links mechanics to existing player-facing prose without parsing it. One reason may have several structured signals, but ranking evidence must list which exact signal matched.

## Weight policy

- 8: primary authored Decision alignment;
- 6: decisive authored bridge/event;
- 4: secondary Decision alignment;
- 5: mature module;
- 3: active module or capability;
- 1–2: world-state support.

Cap total `historySignals` contribution at 20. Apply intended-role ranking afterward so self-authorship remains visible but cannot erase feasibility/history.

## Migration

1. Add the type and evaluator without changing existing display copy.
2. Populate `historySignals` on **all 17** base Proposal definitions. Do not leave optional silent fallbacks.
3. Move every entry from `proposalDecisionSignals` into the owning Proposal.
4. Encode real event prefixes for continuity, canine civic success, M15 convention, offworld maturity and similar bridges.
5. Replace module +20/+20 with active +3 / mature +5 structured signals.
6. Delete prose substring ranking and the separate decision-signal map after parity fixtures exist.
7. Validate unique signal IDs, valid canonical values, valid `reasonIndex`, permitted weights and at least one signal per Proposal.

## Presentation

M16/M17 continues showing `historyReasons`. Clarification may append a compact “本轮实际命中” list derived from matched structured signals. Unmatched prose reasons remain descriptive context but must not be claimed as a mechanical ranking cause.
