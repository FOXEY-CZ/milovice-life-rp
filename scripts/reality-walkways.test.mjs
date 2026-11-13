import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {isCarriageway,markedCrossing,isPedestrianWay,
 safePedestrianPieces,pedestrianPieceKey,planStationPassage,planZebraPieces} from './reality-walkways.js';
const road=createRoadClearance();
road.addRoad({id:'road',points:[{x:-30,y:0},{x:30,y:0}],kind:'residential',width:8});
const parts=safePedestrianPieces({x:0,y:-18},{x:0,y:18},1.8,road);
assert.equal(parts.length,2,'Mapped pedestrian crossing cannot paint paving across full road');
for(const p of parts){
 const t=(p.a.z+p.b.z)*.5;
 assert(road.isClear(0,t,.9,.08),'Mapped pedestrian pavement stays clear of asphalt');
}
assert.equal(safePedestrianPieces({x:20,y:-10},{x:20,y:10},1.8,road).length,2);
assert(pedestrianPieceKey({a:{x:0,z:1},b:{x:3,z:5}},1.8)===
 pedestrianPieceKey({a:{x:3,z:5},b:{x:0,z:1}},1.8),'A duplicate reversed OSM footway must merge');
assert(markedCrossing({footway:'crossing',crossing:'marked'}));
assert(!markedCrossing({footway:'crossing'}),'Unknown zebra paint is not invented');
assert(isCarriageway('service')&&!isCarriageway('footway'));
assert(isPedestrianWay('footway')&&!isPedestrianWay('residential'));
const e=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8')).elements;
const byId=id=>e.find(el=>String(el.id)===String(id));
const COS=Math.cos(50.226*Math.PI/180);
const point=o=>({x:(o.lon-14.889)*111320*COS,y:-(o.lat-50.226)*111320});
for(const way of e.filter(el=>el.tags?.highway&&isCarriageway(el.tags.highway)))
 road.addRoad({id:way.id,kind:way.tags.highway,width:{
  primary:11,secondary:9,tertiary:8,service:4.5
 }[way.tags.highway]||7.8,points:way.geometry.map(point)});
const station=byId(53865956),foot=byId(549346217);
assert(station&&foot&&station.tags.name==='Milovice');
const originalStation=station.geometry.map(point),originalFootway=foot.geometry.map(point);
const plan=planStationPassage({footprint:originalStation,footway:originalFootway,halfOpening:1.75});
assert(plan,'Must align passage with documented OSM pedestrian way');
assert(plan.alignedFromMappedFootway&&plan.sourceFootwayId===549346217);
assert(plan.s>3&&plan.s<8,'Passage must move from arbitrary center toward mapped footway: '+JSON.stringify(plan));
assert(Math.abs(plan.s-plan.footS)<Math.abs(plan.footS),
 'New station axis nearer than old s=0');
assert(plan.footwayEndpoint&&Number.isFinite(plan.footwayEndpoint.x));
assert(Number.isInteger(plan.streetEdge)&&Number.isInteger(plan.railEdge)&&plan.streetEdge!==plan.railEdge);
const crossingWays=e.filter(el=>el.tags?.highway==='footway'&&el.tags?.footway==='crossing');
assert.equal(crossingWays.length,3);
assert.equal(crossingWays.filter(w=>markedCrossing(w.tags)).length,1,
 'Only ONE of the 3 old-town crossing ways proves actual painted zebra marking');
const marked=crossingWays.find(w=>markedCrossing(w.tags));
const stripes=planZebraPieces(marked.geometry.map(point),road);
for(const item of stripes){
 const middle={x:(item.a.x+item.b.x)*.5,y:(item.a.z+item.b.z)*.5};
 assert(road.nearest(middle.x,middle.y).clearance<0,
  'Mapped zebra bars are strictly over asphalt and not all over a sidewalk');
}
console.log('5.26 station and OSM walking geometry:',JSON.stringify({
 stationShiftMeters:plan.s.toFixed(2),oldAxis:0,footwayAxis:plan.footS.toFixed(2),
 stationSideWall:plan.streetEdge,railSideWall:plan.railEdge,
 pedestrianSafeSections:parts.length,recordedCrossings:crossingWays.length,
 explicitlyMarked:1,drawnZebraStripes:stripes.length,carriagewayRoads:road.stats().indexedRoutes
}));
