// Milovice RP 5.220 actual mobile Chromium/SwiftShader WebGL proof.
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
 const page=await browser.newPage({
  viewport:{width:393,height:852},deviceScaleFactor:1,
  isMobile:true,hasTouch:true
 });
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=522000&streetAudit=visnova-estate-pavers-5220',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-estate-pavers-5220'&&
   window.__miloviceVisnovaEstatePaversRuntime5220?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.220 source-paved Višňová sidewalk scene not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    estate:window.__miloviceVisnovaEstatePaversRuntime5220?.(),
    prev:window.__miloviceVisnovaSevenFloorRuntime5219?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const v=await page.evaluate(()=>window.__miloviceVisnovaEstatePaversRuntime5220());
 assert(v?.ready,'both sidewalk source materials applied and loaded');
 assert.equal(v.version,'5.220');
 assert.deepEqual(v.sourceWayIds,['1005977571','1057549994']);
 assert.deepEqual(v.sourceHashes,['263e12b3','02767378']);
 assert(Math.abs(v.originalMappedMeters-371.635)<.2);
 assert.equal(v.sourceSegments,11);
 assert(v.paintedExistingSegments>=2,
  'real scene must paint original OSM paved ribbons');
 assert.equal(v.taggedMaterial,'visnova-tagged-paving-stones');
 assert.equal(v.existingRoadBatchMaterial,true);
 assert.equal(v.addedMeshAttached,true);
 assert(v.sealedCornerTriangles>=0&&v.sealedCornerTriangles<=3);
 assert(v.additionalMeshCount>=0&&v.additionalMeshCount<=1);
 if(v.additionalMeshCount)assert.equal(v.visibleAfterLOD,1);
 assert.equal(v.sourceRoadsAndFootwaysUnchanged,true);
 assert.equal(v.sidewalkWidthUnchanged,true);
 assert.equal(v.materialColourPhotoVerified,false);
 for(const k of ['newFootways','newRoads','newBuildings','newCrossings',
  'newColliders','newTrees','newKerbs','newTrafficSigns'])
  assert.equal(v[k],0,k);
 assert.deepEqual(errors,[],'zero runtime browser exceptions');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-estate-pavers-5220-mobile.png'});
 console.log('PASS 5.220 actual mobile WebGL original',
  v.originalMappedMeters,'m of two separately mapped paved sidewalks,',
  v.paintedExistingSegments,'painted OSM path pieces;',
  v.sealedCornerTriangles,'original bend wedges,',
  v.additionalMeshCount,'additional GPU mesh, 6.5s LOD stable');
}finally{await browser.close()}
