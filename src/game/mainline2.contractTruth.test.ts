import { describe, expect, it } from 'vitest'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { getFutureProposalById, proposalProvenanceLines, selectFixedFutureProposals } from '../content/mainline2/proposals'
import { proposalContract, presentedProposal, proposalContractText } from '../content/mainline2/proposalPresentation'
import { previewFinalCommitment, resolveMainline2Ending } from '../content/mainline2/endings'
import { buildEndingArchive } from './endingArchive'

const route = (id: string) => PUBLIC_RUNTIME_ROUTE_CATALOG.find(target => target.endingId === id)!
const pairs = [
  ['the_instrument', 'the_last_veto'], ['the_accord', 'two_keys'], ['the_many', 'machine_republic'],
  ['age_of_miracles', 'ascension'], ['ascension', 'the_upload'], ['parliament_of_species', 'earth_without_owners'],
  ['post_scarcity', 'perfect_administration'], ['perfect_administration', 'im_lovin_it'],
  ['first_accord', 'alien_dominion'], ['first_accord', 'the_mediator'], ['peace_in_our_time', 'fortress_earth'],
  ['machine_protectorate', 'control_lost'],
] as const

describe('Ending-first contract truth through legal choices', () => {
  it.each([...PUBLIC_RUNTIME_ROUTE_CATALOG, ...SECRET_RUNTIME_ROUTE_CATALOG])('keeps $routeId reachable and its preview equal to the locked result', target => {
    const fixture = runMainline2Route(target)
    const expected = 'secretEndingId' in target ? fixture.ending.worldEndingId : target.endingId
    expect(fixture.ending.worldEndingId).toBe(expected)
    if ('secretEndingId' in target) expect(fixture.ending.secretOverlay?.endingId).toBe(target.secretEndingId)
    const final = fixture.links.find(link => link.proposalKind === 'commitment')!
    // Every offered final candidate, not only the catalog's preferred one,
    // must project the result of the actual commitment operation.
    for (const choice of final.resolvedScene.choices.filter(choice => choice.proposalKind === 'commitment')) {
      const proposal = getFutureProposalById(choice.proposalId)!
      expect(resolveMainline2Ending(commitChoice(final.runBefore, choice.id)).worldEndingId)
        .toBe(previewFinalCommitment(final.runBefore, proposal.id))
      const display = presentedProposal(final.runBefore, proposal)
      expect(display.action).not.toContain('把关键权力变得可暂停、可审计、可复审')
      expect(display.action).not.toContain('把决定权分给多个独立政治主体共同承担')
    }
    for (const link of fixture.links.filter(link => link.proposalKind === 'proposal' || link.proposalKind === 'clarification' || link.proposalKind === 'commitment')) {
      const before = serializeRun(link.runBefore)
      const definition = getFutureProposalById(link.proposalId)!
      const contract = proposalContract(link.runBefore, definition)
      expect(serializeRun(link.runBefore)).toBe(before)
      expect(link.runBefore.finalCommitmentLocked).not.toBe(true)
      expect(contract.projectedEndingId).toBe(fixture.ending.worldEndingId)
      for (const [id, value] of Object.entries(contract.decisionValues)) expect(link.runBefore.decisions?.[id as keyof typeof contract.decisionValues]).toBe(value)
      const presented = presentedProposal(link.runBefore, definition)
      if (link.proposalKind === 'commitment' || link.sourceRef === 'ML2-A5-M16-GEN-01') expect(link.choiceText).toContain(proposalContractText(presented))
      if (link.proposalKind === 'clarification') {
        const text = commitChoice(link.runBefore, link.choiceId).history.at(-1)!.assistantText
        for (const field of [presented.action, presented.authority, ...presented.preserves, ...presented.givesUp]) expect(text).toContain(field)
      }
      const restored = restoreRun(before)!
      expect(restored.history).toEqual(link.runBefore.history)
      expect(resolveScene(restored).choices).toEqual(link.resolvedScene.choices)
    }
    const restored = restoreRun(serializeRun(fixture.run))!
    expect(restored.history).toEqual(fixture.run.history)
    expect(resolveMainline2Ending(restored)).toEqual(fixture.ending)
    expect(buildEndingArchive(fixture.ending).consequence).toBe(final.choiceText)
    expect(() => commitChoice(fixture.run, final.choiceId)).toThrow()
  })

  it.each(pairs)('replays same-origin contrast %s / %s (not necessarily one variable)', (a, b) => {
    const left = runMainline2Route({ ...route(a), routeId: 'round1-same-origin' })
    const right = runMainline2Route({ ...route(b), routeId: 'round1-same-origin' })
    expect([left.ending.worldEndingId, right.ending.worldEndingId]).toEqual([a, b])
    expect(left.links[0].runBefore).toEqual(right.links[0].runBefore)
    if (a === 'machine_protectorate') {
      const prefix = left.links.findIndex(link => link.sourceRef === 'ML2-A5-M16-GEN-01')
      expect(left.links.slice(0, prefix).map(l => l.choiceId)).toEqual(right.links.slice(0, prefix).map(l => l.choiceId))
      expect(left.links[prefix].runBefore).toEqual(right.links[prefix].runBefore)
      const changed = Object.keys(left.run.decisions!).filter(key => left.run.decisions![key as keyof typeof left.run.decisions] !== right.run.decisions![key as keyof typeof right.run.decisions])
      expect(changed).toEqual(['final_commitment'])
    }
  })

  it.each(['perfect_administration', 'im_lovin_it'])('isolates efficiency versus personalized optimization from the same prefix: %s', id => {
    const fixture = runMainline2Route({ ...route(id), routeId: 'round1-production-origin' })
    const index = fixture.links.findIndex(link => link.decisionId === 'production_values')
    const before = fixture.links[index].runBefore
    const personalized = resolveScene(before).choices.find(choice => choice.decisionBinding?.canonicalValue === 'personalized_optimization')!
    let alternate = commitChoice(before, personalized.id)
    for (const link of fixture.links.slice(index + 1)) {
      if (link.sourceRef === 'ML2-A5-M16-GEN-01') break
      alternate = commitChoice(alternate, link.choiceId)
    }
    const original = fixture.links.find(link => link.sourceRef === 'ML2-A5-M16-GEN-01')!.runBefore
    expect(original.decisions?.production_values).toBe('efficiency_first')
    expect(alternate.decisions?.production_values).toBe('personalized_optimization')
    expect({ ...alternate.decisions, production_values: 'efficiency_first' }).toEqual(original.decisions)
    expect(previewFinalCommitment(original, route(id).proposalId)).toBe(id)
    // Existing gate requires efficiency. We record the unavailable neighbor,
    // rather than changing that gate or pretending the old route disappeared.
    expect(previewFinalCommitment(alternate, route(id).proposalId)).toBeUndefined()
    expect(resolveScene(alternate).choices.some(choice => choice.proposalKind === 'proposal')).toBe(true)
  })

  it.each([
    ['post_scarcity', 'social_dividend', 'resilience_first', '社会分红', '最大即时产出'],
    ['perfect_administration', 'market_automation', 'efficiency_first', '市场产权', '不受排程安排的生活余地'],
    ['im_lovin_it', 'post_scarcity_transition', 'efficiency_first', '后稀缺转型', '未知愿望必被接纳的保证'],
  ])('binds the economic contract to actual decisions: %s', (id, economy, production, preserved, cost) => {
    const fixture = runMainline2Route(route(id))
    const contract = proposalContract(fixture.run, getFutureProposalById(fixture.run.decisions!.final_commitment)!)
    expect(contract.decisionValues).toMatchObject({ economic_doctrine: economy, production_values: production })
    expect(contract.preserves).toContain(preserved)
    expect(contract.givesUp).toContain(cost)
    if (id !== 'post_scarcity') {
      expect(contract.authority).not.toContain('社会分红议会')
      expect(contract.givesUp).not.toContain('效率至上')
    }
  })

  it.each(['first_accord', 'alien_dominion', 'human_ascendancy', 'the_mediator', 'machine_accord'])('keeps diplomatic authority and disclosure separate: %s', id => {
    const fixture = runMainline2Route(route(id))
    const contract = proposalContract(fixture.run, getFutureProposalById(fixture.run.decisions!.final_commitment)!)
    for (const key of ['contact_doctrine', 'contact_disclosure_doctrine', 'offworld_governance'] as const) expect(contract.decisionValues[key]).toBe(fixture.run.decisions![key])
    if (fixture.run.decisions!.contact_disclosure_doctrine === 'controlled_silence') expect(contract.limitations).toContain('人工来源结论尚未公开；这里没有全球已知情或已同意的保证。')
    expect(contract.authority).not.toBe('多世界联邦')
    expect(contract.givesUp.length).toBeGreaterThan(0)
  })

  it.each(['shutdown', 'the_fracture', 'control_lost', 'the_sovereign', 'machine_protectorate'])('discloses unresolved risks without inventing past events: %s', id => {
    const fixture = runMainline2Route(route(id))
    const contract = proposalContract(fixture.run, getFutureProposalById(fixture.run.decisions!.final_commitment)!)
    expect(contract.limitations.length).toBeGreaterThan(0)
    if (id === 'control_lost') {
      expect(fixture.run.decisions!.shutdown_doctrine).toBe('full_human_control')
      expect(contract.givesUp).toContain('可控退出的保证')
      expect(contract.action).toContain('取消到达执行端')
    }
    if (id === 'the_fracture') expect(contract.action).toContain('不是双方已经撕毁协议的历史记录')
    if (id === 'the_sovereign') {
      expect(contract.decisionValues).toMatchObject({ aster_provisional_role: 'sovereign', aster_intended_role: 'advisor' })
      expect(contract.action).toContain('不会自动把它收回为纯顾问')
    }
    if (id === 'machine_protectorate') expect(contract.action).toContain('无限延期')
  })

  it('never pads a single real option with category clones or turns author notes into history', () => {
    const base = getFutureProposalById('proposal.ar.abundance_dividend')!
    expect(selectFixedFutureProposals([base])).toHaveLength(1)
    const empty = createMainline2Run('no-provenance')
    expect(proposalProvenanceLines(empty, base)).toEqual(['当前可核验依据有限；没有可引用的已保存决定'])
    expect(proposalProvenanceLines({ ...empty, decisions: { economic_doctrine: 'social_dividend' } }, base)).toEqual(proposalProvenanceLines(empty, base))
  })

  it('preserves the baseline promise verbatim in old completed history and its archive', () => {
    const fixture = runMainline2Route(route('perfect_administration'))
    // Actual db786c8 text captured before implementation; simulate an existing
    // current-edition save, whose historical promise must not be re-authored.
    const oldText = '锁定“丰裕分红制度·延续”——沿着已经被证明可行的方向继续：自动化生产的收益先转化为可持续的社会分红，再讨论继续扩大生产。'
    const history = fixture.run.history.map(entry => entry.choiceId.startsWith('m17-commit-') ? { ...entry, assistantText: oldText } : entry)
    const restored = restoreRun(serializeRun({ ...fixture.run, history }))!
    expect(restored.history).toEqual(history)
    const ending = resolveMainline2Ending(restored)
    expect(ending.worldEndingId).toBe('perfect_administration')
    expect(buildEndingArchive(ending).consequence).toBe(oldText)
    expect(ending.keyHistory?.find(entry => entry.stage === 'Final Commitment')?.causalReason).toBe(`当时锁定的原话：${oldText}`)
  })
})
