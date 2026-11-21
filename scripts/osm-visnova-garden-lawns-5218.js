/** Milovice RP 5.218 — three MORE original grassy OSM strips on
 * Višňová / Armádní, following previously source-locked 5.212 lawns.
 * MAPPED: polygon outlines and landuse=grass only.
 * UNVERIFIED: blade height, species, colour, precise positions.
 * Do not infer trees, hedges, raised curbs, gardens, paths or furniture.
 * One shared near-field instanced asset and strict spatial guards.
 */
export const VISNOVA_GARDEN_LAWNS_5218=Object.freeze({
 region:'mlada',polygons:Object.freeze([
  Object.freeze({id:'1460019798',nodes:6,hash:'775f191a'}),
  Object.freeze({id:'1460019800',nodes:9,hash:'67035867'}),
  Object.freeze({id:'1460019801',nodes:8,hash:'d8808821'})
 ]),
 spacingMetres:2.30,maxTuftsPerPolygon:65,
 insetMetres:.95,minRoadBuffer:.45,minBuildingBuffer:.70,
 individualPlantsPhotoVerified:false
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const finite=p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon);
function hash(g){
 let h=2166136261;
 for(const c of g.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
}
export function lawnPolygonContains5218(x,z,poly){
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.z>z)!==(b.z>z)&&
   x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)inside=!inside;
 }
 return inside;
}
export function lawnBoundaryDistance5218(x,z,poly){
 let d=Infinity;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length];
  const dx=b.x-a.x,dz=b.z-a.z,ds=dx*dx+dz*dz;
  if(ds<.000001)continue;
  const t=Math.max(0,Math.min(1,
   ((x-a.x)*dx+(z-a.z)*dz)/ds));
  d=Math.min(d,Math.hypot(x-a.x-t*dx,z-a.z-t*dz));
 }
 return d;
}
export function planVisnovaGardenLawns5218(ways,{
 regionId,toWorld,roads,buildings,water,excludedLawnIds=[]
}={}){
 const c=VISNOVA_GARDEN_LAWNS_5218;
 if(regionId!==c.region||!Array.isArray(ways)||
  typeof toWorld!=='function'||typeof roads?.isClear!=='function'||
  typeof buildings?.isClear!=='function'||
  typeof water?.isClear!=='function'||!Array.isArray(excludedLawnIds))
  return null;
 const excluded=new Set(excludedLawnIds.map(String));
 const checked=[];
 for(const spec of c.polygons){
  const matches=ways.filter(w=>String(w?.id)===spec.id);
  if(matches.length!==1)return null;
  const w=matches[0],g=w.geometry,t=w.tags||{};
  if(t.landuse!=='grass'||Object.keys(t).length!==1||
   !Array.isArray(g)||g.length!==spec.nodes||
   g.some(p=>!finite(p))||key(g[0])!==key(g.at(-1))||
   hash(g)!==spec.hash)return null;
  const poly=g.slice(0,-1).map(toWorld)
   .map(p=>({x:p?.x,z:p?.y??p?.z}));
  if(poly.length<3||poly.some(p=>![p.x,p.z].every(Number.isFinite)))
   return null;
  checked.push({id:spec.id,poly});
 }
 const tufts=[],sourceLawnIds=checked.map(w=>w.id),
  skippedPreviouslyDetailed=[],
  byPolygon={};let rejectedRoad=0,rejectedBuilding=0,
  rejectedWater=0,rejectedBoundary=0;
 for(const {id,poly} of checked){
  byPolygon[id]=0;
  if(excluded.has(id)){skippedPreviouslyDetailed.push(id);continue;}
  const xs=poly.map(p=>p.x),zs=poly.map(p=>p.z),
   minX=Math.min(...xs),maxX=Math.max(...xs),
   minZ=Math.min(...zs),maxZ=Math.max(...zs);
  const step=c.spacingMetres;
  for(let z=minZ+step*.5;z<maxZ-step*.5&&
   byPolygon[id]<c.maxTuftsPerPolygon;z+=step){
   for(let x=minX+step*.5;x<maxX-step*.5&&
    byPolygon[id]<c.maxTuftsPerPolygon;x+=step){
    const ix=Math.round((x-minX)/step),
     iz=Math.round((z-minZ)/step),
     px=x+(((ix*13+iz*7)%11)-5)*.044,
     pz=z+(((ix*17+iz*11)%13)-6)*.044;
    if(!lawnPolygonContains5218(px,pz,poly)||
     lawnBoundaryDistance5218(px,pz,poly)<c.insetMetres){
     rejectedBoundary++;continue;
    }
    if(!roads.isClear(px,pz,.5,c.minRoadBuffer)){
     rejectedRoad++;continue;
    }
    if(!buildings.isClear(px,pz,c.minBuildingBuffer)){
     rejectedBuilding++;continue;
    }
    if(!water.isClear(px,pz,.65,.40)){
     rejectedWater++;continue;
    }
    const seed=(ix*43+iz*29+Number(id.slice(-4)))>>>0;
    const height=.18+(seed%7)*.025;
    tufts.push({x:px,z:pz,height,
     spread:.12+height*.20,
     yaw:(seed*2.399963229728653)%6.283185307179586,
     sourceOSMId:id,positionEstimated:true});
    byPolygon[id]++;
   }
  }
 }
 return {
  version:'5.218',sourceLawnIds,skippedPreviouslyDetailed,
  tufts,byPolygon,rejectedRoad,rejectedBuilding,
  rejectedWater,rejectedBoundary,
  mappedPolygonsPreserved:true,polygonGeometryChanged:false,
  individualPlantsPhotoVerified:false,modelSpeciesUnverified:true,
  newLawnPolygons:0,newShrubs:0,newTrees:0,newRoads:0,
  newFootways:0,newColliders:0,newParkingPlaces:0,
  newStreetFurniture:0
 };
}
