import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inspectJuventaLongJump5302 as inspect} from './osm-juventa-long-jump-5302.js';
import {planCityLanduseBatches,selectLanduseRenderMaterial,makePitchSandGrain5303} from './landscapes.js';
for(const region of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+region+'.json',import.meta.url),'utf8')).elements;
 const matched=ways.map(inspect).filter(Boolean);
 assert.equal(matched.length,1);
 const way=ways.find(w=>String(w.id)==='1472419120');
 assert.equal(matched[0].sourceHash,'6f18862d');
 assert.equal(matched[0].currentSurfaceVerified,false);
 const convert=p=>({x:(p.lon-14.866674)*71180,y:(50.225972-p.lat)*111320});
 const entry=planCityLanduseBatches([way],convert).entries[0];
 assert.equal(entry.renderMaterial,'pitchSand');
 assert.equal(selectLanduseRenderMaterial(way,'pitch'),entry.renderMaterial);
 for(const [surface,material] of [['grass','pitch'],['sand','pitchSand'],['clay','pitchClay'],['asphalt','pitchAsphalt'],['artificial_turf','pitchTurf']]){
  const tagged={...way,tags:{...way.tags,surface}};
  assert.equal(inspect(tagged),null);
  assert.equal(selectLanduseRenderMaterial(tagged,'pitch'),material);
  assert.equal(planCityLanduseBatches([tagged],convert).entries[0].renderMaterial,material);
 }
 const turf=ways.find(w=>String(w.id)==='1472419116');
 assert.equal(selectLanduseRenderMaterial(turf,'pitch'),'pitchTurf');
 assert.equal(selectLanduseRenderMaterial({...turf,tags:{...turf.tags,surface:'clay'}},'pitch'),'pitchClay');
 assert.equal(selectLanduseRenderMaterial({tags:{landuse:'grass',surface:'sand'}},'grass'),'grass');
 assert.deepEqual(entry.pts,way.geometry.slice(0,-1).map(convert));
 assert.equal(inspect({...way,tags:{...way.tags,surface:'grass'}}),null);
 assert.equal(inspect({...way,id:1}),null);
 const geometry=way.geometry.map(p=>({...p}));geometry[0].lat+=.00001;
 assert.equal(inspect({...way,geometry}),null);
 assert.equal(inspect(ways.find(w=>String(w.id)==='1472419115')),null);
}
console.log('PASS 5.302: exact long-jump polygon, inferred sand surface, no new geometry');

const grain=makePitchSandGrain5303();
assert.equal(grain.width,32);
assert.equal(grain.height,32);
assert.equal(grain.bytes,4096);
assert.deepEqual(grain.data,makePitchSandGrain5303().data);
assert(new Set(grain.data.filter((_,i)=>i%4===0)).size>20);
for(let i=0;i<grain.data.length;i+=4){
 assert.equal(grain.data[i],grain.data[i+1]);
 assert.equal(grain.data[i],grain.data[i+2]);
 assert.equal(grain.data[i+3],255);
}
console.log('PASS 5.303: deterministic shared neutral sand grain, 4 KiB');

import {planJuventaAccess5304,permitJuventaParking5304} from './osm-juventa-access-5304.js';
const toWorld5304=p=>({x:(p.lon-14.866674)*71180,z:(50.225972-p.lat)*111320});
for(const regionId of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8')).elements;
 const plan=planJuventaAccess5304({regionId,ways,toWorld:toWorld5304});
 assert(plan);
 assert.deepEqual(plan.protectedWayIds,['1472419124','1472419127','1472419128','1076211056','1076211057','1076211058','1076211060']);
 assert.equal(plan.segments.length,31);
 assert.equal(plan.exactSourceJunctions,14);
 assert.equal(plan.sourceCrossingId,'1076211056');
 assert.equal(planJuventaAccess5304({regionId,ways:ways.map(w=>String(w.id)==='1076211056'?{...w,tags:{...w.tags,crossing:'unmarked'}}:w),toWorld:toWorld5304}),null);
 for(const {a,b} of plan.segments){
  assert.equal(permitJuventaParking5304(plan,a),false);
  assert.equal(permitJuventaParking5304(plan,{x:(a.x+b.x)/2,z:(a.z+b.z)/2}),false);
 }
 assert.equal(permitJuventaParking5304(plan,{x:1000,z:1000}),true);
 assert.equal(permitJuventaParking5304(plan,{x:NaN,z:0}),false);
 assert.equal(planJuventaAccess5304({regionId,ways:ways.filter(w=>String(w.id)!=='1472419127'),toWorld:toWorld5304}),null);
}
console.log('PASS 5.305: seven original pedestrian ways, 14 exact joins and existing crossing in both region copies');

import {planMiloviceParking} from './parking-layout.js';
const parkingWays5305=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const parkingGuard5305=planJuventaAccess5304({regionId:'mlada',ways:parkingWays5305,toWorld:toWorld5304});
const roadIds5305=['128087255','128087257','1472419121','1472419122','1472419123'];
const roads5305=parkingWays5305.filter(w=>roadIds5305.includes(String(w.id))).flatMap(w=>{
 const points=w.geometry.map(p=>{const q=toWorld5304(p);return {x:q.x,y:q.z}});
 return points.slice(1).map((b,i)=>({a:points[i],b,len:Math.hypot(b.x-points[i].x,b.y-points[i].y),
  kind:w.tags.highway,width:w.tags.highway==='service'?5:7.8,osmId:w.id,
  access:w.tags.access,serviceTag:w.tags.service}));
});
assert(roads5305.length>0);
const center5305=parkingGuard5305.segments[0].a;
let rejected5305=0,accepted5305=0;
for(let seed=1;seed<=30;seed++){
 const options={center:center5305,limit:40,seed};
 const baseline=planMiloviceParking(roads5305,[],options);
 rejected5305+=baseline.filter(s=>!permitJuventaParking5304(parkingGuard5305,s)).length;
 const guarded=planMiloviceParking(roads5305,[],{...options,acceptSpot:s=>permitJuventaParking5304(parkingGuard5305,s)});
 assert(guarded.every(s=>permitJuventaParking5304(parkingGuard5305,s)));
 assert(guarded.length<=options.limit);
 accepted5305+=guarded.length;
}
assert(rejected5305>0,'baseline must contain conflicting parking candidates');
assert(accepted5305>0,'guard must preserve safe parking candidates');
console.log('PASS 5.305: actual parking generator, 30 seeds; '+rejected5305+' conflicting baseline slots, '+accepted5305+' safe generated slots (model widths)');

import {planJuventaSchoolShell5306} from './osm-juventa-school-shell-5306.js';
for(const regionId of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8')).elements;
 const school=ways.find(w=>String(w.id)==='53865836');
 const plan=planJuventaSchoolShell5306({...school,regionId});
 assert(plan);assert.equal(plan.sourceVertices,73);assert.equal(plan.sourceLevels,5);
 assert(plan.depth>150&&plan.depth<151);assert(plan.width>111&&plan.width<113);
 assert.equal(plan.modelHeight,15.25);assert.equal(plan.newEntrances,0);assert.equal(plan.newRamps,0);
 assert.equal(planJuventaSchoolShell5306({...school,regionId,id:53865846}),null);
 const moved=school.geometry.map((p,i)=>i===0?{...p,lat:p.lat+.000001}:p);
 assert.equal(planJuventaSchoolShell5306({...school,regionId,geometry:moved}),null);
 assert.equal(planJuventaSchoolShell5306({...school,regionId,tags:{...school.tags,'building:levels':'4'}}),null);
}
console.log('PASS 5.306: original 150m school footprint restored through source-specific size guard');

import {JUVENTA_FACADE_5307,makeJuventaFacade5307,mapJuventaWallUV5307} from './osm-juventa-school-facade-5307.js';
const palette5307=makeJuventaFacade5307(15.25);
assert.equal(palette5307.bytes,512);assert.equal(palette5307.bandRows,8);
assert.deepEqual([...palette5307.data.slice(0,4)],[84,76,71,255]);
assert.deepEqual([...palette5307.data.slice(-4)],[228,217,190,255]);
assert.equal(makeJuventaFacade5307(0),null);
assert.equal(JUVENTA_FACADE_5307.wholePerimeterEstimated,true);
const uv5307=Array.from({length:6},()=>[.2,.3]);
const mock5307={index:null,groups:[{start:0,count:3,materialIndex:0},{start:3,count:3,materialIndex:1}],
 attributes:{position:{count:6,getY:i=>[0,0,0,0,7.625,15.25][i]},
 uv:{count:6,setXY:(i,x,y)=>{uv5307[i]=[x,y]}}}};
assert.equal(mapJuventaWallUV5307(mock5307,15.25),true);
assert.deepEqual(uv5307,[[.2,.3],[.2,.3],[.2,.3],[.5,0],[.5,.5],[.5,1]]);
assert.equal(mapJuventaWallUV5307({...mock5307,index:{}},15.25),false);
console.log('PASS 5.307: 512-byte facade palette, normalized wall UV only, original cap UVs preserved');

import {JUVENTA_PHOTO_5308,planJuventaPhotoAnchor5308} from './osm-juventa-photo-anchor-5308.js';
for(const regionId of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8')).elements;
 const school=ways.find(w=>String(w.id)==='53865836');
 const anchor=planJuventaPhotoAnchor5308({...school,regionId});
 assert(anchor);assert.equal(anchor.edge,47);assert(anchor.distance>21&&anchor.distance<23);
 assert(anchor.length>17&&anchor.length<18);assert(anchor.fraction>.8&&anchor.fraction<.9);
 assert.equal(anchor.exactEntranceSurveyed,false);assert.equal(anchor.newGeometry,0);
 assert.equal(planJuventaPhotoAnchor5308({...school,regionId,id:0}),null);
}
assert.equal(JUVENTA_PHOTO_5308.heading,98.62);
console.log('PASS 5.308: EXIF ray intersects exact OSM facade edge 47 in both region copies');

import {planJuventaWindowBays5309} from './osm-juventa-window-bays-5309.js';
for(const regionId of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8')).elements;
 const school=ways.find(w=>String(w.id)==='53865836');
 const plan=planJuventaWindowBays5309({...school,regionId,toWorld:toWorld5304});
 assert(plan);assert.equal(plan.edge,47);assert.equal(plan.windowBays,9);assert.equal(plan.glassPanes,54);
 assert.equal(plan.accentStrips,9);assert.equal(plan.quads.length,72);
 assert.equal(plan.exactPositionsSurveyed,false);assert.equal(plan.entryCandidateKeptClear,true);
 const a=toWorld5304(school.geometry[47]),b=toWorld5304(school.geometry[48]),dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
 for(const q of plan.quads)for(const [x,y,z] of q.vertices){
  const u=((x-a.x)*dx+(z-a.z)*dz)/len;
  assert(u>=0&&u<len*.75);assert(y>0&&y<15.25);
  assert(Math.abs((x-a.x)*dz-(z-a.z)*dx)/len<.04);
 }
 assert.equal(planJuventaWindowBays5309({...school,regionId,id:0,toWorld:toWorld5304}),null);
}
console.log('PASS 5.309: nine model window bays, 72 quads, original edge and candidate entrance clearance');
