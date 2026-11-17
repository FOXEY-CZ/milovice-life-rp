// 5.122: regression for a bug that only appeared in running WebGL.
// OSM building renderer removes the repeated terminal polygon vertex.
// BILLA still had six open corners, but real Poliklinika has only FOUR.
// The old planArmLandmarkMassing minimum of five caused clinic omission.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planArmLandmarkMassing} from './osm-armadni-landmarks-5118.js';
const all=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const k=111320,c=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*k*c,z:-(p.lat-50.226)*k});
for(const [id,unique,area,kind] of [
 [53865798,6,1125.8,'supermarket'],
 [1057548624,4,827.58,'polyclinic']
]){
 const e=all.find(x=>x.id===id);
 assert(e&&e.geometry.length===unique+1,'Closed OSM ring expected');
 const closed=e.geometry.map(world);
 const open=closed.slice(0,-1);
 const base={id:e.id,regionId:'mlada',tags:e.tags};
 const a=planArmLandmarkMassing({...base,points:closed});
 const b=planArmLandmarkMassing({...base,points:open});
 assert(a&&b,'Same actual building must render with open/closed OSM ring '+id);
 assert.deepEqual(b,a,'No facade/height changes due solely to terminal closure');
 assert.equal(b.footprintVertices,unique);
 assert.equal(b.kind,kind);
 assert(Math.abs(b.polygonAreaSquareMeters-area)<.02);
 assert.equal(b.originalFootprintUntouched,true);
 assert.equal(b.newBuildingsCreated,0);
 assert.equal(b.newPathsCreated,0);
 assert.equal(planArmLandmarkMassing({...base,points:open.slice(0,-1)}),null,
  'Reject truncated authentic OSM footprint');
 assert.equal(planArmLandmarkMassing({
  ...base,points:[...open,open[0],open[1]]}),null,
  'Reject bad extra vertices even when total area happens to match');
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes(
 "from './scripts/osm-armadni-landmarks-5118.js?v=512200'"));
assert(html.includes("const armLandmark=planArmLandmarkMassing({"));
assert(html.includes("const isArmClinic=armLandmark?.kind==='polyclinic'"));
assert(html.includes("const isArmBilla=armLandmark?.kind==='supermarket'"));
assert(html.includes("window.__miloviceClinicEntranceRuntime=()=>{"));
assert(/const BUILD_ID='20\d{6}-[a-z0-9-]+'/.test(html));
assert(/href="\?v=\d{6}&streetAudit=armadni-clinic-5118"/.test(html));
console.log('PASS 5.122: 4-corner open clinic and 6-corner open BILLA survive real OSM de-closure');
