// 5.123: observe actual photo-paved clinic forecourt after mobile LOD.
// OSM road + footway remain higher and untouched in the rendered game.
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
 await page.goto(
  'http://127.0.0.1:8080/?v=513100&streetAudit=armadni-clinic-5118',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>(
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='armadni-clinic-5118'&&
   window.__miloviceClinicForecourtAudit?.drawMeshes===1&&
   window.__miloviceClinicForecourtRuntime?.()?.inScene===true
  ),null,{timeout:110000});
 }catch(e){
  const debug=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   paving:window.__miloviceClinicForecourtAudit,
   pavementRuntime:window.__miloviceClinicForecourtRuntime?.(),
   clinic:window.__miloviceArmLandmarksAudit,
   camera:window.__miloviceStreetAuditRendered,
   errors:window.__miloviceOsmError
  }));
  throw Error('Photo-paved clinic Spojovaci forecourt missing '+JSON.stringify(debug)+
   ' JS errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6800);
 const s=await page.evaluate(()=>({
  audit:window.__miloviceClinicForecourtAudit,
  live:window.__miloviceClinicForecourtRuntime?.(),
  clinic:window.__miloviceClinicEntranceRuntime?.(),
  build:document.getElementById('build-label')?.textContent,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  panelHeight:document.getElementById('street-block-audit')
   ?.getBoundingClientRect().height
 }));
 assert.equal(s.meta,'20261118-tyrsova-armadni-osm-zebra-estate-513100');
 assert.equal(s.meta,s.build);
 assert.equal(s.audit.clinicId,'1057548624');
 assert.equal(s.audit.sourceStreetId,'246652750');
 assert.equal(s.audit.sourceFootwayId,'1339091016');
 assert.equal(s.audit.drawMeshes,1);
 assert(s.audit.estimatedPavingCells>120);
 assert(s.audit.pavedModelArea>120);
 assert.equal(s.audit.renderedTriangles,s.audit.estimatedPavingCells*2);
 assert(s.audit.minCarriagewayClearance>=.22);
 assert.equal(s.audit.inferredParkingBays,0);
 assert.equal(s.audit.inferredPaintedParkingLines,0);
 assert.equal(s.audit.newPedestrianRoutes,0);
 assert.equal(s.audit.newRoads,0);
 assert.equal(s.audit.newBuildings,0);
 assert.equal(s.audit.existingFootwayAboveSurface,true);
 assert.equal(s.audit.existingAsphaltAboveSurface,true);
 assert.equal(s.live.inScene,true);
 assert.equal(s.live.visibleInScene,true,
  'Mapped photo paving must remain visible after mobile LOD');
 assert.equal(s.live.activeTriangles,s.audit.renderedTriangles);
 assert.equal(s.live.paintedParkingLines,0);
 assert.equal(s.live.generatedRoads,0);
 assert.equal(s.clinic?.allVisible,true,
  'Clinic photo glass entrance and teal canopy remain visible too');
 assert(s.panelHeight<150,'Photo camera menu remains compact on phones');
 assert.deepEqual(errors,[],'No page startup or LOD errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-clinic-spojovaci-photo-paving-5123-mobile.png'
 });
 console.log('PASS clinic forecourt 5.123 actual mobile WebGL after 6.8s LOD',
  JSON.stringify({cells:s.audit.estimatedPavingCells,
   pavingArea:s.audit.pavedModelArea,
   triangles:s.live.activeTriangles,
   visibleAfterLOD:s.live.visibleInScene,
   collisionClearance:s.audit.minCarriagewayClearance,
   walkingWay:s.audit.sourceFootwayId,
   sharedPavingMeshCount:s.audit.drawMeshes}));
 await page.close();
}finally{await browser.close()}
