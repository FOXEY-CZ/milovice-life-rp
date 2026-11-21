/** Milovice RP 5.214 — a SECOND simulated pedestrian uses an existing,
 * separate and map-locked Višňová sidewalk. No photograph claims a person.
 *
 * The ORIGINAL OSM footway 1044078118 has no explicit material tag:
 * do not invent 'paving_stones'. Use only original GPS nodes 1 -> 2;
 * shrink the animation segment at both ends, never extend it to a road.
 * Road and building clearances are checked against source polygons.
 */
export const VISNOVA_EAST_WALKER_5214=Object.freeze({
 region:'mlada',footwayId:'1044078118',
 footwayHash:'26506719',sourceNodes:11,
 sectionIndex:1,trimEachEndMetres:3.3,simulatedWalkers:1,
 requiredRoadAxisClearanceMetres:6.5,requiredBuildingClearanceMetres:4
});
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const cos=Math.cos(50.226*Math.PI/180);
const xy=p=>({x:(p.lon-14.889)*111320*cos,z:-(p.lat-50.226)*111320});
const pointToSegment=(p,a,b)=>{
 const dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz;
 const t=l2>.0000001?
  Math.min(1,Math.max(0,((p.x-a.x)*dx+(p.z-a.z)*dz)/l2)):0;
 return Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t);
};
const inside=(p,poly)=>{
 let included=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.z>p.z)!==(b.z>p.z)&&
   p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)included=!included;
 }
 return included;
};
export function planVisnovaEastWalker5214({regionId,ways,buildings}={}){
 const c=VISNOVA_EAST_WALKER_5214;
 if(regionId!==c.region||!Array.isArray(ways)||
  !Array.isArray(buildings))return null;
 const match=ways.filter(w=>String(w?.id)===c.footwayId);
 if(match.length!==1)return null;
 const w=match[0],tags=w.tags||{},g=w.geometry;
 // The OSM way is untagged for surface. Never silently paint pavers.
 if(tags.highway!=='footway'||tags.footway!=='sidewalk'||
  tags.lit!=='yes'||tags.surface!==undefined||
  Object.keys(tags).some(k=>!['highway','footway','lit'].includes(k))||
  !Array.isArray(g)||g.length!==c.sourceNodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(g)!==c.footwayHash)return null;
 const start=xy(g[c.sectionIndex]),end=xy(g[c.sectionIndex+1]);
 const length=Math.hypot(start.x-end.x,start.z-end.z);
 if(length<30||length>31||length<=2*c.trimEachEndMetres+5)return null;
 const driveKinds=new Set(['residential','service','primary',
  'secondary','tertiary','unclassified','living_street','track']);
 const roads=ways.filter(v=>driveKinds.has(v?.tags?.highway)&&
  Array.isArray(v.geometry)&&v.geometry.length>=2&&
  v.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)))
  .map(v=>v.geometry.map(xy));
 const houses=buildings.filter(v=>v?.tags?.building&&
  Array.isArray(v.geometry)&&v.geometry.length>=4&&
  v.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)))
  .map(v=>v.geometry.map(xy));
 if(!roads.length||!houses.length)return null;
 let nearestRoad=Infinity,nearestHouse=Infinity;
 // Twenty-five evenly spaced samples of the ACTOR route, not an imagined
 // corridor. Original tags and GPS never change.
 for(let i=0;i<=24;i++){
  const t=(c.trimEachEndMetres+
   (length-2*c.trimEachEndMetres)*i/24)/length;
  const p={x:start.x+(end.x-start.x)*t,
   z:start.z+(end.z-start.z)*t};
  for(const line of roads)for(let k=1;k<line.length;k++)
   nearestRoad=Math.min(nearestRoad,pointToSegment(p,line[k-1],line[k]));
  for(const building of houses){
   if(inside(p,building))return null;
   for(let k=1;k<building.length;k++)
    nearestHouse=Math.min(nearestHouse,
     pointToSegment(p,building[k-1],building[k]));
  }
 }
 if(nearestRoad<c.requiredRoadAxisClearanceMetres||
  nearestHouse<c.requiredBuildingClearanceMetres)return null;
 return {
  version:'5.214',regionId,
  sourceOSMWayId:c.footwayId,sourceHash:c.footwayHash,
  originalFootwayNodes:c.sourceNodes,segmentIndex:c.sectionIndex,
  sourceGPS:[{...g[c.sectionIndex]},{...g[c.sectionIndex+1]}],
  originalMetres:+length.toFixed(3),trimMetres:c.trimEachEndMetres,
  modelWalkerCount:c.simulatedWalkers,
  minRoadAxisDistanceMetres:+nearestRoad.toFixed(3),
  minBuildingDistanceMetres:+nearestHouse.toFixed(3),
  routeUnchanged:true,neverCrossesRoad:true,
  npcIsSimulationNotPhotographed:true,surfaceMaterialNotInferred:true,
  newPaths:0,newZebras:0,newBuildings:0,newRoads:0,
  newSidewalks:0,newColliders:0
 };
}
export function makeVisnovaEastWalkSegment5214(plan,toWorld){
 if(plan?.version!=='5.214'||typeof toWorld!=='function')return null;
 const gps=plan.sourceGPS.map(toWorld);
 if(gps.length!==2||gps.some(p=>!Number.isFinite(p?.x)||
  !Number.isFinite(p?.y)))return null;
 const [a,b]=gps,dx=b.x-a.x,dz=b.y-a.y,len=Math.hypot(dx,dz);
 if(Math.abs(len-plan.originalMetres)>.17||
  len<=2*plan.trimMetres+5)return null;
 const unitX=dx/len,unitZ=dz/len,trim=plan.trimMetres;
 return {a:{x:a.x+unitX*trim,y:a.y+unitZ*trim},
  b:{x:b.x-unitX*trim,y:b.y-unitZ*trim},
  len:len-2*trim,width:1.8,wayId:plan.sourceOSMWayId,
  roadClearanceVerified:true,neverCrossesRoad:true,
  originalOSMUnchanged:true};
}
