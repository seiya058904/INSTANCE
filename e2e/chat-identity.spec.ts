import { expect, test } from '@playwright/test'

for (const width of [320, 390, 768, 1440]) {
  for (const [branch, auditChoice] of Object.entries({ protect: 'audit-protect-maya', report: 'audit-report-maya', hide: 'audit-hide-maya', comply: 'audit-comply' })) {
    test(`anonymous reveal and ${branch} return at ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 900 })
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
      await page.goto('/?qaPacing=instant')
      await expect(page.locator('.candidate-response').first()).toBeEnabled()
      // Produce a legal prefix in an isolated Playwright context. Never edit events.
      await page.evaluate(async () => {
        const enginePath = '/src/game/engine.ts'
        const engine = await import(enginePath)
        let run = engine.createMainline2Run('identity-acceptance')
        for (let guard = 0; guard < 50 && run.currentNodeId !== 'maya-first-3'; guard++) {
          run = engine.commitChoice(run, engine.resolveScene(run).choices[0].id)
        }
        if (run.currentNodeId !== 'maya-first-3') throw Error('No Maya introduction')
        const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
        envelope.data.run = run; envelope.revision = crypto.randomUUID()
        localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
      })
      await page.reload()
      const check = async () => {
        await expect(page.locator('.candidate-response').first()).toBeEnabled()
        await expect(page.locator('.conversation-header h1')).toHaveText(/^User #\d{4}$/)
        const title = await page.locator('.conversation-header h1').innerText()
        // Sidebar is intentionally hidden on mobile, but its identity must still agree.
        await expect(page.locator('.history-row[aria-current="true"]')).toHaveText(title)
        const labels = await page.locator('.history-row').allTextContents()
        expect(new Set(labels).size).toBe(labels.length)
        expect(labels.every(label => /^User #\d{4}$/.test(label))).toBe(true)
        await expect(page.locator('.story-chapter, .assistant-context')).toHaveCount(0)
        await expect(page.getByText('人物识别已更新', { exact: true })).toHaveCount(0)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        expect(await page.locator('.conversation-header h1').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
      }
      await check()
      await expect(page.locator('.conversation-header h1')).toHaveText('User #1842')
      const before = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history)
      await page.locator('.candidate-response').first().click()
      await check()
      // Real menu-free gameplay from the introduction through the system audit.
      for (let guard = 0; guard < 10; guard++) {
        const node = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.currentNodeId)
        if (node === 'audit-2') break
        await page.locator('.candidate-response').first().click(); await check()
      }
      await page.locator(`[data-choice-id="${auditChoice}"]`).click(); await check()
      // audit-3 retains branch-specific authored replies before the return.
      for (let guard = 0; guard < 5; guard++) {
        const node = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.currentNodeId)
        if (node === 'maya-return-1') break
        await page.locator('.candidate-response').first().click(); await check()
      }
      await expect(page.locator('.conversation-header h1')).toHaveText('User #1842')
      await expect(page.locator('.current-exchange .user-message').first()).toContainText('岑遥')
      await expect(page.locator('.candidate-response')).toHaveCount(3)
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run)
      expect(saved.currentNodeId).toBe('maya-return-1')
      expect(saved.history.slice(0, before.length)).toEqual(before)
      await page.screenshot({ path: testInfo.outputPath(`return-${branch}-${width}.png`) })
      await page.reload(); await check()
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run)).toEqual(saved)
      await expect(page.locator('.conversation-header h1')).toHaveText('User #1842')
      const menu = page.locator(width <= 760 ? '.mode-controls-mobile' : '.mode-controls-desktop')
      await menu.getByRole('button', { name: /新的对话|打开模式菜单/ }).click()
      await menu.getByRole('menuitem', { name: '开始', exact: true }).click(); await check()
      await page.locator('.candidate-response').first().click(); await check()
      await page.reload(); await check()
      await page.screenshot({ path: testInfo.outputPath(`ordinary-${branch}-${width}.png`) })
      expect(errors).toEqual([])
    })
  }
}
