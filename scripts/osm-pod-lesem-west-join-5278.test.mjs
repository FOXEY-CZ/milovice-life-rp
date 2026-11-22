import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPodLesemCross5270} from './osm-pod-lesem-municipal-crossing-5270.js';
import {planPodLesemSidewalkChain5277 as old,
 advancePodLesemSidewalkChain5277 as step} from './osm-pod-lesem-sidewalk-chain-5277.js';
import {POD_LESEM_WEST_JOIN_5278 as S,planPodLesemWestJoin5278 as plan}
 from './osm-pod-lesem-west-join-5278.js';
import {stepPodLesemWalkerPose5280 as pose5280} from './osm-pod-lesem-walker-pose-5280.js';
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
// Regression: a newly imported vehicle way along an existing sidewalk
// segment is a collision too, even if both line segments are collinear.
const overlapRoad={type:'way',id:99005279,tags:{highway:'service'},
 geometry:[{...a},{...b}]};
assert.equal(plan({...opts,ways:[...E,overlapRoad]}),null);
const partialRoad={...overlapRoad,id:99005280,
 geometry:[{...a,lat:(3*a.lat+b.lat)/4,lon:(3*a.lon+b.lon)/4},
 {...a,lat:(a.lat+3*b.lat)/4,lon:(a.lon+3*b.lon)/4}]};
assert.equal(plan({...opts,ways:[...E,partialRoad]}),null);
assert.equal(plan({...opts,ways:E.filter(x=>String(x.id)!==S.id)}),null);
assert.equal(plan({...opts,ways:E.filter(x=>String(x.id)!=='1456361936')}),null);
assert.equal(plan({...opts,ways:E.map(w=>String(w.id)===S.id?
 {...w,geometry:w.geometry.map((v,i)=>i===4?{...v,lon:v.lon+.0000001}:v)}:w)}),null);
assert.equal(JSON.stringify(E),orig);
// 5.280: facing changes at a bounded angular speed; gait follows metres,
// and waiting at the mapped crossing does not march in place.
const poseStart=pose5280({yaw:0,targetYaw:Math.PI,dt:1/60,
 movedMetres:.1,phase:0,swing:0,waiting:false});
assert(poseStart&&Math.abs(poseStart.yaw)<=4.6/60+.000001);
assert(poseStart.phase>0&&poseStart.phase<1);
assert(poseStart.sourceGeometryUntouched);
const crossWrap=pose5280({yaw:Math.PI-.02,targetYaw:-Math.PI+.02,dt:.05,
 movedMetres:.05,phase:poseStart.phase,swing:poseStart.swing});
assert(crossWrap.turnRadians>0&&crossWrap.turnRadians<.05);
let idle={yaw:poseStart.yaw,phase:poseStart.phase,swing:.42};
for(let i=0;i<20;i++){
 idle=pose5280({yaw:idle.yaw,targetYaw:Math.PI/2,dt:.05,
  movedMetres:0,phase:idle.phase,swing:idle.swing,waiting:true});
}
assert(Math.abs(idle.swing)<.001&&idle.phase===poseStart.phase);
assert(Math.abs(idle.yaw-Math.PI/2)<.01);
assert.equal(pose5280({yaw:NaN,targetYaw:1,dt:0,movedMetres:0,
 phase:0,swing:0}),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of ['planPodLesemWestJoin5278({',
 'podLesemWalkRoute5278||podLesemWalkRoute5277',
 'window.__milovicePodLesemWalkerRuntime5278=',
 "'pod-lesem-west-sidewalk-5278':{",
 "const BUILD_ID='20261122-armadni-houses-528200'",
 'smoothTurn5280:true,strideLinked5280:true,waitingIdle5280:true'])
 assert(html.includes(marker),marker);
console.log('PASS 5.280 smooth yaw, distance-linked gait, idle at crossing; 5.278 mapped route intact');
