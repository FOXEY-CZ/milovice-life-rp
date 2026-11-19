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
 await page.goto('http://127.0.0.1:8080/?v=516700&streetAudit=topolova-encounter-5167&encounterTest=1',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-encounter-5167'&&
   window.__miloviceTopolovaEncounterRuntime?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('Encounter 5.167 never ready '+JSON.stringify(
   await page.evaluate(()=>({
    area:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    encounter:window.__miloviceTopolovaEncounterRuntime?.(),
    error:document.getElementById('err')?.textContent
   })))+' '+errors+' '+e);
 }
 await page.waitForTimeout(6500); // after delayed LOD switch
 const before=await page.evaluate(()=>window.__miloviceTopolovaEncounterRuntime());
 // DO NOT assume fixed wall clock = fixed animated distance on mobile GPU.
 // Wait for observed actual AI/car-person interaction on the real 3D scene.
 try{
  await page.waitForFunction(()=>{
   const e=window.__miloviceTopolovaEncounterRuntime?.();
   return e?.ready&&e.walkerWaitFrames>0&&e.carYieldFrames>0&&
    e.stoppedBeforeCrossing&&e.crossedToWest&&e.carResumedAfterCrossing;
  },null,{timeout:100000});
 }catch(e){
  throw Error('AI did not complete car-yield/walker-cross/live-resume cycle: '+
   JSON.stringify(await page.evaluate(()=>
    window.__miloviceTopolovaEncounterRuntime?.()))+' '+errors+' '+e);
 }
 const after=await page.evaluate(()=>({
  encounter:window.__miloviceTopolovaEncounterRuntime?.(),
  priority:window.__miloviceTopolovaPriorityRuntime?.(),
  loop:window.__miloviceTopolovaLoopRuntime?.(),
  old:window.__miloviceTopolovaConnectedRuntime?.(),
  roof:window.__miloviceTopolovaHipRuntime?.(),
  facade:window.__miloviceTopolovaInferredRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 const a=after.encounter;
 assert.equal(a?.ready,true,JSON.stringify(a));
 assert.equal(a?.sourceRoadId,'8618275');
 assert.equal(a?.sourceCrossingId,'1316882854');
 assert.equal(a?.testCarCount,1);
 assert(a?.walkerWaitFrames>0,'actual walker had to wait at original curb');
 assert(a?.carYieldFrames>0,'actual AI car used yield controller');
 assert.equal(a?.stoppedBeforeCrossing,true);
 assert.equal(a?.crossedToWest,true);
 assert.equal(a?.carResumedAfterCrossing,true);
 assert.equal(a?.crossingViolation,false,'car crossed painted zebra while walker present');
 assert(a?.minCarAheadDuringCrossing>=3.45,'vehicle never passed model buffer during crossing');
 assert.equal(a?.newRoads,0);
 assert.equal(a?.newCrossings,0);
 assert.equal(a?.walkerGroundAligned,true);
 assert.equal(a?.carVisibleInScene,true);
 assert(after.priority?.ready&&after.loop?.ready&&
  after.old?.ready&&after.roof?.ready&&after.facade?.ready);
 assert(after.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-encounter-5167-mobile.png'});
 console.log('PASS 5.167 mobile Chromium: real AI car slowed/stopped for mapped zebra, original NPC waited/crossed, AI car resumed, no violation; >6.5s LOD');
}finally{await browser.close()}
