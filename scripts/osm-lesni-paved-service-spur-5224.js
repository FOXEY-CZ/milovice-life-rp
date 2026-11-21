/** Milovice RP 5.224 — source-locked continuation of original Lesní pavers.
 * These TWO roads genuinely SHARE one original OSM GPS endpoint.
 * Render the existing 40m service spur in the same estimated shared
 * paving-stone material as 5.223, without adding a connection.
 */
import {planLesniPavedLivingStreet5223} from './osm-lesni-paved-living-street-5223.js';
export const LESNI_PAVED_SERVICE_SPUR_5224=Object.freeze({
 region:'mlada',parentId:'83026442',id:'1282136966',
 sourceHash:'90818fe3',sourceNodes:3,sourceSegments:2,
 expectedLengthMeters:40.007,combinedLengthMeters:333.570,
 parentHash:'9cc757ea',parentSegments:9,
 highway:'service',surface:'paving_stones',vehicle:'destination',
 parentHighway:'living_street',parentMotorVehicle:'destination',
 junctionGPS:'50.2309313,14.8734086',
 sharedMaterial:'visnova-tagged-paving-stones',
 actualStonePatternPhotoVerified:false,actualStoneShadePhotoVerified:false
});
const canonical=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(canonical).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320});
export function planLesniPavedServiceSpur5224({regionId,ways}={}){
 const cfg=LESNI_PAVED_SERVICE_SPUR_5224;
 if(regionId!==cfg.region||!Array.isArray(ways))return null;
 const parent=ways.filter(w=>String(w?.id)===cfg.parentId);
 const spur=ways.filter(w=>String(w?.id)===cfg.id);
 if(parent.length!==1||spur.length!==1)return null;
 const parentPlan=planLesniPavedLivingStreet5223(regionId,parent[0]);
 if(!parentPlan||parentPlan.sourceHash!==cfg.parentHash||
  parentPlan.sourceSegments!==cfg.parentSegments||
  parentPlan.material!==cfg.sharedMaterial||
  parentPlan.sourceMotorVehicle!==cfg.parentMotorVehicle||
  parentPlan.sourceRoadType!==cfg.parentHighway)return null;
 const way=spur[0],t=way.tags,g=way.geometry;
 if(!t||t.highway!==cfg.highway||t.surface!==cfg.surface||
  t.vehicle!==cfg.vehicle||Object.keys(t).length!==3||
  !Array.isArray(g)||g.length!==cfg.sourceNodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(g)!==cfg.sourceHash)return null;
 const parentPoints=parent[0].geometry;
 if(canonical(parentPoints[parentPoints.length-1])!==cfg.junctionGPS||
  canonical(g[g.length-1])!==cfg.junctionGPS)return null;
 const points=g.map(xy);
 let length=0;
 for(let i=1;i<points.length;i++){
  const d=Math.hypot(points[i].x-points[i-1].x,
   points[i].z-points[i-1].z);
  if(!(d>.5&&d<100))return null;
  length+=d;
 }
 if(Math.abs(length-cfg.expectedLengthMeters)>.15||
  Math.abs(length+parentPlan.originalLengthMeters-
   cfg.combinedLengthMeters)>.3)return null;
 return {
  version:'5.224',sourceOSMId:cfg.id,sourceHash:cfg.sourceHash,
  parentOSMId:cfg.parentId,parentHash:cfg.parentHash,
  originalJunctionGPS:cfg.junctionGPS,
  originalNodes:cfg.sourceNodes,originalSegments:cfg.sourceSegments,
  originalLengthMeters:+length.toFixed(3),
  parentOriginalSegments:parentPlan.sourceSegments,
  parentOriginalMeters:parentPlan.originalLengthMeters,
  connectedOriginalSegments:cfg.parentSegments+cfg.sourceSegments,
  connectedOriginalMeters:+(length+parentPlan.originalLengthMeters).toFixed(3),
  material:cfg.sharedMaterial,
  sourceHighway:t.highway,sourceSurface:t.surface,sourceVehicle:t.vehicle,
  parentSourceHighway:cfg.parentHighway,
  parentSourceMotorVehicle:cfg.parentMotorVehicle,
  realPaverColourPhotoVerified:false,realPaverPatternPhotoVerified:false,
  originalOSMConnectionAlreadyExists:true,
  sourceGeometryUnchanged:true,sourceRoadWidthsUnchanged:true,
  vehicleRestrictionsUnchanged:true,addedRoadConnections:0,
  newRoads:0,newFootways:0,newBuildings:0,newParking:0,
  newKerbs:0,newColliders:0,newSigns:0
 };
}
