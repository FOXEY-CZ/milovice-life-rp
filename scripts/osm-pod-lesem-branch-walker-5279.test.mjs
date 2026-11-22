import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPodLesemCross5270} from './osm-pod-lesem-municipal-crossing-5270.js';
import {planPodLesemWestJoin5278} from './osm-pod-lesem-west-join-5278.js';
import {POD_LESEM_BRANCH_5279 as S,planPodLesemBranch5279 as plan,
 advancePodLesemBranch5279 as advance} from './osm-pod-lesem-branch-walker-5279.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements,copy=JSON.stringify(E);
const crossing=planPodLesemCross5270({regionId:'mlada',ways:E});
const parentRoute=planPodLesemWestJoin5278({regionId:'mlada',ways:E,crossing});
const opts={regionId:'mlada',ways:E,parentRoute},route=plan(opts);
assert(parentRoute&&route,'mapped original branch must exist');
assert.equal(route.version,'5.279');
assert.equal(route.sourcePathId,'1272081412');
assert.equal(route.originalPathHash,'69d970c5');
assert.equal(route.sourceLitTag,'no');
assert.equal(route.sourceMainFootwayId,'1005977571');
assert.deepEqual(route.originalNodeIndices,[8,7,6,5,4,3,2,1]);
assert(route.totalMetres>108&&route.totalMetres<110);
assert(route.nearestMappedVehicleRoadMetres>8.5);
assert(route.metresToOriginalRoadCentre>14&&route.metresToOriginalRoadCentre<16);
assert(route.firstRoadSharedNodeExcluded);
assert.deepEqual(route.mappedJoinGPS,{lat:50.2288905,lon:14.8710178});
assert.deepEqual(route.mappedTurnaroundGPS,{lat:50.2280641,lon:14.8716418});
for(const k of ['newFootways','newRoads','newCrossings','newColliders','newPavementMeshes'])
 assert.equal(route[k],0,k);
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
assert(distance(advance(route,0,1,0),xy(route.mappedJoinGPS))<1e-6);
assert(distance(advance(route,route.totalMetres,1,0),xy(route.mappedTurnaroundGPS))<1e-6);
let pos=6.3,dir=1,turn=false,lastSegment=false;
for(let i=0;i<330;i++){
 const now=advance(route,pos,dir,.85);
 assert(now&&now.roadCrossings===0&&now.onMappedFootway);
 if(now.segment>=6)lastSegment=true;
 if(now.turnsBeforeRoad)turn=true;
 pos=now.distance;dir=now.direction;
}
assert(lastSegment&&turn,'resident turns back before actual road');
assert.equal(advance(route,0,1,3.01),null);
assert.equal(advance(route,NaN,1,0),null);
assert.equal(advance(route,0,0,1),null);
const path=E.find(e=>String(e.id)===S.pathId);
const a=path.geometry[6],b=path.geometry[7],lat=(a.lat+b.lat)/2,lon=(a.lon+b.lon)/2;
const newRoad={type:'way',id:99005279,tags:{highway:'service'},
 geometry:[{lat,lon:lon-.0002},{lat,lon:lon+.0002}]};
assert.equal(plan({...opts,ways:[...E,newRoad]}),null);
for(const id of [S.pathId,S.roadId]){
 assert.equal(plan({...opts,ways:E.filter(e=>String(e.id)!==id)}),null);
 assert.equal(plan({...opts,ways:[...E,E.find(e=>String(e.id)===id)]}),null);
 assert.equal(plan({...opts,ways:E.map(e=>String(e.id)===id?
  {...e,geometry:e.geometry.map((p,i)=>i===1?{...p,lat:p.lat+.0000001}:p)}:e)}),null);
}
assert.equal(plan({...opts,parentRoute:{...parentRoute,version:'5.277'}}),null);
assert.equal(plan({...opts,regionId:'other'}),null);
assert.equal(JSON.stringify(E),copy);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of ['planPodLesemBranch5279({','rpSpawnPodLesemBranch5279(area.id);',
 'if(obj.podLesemBranch5279){',
 'window.__milovicePodLesemBranchRuntime5279=()=>({',
 "'pod-lesem-branch-5279':{",
 "const BUILD_ID='20261122-pod-lesem-branch-walker-527900'"])
 assert(html.includes(token),token);
console.log('PASS 5.279 original 109m branch NPC turns before Pod Lesem road, no crossings');
