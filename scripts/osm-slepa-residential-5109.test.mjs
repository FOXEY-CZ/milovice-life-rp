import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSlepaResidentialPanel} from './osm-slepa-residential-5109.js';
import {planMladaPanelEdge,panelDoorWindowConflict}
 from './osm-mlada-residential-5105.js';
const cos=Math.cos(50.226*Math.PI/180);
const conv=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const load=area=>JSON.parse(readFileSync(new URL(
 '../data/regions/'+area+'.json',import.meta.url),'utf8')).elements;
const source=(area)=>{
 const els=load(area),way=els.find(x=>String(x.id)==='202375817');
 assert.equal(way?.tags?.highway,'residential');
 assert.equal(way?.tags?.name,'Slepá');
 assert.equal(way?.tags?.width,'6');
 assert.equal(way.geometry.length,2);
 const streetPoints=way.geometry.map(conv);
 const plans=[];
 for(const el of els){
  if(!el.tags?.building)continue;
  const levels=Number(el.tags['building:levels']);
  const plan=planSlepaResidentialPanel({
   id:el.id,regionId:area,tags:el.tags,
   points:(el.geometry||[]).map(conv),height:levels*3.05,
   streetWayId:way.id,streetPoints
  });
  if(plan)plans.push(plan);
 }
 return {way,streetPoints,plans};
};
const a=source('mlada'),b=source('vrutice');
const expected=['53865778','734359705','734359706','734359707','734359708'];
const sorted=plans=>plans.map(x=>x.id).sort();
assert.deepEqual(sorted(a.plans),expected);
assert.deepEqual(sorted(b.plans),expected,
 'Overlapping regional data must yield exactly the SAME source buildings');
assert.equal(a.plans.length,5,'Only 5 source-backed four-storey Slepá apartment blocks');
assert(a.plans.every(p=>p.floors===4&&p.floorHeight===3.05&&
 p.mappedLevels&&p.nearStreetMeters<=75));
assert.deepEqual(a.plans.map(x=>x.flats).sort((x,y)=>x-y),[20,23,29,32,39]);
for(const plan of a.plans){
 const edge=planMladaPanelEdge(plan,21.4,3.2);
 assert(edge&&edge.floorCourses.length===3&&edge.verticalSeams.length>=1);
 assert.equal(edge.duplicatedFloorSeams,0);
 assert(edge.floorCourses.every((c,i)=>c.height===(i+1)*3.05));
 assert.equal(plan.photographedFacade,false);
 assert.equal(plan.footprintChanged,false);
 assert.equal(plan.roofShapeChanged,false);
 assert.equal(plan.buildingCountChanged,false);
}
const base=a.plans[0];
const building=load('vrutice').find(x=>String(x.id)===base.id);
const opts={id:building.id,regionId:'vrutice',tags:building.tags,
 points:building.geometry.map(conv),height:12.2,
 streetWayId:a.way.id,streetPoints:a.streetPoints};
assert(planSlepaResidentialPanel(opts));
for(const patch of [
 {regionId:'old'},
 {regionId:'bozidar'},
 {streetWayId:'wrong-road'},
 {streetPoints:[]},
 {streetPoints:[a.streetPoints[0]]},
 {photoReviewed:true},
 {approvedArchitecture:true},
 {tags:{...building.tags,building:'yes'}},
 {tags:{...building.tags,'building:levels':'5'}},
 {tags:{...building.tags,access:'private'}},
 {height:55},
 {points:[]},
 {points:[{x:NaN,z:0},...opts.points.slice(1)]}
])assert.equal(planSlepaResidentialPanel({...opts,...patch}),null,
 'Reject unsourced buildings/photo-approved houses and invalid heights');
const far=opts.points.map(p=>({x:p.x+500,z:p.z+500}));
assert.equal(planSlepaResidentialPanel({...opts,points:far}),null);
const unknown=planSlepaResidentialPanel({...opts,
 tags:{...opts.tags,'building:flats':undefined}});
assert.equal(unknown.flats,null,'Never invent number of apartments');
assert.equal(panelDoorWindowConflict(0,0,.5,4,0),true);
assert.equal(panelDoorWindowConflict(0,1,.5,4,0),false);
// Integration checks make sure the same 3D instancing path is used, not a
// stats-only counter or five extra duplicate copies of the houses.
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "from './scripts/osm-slepa-residential-5109.js?v=511000'",
 'const estatePlan=regionalStyle?planMladaResidentialPanel({',
 '})||planSlepaResidentialPanel({',
 "streetWayId:slepaStreet?.id,streetPoints:slepaStreet?.points,",
 "const slepaWay=roadWays.find(w=>String(w.id)==='202375817'",
 'window.__miloviceSlepaResidentialAudit={',
 'const estateAudit=estatePlan?.sourceStreetId?',
 'planMladaPanelEdge(\n   estatePlan,len,regionalStyle?.baySpacing??3.12)',
 "archPart('panelSeam',mx+nx*flushBoxOffset(.11),",
 'audit.verticalBayJoints++;row.verticalJoints++;',
 'estateAudit.groundFloorWindowsSkippedForDoors++;'
])assert(game.includes(term),'Missing 3D integration: '+term);
const meta=game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],
 id=game.match(/const BUILD_ID='([^']+)'/)?.[1],
 hud=game.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===id&&id===hud&&/^\d{8}-[a-z0-9-]+-\d{6}$/.test(id));
console.log('PASS 5.109 mapped Slepá 4-storey apartment facade grids',{
 buildings:a.plans.length,sourceRoad:a.way.id,flats:a.plans.map(x=>x.flats)});
