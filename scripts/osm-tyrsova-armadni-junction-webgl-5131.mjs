// 5.131 standalone live mobile Chromium/WebGL check:
// inspect REAL Tyršova continuation and OSM zebra islands, not new road art.
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
  'http://127.0.0.1:8080/?v=513200&streetAudit=tyrsova-terrace-5131',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>(
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='tyrsova-terrace-5131'&&
   window.__miloviceTyrsovaArmadniJunctionAudit?.mappedBuildingCount===5&&
   window.__miloviceTyrsovaArmadniJunctionRuntime?.()?.ready===true&&
   window.__miloviceTyrsovaPartyWallRuntime?.()?.ready===true
  ),null,{timeout:110000});
 }catch(error){
  const context=await page.evaluate(()=>({
   regions:window.__miloviceAreasLoaded,
   junction:window.__miloviceTyrsovaArmadniJunctionAudit,
   runtime:window.__miloviceTyrsovaArmadniJunctionRuntime?.(),
   partyWalls:window.__miloviceTyrsovaPartyWallAudit,
   partyRuntime:window.__miloviceTyrsovaPartyWallRuntime?.(),
   cam:window.__miloviceStreetAuditRendered
  }));
  throw Error('Real Tyršova zebra not loaded '+
   JSON.stringify(context)+' JS errors '+JSON.stringify(errors)+' '+error);
 }
 await page.waitForTimeout(6800);
 const s=await page.evaluate(()=>({
  build:document.querySelector('meta[name="milovice-build"]')?.content,
  label:document.getElementById('build-label')?.textContent,
  audit:window.__miloviceTyrsovaArmadniJunctionAudit,
  live:window.__miloviceTyrsovaArmadniJunctionRuntime?.(),
  partyWalls:window.__miloviceTyrsovaPartyWallAudit,
  partyRuntime:window.__miloviceTyrsovaPartyWallRuntime?.(),
  regions:window.__miloviceAreasLoaded,
  cam:window.__miloviceStreetAuditRendered,
  menuHeight:document.getElementById('street-block-audit')
   ?.getBoundingClientRect().height,
  oldClinicPavers:window.__miloviceClinicForecourtRuntime?.(),
  oldClinicShopfront:window.__miloviceClinicShopfrontRuntime?.(),
  oldClinicSaplings:window.__miloviceClinicPhotoSaplingsRuntime?.()
 }));
 assert.equal(s.build,'20261118-tyrsova-five-houses-partywall-cleanup-513200');
 assert.equal(s.label,s.build);
 assert(s.regions.includes('mlada'));
 assert.equal(s.cam.view,'tyrsova-terrace-5131');
 assert.equal(s.audit.version,'5.131');
 assert.equal(s.partyWalls.version,'5.132');
 assert.equal(s.partyWalls.actualBuildingCount,5);
 assert.equal(s.partyWalls.abuttingPairCount,4);
 assert.equal(s.partyWalls.sharedUndirectedWalls,4);
 assert.equal(s.partyWalls.internalFacadeEdgesToSkip,8);
 assert.equal(s.partyWalls.exteriorFacadeEdgesRemaining,12);
 assert.equal(s.partyWalls.runtimeSkippedPartyFacadeEdges,8);
 assert.deepEqual(s.partyWalls.sourceBuildings,
  ['61979140','61979141','61979149','61979146','61979143']);
 assert.deepEqual(s.partyWalls.expectedSkippedPerHouse,[1,2,2,2,1]);
 assert.deepEqual(s.partyWalls.sourceBuildings.map(id=>
  s.partyWalls.skippedPerBuilding[id]),[1,2,2,2,1],
  'Each exact OSM house has expected shared wall count');
 assert.equal(s.partyRuntime.ready,true);
 assert.equal(s.partyRuntime.skippedInteriorEdges,8);
 assert.equal(s.partyRuntime.perHouseMatchesSource,true);
 assert.equal(s.partyRuntime.existingSolidBuildingsPreserved,true);
 assert.equal(s.partyRuntime.changedBuildingFloorCounts,0);
 assert.equal(s.partyRuntime.changedOSMPolygons,0);

 assert.equal(s.audit.sourceRoadToNorth,'Tyršova');
 assert.equal(s.audit.spojoContinuingPastArmadni,false);
 assert.equal(s.audit.mappedBuildingCount,5);
 assert.deepEqual(s.audit.sourceEastBuildingWayIds,
  ['61979140','61979141','61979149','61979146','61979143']);
 assert.deepEqual(s.audit.mappedFiveFloorBuildings.map(b=>b.floors),
  [5,5,5,5,5]);
 assert.equal(s.audit.sourceConsecutiveTerrace,true);
 assert.deepEqual(s.audit.sourceSidewalkMaterials,
  ['paving_stones','paving_stones']);
 assert.deepEqual(s.audit.sourceCrossingWayIds,
  ['1318462995','1316882855']);
 assert.equal(s.audit.sourceIslandCount,2);
 assert.equal(s.audit.modeledIslandCount,0);
 assert.equal(s.audit.paintedBarCount,20);
 assert.equal(s.audit.actualRenderedMeshes,2);
 assert.equal(s.audit.actualRenderedTriangles,40);
 assert.equal(s.audit.crossingMarkedButStyleUnspecifiedNotPainted,'1044078125');
 assert.equal(s.audit.crossingExplicitUnmarkedNotPainted,'1278749453');
 assert.equal(s.audit.paintedNewMarkedCrossings,0);
 assert.equal(s.audit.inventedStreetSegments,0);
 assert.equal(s.audit.addedRoads,0);
 assert.equal(s.audit.addedFootways,0);
 assert.equal(s.audit.addedRoadColliders,0);
 assert.equal(s.audit.addedBuildings,0);
 assert.equal(s.audit.changedExistingBuildingFloors,0);
 assert.equal(s.live.ready,true);
 assert.equal(s.live.drawMeshes,2);
 assert.equal(s.live.fullPaintedTriangles,40);
 assert.equal(s.live.allGeometryPreserved,true);
 assert.equal(s.live.allProtectedFromDetailLOD,true);
 assert(s.live.visibleZebraCrossingsAfterLOD>=1,
  'At least the closest photographed OSM island zebra must still render');
 assert.deepEqual(s.live.entries.map(q=>q.id),['1318462995','1316882855']);
 assert(s.live.entries.every(q=>q.attached&&q.inScene&&q.triangles===20));
 assert(s.menuHeight<150,'Review camera menu must not cover mobile view');
 assert.deepEqual(errors,[],'No JS exceptions during streaming / LOD');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-tyrsova-five-houses-no-internal-window-5132-mobile.png'
 });
 console.log('PASS 5.132 live mobile Tyršova five abutting RUIAN homes, no fake internal facade parts, real zebra after LOD',
  JSON.stringify({realFlats:s.audit.mappedBuildingCount,
   fiveFloorsEverywhere:s.audit.mappedFiveFloorBuildings.every(b=>b.floors===5),
   sourceZebraIds:s.audit.sourceCrossingWayIds,
   paintTriangles:s.live.fullPaintedTriangles,
   visibleAfterLOD:s.live.visibleZebraCrossingsAfterLOD,
   markedUnknownLeftUnpainted:true,unmarkedLeftUnpainted:true,
   interiorFacesSkipped:s.partyRuntime.skippedInteriorEdges,
   fourPartyWalls:s.partyWalls.sharedUndirectedWalls,
   menuHeight:s.menuHeight}));
 await page.close();
}finally{await browser.close()}
