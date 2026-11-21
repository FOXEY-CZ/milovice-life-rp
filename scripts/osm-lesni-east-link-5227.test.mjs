import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LESNI_EAST_LINK_5227 as C,planLesniEastLink5227 as plan} from './osm-lesni-east-link-5227.js';
const text=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(text).elements,ids=[
 C.sidewalk.id,C.westCrossing.id,C.eastCrossing.id,C.pavedContinuation.id
];
const selected=ids.map(id=>ways.filter(w=>String(w.id)===id));
assert(selected.every(a=>a.length===1),'four unique original OSM ways');
const original=JSON.stringify(selected);
const p=plan('mlada',ways);
assert(p,'original GPS, tags and exact junctions required');
assert.deepEqual(p.sourceWayIds,ids);
assert.deepEqual(p.sourceHashes,['53198096','5409dbf7','097b2218','476fa89b']);
assert.equal(p.originalSegments,4);assert.equal(p.originalMeters,41.608);
assert.equal(p.neutralFootwayId,'1057549996');
assert.equal(p.neutralMaterial,'visnova-footway-model');
assert.equal(p.westJunctionGPS,'50.2292850,14.8700204');
assert.equal(p.eastJunctionGPS,'50.2292113,14.8695157');
assert.equal(p.westCrossingMarkings,'yes');
assert.equal(p.eastCrossingMarkings,'zebra');
assert.equal(p.eastCrossingIsland,'yes');
assert.equal(p.pavedContinuationSurface,'paving_stones');
for(const k of ['addedFootways','addedCrossings','addedZebras','addedBuildings',
 'addedColliders','addedStreetFurniture'])assert.equal(p[k],0);
const change=(id,f)=>ways.map(w=>String(w.id)===id?f(w):w);
assert.equal(plan('wrong',ways),null);
assert.equal(plan('mlada',ways.filter(w=>String(w.id)!==ids[0])),null);
assert.equal(plan('mlada',[...ways,selected[0][0]]),null);
for(const id of ids){
 const w=ways.find(w=>String(w.id)===id);
 assert.equal(plan('mlada',change(id,w=>({...w,geometry:w.geometry.map((v,i)=>
  i===0?{...v,lat:v.lat+.0000001}:v)}))),null,'GPS drift '+id);
 assert.equal(plan('mlada',change(id,w=>({...w,tags:{...w.tags,surface:'asphalt'}}))),
  null,'invented surface '+id);
}
assert.equal(plan('mlada',change(ids[2],w=>({...w,tags:{...w.tags,'crossing:markings':'no'}}))),
 null,'zebra must not change');
assert.equal(plan('mlada',change(ids[1],w=>({...w,tags:{...w.tags,'crossing:markings':'zebra'}}))),
 null,'marked crossing differs from zebra-tagged eastern crossing');
assert.equal(JSON.stringify(selected),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),text);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-lesni-east-link-5227.js?v=522700'",
 'const lesniEastPlan5227=planLesniEastLink5227(regionId,roadWays);',
 'const lesniEastNeutral5227=lesniEastPlan5227?.neutralFootwayId===String(el.id);',
 'material:lesniEastPlan5227.neutralMaterial',
 'osmSurfaceAudit.drawnSegments-lesniEastDrawBefore5227',
 'window.__miloviceLesniEastRuntime5227=()=>',
 "'lesni-east-link-5227':{",
 'href="?v=522700&streetAudit=lesni-east-link-5227"',
 'window.__miloviceLesniEastAudit5227=null;'
])assert(html.includes(token),'missing actual gameplay integration '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const run=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===run&&run===hud,'build labels must match');
console.log('PASS 5.227 41.608m / 4 real segments between two original crossings; tagged paved continuation, zero invented geometry');
