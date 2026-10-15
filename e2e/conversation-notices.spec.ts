import { expect, test } from '@playwright/test'

for (const width of [1440, 390, 320]) {
  test(`fresh mainline enters an ordinary conversation without a special opening at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    await expect(page.locator('.story-opening')).toHaveCount(0)
    await expect(page.getByText('然后，世界开始变得奇怪。', { exact: true })).toHaveCount(0)
    await expect(page.getByText('你是 Aster，选择你要发出的回复。', { exact: true })).toHaveCount(0)
    await expect(page.locator('.current-exchange .user-message')).toContainText('三十七张请假条')
    await expect(page.locator('.candidate-response')).toHaveCount(3)
    const offset = await page.locator('.conversation-scroll').evaluate(element => element.querySelector('.user-row')!.getBoundingClientRect().top - element.getBoundingClientRect().top)
    expect(offset).toBeGreaterThanOrEqual(20)
    expect(offset).toBeLessThanOrEqual(28)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.locator('[data-choice-id="next-printer-repair"]').click()
    await expect(page.locator('.current-exchange .user-message')).toContainText('维修员说谢谢', { timeout: 20000 })
    await page.reload()
    await expect(page.locator('.current-exchange .user-message')).toContainText('维修员说谢谢')
  })
}

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
