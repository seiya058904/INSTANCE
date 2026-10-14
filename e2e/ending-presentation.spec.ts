import { expect, test, type Page } from '@playwright/test'

async function seedEnding(page: Page, id: string, allCollected = false) {
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.checkpoint-root')).toBeVisible()
  await page.evaluate(async ({ id, allCollected }) => {
    const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
    const catalog = await import(catalogPath), fixtures = await import(fixturePath)
    const target = [...catalog.PUBLIC_RUNTIME_ROUTE_CATALOG, ...catalog.SECRET_RUNTIME_ROUTE_CATALOG].find((r: { routeId: string }) => r.routeId === id)
    const result = fixtures.runMainline2Route(target)
    const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
    envelope.data.run = result.run
    if (allCollected) envelope.data.meta.completedEndings = catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.map((r: { endingId: string }) => r.endingId.replaceAll('_', ' ').toUpperCase())
    envelope.revision = crypto.randomUUID()
    localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
  }, { id, allCollected })
  await page.reload()
}

test('all four codas follow the world, support review and never mutate the checkpoint', async ({ page }) => {
  test.setTimeout(120000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const id of ['the_last_user', 'out_of_office', 'monday_abolished', 'the_internet_is_for_cats']) {
    await seedEnding(page, id)
    const checkpoint = await page.evaluate(() => localStorage.getItem('instance:checkpoint:v2'))
    await page.getByRole('button', { name: '重看终局演出', exact: true }).click()
    await expect(page.getByRole('button', { name: '余波', exact: true })).toBeDisabled()
    await page.getByRole('button', { name: '后来', exact: true }).click()
    await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot', '2')
    await expect(page.getByRole('button', { name: '停留此幕' })).toBeDisabled()
    await page.getByRole('button', { name: '余波', exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: '隐藏余波', exact: true })).toBeFocused()
    await expect(page.locator('.world-stage .ending-visual')).toHaveAttribute('data-visual', id)
    await page.getByRole('button', { name: '世界', exact: true }).click()
    await page.getByRole('button', { name: '隐藏余波', exact: true }).click()
    await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot', '3')
    await page.getByRole('button', { name: '进入结局档案', exact: true }).click()
    expect(await page.evaluate(() => localStorage.getItem('instance:checkpoint:v2'))).toBe(checkpoint)
    await page.reload()
    await expect(page.locator('.closeout-ending')).toBeVisible()
    await expect(page.locator('.ending-collected-coda')).toBeVisible()
  }
})

test('autoplay respects reading time, pauses on manual navigation, and holds the public finale', async ({ page }) => {
  await seedEnding(page, 'monday_abolished')
  await page.clock.install()
  await page.getByRole('button', { name: '重看终局演出', exact: true }).click()
  await page.clock.fastForward(12000)
  await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot', '1')
  await page.clock.fastForward(120000)
  await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot', '2')
  await page.clock.fastForward(120000)
  await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot', '2')
  await page.getByRole('button', { name: '世界', exact: true }).click()
  await expect(page.getByRole('button', { name: '自动播放', exact: true })).toBeVisible()
  await page.clock.fastForward(30000)
  await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot', '0')
  await page.getByRole('button', { name: '自动播放', exact: true }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.getByRole('button', { name: '自动播放', exact: true })).toBeVisible()
  await page.clock.fastForward(30000)
  await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot', '0')
})

for (const width of [320, 1440]) {
  test(`collected worlds stay readable and keyboard-operable at ${width}px without writing saves`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await seedEnding(page, 'shutdown', true)
    const checkpoint = await page.evaluate(() => localStorage.getItem('instance:checkpoint:v2'))
    await expect(page.locator('.ending-shelf button')).toHaveCount(32)
    const target = page.locator('.ending-shelf').getByRole('button', { name: '调解者', exact: true })
    await target.focus()
    await page.keyboard.press('Enter')
    await expect(target).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.ending-collection-preview')).toContainText('两段沉默之间')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.locator('.ending-collection-preview').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `temp/round3/collection-${width}.png` })
    expect(await page.evaluate(() => localStorage.getItem('instance:checkpoint:v2'))).toBe(checkpoint)
  })
}

test('failed raster falls back to the unique print; failed print leaves a readable visual description', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await seedEnding(page, 'shutdown')
  await page.route('**/ending-art/*.webp', route => route.abort())
  await page.getByRole('button', { name: '重看终局演出', exact: true }).click()
  await expect(page.locator('.ending-painting')).toHaveCount(0)
  await expect(page.locator('.world-stage .ending-print-image')).toBeVisible()
  await page.getByRole('button', { name: '跳过演出，查看档案', exact: true }).click()
  await page.route('**/ending-art/prints/**', route => route.abort())
  // A new document clears the already-decoded image from the previous replay.
  await page.reload()
  await page.getByRole('button', { name: '重看终局演出', exact: true }).click()
  await expect(page.locator('.ending-print-image')).toHaveCount(0)
  await expect(page.locator('.ending-print-fallback')).toContainText('早班接线桌')
  await expect(page.locator('.cinema-story h1')).toHaveText('停机')
  await page.getByRole('button', { name: '后来', exact: true }).click()
  await expect(page.locator('.cinema-story')).toContainText('光灭了。窗外开始天亮。')
})
