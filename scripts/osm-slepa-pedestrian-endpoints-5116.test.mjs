import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSlepaPedestrianEndpointSeams} from './osm-slepa-pedestrian-endpoints-5116.js';
const cos=Math.cos(50.226*Math.PI/180),k=111320;
const toWorld=p=>({x:(p.lon-14.889)*k*cos,z:-(p.lat-50.226)*k});
const anchor=toWorld({lat:50.2287911,lon:14.8594455});
const clear={isClear:()=>true};
function load(area){
 const els=JSON.parse(readFileSync(new URL(
  '../data/regions/'+area+'.json',import.meta.url),'utf8')).elements;
 const ways=els.filter(e=>e.tags?.highway&&e.geometry?.length>=2)
  .map(e=>({id:e.id,tags:e.tags,points:e.geometry.map(toWorld)}));
 const widths=new Map(ways.map(w=>[String(w.id),
  w.tags.highway==='footway'?1.8:
  w.tags.highway==='path'?1.65:7.8]));
 const args={regionId:area,widths,anchor,radius:280,maxSeams:35,
  carriageways:clear,buildings:clear};
 const plan=planSlepaPedestrianEndpointSeams(ways,args);
 assert(plan.seams.length>=1&&plan.seams.length<=8,
  'Only documented shared endpoints should be eligible');
 assert(plan.seams.some(s=>s.wayIds.join(',')==='1468803943,1468803947'));
 assert.deepEqual(plan.seams,
  planSlepaPedestrianEndpointSeams([...ways].reverse(),args).seams);
 assert.deepEqual(plan.seams,
  planSlepaPedestrianEndpointSeams([...ways,...ways],args).seams);
 assert.equal(plan.newWalkways,0);
 assert.equal(plan.newCrossings,0);
 assert.equal(plan.inferredConnectionNodes,0);
 for(const seam of plan.seams){
  const [a,b]=seam.wayIds.map(id=>ways.find(w=>String(w.id)===id));
  assert(a&&b);
  assert.equal(a.tags.highway,'footway');
  assert.equal(b.tags.highway,'footway');
  assert.notEqual(a.tags.footway,'crossing');
  assert.notEqual(b.tags.footway,'crossing');
  assert.equal((a.tags.surface||'').toLowerCase(),
   (b.tags.surface||'').toLowerCase());
  assert.equal(seam.width,1.8);
  const endpoints=[a.points[0],a.points.at(-1)];
  const otherEndpoints=[b.points[0],b.points.at(-1)];
  const dist=(v,w)=>Math.hypot(v.x-w.x,v.z-w.z);
  assert(endpoints.some(e=>dist(e,seam.node)<.04));
  assert(otherEndpoints.some(e=>dist(e,seam.node)<.04));
  const h=seam.width*.5;
  assert(Math.abs(dist(seam.a,seam.node)-h)<.04);
  assert(Math.abs(dist(seam.b,seam.node)-h)<.04);
  assert(seam.areaSquareMeters>.06&&seam.areaSquareMeters<2.8);
 }
 const denied=ways.map(w=>({
  ...w,
  tags: w.id===1468803943?{...w.tags,access:'private'}:w.tags
 }));
 assert(!planSlepaPedestrianEndpointSeams(denied,args).seams.some(s=>
  s.wayIds.includes('1468803943')));
 assert.equal(planSlepaPedestrianEndpointSeams(ways,{
  ...args,carriageways:{isClear:()=>false}}).seams.length,0);
 assert.equal(planSlepaPedestrianEndpointSeams(ways,{
  ...args,buildings:{isClear:()=>false}}).seams.length,0);
 assert.equal(planSlepaPedestrianEndpointSeams(ways,{
  ...args,photoAllowed:()=>false}).seams.length,0);
 assert.equal(planSlepaPedestrianEndpointSeams(ways,{
  ...args,regionId:'old'}).seams.length,0);
 assert.equal(planSlepaPedestrianEndpointSeams(ways,{
  ...args,widths:new Map()}).seams.length,0);
 assert.equal(planSlepaPedestrianEndpointSeams(ways,{
  ...args,maxSeams:0}).seams.length,0);
 return {ways,plan};
}
const a=load('mlada'),b=load('vrutice');
const pair='1468803943,1468803947';
assert(a.plan.seams.some(s=>s.wayIds.join(',')===pair));
assert(b.plan.seams.some(s=>s.wayIds.join(',')===pair));
const shared=a.ways.find(w=>w.id===1468803943);
const eye={lat:50.23013545,lon:14.8582529};
const orig=shared.points[0],last=shared.points[1];
const middle={x:(orig.x+last.x)/2,z:(orig.z+last.z)/2};
assert(Math.hypot(toWorld(eye).x-middle.x,toWorld(eye).z-middle.z)<.001);
const dir=(Math.atan2(
 (14.8583307-eye.lon)*cos,
 50.230134-eye.lat)*180/Math.PI+360)%360;
assert(Math.abs(dir-91.7)<.2);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const t of [
 "from './scripts/osm-slepa-pedestrian-endpoints-5116.js?v=511600'",
 "'slepa-walk-5116':{",
 "camera:{lat:50.23013545,lon:14.8582529},heading:91.7,",
 "const endpointSeams=planSlepaPedestrianEndpointSeams(",
 "radius:280,maxSeams:35,",
 "carriageways:osmCarriagewayClearance,",
 "buildings:taggedSidewalkBuildings,",
 "geo.setIndex([0,1,2]);",
 "queueRoadStrip(geo,material,mx,mz);",
 "window.__miloviceSlepaPedestrianSeamAudit={",
 "actualWebGLVisibilityNotYetVerified:true"
 ])assert(html.includes(t),'5.116 integration missing: '+t);
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
assert.match(build,/^\d{8}-[a-z0-9-]+-\d{6}$/);
assert.equal(html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],build);
assert.equal(html.split('id="build-label">')[1]?.split('</strong>')[0],build);
for(const old of ['slepa-armadni-bends-5115','slepa-park-5114',
 'slepa-utilities-5113','slepa-houses-5112'])
 assert(html.includes(old));
console.log('PASS 5.116 OSM shared pedestrian endpoints',{
 mlada:a.plan.seams.length,vrutice:b.plan.seams.length,
 guaranteedSharedPair:pair,noFictionalCrossings:true
});
