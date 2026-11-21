// 5.215: real mobile SwiftShader, existing SECOND walker follows original bends.
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
 await page.goto('http://127.0.0.1:8080/?v=521500&streetAudit=visnova-continuous-walker-5215',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-continuous-walker-5215'&&
   window.__miloviceVisnovaContinuousRuntime5215?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.215 three-edge real sidewalk not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,camera:window.__miloviceStreetAuditRendered,
    continuous:window.__miloviceVisnovaContinuousRuntime5215?.(),
    older:window.__miloviceVisnovaTwoWalkersRuntime5214?.(),
    pageError:document.getElementById('err')?.textContent
   })))+' JS errors '+JSON.stringify(errors)+' '+e);
 }
 const before=await page.evaluate(()=>window.__miloviceVisnovaContinuousRuntime5215());
 await page.waitForTimeout(6800);
 const after=await page.evaluate(()=>window.__miloviceVisnovaContinuousRuntime5215());
 assert(after?.ready,'one actor must remain on three real source edges '+JSON.stringify(after));
 assert.equal(after.actorCount,1,'second walker must be reused, NOT duplicated');
 assert.equal(after.sourceWayId,'1044078118');
 assert.deepEqual(after.originalOSMSegmentIndices,[0,1,2,3]);
 assert(after.walkableMetres>46&&after.walkableMetres<47);
 assert(after.minRoadAxisDistanceMetres>6.5);
 assert(after.minBuildingDistanceMetres>4);
 assert.equal(after.sceneAttached,true);
 assert.equal(after.visibleInScene,true);
 assert.equal(after.firstWalkerStillReady,true);
 assert(after.lateralMetres<.045&&after.terrainDifference<.075);
 assert(after.routeDistanceMetres>before.routeDistanceMetres+2,
  'real mobile movement along original continuous route '+JSON.stringify([before,after]));
 assert.equal(after.sourceSurfaceUnknown,true);
 assert.equal(after.originalOSMUnchanged,true);
 for(const k of ['addedNPCs','newPaths','newCrossings','newRoads','newColliders'])
  assert.equal(after[k],0,k);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-continuous-walker-5215-mobile.png'});
 console.log('PASS 5.215 original GPS 3-edge route; advanced',
  (after.routeDistanceMetres-before.routeDistanceMetres).toFixed(2),
  'm; one reused NPC and first walker, scene/LOD/DEM/clearance unchanged');
}finally{await browser.close()}
