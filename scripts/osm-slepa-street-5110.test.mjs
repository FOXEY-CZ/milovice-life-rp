import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {planMappedRoadWidth} from './osm-road-width-5108.js';
import {planMiloviceParking} from './parking-layout.js';
import {planSlepaDrivewayWidth,planSlepaStreetLawns,
 slepaParkingSamples,slepaParkingClearsGrass,slepaParkingClearsPeople}
 from './osm-slepa-street-5110.js';

const cos=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const load=area=>JSON.parse(readFileSync(new URL(
 '../data/regions/'+area+'.json',import.meta.url),'utf8')).elements;
const vrutice=load('vrutice'),mlada=load('mlada');
const street=vrutice.find(e=>e.id===202375817);
assert.equal(street.tags.name,'Slepá');
assert.equal(street.tags.highway,'residential');
const streetPoints=street.geometry.map(toWorld);
assert.equal(streetPoints.length,2);
// No polygon with amenity=parking is mapped inside this Slepá street block.
// A road with possible curbside cars does not prove a marked parking lot.
const wayDistance=p=>{
 const [a,b]=streetPoints,q=toWorld(p),
  dx=b.x-a.x,dz=b.z-a.z;
 const t=Math.max(0,Math.min(1,
  ((q.x-a.x)*dx+(q.z-a.z)*dz)/(dx*dx+dz*dz)));
 return Math.hypot(q.x-a.x-dx*t,q.z-a.z-dz*t);
};
const nearParkingLots=[...mlada,...vrutice].filter(e=>
 e.tags?.amenity==='parking'&&e.geometry?.some(p=>wayDistance(p)<110));
assert.equal(nearParkingLots.length,0,
 'Never invent a Slepá parking polygon absent from both regional exports');
const modelWidth=kind=>kind==='primary'?11:kind==='secondary'?9:
 kind==='tertiary'?8:kind==='pedestrian'?4:kind==='footway'?1.8:
 kind==='path'||kind==='steps'?1.65:kind==='cycleway'?2:
 kind==='service'?4.5:kind==='track'?3.2:7.8;
const guards=()=>{
 const roads=createRoadClearance(),
  buildings=makeSidewalkBuildingGuard(),water=createRoadClearance(),
  lawns=[],seen=new Set();
 for(const elements of [mlada,vrutice])
  for(const e of elements){
   if(seen.has(e.id))continue;seen.add(e.id);
   const t=e.tags||{},points=(e.geometry||[]).map(toWorld);
   if(t.building)buildings.add(e.id,points);
   if(t.highway){
    const resolved=planMappedRoadWidth(t,modelWidth(t.highway),'vrutice');
    const driveway=planSlepaDrivewayWidth({
     id:e.id,tags:t,regionId:'vrutice',baseWidth:resolved.width
    });
    roads.addRoad({id:e.id,points,kind:t.highway,width:driveway.width});
   }
   if(t.waterway)water.addRoad({id:e.id,points,width:1});
   if(t.landuse==='grass')lawns.push({id:e.id,tags:t,points});
  }
 return {roads,buildings,water,lawns};
};
const a=guards();
const opts={streetWayId:street.id,streetPoints,
 roads:a.roads,buildings:a.buildings,water:a.water};
const plan=planSlepaStreetLawns(a.lawns,opts);
assert.equal(plan.mappedLawns,15);
assert.equal(plan.detailedLawns,15);
assert.equal(plan.tufts.length,48);
assert.equal(new Set(plan.sourceLawnIds).size,15);
assert(plan.tufts.every(t=>t.positionEstimated&&
 plan.sourceLawnIds.includes(t.sourceLawnId)&&
 a.roads.isClear(t.x,t.z,.16,.1)&&
 a.buildings.isClear(t.x,t.z,.42)&&
 a.water.isClear(t.x,t.z,.42,.18)));
assert.deepEqual(plan.tufts,planSlepaStreetLawns(
 a.lawns.slice().reverse(),opts).tufts,
 'Changing the load order cannot reshuffle Slepá blades');
const overlapping=[...a.lawns,...a.lawns];
assert.deepEqual(plan.tufts,
 planSlepaStreetLawns(overlapping,opts).tufts,
 'Duplicated OSM regional polygons cannot double grass density');
const first=plan.sourceLawnIds[0];
const excluded=planSlepaStreetLawns(a.lawns,{
 ...opts,excludedLawnIds:[first]
});
assert(!excluded.sourceLawnIds.includes(first));
assert.equal(planSlepaStreetLawns(a.lawns,{
 ...opts,streetWayId:'wrong'
}).tufts.length,0);
assert.equal(planSlepaStreetLawns(a.lawns,{
 ...opts,photoAllowed:()=>false
}).tufts.length,0);
assert.equal(planSlepaStreetLawns(a.lawns,{
 ...opts,roads:{isClear:()=>false}
}).tufts.length,0);
assert.equal(planSlepaStreetLawns(a.lawns,{
 ...opts,buildings:{isClear:()=>false}
}).tufts.length,0);
assert.equal(planSlepaStreetLawns(a.lawns,{
 ...opts,water:{isClear:()=>false}
}).tufts.length,0);
for(const attr of ['inventedLawns','inventedShrubs','inventedParkingLots'])
 assert.equal(plan[attr],0);
assert.equal(plan.sourcePolygonsUntouched,true);
const ids=['1019598855','1019598856'];
for(const id of ids){
 const source=vrutice.find(x=>String(x.id)===id);
 assert.equal(source?.tags?.service,'driveway');
 const width=planSlepaDrivewayWidth({id,tags:source.tags,
  regionId:'vrutice',baseWidth:4.5});
 assert.equal(width.width,3.2);
 assert.equal(width.applied,true);
 assert.equal(width.exactKerbWidthKnown,false);
 assert.equal(planSlepaDrivewayWidth({id,tags:source.tags,
  regionId:'old',baseWidth:4.5}).width,4.5);
 assert.equal(planSlepaDrivewayWidth({id,tags:{
  ...source.tags,width:'5'},regionId:'vrutice',baseWidth:5}).width,5);
}
assert.equal(planSlepaDrivewayWidth({id:12345,
 tags:{highway:'service',service:'driveway'},
 regionId:'vrutice',baseWidth:4.5}).applied,false);
const syntheticLawn={id:'p',tags:{landuse:'grass'},points:[
 {x:-1,z:-1},{x:1,z:-1},{x:1,z:1},{x:-1,z:1},{x:-1,z:-1}
]};
const spot={x:0,z:0,yaw:0};
assert.equal(slepaParkingSamples(spot).length,15);
assert.equal(slepaParkingClearsGrass(spot,[syntheticLawn]),false);
assert.equal(slepaParkingClearsGrass({x:20,z:20,yaw:0},
 [syntheticLawn]),true);
assert.equal(slepaParkingClearsGrass({x:4,z:0,yaw:0},
 [syntheticLawn]),true);
const allClear={pedestrian:{isClear:()=>true},
 buildings:{isClear:()=>true}};
assert.equal(slepaParkingClearsPeople(spot,allClear).clear,true);
assert.equal(slepaParkingClearsPeople(spot,{
 ...allClear,pedestrian:{isClear:()=>false}}).reason,'mapped-footway');
assert.equal(slepaParkingClearsPeople(spot,{
 ...allClear,buildings:{isClear:()=>false}}).reason,'mapped-building');
const demoSegment={a:{x:0,y:0},b:{x:100,y:0},len:100,
 kind:'residential',width:7.8,access:'',serviceTag:'',
 osmId:9876};
assert.equal(planMiloviceParking([demoSegment],[],{
 center:{x:50,z:0},limit:4,acceptSpot:()=>false
}).length,0,'Rejected slots must not create cars');
assert(planMiloviceParking([demoSegment],[],{
 center:{x:50,z:0},limit:4,acceptSpot:()=>true
}).length>0,'Safe street parking candidates must remain possible');
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.match(game,/from '\.\/scripts\/parking-layout\.js\?v=\d+'/);
for(const token of [
 "from './scripts/osm-slepa-street-5110.js?v=511200'",
 "from './scripts/parking-layout.js?v=",
 'const osmPedestrianClearance=createRoadClearance();',
 'const driveway=planSlepaDrivewayWidth({',
 'roadWidths.set(String(el.id),width);',
 'osmRoadClearance.addRoad({id:el.id,points,width,kind});',
 'osmPedestrianClearance.addRoad({id:el.id,points,width,kind});',
 'const slepaLawn=planSlepaStreetLawns(osmPlaygroundLawnWays,{',
 'excludedLawnIds:lawnPlan.sourceLawnIds,',
 'visualBatch(\n  createLawnBlades(),lawnBladeMaterial,slepaLawnItems)',
 'window.__miloviceSlepaLawnAudit={',
 'window.__miloviceSlepaLawnRuntime=()=>',
 'acceptSpot:spot=>{',
 'slepaParkingClearsGrass(spot,osmPlaygroundLawnWays)',
 'slepaParkingClearsPeople(spot,{',
 'window.__miloviceSlepaParkingAudit'
])assert(game.includes(token),'5.110 missing real 3D wiring: '+token);
const meta=game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],
 id=game.match(/const BUILD_ID='([^']+)'/)?.[1],
 hud=game.split('id="build-label">')[1]?.split('</strong>')[0];
assert.equal(meta,id);assert.equal(id,hud);assert.match(id,/^\d{8}-[a-z0-9-]+-\d{6}$/);
console.log('PASS 5.110 OSM Slepá neighbourhood',{
 mappedLawns:plan.mappedLawns,tufts:plan.tufts.length,
 realDriveways:ids.length,noMappedParkingLots:0,
 lawnAndPathSafeParking:true});
