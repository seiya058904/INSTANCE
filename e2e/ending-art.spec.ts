import { expect, test } from '@playwright/test'

test('pending artwork never blocks navigation or saving the ending', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.checkpoint-root')).toBeVisible()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('instance:checkpoint:v2'))).not.toBeNull()
  await page.evaluate(async () => {
    const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
    const catalog = await import(catalogPath), fixtures = await import(fixturePath)
    const run = fixtures.runMainline2Route(catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.find((r: any) => r.routeId === 'shutdown')).run
    const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
    envelope.data.run = run
    envelope.revision = crypto.randomUUID()
    localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
  })
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  let requests = 0
  await page.route('**/ending-art/shutdown.webp', async route => {
    requests++
    await pending
    await route.continue()
  })
  try {
    await page.reload({ waitUntil: 'domcontentloaded' })
    const saved = await page.evaluate(() => localStorage.getItem('instance:checkpoint:v2'))
    await page.getByRole('button', { name: '重看终局演出', exact: true }).click()
    await expect.poll(() => requests).toBeGreaterThan(0)
    expect(await page.locator('.world-stage .ending-painting').evaluate((i: HTMLImageElement) => i.complete)).toBe(false)
    await page.getByRole('button', { name: '下一幕', exact: true }).click()
    await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot', '1')
    await page.getByRole('button', { name: '跳过演出，查看档案', exact: true }).click()
    await expect(page.locator('.closeout-ending')).toBeVisible()
    expect(await page.evaluate(() => localStorage.getItem('instance:checkpoint:v2'))).toBe(saved)
  } finally {
    release()
    await page.unrouteAll({ behavior: 'wait' })
  }
})

test('all 36 illustrations decode in the real cinema at every supported viewport', async ({ page }) => {
  test.setTimeout(240000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('response', response => { if (response.url().includes('/ending-art/') && response.status() >= 400) errors.push(response.url()) })
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.checkpoint-root')).toBeVisible()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('instance:checkpoint:v2'))).not.toBeNull()
  const fixtures = await page.evaluate(async () => {
    const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
    const catalog = await import(catalogPath), fixtures = await import(fixturePath)
    return [...catalog.PUBLIC_RUNTIME_ROUTE_CATALOG, ...catalog.SECRET_RUNTIME_ROUTE_CATALOG].map((route: any) => ({ id: route.endingId, run: fixtures.runMainline2Route(route).run, secret: catalog.SECRET_RUNTIME_ROUTE_CATALOG.includes(route) }))
  })
  expect(fixtures).toHaveLength(36)
  for (const fixture of fixtures) {
    await page.evaluate(run => {
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      envelope.data.run = run
      envelope.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
    }, fixture.run)
    await page.reload()
    await page.getByRole('button', { name: '重看终局演出', exact: true }).click()
    if (fixture.secret) {
      await page.getByRole('button', { name: '后来', exact: true }).click()
      await page.getByRole('button', { name: '余波', exact: true }).click()
    }
    const image = page.locator('.world-stage .ending-painting')
    await expect(image).toHaveAttribute('src', `/ending-art/${fixture.id}.webp`)
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 1536 && img.naturalHeight === 1024)).toBe(true)
    for (const width of [320, 390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: width < 800 ? 844 : 1080 })
      await expect(image).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      const box = await image.boundingBox()
      expect(box!.width).toBeGreaterThan(200)
      expect(Math.abs(box!.width / box!.height - 1.5)).toBeLessThan(.02)
      await page.locator('.ending-cinema').evaluate(element => { element.scrollTop = 0 })
      await page.screenshot({ path: `temp/final-art-20261014/viewports/${fixture.id}-${width}.png` })
    }
  }
  expect(errors).toEqual([])
})
