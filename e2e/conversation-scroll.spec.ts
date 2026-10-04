import { expect, test } from '@playwright/test'

// Keep native scrollbars: Playwright otherwise hides the actual desktop thumb.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } })
const latest = '滚动到最新消息'

test('one arrow click reaches the real bottom of a long conversation history', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?qaPacing=instant&qaRun=long-history&qaHistory=100')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  expect(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBe(0)
  await page.getByRole('button', { name: latest }).click()
  await expect.poll(() => page.locator('.conversation-scroll').evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(2)
  await expect(page.getByRole('button', { name: latest })).toBeHidden()
  await page.waitForTimeout(100)
  expect(await page.locator('.conversation-scroll').evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(2)
})

test('a long desktop reply leaves its beginning visible and the fixed arrow makes only one jump', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 450 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?qaRun=desktop-scroll&qaConversation=real-usage-rup01-20&qaStreamGraphemes=500')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  // Keyboard selection does not implicitly scroll an off-screen draft into view.
  await page.keyboard.press('1')
  await expect.poll(() => page.locator('.current-exchange .assistant-message').innerText(), { intervals: [16, 32] }).toMatch(/.{300}/s)
  expect(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBe(0)
  await expect(page.getByRole('button', { name: latest })).toBeVisible()
  const rect = await page.getByRole('button', { name: latest }).boundingBox()
  await page.waitForTimeout(100)
  expect(await page.getByRole('button', { name: latest }).boundingBox()).toEqual(rect)
  await page.getByRole('button', { name: latest }).click()
  const jumped = await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)
  expect(jumped).toBeGreaterThan(0)
  await expect(page.getByRole('button', { name: latest })).toBeHidden()
  await expect.poll(() => page.locator('.current-exchange .assistant-message').innerText(), { intervals: [16, 32] }).toMatch(/.{460}/s)
  expect(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBe(jumped)
  await expect(page.getByRole('button', { name: latest })).toBeVisible()
})

test('small upward wheel input is never undone while the reply grows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?qaRun=desktop-scroll&qaHistory=25&qaStreamGraphemes=500')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.locator('.candidate-response').first().click()
  await expect.poll(() => page.locator('.current-exchange .assistant-message').innerText()).toMatch(/.{60}/s)
  const before = await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)
  await page.mouse.move(1000, 300)
  await page.mouse.wheel(0, -32)
  await expect.poll(() => page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBeLessThan(before - 20)
  const manual = await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)
  await page.waitForTimeout(250)
  expect(Math.abs(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop) - manual)).toBeLessThan(2)
})

test('a small native scrollbar drag is never undone while the reply grows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
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
})

test('PageUp stays under reader control while text continues generating', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?qaRun=desktop-scroll&qaHistory=25&qaStreamGraphemes=500')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.locator('.candidate-response').first().click()
  await expect.poll(() => page.locator('.current-exchange .assistant-message').innerText()).toMatch(/.{60}/s)
  const before = await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)
  await page.keyboard.press('PageUp')
  await expect.poll(() => page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBeLessThan(before - 200)
  await page.waitForTimeout(250)
  const manual = await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)
  const text = await page.locator('.current-exchange .assistant-message').innerText()
  await page.waitForTimeout(250)
  expect(Math.abs(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop) - manual)).toBeLessThan(2)
  expect((await page.locator('.current-exchange .assistant-message').innerText()).length).toBeGreaterThan(text.length)
})

for (const viewport of [{ width: 1440, height: 600 }, { width: 320, height: 568 }]) {
  test(`NPC replies and the next decision preserve the first message at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/?qaRun=npc-reading&qaConversation=real-usage-rup01-20')
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const firstMessage = await page.locator('.current-exchange .user-message').first().textContent()
    for (let turn = 0; turn < 2; turn++) {
      await page.keyboard.press('1')
      await expect(page.locator('.conversation-main')).toHaveAttribute('data-flow-stage', 'assistant-streaming')
      await expect.poll(() => page.locator('.conversation-main').getAttribute('data-flow-stage'), { intervals: [16, 32] }).toBe('human-typing')
      expect(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBe(0)
      await expect(page.locator('.candidate-response').first()).toBeEnabled()
      expect(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBe(0)
      await expect(page.locator('.completed-exchange .user-message').first()).toHaveText(firstMessage!)
      const firstTop = await page.locator('.conversation-scroll').evaluate(element => element.querySelector('.user-row')!.getBoundingClientRect().top - element.getBoundingClientRect().top)
      expect(firstTop).toBeGreaterThanOrEqual(20)
      expect(firstTop).toBeLessThanOrEqual(28)
    }
    await expect(page.getByRole('button', { name: latest })).toBeVisible()
    await page.getByRole('button', { name: latest }).click()
    await expect.poll(() => page.locator('.conversation-scroll').evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(2)
  })
}

test('typing audio starts with visible characters and stays silent during the NPC indicator', async ({ page }) => {
  await page.addInitScript(() => {
    const calls: Array<{ source: string; stage: string; text: string; caret: boolean }> = []
    ;(window as any).typingAudioCalls = calls
    HTMLMediaElement.prototype.play = function () {
      const main = document.querySelector<HTMLElement>('.conversation-main')
      const caret = main?.querySelector('.current-exchange .stream-caret')
      calls.push({ source: this.src, stage: main?.dataset.flowStage ?? '', text: caret?.parentElement?.textContent ?? '', caret: Boolean(caret) })
      return Promise.resolve()
    }
  })
  await page.goto('/?qaRun=audio-sync&qaConversation=real-usage-rup01-20')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.keyboard.press('1')
  await expect.poll(() => page.locator('.conversation-main').getAttribute('data-flow-stage'), { intervals: [16, 32] }).toBe('human-typing')
  const callsDuringIndicator = await page.evaluate(() => (window as any).typingAudioCalls)
  expect(callsDuringIndicator.filter((call: any) => call.source.includes('human-typing')).length).toBe(1)
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  const calls = await page.evaluate(() => (window as any).typingAudioCalls)
  expect(calls.filter((call: any) => call.source.includes('human-typing')).length).toBe(2)
  expect(calls.some((call: any) => call.source.includes('ai-generation'))).toBe(true)
  for (const call of calls) {
    expect(call.text.length).toBeGreaterThan(0)
    expect(call.caret).toBe(true)
    expect(call.stage).toBe(call.source.includes('human-typing') ? 'human-streaming' : 'assistant-streaming')
  }
})

test('a short desktop conversation has no jump button when its content fits', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?qaRun=short-chat&qaConversation=real-usage-rup01-20')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  await expect(page.getByRole('button', { name: latest })).toBeHidden()
  expect(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBe(0)
})
