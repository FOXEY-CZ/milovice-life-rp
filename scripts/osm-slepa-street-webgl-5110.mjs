// 5.110: mobile Chromium real-scene regression at the mapped Slepá centreline.
// This is technical OSM geometry, not a photographed street or verified
// physical kerb, grass blade or parking place.
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
 const errors=[];page.on('pageerror',err=>errors.push(String(err.stack||err)));
 await page.goto(
  'http://127.0.0.1:8080/?v=511100&streetAudit=road-slepa-5108',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   (window.__miloviceAreasLoaded?.includes('mlada')||
    window.__miloviceAreasLoaded?.includes('vrutice'))&&
   window.__miloviceSlepaResidentialAudit?.mappedApartmentBuildings===5&&
   window.__miloviceSlepaLawnAudit?.detailedLawns===15&&
   window.__miloviceSlepaAccessAudit?.modeledDriveways===2&&
   window.__miloviceStreetAuditRendered?.view==='road-slepa-5108',
   null,{timeout:110000});
 }catch(e){
  const state=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   lawn:window.__miloviceSlepaLawnAudit,
   access:window.__miloviceSlepaAccessAudit,
   apartment:window.__miloviceSlepaResidentialAudit,
   camera:window.__miloviceStreetAuditRendered
  }));
  throw Error('Missing Slepá source streetscape '+JSON.stringify(state)+
   ', browser errors: '+JSON.stringify(errors)+'; '+String(e));
 }
 const data=await page.evaluate(()=>({
  lawn:window.__miloviceSlepaLawnAudit,
  access:window.__miloviceSlepaAccessAudit,
  parking:window.__miloviceSlepaParkingAudit,
  estate:window.__miloviceSlepaResidentialAudit,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 assert.equal(data.lawn.sourceStreetId,'202375817');
 assert.equal(data.lawn.mappedLawns,15);
 assert.equal(data.lawn.detailedLawns,15);
 assert.equal(data.lawn.tuftInstances,48);
 assert(data.lawn.drawMeshes>=1);
 assert.equal(data.lawn.inventedLawns,0);
 assert.equal(data.lawn.inventedShrubs,0);
 assert.equal(data.lawn.inventedParkingLots,0);
 assert.equal(data.lawn.sourcePolygonsUntouched,true);
 assert.equal(data.access.modeledDriveways,2);
 assert.deepEqual(data.access.drivewayIDs.slice().sort(),
  ['1019598855','1019598856']);
 assert.equal(data.access.estimatedWidth,3.2);
 assert.equal(data.access.photographedDrivewayWidths,false);
 assert.equal(data.access.roadwayCenterlinesChanged,0);
 assert.equal(data.access.inventedParkingSurfacePolygons,0);
 assert.equal(data.parking?.newParkingLotPolygons,0);
 assert.equal(data.parking?.unverifiedPaintedSpaces,0);
 assert.equal(data.estate.mappedApartmentBuildings,5);
 assert.equal(data.meta,data.hud);
 assert(data.meta?.endsWith('511100'));
 await page.waitForTimeout(6200);
 const live=await page.evaluate(()=>
  window.__miloviceSlepaLawnRuntime?.());
 assert(live?.ready&&live?.verifiedSceneParentChain,
  'Lawn object must actually be attached to active Three scene');
 assert.equal(live.mappedLawns,15);
 assert.equal(live.plannedTufts,48);
 assert(live.visibleLawnBatchMeshes>=1);
 assert(live.visibleLawnBatchInstances>=10,
  'New Slepá grass must remain visible after 6.2s of region LOD');
 assert.deepEqual(errors,[],'No late browser JavaScript errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-slepa-streetscape-5110-mobile.png'});
 console.log('PASS Milovice RP 5.110 Slepá streetscape WebGL',JSON.stringify({
  grassTufts:data.lawn.tuftInstances,realLawns:data.lawn.mappedLawns,
  mappedDriveways:data.access.modeledDriveways,
  visibleInstances:live.visibleLawnBatchInstances
 }));
 await page.close();
}finally{await browser.close()}
