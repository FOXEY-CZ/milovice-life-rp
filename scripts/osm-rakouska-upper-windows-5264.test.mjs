// Milovice RP 5.264 — no speculative buildings / real RUIAN upper walls.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaVojenskeZatisi5249 as basic}
 from './osm-italska-vojen-zatisi-5249.js';
import {filterItalskaPhotoSightlines5250 as filter}
 from './osm-italska-photo-sightlines-5250.js';
import {extendRakouskaNorthPhoto5251 as extend}
 from './osm-rakouska-north-photo-5251.js';
import {planRakouskaUpper5263}
 from './osm-rakouska-photo-upper-5263.js';
import {RAKOUSKA_UPPER_WINDOWS_5264 as S,
 planRakouskaUpperWindows5264 as plan,
 renderRakouskaUpperWindows5264 as render}
 from './osm-rakouska-upper-windows-5264.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const building=JSON.parse(raw).elements.find(e=>e.id===53865882);
const b=basic({regionId:'mlada',building});
const sight=filter({plan:b,geometry:building.geometry});
const north=extend({plan:sight,geometry:building.geometry});
const upper=planRakouskaUpper5263({
 regionId:'mlada',building,basePlan:north
});
assert(upper);
const good=plan({upperPlan:upper});
assert(good);
assert.equal(good.version,'5.264');
assert.equal(good.sourceOsmId,'53865882');
assert.equal(good.sourceRuianId,'40057411');
assert.equal(good.sourceHash,'7aec42bc');
assert.equal(good.windowVisualCount,6);
assert.deepEqual(good.originalUpperSourceEdges,[0,2,7]);
assert(good.originalUpperSourceEdges.every(i=>i<8));
assert.equal(good.faces[0].windows.length,2);
assert.equal(good.faces[1].windows.length,3);
assert.equal(good.faces[2].windows.length,1);
assert(good.faces.every(f=>f.windows.every(w=>
 w.lo>0&&w.hi<1&&w.y0>=0&&w.y1<=upper.modelExtraHeight-.20)));
assert.equal(good.modelDimensionsNotMeasured,true);
assert.equal(good.newPhysicalOpenings,0);
assert.equal(good.newEntrances,0);
assert.equal(good.newBuildings,0);
assert.equal(good.newColliders,0);
assert.equal(good.newRoads,0);
assert.equal(good.newFootways,0);
assert.equal(good.newFences,0);
assert.equal(S.licence,'CC BY-SA 4.0');
assert.equal(S.author,'Stanislav Doronenko');
assert.equal(S.photoDate,'2025-08-20');
assert.equal(plan({upperPlan:{...upper,sourceHash:'fake'}}),null);
assert.equal(plan({upperPlan:{...upper,perimeter:[...upper.perimeter,{x:1,z:2}]}}),null);
assert.equal(plan({upperPlan:{...upper,modelExtraHeight:5}}),null);
assert.equal(plan({upperPlan:{...upper,vertices:[...upper.vertices].reverse()}}),null);
const modified=structuredClone(building);
modified.geometry[2].lat+=.000001;
assert.equal(planRakouskaUpper5263({
 regionId:'mlada',building:modified,basePlan:north
}),null);
assert.equal(planRakouskaUpper5263({
 regionId:'mlada',building:{...building,id:53865877},basePlan:north
}),null);
class BufferGeometry{
 setAttribute(k,v){this[k]=v}computeVertexNormals(){this.hasNormals=true}
 computeBoundingSphere(){this.hasBounds=true}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size}}
class MeshStandardMaterial{constructor(o){this.options=o}}
class Mesh{constructor(g,m){this.geometry=g;this.material=m;this.userData={};
 this.parent=null;this.visible=true;}}
const layer={children:[],add(mesh){mesh.parent=this;this.children.push(mesh)}};
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,
 DoubleSide:'DoubleSide'};
const rendered=render(THREE,{
 plan:good,layer,baseHeight:3,roofHeight:6.1
});
assert(rendered);
assert.equal(rendered.photoWindowVisualCount,6);
assert.equal(rendered.renderDrawCalls,4);
assert.equal(rendered.paneTriangles,12);
assert.equal(rendered.frameTriangles,60);
assert.equal(rendered.weatherPatches,8);
assert.equal(rendered.plasterTriangles,22);
assert.equal(rendered.modelHeightMeasurements,false);
assert.equal(rendered.newPhysicalOpenings,0);
assert.equal(rendered.newColliders,0);
assert.deepEqual(rendered.originalUpperSourceEdges,[0,2,7]);
assert.equal(rendered.visibleAfterLOD(),4);
assert.equal(rendered.inScene(),true);
assert(layer.children.every(m=>m.userData.lodDetail&&m.geometry.hasBounds&&
 m.geometry.hasNormals&&m.geometry.position.array.length>0&&
 m.geometry.position.array.every(Number.isFinite)));
assert(layer.children.every(m=>m.geometry.position.array.every((v,i)=>
 i%3!==1||v>=9.1&&v<11.55)));
layer.children.at(0).visible=false;
assert.equal(rendered.visibleAfterLOD(),3);
assert.equal(render(THREE,{plan:good,layer,baseHeight:3,roofHeight:20}),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-rakouska-upper-windows-5264.js?v=526400'",
 'planRakouskaUpperWindows5264({',
 'renderRakouskaUpperWindows5264(THREE,{',
 'window.__miloviceRakouskaUpperWindowsRuntime5264=()=>',
 "'rakouska-upper-windows-5264':{",
 "const BUILD_ID='"
])assert(html.includes(token),'Missing live 5.264 integration: '+token);
console.log('PASS 5.264: six model upper-window surfaces on three original photographed wall edges, aged plaster, 4 render batches and intact OSM.');
