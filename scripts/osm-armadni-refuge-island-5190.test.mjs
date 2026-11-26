import {hasConsistentGameBuild} from './game-build-label.js';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planArmadniZebraArms5191} from './osm-armadni-zebra-arms-5191.js';
import {createRoadClearance} from './road-clearance.js';
import {planZebraPieces,isCarriageway} from './reality-walkways.js';
import {ARMADNI_REFUGE_5190 as C,planArmadniRefuge5190,
 renderArmadniRefuge5190} from './osm-armadni-refuge-island-5190.js';

const source=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const es=JSON.parse(source).elements;
const crossing=es.find(e=>String(e.id)===C.crossingId);
const road=es.find(e=>String(e.id)===C.roadId);
assert(crossing&&road,'real crossing and Armádní source must exist');
const args={regionId:'mlada',crossing,road};
const p=planArmadniRefuge5190(args);
assert(p,'source-confirmed island at shared original road/crossing node');
assert.equal(p.centerPointSourceVerified,true);
assert.equal(p.sourceCrossingHasIsland,true);
assert.deepEqual(p.centerGPS,crossing.geometry[1]);
assert.deepEqual(crossing.geometry[1],road.geometry[1]);
assert.equal(p.modelLengthMeters,2.4);
assert.equal(p.modelWidthMeters,.8);
assert.equal(p.shapeDimensionsEstimated,true);
assert.equal(p.currentPhysicalAppearanceUnverified,true);
assert.equal(p.sourceOSMModified,false);
assert.equal(p.roadWidthChanged,false);
assert.equal(p.walkabilityNotBlocked,true);
for(const key of ['newCrossingWays','newRoads','newFootways',
 'newTrafficLights','addedColliders'])assert.equal(p[key],0);
assert(Math.abs(Math.hypot(p.roadAxis.x,p.roadAxis.z)-1)<1e-8);
assert(Math.abs(p.roadAxis.x*p.pedestrianAxis.x+
 p.roadAxis.z*p.pedestrianAxis.z)<.2);

for(const bad of [
 {...args,regionId:'old'},
 {...args,crossing:{...crossing,id:999}},
 {...args,crossing:{...crossing,tags:{...crossing.tags,'crossing:island':'no'}}},
 {...args,crossing:{...crossing,tags:{...crossing.tags,'crossing:markings':'no'}}},
 {...args,crossing:{...crossing,geometry:crossing.geometry.map((pt,i)=>
  i===1?{...pt,lon:pt.lon+.0000001}:pt)}},
 {...args,road:{...road,tags:{...road.tags,lanes:'1'}}},
 {...args,road:{...road,geometry:road.geometry.map((pt,i)=>
  i===0?{...pt,lat:pt.lat+.0000001}:pt)}},
 {...args,road:{...road,geometry:road.geometry.slice(0,2)}}
])assert.equal(planArmadniRefuge5190(bad),null,
 'must not guess island geometry for edited/missing OSM');

class BufferGeometry {
 setAttribute(key,value){this[key]=value}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Float32BufferAttribute {
 constructor(array,itemSize){this.array=array;this.itemSize=itemSize}
}
class Mesh {
 constructor(geometry,material){
  this.geometry=geometry;this.material=material;this.userData={};
  this.visible=true;
 }
}
const T={BufferGeometry,Float32BufferAttribute,Mesh};
const toWorld=g=>({x:(g.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(g.lat-50.226)*111320});
const layer={visible:true,children:[],add(o){o.parent=this;this.children.push(o)}};
const material={name:'model-paver',side:2};
const scene=renderArmadniRefuge5190(T,{plan:p,toWorld,
 terrainAt:()=>100,layer,material});
assert(scene);
assert.equal(scene.renderedMeshes,1);
assert.equal(scene.drawnTriangles,24);
assert.equal(scene.inScene(),true);
assert.equal(scene.visibleAfterLOD(),true);
assert.equal(scene.dimensionsEstimated,true);
assert.equal(scene.newColliders,0);
assert.equal(scene.newRoads,0);
assert.equal(scene.walkingCrossingUnobstructed,true);
assert.equal(layer.children.length,1);
assert.equal(layer.children[0].material,material);
assert.equal(layer.children[0].userData.sourceCrossingId,C.crossingId);
assert.equal(layer.children[0].userData.photoVerifiedGeometry,false);
assert.equal(layer.children[0].geometry.position.array.length,24*9);
assert(Math.abs(scene.centerWorld.x-toWorld(p.centerGPS).x)<1e-8);
assert(Math.abs(scene.centerWorld.z-toWorld(p.centerGPS).y)<1e-8);
const ys=layer.children[0].geometry.position.array.filter((_,i)=>i%3===1);
assert(ys.some(v=>Math.abs(v-100.33)<1e-8));
assert(ys.some(v=>Math.abs(v-100.17)<1e-8));
layer.visible=false;
assert.equal(scene.visibleAfterLOD(),false);
assert.equal(renderArmadniRefuge5190(T,{plan:p,toWorld,
 terrainAt:()=>NaN,layer,material}),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 source,'immutable original RÚIAN/OSM bytes');

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(hasConsistentGameBuild(html));
for(const text of [
 "from './scripts/osm-armadni-refuge-island-5190.js?v=519000'",
 'const armadniRefugePlan5190=planArmadniRefuge5190({',
 'renderArmadniRefuge5190(THREE,{',
 'window.__miloviceArmadniRefugeRuntime5190=()=>',
 'href="?v=519100&streetAudit=armadni-refuge-5190"',
 "'armadni-refuge-5190':{",
 'camera:{lat:50.2293347,lon:14.8659125},heading:180'
])assert(html.includes(text),'missing actual 3D game integration: '+text);
// 5.191: the ORIGINAL 3-node footway must be represented by two painted
// approaches, with NO stripe reaching the source-confirmed centre refuge.
const modelClearance=createRoadClearance();
for(const way of es){
 const kind=way.tags?.highway;
 if(!isCarriageway(kind)||!way.geometry)continue;
 const width=kind==='primary'?11:kind==='secondary'?9:
  kind==='tertiary'?8:kind==='service'?4.5:7.8;
 modelClearance.addRoad({id:way.id,kind,width,
  points:way.geometry.map(toWorld)});
}
const oldBars=planZebraPieces(crossing.geometry.map(toWorld),modelClearance);
const arms=planArmadniZebraArms5191({
 islandPlan:p,crossing,toWorld,carriageway:modelClearance,planZebraPieces
});
assert(arms,'two original source-way halves must contain painted bars');
assert.equal(arms.version,'5.191');
assert.equal(arms.sourceCrossingId,C.crossingId);
assert.equal(arms.sourceRoadId,C.roadId);
assert.equal(arms.northBars,3);
assert.equal(arms.southBars,3);
assert.equal(arms.removedFromIslandArea,1);
assert.equal(oldBars.length,7);
assert.equal(arms.pieces.length,6);
assert.equal(arms.allBarsOnApproaches,true);
assert.equal(arms.originalCrossingVerticesPreserved,true);
assert.equal(arms.paintSpacingNotPhotoVerified,true);
assert(arms.minimumPaintEdgeGapMetres>p.modelWidthMeters*.5+.07,
 'no paint edge overlaps the 5.190 modeled island');
const mid=toWorld(crossing.geometry[1]);
for(const bar of arms.pieces){
 const x=(bar.a.x+bar.b.x)/2,z=(bar.a.z+bar.b.z)/2;
 const nearest=modelClearance.nearest(x,z);
 assert(nearest&&isCarriageway(nearest.kind)&&nearest.clearance<-.25);
 const centerDistance=Math.abs((x-mid.x)*p.pedestrianAxis.x+
  (z-mid.y)*p.pedestrianAxis.z);
 assert(centerDistance-bar.width*.5>p.modelWidthMeters*.5+.07);
}
for(const key of ['newOSMWays','newRoads','newColliders'])
 assert.equal(arms[key],0);
for(const variant of [
 {islandPlan:{...p,version:'5.999'}},
 {islandPlan:{...p,modelWidthMeters:10}},
 {crossing:{...crossing,tags:{...crossing.tags,'crossing:island':'no'}}},
 {crossing:{...crossing,geometry:crossing.geometry.map((pt,i)=>
  i===1?{...pt,lat:pt.lat+.0000001}:pt)}},
 {carriageway:{nearest:()=>null}},
 {planZebraPieces:()=>[]}
])assert.equal(planArmadniZebraArms5191({
 islandPlan:p,crossing,toWorld,carriageway:modelClearance,planZebraPieces,
 ...variant
}),null);
for(const needle of [
 "from './scripts/osm-armadni-zebra-arms-5191.js?v=519100'",
 'planArmadniZebraArms5191({',
 'armadniZebraArms5191?.pieces||unsegmentedZebraPieces5191;',
 'window.__miloviceArmadniZebraArmsRuntime5191=()=>',
 'const pieces=visnovaZebraArms5216?.pieces||'
])assert(html.includes(needle),'missing actual 5.191 zebra integration: '+needle);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 source,'OSM source bytes unchanged after split model');
console.log('PASS 5.191: Armádní crossing split into 3+3 V7a stripes around OSM median, no GPS/road or collider changes');
console.log('PASS 5.190: original OSM center for Armádní crossing island; 24 triangles in one nonblocking mesh');
