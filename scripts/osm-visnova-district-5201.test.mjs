/** Milovice RP 5.201 — whole Višňová district integration regression.
 * Unlike a string-only source audit, this executes every source-locked
 * planning and actual THREE geometry creation on the original Mladá JSON.
 * It does NOT claim to be a Chromium/WebGL screenshot or Pages deploy check.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planVisnovaResidential5192,renderVisnovaResidential5192}
 from './osm-visnova-residential-5192.js';
import {completeVisnovaEndFacades5193}
 from './osm-visnova-end-facades-5193.js';
import {planVisnovaNeighbor5197}
 from './osm-visnova-neighbor-5197.js';
import {planVisnovaEightFloor5198}
 from './osm-visnova-eight-floor-5198.js';
import {planVisnovaLaneEdges5195,renderVisnovaLaneEdges5195}
 from './osm-visnova-service-edge-5195.js';
import {planVisnovaMappedWalk5199}
 from './osm-visnova-mapped-walks-5199.js';
import {planVisnovaLawnDetail5200}
 from './osm-visnova-lawn-detail-5200.js';
import {planOSMPlaygroundLawns}
 from './osm-playground-verges-5104.js';

const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const by=id=>elements.find(w=>String(w.id)===String(id));
const toWorld=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320
});
const THREE={
 DoubleSide:2,
 BufferGeometry:class{
  setAttribute(k,v){this[k]=v}
  computeVertexNormals(){}
  computeBoundingSphere(){}
 },
 Float32BufferAttribute:class{
  constructor(array,itemSize){this.array=array;this.itemSize=itemSize}
 },
 MeshStandardMaterial:class{constructor(options){this.options=options}},
 Mesh:class{
  constructor(geometry,material){
   this.geometry=geometry;this.material=material;
   this.visible=true;this.userData={};
  }
 }
};
let windows=0,triangles=0,meshes=0;
for(const id of [53865847,53865848,202399859,53865850]){
 const way=by(id);assert(way);
 const levels=Number(way.tags['building:levels']);
 const args={id,regionId:'mlada',tags:way.tags,geometry:way.geometry,
  modelFloors:levels,modelHeight:levels*3.05};
 let plan;
 if(id===53865847||id===53865848){
  const base=planVisnovaResidential5192(args);
  assert(base,'original two Višňová buildings must still plan');
  plan=completeVisnovaEndFacades5193({basePlan:base});
 }else if(id===202399859){
  plan=planVisnovaNeighbor5197(args);
 }else{
  plan=planVisnovaEightFloor5198(args);
 }
 assert(plan,'source building must plan: '+id);
 const layer={visible:true,children:[],add(m){
  m.parent=this;this.children.push(m)
 }};
 const rendered=renderVisnovaResidential5192(THREE,{
  plan,toWorld,baseHeight:100,layer
 });
 assert(rendered,'3D geometry must render: '+id);
 assert.equal(rendered.allInScene(),true);
 assert.equal(rendered.visibleAfterLOD(),4);
 assert.equal(rendered.meshCount,4);
 assert(layer.children.every(m=>
  m.geometry.position.array.every(Number.isFinite)));
 windows+=rendered.estimatedWindowsRendered;
 triangles+=rendered.totalTriangles;
 meshes+=rendered.meshCount;
}
assert.deepEqual({windows,triangles,meshes},{
 windows:1267,triangles:17854,meshes:16
});
const roads=[by(1201945276),by(202399861)];
const roadPlan=planVisnovaLaneEdges5195({regionId:'mlada',ways:roads});
assert(roadPlan);
const layer={visible:true,children:[],add(m){
 m.parent=this;this.children.push(m)
}};
const edges=renderVisnovaLaneEdges5195(THREE,{
 plan:roadPlan,toWorld,terrainAt:()=>100,layer
});
assert.equal(edges.triangles,12);
assert.equal(edges.meshCount,1);
assert.equal(edges.sharedCornerJoins,1);
assert.equal(edges.visibleAfterLOD(),true);
for(const id of [1460019808,1460019811]){
 const way=by(id);assert(way);
 const walk=planVisnovaMappedWalk5199('mlada',way);
 assert.equal(walk.sourceSegments,2);
 assert.equal(walk.newGeometry,0);
}
const safe={isClear:()=>true};
const lawns=elements.filter(w=>w.tags?.landuse==='grass')
 .map(w=>({id:w.id,tags:w.tags,points:w.geometry.map(toWorld)}));
const playgrounds=elements.filter(w=>w.tags?.leisure==='playground')
 .map(w=>({id:w.id,tags:w.tags,points:w.geometry.map(toWorld)}));
const prior=planOSMPlaygroundLawns(lawns,playgrounds,{
 roads:safe,buildings:safe,water:safe
});
const grass=planVisnovaLawnDetail5200(
 [by(1460019807),by(1460019806)],{
 regionId:'mlada',toWorld,roads:safe,buildings:safe,water:safe,
 excludedLawnIds:prior.sourceLawnIds
});
assert(grass,'two mapped Višňová lawns must source-lock');
assert.equal(grass.tufts.length,191);
assert.equal(grass.tufts.length<=220,true);
assert(grass.tufts.every(t=>!prior.sourceLawnIds.includes(t.sourceOSMId)));
assert.deepEqual(grass.skippedSourceLawns,[]);
assert.equal(grass.newFootways,0);
assert.equal(grass.newGrassAreas,0);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
console.log('PASS 5.201: 4 mapped buildings, 1267 estimated facade windows, 17854 triangles/16 meshes; 2 roads, 2 footways, 2 grass polygons with 191 safe candidates (before live clearance)');
