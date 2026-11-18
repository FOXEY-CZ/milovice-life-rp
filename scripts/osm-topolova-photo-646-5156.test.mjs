import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolova646Photo5156} from './osm-topolova-photo-646-5156.js';
const elements=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const w=elements.find(x=>x.id===53866048);
const school=elements.find(x=>x.id===53865699);
assert(w&&school);
const old=JSON.stringify([w,school]);
const input={id:w.id,regionId:'mlada',tags:w.tags,geometry:w.geometry,baseFloors:1};
const p=planTopolova646Photo5156(input);
assert(p&&p.version==='5.156');
assert.equal(p.sourceRUIANId,'25789813');
assert.equal(p.sourceOSMHash,'73d119b1');
assert.equal(p.sourceOriginalLevels,1);
assert.equal(p.sourceRegisteredFlats,27);
assert.equal(p.photoWindowRows,3);
assert.equal(p.photoGabledAttic,true);
assert.equal(p.modelWallFloors,3);
assert.equal(p.modelWallHeightMeters,9.15);
assert.equal(p.modelRoofRiseMeters,2.5);
assert.equal(p.modelDormers,8);
assert.equal(p.eastPhotoEdgeIndex,5);
assert.equal(p.eastLengthMeters,43.046);
assert.equal(p.westLengthMeters,43.021);
assert(p.officialAboveGroundFloorsNotKnown);
assert(p.photoFaceOrientationInferred);
assert(p.suppressUnverifiedEntrance);
assert(p.sourceOSMLevelTagUnchanged&&p.sourceOSMFootprintUnchanged);
for(const key of ['addedBuildings','addedRoads','addedFootways',
 'addedColliders','addedTrees','addedLamps','addedParking'])
 assert.equal(p[key],0);
for(const change of [
 {id:'53866045'},{regionId:'vrutice'},{baseFloors:2},
 {photoReviewed:true},{approvedArchitecture:true},
 {tags:{...w.tags,'building:levels':'3'}},
 {tags:{...w.tags,'building:flats':'28'}},
 {tags:{...w.tags,'ref:ruian:building':'0'}},
 {geometry:w.geometry.slice(0,-1)},
 {geometry:w.geometry.map((x,i)=>i===5?{...x,lon:x.lon+.0000001}:x)}
])assert.equal(planTopolova646Photo5156({...input,...change}),null);
assert.equal(JSON.stringify([w,school]),old);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-topolova-photo-646-5156.js?v=515600'",
 'const topolova646Photo=planTopolova646Photo5156({',
 'if(topolova646Photo)floors=topolova646Photo.modelWallFloors;',
 'if(topolova646Photo)h=topolova646Photo.modelWallHeightMeters;',
 'const rendered646=topolova646BothPlan?',
 'renderTopolova646BothFacades5157(THREE,{',
 'window.__miloviceTopolova646PhotoRuntime=()=>{',
 "'topolova-646-photo-5156':{",
 '!topolova646Photo&&!sportovniHall'
])assert(html.includes(needle),'Game integration missing '+needle);
console.log('PASS 5.156 contractor photos 3 regular window rows/attic; original 646 OSM/27 flats retained');
