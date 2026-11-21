// 5.254 — actual mobile Chromium/SwiftShader 3D scene verification.
// Verifies the game runtime after LOD, not only isolated geometry formulas.
// Corner sweeping and real traffic regulations remain unverified.
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
 await page.goto('http://127.0.0.1:8080/?v=525400&streetAudit=italska-road-footway-5252',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceItalskaRoadFootwayRuntime5252?.()?.ready===true&&
  window.__miloviceItalskaNpcClearanceRuntime5253?.()?.ready===true&&
  window.__miloviceItalskaCarClearanceRuntime5254?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='italska-road-footway-5252',
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const result=await page.evaluate(()=>({
  sidewalk:window.__miloviceItalskaRoadFootwayRuntime5252?.(),
  npc:window.__miloviceItalskaNpcClearanceRuntime5253?.(),
  cars:window.__miloviceItalskaCarClearanceRuntime5254?.(),
  envelope:window.__miloviceItalskaTurnEnvelopeRuntime5254?.(),
  smooth:window.__miloviceItalskaSmoothTurnRuntime5255?.(),
  renderedTurn:window.__miloviceItalskaRenderedTurnRuntime5256?.(),
  view:window.__miloviceStreetAuditRendered,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  build:document.getElementById('build-label')?.textContent,
  areas:window.__miloviceAreasLoaded
 }));
 assert.equal(result.sidewalk?.ready,true);
 assert(result.sidewalk.firstEdgeVisibleMetres>29&&
  result.sidewalk.firstEdgeVisibleMetres<31);
 assert.equal(result.sidewalk.unmarkedCrossingsStillUnpainted,true);
 assert.equal(result.npc?.ready,true);
 assert.equal(result.cars?.ready,true);
 assert.equal(result.cars.sourceOSMId,'8590284');
 assert(result.cars.narrowSegments>0);
 assert.equal(result.cars.wideNpcCarsOnNarrow,0);
 assert.equal(result.cars.standardPair.conservativeModelClearance,true);
 assert.equal(result.cars.widePair.conservativeModelClearance,false);
 assert(result.cars.standardPair.passingGapMetres>.4);
 assert(result.cars.widePair.passingGapMetres<.2);
 assert.equal(result.cars.idealStraightLaneOnly,true);
 assert(result.cars.roadBends?.interiorBends>0);
 assert.equal(result.cars.roadBends.turningSweptBodyValidated,false);
 assert.equal(result.cars.roadBends.originalGpsUnchanged,true);
 assert.equal(result.cars.curvesAndJunctionsNotValidated,true);
 assert.equal(result.cars.roadWidthModelledNotSurveyed,true);
 assert.equal(result.smooth?.ready,true,JSON.stringify(result.smooth));
 assert.equal(result.smooth?.connectedSharpTurnArms,4);
 assert.equal(result.smooth?.modelBufferedCurvesAccepted,4);
 assert(result.smooth?.minimumModelReserveMetres>=.10);
 assert.equal(result.smooth?.actualAsphaltMeshVerified,false);
 assert.equal(result.smooth?.physicalSteeringVerified,false);
 assert.equal(result.renderedTurn?.ready,true,JSON.stringify(result.renderedTurn));
 assert.equal(result.renderedTurn.mappedOutboundTurnArms,4);
 assert(result.renderedTurn.planarStripAccepted>=1&&
  result.renderedTurn.planarStripAccepted<4);
 assert.equal(result.renderedTurn.planarStripRejected,
  4-result.renderedTurn.planarStripAccepted);
 assert.equal(result.renderedTurn.roadTriangleRaycastNotPerformed,true);
 assert.equal(result.renderedTurn.DEMHeightNotChecked,true);
 assert.equal(result.envelope?.ready,true);
 assert(result.envelope.joinCount>0);
 assert(result.envelope.poseSamples>0);
 assert.equal(result.envelope.physicalSteeringVerified,false);
 assert.equal(result.envelope.actualRoadMeshNotVerified,true);
 assert.equal(result.envelope.originalGpsUnchanged,true);
 assert.equal(result.envelope.junctions?.ready,true);
 assert.equal(result.envelope.junctions.mappedTurnOptions,4);
 assert.equal(result.envelope.junctions.turnsOver75Degrees,4);
 assert.equal(result.envelope.junctions.intersectionClearanceVerified,false);
 assert.equal(result.cars.physicalRoadAndSidewalkUnchanged,true);
 assert.equal(result.cars.playerVehiclesUnchanged,true);
 assert.equal(result.cars.originalGpsUnchanged,true);
 assert.equal(result.npc.publicBusesOnModelNarrowRoad,0);
 assert.equal(result.npc.unsafeNarrowRoadsideParkingCars,0);
 assert.equal(result.view?.view,'italska-road-footway-5252');
 assert(result.areas?.includes('mlada'));
 assert.equal(result.build,result.meta);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-car-clearance-5254-mobile.png'});
 console.log('PASS 5.254 mobile SwiftShader 7.2s LOD: '+result.cars.narrowSegments+
 ' modeled 5m segments, 0 wide NPC vans on them, standard pair '+result.cars.standardPair.passingGapMetres+
 'm; swept corners intentionally not certified');
}finally{await browser.close()}
