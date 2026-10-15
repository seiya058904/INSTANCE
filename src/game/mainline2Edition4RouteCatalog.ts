import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG, type Mainline2EndingRouteTarget } from './mainline2RouteCatalog'

/** Authored legal choices for the new calendar; final results are never seeded.
 * The edition-3 catalog remains unchanged as the compatibility oracle. */
export function edition4Route(target: Mainline2EndingRouteTarget): Mainline2EndingRouteTarget {
  const id = target.endingId
  const choices = { ...target.choicesByNodeId }
  const decisions = { ...target.decisions }
  if (['parliament_of_species', 'earth_without_owners', 'good_boy_governance', 'the_internet_is_for_cats'].includes(id)) choices['v4-life-allocation'] = 'v4-life-wetland'
  if (id === 'the_upload') choices['v4-life-clinic-next'] = 'v4-life-persons'
  if (id === 'the_quiet_administrator') choices['v4-governance-service'] = 'v4-service-daily'
  if (['peace_in_our_time', 'fortress_earth', 'machine_protectorate', 'shutdown', 'the_fracture', 'control_lost'].includes(id)) {
    decisions.act4_research_emphasis = 'computation_ai'
    choices['v4-compute-allocation'] = 'v4-compute-controls'
  }
  if (id === 'the_fracture') choices['v4-safety-fracture'] = 'v4-safety-fracture-defer'
  if (id === 'control_lost') choices['v4-safety-revocation'] = 'v4-safety-revocation-defer'
  return { ...target, edition: 4, routeId: `v4-${target.routeId}`, decisions, choicesByNodeId: choices }
}
export const EDITION4_PUBLIC_ROUTES = PUBLIC_RUNTIME_ROUTE_CATALOG.map(edition4Route)
export const EDITION4_SECRET_ROUTES = SECRET_RUNTIME_ROUTE_CATALOG.map(edition4Route)
