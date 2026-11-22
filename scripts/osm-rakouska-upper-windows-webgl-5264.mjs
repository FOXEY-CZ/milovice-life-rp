// Real mobile WebGL test after full streamed Mladá + >6.7s LOD.
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
  viewport:{width:393,height:852},isMobile:true,hasTouch:true,deviceScaleFactor:1
 });
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto(
  'http://127.0.0.1:8080/?v=526400&streetAudit=rakouska-upper-windows-5264',
  {waitUntil:'domcontentloaded',timeout:35000}
 );
 await page.waitForFunction(()=>
  window.__miloviceRakouskaUpperWindowsRuntime5264?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='rakouska-upper-windows-5264',
  null,{timeout:120000});
 await page.waitForTimeout(6800);
 const result=await page.evaluate(()=>({
  upper:window.__miloviceRakouskaUpperRuntime5263?.(),
  windows:window.__miloviceRakouskaUpperWindowsRuntime5264?.(),
  red:window.__miloviceItalskaPhotoRedPlinthRuntime5262?.(),
  view:window.__miloviceStreetAuditRendered?.view,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 const x=result.windows;
 assert.equal(x?.ready,true,JSON.stringify(result));
 assert.equal(x.sourceOsmId,'53865882');
 assert.equal(x.sourceHash,'7aec42bc');
 assert.equal(x.photoWindowVisualCount,6);
 assert.deepEqual(x.originalUpperSourceEdges,[0,2,7]);
 assert.equal(x.renderDrawCalls,4);
 assert.equal(x.visibleAfterLOD,4);
 assert.equal(x.paneTriangles,12);
 assert.equal(x.frameTriangles,60);
 assert.equal(x.weatherPatches,8);
 assert.equal(x.plasterTriangles,22);
 assert.equal(x.modelDimensionsNotMeasured,true);
 assert.equal(x.newPhysicalOpenings,0);
 assert.equal(x.newBuildings,0);
 assert.equal(x.newEntrances,0);
 assert.equal(x.newColliders,0);
 assert.equal(result.upper?.ready,true);
 assert.equal(result.upper.visibleAfterLOD,2);
 assert.equal(result.red?.ready,true);
 assert.equal(result.view,'rakouska-upper-windows-5264');
 assert.equal(result.meta,result.hud);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/rakouska-upper-windows-5264-mobile.png'
 });
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(850);
 await page.screenshot({
  path:'browser-artifacts/rakouska-upper-windows-5264-wide.png'
 });
 console.log('PASS 5.264 actual mobile+wide SwiftShader screenshot: 6 source wall window panels, 8 plaster chips, 4 meshes after 6.8s LOD; no new physical holes');
}finally{await browser.close()}
