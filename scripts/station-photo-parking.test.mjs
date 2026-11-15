// Milovice RP 5.76 — true road-parallel exterior edge, not gridded curb stair steps
// from recurring. Verify original OSM ways, full-stone-rectangle road checks,
// photo-camera correlation, no fake cars, and constant draw-call budget.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance,isRoadFreeRect} from './road-clearance.js';
import {STATION_PARKING_REFERENCE,planStationPhotoParking,planContinuousOuterSidewalk,planRoadSafeParkingInfillProfiles,planSatelliteParkingMarkings,planRailApronProfiles,planRailApronBoundaryKerbs} from './station-photo-parking.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';

const data=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const ways=data.elements;
const west=ways.find(e=>e.id===STATION_PARKING_REFERENCE.westAccessWayId);
const east=ways.find(e=>e.id===STATION_PARKING_REFERENCE.eastStreetWayId);
assert.equal(west?.id,675778842,'Mapped station one-way driveway');
assert.equal(east?.id,128308366,'Mapped eastern Nádražní road');
assert.equal(west.tags.highway,'service');
assert.equal(west.tags.oneway,'yes');
assert.equal(east.tags.highway,'residential');
assert.equal(STATION_PARKING_REFERENCE.photos.length,2);
assert(STATION_PARKING_REFERENCE.photos.every(x=>x.date==='2024-05-30'&&
 x.url.startsWith('https://commons.wikimedia.org/wiki/File:')));
assert(STATION_PARKING_REFERENCE.userReference.includes('2022-05-17'));
assert(STATION_PARKING_REFERENCE.observed.some(x=>x.includes('large pale paved parking island')));
assert.equal(STATION_PARKING_REFERENCE.license,'CC BY 4.0');
assert.equal(STATION_PARKING_REFERENCE.aerial2023.date,'2023-06-04');
assert(STATION_PARKING_REFERENCE.aerial2023.confirmed.some(x=>
 x.includes('continuous pale rail-side paved angled parking')));
assert.equal(STATION_PARKING_REFERENCE.aerial2023.limitations.includes('not surveyed'),true);
const occupied=createRoadClearance();
for(const e of ways){
 if(!e.tags?.highway||!e.geometry?.length)continue;
 const kind=e.tags.highway;
 const width=kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:
  kind==='pedestrian'?4:kind==='footway'?1.8:kind==='path'||kind==='steps'?1.65:
  kind==='cycleway'?2:kind==='service'?4.5:7.8;
 occupied.addRoad({id:e.id,points:e.geometry.map(p=>{
  const w=stationGpsToWorld(p);return {x:w.x,z:w.z};
 }),width,kind});
}
const plan=planStationPhotoParking(ways,occupied);
assert(plan,'The 2022/2024 photographs must still bind to both OSM roads');
assert.deepEqual(plan.sourceIds,[675778842,128308366]);
assert.equal(plan.sourcePhotos,2);
assert.equal(plan.photoInformed,true);
assert.equal(plan.exactParkingOutlineMeasured,false);
assert.equal(plan.groundType,'concrete-paving-island');
assert.equal(plan.legacyDetachedStripsRemoved,true);
assert.equal(plan.originalCarriagewaysUntouched,true);
assert.equal(plan.modelledRoundedNose,true);
assert(plan.cameras.every(p=>p.distance<3));
assert(plan.cells.length>400&&plan.cells.length<700,
 'Central parking must regain its full width with OUTER sidewalk on OSM: '+plan.cells.length);
assert(plan.rowStats.filter(r=>r.accepted>0).length>=55,
 'The median must be a continuous length of forecourt, not tiny separated strips');
assert(plan.rowStats.slice(12,25).every(r=>r.accepted>=6),
 'The inner parking cells must be full-width, not sacrificed to a false walkway');
assert(plan.rowStats.at(-1).accepted<=3,
 'Photo-informed far-end taper must narrow to a rounded tip');
assert.equal(plan.protectedRoadsAndPaths,true);
assert.equal(plan.protectedBuildings,true);
assert.equal(plan.protectedRailways,true);
assert.deepEqual(plan.parkingBanks,['central-between-roads','opposite-rail-side'],
 'Both distinct parking banks must remain rendered');
assert(plan.railSideParking.length>=18&&plan.railSideParking.length<=24,
 'The other half of the car park cannot disappear again');
assert.equal(plan.aerialReferenceDate,'2023-06-04');
assert.equal(plan.railParkingSurface,'continuous-pale-concrete-with-safe-bridges');
assert.equal(plan.railPavingVariableDepth,true);
assert.equal(plan.railPavingBaseDepth,4.02);
assert.equal(plan.railPavingRoadFacingOffset,-3.02);
assert(plan.railSideParking.some(b=>b.depth>4.37),
 'The aerial shows a wider rail-side apron through its middle, not a fixed long rectangle');
assert.equal(plan.railPavingTrafficEdgeSafelyExtended,true);
assert(plan.railPavingSeamCells>=2,
 'At least some individually checked bays should reduce the unrealistic grassy road seam');
assert(plan.railPavingLargestSeamReduction>.10&&
 plan.railPavingLargestSeamReduction<=.361,
 'Do not move road-facing paving more than tested 36cm toward service traffic');
for(const bay of plan.railSideParking){
 assert(bay.depth>=4.02&&bay.depth<=6.01);
 assert(bay.roadFacingEdge>=-3.02000001&&bay.roadFacingEdge<=-2.65999999);
 assert(Math.abs(bay.offset+bay.depth/2-bay.roadFacingEdge)<1e-9);
 assert(Math.abs(bay.offset-bay.depth/2-bay.railFacingEdge)<1e-9);
 assert(Math.abs(bay.roadFacingEdge+3.02-bay.roadsideSeamClosedMetres)<1e-9,
  'Paving may only narrow grass seam with independently road-safe testing');
 assert(isRoadFreeRect(occupied,{x:bay.x,z:bay.z,
  length:bay.length,depth:bay.depth,yaw:bay.yaw,buffer:.12,step:.36}),
  'Every widened rail-side bay must stay outside OSM roads and footways');
}
const apron=planRailApronProfiles([...plan.railSideParking,...plan.railSideJoiningSlabs]);
assert(apron&&apron.profiles.length>=plan.railSideParking.length);
assert.equal(apron.variableDepth,true);
assert.equal(apron.noFootprintExpansion,true);
assert(apron.originalRoadFacingOffset>=-3.02000001&&
 apron.originalRoadFacingOffset<=-2.65999999);
for(const p of apron.profiles){
 assert(p.validSafeRect);
 assert(p.startRail>=p.railSide&&p.endRail>=p.railSide);
 assert(p.startRoad<=p.roadSide&&p.endRoad<=p.roadSide);
 assert(p.startRoad>p.startRail&&p.endRoad>p.endRail);
}
assert.equal(planRailApronProfiles([]),null);
// Rail-facing kerbs + two short terminal returns are derived ONLY from
// accepted paved slabs, never from unlocated planting-bed guesswork.
const railKerbs=planRailApronBoundaryKerbs(
 [...plan.railSideParking,...plan.railSideJoiningSlabs],plan.frame,occupied);
assert(railKerbs&&railKerbs.sections.length>=30,
 'The rail-facing kerb must run along the photo-confirmed parking apron');
assert.equal(railKerbs.endCaps.length,2,
 'Both ends need a short low kerb without blocking the access aisle');
assert.equal(railKerbs.noNewParkingFootprint,true);
assert.equal(railKerbs.railFacingOnly,true);
assert.equal(railKerbs.plantingCoordinatesUnverified,true);
assert.deepEqual(plan.railApronKerbs,railKerbs);
const railSafeSources=[...plan.railSideParking,...plan.railSideJoiningSlabs];
for(const section of [...railKerbs.sections,...railKerbs.endCaps]){
 assert.equal(section.sourceRectValidated,true);
 assert(section.length>.11&&section.depth===.09);
 assert(isRoadFreeRect(occupied,{x:section.x,z:section.z,
  length:section.length,depth:section.depth,yaw:section.yaw,
  buffer:.035,step:.14}), 'Kerb must clear every OSM roadway and footway');
 const owner=railSafeSources.find(p=>Math.abs(p.along-section.sourceAlong)<.00001);
 assert(owner,'Each kerb must be linked to a previously approved parking slab');
 for(const tip of [section.from,section.to]){
  assert(Math.abs(tip.along-owner.along)<=owner.length/2+.001);
  assert(tip.offset>=owner.offset-owner.depth/2-.001);
  assert(tip.offset<=owner.offset+owner.depth/2+.001);
 }
}
assert.equal(planRailApronBoundaryKerbs([],plan.frame,occupied),null);
assert.equal(plan.terminalPlantingBedsDeferred,true);

assert.equal(plan.railGrassGridRemoved,true,
 'User 2023 aerial requires paved bank, NOT separate concrete pads in grass');
assert(plan.railSideJoiningSlabs.length>10,
 'The 0.39m gaps between accepted rail bays should now have verified paving bridges');
for(const slab of plan.railSideJoiningSlabs){
 assert.equal(slab.railRoadVerified,true);
 assert(isRoadFreeRect(occupied,{x:slab.x,z:slab.z,
  length:slab.length,depth:slab.depth,yaw:slab.yaw,buffer:.022,step:.36}),
  'Every rail parking connector must retain clearance to OSM roads and footpaths');
}
assert.equal(plan.diagonalBayMarkingsPhotoApproximate,true);
assert(plan.bayMarkings.rail.length>=14,
 'Rail-side parking must no longer be a blank row of disconnected green-grid tiles');
assert(plan.bayMarkings.central.length>=6,
 'Central paved parking island must show the diagonal bay separations documented in 2023 aerial');
assert.equal(plan.bayMarkings.measuredStallCount,false);
assert.equal(plan.bayMarkings.basedOnUnchangedRoads,true);
const recomputedBayLines=planSatelliteParkingMarkings(plan.frame,plan.railSideParking,
 plan.centralParkingCells,occupied);
assert.deepEqual(recomputedBayLines,plan.bayMarkings);
for(const marking of plan.bayMarkings.all){
 assert.equal(marking.sourcePhotoDate,'2023-06-04');
 assert.equal(marking.realMarkingMeasured,false);
 assert(marking.width<=.07501&&marking.length>1.85);
 assert(isRoadFreeRect(occupied,{x:marking.x,z:marking.z,
  length:marking.length,depth:marking.width,yaw:marking.yaw,
  buffer:.025,step:.18}),
  'Never paint white bays over an OSM-mapped vehicle roadway');
 if(marking.bank==='rail'){
  const bay=plan.railSideParking.find(b=>
   Math.abs(marking.start.along-b.along)<b.length/2);
  assert(bay&&Math.abs(marking.end.along-bay.along)<bay.length/2);
  assert([marking.start,marking.end].every(p=>
   Math.abs(p.offset-bay.offset)<bay.depth/2));
 }else if(marking.bank==='central'){
  for(let i=0;i<=8;i++){
   const t=i/8,along=marking.start.along+
    (marking.end.along-marking.start.along)*t;
   const offset=marking.start.offset+
    (marking.end.offset-marking.start.offset)*t;
   assert(plan.centralParkingCells.some(c=>
     Math.abs(c.along-along)<=c.length/2+.035&&
     Math.abs(c.offset-offset)<=c.depth/2+.035),
    'Satellite-backed central line must stay on PRE-VALIDATED parking tiles');
  }
 }
}
assert.equal(planSatelliteParkingMarkings(null,[],[],occupied),null);
assert.equal(planSatelliteParkingMarkings(plan.frame,[],[],null),null);
assert(!('railSidewalk' in plan),
 'The incorrectly placed outer rail-side walkway must be completely removed');
assert(!('railSideCurbs' in plan),
 'No stray kerb can remain on the wrong rail-side sidewalk');
assert.equal(plan.incorrectlyPlacedRailSidewalkRemoved,true);
assert.notEqual(plan.centralParkingCells,plan.cells,
 'Carved sidewalk must REMOVE a strip from the broad parking surface instead of drawing over asphalt');
assert(plan.centralParkingCells.length>270,
 'Parking still needs a broad contiguous surface after a narrow sidewalk is carved');
assert(!('centralWalkingCells' in plan),
 'The 5.69 mistaken designation of 249 parking tiles as sidewalk must never return');
assert.equal(plan.mistakenParkingAsSidewalkRemoved,true);
assert.equal(plan.centralPedestrianSurface,'carved-from-OSM-safe-outer-parking-cells');
assert.equal(plan.centralParkingSurface,'remaining-inner-grid-parking-cells');
assert.equal(plan.pedestrianStripSide,'outer-east-facing-Nadrazni-128308366');
assert.equal(plan.pedestrianStripOsmAnchored,false);
assert.equal(plan.pedestrianStripPhotoEstimated,true);
assert.equal(plan.originalRoadSurfaceUnmodified,true);
assert.equal(plan.outerFootwayRendering,'road-axis-aligned-continuous-terrain-ribbon',
 'Sidewalk must follow Nádražní road centreline, not the grid-edge of every parking tile');
assert(plan.outerSidewalkCells.length>=100,'A true long sidewalk needs many contiguous safe parking cells');
const smooth=planRoadSafeParkingInfillProfiles(plan.outerSidewalkCells);
assert(smooth,'Only contiguous verified footway cells may feed the smooth underside');
assert(smooth.rows.length>55&&smooth.joins>50);
assert.equal(smooth.roadSafeCellsOnly,true);
assert.equal(smooth.areaExpanded,false);
assert.equal(smooth.sourceCells,plan.outerSidewalkCells.length);
assert.equal(smooth.maxSlope,.12);
const smoothSpikes=smooth.rows.slice(1).map((r,i)=>{
 const prev=smooth.rows[i];
 return {along:+r.along.toFixed(2),gap:+(r.along-prev.along).toFixed(2),
  step:+Math.abs(r.edge-prev.edge).toFixed(3),
  low:+r.low.toFixed(2),high:+r.high.toFixed(2),
  previousLow:+prev.low.toFixed(2),previousHigh:+prev.high.toFixed(2)};
}).filter(r=>r.gap<=.81).sort((a,b)=>b.step-a.step).slice(0,6);
assert(smooth.maxEdgeStep<.22,
 'Roadside envelope unexpectedly stepped: '+JSON.stringify(smoothSpikes));
for(const r of smooth.rows){
 assert(r.edge<=r.high+.00001,'Smooth roadside envelope must stay inside approved cell edge');
 const required=r.cellCount===1?.099:.279;
 assert(r.edge>=r.low+required,'Infill must have safe positive width, including tip');
 assert(r.start<=r.edge+.00001&&r.end<=r.edge+.00001);
 assert(r.start>=r.low-.012&&r.end>=r.low-.012,
  'Joined profiles may taper but never leave the validated cell footprint');
 assert(r.high-r.low>=.7);
}
assert.equal(planRoadSafeParkingInfillProfiles([]),null);
assert.equal(planRoadSafeParkingInfillProfiles(null),null);
assert.equal(planRoadSafeParkingInfillProfiles(plan.outerSidewalkCells,{maxSlope:0}),null);
assert(plan.centralParkingCells.length+plan.outerSidewalkCells.length===plan.cells.length,
 'No parking tile can be lost or painted twice when carving the sidewalk');
assert(Number.isInteger(plan.edgeSpursTrimmed)&&plan.edgeSpursTrimmed>=0,
 'Photo regression must expose how many isolated outside-edge blocks were removed');
const islandRows=new Map();
for(const c of plan.cells){
 if(!islandRows.has(c.along))islandRows.set(c.along,[]);
 islandRows.get(c.along).push(c);
}
for(const row of islandRows.values()){
 row.sort((a,b)=>a.offset-b.offset);
 if(row.length>1)assert(row.at(-1).offset-row.at(-2).offset<=.775,
  'A detached paving patch must not protrude from the outside sidewalk edge');
}
assert(plan.rejected.filter(x=>x.reason==='isolated-outer-island-spur').length===
 plan.edgeSpursTrimmed,'Every removed photographic spur must remain auditable');
const ribbon=planContinuousOuterSidewalk(plan.outerSidewalkCells,{
 frame:plan.frame,roadCenterline:east.geometry.map(stationGpsToWorld),
 roadWidth:7.8,roadSetback:.40
});
assert(ribbon?.roadAxisAligned,'Actual Nádražní polyline must drive the outer edge');
assert.equal(ribbon.referenceRoadId,128308366);
assert(ribbon.roadMarginMin>=.38,
 'The continuous curb cannot lie on the Nádražní carriageway');
assert(ribbon.maxBodyEdgeStep<=.115,
 'The sidewalk outer edge may not jump in .74-metre Minecraft stairs');
const body=ribbon.profiles.filter(r=>r.safe&&r.along>=8&&r.along<=60);
assert(body.length>55);
for(let i=1;i<body.length;i++){
 if(body[i].along-body[i-1].along>.81)continue;
 assert(body[i].high<=body[i-1].high+.001,
  'Nádražní-side curb must follow smoothly narrowing road space');
 assert(Math.abs(body[i].high-body[i-1].high)<=.115,
  'Neighbouring road-facing curb edges must vary smoothly, not one tile-width');
}
for(const r of ribbon.profiles.filter(x=>x.safe)){
 assert(r.high<=r.highSafe+.00001,'Never grow sidewalk onto asphalt');
 assert(r.low>=r.lowSafe-.00001,'Never encroach on parking cells');
 assert(r.roadOffset-r.high-3.9>=.38,
  'Outer sidewalk edge must have a margin from the mapped 7.8m road');
}
assert.deepEqual(ribbon,plan.continuousRibbon,
 'The road-like strip must match the exact cached plan from safe parking cells');
assert(ribbon.parts.length>=1&&ribbon.parts.length<=4,
 'Paving must be one mostly contiguous strip, not dozens of disconnected squares');
assert(ribbon.rows>=65&&ribbon.joins>=60&&ribbon.metres>45,
 'Long sidewalk must join many adjacent OSM-safe parking rows');
assert(ribbon.triangles>=120&&ribbon.pavementPanels===0,
 'A continuous triangle ribbon replaces every individual square sidewalk panel');
assert.equal(ribbon.roadFootprintExpansion,false,
 'Never widen the path into the roadway');
for(const part of ribbon.parts){
 assert(part.length>=2);
 for(let i=0;i<part.length;i++){
  const cross=part[i];
  assert(cross.high-cross.low>.3,'Pavement strip needs safe visible width');
  if(i)assert(cross.along>part[i-1].along,'Ribbon must progress without reversing');
  for(const lateral of [cross.low,cross.high]){
   const covered=plan.outerSidewalkCells.some(cell=>
    Math.abs(cell.along-cross.along)<=cell.length/2+.008 &&
    lateral>=cell.offset-cell.depth/2-.008 &&
    lateral<=cell.offset+cell.depth/2+.008);
   assert(covered,'Ribbon vertices must stay inside validated island cell footprints');
  }
 }
}
assert.equal(plan.rejected.filter(x=>x.reason==='isolated-outer-island-spur').length,
 plan.edgeSpursTrimmed,'Every removed photographic spur must remain auditable');

for(const p of plan.outerSidewalkCells)
 assert(isRoadFreeRect(occupied,{
  x:p.x,z:p.z,length:p.length+.012,depth:p.depth+.012,
  yaw:p.yaw,buffer:.009,step:.3
 }), 'Seam-closed sidewalk texture must still stay away from all mapped roads');
assert(plan.outerSidewalkMaxOsmDistance<4.5,
 'Carved path must be near the real outer OSM sidewalk, not an invented inner edge');
const parkingSet=new Set(plan.centralParkingCells);
const footwaySet=new Set(plan.outerSidewalkCells);
for(const foot of footwaySet){
 assert(!parkingSet.has(foot),'Sidewalk must REPLACE, not overlay, a parking patch');
 assert(isRoadFreeRect(occupied,{
  x:foot.x,z:foot.z,length:foot.length,depth:foot.depth,yaw:foot.yaw,
  buffer:.025,step:.33
 }), 'Carved sidewalk must stay entirely outside carriageways and mapped paths');
 assert(!plan.centralParkingCells.some(p=>p.along===foot.along&&p.offset>foot.offset),
  'The pedestrian band must be the OUTER edge; parkable cells must be INSIDE');
}
assert(plan.outerSidewalkCurbs.length>=70,
 'The outside kerb must follow the recreated sidewalk without touching the road');
assert(!('westPedestrianStrip' in plan),'The incorrectly positioned INNER strip must be absent');
assert(!('outerPedestrianStrip' in plan),
 'Do not replace mapped sidewalks with pale 3D boxes');
assert.equal(plan.outerFootwaySegments.length,3,
 'The photographed exterior sidewalk has THREE true OSM polyline segments');
assert.deepEqual(plan.outerFootwaySegments.map(s=>s.waySegmentIndex),[5,6,7]);
assert(plan.outerFootwaySegments.every(s=>s.sourceWayId===1165594426&&s.metres>2));
assert(plan.outerFootwayStations[0].along<0&&plan.outerFootwayStations.at(-1).along>70);
assert(plan.outerFootwayStations.every((p,i)=>p.offset>5&&
 (!i||p.along>plan.outerFootwayStations[i-1].along)),
 'The actual OSM footway must stay OUTSIDE/EAST of the central parking island');
const mappedSide=ways.find(e=>e.id===1165594426).geometry.slice(4,8)
 .map(stationGpsToWorld);
assert.deepEqual(plan.outerFootwaySegments[0].from,mappedSide[0],
 'Sidewalk must start at authentic OSM point, not an invented parallel road');
assert.deepEqual(plan.outerFootwaySegments.at(-1).to,mappedSide.at(-1),
 'Sidewalk must terminate at authentic OSM coordinate');
assert(plan.cornerPaving.length>=8,
 'Right entrance corner should have a photo-informed paved apron');
assert(plan.cornerPaving.every(p=>Number.isFinite(p.yaw)&&p.length<1),
 'Corner pavers must follow the mapped east-bound pedestrian route');
assert.equal(plan.rightCornerFootwayId,1282187911,
 'Right corner must anchor to the actual OSM turning path, not guessed rails');
assert.equal(plan.centralFootwayId,1165594426,
 'The already mapped central-island footway must remain preserved');
assert.equal(plan.pedestrianCorridorWidth,1.48,
 'Two 0.74m OSM-safe parking columns become the narrow exterior pedestrian strip');
assert(plan.railSideParking.every(b=>b.offset<0),
 'Opposite parking remains, without an invented sidewalk behind it');
for(const p of plan.cornerPaving)
 assert(isRoadFreeRect(occupied,{
  x:p.x,z:p.z,length:p.length,depth:p.depth,yaw:p.yaw,buffer:.09,step:.28
 }), 'Right entrance apron must never cover mapped roads or walking paths');
for(const bay of plan.railSideParking)
 assert(isRoadFreeRect(occupied,{x:bay.x,z:bay.z,length:bay.length,
  depth:bay.depth,yaw:bay.yaw,buffer:.12,step:.36}),
  'Rail-side parking bays may not occupy any OSM road or footpath');
for(const cell of plan.cells){
 assert(isRoadFreeRect(occupied,{
  x:cell.x,z:cell.z,length:cell.length,depth:cell.depth,yaw:cell.yaw,
  buffer:.025,step:.33
 }), 'Paving tile must never lie over roads/footways');
 assert(Number.isFinite(cell.x)&&Number.isFinite(cell.z));
 assert(cell.offset>2.4,'Paver must be to inside of western driveway');
}
// All changes must fail closed if the bounding OSM ways are unavailable.
assert.equal(planStationPhotoParking([],occupied),null);
assert.equal(planStationPhotoParking(ways.filter(e=>e.id!==128308366),occupied),null);
assert.equal(planStationPhotoParking(ways.map(e=>e.id===675778842?{
 ...e,tags:{...e.tags,highway:'footway'}
}:e),occupied),null);
assert.equal(planStationPhotoParking(ways.map(e=>e.id===675778842?{
 ...e,geometry:e.geometry.map(p=>({...p,lon:p.lon+.001}))
}:e),occupied),null);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(game.includes("from './scripts/station-photo-parking.js?v=58117'"));
assert(game.includes('stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})'),
 'The island sidewalk must receive the exact city paving material');
assert(game.includes('stationPhotoParking.reset()'));
assert(!game.includes('osmStrip(points[i-1],points[i],1.8,osmSidewalkMat,.235);'),
 'The 5.72 forced sidewalk directly on Nádražní asphalt MUST be disabled');
assert(game.includes('stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})'),
 'Carved sidewalk must reuse the same existing city paving material');
assert(game.includes("from './scripts/station-photo-parking.js?v=58117'"),
 'The reviewed 5.76 parking geometry must now load safe gap filler, not a stale 5.76 module');
assert(game.includes("const BUILD_ID='20261115-rail-apron-kerb-58117'"),
 'New game version must retain 5.76 parking with the added ticket-machine scene');
assert(game.includes("from './scripts/bike-tower-interior.js?v=5640'"));
assert(game.includes("from './scripts/station-forecourt-pass.js?v=5650'"));
const code=readFileSync(new URL('./station-photo-parking.js',import.meta.url),'utf8');
assert(code.includes('new THREE.InstancedMesh('));
assert(code.includes('estimatedParkingPolygon=true'));
assert(!code.includes('const centralWalkSet='));
assert(!code.includes('centralWalkingCells'),
 'Parking blocks must never be relabelled as pedestrian paving');
assert(!code.includes('for(const p of planned.outerPedestrianStrip)'),
 'Do not bring back offset white boxes');
assert(code.includes('new THREE.BufferGeometry()'));
assert(code.includes("mesh.name=kind==='kerb'?'ContinuousOuterSidewalkKerb':'ContinuousOuterSidewalkPaving'"),
 'Textured pavement and curb must each be one joined surface');
assert(code.includes("const height=kind==='kerb'?.245:.214"),
 'Sidewalk must follow real terrain rather than placing box blocks on the road');
assert(code.includes('planContinuousOuterSidewalk(outerSidewalkCells,{'),
 'Road-aligned ribbon must originate exclusively in safe outer parking patches');
assert(code.includes('frame:f,roadCenterline:other,roadWidth:7.8,roadSetback:.40'),
 'Every sidewalk station must be tied to actual Nádražní OSM centreline');
assert(code.includes('highSafe')&&code.includes('roadEdgeTarget'),
 'Do not derive curb silhouette only from the last paving tile');
assert(code.includes('sx:p.length+.012'),'Parking paver grout must fill the former grass pinstripes');
assert(code.includes('edgeSpursRemoved.add(row.pop())'),
 'Jutting single-row island paving spurs must be removed, not projected over the roadway');
assert(!code.includes('const chamfers=planOuterSidewalkChamfers(tiles);'),
 'No separate 0.75m sidewalk quads may remain');
assert(!code.includes('for(const p of planned.outerSidewalkCurbs)'),
 'No individual Minecraft-like kerbstone boxes along outer sidewalk');
assert(code.includes('for(const row of infillProfile.rows)'),
 'Infill must use a full-length constrained roadside profile, not square tiles');
assert(code.includes('vertices.push(pt.x,terrainAt(pt.x,pt.z)+.193,pt.z)'),
 'The merged smooth infill must remain below the current sidewalk strip');
assert(code.includes('uvs.push(offset/1.8,section.along/8)'),
 'Original sidewalk material must keep stable world-aligned UV');
assert(code.includes('infillExtraDrawCalls:0'));
assert(code.includes('planRoadSafeParkingInfillProfiles(planned.outerSidewalkCells)'));
assert(code.includes('Math.min(...rows.map(other=>other.high+'));
assert(!code.includes('planRoadSafeParkingEdgeChamfers('));
assert(code.includes('smoothRoadsideWithinSafeCells:'));
assert(code.includes('const sections=['));
assert(code.includes('mesh.userData.smoothInfillRows=infillProfile.rows.length'));
const safeInfillTriangles=smooth.rows.length*4;
assert(safeInfillTriangles>200&&safeInfillTriangles<650);
for(const patch of plan.outerSidewalkCells)
 assert(isRoadFreeRect(occupied,{
  x:patch.x,z:patch.z,length:patch.length+.012,depth:patch.depth+.012,
  yaw:patch.yaw,buffer:.009,step:.3
 }), 'No expanded infill patch may touch OSM road or footway');
assert(code.includes("meshFor('sidewalk',sidewalkMaterial)")&&
 code.includes("meshFor('kerb',material.curb)"),
 'Both the pavement and curb must form contiguous meshes, not square blocks');
assert(code.includes('sidewalkMaterial||material.sidewalk'));
assert(code.includes('for(const p of planned.centralParkingCells)'),
 'Entire broad island surface must have real parking blocks');
assert(code.includes('railSideJoiningSlabs.push('));
assert(code.includes("railPaved:new THREE.MeshLambertMaterial"));
assert(code.includes('renderRailApron();'));
assert(code.includes("mesh.name='PhotoConfirmedContinuousRailSideAngledParking'"));
assert(code.includes('planRailApronProfiles([...planned.railSideParking,'));
assert(code.includes('const midBulge=Math.max(0,Math.sin(Math.PI*t))'));
assert(code.includes('const roadEdge=Math.min(previous.roadFacingEdge,next.roadFacingEdge)'));
assert(code.includes('const railEdge=Math.max(previous.railFacingEdge,next.railFacingEdge)'));
assert(code.includes('for(const candidate of [-2.90,-2.78,-2.66])'));
assert(code.includes('if(safePlace(trial,2.46,trialDepth,.12))break;'));
assert(!code.includes('batch(group,material.railPaved,railPaving)'));
assert(code.includes('batch(group,material.bayLines,photoBayLines)'));
assert(code.includes('for(const stripe of planned.bayMarkings.all)'));
assert(!code.includes('material.railGrid'));
assert(!code.includes('oppositeGrass.push('));
assert(!code.includes('for(let i=0;i<4;i++)for(let j=0;j<7;j++)'),
 'Grass-grid squares from the old schematic should never return');
assert(!code.includes('batch(group,material.railPaver,oppositePavers'));
assert(code.includes('for(let i=-1;i<=1;i+=2)'),
 'Smaller 2x2 concrete pavers must replace the previous oversized white blocks');
assert(!code.includes('new THREE.Mesh(new THREE.BoxGeometry('));
assert(!code.includes('document.createElement'),'No Mapy.com screenshots may become textures');
console.log('5.76 road-aligned smooth sidewalk, no parking-grid stair steps PASS',JSON.stringify({
 roadIds:plan.sourceIds,photoCameras:plan.cameras.map(c=>+c.distance.toFixed(2)),
 pavingCells:plan.cells.length,coveredRows:plan.rowStats.filter(r=>r.accepted>0).length,
 curbs:plan.curbs.length,rejected:plan.rejected.length,
 oppositeParkingBays:plan.railSideParking.length,
 centralParkingCells:plan.centralParkingCells.length,
 outerSidewalkCells:plan.outerSidewalkCells.length,
 outerSidewalkCurbs:plan.outerSidewalkCurbs.length,
 exteriorFootwayOSMdistance:+plan.outerSidewalkMaxOsmDistance.toFixed(2),
 edgeSpursRemoved:plan.edgeSpursTrimmed,
 ribbonParts:ribbon.parts.length,ribbonJoins:ribbon.joins,
 ribbonMetres:+ribbon.metres.toFixed(2),ribbonTriangles:ribbon.triangles,
 roadMargin:+ribbon.roadMarginMin.toFixed(2),
 maxBodyEdgeStep:+ribbon.maxBodyEdgeStep.toFixed(3),
 roadAligned:ribbon.roadAxisAligned,
 individualSidewalkPanels:ribbon.pavementPanels,
 noTilesDoublePainted:true,roadSurfaceUntouched:true,
 mappedOuterFootwaySegments:plan.outerFootwaySegments.length,
 outerFootwayRendering:plan.outerFootwayRendering,
 walkwayWidth:plan.pedestrianCorridorWidth,
 mappedFootway:plan.centralFootwayId,
 rightCornerTiles:plan.cornerPaving.length,
 rightCornerCurbs:plan.cornerCurbs.length,
 wrongSidewalkRemoved:plan.incorrectlyPlacedRailSidewalkRemoved,
 nearWidth:+plan.rowStats[8].betweenRoadsMetres.toFixed(1),
 farWidth:+plan.rowStats.at(-1).betweenRoadsMetres.toFixed(1),
 measuredParkingPolygon:false,
 noInventedRoads:true
}));
