/**
 * Milovice RP 5.148 — a single exact six-storey RÚIAN apartment block
 * on Topolová, adjacent to the Sportovní junction. The cadastral
 * polygon and levels are evidence; window rhythm, cladding, door side
 * and floor height remain unphotographed MODEL estimates.
 */
import {splitFacadeStripForOpening} from './facade-anchors.js';
export const TOPOLOVA_RESIDENTIAL_5148=Object.freeze({
 id:'53866045',ruian:'42429056',regionId:'mlada',
 floors:6,flats:60,vertices:23,geometryHash:'aef1ea1b',
 source:'RÚIAN via OSM Mladá',facadePhotoVerified:false
});
function fingerprint(geometry){
 let h=2166136261;
 const value=geometry.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 for(const char of value){h^=char.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16).padStart(8,'0');
}
export function planTopolovaResidential5148({
 id,regionId,tags={},geometry,height,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const src=TOPOLOVA_RESIDENTIAL_5148;
 if(regionId!==src.regionId||String(id)!==src.id||photoReviewed||
  approvedArchitecture||tags.building!=='residential'||
  tags['building:levels']!==String(src.floors)||
  tags['building:flats']!==String(src.flats)||
  tags['ref:ruian:building']!==src.ruian||
  tags.source!=='cuzk:ruian'||tags.height!==undefined||
  !Number.isFinite(height)||Math.abs(height-src.floors*3.05)>.15||
  !Array.isArray(geometry)||geometry.length!==src.vertices||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  fingerprint(geometry)!==src.geometryHash)return null;
 return {
  version:'5.148',id:src.id,regionId,
  floors:src.floors,flats:src.flats,height,floorHeight:height/src.floors,
  sourceRUIANId:src.ruian,sourceOSMVertices:src.vertices,
  sourceOSMHash:src.geometryHash,
  sourceGeometryExactlyMatched:true,sourceActualLevelTags:true,
  photographedFacade:false,photographicallyMeasuredHeight:false,
  modelPanelJoints:true,modelDoorLocation:true,
  footprintChanged:false,roofShapeChanged:false,roadGeometryChanged:false,
  newBuildings:0,newWindows:0,newDoors:0,newTrees:0,
  newRoofs:0,newColliders:0
 };
}
function sourceMatch(plan){
 return plan?.version==='5.148'&&
  plan.id===TOPOLOVA_RESIDENTIAL_5148.id&&
  plan.sourceRUIANId===TOPOLOVA_RESIDENTIAL_5148.ruian&&
  plan.sourceGeometryExactlyMatched===true;
}
export function planTopolovaEntrancePlinth5148({
 plan,facade,entranceEdgeIndex
}={}){
 if(!sourceMatch(plan)||!Number.isInteger(entranceEdgeIndex)||
  !Number.isInteger(facade?.index)||facade.index!==entranceEdgeIndex||
  !Number.isFinite(facade.len)||facade.len<2.1||facade.len>120)return null;
 const parts=splitFacadeStripForOpening(facade,{
  along:0,width:1.65,padding:.12,minWidth:.03
 });
 if(parts.length!==2)return null;
 const gap=facade.len-parts.reduce((n,p)=>n+p.width,0);
 if(Math.abs(gap-1.89)>.001)return null;
 return {parts,openingWidth:gap,
  sourceBuildingId:plan.id,doorPositionPhotographed:false,
  removedOverlappingPlinth:true,newDoorCount:0};
}
export function topolovaDoorWindowConflict5148({
 plan,entranceEdgeIndex,edgeIndex,edgeLength,fraction,floor
}={}){
 if(!sourceMatch(plan)||!Number.isInteger(entranceEdgeIndex)||
  edgeIndex!==entranceEdgeIndex||floor!==0||
  !Number.isFinite(fraction)||fraction<0||fraction>1||
  !Number.isFinite(edgeLength)||edgeLength<2.1||edgeLength>120)return false;
 return Math.abs((fraction-.5)*edgeLength)<(1.65+1.40)*.5+.08;
}
