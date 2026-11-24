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
 await page.goto('http://127.0.0.1:8080/?v=528500&streetAudit=armadni-891-south-balconies-5285',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceArmadniHousesRuntime5282?.()?.ready===true&&
   window.__miloviceStreetAuditRendered?.view==='armadni-891-south-balconies-5285',
   null,{timeout:120000});
 }catch(e){
  const state=await page.evaluate(()=>({
   loaded:window.__miloviceAreasLoaded,
   runtime:window.__miloviceArmadniHousesRuntime5282?.(),
   street:window.__miloviceStreetAuditRendered
  }));
  throw Error('5.282 buildings not ready '+JSON.stringify(state)+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(7100);
 const r=await page.evaluate(()=>({
  runtime:window.__miloviceArmadniHousesRuntime5282?.(),
  build:document.querySelector('meta[name="milovice-build"]')?.content,
  view:window.__miloviceStreetAuditRendered?.view
 }));
 assert.equal(r.view,'armadni-891-south-balconies-5285');
 assert.match(r.build,/^\d{8}-[a-z0-9-]+$/);
 const x=r.runtime;
 assert(x?.ready);
 assert.deepEqual(x.houses,['886','887','891','890']);
 assert.equal(x.modelWindows,357);
 assert.equal(x.plannedModelWindows,360);
 assert.equal(x.omittedModelWindows,3);
 assert.equal(x.entries.find(e=>e.sourceOSMId==='1047406190')?.omittedWindows,3);
 assert(x.entries.filter(e=>e.sourceOSMId!=='1047406190').every(e=>e.omittedWindows===0));
 assert.equal(x.modelFacades,26);
 assert.equal(x.meshCount,16);
 assert.equal(x.triangles,5094);
 assert(x.entries.every(b=>b.floors===4&&b.inScene&&b.visibleMeshes===4));
 for(const k of ['newBuildings','newDoors','newBalconies','newRoofs','newFootways','newRoads','newColliders'])assert.equal(x[k],0);
 const swing=await page.evaluate(()=>window.__milovicePlaygroundAudit?.swingFrame5297);
 assert(swing?.version==='5.297','5.297 swing audit missing after LOD');
 assert.equal(swing.correctedSwings,swing.modeledSwings);
 assert.equal(swing.fallbackSwings,0);
 assert.equal(swing.partsPerCorrectedSwing,11);
 assert.equal(swing.newEquipment,0);
 const e=await page.evaluate(()=>window.__miloviceArmadniEvidenceRuntime5283?.());
 assert.equal(e?.panelMounted,true);
 assert.equal(e?.projectConceptOnly,true);
 assert.equal(e?.approvedFacadePhotos,0);
 assert.equal(e?.newBalconies,0);
 const grass=await page.evaluate(()=>window.__miloviceArmadniGreenRuntime5290?.());
 assert(grass?.ready,'four mapped Armádní green pockets still drawn after 7.1s mobile LOD');
 assert.equal(grass.version,'5.290');
 assert.deepEqual(grass.sourcePolygonIds,[
  '1468803911','1468803935','1468803941','1468803951'
 ]);
 assert.equal(grass.originalMappedGrassPolygonCount,4);
 assert.equal(grass.sourceLanduseVerified,true);
 assert.equal(grass.positionsEstimated,true);
 assert.equal(grass.exactSpeciesVerified,false);
 assert(grass.tuftCount>8&&grass.tuftCount<=39);
 assert.equal(grass.meshCount,1);
 assert.equal(grass.triangles,grass.tuftCount*2);
 assert.equal(grass.visibleMeshes,1);
 for(const k of ['newLawnPolygons','newFootways','newRoads','newParkedCars','newTrees','newColliders'])
  assert.equal(grass[k],0);
 // Full mobile WebGL check after 7.1s: 5.291 recovered source footway
 // remains road-safe, 5.292 changes ONLY the material on exact mapped ways.
 const recovered=await page.evaluate(()=>
  window.__miloviceArmadniSidewalkRuntime5291?.());
 assert(recovered?.ready,'5.291 authentic footway not preserved in mobile WebGL');
 assert(recovered.safeOriginalFootwayMetres>90);
 assert.equal(recovered.originalRoadAndFootwayGPSPreserved,true);
 const promenade=await page.evaluate(()=>
  window.__miloviceArmadniPromenadeRuntime5293?.());
 assert(promenade?.ready,'5.293 source promenade not visible after 7.1s LOD');
 assert.equal(promenade.sourceWayId,'1373371686');
 assert.equal(promenade.sourceHash,'7134a638');
 assert(promenade.sourceMetres>109&&promenade.sourceMetres<111);
 assert.deepEqual(promenade.sharedSourceJunctions,[
  '1468803921','1468803914','1468803920'
 ]);
 assert.equal(promenade.joinedAtOriginalOSMNodes,true);
 assert.deepEqual(promenade.seenWayIds,['1373371686']);
 assert(promenade.paintedSafePieces>0);
 assert.equal(promenade.material,'armadni-c13c14-planned-pavers');
 assert.equal(promenade.unverifiedActualPavingColor,true);
 for(const key of ['newPaths','newParking','newColliders'])assert.equal(promenade[key],0);
 const parking=await page.evaluate(()=>window.__miloviceArmadniParkingRuntime5295?.());
 assert(parking?.ready,'5.295 source parking guard not ready after 7.1s LOD');
 assert.equal(parking.version,'5.295');
 assert.equal(parking.sourceCrossingIds.length,7);
 assert.equal(parking.sourceApproachIds.length,13);
 assert.equal(parking.exactSourceJunctions,21);
 assert.equal(parking.protectedWayIds.length,21);
 assert.equal(parking.modelClearRadius,4.25);
 assert.equal(parking.actualParkingSurveyed,false);
 assert.equal(parking.unmarkedCrossingsRemainUnpainted,true);
 for(const k of ['newParking','newCrossings','newZebras','newKerbs','newColliders'])
  assert.equal(parking[k],0);
 const east=await page.evaluate(()=>
  window.__miloviceArmadniEastRuntime5294?.());
 assert(east?.ready,'5.294 original east footways missing after 7.1s mobile LOD');
 assert.equal(east.version,'5.294');
 assert.deepEqual(east.sourceWayIds,['1468803918','1468803919','1468803920']);
 assert(east.sourceMetres>185&&east.sourceMetres<188);
 assert.equal(east.exactMapJunctions,4);
 assert.equal(east.northPromenadeSourceOSMId,'1373371686');
 assert.deepEqual([...east.seenWayIds].sort(),[...east.sourceWayIds].sort());
 assert(east.paintedSafePieces>0);
 assert.equal(east.material,'armadni-c13c14-planned-pavers');
 assert.equal(east.realPavingVerified,false);
 assert.equal(east.originalGPSUnchanged,true);
 for(const k of ['newFootways','newRoads','newCrossings','newKerbs',
  'newParking','newColliders','newMeshes'])assert.equal(east[k],0);
 const pavers=await page.evaluate(()=>
  window.__miloviceArmadniProjectPavingRuntime5292?.());
 assert(pavers?.ready,'5.292 C13/C14 planned-grey original paths not rendered after 7.1s LOD');
 assert.equal(pavers.version,'5.292');
 assert.deepEqual([...pavers.sourceWayIds].sort(),[
  '1468803921','1468803937','1468803938','1468803907','1468803914'
 ].sort());
 assert(pavers.sourceMetres>225&&pavers.sourceMetres<230);
 assert.equal(pavers.seenWayIds.length,5);
 assert(pavers.paintedSafePieces>0);
 assert.equal(pavers.projectNotAsBuilt,true);
 for(const key of ['newParking','newRoads','newFootways','newColliders'])
  assert.equal(pavers[key],0);
 const regionalWalkAudits=await page.evaluate(()=>[
  window.__miloviceArmadniSidewalkRuntime5291?.(),
  window.__miloviceArmadniProjectPavingRuntime5292?.(),
  window.__miloviceArmadniPromenadeRuntime5293?.(),
  window.__miloviceArmadniEastRuntime5294?.()
 ]);
 assert(regionalWalkAudits.every(a=>a?.ready&&['mlada','vrutice','westlink'].includes(a.sourceRegion)),
  '5.296 original pavement plans must retain the first source region');
 assert.equal(new Set(regionalWalkAudits.map(a=>a.sourceRegion)).size,1);
 const west=await page.evaluate(()=>window.__miloviceArmadniWestRuntime5289?.());
 assert(west?.ready,'C13/C14 Armádní 886/887 provisional facades visible after 7.1s mobile LOD');
 assert.equal(west.version,'5.289');
 assert.deepEqual(west.houses,['886','887']);
 assert.equal(west.projectDocumented,true);
 assert.equal(west.facadeColorVerified,false);
 assert.equal(west.projectedBalconiesDocumented,true);
 assert.equal(west.exactBalconyPlacementKnown,false);
 assert.equal(west.meshCount,4);
 assert.equal(west.triangles,168);
 assert.equal(west.visibleMeshes,4);
 assert.deepEqual(west.entries.map(x=>x.project),['C14','C13']);
 assert.deepEqual(west.entries.map(x=>x.osmId),['1164238465','1164238466']);
 assert.deepEqual(west.entries.map(x=>x.ruian),['119003791','119001071']);
 assert(west.entries.every(e=>e.ready&&e.meshCount===2&&e.triangles===84&&
  e.visibleMeshes===2&&e.photoVerified===false&&
  e.balconyPositionVerified===false&&e.originalFootprintRetained===true));
 for(const k of ['newBuildings','newDoors','newBalconies','newTerraces','newRoads','newFootways','newColliders'])assert.equal(west[k],0);
 const pair=await page.evaluate(()=>window.__miloviceArmadni890FacadeRuntime5288?.());
 assert(pair?.ready,'Armádní 890 C15 source footprint/provisional facade visible after 7.1s mobile LOD');
 assert.equal(pair.version,'5.288');
 assert.equal(pair.sourceOSMId,'1047406191');
 assert.equal(pair.sourceRUIANId,'107124980');
 assert.equal(pair.projectPairVerified,true);
 assert.equal(pair.photoApproved,false);
 assert.equal(pair.colorsAndBandEstimated,true);
 assert.equal(pair.originalSourceFootprintRetained,true);
 assert.equal(pair.meshCount,2);
 assert.equal(pair.triangles,60);
 assert.equal(pair.originalWallEdges,10);
 assert.equal(pair.visibleMeshes,2);
 for(const key of ['newBuildings','newBalconies','newTerraces','newDoors','newRoads','newFootways','newColliders'])assert.equal(pair[key],0);
 const photo=await page.evaluate(()=>window.__miloviceArmadni891PhotoRuntime5284?.());
 assert(photo?.ready,'real 891 exterior two-tone remains in scene after LOD');
 assert.equal(photo.sourceOSMId,'1047406190');
 assert.equal(photo.observedTwoTone,true);
 assert.equal(photo.estimatedOtherFaces,true);
 assert.equal(photo.meshCount,2);
 assert.equal(photo.wallEdges,10);
 assert.equal(photo.triangles,60);
 assert.equal(photo.groundBandToGrade,true);
 assert.equal(photo.provisionalPlinthVisuallyCovered,true);
 assert.equal(photo.physicalPlinthRemoved,false);
 assert.equal(photo.groundLayerOffsetMetres,.039);
 assert.equal(photo.seamLayerOffsetMetres,.041);
 assert.equal(photo.newBalconies,0);
 const balconies=await page.evaluate(()=>window.__miloviceArmadni891BalconiesRuntime5285?.());
 assert(balconies?.ready,'three photo-inferred balcony meshes survived 7.1s LOD');
 assert.equal(balconies.sourceOSMId,'1047406190');
 assert.equal(balconies.sourceFacadeEdge,6);
 assert.equal(balconies.modeledPhotoInferredBalconies,3);
 assert.equal(balconies.exactPositionSurveyed,false);
 assert.equal(balconies.meshCount,5);
 assert.equal(balconies.triangles,360);
 assert.equal(balconies.newBuildings,0);
 assert.equal(balconies.newColliders,0);
 const panel=page.locator('#armadni-evidence-5283');
 await panel.locator('summary').click();
 assert.equal(await panel.locator('a[href*="stakohk.cz"]').count(),1);
 assert.equal(await panel.locator('a[href*="hlasenirozhlasu.cz"]').count(),1);
 assert.equal(await panel.locator('a[href*="jirisimon.cz/milovice"]').count(),1);
 await panel.locator('summary').click();
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/armadni-houses-5282-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/armadni-houses-5282-wide.png'});
 console.log('PASS 5.296 region-order-safe Armádní, 5.294 east source walking network, 5.293 north promenade and 5.292 paving, 5.291 source road clipping and 5.290 source-locked green pockets one low-poly mesh after 7.1s mobile LOD, plus 4 houses/357 model windows and wide WebGL');
}finally{await browser.close()}
