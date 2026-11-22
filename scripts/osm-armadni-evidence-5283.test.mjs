import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARMADNI_EVIDENCE_5283 as E,armadniEvidenceView5283 as view,mountArmadniEvidence5283 as mount} from './osm-armadni-evidence-5283.js';
import {ARMADNI_HOUSES_5282 as H,planArmadniHouses5282 as plan} from './osm-armadni-houses-5282.js';
assert.deepEqual(E.houses.map(h=>h.house),H.buildings.map(h=>h.house));
assert.deepEqual(E.houses.map(h=>h.osmId),H.buildings.map(h=>h.id));
assert.deepEqual(E.houses.map(h=>h.ruian),H.buildings.map(h=>h.ruian));
assert.deepEqual(E.project.houses,['890','891']);
assert.equal(E.project.kind,'project-concept-only');
assert(E.houses.every(h=>h.note.includes('ne')||h.note.includes('bez')));
for(const h of E.houses)if(h.link)assert(h.link.startsWith('https://'));
assert.equal(E.houses.filter(h=>h.link).length,3);
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
for(const h of E.houses){
 const w=JSON.parse(raw).elements.find(w=>String(w.id)===h.osmId);
 const p=plan({id:w.id,regionId:'mlada',tags:w.tags,geometry:w.geometry,modelFloors:4,modelHeight:12.2});
 assert(p,'original source geometry '+h.house);
 assert.equal(p.newBalconies,0);assert.equal(p.newColliders,0);
}
assert.equal(view('?streetAudit=armadni-houses-east-5282'),'armadni-houses-east-5282');
assert.equal(view('?streetAudit=armadni-houses-west-5282'),'armadni-houses-west-5282');
assert.equal(view('?streetAudit=armadni-houses-east-5283'),null);
assert.equal(view('?streetAudit=other'),null);
assert.equal(mount(null,'?streetAudit=armadni-houses-east-5282'),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const x of ["from './scripts/osm-armadni-evidence-5283.js?v=528300'","mountArmadniEvidence5283(document,location.search)","20261122-armadni-evidence-528300"])assert(html.includes(x),x);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
console.log('PASS 5.283 source linked audit panel without false real-world facade claims');
