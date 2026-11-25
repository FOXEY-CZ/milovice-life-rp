import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JUVENTA_SECTION_5311 as S,planJuventaSection5311 as plan} from './osm-juventa-section-5311.js';
assert.deepEqual(S.floorLevels,[.16,3.66,7.26,10.86]);
assert.equal(S.roofParapet,15.61);assert.equal(S.pdfPage,18);
assert.equal(S.photo.heading,98.62);assert.equal(S.photo.focalLength35mm,27);
for(const regionId of ['mlada','westlink']){
 const data=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8'));
 const school=data.elements.find(w=>String(w.id)==='53865836');
 const p=plan({...school,regionId});
 assert(p);assert.equal(p.candidateEdge,47);
 assert.deepEqual(p.floorRise,[3.5,3.6,3.6]);
 assert.equal(p.canopySlabThickness,.2);assert.equal(p.canopyParapetAboveSlab,.9);
 assert.equal(p.roofParapetAboveFirstFloor,15.45);
 for(const key of ['objectToEdgeVerified','worldDatumVerified','entranceWidthVerified','photoDestinationIsEntrance','readyForGeometry'])assert.equal(p[key],false);
 assert.equal(p.newGeometry,0);assert.equal(p.newColliders,0);
 assert.equal(plan({...school,regionId,id:0}),null);
}
console.log('PASS 5.311 section datum and geometry safety gates');
