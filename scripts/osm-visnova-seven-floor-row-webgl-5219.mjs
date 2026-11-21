// Milovice RP 5.219 mobile Chromium/SwiftShader 3D scene regression.
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
 await page.goto('http://127.0.0.1:8080/?v=521900&streetAudit=visnova-seven-floor-row-5219',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-seven-floor-row-5219'&&
   window.__miloviceVisnovaSevenFloorRuntime5219?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.219 three 7-floor real OSM buildings not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    row:window.__miloviceVisnovaSevenFloorRuntime5219?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const x=await page.evaluate(()=>window.__miloviceVisnovaSevenFloorRuntime5219());
 assert(x?.ready,'3D source facades must survive region LOD');
 assert.equal(x.version,'5.219');
 assert.deepEqual(x.sourceBuildingIds,['53865704','53865910','53865911']);
 assert.equal(x.originalMappedFloorsPerBuilding,7);
 assert.equal(x.originalMappedFlatsPerBuilding,48);
 assert.equal(x.estimatedFacadeWindowCount,504);
 assert.equal(x.renderedFacadeEdges,12);
 assert.equal(x.meshCount,12);
 assert.equal(x.triangles,7080);
 assert.equal(x.buildings.length,3);
 for(const b of x.buildings){
  assert.equal(b.floors,7);
  assert.equal(b.modelWindowCount,168);
  assert.equal(b.modelFacadeEdges,4);
  assert.equal(b.originalPlinthEdges,4);
  assert.equal(b.meshCount,4);
  assert.equal(b.triangles,2360);
  assert.equal(b.inScene,true);
  assert.equal(b.visibleMeshes,4);
  assert.equal(b.exactWindowPlacementPhotoVerified,false);
 }
 assert.equal(x.photoVerifiedWindowLayout,false);
 assert.equal(x.originalBuildingVolumesRetained,true);
 assert.equal(x.originalRoofShapesRetained,true);
 for(const k of ['changedOSMFootprints','addedNewBuildings','addedRoads',
  'addedFootways','addedEntrances','addedBalconies',
  'addedColliders','changedRoofGeometry'])assert.equal(x[k],0,k);
 assert.deepEqual(errors,[],'no browser JavaScript errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-seven-floor-row-5219-mobile.png'});
 console.log('PASS 5.219 real mobile WebGL 3 RÚIAN Višňová apartment blocks,',
  x.estimatedFacadeWindowCount,'model windows on',x.renderedFacadeEdges,
  'original walls in',x.meshCount,'meshes (',x.triangles,
  'triangles), attached+LOD after 6.5s, roads/roofs/collisions unchanged');
}finally{await browser.close()}
