// 5.99 OSM sport and surface classification, lines bounded by true shapes.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classifyOSMPitch,planOSMPitchMarkings,insideMappedPitch}
 from './osm-pitch-markings-599.js';
import {planCityLanduseBatches} from './landscapes.js';
const cos=Math.cos(50.226*Math.PI/180);
const project=p=>({x:(p.lon-14.889)*111320*cos,y:-(p.lat-50.226)*111320});
const files=['mlada','vrutice','westlink','centerlink','bozidar'];
const all=new Map();
for(const name of files){
 const osm=JSON.parse(readFileSync(new URL('../data/regions/'+name+'.json',
 import.meta.url),'utf8')).elements;
 for(const e of osm)if(e.tags?.leisure==='pitch'&&!all.has(e.id))all.set(e.id,e);
}
assert.equal(all.size,20,'Do not lose any of the 20 actual mapped sports grounds');
const expected={
 '612386900':['tennis','pitchClay'], '612386901':['tennis','pitchClay'],
 '612386902':['tennis','pitchClay'], '1278746589':['tennis','pitch'],
 '246576458':['soccer','pitch'], '1472419116':['soccer','pitch'],
 '1278746587':['basketball','pitch'],
 '1327246355':['multisport','pitchAsphalt']
};
let marks=0,verifiedSport=0,confirmedSurface=0,unverified=0;
for(const e of all.values()){
 const type=classifyOSMPitch(e.tags);
 assert(type&&type.noEquipmentInvented&&type.linesAreEstimated);
 if(type.sportSourceConfirmed)verifiedSport++;
 if(type.surfaceSourceConfirmed)confirmedSurface++;
 const poly=e.geometry.map(project);
 const p=planOSMPitchMarkings(e.tags,poly);
 if(expected[e.id]){
  assert.equal(type.sport,expected[e.id][0]);
  assert.equal(type.material,expected[e.id][1]);
  assert(p.segments.length>=8,'OSM sport lines absent from '+e.id);
  assert(p.center&&insideMappedPitch(p.center.x,p.center.z,poly));
  for(const l of p.segments){
   const m={x:(l.a.x+l.b.x)/2,z:(l.a.z+l.b.z)/2};
   assert(insideMappedPitch(m.x,m.z,poly),
    'Painted line may not be outside mapped pitch way '+e.id);
  }
  assert(p.cameraEye&&insideMappedPitch(p.cameraEye.x,p.cameraEye.z,poly));
  assert(p.cameraHeight>=9&&p.cameraHeight<=24);
 }else{
  assert.equal(p.segments.length,0,
   'Unknown sport or athletics should not get invented tennis/basket markings');
  unverified++;
 }
 assert.equal(p.equipmentModels,0);
 assert.equal(p.sourcePolygonMoved,false);
 marks+=p.segments.length;
 const rev=planOSMPitchMarkings(e.tags,[...poly].reverse());
 assert.equal(rev.segments.length,p.segments.length);
}
assert.equal(verifiedSport,8);
assert.equal(unverified,12);
assert(confirmedSurface>=5);
assert(marks>=75);
const mlada=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements;
const batch=planCityLanduseBatches(mlada,project);
const clay=batch.entries.filter(e=>e.renderMaterial==='pitchClay');
assert.equal(clay.length,3);
assert(batch.groups.some(g=>g.renderMaterial==='pitchClay'));
assert(batch.groups.some(g=>g.renderMaterial==='pitchAsphalt'));
assert(batch.groups.every(g=>g.items.every(e=>e.renderMaterial===g.renderMaterial)),
 'Never batch clay and asphalt into the same mesh/material');
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const text of [
 "import {planOSMPitchMarkings} from './scripts/osm-pitch-markings-599.js?v=59900'",
 'window.__miloviceSportPitchAudit=',
 'window.__miloviceSportPitchCameraAudit=',
 'court.cameraEye.x',
 "streetAudit=pitch-tennis-599",
 "streetAudit=pitch-multi-599",
 'camera.lookAt(c.x,terrainAt(c.x,c.z)+.14,c.z);'
])assert(game.includes(text),'Sport pitch runtime integration missing: '+text);
assert(/from ['"]\.\/scripts\/landscapes\.js\?v=\d+['"]/.test(game),
 'Sport pitch runtime must import current landscapes.js module');
const meta=game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=game.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=game.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud,
 'OSM sport paint build stamps must match');
console.log('PASS 5.99 mapped sport courts',JSON.stringify({
 actualOSMPitches:all.size,verifiedSport,confirmedSurface,
 estimatedPaintedLineSegments:marks,unverifiedPitchSports:unverified
}));
