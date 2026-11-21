// Milovice RP 5.220 — EXACT two original paved sidewalk GPS polylines.
// No new road or inaccurate claim of a single connected pedestrian route.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 VISNOVA_ESTATE_PAVERS_5220 as C,
 planVisnovaEstatePavers5220 as plan,
 planVisnovaEstatePaverTurns5220 as turns,
 renderVisnovaEstatePaverTurns5220 as render
} from './osm-visnova-estate-pavers-5220.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const ways=C.paths.map(spec=>elements.find(w=>String(w.id)===spec.id));
assert(ways.every(Boolean),'two original OSM paving-stone sidewalks exist');
const original=JSON.stringify(ways);
const cos=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*111320*cos,
 y:-(p.lat-50.226)*111320});
const safe={isClear:()=>true};
let meters=0,segments=0;
for(let i=0;i<ways.length;i++){
 const spec=C.paths[i],w=ways[i],p=plan('mlada',w);
 assert(p,'source verified '+spec.id);
 assert.equal(p.sourceOSMId,spec.id);
 assert.equal(p.sourceHash,spec.hash);
 assert.equal(p.originalNodes,spec.nodes);
 assert.equal(p.originalTag,'paving_stones');
 assert.equal(p.material,'visnova-tagged-paving-stones');
 assert.equal(p.sourceSegments,spec.nodes-1);
 assert(Math.abs(p.originalLengthMeters-spec.expectedLength)<.35);
 assert.equal(p.originalOSMGeometryUntouched,true);
 assert.equal(p.sourceSidewalkWidthUnchanged,true);
 assert.equal(p.modelPaverShadeUnverified,true);
 for(const k of ['newFootways','newRoads','newColliders',
  'newParkingSpaces','changedRoadCoordinates'])assert.equal(p[k],0,k);
 meters+=p.originalLengthMeters;segments+=p.sourceSegments;
 for(const bad of [
  {...w,id:1234},
  {...w,tags:{...w.tags,surface:'asphalt'}},
  {...w,tags:{...w.tags,lit:'no'}},
  {...w,tags:{...w.tags,footway:'crossing'}},
  {...w,tags:{...w.tags,addedFeature:'unknown'}},
  {...w,geometry:w.geometry.map((v,j)=>
   j===2?{...v,lon:v.lon+.0000001}:v)},
  {...w,geometry:w.geometry.slice(0,-1)}
 ])assert.equal(plan('mlada',bad),null,'fail closed '+spec.id);
 assert.equal(plan('vrutice',w),null);
}
assert.equal(segments,11);
assert(Math.abs(meters-371.635)<.2);
const opts={regionId:'mlada',ways,toWorld:world,
 roads:safe,buildings:safe};
const p=turns(opts);
assert(p,'source-locked two-way corner plan exists');
assert.deepEqual(p.sourceWayIds,['1005977571','1057549994']);
assert.deepEqual(p.sourceNodes,[7,6]);
assert.equal(p.sourceSegments,11);
assert.equal(p.material,'visnova-tagged-paving-stones');
assert(p.candidateTurns>=1&&p.candidateTurns<=3,
 'only 1 to 3 short known original bends can need infill');
assert(p.cornerTriangles.every(t=>
 t.sourceWayId==='1057549994'&&t.materialSource==='paving_stones'&&
 t.onlyFillsExistingPathBend===true&&t.area>0&&t.area<1));
assert.equal(p.originalFootwayGeometryUntouched,true);
assert.equal(p.originalRoadWidthsUntouched,true);
assert.equal(p.exactPaverPatternPhotoVerified,false);
for(const k of ['newFootwayRoutes','newRoads','newCrossings',
 'newColliders','newTrees','newKerbs'])assert.equal(p[k],0,k);
assert.deepEqual(p,turns(opts),'deterministic original corner triangles');
for(const reject of ['roads','buildings']){
 const blocked=turns({...opts,[reject]:{isClear:()=>false}});
 assert(blocked,'the original two footways must remain verified');
 assert.equal(blocked.cornerTriangles.length,0,'strict '+reject+' clearance');
}
for(const invalid of [
 ways.slice(1),
 [...ways,ways[0]],
 ways.map((w,i)=>i?{...w,tags:{...w.tags,surface:'asphalt'}}:w),
 ways.map((w,i)=>i?{...w,geometry:w.geometry.map((v,j)=>
  j===1?{...v,lat:v.lat+.0000001}:v)}:w)
])assert.equal(turns({...opts,ways:invalid}),null,
 'two-way plan rejects missing, duplicate or changed OSM source');
assert.equal(turns({...opts,regionId:'old'}),null);
class BufferGeometry{
 setAttribute(k,v){this[k]=v;}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Float32BufferAttribute{
 constructor(array,n){this.array=array;this.itemSize=n;}
}
class Mesh{
 constructor(geometry,material){
  this.geometry=geometry;this.material=material;
  this.visible=true;this.userData={};this.parent=null;
 }
}
const THREE={BufferGeometry,Float32BufferAttribute,Mesh};
const layer={visible:true,children:[],add(m){m.parent=this;this.children.push(m)}};
const material={name:'tagged-paving-stones'};
const rendered=render(THREE,{plan:p,layer,terrainAt:()=>12,material});
assert(rendered,'source triangles render');
assert.equal(rendered.triangles,p.candidateTurns);
assert.equal(rendered.drawMeshes,1);
assert.equal(rendered.attached(),true);
assert.equal(rendered.visibleAfterLOD(),1);
assert.equal(layer.children.length,1);
assert.equal(layer.children[0].material,material);
assert.equal(layer.children[0].geometry.position.array.length,
 p.candidateTurns*9);
assert.equal(layer.children[0].userData.onlyOriginalOSMFootwayBends,true);
layer.visible=false;
assert.equal(rendered.visibleAfterLOD(),0,'LOD visibility required');
assert.equal(JSON.stringify(ways),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 raw,'do not edit OSM coordinates');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const n of [
 "from './scripts/osm-visnova-estate-pavers-5220.js?v=522000'",
 'planVisnovaEstatePavers5220(regionId,el)',
 'planVisnovaEstatePaverTurns5220({',
 'renderVisnovaEstatePaverTurns5220(THREE,{',
 'window.__miloviceVisnovaEstatePaversAudit5220',
 'window.__miloviceVisnovaEstatePaversRuntime5220=()=>',
 'visnovaEstatePavers5220?',
 "'visnova-estate-pavers-5220':{",
 'href="?v=522000&streetAudit=visnova-estate-pavers-5220"',
 "const BUILD_ID='"
])assert(html.includes(n),'real game integration missing '+n);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===build&&build===hud,'HUD, meta and runtime builds in sync');
console.log('PASS 5.220 original OSM two paved sidewalks',
 +meters.toFixed(3),'m,',segments,'original segments,',
 p.candidateTurns,'source-turn wedge triangles one GPU mesh;',
 'no new footways, roads, curbs or colliders');
