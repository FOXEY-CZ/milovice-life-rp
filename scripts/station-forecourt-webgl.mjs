// Milovice RP 5.81: independent real Chromium/WebGL 2024 forecourt review.
// A passing test proves loaded 3D anchors and camera framing, not physical
// geosurvey of the large tree, Y-lamp, BUS paint or garden furniture.
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
 await mkdir('browser-artifacts',{recursive:true});
 for(const cfg of [
  {view:'wide',mobile:false,width:1280,height:760,
   expectedVisible:['station','tower']},
  {view:'wide',overview:true,mobile:true,width:393,height:852,
   expectedVisible:[]},
  {view:'tower',mobile:true,width:393,height:852,
   expectedVisible:['tower']},
  {view:'tower',flat:true,mobile:true,width:393,height:852,
   expectedVisible:['tower']},
  {view:'tower',inspection:true,mobile:true,width:393,height:852,
   expectedVisible:[]},
  {view:'bus',mobile:false,width:1280,height:760,
   expectedVisible:[]}
 ]){
  const page=await browser.newPage({
   viewport:{width:cfg.width,height:cfg.height},deviceScaleFactor:1,
   isMobile:cfg.mobile,hasTouch:cfg.mobile});
  const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
  await page.goto('http://127.0.0.1:8080/?v=58240&forecourtAudit='+cfg.view+
   (cfg.flat?'&roadSurfaceFlat=1':'')+
   (cfg.inspection?'&entryInspection=1':'')+
   (cfg.overview?'&parkingOverview=1':''),
   {waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.__miloviceForecourtAuditRendered?.active===true,
   null,{timeout:120000});
  const state=await page.evaluate(()=>({
   review:window.__miloviceForecourtAuditRendered,
   compact:document.getElementById('forecourt-photo-audit').classList.contains('audit-compact'),
   expansionButton:document.getElementById('forecourt-audit-toggle')?.getAttribute('aria-expanded'),
   auditLabel:document.getElementById('forecourt-audit-label')?.textContent,
   towerMaterials:window.__miloviceBikeTowerInterior,
   roadDiagnostic:window.__miloviceRoadTextureDiagnostic,
   roadUv:window.__miloviceRoadUVValidation,
   stationParking:window.__miloviceStationParking,
   streetGeometry:window.__miloviceStreetGeometryAudit,
   joystickHidden:getComputedStyle(document.getElementById('rp-joystick')).display==='none',
   liveLoadingPopupHidden:getComputedStyle(document.getElementById('osmnotice-live')).display==='none',
   mapSwitchHidden:getComputedStyle(document.getElementById('osm3d')).display==='none',
   diagnosticLink:document.getElementById('forecourt-audit-surface')?.href,
   statusLabel:document.getElementById('forecourt-audit-status')?.textContent,
   build:document.getElementById('build-label')?.textContent,
   panelVisible:!!document.getElementById('forecourt-photo-audit')?.offsetWidth,
   spawnHidden:getComputedStyle(document.getElementById('rp-spawn')).display==='none',
   normalTicketPanelHidden:getComputedStyle(
    document.getElementById('ticket-photo-audit')).display==='none',
   visibleCanvas:!!document.querySelector('canvas')?.clientWidth,
   sourceLink:document.getElementById('forecourt-audit-source')?.href,
   fov:(()=>window.__miloviceForecourtAuditRendered?.active?1:null)()
  }));
  const v=state.review;
  assert.equal(state.build,'20261116-pionyru-access-continuity-audit-58240');
  assert.equal(state.panelVisible,true);
  assert.equal(state.compact,cfg.mobile);
  assert.equal(state.expansionButton,cfg.mobile?'false':'true');
  assert.equal(v.cameraMode,(cfg.inspection||cfg.overview)?
   'technical-osm-derived':'documented-photo-gps');
  assert.equal(v.parkingOverview.requested,Boolean(cfg.overview));
  assert.equal(v.parkingOverview.enabled,Boolean(cfg.overview));
  assert.equal(v.parkingOverview.noGeometryChanges,true);
  assert.equal(state.stationParking.active,true);
  assert.equal(state.streetGeometry?.photoOuterFootwaySegmentsReplaced,3,
   'Exactly the three previously duplicate OSM island-footway segments are now custom-rendered');
  assert.equal(state.streetGeometry?.photoOuterFootwaySegments,0);
  assert(state.streetGeometry?.mappedFootwaySegments>0,
   'Other mapped footways must remain visible');
  assert(state.stationParking.roadSafeInfillCells>100);
  assert.equal(state.stationParking.smoothRoadsideInfill,true);
  assert.equal(state.stationParking.infillRestrictedToSafeRibbon,true);
  assert.equal(state.stationParking.southernNoseCurvedInsideSafeCells,true);
  assert(state.stationParking.southernNoseTrimMetres>.20&&state.stationParking.southernNoseTrimMetres<.24);
  assert.equal(state.stationParking.southernRoadsideTaperMetres,2.28);
  assert.equal(state.stationParking.southernRoadsideTaperedRows,3);
  assert.equal(state.stationParking.sparseNorthTipTilesRemoved,4,
   'Four small top-end raster tiles must not outlive the continuous footway');
  assert.equal(state.stationParking.sparseNorthTipRowsRemoved,3,
   'Only three short sparse tail rows may be trimmed');
  assert.equal(state.stationParking.sparseSouthTipTilesRemoved,2,
   'Eliminate two detached raster paving cells below the first full island row');
  assert(state.stationParking.southernOuterPaverEarsClipped>=2);
  assert(state.stationParking.unsupportedTerminalInfillRowsTrimmed>=0);
  assert.equal(state.stationParking.smoothRoadsideWithinSafeCells,true);
  assert(state.stationParking.smoothInfillRows>55);
  assert(state.stationParking.smoothInfillJoins>50);
  assert(state.stationParking.smoothInfillMaxEdgeStep<.22,
   'Top-down road-facing edge may not jump by a full 74cm grid square');
  assert.equal(state.stationParking.smoothInfillMaxSlope,.12);
  assert.equal(state.stationParking.roadSafeInfillTriangles,
   state.stationParking.smoothInfillRows*4);
  assert.equal(state.stationParking.infillExtraDrawCalls,0,
   'Safe underlay belongs in the existing sidewalk drawcall');
  assert.equal(state.stationParking.roadSurfaceUnmodified,true);
  assert.equal(state.stationParking.satelliteReferenceDate,'2023-06-04');
  assert.equal(state.stationParking.railGrassGridRemoved,true);
  assert.equal(state.stationParking.railPavingVariableDepth,true);
  assert.equal(state.stationParking.railPavingTrafficEdgeSafelyExtended,true);
  assert(state.stationParking.railPavingSeamCells>=2);
  assert(state.stationParking.railPavingLargestSeamReduction>.10);
  assert(state.stationParking.railPavingLargestSeamReduction<=.721);
  assert.equal(state.stationParking.railPavingNarrowRoadsideGapRetested,true);
  assert.equal(state.stationParking.railPavingMinRoadFacingBuffer,.025);
  assert(state.stationParking.railPavingExpandedBays>=2,
   'Tapered rail-side apron must widen in OSM-safe places, not remain a rectangle');
  assert(state.stationParking.railPavingMaxDepth>
   state.stationParking.railPavingMinDepth+.35);
  assert.equal(state.stationParking.railPavingTaperedMesh,true);
  assert.equal(state.stationParking.railSideSurface,'continuous-pale-concrete-with-safe-bridges');
  assert(state.stationParking.railSideJoiningSlabs>10);
  assert(state.stationParking.railFacingKerbSections>=30);
  assert.equal(state.stationParking.railEndKerbReturns,2);
  assert.equal(state.stationParking.railKerbsNoNewFootprint,true);
  assert.equal(state.stationParking.terminalPlantingsDeferred,true);
  assert(state.stationParking.railBayLines>=14);
  assert(state.stationParking.centralBayLines>=6);
  assert.equal(state.stationParking.bayLinePositionsEstimated,true);
  assert(state.stationParking.drawMeshes<=8,
   'Joined paved rail bank and both parking line sets must stay mobile-friendly');
  if(cfg.overview){
   assert.equal(v.parkingOverview.sourceIsPhotoCamera,false);
   assert.equal(v.parkingOverview.cameraBasedOnMappedRoad,true);
   assert.equal(v.parkingOverview.referenceServiceWayId,675778842);
   assert.equal(v.parkingOverview.referenceEastRoadId,128308366);
   assert.equal(v.parkingOverview.referencePedestrianWayId,1165594426);
   assert(v.parkingOverview.centralParkingTiles>0);
   assert(v.parkingOverview.oppositeParkingBays>0);
   assert(v.parkingOverview.outerSidewalkPatches>0);
   assert(v.parkingOverview.mappedOuterSidewalkSegments>0);
   assert.equal(v.parkingOverview.underlyingRoadsUnchanged,true);
   assert.equal(v.parkingOverview.modelledSurface,true);
   assert(state.auditLabel.includes('technický OSM pohled'));
   assert.equal(state.joystickHidden,true);
  }
  assert.equal(v.entryInspection.enabled,Boolean(cfg.inspection));
  if(cfg.inspection){
   assert.equal(v.entryInspection.sourceIsPhotoCamera,false);
   assert.equal(v.entryInspection.padAndPathOneMesh,true);
   assert.equal(v.entryInspection.pathEndsOnRenderedSafeFootway,true);
   assert.equal(v.entryInspection.projectedPoints.length,3);
   assert(v.entryInspection.projectedPoints.every(p=>p.inFrame),
    'Close camera must show entrance, physical joint AND mapped footway together');
   assert(state.auditLabel.includes('NENÍ fotografická kamera'));
  }
  assert.equal(state.spawnHidden,true);
  assert.equal(state.joystickHidden,true,'Analog mobile joystick cannot obscure photo audit');
  assert.equal(state.liveLoadingPopupHidden,true);
  assert.equal(state.mapSwitchHidden,true);
  assert.equal(state.roadDiagnostic?.active,true);
  assert.equal(state.roadDiagnostic?.flat,Boolean(cfg.flat));
  assert.equal(state.roadDiagnostic?.roadMaterialHasTexture,!cfg.flat);
  assert.equal(state.roadDiagnostic?.geometryModified,false);
  assert.equal(state.roadDiagnostic?.roadMaterialOnly,true);
  assert.equal(state.roadDiagnostic?.worldAlignedRoadUv,true);
  assert.equal(state.roadDiagnostic?.metersPerAsphaltTile,7);
  assert.deepEqual(state.roadDiagnostic?.textureRepeat,{x:1,y:1});
  assert.equal(state.roadDiagnostic?.changedOnlyAsphaltUV,true);
  assert.equal(state.roadDiagnostic?.originalRoadGeometry,true);
  assert.equal(state.roadDiagnostic?.textureFilter,'LinearMipmapLinearFilter');
  assert.equal(state.roadUv?.worldAligned,true);
  assert.equal(state.roadUv?.metersPerTile,7);
  assert(state.roadUv?.strips>0,'3D city must actually tessellate OSM asphalt');
  assert(state.roadUv?.sampledVertices>0);
  assert(state.roadUv?.maxUVError<.0002,
   'Every sampled asphalt UV must match its world X/Z without stretching');
  assert.equal(state.roadUv?.changedRoadVertices,false);
  assert.equal(v.roadTextureDiagnostic?.flat,Boolean(cfg.flat));
  assert(state.diagnosticLink.includes(cfg.flat?'forecourtAudit=tower':'roadSurfaceFlat=1')
   ||cfg.view!=='tower');
  assert(state.statusLabel?.includes('Mapa načtena'));

  assert.equal(state.normalTicketPanelHidden,true);
  assert.equal(state.visibleCanvas,true);
  assert.equal(v.view,cfg.view);
  assert.equal(state.towerMaterials?.glassAppearancePass,
   '5811-silver-2022-2024-photo');
  assert.equal(state.towerMaterials?.towerGlazingOpacity,.20);
  assert.equal(state.towerMaterials?.photoGeometryUnchanged,true);
  assert.equal(state.towerMaterials?.externalFootprintUnchanged,true);
  assert.equal(state.towerMaterials?.addedStreetFurniture,0);
  assert.equal(v.photoDate,'2024-05-30');
  assert.equal(v.landmarks.length,2);
  assert.equal(v.stopCount,2);
  assert.equal(v.bikeTowerEntryPaving?.active,true,
   'Photo-anchored tower entry must render its paved access, not grass');
  assert.equal(v.bikeTowerEntryPaving?.drawCalls,1);
  assert.equal(v.bikeTowerEntryPaving?.connectedToMappedFootway,true);
  assert.equal(v.bikeTowerEntryPaving?.expectedFootwayId,1165594426);
  assert(v.bikeTowerEntryPaving?.connectorLength>6);
  assert(v.bikeTowerEntryPaving?.connectorLength<10);
  assert.equal(v.bikeTowerEntryPaving?.connectorEndWidth,1.64);
  assert.equal(v.bikeTowerEntryPaving?.oneContinuousSurface,true);
  assert.equal(v.bikeTowerEntryPaving?.preservedGreenery,true);
  assert(v.bikeTowerEntryPaving?.widestPavedWidth>4.3);
  assert(v.bikeTowerEntryPaving?.narrowestPavedWidth>=1.6);
  assert(v.bikeTowerEntryPaving?.estimatedPavedAreaM2>25);
  assert(v.bikeTowerEntryPaving?.connectorRoadMargin>.18);
  assert(v.bikeTowerEntryPaving?.nearbyBuildingMargin>.45);
  assert.equal(v.bikeTowerEntryPaving?.triangles,720);
  assert.equal(v.entryInspection.singleContinuousPaving,true);
  assert(v.entryInspection.approxAreaM2>25);
  assert.equal(v.bikeTowerEntryPaving?.targetInsideActuallyRenderedFootway,true);
  assert.equal(v.bikeTowerEntryPaving?.mappedFootwaySegment,3);
  assert(v.bikeTowerEntryPaving?.connectorRoadMargin>.17);
  assert.equal(v.bikeTowerEntryPaving?.width,3.1);
  assert.equal(v.bikeTowerEntryPaving?.depth,2.1);
  assert.equal(v.bikeTowerEntryPaving?.materialReused,true);
  assert.equal(v.bikeTowerEntryPaving?.roadClearanceVerified,true);
  assert.equal(v.bikeTowerEntryPaving?.originalRoadsUntouched,true);
  assert.equal(v.bikeTowerEntryPaving?.photosCopied,false);
  assert.equal(v.existingBikeTowerUpperSign?.active,true);
  assert.equal(v.existingBikeTowerUpperSign.drawCalls,1);
  assert.equal(v.existingBikeTowerUpperSign.wayId,1011197691);
  assert.equal(v.existingBikeTowerUpperSign.noAddedStreetFurniture,true);
  assert.equal(v.existingBikeTowerUpperSign.photoPixelsUsed,false);
  assert.equal(v.worldGeometryMoved,false);
  assert.equal(v.surveyedPositions,false);
  assert.equal(v.photosCopied,false);
  assert(v.deferred.includes('broadleaf'));
  assert(v.deferred.includes('twin-lamp'));
  assert(v.deferred.includes('BUS-road-paint'));
  for(const id of cfg.expectedVisible)assert(v.visibleLandmarks.includes(id),
   cfg.view+': mapped '+id+' must be in real camera frame');
  assert.equal(state.sourceLink,v.source);
  assert.deepEqual(errors,[]);
  const path='browser-artifacts/milovice-forecourt-58240-'+cfg.view+
   (cfg.flat?'-flat':'')+(cfg.inspection?'-entry':'')+
   (cfg.overview?'-parking-overview':'')+
   (cfg.mobile?'-mobile':'')+'.png';
  await page.screenshot({path});
  console.log('5.81 FORECOURT WebGL PASS',JSON.stringify({
   view:cfg.view,visibleLandmarks:v.visibleLandmarks,
   sourceHeading:v.cameraGps.heading,existingStops:v.stopCount,
   newRoadObjects:0,upperSignDrawCalls:1,
   flatRoadMaterial:state.roadDiagnostic.flat,
   asphaltUvSamples:state.roadUv.sampledVertices,
   maxUvError:state.roadUv.maxUVError,
   joystickHidden:state.joystickHidden,
   errors:errors.length
  }));
  await page.close();
 }
}finally{
 await browser.close();
}
