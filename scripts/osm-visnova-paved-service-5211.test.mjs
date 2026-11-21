/** 5.211 source-locked OSM paving-stone service road material integration. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_PAVED_SERVICE_5211 as cfg,planVisnovaPavedService5211 as plan}
 from './osm-visnova-paved-service-5211.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const es=JSON.parse(raw).elements;
const wanted=cfg.ways.map(w=>es.find(e=>String(e.id)===w.id));
assert.equal(wanted.length,2);
assert(wanted.every(Boolean),'both original mapped service roads must exist');
const plans=wanted.map(w=>plan('mlada',w));
assert(plans.every(Boolean),'both source geometry hashes and paving tags must match');
assert.deepEqual(plans.map(p=>p.sourceOSMId),
 ['1050191982','1100829870']);
assert.deepEqual(plans.map(p=>p.sourceSegments),[5,4]);
assert.equal(plans.reduce((n,p)=>n+p.sourceSegments,0),9);
for(const p of plans){
 assert.equal(p.sourceTag,'paving_stones');
 assert.equal(p.material,'visnova-tagged-paving-stones');
 assert.equal(p.originalGPSUnchanged,true);
 assert.equal(p.originalRoadWidthUnchanged,true);
 assert.equal(p.originalTrafficUnchanged,true);
 assert.equal(p.modelTintNotPhotoVerified,true);
 for(const k of ['newRoads','newFootways','newParking','newCrossings',
  'newRoadsideObjects','newColliders'])assert.equal(p[k],0,k);
}
for(const w of wanted){
 assert.equal(plan('vrutice',w),null);
 assert.equal(plan('mlada',{...w,id:0}),null);
 assert.equal(plan('mlada',{...w,tags:{...w.tags,surface:'asphalt'}}),null);
 assert.equal(plan('mlada',{...w,tags:{...w.tags,highway:'footway'}}),null);
 assert.equal(plan('mlada',{...w,tags:{...w.tags,lit:'no'}}),null);
 assert.equal(plan('mlada',{...w,geometry:w.geometry.slice(1)}),null);
 assert.equal(plan('mlada',{...w,geometry:w.geometry.map((p,i)=>
  i===1?{...p,lon:p.lon+.0000001}:p)}),null);
}
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 raw,'source OSM data must never change');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-visnova-paved-service-5211.js?v=521100'",
 'planVisnovaPavedService5211(regionId,el)',
 'visnovaService5211.material',
 'roadWidthsPreserved:true',
 '__miloviceVisnovaPavedServiceRuntime5211',
 'window.__miloviceVisnovaPavedServiceAudit5211.renderedSegments+=',
 "'visnova-paved-service-5211':{",
 'href="?v=521100&streetAudit=visnova-paved-service-5211"',
 "const BUILD_ID='20261121-visnova-paved-service-521100'"
])assert(html.includes(needle),'missing actual game integration '+needle);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud,'HUD, metadata and runtime build must match');
console.log('PASS 5.211: two source-locked OSM service roads, 9 paved segments, zero invented connections, traffic/width untouched');
