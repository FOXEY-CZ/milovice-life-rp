// Milovice RP 5.216: exact original Armádní / Višňová OSM crossing,
 // split two real zebra approaches, one conservative physical island model.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {planZebraPieces} from './reality-walkways.js';
import {VISNOVA_REFUGE_5216 as C,planVisnovaRefuge5216 as plan,
 planVisnovaRefugeZebra5216 as split,
 renderVisnovaRefuge5216 as render} from './osm-visnova-refuge-5216.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const data=JSON.parse(raw).elements;
const crossing=data.find(x=>String(x.id)===C.crossingId);
const road=data.find(x=>String(x.id)===C.roadId);
assert(crossing&&road,'OSM crossing and Armádní centreline must exist');
const original=JSON.stringify([crossing,road]);
const opts={regionId:'mlada',crossing,road};
const p=plan(opts);
assert(p,'original OSM middle crossing node must plan without inference');
assert.equal(p.version,'5.216');
assert.equal(p.crossingHash,'097b2218');
assert.equal(p.roadHash,'b19851ee');
assert.deepEqual(p.centreGPS,{lat:50.2291512,lon:14.8694981});
assert.deepEqual(p.sourceCrossingGPS,crossing.geometry);
assert.equal(p.sourceCrossingHasRefuge,true);
assert.equal(p.sourceMiddleOnRoad,true);
assert.equal(p.shapeEstimatedNotPhotographed,true);
assert.equal(p.modelLengthMeters,2.4);
assert.equal(p.modelWidthMeters,.8);
assert.equal(p.sourceCrossingGPS.length,3);
assert.equal(p.sourceCrossingGPS[1].lat,road.geometry[1].lat);
assert.equal(p.sourceCrossingGPS[1].lon,road.geometry[1].lon);
for(const key of ['newRoads','newFootways','newCrossings',
 'newTrafficLights','newColliders'])assert.equal(p[key],0,key);
const toWorld=q=>({x:(q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(q.lat-50.226)*111320});
const carriageway=createRoadClearance();
for(const id of ['1331897685','1331897686','1331897687']){
 const w=data.find(x=>String(x.id)===id);
 assert(w,'existing Armádní road '+id);
 carriageway.addRoad({id,kind:w.tags.highway,width:7.8,
  points:w.geometry.map(toWorld)});
}
const stripes=split({plan:p,crossing,toWorld,carriageway,planZebraPieces});
assert(stripes,'both original road approaches should have safe zebra bars');
assert.equal(stripes.version,'5.216');
assert.equal(stripes.approachBars.length,2);
assert(stripes.approachBars.every(x=>x>0));
assert.equal(stripes.pieces.length,stripes.paintedBars);
assert(stripes.minimumPaintEdgeClearanceMetres>=.48);
assert.equal(stripes.sourceCrossingSplitAtActualOSMNode,true);
assert.equal(stripes.paintPatternEstimateNotPhotographed,true);
for(const key of ['newRoads','newFootways','newCrossings','newColliders'])
 assert.equal(stripes[key],0,key);
class Attr{constructor(array,itemSize){this.array=array;this.itemSize=itemSize;}}
class Geometry{
 setAttribute(name,attr){this.position=attr;return this;}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Mesh{
 constructor(geometry,material){
  this.geometry=geometry;this.material=material;
  this.parent=null;this.visible=true;this.userData={};
 }
}
const T={BufferGeometry:Geometry,Float32BufferAttribute:Attr,Mesh};
const layer={visible:true,add(mesh){mesh.parent=this;}};
const visual=render(T,{plan:p,toWorld,terrainAt:()=>0,
 layer,material:{type:'shared-island-model'}});
assert(visual&&visual.isAttached()&&visual.isVisible());
assert.equal(visual.renderedMeshes,1);
assert.equal(visual.triangles,24);
assert.equal(visual.mesh.name,'Milovice_Visnova_Armadni_OSM_Refuge5216');
assert.equal(visual.mesh.userData.photoVerifiedGeometry,false);
assert(visual.mesh.geometry.position.array.every(Number.isFinite));
assert.deepEqual(visual.sourceCentreGPS,crossing.geometry[1]);
assert.equal(visual.addedColliders,0);
const mutations=[
 ['wrong region',{...opts,regionId:'old'}],
 ['no crossing',{...opts,crossing:null}],
 ['no road',{...opts,road:null}],
 ['different island',{...opts,crossing:{...crossing,tags:{
  ...crossing.tags,'crossing:island':'no'}}}],
 ['wrong material',{...opts,crossing:{...crossing,tags:{
  ...crossing.tags,surface:'asphalt'}}}],
 ['missing zebra',{...opts,crossing:{...crossing,tags:{
  ...crossing.tags,'crossing:markings':'no'}}}],
 ['unmapped altered crossing',{...opts,crossing:{...crossing,
  geometry:crossing.geometry.map((q,i)=>i===1?{...q,lon:q.lon+.0000001}:q)}}],
 ['unmapped altered road',{...opts,road:{...road,
  geometry:road.geometry.map((q,i)=>i===1?{...q,lat:q.lat+.0000001}:q)}}],
 ['wrong road type',{...opts,road:{...road,tags:{
  ...road.tags,highway:'service'}}}],
 ['wrong road name',{...opts,road:{...road,tags:{
  ...road.tags,name:'Višňová'}}}]
];
for(const [reason,input] of mutations)
 assert.equal(plan(input),null,'fail closed if '+reason);
assert.equal(split({...({plan:p,crossing,toWorld,carriageway,planZebraPieces}),
 crossing:{...crossing,geometry:crossing.geometry.slice(0,-1)}}),null);
assert.equal(JSON.stringify([crossing,road]),original,'never mutate original OSM data');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 raw,'never alter regional source');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-visnova-refuge-5216.js?v=521600'",
 'planVisnovaRefuge5216({',
 'planVisnovaRefugeZebra5216({',
 'renderVisnovaRefuge5216(THREE,{',
 'window.__miloviceVisnovaRefugeRuntime5216=()=>',
 "'visnova-refuge-5216':{",
 'href="?v=521600&streetAudit=visnova-refuge-5216"',
 "const BUILD_ID='20261121-visnova-armadni-refuge-521600'"
])assert(html.includes(needle),'missing game integration '+needle);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===build&&build===hud,'meta/HUD/runtime build ID mismatch');
console.log('PASS 5.216 original OSM crossing and road centre;',
 stripes.approachBars.join('+'),'painted zebra approaches,',
 stripes.excludedCentreBars,'bars removed at island; 1 mesh/24 tris');
