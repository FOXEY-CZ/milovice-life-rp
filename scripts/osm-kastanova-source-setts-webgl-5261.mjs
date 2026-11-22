// 5.261 — actual mobile 3D road material on two exact Kaštanová OSM ways.
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
  'http://127.0.0.1:8080/?v=526200&streetAudit=kastanova-setts-5261',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceKastanovaSettRuntime5261?.()?.ready===true&&
   window.__miloviceStreetAuditRendered?.view==='kastanova-setts-5261',
   null,{timeout:120000});
 }catch(e){
  const diagnostics=await page.evaluate(()=>({
   setts:window.__miloviceKastanovaSettRuntime5261?.(),
   view:window.__miloviceStreetAuditRendered?.view,
   areas:window.__miloviceAreasLoaded,
   status:document.getElementById('status')?.textContent
  }));
  throw new Error('Kaštanová 5.261 did not load actual source road: '+
   JSON.stringify({diagnostics,errors,original:String(e)}));
 }
 // Leave >6s of visible mobile LOD; not only a unit-test material object.
 await page.waitForTimeout(6800);
 const result=await page.evaluate(()=>({
  roads:window.__miloviceKastanovaSettRuntime5261?.(),
  surface:window.__miloviceOSMSurfaceAudit,
  view:window.__miloviceStreetAuditRendered,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent,
  region:window.__miloviceAreasLoaded
 }));
 const r=result.roads;
 assert.equal(r?.ready,true,JSON.stringify(result));
 assert.deepEqual(r.sourceOSMIds,['8878402','1107814416']);
 assert.deepEqual([...r.encounteredWayIds].sort(),[...r.sourceOSMIds].sort());
 assert.equal(r.renderedRoadSegments,13);
 assert(Math.abs(r.sourceRoadMetres-478.586)<.001);
 assert(r.materialMeshCount>=1,'Real DEM/road batch must use sett material');
 assert.equal(r.textureReady,true);
 assert(r.worldAlignedUVSamples>=39);
 assert(r.maxWorldAlignedUVError<.0002);
 assert.equal(result.surface.byMaterial['kastanova-source-setts-5261'],2);
 assert.equal(r.modelStoneSizeEstimated,true);
 assert.equal(r.modelTintEstimated,true);
 assert.equal(r.addedRoads,0);
 assert.equal(r.addedSidewalks,0);
 assert.equal(r.originalRoadWidthsUntouched,true);
 assert.equal(r.normalTrafficUnchanged,true);
 assert.equal(result.view?.view,'kastanova-setts-5261');
 assert.equal(result.view?.technicalStreetLevel,true);
 assert.equal(result.meta,result.hud);
 assert.deepEqual(errors,[],'No JS errors in mobile WebGL runtime');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/kastanova-setts-5261-mobile.png'});
 console.log('PASS 5.261 mobile real OSM Kaštanová: 478.586m tagged setts, '+
  r.renderedRoadSegments+' original road segments; '+r.materialMeshCount+
  ' actual road material meshes after 6.8s LOD; UV max error='+
  r.maxWorldAlignedUVError+'. No invented untagged Rakouská material.');
}finally{
 await browser.close();
}
