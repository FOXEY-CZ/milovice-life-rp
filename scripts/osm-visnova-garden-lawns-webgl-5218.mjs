// Milovice RP 5.218 — mobile Chromium/SwiftShader WebGL scene:
// count real GPU instances/meshes after stream+LOD on 3 untouched OSM lawns.
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
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto(
  'http://127.0.0.1:8080/?v=521800&streetAudit=visnova-garden-lawns-5218',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-garden-lawns-5218'&&
   window.__miloviceVisnovaGardenLawnsRuntime5218?.()?.ready===true,
   null,{timeout:115000});
 }catch(err){
  throw Error('5.218 lawn render not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    garden:window.__miloviceVisnovaGardenLawnsRuntime5218?.(),
    previous:window.__miloviceVisnovaEastLawnsRuntime5212?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors='+JSON.stringify(errors)+' '+err);
 }
 await page.waitForTimeout(6500);
 const v=await page.evaluate(()=>window.__miloviceVisnovaGardenLawnsRuntime5218());
 assert(v?.ready,'instanced grass still linked to 3D scene '+JSON.stringify(v));
 assert.deepEqual(v.sourcePolygonIds,
  ['1460019798','1460019800','1460019801']);
 assert(v.tuftInstances>0&&v.tuftInstances<=195);
 assert(v.drawMeshes>=1&&v.drawMeshes<=3);
 assert.equal(v.attachedMeshes,v.drawMeshes);
 assert.equal(v.usesExistingInstancedLOD,true);
 assert.equal(v.worldSpaceTerrainClamped,true);
 assert.equal(v.sourceGeometryUnchanged,true);
 assert.equal(v.individualBladesPhotoVerified,false);
 for(const k of ['addedOSMGrassPolygons','addedTrees','addedShrubs',
  'addedRoads','addedFootways','addedColliders','addedNewParks'])
  assert.equal(v[k],0,k);
 assert.deepEqual(errors,[],'zero browser JavaScript exceptions');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-garden-lawns-5218-mobile.png'});
 console.log('PASS 5.218 actual mobile WebGL',
  v.tuftInstances,'OSM-clipped lawn tufts in',v.drawMeshes,
  'GPU instanced meshes, attached:',v.attachedMeshes,
  'visible after LOD:',v.visibleMeshesAfterLOD,
  'no new paths, trees, buildings, colliders');
}finally{await browser.close()}
