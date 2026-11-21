/** Milovice RP 5.234: Two fictitious NPCs on existing OSM Italská
 * sidewalks only. Every 0.7 m of each TRIMMED trajectory is checked
 * against mapped road axes and building polygons. Both turn around
 * before any crossing. Never imply that real pedestrians were photographed.
 */
export const ITALSKA_WALKERS_5234=Object.freeze({
 region:'mlada',routes:Object.freeze([
  Object.freeze({id:'1484073945',hash:'bf9fe98e',nodes:2,edge:0,
   length:135.468,trim:6,roadMin:6.2,buildingMin:4.2,
   tags:Object.freeze({footway:'sidewalk',highway:'footway'})}),
  Object.freeze({id:'1484073947',hash:'ef34d41f',nodes:4,edge:0,
   length:87.055,trim:4,roadMin:6.5,buildingMin:5.2,
   tags:Object.freeze({footway:'sidewalk',highway:'footway',
    surface:'paving_stones'})})
 ])
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const distance=(p,a,b)=>{
 const dx=b.x-a.x,dz=b.z-a.z,l=dx*dx+dz*dz,
  t=l>1e-8?Math.max(0,Math.min(1,
   ((p.x-a.x)*dx+(p.z-a.z)*dz)/l)):0;
 return Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);
};
const inside=(p,poly)=>{
 let result=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.z>p.z)!==(b.z>p.z)&&
   p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)result=!result;
 }
 return result;
};
const roadTypes=new Set(['residential','service','primary','secondary',
 'tertiary','unclassified','living_street','track','pedestrian']);
export function planItalskaWalkers5234({regionId,ways,buildings,priorPlan}={}){
 const c=ITALSKA_WALKERS_5234;
 if(regionId!==c.region||!Array.isArray(ways)||!Array.isArray(buildings)||
  priorPlan?.version!=='5.233'||priorPlan.originalGPSUnchanged!==true||
  priorPlan.unmarkedCrossingIds?.join(',')!=='1484073944,1484073946'||
  !c.routes.every(r=>priorPlan.sourceWayIds?.includes(r.id)))return null;
 const roads=ways.filter(w=>roadTypes.has(w?.tags?.highway)&&
  Array.isArray(w.geometry)&&w.geometry.length>=2)
  .map(w=>w.geometry.map(xy));
 const houses=buildings.filter(w=>w?.tags?.building&&
  Array.isArray(w.geometry)&&w.geometry.length>=4)
  .map(w=>w.geometry.map(xy));
 if(!roads.length||!houses.length)return null;
 const routes=[];
 for(const spec of c.routes){
  const match=ways.filter(w=>String(w?.id)===spec.id);
  if(match.length!==1)return null;
  const g=match[0].geometry,t=match[0].tags;
  if(!Array.isArray(g)||g.length!==spec.nodes||
   g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   hash(g)!==spec.hash||!t||
   Object.keys(t).length!==Object.keys(spec.tags).length||
   Object.entries(spec.tags).some(([k,v])=>t[k]!==v))return null;
  const a=xy(g[spec.edge]),b=xy(g[spec.edge+1]),
   len=Math.hypot(b.x-a.x,b.z-a.z);
  if(Math.abs(len-spec.length)>.12||len<spec.trim*2+15)return null;
  let minRoad=Infinity,minBuilding=Infinity;
  const count=Math.ceil((len-2*spec.trim)/.7);
  for(let i=0;i<=count;i++){
   const u=(spec.trim+(len-2*spec.trim)*i/count)/len,
    p={x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u};
   for(const r of roads)for(let j=1;j<r.length;j++)
    minRoad=Math.min(minRoad,distance(p,r[j-1],r[j]));
   for(const house of houses){
    if(inside(p,house))return null;
    for(let j=1;j<house.length;j++)
     minBuilding=Math.min(minBuilding,
      distance(p,house[j-1],house[j]));
   }
   if(minRoad<spec.roadMin||minBuilding<spec.buildingMin)return null;
  }
  routes.push({
   sourceWayId:spec.id,sourceHash:spec.hash,sourceNodes:spec.nodes,
   originalSegmentIndex:spec.edge,
   sourceGPS:[{...g[spec.edge]},{...g[spec.edge+1]}],
   originalSegmentMetres:+len.toFixed(3),
   trimEachEndMetres:spec.trim,walkableMetres:+(len-2*spec.trim).toFixed(3),
   minRoadAxisMetres:+minRoad.toFixed(3),
   minBuildingMetres:+minBuilding.toFixed(3),
   requiredRoadMin:spec.roadMin,requiredBuildingMin:spec.buildingMin,
   safetySamples:count+1,sourceSurface:t.surface??null,
   routeOnOriginalOSM:true,photoOfPersonAvailable:false
  });
 }
 return {
  version:'5.234',sourceRouteIds:routes.map(r=>r.sourceWayId),
  routes,walkerCount:2,
  totalWalkableMetres:+routes.reduce((a,r)=>a+r.walkableMetres,0).toFixed(3),
  simulatedPedestriansOnly:true,noUnmarkedCrossingsEntered:true,
  existingRoadsAndBuildingsPreserved:true,originalGPSUnchanged:true,
  noNewRoads:true,newFootways:0,newCrossings:0,newZebras:0,
  newColliders:0,newBuildings:0,newParking:0,newStreetFurniture:0
 };
}
export function makeItalskaWalkerSegment5234(route,toWorld){
 if(!route||typeof toWorld!=='function'||
  route.sourceGPS?.length!==2)return null;
 const [a,b]=route.sourceGPS.map(toWorld);
 if(![a?.x,a?.y,b?.x,b?.y].every(Number.isFinite))return null;
 const dx=b.x-a.x,dz=b.y-a.y,len=Math.hypot(dx,dz);
 if(Math.abs(len-route.originalSegmentMetres)>.18||
  len<=route.trimEachEndMetres*2+15)return null;
 const t=route.trimEachEndMetres,ux=dx/len,uz=dz/len;
 return {
  a:{x:a.x+ux*t,y:a.y+uz*t},b:{x:b.x-ux*t,y:b.y-uz*t},
  len:len-2*t,width:1.8,sourceWayId:route.sourceWayId,
  sourceGPSUnchanged:true,roadAndBuildingSafe:true,noCrossing:true
 };
}
