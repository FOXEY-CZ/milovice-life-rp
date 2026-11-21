// 5.215: full source/geometry lock for three ORIGINAL connected Višňová edges.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planVisnovaEastWalker5214} from './osm-visnova-east-walker-5214.js';
import {VISNOVA_CONTINUOUS_5215 as C,
 planVisnovaContinuousWalker5215 as plan,
 makeVisnovaContinuousRoute5215 as route,
 sampleVisnovaContinuousRoute5215 as sample,
 advanceVisnovaContinuousRoute5215 as advance}
 from './osm-visnova-continuous-walker-5215.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const d=JSON.parse(raw).elements;
const ways=d.filter(e=>e.tags?.highway&&e.geometry);
const buildings=d.filter(e=>e.tags?.building&&e.geometry);
const priorPlan=planVisnovaEastWalker5214({regionId:'mlada',ways,buildings});
assert(priorPlan?.neverCrossesRoad,'legacy second walker must remain valid');
const args={regionId:'mlada',ways,buildings,priorPlan};
const orig=JSON.stringify([ways.length,buildings.length,
 ways.find(w=>String(w.id)===C.wayId)]);
const p=plan(args);
assert(p,'original GPS footway 0..3 should pass road/building safety');
assert.equal(p.sourceWayId,'1044078118');
assert.equal(p.sourceHash,'26506719');
assert.deepEqual(p.sourceNodeIndices,[0,1,2,3]);
assert.equal(p.modelWalkerCount,1);
assert.equal(p.existingWalkerReused,true);
assert.equal(p.sourceSurfaceUnknown,true);
assert.equal(p.sourceGPS.length,4);
assert(p.originalMetres>52.7&&p.originalMetres<53.4);
assert(p.walkableMetres>46&&p.walkableMetres<47);
assert(p.minRoadAxisDistanceMetres>8);
assert(p.minBuildingDistanceMetres>4.9);
for(const key of ['newPaths','newCrossings','newRoads',
 'newBuildings','newColliders','newNPCs'])assert.equal(p[key],0,key);
const toWorld=q=>({x:(q.lon-14.889)*111320*
 Math.cos(50.226*Math.PI/180),y:-(q.lat-50.226)*111320});
const r=route(p,toWorld);
assert(r&&r.pieces.length===3);
assert.equal(r.sourceNode1Distance,r.pieces[0].len);
assert(Math.abs(r.len-p.walkableMetres)<.03);
const a=sample(r,0),b=sample(r,r.len);
assert(a&&b,'both clipped endpoints available');
const original=p.sourceGPS.map(toWorld);
const distance=(x,y)=>Math.hypot(x.x-y.x,x.z-(y.z??y.y));
assert(Math.abs(distance(a,{...original[0],z:original[0].y})-3.3)<.05);
assert(Math.abs(distance(b,{...original[3],z:original[3].y})-3.3)<.05);
const firstTurn=r.pieces[0].end,secondTurn=r.pieces[1].end;
assert.equal(sample(r,firstTurn-.01).sourceSegmentIndex,0);
assert.equal(sample(r,firstTurn+.01).sourceSegmentIndex,1);
assert.equal(sample(r,secondTurn+.01).sourceSegmentIndex,2);
assert(distance(sample(r,firstTurn),{x:original[1].x,z:original[1].y})<.01);
assert(distance(sample(r,secondTurn),{x:original[2].x,z:original[2].y})<.01);
let n=advance(r,firstTurn-.3,1,1.1);
assert(n&&n.sourceSegmentIndex===1&&n.direction===1);
assert(Math.abs(n.distance-(firstTurn+.8))<.0001);
n=advance(r,r.len-.4,1,1.1);
assert(n&&n.direction===-1&&n.distance<r.len);
const rewind=advance(r,.2,-1,1);
assert(rewind&&rewind.direction===1&&rewind.distance>.2);
assert.equal(advance(r,0,1,-.1),null);
assert.equal(route({...p,sourceGPS:p.sourceGPS.slice(1)},toWorld),null);
const source=ways.find(w=>String(w.id)===C.wayId);
const mutate=(mutator)=>({...args,ways:ways.map(w=>
 String(w.id)===C.wayId?mutator(w):w)});
for(const [name,invalid] of [
 ['bad region',{...args,regionId:'vrutice'}],
 ['missing legacy',{...args,priorPlan:null}],
 ['removed source',{...args,ways:ways.filter(w=>String(w.id)!==C.wayId)}],
 ['duplicate source',{...args,ways:[...ways,source]}],
 ['material invention',mutate(w=>({...w,tags:{...w.tags,surface:'paving_stones'}}))],
 ['original GPS changed',mutate(w=>({...w,geometry:w.geometry.map((q,i)=>
  i===0?{...q,lon:q.lon+.0000001}:q)}))],
 ['sidewalk gone',mutate(w=>({...w,tags:{...w.tags,highway:'service'}}))],
 ['car driving on route',{...args,ways:[...ways,{id:-5215,
  tags:{highway:'service'},geometry:[source.geometry[0],source.geometry[1]]}]}],
 ['building on route',{...args,buildings:[...buildings,{
  id:-5215,tags:{building:'yes'},geometry:[
   {lat:50.229035,lon:14.86980},{lat:50.22904,lon:14.86978},
   {lat:50.229046,lon:14.86978},{lat:50.229035,lon:14.86980}]}]}]
])assert.equal(plan(invalid),null,'must fail closed: '+name);
assert.equal(JSON.stringify([ways.length,buildings.length,source]),orig);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const part of [
 "from './scripts/osm-visnova-continuous-walker-5215.js?v=521500'",
 'planVisnovaContinuousWalker5215({',
 'makeVisnovaContinuousRoute5215(routePlan,osmPoint)',
 'advanceVisnovaContinuousRoute5215(obj.continuousRoute5215,',
 'window.__miloviceVisnovaContinuousRuntime5215=()=>',
 "'visnova-continuous-walker-5215':{",
 'href="?v=521500&streetAudit=visnova-continuous-walker-5215"',
 'const BUILD_ID='
])assert(html.includes(part),'missing game integration '+part);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud,'build consistency');
console.log('PASS 5.215 source-locked original 3-edge OSM sidewalk',
 p.originalMetres,'m; clipped',p.walkableMetres,'m;',
 'min axis',p.minRoadAxisDistanceMetres,'m;',
 'min building',p.minBuildingDistanceMetres,'m; no new NPC/geometry');
