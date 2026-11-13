import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PHOTO_STREET_ENVIRONMENT,gpsToStreetWorld,nearestPhotoRoadSegment} from './street-environment-pass.js';
const ref=PHOTO_STREET_ENVIRONMENT[0];
assert.equal(PHOTO_STREET_ENVIRONMENT.length,1);
assert.equal(ref.photoLicense,'CC BY-SA 4.0');
assert.equal(ref.osmRoadId,'219273174');
assert.equal(ref.latitude,50.227797);
assert(ref.source.includes('commons.wikimedia.org'));
assert(ref.observed.some(x=>x.includes('hedges')));
assert(ref.accuracy.includes('approximate')||ref.accuracy.includes('estimates'));
const origin=gpsToStreetWorld(50.226,14.889);
assert(Math.abs(origin.x)<1e-6&&Math.abs(origin.z)<1e-6);
const data=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const way=data.elements.find(e=>String(e.id)===ref.osmRoadId);
assert(way&&way.tags?.name==='5. května'&&way.tags?.highway==='secondary');
const cos=Math.cos(50.226*Math.PI/180),road={
 osmId:way.id,width:9,points:way.geometry.map(p=>({
 x:(p.lon-14.889)*111320*cos,y:-(p.lat-50.226)*111320
 }))
};
const anchor=nearestPhotoRoadSegment(road,ref.latitude,ref.longitude);
assert(anchor&&anchor.distance<1,'The photographed road must coincide with genuine OSM geometry');
assert.equal(anchor.osmRoadId,ref.osmRoadId);
assert(Math.hypot(anchor.ux,anchor.uz)>.99);
assert(Math.hypot(anchor.nx,anchor.nz)>.99);
assert.equal(nearestPhotoRoadSegment(null,50.22,14.88),null);
console.log('Photo-street environment OK:',JSON.stringify({reference:ref.id,roadOSM:ref.osmRoadId,photoToRoadMeters:anchor.distance}));
