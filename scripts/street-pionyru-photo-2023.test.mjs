import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PIONYRU_2023,planPionyru2023Verge,isBuildingFreeRect,auditPionyruAccessContinuity} from './street-pionyru-photo-2023.js';
import {createRoadClearance,isRoadFreeRect} from './road-clearance.js';
// 5.82.3: Whole-rectangle building guard. The old 25/28 cm sampling
// could miss a thin wall fragment even though the apron intersected it.
const accessRect={x:0,z:0,length:2,depth:2,yaw:Math.PI/5};
const NARROW_SLIVER=[{x:-.015,z:-3},{x:.015,z:-3},
 {x:.015,z:3},{x:-.015,z:3}];
const enclosing=[{x:-5,z:-5},{x:5,z:-5},{x:5,z:5},{x:-5,z:5}];
const contained=[{x:-.04,z:-.04},{x:.04,z:-.04},
 {x:.04,z:.04},{x:-.04,z:.04}];
const clear=[{x:5,z:5},{x:6,z:5},{x:6,z:6},{x:5,z:6}];
assert.equal(isBuildingFreeRect(accessRect,[NARROW_SLIVER]),false,
 'NARROW_SLIVER must intersect even between sparse sample points');
assert.equal(isBuildingFreeRect(accessRect,[[...NARROW_SLIVER].reverse()]),false,
 'Winding reversal must not change footprint collision');
assert.equal(isBuildingFreeRect(accessRect,[enclosing]),false,
 'Do not pave inside a building that entirely encloses the rectangle');
assert.equal(isBuildingFreeRect(accessRect,[contained]),false,
 'Small building polygon entirely inside an apron must be rejected');
assert.equal(isBuildingFreeRect(accessRect,[clear]),true);
assert.equal(isBuildingFreeRect(accessRect,{x:0,z:0}),false,
 'Malformed footprint list fails closed');
assert.equal(isBuildingFreeRect({...accessRect,length:NaN},[]),false,
 'Invalid geometry fails closed');
// Even without an edge intersection, the 13cm conservative building
// clearance around a straight apron is mandatory.
const straight={x:0,z:0,length:2,depth:2,yaw:0};
const grazing=[{x:1.08,z:-.1},{x:1.1,z:-.1},
 {x:1.1,z:.1},{x:1.08,z:.1}];
const distant=grazing.map(p=>({x:p.x+.4,z:p.z}));
assert.equal(isBuildingFreeRect(straight,[grazing]),false);
assert.equal(isBuildingFreeRect(straight,[distant]),true);
const world=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8')).elements;
const cos=Math.cos(50.226*Math.PI/180);
const to=p=>({x:(p.lon-14.889)*111320*cos,z:-(p.lat-50.226)*111320});
const roads=world.filter(e=>e.tags?.highway&&e.geometry?.length>=2).map(e=>{
 const kind=e.tags.highway;
 const width=kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:
  kind==='pedestrian'?4:kind==='footway'?1.8:kind==='path'?1.65:
  kind==='cycleway'?2:kind==='service'?4.5:7.8;
 return {osmId:e.id,kind,width,points:e.geometry.map(to)};
});
const index=createRoadClearance();
for(const r of roads)index.addRoad({id:r.osmId,points:r.points,width:r.width,kind:r.kind});
const buildings=world.filter(e=>e.tags?.building&&e.geometry?.length>3)
 .map(e=>e.geometry.map(to));
const plan=planPionyru2023Verge(roads,{
 roadClearance:index,buildingFootprints:buildings});
assert(plan,'Real OSM 5. května and Pionýrů must connect at one mapped vertex');
assert.equal(plan.roadId,'219273174');
assert.equal(plan.junctionRoadId,'118488006');
assert.equal(PIONYRU_2023.imageDate,'2023-06-04');
assert(plan.segmentLength>100&&plan.segmentLength<155);
assert.equal(plan.side,'northeast verge');
assert(plan.accepted.length>=2&&plan.accepted.length<=5,
 'The historic satellite documents a few shrubs, not a random avenue');
for(const p of plan.accepted){
 assert(index.isClear(p.x,p.z,p.radius,.25));
 assert(p.along>=19&&p.along<=51);
 assert(p.across>0);
}
assert(plan.rejected.every(p=>p.reason==='mapped-road-or-footway'||
 p.reason==='mapped-building-footprint'));
console.log('PIONYRU_ACCESS_DIAG',JSON.stringify({
 rejected:plan.accessRejected.map(p=>({id:p.id,reason:p.reason,
 near:index.nearest(p.x,p.z),along:p.along,side:p.side,depth:p.depth})),
 accepted:plan.accessAccepted.map(p=>({id:p.id,x:p.x,z:p.z}))
}));
// Read-only access continuity checks use modelled OSM widths, not
// a guess that a photographed access fully connects to a private gate.
assert.equal(plan.accessContinuityAudit.length,2);
for(const a of plan.accessContinuityAudit){
 assert(Math.abs(a.roadEdgeGapM-.23)<.00001,
  'Both partial verge panels intentionally stop 23cm short of modelled carriageway');
 assert.equal(a.continuousRealDrivewayVerified,false);
 assert.equal(a.needsFullPhotoParcelMatch,true);
 assert.equal(a.distancesAreModelOnly,true);
 assert.equal(a.roadOrFootwayChanged,false);
}
const west=plan.accessContinuityAudit.find(x=>x.side===-1);
const east=plan.accessContinuityAudit.find(x=>x.side===1);
assert(west&&!west.walkwayWithin5m&&west.outerEdgeWalkwayGapM===null,
 'Do not fabricate a mapped west-side footway connection');
assert(east&&east.walkwayId==='1282187908'&&east.walkwayWithin5m,
 'Use real east-side OSM footway, not an invented path');
assert(east.outerEdgeWalkwayGapM>.6&&east.outerEdgeWalkwayGapM<.95,
 'East apron ends about 77 cm before the MODELLED pedestrian edge');
assert.deepEqual(auditPionyruAccessContinuity([],null),[]);
assert.equal(plan.accessAccepted.length,2,
 'Both explicitly pictured 2023 public-verge entrances must be located safely');
assert.equal(plan.accessRejected.length,0);
for(const p of plan.accessAccepted){
 assert.equal(p.onlyPublicVerge,true);
 assert.equal(p.noPrivateDrivewayOwnershipClaim,true);
 assert.equal(p.screenshotMatchedNotSurveyed,true);
 assert.equal(p.sourceDate,'2023-06-04');
 assert(p.along>=90&&p.along<=96);
 assert(p.nearSide>4&&p.farSide<7.5);
 assert(isRoadFreeRect(index,{x:p.x,z:p.z,length:p.widthAlong,
  depth:p.depth,yaw:p.yaw,buffer:.04,step:.12}),
 'Every centimetre of the photo-supported access apron must remain off mapped roads and footways');
 assert(plan.accepted.every(q=>Math.hypot(q.x-p.x,q.z-p.z)>q.radius+1),
 'Keep the 5.82.2 planting clusters off the documented property access');
}
assert.equal(plan.accessAccepted.filter(x=>x.side===-1).length,1);
assert.equal(plan.accessAccepted.filter(x=>x.side===1).length,1);

assert.equal(plan.modelledNotSurveyed,true);
assert.equal(plan.roadSurfaceChanged,false);
assert.equal(plan.sidewalkGeometryChanged,false);
assert.equal(planPionyru2023Verge([]),null);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(game.includes("streetAudit=pionyru"));
assert(game.includes('photoPionyruVerge.create(osmDriveRoads,footprints)'));
assert(game.includes('if(churchStreetSourceComplete){'),
 'Regional OSM streaming must not remove the photographed Pionýrů scene');
assert(game.includes("pionyru?.center?.x??eye.x"));
console.log('5.82.4 PIONYRU_ACCESS_CONTINUITY_DIAG_OK',JSON.stringify({
 accepted:plan.accepted.length,rejected:plan.rejected.length,
 accesses:plan.accessAccepted.map(a=>({id:a.id,along:a.along,side:a.side})),
 length:+plan.segmentLength.toFixed(1),junction:plan.junction,
 placements:plan.accepted.map(p=>({along:p.along,across:p.across}))
}));
