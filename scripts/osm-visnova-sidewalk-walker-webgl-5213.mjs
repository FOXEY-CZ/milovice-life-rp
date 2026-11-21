// 5.213: real mobile/WebGL after LOD, one animated pedestrian ON source OSM.
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
 await page.goto('http://127.0.0.1:8080/?v=521300&streetAudit=visnova-sidewalk-walker-5213',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-sidewalk-walker-5213'&&
   window.__miloviceVisnovaSidewalkWalkerRuntime5213?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.213 mapped Višňová walker not loaded '+JSON.stringify(
   await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    walker:window.__miloviceVisnovaSidewalkWalkerRuntime5213?.(),
    gameError:document.getElementById('err')?.textContent})))+
   ' JS errors '+JSON.stringify(errors)+' '+e);
 }
 const initial=await page.evaluate(()=>window.__miloviceVisnovaSidewalkWalkerRuntime5213());
 await page.waitForTimeout(6500);
 const after=await page.evaluate(()=>window.__miloviceVisnovaSidewalkWalkerRuntime5213());
 assert(after?.ready,JSON.stringify(after));
 assert.equal(after.npcCount,1);
 assert.equal(after.sourceWayId,'1044078124');
 assert.equal(after.sourceSegmentIndex,1);
 assert.equal(after.sceneAttached,true);
 assert.equal(after.visibleInScene,1,'NPC must stay visible from audited original OSM camera after 6.5s');
 assert.equal(after.onSourceSidewalk,true);
 assert(after.terrainDelta<.075);
 assert(after.minimumRoadCentreDistanceMetres>=6.5);
 assert(after.minimumBuildingDistanceMetres>=3.5);
 assert(after.walkableSegmentMetres>44&&after.walkableSegmentMetres<45);
 assert(after.progress>0&&after.progress<1);
 assert(Math.hypot(initial.position.x-after.position.x,
  initial.position.z-after.position.z)>2.4,
  'NPC must actually walk between screenshots, not stand motionless');
 assert.equal(after.actualPersonPositionPhotographed,false);
 assert.equal(after.originalOSMUnchanged,true);
 for(const key of ['newSidewalkMeshes','newRoads','newCrossings','newColliders'])
  assert.equal(after[key],0,key);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-walker-5213-mobile.png'});
 console.log('PASS 5.213 mobile WebGL: real sidewalk walker moved',
  Math.hypot(initial.position.x-after.position.x,
   initial.position.z-after.position.z).toFixed(2),
  'm, within OSM footway, after 6.5s LOD; no invented roads/crossings');
}finally{await browser.close()}
