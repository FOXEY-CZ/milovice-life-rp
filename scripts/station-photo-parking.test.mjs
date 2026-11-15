// Milovice RP 5.76 — true road-parallel exterior edge, not gridded curb stair steps
// from recurring. Verify original OSM ways, full-stone-rectangle road checks,
// photo-camera correlation, no fake cars, and constant draw-call budget.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance,isRoadFreeRect} from './road-clearance.js';
import {STATION_PARKING_REFERENCE,planStationPhotoParking,planContinuousOuterSidewalk} from './station-photo-parking.js';
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
assert(game.includes("from './scripts/station-photo-parking.js?v=5760'"));
assert(game.includes('stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})'),
 'The island sidewalk must receive the exact city paving material');
assert(game.includes('stationPhotoParking.reset()'));
assert(!game.includes('osmStrip(points[i-1],points[i],1.8,osmSidewalkMat,.235);'),
 'The 5.72 forced sidewalk directly on Nádražní asphalt MUST be disabled');
assert(game.includes('stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})'),
 'Carved sidewalk must reuse the same existing city paving material');
assert(game.includes("const BUILD_ID='20261115-road-aligned-sidewalk-5760'"));
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
assert(code.includes("meshFor('sidewalk',sidewalkMaterial)")&&
 code.includes("meshFor('kerb',material.curb)"),
 'Both the pavement and curb must form contiguous meshes, not square blocks');
assert(code.includes('sidewalkMaterial||material.sidewalk'));
assert(code.includes('for(const p of planned.centralParkingCells)'),
 'Entire broad island surface must have real parking blocks');
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
