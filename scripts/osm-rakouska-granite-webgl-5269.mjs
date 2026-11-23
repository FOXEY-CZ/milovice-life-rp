// Milovice RP 5.269 — municipality-backed granite sett rendering in real WebGL.
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
 await page.goto('http://127.0.0.1:8080/?v=526900&streetAudit=rakouska-granite-5269',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceRakouskaGraniteRuntime5269?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='rakouska-granite-5269',
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const q=await page.evaluate(()=>({
  granite:window.__miloviceRakouskaGraniteRuntime5269?.(),
  view:window.__miloviceStreetAuditRendered?.view,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 assert.equal(q.granite?.ready,true,JSON.stringify(q));
 assert.equal(q.granite.renderedGranitePieces,4);
 assert.equal(q.granite.renderedOriginalPieces,4);
 assert.equal(q.granite.originalRoadEdges,4);
 assert.equal(q.granite.totalModelSettMetres,48);
 assert.equal(q.granite.materialMeshCount>0,true);
 assert.equal(q.granite.exactStoneExtentSurveyed,false);
 assert.equal(q.granite.newRoads,0);
 assert.equal(q.granite.newCrossings,0);
 assert.equal(q.granite.newKerbs,0);
 assert.equal(q.granite.newMaterials,0);
 assert.equal(q.granite.newColliders,0);
 assert.equal(q.view,'rakouska-granite-5269');
 assert.match(q.meta||'',/^\d{8}-[a-z0-9-]+$/,'valid YYYYMMDD build identifier');
 assert.equal(q.meta,q.hud);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/rakouska-granite-5269-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/rakouska-granite-5269-wide.png'});
 console.log('PASS 5.269 source-locked 2025 municipal granite at Rakouská x Pod Lesem: 4 surface patches, unchanged drivable road, mobile+wide Chromium after 7.2s LOD');
}finally{await browser.close()}
