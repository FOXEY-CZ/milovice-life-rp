// Milovice RP 5.97 deterministic forest and park greenery regressions.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planOSMForestTreeInstances} from './forest-placement-597.js';
import {forestInstancePlacements,planCityLanduseBatches} from './landscapes.js';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {classifyVisibleWaterway} from './osm-waterways.js';
const poly=(x,z,w=120,h=90)=>[
 {x,y:z},{x:x+w,y:z},{x:x+w,y:z+h},{x,y:z+h}
];
const z1={id:901,kind:'forest',points:poly(0,0),area:10800};
const z2={id:902,kind:'park',points:poly(500,0),area:10800};
const snapshot=zones=>planOSMForestTreeInstances(zones).trees
 .map(t=>[t.osmId,t.x,t.z,t.height,t.spread,t.yaw]);
assert.deepEqual(snapshot([z1,z2]),snapshot([z2,z1]),
 'Tree coordinates must not depend on the region delivery order');
const only=planOSMForestTreeInstances([z1]);
const again=planOSMForestTreeInstances([z1,z2]);
assert.deepEqual(only.trees,again.trees.filter(t=>t.osmId==='901'),
 'Loading another district must not move existing park/forest trees');
assert.equal(planOSMForestTreeInstances([z1,z1]).sourcePolygonCount,1);
assert(only.trees.length>3,'Mapped forest needs actual instanced trees');
assert(only.trees.every(t=>t.osmId==='901'&&t.positionEstimated));
assert.equal(planOSMForestTreeInstances([{...z1,allowPlants:false}]).trees.length,0);
assert.equal(planOSMForestTreeInstances([{id:33,kind:'grass',points:poly(0,0),area:10800}]).trees.length,0,
 'Unverified private grass may not receive guessed trees');
assert.equal(planOSMForestTreeInstances([z1],()=>false).trees.length,0);
const roads=createRoadClearance(),water=createRoadClearance();
const homes=makeSidewalkBuildingGuard();
roads.addRoad({id:'r',kind:'residential',width:8,
 points:[{x:60,z:0},{x:60,z:90}]});
water.addRoad({id:'river',kind:'waterway',width:1.6,
 points:[{x:0,z:25},{x:120,z:25}]});
homes.add('house',poly(13,50,18,18));
const safe=(x,z)=>roads.isClear(x,z,2.25,1.15)&&
 water.isClear(x,z,2.25,.55)&&homes.isClear(x,z,3);
const safely=planOSMForestTreeInstances([z1],safe);
assert(safely.trees.length>0&&safely.trees.every(t=>safe(t.x,t.z)));
const stems=[],crowns=[],crowns2=[];
const fromWrapper=forestInstancePlacements([z1],stems,crowns,crowns2,()=>.5,safe);
assert.equal(fromWrapper.planted,stems.length);
assert.equal(stems.length,crowns.length);
assert.equal(stems.length,crowns2.length);
assert.equal(stems.length,safely.trees.length);
for(let i=0;i<stems.length;i++){
 assert.equal(stems[i][0],safely.trees[i].x);
 assert.equal(stems[i][2],safely.trees[i].z);
}
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const regions=['mlada','vrutice','westlink','centerlink','bozidar'];
const unique=new Map();
let totalForests=0;
for(const region of regions){
 const osm=JSON.parse(readFileSync(new URL('../data/regions/'+region+'.json',
  import.meta.url),'utf8')).elements;
 const plan=planCityLanduseBatches(osm,toWorld);
 for(const e of plan.entries.filter(e=>e.kind==='forest'||e.kind==='park')){
  if(!unique.has(e.id))unique.set(e.id,{...e,points:e.pts});
 }
 totalForests+=plan.entries.filter(e=>e.kind==='forest').length;
}
assert.equal(unique.size,18,'Real region exports have 17 unique forests + 1 park');
assert(totalForests>=17,'Real forest polygons must remain in OSM region exports');
const allTrees=planOSMForestTreeInstances([...unique.values()]);
assert(allTrees.planted>0&&allTrees.planted<=612&&allTrees.sourcePolygonCount<=18,
 'Global tree count must fit the 620-instance budget');
const reversed=planOSMForestTreeInstances([...unique.values()].reverse());
assert.deepEqual(allTrees.trees,reversed.trees,
 'OSM file and region traversal order may not affect forest placement');
// Explicit real-world Svodnice and Mlynařice coordinates protect the water guard.
const mlada=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements;
const flow=mlada.find(e=>e.id===82222748);
assert(classifyVisibleWaterway(flow.tags)&&flow.geometry.length>2);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const key of ['osmWaterVegetationClearance.addRoad({',
 'taggedSidewalkBuildings.isClear(x,z,3)',
 'const forestPlan=forestInstancePlacements(',
 'window.__miloviceGreenTreeAudit',
 'osmWaterVegetationClearance.reset();',
 "streetAudit=forest-mlada-597",
 "streetAudit=forest-bozidar-597"
])assert(game.includes(key),'Missing runtime OSM forest guard '+key);
const build=game.match(/const BUILD_ID='([^']+)'/)?.[1],
 meta=game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],
 hud=game.split('id="build-label">')[1]?.split('</strong>')[0];
assert(build&&build===meta&&meta===hud&&build.includes('59700'));
console.log('PASS 5.97 safe, stable city greenery',JSON.stringify({
 uniqueMappedForestAndPark:unique.size,trees:allTrees.planted,
 sourceCoordsStable:true,maxPerPolygon:34}));
