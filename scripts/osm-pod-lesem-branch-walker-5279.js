/** Milovice RP 5.279 — a SECOND model resident on a real OSM side path.
 * Source path 1272081412 joins 1005977571 at original vertex 8/4.
 * Walk ONLY vertices 8..1 (about 108.6 m), turning at node 1 before the
 * actual mapped Pod Lesem road shared with node 0. No invented crosswalk,
 * new footway, road graph, physical collision or relocated OSM point.
 */
export const POD_LESEM_BRANCH_5279=Object.freeze({
 region:'mlada',pathId:'1272081412',pathHash:'69d970c5',nodes:9,
 mainFootwayId:'1005977571',sourceJoin:'50.2288905,14.8710178',
 joinPathIndex:8,joinMainIndex:4,lastSafePathIndex:1,
 roadId:'83076185',roadHash:'63325626',
 sharedRoad:'50.2279496,14.8717554',
 tags:Object.freeze({highway:'path',lit:'no'}),
 roadTags:Object.freeze({highway:'residential',maxspeed:'30',name:'Pod Lesem'})
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{let h=2166136261;
 for(const c of g.map(key).join(';')){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}
 return(h>>>0).toString(16).padStart(8,'0');};
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const length=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const vehicular=new Set(['motorway','trunk','primary','secondary','tertiary',
 'unclassified','residential','living_street','service','track']);
const tagsExact=(tags,expected)=>tags&&
 Object.keys(tags).length===Object.keys(expected).length&&
 Object.entries(expected).every(([k,v])=>tags[k]===v);
const intersect=(a,b,c,d)=>{
 const rx=b.x-a.x,rz=b.z-a.z,sx=d.x-c.x,sz=d.z-c.z,det=rx*sz-rz*sx;
 if(Math.abs(det)<1e-9)return false;
 const dx=c.x-a.x,dz=c.z-a.z;
 const t=(dx*sz-dz*sx)/det,u=(dx*rz-dz*rx)/det;
 return t>=0&&t<=1&&u>=0&&u<=1;
};
function distanceToSegment(p,a,b){
 const dx=b.x-a.x,dz=b.z-a.z,d2=dx*dx+dz*dz;
 if(d2<1e-8)return length(p,a);
 const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/d2));
 return Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t);
}
function segmentsDistance(a,b,c,d){
 if(intersect(a,b,c,d))return 0;
 return Math.min(distanceToSegment(a,c,d),distanceToSegment(b,c,d),
  distanceToSegment(c,a,b),distanceToSegment(d,a,b));
}
export function planPodLesemBranch5279({regionId,ways,parentRoute}={}){
 const S=POD_LESEM_BRANCH_5279;
 if(regionId!==S.region||!Array.isArray(ways)||
  parentRoute?.version!=='5.278'||
  parentRoute.sourceFootwayId!==S.mainFootwayId||
  parentRoute.routePoints?.length!==9)return null;
 const one=id=>{const found=ways.filter(w=>String(w?.id)===id);
  return found.length===1?found[0]:null;};
 const foot=one(S.pathId),road=one(S.roadId),main=one(S.mainFootwayId);
 if(!foot||!road||!main||foot.type!=='way'||road.type!=='way'||
  foot.geometry?.length!==S.nodes||road.geometry?.length!==4||
  main.geometry?.length!==7||
  !foot.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
  !road.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
  hash(foot.geometry)!==S.pathHash||hash(road.geometry)!==S.roadHash||
  !tagsExact(foot.tags,S.tags)||!tagsExact(road.tags,S.roadTags)||
  key(foot.geometry[S.joinPathIndex])!==S.sourceJoin||
  key(main.geometry[S.joinMainIndex])!==S.sourceJoin||
  key(foot.geometry[0])!==S.sharedRoad||
  key(road.geometry[2])!==S.sharedRoad)return null;
 const points=foot.geometry.slice(S.lastSafePathIndex).reverse().map(xy);
 if(points.length!==8||length(points[0],parentRoute.routePoints[2])>.001)return null;
 const cumulative=[0];
 for(let i=1;i<points.length;i++){
  const d=length(points[i-1],points[i]);
  if(d<.5||d>100||!Number.isFinite(d))return null;
  cumulative.push(cumulative.at(-1)+d);
 }
 const total=cumulative.at(-1);
 if(total<108||total>110)return null;
 let closest=Infinity;
 for(const w of ways){
  if(!vehicular.has(w?.tags?.highway))continue;
  if(!Array.isArray(w.geometry)||w.geometry.length<2||
   !w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)))
   return null;
  const roadLine=w.geometry.map(xy);
  for(let i=1;i<points.length;i++)for(let j=1;j<roadLine.length;j++){
   const d=segmentsDistance(points[i-1],points[i],roadLine[j-1],roadLine[j]);
   closest=Math.min(closest,d);
   // No NPC street crossing or even close edge-on-road risk in this branch.
   if(d<6.5)return null;
  }
 }
 const fromRoad=distanceToSegment(points.at(-1),xy(road.geometry[1]),xy(road.geometry[2]));
 if(fromRoad<14||fromRoad>16||closest<8.5||closest>15)return null;
 return {version:'5.279',regionId,sourcePathId:S.pathId,
  originalPathHash:S.pathHash,sourceMainFootwayId:S.mainFootwayId,
  mappedJoinGPS:{...foot.geometry[S.joinPathIndex]},
  mappedTurnaroundGPS:{...foot.geometry[S.lastSafePathIndex]},
  originallyConnectedAtPathIndex:S.joinPathIndex,
  originalNodeIndices:[8,7,6,5,4,3,2,1],
  firstRoadSharedNodeExcluded:true,sourceRoadId:S.roadId,
  metresToOriginalRoadCentre:+fromRoad.toFixed(3),
  nearestMappedVehicleRoadMetres:+closest.toFixed(3),
  sourceLitTag:'no',surfaceNotMapped:true,
  routePoints:points,cumulativeMetres:cumulative,totalMetres:total,
  onlyOriginalFootwaySegments:true,modelResidentNotRealPerson:true,
  originalGPSUnchanged:true,newFootways:0,newRoads:0,
  newCrossings:0,newColliders:0,newPavementMeshes:0};
}
export function advancePodLesemBranch5279(route,at,direction,step){
 if(route?.version!=='5.279'||route.routePoints?.length!==8||
  route.cumulativeMetres?.length!==8||!Number.isFinite(at)||
  at<0||at>route.totalMetres||![1,-1].includes(direction)||
  !Number.isFinite(step)||step<0||step>3)return null;
 let d=at+direction*step,heading=direction;
 if(d<0){d=-d;heading=1;}
 if(d>route.totalMetres){d=2*route.totalMetres-d;heading=-1;}
 d=Math.max(0,Math.min(route.totalMetres,d));
 let seg=0;
 while(seg<route.cumulativeMetres.length-2&&
  d>route.cumulativeMetres[seg+1])seg++;
 const start=route.routePoints[seg],end=route.routePoints[seg+1];
 const part=route.cumulativeMetres[seg+1]-route.cumulativeMetres[seg];
 if(part<=0)return null;
 const t=(d-route.cumulativeMetres[seg])/part;
 return {distance:d,direction:heading,segment:seg,
  x:start.x+(end.x-start.x)*t,z:start.z+(end.z-start.z)*t,
  tangentX:(end.x-start.x)/part*heading,
  tangentZ:(end.z-start.z)/part*heading,
  onMappedFootway:true,roadCrossings:0,
  turnsBeforeRoad:heading===-1&&direction===1};
}
