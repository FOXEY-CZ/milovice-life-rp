import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaRoadSidewalk5252} from './osm-italska-road-sidewalk-5252.js';
import {planItalskaSmoothNpcExit5255,advanceItalskaSmoothNpcExit5255,
 inspectItalskaSmoothNpcExits5255} from './osm-italska-npc-smooth-exits-5255.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const els=JSON.parse(raw).elements;
const source=els.find(e=>e.id===8590284),
 walk=els.find(e=>e.id===1484073943),
 named=[els.find(e=>e.id===8585601),els.find(e=>e.id===1107814416)];
const roadPlan=planItalskaRoadSidewalk5252({
 regionId:'mlada',road:source,sidewalk:walk,defaultWidth:7.8});
assert(roadPlan,'Unchanged original 5.252 source lock required');
assert(named.every(Boolean)&&named.every(e=>e.tags.highway==='residential'));
const project=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 y:-p.lat*111320});
const edges=(e,w)=>e.geometry.slice(1).map((p,i)=>{
 const a=project(e.geometry[i]),b=project(p);
 return {osmId:e.id,kind:e.tags.highway,width:w,oneway:0,a,b,
  len:Math.hypot(a.x-b.x,a.y-b.y)};
});
const segments=[...edges(source,5),...named.flatMap(e=>edges(e,7.8))];
const audit=inspectItalskaSmoothNpcExits5255({roadPlan,segments});
assert.equal(audit.ready,true);
assert.equal(audit.mappedNarrowSegments,8);
assert.equal(audit.testedExits,4);
assert.equal(audit.safeModelExits,2,
 'Only the two footprint-safe OSM junction arms may use a smoothed curve');
assert.equal(audit.unverifiedExits,2,
 'Never mark an unverified lane/curb overlap safe');
assert.equal(audit.originalGPSUnchanged,true);
assert.equal(audit.actualCollisionMeshNotValidated,true);
const src=segments.filter(s=>s.osmId===8590284);
let accepted=0,rejected=0;
for(const end of [
 {from:src[0],direction:-1,neighborId:8585601},
 {from:src[src.length-1],direction:1,neighborId:1107814416}
]){
 const node=end.direction===1?end.from.b:end.from.a;
 const options=segments.filter(s=>s.osmId===end.neighborId&&
  [s.a,s.b].some(p=>Math.hypot(p.x-node.x,p.y-node.y)<.05));
 assert.equal(options.length,2);
 for(const to of options){
  const dir=Math.hypot(to.a.x-node.x,to.a.y-node.y)<.05?1:-1;
  const params={roadPlan,from:end.from,direction:end.direction,
   to,nextDirection:dir,car:{service:null,wideModel5254:false}};
  const turn=planItalskaSmoothNpcExit5255(params);
  if(!turn){
   rejected++;
   continue;
  }
  accepted++;
  assert.equal(turn.sourceLocked,true);
  assert.equal(turn.modelEnvelopeChecked,true);
  assert.equal(turn.sweptDynamicsValidated,false);
  assert(turn.angleDegrees>75&&turn.angleDegrees<110);
  assert(turn.totalMetres>3&&turn.totalMetres<15);
  let last=null,travelled=0,maxStep=0,steps=0,finished=false;
  while(!finished&&steps++<250){
   const p=advanceItalskaSmoothNpcExit5255(turn,.13);
   assert(p);
   if(last){
    const step=Math.hypot(p.x-last.x,p.z-last.z);
    maxStep=Math.max(maxStep,step);
    assert(step<.145,'Turn position must advance continuously');
    let delta=Math.abs(p.yaw-last.yaw);
    delta=Math.min(delta,2*Math.PI-delta);
    assert(delta<.16,'Turn yaw must rotate gradually, not snap');
   }
   travelled+=p.metresMoved;last=p;finished=p.finished;
  }
  assert(finished,'Turn must complete in bounded distance');
  assert(maxStep>0);
  assert(Math.abs(travelled-turn.totalMetres)<1e-6);
  assert(Math.abs(last.destinationProgress-
   (dir===1?4/to.len:1-4/to.len))<1e-8);
  assert.equal(advanceItalskaSmoothNpcExit5255(turn,0).finished,true);
  assert.equal(planItalskaSmoothNpcExit5255({
   ...params,car:{service:'432'}}),null);
  assert.equal(planItalskaSmoothNpcExit5255({
   ...params,car:{wideModel5254:true}}),null);
  assert.equal(planItalskaSmoothNpcExit5255({
   ...params,car:{driven:true}}),null);
  assert.equal(planItalskaSmoothNpcExit5255({
   ...params,roadPlan:{...roadPlan,roadGeometryHash:'bad'}}),null);
 }
}
assert.equal(accepted,2);
assert.equal(rejected,2);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-italska-npc-smooth-exits-5255.js?v=525500'",
 'planItalskaSmoothNpcExit5255({',
 'advanceItalskaSmoothNpcExit5255(',
 'window.__miloviceItalskaSmoothNpcRuntime5255=()=>'
])assert(html.includes(token),'Missing 5.255 game integration: '+token);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
console.log('PASS 5.255: two verified OSM NPC exit curves smooth, two unsafe exits unchanged, original sidewalk and GPS intact');
