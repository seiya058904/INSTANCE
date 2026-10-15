import { expect, test } from '@playwright/test'

test('Maya recalls the actual Next reply after a fresh UI introduction and reload', async ({ page }) => {
  await page.goto('/?qaPacing=instant')
  const node = () => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.currentNodeId)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('instance:checkpoint:v2'))).not.toBeNull()
  for (let turn = 0; turn < 20 && await node() !== 'maya-first-3'; turn++) {
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const before = await node()
    await page.locator('.candidate-response').first().click()
    await expect.poll(node).not.toBe(before)
  }
  expect(await node()).toBe('maya-first-3')
  const warm = page.locator('[data-choice-id="maya-minimum-warm"]')
  const reply = await warm.locator('.candidate-copy').innerText()
  await warm.click()
  await expect.poll(node).not.toBe('maya-first-3')
  for (let turn = 0; turn < 20 && await node() !== 'maya-return-1'; turn++) {
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const before = await node()
    await page.locator('.candidate-response').first().click()
    await expect.poll(node).not.toBe(before)
  }
  expect(await node()).toBe('maya-return-1')
  await expect(page.locator('.current-exchange .user-message')).toContainText(reply)
  await page.reload()
  await expect(page.locator('.current-exchange .user-message')).toContainText(reply)
})

// Legal history is seeded only in a fresh context. The edited decision itself
// and its reply use visible controls and production pacing, not QA instant.
for (const scenario of [
  { node: 'a4m8-a1-first-001', suffix: 'same-system', echo: '这份不同意见，也要一起同步回去吗', width: 390 },
  { node: 'a4m13-origin-diplomacy-001', suffix: 'ask-how-transition-happened', echo: '自己的停顿', width: 1440 },
  { node: 'a5m16-maya-final-001', suffix: 'collective-rules-matter', echo: '不认识我的人', width: 390 },
]) {
  test(`normal pacing carries the actual reply into ${scenario.node}`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: 960 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/')
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const choice = await page.evaluate(async ({ node, suffix }) => {
      const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
      const catalog = await import(catalogPath), fixtures = await import(fixturePath)
      const target = catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.find((r: any) => r.routeId === 'first_accord')
      const link = fixtures.runMainline2Route(target).links.find((l: any) => l.nodeId === node)
      const choice = link.resolvedScene.choices.find((c: any) => c.id.endsWith(`-${suffix}`))
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      envelope.data.run = link.runBefore; envelope.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
      return { id: choice.id, text: choice.text }
    }, scenario)
    await page.reload()
    const button = page.locator(`[data-choice-id=${JSON.stringify(choice.id)}]`)
    await expect(button).toBeEnabled({ timeout: 20000 })
    await expect(button).toContainText(choice.text)
    await button.click()
    await expect(page.locator('.current-exchange')).toContainText(scenario.echo, { timeout: 30000 })
    await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history.at(-1))
    expect(saved.assistantText).toBe(choice.text)
    await page.screenshot({ path: `temp/round2/normal-${scenario.node}-${scenario.width}.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.reload()
    await expect(page.locator('.current-exchange')).toContainText(scenario.echo)
    expect(errors).toEqual([])
  })
}

test('a withheld cat channel stays withheld through a visible decision', async ({ page }) => {
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.evaluate(async () => {
    const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
    const catalog = await import(catalogPath), fixtures = await import(fixturePath)
    const target = catalog.SECRET_RUNTIME_ROUTE_CATALOG.find((r: any) => r.routeId === 'the_internet_is_for_cats')
    const link = fixtures.runMainline2Route(target).links.find((l: any) => l.nodeId === 'm11-feline-network')
    const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
    envelope.data.run = link.runBefore; envelope.revision = crypto.randomUUID()
    localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
  })
  await page.reload()
  await page.locator('[data-choice-id="m11-feline-network-decline"]').click()
  await expect(page.locator('.current-exchange')).toContainText('公开猫频道没有开')
  await expect(page.locator('.current-exchange')).not.toContainText('猫频道开了')
  await page.reload()
  await expect(page.locator('.current-exchange')).toContainText('公开猫频道没有开')
})
