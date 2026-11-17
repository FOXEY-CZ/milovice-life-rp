// Milovice RP 5.111: complete existing mapped footway bends near Slepá.
// No new footpaths: each triangle is a tiny corner inside two mapped strips.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planMladaFootwayCorners} from './osm-mlada-footway-joins-5106.js';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {planMappedRoadWidth} from './osm-road-width-5108.js';
import {planSlepaDrivewayWidth} from './osm-slepa-street-5110.js';
const cos=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const load=region=>JSON.parse(readFileSync(new URL(
 '../data/regions/'+region+'.json',import.meta.url),'utf8')).elements;
const mlada=load('mlada'),vrutice=load('vrutice');
const source=vrutice.find(e=>String(e.id)==='202375817');
assert.equal(source?.tags?.name,'Slepá');
assert.equal(source.geometry.length,2);
const [a,b]=source.geometry.map(toWorld);
const anchor={x:(a.x+b.x)*.5,z:(a.z+b.z)*.5,
 sourceId:String(source.id)};
assert(Math.abs(anchor.x+2139.7898163)<.001);
assert(Math.abs(anchor.z+137.931046)<.001);
const roadway=new Set(['primary','secondary','tertiary','residential',
 'unclassified','service','living_street','track']);
const isCarriageway=kind=>roadway.has(kind);
const defaultWidth=kind=>kind==='primary'?11:kind==='secondary'?9:
 kind==='tertiary'?8:kind==='footway'?1.8:kind==='path'?1.65:
 kind==='steps'?1.65:kind==='service'?4.5:kind==='track'?3.2:7.8;
function geometry(elements){
 const roads=createRoadClearance(),buildings=makeSidewalkBuildingGuard(),
  footways=[];
 for(const e of elements){
  const kind=e.tags?.highway,points=e.geometry?.map(toWorld)||[];
  if(e.tags?.building)buildings.add(e.id,points);
  if(isCarriageway(kind)){
   const w=planMappedRoadWidth(e.tags,defaultWidth(kind),'vrutice');
   const driveway=planSlepaDrivewayWidth({id:e.id,tags:e.tags,
    regionId:'vrutice',baseWidth:w.width});
   roads.addRoad({id:e.id,points,kind,width:driveway.width});
  }
  if(kind==='footway'||kind==='path')
   footways.push({id:e.id,tags:e.tags,points});
 }
 return {roads,buildings,footways};
}
for(const [region,elements] of [['mlada',mlada],['vrutice',vrutice]]){
 const inputs=geometry(elements);
 const opts={roads:inputs.roads,buildings:inputs.buildings,
  anchor,maxDistance:145,maxTriangles:220};
 const planned=planMladaFootwayCorners(inputs.footways,opts);
 assert(planned.sealedCorners>=12&&planned.sealedCorners<100,
  'Source-backed real OSM bend triangles expected in '+region);
 assert(planned.mappedEligibleWays>=5&&planned.sourceWayIds.length>=5);
 assert(planned.skippedCrossings>=20);
 assert.equal(planned.syntheticNewWalkways,0);
 assert.equal(planned.inventedZebraStripes,0);
 assert.equal(planned.originalWayNodesUnchanged,true);
 assert.equal(new Set(planned.triangles.map(t=>
  t.sourceWayId+'#'+t.atNode)).size,planned.sealedCorners);
 for(const t of planned.triangles){
  assert(t.onlyFillsExistingPathBend&&t.area>0&&t.area<.85);
  const p={x:(t.a.x+t.b.x+t.c.x)/3,
   z:(t.a.z+t.b.z+t.c.z)/3};
  assert(Math.hypot(t.c.x-anchor.x,t.c.z-anchor.z)<=145);
  assert([t.a,t.b,t.c,p].every(q=>
   inputs.roads.isClear(q.x,q.z,.07,.06)&&
   inputs.buildings.isClear(q.x,q.z,.10)),
   'Footway wedge cannot occupy carriageway or building '+t.sourceWayId);
 }
 assert.deepEqual(
  planMladaFootwayCorners(inputs.footways.slice().reverse(),opts).triangles,
  planned.triangles,'OSM serialization order cannot change geometry');
 const duplicate=planMladaFootwayCorners(
  [...inputs.footways,...inputs.footways],opts);
 assert.deepEqual(duplicate.triangles,planned.triangles,
  'Overlapping regional ways must not create duplicate corners');
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "if(regionId==='mlada'||regionId==='vrutice'){",
 "const fromRegion=roadWays.find(e=>String(e.id)==='202375817'",
 'anchor:sourceAnchor,maxDistance:145,maxTriangles:220,',
 "mesh.name='Milovice_OSM_Slepa_FootwayCornerJoin_5111';",
 'window.__miloviceSlepaFootwayJoinAudit=prior;',
 'window.__miloviceSlepaFootwayJoinRuntime=()=>{',
 'checkedSceneParentChain:true',
 'sourceWayNodesChanged:0',
 'newPedestrianRoutes:0,newCrosswalks:0'
])assert(html.includes(term),'Missing 5.111 game scene integration: '+term);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],
 build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
assert(meta===build&&build.endsWith('511100'));
console.log('PASS 5.111 Slepá OSM pedestrian bends',{
 sourceStreet:'202375817',verifiedRegions:['mlada','vrutice'],
 syntheticPaths:0,originalFootwaysUnchanged:true
});
