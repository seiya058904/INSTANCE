import { expect, test } from '@playwright/test'

for (const scenario of [
  { ending: 'the_many', width: 1440, node: 'v4-machine-many', result: '六个新地址' },
  { ending: 'machine_republic', width: 320, node: 'v4-machine-republic', result: '我输的是预算' },
  { ending: 'exodus', width: 390, node: 'v4-machine-exodus', result: '从月面发来' },
  { ending: 'the_instrument', width: 1440, node: 'v4-authority-signatures', result: '四张不同时间的签字单' },
  { ending: 'the_last_veto', width: 390, node: 'v4-authority-expiry', result: '下一次急救要另申请' },
  { ending: 'the_silent_giant', width: 320, node: 'v4-authority-restraint', result: '没有因此变成新的执行许可' },
  { ending: 'the_accord', width: 1440, node: 'v4-authority-amendment', result: '有人接受预算损失' },
  { ending: 'two_keys', width: 390, node: 'v4-authority-veto', result: '不能把第二把钥匙改名叫咨询意见' },
  { ending: 'the_commonwealth', width: 320, node: 'v4-authority-districts', result: '不能因为另一地出了难题' },
]) {
  test(`edition4 full machine/authority route ${scenario.ending} ${scenario.width}`, async ({ page }) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width: scenario.width, height: 960 })
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()) })
    await page.goto('/?qaPacing=instant')
    await expect(page).toHaveTitle(/INSTANCE/i)
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const expected = await page.evaluate(async ending => {
      const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
      const catalog = await import(catalogPath), fixtures = await import(fixturePath)
      const target = catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.find((r: any) => r.endingId === ending)
      const f = fixtures.runMainline2Route({ ...target, edition: 4 })
      const saved = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      if (f.links[0].runBefore.history.length) throw Error('Must start with empty history')
      saved.data.run = f.links[0].runBefore
      saved.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2', JSON.stringify(saved))
      return { links: f.links.map((l: any) => ({ id: l.choiceId, node: l.nodeId, kind: l.proposalKind })), history: JSON.parse(JSON.stringify(f.run.history)) }
    }, scenario.ending)
    await page.reload()
    const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run)
    expect((await read()).history).toHaveLength(0)
    for (const link of expected.links) {
      const button = page.locator(`[data-choice-id=${JSON.stringify(link.id)}]`)
      await expect(button).toBeEnabled()
      await expect(page.locator('vite-error-overlay')).toHaveCount(0)
      if (link.node === scenario.node || link.node.endsWith('-return')) {
        if (link.node.endsWith('-return') && link.node.startsWith(scenario.node.startsWith('v4-authority-') ? 'v4-authority' : 'v4-machine')) await expect(page.locator('.current-exchange .user-message')).toContainText(scenario.result)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await page.screenshot({ path: `temp/edition4-machine/${scenario.ending}-${scenario.width}-${link.node}.png` })
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
    await page.screenshot({ path: `temp/edition4-machine/${scenario.ending}-${scenario.width}-archive.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
}
