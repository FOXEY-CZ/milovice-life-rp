// Milovice RP 5.81: read-only, SOURCE-aligned whole-forecourt review cameras.
// Actual camera GPS is documented, unlike estimated tree/lamp locations.
// No Mapy.com pixels, no invented street fixtures, no changes to world geometry.
import {STATION_FORECOURT_SOURCE,stationGpsToWorld,wayCentre}
 from './station-forecourt-pass.js';

export const STATION_FORECOURT_AUDIT_VIEWS=Object.freeze({
 wide:Object.freeze({
  label:'Nádraží + cyklověž · široký pohled',
  camera:Object.freeze({...STATION_FORECOURT_SOURCE.camera}),
  date:'2024-05-30',
  source:STATION_FORECOURT_SOURCE.photo,
  expectation:['station','tower']
 }),
 tower:Object.freeze({
  label:'Cyklověž · bližší foto',
  camera:Object.freeze({lat:50.2290656,lon:14.8822978,heading:5}),
  date:'2024-05-30',
  source:'https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg',
  expectation:['tower']
 }),
 bus:Object.freeze({
  label:'Autobusová stání · opačný směr',
  camera:Object.freeze({lat:50.2292294,lon:14.8822956,heading:175}),
  date:'2024-05-30',
  source:'https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_autobusov%C3%A9_zast%C3%A1vky_p%C5%99ed_n%C3%A1dra%C5%BE%C3%ADm.jpg',
  expectation:['mapped-road']
 })
});
export const STATION_FORECOURT_PENDING=Object.freeze([
 'broadleaf','twin-lamp','flowerbed','BUS-road-paint','opposite-shelter'
]);
const toBearing=(dx,dz)=>(Math.atan2(dx,-dz)*180/Math.PI+360)%360;
export function planStationForecourtAudit(elements,viewId='wide'){
 const v=STATION_FORECOURT_AUDIT_VIEWS[viewId];
 if(!v||!Array.isArray(elements))return null;
 const station=elements.find(e=>Number(e.id)===53865956);
 const tower=elements.find(e=>Number(e.id)===1011197691);
 if(station?.tags?.building!=='train_station'||
    tower?.tags?.name!=='Cyklověž Milovice')return null;
 const stationCenter=wayCentre(station),towerCenter=wayCentre(tower);
 if(!stationCenter||!towerCenter)return null;
 const cameraWorld=stationGpsToWorld(v.camera);
 const targets={station:stationCenter,tower:towerCenter};
 const landmarks=Object.entries(targets).map(([id,c])=>{
  const dx=c.x-cameraWorld.x,dz=c.z-cameraWorld.z;
  const bearing=toBearing(dx,dz);
  return {id,wayId:id==='station'?53865956:1011197691,
   x:c.x,z:c.z,distanceMeters:+Math.hypot(dx,dz).toFixed(2),
   bearingDegrees:+bearing.toFixed(2),
   relativeHeadingDegrees:+(((bearing-v.camera.heading+540)%360)-180).toFixed(2)
  };
 });
 if(landmarks.some(l=>!Number.isFinite(l.distanceMeters)||
    l.distanceMeters<2||l.distanceMeters>150))return null;
 return {
  id:viewId,label:v.label,headingDegrees:v.camera.heading,
  cameraGps:{...v.camera},cameraWorld,source:v.source,date:v.date,
  sourcePhotographer:'ŠJů',sourceLicense:'CC BY 4.0',
  landmarks,expectation:[...v.expectation],
  treeLampAndGardenStillUnlocated:true,
  deferred:[...STATION_FORECOURT_PENDING],
  surveyedPositions:false,copiedSourcePixels:false
 };
}
