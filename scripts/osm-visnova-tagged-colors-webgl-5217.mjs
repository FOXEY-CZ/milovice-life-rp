// Milovice RP 5.217: actual mobile Chrome/SwiftShader on source-colored
// three-level original OSM Višňová building. No extra objects or collisions.
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
 await page.goto('http://127.0.0.1:8080/?v=521700&streetAudit=visnova-tagged-colors-5217',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-tagged-colors-5217'&&
   window.__miloviceVisnovaTaggedColorRuntime5217?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.217 source-colored Višňová building not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    mapped:window.__miloviceVisnovaTaggedColorRuntime5217?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const v=await page.evaluate(()=>window.__miloviceVisnovaTaggedColorRuntime5217());
 assert(v?.ready,'source materials must survive long LOD '+JSON.stringify(v));
 assert.equal(v.sourceBuildingId,'1456361921');
 assert.equal(v.sourceGeometryHash,'28e92fa9');
 assert.equal(v.originalMappedLevels,3);
 assert.equal(v.actuallyMappedFloors,3);
 assert.equal(v.actualWallColour,'#fec700');
 assert.equal(v.actualRoofColour,'#583400');
 assert(v.wallMeshes>=1&&v.roofMeshes>=1);
 assert.equal(v.wallVisibleAfterLOD,true);
 assert.equal(v.roofVisibleAfterLOD,true);
 assert.equal(v.buildingRegistered,true);
 assert.equal(v.originalExteriorShellRetained,true);
 assert.equal(v.originalRoofFormRetained,true);
 assert.equal(v.originalPlayerColliderRetained,true);
 assert.equal(v.roofShapeNotSpecifiedByOSM,true);
 assert.equal(v.architecturalAppearanceNotPhotographed,true);
 for(const k of ['addedMeshes','addedColliders','changedOSMCoordinates',
  'newBuildings','newRoofGeometry','newFacades','newRoads',
  'newFootways','newLandscape'])assert.equal(v[k],0,k);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-tagged-colors-5217-mobile.png'});
 console.log('PASS 5.217 actual mobile WebGL 3-storey real OSM building,',
  v.wallMeshes,'wall and',v.roofMeshes,'roof material meshes:',
  v.actualWallColour,v.actualRoofColour,
  'visible after 6.5s; original structure/LOD/collision');
}finally{await browser.close()}
