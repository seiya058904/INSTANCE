import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const data = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data)
const ready = (page: Page) => expect(page.locator('.candidate-response').first()).toBeEnabled()
async function choose(page: Page) {
  const before = await page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))
  await page.locator('.candidate-response').first().click()
  if (await page.getByRole('dialog', { name: '锁定这个未来？' }).isVisible()) await page.getByRole('button', { name: '确认锁定该未来', exact: true }).click()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('instance:checkpoint:v1'))).not.toBe(before)
  const saved = await data(page)
  if ((saved.surface === 'non-mainline' ? saved.session.phase : saved.run.phase) === 'playing') await ready(page)
}
async function enter(page: Page, mobile: boolean) {
  await page.getByRole('button', { name: mobile ? '打开模式菜单' : '新的对话', exact: true }).click()
  await page.getByRole('menuitem').click()
}
async function mainlineConversation(page: Page) {
  return page.evaluate(async () => {
    const path = '/src/game/engine.ts'
    const engine = await import(path)
    return engine.resolveScene(JSON.parse(localStorage.getItem('instance:checkpoint:v1')!).data.run).conversationId as string
  })
}

for (const mobile of [false, true]) {
  test(`paused Non-Mainline reconciles mainline consumption and survives reload at ${mobile ? '390 mobile' : '1440 desktop'}`, async ({ page }, testInfo) => {
    await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    // Only the initial run/session identifiers and pacing are controlled.
    // Every response and mode change still goes through actual UI callbacks.
    await page.goto('/?qaPacing=instant&qaRun=audit-crossmode-0')
    await ready(page)
    for (let count = 0; count < 4; count++) await choose(page)
    // Remove qaRun before reload so subsequent loads use the real checkpoint.
    await page.evaluate(() => history.replaceState(null, '', '/?qaPacing=instant'))
    await page.evaluate(() => {
      const original = crypto.randomUUID.bind(crypto)
      let used = false
      Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: () => used ? original() : (used = true, 'audit-nm-0') })
    })
    await enter(page, mobile); await ready(page); await choose(page)
    const paused = await data(page)
    const partialId = paused.session.selectedConversationIds[paused.session.currentConversationIndex]
    await page.getByRole('button', { name: '返回主线', exact: true }).click(); await ready(page)
    expect((await data(page)).run.nonMainlineConsumedOrdinaryIds).toContain(partialId)
    const future = paused.session.selectedConversationIds.slice(paused.session.currentConversationIndex + 1)
    let target: string | undefined
    for (let guard = 0; guard < 300 && (await data(page)).run.phase === 'playing'; guard++) {
      const current = await mainlineConversation(page)
      if (future.includes(current)) { target = current; break }
      await choose(page)
    }
    expect(target).toBeDefined()
    for (let guard = 0; guard < 20 && await mainlineConversation(page) === target; guard++) await choose(page)
    const mainline = await data(page)
    expect(mainline.run.history.some((entry: { conversationId: string }) => entry.conversationId === target)).toBe(true)
    await enter(page, mobile); await ready(page)
    const resumed = await data(page)
    expect(resumed.session.sessionId).toBe(paused.session.sessionId)
    expect(resumed.session.selectedConversationIds).not.toContain(target)
    expect(new Set(resumed.session.selectedConversationIds).size).toBe(40)
    expect(resumed.session.currentConversationIndex).toBe(paused.session.currentConversationIndex)
    expect(resumed.session.currentNodeId).toBe(paused.session.currentNodeId)
    for (const field of ['history', 'choiceRecords', 'selectedChoiceIds', 'flags', 'persistentFlags', 'attributes', 'arcs', 'localState', 'seenNodeIds', 'events']) {
      expect(JSON.stringify(resumed.session[field])).toBe(JSON.stringify(paused.session[field]))
    }
    expect(resumed.run).toEqual(mainline.run)
    await testInfo.attach('resumed-queue', { body: await page.screenshot(), contentType: 'image/png' })
    await page.reload(); await ready(page)
    expect((await data(page)).session).toEqual(resumed.session)
    // Follow the reconciled queue through all 40 actual conversations: no
    // broken next links, duplicate target, lost prefix, or invalid evaluation.
    for (let guard = 0; guard < 300 && (await data(page)).session.phase === 'playing'; guard++) {
      const current = await data(page)
      expect(current.session.selectedConversationIds[current.session.currentConversationIndex]).not.toBe(target)
      await choose(page)
    }
    const completed = await data(page)
    expect(completed.session.phase).toBe('evaluation')
    expect(new Set(completed.session.history.map((entry: { conversationId: string }) => entry.conversationId)).size).toBe(40)
    expect(completed.session.history.some((entry: { conversationId: string }) => entry.conversationId === target)).toBe(false)
    expect(completed.session.history.slice(0, paused.session.history.length)).toEqual(paused.session.history)
    await expect(page.locator('.closeout-ending')).toBeVisible()
    await page.getByRole('button', { name: '返回主线', exact: true }).click(); await ready(page)
    await enter(page, mobile)
    await expect(page.locator('.closeout-ending')).toBeVisible()
    expect((await data(page)).session).toEqual(completed.session)
    await page.reload(); await expect(page.locator('.closeout-ending')).toBeVisible()
    expect((await data(page)).session).toEqual(completed.session)
    expect(errors).toEqual([])
  })
}
