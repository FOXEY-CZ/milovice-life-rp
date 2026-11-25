import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scenario,compareJuventaSectionScenarios5314 as compare} from './osm-juventa-local-section-5314.js';
import {JUVENTA_SECTION_5311 as S} from './osm-juventa-section-5311.js';
const a=scenario(217,.5);
assert.equal(a.elevations.landing.nominal,217.94);
assert.equal(a.elevations.roofParapet.nominal,233.41);
assert.equal(a.elevations.roofParapet.min,232.91);
assert.equal(a.elevations.roofParapet.max,233.91);
assert.equal(a.elevations.firstFloor.nominal-a.elevations.lowerTerrain.nominal>0,true);
assert.equal(Math.round((a.elevations.roofParapet.nominal-a.elevations.firstFloor.nominal)*100)/100,Math.round((S.roofParapet-S.floorLevels[0])*100)/100);
for(const args of [[NaN,0],[217,-1],[217,Infinity],[1e308,0]])assert.equal(scenario(...args),null);
const read=p=>JSON.parse(readFileSync(new URL('../data/'+p,import.meta.url),'utf8'));
const oldGrid=read('milovice-terrain.json');
const regionalGrids=['mlada','westlink'].map(id=>read('regions/terrain-'+id+'.json'));
for(const regionId of ['mlada','westlink']){
 const school=read('regions/'+regionId+'.json').elements.find(w=>String(w.id)==='53865836');
 const input={...school,regionId};
 const result=compare(input,{oldGrid,regionalGrids});
 assert(result);assert.equal(result.sourceHash,'be655146');
 assert.deepEqual(result.anchorNodeIndices,[47,48,49,50,51]);
 assert.equal(result.variants.length,2);
 assert(result.anchorRange[0]>=216.8&&result.anchorRange[1]<=217.5);
 assert.equal(result.hypotheticalElevationRanges.lowerTerrain[0],result.anchorRange[0]);
 assert.equal(result.hypotheticalElevationRanges.lowerTerrain[1],result.anchorRange[1]);
 for(const v of result.variants){
  assert(v.existingFoundation>v.anchorRange[1]);
  assert.equal(v.lowerScenario.readyForGeometry,false);
  assert.equal(v.upperScenario.readyForGeometry,false);
 }
 for(const k of ['rangeIsConfidenceInterval','anchorIsVerifiedEntrance','worldDatumVerified','readyForGeometry'])assert.equal(result[k],false);
 assert.equal(result.newGeometry,0);assert.equal(result.newColliders,0);
 assert.equal(compare({...input,id:0},{oldGrid,regionalGrids}),null);
 assert.equal(compare(input,{oldGrid,regionalGrids:[regionalGrids[0]]}),null);
}
console.log('PASS 5.314 hypothetical section ranges, both stored DEMs and geometry safety gates');
