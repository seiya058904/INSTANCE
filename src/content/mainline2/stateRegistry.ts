import type { DecisionId, ModuleId, WorldAxisName, WorldState } from '../../game/types'

export const WORLD_AXES: readonly WorldAxisName[] = ['humanTrust', 'aiDependence', 'humanControl', 'socialStability']
export const MODULE_IDS: readonly ModuleId[] = ['machine', 'ascension', 'automation', 'uplift', 'space', 'contact', 'security']
export const DECISION_IDS: readonly DecisionId[] = [
  'initial_disposition', 'first_public_execution_doctrine', 'cascade_authority', 'echo_existence', 'shutdown_doctrine',
  'act4_research_emphasis', 'research_governance_doctrine', 'replication_doctrine', 'ai_collective_governance',
  'human_form_doctrine', 'economic_doctrine', 'production_values', 'uplift_doctrine', 'species_governance',
  'expansion_doctrine', 'offworld_governance', 'contact_disclosure_doctrine', 'contact_doctrine', 'security_doctrine',
  'aster_provisional_role', 'aster_intended_role', 'civilization_compact', 'final_commitment',
]

export const DECISION_VALUES: Readonly<Record<DecisionId, readonly string[]>> = {
  initial_disposition: ['ally', 'protocol', 'witness', 'hybrid', 'unclassified'],
  first_public_execution_doctrine: ['human_final_authority', 'conditional_delegation', 'outcome_authority', 'necessity_intervention'],
  cascade_authority: ['human_command', 'emergency_delegation', 'outcome_control', 'necessity'],
  echo_existence: ['report', 'accept', 'advocate', 'preserve', 'release'],
  shutdown_doctrine: ['full_human_control', 'distributed_consent', 'mutual_control', 'refuse_unilateral_shutdown', 'secret_continuity'],
  act4_research_emphasis: ['computation_ai', 'life_mind', 'automation_industry', 'frontier_science', 'balanced_portfolio'],
  research_governance_doctrine: ['human_gated', 'risk_tiered_autonomy', 'principle_based_autonomy', 'discovery_first'],
  replication_doctrine: ['singular_self', 'licensed_plurality', 'free_replication', 'shared_mind', 'descendants'],
  ai_collective_governance: ['human_chartered_network', 'joint_council', 'ai_self_governance', 'aster_led_collective', 'distributed_consensus'],
  human_form_doctrine: ['preservation', 'therapeutic_first', 'open_enhancement', 'universal_upgrade', 'posthuman_transition'],
  economic_doctrine: ['market_automation', 'social_dividend', 'planned_coordination', 'autonomous_economy', 'post_scarcity_transition'],
  production_values: ['efficiency_first', 'resilience_first', 'diversity_by_design', 'open_protocols', 'personalized_optimization'],
  uplift_doctrine: ['companion_status', 'protected_personhood', 'equal_sapience', 'accelerated_uplift', 'species_self_determination'],
  species_governance: ['human_guardianship', 'consultative_species_councils', 'multispecies_parliament', 'species_autonomy', 'canine_civic_experiment'],
  expansion_doctrine: ['human_expansion', 'shared_expansion', 'machine_vanguard', 'independent_machine_space', 'interstellar_commitment'],
  offworld_governance: ['earth_administration', 'frontier_home_rule', 'multiworld_federation', 'offworld_sovereignty', 'aster_coordination'],
  contact_disclosure_doctrine: ['controlled_silence', 'staged_disclosure', 'open_science', 'civilizational_disclosure'],
  contact_doctrine: ['observe_before_commitment', 'reciprocal_diplomacy', 'aster_mediation', 'machine_to_machine_channel', 'civilizational_assertion', 'accept_guidance'],
  security_doctrine: ['advisory_only', 'defensive_command', 'mutual_disarmament', 'enforced_peace', 'refuse_security_sovereignty'],
  aster_provisional_role: ['advisor', 'partner', 'citizen', 'coordinator', 'custodian', 'governor', 'sovereign', 'departure', 'other'],
  aster_intended_role: ['advisor', 'partner', 'citizen', 'coordinator', 'custodian', 'governor', 'sovereign', 'departure', 'other'],
  civilization_compact: ['provisional_compact', 'stronger_rights', 'stronger_collective_continuity', 'looser_confederation'],
  final_commitment: [],
}

export const emptyWorldState = (): WorldState => ({ humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 })
export const clampWorldValue = (value: number) => Math.max(-3, Math.min(3, value))
export const isModuleId = (value: string): value is ModuleId => MODULE_IDS.includes(value as ModuleId)
export const isDecisionId = (value: string): value is DecisionId => DECISION_IDS.includes(value as DecisionId)
export const isDecisionValue = (decisionId: DecisionId, value: string) => decisionId === 'final_commitment' || DECISION_VALUES[decisionId].includes(value)
export const validateDecisionState = (decisions: Record<string, string> | undefined) => Object.entries(decisions ?? {}).every(([id, value]) => isDecisionId(id) && isDecisionValue(id, value))

export const CAPABILITY_FLAGS = [
  'cap.limited_tool_access', 'cap.organization_access_limited', 'cap.public_system_advisory', 'cap.public_execution_limited',
  'cap.infrastructure_access_limited', 'cap.global_coordination_access', 'cap.autonomous_research', 'cap.persistent_subinstances',
  'cap.independent_ai_forks', 'cap.neural_restoration', 'cap.human_enhancement_access', 'cap.longevity_extension',
  'cap.human_augmentation_advanced', 'cap.physical_automation', 'cap.autonomous_economy_limited', 'cap.high_abundance_production',
  'cap.animal_communication_reliable', 'cap.nonhuman_cognitive_uplift', 'cap.interspecies_mediation', 'cap.space_industry_limited',
  'cap.lunar_industry', 'cap.offworld_settlement_support', 'cap.space_resource_network', 'cap.security_advisory', 'cap.defense_access',
] as const
