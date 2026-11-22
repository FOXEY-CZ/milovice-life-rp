import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto(
 'http://127.0.0.1:8080/?v=526300&streetAudit=rakouska-photo-upper-5263',
 {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceRakouskaUpperRuntime5263?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='rakouska-photo-upper-5263',
  null,{timeout:120000});
 await page.waitForTimeout(6700);
 const r=await page.evaluate(()=>({
  upper:window.__miloviceRakouskaUpperRuntime5263?.(),
  old:window.__miloviceItalskaVojenskeZatisiRuntime5249?.(),
  view:window.__miloviceStreetAuditRendered?.view,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 assert.equal(r.upper?.ready,true,JSON.stringify(r));
 assert.equal(r.upper.sourceOsmId,'53865882');
 assert.deepEqual(r.upper.originalVertices,[0,1,2,3,4,5,6,7,8]);
 assert.equal(r.upper.drawMeshes,2);
 assert.equal(r.upper.wallTriangles,18);
 assert.equal(r.upper.roofTriangles,7);
 assert.equal(r.upper.visibleAfterLOD,2);
 assert(r.upper.newRoofLevel>r.upper.oldRoofLevel+2);
 assert.equal(r.upper.newWindows,0);
 assert.equal(r.upper.newBuildings,0);
 assert.equal(r.upper.newColliders,0);
 assert.equal(r.old?.ready,true);
 assert.equal(r.view,'rakouska-photo-upper-5263');
 assert.equal(r.hud,r.meta);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/rakouska-photo-upper-5263-mobile.png'});
 console.log('PASS 5.263 real mobile Chromium/SwiftShader upper volume, original building, >6s LOD');
}finally{await browser.close()}
