import { describe, expect, it } from 'vitest'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { commitChoice, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { getFutureProposalById, formatProposalClarification, proposalClarification } from '../content/mainline2/proposals'
import { proposalContract, presentedProposal } from '../content/mainline2/proposalPresentation'
import { previewFinalCommitment, resolveMainline2Ending } from '../content/mainline2/endings'
import { generateFutureProposals } from '../content/mainline2/futureProposalGenerator'
import { buildEndingArchive } from './endingArchive'

const route = (id: string) => PUBLIC_RUNTIME_ROUTE_CATALOG.find(target => target.endingId === id)!
// Mechanism, authority and cost assertions, rather than cosmetic inequality.
const mechanisms: Record<string, string[]> = {
  the_instrument: ['逐项署名', '签字与等待'],
  the_last_veto: ['限时授权到期', '最终否决', '救援速度'],
  the_silent_giant: ['分析能力', '不代替人执行', '能力不等于权限'],
  the_many: ['可退出的资源契约', '不建立统一机器政府'],
  machine_republic: ['机器议会', '反对票', '预算落败', '网络错误'],
  exodus: ['地外生活', '补给', '退出地球政治中心'],
  age_of_miracles: ['治疗与自愿增强', '照护', '可及性'],
  ascension: ['身体和认知形态', '未增强者', '公民权'],
  parliament_of_species: ['持续的共同议会席位', '迁徙'],
  earth_without_owners: ['栖息地与自治权', '人类单方所有', '维护责任'],
  peace_in_our_time: ['共同核验', '实际减权'],
  fortress_earth: ['人类保有防卫控制', '封闭', '探索空间'],
  the_accord: ['人类指挥', '共同修订'],
  two_keys: ['双方否决', '僵局'],
  the_custodian: ['长期托管', '代际'],
  the_quiet_administrator: ['日常行政', '例外', '申诉'],
}
const contrasts = [
  ['the_instrument', 'the_last_veto'], ['the_last_veto', 'the_silent_giant'], ['the_instrument', 'the_silent_giant'],
  ['the_many', 'machine_republic'], ['machine_republic', 'exodus'], ['the_many', 'exodus'],
  ['age_of_miracles', 'ascension'], ['parliament_of_species', 'earth_without_owners'],
  ['peace_in_our_time', 'fortress_earth'], ['the_accord', 'two_keys'], ['the_custodian', 'the_quiet_administrator'],
]

describe('PR31 review: meaningful contracts, truthful roles and opposition', () => {
  it.each(contrasts)('distinguishes the legal bargains %s / %s throughout review and archive', (a, b) => {
    const fixtures = [a, b].map(id => runMainline2Route({ ...route(id), routeId: 'review-same-origin' }))
    expect(fixtures[0].links[0].runBefore).toEqual(fixtures[1].links[0].runBefore)
    fixtures.forEach((fixture, i) => {
      const id = [a, b][i]
      const final = fixture.links.find(link => link.proposalKind === 'commitment')!
      expect(previewFinalCommitment(final.runBefore, final.proposalId!)).toBe(id)
      expect(resolveMainline2Ending(commitChoice(final.runBefore, final.choiceId)).worldEndingId).toBe(id)
      const clarify = fixture.links.find(link => link.proposalKind === 'clarification')!
      const clarified = commitChoice(clarify.runBefore, clarify.choiceId)
      const saved = clarified.history.at(-1)!.assistantText
      const debut = fixture.links.find(link => link.sourceRef === 'ML2-A5-M16-GEN-01')!
      for (const phrase of mechanisms[id]) {
        expect(final.choiceText, id).toContain(phrase)
        expect(saved, id).toContain(phrase)
        expect(debut.choiceText, id).toContain(phrase)
      }
      expect(restoreRun(serializeRun(clarified))!.history.at(-1)!.assistantText).toBe(saved)
      const restored = restoreRun(serializeRun(fixture.run))!
      expect(restored.history).toEqual(fixture.run.history)
      expect(buildEndingArchive(resolveMainline2Ending(restored)).consequence).toBe(final.choiceText)
    })
  })

  it.each(['advisor', 'sovereign', 'partner', 'citizen', 'coordinator', 'other'])('preserves provisional sovereignty with actual intended role %s', intended => {
    const target = route('the_sovereign')
    const fixture = runMainline2Route({ ...target, decisions: { ...target.decisions, aster_intended_role: intended } })
    expect(fixture.ending.worldEndingId).toBe('the_sovereign')
    const final = fixture.links.find(link => link.proposalKind === 'commitment')!
    const contract = proposalContract(final.runBefore, getFutureProposalById(final.proposalId)!)
    expect(contract.decisionValues).toMatchObject({ aster_provisional_role: 'sovereign', aster_intended_role: intended })
    expect(contract.limitations.join(' ').includes('长期顾问意向')).toBe(intended === 'advisor')
    expect(contract.title.includes('冲突')).toBe(intended === 'advisor')
    if (intended === 'sovereign') expect(contract.limitations.join(' ')).toContain('主权资格与长期主权意向一致')
    if (intended === 'other') expect(contract.limitations.join(' ')).toContain('拒绝现有角色分类')
    const restored = restoreRun(serializeRun(final.runBefore))!
    expect(resolveScene(restored).choices).toEqual(final.resolvedScene.choices)
    expect(commitChoice(restored, final.choiceId).history.at(-1)!.assistantText).toBe(final.choiceText)
    const clarify = fixture.links.find(link => link.proposalKind === 'clarification')!
    const clarified = commitChoice(clarify.runBefore, clarify.choiceId)
    const saved = clarified.history.at(-1)!.assistantText
    expect(saved.includes('长期顾问意向')).toBe(intended === 'advisor')
    expect(restoreRun(serializeRun(clarified))!.history).toEqual(clarified.history)
    expect(buildEndingArchive(resolveMainline2Ending(restoreRun(serializeRun(fixture.run))!)).consequence).toBe(final.choiceText)
  })

  it.each(PUBLIC_RUNTIME_ROUTE_CATALOG)('derives opposition from the bargain across new and retained category candidates: $routeId', target => {
    const fixture = runMainline2Route(target)
    const run = fixture.links.find(link => link.sourceRef === 'ML2-A5-M16-GEN-01')!.runBefore
    for (const candidate of generateFutureProposals(run)) {
      const baseId = candidate.id.split('.category.')[0]
      for (const category of ['natural_continuation', 'power_constraint', 'shared_future', 'lawful_alternative']) {
        const retained = getFutureProposalById(`${baseId}.category.${category}`)
        if (!retained) continue // Preserve the existing rupture incompatibility gate.
        const display = presentedProposal(run, retained)
        const detail = proposalClarification(display, run)
        expect(detail.opposition).toContain(display.givesUp.join('、'))
        expect(detail.opposition).not.toMatch(/不愿接受外部审计|不愿分享主权|无法接受审计/)
        expect(formatProposalClarification(display, run)).toContain(`主要阻力：${detail.opposition}`)
        expect(display).toMatchObject({ id: retained.id, family: retained.family, category, roleSemantics: (retained as typeof candidate).roleSemantics })
      }
    }
  })

  it('retains the protectorate exit risk in the actual saved clarification and after refresh', () => {
    const fixture = runMainline2Route(route('machine_protectorate'))
    const link = fixture.links.find(link => link.proposalKind === 'clarification')!
    const run = commitChoice(link.runBefore, link.choiceId)
    const saved = run.history.at(-1)!.assistantText
    const opposition = saved.split('\n').find(line => line.startsWith('主要阻力：'))!
    expect(saved).toContain('这不是可随时暂停的保护服务')
    expect(opposition).toContain('被保护者随时退出的保证')
    expect(opposition).not.toMatch(/外部审计|分享主权/)
    expect(restoreRun(serializeRun(run))!.history.at(-1)!.assistantText).toBe(saved)
  })

  it.each([
    ['planned_coordination', 'personalized_optimization'], ['autonomous_economy', 'open_protocols'],
    ['social_dividend', 'efficiency_first'], ['market_automation', 'diversity_by_design'],
    ['post_scarcity_transition', 'resilience_first'],
  ])('does not invent an economic package for legal non-catalog history %s / %s', (economic_doctrine, production_values) => {
    const target = route('the_instrument')
    const fixture = runMainline2Route({ ...target, decisions: { ...target.decisions, act4_research_emphasis: 'automation_industry', economic_doctrine, production_values } })
    const run = fixture.links.find(link => link.sourceRef === 'ML2-A5-M16-GEN-01')!.runBefore
    const retained = getFutureProposalById('proposal.ar.abundance_dividend.category.shared_future')!
    expect(previewFinalCommitment(run, retained.id)).toBeUndefined()
    const contract = proposalContract(run, retained)
    expect(contract.title).toBe('自动化供给：条款待核验')
    expect(contract.decisionValues).toMatchObject({ economic_doctrine, production_values })
    expect(contract.action).toContain('尚不能确认具体供给制度')
    expect(contract.preserves).toEqual(['已保存的经济与生产取向'])
    expect(contract.authority).not.toMatch(/社会分红议会|后稀缺供给体系|市场与产权规则/)
    // A pre-fix save may retain this now-unresolvable category candidate.
    // It remains reviewable, but must neither invent a package nor be lockable.
    const review = fixture.links.find(link => link.proposalKind === 'clarification')!.runBefore
    const legacy = {
      ...review,
      retainedProposalIds: [...new Set([...(review.retainedProposalIds ?? []), retained.id])],
      selectedProposalId: retained.id,
    }
    const choice = resolveScene(legacy).choices.find(choice => choice.proposalKind === 'clarification' && choice.proposalId === retained.id)!
    const clarified = commitChoice(legacy, choice.id)
    expect(clarified.history.at(-1)!.assistantText).toContain('尚不能确认具体供给制度')
    expect(clarified.history.slice(0, legacy.history.length)).toEqual(legacy.history)
    expect(restoreRun(serializeRun(clarified))!.history).toEqual(clarified.history)
  })
})
