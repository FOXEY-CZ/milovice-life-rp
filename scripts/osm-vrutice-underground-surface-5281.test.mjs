import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VRUTICE_UNDERGROUND_SOURCE_5281 as S,
 planVruticeUndergroundSurface5281 as plan} from './osm-vrutice-underground-surface-5281.js';
const load=name=>JSON.parse(readFileSync(
 new URL('../data/regions/'+name+'.json',import.meta.url),'utf8')).elements;
const vrutice=load('vrutice'),west=load('westlink'),orig=JSON.stringify(vrutice);
const candidates=vrutice.filter(w=>Object.hasOwn(S,String(w.id)));
assert.equal(candidates.length,5);
let metres=0,segments=0;
for(const way of candidates){
 const p=plan({regionId:'vrutice',way});
 assert(p,'source-locked original tunnel found: '+way.id);
 assert.equal(p.sourceOSMId,String(way.id));
 assert.equal(p.sourceEdges,way.geometry.length-1);
 assert.equal(p.drawOnDEM,false);
 assert.equal(p.trueSubterraneanMeshBuilt,false);
 assert.equal(p.mapGeometryUnchanged,true);
 assert.equal(p.newFootways,0);
 assert.equal(p.newColliders,0);
 metres+=p.originalMetres;segments+=p.sourceEdges;
 assert.equal(plan({regionId:'mlada',way}),null);
 assert.equal(plan({regionId:'vrutice',way:{
  ...way,tags:{...way.tags,layer:'0'}}}),null);
 assert.equal(plan({regionId:'vrutice',way:{
  ...way,tags:{...way.tags,tunnel:'building_passage'}}}),null);
 assert.equal(plan({regionId:'vrutice',way:{
  ...way,tags:{...way.tags,highway:'residential'}}}),null);
 assert.equal(plan({regionId:'vrutice',way:{
  ...way,geometry:way.geometry.map((p,i)=>i===0?
   {...p,lon:p.lon+.0000001}:p)}}),null);
}
assert(metres>134&&metres<138,metres);
assert.equal(segments,11);
const westPlans=west.map(way=>plan({regionId:'westlink',way})).filter(Boolean);
assert.equal(westPlans.length,4);
assert.equal(new Set([...westPlans.map(p=>p.sourceOSMId),
 ...candidates.map(w=>String(w.id))]).size,5);
const grade={id:1234,type:'way',tags:{highway:'path',layer:'0'},
 geometry:candidates[0].geometry};
assert.equal(plan({regionId:'vrutice',way:grade}),null);
assert.equal(JSON.stringify(vrutice),orig);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 'const undergroundPlan5281=planVruticeUndergroundSurface5281({',
 'regionId,way:el',
 'if(undergroundPlan5281){',
 'window.__miloviceUndergroundSurfaceRuntime5281=',
 "'vrutice-underground-path-5281':{",
 "const BUILD_ID='"
])assert(html.includes(marker),marker);
console.log('PASS 5.281 five exact OSM tunnel=-1 paths, 11 false DEM segments suppressed, ~136m unchanged source');
