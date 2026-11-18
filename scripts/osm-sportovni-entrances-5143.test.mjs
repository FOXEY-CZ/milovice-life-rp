// Source-protected 5.143 entrance clearance across nine mapped towers.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSportovniRUIANPanel,SPORTOVNI_RUIAN_5140}
 from './osm-sportovni-ruian-panels-5140.js';
import {planSportovniEntrancePlinth,sportovniEntryWindowConflict,
 SPORTOVNI_DOOR_TRIM_5143} from './osm-sportovni-entrances-5143.js';
import {exteriorFacadeFrame,facadePoint,flushBoxOffset}
 from './facade-anchors.js';

const elements=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
let checked=0;
for(const source of SPORTOVNI_RUIAN_5140.buildings){
 const way=elements.find(w=>String(w.id)===source.id);
 assert(way,'Source building absent: '+source.id);
 const before=JSON.stringify(way);
 const plan=planSportovniRUIANPanel({id:way.id,regionId:'mlada',
  tags:way.tags,geometry:way.geometry,height:Number(source.levels)*3.05});
 assert(plan);
 const points=way.geometry.map(toWorld);
 const face=exteriorFacadeFrame(points,0);
 assert(face&&face.len>=2.1);
 const p=planSportovniEntrancePlinth({
  plan,facade:face,entranceEdgeIndex:0});
 assert(p,'All nine geometrically matched RUIAN buildings must permit an unblocked entry plinth');
 assert.equal(p.sourceBuildingId,source.id);
 assert.equal(p.sourceRUIANId,source.ruian);
 assert.equal(p.parts.length,2);
 assert.equal(p.sourceOSMUnchanged,true);
 assert.equal(p.doorLocationPhotographed,false);
 assert.equal(p.inventedDoorCount,0);
 assert.equal(p.addedColliderCount,0);
 assert(Math.abs(p.openingWidth-1.89)<.00001);
 const pieces=p.parts.map(piece=>{
  const anchor=facadePoint(face,piece.along,flushBoxOffset(.15));
  assert(anchor&&Number.isFinite(anchor.x)&&Number.isFinite(anchor.z));
  const lo=piece.along-piece.width/2,hi=piece.along+piece.width/2;
  assert(hi<=-p.openingWidth/2+1e-7||
   lo>=p.openingWidth/2-1e-7,
   'The 1.30 m facade plinth cannot mask the door anymore');
  return piece;
 });
 assert(pieces.reduce((sum,x)=>sum+x.width,0)<face.len-1.88);
 assert.equal(planSportovniEntrancePlinth({
  plan,facade:face,entranceEdgeIndex:1}),null);
 assert.equal(planSportovniEntrancePlinth({
  plan:{...plan,sourceGeometryExactlyMatched:false},
  facade:face,entranceEdgeIndex:0}),null);
 assert.equal(planSportovniEntrancePlinth({
  plan:{...plan,id:'made-up'},facade:face,entranceEdgeIndex:0}),null);
 const wi={plan,entranceEdgeIndex:0,edgeIndex:0,
  edgeLength:face.len,floor:0};
 assert.equal(sportovniEntryWindowConflict({...wi,fraction:.5}),true);
 assert.equal(sportovniEntryWindowConflict({...wi,fraction:0}),false);
 assert.equal(sportovniEntryWindowConflict({...wi,edgeIndex:1,
  fraction:.5}),false);
 assert.equal(sportovniEntryWindowConflict({...wi,floor:1,fraction:.5}),false);
 assert.equal(JSON.stringify(way),before,'Must not rewrite mapped source geometry');
 checked++;
}
assert.equal(checked,SPORTOVNI_DOOR_TRIM_5143.sourceBuildingCount);
const sample=SPORTOVNI_RUIAN_5140.buildings[0];
const way=elements.find(w=>String(w.id)===sample.id);
const samplePlan=planSportovniRUIANPanel({id:way.id,regionId:'mlada',
 tags:way.tags,geometry:way.geometry,height:8*3.05});
const make=(f,l)=>sportovniEntryWindowConflict({plan:samplePlan,
 entranceEdgeIndex:2,edgeIndex:2,edgeLength:l,fraction:f,floor:0});
assert(make(.55,40)===false,'40m frontage must NOT lose extra windows 2m away');
assert(make(.52,40)===true,'40m frontage must reject nearby overlapping window');
assert(make(.4,12)===true,'On shorter faces, physical distance overrides fixed percentage');
assert(make(.4,40)===false);

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const snippet of [
 "from './scripts/osm-sportovni-entrances-5143.js?v=514300'",
 'const sourceDoorPlinth=estatePlan?.version===\'5.140\'?',
 'const parts=sourceDoorPlinth.parts;',
 'sportovniEntryWindowConflict({',
 'window.__miloviceSportovniEntrancesRuntime=()=>{',
 "'sportovni-entrances-5143':{",
 'streetAudit=sportovni-entrances-5143'
])assert(html.includes(snippet),'Missing live 5.143 plinth integration: '+snippet);
console.log('PASS 5.143: 9 exact source RUIAN tower frontages, 1.89m clear door plinth openings, no invented entrances or moved GPS');
