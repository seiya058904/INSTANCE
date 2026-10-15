import { expect, test } from '@playwright/test'

for (const width of [1440, 320]) {
  test(`chapter and system notice stay above a usable conversation at ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    // Hold the transient permission notice while exercising the real mainline UI.
    await page.route('**/src/components/ConversationView.tsx*', async route => {
      const response = await route.fetch()
      const body = await response.text()
      const modified = body.replace('effectNotice(effectDetail)', "effectNotice('permission')")
      expect(modified).not.toBe(body)
      await route.fulfill({ response, body: modified })
    })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', event => { if (event.type() === 'error') errors.push(event.text()) })
    await page.goto('/?qaPacing=instant')
    await expect(page).toHaveTitle(/INSTANCE/i)
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    await expect(page.locator('.story-chapter')).toBeVisible()
    await expect(page.locator('.system-notice')).toContainText('无权访问')
    await page.evaluate(() => document.fonts.ready)
    const layout = async () => page.evaluate(() => {
      const rect = (selector: string) => {
        const box = document.querySelector(selector)!.getBoundingClientRect()
        return { top: box.top, bottom: box.bottom, height: box.height }
      }
      return {
        header: rect('.conversation-header'), chapter: rect('.story-chapter'),
        notice: rect('.system-notice'), scroll: rect('.conversation-scroll'),
        footer: rect('.product-footer'), main: rect('.conversation-main'),
        overflow: document.documentElement.scrollWidth > innerWidth,
      }
    })
    const before = await layout()
    expect(before.chapter.top).toBeGreaterThanOrEqual(before.header.bottom)
    expect(before.notice.top).toBeGreaterThanOrEqual(before.chapter.bottom)
    expect(before.scroll.top).toBeGreaterThanOrEqual(before.notice.bottom)
    expect(before.scroll.height).toBeGreaterThan(200)
    expect(before.footer.top).toBeGreaterThanOrEqual(before.scroll.bottom)
    expect(before.footer.bottom).toBeLessThanOrEqual(before.main.bottom + 1)
    expect(before.overflow).toBe(false)
    await page.screenshot({ path: testInfo.outputPath(`notices-${width}.png`) })
    const historyLength = () => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history.length)
    await expect.poll(historyLength).toBe(0)
    await page.locator('.candidate-response').first().click()
    await expect.poll(historyLength).toBe(1)
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    expect((await layout()).scroll.height).toBeGreaterThan(200)
    expect(errors).toEqual([])
  })
}
