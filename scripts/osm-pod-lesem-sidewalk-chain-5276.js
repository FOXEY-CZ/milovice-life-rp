/** 5.276: one simulated walker extends WEST on original sidewalk 1005977571.
 * East beyond the 11m approach is excluded: Zátopkova crossing unverified.
 * No map ways, paints, collision geometry or road navigation are introduced.
 */
import {planPodLesemWalker5275} from './osm-pod-lesem-crossing-walker-5275.js';
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),z:-(p.lat-50.226)*111320});
const len=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);
const vehicleWays=new Set(['motorway','trunk','primary','secondary','tertiary',
 'unclassified','residential','living_street','service','track']);
function intersect(a,b,c,d){
 const rx=b.x-a.x,rz=b.z-a.z,sx=d.x-c.x,sz=d.z-c.z;
 const det=rx*sz-rz*sx;
 if(Math.abs(det)<1e-9)return false;
 const dx=c.x-a.x,dz=c.z-a.z;
 const t=(dx*sz-dz*sx)/det,u=(dx*rz-dz*rx)/det;
 return t>=0&&t<=1&&u>=0&&u<=1;
}
export function planPodLesemSidewalkChain5276({regionId,ways,crossing}={}){
 const base=planPodLesemWalker5275({regionId,ways,crossing});
 if(!base)return null;
 const sidewalk=ways.find(w=>String(w?.id)===base.sourceFootwayId);
 const source=sidewalk.geometry.map(xy);
 const points=[base.a,base.center,...source.slice(4)];
 const cumulative=[0];
 for(let i=1;i<points.length;i++){
  const segment=len(points[i-1],points[i]);
  if(!Number.isFinite(segment)||segment<.5)return null;
  cumulative.push(cumulative.at(-1)+segment);
 }
 const total=cumulative.at(-1),western=total-base.crossingAt;
 if(points.length!==5||Math.abs(cumulative[1]-base.crossingAt)>.001||
  total<195||total>199||western<180)return null;
 // Future imported OSM roads must not silently create unsafe crossings.
 for(const road of ways){
  if(!vehicleWays.has(road?.tags?.highway)||
   String(road?.id)===base.sourceRoadId)continue;
  if(!Array.isArray(road.geometry)||road.geometry.length<2||
   !road.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)))return null;
  const line=road.geometry.map(xy);
  for(let i=1;i<points.length;i++)
   for(let j=1;j<line.length;j++)
    if(intersect(points[i-1],points[i],line[j-1],line[j]))return null;
 }
 return {...base,version:'5.276',extendedFrom:'5.275',
  a:{...points[0]},b:{...points.at(-1)},routePoints:points,
  cumulativeMetres:cumulative,totalMetres:total,westernExtensionMetres:western,
  originalWestOSMIndices:[4,5,6],mappedSidewalkVerticesUsed:4,
  checkedVehicleWayIntersections:true,otherVehicleRoadCrossings:0,
  newFootways:0,newRoads:0,newCrossings:0,newColliders:0,newPavementMeshes:0,
  modelOnly:true,paintSurveyed:false};
}
export function advancePodLesemSidewalkChain5276(route,at,direction,step,vehicles=[]){
 if(route?.version!=='5.276'||route.routePoints?.length!==5||
  route.cumulativeMetres?.length!==5||!Number.isFinite(at)||
  at<0||at>route.totalMetres||![1,-1].includes(direction)||
  !Number.isFinite(step)||step<0||step>3||!Array.isArray(vehicles))return null;
 let distance=at+direction*step,heading=direction,waiting=false;
 const crossing=route.crossingAt,half=route.crossingHalfWidth;
 const occupied=vehicles.some(v=>Number.isFinite(v?.x)&&Number.isFinite(v?.z)&&
  Math.hypot(v.x-route.center.x,v.z-route.center.z)<route.vehicleRadius);
 const entry=heading===1?crossing-half:crossing+half;
 if(occupied&&((heading===1&&at<=entry&&distance>=entry)||
  (heading===-1&&at>=entry&&distance<=entry))){
  distance=heading===1?Math.min(distance,entry-.1):Math.max(distance,entry+.1);
  waiting=true;
 }
 if(distance<0){distance=-distance;heading=1}
 if(distance>route.totalMetres){distance=2*route.totalMetres-distance;heading=-1}
 distance=Math.max(0,Math.min(route.totalMetres,distance));
 let segment=0;
 while(segment<route.cumulativeMetres.length-2&&
  distance>route.cumulativeMetres[segment+1])segment++;
 const a=route.routePoints[segment],b=route.routePoints[segment+1];
 const part=route.cumulativeMetres[segment+1]-route.cumulativeMetres[segment];
 if(part<=0)return null;
 const t=(distance-route.cumulativeMetres[segment])/part;
 return {distance,direction:heading,x:a.x+(b.x-a.x)*t,
  z:a.z+(b.z-a.z)*t,tangentX:(b.x-a.x)/part*heading,
  tangentZ:(b.z-a.z)/part*heading,waitingForVehicle:waiting,
  onZebra:Math.abs(distance-crossing)<half,
  walkedMetres:Math.abs(distance-at),sourceSegment:segment};
}
