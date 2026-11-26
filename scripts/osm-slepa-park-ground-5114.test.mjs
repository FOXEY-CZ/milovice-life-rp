// Milovice RP 5.114 — regression against both shipped OSM region files.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSlepaParkGround} from './osm-slepa-park-ground-5114.js';
const cos=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 y:-(p.lat-50.226)*111320});
const clear={isClear:()=>true};
function polygonArea(ring){
 let a=0;
 for(let i=0;i<ring.length;i++){
  const p=ring[i],q=ring[(i+1)%ring.length];
  a+=p.x*q.y-q.x*p.y;
 }
 return Math.abs(a)*.5;
}
function inside(x,z,ring){
 let yes=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const p=ring[i],q=ring[j];
  if((p.y>z)!==(q.y>z)&&
   x<(q.x-p.x)*(z-p.y)/(q.y-p.y)+p.x)yes=!yes;
 }
 return yes;
}
function load(region){
 const elements=JSON.parse(readFileSync(new URL(
  '../data/regions/'+region+'.json',import.meta.url),'utf8')).elements;
 const raw=elements.find(e=>e.id===891874829);
 assert.equal(raw?.tags?.leisure,'park');
 const pts=raw.geometry.map(toWorld);
 if(Math.hypot(pts[0].x-pts.at(-1).x,pts[0].y-pts.at(-1).y)<.05)
  pts.pop();
 const zone={id:String(raw.id),kind:'park',area:polygonArea(pts),
  allowPlants:raw.tags.access!=='private',points:pts};
 assert(zone.area>9770&&zone.area<9785);
 const options={roads:clear,buildings:clear,water:clear};
 const actual=planSlepaParkGround([zone],options);
 assert.equal(actual.mappedPark,1);
 assert.equal(actual.tufts.length,72);
 assert.equal(actual.sourceParkId,'891874829');
 assert.equal(actual.inventNewBenches,0);
 assert.equal(actual.inventNewPaths,0);
 assert.equal(actual.inventNewTrees,0);
 assert(actual.sourcePolygonUnchanged&&actual.footwaysUnchanged);
 assert(actual.tufts.every(p=>inside(p.x,p.z,pts)));
 const repeated=planSlepaParkGround([zone],options);
 assert.deepEqual(actual.tufts,repeated.tufts,
  'No random relocations on reload');
 assert.deepEqual(planSlepaParkGround([zone,zone],options).tufts,
  actual.tufts,'Overlapping OSM exports cannot double-plant');
 const blockedRoad=planSlepaParkGround([zone],{
  ...options,roads:{isClear:()=>false}});
 assert.equal(blockedRoad.tufts.length,0);
 assert(blockedRoad.rejectedRoad>0);
 const blockedBuilding=planSlepaParkGround([zone],{
  ...options,buildings:{isClear:()=>false}});
 assert.equal(blockedBuilding.tufts.length,0);
 const blockedWater=planSlepaParkGround([zone],{
  ...options,water:{isClear:()=>false}});
 assert.equal(blockedWater.tufts.length,0);
 assert.equal(planSlepaParkGround([zone],{
  ...options,photoAllowed:()=>false}).tufts.length,0);
 assert.equal(planSlepaParkGround([zone],{
  ...options,avoidTrees:actual.tufts.map(t=>({x:t.x,z:t.z})),
  maxTufts:1}).tufts.some(p=>
   actual.tufts.some(t=>Math.hypot(p.x-t.x,p.z-t.z)<1.65)),false);
 for(const other of [
  {...zone,kind:'forest'}, {...zone,id:'unverified'},
  {...zone,allowPlants:false}, {...zone,area:zone.area+200},
  {...zone,points:[]}
 ]){
  assert.equal(planSlepaParkGround([other],options).tufts.length,0,
   'Do not model unsupported or private parks');
 }
 return {elements,zone,actual};
}
const a=load('mlada'),b=load('vrutice');
assert.deepEqual(a.actual.tufts,b.actual.tufts);
const road=a.elements.find(e=>e.id===202375819);
assert.equal(road?.tags?.name,'Slepá');
const eye={lat:50.2280113,lon:14.8589063};
assert(Math.abs(eye.lat-(road.geometry[0].lat+road.geometry[1].lat)/2)<1e-8);
assert(Math.abs(eye.lon-(road.geometry[0].lon+road.geometry[1].lon)/2)<1e-8);
const park=a.elements.find(e=>e.id===891874829).geometry.slice(0,-1);
const center={lat:park.reduce((v,p)=>v+p.lat,0)/park.length,
 lon:park.reduce((v,p)=>v+p.lon,0)/park.length};
const bearing=(Math.atan2((center.lon-eye.lon)*cos,
 center.lat-eye.lat)*180/Math.PI+360)%360;
assert(Math.abs(bearing-337.9)<.2);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-slepa-park-ground-5114.js?v=511400'",
 "streetAudit=slepa-park-5114",
 "'slepa-park-5114':{",
 "camera:{lat:50.2280113,lon:14.8589063},heading:337.9,",
 "const slepaPark=planSlepaParkGround(landscapeZones,{",
 "roads:osmRoadClearance,buildings:taggedSidewalkBuildings,",
 "avoidTrees:forestPlan.trees",
 "window.__miloviceSlepaParkAudit={",
 "window.__miloviceSlepaParkRuntime=()=>{",
 "actualSceneInstances:batches.filter(inScene)",
 "const slepaParkBladeMaterial=new THREE.MeshLambertMaterial({"
 ])assert(html.includes(token),'Missing 5.114 integration '+token);
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
assert.match(build,/^\d{8}-[a-z0-9-]+-\d{6}$/);
assert.equal(html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],build);
assert.equal(html.split('id="build-label">')[1]?.split('</strong>')[0],build);
// Previous mobile menu safeguards must remain.
for(const rule of ['street-audit-toggle','street-audit-info-toggle',
 'mountStreetAuditMenu'])assert(html.includes(rule));
console.log('PASS Milovice RP 5.114: mapped park 891874829',{
 areaM2:a.actual.mappedAreaM2,tufts:a.actual.tufts.length,
 sourceRegions:['mlada','vrutice'],cameraBearing:+bearing.toFixed(1)
});
