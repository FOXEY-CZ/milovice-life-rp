import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {auditTopolovaStreet5173} from './osm-topolova-street-inventory-5173.js';

const source=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(source).elements;
const buildings=elements.filter(e=>e.tags?.building&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways:buildings});
assert(rowPlan);
const options={regionId:'mlada',elements,rowPlan};
const audit=auditTopolovaStreet5173(options);
assert(audit,'actual Topolova OSM road and original five-house row required');
assert.equal(audit.sourceRoadId,'8618275');
assert.equal(audit.searchRadiusMetres,60);
assert(audit.originalRoadNodes>=2);
assert(audit.nearbyPedestrianWays>0);
assert(audit.records.some(x=>x.id==='1316882852'&&x.previouslyReferenced),
 'existing Topolova east sidewalk must be in source inventory');
assert(audit.records.some(x=>x.id==='1316882853'&&x.previouslyReferenced),
 'north zebra should remain visible in nearby footway inventory');
assert(audit.records.some(x=>x.id==='1316882854'&&x.previouslyReferenced),
 'south zebra should remain visible in nearby footway inventory');
assert(audit.records.every(x=>Number.isFinite(x.distanceMetres)&&
 x.distanceMetres>=0&&x.distanceMetres<=60));
assert.equal(new Set(audit.records.map(x=>x.id)).size,audit.records.length);
for(const k of ['photosVerifiedByThisAudit','newGeometry','newRoads',
 'newFootways','newCrossings','newLights','newTrees'])assert.equal(audit[k],0);
assert.equal(auditTopolovaStreet5173({...options,regionId:'other'}),null);
assert.equal(auditTopolovaStreet5173({...options,
 rowPlan:{...rowPlan,version:'5.154'}}),null);
assert.equal(auditTopolovaStreet5173({...options,
 elements:elements.filter(e=>String(e.id)!=='8618275')}),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 source,'OSM source bytes unchanged');
console.log('PASS 5.173 Topolova OSM street census: '+JSON.stringify({
 mappedPedestrianWays:audit.nearbyPedestrianWays,
 previouslyReferenced:audit.previouslyReferencedPedestrianWays,
 toReview:audit.additionalPedestrianWaysForReview,
 vicinityWayCount:audit.records.length
}));
