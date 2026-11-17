import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {ordinaryMappedPlayground,planMappedPlaygroundEquipment,
 planPlaygroundReviewCamera}
 from './osm-playground-equipment-5102.js';

const fake={id:'public',tags:{leisure:'playground'},
 points:[{x:0,z:0},{x:24,z:0},{x:24,z:22},{x:0,z:22},{x:0,z:0}]};
const clear=()=>true;
const args={roads:{isClear:clear},buildings:{isClear:clear},water:{isClear:clear}};
const first=planMappedPlaygroundEquipment([fake],args);
assert.equal(first.eligibleAreas,1);
assert(first.equipment.length>=1);
assert(first.equipment.every(e=>e.x>=3.4&&e.x<=20.6&&
 e.z>=3.4&&e.z<=18.6));
assert.deepEqual(first.equipment,
 planMappedPlaygroundEquipment([fake,fake],args).equipment,
 'Duplicate regional OSM playgrounds may not create duplicate assets');
assert.deepEqual(first.equipment,
 planMappedPlaygroundEquipment([fake],args).equipment,
 'Procedural fixture locations must be stable');

for(const t of [
 {...fake.tags,access:'private'},
 {...fake.tags,access:'customers',name:'Vodní svět'},
 {...fake.tags,playground:'water'},
 {...fake.tags,playground:'cushion'},
 {...fake.tags,playground:'structure'},
 {...fake.tags,indoor:'yes'},
 {...fake.tags,maxheight:'1.2'},
 {...fake.tags,fee:'yes'},
 {...fake.tags,building:'yes'}
])assert(!ordinaryMappedPlayground(t),'Do not fabricate generic attractions');
assert(ordinaryMappedPlayground({...fake.tags,playground:'swing',indoor:'no'}));
const swing=planMappedPlaygroundEquipment([
 {...fake,id:'swing',tags:{leisure:'playground',playground:'swing',indoor:'no'}}
],args);
assert(swing.equipment.length&&swing.equipment.every(e=>e.type==='swing'));
const blocked=planMappedPlaygroundEquipment([fake],{
 ...args,photoAllowed:()=>false});
assert.equal(blocked.equipment.length,0);
assert(blocked.skippedPhotoZone>0);
assert.equal(planMappedPlaygroundEquipment([fake],{
 ...args,roads:{isClear:()=>false}}).equipment.length,0);
assert.equal(planMappedPlaygroundEquipment([fake],{
 ...args,buildings:{isClear:()=>false}}).equipment.length,0);

const cos=Math.cos(50.226*Math.PI/180);
const convert=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const regions=['old','mlada','vrutice','westlink','centerlink','bozidar'];
const seen=new Set(),playAreas=[],roads=createRoadClearance(),
 buildings=makeSidewalkBuildingGuard(),water=createRoadClearance();
for(const region of regions){
 const path=region==='old'?'../data/milovice-osm.json':
  '../data/regions/'+region+'.json';
 const els=JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8')).elements;
 for(const el of els){
  if(seen.has(el.id))continue;
  seen.add(el.id);
  const t=el.tags||{},points=(el.geometry||[]).map(convert);
  if(t.building&&t.building!=='roof'&&points.length>=3)
   buildings.add(el.id,points);
  if(t.highway&&points.length>=2){
   const kind=t.highway;
   const width=kind==='primary'?11:kind==='secondary'?9:
    kind==='tertiary'?8:kind==='pedestrian'?4:
    kind==='footway'?1.8:kind==='path'||kind==='steps'?1.65:
    kind==='cycleway'?2:kind==='service'?4.5:7.8;
   roads.addRoad({id:el.id,points,kind,width});
  }
  if(t.leisure==='playground')
   playAreas.push({id:el.id,tags:t,points,regionId:region});
 }
}
assert.equal(playAreas.length,18,'The regional OSM extracts include 18 distinct playground polygons');
const sourceEligible=playAreas.filter(p=>ordinaryMappedPlayground(p.tags));
assert.equal(sourceEligible.length,6,
 'Only six ordinary public playspaces qualify; Mirakulum and private attractions are excluded');
const result=planMappedPlaygroundEquipment(playAreas,{roads,buildings,water});
assert.equal(result.eligibleAreas,6);
assert.equal(result.modeledAreas,6);
assert.equal(result.equipment.length,9);
assert(!result.equipment.some(e=>e.osmId==='435054544'), 'No water play attraction models');
assert(result.equipment.filter(e=>e.osmId==='1303773811')
 .every(e=>e.type==='swing'),'Source-tagged swings must stay swings');
for(const p of result.equipment){
 assert(roads.isClear(p.x,p.z,3.15,.65),'No modeled equipment on roads/footpaths');
 assert(buildings.isClear(p.x,p.z,3.0),'No mapped building collision');
 assert(water.isClear(p.x,p.z,3.2,.75),'No mapped water collision');
 assert(sourceEligible.some(e=>String(e.id)===p.osmId));
}
assert.deepEqual(result.equipment,planMappedPlaygroundEquipment(
 playAreas.slice().reverse(),{roads,buildings,water}).equipment,
 'Load order must not affect gameplay fixtures');
for(const [id,kind] of [['1468803906','slide'],['1303773811','swing']]){
 const way=playAreas.find(w=>String(w.id)===id);
 const review=planPlaygroundReviewCamera(id,result.equipment,way,{
  roads,buildings,water
 });
 assert(review?.ready,'Known source area and existing 3D part need camera');
 assert.equal(review.target.type,kind);
 assert.equal(review.target.osmId,id);
 assert.equal(review.cameraInsideMappedPlayground,true);
 assert.equal(review.notAPhoto,true);
 assert(roads.isClear(review.cameraEye.x,review.cameraEye.z,.55,.5),
  'Camera must not spawn on roads or mapped paths');
 assert(buildings.isClear(review.cameraEye.x,review.cameraEye.z,.85));
 assert(water.isClear(review.cameraEye.x,review.cameraEye.z,.7,.5));
 assert(review.metersFromTarget>=5.7&&review.metersFromTarget<=11.2);
 assert.deepEqual(review,planPlaygroundReviewCamera(id,result.equipment,way,{
  roads,buildings,water
 }),'Camera viewpoint is repeatable across reloads');
}
assert.equal(planPlaygroundReviewCamera('435054544',result.equipment,
 playAreas.find(w=>String(w.id)==='435054544'),{
  roads,buildings,water
 }),null,'Never manufacture a water attraction review');
assert.equal(planPlaygroundReviewCamera('1468803906',result.equipment,
 playAreas.find(w=>String(w.id)==='1468803906'),{
  roads:{isClear:()=>false},buildings,water
 }),null,'No audit camera on a mapped road');
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "import {planMappedPlaygroundEquipment,planPlaygroundReviewCamera} from './scripts/osm-playground-equipment-5102.js?v=510300'",
 'const osmPlaygroundWays=[];',
 'osmPlaygroundWays.push({id:el.id,tags:el.tags,',
 'const playgroundPlan=planMappedPlaygroundEquipment(osmPlaygroundWays,',
 'window.__milovicePlaygroundAudit={',
 'playDraws.reduce((a,b)=>a+b,0)',
 'window.__milovicePlaygroundCameraAudit={',
 'streetAudit=play-mlada-5103',
 'streetAudit=play-vrutice-5103'
])assert(game.includes(token),'Missing in-game playground integration: '+token);
const meta=game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],
 id=game.match(/const BUILD_ID='([^']+)'/)?.[1],
 hud=game.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===id&&id===hud,'All game build stamps must match');
console.log('PASS 5.102/5.103 public playgrounds and sourced review cameras',{
 eligibleAreas:result.eligibleAreas,modeledAreas:result.modeledAreas,
 equipment:result.equipment.length,restrictedSkipped:result.skippedRestricted});
