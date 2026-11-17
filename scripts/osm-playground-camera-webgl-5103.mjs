// 5.103: real Chromium/WebGL proof that 3D playgrounds have genuine
// camera targets. These are technical OSM views, NEVER photo evidence.
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
 for(const {view,osmId,region,type} of [
  {view:'play-mlada-5103',osmId:'1468803906',region:'mlada',type:'slide'},
  {view:'play-vrutice-5103',osmId:'1303773811',region:'vrutice',type:'swing'}
 ]){
  const page=await browser.newPage({viewport:{width:393,height:852},
   deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
  await page.goto('http://127.0.0.1:8080/?v=510700&streetAudit='+view,
   {waitUntil:'domcontentloaded',timeout:35000});
  try{
   await page.waitForFunction(({region,view})=>
    window.__miloviceAreasLoaded?.includes(region)&&
    window.__milovicePlaygroundCameraAudit?.ready===true&&
    window.__milovicePlaygroundCameraAudit?.targetInFrame===true&&
    window.__miloviceStreetAuditRendered?.view===view,
   {region,view},{timeout:110000});
  }catch(e){
   const debug=await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    camera:window.__milovicePlaygroundCameraAudit,
    equipment:window.__milovicePlaygroundAudit,
   lawn:window.__milovicePlaygroundLawnAudit,
    view:window.__miloviceStreetAuditRendered
   }));
   throw Error('Missing 5.103 3D playground camera: '+
    JSON.stringify(debug)+'; browser errors: '+JSON.stringify(errors)+
    '; '+String(e));
  }
  const state=await page.evaluate(()=>({
   camera:window.__milovicePlaygroundCameraAudit,
   equipment:window.__milovicePlaygroundAudit,
   lawn:window.__milovicePlaygroundLawnAudit,
   residential:window.__miloviceMladaResidentialAudit,
   vruticeFootways:window.__miloviceVruticeFootwayJoinAudit,
   roadWidth:window.__miloviceRoadWidthAudit,
   loaded:window.__miloviceAreasLoaded,
   header:document.querySelector('#street-block-audit > strong')?.textContent,
   label:document.getElementById('street-audit-label')?.textContent,
   links:document.querySelectorAll('#street-audit-nav a').length,
   sections:document.querySelectorAll('#street-audit-nav details').length,
   selected:document.querySelector('#street-audit-nav a.selected')?.dataset.auditId,
   compact:document.querySelector('#street-block-audit')?.classList.contains('audit-compact'),
   canvasWidth:document.querySelector('canvas')?.clientWidth,
   meta:document.querySelector('meta[name="milovice-build"]')?.content,
   hud:document.getElementById('build-label')?.textContent
  }));
  assert.equal(state.camera.sourceId,osmId);
  assert.equal(state.camera.target.osmId,osmId);
  assert.equal(state.camera.target.type,type);
  assert.equal(state.camera.cameraInsideMappedPlayground,true);
  assert.equal(state.camera.notAPhoto,true);
  assert.equal(state.camera.estimatedEquipment,true);
  assert(state.camera.targetInFrame,'The modeled object must appear in frame');
  assert(Math.abs(state.camera.targetProjection.x)<.8);
  assert(Math.abs(state.camera.targetProjection.y)<.8);
  assert(Math.abs(state.camera.cameraHeightAboveTerrain-1.68)<.1);
  assert(state.equipment.perArea[osmId]>=1,'Equipment must actually be modeled');
  assert(state.equipment.componentInstances>0);
  assert(state.equipment.drawMeshes>0,'Actual instanced 3D assets required');
  if(region==='mlada'){
   assert(state.lawn,'No lawn audit loaded in Mladá');
   assert(state.lawn.mappedLawns>=10,'Mapped residential lawns unavailable');
   assert(state.lawn.tuftInstances>=70,'Expected instanced short grass details');
   assert(state.lawn.drawMeshes>0,'3D grass geometry must really be rendered');
   assert.equal(state.lawn.sourcePolygonsUntouched,true);
   assert.equal(state.lawn.walkwaysUntouched,true);
   assert.equal(state.lawn.photoVerifiedIndividualGrass,false);
   assert(state.residential,'The mapped estate facade audit is required');
   assert.equal(state.residential.mappedApartmentBuildings,22,
    'All 22 mapped 4–5-storey nearby apartment blocks should be loaded');
   assert(state.residential.horizontalFloorJoints>=65,
    'OSM floor-level panel courses must be physically generated');
   assert(state.residential.verticalBayJoints>=22,
    'Original panel bay seams must be physically generated');
   assert(state.residential.duplicateVerticalJointsRemoved>0,
    'No duplicate full-height joints once per floor');
   assert.equal(state.residential.structuralFootprintsChanged,0);
   assert.equal(state.residential.roofShapesChanged,0);
   assert.equal(state.residential.photoConfirmedFacades??0,0);

  }
  if(region==='vrutice'){
   assert(state.roadWidth,'5.108 road widths need a real runtime audit');
   assert(state.roadWidth.explicitWidthWays>=10,
    'Tagged OSM roadway widths from Vrutice should reach the live scene');
   assert(state.roadWidth.byRegion.vrutice?.explicitWidthWays>=10,
    'Vrutice OSM road widths must not be metadata-only');
   assert.equal(state.roadWidth.changedMappedRoadCentrelines,0);
   assert.equal(state.roadWidth.inventedFootways,0);
   assert(state.vruticeFootways,'5.107 Vrutice footway mesh audit must exist');
   assert(state.vruticeFootways.sealedCorners>=150,
    'Mapped Vrutice path corners should generate actual 3D wedges');
   assert(state.vruticeFootways.drawMeshes>=1,
    'Batch the Vrutice missing-corner geometry into real meshes');
   assert.equal(state.vruticeFootways.sourceAnchorId,'1303773811');
   assert.equal(state.vruticeFootways.syntheticNewWalkways,0);
   assert.equal(state.vruticeFootways.inventedZebraStripes,0);
   await page.waitForTimeout(5800);
   const visible=await page.evaluate(()=>
    window.__miloviceVruticeFootwayJoinRuntime?.());
   assert(visible?.checkedSceneParentChain,
    'Visibility must verify scene attachment, not a stale mesh flag');
   assert(visible.visibleMeshes>=1,
    'Vrutice pedestrian corner meshes disappeared after loading');
   assert(visible.visibleTriangles>=150,
    'No delayed visibility regression in Vrutice');
   assert.deepEqual(errors,[],'No delayed Vrutice JS errors');
  }
  assert(state.header.includes('hřiště')||state.header.includes('hřiště'.toUpperCase()));
  assert(state.label.length>0);
  assert.equal(state.links,33);
  assert.equal(state.sections,7);
  assert.equal(state.selected,view);
  assert.equal(state.compact,true);
  assert(state.canvasWidth>0);
  assert.equal(state.meta,state.hud);
  assert.deepEqual(errors,[],'No browser JS crashes');
  await page.screenshot({path:'browser-artifacts/milovice-playground-5103-'+view+'.png'});
  console.log('PASS 5.103 3D playground camera',JSON.stringify({
   view,sourceId:osmId,region,componentInstances:state.equipment.componentInstances,
   targetProjection:state.camera.targetProjection,
   cameraHeightAboveTerrain:state.camera.cameraHeightAboveTerrain
  }));
  await page.close();
 }
}finally{await browser.close()}
