import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nextUnworkedStreetBuilding,photoCandidateBearing} from './building-work-progress.js';
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const worklog=JSON.parse(readFileSync(new URL('../data/architecture/building-work-progress.json',import.meta.url),'utf8'));
const queue=JSON.parse(readFileSync(new URL('../data/architecture/building-audit-queue.json',import.meta.url),'utf8'));
const allIds=new Set(queue.entries.map(e=>e.osmId));
assert.equal(queue.buildings,684,'Keep all base-core OSM structures in review queue');
const started=[...worklog.worked,...worklog.accepted].map(e=>e.osmId);
assert.equal(new Set(started).size,started.length,'One building cannot be both completed and pending');
assert(started.every(id=>allIds.has(id)),'Never invent a worked-on building');
assert(worklog.candidates.every(e=>allIds.has(e.osmId)),'Never select fake OSM ID');
assert(!worklog.candidates.some(e=>started.includes(e.osmId)),
 'A previously worked-on building must never be advertised as new');
const next=nextUnworkedStreetBuilding(osm,worklog);
assert.equal(next?.osmId,202298939);
assert.equal(next.canBuildFromPhoto,false,'Camera-only photo cannot authorize geometry');
assert.equal(next.requiresPhotoIdentityReview,true);
assert(next.bearing.distanceMetres>25&&next.bearing.distanceMetres<55);
assert(next.bearing.deviationDegrees<10,'Photo camera and suggested candidate must really align');
assert.equal(next.bearing.evidenceStatus,'candidate-only');
assert.equal(queue.entries.find(x=>x.osmId===next.osmId)?.photoReference,false,
 'A photo candidate is NOT a verified building reference');
const after={...worklog,worked:[...worklog.worked,{osmId:202298939,stage:'worked-partial'}]};
assert.equal(nextUnworkedStreetBuilding(osm,after)?.osmId,202775905,
 'After finishing this candidate the queue must progress, NOT repeat');
const later={...after,worked:[...after.worked,{osmId:202775905,stage:'worked-partial'}]};
assert.equal(nextUnworkedStreetBuilding(osm,later),null,
 'When no sourced candidates remain, request evidence rather than pick old houses');
assert.equal(photoCandidateBearing({viewpoint:{lat:NaN,lon:0,headingDeg:0}},
 osm.elements.find(e=>e.id===202298939)),null);
console.log('5.53 no-repeat progress tracker: next OSM',next.osmId,
 'distance',next.bearing.distanceMetres.toFixed(1),
 'bearing error',next.bearing.deviationDegrees.toFixed(1),
 'photo identity pending, no invented geometry');
