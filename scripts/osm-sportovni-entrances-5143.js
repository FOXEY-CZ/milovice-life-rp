/**
 * Milovice RP 5.143 — repair the MODEL doorway plinth on the nine
 * exact OSM/RUIAN apartment buildings beside Sportovní / Průběžná.
 * A 1.30 m tall facade base band used to run IN FRONT of the door.
 * This is a physical facade-overlap fix, NOT a surveyed door position.
 */
import {splitFacadeStripForOpening} from './facade-anchors.js';
import {SPORTOVNI_RUIAN_5140} from './osm-sportovni-ruian-panels-5140.js';

export const SPORTOVNI_DOOR_TRIM_5143=Object.freeze({
 doorFrameWidth:1.65,plinthPadding:.12,windowWidth:1.40,
 windowPadding:.08,sourceBuildingCount:9
});
function sourceLocked(plan){
 return plan?.version==='5.140'&&plan.sourceGeometryExactlyMatched===true&&
  plan.photographedFacade===false&&
  SPORTOVNI_RUIAN_5140.buildings.some(x=>
   x.id===plan.id&&x.ruian===plan.sourceRUIANId);
}
export function planSportovniEntrancePlinth({
 plan,facade,entranceEdgeIndex
}={}){
 if(!sourceLocked(plan)||!Number.isInteger(entranceEdgeIndex)||
  !Number.isInteger(facade?.index)||
  facade.index!==entranceEdgeIndex||
  !Number.isFinite(facade.len)||facade.len<2.1||facade.len>120)return null;
 const parts=splitFacadeStripForOpening(facade,{
  along:0,width:SPORTOVNI_DOOR_TRIM_5143.doorFrameWidth,
  padding:SPORTOVNI_DOOR_TRIM_5143.plinthPadding,minWidth:.03
 });
 if(parts.length!==2)return null;
 const gap=facade.len-parts.reduce((n,p)=>n+p.width,0);
 if(Math.abs(gap-(SPORTOVNI_DOOR_TRIM_5143.doorFrameWidth+
    2*SPORTOVNI_DOOR_TRIM_5143.plinthPadding))>.001)return null;
 return {
  sourceBuildingId:plan.id,sourceRUIANId:plan.sourceRUIANId,
  sourceEdgeIndex:facade.index,sourceOSMUnchanged:true,
  wallLength:facade.len,parts,
  openingWidth:gap,removedOverlappingPlinth:true,
  oldSolidPlinthWidth:facade.len,
  doorLocationPhotographed:false,entranceLocationEstimated:true,
  inventedDoorCount:0,addedColliderCount:0
 };
}
export function sportovniEntryWindowConflict({
 plan,entranceEdgeIndex,edgeIndex,edgeLength,
 fraction,floor
}={}){
 if(!sourceLocked(plan)||!Number.isInteger(entranceEdgeIndex)||
  edgeIndex!==entranceEdgeIndex||floor!==0||
  !Number.isFinite(fraction)||fraction<0||fraction>1||
  !Number.isFinite(edgeLength)||edgeLength<2.1||edgeLength>120)
  return false;
 // Check WINDOW FRAME extents in metres against the real model doorway
 // trim instead of blindly suppressing 19% of every frontage width.
 const clearance=(SPORTOVNI_DOOR_TRIM_5143.doorFrameWidth+
  SPORTOVNI_DOOR_TRIM_5143.windowWidth)*.5+
  SPORTOVNI_DOOR_TRIM_5143.windowPadding;
 return Math.abs((fraction-.5)*edgeLength)<clearance;
}
