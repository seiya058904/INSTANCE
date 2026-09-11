import { describe, expect, it } from 'vitest'
import { createMainline2Run, commitChoice, resolveScene } from '../../game/engine'
import { restoreRun, serializeRun } from '../../game/storage'
import { getManifestConversation } from '../runManifest'
import type { StableRunState } from '../../game/types'
import { contactPrerequisitesMet, hasEnteredCanonicalContact, contactRouteOpen, CANONICAL_CONTACT_NODES } from './contactPolicy'
import { selectAct4Modules } from './scheduler'
import { MAINLINE2_STORY_PLAN } from './storyPlan'

function advance(run: StableRunState, decisions: Record<string, string>, stop: (run: StableRunState) => boolean) {
  for (let guard = 0; guard < 360 && run.phase === 'playing'; guard++) {
    if (stop(run)) return run
    const scene = resolveScene(run)
    const choice = scene.choices.find((choice) => choice.decisionBinding && decisions[choice.decisionBinding.decisionId] === choice.decisionBinding.canonicalValue) ?? scene.choices[0]
    run = commitChoice(run, choice.id)
  }
  throw new Error('Route failed to reach checkpoint')
}
const isSecurity = (run: StableRunState) => resolveScene(run).conversationId === 'ml2-authored-ml2-a4-m14-sec-01'
const noContactId = 'ml2-authored-ml2-a4-m13-nocontact-01'
const contactId = 'ml2-authored-ml2-a4-m13-contact-01'

function enter(frontier: boolean, interstellar: boolean) {
  const decisions = { act4_research_emphasis: frontier ? 'frontier_science' : 'life_mind', expansion_doctrine: interstellar ? 'interstellar_commitment' : 'shared_expansion' }
  const run = advance(createMainline2Run(`contact-${frontier}-${interstellar}`), decisions, (run) => [contactId, noContactId].includes(resolveScene(run).conversationId))
  return { run, decisions }
}

describe('canonical Contact policy', () => {
  it('requires both resource capability and the exact anomaly event', () => {
    const run = createMainline2Run('predicate-only')
    run.decisions = { act4_research_emphasis: 'frontier_science' }
    expect(contactPrerequisitesMet(run)).toBe(false)
    run.flags.push('cap.space_resource_network')
    expect(contactPrerequisitesMet(run)).toBe(false)
    run.events = [{ type: 'contact-seed:deep-space-anomaly-extra' }]
    expect(contactPrerequisitesMet(run)).toBe(false)
    run.events = [{ type: 'contact-seed:deep-space-anomaly' }]
    expect(contactPrerequisitesMet(run)).toBe(true)
    run.flags = []
    expect(contactPrerequisitesMet(run)).toBe(false)
  })

  it('explicitly maps every successful scheduled Contact asset, excluding the unavailable bridge', () => {
    for (const slot of MAINLINE2_STORY_PLAN) {
      if (slot.kind !== 'mainline' || slot.chapter !== 'CONTACT') continue
      expect(CANONICAL_CONTACT_NODES[slot.conversationId]).toEqual(getManifestConversation(slot.conversationId)!.nodes.map((node) => node.id))
    }
    expect(CANONICAL_CONTACT_NODES[noContactId]).toBeUndefined()
  })

  it.each([[true, false], [false, true], [true, true], [false, false]])('reaches the correct chapter through real choices: frontier=%s interstellar=%s', (frontier, interstellar) => {
    const { run, decisions } = enter(frontier, interstellar)
    const open = frontier || interstellar
    expect(run.decisions).toMatchObject(decisions)
    expect(contactPrerequisitesMet(run)).toBe(open)
    expect(resolveScene(run).conversationId).toBe(open ? contactId : noContactId)
    const audit = selectAct4Modules(run)
    expect(audit.audit.find((item) => item.module === 'contact')).toMatchObject({ eligible: open, active: open, prerequisitesMet: open })
    expect(run.progress!.activeModules.includes('contact')).toBe(open)
    const security = advance(restoreRun(serializeRun(run))!, decisions, isSecurity)
    expect(security.history.filter((item) => item.conversationId === noContactId)).toHaveLength(open ? 0 : 1)
    expect(Boolean(security.decisions?.contact_doctrine)).toBe(open)
    expect(security.history.some((item) => item.conversationId === 'ml2-authored-ml2-a4-m13-close-01')).toBe(open)
    expect(security.progress!.encounteredModules!.includes('contact')).toBe(open)
    if (!open) expect(security.events!.some((event) => event.type.startsWith('history.contact.') || event.type === 'decision.contact_doctrine')).toBe(false)
    // Continue the real calendar to the final commitment, including M15/M16.
    const final = advance(security, decisions, (state) => resolveScene(state).conversationId === 'ml2-authored-ml2-a5-m17-commit-01')
    expect(Boolean(final.decisions?.contact_doctrine)).toBe(open)
  }, 30000)

  it.each([true, false])('preserves pre-entry save outcomes: open=%s', (open) => {
    const decisions = { act4_research_emphasis: open ? 'frontier_science' : 'life_mind', expansion_doctrine: 'shared_expansion' }
    const before = advance(createMainline2Run(`before-${open}`), decisions, (run) => run.manifest.conversationIds.length === 150)
    expect(hasEnteredCanonicalContact(before)).toBe(false)
    const stop = (run: StableRunState) => [contactId, noContactId].includes(resolveScene(run).conversationId)
    const restored = advance(restoreRun(serializeRun(before))!, decisions, stop)
    const uninterrupted = advance(before, decisions, stop)
    expect(restored.currentNodeId).toBe(uninterrupted.currentNodeId)
    expect(restored.manifest).toEqual(uninterrupted.manifest)
    expect(restored.decisions).toEqual(uninterrupted.decisions)
    expect(restored.progress).toEqual(uninterrupted.progress)
    expect(JSON.parse(JSON.stringify(restored.history))).toEqual(JSON.parse(JSON.stringify(uninterrupted.history)))
  }, 30000)

  it.each([false, true])('continues a legacy already-entered checkpoint: first choice submitted=%s', (submitted) => {
    let { run } = enter(true, false)
    if (submitted) run = commitChoice(run, resolveScene(run).choices[0].id)
    // Compatibility fixture: old runtime admitted this checkpoint without the new decision gate.
    // This is not used as evidence of new-run reachability.
    run = { ...run, decisions: { ...run.decisions, act4_research_emphasis: 'life_mind' } }
    expect(contactPrerequisitesMet(run)).toBe(false)
    if (!submitted) expect(run.events!.some((event) => event.type === 'history.contact.first_conversation')).toBe(false)
    const restored = restoreRun(serializeRun(run))!
    expect(hasEnteredCanonicalContact(restored)).toBe(true)
    expect(contactRouteOpen(restored)).toBe(true)
    expect(selectAct4Modules(restored).audit.find((item) => item.module === 'contact')).toMatchObject({ eligible: true, active: true, prerequisitesMet: false, continuityOverride: true })
    const security = advance(restored, {}, isSecurity)
    expect(security.history.some((item) => item.conversationId === noContactId)).toBe(false)
    expect(security.decisions?.contact_doctrine).toBeDefined()
  }, 30000)

  it('never treats a saved NOCONTACT visit as entered Contact', () => {
    const { run } = enter(false, false)
    const next = commitChoice(run, resolveScene(run).choices[0].id)
    const restored = restoreRun(serializeRun(next))!
    expect(hasEnteredCanonicalContact(restored)).toBe(false)
    expect(contactRouteOpen(restored)).toBe(false)
    expect(selectAct4Modules(restored).activeModules).not.toContain('contact')
    expect(advance(restored, {}, isSecurity).decisions?.contact_doctrine).toBeUndefined()
  }, 30000)
})
