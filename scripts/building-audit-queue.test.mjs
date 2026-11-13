import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const audit=JSON.parse(readFileSync(new URL('../data/architecture/building-audit-queue.json',import.meta.url),'utf8'));
const actual=osm.elements.filter(e=>e.tags?.building&&e.geometry?.length>=3);
const ids=new Set(actual.map(e=>e.id));
assert.equal(audit.schema,'milovice-rp-building-audit-v1');
assert.equal(audit.buildings,actual.length);
assert.equal(audit.entries.length,actual.length);
assert.equal(new Set(audit.entries.map(e=>e.osmId)).size,actual.length);
assert(audit.entries.every(x=>ids.has(x.osmId)),'Never invent buildings or fake OSM ids');
assert.equal(audit.withMappedLevels,actual.filter(e=>e.tags['building:levels']!=null).length);
assert.equal(audit.withMappedHeight,actual.filter(e=>e.tags.height!=null).length);
assert.equal(audit.withMappedRoofShape,actual.filter(e=>e.tags['roof:shape']!=null).length);
assert.equal(audit.withPhotoReference,3);
assert(audit.entries.every(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon)&&
 x.reviewStatus!=='verified-1to1'),'Exact photo 1:1 status cannot be claimed from the current evidence');
const counts=Object.values(audit.priorityAreas).reduce((n,v)=>n+v,0);
assert.equal(counts,audit.buildings);
assert.equal(audit.entries[0].osmId,53865956,'Station is the first site for 360 review');
assert(audit.entries.some(e=>e.osmId===118487980&&e.photoReference));
assert(audit.entries.some(e=>e.osmId===202367254&&e.photoReference));
assert(audit.entries.some(e=>e.osmId===202367194&&e.photoReference));
console.log('Building photo-rebuild queue:',JSON.stringify({
 total:audit.buildings,withLevels:audit.withMappedLevels,
 surveyedRoofShapes:audit.withMappedRoofShape,
 partialPhotoReferences:audit.withPhotoReference,priorityAreas:audit.priorityAreas}));
