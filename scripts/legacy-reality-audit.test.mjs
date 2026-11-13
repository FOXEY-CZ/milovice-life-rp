import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {photoGpsToWorld,RETROSPECTIVE_REVIEW_ZONES,
 VERIFIED_FOOTPRINTS,UNVERIFIED_LEGACY_CLASSES,auditZoneAt,
 isLegacyGuessAllowed,makeRetrospectiveAuditTracker} from './legacy-reality-audit.js';
assert.equal(RETROSPECTIVE_REVIEW_ZONES.length,3);
assert(RETROSPECTIVE_REVIEW_ZONES.some(z=>z.id==='nadrazi'));
assert(RETROSPECTIVE_REVIEW_ZONES.some(z=>z.id==='5-kvetna'));
assert(RETROSPECTIVE_REVIEW_ZONES.some(z=>z.id==='kostel'));
assert(UNVERIFIED_LEGACY_CLASSES.includes('random-street-manhole'));
assert(VERIFIED_FOOTPRINTS.includes('53865956'));
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const centre=way=>{
 const pp=way.geometry.slice(0,-1);
 return photoGpsToWorld(
  pp.reduce((s,p)=>s+p.lat,0)/pp.length,
  pp.reduce((s,p)=>s+p.lon,0)/pp.length);
};
const st=osm.elements.find(e=>e.id===53865956);
const church=osm.elements.find(e=>e.id===118487991);
assert(st&&church);
const sp=centre(st),cp=centre(church);
assert.equal(auditZoneAt(sp.x,sp.z),'nadrazi');
assert(auditZoneAt(cp.x,cp.z),'nadrazi'||auditZoneAt(cp.x,cp.z)==='5-kvetna'||
 auditZoneAt(cp.x,cp.z)==='kostel');
assert(!isLegacyGuessAllowed(cp.x,cp.z));
assert(!isLegacyGuessAllowed(sp.x,sp.z));
assert(!isLegacyGuessAllowed(photoGpsToWorld(50.227797,14.884813).x,photoGpsToWorld(50.227797,14.884813).z));
assert(isLegacyGuessAllowed(18000,18000));
const tracker=makeRetrospectiveAuditTracker();
tracker.building(53865956,sp.x,sp.z);
tracker.building(53865956,sp.x,sp.z);
tracker.building(118487991,cp.x,cp.z);
tracker.suppressed('suppressedUnverifiedTrees',7);
tracker.suppressed('removedRandomStreetProps',4);
assert.equal(tracker.summary().inspectedInZone,2,'Same OSM way counted only once');
assert.equal(tracker.summary().verifiedFootprintsInsideZone,1);
assert.equal(tracker.summary().suppressedUnverifiedTrees,7);
assert.equal(tracker.summary().removedRandomStreetProps,4);
assert.equal(tracker.summary().unreviewedWorldBuildingDetailsRemain,true);
tracker.reset();
assert.equal(tracker.summary().inspectedInZone,0);
assert.equal(tracker.summary().suppressedUnverifiedTrees,0);
const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(source.includes("legacyRealityAudit.building(osmId,centerX,centerZ)"));
assert(source.includes("removedLegacy3DLabels"));
assert(source.includes("suppressedDoors"));
assert(source.includes("suppressedShutters"));
assert(source.includes("suppressedBalconies"));
assert(source.includes("disabledRandomStreetProps:true"));
assert(source.includes("photoStreetEnvironment.addFromRoads"));
assert(!source.includes("osmPlaceLabel("));
console.log('5.26 photo-first retrospective place/object inventory: 3 review zones, no fake giant physical map labels');
