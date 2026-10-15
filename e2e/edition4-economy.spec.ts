import { expect, test } from '@playwright/test'

for (const scenario of [
  { ending: 'post_scarcity', width: 1440, receipt: '保障金', revisit: '冰箱里还有' },
  { ending: 'perfect_administration', width: 390, receipt: '汤还热', revisit: '又去吃了一次' },
  { ending: 'im_lovin_it', width: 320, receipt: '六份食材', revisit: '第二锅汤' },
]) {
  test(`edition4 from empty history to archive: ${scenario.ending} ${scenario.width}`, async ({ page }) => {
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
      const fixture = fixtures.runMainline2Route({ ...target, edition: 4 })
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      // Only seed a fresh, empty run for deterministic ordinary conversation
      // ordering. All subsequent turns are real visible button clicks.
      if (fixture.links[0].runBefore.history.length) throw Error('Must begin empty')
      envelope.data.run = fixture.links[0].runBefore
      envelope.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
      return { links: fixture.links.map((l: any) => ({ id: l.choiceId, node: l.nodeId, kind: l.proposalKind })), history: JSON.parse(JSON.stringify(fixture.run.history)) }
    }, scenario.ending)
    await page.reload()
    const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run)
    expect((await read()).history).toHaveLength(0)
    const evidence = `temp/edition4-economy/${scenario.ending}-${scenario.width}`
    await page.screenshot({ path: `${evidence}-opening.png` })
    for (const link of expected.links) {
      await expect(page.locator('vite-error-overlay')).toHaveCount(0)
      const button = page.locator(`[data-choice-id=${JSON.stringify(link.id)}]`)
      await expect(button).toBeEnabled()
      if (link.node.startsWith('v4-')) {
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        if (/^v4-econ-(occupation|detour|menu)-receipt$/.test(link.node)) await expect(page.locator('.user-message').last()).toContainText(scenario.receipt)
        if (link.node === 'v4-econ-return') await expect(page.locator('.user-message').last()).toContainText(scenario.revisit)
        await button.scrollIntoViewIfNeeded()
        await page.screenshot({ path: `${evidence}-${link.node}.png` })
      }
      const count = (await read()).history.length
      await button.click()
      if (link.kind === 'commitment') {
        const confirm = page.getByRole('button', { name: '确认锁定该未来', exact: true })
        await expect(confirm).toBeVisible()
        await page.screenshot({ path: `${evidence}-confirmation.png` })
        await confirm.click()
      }
      await expect.poll(async () => (await read()).history.length).toBe(count + 1)
      if (link.id.startsWith('v4-') && !link.id.includes('receipt') && !link.id.includes('return')) {
        const before = await read()
        await page.reload()
        await expect(page.locator('.candidate-response').first()).toBeEnabled()
        expect((await read()).history).toEqual(before.history)
      }
    }
    expect((await read()).history).toEqual(expected.history)
    expect((await read()).mainlineCalendarVersion).toBe(4)
    await page.reload()
    await expect(page.locator('.closeout-declaration')).toBeVisible()
    await page.screenshot({ path: `${evidence}-archive.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
}
