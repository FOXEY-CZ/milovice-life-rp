// Milovice RP 5.118 — regression checks on shipped OSM, published
// photo cues, local mapped road camera, and original geometry protection.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planArmLandmarkMassing,ARMADNI_LANDMARK_SOURCES}
 from './osm-armadni-landmarks-5118.js';
import {selectExteriorFacadeToward} from './facade-anchors.js';
const cos=Math.cos(50.226*Math.PI/180),k=111320;
const world=p=>({x:(p.lon-14.889)*k*cos,z:-(p.lat-50.226)*k});
function region(id){
 return JSON.parse(readFileSync(new URL(
  '../data/regions/'+id+'.json',import.meta.url),'utf8')).elements;
}
const mlada=region('mlada'),vrutice=region('vrutice');
const cases=[
 {id:53865798,name:'Billa',kind:'supermarket',floors:1,
  height:5.2,area:1125.80},
 {id:1057548624,name:'Poliklinika Milovice',kind:'polyclinic',
  floors:4,height:12.9,area:827.58}
];
const planned=[];
for(const want of cases){
 const el=mlada.find(e=>e.id===want.id);
 assert(el&&el.geometry.length>=5);
 assert.equal(el.tags.name,want.name);
 assert(!vrutice.some(e=>e.id===want.id),
  'This landmark is mapped only in Mladá export');
 const pts=el.geometry.map(world);
 const params={id:el.id,regionId:'mlada',tags:el.tags,points:pts};
 const plan=planArmLandmarkMassing(params);
 assert(plan,'Missing approved landmark '+el.id);
 assert.equal(plan.sourceWayId,String(want.id));
 assert.equal(plan.name,want.name);
 assert.equal(plan.kind,want.kind);
 assert.equal(plan.floors,want.floors);
 assert.equal(plan.modelHeightMeters,want.height);
 assert(Math.abs(plan.polygonAreaSquareMeters-want.area)<.02);
 assert(plan.photoSource.startsWith('https://'));
 assert.equal(plan.originalFootprintUntouched,true);
 assert.equal(plan.newBuildingsCreated,0);
 assert.equal(plan.newPathsCreated,0);
 assert.equal(plan.windowsAsExactSurvey,false);
 assert.equal(plan.roofHeightMeasured,false);
 assert.deepEqual(plan,planArmLandmarkMassing(params));
 for(const invalid of [
  {regionId:'vrutice'},{regionId:'old'},
  {photoReviewed:true},{approvedArchitecture:true},
  {tags:{...el.tags,name:'Unknown'}},
  {tags:{...el.tags,height:'5.5'}},
  {tags:{...el.tags,'building:part':'yes'}},
  {tags:{...el.tags,access:'private'}},
  {points:[]},
  {points:pts.slice(0,3)}
 ]){
  assert.equal(planArmLandmarkMassing({...params,...invalid}),null);
 }
 planned.push(plan);
}
assert.equal(planned[0].disableGenericSideGlazing,true);
assert.equal(planned[0].disableGenericBusinessCanopy,false);
assert.equal(planned[0].mappedFloors,1);
assert.equal(planned[1].disableGenericBusinessCanopy,true);
assert.equal(planned[1].mappedFloors,null);
assert.equal(planned[1].frontEdgeIndex,2);
assert(planned[1].frontEdgeLength>44&&planned[1].frontEdgeLength<46);
assert(planned[1].photoEvidence.includes('four visible storeys'));
const billa=mlada.find(e=>e.id===53865798);
const clinic=mlada.find(e=>e.id===1057548624);
const service=mlada.find(e=>e.id===1057548615);
const spojovaci=mlada.find(e=>e.id===246652750);
assert.equal(service.tags.highway,'service');
assert.equal(spojovaci.tags.name,'Spojovací');
function heading(eye,target){
 return (Math.atan2((target.lon-eye.lon)*cos,
   target.lat-eye.lat)*180/Math.PI+360)%360;
}
const eyeBilla={
 lat:(service.geometry[0].lat+service.geometry[1].lat)/2,
 lon:(service.geometry[0].lon+service.geometry[1].lon)/2
};
assert(Math.abs(eyeBilla.lat-50.2289351)<1e-7);
assert(Math.abs(eyeBilla.lon-14.86186245)<1e-7);
const facade=selectExteriorFacadeToward(
 billa.geometry.slice(0,-1).map(p=>({x:world(p).x,y:world(p).z})),
 world(eyeBilla),{minLength:15,maxLength:25});
assert.equal(facade?.index,4,'Mapped service road must face recessed Billa entrance');
const targetBilla={
 lat:(billa.geometry[4].lat+billa.geometry[5].lat)/2,
 lon:(billa.geometry[4].lon+billa.geometry[5].lon)/2
};
assert(Math.abs(heading(eyeBilla,targetBilla)-50.6)<.2);
const eyeClinic={
 lat:(spojovaci.geometry[0].lat+spojovaci.geometry[1].lat)/2,
 lon:(spojovaci.geometry[0].lon+spojovaci.geometry[1].lon)/2
};
const targetClinic={
 lat:(clinic.geometry[2].lat+clinic.geometry[3].lat)/2,
 lon:(clinic.geometry[2].lon+clinic.geometry[3].lon)/2
};
assert(Math.abs(eyeClinic.lat-50.2286697)<1e-7);
assert(Math.abs(eyeClinic.lon-14.8643547)<1e-7);
assert(Math.abs(heading(eyeClinic,targetClinic)-287.3)<.2);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.match(html,/from '\.\/scripts\/osm-armadni-landmarks-5118\.js\?v=\d+'/);
for(const token of [
 "from './scripts/osm-armadni-landmarks-5118.js?v=",
 "const armLandmark=planArmLandmarkMassing({",
 "const isArmClinic=armLandmark?.kind==='polyclinic'",
 "const isArmBilla=armLandmark?.kind==='supermarket'",
 "let floors=modelCard?.floors??(armLandmark?.floors??",
 "h=armLandmark.modelHeightMeters;",
 "const baseWallMat=isArmClinic?clinicPhotoWalls:",
 "(slepaUtility||isArmClinic)?'flat':",
 "const visibleFloors=(sportovniHall||slepaUtility||isArmClinic)?0:",
 "else if(isCommerce&&!isBlueStar&&!auditedCore&&!isArmBilla){",
 "if(osmId===1057548624&&tags.amenity==='clinic')return;",
 "if(isArmClinic){",
 "&&!slepaUtility&&!isArmClinic&&!isArmBilla&&",
 "i===armLandmark.frontEdgeIndex&&len>30",
 "archPart('clinicTeal'",
 "archPart('clinicWindow'",
 "archPart('clinicFrame'",
 "continue; // Side/back windows are not photographically established.",
 "window.__miloviceArmLandmarksAudit={",
 "window.__miloviceArmLandmarksRuntime=()=>{",
 "actuallyVisibleInstances:visible.reduce((n,obj)=>n+obj.count,0)",
 "streetAudit=armadni-billa-5118",
 "streetAudit=armadni-clinic-5118",
 "camera:{lat:50.2289351,lon:14.86186245},heading:50.6,",
 "const photoEntranceEdge=selectExteriorFacadeToward(pts,serviceMidpoint,",
 "photoEntranceEdge?.index===4",
 "camera:{lat:50.2286697,lon:14.8643547},heading:287.3,"
 ])assert(html.includes(token),'Missing integration '+token);
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
assert.match(build,/^\d{8}-[a-z0-9-]+-\d{6}$/);
assert.equal(html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],build);
assert.equal(html.split('id="build-label">')[1]?.split('</strong>')[0],build);
assert.match(html,/id="street-audit-exit" href="\.\/\?v=\d+"/);
assert.match(html,/href="\.\/\?v=\d+">Zpět do hry<\/a>/);
for(const old of [
 "slepa-substations-5117","slepa-walk-5116",
 "slepa-armadni-bends-5115","slepa-park-5114",
 "slepa-utilities-5113","slepa-houses-5112",
 "mountStreetAuditMenu"
 ])assert(html.includes(old));
assert(ARMADNI_LANDMARK_SOURCES.billa.photoSource===undefined||
 ARMADNI_LANDMARK_SOURCES.billa.photo.startsWith('https://'));
console.log('PASS 5.118: OSM Billa + ABP Poliklinika four-floor photo facade',{
 buildings:cases.map(x=>x.id),
 clinicFront:planned[1].frontEdgeIndex,
 fakeSideGlazingRemoved:true,unmappedPathsCreated:0
});
