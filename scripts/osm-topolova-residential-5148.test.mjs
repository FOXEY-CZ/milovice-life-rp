import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planMladaPanelEdge} from './osm-mlada-residential-5105.js';
import {TOPOLOVA_RESIDENTIAL_5148 as S,planTopolovaResidential5148,
 planTopolovaEntrancePlinth5148,topolovaDoorWindowConflict5148}
 from './osm-topolova-residential-5148.js';
const e=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements;
const building=e.find(x=>String(x.id)===S.id);
assert(building,'Target RUIAN house exists');
const original=JSON.stringify(building);
assert.equal(building.geometry.length,23);
const options={id:building.id,regionId:'mlada',tags:building.tags,
 geometry:building.geometry,height:6*3.05};
const plan=planTopolovaResidential5148(options);
assert(plan&&plan.version==='5.148');
assert.equal(plan.sourceRUIANId,'42429056');
assert.equal(plan.sourceOSMHash,'aef1ea1b');
assert.equal(plan.floors,6);
assert.equal(plan.flats,60);
assert.equal(plan.photographedFacade,false);
assert.equal(plan.sourceGeometryExactlyMatched,true);
assert(!plan.footprintChanged&&!plan.roofShapeChanged);
let testedEdges=0;
const k=111320*Math.cos(50.226*Math.PI/180);
for(let i=1;i<building.geometry.length;i++){
 const a=building.geometry[i-1],b=building.geometry[i];
 const length=Math.hypot((a.lon-b.lon)*k,(a.lat-b.lat)*111320);
 const edge=planMladaPanelEdge(plan,length,3.12);
 if(!edge)continue;
 assert.equal(edge.floorCourses.length,5);
 assert(edge.floorCourses.every((q,i)=>Math.abs(q.height-3.05*(i+1))<.0001));
 assert.equal(edge.duplicatedFloorSeams,0);
 testedEdges++;
}
assert(testedEdges>=9,'House must add real six-floor bands along its many OSM faces');
const split=planTopolovaEntrancePlinth5148({
 plan,facade:{index:2,len:18},entranceEdgeIndex:2});
assert.equal(split?.parts.length,2);
assert(Math.abs(split.openingWidth-1.89)<.001);
assert.equal(planTopolovaEntrancePlinth5148({
 plan,facade:{index:2,len:18},entranceEdgeIndex:1}),null);
assert(topolovaDoorWindowConflict5148({
 plan,entranceEdgeIndex:2,edgeIndex:2,edgeLength:18,
 fraction:.5,floor:0}));
assert(!topolovaDoorWindowConflict5148({
 plan,entranceEdgeIndex:2,edgeIndex:2,edgeLength:18,
 fraction:.5,floor:2}));
for(const patch of [
 {id:1},{regionId:'vrutice'},{photoReviewed:true},
 {approvedArchitecture:true},{height:17},
 {tags:{...building.tags,'building:levels':'7'}},
 {tags:{...building.tags,'building:flats':'59'}},
 {geometry:building.geometry.slice(0,-1)},
 {geometry:building.geometry.map((q,i)=>i===8?{...q,lat:q.lat+.0000001}:q)}
])assert.equal(planTopolovaResidential5148({...options,...patch}),null,
 'Any unsourced edit must fail closed');
assert.equal(JSON.stringify(building),original);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const text of [
 "from './scripts/osm-topolova-residential-5148.js?v=514800'",
 'const topolovaPanel=regionalStyle?planTopolovaResidential5148({',
 '||sportovniPanel||topolovaPanel:null;',
 'estatePlan?.version===\'5.148\'?',
 'window.__miloviceTopolovaResidentialRuntime=()=>{',
 'planTopolovaEntrancePlinth5148({',
 'topolovaDoorWindowConflict5148({',
 'streetAudit=topolova-residential-5148'
])assert(html.includes(text),'Missing real in-game module wiring: '+text);
console.log('PASS 5.148 exact Topolova 6-floor RUIAN, 60 flats, protected footprint and safe model door');
