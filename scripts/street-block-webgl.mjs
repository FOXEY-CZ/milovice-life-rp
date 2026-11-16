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
  {id:'church-2024',width:393,height:852,mobile:true,technical:false,sourcePhoto:true},
  {id:'mirova',width:1280,height:760,mobile:false,technical:false}
 ]){
  const page=await browser.newPage({
   viewport:{width:cfg.width,height:cfg.height},deviceScaleFactor:1,
   isMobile:cfg.mobile,hasTouch:cfg.mobile
  });
  const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
  await page.goto('http://127.0.0.1:8080/?v=58500&streetAudit='+cfg.id,
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
   label:document.getElementById('street-audit-label')?.textContent,
   source:document.getElementById('street-audit-source')?.href,
   panel:document.getElementById('street-block-audit')?.offsetWidth,
   compact:document.getElementById('street-block-audit')?.classList.contains('audit-compact'),
   playerHudHidden:getComputedStyle(document.getElementById('hud')).display==='none',
   visibleCanvas:!!document.querySelector('canvas')?.clientWidth,
   mass:window.__miloviceMassStreetBlock583,
   hero:window.__miloviceHeroArchitecture,
   build:document.getElementById('build-label')?.textContent
  }));
  assert.equal(info.build,'20261116-church-photo-streetscape-batch-58500');
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
  assert.equal(info.hero?.maxBuildings,68,
   'Retain the old maxBuildings capacity for mobile performance');
  assert.equal(info.hero?.massBlockNoPhotoApproval,true);
  assert.equal(info.photoBlock?.rendered,true,
   '2022 panorama batch must actually render, not just plan');
  assert(info.photoBlock.fenceSegments>=3,
   'Mapped-safe low fence lines must be placed on photo-observed left verge');
  assert(info.photoBlock.rightTrees>=2,
   '2022 right-side trees must become real geometries');
  assert(info.photoBlock.asphaltWearPatches>=18,
   'Broad street road surface variation, not one isolated decoration');
  assert(info.photoBlock.drawMeshes<=7,
   'Keep 2022 fence, tree and asphalt scene to at most 7 draw calls');
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
  assert.equal(info.audit.view,cfg.id);
  assert.equal(info.audit.cameraMode,cfg.streetLevel?'technical-osm-street-axis':cfg.technical?
   'technical-osm-overhead':'documented-photo-gps-and-heading');
  assert.equal(info.audit.technicalStreetLevel,cfg.streetLevel===true);
  assert.equal(info.audit.legacyPhotoHeadingUnavailable,cfg.technical);
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
  assert.deepEqual(errors,[]);
  await page.screenshot({path:'browser-artifacts/milovice-street-58500-'+cfg.id+'.png'});
  console.log('STREET_BLOCK_WEBGL_OK',JSON.stringify({
   mode:cfg.id,scenes:info.audit.generatedSceneCount,source:info.source,
   cameraMode:info.audit.cameraMode,roadClearance:info.scene?.minRoadClearance,
   decision:info.scene?.photoSceneDecision,
   pionyru:info.audit.pionyruSatelliteAudit
  }));
  await page.close();
 }
}finally{await browser.close()}
