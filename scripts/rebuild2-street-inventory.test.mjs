import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const plan=read('data/rebuild2-street-inventory.json');
assert.equal(plan.schema,'milovice-rp-rebuild2-streets-v1');
const paths=['data/milovice-osm.json','data/regions/mlada.json',
 'data/regions/vrutice.json','data/regions/westlink.json',
 'data/regions/centerlink.json','data/regions/bozidar.json'];
const uniq=new Set(),raw=[];
for(const path of paths)for(const e of read(path).elements){
 raw.push(e);uniq.add(e.type+':'+e.id);
}
assert.equal(plan.summary.rawRecords,raw.length);
assert.equal(plan.summary.uniqueMappedWays,uniq.size);
assert.equal(plan.summary.overlapRecords,raw.length-uniq.size);
assert.equal(uniq.size,3712);
const listed=plan.streets.flatMap(s=>plan.classes.flatMap(k=>s.mapped[k]));
assert.equal(listed.length,uniq.size,'Every mapped OSM feature must be in a street group or unmatched backlog');
assert.equal(new Set(listed).size,listed.length,'Overlapping regions must not double count ways');
assert(listed.every(id=>uniq.has(id)),'Invented OSM feature found');
assert.equal(plan.streets.length,78);
assert.equal(plan.streets.filter(s=>s.street===null).length,6);
assert.deepEqual(plan.streets.slice(0,4).map(s=>s.street),
 ['Nádražní','Školská','5. května','Mírová']);
assert.equal(plan.summary.categories.buildings,2120);
assert.equal(plan.summary.categories.roads+plan.summary.categories.walkways,1434);
assert.equal(plan.summary.categories.railway,16);
assert.equal(plan.mandatoryAudit.length,15);
assert(plan.streets.every(s=>!s.approved&&s.audited.length===0&&s.mandatoryAudit.length===15),
 'No street is finished merely because its OSM footprint exists');
const work=read('data/architecture/building-work-progress.json');
const ids=new Set(plan.streets.flatMap(s=>s.legacyWork.map(v=>v.osmId)));
for(const item of [...work.accepted,...work.worked])
 assert(ids.has(item.osmId),'All previously worked buildings, including church, must be in rebuild again');
assert(ids.has(118487991),'Church belongs in the new plan');
const ui=readFileSync(new URL('../rebuild.html',import.meta.url),'utf8');
assert(ui.includes('data/rebuild2-street-inventory.json'));
console.log('Rebuild 2.0 complete-street inventory PASS',JSON.stringify(plan.summary));
