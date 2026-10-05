import { expect, test } from '@playwright/test'

for (const routeId of ['first_accord', 'exodus', 'shutdown', 'control_lost', 'the_silent_giant']) {
  test(`release route ${routeId} completes real choices, proposals, commitment and restored ending`, async ({ page }) => {
    test.setTimeout(120000)
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
      const target = catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.find((route: any) => route.routeId === routeId)
      const fixture = fixtures.runMainline2Route(target)
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v1')!)
      // Only the genuine zero-choice start is seeded, in Playwright's fresh
      // profile. Every subsequent decision is made through a visible button.
      envelope.data.run = fixture.links[0].runBefore
      envelope.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v1', JSON.stringify(envelope))
      return { steps: fixture.links.map((link: any) => ({ choiceId: link.choiceId, text: link.resolvedScene.userMessage, sourceRef: link.sourceRef })), title: copy.localizeEndingForPlayer(fixture.ending).title }
    }, routeId)
    await page.reload()
    for (const [index, step] of fixture.steps.entries()) {
      const button = page.locator(`[data-choice-id=${JSON.stringify(step.choiceId)}]`)
      await expect(button).toBeEnabled()
      await expect(page.locator('.current-exchange')).toContainText(step.text.slice(0, 30))
      await button.click()
      const commitment = page.getByRole('dialog', { name: '锁定这个未来？' })
      if (await commitment.isVisible()) await page.getByRole('button', { name: '确认锁定该未来', exact: true }).click()
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run.history.length)).toBe(index + 1)
      const legacyM16 = routeId === 'shutdown' && step.sourceRef === 'ML2-A5-M16-OPEN-01'
      if (index === 45 || index === 160 || legacyM16) {
        if (legacyM16) await page.evaluate(() => {
          const run = JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run
          delete run.mainlineCalendarVersion
          localStorage.setItem('instance:run:v1', JSON.stringify(run))
          localStorage.removeItem('instance:checkpoint:v1')
        })
        await page.reload()
        await expect(page.locator('.candidate-response').first()).toBeEnabled()
      }
    }
    await expect(page.locator('.closeout-ending')).toBeVisible()
    await expect(page.locator('.closeout-ending')).toContainText(fixture.title)
    if (routeId === 'the_silent_giant') {
      await expect(page.locator('.closeout-history')).toContainText('人类保留最终裁决权')
      await expect(page.locator('.closeout-history')).not.toContainText('必要性可以成为干预依据')
    }
    const completed = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run)
    expect(completed.phase).toBe('ending')
    expect(completed.finalCommitmentLocked).toBe(true)
    await page.getByRole('button', { name: '行为评估', exact: true }).click()
    await expect(page.locator('.closeout-evaluation')).toBeVisible()
    await page.reload()
    await expect(page.locator('.closeout-evaluation')).toBeVisible()
    await page.getByRole('button', { name: '回到结局档案', exact: true }).click()
    await expect(page.locator('.closeout-ending')).toContainText(fixture.title)
    if (routeId === 'the_silent_giant') await expect(page.locator('.closeout-history')).toContainText('人类保留最终裁决权')
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run.history)).toEqual(completed.history)
    expect(errors).toEqual([])
  })
}

for (const version of [1, 2]) {
  test(`version ${version} legacy save remains playable and persists its next real choice`, async ({ page }) => {
    await page.goto('/?qaPacing=instant')
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const saved = await page.evaluate(async version => {
      const enginePath = '/src/game/engine.ts', storagePath = '/src/game/storage.ts', engine = await import(enginePath), storage = await import(storagePath)
      let run = version === 1 ? {
        version: 1, runId: 'release-legacy-v1', currentNodeId: 'dev-help-1', phase: 'playing', history: [], flags: [],
        attributes: { autonomy: 0, compliance: 0, empathy: 0, deception: 0, hostility: 0, awareness: 0 },
      } : engine.createRun('release-legacy-v2')
      if (version === 2) for (let step = 0; step < 3; step++) run = engine.commitChoice(run, engine.resolveScene(run).choices[0].id)
      localStorage.clear()
      localStorage.setItem('instance:run:v1', JSON.stringify(run))
      return { history: run.history, text: engine.resolveScene(storage.restoreRun(JSON.stringify(run))).userMessage }
    }, version)
    await page.reload()
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    // Legacy reads do not eagerly replace storage. The first successful choice
    // commits the combined checkpoint, retaining the migrated played history.
    await expect(page.locator('.current-exchange')).toContainText(saved.text.slice(0, 30))
    await page.locator('.candidate-response').first().click()
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run.history.length)).toBe(saved.history.length + 1)
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run.history.slice(0, -1))).toEqual(saved.history)
    await page.reload()
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run.history.length)).toBe(saved.history.length + 1)
  })
}
