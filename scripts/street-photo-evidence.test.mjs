import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 STREET_PHOTO_EVIDENCE,streetEvidenceForBuilding,streetPhotoCoverage,
 distanceBetweenPhotosAndBuilding,previewForCommonsPhoto
} from './street-photo-evidence.js';

const photos=STREET_PHOTO_EVIDENCE;
assert(photos.length>=8,'Real-world street batch needs multiple independent sources');
assert.equal(new Set(photos.map(p=>p.id)).size,photos.length);
assert.equal(new Set(photos.map(p=>p.url)).size,photos.length);
assert(photos.every(p=>/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(p.url)&&
 /^(2014|2024)-\d\d-\d\d$/.test(p.taken)&&
 p.author&&p.license.includes('CC BY')&&
 (!p.camera||p.camera.length===2&&p.camera.every(Number.isFinite))));
const core=JSON.parse(readFileSync(new URL('../data/architecture/building-audit-queue.json',import.meta.url),'utf8'));
const homes=core.entries.map(e=>({id:e.osmId,center:[e.lat,e.lon]}));
const one=id=>homes.find(p=>p.id===id);
for(const [id,photoId] of [
 [118487980,'skolska-1-2024'],[202367254,'mirova-36-2024'],
 [202367194,'modra-hvezda-2024']]){
 const matches=streetEvidenceForBuilding(one(id));
 assert(matches[0]?.id===photoId&&matches[0].directEvidence,
  'Directly named building source must rank ahead of random nearby photos: '+id);
}
const m=streetEvidenceForBuilding(one(118487980));
assert(m.some(p=>p.id==='nadrazi-bus-2024'&&p.nearbyOnly));
assert(!m.some(p=>p.id==='mir-street-2024'));
const sourceOnly=streetEvidenceForBuilding({
 id:9999,center:[50.22907,14.88225]
});
assert(sourceOnly.some(p=>p.id==='skolska-1-2024'&&p.nearbyOnly&&
 p.directEvidence===false),
 'A camera near the house is NOT evidence of this house');
const far=streetEvidenceForBuilding({
 id:9999,center:[51.1,15.1]
});
assert.equal(far.length,0);
assert.equal(distanceBetweenPhotosAndBuilding(null,[50,14]),Infinity);
assert.equal(streetEvidenceForBuilding(null).length,0);
const stats=streetPhotoCoverage(homes);
assert.equal(stats.buildings,684);
assert.equal(stats.withIdentifiedBuildingPhotos,3);
assert(stats.withNearbyPhotos>=3&&stats.withNearbyPhotos<stats.buildings,
 'Only a minority of houses have locally discovered photo candidates');
assert.equal(stats.allFacadesVerified,false);
assert(photos.some(x=>x.taken==='2014-07-26'&&x.scope==='historical-streetscape'));
assert(photos.every(p=>previewForCommonsPhoto(p)?.includes('/wiki/Special:FilePath/')&&
 previewForCommonsPhoto(p)?.endsWith('?width=320')),
 'All low-res source previews must come from the credited Commons originals');
assert.equal(previewForCommonsPhoto({url:'https://untrusted.example/foo.png'}),null);
assert.equal(previewForCommonsPhoto({url:'javascript:alert(1)'}),null);
const editor=readFileSync(new URL('../editor.html',import.meta.url),'utf8');
for(const tag of [
 'id="street-evidence-panel"','id="street-evidence-gallery"',
 'id="street-photo-summary"','renderPhotoEvidence(b)',
 "streetEvidenceForBuilding(chosen,{radiusM:135,max:9})",
 "btn.dataset.evidenceId",
 "$('face-status').value='unreviewed'",
 "saveFace();faceButtons();",
 "class=\"evidence-preview\"",
 "previewForCommonsPhoto(p)"
])assert(editor.includes(tag),'Missing safe editor candidate UI '+tag);
assert(!editor.includes('image-data: STREEET_PHOTO_EVIDENCE'));
console.log('Street photo source catalog QA PASS',JSON.stringify({
 sources:photos.length,allBuildings:stats.buildings,
 namedBuildings:stats.withIdentifiedBuildingPhotos,
 nearbyCandidateBuildings:stats.withNearbyPhotos,
 unknownFacadePolicy:'candidate-only; human review required'
}));
