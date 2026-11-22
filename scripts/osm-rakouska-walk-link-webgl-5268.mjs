// 5.268: opt-in original OSM walking audit in actual mobile WebGL.
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
 await page.goto('http://127.0.0.1:8080/?v=526800&streetAudit=rakouska-walk-link-5268',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceRakouskaWalkRuntime5268?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='rakouska-walk-link-5268',
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const q=await page.evaluate(()=>({
  a:window.__miloviceRakouskaWalkRuntime5268?.(),
  build:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent,
  webgl:Boolean(window.__miloviceWebGL||document.querySelector('canvas')),
  draw:window.__miloviceStreetGeometryAudit,
  area:window.__miloviceAreasLoaded
 }));
 assert(q.a&&q.a.ready,JSON.stringify(q));
 assert.equal(q.a.version,'5.268');
 assert.equal(q.a.drawMeshes,3);
 assert.equal(q.a.visibleAfterLOD,3);
 assert.equal(q.a.technicalOnly,true);
 assert.deepEqual(q.a.crossingIds,['1484073944','1484073946']);
 assert(q.a.sideRoadMetres>73&&q.a.sideRoadMetres<73.2);
 assert(q.a.originalGPSUnchanged&&q.a.unmarkedCrossingsPreserved);
 assert.equal(q.a.newFootways,0);assert.equal(q.a.newKerbs,0);
 assert.equal(q.a.newZebras,0);assert.equal(q.a.newColliders,0);
 assert(q.build?.startsWith('20261122-'));
 assert.equal(q.build,q.hud);
 assert.equal(q.hud,q.build);
 assert(q.webgl);
 assert.equal(errors.length,0,errors.join('\n'));
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/rakouska-walk-link-5268-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/rakouska-walk-link-5268-wide.png'});
 console.log('PASS 5.268 source OSM walking inspector with 3 guide batches in real mobile+wide Chromium after 7.2s LOD');
}finally{await browser.close()}
