// Milovice RP 5.79 — photographed door / ticket machine pair / window.
// ŠJů, Wikimedia Commons, May 30 2024, CC BY 4.0.
// Photo: https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_automaty_na_j%C3%ADzdenky.jpg
// The source has fixed ORDER, but not surveyed horizontal positions.
import {STATION_TICKET_MACHINE_PHOTO,STATION_TICKET_MACHINE_LAYOUT}
 from './station-ticket-machines.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';

export const STATION_PHOTO_FACADE=Object.freeze({
 stationWayId:53865956,wallSegmentIndex:5,photoDate:'2024-05-30',
 source:STATION_TICKET_MACHINE_PHOTO.source,positionsSurveyed:false,
 // Observed, camera left-to-right: door, orange, yellow, rectangular window.
 observedOrder:['door','orange','yellow','window'],
 // Estimates constrained by the real 6.5 m OSM wall and existing machine anchors:
 fixtures:Object.freeze([
  Object.freeze({kind:'door',t:.66,width:1.05,height:2.22,bottom:0}),
  Object.freeze({kind:'window',t:.14,width:1.37,height:1.82,bottom:.75,
   sillWidth:1.55})
 ])
});

export function planStationPhotographedFacade(pts){
 if(!Array.isArray(pts)||pts.length<12)return null;
 const idx=STATION_PHOTO_FACADE.wallSegmentIndex-1;
 const a=pts[idx],b=pts[idx+1];
 if(!a||!b||!Number.isFinite(a.x)||!Number.isFinite(a.y)||
    !Number.isFinite(b.x)||!Number.isFinite(b.y))return null;
 const dx=b.x-a.x,dz=b.y-a.y,length=Math.hypot(dx,dz);
 if(length<6.2||length>7)return null;
 const camera=stationGpsToWorld(STATION_TICKET_MACHINE_PHOTO.camera);
 const tCam=Math.max(0,Math.min(1,
  ((camera.x-a.x)*dx+(camera.z-a.y)*dz)/(length*length)));
 const closest={x:a.x+dx*tCam,z:a.y+dz*tCam};
 const cx=camera.x-closest.x,cz=camera.z-closest.z;
 const distance=Math.hypot(cx,cz);
 if(distance<1.5||distance>2.6)return null;
 const nx=cx/distance,nz=cz/distance;
 const heading=STATION_TICKET_MACHINE_PHOTO.camera.heading*Math.PI/180;
 const towardWall={x:-cx/distance,z:-cz/distance};
 const photoLook={x:Math.sin(heading),z:-Math.cos(heading)};
 if(towardWall.x*photoLook.x+towardWall.z*photoLook.z<.84)return null;
 const fixtures=STATION_PHOTO_FACADE.fixtures.map(f=>({
  ...f,x:a.x+dx*f.t,z:a.y+dz*f.t
 }));
 const intervals=[
  ...fixtures.map(f=>({kind:f.kind,start:f.t*length-
   Math.max(f.width,f.sillWidth||0)*.5,
   end:f.t*length+Math.max(f.width,f.sillWidth||0)*.5})),
  ...STATION_TICKET_MACHINE_LAYOUT.map(m=>({
   kind:m.kind,start:m.t*length-m.bodyWidth*.5,
   end:m.t*length+m.bodyWidth*.5
  }))
 ].sort((p,q)=>p.start-q.start);
 let minGap=Infinity;
 for(let i=0;i<intervals.length;i++){
  if(intervals[i].start<.03||intervals[i].end>length-.03)return null;
  if(i)minGap=Math.min(minGap,intervals[i].start-intervals[i-1].end);
 }
 if(minGap<.12)return null;
 const leftToRight=[...intervals].reverse().map(f=>f.kind);
 if(JSON.stringify(leftToRight)!==JSON.stringify(STATION_PHOTO_FACADE.observedOrder))
  return null;
 return {wallStartIndex:idx,wallSegmentIndex:idx+1,
  stationWayId:STATION_PHOTO_FACADE.stationWayId,
  source:STATION_PHOTO_FACADE.source,photoDate:STATION_PHOTO_FACADE.photoDate,
  fixtures,photoLook,wall:{a,b,dx,dz,length,yaw:Math.atan2(-dz,dx),nx,nz},
  minFixtureMachineGap:minGap,observedOrder:leftToRight,
  photosCopied:false,positionsSurveyed:false,facesPhotographer:true};
}
