import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaRoadSidewalk5252} from './osm-italska-road-sidewalk-5252.js';
import {planItalskaNpcTurn5255} from './osm-italska-junction-smoothing-5255.js';
import {ITALSKA_STRIP_SAFETY_5256 as C,pointInsideItalskaStrip5256,
 inspectItalskaStripCoverage5256,inspectItalskaRenderedTurnSafety5256}
 from './osm-italska-rendered-strip-safety-5256.js';
const source=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const els=JSON.parse(source).elements,find=id=>els.find(x=>x.id===id);
const plan=planItalskaRoadSidewalk5252({regionId:'mlada',
 road:find(8590284),sidewalk:find(1484073943),defaultWidth:7.8});
assert(plan);
const xy=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 y:-p.lat*111320});
function build(id){
 const g=find(id).geometry;
 return g.slice(1).map((p,i)=>{
  const a=xy(g[i]),b=xy(p);
  return {osmId:id,kind:'residential',a,b,width:id===8590284?5:7.8,
   len:Math.hypot(b.x-a.x,b.y-a.y),oneway:0};
 }).filter(s=>s.len>=2.5&&s.len<=175);
}
const narrow=build(8590284),named=[...build(8585601),...build(1107814416)];
const all=[...narrow,...named];
assert.equal(narrow.length,8);
assert.equal(C.orientationSamples,31);
assert.equal(C.bodyLength,5.08);
assert(Math.abs(C.bodyWidth-2.0872)<1e-6);
const rect={osmId:8590284,kind:'residential',a:{x:0,y:0},
 b:{x:10,y:0},len:10,width:5};
assert(pointInsideItalskaStrip5256(4,0,rect));
assert(pointInsideItalskaStrip5256(10,2.5,rect));
assert(!pointInsideItalskaStrip5256(10.05,0,rect),
 'Unlike rounded centreline buffers, rectangular asphalt has NO end cap');
assert(!pointInsideItalskaStrip5256(4,2.51,rect));
assert(!pointInsideItalskaStrip5256(-.01,0,rect));
assert(!pointInsideItalskaStrip5256(4,0,{...rect,width:7.8}),
 'Source-specific strip width must fail closed');
const summary=inspectItalskaRenderedTurnSafety5256({roadPlan:plan,segments:all});
assert.equal(summary.ready,true,JSON.stringify(summary));
assert.equal(summary.mappedOutboundTurnArms,4);
assert(summary.planarStripAccepted>=1&&summary.planarStripAccepted<4,
 JSON.stringify(summary));
assert.equal(summary.planarStripRejected,4-summary.planarStripAccepted);
assert(summary.checkedBodyPoints>1000);
assert.equal(summary.newRoadMeshes,0);
assert.equal(summary.roadTriangleRaycastNotPerformed,true);
assert.equal(summary.DEMHeightNotChecked,true);
let sourceArms=0,meshAllowed=0,meshRejected=0;
for(const from of [narrow[0],narrow.at(-1)])for(const fromDirection of [-1,1]){
 const node=fromDirection===1?from.b:from.a;
 for(const to of named)for(const toDirection of [-1,1]){
  const start=toDirection===1?to.a:to.b;
  if(Math.hypot(node.x-start.x,node.y-start.y)>.05)continue;
  sourceArms++;
  const opts={roadPlan:plan,from,fromDirection,to,toDirection,
   car:{driven:false,parked:false,wideModel5254:false}};
  const old=planItalskaNpcTurn5255(opts);
  assert(old,'Baseline 5.255 accepts all four rounded-buffer turns');
  const oldReport=inspectItalskaStripCoverage5256({
   roadPlan:plan,segments:all,turn:old});
  assert(oldReport.checkedPoints>=1705);
  const newPlan=planItalskaNpcTurn5255({...opts,
   candidateGate:turn=>inspectItalskaStripCoverage5256({
    roadPlan:plan,segments:all,turn}).safe});
  if(newPlan){
   meshAllowed++;
   const report=inspectItalskaStripCoverage5256({
    roadPlan:plan,segments:all,turn:newPlan});
   assert.equal(report.safe,true);
   assert.equal(report.outsidePoints,0);
   assert.equal(inspectItalskaStripCoverage5256({
    roadPlan:{...plan,roadGeometryHash:'changed'},segments:all,
    turn:newPlan}).safe,false);
   assert.equal(inspectItalskaStripCoverage5256({
    roadPlan:plan,segments:all.filter(s=>s!==to),
    turn:newPlan}).safe,false);
  }else{
   meshRejected++;
   assert.equal(oldReport.safe,false,
    'Rejected turns must demonstrably leave the bounded rectangles');
  }
 }
}
assert.equal(sourceArms,4);
assert.equal(meshAllowed,summary.planarStripAccepted);
assert.equal(meshRejected,summary.planarStripRejected);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),source);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 'osm-italska-rendered-strip-safety-5256.js?v=525600',
 'candidateGate:attempt=>inspectItalskaStripCoverage5256({',
 'window.__miloviceItalskaRenderedTurnRuntime5256=()=>'
])assert(html.includes(token),'Missing actual 5.256 game gate '+token);
// Fail-closed linkage with the ORIGINAL actual Three.js road-rectangle
// constructor. A future mesh topology change needs a fresh road QA.
for(const token of ['function osmStrip(a,b,width,material,y=.15){',
 'const nx=-dz/len,nz=dx/len,vertices=[],uvs=[],indices=[];',
 'const u=j/across,xx=cx+nx*(u-.5)*width,zz=cz+nz*(u-.5)*width;',
 'osmStrip(a,b,width,osmRoadMaterial,.17);'])
 assert(html.includes(token),'Road-strip model changed, inspect 5.256 safety '+token);
console.log('PASS 5.256: '+meshAllowed+'/4 former smooth NPC turns stay within tested rectangular OSM road strips, '+meshRejected+' fall back; no asphalt mesh added');
