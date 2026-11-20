import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaMappedWalkers5162} from './osm-topolova-mapped-walkers-5162.js';
import {planTopolovaPromenade5163} from './osm-topolova-promenade-5163.js';
import {planTopolovaConnectedWalk5164} from './osm-topolova-connected-5164.js';
import {planTopolovaZebraLoop5165} from './osm-topolova-zebra-loop-5165.js';
import {planTopolovaMissionWestSegment5182} from './osm-topolova-foot-path-highlight-5182.js';
const source=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(source).elements;
const buildings=elements.filter(e=>e.tags?.building&&e.geometry);
const ways=elements.filter(e=>e.tags?.highway&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways:buildings});
const shortWalkPlan=planTopolovaMappedWalkers5162({regionId:'mlada',rowPlan,ways});
const promenadePlan=planTopolovaPromenade5163({regionId:'mlada',rowPlan,shortWalkPlan,ways});
const connectedPlan=planTopolovaConnectedWalk5164({regionId:'mlada',rowPlan,shortWalkPlan,promenadePlan,ways});
const loopPlan=planTopolovaZebraLoop5165({regionId:'mlada',connectedPlan,promenadePlan,ways});
assert(loopPlan);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const args={regionId:'mlada',ways,loopPlan,toWorld};
const segment=planTopolovaMissionWestSegment5182(args);
assert(segment);
assert.equal(segment.version,'5.182');
assert.equal(segment.sourceWayId,'1314665579');
assert.equal(segment.originalWayNodes,18);
assert.deepEqual(segment.sourceSegmentIndices,[12,13]);
assert(segment.lengthMeters>102&&segment.lengthMeters<103);
assert.equal(segment.visuallyHighlightOriginalPathOnly,true);
for(const k of ['newWorldMeshes','newPhysicalWalkways','newConnections'])
 assert.equal(segment[k],0);
assert.equal(planTopolovaMissionWestSegment5182({...args,regionId:'old'}),null);
assert.equal(planTopolovaMissionWestSegment5182({...args,loopPlan:{...loopPlan,version:'wrong'}}),null);
assert.equal(planTopolovaMissionWestSegment5182({...args,ways:ways.map(w=>
 String(w.id)==='1314665579'?{...w,tags:{...w.tags,surface:'asphalt'}}:w)}),null);
assert.equal(planTopolovaMissionWestSegment5182({...args,ways:ways.map(w=>
 String(w.id)==='1314665579'?{...w,geometry:w.geometry.map((p,i)=>
 i===12?{...p,lat:p.lat+.0000001}:p)}:w)}),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-topolova-foot-path-highlight-5182.js?v=518200'",
 'window.__miloviceTopolovaMissionWestSegment5182=',
 'window.__miloviceTopolovaMissionLineRuntime5182=()=>',
 "mc.strokeStyle='#53efbe'"
])assert(html.includes(token),'missing 3D game minimap integration: '+token);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),source);
console.log('PASS 5.182: highlight only original 18-node OSM west footway segment 12-13, no imaginary city paths');
