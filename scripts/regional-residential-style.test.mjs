// Milovice RP 5.93 — five-region architectural upgrade test.
// Source data remain actual OSM exports. No screenshot can certify private facades.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planRegionalBuildingStyle,stableOsmBuildingHash,TARGET_REGIONS}
 from './regional-residential-style.js';
import {exteriorFacadeFrame,facadePoint,flushBoxOffset,
 splitFacadeStripForOpening} from './facade-anchors.js';
import {makeStreetFrontageIndex} from './street-frontage-index.js';

const baseline={id:53865763,tags:{building:'house','building:levels':'2'},
 width:12.6,depth:9.1,floors:2,regionId:'mlada'};
const a=planRegionalBuildingStyle(baseline);
assert(a&&a.inferred&&!a.photographicallyVerified);
assert.deepEqual(a,planRegionalBuildingStyle({...baseline}),
 'Building style must never depend on import order or session randomness');
assert.equal(a.addPlinth,true);
assert.equal(planRegionalBuildingStyle({...baseline,photoReviewed:true}),null);
assert.equal(planRegionalBuildingStyle({...baseline,approvedArchitecture:true}),null);
assert.equal(planRegionalBuildingStyle({...baseline,regionId:'old'}),null);
for(const regionId of ['westlink','centerlink','bozidar'])
 assert(planRegionalBuildingStyle({...baseline,regionId}),regionId+' must be supported');
assert.equal(planRegionalBuildingStyle({...baseline,tags:{building:'garage'}}),null);
assert.equal(planRegionalBuildingStyle({...baseline,tags:{building:'warehouse'}}),null);
assert.equal(planRegionalBuildingStyle({...baseline,tags:{building:'yes'}}).profile,'generic');
assert.equal(planRegionalBuildingStyle({
 ...baseline,tags:{building:'house','roof:shape':'flat'}}).mappedRoofKind,'flat');
assert.equal(planRegionalBuildingStyle({
 ...baseline,tags:{building:'house','roof:shape':'gabled'}}).mappedRoofKind,'gable');
assert.equal(planRegionalBuildingStyle({
 ...baseline,tags:{building:'house','roof:shape':'unknown'}}).mappedRoofKind,null);
assert.notEqual(stableOsmBuildingHash('53865763'),stableOsmBuildingHash('53865764'));

const house=[{x:0,y:0},{x:12,y:0},{x:12,y:8},{x:0,y:8}];
const roads=makeStreetFrontageIndex();
roads.addRoad({kind:'residential',osmId:123,width:7.8,
 points:[{x:-40,y:-11},{x:40,y:-11}]});
const front=roads.select(house);
assert(front&&front.index===0,'Select mapped street-facing frontage');
const frame=exteriorFacadeFrame(house,front.index);
const strips=splitFacadeStripForOpening(frame,{along:0,width:1.48,padding:.09});
assert.equal(strips.length,2,'Plinth must not cover a street-facing door');
for(const piece of strips){
 const endLeft=piece.along-piece.width/2;
 const endRight=piece.along+piece.width/2;
 assert(endRight<=-.74-.09+1e-8||endLeft>=.74+.09-1e-8,
  'Door must have an uninterrupted threshold');
 const p=facadePoint(frame,piece.along,flushBoxOffset(.10));
 assert(Number.isFinite(p.x)&&Number.isFinite(p.z));
}
const closedWall=exteriorFacadeFrame(house,2);
assert(closedWall,'The rear wall remains a physical mapped wall');
assert.equal(front.photographicallyVerified,false);

const cosine=Math.cos(50.226*Math.PI/180);
const xy=p=>({x:(p.lon-14.889)*111320*cosine,
 y:-(p.lat-50.226)*111320});
let totalStyled=0;
const regionThresholds={mlada:{models:800,plinth:400},vrutice:{models:400,plinth:200},
 westlink:{models:620,plinth:300},centerlink:{models:165,plinth:45},
 bozidar:{models:45,plinth:1}};
assert.equal(TARGET_REGIONS.length,5);
for(const regionId of TARGET_REGIONS){
 const data=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8'));
 let selected=0,palette=new Set(),plinth=0,declaredRoofs=0;
 for(const feature of data.elements){
  if(!feature.tags?.building||!feature.geometry?.length)continue;
  const points=feature.geometry.map(xy);
  const xs=points.map(p=>p.x),zs=points.map(p=>p.y);
  const w=Math.max(...xs)-Math.min(...xs);
  const d=Math.max(...zs)-Math.min(...zs);
  if(w<2||d<2||w>140||d>140)continue;
  const levels=Number(feature.tags['building:levels']);
  const floors=Number.isFinite(levels)&&levels>0?Math.min(levels,16):2;
  const plan=planRegionalBuildingStyle({
   regionId,id:feature.id,tags:feature.tags,width:w,depth:d,floors});
  if(!plan)continue;
  selected++;totalStyled++;
  palette.add(plan.facadeIndex);
  if(plan.addPlinth)plinth++;
  if(plan.mappedRoofKind)declaredRoofs++;
  assert(plan.facadeIndex>=0&&plan.facadeIndex<8);
  assert(plan.panelIndex>=0&&plan.panelIndex<7);
  assert(plan.roofIndex>=0&&plan.roofIndex<5);
  assert(plan.baySpacing>=3&&plan.baySpacing<=4.3);
  assert(!plan.footprintChanged&&!plan.roadGeometryChanged&&!plan.roofGeometryChanged);
  assert.equal(plan.extraMaterialKinds,0);
 }
 assert(selected>=regionThresholds[regionId].models,
  regionId+': the OSM region must gain the expected ordinary building coverage');
 assert(palette.size>=7,'Facade styles must vary across the mapped area');
 assert(plinth>=regionThresholds[regionId].plinth,
  regionId+': mapped family homes must retain street-level details');
 console.log(regionId+' residential plan: '+selected+' OSM footprints, '+plinth+
  ' eligible masonry bases, '+declaredRoofs+' explicitly sourced roof tags');
}
assert(totalStyled>2250,'All five mapped districts must gain broad architectural styling');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes('planRegionalBuildingStyle({'),'The game must call the new planner');
assert(html.includes('rpAppendOSMElements(osm.elements,id);'),'Region ID must be preserved when streaming');
assert(html.includes('splitFacadeStripForOpening(facade,{along:0,width:1.48,padding:.09})'),
 'An inferred entrance must interrupt its own plinth');
assert(html.includes("archPart('foundationBand',anchor.x,"),
 'Architecture planner must actually produce geometry in the game');
assert(html.includes('regionId,id:osmId,tags,width:w,depth:d,floors'),
 'Never extrapolate stylized building locations without a real OSM footprint');
console.log('PASS Milovice RP 5.93: five-region buildings, roof tags, stable facades and door-safe plinths');
