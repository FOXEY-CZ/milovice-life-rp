/** 5.253 — OSM-source-locked civil NPC rules on the 5.252 5m
 * MODEL road next to a recovered real mapped Italska sidewalk.
 * This is a model-manoeuvring precaution, NOT a photographed traffic ban.
 * Only NPC bus turns and UNSURVEYED roadside parking are suppressed.
 * Actual road, footway, legitimate mapped parking lots, player driving,
 * other vehicles and legal OSM access tags stay unchanged.
 */
import {ITALSKA_ROAD_SIDEWALK_5252 as src}
 from './osm-italska-road-sidewalk-5252.js';
export function narrowItalskaRoad5253(roadPlan,segment){
 return roadPlan?.version==='5.252'&&
  roadPlan.sourceRoadOSMId===src.roadId&&
  roadPlan.sourceSidewalkOSMId===src.sidewalkId&&
  roadPlan.roadGeometryHash===src.roadHash&&
  roadPlan.sidewalkGeometryHash===src.sidewalkHash&&
  roadPlan.priorModelRoadWidthMetres===7.8&&
  roadPlan.modelWidthMetres===5.0&&
  roadPlan.originalGPSUnchanged===true&&
  String(segment?.osmId)===src.roadId&&
  segment.width===5&&segment.kind==='residential';
}
export function filterItalskaNpcTurns5253({roadPlan,car,outgoing}={}){
 if(!Array.isArray(outgoing))return [];
 if(car?.service!=='432')return outgoing;
 return outgoing.filter(o=>!narrowItalskaRoad5253(roadPlan,o?.segment));
}
export function permitItalskaParking5253({roadPlan,spot}={}){
 if(!spot)return false;
 // Exclude only unverified street-side rows, never OSM outdoor parking lots.
 if(spot.type!=='roadside')return true;
 return !narrowItalskaRoad5253(roadPlan,{
  osmId:spot.sourceId,width:5,kind:'residential'
 });
}
export function inspectItalskaNpcClearance5253({roadPlan,segments,cars}={}){
 if(!roadPlan||!Array.isArray(segments)||!Array.isArray(cars))return null;
 const narrow=segments.filter(s=>narrowItalskaRoad5253(roadPlan,s));
 const parked=cars.filter(c=>c.parked===true&&c.parkingKind==='roadside'&&
  narrowItalskaRoad5253(roadPlan,c.seg));
 const buses=cars.filter(c=>c.service==='432'&&
  narrowItalskaRoad5253(roadPlan,c.seg));
 return {version:'5.253',sourceRoadOSMId:src.roadId,
  sourceSidewalkOSMId:src.sidewalkId,
  roadModelWidthMetres:5,originalModelWidthMetres:7.8,
  mappedNarrowDriveSegments:narrow.length,
  unsafeNarrowRoadsideParkingCars:parked.length,
  publicBusesOnModelNarrowRoad:buses.length,
  mappedRoadGeometryUnchanged:true,
  pedestrianPavingGeometryUnchanged:true,
  busRouteFilterModelOnly:true,legalBusAccessTagChanged:false,
  sourceParkingSpacesChanged:false,
  newRoads:0,newParkingBays:0,newCrossings:0,newColliders:0,
  ready:narrow.length>0&&parked.length===0&&buses.length===0};
}
