import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {auditTopolovaPedestrianTopology5174} from './osm-topolova-pedestrian-topology-5174.js';
const source=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(source).elements;
const buildings=elements.filter(x=>x.tags?.building&&x.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways:buildings});
assert(rowPlan);
const opts={regionId:'mlada',elements,rowPlan};
const audit=auditTopolovaPedestrianTopology5174(opts);
assert(audit,'source locked Topolova topology must load');
assert.equal(audit.version,'5.174');
assert.equal(audit.sourceRoadId,'8618275');
assert.equal(audit.roadGeometryHash,'c0fe69b0');
assert.equal(audit.knownLoopWaysPresent,true);
assert.equal(audit.knownLoopTopologicallyConnected,true,
 'existing 5.165 loop sidewalks and zebras must remain in one graph component');
assert(audit.pedestrianWayCount>=4);
assert(audit.sharedVertexConnections>=4);
assert.equal(audit.adjacency.length,audit.pedestrianWayCount);
for(const a of audit.adjacency){
 assert(!a.connectedWayIds.includes(a.id));
 for(const id of a.connectedWayIds){
  const reverse=audit.adjacency.find(b=>b.id===id);
  assert(reverse?.connectedWayIds.includes(a.id),
   'OSM adjacency must be symmetric '+a.id+' <> '+id);
 }
}
assert.equal(audit.components.flat().length,audit.pedestrianWayCount);
assert.equal(new Set(audit.components.flat()).size,audit.pedestrianWayCount);
for(const k of ['inferredMissingPaths','newMeshes','newFootways',
 'newCrossings','newColliders'])assert.equal(audit[k],0);
assert.equal(audit.realWorldAccessibilityProven,false);
assert.equal(auditTopolovaPedestrianTopology5174({...opts,
 regionId:'unknown'}),null);
assert.equal(auditTopolovaPedestrianTopology5174({...opts,
 elements:elements.filter(e=>String(e.id)!=='8618275')}),null);
assert.equal(auditTopolovaPedestrianTopology5174({...opts,
 elements:elements.map(e=>String(e.id)==='8618275'?
 {...e,geometry:e.geometry.map((p,i)=>i===1?{...p,lat:p.lat+.0000001}:p)}:e)}),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 source,'OSM untouched');
console.log('PASS 5.174 exact OSM walking graph: '+JSON.stringify({
 ways:audit.pedestrianWayCount,components:audit.componentCount,
 sharedNodeLinks:audit.sharedVertexConnections,
 isolated:audit.isolatedWayIds,loopConnected:audit.knownLoopTopologicallyConnected
}));
