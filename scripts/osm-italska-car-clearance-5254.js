/** v5.254: model-only clearance of ordinary NPC cars on exact OSM 8590284.
 * Never asserts surveyed street width or real traffic signs.
 */
import {narrowItalskaRoad5253} from './osm-italska-narrow-npc-5253.js';
export const ITALSKA_CAR_CLEARANCE_5254=Object.freeze({
 roadModelWidth:5,halfLaneOffset:1.25,
 standardBodyWidth:1.81,wideBodyWidth:2.04,
 // world-models.js: external mirrors at +/- (bodyWidth*.56 + .03)
 standardExteriorWidth:2*(1.81*.56+.03),
 wideExteriorWidth:2*(2.04*.56+.03),
 minimumPassingGap:0.20,minimumRoadEdgeGap:0.15
});
export function inspectItalskaCarPair5254(widthA,widthB){
 const c=ITALSKA_CAR_CLEARANCE_5254;
 const passingGap=2*c.halfLaneOffset-(widthA+widthB)/2;
 const edgeGap=Math.min(c.roadModelWidth/2-c.halfLaneOffset-widthA/2,
  c.roadModelWidth/2-c.halfLaneOffset-widthB/2);
 return {passingGapMetres:+passingGap.toFixed(4),
  smallestEdgeGapMetres:+edgeGap.toFixed(4),
  conservativeModelClearance:passingGap>=c.minimumPassingGap&&
   edgeGap>=c.minimumRoadEdgeGap};
}
export function isWideNpcCar5254(car){
 return car?.wideModel5254===true&&car.driven!==true;
}
export function filterItalskaWideCarTurns5254({roadPlan,car,outgoing}={}){
 if(!Array.isArray(outgoing))return [];
 if(!isWideNpcCar5254(car))return outgoing;
 return outgoing.filter(o=>!narrowItalskaRoad5253(roadPlan,o?.segment));
}
export function filterItalskaWideRecycle5254({roadPlan,car,segments}={}){
 if(!Array.isArray(segments))return [];
 if(!isWideNpcCar5254(car))return segments;
 return segments.filter(s=>!narrowItalskaRoad5253(roadPlan,s));
}
// Model geometry audit: interior direction changes on the unchanged OSM road.
// This is NOT a collision/swept-body simulation; it identifies bends to test.
export function inspectItalskaRoadBends5254({roadPlan,segments}={}){
 const road=Array.isArray(segments)?segments.filter(s=>
  narrowItalskaRoad5253(roadPlan,s)):[];
 const bends=[];
 const xy=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
 for(let i=1;i<road.length;i++){
  const first=road[i-1],second=road[i];
  if(!xy(first?.a)||!xy(first?.b)||!xy(second?.a)||!xy(second?.b))
   continue;
  // Only consecutive source way edges, never compare unrelated graph roads.
  if(Math.hypot(first.b.x-second.a.x,first.b.y-second.a.y)>.05)
   continue;
  const ax=first.b.x-first.a.x,ay=first.b.y-first.a.y;
  const bx=second.b.x-second.a.x,by=second.b.y-second.a.y;
  const la=Math.hypot(ax,ay),lb=Math.hypot(bx,by);
  if(la<.1||lb<.1)continue;
  const dot=Math.max(-1,Math.min(1,(ax*bx+ay*by)/(la*lb)));
  bends.push({angleDegrees:+(Math.acos(dot)*180/Math.PI).toFixed(2),
   at:{x:first.b.x,y:first.b.y},segmentIndex:i});
 }
 return {sourceRoadOSMId:'8590284',originalGpsUnchanged:true,
  interiorBends:bends.length,
  bendsAbove15Degrees:bends.filter(b=>b.angleDegrees>15).length,
  bendsAbove30Degrees:bends.filter(b=>b.angleDegrees>30).length,
  maxBendDegrees:Math.max(0,...bends.map(b=>b.angleDegrees)),
  inspectedBends:bends,
  turningSweptBodyValidated:false};
}
export function inspectItalskaCarClearance5254({roadPlan,segments,cars}={}){
 const c=ITALSKA_CAR_CLEARANCE_5254;
 const narrow=Array.isArray(segments)?
  segments.filter(s=>narrowItalskaRoad5253(roadPlan,s)):[];
 const bendAudit=inspectItalskaRoadBends5254({roadPlan,segments});
 const onNarrow=Array.isArray(cars)?cars.filter(car=>
  !car.driven&&!car.parked&&narrowItalskaRoad5253(roadPlan,car.seg)):[];
 const standard=inspectItalskaCarPair5254(
  c.standardExteriorWidth,c.standardExteriorWidth);
 const wide=inspectItalskaCarPair5254(
  c.wideExteriorWidth,c.wideExteriorWidth);
 const wideOnNarrow=onNarrow.filter(isWideNpcCar5254);
 return {version:'5.254',sourceOSMId:'8590284',
  roadWidthModelledNotSurveyed:true,
  narrowSegments:narrow.length,
  npcCarsOnNarrow:onNarrow.length,
  wideNpcCarsOnNarrow:wideOnNarrow.length,
  standardPair:standard,widePair:wide,
  roadBends:bendAudit,
  idealStraightLaneOnly:true,curvesAndJunctionsNotValidated:true,
  physicalRoadAndSidewalkUnchanged:true,playerVehiclesUnchanged:true,
  originalGpsUnchanged:true,
  ready:narrow.length>0&&wideOnNarrow.length===0&&
   standard.conservativeModelClearance&&!wide.conservativeModelClearance};
}
