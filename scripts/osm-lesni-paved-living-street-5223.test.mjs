// Milovice RP 5.223: real OSM Lesní living street with paver surface.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 LESNI_PAVED_LIVING_STREET_5223 as C,
 planLesniPavedLivingStreet5223 as plan
} from './osm-lesni-paved-living-street-5223.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const original=JSON.parse(raw);
const found=original.elements.filter(w=>String(w.id)===C.wayId);
assert.equal(found.length,1,'one source OSM living street');
const w=found[0],before=JSON.stringify(w);
const p=plan('mlada',w);
assert(p,'locked source tags, geometry and length must match');
assert.equal(p.version,'5.223');
assert.equal(p.sourceOSMId,'83026442');
assert.equal(p.sourceHash,'9cc757ea');
assert.equal(p.sourceName,'Lesní');
assert.equal(p.sourceRoadType,'living_street');
assert.equal(p.sourceMotorVehicle,'destination');
assert.equal(p.sourceSurfaceTag,'paving_stones');
assert.equal(p.sourceNodes,10);
assert.equal(p.sourceSegments,9);
assert(Math.abs(p.originalLengthMeters-293.563)<.15);
assert.equal(p.material,'visnova-tagged-paving-stones');
assert.equal(p.modelColourPhotoVerified,false);
assert.equal(p.modelPavingPatternPhotoVerified,false);
for(const k of ['originalRoadGeometryUnchanged','originalRoadWidthUnchanged',
 'originalTrafficAccessUnchanged'])assert.equal(p[k],true,k);
for(const k of ['newRoads','newFootways','newBuildings','newColliders',
 'newKerbs','newParking','newSigns','newTrafficRules'])
 assert.equal(p[k],0,k);
const changes=[
 ['wrong region','other',{...w}],
 ['wrong id','mlada',{...w,id:'000'}],
 ['different name','mlada',{...w,tags:{...w.tags,name:'Višňová'}}],
 ['changed surface','mlada',{...w,tags:{...w.tags,surface:'asphalt'}}],
 ['changed road class','mlada',{...w,tags:{...w.tags,highway:'residential'}}],
 ['changed access','mlada',{...w,tags:{...w.tags,motor_vehicle:'yes'}}],
 ['extra road sign','mlada',{...w,tags:{...w.tags,lanes:'2'}}],
 ['shortened road','mlada',{...w,geometry:w.geometry.slice(0,-1)}],
 ['shift original GPS','mlada',{...w,geometry:w.geometry.map((p,j)=>
  j===3?{...p,lon:p.lon+.0000001}:p)}],
 ['reverse original','mlada',{...w,geometry:[...w.geometry].reverse()}]
];
for(const [why,region,way] of changes)
 assert.equal(plan(region,way),null,'fail closed on '+why);
assert.equal(JSON.stringify(w),before);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-lesni-paved-living-street-5223.js?v=522300'",
 'planLesniPavedLivingStreet5223(regionId,el)',
 'const lesniPavingBefore5223=',
 'osmSurfaceAudit.drawnSegments-lesniPavingBefore5223',
 'window.__miloviceLesniPavedStreetRuntime5223=()=>',
 "'lesni-paved-living-street-5223':{",
 'href="?v=522300&streetAudit=lesni-paved-living-street-5223"',
 "material:lesniPavedStreet5223.material",
 "window.__miloviceLesniPavedStreetAudit5223=null;"
])assert(html.includes(needle),'missing game integration '+needle);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===build&&build===hud,'latest meta/HUD/runtime builds must match');
console.log('PASS 5.223 original 293.563 m Lesní paved living street;',
 '9 original OSM rendered-road segments planned, shared tagged paving',
 'material, no change to widths, roads, cars, accesses, parking or geometry');
