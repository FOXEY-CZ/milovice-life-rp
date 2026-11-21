/** 5.205 integrated source + geometry test.
 * Run: node scripts/osm-visnova-paver-corners-5205.test.mjs
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planVisnovaPaverCorners5205 as plan,renderVisnovaPaverCorners5205 as render}
 from './osm-visnova-paver-corners-5205.js';
import {VISNOVA_TAGGED_PAVERS_5204 as source}
 from './osm-visnova-tagged-pavers-5204.js';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const building=elements.find(w=>String(w.id)==='1025752710');
const ways=elements.filter(w=>source.ways.some(s=>s.id===String(w.id)));
const toWorld=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320
});
const clear={isClear:()=>true};
const options={regionId:'mlada',ways,parkingHouse:building,toWorld,
 roads:clear,buildings:clear};
const p=plan(options);
assert(p,'all four exact original OSM ways and RUIAN house must plan');
assert.equal(p.plannedTriangles,12,'source geometry has 12 small inside-corner wedges');
assert.deepEqual(p.renderedCornerWayIds,
 ['1044078121','1044078124','1314665579']);
assert.equal(p.sourcePaverWayIds.length,4);
assert(p.cornerTriangles.every(t=>t.materialSource==='paving_stones'&&
 t.onlyFillsExistingPathBend));
assert(p.cornerTriangles.every(t=>t.area<.4));
assert.equal(p.anchorIsInsideMappedParkingHouse,true);
assert.equal(p.sourceGeometryUntouched,true);
assert.equal(p.newFootways,0);
assert.equal(p.newRoads,0);
assert.equal(p.newCrossings,0);
assert.equal(p.newColliders,0);
const THREE={
 BufferGeometry:class{
  setAttribute(k,v){this[k]=v}
  computeVertexNormals(){}
  computeBoundingSphere(){}
 },
 Float32BufferAttribute:class{constructor(arr,size){this.array=arr;this.itemSize=size}},
 Mesh:class{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.visible=true}}
};
const layer={visible:true,children:[],add(m){m.parent=this;this.children.push(m)}};
const material={name:'visnova-tagged-paving-stones'};
const actual=render(THREE,{plan:p,layer,terrainAt:()=>100,material});
assert(actual,'one actual BufferGeometry is constructed');
assert.equal(actual.triangles,12);
assert.equal(actual.drawMeshes,1);
assert.equal(actual.ready,true);
assert.equal(actual.visibleMeshes(),1);
assert.equal(layer.children.length,1);
assert.equal(layer.children[0].geometry.position.array.length,108);
assert.equal(layer.children[0].geometry.uv.array.length,72);
assert(layer.children[0].geometry.position.array.every(Number.isFinite));
assert(layer.children[0].geometry.uv.array.every(Number.isFinite));
assert.equal(layer.children[0].material,material,'reuse the original paver material');
layer.visible=false;assert.equal(actual.visibleMeshes(),0);
assert.equal(plan({...options,regionId:'old'}),null);
assert.equal(plan({...options,parkingHouse:{...building,id:0}}),null);
assert.equal(plan({...options,ways:ways.slice(1)}),null);
assert.equal(plan({...options,ways:[...ways,ways[0]]}),null);
assert.equal(plan({...options,ways:ways.map((w,i)=>i?{...w,tags:{...w.tags,surface:'asphalt'}}:w)}),null);
assert.equal(plan({...options,ways:ways.map((w,i)=>i?{...w,geometry:w.geometry.map((n,j)=>j===1?{...n,lon:n.lon+.0000001}:n)}:w)}),null);
const noRoads=plan({...options,roads:{isClear:()=>false}});
assert(noRoads);assert.equal(noRoads.plannedTriangles,0,'never paint over a road');
const noBuildings=plan({...options,buildings:{isClear:()=>false}});
assert(noBuildings);assert.equal(noBuildings.plannedTriangles,0,'never paint into a building');
// Run real clearance implementations with all mapped building polygons and
// carriageway centre-lines. Widths without width=* are GAME estimates.
const roads=createRoadClearance(),buildings=makeSidewalkBuildingGuard();
const car=new Set(['primary','secondary','tertiary','residential','unclassified',
 'living_street','service','trunk','trunk_link','primary_link',
 'secondary_link','road','track']);
for(const e of elements){
 if(e.tags?.building&&e.geometry)buildings.add(e.id,e.geometry.map(toWorld));
 if(!car.has(e.tags?.highway)||!e.geometry)continue;
 const kind=e.tags.highway;
 const base=kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:
  kind==='service'?4.5:kind==='track'?3.2:7.8;
 const width=Number(e.tags.width)||base;
 roads.addRoad({id:e.id,points:e.geometry.map(toWorld),width,kind});
}
const protectedPlan=plan({...options,roads,buildings});
assert(protectedPlan);
assert(protectedPlan.plannedTriangles>0&&protectedPlan.plannedTriangles<=12);
assert(protectedPlan.rejectedRoad>=0);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const q of [
 "from './scripts/osm-visnova-paver-corners-5205.js?v=520500'",
 'planVisnovaPaverCorners5205({',
 'renderVisnovaPaverCorners5205(THREE,{',
 "osmMappedSurfaceMaterials['visnova-tagged-paving-stones']",
 '__miloviceVisnovaPaverCornersRuntime5205',
 "'visnova-paver-corners-5205':{",
 'href="?v=520500&streetAudit=visnova-paver-corners-5205"',
 'const BUILD_ID='
])assert(html.includes(q),'missing in-game source '+q);
console.log('PASS 5.205: 12 source-locked paved corner wedges/1 mesh, road+building guard, no invented footways');
