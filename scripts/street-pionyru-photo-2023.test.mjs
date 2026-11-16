import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PIONYRU_2023,planPionyru2023Verge} from './street-pionyru-photo-2023.js';
import {createRoadClearance} from './road-clearance.js';
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
assert.equal(plan.modelledNotSurveyed,true);
assert.equal(plan.roadSurfaceChanged,false);
assert.equal(plan.sidewalkGeometryChanged,false);
assert.equal(planPionyru2023Verge([]),null);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(game.includes("streetAudit=pionyru"));
assert(game.includes("photoPionyruVerge.create(osmDriveRoads,buildingWays.map(w=>w.geometry.map(osmPoint)))"));
assert(game.includes("pionyru?.center?.x??eye.x"));
console.log('5.82.1 PIONYRU_SATELLITE_OK',JSON.stringify({
 accepted:plan.accepted.length,rejected:plan.rejected.length,
 length:+plan.segmentLength.toFixed(1),junction:plan.junction,
 placements:plan.accepted.map(p=>({along:p.along,across:p.across}))
}));
