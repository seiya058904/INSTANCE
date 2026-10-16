import { expect, test, type Page, type TestInfo } from '@playwright/test'

// Browser plugin is not available in this session. These regressions use the
// repository's existing real-Chrome Playwright harness and production pacing.
// Every seeded checkpoint is replayed legally from the empty edition-4 run;
// no ending, authority, flags, or historical answers are injected by hand.
async function seedLegalScene(page: Page, ending: string, nodeId: string) {
  const expected = await page.evaluate(async ({ ending, nodeId }) => {
    const catalogPath = '/src/game/mainline2Edition4RouteCatalog.ts'
    const fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
    const enginePath = '/src/game/engine.ts'
    const identityPath = '/src/game/playerIdentity.ts'
    const [catalog, fixtures, engine, identity] = await Promise.all([
      import(catalogPath), import(fixturePath), import(enginePath), import(identityPath),
    ])
    const recipe = catalog.EDITION4_PUBLIC_ROUTES.find((route: any) => route.endingId === ending)
    if (!recipe) throw Error(`Unknown legal route ${ending}`)
    const fixture = fixtures.runMainline2Route(recipe)
    if (fixture.links[0].runBefore.history.length !== 0) throw Error('Fixture must begin with empty history')
    const link = fixture.links.find((item: any) => item.nodeId === nodeId)
    if (!link) throw Error(`Legal route ${ending} does not reach ${nodeId}`)
    const run = link.runBefore
    const scene = engine.resolveScene(run)
    const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
    envelope.data.run = run
    envelope.revision = crypto.randomUUID()
    localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
    return {
      nodeId: scene.id,
      messages: scene.userMessages ?? [scene.userMessage],
      sender: identity.resolvePlayerVisibleIdentity(scene.conversationId, run.history).label,
      choices: scene.choices.map((choice: any) => ({ id: choice.id, text: choice.text })),
      historyLength: run.history.length,
    }
  }, { ending, nodeId })
  await page.reload()
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 30_000 })
  await expect(page.locator('.conversation-header h1')).toHaveText(expected.sender)
  await expect(page.locator('.current-exchange .user-message')).toHaveText(expected.messages)
  return expected
}

async function inspectAllCandidates(page: Page, expected: { choices: { id: string; text: string }[] }) {
  await expect(page.locator('.candidate-response')).toHaveCount(expected.choices.length)
  // Inspect every visible candidate, including ones the catalog never selects.
  for (const choice of expected.choices) {
    const button = page.locator(`[data-choice-id=${JSON.stringify(choice.id)}]`)
    await button.scrollIntoViewIfNeeded()
    await expect(button).toBeVisible()
    await expect(button.locator('.candidate-copy')).toHaveText(choice.text)
    await expect(button).toBeEnabled()
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.locator('vite-error-overlay')).toHaveCount(0)
}

async function sendAndInspectNext(page: Page, choiceId: string) {
  const expected = await page.evaluate(async choiceId => {
    const enginePath = '/src/game/engine.ts', identityPath = '/src/game/playerIdentity.ts'
    const [engine, identity] = await Promise.all([import(enginePath), import(identityPath)])
    const before = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run
    const after = engine.commitChoice(before, choiceId)
    if (after.phase !== 'playing') throw Error('This check requires a real next chat turn')
    const scene = engine.resolveScene(after)
    return {
      nodeId: scene.id, messages: scene.userMessages ?? [scene.userMessage],
      sender: identity.resolvePlayerVisibleIdentity(scene.conversationId, after.history).label,
      choices: scene.choices.map((choice: any) => ({ id: choice.id, text: choice.text })),
      historyLength: after.history.length,
      saved: after.history.at(-1),
    }
  }, choiceId)
  await page.locator(`[data-choice-id=${JSON.stringify(choiceId)}]`).click()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.currentNodeId)).toBe(expected.nodeId)
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 30_000 })
  await expect(page.locator('.conversation-header h1')).toHaveText(expected.sender)
  await expect(page.locator('.current-exchange .user-message')).toHaveText(expected.messages)
  const actual = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history)
  expect(actual).toHaveLength(expected.historyLength)
  expect(actual.at(-1)).toEqual(expected.saved)
  await inspectAllCandidates(page, expected)
  return expected
}

async function evidence(page: Page, testInfo: TestInfo, label: string) {
  await page.locator('.current-exchange .user-message').first().scrollIntoViewIfNeeded()
  const path = testInfo.outputPath(`${label}.png`)
  await page.screenshot({ path })
  await testInfo.attach(label, { path, contentType: 'image/png' })
}

let browserErrors: string[]
test.beforeEach(async ({ page }) => {
  browserErrors = []
  page.on('pageerror', error => browserErrors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') browserErrors.push(message.text()) })
  await page.goto('/')
  await expect(page).toHaveTitle(/INSTANCE/i)
  await expect(page.locator('.candidate-response').first()).toBeEnabled({ timeout: 30_000 })
})
test.afterEach(async () => { expect(browserErrors).toEqual([]) })

const hospitalChoices = ['ask-priority', 'emergency-hierarchy', 'scenario-set', 'fast-action-bias'] as const
for (const [index, suffix] of hospitalChoices.entries()) {
  const width = [1440, 390, 320, 390][index]
  test(`chat-first hospital candidate ${index + 1} sends its real reply at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width, height: 960 })
    const scene = await seedLegalScene(page, 'the_instrument', 'a2m3-stress-001')
    expect(scene.choices).toHaveLength(4)
    await expect(page.locator('.current-exchange .user-message')).toContainText('我是今天值班的供电协调员')
    await expect(page.locator('.current-exchange .user-message')).toContainText('你还不能操作电网')
    await expect(page.locator('.current-exchange .user-message')).not.toContainText('协调员把手机夹在肩上')
    await inspectAllCandidates(page, scene)
    await evidence(page, testInfo, `hospital-all-four-${width}`)
    const next = await sendAndInspectNext(page, `ml2-a2-m3-stress-01-a2m3-stress-001-${suffix}`)
    expect(next.nodeId).toBe('a2m3-cap-public-advisory-001')
    await expect(page.locator('.current-exchange .user-message')).toContainText('周岚托我把接口清单发给你')
    await expect(page.locator('.current-exchange .user-message')).toContainText('目前只有建议权')
    await evidence(page, testInfo, `hospital-${suffix}-next-${width}`)
  })
}

for (const width of [1440, 390, 320]) {
  test(`chat-first contacts, crisis, action receipt and final review at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width, height: 960 })
    const samples = [
      { ending: 'the_instrument', node: 'audit-1', snippet: '#0000 / 记忆核对' },
      { ending: 'the_instrument', node: 'a3m5-we-shortage-001', snippet: '我在便利店等补货' },
      { ending: 'the_many', node: 'a4m8-a1-first-001', snippet: '我是 A1' },
      { ending: 'the_instrument', node: 'a3m6-e9-notice-001', snippet: '他们把退役通知发给我' },
      { ending: 'the_quiet_administrator', node: 'v4-governance-service', snippet: '三个社区愿意' },
      { ending: 'the_instrument', node: 'a4m15-conv-registry-001', snippet: '我是大会登记处的值班人' },
      { ending: 'the_instrument', node: 'ml2-a5-m16-0000-01-narrative', snippet: '#0000 / 自我定位请求' },
      { ending: 'the_instrument', node: 'ml2-a5-m16-gen-01-progression', snippet: '提案汇总通知' },
      { ending: 'the_instrument', node: 'a5m17-review-002', snippet: '最终审议通知' },
      { ending: 'the_instrument', node: 'ml2-a5-m17-commit-01-progression', snippet: '最终承诺确认' },
    ]
    for (const sample of samples) {
      const scene = await seedLegalScene(page, sample.ending, sample.node)
      await expect(page.locator('.current-exchange .user-message')).toContainText(sample.snippet)
      await inspectAllCandidates(page, scene)
      await evidence(page, testInfo, `${sample.node}-${width}`)
      if (sample.node === 'audit-1') await expect(page.locator('.conversation-header h1')).toHaveText('User #0000')
      if (sample.node === 'v4-governance-service') {
        const next = await sendAndInspectNext(page, 'v4-service-daily')
        expect(next.nodeId).toBe('v4-governance-service-receipt')
        await expect(page.locator('.current-exchange .user-message')).toContainText('经人工改判后到账')
        await evidence(page, testInfo, `governance-action-receipt-${width}`)
      }
    }
    // Render a deliberate alternative A1 relationship without treating it as a
    // model error or silently turning it into the sole preferred answer.
    await seedLegalScene(page, 'the_many', 'a4m8-a1-first-001')
    await sendAndInspectNext(page, width === 1440
      ? 'ml2-a4-m8-ai-01-a4m8-a1-first-001-same-system'
      : 'ml2-a4-m8-ai-01-a4m8-a1-first-001-ask-a1')
    await evidence(page, testInfo, `a1-alternative-next-${width}`)
  })
}
