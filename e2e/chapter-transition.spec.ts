import { expect, test } from '@playwright/test'

for (const act of [1, 2, 3, 4]) {
  test(`outgoing act ${act} keeps its chapter until the next scene is presented`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: act % 2 ? 390 : 1440, height: 900 })
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
    const oldChapter = await page.locator('.story-chapter').innerText()
    await page.evaluate(() => {
      const samples: Array<{ stage: string; chapter: string }> = []
      Object.assign(window, { chapterTransitionSamples: samples })
      let previousStage = 'ready'
      new MutationObserver(() => {
        const stage = document.querySelector('.conversation-main')?.getAttribute('data-flow-stage') ?? ''
        if (stage === previousStage) return
        previousStage = stage
        samples.push({ stage, chapter: document.querySelector('.story-chapter')?.textContent ?? '' })
      }).observe(document.querySelector('.conversation-main')!, { subtree: true, attributes: true, childList: true, characterData: true })
    })
    await page.locator(`[data-choice-id="${boundary.choice}"]`).click()
    await expect(page.locator('.conversation-main')).toHaveAttribute('data-flow-stage', 'assistant-streaming')
    await expect(page.locator('.current-exchange .user-message')).toContainText(boundary.oldText)
    await expect(page.locator('.story-chapter')).toHaveText(oldChapter)
    await page.screenshot({ path: testInfo.outputPath(`outgoing-act-${act}.png`) })
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.progress.act)).toBe(act + 1)
    await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
    await expect(page.locator('.story-chapter')).not.toHaveText(oldChapter)
    const nextChapter = await page.locator('.story-chapter').innerText()
    const samples = await page.evaluate(() => (window as unknown as { chapterTransitionSamples: Array<{ stage: string; chapter: string }> }).chapterTransitionSamples)
    const outgoing = ['assistant-streaming', 'conversation-closing', 'assigning', 'connecting']
    expect(samples.filter(sample => outgoing.includes(sample.stage)).map(sample => sample.stage)).toEqual(outgoing)
    for (const sample of samples) expect(sample.chapter, sample.stage).toBe(outgoing.includes(sample.stage) ? oldChapter : nextChapter)
    await page.reload()
    await expect(page.locator('.story-chapter')).toHaveText(nextChapter)
  })
}
