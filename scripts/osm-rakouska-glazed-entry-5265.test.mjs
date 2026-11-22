import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaVojenskeZatisi5249 as a} from './osm-italska-vojen-zatisi-5249.js';
import {filterItalskaPhotoSightlines5250 as b} from './osm-italska-photo-sightlines-5250.js';
import {extendRakouskaNorthPhoto5251 as c} from './osm-rakouska-north-photo-5251.js';
import {planRakouskaUpper5263 as d} from './osm-rakouska-photo-upper-5263.js';
import {planRakouskaUpperWindows5264 as e} from './osm-rakouska-upper-windows-5264.js';
import {RAKOUSKA_GLAZED_ENTRY_5265 as S,
 planRakouskaGlazedEntry5265 as plan,
 renderRakouskaGlazedEntry5265 as render} from './osm-rakouska-glazed-entry-5265.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const all=JSON.parse(raw).elements,building=all.find(x=>x.id===53865882);
const init=a({regionId:'mlada',building});
const seen=b({plan:init,geometry:building.geometry});
const north=c({plan:seen,geometry:building.geometry});
const upper=d({regionId:'mlada',building,basePlan:north});
const windows=e({upperPlan:upper});
const p=plan({upperPlan:upper,windowPlan:windows});
assert(p);
assert.equal(p.version,'5.265');assert.equal(p.originalWallEdge,2);
assert.equal(p.sourceOsmId,'53865882');assert.equal(p.sourceRuianId,'40057411');
assert.equal(p.sourceHash,'7aec42bc');
assert(p.wallLengthMetres>5.66&&p.wallLengthMetres<5.68);
assert(p.projectedAreaSquareMetres>11&&p.projectedAreaSquareMetres<12.6);
assert.equal(p.photoGlazedVestibule,true);assert.equal(p.photoFlatWideAwning,true);
assert.equal(p.photoUpperBalcony,true);assert.equal(p.dimensionsNotMeasured,true);
assert.equal(p.noFootprintSurvey,true);assert.equal(p.originalRoofUnmodified,true);
assert.equal(p.newOsmBuildings,0);assert.equal(p.newDoors,0);
assert.equal(p.newInteractableEntrances,0);assert.equal(p.newColliders,0);
assert.equal(p.newRoads,0);assert.equal(p.newFootways,0);
assert.equal(p.newFenceSegments,0);assert.equal(S.licence,'CC BY-SA 4.0');
assert.equal(S.photoAuthor,'Stanislav Doronenko');
assert.equal(S.photoDate,'2025-08-20');
assert.equal(plan({upperPlan:{...upper,sourceHash:'wrong'},windowPlan:windows}),null);
assert.equal(plan({upperPlan:upper,windowPlan:{...windows,sourceOsmId:'bad'}}),null);
assert.equal(plan({upperPlan:upper,windowPlan:{...windows,originalUpperSourceEdges:[0,2,8]}}),null);
assert.equal(plan({upperPlan:{...upper,perimeter:[...upper.perimeter].reverse()},windowPlan:windows}),null);
const project=q=>({x:(q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(q.lat-50.226)*111320});
const pointToLine=(p,a,b)=>{
 const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
 const t=den?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/den)):0;
 return Math.hypot(p.x-(a.x+t*dx),p.z-(a.z+t*dz));
};
let shortest=Infinity;
for(const road of all.filter(x=>x.type==='way'&&x.tags?.highway&&
 Array.isArray(x.geometry)&&x.geometry.length>1)){
 const path=road.geometry.map(project);
 for(const pnt of p.canopyCorners)
  for(let j=0;j<path.length-1;j++)
   shortest=Math.min(shortest,pointToLine(pnt,path[j],path[j+1]));
}
assert(shortest>4.0,'Road centerline too close: '+shortest);
class BufferGeometry{
 constructor(){this.attributes={}}
 setAttribute(k,v){this.attributes[k]=v}
 computeVertexNormals(){this.normals=true}
 computeBoundingSphere(){this.bounds=true}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size}}
class MeshStandardMaterial{constructor(o){this.options=o}}
class Mesh{constructor(g,m){this.geometry=g;this.material=m;
 this.userData={};this.parent=null;this.visible=true;}}
const layer={children:[],add(m){m.parent=this;this.children.push(m)}};
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,
 DoubleSide:2};
const r=render(THREE,{plan:p,layer,baseHeight:3,roofHeight:6.1});
assert(r);
assert.equal(r.drawMeshes,5);assert.equal(r.frontGlazingBays,6);
assert.equal(r.sideGlazingBays,6);assert.equal(r.vestibuleGlazingBays,12);
assert.equal(r.glassTriangles,24);assert.equal(r.canopyTriangles,12);
assert(r.steelTriangles>30);
assert.equal(r.geometryFinite,true);assert.equal(r.inScene(),true);
assert.equal(r.visibleAfterLOD(),5);assert.equal(r.newColliders,0);
assert(layer.children.every(m=>m.userData.lodDetail&&m.geometry.bounds&&
 m.geometry.normals&&m.geometry.attributes.position.array.length));
assert.equal(layer.children[0].material.options.transparent,true);
assert.equal(layer.children[0].material.options.depthWrite,false);
layer.children[0].visible=false;assert.equal(r.visibleAfterLOD(),4);
assert.equal(render(THREE,{plan:p,layer,baseHeight:3,roofHeight:18}),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-rakouska-glazed-entry-5265.js?v=526500'",
 'planRakouskaGlazedEntry5265({','renderRakouskaGlazedEntry5265(THREE,{',
 'window.__miloviceRakouskaGlazedEntryRuntime5265=()=>',
 "'rakouska-glazed-entry-5265':{",
 "const BUILD_ID='20261122-rakouska-fenced-frontage-526600'"
])assert(html.includes(token),'Missing runtime: '+token);
console.log('PASS 5.265 photo-backed glass vestibule with balcony, 5 batches and road centerline separation '+shortest.toFixed(2)+'m');
