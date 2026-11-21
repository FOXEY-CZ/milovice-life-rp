// Milovice RP 5.232 — OSM flat roof must override estimated pitched roof.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ITALSKA_FLAT_ROOF_5232 as C,
 planItalskaFlatRoof5232 as plan} from './osm-italska-flat-roof-5232.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const source=JSON.parse(raw).elements.filter(w=>String(w.id)===C.buildingId);
assert.equal(source.length,1,'one actual RUIAN roof source');
const original=JSON.stringify(source[0]);
const args={regionId:'mlada',building:source[0]};
const p=plan(args);
assert(p,'source GPS+tags must match exactly');
assert.equal(p.sourceBuildingId,'1112779894');
assert.equal(p.sourceGeometryHash,'e0c358f5');
assert.equal(p.originalOSMNodes,5);
assert.equal(p.originalMappedLevels,2);
assert.equal(p.originalMappedFlats,1);
assert.equal(p.mappedRoofShape,'flat');
assert.equal(p.sourceRUAINId,'108055060');
assert(p.sourceAreaM2>169.2&&p.sourceAreaM2<169.3);
assert.deepEqual(p.originalSourceGPS,source[0].geometry);
assert.equal(p.originalBuildingShellReused,true);
assert.equal(p.estimatedHeightNotSurveyed,true);
assert.equal(p.facadeAndRoofColorsNotPhotoVerified,true);
assert.equal(p.sourceGPSUnchanged,true);
for(const k of ['newBuildings','newRoads','newFootways','newRoofGeometry',
 'newColliders','newFacades','newLandscaping'])assert.equal(p[k],0);
const mutate=(fn)=>({...args,building:fn(source[0])});
for(const [name,opts] of [
 ['region',{...args,regionId:'jine'}],
 ['photo',{...args,photoReviewed:true}],
 ['manual',{...args,approvedArchitecture:true}],
 ['wrong id',mutate(w=>({...w,id:1}))],
 ['wrong shape',mutate(w=>({...w,tags:{...w.tags,'roof:shape':'gable'}}))],
 ['wrong levels',mutate(w=>({...w,tags:{...w.tags,'building:levels':'3'}}))],
 ['unknown tag',mutate(w=>({...w,tags:{...w.tags,'roof:colour':'#aaaaaa'}}))],
 ['GPS shifted',mutate(w=>({...w,geometry:w.geometry.map((v,i)=>
  i===1?{...v,lon:v.lon+.0000001}:v)}))],
 ['reversed boundary',mutate(w=>({...w,geometry:[...w.geometry].reverse()}))],
 ['not closed',mutate(w=>({...w,geometry:w.geometry.map((v,i)=>
  i===4?{...v,lat:v.lat+.0001}:v)}))]
])assert.equal(plan(opts),null,'reject '+name);
assert.equal(JSON.stringify(source[0]),original,'input unchanged');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const t of [
 "from './scripts/osm-italska-flat-roof-5232.js?v=523200'",
 'const italskaFlatRoofPlan5232=planItalskaFlatRoof5232({',
 "const roofPreference=italskaFlatRoofPlan5232?'flat':",
 'if(italskaFlatRoofPlan5232){',
 'window.__miloviceItalskaFlatRoofRuntime5232=()=>',
 "'italska-flat-roof-5232':{",
 'href="?v=523200&streetAudit=italska-flat-roof-5232"'
])assert(html.includes(t),'game integration '+t);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const js=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud,'meta/HUD/runtime version');
// Newer versions must keep this source-locked 5.232 roof regression.
const displayedVersion=html.match(/Verze ([0-9]+)[.]([0-9]+) · build/);
assert(displayedVersion&&(Number(displayedVersion[1])>5||
 Number(displayedVersion[1])===5&&Number(displayedVersion[2])>=232),
 'HUD version must not regress below 5.232');
console.log('PASS 5.232 original OSM Italská flat roof 169.226m2, correct source shape, no new structure');
