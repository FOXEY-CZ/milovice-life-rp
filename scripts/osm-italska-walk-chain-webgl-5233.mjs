// 5.233 actual mobile Chromium/SwiftShader draw+LOD of real Italská walk.
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
  viewport:{width:393,height:852},deviceScaleFactor:1,isMobile:true,hasTouch:true
 });
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=523300&streetAudit=italska-walk-chain-5233',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='italska-walk-chain-5233'&&
   window.__miloviceItalskaWalkChainRuntime5233?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.233 original Italská network not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    mapped:window.__miloviceItalskaWalkChainRuntime5233?.(),
    err:document.getElementById('err')?.textContent
   })))+' JS errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const a=await page.evaluate(()=>window.__miloviceItalskaWalkChainRuntime5233());
 assert(a?.ready,'real 3D draw+6.5s LOD '+JSON.stringify(a));
 assert.equal(a.sourceSegments,14);
 assert.equal(a.processedSourceEdges,14);
 assert.equal(a.originalGPSJoins,4);
 assert.equal(a.originalRoadGPSJoins,2);
 assert(a.totalOriginalMetres>534.3&&a.totalOriginalMetres<534.5);
 assert.equal(a.encounteredSourceIds.length,5);
 assert.equal(a.visibleNeutralStrips,true);
 assert.equal(a.visiblePavedStrips,true);
 assert.equal(a.originalGPSUnchanged,true);
 assert.equal(a.noInventedCrossingPaint,true);
 assert.deepEqual(a.unmarkedCrossingIds,['1484073944','1484073946']);
 assert.equal(a.sourceSurfaces['1484073946'],'asphalt');
 assert.equal(a.sourceSurfaces['1484073944'],null);
 assert.equal(a.renderedSafePieces>0,true);
 for(const k of ['newFootways','newRoads','newZebras','newCrossings',
  'newColliders','newBuildings','newKerbs','newParking'])
  assert.equal(a[k],0,k);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-walk-chain-5233-mobile.png'});
 console.log('PASS 5.233 real mobile WebGL connected 534m GPS source with safe painted sidewalk pieces and two UNMARKED crossings');
}finally{await browser.close()}
