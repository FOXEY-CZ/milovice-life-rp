// 5.109: check the ACTUAL Slepá apartment 3D scene in mobile Chromium.
// Camera is derived from OSM highway= residential way 202375817, not a photo.
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
 await page.goto('http://127.0.0.1:8080/?v=511200&streetAudit=road-slepa-5108',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   (window.__miloviceAreasLoaded?.includes('mlada')||
    window.__miloviceAreasLoaded?.includes('vrutice'))&&
   window.__miloviceSlepaResidentialAudit?.mappedApartmentBuildings===5&&
   window.__miloviceStreetAuditRendered?.view==='road-slepa-5108',
   null,{timeout:110000});
 }catch(e){
  const debug=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   apartments:window.__miloviceSlepaResidentialAudit,
   street:window.__miloviceStreetAuditRendered
  }));
  throw Error('Slepá 5.109 scene did not render: '+JSON.stringify(debug)+
   '; browser errors '+JSON.stringify(errors)+'; '+String(e));
 }
 const state=await page.evaluate(()=>({
  apartments:window.__miloviceSlepaResidentialAudit,
  camera:window.__miloviceStreetAuditRendered,
  navigationLinks:document.querySelectorAll('#street-audit-nav a').length,
  canvasWidth:document.querySelector('canvas')?.clientWidth,
  build:document.getElementById('build-label')?.textContent,
  meta:document.querySelector('meta[name="milovice-build"]')?.content
 }));
 assert.equal(state.apartments.sourceStreetId,'202375817');
 assert.equal(state.apartments.mappedApartmentBuildings,5);
 assert.deepEqual(state.apartments.sourceBuildingIds.slice().sort(),[
  '53865778','734359705','734359706','734359707','734359708'
 ]);
 assert(state.apartments.horizontalFloorJoints>=15);
 assert(state.apartments.verticalBayJoints>=5);
 assert(state.apartments.duplicateVerticalJointsRemoved>=1);
 assert.equal(state.apartments.structuralFootprintsChanged,0);
 assert.equal(state.apartments.extraNewBuildings,0);
 assert.equal(state.apartments.roofShapesChanged,0);
 assert.equal(state.apartments.photoConfirmedFacades,0);
 assert.equal(state.apartments.existingGrassPolygonsUntouched,true);
 assert.equal(state.navigationLinks,34);
 assert(state.canvasWidth>0&&state.build===state.meta);
 assert.deepEqual(errors,[],'No 3D startup JS errors');
 // Objects must remain in a mounted, visible Three.js InstancedMesh after
 // chunk streaming and mobile LOD, not just report audit metadata.
 await page.waitForTimeout(6200);
 const live=await page.evaluate(()=>
  window.__miloviceSlepaResidentialRuntime?.());
 assert(live?.ready&&live.verifiedFullParentChain,
  '5.109 must inspect real THREE InstancedMesh, not mere counters');
 assert.equal(live.mappedBuildings,5);
 assert(live.visibleSeamMeshes>=1,'Slepá panel seams disappeared after LOD');
 assert(live.visibleSeamInstances>=5,'No real batched Slepá facade seams');
 assert.deepEqual(errors,[],'No delayed JS errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-slepa-apartments-5109-mobile.png'});
 console.log('PASS 5.109 mapped Slepá five residential facades',JSON.stringify({
  buildings:state.apartments.mappedApartmentBuildings,
  horizontalCourses:state.apartments.horizontalFloorJoints,
  verticalSeams:state.apartments.verticalBayJoints,
  visibleInstancedDetails:live.visibleSeamInstances
 }));
 await page.close();
}finally{await browser.close()}
