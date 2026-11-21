/** Milovice RP 5.213: a simulated resident walks only one safe, original
 * segment of the mapped Višňová paved sidewalk. This is gameplay traffic,
 * NOT a claim that a pedestrian was seen in photography.
 *
 * Footway 1044078124 is already used for the 5.204/5.205 painted pavement.
 * The selected ORIGINAL vertex interval 1 -> 2 has ~52.25 m. Its 4 m
 * endpoint trims keep the actor away from mapped junctions; source geometry,
 * carriageways, street furniture and sidewalks remain unchanged.
 */
export const VISNOVA_SIDEWALK_WALKER_5213=Object.freeze({
 region:'mlada',id:'1044078124',hash:'63d3e54d',nodes:9,
 segmentIndex:1,trimMetres:4,modelWalkers:1,
 roadCentreClearanceMetres:6.5,buildingClearanceMetres:3.5
});
function hashGeometry(g){
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
}
const toMetric=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const distance=(p,a,b)=>{
 const dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz;
 const t=l2>.000001?Math.max(0,Math.min(1,
  ((p.x-a.x)*dx+(p.z-a.z)*dz)/l2)):0;
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
export function planVisnovaSidewalkWalker5213({regionId,ways,buildings}={}){
 const c=VISNOVA_SIDEWALK_WALKER_5213;
 if(regionId!==c.region||!Array.isArray(ways)||ways.length<2||
  !Array.isArray(buildings)||buildings.length===0)return null;
 const matches=ways.filter(w=>String(w?.id)===c.id);
 if(matches.length!==1)return null;
 const w=matches[0],t=w.tags||{},g=w.geometry;
 if(t.highway!=='footway'||t.footway!=='sidewalk'||
  t.lit!=='yes'||t.surface!=='paving_stones'||
  Object.keys(t).some(k=>!['highway','footway','lit','surface'].includes(k))||
  !Array.isArray(g)||g.length!==c.nodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hashGeometry(g)!==c.hash)return null;
 const p=toMetric(g[c.segmentIndex]),q=toMetric(g[c.segmentIndex+1]);
 const len=Math.hypot(q.x-p.x,q.z-p.z);
 if(len<52||len>53)return null;
 const roadTypes=new Set(['residential','service','primary','secondary',
  'tertiary','unclassified','living_street','pedestrian','track']);
 const mappedRoads=ways.filter(x=>roadTypes.has(x?.tags?.highway)&&
  Array.isArray(x.geometry)&&x.geometry.length>=2&&
  x.geometry.every(a=>Number.isFinite(a?.lat)&&Number.isFinite(a?.lon)))
  .map(w=>w.geometry.map(toMetric));
 const mappedBuildings=buildings.filter(x=>x?.tags?.building&&
  Array.isArray(x.geometry)&&x.geometry.length>=4&&
  x.geometry.every(a=>Number.isFinite(a?.lat)&&Number.isFinite(a?.lon)))
  .map(w=>w.geometry.map(toMetric));
 if(mappedRoads.length===0||mappedBuildings.length===0)return null;
 let roadClear=Infinity,buildingClear=Infinity;
 // Check the entire TRIMMED actor course, not just its endpoints.
 for(let i=0;i<=24;i++){
  const at=(c.trimMetres+(len-2*c.trimMetres)*i/24)/len;
  const pos={x:p.x+(q.x-p.x)*at,z:p.z+(q.z-p.z)*at};
  for(const line of mappedRoads){
   for(let j=1;j<line.length;j++){
    roadClear=Math.min(roadClear,distance(pos,line[j-1],line[j]));
   }
  }
  for(const outline of mappedBuildings){
   if(inside(pos,outline))return null;
   for(let j=1;j<outline.length;j++)
    buildingClear=Math.min(buildingClear,distance(pos,outline[j-1],outline[j]));
  }
 }
 if(roadClear<c.roadCentreClearanceMetres||
  buildingClear<c.buildingClearanceMetres)return null;
 return {version:'5.213',regionId,sourceFootwayId:c.id,
  sourceGeometryHash:c.hash,sourceNodes:c.nodes,
  sourceSegmentIndex:c.segmentIndex,
  routeOriginalGPS:[{...g[c.segmentIndex]},{...g[c.segmentIndex+1]}],
  originalSegmentMetres:+len.toFixed(3),
  trimEachEndMetres:c.trimMetres,
  modelWalkerCount:c.modelWalkers,
  minMappedRoadDistanceMetres:+roadClear.toFixed(3),
  minMappedBuildingDistanceMetres:+buildingClear.toFixed(3),
  modelWalkerIsSimulation:true,sourceFootwayUntouched:true,
  neverCrossesRoad:true,newPedestrianLinks:0,newCrossings:0,
  newRoads:0,newSidewalkMeshes:0,newColliders:0};
}
export function makeVisnovaSidewalkSegment5213(plan,toWorld){
 if(plan?.version!=='5.213'||typeof toWorld!=='function')return null;
 const [a,b]=plan.routeOriginalGPS.map(toWorld);
 if(![a?.x,a?.y,b?.x,b?.y].every(Number.isFinite))return null;
 const dx=b.x-a.x,dz=b.y-a.y,len=Math.hypot(dx,dz);
 if(Math.abs(len-plan.originalSegmentMetres)>.16||
  len<plan.trimEachEndMetres*2+15)return null;
 const trim=plan.trimEachEndMetres,ux=dx/len,uz=dz/len;
 return {a:{x:a.x+ux*trim,y:a.y+uz*trim},
  b:{x:b.x-ux*trim,y:b.y-uz*trim},
  len:len-2*trim,width:1.8,wayId:plan.sourceFootwayId,
  originalSourceLength:len,roadClearanceVerified:true,
  neverCrossesRoad:true,noAddedRoadGeometry:true};
}
