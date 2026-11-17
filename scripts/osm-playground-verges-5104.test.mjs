import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {planOSMPlaygroundLawns} from './osm-playground-verges-5104.js';

// No synthetic lawn may ever be generated from playground or arbitrary map
// rectangles. Input must explicitly carry mapped landuse=grass geometry.
const rect=[{x:0,z:0},{x:30,z:0},{x:30,z:24},{x:0,z:24},{x:0,z:0}];
const playground={id:'1468803906',tags:{leisure:'playground'},points:[
 {x:50,z:0},{x:68,z:0},{x:68,z:18},{x:50,z:18},{x:50,z:0}
]};
const lawn={id:77,tags:{landuse:'grass'},points:rect};
const clear=()=>true,guards={
 roads:{isClear:clear},buildings:{isClear:clear},water:{isClear:clear}
};
const result=planOSMPlaygroundLawns([lawn],[playground],guards);
assert.equal(result.mappedLawns,1);
assert(result.tufts.length>=2);
assert(result.tufts.every(t=>t.sourceLawnId==='77'&&
 t.x>0&&t.x<30&&t.z>0&&t.z<24&&t.positionEstimated));
assert.deepEqual(result.tufts,planOSMPlaygroundLawns(
 [lawn,lawn],[playground],guards).tufts,
 'Overlapping OSM region exports cannot duplicate vegetation');
assert.deepEqual(result.tufts,planOSMPlaygroundLawns(
 [lawn],[{...playground,regionId:'vrutice'}],guards).tufts,
 'Load order and regional provenance cannot change geometry');
for(const t of [
 {landuse:'forest'}, {leisure:'playground'}, {landuse:'residential'}
])assert.equal(planOSMPlaygroundLawns([{...lawn,tags:t}],
 [playground],guards).tufts.length,0);
assert.equal(planOSMPlaygroundLawns([
 {...lawn,tags:{landuse:'grass',access:'private'}}
],[playground],guards).tufts.length,0);
assert.equal(planOSMPlaygroundLawns([lawn],[playground],{
 ...guards,photoAllowed:()=>false}).tufts.length,0);
assert.equal(planOSMPlaygroundLawns([lawn],[playground],{
 ...guards,roads:{isClear:()=>false}}).tufts.length,0);
assert.equal(planOSMPlaygroundLawns([lawn],[playground],{
 ...guards,buildings:{isClear:()=>false}}).tufts.length,0);
assert.equal(planOSMPlaygroundLawns([lawn],[playground],{
 ...guards,water:{isClear:()=>false}}).tufts.length,0);

// Validate the REAL Mladá housing-estate lawns (regional overlaps).
const cos=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const roads=createRoadClearance(),buildings=makeSidewalkBuildingGuard(),
 water=createRoadClearance(),lawns=[],plays=[],seen=new Set();
for(const region of ['mlada','vrutice']){
 const file=new URL('../data/regions/'+region+'.json',import.meta.url);
 for(const el of JSON.parse(readFileSync(file,'utf8')).elements){
  if(seen.has(el.id))continue;
  seen.add(el.id);
  const tags=el.tags||{},points=(el.geometry||[]).map(toWorld);
  if(tags.building&&tags.building!=='roof'&&points.length>=3)
   buildings.add(el.id,points);
  if(tags.highway&&points.length>=2){
   const kind=tags.highway,width=kind==='primary'?11:
    kind==='secondary'?9:kind==='tertiary'?8:
    kind==='pedestrian'?4:kind==='footway'?1.8:
    kind==='path'||kind==='steps'?1.65:kind==='cycleway'?2:
    kind==='service'?4.5:7.8;
   roads.addRoad({id:el.id,kind,width,points});
  }
  if(tags.landuse==='grass')lawns.push({id:el.id,regionId:region,tags,points});
  if(tags.leisure==='playground')plays.push({id:el.id,regionId:region,tags,points});
 }
}
const neighborhood=planOSMPlaygroundLawns(lawns,plays,{roads,buildings,water});
assert.equal(neighborhood.eligiblePlayAreas,4);
assert.equal(neighborhood.mappedLawns,15);
assert.equal(neighborhood.coveredLawns,14);
assert.equal(neighborhood.tufts.length,101);
assert(neighborhood.tufts.every(t=>
 roads.isClear(t.x,t.z,.45,.38)&&
 buildings.isClear(t.x,t.z,.65)&&
 water.isClear(t.x,t.z,.65,.35)));
assert.deepEqual(neighborhood.tufts,planOSMPlaygroundLawns(
 lawns.slice().reverse(),plays.slice().reverse(),{roads,buildings,water}).tufts,
 'Changing the order of regional data must not move vegetation');
assert.equal(new Set(neighborhood.sourceLawnIds).size,
 neighborhood.sourceLawnIds.length);
assert.equal(neighborhood.shrubsOrTreesInvented,0);
assert.equal(neighborhood.sourcePolygonsUntouched,true);
assert.equal(neighborhood.footwaysUntouched,true);

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "import {planOSMPlaygroundLawns} from './scripts/osm-playground-verges-5104.js?v=510400'",
 'const osmPlaygroundLawnWays=[];',
 'const lawnPlan=planOSMPlaygroundLawns(osmPlaygroundLawnWays,osmPlaygroundWays,',
 'window.__milovicePlaygroundLawnAudit={',
 'visualBatch(createLawnBlades(),lawnBladeMaterial,lawnItems)'
])assert(html.includes(token),'Missing 5.104 3D lawn integration: '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],
 id=html.match(/const BUILD_ID='([^']+)'/)?.[1],
 hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===id&&id===hud,'Three build stamps must match');
console.log('PASS 5.104 source-only Mladá grass patches',{
 mapped:neighborhood.mappedLawns,detailed:neighborhood.coveredLawns,
 tufts:neighborhood.tufts.length,sourcePlaygrounds:neighborhood.eligiblePlayAreas
});
