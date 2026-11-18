// Milovice RP 5.140 — nine original 8–9-floor RÚIAN buildings.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SPORTOVNI_RUIAN_5140,planSportovniRUIANPanel}
 from './osm-sportovni-ruian-panels-5140.js';
import {planMladaPanelEdge} from './osm-mlada-residential-5105.js';
const d=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const elements=d.elements;
const source=SPORTOVNI_RUIAN_5140.buildings;
assert.equal(source.length,9);
assert.equal(new Set(source.map(s=>s.id)).size,9);
assert.deepEqual(source.map(s=>Number(s.levels)).sort(),[8,8,8,8,8,8,9,9,9]);
let floors=0,flats=0,totalEdges=0;
for(const spec of source){
 const way=elements.find(w=>String(w.id)===spec.id);
 assert(way&&way.tags.source==='cuzk:ruian');
 const opts={id:way.id,regionId:'mlada',tags:way.tags,geometry:way.geometry,
  height:Number(way.tags['building:levels'])*3.05};
 const plan=planSportovniRUIANPanel(opts);
 assert(plan,'Must match the source fingerprint: '+spec.id);
 assert.equal(plan.version,'5.140');
 assert.equal(plan.sourceOSMVertices,spec.vertices);
 assert.equal(plan.sourceRUIANId,spec.ruian);
 assert.equal(plan.floors,Number(spec.levels));
 assert.equal(plan.flats,Number(spec.flats));
 assert.equal(plan.sourceGeometryExactlyMatched,true);
 assert.equal(plan.photographedFacade,false);
 assert.equal(plan.roofShapeChanged,false);
 assert.equal(plan.footprintChanged,false);
 for(const key of ['newBuildings','newWindows','newBalconies',
  'newEntrances','newRoofs','newColliders'])assert.equal(plan[key],0);
 floors+=plan.floors;flats+=plan.flats;
 const cos=Math.cos(50.23*Math.PI/180);
 const geo=way.geometry;
 for(let i=1;i<geo.length;i++){
  const a=geo[i-1],b=geo[i],len=Math.hypot((a.lat-b.lat)*111194,
   (a.lon-b.lon)*111194*cos);
  const edge=planMladaPanelEdge(plan,len,3.2);
  if(!edge)continue;
  totalEdges++;
  assert.equal(edge.floorCourses.length,plan.floors-1);
  assert.equal(edge.duplicatedFloorSeams,0);
  assert(edge.verticalSeams.length===Math.max(0,edge.windowBays-1));
  assert(edge.floorCourses.every((x,i)=>Math.abs(x.height-(i+1)*3.05)<1e-6));
 }
 for(let i=0;i<geo.length;i++){
  const altered=geo.map((p,j)=>j===i?{...p,lat:p.lat+.0000002}:p);
  assert.equal(planSportovniRUIANPanel({...opts,geometry:altered}),null,
   'Moved source geometry must fail closed for every vertex '+spec.id+':'+i);
 }
 for(const changes of [
  {regionId:'old'},{photoReviewed:true},{approvedArchitecture:true},
  {height:opts.height+2},
  {tags:{...way.tags,'building:levels':'4'}},
  {tags:{...way.tags,'building:flats':'999'}},
  {tags:{...way.tags,source:'manual'}},
  {geometry:geo.slice(0,-1)}
 ]){
  assert.equal(planSportovniRUIANPanel({...opts,...changes}),null,
   'Unverified block changes must be rejected: '+spec.id);
 }
}
assert.equal(floors,75);
assert.equal(flats,416);
assert(totalEdges>=35);
assert.equal(planSportovniRUIANPanel({id:0,regionId:'mlada'}),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-sportovni-ruian-panels-5140.js?v=514000'",
 'const sportovniPanel=regionalStyle?planSportovniRUIANPanel({',
 'estatePlan?.version===\'5.140\'?',
 'window.__miloviceSportovniResidentialAudit={',
 'window.__miloviceSportovniResidentialRuntime=()=>{',
 "'sportovni-panel-houses-5140':{",
 'streetAudit=sportovni-panel-houses-5140',
 'planMladaPanelEdge(\n   estatePlan,len,regionalStyle?.baySpacing??3.12)'
])assert(html.includes(token),'Missing real 5.140 render integration: '+token);
console.log('PASS 5.140 source-verified 9 Sportovní/Průběžná residential panels, 75 storeys and 416 mapped flats,',totalEdges,'actual edge checks');
