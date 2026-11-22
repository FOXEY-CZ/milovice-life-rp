import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPodLesemCross5270} from './osm-pod-lesem-municipal-crossing-5270.js';
import {planPodLesemSidewalkChain5277 as old,
 advancePodLesemSidewalkChain5277 as step} from './osm-pod-lesem-sidewalk-chain-5277.js';
import {POD_LESEM_WEST_JOIN_5278 as S,planPodLesemWestJoin5278 as plan}
 from './osm-pod-lesem-west-join-5278.js';
const E=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const orig=JSON.stringify(E),crossing=planPodLesemCross5270({regionId:'mlada',ways:E});
const opts={regionId:'mlada',ways:E,crossing},base=old(opts),route=plan(opts);
assert(base&&route,'OSM original joined sidewalk found');
assert.equal(base.version,'5.277');
assert.equal(route.version,'5.278');
assert.equal(route.joinedFootwayId,S.id);
assert.equal(route.joinedFootwayHash,'26506719');
assert.deepEqual(route.originalWestJoinedOSMIndices,[1,2,3,4]);
assert.equal(route.routePoints.length,9);
assert.equal(route.cumulativeMetres.length,9);
assert(route.extendedByMetres>70&&route.extendedByMetres<72);
assert(route.totalMetres>266&&route.totalMetres<269);
assert(route.metresBeforeServiceRoad>9&&route.metresBeforeServiceRoad<11);
assert.equal(route.beforeServiceRoadId,'1456361936');
assert(route.serviceRoadIntersectionUncrossed&&route.originalGraphUnchanged);
for(const k of ['newFootways','newRoads','newCrossings','newColliders','newPavementMeshes'])
 assert.equal(route[k],0,k);
assert.equal(route.otherVehicleRoadCrossings,0);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
assert(dist(step(route,route.totalMetres,1,0),route.b)<1e-6);
assert(dist(step(route,base.totalMetres,1,0),base.b)<1e-6);
assert.equal(step(route,base.totalMetres+20,1,0).sourceSegment,5);
const source=E.find(x=>String(x.id)===S.id);
assert.deepEqual(route.sourceStopGPS,source.geometry[4]);
const incoming={x:route.center.x+20,z:route.center.z,vx:-5,vz:0};
assert(step(route,6.8,1,1,[incoming]).waitingForVehicle);
assert(step(route,15,-1,1,[incoming]).waitingForVehicle);
assert(!step(route,11,1,.3,[incoming]).waitingForVehicle);
assert(!step(route,6.8,1,1,[{...incoming,vx:5}]).waitingForVehicle);
let at=6.8,direction=1,far=false,returned=false;
for(let i=0;i<850;i++){
 const next=step(route,at,direction,.8);
 assert(next&&Number.isFinite(next.x)&&Number.isFinite(next.z));
 if(next.distance>route.totalMetres-1)far=true;
 if(next.direction===-1)returned=true;
 at=next.distance;direction=next.direction;
}
assert(far&&returned);
const a=source.geometry[2],b=source.geometry[3];
const mid={lat:(a.lat+b.lat)/2,lon:(a.lon+b.lon)/2};
const road={type:'way',id:99005278,tags:{highway:'service'},
 geometry:[{lat:mid.lat-.0001,lon:mid.lon},{lat:mid.lat+.0001,lon:mid.lon}]};
assert.equal(plan({...opts,ways:[...E,road]}),null);
assert.equal(plan({...opts,ways:E.filter(x=>String(x.id)!==S.id)}),null);
assert.equal(plan({...opts,ways:E.filter(x=>String(x.id)!=='1456361936')}),null);
assert.equal(plan({...opts,ways:E.map(w=>String(w.id)===S.id?
 {...w,geometry:w.geometry.map((v,i)=>i===4?{...v,lon:v.lon+.0000001}:v)}:w)}),null);
assert.equal(JSON.stringify(E),orig);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of ['planPodLesemWestJoin5278({',
 'podLesemWalkRoute5278||podLesemWalkRoute5277',
 'window.__milovicePodLesemWalkerRuntime5278=',
 "'pod-lesem-west-sidewalk-5278':{",
 "const BUILD_ID='20261122-pod-lesem-branch-walker-527900'"])
 assert(html.includes(marker),marker);
console.log('PASS 5.278 +70.8m joined OSM sidewalk, service-road stop, predictive yield');
