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
 await page.goto('http://127.0.0.1:8080/?v=516500&streetAudit=topolova-loop-5165',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-loop-5165'&&
   window.__miloviceTopolovaLoopRuntime?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){throw Error('5.165 mapped loop not ready: '+JSON.stringify(
  await page.evaluate(()=>({loaded:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered,
   loop:window.__miloviceTopolovaLoopRuntime?.(),
   previous:window.__miloviceTopolovaConnectedRuntime?.(),
   err:document.getElementById('err')?.textContent})))+
   ' errors '+JSON.stringify(errors)+' '+e)}
 await page.waitForTimeout(8500);
 const state=await page.evaluate(()=>({
  loop:window.__miloviceTopolovaLoopRuntime?.(),
  connected:window.__miloviceTopolovaConnectedRuntime?.(),
  promenade:window.__miloviceTopolovaPromenadeRuntime?.(),
  walkers:window.__miloviceTopolovaWalkersRuntime?.(),
  roof:window.__miloviceTopolovaHipRuntime?.(),
  facade:window.__miloviceTopolovaInferredRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 const a=state.loop;
 assert.equal(a?.ready,true,JSON.stringify(a));
 assert.equal(a?.npcCount,1);
 assert.equal(a?.visibleInScene,1);
 assert.equal(a?.groundAligned,true);
 assert.equal(a?.onMappedSource,true);
 assert(a?.crossingsEntered>=1,'NPC entered genuine southern zebra');
 assert.equal(a?.sourceWayIdAtActor,'1314665579',
  'Crossed southern mapped zebra and continued on west pavement');
 assert.equal(a?.isCrossing,false);
 assert(a?.distanceMoved>10);
 assert.equal(a?.createdCrossings,0);
 assert.equal(a?.createdFootways,0);
 assert(state.connected?.ready&&state.promenade?.ready&&
  state.walkers?.ready&&state.roof?.ready&&state.facade?.ready);
 assert(state.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-loop-5165-mobile.png'});
 console.log('PASS 5.165 mobile WebGL +8.5s: south zebra crossed, west sidewalk reached, old NPCs+buildings+LOD preserved');
}finally{await browser.close()}
