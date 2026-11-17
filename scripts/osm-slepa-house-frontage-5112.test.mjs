import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSlepaHouseFrontage,slepaHouseWindowDoorConflict}
 from './osm-slepa-house-frontage-5112.js';
const cos=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const load=id=>JSON.parse(readFileSync(new URL(
 '../data/regions/'+id+'.json',import.meta.url),'utf8')).elements;
const EXPECTED=['61977976','61977982','61977989','61977993',
 '61977995','61978001','61978003','61978005','61978010',
 '61978012','61978013','61978015'];
function mapped(region){
 const els=load(region);
 const street=els.find(e=>e.id===202375817);
 assert.equal(street.tags.name,'Slepá');
 const streetPoints=street.geometry.map(toWorld),found=[];
 for(const e of els){
  if(!e.tags?.building)continue;
  const height=Number(e.tags['building:levels'])*3.05;
  const house=planSlepaHouseFrontage({
   id:e.id,regionId:region,tags:e.tags,
   points:e.geometry.map(toWorld),height,
   streetWayId:street.id,streetPoints
  });
  if(house)found.push(house);
 }
 assert.equal(found.length,12);
 assert.deepEqual(found.map(p=>p.sourceBuildingId).sort(),EXPECTED);
 assert(found.every(p=>
  p.mappedFlats===1&&p.mappedLevels===2&&p.height===6.1&&
  p.nearStreetMeters>20&&p.nearStreetMeters<100&&
  !p.windowsPhotoVerified&&!p.roofPhotoVerified&&
  p.removeUnverifiedGlassAwning&&
  !p.footprintChanged&&p.newRoofPieces===0&&p.newHouses===0));
 return {els,street,streetPoints,found};
}
const a=mapped('mlada'),b=mapped('vrutice');
assert.deepEqual(a.found.map(p=>({
 id:p.sourceBuildingId,dist:p.nearStreetMeters})).sort((x,y)=>x.id.localeCompare(y.id)),
 b.found.map(p=>({
 id:p.sourceBuildingId,dist:p.nearStreetMeters})).sort((x,y)=>x.id.localeCompare(y.id)),
 'Source house facades must match when region load order reverses');
const source=a.els.find(e=>String(e.id)===EXPECTED[0]);
const props={id:source.id,regionId:'mlada',tags:source.tags,
 points:source.geometry.map(toWorld),height:6.1,
 streetWayId:a.street.id,streetPoints:a.streetPoints};
const base=planSlepaHouseFrontage(props);assert(base);
for(const patch of [
 {regionId:'old'}, {regionId:'bozidar'}, {streetWayId:12345},
 {streetPoints:[a.streetPoints[0]]}, {photoReviewed:true},
 {approvedArchitecture:true}, {height:55}, {points:[]},
 {points:[{x:NaN,z:10},...props.points.slice(1)]},
 {tags:{...props.tags,building:'yes'}},
 {tags:{...props.tags,'building:flats':'2'}},
 {tags:{...props.tags,'building:levels':'3'}},
 {tags:{...props.tags,'building:ruian:type':'6'}},
 {tags:{...props.tags,source:'cuzk:km'}},
 {tags:{...props.tags,access:'private'}}
]){
 assert.equal(planSlepaHouseFrontage({...props,...patch}),null,
  'Protect unknown houses and previously photographed private houses');
}
assert.equal(planSlepaHouseFrontage({...props,points:props.points.map(p=>({
 x:p.x+600,z:p.z+600}))}),null);
const conflict=(fraction,floor,entranceEdge=4,windowEdge=4)=>
 slepaHouseWindowDoorConflict({plan:base,entranceEdge,
  windowEdge,edgeLength:10,fraction,floor});
assert.equal(conflict(.50,0),true,
 'A ground-floor window over the door centre MUST disappear');
assert.equal(conflict(.35,0),true,
 'Window frames beside door cannot overlap it');
assert.equal(conflict(.10,0),false);
assert.equal(conflict(.90,0),false);
assert.equal(conflict(.50,1),false,
 'Second-floor windows may remain over the same entry');
assert.equal(conflict(.50,0,4,5),false,
 'Windows on unrelated walls must remain unchanged');
assert.equal(conflict(.50,0,undefined,4),false,
 'No reliable street-facing door = never remove unknown windows');
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "from './scripts/osm-slepa-house-frontage-5112.js?v=511200'",
 'window.__miloviceSlepaHouseAudit={',
 'const slepaHousePlan=regionalStyle?planSlepaHouseFrontage({',
 'streetWayId:slepaStreet?.id,streetPoints:slepaStreet?.points,',
 'const regionalEntrance=(regionalStyle?.addPlinth||estatePlan)?streetFrontage.select(pts):null;',
 'if(slepaHousePlan&&slepaHouseWindowDoorConflict({',
 'windowEdge:i,fraction:t,edgeLength:len,floor',
 'audit.groundFloorWindowsPreventedFromDoor++;',
 'if(slepaHousePlan){',
 'audit.unverifiedGlassAwningsRemoved++;',
 'existingRoofShapesUnchanged:true',
 'newBuildingsAdded:0',
 'unverifiedGardenFencesAdded:0',
])assert(game.includes(term),'5.112 3D integration not found: '+term);
const build=game.match(/const BUILD_ID='([^']+)'/)?.[1];
assert(build?.endsWith('511200'));
assert.equal(game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],build);
assert.equal(game.split('id="build-label">')[1]?.split('</strong>')[0],build);
console.log('PASS 5.112 RÚIAN Slepá houses: 12 existing 2-floor single-flat houses',{
 houses:a.found.length,street:'202375817',
 photographicAwningsAdded:0,existingFootprintsChanged:0,
 prototypeDoorVsWindowTest:true});
