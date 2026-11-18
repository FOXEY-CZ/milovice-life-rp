// 5.141 – source-locked pedestrian corner joins in Sportovní estate.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {SPORTOVNI_ESTATE_WALK_5141,planSportovniEstateWalkCorners}
 from './osm-sportovni-estate-walk-5141.js';
const all=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const ways=all.filter(e=>e.tags?.highway);
const cos=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const width=k=>k==='primary'?11:k==='secondary'?9:k==='tertiary'?8:
 k==='pedestrian'?4:k==='footway'?1.8:k==='path'||k==='steps'?1.65:
 k==='cycleway'?2:k==='service'?4.5:7.8;
const roads=createRoadClearance(),buildings=makeSidewalkBuildingGuard();
for(const e of all){
 if(e.tags?.building&&e.geometry?.length>=3)
  buildings.add(e.id,e.geometry.map(toWorld));
 if(e.tags?.highway&&e.geometry?.length>=2&&
  !['footway','path','pedestrian','steps','cycleway'].includes(e.tags.highway))
  roads.addRoad({id:e.id,kind:e.tags.highway,
   width:width(e.tags.highway),points:e.geometry.map(toWorld)});
}
const args={regionId:'mlada',ways,roads,buildings,toWorld};
const original=JSON.stringify(ways);
const plan=planSportovniEstateWalkCorners(args);
assert(plan,'The exact original five source ways should pass');
assert.equal(plan.version,'5.141');
assert.equal(plan.mappedSourceWays,5);
assert.equal(plan.plannedSealedCorners,10);
assert.deepEqual(plan.byWay,{
 '1046197807':3,'1046197808':3,'1046197810':1,
 '1278749454':2,'1278749456':1
});
assert.equal(plan.renderedCornerTriangles,0);
assert.deepEqual(plan.protectedUnmarkedCrossings,['1278749453','1278749455']);
assert.equal(plan.inventedGrassPolygons,0);
assert.equal(plan.inventedTrees,0);
assert.equal(plan.inventedFootways,0);
assert.equal(plan.inventedZebraCrossings,0);
assert.equal(plan.createdIndividualTriangleMeshes,0);
assert.equal(plan.allOSMVerticesExactlyMatched,true);
assert.equal(JSON.stringify(ways),original);
assert(plan.areaSquareMeters>1.4&&plan.areaSquareMeters<3.5);
for(const t of plan.triangles){
 const spec=SPORTOVNI_ESTATE_WALK_5141.sources.find(s=>s.id===t.sourceWayId);
 assert(spec.vertices.includes(t.atNode));
 assert(t.onlyFillsExistingPathBend);
 assert(t.area>0&&t.area<.5);
 assert(t.materialKind===null||t.materialKind==='prubezna-concrete');
 assert([t.a,t.b,t.c].every(p=>
  roads.isClear(p.x,p.z,.07,.06)&&buildings.isClear(p.x,p.z,.10)));
}
assert.equal(
 planSportovniEstateWalkCorners({...args,ways:ways.slice().reverse()})
  .triangles.map(t=>[t.sourceWayId,t.atNode]).join(','),
 plan.triangles.map(t=>[t.sourceWayId,t.atNode]).join(','),
 'Source order must not affect the result');
for(const spec of SPORTOVNI_ESTATE_WALK_5141.sources){
 const orig=ways.find(w=>String(w.id)===spec.id);
 for(let i=0;i<orig.geometry.length;i++){
  const edited=ways.map(w=>String(w.id)!==spec.id?w:
   {...w,geometry:w.geometry.map((p,j)=>j===i?{...p,lon:p.lon+.0000002}:p)});
  assert.equal(planSportovniEstateWalkCorners({...args,ways:edited}),null,
   'Even one changed footway GPS vertex must disable the proposal '+spec.id+':'+i);
 }
 assert.equal(planSportovniEstateWalkCorners({...args,
  ways:ways.filter(w=>String(w.id)!==spec.id)}),null,
  'Missing exact OSM way must disable all joins');
}
for(const id of ['1278749453','1278749455']){
 const edited=ways.map(w=>String(w.id)!==id?w:
  {...w,tags:{...w.tags,'crossing:markings':'zebra'}});
 assert.equal(planSportovniEstateWalkCorners({...args,ways:edited}),null);
}
for(const update of [{regionId:'old'},{roads:{isClear:()=>false}}]){
 const p=planSportovniEstateWalkCorners({...args,...update});
 assert(update.regionId?p===null:p?.plannedSealedCorners===0);
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const snippet of [
 "from './scripts/osm-sportovni-estate-walk-5141.js?v=514100'",
 'const sportovniEstateWalk=planSportovniEstateWalkCorners({',
 "mesh.name='Milovice_OSM_Sportovni_EstateFootwayJoin_5141'",
 'window.__miloviceSportovniEstateWalkRuntime=()=>({',
 "'sportovni-estate-joins-5141':{",
 'streetAudit=sportovni-estate-joins-5141'
])assert(html.includes(snippet),'Missing real scene integration: '+snippet);
console.log('PASS 5.141: source-guarded existing 5-way Sportovní pedestrian paths, 10 safe seam triangles, no invented green patches or road crossings');
