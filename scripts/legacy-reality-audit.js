// Milovice RP 5.26 — retrospective audit of legacy pre-photo decoration.
// A source describes a feature, not automatically its exact 3D coordinates.
// Inside these FIRST-PASS review zones suppress imagined windows accessories,
// doors, roof vents and balconies. OSM footprints, collisions, real landmarks,
// pedestrian portals and documented photo street scenes must remain intact.
const COS=Math.cos(50.226*Math.PI/180),METRES=111320;
export function photoGpsToWorld(lat,lon){
 if(!Number.isFinite(lat)||!Number.isFinite(lon))return null;
 return {x:(lon-14.889)*METRES*COS,z:-(lat-50.226)*METRES};
}
export const RETROSPECTIVE_REVIEW_ZONES=Object.freeze([
 {id:'nadrazi',name:'Nádraží / Nádražní',lat:50.22911,lon:14.88198,radius:235,
  source:'OSM building 53865956, Commons station photos 2024–2025'},
 {id:'5-kvetna',name:'5. května / Mírová / Školská',lat:50.227797,lon:14.884813,radius:215,
  source:'OSM highway 219273174, Commons 5. května 2014 and frontages 2024'},
 {id:'kostel',name:'Kostel sv. Kateřiny / okolí',lat:50.22813,lon:14.883335,radius:175,
  source:'Church of St Catherine, official place listing and Commons photos'}
]);
export const VERIFIED_FOOTPRINTS=Object.freeze(['53865956','1011197691','202367194','202367254','118487980']);
export const UNVERIFIED_LEGACY_CLASSES=Object.freeze([
 'random-street-manhole','random-street-drain','random-street-bollard',
 'random-street-asphalt-patch','giant-physical-name-board',
 'invented-home-shutter','invented-generic-balcony','invented-longest-wall-door',
 'invented-rooftop-vent','invented-garage-door','invented-house-chimney',
 'invented-commerce-awning'
]);
export function auditZoneAt(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return null;
 for(const site of RETROSPECTIVE_REVIEW_ZONES){
  const p=photoGpsToWorld(site.lat,site.lon);
  if(Math.hypot(x-p.x,z-p.z)<=site.radius)return site.id;
 }
 return null;
}
export function isLegacyGuessAllowed(x,z){
 // Ordinary generic city buildings outside the first audited core remain as
 // explicitly NOT-verified placeholders until their street reaches review.
 return !auditZoneAt(x,z);
}
export function makeRetrospectiveAuditTracker(){
 const counts={inspectedInZone:0,unverifiedUnchangedOutsideZone:0,
  verifiedFootprintsInsideZone:0,removedLegacy3DLabels:0,removedRandomStreetProps:0,
  suppressedDoors:0,suppressedShutters:0,suppressedBalconies:0,
  suppressedVents:0,suppressedChimneys:0,suppressedCommerceAwnings:0,
  suppressedGarageDoors:0,suppressedUnverifiedTrees:0};
 const inspectedIds=new Set();
 function building(id,x,z){
  const zone=auditZoneAt(x,z);
  const key=String(id??'')||'unknown@'+Math.round(x)+','+Math.round(z);
  if(inspectedIds.has(key))return zone;
  inspectedIds.add(key);
  if(zone){counts.inspectedInZone++;if(VERIFIED_FOOTPRINTS.includes(String(id)))counts.verifiedFootprintsInsideZone++;}
  else counts.unverifiedUnchangedOutsideZone++;
  return zone;
 }
 function suppressed(kind,n=1){
  if(!(kind in counts)||!Number.isInteger(n)||n<0)throw Error('Invalid audit count '+kind);
  counts[kind]+=n;
 }
 function summary(){return {
  version:'5.26.0',scope:'Retrospective first pass, not full city certification',
  zones:RETROSPECTIVE_REVIEW_ZONES.map(z=>({id:z.id,name:z.name,radius:z.radius})),
  sourceReviewedWayIds:VERIFIED_FOOTPRINTS,
  globalGuessedStreetFurnitureDisabled:true,unreviewedWorldBuildingDetailsRemain:true,
  ...counts
 }}
 function reset(){
  for(const key of Object.keys(counts))counts[key]=0;
  inspectedIds.clear();
 }
 return {building,suppressed,summary,reset};
}
