// 5.212 — deterministic lawn detail ONLY inside two existing OSM polygons.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_EAST_LAWNS_5212 as C,planVisnovaEastLawns5212 as plan}
 from './osm-visnova-east-lawns-5212.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const ways=C.polygons.map(spec=>elements.find(e=>String(e.id)===spec.id));
assert(ways.every(Boolean),'both source lawns must exist');
const original=JSON.stringify(ways);
const cos=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*111320*cos,
 y:-(p.lat-50.226)*111320});
const safe={isClear:()=>true};
const opts={regionId:'mlada',toWorld:world,roads:safe,
 buildings:safe,water:safe};
const result=plan(ways,opts);
assert(result,'two real east Višňová lawns should pass source hash checks');
assert.deepEqual(result.sourceLawnIds,['1460019772','1460019799']);
assert(result.tufts.length>=20,'source lawns should have visible low turf');
assert(result.tufts.length<=150,'strict instancing budget');
assert.deepEqual(result,plan(ways,opts),'repeatable procedural placement');
const inside=(x,z,p)=>{
 let yes=false;
 for(let i=0,j=p.length-1;i<p.length;j=i++){
  const a=p[i],b=p[j];
  if((a.y>z)!==(b.y>z)&&x<(b.x-a.x)*(z-a.y)/(b.y-a.y)+a.x)
   yes=!yes;
 }
 return yes;
};
for(const item of result.tufts){
 assert([item.x,item.z,item.height,item.spread,item.yaw].every(Number.isFinite));
 assert(item.height>=.18&&item.height<=.32);
 assert(item.positionEstimated);
 const source=ways.find(w=>String(w.id)===item.sourceOSMId);
 assert(source,'no invented/third-party lawn');
 assert(inside(item.x,item.z,source.geometry.slice(0,-1).map(world)),
  'every model grass blade must remain inside its mapped lawn');
}
for(const key of ['newLawnPolygons','newShrubs','newRoads','newFootways',
 'newColliders','newParkingPlaces'])assert.equal(result[key],0,key);
assert.equal(result.individualPlantsPhotoVerified,false);
assert.equal(result.mappedPolygonsPreserved,true);
assert.equal(result.polygonGeometryChanged,false);
assert.deepEqual(plan(ways,{...opts,excludedLawnIds:['1460019772','1460019799']}).tufts,[]);
for(const where of ['roads','buildings','water']){
 const denied=plan(ways,{...opts,[where]:{isClear:()=>false}});
 assert.equal(denied.tufts.length,0,'must respect '+where+' clearance');
}
for(const bad of [
 ways.slice(1),
 [...ways,ways[0]],
 ways.map((w,i)=>i?{...w,tags:{landuse:'residential'}}:w),
 ways.map((w,i)=>i?{...w,geometry:w.geometry.map((p,j)=>
  j===1?{...p,lon:p.lon+.0000001}:p)}:w)
])assert.equal(plan(bad,opts),null,'source drift must fail closed');
assert.equal(plan(ways,{...opts,regionId:'vrutice'}),null);
assert.equal(JSON.stringify(ways),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-visnova-east-lawns-5212.js?v=521200'",
 'const visnovaEastGrassSource5212=[];',
 'visnovaEastGrassSource5212.push(el);',
 'planVisnovaEastLawns5212(visnovaEastGrassSource5212,{',
 'excludedLawnIds:[...lawnPlan.sourceLawnIds,',
 'eastTufts5212.map(t=>',
 '__miloviceVisnovaEastLawnsRuntime5212',
 'visnovaEastGrassSource5212.length=0;',
 "'visnova-east-lawns-5212':{",
 'href="?v=521200&streetAudit=visnova-east-lawns-5212"',
 "const BUILD_ID='"
])assert(html.includes(needle),'game integration missing '+needle);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud,'HTML/HUD/runtime build mismatch');
console.log('PASS 5.212 source-locked two OSM lawns, deterministic instance budget, no road/building/water overlaps, no invented turf footprint:',result.tufts.length);
