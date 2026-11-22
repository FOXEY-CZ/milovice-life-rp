import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {POD_LESEM_TRACK_5273 as S,planPodLesemTrack5273 as plan}
 from './osm-pod-lesem-track-5273.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements,snapshot=JSON.stringify(E);
const widths=new Map([[S.trackId,3.2],[S.roadId,6]]);
const opts={regionId:'mlada',ways:E,widths};
const p=plan(opts);
assert(p,'strict OSM source-locked compacted track starts on existing Pod Lesem');
assert.equal(p.version,'5.273');
assert.equal(p.sourceTrackId,'1011197688');
assert.equal(p.sourceRoadId,'128087258');
assert.equal(p.sourceTrackHash,'00b3e58a');
assert.equal(p.trackSurface,'compacted');
assert.equal(p.firstTrackOriginalMetres>4&&p.firstTrackOriginalMetres<5,true);
assert(p.visualTrimMetres>3.04&&p.visualTrimMetres<3.07);
assert(p.firstTrackVisibleMetres>1.30&&p.firstTrackVisibleMetres<1.40);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
assert(Math.abs(dist(p.renderStart,p.sourceFirstEnd)-
 p.firstTrackVisibleMetres)<.0001);
assert(p.renderStart.x!==p.sourceFirstEnd.x);
assert(p.unchangedTrackGraph&&p.unchangedTrackGPS&&p.unchangedRoadGPS);
assert(p.unchangedVehicleAccess&&p.unchangedNPCGraph);
for(const k of ['newRoads','newTrackWays','newCrossings',
 'newKerbs','newColliders','newTextures'])assert.equal(p[k],0,k);
assert.equal(plan({...opts,regionId:'old'}),null);
assert.equal(plan({...opts,widths:new Map([[S.trackId,4],[S.roadId,6]])}),null);
assert.equal(plan({...opts,widths:new Map([[S.trackId,3.2],[S.roadId,7]])}),null);
for(const id of [S.trackId,S.roadId]){
 assert.equal(plan({...opts,ways:E.filter(x=>String(x.id)!==id)}),null);
 const orig=E.find(x=>String(x.id)===id);
 assert.equal(plan({...opts,ways:[...E,orig]}),null);
 for(const mode of ['gps','tag']){
  const changed=E.map(x=>String(x.id)===id?
   (mode==='tag'?{...x,tags:{...x.tags,surface:'gravel'}}:
    {...x,geometry:x.geometry.map((v,i)=>i===1?
     {...v,lon:v.lon+.0000001}:v)}):x);
  assert.equal(plan({...opts,ways:changed}),null,mode+' '+id);
 }
}
assert.equal(JSON.stringify(E),snapshot);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-pod-lesem-track-5273.js?v=527300'",
 'const podLesemTrackPlan5273=planPodLesemTrack5273({',
 'regionId,ways:roadWays,widths:roadWidths',
 'osmRoadSegment(new THREE.Vector2(trackSeam5273.renderStart.x,',
 'osmRoadSegment(points[i-1],points[i],width,kind,surfacePlan);',
 "window.__milovicePodLesemTrackRuntime5273=()=>({",
 "'pod-lesem-track-seam-5273':{",
 "const BUILD_ID='20261122-pod-lesem-branch-walker-527900'"
 ])assert(html.includes(token),'missing 5.273 integration '+token);
console.log('PASS 5.273 mapped compacted track paint trimmed ~3.05m at 6m asphalt edge, no graph/OSM changes');
