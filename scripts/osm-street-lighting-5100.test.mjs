import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {isOSMLitStreet,planMappedStreetLamps} from './osm-street-lighting-5100.js';

assert(isOSMLitStreet({highway:'residential',lit:'yes',name:'Italská'}));
for(const t of [
 {highway:'residential',name:'Italská',lit:'no'},
 {highway:'residential',name:'Italská',lit:'30'},
 {highway:'residential',name:'Italská'},
 {highway:'residential',lit:'yes'},
 {highway:'footway',name:'Italská',lit:'yes'},
 {highway:'residential',name:'Italská',lit:'yes',access:'private'},
 {highway:'residential',name:'Italská',lit:'yes',bridge:'yes'},
 {highway:'residential',name:'Italská',lit:'yes',tunnel:'yes'}
])assert(!isOSMLitStreet(t),'Do not infer a lamp from unsupported OSM tags');
const makeRoads=()=>createRoadClearance();
const road=makeRoads(),house=makeSidewalkBuildingGuard(),water=makeRoads();
const line=[{x:0,z:0},{x:320,z:0}];
const tags={highway:'residential',lit:'yes',name:'ČSA'};
road.addRoad({id:12,kind:'residential',width:7.8,points:line});
const args={roads:road,buildings:house,water};
const way={id:10001,tags,points:line};
const result=planMappedStreetLamps([way],args);
assert(result.placed>=6&&result.placed<=9);
for(const pole of result.posts){
 assert(road.isClear(pole.x,pole.z,.42,.43),'No post on a street');
 assert(pole.sourceLitTag==='yes'&&!pole.photographedPole);
 assert(Math.hypot(pole.x-pole.cx,pole.z-pole.cz)>4.8);
}
assert.deepEqual(result.posts,planMappedStreetLamps([way,way],args).posts);
const other={id:10002,tags:{...tags,name:'Rakouská'},
 points:[{x:0,z:70},{x:300,z:70}]};
road.addRoad({id:13,points:other.points,width:7.8});
assert.deepEqual(
 planMappedStreetLamps([way,other],args).posts,
 planMappedStreetLamps([other,way],args).posts,
 'The same set of source OSM ways must always create the same lamp positions');
const blockAll=planMappedStreetLamps([way],{...args,photoAllowed:()=>false});
assert.equal(blockAll.placed,0);
assert(blockAll.skippedPhotoReviewZone>0);
house.add('house',[{x:65,z:4.5},{x:90,z:4.5},
 {x:90,z:9},{x:65,z:9}]);
// Block BOTH verges at one sample point: the planner correctly retries
// the opposite street side if just one side has a mapped house.
house.add('house-opposite',[{x:65,z:-9},{x:90,z:-9},
 {x:90,z:-4.5},{x:65,z:-4.5}]);
const withHouse=planMappedStreetLamps([way],args);
assert(withHouse.placed<result.placed,'Mapped house blocks lamp placement');
for(const p of withHouse.posts)assert(house.isClear(p.x,p.z,1.15));
water.addRoad({id:'water',width:6,kind:'waterway',points:line.map(
 p=>({x:p.x,z:p.z+7.5}))});
const withRiver=planMappedStreetLamps([way],args);
assert(withRiver.placed<=withHouse.placed);
for(const p of withRiver.posts)assert(water.isClear(p.x,p.z,.65,.40));
const cos=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const regions=['old','mlada','vrutice','westlink','centerlink','bozidar'];
const routes=new Map(),roadGeo=makeRoads(),homes=makeSidewalkBuildingGuard();
for(const region of regions){
 const file=region==='old'?'../data/milovice-osm.json':
  '../data/regions/'+region+'.json';
 const els=JSON.parse(readFileSync(new URL(file,import.meta.url),'utf8')).elements;
 for(const el of els){
  if(routes.has(el.id))continue;
  routes.set(el.id,{id:el.id,tags:el.tags||{},points:el.geometry?.map(toWorld)||[],
   regionId:region});
  if(el.tags?.building&&el.tags.building!=='roof'&&el.geometry?.length>2)
   homes.add(el.id,el.geometry.map(toWorld));
  if(el.tags?.highway&&el.geometry?.length>=2){
   const kind=el.tags.highway,width=kind==='secondary'?9:
    kind==='tertiary'?8:kind==='service'?4.5:
    ['footway','path','steps','cycleway'].includes(kind)?1.8:
    kind==='track'?3.2:7.8;
   roadGeo.addRoad({id:el.id,kind,width,points:el.geometry.map(toWorld)});
  }
 }
}
const eligible=[...routes.values()].filter(w=>isOSMLitStreet(w.tags));
assert.equal(eligible.length,57,'5.100 source inventory: 57 named explicitly lit ways');
const all=planMappedStreetLamps([...routes.values()],{
 roads:roadGeo,buildings:homes,water:makeRoads(),
 photoAllowed:(x,z)=>Math.hypot(x+400,z+250)>150
});
assert(all.placed>35&&all.placed<260,
 'Real Milovice should get a bounded set of source-only lamp approximations');
for(const pole of all.posts){
 assert(roadGeo.isClear(pole.x,pole.z,.42,.43));
 assert(homes.isClear(pole.x,pole.z,1.15));
 assert(eligible.some(w=>String(w.id)===pole.roadId));
}
assert(all.posts.some(p=>p.roadId==='8585601'),'Italská needs a review lamp');
assert(all.posts.some(p=>p.roadId==='304756364'),'Armádní needs a review lamp');
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const str of [
 "import {planMappedStreetLamps} from './scripts/osm-street-lighting-5100.js?v=510000'",
 "const streetLightPlan=planMappedStreetLamps(",
 "osmStreetLightWays.push({",
 'window.__miloviceStreetLightingAudit=',
 'window.__miloviceStreetLampCameraAudit=',
 'sourceWayId:streetLightWayId',
 'mappedRoadLightPosts:streetLightPlan.placed',
 "streetAudit=lit-italska-5100",
 "streetAudit=lit-armadni-5100"
])assert(game.includes(str),'Street lighting runtime integration missing: '+str);
const build=game.match(/const BUILD_ID='([^']+)'/)?.[1];
const meta=game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const hud=game.split('id="build-label">')[1]?.split('</strong>')[0];
assert(build&&build===meta&&meta===hud, 'Lit street regression uses current matching game build stamps');
console.log('PASS 5.100 OSM-lit streets, collision-free estimated lamp instancing',{
 eligibleWays:eligible.length,lampPosts:all.placed,
 sourceMeters:Math.round(all.eligibleMeters)});
