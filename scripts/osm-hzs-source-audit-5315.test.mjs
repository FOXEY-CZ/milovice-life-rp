import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditHZS5315 as audit} from './osm-hzs-source-audit-5315.js';
for(const region of ['mlada','westlink']){
 const {elements}=JSON.parse(readFileSync(new URL('../data/regions/'+region+'.json',import.meta.url),'utf8'));
 const r=audit(elements);assert(r);assert.equal(r.siteIsBuilding,false);assert.equal(r.buildingLevels,2);
 assert.deepEqual(r.access.map(a=>a.allowed),[false,false,true]);
 assert.equal(r.facadeSurveyed,false);assert.equal(r.physicalAccessVerified,false);
 assert.equal(r.newGeometry,0);assert.equal(r.newRoads,0);assert.equal(r.newColliders,0);
 const changed=elements.map(e=>e.id===1249890275?{...e,tags:{...e.tags,access:'yes'}}:e);
 assert.equal(audit(changed),null);
 assert.equal(audit(elements.filter(e=>e.id!==985224523)),null);
 const moved=elements.map(e=>e.id===985224523?{...e,geometry:e.geometry.map((p,i)=>i===0?{...p,lat:p.lat+.00001}:p)}:e);
 assert.equal(audit(moved),null);
}
console.log('PASS 5.315 HZS source identities and existing civilian NPC access policy');
