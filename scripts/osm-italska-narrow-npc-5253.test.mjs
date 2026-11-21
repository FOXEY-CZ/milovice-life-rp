// 5.253: narrow historic Italska 5m MODEL road must not acquire
// spontaneous roadside parking or itinerant buses without a width audit.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaRoadSidewalk5252} from './osm-italska-road-sidewalk-5252.js';
import {narrowItalskaRoad5253,filterItalskaNpcTurns5253,
 permitItalskaParking5253,inspectItalskaNpcClearance5253}
 from './osm-italska-narrow-npc-5253.js';
import {planNpcJunction5241} from './osm-traffic-continuity-5241.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const els=JSON.parse(raw).elements;
const road=els.find(x=>x.id===8590284);
const walk=els.find(x=>x.id===1484073943);
const plan=planItalskaRoadSidewalk5252({regionId:'mlada',
 road,sidewalk:walk,defaultWidth:7.8});
assert(plan);
const seg={osmId:8590284,width:5,kind:'residential',
 a:{x:0,y:0},b:{x:20,y:0},len:20,oneway:0};
const other={...seg,osmId:8585601,width:7.8,b:{x:0,y:25},len:25};
const from={...seg,osmId:8590286,width:7.8,a:{x:-10,y:0},
 b:{x:0,y:0},len:10};
assert.equal(narrowItalskaRoad5253(plan,seg),true);
for(const variant of [{...seg,width:7.8},{...seg,osmId:53865882},
 {...seg,kind:'service'}])
 assert.equal(narrowItalskaRoad5253(plan,variant),false);
const outgoing=[{segment:seg,direction:1},{segment:other,direction:1}];
const bus={service:'432'},car={service:null};
const filtered=filterItalskaNpcTurns5253({roadPlan:plan,car:bus,outgoing});
assert.equal(filtered.length,1);
assert.equal(filtered[0].segment,other);
assert.equal(filterItalskaNpcTurns5253({roadPlan:plan,car,outgoing}),outgoing);
assert.equal(filterItalskaNpcTurns5253({roadPlan:plan,car:bus,
 outgoing:[{segment:seg,direction:1}]}).length,0);
assert.equal(permitItalskaParking5253({roadPlan:plan,
 spot:{type:'roadside',sourceId:8590284}}),false);
assert.equal(permitItalskaParking5253({roadPlan:plan,
 spot:{type:'mapped-surface-parking',sourceId:8590284}}),true);
assert.equal(permitItalskaParking5253({roadPlan:plan,
 spot:{type:'roadside',sourceId:8590286}}),true);
assert.equal(permitItalskaParking5253({roadPlan:plan,
 spot:{type:'service-access-bay',sourceId:8590284}}),true);
const stale={...plan,roadGeometryHash:'bad'};
assert.equal(narrowItalskaRoad5253(stale,seg),false);
assert.deepEqual(filterItalskaNpcTurns5253({roadPlan:stale,car:bus,outgoing}),outgoing);
assert.equal(permitItalskaParking5253({roadPlan:stale,
 spot:{type:'roadside',sourceId:8590284}}),true);
const decision=planNpcJunction5241({segment:from,direction:1,
 outgoing:filtered});
assert.equal(decision?.mode,'connected');
assert.equal(decision?.segment,other);
const dead=planNpcJunction5241({segment:from,direction:1,
 outgoing:filterItalskaNpcTurns5253({roadPlan:plan,car:bus,
 outgoing:[{segment:seg,direction:1}]})});
assert.equal(dead?.mode,'turn-back');
assert.equal(dead.teleported,false);
const report=inspectItalskaNpcClearance5253({roadPlan:plan,
 segments:[seg,other],cars:[{service:'432',seg:other},
 {service:null,seg,parked:false}]});
assert.equal(report.ready,true);
assert.equal(report.mappedNarrowDriveSegments,1);
assert.equal(report.publicBusesOnModelNarrowRoad,0);
assert.equal(report.unsafeNarrowRoadsideParkingCars,0);
assert.equal(report.newParkingBays,0);
assert.equal(report.legalBusAccessTagChanged,false);
assert.equal(inspectItalskaNpcClearance5253({roadPlan:plan,
 segments:[seg],cars:[{service:'432',seg}]}).ready,false);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-italska-narrow-npc-5253.js?v=525300'",
 'filterItalskaNpcTurns5253({',
 'permitItalskaParking5253({',
 'window.__miloviceItalskaNpcClearanceRuntime5253=()=>',
 'Verze 5.255'
])assert(html.includes(token),'missing runtime integration '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const id=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===id&&id===hud);
console.log('PASS 5.253: source-locked narrow 5m Italska model, ordinary cars retained, buses and accidental roadside parking avoided, mapped parking unaffected, no new source geography');
