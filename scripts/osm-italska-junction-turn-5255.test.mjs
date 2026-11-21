import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaRoadSidewalk5252} from './osm-italska-road-sidewalk-5252.js';
import {ITALSKA_TURN_MOTION_5255 as constants,
 isItalskaSourceTurn5255,planItalskaTurn5255,
 capItalskaApproach5255,capItalskaExit5255,
 sampleItalskaTurn5255} from './osm-italska-junction-turn-5255.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const region=JSON.parse(raw).elements;
const road=region.find(x=>x.id===8590284),sidewalk=region.find(x=>x.id===1484073943);
const plan=planItalskaRoadSidewalk5252({
 regionId:'mlada',road,sidewalk,defaultWidth:7.8});
assert(plan);
const segment=(id,a,b,width=5)=>({
 osmId:id,kind:'residential',width,
 a,b,len:Math.hypot(b.x-a.x,b.y-a.y),oneway:0
});
const old=segment(8590284,{x:-8,y:0},{x:0,y:0});
const next=segment(8585601,{x:0,y:0},{x:0,y:14},7.8);
const params={roadPlan:plan,from:old,direction:1,to:next,nextDirection:1};
assert(isItalskaSourceTurn5255(params));
const choice={mode:'connected',segment:next,direction:1};
assert.equal(capItalskaApproach5255({
 roadPlan:plan,from:old,direction:1,progress:.5,decision:choice
}),constants.speedCapMps);
assert.equal(capItalskaApproach5255({
 roadPlan:plan,from:old,direction:1,progress:0,decision:choice
}),Infinity);
assert.equal(capItalskaApproach5255({
 roadPlan:plan,from:old,direction:1,progress:.5,decision:choice,driven:true
}),Infinity);
assert.equal(capItalskaApproach5255({
 roadPlan:plan,from:old,direction:1,progress:.5,
 decision:{...choice,mode:'terminal'}
}),Infinity);
assert.equal(isItalskaSourceTurn5255({...params,
 roadPlan:{...plan,roadGeometryHash:'altered'}}),false);
assert.equal(isItalskaSourceTurn5255({...params,
 to:segment(999999,{x:0,y:0},{x:0,y:14},7.8)}),false);
assert.equal(isItalskaSourceTurn5255({...params,driven:true}),true);
// A normal 5m to 7.8m 90-degree turn may be too tight; the planner must
// either prove ALL sample corners in the model tube or safely use old motion.
const sharp=planItalskaTurn5255(params);
assert(sharp?.sourceLocked);
assert.equal(sharp.originalGPSUnchanged,true);
assert.equal(sharp.physicalSteeringVerified,false);
assert.equal(sharp.roadMeshCollisionVerified,false);
const sharpExitSpeed=capItalskaExit5255({
 turn:sharp,segment:next,direction:1,progress:.2
});
assert(sharpExitSpeed>0&&sharpExitSpeed<=constants.speedCapMps);
assert.equal(capItalskaExit5255({
 turn:sharp,segment:next,direction:1,progress:.8
}),Infinity);
const start=sampleItalskaTurn5255({
 turn:sharp,segment:next,direction:1,progress:0});
assert.equal(Boolean(start),sharp.visualBlendSafe);
if(start){
 assert(Math.abs(start.x-sharp.oldAnchor.x)<1e-8);
 assert(Math.abs(start.y-sharp.oldAnchor.y)<1e-8);
 assert(Math.abs(start.yaw-sharp.fromYaw)<1e-8);
 const later=sampleItalskaTurn5255({turn:sharp,segment:next,
  direction:1,progress:2/14});
 assert(later&&Number.isFinite(later.x)&&Number.isFinite(later.y));
}
assert.equal(planItalskaTurn5255({...params,driven:true}),null);
// A synthetic wide road can safely contain the same 90-degree visual blend;
// this is NOT a factual claim about either Milovice roadway.
const spacious=segment(8585601,{x:0,y:0},{x:0,y:14},16);
const widePlan=planItalskaTurn5255({...params,to:spacious});
assert(widePlan);
assert.equal(widePlan.visualBlendSafe,true);
assert.equal(widePlan.checkedBodySamples,25);
assert(widePlan.visualPathLengthMetres>4);
const wideCap=capItalskaExit5255({
 turn:widePlan,segment:spacious,direction:1,progress:1/14
});
assert(wideCap>0&&wideCap<constants.speedCapMps);
const wideStart=sampleItalskaTurn5255({
 turn:widePlan,segment:spacious,direction:1,progress:0
});
assert(wideStart);
assert(Math.abs(Math.sin(wideStart.yaw-widePlan.fromYaw))<1e-8,
 'Curve starts tangent to inbound original OSM segment');
const sample=sampleItalskaTurn5255({
 turn:widePlan,segment:spacious,direction:1,progress:1.5/14});
assert(sample&&Number.isFinite(sample.yaw));
assert.equal(sampleItalskaTurn5255({
 turn:widePlan,segment:spacious,direction:1,progress:5/14
}),null);
// Check all four true connected OSM map arms without inventing nodes.
const scale=Math.cos(50.226*Math.PI/180),project=p=>({
 x:p.lon*111320*scale,y:-p.lat*111320});
const roadPieces=road.geometry.slice(1).map((b,i)=>
 segment(road.id,project(road.geometry[i]),project(b),5));
const cases=[];
for(const [from,direction,wayId] of [
 [roadPieces[0],-1,8585601],
 [roadPieces.at(-1),1,1107814416]]){
 const node=direction===1?from.b:from.a;
 const neighbor=region.find(x=>x.id===wayId);
 assert(neighbor&&neighbor.tags.highway==='residential');
 for(let i=1;i<neighbor.geometry.length;i++){
  const to=segment(wayId,project(neighbor.geometry[i-1]),
   project(neighbor.geometry[i]),7.8);
  const nd=Math.hypot(to.a.x-node.x,to.a.y-node.y)<.05?1:
   Math.hypot(to.b.x-node.x,to.b.y-node.y)<.05?-1:0;
  if(!nd)continue;
  const mapped={roadPlan:plan,from,direction,to,nextDirection:nd};
  assert(isItalskaSourceTurn5255(mapped),'Original OSM connection must match');
  const preview=planItalskaTurn5255(mapped);
  assert(preview&&preview.sourceLocked);
  assert.equal(preview.physicalSteeringVerified,false);
  cases.push(preview);
 }
}
assert.equal(cases.length,4);
assert.equal(cases.every(x=>x.modelLength===5.08),true);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const tag of ['osm-italska-junction-turn-5255.js?v=525500',
 'window.__miloviceItalskaJunctionMotionRuntime5255',
 'capItalskaApproach5255({','planItalskaTurn5255({',
 'sampleItalskaTurn5255({','capItalskaExit5255({'])
 assert(html.includes(tag),'missing gameplay integration '+tag);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
console.log('PASS 5.255: 4 original map junction arms, modeled low-speed NPC turns, visual blends only with 25 body-corner proxy samples, original GPS untouched');
