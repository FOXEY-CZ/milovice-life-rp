// Milovice RP 5.131 — exact OSM/Tyršova street-network & existing zebra mark tests.
// Spojovací ends at Armádní. Tyršova is a separate, real northbound road.
// Paint only the two explicit zebra/island OSM crossings; preserve the
// "marked but unspecified" and "unmarked" paths, five RUIAN homes, sidewalks.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTyrsovaArmJunctionZebras,
 TYRSOVA_JUNCTION_SOURCES} from './osm-tyrsova-armadni-junction-5131.js';
const data=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const e=data.elements,by=id=>e.find(v=>String(v.id)===String(id));
const ids=TYRSOVA_JUNCTION_SOURCES;
const allIds=[
 ids.southRoad,ids.armadniWest,ids.armadniEast,
 ids.northTyrsova,ids.continuationTyrsova,
 ids.westernSidewalk,ids.easternSidewalk,
 ids.westZebra,ids.eastZebra,ids.nearMarkedUnknown,ids.northUnmarked,
 ...ids.eastTerrace];
const sources=allIds.map(by);
assert(sources.every(Boolean),'Every original OSM way must really exist');
const original=JSON.stringify(sources);
const k=111320,co=Math.cos(50.226*Math.PI/180);
const w=p=>({x:(p.lon-14.889)*k*co,z:-(p.lat-50.226)*k});
const way=id=>{
 const o=by(id);return {id:o.id,tags:o.tags,
  width:o.tags.highway==='residential'?7.8:
   o.tags.highway==='footway'?1.8:8,
  points:o.geometry.map(w)};
};
const opt={
 regionId:'mlada',
 spojovaci:way(ids.southRoad),
 tyrsovaSouth:way(ids.northTyrsova),
 tyrsovaNorth:way(ids.continuationTyrsova),
 armadniWest:way(ids.armadniWest),
 armadniEast:way(ids.armadniEast),
 westSidewalk:way(ids.westernSidewalk),
 eastSidewalk:way(ids.easternSidewalk),
 westZebra:way(ids.westZebra),
 eastZebra:way(ids.eastZebra),
 markedUnknown:way(ids.nearMarkedUnknown),
 unmarked:way(ids.northUnmarked),
 eastTerraceBuildings:ids.eastTerrace.map(way)
};
const plan=planTyrsovaArmJunctionZebras(opt);
assert(plan,'Two actual real-world zebra crossings must be renderable');
assert.equal(plan.version,'5.131');
assert.equal(plan.streetNetworkFromOSM,true);
assert.equal(plan.sourceRoadToNorth,'Tyršova');
assert.equal(plan.spojoContinuingPastArmadni,false);
assert.equal(plan.originalSpojovaciId,'246652750');
assert.deepEqual(plan.namedTyrsovaWayIds,['8618265','1331897627']);
assert.deepEqual(plan.sourceArmadniWayIds,['1331897681','1331897683']);
assert.deepEqual(plan.sourceCrossingWayIds,['1318462995','1316882855']);
assert.deepEqual(plan.sourceSidewalkWayIds,['1046197807','1316882852']);
assert.deepEqual(plan.sourceEastBuildingWayIds,ids.eastTerrace);
assert.equal(plan.mappedBuildingCount,5);
assert.equal(plan.mappedFiveFloorBuildings.length,5);
assert.deepEqual(plan.mappedFiveFloorBuildings.map(q=>q.floors),
 [5,5,5,5,5]);
assert.deepEqual(plan.mappedFiveFloorBuildings.map(q=>q.flats),
 [14,14,14,14,12]);
assert(plan.mappedFiveFloorBuildings.every(q=>q.correctlyAbutting));
assert.equal(plan.sourceConsecutiveTerrace,true);
assert.deepEqual(plan.sourceSidewalkMaterials,['paving_stones','paving_stones']);
assert.deepEqual(plan.sourceZebraMarkingTypes,['zebra','zebra']);
assert.equal(plan.sourceIslandCount,2);
assert.equal(plan.modeledIslandCount,0,
 'Refuge islands exist in OSM but their precise geometry must not be invented');
assert.equal(plan.paintedBarCount,20);
assert.equal(plan.paintedTriangleCount,40);
assert.equal(plan.drawMeshCount,2);
assert.equal(plan.paintedWhiteBarsObservedByOSMTags,true);
assert.equal(plan.exactPaintBarCountMeasured,false);
assert.equal(plan.physicalIslandDimensionsMeasured,false);
assert.equal(plan.whitePaintSurfaceHeightOffsetMeters,.185);
assert.equal(plan.markingsOnlyOnOriginalArmadniCarriageway,true);
assert.equal(plan.crossingMarkedButStyleUnspecifiedNotPainted,'1044078125');
assert.equal(plan.crossingExplicitUnmarkedNotPainted,'1278749453');
assert.equal(plan.paintedNewMarkedCrossings,0);
assert.equal(plan.crossingParts.length,2);
const distToRoad=(p,road)=>{
 let m=Infinity;
 for(let i=1;i<road.points.length;i++){
  const a=road.points[i-1],b=road.points[i],
   dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,
   ((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));
  m=Math.min(m,Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz));
 }
 return m;
};
for(const [i,part] of plan.crossingParts.entries()){
 const sourceCross=by(part.crossingId);
 assert.equal(sourceCross.tags['crossing:markings'],'zebra');
 assert.equal(sourceCross.tags['crossing:island'],'yes');
 assert.equal(part.bars.length,10);
 assert.equal(part.paintedBars,10);
 assert.equal(part.crossingMappedZebra,true);
 assert.equal(part.unpaintedIslandGap,1.8);
 assert(part.roadClearance>.15);
 const road=i?opt.armadniEast:opt.armadniWest;
 assert.equal(part.roadId,String(road.id));
 for(const b of part.bars){
  assert.equal(b.corners.length,4);
  assert.equal(b.sourceId,part.crossingId);
  assert.equal(b.whiteStripeFromOSMZebraTag,true);
  assert.equal(b.geometryEstimated,true);
  for(const p of b.corners){
   assert(Number.isFinite(p.x)&&Number.isFinite(p.z));
   assert(distToRoad(p,road)<road.width*.5-.15,
    'All painted stripe corners must remain ON the real Armádní carriageway');
  }
 }
}
for(const field of ['inventedStreetSegments','inventedSidewalks',
 'addedRoads','addedFootways','addedRoadColliders','addedBuildings',
 'changedExistingBuildingFloors','newStreetLighting','newRandomTrees'])
 assert.equal(plan[field],0);
assert.deepEqual(plan,planTyrsovaArmJunctionZebras(opt),
 'Geometry and island model estimates must be deterministic');
assert.equal(JSON.stringify(sources),original,
 'Do not move or mutate original OSM streets, crossings or buildings');
for(const change of [
 {regionId:'old'},
 {spojovaci:{...opt.spojovaci,id:0}},
 {tyrsovaSouth:{...opt.tyrsovaSouth,id:0}},
 {tyrsovaNorth:{...opt.tyrsovaNorth,
  tags:{...opt.tyrsovaNorth.tags,name:'Spojovací'}}},
 {armadniWest:{...opt.armadniWest,id:0}},
 {armadniEast:{...opt.armadniEast,id:0}},
 {armadniEast:{...opt.armadniEast,width:14}},
 {westSidewalk:{...opt.westSidewalk,
  tags:{...opt.westSidewalk.tags,surface:'asphalt'}}},
 {eastSidewalk:null},
 {westZebra:{...opt.westZebra,
  tags:{...opt.westZebra.tags,'crossing:markings':'no'}}},
 {eastZebra:{...opt.eastZebra,
  tags:{...opt.eastZebra.tags,'crossing:island':'no'}}},
 {markedUnknown:{...opt.markedUnknown,
  tags:{...opt.markedUnknown.tags,'crossing:markings':'zebra'}}},
 {unmarked:{...opt.unmarked,tags:{...opt.unmarked.tags,crossing:'marked'}}},
 {eastTerraceBuildings:[]},
 {eastTerraceBuildings:opt.eastTerraceBuildings.map((x,i)=>
  i===1?{...x,tags:{...x.tags,'building:levels':'8'}}:x)}
])assert.equal(planTyrsovaArmJunctionZebras({...opt,...change}),null,
 'Source changes must disable the painted street scene');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-tyrsova-armadni-junction-5131.js?v=513100'",
 'const tyrsovaPlan=planTyrsovaArmJunctionZebras({',
 "const paintMaterial=new THREE.MeshBasicMaterial({",
 "terrainAt(p.x,p.z)+.185",
 "mesh.name='Milovice_Tyrsova_Armadni_RealOSMZebra_5131_'",
 'window.__miloviceTyrsovaArmadniJunctionAudit={',
 'window.__miloviceTyrsovaArmadniJunctionRuntime=()=>{',
 " 'tyrsova-terrace-5131':{",
 " 'armadni-island-zebra-5131':{",
 'href="?v=513200&streetAudit=tyrsova-terrace-5131"',
 'href="?v=513200&streetAudit=armadni-island-zebra-5131"',
 "const BUILD_ID='"
])assert(html.includes(token),'5.131 scene integration missing '+token);
console.log('PASS 5.131: named Tyršova continuity, 5 × 5-level RUIAN terrace, two OSM-tagged zebra crossings, 40 triangles, no invented roads/islands');
