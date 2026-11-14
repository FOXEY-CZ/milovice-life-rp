// Milovice RP 5.44 — move on to the next real photographed street landmark.
// ZŠ T. G. Masaryka, Školská 112/15: photo ŠJů, 2024-05-30, CC BY 4.0.
// Source: https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg
// Only the publicly photographed frontage gets observed color and entrance
// treatment. Unphotographed yard/rear sides retain their prior placeholders.
import {exteriorFacadeFrame,facadePoint,flushBoxOffset} from './facade-anchors.js';

export const SCHOOL_PHOTO_WAY_ID=118487979;
export const SCHOOL_PHOTO_CAMERA=Object.freeze([50.2286983,14.8859519]);
export const SCHOOL_PHOTO_URL='https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg';
const METRES_PER_DEGREE=111320,ORIGIN_LAT=50.226,ORIGIN_LON=14.889;
const longitudeScale=Math.cos(ORIGIN_LAT*Math.PI/180);
export function schoolPhotoCameraWorld(){
 return {x:(SCHOOL_PHOTO_CAMERA[1]-ORIGIN_LON)*METRES_PER_DEGREE*longitudeScale,
  z:-(SCHOOL_PHOTO_CAMERA[0]-ORIGIN_LAT)*METRES_PER_DEGREE};
}

export function planSchoolStreetFrontage(points,{camera=schoolPhotoCameraWorld()}={}){
 if(!Array.isArray(points)||points.length<6||points.length>80)return null;
 const camZ=camera?.z??camera?.y;
 if(!Number.isFinite(camera?.x)||!Number.isFinite(camZ))return null;
 const pts=points.map(p=>({x:p.x,z:p.z??p.y}));
 if(pts.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 if(Math.hypot(pts[0].x-pts.at(-1).x,pts[0].z-pts.at(-1).z)<.05)pts.pop();
 const faces=[];
 for(let i=0;i<pts.length;i++){
  const frame=exteriorFacadeFrame(pts,i);
  if(!frame||frame.len<5)continue;
  const dx=camera.x-frame.mx,dz=camZ-frame.mz,d=Math.hypot(dx,dz);
  const visibility=(dx*frame.nx+dz*frame.nz)/Math.max(d,.01);
  if(visibility<.30)continue;
  faces.push({...frame,visibility,cameraDistance:d});
 }
 // The school has many short returns and a very long REAR wall.
 // Its photographed main doorway is on the long street-facing segment,
 // not the longest wall anywhere on the footprint.
 const entrance=faces.filter(f=>f.len>=15&&f.len<=25)
  .sort((a,b)=>a.cameraDistance-b.cameraDistance)[0];
 if(!entrance)return null;
 // Two *photographed frontage* returns carry terracotta end-bay accents.
 // These are approximate color areas: not a claim of measured paint bounds.
 const accents=faces.filter(f=>f.len>=7&&f.len<=10.2&&f.cameraDistance<70)
  .sort((a,b)=>a.cameraDistance-b.cameraDistance)
  .slice(0,2);
 const doorwayWidth=2.1;
 return {
  osmId:SCHOOL_PHOTO_WAY_ID,
  source:SCHOOL_PHOTO_URL,
  sourceDate:'2024-05-30',
  status:'photo-backed-partial',
  camera,
  entrance,
  accents,
  doorwayWidth,
  canopyDepth:.95,
  // School has three OSM floors; proportions are not field-measured.
  levels:3,
  facade: 'warm ochre with limited terracotta photographed frontage accents',
  unknownRear:true,
  approximateDimensions:true
 };
}

export function schoolFacadeFixture(frame,along,thickness){
 const center=facadePoint(frame,along,flushBoxOffset(thickness,-.012));
 return {...center,yaw:frame.yaw,width:thickness};
}

/**
 * Roof evidence for the MAIN modern school building (Školská 112/15).
 * Official school annual reports 2021/22 and 2024/25 show a broad,
 * shallow PITCHED light-grey roof. Street photos also show a slope.
 * Rise and slope are not surveyed and the positions of rooflights are
 * not reconstructed without exact photographic/geographic alignment.
 */
export const SCHOOL_ROOF_REFERENCE=
 'https://zsmilovice.cz/wp-content/uploads/2025/09/V%C3%BDro%C4%8Dn%C3%AD%20zpr%C3%A1va%202024-2025_sk.pdf';
export function planSchoolPhotographedRoof(points){
 if(!Array.isArray(points)||points.length<8||points.length>80)return null;
 const pts=points.map(p=>({x:p.x,z:p.z??p.y}));
 if(pts.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 // Sufficient width for a multi-storey school, reject accidental use on
 // detached residential houses with the same fallback material.
 const width=Math.max(...pts.map(p=>p.x))-Math.min(...pts.map(p=>p.x));
 const depth=Math.max(...pts.map(p=>p.z))-Math.min(...pts.map(p=>p.z));
 if(Math.min(width,depth)<12)return null;
 return {
  osmId:SCHOOL_PHOTO_WAY_ID,
  kind:'hip',
  rise:3.30, // street-photo silhouette approximation, not a surveyed height
  color:0x89979d,
  material:'light-grey-metal',
  reference:SCHOOL_ROOF_REFERENCE,
  photographicPitch:true,
  preciseRoofRidgeSurveyed:false,
  rooflightLocationsVerified:false,
  forceSafePerimeter:true
 };
}

// 5.50: Observational attributes from user-supplied Mapy.com 17 May 2022
// panorama screenshots. NO panorama pixels are copied into this game.
// Window and antenna presence is visible; exact positions are estimated.
// This site-specific data MUST NOT propagate to other OSM buildings.
export const SCHOOL_ROOF_DETAIL_PROFILE=Object.freeze({
 osmId:SCHOOL_PHOTO_WAY_ID,
 evidence:'Player supplied 2022-05-17 panorama views of school roof',
 positionsSurveyed:false,
 observedElements:['multiple rectangular rooflights','small antenna masts'],
 rooflights:[
  {edge:10,offsets:[0]},
  {edge:12,offsets:[-5,-1.7,1.7,5]},
  {edge:14,offsets:[-2.2,2.2]},
  {edge:15,offsets:[0]},
  {edge:17,offsets:[-5,-1.7,1.7,5]},
  {edge:19,offsets:[-1.65,1.65]}
 ],
 masts:[
  {edge:12,along:3.5,depth:6.2,height:2.1},
  {edge:17,along:-5.5,depth:6,height:2.3},
  {edge:19,along:.4,depth:5.2,height:1.8}
 ]
});
