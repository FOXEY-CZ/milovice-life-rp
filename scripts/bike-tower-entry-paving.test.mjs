// Milovice RP 5.81.4 — source-backed entry paving, not an invented
// parking island or new path crossing Nádražní. Preserve road collision masks.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance,isRoadFreeRect} from './road-clearance.js';
import {planBikeTowerEntryPaving,BIKE_TOWER_ENTRY_PAVING_SOURCE}
 from './bike-tower-entry-paving.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';
const elements=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',
 import.meta.url),'utf8')).elements;
const clearance=createRoadClearance();
let indexed=0;
for(const el of elements){
 const kind=el.tags?.highway;
 if(!kind||!el.geometry?.length)continue;
 const width=kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:
  kind==='pedestrian'?4:kind==='footway'?1.8:
  kind==='path'||kind==='steps'?1.65:kind==='cycleway'?2:
  kind==='service'?4.5:7.8;
 indexed+=clearance.addRoad({id:el.id,points:el.geometry.map(stationGpsToWorld),
  kind,width});
}
assert(indexed>10);
const p=planBikeTowerEntryPaving(elements,clearance);
assert(p,'OSM 1011197691 Bike Tower entrance must have road-free paver access');
assert.deepEqual(p.sourceWayIds,[1011197691,1165594426]);
assert.equal(p.width,3.1);
assert.equal(p.depth,2.1);
assert.equal(p.groundOffset,.15);
assert(p.radius>=3.2&&p.radius<=4.1);
assert.equal(p.drawCalls,1);
assert.equal(p.connectedToMappedFootway,true);
assert.equal(p.connector.footwayWayId,1165594426);
assert(p.connector.length>6&&p.connector.length<10,
 'Connection must reach the physically rendered footway, not a clipped line');
assert.equal(p.connector.widthStart,3.10);
assert.equal(p.connector.widthEnd,1.64);
assert.equal(p.singleContinuousSurface,true);
assert.equal(p.connector.singleContinuousSurface,true);
assert.equal(p.sourceLandscapeVegetationPreserved,true);
assert.equal(p.connector.stationSideExpanded,true);
assert.equal(p.connector.uvAlignedWithMappedFootway,true);
assert.equal(p.connector.endAlignedWithMappedFootway,true);
const endNormal=p.connector.landingSide;
const actualLastNormal=p.connector.forecourtRows.at(-1).side;
assert(Math.abs(actualLastNormal.x*endNormal.x+actualLastNormal.z*endNormal.z-1)<1e-9,
 'Landing must end orthogonally to the actual OSM footway');
assert.equal(p.connector.textureBasis.footwayWidthMeters,1.8);
assert.equal(p.connector.textureBasis.repeatAlongMeters,8);
assert.equal(p.connector.roadSideConstrained,true);
assert(p.connector.widestWidth>4.3&&p.connector.widestWidth<5);
assert(p.connector.narrowestWidth>=1.6&&p.connector.narrowestWidth<2);
assert(p.connector.estimatedAreaM2>25&&p.connector.estimatedAreaM2<65);
assert(p.connector.buildingMargin>.45);
const rows=p.connector.forecourtRows;
assert.equal(rows.length,31,'pad rows + one continuous connector; no double-front row');
assert(rows.slice(0,7).every(r=>r.phase==='apron'));
assert(rows.slice(7).every(r=>r.phase==='forecourt'));
const front=rows[6],next=rows[7];
assert(Math.hypot(next.x-front.x,next.z-front.z)>.01,
 'front apron row must join the next row without duplicate overlapping geometry');
assert(Math.abs((front.station+front.road)-p.width)<.001);
assert(rows[18].station>rows[18].road+1.5,
 'pedestrian forecourt must expand toward station, not into road');
assert(rows.at(-1).station+rows.at(-1).road<1.9,
 'forecourt must gently narrow into the visible 1.8m OSM footway');
assert.equal(p.connector.targetInsideActuallyRenderedFootway,true);
assert.equal(p.connector.sourceFootwaySegment,3);
assert(p.connector.targetCarriagewayClearance>1.04);
const target=p.connector.end;
const sourceFootway=elements.find(e=>e.id===1165594426);
const sourceSegment=p.connector.sourceFootwaySegment;
assert(sourceSegment>0&&sourceSegment<sourceFootway.geometry.length);
assert(p.connector.targetSafeDistanceMeters>7);
assert(p.connector.targetSafeDistanceMeters<11);
assert(Number.isFinite(target.x)&&Number.isFinite(target.z));
assert(Math.hypot(target.x-p.x,target.z-p.z)>7);

assert(p.connector.otherRoadMargin>.17);
assert(p.connector.otherRoadMargin<1,
 'Safety margin must remain measurable near the mapped street');
assert(Math.hypot(p.connector.end.x-p.connector.start.x,
 p.connector.end.z-p.connector.start.z)>1);

assert.equal(p.originalRoadsUntouched,true);
assert.equal(p.buildingMoved,false);
assert.equal(p.collisionsChanged,false);
assert.equal(p.noNewRoads,true);
assert.equal(p.photosCopied,false);
assert.equal(p.approximateBoundary,true);
assert.equal(p.approximateWidth,true);
assert.equal(BIKE_TOWER_ENTRY_PAVING_SOURCE.commonsDate,'2024-05-30');
assert.equal(BIKE_TOWER_ENTRY_PAVING_SOURCE.mapyPanoramaDate,'2022-05-17');
assert.equal(BIKE_TOWER_ENTRY_PAVING_SOURCE.surveyedPavingBoundary,false);
assert(isRoadFreeRect(clearance,{x:p.x,z:p.z,length:p.width,depth:p.depth,
 yaw:p.yaw,buffer:.18,step:.25}));
assert(clearance.nearest(p.x,p.z)?.clearance>1.5,
 'Paver rectangle must remain away from street and official footway');
assert.equal(planBikeTowerEntryPaving([],clearance),null);
assert.equal(planBikeTowerEntryPaving(elements,null),null);
assert.equal(planBikeTowerEntryPaving(elements.filter(x=>x.id!==1011197691),
 clearance),null);
assert.equal(planBikeTowerEntryPaving(elements.filter(x=>x.id!==1165594426),
 clearance),null);
// A future OSM update introducing a lane through this place must cause
// automatic rejection, not paint new paving over a live carriageway.
const blocked=createRoadClearance();
blocked.addRoad({id:'test-encroaching-carriageway',width:6,
 points:[{x:p.x-5,z:p.z},{x:p.x+5,z:p.z}],kind:'residential'});
assert.equal(planBikeTowerEntryPaving(elements,blocked),null);
// Test a *different* OSM footpath across only the connector near its end,
// using the ORIGINAL clearance index so we specifically test its separate
// protection. The intended target footway is the ONLY exemption.
const middle={x:(p.connector.start.x+p.connector.end.x)*.5,
 z:(p.connector.start.z+p.connector.end.z)*.5};
const otherWay={
 type:'way',id:987654321,tags:{highway:'path'},geometry:[
 {lat:50.226-(middle.z-p.connector.side.z*5)/111320,
  lon:14.889+(middle.x-p.connector.side.x*5)/
   (111320*Math.cos(50.226*Math.PI/180))},
 {lat:50.226-(middle.z+p.connector.side.z*5)/111320,
  lon:14.889+(middle.x+p.connector.side.x*5)/
   (111320*Math.cos(50.226*Math.PI/180))}
 ]};
assert.equal(planBikeTowerEntryPaving([...elements,otherWay],clearance),null,
 'Connector must reject ANY extra OSM footway/path even though its own target is exempt');
// A new obstacle at the widened STATION-facing shoulder (not on the
// old narrow 1.55m path) must make the entire proposed forecourt fail.
const shoulder=rows[18],axis={x:p.connector.end.x-p.connector.start.x,
 z:p.connector.end.z-p.connector.start.z};
const axisLength=Math.hypot(axis.x,axis.z);
const obstacle={x:shoulder.x+shoulder.side.x*3.0,
 z:shoulder.z+shoulder.side.z*3.0};
const toGps=q=>({
 lat:50.226-q.z/111320,
 lon:14.889+q.x/(111320*Math.cos(50.226*Math.PI/180))
});
const shoulderPath={
 type:'way',id:987654322,tags:{highway:'path'},geometry:[
  toGps({x:obstacle.x-axis.x/axisLength*2,
   z:obstacle.z-axis.z/axisLength*2}),
  toGps({x:obstacle.x+axis.x/axisLength*2,
   z:obstacle.z+axis.z/axisLength*2})
 ]
};
assert.equal(planBikeTowerEntryPaving([...elements,shoulderPath],clearance),null,
 'Station-side widening must reject a new real OSM footpath on its outer edge');
const shoulderBuilding={
 type:'way',id:987654323,tags:{building:'yes'},geometry:[
  toGps({x:obstacle.x-.5,z:obstacle.z-.5}),
  toGps({x:obstacle.x+.5,z:obstacle.z-.5}),
  toGps({x:obstacle.x+.5,z:obstacle.z+.5}),
  toGps({x:obstacle.x-.5,z:obstacle.z+.5}),
  toGps({x:obstacle.x-.5,z:obstacle.z-.5})
 ]
};
assert.equal(planBikeTowerEntryPaving([...elements,shoulderBuilding],clearance),null,
 'Forecourt must not cover an added OSM building');

const source=readFileSync(new URL('bike-tower-entry-paving.js',import.meta.url),'utf8');
assert(source.includes('isRoadFreeRect(roadClearance'));
assert(source.includes('terrainAt(pt.x,pt.z)+plan.groundOffset'));
assert(source.includes('sharedMaterial=sidewalkMaterial'));
assert(source.includes('basis.footwayWidthMeters'));
assert(source.includes('const blend=phase*phase*(3-2*phase)'));
assert(source.includes('basis.repeatAlongMeters'));
assert(source.includes('layer.add(root)'));
assert(source.includes('nearbyProtectedSegments'));
assert(source.includes('renderedSafeFootwayPieces'));
assert(source.includes('safePedestrianPieces('));
assert(source.includes('targetInsideActuallyRenderedFootway:true'));
assert(source.includes('createRoadClearance()'));
assert(source.includes('connectedToMappedFootway:true'));
assert(source.includes('const rows=plan.connector.forecourtRows;'));
assert(source.includes('sampleRow(row,j/ACROSS_ROWS)'));
assert(source.includes('const PAD_ROWS=6,CONNECTOR_ROWS=24,ACROSS_ROWS=12'));
assert(source.includes('station:PAD_WIDTH/2+2.10*bulge-.60*ease'));
assert(source.includes('road:PAD_WIDTH/2-.86*ease'));
assert(source.includes('nearBuildingPolygons'));
assert(source.includes('polygonGap(p,polygon)'));
assert(!source.includes('const baseVertex=vertices.length/3'),
 'No second overlapping connector geometry permitted');
assert(source.includes('indices.push(k,k+1,after,k+1,after+1,after)'));
assert(source.includes('sharedMaterial=sidewalkMaterial'));
assert(source.includes('geometry?.dispose()'));
assert(!source.includes('new THREE.MeshLambertMaterial'));
assert(!source.includes('new THREE.CanvasTexture'));
assert(!source.includes('new THREE.TextureLoader'));
assert(!source.includes('fetch('));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes("const BUILD_ID='20261116-pionyru-access-continuity-audit-58240'"));
assert(html.includes("from './scripts/bike-tower-entry-paving.js?v=58240'"));
assert(html.includes("bikeTowerEntryPaving.create(elements,{sidewalkMaterial:osmSidewalkMat})"));
assert(html.includes('bikeTowerEntryPaving.reset()'));
assert(html.includes('bikeTowerEntryPaving:bikeTowerEntryPaving.status()'));
assert(html.includes("stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})"));
assert(html.includes('worldAlignedRoadUv:true'));
console.log('5.82.2 PASS continuous wide Bike Tower forecourt with actual OSM road and building exclusions',JSON.stringify({
 sourceIds:p.sourceWayIds,width:p.width,depth:p.depth,
 indexedStreetSegments:indexed,
 clearanceMeters:+clearance.nearest(p.x,p.z).clearance.toFixed(2),
 drawCalls:1,geometryMoved:false
}));
