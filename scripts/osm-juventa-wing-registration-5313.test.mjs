import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planJuventaWingRegistration5313 as plan} from './osm-juventa-wing-registration-5313.js';
for(const regionId of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8')).elements;
 const school=ways.find(w=>String(w.id)==='53865836'),input={...school,regionId};
 const r=plan(input);assert(r);assert.equal(r.pdfPage,17);
 assert(r.pixelsPerMetre>3.19&&r.pixelsPerMetre<3.21);
 assert(r.maxControlResidualMetres>1.8&&r.maxControlResidualMetres<1.9);
 assert.equal(r.controls.length,4);assert.equal(r.edgeDistances.length,72);
 assert(r.candidateEdges.A.includes(47));assert(r.candidateEdges.A.includes(51));
 assert(r.candidateEdges.C.includes(33));assert(!r.candidateEdges.C.includes(47));
 assert([48,49,50].every(i=>!r.candidateEdges.A.includes(i)));
 assert.equal(r.candidateMasks.A.length,4);assert.equal(r.candidateMasks.C.length,4);
 for(const k of ['wholeEdgeAssignmentVerified','buildingPartitionVerified','entranceIdentityVerified','absoluteDatumVerified','readyForGeometry'])assert.equal(r[k],false);
 assert.equal(r.newGeometry,0);assert.equal(r.newColliders,0);
 assert.equal(plan({...input,id:0}),null);
}
console.log('PASS 5.313 approximate A/C image registration and explicit unverified geometry gates');
