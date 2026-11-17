// Milovice RP 5.117 — checked against BOTH shipped OSM region exports.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSlepaDistrictSubstation} from './osm-slepa-substations-5117.js';
import {planSlepaUtility} from './osm-slepa-utilities-5113.js';
const IDs=[762867641,1082018176,1272167313,1468803930];
const oldIDs=[1079135295,1079135294,1283868024];
const k=111320,cos=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*k*cos,z:-(p.lat-50.226)*k});
function source(region){
 return JSON.parse(readFileSync(new URL('../data/regions/'+region+
  '.json',import.meta.url),'utf8')).elements;
}
const sourceM=source('mlada'),sourceV=source('vrutice');
function runOne(el,region){
 return planSlepaDistrictSubstation({
  id:el.id,regionId:region,tags:el.tags,
  points:el.geometry.map(world)
 });
}
for(const id of IDs){
 const el=sourceM.find(e=>e.id===id);
 assert(el,'Missing mapped original way '+id);
 assert.equal(el.type,'way');
 assert.equal(el.tags.building,'yes');
 assert.equal(el.tags.power,'substation');
 const first=runOne(el,'mlada');
 assert(first,'Known source building not eligible '+id);
 assert.equal(first.sourceBuildingId,String(id));
 assert.equal(first.kind,'electric-substation');
 assert.equal(first.levelCount,1);
 assert.equal(first.modelHeightMeters,2.65);
 assert.equal(first.exactHeightKnown,false);
 assert.equal(first.flatRoofProvisional,true);
 assert.equal(first.glassWindows,0);
 assert.equal(first.inventedEntrances,0);
 assert.equal(first.glassAwnings,0);
 assert.equal(first.newWasteBins,0);
 assert.equal(first.sourceGeometryUnchanged,true);
 assert.equal(first.photoApproved,false);
 assert(first.osmAreaSquareMeters>=5&&first.osmAreaSquareMeters<=20);
 assert.deepEqual(first,runOne(el,'mlada'),'Deterministic OSM planner');
 for(const guards of [
  {photoReviewed:true},{approvedArchitecture:true},
  {tags:{...el.tags,access:'private'}},
  {tags:{...el.tags,'building:levels':'1'}},
  {tags:{...el.tags,height:'3.7'}},
  {tags:{...el.tags,power:'other'}},
  {tags:{...el.tags,building:'house'}},
  {regionId:'old'},
  {points:[]}
 ]){
  const params={id:el.id,regionId:'mlada',tags:el.tags,
   points:el.geometry.map(world),...guards};
  assert.equal(planSlepaDistrictSubstation(params),null,
   'Must reject unverified changes to '+id);
 }
 const noEvidence= id===762867641?
  {...el.tags,'building:ruian:type':undefined}:
  id===1468803930?{...el.tags,operator:undefined}:
  {...el.tags,substation:undefined};
 assert.equal(planSlepaDistrictSubstation({
  id,regionId:'mlada',tags:noEvidence,points:el.geometry.map(world)
 }),null,'Do not silently accept missing source evidence');
}
for(const id of oldIDs){
 const el=sourceM.find(e=>e.id===id);
 assert(el,'5.113 source must remain present');
 assert.equal(runOne(el,'mlada'),null,
  '5.117 must not overwrite existing 5.113 category');
 assert(planSlepaUtility({id,regionId:'mlada',tags:el.tags,
  points:el.geometry.map(world)}),
  '5.113 utility stays independently functional');
}
for(const id of IDs){
 const way=sourceV.find(e=>e.id===id);
 if(id===1468803930){
  assert(way,'Shared mapped transformer must exist in Vrutice');
  assert.deepEqual(runOne(way,'vrutice'),
   runOne(sourceM.find(e=>e.id===id),'mlada'));
 }else{
  assert.equal(way,undefined,
   'Never claim another region contains unexported source '+id);
 }
}
const road=sourceM.find(e=>e.id===1331897680);
assert.equal(road?.tags?.name,'Armádní');
assert.equal(road.tags.highway,'residential');
const eye={lat:50.2293803,lon:14.8618211};
assert.deepEqual(eye,road.geometry[1]);
const sub=sourceM.find(e=>e.id===1082018176);
const pts=sub.geometry.slice(0,-1);
const center={lat:pts.reduce((a,p)=>a+p.lat,0)/pts.length,
 lon:pts.reduce((a,p)=>a+p.lon,0)/pts.length};
const heading=(Math.atan2((center.lon-eye.lon)*cos,
 center.lat-eye.lat)*180/Math.PI+360)%360;
assert(Math.abs(heading-172.9)<.2);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const s of [
 "from './scripts/osm-slepa-substations-5117.js?v=511700'",
 "window.__miloviceSlepaDistrictSubstationAudit={",
 "const districtSubstation=planSlepaDistrictSubstation({",
 "approvedArchitecture:Boolean(modelCard)",
 "const slepaUtility=planSlepaUtility(",
 "})||districtSubstation;",
 "if(districtSubstation&&slepaUtility===districtSubstation){",
 "createdResidentialWindows:0,createdResidentialDoors:0,",
 "const defaultLevels=(slepaUtility||isGarage||isIndustrial||",
 "slepaUtility?slepaUtility.modelHeightMeters:",
 "visibleFloors=slepaUtility?0:",
 "inventedEntrance=!slepaUtility",
 "createdGlassAwnings:0",
 "'slepa-substations-5117':{",
 "camera:{lat:50.2293803,lon:14.8618211},heading:172.9,",
 "streetAudit=slepa-substations-5117",
 "href=\"./?v=511700\""
 ])assert(html.includes(s),'Missing 5.117 integration: '+s);
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
assert.equal(build,'20261117-slepa-substations-511700');
assert.equal(html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],build);
assert.equal(html.split('id="build-label">')[1]?.split('</strong>')[0],build);
for(const old of [
 "slepa-walk-5116","slepa-armadni-bends-5115","slepa-park-5114",
 "slepa-utilities-5113","slepa-houses-5112","mountStreetAuditMenu"
 ])assert(html.includes(old));
console.log('PASS 5.117: four OSM substations and safe generic facade exclusions',{
 ids:IDs,overlapOnly:1468803930,
 cameraHeading:+heading.toFixed(1)
});
