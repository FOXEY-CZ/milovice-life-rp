import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaVojenskeZatisi5249 as base} from './osm-italska-vojen-zatisi-5249.js';
import {filterItalskaPhotoSightlines5250 as sight} from './osm-italska-photo-sightlines-5250.js';
import {extendRakouskaNorthPhoto5251 as north} from './osm-rakouska-north-photo-5251.js';
import {planRakouskaUpper5263 as upper} from './osm-rakouska-photo-upper-5263.js';
import {planRakouskaUpperWindows5264 as windows} from './osm-rakouska-upper-windows-5264.js';
import {planRakouskaGlazedEntry5265 as entry} from './osm-rakouska-glazed-entry-5265.js';
import {planRakouskaFrontage5266 as front} from './osm-rakouska-fenced-frontage-5266.js';
import {RAKOUSKA_CROSS_5267 as S,planRakouskaCross5267 as plan,
 renderRakouskaCross5267 as render} from './osm-rakouska-cross-frontage-5267.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 all=JSON.parse(raw).elements;
const building=all.find(x=>x.id===53865882),road=all.find(x=>x.id===8590288),
 sideRoad=all.find(x=>x.id===8590286);
const b=base({regionId:'mlada',building});
const s=sight({plan:b,geometry:building.geometry});
const n=north({plan:s,geometry:building.geometry});
const u=upper({regionId:'mlada',building,basePlan:n});
const w=windows({upperPlan:u});
const e=entry({upperPlan:u,windowPlan:w});
const f=front({regionId:'mlada',building,road,entryPlan:e});
const args={regionId:'mlada',frontagePlan:f,entryPlan:e,sideRoad},p=plan(args);
assert(p);assert.equal(p.version,'5.267');
assert.equal(p.sourcePhoto,S.photo);
assert.deepEqual(p.start,f.modelFenceStart);
assert(p.lengthMetres>13.65&&p.lengthMetres<13.85);
assert.equal(p.modelApproachGap,3.3);
assert(p.minMainRoadGap>=4.7&&p.minSideRoadGap>=6.5);
assert(p.minBuildingGap>=6.2&&p.minCanopyGap>=3.2);
assert.equal(p.surveyed,false);
assert.equal(p.newMappedBarriers,0);
assert.equal(p.newGates,0);assert.equal(p.newEntrances,0);
assert.equal(p.newColliders,0);assert.equal(p.newRoads,0);
assert.equal(p.newFootways,0);assert.equal(p.newTrafficChanges,0);
assert.equal(plan({...args,sideRoad:{...sideRoad,id:8590288}}),null);
assert.equal(plan({...args,entryPlan:{...e,originalWallEdge:7}}),null);
const bad=structuredClone(sideRoad);bad.geometry[1].lon+=.000001;
assert.equal(plan({...args,sideRoad:bad}),null);
class BufferGeometry{
 constructor(){this.attributes={}}
 setAttribute(k,v){this.attributes[k]=v}
 computeVertexNormals(){this.normals=true}
 computeBoundingSphere(){this.bounds=true}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size}}
class MeshStandardMaterial{constructor(o){this.options=o}}
class Mesh{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.parent=null;this.visible=true}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,DoubleSide:2};
const layer={children:[],add(m){m.parent=this;this.children.push(m)}};
let calls=0;
const draw=render(THREE,{plan:p,layer,terrainAt:(x,z)=>{calls++;return 2+.02*Math.sin(x+z)}});
assert(draw);assert.equal(draw.drawMeshes,1);
assert(draw.triangles>150&&draw.pickets>56&&calls>100);
assert(draw.geometryFinite&&draw.inScene()&&draw.visibleAfterLOD()===1);
assert(layer.children[0].geometry.normals&&layer.children[0].geometry.bounds);
layer.children[0].visible=false;assert.equal(draw.visibleAfterLOD(),0);
assert.equal(render(THREE,{plan:p,layer,terrainAt:null}),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of ["from './scripts/osm-rakouska-cross-frontage-5267.js?v=526700'",
 'planRakouskaCross5267({','renderRakouskaCross5267(THREE,{',
 'window.__miloviceRakouskaCrossRuntime5267=()=>',
 "'rakouska-cross-frontage-5267':{",
 "const BUILD_ID='"])
 assert(html.includes(token),'Missing integration: '+token);
console.log('PASS 5.267 source-locked transverse fence with DEM mesh and road clearance');
