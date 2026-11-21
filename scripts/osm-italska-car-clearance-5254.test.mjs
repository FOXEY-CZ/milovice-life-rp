import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaRoadSidewalk5252} from './osm-italska-road-sidewalk-5252.js';
import {ITALSKA_CAR_CLEARANCE_5254 as C,inspectItalskaCarPair5254,
 filterItalskaWideCarTurns5254,filterItalskaWideRecycle5254,
 inspectItalskaRoadBends5254,inspectItalskaCarClearance5254} from './osm-italska-car-clearance-5254.js';
// Keep the modeled envelope bound to the actual current geometry.
const models=readFileSync(new URL('./world-models.js',import.meta.url),'utf8');
assert(models.includes('const width=isVan?2.04:1.81;'),
 'Car body widths changed; re-audit modeled passing gaps');
assert(models.includes('const variant=index%8,group=new THREE.Group(),isVan=variant===6;'),
 'Wide NPC variant mapping changed');
assert(models.includes('side*width*.56,1.22')&&
 models.includes('new THREE.BoxGeometry(.06,.12,.19)'),
 'Mirror extents changed; re-audit exterior car width');
const htmlSource=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(htmlSource.includes('Math.min(2.25,seg.width*.25)'),
 'NPC lane offset changed; re-audit 5m road passing gaps');
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements;
const road=E.find(x=>x.id===8590284),sidewalk=E.find(x=>x.id===1484073943);
const plan=planItalskaRoadSidewalk5252({
 regionId:'mlada',road,sidewalk,defaultWidth:7.8});
assert(plan,'Original OSM source lock required');
const narrow={osmId:8590284,width:5,kind:'residential'};
const other={osmId:8590286,width:7.8,kind:'residential'};
const standard=inspectItalskaCarPair5254(C.standardExteriorWidth,C.standardExteriorWidth);
const wide=inspectItalskaCarPair5254(C.wideExteriorWidth,C.wideExteriorWidth);
assert.equal(standard.conservativeModelClearance,true);
assert.equal(wide.conservativeModelClearance,false);
assert(standard.passingGapMetres>.4&&standard.smallestEdgeGapMetres>.2);
assert(wide.passingGapMetres<.2&&wide.smallestEdgeGapMetres<.15);
const choices=[{segment:narrow,direction:1},{segment:other,direction:1}];
const van={wideModel5254:true,driven:false},normal={wideModel5254:false};
assert.deepEqual(filterItalskaWideCarTurns5254({roadPlan:plan,car:van,outgoing:choices}),[choices[1]]);
assert.equal(filterItalskaWideCarTurns5254({roadPlan:plan,car:normal,outgoing:choices}),choices);
assert.equal(filterItalskaWideCarTurns5254({roadPlan:plan,car:{...van,driven:true},outgoing:choices}),choices);
assert.deepEqual(filterItalskaWideRecycle5254({roadPlan:plan,car:van,segments:[narrow,other]}),[other]);
assert.deepEqual(filterItalskaWideCarTurns5254({roadPlan:{...plan,roadGeometryHash:'invalid'},car:van,outgoing:choices}),choices);
// 90-degree turn on one original-style 5m way: a bend is found,
// but is explicitly NOT certified as drivable by the envelope arithmetic.
const bendSegments=[
 {...narrow,a:{x:0,y:0},b:{x:10,y:0}},
 {...narrow,a:{x:10,y:0},b:{x:10,y:12}},
 {...other,a:{x:10,y:12},b:{x:15,y:12}}
];
const bendAudit=inspectItalskaRoadBends5254({
 roadPlan:plan,segments:bendSegments});
assert.equal(bendAudit.interiorBends,1);
assert.equal(bendAudit.maxBendDegrees,90);
assert.equal(bendAudit.bendsAbove30Degrees,1);
assert.equal(bendAudit.turningSweptBodyValidated,false);
assert.equal(inspectItalskaRoadBends5254({
 roadPlan:{...plan,roadGeometryHash:'changed'},segments:bendSegments
}).interiorBends,0);
const project=g=>({x:g.lon*111320*Math.cos(50.226*Math.PI/180),
 y:-g.lat*111320});
const originalSegments=road.geometry.slice(1).map((point,i)=>{
 const a=project(road.geometry[i]),b=project(point);
 return {...narrow,a,b,len:Math.hypot(b.x-a.x,b.y-a.y)};
}).filter(s=>s.len>=2.5&&s.len<=175);
const sourceBends=inspectItalskaRoadBends5254({
 roadPlan:plan,segments:originalSegments});
assert(sourceBends.interiorBends>0,'OSM narrow road source bends required');
assert.equal(sourceBends.turningSweptBodyValidated,false);
assert.equal(sourceBends.originalGpsUnchanged,true);
const report=inspectItalskaCarClearance5254({roadPlan:plan,segments:[narrow,other],cars:[{seg:narrow,wideModel5254:false}]});
assert.equal(report.ready,true);
assert.equal(report.wideNpcCarsOnNarrow,0);
assert.equal(report.curvesAndJunctionsNotValidated,true);
assert.equal(report.roadBends.turningSweptBodyValidated,false);
assert.equal(inspectItalskaCarClearance5254({roadPlan:plan,segments:[narrow],cars:[{seg:narrow,wideModel5254:true}]}).ready,false);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-italska-car-clearance-5254.js?v=525400'",
 'wideModel5254:type!==7&&index%8===6',
 'filterItalskaWideCarTurns5254({',
 'filterItalskaWideRecycle5254({',
 'window.__miloviceItalskaCarClearanceRuntime5254=()=>'
])assert(html.includes(token),'missing in-game 5.254 integration '+token);
console.log('PASS 5.254: standard-car model envelope fits straight 5m lane; wide van cannot claim adequate passing clearance; source GPS untouched');
