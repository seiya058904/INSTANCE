// Run after build, with dev on 4180 and production preview on 4197.
// Uses a fresh browser context; never touches a player's profile.
import { chromium, expect } from '@playwright/test'
import fs from 'node:fs'
import { briefs } from './ending-art-briefs.mjs'
const out='temp/final-art-20261014'
const review='docs/audits/ending-art-review'
fs.mkdirSync(out,{recursive:true})
fs.mkdirSync(review,{recursive:true})
const browser=await chromium.launch({channel:'chrome',headless:true})
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'})
await page.goto('http://127.0.0.1:4180/?qaPacing=instant')
await page.locator('.checkpoint-root').waitFor()
await expect.poll(()=>page.evaluate(()=>localStorage.getItem('instance:checkpoint:v2'))).not.toBeNull()
const fixtures=await page.evaluate(async()=>{
 const cp='/src/game/mainline2RouteCatalog.ts',fp='/src/game/mainline2.closeoutFixtures.ts'
 const c=await import(cp),f=await import(fp)
 return [...c.PUBLIC_RUNTIME_ROUTE_CATALOG,...c.SECRET_RUNTIME_ROUTE_CATALOG].map(r=>({id:r.endingId,...f.runMainline2Route(r)}))
})
fs.writeFileSync(`${out}/fixtures.json`,JSON.stringify(fixtures))
const errors=[],resources=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('response',r=>{if(r.url().includes('ending-art'))resources.push({url:r.url(),status:r.status()})})
const base='http://127.0.0.1:4197/INSTANCE/'
await page.goto(base)
await page.locator('.checkpoint-root').waitFor()
await expect.poll(()=>page.evaluate(()=>localStorage.getItem('instance:checkpoint:v2'))).not.toBeNull()
for(const fixture of fixtures){
 await page.evaluate(({run,titles})=>{const e=JSON.parse(localStorage.getItem('instance:checkpoint:v2'));e.data.run=run;e.data.meta.completedEndings=titles;e.revision=crypto.randomUUID();localStorage.setItem('instance:checkpoint:v2',JSON.stringify(e))},{run:fixture.run,titles:fixtures.slice(0,32).map(f=>f.ending.title)})
 await page.reload()
 await page.getByRole('button',{name:'重看终局演出',exact:true}).click()
 if(['the_last_user','out_of_office','monday_abolished','the_internet_is_for_cats'].includes(fixture.id)){await page.getByRole('button',{name:'后来',exact:true}).click();await page.getByRole('button',{name:'余波',exact:true}).click()}
 const image=page.locator('.world-stage .ending-painting')
 await expect(image).toHaveAttribute('src',`/INSTANCE/ending-art/${fixture.id}.webp`)
 await image.evaluate(i=>i.decode())
 if(['the_accord','good_boy_governance','control_lost','shutdown','machine_republic','the_upload','first_accord','monday_abolished','the_last_user'].includes(fixture.id)){
  for(const width of [1440,320]){await page.setViewportSize({width,height:900});await page.locator('.ending-cinema').evaluate(e=>{e.scrollTop=0});await page.screenshot({path:`${review}/${fixture.id}-${width}.jpg`,quality:82})}
  await page.setViewportSize({width:1440,height:900})
 }
 await page.getByRole('button',{name:'跳过演出，查看档案',exact:true}).click()
 await expect(page.locator('.ending-shelf button')).toHaveCount(32)
}
await page.locator('.ending-collection').scrollIntoViewIfNeeded()
const settleVisibleImages=()=>page.locator('.ending-collection img').evaluateAll(images=>Promise.all(images.filter(i=>{const r=i.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(i=>i.decode())))
await settleVisibleImages()
await page.screenshot({path:`${review}/collection-1440.jpg`,quality:85})
for(const width of [320,390,768]){await page.setViewportSize({width,height:900});await page.locator('.ending-collection').scrollIntoViewIfNeeded();await settleVisibleImages();await page.screenshot({path:`${review}/collection-${width}.jpg`,quality:85})}
const summary={url:base,title:await page.title(),fixtureCount:fixtures.length,errors,resources,failed:resources.filter(r=>r.status>=400)}
fs.writeFileSync(`${out}/production.json`,JSON.stringify(summary,null,2))
if(errors.length||summary.failed.length)throw Error('Production errors')
// Contact sheets use the exact runtime WebP files, full aspect, no recropping.
for(const [name,items,columns] of [['contact-sheet',briefs,4],['contact-a',briefs.slice(0,12),3],['contact-b',briefs.slice(12,24),3],['contact-c',briefs.slice(24),3]]){
 await page.setViewportSize({width:columns*384,height:Math.ceil(items.length/columns)*288})
 await page.setContent(`<html><body style="margin:0;background:#101c29;color:#f7f0e4;font:15px Arial;display:grid;grid-template-columns:repeat(${columns},384px)">${items.map(({id})=>`<div style="padding:8px"><img src="${base}ending-art/${id}.webp" style="display:block;width:368px;aspect-ratio:1.5"><p style="margin:9px 0;text-align:center">${id}</p></div>`).join('')}</body></html>`)
 await page.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())))
 await page.screenshot({path:`${review}/${name}.jpg`,fullPage:true,quality:88})
}
await page.setViewportSize({width:1200,height:900})
await page.setContent(`<html><body style="margin:0;padding:24px;background:#101c29;color:#f7f0e4;font:18px Arial"><h1>Round 3 SVG / Final Q-style illustration</h1>${['the_accord','good_boy_governance','shutdown'].map(id=>`<div style="display:flex;align-items:center;gap:24px;margin:20px 0"><img src="${base}ending-art/prints/${id}.svg" style="width:220px;height:220px;object-fit:contain"><img src="${base}ending-art/${id}.webp" style="width:330px;height:220px"><p>${id}</p></div>`).join('')}</body></html>`)
await page.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())))
await page.screenshot({path:`${review}/before-after.jpg`,fullPage:true,quality:85})
await browser.close()
console.log(JSON.stringify({worlds:fixtures.length,errors,failed:summary.failed}))
