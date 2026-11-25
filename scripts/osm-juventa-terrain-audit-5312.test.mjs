import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditJuventaTerrain5312 as audit} from './osm-juventa-terrain-audit-5312.js';
const read=p=>JSON.parse(readFileSync(new URL('../data/'+p,import.meta.url),'utf8'));
const oldGrid=read('milovice-terrain.json'),regionalGrids=['mlada','westlink'].map(id=>read('regions/terrain-'+id+'.json'));
for(const regionId of ['mlada','westlink']){
 const school=read('regions/'+regionId+'.json').elements.find(w=>String(w.id)==='53865836');
 const result=audit({...school,regionId},{oldGrid,regionalGrids});
 assert(result);assert.equal(result.audits.length,2);
 const [m,w]=result.audits;
 assert.equal(m.perimeterSamples,292);assert.equal(w.perimeterSamples,292);
 assert(Math.abs(m.maxElevation-221.917)<.002);
 assert(Math.abs(w.maxElevation-221.894)<.002);
 assert(m.perimeterRelief>7.7&&m.perimeterRelief<7.8);
 assert(w.perimeterRelief>7.7&&w.perimeterRelief<7.8);
 assert.deepEqual(m.candidateNodeElevations,[217.239,217.390,217.081,216.880,217.244]);
 assert(m.foundationAboveCandidateRange[0]>4.6&&m.foundationAboveCandidateRange[1]<5.2);
 assert(result.maxCandidateGridDiscrepancy<.18);
 assert.equal(result.readyForGeometry,false);assert.equal(result.newGeometry,0);
 assert.equal(result.absoluteDatumOfSectionVerified,false);
 assert.equal(audit({...school,regionId,id:0},{oldGrid,regionalGrids}),null);
 assert.equal(audit({...school,regionId},{oldGrid,regionalGrids:[regionalGrids[0]]}),null);
}
console.log('PASS 5.312 source DEM terrain, foundation gap and regional grid comparison');

import {auditJuventaRuntimeFoundation5312 as runtime} from './osm-juventa-terrain-audit-5312.js';
import {insideElevationGrid,resolveTerrainHeight} from './terrain-elevation.js';
const school=read('regions/mlada.json').elements.find(w=>String(w.id)==='53865836');
const input={...school,regionId:'mlada'};
for(const order of [regionalGrids,[...regionalGrids].reverse()]){
 const offline=audit(input,{oldGrid,regionalGrids});
 const expected=offline.audits.find(a=>a.region===order[0].region);
 const terrainAt=(x,z)=>resolveTerrainHeight(x,z,oldGrid,order);
 const isCovered=(x,z)=>[oldGrid,...order].some(g=>insideElevationGrid(g,x,z));
 const opts={terrainAt,isCovered,referenceBase:oldGrid.base,
  baseHeight:expected.modelFoundationElevation-oldGrid.base,
  loadedRegionIds:order.map(g=>g.region)};
 const r=runtime(input,opts);
 assert(r);assert.equal(r.perimeterSamples,292);
 assert.equal(r.matchesCurrentFoundationPolicy,true);
 assert.equal(r.actualFoundationElevation,expected.modelFoundationElevation);
 assert.deepEqual(r.loadedRegionIds,opts.loadedRegionIds);
 assert(r.foundationAboveCandidateRange[0]>4.6&&r.foundationAboveCandidateRange[1]<5.3);
 assert.equal(r.fallbackUsed,false);assert.equal(r.readyForGeometry,false);
 assert.equal(runtime(input,{...opts,isCovered:()=>false}),null);
 assert.equal(runtime(input,{...opts,terrainAt:()=>NaN}),null);
 const shifted=runtime(input,{...opts,baseHeight:opts.baseHeight+.5});
 assert.equal(shifted.matchesCurrentFoundationPolicy,false);
 assert(Math.abs(shifted.foundationPolicyDelta-.5)<.002);
 assert.equal(shifted.readyForGeometry,false);
}
console.log('PASS 5.312 runtime foundation audit with both regional load orders and fail-closed coverage');
