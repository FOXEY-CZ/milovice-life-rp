import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaRoadSidewalk5252} from './osm-italska-road-sidewalk-5252.js';
import {planItalskaNpcTurn5255,sampleItalskaNpcTurn5255,
 inspectItalskaSmoothTurns5255,inspectItalskaCurveSweep5255}
 from './osm-italska-junction-smoothing-5255.js';
const original=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(original).elements;
const way=id=>elements.find(e=>e.id===id);
const plan=planItalskaRoadSidewalk5252({regionId:'mlada',
 road:way(8590284),sidewalk:way(1484073943),defaultWidth:7.8});
assert(plan,'Original OSM road and sidewalk hashes required');
const xy=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),y:-p.lat*111320});
const segments=id=>way(id).geometry.slice(1).map((p,i)=>{
 const a=xy(way(id).geometry[i]),b=xy(p);
 return {a,b,kind:'residential',osmId:id,width:id===8590284?5:7.8,
  len:Math.hypot(b.x-a.x,b.y-a.y),oneway:0};
}).filter(s=>s.len>=2.5&&s.len<=175);
const narrow=segments(8590284),named=[...segments(8585601),...segments(1107814416)];
const report=inspectItalskaSmoothTurns5255({roadPlan:plan,segments:[...narrow,...named]});
assert.equal(report.ready,true,JSON.stringify(report));
assert.equal(report.connectedSharpTurnArms,4);
assert.equal(report.modelBufferedCurvesAccepted,4);
assert(report.minimumModelReserveMetres>=.10,JSON.stringify(report));
assert.equal(report.actualAsphaltMeshVerified,false);
assert.equal(report.physicalSteeringVerified,false);
let checked=0;
for(const from of [narrow[0],narrow[narrow.length-1]])for(const fromDirection of [-1,1]){
 const node=fromDirection===1?from.b:from.a;
 for(const to of named)for(const toDirection of [-1,1]){
  const start=toDirection===1?to.a:to.b;
  if(Math.hypot(node.x-start.x,node.y-start.y)>.05)continue;
  const options={roadPlan:plan,from,fromDirection,to,toDirection,
   car:{driven:false,parked:false,wideModel5254:false}};
  const p=planItalskaNpcTurn5255(options);
  assert(p,'All 4 original OSM exits must produce a buffered model curve');
  const sweep=inspectItalskaCurveSweep5255(p);
  assert.equal(sweep.accepted,true);
  assert.equal(sweep.samples,31);
  const begin=sampleItalskaNpcTurn5255(p,to,toDirection===1?0:1,toDirection);
  const mid=sampleItalskaNpcTurn5255(p,to,
   toDirection===1?p.metres/(to.len*2):1-p.metres/(to.len*2),toDirection);
  const end=sampleItalskaNpcTurn5255(p,to,
   toDirection===1?p.metres/to.len:1-p.metres/to.len,toDirection);
  assert(begin&&mid&&end);
  assert(Math.hypot(begin.x-end.x,begin.z-end.z)>1);
  assert.equal(sampleItalskaNpcTurn5255(p,from,.2,fromDirection),null);
  assert.equal(planItalskaNpcTurn5255({...options,car:{driven:true}}),null);
  assert.equal(planItalskaNpcTurn5255({...options,car:{driven:false,service:'432'}}),null);
  assert.equal(planItalskaNpcTurn5255({...options,car:{driven:false,wideModel5254:true}}),null);
  assert.equal(planItalskaNpcTurn5255({...options,roadPlan:{...plan,roadGeometryHash:'drift'}}),null);
  checked++;
 }
}
assert.equal(checked,4);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 'osm-italska-junction-smoothing-5255.js?v=',
 'planItalskaNpcTurn5255({',
 'sampleItalskaNpcTurn5255(obj.italskaTurn5255',
 'window.__miloviceItalskaSmoothTurnRuntime5255=()=>',
 "const BUILD_ID='"
])assert(html.includes(token),'Missing 5.255 game integration '+token);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),original);
console.log('PASS 5.255: four mapped NPC exit curves with 31x4 body corners and 10cm model buffer; no physical steering or asphalt claim');
