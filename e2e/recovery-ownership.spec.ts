import { expect, test } from '@playwright/test'

// The test context owns an isolated localStorage. Only file-read completion,
// quota denial and lock contention are controlled; the game handlers and CAS
// remain the production implementations.
test('an imported recovery cannot lend its token to an older queued retry', async ({ page, context }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()

  const imported = await page.evaluate(async () => {
    const enginePath = '/src/game/engine.ts'
    const engine = await import(enginePath)
    const current = JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data
    const run = engine.createMainline2Run('browser-explicit-recovery-target')
    return { runId: run.runId as string, raw: JSON.stringify({ current: { ...current, run } }) }
  })
  await page.evaluate(() => {
    const controls = {
      denyWrites: true,
      importWaiting: false,
      completeImport: undefined as undefined | (() => void),
    }
    ;(window as typeof window & { __recoveryOwnership?: typeof controls }).__recoveryOwnership = controls
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = function (key, value) {
      if (key === 'instance:checkpoint:v1' && controls.denyWrites) {
        throw new DOMException('Injected quota failure', 'QuotaExceededError')
      }
      return originalSetItem.call(this, key, value)
    }
    const originalText = File.prototype.text
    File.prototype.text = function () {
      const reading = originalText.call(this)
      if (this.name !== 'recovery-ownership.json') return reading
      return reading.then(text => new Promise<string>(resolve => {
        controls.completeImport = () => resolve(text)
        controls.importWaiting = true
      }))
    }
  })
  await page.locator('.candidate-response').first().click()
  await expect(page.getByRole('heading', { name: '这次选择尚未保存' })).toBeVisible()
  await page.locator('input[type=file]').setInputFiles({
    name: 'recovery-ownership.json', mimeType: 'application/json', buffer: Buffer.from(imported.raw),
  })
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { __recoveryOwnership?: { importWaiting: boolean } }).__recoveryOwnership?.importWaiting,
  )).toBe(true)

  const other = await context.newPage()
  other.on('pageerror', error => errors.push(error.message))
  try {
    await other.goto('/?qaPacing=instant')
    await expect(other.locator('.candidate-response').first()).toBeEnabled()
    await other.evaluate(async () => {
      const enginePath = '/src/game/engine.ts', checkpointPath = '/src/game/checkpoint.ts'
      const engine = await import(enginePath), checkpoint = await import(checkpointPath)
      const controls = {
        held: false, written: false, finished: false, error: '', raw: '', choiceId: '',
        write: undefined as undefined | (() => void),
        release: undefined as undefined | (() => void),
      }
      ;(window as typeof window & { __recoveryWriter?: typeof controls }).__recoveryWriter = controls
      const write = new Promise<void>(resolve => { controls.write = resolve })
      const release = new Promise<void>(resolve => { controls.release = resolve })
      void navigator.locks.request(checkpoint.CHECKPOINT_LOCK, async () => {
        controls.held = true
        await write
        const loaded = checkpoint.loadCheckpoint(localStorage)
        if (loaded.problem || !loaded.data) throw Error('Writer fixture could not restore its checkpoint')
        const choice = engine.resolveScene(loaded.data.run).choices[1]
        const next = { ...loaded.data, run: engine.commitChoice(loaded.data.run, choice.id) }
        const result = checkpoint.writeCheckpoint(localStorage, loaded.token, next, 'other-window-progress')
        if (result.status !== 'saved') throw Error(`Writer fixture failed: ${result.status}`)
        controls.raw = localStorage.getItem('instance:checkpoint:v1')!
        controls.choiceId = choice.id
        controls.written = true
        await release
      }).then(() => { controls.finished = true }).catch(error => { controls.error = String(error) })
    })
    await expect.poll(() => other.evaluate(() =>
      (window as typeof window & { __recoveryWriter?: { held: boolean } }).__recoveryWriter?.held,
    )).toBe(true)
    await page.evaluate(() => {
      const controls = (window as typeof window & { __recoveryOwnership?: { denyWrites: boolean } }).__recoveryOwnership!
      controls.denyWrites = false
    })
    await page.getByRole('button', { name: '重试保存', exact: true }).click()
    await expect.poll(() => page.evaluate(async () =>
      (await navigator.locks.query()).pending?.filter(lock => lock.name === 'instance:checkpoint').length,
    )).toBe(1)
    await page.evaluate(() => {
      const controls = (window as typeof window & { __recoveryOwnership?: { completeImport: () => void } }).__recoveryOwnership!
      controls.completeImport()
    })
    const dialog = page.getByRole('dialog', { name: '恢复这份记录？' })
    const confirm = dialog.getByRole('button', { name: '确认恢复记录', exact: true })
    await expect(dialog).toBeVisible()
    await expect(confirm).toBeDisabled()

    await other.evaluate(() => {
      const controls = (window as typeof window & { __recoveryWriter?: { write: () => void } }).__recoveryWriter!
      controls.write()
    })
    await expect.poll(() => other.evaluate(() =>
      (window as typeof window & { __recoveryWriter?: { written: boolean } }).__recoveryWriter?.written,
    )).toBe(true)
    const newer = await other.evaluate(() => {
      const controls = (window as typeof window & { __recoveryWriter?: { raw: string; choiceId: string; error: string } }).__recoveryWriter!
      return { raw: controls.raw, choiceId: controls.choiceId, error: controls.error }
    })
    expect(newer.error).toBe('')
    await expect(page.locator('.save-recovery h2')).toHaveText('另一页已有新进度')
    // The storage event can change "saving" to "conflict" before the queued
    // transaction finishes. A now-enabled confirmation must still be guarded.
    if (await confirm.isEnabled()) await confirm.click()
    await expect(dialog).toBeVisible()
    expect(await page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))).toBe(newer.raw)

    await other.evaluate(() => {
      const controls = (window as typeof window & { __recoveryWriter?: { release: () => void } }).__recoveryWriter!
      controls.release()
    })
    await expect.poll(() => page.evaluate(async () => {
      const state = await navigator.locks.query()
      return [...(state.held ?? []), ...(state.pending ?? [])].filter(lock => lock.name === 'instance:checkpoint').length
    })).toBe(0)
    expect(await page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))).toBe(newer.raw)
    await expect(dialog).toBeVisible()

    // The user's selected import remains available after rejecting the stale
    // retry. Only a fresh confirmation is allowed to replace the newer record.
    await confirm.click()
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run.runId)).toBe(imported.runId)
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const recovered = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run)
    expect(recovered.history).toEqual([])
    expect(recovered.runId).toBe(imported.runId)
    expect(errors).toEqual([])
  } finally {
    await other.close()
  }
})
