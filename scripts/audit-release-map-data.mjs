import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const root=process.argv[2];assert.ok(root,'Usage: audit-release-map-data.mjs <stage>');
const read=p=>JSON.parse(readFileSync(join(root,p),'utf8'));
const pairs=[{"osm":"data/milovice-osm.json","dem":"data/milovice-terrain.json","step":10},{"osm":"data/regions/mlada.json","dem":"data/regions/terrain-mlada.json","step":20},{"osm":"data/regions/vrutice.json","dem":"data/regions/terrain-vrutice.json","step":20},{"osm":"data/regions/westlink.json","dem":"data/regions/terrain-westlink.json","step":20},{"osm":"data/regions/centerlink.json","dem":"data/regions/terrain-centerlink.json","step":20},{"osm":"data/regions/bozidar.json","dem":"data/regions/terrain-bozidar.json","step":20}];
const page=readFileSync(join(root,'credits.html'),'utf8');
for(const {osm,dem,step} of pairs){
 const map=read(osm),terrain=read(dem);
 assert.match(map.attribution,/OpenStreetMap.*ODbL/i);assert.equal(map.source,'OpenStreetMap API');assert.ok(Array.isArray(map.elements)&&map.elements.length);
 assert.match(terrain.source,/DMR 4G/);assert.equal(terrain.license,'CC BY 4.0');assert.equal(terrain.step,step);assert.match(terrain.credit,/ČÚZK/);
 for(const p of [osm,dem])assert.ok(page.includes('href="./'+p+'"'),'Missing download link: '+p);
}
assert.match(read('data/rebuild2-street-inventory.json').attribution,/OpenStreetMap.*ODbL/i);
assert.ok(page.includes('href="./data/rebuild2-street-inventory.json"'));
for(const p of ["data/architecture-references.json","data/architecture/building-audit-queue.json","data/architecture/building-work-progress.json","data/architecture/verified-buildings.json"])assert.equal(existsSync(join(root,p)),false,'Development data leaked: '+p);
console.log('PASS six OSM snapshots, six DMR grids, street inventory, download links and four excluded files');
