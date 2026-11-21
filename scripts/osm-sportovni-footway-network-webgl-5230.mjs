// 5.230 real Chromium mobile SwiftShader 3D road-safe OSM network.
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
  'http://127.0.0.1:8080/?v=523000&streetAudit=sportovni-footway-network-5230',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='sportovni-footway-network-5230'&&
   window.__miloviceSportovniFootwayRuntime5230?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.230 original footways not ready '+JSON.stringify(
   await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    footways:window.__miloviceSportovniFootwayRuntime5230?.(),
    err:document.getElementById('err')?.textContent
   })))+' JS errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const x=await page.evaluate(()=>window.__miloviceSportovniFootwayRuntime5230());
 assert.equal(x.ready,true);assert.equal(x.version,'5.230');
 assert.deepEqual(x.sourceWayIds,['1037952219','1352859039','1460019771']);
 assert.deepEqual(x.sourceRoadIds,['1331897633','1037952217','1037952218']);
 assert.equal(x.sourceSegments,13);
 assert.equal(x.processedSourceEdges,13);
 assert.equal(x.sourceEdgeSafetyAudit.length,13);
 assert.equal(x.sourceFootwayMeters,111.298);
 assert(x.renderedSafePieces>0,'safe original pedestrian pieces are drawn');
 assert.equal(x.unclassifiedSourceEdges,0);
 assert.equal(x.encounteredSourceIds.length,6);
 assert.equal(x.neutralMaterialAvailable,true);
 assert.equal(x.roadJunctionsAreNotMappedCrosswalks,true);
 assert.equal(x.drawnSourceEdges+x.guardedSourceEdges+
  x.duplicateSourceEdges+x.unclassifiedSourceEdges,13);
 for(const k of ['newFootways','newCrossings','newZebraStripes','newRoads',
 'newColliders','newBuildings','newKerbs','newEntrances','newStreetFurniture','newVehicleRules'])
  assert.equal(x[k],0,k);
 assert.deepEqual(errors,[],'no errors in mobile scene after 6.5s LOD');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/sportovni-footway-network-5230-mobile.png'});
 console.log('PASS 5.230 real mobile OSM GPS 111.298m 13 source edges, safety-clipped surfaces and LOD stable');
}finally{await browser.close()}
