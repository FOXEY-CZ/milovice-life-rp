import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaContinuousHip5160} from './osm-topolova-continuous-hip-5160.js';
import {planTopolovaEstimatedFacades5161} from './osm-topolova-estimated-facades-5161.js';
import {planTopolovaEndGables5169} from './osm-topolova-end-gables-5169.js';
const original=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(original).elements;
const ways=elements.filter(e=>e.tags?.building&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways});
const hipPlan=planTopolovaContinuousHip5160({regionId:'mlada',rowPlan,ways});
const inferredPlan=planTopolovaEstimatedFacades5161({regionId:'mlada',
 rowPlan,hipPlan,ways});
assert(rowPlan&&hipPlan&&inferredPlan);
const data={regionId:'mlada',rowPlan,hipPlan,inferredPlan,ways};
const plan=planTopolovaEndGables5169(data);
assert(plan,'real two end gables must match RUIAN');
assert.equal(plan.version,'5.169');
assert.deepEqual(plan.sourceOSMIds,rowPlan.sourceOSMIds);
assert.deepEqual(plan.clearedGables.map(x=>x.address),[614,618]);
assert.deepEqual(plan.clearedGables.map(x=>x.originalEdge),[1,2]);
assert.deepEqual(plan.blockedGenericEdgesById,{
 '61979151':[1],'61979145':[2]
});
assert(plan.clearedGables.every(x=>x.originalLengthMetres>11.3&&
 x.originalLengthMetres<11.9));
assert(plan.originalCadastralEndWallsPreserved);
assert(plan.originalSharedRoofPreserved);
assert(plan.requiresPhotosToModelEndOpenings);
assert(plan.exactEntrancePositionsUnknown);
assert.equal(plan.removedGenericRandomFacadeEdges,2);
for(const [k,v] of Object.entries(plan)){
 if(/^new[A-Z]/.test(k))assert.equal(v,0,k);
}
for(const row of inferredPlan.faces)
 assert(!plan.blockedGenericEdgesById[row.id]?.includes(row.edge),
  'source-matched 616-618 long facade cannot be erased');
const sourceIds=plan.clearedGables.map(x=>x.sourceOSMId);
const get=id=>ways.find(w=>String(w.id)===id);
for(const id of sourceIds){
 const gable=plan.clearedGables.find(x=>x.sourceOSMId===id);
 const geom=get(id).geometry;
 assert(geom[gable.originalEdge]&&geom[gable.originalEdge+1]);
}
const invalid=[
 {regionId:'old'},
 {rowPlan:{...rowPlan,version:'5.154'}},
 {hipPlan:{...hipPlan,fiveEntrySharedRoof:false}},
 {inferredPlan:{...inferredPlan,version:'5.160'}},
 {rowPlan:{...rowPlan,sourceOriginalGeometryHashes:[
  'bad',...rowPlan.sourceOriginalGeometryHashes.slice(1)]}},
 {ways:ways.filter(w=>String(w.id)!=='61979151')},
 {ways:ways.filter(w=>String(w.id)!=='61979145')},
 {ways:ways.map(w=>String(w.id)==='61979145'?
  {...w,geometry:w.geometry.map((p,i)=>i===2?
   {...p,lat:p.lat+.0000001}:p)}:w)},
 {ways:ways.map(w=>String(w.id)==='61979151'?
  {...w,tags:{...w.tags,'ref:ruian:building':'wrong'}}:w)},
 {ways:ways.map(w=>String(w.id)==='61979145'?
  {...w,geometry:w.geometry.slice().reverse()}:w)}
];
for(const patch of invalid)
 assert.equal(planTopolovaEndGables5169({...data,...patch}),null,
  'fail-closed when cadastral source drifts');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 original,'original OSM data immutable');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const p of [
 "from './scripts/osm-topolova-end-gables-5169.js?v=516900'",
 'const topolovaEndGablePlan=planTopolovaEndGables5169({',
 'window.__miloviceTopolovaGableAudit.genericEdgesSuppressed++;',
 'window.__miloviceTopolovaGableRuntime=()=>{',
 "'topolova-end-gables-5169':{"
])assert(html.includes(p),'5.169 browser integration '+p);
console.log('PASS 5.169: real cadastral end gables 614 + 618; exactly 2 unverified generic facade patterns removed, shared roof + 616-618 long facades retained, source locked; no new doors/roads');
