import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {CHURCH_SIDEWALK_2022,planPhotoChurchSidewalk2022} from './photo-sidewalk-2022.js';

const {elements}=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const C=Math.cos(50.226*Math.PI/180),P=p=>({
 x:(p.lon-14.889)*111320*C,y:-(p.lat-50.226)*111320
});
const widths={primary:11,secondary:9,tertiary:8,pedestrian:4,
 footway:1.8,path:1.65,cycleway:2,service:4.5};
const roads=elements.filter(e=>e.tags?.highway&&e.geometry?.length>=2)
 .map(e=>({osmId:e.id,kind:e.tags.highway,
  width:widths[e.tags.highway]??7.8,points:e.geometry.map(P)}));
const clearance=createRoadClearance();
for(const road of roads)clearance.addRoad({
 id:road.osmId,kind:road.kind,width:road.width,points:road.points
});
const footprints=elements.filter(e=>e.tags?.building&&e.geometry?.length>=4)
 .map(e=>e.geometry.map(P));
const church=elements.find(e=>e.id===118487991);
assert.equal(church.tags.building,'church');
const churchFootprint=church.geometry.map(P);
const input={roadClearance:clearance,buildingFootprints:footprints,churchFootprint};
const result=planPhotoChurchSidewalk2022(roads,input);
assert(result,'Sidewalk requires real OSM road, Pionýrů junction and church');
assert.equal(result.source,'user-map-panorama-2022-05-09');
assert.equal(result.churchwardDirection,1);
assert.equal(result.roadId,'219273174');
assert.equal(result.junctionRoadId,'118488006');
assert.equal(result.churchId,'118487991');
assert.equal(result.positionSurveyed,false);
assert.equal(result.currentStatusUnverified,true);
assert.equal(result.mappedRoadsChanged,false);
assert.equal(result.mappedBuildingsChanged,false);
assert.equal(result.createsMappedFootway,false);
assert.equal(result.inventedPrivateDriveways,0);
assert.equal(result.modelledWidthM,1.45);
assert(result.acceptedSegments>=28,
 'Historical-photo curb should build a meaningful block, not a single tiny patch');
assert(result.lengthM>=62&&result.lengthM<=108);
assert.equal(result.acceptedSegments+result.rejectedSegments,result.candidateSegments);
assert(result.accepted.every(p=>p.a>=9&&p.b<=117));
assert(result.accepted.every(p=>p.width===1.45&&p.offset===-5.53));
assert.equal(planPhotoChurchSidewalk2022(roads,{
 ...input,churchFootprint:[]}),null);
assert.equal(planPhotoChurchSidewalk2022(roads,{
 ...input,roadClearance:null}),null);
const reversed=roads.map(road=>String(road.osmId)==='219273174'?
 {...road,points:[...road.points].reverse()}:road);
const mirrored=planPhotoChurchSidewalk2022(reversed,input);
assert(mirrored);
assert.equal(mirrored.churchwardDirection,-1);
assert.equal(mirrored.acceptedSegments,result.acceptedSegments);
assert.equal(mirrored.lengthM,result.lengthM);
for(let i=0;i<result.accepted.length;i++)
 assert(Math.hypot(result.accepted[i].x-mirrored.accepted[i].x,
  result.accepted[i].z-mirrored.accepted[i].z)<.01);
const onCarriageway=planPhotoChurchSidewalk2022(roads,{
 ...input,config:{...CHURCH_SIDEWALK_2022,centreOffsetM:-2}});
assert(onCarriageway&&onCarriageway.acceptedSegments===0,
 'Never construct a sidewalk on carriageway pixels');
const code=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(code.includes('photoChurchSidewalk2022.create(osmDriveRoads,'));
assert(code.includes('photoChurchSidewalk2022.reset()'));
assert(code.includes('streetAudit=church-2024'));
assert(code.includes('camera:{lat:50.2278239,lon:14.8837536},heading:320'));
assert(code.includes("church-2024"));
console.log('PHOTO_CHURCH_SIDEWALK_2022_OK',JSON.stringify({
 candidate:result.candidateSegments,accepted:result.acceptedSegments,
 rejected:result.rejectedSegments,metres:result.lengthM,
 direction:result.churchwardDirection,photographicallySurveyed:false}));
