import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader']
});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=526700&streetAudit=rakouska-cross-frontage-5267',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceRakouskaCrossRuntime5267?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='rakouska-cross-frontage-5267',
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const r=await page.evaluate(()=>({
  cross:window.__miloviceRakouskaCrossRuntime5267?.(),
  old:window.__miloviceRakouskaFrontageRuntime5266?.(),
  entry:window.__miloviceRakouskaGlazedEntryRuntime5265?.(),
  view:window.__miloviceStreetAuditRendered?.view,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 assert.equal(r.cross?.ready,true,JSON.stringify(r));
 assert.equal(r.cross.drawMeshes,1);assert.equal(r.cross.visibleAfterLOD,1);
 assert(r.cross.lengthMetres>13.65&&r.cross.lengthMetres<13.85);
 assert(r.cross.minMainRoadGap>=4.7&&r.cross.minSideRoadGap>=6.5);
 assert(r.cross.minCanopyGap>=3.2);assert.equal(r.cross.geometryFinite,true);
 assert.equal(r.old?.ready,true);assert.equal(r.old.visibleAfterLOD,3);
 assert.equal(r.entry?.ready,true);assert.equal(r.entry.visibleAfterLOD,5);
 assert.equal(r.view,'rakouska-cross-frontage-5267');
 assert.equal(r.meta,r.hud);assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/rakouska-cross-frontage-5267-mobile.png'});
 await page.setViewportSize({width:1280,height:720});await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/rakouska-cross-frontage-5267-wide.png'});
 console.log('PASS 5.267 real mobile+wide Chromium SwiftShader after 7.2s LOD');
}finally{await browser.close()}
