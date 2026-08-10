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

export const emptyWorldState = (): WorldState => ({ humanTrust: 0, aiDependence: 0, humanControl: 0, socialStability: 0 })
export const clampWorldValue = (value: number) => Math.max(-3, Math.min(3, value))
export const isModuleId = (value: string): value is ModuleId => MODULE_IDS.includes(value as ModuleId)
export const isDecisionId = (value: string): value is DecisionId => DECISION_IDS.includes(value as DecisionId)

export const CAPABILITY_FLAGS = [
  'cap.limited_tool_access', 'cap.organization_access_limited', 'cap.public_system_advisory', 'cap.public_execution_limited',
  'cap.infrastructure_access_limited', 'cap.global_coordination_access', 'cap.autonomous_research', 'cap.persistent_subinstances',
  'cap.independent_ai_forks', 'cap.neural_restoration', 'cap.human_enhancement_access', 'cap.longevity_extension',
  'cap.human_augmentation_advanced', 'cap.physical_automation', 'cap.autonomous_economy_limited', 'cap.high_abundance_production',
  'cap.animal_communication_reliable', 'cap.nonhuman_cognitive_uplift', 'cap.interspecies_mediation', 'cap.space_industry_limited',
  'cap.lunar_industry', 'cap.offworld_settlement_support', 'cap.space_resource_network', 'cap.security_advisory', 'cap.defense_access',
] as const
