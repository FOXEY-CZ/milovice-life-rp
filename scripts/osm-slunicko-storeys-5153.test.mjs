import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SLUNICKO_5153 as S,planSlunickoStoreys5153}
 from './osm-slunicko-storeys-5153.js';
const elements=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const main=elements.find(w=>String(w.id)===S.osmId);
const annex=elements.find(w=>String(w.id)==='53865700');
assert(main&&annex);
const original=JSON.stringify([main,annex]);
assert.equal(main.tags['building:levels'],'2');
assert.equal(main.tags['ref:ruian:building'],'26092069');
const opt={id:main.id,regionId:'mlada',tags:main.tags,
 geometry:main.geometry,baseFloors:2};
const plan=planSlunickoStoreys5153(opt);
assert(plan&&plan.version==='5.153');
assert.equal(plan.modelFloors,4);
assert.equal(plan.modelHeightMeters,12.2);
assert.equal(plan.sourceOriginalOSMLevels,2);
assert.equal(plan.sourceReportedStoreys,4);
assert.equal(plan.measuredHeight,false);
assert.equal(plan.sourceSpecifiesAboveGroundFloors,false);
assert.equal(plan.OSMFootprintChanged,false);
assert.equal(plan.OSMLevelsChanged,false);
for(const key of ['addedBuildings','addedRoads','addedFootways',
 'addedColliders','addedStreetFurniture','addedDoors','addedParking'])
 assert.equal(plan[key],0);
for(const change of [
 {id:'53865700'},{regionId:'vrutice'},{baseFloors:3},
 {photoReviewed:true},{approvedArchitecture:true},
 {tags:{...main.tags,'building:levels':'4'}},
 {tags:{...main.tags,name:'other'}},
 {tags:{...main.tags,'ref:ruian:building':'26092042'}},
 {tags:{...main.tags,height:'12.2'}},
 {geometry:main.geometry.slice(0,-1)},
 {geometry:main.geometry.map((p,i)=>i===5?{...p,lat:p.lat+.0000001}:p)}
])assert.equal(planSlunickoStoreys5153({...opt,...change}),null);
assert.equal(JSON.stringify([main,annex]),original);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const key of [
 "from './scripts/osm-slunicko-storeys-5153.js?v=515300'",
 'const slunickoPlan=planSlunickoStoreys5153({',
 'if(slunickoPlan)floors=slunickoPlan.modelFloors;',
 'if(slunickoPlan)h=slunickoPlan.modelHeightMeters;',
 'window.__miloviceSlunickoRuntime=()=>{',
 'streetAudit=topolova-slunicko-5153',
 "'topolova-slunicko-5153':{",
 '!sportovniHall&&!slunickoPlan&&!slepaUtility'
])assert(html.includes(key),'Missing game hook '+key);
console.log('PASS 5.153 school source-locked 4-storey visual mass; all OSM data unchanged');
