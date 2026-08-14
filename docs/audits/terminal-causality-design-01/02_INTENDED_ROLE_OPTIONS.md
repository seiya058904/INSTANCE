# Intended Role Options

## Option A — Ranking Only

`aster_intended_role` adds soft family/proposal ranking weights and never enters exact Ending resolution.

| Intended role | Proposal ranking alignment |
|---|---|
| advisor | human_continuity +8; coexistence +6; security +4 |
| partner | coexistence +8; uplift +4; cosmic +4 |
| citizen | coexistence +7; uplift +5; posthuman +3 |
| coordinator | cosmic +8; automated_civilization +6; coexistence +4 |
| custodian | ai_rule +8; security +6; coexistence +2 |
| governor | ai_rule +8; automated_civilization +6; security +3 |
| sovereign | ai_rule +7; machine_civilization +7; rupture +3 |
| departure | rupture +8; machine_civilization +6; cosmic +6 |
| other | `legible_exit` +6; `audit_council` +3; `continuity_charter` +3; suppress generic family bias |

Advantages: smallest mechanical surface, maximal choice freedom, low reachability risk. Disadvantage: after the player commits to a different proposal, M16 again becomes mostly invisible at exact Ending resolution.

## Option B — Ranking + Within-Family Influence

Apply Option A’s ranking matrix, then allow intended role to contribute at most 2 points to the same-family support score.

Suggested exact-ending affinities:

| Intended role | Strong support targets | Secondary targets |
|---|---|---|
| advisor | `the_silent_giant`, `the_last_veto` | `peace_in_our_time` |
| partner | `the_accord`, `the_commonwealth`, `the_mediator` | `parliament_of_species` |
| citizen | `the_commonwealth`, `parliament_of_species` | `age_of_miracles` |
| coordinator | `the_mediator`, `first_accord`, `the_quiet_administrator` | `perfect_administration` |
| custodian | `the_custodian`, `machine_protectorate` | `fortress_earth` |
| governor | `the_quiet_administrator`, `perfect_administration` | `machine_protectorate` |
| sovereign | `the_sovereign`, `machine_republic`, `machine_accord` | `control_lost` |
| departure | `exodus`, `the_fracture` | `machine_accord` |
| other | `the_fracture`, `control_lost` | any committed lawful-alternative Ending |

Rules:

- role support is not an eligibility predicate;
- role support is ignored unless one other independent support domain also matches;
- role support cannot cross the locked proposal family;
- `departure` continues to trigger `out_of_office` under existing Secret rules, independently of Public support.

Advantages: makes self-authorship mechanically visible without replacing Final Commitment; improves within-family diversity. Risks: resolver and route fixtures need score evidence and deterministic tie tests.

## Option C — Narrative Echo Only + Limited Mechanics

- ranking alignment reduced to primary +4 / secondary +2;
- no exact Ending support;
- all nine values receive distinct M17 closing framing, Key History causal reasons and long-term Aster role epilogues;
- `departure` retains its existing Secret and Maya off-world variant.

Advantages: lowest resolver risk and test cost, strongest player-facing copy improvement. Disadvantage: most intended-role values still have no executable effect after Final Commitment.

## Comparison

| Criterion | A | B | C |
|---|---|---|---|
| Causal feeling | medium | **high** | medium in prose, low in mechanics |
| Player freedom | very high | **high** | very high |
| Implementation risk | low | medium | low |
| Test cost | low | medium-high | low-medium |
| Ending diversity | medium | **high** | unchanged |
| Fixes weight mismatch | partial | **yes** | partial |

## Recommendation

Choose **Option B**. It is the only option that gives M16 a durable terminal role while preserving the player’s right to commit to any displayed proposal. The two-domain support rule prevents the prohibited shortcut “sovereign therefore AI Rule.”
