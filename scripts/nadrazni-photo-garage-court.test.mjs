// Milovice RP 5.63: real-photo garage row geometry and no invented door numbers.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PHOTO_GARAGE_COURT,isPhotoGarageWay,planPhotographedGarageCourt}
 from './nadrazni-photo-garage-court.js';
import {planGroundedEntrance} from './entrance-grade.js';
import {exteriorFacadeFrame} from './facade-anchors.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const ways=JSON.parse(read('data/milovice-osm.json')).elements;
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
assert.equal(PHOTO_GARAGE_COURT.ids.length,17);
assert.equal(new Set(PHOTO_GARAGE_COURT.ids).size,17);
assert.equal(PHOTO_GARAGE_COURT.photoDate,'2022-05-17');
assert.equal(PHOTO_GARAGE_COURT.exactGarageNumberToOsmIdVerified,false);
assert.equal(PHOTO_GARAGE_COURT.presentDay2026Verified,false);
assert.equal(PHOTO_GARAGE_COURT.originalTexturesOnly,true);
assert.equal(PHOTO_GARAGE_COURT.photographicFacts.length,6);
assert(PHOTO_GARAGE_COURT.photographerCredit.includes('Cyclomedia'));
const garageWays=ways.filter(w=>isPhotoGarageWay(w.id)).map(w=>({
 id:w.id,building:w.tags?.building,points:w.geometry.map(xy)
}));
assert.equal(garageWays.length,17,'Each group photo fact must refer to 17 real mapped ways');
const plan=planPhotographedGarageCourt(garageWays);
assert.equal(plan.valid,true,plan.reason);
assert.deepEqual(plan.rows,{west:7,east:10},'Two unequal opposing rows, not imaginary 8+9');
assert.equal(plan.fronts.length,17);
assert.equal(plan.individualDoorNumberMapping,false,'Photo numbers must not be assigned to OSM ids from assumptions');
for(const gate of plan.fronts){
 assert(isPhotoGarageWay(gate.id),'Never affect a garage in another street');
 assert(gate.width>2.90&&gate.width<3.1,'Doors only on ~3m front, not ~5.85m shared walls');
 assert(gate.photoObservedStyle,'Door appearance must use source photographs');
 assert.equal(gate.exactDoorNumberUnknown,true);
 assert(gate.score>.99,'Each gate must face directly INTO the photographed court');
 assert(gate.row==='west'?gate.normal.x>.99:gate.normal.x<-.99);
}
const courtyard=plan.court;
assert(courtyard);
assert(courtyard.xMax-courtyard.xMin>10&&courtyard.xMax-courtyard.xMin<20,
 'Gravel court only between mapped opposing front lines');
assert(courtyard.zMax-courtyard.zMin>15&&courtyard.zMax-courtyard.zMin<30,
 'Gravel court only over mapped row overlap');
assert.equal(courtyard.surface,'photographed-grey-tan-gravel-court');
assert.equal(courtyard.extentEstimated,true);
assert.equal(planPhotographedGarageCourt(garageWays.slice(0,10)).valid,false,
 'If one row only partially loaded, cannot invent court facades');
assert.equal(planPhotographedGarageCourt(garageWays.map(w=>({
 ...w,id:w.id+100000000}))).valid,false,
 'Photo evidence of THIS site cannot be applied to other garages');
assert.equal(planPhotographedGarageCourt(garageWays.map(w=>({
 ...w,points:w.points.slice().reverse()}))).valid,true,
 'OSM clockwise and anticlockwise polygons select the same front side');
const reverse=planPhotographedGarageCourt(garageWays.map(w=>({
 ...w,points:w.points.slice().reverse()})));
for(const front of plan.fronts){
 const rev=reverse.fronts.find(f=>f.id===front.id);
 assert(rev,'Reversed way missing same garage');
 assert(Math.hypot(front.center.x-rev.center.x,front.center.z-rev.center.z)<.05,
  'Reversal must not move a garage shutter to the back side');
}
// 5.63.1: the photographed fronts MUST be terrain-safe for all 17 real OSM
// garages. Testing only the first one masked a map-wide runtime crash before.
// Use the exact original 10 m DMR 4G interpolation and perimeter grading
// from the renderer; fail CI if ANY front cannot become a grounded entrance.
const dem=JSON.parse(read('data/milovice-terrain.json'));
assert.equal(dem.n*dem.n,dem.values.length);
function sampleDem(x,z){
 const nx=dem.n,nz=dem.n;
 const fx=Math.max(0,Math.min(nx-1.00001,(x-dem.min)/dem.step));
 const fz=Math.max(0,Math.min(nz-1.00001,(z-dem.min)/dem.step));
 const ix=Math.floor(fx),iz=Math.floor(fz),tx=fx-ix,tz=fz-iz;
 const i=iz*nx+ix,v=dem.values;
 return (tx+tz<=1?
  v[i]+tx*(v[i+1]-v[i])+tz*(v[i+nx]-v[i]):
  v[i+nx+1]+(1-tx)*(v[i+nx]-v[i+nx+1])+(1-tz)*(v[i+1]-v[i+nx+1]))*.1;
}
for(const front of plan.fronts){
 const mapped=garageWays.find(w=>w.id===front.id);
 assert(mapped);
 const points=mapped.points.slice();
 if(Math.hypot(points[0].x-points.at(-1).x,
  points[0].z-points.at(-1).z)<.1)points.pop();
 let base=-Infinity;
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length];
  const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/3));
  for(let j=0;j<=steps;j++){
   const t=j/steps;
   base=Math.max(base,sampleDem(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t));
  }
 }
 base+=.10;
 const facade=exteriorFacadeFrame(points,front.edge);
 const threshold=planGroundedEntrance(facade,{terrainAt:sampleDem,
  baseHeight:base,topY:base+2.49-.18});
 assert(threshold,'Photographed garage door must have valid terrain grade '+front.id);
 assert(threshold.doorHeight>=1.65,
  'Sufficient door height required on real DMR 4G terrain for '+front.id);
 assert(Math.abs(threshold.centerY-threshold.doorHeight*.5-
  threshold.floorY)<.001,'Never float the door on '+front.id);
}
const html=read('index.html');
for(const k of [
 "from './scripts/nadrazni-photo-garage-court.js?v=5630'",
 'const nadrazniPhotoGarageFronts=new Map()',
 'const photoGarageFront=isGarage?nadrazniPhotoGarageFronts.get(osmId)||null:null',
 'const isPhotoGarage=Boolean(photoGarageFront)',
 'if(isPhotoGarage){',
 'if(i===photoGarageFront.edge){',
 "archPart('garagePhotoDoor'",
 "archPart('garagePhotoRib'",
 "archPart('garagePhotoPillar'",
 "archPart('garagePhotoCoping'",
 "archPart('garagePhotoHandle'",
 'if(isGarage&&!auditedCore&&!isPhotoGarage){',
 'planPhotographedGarageCourt(sourceGarages.map',
 'garagePhotoRoof',
 'new THREE.CanvasTexture(texCanvas)',
 'gravelCourtDrawCalls=1',
 "courtMesh.name='Milovice_Nadrazni_photo_2022_17_garage_gravel_court'",
 'numberedDoorsAssignedToOsm:false'
])assert(html.includes(k),'Missing source-backed actual 3D feature: '+k);
assert(html.indexOf('if(isPhotoGarage){')<html.indexOf('const windows=Math.min(24'),
 'Photographed garage branch must preempt fake generic windows');
assert(html.includes('continue;\n  }\n  if(len<5){'),
 'Photo-sourced garage fronts must bypass old generic facade loops');
assert(!html.includes('garagePhotoNumber'),
 'No invented door number to OSM-ID correspondence permitted');
assert(!html.includes('src="/mnt/data/'),
 'User screenshots must never be redistributed as directly hosted texture files');
console.log('5.63 photo-backed Nádražní paired garage court PASS',JSON.stringify({
 ways:plan.fronts.length,rows:plan.rows,
 courtMetres:[+(courtyard.xMax-courtyard.xMin).toFixed(1),
 +(courtyard.zMax-courtyard.zMin).toFixed(1)],
 doorStyle:'dark brown vertical steel + off-white piers',
 photographDate:PHOTO_GARAGE_COURT.photoDate,
 exactDoorNumberToOsm:false,sourceScreenshotsNotCopied:true
}));
