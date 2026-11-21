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
 await page.goto('http://127.0.0.1:8080/?v=525900&streetAudit=italska-road-footway-5252&npcAudit=italska-encounter-5259',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceItalskaNpcEncounterRuntime5259?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='italska-road-footway-5252',
  null,{timeout:120000});
 await page.waitForTimeout(2300);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-encounter-5259-mobile.png'});
 await page.waitForTimeout(5000);
 const result=await page.evaluate(()=>({
  audit:window.__miloviceItalskaNpcEncounterRuntime5259?.(),
  guard:window.__miloviceItalskaJunctionConflictRuntime5258?.(),
  pageErrors:window.__miloviceRuntimeErrors||null,
  visibleBuild:document.getElementById('build-label')?.textContent,
  metaBuild:document.querySelector('meta[name="milovice-build"]')?.content,
  view:window.__miloviceStreetAuditRendered?.view
 }));
 const a=result.audit;
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
 console.log('PASS 5.259 two original 3D NPCs, '+a.frames+' game frames, '+
  a.yieldedFrames+' yielding frames, held='+a.heldAtStopLine+
  ', first exited='+a.leadCleared+', second resumed='+a.followerResumed+
  ', min center distance='+a.minimumCenterDistanceMetres+' m. '+
  'No full dynamic collision or road-priority certification.');
}finally{
 await browser.close();
}
