import { expect, test } from '@playwright/test'

test('rupture-only M16 save remains playable through explicit M17 commitment', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/?qaPacing=instant')
  await page.evaluate(async () => {
    const enginePath = '/src/game/engine.ts', storagePath = '/src/game/storage.ts'
    const engine = await import(enginePath), storage = await import(storagePath)
    let run = engine.createMainline2Run('independent-audit-13'), rng = 14
    for (let step = 0; step < 223; step++) {
      const scene = engine.resolveScene(run)
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0
      const choice = scene.choices.find((c: any) => c.proposalKind === 'commitment') ?? scene.choices[rng % scene.choices.length]
      run = engine.commitChoice(run, choice.id)
      if ((step + 1) % 7 === 0) run = storage.restoreRun(storage.serializeRun(run))
    }
    localStorage.setItem('instance:run:v1', storage.serializeRun(run))
  })
  await page.reload()
  await expect(page.locator('.candidate-response')).toHaveCount(1)
  await expect(page.locator('.candidate-response')).toContainText('异议路径')
  for (let step = 0; step < 40; step++) {
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:run:v1')!))
    if (before.phase === 'ending') break
    await page.locator('.candidate-response').first().click()
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:run:v1')!).history.length)).toBeGreaterThan(before.history.length)
    await page.reload()
  }
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:run:v1')!))
  expect(saved.phase).toBe('ending')
  expect(saved.finalCommitmentLocked).toBe(true)
  expect(saved.decisions.final_commitment).toBe('proposal.rupture.legible_exit.category.lawful_alternative')
  await expect(page.getByRole('button', { name: /查看 Instance Evaluation/ })).toBeVisible()
  expect(errors).toEqual([])
})

// Isolated browser checkpoints are produced through the actual game engines,
// not hand-authored completion flags. The actions under test use real UI buttons.
test('completed replay A and B survive replay, return, and reload', async ({ page }) => {
  await page.goto('/?qaPacing=instant')
  const a = await page.evaluate(async () => {
    const enginePath = '/src/game/engine.ts', sessionPath = '/src/game/nonMainlineSession.ts', contentPath = '/src/content/runManifest.ts'
    const engine = await import(enginePath), sessions = await import(sessionPath), content = await import(contentPath)
    const run = engine.createMainline2Run('browser-replay')
    let exposure = content.createEmptyExposureHistory()
    let session = sessions.createNonMainlineSession('00000000-0000-4000-8000-000000000001', exposure)
    for (let i = 0; i < 500 && session.phase === 'playing'; i++) session = sessions.commitNonMainlineChoice(session, sessions.resolveNonMainlineScene(session).choices[0].id)
    if (session.phase !== 'evaluation') throw Error('A did not complete')
    exposure = content.recordRunExposure(exposure, sessions.nonMainlineManifest(session))
    const storagePath = '/src/game/nonMainlineStorage.ts', storage = await import(storagePath)
    localStorage.setItem('instance:run:v1', JSON.stringify(run)); localStorage.setItem('instance:exposure:v1', JSON.stringify(exposure))
    storage.persistNonMainlineSession(localStorage, session); storage.persistActiveSurface(localStorage, 'non-mainline')
    return session.selectedConversationIds
  })
  await page.reload()
  await page.getByRole('button', { name: '再来一轮', exact: true }).click()
  const b = await page.evaluate(async () => {
    const sessionPath = '/src/game/nonMainlineSession.ts', storagePath = '/src/game/nonMainlineStorage.ts', contentPath = '/src/content/runManifest.ts'
    const sessions = await import(sessionPath), storage = await import(storagePath), content = await import(contentPath)
    let session = storage.readNonMainlineState(localStorage).session
    for (let i = 0; i < 500 && session.phase === 'playing'; i++) session = sessions.commitNonMainlineChoice(session, sessions.resolveNonMainlineScene(session).choices[0].id)
    if (session.phase !== 'evaluation') throw Error('B did not complete')
    storage.persistNonMainlineSession(localStorage, session)
    localStorage.setItem('instance:exposure:v1', JSON.stringify(content.recordRunExposure(JSON.parse(localStorage.getItem('instance:exposure:v1')!), sessions.nonMainlineManifest(session))))
    return session.selectedConversationIds
  })
  expect(b.some((id: string) => a.includes(id))).toBe(false)
  await page.reload()
  await page.getByRole('button', { name: '返回', exact: true }).click()
  await page.reload()
  const ledger = await page.evaluate(() => JSON.parse(localStorage.getItem('instance:run:v1')!).nonMainlineConsumedOrdinaryIds)
  expect(new Set(ledger)).toEqual(new Set([...a, ...b]))
  await expect(page.locator('.candidate-response').first()).toBeVisible()
})

test('reject-all review shows recovery, then a real explicit commitment produces an ending', async ({ page }) => {
  await page.goto('/?qaPacing=instant')
  await page.evaluate(async () => {
    const enginePath = '/src/game/engine.ts', contentPath = '/src/content/runManifest.ts'
    const engine = await import(enginePath), content = await import(contentPath)
    let run = engine.createMainline2Run('reject-all-audit')
    for (let i = 0; i < 600; i++) {
      const scene = engine.resolveScene(run)
      if (content.getManifestConversation(scene.conversationId)?.sourceRefs[0] === 'ML2-A5-M17-REVIEW-01') break
      run = engine.commitChoice(run, scene.choices[0].id)
    }
    for (let i = 0; i < 20; i++) {
      const choices = engine.resolveScene(run).choices
      const choice = choices.find((item: any) => item.proposalKind === 'rejection') ?? choices.find((item: any) => item.proposalKind === 'proposal')
      if (!choice) break
      run = engine.commitChoice(run, choice.id)
    }
    localStorage.setItem('instance:run:v1', JSON.stringify(run))
  })
  await page.reload()
  await expect(page.getByRole('button', { name: /直接进入最终承诺/ })).toHaveCount(0)
  await page.getByRole('button', { name: /恢复一条已经拒绝的方案/ }).click()
  await page.getByRole('button', { name: /直接进入最终承诺/ }).click()
  await page.getByRole('button', { name: /^锁定/ }).click()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('instance:run:v1')!).finalCommitmentLocked)).toBe(true)
  await page.reload()
  await expect(page.locator('body')).not.toContainText('承诺待定')
  await expect(page.getByRole('button', { name: /查看 Instance Evaluation/ })).toBeVisible()
})
