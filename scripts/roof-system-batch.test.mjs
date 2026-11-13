// Milovice RP 5.30: full-core roof inventory audit.
// Detects which roof shapes lack evidence and require individual PHOTO
// profiles, without inventing a house's gables from its OSM polygon.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dominantRoofAxis,analyzeGableFootprint} from './city-roof-geometry.js';
import {PHOTO_ROOF_PROFILES,planPhotoRoofFeatures} from './street-photo-block.js';
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const houses=osm.elements.filter(el=>el.tags?.building&&el.geometry?.length>=3);
const known=new Set(Object.keys(PHOTO_ROOF_PROFILES));
assert.equal(houses.length,684,'Do not silently lose any Milovice core footprints');
let quadrilateral=0,complex=0,nonRectangularQuads=0,plausibleAutoGables=0;
let brokenAxis=0,verifiedRoofFeatures=0,needsPhoto=0;
const unknown=[];
for(const h of houses){
 const raw=h.geometry.map(p=>({
  x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
  z:-(p.lat-50.226)*111320
 }));
 if(raw.length>3&&Math.hypot(raw[0].x-raw.at(-1).x,
  raw[0].z-raw.at(-1).z)<.06)raw.pop();
 const axis=dominantRoofAxis(raw);
 if(!axis||!Number.isFinite(axis.ax)||!Number.isFinite(axis.az))brokenAxis++;
 const gable=analyzeGableFootprint(raw);
 if(raw.length===4){
  quadrilateral++;
  if(gable)plausibleAutoGables++;
  else nonRectangularQuads++;
 }else complex++;
 if(known.has(String(h.id))){
  const actual=planPhotoRoofFeatures(h.id,raw);
  assert.equal(actual.length,PHOTO_ROOF_PROFILES[String(h.id)].specs.length,
   'Source-backed profile and actual mesh openings must agree');
  for(const feature of actual){
   assert(feature.source.startsWith('https://'));
   assert(feature.width>0&&feature.depth>0);
  }
  verifiedRoofFeatures+=actual.length;
 }else{
  needsPhoto++;
  if(unknown.length<12)unknown.push(h.id);
 }
}
assert.equal(quadrilateral+complex,houses.length);
assert.equal(complex,342,'Current core has 342 non-four-sided roof footprints');
assert.equal(quadrilateral,342);
assert(brokenAxis<=2,'Many OSM building axes cannot be resolved');
assert(plausibleAutoGables+nonRectangularQuads===quadrilateral);
assert.equal(verifiedRoofFeatures,2,'Two paired Školská gables must be sourced');
assert.equal(needsPhoto,houses.length-known.size,
 'Do not automatically declare unsupported real roof geometry verified');
console.log(JSON.stringify({auditedBuildings:houses.length,
 quadrilateral,complex,plausibleAutoGables,nonRectangularQuads,
 unresolvedRoofAxes:brokenAxis,photoSpecificRoofProfiles:known.size,
 confirmedFromPhotoFeatureCount:verifiedRoofFeatures,
 otherBuildingsRequiringSourceReview:needsPhoto,
 sampleOSMIdsNeedingReview:unknown},null,2));
console.log('Roof System 2.0 whole-town source/geometry audit PASS: provisional is not verified');
