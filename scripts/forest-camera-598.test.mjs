// 5.98: technical forest audit camera must actually look INTO mapped forest.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {insideMappedPolygon,planForestReviewCamera}
 from './forest-camera-598.js';
import {planOSMForestTreeInstances} from './forest-placement-597.js';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const center={x:(14.8674734-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(50.2258334-50.226)*111320};
const mlada=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements;
const forest=mlada.find(e=>e.id===26023867);
assert(forest?.tags?.name==='Juventský les');
const pts=forest.geometry.map(toWorld);
assert.equal(insideMappedPolygon(center.x,center.z,pts),false,
 'The old advertised GPS is outside the actual concave Juventsky forest');
const area=(()=>{let a=0;for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+1)%pts.length];
 a+=p.x*q.z-q.x*p.z;}return Math.abs(a)/2})();
const zone={id:'26023867',kind:'forest',points:pts,area};
const trees=planOSMForestTreeInstances([zone]).trees;
assert(trees.length>=20&&trees.every(t=>insideMappedPolygon(t.x,t.z,pts)));
const clear=planForestReviewCamera({forestId:'26023867',zone,trees});
assert(clear?.eyeInsideMappedPolygon&&clear.eyeSafe&&clear.nearbyTreesInFront>0);
assert(insideMappedPolygon(clear.x,clear.z,pts));
assert(Math.hypot(clear.x-clear.targetTree.x,clear.z-clear.targetTree.z)>7);
assert.deepEqual(clear,planForestReviewCamera({forestId:'26023867',
 zone,trees:[...trees].reverse()}),'Forest position must be deterministic');
assert.equal(planForestReviewCamera({forestId:'999',zone,trees}),null);
const occupied=createRoadClearance();
occupied.addRoad({id:7,points:[{x:clear.x-6,z:clear.z},{x:clear.x+6,z:clear.z}],width:7});
const safe=planForestReviewCamera({forestId:'26023867',zone,trees,
 isSafe:(x,z)=>occupied.isClear(x,z,.5,.5)});
assert(safe&&occupied.isClear(safe.x,safe.z,.5,.5),
 'Camera must not be placed inside an existing mapped road');
const buildings=makeSidewalkBuildingGuard();
const around=(x,z,d)=>[{x:x-d,z:z-d},{x:x+d,z:z-d},
 {x:x+d,z:z+d},{x:x-d,z:z+d}];
buildings.add('test',around(clear.x,clear.z,10));
const safeBuilding=planForestReviewCamera({forestId:'26023867',zone,trees,
 isSafe:(x,z)=>buildings.isClear(x,z,1.0)});
assert(safeBuilding&&buildings.isClear(safeBuilding.x,safeBuilding.z,1),
 'Camera must be outside mapped building footprints');
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const t of [
 "from './scripts/forest-camera-598.js?v=59800'",
 'const forestCameraPlan=planForestReviewCamera({',
 'rpStreetAuditCameraWorld.x=forestCameraPlan.x;',
 'rpStreetAuditView.heading=forestCameraPlan.heading;',
 'window.__miloviceForestCameraAudit=',
 '...forestCameraPlan,ready:true,regionLoaded:true',
 'window.__miloviceForestCameraAudit.targetInFrame=',
 "streetAudit=forest-mlada-597"
])assert(index.includes(t),'Forest camera runtime integration missing: '+t);
const meta=index.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=index.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=index.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud&&meta.includes('59800'));
console.log('PASS 5.98 mapped Juventský les camera is inside forest, aimed at crown');
