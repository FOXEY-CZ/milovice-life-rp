import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planMladaResidentialPanel,planMladaPanelEdge,
 panelDoorWindowConflict} from './osm-mlada-residential-5105.js';

const cos=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const elements=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const plans=[];
for(const el of elements){
 if(!el.tags?.building)continue;
 const floors=Number(el.tags['building:levels']);
 const plan=planMladaResidentialPanel({
  id:el.id,regionId:'mlada',tags:el.tags,
  points:(el.geometry||[]).map(toWorld),height:floors*3.05
 });
 if(plan)plans.push(plan);
}
const ids=plans.map(x=>x.id);
assert.equal(ids.length,22,'OSM contains 22 4–5-floor mapped flats within 112 m of playground');
assert.equal(new Set(ids).size,22);
assert(ids.includes('891874834'),'Residential building closest to playground must qualify');
assert(ids.includes('1112779856'),'Last nearby 4-floor block must qualify');
assert(!ids.includes('435054544'),'No customer attraction should become residential');
assert(plans.every(p=>p.mappedLevels&&[4,5].includes(p.floors)));
assert(plans.every(p=>p.sourcePlaygroundId==='1468803906'));
assert(plans.some(p=>p.flats===null),'Missing apartment count must stay unknown, never invented');
assert(plans.some(p=>p.flats===33),'Existing OSM apartment count must stay exact');
assert(plans.every(p=>p.photographedFacade===false));
assert(plans.every(p=>!p.footprintChanged&&!p.roofShapeChanged&&!p.buildingCountChanged));

const sample=elements.find(x=>x.id===891874834),
 points=sample.geometry.map(toWorld),tags=sample.tags;
const opt={id:sample.id,regionId:'mlada',tags,points,height:15.25};
assert(planMladaResidentialPanel(opt));
for(const override of [
 {regionId:'vrutice'},
 {photoReviewed:true},
 {approvedArchitecture:true},
 {tags:{...tags,'building:levels':'7'}},
 {tags:{...tags,building:'commercial'}},
 {points:[]},
 {height:40}
])assert.equal(planMladaResidentialPanel({...opt,...override}),null,
 'The source and mapped storey count are necessary, never guessed');

for(const p of plans){
 assert.equal(p.floorHeight,3.05);
 const edge=planMladaPanelEdge(p,27.7,3.2);
 assert.equal(edge.floorCourses.length,p.floors-1);
 assert.equal(edge.windowBays,8);
 assert.equal(edge.verticalSeams.length,7);
 assert.equal(edge.duplicatedFloorSeams,0);
 assert(edge.floorCourses.every((c,i)=>c.height===(i+1)*p.floorHeight));
 for(const seam of edge.verticalSeams){
  const windowCenters=Array.from({length:edge.windowBays},
   (_,i)=>(i+1)/(edge.windowBays+1));
  assert(Math.min(...windowCenters.map(x=>Math.abs(x-seam.fraction)))*27.7>.85,
   'A vertical joint must be between windows, not across glass');
  assert(seam.from>=1.25&&seam.to<=p.height);
 }
 const short=planMladaPanelEdge(p,3.3,3.2);
 assert.equal(short.verticalSeams.length,0);
 assert.equal(short.floorCourses.length,p.floors-1,
  'Short exterior returns must have exactly the same floor courses');
}
assert.equal(planMladaPanelEdge(null,20),null);
assert.equal(panelDoorWindowConflict(2,2,.5,5,0),true);
assert.equal(panelDoorWindowConflict(2,2,.4,5,0),false);
assert.equal(panelDoorWindowConflict(2,3,.5,5,0),false);
assert.equal(panelDoorWindowConflict(2,2,.5,5,1),false);
assert.equal(panelDoorWindowConflict(null,2,.5,5,0),false);

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-mlada-residential-5105.js?v=510500'",
 'const estatePlan=regionalStyle?planMladaResidentialPanel({',
 'planMladaPanelEdge(\n   estatePlan,len,regionalStyle?.baySpacing??3.12)',
 'panelDoorWindowConflict(regionalEntrance?.index,',
 'window.__miloviceMladaResidentialAudit={',
 'streetAudit=estate-mlada-5105',
 'window.__miloviceMladaEstateCameraAudit={',
 'if(!estatePlan)archPart(\'panelSeam\',',
 'estateAudit.duplicateVerticalJointsRemoved++',
].filter(Boolean))
 assert(html.includes(token),'Missing actual 5.105 rendering integration: '+token);
const id=html.match(/const BUILD_ID='([^']+)'/)?.[1],
 meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],
 hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(id&&meta===id&&hud===id);
console.log('PASS 5.105 mapped Mladá residential panel blocks',JSON.stringify({
 buildings:plans.length,fourFloors:plans.filter(p=>p.floors===4).length,
 fiveFloors:plans.filter(p=>p.floors===5).length
}));
