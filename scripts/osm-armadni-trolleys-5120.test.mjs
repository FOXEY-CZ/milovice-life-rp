// 5.120: photo-confirmed shopping cart shelter on genuine BILLA OSM recess.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planBillaTrolleyShelter,BILLA_TROLLEY_SOURCE}
 from './osm-armadni-trolleys-5120.js';
const source=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const billa=source.find(e=>e.id===53865798);
const road=source.find(e=>e.id===1057548615);
const clinic=source.find(e=>e.id===1057548624);
assert(billa&&road&&clinic);
const k=111320,cos=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*k*cos,z:-(p.lat-50.226)*k});
const footprint=billa.geometry.slice(0,-1).map(world);
const frame=exteriorFacadeFrame(footprint,4);
assert(frame&&frame.len>17.5&&frame.len<18.5);
const serviceWay={osmId:road.id,kind:road.tags.highway,width:4.5,
 points:road.geometry.map(world)};
const options={id:billa.id,regionId:'mlada',tags:billa.tags,
 front:frame,footprint,serviceWay};
const sourceBefore=JSON.stringify([billa,road,clinic]);
const plan=planBillaTrolleyShelter(options);
assert(plan,'Source guard should allow observed cart shelter');
assert.equal(plan.photoSource,BILLA_TROLLEY_SOURCE.photo);
assert.equal(plan.sourceBuildingWayId,'53865798');
assert.equal(plan.sourceServiceWayId,'1057548615');
assert.equal(plan.northSide,1);
assert(plan.roadClearanceMeters>.45);
assert(plan.roadClearanceMeters<6,'Shelter is adjacent to real service access');
assert(plan.width<3.2&&plan.depth<2);
assert.equal(plan.cartCount,6);
assert.equal(plan.estimatedSitePlacement,true);
assert.equal(plan.originalFootprintUntouched,true);
assert.equal(plan.streetGeometryUntouched,true);
assert.equal(plan.newParkingBays,0);
assert.equal(plan.newFootpaths,0);
assert.equal(plan.newBuildings,0);
assert.deepEqual(plan,planBillaTrolleyShelter(options));
assert.equal(JSON.stringify([billa,road,clinic]),sourceBefore,
 'Planner cannot mutate the real map');
const cornerLimit=frame.len*.5-.12;
assert(Math.abs(plan.along)+plan.width*.5<=cornerLimit);
assert(Math.abs(plan.along)-plan.width*.5>=5.45);
const fromWall=(plan.center.x-frame.mx)*frame.nx+
 (plan.center.z-frame.mz)*frame.nz;
assert(Math.abs(fromWall-1.40)<1e-6);
// Reject uncertain or unrelated map sources instead of spawning anywhere.
for(const invalid of [
 {id:clinic.id},{regionId:'vrutice'},
 {tags:{...billa.tags,shop:'clothes'}},
 {tags:{...billa.tags,name:'Another Billa'}},
 {tags:{...billa.tags,'building:levels':'2'}},
 {tags:{...billa.tags,height:'5.3'}},
 {tags:{...billa.tags,access:'private'}},
 {photoApprovedElsewhere:true},{footprint:[]},
 {front:null},{front:{...frame,len:19.2}},
 {serviceWay:{...serviceWay,osmId:1}},
 {serviceWay:{...serviceWay,kind:'residential'}},
 {serviceWay:{...serviceWay,width:7.5}},
 {serviceWay:{...serviceWay,points:[]}},
 // A real road shifted against the cart station must block the fixture.
 {serviceWay:{...serviceWay,width:6.5,
  points:[{x:plan.center.x,z:plan.center.z-8},
   {x:plan.center.x,z:plan.center.z+8}]}}
]){
 assert.equal(planBillaTrolleyShelter({...options,...invalid}),null,
  'Must reject '+JSON.stringify(invalid).slice(0,100));
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes("from './scripts/osm-armadni-trolleys-5120.js?v=512000'"));
assert(html.includes("const serviceWay=osmDriveRoads.find(r=>String(r.osmId)==='1057548615')"));
assert(html.includes('const rack=planBillaTrolleyShelter({'));
assert(html.includes('window.__miloviceBillaTrolleyAudit={'));
assert(html.includes('window.__miloviceBillaTrolleyRuntime=()=>{'));
assert(html.includes("archPart('billaCartRoof'"));
assert(html.includes("archPart('stationFrames'"));
assert(html.includes('shelterRoofSlats:3,modelledCarts:rack.cartCount'));
assert(html.includes('newParkingSpaces:0,sharedInstancedMaterials:true'));
assert(html.includes('visibleRoofInstances:meshes.filter(attached)'));
assert(/const BUILD_ID='20261117-armadni-(?:trolleys-512000|clinic-front-512100|clinic-visible-512200)'/.test(html));
assert(html.includes('streetAudit=armadni-billa-5118'));
assert(html.includes('streetAudit=armadni-clinic-5118'));
assert(/Verze 5\.(?:120|121|122) · build/.test(html));
console.log('PASS 5.120: BILLA photographed cart shelter beside real OSM service access, safe roof and six instanced carts');
