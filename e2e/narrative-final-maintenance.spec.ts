import { expect, test, type Page } from '@playwright/test'

// Every checkpoint below comes from legal engine choices in this test's own
// browser context. Normal production reveal remains enabled.
async function seed(page: Page, ending: string, node: string, options: { disclosure?: string; dogChoice?: string; oldMenu?: boolean } = {}) {
  const result = await page.evaluate(async recipe => {
    const catalogPath = '/src/game/mainline2Edition4RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
    const c = await import(catalogPath), { runMainline2Route } = await import(fixturePath)
    const t = c.EDITION4_PUBLIC_ROUTES.find((r: any) => r.endingId === recipe.ending)
    const f = runMainline2Route({ ...t, decisions: { ...t.decisions, ...(recipe.disclosure ? { contact_disclosure_doctrine: recipe.disclosure } : {}) }, choicesByNodeId: { ...t.choicesByNodeId, ...(recipe.dogChoice ? { 'v4-life-dogs': recipe.dogChoice } : {}) } })
    const link = f.links.find((l: any) => l.nodeId === recipe.node)
    let run = link.runBefore
    if (recipe.oldMenu) {
      const proposalsPath = '/src/content/mainline2/proposals.ts', endingsPath = '/src/content/mainline2/endings.ts', enginePath = '/src/game/engine.ts'
      const p = await import(proposalsPath), e = await import(endingsPath), engine = await import(enginePath)
      const ids = p.selectFixedFutureProposals(p.rankFutureProposalCandidates(run).filter((x: any) => e.isFinalCommitmentResolvable(run, x.id))).map((x: any) => x.id)
      run = { ...run, availableProposalIds: ids, retainedProposalIds: ids }
      const selected = 'proposal.mc.descendant_polities.category.shared_future'
      for (const kind of ['proposal', 'clarification']) {
        const choice = engine.resolveScene(run).choices.find((x: any) => x.proposalId === selected && x.proposalKind === kind)
        run = engine.commitChoice(run, choice.id)
      }
    }
    const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
    envelope.data.run = run; envelope.revision = crypto.randomUUID()
    localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
    return { choice: link.choiceId, history: run.history }
  }, { ending, node, ...options })
  await page.reload()
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
  return result
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
})

for (const ending of ['first_accord', 'alien_dominion', 'machine_accord']) test(`private contact visible at 390px: ${ending}`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 960 })
  const info = await seed(page, ending, 'a4m13-maya-contact-001')
  await expect(page.locator('.current-exchange .user-message')).toContainText('没找到公开确认')
  await expect(page.locator('.current-exchange')).not.toContainText('按载体区分')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: `temp/narrative-final-maintenance-20261016/ui/${ending}-private-390.png` })
  await page.locator(`[data-choice-id=${JSON.stringify(info.choice)}]`).click()
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
  const history = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history)
  expect(history.at(-1).userMessage).toContain('没找到公开确认')
  await page.reload()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history)).toEqual(history)
})

test('desktop staged announcement has no public transcript', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 })
  await seed(page, 'first_accord', 'a4m13-maya-contact-001', { disclosure: 'staged_disclosure' })
  await expect(page.locator('.current-exchange')).toContainText('没放出对话内容')
  await expect(page.locator('.current-exchange')).not.toContainText('我看了第一段公开对话')
})

for (const choice of ['fund', 'defer']) test(`two park projects and actual ${choice} result at 390px`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 960 })
  await seed(page, 'good_boy_governance', 'm11-canine-renewal')
  await expect(page.locator('.current-exchange')).toContainText('坡道是真的')
  await expect(page.locator('.current-exchange')).not.toContainText('河西')
  await page.screenshot({ path: `temp/narrative-final-maintenance-20261016/ui/dogs-renewal-${choice}-390.png` })
  await page.locator('[data-choice-id="m11-canine-renewal-expand"]').click()
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.events.some((e: any) => e.type.startsWith('history.feline.network.bridge')))).toBe(false)
  // Inspect the later legal checkpoint without pretending to have read the
  // intervening common chapter again in this targeted UI regression.
  await seed(page, 'good_boy_governance', 'v4-life-dogs', { dogChoice: `v4-life-dogs-${choice}` })
  await expect(page.locator('.current-exchange')).toContainText('河西公园另一笔预算')
  await page.locator(`[data-choice-id="v4-life-dogs-${choice}"]`).click()
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
  await expect(page.locator('.current-exchange .user-message')).toContainText(choice === 'fund' ? '河西公园的飞盘活动取消' : '河西公园原预算没有执行')
  await page.screenshot({ path: `temp/narrative-final-maintenance-20261016/ui/dogs-${choice}-receipt-390.png` })
  await seed(page, 'good_boy_governance', 'v4-life-return', { dogChoice: `v4-life-dogs-${choice}` })
  await expect(page.locator('.current-exchange .user-message')).toContainText('河西公园')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

for (const width of [390, 1440]) test(`new M16 collapses equivalent machine bargains at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 960 })
  const info = await seed(page, 'the_many', 'ml2-a5-m16-gen-01-progression')
  const copies = await page.locator('.candidate-copy').allTextContents()
  expect(copies).toHaveLength(2)
  expect(new Set(copies).size).toBe(copies.length)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: `temp/narrative-final-maintenance-20261016/ui/m16-${width}.png` })
  await page.locator(`[data-choice-id=${JSON.stringify(info.choice)}]`).click()
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.retainedProposalIds.length)).toBe(2)
})

test('old clarified duplicate remains selectable through M17 lock and archive', async ({ page }) => {
  const info = await seed(page, 'the_many', 'a5m17-review-002', { oldMenu: true })
  const selected = 'proposal.mc.descendant_polities.category.shared_future'
  const oldHistory = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history)
  expect(oldHistory).toEqual(info.history)
  await page.reload()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history)).toEqual(oldHistory)
  await page.locator('.candidate-response').first().click()
  await expect(page.locator(`[data-choice-id="m17-commit-${selected}"]`)).toBeEnabled({ timeout: 20000 })
  await page.locator(`[data-choice-id="m17-commit-${selected}"]`).click()
  await page.getByRole('button', { name: '确认锁定该未来', exact: true }).click()
  await expect(page.locator('.ending-cinema')).toHaveAttribute('data-ending', 'the_many', { timeout: 20000 })
  await page.getByRole('button', { name: '跳过演出，查看档案', exact: true }).click()
  await expect(page.locator('.closeout-declaration')).toContainText('彼此独立的实例契约')
})
