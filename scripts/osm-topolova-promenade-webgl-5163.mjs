import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,
 args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
 '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1,
  isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=516300&streetAudit=topolova-promenade-5163',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-promenade-5163'&&
   window.__miloviceTopolovaPromenadeRuntime?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){throw Error('5.163 promenade never became ready: '+JSON.stringify(
  await page.evaluate(()=>({areas:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered,
   promenade:window.__miloviceTopolovaPromenadeRuntime?.(),
   old:window.__miloviceTopolovaWalkersRuntime?.(),
   text:document.getElementById('err')?.textContent})))+' '+JSON.stringify(errors)+' '+e)}
 const initial=await page.evaluate(()=>window.__miloviceTopolovaPromenadeRuntime());
 await page.waitForTimeout(7250);
 const snapshot=await page.evaluate(()=>({
  promenade:window.__miloviceTopolovaPromenadeRuntime?.(),
  spur:window.__miloviceTopolovaWalkersRuntime?.(),
  row:window.__miloviceTopolovaRowRuntime?.(),
  hip:window.__miloviceTopolovaHipRuntime?.(),
  inferred:window.__miloviceTopolovaInferredRuntime?.(),
  drawing:window.__miloviceTopolovaDrawingRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 const a=snapshot.promenade;
 assert.equal(a?.ready,true,JSON.stringify(a));
 assert.equal(a?.walkerCount,2);
 assert.equal(a?.visibleInScene,2);
 assert.equal(a?.onMappedSidewalk,2);
 assert.equal(a?.terrainAligned,2);
 assert.equal(a?.trafficCrossings,0);
 assert.equal(a?.createdNewFootways,0);
 assert.equal(a?.createdPedestrianCrossings,0);
 assert(a?.positions.every(p=>p.mappedTrackMetres>=3.95&&
  p.mappedTrackMetres<=a.originalMetres-3.95));
 assert(initial?.positions.every((p,i)=>Math.hypot(
  p.x-a.positions[i].x,p.z-a.positions[i].z)>1.1),'both people actually moved');
 assert(snapshot.spur?.ready,'existing 5.162 short-spur walkers still work');
 assert(snapshot.row?.ready&&snapshot.hip?.ready&&
  snapshot.inferred?.ready&&snapshot.drawing?.ready);
 assert(snapshot.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-promenade-5163-mobile.png'});
 console.log('PASS 5.163 mobile WebGL +7.25s LOD: 2 dynamic NPCs on real 102.5m sidewalk, preserved previous spur + roofs/facades');
}finally{await browser.close()}
