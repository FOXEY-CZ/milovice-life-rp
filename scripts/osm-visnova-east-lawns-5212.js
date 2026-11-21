/** Milovice RP 5.212 — restrained turf inside TWO original OSM
 * landuse=grass polygons east of the existing Višňová paved footways.
 * Source-locked real polygons; blade positions, species/height/colour
 * are game-art estimates, not photographs or mapped individual plants.
 * No new lawn polygons, shrubs, street furniture, roads or colliders.
 */
export const VISNOVA_EAST_LAWNS_5212=Object.freeze({
 region:'mlada',
 polygons:Object.freeze([
  Object.freeze({id:'1460019772',nodes:14,hash:'8a67941c'}),
  Object.freeze({id:'1460019799',nodes:10,hash:'30aca938'})
 ]),
 spacing:2.55,maxTuftsPerPolygon:75,
 individualPlantsPhotoVerified:false
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
function hashGeometry(g){
 let h=2166136261;
 for(const c of g.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
}
function contains(x,z,poly){
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.z>z)!==(b.z>z)&&
   x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)inside=!inside;
 }
 return inside;
}
function distanceToEdges(x,z,poly){
 let d=Infinity;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length];
  const dx=b.x-a.x,dz=b.z-a.z,sq=dx*dx+dz*dz;
  if(sq<.000001)continue;
  const t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/sq));
  d=Math.min(d,Math.hypot(x-a.x-t*dx,z-a.z-t*dz));
 }
 return d;
}
export function planVisnovaEastLawns5212(ways,{
 regionId,toWorld,roads,buildings,water,excludedLawnIds=[]
}={}){
 const cfg=VISNOVA_EAST_LAWNS_5212;
 if(regionId!==cfg.region||!Array.isArray(ways)||
  typeof toWorld!=='function'||
  !roads?.isClear||!buildings?.isClear||!water?.isClear||
  !Array.isArray(excludedLawnIds))return null;
 const excluded=new Set(excludedLawnIds.map(String));
 const tufts=[],sourceLawnIds=[],skippedExistingLawnIds=[];
 let rejectedRoad=0,rejectedBuilding=0,rejectedWater=0;
 for(const spec of cfg.polygons){
  const matches=ways.filter(w=>String(w?.id)===spec.id);
  if(matches.length!==1)return null;
  const w=matches[0],g=w.geometry,t=w.tags||{};
  if(t.landuse!=='grass'||Object.keys(t).length!==1||
   !Array.isArray(g)||g.length!==spec.nodes||
   g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   hashGeometry(g)!==spec.hash||
   key(g[0])!==key(g.at(-1)))return null;
  sourceLawnIds.push(spec.id);
  if(excluded.has(spec.id)){
   skippedExistingLawnIds.push(spec.id);continue;
  }
  const poly=g.slice(0,-1).map(toWorld)
   .map(p=>({x:p?.x,z:p?.y??p?.z}));
  if(poly.length<3||poly.some(p=>![p.x,p.z].every(Number.isFinite)))
   return null;
  const minX=Math.min(...poly.map(p=>p.x));
  const maxX=Math.max(...poly.map(p=>p.x));
  const minZ=Math.min(...poly.map(p=>p.z));
  const maxZ=Math.max(...poly.map(p=>p.z));
  let accepted=0;
  const spacing=cfg.spacing;
  for(let z=minZ+spacing*.55;z<maxZ-spacing*.45&&
   accepted<cfg.maxTuftsPerPolygon;z+=spacing){
   for(let x=minX+spacing*.55;x<maxX-spacing*.45&&
    accepted<cfg.maxTuftsPerPolygon;x+=spacing){
    const ix=Math.round((x-minX)/spacing),iz=Math.round((z-minZ)/spacing);
    const px=x+(((ix*11+iz*23)%11)-5)*.055;
    const pz=z+(((ix*19+iz*7)%13)-6)*.055;
    if(!contains(px,pz,poly)||distanceToEdges(px,pz,poly)<.85)
     continue;
    if(!roads.isClear(px,pz,.50,.42)){rejectedRoad++;continue;}
    if(!buildings.isClear(px,pz,.70)){rejectedBuilding++;continue;}
    if(!water.isClear(px,pz,.65,.40)){rejectedWater++;continue;}
    const seed=(ix*41+iz*17+Number(spec.id.slice(-4)))>>>0;
    const height=.18+(seed%6)*.026;
    tufts.push({x:px,z:pz,spread:.12+height*.22,height,
     yaw:(seed*2.399963229728653)%6.283185307179586,
     sourceOSMId:spec.id,positionEstimated:true});
    accepted++;
   }
  }
 }
 return {version:'5.212',sourceLawnIds,skippedExistingLawnIds,
  tufts,rejectedRoad,rejectedBuilding,rejectedWater,
  mappedPolygonsPreserved:true,polygonGeometryChanged:false,
  individualPlantsPhotoVerified:false,
  newLawnPolygons:0,newShrubs:0,newRoads:0,newFootways:0,
  newColliders:0,newParkingPlaces:0};
}
