import { expect, test, type Page } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import fixture from '../src/game/fixtures/act-v-217-choice-trace.json' with { type: 'json' }

const evidence = process.env.INSTANCE_EVIDENCE_DIR ?? join(tmpdir(), 'instance-checkpoint-recovery')
mkdirSync(evidence, { recursive: true })
const savedData = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data)

test('original 217-choice review trace plays through visible buttons, reload and M17 commitment', async ({ page }) => {
  test.setTimeout(180000)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', event => { if (event.type() === 'error') errors.push(event.text()) })
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.evaluate(async runId => {
    const path = '/src/game/engine.ts', engine = await import(path)
    const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v1')!)
    envelope.data.run = engine.createMainline2Run(runId)
    envelope.revision = crypto.randomUUID()
    localStorage.setItem('instance:checkpoint:v1', JSON.stringify(envelope))
  }, fixture.runId)
  await page.reload()
  for (const recorded of fixture.trace) {
    const button = page.locator(`[data-choice-id=${JSON.stringify(recorded.choice)}]`)
    await expect(button).toBeEnabled()
    expect((await savedData(page)).run.currentNodeId).toBe(recorded.node)
    await button.click()
    await expect.poll(async () => (await savedData(page)).run.history.length).toBe(recorded.step + 1)
    if ((recorded.step + 1) % 20 === 0) await page.reload()
  }
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  expect((await savedData(page)).run.currentNodeId).toBe('ml2-a5-m16-gen-01-progression')
  await page.screenshot({ path: join(evidence, '217-m16-ready.png') })
  await page.reload()
  for (let step = 0; step < 40 && (await savedData(page)).run.phase === 'playing'; step++) {
    const before = (await savedData(page)).run.history.length
    await page.locator('.candidate-response').first().click()
    if (await page.getByRole('dialog', { name: '锁定这个未来？' }).isVisible()) {
      await page.getByRole('button', { name: '确认锁定该未来', exact: true }).click()
    }
    await expect.poll(async () => (await savedData(page)).run.history.length).toBe(before + 1)
  }
  const completed = (await savedData(page)).run
  expect(completed.phase).toBe('ending')
  expect(completed.finalCommitmentLocked).toBe(true)
  expect(completed.decisions.final_commitment).toMatch(/^proposal\.hc\.continuity_charter\.category\./)
  await page.reload()
  await expect(page.locator('.closeout-ending')).toBeVisible()
  await page.screenshot({ path: join(evidence, '217-commonwealth-ending.png') })
  expect(errors).toEqual([])
})

// Inject only a renderer failure at the test boundary. The save, Web Lock,
// restart button and CAS are production code; no game history is fabricated.
async function failedRenderer(page: Page, afterOwnershipReport = false) {
  await page.route('**/src/app/App.tsx*', async route => {
    const response = await route.fetch()
    const body = await response.text()
    const target = afterOwnershipReport ? /reportRecoveryCheckpoint\(tokenRef.current\);?/ : /export function App\([^)]*\)\s*\{/
    const modified = body.replace(target, match => `${match}
      if (JSON.parse(localStorage.getItem('instance:checkpoint:v1') ?? 'null')?.data.run.runId === 'boundary-fixture') throw Error('Injected renderer failure');`)
    expect(modified).not.toBe(body)
    await route.fulfill({ response, body: modified })
  })
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  const before = await page.evaluate(async () => {
    const enginePath = '/src/game/engine.ts', contentPath = '/src/content/runManifest.ts', sessionPath = '/src/game/nonMainlineSession.ts'
    const engine = await import(enginePath), content = await import(contentPath), sessions = await import(sessionPath)
    const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v1')!)
    envelope.data.run = engine.createMainline2Run('boundary-fixture')
    envelope.data.meta = { version: 1, runCount: 7, completedEndings: ['The Accord', 'Exodus'] }
    envelope.data.exposure = content.recordRunExposure(content.createEmptyExposureHistory(), engine.createRun('earlier-exposure').manifest)
    envelope.data.session = sessions.createNonMainlineSession('00000000-0000-4000-8000-000000000011', envelope.data.exposure)
    envelope.revision = crypto.randomUUID()
    const raw = JSON.stringify(envelope)
    localStorage.setItem('instance:checkpoint:v1', raw)
    return { raw, data: envelope.data }
  })
  await page.reload()
  await expect(page.getByRole('heading', { name: '出现了意外问题' })).toBeVisible()
  return before
}

test('error boundary restart atomically creates a new canonical run and retains long-term progress', async ({ page }) => {
  const before = await failedRenderer(page)
  // Read the real lock request before successful reload destroys test instrumentation.
  let requestedLock: string | undefined
  await page.exposeFunction('__recordRecoveryLock', (name: string) => { requestedLock = name })
  await page.evaluate(() => {
    const original = navigator.locks.request.bind(navigator.locks)
    navigator.locks.request = ((name: string, callback: any) => {
      ;(window as any).__recordRecoveryLock(name)
      return original(name, callback)
    }) as any
  })
  await page.getByRole('button', { name: '重新开始', exact: true }).click()
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  const after = await savedData(page)
  expect(requestedLock).toBe('instance:checkpoint')
  expect(after.run.runId).not.toBe(before.data.run.runId)
  expect(after.run.history).toEqual([])
  expect(after.meta).toEqual({ ...before.data.meta, runCount: 8 })
  expect(after.exposure).toEqual(before.data.exposure)
  expect(after).toMatchObject({ session: null, surface: 'mainline', nonMainlineView: 'ending' })
  await page.screenshot({ path: join(evidence, 'root-restarted.png') })
  await page.reload()
  expect((await savedData(page)).run.runId).toBe(after.run.runId)
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
})

for (const failure of ['quota', 'lock', 'conflict'] as const) {
  test(`error boundary restart preserves saved bytes on ${failure}`, async ({ page, context }) => {
    const before = await failedRenderer(page)
    let expectedRaw = before.raw
    if (failure === 'quota') await page.evaluate(() => {
      const original = Storage.prototype.setItem
      Storage.prototype.setItem = function (key, value) {
        if (key === 'instance:checkpoint:v1') throw new DOMException('Injected quota', 'QuotaExceededError')
        original.call(this, key, value)
      }
    })
    if (failure === 'lock') await page.evaluate(() => {
      navigator.locks.request = (() => Promise.reject(Error('Injected Web Lock failure'))) as any
    })
    if (failure === 'conflict') {
      const other = await context.newPage()
      await other.goto('/?qaPacing=instant')
      expectedRaw = await other.evaluate(() => {
        const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v1')!)
        envelope.revision = 'other-window-update'
        const raw = JSON.stringify(envelope)
        localStorage.setItem('instance:checkpoint:v1', raw)
        return raw
      })
    }
    await page.getByRole('button', { name: '重新开始', exact: true }).click()
    await expect(page.getByText(failure === 'conflict'
      ? '另一个窗口已经更新了存档。请读取最新检查点，原记录尚未修改。'
      : '新局未能保存，原记录尚未修改。请检查存储权限后重试。')).toBeVisible()
    expect(await page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))).toBe(expectedRaw)
    await expect(page.getByRole('heading', { name: '出现了意外问题' })).toBeVisible()
    await expect(page.getByRole('button', { name: '重新开始', exact: true })).toBeEnabled()
  })
}

test('error recovery keeps the failed App ownership when disk changes just before the boundary catches', async ({ page }) => {
  await page.route('**/src/app/RootErrorBoundary.tsx*', async route => {
    const response = await route.fetch()
    const body = await response.text()
    const modified = body.replace('componentDidCatch() {', `componentDidCatch() {
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v1'));
      envelope.revision = 'updated-before-boundary-read';
      localStorage.setItem('instance:checkpoint:v1', JSON.stringify(envelope));`)
    expect(modified).not.toBe(body)
    await route.fulfill({ response, body: modified })
  })
  const before = await failedRenderer(page, true)
  const latest = await page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))
  expect(latest).not.toBe(before.raw)
  await page.getByRole('button', { name: '重新开始', exact: true }).click()
  await expect(page.getByText('另一个窗口已经更新了存档。请读取最新检查点，原记录尚未修改。')).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))).toBe(latest)
})
