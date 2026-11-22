import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaVojenskeZatisi5249 as init} from './osm-italska-vojen-zatisi-5249.js';
import {filterItalskaPhotoSightlines5250 as sight} from './osm-italska-photo-sightlines-5250.js';
import {extendRakouskaNorthPhoto5251 as north} from './osm-rakouska-north-photo-5251.js';
import {planRakouskaUpper5263 as upper} from './osm-rakouska-photo-upper-5263.js';
import {planRakouskaUpperWindows5264 as windows} from './osm-rakouska-upper-windows-5264.js';
import {planRakouskaGlazedEntry5265 as entry} from './osm-rakouska-glazed-entry-5265.js';
import {RAKOUSKA_FRONTAGE_5266 as SOURCE,
 planRakouskaFrontage5266 as plan,
 renderRakouskaFrontage5266 as render} from './osm-rakouska-fenced-frontage-5266.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const features=JSON.parse(raw).elements;
const building=features.find(e=>e.id===53865882);
const road=features.find(e=>e.id===8590286);
assert(building&&road);
const b=init({regionId:'mlada',building});
const s=sight({plan:b,geometry:building.geometry});
const n=north({plan:s,geometry:building.geometry});
const u=upper({regionId:'mlada',building,basePlan:n});
const w=windows({upperPlan:u});
const entrance=entry({upperPlan:u,windowPlan:w});
const args={regionId:'mlada',building,road,entryPlan:entrance};
const p=plan(args);
assert(p,'Expected exact original building, photographed vestibule and mapped road');
assert.equal(p.version,'5.266');
assert.equal(p.buildingId,'53865882');
assert.equal(p.roadId,'8590286');
assert.equal(p.originalHash,'7aec42bc');
assert.equal(p.roadHash,'916afa20');
assert.equal(p.photo,SOURCE.photo);
assert.equal(p.author,'Stanislav Doronenko');
assert.equal(p.license,'CC BY-SA 4.0');
assert.equal(p.photoFencePresent,true);
assert.equal(p.photoOvergrowthPresent,true);
assert.equal(p.fenceSurveyed,false);
assert.equal(p.vegetationSurveyed,false);
assert.equal(p.fenceRouteInferredFromRoad,true);
assert.equal(p.newMappedBarriers,0);
assert.equal(p.newGates,0);
assert.equal(p.newEntrances,0);
assert.equal(p.newTrees,0);
assert.equal(p.newRoads,0);
assert.equal(p.newFootways,0);
assert.equal(p.newTrafficChanges,0);
assert.equal(p.newColliders,0);
assert(p.fenceLengthMetres>36.6&&p.fenceLengthMetres<36.8);
assert(p.minRoadCentrelineGapMetres>=4.79);
assert(p.minBuildingGapMetres>1.5);
assert(p.minCanopyGapMetres>1.2);
assert.equal(p.weeds.length,86);
assert.equal(p.shrubs.length,10);
assert(p.weeds.every(x=>x.p.x<-970&&x.p.x>-1040&&x.p.z>-10&&x.p.z<70));
assert.equal(plan({...args,regionId:'old'}),null);
assert.equal(plan({...args,road:{...road,id:8590288}}),null);
assert.equal(plan({...args,building:{...building,id:53865877}}),null);
assert.equal(plan({...args,entryPlan:{...entrance,originalWallEdge:7}}),null);
assert.equal(plan({...args,entryPlan:{...entrance,newColliders:1}}),null);
const altered=structuredClone(road);
altered.geometry[1].lon+=.000002;
assert.equal(plan({...args,road:altered}),null);
const moved=structuredClone(building);
moved.geometry[2].lat+=.000002;
assert.equal(plan({...args,building:moved}),null);
class BufferGeometry{
 constructor(){this.attributes={};}
 setAttribute(k,v){this.attributes[k]=v}
 computeVertexNormals(){this.hasNormals=true}
 computeBoundingSphere(){this.hasBounds=true}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.itemSize=size}}
class MeshStandardMaterial{constructor(options){this.options=options}}
class Mesh{
 constructor(geometry,material){this.geometry=geometry;this.material=material;
  this.userData={};this.parent=null;this.visible=true}
}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,DoubleSide:2};
const layer={children:[],add(m){m.parent=this;this.children.push(m)}};
let terrainCalls=0;
const drawing=render(THREE,{plan:p,layer,terrainAt:(x,z)=>{
 assert(Number.isFinite(x)&&Number.isFinite(z));
 terrainCalls++;
 return 1.35+.02*Math.sin(x/31)+.03*Math.cos(z/22);
}});
assert(drawing);
assert.equal(drawing.drawMeshes,3);
assert(drawing.fencePickets>150);
assert(drawing.fenceSupportPosts>10);
assert.equal(drawing.weedClusters,86);
assert.equal(drawing.bushClusters,10);
assert(drawing.fenceTriangles>350);
assert.equal(drawing.weedTriangles,516);
assert.equal(drawing.shrubTriangles,140);
assert.equal(drawing.geometryFinite,true);
assert(drawing.inScene());
assert.equal(drawing.visibleAfterLOD(),3);
assert(drawing.newColliders===0&&drawing.newTrees===0&&drawing.newGates===0);
assert(terrainCalls>100);
assert(layer.children.every(mesh=>mesh.userData.lodDetail===true&&
 mesh.geometry.hasNormals&&mesh.geometry.hasBounds&&
 mesh.geometry.attributes.position.array.length>0));
assert.equal(layer.children[0].name,'Milovice_Rakouska_5266_green-photographed-fence');
layer.children[0].visible=false;
assert.equal(drawing.visibleAfterLOD(),2);
assert.equal(render(THREE,{plan:p,layer,terrainAt:null}),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-rakouska-fenced-frontage-5266.js?v=526600'",
 'planRakouskaFrontage5266({',
 'renderRakouskaFrontage5266(THREE,{',
 'window.__miloviceRakouskaFrontageRuntime5266=()=>',
 "'rakouska-fenced-frontage-5266':{",
 "const BUILD_ID='20261122-rakouska-fenced-frontage-526600'"
])assert(html.includes(token),'Missing 5.266 integration '+token);
console.log('PASS 5.266: original OSM residential road 8590286 frontage + photo fence & overgrowth, DEM vegetation and 0 collisions, 3 batches');
