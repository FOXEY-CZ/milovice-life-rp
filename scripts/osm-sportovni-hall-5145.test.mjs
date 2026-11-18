import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSportovniPhotoHall,SPORTOVNI_HALL_5145 as src}
 from './osm-sportovni-hall-5145.js';
const elements=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const hall=elements.find(x=>String(x.id)===src.id);
assert(hall&&hall.geometry.length===13);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const opts={
 id:hall.id,regionId:'mlada',tags:hall.tags,geometry:hall.geometry,
 outline:hall.geometry.slice(0,-1).map(toWorld),
 cameraWorld:toWorld(src.camera),originalHeight:3.05
};
const json=JSON.stringify(hall);
const plan=planSportovniPhotoHall(opts);
assert(plan,'Original OSM hall must match strict photo/cadastral source');
assert.equal(plan.sourceId,'53866046');
assert.equal(plan.sourceRUIANId,'27906272');
assert.equal(plan.verifiedFacadeIndex,6);
assert.equal(plan.existingOSMLevels,1);
assert.equal(plan.modelHeight,9.6);
assert.equal(plan.originalInferredHeight,3.05);
assert(Math.abs(plan.facadeLength-52.21)<.25);
assert(plan.ribPositions.length>=35);
assert(plan.ribPositions.length<=49);
assert(plan.ribPositions.every((x,i,a)=>
 x>-plan.facadeLength/2&&x<plan.facadeLength/2&&
 (i===0||x>a[i-1])));
assert(plan.photoVisibleHighMetalCladding);
assert(plan.noWindowsOnObservedBlankWall);
assert.equal(plan.realMeasuredHallHeight,false);
for(const prop of ['newBuildings','newRoads','newColliders',
 'newSigns','newTrees','newFences','newLampposts']){
 assert.equal(plan[prop],0);
}
assert.equal(JSON.stringify(hall),json);
for(const change of [
 {regionId:'vrutice'},
 {id:'53866045'},
 {tags:{...hall.tags,'building:levels':'2'}},
 {tags:{...hall.tags,height:'9.6'}},
 {tags:{...hall.tags,'ref:ruian:building':'0'}},
 {photoReviewed:true},{approvedArchitecture:true},
 {originalHeight:5},
 {geometry:hall.geometry.slice(0,-1)},
 {geometry:hall.geometry.map((x,i)=>i===1?{...x,lat:x.lat+.0000001}:x)},
 {cameraWorld:toWorld({lat:50.229,lon:14.861})}
 ])assert.equal(planSportovniPhotoHall({...opts,...change}),null,
 'Altered source or unlicensed view must not create sports hall additions');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const text of [
 "from './scripts/osm-sportovni-hall-5145.js?v=514500'",
 'const sportovniHall=planSportovniPhotoHall({',
 "if(sportovniHall?.verifiedFacadeIndex===i){",
 "archPart('sportovniHallMetal'",
 "archPart('sportovniHallRib'",
 "window.__miloviceSportovniHallRuntime=()=>{",
 "'sportovni-hall-5145':{",
 'streetAudit=sportovni-hall-5145',
 'if(sportovniHall)h=sportovniHall.modelHeight',
 'const visibleFloors=(sportovniHall||slepaUtility||isArmClinic)?0:',
 'const inventedEntrance=!sportovniHall&&!slepaUtility'
 ])assert(html.includes(text),'Missing real 5.145 OSM scene integration '+text);
console.log('PASS 5.145 photo-grounded hall with original RUIAN polygon, 9.6m estimated height, 39 ribbed modules and no invented objects');
