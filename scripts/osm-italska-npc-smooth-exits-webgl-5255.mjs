// 5.255: actual animated NPC curve on original Italska / mobile SwiftShader.
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
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=525500&streetAudit=italska-road-footway-5252&turnTest=1',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>{
  const runtime=window.__miloviceItalskaSmoothNpcRuntime5255?.();
  return window.__miloviceItalskaRoadFootwayRuntime5252?.()?.ready===true&&
   runtime?.ready===true&&runtime.fixtureTurnActive===true&&
   runtime.fixtureTurnProgressMetres>=1.5&&
   runtime.fixtureTurnProgressMetres<=4.0&&
   window.__miloviceStreetAuditRendered?.view==='italska-road-footway-5252';
 },null,{timeout:120000});
 await mkdir('browser-artifacts',{recursive:true});
 const midTurnProgress=await page.evaluate(()=>
  window.__miloviceItalskaSmoothNpcRuntime5255?.()?.fixtureTurnProgressMetres);
 assert(midTurnProgress>=1.5&&midTurnProgress<=4.0,
  'Screenshot must capture actual mid-turn progress, not a static initial pose');
 await page.screenshot({path:'browser-artifacts/italska-smooth-npc-exit-5255-turn.png'});
 await page.waitForFunction(()=>
  window.__miloviceItalskaSmoothNpcRuntime5255?.()?.fixtureCompleted===true,
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const result=await page.evaluate(()=>({
  sidewalk:window.__miloviceItalskaRoadFootwayRuntime5252?.(),
  npc:window.__miloviceItalskaNpcClearanceRuntime5253?.(),
  cars:window.__miloviceItalskaCarClearanceRuntime5254?.(),
  smooth:window.__miloviceItalskaSmoothNpcRuntime5255?.(),
  view:window.__miloviceStreetAuditRendered,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  build:document.getElementById('build-label')?.textContent
 }));
 assert.equal(result.smooth?.ready,true);
 assert.equal(result.smooth.testedExits,4);
 assert.equal(result.smooth.safeModelExits,2);
 assert.equal(result.smooth.unverifiedExits,2);
 assert.equal(result.smooth.fixtureSpawned,true);
 assert.equal(result.smooth.fixtureCompleted,true);
 assert(result.smooth.plannedTurns>=1);
 assert(result.smooth.completedTurns>=1);
 assert(result.smooth.observedCurveFrames>=4);
 assert(result.smooth.maxFrameStepMetres>0);
 assert(result.smooth.maxFrameStepMetres<.75,
  'Actual rendered NPC turn must not jump between frames');
 assert(result.smooth.maxFrameYawRadians>0);
 assert(result.smooth.maxFrameYawRadians<.4,
  'Actual rendered car yaw must rotate gradually');
 assert.equal(result.smooth.playerControlUnchanged,true);
 assert.equal(result.smooth.originalGpsUnchanged,true);
 assert.equal(result.smooth.physicalSteeringNotValidated,true);
 assert.equal(result.smooth.actualCollisionMeshNotValidated,true);
 assert.equal(result.sidewalk?.ready,true);
 assert(result.sidewalk.firstEdgeVisibleMetres>29&&
  result.sidewalk.firstEdgeVisibleMetres<31);
 assert.equal(result.sidewalk.unmarkedCrossingsStillUnpainted,true);
 assert.equal(result.npc?.ready,true);
 assert.equal(result.npc.publicBusesOnModelNarrowRoad,0);
 assert.equal(result.npc.unsafeNarrowRoadsideParkingCars,0);
 assert.equal(result.cars?.ready,true);
 assert.equal(result.cars.wideNpcCarsOnNarrow,0);
 assert.equal(result.view?.view,'italska-road-footway-5252');
 assert.equal(result.build,result.meta);
 assert.deepEqual(errors,[]);
 await page.screenshot({path:'browser-artifacts/italska-smooth-npc-exit-5255-mobile.png'});
 console.log('PASS 5.255 mobile SwiftShader 7.2s LOD: animated real standard NPC exits mapped narrow Italska, 2 safe curves, 2 rejected, sidewalks preserved');
}finally{await browser.close()}
