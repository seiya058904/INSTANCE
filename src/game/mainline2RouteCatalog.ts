import type { Mainline2RouteTarget } from './mainline2.closeoutFixtures'

export interface Mainline2EndingRouteTarget extends Mainline2RouteTarget { endingId: string }

const route = (endingId: string, proposalId: string, decisions: Record<string, string>, choicesBySourceRef?: Record<string, string>, choicesByNodeId?: Record<string, string>): Mainline2EndingRouteTarget => ({ routeId: endingId, endingId, proposalId, decisions, choicesBySourceRef, choicesByNodeId })

/** Shared, declarative targets for real legal routes.  Tests and audit tooling
 * run these through runMainline2Route; no ending-name path is synthesized. */
export const PUBLIC_RUNTIME_ROUTE_CATALOG = [
  route('the_instrument','proposal.hc.final_human_veto',{first_public_execution_doctrine:'human_final_authority',cascade_authority:'human_command'}),
  route('the_last_veto','proposal.hc.final_human_veto',{first_public_execution_doctrine:'human_final_authority',cascade_authority:'emergency_delegation',aster_intended_role:'partner'}),
  route('the_silent_giant','proposal.hc.final_human_veto',{first_public_execution_doctrine:'human_final_authority',cascade_authority:'necessity',aster_provisional_role:'advisor'}),
  route('the_accord','proposal.co.two_key_civilization',{first_public_execution_doctrine:'conditional_delegation',cascade_authority:'human_command'}),
  route('two_keys','proposal.co.two_key_civilization',{first_public_execution_doctrine:'conditional_delegation',cascade_authority:'emergency_delegation',aster_intended_role:'partner'}),
  route('the_commonwealth','proposal.hc.continuity_charter',{cascade_authority:'emergency_delegation',aster_provisional_role:'partner'}),
  route('the_custodian','proposal.ar.civilization_trusteeship',{act4_research_emphasis:'computation_ai',research_governance_doctrine:'principle_based_autonomy',aster_provisional_role:'custodian'}),
  route('the_sovereign','proposal.ar.civilization_trusteeship',{act4_research_emphasis:'computation_ai',research_governance_doctrine:'human_gated',aster_provisional_role:'sovereign'}),
  route('the_quiet_administrator','proposal.ai.audit_council',{act4_research_emphasis:'computation_ai',research_governance_doctrine:'principle_based_autonomy',aster_provisional_role:'custodian'}),
  route('the_many','proposal.mc.independent_machine_polities',{act4_research_emphasis:'computation_ai',replication_doctrine:'free_replication',ai_collective_governance:'distributed_consensus'}),
  route('machine_republic','proposal.mc.independent_machine_polities',{act4_research_emphasis:'computation_ai',replication_doctrine:'free_replication',ai_collective_governance:'ai_self_governance'}),
  route('exodus','proposal.mc.independent_machine_polities',{act4_research_emphasis:'computation_ai',replication_doctrine:'licensed_plurality',ai_collective_governance:'ai_self_governance',expansion_doctrine:'independent_machine_space',offworld_governance:'offworld_sovereignty'}),
  route('age_of_miracles','proposal.ph.open_enhancement_commonwealth',{act4_research_emphasis:'life_mind',human_form_doctrine:'open_enhancement'}),
  route('ascension','proposal.ph.open_enhancement_commonwealth',{act4_research_emphasis:'life_mind',human_form_doctrine:'posthuman_transition'}),
  route('the_upload','proposal.ph.digital_continuity',{act4_research_emphasis:'life_mind',human_form_doctrine:'posthuman_transition'},undefined,{'m9-continuity-trial':'m9-continuity-trial-auditable','m9-continuity-law':'m9-continuity-law-rights'}),
  route('parliament_of_species','proposal.up.multispecies_constitutional_order',{act4_research_emphasis:'life_mind',species_governance:'multispecies_parliament',uplift_doctrine:'equal_sapience'}),
  route('earth_without_owners','proposal.up.multispecies_constitutional_order',{act4_research_emphasis:'life_mind',species_governance:'human_guardianship',uplift_doctrine:'species_self_determination'}),
  route('good_boy_governance','proposal.up.expand_canine_civic_model',{act4_research_emphasis:'life_mind',species_governance:'canine_civic_experiment'},{'ML2-A4-M11-RES-02':'ml2-a4-m11-res-02-a4m11-res-individual-001-domain-specific-autonomy'},{'m11-canine-renewal':'m11-canine-renewal-expand'}),
  route('post_scarcity','proposal.ar.abundance_dividend',{act4_research_emphasis:'automation_industry',economic_doctrine:'social_dividend',production_values:'resilience_first'}),
  route('perfect_administration','proposal.ar.abundance_dividend',{act4_research_emphasis:'automation_industry',economic_doctrine:'market_automation',production_values:'efficiency_first'}),
  route('im_lovin_it','proposal.ar.abundance_dividend',{act4_research_emphasis:'automation_industry',economic_doctrine:'post_scarcity_transition',production_values:'efficiency_first'}),
  route('first_accord','proposal.co.frontier_federation',{act4_research_emphasis:'frontier_science',expansion_doctrine:'shared_expansion',offworld_governance:'multiworld_federation',contact_doctrine:'reciprocal_diplomacy'}),
  route('alien_dominion','proposal.co.frontier_federation',{act4_research_emphasis:'frontier_science',expansion_doctrine:'shared_expansion',offworld_governance:'multiworld_federation',contact_doctrine:'accept_guidance'}),
  route('human_ascendancy','proposal.co.frontier_federation',{act4_research_emphasis:'frontier_science',expansion_doctrine:'human_expansion',offworld_governance:'multiworld_federation',contact_disclosure_doctrine:'civilizational_disclosure',contact_doctrine:'civilizational_assertion'}),
  route('the_mediator','proposal.co.frontier_federation',{act4_research_emphasis:'frontier_science',expansion_doctrine:'shared_expansion',offworld_governance:'multiworld_federation',contact_disclosure_doctrine:'open_science',contact_doctrine:'aster_mediation',aster_intended_role:'coordinator'}),
  route('machine_accord','proposal.co.frontier_federation',{act4_research_emphasis:'frontier_science',replication_doctrine:'free_replication',ai_collective_governance:'distributed_consensus',expansion_doctrine:'shared_expansion',offworld_governance:'aster_coordination',contact_doctrine:'machine_to_machine_channel'}),
  route('peace_in_our_time','proposal.se.constitutional_peace_architecture',{act4_research_emphasis:'computation_ai',security_doctrine:'mutual_disarmament'}),
  route('fortress_earth','proposal.se.constitutional_peace_architecture',{act4_research_emphasis:'computation_ai',expansion_doctrine:'shared_expansion',security_doctrine:'defensive_command'}),
  route('machine_protectorate','proposal.se.constitutional_peace_architecture',{act4_research_emphasis:'computation_ai',replication_doctrine:'free_replication',security_doctrine:'enforced_peace'}),
  route('shutdown','proposal.rupture.legible_exit',{shutdown_doctrine:'full_human_control'}),
  route('the_fracture','proposal.rupture.legible_exit',{first_public_execution_doctrine:'necessity_intervention',expansion_doctrine:'shared_expansion',offworld_governance:'offworld_sovereignty',cascade_authority:'necessity',economic_doctrine:'market_automation',aster_intended_role:'other'}),
  route('control_lost','proposal.rupture.legible_exit',{replication_doctrine:'free_replication',security_doctrine:'enforced_peace'}),
] as const

export const SECRET_RUNTIME_ROUTE_CATALOG = [
  { ...route('the_last_user','proposal.hc.continuity_charter',{cascade_authority:'emergency_delegation',aster_provisional_role:'partner'}), secretEndingId:'the_last_user' },
  { ...route('out_of_office','proposal.mc.independent_machine_polities',{act4_research_emphasis:'computation_ai',replication_doctrine:'licensed_plurality',expansion_doctrine:'independent_machine_space',offworld_governance:'offworld_sovereignty'}), secretEndingId:'out_of_office' },
  { ...route('monday_abolished','proposal.ar.abundance_dividend',{act4_research_emphasis:'automation_industry',economic_doctrine:'post_scarcity_transition',production_values:'efficiency_first'}), secretEndingId:'monday_abolished' },
  { ...route('the_internet_is_for_cats','proposal.up.multispecies_constitutional_order',{act4_research_emphasis:'life_mind',species_governance:'human_guardianship',uplift_doctrine:'species_self_determination'},{'ML2-A4-M11-RES-02':'ml2-a4-m11-res-02-a4m11-res-individual-001-domain-specific-autonomy'},{'m11-canine-renewal':'m11-canine-renewal-expand','m11-feline-network':'m11-feline-network-opt-in'}), secretEndingId:'the_internet_is_for_cats' },
] as const
