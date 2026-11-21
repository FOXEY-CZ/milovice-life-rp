/** Milovice RP 5.223 — original 293.56 m Lesní paved living street.
 * Only replaces the GAME material on nine already existing OSM segments.
 * Surface TYPE is confirmed by OSM; tint/paver pattern is not photo-proven.
 * Never invent geometry, widths, access rules, curbs or traffic signs.
 */
export const LESNI_PAVED_LIVING_STREET_5223=Object.freeze({
 region:'mlada',wayId:'83026442',nodes:10,hash:'9cc757ea',
 expectedLengthMeters:293.563,sourceSegments:9,
 tagHighway:'living_street',tagName:'Lesní',tagSurface:'paving_stones',
 tagMotorVehicle:'destination',material:'visnova-tagged-paving-stones',
 photoVerifiedPaverColour:false,photoVerifiedPaverPattern:false
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
export function planLesniPavedLivingStreet5223(regionId,way){
 const c=LESNI_PAVED_LIVING_STREET_5223;
 if(regionId!==c.region||String(way?.id)!==c.wayId)return null;
 const t=way?.tags,g=way?.geometry;
 if(!t||t.highway!==c.tagHighway||t.name!==c.tagName||
  t.surface!==c.tagSurface||t.motor_vehicle!==c.tagMotorVehicle||
  Object.keys(t).length!==4||!Array.isArray(g)||
  g.length!==c.nodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(g)!==c.hash)return null;
 const points=g.map(xy);
 let meters=0;
 for(let i=1;i<points.length;i++){
  const length=Math.hypot(points[i].x-points[i-1].x,
   points[i].z-points[i-1].z);
  if(!(length>.5&&length<150))return null;
  meters+=length;
 }
 if(Math.abs(meters-c.expectedLengthMeters)>.25)return null;
 return {
  version:'5.223',sourceOSMId:c.wayId,sourceHash:c.hash,
  sourceName:c.tagName,sourceRoadType:c.tagHighway,
  sourceSurfaceTag:c.tagSurface,sourceMotorVehicle:c.tagMotorVehicle,
  sourceNodes:c.nodes,sourceSegments:c.sourceSegments,
  originalLengthMeters:+meters.toFixed(3),
  material:c.material,modelColourPhotoVerified:false,
  modelPavingPatternPhotoVerified:false,
  originalRoadGeometryUnchanged:true,originalRoadWidthUnchanged:true,
  originalTrafficAccessUnchanged:true,
  newRoads:0,newFootways:0,newBuildings:0,newColliders:0,
  newKerbs:0,newParking:0,newSigns:0,newTrafficRules:0
 };
}
