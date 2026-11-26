// Milovice RP 5.115 — regression on shipped OSM Slepá/Armádní road files.
// No invented street segments, widths, crossings or private driveway joins.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSlepaArmRoadCornerWedges} from './osm-slepa-armadni-road-joins-5115.js';
import {planMappedRoadWidth} from './osm-road-width-5108.js';
const cos=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function source(region){
 return JSON.parse(readFileSync(new URL(
  '../data/regions/'+region+'.json',import.meta.url),'utf8')).elements;
}
function check(region){
 const data=source(region);
 const mapped=data.filter(e=>e.tags?.highway==='residential'&&
  ['Slepá','Armádní'].includes(e.tags.name));
 const ways=mapped.map(e=>({id:e.id,tags:e.tags,
  points:e.geometry.map(toWorld)}));
 const widths=new Map(ways.map(w=>[String(w.id),
  planMappedRoadWidth(w.tags,7.8,region).width]));
 const plan=planSlepaArmRoadCornerWedges(ways,{regionId:region,widths});
 assert(plan.wedges.length>=20&&plan.wedges.length<=70,
  'Existing multi-node road bends must yield bounded small seals');
 assert(plan.eligibleWays>=5);
 assert(plan.existingRoadCenterlinesUntouched);
 assert(plan.sourceWidthsUnchanged);
 assert.equal(plan.syntheticNewRoads,0);
 assert.equal(plan.inventedSidewalks,0);
 assert.equal(plan.inventedCrossings,0);
 assert.deepEqual(plan.wedges,
  planSlepaArmRoadCornerWedges(ways.slice().reverse(),{
   regionId:region,widths}).wedges,'Import order must be irrelevant');
 assert.deepEqual(plan.wedges,
  planSlepaArmRoadCornerWedges([...ways,...ways],{
   regionId:region,widths}).wedges,'Duplicate region exports must not add seals');
 for(const wedge of plan.wedges){
  const way=ways.find(w=>String(w.id)===wedge.sourceWayId);
  assert(way&&wedge.street===way.tags.name);
  assert.equal(wedge.highway,'residential');
  assert.equal(wedge.width,widths.get(wedge.sourceWayId));
  assert.equal(wedge.sourceSurface,way.tags.surface||null);
  assert(Number.isInteger(wedge.sourceVertexIndex));
  const p=way.points[wedge.sourceVertexIndex];
  assert(dist(wedge.c,p)<1e-7,'Corner anchor must be an ORIGINAL OSM node');
  const half=wedge.width*.5;
  assert(Math.abs(dist(wedge.a,p)-half)<1e-7);
  assert(Math.abs(dist(wedge.b,p)-half)<1e-7);
  const computedArea=.5*Math.abs((wedge.a.x-p.x)*(wedge.b.z-p.z)-
   (wedge.b.x-p.x)*(wedge.a.z-p.z));
  assert(Math.abs(computedArea-wedge.areaSquareMeters)<.001);
  assert(wedge.areaSquareMeters>.08&&wedge.areaSquareMeters<=13);
  assert(wedge.fromExistingOSMVertex&&wedge.modeledWidth);
 }
 const blocked=ways.map(w=>({...w,tags:{...w.tags,access:'private'}}));
 assert.equal(planSlepaArmRoadCornerWedges(blocked,{regionId:region,widths})
  .wedges.length,0);
 assert.equal(planSlepaArmRoadCornerWedges(ways.map(w=>({
  ...w,tags:{...w.tags,name:'FakeStreet'}
 })),{regionId:region,widths}).wedges.length,0);
 assert.equal(planSlepaArmRoadCornerWedges(ways,{
  regionId:'old',widths}).wedges.length,0);
 assert.equal(planSlepaArmRoadCornerWedges(ways,{
  regionId:region,widths:new Map()}).wedges.length,0);
 assert.equal(planSlepaArmRoadCornerWedges(ways,{
  regionId:region,widths,maxWedges:5}).wedges.length,5);
 return {count:plan.wedges.length,streets:[...new Set(plan.wedges.map(t=>t.street))],
  sourceIds:plan.sourceWayIds};
}
const results={mlada:check('mlada'),vrutice:check('vrutice')};
const mlada=source('mlada');
const slepa=mlada.find(e=>e.id===202375815);
const armadni=mlada.find(e=>e.id===800846496);
assert.equal(slepa.tags.name,'Slepá');
assert.equal(armadni.tags.name,'Armádní');
const roadEye={lat:(slepa.geometry[3].lat+slepa.geometry[4].lat)/2,
 lon:(slepa.geometry[3].lon+slepa.geometry[4].lon)/2};
assert(Math.abs(roadEye.lat-50.22875565)<1e-8);
assert(Math.abs(roadEye.lon-14.8593245)<1e-8);
const target=armadni.geometry[0];
const heading=(Math.atan2((target.lon-roadEye.lon)*cos,
 target.lat-roadEye.lat)*180/Math.PI+360)%360;
assert(Math.abs(heading-65.4)<.2);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "from './scripts/osm-slepa-armadni-road-joins-5115.js?v=511500'",
 "'slepa-armadni-bends-5115':{",
 'camera:{lat:50.22875565,lon:14.8593245},heading:65.4,',
 'const slepaArmJoinPlan=planSlepaArmRoadCornerWedges(',
 'regionId,widths:roadWidths,maxWedges:120',
 'const material=osmMappedSurfaceMaterials[surface?.material]||osmRoadMaterial;',
 'geo.computeVertexNormals();geo.computeBoundingSphere();',
 'queueRoadStrip(geo,material,midX,midZ);',
 'geo.setIndex([0,1,2]);',
 'window.__miloviceSlepaArmRoadJoinAudit={',
 'createdNewRoads:0,createdCrossings:0,createdSidewalks:0'
 ])assert(html.includes(term),'Missing 5.115 integration: '+term);
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
assert.match(build,/^\d{8}-[a-z0-9-]+-\d{6}$/);
assert.equal(html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],build);
assert.equal(html.split('id="build-label">')[1]?.split('</strong>')[0],build);
for(const preserve of [
 "streetAudit=slepa-park-5114",
 "streetAudit=slepa-utilities-5113",
 "streetAudit=slepa-houses-5112",
 "mountStreetAuditMenu",
 "safePedestrianPieces(a,b,width,osmCarriagewayClearance)"
 ])assert(html.includes(preserve));
console.log('PASS 5.115: original Slepá + Armádní inside-bend seams',results,
 {cameraBearing:+heading.toFixed(1),alteredOSMNodes:0});
