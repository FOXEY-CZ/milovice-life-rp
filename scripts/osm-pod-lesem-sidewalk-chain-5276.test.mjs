import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPodLesemCross5270} from './osm-pod-lesem-municipal-crossing-5270.js';
import {planPodLesemWalker5275} from './osm-pod-lesem-crossing-walker-5275.js';
import {planPodLesemSidewalkChain5276 as plan,advancePodLesemSidewalkChain5276 as advance}
 from './osm-pod-lesem-sidewalk-chain-5276.js';
const E=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const original=JSON.stringify(E),crossing=planPodLesemCross5270({regionId:'mlada',ways:E});
const opts={regionId:'mlada',ways:E,crossing},short=planPodLesemWalker5275(opts),route=plan(opts);
assert(short&&route);
assert.equal(short.totalMetres,22);
assert.equal(route.version,'5.276');
assert.equal(route.sourceFootwayId,'1005977571');
assert.deepEqual(route.originalWestOSMIndices,[4,5,6]);
assert.equal(route.routePoints.length,5);
assert(route.totalMetres>195&&route.totalMetres<199);
assert(route.westernExtensionMetres>180);
assert.equal(route.crossingAt,11);
assert.equal(route.otherVehicleRoadCrossings,0);
for(const name of ['newFootways','newRoads','newCrossings','newColliders','newPavementMeshes'])
 assert.equal(route[name],0);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
assert(dist(advance(route,11,1,0),route.center)<1e-6);
assert(dist(advance(route,route.totalMetres,1,0),route.b)<1e-6);
assert.equal(advance(route,route.cumulativeMetres[2]+7,1,0).sourceSegment,2);
const car={x:route.center.x,z:route.center.z};
assert(advance(route,6.8,1,1,[car]).waitingForVehicle);
assert(advance(route,15,-1,1,[car]).waitingForVehicle);
assert(!advance(route,6.8,1,1,[]).waitingForVehicle);
assert(!advance(route,6.8,1,1,[{x:car.x+50,z:car.z}]).waitingForVehicle);
let d=6.8,direction=1,far=false,returned=false;
for(let i=0;i<700;i++){
 const next=advance(route,d,direction,.72);
 assert(next&&Number.isFinite(next.x)&&Number.isFinite(next.z));
 if(next.distance>route.totalMetres-1)far=true;
 if(next.direction===-1)returned=true;
 d=next.distance;direction=next.direction;
}
assert(far&&returned);
const way=E.find(x=>String(x.id)==='1005977571');
const p=way.geometry[3],q=way.geometry[4];
const mid={lat:(p.lat+q.lat)/2,lon:(p.lon+q.lon)/2};
const road={type:'way',id:99005276,tags:{highway:'service'},
 geometry:[{lat:mid.lat-.0001,lon:mid.lon},{lat:mid.lat+.0001,lon:mid.lon}]};
assert.equal(plan({...opts,ways:[...E,road]}),null);
assert.equal(plan({...opts,regionId:'old'}),null);
assert.equal(JSON.stringify(E),original);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const mark of ['planPodLesemSidewalkChain5276({',
 'advancePodLesemSidewalkChain5276(', 'window.__milovicePodLesemWalkerRuntime5276=',
 "const BUILD_ID='20261122-pod-lesem-sidewalk-chain-527600'"])
 assert(html.includes(mark),mark);
console.log('PASS 5.276 original sidewalk chain ~197m with safe crossing');
