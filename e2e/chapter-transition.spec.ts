import { expect, test } from '@playwright/test'

for (const act of [1, 2, 3, 4]) {
  test(`outgoing act ${act} keeps its anonymous contact until the next scene without a chapter bar`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: [320, 390, 768, 1440][act - 1], height: 900 })
    await page.goto('/')
    await expect.poll(() => page.evaluate(() => localStorage.getItem('instance:checkpoint:v2'))).not.toBeNull()
    // Legal boundary fixture only; the tested choice and its transition use
    // real DOM controls and normal production pacing, never QA instant.
    const boundary = await page.evaluate(async act => {
      const catalogPath = '/src/game/mainline2RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
      const catalog = await import(catalogPath), fixtures = await import(fixturePath)
      const route = fixtures.runMainline2Route(catalog.PUBLIC_RUNTIME_ROUTE_CATALOG[0])
      const link = route.links.find((link: any, index: number) => link.runBefore.progress.act === act && route.links[index + 1]?.runBefore.progress.act === act + 1)
      if (!link) throw Error(`No legal act ${act} boundary`)
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      envelope.data.run = link.runBefore; envelope.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
      return { choice: link.choiceId, oldText: link.resolvedScene.userMessage }
    }, act)
    await page.reload()
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const oldTitle = await page.locator('.conversation-header h1').innerText()
    expect(oldTitle).toMatch(/^User #\d{4}$/)
    await page.evaluate(() => {
      const samples: Array<{ stage: string; title: string; chapter: string; current: string | null }> = []
      Object.assign(window, { chapterTransitionSamples: samples })
      let previousStage = 'ready'
      new MutationObserver(() => {
        const stage = document.querySelector('.conversation-main')?.getAttribute('data-flow-stage') ?? ''
        if (stage === previousStage) return
        previousStage = stage
        samples.push({ stage, title: document.querySelector('.conversation-header h1')?.textContent ?? '', chapter: document.querySelector('.story-chapter')?.textContent ?? '', current: document.querySelector('.history-row[aria-current="true"]')?.textContent ?? null })
      }).observe(document.querySelector('.conversation-main')!, { subtree: true, attributes: true, childList: true, characterData: true })
    })
    await page.locator(`[data-choice-id="${boundary.choice}"]`).click()
    await expect(page.locator('.conversation-main')).toHaveAttribute('data-flow-stage', 'assistant-streaming')
    await expect(page.locator('.current-exchange .user-message')).toContainText(boundary.oldText)
    await expect(page.locator('.story-chapter, .assistant-context')).toHaveCount(0)
    await expect(page.locator('.conversation-header h1')).toHaveText(oldTitle)
    await page.screenshot({ path: testInfo.outputPath(`outgoing-act-${act}.png`) })
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.progress.act)).toBe(act + 1)
    await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
    const nextTitle = await page.locator('.conversation-header h1').innerText()
    expect(nextTitle).toMatch(/^User #\d{4}$/)
    const samples = await page.evaluate(() => (window as unknown as { chapterTransitionSamples: Array<{ stage: string; title: string; chapter: string; current: string | null }> }).chapterTransitionSamples)
    const outgoing = ['assistant-streaming', 'conversation-closing', 'assigning', 'connecting']
    expect(samples.filter(sample => outgoing.includes(sample.stage)).map(sample => sample.stage)).toEqual(outgoing)
    expect(samples.some(sample => sample.stage === 'ready')).toBe(true)
    for (const sample of samples) {
      expect(sample.chapter, sample.stage).toBe('')
      expect(sample.title, sample.stage).toBe(outgoing.includes(sample.stage) ? oldTitle : nextTitle)
      expect(sample.current, sample.stage).toBe(sample.title)
    }
    await page.reload()
    await expect(page.locator('.story-chapter, .assistant-context')).toHaveCount(0)
    await expect(page.locator('.conversation-header h1')).toHaveText(nextTitle)
  })
}
