// Milovice RP 5.217 — exact official OSM tag palette, one existing building.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_TAGGED_COLORS_5217 as C,
 planVisnovaTaggedColors5217 as plan} from './osm-visnova-tagged-colors-5217.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const source=elements.find(e=>String(e.id)===C.buildingId);
assert(source,'the mapped three-level Višňová building must exist');
const original=JSON.stringify(source);
const opts={regionId:'mlada',building:source};
const p=plan(opts);
assert(p,'source geometry/tags must be exact');
assert.equal(p.sourceBuildingId,'1456361921');
assert.equal(p.sourceGeometryHash,'28e92fa9');
assert.equal(p.originalNodes,5);
assert.equal(p.originalMappedLevels,3);
assert.equal(p.sourceFacadeHex,'#fec700');
assert.equal(p.sourceRoofHex,'#583400');
assert(p.footprintSquareMetres>181&&p.footprintSquareMetres<182);
assert.deepEqual(p.sourceGPS,source.geometry);
assert.deepEqual(p.cameraTargetGPS,{lat:50.2288783,lon:14.8690134});
assert.equal(p.roofShapeNotSpecifiedByOSM,true);
assert.equal(p.architecturalAppearanceNotPhotographed,true);
assert.equal(p.sourceColourTagsNotAColourSurvey,true);
assert.equal(p.originalGPSUnchanged,true);
for(const field of ['newBuildings','newRoofGeometry','newColliders',
 'newFacades','newRoads','newFootways','newLandscape'])
 assert.equal(p[field],0,field);
const altered=(override)=>({...opts,building:{...source,...override}});
for(const [what,argument] of [
 ['different region',{...opts,regionId:'vrutice'}],
 ['approved architecture',{...opts,approvedArchitecture:true}],
 ['photo-reviewed facade',{...opts,photoReviewed:true}],
 ['different way',altered({id:1456361920})],
 ['different mapped level',altered({tags:{...source.tags,'building:levels':'2'}})],
 ['different facade',altered({tags:{...source.tags,'building:colour':'#ffcc00'}})],
 ['different roof',altered({tags:{...source.tags,'roof:colour':'#573400'}})],
 ['invented roof shape',altered({tags:{...source.tags,'roof:shape':'gable'}})],
 ['moved GPS',altered({geometry:source.geometry.map((v,i)=>
  i===2?{...v,lon:v.lon+.0000001}:v)})],
 ['lost polygon node',altered({geometry:source.geometry.slice(0,-1)})],
 ['unclosed polygon',altered({geometry:source.geometry.map((v,i)=>
  i===4?{...v,lat:v.lat+.0001}:v)})]
])assert.equal(plan(argument),null,'must fail closed for '+what);
assert.equal(JSON.stringify(source),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 raw,'original regional export must not be changed');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const text of [
 "from './scripts/osm-visnova-tagged-colors-5217.js?v=521700'",
 'planVisnovaTaggedColors5217({',
 'color:VISNOVA_TAGGED_COLORS_5217.facadeHex',
 'color:VISNOVA_TAGGED_COLORS_5217.roofHex',
 'const wallMat=visnovaTaggedPlan5217?visnovaTaggedMaterials5217.facade:',
 'const roofMat=visnovaTaggedPlan5217?visnovaTaggedMaterials5217.roof:',
 'window.__miloviceVisnovaTaggedColorRuntime5217=()=>',
 "'visnova-tagged-colors-5217':{",
 'href="?v=521700&streetAudit=visnova-tagged-colors-5217"',
 "const BUILD_ID='20261121-visnova-tagged-colors-521700'"
])assert(html.includes(text),'missing actual game integration: '+text);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===build&&build===hud,'meta/HUD/runtime build consistency');
console.log('PASS 5.217 one actual Višňová OSM building exact 3 levels;',
 p.footprintSquareMetres,'m², facade',p.sourceFacadeHex,
 'roof',p.sourceRoofHex,'no speculative construction');
