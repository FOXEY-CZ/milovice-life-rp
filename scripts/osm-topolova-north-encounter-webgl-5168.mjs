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
 await page.goto('http://127.0.0.1:8080/?v=516800&streetAudit=topolova-north-encounter-5168&encounterTest=1',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-north-encounter-5168'&&
   window.__miloviceTopolovaNorthEncounterRuntime?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('North 5.168 never ready: '+JSON.stringify(await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered,
   north:window.__miloviceTopolovaNorthEncounterRuntime?.(),
   error:document.getElementById('err')?.textContent
  })))+' pageerrors='+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(7000); // includes mobile renderer LOD transition
 try{
  await page.waitForFunction(()=>{
   const r=window.__miloviceTopolovaNorthEncounterRuntime?.();
   return r?.ready===true&&r.testCarCount===2&&
    r.walkerWaitFrames>0&&r.crossedToEast===true&&
    r.cars?.length===2&&r.cars.every(c=>
     c.yieldFrames>0&&c.reachedStop===true&&
     c.resumedAfterCrossing===true&&c.violation===false&&
     c.minAheadDuringCrossing>=3.45);
  },null,{timeout:135000});
 }catch(e){
  throw Error('Real two-car north crossing incomplete: '+
   JSON.stringify(await page.evaluate(()=>
    window.__miloviceTopolovaNorthEncounterRuntime?.()))+
   ' pageerrors='+JSON.stringify(errors)+' '+e);
 }
 const snapshot=await page.evaluate(()=>({
  north:window.__miloviceTopolovaNorthEncounterRuntime?.(),
  priority:window.__miloviceTopolovaPriorityRuntime?.(),
  loop:window.__miloviceTopolovaLoopRuntime?.(),
  old:window.__miloviceTopolovaConnectedRuntime?.(),
  roof:window.__miloviceTopolovaHipRuntime?.(),
  facade:window.__miloviceTopolovaInferredRuntime?.(),
  compactHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 const r=snapshot.north;
 assert.equal(r.ready,true);
 assert.equal(r.testCarCount,2);
 assert.deepEqual(r.cars.map(c=>c.direction),[1,-1]);
 assert.deepEqual(r.cars.map(c=>c.roadSegmentIndex),[1,2]);
 assert.equal(r.sourceRoadId,'8618275');
 assert.equal(r.sourceCrossingId,'1316882853');
 assert.equal(r.walkerGroundAligned,true);
 assert.equal(r.actorTestStartRepositioned,true);
 assert.equal(r.walkerStartOnWest,true);
 assert.equal(r.crossedToEast,true);
 assert(r.walkerWaitFrames>0);
 assert(r.cars.every(c=>c.reachedStop&&c.resumedAfterCrossing&&
  c.minAheadDuringCrossing>=3.45&&!c.violation&&c.visibleInScene));
 assert(r.newRoads===0&&r.newCrossings===0);
 assert(snapshot.priority?.ready&&snapshot.loop?.ready&&
  snapshot.old?.ready&&snapshot.roof?.ready&&snapshot.facade?.ready);
 assert(snapshot.compactHeight<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-north-encounter-5168-mobile.png'});
 console.log('PASS 5.168 mobile WebGL +7s LOD: both opposite real AI cars yielded to pedestrian on north OSM zebra, original walker waited/crossed onto east pavement and both cars resumed; zero car buffer violations');
}finally{await browser.close()}
