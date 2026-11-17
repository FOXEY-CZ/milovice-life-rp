// Milovice RP 5.113: real regional OSM fixtures and precise regression.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSlepaUtility} from './osm-slepa-utilities-5113.js';
const REPO=new URL('../data/regions/',import.meta.url);
const ids=['1079135294','1079135295','1283868024'];
const expected={
 '1079135294':'electric-substation',
 '1079135295':'waste-container-shelter',
 '1283868024':'electric-substation'
};
const cos=Math.cos(50.228*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
function load(area){
 const elements=JSON.parse(readFileSync(new URL(area+'.json',REPO),'utf8')).elements;
 const out=[];
 for(const e of elements){
  if(!e.tags?.building||!e.geometry?.length)continue;
  const model=planSlepaUtility({id:e.id,regionId:area,
   tags:e.tags,points:e.geometry.map(toWorld)});
  if(model)out.push(model);
 }
 assert.deepEqual(out.map(e=>e.sourceBuildingId).sort(),ids,
  'Only the three exact real OSM utility buildings may change');
 for(const u of out){
  assert.equal(u.kind,expected[u.sourceBuildingId]);
  assert.equal(u.levelCount,1);
  assert.equal(u.modelHeightMeters,2.7);
  assert(u.osmAreaSquareMeters>4&&u.osmAreaSquareMeters<70);
  assert(u.flatRoofProvisional&&!u.exactHeightKnown&&!u.photoApproved);
  assert.equal(u.glassWindows,0);
  assert.equal(u.inventedEntrances,0);
  assert.equal(u.glassAwnings,0);
  assert.equal(u.newWasteBins,0);
  assert(u.sourceGeometryUnchanged);
 }
 return {elements,out};
}
const a=load('mlada'),b=load('vrutice');
assert.deepEqual(a.out,b.out,'Overlapping OSM exports must classify identically');
for(const id of ids){
 const original=a.elements.find(e=>String(e.id)===id);
 assert(original);
 const props={id,regionId:'mlada',tags:original.tags,
  points:original.geometry.map(toWorld)};
 assert(planSlepaUtility(props));
 for(const patch of [
  {regionId:'old'},{regionId:'bozidar'},{photoReviewed:true},
  {approvedArchitecture:true},{points:[]},
  {tags:{...props.tags,access:'private'}},
  {tags:{...props.tags,access:'no'}},
  {tags:{...props.tags,building:'residential'}},
  {tags:{...props.tags,'building:levels':'1'}},
  {tags:{...props.tags,height:'2.5'}},
  {tags:{building:'yes'}},
 ]){
  assert.equal(planSlepaUtility({...props,...patch}),null,
   'Protect mapped building if its source, access or approval changes');
 }
}
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "from './scripts/osm-slepa-utilities-5113.js?v=511300'",
 "'slepa-utilities-5113':{",
 "camera:{lat:50.2282028213,lon:14.8607971450},heading:270.3,",
 'const slepaUtility=planSlepaUtility({id:osmId,regionId,tags,points:pts,',
 'approvedArchitecture:Boolean(modelCard)',
 'const defaultLevels=(slepaUtility||isGarage||isIndustrial||',
 'slepaUtility?slepaUtility.modelHeightMeters',
 'const regionalStyle=slepaUtility?null:planRegionalBuildingStyle({',
 "const roofPreference=slepaUtility?'flat':",
 'const visibleFloors=slepaUtility?0:',
 'const inventedEntrance=!slepaUtility&&!heroFacade',
 'window.__miloviceSlepaUtilityAudit={',
 'noInferredWindows:true,noInferredDoors:true'
 ])assert(game.includes(term),'Missing source-driven 5.113 integration: '+term);
const build=game.match(/const BUILD_ID='([^']+)'/)?.[1];
assert.equal(build,'20261117-slepa-utilities-511300');
assert.equal(game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],build);
assert.equal(game.split('id="build-label">')[1]?.split('</strong>')[0],build);
// The review camera stands on real OSM Slepá way/202398890,
// rather than a fabricated coordinate or a Panorama photo.
const road=a.elements.find(e=>String(e.id)==='202398890');
assert.equal(road?.tags?.name,'Slepá');
const target=a.elements.find(e=>String(e.id)==='1079135295');
const eye={lat:50.2282028213,lon:14.8607971450};
const p=road.geometry;
let d=Infinity;
for(let i=1;i<p.length;i++){
 const u=p[i-1],v=p[i],dx=(v.lon-u.lon)*cos*111320,dz=(v.lat-u.lat)*111320;
 const fx=(eye.lon-u.lon)*cos*111320,fz=(eye.lat-u.lat)*111320;
 const t=Math.max(0,Math.min(1,(fx*dx+fz*dz)/(dx*dx+dz*dz)));
 d=Math.min(d,Math.hypot(fx-t*dx,fz-t*dz));
}
assert(d<.02,'Camera must sit on sourced OSM road centreline');
const c={lat:target.geometry.reduce((s,v)=>s+v.lat,0)/target.geometry.length,
 lon:target.geometry.reduce((s,v)=>s+v.lon,0)/target.geometry.length};
const heading=(Math.atan2((c.lon-eye.lon)*cos,c.lat-eye.lat)*180/Math.PI+360)%360;
assert(Math.abs(heading-270.3)<.5);
console.log('PASS 5.113: 3 source-tagged utilities without speculative homes',
 {utilityIds:ids,modelHeightsEstimated:true,roadAlignedCamera:true});
