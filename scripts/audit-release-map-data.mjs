import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join,posix} from 'node:path';
import {REGION_NAMES} from './fictional-identity.js';
import {parseApprovedArchitectureManifest} from './architecture-manifest.js';
const root=process.argv[2];assert.ok(root,'Usage: audit-release-map-data.mjs <stage>');
const read=p=>JSON.parse(readFileSync(join(root,p),'utf8'));
const pairs=[{"osm":"data/milovice-osm.json","dem":"data/milovice-terrain.json","step":10},{"osm":"data/regions/mlada.json","dem":"data/regions/terrain-mlada.json","step":20},{"osm":"data/regions/vrutice.json","dem":"data/regions/terrain-vrutice.json","step":20},{"osm":"data/regions/westlink.json","dem":"data/regions/terrain-westlink.json","step":20},{"osm":"data/regions/centerlink.json","dem":"data/regions/terrain-centerlink.json","step":20},{"osm":"data/regions/bozidar.json","dem":"data/regions/terrain-bozidar.json","step":20}];
const page=readFileSync(join(root,'credits.html'),'utf8');
for(const url of ['https://geoportal.gov.cz/php/micka/record/basic/CZ-CUZK-DMR4G-V','https://geoportal.gov.cz/php/micka/record/basic/CZ-CUZK-AGS-DMR4G','https://creativecommons.org/licenses/by/4.0/','https://geoportal.cuzk.gov.cz/Dokumenty/Podminky.pdf'])assert.ok(page.includes('href="'+url+'"'),'Missing DMR source/license link: '+url);
assert.ok(page.includes('relativní výšky v decimetrech'),'Missing DMR modification notice');
assert.ok(page.includes('Herní výškové soubory mají v historii projektu datum 12. 11. 2026.'),'Missing project history date');
assert.ok(page.includes('Datum poslední aktualizace původních dat poskytovatele není doloženo'),'Missing upstream date caveat');
assert.ok(page.includes('před konečnou distribucí zbývá ověřit datovou atribuci'),'Missing unresolved attribution notice');
const index=read('data/regions/index.json');
const ids=['old','mlada','vrutice','westlink','centerlink','bozidar'];
assert.ok(Array.isArray(index.regions));
assert.equal(index.regions.length,ids.length);
assert.deepEqual(index.regions.map(r=>r.id).sort(),[...ids].sort());
const section=page.match(/<details id="map-data-notices">([\s\S]*?)<\/details>/);
assert.ok(section,'Missing map data notices');
for(const [i,id] of ids.entries()){
 const region=index.regions.find(r=>r.id===id),{osm,dem}=pairs[i];
 assert.equal(region.file,posix.relative('data/regions',osm),'Region OSM path: '+id);
 assert.equal(region.terrain,posix.relative('data/regions',dem),'Region terrain path: '+id);
 assert.ok(Object.hasOwn(REGION_NAMES,id),'Missing fictional label: '+id);
 const row='<li>'+REGION_NAMES[id]+': <a href="./'+osm+'" download>OSM JSON</a> · <a href="./'+dem+'" download>DMR JSON</a></li>';
 assert.equal(section[1].split(row).length,2,'Missing or duplicate district data row: '+id);
}

for(const {osm,dem,step} of pairs){
 const map=read(osm),terrain=read(dem);
 assert.match(map.attribution,/OpenStreetMap.*ODbL/i);assert.equal(map.source,'OpenStreetMap API');assert.ok(Array.isArray(map.elements)&&map.elements.length);
 assert.match(terrain.source,/DMR 4G/);assert.equal(terrain.license,'CC BY 4.0');assert.equal(terrain.step,step);assert.match(terrain.credit,/ČÚZK/);
 for(const p of [osm,dem])assert.ok(page.includes('href="./'+p+'"'),'Missing download link: '+p);
}
const projection=read('data/osm-street-groups.json');
assert.deepEqual(Object.keys(projection).sort(),['schema','sourceRevision','attribution','declaredDataLicense','review','description','summary','groups'].sort());
assert.equal(projection.schema,1);
assert.match(projection.sourceRevision,/^[a-f0-9]{40}$/);
assert.equal(projection.attribution,'© OpenStreetMap contributors');
assert.equal(projection.declaredDataLicense,'https://opendatacommons.org/licenses/odbl/1-0/');
assert.equal(projection.review,'pending; not a legal scope determination');
const sources=new Map(ids.map((id,i)=>[id,read(pairs[i].osm).elements]));
const sourceIds=new Map([...sources].map(([id,elements])=>[id,new Set(elements.map(e=>e.type+':'+e.id))]));
const sourceNames=new Map([...sources].map(([id,elements])=>[id,new Set(elements.flatMap(e=>[e.tags?.['addr:street'],e.tags?.highway?e.tags.name:null].filter(Boolean)))]));
const union=new Set([...sourceIds.values()].flatMap(s=>[...s])),seen=new Set();
const categories=['buildings','roads','walkways','railway','landscape','publicObjects','utilities','other'];
for(const g of projection.groups){
 assert.deepEqual(Object.keys(g).sort(),['mapped','region','street']);
 assert.ok(sourceIds.has(g.region),'Unknown group region');
 assert.ok(g.street===null||sourceNames.get(g.region).has(g.street),'Unknown group label');
 assert.deepEqual(Object.keys(g.mapped).sort(),[...categories].sort());
 for(const key of Object.values(g.mapped).flat()){
  assert.ok(sourceIds.get(g.region).has(key)&&!seen.has(key),'Missing or duplicate group ID: '+key);
  seen.add(key);
 }
}
assert.deepEqual(seen,union);
assert.deepEqual(projection.summary,{rawRecords:[...sources.values()].reduce((n,e)=>n+e.length,0),uniqueMappedWays:union.size,groups:projection.groups.length});
assert.ok(page.includes('href="./data/osm-street-groups.json"'));
assert.ok(!page.includes('rebuild2-street-inventory.json'));
for(const p of ["data/architecture-references.json","data/architecture/building-audit-queue.json","data/architecture/building-work-progress.json","data/rebuild2-street-inventory.json"])assert.equal(existsSync(join(root,p)),false,'Development data leaked: '+p);
const verified=parseApprovedArchitectureManifest(read('data/architecture/verified-buildings.json'));
assert.ok(verified.size>0,'No published architecture revisions');
console.log('PASS six OSM snapshots, six DMR grids, region index, fictional district labels, street inventory, download links, four excluded files and '+verified.size+' published architecture records');
