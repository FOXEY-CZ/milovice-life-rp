import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PHOTO_STREET_ENVIRONMENT,gpsToStreetWorld,nearestPhotoRoadSegment} from './street-environment-reality.js';
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
const runtime=readFileSync(new URL('./street-environment-reality.js',import.meta.url),'utf8');
assert(!runtime.includes('   paving(root,anchor,side);'),
 'Old photo paving slab generator must not run in strict reality mode');
assert(runtime.includes('checkedGreeneryAgainstRoads:true'),
 'Every actual photo-scene tree and hedge must pass road/footway clearance');
assert(runtime.includes('fullFootprintChecked:true'));
assert(runtime.includes('isRoadFreeRect(roadClearance'));
assert(runtime.includes('photoRectClearance(anchor,a,offset,2.0,1.05)'),
 'The hedge bed must be tested with its whole ground footprint');
assert(runtime.includes('photoRectClearance(anchor,gateAlong,gateOffset,3.5,.35)'),
 'A 3.5m wooden gate may not be cleared solely at its centre');
assert(!runtime.includes('function paving('),
 'Keep old speculative 5. května paving removed, not merely disabled');
assert(runtime.includes('photoGroundClearance(anchor,along,side,.8*size)'),
 'Stem positions cannot be inferred without physical OSM road-clearance test');

console.log('Photo-street environment OK:',JSON.stringify({reference:ref.id,roadOSM:ref.osmRoadId,photoToRoadMeters:anchor.distance}));

// v5.27.4: inferred road edge paint, retail pavement rectangles and bicycle
// stands must never appear merely because OSM says highway=residential or
// shop=supermarket. Keep surface geometry on actual OSM streets/footways.
const gameHTML=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(gameHTML.includes('residentialInventedEdgeLinesDisabled:true'));
assert(gameHTML.includes("if(kind==='primary'||kind==='secondary'||kind==='tertiary'){"));
assert(!gameHTML.includes("kind==='tertiary'||kind==='residential'"));
assert(gameHTML.includes('inventedRetailPadsRemoved:true'));
assert(gameHTML.includes('inventedRetailBikeStandsRemoved:true'));
assert(!gameHTML.includes("archPart('stationPaving',mx+nx*2.7"));
assert(!gameHTML.includes("archPart('stationIron',tx+nx*k*.55"));
assert(gameHTML.includes("stationPaving',cx+ax*passageS+acrossX*shift"));

// 5.28.0: Even secondary street classification is not proof of white
// edge-lines or center dashes. 2014 street photograph at the geotagged
// 5. května scene shows unstriped asphalt at the pictured location.
const streetHTML=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(streetHTML.includes('inventedEdgeLinesDisabled:true'));
assert(streetHTML.includes('inventedCentreDashesDisabled:true'));
assert(!streetHTML.includes('for(let d=5;d<len-2;d+=13)'));
assert(!streetHTML.includes('const nx=-dz/len,nz=dx/len,edge=width*.5-.28'));
assert(streetHTML.includes('if(!markedCrossing(el.tags))continue;'),
 'Only evidenced marked crossing paths may generate zebra paint');
assert(streetHTML.includes('osmStrip(a,b,width,osmRoadMaterial,.17)'),
 'Removing speculative paint must not remove street asphalt');
