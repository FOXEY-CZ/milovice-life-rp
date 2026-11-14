// Milovice RP 5.59 — all 17 north Nádražní OSM garage fronts.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planNadrazniGarageCourt,NADRAZNI_GARAGE_SITE} from './nadrazni-garage-court.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const ways=JSON.parse(read('data/milovice-osm.json')).elements;
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const anchor=xy(NADRAZNI_GARAGE_SITE.anchor);
const mapped=ways.filter(w=>['garage','garages'].includes(w.tags?.building)&&
 w.geometry?.length).map(w=>({
 id:w.id,building:w.tags.building,points:w.geometry.map(xy)
})).filter(g=>{
 const center=g.points.reduce((a,p)=>({
   x:a.x+p.x/g.points.length,z:a.z+p.z/g.points.length
 }),{x:0,z:0});
 return Math.hypot(center.x-anchor.x,center.z-anchor.z)<NADRAZNI_GARAGE_SITE.radiusM;
});
assert.equal(mapped.length,17,'Mapped north Nádražní garage court must have 17 actual individual garage footprints');
const plan=planNadrazniGarageCourt(mapped);
assert.equal(plan.size,17,'All 17 garage gates must face the open court, no fallback to party wall');
const ids=new Set(mapped.map(g=>g.id));
const east=[],west=[];
for(const [id,front] of plan){
 assert(ids.has(id),'Never invent a building id');
 assert(Number.isSafeInteger(front.edge)&&front.edge>=0&&front.edge<4);
 assert(front.len>=2.35&&front.len<=4.1,'Door on mapped ~3m SHORT edge only; never 5.85m party wall');
 assert(front.doorWidth>2.3&&front.doorWidth<2.8,'Realistic gate must fit between mapped side walls');
 assert.equal(front.placement,'short-facade-facing-mapped-opposite-garage-row');
 assert(ids.has(front.opposingId),'The inferred door must face another mapped unit across the court');
 assert(front.inferredRowGapM>8&&front.inferredRowGapM<33);
 assert(front.sideOffsetM<6.26);
 assert(Math.abs(front.normal.x)>.98,'Nádražní garage rows face east and west into courtyard');
 const frontGroup=front.normal.x>0?east:west;
 frontGroup.push(id);
 const footprint=mapped.find(e=>e.id===id).points;
 const a=footprint[front.edge],b=footprint[front.edge+1];
 assert(front.center.x>(Math.min(a.x,b.x)-.1)&&front.center.x<(Math.max(a.x,b.x)+.1));
}
assert(east.length>=5&&west.length>=5,'Both sides of garage court must have gates');
assert.equal(east.length+west.length,17);
assert.deepEqual([...plan.keys()].sort((a,b)=>a-b),
 mapped.map(g=>g.id).sort((a,b)=>a-b));
const reversed=planNadrazniGarageCourt(mapped.map(g=>({
 ...g,points:g.points.slice().reverse()})));
assert.equal(reversed.size,17,'Reversed OSM polygon winding must not flip or omit garage gates');
for(const [id,front] of plan){
 const r=reversed.get(id);
 assert(r,'Reversed polygon missing gate');
 assert(Math.hypot(r.center.x-front.center.x,r.center.z-front.center.z)<.15,
  'OSM polygon order must not move the door to the opposite street facade');
 assert(r.normal.x*front.normal.x+r.normal.z*front.normal.z>.99,
  'Face normal invariant when OSM polygon vertex order reverses');
}
assert.equal(planNadrazniGarageCourt(mapped.slice(0,4)).size,0,
 'If only partial rows are downloaded, no speculative garage entrance placement');
assert.equal(planNadrazniGarageCourt([]).size,0);
assert.equal(planNadrazniGarageCourt(mapped.map(g=>({...g,building:'residential'}))).size,0,
 'Ordinary homes must never be treated as garages');
const src=read('index.html');
for(const needle of [
 "from './scripts/nadrazni-garage-court.js?v=5590'",
 'const nadrazniGarageCourtFronts=new Map()',
 'planNadrazniGarageCourt(northernGarages.map',
 'NADRAZNI_GARAGE_SITE.radiusM',
 'const courtFront=nadrazniGarageCourtFronts.get(osmId)||null',
 'doorWidth=courtFront?courtFront.doorWidth:',
 "window.__miloviceNadrazniGarageAudit",
 "externalParkingInvented:false",
 "landscapingInvented:false",
 'recordEntranceGrade(garageGrade'
])assert(src.includes(needle),'Missing visible-garage-rebuild integration: '+needle);
assert(!src.includes("if(isGarage&&!auditedCore){\n  // Garage footprints"),
 'Old longest-wall garage door placement must be replaced in selected street');
console.log('Milovice RP 5.59 north garage court PASS',JSON.stringify({
  mapped:mapped.length,replaced:plan.size,doorsFacingEast:east.length,
  doorsFacingWest:west.length,noFictionalParking:true,
  method:'paired mapped garage rows; facade orientation estimated'
}));
