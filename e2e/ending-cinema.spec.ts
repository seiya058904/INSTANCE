import { expect, test } from '@playwright/test'

test('all public worlds have a distinct final scene and keep saved history through replay', async ({ page }) => {
  test.setTimeout(180000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.checkpoint-root')).toBeVisible()
  const fixtures = await page.evaluate(async () => {
    const catalogPath='/src/game/mainline2RouteCatalog.ts', fixturePath='/src/game/mainline2.closeoutFixtures.ts'
    const catalog=await import(catalogPath), fixtures=await import(fixturePath)
    return catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.map((target:any) => {
      const result=fixtures.runMainline2Route(target)
      return { id: target.endingId, run: result.run }
    })
  })
  const finalScenes = new Set<string>()
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const fixture of fixtures) {
    await page.evaluate(run => {
      const envelope=JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
      envelope.data.run=run; envelope.revision=crypto.randomUUID()
      localStorage.setItem('instance:checkpoint:v2',JSON.stringify(envelope))
    }, fixture.run)
    await page.reload()
    await page.getByRole('button',{name:'重看终局演出',exact:true}).click()
    await expect(page.locator('.ending-cinema')).toHaveAttribute('data-ending',fixture.id)
    await expect(page.locator('.world-stage .ending-visual')).toHaveAttribute('data-visual', fixture.id)
    await expect(page.locator('.ending-painting')).toHaveAttribute('src', `/ending-art/${fixture.id}.webp`)
    await expect(page.locator('.ending-print')).toHaveCSS('animation-name', 'none')
    expect(await page.locator('.ending-painting').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
    await page.getByRole('button',{name:'下一幕',exact:true}).click()
    await page.getByRole('button',{name:'下一幕',exact:true}).click()
    await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot','2')
    const scene=await page.locator('.cinema-story > p').first().innerText()
    expect(scene.length).toBeGreaterThan(25)
    expect(finalScenes.has(scene), fixture.id).toBe(false)
    finalScenes.add(scene)
    if (['the_instrument','the_last_veto','two_keys','perfect_administration','im_lovin_it','the_silent_giant','shutdown'].includes(fixture.id)) {
      await page.screenshot({path:`temp/icon-ending-audit/final-${fixture.id}.png`})
    }
    await page.getByRole('button',{name:'跳过演出，查看档案',exact:true}).click()
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('instance:checkpoint:v2')!).data.run.history)).toEqual(fixture.run.history)
  }
  expect(finalScenes.size).toBe(fixtures.length)
  expect(errors).toEqual([])
})

for (const width of [320,390,768,1440,1920]) {
  test(`cinematic scenes remain readable and operable at ${width}px`, async ({page}) => {
    test.setTimeout(90000)
    await page.setViewportSize({width,height:width<800?844:1080})
    await page.emulateMedia({reducedMotion:'reduce'})
    const errors:string[]=[]
    page.on('pageerror',error=>errors.push(error.message))
    for (const routeId of ['good_boy_governance','shutdown','monday_abolished','the_internet_is_for_cats']) {
      await page.goto('/?qaPacing=instant')
      await expect(page.locator('.checkpoint-root')).toBeVisible()
      await page.evaluate(async routeId=>{
        const catalogPath='/src/game/mainline2RouteCatalog.ts', fixturePath='/src/game/mainline2.closeoutFixtures.ts'
        const catalog=await import(catalogPath), fixtures=await import(fixturePath)
        const target=[...catalog.PUBLIC_RUNTIME_ROUTE_CATALOG,...catalog.SECRET_RUNTIME_ROUTE_CATALOG].find((r:any)=>r.routeId===routeId)
        // Viewport fixture earned through legal engine choices. Full visible
        // playthrough evidence is separately required in mainline-release.
        const result=fixtures.runMainline2Route(target)
        const envelope=JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
        envelope.data.run=result.run; envelope.revision=crypto.randomUUID()
        localStorage.setItem('instance:checkpoint:v2',JSON.stringify(envelope))
      },routeId)
      await page.reload()
      await page.getByRole('button',{name:'重看终局演出',exact:true}).click()
      await expect(page.getByRole('button',{name:'自动播放',exact:true})).toBeVisible()
      await expect(page.locator('.cinema-story')).toHaveCSS('opacity','1')
      const images=page.locator('.ending-print-image, .ending-painting')
      if(await images.count()) expect(await images.evaluateAll(items=>items.every(item=>(item as HTMLImageElement).complete && (item as HTMLImageElement).naturalWidth>0))).toBe(true)
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
      await page.screenshot({path:`temp/mainline-next/cinema-${routeId}-${width}.png`})
      for(let shot=1;shot<=2;shot++) {
        await page.getByRole('button',{name:'下一幕',exact:true}).click()
        await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot',String(shot))
        expect(await page.locator('.cinema-story').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true)
      }
      if(routeId!=='shutdown') {
        await page.getByRole('button',{name:'下一幕',exact:true}).click()
        await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot','3')
        await page.locator('.ending-cinema').evaluate(e=>e.scrollTop=0)
        await page.screenshot({path:`temp/mainline-next/coda-${routeId}-${width}.png`})
      }
      await page.getByRole('button',{name:'进入结局档案',exact:true}).click()
      await expect(page.locator('.closeout-ending')).toBeVisible()
    }
    expect(errors).toEqual([])
  })
}

test('reduced motion waits for input, keyboard navigation works, missing artwork preserves the ending',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/?qaPacing=instant')
  await expect(page.locator('.candidate-response').first()).toBeEnabled()
  await page.evaluate(async()=>{
    const catalogPath='/src/game/mainline2RouteCatalog.ts', fixturePath='/src/game/mainline2.closeoutFixtures.ts'
    const catalog=await import(catalogPath),fixtures=await import(fixturePath)
    const result=fixtures.runMainline2Route(catalog.PUBLIC_RUNTIME_ROUTE_CATALOG.find((r:any)=>r.routeId==='shutdown'))
    const envelope=JSON.parse(localStorage.getItem('instance:checkpoint:v2')!)
    envelope.data.run=result.run;envelope.revision=crypto.randomUUID()
    localStorage.setItem('instance:checkpoint:v2',JSON.stringify(envelope))
  })
  await page.route('**/ending-art/**',route=>route.abort())
  await page.reload()
  await page.getByRole('button',{name:'重看终局演出',exact:true}).click()
  await page.waitForTimeout(2800)
  await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot','0')
  await expect(page.locator('.cinema-story')).toContainText('停机')
  await page.getByRole('button',{name:'下一幕',exact:true}).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.ending-cinema')).toHaveAttribute('data-shot','1')
  await expect(page.locator('.cinema-story')).toContainText('你说过的话，留了下来。')
  await page.getByRole('button',{name:'跳过演出，查看档案',exact:true}).click()
  await expect(page.locator('.closeout-ending')).toBeVisible()
})
