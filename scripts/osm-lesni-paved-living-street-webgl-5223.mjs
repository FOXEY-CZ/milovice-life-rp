// Milovice RP 5.223 actual mobile Chromium/SwiftShader source road proof.
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
 await page.goto('http://127.0.0.1:8080/?v=522300&streetAudit=lesni-paved-living-street-5223',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='lesni-paved-living-street-5223'&&
   window.__miloviceLesniPavedStreetRuntime5223?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.223 source-mapped Lesní living street not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    paving:window.__miloviceLesniPavedStreetRuntime5223?.(),
    error:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const v=await page.evaluate(()=>window.__miloviceLesniPavedStreetRuntime5223());
 assert(v.ready,'road source material must remain active after 6.5s and LOD');
 assert.equal(v.version,'5.223');
 assert.equal(v.sourceOSMId,'83026442');
 assert.equal(v.sourceHash,'9cc757ea');
 assert.equal(v.sourceRoadType,'living_street');
 assert.equal(v.sourceName,'Lesní');
 assert.equal(v.accessRule,'destination');
 assert.equal(v.surfaceTag,'paving_stones');
 assert.equal(v.sourceSegments,9);
 assert.equal(v.renderedOriginalSegments,9);
 assert(Math.abs(v.originalMeters-293.563)<.15);
 assert.equal(v.sharedMaterial,'visnova-tagged-paving-stones');
 assert.equal(v.materialAvailable,true);
 assert.equal(v.mapMaterialRegistered,true);
 assert.equal(v.modelTintPhotoVerified,false);
 assert.equal(v.originalRoadGeometryUnchanged,true);
 assert.equal(v.originalRoadWidthUnchanged,true);
 assert.equal(v.originalTrafficAccessUnchanged,true);
 for(const k of ['newRoads','newFootways','newBuildings',
  'newColliders','newKerbs','newParking','newTrafficSigns'])
  assert.equal(v[k],0,k);
 assert.deepEqual(errors,[],'no browser JavaScript errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/lesni-paved-living-street-5223-mobile.png'});
 console.log('PASS 5.223 actual mobile WebGL original 293.563m of',
  v.sourceSegments,'Lesní paved living-street OSM segments;',
  'all segments rendered with existing shared paving material');
}finally{await browser.close()}
