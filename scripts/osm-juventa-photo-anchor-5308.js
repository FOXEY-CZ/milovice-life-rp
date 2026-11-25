import {planJuventaSchoolShell5306} from './osm-juventa-school-shell-5306.js';
// Public 2024 photograph of the main entrance by Doronenko, CC BY 4.0.
// EXIF heading and camera are source values; ray intersection is only
// a candidate facade anchor, not a surveyed doorway or its dimensions.
export const JUVENTA_PHOTO_5308=Object.freeze({
 camera:Object.freeze({lat:50.22681,lon:14.866101}),heading:98.62,
 source:'https://commons.wikimedia.org/wiki/File:Komensk%C3%A9ho_(Milovice)_05.jpg',
 date:'2024-08-15',author:'Doronenko · CC BY 4.0'
});
export function planJuventaPhotoAnchor5308(input){
 if(!planJuventaSchoolShell5306(input))return null;
 const {camera,heading}=JUVENTA_PHOTO_5308;
 const scale=111320*Math.cos(50.226*Math.PI/180);
 const points=input.geometry.map(p=>({x:(p.lon-camera.lon)*scale,z:(camera.lat-p.lat)*111320}));
 const dx=Math.sin(heading*Math.PI/180),dz=-Math.cos(heading*Math.PI/180);
 const hits=[];
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],ex=b.x-a.x,ez=b.z-a.z;
  const den=dx*ez-dz*ex;
  if(Math.abs(den)<1e-9)continue;
  const t=(a.x*ez-a.z*ex)/den,u=(a.x*dz-a.z*dx)/den;
  if(t>0&&u>=0&&u<=1)hits.push({edge:i,distance:t,fraction:u,length:Math.hypot(ex,ez)});
 }
 hits.sort((a,b)=>a.distance-b.distance);
 const first=hits[0];
 if(!first||first.edge!==47||first.distance<20||first.distance>24)return null;
 return {...first,sourceOSMId:'53865836',sourceHash:'be655146',
  target:{lat:camera.lat-dz*first.distance/111320,lon:camera.lon+dx*first.distance/scale},
  camera,heading,source:JUVENTA_PHOTO_5308.source,
  exactEntranceSurveyed:false,newGeometry:0};
}
