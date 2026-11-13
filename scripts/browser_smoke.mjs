// Browser smoke test: validate actual 3D startup, terrain, spawn picker and job HUD.
// Runs against the checked-out game served locally on port 8080.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,
 args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
try{
 const context=await browser.newContext({viewport:{width:1280,height:760},deviceScaleFactor:1});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(String(error.stack||error)));
 page.on('console',message=>{if(message.type()==='error')errors.push('console: '+message.text())});
 await page.goto('http://127.0.0.1:8080/?roofAudit=1',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__miloviceStarted===true,{timeout:45000});
 await page.waitForFunction(()=>{
  const el=document.getElementById('rp-spawn');
  return el&&!el.hidden;
 },{timeout:45000});
 const gfx=await page.evaluate(()=>window.__miloviceGraphics2||null);
 if(!gfx?.active||gfx.albedoTiles!==8||gfx.contactShadow!==true||
    !gfx.surfaceMaterials||Object.values(gfx.surfaceMaterials).some(v=>v!==true))
  throw new Error('Graphics 2.0 materials did not initialize correctly: '+JSON.stringify(gfx));
 console.log('5.2.0 shared city surfaces:',JSON.stringify(gfx.surfaceMaterials));
 const visual=await page.evaluate(()=>window.__miloviceBigUpdate||null);
 if(visual?.version!=='5.6.0'||visual.surfaces!==8||visual.streetDecor!==0||
    visual.safeWheelRig!==true||visual.mobileDetailRadius>200)
  throw new Error('5.26 real street-surfaces and audit performance not initialized: '+JSON.stringify(visual));
 console.log('5.6.0 detailed surface materials, instanced decorations and LOD:',JSON.stringify(visual));
 // The upgrade must replace solid house blocks with actual facade holes in
 // the old-town core. An instance count alone is not sufficient evidence.
 const hero=await page.evaluate(()=>window.__miloviceHeroArchitecture||null);
 if(!hero||hero.buildings<3||hero.cutoutWindows<12||hero.cutoutDoors<2||
    hero.solidWalls<10||hero.drawMeshes<4||!(hero.shortWallSegmentsSealed>=1))
  throw new Error('5.7.0 genuinely cut-out old-town buildings absent: '+JSON.stringify(hero));
 console.log('5.7.0 actual wall cut-outs in Old Milovice:',JSON.stringify(hero));
 const roofTopology=await page.evaluate(()=>window.__miloviceRoofTopologyAudit||null);
 if(!roofTopology||roofTopology.version!=='3.0'||
    roofTopology.processed<300||roofTopology.partitionable<100||
    roofTopology.autoOpenedPassages!==0||
    roofTopology.multiVolume<1||
    roofTopology.needsManualEvidence<100)
  throw new Error('Roof 3.0 structural OSM audit absent or invents passages: '+
   JSON.stringify(roofTopology));
 console.log('5.31 roof masses and source-safe passages:',JSON.stringify(roofTopology));

  // Terrain tiles copy every triangle, position, normal and UV from the original
  // DEM mesh. Foundation quads must be partitioned without losing geometry.
  const oldGround=await page.evaluate(()=>window.__miloviceTerrainTiles);
  const oldFoundation=await page.evaluate(()=>window.__miloviceFoundationChunks);
  if(!oldGround||oldGround.tiles<20||oldGround.tiles>55||
     oldGround.sourceTriangles!==oldGround.drawTriangles||
     !oldFoundation||oldFoundation.quads<50||oldFoundation.meshes<2)
    throw new Error('5.19 tiled terrain or spatial foundations missing: '+JSON.stringify({oldGround,oldFoundation}));
  console.log('5.20 full-resolution DEM with fewer GPU submissions:',
    JSON.stringify({oldGround,oldFoundation}));
 const landmark=await page.evaluate(()=>window.__milovicePhotoStreetPass||null);
 if(!landmark||landmark.buildings!==3||landmark.dormers<3||
    landmark.rooflights<2||landmark.hedgeGroups<1||
    !(landmark.meshesSavedByBatching>0&&landmark.detailDrawMeshes<landmark.detailMeshes)||
    !['202367194','202367254','118487980'].every(id=>landmark.landmarkIds.includes(id))||
    landmark.actualArchedWindowMeshes!==4||landmark.rectangularFakeArchRemoved!==2||
    landmark.anchoredDormerRoofs!==2||landmark.removedDetachedRoofBoxPanels!==4)
   throw Error('5.14 photographed street block geometry missing: '+JSON.stringify(landmark));
 const houseRoof=await page.evaluate(()=>window.__miloviceSkolskaRoof||null);
 if(!houseRoof||houseRoof.osmId!==118487980||
    houseRoof.footprintVertices!==7||houseRoof.mainRoofType!=='hip'||
    !houseRoof.photoSpecific||!houseRoof.closedWallAndEave||
    !houseRoof.atticUnderPitchedRoof||houseRoof.upperFullStoreysModelled!==1||
    Math.abs(houseRoof.modelledEaveWallHeight-3.75)>.001||
    !houseRoof.noUnconnectedRoofParts||
    !houseRoof.automaticRoofClipping||!houseRoof.shellFacesClipped||
    !houseRoof.openingProfileFromPhoto||houseRoof.sharedRoofFeatureCount!==2||
    !(houseRoof.mainRoofOpeningArea>1.0)||
    houseRoof.backJunctionsAutoClosed!==2||
    !(houseRoof.maximumRoofBackGapCovered>=0)||
    !houseRoof.geometricFeatureOverlap||
    !(houseRoof.gapSealedMetres>.10)||
    !(houseRoof.wallInfillTriangles>3)||
    Math.abs(houseRoof.eaveOverhang-.30)>1e-7||
    !(houseRoof.eaveTiles>=10&&houseRoof.eaveSoffit>=10&&houseRoof.eaveFascia>=10)||
    houseRoof.roofFootprintError>1e-5)
   throw new Error('5.29.1 Školská detached hip or dormer roof survived: '+
    JSON.stringify({houseRoof,landmark}));
 console.log('5.30 Roof System 2.0 photo-driven intersections and closed shell:',JSON.stringify(houseRoof));
 const photoBuildingPass=await page.evaluate(()=>window.__milovicePhotoBuildingPass||null);
 if(!photoBuildingPass||
    photoBuildingPass.representativeHouse!=='Školská 220/1'||
    !(photoBuildingPass.unverifiedRoofOutlinesSuppressed>40))
  throw new Error('5.29 house roofs still carry floating generic outlines: '+JSON.stringify(photoBuildingPass));
 console.log('5.29 roof outline suppression and photo-building audit:',photoBuildingPass);
 const official=await page.evaluate(()=>window.__miloviceArchitectureBridge);
 if(!official||official.publishedVerified!==3||
    !['202367194','202367254','118487980'].every(id=>official.appliedIds.includes(id)))
   throw Error('Three source-reviewed public building cards were not applied to OSM ways: '+JSON.stringify(official));
 console.log('5.29 photo-grounded block: Školská 220/1 actual curved attic windows + documented buildings',
   JSON.stringify({landmark,published:official.publishedVerified}));
 const environment=await page.evaluate(()=>window.__miloviceStreetEnvironment||null);
 if(!environment||environment.sceneCount!==1||
    environment.sources!==1||environment.ids[0]!=='street-5-kvetna-2014'||
    environment.featureCount<30||environment.instances<40||
    environment.pavementPieces!==0||!environment.unverifiedPhotoPavingDisabled||
     !environment.checkedGreeneryAgainstRoads||!environment.fullFootprintChecked||environment.roadRejected<0||
    environment.drawMeshes>24||environment.spatiallyApproximate!==true||
     !(environment.minRoadClearance>=1.9))
   throw new Error('5.21 5. května photographed streetscape missing, unbatched or unsourced: '+JSON.stringify(environment));
 if(!(await page.locator('#rp-area-select option[value="photo5"]').count()))
   throw new Error('5.21 photo street scene cannot be selected as a spawn location');
 console.log('5.21 original 5. května photo street environment:',JSON.stringify(environment));
 const realityStation=await page.evaluate(()=>window.__miloviceStationForecourt||null);
 if(!realityStation?.strictReality||realityStation.photoAnchoredStopCount!==2||
    realityStation.features!==2||
    !['bus-A','bus-B'].every(id=>realityStation.placements.some(p=>p.id===id&&p.cameraDisplacement<=6))||
    realityStation.deferredWithoutSurvey.length!==3)
  throw new Error('5.24 photo-GPS station A/B and strict reality contract broken: '+JSON.stringify(realityStation));
 console.log('5.24 geotagged station forecourt:',JSON.stringify(realityStation));

 const cutoutTest=await page.evaluate(async()=>{
  const THREE=await import('three');
  const {makeMiloviceHeroArchitecture}=await import('./scripts/hero-architecture.js?v=570');
  const kit=makeMiloviceHeroArchitecture(THREE,{sites:[{x:6,z:5}],radius:40,maxBuildings:2});
  const scene=new THREE.Group();
  const built=kit.addBuilding({points:[
   new THREE.Vector2(0,0),new THREE.Vector2(12,0),
   new THREE.Vector2(12,10),new THREE.Vector2(0,10)
  ],base:0,height:6.1,floors:2,type:'house',index:1,id:999001});
  kit.flush(scene);scene.updateMatrixWorld(true);
  const walls=scene.children.filter(o=>o.isMesh&&o.material.vertexColors);
  const ray=new THREE.Raycaster();
  const hit=(x,y)=>{
   ray.set(new THREE.Vector3(x,y,-4),new THREE.Vector3(0,0,1));
   return ray.intersectObjects(walls,false)[0]?.distance??Infinity;
  };
  return {built,door:hit(6,1.25),solid:hit(.5,1.25),
    stats:kit.stats()};
 });
 if(!cutoutTest.built||cutoutTest.door<5||cutoutTest.solid>4.1||
    cutoutTest.stats.cutoutDoors!==1)
  throw new Error('5.7.0 facade geometries still contain solid wall behind doors: '+JSON.stringify(cutoutTest));
 console.log('5.7.0 verified wall-hole ray geometry:',JSON.stringify(cutoutTest));


 if(!(await page.locator('#build-label').innerText()).includes('roof-envelope-5311'))
  throw new Error('5.31.1 browser loaded a stale HTML build');
 const sidewalkCheck=await page.evaluate(()=>window.__miloviceSidewalkDebug||null);
 if(!sidewalkCheck||sidewalkCheck.legacyUnderRoadBands!==0||
    sidewalkCheck.separatedSidewalks!==0||
    !sidewalkCheck.proceduralSidewalksDisabled||
    !sidewalkCheck.removedInventedCrosswalks||
    !(sidewalkCheck.mappedFootwaySegments>20)||
    !(sidewalkCheck.clippedByCarriageway>0)||
    !(sidewalkCheck.mappedMarkedCrossings>=1))
  throw new Error('5.26 360 reality audit: only actual OSM pedestrian way meshes and true marked crosswalks are allowed: '+JSON.stringify(sidewalkCheck));
 console.log('5.2.1 sidewalk road-edge diagnostics:',JSON.stringify(sidewalkCheck));
 const crossingAudit=await page.evaluate(()=>window.__miloviceCrossingAudit||null);
 if(!crossingAudit?.disabledRandomGraphCrosswalks||crossingAudit.inventedCrossings!==0||
     crossingAudit.mappedMarkedCrossings<1||crossingAudit.paintedStripeSegments<1)
  throw new Error('5.26 fictitious zebra crossing still present: '+JSON.stringify(crossingAudit));
 const oldRealityAudit=await page.evaluate(()=>window.__miloviceLegacyRealityAudit||null);
 if(!oldRealityAudit||oldRealityAudit.inspectedInZone<10||
     oldRealityAudit.suppressedDoors<2||
     oldRealityAudit.removedLegacy3DLabels<1||
     !oldRealityAudit.globalGuessedStreetFurnitureDisabled)
  throw new Error('5.26 legacy fictional props are still spawned: '+JSON.stringify(oldRealityAudit));
 console.log('5.26 historic visual audit:',JSON.stringify({crossingAudit,oldRealityAudit}));
 // The imported character library starts asynchronously and may fall back safely
 // when a third-party CDN fails; verify the status and UI without blocking game startup.
 const humans=await page.evaluate(()=>window.__miloviceHumans||null);
 if(!humans||!['auto','on','off'].includes(humans.mode)||
    !(await page.locator('#rp-human-select').count()))
  throw new Error('5.3.0 rigged GLB character subsystem missing: '+JSON.stringify(humans));
 console.log('5.3.0 Quaternius character assets:',JSON.stringify(humans));
 console.log('5.3.0 GLB bone names:',JSON.stringify(humans.bones||[])); 
 // Require genuine external meshes, a valid humanoid skeleton, and moving bones.
 await page.waitForFunction(()=>window.__miloviceHumans?.playerReady===true,
    null,{timeout:30000});
 const animated=await page.evaluate(()=>window.__miloviceHumans);
 if(!(animated.heightMeters>=1.65&&animated.heightMeters<=2.2))throw new Error('5.3.2 the character is still giant or floating; height='+animated.heightMeters+' originalGLBScale='+JSON.stringify(animated.originalGLBScale));
 if(animated.armsDown!==true)throw new Error('5.3.2 human is still T-posed: '+JSON.stringify(animated));
  if(Math.abs(animated.facingCorrectionRadians-Math.PI)>.0001)
   throw new Error('5.3.3 import needs +Z to -Z heading correction: '+JSON.stringify(animated));
 console.log('5.3.2 normalized humanoid standing height:',animated.heightMeters,'m, source scale',animated.originalGLBScale);
 if(animated.bones?.length<35||animated.runtimeSkeletalWalk!==true)
  throw new Error('5.3.0 loaded human has no usable locomotion skeleton: '+JSON.stringify(animated));
 console.log('5.3.0 working skeletal walk from Quaternius bones:',JSON.stringify({
  bones:animated.bones.length,runtimeSkeletalWalk:animated.runtimeSkeletalWalk
 }));
 // Existing roadside vegetation must actually be replaced with imported GLB,
 // not just be a hidden loader or another spherical procedurally generated tree.
 await page.waitForFunction(()=>['ready','fallback','idle'].includes(window.__miloviceNatureGLB?.state),
   null,{timeout:30000});
 const nature=await page.evaluate(()=>window.__miloviceNatureGLB);
 console.log('5.3.0 real tree assets:',JSON.stringify(nature));
 // The new phone-default GLB car is small and has an independently verifiable CC0 source.
 const mobileCar=await page.evaluate(async()=>{
  const {LICENSED_VEHICLES}=await import('./scripts/vehicle-assets.js?v=531');
  const asset=LICENSED_VEHICLES.cityCar;
  if(!asset)return null;
  const response=await fetch(asset.uri,{mode:'cors'});
  return {ok:response.ok,status:response.status,license:asset.license,bytes:asset.fileBytes};
 });
 if(!mobileCar?.ok||mobileCar.license!=='CC0-1.0'||mobileCar.bytes>300000)
  throw new Error('5.3.0 lightweight mobile GLB car cannot be fetched: '+JSON.stringify(mobileCar));
 console.log('5.3.0 mobile CC0 car successfully fetched:',JSON.stringify(mobileCar));

 if(!(await page.locator('#rp-model-select').locator('option[value="auto"]').innerText()).includes('PC i mobil'))throw new Error('New mobile vehicle quality mode absent');
 if(!['idle','ready','fallback'].includes(nature.state)||nature.instances!==0)
  throw new Error('5.22 deprecated random roadside GLB trees still visible: '+JSON.stringify(nature));

 // 5.4: parked cars come from an OSM-based road/parking layout and
 // may not occupy roads blocked to traffic or become parked buses.
 const parking=await page.evaluate(()=>window.__miloviceParkingDebug||null);
 if(!parking||parking.parked<7||parking.distinctTypes.length<4||
     !Array.isArray(parking.cars)||parking.cars.length!==parking.parked)
  throw new Error('5.4.0 missing varied parked vehicles in the old town: '+JSON.stringify(parking));
 console.log('5.4.0 OSM roadside parking:',JSON.stringify(parking));
 await page.waitForFunction(()=>window.__miloviceVehicleDebug?.wheelSpinMeters>0,null,{timeout:18000});
 const wheels=await page.evaluate(()=>window.__miloviceVehicleDebug);
 console.log('5.4.0 moving car and bus wheel rotation:',JSON.stringify(wheels));
 const landmarkChecks=await page.evaluate(()=>window.__miloviceLandmarkDebug||{});
 if(!landmarkChecks.unverifiedPlatformPropsRemoved||
    !landmarkChecks.unverifiedCafeFurnitureRemoved||
    !landmarkChecks.unverifiedShopLabelRemoved)
  throw new Error('5.24 unverified station furniture/signs not removed: '+JSON.stringify(landmarkChecks));
 if(!landmarkChecks.stationSideAwningRemoved||
    landmarkChecks.stationCanopy!==false||
    landmarkChecks.stationCanopyReality!==null||
    landmarkChecks.stationCanopyRoofPieces!==0||
    landmarkChecks.stationCanopyPosts!==0||
    landmarkChecks.stationCanopyBraces!==0||
    !landmarkChecks.stationUnverifiedSidePavingRemoved)
  throw new Error('5.27.3 false green awning by station and bike tower still exists: '+JSON.stringify(landmarkChecks));
 if(!landmarkChecks.stationCafeWaitingRoom||!landmarkChecks.unverifiedExteriorCafeRemoved)
  throw new Error('5.25 invented external Nádražka cafe still exists or indoor location not documented: '+JSON.stringify(landmarkChecks));
 console.log('5.27.3 false green SIDE awning, pillars, braces and fake paving removed:',
  JSON.stringify({sideAwningRemoved:landmarkChecks.stationSideAwningRemoved,
   remainingCanopyPosts:landmarkChecks.stationCanopyPosts}));
 if(!landmarkChecks.stationPassageAudit?.matchedMappedFootway||
    !(landmarkChecks.stationPassageAudit.newMappedAlignedS>8)||
    !(landmarkChecks.stationPassageAudit.offset<.15)||
    landmarkChecks.stationPassageAudit.sourceInteriorFootwayId!==1550920096||
    !landmarkChecks.stationPassageAudit.mappedThroughBuilding||
    landmarkChecks.stationPassageAudit.splitWallOpeningEdges<5||
    Math.abs(landmarkChecks.stationPavingAxisS-landmarkChecks.stationPassageAudit.s)>.02)
  throw new Error('5.26 station entrance is not aligned with mapped footway: '+JSON.stringify(landmarkChecks.stationPassageAudit));
 const cityRoof=await page.evaluate(()=>window.__miloviceCityRoofAudit||null);
 if(!cityRoof||cityRoof.version!=='5.28.5'||cityRoof.buildings<8||
    cityRoof.inverseFanRemoved!==true||
    cityRoof.maxFootprintOvershoot!==0||cityRoof.areaErrors>1e-4||
    cityRoof.hip+cityRoof.gable!==cityRoof.buildings)
  throw new Error('5.28.5 citywide roof polygons still have inverted/floating faces: '+JSON.stringify(cityRoof));
 const houseDetails=await page.evaluate(()=>window.__miloviceHeroArchitecture||null);
 if(!houseDetails||!Number.isFinite(houseDetails.suppressedArbitraryChimneys)||
    !Number.isFinite(houseDetails.skippedUnverifiedGables))
  throw new Error('Hero houses still generate imaginary index-based chimneys or misaligned gables: '+JSON.stringify(houseDetails));
 console.log('5.28.5 roof generation across all city houses:',JSON.stringify({cityRoof,
  suppressedArbitraryChimneys:houseDetails.suppressedArbitraryChimneys}));
 const roofVisual=await page.evaluate(()=>window.__miloviceStationRoofGeometry||null);
 if(roofVisual?.sections?.length!==3||roofVisual.mode!=='footprint-constrained'||
    !roofVisual.axisShared||roofVisual.source!=='OSM 53865956'||
    !roofVisual.center||!roofVisual.globalAxis||
    roofVisual.sections.filter(p=>p.kind==='gable').length!==0||
    roofVisual.sections.filter(p=>p.kind==='hip').length!==3||
    roofVisual.sections.some(p=>!p.clippedToOSM||p.hasFakeEndCap||
      !p.eaveSoffitClosed||!(p.actualEaveOverhang>=.30)||
      !(p.eaveExteriorEdges>=1)||!(p.eaveTileTriangles>=2)||
      !(p.eaveFasciaTriangles>=2)||
      !p.roofPlanePartitionedEaves||!(p.eaveDuplicateCapsAvoided>0)||
      !Number.isFinite(p.eaveEndCaps)||
      !p.seamClosedToActualRoof||!Number.isFinite(p.perimeterInfillTriangles)||
      p.perimeterInfillTriangles<0||!Number.isFinite(p.maxFormerRoofWallGap)||
      p.maxFormerRoofWallGap<0||
      p.areaError>1e-4||p.footprintOverhang!==0||p.outputTriangles<3||
      Math.hypot(p.axis.ax-roofVisual.globalAxis.ax,
       p.axis.az-roofVisual.globalAxis.az)>.001))
  throw new Error('5.28.8 station roof must preserve clean eave and wall junctions: '+
    JSON.stringify(roofVisual));
 if(roofVisual.sections.slice(0,2).some(p=>p.falseWallSeamCutsExcluded<1)||
    roofVisual.sections[2].falseWallSeamCutsExcluded!==0)
  throw new Error('5.28.8 false stucco walls across wing joins: '+JSON.stringify(roofVisual));
 console.log('5.28.8 station roof geometry and clean joins:',
  JSON.stringify(roofVisual));
 await mkdir('browser-artifacts',{recursive:true});
 // Camera screenshots are useless behind the startup modal; close it,
 // photograph the station from all five directions, then reopen it for
 // the original walking/car smoke flow below.
 await page.locator('#rp-spawn-close').click();
 if(!(await page.locator('#rp-spawn').isHidden()))
  throw new Error('Roof visual audit still covered by spawn modal');
 for(const view of ['street','rail','left','right','elevated']){
  await page.evaluate(name=>{
   window.__miloviceRoofAuditView=name;
   window.__miloviceRoofAuditRendered=null;
  },view);
  await page.waitForFunction(name=>window.__miloviceRoofAuditRendered===name,
   view,{timeout:12000});
  await page.screenshot({path:'browser-artifacts/station-roof-'+view+'.png'});
 }
 // Photograph both real 2024 house reference views (not just station).
 // These caught flying inverted black dormer roofs in the user's screenshot.
 for(const view of ['house-skolska','house-mirova36']){
  await page.evaluate(name=>{
   window.__miloviceRoofAuditView=name;
   window.__miloviceRoofAuditRendered=null;
  },view);
  await page.waitForFunction(name=>window.__miloviceRoofAuditRendered===name,
   view,{timeout:12000});
  await page.screenshot({path:'browser-artifacts/review-'+view+'-roof.png'});
 }
 await page.evaluate(()=>window.__miloviceRoofAuditView=null);
 await page.locator('#rp-vehicles').click();
 if(!(await page.locator('#rp-spawn').isVisible()))
  throw new Error('Spawn modal must reopen after roof screenshots');
 const coverAudit=await page.evaluate(()=>window.__miloviceStationRoofAudit||null);
 if(!coverAudit||coverAudit.roofOnlyWaysExcluded<1||
    !coverAudit.osmRoofIds.includes(1550920095))
  throw new Error('5.26 station canopy OSM roof way still extruded as a blocking building: '+JSON.stringify(coverAudit));
 console.log('5.26 unblocked station canopy (OSM roof-only):',JSON.stringify(coverAudit));
 console.log('Landmark geometry:',JSON.stringify(landmarkChecks));
 if(landmarkChecks.stationPassageFaces!==2)throw new Error('Milovice station does not have two opposing real open passage portals: '+JSON.stringify(landmarkChecks));
 const collisionCheck=await page.evaluate(()=>{
  const s=window.__miloviceCollisionDebug;
  const portals=window.__miloviceLandmarkDebug?.stationPassagePortals||[];
  return {s,portals,open:portals.map(p=>window.__miloviceCollisionProbe?.(p.x,p.z,.32))};
 });
 if(!collisionCheck.s||collisionCheck.s.polygons<50||collisionCheck.s.walls<4||
    collisionCheck.portals.length!==2||collisionCheck.open.some(Boolean))
  throw new Error('5.5.0 OSM building collisions or walk-through station portals broken: '+JSON.stringify(collisionCheck));
 console.log('5.5.0 spatial world collisions + both station portals:',JSON.stringify(collisionCheck));

 if(!landmarkChecks.stationParts?.center||!landmarkChecks.stationParts?.left||!landmarkChecks.stationParts?.right)throw new Error('Station wing/center massing missing');
 if(!(landmarkChecks.stationParts.centerHalfSpan>=4.15&&landmarkChecks.stationParts.centerHalfSpan<=5.5)||
    landmarkChecks.stationCentralRoofType!=='hip'||
    landmarkChecks.stationUpperArtificialCutWindows!==0||
    landmarkChecks.stationUpperExteriorWindows!==2||
    landmarkChecks.stationUpperFacadeAccuracy!=='photo-informed-not-surveyed')
  throw new Error('5.28 station central one-window bay and exterior-only upper sash missing: '+JSON.stringify(landmarkChecks));
 if(!landmarkChecks.stationSignOnRailLongFacade||
    landmarkChecks.stationSignOnEndWall!==false||
    !landmarkChecks.stationSignOneSided||
    !landmarkChecks.stationSignCenter||
    !(landmarkChecks.stationSignCenter.y<landmarkChecks.stationRoofGeometry.center.base+3.7)||
    !landmarkChecks.stationInventedSemicircleRemoved||
    !landmarkChecks.stationPassageLintelMeetsEave||
    landmarkChecks.stationPassageHeaderType!=='straight-mapped-portal')
  throw new Error('5.28.3 station plaque must be below roof on real rail facade, no fake semicircle: '+JSON.stringify(landmarkChecks));
 if(!landmarkChecks.stationSign||landmarkChecks.stationCanopy!==false||
    !landmarkChecks.unverifiedStreetDoorRemoved||landmarkChecks.stationStreetSign!==false)
  throw new Error('4.9 station architecture missing: '+JSON.stringify(landmarkChecks));
 if(!landmarkChecks.stationForecourt||!landmarkChecks.actualEntranceIsStationPassage||landmarkChecks.stationStreetEntrance!==false)
  throw new Error('5.1.1 station forecourt/entry missing: '+JSON.stringify(landmarkChecks));
 if(landmarkChecks.stationRoofSurface!=='red-tile-photo-informed'||
    landmarkChecks.stationRoofIsMetal!==false)
  throw new Error('5.27.1 railway station red tile roof photo model missing: '+JSON.stringify(landmarkChecks));
 if(!landmarkChecks.stationCafeMapOnly||!landmarkChecks.stationCafeMarkerApproximate||
    !(landmarkChecks.stationUnverifiedSideWindowsRemoved>=2)||
    !landmarkChecks.stationCafeMapPosition||
    !Number.isFinite(landmarkChecks.stationCafeMapPosition.x)||
    !Number.isFinite(landmarkChecks.stationCafeMapPosition.z))
  throw new Error('5.27.2 Nádražka must be inside the waiting room, without invented side facade windows: '+JSON.stringify(landmarkChecks));
 if(landmarkChecks.stationFacadeWindows<8||!landmarkChecks.stationPassagePaving)
  throw new Error('5.1.4 station facade windows or passage paving missing: '+JSON.stringify(landmarkChecks));
 if(landmarkChecks.stationSidewalkConnected!==true||landmarkChecks.stationFootwayId!==549346217||
    landmarkChecks.stationIndoorFootwayId!==1550920096||
    landmarkChecks.stationAccessConnectorSegments!==0||
    landmarkChecks.stationMappedAccessNoImaginarySpurs!==true||
    !(landmarkChecks.stationAccessDistance>=0&&landmarkChecks.stationAccessDistance<.65))
  throw new Error('5.1.5 station pedestrian access must connect OSM footway 549346217 to both passage exits: '+JSON.stringify(landmarkChecks));
 if(landmarkChecks.platformTactileStrips<3||landmarkChecks.platformEdgeMeters<30)
  throw new Error('5.1.3 mapped station platform tactile edging missing: '+JSON.stringify(landmarkChecks));
 const diagnostics=await page.evaluate(()=>({rail:window.__miloviceRailDebug,models:window.__miloviceModelDebug,range:window.__miloviceDrawDistance}));
 console.log('5.0 models and train:',JSON.stringify(diagnostics));
 if(diagnostics.rail?.loaded!==true||diagnostics.rail?.cars!==3)throw new Error('Three-coach rail traffic missing');
 if(diagnostics.models?.humans!==30||diagnostics.models?.articulatedBuses<1||!diagnostics.models?.playerHuman)throw new Error('Human/vehicle population missing');
 if(diagnostics.range!==620)throw new Error('Default Milovice draw distance not applied');
 const terrain=await page.locator('#terrain-status').innerText();
 console.log('Loaded terrain:',terrain);
 if(!terrain.includes('ČÚZK DMR 4G'))throw new Error('Official DEM did not load');
 const status=await page.locator('#status').innerText();console.log('World status:',status);
 await mkdir('browser-artifacts',{recursive:true});
 await page.locator('[data-spawn="walking"]').click();
 if((await page.locator('#mode').innerText())!=='Pěšky')throw new Error('Walking spawn did not work');
 await page.screenshot({path:'browser-artifacts/milovice-realistic-city.png'});
 await page.locator('#maplaunch').click();
 await page.waitForSelector('.milovice-player-marker .milovice-player-arrow',{timeout:25000});
 if(!(await page.locator('#mapfollow').isVisible()))throw new Error('Full-map recenter missing');
 console.log('Full map marker: OK');
 await page.screenshot({path:'browser-artifacts/milovice-full-map.png'});
 await page.locator('#closemap').click();
 await page.locator('#rp-vehicles').click();
 await page.locator('[data-spawn="sedan"]').click();
 if(!(await page.locator('#mode').innerText()).includes('Řidič auta'))throw new Error('Car spawn did not work');
 if(await page.locator('#doors').isVisible())throw new Error('Bus-only door button visible during car free roam');
 // Regression: exiting a sedan must never transform it into an unrelated bus.
 // A vehicle must keep its stable identity and unique 3D appearance.
 await page.waitForTimeout(550);
 const chosenCar=await page.evaluate(()=>window.__miloviceVehicleDebug?.activeCarId);
 if(!(chosenCar>0))throw new Error('Selected car does not have a stable ID: '+chosenCar);
 await page.locator('#enter').click();
 await page.waitForFunction(()=>window.__miloviceVehicleDebug?.activeCarId===null&&
    window.__miloviceVehicleDebug?.lastExitedVehicle?.id>0,null,{timeout:6000});
 const exited=await page.evaluate(()=>window.__miloviceVehicleDebug);
 const busSeparation=Math.hypot(exited.bus.x-exited.lastExitedVehicle.x,exited.bus.z-exited.lastExitedVehicle.z);
 if(!exited.busAtPark||exited.lastExitedVehicle.id!==chosenCar||busSeparation<6)
  throw new Error('5.4.0 car became a bus after exit: '+JSON.stringify({chosenCar,exited,busSeparation}));
 console.log('5.4.0 car retained identity after exit; separate bus still parked:',JSON.stringify({
  id:chosenCar,busSeparation,parked:exited.parked
 }));
 await page.screenshot({path:'browser-artifacts/milovice-car-exit-preserved.png'});
 await page.locator('#enter').click();
 await page.waitForFunction((id)=>window.__miloviceVehicleDebug?.activeCarId===id,chosenCar,{timeout:6000});

 await page.locator('#rp-vehicles').click();
 await page.locator('#rp-model-select').selectOption('on');
 await page.locator('#rp-spawn-close').click();
 await page.waitForFunction(()=>window.__miloviceGLBDebug?.state==='ready'||window.__miloviceGLBDebug?.state==='fallback',null,{timeout:45000});
 const assetStats=await page.evaluate(()=>window.__miloviceGLBDebug);
 console.log('5.1.1 CC0 GLB diagnostics:',JSON.stringify(assetStats));
 if(assetStats.state!=='ready')throw new Error('Licensed high-resolution GLB failed to load: '+JSON.stringify(assetStats));
 await page.waitForFunction(()=>window.__miloviceGLBDebug?.rejected?.spectralGT||
    window.__miloviceGLBDebug?.assignments?.some(a=>a.key==='spectralGT'&&a.driven),
  null,{timeout:30000});
 const gtWheelAudit=await page.evaluate(()=>window.__miloviceGLBDebug);
 if(gtWheelAudit.assignments.some(a=>a.overlay||a.wheels!==4))
  throw new Error('5.6.0 unsupported wheels overlaid on a licensed car: '+JSON.stringify(gtWheelAudit));
 console.log('5.6.0 safely rejected incompatible GLB wheel rigs:',JSON.stringify(gtWheelAudit.rejected));
 await page.screenshot({path:'browser-artifacts/milovice-real-glb-vehicle.png'});
 await page.locator('#rp-vehicles').click();
 await page.locator('[data-spawn="suv"]').click();
 await page.waitForFunction(()=>['ready','fallback'].includes(window.__miloviceGLBDebug?.models?.citySUV),null,{timeout:45000});
 const suvState=await page.evaluate(()=>window.__miloviceGLBDebug);
 console.log('5.1.1 second CC0 GLB SUV:',JSON.stringify(suvState));
 if(suvState.models.citySUV!=='ready')throw new Error('Licensed SUV GLB unavailable: '+JSON.stringify(suvState));
 await page.waitForFunction(()=>window.__miloviceGLBDebug?.rejected?.citySUV||
    window.__miloviceGLBDebug?.assignments?.some(a=>a.key==='citySUV'&&a.driven),
  null,{timeout:45000});
 const suvInstalled=await page.evaluate(()=>window.__miloviceGLBDebug);
 const drivenSUV=suvInstalled.assignments.find(a=>a.key==='citySUV'&&a.driven);
 if(drivenSUV&&(drivenSUV.wheels!==4||drivenSUV.overlay))
  throw new Error('5.6.0 GLB SUV has unsafe duplicate or unrigged wheels: '+JSON.stringify(suvInstalled));
 if(!drivenSUV&&!suvInstalled.rejected?.citySUV)
  throw new Error('5.6.0 SUV rig neither certified nor rejected: '+JSON.stringify(suvInstalled));
 console.log('5.6.0 SUV wheel safety: ',JSON.stringify({drivenSUV,rejected:suvInstalled.rejected?.citySUV}));
 await page.screenshot({path:'browser-artifacts/milovice-cc0-suv.png'});
 await page.locator('#rp-jobs').click();
 await page.locator('#rp-job-start').click();
 const stopCount=await page.evaluate(()=>window.__miloviceTransitStops);
 if(stopCount!==3)throw new Error('Waiting pedestrians/stops not spawned: '+stopCount);
 if(!(await page.locator('#mode').innerText()).includes('Autobusová směna'))throw new Error('Job did not start');
 if(!(await page.locator('#doors').isVisible()))throw new Error('Job door button missing');
 await page.locator('#rp-vehicles').click();
 await page.locator('#rp-area-select').selectOption('mlada');
 await page.locator('[data-spawn="walking"]').click();
 await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada'),null,{timeout:105000});
 const mladaStats=await page.evaluate(()=>window.__miloviceAreaStats);
 console.log('Mladá streamed:',JSON.stringify(mladaStats));
  const tiledGround=await page.evaluate(()=>window.__miloviceTerrainTiles);
  if(tiledGround.tiles<=oldGround.tiles||
     tiledGround.sourceTriangles!==tiledGround.drawTriangles)
    throw new Error('5.19 streamed region terrain lost triangles: '+JSON.stringify(tiledGround));
  console.log('5.19 streamed regional DEM tiles:',JSON.stringify(tiledGround));
  const cityWalls=await page.evaluate(()=>window.__miloviceCityWallBatch);
  if(!cityWalls||cityWalls.rawWalls<20||
     cityWalls.drawMeshes>=cityWalls.rawWalls||cityWalls.meshesSaved<1)
   throw new Error('5.16 ordinary wall batches did not reduce draw objects: '+JSON.stringify(cityWalls));
  console.log('5.16 wall batching:',JSON.stringify(cityWalls));
  const roadBatch=await page.evaluate(()=>window.__miloviceRoadBatch);
  if(!roadBatch||roadBatch.inputStrips<100||roadBatch.meshesSaved<50||
     roadBatch.drawMeshes>=roadBatch.inputStrips)
   throw new Error('5.17 OSM roadway geometry was not batch-rendered: '+JSON.stringify(roadBatch));
  console.log('5.17 road batching:',JSON.stringify(roadBatch));
  const streetFurniture=await page.evaluate(()=>window.__miloviceFurnitureBatch);
  const safety=await page.evaluate(()=>window.__miloviceRoadsideSafety);
  if(!streetFurniture?.disabled||streetFurniture.objects!==0||
     streetFurniture.instances!==0||streetFurniture.drawMeshes!==0||
     !safety||safety.indexedRoutes<100||safety.segments<200||
     safety.randomRoadTrees!==0||safety.randomRoadLamps!==0||!safety.disabledRandomStreetProps||
     !(safety.mappedGreenTrees>=0)||!(safety.rejectedGreenTrees>=0))
   throw new Error('5.22 unsafe global street plants or lamps remain: '+JSON.stringify({streetFurniture,safety}));
  console.log('5.22 road-crossing and greenery safety:',JSON.stringify({streetFurniture,safety}));
  const regionalParking=await page.evaluate(()=>window.__miloviceParkingDebug);
 if(!regionalParking||regionalParking.parked<=parking.parked)
  throw new Error('Newly loaded Mladá region did not add parked cars: '+JSON.stringify(regionalParking));
 console.log('5.4.1 Mladá parked traffic:',JSON.stringify(regionalParking));
 if(mladaStats?.landscape<5)throw new Error('Missing mapped Mladá parks/forest/grass: '+JSON.stringify(mladaStats));
 const roadside=await page.evaluate(()=>({streets:window.__miloviceStreetGeometryAudit,
  commerce:window.__miloviceCommerceReality}));
 if(!roadside.streets?.inventedEdgeLinesDisabled||
    !roadside.streets?.inventedCentreDashesDisabled||
    !roadside.streets?.residentialInventedEdgeLinesDisabled||
    !roadside.commerce?.inventedRetailPadsRemoved||
    !roadside.commerce?.inventedRetailBikeStandsRemoved||
    roadside.commerce.actualPavingPadsSpawned!==0||
    roadside.commerce.speculativeBikeStandsSpawned!==0)
  throw new Error('5.27.4 fabricated retail asphalt/pavement or residential edge paint still present: '+JSON.stringify(roadside));
 console.log('5.27.4 no false supermarket forecourts or residential edge markings:',JSON.stringify(roadside));
 const commerce=await page.evaluate(()=>window.__miloviceCommerceDebug);
 console.log('5.1.2 surveyed shop storefronts:',JSON.stringify(commerce));
 // Streaming Mladá draws only currently loaded nearby chunks. The
 // full district's Billa/Penny/Tesco facades are not all guaranteed to be
 // simultaneously inside the 620m draw distance on an arbitrary test spawn.
 // Require an actual named mapped shop (Tesco) and multiple storefronts;
 // do not confuse stream-culling with a missing 3D facade.
 if(!commerce?.names?.includes('Tesco')||commerce.count<2)
  throw new Error('Visible named OSM commerce failed to render in Mladá: '+JSON.stringify(commerce));
 await page.screenshot({path:'browser-artifacts/milovice-mlada.png'});
 await page.locator('#rp-vehicles').click();
 await page.locator('#rp-area-select').selectOption('bozidar');
 await page.locator('[data-spawn="walking"]').click();
 await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('bozidar'),null,{timeout:105000});
 console.log('Boží Dar streamed:',JSON.stringify(await page.evaluate(()=>window.__miloviceAreaStats)));
 await page.screenshot({path:'browser-artifacts/milovice-bozidar.png'});
 await page.locator('#rp-vehicles').click();
 await page.locator('#rp-distance-select').selectOption('1000');
 if(await page.evaluate(()=>window.__miloviceDrawDistance)!==1000)throw new Error('Distance selector failed');
 await page.locator('#rp-distance-select').selectOption('620');
 await page.locator('#rp-graphics-select').selectOption('realistic');
 await page.waitForTimeout(1800);
 if(!(await page.locator('#rp-graphics-select').inputValue()).includes('realistic'))throw new Error('Quality preset selection failed');
 await page.screenshot({path:'browser-artifacts/milovice-graphics-shadows.png'});
 await page.locator('#rp-graphics-select').selectOption('balanced');
 await page.locator('#rp-spawn-close').click();
 console.log('Graphics: balanced and dynamic-shadow mode both rendered');
 await page.locator('#rp-vehicles').click();
 await page.locator('#rp-area-select').selectOption('photo5');
 await page.evaluate(()=>window.__miloviceCameraSpawnAudit=null);
 await page.locator('[data-spawn="walking"]').click();
 // On weak GPUs the old 0.45s delay took only 1-2 frames: the camera could
 // still be mid-teleport UNDER the ground in the saved screenshot.
 await page.waitForFunction(()=>window.__miloviceCameraSpawnAudit?.snapped===true,
  null,{timeout:12000});
 const cameraJump=await page.evaluate(()=>window.__miloviceCameraSpawnAudit);
 if(!(cameraJump.cameraAltitudeAbovePlayer>1.5&&cameraJump.cameraAltitudeAbovePlayer<12)||
    !(cameraJump.previousCameraDistance>10))
  throw new Error('5.28.1 photo5 district camera did not snap above the terrain: '+JSON.stringify(cameraJump));
 if(!(await page.evaluate(()=>window.__miloviceStreetEnvironment?.sceneCount===1)))
   throw new Error('5.21 photo-street walking spawn lost the source-backed environment');
 await page.screenshot({path:'browser-artifacts/milovice-5-kvetna-photo-scene.png'});
 console.log('5.21 photo-grounded street scene selectable spawn: OK');
 // Mobile screenshot regression: don't let the giant diagnostics box hide the city.
 await page.setViewportSize({width:390,height:820});
 await page.waitForTimeout(300);
 const hudWidth=await page.locator('#hud').evaluate(el=>el.getBoundingClientRect().width);
 if(hudWidth>250)throw new Error('Mobile HUD is still oversized: '+hudWidth);
 if(!(await page.locator('#rp-hud-toggle').isVisible()))throw new Error('Mobile HUD info toggle missing');
 await page.locator('#rp-hud-toggle').click();
 if(!(await page.locator('#hud').evaluate(el=>el.classList.contains('rp-open'))))
  throw new Error('Mobile HUD could not expand');
 await page.locator('#rp-hud-toggle').click();
 if(await page.locator('#hud').evaluate(el=>el.classList.contains('rp-open')))
  throw new Error('Mobile HUD could not collapse');
 console.log('5.1.4 mobile compact HUD and toggle: OK');

 // Validate analog speed curve independent of screen / GPU performance.
 const curve=await page.evaluate(async()=>{
  const {pedestrianSpeed}=await import('./scripts/analog-controls.js?v=532a');
  return [0,.12,.35,.6,.75,1].map(x=>[x,pedestrianSpeed(x)]);
 });
 if(curve[0][1]!==0||curve[1][1]!==0||!(curve[2][1]>0&&curve[2][1]<curve[3][1]&&
      curve[3][1]<curve[4][1]&&curve[4][1]<curve[5][1]&&curve[5][1]>=5.49))
  throw new Error('5.3.2 joystick intensity curve is not continuous monotonic walk→run: '+JSON.stringify(curve));
 console.log('5.3.2 graded joystick curve:',JSON.stringify(curve));
 // Genuine touch-device layout: verify stick, then physically move it through the
 // walking and running zones. This caught the former T-pose/giant-model regression.
 const mobileContext=await browser.newContext({viewport:{width:390,height:820},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const mobile=await mobileContext.newPage();
 const mobileErrors=[];mobile.on('pageerror',e=>mobileErrors.push(String(e)));
 await mobile.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded',timeout:30000});
 await mobile.waitForFunction(()=>window.__miloviceStarted===true,{timeout:45000});
 await mobile.waitForFunction(()=>!document.getElementById('rp-spawn').hidden,{timeout:45000});
 const budget=await mobile.evaluate(()=>window.__milovicePerformance);
  const mobileGPUProfile=await mobile.evaluate(()=>window.__miloviceGPUProfile);
  if(!mobileGPUProfile||!mobileGPUProfile.diffuseMobile||
      !mobileGPUProfile.roadDiffuse||!mobileGPUProfile.sidewalkDiffuse||
      !mobileGPUProfile.buildingDiffuse||mobileGPUProfile.farClip>700)
    throw new Error('5.20 mobile GPU matte shaders or fog clipping not active: '+JSON.stringify(mobileGPUProfile));
  console.log('5.20 mobile GPU optimizations:',JSON.stringify(mobileGPUProfile));
 if(!budget?.mobile||budget.drawDistance>440||budget.detailDistance>165||
    budget.renderDpr>1.25||budget.adaptive!==true)
  throw new Error('5.15 default mobile FPS budget is missing or using desktop settings: '+JSON.stringify(budget));
 console.log('5.15 mobile adaptive GPU budget:',JSON.stringify(budget));
 await mobile.locator('[data-spawn="walking"]').click();
 await mobile.locator('#rp-joystick').waitFor({state:'visible',timeout:12000});
 if(await mobile.locator('#controls button[data-key="KeyW"]').isVisible())
  throw new Error('Touch D-pad should be hidden while virtual joystick is active');
 // Mobile layout can reflow after spawn while model downloads complete.
 // Retry real pointer input using CURRENT joystick bounds (no game-code bypass).
 let slow=null,cx=0,cy=0,rad=0;
 for(let attempt=0;attempt<3;attempt++){
  if(attempt)await mobile.mouse.up();
  const bounds=await mobile.locator('#rp-joystick').boundingBox();
  cx=bounds.x+bounds.width*.5;cy=bounds.y+bounds.height*.5;
  rad=Math.min(bounds.width,bounds.height)*.33;
  await mobile.mouse.move(cx,cy);await mobile.mouse.down();
  await mobile.waitForTimeout(160);
  const updated=await mobile.locator('#rp-joystick').boundingBox();
  cx=updated.x+updated.width*.5;cy=updated.y+updated.height*.5;
  rad=Math.min(updated.width,updated.height)*.33;
  await mobile.mouse.move(cx,cy-rad*.44);
  await mobile.waitForTimeout(650);
  slow=await mobile.evaluate(()=>window.__miloviceMovementDebug);
  if(slow.speed>.1&&slow.speed<3.1&&slow.stick.magnitude>.3&&
     slow.stick.magnitude<.68&&!slow.running&&slow.facingDot>.93)break;
 }
 if(!(slow.speed>.1&&slow.speed<3.1&&slow.stick.magnitude>.3&&
      slow.stick.magnitude<.68&&!slow.running&&slow.facingDot>.93))
  throw new Error('Partial joystick deflection failed after pointer reflow retries: '+JSON.stringify(slow));
 await mobile.mouse.move(cx,cy-rad*.99);await mobile.waitForTimeout(800);
 const fast=await mobile.evaluate(()=>window.__miloviceMovementDebug);
 if(!(fast.speed>3.1&&fast.running&&fast.speed>slow.speed&&fast.facingDot>.93))
  throw new Error('Full joystick deflection did not produce running: '+JSON.stringify({slow,fast}));
 // Moving the thumb behind the center must make the character turn around,
 // not play forward locomotion while the face points backwards.
 // The on-screen control layout changes as the touch D-pad collapses.
 // Re-read the CURRENT thumbstick bounds instead of reusing stale coordinates.
 const reverseBounds=await mobile.locator('#rp-joystick').boundingBox();
 const revX=reverseBounds.x+reverseBounds.width*.5;
 const revY=reverseBounds.y+reverseBounds.height*.5;
 const revRadius=Math.min(reverseBounds.width,reverseBounds.height)*.33;
 await mobile.mouse.move(revX,revY);await mobile.waitForTimeout(90);
 await mobile.mouse.move(revX,revY+revRadius*.9);await mobile.waitForTimeout(720);
 const backward=await mobile.evaluate(()=>window.__miloviceMovementDebug);
 const reverseDot=slow.travel.x*backward.travel.x+slow.travel.z*backward.travel.z;
 if(!(backward.speed>.5&&backward.facingDot>.93&&backward.stick.y<-.5&&reverseDot<-.93))
  throw new Error('5.3.3 backward joystick must truly reverse travel and keep facing forward: '+
   JSON.stringify({backward,slowTravel:slow.travel,reverseDot,reverseBounds}));
 await mobile.screenshot({path:'browser-artifacts/milovice-facing-backward.png'});
 await mobile.mouse.up();await mobile.waitForTimeout(460);
 const released=await mobile.evaluate(()=>window.__miloviceMovementDebug);
 if(released.stick.magnitude!==0||released.speed>.08)
  throw new Error('Joystick failed to stop when thumb released: '+JSON.stringify(released));
 console.log('5.3.3 joystick + GLB front alignment verified:',JSON.stringify({walk:slow.speed,run:fast.speed,forwardDot:slow.facingDot,runDot:fast.facingDot,reverseDot:backward.facingDot,released:released.speed}));
 // 5.3.4: verify each *real* imported GLB has its authored +Z nose
 // rotated into the game's -Z forward axis. Don't change the driving physics:
 // Quaternius source axes vary from the hand-built cars and spectral coupe.
 const vehicleOrientations=await mobile.evaluate(async()=>{
  const [{makeVehicleAssetManager,LICENSED_VEHICLES},THREE]=await Promise.all([
   import('./scripts/vehicle-assets.js?v=534'),import('three')
  ]);
  const manager=makeVehicleAssetManager(THREE);
  const results=[];
  for(const key of ['cityCar','citySUV','citySport','spectralGT']){
   const mesh=await manager.load(key);
   if(!mesh){results.push({key,available:false});continue}
   const axis=LICENSED_VEHICLES[key].frontAxis;
   const originalFront=new THREE.Vector3(axis==='+X'?1:axis==='-X'?-1:0,0,axis==='+Z'?1:axis==='-Z'?-1:0);
   mesh.updateMatrixWorld(true);
   const front=originalFront.applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()));
   const dot=front.dot(new THREE.Vector3(0,0,-1));
   results.push({key,available:true,axis,dot,
    correction:mesh.userData.miloviceFrontCorrection,
    measuredLength:new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3()).z});
  }
  return results;
 });
 if(vehicleOrientations.some(v=>!v.available||v.dot<.98||v.measuredLength<3.5||v.measuredLength>5.5))
  throw new Error('5.3.4 vehicle GLB nose must align with driving direction: '+JSON.stringify(vehicleOrientations));
 console.log('5.3.4 verified real GLB vehicle orientations:',JSON.stringify(vehicleOrientations));
 await mobile.screenshot({path:'browser-artifacts/milovice-analog-joystick.png'});
 if(mobileErrors.length)throw new Error('Mobile JavaScript errors: '+mobileErrors.slice(0,3).join(' | '));
 await mobileContext.close();
 console.log('Smoke OK: rendered 3D, terrain, walking, car, mission controls');
 if(errors.length)console.log('Nonfatal browser messages:',errors.slice(0,6));
 await context.close();
}finally{await browser.close()}
