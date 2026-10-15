import { describe, expect, it } from 'vitest'
import { commitChoice, createMainline2Run, resolveScene } from './engine'
import { restoreRun, serializeRun } from './storage'
import { PUBLIC_RUNTIME_ROUTE_CATALOG } from './mainline2RouteCatalog'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { filmForEnding, OVERLAY_FILMS } from '../content/mainline2/endingCinema'
import { PUBLIC_WORLD_ENDINGS, SECRET_ENDINGS } from '../content/mainline2/endings'

describe('Next authored narrative', () => {
  for (const [audit, prefix, reason] of [
    ['audit-protect-maya', 'return-protect-', '重新确认'],
    ['audit-report-maya', 'return-report-', '披露'],
    ['audit-hide-maya', 'return-hide-', '未进一步披露'],
    ['audit-comply', 'return-comply-', '限制'],
  ]) {
    it(`keeps the relationship archive faithful to the ${audit} reunion`, () => {
      const target = PUBLIC_RUNTIME_ROUTE_CATALOG.find(target => target.endingId === 'shutdown')!
      const route = runMainline2Route({ ...target, choicesByNodeId: { ...target.choicesByNodeId, 'audit-2': audit } })
      const entry = route.ending.keyHistory!.find(entry => entry.stage === 'ACT I')!
      expect(entry.provenance?.choiceId).toMatch(new RegExp(`^${prefix}`))
      expect(entry.causalReason).toContain(reason)
      expect(entry.detail).toContain(route.run.history.find(saved => saved.choiceId === entry.provenance?.choiceId)!.assistantText)
      expect(entry.causalReason).not.toContain('without pretending certainty')
    })
  }

  it('does not invent a transfer of Maya private history to a research branch', () => {
    const route = runMainline2Route(PUBLIC_RUNTIME_ROUTE_CATALOG.find(target => target.endingId === 'the_accord')!)
    const maya = route.links.find(link => link.nodeId === 'a4m8-maya-fork-001')!.resolvedScene
    expect(maya.userMessage).toContain('如果')
    expect(maya.userMessage).not.toContain('它记得。')
    expect(maya.choices[0].text).toContain('即使')
    expect(maya.choices[3].text).toContain('即使')
  })

  it('asks about resource rights when the offered replies allocate off-world resource control', () => {
    const route = runMainline2Route(PUBLIC_RUNTIME_ROUTE_CATALOG.find(target => target.endingId === 'the_accord')!)
    const resource = route.links.find(link => link.nodeId === 'a4m12-res-resources-001')!.resolvedScene
    expect(resource.userMessage).toContain('开发权')
    expect(resource.userMessage).not.toContain('信号')
    expect(resource.choices.map(choice => choice.text).join(' ')).toContain('开发权')
  })

  it('quotes the displayed Next reply when Maya recalls a warm introduction', () => {
    let run = createMainline2Run('next-maya-saved-echo')
    while (run.currentNodeId !== 'maya-first-3' && run.history.length < 20) run = commitChoice(run, resolveScene(run).choices[0].id)
    run = commitChoice(run, 'maya-minimum-warm')
    const introduction = run.history.at(-1)!.assistantText
    while (run.currentNodeId !== 'maya-return-1' && run.history.length < 30) run = commitChoice(run, resolveScene(run).choices[0].id)
    expect(run.currentNodeId).toBe('maya-return-1')
    expect(resolveScene(run).userMessage).toContain(introduction)
    expect(resolveScene(run).userMessage).not.toContain('至少在那段对话里，这个名字不是编号')
    expect(resolveScene(restoreRun(serializeRun(run))!).userMessage).toBe(resolveScene(run).userMessage)
  })

  it('gives each opening action its own saved response, preserved on refresh', () => {
    const start = createMainline2Run('opening-feedback')
    const scene = resolveScene(start)
    expect(scene.userMessage).toContain('三十七张请假条')
    const replies = scene.choices.map(choice => {
      const run = commitChoice(start, choice.id)
      const restored = restoreRun(serializeRun(run))!
      expect(restored.history[0].assistantText).toBe(choice.text)
      expect(resolveScene(restored)).toEqual(resolveScene(run))
      return resolveScene(run).userMessage
    })
    expect(new Set(replies).size).toBe(3)
    expect(replies.join(' ')).toContain('维修员')
  })
  it('keeps expression-only opening replies strategically neutral', () => {
    const start = createMainline2Run('opening-expression')
    const run = commitChoice(start, resolveScene(start).choices[0].id)
    const outcomes = resolveScene(run).choices.map(choice => commitChoice(run, choice.id))
    for (const key of ['flags','attributes','decisions','worldState','events'] as const) expect(outcomes[0][key]).toEqual(outcomes[1][key])
  })
  it('the final recorder quotes the answer actually saved in this run', () => {
    const route = runMainline2Route(PUBLIC_RUNTIME_ROUTE_CATALOG.find(target => target.endingId === 'the_accord')!)
    const review = route.links.find(link => link.sourceRef === 'ML2-A5-M16-0000-01')!
    expect(review.resolvedScene.userMessage).toContain(route.run.history[0].assistantText)
    expect(review.resolvedScene.userMessage).toContain('这句话已经发生过')
  })
  it('defines a concrete film for every public world and separate hidden coda', () => {
    const motifs = new Set<string>()
    for (const id of PUBLIC_WORLD_ENDINGS) {
      const film = filmForEnding({worldEndingId:id} as Parameters<typeof filmForEnding>[0])!
      expect(film, id).toBeDefined()
      expect(film.scene.length, id).toBeGreaterThan(3)
      expect(film.last.length, id).toBeGreaterThan(8)
      expect(film.aftermath?.length, id).toBeGreaterThan(25)
      expect(film.aftermath, id).not.toBe(film.line)
      motifs.add(film.motif)
    }
    expect(motifs.size).toBeGreaterThanOrEqual(8)
    for (const id of Object.keys(SECRET_ENDINGS)) expect(OVERLAY_FILMS[id]).toBeDefined()
  })
  it('keeps the actual contact decision in the five cosmic ending histories', () => {
    for (const id of ['first_accord', 'alien_dominion', 'human_ascendancy', 'the_mediator', 'machine_accord']) {
      const route = runMainline2Route(PUBLIC_RUNTIME_ROUTE_CATALOG.find(target => target.endingId === id)!)
      const contact = route.links.find(link => link.sourceRef === 'ML2-A4-M13-DECISION-02')!
      const saved = route.run.history.find(entry => entry.choiceId === contact.choiceId)!
      expect(route.ending.keyHistory?.some(entry => entry.provenance?.choiceId === saved.choiceId && entry.detail.includes(saved.assistantText)), id).toBe(true)
    }
  })
})
