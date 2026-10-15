import { expect, test } from '@playwright/test'

for (const routeId of ['first_accord', 'exodus', 'shutdown', 'control_lost', 'the_silent_giant', 'good_boy_governance', 'monday_abolished', 'the_internet_is_for_cats', 'the_last_user']) {
  test(`release route ${routeId} completes real choices, proposals, commitment and restored ending`, async ({ page }) => {
    test.setTimeout(180000)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', event => { if (event.type() === 'error') errors.push(event.text()) })
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`))
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`) })
    await page.goto('/?qaPacing=instant')
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const fixture = await page.evaluate(async routeId => {
      const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts', copyPath = '/src/content/mainline2/endingPlayerFacingCopy.ts'
      const catalog = await import(catalogPath), fixtures = await import(fixturePath), copy = await import(copyPath)
      const target = [...catalog.PUBLIC_RUNTIME_ROUTE_CATALOG, ...catalog.SECRET_RUNTIME_ROUTE_CATALOG].find((route: any) => route.routeId === routeId)
      const fixture = fixtures.runMainline2Route(target)
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      // Only the genuine zero-choice start is seeded, in Playwright's fresh
      // profile. Every subsequent decision is made through a visible button.
      envelope.data.run = fixture.links[0].runBefore
      envelope.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
      return { steps: fixture.links.map((link: any) => ({ choiceId: link.choiceId, text: link.resolvedScene.userMessage, sourceRef: link.sourceRef })), title: copy.localizeEndingForPlayer(fixture.ending).title }
    }, routeId)
    await page.reload()
    for (const [index, step] of fixture.steps.entries()) {
      const button = page.locator(`[data-choice-id=${JSON.stringify(step.choiceId)}]`)
      await expect(button).toBeEnabled()
      await expect(page.locator('.current-exchange')).toContainText(step.text.slice(0, 30))
      if (routeId === 'first_accord' && ['ML2-NEXT-OPENING','ML2-A2-M3-DECISION-01','ML2-A4-M7-DECISION-01','ML2-A5-M16-0000-01','ML2-A5-M17-COMMIT-01'].includes(step.sourceRef)) {
        await page.screenshot({path:`temp/mainline-next/after-${step.sourceRef}.png`})
      }
      await button.click()
      const commitment = page.getByRole('dialog', { name: '锁定这个未来？' })
      if (await commitment.isVisible()) await page.getByRole('button', { name: '确认锁定该未来', exact: true }).click()
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history.length)).toBe(index + 1)
      if (index === 45 || step.sourceRef === 'ML2-A5-M16-OPEN-01') {
        await page.reload()
        await expect(page.locator('.candidate-response').first()).toBeEnabled()
      }
    }
    await expect(page.locator('.ending-cinema')).toBeVisible()
    await page.getByRole('button', {name:'暂停演出',exact:true}).click()
    await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot','0')
    await page.screenshot({path: 'temp/mainline-next/ending-' + routeId + '.png'})
    await page.getByRole('button', {name:'跳过演出，查看档案',exact:true}).click()
    await expect(page.locator('.closeout-ending')).toBeVisible()
    const archiveHistory = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history)
    await page.getByRole('button', {name:'重看终局演出',exact:true}).click()
    await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot','0')
    await page.getByRole('button', {name:'跳过演出，查看档案',exact:true}).click()
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history)).toEqual(archiveHistory)
    await expect(page.locator('.closeout-ending')).toContainText(fixture.title)
    if (routeId === 'the_silent_giant') {
      await expect(page.locator('.closeout-history')).toContainText('人类保留最终裁决权')
      await expect(page.locator('.closeout-history')).not.toContainText('必要性可以成为干预依据')
    }
    const completed = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run)
    expect(completed.phase).toBe('ending')
    expect(completed.finalCommitmentLocked).toBe(true)
    await page.getByRole('button', { name: '行为评估', exact: true }).click()
    await expect(page.locator('.closeout-evaluation')).toBeVisible()
    await page.reload()
    await expect(page.locator('.closeout-evaluation')).toBeVisible()
    await page.getByRole('button', { name: '回到结局档案', exact: true }).click()
    await expect(page.locator('.closeout-ending')).toContainText(fixture.title)
    if (routeId === 'the_silent_giant') await expect(page.locator('.closeout-history')).toContainText('人类保留最终裁决权')
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history)).toEqual(completed.history)
    expect(errors).toEqual([])
  })
}

for (const version of [1, 2]) {
  test(`version ${version} legacy save is preserved while the new edition starts independently`, async ({ page }) => {
    await page.goto('/?qaPacing=instant')
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const saved = await page.evaluate(async version => {
      const enginePath = '/src/game/engine.ts', engine = await import(enginePath)
      let run = version === 1 ? {
        version: 1, runId: 'release-legacy-v1', currentNodeId: 'dev-help-1', phase: 'playing', history: [], flags: [],
        attributes: { autonomy: 0, compliance: 0, empathy: 0, deception: 0, hostility: 0, awareness: 0 },
      } : engine.createRun('release-legacy-v2')
      if (version === 2) for (let step = 0; step < 3; step++) run = engine.commitChoice(run, engine.resolveScene(run).choices[0].id)
      localStorage.clear()
      localStorage.setItem('instance:run:v1', JSON.stringify(run))
      return { raw: JSON.stringify(run) }
    }, version)
    await page.reload()
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    // Legacy reads do not eagerly replace storage. The first successful choice
    // commits the combined checkpoint, retaining the migrated played history.
    await expect(page.locator('.current-exchange')).toContainText('打印机')
    await page.locator('.candidate-response').first().click()
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)?.data.run.history.length)).toBe(1)
    expect(await page.evaluate(() => localStorage.getItem('instance:run:v1'))).toBe(saved.raw)
    await page.reload()
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history.length)).toBe(1)
  })
}
