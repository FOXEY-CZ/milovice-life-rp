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
  isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto(
  'http://127.0.0.1:8080/?v=526500&streetAudit=rakouska-glazed-entry-5265',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceRakouskaGlazedEntryRuntime5265?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='rakouska-glazed-entry-5265',
  null,{timeout:120000});
 await page.waitForTimeout(6900);
 const actual=await page.evaluate(()=>({
  entry:window.__miloviceRakouskaGlazedEntryRuntime5265?.(),
  upper:window.__miloviceRakouskaUpperRuntime5263?.(),
  windows:window.__miloviceRakouskaUpperWindowsRuntime5264?.(),
  view:window.__miloviceStreetAuditRendered?.view,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 const x=actual.entry;
 assert.equal(x?.ready,true,JSON.stringify(actual));
 assert.equal(x.sourceOsmId,'53865882');
 assert.equal(x.sourceHash,'7aec42bc');
 assert.equal(x.originalWallEdge,2);
 assert.equal(x.drawMeshes,5);assert.equal(x.visibleAfterLOD,5);
 assert.equal(x.frontGlazingBays,6);assert.equal(x.sideGlazingBays,6);
 assert.equal(x.glassTriangles,24);assert.equal(x.canopyTriangles,12);
 assert.equal(x.photoBackedCanopy,true);assert.equal(x.balconyRailPresent,true);
 assert.equal(x.geometryFinite,true);assert.equal(x.newOsmBuildings,0);
 assert.equal(x.newColliders,0);assert.equal(x.newDoors,0);
 assert.equal(x.newInteractableEntrances,0);
 assert(actual.upper?.ready);assert.equal(actual.upper.visibleAfterLOD,2);
 assert(actual.windows?.ready);assert.equal(actual.windows.visibleAfterLOD,4);
 assert.equal(actual.view,'rakouska-glazed-entry-5265');
 assert.equal(actual.meta,actual.hud);assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/rakouska-glazed-entry-5265-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/rakouska-glazed-entry-5265-wide.png'});
 console.log('PASS 5.265 mobile and wide Chromium/SwiftShader pavilion after 6.9s LOD');
}finally{await browser.close();}
