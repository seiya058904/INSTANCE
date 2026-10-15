import type { StableRunState } from '../../game/types'
import { choseSafety } from './edition4Safety'
import { effectiveGovernanceRole, governanceScope, sovereigntySettlement } from './edition4Governance'

export const causalEdition = (run: StableRunState) => run.mainlineCalendarVersion === 4 && run.mainlineCausalityVersion === 1
const receipt = (run: StableRunState, id: string, choice?: string) => run.history.some(h => h.nodeId === id && (!choice || h.choiceId === choice))
  && run.history.some(h => h.conversationId === run.history.find(a => a.nodeId === id)?.conversationId && h.nodeId.endsWith('-receipt'))

/** Actual choices/receipts ground fresh-world claims. Old editions, including
 * interim v4 records without the marker, retain their original interpretation. */
export function missingCausalEvidence(run: StableRunState, endingId: string): string[] {
  if (!causalEdition(run)) return []
  const has = (id: string, choice?: string) => receipt(run, id, choice)
  const reasons: string[] = []
  const required: Record<string, boolean> = {
    the_instrument: has('v4-authority-signatures'),
    the_last_veto: has('v4-authority-expiry'),
    the_silent_giant: has('v4-authority-restraint') || has('v4-authority-outcomes', 'v4-authority-outcomes-wait') || has('v4-authority-necessity', 'v4-authority-necessity-intervene') || choseSafety(run, 'handover', true),
    the_accord: has('v4-authority-amendment'),
    two_keys: has('v4-authority-veto'),
    the_commonwealth: has('v4-authority-districts'),
    the_custodian: governanceScope(run) === 'generational' && effectiveGovernanceRole(run) === 'custodian',
    the_quiet_administrator: governanceScope(run) === 'daily' && effectiveGovernanceRole(run) === 'custodian',
    the_sovereign: sovereigntySettlement(run) === 'sovereign',
    the_many: has('v4-machine-many'),
    machine_republic: has('v4-machine-republic'),
    exodus: has('v4-machine-exodus', 'v4-exodus-supply'),
    age_of_miracles: has('v4-life-therapy'),
    ascension: has('v4-life-forms'),
    the_upload: has('v4-life-continuity'),
    parliament_of_species: has('v4-life-parliament'),
    earth_without_owners: has('v4-life-corridor'),
    good_boy_governance: has('v4-life-dogs'),
    post_scarcity: has('v4-econ-occupation'),
    perfect_administration: has('v4-econ-detour'),
    im_lovin_it: has('v4-econ-menu'),
    first_accord: has('v4-contact-reciprocal') || has('v4-contact-guidance', 'v4-contact-guidance-wait'),
    alien_dominion: has('v4-contact-guidance', 'v4-contact-guidance-limited'),
    human_ascendancy: has('v4-contact-assertion'),
    the_mediator: has('v4-contact-mediation'),
    machine_accord: has('v4-contact-machine'),
    peace_in_our_time: choseSafety(run, 'disarmament', true),
    fortress_earth: choseSafety(run, 'defense', true),
    machine_protectorate: choseSafety(run, 'protectorate', true) && choseSafety(run, 'revocation', true),
    shutdown: choseSafety(run, 'handover', true) && !choseSafety(run, 'fracture', false),
    the_fracture: choseSafety(run, 'fracture', false),
    control_lost: choseSafety(run, 'revocation', false),
  }
  if (endingId in required && !required[endingId]) reasons.push(`missing actual edition-4 action/receipt for ${endingId}`)
  return reasons
}

export function currentAuthorityDecision(run: StableRunState, decisionId: string, endingId?: string) {
  if (decisionId === 'aster_provisional_role') return effectiveGovernanceRole(run)
  if (causalEdition(run) && endingId === 'shutdown' && choseSafety(run, 'handover', true)) {
    if (decisionId === 'shutdown_doctrine') return 'full_human_control'
    if (decisionId === 'cascade_authority') return 'human_command'
  }
  if (causalEdition(run) && endingId === 'the_custodian' && decisionId === 'research_governance_doctrine' && governanceScope(run) === 'generational') return 'principle_based_autonomy'
  return run.decisions?.[decisionId as keyof NonNullable<StableRunState['decisions']>]
}

export function governanceEligibilityState(run: StableRunState): StableRunState {
  const role = effectiveGovernanceRole(run)
  return role && role !== run.decisions?.aster_provisional_role ? { ...run, decisions: { ...run.decisions, aster_provisional_role: role } } : run
}
