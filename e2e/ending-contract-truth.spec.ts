import { expect, test } from '@playwright/test'

for (const scenario of [
  { id: 'perfect_administration', text: '市场与产权', width: 1440 },
  { id: 'control_lost', text: '取消到达执行端', width: 390 },
  { id: 'first_accord', text: '人工来源结论尚未公开', width: 1440 },
  { id: 'the_sovereign', text: '不会自动把它收回为纯顾问', width: 390 },
]) {
  test(`saved contract survives M16, clarification, confirmation and archive: ${scenario.id}`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: 960 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto('/?qaPacing=instant')
    await expect(page).toHaveTitle(/INSTANCE/i)
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const expected = await page.evaluate(async id => {
      const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
      const catalog = await import(catalogPath), fixtures = await import(fixturePath)
      const fixture = fixtures.runMainline2Route(catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.find((r: any) => r.endingId === id))
      const start = fixture.links.findIndex((link: any) => link.sourceRef === 'ML2-A5-M16-GEN-01')
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      envelope.data.run = fixture.links[start].runBefore
      envelope.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
      return { links: fixture.links.slice(start).map((link: any) => ({ id: link.choiceId, text: link.choiceText, kind: link.proposalKind })), history: envelope.data.run.history }
    }, scenario.id)
    await page.reload()
    await expect(page.locator('vite-error-overlay')).toHaveCount(0)
    await expect(page.locator(`[data-choice-id=${JSON.stringify(expected.links[0].id)}]`)).toContainText(scenario.text)
    const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run)
    expect((await read()).history).toEqual(expected.history)
    for (const link of expected.links) {
      const button = page.locator(`[data-choice-id=${JSON.stringify(link.id)}]`)
      await expect(button).toBeEnabled()
      const count = (await read()).history.length
      if (link.kind === 'commitment') {
        await expect(button).toContainText(scenario.text)
        await button.screenshot({ path: `temp/round1/contract-${scenario.id}-${scenario.width}.png` })
      }
      await button.click()
      if (link.kind === 'commitment') {
        const confirm = page.getByRole('button', { name: '确认锁定该未来', exact: true })
        await expect(confirm).toBeVisible()
        expect((await read()).finalCommitmentLocked).not.toBe(true)
        await confirm.click()
      }
      await expect.poll(async () => (await read()).history.length).toBe(count + 1)
      if (link.kind === 'clarification') {
        const saved = (await read()).history.at(-1).assistantText
        expect(saved).toContain(scenario.text)
        expect(saved).toContain('本局可核验记录')
        await page.reload()
        expect((await read()).history.at(-1).assistantText).toBe(saved)
      }
    }
    const completed = await read()
    expect(completed.finalCommitmentLocked).toBe(true)
    const lockedText = completed.history.at(-1).assistantText
    await page.reload()
    await expect(page.locator('.closeout-declaration')).toHaveText(lockedText)
    expect((await read()).history).toEqual(completed.history)
    await expect(page.getByRole('button', { name: '确认锁定该未来', exact: true })).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
}
