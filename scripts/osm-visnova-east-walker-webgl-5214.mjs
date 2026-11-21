// 5.214 — actual mobile Chromium/WebGL verifies TWO simulated walkers
// move on two independently mapped OSM sidewalk segments after mobile LOD.
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
 await page.goto('http://127.0.0.1:8080/?v=521400&streetAudit=visnova-two-walkers-5214',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-two-walkers-5214'&&
   window.__miloviceVisnovaTwoWalkersRuntime5214?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.214 actual original Višňová sidewalk pair not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    twoWalkers:window.__miloviceVisnovaTwoWalkersRuntime5214?.(),
    olderWalker:window.__miloviceVisnovaSidewalkWalkerRuntime5213?.(),
    pageError:document.getElementById('err')?.textContent
   })))+' JS errors '+JSON.stringify(errors)+' '+e);
 }
 const before=await page.evaluate(()=>window.__miloviceVisnovaTwoWalkersRuntime5214());
 await page.waitForTimeout(6500);
 const after=await page.evaluate(()=>window.__miloviceVisnovaTwoWalkersRuntime5214());
 assert(after?.ready,'Both should be on original OSM paths: '+JSON.stringify(after));
 assert.equal(after.walkerCount,2);
 assert.equal(after.firstSourceWayId,'1044078124');
 assert.equal(after.secondSourceWayId,'1044078118');
 assert.equal(after.firstVisible,1,'Original walker must remain visible after LOD');
 assert.equal(after.secondVisible,1,'New NPC must remain visible after LOD');
 assert.equal(after.secondSceneAttached,true);
 assert.equal(after.onMappedSidewalk,true);
 assert(after.terrainDifference<.075);
 assert(after.secondMinRoadAxisDistanceMetres>6.5);
 assert(after.secondMinBuildingDistanceMetres>4);
 assert(after.secondWalkableMetres>23&&after.secondWalkableMetres<24);
 assert(after.secondProgress>0&&after.secondProgress<1);
 const moved=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
 const firstMoved=moved(before.firstPosition,after.firstPosition);
 const secondMoved=moved(before.secondPosition,after.secondPosition);
 assert(firstMoved>2.0,'Original 5.213 NPC should continue walking; moved '+firstMoved);
 assert(secondMoved>2.0,'New 5.214 NPC must really move; moved '+secondMoved);
 assert.equal(after.photosOfPeopleNotVerified,true);
 assert.equal(after.sourceMaterialNotInvented,true);
 assert.equal(after.originalOSMUnchanged,true);
 for(const k of ['newSidewalks','newCrossings','newRoads','newColliders'])
  assert.equal(after[k],0,k);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-two-walkers-5214-mobile.png'});
 console.log('PASS 5.214 two simulated OSM sidewalk pedestrians: first walked',
  firstMoved.toFixed(2),'m, second walked',secondMoved.toFixed(2),
  'm in 6.5s; scene/terrain/LOD/zero invented paths validated');
}finally{await browser.close()}
