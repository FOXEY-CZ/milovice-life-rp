// Milovice RP 5.125 live mobile Chromium/WebGL, after the 5-second LOD.
// Validates photo-observed red paving inlays are real triangles ON the
// existing photo pavement, not fictitious new parking or traffic geometry.
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
  'http://127.0.0.1:8080/?v=513300&streetAudit=armadni-clinic-5118',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>(
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='armadni-clinic-5118'&&
   window.__miloviceClinicParkingInlaysAudit?.renderedMeshes===1&&
   window.__miloviceClinicParkingInlaysRuntime?.()?.ready===true&&
   window.__miloviceClinicPhotoPharmacySignRuntime?.()?.ready===true&&
   window.__miloviceClinicPhotoYellowCrossRuntime?.()?.ready===true&&
   window.__miloviceClinicFurnitureProtectionRuntime?.()?.ready===true&&
   window.__miloviceClinicPhotoSaplingsRuntime?.()?.ready===true&&
   window.__miloviceSpojovaciPhotoStreetRuntime?.()?.ready===true&&
   window.__miloviceTyrsovaArmadniJunctionRuntime?.()?.ready===true
  ),null,{timeout:110000});
 }catch(e){
  const debug=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   inlay:window.__miloviceClinicParkingInlaysAudit,
   inlayLive:window.__miloviceClinicParkingInlaysRuntime?.(),
   clinic:window.__miloviceArmLandmarksAudit,
   paving:window.__miloviceClinicForecourtAudit,
   auditCamera:window.__miloviceStreetAuditRendered
  }));
  throw Error('Photo parking inlays not built '+JSON.stringify(debug)+
   ' script errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6800);
 const s=await page.evaluate(()=>({
  version:document.querySelector('meta[name="milovice-build"]')?.content,
  label:document.getElementById('build-label')?.textContent,
  audit:window.__miloviceClinicParkingInlaysAudit,
  live:window.__miloviceClinicParkingInlaysRuntime?.(),
  forecourt:window.__miloviceClinicForecourtRuntime?.(),
  storefront:window.__miloviceClinicShopfrontRuntime?.(),
  pharmacySign:window.__miloviceClinicPhotoPharmacySignRuntime?.(),
  signAudit:window.__miloviceClinicPhotoPharmacySignAudit,
  yellowAudit:window.__miloviceClinicPhotoYellowCrossAudit,
  yellowRuntime:window.__miloviceClinicPhotoYellowCrossRuntime?.(),
  furnitureAudit:window.__miloviceClinicFurnitureProtectionAudit,
  furnitureRuntime:window.__miloviceClinicFurnitureProtectionRuntime?.(),
  photoSaplingsAudit:window.__miloviceClinicPhotoSaplingsAudit,
  photoSaplingsRuntime:window.__miloviceClinicPhotoSaplingsRuntime?.(),
  streetPhotoAudit:window.__miloviceSpojovaciPhotoStreetAudit,
  streetPhotoRuntime:window.__miloviceSpojovaciPhotoStreetRuntime?.(),
  tyrsovaJunctionAudit:window.__miloviceTyrsovaArmadniJunctionAudit,
  tyrsovaJunctionRuntime:window.__miloviceTyrsovaArmadniJunctionRuntime?.(),
  entrance:window.__miloviceClinicEntranceRuntime?.(),
  menuHeight:document.getElementById('street-block-audit')
   ?.getBoundingClientRect().height
 }));
 assert.match(s.version,/^20[0-9]{6}-[a-z0-9-]+$/,'Nonempty release identity must remain machine-readable');
 assert.equal(s.label,s.version);
 assert.equal(s.audit.osmClinicId,'1057548624');
 assert.equal(s.audit.streetWayId,'246652750');
 assert.equal(s.audit.footwayId,'1339091016');
 assert(s.audit.modelledSeparatorCount>=5);
 assert.equal(s.audit.drawMeshes,1);
 assert.equal(s.audit.renderedMeshes,1);
 assert.equal(s.audit.renderedTriangles,s.audit.triangleCount);
 assert.equal(s.audit.exactStallCountKnown,false);
 assert.equal(s.audit.actualParkingBayCountClaimed,0);
 assert.equal(s.audit.spacingMetresApproximate,true);
 assert.equal(s.audit.newParkingLotPolygons,0);
 assert.equal(s.audit.newParkingRoads,0);
 assert.equal(s.audit.newRoads,0);
 assert.equal(s.audit.newFootways,0);
 assert.equal(s.audit.newZebraCrossings,0);
 assert.equal(s.audit.newParkingSigns,0);
 assert.equal(s.audit.originalOSMDataPreserved,true);
 assert.equal(s.audit.pedestrianCollisionChanged,false);
 assert.equal(s.live.visibleAfterLOD,true,
  'Photo parking separators must stay visible after 6.8s mobile LOD');
 assert.equal(s.live.actualDrawMeshCount,1);
 assert.equal(s.live.activeTriangles,s.audit.triangleCount);
 assert.equal(s.live.addedSyntheticParkingStalls,0);
 assert.equal(s.forecourt.visibleInScene,true,
  'Photo paver inlays must not remove the whole 5.123 square');
 assert.equal(s.signAudit.photographedText,'LÉKÁRNA');
 assert.equal(s.signAudit.approximatedGlassBay,1);
 assert.equal(s.signAudit.exactStorefrontBayEstablished,false);
 assert.equal(s.pharmacySign.visibleAfterLOD,true,
  '5.126 photo-confirmed LÉKÁRNA must remain visible after mobile LOD');
 assert.equal(s.pharmacySign.actualDrawMeshCount,1);
 assert.equal(s.yellowAudit.osmClinicId,'1057548624');
 assert.equal(s.yellowAudit.paintedDiagonalCount,2);
 assert.equal(s.yellowAudit.triangleCount,32);
 assert.equal(s.yellowAudit.renderedTriangles,32);
 assert.equal(s.yellowAudit.renderedMeshes,1);
 assert.equal(s.yellowAudit.legallyRestrictedAreaClaimed,false);
 assert.equal(s.yellowAudit.newParkingBays,0);
 assert.equal(s.yellowAudit.newCrosswalks,0);
 assert.equal(s.yellowRuntime.visibleAfterLOD,true);
 assert.equal(s.yellowRuntime.actualDrawMeshCount,1);
 assert.equal(s.yellowRuntime.activeTriangles,32);
 assert.equal(s.furnitureAudit.clinicWayId,'1057548624');
 assert.equal(s.furnitureAudit.basedOnActualPavingTiles,422);
 assert.equal(s.furnitureAudit.actualPoleCoordinatesKnown,false);
 assert.equal(s.furnitureAudit.existingOSMRoadsChanged,0);
 assert.equal(s.furnitureAudit.existingOSMFootwaysChanged,0);
 assert.equal(s.furnitureAudit.addedFurniture,0);
 assert.equal(s.furnitureRuntime.protectedPhotographedPavingCells,422);
 assert.equal(s.furnitureRuntime.plannedEstimatedPolesOnClinicPaving,0);
 assert.equal(s.furnitureRuntime.noGuessedPolesOnPhotoPaving,true);
 assert.equal(s.furnitureRuntime.actualPolesWereNotSurveyed,true);
 assert.equal(s.furnitureRuntime.existingRoadwaysPreserved,true);
 assert.equal(s.furnitureRuntime.existingLawnPolygonsPreserved,true);
 assert.equal(s.photoSaplingsAudit.sourceClinicId,'1057548624');
 assert.equal(s.photoSaplingsAudit.sourceRoadId,'246652750');
 assert.equal(s.photoSaplingsAudit.sourceOppositeFootwayId,'1092081938');
 assert.equal(s.photoSaplingsAudit.photographedForegroundSaplings,3);
 assert.equal(s.photoSaplingsAudit.modelledSaplings,3);
 assert.equal(s.photoSaplingsAudit.measuredTreeCoordinates,false);
 assert.equal(s.photoSaplingsAudit.sourceSpeciesIdentified,false);
 assert.equal(s.photoSaplingsAudit.newSyntheticGrassPolygons,0);
 assert.equal(s.photoSaplingsAudit.newRoads,0);
 assert.equal(s.photoSaplingsAudit.newFootways,0);
 assert.equal(s.photoSaplingsAudit.newColliders,0);
 assert.equal(s.photoSaplingsAudit.renderMeshes,4);
 assert.equal(s.photoSaplingsAudit.renderInstances,12);
 assert.equal(s.photoSaplingsRuntime.ready,true);
 assert.equal(s.photoSaplingsRuntime.visibleAfterLOD,true,
  'Photo saplings must remain in the WebGL scene after 6.8s mobile LOD');
 assert.equal(s.photoSaplingsRuntime.protectedFromDetailLOD,true);
 assert.equal(s.photoSaplingsRuntime.actualDrawMeshCount,4);
 assert.equal(s.photoSaplingsRuntime.actualInstancedTreePartCount,12);
 assert.equal(s.photoSaplingsRuntime.details.length,4);
 assert(s.photoSaplingsRuntime.details.every(t=>t.instances===3&&
  t.visibleInScene&&t.geometryTriangles>0));
 assert.equal(s.streetPhotoAudit.sourceClinicId,'1057548624');
 assert.equal(s.streetPhotoAudit.sourceStreetId,'246652750');
 assert.equal(s.streetPhotoAudit.sourceNorthernCrossingId,'1044078125');
 assert.equal(s.streetPhotoAudit.sourceOppositeCommercialId,'202380957');
 assert.equal(s.streetPhotoAudit.oppositeShopSourceLevels,'1');
 assert.equal(s.streetPhotoAudit.plannedVisibleFixtures,2);
 assert.equal(s.streetPhotoAudit.photoBlueParkingPlateActuallyVisible,true);
 assert.equal(s.streetPhotoAudit.photoLampFixtureActuallyVisible,true);
 assert.equal(s.streetPhotoAudit.exactFixtureGPSKnown,false);
 assert.equal(s.streetPhotoAudit.parkingRightsOrReservedSpaceAsserted,false);
 assert.equal(s.streetPhotoAudit.existingOSMCrossingPreserved,true);
 assert.equal(s.streetPhotoAudit.newRoads,0);
 assert.equal(s.streetPhotoAudit.newCrosswalks,0);
 assert.equal(s.streetPhotoAudit.newParkingBays,0);
 assert.equal(s.streetPhotoAudit.renderedMeshCount,5);
 assert.equal(s.streetPhotoRuntime.ready,true);
 assert.equal(s.streetPhotoRuntime.visibleAfterLOD,true);
 assert.equal(s.streetPhotoRuntime.protectedFromDetailLOD,true);
 assert.equal(s.streetPhotoRuntime.actualDrawMeshes,5);
 assert.equal(s.streetPhotoRuntime.originalOSMCrossingUntouched,true);
 assert.equal(s.streetPhotoRuntime.parkingRightsNotClaimed,true);
 assert.equal(s.streetPhotoRuntime.entries.length,5);
 assert(s.streetPhotoRuntime.entries.every(e=>e.triangleCount>0));
 assert.deepEqual(s.tyrsovaJunctionAudit.namedTyrsovaWayIds,['8618265','1331897627']);
 assert.equal(s.tyrsovaJunctionAudit.mappedBuildingCount,5);
 assert(s.tyrsovaJunctionAudit.mappedFiveFloorBuildings.every(h=>h.floors===5));
 assert.equal(s.tyrsovaJunctionAudit.sourceIslandCount,2);
 assert.equal(s.tyrsovaJunctionAudit.modeledIslandCount,0);
 assert.equal(s.tyrsovaJunctionAudit.paintedBarCount,20);
 assert.equal(s.tyrsovaJunctionAudit.actualRenderedTriangles,40);
 assert.equal(s.tyrsovaJunctionAudit.actualRenderedMeshes,2);
 assert.equal(s.tyrsovaJunctionAudit.crossingMarkedButStyleUnspecifiedNotPainted,'1044078125');
 assert.equal(s.tyrsovaJunctionAudit.crossingExplicitUnmarkedNotPainted,'1278749453');
 assert.equal(s.tyrsovaJunctionAudit.inventedStreetSegments,0);
 assert.equal(s.tyrsovaJunctionAudit.addedRoads,0);
 assert.equal(s.tyrsovaJunctionAudit.addedBuildings,0);
 assert.equal(s.tyrsovaJunctionRuntime.ready,true);
 assert.equal(s.tyrsovaJunctionRuntime.drawMeshes,2);
 assert.equal(s.tyrsovaJunctionRuntime.fullPaintedTriangles,40);
 assert.equal(s.tyrsovaJunctionRuntime.allGeometryPreserved,true);
 assert.equal(s.tyrsovaJunctionRuntime.allProtectedFromDetailLOD,true);
 assert.equal(s.storefront.allVisible,true,
  'All 5.124 clinic shop glass must remain visible');
 assert.equal(s.entrance.allVisible,true,
  'Photo teal clinic canopy must remain visible');
 assert(s.menuHeight<150,'Keep mobile camera tools compact');
 assert.deepEqual(errors,[],'No browser startup/LOD JS errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-spojovaci-tyrsova-north-street-5131-mobile.png'
 });
 console.log('PASS 5.125 Spojovaci red paver photo details real mobile WebGL after 6.8s LOD',
  JSON.stringify({inlayCount:s.audit.modelledSeparatorCount,
   triangles:s.audit.renderedTriangles,meshCount:s.audit.renderedMeshes,
   visibleAfterLOD:s.live.visibleAfterLOD,
   legalParkingSlotCountUnknown:!s.audit.exactStallCountKnown,
   oldClinicGlassVisible:s.storefront.allVisible,
   pharmacySignVisible:s.pharmacySign.visibleAfterLOD,
   yellowXVisible:s.yellowRuntime.visibleAfterLOD,
   noGuessedLampPostsOnClinicPaving:s.furnitureRuntime.noGuessedPolesOnPhotoPaving,
   threeClinicPhotoSaplingsVisible:s.photoSaplingsRuntime.visibleAfterLOD,
   visiblePhotoParkingPlateAndStreetLamp:s.streetPhotoRuntime.visibleAfterLOD,
   markedNorthCrossingPreserved:s.streetPhotoRuntime.originalOSMCrossingUntouched,
   bothRealArmadniZebrasPreserved:s.tyrsovaJunctionRuntime.allGeometryPreserved,
   oldForecourtVisible:s.forecourt.visibleInScene,
   menuHeight:s.menuHeight}));
 await page.close();
}finally{await browser.close()}
