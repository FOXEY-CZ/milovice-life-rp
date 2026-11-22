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
 const page=await browser.newPage({
  viewport:{width:393,height:852},deviceScaleFactor:1,
  isMobile:true,hasTouch:true
 });
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto(
  'http://127.0.0.1:8080/?v=526600&streetAudit=rakouska-fenced-frontage-5266',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceRakouskaFrontageRuntime5266?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='rakouska-fenced-frontage-5266',
  null,{timeout:120000});
 await page.waitForTimeout(7000);
 const data=await page.evaluate(()=>({
  fence:window.__miloviceRakouskaFrontageRuntime5266?.(),
  vestibule:window.__miloviceRakouskaGlazedEntryRuntime5265?.(),
  upper:window.__miloviceRakouskaUpperRuntime5263?.(),
  view:window.__miloviceStreetAuditRendered?.view,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 const f=data.fence;
 assert.equal(f?.ready,true,JSON.stringify(data));
 assert.equal(f.buildingId,'53865882');
 assert.equal(f.sourceRoadId,'8590288');
 assert.equal(f.drawMeshes,3);
 assert.equal(f.visibleAfterLOD,3);
 assert.equal(f.weedClusters,86);
 assert.equal(f.bushClusters,10);
 assert(f.fencePickets>150);
 assert(f.fenceLengthMetres>37.7&&f.fenceLengthMetres<37.9);
 assert(f.minRoadCentrelineGapMetres>=4.79);
 assert(f.minBuildingGapMetres>1.5);
 assert(f.minCanopyGapMetres>1.2);
 assert.equal(f.geometryFinite,true);
 assert.equal(f.newMappedBarriers,0);
 assert.equal(f.newTrees,0);
 assert.equal(f.newGates,0);
 assert.equal(f.newColliders,0);
 assert.equal(f.newRoads,0);
 assert(data.vestibule?.ready);
 assert.equal(data.vestibule.visibleAfterLOD,5);
 assert(data.upper?.ready);
 assert.equal(data.view,'rakouska-fenced-frontage-5266');
 assert.equal(data.meta,data.hud);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/rakouska-fenced-frontage-5266-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/rakouska-fenced-frontage-5266-wide.png'});
 console.log('PASS 5.266 real mobile+wide Chromium/SwiftShader modeled fence+weeds, all 3 meshes after 7s LOD');
}finally{await browser.close()}
