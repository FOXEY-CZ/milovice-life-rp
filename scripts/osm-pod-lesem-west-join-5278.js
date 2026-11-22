/** 5.278: continue 5.277 on the ADJOINING ORIGINAL OSM sidewalk
 * 1044078118 for four real segments (70.806m). Stop at source node 4,
 * before the mapped service road 1456361936 crossing node 5.
 * No new footways, traffic graph, road crossings, pavement or colliders.
 */
import {planPodLesemSidewalkChain5277} from './osm-pod-lesem-sidewalk-chain-5277.js';
export const POD_LESEM_WEST_JOIN_5278=Object.freeze({
 region:'mlada',id:'1044078118',hash:'26506719',nodes:11,
 join:'50.2290044,14.8702188',lastSafeIndex:4,
 serviceId:'1456361936',serviceJoin:'50.2289777,14.8691127',
 tags:Object.freeze({footway:'sidewalk',highway:'footway',lit:'yes'})
});
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const len=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
function hash(g){
 let h=2166136261;
 for(const c of g.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
}
const motor=new Set(['motorway','trunk','primary','secondary','tertiary',
 'unclassified','residential','living_street','service','track']);
function crossing(a,b,c,d){
 const rx=b.x-a.x,rz=b.z-a.z,sx=d.x-c.x,sz=d.z-c.z;
 const det=rx*sz-rz*sx;
 if(Math.abs(det)<1e-9)return false;
 const dx=c.x-a.x,dz=c.z-a.z;
 const t=(dx*sz-dz*sx)/det,u=(dx*rz-dz*rx)/det;
 return t>=0&&t<=1&&u>=0&&u<=1;
}
export function planPodLesemWestJoin5278({regionId,ways,crossing:cross}={}){
 const base=planPodLesemSidewalkChain5277({regionId,ways,crossing:cross});
 const S=POD_LESEM_WEST_JOIN_5278;
 if(!base||regionId!==S.region||!Array.isArray(ways))return null;
 const one=id=>{const matches=ways.filter(w=>String(w?.id)===id);
  return matches.length===1?matches[0]:null};
 const foot=one(S.id),service=one(S.serviceId);
 if(!foot||!service||foot.type!=='way'||service.type!=='way'||
  foot.geometry?.length!==S.nodes||
  !foot.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
  hash(foot.geometry)!==S.hash||
  !foot.tags||Object.keys(foot.tags).length!==Object.keys(S.tags).length||
  !Object.entries(S.tags).every(([k,v])=>foot.tags[k]===v)||
  service.tags?.highway!=='service'||service.geometry?.length!==3||
  !service.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
  key(foot.geometry[0])!==S.join||
  key(foot.geometry[5])!==S.serviceJoin||
  key(service.geometry[1])!==S.serviceJoin)return null;
 const prev=base.routePoints.at(-1),first=xy(foot.geometry[0]);
 if(len(prev,first)>.001)return null;
 const points=[...base.routePoints,...foot.geometry.slice(1,S.lastSafeIndex+1).map(xy)];
 const cum=[0];
 for(let i=1;i<points.length;i++){
  const d=len(points[i-1],points[i]);
  if(d<.5||!Number.isFinite(d))return null;
  cum.push(cum.at(-1)+d);
 }
 const extension=cum.at(-1)-base.totalMetres;
 const serviceGap=len(xy(foot.geometry[4]),xy(foot.geometry[5]));
 if(points.length!==9||extension<70||extension>72||
  cum.at(-1)<266||cum.at(-1)>269||
  serviceGap<9||serviceGap>11)return null;
 // The parent already checked every older segment. Protect the four new
 // OSM legs from newly imported motor-vehicle ways.
 for(const road of ways){
  if(!motor.has(road?.tags?.highway)||
   String(road?.id)===base.sourceRoadId)continue;
  if(!Array.isArray(road.geometry)||road.geometry.length<2||
   !road.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)))
   return null;
  const line=road.geometry.map(xy);
  for(let i=5;i<points.length;i++)
   for(let j=1;j<line.length;j++)
    if(crossing(points[i-1],points[i],line[j-1],line[j]))return null;
 }
 return {...base,version:'5.278',extendsVersion:'5.277',
  joinedFootwayId:S.id,joinedFootwayHash:S.hash,
  joinedOriginalGPSVertices:5,joinedFootwayLastOSMIndex:S.lastSafeIndex,
  sourceStopGPS:{...foot.geometry[S.lastSafeIndex]},
  beforeServiceRoadId:S.serviceId,
  serviceRoadIntersectionUncrossed:true,
  metresBeforeServiceRoad:+serviceGap.toFixed(3),
  extendedByMetres:+extension.toFixed(3),
  a:{...points[0]},b:{...points.at(-1)},routePoints:points,
  cumulativeMetres:cum,totalMetres:cum.at(-1),
  westernExtensionMetres:cum.at(-1)-base.crossingAt,
  mappedSidewalkVerticesUsed:base.mappedSidewalkVerticesUsed+4,
  originalWestJoinedOSMIndices:[1,2,3,4],
  otherVehicleRoadCrossings:0,originalGraphUnchanged:true,
  modelOnly:true,paintSurveyed:false};
}
