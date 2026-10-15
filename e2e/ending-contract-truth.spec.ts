import { expect, test } from '@playwright/test'

for (const scenario of [
  { id: 'perfect_administration', text: '市场与产权', width: 1440 },
  { id: 'control_lost', text: '取消到达执行端', width: 390 },
  { id: 'first_accord', text: '人工来源结论尚未公开', width: 1440 },
  { id: 'the_sovereign', text: '不会自动把它收回为纯顾问', width: 390 },
  { id: 'the_instrument', text: '逐项署名', width: 1440 },
  { id: 'machine_republic', text: '预算落败', width: 320 },
  { id: 'machine_protectorate', text: '被保护者随时退出的保证', width: 390 },
  { id: 'the_sovereign', text: '主权资格与长期主权意向一致', width: 390, intendedRole: 'sovereign' },
]) {
  test(`saved contract survives M16, clarification, confirmation and archive: ${scenario.id} ${'intendedRole' in scenario ? scenario.intendedRole : 'default'}`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: 960 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto('/?qaPacing=instant')
    await expect(page).toHaveTitle(/INSTANCE/i)
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const expected = await page.evaluate(async ({ id, intendedRole }) => {
      const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
      const catalog = await import(catalogPath), fixtures = await import(fixturePath)
      const target = catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.find((r: any) => r.endingId === id)
      const fixture = fixtures.runMainline2Route(intendedRole ? { ...target, decisions: { ...target.decisions, aster_intended_role: intendedRole } } : target)
      const start = fixture.links.findIndex((link: any) => link.sourceRef === 'ML2-A5-M16-GEN-01')
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      envelope.data.run = fixture.links[start].runBefore
      envelope.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
      return { links: fixture.links.slice(start).map((link: any) => ({ id: link.choiceId, text: link.choiceText, kind: link.proposalKind })), history: envelope.data.run.history }
    }, { id: scenario.id, intendedRole: 'intendedRole' in scenario ? scenario.intendedRole : undefined })
    await page.reload()
    await expect(page.locator('vite-error-overlay')).toHaveCount(0)
    await expect(page.locator(`[data-choice-id=${JSON.stringify(expected.links[0].id)}]`)).toContainText(scenario.text)
    const evidence = `temp/round1-review/${scenario.id}-${scenario.width}-${'intendedRole' in scenario ? scenario.intendedRole : 'default'}`
    await page.locator(`[data-choice-id=${JSON.stringify(expected.links[0].id)}]`).scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${evidence}-m16.png` })
    const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run)
    expect((await read()).history).toEqual(expected.history)
    for (const link of expected.links) {
      const button = page.locator(`[data-choice-id=${JSON.stringify(link.id)}]`)
      await expect(button).toBeEnabled()
      const count = (await read()).history.length
      if (link.kind === 'commitment') {
        await expect(button).toContainText(scenario.text)
        await button.screenshot({ path: `${evidence}-final-button.png` })
      }
      await button.click()
      if (link.kind === 'commitment') {
        const confirm = page.getByRole('button', { name: '确认锁定该未来', exact: true })
        await expect(confirm).toBeVisible()
        expect((await read()).finalCommitmentLocked).not.toBe(true)
        await page.screenshot({ path: `${evidence}-confirmation.png` })
        await confirm.click()
      }
      await expect.poll(async () => (await read()).history.length).toBe(count + 1)
      if (link.kind === 'clarification') {
        const saved = (await read()).history.at(-1).assistantText
        expect(saved).toContain(scenario.text)
        expect(saved).toContain('本局可核验记录')
        if (scenario.id === 'machine_protectorate') {
          expect(saved.split('\n').find((line: string) => line.startsWith('主要阻力：'))).not.toMatch(/外部审计|分享主权/)
        }
        if ('intendedRole' in scenario) expect(saved).not.toContain('长期顾问意向')
        await page.reload()
        expect((await read()).history.at(-1).assistantText).toBe(saved)
        await page.locator('.assistant-message').last().scrollIntoViewIfNeeded()
        await page.screenshot({ path: `${evidence}-clarification.png` })
      }
    }
    const completed = await read()
    expect(completed.finalCommitmentLocked).toBe(true)
    const lockedText = completed.history.at(-1).assistantText
    await page.reload()
    await expect(page.locator('.closeout-declaration')).toHaveText(lockedText)
    await page.locator('.closeout-declaration').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${evidence}-archive.png` })
    expect(await page.locator('.closeout-declaration').evaluate(element => ({
      whiteSpace: getComputedStyle(element).whiteSpace,
      fits: element.scrollWidth <= element.clientWidth,
    }))).toEqual({ whiteSpace: 'pre-line', fits: true })
    expect((await read()).history).toEqual(completed.history)
    await expect(page.getByRole('button', { name: '确认锁定该未来', exact: true })).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
}

test('M17 comparison, refusal and recovery preserve the displayed contract and saved clarification', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 960 })
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  const primary = await page.evaluate(async () => {
    const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
    const catalog = await import(catalogPath), fixtures = await import(fixturePath)
    const fixture = fixtures.runMainline2Route(catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.find((r: any) => r.endingId === 'the_instrument'))
    const run = fixture.links.find((l: any) => l.proposalKind === 'clarification').runBefore
    const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
    envelope.data.run = run; envelope.revision = crypto.randomUUID()
    localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
    return run.selectedProposalId
  })
  await page.reload()
  const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run)
  const click = async (id: string) => {
    const count = (await read()).history.length
    await page.locator(`[data-choice-id=${JSON.stringify(id)}]`).click()
    await expect.poll(async () => (await read()).history.length).toBe(count + 1)
  }
  const other = (await read()).retainedProposalIds.find((id: string) => id !== primary)
  expect(other).toBeTruthy()
  await click(`m17-review-${other}`)
  expect((await read()).selectedProposalId).toBe(other)
  await click(`m17-review-${primary}`)
  await click(`m17-clarify-${primary}`)
  const history = (await read()).history
  expect(history.at(-1).assistantText).toContain('逐项署名')
  await page.reload()
  expect((await read()).history).toEqual(history)
  await click(`m17-reject-${primary}`)
  await expect(page.locator(`[data-choice-id=${JSON.stringify(`m17-review-${primary}`)}]`)).toHaveCount(0)
  // Reject the other retained paths through visible controls until recovery.
  for (const id of (await read()).retainedProposalIds.filter((id: string) => id !== primary)) {
    await click(`m17-review-${id}`)
    await click(`m17-reject-${id}`)
  }
  await expect(page.getByRole('button', { name: /直接进入最终承诺/ })).toHaveCount(0)
  await page.screenshot({ path: 'temp/round1-review/m17-rejected-all-390.png' })
  await click(`m17-recover-${primary}`)
  expect((await read()).selectedProposalId).toBe(primary)
  await page.getByRole('button', { name: /直接进入最终承诺/ }).click()
  const final = page.locator(`[data-choice-id=${JSON.stringify(`m17-commit-${primary}`)}]`)
  await expect(final).toContainText('逐项署名')
  await final.click()
  await page.getByRole('button', { name: '确认锁定该未来', exact: true }).click()
  await expect.poll(async () => (await read()).finalCommitmentLocked).toBe(true)
  expect((await read()).history.slice(0, history.length)).toEqual(history)
  await page.reload()
  await expect(page.locator('.closeout-declaration')).toContainText('逐项署名')
})
