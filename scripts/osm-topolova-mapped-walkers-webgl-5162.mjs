import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=516200&streetAudit=topolova-walkers-5162',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-walkers-5162'&&
   window.__miloviceTopolovaWalkersRuntime?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){throw Error('5.162 mapped pedestrian spawns not ready '+JSON.stringify(
  await page.evaluate(()=>({loaded:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered,
   pedestrians:window.__miloviceTopolovaWalkersRuntime?.(),
   row:window.__miloviceTopolovaRowRuntime?.(),
   gameError:document.getElementById('err')?.textContent})))+
   ' '+JSON.stringify(errors)+' '+e)}
 const initial=await page.evaluate(()=>window.__miloviceTopolovaWalkersRuntime?.());
 await page.waitForTimeout(7350);
 const snapshot=await page.evaluate(()=>({
  pedestrians:window.__miloviceTopolovaWalkersRuntime?.(),
  row:window.__miloviceTopolovaRowRuntime?.(),
  hip:window.__miloviceTopolovaHipRuntime?.(),
  inferred:window.__miloviceTopolovaInferredRuntime?.(),
  drawing:window.__miloviceTopolovaDrawingRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 const a=snapshot.pedestrians;
 assert(a?.ready,JSON.stringify(a));
 assert.equal(a?.walkerCount,2);
 assert.equal(a?.visibleInScene,2);
 assert.equal(a?.onSourceFootway,2);
 assert.equal(a?.gradeCorrect,2);
 assert.equal(a?.illegalRoadCrossings,0);
 assert.equal(a?.newSidewalkMeshes,0);
 assert(a?.positions.every(p=>p.metresFromRoadEndpoint>=1.9&&
  p.metresFromRoadEndpoint<=28));
 assert(initial?.positions.every((p,i)=>Math.hypot(
  p.x-a.positions[i].x,p.z-a.positions[i].z)>.6));
 assert(snapshot.row?.ready&&snapshot.hip?.ready&&
  snapshot.inferred?.ready&&snapshot.drawing?.ready);
 assert(snapshot.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-walkers-5162-mobile.png'});
 console.log('PASS 5.162 mobile Chromium after 7.35s: 2 pedestrians visibly walking OSM footway, dynamic positions, correct DEM, no road crossing');
}finally{await browser.close()}
