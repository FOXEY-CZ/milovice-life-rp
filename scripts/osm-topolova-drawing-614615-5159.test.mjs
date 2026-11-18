import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DRAWINGS_5159,planTopolovaDrawing5159,renderTopolovaDrawing5159}
 from './osm-topolova-drawing-614615-5159.js';
const els=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const source=els.filter(x=>[61979151,61979152,61979145].includes(x.id));
const original=JSON.stringify(source);
const THREE={DoubleSide:2,
 BufferGeometry:class{setAttribute(k,v){this[k]=v}computeVertexNormals(){}computeBoundingSphere(){}},
 Float32BufferAttribute:class{constructor(a,n){this.array=a;this.itemSize=n}},
 MeshStandardMaterial:class{constructor(v){this.options=v}},
 Mesh:class{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.visible=true}}
};
for(const s of DRAWINGS_5159){
 const w=els.find(x=>String(x.id)===s.id);
 const args={id:w.id,regionId:'mlada',tags:w.tags,geometry:w.geometry,visualHeight:15.25};
 const plan=planTopolovaDrawing5159(args);
 assert(plan,'Missing source');
 assert.deepEqual(plan.facadeEdges,[s.east,s.west]);
 const outline=w.geometry.slice(0,-1).map(p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
  y:-(p.lat-50.226)*111320}));
 const layer={children:[],visible:true,add(x){x.parent=this;this.children.push(x)}};
 const render=renderTopolovaDrawing5159(THREE,{plan,outline,baseY:100,layer});
 assert(render);
 for(const [k,v] of Object.entries({renderedFaces:2,renderedMeshes:3,normalWindows:24,
  balconySets:16,stairWindows:8,entries:2,roundedCaps:2}))assert.equal(render[k],v,k);
 assert(render.gpuTriangles>250);
 assert(render.allInScene()&&render.visibleAfterLOD()===3);
 for(const m of layer.children){
  assert.equal(m.geometry.position.array.length%9,0);
  assert(m.geometry.position.array.length>0);
  assert.equal(m.userData.lodDetail,false);
 }
 for(const patch of [
  {visualHeight:12},{tags:{...w.tags,'building:levels':'4'}},
  {geometry:w.geometry.map((p,i)=>i===1?{...p,lat:p.lat+.0000001}:p)}
 ])assert.equal(planTopolovaDrawing5159({...args,...patch}),null);
}
assert.equal(JSON.stringify(source),original);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-topolova-drawing-614615-5159.js?v=515900'",
 'const topolovaDrawingPlan=planTopolovaDrawing5159({',
 'renderTopolovaDrawing5159(THREE,{',
 'if(topolovaDrawingPlan?.facadeEdges.includes(i)){',
 'window.__miloviceTopolovaDrawingRuntime=()=>{',
 "'topolova-drawing-614615-5159':{"
])assert(html.includes(token),'Missing '+token);
console.log('PASS 5.159 614/615 source-locked 4 signed facades, 6 meshes, zero OSM mutations');
