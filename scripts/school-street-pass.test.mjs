import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSchoolStreetFrontage,schoolFacadeFixture,
 SCHOOL_PHOTO_WAY_ID,SCHOOL_PHOTO_URL,schoolPhotoCameraWorld}
 from './school-street-pass.js';
import {facadeGap,exteriorFacadeFrame} from './facade-anchors.js';

const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const item=osm.elements.find(x=>x.id===SCHOOL_PHOTO_WAY_ID);
assert.equal(item?.tags?.name,'ZŠ T. G. Masaryka');
assert.equal(item?.tags?.building,'school');
assert.equal(item?.tags?.['building:levels'],'3');
const c=Math.cos(50.226*Math.PI/180);
const school=item.geometry.slice(0,-1).map(p=>({
 x:(p.lon-14.889)*111320*c,z:-(p.lat-50.226)*111320
}));
assert.equal(school.length,22,'School polygon must remain the real 22-edge OSM source');
const plan=planSchoolStreetFrontage(school);
assert(plan&&plan.osmId===118487979);
assert.equal(plan.source,SCHOOL_PHOTO_URL);
assert.equal(plan.sourceDate,'2024-05-30');
assert.equal(plan.status,'photo-backed-partial');
assert(plan.unknownRear&&plan.approximateDimensions);
assert.equal(plan.levels,3);
assert(plan.entrance.len>15&&plan.entrance.len<20,
 'School main doorway must be attached to one long photographed street wall');
assert(plan.entrance.visibility>.6&&plan.entrance.cameraDistance<55);
assert.equal(plan.accents.length,2,'Only two estimated street-facing end bays can be coloured');
for(const a of plan.accents){
 assert(a.visibility>.3&&a.cameraDistance<70&&a.index!==plan.entrance.index,
  'No guessed rear-side red wall');
}
const glass=schoolFacadeFixture(plan.entrance,0,.04);
const frame=schoolFacadeFixture(plan.entrance,1.05,.085);
assert(Math.abs(facadeGap(plan.entrance,glass,.04)+.012)<1e-8);
assert(Math.abs(facadeGap(plan.entrance,frame,.085)+.012)<1e-8);
const camera=schoolPhotoCameraWorld();
assert(Number.isFinite(camera.x)&&Number.isFinite(camera.z));
const reversed=planSchoolStreetFrontage([...school].reverse());
assert(reversed&&Math.hypot(reversed.entrance.mx-plan.entrance.mx,
 reversed.entrance.mz-plan.entrance.mz)<1e-7);
assert(Math.abs(reversed.entrance.nx-plan.entrance.nx)<1e-7);
assert(Math.abs(reversed.entrance.nz-plan.entrance.nz)<1e-7);
assert.equal(planSchoolStreetFrontage([]),null);
assert.equal(planSchoolStreetFrontage(school,{camera:{x:NaN,z:0}}),null);
assert.equal(exteriorFacadeFrame(school,plan.entrance.index).len,plan.entrance.len);
const world=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(world.includes('schoolPhotoPlan=isSchool?planSchoolStreetFrontage(pts):null'));
assert(world.includes("if(isSchool&&schoolPhotoPlan?.accents.some("));
assert(world.includes('if(isSchool&&schoolPhotoPlan){')&&
 world.includes('longest={a:pts[f.index],b:pts[(f.index+1)%pts.length]'));
assert(world.includes("archPart('stationGlass',glass.x,baseHeight+1.17"));
assert(world.includes("schoolPhotoPlan.canopyDepth")&&
 !world.includes("archPart('glassAwning',mx+nx*flushBoxOffset(2.45)"));
assert(!world.includes("archPart('schoolRed',mx+nx*flushBoxOffset(.15),baseHeight+1.28"),
 'Old photo-unsupported red stripe must be removed from EVERY wall');
const photos=readFileSync(new URL('./street-photo-evidence.js',import.meta.url),'utf8');
assert(photos.includes("buildingIds:['118487979']"));
const queue=JSON.parse(readFileSync(new URL('../data/architecture/building-audit-queue.json',import.meta.url),'utf8'));
assert.equal(queue.withPhotoReference,4);
assert.equal(queue.entries.find(x=>x.osmId===118487979)?.reviewStatus,'photo-anchored-partial');
console.log('5.44 school 2024 photo street-front PASS',
 {osmId:plan.osmId,streetFace:plan.entrance.index,
  length:+plan.entrance.len.toFixed(2),photoAccents:plan.accents.length,
  newEvidenceCount:queue.withPhotoReference});
