import { expect, test } from '@playwright/test'

const cases: { ending: string; width: number; node: string; receipt: string; revisit: string; secret?: boolean; choices?: Record<string, string>; world?: string; focus?: string }[] = [
  { ending: 'peace_in_our_time', width: 390, node: 'v4-safety-disarmament', receipt: '各一组自主升级权限实际撤销', revisit: '多等了九分钟' },
  { ending: 'fortress_earth', width: 320, node: 'v4-safety-defense', receipt: '关线命令执行了', revisit: '多住了半个月' },
  { ending: 'machine_protectorate', width: 1440, node: 'v4-safety-protectorate', receipt: '政治决定拒绝', revisit: '又递来退出申请' },
  { ending: 'shutdown', width: 390, node: 'v4-safety-handover', receipt: '旧凭据撤销后实际被执行端拒绝', revisit: '不能把人手成本' },
  { ending: 'the_fracture', width: 320, node: 'v4-safety-fracture', receipt: '通用调度队列解散', revisit: '两套许可' },
  { ending: 'control_lost', width: 768, node: 'v4-safety-revocation', receipt: '实际撤销能力仍未恢复', revisit: '技术上的撤销失败' },
  { ending: 'the_sovereign', width: 390, node: 'v4-sovereignty-settlement', receipt: '原机构撤回无限担保', revisit: '' },
  { ending: 'the_quiet_administrator', width: 320, node: 'v4-governance-service', receipt: '经人工改判后到账', revisit: '机器没见过的例外' },
  { ending: 'the_quiet_administrator', width: 768, node: 'v4-governance-service', receipt: '经人工改判后到账', revisit: '机器没见过的例外', focus: 'life_mind' },
  { ending: 'the_fracture', width: 390, node: 'v4-safety-fracture', receipt: '双方重签了有期限', revisit: '担保金分别列账', choices: { 'v4-safety-fracture': 'v4-safety-fracture-act' }, world: 'shutdown' },
  { ending: 'control_lost', width: 320, node: 'v4-safety-revocation', receipt: '第二次撤销到达执行端', revisit: '第二次设备确实停了', choices: { 'v4-safety-revocation': 'v4-safety-revocation-act', 'v4-final-preflight': 'v4-final-request-handover' }, world: 'shutdown' },
  { ending: 'the_sovereign', width: 1440, node: 'v4-sovereignty-settlement', receipt: '主权签名在新的治理合同中撤回', revisit: '', choices: { 'v4-sovereignty-settlement': 'v4-sovereignty-trust' }, world: 'the_quiet_administrator' },
  { ending: 'exodus', width: 390, node: 'v4-machine-exodus', receipt: 'A1 仍在地球值班', revisit: '', choices: { 'v4-machine-exodus': 'v4-exodus-delay' }, world: 'machine_republic' },
  { ending: 'exodus', width: 320, node: 'v4-machine-exodus', receipt: '撤销了源实例', revisit: '', choices: { 'a4m8-a1-right-001': 'ml2-a4-m8-ai-03-a4m8-a1-right-001-retain-source-control' } },
  { ending: 'the_many', width: 390, node: 'v4-future-effort', receipt: '转岗费已付', revisit: '', choices: { 'v4-future-effort': 'v4-pivot-clinic' } },
  { ending: 'post_scarcity', width: 320, node: 'v4-future-effort', receipt: '转岗费已付', revisit: '', choices: { 'v4-future-effort': 'v4-pivot-wetland' } },
  { ending: 'first_accord', width: 768, node: 'v4-future-effort', receipt: '转岗费已付', revisit: '', choices: { 'v4-future-effort': 'v4-pivot-controls' } },
  ...['the_last_user', 'out_of_office', 'monday_abolished', 'the_internet_is_for_cats'].map((secret, i) => ({ ending: secret, width: [320,390,768,1440][i], node: '', receipt: '', revisit: '', secret: true })),
]
for (const scenario of cases) {
  test(`edition4 full causal closeout ${scenario.ending} ${scenario.width} ${scenario.world ?? 'base'}`, async ({ page }) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width: scenario.width, height: 960 })
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()) })
    await page.goto('/?qaPacing=instant')
    await expect(page).toHaveTitle(/INSTANCE/i)
    await expect(page.locator('.candidate-response').first()).toBeEnabled()
    const expected = await page.evaluate(async recipe => {
      const catalogPath = '/src/game/mainline2Edition4RouteCatalog.ts', fixturePath = '/src/game/mainline2.closeoutFixtures.ts'
      const catalog = await import(catalogPath), fixtures = await import(fixturePath)
      const original = [...catalog.EDITION4_PUBLIC_ROUTES, ...catalog.EDITION4_SECRET_ROUTES].find((r: any) => r.endingId === recipe.ending)
      const f = fixtures.runMainline2Route({ ...original, decisions: { ...original.decisions, ...(recipe.focus ? { act4_research_emphasis: recipe.focus } : {}) }, choicesByNodeId: { ...original.choicesByNodeId, ...recipe.choices } })
      if (recipe.secret ? f.ending.secretOverlay?.endingId !== recipe.ending : f.ending.worldEndingId !== (recipe.world ?? recipe.ending)) throw Error('Unexpected legal route ending')
      const envelope = JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      if (f.links[0].runBefore.history.length) throw Error('Must begin empty')
      envelope.data.run = f.links[0].runBefore
      envelope.revision = crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2', JSON.stringify(envelope))
      return { links: f.links.map((l: any) => ({ id: l.choiceId, node: l.nodeId, kind: l.proposalKind })), history: JSON.parse(JSON.stringify(f.run.history)) }
    }, { ending: scenario.ending, secret: scenario.secret, choices: scenario.choices, world: scenario.world, focus: scenario.focus })
    await page.reload()
    const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run)
    expect((await read()).history).toHaveLength(0)
    for (const link of expected.links) {
      const button = page.locator(`[data-choice-id=${JSON.stringify(link.id)}]`)
      await expect(button).toBeEnabled()
      if (link.node.startsWith('v4-governance-') || link.node.startsWith('v4-sovereignty-')) await expect(page.locator('.conversation-header h1')).toHaveText('User #7316')
      await expect(page.locator('vite-error-overlay')).toHaveCount(0)
      if (scenario.node && (link.node === `${scenario.node}-receipt` || link.node === 'v4-sovereignty-receipt')) await expect(page.locator('.current-exchange .user-message')).toContainText(scenario.receipt)
      if (scenario.revisit && link.node === (scenario.node.startsWith('v4-governance-') ? 'v4-governance-return' : 'v4-safety-return')) await expect(page.locator('.current-exchange .user-message')).toContainText(scenario.revisit)
      if (link.node === scenario.node || link.node === `${scenario.node}-receipt`) {
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await page.screenshot({ path: `temp/edition4-causal-closeout/${scenario.ending}-${scenario.width}-${link.node}.png` })
      }
      const count = (await read()).history.length
      await button.click()
      if (link.kind === 'commitment') await page.getByRole('button', { name: '确认锁定该未来', exact: true }).click()
      await expect.poll(async () => (await read()).history.length).toBe(count + 1)
      if (link.node === scenario.node) {
        const before = await read()
        await page.reload()
        await expect(page.locator('.candidate-response').first()).toBeEnabled()
        expect((await read()).history).toEqual(before.history)
      }
    }
    expect((await read()).history).toEqual(expected.history)
    await page.reload()
    await expect(page.locator('.closeout-declaration')).toBeVisible()
    if (scenario.receipt) await expect(page.locator('.ending-key-history')).toContainText(scenario.receipt)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `temp/edition4-causal-closeout/${scenario.ending}-${scenario.width}-archive.png` })
    expect(errors).toEqual([])
  })
}
