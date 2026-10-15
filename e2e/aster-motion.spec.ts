import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    test(`Aster visibly rotates only during a live reply at ${width}px, motion ${reducedMotion}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 960 })
      await page.emulateMedia({ reducedMotion })
      // Real pacing: the instant QA mode would skip the response state entirely.
      await page.goto('/')
      await expect(page.locator('.candidate-response').first()).toBeEnabled()
      await page.locator('.candidate-response').first().click()
      await expect(page.getByRole('status').filter({ hasText: '正在回复' })).toBeVisible()
      const samples = await page.evaluate(() => new Promise<Array<{ angle: number; opacity: string; filter: string }>>(resolve => {
        const samples: Array<{ angle: number; opacity: string; filter: string }> = []
        const start = performance.now()
        function frame() {
          const icon = document.querySelector('.assistant-mark.is-active')
          if (!icon || performance.now() - start > 500) { resolve(samples); return }
          const style = getComputedStyle(icon), matrix = new DOMMatrixReadOnly(style.transform)
          samples.push({ angle: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI, opacity: style.opacity, filter: style.filter })
          requestAnimationFrame(frame)
        }
        frame()
      }))
      expect(samples.length).toBeGreaterThan(3)
      const distance = samples.at(-1)!.angle - samples[0].angle
      if (reducedMotion === 'reduce') expect(Math.abs(distance)).toBeLessThan(1)
      else expect(distance).toBeGreaterThan(40)
      expect(samples.every(sample => sample.opacity === '1' && sample.filter === 'none')).toBe(true)
      await expect(page.locator('.assistant-mark.is-active')).toHaveCount(0)
      // Human delay + the separately bounded human stream can exceed a single
      // 5s assertion. Observe the actual NPC stage, then its completion; keep
      // the same timeout for each stage and verify Aster stays idle throughout.
      await expect(page.locator('.conversation-main')).toHaveAttribute('data-flow-stage', 'human-streaming')
      await expect(page.locator('.assistant-mark.is-active')).toHaveCount(0)
      await expect(page.locator('[data-choice-id="next-printer-listen"]')).toBeEnabled()
      await expect(page.locator('.completed-exchange .assistant-mark').first()).toHaveCSS('transform', 'none')
      await page.reload()
      await expect(page.locator('.assistant-mark.is-active')).toHaveCount(0)
      await expect(page.locator('.completed-exchange .assistant-mark').first()).toHaveCSS('transform', 'none')
    })
  }
}
