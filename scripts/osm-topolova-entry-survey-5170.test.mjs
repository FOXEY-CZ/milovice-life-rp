import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaContinuousHip5160} from './osm-topolova-continuous-hip-5160.js';
import {planTopolovaEstimatedFacades5161} from './osm-topolova-estimated-facades-5161.js';
import {planTopolovaEntrySurvey5170,inspectTopolovaEntryGrade5170}
 from './osm-topolova-entry-survey-5170.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements.filter(e=>e.tags?.building&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways});
const hipPlan=planTopolovaContinuousHip5160({regionId:'mlada',rowPlan,ways});
const inferredPlan=planTopolovaEstimatedFacades5161({regionId:'mlada',
 rowPlan,hipPlan,ways});
assert(rowPlan&&hipPlan&&inferredPlan);
const args={regionId:'mlada',rowPlan,inferredPlan,ways};
const plan=planTopolovaEntrySurvey5170(args);
assert(plan,'all three actual RUIAN buildings must give six OSM facade views');
assert.equal(plan.version,'5.170');
assert.deepEqual(plan.sourceHouseNumbers,[616,617,618]);
assert.deepEqual(plan.sourceBuildingIds,['61979144','61979139','61979145']);
assert.deepEqual(plan.sourceRUIANIds,['22968083','22968091','22968105']);
assert.equal(plan.cameraCount,6);
assert.equal(plan.realSourceLongFacades,6);
assert.deepEqual(plan.views.map(v=>v.address),[616,616,617,617,618,618]);
assert.deepEqual(plan.views.map(v=>v.side),['east','west','east','west','east','west']);
assert.deepEqual(plan.views.map(v=>v.edge),[1,3,1,3,1,3]);
assert.deepEqual(plan.views.map(v=>v.heading),[270,90,270,90,270,90]);
assert(plan.views.every(v=>v.length>=15.8&&v.length<=16.4));
assert.equal(plan.exactRealEntrancesUnverified,true);
assert.equal(plan.allTargetsOnOriginalOSMWalls,true);
for(const [k,v] of Object.entries(plan))
 if(/^new[A-Z]/.test(k))assert.equal(v,0,k);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const terrainAt=(x,y)=>101.25+.0005*x-.0009*y;
const baseById=id=>({base:104.5,height:15.25,id});
const audit=inspectTopolovaEntryGrade5170(plan,{toWorld,terrainAt,baseById});
assert(audit,'6-source-wall DEM sample plan');
assert.equal(audit.terrainSamples,30);
assert.equal(audit.realSampledFacades,6);
assert.equal(audit.groundGradeProfiles.length,6);
assert(audit.lowestFoundationClearanceMetres>0);
assert(audit.worstFoundationClearanceMetres>=
 audit.lowestFoundationClearanceMetres);
for(const g of audit.groundGradeProfiles){
 assert.equal(g.samples.length,5);
 assert.deepEqual(g.samples.map(s=>s.fraction),[0,.25,.5,.75,1]);
 assert.equal(g.entryThresholdKnown,false);
 assert.equal(g.noPositionOfPhysicalDoorAssumed,true);
 assert(Number.isFinite(g.maxFoundationAboveTerrainMetres));
}
assert.equal(audit.proposedEntryPlatforms,0);
assert.equal(audit.newGeometry,0);
assert.equal(audit.actualDoorHeightUnverified,true);
assert.equal(audit.actualDoorSideUnverified,true);
for(const patch of [
 {regionId:'other'},
 {rowPlan:{...rowPlan,version:'5.140'}},
 {inferredPlan:{...inferredPlan,version:'5.160'}},
 {rowPlan:{...rowPlan,contiguousExactSharedPartyWalls:3}},
 {ways:ways.filter(w=>String(w.id)!=='61979144')},
 {ways:ways.map(w=>String(w.id)==='61979139'?
  {...w,geometry:w.geometry.map((p,i)=>i===2?{...p,lon:p.lon+.0000001}:p)}:w)},
 {ways:ways.map(w=>String(w.id)==='61979145'?
  {...w,tags:{...w.tags,'ref:ruian:building':'wrong'}}:w)}
])assert.equal(planTopolovaEntrySurvey5170({...args,...patch}),null,
 'fail closed on incomplete or changed source geometry');
assert.equal(inspectTopolovaEntryGrade5170(plan,{
 toWorld,terrainAt,baseById:()=>({base:0,height:3})}),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 raw,'original OSM never mutated');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const snippet of [
 "from './scripts/osm-topolova-entry-survey-5170.js?v=517000'",
 'const topolovaEntrySurveyPlan=planTopolovaEntrySurvey5170({',
 'window.__miloviceTopolovaEntrySurveyRuntime=()=>{',
 'inspectTopolovaEntryGrade5170(topolovaEntrySurveyPlan,{',
 'topolova-entry-617-east-5170',
 'topolova-grade-toggle',
 'topolova-grade-details',
 "topolovaGradeButton.addEventListener('click'",
 'audit.groundGradeProfiles.find',
 'Celý blok 616–618 (rozsahy základ–DEM)',
 'Skutečná strana, poloha a výška vstupu nejsou ověřené'
])assert(html.includes(snippet),'Missing browser integration '+snippet);
for(const v of plan.views){
 const id='topolova-entry-'+v.address+'-'+v.side+'-5170';
 assert(html.includes("'"+id+"':{"),'missing inspection camera '+id);
 assert(html.includes('camera:{lat:'+v.cameraGPS.lat+',lon:'+v.cameraGPS.lon+
  '},heading:'+v.heading),'camera coordinates must match original OSM '+id);
}
console.log('PASS 5.170: six RUIAN facade inspection cameras, all 30 DEM sampling positions, fail-closed GPS hashes; zero invented entries, no new 3D meshes');
