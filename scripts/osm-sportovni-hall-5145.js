/**
 * Milovice RP 5.145 — sportovní hala on the eastern Sportovní street.
 * One existing source-locked OSM/RÚIAN polygon (way 53866046, one floor).
 * Photo from Sportovní (3).jpg, Risajanda, 2024-06-06, CC BY-SA 3.0,
 * shows tall silver vertically ribbed metal cladding. Actual height,
 * rib intervals and unseen sides are NOT surveyed.
 */
import {selectExteriorFacadeToward} from './facade-anchors.js';
export const SPORTOVNI_HALL_5145=Object.freeze({
 id:'53866046',regionId:'mlada',ruian:'27906272',
 levels:'1',sourceVertices:13,sourceHash:'b4bc8b6d',
 photo:'https://commons.wikimedia.org/wiki/File:Sportovn%C3%AD_(3).jpg',
 photoDate:'2024-06-06',author:'Risajanda',license:'CC BY-SA 3.0',
 camera:Object.freeze({lat:50.230950,lon:14.866606,heading:277.50}),
 photographedFaceIndex:6,photographedFaceLengthApproxMeters:52.21,
 estimatedHallHeightMeters:9.6,
 corrugationSpacingMeters:1.3
});
function hashGPS(geo){
 let n=2166136261;
 const s=geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 for(const ch of s){n^=ch.charCodeAt(0);n=Math.imul(n,16777619)}
 return (n>>>0).toString(16).padStart(8,'0');
}
export function planSportovniPhotoHall({
 id,regionId,tags,geometry,outline,cameraWorld,originalHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const source=SPORTOVNI_HALL_5145;
 if(regionId!==source.regionId||String(id)!==source.id||
  tags?.building!=='yes'||tags['building:levels']!==source.levels||
  tags['ref:ruian:building']!==source.ruian||
  tags.source!=='cuzk:ruian'||tags.height!==undefined||
  photoReviewed||approvedArchitecture||
  !Number.isFinite(originalHeight)||Math.abs(originalHeight-3.05)>.015||
  !Array.isArray(geometry)||geometry.length!==source.sourceVertices||
  geometry.some(p=>!Number.isFinite(p.lat)||!Number.isFinite(p.lon))||
  hashGPS(geometry)!==source.sourceHash||
  !Array.isArray(outline)||outline.length!==geometry.length-1||
  !Number.isFinite(cameraWorld?.x)||!Number.isFinite(cameraWorld?.z))
  return null;
 const face=selectExteriorFacadeToward(outline,cameraWorld,{
  minLength:35,maxLength:80});
 if(!face||face.index!==source.photographedFaceIndex||
  Math.abs(face.len-source.photographedFaceLengthApproxMeters)>.25||
  face.cameraDistance<40||face.cameraDistance>130||
  face.cameraVisibility<.7)return null;
 const ribCount=Math.min(50,Math.max(16,Math.round(
  face.len/source.corrugationSpacingMeters)));
 const ribPositions=Array.from({length:ribCount-1},(_,i)=>
  -face.len/2+face.len*(i+1)/ribCount);
 return {
  version:'5.145',sourceId:source.id,sourceRUIANId:source.ruian,
  sourcePhoto:source.photo,sourceDate:source.photoDate,
  existingOSMLevels:1,originalInferredHeight:originalHeight,
  modelHeight:source.estimatedHallHeightMeters,
  photoVisibleHighMetalCladding:true,realMeasuredHallHeight:false,
  verifiedFacadeIndex:face.index,facadeLength:face.len,
  ribPositions,spacingModelEstimated:true,ribCount:ribPositions.length,
  windowLocationsVerified:false,noWindowsOnObservedBlankWall:true,
  sourceGPSFootprintPreserved:true,unobservedWallsNotPhotoVerified:true,
  roofOutlineUnchanged:true,roofSlopeUnmeasured:true,
  newBuildings:0,newRoads:0,newColliders:0,newSigns:0,
  newTrees:0,newFences:0,newLampposts:0
 };
}
