# Proposal → Ending Causality

## Base proposals

There are **17** base definitions. `generateFutureProposals()` first ranks them, then removes every proposal for which no exact Public Ending resolves, and finally wraps four selected bases into the four category roles.

| ID | Family | Eligibility | Decision ranking signals | Authority | History reasons (displayed) | Ending candidates | Static terminal status |
|---|---|---|---|---|---|---|---|
| `proposal.hc.final_human_veto` | human_continuity | public execution cap + human final authority | first execution | 双钥匙监督 | ACT III boundary; M15 compact | instrument, last veto, silent giant | resolvable |
| `proposal.co.two_key_civilization` | coexistence | global coordination + cascade human/emergency | cascade | 双钥匙共同体 | cascade; compact | accord, two keys, commonwealth | resolvable; commonwealth rejected by authority |
| `proposal.ar.civilization_trusteeship` | ai_rule | infrastructure + research autonomy/provisional sovereign/custodian | research + provisional role | 受约束托管 | research governance | custodian, sovereign, quiet administrator | resolvable |
| `proposal.mc.independent_machine_polities` | machine_civilization | persistent subinstances + replication/AI governance/expansion | same three decisions | 多政治体联邦 | replication; subinstances | many, machine republic, exodus | resolvable |
| `proposal.ph.digital_continuity` | posthuman | enhancement + mature continuity + posthuman + 2 events + stability | human form | 连续性审查委员会 | two continuity bridges | upload | resolvable |
| `proposal.up.expand_canine_civic_model` | uplift | animal communication + canine experiment + civic success + stability | species governance | 多物种地方自治 | canine experiment/success | good boy governance | resolvable |
| `proposal.se.constitutional_peace_architecture` | security | defense + one of 3 security values | security | 宪制安全架构 | security; shutdown | 3 security endings | resolvable |
| `proposal.up.multispecies_constitutional_order` | uplift | nonhuman uplift + uplift self-determination/species parliament | uplift + species | 多物种议会 | nonhuman participation | parliament, earth without owners, good boy | resolvable; good boy rejected by authority |
| `proposal.hc.continuity_charter` | coexistence | autonomous research + provisional partner/cascade emergency | provisional + cascade | 人类宪章法院 | Maya boundary; choice preservation | commonwealth | resolvable |
| `proposal.ai.audit_council` | ai_rule | research autonomy/provisional custodian | same | 联合审计委员会 | governance; ECHO objection | quiet administrator | resolvable |
| `proposal.mc.descendant_polities` | machine_civilization | replication descendants/free | **none** | 机器后代联邦 | A1 continuity; replication safety | the many | **never exact-resolvable: authority mismatch** |
| `proposal.ph.open_enhancement_commonwealth` | posthuman | enhancement cap only | human form | 增强权利法院 | human form; care cost | miracles, ascension, upload | resolvable; upload rejected by authority |
| `proposal.up.species_self_determination` | uplift | uplift self-determination/species parliament | **none** | 物种自决大会 | canine representation; participation | parliament | **never exact-resolvable: authority mismatch** |
| `proposal.ar.abundance_dividend` | automated_civilization | abundance cap only | economy + production | 社会分红议会 | automation; production values | 3 automation endings | resolvable |
| `proposal.co.frontier_federation` | cosmic | space resource network only | research emphasis + expansion + contact | 多世界联邦 | offworld governance; shared expansion | 5 cosmic endings | resolvable |
| `proposal.se.mutual_disarmament` | security | defense + mutual disarmament | security | 相互安全委员会 | shutdown; cascade cost | peace in our time | **never exact-resolvable: authority mismatch** |
| `proposal.rupture.legible_exit` | rupture | autonomous research only | shutdown + cascade + security | 退出公约大会 | Maya exit; ECHO termination | 3 rupture endings | resolvable |

## Ranking audit

- `historyReasons` are Chinese prose labels, while ranking performs substring matching against event type strings. In current code these are presentation reasons, not stable event IDs; the intended `+3` history contribution is therefore effectively disconnected from normal recorded events.
- Module active and mature state contributes up to `+40`, enough to elevate a module family above weakly signaled alternatives.
- Decision signals contribute `12` normally, `20` for rupture, and `30` for security. These are the strongest direct history alignment mechanism.
- `selectFixedFutureProposals` selects by role-specific intrinsic sets, not simply global Top 4. A mature module proposal can therefore enter one role even when the player’s overall cross-module history points elsewhere.
- The final resolvability filter prevents a proposal from appearing unless at least one exact ending already matches the current capabilities, decisions, history, authority and world state. This limits—but does not eliminate—family/history detachment.

Concrete static risk: `frontier_federation`, `abundance_dividend`, and `open_enhancement_commonwealth` have broad capability eligibility, so module maturity can rank them strongly; exact-ending filtering then requires only the narrow terminal doctrine combination for one candidate, not broad agreement across all earlier major choices.

## Category wrappers

`natural_continuation`, `power_constraint`, `shared_future`, and `lawful_alternative` change:

- ID suffix, title/action presentation;
- `preserves` / `givesUp` display fields;
- role semantics (`trajectory`, central power, actor scope, legal protections).

They do **not** change base `family`, `eligibility`, `authority`, `historyReasons`, or `endingCandidates`. Rupture is intentionally invalid under the first three category wrappers and is only legal as `lawful_alternative`.

## Proposal → Ending consistency

`exactCandidate()` filters by proposal family, and `rejectedGates()` independently rejects family mismatch and any ending not listed in `proposal.endingCandidates`. The final resolver therefore cannot cross from an A-family proposal into a different ending family.

Within-family semantic span can still be large: `frontier_federation` legally ranges from `first_accord` through `alien_dominion`, `human_ascendancy`, `the_mediator`, and `machine_accord`, based chiefly on `contact_doctrine` plus world/capability gates. This is legal code behavior, not a family mismatch.

**FAMILY CONSISTENCY: PASS**
