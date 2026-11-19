import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:
 process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,
 args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=516600&streetAudit=topolova-priority-5166',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-priority-5166'&&
   window.__miloviceTopolovaPriorityRuntime?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.166 runtime never ready: '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    state:window.__miloviceTopolovaPriorityRuntime?.(),
    error:document.getElementById('err')?.textContent
   })))+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(8500);
 const snapshot=await page.evaluate(()=>({
  priority:window.__miloviceTopolovaPriorityRuntime?.(),
  loop:window.__miloviceTopolovaLoopRuntime?.(),
  connected:window.__miloviceTopolovaConnectedRuntime?.(),
  roof:window.__miloviceTopolovaHipRuntime?.(),
  inferred:window.__miloviceTopolovaInferredRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 const a=snapshot.priority;
 assert.equal(a?.ready,true,JSON.stringify(a));
 assert.equal(a?.newRoads,0);
 assert.equal(a?.newCrossings,0);
 assert.equal(a?.playerCarNotAutomaticallyBraked,true);
 assert.deepEqual(a?.sourceCrossingIDs,['1316882854','1316882853']);
 assert.equal(a?.controlRoadSegments,3);
 assert.equal(a?.groundAligned,true);
 assert(a?.distanceMoved>0,'NPC simulated walk continues when safe');
 assert(snapshot.loop?.ready&&snapshot.connected?.ready&&
  snapshot.roof?.ready&&snapshot.inferred?.ready);
 assert(snapshot.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-priority-5166-mobile.png'});
 console.log('PASS 5.166 mobile WebGL +8.5s: source-locked two-zebra priority controller, simulated walker, older buildings and pedestrian routes');
}finally{await browser.close()}
