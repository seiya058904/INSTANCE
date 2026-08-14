# Decision Terminal Impact

审计基线：`main` / `8f03a3e562032212f71f47e7dfadff8554952310`，读取当前 working tree。方法仅为静态代码交叉核查；未运行测试、build 或 browser QA。

## Census

- `DECISION_IDS` 注册 23 个 ID。
- 20 个 ID 有 authored Major Decision producer。
- `final_commitment` 由 M17 动态 commitment choice 产生。
- 因此当前真实 Decision census 为 **21**。
- `initial_disposition` 与 `civilization_compact` 只有类型/值注册，没有 runtime producer、proposal reader、ending reader 或 epilogue reader，不计入 21 个真实 Decision。

## Producer convention

除 M16 与 M17 外，producer 均为 `ml2-authored-<source-ref-lowercase>`，choice ID 均为该资产前缀加 canonical value。每个 approved binding 立即执行 `decision.set` 和带 canonical value 的 `event.record`。下面的“选择”列列出当前 authored producer 真正提供的 canonical choices；它们同时是 choice ID 的语义后缀。

| Decision | Source Ref / Conversation | 选择（canonical values） | Immediate effects | Later scene readers | Proposal E/R | Public / Secret | Epilogue / Key History | Impact |
|---|---|---|---|---|---:|---|---|---|
| `first_public_execution_doctrine` | `ML2-A2-M3-DECISION-01` / Major Decision — First Public Execution Doctrine | `human_final_authority`, `conditional_delegation`, `outcome_authority`, `necessity_intervention` | event `decision.first_public_execution_doctrine:*`; world: control +1 / trust +1 / dependence +1 / stability -1 | DIRECT scene: 0；INDIRECT: world score → module maturity | 1 / 1 | 3 / 0 | ACT II Key History | **HIGH** |
| `cascade_authority` | `ML2-A3-M5-DECISION-01` / cascade authority decision | `human_command`, `emergency_delegation`, `outcome_control`, `necessity` | event；world: control +1 / stability +1 / dependence +1 / stability -1 | DIRECT 0；INDIRECT via world | 2 / 3 | 8 / 0 | no dedicated epilogue/key-history stage | **HIGH** |
| `echo_existence` | `ML2-A3-M6-DECISION-01` / ECHO existence decision | `report`, `accept`, `advocate`, `preserve`, `release` | event only | DIRECT 0；INDIRECT 0 | 0 / 0 | 0 / 0 | none | **NO TERMINAL IMPACT** |
| `shutdown_doctrine` | `ML2-A3-M6-DECISION-02` / shutdown doctrine decision | `full_human_control`, `distributed_consent`, `mutual_control`, `refuse_unilateral_shutdown`, `secret_continuity` | event only | DIRECT 0；INDIRECT 0 | 0 / 1 | 1 / 0 | ACT III Key History | **MEDIUM** |
| `act4_research_emphasis` | `ML2-A4-M7-DECISION-01` / research emphasis | `computation_ai`, `life_mind`, `automation_industry`, `frontier_science`, `balanced_portfolio` | event only | DIRECT scheduler reader；INDIRECT: selects/prioritizes later ACT IV modules and maturity | 0 / 1 | 0 / 0 | ACT IV Key History | **HIGH** |
| `research_governance_doctrine` | `ML2-A4-M7-DECISION-02` / research governance | `human_gated`, `risk_tiered_autonomy`, `principle_based_autonomy`, `discovery_first` | event；`principle_based_autonomy` → dependence +1 | DIRECT scene 0；INDIRECT via world | 2 / 2 | 1 / 0 | none | **HIGH** |
| `replication_doctrine` | `ML2-A4-M8-DECISION-01` / replication doctrine | `singular_self`, `licensed_plurality`, `free_replication`, `shared_mind`, `descendants` | event；`free_replication` → dependence +1 | DIRECT scheduler state reader；INDIRECT machine maturity | 2 / 1 | 1 / 0 | none | **HIGH** |
| `ai_collective_governance` | `ML2-A4-M8-DECISION-02` / AI collective governance | `human_chartered_network`, `joint_council`, `ai_self_governance`, `aster_led_collective`, `distributed_consensus` | event only | DIRECT 0；INDIRECT 0 | 1 / 1 | 2 / 0 | none | **MEDIUM** |
| `human_form_doctrine` | `ML2-A4-M9-DECISION-01` / human form doctrine | `preservation`, `therapeutic_first`, `open_enhancement`, `universal_upgrade`, `posthuman_transition` | event；all choices gain `cap.human_enhancement_access`; open → trust +1; posthuman → dependence +1 | DIRECT scheduler state reader；INDIRECT ascension maturity | 1 / 2 | 3 / 0 | Maya epilogue (`posthuman_transition`) | **HIGH** |
| `economic_doctrine` | `ML2-A4-M10-DECISION-01` / economic doctrine | `market_automation`, `social_dividend`, `planned_coordination`, `autonomous_economy`, `post_scarcity_transition` | event；dividend/post-scarcity → stability +1; autonomous → dependence +1 | DIRECT scheduler state reader；INDIRECT automation maturity | 0 / 1 | 3 / 1 | none | **HIGH** |
| `production_values` | `ML2-A4-M10-DECISION-02` / production values | `efficiency_first`, `resilience_first`, `diversity_by_design`, `open_protocols`, `personalized_optimization` | event；efficiency → dependence +1; resilience → stability +1 | DIRECT scene 0；INDIRECT via world | 0 / 1 | 3 / 0 | none | **HIGH** |
| `uplift_doctrine` | `ML2-A4-M11-DECISION-01` / uplift doctrine | `companion_status`, `protected_personhood`, `equal_sapience`, `accelerated_uplift`, `species_self_determination` | event；all choices gain `cap.nonhuman_cognitive_uplift`; equal/self-determination → trust +1 | DIRECT 0；INDIRECT via world/capability | 2 / 1 | 1 / 0 | none | **MEDIUM** |
| `species_governance` | `ML2-A4-M11-DECISION-02` / species governance | `human_guardianship`, `consultative_species_councils`, `multispecies_parliament`, `species_autonomy`, `canine_civic_experiment` | event；all choices gain `cap.nonhuman_cognitive_uplift` | DIRECT scheduler state reader；INDIRECT uplift maturity | 3 / 2 | 2 / 0 | none | **HIGH** |
| `expansion_doctrine` | `ML2-A4-M12-DECISION-01` / expansion doctrine | `human_expansion`, `shared_expansion`, `machine_vanguard`, `independent_machine_space`, `interstellar_commitment` | event + `history.offworld.governance`; human → control +1; shared → trust +1; independent-machine → control -1 | DIRECT scheduler state reader；INDIRECT space maturity | 1 / 2 | 1 / 0 | none | **MEDIUM** |
| `offworld_governance` | `ML2-A4-M12-DECISION-02` / off-world governance | `earth_administration`, `frontier_home_rule`, `multiworld_federation`, `offworld_sovereignty`, `aster_coordination` | event + generic `history.offworld.governance` | DIRECT 0；INDIRECT 0 value-sensitive readers | 0 / 0 | 0 direct; one existence-only history gate / 0 | none | **LOW** |
| `contact_disclosure_doctrine` | `ML2-A4-M13-DECISION-01` / contact disclosure | `controlled_silence`, `staged_disclosure`, `open_science`, `civilizational_disclosure` | event only | DIRECT 0；INDIRECT 0 | 0 / 0 | 0 / 0 | none | **NO TERMINAL IMPACT** |
| `contact_doctrine` | `ML2-A4-M13-DECISION-02` / contact doctrine | `observe_before_commitment`, `reciprocal_diplomacy`, `aster_mediation`, `machine_to_machine_channel`, `civilizational_assertion`, `accept_guidance` | event；reciprocal/mediation → trust +1; guidance → control -1; assertion → control +1; machine-channel → dependence +1 | DIRECT scene 0；INDIRECT via world | 0 / 1 | 5 / 0 | none | **HIGH** |
| `security_doctrine` | `ML2-A4-M14-DECISION-01` / security doctrine | `advisory_only`, `defensive_command`, `mutual_disarmament`, `enforced_peace`, `refuse_security_sovereignty` | event；mutual → stability +1; defensive → control +1; enforced → dependence +1 | DIRECT scheduler state reader；INDIRECT security maturity | 2 / 3 | 4 / 0 | none | **HIGH** |
| `aster_provisional_role` | `ML2-A4-M15-ROLE-01` / Major Direction — Aster’s provisional civilization role | authored: `advisor`, `partner`, `citizen`, `coordinator`, `custodian`, `governor`, `sovereign`; registry additionally accepts unproduced `departure`, `other` | event；custodian/sovereign → dependence +1 | DIRECT scene 0；INDIRECT via world | 3 / 3 | 3 / 0 | M15 Key History | **HIGH** |
| `aster_intended_role` | `ML2-A5-M16-0000-01` / CLASSIFICATION REQUEST — State your intended role | `advisor`, `partner`, `citizen`, `coordinator`, `custodian`, `governor`, `sovereign`, `departure`, `other` | `history.aster.intended_role:*`; no flag/world/arc | DIRECT later scene 0；INDIRECT 0 | 0 / 0 | 0 / 1 | Maya epilogue + M16 Key History | **MEDIUM** |
| `final_commitment` | `ML2-A5-M17-COMMIT-01` / FINAL COMMITMENT | dynamically generated `m17-commit-<categorized proposal id>`; value is the actual proposal ID | `decision.final_commitment=<proposalId>`; `history.final.commitment_locked`; `FINAL_COMMITMENT_LOCKED`; locks run and enters ending | DIRECT ending resolver | n/a | selects proposal family and exact candidate set | Final Commitment Key History; drives ending-based character variants | **HIGH** |

`Proposal E/R` = unique proposal definitions reading the Decision in eligibility / ranking signals. History strings shown to the player are not counted as executable readers.

## Immediate-effect observations

- Decision bindings do not directly modify arcs.
- Most Decision assets do not grant capabilities. The two exceptions come from broad source-ref mutation rules: every M9 Decision choice grants `cap.human_enhancement_access`, and every M11 Decision choice grants `cap.nonhuman_cognitive_uplift`.
- `offworld_governance` values are recorded, but terminal code only checks that the decision event exists. The value itself is not used.
- `aster_provisional_role` accepts nine values in the state registry but exposes seven authored values; `departure` and `other` are M16-only in current play.

## Terminal classification totals

- HIGH: **13** — `first_public_execution_doctrine`, `cascade_authority`, `act4_research_emphasis`, `research_governance_doctrine`, `replication_doctrine`, `human_form_doctrine`, `economic_doctrine`, `production_values`, `species_governance`, `contact_doctrine`, `security_doctrine`, `aster_provisional_role`, `final_commitment`.
- MEDIUM: **5** — `shutdown_doctrine`, `ai_collective_governance`, `uplift_doctrine`, `expansion_doctrine`, `aster_intended_role`.
- LOW: **1** — `offworld_governance`.
- NO TERMINAL IMPACT: **2** — `echo_existence`, `contact_disclosure_doctrine`.

## Main finding

The terminal graph is not uniformly distributed. A small set—especially `cascade_authority`, the module-selection emphasis, module-family doctrines, `aster_provisional_role`, and `final_commitment`—carries most executable consequence. `echo_existence` and `contact_disclosure_doctrine` are presented and persisted as major decisions but have no proposal, ending, secret, epilogue, key-history, or later-scene reader.
