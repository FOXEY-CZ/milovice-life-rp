// 5.141 – render 10 real GPS-anchored footway corner triangles in
// Sportovní estate on Android-like Chromium, alive after 6 s mobile LOD.
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
 await page.goto('http://127.0.0.1:8080/?v=514100&streetAudit=sportovni-estate-joins-5141',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='sportovni-estate-joins-5141'&&
   window.__miloviceSportovniEstateWalkRuntime?.()?.ready&&
   window.__miloviceSportovniResidentialRuntime?.()?.ready&&
   window.__miloviceSportovniSidewalkRuntime?.()?.ready,
   null,{timeout:105000});
 }catch(e){
  const state=await page.evaluate(()=>({
   regions:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered,
   walk:window.__miloviceSportovniEstateWalkRuntime?.(),
   apartment:window.__miloviceSportovniResidentialRuntime?.(),
   sidewalk:window.__miloviceSportovniSidewalkRuntime?.()
  }));
  throw Error('5.141 mapped pedestrian model not ready '+JSON.stringify(state)+
   ' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6200);
 const x=await page.evaluate(()=>({
  camera:window.__miloviceStreetAuditRendered,
  walk:window.__miloviceSportovniEstateWalkRuntime?.(),
  apartment:window.__miloviceSportovniResidentialRuntime?.(),
  sidewalk:window.__miloviceSportovniSidewalkRuntime?.(),
  older:window.__miloviceMladaFootwayJoinRuntime?.(),
  road:window.__milovicePrubeznaRoadRuntime?.(),
  panelHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height,
  links:document.querySelectorAll('#street-audit-nav a').length
 }));
 assert.equal(x.camera.view,'sportovni-estate-joins-5141');
 assert.equal(x.walk.version,'5.141');
 assert.equal(x.walk.plannedSealedCorners,10);
 assert.equal(x.walk.renderedCornerTriangles,10);
 assert.deepEqual(x.walk.byWay,{
  '1046197807':3,'1046197808':3,'1046197810':1,
  '1278749454':2,'1278749456':1
 });
 assert.equal(x.walk.inventedFootways,0);
 assert.equal(x.walk.inventedTrees,0);
 assert.equal(x.walk.inventedGrassPolygons,0);
 assert.equal(x.walk.inventedZebraCrossings,0);
 assert.equal(x.walk.createdIndividualTriangleMeshes,0);
 assert(x.walk.meshes>=1);
 assert(x.walk.visibleMeshes>=1,'New paths must remain visible after mobile LOD');
 assert(x.walk.visibleTriangles>=10);
 assert.equal(x.apartment.mappedApartmentBuildings,9);
 assert.equal(x.sidewalk.sourceOSMMeters,162.9);
 assert.equal(x.road.renderedExistingSegments,12);
 assert(x.older?.meshes>=1&&x.older?.originallyPlanned>=12,
  'Original 5.106 path corner batches must still exist; their far-away camera chunks may correctly be LOD-culled');
 assert(x.panelHeight<150);
 assert(x.links>=54);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/milovice-sportovni-pedestrian-corners-5141-mobile.png'});
 console.log('PASS 5.141: 10 existing OSM Sportovni pedestrian corner joins are rendered and visible after mobile LOD; previous mapped paths and nine towers preserved');
 await page.close();
}finally{await browser.close()}
