import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSportovniRUIANPanel,SPORTOVNI_RUIAN_5140}
 from './osm-sportovni-ruian-panels-5140.js';
import {PRUBEZNA_PUBLIC_PHOTOS_5144,PRUBEZNA_FRONTAGES_5144,
 planPrubeznaPhotoFrontage} from './osm-prubezna-photo-frontages-5144.js';
const photos=PRUBEZNA_PUBLIC_PHOTOS_5144;
assert.equal(photos.prubezna.camera.lat,50.230236);
assert.equal(photos.prubezna.camera.lon,14.864183);
assert.equal(photos.prubezna.heading,272.09);
assert.equal(photos.sportovni.camera.lat,50.230950);
assert.equal(photos.sportovni.camera.lon,14.866606);
assert.equal(photos.sportovni.heading,277.5);
for(const p of Object.values(photos)){
 assert.equal(p.license,'CC BY-SA 3.0');
 assert(p.source.startsWith('https://commons.wikimedia.org/wiki/File:'));
 assert(p.cameraLocationFromEXIF&&p.headingFromEXIF);
 assert(!p.originalPhotoPixelsCopied);
}
const elements=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements;
const o={lat:50.226,lon:14.889};
const toWorld=p=>({x:(p.lon-o.lon)*111320*Math.cos(o.lat*Math.PI/180),
 z:-(p.lat-o.lat)*111320});
const cameraWorld=toWorld(photos.prubezna.camera);
const ids=[];
for(const spec of SPORTOVNI_RUIAN_5140.buildings){
 const w=elements.find(e=>String(e.id)===spec.id);
 assert(w,'Missing RUIAN building '+spec.id);
 const plan=planSportovniRUIANPanel({
  id:w.id,regionId:'mlada',tags:w.tags,geometry:w.geometry,
  height:Number(w.tags['building:levels'])*3.05});
 assert(plan);
 const geo=JSON.stringify(w.geometry);
 const points=w.geometry.slice(0,-1).map(toWorld);
 const front=planPrubeznaPhotoFrontage({
  plan,outline:points,cameraWorld
 });
 if(PRUBEZNA_FRONTAGES_5144.some(x=>x.id===spec.id)){
  assert(front,'Photo source-facing tower missing '+spec.id);
  assert.equal(front.sourceId,spec.id);
  assert(front.sourceFaceLength>=7);
  assert(front.frontEdgeInferredFromFootprint);
  assert(front.modelTintEstimated);
  assert(front.windowPositionsUnverified);
  assert(front.otherSidesUnverified);
  assert(front.sourceGPSFootprintUnchanged);
  assert(front.noPhotoPixelsCopied);
  ids.push(spec.id);
  assert.equal(planPrubeznaPhotoFrontage({
   plan:{...plan,sourceOSMHash:'invalid'},outline:points,cameraWorld
  }),null);
  assert.equal(planPrubeznaPhotoFrontage({
   plan:{...plan,photographedFacade:true},outline:points,cameraWorld
  }),null);
 }else assert.equal(front,null,'No color guesses for remaining towers');
 assert.equal(JSON.stringify(w.geometry),geo);
}
assert.deepEqual(ids,['53865991','53865992']);
assert.equal(planPrubeznaPhotoFrontage({}),null);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-prubezna-photo-frontages-5144.js?v=514400'",
 'const prubeznaPhotoFacade=estatePlan?.version===\'5.140\'?',
 "archPart(prubeznaPhotoFacade.material",
 "window.__milovicePrubeznaPhotoFacadeRuntime=()=>{",
 "'prubezna-public-photo-5144':{",
 "'sportovni-public-photo-5144':{",
 'streetAudit=prubezna-public-photo-5144',
 'streetAudit=sportovni-public-photo-5144',
 "documented-photo-gps-and-heading"
])assert(game.includes(token),'Missing 5.144 game integration '+token);
console.log('PASS 5.144: two EXIF photo-view cameras; two source-locked, photo-visible approximate apartment facades, seven untouched RUIAN towers');
