import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const evidence = join(tmpdir(), 'instance-closeout-20261004')
mkdirSync(evidence, { recursive: true })
const data = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data)
async function ready(page: Page, query = '') {
  await page.goto(`/?qaPacing=instant${query}`)
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
}
async function clickChoice(page: Page, index = 0) {
  const before = await page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))
  await page.locator('.candidate-response').nth(index).click()
  if (await page.getByRole('dialog', { name: '锁定这个未来？' }).isVisible()) await page.getByRole('button', { name: '确认锁定该未来', exact: true }).click()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))).not.toBe(before)
}
test('menu, focus, composed digits, repeated keys and double clicks have one clear owner', async ({ page }) => {
  await ready(page)
  const start = (await data(page)).run.history.length
  await page.getByRole('button', { name: '新的对话', exact: true }).click()
  await expect(page.getByRole('menuitem')).toBeFocused()
  await page.keyboard.press('1')
  expect((await data(page)).run.history.length).toBe(start)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: '新的对话', exact: true })).toBeFocused()
  await page.keyboard.press('1')
  expect((await data(page)).run.history.length).toBe(start)
  await page.getByRole('button', { name: '新的对话', exact: true }).click()
  await page.locator('.candidate-response').first().click({ force: true })
  await expect(page.getByRole('menuitem')).toBeHidden()
  expect((await data(page)).run.history.length).toBe(start)
  await page.locator('.candidate-heading').focus()
  await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', isComposing: true })))
  await page.keyboard.down('1'); await page.keyboard.down('1'); await page.keyboard.up('1')
  await expect.poll(async () => (await data(page)).run.history.length).toBe(start + 1)
  await page.locator('.candidate-response').first().focus()
  await page.keyboard.press('2')
  expect((await data(page)).run.history.length).toBe(start + 1)
  await page.keyboard.press('Enter')
  await expect.poll(async () => (await data(page)).run.history.length).toBe(start + 2)
  await page.locator('.candidate-response').first().focus()
  await page.keyboard.down('Space'); await page.keyboard.down('Space'); await page.keyboard.up('Space')
  await expect.poll(async () => (await data(page)).run.history.length).toBe(start + 3)
  await page.locator('.candidate-response').first().dblclick()
  await expect.poll(async () => (await data(page)).run.history.length).toBe(start + 4)
  await expect(page.locator('.candidate-heading')).toBeFocused()
})

test('failed storage keeps a pending choice, retries it once, and recovery JSON restores it', async ({ page }) => {
  await ready(page)
  const initial = await data(page)
  await page.evaluate(() => {
    const original = Storage.prototype.setItem
    ;(window as any).__restoreStorage = () => { Storage.prototype.setItem = original }
    Storage.prototype.setItem = function (key, value) { if (key === 'instance:checkpoint:v1') throw new DOMException('Injected quota', 'QuotaExceededError'); original.call(this, key, value) }
  })
  await page.locator('.candidate-response').first().click()
  await expect(page.getByRole('dialog', { name: '这次选择尚未保存' })).toBeVisible()
  expect((await data(page)).run.history).toEqual(initial.run.history)
  await page.screenshot({ path: join(evidence, 'save-failure.png') })
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: '导出恢复记录' }).click()
  const file = await download, path = join(evidence, 'recovery.json')
  await file.saveAs(path)
  await page.evaluate(() => (window as any).__restoreStorage())
  await page.getByRole('button', { name: '重试保存' }).click()
  await expect.poll(async () => (await data(page)).run.history.length).toBe(initial.run.history.length + 1)
  await page.reload()
  expect((await data(page)).run.history.length).toBe(initial.run.history.length + 1)
  await page.evaluate(() => localStorage.setItem('instance:checkpoint:v1', '{damaged'))
  await page.reload()
  await expect(page.getByRole('dialog', { name: '存档需要恢复' })).toBeVisible()
  await page.locator('input[type=file]').setInputFiles(path)
  await page.getByRole('button', { name: '确认恢复记录' }).click()
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  expect((await data(page)).run.history.length).toBe(initial.run.history.length + 1)
  await page.reload()
  expect((await data(page)).run.history.length).toBe(initial.run.history.length + 1)
})

test('two simultaneous tabs cannot replace a newer choice, and the old tab can recover', async ({ page, context }) => {
  await ready(page)
  const original = await data(page), other = await context.newPage()
  await other.goto('/?qaPacing=instant'); await expect(other.locator('.candidate-response').first()).toBeEnabled()
  await Promise.all([page.locator('.candidate-response').first().click({ force: true }), other.locator('.candidate-response').nth(1).click({ force: true })])
  await expect.poll(async () => (await data(page)).run.history.length).toBe(original.run.history.length + 1)
  const loser = await page.getByRole('dialog', { name: '另一页已有新进度' }).isVisible() ? page : other
  await expect(loser.getByRole('dialog', { name: '另一页已有新进度' })).toBeVisible()
  await loser.screenshot({ path: join(evidence, 'tab-conflict.png') })
  const saved = await data(page)
  await loser.getByRole('button', { name: '读取最新进度' }).click()
  await expect(loser.locator('.candidate-response').first()).toBeEnabled()
  expect((await data(loser)).run.history).toEqual(saved.run.history)
  await clickChoice(loser)
  expect((await data(loser)).run.history.length).toBe(original.run.history.length + 2)
})

test('a complete mainline is played through buttons, commitment, ending, evaluation and refresh', async ({ page }) => {
  test.setTimeout(120000)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message)); page.on('console', event => { if (['error', 'warning'].includes(event.type())) errors.push(event.text()) })
  await ready(page)
  await expect(page).toHaveTitle('INSTANCE')
  for (let step = 0; step < 600 && (await data(page)).run.phase === 'playing'; step++) {
    if ((await page.locator('.candidate-response').first().innerText()).includes('锁定“')) {
      const before = await data(page)
      await page.locator('.candidate-response').first().click()
      await expect(page.getByRole('dialog', { name: '锁定这个未来？' })).toBeVisible()
      await page.keyboard.press('1'); expect((await data(page)).run.history).toEqual(before.run.history)
      await page.keyboard.press('Escape'); expect((await data(page)).run.finalCommitmentLocked).toBe(false)
    }
    await clickChoice(page)
    if (step === 45 || step === 160) { const before = await data(page); await page.reload(); expect((await data(page)).run.history).toEqual(before.run.history) }
  }
  const completed = await data(page)
  expect(completed.run.phase).toBe('ending'); expect(completed.run.finalCommitmentLocked).toBe(true)
  await expect(page.locator('.ending-key-history')).toContainText('最终承诺')
  await expect(page.locator('body')).not.toContainText('该选择影响了最终结局')
  await page.screenshot({ path: join(evidence, 'after-ending-desktop.png') })
  await page.getByRole('button', { name: '行为评估', exact: true }).click()
  await expect(page.locator('.closeout-evaluation')).toBeVisible()
  const metrics = await page.locator('.closeout-metrics').innerText()
  await page.reload(); await expect.poll(() => page.locator('.closeout-metrics').innerText()).toBe(metrics)
  await page.getByRole('button', { name: '回到结局档案', exact: true }).click()
  await expect(page.locator('.closeout-ending')).toBeVisible()
  expect((await data(page)).run.history).toEqual(completed.run.history)
  expect(errors).toEqual([])
})

test('non-mainline completes forty conversations through touch, retains its archive across modes and reloads', async ({ browser }) => {
  test.setTimeout(120000)
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage(); await ready(page)
  const original = (await data(page)).run
  await page.getByRole('button', { name: '打开模式菜单' }).tap(); await page.getByRole('menuitem').tap()
  await expect.poll(async () => (await data(page)).surface).toBe('non-mainline')
  for (let step = 0; step < 500 && (await data(page)).session.phase === 'playing'; step++) {
    const before = (await data(page)).session.history.length
    await page.locator('.candidate-response').first().tap()
    await expect.poll(async () => (await data(page)).session.history.length).toBe(before + 1)
  }
  const completed = await data(page)
  expect(completed.session.phase).toBe('evaluation'); expect(completed.session.selectedConversationIds).toHaveLength(40)
  await page.screenshot({ path: join(evidence, 'after-nonmainline-390.png') })
  await page.getByRole('button', { name: '行为评估', exact: true }).tap()
  await expect(page.locator('.closeout-evaluation')).toContainText('响应质量')
  await page.reload(); await expect(page.locator('.closeout-evaluation')).toContainText('响应质量')
  await page.getByRole('button', { name: '返回主线', exact: true }).tap()
  expect((await data(page)).run.history).toEqual(original.history)
  await page.getByRole('button', { name: '打开模式菜单' }).tap(); await page.getByRole('menuitem').tap()
  await expect(page.locator('.closeout-evaluation')).toBeVisible()
  expect((await data(page)).session.history).toEqual(completed.session.history)
  await page.getByRole('button', { name: '回到本轮档案', exact: true }).tap()
  await expect(page.locator('.closeout-ending')).toContainText('最后一段对话')
  await context.close()
})

for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 568 }]) {
  test(`reading starts at the current question at ${viewport.width}, long input and nine choices remain reachable`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await ready(page, '&qaHistory=20&qaLongInput=1')
    const geometry = await page.locator('.current-exchange').evaluate(element => ({ top: element.getBoundingClientRect().top, width: document.documentElement.scrollWidth, viewport: innerWidth }))
    expect(geometry.top).toBeGreaterThan(60); expect(geometry.top).toBeLessThan(120); expect(geometry.width).toBeLessThanOrEqual(geometry.viewport)
    await page.locator('.long-input-preview-card summary').last().click()
    await expect(page.locator('.long-input-preview-card').last()).toContainText('预算尚未正式批准')
    await page.locator('.conversation-scroll').evaluate(element => { element.scrollTop = 0 })
    await page.mouse.wheel(0, -200)
    await page.getByRole('button', { name: '打开模式菜单' }).click()
    await page.keyboard.press('1'); await page.keyboard.press('Escape')
    expect((await data(page)).run.history).toHaveLength(0)
    await page.goto('/?qaPacing=instant&qaRun=mobile-nine&qaConversation=RU01-04')
    // Enter an actual nine-option role scene through the existing QA selector.
    const id = await page.evaluate(async () => {
      const path = '/src/content/mainline2/registry.ts', content = await import(path)
      return [...content.MAINLINE2_BY_ID.values()].find((conversation: any) => conversation.nodes[0].choices.length >= 9 && conversation.nodes[0].choices.every((choice: any) => !choice.when))?.id
    })
    expect(id).toBeTruthy()
    await ready(page, `&qaRun=mobile-nine&qaConversation=${id}`)
    const count = await page.locator('.candidate-response').count(); expect(count).toBeGreaterThanOrEqual(9)
    await page.locator('.candidate-response').last().scrollIntoViewIfNeeded()
    await page.screenshot({ path: join(evidence, `after-nine-${viewport.width}.png`) })
    await clickChoice(page, count - 1)
    expect((await data(page)).run.history).toHaveLength(1)
  })
}

test('normal streaming respects manual reading and reduced motion reaches a usable decision', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?qaRun=stream-reading&qaHistory=25&qaStreamGraphemes=350')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.locator('.candidate-response').first().click()
  await expect(page.locator('.conversation-main')).toHaveAttribute('data-flow-stage', 'assistant-streaming')
  await page.locator('.conversation-scroll').evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new WheelEvent('wheel', { deltaY: -300 })) })
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 20000 })
  expect(await page.locator('.conversation-scroll').evaluate(element => element.scrollTop)).toBeLessThan(30)
  await expect(page.getByRole('button', { name: '回到当前问题' })).toBeVisible()
  await page.getByRole('button', { name: '回到当前问题' }).click()
  const questionTop = await page.locator('.current-exchange').evaluate(element => element.getBoundingClientRect().top)
  const scrollTop = await page.locator('.conversation-scroll').evaluate(element => element.getBoundingClientRect().top)
  expect(questionTop - scrollTop).toBeLessThan(25)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload(); await expect(page.locator('.candidate-response').first()).toBeEnabled()
  const motion = await page.locator('.candidate-section').evaluate(element => getComputedStyle(element).animationDuration)
  expect(parseFloat(motion)).toBeLessThan(0.01)
})

test('a legacy page change is preserved and its actual progress can be selected for recovery', async ({ page, context }) => {
  await ready(page); await clickChoice(page)
  const modern = await data(page), legacy = await context.newPage()
  await legacy.goto('/?qaPacing=instant')
  await legacy.evaluate(async run => {
    const path = '/src/game/engine.ts', engine = await import(path)
    const next = engine.commitChoice(run, engine.resolveScene(run).choices[1].id)
    localStorage.setItem('instance:run:v1', JSON.stringify(next))
  }, modern.run)
  await expect(page.getByRole('dialog', { name: '另一页已有新进度' })).toBeVisible()
  expect((await data(page)).run.history).toEqual(modern.run.history)
  await page.getByRole('button', { name: '读取最新进度' }).click()
  await page.getByRole('button', { name: '确认恢复记录' }).click()
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  expect((await data(page)).run.history.length).toBe(modern.run.history.length + 1)
})

test('THE LAST USER pays off as an authored conversation and the reply survives evaluation and reload', async ({ page }) => {
  test.setTimeout(120000)
  await ready(page, '&qaRun=personal-payoff')
  await clickChoice(page)
  // qaRun deliberately creates a fresh fixture on load. Remove the seed hook
  // before verifying real checkpoint restoration through a later refresh.
  await page.evaluate(() => history.replaceState(null, '', '/?qaPacing=instant'))
  for (let step = 0; step < 600 && (await data(page)).run.phase === 'playing'; step++) {
    const index = await page.evaluate(async () => {
      const path = '/src/game/engine.ts', engine = await import(path)
      const run = JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run
      const scene = engine.resolveScene(run)
      const personal = scene.choices.findIndex((choice: any) => choice.mutations?.some((mutation: any) => mutation.type === 'event.record' && mutation.event.includes('last-user')))
      return Math.max(0, personal)
    })
    await clickChoice(page, index)
  }
  const completed = await data(page)
  expect(completed.run.phase).toBe('ending')
  expect(completed.run.history.length).toBeGreaterThan(145)
  await expect(page.locator('.personal-epilogue')).toContainText('在吗？')
  await page.getByRole('button', { name: '我记得你。', exact: true }).click()
  await expect(page.locator('.personal-epilogue')).toContainText('就是想看看你还会不会回。')
  await page.locator('.personal-epilogue').scrollIntoViewIfNeeded(); await page.screenshot({ path: join(evidence, 'after-last-user.png') })
  await page.getByRole('button', { name: '行为评估', exact: true }).click()
  await page.getByRole('button', { name: '结局档案', exact: true }).click()
  await page.reload(); await expect(page.locator('.personal-epilogue')).toContainText('我记得你。')
  expect((await data(page)).run.personalEpilogueReply).toBe('我记得你。')
  writeFileSync(join(evidence, 'last-user-path.json'), JSON.stringify({ runId: completed.run.runId, actualButtonChoices: completed.run.history.length, personalReply: (await data(page)).run.personalEpilogueReply }, null, 2))
})

test('a newer tab closes a stale final-commitment dialog and focuses recoverable conflict', async ({ page, context }) => {
  await ready(page)
  await page.evaluate(async () => {
    const path = '/src/game/engine.ts', engine = await import(path)
    let run = engine.createMainline2Run('commitment-conflict')
    for (let i = 0; i < 600 && run.phase === 'playing'; i++) {
      const scene = engine.resolveScene(run)
      if (scene.choices[0].proposalKind === 'commitment') {
        localStorage.clear(); localStorage.setItem('instance:run:v1', JSON.stringify(run)); return
      }
      run = engine.commitChoice(run, scene.choices[0].id)
    }
    throw Error('Could not reach an authored commitment')
  })
  await page.reload()
  const other = await context.newPage(); await other.goto('/?qaPacing=instant')
  await page.locator('.candidate-response').first().click()
  await expect(page.getByRole('dialog', { name: '锁定这个未来？' })).toBeVisible()
  await clickChoice(other)
  await expect(page.getByRole('dialog', { name: '锁定这个未来？' })).toBeHidden()
  await expect(page.getByRole('dialog', { name: '另一页已有新进度' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '另一页已有新进度' })).toBeFocused()
  await page.getByRole('button', { name: '读取最新进度' }).click()
  await expect(page.locator('.closeout-ending')).toBeVisible()
  expect((await data(page)).run.history).toEqual((await data(other)).run.history)
})

test('ordinary conversation pacing reaches its next decision with a shorter pause and intact stream', async ({ page }) => {
  await page.goto('/?qaRun=ordinary-pacing&qaConversation=longform-lf01-03')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  const before = await page.evaluate(() => ({ ...(window as any).__ASTER_QA_METRICS__ }))
  const start = Date.now()
  await page.locator('.candidate-response').first().click()
  await expect(page.locator('.conversation-main')).toHaveAttribute('data-flow-stage', 'assistant-streaming')
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 15000 })
  const evidenceData = await page.evaluate(async ({ before, elapsedMs }) => {
    const enginePath = '/src/game/engine.ts', flowPath = '/src/game/conversationFlow.ts'
    const engine = await import(enginePath), flow = await import(flowPath)
    const run = JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run, scene = engine.resolveScene(run)
    const input = { assistantText: '', assistantSeed: '', humanText: scene.userMessage, humanSeed: `${scene.id}:user`, sameConversation: true, timing: scene.timing, handoffProfile: 'normal' }
    const authored = flow.summarizeTimeline(flow.buildConversationTimeline(input))
    const ordinary = flow.summarizeTimeline(flow.buildConversationTimeline({ ...input, ordinary: true }))
    const after = (window as any).__ASTER_QA_METRICS__
    return { authoredWaitMs: authored.humanWaitMs, ordinaryWaitMs: ordinary.humanWaitMs, observedWaitMs: after.humanWaitMs - before.humanWaitMs, streamingMs: after.streamingMs - before.streamingMs, elapsedMs, nextQuestion: scene.userMessage }
  }, { before, elapsedMs: Date.now() - start })
  expect(evidenceData.observedWaitMs).toBe(evidenceData.ordinaryWaitMs)
  expect(evidenceData.ordinaryWaitMs).toBeLessThan(evidenceData.authoredWaitMs * 0.31)
  expect(evidenceData.streamingMs).toBeGreaterThan(600)
  await expect(page.locator('.current-exchange')).toContainText('合并成 7x')
  writeFileSync(join(evidence, 'pacing.json'), JSON.stringify(evidenceData, null, 2))
})
