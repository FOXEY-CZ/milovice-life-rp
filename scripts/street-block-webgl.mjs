// Milovice RP 5.82 — 2014 5. května and 2024 Mírová camera review.
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
  {id:'5kv',width:393,height:852,mobile:true,technical:true},
  {id:'pionyru',width:393,height:852,mobile:true,technical:true},
  {id:'pionyru-forward',width:393,height:852,mobile:true,technical:true,streetLevel:true},
  {id:'pionyru-reverse',width:393,height:852,mobile:true,technical:true,streetLevel:true},
  {id:'pionyru-left',width:393,height:852,mobile:true,technical:true,streetLevel:true},
  {id:'pionyru-right',width:393,height:852,mobile:true,technical:true,streetLevel:true},
   {id:'pionyru-panorama-2022',width:1280,height:760,mobile:false,technical:false},
  {id:'church-2024',width:393,height:852,mobile:true,technical:false,sourcePhoto:true},
  {id:'mirova',width:1280,height:760,mobile:false,technical:false},
   {id:'school-detail-2024',width:1280,height:760,mobile:false,technical:false},
   {id:'skolska-west-2024',width:1280,height:760,mobile:false,technical:false},
   {id:'skolska-east-589',width:1280,height:760,mobile:false,technical:true,streetLevel:true},
   {id:'skolska-tail-590',width:1280,height:760,mobile:false,technical:true,streetLevel:true}
 ]){
  const page=await browser.newPage({
   viewport:{width:cfg.width,height:cfg.height},deviceScaleFactor:1,
   isMobile:cfg.mobile,hasTouch:cfg.mobile
  });
  const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
  await page.goto('http://127.0.0.1:8080/?v=58530&streetAudit='+cfg.id,
   {waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>
   window.__miloviceStreetAuditRendered?.active===true&&
   window.__miloviceStreetEnvironment?.photoSceneDecision?.reason!=='not-loaded'&&
   window.__miloviceStreetEnvironment?.photoSceneDecision?.reason!=='evaluating',
   null,{timeout:120000});
  const info=await page.evaluate(()=>({
   audit:window.__miloviceStreetAuditRendered,
   scene:window.__miloviceStreetEnvironment,
   walkway:window.__miloviceChurchSidewalk2022,
   photoBlock:window.__miloviceChurchPhotoStreet,
    panoFacade:window.__milovicePionyru2022Facade,
   label:document.getElementById('street-audit-label')?.textContent,
   source:document.getElementById('street-audit-source')?.href,
   panel:document.getElementById('street-block-audit')?.offsetWidth,
   compact:document.getElementById('street-block-audit')?.classList.contains('audit-compact'),
   playerHudHidden:getComputedStyle(document.getElementById('hud')).display==='none',
   visibleCanvas:!!document.querySelector('canvas')?.clientWidth,
   mass:window.__miloviceMassStreetBlock583,
    mirovaBatch:window.__miloviceMirovaPublicPhotoBlock586,
    skolskaBatch:window.__miloviceSkolskaPublicPhotoBlock587,
    skolskaWestBatch:window.__miloviceSkolskaWestBlock588,
    skolskaEastBatch:window.__miloviceSkolskaEastBlock589,
    skolskaTailBatch:window.__miloviceSkolskaTailBlock590,
    skolskaTailGreen:window.__miloviceSkolskaTailGreen590,
    skolskaWestGreen:window.__miloviceSkolskaWestGreen588,
    mirovaGreen:window.__miloviceMirovaPhotoStreet586,
   hero:window.__miloviceHeroArchitecture,
   gps:window.__miloviceAuditCameraGPS,
   gpsLabel:document.getElementById('street-audit-camera-gps')?.textContent,
   gpsHref:document.getElementById('street-audit-map-gps')?.href,
   build:document.getElementById('build-label')?.textContent
  }));
  assert.equal(info.build,'20261117-skolska-tail-59000');
  assert.equal(info.mass?.prioritizedBuildings,20,
   'A WHOLE 20-house neighborhood block, not an isolated prop, must be planned');
  assert.equal(info.mass?.actuallyDetailed,20,
   'All 20 prioritized OSM homes must really use the enhanced 3D facade shell');
  assert.equal(info.mass?.photoApprovedBuildings,0);
  assert.equal(info.mass?.newBuildingFootprints,0);
  assert.equal(info.mass?.roadAndFootwayGeometryModified,false);
  assert.equal(info.mass?.unknownFacadesStillUnverified,true);
  assert.equal(info.hero?.priorityBuilt,20);
  assert.equal(info.hero?.massBlockPriorityBuilt,20);
  assert.equal(info.hero?.massBlockReservedPlaces,20);
   // Additional 12 houses on Mírová must be rendered, not just selected.
   assert.equal(info.mirovaBatch?.prioritizedBuildings,12);
   assert.equal(info.mirovaBatch?.actuallyDetailed,12);
   assert.equal(info.mirovaBatch?.reservedBudget,12);
   assert.equal(info.mirovaBatch?.photoApprovedBuildings,0);
   assert.equal(info.mirovaBatch?.existingRoadOrFootwayModified,false);
   assert.equal(info.skolskaBatch?.prioritizedBuildings,12);
   assert.equal(info.skolskaBatch?.actuallyDetailed,12);
   assert.equal(info.skolskaBatch?.reservedBudget,12);
   assert.equal(info.skolskaBatch?.photoApprovedNeighborBuildings,0);
   assert.equal(info.skolskaBatch?.newBuildingFootprints,0);
   assert.equal(info.skolskaBatch?.alteredRoadOrFootway,false);
   assert.equal(info.skolskaBatch?.schoolLandmarkPreserved,true);
   assert.equal(info.skolskaBatch?.totalPublicPhotoContextHouses,48);
   assert.equal(info.skolskaWestBatch?.prioritizedBuildings,8);
   assert.equal(info.skolskaWestBatch?.actuallyDetailed,8);
   assert.equal(info.skolskaWestBatch?.reservedBudget,8);
   assert.equal(info.skolskaWestBatch?.photographedHouseAppearsInBatch,true);
   assert.equal(info.skolskaWestBatch?.roadsChanged,false);
   assert.equal(info.skolskaWestBatch?.newFootprints,0);
   assert.equal(info.skolskaWestBatch?.detailedBuildingLimit,68);
   assert(info.hero?.photoFocusBuiltIds.includes('202298939'),
    'Keep the separately documented fork-gable among the 68 high-detail houses');
   assert.equal(info.skolskaWestGreen?.rendered,true,
    'Western Školská street should contain visible inferred planting geometry');
   assert(info.skolskaWestGreen.hedges+info.skolskaWestGreen.trees>=2);
   assert(info.skolskaWestGreen.drawMeshes<=4,
    'Entire school-west greenery must use at most four InstancedMesh calls');
   assert.equal(info.skolskaWestGreen.positionsEstimated,true);
   assert.equal(info.skolskaWestGreen.changedRoads,0);
   assert.equal(info.skolskaWestGreen.changedSidewalks,0);
   assert.equal(info.skolskaWestGreen.guessedPrivateEntrances,0);
   assert.equal(info.skolskaEastBatch?.prioritizedBuildings,8);
    assert.equal(info.skolskaEastBatch?.actuallyDetailed,8);
    assert.equal(info.skolskaEastBatch?.reservedBudget,8);
    assert.equal(info.skolskaEastBatch?.roadsChanged,false);
    assert.equal(info.skolskaEastBatch?.photoVerifiedHouseFacades,0);
    assert.equal(info.skolskaTailBatch?.prioritizedBuildings,7);
    assert.equal(info.skolskaTailBatch?.actuallyDetailed,7);
    assert.equal(info.skolskaTailBatch?.reservedBudget,7);
    assert.equal(info.skolskaTailBatch?.artificialBuildings,0);
    assert.equal(info.skolskaTailBatch?.perHousePhotographicApproval,0);
    assert.equal(info.skolskaTailGreen?.rendered,true);
    assert(info.skolskaTailGreen.hedges>=1&&info.skolskaTailGreen.trees>=1);
    assert(info.skolskaTailGreen.drawMeshes<=4,
     'One entire southeast Školská planting pass must stay batched');
    assert.equal(info.skolskaTailGreen.positionsEstimated,true);
    assert.equal(info.skolskaTailGreen.changedRoads,0);
    assert.equal(info.skolskaTailGreen.changedSidewalks,0);
    assert.equal(info.skolskaTailGreen.guessedPrivateEntrances,0);
    assert.equal(info.hero?.photoFocusReservedPlaces,48);
   assert.equal(info.hero?.photoFocusBuilt,48);
   assert.equal(info.hero.photoFocusBuiltIds.length,48);
   assert.equal(info.mirovaGreen?.active,true,
    'Actual Mírová clipped-hedge/trees must render after city OSM load');
   assert(info.mirovaGreen.hedgeSegments+info.mirovaGreen.plantedTrees>=2);
   assert(info.mirovaGreen.drawMeshes<=4,'Keep new whole-street green pass under four draw calls');
   assert.equal(info.mirovaGreen.alteredRoadGeometry,false);
   assert.equal(info.mirovaGreen.alteredBuildingGeometry,false);
   assert.equal(info.mirovaGreen.positionsEstimated,true);
   assert.equal(info.hero?.normalBuilt+info.hero?.photoFocusBuilt+
    info.hero?.priorityBuilt,68,'Keep whole 68-house budget stable');
   assert.equal(new Set([...info.hero.priorityIds,...info.hero.photoFocusIds]).size,68,
    'No selected house may be counted in two of the four OSM street blocks');
  assert.equal(info.hero?.maxBuildings,68,
   'Retain the old maxBuildings capacity for mobile performance');
  assert.equal(info.hero?.massBlockNoPhotoApproval,true);
  assert.equal(info.photoBlock?.rendered,true,
   '2022 panorama batch must actually render, not just plan');
  assert(info.photoBlock.fenceSegments>=3,
   'Mapped-safe low fence lines must be placed on photo-observed left verge');
  assert.equal(info.photoBlock.brownGateLeaves,4,
   'Photo-backed 4-panel brown gate must appear in the same 5. května street');
  assert.equal(info.photoBlock.photoGatePositionSurveyed,false);
  assert.equal(info.photoBlock.photoBrickPavementRendered,true,
   'The photographed paver frontage should render after road and building clearance');
  assert(info.photoBlock.rightTrees>=2,
   '2022 right-side trees must become real geometries');
  assert(info.photoBlock.asphaltWearPatches>=18,
   'Broad street road surface variation, not one isolated decoration');
  assert(info.photoBlock.drawMeshes<=10,
   'Keep photographed 2022 gate, fence, trees and asphalt within 10 draw calls');
  assert.equal(info.photoBlock.roadGeometryChanged,false);
  assert.equal(info.photoBlock.footwayGeometryChanged,false);
  assert.equal(info.photoBlock.inventedPrivateEntrances,0);
  assert.equal(info.photoBlock.inventedRoadPaint,0);
  assert.equal(info.walkway?.rendered,true,
   'Photo-informed left-sidewalk and curb must ACTUALLY render in mobile 3D');
  assert(info.walkway.modelledLengthM>=62,
   'Continuous pavement should cover a meaningful street block');
  assert.equal(info.walkway.drawMeshes,2,
   'The full modelled pavement and curb must use only TWO batched draw calls');
  assert.equal(info.walkway.privateDrivewaysInvented,0);
  assert.equal(info.walkway.createsMappedFootway,false);
  assert.equal(info.walkway.positionSurveyed,false);
  if(cfg.sourcePhoto){
   assert.equal(info.audit.sourceDate,'2024-05-30');
   assert.equal(info.audit.cameraMode,'documented-photo-gps-and-heading');
   assert(info.source.includes('kostel_sv.'));
  }
  assert(info.gps?.latitude>50&&info.gps?.latitude<51,
   'Every audit camera must expose its ACTUAL in-game GPS location');
  assert(info.gps?.longitude>14&&info.gps?.longitude<16);
  assert(info.gpsLabel?.includes('Herní kamera:'));
  assert(info.gpsHref?.startsWith('https://mapy.com/zakladni?x='));
  if(cfg.id==='pionyru-left'||cfg.id==='pionyru-right'){
   assert(Math.abs(info.gps.latitude-50.2277205)<.00001);
   assert(Math.abs(info.gps.longitude-14.8849593)<.00001);
   // Bearing comes from floating point 3D world orientation and is rounded to
   // a whole degree; headless GPU math can differ by 1 degree between runs.
   const expectedBearing=cfg.id==='pionyru-left'?224:33;
   const error=Math.abs(((info.gps.bearingDegrees-expectedBearing+540)%360)-180);
   assert(error<=1,`Street photo heading differs by ${error}°, tolerance 1°`);
  }
  if(cfg.id==='skolska-tail-590'){
   assert(Math.abs(info.gps.latitude-50.2271629)<.000002);
   assert(Math.abs(info.gps.longitude-14.8899405)<.000002);
   assert(Math.abs(info.gps.bearingDegrees-126)<=1);
   assert.equal(info.audit.cameraMode,'technical-osm-street-axis');
   assert.equal(info.audit.technicalStreetLevel,true);
   assert(info.gpsLabel.includes('126°'));
  }
  if(cfg.id==='skolska-east-589'){
   // The real eye position is at the OSM junction; do not fall back to
   // 74 m overhead because this district has no Pionýrů-only photo plan.
   assert(Math.abs(info.gps.latitude-50.2280951)<.000002,
    'The east Školská camera must stay at its published OSM road coordinate');
   assert(Math.abs(info.gps.longitude-14.8875431)<.000002);
   assert(Math.abs(info.gps.bearingDegrees-119)<=1,
    'The inferred OSM street axis must face east, not the overhead fallback');
   assert.equal(info.audit.technicalStreetLevel,true);
   assert.equal(info.audit.cameraMode,'technical-osm-street-axis');
   assert(info.gpsLabel?.includes('119°'));
  }
  if(cfg.id==='pionyru-panorama-2022'){
    assert(Math.abs(info.gps.latitude-50.2277105)<.000002,
     'Camera starts at provided Panorama GPS, not the previous procedural viewpoint');
    assert(Math.abs(info.gps.longitude-14.8849165)<.000002);
    assert(Math.abs(info.gps.bearingDegrees-220)<=1,
     'Camera must already look at the house at the source Panorama bearing');
    assert.equal(info.panoFacade?.triangleWindow,true,
     'Photo panorama gable must have its real triangular attic glass and frame');
    assert.equal(info.panoFacade?.frameOnSameWall,true);
    assert(info.source.includes('pid=81190391'),
     'The same Mapy Panorama source must be one click away');
    assert.equal(info.audit.cameraMode,'documented-photo-gps-and-heading');
   }
   assert.equal(info.audit.view,cfg.id);
  assert.equal(info.audit.cameraMode,cfg.streetLevel?'technical-osm-street-axis':cfg.technical?
   'technical-osm-overhead':cfg.id==='skolska-west-2024'?
   'public-photo-gps-inferred-osm-direction':'documented-photo-gps-and-heading');
  assert.equal(info.audit.technicalStreetLevel,cfg.streetLevel===true);
  assert.equal(info.audit.legacyPhotoHeadingUnavailable,cfg.technical||cfg.id==='skolska-west-2024');
  assert.equal(info.audit.estimatedObjectLocations,true);
  assert.equal(info.audit.photoCameraIsObjectSurvey,false);
  assert.equal(info.audit.treeEvidenceCount,1);
  assert.equal(info.audit.poleEvidenceCount,1);
  assert.equal(info.audit.duplicatedTreeDisabled,true);
  assert.equal(info.audit.duplicatedPoleDisabled,true);
  assert.equal(info.audit.unverifiedOverheadSpanDisabled,true);
  assert.equal(info.audit.generatedSceneCount,1,
   'Photo-backed 5. května streetscape must actually load in real 3D, not only its camera');
  assert.equal(info.scene?.photoSceneDecision?.reason,'accepted-photo-scene');
  assert.equal(info.scene?.photoSceneDecision?.roadIds?.[0],'219273174');
  assert(info.scene?.minRoadClearance>=2,
   'Historically depicted models must remain off all indexed OSM roads');
  assert(info.scene?.drawMeshes>0&&info.scene?.drawMeshes<=29,
   'Visible historical features including the single streetlight remain mobile-friendly');
  assert.equal(info.scene?.streetlamp2022?.modelCount,1,
   'The photographed May 2022 grey streetlight must be rendered in 3D');
  assert.equal(info.scene?.streetlamp2022?.observedCount,1);
  assert.equal(info.scene?.streetlamp2022?.positionSurveyed,false);
  assert.equal(info.scene?.streetlamp2022?.sourceDate,'2022-05-09');
  assert.equal(info.scene?.streetlamp2022?.duplicateOrSpeculativeLamps,0);
  assert.equal(info.scene?.streetlamp2022?.sourcePixelsUsed,false);
  assert.equal(info.scene?.streetlamp2022?.osmDirectionTowardChurch,1,
   'The mapped lamp must lie on the OSM branch toward St Catherine church');
  assert(info.scene.streetlamp2022.churchDistanceFromLampM+50<
   info.scene.streetlamp2022.churchDistanceFromJunctionM,
   'The lamp must not be on the wrong Pionýrů branch');
  assert(info.source.startsWith(cfg.id.startsWith('pionyru')?'https://mapy.com':
   'https://commons.wikimedia.org/wiki/File:'));
  if(cfg.id.startsWith('pionyru')){
   const p=info.audit.pionyruSatelliteAudit;
   assert.equal(p?.active,true,'Satellite vegetation must be built from OSM road and Pionýrů intersection');
   assert.equal(p.roadId,'219273174');
   assert.equal(p.junctionRoadId,'118488006');
   assert.equal(p.imageDate,'2023-06-04');
   assert(p.plantedShrubPockets>=2&&p.plantedShrubPockets<=5,
    'A few satellite-confirmed hedge pockets must be visible in city model');
   assert.equal(p.accessContinuityAudit?.length,2,
    'Both read-only OSM access distances must be visible to photo audit');
   assert.equal(p.actualDrivewayConnectionsVerified,0);
   assert.equal(p.publicVergeAccesses,2,
    'Both photo-observed accesses must be visible, not guessed private driveways');
   assert.equal(p.rejectedUnsafeAccesses,0);
   assert.equal(p.privateDrivewaysInvented,false);
   assert.equal(p.footwaysModified,false);
   assert.equal(p.instancedDrawCalls,2,
    'Five shrubs and two safe paved verge aprons use only two batched draw calls');
   assert.equal(p.roadSurfaceChanged,false);
   assert.equal(p.sidewalkGeometryChanged,false);
   assert.equal(p.modelledNotSurveyed,true);
  }
  assert(info.panel>0);
  assert.equal(info.compact,cfg.mobile);
  assert.equal(info.playerHudHidden,true);
  assert.equal(info.visibleCanvas,true);
   if(cfg.id==='skolska-west-2024'){
    assert.equal(info.audit.cameraMode,'public-photo-gps-inferred-osm-direction');
    assert.equal(info.audit.publicPhotoHeadingEstimated,true);
    assert(Math.abs(info.gps.latitude-50.2290672)<.000002);
    assert(Math.abs(info.gps.longitude-14.8822619)<.000002);
    assert(Math.abs(info.gps.bearingDegrees-57)<=1);
    assert(info.source.includes('kolsk%C3%A1_1.jpg'),
     'Link directly to the actual Commons Školská 1 photograph');
   }
  assert.deepEqual(errors,[]);
  // Regression case: the user's Android screenshot shows the NEW sidewalk,
  // fence, trees and asphalt vanish ~5 sec AFTER first load. Recheck
  // actual object visibility after multiple adaptive performance samples.
  if(cfg.id==='pionyru-forward'){
   const before=await page.evaluate(()=>window.__milovicePhotoRuntime?.());
   await page.screenshot({path:'browser-artifacts/milovice-street-58530-before-delay.png'});
   await page.waitForTimeout(7300);
   const after=await page.evaluate(()=>window.__milovicePhotoRuntime?.());
   await page.screenshot({path:'browser-artifacts/milovice-street-58530-after-delay.png'});
   console.log('FIVE_SECOND_PHOTO_SCENE_AUDIT',JSON.stringify({before,after}));
   assert(after?.groups?.every(g=>g.exists&&g.visible&&g.childrenVisible>0),
    'PHOTO_SCENE_5SEC_DISAPPEARANCE: mapped photo scene turned invisible after adaptive LOD');
  }
  await page.screenshot({path:'browser-artifacts/milovice-street-58530-'+cfg.id+'.png'});
  console.log('STREET_BLOCK_WEBGL_OK',JSON.stringify({
   mode:cfg.id,scenes:info.audit.generatedSceneCount,source:info.source,
   cameraMode:info.audit.cameraMode,roadClearance:info.scene?.minRoadClearance,
   decision:info.scene?.photoSceneDecision,
   pionyru:info.audit.pionyruSatelliteAudit
  }));
  await page.close();
 }
}finally{await browser.close()}
