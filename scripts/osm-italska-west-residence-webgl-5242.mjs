// Milovice RP 5.242 — real mobile Chromium WebGL, original two-floor RUIAN shell.
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
 await page.goto('http://127.0.0.1:8080/?v=524200&streetAudit=italska-west-residence-5242',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='italska-west-residence-5242'&&
   window.__miloviceItalskaWestResidenceRuntime5242?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.242 original 2-floor residence failed '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    residence:window.__miloviceItalskaWestResidenceRuntime5242?.(),
    error:document.getElementById('err')?.textContent
   })))+' pageerrors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const r=await page.evaluate(()=>
  window.__miloviceItalskaWestResidenceRuntime5242());
 assert(r.ready,'original shell with new facade must survive 6.5s LOD');
 assert.equal(r.sourceOSMId,'53865923');
 assert.equal(r.sourceRUIANId,'25610473');
 assert.equal(r.sourceReportedFloors,2);
 assert.equal(r.sourceReportedFlats,10);
 assert.equal(r.estimatedWindowsRendered,32);
 assert.equal(r.facadeEdges,2);
 assert.equal(r.plinthEdges,12);
 assert.equal(r.meshCount,4);
 assert.equal(r.inScene,true);
 assert.equal(r.visibleAfterLOD,4);
 assert.equal(r.originalBuildingGeometryUnchanged,true);
 assert.equal(r.windowLocationsPhotoVerified,false);
 assert.equal(r.newColliders,0);
 assert.equal(r.newEntrances,0);
 // 5.243: on the same actual mobile scene, ambient walkers stay strictly
 // on existing OSM walking surfaces rather than generated road shoulders.
 const walkers=await page.evaluate(()=>
  window.__miloviceMappedAmbientWalkersRuntime5243?.());
 assert(walkers?.ready,'5.243 mapped footway NPCs must be on-source');
 assert(walkers.sourceMappedFragments>0);
 assert(walkers.sourceMappedOSMWays>0);
 assert(walkers.activeAmbientWalkers>0);
 assert(walkers.maxCentrelineOffsetMetres<.055);
 assert.equal(walkers.anyOnDrivingGraph,false);
 assert.equal(walkers.noNewPaths,true);
 assert.equal(walkers.noNewCrossings,true);
 assert.equal(walkers.noNewColliders,true);
 assert.equal(walkers.unphotographedPeopleModels,true);
 const ambientReuse=await page.evaluate(()=>
  window.__miloviceAmbientReuseRuntime5244?.());
 assert(ambientReuse?.ready,'5.244 source-mapped actor reuse must initialize');
 assert.equal(ambientReuse.visibleRelocations,0);
 assert.equal(ambientReuse.specialActorsRelocated,0);
 assert.equal(ambientReuse.actorGeometryReused,true);
 assert.equal(ambientReuse.newWalkways,0);
 assert.equal(ambientReuse.newRoads,0);
 assert.equal(ambientReuse.newColliders,0);
 const buildingClearance=await page.evaluate(()=>
  window.__miloviceMappedBuildingClearanceRuntime5245?.());
 assert(buildingClearance?.ready,
  '5.245 all mapped pedestrian routes require whole-building-edge checks');
 assert(buildingClearance.mappedOriginalFootwayFragments>0);
 assert.equal(buildingClearance.fullyBoundaryCheckedFragments,
  buildingClearance.mappedOriginalFootwayFragments);
 assert.equal(buildingClearance.noNewBuildings,true);
 assert.equal(buildingClearance.noNewFootways,true);
 assert.equal(buildingClearance.noNewColliders,true);
 const continuation=await page.evaluate(()=>
  window.__miloviceMappedAmbientContinuityRuntime5246?.());
 assert(continuation?.ready,
  '5.246 source-verified junction links survive mobile WebGL/LOD');
 assert(continuation.linkedOriginalOSMJunctions>0);
 assert(continuation.sourceFootwayFragments>0);
 assert.equal(continuation.originalGeometryPreserved,true);
 assert.equal(continuation.newSidewalks,0);
 assert.equal(continuation.newCrossings,0);
 assert.equal(continuation.newColliders,0);
 assert.equal(continuation.specialWalkersUnchanged,true);
 const roadCorridor=await page.evaluate(()=>
  window.__miloviceMappedRoadCorridorRuntime5247?.());
 assert(roadCorridor?.ready,
  '5.247 every mapped ambient path checked against continuous road corridor after LOD');
 assert(roadCorridor.sourceFootwayFragments>0);
 assert.equal(roadCorridor.fullCarriagewayCorridorChecked,
  roadCorridor.sourceFootwayFragments);
 assert.equal(roadCorridor.unverifiedFragments,0);
 assert.equal(roadCorridor.cellMaxMetres,.7);
 assert.equal(roadCorridor.sourceGeometryUnchanged,true);
 assert.equal(roadCorridor.newRoads,0);
 assert.equal(roadCorridor.newFootways,0);
 assert.equal(roadCorridor.newColliders,0);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-west-residence-5242-mobile.png'});
 console.log('PASS 5.242 actual mobile WebGL original 2-floor 10-flat RUIAN shell and 32 model windows after LOD');
}finally{await browser.close()}
