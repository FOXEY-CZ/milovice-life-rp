// 5.226 actual mobile Chromium/SwiftShader 3D scene + LOD test.
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
 await page.goto('http://127.0.0.1:8080/?v=522600&streetAudit=lesni-footway-branches-5226',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='lesni-footway-branches-5226'&&
   window.__miloviceLesniBranchesRuntime5226?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.226 source-locked Lesní footways not ready '+JSON.stringify(
   await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    branches:window.__miloviceLesniBranchesRuntime5226?.(),
    prior:window.__miloviceLesniWalkChainRuntime5225?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const x=await page.evaluate(()=>window.__miloviceLesniBranchesRuntime5226());
 assert.equal(x.ready,true);
 assert.equal(x.version,'5.226');
 assert.deepEqual(x.sourceWayIds,
  ['1352859035','1352859040','1352859041','1057549994']);
 assert.equal(x.sourceRoadId,'1044078106');
 assert.equal(x.originalFootwaySegments,11);
 assert.equal(x.originalFootwayMeters,127.020);
 assert.equal(x.neutralOriginalMeters,56.555);
 assert.equal(x.neutralSourceSegments,6);
 assert.equal(x.neutralMaterial,'visnova-footway-model');
 assert.equal(x.neutralSurfaceIsUntagged,true);
 assert.equal(x.pavedSourceSurface,'paving_stones');
 assert.equal(x.pavedAnchorLoaded,true);
 assert.equal(x.neutralMaterialAvailable,true);
 assert.deepEqual(x.encounteredNeutralIds,
  ['1352859035','1352859040','1352859041']);
 assert(x.paintedNeutralPieces>0,'existing footway strips actually painted');
 assert.equal(x.originalPedestrianConnections,true);
 assert.equal(x.realRoadJunctionsConfirmed,true);
 assert.equal(x.originalBendNode,3);
 assert(x.originalBendTriangles>=0&&x.originalBendTriangles<=1);
 assert(x.additionalMeshCount>=0&&x.additionalMeshCount<=1);
 assert.equal(x.additionalMeshCount,x.originalBendTriangles);
 assert.equal(x.addedMeshAttached,true);
 if(x.additionalMeshCount)assert.equal(x.visibleAfterLOD,1);
 for(const k of ['addedRoads','addedFootways','addedRoadCrossings',
  'inventedZebraStripes','addedBuildings','addedColliders',
  'addedTrees','addedKerbs','addedEntrances'])assert.equal(x[k],0,k);
 assert.deepEqual(errors,[],'no JS errors in actual mobile browser');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/lesni-footway-branches-5226-mobile.png'});
 console.log('PASS 5.226 actual mobile 3D scene 127.020m OSM footway graph,',
  x.paintedNeutralPieces,'neutral footway rendered pieces,',
  x.originalBendTriangles,'source bend triangles,',
  'two road joins, LOD stable and zero fabricated paths');
}finally{await browser.close()}
