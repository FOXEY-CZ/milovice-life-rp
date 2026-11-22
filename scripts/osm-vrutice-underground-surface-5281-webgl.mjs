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
 await page.goto('http://127.0.0.1:8080/?v=528100&streetAudit=vrutice-underground-path-5281',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceUndergroundSurfaceRuntime5281?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='vrutice-underground-path-5281',
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const r=await page.evaluate(()=>({
  audit:window.__miloviceUndergroundSurfaceRuntime5281?.(),
  build:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent,
  view:window.__miloviceStreetAuditRendered?.view
 }));
 assert.equal(r.audit.ready,true,JSON.stringify(r));
 assert.equal(r.audit.sourceWayIds.length,5);
 assert.equal(r.audit.suppressedSurfaceEdges,11);
 assert(r.audit.sourceMetres>134&&r.audit.sourceMetres<138);
 assert(r.audit.mappedSurfaceGeometrySuppressed5281);
 assert.equal(r.audit.newUndergroundMeshes,0);
 assert.equal(r.audit.newColliders,0);
 assert.equal(r.audit.originalOSMWaysUntouched,true);
 assert.equal(r.build,'20261122-armadni-houses-528200');
 assert.equal(r.build,r.hud);
 assert.equal(r.view,'vrutice-underground-path-5281');
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/vrutice-underground-5281-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/vrutice-underground-5281-wide.png'});
 console.log('PASS 5.281 underground OSM paths not painted on DEM, Vrutice mobile+wide WebGL after LOD');
}finally{await browser.close()}
