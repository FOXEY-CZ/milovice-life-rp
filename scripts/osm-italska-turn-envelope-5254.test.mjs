import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaRoadSidewalk5252} from './osm-italska-road-sidewalk-5252.js';
import {inspectItalskaTurnEnvelope5254,inspectItalskaJunctionAngles5254} from './osm-italska-turn-envelope-5254.js';
const original=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(original).elements;
const road=elements.find(x=>x.id===8590284);
const sidewalk=elements.find(x=>x.id===1484073943);
const plan=planItalskaRoadSidewalk5252({
 regionId:'mlada',road,sidewalk,defaultWidth:7.8});
assert(plan);
const mk=(a,b)=>({osmId:8590284,kind:'residential',width:5,a,b});
const straight=[
 mk({x:0,y:0},{x:10,y:0}),mk({x:10,y:0},{x:20,y:0})
];
const clean=inspectItalskaTurnEnvelope5254({roadPlan:plan,segments:straight});
assert.equal(clean.ready,true);
assert.equal(clean.joinCount,1);
assert.equal(clean.failingPoseSamples,0);
assert(clean.poseSamples>=16);
assert.equal(clean.physicalSteeringVerified,false);
const corner=[
 mk({x:0,y:0},{x:10,y:0}),mk({x:10,y:0},{x:10,y:12})
];
const sharp=inspectItalskaTurnEnvelope5254({roadPlan:plan,segments:corner});
assert.equal(sharp.ready,true);
assert(sharp.failingPoseSamples>0,
 '90 degree original-style corner must flag at least one exterior footprint');
assert.equal(sharp.actualRoadMeshNotVerified,true);
assert.equal(sharp.continuousTurnSweepNotVerified,true);
assert.equal(inspectItalskaTurnEnvelope5254({
 roadPlan:{...plan,sidewalkGeometryHash:'altered'},segments:corner
}).ready,false);
assert.equal(inspectItalskaTurnEnvelope5254({
 roadPlan:plan,segments:[{...corner[0],width:7.8},corner[1]]
}).joinCount,0);
const xy=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 y:-p.lat*111320});
const real=road.geometry.slice(1).map((p,i)=>
 mk(xy(road.geometry[i]),xy(p))).filter(s=>
 Math.hypot(s.b.x-s.a.x,s.b.y-s.a.y)>=2.5);
// The original mapped road terminates at two named residential streets.
const nearRoads=[8585601,1107814416].map(id=>elements.find(e=>e.id===id));
assert(nearRoads.every(Boolean),'Both original named junction roads required');
const neighborSegments=nearRoads.flatMap(e=>e.geometry.slice(1).map((p,i)=>
 ({osmId:e.id,kind:e.tags.highway,width:7.8,
  a:xy(e.geometry[i]),b:xy(p)})));
const j=inspectItalskaJunctionAngles5254({roadPlan:plan,
 segments:[...real,...neighborSegments]});
assert.equal(j.ready,true);
assert.equal(j.mappedTurnOptions,4);
assert.equal(j.turnsOver75Degrees,4);
assert(j.maxTurnDegrees>100&&j.maxTurnDegrees<110);
assert.deepEqual([...new Set(j.arms.map(a=>a.neighborOSMId))].sort(),
 ['1107814416','8585601']);
const audit=inspectItalskaTurnEnvelope5254({
 roadPlan:plan,segments:[...real,...neighborSegments]});
assert.equal(audit.ready,true);
assert(audit.joinCount>0);
assert(audit.poseSamples>0);
assert.equal(audit.originalGpsUnchanged,true);
assert.equal(audit.centerlineBufferProxyOnly,true);
assert.equal(audit.physicalSteeringVerified,false);
assert.equal(audit.junctions.ready,true);
assert.equal(audit.junctions.mappedTurnOptions,4);
assert.equal(audit.junctions.intersectionClearanceVerified,false);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes('inspectItalskaTurnEnvelope5254'));
assert(html.includes('window.__miloviceItalskaTurnEnvelopeRuntime5254=()=>'));
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),original);
console.log('PASS 5.254: source-locked NPC footprint proxy, straight clean, sharp bend flagged, real OSM poses audited without false steering certification');
