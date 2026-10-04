import { expect, test } from '@playwright/test'

// Playwright hides native scrollbars by default; retain the real desktop
// scrollbar so pointer tests exercise its thumb rather than the page behind it.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } })

test('desktop replies keep the prompt visible and a small upward wheel movement owns the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?qaRun=desktop-scroll&qaHistory=25&qaStreamGraphemes=500')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.locator('.candidate-response').first().click()
  await expect(page.locator('.conversation-main')).toHaveAttribute('data-flow-stage', 'assistant-streaming')
  await expect.poll(() => page.locator('.current-exchange .assistant-message').innerText()).toMatch(/.{60}/s)
  const position = await page.locator('.conversation-scroll').evaluate(element => ({
    question: element.querySelector('.current-exchange')!.getBoundingClientRect().top - element.getBoundingClientRect().top,
    top: element.scrollTop,
    remaining: element.scrollHeight - element.clientHeight - element.scrollTop,
  }))
  expect(position.question).toBeGreaterThanOrEqual(12)
  expect(position.remaining).toBeGreaterThan(40)
  await page.mouse.move(1000, 300)
  await page.mouse.wheel(0, -32)
  await expect.poll(() => page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBeLessThan(position.top - 20)
  const manual = await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)
  await page.waitForTimeout(250)
  expect(Math.abs(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop) - manual)).toBeLessThan(2)
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
  // Synthetic QA history is rebuilt when the answer becomes a saved entry,
  // changing scrollHeight. The reader must still own the next decision.
  await expect(page.getByRole('button', { name: '回到当前问题' })).toBeVisible()
  await page.getByRole('button', { name: '回到当前问题' }).click()
  const restored = await page.locator('.conversation-scroll').evaluate(element => element.querySelector('.current-exchange')!.getBoundingClientRect().top - element.getBoundingClientRect().top)
  expect(restored).toBeGreaterThanOrEqual(18)
  expect(restored).toBeLessThanOrEqual(22)
})

test('a small native desktop scrollbar drag is not undone by streaming', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?qaRun=desktop-scroll&qaHistory=25&qaStreamGraphemes=500')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.locator('.candidate-response').first().click()
  await expect.poll(() => page.locator('.current-exchange .assistant-message').innerText()).toMatch(/.{60}/s)
  const bar = await page.locator('.conversation-scroll').evaluate(element => {
    const rect = element.getBoundingClientRect()
    return { x: rect.right - 3, y: rect.top + element.clientHeight * (element.scrollTop + element.clientHeight / 2) / element.scrollHeight, top: element.scrollTop }
  })
  await page.mouse.move(bar.x, bar.y); await page.mouse.down()
  await page.mouse.move(bar.x, bar.y - 3); await page.mouse.up()
  await expect.poll(() => page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBeLessThan(bar.top - 2)
  const manual = await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)
  expect(bar.top - manual).toBeLessThan(90)
  await page.waitForTimeout(250)
  expect(Math.abs(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop) - manual)).toBeLessThan(2)
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
  await expect(page.getByRole('button', { name: '回到当前问题' })).toBeVisible()
})

test('a long reply follows only its visible edge with reading space in a short desktop window', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?qaRun=desktop-scroll&qaHistory=25&qaStreamGraphemes=500')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.locator('.candidate-response').first().click()
  await expect.poll(() => page.locator('.current-exchange .assistant-message').innerText()).toMatch(/.{60}/s)
  const initial = await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)
  await expect.poll(() => page.locator('.current-exchange .assistant-message').innerText(), { intervals: [32, 50] }).toMatch(/.{350}/s)
  await expect.poll(() => page.locator('.conversation-scroll').evaluate((element, initial) => {
    const bottom = element.querySelector('.current-exchange .assistant-row')!.getBoundingClientRect().bottom - element.getBoundingClientRect().top
    return element.scrollTop > initial + 50 && bottom <= element.clientHeight - 45 && element.scrollHeight - element.clientHeight - element.scrollTop > 30
  }, initial), { intervals: [16, 32] }).toBe(true)
  await expect(page.locator('.conversation-main')).toHaveAttribute('data-flow-stage', 'assistant-streaming')
})

test('PageUp takes control while a desktop reply continues generating', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?qaRun=desktop-scroll&qaHistory=25&qaStreamGraphemes=500')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.locator('.candidate-response').first().click()
  await expect.poll(() => page.locator('.current-exchange .assistant-message').innerText()).toMatch(/.{60}/s)
  const before = await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)
  await page.keyboard.press('PageUp')
  await expect.poll(() => page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBeLessThan(before - 200)
  // Native keyboard scrolling animates briefly; sample after it settles.
  await page.waitForTimeout(250)
  const manual = await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)
  const visible = await page.locator('.current-exchange .assistant-message').innerText()
  await page.waitForTimeout(250)
  expect(Math.abs(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop) - manual)).toBeLessThan(2)
  expect((await page.locator('.current-exchange .assistant-message').innerText()).length).toBeGreaterThan(visible.length)
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
  await expect(page.getByRole('button', { name: '回到当前问题' })).toBeVisible()
})

test('a small viewport keeps following after the chosen draft is replaced by a reply', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 568 }, hasTouch: true, reducedMotion: 'no-preference' })
  const page = await context.newPage()
  await page.goto('/?qaRun=desktop-scroll&qaHistory=25&qaStreamGraphemes=500')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  await expect(page.getByRole('button', { name: '回到当前问题' })).toBeHidden()
  // The draft starts below the fold. Clicking it scrolls, then removing the
  // draft list clamps the viewport before the reply's first animation frame.
  await page.locator('.candidate-response').first().click()
  await expect.poll(() => page.locator('.current-exchange .assistant-message').innerText(), { intervals: [32, 50] }).toMatch(/.{350}/s)
  await expect.poll(() => page.locator('.conversation-scroll').evaluate(element => {
    const bottom = element.querySelector('.current-exchange .assistant-row')!.getBoundingClientRect().bottom - element.getBoundingClientRect().top
    return bottom <= element.clientHeight - 45 && element.scrollHeight - element.clientHeight - element.scrollTop > 30
  }), { intervals: [16, 32] }).toBe(true)
  await expect(page.locator('.conversation-main')).toHaveAttribute('data-flow-stage', 'assistant-streaming')
  await context.close()
})
