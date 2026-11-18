import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaContinuousHip5160,renderTopolovaContinuousHip5160}
 from './osm-topolova-continuous-hip-5160.js';
const els=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements;
const ways=els.filter(x=>x.tags?.building&&x.geometry);
const before=JSON.stringify(ways);
const old=planTopolovaPanelRow5155({regionId:'mlada',ways});
const plan=planTopolovaContinuousHip5160({regionId:'mlada',rowPlan:old,ways});
assert(plan,'OSM source-locked hip roof did not plan');
assert.equal(plan.version,'5.160');
assert.equal(plan.sourceHipRoofDocumented,true);
assert.deepEqual(plan.addresses,[614,615,616,617,618]);
assert.equal(plan.eastGPS.length,6);
assert.equal(plan.westGPS.length,6);
assert.equal(plan.edgeLengths.length,5);
assert(plan.totalLength>79&&plan.totalLength<82.5);
assert(plan.widthNorth>11&&plan.widthNorth<12.5);
assert(plan.widthSouth>11&&plan.widthSouth<12.5);
for(const prop of ['addedRoads','addedPaths','addedTrees','addedParking',
 'addedColliders','addedWindowFixtures'])assert.equal(plan[prop],0);
for(const patch of [
 {regionId:'old'},
 {ways:ways.filter(x=>x.id!==61979145)},
 {rowPlan:{...old,contiguousExactSharedPartyWalls:3}},
 {ways:ways.map(x=>x.id===61979139?
  {...x,geometry:x.geometry.map((p,i)=>i===1?{...p,lat:p.lat+.0000001}:p)}:x)}
])assert.equal(planTopolovaContinuousHip5160({regionId:'mlada',rowPlan:old,ways,...patch}),null);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const THREE={DoubleSide:2,
 BufferGeometry:class{setAttribute(k,v){this[k]=v}computeVertexNormals(){}computeBoundingSphere(){}},
 Float32BufferAttribute:class{constructor(a,n){this.array=a;this.itemSize=n}},
 MeshStandardMaterial:class{constructor(v){this.options=v}},
 Mesh:class{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.visible=true}}
};
const layer={visible:true,children:[],add(m){m.parent=this;this.children.push(m)}};
const render=renderTopolovaContinuousHip5160(THREE,{plan,toWorld,layer,
 baseById:id=>({base:100+plan.sourceOSMIds.indexOf(id)*.02,height:15.25})});
assert(render);
assert.equal(render.drawMeshes,1);
assert.equal(render.triangles,22);
assert.equal(render.renderVertices,66);
assert.equal(render.hipEndFaces,2);
assert.equal(render.joinedSideEdges,10);
assert(render.modelRoofHighY-render.modelEaveMinY>=2.25);
assert.equal(render.visibleAfterLOD(),1);
assert(render.allInScene());
assert.equal(layer.children.length,1);
assert.equal(layer.children[0].userData.lodDetail,false);
assert.equal(layer.children[0].geometry.position.array.length,198);
layer.visible=false;
assert.equal(render.visibleAfterLOD(),0);
assert.equal(JSON.stringify(ways),before);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const key of [
 "from './scripts/osm-topolova-continuous-hip-5160.js?v=516000'",
 'const topolovaHipPlan=planTopolovaContinuousHip5160({',
 'renderTopolovaContinuousHip5160(THREE,{',
 'window.__miloviceTopolovaHipRuntime=()=>{',
 'window.__miloviceTopolovaHipAudit.suppressedFlatCaps++;',
 "'topolova-hip-roof-5160':{"
])assert(html.includes(key),'Missing 5.160 integration '+key);
console.log('PASS 5.160: true source-backed continuous 80m hipped roof, 22 triangles, one visible mesh, all 5 OSM polygons original');
