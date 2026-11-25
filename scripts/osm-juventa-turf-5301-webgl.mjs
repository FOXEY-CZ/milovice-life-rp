// Real Chromium WebGL mobile test, not a photographic recreation.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
try{
 const view='pitch-juventa-5301',page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=531200&streetAudit='+view,{waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(view=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceSportPitchCameraAudit?.targetInFrame===true&&
   window.__miloviceStreetAuditRendered?.view===view&&window.__miloviceJuventaRender5301?.().visibleMeshes>0,view,{timeout:120000});
 }catch(e){
  const state=await page.evaluate(()=>({regions:window.__miloviceAreasLoaded,camera:window.__miloviceSportPitchCameraAudit,render:window.__miloviceJuventaRender5301?.()}));
  throw Error('Juventa not ready '+JSON.stringify(state)+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(7100);
 const state=await page.evaluate(()=>({camera:window.__miloviceSportPitchCameraAudit,render:window.__miloviceJuventaRender5301?.(),
  jump:window.__miloviceJuventaRender5301?.('long-jump'),
  access:window.__miloviceJuventaAccess5304?.(),
  school:window.__miloviceJuventaSchool5306?.(),
  hzs:window.__miloviceHZSShell5315?.(),
  sport:window.__miloviceSportPitchAudit,selected:document.querySelector('#street-audit-nav a.selected')?.dataset.auditId,
  canvas:document.querySelector('canvas')?.clientWidth}));
 assert.equal(state.camera.pitchId,'1472419116');assert.equal(state.camera.sport,'soccer');
 assert.equal(state.camera.notAPhoto,true);assert.equal(state.camera.cameraInsideMappedPitch,true);
 assert.equal(state.camera.targetInFrame,true);assert(Math.abs(state.camera.targetProjection.x)<.8&&Math.abs(state.camera.targetProjection.y)<.8);
 assert(state.camera.paintedLineSegments>0);assert(state.camera.cameraHeightAboveTerrain>9);
 assert(state.render.visibleMeshes>0);
 assert(state.render.meshes.every(m=>m.attached&&m.color===0x3d7b52&&m.vertices>0));
 assert(state.sport.juventaTurf5301.some(t=>t.sourceOSMId==='1472419116'&&t.material==='pitchTurf'));
 assert.deepEqual([...new Set(state.sport.suppressedAthleticsOutlines5300.map(t=>t.id))].sort(),['1472419115','1472419120']);
 assert(state.jump?.visibleMeshes>0,'5.302 long-jump surface must survive mobile LOD');
 assert(state.jump.meshes.every(m=>m.attached&&m.color===0xc5aa78&&m.vertices>0&&m.sourceIds.includes('1472419120')));
 assert(state.jump.meshes.every(m=>m.textureBytes===4096),'5.303 actual sand mesh must retain the shared texture');
 assert(state.sport.juventaLongJump5302.some(x=>x.sourceOSMId==='1472419120'&&x.material==='pitchSand'&&x.currentSurfaceVerified===false));
 console.log('PASS 5.302 mobile Juventa actual attached sand mesh after 7.1s LOD',JSON.stringify(state.jump));
 assert.deepEqual(state.access?.protectedWayIds,['1472419124','1472419127','1472419128','1076211056','1076211057','1076211058','1076211060']);
 assert.equal(state.access.segments,31);assert.equal(state.access.exactSourceJunctions,14);assert.equal(state.access.sourceCrossingId,'1076211056');assert.equal(state.access.newGeometry,0);
 assert(state.hzs?.attached&&state.hzs.registered&&state.hzs.vertices>0,'HZS source shell missing');
 assert.equal(state.hzs.sourceHash,'10a34d4b');assert.equal(state.hzs.sourceOutlineVertices,8);
 assert.equal(state.hzs.textureBytes,512);assert.equal(state.hzs.plasterRows,64);
 assert.equal(state.hzs.materialGroups,2);assert.equal(state.hzs.newColliders,0);
 assert.equal(state.hzs.garageDoorsAdded,0);assert.equal(state.hzs.towerAdded,0);
 assert.equal(await page.evaluate(()=>window.__miloviceHZSPreview5316?.()),null);
 assert.equal(await page.evaluate(()=>window.__miloviceHZSSignPreview5317?.()),null);
 console.log('PASS 5.315 HZS attached exact shell after LOD',JSON.stringify(state.hzs));
 assert.equal(state.school?.sourceOSMId,'53865836');assert.equal(state.school.sourceOutlineVertices,72);
 assert(state.school.attached&&state.school.visible&&state.school.registered&&state.school.vertices>0);
 assert.equal(state.school.materialGroups,2);assert.equal(state.school.modelShellOnly,true);
 assert.equal(state.school.facade5307?.applied,true);assert.equal(state.school.facade5307.bytes,512);
 assert.equal(state.school.facade5307.bandRows,8);assert.equal(state.school.facade5307.newMeshes,0);
 assert.equal(state.school.facade5307.newColliders,0);
 assert.equal(state.school.photoAnchor5308?.edge,47);assert.equal(state.school.photoAnchor5308.exactEntranceSurveyed,false);
 assert.equal(state.selected,view);assert(state.canvas>0);assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/juventa-5301-mobile.png'});
 console.log('PASS 5.301 mobile Juventa actual attached turf meshes after 7.1s LOD',JSON.stringify(state.render));
 await page.goto('http://127.0.0.1:8080/?v=531200&streetAudit=juventa-school-5308',{waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
  window.__miloviceStreetAuditRendered?.view==='juventa-school-5308'&&window.__miloviceJuventaSchool5306?.().visible,undefined,{timeout:120000});
 const photo=await page.evaluate(()=>({gps:window.__miloviceAuditCameraGPS,view:window.__miloviceStreetAuditRendered,school:window.__miloviceJuventaSchool5306?.(),windows:window.__miloviceJuventaWindows5309?.()}));
 assert(Math.abs(photo.gps.latitude-50.22681)<.000001);
 assert(Math.abs(photo.gps.longitude-14.866101)<.000001);
 assert(Number.isFinite(photo.gps.bearingDegreesExact));
 assert(Math.abs(photo.gps.bearingDegreesExact-98.62)<.2,JSON.stringify(photo.gps));
 assert.equal(photo.gps.bearingDegrees,99);
 assert.equal(photo.view.cameraMode,'documented-photo-gps-and-heading');
 assert.equal(photo.view.photoCameraIsObjectSurvey,false);
 assert.equal(photo.school.photoAnchor5308.edge,47);
 const terrain=photo.school.terrain5312;
 assert(terrain,'missing actual foundation audit');
 assert.equal(terrain.perimeterSamples,292);assert.equal(terrain.matchesCurrentFoundationPolicy,true);
 assert(Math.abs(terrain.foundationPolicyDelta)<.002);
 assert(terrain.perimeterRelief>7.7&&terrain.perimeterRelief<7.8);
 assert(terrain.foundationAboveCandidateRange[0]>4.6&&terrain.foundationAboveCandidateRange[1]<5.3);
 assert.equal(terrain.fallbackUsed,false);assert.equal(terrain.readyForGeometry,false);
 assert.equal(terrain.newGeometry,0);assert.equal(terrain.newColliders,0);
 console.log('PASS 5.312 actual school foundation vs loaded DEM',JSON.stringify(terrain));
 const local=photo.school.localSection5314;
 assert(local,'missing 5.314 diagnostic');
 assert.deepEqual(local.loadedRegionIds,terrain.loadedRegionIds);
 assert.equal(local.existingFoundation,terrain.actualFoundationElevation);
 const ranges=local.hypotheticalElevationRanges;
 for(let i=0;i<2;i++){
  assert(Math.abs(ranges.landing[i]-ranges.lowerTerrain[i]-.94)<.002);
  assert(Math.abs(ranges.roofParapet[i]-ranges.lowerTerrain[i]-16.41)<.002);
 }
 for(const k of ['worldDatumVerified','readyForGeometry','anchorIsVerifiedEntrance','rangeIsConfidenceInterval'])assert.equal(local[k],false);
 assert.equal(local.newGeometry,0);assert.equal(local.newColliders,0);
 console.log('PASS 5.314 actual loaded DEM hypothetical section',JSON.stringify(local));
 const wings=photo.school.wings5313;
 assert(wings&&wings.candidateEdges.A.includes(47)&&wings.candidateEdges.C.includes(33));
 assert.equal(wings.readyForGeometry,false);
 assert.equal(await page.evaluate(()=>window.__miloviceJuventaWingOverlay5313?.()),null);
 const section=photo.school.section5311;
 assert.equal(section?.stairRiseTotal,.94);assert.equal(section.canopyClearanceAboveLanding,3.16);
 assert.deepEqual(section.candidateOutlineProjection.edges,[48,49,50]);
 assert.equal(section.candidateOutlineProjection.canopyIdentityVerified,false);
 assert.equal(section.readyForGeometry,false);assert.equal(section.newGeometry,0);assert.equal(section.newColliders,0);
 console.log('PASS 5.311 documented entrance section and source outline projection, no invented geometry',JSON.stringify(section));
 assert(photo.windows?.attached&&photo.windows.visible);
 assert.equal(photo.windows.windowBays,9);assert.equal(photo.windows.glassPanes,54);
 assert.equal(photo.windows.triangles,144);assert.equal(photo.windows.meshes,1);
 assert.equal(photo.windows.newColliders,0);assert.equal(photo.windows.exactPositionsSurveyed,false);
 await page.waitForTimeout(7100);
 const afterLod=await page.evaluate(()=>window.__miloviceJuventaWindows5309?.());
 assert(afterLod?.attached&&afterLod.visible,'Juventa window bays must remain attached and visible after 7.1s LOD');
 assert.equal(afterLod.triangles,144);assert.equal(afterLod.meshes,1);
 assert.equal(afterLod.edge,47);assert.equal(afterLod.newColliders,0);
 console.log('PASS 5.309 mobile Juventa window bays after 7.1s LOD',JSON.stringify(afterLod));
 assert.deepEqual(errors,[]);
 await page.screenshot({path:'browser-artifacts/juventa-5309-mobile.png'});
 console.log('PASS 5.308: actual mobile review camera matches photo GPS and heading',JSON.stringify(photo.gps));
 await page.goto('http://127.0.0.1:8080/?v=531300&streetAudit=juventa-wings-5313',{waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
  window.__miloviceStreetAuditRendered?.view==='juventa-wings-5313'&&
  window.__miloviceJuventaWingOverlay5313?.()?.allCornersInFrame,undefined,{timeout:120000});
 await page.waitForTimeout(7100);
 const overlay=await page.evaluate(()=>window.__miloviceJuventaWingOverlay5313?.());
 assert(overlay?.attached&&overlay.visible&&overlay.allCornersInFrame);
 assert.equal(overlay.overlayMeshes,2);assert.equal(overlay.outlineLoops,2);
 assert.equal(overlay.triangles,4);assert.equal(overlay.auditOnly,true);
 assert.equal(overlay.physicalGeometry,0);assert.equal(overlay.newColliders,0);
 assert.deepEqual(errors,[]);
 await page.screenshot({path:'browser-artifacts/juventa-5313-wing-audit-mobile.png'});
 await page.goto('http://127.0.0.1:8080/?v=531700&streetAudit=hzs-doors-5316',{waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&window.__miloviceHZSPreview5316?.()?.attached,undefined,{timeout:120000});
 await page.waitForTimeout(7100);
 const hzs=await page.evaluate(()=>window.__miloviceHZSPreview5316?.());
 assert(hzs?.attached);assert.equal(hzs.doors,3);assert.equal(hzs.triangles,6);assert.equal(hzs.textureBytes,8192);
 assert.equal(hzs.newColliders,0);assert.equal(hzs.facadeOrientationVerified,false);
 const sign=await page.evaluate(()=>window.__miloviceHZSSignPreview5317?.());
 assert(sign?.attached&&sign.visible);assert.equal(sign.meshes,5);assert.equal(sign.triangles,40);
 assert(sign.textureBytes>0);assert.equal(sign.newColliders,0);assert.equal(sign.towerDimensionsVerified,false);
 assert.deepEqual(errors,[]);
 await page.screenshot({path:'browser-artifacts/hzs-5317-model-preview.png'});
 console.log('PASS 5.317 opt-in HZS sign and tower after LOD',JSON.stringify(sign));
 console.log('PASS 5.316 opt-in HZS garage door preview after LOD',JSON.stringify(hzs));
 console.log('PASS 5.313 actual mobile A/C audit-only overlays after 7.1s LOD',JSON.stringify(overlay));
}finally{await browser.close()}
