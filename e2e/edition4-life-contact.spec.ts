import { expect, test } from '@playwright/test'

const cases = [
  { ending: 'age_of_miracles', width: 390, node: 'v4-life-therapy', receipt: '晚上自己端起了碗', revisit: '普通餐桌', allocation: 'clinic', project: 'bodies' },
  { ending: 'ascension', width: 320, node: 'v4-life-forms', receipt: '进了核心项目', revisit: '老键盘', allocation: 'clinic', project: 'bodies' },
  { ending: 'the_upload', width: 1440, node: 'v4-life-continuity', receipt: '副本拿到自己的地址', revisit: '三个可以分别关上的门', allocation: 'clinic', project: 'persons' },
  { ending: 'parliament_of_species', width: 390, node: 'v4-life-parliament', receipt: '预算表决延了三周', revisit: '核对彼此的损失', allocation: 'wetland' },
  { ending: 'earth_without_owners', width: 320, node: 'v4-life-corridor', receipt: '沟渠维修由基金支付', revisit: '基金付了维修费', allocation: 'wetland' },
  { ending: 'good_boy_governance', width: 1440, node: 'v4-life-dogs', receipt: '反对票确实改变了支出', revisit: '空活动场', allocation: 'wetland' },
  { ending: 'first_accord', width: 390, node: 'v4-contact-reciprocal', receipt: '数据实际交换', revisit: '拒绝了一次' },
  { ending: 'alien_dominion', width: 320, node: 'v4-contact-guidance', receipt: '修改实际停在队列里', revisit: '实际障碍' },
  { ending: 'human_ascendancy', width: 1440, node: 'v4-contact-assertion', receipt: '耗去三成额外燃料', revisit: '不再穿过他者通道' },
  { ending: 'the_mediator', width: 768, node: 'v4-contact-mediation', receipt: '两边分别确认了保压', revisit: '不能互相替代的授权' },
  { ending: 'machine_accord', width: 390, node: 'v4-contact-machine', receipt: '运输、供电接口仍锁着', revisit: '否决了一个公共排班建议' },
  { ending: 'alien_dominion', width: 1440, node: 'v4-contact-guidance', receipt: '停了六周', revisit: '没有因此永久欠出自己的决定权', resist: true },
  { ending: 'the_commonwealth', width: 320, node: 'v4-frontier-no-contact', receipt: '真的休了假', revisit: '居民的周末', noContact: true },
]
for (const scenario of cases) {
  test(`edition4 full life/contact ${scenario.ending} ${scenario.width}`, async ({ page }) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width: scenario.width, height: 960 })
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()) })
    await page.goto('/?qaPacing=instant')
    await expect(page).toHaveTitle(/INSTANCE/i)
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const expected = await page.evaluate(async recipe => {
      const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
      const catalog = await import(catalogPath), fixtures = await import(fixturePath)
      const original = catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.find((r: any) => r.endingId === recipe.ending)
      const f = fixtures.runMainline2Route({ ...original, edition: 4,
        decisions: { ...original.decisions, ...(recipe.noContact ? { act4_research_emphasis: 'frontier_science' } : {}) },
        choicesByNodeId: { ...original.choicesByNodeId,
          ...(recipe.allocation ? { 'v4-life-allocation': `v4-life-${recipe.allocation}` } : {}),
          ...(recipe.project ? { 'v4-life-clinic-next': `v4-life-${recipe.project}` } : {}),
          ...(recipe.resist ? { 'v4-contact-guidance': 'v4-contact-guidance-wait' } : {}),
          ...(recipe.noContact ? { 'v4-frontier-allocation': 'v4-frontier-home' } : {}),
        },
      })
      if (f.ending.worldEndingId !== (recipe.resist ? 'first_accord' : recipe.ending)) throw Error('Unexpected legal route ending')
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      if (f.links[0].runBefore.history.length) throw Error('Must begin empty')
      envelope.data.run = f.links[0].runBefore
      envelope.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
      return { links: f.links.map((l: any) => ({ id: l.choiceId, node: l.nodeId, kind: l.proposalKind })), history: JSON.parse(JSON.stringify(f.run.history)) }
    }, { ending: scenario.ending, allocation: 'allocation' in scenario ? scenario.allocation : undefined, project: 'project' in scenario ? scenario.project : undefined, resist: 'resist' in scenario && scenario.resist, noContact: 'noContact' in scenario && scenario.noContact })
    await page.reload()
    const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run)
    expect((await read()).history).toHaveLength(0)
    for (const link of expected.links) {
      const button = page.locator(`[data-choice-id=${JSON.stringify(link.id)}]`)
      await expect(button).toBeEnabled()
      await expect(page.locator('vite-error-overlay')).toHaveCount(0)
      if (link.node === `${scenario.node}-receipt`) await expect(page.locator('.current-exchange .user-message')).toContainText(scenario.receipt)
      if (link.node === (scenario.node.startsWith('v4-life-') ? 'v4-life-return' : 'v4-contact-return')) await expect(page.locator('.current-exchange .user-message')).toContainText(scenario.revisit)
      if (link.node === scenario.node || link.node === `${scenario.node}-receipt`) {
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await page.screenshot({ path: `temp/edition4-life-contact/${scenario.ending}-${scenario.width}-${link.node}.png` })
      }
      const count = (await read()).history.length
      await button.click()
      if (link.kind === 'commitment') await page.getByRole('button', { name: '确认锁定该未来', exact: true }).click()
      await expect.poll(async () => (await read()).history.length).toBe(count + 1)
      if (link.node === scenario.node) {
        const before = await read()
        await page.reload()
        await expect(page.locator('.candidate-response').first()).toBeEnabled()
        expect((await read()).history).toEqual(before.history)
      }
    }
    expect((await read()).history).toEqual(expected.history)
    await page.reload()
    await expect(page.locator('.closeout-declaration')).toBeVisible()
    await expect(page.locator('.ending-key-history')).toContainText(scenario.receipt)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `temp/edition4-life-contact/${scenario.ending}-${scenario.width}-archive.png` })
    expect(errors).toEqual([])
  })
}
