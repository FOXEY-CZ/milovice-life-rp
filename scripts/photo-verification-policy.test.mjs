// Milovice RP 5.61: restore mistakenly hidden northern buildings as unverified legacy objects.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 NADRAZNI_PHOTO_PENDING_OSM_IDS,PHOTO_VERIFIED_ARCHITECTURE,
 photoRenderingDecision,hasReviewedPhotoEvidence,approveNew3DFeature
} from './photo-verification-policy.js';
import {STREET_PHOTO_EVIDENCE} from './street-photo-evidence.js';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=JSON.parse(read('data/milovice-osm.json')).elements;
const ids=NADRAZNI_PHOTO_PENDING_OSM_IDS;
assert.equal(ids.length,17);
assert.equal(new Set(ids).size,17,'Every reinstated OSM feature must be distinct');
assert.equal(PHOTO_VERIFIED_ARCHITECTURE.length,0,
 'No exact-site photo was reviewed for these 17 claimed garages');
for(const id of ids){
 const way=all.find(e=>e.id===id);
 assert(way?.geometry?.length>=4,'Keep a map-verifiable footprint for '+id);
 assert.equal(way.tags.building,'garage','OSM tag is only provisional metadata');
 assert(!STREET_PHOTO_EVIDENCE.some(e=>e.buildingIds?.includes(String(id))),
  'Catalog would need explicit photo identity review before using it');
 const gate=photoRenderingDecision(id);
 assert.equal(gate.render,true,'Legacy building incorrectly hidden in 5.60 must be restored '+id);
 assert.equal(gate.photographicApproval,false);
 assert.equal(gate.status,'legacy-restored-awaiting-photo');
 assert.equal(approveNew3DFeature({osmId:id,feature:'garage door'}),false);
}
const nearbyPhoto={
 osmIds:[ids[0]],sourceUrl:'https://commons.wikimedia.org/wiki/File:Example.jpg',
 capturedAt:'2024-05-30',reviewNote:'Unknown place near the railway',
 identityReviewed:false,photographicMatchConfirmed:false,
 buildingTypeConfirmed:false,geometryChecked:false
};
assert.equal(hasReviewedPhotoEvidence(ids[0],{records:[nearbyPhoto]}),false,
 'Photo with no exact object match is insufficient');
assert.equal(hasReviewedPhotoEvidence(ids[0],{records:[{...nearbyPhoto,
 identityReviewed:true,photographicMatchConfirmed:true,
 buildingTypeConfirmed:true,geometryChecked:false}]}),false,
 'Even a photograph requires geometry and matching OSM way review');
const futureVerified={...nearbyPhoto,sourceUrl:'https://example.org/example-site-photo.jpg',
 reviewNote:'Manually identified this exact building from its surroundings',
 identityReviewed:true,photographicMatchConfirmed:true,
 buildingTypeConfirmed:true,geometryChecked:true};
assert.equal(hasReviewedPhotoEvidence(ids[0],{records:[futureVerified]}),true,
 'A future exact identity/photo review can explicitly release an object');
assert.equal(hasReviewedPhotoEvidence(ids[1],{records:[futureVerified]}),false,
 'One verified facade can never authorize all neighboring buildings');
assert.equal(approveNew3DFeature({osmId:ids[0],feature:'window',
 records:[nearbyPhoto]}),false);
assert.equal(approveNew3DFeature({osmId:ids[0],feature:'window',
 records:[futureVerified]}),true);
const legacy=photoRenderingDecision(53865956);
assert.equal(legacy.render,true,'Station model is preserved while legacy re-audit proceeds');
assert.equal(legacy.photographicApproval,false,
 'Unaudited legacy geometry must not be falsely described as photo-approved');

const index=read('index.html');
for(const marker of [
 "from './scripts/photo-verification-policy.js?v=5610'",
 'const photoDecision=photoRenderingDecision(osmId);',
 'if(!photoDecision.render){',
 'photoAudit.omittedFrom3D.push(osmId);',
 'photoAudit.blockedByMissingPhotographs++;',
 'legacyCityAuditPending:true',
 'photoAudit.restoredLegacy3D.push(osmId);',
 'photoAudit.restoredCount++;',
 "photoDecision.status==='legacy-restored-awaiting-photo'", 
 'const BUILD_ID=',
])assert(index.includes(marker),'Missing photo-first scene safety gate: '+marker);
assert(index.indexOf('const photoDecision=photoRenderingDecision(osmId);')<
 index.indexOf('const topology=planBuildingRoofTopology(pts);'),
 'Photo gate must run before mesh, facade, roof and collision construction');
assert(!index.includes('planNadrazniGarageCourt('),
 'Previous geometry-only garage algorithm must NOT run in game');
assert(!index.includes('nadrazni-garage-court.js'),
 'Previously unverified garage planner must not be imported');
assert(index.includes('station-platform-canopy.js?v=5580'),
 'Keep the independently developed provisional station canopy in place');

const survey=read('survey.html');
assert(survey.includes("status==='legacy-restored-awaiting-photo'"),
 'Survey must still show these reinstated models as pending real photos');
assert(survey.includes('Původní model obnoven'),
 'User-facing inventory must not call restored models approved');
const activeBuild=index.match(/const BUILD_ID='([^']+)'/)?.[1];
assert.equal(activeBuild,'20261114-restore-legacy-5610');
console.log('5.61 legacy restitution and photo-verification policy PASS',JSON.stringify({
 restoredLegacy3D:ids.length,photoApproved:PHOTO_VERIFIED_ARCHITECTURE.length,
 remainInOSM:true,legacyCityUntouched:true
}));
