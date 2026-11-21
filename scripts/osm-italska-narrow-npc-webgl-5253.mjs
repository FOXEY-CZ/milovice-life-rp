// 5.253 - real Chromium / SwiftShader scene and NPC clearance at Italska.
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
 await page.goto('http://127.0.0.1:8080/?v=525300&streetAudit=italska-road-footway-5252',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceItalskaRoadFootwayRuntime5252?.()?.ready===true&&
  window.__miloviceItalskaNpcClearanceRuntime5253?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='italska-road-footway-5252',
  null,{timeout:120000});
 await page.waitForTimeout(6900);
 const result=await page.evaluate(()=>({
  sidewalk:window.__miloviceItalskaRoadFootwayRuntime5252?.(),
  traffic:window.__miloviceItalskaNpcClearanceRuntime5253?.(),
  view:window.__miloviceStreetAuditRendered,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  build:document.getElementById('build-label')?.textContent
 }));
 assert.equal(result.sidewalk?.ready,true);
 assert(result.sidewalk.firstEdgeVisibleMetres>29&&
  result.sidewalk.firstEdgeVisibleMetres<31);
 assert.equal(result.sidewalk.unmarkedCrossingsStillUnpainted,true);
 assert.equal(result.traffic?.ready,true);
 assert.equal(result.traffic.sourceRoadOSMId,'8590284');
 assert.equal(result.traffic.sourceSidewalkOSMId,'1484073943');
 assert.equal(result.traffic.roadModelWidthMetres,5);
 assert(result.traffic.mappedNarrowDriveSegments>0);
 assert.equal(result.traffic.unsafeNarrowRoadsideParkingCars,0);
 assert.equal(result.traffic.publicBusesOnModelNarrowRoad,0);
 assert.equal(result.traffic.busRouteFilterModelOnly,true);
 assert.equal(result.traffic.legalBusAccessTagChanged,false);
 assert.equal(result.traffic.newParkingBays,0);
 assert.equal(result.traffic.newRoads,0);
 assert.equal(result.traffic.newCrossings,0);
 assert.equal(result.traffic.newColliders,0);
 assert.equal(result.traffic.noInventedTrafficRestrictions,true);
 assert.equal(result.view?.view,'italska-road-footway-5252');
 assert.equal(result.build,result.meta);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-narrow-npc-5253-mobile.png'});
 console.log('PASS 5.253 mobile: '+result.traffic.mappedNarrowDriveSegments+
 ' narrow original road segments, no buses/guessed roadside slots, original sidewalk '+result.sidewalk.firstEdgeVisibleMetres+'m, SwiftShader LOD 6.9s');
}finally{await browser.close()}
