import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155,TOPOLOVA_ROW_5155 as S}
 from './osm-topolova-panel-row-5155.js';
import {planRUIANResidentialSharedWalls}
 from './osm-ruian-party-walls-5133.js';
const data=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const ways=data.filter(x=>x.tags?.building&&x.geometry);
const source=JSON.stringify(ways);
const plan=planTopolovaPanelRow5155({regionId:'mlada',ways});
assert(plan);
assert.equal(plan.contiguousExactSharedPartyWalls,4);
assert.deepEqual(plan.houseNumbers,[614,615,616,617,618]);
assert.equal(plan.sourceRUIANId,'22968105');
assert.equal(plan.originalOSMLevelTag,'1');
assert.equal(plan.visualAboveGroundLevels,5);
assert.equal(plan.allFiveCSUVerifiedAboveGround,true);
assert.equal(plan.sourceCSUPanelWalls,true);
assert.equal(plan.visualHeightMeters,15.25);
assert.equal(plan.previousVisualHeightMeters,3.05);
assert.equal(plan.visualCorrectedBuildings,1);
for(const k of ['newBuildings','newFootways','newRoads','newEntries',
 'newParking','newTrees','newLamps','newColliders'])assert.equal(plan[k],0);
for(const change of [
 {regionId:'old'}, {ways:ways.filter(w=>String(w.id)!==S.correctedID)},
 {ways:ways.map(w=>String(w.id)===S.correctedID?
   {...w,tags:{...w.tags,'building:levels':'5'}}:w)},
 {ways:ways.map(w=>String(w.id)===S.correctedID?
   {...w,geometry:w.geometry.map((p,i)=>i===2?
     {...p,lat:p.lat+.0000001}:p)}:w)},
 {ways:ways.map(w=>String(w.id)==='61979139'?
   {...w,tags:{...w.tags,'ref:ruian:building':'bad'}}:w)}
])assert.equal(planTopolovaPanelRow5155({
 regionId:'mlada',ways,...change}),null);
const project=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const rows=ways.map(w=>({id:w.id,tags:w.tags,points:w.geometry.map(project)}));
const oldParty=planRUIANResidentialSharedWalls({regionId:'mlada',buildings:rows});
assert.equal(oldParty.sourceSharedWallCount,28);
assert(!oldParty.edgeMap[S.correctedID],
 'Stale OSM 1-floor tag must NOT pass the old full-height party-wall guard');
const visualRows=rows.map(w=>String(w.id)===plan.sourceOSMId?
 {...w,tags:{...w.tags,'building:levels':String(plan.visualAboveGroundLevels)}}:w);
const newParty=planRUIANResidentialSharedWalls({regionId:'mlada',buildings:visualRows});
assert.equal(newParty.sourceSharedWallCount,29);
assert.equal(newParty.internalFacadeEdgesToSkip,58);
assert.deepEqual(newParty.edgeMap[S.correctedID],[0]);
const join=newParty.joins.find(j=>j.buildingIds.includes(S.correctedID));
assert(join&&join.buildingIds.includes('61979139'));
assert.equal(JSON.stringify(ways),source,
 'No OSM GPS or building:levels tags were changed');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const str of [
 "from './scripts/osm-topolova-panel-row-5155.js?v=515500'",
 'const topolovaRow5155=planTopolovaPanelRow5155({',
 'if(topolovaRowCorrection)floors=topolovaRow5155.visualAboveGroundLevels;',
 "'building:levels':String(topolovaRow5155.visualAboveGroundLevels)",
 'window.__miloviceTopolovaRowRuntime=()=>{',
 "'topolova-panel-row-5155':{"
])assert(html.includes(str),'Missing Topolova visual-only correction '+str);
console.log('PASS 5.155 official 5 ABOVE-ground floors and 4 shared walls of Topolova 614–618; OSM unchanged');
