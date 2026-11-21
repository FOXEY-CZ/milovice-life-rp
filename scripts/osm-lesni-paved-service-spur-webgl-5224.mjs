// 5.224 real mobile WebGL: paved road spur AND actual mapped connection.
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
 await page.goto('http://127.0.0.1:8080/?v=522400&streetAudit=lesni-service-spur-5224',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='lesni-service-spur-5224'&&
   window.__miloviceLesniServiceSpurRuntime5224?.()?.ready===true,
   null,{timeout:115000});
 }catch(err){
  throw Error('Original connected paved Lesní OSM spur not ready: '+
   JSON.stringify(await page.evaluate(()=>({
    regions:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    spur:window.__miloviceLesniServiceSpurRuntime5224?.(),
    previous:window.__miloviceLesniPavedStreetRuntime5223?.(),
    error:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+err);
 }
 await page.waitForTimeout(6500);
 const v=await page.evaluate(()=>window.__miloviceLesniServiceSpurRuntime5224());
 assert.equal(v.ready,true);
 assert.equal(v.version,'5.224');
 assert.equal(v.sourceOSMId,'1282136966');
 assert.equal(v.parentOSMId,'83026442');
 assert.equal(v.originalJunctionGPS,'50.2309313,14.8734086');
 assert.equal(v.sourceHighway,'service');
 assert.equal(v.sourceVehicle,'destination');
 assert.equal(v.parentSourceHighway,'living_street');
 assert.equal(v.parentSourceMotorVehicle,'destination');
 assert.equal(v.originalSegments,2);
 assert.equal(v.renderedOriginalSegments,2);
 assert.equal(v.parentRenderedSegments,9);
 assert.equal(v.connectedOriginalSegments,11);
 assert(Math.abs(v.connectedOriginalMeters-333.570)<.15);
 assert.equal(v.material,'visnova-tagged-paving-stones');
 assert.equal(v.parentUsesSameSharedMaterial,true);
 assert.equal(v.materialAvailable,true);
 assert.equal(v.originalOSMConnectionAlreadyExists,true);
 assert.equal(v.realPaverColourPhotoVerified,false);
 assert.equal(v.realPaverPatternPhotoVerified,false);
 for(const k of ['addedRoadConnections','newRoads','newFootways',
  'newBuildings','newParking','newKerbs','newColliders','newSigns'])
  assert.equal(v[k],0,k);
 assert.deepEqual(errors,[],'no browser JS errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/lesni-original-spur-5224-mobile.png'});
 console.log('PASS 5.224 real mobile WebGL 40m original service spur joins',
 '293.56m prior paved living street at exact same OSM junction;',
 '11 source road pieces, shared paving, 6.5s/LOD stable');
}finally{await browser.close()}
