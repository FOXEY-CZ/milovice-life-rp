/**
 * Milovice RP 5.144 — photo-georeferenced Průběžná/Sportovní facade hints.
 *
 * TWO open-licensed 2024 street photographs exist with EXIF camera
 * coordinates and true compass direction. We do NOT copy their pixels
 * into the game. Only the two 5.140 source-locked OSM/RUIAN tower faces
 * in the photographed direction get cautious plaster-tone suggestions.
 * The 2024 photograph is NOT a survey of roofs, balconies, doors,
 * exact window spacing, or the street's 2025 reconstruction.
 */
import {selectExteriorFacadeToward} from './facade-anchors.js';
import {SPORTOVNI_RUIAN_5140} from './osm-sportovni-ruian-panels-5140.js';

export const PRUBEZNA_PUBLIC_PHOTOS_5144=Object.freeze({
 prubezna:Object.freeze({
  source:'https://commons.wikimedia.org/wiki/File:Pr%C5%AFb%C4%9B%C5%BEn%C3%A1.jpg',
  author:'Risajanda',license:'CC BY-SA 3.0',date:'2024-06-13',
  camera:Object.freeze({lat:50.230236,lon:14.864183}),
  heading:272.09,lens35mmEquivalent:26,
  cameraLocationFromEXIF:true,headingFromEXIF:true,
  originalPhotoPixelsCopied:false
 }),
 sportovni:Object.freeze({
  source:'https://commons.wikimedia.org/wiki/File:Sportovn%C3%AD_(3).jpg',
  author:'Risajanda',license:'CC BY-SA 3.0',date:'2024-06-06',
  camera:Object.freeze({lat:50.230950,lon:14.866606}),
  heading:277.50,lens35mmEquivalent:26,
  cameraLocationFromEXIF:true,headingFromEXIF:true,
  originalPhotoPixelsCopied:false
 })
});
export const PRUBEZNA_FRONTAGES_5144=Object.freeze([
 Object.freeze({id:'53865991',ruian:'24969010',floors:9,
  material:'prubeznaPhotoCream',
  paletteEstimated:'off-white with dark burgundy upper edge',
  streetSide:'photo left (south)',otherSidesUnverified:true}),
 Object.freeze({id:'53865992',ruian:'18198627',floors:8,
  material:'prubeznaPhotoMint',
  paletteEstimated:'pale green with dark burgundy upper edge',
  streetSide:'photo right (north)',otherSidesUnverified:true})
]);
export function planPrubeznaPhotoFrontage({plan,outline,cameraWorld}={}){
 if(plan?.version!=='5.140'||plan?.regionId!=='mlada'||
  !plan?.sourceGeometryExactlyMatched||plan.photographedFacade||
  !Number.isFinite(cameraWorld?.x)||
  !Number.isFinite(cameraWorld?.z)||!Array.isArray(outline)||
  outline.length<4)return null;
 const chosen=PRUBEZNA_FRONTAGES_5144.find(f=>f.id===plan.id&&
  f.ruian===plan.sourceRUIANId&&f.floors===plan.floors);
 const spec=SPORTOVNI_RUIAN_5140.buildings.find(x=>x.id===plan.id);
 if(!chosen||!spec||spec.hash!==plan.sourceOSMHash||
  spec.ruian!==plan.sourceRUIANId)return null;
 const face=selectExteriorFacadeToward(outline,cameraWorld,{
  minLength:7,maxLength:100
 });
 if(!face||face.cameraDistance>160||face.cameraVisibility<.10)return null;
 // The supplied photo's EXIF fixes the camera; the exact visible wall
 // face is spatially inferred from the OSM footprint, not photo surveyed.
 const center=outline.reduce((p,q)=>({
  x:p.x+q.x/outline.length,z:p.z+(q.z??q.y)/outline.length
 }),{x:0,z:0});
 const dx=center.x-cameraWorld.x,dz=center.z-cameraWorld.z;
 const bearing=(Math.atan2(dx,-dz)*180/Math.PI+360)%360;
 const error=Math.abs(((bearing-PRUBEZNA_PUBLIC_PHOTOS_5144.prubezna.heading+540)%360)-180);
 if(error>38)return null;
 return {
  version:'5.144',sourceId:chosen.id,sourceRUIANId:chosen.ruian,
  sourcePhoto:PRUBEZNA_PUBLIC_PHOTOS_5144.prubezna.source,
  sourceDate:'2024-06-13',license:'CC BY-SA 3.0',
  material:chosen.material,streetSide:chosen.streetSide,
  modelTintEstimated:true,photoRealFacadeObserved:true,
  frontEdgeInferredFromFootprint:true,sourceEdgeIndex:face.index,
  sourceFaceLength:+face.len.toFixed(2),
  sourceGPSFootprintUnchanged:true,sourceOriginalFloorsUnchanged:true,
  otherSidesUnverified:true,windowPositionsUnverified:true,
  photographedRoofGeometryUnverified:true,
  noPhotoPixelsCopied:true,noNewRoads:true,noNewWindows:true,
  newBuildingCount:0,newColliders:0
 };
}
