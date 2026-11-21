// 5.226 source-locked Lesní footway branches and guarded real bend.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 LESNI_FOOTWAY_BRANCHES_5226 as C,
 planLesniFootwayBranches5226 as plan,
 planLesniFootwayBranchCorner5226 as corner,
 renderLesniFootwayBranchCorner5226 as render
} from './osm-lesni-footway-branches-5226.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const els=JSON.parse(raw).elements;
const selected=[C.main,...C.branches,C.paved,C.road].map(c=>
 els.filter(x=>String(x.id)===c.id));
assert(selected.every(x=>x.length===1),'all five OSM source ways unique');
const original=JSON.stringify(selected);
const p=plan('mlada',els);
assert(p,'all OSM source road-side connector nodes must exist');
assert.equal(p.version,'5.226');
assert.deepEqual(p.sourceWayIds,['1352859035','1352859040','1352859041','1057549994']);
assert.deepEqual(p.sourceHashes,['bb42422e','4af0a7a6','12c5eac0','02767378']);
assert.equal(p.sourceRoadId,'1044078106');
assert.equal(p.sourceRoadHash,'d1ac81dd');
assert.equal(p.originalFootwaySegments,11);
assert.equal(p.originalFootwayMeters,127.020);
assert.equal(p.neutralSourceSegments,6);
assert.equal(p.neutralOriginalMeters,56.555);
assert.deepEqual(p.neutralFootwayIds,['1352859035','1352859040','1352859041']);
assert.equal(p.neutralMaterial,'visnova-footway-model');
assert.equal(p.neutralSurfaceIsUntagged,true);
assert.equal(p.pavedSourceSurface,'paving_stones');
assert.equal(p.pavedOriginalSegments,5);
assert.equal(p.mainToPavedJunctionGPS,'50.2291300,14.8703439');
assert.deepEqual(p.branchToMainGPS,[
 '50.2294007,14.8705153','50.2294921,14.8706501']);
assert.deepEqual(p.branchToRoadGPS,[
 '50.2294215,14.8704746','50.2295125,14.8706140']);
assert.equal(p.originalBendNode,3);
for(const k of ['originalPedestrianConnections','realRoadJunctionsConfirmed',
 'sourceGeometryPreserved','realSurfaceNotVerified','estimatedCornerPatchOnly'])
 assert.equal(p[k],true,k);
for(const k of ['addedRoads','addedFootways','addedRoadCrossings','inventedZebraStripes',
 'addedBuildings','addedColliders','addedTrees','addedKerbs','addedEntrances'])
 assert.equal(p[k],0,k);
const main=selected[0][0],a=selected[1][0],b=selected[2][0],
 paved=selected[3][0],road=selected[4][0];
const change=(id,overrides)=>els.map(w=>String(w.id)===String(id)?{...w,...overrides}:w);
for(const [why,region,ways] of [
 ['wrong region','other',els],
 ['missing road','mlada',els.filter(w=>String(w.id)!==C.road.id)],
 ['duplicate branch','mlada',[...els,b]],
 ['wrong main lit','mlada',change(main.id,{tags:{...main.tags,lit:'no'}})],
 ['invent surface','mlada',change(main.id,{tags:{...main.tags,surface:'concrete'}})],
 ['wrong branch tag','mlada',change(a.id,{tags:{...a.tags,footway:'sidewalk'}})],
 ['wrong paving','mlada',change(paved.id,{tags:{...paved.tags,surface:'asphalt'}})],
 ['wrong road class','mlada',change(road.id,{tags:{...road.tags,highway:'service'}})],
 ['move short footway','mlada',change(b.id,{geometry:b.geometry.map((p,j)=>j===1?{...p,lat:p.lat+.0000001}:p)})],
 ['move main end','mlada',change(main.id,{geometry:main.geometry.map((p,j)=>j===4?{...p,lon:p.lon+.0000001}:p)})],
 ['move road endpoint','mlada',change(road.id,{geometry:road.geometry.map((p,j)=>j===2?{...p,lon:p.lon+.0000001}:p)})],
 ['reverse long footway','mlada',change(main.id,{geometry:[...main.geometry].reverse()})]
 ])assert.equal(plan(region,ways),null,'fail closed '+why);
const w=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const clear={isClear:()=>true};
const options={regionId:'mlada',ways:els,toWorld:w,roads:clear,buildings:clear};
const c=corner(options);
assert(c,'original one-bend path can be planned');
assert.equal(c.version,'5.226');
assert.equal(c.sourceWayId,'1352859035');
assert.equal(c.originalBendNode,3);
assert.equal(c.safeOriginalBendTriangles.length,1,
 'one source-owned 29.5-degree corner needs a small fill');
assert.equal(c.safeOriginalBendTriangles[0].atNode,3);
assert(c.safeOriginalBendTriangles[0].area>.01&&
 c.safeOriginalBendTriangles[0].area<.75);
for(const k of ['roads','buildings']){
 const blocked=corner({...options,[k]:{isClear:()=>false}});
 assert(blocked,'strict safety checks may suppress visual geometry');
 assert.equal(blocked.safeOriginalBendTriangles.length,0,
  'NEVER place a wedge over '+k);
}
class BufferGeometry{
 setAttribute(k,v){this[k]=v;}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Float32BufferAttribute{constructor(array,dim){this.array=array;this.dim=dim;}}
class Mesh{
 constructor(g,m){this.geometry=g;this.material=m;
  this.visible=true;this.parent=null;this.userData={};}
}
const THREE={BufferGeometry,Float32BufferAttribute,Mesh};
const layer={visible:true,children:[],add(m){m.parent=this;this.children.push(m)}};
const material={label:'neutral unverified path'};
const actual=render(THREE,{plan:c,layer,material,terrainAt:()=>112});
assert(actual);
assert.equal(actual.triangles,1);
assert.equal(actual.meshCount,1);
assert.equal(actual.attached(),true);
assert.equal(actual.visibleAfterLOD(),1);
assert.equal(layer.children.length,1);
assert.equal(layer.children[0].material,material);
assert.equal(layer.children[0].userData.onlyOriginalOSMBend,true);
assert.equal(layer.children[0].geometry.position.array.length,9);
layer.visible=false;assert.equal(actual.visibleAfterLOD(),0);
const blocked=corner({...options,buildings:{isClear:()=>false}});
const empty=render(THREE,{plan:blocked,layer,material,terrainAt:()=>112});
assert.equal(empty.meshCount,0);
assert.equal(empty.triangles,0);
assert.equal(JSON.stringify(selected),original,'all OSM original ways stay unchanged');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/osm-lesni-footway-branches-5226.js?v=522600'",
 'const lesniBranchesPlan5226=planLesniFootwayBranches5226(regionId,roadWays);',
 'const lesniBranchesNeutral5226=lesniBranchesPlan5226?.neutralFootwayIds.includes(String(el.id));',
 'material:lesniBranchesPlan5226.neutralMaterial',
 'const lesniBranchesDrawBefore5226=',
 'osmSurfaceAudit.drawnSegments-lesniBranchesDrawBefore5226',
 'planLesniFootwayBranchCorner5226({',
 'renderLesniFootwayBranchCorner5226(THREE,{',
 'window.__miloviceLesniBranchesRuntime5226=()=>',
 "'lesni-footway-branches-5226':{",
 'href="?v=522600&streetAudit=lesni-footway-branches-5226"',
 'window.__miloviceLesniBranchesAudit5226=null;'
])assert(html.includes(marker),'missing real runtime/game integration '+marker);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud,'title/HUD/meta/build in sync');
console.log('PASS 5.226 original 127.020m/11 OSM source segments,',
 '3 neutral footways/56.555m with 2 road-endpoint branches,',
 'one safe optional 3D bend wedge on source node 3, NO new ways or crossing');
