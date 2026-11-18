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
 await page.goto('http://127.0.0.1:8080/?v=516400&streetAudit=topolova-connected-5164',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-connected-5164'&&
   window.__miloviceTopolovaConnectedRuntime?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){throw Error('5.164 mapped junction never became ready '+JSON.stringify(
  await page.evaluate(()=>({
   loaded:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered,
   connected:window.__miloviceTopolovaConnectedRuntime?.(),
   spur:window.__miloviceTopolovaWalkersRuntime?.(),
   promenade:window.__miloviceTopolovaPromenadeRuntime?.(),
   error:document.getElementById('err')?.textContent
  })))+' '+JSON.stringify(errors)+' '+e)}
 const initial=await page.evaluate(()=>window.__miloviceTopolovaConnectedRuntime());
 await page.waitForTimeout(7500);
 const state=await page.evaluate(()=>({
  connected:window.__miloviceTopolovaConnectedRuntime?.(),
  spur:window.__miloviceTopolovaWalkersRuntime?.(),
  promenade:window.__miloviceTopolovaPromenadeRuntime?.(),
  roof:window.__miloviceTopolovaHipRuntime?.(),
  facade:window.__miloviceTopolovaInferredRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 const a=state.connected;
 assert.equal(a?.ready,true,JSON.stringify(a));
 assert.equal(a?.npcCount,1);
 assert.equal(a?.visibleInScene,1);
 assert.equal(a?.onSourceMappedRoute,true);
 assert.equal(a?.groundAligned,true);
 assert.equal(a?.joinedSourceWays,true);
 assert.equal(a?.sourceWayIdAtActor,'1316882852');
 assert(a?.junctionTransitions>=1,'Actor really moved off spur to the adjoining sidewalk');
 assert(a?.segmentIndex>=1);
 assert.equal(a?.newPavementMeshes,0);
 assert.equal(a?.createdCrossings,0);
 assert(Math.hypot(initial.x-a.x,initial.z-a.z)>1);
 assert(a?.routeDistance>initial.routeDistance);
 assert(state.spur?.ready&&state.promenade?.ready&&
  state.roof?.ready&&state.facade?.ready);
 assert(state.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-connected-5164-mobile.png'});
 console.log('PASS 5.164 mobile Chromium +7.5s: one NPC crossed a REAL OSM footway junction without teleport, no new street meshes; all 5.162/5.163 pedestrians and 5.160/5.161 building regressions ready');
}finally{await browser.close()}
