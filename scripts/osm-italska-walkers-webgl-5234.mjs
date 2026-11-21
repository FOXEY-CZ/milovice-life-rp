// 5.234 real mobile WebGL: both mapped pedestrian NPCs move and survive LOD.
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
 await page.goto('http://127.0.0.1:8080/?v=523400&streetAudit=italska-walkers-5234',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='italska-walkers-5234'&&
   window.__miloviceItalskaWalkersRuntime5234?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.234 walkers not ready '+
   JSON.stringify(await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    walkers:window.__miloviceItalskaWalkersRuntime5234?.(),
    err:document.getElementById('err')?.textContent
   })))+' JS errors '+JSON.stringify(errors)+' '+e);
 }
 const before=await page.evaluate(()=>window.__miloviceItalskaWalkersRuntime5234());
 await page.waitForTimeout(6500);
 const after=await page.evaluate(()=>window.__miloviceItalskaWalkersRuntime5234());
 assert(after.ready,'two model walkers stay visible after 6.5s LOD');
 assert.equal(after.actorCount,2);
 assert.deepEqual(after.sourceRouteIds,['1484073945','1484073947']);
 assert(after.totalWalkableMetres>202&&after.totalWalkableMetres<203);
 assert(after.actors.every(a=>a.attached&&a.visibleAfterLOD&&
  a.onOriginalSegment&&a.terrainDifference<.08));
 assert(after.actors.every(a=>a.minRoadAxisMetres>=a.requiredRoadMin&&
  a.minBuildingMetres>=a.requiredBuildingMin));
 assert(before.actors.every((a,i)=>Math.hypot(
  after.actors[i].x-a.x,after.actors[i].z-a.z)>.8),
  'both actors genuinely advance over real map paths');
 assert(after.noUnmarkedCrossingsEntered);
 for(const k of ['newFootways','newCrossings','newZebras','newColliders',
  'newBuildings','newParking','newStreetFurniture'])assert.equal(after[k],0);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-walkers-5234-mobile.png'});
 console.log('PASS 5.234 real mobile WebGL: two moving original sidewalk NPCs with clearances and LOD');
}finally{await browser.close()}
