// Milovice RP 5.248: source-polygon validated yellow tactile bands
// on two original Milovice railway platforms, never guessed street furniture.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planMappedPlatformEdging5248 as plan}
 from './osm-station-platform-edging-5248.js';
const p=(x,y)=>({x,y});
const square=[p(0,0),p(20,0),p(20,12),p(0,12),p(0,0)];
const rails=[[p(-5,-2),p(25,-2)]];
const basic=plan({outline:square,tracks:rails});
assert.equal(basic.reason,'source-checked');
assert.equal(basic.originalPlatformGeometryPreserved,true);
assert.equal(basic.originalRailwayGeometryPreserved,true);
assert.equal(basic.newColliders,0);
assert(basic.strips.some(s=>s.sourceEdge===0&&s.len>18),
 'long original rail-side edge must retain its visible tactile paint');
assert(basic.strips.every(s=>s.sourceEdge!==2),
 'platform back wall too far from the original tracks must not be painted');
assert.equal(plan({outline:square,tracks:[]}).strips.length,0,
 'No OSM track data means no inferred edge marking');
assert.equal(plan({outline:square,tracks:rails,resolution:8}).strips.length,0);
assert.equal(plan({outline:[],tracks:rails}).strips.length,0);
// 5.247 style fail-closed continuity: a narrow concavity reaching into the
// 0.32–0.82m tactile band MUST break a long yellow stripe, not bridge air.
const notched=[p(0,0),p(20,0),p(20,3),p(12,3),p(12,.4),
 p(8,.4),p(8,3),p(0,3),p(0,0)];
const cut=plan({outline:notched,tracks:[[p(-5,-1.5),p(25,-1.5)]]});
const front=cut.strips.filter(s=>s.sourceEdge===0);
assert(front.length>=2,'notch must split original bottom rail-side edge');
assert(front.some(s=>s.b.x<8.2));
assert(front.some(s=>s.a.x>11.8));
assert(front.every(s=>s.b.x<=8.01||s.a.x>=11.99),
 'Yellow paint must never cross the original platform notch');
const reversed=plan({outline:[...square].reverse(),tracks:rails});
assert(Math.abs(reversed.meters-basic.meters)<.1,
 'Reversing original OSM winding cannot move bands off the platform');
const farRails=[[p(-5,-7),p(25,-7)]];
assert.equal(plan({outline:square,tracks:farRails}).strips.length,0,
 'No false platform stripe 7m from any source rail');
// Strictly source-documented Milovice station OSM platforms.
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const world=q=>p((q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 -(q.lat-50.226)*111320);
const originalRails=elements.filter(e=>e.tags?.railway==='rail'&&
 e.geometry?.length>=2).map(e=>e.geometry.map(world));
const expected=[549346219,994855884];
let count=0,total=0,rejected=0;
for(const id of expected){
 const e=elements.find(e=>e.id===id);
 assert(e&&e.tags?.railway==='platform');
 assert.equal(e.tags.area,'yes');
 assert.equal(e.tags.shelter,'yes');
 const result=plan({outline:e.geometry.map(world),tracks:originalRails});
 assert.equal(result.reason,'source-checked');
 assert.equal(result.strips.length,13,
  'original platform geometry changed; review source lock before repaint');
 assert(result.meters>200&&result.meters<300);
 assert(result.rejectedCells>=2);
 assert(result.examinedCells>200);
 for(const strip of result.strips){
  assert(strip.len>.2&&strip.len<110);
  assert(Number.isInteger(strip.sourceEdge)&&strip.sourceEdge>=0);
  assert(Math.abs(Math.hypot(strip.nx,strip.ny)-1)<1e-7);
 }
 count+=result.strips.length;
 total+=result.meters;rejected+=result.rejectedCells;
}
assert.equal(count,26,'source-mapped platform strips on two platforms');
assert(total>500&&total<505);
assert(rejected>250);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw,
 'original RUIAN/OSM file must remain untouched');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const key of [
 "from './scripts/osm-station-platform-edging-5248.js?v=524800'",
 'planMappedPlatformEdging5248({outline:points,tracks:rails})',
 'window.__milovicePlatformEdgingRuntime5248=()=>',
])assert(html.includes(key),'Missing 5.248 scene integration '+key);
assert(Number(html.match(/Verze 5[.](\d+)/)?.[1])>=248,
 'Newer game builds must preserve the 5.248 station regression');
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===build&&build===hud);
console.log('PASS 5.248: '+count+' source-polygon-safe tactile bands, '+
 Math.round(total)+'m; '+rejected+' unsafe cells rejected; OSM source unchanged');
