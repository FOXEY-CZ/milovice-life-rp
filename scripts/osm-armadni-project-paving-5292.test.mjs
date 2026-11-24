import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARMADNI_PAVING_5292 as c,planArmadniProjectPaving5292 as plan,
 isArmadniProjectPavingWay5292 as selected} from './osm-armadni-project-paving-5292.js';
import {createRoadClearance} from './road-clearance.js';
import {isCarriageway,safePedestrianPieces} from './reality-walkways.js';
import {planMappedRoadWidth} from './osm-road-width-5108.js';
import {planArmadniSidewalkWidth5291} from './osm-armadni-sidewalk-clearance-5291.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements;
const picked=c.paths.map(item=>ways.find(w=>String(w.id)===item.id));
const original=JSON.stringify(picked),p=plan({regionId:'mlada',ways});
assert(p);assert.equal(p.version,'5.292');assert.equal(p.routes.length,5);
assert(p.sourceMetres>225&&p.sourceMetres<230);
assert.equal(p.planningNotAsBuilt,true);assert.equal(p.realSurfaceVerified,false);
for(const k of ['newFootways','newRoads','newKerbs','newCrossings',
 'newParking','newColliders'])assert.equal(p[k],0,k);
for(const w of picked)assert(selected(p,w));
assert.equal(plan({regionId:'vrutice',ways}),null);
assert.equal(plan({regionId:'mlada',ways:ways.filter(w=>String(w.id)!==c.paths[0].id)}),null);
for(const item of c.paths){
 const bad=ways.map(w=>String(w.id)===item.id?{...w,
  geometry:w.geometry.map((q,i)=>i===0?{...q,lon:q.lon+.0000001}:q)}:w);
 assert.equal(plan({regionId:'mlada',ways:bad}),null,'changed source '+item.id);
}
assert(!selected(p,{...picked[0],tags:{highway:'footway',surface:'asphalt'}}));
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const road=ways.find(w=>String(w.id)==='1373371687');
const walk=ways.find(w=>String(w.id)==='1468803914');
const prior=planArmadniSidewalkWidth5291({regionId:'mlada',road,footway:walk,baseWidth:7.8});
assert(prior);
const index=createRoadClearance();
for(const e of ways){
 const kind=e.tags?.highway;if(!isCarriageway(kind))continue;
 const fallback=kind==='primary'?11:kind==='secondary'?9:
  kind==='tertiary'?8:kind==='service'?4.5:kind==='track'?3.2:7.8;
 const width=planMappedRoadWidth(e.tags,fallback,'mlada').width;
 index.addRoad({id:e.id,kind,points:e.geometry.map(toWorld),
  width:String(e.id)===prior.sourceRoadOSMId?prior.modelWidthMetres:width});
}
let safeMetres=0,safePieces=0;
for(const way of picked){
 const pts=way.geometry.map(toWorld);
 for(let i=1;i<pts.length;i++){
  for(const piece of safePedestrianPieces(pts[i-1],pts[i],1.8,index)){
   const dx=piece.b.x-piece.a.x,dz=piece.b.z-piece.a.z,len=Math.hypot(dx,dz);
   safePieces++;safeMetres+=len;
   const n=Math.ceil(len/.7);
   for(let k=0;k<n;k++){const t=(k+.5)/n;
    assert(index.isClear(piece.a.x+dx*t,piece.a.z+dz*t,.9,.08));
   }
  }
 }
}
assert(safePieces>=5&&safeMetres>120,'OSM safe pavement was lost');
assert.equal(JSON.stringify(picked),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const x of ["from './scripts/osm-armadni-project-paving-5292.js?v=529200'",
 'planArmadniProjectPaving5292({','isArmadniProjectPavingWay5292(armadniPavingPlan5292,el)',
 "material:'armadni-c13c14-planned-pavers'",
 'window.__miloviceArmadniProjectPavingRuntime5292=()=>'])
 assert(html.includes(x),'missing integration '+x);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const js=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud);
console.log('PASS 5.292: five original C13/C14 footways, '+p.sourceMetres+
 'm mapped, '+safeMetres.toFixed(1)+'m road-safe, only model material');
