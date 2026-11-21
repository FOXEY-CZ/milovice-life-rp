/** 5.215: the existing second Višňová pedestrian follows three consecutive
 * ORIGINAL OSM sidewalk edges, including their real mapped bends.
 * This is simulated traffic, NOT photographic evidence of a pedestrian.
 * Do not extend beyond node 3: subsequent source edges approach roads/houses.
 */
export const VISNOVA_CONTINUOUS_5215=Object.freeze({
 region:'mlada',wayId:'1044078118',hash:'26506719',nodes:11,
 firstNode:0,lastNode:3,trimMetres:3.3,
 minRoadAxisMetres:6.5,minBuildingMetres:4.0
});
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const sourceHash=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const distance=(p,a,b)=>{
 const dx=b.x-a.x,dz=b.z-a.z,len2=dx*dx+dz*dz;
 const t=len2>1e-8?Math.max(0,Math.min(1,
  ((p.x-a.x)*dx+(p.z-a.z)*dz)/len2)):0;
 return Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t);
};
const inside=(p,poly)=>{
 let yes=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.z>p.z)!==(b.z>p.z)&&
   p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)yes=!yes;
 }
 return yes;
};
const roadKinds=new Set(['residential','service','primary','secondary',
 'tertiary','unclassified','living_street','track']);
export function planVisnovaContinuousWalker5215({
 regionId,ways,buildings,priorPlan
}={}){
 const c=VISNOVA_CONTINUOUS_5215;
 if(regionId!==c.region||!Array.isArray(ways)||
  !Array.isArray(buildings)||priorPlan?.version!=='5.214'||
  priorPlan.sourceOSMWayId!==c.wayId||
  priorPlan.sourceHash!==c.hash||
  priorPlan.neverCrossesRoad!==true)return null;
 const matches=ways.filter(w=>String(w?.id)===c.wayId);
 if(matches.length!==1)return null;
 const source=matches[0],t=source.tags||{},g=source.geometry;
 if(t.highway!=='footway'||t.footway!=='sidewalk'||
  t.lit!=='yes'||t.surface!==undefined||
  Object.keys(t).some(k=>!['highway','footway','lit'].includes(k))||
  !Array.isArray(g)||g.length!==c.nodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  sourceHash(g)!==c.hash)return null;
 const coords=g.slice(c.firstNode,c.lastNode+1).map(xy);
 const lengths=coords.slice(1).map((b,i)=>
  Math.hypot(b.x-coords[i].x,b.z-coords[i].z));
 const original=lengths.reduce((a,b)=>a+b,0);
 if(lengths.length!==3||lengths.some(v=>v<5)||
  original<52.7||original>53.4||
  lengths[0]<=c.trimMetres+2||lengths[2]<=c.trimMetres+2)
  return null;
 const roads=ways.filter(w=>roadKinds.has(w?.tags?.highway)&&
  Array.isArray(w.geometry)&&w.geometry.length>=2&&
  w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)))
  .map(w=>w.geometry.map(xy));
 const houses=buildings.filter(w=>w?.tags?.building&&
  Array.isArray(w.geometry)&&w.geometry.length>=4&&
  w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)))
  .map(w=>w.geometry.map(xy));
 if(!roads.length||!houses.length)return null;
 let minRoad=Infinity,minHouse=Infinity;
 // <=0.75 m sampling across the FULL clipped polyline, including bends.
 // Fail closed on any new mapped carriageway, footprint or source change.
 for(let edge=0;edge<3;edge++){
  const len=lengths[edge],a=coords[edge],b=coords[edge+1];
  const begin=edge===0?c.trimMetres:0;
  const end=len-(edge===2?c.trimMetres:0);
  const count=Math.ceil((end-begin)/.75);
  for(let i=0;i<=count;i++){
   const u=(begin+(end-begin)*i/count)/len;
   const p={x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u};
   for(const line of roads)for(let k=1;k<line.length;k++)
    minRoad=Math.min(minRoad,distance(p,line[k-1],line[k]));
   for(const house of houses){
    if(inside(p,house))return null;
    for(let k=1;k<house.length;k++)
     minHouse=Math.min(minHouse,distance(p,house[k-1],house[k]));
   }
   if(minRoad<c.minRoadAxisMetres||minHouse<c.minBuildingMetres)
    return null;
  }
 }
 return {
  version:'5.215',sourceWayId:c.wayId,sourceHash:c.hash,
  sourceGPS:g.slice(c.firstNode,c.lastNode+1).map(p=>({...p})),
  sourceNodeIndices:[0,1,2,3],sourceNodes:c.nodes,
  originalSegmentMetres:lengths.map(v=>+v.toFixed(3)),
  originalMetres:+original.toFixed(3),
  trimMetres:c.trimMetres,walkableMetres:+(original-2*c.trimMetres).toFixed(3),
  minRoadAxisDistanceMetres:+minRoad.toFixed(3),
  minBuildingDistanceMetres:+minHouse.toFixed(3),
  existingWalkerReused:true,modelWalkerCount:1,
  originalOSMUnchanged:true,actualNPCPhotographed:false,
  sourceSurfaceUnknown:true,newPaths:0,newCrossings:0,
  newRoads:0,newBuildings:0,newColliders:0,newNPCs:0
 };
}
const lerp=(a,b,u)=>({x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u});
export function makeVisnovaContinuousRoute5215(plan,toWorld){
 if(plan?.version!=='5.215'||typeof toWorld!=='function'||
  !Array.isArray(plan.sourceGPS)||plan.sourceGPS.length!==4)return null;
 const points=plan.sourceGPS.map(toWorld);
 if(points.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))
  return null;
 const lengths=points.slice(1).map((p,i)=>
  Math.hypot(p.x-points[i].x,p.y-points[i].y));
 if(lengths.some((v,i)=>Math.abs(v-plan.originalSegmentMetres[i])>.17)||
  lengths[0]<=plan.trimMetres+2||lengths[2]<=plan.trimMetres+2)
  return null;
 const n=points;
 const coords=[
  lerp(n[0],n[1],plan.trimMetres/lengths[0]),n[1],n[2],
  lerp(n[2],n[3],1-plan.trimMetres/lengths[2])
 ];
 let travelled=0;
 const pieces=coords.slice(1).map((b,i)=>{
  const a=coords[i],len=Math.hypot(b.x-a.x,b.y-a.y);
  const part={a,b,len,start:travelled,end:travelled+len,
   sourceSegmentIndex:i};
  travelled+=len;return part;
 });
 if(pieces.some(x=>x.len<=0)||Math.abs(travelled-plan.walkableMetres)>.17)
  return null;
 return {version:'5.215',sourceWayId:plan.sourceWayId,points:coords,
  pieces,len:travelled,sourceNode1Distance:pieces[0].len,
  originalOSMUnchanged:true,roadClearanceVerified:true};
}
export function sampleVisnovaContinuousRoute5215(route,distanceMetres,direction=1){
 if(route?.version!=='5.215'||!Number.isFinite(distanceMetres)||
  distanceMetres<-.001||distanceMetres>route.len+.001)return null;
 const d=Math.max(0,Math.min(route.len,distanceMetres));
 const part=route.pieces.find(p=>d<=p.end+1e-8)||
  route.pieces[route.pieces.length-1];
 const u=Math.max(0,Math.min(1,(d-part.start)/part.len));
 const tx=(part.b.x-part.a.x)/part.len,
  tz=(part.b.y-part.a.y)/part.len;
 return {x:part.a.x+(part.b.x-part.a.x)*u,
  z:part.a.y+(part.b.y-part.a.y)*u,
  tangentX:tx*(direction>=0?1:-1),
  tangentZ:tz*(direction>=0?1:-1),
  sourceSegmentIndex:part.sourceSegmentIndex,
  distance:d};
}
export function advanceVisnovaContinuousRoute5215(route,distanceMetres,
 direction,stepMetres){
 if(route?.version!=='5.215'||!Number.isFinite(stepMetres)||
  stepMetres<0||!Number.isFinite(distanceMetres)||
  distanceMetres<0||distanceMetres>route.len||
  ![1,-1].includes(direction))return null;
 const period=route.len*2;
 const unfolded=(direction===1?distanceMetres:period-distanceMetres)+stepMetres;
 const phase=((unfolded%period)+period)%period;
 const nextDirection=phase<=route.len?1:-1;
 const nextDistance=phase<=route.len?phase:period-phase;
 return {...sampleVisnovaContinuousRoute5215(route,nextDistance,
  nextDirection),direction:nextDirection};
}
