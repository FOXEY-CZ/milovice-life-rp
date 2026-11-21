// 5.228 actual mobile Chromium/SwiftShader 3D and LOD validation.
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
 await page.goto(
  'http://127.0.0.1:8080/?v=522800&streetAudit=visnova-long-sidewalk-5228',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-long-sidewalk-5228'&&
   window.__miloviceVisnovaLongRuntime5228?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  const snapshot=await page.evaluate(()=>({
   loaded:window.__miloviceAreasLoaded,
   view:window.__miloviceStreetAuditRendered,
   long:window.__miloviceVisnovaLongRuntime5228?.(),
   west:window.__miloviceVisnovaEstatePaversAudit5220,
   east:window.__miloviceVisnovaTaggedPaversRuntime5204,
   err:document.getElementById('err')?.textContent
  }));
  throw Error('5.228 source-locked sidewalk failed readiness '+
   JSON.stringify(snapshot)+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const x=await page.evaluate(()=>window.__miloviceVisnovaLongRuntime5228());
 assert.equal(x.ready,true);
 assert.equal(x.version,'5.228');
 assert.deepEqual(x.sourceWayIds,['1044078118','1005977571','1044078121']);
 assert.deepEqual(x.sourceHashes,['26506719','263e12b3','4dc63734']);
 assert.equal(x.neutralWayId,'1044078118');
 assert.equal(x.neutralOriginalSegments,10);
 assert.equal(x.processedSourceEdges,10,
  'all ten original GPS edges must be processed');
 // Carriageway clearance deliberately removes four unsafe visual strips.
 // Do not force-render OSM centreline pavement into mapped vehicle lanes.
 assert.equal(x.renderedOriginalSegments,6);
 assert.equal(x.sourceEdgeSafetyAudit.length,10);
 assert.equal(x.unclassifiedSourceEdges,0,'every unpainted source edge must be explained');
 assert(x.drawnSourceEdges>0&&x.drawnSourceEdges<=6);
 assert.equal(x.drawnSourceEdges+x.fullyGuardedSourceEdges+
  x.duplicateSourceEdges+x.unclassifiedSourceEdges,10);
 for(const a of x.sourceEdgeSafetyAudit)
  assert(['drawn-safe-piece','carriageway-guard','deduped'].includes(a.outcome));
 assert(x.sourceEdgeSafetyAudit.every((a,i)=>a.edgeIndex===i+1));

 assert.equal(x.neutralOriginalMeters,199.405);
 assert.equal(x.originalNetworkSegments,19);
 assert.equal(x.originalNetworkMeters,532.650);
 assert.equal(x.neutralMaterial,'visnova-footway-model');
 assert.equal(x.neutralMaterialAvailable,true);
 assert.equal(x.westPaversLoaded,true);
 assert.equal(x.eastPaversLoaded,true);
 assert.equal(x.pavedSourceSurface,'paving_stones');
 assert.equal(x.actualNeutralSurfaceUnknown,true);
 assert.equal(x.encounteredSourceIds.length,3);
 for(const k of ['newFootways','newCrossings','newRoads','newZebras',
  'newBuildings','newColliders','newKerbs','newEntrances','newStreetFurniture'])
  assert.equal(x[k],0,k);
 assert.deepEqual(errors,[],'no JS page errors after LOD');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-long-sidewalk-5228-mobile.png'});
 console.log('PASS 5.228 mobile WebGL: 10 original source edges, 6 safety-clipped rendered strips, two exact tagged-paver joins, LOD stable');
}finally{await browser.close()}
