// Opt-in 5.259: observe actual animated NPC meshes at the two mapped arms.
// No traffic-law assertions and no claim of physical collision safety.
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
  isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',error=>errors.push(String(error.stack||error)));
 await page.goto('http://127.0.0.1:8080/?v=526100&streetAudit=italska-road-footway-5252&npcAudit=italska-encounter-5259',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceItalskaNpcEncounterRuntime5259?.()?.ready===true&&
   window.__miloviceStreetAuditRendered?.view==='italska-road-footway-5252',
   null,{timeout:120000});
 }catch(error){
  const state=await page.evaluate(()=>({
   scene:window.__miloviceItalskaNpcEncounterRuntime5259?.(),
   guard:window.__miloviceItalskaJunctionConflictRuntime5258?.(),
   loaded:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered?.view,
   status:document.getElementById('status')?.textContent
  }));
  throw new Error('5.259 real-NPC audit failed to initialize: '+
   JSON.stringify({state,pageErrors:errors,original:String(error)}));
 }
 await page.waitForTimeout(2300);
 const screenshotState=await page.evaluate(()=>({
  audit:window.__miloviceItalskaNpcEncounterRuntime5259?.(),
  cameraMode:window.__miloviceStreetAuditRendered?.cameraMode
 }));
 assert.equal(screenshotState.cameraMode,'technical-osm-traffic-overhead',
  'Opt-in audit must point at the mapped source junction');
 assert(screenshotState.audit?.actors?.length===2&&
  screenshotState.audit.actors.every(c=>c.inFrame&&c.visible),
  'Both actual 3D NPC meshes must project inside the screenshot camera: '+
  JSON.stringify(screenshotState));
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-body-envelope-5260-mobile.png'});
 // SwiftShader on a low-power mobile viewport may need far longer than
 // seven wall-clock seconds to finish 80 genuine animation frames.
 // Count engine frames, not elapsed wall time; never manufacture motion.
 await page.waitForFunction(()=>
  (window.__miloviceItalskaNpcEncounterRuntime5259?.()?.frames??0)>=80,
  null,{timeout:90000});
 const result=await page.evaluate(()=>({
  audit:window.__miloviceItalskaNpcEncounterRuntime5259?.(),
  guard:window.__miloviceItalskaJunctionConflictRuntime5258?.(),
  pageErrors:window.__miloviceRuntimeErrors||null,
  visibleBuild:document.getElementById('build-label')?.textContent,
  metaBuild:document.querySelector('meta[name="milovice-build"]')?.content,
  view:window.__miloviceStreetAuditRendered?.view,
  body:window.__miloviceItalskaBodyEnvelopeRuntime5260?.()
 }));
 const a=result.audit;
 assert.equal(result.body?.ready,true,JSON.stringify(result.body));
 assert(result.body.framesAudited>=80,'Full two-car animated body trace required');
 assert(Number.isFinite(result.body.minimumProxyBodyGapMetres));
 assert(Number.isFinite(result.body.minimumBufferedBodyGapMetres));
 assert.equal(result.body.bodyOverlapFrames,0,'Rendered two-car model bodies must not intersect at sampled frames: '+JSON.stringify(result.body));
 assert.equal(result.body.realMeshTriangleCollisionCertified,false);
 console.log('5.260 body-envelope evidence: '+JSON.stringify(result.body));
 console.log('5.259 WebGL measured: '+JSON.stringify({
  frames:a?.frames,actors:a?.actors, yieldedFrames:a?.yieldedFrames,
  stoppedFrames:a?.stoppedFrames,heldAtStopLine:a?.heldAtStopLine,
  leadCleared:a?.leadCleared,followerResumed:a?.followerResumed,
  minCenterDistance:a?.minimumCenterDistanceMetres,
  visibleFrames:a?.visibleFrames,guard:result.guard?.ready,
  view:result.view,errors,body:result.body
 }));
 assert.equal(a?.ready,true,JSON.stringify(a));
 assert.equal(a.diagnosticOnly,true);
 assert.equal(a.actors.length,2,'Exactly two real 3D NPC cars in audit mode');
 assert(a.frames>=80,'The original 3D traffic loop must animate several frames');
 assert(a.yieldedFrames>0,'At least one real NPC yield event must be observed');
 assert(a.visibleFrames>0,'Both mesh actors must appear in the audit view');
 assert(a.lastSamples.every(s=>Number.isFinite(s.centerDistance)),
  'Real mesh world positions must be finite');
 assert.equal(a.roadOrFootwayGeometryChanged,false);
 assert.equal(a.normalTrafficChanged,false);
 assert.equal(a.physicalCollisionCertified,false);
 assert.equal(result.guard?.ready,true);
 assert.equal(result.view,'italska-road-footway-5252');
 assert.equal(result.visibleBuild,result.metaBuild);
 assert.deepEqual(errors,[],'No JS page errors');
 console.log('PASS 5.260: actual oriented 3D model-body samples='+result.body.framesAudited+
  ', min measured model-body gap='+result.body.minimumProxyBodyGapMetres+
  ' m, 10cm buffered min gap='+result.body.minimumBufferedBodyGapMetres+
  ' m; no claim of real mesh collision certification');
 console.log('PASS 5.259 two original 3D NPCs, '+a.frames+' game frames, '+
  a.yieldedFrames+' yielding frames, held='+a.heldAtStopLine+
  ', first exited='+a.leadCleared+', second resumed='+a.followerResumed+
  ', min center distance='+a.minimumCenterDistanceMetres+' m. '+
  'No full dynamic collision or road-priority certification.');
}finally{
 await browser.close();
}
