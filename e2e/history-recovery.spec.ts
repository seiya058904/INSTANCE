import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

for (const surface of ['mainline', 'non-mainline'] as const) {
  test(`malformed ${surface} history opens save recovery and exports the unchanged original record`, async ({ page }) => {
    await page.goto('/?qaPacing=instant')
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const raw = await page.evaluate(async surface => {
      const enginePath = '/src/game/engine.ts', sessionPath = '/src/game/nonMainlineSession.ts'
      const engine = await import(enginePath), sessions = await import(sessionPath)
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v1')!)
      const initial = engine.createMainline2Run('history-presentation-mainline')
      envelope.data.run = engine.commitChoice(initial, engine.resolveScene(initial).choices[0].id)
      const session = sessions.createNonMainlineSession('corrupt-frontend-0', envelope.data.exposure)
      envelope.data.session = sessions.commitNonMainlineChoice(session, sessions.resolveNonMainlineScene(session).choices[0].id)
      envelope.data.surface = surface
      if (surface === 'mainline') envelope.data.run.history[0].userContent = 'invalid-content-string'
      else envelope.data.session.history[0].userMessages = ['ok', { unexpected: 'object' }]
      envelope.revision = crypto.randomUUID()
      const raw = JSON.stringify(envelope)
      localStorage.setItem('instance:checkpoint:v1', raw)
      return raw
    }, surface)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.reload()
    await expect(page.getByRole('dialog', { name: '存档需要恢复' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '存档需要恢复' })).toBeFocused()
    await expect(page.getByRole('heading', { name: '出现了意外问题' })).toBeHidden()
    expect(await page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))).toBe(raw)
    const downloading = page.waitForEvent('download')
    await page.getByRole('button', { name: '导出恢复记录', exact: true }).click()
    const download = await downloading
    const path = await download.path()
    expect(path).toBeTruthy()
    const exported = JSON.parse(await readFile(path!, 'utf8'))
    expect(exported.original).toBe(raw)
    expect(await page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))).toBe(raw)
    expect(errors).toEqual([])
  })
}

test('a legitimate legacy ordinary record without newer presentation fields resumes and saves its next reply', async ({ page }) => {
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  const before = await page.evaluate(async () => {
    const enginePath = '/src/game/engine.ts', sessionPath = '/src/game/nonMainlineSession.ts', contentPath = '/src/content/runManifest.ts'
    const engine = await import(enginePath), sessions = await import(sessionPath), content = await import(contentPath)
    const run = engine.createRun('history-presentation-legacy')
    const started = sessions.createNonMainlineSession('corrupt-frontend-0', content.createEmptyExposureHistory())
    const session = sessions.commitNonMainlineChoice(started, sessions.resolveNonMainlineScene(started).choices[0].id)
    localStorage.removeItem('instance:checkpoint:v1')
    localStorage.setItem('instance:run:v1', JSON.stringify(run))
    localStorage.setItem('instance:non-mainline-session:v1', JSON.stringify(session))
    localStorage.setItem('instance:active-surface:v1', 'non-mainline')
    return { runId: run.runId, history: session.history, rawSession: JSON.stringify(session) }
  })
  await page.reload()
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await expect(page.getByRole('dialog', { name: '存档需要恢复' })).toBeHidden()
  await expect(page.locator('.completed-exchange').first()).toContainText(before.history[0].assistantText)
  await page.locator('.candidate-response').first().click()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1') ?? 'null')?.data.session.history.length)).toBe(before.history.length + 1)
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data)
  expect(saved.run.runId).toBe(before.runId)
  expect(saved.session.history.slice(0, before.history.length)).toEqual(before.history)
  expect(await page.evaluate(() => localStorage.getItem('instance:non-mainline-session:v1'))).toBe(before.rawSession)
})
